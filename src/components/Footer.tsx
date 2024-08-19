"use client";

import { FeedbackFish } from "@feedback-fish/react";
import { Dot, MessageSquareText } from "lucide-react";
import Link from "next/link";
import { Button, buttonVariants } from "./ui/button";
import { type Session } from "next-auth";
import { api } from "~/trpc/react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Badge } from "./ui/badge";
import { sourceEnumHash } from "~/lib/constant";
import { cn } from "~/lib/utils";

interface FooterProps {
  session: Session | null;
}
export default function Footer({ session }: FooterProps) {
  const [count] = api.copyPasta.count.useSuspenseQuery();

  return (
    <footer className="w-full bg-white py-6 shadow dark:bg-card">
      <div className="container flex items-center justify-center gap-4 px-4 lg:px-[6.5rem]">
        <div className="flex w-full flex-col items-center gap-4 lg:flex-row">
          <Link
            href="/tos"
            className="text-sm hover:underline"
            prefetch={false}
          >
            Ketentuan Layanan
          </Link>
          <Dot className="hidden w-4 lg:block" />
          <Link
            href="/privacy-policy"
            className="text-sm hover:underline"
            prefetch={false}
          >
            Kebijakan Privasi
          </Link>
          <Dot className="hidden w-4 lg:block" />
          <Link
            href="/changelog"
            className="text-sm hover:underline"
            prefetch={false}
          >
            Changelog
          </Link>
          <div className="flex flex-col items-center justify-center gap-2 lg:ml-auto lg:flex-row">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant={"outline"}>
                  {count.total} template telah diarsipkan
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-fit">
                <div className="flex flex-col space-y-2">
                  {count.sources.map((source) => {
                    return (
                      <div
                        className="flex justify-between space-x-2 text-sm"
                        key={source.source}
                      >
                        <span className="flex items-center justify-center space-x-1">
                          <span
                            className={cn(
                              buttonVariants({
                                variant: "outline",
                                size: "xs",
                              }),
                            )}
                          >
                            {sourceEnumHash.get(source.source)?.icon}
                          </span>
                          <span>{source.source}</span>
                        </span>
                        <Badge variant={"destructive"}>{source.count}</Badge>
                      </div>
                    );
                  })}
                </div>
              </PopoverContent>
            </Popover>
            <FeedbackFish
              projectId="ee2e6f2b856911"
              userId={session ? session.user.id : undefined}
            >
              <Button>
                Ada Masukan? <MessageSquareText className="ml-2 w-4" />
              </Button>
            </FeedbackFish>
          </div>
        </div>
      </div>
    </footer>
  );
}
