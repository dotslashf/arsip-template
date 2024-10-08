/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { getUserRank } from "~/server/util/db";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const rankingRouter = createTRPCRouter({
  list: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.rank.findMany({
      orderBy: {
        minimumScore: "desc",
      },
    });
  }),

  topUsers: publicProcedure.query(async ({ ctx }) => {
    const topUsers = await ctx.db.user.findMany({
      select: {
        id: true,
        name: true,
        avatarSeed: true,
        engagementScore: true,
        username: true,
        currentStreak: true,
        _count: {
          select: {
            Reactions: true,
            collections: true,
          },
        },
        CopyPastaCreatedBy: true,
      },
      orderBy: {
        engagementScore: "desc",
      },
      take: 5,
    });

    const topUsersWithRank = await Promise.all(
      topUsers.map(async (user) => {
        return {
          ...user,
          currentStreak: `${user.currentStreak}`,
          rank: await getUserRank(ctx.db.rank, user.engagementScore),
          count: {
            copyPastas: {
              approved: user.CopyPastaCreatedBy.filter(
                (c) => c.approvedAt !== null,
              ).length,
              total: user.CopyPastaCreatedBy.length,
            },
            collections: user._count.collections,
            reactions: user._count.Reactions,
          },
        };
      }),
    );

    return topUsersWithRank;
  }),
});
