-- MySQL: Header kategori menüsü tablosu
CREATE TABLE IF NOT EXISTS `nav_kategoriler` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `siteId` INT NOT NULL,
  `ustKategoriId` INT NULL,
  `baslik` VARCHAR(191) NOT NULL,
  `slug` VARCHAR(191) NOT NULL,
  `yol` VARCHAR(500) NULL,
  `gorselUrl` VARCHAR(500) NULL,
  `ikon` VARCHAR(80) NULL,
  `aktif` BOOLEAN NOT NULL DEFAULT true,
  `sira` INT NOT NULL DEFAULT 0,
  `olusturma` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `guncelleme` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE INDEX `nav_kategoriler_siteId_slug_key`(`siteId`, `slug`),
  INDEX `nav_kategoriler_siteId_ustKategoriId_sira_idx`(`siteId`, `ustKategoriId`, `sira`),
  CONSTRAINT `nav_kategoriler_siteId_fkey` FOREIGN KEY (`siteId`) REFERENCES `siteler`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `nav_kategoriler_ustKategoriId_fkey` FOREIGN KEY (`ustKategoriId`) REFERENCES `nav_kategoriler`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
