import { useNavigate } from "@remix-run/react";

import type { User } from "~/drizzle/schemas/users.db.server";
import { getUserProfile } from "~/utils/helpers";
import { Avatar } from "../atoms";

type SearchPanelProps = {
  user: User;
};

export function SearchPanel(props: SearchPanelProps) {
  const navigate = useNavigate();

  return (
    <div className="w-full px-6 items-center gap-x-4 border-b-4 border-b-yellow-300 h-20 flex justify-end p-2">
      <Avatar
        className="h-14 w-14 transition duration-300 ease-in-out hover:scale-110 hover:border-2 hover:border-yellow-300"
        userProfile={getUserProfile(props.user)}
        onClick={() => navigate("profile")}
      />
    </div>
  );
}
