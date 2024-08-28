import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  byIdentifier: publicProcedure
    .input(
      z.object({
        identifier: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const columns = {
        id: true,
        name: true,
        role: true,
        Reactions: true,
        rank: true,
        avatarSeed: true,
        username: true,
        accounts: {
          select: {
            provider: true,
          },
        },
      };

      let user = await ctx.db.user.findFirst({
        where: {
          username: input.identifier,
        },
        select: columns,
      });

      if (!user) {
        user = await ctx.db.user.findUnique({
          where: {
            id: input.identifier,
          },
          select: columns,
        });
      }

      if (!user)
        throw new TRPCError({
          code: "NOT_FOUND",
        });

      return user;
    }),
});
