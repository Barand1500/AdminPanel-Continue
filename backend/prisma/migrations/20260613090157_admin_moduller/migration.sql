-- AlterTable
ALTER TABLE "SiteAyarlari" ADD COLUMN     "ogGorselUrl" TEXT,
ADD COLUMN     "seoAciklama" TEXT,
ADD COLUMN     "seoAnahtar" TEXT,
ADD COLUMN     "seoBaslik" TEXT;

-- AlterTable
ALTER TABLE "Urun" ADD COLUMN     "seoDesc" TEXT,
ADD COLUMN     "seoTitle" TEXT;

-- CreateTable
CREATE TABLE "Medya" (
    "id" TEXT NOT NULL,
    "siteId" TEXT NOT NULL,
    "ad" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "tip" TEXT NOT NULL DEFAULT 'GORSEL',
    "boyut" INTEGER,
    "olusturma" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Medya_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Medya" ADD CONSTRAINT "Medya_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "Site"("id") ON DELETE CASCADE ON UPDATE CASCADE;
