import type { Kudo } from "~/drizzle/schemas/kudos.db.server";
import type { UserProfile } from "~/drizzle/schemas/users.db.server";
import { backgroundColorMap, textColorMap, emojiMap } from "~/utils/constants";
import { Avatar } from "../atoms";

type KudoProps = {
  kudo: Pick<Kudo, "message" | "style">;
  userProfile: UserProfile;
};

export function KudoCard({ kudo, userProfile }: KudoProps) {
  return (
    <div
      className={`flex ${
        backgroundColorMap[kudo.style.backgroundColor]
      } p-4 rounded-xl w-full gap-x-2 relative`}
    >
      <div>
        <Avatar userProfile={userProfile} className="h-16 w-16" />
      </div>
      <div className="flex flex-col">
        <p
          className={`${
            textColorMap[kudo.style.textColor]
          } font-bold text-lg whitespace-pre-wrap break-all`}
        >
          {userProfile.firstName} {userProfile.lastName}
        </p>
        <p
          className={`${
            textColorMap[kudo.style.textColor]
          } whitespace-pre-wrap break-all`}
        >
          {kudo.message}
        </p>
      </div>
      <div className="absolute bottom-4 right-4 bg-white rounded-full h-10 w-10 flex items-center justify-center text-2xl">
        {emojiMap[kudo.style.emoji]}
      </div>
    </div>
  );
}
