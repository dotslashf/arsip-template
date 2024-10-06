"use client";

import { type Session } from "next-auth";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import {
  CalendarCheck,
  CalendarClock,
  CalendarDays,
  CalendarRange,
  CircleHelp,
  Library,
  LoaderCircle,
  Tag,
  Trophy,
  Zap,
} from "lucide-react";
import { api } from "~/trpc/react";
import ShinyBadge from "../ui/shiny-badge";
import { AchievementType } from "@prisma/client";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import React, { type ReactNode, useState } from "react";
import { formatDateToHuman } from "~/utils";
import { ACHIEVEMENT_MINIMUM } from "~/lib/constant";

interface AchievementProps {
  session: Session | null;
}
export default function Achievement({ session }: AchievementProps) {
  const { data: achievementsAchieved, isLoading } =
    api.achievement.list.useQuery({
      userId: session!.user.id,
    });

  return (
    <Card className="w-full">
      <Accordion type="single" collapsible defaultValue="item-1">
        <AccordionItem value="item-1">
          <AccordionTrigger className="p-0 pr-4">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                Achievement <Trophy className="ml-2 w-4" />
              </CardTitle>
            </CardHeader>
          </AccordionTrigger>
          <AccordionContent>
            <CardContent className="pb-0">
              {isLoading ? (
                <div className="flex h-20 items-center justify-center rounded-md border bg-secondary">
                  <LoaderCircle className="w-4 animate-spin" />
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {getAchievements()
                    .sort((a) =>
                      achievementsAchieved?.find(
                        (achievement) => a.value === achievement.type,
                      )
                        ? -1
                        : 1,
                    )
                    .map((achievement, i) => {
                      const { value } = achievement;
                      const isAchieved = achievementsAchieved?.find(
                        (a) => a.type === value,
                      );
                      return (
                        <AchievementToolTip
                          i={i}
                          key={i}
                          isAchieved={!!isAchieved}
                          achievedAt={isAchieved?.achievedAt}
                          {...achievement}
                        />
                      );
                    })}
                </div>
              )}
            </CardContent>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
}
interface AchievementToolTipProps {
  i: number;
  isAchieved: boolean;
  label: string;
  icon: ReactNode;
  achievedAt?: Date;
  howToGet: string;
}
export function AchievementToolTip({
  i,
  isAchieved,
  label,
  icon,
  achievedAt,
  howToGet,
}: AchievementToolTipProps) {
  const [open, setOpen] = useState(false);

  return (
    <TooltipProvider>
      <Tooltip open={open} onOpenChange={setOpen}>
        <TooltipTrigger onClick={() => setOpen(true)}>
          <ShinyBadge key={i} isShining={!!isAchieved} delay={(i + 1) * 0.15}>
            {icon} {label}
          </ShinyBadge>
        </TooltipTrigger>
        <TooltipContent className="p-3">
          <div className="flex flex-col gap-2">
            <div className="flex items-center text-sm">
              <CircleHelp className="mr-2 h-4 w-4" />
              <span>{howToGet}</span>
            </div>
            <div className="flex items-center text-sm">
              <CalendarCheck className="mr-2 h-4 w-4" />
              {achievedAt ? (
                <span>
                  Didapatkan{" "}
                  <span className="font-semibold text-primary">
                    {formatDateToHuman(achievedAt)}
                  </span>
                </span>
              ) : (
                <span>Belum didapatkan</span>
              )}
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export function getAchievements() {
  const achievements = Object.values(AchievementType);

  return achievements.map((achievement) => {
    const className = "w-4 h-4 mr-2";
    switch (achievement) {
      case "CollectionCurator":
        return {
          label: "Collection Curator",
          value: achievement,
          icon: <Library className={className} />,
          howToGet: `Buat koleksi sebanyak ${ACHIEVEMENT_MINIMUM.COLLECTION_CURATOR.COLLECTION_MINIMUM} dengan template minimal ${ACHIEVEMENT_MINIMUM.COLLECTION_CURATOR.COPY_PASTA_PER_COLLECTION}`,
        };
      case "FiveCopyPastaADay":
        return {
          label: "5 Template Sehari",
          value: achievement,
          howToGet: `Buat template 5 dalam sehari`,
          icon: (
            <span className={className}>
              <svg
                fill="currentColor"
                viewBox="0 0 256 256"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M92.15527,126.27734l7.835-48.20214A12,12,0,0,1,111.835,68H152a12,12,0,0,1,0,24H122.042l-2.64062,16.24707a40.83,40.83,0,0,1,4.48047-.24512,39.99911,39.99911,0,1,1-28.34961,68.29883,11.99943,11.99943,0,1,1,16.93554-17.0039,16.202,16.202,0,0,0,22.8291-.001,15.91672,15.91672,0,0,0,0-22.5918,16.20438,16.20438,0,0,0-22.8291.001,12.00041,12.00041,0,0,1-20.3125-10.42774ZM228,48V208a20.02229,20.02229,0,0,1-20,20H48a20.02229,20.02229,0,0,1-20-20V48A20.02229,20.02229,0,0,1,48,28H208A20.02229,20.02229,0,0,1,228,48Zm-24,4H52V204H204Z" />
              </svg>
            </span>
          ),
        };
      case "TagCollector":
        return {
          label: "Pengepul Tag",
          value: achievement,
          icon: <Tag className={className} />,
          howToGet: `Memiliki template dengan jumlah tag yang berbeda sebanyak ${ACHIEVEMENT_MINIMUM.TAG_COLLECTOR_MINIMUM}`,
        };
      case "OneWeekStreak":
        return {
          label: "Streak 1 Minggu",
          value: achievement,
          icon: <Zap className={className} />,
          howToGet: `Buat template selama 1 minggu berturut-turut`,
        };
      case "SixMonthStreak":
        return {
          label: "Streak 6 Bulan",
          value: achievement,
          icon: <CalendarRange className={className} />,
          howToGet: `Buat template selama 6 bulan berturut-turut`,
        };
      case "ThreeMonthStreak":
        return {
          label: "Streak 3 Bulan",
          value: achievement,
          icon: <CalendarClock className={className} />,
          howToGet: `Buat template selama 3 bulan berturut-turut`,
        };
      case "TwoWeekStreak":
        return {
          label: "Streak 2 Minggu",
          value: achievement,
          icon: <CalendarDays className={className} />,
          howToGet: `Buat template selama 2 minggu berturut-turut`,
        };
      case "OneMonthStreak":
        return {
          label: "Streak 1 Bulan",
          value: achievement,
          icon: <CalendarCheck className={className} />,
          howToGet: `Buat template selama 1 bulan berturut-turut`,
        };
    }
  });
}
