-- DropForeignKey
ALTER TABLE "CopyPasta" DROP CONSTRAINT "CopyPasta_approvedById_fkey";

-- AlterTable
ALTER TABLE "CopyPasta" ALTER COLUMN "approvedById" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "CopyPasta" ADD CONSTRAINT "CopyPasta_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
