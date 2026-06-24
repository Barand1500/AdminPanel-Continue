CREATE TABLE `konumlu_sliderlar` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `siteId` INTEGER NOT NULL,
  `sayfaId` INTEGER NULL,
  `ad` VARCHAR(191) NOT NULL,
  `aktif` BOOLEAN NOT NULL DEFAULT true,
  `sira` INTEGER NOT NULL DEFAULT 0,
  `configJson` JSON NULL,
  `olusturma` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `guncelleme` DATETIME(3) NOT NULL,

  INDEX `konumlu_sliderlar_siteId_sayfaId_aktif_sira_idx`(`siteId`, `sayfaId`, `aktif`, `sira`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE `konumlu_sliderlar` ADD CONSTRAINT `konumlu_sliderlar_siteId_fkey` FOREIGN KEY (`siteId`) REFERENCES `siteler`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `konumlu_sliderlar` ADD CONSTRAINT `konumlu_sliderlar_sayfaId_fkey` FOREIGN KEY (`sayfaId`) REFERENCES `sayfalar`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
