#!/usr/bin/env bash
set -euo pipefail

CHROME="${CHROME:-google-chrome}"
PORT="${PORT:-8123}"
OUT_DIR="cv"
BASE_URL="http://127.0.0.1:$PORT"
CHROME_FLAGS=(--headless=new --no-sandbox --disable-gpu --virtual-time-budget=15000)

python3 -m http.server "$PORT" --bind 127.0.0.1 >/dev/null 2>&1 &
SERVER_PID=$!
trap 'kill "$SERVER_PID"' EXIT

for _ in $(seq 1 50); do
  curl -sf "$BASE_URL/cv.html" >/dev/null && break
  sleep 0.2
done
curl -sf "$BASE_URL/cv.html" >/dev/null || { echo "O servidor local não respondeu em $BASE_URL." >&2; exit 1; }

mkdir -p "$OUT_DIR"

for lang in pt en; do
  url="$BASE_URL/cv.html?lang=$lang"
  output="$OUT_DIR/$lang.pdf"

  dom="$("$CHROME" "${CHROME_FLAGS[@]}" --dump-dom "$url")"
  [[ "$dom" == *'data-cv-ready="true"'* ]] || { echo "O currículo ($lang) não renderizou; abra $url para ver o erro." >&2; exit 1; }

  "$CHROME" "${CHROME_FLAGS[@]}" --no-pdf-header-footer --print-to-pdf="$output" "$url"
  [[ -s "$output" ]] || { echo "PDF não gerado: $output" >&2; exit 1; }
  echo "Gerado: $output"
done
