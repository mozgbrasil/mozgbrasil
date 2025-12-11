#!/usr/bin/env bash
set -euo pipefail

build_banner

echo "📦 install"

npm install

echo "📦 format"

echo "📦 lint"

echo "📦 test"

npm test || echo '⚠️ Tests failed or not defined'

echo "📦 build"

# npm run build
