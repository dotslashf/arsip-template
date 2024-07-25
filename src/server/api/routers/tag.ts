import { initTRPC } from '@trpc/server';
import {
    createTRPCRouter,
    protectedProcedure,
    publicProcedure,
} from "~/server/api/trpc";

export const t = initTRPC.create();

export const tagRouter = createTRPCRouter({
    list: publicProcedure
        .query(async ({ ctx }) => {
            const tags = await ctx.db.tag.findMany({
                take: 100,
                orderBy: {
                    name: "asc"
                }
            });

            return tags;
        })
})