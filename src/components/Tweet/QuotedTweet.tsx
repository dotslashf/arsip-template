import { enrichTweet, formatNumber, TweetBody, TweetMedia } from "react-tweet";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { type QuotedTweet } from "react-tweet/api";
import { Heart, MessageCircle, Repeat2 } from "lucide-react";
import { AvatarImage, AvatarFallback, Avatar } from "../ui/avatar";
import { parseISO } from "date-fns";
import { formatDateToHuman } from "~/lib/utils";

type CustomTweetProps = {
  tweet: QuotedTweet;
};
export default function QuotedTweet({ tweet: t }: CustomTweetProps) {
  const tweet = enrichTweet({
    __typename: "Tweet",
    conversation_count: 0,
    news_action_type: "conversation",
    ...t,
  });
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center space-x-4 pb-2">
        <Avatar>
          <AvatarImage
            src={tweet.user.profile_image_url_https}
            alt={tweet.user.name}
          />
          <AvatarFallback>{tweet.user.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center font-bold">
            {tweet.user.name}
            {(tweet.user.verified || tweet.user.is_blue_verified) && (
              <svg
                className="ml-1 h-4 w-4 text-blue-500"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z" />
              </svg>
            )}
          </div>
          <div className="text-sm text-gray-500">@{tweet.user.screen_name}</div>
        </div>
      </CardHeader>
      <CardContent>
        <TweetBody tweet={tweet} />
        {tweet.mediaDetails?.length ? <TweetMedia tweet={tweet} /> : null}
      </CardContent>
      <CardFooter className="flex flex-col justify-between gap-2 text-sm text-gray-500 md:flex-row">
        <div className="flex gap-4">
          <span className="inline-flex items-center">
            <MessageCircle className="mr-2 h-4 w-4" />
            {formatNumber(t.reply_count)}
          </span>
          <span className="inline-flex items-center">
            <Repeat2 className="mr-2 h-4 w-4" />
            {formatNumber(t.retweet_count)}
          </span>
          <span className="inline-flex items-center">
            <Heart className="mr-2 h-4 w-4" />
            {formatNumber(t.favorite_count)}
          </span>
        </div>
        <div>{formatDateToHuman(parseISO(tweet.created_at), "hh:mm PPP")}</div>
      </CardFooter>
    </Card>
  );
}
