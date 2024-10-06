-- CreateEnum
CREATE TYPE "ExclusiveBadgeType" AS ENUM ('Supporter', 'Donatur');
-- CreateTable
CREATE TABLE "ExclusiveBadge" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "ExclusiveBadgeType" NOT NULL,
    "achievedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ExclusiveBadge_pkey" PRIMARY KEY ("id")
);
-- CreateIndex
CREATE UNIQUE INDEX "ExclusiveBadge_userId_type_key" ON "ExclusiveBadge"("userId", "type");
-- AddForeignKey
ALTER TABLE "ExclusiveBadge"
ADD CONSTRAINT "ExclusiveBadge_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;