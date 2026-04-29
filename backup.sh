#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="$ROOT_DIR/.env"
SOURCE_PATHS="${SOURCE_PATHS:-$ROOT_DIR/src/app.js, $ROOT_DIR/scripts}"
CAPTION="project: rean-it-static-2 and url: https://github.com/HORKimhab/rean-it-com-static-2"

if [[ -f "$ENV_FILE" ]]; then
  set -a
  # Load local secrets for Telegram upload.
  . "$ENV_FILE"
  set +a
fi

: "${TELEGRAM_BOT_TOKEN:?TELEGRAM_BOT_TOKEN is required}"
: "${TELEGRAM_CHAT_ID:?TELEGRAM_CHAT_ID is required}"

trim() {
  local value="$1"
  value="${value#"${value%%[![:space:]]*}"}"
  value="${value%"${value##*[![:space:]]}"}"
  printf '%s' "$value"
}

cleanup_files=()

cleanup() {
  local file
  for file in "${cleanup_files[@]}"; do
    [[ -f "$file" ]] && rm -f "$file"
  done
}

trap cleanup EXIT

send_document() {
  local upload_path="$1"
  local upload_name="$2"

  curl -fsS "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendDocument" \
    -F "chat_id=${TELEGRAM_CHAT_ID}" \
    -F "caption=${CAPTION}" \
    -F "document=@${upload_path};filename=${upload_name}"

  echo "Uploaded ${upload_name} to Telegram."
}

compress_directory() {
  local source_dir="$1"
  local archive_path
  local archive_base
  archive_base="$(mktemp -t telegram-backup)"
  archive_path="${archive_base}.tar.gz"
  mv "$archive_base" "$archive_path"

  tar -czf "$archive_path" -C "$(dirname "$source_dir")" "$(basename "$source_dir")"
  cleanup_files+=("$archive_path")

  printf '%s' "$archive_path"
}

IFS=',' read -r -a raw_paths <<< "$SOURCE_PATHS"

for raw_path in "${raw_paths[@]}"; do
  source_path="$(trim "$raw_path")"

  if [[ -z "$source_path" ]]; then
    continue
  fi

  if [[ "$source_path" != /* ]]; then
    source_path="$ROOT_DIR/$source_path"
  fi

  if [[ -f "$source_path" ]]; then
    send_document "$source_path" "$(basename "$source_path")"
    continue
  fi

  if [[ -d "$source_path" ]]; then
    archive_path="$(compress_directory "$source_path")"
    send_document "$archive_path" "$(basename "$source_path").tar.gz"
    continue
  fi

  echo "Source path not found: $source_path" >&2
  exit 1
done
