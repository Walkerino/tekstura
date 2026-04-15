#!/usr/bin/env bash
set -euo pipefail

APP_DIR="/opt/tekstura"
SERVICE_NAME="tekstura.service"
APP_PORT="3001"

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

if [[ -f .env ]]; then
  env_port="$(grep -E '^[[:space:]]*PORT=' .env | tail -n 1 | cut -d'=' -f2- | tr -d "\"'[:space:]")"
  if [[ -n "${env_port}" ]]; then
    APP_PORT="${env_port}"
  fi
fi

if command -v curl >/dev/null 2>&1; then
  HEALTHCHECK_URL="http://127.0.0.1:${APP_PORT}/"
  healthcheck_ok=0

  for _ in $(seq 1 30); do
    if curl -fsS "$HEALTHCHECK_URL" >/dev/null; then
      healthcheck_ok=1
      break
    fi

    if ! systemctl is-active --quiet "$SERVICE_NAME"; then
      echo "Healthcheck failed: ${SERVICE_NAME} is not active."
      exit 1
    fi

    sleep 1
  done

  if [[ "$healthcheck_ok" -ne 1 ]]; then
    echo "Healthcheck failed: backend is not reachable on ${HEALTHCHECK_URL} after 30s."
    exit 1
  fi
else
  echo "curl is not installed; skipping HTTP healthcheck."
fi
