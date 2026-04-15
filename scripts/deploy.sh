#!/usr/bin/env bash
set -euo pipefail

APP_DIR="/opt/tekstura"
SERVICE_NAME="tekstura.service"

on_error() {
  echo "Deployment failed. Showing diagnostics for ${SERVICE_NAME}..."
  systemctl --no-pager --full status "$SERVICE_NAME" || true
  journalctl -u "$SERVICE_NAME" -n 120 --no-pager || true
}
trap on_error ERR

cd "$APP_DIR"

mkdir -p uploads

npm ci
npm run build

if command -v sqlite3 >/dev/null 2>&1; then
  npm run db:push
else
  echo "sqlite3 CLI is not installed; skipping db:push. Existing DB file must already be present."
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

if command -v curl >/dev/null 2>&1; then
  if ! curl -fsS "http://127.0.0.1:3001/" >/dev/null; then
    echo "Healthcheck failed: backend is not reachable on 127.0.0.1:3001"
    exit 1
  fi
else
  echo "curl is not installed; skipping HTTP healthcheck."
fi
