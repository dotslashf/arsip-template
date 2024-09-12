import { type CardDashboardProps } from "~/lib/interface";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { ArrowRight, Link as LinkIcon, NotebookPen } from "lucide-react";
import { ANALYTICS_EVENT, robotoSlab, sourceEnumHash } from "~/lib/constant";
import { cn } from "~/lib/utils";
import { buttonVariants } from "../ui/button";
import Link from "next/link";
import Tag from "../ui/tags";
import CopyPastaCardAction from "../CopyPastaCardAction";
import { trackEvent } from "~/lib/track";
import { useState } from "react";
import DialogImage from "./DialogImage";

export default function CardDashboard({
  copyPasta,
  isApprovalMode,
  type,
}: CardDashboardProps) {
  const [isImageOpen, setIsImageOpen] = useState(false);

  const handleClickImage = (open: boolean) => {
    if (open === true) {
      void trackEvent(ANALYTICS_EVENT.VIEW_ORIGINAL_DOCUMENT, {
        value: `${copyPasta.id}`,
        button: "original_image",
        path: "/dashboard/profile",
      });
    }
    setIsImageOpen(open);
  };

  function handleDoksli() {
    void trackEvent(ANALYTICS_EVENT.VIEW_ORIGINAL_DOCUMENT, {
      value: `${copyPasta.id}`,
      button: "original_document",
      path: "/dashboard/profile",
    });
  }

  function handleMoreInfo() {
    void trackEvent(ANALYTICS_EVENT.VIEW_FULL_COPY_PASTA, {
      button: "more_info",
      value: `${copyPasta.id}`,
      path: "/dashboard/profile",
    });
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-0">
        <CardTitle>
          <NotebookPen className="h-4 w-4" />
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col justify-between gap-2 py-2 hover:cursor-auto">
        <div className="overflow-x-hidden text-sm">
          <blockquote
            className={cn("whitespace-pre-line", robotoSlab.className)}
          >
            {copyPasta.content}
          </blockquote>
        </div>
      </CardContent>
      <CardFooter className="mt-4 flex flex-col items-start gap-4 text-sm text-secondary-foreground dark:text-muted-foreground">
        {copyPasta.imageUrl && (
          <DialogImage
            content={copyPasta.content}
            imageUrl={copyPasta.imageUrl}
            handleOpen={handleClickImage}
            isOpen={isImageOpen}
          />
        )}
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
          <span
            className={cn(
              buttonVariants({ variant: "secondary", size: "xs" }),
              "cursor-pointer gap-2 rounded-sm px-2 text-xs",
            )}
          >
            {sourceEnumHash.get(copyPasta.source)?.icon}{" "}
            {sourceEnumHash.get(copyPasta.source)?.label}
          </span>
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
          {isApprovalMode && (
            <Link
              href={`/user/${copyPasta.createdById}`}
              className="font-semibold transition-colors hover:text-primary hover:underline"
              prefetch={false}
            >
              Oleh: {copyPasta.createdBy ? copyPasta.createdBy.name : "Anon"}
            </Link>
          )}
          {type === "approved" && (
            <Link
              href={`/copy-pasta/${copyPasta.id}?utm_content=dashboard_card`}
              className={cn(buttonVariants({ variant: "link", size: "url" }))}
              onClick={handleMoreInfo}
            >
              Lebih Lanjut <ArrowRight className="ml-2 h-3 w-3" />
            </Link>
          )}
        </div>
        {isApprovalMode && (
          <CopyPastaCardAction
            id={copyPasta.id}
            isApproved={!!copyPasta.approvedAt}
            isDeleted={!!copyPasta.deletedAt}
          />
        )}
      </CardFooter>
    </Card>
  );
}
