"use client";

import { Badge } from "~/components/ui/badge";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "~/components/ui/table";
import { getBreadcrumbs, getMedal } from "~/lib/utils";
import { api } from "~/trpc/react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import Link from "next/link";
import Avatar from "~/components/ui/avatar";
import BreadCrumbs from "~/components/BreadCrumbs";
import { usePathname } from "next/navigation";
import { Laugh, Library, NotebookPen } from "lucide-react";
import { RainbowBadge } from "~/components/magicui/rainbow-badge";
import Lottie from "react-lottie-player";

export default function RankingPage() {
  const [rankings] = api.ranking.topUsers.useSuspenseQuery(undefined, {
    staleTime: Infinity,
  });
  const [rankingLists] = api.ranking.list.useSuspenseQuery(undefined, {
    staleTime: Infinity,
  });

  function getBadgeVariant(index: number) {
    switch (index) {
      case 1:
        return "gold";
      case 2:
        return "silver";
      case 3:
        return "bronze";
      default:
        return "white";
    }
  }

  const pathname = usePathname();
  const breadcrumbs = getBreadcrumbs(pathname);

  return (
    <div className="mx-auto w-full">
      <BreadCrumbs path={breadcrumbs} />
      <div className="mb-8 mt-6">
        <h1 className="text-2xl font-bold">Peringkat Tukang Arsip</h1>
        <p className="text-muted-foreground">
          inilah peringkat tukang arsip di arsip template
        </p>

        <Accordion type="single" collapsible>
          <AccordionItem value="item-1" className="border-0">
            <AccordionTrigger className="text-sm text-primary">
              Urutan Ranking
            </AccordionTrigger>
            <AccordionContent>
              <ul className="flex flex-col gap-y-2">
                <p>
                  Score dihitung berdasarkan:
                  <ul className="mt-2 list-decimal space-y-1.5 pl-4 italic">
                    <li>buat template (1 poin)</li>
                    <li>template diapprove (1 poin)</li>
                    <li>memberi reaction (3 poin)</li>
                    <li>membuat koleksi (3 poin)</li>
                  </ul>
                </p>
                {rankingLists.map((rank, index) => {
                  return (
                    <li className="py-1" key={rank.id}>
                      <span className="font-semibold">
                        <Badge
                          variant={getBadgeVariant(index + 1)}
                          className="font-bold"
                        >
                          {rank.title}
                        </Badge>
                      </span>{" "}
                      {">"}{" "}
                      <span className="font-bold italic">
                        {rank.minimumScore}
                      </span>{" "}
                      Score
                    </li>
                  );
                })}
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
      <div className="rounded-lg border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-24"></TableHead>
              <TableHead>Tukang Arsip</TableHead>
              <TableHead className="text-center">Rank</TableHead>
              <TableHead className="w-24 text-center">Kontribusi</TableHead>
              <TableHead className="w-24 text-center">Score</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="overflow-y-auto">
            {rankings.map((rank, i) => {
              const rankPosition = i + 1;
              return (
                <Link
                  href={`/user/${rank.username ? rank.username : rank.id}?utm_content=ranking`}
                  prefetch={false}
                  legacyBehavior
                  key={rank.id}
                >
                  <TableRow className="cursor-pointer">
                    <TableCell className="text-center font-medium">
                      {getMedal(rankPosition)}
                    </TableCell>
                    <TableCell className="w-64 md:w-72">
                      <div className="my-auto flex h-full items-center gap-2">
                        <span className="mr-4 rounded-full border-2 border-secondary-foreground">
                          <Avatar
                            seed={rank.avatarSeed ?? rank.id}
                            zoom={130}
                          />
                        </span>
                        <div className="flex flex-col gap-2">
                          <Badge
                            variant={getBadgeVariant(rankPosition)}
                            className="flex w-fit"
                          >
                            {rank.name}
                          </Badge>
                          <RainbowBadge className="w-fit">
                            <Lottie
                              path="https://fonts.gstatic.com/s/e/notoemoji/latest/1f525/lottie.json"
                              play
                              loop
                              className="mr-2 h-4 w-4"
                            />
                            {rank.currentStreak} streak
                          </RainbowBadge>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={"ghost"}>{rank.rank?.title}</Badge>
                    </TableCell>
                    <TableCell className="w-48 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <Badge variant={"white"} className="w-fit">
                          <NotebookPen className="mr-2 w-3 py-1" />{" "}
                          {rank.count.copyPastas.approved} /{" "}
                          {rank.count.copyPastas.total}
                        </Badge>
                        <Badge variant={"white"} className="w-fit">
                          <Laugh className="mr-2 w-3 py-1" />{" "}
                          {rank.count.reactions}
                        </Badge>
                        <Badge variant={"white"} className="w-fit">
                          <Library className="mr-2 w-3 py-1" />{" "}
                          {rank.count.collections}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="w-24 text-center">
                      {rank.engagementScore}
                    </TableCell>
                  </TableRow>
                </Link>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
