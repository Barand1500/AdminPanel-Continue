-- AlterTable
ALTER TABLE "sayfalar" ADD COLUMN "ustSayfaId" INTEGER;
ALTER TABLE "sayfalar" ADD COLUMN "altMenuGorunum" TEXT NOT NULL DEFAULT 'dikey';
ALTER TABLE "sayfalar" ADD COLUMN "altMenuTetikleyici" TEXT NOT NULL DEFAULT 'hover';

-- CreateIndex
CREATE INDEX "sayfalar_siteId_ustSayfaId_idx" ON "sayfalar"("siteId", "ustSayfaId");

-- AddForeignKey
ALTER TABLE "sayfalar" ADD CONSTRAINT "sayfalar_ustSayfaId_fkey" FOREIGN KEY ("ustSayfaId") REFERENCES "sayfalar"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
