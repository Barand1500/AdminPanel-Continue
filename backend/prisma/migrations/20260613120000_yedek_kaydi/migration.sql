-- CreateTable
CREATE TABLE "YedekKaydi" (
    "id" TEXT NOT NULL,
    "siteId" TEXT NOT NULL,
    "kullaniciId" TEXT,
    "kullaniciAd" TEXT NOT NULL,
    "kullaniciEmail" TEXT NOT NULL,
    "dosyaAdi" TEXT NOT NULL,
    "tip" TEXT NOT NULL,
    "olusturma" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "YedekKaydi_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "YedekKaydi_siteId_olusturma_idx" ON "YedekKaydi"("siteId", "olusturma");
