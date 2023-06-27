import type { RecentKudos } from "~/services/kudos.server";
import { getUserProfile } from "~/utils/helpers";
import { emojiMap } from "~/utils/constants";
import type { User } from "~/drizzle/schemas/users.db.server";
import { Avatar } from "../atoms";

type RecentBarProps = {
  records: Awaited<RecentKudos>;
};

export function RecentKudosPanel({ records }: RecentBarProps) {
  return (
    <div className="w-1/5 border-l-4 border-l-yellow-300 flex flex-col items-center">
      <h2 className="text-xl text-yellow-300 font-semibold my-6">
        Recent Kudos
      </h2>
      <div className="h-full flex flex-col gap-y-10 mt-10">
        {/* {records.map(({ kudo, recipeint }) => (
          <div className="h-24 w-24 relative" key={kudo.id}>
            <Avatar
              userProfile={getUserProfile(recipeint as User)}
              className="w-20 h-20"
            />
            <div className="h-8 w-8 text-3xl bottom-2 right-4 rounded-full absolute flex justify-center items-center">
              {emojiMap[kudo.style.emoji]}
            </div>
          </div>
        ))} */}
        {records.map((kudo) => (
          <div className="h-24 w-24 relative" key={kudo.id}>
            <Avatar
              userProfile={getUserProfile(kudo.recipient as User)}
              className="w-20 h-20"
            />
            <div className="h-8 w-8 text-3xl bottom-2 right-4 rounded-full absolute flex justify-center items-center">
              {emojiMap[kudo.style.emoji]}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
