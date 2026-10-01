#!/bin/bash
# Runs on the production server; scripts/deploy.sh calls it over SSH.
set -euo pipefail
cd "$(dirname "$0")"

echo "Pulling latest code..."
git pull --ff-only

echo "Installing dependencies..."
# ci installs exactly what package-lock.json lists and never rewrites it.
npm ci

echo "Backing up database..."
DB=$(grep -E '^DATABASE_URL=' .env | cut -d= -f2- | tr -d "\"'" | sed 's/^file://')
BACKUP_DIR="$HOME/backups/chancecms"
mkdir -p "$BACKUP_DIR"
sqlite3 "$DB" ".backup '$BACKUP_DIR/chasingachance-$(date -u +%Y%m%dT%H%M%SZ).db'"
# Keep the 10 most recent deploy backups.
ls -1t "$BACKUP_DIR"/chasingachance-*.db | tail -n +11 | xargs -r rm --

echo "Running migrations..."
npx payload migrate

echo "Generating types..."
npm run generate:types

echo "Building..."
npm run build

echo "Restarting app..."
pm2 restart chancecms

echo "Done!"
