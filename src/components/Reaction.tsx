import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "./ui/button";
import { api } from "~/trpc/react";
import { EmotionType } from "@prisma/client";
import useToast from "./ui/use-react-hot-toast";
import { Skeleton } from "./ui/skeleton";
import { reactionsMap } from "~/lib/constant";
import { getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
interface ReactionProps {
  copyPastaId: string;
}
export default function Reaction({ copyPastaId }: ReactionProps) {
  const toast = useToast();
  const session = getSession();
  const [isHovered, setIsHovered] = useState(false);
  const utils = api.useUtils();
  const mutationReaction = api.reaction.reactionByCopyPastaId.useMutation({
    async onSuccess() {
      void utils.reaction.getReactionByCopyPastaId.invalidate();
    },
  });
  const { data: reactionsByCopyPastaId } =
    api.reaction.getReactionByCopyPastaId.useQuery({
      copyPastaId,
    });
  const isUserReacted = reactionsByCopyPastaId?.userId;
  const currentUserReaction =
    reactionsByCopyPastaId?.currentUserReaction?.emotion;

  const router = useRouter();

  async function handleReaction(reaction: EmotionType) {
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
        reactionType: reaction,
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
    <div className="flex flex-col space-y-3">
      <motion.div
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onClick={() => setIsHovered(!isHovered)}
        className="flex w-fit space-x-2 rounded-full"
      >
        {isHovered ? (
          Object.keys(EmotionType).map((key, i) => {
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20, rotateZ: -180 }}
                animate={{ opacity: 1, x: 0, rotateZ: 0 }}
                transition={{ delay: i * 0.1 }}
                className="hover:cursor-pointer"
              >
                <motion.div whileHover="hover">
                  <Button
                    variant={
                      isUserReacted &&
                      currentUserReaction === reactionsMap(key, "w-5")!.name
                        ? "white"
                        : "ghost"
                    }
                    size={"icon"}
                    className="rounded-full hover:bg-secondary"
                    onClick={() =>
                      isUserReacted &&
                      currentUserReaction === reactionsMap(key, "w-5")!.name
                        ? null
                        : handleReaction(reactionsMap(key, "w-5")!.name)
                    }
                  >
                    <motion.span
                      variants={{
                        hover: {
                          scale: 1.8,
                          rotateZ: 5,
                          transition: { type: "tween", duration: 0.2 },
                        },
                      }}
                    >
                      {reactionsMap(key, "w-5")!.child}
                    </motion.span>
                  </Button>
                </motion.div>
              </motion.div>
            );
          })
        ) : (
          <Button variant={"outline"} size={"icon"} className="rounded-full">
            {reactionsByCopyPastaId ? (
              isUserReacted ? (
                reactionsMap(
                  reactionsByCopyPastaId.currentUserReaction!.emotion,
                  "w-5",
                )?.child
              ) : (
                reactionsMap("Kocak", "w-5")?.child
              )
            ) : (
              <Skeleton className="h-5 w-5 rounded-full" />
            )}
          </Button>
        )}
      </motion.div>
      <span className="text-sm text-primary underline">
        {reactionsByCopyPastaId?.reactionsCount ?? 0} jumlah reaksi
      </span>
    </div>
  );
}
