"use client";

import { usePathname } from "next/navigation";
import BreadCrumbs from "~/components/Common/BreadCrumbs";
import CardById from "~/components/CopyPasta/CardById";
import CardRelated from "~/components/CopyPasta/CardRelated";
import SkeletonCopyPasta from "~/components/Skeleton/CopyPasta";
import { getBreadcrumbs, getTweetId, trimContent } from "~/lib/utils";
import { api } from "~/trpc/react";
import TweetPage from "./TweetPage";

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

  const pathname = usePathname();
  const breadcrumbs = getBreadcrumbs(pathname);
  const currentPath = breadcrumbs.map((path, i) => {
    return {
      url: path.url,
      text:
        i === breadcrumbs.length - 1
          ? trimContent(copyPasta.content, 20)
          : path.text,
    };
  });

  return (
    <div className="flex w-full flex-col gap-6">
      <BreadCrumbs path={currentPath} />
      {copyPasta && <CardById copyPasta={copyPasta} />}
      <div className="flex flex-col gap-2">
        <div className="text-sm font-semibold">Tweet Preview:</div>
        {copyPasta.source === "Twitter" && copyPasta.sourceUrl && (
          <TweetPage id={getTweetId(copyPasta.sourceUrl)!} />
        )}
      </div>
      <div className="flex flex-col gap-2">
        <div className="text-sm font-semibold">
          Template Dengan Tag Yang Sama:
        </div>
        <div className="grid w-full grid-cols-1 gap-4 lg:grid-cols-3">
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
