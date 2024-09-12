import { type CardProps } from "~/lib/interface";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  ArrowRight,
  ImageIcon,
  Link as LinkIcon,
  NotebookPen,
} from "lucide-react";
import { ANALYTICS_EVENT, sourceEnumHash } from "~/lib/constant";
import { cn, trimContent } from "~/lib/utils";
import { buttonVariants } from "../ui/button";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { type Tag as TagType } from "@prisma/client";
import Tag from "../ui/tags";
import { trackEvent } from "~/lib/track";

export default function CardRelated({ copyPasta }: CardProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentTag = searchParams.get("tag");

  const handleTagClick = (tag: TagType) => {
    const currentParams = new URLSearchParams(searchParams);
    currentParams.set("tag", tag.id);
    void trackEvent(ANALYTICS_EVENT.BUTTON_CLICKED, {
      value: `${tag.id}`,
      button: "tag.related",
      path: `/copy-pasta/${copyPasta.id}`,
    });
    return router.push(
      `/?${currentParams.toString()}&=utm_content=card_related`,
    );
  };

  const handleSourceClick = () => {
    void trackEvent(ANALYTICS_EVENT.BUTTON_CLICKED, {
      value: `${copyPasta.source}`,
      button: "source.related",
      path: `/copy-pasta/${copyPasta.id}`,
    });
    return router.push(
      `/?source=${copyPasta.source}&=utm_content=card_related`,
    );
  };

  function handleDoksli() {
    void trackEvent(ANALYTICS_EVENT.VIEW_ORIGINAL_DOCUMENT, {
      value: `${copyPasta.id}`,
      button: "original_document.related",
      path: `/copy-pasta/${copyPasta.id}`,
    });
  }

  function handleMoreInfo() {
    void trackEvent(ANALYTICS_EVENT.VIEW_FULL_COPY_PASTA, {
      button: "more_info.related",
      value: `${copyPasta.id}`,
      path: `/copy-pasta/${copyPasta.id}`,
    });
  }

  return (
    <Card className="flex h-full flex-col">
      <CardHeader className="pb-0">
        <CardTitle>
          <NotebookPen className="h-4 w-4" />
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col justify-between gap-2 py-4 hover:cursor-auto">
        <div
          className={cn(
            "overflow-x-hidden text-sm",
            copyPasta.CopyPastasOnTags.some(
              (tag) => tag.tags.name === "NSFW",
            ) && "blur-sm transition hover:blur-none",
          )}
        >
          <blockquote className="whitespace-pre-line text-sm">
            {trimContent(copyPasta.content, 255)}
          </blockquote>
        </div>
      </CardContent>
      <CardFooter className="mt-auto flex flex-col items-start gap-4 text-sm text-secondary-foreground dark:text-muted-foreground">
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
              Cek postingan asli <LinkIcon className="ml-2 h-3 w-3" />
            </Link>
          ) : (
            <span
              className={cn(
                buttonVariants({ variant: "disabled", size: "url" }),
              )}
            >
              Cek postingan asli <LinkIcon className="ml-2 h-3 w-3" />
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
