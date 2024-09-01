"use client";

import { useMediaQuery } from "@uidotdev/usehooks";
import { Hash, TrendingUp } from "lucide-react";
import Link from "next/link";
import { cn } from "~/lib/utils";
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
  const [topCopyPastas] = api.copyPasta.getPopularCopyPasta.useSuspenseQuery();

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
            <h2 className="flex items-center gap-2 text-lg font-semibold">
              <TrendingUp className="w-4" />
              Trending Template
            </h2>
          </AccordionTrigger>
          <AccordionContent className="mt-4 pb-0">
            {topCopyPastas.map((copy, index) => {
              return (
                <Link
                  href={`/copy-pasta/${copy.copyPasta.id}`}
                  key={copy.copyPasta.id}
                  className="flex items-center justify-between hover:underline"
                  prefetch={false}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-muted-foreground">
                      {index + 1}
                    </span>
                    <span className="text-sm font-medium">
                      {copy.copyPasta.content}
                    </span>
                  </div>
                  <span className="text-xs text-confirm">
                    {copy.views} views
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
            <h2 className="flex items-center gap-2 text-lg font-semibold">
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
