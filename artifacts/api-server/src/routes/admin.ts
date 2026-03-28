import { Router } from "express";
import { db } from "@workspace/db";
import {
  applicationsTable,
  notificationsTable,
  adminActionsTable,
  usersTable,
  manualPaymentsTable,
  kycDocumentsTable,
} from "@workspace/db/schema";
import { eq, count, desc } from "drizzle-orm";
import { requireAdmin, AuthenticatedRequest } from "../middlewares/auth.js";

const router = Router();

router.get("/applications", requireAdmin, async (req: AuthenticatedRequest, res) => {
  try {
    const { type, status } = req.query;

    const allApps = await db
      .select({
        app: applicationsTable,
        user: {
          email: usersTable.email,
          fullName: usersTable.fullName,
        },
      })
      .from(applicationsTable)
      .innerJoin(usersTable, eq(applicationsTable.userId, usersTable.id))
      .orderBy(desc(applicationsTable.createdAt));

    let filtered = allApps;
    if (type) {
      filtered = filtered.filter((r) => r.app.type === type);
    }
    if (status) {
      filtered = filtered.filter((r) => r.app.status === status);
    }

    res.json(
      filtered.map(({ app, user }) => ({
        ...app,
        amountRequested: parseFloat(app.amountRequested),
        preapprovedAmount: app.preapprovedAmount
          ? parseFloat(app.preapprovedAmount)
          : null,
        monthlyIncome: app.monthlyIncome ? parseFloat(app.monthlyIncome) : null,
        annualRevenue: app.annualRevenue ? parseFloat(app.annualRevenue) : null,
        userEmail: user.email,
        userFullName: user.fullName,
      }))
    );
  } catch (error) {
    console.error("Admin get applications error:", error);
    res.status(500).json({ error: "Failed to fetch applications" });
  }
});

// GET /api/admin/applications/:id/kyc-documents
router.get("/applications/:id/kyc-documents", requireAdmin, async (req: AuthenticatedRequest, res) => {
  try {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid application ID" });
      return;
    }

    const docs = await db
      .select()
      .from(kycDocumentsTable)
      .where(eq(kycDocumentsTable.applicationId, id));

    res.json(docs);
  } catch (error) {
    console.error("Admin get KYC documents error:", error);
    res.status(500).json({ error: "Failed to fetch KYC documents" });
  }
});

// PATCH /api/admin/kyc-documents/:id
router.patch("/kyc-documents/:id", requireAdmin, async (req: AuthenticatedRequest, res) => {
  try {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid document ID" });
      return;
    }

    const { status, rejectionReason } = req.body;
    if (!status) {
      res.status(400).json({ error: "status is required" });
      return;
    }

    const [doc] = await db
      .update(kycDocumentsTable)
      .set({
        status,
        rejectionReason: rejectionReason || null,
        updatedAt: new Date(),
      })
      .where(eq(kycDocumentsTable.id, id))
      .returning();

    if (!doc) {
      res.status(404).json({ error: "Document not found" });
      return;
    }

    res.json(doc);
  } catch (error) {
    console.error("Update KYC document error:", error);
    res.status(500).json({ error: "Failed to update KYC document" });
  }
});

router.post(
  "/applications/:id/approve",
  requireAdmin,
  async (req: AuthenticatedRequest, res) => {
    try {
      const id = parseInt(req.params.id as string);
      if (isNaN(id)) {
        res.status(400).json({ error: "Invalid application ID" });
        return;
      }

      const { reason } = req.body;
      if (!reason || !reason.trim()) {
        res.status(400).json({ error: "Reason is required" });
        return;
      }

      const [app] = await db
        .update(applicationsTable)
        .set({
          status: "approved",
          adminComment: reason.trim(),
          updatedAt: new Date(),
        })
        .where(eq(applicationsTable.id, id))
        .returning();

      if (!app) {
        res.status(404).json({ error: "Application not found" });
        return;
      }

      await db.insert(adminActionsTable).values({
        applicationId: id,
        adminId: req.userId!,
        action: "approved",
        reason: reason.trim(),
      });

      await db.insert(notificationsTable).values({
        userId: app.userId,
        message: `Congratulations! Your ${app.category} ${app.type} application #${app.id} has been approved. Disbursement will occur within 14 days. Note: ${reason}`,
        read: false,
      });

      res.json({
        ...app,
        amountRequested: parseFloat(app.amountRequested),
        preapprovedAmount: app.preapprovedAmount
          ? parseFloat(app.preapprovedAmount)
          : null,
        monthlyIncome: app.monthlyIncome ? parseFloat(app.monthlyIncome) : null,
        annualRevenue: app.annualRevenue ? parseFloat(app.annualRevenue) : null,
      });
    } catch (error) {
      console.error("Approve application error:", error);
      res.status(500).json({ error: "Failed to approve application" });
    }
  }
);

