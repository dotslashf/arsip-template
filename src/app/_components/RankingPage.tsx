"use client";

import Link from "next/link";
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

export default function RankingPage() {
  const [rankings] = api.ranking.topUsers.useSuspenseQuery();

  return (
    <div className="mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Peringkat Tukang Arsip</h1>
        <p className="text-muted-foreground">
          inilah peringkat tukang arsip di arsip-template
        </p>
      </div>
      <div className="rounded-lg border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]"></TableHead>
              <TableHead>User</TableHead>
              <TableHead className="w-24 text-center"># Arsip</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rankings.map((rank, i) => {
              const rankPosition = i + 1;
              return (
                <TableRow key={rank.id}>
                  <TableCell className="font-medium">{rankPosition}</TableCell>
                  <Link href={`/?byUserId=${rank.id}`}>
                    <TableCell className="cursor-pointer transition-colors hover:text-blue-500">
                      {getMedal(rankPosition)} {rank.name}
                    </TableCell>
                  </Link>
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
