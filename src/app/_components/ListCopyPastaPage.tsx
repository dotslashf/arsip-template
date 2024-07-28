"use client";

import { useSearchParams } from "next/navigation";
import CopyPastaCard from "~/components/CopyPastaCard";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";
import SearchBar from "../../components/SearchBar";
import { ArrowDown, LoaderCircle, Skull } from "lucide-react";

export function ListCopyPasta() {
  const searchParams = useSearchParams();
  const search = searchParams.get("search");
  const tag = searchParams.get("tag");
  const [{ pages }, allCopyPastas] =
    api.copyPasta.list.useSuspenseInfiniteQuery(
      {
        limit: 10,
        search,
        tag,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
    );

  const { isFetchingNextPage, fetchNextPage, hasNextPage } = allCopyPastas;

  return (
    <div className="flex w-full flex-col gap-4 lg:px-32">
      <div className="grid grid-cols-1 gap-y-2 lg:grid-cols-2 lg:gap-4">
        <SearchBar />
        {pages
          ? pages.map((page) =>
              page.copyPastas.map((copy) => {
                return <CopyPastaCard key={copy.id} copyPastaProps={copy} />;
              }),
            )
          : null}
      </div>
      <Button
        onClick={() => fetchNextPage()}
        disabled={!hasNextPage || isFetchingNextPage}
      >
        {isFetchingNextPage ? (
          <span className="flex items-center">
            Sedang Memuat <LoaderCircle className="ml-2 animate-spin" />
          </span>
        ) : hasNextPage ? (
          <span className="flex items-center">
            Muat Lebih Banyak <ArrowDown className="ml-2" />
          </span>
        ) : (
          <span className="flex items-center">
            Tidak Ada Template Lagi <Skull className="ml-2" />
          </span>
        )}
      </Button>
    </div>
  );
}
