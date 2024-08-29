import DashboardListCopyPastaCards from "~/components/DashboardListCopyPastaCards";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { api } from "~/trpc/react";
import { Badge } from "./ui/badge";
import { LoaderCircle } from "lucide-react";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";

export default function DashboardProfileRoleAdmin() {
  const list = api.dashboard.listWaitingApprovedCopyPasta.useInfiniteQuery(
    {
      limit: 5,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );

  const listApprovedByUserId =
    api.dashboard.listApprovedByUserId.useInfiniteQuery(
      {
        limit: 3,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
    );

  const listDeleted = api.dashboard.listDeleted.useInfiniteQuery(
    {
      limit: 3,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );

  const { data: count, isLoading } =
    api.dashboard.countCopyPastaAdmin.useQuery();

  return (
    <div className="w-full">
      <Tabs defaultValue="disapproved" className="w-full">
        <ScrollArea className="w-full">
          <TabsList className="h-14 w-full space-x-2 bg-secondary px-3">
            <TabsTrigger className="w-full" value="disapproved">
              Perlu disetujui{" "}
              <Badge variant={"destructive"} className="ml-2">
                {isLoading && <LoaderCircle className="w-3 animate-spin" />}
                {count?.isNotApproved}
              </Badge>
            </TabsTrigger>
            <TabsTrigger className="w-full" value="approvedByUserId">
              Yang disetujui{" "}
              <Badge className="ml-2">
                {isLoading && <LoaderCircle className="w-3 animate-spin" />}
                {count?.isApproved}
              </Badge>
            </TabsTrigger>
            <TabsTrigger className="w-full" value="deleted">
              Terhapus{" "}
              <Badge className="ml-2">
                {isLoading && <LoaderCircle className="w-3 animate-spin" />}
                {count?.isDeleted}
              </Badge>
            </TabsTrigger>
          </TabsList>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
        <TabsContent value="disapproved">
          <DashboardListCopyPastaCards
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
        <TabsContent value="approvedByUserId">
          <DashboardListCopyPastaCards
            data={listApprovedByUserId.data}
            fn={{
              isFetchingNextPage: listApprovedByUserId.isFetchingNextPage,
              hasNextPage: listApprovedByUserId.hasNextPage,
              // eslint-disable-next-line @typescript-eslint/no-misused-promises
              fetchNextPage: listApprovedByUserId.fetchNextPage,
            }}
            type="disapproved"
            isApprovalMode={true}
          />
        </TabsContent>
        <TabsContent value="deleted">
          <DashboardListCopyPastaCards
            data={listDeleted.data}
            fn={{
              isFetchingNextPage: listDeleted.isFetchingNextPage,
              hasNextPage: listDeleted.hasNextPage,
              // eslint-disable-next-line @typescript-eslint/no-misused-promises
              fetchNextPage: listDeleted.fetchNextPage,
            }}
            type="deleted"
            isApprovalMode={true}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