router.post(
  "/applications/:id/reject",
  requireAdmin,
  async (req: AuthenticatedRequest, res) => {
    try {
      const id = parseInt(req.params.id as string);
      if (isNaN(id)) {
        res.status(400).json({ error: "Invalid application ID" });
        return;
      }

      const { reason } = req.body;
      if (!reason || !reason.trim()) {
        res.status(400).json({ error: "Reason is required" });
        return;
      }

      const [app] = await db
        .update(applicationsTable)
        .set({
          status: "rejected",
          adminComment: reason.trim(),
          updatedAt: new Date(),
        })
        .where(eq(applicationsTable.id, id))
        .returning();

      if (!app) {
        res.status(404).json({ error: "Application not found" });
        return;
      }

      await db.insert(adminActionsTable).values({
        applicationId: id,
        adminId: req.userId!,
        action: "rejected",
        reason: reason.trim(),
      });

      await db.insert(notificationsTable).values({
        userId: app.userId,
        message: `Your ${app.category} ${app.type} application #${app.id} was not approved. Reason: ${reason}. You may re-apply or contact support at info@cardoneloansgrants.org`,
        read: false,
      });

      res.json({
        ...app,
        amountRequested: parseFloat(app.amountRequested),
        preapprovedAmount: app.preapprovedAmount
          ? parseFloat(app.preapprovedAmount)
          : null,
        monthlyIncome: app.monthlyIncome ? parseFloat(app.monthlyIncome) : null,
        annualRevenue: app.annualRevenue ? parseFloat(app.annualRevenue) : null,
      });
    } catch (error) {
      console.error("Reject application error:", error);
      res.status(500).json({ error: "Failed to reject application" });
    }
  }
);

router.patch(
  "/applications/:id/update",
  requireAdmin,
  async (req: AuthenticatedRequest, res) => {
    try {
      const id = parseInt(req.params.id as string);
      if (isNaN(id)) {
        res.status(400).json({ error: "Invalid application ID" });
        return;
      }

      const { status, approvedAmount, assignedPartner, disbursementDate, adminComment } = req.body;

      const updateData: Record<string, unknown> = { updatedAt: new Date() };
      if (status !== undefined) updateData.status = status;
      if (approvedAmount !== undefined) updateData.approvedAmount = approvedAmount;
      if (assignedPartner !== undefined) updateData.assignedPartner = assignedPartner;
      if (disbursementDate !== undefined) updateData.disbursementDate = disbursementDate;
      if (adminComment !== undefined) updateData.adminComment = adminComment;

      const [app] = await db
        .update(applicationsTable)
        .set(updateData)
        .where(eq(applicationsTable.id, id))
        .returning();

      if (!app) {
        res.status(404).json({ error: "Application not found" });
        return;
      }

      await db.insert(adminActionsTable).values({
        applicationId: id,
        adminId: req.userId!,
        action: "reviewed",
        reason: `Updated: ${Object.keys(updateData).filter(k => k !== "updatedAt").join(", ")}`,
      });

      if (status && (status === "approved" || status === "rejected")) {
        await db.insert(notificationsTable).values({
          userId: app.userId,
          message:
            status === "approved"
              ? `Your ${app.category} ${app.type} application #${app.id} has been approved.`
              : `Your ${app.category} ${app.type} application #${app.id} was not approved.`,
          read: false,
        });
      }

      res.json({
        ...app,
        amountRequested: parseFloat(app.amountRequested),
        approvedAmount: app.approvedAmount ? parseFloat(app.approvedAmount) : null,
        preapprovedAmount: app.preapprovedAmount ? parseFloat(app.preapprovedAmount) : null,
        monthlyIncome: app.monthlyIncome ? parseFloat(app.monthlyIncome) : null,
        annualRevenue: app.annualRevenue ? parseFloat(app.annualRevenue) : null,
      });
    } catch (error) {
      console.error("Update application error:", error);
      res.status(500).json({ error: "Failed to update application" });
    }
  }
);

