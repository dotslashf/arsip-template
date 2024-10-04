import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedureLimited,
  publicProcedure,
} from "../trpc";
import { EmotionType } from "@prisma/client";
import { redirect } from "next/navigation";
import { updateUserEngagementScore } from "~/server/util/db";
import { handleEngagementAction } from "~/utils";

export const reactionRouter = createTRPCRouter({
  reactionByCopyPastaId: protectedProcedureLimited
    .input(
      z.object({
        copyPastaId: z.string().uuid(),
        reactionType: z.nativeEnum(EmotionType),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session.user) {
        return redirect("/");
      }

      const reaction = await ctx.db.reaction.findFirst({
        where: {
          userId: ctx.session.user.id,
          copyPastaId: input.copyPastaId,
        },
      });
      if (!reaction) {
        const newReaction = await ctx.db.reaction.create({
          data: {
            emotion: input.reactionType,
            copyPastaId: input.copyPastaId,
            userId: ctx.session.user.id,
          },
        });
        const payload = handleEngagementAction(
          "GiveReaction",
          input.copyPastaId,
        );
        await updateUserEngagementScore(ctx.db, ctx.session.user.id, payload);
        return newReaction;
      }
      return await ctx.db.reaction.update({
        where: {
          id: reaction.id,
        },
        data: {
          emotion: input.reactionType,
        },
      });
    }),

  unReactionById: protectedProcedureLimited
    .input(
      z.object({
        id: z.string().uuid(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session.user) {
        return redirect("/");
      }

      await ctx.db.reaction.delete({
        where: {
          id: input.id,
        },
      });
      const payload = handleEngagementAction("RemoveReaction", null);
      await updateUserEngagementScore(ctx.db, ctx.session.user.id, payload);

      return ctx.session.user.id;
    }),

  unReactionByUserId: protectedProcedureLimited
    .input(
      z.object({
        userId: z.string(),
        copyPastaId: z.string().uuid(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const reaction = ctx.db.reaction.deleteMany({
        where: {
          copyPastaId: input.copyPastaId,
          userId: input.userId,
        },
      });
      const payload = handleEngagementAction(
        "RemoveReaction",
        input.copyPastaId,
      );
      await updateUserEngagementScore(ctx.db, ctx.session.user.id, payload);
      return reaction;
    }),

  getReactionByCopyPastaId: publicProcedure
    .input(
      z.object({
        copyPastaId: z.string().uuid(),
        userId: z.string().nullish(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const counts = await ctx.db.reaction.findMany({
        where: { copyPastaId: input.copyPastaId },
      });
      const reactions = await ctx.db.reaction.findMany({
        where: {
          copyPastaId: input.copyPastaId,
        },
        include: {
          user: {
            select: {
              name: true,
              id: true,
            },
          },
        },
        take: 5,
      });
      const currentUserReaction = await ctx.db.reaction.findFirst({
        where: {
          copyPastaId: input.copyPastaId,
          userId: input.userId ?? ctx.session?.user.id,
        },
      });

      return {
        reactions,
        counts: counts.length,
        currentUserReaction,
        userId: input.userId ? input.userId : ctx.session?.user.id,
      };
    }),

  getReactionsByUserId: publicProcedure
    .input(
      z.object({
        userId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const reactions = await ctx.db.reaction.groupBy({
        by: ["emotion"],
        where: {
          userId: input.userId,
        },
        _count: {
          emotion: true,
        },
      });

      return reactions;
    }),
});
