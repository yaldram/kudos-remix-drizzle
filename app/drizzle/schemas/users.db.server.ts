import type { InferModel } from "drizzle-orm";
import { pgTable, uuid, text, varchar } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  firstName: varchar("first_name").notNull(),
  lastName: varchar("last_name").notNull(),
  profileUrl: varchar("profile_url"),
  email: varchar("email").notNull(),
  password: text("password").notNull(),
});

export type User = InferModel<typeof users>;

export type NewUser = InferModel<typeof users, "insert">;

export type UserProfile = Pick<User, "firstName" | "lastName" | "profileUrl">;
