-- AlterTable
ALTER TABLE "SiteAyarlari" ADD COLUMN     "slogan" TEXT,
ALTER COLUMN "anaRenk" SET DEFAULT '#7c3aed',
ALTER COLUMN "ikincilRenk" SET DEFAULT '#a78bfa';

-- CreateTable
CREATE TABLE "Urun" (
    "id" TEXT NOT NULL,
    "siteId" TEXT NOT NULL,
    "ad" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "aciklama" TEXT,
    "fiyat" DECIMAL(12,2) NOT NULL,
    "paraBirimi" TEXT NOT NULL DEFAULT 'TRY',
    "gorselUrl" TEXT,
    "kategori" TEXT,
    "yeni" BOOLEAN NOT NULL DEFAULT false,
    "cokSatan" BOOLEAN NOT NULL DEFAULT false,
    "stokta" BOOLEAN NOT NULL DEFAULT true,
    "aktif" BOOLEAN NOT NULL DEFAULT true,
    "sira" INTEGER NOT NULL DEFAULT 0,
    "olusturma" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "guncelleme" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Urun_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Urun_siteId_slug_key" ON "Urun"("siteId", "slug");

-- AddForeignKey
ALTER TABLE "Urun" ADD CONSTRAINT "Urun_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "Site"("id") ON DELETE CASCADE ON UPDATE CASCADE;
