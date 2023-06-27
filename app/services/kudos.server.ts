import { desc, eq } from "drizzle-orm";
// import { alias } from "drizzle-orm/pg-core";

import { db } from "~/drizzle/config.db.server";
import type { NewKudo } from "~/drizzle/schemas/kudos.db.server";
import { kudos } from "~/drizzle/schemas/kudos.db.server";
// import { users } from "~/drizzle/schemas/users.db.server";

// const author = alias(users, "author");
// const recipient = alias(users, "recipeint");
// const kudo = alias(kudos, "kudo");

export function createKudo(kudo: NewKudo) {
  return db.insert(kudos).values(kudo).returning();
}

export function getReceivedKudos(loggedInUserId: string) {
  return db.query.kudos.findMany({
    with: {
      author: true,
    },
    where: eq(kudos.recipientId, loggedInUserId),
  });
  // return db
  //   .select()
  //   .from(kudo)
  //   .leftJoin(author, eq(author.id, kudo.authorId))
  //   .where(eq(kudo.recipientId, loggedInUserId));
}

export function getRecentKudos() {
  return db.query.kudos.findMany({
    limit: 3,
    orderBy: desc(kudos.createdAt),
    with: {
      recipient: true,
    },
  });
  // return db
  //   .select()
  //   .from(kudo)
  //   .leftJoin(recipient, eq(recipient.id, kudo.recipientId))
  //   .limit(3)
  //   .orderBy(desc(kudo.createdAt));
}

export type RecentKudos = ReturnType<typeof getRecentKudos>;
