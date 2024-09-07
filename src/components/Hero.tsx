"use client";

import { Package, PenBoxIcon, Search } from "lucide-react";
import React from "react";
import { buttonVariants } from "./ui/button";
import Link from "next/link";
import { cn, trimContent } from "~/lib/utils";
import Marquee from "./magicui/marquee";
import { Card, CardContent, CardFooter } from "./ui/card";
import Tag from "./ui/tags";

const CardDisplay = ({
  content,
  tags,
}: {
  content: string;
  tags: {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
  }[];
}) => {
  return (
    <Card className="flex w-fit flex-col justify-between">
      <CardContent className="flex flex-col justify-between gap-2 overflow-x-hidden pb-2 pt-4 text-sm hover:cursor-auto">
        <blockquote className="w-full">{trimContent(content, 35)}</blockquote>
      </CardContent>
      <CardFooter>
        <div className="flex w-full space-x-2">
          {tags.map((tag) => {
            return (
              <Tag
                key={tag.id}
                tagContent={tag}
                className="rounded-sm shadow-sm hover:bg-primary hover:text-primary-foreground"
                onClick={() => null}
              />
            );
          })}
        </div>
      </CardFooter>
    </Card>
  );
};

interface HeroProps {
  copyPastas: {
    content: string;
    tags: {
      id: string;
      name: string;
      createdAt: Date;
      updatedAt: Date;
    }[];
  }[];
  isShowButton: boolean;
}
export default function Hero({ copyPastas, isShowButton }: HeroProps) {
  const firstRow = copyPastas.slice(0, copyPastas.length / 2);
  const secondRow = copyPastas.slice(copyPastas.length / 2);
  return (
    <div className="relative flex h-[500px] w-full flex-col items-center justify-center overflow-hidden bg-background md:shadow-xl">
      <div className="absolute top-8 z-10 px-4 text-center md:top-6">
        <Link
          href={"/"}
          className="mb-4 flex items-center justify-center bg-white bg-gradient-to-br from-primary via-primary/90 to-primary/80 bg-clip-text text-left text-3xl font-bold text-transparent lg:text-5xl"
        >
          <Package className="mr-1 h-5 w-5 text-primary lg:mr-3 lg:h-9 lg:w-9" />
          arsip
          <br />
          template
        </Link>
        <p className="text-md mx-auto max-w-xl font-bold text-secondary-foreground dark:text-white lg:text-xl">
          platform berbagi template (copy-pasta) dari netizen.
        </p>

        {isShowButton && (
          <div className="mt-4 flex flex-col items-center justify-center gap-4 md:flex-row">
            <Link
              href={"/copy-pasta/create"}
              className={cn(
                buttonVariants({ variant: "default", size: "lg" }),
                "",
              )}
            >
              Mulai Mengarsipkan
              <PenBoxIcon className="ml-2 h-4 w-4" />
            </Link>
            <Link
              href={"#main"}
              className={cn(
                buttonVariants({ variant: "secondary", size: "lg" }),
              )}
            >
              Cari Template
              <Search className="ml-2 w-4" />
            </Link>
          </div>
        )}
      </div>
      <div className="absolute bottom-0">
        <Marquee pauseOnHover className="[--duration:40s]">
          {firstRow.map((copy) => (
            <CardDisplay key={copy.content} {...copy} />
          ))}
        </Marquee>
        <Marquee reverse pauseOnHover className="[--duration:40s]">
          {secondRow.map((copy) => (
            <CardDisplay key={copy.content} {...copy} />
          ))}
        </Marquee>
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-white dark:from-background"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-white dark:from-background"></div>
    </div>
  );
}
