import { initTRPC } from "@trpc/server";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

import { z } from "zod";
import { editCopyPastaForm } from "~/server/form/copyPasta";

export const t = initTRPC.create();

export const dashboardRouter = createTRPCRouter({
  list: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(10).nullish(),
        type: z.enum(["approved", "disapproved"]),
        cursor: z.string().nullish(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const copyPastas = await ctx.db.copyPasta.findMany({
        take: input.limit ?? 1,
        skip: input.cursor ? 1 : 0,
        cursor: input.cursor ? { id: input.cursor } : undefined,
        where: {
          createdById: ctx.session.user.id,
          approvedAt:
            input.type === "approved"
              ? {
                  not: null,
                }
              : {
                  equals: null,
                },
        },
        orderBy: {
          createdAt: "desc",
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

  approveById: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.user.role !== "Admin") {
        return false;
      }
      const copyPasta = await ctx.db.copyPasta.update({
        where: {
          id: input.id,
          approvedAt: {
            equals: null,
          },
        },
        data: {
          approvedAt: new Date(),
          approvedById: ctx.session.user.id,
        },
      });
      return copyPasta.id;
    }),

  listDisapprovedCopyPasta: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(10).nullish(),
        cursor: z.string().nullish(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const copyPastas = await ctx.db.copyPasta.findMany({
        take: input.limit ?? 1,
        skip: input.cursor ? 1 : 0,
        cursor: input.cursor ? { id: input.cursor } : undefined,
        where: {
          approvedAt: {
            equals: null,
          },
        },
        orderBy: {
          createdAt: "desc",
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

  editCopyPasta: protectedProcedure
    .input(editCopyPastaForm)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.copyPastasOnTags.deleteMany({
        where: {
          copyPastaId: input.id,
        },
      });

      await ctx.db.copyPasta.update({
        where: {
          id: input.id,
        },
        data: {
          postedAt: input.postedAt,
          source: input.source,
          sourceUrl: input.sourceUrl,
          approvedById: ctx.session.user.id,
          approvedAt: new Date(),
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

      return true;
    }),

  listApprovedByUserId: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(10).nullish(),
        cursor: z.string().nullish(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const copyPastas = await ctx.db.copyPasta.findMany({
        take: input.limit ?? 1,
        skip: input.cursor ? 1 : 0,
        cursor: input.cursor ? { id: input.cursor } : undefined,
        where: {
          approvedById: ctx.session.user.id,
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
});