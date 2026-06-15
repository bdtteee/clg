import app from "./app.js";
import { db } from "@workspace/db";
import { usersTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

// Prevent unhandled rejections and exceptions from crashing the process
process.on("unhandledRejection", (reason: unknown) => {
  console.error("[UnhandledRejection]", reason);
});

process.on("uncaughtException", (err: Error) => {
  console.error("[UncaughtException]", err.message, err.stack);
});

export default app;

async function seedAdmin() {
  // Admin credentials come from the environment — never hardcoded. When they
  // are not configured, seeding is skipped entirely.
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  const fullName = process.env.ADMIN_NAME?.trim() || "Administrator";

  if (!email || !password) {
    console.log("ADMIN_EMAIL/ADMIN_PASSWORD not set — skipping admin seed.");
    return;
  }

  try {
    const [existing] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .limit(1);

    if (!existing) {
      const passwordHash = await bcrypt.hash(password, 12);
      await db.insert(usersTable).values({
        email,
        passwordHash,
        fullName,
        role: "admin",
      });
      console.log(`Admin user seeded: ${email}`);
    }
  } catch (err) {
    console.error("Admin seed error:", err);
  }
}

const rawPort = process.env["PORT"];
if (rawPort) {
  const port = Number(rawPort);
  if (!Number.isNaN(port) && port > 0) {
    seedAdmin();
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  }
} else {
  seedAdmin();
}
