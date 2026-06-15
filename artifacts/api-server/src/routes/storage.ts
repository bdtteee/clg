import { Router, type IRouter, type Request, type Response } from "express";
import { z } from "zod";
import { randomUUID } from "crypto";
import { requireAuth, type AuthenticatedRequest } from "../middlewares/auth.js";
import {
  ALLOWED_UPLOAD_TYPES,
  ALLOWED_UPLOAD_EXTENSIONS,
  MAX_UPLOAD_BYTES,
  isSafeObjectPath,
} from "../lib/validate.js";

const router: IRouter = Router();

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const BUCKET = "kyc-documents";

const supabaseHeaders = {
  "Authorization": `Bearer ${SERVICE_ROLE_KEY}`,
  "apikey": SERVICE_ROLE_KEY,
  "Content-Type": "application/json",
};

const RequestUploadUrlBody = z.object({
  name: z.string().min(1).max(255),
  size: z.number().int().positive().max(MAX_UPLOAD_BYTES),
  contentType: z.string().min(1).max(127),
});

/**
 * POST /storage/uploads/request-url
 * Requires auth. Returns a Supabase signed upload URL + objectPath.
 */
router.post("/storage/uploads/request-url", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const parsed = RequestUploadUrlBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Missing or invalid fields: name, size, contentType required" });
    return;
  }

  const { name, size, contentType } = parsed.data;

  if (!ALLOWED_UPLOAD_TYPES.has(contentType.toLowerCase())) {
    res.status(415).json({ error: "Unsupported file type. Upload a JPG, PNG, or PDF." });
    return;
  }
  if (size > MAX_UPLOAD_BYTES) {
    res.status(413).json({ error: "File too large. Maximum size is 10 MB." });
    return;
  }
  const ext = name.includes(".") ? (name.split(".").pop() || "").toLowerCase() : "";
  if (!ALLOWED_UPLOAD_EXTENSIONS.has(ext)) {
    res.status(415).json({ error: "Unsupported file. Allowed: JPG, PNG, PDF." });
    return;
  }

  try {
    const objectPath = `uploads/${randomUUID()}.${ext}`;

    // Create a signed upload URL via Supabase Storage API
    const response = await fetch(
      `${SUPABASE_URL}/storage/v1/object/upload/sign/${BUCKET}/${objectPath}`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${SERVICE_ROLE_KEY}`,
          "apikey": SERVICE_ROLE_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ expiresIn: 900 }),
      }
    );

    if (!response.ok) {
      const err = await response.text();
      console.error("Supabase signed URL error:", err);
      res.status(500).json({ error: "Failed to generate upload URL" });
      return;
    }

    const { url } = (await response.json()) as { url: string };

    // The signed upload URL returned by Supabase
    const uploadURL = `${SUPABASE_URL}/storage/v1${url}`;

    res.json({
      uploadURL,
      objectPath: `/objects/${objectPath}`,
      metadata: { name, size, contentType },
    });
  } catch (error) {
    console.error("Error generating upload URL:", error);
    res.status(500).json({ error: "Failed to generate upload URL" });
  }
});

/**
 * GET /storage/objects/*path
 * Serves private uploaded objects via a Supabase signed download URL.
 * Protected by auth.
 */
router.get("/storage/objects/*path", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const raw = req.params.path;
    const wildcardPath = Array.isArray(raw) ? raw.join("/") : raw;

    if (!isSafeObjectPath(wildcardPath)) {
      res.status(400).json({ error: "Invalid object path" });
      return;
    }

    // Generate a signed download URL (valid for 1 hour)
    const response = await fetch(
      `${SUPABASE_URL}/storage/v1/object/sign/${BUCKET}/${wildcardPath}`,
      {
        method: "POST",
        headers: supabaseHeaders,
        body: JSON.stringify({ expiresIn: 3600 }),
      }
    );

    if (!response.ok) {
      res.status(404).json({ error: "Object not found" });
      return;
    }

    const { signedURL } = (await response.json()) as { signedURL: string };
    const downloadUrl = `${SUPABASE_URL}/storage/v1${signedURL}`;

    // Redirect to the signed URL
    res.redirect(302, downloadUrl);
  } catch (error) {
    console.error("Error serving object:", error);
    res.status(500).json({ error: "Failed to serve object" });
  }
});

export default router;
