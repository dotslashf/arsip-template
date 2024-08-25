import { OriginSource, Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createCopyPastaFormServer } from "~/server/form/copyPasta";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

import { faker } from "@faker-js/faker";

export const copyPastaRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createCopyPastaFormServer)
    .mutation(async ({ ctx, input }) => {
      const copyPasta = await ctx.db.copyPasta.create({
        data: {
          content: input.content,
          source: input.source,
          sourceUrl: input.sourceUrl,
          postedAt: input.postedAt,
          createdById: ctx.session.user.id,
          imageUrl: input.imageUrl,
          CopyPastasOnTags: {
            createMany: {
              data: input.tags.map((tag) => {
                return {
                  tagId: tag.value,
                };
              }),
            },
          },
        },
      });

      return copyPasta.id;
    }),

  list: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(10).nullish(),
        cursor: z.string().nullish(),
        search: z.string().nullish(),
        tag: z.string().uuid().nullish(),
        byUserId: z.string().nullish(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const condition: Record<string, any> = {};
      if (input.search) {
        condition.content = {
          contains: input.search,
          mode: "insensitive",
        };
      }
      if (input.tag) {
        condition.tag = {
          some: {
            tagId: input.tag,
          },
        };
      }
      if (input.byUserId) {
        condition.createdById = {
          equals: input.byUserId,
        };
      }

      const copyPastas = await ctx.db.copyPasta.findMany({
        take: input.limit ?? 1,
        skip: input.cursor ? 1 : 0,
        cursor: input.cursor ? { id: input.cursor } : undefined,
        where: {
          content: condition.content,
          CopyPastasOnTags: condition.tag,
          createdById: condition.createdById,
          approvedAt: {
            not: null,
          },
          deletedAt: null,
        },
        orderBy: {
          approvedAt: "desc",
        },
        include: {
          CopyPastasOnTags: {
            include: {
              tags: true,
            },
          },
        },
      });

      const reactions = await ctx.db.reaction.groupBy({
        by: ["copyPastaId", "emotion", "userId"],
        where: {
          copyPastaId: {
            in: copyPastas.map((c) => c.id),
          },
        },
        _count: {
          emotion: true,
        },
      });

      const nextCursor =
        copyPastas.length > 0
          ? copyPastas[copyPastas.length - 1]?.id
          : undefined;
      return {
        copyPastas: copyPastas.map((cp) => ({
          ...cp,
          reactions: reactions.filter((r) => r.copyPastaId === cp.id),
        })),
        nextCursor,
      };
    }),

  search: publicProcedure
    .input(
      z.object({
        query: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const results = await ctx.db.copyPasta.findMany({
        where: {
          content: {
            contains: input.query,
            mode: "insensitive",
          },
          approvedAt: {
            not: null,
          },
        },
        take: 5,
      });

      return results;
    }),

  byId: publicProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        approvedAt: z.boolean().default(true),
      }),
    )
    .query(async ({ input, ctx }) => {
      const copyPasta = await ctx.db.copyPasta.findFirst({
        where: {
          id: input.id,
          approvedAt: input.approvedAt
            ? {
                not: null,
              }
            : {
                equals: null,
              },
        },
        include: {
          CopyPastasOnTags: {
            include: {
              tags: true,
            },
          },
          createdBy: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      if (!copyPasta) {
        throw new TRPCError({
          code: "NOT_FOUND",
        });
      }

      return copyPasta;
    }),

  byTag: publicProcedure
    .input(
      z.object({
        tagIds: z.string().uuid().array().nullish(),
        copyPastaId: z.string().uuid(),
      }),
    )
    .query(async ({ input, ctx }) => {
      if (!input.tagIds) return [];

      const fields = Object.keys(Prisma.CopyPastaScalarFieldEnum).filter(
        (field) => field !== "approvedById" && field !== "createdById",
      );
      const sorts = {
        field: faker.helpers.arrayElement(fields),
        direction: faker.helpers.arrayElement(["asc", "desc"]),
      };

      const random = await ctx.db.copyPastasOnTags.findMany({
        where: {
          tagId: {
            in: input.tagIds,
          },
          AND: {
            NOT: {
              copyPastaId: input.copyPastaId,
            },
          },
        },
      });

      const copyPastas = await ctx.db.copyPasta.findMany({
        take: 3,
        where: {
          id: {
            in: random.map((c) => c.copyPastaId),
          },
          approvedAt: {
            not: null,
          },
        },
        include: {
          CopyPastasOnTags: {
            include: {
              tags: true,
            },
          },
        },
        orderBy: {
          [sorts.field]: sorts.direction,
        },
      });

      return copyPastas;
    }),

  count: publicProcedure.query(async ({ ctx }) => {
    const total = await ctx.db.copyPasta.count({
      where: {
        approvedAt: {
          not: null,
        },
      },
    });
    const sources = await Promise.all(
      Object.keys(OriginSource).map(async (key) => {
        return {
          source: key,
          count: await ctx.db.copyPasta.count({
            where: {
              approvedAt: {
                not: null,
              },
              source: key as OriginSource,
            },
          }),
          fill: `var(--color-${key.toLowerCase()})`,
        };
      }),
    );

    return {
      total,
      sources,
    };
  }),

  statisticsBySource: publicProcedure.query(async ({ ctx }) => {
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

    const copyPastas = await ctx.db.copyPasta.findMany({
      where: {
        createdAt: {
          gte: twoWeeksAgo,
        },
      },
    });

    const groupedData: Record<
      string,
      { Twitter: number; Facebook: number; Other: number }
    > = {};
    copyPastas.forEach((cp) => {
      const date = cp.createdAt.toISOString().split("T")[0]!;
      const source = cp.source;

      if (!groupedData[date]) {
        groupedData[date] = { Twitter: 0, Facebook: 0, Other: 0 };
      }

      if (source in groupedData[date]) {
        groupedData[date][source]++;
      } else {
        groupedData[date].Other++;
      }
    });

    // Format data for chart
    const chartData = Object.keys(groupedData)
      .sort()
      .map((date) => ({
        date,
        twitter: groupedData[date]?.Twitter,
        facebook: groupedData[date]?.Facebook,
        other: groupedData[date]?.Other,
      }));

    return chartData;
  }),
});
