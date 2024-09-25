import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { env } from "~/env";
import { getJakartaDate, getJakartaDateString } from "~/lib/utils";

export const cronRouter = createTRPCRouter({
  healthCheck: publicProcedure
    .input(
      z.object({
        secret: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      if (input.secret !== env.CRON_SECRET) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid secret for cron job",
        });
      }

      return `I am healthy`;
    }),

  dailyStreakReset: publicProcedure
    .input(
      z.object({
        secret: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (input.secret !== env.CRON_SECRET) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid secret for cron job",
        });
      }

      const jakartaYesterday = getJakartaDate(
        new Date(Date.now() - 24 * 60 * 60 * 1000),
      );

      const resetResult = await ctx.db.user.updateMany({
        where: {
          lastPostedAt: {
            lt: jakartaYesterday,
          },
          currentStreak: {
            gt: 0,
          },
        },
        data: {
          currentStreak: 0,
        },
      });

      return {
        message: "Daily streak reset",
        resetCount: resetResult.count,
        jakartaDate: getJakartaDateString(),
      };
    }),
});
