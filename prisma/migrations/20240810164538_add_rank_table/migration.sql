-- AlterTable
ALTER TABLE "User" ADD COLUMN     "rankId" TEXT;

-- CreateTable
CREATE TABLE "Rank" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "minCount" INTEGER NOT NULL,

    CONSTRAINT "Rank_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Rank_minCount_key" ON "Rank"("minCount");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_rankId_fkey" FOREIGN KEY ("rankId") REFERENCES "Rank"("id") ON DELETE SET NULL ON UPDATE CASCADE;
