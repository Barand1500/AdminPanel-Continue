-- CreateEnum
CREATE TYPE "Rol" AS ENUM ('SUPER_ADMIN', 'AJANS_ADMIN', 'MUSTERI_ADMIN', 'EDITOR', 'SEO_EDITOR', 'GORUNTULEME');

-- CreateEnum
CREATE TYPE "WidgetTipi" AS ENUM ('HEADER', 'NAVBAR', 'SLIDER', 'HERO_BANNER', 'HIZMET_KARTLARI', 'URUN_LISTELEME', 'KATEGORI', 'REFERANSLAR', 'SSS', 'GALERI', 'HARITA', 'ILETISIM_FORMU', 'POPUP', 'FOOTER');

-- CreateTable
CREATE TABLE "Site" (
    "id" TEXT NOT NULL,
    "ad" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "domain" TEXT,
    "aktif" BOOLEAN NOT NULL DEFAULT true,
    "olusturma" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "guncelleme" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Site_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SiteAyarlari" (
    "id" TEXT NOT NULL,
    "siteId" TEXT NOT NULL,
    "logoUrl" TEXT,
    "faviconUrl" TEXT,
    "anaRenk" TEXT NOT NULL DEFAULT '#1e40af',
    "ikincilRenk" TEXT NOT NULL DEFAULT '#64748b',
    "font" TEXT NOT NULL DEFAULT 'Inter',
    "telefon" TEXT,
    "email" TEXT,
    "adres" TEXT,
    "whatsapp" TEXT,
    "telifYazisi" TEXT,
    "sosyalMedyaJson" JSONB,

    CONSTRAINT "SiteAyarlari_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Kullanici" (
    "id" TEXT NOT NULL,
    "siteId" TEXT,
    "email" TEXT NOT NULL,
    "sifreHash" TEXT NOT NULL,
    "ad" TEXT NOT NULL,
    "rol" "Rol" NOT NULL DEFAULT 'MUSTERI_ADMIN',
    "aktif" BOOLEAN NOT NULL DEFAULT true,
    "olusturma" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "guncelleme" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Kullanici_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sayfa" (
    "id" TEXT NOT NULL,
    "siteId" TEXT NOT NULL,
    "baslik" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "icerik" TEXT NOT NULL DEFAULT '',
    "kapakGorsel" TEXT,
    "seoTitle" TEXT,
    "seoDesc" TEXT,
    "yayinda" BOOLEAN NOT NULL DEFAULT false,
    "menudeGoster" BOOLEAN NOT NULL DEFAULT true,
    "sira" INTEGER NOT NULL DEFAULT 0,
    "olusturma" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "guncelleme" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Sayfa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Widget" (
    "id" TEXT NOT NULL,
    "siteId" TEXT NOT NULL,
    "sayfaId" TEXT,
    "ad" TEXT NOT NULL,
    "tip" "WidgetTipi" NOT NULL,
    "sira" INTEGER NOT NULL DEFAULT 0,
    "aktif" BOOLEAN NOT NULL DEFAULT true,
    "baslik" TEXT,
    "altBaslik" TEXT,
    "aciklama" TEXT,
    "gorselUrl" TEXT,
    "butonMetni" TEXT,
    "butonLink" TEXT,
    "arkaPlanRenk" TEXT,
    "yaziRenk" TEXT,
    "mobilGoster" BOOLEAN NOT NULL DEFAULT true,
    "masaustuGoster" BOOLEAN NOT NULL DEFAULT true,
    "configJson" JSONB,
    "olusturma" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "guncelleme" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Widget_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Site_slug_key" ON "Site"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "SiteAyarlari_siteId_key" ON "SiteAyarlari"("siteId");

-- CreateIndex
CREATE UNIQUE INDEX "Kullanici_email_key" ON "Kullanici"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Sayfa_siteId_slug_key" ON "Sayfa"("siteId", "slug");

-- AddForeignKey
ALTER TABLE "SiteAyarlari" ADD CONSTRAINT "SiteAyarlari_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "Site"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Kullanici" ADD CONSTRAINT "Kullanici_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "Site"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sayfa" ADD CONSTRAINT "Sayfa_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "Site"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Widget" ADD CONSTRAINT "Widget_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "Site"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Widget" ADD CONSTRAINT "Widget_sayfaId_fkey" FOREIGN KEY ("sayfaId") REFERENCES "Sayfa"("id") ON DELETE SET NULL ON UPDATE CASCADE;
