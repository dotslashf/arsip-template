import ProfileCopyPastaCard from "~/components/ProfileCopyPastaCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { api } from "~/trpc/react";

export default function DashboardProfileRoleAdmin() {
  const list = api.profile.listDisapprovedCopyPasta.useInfiniteQuery(
    {
      limit: 10,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );

  return (
    <div className="w-full">
      <Tabs defaultValue="disapproved" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger className="w-full" value="disapproved">
            Menunggu
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
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
