import React from "react";

import type { UserProfile } from "~/drizzle/schemas/users.db.server";

type AvatarProps = {
  userProfile: UserProfile;
} & React.ComponentPropsWithoutRef<"div">;

export function Avatar(props: AvatarProps) {
  return (
    <div
      className={`${props.className} cursor-pointer bg-gray-400 rounded-full flex justify-center items-center`}
      onClick={props.onClick}
      style={{
        backgroundSize: "cover",
        ...(props.userProfile.profileUrl
          ? { backgroundImage: `url(${props.userProfile.profileUrl})` }
          : {}),
      }}
    >
      {!props.userProfile.profileUrl && (
        <h2>
          {props.userProfile.firstName.charAt(0).toUpperCase()}
          {props.userProfile.lastName.charAt(0).toUpperCase()}
        </h2>
      )}
    </div>
  );
}
