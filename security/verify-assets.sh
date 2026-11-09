#!/usr/bin/env bash
# SPDX-License-Identifier: 0BSD
# Read-only fail-closed artwork + tracked configuration preflight.
set -euo pipefail
IFS=$'\n\t'
cd "$(dirname "${BASH_SOURCE[0]}")/.."
asset_dir='public/downloads/pentagonal-xor-emblem'
test -r "$asset_dir/SHA256SUMS" || { echo 'Missing checksums' >&2; exit 1; }
for name in avatar black-white color poster-print reversed shirt-front; do
  test -s "$asset_dir/$name.svg" || exit 1
  test -s "$asset_dir/png/$name.png" || exit 1
  test -s "$asset_dir/jpeg/$name.jpg" || exit 1
done
(cd "$asset_dir" && sha256sum --check --strict SHA256SUMS)
if find "$asset_dir" -type l | grep -q .; then echo 'Unexpected symlink in assets' >&2; exit 1; fi
for asset in "$asset_dir"/*.svg; do xmllint --nonet --noout "$asset"; done
if [[ -f .env ]]; then
  while IFS= read -r line || [[ -n "$line" ]]; do
    [[ -z "$line" || "$line" == \#* ]] && continue
    if [[ ! "$line" =~ ^([A-Za-z_][A-Za-z_0-9]*)= ]]; then echo 'Malformed .env key' >&2; exit 1; fi
    key="${BASH_REMATCH[1]}"
    case "$key" in
      SUPABASE_PROJECT_ID|SUPABASE_PUBLISHABLE_KEY|SUPABASE_URL|VITE_SUPABASE_PROJECT_ID|VITE_SUPABASE_PUBLISHABLE_KEY|VITE_SUPABASE_URL) ;;
      *) echo "Disallowed tracked .env key: $key" >&2; exit 1 ;;
    esac
  done < .env
fi
if grep -REn '(^[[:space:]]*pull_request_target:|^[[:space:]]*permissions:[[:space:]]*write-all)' .github/workflows --include='*.yml' --include='*.yaml'; then
  echo 'Unsafe workflow trigger or token permission detected' >&2; exit 1
fi
echo 'PASS: SVG/PNG/JPEG inventory, SHA256, XML, symlink, .env key, workflow controls'
