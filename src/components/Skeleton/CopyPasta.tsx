import { cn } from "~/utils";
import { Card, CardContent } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";

export default function SkeletonCopyPasta() {
  return (
    <Card className={cn("w-full text-justify shadow-sm")}>
      <CardContent className="flex h-full flex-col justify-between gap-2 p-6 hover:cursor-auto">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/4" />
        <div className="mt-4 flex space-x-1">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-12" />
        </div>
      </CardContent>
    </Card>
  );
}
