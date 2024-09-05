"use client";

import { motion } from "framer-motion";
import { Badge } from "./ui/badge";
import { ANALYTICS_EVENT } from "~/lib/constant";
import useToast from "./ui/use-react-hot-toast";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import { type EmotionType } from "@prisma/client";
import { session } from "./HOCSession";
import { useEffect, useState } from "react";
import { cn } from "~/lib/utils";
import { trackEvent } from "~/lib/track";

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
        reactionName = "hmm";
        break;
      case "Marah":
        reactionName = "ngeselin";
        break;
      case "Kocak":
        reactionName = "ngakak";
        break;
      case "Setuju":
        reactionName = "setuju";
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
        success: `Reaksi ${reactionName} ✍️`,
        loading: "🔥 Sedang memasak",
        error: `Pelan pelan pak sopir 🏎️💨 `,
      },
    });
  }

  return (
    <motion.div
      whileHover="hover"
      whileTap="tap"
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
      >
        <motion.span
          variants={{
            hover: {
              scale: 1.5,
              rotateZ: 5,
              transition: { type: "tween", duration: 0.2 },
            },
            tap: {
              scale: 2.5,
            },
          }}
        >
          <ReactionChildWrapper className="mr-2 text-sm" type={emotion} />
        </motion.span>
        {count}
      </Badge>
    </motion.div>
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
      emotion = "🤣";
      break;
    case "Marah":
      emotion = "🤬";
      break;
    case "Setuju":
      emotion = "💯";
      break;
    case "Hah":
      emotion = "🤯";
      break;
    default:
      break;
  }
  return (
    <span className={cn("flex items-center justify-center", className)}>
      {emotion}
    </span>
  );
}
