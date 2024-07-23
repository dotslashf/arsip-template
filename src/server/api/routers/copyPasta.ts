import { contextProps } from '@trpc/react-query/shared';
import { initTRPC } from '@trpc/server';
import { z } from "zod";

import {
    createTRPCRouter,
    protectedProcedure,
    publicProcedure,
} from "~/server/api/trpc";

export const t = initTRPC.create();

export const copyPastaRouter = createTRPCRouter({
    list: publicProcedure
        .input(
            z.object({
                limit: z.number().min(1).max(10).nullish(),
                cursor: z.string().nullish(),
                search: z.string().nullish(),
            }),
        )
        .query(async ({ input, ctx }) => {
            const condition: { [key: string]: any } = {};
            if (input.search) {
                condition["content"] = {
                    contains: input.search,
                    mode: "insensitive"
                }
            }

            const copyPastas = await ctx.db.copyPasta.findMany({
                take: input.limit ?? 1,
                skip: input.cursor ? 1 : 0,
                cursor: input.cursor ? { id: input.cursor } : undefined,
                where: {
                    content: condition["content"]
                },
                orderBy: {
                    createdAt: "desc"
                },
                include: {
                    CopyPastasOnTags: {
                        include: {
                            tags: true
                        }
                    }
                }
            })
            const nextCursor = copyPastas.length > 0 ? copyPastas[copyPastas.length - 1]?.id : undefined;
            return {
                copyPastas,
                nextCursor
            }
        }),
})