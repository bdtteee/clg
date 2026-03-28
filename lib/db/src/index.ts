import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

const { Pool } = pg;

// In development (Replit), use the local DATABASE_URL.
// In production (Vercel), POSTGRES_URL from Supabase is injected automatically.
const rawConnectionString =
  process.env.NODE_ENV === "production"
    ? process.env.POSTGRES_URL || process.env.DATABASE_URL
    : process.env.DATABASE_URL || process.env.POSTGRES_URL;

if (!rawConnectionString) {
  throw new Error(
    "No database connection string found. Set DATABASE_URL (development) or POSTGRES_URL (production/Supabase).",
  );
}

const isSupabase = rawConnectionString.includes("supabase.com");

// Ensure the password is properly URL-encoded (handles special chars like !)
function fixConnectionString(url: string): string {
  try {
    const parsed = new URL(url);
    if (parsed.password) {
      parsed.password = decodeURIComponent(parsed.password);
      return parsed.toString();
    }
    return url;
  } catch {
    return url;
  }
}

// Strip sslmode from URL so we can control SSL options manually
const cleanConnectionString = fixConnectionString(rawConnectionString)
  .replace(/[?&]sslmode=[^&]*/g, "")
  .replace(/[?&]pgbouncer=[^&]*/g, "")
  .replace(/[?&]supa=[^&]*/g, "")
  .replace(/\?$/, "");

export const pool = new Pool({
  connectionString: cleanConnectionString,
  ssl: isSupabase ? { rejectUnauthorized: false } : undefined,
});

export const db = drizzle(pool, { schema });

export * from "./schema";
