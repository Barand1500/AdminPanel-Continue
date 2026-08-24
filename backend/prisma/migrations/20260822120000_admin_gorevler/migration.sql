-- MySQL production migration. Additive only: existing tables and rows are not changed.
CREATE TABLE IF NOT EXISTS `admin_gorevler` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `siteId` INTEGER NOT NULL,
  `kullaniciId` INTEGER NOT NULL,
  `baslik` VARCHAR(500) NOT NULL,
  `tamamlandi` BOOLEAN NOT NULL DEFAULT false,
  `onemli` BOOLEAN NOT NULL DEFAULT false,
  `baslangicTarihi` DATETIME(3) NULL,
  `bitisTarihi` DATETIME(3) NULL,
  `olusturma` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `guncelleme` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),

  PRIMARY KEY (`id`),
  INDEX `admin_gorevler_kullaniciId_siteId_tamamlandi_bitisTarihi_idx` (`kullaniciId`, `siteId`, `tamamlandi`, `bitisTarihi`),
  INDEX `admin_gorevler_kullaniciId_siteId_olusturma_idx` (`kullaniciId`, `siteId`, `olusturma`),
  CONSTRAINT `admin_gorevler_siteId_fkey`
    FOREIGN KEY (`siteId`) REFERENCES `siteler`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `admin_gorevler_kullaniciId_fkey`
    FOREIGN KEY (`kullaniciId`) REFERENCES `kullanicilar`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
