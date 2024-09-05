import { type InfiniteData } from "@tanstack/react-query";
import SkeletonCopyPasta from "../Skeleton/CopyPasta";
import { Button } from "../ui/button";
import { type CardCopyPastaMinimal } from "~/lib/interface";
import CardDashboard from "../CopyPasta/CardDashboard";
import GetContent from "../GetContent";

interface ProfileCopyPastaCardProps {
  type: "approved" | "disapproved" | "deleted";
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
  return (
    <div className="grid w-full gap-4 rounded-md bg-secondary p-3">
      {data
        ? data.pages.map((page) =>
            page.copyPastas.map((copy) => {
              return (
                <CardDashboard
                  copyPasta={copy}
                  key={copy.id}
                  isApprovalMode={
                    (type === "disapproved" || type === "approved") &&
                    isApprovalMode
                  }
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
        <GetContent
          hasNextPage={fn.hasNextPage}
          isFetchingNextPage={fn.isFetchingNextPage}
        />
      </Button>
    </div>
  );
}
