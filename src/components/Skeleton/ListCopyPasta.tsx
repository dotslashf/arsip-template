import SkeletonCopyPasta from "./CopyPasta";

export default function SkeletonListCopyPasta() {
  return (
    <div className="order-last col-span-3 flex flex-col gap-4 md:order-first md:col-span-2">
      <div className="flex w-full flex-col gap-4">
        {new Array(9).fill(false).map((_, i) => (
          <SkeletonCopyPasta key={i} />
        ))}
      </div>
    </div>
  );
}
