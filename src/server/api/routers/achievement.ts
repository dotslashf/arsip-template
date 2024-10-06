import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const achievementRouter = createTRPCRouter({
  list: publicProcedure
    .input(
      z.object({
        userId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const achievements = ctx.db.achievement.findMany({
        where: {
          userId: input.userId,
        },
      });

      return achievements;
    }),
});
