import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

const { Pool } = pg;

// Prefer pooled URL for runtime, non-pooling for migrations, fall back to local
const rawConnectionString =
  process.env.POSTGRES_URL ||
  process.env.POSTGRES_URL_NON_POOLING ||
  process.env.DATABASE_URL;

if (!rawConnectionString) {
  throw new Error(
    "No database connection string found. Set POSTGRES_URL, POSTGRES_URL_NON_POOLING, or DATABASE_URL.",
  );
}

const isSupabase = !!(process.env.POSTGRES_URL || process.env.POSTGRES_URL_NON_POOLING);

// Ensure the password is properly URL-encoded (handles special chars like !)
function fixConnectionString(url: string): string {
  try {
    const parsed = new URL(url);
    // Re-encode password in case it contains special characters
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
  .replace(/\?$/, "");

export const pool = new Pool({
  connectionString: cleanConnectionString,
  ssl: isSupabase ? { rejectUnauthorized: false } : undefined,
});

export const db = drizzle(pool, { schema });

export * from "./schema";
