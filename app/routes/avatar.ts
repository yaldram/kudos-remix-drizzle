import type { ActionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { eq } from "drizzle-orm";
import { db } from "~/drizzle/config.db.server";
import { users } from "~/drizzle/schemas/users.db.server";

import { uploadAvatar } from "~/services/r2.server";
import { requireUserLogin } from "~/services/sessions.server";

export async function action({ request }: ActionArgs) {
  const userId = await requireUserLogin(request);

  const imageUrl = await uploadAvatar(request);

  await db
    .update(users)
    .set({
      profileUrl: imageUrl,
    })
    .where(eq(users.id, userId));

  return json({ imageUrl });
}
