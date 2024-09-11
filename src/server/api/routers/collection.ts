import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { createCollectionForm } from "~/server/form/collection";

export const collectionRouter = createTRPCRouter({
  list: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(15).nullish(),
        cursor: z.string().nullish(),
        search: z.string().nullish(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const condition: Record<string, any> = {};
      if (input.search) {
        condition.OR = [
          {
            name: {
              contains: input.search,
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: input.search,
              mode: "insensitive",
            },
          },
        ];
      }

      const collections = await ctx.db.collection.findMany({
        take: input.limit ?? 1,
        skip: input.cursor ? 1 : 0,
        cursor: input.cursor ? { id: input.cursor } : undefined,
        where: condition,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          createdBy: true,
          _count: {
            select: {
              copyPastas: true,
            },
          },
        },
      });

      const nextCursor =
        collections.length > 0
          ? collections[collections.length - 1]?.id
          : undefined;

      return {
        collections,
        nextCursor,
      };
    }),

  create: protectedProcedure
    .input(createCollectionForm)
    .mutation(async ({ ctx, input }) => {
      const collection = await ctx.db.collection.create({
        data: {
          name: input.name,
          description: input.description,
          copyPastas: {
            createMany: {
              data: input.copyPastaIds.map((id) => {
                return {
                  copyPastaId: id,
                };
              }),
            },
          },
          createdById: ctx.session.user.id,
        },
      });

      return collection.id;
    }),

  byId: publicProcedure
    .input(
      z.object({
        id: z.string().uuid(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const collection = await ctx.db.collection.findFirst({
        where: {
          id: input.id,
        },
        include: {
          copyPastas: {
            include: {
              copyPasta: {
                include: {
                  CopyPastasOnTags: {
                    include: {
                      tags: true,
                    },
                  },
                },
              },
            },
          },
          createdBy: {
            select: {
              id: true,
              username: true,
              name: true,
              avatarSeed: true,
            },
          },
        },
      });

      if (!collection)
        throw new TRPCError({
          code: "NOT_FOUND",
        });

      return collection;
    }),
});
