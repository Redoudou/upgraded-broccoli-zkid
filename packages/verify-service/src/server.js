// Copyright 2026 Green Light contributors. Apache-2.0.
// Verify service, level 1. HTTP + websocket-less long-poll for now; websocket lands in M2.
// Routes: POST /session -> {nonce, expires_at, url}; POST /proof {nonce, proof_b64} -> green|red; GET /result/:nonce
import { createServer } from 'node:http';
import { readFileSync } from 'node:fs';
import { SessionStore } from './session.js';
import { ProofStore } from './store.js';
import { StubVerifier } from './verifier.js';

const DEMO_LEVEL = process.env.DEMO_LEVEL ?? '1';
const PORT = Number(process.env.PORT ?? 8080);
const PROVER_URL = process.env.PROVER_URL ?? `http://localhost:${PORT}/prove`;
const ROOT = process.env.TRUST_ROOT ?? readRoot();

function serve(res, rel, type) {
  try { const b = readFileSync(new URL(rel, import.meta.url)); res.writeHead(200, { 'content-type': type }); res.end(b); }
  catch { json(res, 404, { error: 'not_found' }); }
}

function readRoot() {
  try { return readFileSync(new URL('../../../fixtures/root.txt', import.meta.url), 'utf8').trim(); }
  catch { console.error('no trust root configured (TRUST_ROOT or fixtures/root.txt); refusing to start'); process.exit(1); }
}

const sessions = new SessionStore();
const proofs = new ProofStore();
const verifier = new StubVerifier({ root: ROOT });
const results = new Map();

function json(res, code, body) {
  res.writeHead(code, { 'content-type': 'application/json' });
  res.end(JSON.stringify(body));
}

async function body(req) {
  let s = ''; for await (const c of req) s += c; return s ? JSON.parse(s) : {};
}

createServer(async (req, res) => {
  const url = new URL(req.url, 'http://x');
  if (req.method === 'POST' && url.pathname === '/session') {
    const s = sessions.create();
    return json(res, 200, { ...s, url: `${PROVER_URL}?n=${s.nonce}`, demo_level: DEMO_LEVEL });
  }
  if (req.method === 'POST' && url.pathname === '/proof') {
    const { nonce, proof_b64 } = await body(req);
    const c = sessions.consume(nonce);
    // A replay or late submission must not overwrite a result already shown on the desk.
    if (!c.ok) { if (!results.has(nonce)) results.set(nonce, { result: 'red', reason: c.reason }); return json(res, 400, { result: 'red', reason: c.reason }); }
    const proof = Buffer.from(proof_b64 ?? '', 'base64');
    const v = verifier.verify({ proof, nonce, root: ROOT, date: new Date().toISOString().slice(0, 10) });
    if (!v.ok) { results.set(nonce, { result: 'red', reason: v.reason }); return json(res, 400, { result: 'red', reason: v.reason }); }
    const row = proofs.record(proof);
    results.set(nonce, { result: 'green' });
    // Log contains the hash only. Never the proof, never the mdoc.
    console.log(JSON.stringify({ event: 'green', ...row }));
    return json(res, 200, { result: 'green' });
  }
  if (req.method === 'GET' && url.pathname === '/root') { res.writeHead(200, { 'content-type': 'text/plain' }); return res.end(ROOT + '\n'); }
  if (req.method === 'GET' && (url.pathname === '/' || url.pathname === '/index.html')) return serve(res, '../../desk-screen/index.html', 'text/html');
  if (req.method === 'GET' && url.pathname === '/prove') return serve(res, '../../prover-page/src/index.html', 'text/html');
  if (req.method === 'GET' && url.pathname === '/app.js') return serve(res, '../../prover-page/src/app.js', 'text/javascript');
  if (req.method === 'GET' && url.pathname.startsWith('/result/')) {
    const nonce = url.pathname.slice('/result/'.length);
    return json(res, 200, results.get(nonce) ?? { result: 'waiting' });
  }
  json(res, 404, { error: 'not_found' });
}).listen(PORT, () => console.log(`verify-service level ${DEMO_LEVEL} on :${PORT}`));

setInterval(() => sessions.sweep(), SESSION_SWEEP_MS()).unref();
function SESSION_SWEEP_MS() { return 60_000; }
