"use client";

import { useMediaQuery } from "@uidotdev/usehooks";
import { ArrowRight, Eye, Hash, Library, TrendingUp } from "lucide-react";
import Link from "next/link";
import { cn, trimContent } from "~/lib/utils";
import { api } from "~/trpc/react";
import { ScrollArea } from "~/components/ui/scroll-area";
import ListTags from "~/components/Common/ListTags";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { DAYS } from "~/lib/constant";
import NumberTicker from "../magicui/number-ticker";
import { buttonVariants } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";

interface TrendingHomeProps {
  tag: string | null;
}
export default function TrendingHome(props: TrendingHomeProps) {
  const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");
  const [trendingCopyPastas] =
    api.statistics.getPopularCopyPasta.useSuspenseQuery(undefined, {
      staleTime: 7 * DAYS,
      gcTime: 7 * DAYS,
    });
  const [collections] = api.collection.list.useSuspenseQuery(
    { limit: 5 },
    {
      staleTime: 7 * DAYS,
      gcTime: 7 * DAYS,
    },
  );

  return (
    <div
      className={cn(
        isSmallDevice
          ? "order-first col-span-3"
          : "sticky top-[4.5rem] self-start",
        "flex flex-col gap-4",
      )}
    >
      {collections.collections.length > 0 && (
        <Accordion
          type="single"
          collapsible
          className="h-fit w-full flex-col space-y-2 rounded-md border p-4"
          defaultValue="trendingCollection"
        >
          <AccordionItem value="trendingCollection" className="border-0 p-0">
            <AccordionTrigger className="border-0 py-0">
              <h2 className="flex items-center gap-2 text-lg font-bold">
                <Library className="w-4" />
                Koleksi
              </h2>
            </AccordionTrigger>
            <AccordionContent className="mt-4 flex flex-col pb-0">
              <div className="flex flex-col space-y-2">
                {collections.collections.map((collection) => {
                  return (
                    <Link
                      href={`/collection/${collection.id}?utm_content=trending`}
                      key={collection.id}
                      className="flex items-center justify-between"
                      prefetch={false}
                    >
                      <span className="w-fit text-sm hover:underline">
                        {trimContent(collection.name ?? "", 30)}
                      </span>
                      <Badge variant={"secondary"}>
                        {collection._count.copyPastas} Template
                      </Badge>
                    </Link>
                  );
                })}
              </div>
              <Link
                href={`/collection/?utm_source=trending`}
                className={cn(
                  buttonVariants({ variant: "link", size: "url" }),
                  "mt-4 self-start",
                )}
              >
                Selengkapnya <ArrowRight className="ml-2 h-3 w-3" />
              </Link>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}
      {trendingCopyPastas.length > 0 && (
        <Accordion
          type="single"
          collapsible
          className="h-fit w-full flex-col space-y-2 rounded-md border p-4"
          defaultValue={isSmallDevice ? "" : "trendingCopy"}
        >
          <AccordionItem value="trendingCopy" className="border-0 p-0">
            <AccordionTrigger className="border-0 py-0">
              <h2 className="flex items-center gap-2 text-lg font-bold">
                <TrendingUp className="w-4" />
                Trending
              </h2>
            </AccordionTrigger>
            <AccordionContent className="mt-4 flex flex-col space-y-2 pb-0">
              {trendingCopyPastas.map((copy) => {
                return (
                  <Link
                    href={`/copy-pasta/${copy.copyPasta.id}?utm_content=trending`}
                    key={copy.copyPasta.id}
                    className="flex items-center justify-between"
                    prefetch={false}
                  >
                    <span className="text-sm hover:underline">
                      {trimContent(copy.copyPasta.content ?? "", 30)}
                    </span>
                    <span className="ml-4 flex items-center justify-center text-xs text-muted-foreground">
                      <NumberTicker
                        value={parseInt((copy.views as string) ?? "0")}
                      />{" "}
                      <Eye className="ml-2 w-4" />
                    </span>
                  </Link>
                );
              })}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}
      <Accordion
        type="single"
        collapsible
        className="h-fit w-full flex-col space-y-2 rounded-md border p-4"
        defaultValue={isSmallDevice ? "" : "trendingTag"}
      >
        <AccordionItem value="trendingTag" className="border-0 p-0">
          <AccordionTrigger className="border-0 py-0">
            <h2 className="flex items-center gap-2 text-lg font-bold">
              <Hash className="w-4" />
              Tags
            </h2>
          </AccordionTrigger>
          <AccordionContent className="mt-4 pb-0">
            <ScrollArea className="h-fit md:max-h-44">
              <div className="flex flex-wrap gap-2">
                <ListTags id={props.tag} />
              </div>
            </ScrollArea>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
