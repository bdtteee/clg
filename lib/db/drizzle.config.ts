import { defineConfig } from "drizzle-kit";
import path from "path";

const migrationUrl =
  process.env.POSTGRES_URL_NON_POOLING ||
  process.env.POSTGRES_URL ||
  process.env.DATABASE_URL;

if (!migrationUrl) {
  throw new Error(
    "No database URL found. Set POSTGRES_URL_NON_POOLING (Supabase) or DATABASE_URL.",
  );
}

export default defineConfig({
  schema: path.join(__dirname, "./src/schema/index.ts"),
  dialect: "postgresql",
  dbCredentials: {
    url: migrationUrl,
    ssl: !!(process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_URL),
  },
});
