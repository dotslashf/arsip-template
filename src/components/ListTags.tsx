"use client";

import { api } from "~/trpc/react";
import { sendGAEvent } from "@next/third-parties/google";
import { useRouter, useSearchParams } from "next/navigation";
import { type Tag as TagType } from "@prisma/client";
import { ANALYTICS_EVENT, DAYS } from "~/lib/constant";
import Tag from "./ui/tags";

interface ListTagsProps {
  id: string | null;
}
export default function ListTags({ id }: ListTagsProps) {
  const [tags] = api.tag.list.useSuspenseQuery(undefined, {
    staleTime: Infinity,
    refetchOnMount: false,
    gcTime: 7 * DAYS,
  });
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleTagClick = (tag: TagType, isActive: boolean) => {
    const currentParams = new URLSearchParams(searchParams);
    if (isActive) {
      currentParams.delete("tag");
    } else {
      currentParams.set("tag", tag.id);
      sendGAEvent("event", ANALYTICS_EVENT.BUTTON_CLICKED, {
        value: `tag.${tag.name}`,
      });
      window.umami?.track(ANALYTICS_EVENT.BUTTON_CLICKED, {
        value: `tag.${tag.name}`,
      });
    }
    return router.push(`?${currentParams.toString()}`);
  };

  return (
    <>
      {[...tags]
        .sort((a, b) => {
          if (a.id === id) return -1;
          if (b.id === id) return 1;
          return 0;
        })
        .map((tag) => (
          <Tag
            key={tag.id}
            onClick={() => handleTagClick(tag, id === tag.id)}
            tagContent={tag}
            active={id === tag.id}
            className="rounded-sm shadow-sm hover:bg-primary hover:text-primary-foreground"
          />
        ))}
    </>
  );
}
