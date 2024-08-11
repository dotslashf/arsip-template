"use client";

import { useRouter } from "next/navigation";
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

export default function RankingPage() {
  const [rankings] = api.ranking.topUsers.useSuspenseQuery();
  const [rankingLists] = api.ranking.list.useSuspenseQuery();
  const router = useRouter();

  return (
    <div className="mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Peringkat Tukang Arsip</h1>
        <p className="text-muted-foreground">
          inilah peringkat tukang arsip di arsip-template
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
              <TableHead className="w-[50px]"></TableHead>
              <TableHead>User</TableHead>
              <TableHead className="text-center">Rank</TableHead>
              <TableHead className="w-24 text-center"># Arsip</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rankings.map((rank, i) => {
              const rankPosition = i + 1;
              return (
                <TableRow
                  key={rank.id}
                  className="cursor-pointer"
                  onClick={() => {
                    router.push(`/?byUserId=${rank.id}`);
                  }}
                >
                  <TableCell className="font-medium">{rankPosition}</TableCell>
                  <TableCell className="transition-colors hover:text-blue-500">
                    {getMedal(rankPosition)} {rank.name}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge>{rank.rank?.title}</Badge>
                  </TableCell>
                  <TableCell className="w-24 text-center">
                    {rank._count.CopyPastaCreatedBy}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
