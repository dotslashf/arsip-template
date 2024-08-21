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
import { Button, buttonVariants } from "./ui/button";
import { ArrowRight, Calendar, Link2 } from "lucide-react";
import useToast from "./ui/use-react-hot-toast";
import { ScrollArea } from "./ui/scroll-area";
import CopyPastaCardAction from "./CopyPastaCardAction";
import { sendGAEvent } from "@next/third-parties/google";
import { sourceEnumHash } from "~/lib/constant";
import { Roboto_Slab } from "next/font/google";
import { useRouter } from "next/navigation";

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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill={"none"}
              className="h-6 w-6 dark:text-primary"
            >
              <path
                d="M14 16C14 14.1144 14 13.1716 14.5858 12.5858C15.1716 12 16.1144 12 18 12C19.8856 12 20.8284 12 21.4142 12.5858C22 13.1716 22 14.1144 22 16C22 17.8856 22 18.8284 21.4142 19.4142C20.8284 20 19.8856 20 18 20C16.1144 20 15.1716 20 14.5858 19.4142C14 18.8284 14 17.8856 14 16Z"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M14 16V11.8626C14 8.19569 16.5157 5.08584 20 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M2 16C2 14.1144 2 13.1716 2.58579 12.5858C3.17157 12 4.11438 12 6 12C7.88562 12 8.82843 12 9.41421 12.5858C10 13.1716 10 14.1144 10 16C10 17.8856 10 18.8284 9.41421 19.4142C8.82843 20 7.88562 20 6 20C4.11438 20 3.17157 20 2.58579 19.4142C2 18.8284 2 17.8856 2 16Z"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M2 16V11.8626C2 8.19569 4.51571 5.08584 8 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
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
                copyPastaProps.fullMode ? "h-fit text-lg" : "h-28 text-sm",
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
                  className="w-fit cursor-pointer"
                  onClick={() => {
                    router.push(`/?byUserId=${copyPastaProps.createdById}`);
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
