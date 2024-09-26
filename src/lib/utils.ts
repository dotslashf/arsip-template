/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { twMerge } from "tailwind-merge";
import { type $Enums, EngagementAction, OriginSource } from "@prisma/client";
import { type ClassValue, clsx } from "clsx";
import { format, formatDistance, parse } from "date-fns";
import { format as formatTz, toZonedTime } from "date-fns-tz";
import { id } from "date-fns/locale";
import {
  type Breadcrumb,
  type EngagementActionRecord,
  type EngagementActionDataDb,
} from "./interface";
import {
  type Thing,
  type WithContext,
  type WebSite,
  type SearchAction,
} from "schema-dts";
import { baseUrl, TIMEZONE } from "./constant";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDateToHuman(date: Date, formatString = "PPP") {
  return format(date, formatString, { locale: id });
}

export function formatDateDistance(date: Date) {
  return formatDistance(date, new Date(), { locale: id, addSuffix: true });
}

export function parseDate(date: string) {
  return parse(date, "d MMMM yyyy", new Date(), { locale: id });
}

export function getJakartaDate(date: Date = new Date()): Date {
  return toZonedTime(date, TIMEZONE);
}

export function getJakartaDateString(date: Date = new Date()): string {
  return formatTz(getJakartaDate(date), "yyyy-MM-dd", { timeZone: TIMEZONE });
}

export function trimContent(content: string, length = 255) {
  if (!content) {
    return "😱😱😱";
  }

  const trimmedContent = content.slice(0, length).trimEnd();
  return trimmedContent + (content.length > length ? "..." : "");
}

export function getRandomElement(array: string[]) {
  if (array.length === 0) {
    throw new Error("Array cannot be empty");
  }
  return array[Math.floor(Math.random() * array.length)];
}

export function determineSource(url = "Other") {
  const regex =
    /((https?:\/\/)?(?:www\.)?(facebook\.com|fb\.me|twitter\.com|t\.co|x\.com)\/[^\s]+)/;
  if (url === "Other") {
    return OriginSource.Other;
  }
  const match = RegExp(regex).exec(url.toLowerCase());
  if (!match) {
    return OriginSource.Other;
  }
  const source = match[3];

  if (source === "facebook.com" || source === "fb.me") {
    return OriginSource.Facebook;
  } else if (
    source === "twitter.com" ||
    source === "x.com" ||
    source === "t.co"
  ) {
    return OriginSource.Twitter;
  } else {
    return OriginSource.Other;
  }
}

export function getMedal(number: number) {
  switch (number) {
    case 1:
      return "🥇 ";
    case 2:
      return "🥈 ";
    case 3:
      return "🥉 ";
    default:
      return number;
  }
}

export function mergeReactions(
  data?: {
    copyPastaId: string;
    userId: string;
    emotion: $Enums.EmotionType;
    _count: {
      emotion: number;
    };
  }[],
) {
  return data?.reduce(
    (acc, curr) => {
      const key = `${curr.emotion}`;

      if (!acc[key]) {
        acc[key] = {
          ...curr,
          userIds: [],
          _count: { emotion: 0 },
        };
      }

      acc[key]._count.emotion += curr._count.emotion;
      acc[key].userIds.push(curr.userId);

      return acc;
    },
    {} as Record<
      string,
      {
        copyPastaId: string;
        userIds: string[];
        emotion: $Enums.EmotionType;
        _count: {
          emotion: number;
        };
      }
    >,
  );
}

export function getBreadcrumbs(url: string): Breadcrumb[] {
  const parts = url.split("/").filter((part) => part !== "");
  const breadcrumbs: Breadcrumb[] = [];
  let currentPath = "";

  parts.forEach((part) => {
    currentPath += `/${part}`;
    const text = part; // Use the part itself as the text
    breadcrumbs.push({ url: currentPath, text });
  });

  return breadcrumbs;
}

export function generateSchemaById<T extends Thing>(json: WithContext<T>) {
  return json;
}

type QueryAction = SearchAction & {
  "query-input": string;
};

export function generateSchemaOrgWebSite(): WithContext<WebSite> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Arsip Template",
    url: baseUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${baseUrl}/copy-pasta?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    } as QueryAction,
  };
}

export const actionMap: EngagementActionRecord = {
  [EngagementAction.CreateCopyPasta]: { action: "create", type: "copyPasta" },
  [EngagementAction.ApproveCopyPasta]: { action: "approve", type: "copyPasta" },
  [EngagementAction.GiveReaction]: { action: "give", type: "reaction" },
  [EngagementAction.RemoveReaction]: { action: "remove", type: "reaction" },
  [EngagementAction.CreateCollection]: { action: "create", type: "collection" },
  [EngagementAction.DeleteCollection]: { action: "delete", type: "collection" },
};

export function handleEngagementAction(
  action: EngagementAction,
  resourceId: string | null,
): EngagementActionDataDb {
  const actionData = actionMap[action];

  return {
    engagementType: action,
    action: actionData.action,
    id: resourceId,
    type: actionData.type,
  };
}

export function parseEngagementLogs(log: EngagementActionDataDb) {
  let action = "";
  let activity = "";

  switch (log.action) {
    case "create":
      action = "Telah membuat";
      break;
    case "approve":
      action = "Template sudah disetujui";
      break;
    case "delete":
      action = "Menghapus";
      break;
    case "give":
      action = "Memberikan";
      break;
    case "remove":
      action = "Menghapus";
      break;
  }

  switch (log.type) {
    case "collection":
      activity = "koleksi";
      break;
    case "copyPasta":
      activity = "template";
      break;
    case "reaction":
      activity = "reaksi pada template";
      break;
  }

  return `${action} ${activity}`;
}
