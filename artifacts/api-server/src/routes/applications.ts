import { Router } from "express";
import { db } from "@workspace/db";
import {
  applicationsTable,
  notificationsTable,
  kycDocumentsTable,
} from "@workspace/db/schema";
import { eq, and } from "drizzle-orm";
import { requireAuth, AuthenticatedRequest } from "../middlewares/auth.js";

const router = Router();

router.get("/", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const apps = await db
      .select()
      .from(applicationsTable)
      .where(eq(applicationsTable.userId, req.userId!))
      .orderBy(applicationsTable.createdAt);

    res.json(
      apps.map((a) => ({
        ...a,
        amountRequested: parseFloat(a.amountRequested),
        preapprovedAmount: a.preapprovedAmount ? parseFloat(a.preapprovedAmount) : null,
        monthlyIncome: a.monthlyIncome ? parseFloat(a.monthlyIncome) : null,
        annualRevenue: a.annualRevenue ? parseFloat(a.annualRevenue) : null,
      }))
    );
  } catch (error) {
    console.error("Get applications error:", error);
    res.status(500).json({ error: "Failed to fetch applications" });
  }
});

router.post("/", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const {
      type,
      category,
      amountRequested,
      fullName,
      email,
      phoneNumber,
      country,
      reason,
      purposeOfFunds,
      nationalIdNumber,
      employmentStatus,
      monthlyIncome,
      businessName,
      registrationNumber,
      kraPin,
      annualRevenue,
    } = req.body;

    const purposeText = purposeOfFunds || reason;

    if (!type || !category || !amountRequested || !purposeText || !fullName || !email || !phoneNumber) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    const preapprovedAmount =
      type === "loan" ? (parseFloat(amountRequested) * 0.65).toFixed(2) : null;

    const [app] = await db
      .insert(applicationsTable)
      .values({
        userId: req.userId!,
        type,
        category,
        fullName,
        email,
        phoneNumber,
        country: country || "Kenya",
        reason: purposeText,
        amountRequested: parseFloat(amountRequested).toFixed(2),
        preapprovedAmount,
        status: "pending",
        nationalIdNumber,
        employmentStatus,
        monthlyIncome: monthlyIncome ? parseFloat(monthlyIncome).toFixed(2) : null,
        businessName,
        registrationNumber,
        kraPin,
        annualRevenue: annualRevenue ? parseFloat(annualRevenue).toFixed(2) : null,
      })
      .returning();

    await db.insert(notificationsTable).values({
      userId: req.userId!,
      message: `Your ${category} ${type} application #${app.id} has been received and is under review.`,
      read: false,
    });

    res.status(201).json({
      ...app,
      amountRequested: parseFloat(app.amountRequested),
      preapprovedAmount: app.preapprovedAmount ? parseFloat(app.preapprovedAmount) : null,
      monthlyIncome: app.monthlyIncome ? parseFloat(app.monthlyIncome) : null,
      annualRevenue: app.annualRevenue ? parseFloat(app.annualRevenue) : null,
    });
  } catch (error) {
    console.error("Create application error:", error);
    res.status(500).json({ error: "Failed to create application" });
  }
});

router.get("/:id", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid application ID" });
      return;
    }

    const [app] = await db
      .select()
      .from(applicationsTable)
      .where(
        and(
          eq(applicationsTable.id, id),
          eq(applicationsTable.userId, req.userId!)
        )
      )
      .limit(1);

    if (!app) {
      res.status(404).json({ error: "Application not found" });
      return;
    }

    res.json({
      ...app,
      amountRequested: parseFloat(app.amountRequested),
      preapprovedAmount: app.preapprovedAmount ? parseFloat(app.preapprovedAmount) : null,
      monthlyIncome: app.monthlyIncome ? parseFloat(app.monthlyIncome) : null,
      annualRevenue: app.annualRevenue ? parseFloat(app.annualRevenue) : null,
    });
  } catch (error) {
    console.error("Get application error:", error);
    res.status(500).json({ error: "Failed to fetch application" });
  }
});

router.post("/:id/payment", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid application ID" });
      return;
    }

    const { paymentCode } = req.body;
    if (!paymentCode || !paymentCode.trim()) {
      res.status(400).json({ error: "Payment code is required" });
      return;
    }

    const [existing] = await db
      .select()
      .from(applicationsTable)
      .where(
        and(
          eq(applicationsTable.id, id),
          eq(applicationsTable.userId, req.userId!)
        )
      )
      .limit(1);

    if (!existing) {
      res.status(404).json({ error: "Application not found" });
      return;
    }

    const [app] = await db
      .update(applicationsTable)
      .set({
        paymentCode: paymentCode.trim(),
        status: "under_review",
        updatedAt: new Date(),
      })
      .where(eq(applicationsTable.id, id))
      .returning();

    await db.insert(notificationsTable).values({
      userId: req.userId!,
      message: `Payment received for application #${app.id}. Your application is now under review. Expected response in 2–3 business days.`,
      read: false,
    });

    res.json({
      ...app,
      amountRequested: parseFloat(app.amountRequested),
      preapprovedAmount: app.preapprovedAmount ? parseFloat(app.preapprovedAmount) : null,
      monthlyIncome: app.monthlyIncome ? parseFloat(app.monthlyIncome) : null,
      annualRevenue: app.annualRevenue ? parseFloat(app.annualRevenue) : null,
    });
  } catch (error) {
    console.error("Submit payment error:", error);
    res.status(500).json({ error: "Failed to submit payment" });
  }
});

// GET /api/applications/:id/kyc-documents
router.get("/:id/kyc-documents", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid application ID" });
      return;
    }

    // Verify the application belongs to this user
    const [app] = await db
      .select()
      .from(applicationsTable)
      .where(and(eq(applicationsTable.id, id), eq(applicationsTable.userId, req.userId!)))
      .limit(1);

    if (!app) {
      res.status(404).json({ error: "Application not found" });
      return;
    }

    const docs = await db
      .select()
      .from(kycDocumentsTable)
      .where(eq(kycDocumentsTable.applicationId, id));

    res.json(docs);
  } catch (error) {
    console.error("Get KYC documents error:", error);
    res.status(500).json({ error: "Failed to fetch KYC documents" });
  }
});

// POST /api/applications/:id/kyc-documents
router.post("/:id/kyc-documents", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid application ID" });
      return;
    }

    // Verify the application belongs to this user
    const [app] = await db
      .select()
      .from(applicationsTable)
      .where(and(eq(applicationsTable.id, id), eq(applicationsTable.userId, req.userId!)))
      .limit(1);

    if (!app) {
      res.status(404).json({ error: "Application not found" });
      return;
    }

    const { documents } = req.body;
    if (!documents || !Array.isArray(documents)) {
      res.status(400).json({ error: "documents array is required" });
      return;
    }

    // Delete existing docs for this application and re-insert
    await db
      .delete(kycDocumentsTable)
      .where(eq(kycDocumentsTable.applicationId, id));

    const inserted = [];
    for (const doc of documents) {
      if (!doc.documentType) continue;
      const [row] = await db
        .insert(kycDocumentsTable)
        .values({
          userId: req.userId!,
          applicationId: id,
          documentType: doc.documentType,
          fileUrl: doc.fileUrl || null,
          status: doc.fileUrl ? "Pending" : "Not Uploaded",
        })
        .returning();
      inserted.push(row);
    }

    res.status(201).json(inserted);
  } catch (error) {
    console.error("Save KYC documents error:", error);
    res.status(500).json({ error: "Failed to save KYC documents" });
  }
});

export default router;
