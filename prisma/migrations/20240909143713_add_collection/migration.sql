-- CreateTable
CREATE TABLE "Collection" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT NOT NULL,

    CONSTRAINT "Collection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CollectionsOnCopyPastas" (
    "collectionId" TEXT NOT NULL,
    "copyPastaId" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "CollectionsOnCopyPastas_collectionId_copyPastaId_key" ON "CollectionsOnCopyPastas"("collectionId", "copyPastaId");

-- AddForeignKey
ALTER TABLE "Collection" ADD CONSTRAINT "Collection_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollectionsOnCopyPastas" ADD CONSTRAINT "CollectionsOnCopyPastas_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollectionsOnCopyPastas" ADD CONSTRAINT "CollectionsOnCopyPastas_copyPastaId_fkey" FOREIGN KEY ("copyPastaId") REFERENCES "CopyPasta"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
