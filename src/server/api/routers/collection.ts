import { OriginSource, Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createCopyPastaFormServer } from "~/server/form/copyPasta";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { createCollectionForm } from '~/server/form/collection';

export const collectionRouter = createTRPCRouter({
  create: protectedProcedure.input(createCollectionForm).mutation(async ({ ctx, input }) => {
    const collection = await ctx.db.collection.create({
      data: {
        name: input.name,
        description: input.description,
        copyPastas: {
          createMany: {
            data: input.copyPastaIds.map((id) => {
              return {
                copyPastaId: id
              }
            })
          }
        },
        createdById: ctx.session.user.id
      }
    });

    return collection.id
  })
})