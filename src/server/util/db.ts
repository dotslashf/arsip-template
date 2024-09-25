import { type PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { ENGAGEMENT_SCORE } from "~/lib/constant";
import { type EngagementActionDataDb } from "~/lib/interface";

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
  payload: EngagementActionDataDb,
) {
  try {
    const score = ENGAGEMENT_SCORE[payload.engagementType];
    await db.engagementLog.create({
      data: {
        action: payload.engagementType,
        score,
        userId,
        data: payload as any,
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
