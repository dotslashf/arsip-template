import { createTRPCRouter, publicProcedure } from "../trpc";

export const rankingRouter = createTRPCRouter({
  topUsers: publicProcedure.query(async ({ ctx }) => {
    const topUsers = await ctx.db.user.findMany({
      select: {
        id: true,
        name: true,
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
