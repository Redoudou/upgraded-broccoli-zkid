# circuits

Pin of Google longfellow-zk (Rust port, `LONGFELLOW_COMMIT`) and a thin C-ABI wrapper crate so one `.wasm` serves the prover page in the browser and the verify service in Node. No wasm-bindgen; the host supplies entropy through one import (`gl_random_bytes`).

```
longfellow-wasm/            Cargo crate: gl_prove, gl_verify, gl_circuit, gl_alloc, gl_free; `lf` native helper CLI
longfellow.js               loader + prove/verify wrappers, runs in browsers and Node
artifacts/longfellow.wasm   2.6 MB, built by build.sh from the pin
artifacts/circuit-1.zst     the current-version (8) mdoc circuit for one attribute, zstd, 300 KB
artifacts/SHA256SUMS        checked in CI
build.sh                    rebuild both (Rust stable + wasm32 target, ~3 min)
```

The circuit proves, for an ISO 18013-5 DeviceResponse: issuer ECDSA P-256 signature over the MSO verifies under the public issuer key; the requested attribute's salted digest is in the MSO and its value equals the requested CBOR value; `validFrom <= now <= validUntil`; the device key in the MSO signed the session transcript. Public inputs: issuer key, transcript, attribute, `now`, docType.

Spec section 3 additions: the device-nonce statement is already in the circuit (the session nonce goes into the transcript). Trust-list membership is not; the verify service checks it in the clear against the Merkle root (ADR-0006 fallback) until M4. Attribute comparison is equality only, so `expiry_date` is not requested; MSO validity covers "license valid".
