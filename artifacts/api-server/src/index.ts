import app from "./app.js";
import { db } from "@workspace/db";
import { usersTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export default app;

async function seedAdmin() {
  try {
    const [existing] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, "info@cardoneloansgrants.com"))
      .limit(1);

    if (!existing) {
      const passwordHash = await bcrypt.hash("Thunes2020!", 12);
      await db.insert(usersTable).values({
        email: "info@cardoneloansgrants.com",
        passwordHash,
        fullName: "Cardone Admin",
        role: "admin",
      });
      console.log("Admin user seeded successfully");
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
