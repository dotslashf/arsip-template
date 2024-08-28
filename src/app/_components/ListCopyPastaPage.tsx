"use client";

import { useSearchParams } from "next/navigation";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";
import { ArrowDown, LoaderCircle, Skull } from "lucide-react";
import { Suspense } from "react";
import ListTags from "~/components/ListTags";
import { sendGAEvent } from "@next/third-parties/google";
import ListTagsSkeleton from "~/components/ListTagsSkeleton";
import dynamic from "next/dynamic";
import { Skeleton } from "~/components/ui/skeleton";
import CardMinimal from "~/components/CopyPasta/CardMinimal";

const SearchBar = dynamic(() => import("../../components/SearchBar"), {
  ssr: false,
  loading() {
    return (
      <div className="col-span-3 flex space-x-2">
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
  const [{ pages }, allCopyPastas] =
    api.copyPasta.list.useSuspenseInfiniteQuery(
      {
        limit: 9,
        search,
        tag,
        byUserId,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
    );

  const { isFetchingNextPage, fetchNextPage, hasNextPage } = allCopyPastas;

  async function handleNextList() {
    await fetchNextPage();
    sendGAEvent("event", "buttonClicked", { value: "home.nextList" });
  }

  function getContent() {
    if (isFetchingNextPage) {
      return (
        <span className="flex items-center">
          Memuat <LoaderCircle className="ml-2 h-4 w-4 animate-spin" />
        </span>
      );
    } else if (hasNextPage) {
      return (
        <span className="flex items-center">
          Lebih Banyak <ArrowDown className="ml-2 h-4 w-4" />
        </span>
      );
    } else {
      return (
        <span className="flex items-center">
          Tidak Ada Template Lagi <Skull className="ml-2 h-4 w-4" />
        </span>
      );
    }
  }

  return (
    <div className="flex w-full flex-col gap-4" id="main">
      <SearchBar />
      <Suspense fallback={<ListTagsSkeleton />}>
        <ListTags id={tag} />
      </Suspense>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4 lg:grid-cols-3">
        {pages
          ? pages.map((page) =>
              page.copyPastas.map((copy) => {
                return (
                  <div
                    key={copy.id}
                    className="col-span-3 w-full shadow-sm md:col-span-2 lg:col-span-1"
                  >
                    <CardMinimal copyPasta={copy} />
                  </div>
                );
              }),
            )
          : null}
      </div>
      <Button
        onClick={handleNextList}
        disabled={!hasNextPage || isFetchingNextPage}
      >
        {getContent()}
      </Button>
    </div>
  );
}
