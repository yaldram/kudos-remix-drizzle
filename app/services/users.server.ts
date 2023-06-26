import bcrypt from "bcryptjs";
import { eq, ne } from "drizzle-orm";

import { db } from "~/drizzle/config.db.server";
import type { User } from "~/drizzle/schemas/users.db.server";
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

export function getOtherUsers(loggedInUserId: string) {
  return db.select().from(users).where(ne(users.id, loggedInUserId));
}

export function getUserById(userId: string) {
  return db.select().from(users).where(eq(users.id, userId));
}

export function updateUser(
  payload: Pick<User, "id" | "firstName" | "lastName">
) {
  return db
    .update(users)
    .set(payload)
    .where(eq(users.id, payload.id))
    .returning();
}

export function deleteUser(userId: string) {
  return db.delete(users).where(eq(users.id, userId));
}
