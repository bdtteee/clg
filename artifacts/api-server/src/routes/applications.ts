import { Router } from "express";
import { db } from "@workspace/db";
import {
  applicationsTable,
  notificationsTable,
  kycDocumentsTable,
} from "@workspace/db/schema";
import { eq, and } from "drizzle-orm";
import { requireAuth, AuthenticatedRequest } from "../middlewares/auth.js";
import {
  getMpesaConfig,
  initiateStkPush,
  normalizeMpesaPhone,
  processingFeeKes,
} from "../lib/mpesa.js";
import { cleanString, isEmail, toFiniteNumber, mpesaAccountRef } from "../lib/validate.js";

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
    const type = cleanString(req.body.type, 16);
    const category = cleanString(req.body.category, 16);
    const fullName = cleanString(req.body.fullName, 120);
    const email = cleanString(req.body.email, 254);
    const phoneNumber = cleanString(req.body.phoneNumber, 32);
    const country = cleanString(req.body.country, 60) || "Kenya";
    const purposeText = cleanString(req.body.purposeOfFunds ?? req.body.reason, 2000);
    const nationalIdNumber = cleanString(req.body.nationalIdNumber ?? req.body.nationalId, 40);
    const employmentStatus = cleanString(req.body.employmentStatus, 80);
    const businessName = cleanString(req.body.businessName, 160);
    const registrationNumber = cleanString(req.body.registrationNumber, 60);
    const kraPin = cleanString(req.body.kraPin, 40);
    const amount = toFiniteNumber(req.body.amountRequested);
    const monthlyIncome = toFiniteNumber(req.body.monthlyIncome);
    const annualRevenue = toFiniteNumber(req.body.annualRevenue);

    if (type !== "loan" && type !== "grant") {
      res.status(400).json({ error: "Invalid application type" }); return;
    }
    if (category !== "personal" && category !== "business") {
      res.status(400).json({ error: "Invalid application category" }); return;
    }
    if (!fullName || !email || !phoneNumber || !purposeText) {
      res.status(400).json({ error: "Missing required fields" }); return;
    }
    if (!isEmail(email)) {
      res.status(400).json({ error: "Enter a valid email address" }); return;
    }
    if (amount === undefined || amount <= 0 || amount > 1_000_000) {
      res.status(400).json({ error: "Enter a valid requested amount" }); return;
    }

    // Every submitted application receives an instant 85% pre-approval.
    const preapprovedAmount = (amount * 0.85).toFixed(2);

    const [app] = await db
      .insert(applicationsTable)
      .values({
        userId: req.userId!,
        type, category, fullName, email, phoneNumber,
        country,
        reason: purposeText,
        amountRequested: amount.toFixed(2),
        preapprovedAmount,
        status: "pending",
        nationalIdNumber: nationalIdNumber ?? null,
        employmentStatus: employmentStatus ?? null,
        monthlyIncome: monthlyIncome !== undefined ? monthlyIncome.toFixed(2) : null,
        businessName: businessName ?? null,
        registrationNumber: registrationNumber ?? null,
        kraPin: kraPin ?? null,
        annualRevenue: annualRevenue !== undefined ? annualRevenue.toFixed(2) : null,
      })
      .returning();

    // No notification sent here — only sent after payment is submitted

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
    if (isNaN(id)) { res.status(400).json({ error: "Invalid application ID" }); return; }

    const [app] = await db
      .select()
      .from(applicationsTable)
      .where(and(eq(applicationsTable.id, id), eq(applicationsTable.userId, req.userId!)))
      .limit(1);

    if (!app) { res.status(404).json({ error: "Application not found" }); return; }

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

// PATCH /api/applications/:id — edit details of a pending (incomplete) application
router.patch("/:id", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) { res.status(400).json({ error: "Invalid application ID" }); return; }

    const [existing] = await db
      .select()
      .from(applicationsTable)
      .where(and(eq(applicationsTable.id, id), eq(applicationsTable.userId, req.userId!)))
      .limit(1);

    if (!existing) { res.status(404).json({ error: "Application not found" }); return; }
    if (existing.status !== "pending") {
      res.status(403).json({ error: "Only pending applications can be edited" });
      return;
    }

    const fullName = cleanString(req.body.fullName, 120);
    const email = cleanString(req.body.email, 254);
    const phoneNumber = cleanString(req.body.phoneNumber, 32);
    const country = cleanString(req.body.country, 60);
    const purposeText = cleanString(req.body.purposeOfFunds ?? req.body.reason, 2000);
    const nationalIdNumber = cleanString(req.body.nationalIdNumber, 40);
    const employmentStatus = cleanString(req.body.employmentStatus, 80);
    const businessName = cleanString(req.body.businessName, 160);
    const registrationNumber = cleanString(req.body.registrationNumber, 60);
    const kraPin = cleanString(req.body.kraPin, 40);
    const amount = toFiniteNumber(req.body.amountRequested);
    const monthlyIncome = toFiniteNumber(req.body.monthlyIncome);
    const annualRevenue = toFiniteNumber(req.body.annualRevenue);

    if (email !== undefined && !isEmail(email)) {
      res.status(400).json({ error: "Enter a valid email address" }); return;
    }
    if (req.body.amountRequested !== undefined && (amount === undefined || amount <= 0 || amount > 1_000_000)) {
      res.status(400).json({ error: "Enter a valid requested amount" }); return;
    }

    const preapprovedAmount =
      amount !== undefined ? (amount * 0.85).toFixed(2) : existing.preapprovedAmount;

    const [app] = await db
      .update(applicationsTable)
      .set({
        ...(fullName !== undefined && { fullName }),
        ...(email !== undefined && { email }),
        ...(phoneNumber !== undefined && { phoneNumber }),
        ...(country !== undefined && { country }),
        ...(purposeText !== undefined && { reason: purposeText }),
        ...(amount !== undefined && {
          amountRequested: amount.toFixed(2),
          preapprovedAmount,
        }),
        ...(nationalIdNumber !== undefined && { nationalIdNumber }),
        ...(employmentStatus !== undefined && { employmentStatus }),
        ...(monthlyIncome !== undefined && { monthlyIncome: monthlyIncome.toFixed(2) }),
        ...(businessName !== undefined && { businessName }),
        ...(registrationNumber !== undefined && { registrationNumber }),
        ...(kraPin !== undefined && { kraPin }),
        ...(annualRevenue !== undefined && { annualRevenue: annualRevenue.toFixed(2) }),
        updatedAt: new Date(),
      })
      .where(eq(applicationsTable.id, id))
      .returning();

    res.json({
      ...app,
      amountRequested: parseFloat(app.amountRequested),
      preapprovedAmount: app.preapprovedAmount ? parseFloat(app.preapprovedAmount) : null,
      monthlyIncome: app.monthlyIncome ? parseFloat(app.monthlyIncome) : null,
      annualRevenue: app.annualRevenue ? parseFloat(app.annualRevenue) : null,
    });
  } catch (error) {
    console.error("Update application error:", error);
    res.status(500).json({ error: "Failed to update application" });
  }
});

