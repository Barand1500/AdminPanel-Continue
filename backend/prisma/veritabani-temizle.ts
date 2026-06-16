/**
 * Tum tablolari bosaltir, ID sayaclarini 1'e sifirlar, varsayilan seed verisini yukler.
 *
 * Kullanim:
 *   npm run db:temizle -- --onay
 *   veya: DB_TEMIZLE_ONAY=evet npm run db:temizle
 *
 * Sadece bosalt (seed yukleme):
 *   npm run db:temizle -- --onay --seed-yok
 */

import { execSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const backendRoot = path.resolve(__dirname, '..');

/** schema.prisma @@map isimleri — yeni tablo eklenirse buraya da ekle */
const TABLOLAR = [
  'form_gonderimler',
  'admin_loglari',
  'yedek_kayitlari',
  'widgetlar',
  'sekme_ayarlari',
  'sistem_ayarlari',
  'form_tanimlari',
  'blog_yazilari',
  'medyalar',
  'sayfalar',
  'kisayol_ayarlari',
  'site_ayarlari',
  'roller',
  'kullanicilar',
  'siteler',
] as const;

const onayVar =
  process.argv.includes('--onay') || process.env.DB_TEMIZLE_ONAY === 'evet';
const seedYok = process.argv.includes('--seed-yok');

async function tablolariBosalt() {
  await prisma.$executeRawUnsafe('SET FOREIGN_KEY_CHECKS = 0');

  for (const tablo of TABLOLAR) {
    await prisma.$executeRawUnsafe(`TRUNCATE TABLE \`${tablo}\``);
    console.log(`  [OK] ${tablo} — icerik silindi, ID 1'den baslar`);
  }

  await prisma.$executeRawUnsafe('SET FOREIGN_KEY_CHECKS = 1');
}

async function seedYukle() {
  console.log('');
  console.log('Varsayilan yapi yukleniyor (seed)...');
  execSync('npm run db:seed', { cwd: backendRoot, stdio: 'inherit', env: process.env });
}

async function main() {
  if (!onayVar) {
    console.log('');
    console.log('UYARI: Bu islem TUM veritabani verisini siler.');
    console.log('Tum tablolar bosalir, ID sayaclari 1\'den baslar.');
    console.log('Varsayilan olarak ardindan seed calisir (demo site + admin).');
    console.log('');
    console.log('Devam etmek icin:');
    console.log('  npm run db:temizle -- --onay');
    console.log('  veya: DB_TEMIZLE_ONAY=evet npm run db:temizle');
    console.log('');
    console.log('Sadece bosaltmak icin (seed yok):');
    console.log('  npm run db:temizle -- --onay --seed-yok');
    console.log('');
    console.log('Not: backend/uploads klasorundeki dosyalar silinmez.');
    console.log('');
    return;
  }

  console.log('==========================================');
  console.log(' Veritabani temizligi basladi');
  console.log('==========================================');

  await tablolariBosalt();

  if (!seedYok) {
    await seedYukle();
  }

  console.log('');
  console.log('==========================================');
  console.log(
    seedYok
      ? ' Veritabani bosaltildi. Seed calistirilmadi.'
      : ' Veritabani temizlendi ve varsayilan yapi yuklendi.'
  );
  if (!seedYok) {
    console.log(' Admin: admin@guzelteknoloji.com / admin123');
  }
  console.log('==========================================');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
