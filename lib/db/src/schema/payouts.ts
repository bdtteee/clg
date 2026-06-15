import {
  pgTable,
  serial,
  integer,
  text,
  numeric,
  timestamp,
  boolean,
  pgEnum,
} from "drizzle-orm/pg-core";
import { usersTable } from "./users";
import { applicationsTable } from "./applications";

// ── Payout accounts ───────────────────────────────────────────────────────────
// Reusable bank accounts a user adds for disbursements / withdrawals.
export const payoutAccountsTable = pgTable("payout_accounts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => usersTable.id),
  accountHolderName: text("account_holder_name").notNull(),
  bankName: text("bank_name").notNull(),
  accountNumber: text("account_number").notNull(),
  branch: text("branch"),
  swiftCode: text("swift_code"),
  isDefault: boolean("is_default").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type PayoutAccount = typeof payoutAccountsTable.$inferSelect;

// ── Withdrawals ───────────────────────────────────────────────────────────────
export const withdrawalStatusEnum = pgEnum("withdrawal_status", [
  "pending",
  "approved",
  "rejected",
  "paid",
]);

export const withdrawalsTable = pgTable("withdrawals", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => usersTable.id),
  applicationId: integer("application_id").references(() => applicationsTable.id),
  payoutAccountId: integer("payout_account_id")
    .notNull()
    .references(() => payoutAccountsTable.id),
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
  currency: text("currency").notNull().default("USD"),
  status: withdrawalStatusEnum("status").notNull().default("pending"),
  adminComment: text("admin_comment"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type Withdrawal = typeof withdrawalsTable.$inferSelect;
