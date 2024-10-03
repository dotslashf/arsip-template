import { Skeleton } from "~/components/ui/skeleton";

export default function RankSkeleton() {
  return (
    <div className="flex w-full flex-col self-start">
      <Skeleton className="h-6 w-1/3" />
      <Skeleton className="mt-2 h-4 w-1/4" />
      <div className="mt-14 flex flex-col space-y-4">
        <Skeleton className="h-12" />
        <Skeleton className="h-12" />
        <Skeleton className="h-12" />
      </div>
    </div>
  );
}
