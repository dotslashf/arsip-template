import { Card, CardContent } from "~/components/ui/card";
import Link from "next/link";
import { badgeVariants } from "~/components/ui/badge";
import { type CopyPasta, type Tag } from "@prisma/client";
import { cn } from "~/lib/utils";
import CopyPastaContent from "./CopyPastaContent";
import { buttonVariants } from "./ui/button";
import { LinkIcon } from "./ui/icons";

export interface CopyPastaCardWithTagsProps extends CopyPasta {
  CopyPastasOnTags: ({ tags: Tag } & {
    copyPastaId: string;
    tagId: string;
  })[];
  fullMode?: boolean;
}

export interface CopyPastaProps {
  copyPastaProps: CopyPastaCardWithTagsProps;
}

export default function CopyPastaCard({ copyPastaProps }: CopyPastaProps) {
  return (
    <Card
      className={cn(
        "h-full w-full text-justify shadow-sm",
        copyPastaProps.fullMode ? "col-span-2 lg:max-w-4xl" : "lg:max-w-md",
      )}
    >
      <CardContent className="flex h-full flex-col justify-between gap-2 p-6">
        <div className="text-sm text-primary">
          {
            <CopyPastaContent
              content={copyPastaProps.content}
              fullMode={copyPastaProps.fullMode}
              id={copyPastaProps.id}
            />
          }
        </div>
        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
          <span>Posted on {copyPastaProps.createdAt.toDateString()}</span>
          {copyPastaProps.CopyPastasOnTags.length ||
          copyPastaProps.sourceUrl ? (
            <div className="relative flex w-full items-center justify-between">
              {copyPastaProps.CopyPastasOnTags.length ? (
                <div className="flex flex-wrap gap-2">
                  {copyPastaProps.CopyPastasOnTags.map((tag) => (
                    <Link
                      href={`/?tag=${tag.tags.id}`}
                      key={tag.tags.id}
                      className={badgeVariants({ variant: "default" })}
                      prefetch={false}
                    >
                      {tag.tags.name}
                    </Link>
                  ))}
                </div>
              ) : null}
              {copyPastaProps.sourceUrl ? (
                <div className="absolute right-0">
                  <Link
                    href={copyPastaProps.sourceUrl}
                    className={cn(
                      buttonVariants({ variant: "link", size: "url" }),
                    )}
                    prefetch={false}
                  >
                    Cek Doksli <LinkIcon className="ml-2 h-3 w-3" />
                  </Link>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
