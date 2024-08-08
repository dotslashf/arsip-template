"use client";

import CopyPastaCard from "~/components/CopyPastaCard";
import SkeletonCopyPasta from "~/components/SkeletonCopyPasta";
import { api } from "~/trpc/react";

interface CopyPastaByIdProps {
  id: string;
}
export default function CopyPastaById({ id }: CopyPastaByIdProps) {
  const [copyPasta] = api.copyPasta.byId.useSuspenseQuery({
    id: id,
  });

  const { isLoading, data: related } = api.copyPasta.byTag.useQuery({
    tagIds: copyPasta.CopyPastasOnTags.map((tag) => tag.tagId),
    copyPastaId: copyPasta.id,
  });

  return (
    <div className="flex w-full flex-col gap-4">
      {copyPasta && (
        <CopyPastaCard
          key={id}
          copyPastaProps={{
            ...copyPasta,
            fullMode: true,
          }}
        />
      )}
      <div className="flex flex-col gap-2">
        <div className="self-center text-sm font-semibold">
          Template Yang Mungkin Sama:
        </div>
        <div className="grid w-full grid-cols-1 gap-2 lg:grid-cols-3">
          {related && !isLoading
            ? related.map((c) => {
                return (
                  <CopyPastaCard
                    key={c.id}
                    copyPastaProps={{
                      ...c,
                      createdBy: {
                        id: "",
                        name: "",
                      },
                      fullMode: false,
                    }}
                  />
                );
              })
            : new Array(3).fill(true).map((_, i) => {
                return <SkeletonCopyPasta key={i} />;
              })}
        </div>
      </div>
    </div>
  );
}
