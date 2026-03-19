# Cardone Loans & Grants

## Overview

Full-stack fintech platform connecting Kenyan individuals and businesses with U.S.-based funding providers. Acts as an intermediary for loans and grants with KYC onboarding, application processing, M-Pesa payment integration, and admin management.

**Domain:** cardoneloansgrants.org  
**Support:** info@cardoneloansgrants.org | +1 254-528-9454  
**Address:** 17325 Castellammare Dr, Pacific Palisades, CA 90272

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Frontend**: React + Vite, Tailwind CSS, Wouter (routing), React Query, Framer Motion
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Auth**: express-session + bcryptjs (cookie-based sessions)
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Design System

- Primary: Deep Navy Blue (#0B1F3A)
- Secondary: Emerald Green (#1FA67A)
- Accent: Gold (#D4AF37)
- Background: Light Gray (#F5F7FA)
- Text: Dark Gray (#1A1A1A)

## Products

| Product | Range | Processing Fee |
|---|---|---|
| Personal Grant | $2,000 – $10,000 | $10 |
| Business Grant | $5,000 – $30,000 | $20 |
| Personal Loan | $10,000 – $50,000 | $20 |
| Business Loan | $20,000 – $100,000 | $50 |

**Loan Pre-approval Logic:** Loans automatically show 65% pre-approval of requested amount immediately after submission.

## M-Pesa Payment

Business Number: 4167853 (Paybill)  
Account Number: Application ID

## Structure

```text
artifacts-monorepo/
├── artifacts/
│   ├── api-server/         # Express 5 API (auth, applications, notifications, admin)
│   └── cardone-loans/      # React + Vite frontend (served at /)
├── lib/
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── tsconfig.json
└── package.json
```

## Database Schema (Drizzle ORM / PostgreSQL)

- **users** – id, email, password_hash, full_name, role (user/admin), created_at
- **applications** – id, user_id, type (loan/grant), category (personal/business), amount_requested, preapproved_amount, status (pending/under_review/approved/rejected), payment_code, form fields..., admin_comment, created_at, updated_at
- **notifications** – id, user_id, message, read, created_at
- **admin_actions** – id, application_id, admin_id, action (approved/rejected/reviewed), reason, timestamp

## API Routes

- `POST /api/auth/register` – Register new user
- `POST /api/auth/login` – Login
- `POST /api/auth/logout` – Logout
- `GET /api/auth/me` – Get current user
- `GET /api/applications` – Get user's applications
- `POST /api/applications` – Create application (loan → 65% preapproval auto-set)
- `GET /api/applications/:id` – Get single application
- `POST /api/applications/:id/payment` – Submit M-Pesa payment code
- `GET /api/notifications` – Get notifications
- `POST /api/notifications/:id/read` – Mark notification read
- `POST /api/notifications/read-all` – Mark all read
- `GET /api/admin/applications` – Admin: list all (filterable by type/status)
- `POST /api/admin/applications/:id/approve` – Admin: approve + notify user
- `POST /api/admin/applications/:id/reject` – Admin: reject + notify user
- `GET /api/admin/stats` – Admin: dashboard statistics

## Frontend Pages

- `/` – Landing (hero, how it works, products, trust badges, FAQ, disclaimer, footer)
- `/login` – Login
- `/register` – Register
- `/dashboard` – User dashboard (applications list, notifications)
- `/apply` – Multi-step application form (product selection → form → M-Pesa payment → success)
- `/applications/:id` – Application detail
- `/admin` – Admin dashboard (stats, recent applications)
- `/admin/applications/:id` – Admin application detail (approve/reject)

## User Roles

- **user** – Can apply, view own applications, receive notifications
- **admin** – Can view all applications, approve/reject, send notifications

## Creating Admin User

To create an admin, register normally then update the role in the database:
```sql
UPDATE users SET role = 'admin' WHERE email = 'admin@example.com';
```

## Timelines

- Approval: 2–3 business days
- Disbursement: 14 days after approval

## TypeScript & Composite Projects

- `lib/*` packages are composite, emit declarations via `tsc --build`
- `artifacts/*` are leaf packages checked with `tsc --noEmit`
- Root `tsconfig.json` is a solution file for libs only

## Root Scripts

- `pnpm run build` – runs `typecheck` first, then recursively runs `build`
- `pnpm run typecheck` – runs `tsc --build --emitDeclarationOnly`
- `pnpm --filter @workspace/api-spec run codegen` – regenerate API client/zod schemas
- `pnpm --filter @workspace/db run push` – push schema changes to database

## Replit Configuration

- **Workflow**: `Start application` runs `bash scripts/start-dev.sh`
- **Frontend**: Vite dev server on `PORT=5000` (webview)
- **API server**: Express on `API_PORT=3001` (internal)
- **Proxy**: Vite proxies `/api/*` → `http://127.0.0.1:3001`
- **BASE_PATH**: `/`
- **Startup script**: `scripts/start-dev.sh`
- **Database (local)**: Replit PostgreSQL (DATABASE_URL set as secret)
- **Session secret**: SESSION_SECRET set as secret (fallback if SUPABASE_JWT_SECRET not set)

## Supabase / Vercel Integration

The project is deployed on **Vercel** and connected to a **Supabase** PostgreSQL database via the Vercel-Supabase integration. Vercel automatically injects the following environment variables:

| Variable | Usage |
|---|---|
| `POSTGRES_URL` | Pooled connection string — used by the app at runtime (`lib/db/src/index.ts`) |
| `POSTGRES_URL_NON_POOLING` | Direct connection — used by Drizzle Kit for migrations (`drizzle.config.ts`) |
| `SUPABASE_JWT_SECRET` | JWT signing secret — used by the auth middleware (falls back to `SESSION_SECRET`) |
| `SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `SUPABASE_ANON_KEY` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase public anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase admin key |
| `POSTGRES_HOST`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DATABASE` | Individual PG credentials |

**DB connection priority**: `POSTGRES_URL` → `DATABASE_URL`  
**Migration URL priority**: `POSTGRES_URL_NON_POOLING` → `POSTGRES_URL` → `DATABASE_URL`  
**JWT secret priority**: `SUPABASE_JWT_SECRET` → `SESSION_SECRET`  
**SSL**: Enabled automatically when `POSTGRES_URL` is present (required by Supabase).

To push schema to Supabase: `pnpm --filter @workspace/db run push` (with `POSTGRES_URL_NON_POOLING` set)
