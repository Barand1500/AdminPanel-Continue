#!/usr/bin/env node
/**
 * Sunucu deploy scripti
 * Kullanım:
 *   ./deploy.sh          → git pull + build + deploy + pm2 restart
 *   ./deploy.sh init     → ilk kurulum (klasörler, .env şablonu, pm2 start)
 *   node deploy.js help  → yardım
 */

const { execSync, spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const REPO_ROOT = __dirname;
const CONFIG_PATH = path.join(REPO_ROOT, 'deploy.config.json');
const BACKEND_SRC = path.join(REPO_ROOT, 'backend');
const FRONTEND_SRC = path.join(REPO_ROOT, 'frontend');

// ─── Terminal renkleri ───────────────────────────────────────────────────
const c = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  bgBlue: '\x1b[44m',
};

function banner(text) {
  const line = '═'.repeat(Math.min(58, text.length + 4));
  console.log(`\n${c.cyan}${c.bold}╔${line}╗${c.reset}`);
  console.log(`${c.cyan}${c.bold}║  ${text.padEnd(line.length - 2)}║${c.reset}`);
  console.log(`${c.cyan}${c.bold}╚${line}╝${c.reset}\n`);
}

function step(no, total, msg) {
  console.log(`${c.blue}${c.bold}[${no}/${total}]${c.reset} ${c.white}${msg}${c.reset}`);
}

function ok(msg) {
  console.log(`  ${c.green}✔${c.reset} ${msg}`);
}

function warn(msg) {
  console.log(`  ${c.yellow}⚠${c.reset} ${msg}`);
}

function fail(msg) {
  console.log(`  ${c.red}✖${c.reset} ${msg}`);
}

function info(msg) {
  console.log(`  ${c.dim}${msg}${c.reset}`);
}

function die(msg, code = 1) {
  fail(msg);
  process.exit(code);
}

function loadConfig() {
  if (!fs.existsSync(CONFIG_PATH)) {
    die(
      `deploy.config.json bulunamadı.\n` +
        `  cp deploy.config.example.json deploy.config.json\n` +
        `  ardından sunucu yollarını düzenleyin.`
    );
  }
  try {
    return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
  } catch (err) {
    die(`deploy.config.json okunamadı: ${err.message}`);
  }
}

function run(cmd, opts = {}) {
  const { cwd = REPO_ROOT, silent = false, env = process.env } = opts;
  if (!silent) info(`${c.dim}$ ${cmd}${c.reset}`);
  try {
    execSync(cmd, {
      cwd,
      stdio: silent ? 'pipe' : 'inherit',
      env,
      shell: '/bin/bash',
    });
  } catch (err) {
    die(`Komut başarısız: ${cmd}`);
  }
}

