"use client";

import { useSearchParams } from "next/navigation";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";
import SearchBar from "../../components/SearchBar";
import { ArrowDown, LoaderCircle, Skull } from "lucide-react";
import { Suspense } from "react";
import ListTags from "~/components/ListTags";
import { sendGAEvent } from "@next/third-parties/google";
import ListTagsSkeleton from "~/components/ListTagsSkeleton";
import CopyPastaCardMinimal from "~/components/CopyPastaCardMinimal";

export function ListCopyPasta() {
  const searchParams = useSearchParams();
  const search = searchParams.get("search");
  const tag = searchParams.get("tag");
  const byUserId = searchParams.get("byUserId");
  const [{ pages }, allCopyPastas] =
    api.copyPasta.list.useSuspenseInfiniteQuery(
      {
        limit: 10,
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
          Sedang Memuat <LoaderCircle className="ml-2 h-4 w-4 animate-spin" />
        </span>
      );
    } else if (hasNextPage) {
      return (
        <span className="flex items-center">
          Muat Lebih Banyak <ArrowDown className="ml-2 h-4 w-4" />
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
    <div className="flex w-full flex-col gap-4">
      <div className="grid grid-cols-1 gap-y-2 lg:grid-cols-2 lg:gap-4">
        <SearchBar />
        <Suspense fallback={<ListTagsSkeleton />}>
          <ListTags id={tag} />
        </Suspense>
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
