"use client";

import { sendGAEvent } from "@next/third-parties/google";
import { type Session } from "next-auth";
import CopyPastaCardMinimal from "~/components/CopyPastaCardMinimal";
import GetContent from "~/components/GetContent";
import { Button } from "~/components/ui/button";
import UserProfileCard from "~/components/UserProfileCard";
import { api } from "~/trpc/react";

interface UserCopyPastaProps {
  id: string;
}
export default function UserCopyPastaPage({ id }: UserCopyPastaProps) {
  const [user] = api.user.byIdentifier.useSuspenseQuery({
    identifier: id,
  });
  const [{ pages }, allCopyPastas] =
    api.copyPasta.list.useSuspenseInfiniteQuery(
      {
        byUserId: user.id,
        limit: 6,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
    );

  const { isFetchingNextPage, fetchNextPage, hasNextPage } = allCopyPastas;

  async function handleNextList() {
    await fetchNextPage();
    sendGAEvent("event", "buttonClicked", { value: `user.${id}.nextList` });
  }

  const session: Session = {
    expires: "",
    user: {
      id,
      rank: user.rank!,
      role: user.role,
      name: user.name,
      username: user.username,
      avatarSeed: user.avatarSeed,
      loginProvider: user.accounts[0]?.provider ?? "",
    },
  };

  return (
    <div className="flex w-full flex-col items-start gap-4 lg:flex-row">
      <div className="flex w-full items-center justify-center lg:max-w-md">
        <UserProfileCard session={session} isPreviewMode={true} />
      </div>
      <div className="grid w-full flex-1 grid-cols-1 gap-4">
        {pages
          ? pages.map((page) =>
              page.copyPastas.map((copy) => {
                return (
                  <div className="col-span-3">
                    <CopyPastaCardMinimal
                      key={copy.id}
                      copyPastaProps={{
                        ...copy,
                        isCreatorAndDateShown: false,
                        isReactionSummaryShown: true,
                      }}
                    />
                  </div>
                );
              }),
            )
          : null}
        <div className="col-span-2 w-full">
          <Button
            onClick={handleNextList}
            disabled={!hasNextPage || isFetchingNextPage}
            className="w-full"
          >
            <GetContent
              hasNextPage={hasNextPage}
              isFetchingNextPage={isFetchingNextPage}
            />
          </Button>
        </div>
      </div>
    </div>
  );
}
