"use client";

import { Separator } from "@radix-ui/react-separator";
import CopyPastaCard from "~/components/CopyPastaCard";
import { api } from "~/trpc/react";

interface CopyPastaByIdProps {
  id: string;
}
export default function CopyPastaById({ id }: CopyPastaByIdProps) {
  const [copyPasta] = api.copyPasta.byId.useSuspenseQuery({
    id: id,
  });

  const [relatedCopyPastas] = copyPasta.id
    ? api.copyPasta.byTag.useSuspenseQuery({
        tagIds: copyPasta.CopyPastasOnTags.length
          ? copyPasta.CopyPastasOnTags.map((tag) => tag.tagId)
          : null,
        copyPastaId: id,
      })
    : [];

  return (
    <div className="flex w-full flex-col gap-4 lg:px-32">
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
        {relatedCopyPastas?.length && (
          <div className="grid w-full grid-cols-1 gap-2 lg:grid-cols-3">
            {relatedCopyPastas.map((c) => {
              return (
                <CopyPastaCard
                  key={c.id}
                  copyPastaProps={{
                    ...c,
                    fullMode: false,
                  }}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
