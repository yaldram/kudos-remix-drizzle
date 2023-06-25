import type { LoaderArgs } from "@remix-run/node";
import { UsersPanel } from "~/components/templates";

import { Layout } from "~/layouts/Layout";
import { requireUserLogin } from "~/services/sessions.server";

export async function loader({ request }: LoaderArgs) {
  await requireUserLogin(request);

  return null;
}

export default function HomePage() {
  return (
    <Layout>
      <div className="h-full flex">
        <div className="w-1/6 bg-gray-200 flex flex-col">
          <UsersPanel users={[]} />
        </div>
      </div>
    </Layout>
  );
}
