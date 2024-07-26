/*
  Warnings:

  - Added the required column `approvedById` to the `CopyPasta` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CopyPasta" ADD COLUMN     "approvedById" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "CopyPasta" ADD CONSTRAINT "CopyPasta_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
