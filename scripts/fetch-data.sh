#!/usr/bin/env bash
# ── 데이터 수집 배치 스크립트 ──────────────────────────────
# Node.js로 OpenRouter 랭킹 + AI 뉴스 RSS를 가져와서
# public/data/ 아래 JSON 파일로 저장합니다.
# GitHub Actions cron에서 실행됩니다.
#
# 사용법:
#   bash scripts/fetch-data.sh [--force]
#
# 요구사항: Node.js 18+

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "▶ Node.js 데이터 수집 스크립트 실행..."
node "$SCRIPT_DIR/fetch-data.mjs" "$@"
echo "✅ 완료"
