#!/usr/bin/env bash
set -euo pipefail

APP_DIR="/opt/tekstura"
SERVICE_NAME="tekstura.service"
APP_PORT="3001"
APP_STARTUP_TIMEOUT_SEC="60"
SERVICE_WAS_ACTIVE="0"

on_error() {
  echo "Deployment failed. Showing diagnostics for ${SERVICE_NAME}..."
  systemctl --no-pager --full status "$SERVICE_NAME" || true
  journalctl -u "$SERVICE_NAME" --since "-10 min" --no-pager || true

  if [[ "${SERVICE_WAS_ACTIVE}" == "1" ]]; then
    echo "Attempting to bring ${SERVICE_NAME} back after failed deploy..."
    systemctl restart "$SERVICE_NAME" || true
    systemctl --no-pager --full status "$SERVICE_NAME" || true
  fi
}
trap on_error ERR

fail_deploy() {
  echo "$1"
  on_error
  exit 1
}

read_env_value() {
  local key="$1"
  if [[ ! -f .env ]]; then
    return 0
  fi

  grep -E "^[[:space:]]*${key}=" .env | tail -n 1 | cut -d'=' -f2- | tr -d "\"'[:space:]"
}

set_env_value() {
  local key="$1"
  local value="$2"

  if grep -qE "^[[:space:]]*${key}=" .env; then
    sed -i "s|^[[:space:]]*${key}=.*|${key}=\"${value}\"|" .env
  else
    echo "${key}=\"${value}\"" >>.env
  fi
}

cd "$APP_DIR"

mkdir -p uploads
touch .env

if systemctl is-active --quiet "$SERVICE_NAME"; then
  SERVICE_WAS_ACTIVE="1"
fi

# Stop service before reinstalling node_modules to avoid restart loops on half-installed deps.
systemctl stop "$SERVICE_NAME" || true
systemctl reset-failed "$SERVICE_NAME" || true

npm ci --include=dev
npm run db:generate
npm run build

if command -v sqlite3 >/dev/null 2>&1; then
  npm run db:push
else
  echo "sqlite3 CLI is not installed; skipping db:push. Existing DB file must already be present."
fi

jwt_secret="$(read_env_value JWT_SECRET)"
if [[ -z "${jwt_secret}" || "${jwt_secret}" == "tekstura-local-secret" ]]; then
  if command -v openssl >/dev/null 2>&1; then
    generated_jwt_secret="$(openssl rand -hex 32)"
  elif command -v node >/dev/null 2>&1; then
    generated_jwt_secret="$(node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))")"
  else
    fail_deploy "Cannot generate JWT_SECRET: neither openssl nor node is available."
  fi

  set_env_value "JWT_SECRET" "${generated_jwt_secret}"
  chmod 600 .env || true
  echo "JWT_SECRET was missing/default and has been generated automatically."
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

env_port="$(read_env_value PORT)"
if [[ -n "${env_port}" ]]; then
  APP_PORT="${env_port}"
fi

if command -v curl >/dev/null 2>&1; then
  HEALTHCHECK_URL="http://127.0.0.1:${APP_PORT}/"
  healthcheck_ok=0

  for _ in $(seq 1 "${APP_STARTUP_TIMEOUT_SEC}"); do
    if curl -sS "$HEALTHCHECK_URL" >/dev/null; then
      healthcheck_ok=1
      break
    fi

    if ! systemctl is-active --quiet "$SERVICE_NAME"; then
      fail_deploy "Healthcheck failed: ${SERVICE_NAME} is not active."
    fi

    sleep 1
  done

  if [[ "$healthcheck_ok" -ne 1 ]]; then
    fail_deploy "Healthcheck failed: backend is not reachable on ${HEALTHCHECK_URL} after ${APP_STARTUP_TIMEOUT_SEC}s."
  fi
else
  echo "curl is not installed; skipping HTTP healthcheck."
fi
