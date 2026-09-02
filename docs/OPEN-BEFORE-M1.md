# Open before M1 and M2

From the completeness review of the component notes, 2026-09-02. Each item names where the answer comes from. Close them in this order; the first five block the benchmark.

## Blocks M1 (benchmark)

1. **Which longfellow tree to pin.** The reviewed line is C++ v0.9 (Trail of Bits reviewed commit `981a349fad`); the Rust port on `main` is unreviewed and untagged. Benchmarking one and piloting the other voids the numbers. Decision in ADR-0001 after Google answers "reviewed baseline". Set `packages/circuits/LONGFELLOW_COMMIT`.
2. **How to get a browser WASM build.** Upstream has no WASM code. Dyne's WASI build has a Node loader only and is GPL-3.0. Whether the Rust crates compile to `wasm32-unknown-unknown` is unverified. One-day spike: `cargo build --target wasm32-unknown-unknown` on the pinned commit. ADR-0007 covers the licence.
3. **The fixture to prove over.** `fixtures/test-mdl.json` is JSON, not a CBOR DeviceResponse. For M1 use longfellow's embedded test mdocs (indices 0 to 25 in its test corpus); build the `@owf/mdoc` fixture in M2.
4. **Exact prover inputs.** Encoding of `pkx`/`pky`, the SessionTranscript bytes for a synthetic run, the `now` string, the CBOR bytes for `age_over_21`. Source: `lib/circuits/mdoc/mdoc_examples.h` and the mdoc tests.
5. **Circuit version and where circuits are generated.** zk_spec v7 with 1 to 4 attributes; LFC1 circuits are ~100 MB, LFC2 ~1 MB. Precomputed and shipped, or generated on device, decides page load and memory. Record in `bench/REPORT.md`.

## Shapes the M1 result

6. **Peak memory on iPhone Safari.** `performance.memory` is Chrome-only. Use Safari Web Inspector's Timelines memory instrument for WASM, Xcode Instruments for the Mopro app, Android Profiler for Pixel. Written into `bench/README.md`.
7. **Safari WASM limits on iOS 26.** Per-tab memory cap, threads (COOP/COEP), jetsam thresholds on a 4 GB iPhone 13. No published numbers; the C1 run is the source.
8. **Mopro specifics.** Whether the pinned nightly is needed for iOS/Android builds, minimum OS versions, whether a git-pinned Rust dependency under `uniffi::export` links. Mopro reply due 2026-09-08, or trial.
9. **Browser prover viability beyond timing.** Both wallets encrypt to a relying-party key held by the page. If either wallet refuses a browser-generated HPKE key, the browser path fails regardless of p95. Added to the ADR-0001 criteria.
10. **Cross-verification.** If the page proves with a Dyne build and the verify service checks with upstream, parity is asserted by Dyne, not proven byte-for-byte. Use one tree for both, or run Dyne's parity corpus.
11. **Prior art.** PSE's 2025 run put a Ligero-family prover at 93 s on a Pixel 6 for a 2 kB SHA-256. No iPhone 13 or Pixel 6 longfellow number exists anywhere. Expect surprises.

## Blocks M2 (level 1 demo)

12. **Test DMV chain.** The current test cert is a bare self-signed P-256 cert. Needed: IACA with Annex B extensions, a DS certificate, a device key, a signed DeviceResponse. Recipe in `docs/components/iso-18013-5-mdoc-fixtures.md`. `@owf/mdoc` brings ~6 crypto dependencies; it lives in `scripts/` as a dev dependency, not in the verify service, so the runtime budget holds.
13. **Request shape.** `packages/prover-page/src/request.js` is a placeholder. Safari needs ISO 18013-7 Annex C (base64url CBOR DeviceRequest plus encryption info); Chrome/Google needs OpenID4VP `openid4vp-v1-signed` with a DCQL query and `dc_api.jwt`. Test D6 now asserts only the element list, not the envelope.
14. **How Node calls the longfellow verifier** within the two-dependency budget. Options: spawn Google's Go reference verifier as a child process, a Node addon over the C API, or a WASI build. Decide in M2 week 1, ADR-0008.
15. **Root encoding.** `fixtures/root.txt` is SHA-256; ERC-7812 needs a value below the BN128 prime. Settle the tree hash (Poseidon or reduced SHA-256) with M4 before test vectors freeze.
