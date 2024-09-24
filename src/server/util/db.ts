import { type EngagementAction, type PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { ENGAGEMENT_SCORE } from "~/lib/constant";

export async function getUserRank(
  dbRank: PrismaClient["rank"],
  engagementScore: number,
) {
  const rank = await dbRank.findFirst({
    where: {
      minimumScore: {
        lte: engagementScore,
      },
    },
    orderBy: {
      minimumScore: "desc",
    },
  });
  return rank;
}

export async function updateUserEngagementScore(
  db: PrismaClient,
  userId: string,
  action: EngagementAction,
) {
  try {
    const score = ENGAGEMENT_SCORE[action];
    await db.engagementLog.create({
      data: {
        action,
        score,
        userId,
      },
    });

    await db.user.update({
      where: {
        id: userId,
      },
      data: {
        engagementScore: {
          increment: score,
        },
      },
    });
  } catch (error) {
    console.log("Err", error);
    throw new TRPCError({ code: "BAD_REQUEST" });
  }
}
