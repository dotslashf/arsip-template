import { Card, CardContent } from "~/components/ui/card";
import Link from "next/link";
import { badgeVariants } from "~/components/ui/badge";
import { type CopyPasta, type Tag } from "@prisma/client";
import { cn, formatDateToHuman } from "~/lib/utils";
import CopyPastaContent from "./CopyPastaContent";
import { buttonVariants } from "./ui/button";
import { Link2 } from "lucide-react";
import { sourceEnumHash } from "~/app/_components/CreateCopyPastaPage";
import useToast from "./ui/use-react-hot-toast";

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
  const toast = useToast();

  function handleCopy() {
    navigator.clipboard
      .writeText(copyPastaProps.content)
      .then(() => {
        toast({
          message:
            "Bersiap untuk kejahilan kecil 😼\n Silahkan paste templatenya!",
          type: "info",
        });
      })
      .catch((err) => console.log(err));
  }

  return (
    <Card
      className={cn("col-span-2 w-full text-justify shadow-sm lg:col-span-1")}
    >
      <CardContent className="flex h-full flex-col justify-between gap-2 p-6 hover:cursor-auto">
        <div className="text-sm text-primary">
          {
            <CopyPastaContent
              content={copyPastaProps.content}
              fullMode={copyPastaProps.fullMode}
              id={copyPastaProps.id}
              onClick={handleCopy}
              className={cn(
                copyPastaProps.CopyPastasOnTags.some(
                  (tag) => tag.tags.name === "NSFW",
                ) &&
                  !copyPastaProps.fullMode &&
                  "blur-sm transition hover:blur-none",
              )}
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
