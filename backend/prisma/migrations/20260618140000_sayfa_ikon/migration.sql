-- Sayfa ikon alani (emoji / grafem)
ALTER TABLE `sayfalar` ADD COLUMN `ikon` VARCHAR(32) NULL AFTER `kapakGorsel`;
