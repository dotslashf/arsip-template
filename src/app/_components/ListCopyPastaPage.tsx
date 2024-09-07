"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "~/components/ui/skeleton";
import SkeletonListCopyPasta from "~/components/Skeleton/ListCopyPasta";
import { useSearchParams } from "next/navigation";
import SkeletonTrending from "~/components/Skeleton/Trending";

const TrendingHome = dynamic(() => import("~/components/Trending/Trending"), {
  ssr: false,
  loading() {
    return (
      <div className="order-last col-span-3 flex w-full flex-col gap-4 md:col-span-1">
        {new Array(2).fill(false).map((_, i) => (
          <SkeletonTrending key={i} />
        ))}
      </div>
    );
  },
});

const SearchBar = dynamic(() => import("~/components/SearchBar"), {
  ssr: false,
  loading() {
    return (
      <div className="flex w-full space-x-2 self-center">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 w-10" />
        <Skeleton className="h-10 w-10" />
      </div>
    );
  },
});

const Lists = dynamic(() => import("~/components/CopyPasta/Lists"), {
  ssr: false,
  loading() {
    return <SkeletonListCopyPasta />;
  },
});

export function ListCopyPasta() {
  const searchParams = useSearchParams();
  const tag = searchParams.get("tag");

  return (
    <div className="flex w-full flex-col gap-4" id="main">
      <SearchBar />
      <div className="flex w-full flex-col gap-4 self-center">
        <div className="grid w-full grid-cols-3 gap-4">
          <Lists />
          <TrendingHome tag={tag} />
        </div>
      </div>
    </div>
  );
}
