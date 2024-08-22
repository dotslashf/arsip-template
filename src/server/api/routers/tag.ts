import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

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

  getTopTagsByUserId: publicProcedure
    .input(
      z.object({
        userId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const topUserTags = await ctx.db.copyPasta.findMany({
        where: {
          createdById: input.userId,
          approvedAt: {
            not: null,
          },
        },
        select: {
          CopyPastasOnTags: {
            select: {
              tags: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      });

      const tagCounts = topUserTags
        .flatMap((cp) => cp.CopyPastasOnTags.map((cpt) => cpt.tags))
        .reduce(
          (acc, tag) => {
            acc[tag.name] = {
              count: (acc[tag.name]?.count || 0) + 1,
              id: tag.id,
            };
            return acc;
          },
          {} as Record<
            string,
            {
              count: number;
              id: string;
            }
          >,
        );

      const topTags = Object.entries(tagCounts)
        .sort(([, a], [, b]) => b.count - a.count)
        .slice(0, 4)
        .map(([tagId, count]) => ({
          id: tagId,
          name: topUserTags.find((cp) =>
            cp.CopyPastasOnTags.some((cpt) => cpt.tags.id === tagId),
          )?.CopyPastasOnTags[0]?.tags.name,
          count,
        }));

      return topTags;
    }),
});
