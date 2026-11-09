#!/bin/bash
set -euo pipefail

APP_NAME="Perpustakaan Poin"
APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
HOST="127.0.0.1"
PORT="5000"
URL="http://$HOST:$PORT/index.html"
PID_FILE="$APP_DIR/server.pid"
LOG_FILE="$APP_DIR/server.log"
PROFILE_DIR="$HOME/.config/perpustakaan-poin-browser"

cd "$APP_DIR"

is_ready() {
  python3 - "$URL" <<'PY'
import sys, urllib.request
url = sys.argv[1]
try:
    with urllib.request.urlopen(url, timeout=2) as r:
        data = r.read(65536).decode("utf-8", "ignore")
    raise SystemExit(0 if "Perpustakaan Poin" in data else 1)
except Exception:
    raise SystemExit(1)
PY
}

port_in_use() {
  python3 - "$HOST" "$PORT" <<'PY'
import socket, sys
host, port = sys.argv[1], int(sys.argv[2])
s = socket.socket()
s.settimeout(0.5)
try:
    s.connect((host, port))
    print("yes")
except Exception:
    print("no")
finally:
    s.close()
PY
}

if is_ready; then
  :
else
  if [ "$(port_in_use)" = "yes" ]; then
    echo "Port $PORT sudah dipakai proses lain dan bukan $APP_NAME." >&2
    exit 1
  fi

  nohup python3 -m http.server "$PORT" --bind "$HOST" --directory "$APP_DIR" >"$LOG_FILE" 2>&1 &
  echo $! > "$PID_FILE"

  READY=0
  for _ in $(seq 1 20); do
    if is_ready; then
      READY=1
      break
    fi
    sleep 0.5
  done

  if [ "$READY" -ne 1 ]; then
    echo "Server gagal dijalankan. Periksa: $LOG_FILE" >&2
    exit 1
  fi
fi

CHROME="$(command -v chromium || command -v chromium-browser || command -v google-chrome-stable || command -v google-chrome || true)"
if [ -z "$CHROME" ]; then
  echo "Chromium/Chrome belum terinstal." >&2
  exit 1
fi

exec "$CHROME" \
  --app="$URL" \
  --new-window \
  --class="perpustakaan-poin" \
  --name="perpustakaan-poin" \
  --user-data-dir="$PROFILE_DIR" \
  --no-first-run \
  --no-default-browser-check \
  >/dev/null 2>&1
