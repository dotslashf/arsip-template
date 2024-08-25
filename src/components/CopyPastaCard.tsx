import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import Link from "next/link";
import { badgeVariants } from "~/components/ui/badge";
import { type CopyPasta, type Tag } from "@prisma/client";
import { cn, formatDateToHuman } from "~/lib/utils";
import { buttonVariants } from "./ui/button";
import { ALargeSmall, ArrowRight, Calendar, Link2, Trash } from "lucide-react";
import useToast from "./ui/use-react-hot-toast";
import { ScrollArea } from "./ui/scroll-area";
import CopyPastaCardAction from "./CopyPastaCardAction";
import { sendGAEvent } from "@next/third-parties/google";
import { robotoSlab, sourceEnumHash } from "~/lib/constant";
import { useRouter } from "next/navigation";
import Image from "next/image";

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
      <Card className="relative flex h-full flex-col">
        {copyPastaProps.deletedAt && (
          <div className="absolute right-0 top-0 flex items-center rounded-md rounded-br-none rounded-tl-none bg-destructive p-3 font-mono text-destructive-foreground">
            <Trash className="w-4" />
          </div>
        )}
        <CardHeader className="pb-0">
          <CardTitle>
            <ALargeSmall className="h-6 w-6" />
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col justify-between gap-2 p-6 pt-2 hover:cursor-auto">
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
              className={cn("rounded-md text-sm", robotoSlab.className)}
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
        </CardContent>
        {copyPastaProps.imageUrl && (
          <CardFooter>
            <Image
              src={copyPastaProps.imageUrl}
              alt="Doksli Image"
              width={0}
              height={0}
              sizes="50vw"
              style={{ width: "50%", height: "auto" }}
            />
          </CardFooter>
        )}
        <CardFooter className="flex flex-col gap-4 text-sm text-secondary-foreground dark:text-muted-foreground">
          {copyPastaProps.isCreatorAndDateShown && (
            <div className="flex w-full justify-between">
              <Link href={`/user/${copyPastaProps.createdById}`}>
                Ditambahkan oleh:{" "}
                {copyPastaProps.createdBy
                  ? copyPastaProps.createdBy.name
                  : "Anon"}
              </Link>
              <div className="flex items-center">
                <Calendar className="mr-2 h-4 w-4" />{" "}
                {formatDateToHuman(copyPastaProps.createdAt ?? new Date())}
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
                    target="__blank"
                  >
                    Cek Doksli <Link2 className="ml-2 h-3 w-3" />
                  </Link>
                </div>
              ) : null}
            </div>
          ) : null}
          {copyPastaProps.isApprovalMode && (
            <CopyPastaCardAction
              id={copyPastaProps.id}
              isApproved={!!copyPastaProps.approvedAt}
            />
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
