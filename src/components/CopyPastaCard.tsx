import { Card, CardContent } from "~/components/ui/card";
import Link from "next/link";
import { badgeVariants } from "~/components/ui/badge";
import { type CopyPasta, type Tag } from "@prisma/client";
import { cn, formatDateToHuman } from "~/lib/utils";
import CopyPastaContent from "./CopyPastaContent";
import { buttonVariants } from "./ui/button";
import { Link2 } from "lucide-react";
import { sourceEnumHash } from "~/app/_components/CreateCopyPasta";
import { useToast } from "./ui/use-toast";

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
  const { toast } = useToast();

  function handleCopy() {
    navigator.clipboard
      .writeText(copyPastaProps.content)
      .then(() => {
        toast({
          description: "Templatenya udah ke copy nih",
          className: cn(
            "fixed top-0 m-auto left-0 right-0 lg:max-w-md max-w-sm mt-4",
          ),
        });
      })
      .catch((err) => console.log(err));
  }

  return (
    <Card
      className={cn(
        "h-full w-full text-justify shadow-sm",
        copyPastaProps.fullMode ? "col-span-2 lg:max-w-4xl" : "lg:max-w-md",
      )}
    >
      <CardContent
        className={cn(
          "flex h-full flex-col justify-between gap-2 p-6 hover:cursor-auto",
          copyPastaProps.CopyPastasOnTags.some(
            (tag) => tag.tags.name === "NSFW",
          ) &&
            !copyPastaProps.fullMode &&
            "cursor-none blur transition hover:blur-none",
        )}
      >
        <div className="text-sm text-primary">
          {
            <CopyPastaContent
              content={copyPastaProps.content}
              fullMode={copyPastaProps.fullMode}
              id={copyPastaProps.id}
              onClick={handleCopy}
            />
          }
        </div>
        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
          <span>
            Kejadian pada:{" "}
            {formatDateToHuman(copyPastaProps.postedAt ?? new Date())}
          </span>
          {copyPastaProps.CopyPastasOnTags.length ||
          copyPastaProps.sourceUrl ? (
            <div className="relative flex w-full items-center justify-between">
              {copyPastaProps.CopyPastasOnTags.length ? (
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={cn(
                      buttonVariants({ variant: "default", size: "xs" }),
                    )}
                  >
                    {sourceEnumHash.get(copyPastaProps.source)?.icon}
                  </span>
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
                    Cek Doksli <Link2 className="ml-2 h-3 w-3" />
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
