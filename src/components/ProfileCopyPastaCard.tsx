import { type InfiniteData } from "@tanstack/react-query";
import CopyPastaCard, {
  type CopyPastaCardWithTagsProps,
} from "./CopyPastaCard";
import SkeletonCopyPasta from "./SkeletonCopyPasta";
import { Button } from "./ui/button";
import { ArrowDown, LoaderCircle, Skull } from "lucide-react";

interface ProfileCopyPastaCardProps {
  data?: InfiniteData<{
    copyPastas: CopyPastaCardWithTagsProps[];
    nextCursor: string | undefined;
  }>;
  fn: {
    isFetchingNextPage: boolean;
    hasNextPage: boolean;
    fetchNextPage: () => void;
  };
}

export default function ProfileCopyPastaCard({
  data,
  fn,
}: ProfileCopyPastaCardProps) {
  function getContent() {
    if (fn.isFetchingNextPage) {
      return (
        <span className="flex items-center">
          Sedang Memuat <LoaderCircle className="ml-2 h-4 w-4 animate-spin" />
        </span>
      );
    } else if (fn.hasNextPage) {
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
    <>
      {data
        ? data.pages.map((page) =>
            page.copyPastas.map((copy) => {
              return <CopyPastaCard key={copy.id} copyPastaProps={copy} />;
            }),
          )
        : new Array(4).fill(true).map((_, i) => {
            return <SkeletonCopyPasta key={i} />;
          })}
      <Button
        onClick={fn.fetchNextPage}
        disabled={!fn.hasNextPage || fn.isFetchingNextPage}
        className="col-span-2"
      >
        {getContent()}
      </Button>
    </>
  );
}
