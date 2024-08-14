import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const reactionRouter = createTRPCRouter({
  getByCopyPastaId: publicProcedure
    .input(
      z.object({
        id: z.string().uuid(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const reactions = await ctx.db.reaction.findMany({
        where: {
          copyPastaId: input.id,
        },
      });
      return reactions;
    }),
});
