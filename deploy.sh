#!/usr/bin/env bash
# Sunucuda: chmod +x deploy.sh && ./deploy.sh
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

if ! command -v node >/dev/null 2>&1; then
  echo "Hata: node bulunamadı. nvm veya Node.js kurulu olmalı."
  exit 1
fi

exec node deploy.js "$@"
