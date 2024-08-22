"use client";

import { sendGAEvent } from "@next/third-parties/google";
import { UserRole } from "@prisma/client";
import { Session } from "next-auth";
import CopyPastaCardMinimal from "~/components/CopyPastaCardMinimal";
import GetContent from "~/components/GetContent";
import { Button } from "~/components/ui/button";
import UserProfileCard from "~/components/UserProfileCard";
import { api } from "~/trpc/react";

interface UserCopyPastaProps {
  id: string;
}
export default function UserCopyPastaPage({ id }: UserCopyPastaProps) {
  const [user] = api.user.byId.useSuspenseQuery({
    id,
  });
  const [{ pages }, allCopyPastas] =
    api.copyPasta.list.useSuspenseInfiniteQuery(
      {
        byUserId: id,
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
      loginProvider: user.accounts[0]?.provider ?? "",
    },
  };

  return (
    <div className="flex w-full flex-col items-start gap-4 lg:flex-row">
      <div className="flex w-full items-center justify-center">
        <UserProfileCard session={session} isPreviewMode={true} />
      </div>
      <div className="grid grid-cols-2 gap-2">
        {pages
          ? pages.map((page) =>
              page.copyPastas.map((copy) => {
                return (
                  <CopyPastaCardMinimal
                    key={copy.id}
                    copyPastaProps={{
                      ...copy,
                      isCreatorAndDateShown: false,
                      isReactionSummaryShown: true,
                    }}
                  />
                );
              }),
            )
          : null}
        <div className="col-span-2">
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
