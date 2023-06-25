import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db } from "~/drizzle/config.db.server";
import { users } from "~/drizzle/schemas/users.db.server";
import type { NewUser } from "~/drizzle/schemas/users.db.server";

export function userExists(email: string) {
  return db.select().from(users).where(eq(users.email, email));
}

export async function createUser(user: NewUser) {
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(user.password, salt);

  return db
    .insert(users)
    .values({
      email: user.email,
      password: passwordHash,
      firstName: user.firstName,
      lastName: user.lastName,
    })
    .returning();
}
