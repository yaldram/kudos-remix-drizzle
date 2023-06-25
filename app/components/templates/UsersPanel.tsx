import { useNavigate } from "@remix-run/react";
import type { User } from "~/drizzle/schemas/users.db.server";
import { getUserProfile } from "~/utils/helpers";

import { Button, Avatar } from "../atoms";

type UsersPanelProps = {
  users: User[];
};

export function UsersPanel(props: UsersPanelProps) {
  const navigate = useNavigate();

  return (
    <>
      <div className="text-center bg-gray-300 h-20 flex items-center justify-center">
        <h2 className="text-xl text-blue-600 font-semibold">My Team</h2>
      </div>
      <div className="flex-1 overflow-y-scroll py-4 flex flex-col gap-y-10">
        {props.users.map((user) => (
          <Avatar
            key={user.id}
            userProfile={getUserProfile(user)}
            className="h-24 w-24 mx-auto flex-shrink-0"
            onClick={() => navigate(`kudo/${user.id}`)}
          />
        ))}
      </div>
      <div className="text-center p-6 bg-gray-300">
        <form action="/logout" method="post">
          <Button type="submit">Logout</Button>
        </form>
      </div>
    </>
  );
}
