import { spawn } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import net from 'node:net';
import path from 'node:path';

const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const backendEnvPath = path.resolve('backend/.env');
const backendPort = getBackendPort();

let backend;
let frontend;
let kapatiliyor = false;

function getBackendPort() {
  if (process.env.PORT) return Number(process.env.PORT);
  if (!existsSync(backendEnvPath)) return 4000;

  const env = readFileSync(backendEnvPath, 'utf8');
  const eslesme = env.match(/^\s*PORT\s*=\s*["']?(\d+)/m);
  return eslesme ? Number(eslesme[1]) : 4000;
}

function calistir(script) {
  return spawn(npmCommand, ['run', script], {
    stdio: 'inherit',
    // Windows'ta npm.cmd dosyası yalnızca bir kabuk üzerinden çalıştırılabilir.
    shell: process.platform === 'win32',
  });
}

function portAcikMi(port) {
  return new Promise((resolve) => {
    const soket = net.connect({ host: '127.0.0.1', port });
    const tamamla = (hazir) => {
      soket.removeAllListeners();
      soket.destroy();
      resolve(hazir);
    };

    soket.once('connect', () => tamamla(true));
    soket.once('error', () => tamamla(false));
    soket.setTimeout(500, () => tamamla(false));
  });
}

async function backendBekle() {
  const zamanAsimi = Date.now() + 60_000;
  while (Date.now() < zamanAsimi) {
    if (backend.exitCode !== null || backend.signalCode !== null) {
      throw new Error('Backend başlatılamadan kapandı. Yukarıdaki backend hatasını kontrol edin.');
    }
    if (await portAcikMi(backendPort)) return;
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  throw new Error(`Backend 60 saniye içinde ${backendPort} portunda hazır olmadı.`);
}

function kapat(cikisKodu = 0) {
  if (kapatiliyor) return;
  kapatiliyor = true;
  frontend?.kill();
  backend?.kill();
  process.exit(cikisKodu);
}

process.once('SIGINT', () => kapat());
process.once('SIGTERM', () => kapat());

backend = calistir('dev:backend');
backend.once('exit', (kod) => {
  if (!kapatiliyor) {
    console.error('Backend kapandı; geliştirme sunucusu durduruluyor.');
    kapat(kod ?? 1);
  }
});

try {
  await backendBekle();
  console.log(`Backend hazır (http://127.0.0.1:${backendPort}); frontend başlatılıyor.`);
  frontend = calistir('dev:frontend');
  frontend.once('exit', (kod) => kapat(kod ?? 0));
} catch (hata) {
  console.error(hata instanceof Error ? hata.message : hata);
  kapat(1);
}
