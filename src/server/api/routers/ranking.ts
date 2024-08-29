import { createTRPCRouter, publicProcedure } from "../trpc";

export const rankingRouter = createTRPCRouter({
  list: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.rank.findMany({
      orderBy: {
        minCount: "desc",
      },
    });
  }),

  topUsers: publicProcedure.query(async ({ ctx }) => {
    const topUsers = await ctx.db.user.findMany({
      select: {
        id: true,
        name: true,
        avatarSeed: true,
        username: true,
        rank: {
          select: {
            title: true,
          },
        },
        _count: {
          select: {
            CopyPastaCreatedBy: {
              where: {
                approvedAt: {
                  not: null,
                },
              },
            },
          },
        },
      },
      orderBy: {
        CopyPastaCreatedBy: {
          _count: "desc",
        },
      },
      take: 5,
    });

    return topUsers;
  }),
});
