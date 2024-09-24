import { AchievementType, PrismaClient, User } from '@prisma/client';
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";

export async function updateUserStreak(userId: string, db: PrismaClient) {
  const user = await db.user.findUnique({
    where: {
      id: userId
    }
  });
  if (!user) {
    throw new TRPCError({
      code: 'NOT_FOUND',
    });
  }

  const lastPost = await db.copyPasta.findFirst({
    where: { createdById: userId },
    orderBy: { createdAt: 'desc' },
  });

  const now = new Date();
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  let newStreak = 1;
  if (lastPost && lastPost.createdAt > oneDayAgo) {
    newStreak = (user.currentStreak || 0) + 1;
  }

  const updatedUser = await db.user.update({
    where: { id: userId },
    data: {
      currentStreak: newStreak,
      longestStreak: Math.max(newStreak, user.longestStreak || 0),
      lastPostedAt: now,
    },
  });

  return updatedUser;
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

  updateUserStreak: protectedProcedure
    .mutation(async ({ ctx, input }) => {
      const updatedUser = await updateUserStreak(ctx.session.user.id, ctx.db);
      await checkAndAwardAchievements(updatedUser, ctx.db);

      return updatedUser.id;
    }),

  getStreakInfo: protectedProcedure
    .input(
      z.object({
        id: z.string().nullish()
      })
    ).query(async ({ ctx, input }) => {
      if (!input.id) {
        return null
      }

      const user = await ctx.db.user.findUnique({
        where: {
          id: input.id
        },
        select: {
          currentStreak: true,
          longestStreak: true,
          lastPostedAt: true,
          streakAchievements: {
            select: {
              type: true,
              achievedAt: true
            }
          }
        }
      });

      if (!user) {
        throw new TRPCError({
          code: 'NOT_FOUND',
        });
      }

      return user;
    })
});
