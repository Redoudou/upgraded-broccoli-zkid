// Copyright 2026 Green Light contributors. Apache-2.0.
// Verify service. Routes: POST /session, GET /session/:nonce, GET /qr/:nonce.svg, GET /events/:nonce (SSE),
// POST /proof, GET /root, GET /health, plus the desk screen (/) and prover page (/prove). Spec section 4.
import { createServer } from 'node:http';
import { readFileSync } from 'node:fs';
import { loadCertsDir } from '../../trust-list/src/certs.js';
import { SessionStore } from './session.js';
import { ProofStore } from './store.js';
import { LongfellowVerifier, StubVerifier } from './verifier.js';

const env = process.env;
const DEMO_LEVEL = env.DEMO_LEVEL ?? '2';
const PORT = Number(env.PORT ?? 8080);
const repo = rel => new URL(`../../../${rel}`, import.meta.url);
const ROOT = (env.TRUST_ROOT ?? read(repo('fixtures/root.txt'), 'no trust root configured (TRUST_ROOT or fixtures/root.txt); refusing to start')).trim();
const LEVELS = { 1: 'Level 1 — flow, proof stubbed', 2: 'Level 2 — real proof, test credential' };
const STATIC = {
  '/': ['packages/desk-screen/index.html', 'text/html'], '/desk.js': ['packages/desk-screen/desk.js', 'text/javascript'], '/desk.css': ['packages/desk-screen/desk.css', 'text/css'],
  '/prove': ['packages/prover-page/src/index.html', 'text/html'], '/prove/test-mdl.json': ['fixtures/test-mdl.json', 'application/json'],
  '/prove/longfellow.js': ['packages/circuits/longfellow.js', 'text/javascript'],
  '/prove/longfellow.wasm': ['packages/circuits/artifacts/longfellow.wasm', 'application/wasm'],
  '/prove/circuit-1.zst': ['packages/circuits/artifacts/circuit-1.zst', 'application/zstd'],
};
const TYPES = { js: 'text/javascript', css: 'text/css', html: 'text/html', json: 'application/json' };

function read(url, fatal) {
  try { return readFileSync(url, 'utf8'); } catch { console.error(fatal); process.exit(1); }
}
const sessions = new SessionStore();
const proofs = new ProofStore(env.DATA_FILE ?? repo('data/proofs.jsonl').pathname);
const verifier = DEMO_LEVEL === '1' ? new StubVerifier({ root: ROOT })
  : await LongfellowVerifier.create({ root: ROOT, iacaDers: loadCertsDir(env.CERTS_DIR ?? repo('fixtures/certs').pathname).map(c => c.der) });
const results = new Map();   // nonce -> { result, reason? }
const waiters = new Map();   // nonce -> Set<response> (SSE)

function json(res, code, body) { res.writeHead(code, { 'content-type': 'application/json', 'cache-control': 'no-store' }); res.end(JSON.stringify(body)); }
function file(res, rel, type) {
  try { const b = readFileSync(repo(rel)); res.writeHead(200, { 'content-type': type, 'cache-control': 'no-cache' }); res.end(b); }
  catch { json(res, 404, { error: 'not_found' }); }
}
async function body(req, limit = 2_000_000) {
  const chunks = []; let n = 0;
  for await (const c of req) { n += c.length; if (n > limit) throw new Error('too_large'); chunks.push(c); }
  return chunks.length ? JSON.parse(Buffer.concat(chunks)) : {};
}
function settle(nonce, outcome) {
  if (results.has(nonce)) return results.get(nonce);   // a replay or late submission never overwrites a shown result
  results.set(nonce, outcome);
  for (const res of waiters.get(nonce) ?? []) { res.write(`data: ${JSON.stringify(outcome)}\n\n`); res.end(); }
  waiters.delete(nonce);
  return outcome;
}
function proverUrl(req, nonce) {
  const base = env.PUBLIC_URL ?? `${req.headers['x-forwarded-proto'] ?? 'http'}://${req.headers['x-forwarded-host'] ?? req.headers.host}`;
  return `${base}/prove?n=${nonce}`;
}

