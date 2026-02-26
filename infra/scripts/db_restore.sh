#!/usr/bin/env bash
set -euo pipefail
if [ -z "${1:-}" ]; then
  echo "Uso: ./db_restore.sh <archivo.sql>"
  exit 1
fi
: "${MYSQL_ROOT_PASSWORD:=root}"
cat "$1" | docker compose exec -T mysql mysql -uroot -p"$MYSQL_ROOT_PASSWORD" soporte2026
