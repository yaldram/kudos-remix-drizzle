import type { ActionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";

import { logout } from "~/services/sessions.server";

export function loader() {
  return redirect("/");
}

export function action({ request }: ActionArgs) {
  return logout(request);
}
