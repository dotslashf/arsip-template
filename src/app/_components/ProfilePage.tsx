"use client";

import ProfileCopyPastaCard from "~/components/ProfileCopyPastaCard";
import { useSession } from "~/components/SessionContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import UserProfileCard from "~/components/UserProfileCard";
import { api } from "~/trpc/react";

export default function ProfilePage() {
  const session = useSession();
  const listApproved = api.profile.list.useInfiniteQuery(
    {
      limit: 1,
      type: "approved",
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );

  const listNotApproved = api.profile.list.useInfiniteQuery(
    {
      limit: 1,
      type: "notApproved",
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );

  return (
    <div className="flex w-full flex-col items-start gap-4 lg:flex-row">
      <UserProfileCard session={session} />
      <div className="w-full">
        <Tabs defaultValue="approved" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger className="w-full" value="approved">
              Disetujui
            </TabsTrigger>
            <TabsTrigger className="w-full" value="notApproved">
              Menunggu
            </TabsTrigger>
          </TabsList>
          <TabsContent value="approved" className="grid grid-cols-1 gap-y-2">
            <ProfileCopyPastaCard
              data={listApproved.data}
              fn={{
                isFetchingNextPage: listApproved.isFetchingNextPage,
                hasNextPage: listApproved.hasNextPage,
                // eslint-disable-next-line @typescript-eslint/no-misused-promises
                fetchNextPage: listApproved.fetchNextPage,
              }}
            />
          </TabsContent>
          <TabsContent value="notApproved" className="grid grid-cols-1 gap-y-2">
            <ProfileCopyPastaCard
              data={listNotApproved.data}
              fn={{
                isFetchingNextPage: listNotApproved.isFetchingNextPage,
                hasNextPage: listNotApproved.hasNextPage,
                // eslint-disable-next-line @typescript-eslint/no-misused-promises
                fetchNextPage: listNotApproved.fetchNextPage,
              }}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
