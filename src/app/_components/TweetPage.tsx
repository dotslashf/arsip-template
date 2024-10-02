import React, { useState, useEffect } from "react";
import { TweetNotFound } from "react-tweet";
import { type Tweet } from "react-tweet/api";
import CustomTweet from "~/components/Tweet/CustomTweet";
import SkeletonTweet from "~/components/Tweet/SkeletonTweet";

export default function TweetPage({ id }: { id: string }) {
  const [tweet, setTweet] = useState<Tweet | undefined | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchTweet = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/tweet/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch tweet");
        }
        const { tweet }: { tweet: Tweet } = await response.json();
        setTweet(tweet);
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err : new Error("An error occurred"));
      } finally {
        setIsLoading(false);
      }
    };

    void fetchTweet();
  }, [id]);

  if (error) return <TweetNotFound error={error} />;
  if (!tweet || isLoading) return <SkeletonTweet />;

  return <CustomTweet tweet={tweet} />;
}
