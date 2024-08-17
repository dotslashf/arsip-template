import { motion } from "framer-motion";
import { Badge } from "./ui/badge";
import { reactionsMap } from "~/lib/constant";
import useToast from "./ui/use-react-hot-toast";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import { type EmotionType } from "@prisma/client";
import { session } from "./HOCSession";
import { useEffect, useState } from "react";

interface ReactionSummaryChildProps {
  copyPastaId: string;
  emotion: string;
  count: number;
  userId?: string;
}
export default function ReactionSummaryChild({
  copyPastaId,
  count,
  emotion,
  userId,
}: ReactionSummaryChildProps) {
  const toast = useToast();
  const utils = api.useUtils();
  const router = useRouter();

  const mutationReaction = api.reaction.reactionByCopyPastaId.useMutation({
    async onSuccess() {
      void utils.copyPasta.list.invalidate();
    },
  });
  const mutationUnReaction = api.reaction.unReactionByUserId.useMutation({
    async onSuccess() {
      void utils.copyPasta.list.invalidate();
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

    console.log(copyPastaId, currentUser);

    toast({
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
      return router.push("/auth/sign-in");
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
    toast({
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
        userId === currentUser ? handleUnReact() : handleReaction(emotion)
      }
    >
      <Badge variant={userId === currentUser ? "default" : "secondary"}>
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
          {reactionsMap(emotion, "w-4 mr-2")?.child}
        </motion.span>
        {count}
      </Badge>
    </motion.div>
  );
}