import type { User } from "~/drizzle/schemas/users.db.server";

export function getUserProfile(user: User) {
  return {
    firstName: user.firstName,
    lastName: user.lastName,
    profileUrl: user.profileUrl,
  };
}
