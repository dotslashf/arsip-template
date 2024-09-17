import {
  getPageViews,
  getPageViewsForSinglePage,
} from "~/server/util/analytics";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";

export const statisticsRouter = createTRPCRouter({
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
            CopyPastasOnTags: {
              include: {
                tags: true,
              },
            },
          },
        });
        return {
          views: analytic.views,
          copyPasta: {
            id: copyPasta?.id,
            content: copyPasta?.CopyPastasOnTags.some(
              (copy) => copy.tags.name === "NSFW",
            )
              ? "[CENSORED]"
              : copyPasta?.content,
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

  getReactionCategoryByEmotions: publicProcedure.query(async (opts) => {
    const reactionDistribution: {
      emotion: string;
      count: number;
    }[] = await opts.ctx.db.$queryRaw`
      SELECT emotion, COUNT(*)::integer as count
      FROM "Reaction"
      GROUP BY emotion
      ORDER BY count DESC
    `;

    return reactionDistribution;
  }),

  getTagCoOccurrence: publicProcedure.query(async (opts) => {
    const tagCoOccurrence: {
      tag1: string;
      tag2: string;
      co_occurrence_count: number;
    }[] = await opts.ctx.db.$queryRaw`
      SELECT 
        t1.name as tag1,
        t2.name as tag2,
        COUNT(*)::integer as co_occurrence_count
      FROM "CopyPastasOnTags" cpt1
      JOIN "CopyPastasOnTags" cpt2 ON cpt1."copyPastaId" = cpt2."copyPastaId" AND cpt1."tagId" < cpt2."tagId"
      JOIN "Tag" t1 ON cpt1."tagId" = t1.id
      JOIN "Tag" t2 ON cpt2."tagId" = t2.id
      GROUP BY t1.name, t2.name
      ORDER BY co_occurrence_count DESC
      LIMIT 5;  
    `;

    return tagCoOccurrence;
  }),

  getCopyPastaSubmittedPerDay: publicProcedure
    .input(
      z.object({
        days: z.number().default(30),
      }),
    )
    .query(async (opts) => {
      const copyPastas: {
        submission_date: Date;
        submission_count: number;
      }[] = await opts.ctx.db.$queryRaw`
        SELECT 
          DATE(cp."createdAt") as submission_date,
          COUNT(*)::integer as submission_count
        FROM "CopyPasta" cp
        WHERE cp."createdAt" >= CURRENT_DATE - INTERVAL '30 days'
        GROUP BY DATE(cp."createdAt")
        ORDER BY submission_date ASC;
      `;

      return copyPastas;
    }),

  getCopyPastaVersusReactionPerDay: publicProcedure
    .input(
      z.object({
        days: z.number().default(30),
      }),
    )
    .query(async (opts) => {
      const data: {
        date: Date;
        approved_copypastas: number;
        reactions: number;
      }[] = await opts.ctx.db.$queryRaw`
      WITH date_series AS (
          SELECT generate_series(
              CURRENT_DATE - INTERVAL '30 days',
              CURRENT_DATE,
              '1 day'::interval
          )::date AS date
      ),
      approved_copypastas AS (
          SELECT 
              DATE("approvedAt") as approval_date,
              COUNT(*)::integer as approved_count
          FROM "CopyPasta"
          WHERE "approvedAt" >= CURRENT_DATE - INTERVAL '30 days'
          GROUP BY DATE("approvedAt")
      ),
      reactions AS (
          SELECT 
              DATE("createdAt") as reaction_date,
              COUNT(*)::integer as reaction_count
          FROM "Reaction"
          WHERE "createdAt" >= CURRENT_DATE - INTERVAL '30 days'
          GROUP BY DATE("createdAt")
      )
      SELECT 
          ds.date,
          COALESCE(ac.approved_count, 0) as approved_copypastas,
          COALESCE(r.reaction_count, 0) as reactions
      FROM date_series ds
      LEFT JOIN approved_copypastas ac ON ds.date = ac.approval_date
      LEFT JOIN reactions r ON ds.date = r.reaction_date
      ORDER BY ds.date ASC;
      `;

      return data;
    }),
});
