-- DropForeignKey
ALTER TABLE "CollectionsOnCopyPastas" DROP CONSTRAINT "CollectionsOnCopyPastas_collectionId_fkey";

-- AddForeignKey
ALTER TABLE "CollectionsOnCopyPastas" ADD CONSTRAINT "CollectionsOnCopyPastas_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection"("id") ON DELETE CASCADE ON UPDATE CASCADE;
