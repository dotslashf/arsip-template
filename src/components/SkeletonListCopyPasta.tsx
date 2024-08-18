import SkeletonCopyPasta from "./SkeletonCopyPasta";

export default function SkeletonListCopyPasta() {
  return (
    <div className="flex w-full flex-col gap-4">
      <div className="grid grid-cols-1 gap-y-2 lg:grid-cols-3 lg:gap-4">
        {new Array(9).fill(false).map((_, i) => (
          <SkeletonCopyPasta key={i} />
        ))}
      </div>
    </div>
  );
}
