import {
  type CardSearchProps,
  type CopyPastaSearchResult,
} from "~/lib/interface";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  ArrowRight,
  Link as LinkIcon,
  Minus,
  NotebookPen,
  Plus,
} from "lucide-react";
import { ANALYTICS_EVENT } from "~/lib/constant";
import { cn, trimContent } from "~/lib/utils";
import { Button, buttonVariants } from "../ui/button";
import Link from "next/link";
import Tag from "../ui/tags";
import { trackEvent } from "~/lib/track";
import DialogImage from "../CopyPasta/DialogImage";
import { useState } from "react";

interface CardSearchResultProps extends CardSearchProps {
  type: "add" | "remove";
  onAddToCollection: (copyPasta: CopyPastaSearchResult) => void;
  onRemoveFromCollection: (copyPasta: CopyPastaSearchResult) => void;
}

export default function CardSearchResult({
  copyPasta,
  onAddToCollection,
  onRemoveFromCollection,
  type,
}: CardSearchResultProps) {
  const [isImageOpen, setIsImageOpen] = useState(false);
  function handleMoreInfo() {
    void trackEvent(ANALYTICS_EVENT.VIEW_FULL_COPY_PASTA, {
      button: "more_info.search_collection",
      value: `${copyPasta.id}`,
    });
  }

  const handleClickImage = (open: boolean) => {
    if (open === true) {
      void trackEvent(ANALYTICS_EVENT.VIEW_ORIGINAL_DOCUMENT, {
        value: `${copyPasta.id}`,
        button: "original_image",
        path: `/copy-pasta/${copyPasta.id}`,
      });
    }
    setIsImageOpen(open);
  };

  return (
    <Card
      className={cn("flex h-full w-full flex-col", type === "remove" && "ml-8")}
    >
      <CardHeader className="pb-0">
        <CardTitle className="flex w-full items-center justify-between">
          <NotebookPen className="h-4 w-4" />
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col justify-between gap-2 py-4 hover:cursor-auto">
        <div className={cn("overflow-x-hidden text-sm")}>
          <blockquote className="select-none whitespace-pre-line border-l-4 pl-6 italic">
            {trimContent(copyPasta.content as string, 200)}
          </blockquote>
        </div>
      </CardContent>
      <CardFooter className="mt-auto flex flex-col items-start gap-4 text-sm text-secondary-foreground dark:text-muted-foreground">
        <div className="flex w-full space-x-2">
          {copyPasta.tags.map((tag) => {
            return (
              <Tag
                key={tag.id}
                onClick={() => null}
                tagContent={{
                  ...tag,
                  createdAt: new Date(),
                  updatedAt: new Date(),
                }}
                className="rounded-sm shadow-sm hover:bg-primary hover:text-primary-foreground"
              />
            );
          })}
        </div>
        <div className="flex w-full gap-2">
          {copyPasta.imageUrl && (
            <DialogImage
              content={copyPasta.content}
              imageUrl={copyPasta.imageUrl}
              handleOpen={handleClickImage}
              isOpen={isImageOpen}
            />
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
