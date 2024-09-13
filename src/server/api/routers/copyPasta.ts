import { OriginSource, Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createCopyPastaFormServer } from "~/server/form/copyPasta";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

import { getRandomElement } from "~/lib/utils";
import {
  type CopyPastaOnlyContent,
  type CopyPastaSearchResult,
} from "~/lib/interface";

function tokenize(content: string) {
  return content.toLowerCase().split(/\s+/);
}

function jaccardSimilarity(setA: Set<string>, setB: Set<string>) {
  const intersection = new Set([...setA].filter((x) => setB.has(x)));
  return intersection.size / (setA.size + setB.size - intersection.size);
}

export const copyPastaRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createCopyPastaFormServer)
    .mutation(async ({ ctx, input }) => {
      const newContentTokens = new Set(tokenize(input.content));

      const existingCopyPastas: CopyPastaOnlyContent[] = await ctx.db.$queryRaw`
        SELECT content
        FROM "CopyPasta"
        WHERE to_tsvector('indonesian', content) @@ plainto_tsquery('indonesian', ${input.content})
      `;

      for (const { content } of existingCopyPastas) {
        const existingContentTokens = new Set(tokenize(content));
        const similarity = jaccardSimilarity(
          newContentTokens,
          existingContentTokens,
        );

        if (similarity > 0.65) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Content is too similar to an existing entry.",
          });
        }
      }

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
        limit: z.number().min(1).max(15).nullish(),
        cursor: z.string().nullish(),
        search: z.string().nullish(),
        tag: z.string().uuid().nullish(),
        source: z.nativeEnum(OriginSource).nullish(),
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
      if (input.source) {
        condition.source = {
          equals: input.source,
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
          source: condition.source,
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
          createdBy: {
            select: {
              name: true,
              username: true,
              avatarSeed: true,
              id: true,
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
      const results: CopyPastaSearchResult[] = await ctx.db.$queryRaw`
        SELECT 
          cp.*, 
          u.id as "createdById", 
          u.name as "createdByName", 
          json_agg(json_build_object('id', t.id, 'name', t.name)) as tags
        FROM "CopyPasta" cp
        LEFT JOIN "CopyPastasOnTags" cpt ON cp.id = cpt."copyPastaId"
        LEFT JOIN "Tag" t ON cpt."tagId" = t.id
        LEFT JOIN "User" u ON cp."createdById" = u.id
        WHERE cp.content ILIKE '%' || ${input.query} || '%'
          AND cp."deletedAt" IS NULL
          AND cp."approvedAt" IS NOT NULL
        GROUP BY cp.id, u.id, u.name
        LIMIT 5
      `;

      console.log(
        "results",
        results.map((r) => r.tags),
      );

      return results.map((row) => ({
        ...row,
        createdBy: {
          id: row.createdById,
          name: row.createdByName,
        },
        tags: row.tags.filter((tag) => tag !== null), // Filter out null tags
      }));
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
          deletedAt: null,
        },
        include: {
          CopyPastasOnTags: {
            include: {
              tags: true,
            },
          },
          createdBy: {
            select: {
              name: true,
              username: true,
              avatarSeed: true,
              id: true,
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
        field: getRandomElement(fields)!,
        direction: getRandomElement(["asc", "desc"]),
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
          deletedAt: null,
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
        deletedAt: null,
      },
    });

    return {
      total,
    };
  }),

  statisticsBySource: publicProcedure
    .input(
      z.object({
        days: z
          .number()
          .nullish()
          .transform((val) => val ?? 7),
      }),
    )
    .query(async ({ ctx, input }) => {
      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - input.days);

      const copyPastas = await ctx.db.copyPasta.findMany({
        where: {
          createdAt: {
            gte: daysAgo,
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
