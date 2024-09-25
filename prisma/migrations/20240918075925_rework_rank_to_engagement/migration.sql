/*
  Warnings:

  - You are about to drop the column `minCount` on the `Rank` table. All the data in the column will be lost.
  - You are about to drop the column `rankId` on the `User` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "EngagementAction" AS ENUM ('CreateCopyPasta', 'ApproveCopyPasta', 'GiveReaction', 'CreateCollection');

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_rankId_fkey";

-- DropIndex
DROP INDEX "Rank_minCount_key";

-- AlterTable
ALTER TABLE "Rank" DROP COLUMN "minCount",
ADD COLUMN     "minimumScore" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "rankId",
ADD COLUMN     "engagementScore" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "EngagementLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "action" "EngagementAction" NOT NULL,
    "score" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EngagementLog_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "EngagementLog" ADD CONSTRAINT "EngagementLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
