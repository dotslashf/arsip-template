-- CreateEnum
CREATE TYPE "EmotionType" AS ENUM ('Kocak', 'Hah', 'Setuju', 'Marah');

-- CreateTable
CREATE TABLE "Reaction" (
    "id" TEXT NOT NULL,
    "copyPastaId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "emotion" "EmotionType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Reaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Reaction_copyPastaId_userId_key" ON "Reaction"("copyPastaId", "userId");

-- AddForeignKey
ALTER TABLE "Reaction" ADD CONSTRAINT "Reaction_copyPastaId_fkey" FOREIGN KEY ("copyPastaId") REFERENCES "CopyPasta"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reaction" ADD CONSTRAINT "Reaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
