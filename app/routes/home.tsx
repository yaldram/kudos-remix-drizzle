import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";

import { KudoCard } from "~/components/molecules";
import type { User } from "~/drizzle/schemas/users.db.server";
import { Layout } from "~/layouts/Layout";
import { getReceivedKudos, getRecentKudos } from "~/services/kudos.server";
import { requireUserLogin } from "~/services/sessions.server";
import { getOtherUsers, getUserById } from "~/services/users.server";
import { getUserProfile } from "~/utils/helpers";
import {
  RecentKudosPanel,
  SearchPanel,
  UsersPanel,
} from "~/components/templates";

export async function loader({ request }: LoaderArgs) {
  const recentKudosPromise = getRecentKudos();
  const loggedInUserId = await requireUserLogin(request);

  const [[loggedInUser], users, receivedKudos, recentKudos] = await Promise.all(
    [
      getUserById(loggedInUserId),
      getOtherUsers(loggedInUserId),
      getReceivedKudos(loggedInUserId),
      recentKudosPromise,
    ]
  );

  return json({ users, loggedInUser, receivedKudos, recentKudos });
}

export default function HomePage() {
  const { users, loggedInUser, receivedKudos, recentKudos } =
    useLoaderData<typeof loader>();

  return (
    <Layout>
      <Outlet />
      <div className="h-full flex">
        <div className="w-1/6 bg-gray-200 flex flex-col">
          <UsersPanel users={users} />
        </div>
        <div className="flex-1 flex flex-col">
          <SearchPanel user={loggedInUser} />
          <div className="flex-1 flex">
            <div className="w-full p-10 flex flex-col gap-y-4">
              {receivedKudos.map(({ author, kudo }) => (
                <KudoCard
                  key={kudo.id}
                  userProfile={getUserProfile(author as User)}
                  kudo={kudo}
                />
              ))}
            </div>
            <RecentKudosPanel records={recentKudos} />
          </div>
        </div>
      </div>
    </Layout>
  );
}
