import pg from "pg";

// Idempotent DDL that brings any database (fresh or existing) up to the schema
// the app needs. Safe to re-run because every statement uses IF NOT EXISTS /
// duplicate-object guards. Removes the need to run `drizzle-kit push` manually.
const statements: string[] = [
  // ── Enums ──────────────────────────────────────────────────────────────────
  `DO $$ BEGIN CREATE TYPE user_role AS ENUM ('user','admin'); EXCEPTION WHEN duplicate_object THEN null; END $$;`,
  `DO $$ BEGIN CREATE TYPE application_type AS ENUM ('loan','grant'); EXCEPTION WHEN duplicate_object THEN null; END $$;`,
  `DO $$ BEGIN CREATE TYPE application_category AS ENUM ('personal','business'); EXCEPTION WHEN duplicate_object THEN null; END $$;`,
  `DO $$ BEGIN CREATE TYPE application_status AS ENUM ('pending','under_review','approved','rejected'); EXCEPTION WHEN duplicate_object THEN null; END $$;`,
  `DO $$ BEGIN CREATE TYPE admin_action_type AS ENUM ('approved','rejected','reviewed'); EXCEPTION WHEN duplicate_object THEN null; END $$;`,
  `DO $$ BEGIN CREATE TYPE withdrawal_status AS ENUM ('pending','approved','rejected','paid'); EXCEPTION WHEN duplicate_object THEN null; END $$;`,

  // ── Tables ─────────────────────────────────────────────────────────────────
  `CREATE TABLE IF NOT EXISTS users (
    id serial PRIMARY KEY,
    email text NOT NULL UNIQUE,
    password_hash text NOT NULL,
    full_name text NOT NULL,
    role user_role NOT NULL DEFAULT 'user',
    created_at timestamp NOT NULL DEFAULT now()
  );`,
  `CREATE TABLE IF NOT EXISTS applications (
    id serial PRIMARY KEY,
    user_id integer NOT NULL REFERENCES users(id),
    type application_type NOT NULL,
    category application_category NOT NULL,
    full_name text NOT NULL,
    email text NOT NULL,
    phone_number text NOT NULL,
    country text NOT NULL DEFAULT 'Kenya',
    reason text NOT NULL,
    amount_requested numeric(12,2) NOT NULL,
    business_name text,
    status application_status NOT NULL DEFAULT 'pending',
    preapproved_amount numeric(12,2),
    approved_amount numeric(12,2),
    assigned_partner text,
    disbursement_date date,
    verification_status text DEFAULT 'Pending',
    service_fee numeric(10,2),
    service_fee_status text DEFAULT 'pending',
    rejection_reason text,
    review_notes text,
    bank_details jsonb,
    national_id_number text,
    kra_pin text,
    registration_number text,
    employment_status text,
    monthly_income numeric(12,2),
    annual_revenue numeric(12,2),
    payment_code text,
    mpesa_checkout_request_id text,
    admin_comment text,
    created_at timestamp NOT NULL DEFAULT now(),
    updated_at timestamp NOT NULL DEFAULT now()
  );`,
  `CREATE TABLE IF NOT EXISTS kyc_documents (
    id serial PRIMARY KEY,
    user_id integer NOT NULL REFERENCES users(id),
    application_id integer REFERENCES applications(id),
    document_type text NOT NULL,
    file_url text,
    file_path text,
    file_name text,
    status text NOT NULL DEFAULT 'Pending',
    rejection_reason text,
    created_at timestamp NOT NULL DEFAULT now(),
    updated_at timestamp NOT NULL DEFAULT now()
  );`,
  `CREATE TABLE IF NOT EXISTS manual_payments (
    id serial PRIMARY KEY,
    user_id integer NOT NULL REFERENCES users(id),
    application_id integer REFERENCES applications(id),
    user_name text NOT NULL,
    phone_number text NOT NULL,
    mpesa_confirmation_code text NOT NULL,
    amount_kes numeric(12,2) NOT NULL,
    is_verified boolean NOT NULL DEFAULT false,
    verified_by integer,
    created_at timestamp NOT NULL DEFAULT now(),
    updated_at timestamp NOT NULL DEFAULT now()
  );`,
  `CREATE TABLE IF NOT EXISTS payments (
    id serial PRIMARY KEY,
    application_id integer REFERENCES applications(id),
    user_id integer NOT NULL REFERENCES users(id),
    amount numeric(12,2) NOT NULL,
    currency text NOT NULL DEFAULT 'KES',
    phone_number text NOT NULL,
    provider text NOT NULL DEFAULT 'M-PESA',
    status text NOT NULL DEFAULT 'pending',
    checkout_request_id text,
    provider_reference text,
    callback_payload jsonb,
    manual_payment_id integer,
    exchange_rate_used numeric(10,4),
    amount_usd numeric(12,2),
    created_at timestamp NOT NULL DEFAULT now(),
    updated_at timestamp NOT NULL DEFAULT now()
  );`,
  `CREATE TABLE IF NOT EXISTS notifications (
    id serial PRIMARY KEY,
    user_id integer NOT NULL REFERENCES users(id),
    message text NOT NULL,
    read boolean NOT NULL DEFAULT false,
    created_at timestamp NOT NULL DEFAULT now()
  );`,
  `CREATE TABLE IF NOT EXISTS admin_actions (
    id serial PRIMARY KEY,
    application_id integer NOT NULL REFERENCES applications(id),
    admin_id integer NOT NULL REFERENCES users(id),
    action admin_action_type NOT NULL,
    reason text NOT NULL,
    timestamp timestamp NOT NULL DEFAULT now()
  );`,
  `CREATE TABLE IF NOT EXISTS payout_accounts (
    id serial PRIMARY KEY,
    user_id integer NOT NULL REFERENCES users(id),
    account_holder_name text NOT NULL,
    bank_name text NOT NULL,
    account_number text NOT NULL,
    branch text,
    swift_code text,
    is_default boolean NOT NULL DEFAULT false,
    created_at timestamp NOT NULL DEFAULT now()
  );`,
  `CREATE TABLE IF NOT EXISTS withdrawals (
    id serial PRIMARY KEY,
    user_id integer NOT NULL REFERENCES users(id),
    application_id integer REFERENCES applications(id),
    payout_account_id integer NOT NULL REFERENCES payout_accounts(id),
    amount numeric(12,2) NOT NULL,
    currency text NOT NULL DEFAULT 'USD',
    status withdrawal_status NOT NULL DEFAULT 'pending',
    admin_comment text,
    created_at timestamp NOT NULL DEFAULT now(),
    updated_at timestamp NOT NULL DEFAULT now()
  );`,

  // ── Column top-ups (older databases that predate these columns) ─────────────
  `ALTER TABLE applications ADD COLUMN IF NOT EXISTS preapproved_amount numeric(12,2);`,
  `ALTER TABLE applications ADD COLUMN IF NOT EXISTS approved_amount numeric(12,2);`,
  `ALTER TABLE applications ADD COLUMN IF NOT EXISTS assigned_partner text;`,
  `ALTER TABLE applications ADD COLUMN IF NOT EXISTS disbursement_date date;`,
  `ALTER TABLE applications ADD COLUMN IF NOT EXISTS bank_details jsonb;`,
  `ALTER TABLE applications ADD COLUMN IF NOT EXISTS payment_code text;`,
  `ALTER TABLE applications ADD COLUMN IF NOT EXISTS mpesa_checkout_request_id text;`,
  `ALTER TABLE applications ADD COLUMN IF NOT EXISTS admin_comment text;`,
  `ALTER TABLE kyc_documents ADD COLUMN IF NOT EXISTS file_path text;`,
];

// Runs the DDL on a dedicated short-lived connection using the *direct*
// (non-pooling) URL when available — DDL and the simple query protocol are most
// reliable off the transaction pooler. Each statement is isolated so one
// failure never aborts the rest, and this never throws (callers don't need to
// guard it).
export async function ensureSchema(): Promise<void> {
  const url =
    process.env.POSTGRES_URL_NON_POOLING ||
    process.env.POSTGRES_URL ||
    process.env.DATABASE_URL;

  if (!url) {
    console.warn("ensureSchema: no database URL configured; skipping.");
    return;
  }

  const isSupabase = url.includes("supabase.com");
  const client = new pg.Client({
    connectionString: url,
    ssl: isSupabase ? { rejectUnauthorized: false } : undefined,
    connectionTimeoutMillis: 15_000,
  });

  try {
    await client.connect();
    for (const stmt of statements) {
      try {
        await client.query(stmt); // string form → simple query protocol
      } catch (err) {
        console.error("ensureSchema statement failed:", (err as Error).message);
      }
    }
    console.log("Database schema ensured.");
  } catch (err) {
    console.error("ensureSchema connection error:", (err as Error).message);
  } finally {
    try {
      await client.end();
    } catch {
      /* ignore */
    }
  }
}
