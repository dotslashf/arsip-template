"use client";

import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { api } from "~/trpc/react";
import { sendGAEvent } from "@next/third-parties/google";
import { useRouter, useSearchParams } from "next/navigation";
import { type Tag as TagType } from "@prisma/client";
import { DAYS } from "~/lib/constant";
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
      sendGAEvent("event", "buttonClicked", {
        value: `tag:${tag.name}`,
      });
    }
    return router.push(`?${currentParams.toString()}`);
  };

  return (
    <ScrollArea className="w-full whitespace-nowrap border-b border-t py-2">
      <div className="flex w-max space-x-2 py-2">
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
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
