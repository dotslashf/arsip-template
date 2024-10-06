"use client";

import { formatDateDistance, parseEngagementLogs } from "~/utils";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { api } from "~/trpc/react";
import { type ActionType, type EngagementActionDataDb } from "~/lib/interface";
import { Badge } from "~/components/ui/badge";
import Link from "next/link";
import {
  History,
  LoaderCircle,
  PartyPopper,
  Plus,
  ThumbsDown,
  ThumbsUp,
  Trash,
} from "lucide-react";
import EmptyState from "../Common/EmptyState";
import { type Session } from "next-auth";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";

interface EngagementLogsHistoryProps {
  session: Session | null;
}
export default function EngagementLogHistory({
  session,
}: EngagementLogsHistoryProps) {
  const { data: logs, isLoading } =
    api.engagementLogs.latestEngagement.useQuery({ id: session!.user.id });

  function getEventIcon(event: ActionType) {
    const className = "w-3.5 h-3.5";
    switch (event) {
      case "approve":
        return <PartyPopper className={className} />;
      case "create":
        return <Plus className={className} />;
      case "delete":
        return <Trash className={className} />;
      case "give":
        return <ThumbsUp className={className} />;
      case "remove":
        return <ThumbsDown className={className} />;
    }
  }

  return (
    <Card className="w-full">
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger className="p-0 pr-4">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                Aktivitas Terakhir <History className="ml-2 w-4" />
              </CardTitle>
            </CardHeader>
          </AccordionTrigger>
          <AccordionContent>
            <CardContent className="pb-0">
              {isLoading && (
                <div className="flex h-20 items-center justify-center rounded-md border bg-secondary">
                  <LoaderCircle className="w-4 animate-spin" />
                </div>
              )}
              {logs && logs.length === 0 && (
                <EmptyState message="Masih kosong nih 😢" />
              )}
              <ol className="relative ml-2 flex flex-col gap-4 border-s-4 border-gray-200 dark:border-gray-700 md:ml-4">
                {logs?.map((log) => {
                  const parsed = JSON.parse(
                    JSON.stringify(log.data),
                  ) as EngagementActionDataDb;
                  return (
                    <li className="ms-6 flex" key={log.id}>
                      <div className="absolute -start-3.5 mt-1.5 flex h-6 w-6 items-center justify-center rounded-full border border-white bg-gray-200 dark:border-gray-900 dark:bg-gray-700">
                        {getEventIcon(parsed.action)}
                      </div>
                      <div className="mt-2 flex flex-col gap-2">
                        <time className="mb-1 text-sm font-semibold leading-none">
                          {formatDateDistance(log.createdAt)}
                        </time>
                        <div className="inline-flex flex-col gap-2 text-xs font-normal text-muted-foreground">
                          <Badge
                            variant={
                              parsed.action === "delete" ||
                              parsed.action === "remove"
                                ? "destructive"
                                : "white"
                            }
                            className="w-fit"
                          >
                            Skor {log.score}
                          </Badge>{" "}
                          <span>
                            {parseEngagementLogs(parsed).text}{" "}
                            {(parsed.action === "approve" ||
                              parsed.type === "reaction") && (
                              <Link
                                className="text-primary underline"
                                href={`/copy-pasta/${parsed.id}`}
                              >
                                {parseEngagementLogs(parsed).action}
                              </Link>
                            )}
                            {parsed.type === "collection" && (
                              <Link
                                className="text-primary underline"
                                href={`/collection/${parsed.id}`}
                              >
                                {parseEngagementLogs(parsed).action}
                              </Link>
                            )}
                          </span>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </CardContent>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
}
