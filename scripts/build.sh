#!/usr/bin/env bash
set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

PHASE="${1:-all}"

echo "== github-profile build =="

case "$PHASE" in
install-only)
  npm install
  ;;
format-only)
  npm run format:check
  ;;
lint-only)
  npm run lint
  ;;
test-only)
  npm test
  ;;
surface-only)
  npm run surface:json >/dev/null
  npm run surface:links >/dev/null
  npm run surface:links:ndjson >/dev/null
  ;;
ready-only)
  npm run surface:ready >/dev/null
  ;;
check-only)
  npm run check
  ;;
all)
  npm run format:check
  npm run lint
  npm test
  npm run surface:json >/dev/null
  npm run surface:ready >/dev/null
  ;;
*)
  echo "usage: bash scripts/build.sh [all|install-only|format-only|lint-only|test-only|surface-only|ready-only|check-only]" >&2
  exit 2
  ;;
esac

echo "OK: github-profile checks passed."
