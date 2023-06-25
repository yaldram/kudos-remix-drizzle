import type { InferModel } from "drizzle-orm";
import { pgTable, uuid, text, timestamp, json } from "drizzle-orm/pg-core";

import type { KudoStyle } from "~/utils/constants";
import { users } from "./users.db.server";

const defaultStyle: KudoStyle = {
  backgroundColor: "red",
  textColor: "white",
  emoji: "thumbsup",
};

export const kudos = pgTable("kudos", {
  id: uuid("id").primaryKey().defaultRandom(),
  message: text("message").notNull(),
  style: json("style").notNull().default(defaultStyle).$type<KudoStyle>(),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow(),
  authorId: uuid("author_id")
    .references(() => users.id, {
      onDelete: "cascade",
    })
    .notNull(),
  recipientId: uuid("recipient_id")
    .references(() => users.id, {
      onDelete: "cascade",
    })
    .notNull(),
});

export type Kudo = InferModel<typeof kudos>;

export type NewKudo = InferModel<typeof kudos, "insert">;
