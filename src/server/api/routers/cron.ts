import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { env } from "~/env";
import { getJakartaDate, getJakartaDateString } from "~/lib/utils";
import { Resend } from "resend";
import StreakPage from "~/app/_components/Email/Streak";
import { setTimeout } from "timers/promises";
import { type User } from "@prisma/client";

const resend = new Resend(env.RESEND_API_KEY);

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

      const emailPromises = targetedUsers.map(async (user) => {
        try {
          if (!user.email) {
            return {
              user: null,
              success: false,
              error: Error("User don't have email"),
            };
          }
          const { data, error } = await resend.emails.send({
            from: "Arsip Template <noreply@arsiptemplate.app>",
            to: [user.email],
            subject: "Jangan sampai streakmu hilang!",
            react: StreakPage({
              name: user.name ?? "",
              streakCount: user.currentStreak,
              previewText: "Jangan sampai streakmu hilang!",
            }),
          });

          if (error) {
            console.error(`Failed to send email to ${user.email}:`, error);
            return { user: user.email, success: false, error };
          }

          await setTimeout(1000);
          console.log(`Email sent successfully to ${user.email}`, data);
          return { user: user.email, success: true, data };
        } catch (error) {
          console.error(`Error sending email to ${user.email}:`, error);
          return { user: user.email, success: false, error };
        }
      });

      const results = await Promise.all(emailPromises);

      const successCount = results.filter((r) => r.success).length;
      console.log(
        `Successfully sent ${successCount} out of ${targetedUsers.length} emails`,
      );

      return results;
    }),
});
