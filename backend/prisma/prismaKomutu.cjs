/*
 * Tek kaynak şeması yerelde SQLite olarak kalır. Sunucuda DATABASE_URL MySQL ise
 * Prisma çalıştırılmadan önce MySQL'e uygun geçici şema üretilir.
 */
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const kok = path.join(__dirname, '..');
const kaynakSemasi = path.join(__dirname, 'schema.prisma');
const mysqlSemasi = path.join(__dirname, 'schema.mysql.prisma');
const mysqlMi = /^mysql:\/\//i.test(process.env.DATABASE_URL ?? '');
const prismaKomutu = process.platform === 'win32'
  ? path.join(kok, 'node_modules', '.bin', 'prisma.cmd')
  : path.join(kok, 'node_modules', '.bin', 'prisma');

const argumanlar = process.argv.slice(2);
if (!argumanlar.length) {
  console.error('Kullanim: node prisma/prismaKomutu.cjs <prisma-komutu>');
  process.exit(1);
}

if (mysqlMi) {
  const mysqlIcerik = fs.readFileSync(kaynakSemasi, 'utf8')
    .replace('provider = "sqlite"', 'provider = "mysql"')
    .replace(/^(\s+(?:icerik|aciklama)\s+String\??).*$/gm, '$1 @db.LongText');
  fs.writeFileSync(mysqlSemasi, mysqlIcerik);
  argumanlar.push('--schema', mysqlSemasi);
}

const sonuc = spawnSync(prismaKomutu, argumanlar, { stdio: 'inherit', cwd: kok });
process.exit(sonuc.status ?? 1);
