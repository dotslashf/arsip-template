import { AchievementType, type PrismaClient } from "@prisma/client";
import { ACHIEVEMENT_MINIMUM } from "~/lib/constant";
import { getJakartaDate } from "~/utils";

export async function checkAndGrantFiveCopyPastaADayAchievement(
  db: PrismaClient,
  userId: string,
) {
  const today = getJakartaDate();
  today.setHours(0, 0, 0);

  const userCreatedCopyPastaToday = await db.copyPasta.count({
    where: {
      createdAt: {
        gte: today,
      },
      createdById: userId,
    },
  });

  if (userCreatedCopyPastaToday >= 5) {
    const existingAchievement = await db.achievement.findUnique({
      where: {
        userId_type: {
          userId,
          type: AchievementType.FiveCopyPastaADay,
        },
      },
    });

    if (!existingAchievement) {
      await db.achievement.create({
        data: {
          userId,
          type: AchievementType.FiveCopyPastaADay,
        },
      });
      console.log(
        `User ${userId} has been granted the FiveCopyPastaADay achievement!`,
      );
    }
  }
}

export async function checkAndGrantTagCollectionAchievement(
  db: PrismaClient,
  userId: string,
) {
  const distinctTags = await db.copyPastasOnTags.findMany({
    where: {
      copyPastas: {
        createdById: userId,
      },
    },
    distinct: ["tagId"],
  });

  if (distinctTags.length >= ACHIEVEMENT_MINIMUM.TAG_COLLECTOR_MINIMUM) {
    const existingAchievement = await db.achievement.findUnique({
      where: {
        userId_type: {
          userId,
          type: AchievementType.TagCollector,
        },
      },
    });

    if (!existingAchievement) {
      await db.achievement.create({
        data: {
          userId,
          type: AchievementType.TagCollector,
        },
      });
      console.log(`User ${userId} has been granted the TagMaster achievement!`);
    }
  }
}

export async function checkAndGrantCollectionCuratorAchievement(
  db: PrismaClient,
  userId: string,
) {
  const collections = await db.collection.findMany({
    where: {
      createdById: userId,
    },
    include: {
      _count: {
        select: { copyPastas: true },
      },
    },
  });

  const qualifiedCollections = collections.filter(
    (collection) =>
      collection._count.copyPastas >=
      ACHIEVEMENT_MINIMUM.COLLECTION_CURATOR.COPY_PASTA_PER_COLLECTION,
  );

  if (
    qualifiedCollections.length >=
    ACHIEVEMENT_MINIMUM.COLLECTION_CURATOR.COLLECTION_MINIMUM
  ) {
    const existingAchievement = await db.achievement.findUnique({
      where: {
        userId_type: {
          userId,
          type: AchievementType.CollectionCurator,
        },
      },
    });

    if (!existingAchievement) {
      await db.achievement.create({
        data: {
          userId,
          type: AchievementType.CollectionCurator,
        },
      });
      console.log(
        `User ${userId} has been granted the CollectionCurator achievement!`,
      );
    }
  }
}
