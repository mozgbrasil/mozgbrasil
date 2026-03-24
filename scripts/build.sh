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
check-only)
  npm run check
  ;;
all)
  npm run format:check
  npm run lint
  npm test
  ;;
*)
  echo "usage: bash scripts/build.sh [all|install-only|format-only|lint-only|test-only|check-only]" >&2
  exit 2
  ;;
esac

echo "OK: github-profile checks passed."
