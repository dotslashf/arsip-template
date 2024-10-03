import Link from "next/link";
import { type EnrichedTweet } from "react-tweet";

interface CustomTweetBodyProps {
  tweet: EnrichedTweet;
}
export default function CustomTweetBody({ tweet }: CustomTweetBodyProps) {
  const results = tweet.entities.map((e, i) => {
    switch (e.type) {
      case "hashtag":
      case "mention":
      case "url":
      case "symbol":
        return (
          <Link
            key={i}
            href={e.href}
            prefetch={false}
            className="text-primary underline"
          >
            {e.text}
          </Link>
        );
      case "media":
        return null;
      default:
        return (
          <span
            key={i}
            dangerouslySetInnerHTML={{
              __html: e.text,
            }}
          />
        );
    }
  });

  return <p>{results}</p>;
}
