-- SiteEklenti tablosu (eklenti sistemi)
CREATE TABLE IF NOT EXISTS `site_eklentiler` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `siteId` INT NOT NULL,
  `kod` VARCHAR(191) NOT NULL,
  `ad` VARCHAR(191) NOT NULL,
  `surum` VARCHAR(191) NOT NULL,
  `durum` VARCHAR(191) NOT NULL DEFAULT 'kurulu',
  `kaynak` VARCHAR(191) NOT NULL DEFAULT 'katalog',
  `manifestJson` JSON NULL,
  `ayarlarJson` JSON NULL,
  `kurulumTarihi` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `guncelleme` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE INDEX `site_eklentiler_siteId_kod_key`(`siteId`, `kod`),
  INDEX `site_eklentiler_siteId_durum_idx`(`siteId`, `durum`),
  CONSTRAINT `site_eklentiler_siteId_fkey` FOREIGN KEY (`siteId`) REFERENCES `siteler`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
