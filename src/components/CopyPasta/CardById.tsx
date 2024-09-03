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
  Link2,
  Share2,
  Type,
} from "lucide-react";
import useToast from "../ui/use-react-hot-toast";
import { ScrollArea } from "../ui/scroll-area";
import { sendGAEvent } from "@next/third-parties/google";
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
import { Badge } from "../ui/badge";
import { api } from "~/trpc/react";

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
        sendGAEvent("event", ANALYTICS_EVENT.BUTTON_CLICKED, {
          value: `copyPaste.${copyPasta.id}`,
        });
        window.umami?.track(ANALYTICS_EVENT.BUTTON_CLICKED, {
          value: `copyPaste.${copyPasta.id}`,
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
        sendGAEvent("event", ANALYTICS_EVENT.SHARE, { value: "copyPasta.url" });
        window.umami?.track(ANALYTICS_EVENT.SHARE, { value: "copyPasta.url" });
      })
      .catch((err) => console.log(err));
  }

  const handleTagClick = (tag: TagType) => {
    const currentParams = new URLSearchParams(searchParams);
    currentParams.set("tag", tag.id);
    sendGAEvent("event", ANALYTICS_EVENT.BUTTON_CLICKED, {
      value: `tag.${tag.name}`,
    });
    window.umami?.track(ANALYTICS_EVENT.BUTTON_CLICKED, {
      value: `tag.${tag.name}`,
    });
    return router.push(`/?${currentParams.toString()}`);
  };

  const handleSourceClick = () => {
    sendGAEvent("event", ANALYTICS_EVENT.BUTTON_CLICKED, {
      value: `source.${copyPasta.source}`,
    });
    window.umami?.track(ANALYTICS_EVENT.BUTTON_CLICKED, {
      value: `source.${copyPasta.source}`,
    });
    return router.push(`?source=${copyPasta.source}`);
  };

  function handleDoksli() {
    sendGAEvent("event", ANALYTICS_EVENT.DOKSLI, {
      value: copyPasta.id,
    });
    window.umami?.track(ANALYTICS_EVENT.DOKSLI, {
      value: copyPasta.id,
    });
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-0 lg:p-6 lg:pb-0">
        <CardTitle className="flex w-full items-center justify-between">
          <Type className="flip h-6 w-6" />
          <Badge
            variant={"default"}
            className="flex items-center justify-center md:text-base"
          >
            {analytics?.views ?? 0} views <Eye className="ml-2 w-4 md:w-5" />
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="my-6 flex flex-col justify-between gap-2 hover:cursor-auto lg:px-6">
        <div className={cn("overflow-x-hidden text-sm")}>
          <ScrollArea
            className={cn("h-fit rounded-md text-lg", robotoSlab.className)}
          >
            <blockquote className="whitespace-pre-line">
              {copyPasta.content}
            </blockquote>
          </ScrollArea>
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
        <div className="flex space-x-2">
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
            <Link
              href={`/user/${copyPasta.createdById}?utm_source=copy_pasta_by_id`}
              className="font-semibold transition-colors hover:text-primary hover:underline"
              prefetch={false}
            >
              Oleh: {copyPasta.createdBy ? copyPasta.createdBy.name : "Anon"}
            </Link>
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
                  Cek Doksli <Link2 className="ml-2 h-4 w-4" />
                </Link>
              ) : (
                <span className={cn(buttonVariants({ variant: "disabled" }))}>
                  Cek Doksli <Link2 className="ml-2 h-4 w-4" />
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
                  <Link2 className="ml-2 w-4" />
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href={`https://twitter.com/intent/post?text=${trimContent(copyPasta.content, 150)}&url=arsiptemplate.app/copy-pasta/${copyPasta.id}?utm_source=twitter&utm_content=tweet`}
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
