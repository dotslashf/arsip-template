import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { handleEngagementAction } from "~/utils";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import {
  createCollectionForm,
  editCollectionForm,
} from "~/server/form/collection";
import { updateUserEngagementScore } from "~/server/util/db";
import { checkAndGrantCollectionCuratorAchievement } from "~/server/util/achievement";

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
              copyPastas: {
                where: {
                  copyPasta: {
                    deletedAt: null,
                  },
                },
              },
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
      const payload = handleEngagementAction("CreateCollection", collection.id);
      await updateUserEngagementScore(ctx.db, ctx.session.user.id, payload);
      await checkAndGrantCollectionCuratorAchievement(
        ctx.db,
        ctx.session.user.id,
      );

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
            where: {
              copyPasta: {
                deletedAt: null,
              },
            },
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

  byUserId: publicProcedure
    .input(
      z.object({
        id: z.string(),
        limit: z.number().min(1).max(15).nullish(),
        cursor: z.string().nullish(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const collections = await ctx.db.collection.findMany({
        take: input.limit ?? 1,
        skip: input.cursor ? 1 : 0,
        cursor: input.cursor ? { id: input.cursor } : undefined,
        where: {
          createdById: input.id ?? ctx.session?.user.id,
        },
        orderBy: {
          createdAt: "desc",
        },
        include: {
          createdBy: true,
          _count: {
            select: {
              copyPastas: {
                where: {
                  copyPasta: {
                    deletedAt: null,
                  },
                },
              },
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

  edit: protectedProcedure
    .input(editCollectionForm)
    .mutation(async ({ ctx, input }) => {
      const collection = await ctx.db.collection.findFirst({
        where: {
          id: input.id,
          createdById: ctx.session.user.id,
        },
      });

      if (!collection)
        throw new TRPCError({
          code: "UNAUTHORIZED",
        });

      await ctx.db.collectionsOnCopyPastas.deleteMany({
        where: {
          collectionId: collection.id,
        },
      });

      await ctx.db.collection.update({
        where: {
          id: collection.id,
        },
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
        },
      });

      await checkAndGrantCollectionCuratorAchievement(
        ctx.db,
        ctx.session.user.id,
      );
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const collection = await ctx.db.collection.findFirst({
        where: {
          id: input.id,
          createdById: ctx.session.user.id,
        },
      });

      if (!collection) throw new TRPCError({ code: "UNAUTHORIZED" });

      await ctx.db.collection.delete({
        where: {
          id: collection.id,
        },
      });

      const payload = handleEngagementAction("DeleteCollection", collection.id);
      await updateUserEngagementScore(ctx.db, ctx.session.user.id, payload);

      return true;
    }),
});
