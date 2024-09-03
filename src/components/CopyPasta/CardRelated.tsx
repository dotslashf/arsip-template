import { type CardProps } from "~/lib/interface";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { sendGAEvent } from "@next/third-parties/google";
import { ScrollArea } from "~/components/ui/scroll-area";
import { ArrowRight, ImageIcon, Link2, Type } from "lucide-react";
import { ANALYTICS_EVENT, robotoSlab, sourceEnumHash } from "~/lib/constant";
import { cn, trimContent } from "~/lib/utils";
import { buttonVariants } from "../ui/button";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { type Tag as TagType } from "@prisma/client";
import Tag from "../ui/tags";

export default function CardRelated({ copyPasta }: CardProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentTag = searchParams.get("tag");

  const handleTagClick = (tag: TagType) => {
    const currentParams = new URLSearchParams(searchParams);
    currentParams.set("tag", tag.id);
    sendGAEvent("event", ANALYTICS_EVENT.BUTTON_CLICKED, {
      value: `tag.${tag.name}`,
    });
    window.umami?.track(ANALYTICS_EVENT.BUTTON_CLICKED, {
      value: `tag.${tag.name}`,
    });
    return router.push(`/?${currentParams.toString()}`);
  };

  const handleSourceClick = () => {
    sendGAEvent("event", ANALYTICS_EVENT.BUTTON_CLICKED, {
      value: `source.${copyPasta.source}`,
    });
    window.umami?.track(ANALYTICS_EVENT.BUTTON_CLICKED, {
      value: `source.${copyPasta.source}`,
    });
    return router.push(`?source=${copyPasta.source}`);
  };

  function handleDoksli() {
    sendGAEvent("event", ANALYTICS_EVENT.DOKSLI, {
      value: copyPasta.id,
    });
    window.umami?.track(ANALYTICS_EVENT.DOKSLI, {
      value: copyPasta.id,
    });
  }

  function handleMoreInfo() {
    sendGAEvent("event", ANALYTICS_EVENT.BUTTON_CLICKED, {
      value: "copyPasta.moreInfo",
    });
    window.umami?.track(ANALYTICS_EVENT.BUTTON_CLICKED, {
      value: "copyPasta.moreInfo",
    });
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-0">
        <CardTitle>
          <Type className="h-4 w-4" />
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col justify-between gap-2 py-2 hover:cursor-auto">
        <div
          className={cn(
            "overflow-x-hidden text-sm",
            copyPasta.CopyPastasOnTags.some(
              (tag) => tag.tags.name === "NSFW",
            ) && "blur-sm transition hover:blur-none",
          )}
        >
          <ScrollArea
            className={cn("h-36 rounded-md text-sm", robotoSlab.className)}
          >
            <blockquote className="whitespace-pre-line">
              {trimContent(copyPasta.content, 255)}
            </blockquote>
          </ScrollArea>
        </div>
      </CardContent>
      <CardFooter className="mt-4 flex flex-col items-start gap-4 text-sm text-secondary-foreground dark:text-muted-foreground">
        <div className="flex w-full space-x-2">
          {copyPasta.CopyPastasOnTags.map((tag) => {
            const isActive = currentTag === tag.tags.id;
            return (
              <Tag
                key={tag.tags.id}
                onClick={() => handleTagClick(tag.tags)}
                tagContent={tag.tags}
                active={isActive}
                className="rounded-sm shadow-sm hover:bg-primary hover:text-primary-foreground"
              />
            );
          })}
        </div>
        <div className="flex w-full gap-2">
          <span
            className={cn(
              buttonVariants({ variant: "secondary", size: "xs" }),
              "cursor-pointer gap-2 rounded-sm px-2 text-xs",
            )}
            onClick={handleSourceClick}
          >
            {sourceEnumHash.get(copyPasta.source)?.icon}{" "}
            {sourceEnumHash.get(copyPasta.source)?.label}
          </span>
          {copyPasta.imageUrl && (
            <span
              className={cn(
                buttonVariants({ variant: "secondary", size: "xs" }),
                "rounded-sm",
              )}
            >
              <ImageIcon className="h-4 w-4" />
            </span>
          )}
        </div>
        <div className="flex w-full justify-between gap-3">
          {copyPasta.sourceUrl ? (
            <Link
              href={copyPasta.sourceUrl}
              className={cn(buttonVariants({ variant: "link", size: "url" }))}
              onClick={handleDoksli}
              prefetch={false}
              target="__blank"
            >
              Cek Doksli <Link2 className="ml-2 h-3 w-3" />
            </Link>
          ) : (
            <span
              className={cn(
                buttonVariants({ variant: "disabled", size: "url" }),
              )}
            >
              Cek Doksli <Link2 className="ml-2 h-3 w-3" />
            </span>
          )}
          <Link
            href={`/copy-pasta/${copyPasta.id}`}
            className={cn(buttonVariants({ variant: "link", size: "url" }))}
            onClick={handleMoreInfo}
          >
            Lebih Lanjut <ArrowRight className="ml-2 h-3 w-3" />
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
