import DashboardListCopyPastaCards from "~/components/Dashboard/DashboardListCopyPastaCards";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { api } from "~/trpc/react";

export default function DashboardProfileRoleUser() {
  const listApproved = api.dashboard.list.useInfiniteQuery(
    {
      limit: 10,
      type: "approved",
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );

  const listNotApproved = api.dashboard.list.useInfiniteQuery(
    {
      limit: 10,
      type: "disapproved",
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );

  return (
    <Tabs defaultValue="approved" className="w-full">
      <TabsList className="h-14 w-full space-x-2 bg-secondary px-3">
        <TabsTrigger className="w-full" value="approved">
          Disetujui
        </TabsTrigger>
        <TabsTrigger className="w-full" value="disapproved">
          Menunggu
        </TabsTrigger>
      </TabsList>
      <TabsContent value="approved" className="gap-4">
        <DashboardListCopyPastaCards
          data={listApproved.data}
          fn={{
            isFetchingNextPage: listApproved.isFetchingNextPage,
            hasNextPage: listApproved.hasNextPage,
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            fetchNextPage: listApproved.fetchNextPage,
          }}
          type="approved"
        />
      </TabsContent>
      <TabsContent value="disapproved" className="gap-4">
        <DashboardListCopyPastaCards
          data={listNotApproved.data}
          type="disapproved"
          fn={{
            isFetchingNextPage: listNotApproved.isFetchingNextPage,
            hasNextPage: listNotApproved.hasNextPage,
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            fetchNextPage: listNotApproved.fetchNextPage,
          }}
          isApprovalMode={false}
        />
      </TabsContent>
    </Tabs>
  );
}
