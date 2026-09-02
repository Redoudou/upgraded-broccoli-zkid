// Level 1 stub: simulated wallet sheet, stub proof. M3 replaces with DC API + longfellow + wipe.
const nonce = new URLSearchParams(location.search).get('n');
const app = document.getElementById('app');
app.innerHTML = `<button id="go">Share age (simulated wallet sheet)</button>`;
document.getElementById('go').onclick = async () => {
  const root = (await (await fetch('/root')).text()).trim();          // fetched once, cached (figure 2 step 5)
  const proof = new TextEncoder().encode(`stub:${nonce}:${root}`);
  const r = await fetch('/proof', { method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ nonce, proof_b64: btoa(String.fromCharCode(...proof)) }) });
  app.textContent = (await r.json()).result === 'green' ? 'Accepted' : 'Rejected';
};
