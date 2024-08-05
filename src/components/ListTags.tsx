"use client";

import Link from "next/link";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { cn } from "~/lib/utils";
import { badgeVariants } from "./ui/badge";
import { api } from "~/trpc/react";

interface ListTagsProps {
  id: string | null;
}
export default function ListTags({ id }: ListTagsProps) {
  const [tags] = api.tag.list.useSuspenseQuery();

  return (
    <ScrollArea className="col-span-2 w-full whitespace-nowrap rounded-md">
      <div className="flex w-max space-x-2 py-2">
        {tags.map((tag) => (
          <Link
            href={`/?tag=${tag.id}`}
            key={tag.id}
            className={cn(
              id === tag.id
                ? badgeVariants({ variant: "default" })
                : badgeVariants({ variant: "outline" }),
              "hover:bg-primary hover:text-primary-foreground",
            )}
            prefetch={false}
          >
            {tag.name}
          </Link>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
