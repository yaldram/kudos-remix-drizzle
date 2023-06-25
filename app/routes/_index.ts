import type { LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";

import { requireUserLogin } from "~/services/sessions.server";

export async function loader({ request }: LoaderArgs) {
  await requireUserLogin(request);
  return redirect("/home");
}
