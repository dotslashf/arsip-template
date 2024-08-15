import { EmotionType, Prisma } from "@prisma/client";
import { motion } from "framer-motion";
import { Badge } from "./ui/badge";
import { reactionsMap } from "~/lib/constant";

interface ReactionSummaryProps {
  reactions?: (Prisma.PickEnumerable<
    Prisma.ReactionGroupByOutputType,
    ("copyPastaId" | "emotion")[]
  > & {
    _count: {
      emotion: number;
    };
  })[];
}
export default function ReactionSummary({ reactions }: ReactionSummaryProps) {
  return (
    <div className="flex space-x-2">
      {Object.keys(EmotionType).map((reaction, i) => (
        <motion.div whileHover="hover" key={reaction}>
          <Badge key={i} variant={"secondary"}>
            <motion.span
              variants={{
                hover: {
                  scale: 1.5,
                  rotateZ: 5,
                  transition: { type: "tween", duration: 0.2 },
                },
              }}
            >
              {reactionsMap(reaction, "w-4 mr-2")?.child}
            </motion.span>
            {reactions?.find((r) => r.emotion === reaction)?._count.emotion ??
              0}
          </Badge>
        </motion.div>
      ))}
    </div>
  );
}
