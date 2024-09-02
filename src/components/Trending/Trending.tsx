"use client";

import { useMediaQuery } from "@uidotdev/usehooks";
import { Eye, Hash, TrendingUp } from "lucide-react";
import Link from "next/link";
import { cn, trimContent } from "~/lib/utils";
import { api } from "~/trpc/react";
import { ScrollArea } from "../ui/scroll-area";
import ListTags from "../ListTags";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";

interface TrendingHomeProps {
  tag: string | null;
}
export default function TrendingHome(props: TrendingHomeProps) {
  const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");
  const [topCopyPastas] = api.analytics.getPopularCopyPasta.useSuspenseQuery();

  return (
    <div
      className={cn(
        isSmallDevice
          ? "order-first col-span-3"
          : "sticky top-[4.5rem] self-start",
        "flex flex-col gap-4",
      )}
    >
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
              Trending Template
            </h2>
          </AccordionTrigger>
          <AccordionContent className="mt-4 flex flex-col space-y-2 pb-0">
            {topCopyPastas.map((copy) => {
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
                    {copy.views} <Eye className="ml-2 w-4" />
                  </span>
                </Link>
              );
            })}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
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
            <ScrollArea className="h-fit md:h-44">
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
