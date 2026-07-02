#!/usr/bin/env bash
# Tears down the entire local environment brought up by `npm run up`:
#   1. stops the PostgreSQL container (docker compose down)
#   2. frees the backend (3000) and frontend (5173) ports
#   3. kills any lingering nest/vite dev processes scoped to this repo
#
# Safe to run repeatedly; missing processes/containers are ignored.
set -uo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
repo_root="$(dirname "$script_dir")"
backend_dir="$repo_root/backend-services/profiles-service"

backend_port="${BACKEND_PORT:-3000}"
frontend_port="${FRONTEND_PORT:-5173}"

kill_port() {
  local port="$1"
  local pids
  pids="$(lsof -ti "tcp:$port" 2>/dev/null || true)"
  if [[ -z "$pids" ]]; then
    echo "  port $port: nothing listening"
  else
    kill -9 $pids 2>/dev/null || true
    echo "  port $port: killed $(echo "$pids" | tr '\n' ' ')"
  fi
}

echo "▶ Stopping PostgreSQL (docker compose down)…"
(cd "$backend_dir" && docker compose down) || true

echo "▶ Freeing dev ports…"
kill_port "$backend_port"
kill_port "$frontend_port"

echo "▶ Killing lingering dev processes for this repo…"
# Scope patterns to this repo path so unrelated node processes are never touched.
pkill -9 -f "$repo_root/backend-services/profiles-service.*nest" 2>/dev/null || true
pkill -9 -f "$repo_root/frontend-application/profiles-app.*vite" 2>/dev/null || true

echo "✔ Environment down."
