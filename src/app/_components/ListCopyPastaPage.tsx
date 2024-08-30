"use client";

import { useSearchParams } from "next/navigation";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";
import { Suspense } from "react";
import ListTags from "~/components/ListTags";
import { sendGAEvent } from "@next/third-parties/google";
import ListTagsSkeleton from "~/components/ListTagsSkeleton";
import dynamic from "next/dynamic";
import { Skeleton } from "~/components/ui/skeleton";
import CardMinimal from "~/components/CopyPasta/CardMinimal";
import { ANALYTICS_EVENT } from "~/lib/constant";
import GetContent from "~/components/GetContent";
import { OriginSource } from "@prisma/client";
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";

const SearchBar = dynamic(() => import("../../components/SearchBar"), {
  ssr: false,
  loading() {
    return (
      <div className="flex w-full max-w-3xl space-x-2 self-center">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 w-10" />
        <Skeleton className="h-10 w-10" />
      </div>
    );
  },
});

export function ListCopyPasta() {
  const searchParams = useSearchParams();
  const search = searchParams.get("search");
  const tag = searchParams.get("tag");
  const byUserId = searchParams.get("byUserId");
  const source = searchParams.get("source") as OriginSource;
  const [{ pages }, allCopyPastas] =
    api.copyPasta.list.useSuspenseInfiniteQuery(
      {
        limit: 9,
        search,
        tag,
        byUserId,
        source,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
    );

  const { isFetchingNextPage, fetchNextPage, hasNextPage } = allCopyPastas;

  async function handleNextList() {
    await fetchNextPage();
    sendGAEvent("event", ANALYTICS_EVENT.BUTTON_CLICKED, {
      value: "home.next",
    });
  }

  return (
    <div className="flex w-full flex-col gap-4" id="main">
      <SearchBar />
      <div className="flex w-full space-x-2 rounded-md border bg-secondary p-3 md:hidden">
        <span className="font-mono text-sm font-bold">Tags:</span>
        <ScrollArea className="w-full">
          <div className="flex space-x-2 whitespace-nowrap">
            <ListTags id={tag} />
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
      <div className="flex max-w-3xl flex-col gap-4 self-center">
        <div className="flex w-full gap-4">
          <div className="flex w-full flex-col gap-4">
            {pages
              ? pages.map((page) =>
                  page.copyPastas.map((copy) => {
                    return <CardMinimal key={copy.id} copyPasta={copy} />;
                  }),
                )
              : null}

            <Button
              onClick={handleNextList}
              disabled={!hasNextPage || isFetchingNextPage}
            >
              <GetContent
                hasNextPage={hasNextPage}
                isFetchingNextPage={isFetchingNextPage}
              />
            </Button>
          </div>
          <div className="sticky top-[4.5rem] hidden h-fit w-full max-w-[12.5rem] flex-col space-y-2 rounded-md border bg-secondary px-3 py-1.5 md:flex">
            <span className="font-mono text-sm font-bold">Tags:</span>
            <ScrollArea className="h-44">
              <div className="flex flex-wrap gap-2">
                <ListTags id={tag} />
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );
}
