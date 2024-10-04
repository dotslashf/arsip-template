import { OriginSource } from "@prisma/client";
import { type Breadcrumb } from "~/lib/interface";

export function getTweetId(tweetUrl: string) {
  const match = tweetUrl.match(/\/status\/(\d+)/);
  return match ? match[1] : undefined;
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

export function getBreadcrumbs(url: string): Breadcrumb[] {
  const parts = url.split("/").filter((part) => part !== "");
  const breadcrumbs: Breadcrumb[] = [];
  let currentPath = "";

  parts.forEach((part) => {
    currentPath += `/${part}`;
    const text = part;
    breadcrumbs.push({ url: currentPath, text });
  });

  return breadcrumbs;
}
