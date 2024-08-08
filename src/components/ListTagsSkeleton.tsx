import { Skeleton } from "./ui/skeleton";

export default function ListTagsSkeleton() {
  return (
    <div className="col-span-2 flex space-x-2 py-2">
      {new Array(6).fill(true).map((_, i) => (
        <Skeleton key={i} className="h-5 w-16 rounded-full" />
      ))}
    </div>
  );
}
