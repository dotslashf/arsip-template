import SkeletonCopyPasta from "./SkeletonCopyPasta";

export default function SkeletonListCopyPasta() {
  return (
    <div className="flex w-full max-w-3xl flex-col gap-4">
      <div className="flex flex-col gap-4">
        {new Array(9).fill(false).map((_, i) => (
          <SkeletonCopyPasta key={i} />
        ))}
      </div>
    </div>
  );
}
