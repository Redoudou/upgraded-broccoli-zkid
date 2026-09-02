# prover-page

Spec section 3. Opened from the desk QR with `?n=<nonce>`. Static files only, strict CSP (`script-src 'self' 'wasm-unsafe-eval'`, no inline script or style, `connect-src 'self'`).

Flow: `GET /session/:nonce` for the verifier date → simulated wallet sheet showing what the venue learns and what it does not → `worker.js` loads `longfellow.wasm` and `circuit-1.zst`, imports the test credential's device key, signs `DeviceAuthentication(SessionTranscript(nonce))` with WebCrypto, assembles the DeviceResponse, runs the longfellow prover, posts the proof and the document-signer certificate → the worker zeroes its buffers and `app.js` terminates it, which frees the wasm heap → result and on-device proving time on screen.

Files: `index.html`, `style.css`, `app.js` (UI), `worker.js` (prover), `mdoc.js` (the handful of CBOR shapes, byte-identical to `scripts/gen-test-mdl.js`, test D10), `request.js` (Digital Credentials API request shape, test D6; the real per-platform envelope is M3).

Served by the verify service in the demo; `npm run build` copies sources plus the prover artifacts into `dist/` with a `SHA256SUMS` for the reproducible-build check (D7).

Not done: the real wallet hand-off (needs a relying-party registration with Apple and Google), device tests D1 to D4 on real phones, D5/D9 with Playwright in CI.
