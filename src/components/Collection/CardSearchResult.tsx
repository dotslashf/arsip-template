import { type CardCopyPastaMinimal, type CardProps } from "~/lib/interface";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { ScrollArea } from "~/components/ui/scroll-area";
import { ArrowRight, ImageIcon, Link2, Minus, Plus, Type } from "lucide-react";
import { ANALYTICS_EVENT, robotoSlab, sourceEnumHash } from "~/lib/constant";
import { cn, trimContent } from "~/lib/utils";
import { Button, buttonVariants } from "../ui/button";
import Link from "next/link";
import Tag from "../ui/tags";
import { trackEvent } from "~/lib/track";

interface CardSearchResultProps extends CardProps {
  type: "add" | "remove";
  onAddToCollection: (copyPasta: CardCopyPastaMinimal) => void;
  onRemoveFromCollection: (copyPasta: CardCopyPastaMinimal) => void;
}

export default function CardSearchResult({
  copyPasta,
  onAddToCollection,
  onRemoveFromCollection,
  type,
}: CardSearchResultProps) {
  function handleMoreInfo() {
    void trackEvent(ANALYTICS_EVENT.VIEW_FULL_COPY_PASTA, {
      button: "more_info.search_collection",
      value: `${copyPasta.id}`,
    });
  }

  return (
    <Card className="h-full w-full">
      <CardHeader className="pb-0">
        <CardTitle className="flex w-full items-center justify-between">
          <Type className="h-4 w-4" />
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col justify-between gap-2 pb-2 pt-4 hover:cursor-auto">
        <div className={cn("overflow-x-hidden text-sm")}>
          <ScrollArea
            className={cn("h-20 rounded-md text-sm", robotoSlab.className)}
          >
            <blockquote className="select-none whitespace-pre-line">
              {trimContent(copyPasta.content, 255)}
            </blockquote>
          </ScrollArea>
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
            target="__blank"
            className={cn(buttonVariants({ variant: "link", size: "url" }))}
            onClick={handleMoreInfo}
          >
            Lebih Lanjut <ArrowRight className="ml-2 h-3 w-3" />
          </Link>
        </div>
        {type === "add" ? (
          <Button
            size="xs"
            type="button"
            onClick={() => onAddToCollection(copyPasta)}
            className="text-xs"
          >
            <Plus className="mr-2 w-4" />
            Tambah
          </Button>
        ) : (
          <Button
            size="xs"
            type="button"
            variant={"destructive"}
            onClick={() => onRemoveFromCollection(copyPasta)}
            className="text-xs"
          >
            <Minus className="mr-2 w-4" />
            Hapus
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
