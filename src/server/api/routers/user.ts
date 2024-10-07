import { AchievementType, type PrismaClient, type User } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { getJakartaDate, getJakartaDateString } from "~/utils";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { getUserRank } from "~/server/util/db";

export async function updateUserStreak(userId: string, db: PrismaClient) {
  const user = await db.user.findUnique({
    where: {
      id: userId,
    },
  });
  if (!user) {
    throw new TRPCError({
      code: "NOT_FOUND",
    });
  }

  const now = getJakartaDate();
  const todayString = getJakartaDateString(now);

  let newStreak = user.currentStreak || 0;
  let isStreakUpdated = false;

  if (
    !user.lastPostedAt ||
    getJakartaDateString(user.lastPostedAt) < todayString
  ) {
    // If last post was before today, increment the streak
    newStreak += 1;
    isStreakUpdated = true;
  }

  const updatedUser = await db.user.update({
    where: { id: userId },
    data: {
      currentStreak: newStreak,
      longestStreak: Math.max(newStreak, user.longestStreak || 0),
    },
  });

  return {
    ...updatedUser,
    isStreakUpdated,
  };
}

export async function checkAndAwardAchievements(user: User, db: PrismaClient) {
  const achievements: [number, AchievementType][] = [
    [7, AchievementType.OneWeekStreak],
    [14, AchievementType.TwoWeekStreak],
    [30, AchievementType.OneMonthStreak],
    [90, AchievementType.ThreeMonthStreak],
    [180, AchievementType.SixMonthStreak],
  ];

  for (const [days, achievementType] of achievements) {
    if (user.currentStreak >= days) {
      await db.achievement.upsert({
        where: {
          userId_type: {
            userId: user.id,
            type: achievementType,
          },
        },
        create: {
          userId: user.id,
          type: achievementType,
        },
        update: {},
      });
    }
  }
}

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
        avatarSeed: true,
        username: true,
        engagementScore: true,
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

      const rank = await getUserRank(ctx.db.rank, user.engagementScore);

      return {
        ...user,
        rank,
      };
    }),

  updateUserStreak: protectedProcedure.mutation(async ({ ctx }) => {
    const updatedUser = await updateUserStreak(ctx.session.user.id, ctx.db);
    if (updatedUser.isStreakUpdated) {
      await checkAndAwardAchievements(updatedUser, ctx.db);
    }

    return updatedUser.id;
  }),

  getStreakInfo: publicProcedure
    .input(
      z.object({
        id: z.string().nullish(),
      }),
    )
    .query(async ({ ctx, input }) => {
      if (!input.id) {
        return null;
      }

      const user = await ctx.db.user.findUnique({
        where: {
          id: input.id,
        },
        select: {
          currentStreak: true,
          longestStreak: true,
          lastPostedAt: true,
          achievements: {
            select: {
              type: true,
              achievedAt: true,
            },
          },
        },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
        });
      }

      return user;
    }),

  getUserExclusiveBadge: publicProcedure
    .input(
      z.object({
        id: z.string().nullish(),
      }),
    )
    .query(async ({ ctx, input }) => {
      if (!input.id) {
        return null;
      }
      return await ctx.db.exclusiveBadge.findMany({
        where: {
          userId: input.id,
        },
      });
    }),
});
