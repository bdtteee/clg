import {
  pgTable,
  serial,
  text,
  integer,
  numeric,
  timestamp,
  boolean,
  jsonb,
  date,
  pgEnum,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";

export const applicationTypeEnum = pgEnum("application_type", ["loan", "grant"]);
export const applicationCategoryEnum = pgEnum("application_category", [
  "personal",
  "business",
]);
export const applicationStatusEnum = pgEnum("application_status", [
  "pending",
  "under_review",
  "approved",
  "rejected",
]);

export const applicationsTable = pgTable("applications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => usersTable.id),
  type: applicationTypeEnum("type").notNull(),
  category: applicationCategoryEnum("category").notNull(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  phoneNumber: text("phone_number").notNull(),
  country: text("country").notNull().default("Kenya"),
  reason: text("reason").notNull(),
  amountRequested: numeric("amount_requested", { precision: 12, scale: 2 }).notNull(),
  businessName: text("business_name"),
  status: applicationStatusEnum("status").notNull().default("pending"),
  preapprovedAmount: numeric("preapproved_amount", { precision: 12, scale: 2 }),
  approvedAmount: numeric("approved_amount", { precision: 12, scale: 2 }),
  assignedPartner: text("assigned_partner"),
  disbursementDate: date("disbursement_date"),
  verificationStatus: text("verification_status").default("Pending"),
  serviceFee: numeric("service_fee", { precision: 10, scale: 2 }),
  serviceFeeStatus: text("service_fee_status").default("pending"),
  rejectionReason: text("rejection_reason"),
  reviewNotes: text("review_notes"),
  bankDetails: jsonb("bank_details"),
  nationalIdNumber: text("national_id_number"),
  kraPin: text("kra_pin"),
  registrationNumber: text("registration_number"),
  employmentStatus: text("employment_status"),
  monthlyIncome: numeric("monthly_income", { precision: 12, scale: 2 }),
  annualRevenue: numeric("annual_revenue", { precision: 12, scale: 2 }),
  paymentCode: text("payment_code"),
  adminComment: text("admin_comment"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertApplicationSchema = createInsertSchema(applicationsTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertApplication = z.infer<typeof insertApplicationSchema>;
export type Application = typeof applicationsTable.$inferSelect;

export const manualPaymentsTable = pgTable("manual_payments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => usersTable.id),
  applicationId: integer("application_id").references(() => applicationsTable.id),
  userName: text("user_name").notNull(),
  phoneNumber: text("phone_number").notNull(),
  mpesaConfirmationCode: text("mpesa_confirmation_code").notNull(),
  amountKes: numeric("amount_kes", { precision: 12, scale: 2 }).notNull(),
  isVerified: boolean("is_verified").notNull().default(false),
  verifiedBy: integer("verified_by"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const paymentsTable = pgTable("payments", {
  id: serial("id").primaryKey(),
  applicationId: integer("application_id").references(() => applicationsTable.id),
  userId: integer("user_id").notNull().references(() => usersTable.id),
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
  currency: text("currency").notNull().default("KES"),
  phoneNumber: text("phone_number").notNull(),
  provider: text("provider").notNull().default("M-PESA"),
  status: text("status").notNull().default("pending"),
  checkoutRequestId: text("checkout_request_id"),
  providerReference: text("provider_reference"),
  callbackPayload: jsonb("callback_payload"),
  manualPaymentId: integer("manual_payment_id"),
  exchangeRateUsed: numeric("exchange_rate_used", { precision: 10, scale: 4 }),
  amountUsd: numeric("amount_usd", { precision: 12, scale: 2 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const kycDocumentsTable = pgTable("kyc_documents", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => usersTable.id),
  applicationId: integer("application_id").references(() => applicationsTable.id),
  documentType: text("document_type").notNull(),
  fileUrl: text("file_url"),
  filePath: text("file_path"),
  fileName: text("file_name"),
  status: text("status").notNull().default("Pending"),
  rejectionReason: text("rejection_reason"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type ManualPayment = typeof manualPaymentsTable.$inferSelect;
export type Payment = typeof paymentsTable.$inferSelect;
export type KycDocument = typeof kycDocumentsTable.$inferSelect;
