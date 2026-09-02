#!/usr/bin/env bash
# Test F2 seed: fail if any source, log, or fixture outside fixtures/ contains PII-shaped fields. Extend in M2.
set -euo pipefail
cd "$(dirname "$0")/.."
pat='given_name|family_name|birth_date|resident_address|document_number|portrait'
if grep -rEn "$pat" packages deploy --include='*.js' --include='*.html' --include='*.yml' | grep -v node_modules; then
  echo "PII-shaped field referenced in code or config"; exit 1
fi
echo "pii-scan: clean"