async function handle(req, res) {
  const url = new URL(req.url, 'http://x');
  const [, route, arg] = url.pathname.match(/^\/([a-z]+)(?:\/([^/]+))?$/) ?? [];
  if (req.method === 'GET' && STATIC[url.pathname]) return file(res, ...STATIC[url.pathname]);
  if (req.method === 'GET' && route === 'prove' && arg && /^[a-z0-9.-]+$/i.test(arg)) return file(res, `packages/prover-page/src/${arg}`, TYPES[arg.split('.').pop()] ?? 'application/octet-stream');
  if (req.method === 'POST' && url.pathname === '/session') {
    const s = sessions.create();
    return json(res, 200, { ...s, url: proverUrl(req, s.nonce), demo_level: DEMO_LEVEL, label: LEVELS[DEMO_LEVEL] });
  }
  if (req.method === 'GET' && route === 'session' && arg) {
    const s = sessions.get(arg);
    return s ? json(res, 200, { now: s.now, expires_at: s.expires_at, demo_level: DEMO_LEVEL, label: LEVELS[DEMO_LEVEL] }) : json(res, 404, { error: 'session_unknown' });
  }
  if (req.method === 'GET' && route === 'qr' && arg?.endsWith('.svg')) {
    const { default: QRCode } = await import('qrcode');   // the one QR dependency; lazy so tests run without npm install
    const svg = await QRCode.toString(proverUrl(req, arg.slice(0, -4)), { type: 'svg', margin: 1, errorCorrectionLevel: 'M' });
    res.writeHead(200, { 'content-type': 'image/svg+xml', 'cache-control': 'no-store' }); return res.end(svg);
  }
  if (req.method === 'GET' && route === 'events' && arg) {
    res.writeHead(200, { 'content-type': 'text/event-stream', 'cache-control': 'no-store', connection: 'keep-alive' });
    const known = results.get(arg);
    if (known) { res.write(`data: ${JSON.stringify(known)}\n\n`); return res.end(); }
    res.write(`data: {"result":"waiting"}\n\n`);
    if (!waiters.has(arg)) waiters.set(arg, new Set());
    waiters.get(arg).add(res);
    const ping = setInterval(() => res.write(': ping\n\n'), 15_000);
    return req.on('close', () => { clearInterval(ping); waiters.get(arg)?.delete(res); });
  }
  if (req.method === 'POST' && url.pathname === '/proof') {
    const t0 = Date.now();
    const { nonce, proof_b64, issuer_cert_b64 } = await body(req);
    const c = sessions.consume(String(nonce ?? ''));
    if (!c.ok) { const o = settle(String(nonce), { result: 'red', reason: c.reason }); return json(res, 400, o); }
    const proof = Buffer.from(String(proof_b64 ?? ''), 'base64');
    const issuerCert = Buffer.from(String(issuer_cert_b64 ?? ''), 'base64');
    const v = verifier.verify({ proof, nonce, root: ROOT, date: c.session.now, issuerCert });
    if (!v.ok) { console.log(JSON.stringify({ event: 'red', reason: v.reason, ms: Date.now() - t0 })); return json(res, 400, settle(nonce, { result: 'red', reason: v.reason })); }
    const row = proofs.record(proof);
    console.log(JSON.stringify({ event: 'green', ...row, ms: Date.now() - t0 }));   // hash only; never the proof or the mdoc
    return json(res, 200, settle(nonce, { result: 'green' }));
  }
  if (req.method === 'GET' && url.pathname === '/root') { res.writeHead(200, { 'content-type': 'text/plain' }); return res.end(ROOT + '\n'); }
  if (url.pathname === '/favicon.ico') { res.writeHead(204); return res.end(); }
  if (req.method === 'GET' && url.pathname === '/health') return json(res, 200, { ok: true, demo_level: DEMO_LEVEL, root: ROOT, proofs: proofs.count() });
  json(res, 404, { error: 'not_found' });
}

const server = createServer((req, res) => handle(req, res).catch(e => { console.log(JSON.stringify({ event: 'error', message: e.message })); json(res, e.message === 'too_large' ? 413 : 400, { error: 'bad_request' }); }));
server.keepAliveTimeout = 70_000;   // a phone's connection stays usable across the whole 60 s session while it proves
server.listen(PORT, () => console.log(JSON.stringify({ event: 'listening', port: PORT, demo_level: DEMO_LEVEL, root: ROOT })));
setInterval(() => sessions.sweep(), 60_000).unref();
