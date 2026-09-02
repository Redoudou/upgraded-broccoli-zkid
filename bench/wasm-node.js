// Copyright 2026 Green Light contributors. Apache-2.0.
// Node/wasm leg of the M1 harness (tests C1-C6 need the phones). Proves the test mDL N times with the
// committed longfellow.wasm and circuit, cold start included, and writes bench/results/wasm-node.json.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createPrivateKey, randomBytes, sign } from 'node:crypto';
import { loadLongfellow } from '../packages/circuits/longfellow.js';
import { sessionTranscript, deviceAuthToSign, assembleDeviceResponse } from '../scripts/gen-test-mdl.js';

const N = Number(process.argv[2] ?? 5);
const mdl = JSON.parse(readFileSync('fixtures/test-mdl.json', 'utf8'));
const circuit = readFileSync('packages/circuits/artifacts/circuit-1.zst');
const attrs = mdl.attributes.map(a => ({ namespace: mdl.namespace, id: a.id, cbor: Buffer.from(a.cbor_hex, 'hex') }));
const key = createPrivateKey({ key: mdl.device_key_jwk, format: 'jwk' });
const now = new Date().toISOString().slice(0, 19) + 'Z';
const runs = [];
for (let run = 1; run <= N; run++) {
  const t = performance.now();
  let ok = true;
  try {
    const lf = await loadLongfellow(readFileSync('packages/circuits/artifacts/longfellow.wasm'));   // cold start every run (C5)
    const tr = sessionTranscript(randomBytes(16));
    const sig = sign('sha256', deviceAuthToSign(tr), { key, dsaEncoding: 'ieee-p1363' });
    const proof = lf.prove({ circuit, mdoc: assembleDeviceResponse(mdl, sig), pkx: mdl.issuer.pkx, pky: mdl.issuer.pky, transcript: tr, attrs, now });
    ok = lf.verify({ circuit, pkx: mdl.issuer.pkx, pky: mdl.issuer.pky, transcript: tr, attrs, now, proof }) === 0;
  } catch { ok = false; }
  runs.push({ run, ms: Math.round(performance.now() - t), peak_mb: Math.round(process.memoryUsage().rss / 1048576), ok });
  console.log(JSON.stringify(runs.at(-1)));
}
mkdirSync('bench/results', { recursive: true });
writeFileSync('bench/results/wasm-node.json', JSON.stringify(runs, null, 1));
