import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import Link from "next/link";
import { Badge, badgeVariants } from "~/components/ui/badge";
import { type CopyPasta, type Tag, type $Enums } from "@prisma/client";
import { cn, formatDateToHuman, trimContent } from "~/lib/utils";
import { Button, buttonVariants } from "./ui/button";
import {
  ArrowRight,
  Calendar,
  Clipboard,
  Link2,
  MessageSquareQuote,
  Share2,
} from "lucide-react";
import useToast from "./ui/use-react-hot-toast";
import { ScrollArea } from "./ui/scroll-area";
import { sendGAEvent } from "@next/third-parties/google";
import { sourceEnumHash } from "~/lib/constant";
import { Roboto_Slab } from "next/font/google";
import { useRouter } from "next/navigation";
import Reaction from "./Reaction";
import ReactionSummary from "./ReactionSummary";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";

const robotoSlab = Roboto_Slab({
  weight: ["400", "600"],
  style: ["normal"],
  subsets: ["latin"],
});

export interface CopyPastaCardWithTagsProps extends CopyPasta {
  CopyPastasOnTags: ({ tags: Tag } & {
    copyPastaId: string;
    tagId: string;
  })[];
  createdBy?: {
    id: string;
    name: string | null;
  };
  reactions?: {
    copyPastaId: string;
    userId: string;
    emotion: $Enums.EmotionType;
    _count: {
      emotion: number;
    };
  }[];
  isFullMode?: boolean;
  isCreatorAndDateShown?: boolean;
  isReactionSummaryShown?: boolean;
}

export interface CopyPastaProps {
  copyPastaProps: CopyPastaCardWithTagsProps;
}

export default function CopyPastaCardMinimal({
  copyPastaProps,
}: CopyPastaProps) {
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
    <div
      className={cn("col-span-3 w-full text-justify shadow-sm lg:col-span-1")}
    >
      <Card className="h-full">
        <CardHeader className="pb-0">
          <CardTitle>
            <MessageSquareQuote className="w-5" />
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col justify-between gap-2 p-6 pt-2 hover:cursor-auto">
          <div
            className={cn(
              "overflow-x-hidden text-sm",
              copyPastaProps.CopyPastasOnTags.some(
                (tag) => tag.tags.name === "NSFW",
              ) &&
                !copyPastaProps.isFullMode &&
                "blur-sm transition hover:blur-none",
            )}
          >
            <ScrollArea
              className={cn(
                "rounded-md",
                copyPastaProps.isFullMode ? "h-fit text-lg" : "h-28 text-sm",
                robotoSlab.className,
              )}
            >
              <blockquote className="whitespace-pre-line">
                {copyPastaProps.content}
              </blockquote>
            </ScrollArea>
          </div>
          {!copyPastaProps.isFullMode && (
            <div className="self-start">
              <Link
                href={`/copy-pasta/${copyPastaProps.id}`}
                className={cn(buttonVariants({ variant: "link", size: "url" }))}
                onClick={() => handleMoreInfo(copyPastaProps.id)}
              >
                Lebih Lanjut <ArrowRight className="ml-2 h-3 w-3" />
              </Link>
            </div>
          )}
          {copyPastaProps.isFullMode && (
            <div className="mt-3 flex space-x-2 lg:mt-6">
              <Reaction copyPastaId={copyPastaProps.id} />
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Button variant={"twitter"}>
                    Share <Share2 className="ml-2 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="text-slate-800" align="start">
                  <DropdownMenuItem
                    className="flex w-full justify-between"
                    onClick={handleCopy}
                  >
                    Salin <Clipboard className="ml-2 w-4" />
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link
                      href={`https://twitter.com/intent/post?text=${trimContent(copyPastaProps.content, 150)}&url=arsiptemplate.app/copy-pasta/${copyPastaProps.id}`}
                      target="_blank"
                      className="flex w-full justify-between"
                    >
                      Tweet{" "}
                      <FontAwesomeIcon
                        icon={faTwitter}
                        className="ml-2 h-4 w-4"
                      />
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
          <div className="mt-1 flex flex-col gap-4 text-sm text-secondary-foreground dark:text-muted-foreground lg:mt-2">
            {copyPastaProps.isReactionSummaryShown && (
              <ReactionSummary
                reactions={copyPastaProps.reactions}
                copyPastaId={copyPastaProps.id}
              />
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
