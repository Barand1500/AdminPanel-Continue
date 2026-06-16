#!/usr/bin/env node
/**
 * Sunucu deploy scripti
 * Ilk kurulum: node deploy.js init
 * Deploy:      node deploy.js  veya  npm run deploy
 */

const { execSync } = require('node:child_process');
const { copyFileSync, existsSync, unlinkSync } = require('node:fs');
const path = require('node:path');

const projectRoot = __dirname;
process.chdir(projectRoot);

const BRANCH = process.env.DEPLOY_BRANCH || 'main';
const PM2_APP = process.env.PM2_APP_NAME || 'guzelteknoloji-api';
const GIT_REPO =
  process.env.GIT_REPO_URL || 'https://github.com/Barand1500/AdminPanel-Continue.git';

const isInit = process.argv.includes('init');

function run(cmd, options = {}) {
  console.log(`> ${cmd}`);
  execSync(cmd, { stdio: 'inherit', ...options });
}

function isGitRepo() {
  return existsSync(path.join(projectRoot, '.git'));
}

function pm2Exists() {
  try {
    execSync('pm2 --version', { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

function pm2AppRunning(name) {
  try {
    execSync(`pm2 describe ${name}`, { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

function backupEnv() {
  const envPath = path.join(projectRoot, 'backend', '.env');
  const backupPath = path.join(projectRoot, 'backend', '.env.deploy-backup');
  if (existsSync(envPath)) {
    copyFileSync(envPath, backupPath);
    console.log('.env yedeklendi.');
  }
  return backupPath;
}

function restoreEnv(backupPath) {
  const envPath = path.join(projectRoot, 'backend', '.env');
  if (existsSync(backupPath)) {
    copyFileSync(backupPath, envPath);
    unlinkSync(backupPath);
    console.log('.env geri yuklendi.');
  }
}

function initGitRepo() {
  if (isGitRepo()) {
    console.log('Git zaten kurulu. Deploy icin: node deploy.js');
    return;
  }

  console.log('==========================================');
  console.log(' Git ilk kurulum');
  console.log(` Repo: ${GIT_REPO}`);
  console.log(` Branch: ${BRANCH}`);
  console.log('==========================================');

  const envBackup = backupEnv();

  run('git init');
  run(`git remote add origin ${GIT_REPO}`);
  run(`git fetch origin ${BRANCH}`);
  run(`git checkout -f -B ${BRANCH} origin/${BRANCH}`);

  restoreEnv(envBackup);

  console.log('');
  console.log('Git kurulumu tamam. Simdi deploy calistir:');
  console.log('  node deploy.js');
  console.log('==========================================');
}

function ensureGitRepo() {
  if (isGitRepo()) return;

  console.error('');
  console.error('HATA: Bu klasor git deposu degil (.git yok).');
  console.error('Dosyalar muhtemelen FTP ile yuklenmis; once git baglantisi kurulmali.');
  console.error('');
  console.error('Sunucuda bir kez su komutu calistir:');
  console.error('  node deploy.js init');
  console.error('');
  console.error('Sonra her deploy icin:');
  console.error('  node deploy.js');
  console.error('');
  process.exit(1);
}

function deploy() {
  ensureGitRepo();

  console.log('==========================================');
  console.log(` Deploy basladi: ${new Date().toLocaleString('tr-TR')}`);
  console.log(` Dizin: ${process.cwd()}`);
  console.log(` Branch: ${BRANCH}`);
  console.log('==========================================');

  console.log("[1/5] Git'ten son surum cekiliyor...");
  run(`git fetch origin ${BRANCH}`);
  run(`git checkout ${BRANCH}`);
  run(`git pull --ff-only origin ${BRANCH}`);

  console.log('[2/5] Bagimliliklar kuruluyor...');
  run('npm install');

  console.log('[3/5] Veritabani semasi guncelleniyor...');
  run('npm run db:push --workspace=backend');
  run('npm run db:generate --workspace=backend');

  console.log('[4/5] Frontend + backend build aliniyor...');
  run('npm run build');

  console.log('[5/5] API yeniden baslatiliyor...');
  if (pm2Exists()) {
    if (pm2AppRunning(PM2_APP)) {
      run(`pm2 restart ${PM2_APP}`);
    } else {
      console.log('PM2 uygulamasi bulunamadi, ilk kez baslatiliyor...');
      const serverPath = path.join(projectRoot, 'backend', 'server.js');
      if (!existsSync(serverPath)) {
        throw new Error(`server.js bulunamadi: ${serverPath}`);
      }
      run(`pm2 start server.js --name ${PM2_APP}`, {
        cwd: path.join(projectRoot, 'backend'),
      });
    }
    run('pm2 save');
  } else {
    console.log("UYARI: pm2 bulunamadi. API'yi elle yeniden baslatman gerekebilir.");
  }

  console.log('==========================================');
  console.log(' Deploy tamamlandi!');
  console.log('==========================================');
}

if (isInit) {
  initGitRepo();
} else {
  deploy();
}
