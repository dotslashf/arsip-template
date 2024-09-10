import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { createCollectionForm } from "~/server/form/collection";

export const collectionRouter = createTRPCRouter({
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
