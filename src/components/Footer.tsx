"use client";

import { ChartColumn, Dot } from "lucide-react";
import Link from "next/link";
import { Button, buttonVariants } from "./ui/button";
import { api } from "~/trpc/react";
import { DAYS } from "~/lib/constant";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";

export default function Footer() {
  const [count] = api.copyPasta.count.useSuspenseQuery(undefined, {
    staleTime: 1 * DAYS,
    gcTime: 1 * DAYS,
  });

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
            <Button variant={"outline"}>
              {count.total} template telah diarsipkan
            </Button>
            <Link
              href={
                "https://umami-arsip-template.koyeb.app/share/Jjaaozgtll3OpRxF/arsiptemplate.app"
              }
              target="__blank"
              className={buttonVariants({ variant: "outline" })}
            >
              Analytics <ChartColumn className="ml-2 w-4" />
            </Link>
            <Link
              href={"https://github.com/dotslashf/arsip-template"}
              target="__blank"
              className={buttonVariants({ variant: "secondary", size: "icon" })}
            >
              <FontAwesomeIcon className="h-6 w-6" icon={faGithub} />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
