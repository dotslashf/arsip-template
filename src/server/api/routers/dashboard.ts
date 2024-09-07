import { TRPCError } from "@trpc/server";

import {
  createTRPCRouter,
  protectedProcedure,
  protectedProcedureLimited,
  protectedProcedureRoleAdmin,
} from "~/server/api/trpc";

import { z } from "zod";
import { editCopyPastaForm } from "~/server/form/copyPasta";
import { deleteBucketFile } from "~/server/util/storage";
import { editProfile } from "~/server/form/user";

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
          // deletedAt: null,
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
          createdBy: {
            select: {
              id: true,
              name: true,
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

  editProfile: protectedProcedureLimited
    .input(editProfile)
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          name: input.name,
          avatarSeed: input.avatarSeed,
          username: input.username,
        },
      });
      return user;
    }),

  approveById: protectedProcedureRoleAdmin
    .input(
      z.object({
        id: z.string().uuid(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
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

      const userContributionCount = await ctx.db.copyPasta.count({
        where: { createdById: copyPasta.createdById },
      });

      const rank = await ctx.db.rank.findFirst({
        where: {
          minCount: {
            lte: userContributionCount,
          },
        },
        orderBy: {
          minCount: "desc",
        },
      });
      if (rank) {
        await ctx.db.user.update({
          where: { id: copyPasta.createdById },
          data: { rankId: rank.id },
        });
      }

      return copyPasta.id;
    }),

  listWaitingApprovedCopyPasta: protectedProcedureRoleAdmin
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
          deletedAt: null,
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
          createdBy: {
            select: {
              id: true,
              name: true,
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

  byId: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const copyPasta = await ctx.db.copyPasta.findFirst({
        where: {
          id: input.id,
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

  editCopyPasta: protectedProcedureRoleAdmin
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
              id: true,
              name: true,
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

  listDeleted: protectedProcedureRoleAdmin
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
          deletedAt: {
            not: null,
          },
        },
        orderBy: {
          deletedAt: "desc",
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

      const nextCursor =
        copyPastas.length > 0
          ? copyPastas[copyPastas.length - 1]?.id
          : undefined;
      return {
        copyPastas,
        nextCursor,
      };
    }),

  countCopyPastaAdmin: protectedProcedureRoleAdmin.query(async ({ ctx }) => {
    const [isNotApproved, isApproved, isDeleted] = await Promise.all([
      await ctx.db.copyPasta.count({
        where: {
          approvedAt: {
            equals: null,
          },
          deletedAt: null,
        },
      }),
      await ctx.db.copyPasta.count({
        where: {
          approvedById: ctx.session.user.id,
        },
      }),
      await ctx.db.copyPasta.count({
        where: {
          deletedAt: {
            not: null,
          },
        },
      }),
    ]);

    return {
      isNotApproved,
      isApproved,
      isDeleted,
    };
  }),

  deleteById: protectedProcedureRoleAdmin
    .input(
      z.object({
        id: z.string().uuid(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.user.role !== "Admin") {
        return;
      }

      const copy = await ctx.db.copyPasta.findFirst({
        where: {
          id: input.id,
        },
      });

      if (copy?.imageUrl) {
        await deleteBucketFile(copy.imageUrl);
      }

      await ctx.db.copyPasta.update({
        where: {
          id: input.id,
        },
        data: {
          deletedAt: new Date(),
          imageUrl: null,
        },
      });
    }),
});
