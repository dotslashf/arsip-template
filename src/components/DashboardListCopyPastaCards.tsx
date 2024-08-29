import { type InfiniteData } from "@tanstack/react-query";
import SkeletonCopyPasta from "./SkeletonCopyPasta";
import { Button } from "./ui/button";
import { ArrowDown, LoaderCircle, Skull } from "lucide-react";
import { type CardCopyPastaMinimal } from "~/lib/interface";
import CardDashboard from "./CopyPasta/CardDashboard";

interface ProfileCopyPastaCardProps {
  type: "approved" | "disapproved";
  data?: InfiniteData<{
    copyPastas: CardCopyPastaMinimal[];
    nextCursor: string | undefined;
  }>;
  fn: {
    isFetchingNextPage: boolean;
    hasNextPage: boolean;
    fetchNextPage: () => void;
  };
  isApprovalMode?: boolean;
}

export default function DashboardListCopyPastaCards({
  data,
  fn,
  type,
  isApprovalMode,
}: ProfileCopyPastaCardProps) {
  function getContent() {
    if (fn.isFetchingNextPage) {
      return (
        <span className="flex items-center">
          Memuat <LoaderCircle className="ml-2 h-4 w-4 animate-spin" />
        </span>
      );
    } else if (fn.hasNextPage) {
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
    <div className="grid w-full gap-4 rounded-md bg-secondary p-3">
      {data
        ? data.pages.map((page) =>
            page.copyPastas.map((copy) => {
              return (
                <CardDashboard
                  copyPasta={copy}
                  key={copy.id}
                  isApprovalMode={type === "disapproved" && isApprovalMode}
                  type={type}
                />
              );
            }),
          )
        : new Array(1).fill(true).map((_, i) => {
            return <SkeletonCopyPasta key={i} />;
          })}
      <Button
        onClick={fn.fetchNextPage}
        disabled={!fn.hasNextPage || fn.isFetchingNextPage}
        className="w-full"
      >
        {getContent()}
      </Button>
    </div>
  );
}
