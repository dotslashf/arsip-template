import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import Link from "next/link";
import { type Tag as TagType } from "@prisma/client";
import { cn, formatDateToHuman, trimContent } from "~/lib/utils";
import { buttonVariants } from "../ui/button";
import {
  BookCheck,
  CalendarDays,
  Clipboard,
  Eye,
  ImageIcon,
  Link as LinkIcon,
  Share2,
} from "lucide-react";
import useToast from "../ui/use-react-hot-toast";
import {
  ANALYTICS_EVENT,
  baseUrl,
  robotoSlab,
  sourceEnumHash,
} from "~/lib/constant";
import { useRouter, useSearchParams } from "next/navigation";
import Reaction from "../Reaction";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import Image from "next/image";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import {} from "@prisma/client";
import Tag from "../ui/tags";
import { type CardProps } from "~/lib/interface";
import { Badge, badgeVariants } from "../ui/badge";
import { api } from "~/trpc/react";
import { trackEvent } from "~/lib/track";
import Avatar from "../ui/avatar";

export default function CardById({ copyPasta }: CardProps) {
  const toast = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentTag = searchParams.get("tag");

  const [analytics] = api.analytics.getPageViewById.useSuspenseQuery({
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

  return (
    <Card className="h-full">
      <CardHeader className="pb-0 lg:p-6 lg:pb-0">
        <CardTitle className="flex w-full items-center justify-between">
          <div className="flex">
            <span className="mr-4 rounded-full border-2 border-secondary-foreground">
              <Avatar
                size={{
                  width: 95,
                  height: 95,
                }}
                seed={
                  copyPasta.createdBy?.avatarSeed ?? copyPasta.createdBy?.id
                }
              />
            </span>
            <div className="flex w-full flex-col justify-evenly">
              <span className="text-sm font-normal">Diarsipkan oleh:</span>
              <Link
                href={`/user/${copyPasta.createdBy?.username}`}
                className={cn(
                  badgeVariants({
                    variant: "ghost",
                    className: "py-0.5",
                  }),
                  "w-fit",
                )}
              >
                @
                {copyPasta.createdBy?.id.includes(
                  copyPasta.createdBy?.username ?? "",
                )
                  ? copyPasta.createdBy.name
                  : copyPasta.createdBy?.username}
              </Link>
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
        <div
          className={cn(
            "w-full overflow-x-hidden rounded-md border-2 border-dashed bg-secondary p-3 text-sm",
          )}
        >
          <blockquote
            className={`whitespace-pre-line text-lg ${robotoSlab.className}`}
          >
            {copyPasta.content}
          </blockquote>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-4 text-sm text-secondary-foreground dark:text-muted-foreground lg:p-6 lg:pt-0">
        {copyPasta.imageUrl && (
          <Accordion
            className="w-full max-w-xs text-sm"
            type="single"
            collapsible
          >
            <AccordionItem value="item-1" className="border-0">
              <AccordionTrigger className="py-0">
                <span className="flex items-center">
                  <ImageIcon className="mr-2 w-4" />
                  Doksli Image
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <Image
                  src={copyPasta.imageUrl}
                  alt="Doksli Image"
                  width={0}
                  height={0}
                  sizes="25vw"
                  style={{ width: "100%", height: "auto" }}
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
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
