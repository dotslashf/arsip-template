import ProfileCopyPastaCard from "~/components/ProfileCopyPastaCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { api } from "~/trpc/react";

export default function DashboardProfileRoleAdmin() {
  const list = api.dashboard.listDisapprovedCopyPasta.useInfiniteQuery(
    {
      limit: 10,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );

  const listApprovedByUserId =
    api.dashboard.listApprovedByUserId.useInfiniteQuery(
      {
        limit: 10,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
    );

  return (
    <div className="w-full lg:w-3/4">
      <Tabs defaultValue="disapproved" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger className="w-full" value="disapproved">
            Perlu disetujui
          </TabsTrigger>
          <TabsTrigger className="w-full" value="approvedByUserId">
            Yang disetujui
          </TabsTrigger>
        </TabsList>
        <TabsContent
          value="disapproved"
          className="grid grid-cols-1 gap-2 lg:grid-cols-2 lg:gap-4"
        >
          <ProfileCopyPastaCard
            data={list.data}
            fn={{
              isFetchingNextPage: list.isFetchingNextPage,
              hasNextPage: list.hasNextPage,
              // eslint-disable-next-line @typescript-eslint/no-misused-promises
              fetchNextPage: list.fetchNextPage,
            }}
            type="disapproved"
            isApprovalMode={true}
          />
        </TabsContent>
        <TabsContent
          value="approvedByUserId"
          className="grid grid-cols-1 gap-2 lg:grid-cols-2 lg:gap-4"
        >
          <ProfileCopyPastaCard
            data={listApprovedByUserId.data}
            fn={{
              isFetchingNextPage: listApprovedByUserId.isFetchingNextPage,
              hasNextPage: listApprovedByUserId.hasNextPage,
              // eslint-disable-next-line @typescript-eslint/no-misused-promises
              fetchNextPage: listApprovedByUserId.fetchNextPage,
            }}
            type="approved"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
