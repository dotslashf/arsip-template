import { EmotionType, type Prisma } from "@prisma/client";
import { Badge } from "./ui/badge";
import { motion } from "framer-motion";
import { ReactionChildWrapper } from "./ReactionSummaryChild";

interface ReactionSummaryProfileProps {
  reactions?: (Prisma.PickEnumerable<
    Prisma.ReactionGroupByOutputType,
    "emotion"[]
  > & {
    _count: {
      emotion: number;
    };
  })[];
}
export default function ReactionSummaryProfile({
  reactions,
}: ReactionSummaryProfileProps) {
  return (
    <div className="flex space-x-2">
      {Object.keys(EmotionType).map((reaction) => {
        return (
          <motion.div key={reaction} whileHover="hover" whileTap="tap">
            <Badge variant={"outline"}>
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
                <ReactionChildWrapper
                  className="mr-2 text-sm"
                  type={reaction}
                />
              </motion.span>
              {reactions?.find((react) => react.emotion === reaction)?._count
                .emotion ?? 0}
            </Badge>
          </motion.div>
        );
      })}
    </div>
  );
}
