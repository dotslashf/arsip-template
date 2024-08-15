import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedureLimited,
  publicProcedure,
} from "../trpc";
import { EmotionType } from "@prisma/client";
import { redirect } from "next/navigation";

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
        return await ctx.db.reaction.create({
          data: {
            emotion: input.reactionType,
            copyPastaId: input.copyPastaId,
            userId: ctx.session.user.id,
          },
        });
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

  getReactionByCopyPastaId: publicProcedure
    .input(
      z.object({
        copyPastaId: z.string().uuid(),
        userId: z.string().nullish(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const reactions = await ctx.db.reaction.findMany({
        where: {
          copyPastaId: input.copyPastaId,
        },
      });
      const currentUserReaction = await ctx.db.reaction.findFirst({
        where: {
          copyPastaId: input.copyPastaId,
          userId: input.userId ?? ctx.session?.user.id,
        },
      });

      return {
        reactionsCount: reactions.length,
        currentUserReaction,
        userId: input.userId ? input.userId : ctx.session?.user.id,
      };
    }),
});
