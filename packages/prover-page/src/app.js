// Copyright 2026 Green Light contributors. Apache-2.0.
// Prover page: QR opens it with ?n=<nonce>; a simulated wallet sheet stands in for the OS wallet
// (a state-issued mDL needs a registered relying party); the proof is made in worker.js and uploaded.
const $ = id => document.getElementById(id);
const nonce = new URLSearchParams(location.search).get('n');
const STEPS = ['Loading prover', 'Signing session with the device key', 'Proving on this device', 'Uploading proof', 'Wiping credential from this page'];
let session, worker, t0, ticker;

function fail(headline, detail) {
  $('intro').hidden = true; $('progress').hidden = true; $('result').hidden = false; $('result').className = 'card red';
  $('verdict').textContent = headline; $('verdict-detail').textContent = detail; $('timing').textContent = '';
}
function step(text) {
  const items = [...$('steps').children];
  const i = STEPS.indexOf(text);
  items.forEach((li, k) => { li.className = k < i ? 'done' : k === i ? 'active' : ''; });
}

async function init() {
  if (!nonce) return fail('No session', 'Open this page by scanning the QR on the desk screen.');
  let r;
  try { r = await fetch(`/session/${encodeURIComponent(nonce)}`); }
  catch { return fail('Verify service unreachable', 'The desk is offline. Nothing was sent.'); }
  if (!r.ok) return fail('Session expired', 'Ask the desk for a fresh QR. Sessions last 60 seconds and are single use.');
  session = await r.json();
  $('level').textContent = session.label;
  $('session').textContent = `Session valid for ${Math.max(0, Math.round((session.expires_at - Date.now()) / 1000))} s.`;
  const mdl = await (await fetch('/prove/test-mdl.json')).json();
  $('cred-sub').textContent = `${mdl.issuer.subject.split('CN=')[1] ?? 'test issuer'} · valid until ${mdl.validity.validUntil.slice(0, 10)}`;
  $('steps').replaceChildren(...STEPS.map(s => Object.assign(document.createElement('li'), { textContent: s })));
  $('go').disabled = false;
}

$('go').onclick = () => { $('sheet').hidden = false; };
$('cancel').onclick = () => { $('sheet').hidden = true; };
$('continue').onclick = () => { $('sheet').hidden = true; $('intro').hidden = true; $('progress').hidden = false; prove(); };

async function prove() {
  if (session.demo_level === '1') return upload({ proof_b64: btoa(`stub:${nonce}:${(await (await fetch('/root')).text()).trim()}`), issuer_cert_b64: '', ms: 0 });
  worker = new Worker('/prove/worker.js', { type: 'module' });
  t0 = performance.now();
  ticker = setInterval(() => { $('timer').textContent = `${((performance.now() - t0) / 1000).toFixed(1)} s`; }, 100);
  worker.onmessage = ({ data }) => {
    if (data.type === 'status') step(data.text);
    else if (data.type === 'done') upload(data);
    else { clearInterval(ticker); worker.terminate(); fail('Could not prove', data.message); }
  };
  worker.onerror = e => { clearInterval(ticker); worker.terminate(); fail('Prover crashed', e.message ?? 'worker error'); };
  worker.postMessage({ nonce, now: session.now });
}

async function upload({ proof_b64, issuer_cert_b64, ms }) {
  step('Uploading proof');
  let r, body;
  try {
    r = await fetch('/proof', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ nonce, proof_b64, issuer_cert_b64 }) });
    body = await r.json();
  } catch { body = { result: 'red', reason: 'verify service unreachable' }; }
  step('Wiping credential from this page');
  const proofBytes = Math.round((proof_b64?.length ?? 0) * 3 / 4);
  worker?.terminate(); worker = null; proof_b64 = null;   // the worker zeroed its buffers; terminating frees the wasm heap
  clearInterval(ticker);
  $('progress').hidden = true; $('result').hidden = false;
  const ok = body.result === 'green';
  $('result').className = `card ${ok ? 'green' : 'red'}`;
  $('verdict').textContent = ok ? 'Accepted' : 'Not accepted';
  $('verdict-detail').textContent = ok ? 'The desk is green. It learned that you are over 21 with a valid license from a trusted DMV, and nothing else.' : `Reason: ${body.reason}`;
  $('timing').textContent = ms ? `Proof generated on this device in ${(ms / 1000).toFixed(1)} s, ${Math.round(proofBytes / 1024)} KB. Credential wiped.` : '';
}

init();
