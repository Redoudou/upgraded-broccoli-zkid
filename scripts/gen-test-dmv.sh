#!/usr/bin/env bash
# Generate a TEST DMV issuer (IACA) P-256 key + self-signed cert and a placeholder test mDL.
# Never a real credential. Output goes to fixtures/. Re-runnable. Spec section 6a.
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p fixtures/certs
openssl ecparam -name prime256v1 -genkey -noout -out fixtures/test-dmv.key 2>/dev/null
openssl req -new -x509 -key fixtures/test-dmv.key -sha256 -days 365 \
  -subj "/C=US/ST=Test/O=Green Light Test DMV/CN=TEST IACA - NOT A REAL ISSUER" \
  -out fixtures/certs/test-dmv.pem 2>/dev/null
# Test mDL claims (the fields the circuit sees). CBOR/MSO encoding of a real mdoc lands in M2 with a proper library.
cat > fixtures/test-mdl.json <<'J'
{ "docType": "org.iso.18013.5.1.mDL", "issuer": "TEST IACA - NOT A REAL ISSUER",
  "claims": { "age_over_21": true, "expiry_date": "2030-01-01" },
  "note": "Test credential. Fields deliberately limited to what the circuit proves." }
J
node packages/trust-list/src/cli.js fixtures/certs > fixtures/root.txt
echo "test DMV cert: fixtures/certs/test-dmv.pem"
echo "trust root:    $(cat fixtures/root.txt)"
