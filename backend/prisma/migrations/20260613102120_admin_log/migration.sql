-- CreateTable
CREATE TABLE "AdminLog" (
    "id" TEXT NOT NULL,
    "siteId" TEXT NOT NULL,
    "kullaniciId" TEXT,
    "kullaniciAd" TEXT NOT NULL,
    "kullaniciEmail" TEXT NOT NULL,
    "islem" TEXT NOT NULL,
    "modulId" TEXT,
    "aksiyonId" TEXT,
    "olusturma" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdminLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AdminLog_siteId_olusturma_idx" ON "AdminLog"("siteId", "olusturma");