router.post("/:id/payment", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) { res.status(400).json({ error: "Invalid application ID" }); return; }

    const { paymentCode } = req.body;
    if (!paymentCode?.trim()) { res.status(400).json({ error: "Payment code is required" }); return; }

    const [existing] = await db
      .select()
      .from(applicationsTable)
      .where(and(eq(applicationsTable.id, id), eq(applicationsTable.userId, req.userId!)))
      .limit(1);

    if (!existing) { res.status(404).json({ error: "Application not found" }); return; }

    const [app] = await db
      .update(applicationsTable)
      .set({ paymentCode: paymentCode.trim(), status: "under_review", updatedAt: new Date() })
      .where(eq(applicationsTable.id, id))
      .returning();

    // Notify user that application is now under review — only after payment
    await db.insert(notificationsTable).values({
      userId: req.userId!,
      message: `Your ${app.category} ${app.type} application #${app.id} is now complete and under review. Expected response in 2–3 business days.`,
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

// POST /api/applications/:id/stk-push — trigger an M-Pesa STK push for the fee
router.post("/:id/stk-push", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) { res.status(400).json({ error: "Invalid application ID" }); return; }

    const config = getMpesaConfig();
    if (!config) {
      res.status(503).json({
        error: "M-Pesa payments are not configured. Please enter your payment code manually.",
      });
      return;
    }

    const [app] = await db
      .select()
      .from(applicationsTable)
      .where(and(eq(applicationsTable.id, id), eq(applicationsTable.userId, req.userId!)))
      .limit(1);
    if (!app) { res.status(404).json({ error: "Application not found" }); return; }

    const phone = normalizeMpesaPhone(req.body?.phoneNumber || app.phoneNumber);
    if (!phone) {
      res.status(400).json({ error: "Enter a valid Safaricom number (e.g. 07XX XXX XXX)." });
      return;
    }

    const amount = processingFeeKes(app.type, app.category);

    const result = await initiateStkPush(config, {
      phone,
      amount,
      // Payment reference is the customer's name (alphanumeric, max 12 chars).
      accountReference: mpesaAccountRef(app.fullName, `APP${app.id}`),
      description: `Fee APP-${app.id}`,
    });

    await db
      .update(applicationsTable)
      .set({ mpesaCheckoutRequestId: result.CheckoutRequestID || null, updatedAt: new Date() })
      .where(eq(applicationsTable.id, id));

    res.json({
      checkoutRequestId: result.CheckoutRequestID,
      message: result.CustomerMessage || "Payment prompt sent. Enter your M-Pesa PIN on your phone.",
    });
  } catch (error) {
    console.error("STK push error:", error);
    const message =
      error instanceof Error ? error.message : "Could not initiate M-Pesa payment.";
    res.status(502).json({ error: message });
  }
});

// GET /api/applications/:id/kyc-documents
router.get("/:id/kyc-documents", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) { res.status(400).json({ error: "Invalid application ID" }); return; }

    const [app] = await db
      .select()
      .from(applicationsTable)
      .where(and(eq(applicationsTable.id, id), eq(applicationsTable.userId, req.userId!)))
      .limit(1);

    if (!app) { res.status(404).json({ error: "Application not found" }); return; }

    const docs = await db.select().from(kycDocumentsTable).where(eq(kycDocumentsTable.applicationId, id));
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
    if (isNaN(id)) { res.status(400).json({ error: "Invalid application ID" }); return; }

    const [app] = await db
      .select()
      .from(applicationsTable)
      .where(and(eq(applicationsTable.id, id), eq(applicationsTable.userId, req.userId!)))
      .limit(1);

    if (!app) { res.status(404).json({ error: "Application not found" }); return; }

    const { documents } = req.body;
    if (!documents || !Array.isArray(documents)) {
      res.status(400).json({ error: "documents array is required" });
      return;
    }

    // Replace all docs for this application
    await db.delete(kycDocumentsTable).where(eq(kycDocumentsTable.applicationId, id));

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
          fileName: doc.fileName || null,
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
