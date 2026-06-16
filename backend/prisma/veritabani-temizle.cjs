/**
 * Tum tablolari bosaltir, ID sayaclarini 1'e sifirlar, varsayilan seed verisini yukler.
 * Sunucuda tsx gerekmez — dogrudan node ile calisir.
 *
 * Kullanim:
 *   npm run db:temizle -- --onay
 *   veya: DB_TEMIZLE_ONAY=evet npm run db:temizle
 */

const { execSync } = require('node:child_process');
const path = require('node:path');

const backendRoot = path.resolve(__dirname, '..');

function prismaClientYukle() {
  const adaylar = [
    '@prisma/client',
    path.join(backendRoot, 'node_modules', '@prisma/client'),
    path.join(backendRoot, '..', 'node_modules', '@prisma/client'),
  ];

  for (const aday of adaylar) {
    try {
      return require(aday);
    } catch {
      // sonraki aday
    }
  }

  console.error('');
  console.error('HATA: @prisma/client bulunamadi.');
  console.error('');
  console.error('Sunucuda once su komutlari calistir:');
  console.error('  cd ~/htdocs/admin.guzelteknoloji.com/backend');
  console.error('  npm install');
  console.error('  npx prisma generate');
  console.error('  node prisma/veritabani-temizle.cjs --onay');
  console.error('');
  process.exit(1);
}

const { PrismaClient } = prismaClientYukle();
const prisma = new PrismaClient();

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
];

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

function seedYukle() {
  console.log('');
  console.log('Varsayilan yapi yukleniyor (seed)...');

  const komutlar = [
    'npm run db:seed',
    'npx --yes tsx prisma/seed.ts',
    'node node_modules/tsx/dist/cli.mjs prisma/seed.ts',
  ];

  let sonHata;
  for (const komut of komutlar) {
    try {
      execSync(komut, { cwd: backendRoot, stdio: 'inherit', env: process.env });
      return;
    } catch (err) {
      sonHata = err;
    }
  }

  throw sonHata ?? new Error('Seed calistirilamadi. backend klasorunde npm install deneyin.');
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
    seedYukle();
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
