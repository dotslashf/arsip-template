import { type $Enums, OriginSource } from "@prisma/client";
import { type ClassValue, clsx } from "clsx";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDateToHuman(date: Date, formatString = "PPP") {
  return format(date, formatString, { locale: id });
}

export function trimContent(content: string, length = 255) {
  return content
    ? content.slice(0, length) + (content.length > length ? "..." : "")
    : "😱😱😱";
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
      return "";
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
