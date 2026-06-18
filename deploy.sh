#!/bin/bash
set -e

# TEK DOSYA DEPLOY - baska projede sadece AYARLAR bolumunu degistir
#
# Klasor yapisi:
#   admin.guzelteknoloji.com/
#     deploy.sh
#     repo/       <- git projesi
#     frontend/   <- nginx
#     backend/    <- PM2
#
# Calistirma:
#   chmod +x deploy.sh
#   ./deploy.sh

# --- AYARLAR ---
SITE="/home/guzelteknoloji-admin/htdocs/admin.guzelteknoloji.com"
PM2_NAME="guzelteknoloji-api"
GIT_BRANCH="main"
VITE_SITE_SLUG="demo"
# ---------------

echo ""
echo "=== DEPLOY BASLIYOR ==="
echo ""

if [ ! -d "$SITE/repo/.git" ]; then
  echo "HATA: $SITE/repo klasorunde git projesi yok."
  echo "  cd $SITE"
  echo "  git clone https://github.com/Barand1500/AdminPanel-Continue.git repo"
  exit 1
fi

cd "$SITE/repo"
git pull origin "$GIT_BRANCH"
echo "[1/5] Git pull tamam"

cd "$SITE/repo"
npm install
echo "[2/5] npm install tamam"

cd "$SITE/repo"
npm run build --workspace=backend
rsync -a --delete \
  --exclude='node_modules' \
  --exclude='.env' \
  --exclude='uploads' \
  "$SITE/repo/backend/" "$SITE/backend/"
echo "[3/5] Backend build & kopyalandi"

cd "$SITE/repo"
VITE_API_URL=/api VITE_SITE_SLUG="$VITE_SITE_SLUG" npm run build --workspace=frontend
rsync -a --delete "$SITE/repo/frontend/dist/" "$SITE/frontend/"
echo "[4/5] Frontend build & kopyalandi"

cd "$SITE/backend"
npm install --omit=dev
npx prisma generate
pm2 restart "$PM2_NAME" 2>/dev/null || pm2 start ecosystem.config.cjs
echo "[5/5] PM2 restart tamam"

echo ""
echo "=== DEPLOY TAMAMLANDI ==="
echo ""
