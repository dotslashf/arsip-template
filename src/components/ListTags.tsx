"use client";

import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { Badge } from "./ui/badge";
import { api } from "~/trpc/react";
import { sendGAEvent } from "@next/third-parties/google";
import { useRouter, useSearchParams } from "next/navigation";
import { Tag } from "@prisma/client";

interface ListTagsProps {
  id: string | null;
}
export default function ListTags({ id }: ListTagsProps) {
  const [tags] = api.tag.list.useSuspenseQuery();
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleTagClick = (tag: Tag) => {
    const currentParams = new URLSearchParams(searchParams);
    currentParams.set("tag", tag.id);
    sendGAEvent("event", "buttonClicked", {
      value: `tag:${tag.name}`,
    });
    router.push(`?${currentParams.toString()}`);
  };

  return (
    <ScrollArea className="col-span-2 w-full whitespace-nowrap rounded-md">
      <div className="flex w-max space-x-2 py-2">
        {tags.map((tag) => (
          <Badge
            onClick={() => handleTagClick(tag)}
            className={
              "cursor-pointer shadow-sm hover:bg-primary hover:text-primary-foreground"
            }
            variant={id === tag.id ? "default" : "outline"}
          >
            {tag.name}
          </Badge>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
