// Copyright 2026 Green Light contributors. Apache-2.0.
// Desk screen: new session -> QR -> wait for the verify service to push green or red (SSE, test A8) -> repeat.
const $ = id => document.getElementById(id);
const sleep = ms => new Promise(r => setTimeout(r, ms));
const REASONS = {
  session_expired: 'The QR expired before the proof arrived. Scan the new one.',
  session_used: 'This QR was already used. Scan the new one.',
  session_unknown: 'Unknown session. Scan the new QR.',
  proof_invalid: 'The proof did not verify.',
  issuer_not_trusted: 'The license was not signed by a DMV on the trust list.',
  issuer_cert_invalid: 'The issuer certificate could not be read.',
  root_mismatch: 'Trust root mismatch.',
  nonce_mismatch: 'The proof was made for a different session.',
};
function show(cls, headline, detail = '') { $('state').className = cls; $('headline').textContent = headline; $('detail').textContent = detail; }

async function run() {
  let s;
  try { s = await (await fetch('/session', { method: 'POST' })).json(); }
  catch { show('red', 'Verify service unreachable', 'Retrying…'); await sleep(3000); return run(); }
  $('level').textContent = s.label;
  $('qr').src = `/qr/${s.nonce}.svg`; $('qr').hidden = false;
  $('link').href = s.url; $('link').textContent = s.url;
  show('wait', 'Waiting', 'Scan the QR with your phone.');
  const tick = setInterval(() => { $('ttl').textContent = Math.max(0, Math.ceil((s.expires_at - Date.now()) / 1000)) + ' s'; }, 250);

  await new Promise(resolve => {
    const es = new EventSource(`/events/${s.nonce}`);
    const done = async (ms) => { es.close(); await sleep(ms); resolve(); };
    es.onmessage = e => {
      const r = JSON.parse(e.data);
      if (r.result === 'waiting') return;
      if (r.result === 'green') show('green', 'OK — over 21', 'Valid license from a DMV on the trust list. Nothing else was learned.');
      else show('red', 'Not accepted', REASONS[r.reason] ?? `Reason: ${r.reason}`);
      done(7000);
    };
    es.onerror = () => done(1000);
    setTimeout(() => done(0), Math.max(0, s.expires_at - Date.now()));
  });
  clearInterval(tick);
  run();
}
run();
