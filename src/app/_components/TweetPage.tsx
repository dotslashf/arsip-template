import { parseISO } from "date-fns";
import { X } from "lucide-react";
import React, { useState, useEffect } from "react";
import { enrichTweet } from "react-tweet";
import { type Tweet } from "react-tweet/api";
import EmptyState from "~/components/EmptyState";
import CustomTweet from "~/components/Tweet/CustomTweet";
import SkeletonTweet from "~/components/Tweet/SkeletonTweet";
import { sanitizeTweetEnrich } from "~/lib/utils";

interface TweetPageProps {
  id: string;
  onTweetLoaded: ({
    content,
    postedAt,
  }: {
    content: string;
    postedAt: Date;
  }) => void;
}
export default function TweetPage({ id, onTweetLoaded }: TweetPageProps) {
  const [tweet, setTweet] = useState<Tweet | undefined | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchTweet = async () => {
      setError(null);
      try {
        setIsLoading(true);
        const response = await fetch(`/api/tweet/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch tweet");
        }
        const { tweet }: { tweet: Tweet } = await response.json();
        setTweet(tweet);
        const enrich = enrichTweet(tweet);
        onTweetLoaded({
          content: sanitizeTweetEnrich(enrich),
          postedAt: parseISO(tweet.created_at),
        });
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err : new Error("An error occurred"));
      } finally {
        setIsLoading(false);
      }
    };

    void fetchTweet();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (error)
    return (
      <EmptyState
        className="border-solid text-lg"
        message={
          <span className="inline-flex items-center">
            Tweet tidak ditemukan <X className="ml-2 inline" />
          </span>
        }
      />
    );
  if (!tweet || isLoading) return <SkeletonTweet />;

  return <CustomTweet tweet={tweet} />;
}
