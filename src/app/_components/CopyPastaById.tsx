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
    <div className="flex w-full max-w-4xl flex-col items-center gap-4">
      {copyPasta && (
        <CopyPastaCard
          key={id}
          copyPastaProps={{
            ...copyPasta,
            fullMode: true,
          }}
        />
      )}
      <>
        <Separator className="text-red-300" />
        <div className="flex flex-col gap-2">
          <div className="self-center text-sm font-semibold">
            Template Yang Mungkin Sama:
          </div>
          {relatedCopyPastas?.length ? (
            <div className="grid grid-cols-3 gap-2">
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
          ) : null}
        </div>
      </>
    </div>
  );
}
