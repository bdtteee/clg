import { Router } from "express";
import { db } from "@workspace/db";
import { applicationsTable, notificationsTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";

const router = Router();

interface StkCallbackItem {
  Name: string;
  Value?: string | number;
}

// Public endpoint — Safaricom posts STK Push results here (no auth).
router.post("/payments/mpesa/callback", async (req, res) => {
  // Acknowledge immediately so Safaricom doesn't retry.
  res.json({ ResultCode: 0, ResultDesc: "Accepted" });

  try {
    const cb = req.body?.Body?.stkCallback;
    const checkoutId: string | undefined = cb?.CheckoutRequestID;
    if (!checkoutId) return;

    const [app] = await db
      .select()
      .from(applicationsTable)
      .where(eq(applicationsTable.mpesaCheckoutRequestId, checkoutId))
      .limit(1);
    if (!app) return;

    if (Number(cb.ResultCode) === 0) {
      const items: StkCallbackItem[] = cb.CallbackMetadata?.Item ?? [];
      const receipt = items.find((i) => i.Name === "MpesaReceiptNumber")?.Value;

      await db
        .update(applicationsTable)
        .set({
          paymentCode: receipt ? String(receipt) : app.paymentCode,
          status: "under_review",
          updatedAt: new Date(),
        })
        .where(eq(applicationsTable.id, app.id));

      await db.insert(notificationsTable).values({
        userId: app.userId,
        message: `Your processing fee for application #${app.id} was received. Your application is now under review.`,
        read: false,
      });
    }
  } catch (err) {
    console.error("M-Pesa callback error:", err);
  }
});

export default router;
