import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import Link from "next/link";
import { Badge, badgeVariants } from "~/components/ui/badge";
import { type CopyPasta, type Tag } from "@prisma/client";
import { cn, formatDateToHuman } from "~/lib/utils";
import { buttonVariants } from "./ui/button";
import { ALargeSmall, ArrowRight, Calendar, Link2 } from "lucide-react";
import useToast from "./ui/use-react-hot-toast";
import { ScrollArea } from "./ui/scroll-area";
import CopyPastaCardAction from "./CopyPastaCardAction";
import { sendGAEvent } from "@next/third-parties/google";
import { robotoSlab, sourceEnumHash } from "~/lib/constant";
import { useRouter } from "next/navigation";

export interface CopyPastaCardWithTagsProps extends CopyPasta {
  CopyPastasOnTags: ({ tags: Tag } & {
    copyPastaId: string;
    tagId: string;
  })[];
  createdBy?: {
    id: string;
    name: string | null;
  };
  fullMode?: boolean;
  isApprovalMode?: boolean;
  isCreatorAndDateShown?: boolean;
}

export interface CopyPastaProps {
  copyPastaProps: CopyPastaCardWithTagsProps;
}

export default function CopyPastaCard({ copyPastaProps }: CopyPastaProps) {
  const toast = useToast();
  const router = useRouter();
  copyPastaProps.isCreatorAndDateShown =
    copyPastaProps.isCreatorAndDateShown ?? true;

  function handleCopy() {
    navigator.clipboard
      .writeText(copyPastaProps.content)
      .then(() => {
        toast({
          message:
            "Bersiap untuk kejahilan kecil 😼\n Silahkan paste templatenya!",
          type: "info",
        });
        sendGAEvent("event", "buttonClicked", { value: "copyPasta.copyPaste" });
      })
      .catch((err) => console.log(err));
  }

  function handleMoreInfo(id: string) {
    sendGAEvent("event", "buttonClicked", { value: "copyPasta.moreInfo" });
    return router.push(`/copy-pasta/${id}`);
  }

  return (
    <div className="col-span-2 w-full text-justify shadow-sm lg:col-span-1">
      <Card>
        <CardHeader className="pb-0">
          <CardTitle>
            <ALargeSmall className="h-6 w-6" />
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col justify-between gap-2 p-6 pt-2 hover:cursor-auto">
          <div
            className={cn(
              "overflow-x-hidden text-sm",
              copyPastaProps.CopyPastasOnTags.some(
                (tag) => tag.tags.name === "NSFW",
              ) &&
                !copyPastaProps.fullMode &&
                !copyPastaProps.isApprovalMode &&
                "blur-sm transition hover:blur-none",
            )}
          >
            <ScrollArea
              onClick={handleCopy}
              className={cn(
                "rounded-md",
                copyPastaProps.fullMode ? "h-fit text-lg" : "h-36 text-sm",
                robotoSlab.className,
              )}
            >
              <blockquote className="cursor-pointer whitespace-pre-line">
                {copyPastaProps.content}
              </blockquote>
            </ScrollArea>
          </div>
          {!copyPastaProps.fullMode &&
            !copyPastaProps.isApprovalMode &&
            copyPastaProps.approvedAt && (
              <div className="self-start">
                <Link
                  href={`/copy-pasta/${copyPastaProps.id}`}
                  className={cn(
                    buttonVariants({ variant: "link", size: "url" }),
                  )}
                  onClick={() => handleMoreInfo(copyPastaProps.id)}
                >
                  Lebih Lanjut <ArrowRight className="ml-2 h-3 w-3" />
                </Link>
              </div>
            )}
          <div className="mt-2 flex flex-col gap-4 text-sm text-secondary-foreground dark:text-muted-foreground lg:mt-4">
            {copyPastaProps.isCreatorAndDateShown && (
              <div className="flex justify-between">
                <Badge
                  variant={"outline"}
                  className="w-fit"
                  onClick={() => {
                    router.push(`/user/${copyPastaProps.createdById}`);
                  }}
                >
                  Di tambahkan oleh:{" "}
                  {copyPastaProps.createdBy
                    ? copyPastaProps.createdBy.name
                    : "Anon"}
                </Badge>
                <div className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4" />{" "}
                  {formatDateToHuman(copyPastaProps.postedAt ?? new Date())}
                </div>
              </div>
            )}
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
                      onClick={() =>
                        sendGAEvent("event", "doksli", {
                          value: copyPastaProps.sourceUrl,
                        })
                      }
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
        {copyPastaProps.isApprovalMode && (
          <CardFooter>
            <CopyPastaCardAction
              id={copyPastaProps.id}
              isApproved={!!copyPastaProps.approvedAt}
            />
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
