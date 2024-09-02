import {
  getPageViews,
  getPageViewsForSinglePage,
} from "~/server/util/analytics";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";

export const analyticsRouter = createTRPCRouter({
  getPopularCopyPasta: publicProcedure.query(async (opts) => {
    const analytics = await getPageViews();
    const result = await Promise.all(
      analytics.map(async (analytic) => {
        const copyPasta = await opts.ctx.db.copyPasta.findUnique({
          where: {
            id: analytic.path!.toString().replace("/copy-pasta/", ""),
          },
          select: {
            id: true,
            content: true,
          },
        });
        return {
          views: analytic.views,
          copyPasta: {
            id: copyPasta?.id,
            content: copyPasta?.content,
          },
        };
      }),
    );

    return result;
  }),

  getPageViewById: publicProcedure
    .input(
      z.object({
        id: z.string().uuid(),
      }),
    )
    .query(async (opts) => {
      const analytics = await getPageViewsForSinglePage(
        `/copy-pasta/${opts.input.id}`,
      );

      return analytics;
    }),
});
