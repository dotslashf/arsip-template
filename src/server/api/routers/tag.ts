import { initTRPC } from "@trpc/server";
import { z } from "zod";
import {
  createTRPCRouter,
  // protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const t = initTRPC.create();

export const tagRouter = createTRPCRouter({
  list: publicProcedure.query(async ({ ctx }) => {
    const tags = await ctx.db.tag.findMany({
      take: 100,
      orderBy: {
        name: "asc",
      },
    });

    return tags;
  }),

  byId: publicProcedure
    .input(
      z.object({
        id: z.string().uuid(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db.tag.findUnique({
        where: {
          id: input.id,
        },
      });
    }),
});
