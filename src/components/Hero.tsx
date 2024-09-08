"use client";

import { Package, PenBoxIcon, Search } from "lucide-react";
import React from "react";
import { buttonVariants } from "./ui/button";
import Link from "next/link";
import { cn } from "~/lib/utils";
import Marquee from "./magicui/marquee";
import DotPattern from "./magicui/dot-pattern";
import CardDisplay from "./CopyPasta/CardDisplay";

interface HeroProps {
  copyPastas: {
    id: string;
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
    <div
      className={cn(
        "relative flex w-full max-w-4xl flex-col overflow-hidden bg-background",
        isShowButton ? "h-[500px]" : "h-screen py-16",
      )}
    >
      <div className="z-30 flex w-full flex-grow flex-col items-center justify-center px-4 text-center">
        <Link
          href={"/"}
          className="mb-4 flex items-center justify-center bg-white bg-gradient-to-br from-primary via-primary/90 to-primary/80 bg-clip-text text-left text-4xl font-bold text-transparent lg:text-5xl"
        >
          <Package className="mr-1 h-8 w-8 text-primary lg:mr-3 lg:h-9 lg:w-9" />
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
      <div className="z-10 mt-auto">
        <Marquee pauseOnHover className="[--duration:60s]">
          {firstRow.map((copy) => (
            <CardDisplay key={copy.content} {...copy} />
          ))}
        </Marquee>
        <Marquee reverse pauseOnHover className="[--duration:60s]">
          {secondRow.map((copy) => (
            <CardDisplay key={copy.content} {...copy} />
          ))}
        </Marquee>
      </div>
      <DotPattern
        width={15}
        height={15}
        cx={1}
        cy={1}
        cr={1}
        className={cn(
          "[mask-image:radial-gradient(550px_circle_at_top,white,transparent)]",
        )}
      />
      <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-1/4 bg-gradient-to-r from-white dark:from-background"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 z-20 w-1/4 bg-gradient-to-l from-white dark:from-background"></div>
    </div>
  );
}
