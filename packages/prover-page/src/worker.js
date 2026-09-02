// Copyright 2026 Green Light contributors. Apache-2.0.
// Proving worker: holds the test credential, signs the session transcript with the device key, runs the
// longfellow-zk prover (wasm), hands the proof back, and wipes everything it touched. Terminated by app.js.
import { loadLongfellow } from '/prove/longfellow.js';
import { assembleDeviceResponse, b64, b64urlToBytes, deviceAuthToSign, hex, sessionTranscript } from '/prove/mdoc.js';

const status = text => postMessage({ type: 'status', text });
const fetchBytes = async url => { const r = await fetch(url); if (!r.ok) throw new Error(`${url}: ${r.status}`); return new Uint8Array(await r.arrayBuffer()); };

onmessage = async ({ data: { nonce, now } }) => {
  let mdl, mdoc, key;
  try {
    status('Loading prover');
    const [wasm, circuit, mdlJson] = await Promise.all([fetchBytes('/prove/longfellow.wasm'), fetchBytes('/prove/circuit-1.zst'), fetch('/prove/test-mdl.json').then(r => r.json())]);
    mdl = mdlJson;
    const lf = await loadLongfellow(wasm);

    status('Signing session with the device key');
    const transcript = sessionTranscript(b64urlToBytes(nonce));
    key = await crypto.subtle.importKey('jwk', mdl.device_key_jwk, { name: 'ECDSA', namedCurve: 'P-256' }, false, ['sign']);
    const sig = new Uint8Array(await crypto.subtle.sign({ name: 'ECDSA', hash: 'SHA-256' }, key, deviceAuthToSign(transcript, mdl.docType)));
    mdoc = assembleDeviceResponse(mdl.device_response_prefix_hex, sig, mdl.device_response_suffix_hex);

    status('Proving on this device');
    const attrs = mdl.attributes.map(a => ({ namespace: mdl.namespace, id: a.id, cbor: hex(a.cbor_hex) }));
    const t0 = performance.now();
    const proof = lf.prove({ circuit, mdoc, pkx: mdl.issuer.pkx, pky: mdl.issuer.pky, transcript, attrs, now, docType: mdl.docType });
    const ms = Math.round(performance.now() - t0);
    postMessage({ type: 'done', proof_b64: b64(proof), issuer_cert_b64: mdl.issuer.ds_cert_der_b64, ms });
  } catch (e) {
    postMessage({ type: 'error', message: e.message ?? String(e) });
  } finally {
    // Wipe: zero the credential bytes and drop every reference. app.js terminates the worker next, which frees the wasm heap.
    mdoc?.fill(0);
    if (mdl) { for (const k of Object.keys(mdl.device_key_jwk ?? {})) mdl.device_key_jwk[k] = ''; mdl.device_response_prefix_hex = ''; mdl = null; }
    key = null; mdoc = null;
  }
};
