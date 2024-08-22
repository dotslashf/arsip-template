import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  byId: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: {
          id: input.id,
        },
        select: {
          id: true,
          name: true,
          role: true,
          Reactions: true,
          rank: true,
          accounts: {
            select: {
              provider: true,
            },
          },
        },
      });

      if (!user)
        throw new TRPCError({
          code: "NOT_FOUND",
        });

      return user;
    }),
});
