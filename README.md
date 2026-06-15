# Cardone Loans & Grants

Full‑stack fintech platform connecting Kenyan individuals and businesses with
U.S.‑based funding providers. It handles account sign‑up, a multi‑step loan/grant
application with KYC/KYB document uploads, an **instant 85% pre‑approval**, manual
M‑Pesa processing‑fee payment, **bank payout accounts**, **withdrawal requests**,
e‑mail/in‑app notifications, and a full admin back‑office.

- **Domain:** cardoneloansgrants.org
- **Support:** info@cardoneloansgrants.org · +1 254‑528‑9454

> **Security:** No secrets or credentials are hardcoded anywhere in the source.
> Every secret (database, JWT, session, admin seed, SMTP, M‑Pesa, Supabase keys)
> is read from environment variables. See [Environment variables](#-environment-variables).

---

## Table of contents

1. [Features](#-features)
2. [Architecture](#-architecture)
3. [Tech stack](#-tech-stack)
4. [Prerequisites](#-prerequisites)
5. [Environment variables](#-environment-variables)
6. [Local setup — step by step](#-local-setup--step-by-step)
7. [Database & migrations](#-database--migrations)
8. [Running the app](#-running-the-app)
9. [Seeding an admin](#-seeding-an-admin)
10. [Application flow](#-application-flow)
11. [Payouts & withdrawals](#-payouts--withdrawals)
12. [Admin back‑office](#-admin-back-office)
13. [API reference](#-api-reference)
14. [Build & deploy](#-build--deploy)
15. [Regenerating the API client](#-regenerating-the-api-client)
16. [Scripts reference](#-scripts-reference)
17. [Troubleshooting](#-troubleshooting)

---

## ✨ Features

- **Auth** — e‑mail/password sign‑up & login, JWT `auth_token` cookie, bcrypt hashing.
- **Multi‑step application** — product → details → KYC/KYB documents → **payout/bank details** → M‑Pesa payment → done.
- **End‑to‑end document uploads** — direct‑to‑Supabase‑Storage signed uploads; documents are viewable by the applicant and the admin via signed download URLs.
- **Instant 85% pre‑approval** — every submitted loan **or grant** receives an 85% pre‑approval of the requested amount.
- **Processing fee via M‑Pesa STK Push** — the applicant is prompted on their phone and the app auto‑advances on payment; manual Paybill code entry remains a fallback. The **account name shown is the applicant's name**.
- **Auto‑migrating schema** — the API applies an idempotent schema sync on every boot, so no manual migration step is required before a deploy.
- **Country selection** — applicants choose their country during the application.
- **Input & upload hardening** — server‑side upload allow‑list (JPG/PNG/PDF, ≤10 MB), object‑path traversal guards, string length caps, and email/amount validation across the write endpoints.
- **Payout accounts** — users save reusable bank accounts for disbursement.
- **Withdrawals** — users request withdrawals to a chosen payout account; admins approve / reject / mark paid.
- **Notifications** — in‑app notifications at every status change.
- **Admin portal** — dashboard stats, application review (approve/reject/assign partner/approved amount/disbursement date), KYC document review, M‑Pesa payment verification, and withdrawal management.

---

## 🏗 Architecture

`pnpm` workspace monorepo:

```text
clg/
├── api/index.js                  # Vercel serverless entry (loads the API bundle)
├── artifacts/
│   ├── api-server/               # Express 5 API (auth, applications, payouts, admin…)
│   └── cardone-loans/            # React + Vite frontend (served at /)
├── lib/
│   ├── api-spec/                 # OpenAPI spec + Orval codegen config
│   ├── api-client-react/         # Generated React Query hooks + custom fetch
│   ├── api-zod/                  # Generated Zod schemas
│   └── db/                       # Drizzle ORM schema + connection
├── scripts/                      # start-dev.sh / start-prod.sh
├── render.yaml                   # Render (split deploy) blueprint
├── vercel.json                   # Vercel (monolithic deploy) config
└── .env.example                  # Documented environment template
```

**Two supported deployment topologies** (both work with the same code):

| Topology | Frontend | API | Cross‑origin? |
|---|---|---|---|
| **Monolithic (Vercel)** | Vercel static | Vercel serverless `api/index.js` | No — same origin, `VITE_API_URL` unset |
| **Split** | Vercel static | Render web service | Yes — set `VITE_API_URL` + `FRONTEND_URL` |

The frontend resolves the API origin from `VITE_API_URL` (split) and falls back
to same‑origin relative paths (monolith). The API CORS layer always allows the
production domains and any `*.vercel.app` deployment, plus anything listed in
`FRONTEND_URL`.

---

## 🧱 Tech stack

- **Monorepo:** pnpm workspaces · **Node:** 22+ · **TypeScript:** 5.9
- **Frontend:** React 19 + Vite 7, Tailwind CSS 4, Wouter, TanStack Query, Framer Motion
- **API:** Express 5, Drizzle ORM, PostgreSQL (Supabase), Zod
- **Auth:** JWT cookie (`jsonwebtoken`) + bcrypt
- **Storage:** Supabase Storage (private `kyc-documents` bucket, signed URLs)
- **Codegen:** Orval (OpenAPI → React Query hooks + Zod)
- **Build:** Vite (frontend) · esbuild (API CJS bundle)

---

## ✅ Prerequisites

- **Node.js 22+**
- **pnpm 10+** — `npm install -g pnpm`
- A **Supabase** project (PostgreSQL + Storage), or any PostgreSQL database
- (Optional) SMTP credentials for e‑mail, M‑Pesa Daraja credentials

---

## 🔐 Environment variables

Copy the template and fill it in — **nothing is hardcoded; every value below comes from the environment.**

```bash
cp .env.example .env
```

| Variable | Required | Used by | Notes |
|---|---|---|---|
| `DATABASE_URL` | dev | API + migrations | Supabase session pooler (port 5432) |
| `POSTGRES_URL` | prod | API runtime | Supabase transaction pooler (port 6543) |
| `POSTGRES_URL_NON_POOLING` | migrations | Drizzle Kit | Supabase direct connection (port 5432) |
| `SUPABASE_URL` | yes | storage routes | `https://<project>.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | yes | storage routes | Server‑side key for signed upload/download URLs |
| `SUPABASE_ANON_KEY` | optional | — | Public anon key |
| `SUPABASE_JWT_SECRET` | recommended | auth middleware | Token signing secret (falls back to `SESSION_SECRET`) |
| `SESSION_SECRET` | recommended | session/JWT | If blank → uses `SUPABASE_JWT_SECRET` → random per‑boot. Never hardcoded |
| `ADMIN_EMAIL` | optional | admin seed | Set with `ADMIN_PASSWORD` to seed one admin on boot |
| `ADMIN_PASSWORD` | optional | admin seed | Plain password (hashed with bcrypt on seed) |
| `ADMIN_NAME` | optional | admin seed | Defaults to `Administrator` |
| `NODE_ENV` | yes | everything | `development` locally, `production` in prod |
| `PORT` | yes | API listen / frontend | API port (e.g. 3001); frontend Vite PORT (e.g. 5000) |
| `FRONTEND_URL` | prod | CORS | Comma‑separated allowed origins (prod domains + `*.vercel.app` already allowed) |
| `VITE_API_URL` | split deploy | frontend build | Render API base URL. Leave unset for monolithic Vercel |
| `SMTP_HOST/PORT/SECURE/USER/PASS/FROM` | optional | e‑mail | Notification e‑mails |
| `MPESA_CONSUMER_KEY/SECRET/SHORTCODE/PASSKEY/CALLBACK_URL/ENV` | optional | M‑Pesa STK Push | Enables STK Push to collect the fee. `MPESA_CALLBACK_URL` must be a public `…/api/payments/mpesa/callback`; `MPESA_ENV` is `sandbox` or `production`. Without these, users pay via manual Paybill code entry |

---

## 🚀 Local setup — step by step

```bash
# 1. Clone and enter
git clone <repo-url> clg && cd clg

# 2. Install pnpm (if needed) and dependencies
npm install -g pnpm
pnpm install

# 3. Create your Supabase project
#    - Project → Settings → Database: copy the pooled + non-pooling connection strings
#    - Project → Settings → API:      copy the URL, anon key, service_role key, JWT secret
#    - Storage → New bucket: create a PRIVATE bucket named exactly  kyc-documents

# 4. Configure environment
cp .env.example .env
#    Fill in DATABASE_URL, POSTGRES_URL(_NON_POOLING), SUPABASE_URL,
#    SUPABASE_SERVICE_ROLE_KEY, SUPABASE_JWT_SECRET (or SESSION_SECRET),
#    and (optionally) ADMIN_EMAIL / ADMIN_PASSWORD.

# 5. Push the database schema (creates all tables)
pnpm --filter @workspace/db run push

# 6. Run the app (frontend :5000, API :3001)
PORT=5000 API_PORT=3001 bash scripts/start-dev.sh
```

Open <http://localhost:5000>. The Vite dev server proxies `/api/*` to the API on
`127.0.0.1:3001`, so locally everything is same‑origin (no CORS, no `VITE_API_URL`).

---

## 🗄 Database & migrations

Schema lives in `lib/db/src/schema/` (Drizzle ORM). Tables:

- **users** — id, email, password_hash, full_name, role (`user`/`admin`)
- **applications** — type, category, amounts, `preapproved_amount`, `approved_amount`, status, KYC fields, `payment_code`, `assigned_partner`, `disbursement_date`, …
- **kyc_documents** — per‑application uploaded documents (file_url, status)
- **payout_accounts** — reusable bank accounts (holder, bank, account number, branch)
- **withdrawals** — amount, currency, status (`pending`/`approved`/`rejected`/`paid`), payout account, optional application
- **notifications**, **admin_actions**, **manual_payments**, **payments**

**Auto‑migration:** the API runs an idempotent `ensureSchema()` on every boot that
creates any missing tables, enums, and columns (`IF NOT EXISTS` guards). A fresh or
existing database is brought up to date automatically — **no manual push is required**.

To force a full sync from the Drizzle schema (e.g. for destructive changes), you can still run:

```bash
pnpm --filter @workspace/db run push          # interactive
pnpm --filter @workspace/db run push-force     # non-interactive
```

> Migrations use `POSTGRES_URL_NON_POOLING` → `POSTGRES_URL` → `DATABASE_URL`.

---

## ▶️ Running the app

| Command | What it does |
|---|---|
| `PORT=5000 API_PORT=3001 bash scripts/start-dev.sh` | Runs API + frontend together (dev) |
| `pnpm --filter @workspace/api-server run dev` | API only (`tsx`, hot) |
| `PORT=5000 pnpm --filter @workspace/cardone-loans run dev` | Frontend only |
| `pnpm run build` | Type‑check libs, then build everything |
| `pnpm run typecheck` | Type‑check libs + apps |
| `bash scripts/start-prod.sh` | Run the built API bundle in production mode |

---

## 👤 Seeding an admin

Admins are **not** hardcoded. To seed one on boot, set env vars and (re)start the API:

```bash
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=<a-strong-password>
ADMIN_NAME=Site Admin
```

If `ADMIN_EMAIL`/`ADMIN_PASSWORD` are unset, seeding is skipped. Alternatively,
promote an existing user directly in the database:

```sql
UPDATE users SET role = 'admin' WHERE email = 'me@example.com';
```

Admins sign in at `/admin-login` and land on `/admin`.

---

## 📝 Application flow

`/apply` is a 6‑step wizard:

1. **Select** — choose Personal/Business Loan or Grant.
2. **Details** — amount, contact, **country**, ID/business info, purpose, optional business plan.
3. **Documents** — KYC (personal) or KYB (business) uploads. Files upload directly to Supabase Storage via signed URLs and are reviewable by admins.
4. **Payout / Bank details** — add/select the bank account for disbursement (reused later for withdrawals).
5. **Payment** — pay the processing fee via **M‑Pesa STK Push** (a prompt is sent to the phone; the app auto‑advances once paid), or manually via Paybill **4167853**. The **payment reference / account name is the applicant's full name**, then enter the confirmation code.
6. **Done** — application is under review with an **85% pre‑approval** shown.

On submission every application (loan **and** grant) is stored with
`preapproved_amount = 0.85 × amount_requested`.

---

## 💸 Payouts & withdrawals

- **Add payout accounts** during the application (step 4) or from the dashboard's *Payouts & Withdrawals* panel.
- **Request a withdrawal** from the dashboard: enter an amount, pick a saved payout account, optionally tie it to an application. The request is created as `pending`.
- **Track status** — each request shows pending/approved/paid/rejected with any admin note.
- **Admins** action requests in the **Withdrawals** tab of the admin portal (approve → mark paid, or reject with a reason). The applicant is notified at each step.

---

## 🛠 Admin back‑office

`/admin` (admin only) tabs:

- **Overview** — totals, status breakdown chart, recent applications.
- **Applications** — search/filter, approve/reject with note, open detail to assign partner, set approved amount & disbursement date, and review/approve/reject each KYC document (with signed "View Document" links).
- **Payments** — verify or reject submitted M‑Pesa processing‑fee codes (verifying moves the app to *Under Review*).
- **Withdrawals** — review withdrawal requests with applicant bank details; approve, mark paid, or reject.

---

## 📡 API reference

All routes are under `/api`.

**Auth** — `POST /auth/register` · `POST /auth/login` · `POST /auth/logout` · `GET /auth/me` · `POST /auth/change-password`

**Applications** — `GET /applications` · `POST /applications` · `GET /applications/:id` · `PATCH /applications/:id` · `POST /applications/:id/payment` · `POST /applications/:id/stk-push` · `GET|POST /applications/:id/kyc-documents`

**Payments (M‑Pesa)** — `POST /payments/mpesa/callback` (public — Safaricom STK callback)

**Storage** — `POST /storage/uploads/request-url` · `GET /storage/objects/*path`

**Payouts & withdrawals** — `GET|POST /payout-accounts` · `DELETE /payout-accounts/:id` · `GET|POST /withdrawals`

**Notifications** — `GET /notifications` · `POST /notifications/:id/read` · `POST /notifications/read-all`

**Admin** — `GET /admin/applications` · `GET /admin/applications/:id/kyc-documents` · `PATCH /admin/kyc-documents/:id` · `POST /admin/applications/:id/approve|reject` · `PATCH /admin/applications/:id/update` · `GET /admin/payments` · `POST /admin/payments/:id/verify` · `GET /admin/withdrawals` · `POST /admin/withdrawals/:id/update` · `GET /admin/users` · `GET /admin/stats`

**Health** — `GET /healthz`

---

## ☁️ Build & deploy

### Option A — Monolithic on Vercel (simplest, no CORS)

`vercel.json` builds the frontend and bundles the API into the `api/index.js`
serverless function; `/api/*` is routed to it (same origin).

1. Import the repo into Vercel.
2. Set env vars in **Vercel → Settings → Environment Variables**: `POSTGRES_URL`,
   `POSTGRES_URL_NON_POOLING`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`,
   `SUPABASE_JWT_SECRET`, `SESSION_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `NODE_ENV=production`.
   **Leave `VITE_API_URL` unset.**
3. Deploy. Run `pnpm --filter @workspace/db run push` once (locally, with the
   Supabase URLs) to create tables.

### Option B — Split: Vercel frontend + Render backend

The API runs on Render (`render.yaml` blueprint); the frontend is a Vercel static site.

1. **Render** — create a Web Service from `render.yaml`. Set the `sync: false`
   secrets (DB URLs, Supabase keys, `SUPABASE_JWT_SECRET`, `ADMIN_EMAIL`,
   `ADMIN_PASSWORD`, optional SMTP/M‑Pesa). `FRONTEND_URL` defaults to the
   production domain — set it to your actual frontend origin if different.
2. **Vercel** — deploy the frontend and set **`VITE_API_URL`** to the Render URL
   (e.g. `https://your-api.onrender.com`) at build time.
3. Push the DB schema once: `pnpm --filter @workspace/db run push`.

> Cookies are issued with `Secure; SameSite=None` in production and the API sets
> `trust proxy`, so cross‑site auth works behind Vercel/Render TLS proxies.

---

## 🔁 Regenerating the API client

The React Query hooks and Zod schemas are generated from `lib/api-spec/openapi.yaml`.
After editing the spec:

```bash
pnpm --filter @workspace/api-spec run codegen
```

This rewrites `lib/api-client-react/src/generated` and `lib/api-zod/src/generated`.

---

## 📜 Scripts reference

| Script | Location | Purpose |
|---|---|---|
| `pnpm run build` | root | Type‑check libs → build frontend + API |
| `pnpm run typecheck` | root | Type‑check libs + apps |
| `pnpm --filter @workspace/db run push` | root | Apply schema to the database |
| `pnpm --filter @workspace/api-spec run codegen` | root | Regenerate API client + Zod |
| `scripts/start-dev.sh` | root | Run API + frontend (dev) |
| `scripts/start-prod.sh` | root | Run built API bundle (prod) |

---

## 🧰 Troubleshooting

**Login/Sign‑up says "Failed to fetch."**
A browser‑level network/CORS error. Checklist:
- *Split deploy:* `VITE_API_URL` must be set in Vercel at build time, and the
  frontend origin must be allowed by the API (`FRONTEND_URL`, or a `*.vercel.app`
  / production domain — those are allowed automatically).
- *Monolithic:* leave `VITE_API_URL` unset so requests are same‑origin.
- Ensure the API is reachable (Render free instances cold‑start) and `POSTGRES_URL`
  / `SUPABASE_JWT_SECRET` (or `SESSION_SECRET`) are set.

**Document upload/view fails.**
- Create a **private** Supabase Storage bucket named exactly `kyc-documents`.
- Set `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` on the API.
- View links route through `/api/storage/objects/...` (signed download URLs).

**Logged in but immediately logged out / `GET /auth/me` 401.**
- In production, cookies are `Secure; SameSite=None` — both ends must be HTTPS.
  The API sets `trust proxy`; confirm `NODE_ENV=production`.

**Admin can't log in.**
- Seed via `ADMIN_EMAIL` + `ADMIN_PASSWORD` (then restart the API), or set
  `role='admin'` on an existing user in the database.

**Tables missing / 500s on queries.**
- Run `pnpm --filter @workspace/db run push` against the target database.
