#!/usr/bin/env bash
set -euo pipefail
: "${MYSQL_ROOT_PASSWORD:=root}"
docker compose exec -T mysql mysqldump -uroot -p"$MYSQL_ROOT_PASSWORD" soporte2026 > backup_$(date +%F_%H%M%S).sql
