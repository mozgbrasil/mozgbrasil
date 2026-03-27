#!/usr/bin/env bash
set -euo pipefail

phase="${1:-all}"
exec bash scripts/build.sh "$phase"
