import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import Link from "next/link";
import { type Tag as TagType } from "@prisma/client";
import { cn, formatDateToHuman, trimContent } from "~/utils";
import { buttonVariants } from "~/components/ui/button";
import {
  BookCheck,
  CalendarDays,
  Clipboard,
  Eye,
  Link as LinkIcon,
  Share2,
} from "lucide-react";
import useToast from "~/components/ui/use-react-hot-toast";
import { ANALYTICS_EVENT, baseUrl, sourceEnumHash } from "~/lib/constant";
import { useRouter, useSearchParams } from "next/navigation";
import Reaction from "../Reaction/Reaction";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import {} from "@prisma/client";
import Tag from "~/components/ui/tags";
import { type CardProps } from "~/lib/interface";
import { Badge } from "~/components/ui/badge";
import { api } from "~/trpc/react";
import { trackEvent } from "~/lib/track";
import Avatar from "~/components/ui/avatar-image";
import { useState } from "react";
import DialogImage from "./DialogImage";
import ExclusiveBadge from "../Common/ExclusiveBadge";

export default function CardById({ copyPasta }: CardProps) {
  const toast = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentTag = searchParams.get("tag");

  const [isImageOpen, setIsImageOpen] = useState(false);

  const [analytics] = api.statistics.getPageViewById.useSuspenseQuery({
    id: copyPasta.id,
  });

  function handleCopy() {
    navigator.clipboard
      .writeText(copyPasta.content)
      .then(() => {
        void toast({
          message:
            "Bersiap untuk kejahilan kecil 😼\n Silahkan paste templatenya!",
          type: "info",
        });
        void trackEvent(ANALYTICS_EVENT.BUTTON_CLICKED, {
          value: `${copyPasta.id}`,
          button: "copy_paste",
          path: `/copy-pasta/${copyPasta.id}`,
        });
      })
      .catch((err) => console.log(err));
  }

  function handleCopyUrl() {
    navigator.clipboard
      .writeText(`${baseUrl}/copy-pasta/${copyPasta.id}?utm_content=shared_url`)
      .then(() => {
        void toast({
          message: "Url siap dibagikan! ⚓",
          type: "info",
        });
        void trackEvent(ANALYTICS_EVENT.BUTTON_CLICKED, {
          value: `${copyPasta.id}`,
          button: "share_url",
          path: `/copy-pasta/${copyPasta.id}`,
        });
      })
      .catch((err) => console.log(err));
  }

  const handleTagClick = (tag: TagType) => {
    const currentParams = new URLSearchParams(searchParams);
    currentParams.set("tag", tag.id);
    void trackEvent(ANALYTICS_EVENT.BUTTON_CLICKED, {
      value: `${tag.id}`,
      button: "tag",
      path: `/copy-pasta/${copyPasta.id}`,
    });
    return router.push(`/?${currentParams.toString()}&utm_content=card_by_id`);
  };

  const handleSourceClick = () => {
    void trackEvent(ANALYTICS_EVENT.BUTTON_CLICKED, {
      value: `${copyPasta.source}`,
      button: "source",
      path: `/copy-pasta/${copyPasta.id}`,
    });
    return router.push(`/?source=${copyPasta.source}&utm_content=card_by_id`);
  };

  function handleDoksli() {
    void trackEvent(ANALYTICS_EVENT.VIEW_ORIGINAL_DOCUMENT, {
      value: `${copyPasta.id}`,
      button: "original_document",
      path: `/copy-pasta/${copyPasta.id}`,
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
    <Card className="h-full">
      <CardHeader className="pb-0 lg:p-6 lg:pb-0">
        <CardTitle className="flex w-full items-center justify-between">
          <div className="flex">
            <span className="mr-4 h-fit rounded-full border-2 border-secondary-foreground">
              <Avatar
                size={{
                  width: 60,
                  height: 60,
                }}
                seed={
                  copyPasta.createdBy?.avatarSeed ?? copyPasta.createdBy?.id
                }
              />
            </span>
            <div className="flex w-full flex-col justify-evenly gap-2">
              <span className="text-sm font-normal">
                Diarsipkan oleh:{" "}
                <Link
                  href={`/user/${copyPasta.createdBy?.username ?? copyPasta.createdBy?.id}`}
                  className="font-semibold text-primary"
                >
                  @
                  {copyPasta.createdBy?.id.includes(
                    copyPasta.createdBy?.username ?? "",
                  )
                    ? copyPasta.createdBy.name
                    : copyPasta.createdBy?.username}
                </Link>
              </span>
              {copyPasta.createdBy?.ExclusiveBadge && (
                <div className="flex flex-wrap gap-2">
                  <ExclusiveBadge badges={copyPasta.createdBy.ExclusiveBadge} />
                </div>
              )}
            </div>
          </div>
          <Badge
            variant={"default"}
            className="flex items-center justify-center md:text-base"
          >
            {analytics?.views ?? 0} views <Eye className="ml-2 w-4 md:w-5" />
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="my-8 flex flex-col justify-between gap-2 py-0 hover:cursor-auto lg:px-6">
        <div className={cn("w-full overflow-x-hidden text-sm")}>
          <blockquote
            className={`whitespace-pre-line border-l-4 pl-6 text-lg italic`}
          >
            &quot;{copyPasta.content}&quot;
          </blockquote>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-4 text-sm text-secondary-foreground dark:text-muted-foreground lg:p-6 lg:pt-0">
        {copyPasta.imageUrl && (
          <DialogImage
            content={copyPasta.content}
            imageUrl={copyPasta.imageUrl}
            handleOpen={handleClickImage}
            isOpen={isImageOpen}
          />
        )}
        <Reaction copyPastaId={copyPasta.id} />
        <div className="flex flex-wrap gap-2">
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

          <div className="flex gap-2">
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
          </div>
        </div>
        <div className="flex w-full flex-col justify-between gap-4 md:flex-row md:items-end">
          <div className="flex flex-col items-start gap-4">
            <div className="flex items-center justify-center">
              Kejadian <CalendarDays className="mx-2 h-4 w-4" />{" "}
              {formatDateToHuman(copyPasta.postedAt ?? new Date())}
            </div>
            <div className="flex items-center justify-center">
              Diarsipkan <BookCheck className="mx-2 h-4 w-4" />{" "}
              {formatDateToHuman(copyPasta.createdAt ?? new Date())}
            </div>
          </div>
          <div className="flex items-center justify-between gap-2 md:flex-col md:items-end">
            <div>
              {copyPasta.sourceUrl ? (
                <Link
                  href={copyPasta.sourceUrl}
                  className={cn(buttonVariants({ variant: "outline" }))}
                  onClick={handleDoksli}
                  prefetch={false}
                  target="__blank"
                >
                  Cek postingan asli <LinkIcon className="ml-2 h-4 w-4" />
                </Link>
              ) : (
                <span className={cn(buttonVariants({ variant: "disabled" }))}>
                  Cek postingan asli <LinkIcon className="ml-2 h-4 w-4" />
                </span>
              )}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <span className={cn(buttonVariants({ variant: "twitter" }))}>
                  Share <Share2 className="ml-2 w-4" />
                </span>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="text-slate-800 dark:text-slate-100"
                align="end"
              >
                <DropdownMenuItem
                  className="flex w-full justify-between"
                  onClick={handleCopy}
                >
                  Salin Template <Clipboard className="ml-2 w-4" />
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="flex w-full justify-between"
                  onClick={handleCopyUrl}
                >
                  Salin Url
                  <LinkIcon className="ml-2 w-4" />
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href={`https://twitter.com/intent/post?text=${trimContent(encodeURIComponent(copyPasta.content), 280)}&url=arsiptemplate.app/copy-pasta/${copyPasta.id}?utm_source=twitter&utm_content=tweet`}
                    target="_blank"
                    className="flex w-full items-center justify-between"
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
        </div>
      </CardFooter>
    </Card>
  );
}
