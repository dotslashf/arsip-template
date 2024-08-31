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
import { getMedal } from "~/lib/utils";
import { api } from "~/trpc/react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import Link from "next/link";
import Avatar from "~/components/ui/avatar";

export default function RankingPage() {
  const [rankings] = api.ranking.topUsers.useSuspenseQuery(undefined, {
    staleTime: Infinity,
  });
  const [rankingLists] = api.ranking.list.useSuspenseQuery(undefined, {
    staleTime: Infinity,
  });

  return (
    <div className="mx-auto w-full">
      <div className="mb-8">
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
                {rankingLists.map((rank) => {
                  return (
                    <li className="py-1 font-mono" key={rank.id}>
                      <span className="font-semibold">
                        <Badge>{rank.title}</Badge>
                      </span>{" "}
                      {">"}{" "}
                      <span className="font-bold italic">
                        <Badge variant={"secondary"}>{rank.minCount}</Badge>
                      </span>{" "}
                      template
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
              <TableHead className="w-24 text-center"># Arsip</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="overflow-y-auto">
            {rankings.map((rank, i) => {
              const rankPosition = i + 1;
              return (
                <Link
                  href={`/user/${rank.username ? rank.username : rank.id}`}
                  prefetch={false}
                  legacyBehavior
                  key={rank.id}
                >
                  <TableRow className="cursor-pointer">
                    <TableCell className="text-center font-medium">
                      {rankPosition}
                    </TableCell>
                    <TableCell className="flex w-64 items-center gap-2 md:w-72">
                      <span className="mr-4 rounded-full border-2 border-secondary-foreground">
                        <Avatar seed={rank.avatarSeed ?? rank.id} zoom={130} />
                      </span>
                      <Badge variant={"ghost"} className="flex w-fit">
                        {getMedal(rankPosition)} {rank.name}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge>{rank.rank?.title}</Badge>
                    </TableCell>
                    <TableCell className="w-24 text-center">
                      {rank._count.CopyPastaCreatedBy}
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
