import { Router } from "express";
import { db } from "@workspace/db";
import {
  payoutAccountsTable,
  withdrawalsTable,
  applicationsTable,
} from "@workspace/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { requireAuth, AuthenticatedRequest } from "../middlewares/auth.js";
import { cleanString, isReasonableAccountNumber } from "../lib/validate.js";

const router = Router();

// ── Payout accounts ───────────────────────────────────────────────────────────

router.get("/payout-accounts", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const accounts = await db
      .select()
      .from(payoutAccountsTable)
      .where(eq(payoutAccountsTable.userId, req.userId!))
      .orderBy(desc(payoutAccountsTable.createdAt));
    res.json(accounts);
  } catch (error) {
    console.error("Get payout accounts error:", error);
    res.status(500).json({ error: "Failed to fetch payout accounts" });
  }
});

router.post("/payout-accounts", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const accountHolderName = cleanString(req.body.accountHolderName, 120);
    const bankName = cleanString(req.body.bankName, 120);
    const accountNumber = cleanString(req.body.accountNumber, 34);
    const branch = cleanString(req.body.branch, 80);
    const swiftCode = cleanString(req.body.swiftCode, 20);
    const isDefault = Boolean(req.body.isDefault);

    if (!accountHolderName || !bankName || !accountNumber) {
      res.status(400).json({
        error: "Account holder name, bank name, and account number are required",
      });
      return;
    }
    if (!isReasonableAccountNumber(accountNumber)) {
      res.status(400).json({ error: "Enter a valid account number" });
      return;
    }

    // If this is the user's first account, make it the default.
    const existing = await db
      .select({ id: payoutAccountsTable.id })
      .from(payoutAccountsTable)
      .where(eq(payoutAccountsTable.userId, req.userId!));

    const makeDefault = Boolean(isDefault) || existing.length === 0;

    if (makeDefault && existing.length > 0) {
      await db
        .update(payoutAccountsTable)
        .set({ isDefault: false })
        .where(eq(payoutAccountsTable.userId, req.userId!));
    }

    const [account] = await db
      .insert(payoutAccountsTable)
      .values({
        userId: req.userId!,
        accountHolderName,
        bankName,
        accountNumber,
        branch: branch ?? null,
        swiftCode: swiftCode ?? null,
        isDefault: makeDefault,
      })
      .returning();

    res.status(201).json(account);
  } catch (error) {
    console.error("Create payout account error:", error);
    res.status(500).json({ error: "Failed to add payout account" });
  }
});

router.delete("/payout-accounts/:id", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) { res.status(400).json({ error: "Invalid account ID" }); return; }

    const [account] = await db
      .select()
      .from(payoutAccountsTable)
      .where(and(eq(payoutAccountsTable.id, id), eq(payoutAccountsTable.userId, req.userId!)))
      .limit(1);

    if (!account) { res.status(404).json({ error: "Payout account not found" }); return; }

    // Block deletion when the account is referenced by a withdrawal request.
    const [linked] = await db
      .select({ id: withdrawalsTable.id })
      .from(withdrawalsTable)
      .where(eq(withdrawalsTable.payoutAccountId, id))
      .limit(1);

    if (linked) {
      res.status(409).json({
        error: "This account is used by a withdrawal request and cannot be removed.",
      });
      return;
    }

    await db.delete(payoutAccountsTable).where(eq(payoutAccountsTable.id, id));
    res.json({ message: "Payout account removed" });
  } catch (error) {
    console.error("Delete payout account error:", error);
    res.status(500).json({ error: "Failed to remove payout account" });
  }
});

// ── Withdrawals ───────────────────────────────────────────────────────────────

router.get("/withdrawals", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const rows = await db
      .select({
        withdrawal: withdrawalsTable,
        account: payoutAccountsTable,
      })
      .from(withdrawalsTable)
      .leftJoin(
        payoutAccountsTable,
        eq(withdrawalsTable.payoutAccountId, payoutAccountsTable.id),
      )
      .where(eq(withdrawalsTable.userId, req.userId!))
      .orderBy(desc(withdrawalsTable.createdAt));

    res.json(
      rows.map(({ withdrawal, account }) => ({
        ...withdrawal,
        amount: parseFloat(withdrawal.amount),
        payoutAccount: account
          ? {
              id: account.id,
              accountHolderName: account.accountHolderName,
              bankName: account.bankName,
              accountNumber: account.accountNumber,
            }
          : null,
      })),
    );
  } catch (error) {
    console.error("Get withdrawals error:", error);
    res.status(500).json({ error: "Failed to fetch withdrawals" });
  }
});

router.post("/withdrawals", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const { payoutAccountId, amount, applicationId, currency } = req.body;

    const amountNum = Number(amount);
    if (!Number.isFinite(amountNum) || amountNum <= 0) {
      res.status(400).json({ error: "Enter a valid withdrawal amount" });
      return;
    }
    if (!payoutAccountId) {
      res.status(400).json({ error: "Select a payout account" });
      return;
    }

    // Ensure the payout account belongs to the requesting user.
    const [account] = await db
      .select()
      .from(payoutAccountsTable)
      .where(
        and(
          eq(payoutAccountsTable.id, Number(payoutAccountId)),
          eq(payoutAccountsTable.userId, req.userId!),
        ),
      )
      .limit(1);

    if (!account) { res.status(404).json({ error: "Payout account not found" }); return; }

    // If an application is supplied, ensure it belongs to the user.
    let appId: number | null = null;
    if (applicationId !== undefined && applicationId !== null && applicationId !== "") {
      const [app] = await db
        .select({ id: applicationsTable.id })
        .from(applicationsTable)
        .where(
          and(
            eq(applicationsTable.id, Number(applicationId)),
            eq(applicationsTable.userId, req.userId!),
          ),
        )
        .limit(1);
      if (!app) { res.status(404).json({ error: "Application not found" }); return; }
      appId = app.id;
    }

    const [withdrawal] = await db
      .insert(withdrawalsTable)
      .values({
        userId: req.userId!,
        payoutAccountId: account.id,
        applicationId: appId,
        amount: amountNum.toFixed(2),
        currency: cleanString(currency, 8) || "USD",
        status: "pending",
      })
      .returning();

    res.status(201).json({
      ...withdrawal,
      amount: parseFloat(withdrawal.amount),
    });
  } catch (error) {
    console.error("Create withdrawal error:", error);
    res.status(500).json({ error: "Failed to submit withdrawal request" });
  }
});

export default router;
