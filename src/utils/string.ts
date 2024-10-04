import he from "he";
import { type EnrichedTweet } from "react-tweet";

export function sanitizeTweet(text: string) {
  return he.decode(text);
}

export function sanitizeTweetEnrich(tweet: EnrichedTweet) {
  return tweet.entities
    .map((e) => {
      switch (e.type) {
        case "media":
        case "symbol":
        case "url":
          return;
        case "hashtag":
        case "mention":
        case "text":
          return e.text;
      }
    })
    .join(" ");
}

export function trimContent(content: string, length = 255) {
  if (!content) {
    return "😱😱😱";
  }

  const trimmedContent = content.slice(0, length).trimEnd();
  return trimmedContent + (content.length > length ? "..." : "");
}

export function capitalize(str: string): string {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}
