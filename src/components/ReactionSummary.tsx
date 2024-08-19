import { type $Enums, EmotionType } from "@prisma/client";
import dynamic from "next/dynamic";
import { Badge } from "./ui/badge";
import { Skeleton } from "./ui/skeleton";
import { mergeReactions } from "~/lib/utils";

const ReactionSummaryChild = dynamic(() => import("./ReactionSummaryChild"), {
  ssr: false,
  loading: () => (
    <Badge variant={"secondary"}>
      <Skeleton className="mr-2 h-4 w-4 rounded-full" /> 0
    </Badge>
  ),
});

interface ReactionSummaryProps {
  copyPastaId: string;
  reactions?: {
    copyPastaId: string;
    userId: string;
    emotion: $Enums.EmotionType;
    _count: {
      emotion: number;
    };
  }[];
}
export default function ReactionSummary({
  reactions,
  copyPastaId,
}: ReactionSummaryProps) {
  return (
    <div className="flex space-x-2">
      {Object.keys(EmotionType).map((reaction) => {
        const merged = mergeReactions(reactions);
        const isReactionExist = merged?.[reaction];
        return (
          <ReactionSummaryChild
            key={reaction}
            copyPastaId={copyPastaId}
            count={isReactionExist?._count.emotion ?? 0}
            emotion={reaction}
            userIds={isReactionExist?.userIds}
          />
        );
      })}
    </div>
  );
}
