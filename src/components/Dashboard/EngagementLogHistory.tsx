"use client";

import { formatDateDistance, parseEngagementLogs } from "~/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { api } from "~/trpc/react";
import { type EngagementActionDataDb } from "~/lib/interface";
import { Badge } from "../ui/badge";
import Link from "next/link";
import { LoaderCircle } from "lucide-react";
import EmptyState from "../EmptyState";
import { type Session } from "next-auth";

interface EngagementLogsHistoryProps {
  session: Session | null;
}
export default function EngagementLogHistory({
  session,
}: EngagementLogsHistoryProps) {
  const { data: logs, isLoading } =
    api.engagementLogs.latestEngagement.useQuery({ id: session!.user.id });

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center text-xl">
          Aktivitas Terakhir
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="flex h-20 items-center justify-center rounded-md border bg-secondary">
            <LoaderCircle className="w-4 animate-spin" />
          </div>
        )}
        {logs && logs.length === 0 && (
          <EmptyState message="Masih kosong nih 😢" />
        )}
        <ol className="relative space-y-4 border-s border-gray-200 dark:border-gray-700">
          {logs?.map((log) => {
            const parsed = JSON.parse(
              JSON.stringify(log.data),
            ) as EngagementActionDataDb;
            return (
              <li className="ms-4" key={log.id}>
                <div className="absolute -start-1.5 mt-1.5 h-3 w-3 rounded-full border border-white bg-gray-200 dark:border-gray-900 dark:bg-gray-700"></div>
                <time className="mb-1 text-sm font-normal leading-none">
                  {formatDateDistance(log.createdAt)}
                </time>
                <div className="mt-2 items-center justify-center text-xs font-normal text-muted-foreground">
                  Skor <Badge variant={"secondary"}>{log.score}</Badge>{" "}
                  {parseEngagementLogs(parsed)}{" "}
                  {(parsed.action === "approve" ||
                    parsed.type === "reaction") && (
                      <Link
                        className="text-primary underline"
                        href={`/copy-pasta/${parsed.id}`}
                      >
                        ini
                      </Link>
                    )}
                  {parsed.type === "collection" && (
                    <Link
                      className="text-primary underline"
                      href={`/collection/${parsed.id}`}
                    >
                      ini
                    </Link>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </CardContent>
    </Card>
  );
}
