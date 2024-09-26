/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const engagementLogsRouter = createTRPCRouter({
  latestEngagement: publicProcedure
    .input(
      z.object({
        id: z.string(),
        limit: z.number().default(10),
      }),
    )
    .query(async (opts) => {
      const engagements = opts.ctx.db.engagementLog.findMany({
        orderBy: {
          createdAt: "desc",
        },
        where: {
          userId: opts.input.id,
          data: {
            not: Prisma.AnyNull,
          },
        },
        take: opts.input.limit,
      });

      return engagements;
    }),
});
