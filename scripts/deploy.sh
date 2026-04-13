#!/usr/bin/env bash
set -euo pipefail

APP_DIR="/opt/tekstura"
SERVICE_NAME="tekstura.service"

cd "$APP_DIR"

mkdir -p uploads

npm ci
npm run build

if command -v sqlite3 >/dev/null 2>&1; then
  npm run db:push
fi

cat >/etc/systemd/system/${SERVICE_NAME} <<'UNIT'
[Unit]
Description=Tekstura Fastify App
After=network.target

[Service]
Type=simple
WorkingDirectory=/opt/tekstura
Environment=NODE_ENV=production
EnvironmentFile=-/opt/tekstura/.env
ExecStart=/usr/bin/env npm run start
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
UNIT

systemctl daemon-reload
systemctl enable "$SERVICE_NAME"
systemctl restart "$SERVICE_NAME"
systemctl --no-pager --full status "$SERVICE_NAME" | head -n 30
