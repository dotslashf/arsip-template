import { Prisma } from "@prisma/client";
import { initTRPC, TRPCError } from "@trpc/server";
import { z } from "zod";
import { createCopyPastaForm } from "~/server/form/copyPasta";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

import { faker } from "@faker-js/faker";

export const t = initTRPC.create();

export const copyPastaRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createCopyPastaForm)
    .mutation(async ({ ctx, input }) => {
      const copyPasta = await ctx.db.copyPasta.create({
        data: {
          content: input.content,
          source: input.source,
          sourceUrl: input.sourceUrl,
          postedAt: input.postedAt,
          createdById: ctx.session.user.id,
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

      const copyPastas = await ctx.db.copyPasta.findMany({
        take: input.limit ?? 1,
        skip: input.cursor ? 1 : 0,
        cursor: input.cursor ? { id: input.cursor } : undefined,
        where: {
          content: condition.content,
          CopyPastasOnTags: condition.tag,
          approvedAt: {
            not: null,
          },
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
      const nextCursor =
        copyPastas.length > 0
          ? copyPastas[copyPastas.length - 1]?.id
          : undefined;
      return {
        copyPastas,
        nextCursor,
      };
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
});