router.get("/payments", requireAdmin, async (req: AuthenticatedRequest, res) => {
  try {
    const payments = await db
      .select()
      .from(manualPaymentsTable)
      .orderBy(desc(manualPaymentsTable.createdAt));

    res.json(
      payments.map((p) => ({
        ...p,
        amountKes: parseFloat(p.amountKes),
      }))
    );
  } catch (error) {
    console.error("Admin get payments error:", error);
    res.status(500).json({ error: "Failed to fetch payments" });
  }
});

router.post(
  "/payments/:id/verify",
  requireAdmin,
  async (req: AuthenticatedRequest, res) => {
    try {
      const id = parseInt(req.params.id as string);
      if (isNaN(id)) {
        res.status(400).json({ error: "Invalid payment ID" });
        return;
      }

      const [payment] = await db
        .update(manualPaymentsTable)
        .set({
          isVerified: true,
          verifiedBy: req.userId!,
          updatedAt: new Date(),
        })
        .where(eq(manualPaymentsTable.id, id))
        .returning();

      if (!payment) {
        res.status(404).json({ error: "Payment not found" });
        return;
      }

      if (payment.applicationId) {
        const [app] = await db
          .update(applicationsTable)
          .set({ status: "under_review", updatedAt: new Date() })
          .where(eq(applicationsTable.id, payment.applicationId))
          .returning();

        if (app) {
          await db.insert(notificationsTable).values({
            userId: payment.userId,
            message: `Your M-Pesa payment of KES ${parseFloat(payment.amountKes).toLocaleString()} for application #${payment.applicationId} has been verified. Your application is now under review.`,
            read: false,
          });
        }
      }

      res.json({ ...payment, amountKes: parseFloat(payment.amountKes) });
    } catch (error) {
      console.error("Verify payment error:", error);
      res.status(500).json({ error: "Failed to verify payment" });
    }
  }
);

router.get("/stats", requireAdmin, async (req: AuthenticatedRequest, res) => {
  try {
    const allApps = await db
      .select({
        app: applicationsTable,
        user: {
          email: usersTable.email,
          fullName: usersTable.fullName,
        },
      })
      .from(applicationsTable)
      .innerJoin(usersTable, eq(applicationsTable.userId, usersTable.id))
      .orderBy(desc(applicationsTable.createdAt));

    const total = allApps.length;
    const pending = allApps.filter((r) => r.app.status === "pending").length;
    const underReview = allApps.filter((r) => r.app.status === "under_review").length;
    const approved = allApps.filter((r) => r.app.status === "approved").length;
    const rejected = allApps.filter((r) => r.app.status === "rejected").length;
    const loans = allApps.filter((r) => r.app.type === "loan").length;
    const grants = allApps.filter((r) => r.app.type === "grant").length;

    const recent = allApps.slice(0, 10).map(({ app, user }) => ({
      ...app,
      amountRequested: parseFloat(app.amountRequested),
      preapprovedAmount: app.preapprovedAmount ? parseFloat(app.preapprovedAmount) : null,
      monthlyIncome: app.monthlyIncome ? parseFloat(app.monthlyIncome) : null,
      annualRevenue: app.annualRevenue ? parseFloat(app.annualRevenue) : null,
      userEmail: user.email,
      userFullName: user.fullName,
    }));

    res.json({
      totalApplications: total,
      pendingApplications: pending,
      underReviewApplications: underReview,
      approvedApplications: approved,
      rejectedApplications: rejected,
      totalLoans: loans,
      totalGrants: grants,
      recentApplications: recent,
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

export default router;
