#!/usr/bin/env bash
# Copyright 2026 Green Light contributors. Apache-2.0.
# Generate the TEST DMV: an IACA root (P-256, self-signed), a document-signer (DS) certificate issued
# by it, a test mDL signed by the DS key, and the trust-list root over fixtures/certs/. Never a real
# credential or a real issuer. Re-runnable; private keys land in fixtures/*.key (gitignored).
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p fixtures/certs
days=3650
subj_iaca="/C=US/ST=Test/O=Green Light Test DMV/CN=TEST IACA - NOT A REAL ISSUER"
subj_ds="/C=US/ST=Test/O=Green Light Test DMV/CN=TEST Document Signer - NOT A REAL ISSUER"

# IACA: the trust-list leaf (what AAMVA's VICAL would list for a real DMV).
openssl ecparam -name prime256v1 -genkey -noout -out fixtures/test-dmv-iaca.key 2>/dev/null
openssl req -new -x509 -key fixtures/test-dmv-iaca.key -sha256 -days $days -subj "$subj_iaca" \
  -addext "basicConstraints=critical,CA:TRUE,pathlen:0" -addext "keyUsage=critical,keyCertSign,cRLSign" \
  -out fixtures/certs/test-dmv-iaca.pem 2>/dev/null

# DS: signs the MSO. Extended key usage 1.0.18013.5.1.2 is the ISO 18013-5 mDL document signer OID.
openssl ecparam -name prime256v1 -genkey -noout -out fixtures/test-dmv-ds.key 2>/dev/null
openssl req -new -key fixtures/test-dmv-ds.key -sha256 -subj "$subj_ds" -out fixtures/test-dmv-ds.csr 2>/dev/null
ext=$(mktemp); printf 'basicConstraints=critical,CA:FALSE\nkeyUsage=critical,digitalSignature\nextendedKeyUsage=1.0.18013.5.1.2\n' > "$ext"
openssl x509 -req -in fixtures/test-dmv-ds.csr -CA fixtures/certs/test-dmv-iaca.pem -CAkey fixtures/test-dmv-iaca.key \
  -CAcreateserial -sha256 -days $days -extfile "$ext" -out fixtures/test-dmv-ds.pem 2>/dev/null
rm -f "$ext" fixtures/test-dmv-ds.csr fixtures/certs/*.srl

# The signed test mDL (IssuerSigned + test device key) and the trust-list root over fixtures/certs/.
node scripts/gen-test-mdl.js fixtures/test-dmv-ds.key fixtures/test-dmv-ds.pem fixtures/test-mdl.json
node packages/trust-list/src/cli.js fixtures/certs > fixtures/root.txt
echo "IACA (trust-list leaf): fixtures/certs/test-dmv-iaca.pem"
echo "DS certificate:         fixtures/test-dmv-ds.pem"
echo "trust root:             $(cat fixtures/root.txt)"
