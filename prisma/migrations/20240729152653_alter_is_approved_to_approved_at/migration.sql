/*
  Warnings:

  - You are about to drop the column `isApproved` on the `CopyPasta` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "CopyPasta" DROP COLUMN "isApproved",
ADD COLUMN     "approvedAt" TIMESTAMP(3),
ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;
