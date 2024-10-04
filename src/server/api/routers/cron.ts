import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { env } from "~/env";
import { getJakartaDate, getJakartaDateString } from "~/utils";
import { type CreateEmailOptions } from "resend";
import StreakPage from "~/app/_components/Email/Streak";
import { type User } from "@prisma/client";
import resend from "~/server/util/resend";

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

  sendDailyStreakReminder: publicProcedure
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

      const targetedUsers: User[] = await ctx.db.$queryRaw`
      SELECT *
      FROM "User"
      WHERE "lastPostedAt" < (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Jakarta' - INTERVAL '1 day')
        AND "currentStreak" > 0;
      `;

      if (targetedUsers.length === 0) return;

      const emails: CreateEmailOptions[] = targetedUsers
        .filter((user) => user.email)
        .map((user) => {
          return {
            from: "Arsip Template <noreply@arsiptemplate.app>",
            to: user.email,
            subject: "Jangan sampai streakmu hilang!",
            react: StreakPage({
              name: user.name ?? "",
              streakCount: user.currentStreak,
              previewText: "Jangan sampai streakmu hilang!",
            }),
          } as CreateEmailOptions;
        });

      try {
        const { data, error } = await resend.batch.send(emails);

        if (error) {
          console.error("Failed to send batch emails:", error);
          return { success: false, error };
        }

        const successCount = data?.data.filter((result) => result.id).length;
        const message = `Successfully sent ${successCount} (${emails.map((email) => email.to).join(", ")}) out of ${emails.length} emails`;
        console.log(message);

        return {
          success: true,
          message,
        };
      } catch (error) {
        console.error("Error sending batch emails:", error);
        return { success: false, error };
      }
    }),
});
