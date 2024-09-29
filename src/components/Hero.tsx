"use client";

import { NotebookPen, Search } from "lucide-react";
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
        "relative -mt-8 flex w-full max-w-4xl flex-col overflow-hidden bg-background",
        isShowButton ? "h-[650px]" : "h-screen py-16",
      )}
    >
      <div className="z-30 flex w-full flex-grow flex-col items-center justify-center text-center">
        <Link
          href={"/"}
          className={cn(
            `animate-gradient duration-3000 mb-4 inline bg-white bg-gradient-to-r from-primary via-primary/60 to-primary bg-[length:var(--bg-size)_100%] bg-clip-text text-5xl font-bold text-transparent ease-out [--bg-size:300%]`,
          )}
        >
          arsip
          <br />
          template
        </Link>
        <p className="text-md mx-auto max-w-xl font-bold text-secondary-foreground dark:text-white lg:text-xl">
          platform berbagi template (copy-pasta) dari netizen.
        </p>

        {isShowButton && (
          <div className="mt-4 flex flex-col items-center justify-center gap-4">
            <Link
              href={"/copy-pasta/create"}
              className={cn(
                buttonVariants({ variant: "default", size: "lg" }),
                "",
              )}
            >
              Mulai Mengarsipkan
              <NotebookPen className="ml-2 h-4 w-4" />
            </Link>
            <Link
              href={"/copy-pasta#main"}
              className={cn(
                buttonVariants({ variant: "secondary", size: "lg" }),
              )}
            >
              Cari
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
        width={14}
        height={14}
        cx={1}
        cy={1}
        cr={1}
        className={cn(
          "[mask-image:radial-gradient(500px_circle_at_top,white,transparent)]",
        )}
      />
      <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-1/5 bg-gradient-to-r from-white dark:from-background md:w-1/3"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 z-20 w-1/5 bg-gradient-to-l from-white dark:from-background md:w-1/3"></div>
    </div>
  );
}
