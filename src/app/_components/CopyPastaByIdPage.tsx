"use client";

import CardById from "~/components/CopyPasta/CardById";
import CardRelated from "~/components/CopyPasta/CardRelated";
import SkeletonCopyPasta from "~/components/Skeleton/SkeletonCopyPasta";
import { api } from "~/trpc/react";

interface CopyPastaByIdProps {
  id: string;
}
export default function CopyPastaById({ id }: CopyPastaByIdProps) {
  const [copyPasta] = api.copyPasta.byId.useSuspenseQuery(
    {
      id: id,
    },
    {
      staleTime: Infinity,
    },
  );

  const { isLoading, data: related } = api.copyPasta.byTag.useQuery(
    {
      tagIds: copyPasta.CopyPastasOnTags.map((tag) => tag.tagId),
      copyPastaId: copyPasta.id,
    },
    {
      staleTime: Infinity,
    },
  );

  return (
    <div className="flex w-full flex-col">
      {copyPasta && <CardById copyPasta={copyPasta} />}
      <div className="mt-10 flex flex-col gap-2 lg:mt-20">
        <div className="self-center text-sm font-semibold">
          Template Dengan Tag Yang Sama:
        </div>
        <div className="mt-2 grid w-full grid-cols-1 gap-4 lg:grid-cols-3">
          {related && !isLoading
            ? related.map((copy) => {
                return <CardRelated key={copy.id} copyPasta={copy} />;
              })
            : new Array(3).fill(true).map((_, i) => {
                return <SkeletonCopyPasta key={i} />;
              })}
        </div>
      </div>
    </div>
  );
}
