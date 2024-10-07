import { type ExclusiveBadgeType } from "@prisma/client";
import ExclusiveShinyBadge from "../ui/exclusive-shiny-badge";
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { CircleHelp, CalendarCheck } from "lucide-react";
import { formatDateToHuman } from "~/utils";

interface ExclusiveBadgeProps {
  badges: {
    achievedAt: Date;
    type: ExclusiveBadgeType;
  }[];
}
export default function ExclusiveBadge({ badges }: ExclusiveBadgeProps) {
  return (
    <>
      {badges
        ? badges
            .sort((a, b) => (a.type[0]! >= b.type[0]! ? 1 : -1))
            .map((badge, i) => {
              return (
                <ExclusiveBadgeTooltip
                  achievedAt={badge.achievedAt}
                  type={badge.type}
                  i={i}
                  key={i}
                />
              );
            })
        : null}
    </>
  );
}

interface ExclusiveBadgeTooltipProps {
  type: ExclusiveBadgeType;
  achievedAt: Date;
  i: number;
}
function ExclusiveBadgeTooltip({
  achievedAt,
  type,
  i,
}: ExclusiveBadgeTooltipProps) {
  const [open, setOpen] = useState(false);

  let howToGet = "";
  switch (type) {
    case "Admin":
      howToGet = "Masuk ke top 5 leaderboard";
      break;
    case "Donatur":
    case "Supporter":
      howToGet = "Sst coba tanyain SuperAdmin yuk! 😉";
      break;
    case "SuperAdmin":
      howToGet = "😎";
      break;
  }

  return (
    <TooltipProvider>
      <Tooltip open={open} onOpenChange={setOpen}>
        <TooltipTrigger onClick={() => setOpen(true)}>
          <ExclusiveShinyBadge delay={(i + 1) * 0.1} type={type}>
            {type === "SuperAdmin" ? "Super" : type}
          </ExclusiveShinyBadge>
        </TooltipTrigger>
        <TooltipContent align="start" className="p-3">
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
