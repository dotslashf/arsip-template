import ProfileCopyPastaCard from "~/components/ProfileCopyPastaCard";
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
    <div className="w-full lg:w-3/4">
      <Tabs defaultValue="approved" className="w-full">
        <TabsList className="w-full bg-secondary-foreground/10">
          <TabsTrigger className="w-full" value="approved">
            Disetujui
          </TabsTrigger>
          <TabsTrigger className="w-full" value="disapproved">
            Menunggu
          </TabsTrigger>
        </TabsList>
        <TabsContent
          value="approved"
          className="grid grid-cols-1 gap-2 lg:grid-cols-2 lg:gap-4"
        >
          <ProfileCopyPastaCard
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
        <TabsContent value="disapproved" className="grid grid-cols-1 gap-y-2">
          <ProfileCopyPastaCard
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
    </div>
  );
}