function runCapture(cmd, cwd = REPO_ROOT) {
  try {
    return execSync(cmd, { cwd, encoding: 'utf8', shell: '/bin/bash' }).trim();
  } catch {
    return '';
  }
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function dirHasFiles(dir) {
  return fs.existsSync(dir) && fs.readdirSync(dir).length > 0;
}

function copyDir(src, dest) {
  ensureDir(dest);
  fs.cpSync(src, dest, { recursive: true, force: true });
}

function clearDir(dir, keep = new Set()) {
  if (!fs.existsSync(dir)) return;
  for (const name of fs.readdirSync(dir)) {
    if (keep.has(name)) continue;
    const full = path.join(dir, name);
    fs.rmSync(full, { recursive: true, force: true });
  }
}

function copyFileIfExists(src, dest) {
  if (!fs.existsSync(src)) return false;
  ensureDir(path.dirname(dest));
  fs.copyFileSync(src, dest);
  return true;
}

function gitPull(cfg) {
  if (!fs.existsSync(path.join(REPO_ROOT, '.git'))) {
    warn('Git deposu yok — git pull atlandı.');
    return;
  }
  const branch = cfg.gitBranch || 'main';
  run(`git fetch origin ${branch}`);
  run(`git checkout ${branch}`);
  run(`git pull origin ${branch}`);
  const hash = runCapture('git rev-parse --short HEAD');
  const msg = runCapture('git log -1 --pretty=%s');
  ok(`Git güncellendi → ${hash} ${msg}`);
}

function npmInstallRoot() {
  run('npm install');
  ok('Bağımlılıklar yüklendi (workspace root)');
}

function buildBackend() {
  run('npm run build --workspace=backend');
  if (!fs.existsSync(path.join(BACKEND_SRC, 'dist', 'index.js'))) {
    die('Backend build başarısız — dist/index.js oluşmadı.');
  }
  ok('Backend TypeScript derlendi → backend/dist/');
}

function buildFrontend(cfg) {
  const env = { ...process.env, ...cfg.frontendEnv };
  const envStr = Object.entries(cfg.frontendEnv || {})
    .map(([k, v]) => `${k}=${v}`)
    .join(' ');
  run(`${envStr} npm run build --workspace=frontend`, { env });
  if (!fs.existsSync(path.join(FRONTEND_SRC, 'dist', 'index.html'))) {
    die('Frontend build başarısız — dist/index.html oluşmadı.');
  }
  ok('Frontend Vite build alındı → frontend/dist/');
}

function deployFrontend(cfg) {
  const src = path.join(FRONTEND_SRC, 'dist');
  const dest = cfg.deployFrontendDir;

  ensureDir(dest);
  clearDir(dest);
  copyDir(src, dest);

  ok(`Frontend dosyaları kopyalandı → ${dest}`);
}

function deployBackend(cfg) {
  const dest = cfg.deployBackendDir;
  ensureDir(dest);

  const preserve = new Set(['.env', 'uploads']);
  clearDir(dest, preserve);

  const files = ['server.js', 'package.json', 'ecosystem.config.cjs'];
  for (const f of files) {
    const src = path.join(BACKEND_SRC, f);
    if (!fs.existsSync(src)) die(`Eksik backend dosyası: ${f}`);
    fs.copyFileSync(src, path.join(dest, f));
  }

  copyDir(path.join(BACKEND_SRC, 'dist'), path.join(dest, 'dist'));
  copyDir(path.join(BACKEND_SRC, 'prisma'), path.join(dest, 'prisma'));

  ensureDir(path.join(dest, 'uploads'));
  if (!fs.existsSync(path.join(dest, 'uploads', '.gitkeep'))) {
    fs.writeFileSync(path.join(dest, 'uploads', '.gitkeep'), '');
  }

  ok(`Backend dosyaları kopyalandı → ${dest}`);
}

function ensureBackendEnv(cfg) {
  const envPath = path.join(cfg.deployBackendDir, '.env');
  if (fs.existsSync(envPath)) {
    ok('.env mevcut (korundu)');
    return;
  }

  const example = path.join(BACKEND_SRC, '.env.example');
  if (!copyFileIfExists(example, envPath)) {
    warn('.env yok! backend/.env.example dosyasını deploy hedefine kopyalayın.');
    return;
  }

  let content = fs.readFileSync(envPath, 'utf8');
  content = content.replace(/^PORT=.*/m, `PORT=${cfg.backendPort}`);
  content = content.replace(/^NODE_ENV=.*/m, 'NODE_ENV=production');
  fs.writeFileSync(envPath, content);
  warn(`.env şablondan oluşturuldu → ${envPath}`);
  warn('DATABASE_URL, JWT_SECRET ve CORS_ORIGIN değerlerini mutlaka düzenleyin!');
}

function backendProdInstall(cfg) {
  const dest = cfg.deployBackendDir;
  run('npm install --omit=dev', { cwd: dest });
  run('npx prisma generate', { cwd: dest });
  ok('Backend production bağımlılıkları + Prisma client hazır');
}

function runMigrations(cfg) {
  if (!cfg.runMigrations) {
    info('Prisma migrate atlandı (runMigrations: false)');
    info('Yeni tablolar için phpMyAdmin\'de SQL çalıştırmanız gerekebilir.');
    return;
  }
  const dest = cfg.deployBackendDir;
  run('npx prisma migrate deploy', { cwd: dest });
  ok('Veritabanı migration\'ları uygulandı');
}

function pm2Restart(cfg) {
  const dest = cfg.deployBackendDir;
  const name = cfg.pm2AppName;
  const eco = path.join(dest, 'ecosystem.config.cjs');

  const list = runCapture('pm2 jlist');
  const running = list.includes(`"name":"${name}"`);

  if (running) {
    run(`pm2 restart ${name} --update-env`);
    ok(`PM2 yeniden başlatıldı → ${name}`);
  } else {
    run(`pm2 start ${eco}`, { cwd: dest });
    run(`pm2 save`);
    ok(`PM2 ilk kez başlatıldı → ${name}`);
  }
}

function healthCheck(cfg) {
  const port = cfg.backendPort;
  const res = spawnSync('curl', ['-s', '-o', '/dev/null', '-w', '%{http_code}', `http://127.0.0.1:${port}/api/site`], {
    encoding: 'utf8',
  });
  const code = (res.stdout || '').trim();
  if (code === '200' || code === '404') {
    ok(`API yanıt veriyor (HTTP ${code}) → port ${port}`);
  } else {
    warn(`API health check belirsiz (HTTP ${code || 'yok'}) — pm2 logs ${cfg.pm2AppName} ile kontrol edin`);
  }
}

function printSummary(cfg, startedAt) {
  const elapsed = ((Date.now() - startedAt) / 1000).toFixed(1);
  console.log('');
  banner('Deploy Tamamlandı');
  console.log(`  ${c.bold}Proje:${c.reset}    ${cfg.projectName}`);
  console.log(`  ${c.bold}Frontend:${c.reset}  ${cfg.deployFrontendDir}`);
  console.log(`  ${c.bold}Backend:${c.reset}   ${cfg.deployBackendDir}`);
  console.log(`  ${c.bold}PM2:${c.reset}       ${cfg.pm2AppName} (port ${cfg.backendPort})`);
  console.log(`  ${c.bold}Süre:${c.reset}      ${elapsed}s`);
  console.log('');
  info('Siteyi hard refresh ile açın: Ctrl+Shift+R');
  console.log('');
}

function deploy(cfg) {
  const startedAt = Date.now();
  const total = 9;

  banner(cfg.projectName || 'Deploy');

  step(1, total, 'Git güncelleme');
  gitPull(cfg);

  step(2, total, 'Bağımlılıklar');
  npmInstallRoot();

  step(3, total, 'Backend build');
  buildBackend();

  step(4, total, 'Frontend build');
  buildFrontend(cfg);

  step(5, total, 'Frontend deploy');
  deployFrontend(cfg);

  step(6, total, 'Backend deploy');
  deployBackend(cfg);
  ensureBackendEnv(cfg);

  step(7, total, 'Backend production install');
  backendProdInstall(cfg);

  step(8, total, 'Veritabanı');
  runMigrations(cfg);

  step(9, total, 'PM2 restart');
  pm2Restart(cfg);
  healthCheck(cfg);

  printSummary(cfg, startedAt);
}

function init(cfg) {
  banner('İlk Kurulum (init)');

  step(1, 4, 'Deploy klasörleri oluşturuluyor');
  ensureDir(cfg.deployFrontendDir);
  ensureDir(cfg.deployBackendDir);
  ensureDir(path.join(cfg.deployBackendDir, 'uploads'));
  ok(`Frontend → ${cfg.deployFrontendDir}`);
  ok(`Backend  → ${cfg.deployBackendDir}`);

  step(2, 4, '.env kontrolü');
  ensureBackendEnv(cfg);

  step(3, 4, 'Tam deploy');
  deploy(cfg);

  step(4, 4, 'PM2 startup (opsiyonel)');
  info('Sunucu reboot sonrası otomatik başlatma için bir kez çalıştırın:');
  info('  pm2 startup');
  info('  pm2 save');
  ok('Init tamamlandı');
}

function printHelp() {
  console.log(`
${c.cyan}${c.bold}Deploy Script${c.reset}

${c.bold}Kullanım:${c.reset}
  ./deploy.sh              Git pull + build + sunucuya kopyala + PM2 restart
  ./deploy.sh init         İlk kurulum (klasörler + .env şablonu + deploy)
  node deploy.js help      Bu yardım

${c.bold}Yapılandırma:${c.reset}
  deploy.config.json       Sunucuya özel ayarlar (yollar, PM2 adı, port)
  deploy.config.example.json   Şablon — yeni projeler için kopyalayın

${c.bold}Sunucuda değiştirmeniz gerekenler (deploy.config.json):${c.reset}
  deployFrontendDir   Nginx root (örn. .../frontend)
  deployBackendDir    API klasörü (örn. .../backend)
  pm2AppName          PM2 process adı
  backendPort         .env PORT ile aynı (nginx proxy: 3003)
  gitRemote / gitBranch
  frontendEnv.VITE_SITE_SLUG

${c.bold}Sunucuda elle oluşturmanız gereken (git\'e atılmaz):${c.reset}
  .../backend/.env      DATABASE_URL, JWT_SECRET, CORS_ORIGIN, PORT

${c.bold}İlk kurulum adımları:${c.reset}
  1. cd /home/guzelteknoloji-admin/repos
  2. git clone ${c.dim}https://github.com/Barand1500/AdminPanel-Continue.git${c.reset}
  3. cd AdminPanel-Continue
  4. deploy.config.json yollarını kontrol edin
  5. chmod +x deploy.sh
  6. ./deploy.sh init
  7. .../backend/.env dosyasını düzenleyin
  8. ./deploy.sh
`);
}

function main() {
  const arg = (process.argv[2] || '').toLowerCase();

  if (arg === 'help' || arg === '--help' || arg === '-h') {
    printHelp();
    return;
  }

  const cfg = loadConfig();

  if (arg === 'init') {
    init(cfg);
    return;
  }

  if (arg && arg !== 'deploy') {
    die(`Bilinmeyen komut: ${arg}\n  Kullanım: ./deploy.sh [init|help]`);
  }

  deploy(cfg);
}

main();
