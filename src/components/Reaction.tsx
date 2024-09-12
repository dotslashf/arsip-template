import { motion } from "framer-motion";
import { useState } from "react";
import { Button, buttonVariants } from "./ui/button";
import { api } from "~/trpc/react";
import { EmotionType } from "@prisma/client";
import useToast from "./ui/use-react-hot-toast";
import { Skeleton } from "./ui/skeleton";
import { ANALYTICS_EVENT, reactionsMap } from "~/lib/constant";
import { useRouter } from "next/navigation";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import Link from "next/link";
import { session } from "./HOCSession";
import { ReactionChildWrapper } from "./ReactionSummaryChild";
import { trackEvent } from "~/lib/track";

interface ReactionProps {
  copyPastaId: string;
}
export default function Reaction({ copyPastaId }: ReactionProps) {
  const toast = useToast();
  const [isHovered, setIsHovered] = useState(false);
  const utils = api.useUtils();
  const mutationReaction = api.reaction.reactionByCopyPastaId.useMutation({
    async onSuccess(data) {
      void utils.reaction.getReactionByCopyPastaId.invalidate();
      void trackEvent(ANALYTICS_EVENT.REACTION, {
        path: `/copy-pasta/${copyPastaId}`,
        value: `${data.emotion}`,
        button: "reaction",
        userId: data.userId,
      });
    },
  });
  const mutationUnReaction = api.reaction.unReactionById.useMutation({
    async onSuccess(data) {
      void utils.reaction.getReactionByCopyPastaId.invalidate();
      void trackEvent(ANALYTICS_EVENT.REACTION, {
        path: `/copy-pasta/${copyPastaId}`,
        value: `none`,
        button: "reaction",
        userId: data,
      });
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

  async function handleUnReact(id?: string) {
    if (!id) return;

    void toast({
      message: "",
      promiseFn: mutationUnReaction.mutateAsync({
        id,
      }),
      type: "promise",
      promiseMsg: {
        success: `Kok gak jadi dilike? 🥹`,
        loading: "🔥 Sedang memasak",
        error: `Pelan pelan pak sopir 🏎️💨 `,
      },
    });
  }

  async function handleReaction(reaction: EmotionType) {
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
        reactionType: reaction,
      }),
      type: "promise",
      promiseMsg: {
        success: `${reactionName} disimpan ✍️`,
        loading: "🔥 Sedang memasak",
        error: `Pelan pelan pak sopir 🏎️💨 `,
      },
    });
  }

  function getReactionChild() {
    if (reactionsByCopyPastaId) {
      if (isUserReacted && reactionsByCopyPastaId.currentUserReaction) {
        return (
          <ReactionChildWrapper
            className="text-lg"
            type={reactionsByCopyPastaId.currentUserReaction.emotion}
          />
        );
      }
      return <ReactionChildWrapper className="text-lg" type={"Kocak"} />;
    }
    return <Skeleton className="h-5 w-5 rounded-full" />;
  }

  return (
    <div className="flex space-x-2">
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
                key={key}
                initial={{ opacity: 0, x: -20, rotateZ: -180 }}
                animate={{ opacity: 1, x: 0, rotateZ: 0 }}
                transition={{ delay: i * 0.1 }}
                className="hover:cursor-pointer"
              >
                <motion.div whileHover="hover">
                  <Button
                    variant={
                      isUserReacted &&
                      currentUserReaction === reactionsMap(key)!.name
                        ? "white"
                        : "ghost"
                    }
                    size={"icon"}
                    className="rounded-full hover:bg-secondary"
                    onClick={() =>
                      isUserReacted &&
                      currentUserReaction === reactionsMap(key)!.name
                        ? handleUnReact(
                            reactionsByCopyPastaId.currentUserReaction?.id,
                          )
                        : handleReaction(reactionsMap(key)!.name)
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
                      <ReactionChildWrapper className="text-lg" type={key} />
                    </motion.span>
                  </Button>
                </motion.div>
              </motion.div>
            );
          })
        ) : (
          <Button variant={"outline"} size={"icon"} className="rounded-full">
            {getReactionChild()}
          </Button>
        )}
      </motion.div>
      <Popover>
        <PopoverTrigger>
          <span className={buttonVariants({ variant: "outline" })}>
            {reactionsByCopyPastaId?.counts ?? 0} like
          </span>
        </PopoverTrigger>
        <PopoverContent className="lg:text-md w-fit px-3 py-2 text-sm">
          <div className="flex flex-col">
            {reactionsByCopyPastaId?.reactions.map((react) => (
              <Link
                key={react.id}
                className="flex text-primary hover:cursor-pointer"
                href={`/user/${react.user.id}?utm_source=reaction_summary`}
                prefetch={false}
              >
                <ReactionChildWrapper
                  className="mr-2 text-sm"
                  type={react.emotion}
                />
                {react.user.name}{" "}
              </Link>
            ))}
            {reactionsByCopyPastaId &&
              reactionsByCopyPastaId.counts > 5 &&
              "dan yang lainnya..."}
            {reactionsByCopyPastaId &&
              reactionsByCopyPastaId.counts === 0 &&
              "belum ada nih 🦗"}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
