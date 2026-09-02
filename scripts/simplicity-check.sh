#!/usr/bin/env bash
# Enforces the numeric budgets in docs/SIMPLICITY.md. Fails CI when the program grows past the spec.
set -euo pipefail
cd "$(dirname "$0")/.."
fail=0
say() { printf '%-42s %6s / %-6s %s\n' "$1" "$2" "$3" "$4"; }

lines=$(cat packages/verify-service/src/*.js | grep -vE '^\s*(//|$)' | wc -l | tr -d ' ')
if [ "$lines" -gt 300 ]; then say "verify-service source lines" "$lines" 300 FAIL; fail=1; else say "verify-service source lines" "$lines" 300 ok; fi

deps=$(node -e 'const p=require("./packages/verify-service/package.json");console.log(Object.keys(p.dependencies||{}).length)')
if [ "$deps" -gt 2 ]; then say "verify-service runtime dependencies" "$deps" 2 FAIL; fail=1; else say "verify-service runtime dependencies" "$deps" 2 ok; fi

pkgs=$(find packages -mindepth 1 -maxdepth 1 -type d | wc -l | tr -d ' ')
if [ "$pkgs" -gt 6 ]; then say "packages" "$pkgs" 6 FAIL; fail=1; else say "packages" "$pkgs" 6 ok; fi

compose=$(find deploy -name '*.yml' -o -name '*.yaml' | wc -l | tr -d ' ')
if [ "$compose" -gt 1 ]; then say "compose files" "$compose" 1 FAIL; fail=1; else say "compose files" "$compose" 1 ok; fi

ts=$(find packages -name '*.ts' -not -path '*/node_modules/*' | wc -l | tr -d ' ')
if [ "$ts" -gt 0 ]; then say "TypeScript files" "$ts" 0 FAIL; fail=1; else say "TypeScript files" "$ts" 0 ok; fi

# grep exits 1 on no match; under pipefail that would abort the script, so tolerate it.
fw=$({ grep -lE '"(jest|mocha|vitest|react|vue|svelte|express|fastify|nest|prisma|typeorm|sequelize)"' packages/*/package.json 2>/dev/null || true; } | wc -l | tr -d ' ')
if [ "$fw" -gt 0 ]; then say "framework dependencies" "$fw" 0 FAIL; fail=1; else say "framework dependencies" "$fw" 0 ok; fi

[ "$fail" -eq 0 ] && echo "simplicity-check: within budget" || { echo "simplicity-check: over budget; raise the limit in docs/SIMPLICITY.md with a reason, or remove code"; exit 1; }
