"use client";

import { Badge } from "~/components/ui/badge";
import { ANALYTICS_EVENT } from "~/lib/constant";
import useToast from "~/components/ui/use-react-hot-toast";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import { type EmotionType } from "@prisma/client";
import { session } from "../Common/HOCSession";
import { useEffect, useState } from "react";
import { cn } from "~/lib/utils";
import { trackEvent } from "~/lib/track";
import Lottie from "react-lottie-player";

interface ReactionSummaryChildProps {
  copyPastaId: string;
  emotion: string;
  count: number;
  userIds?: string[];
}
export default function ReactionSummaryChild({
  copyPastaId,
  count,
  emotion,
  userIds,
}: ReactionSummaryChildProps) {
  const toast = useToast();
  const utils = api.useUtils();
  const router = useRouter();

  const mutationReaction = api.reaction.reactionByCopyPastaId.useMutation({
    async onSuccess(data) {
      void utils.copyPasta.list.invalidate();
      void trackEvent(ANALYTICS_EVENT.REACTION, {
        path: `/copy-pasta/${copyPastaId}`,
        value: `${data.emotion}`,
        button: "reaction_summary",
        userId: data.userId,
      });
    },
  });
  const mutationUnReaction = api.reaction.unReactionByUserId.useMutation({
    async onSuccess(data) {
      void utils.copyPasta.list.invalidate();
      void trackEvent(ANALYTICS_EVENT.REACTION, {
        path: `/copy-pasta/${copyPastaId}`,
        value: `none`,
        button: "reaction_summary",
        userId: data,
      });
    },
  });

  const [currentUser, setCurrentUser] = useState<string>();

  useEffect(() => {
    async function fetchSession() {
      const isSession = await session;
      setCurrentUser(isSession?.user.id);
    }

    fetchSession().catch((e) => console.log(e));
  }, []);

  async function handleUnReact() {
    if (!currentUser) return;
    void toast({
      message: "",
      promiseFn: mutationUnReaction.mutateAsync({
        copyPastaId: copyPastaId,
        userId: currentUser,
      }),
      type: "promise",
      promiseMsg: {
        success: `Kok gak jadi dilike? 🥹`,
        loading: "🔥 Sedang memasak",
        error: `Pelan pelan pak sopir 🏎️💨 `,
      },
    });
  }

  async function handleReaction(reaction: string) {
    const isSession = await session;
    if (!isSession) {
      return router.push("/auth/sign-in?utm_content=button_reaction");
    }

    let reactionName;
    switch (reaction) {
      case "Hah":
        reactionName = "🤯";
        break;
      case "Marah":
        reactionName = "🤬";
        break;
      case "Kocak":
        reactionName = "🤣";
        break;
      case "Setuju":
        reactionName = "💯";
        break;
    }
    void toast({
      message: "",
      promiseFn: mutationReaction.mutateAsync({
        copyPastaId,
        reactionType: reaction as EmotionType,
      }),
      type: "promise",
      promiseMsg: {
        success: `${reactionName} disimpan ✍️`,
        loading: "🔥 Sedang memasak",
        error: `Pelan pelan pak sopir 🏎️💨 `,
      },
    });
  }

  return (
    <div
      onClick={() =>
        currentUser && userIds?.includes(currentUser)
          ? handleUnReact()
          : handleReaction(emotion)
      }
    >
      <Badge
        variant={
          currentUser && userIds?.includes(currentUser) ? "default" : "outline"
        }
        className="rounded-md"
      >
        <ReactionChildWrapper className="mr-2 h-5 w-5 text-sm" type={emotion} />
        {count}
      </Badge>
    </div>
  );
}

interface ReactionChildWrapperProp {
  className?: string;
  type: string;
}
export function ReactionChildWrapper({
  className,
  type,
}: ReactionChildWrapperProp) {
  let emotion = "";
  switch (type) {
    case "Kocak":
      emotion = "1f923";
      break;
    case "Marah":
      emotion = "1f92c";
      break;
    case "Setuju":
      emotion = "1f4af";
      break;
    case "Hah":
      emotion = "1f92f";
      break;
    default:
      break;
  }
  return (
    <Lottie
      path={`https://fonts.gstatic.com/s/e/notoemoji/latest/${emotion}/lottie.json`}
      play
      loop
      className={cn("flex h-4 w-4 items-center justify-center", className)}
    />
  );
}
