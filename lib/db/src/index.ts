import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

const { Pool } = pg;

// Prefer the pooler URL for runtime (works from Replit), fall back to direct or local
const connectionString =
  process.env.POSTGRES_URL_NON_POOLING ||
  process.env.POSTGRES_URL ||
  process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "No database connection string found. Set POSTGRES_URL_NON_POOLING, POSTGRES_URL, or DATABASE_URL.",
  );
}

const isSupabase = !!(process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_URL);

// Strip sslmode from URL so we can control SSL options manually
const cleanConnectionString = connectionString.replace(/[?&]sslmode=[^&]*/g, "").replace(/\?$/, "");

export const pool = new Pool({
  connectionString: cleanConnectionString,
  ssl: isSupabase ? { rejectUnauthorized: false } : undefined,
});

export const db = drizzle(pool, { schema });

export * from "./schema";
