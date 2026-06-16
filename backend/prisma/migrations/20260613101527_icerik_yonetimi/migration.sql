-- CreateTable
CREATE TABLE "BlogYazisi" (
    "id" TEXT NOT NULL,
    "siteId" TEXT NOT NULL,
    "baslik" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "ozet" TEXT,
    "icerik" TEXT NOT NULL DEFAULT '',
    "kapakGorsel" TEXT,
    "yazar" TEXT,
    "kategori" TEXT,
    "yayinda" BOOLEAN NOT NULL DEFAULT false,
    "oneCikan" BOOLEAN NOT NULL DEFAULT false,
    "seoTitle" TEXT,
    "seoDesc" TEXT,
    "olusturma" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "guncelleme" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BlogYazisi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FormTanimi" (
    "id" TEXT NOT NULL,
    "siteId" TEXT NOT NULL,
    "ad" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "aciklama" TEXT,
    "alanlarJson" JSONB NOT NULL DEFAULT '[]',
    "aktif" BOOLEAN NOT NULL DEFAULT true,
    "bildirimEmail" TEXT,
    "olusturma" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "guncelleme" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FormTanimi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FormGonderim" (
    "id" TEXT NOT NULL,
    "formId" TEXT NOT NULL,
    "veriJson" JSONB NOT NULL,
    "okundu" BOOLEAN NOT NULL DEFAULT false,
    "olusturma" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FormGonderim_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BlogYazisi_siteId_slug_key" ON "BlogYazisi"("siteId", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "FormTanimi_siteId_slug_key" ON "FormTanimi"("siteId", "slug");

-- AddForeignKey
ALTER TABLE "BlogYazisi" ADD CONSTRAINT "BlogYazisi_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "Site"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormTanimi" ADD CONSTRAINT "FormTanimi_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "Site"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormGonderim" ADD CONSTRAINT "FormGonderim_formId_fkey" FOREIGN KEY ("formId") REFERENCES "FormTanimi"("id") ON DELETE CASCADE ON UPDATE CASCADE;
