import { type CardDashboardProps } from "~/lib/interface";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { sendGAEvent } from "@next/third-parties/google";
import { ArrowRight, ImageIcon, Link2, Type } from "lucide-react";
import { ANALYTICS_EVENT, robotoSlab, sourceEnumHash } from "~/lib/constant";
import { cn } from "~/lib/utils";
import { buttonVariants } from "../ui/button";
import Link from "next/link";
import Tag from "../ui/tags";
import CopyPastaCardAction from "../CopyPastaCardAction";

export default function CardDashboard({
  copyPasta,
  isApprovalMode,
  type,
}: CardDashboardProps) {
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
          <blockquote
            className={cn("whitespace-pre-line", robotoSlab.className)}
          >
            {copyPasta.content}
          </blockquote>
        </div>
      </CardContent>
      <CardFooter className="mt-4 flex flex-col items-start gap-4 text-sm text-secondary-foreground dark:text-muted-foreground">
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
              onClick={() =>
                sendGAEvent("event", ANALYTICS_EVENT.DOKSLI, {
                  value: copyPasta.id,
                })
              }
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
          {type === "approved" && (
            <Link
              href={`/copy-pasta/${copyPasta.id}`}
              className={cn(buttonVariants({ variant: "link", size: "url" }))}
              onClick={() =>
                sendGAEvent("event", ANALYTICS_EVENT.BUTTON_CLICKED, {
                  value: "copyPasta.moreInfo",
                })
              }
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
