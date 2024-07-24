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
                tag: z.string().uuid().nullish(),
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
            if (input.tag) {
                condition["tag"] = {
                    some: {
                        tagId: input.tag
                    }
                }
            }

            const copyPastas = await ctx.db.copyPasta.findMany({
                take: input.limit ?? 1,
                skip: input.cursor ? 1 : 0,
                cursor: input.cursor ? { id: input.cursor } : undefined,
                where: {
                    content: condition["content"],
                    CopyPastasOnTags: condition["tag"]
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

    byId: publicProcedure
        .input(
            z.object({
                id: z.string().uuid()
            })
        ).query(async ({ input, ctx }) => {
            const copyPasta = await ctx.db.copyPasta.findFirstOrThrow({
                where: {
                    id: input.id
                },
                include: {
                    CopyPastasOnTags: {
                        include: {
                            tags: true
                        }
                    }
                }
            });

            return copyPasta ?? null
        })
})