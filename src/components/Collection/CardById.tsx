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
import { Button, buttonVariants } from "../ui/button";
import Link from "next/link";
import Tag from "../ui/tags";
import { trackEvent } from "~/lib/track";

export default function CardById({ copyPasta }: CardProps) {
  function handleMoreInfo() {
    void trackEvent(ANALYTICS_EVENT.VIEW_FULL_COPY_PASTA, {
      button: "more_info.collection",
      value: `${copyPasta.id}`,
    });
  }

  return (
    <Card className="ml-8 h-full w-full">
      <CardHeader className="pb-0">
        <CardTitle className="flex w-full items-center justify-between">
          <NotebookPen className="h-4 w-4" />
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col justify-between gap-2 py-4 hover:cursor-auto">
        <div className={cn("overflow-x-hidden text-sm")}>
          <blockquote className="select-none whitespace-pre-line border-l-4 pl-6 text-sm italic">
            {trimContent(copyPasta.content, 100)}
          </blockquote>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-4 self-end text-sm text-secondary-foreground dark:text-muted-foreground">
        <div className="flex w-full space-x-2">
          {copyPasta.CopyPastasOnTags.map((tag) => {
            return (
              <Tag
                key={tag.tags.id}
                onClick={() => null}
                tagContent={tag.tags}
                className="rounded-sm shadow-sm hover:bg-primary hover:text-primary-foreground"
              />
            );
          })}
        </div>
        <div className="flex w-full gap-2">
          <Button
            className="cursor-pointer gap-2 rounded-sm px-2 text-xs"
            variant="secondary"
            size="xs"
          >
            {sourceEnumHash.get(copyPasta.source)?.icon}{" "}
            {sourceEnumHash.get(copyPasta.source)?.label}
          </Button>
          {copyPasta.imageUrl && (
            <Link
              href={copyPasta.imageUrl}
              target="__blank"
              prefetch={false}
              className={cn(
                buttonVariants({ variant: "secondary", size: "xs" }),
                "rounded-sm text-xs",
              )}
            >
              <ImageIcon className="mr-2 h-4 w-4" />
              Image
            </Link>
          )}
        </div>
        <div className="flex w-full justify-between gap-3">
          {copyPasta.sourceUrl ? (
            <Link
              href={copyPasta.sourceUrl}
              className={cn(buttonVariants({ variant: "link", size: "url" }))}
              prefetch={false}
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
