# Google longfellow-zk
_Researched 2026-09-01; independently re-verified against live sources 2026-09-02 (see Verification section). Every claim carries a source link. Unverified statements are marked [unverified]._

## What it is
Longfellow ZK is Google's C++ library for building zero-knowledge proofs about legacy identity credentials, specifically "the ISO MDOC standard, the JWT standard, and W3 Verifiable Credentials" ([README][s2]). It implements the scheme from Frigo and shelat's paper "Anonymous credentials from ECDSA" (ePrint 2024/2010, last revised 2026-04-27), which combines a sumcheck/GKR layered-circuit argument with the Ligero MPC-in-the-head commitment so that the only cryptographic assumption is SHA-256 and no trusted setup is needed ([paper][s35]; the draft-02 abstract names Ligero and sumcheck but not GKR, [s34]). The shipped mdoc circuit proves, for an ISO 18013-5 DeviceResponse, that the issuer's P-256 signature on the MSO verifies, that a requested attribute's salted digest is in the MSO, that `validFrom <= now <= validUntil`, and that the device-bound key signed the session transcript ([mdoc_signature.h][s12], [mdoc_hash.h][s14], [paper Alg. 10][s35]). The same protocol is specified in the individual IETF draft `draft-google-cfrg-libzk-02` "Longfellow ZK" ([datatracker][s32]) was open-sourced by Google on 2025-07-03 in a post signed by a Google Wallet product manager ([Google blog][s49]; the post body itself does not name Google Wallet as a user), and Google's own docs say the parameters are "currently used by Google Wallet and Multipaz Wallet/RP" ([zk-system-spec][s27]; the lfzk.dev demo presents "from your digital ID in Google Wallet", [s48]). Two external security reviews (Trail of Bits, implementation; a four-person academic panel assembled by Ligero Inc., protocol) have been published, plus an ISRG-reported circuit bug fixed in v0.8.4 ([reviews page][s23]).

## Where it lives
| Item | URL | Licence | Version/tag/commit seen today |
|---|---|---|---|
| Upstream repo (C++ `lib/`, Rust `rust/`, Go reference verifier, docs) | https://github.com/google/longfellow-zk | Apache-2.0, "Copyright © 2025 Google LLC" ([LICENSE][s3]) | `main` @ `5f348de0bedcc49fe3800a57f6bf2eecd0389391`, 2026-08-12, "Merge pull request #176 from google/rust — Harden MDOC parser" ([commits][s4]) |
| Latest release | https://github.com/google/longfellow-zk/releases/tag/v0.9 | Apache-2.0 | `v0.9` @ `fe83ec6c4efa5f98bc2439c8b06e5eccd153aca0`, published 2026-03-31; earlier tags v0.8.1–v0.8.6 ([tags/releases][s4]). No 1.x tag exists. |
| mdoc C API header | https://github.com/google/longfellow-zk/blob/main/lib/circuits/mdoc/mdoc_zk.h | Apache-2.0 | header says "Copyright 2026 Google LLC" ([mdoc_zk.h][s10]) |
| Circuit spec list (hashes) | https://github.com/google/longfellow-zk/blob/main/lib/circuits/mdoc/zk_spec.cc | Apache-2.0 | 12 specs: circuit v7 (produced 2026-01-09), v6 (2025-10-10), v5 (2025-08-21), each for 1–4 attributes ([zk_spec.cc][s15]) |
| Project docs, benchmarks, reviews | https://google.github.io/longfellow-zk/ | — | reviews page lists Trail of Bits 2025-08-18, ISRG fix 2025-10-17, Ligero panel 2025-12-15 ([s23]) |
| IETF draft | https://datatracker.ietf.org/doc/draft-google-cfrg-libzk/ | IETF | `draft-google-cfrg-libzk-02`, 2026-07-22, expires 2027-01-23, Informational, individual submission, not adopted by CFRG. History: -00 2025-03-03, -01 2025-09-02 (added to the IETF-124 dispatch session 2025-10-29, expired 2026-03-16), -02 2026-07-22 ([s32], [s33]) |
| Paper | https://eprint.iacr.org/2024/2010 | — | received 2024-12-12, last revised 2026-04-27 ([s35]) |
| Dyne.org fork ("European build") | https://github.com/dyne/longfellow-zk | **GPL-3.0-or-later** ([Dyne README][s37], [LICENSE][s38]) | `v1.0.0` @ `d2b0fc515f8663e38c79a28e8900ce8438e0106e`, published 2026-08-31 ([s39]); the README on `main` still calls the project "pre-1.0 cryptographic software" ([s37]) |
| EUDI iOS Swift wrapper | https://github.com/eu-digital-identity-wallet/av-lib-ios-longfellow-zkp | Apache-2.0 | "initial development release", iOS 16+, no longfellow version pinned in README ([s46]) |
| Reference verifier service (Go) | https://github.com/google/longfellow-zk/tree/main/reference/verifier-service | Apache-2.0 | `POST /zkverify`, `GET /specs`, loads `certs.pem` and AAMVA VICAL ([s20], [PR #125][s30]) |

## How Green Light uses it
Longfellow is the "Circuit" row of SPEC.md section 2 and the prover inside the PWA in section 1. It is on the critical path of PLAN.md M1 (benchmark from `main` at a recorded commit, WASM and Mopro), M3 (prover page), M4 (circuit additions), M6 and M8 (gate item 1: "reviewed 1.x tag").

Findings that change the spec and plan:

1. **Spec section 3 item 4 (device-bound key signs the verifier nonce) is already in the circuit.** `run_mdoc_prover`/`run_mdoc_verifier` take a `transcript` (session transcript) argument ([mdoc_zk.h][s10]); the witness builder hashes `["DeviceAuthentication", SessionTranscript, DocType, DeviceNameSpacesBytes]` per ISO 18013-5 9.1.3.4 into `e2` and the signature circuit verifies the device signature on it, with the device key bound to the MSO's `deviceKeyInfo` via MACs across the two circuits ([mdoc_witness.h][s13] lines 451–464, [mdoc_signature.h][s12] lines 32–35 and 85–100, [mdoc_hash.h][s14] lines 218–227). The transcript also seeds the Fiat–Shamir oracle ("Use the transcript from the session to select the random oracle", [mdoc_zk.cc][s11]). What Green Light must do is put its session nonce into the SessionTranscript it hands to both prover and verifier; Google's docs show the OpenID4VP request carrying `verifier_message: "challenge"` and `zk_system_type` per ISO 18013-5 2nd edition 10.3.4 ([protocols.md][s21]). M4 shrinks to the Merkle membership item; the M4 fallback for the nonce is unnecessary.
2. **Spec section 3 item 1 (issuer cert hash is a member of a published root) is not in the circuit.** The issuer public key `(pkx, pky)` is a public input; no x5chain is parsed and there is no Merkle membership in the mdoc circuit ([mdoc_zk.h][s10], [mdoc_witness.h][s13]). The verifier therefore learns which issuer (which state DMV) signed the license, which contradicts the "nothing else" claim in SPEC.md until the addition lands. There is an unwired gadget `assert_signatures_with_issuer_list` that hides the issuer among up to 50 supplied keys ([mdoc_signature.h][s12] lines 103–137); it is exercised only in `mdoc_signature_test.cc` and not by `generate_circuit`/`run_mdoc_prover` ([mdoc_zk.cc][s11], [mdoc_generate_circuit.cc][s55]). The header comment anticipates this: "The public key of the issuer is given as input for now. Later, it can be one among a list of issuers" ([s12] lines 28–30). Dyne documents a planned `FixedDepthSha256MerkleMembership` gadget with `Depth <= 4` (16 leaves; depth-4 fixture: 13,321 inputs, 2,135,652 quadratic terms, 2.90 s, 499,344 KiB peak RSS) ([Dyne merkle contract][s41]); the AAMVA VICAL loaded by Google's verifier held 17 certificates in January 2026 ([PR #125][s30]), so depth 4 is already too small.
3. **Spec section 3 item 3 (`expiry_date` > verifier date) is not what the circuit checks.** The circuit checks the MSO `validityInfo` window against the public `now` string ([mdoc_hash.h][s14] lines 38–39, 202–215); attribute checks are byte-equality of a CBOR value only ([v0.8.2 notes][s9], `RequestedAttribute` in [s10]). Range comparison on the `expiry_date` data element is not supported. Either accept MSO validity as the freshness check or add a range gadget.
4. **Spec section 8 / decision 2 / M8 item 1 ("reviews in progress", "reviewed 1.x tag").** Both reviews are published (2025-08-18 and 2025-12-15, [s23]); the README still says "currently undergoing" ([s2]). No 1.x tag exists; the newest tag is v0.9 (2026-03-31) and `main` has moved since (Rust-side MSO/parser hardening: issue #173 fixed by PR #176, merged 2026-08-12, [s4]). The gate wording needs to name a tag that exists.
5. **Mopro has no longfellow adapter today**: a GitHub code search for "longfellow" across the zkmopro org returns nothing ([s51]); the Mopro wrapping in SPEC.md section 2 is new work.

## How to build or integrate
Upstream C++ build (Ubuntu deps `build-essential clang cmake libssl-dev libzstd-dev libgtest-dev libbenchmark-dev zlib1g-dev`; macOS `brew install googletest google-benchmark zstd`) ([README][s2]):
```
$ CXX=clang++ cmake -D CMAKE_BUILD_TYPE=Release -S lib -B clang-build-release --install-prefix ${PWD}/install
$ cd clang-build-release && make -j 16 && ctest -j 16
```
Mobile: `android.sh` builds googletest, benchmark, zstd, OpenSSL and `lib/` with the NDK toolchain (`ANDROID_ABI=arm64-v8a`, `ANDROID_PLATFORM=android-24`, static linking, output `build-android-arm64/`) ([s18]); `ios.sh` uses `CMAKE_SYSTEM_NAME=iOS`, `CMAKE_OSX_ARCHITECTURES=arm64`, Xcode generator, output `build-ios-arm64/` ([s19]).

Rust workspace (`rust/`): `cargo build --release`, `cargo test -r`, `cargo bench -p mdoc-zk-runtime`. README states it is "still under development, but our (Google) goal is to switch to this implementation in production", is "100% backward compatible with the C++ one. It can read LFC1 circuits and produce bit-by-bit equal proofs as the C++ prover", and that LFC2 shrinks mdoc-zk circuits from ~100 MB to ~1 MB with memory under 100 MB vs 170 MB for C++ ([rust/README.md][s17]).

mdoc C API ([mdoc_zk.h][s10]):
```c
MdocProverErrorCode run_mdoc_prover(
    const uint8_t* bcp, size_t bcsz,          /* circuit data */
    const uint8_t* mdoc, size_t mdoc_len,     /* full mdoc */
    const char* pkx, const char* pky,         /* string rep of public key */
    const uint8_t* transcript, size_t tr_len, /* session transcript */
    const RequestedAttribute* attrs, size_t attrs_len,
    const char* now, /* time formatted as "2023-11-02T09:00:00Z" */
    uint8_t** prf, size_t* proof_len, const ZkSpecStruct* zk_spec_version);
MdocVerifierErrorCode run_mdoc_verifier(
    const uint8_t* bcp, size_t bcsz, const char* pkx, const char* pky,
    const uint8_t* transcript, size_t tr_len,
    const RequestedAttribute* attrs, size_t attrs_len, const char* now,
    const uint8_t* zkproof, size_t proof_len, const char* docType,
    const ZkSpecStruct* zk_spec_version);
CircuitGenerationErrorCode generate_circuit(const ZkSpecStruct* zk_spec_version, uint8_t** cb, size_t* clen);
const ZkSpecStruct* find_zk_spec(const char* system_name, const char* circuit_hash);
```
- Inputs: the full DeviceResponse mdoc (private), issuer P-256 public key (public), session transcript (public), `RequestedAttribute{namespace_id[64], id[32], cbor_value[64]}` with the value "passed as the raw bytes of the CBOR value" (public), `now` (public), `docType` default `org.iso.18013.5.1.mDL` ([s10]). Attributes must share one namespace ([v0.8.3][s8]). MSO up to 2551 bytes, "enough to support ~50 attributes" ([v0.8.6][s6]).
- Public statement (paper Alg. 10): `e1 = SHA256(MSO)`, `h2 = MSO[valueDigests][ns][X]`, `h2 = SHA256(nonce, attr, Z)`, device key = `MSO[deviceKeyInfo][deviceKey]`, `tstart < tnow < tend`, `p256.verify((r1,s1), e1, PK_II)`, `p256.verify((r2,s2), H(tr||hdr), devicekey)`; public values are `(PK_II, attr, Z, tr, time)` ([paper][s35] section 6.2).
- Output: proof bytes laid out as "[6 mac values] [docType] [hash proof] [sig proof]", i.e. one Ligero proof over Fp256 (signatures) and one over GF(2^128) (SHA-256 and CBOR parsing) linked by MACs ([mdoc_zk.cc][s11]). Ligero parameters: `kLigeroRatev7 = 7`, `kLigeroNreqv7 = 132` "~109 bits statistical security" for circuit v7; older `kLigeroRate = 4`, `kLigeroNreq = 128` "86+ bits" ([s10]).
- Versioning: `kZkSpecs` is "the source of truth"; verifiers advertise `zk_system_type {system: "longfellow-libzk-v1", circuit_hash, num_attributes, version}` and the callers, not the library, must check `circuit_id` against the expected hash at load time ([reviews page][s23], [TOB-LIBZK-1][s24]); the zk-system-spec page says "the paramters [sic] change relatively often" and to use `kZkSpecs` "as a source of truth for the parameters" ([s27]).
- Reference verifier: build the C++ library, `go build`, `./server -circuit_dir <path>` (port 8888), `POST /zkverify`, `GET /specs`; issuer CAs from `certs.pem` and, since PR #125 (merged 2026-01-14), from `https://vical.dts.aamva.org/vical/vc` ([s20], [s30]).

WASM: the upstream repo contains no wasm/emscripten/wasm32 code (code search, 0 hits) and the only WASM PR (#3, "portability: wasm simd128 primitives", jaromil, 2025-07-04) was closed unmerged ([issues search][s31]). Dyne's fork builds with `WASI_SDK_PATH=... cmake --preset wasi && cmake --build --preset wasi --parallel` (reactor-style module, smoke-tested under Node.js) ([Dyne getting-started][s40]) and ships `bindings/javascript/longfellow_zk.mjs` ("longfellow-zk WASM bindings for Node.js", exports `generateCircuit`, `generateProof`, `verifyProof`, with a "minimal WASI shim") ([s44]). Browser/Safari execution of that module is not documented [unverified]. Dyne's 2025-06-25 write-up reports SIMD128 routines "to make it run in-browser" and prover 816 ms / verifier 492 ms without OpenSSL (795 / 466 ms with OpenSSL), proof ~325 KB for one attribute, measured on "a 12th generation Intel CPU running tests on a single i9 5GHz core", GCC -O2, no multithreading ([s45]). The Dyne code is GPL-3.0-or-later, which is incompatible with SPEC.md's Apache-2.0 deliverable unless a separate licence is obtained ("For integration and packaging support, security coordination, or licensing needs that the GPL does not accommodate, contact info@dyne.org", [s37]); a Green Light WASI build from the Apache upstream is feasible in principle because the C++ has no OS dependencies beyond OpenSSL/zstd, but nobody has published one [unverified].

iOS: the EUDI Swift wrapper notes that on iOS 26 "the extension process cannot currently perform zero-knowledge proof (ZKP) due to memory constraints" and recommends proving in the main app ([s46]); v0.9 cut the C++ zk_mdoc prover from 600 MB to under 200 MB ([s5]). Multipaz's Longfellow build notes are "To be written" for iOS ([s47]).

Reported performance (single-threaded): paper Table 13, age-over-18, MSO ≤ 2231 bytes — Pixel 9 931 ms prove / 508 ms verify; iPhone 15+ 437 / 229; Mac M4 Air 294 / 142; amd64 526 / 252 ([s35]). Toy-credential proof size 291 KB on amd64 (Table 12, [s35]); no mdoc proof size is published upstream. Google's benchmark page (Mac M4, commit 7906304, 2025-10-17) gives ECDSA-only prove ≈16.7 ms / verify ≈10.4 ms ([s26]). The "~1.2 s on phone" figure in SPEC.md section 2 traces to the original 2024 ePrint abstract ("1.2 seconds on mobile devices depending on the credential size", as quoted in Dyne's June 2025 post, [s45]); the current revised abstract (2026-04-27) says "a few hundred ms on mobile devices" and Table 13 gives 437–931 ms on phones ([s35]). The 1.2 s figure is superseded. csp-benchmarks (now at `ethereum/csp-benchmarks`; the `privacy-ethereum` URL redirects) does not include longfellow (README and code search, 0 hits, [s50]).

## Status and risks
- **Maturity.** Versions are 0.x; v0.9 (2026-03-31) is the newest tag. Circuit format and hashes "change relatively often" ([s27]); v0.8.2 broke the API, v0.8.5 deprecated circuits v3/v4 ([s9], [s4]). Google is building a Rust replacement "with Google's goal to deploy it in production" ([s17]); its mdoc parser was hardened in August 2026 (issue #173, PR #176 merged 2026-08-12, [s4]).
- **Trail of Bits (implementation, report 2025-08-18).** Review 2025-07-07 to 07-18, four engineer-weeks. 13 findings: 2 High, 2 Low, 1 Undetermined, 8 Informational. Verdict: "a high-quality implementation of a sumcheck-based zero-knowledge proof system. However, the circuits and other functionality outside this core appear to be less well tested and less mature". High #10 "mdoc attribute check can be bypassed" resolved in commit 60c7180; High #1 "Circuit ID is not checked during circuit deserialization" left unresolved by design (caller must verify the hash). Fix review 2025-08-11 to 08-13: 8 resolved, 5 unresolved (#1, #6, #9, #11 timing leak in ECDSA witness building, #12 MAC forgery on input zero). Coverage gaps named: non-mdoc circuits in jwt/ and anoncred/, the mdoc_1f circuit, the CBOR parsing circuits, the circuit compiler ([s24]). Google's reviews page nonetheless states "All of the issues have been addressed in the latest release" ([s23]).
- **ISRG (David Cook), ISRG-01.** Under-constrained witness in the hash circuit let a prover substitute mdoc field values; fixed 2025-10-17 in v0.8.4 / circuit v6 ([s23], [s7]).
- **Ligero panel (protocol, dated "Decenber 2025" [sic] on the report).** Cascudo, Hazay, Venkitasubramaniam (all Ligero Inc.) and Yogev (Bar-Ilan): Longfellow "satisfies (up to standard theoretical analysis) all properties required for a zero-knowledge proof system"; with rate 1/7 and 140 opened columns the parameters "guarantee 115 bits of security"; suggests grinding to boost further ([s25]). Note the code's v7 constant is 132 columns "~109 bits" ([s10]); the 140-vs-132 gap is a question for Google.
- **Post-review bugs.** Issues #139 (test-circuit equality bypass in `pk_circuit.h`, not production) and #140 (`prf` null-check) by GUJustin, March 2026, fixed in PR #142 / v0.9 ([s28], [s29], [s5]).
- **Trust-list and issuer privacy.** Issuer key is public (finding 2 above). Any in-circuit membership check is Green Light's own change; Dyne's gadget is planned and capped at depth 4 ([s41]); reviews do not transfer to modified circuits ("do not transfer a review claim automatically across a fork or later protocol change", [Dyne security.md][s42]).
- **Licence split.** Upstream Apache-2.0; Dyne fork GPL-3.0-or-later ([s38]). Using Dyne's WASI/JS code in the Apache-2.0 prover page is a licence problem.
- **Standards.** The IETF draft is individual, Informational, not CFRG-adopted, and specifies the proof system only — no mdoc circuit, no proof-size figures ([s33], [s34]). The docs' OpenID4VP example still cites the v5 circuit hash `f88a39e5…` ([s21]).
- **Memory on phones.** <200 MB (C++, v0.9) and <100 MB (Rust) per Google ([s5], [s17]); iOS extension limits already bite the EUDI wrapper ([s46]). Directly tests SPEC.md section 8 "Safari WASM memory".

## Open questions for the partner call
- Is there a planned 1.0 tag, and which tag/commit does Google consider the reviewed baseline: v0.9, or a Rust release? Will the Rust port get its own Trail of Bits review before production?
- Will Google wire `assert_signatures_with_issuer_list` (or a Merkle membership gadget) into `generate_circuit`/`run_mdoc_prover`? What issuer-list size do they target, and would they accept an upstream PR for a VICAL-root membership check (AAMVA VICAL had 17 certs in Jan 2026)?
- Ligero panel analyzed 140 opened columns for 115 bits; `kLigeroNreqv7 = 132` "~109 bits". Which is shipped, and is a parameter bump planned?
- Is a range check on `expiry_date` (or any non-equality attribute predicate) on the roadmap, or should Green Light rely on MSO `validityInfo`?
- Has Google or Dyne run the prover in Safari (WASM/WASI) on an iPhone 13-class device? Any memory numbers? Dyne: can the WASI build and JS bindings be relicensed for an Apache-2.0 project?
- Multi-namespace attributes and DC API handover: what exact SessionTranscript bytes does Google Wallet sign under the DC API, so the verify service can reconstruct them?
- Trail of Bits #11 (timing leak in ECDSA witness building) and #12 (MAC forgery on zero input) remain unresolved: is a fix scheduled?
- Which real US mDL issuers have been tested against circuit v7 (MSO ≤ 2551 bytes)? Do California and New York MSOs fit?

## Sources
All fetched 2026-09-01; every URL re-fetched 2026-09-02 (all resolved, HTTP 200; GitHub data via `gh api`).
1. [s2] https://raw.githubusercontent.com/google/longfellow-zk/main/README.md
2. [s3] https://raw.githubusercontent.com/google/longfellow-zk/main/LICENSE
3. [s4] https://github.com/google/longfellow-zk (commits on main, tags, releases via GitHub API)
4. [s5] https://github.com/google/longfellow-zk/releases/tag/v0.9
5. [s6] https://github.com/google/longfellow-zk/releases/tag/v0.8.6
6. [s7] https://github.com/google/longfellow-zk/releases/tag/v0.8.4
7. [s8] https://github.com/google/longfellow-zk/releases/tag/v0.8.3
8. [s9] https://github.com/google/longfellow-zk/releases/tag/v0.8.2
9. [s10] https://raw.githubusercontent.com/google/longfellow-zk/main/lib/circuits/mdoc/mdoc_zk.h
10. [s11] https://raw.githubusercontent.com/google/longfellow-zk/main/lib/circuits/mdoc/mdoc_zk.cc
11. [s12] https://raw.githubusercontent.com/google/longfellow-zk/main/lib/circuits/mdoc/mdoc_signature.h
12. [s13] https://raw.githubusercontent.com/google/longfellow-zk/main/lib/circuits/mdoc/mdoc_witness.h
13. [s14] https://raw.githubusercontent.com/google/longfellow-zk/main/lib/circuits/mdoc/mdoc_hash.h
14. [s15] https://raw.githubusercontent.com/google/longfellow-zk/main/lib/circuits/mdoc/zk_spec.cc
15. [s55] https://raw.githubusercontent.com/google/longfellow-zk/main/lib/circuits/mdoc/mdoc_generate_circuit.cc
16. [s16] https://raw.githubusercontent.com/google/longfellow-zk/main/lib/circuits/mdoc/README.md
17. [s17] https://raw.githubusercontent.com/google/longfellow-zk/main/rust/README.md
18. [s18] https://raw.githubusercontent.com/google/longfellow-zk/main/android.sh
19. [s19] https://raw.githubusercontent.com/google/longfellow-zk/main/ios.sh
20. [s20] https://raw.githubusercontent.com/google/longfellow-zk/main/reference/verifier-service/server/README.md
21. [s21] https://raw.githubusercontent.com/google/longfellow-zk/main/docs/content/en/docs/protocols.md
22. [s22] https://google.github.io/longfellow-zk/ and https://google.github.io/longfellow-zk/docs/
23. [s23] https://google.github.io/longfellow-zk/docs/reviews/
24. [s24] https://google.github.io/longfellow-zk/reviews/Longfellow_report_2025_08_18.pdf
25. [s25] https://google.github.io/longfellow-zk/reviews/Longfellow_security_2025_12_15.pdf
26. [s26] https://google.github.io/longfellow-zk/docs/benchmarks/
27. [s27] https://google.github.io/longfellow-zk/docs/zk-system-spec/
28. [s28] https://github.com/google/longfellow-zk/issues/139
29. [s29] https://github.com/google/longfellow-zk/issues/140
30. [s30] https://github.com/google/longfellow-zk/pull/125
31. [s31] https://github.com/google/longfellow-zk/issues?q=wasm
32. [s32] https://datatracker.ietf.org/doc/draft-google-cfrg-libzk/
33. [s33] https://datatracker.ietf.org/doc/draft-google-cfrg-libzk/history/
34. [s34] https://www.ietf.org/archive/id/draft-google-cfrg-libzk-02.html
35. [s35] https://eprint.iacr.org/2024/2010 and https://eprint.iacr.org/2024/2010.pdf
36. [s36] https://github.com/dyne/longfellow-zk
37. [s37] https://raw.githubusercontent.com/dyne/longfellow-zk/main/README.md
38. [s38] https://raw.githubusercontent.com/dyne/longfellow-zk/main/LICENSE
39. [s39] https://github.com/dyne/longfellow-zk/releases/tag/v1.0.0
40. [s40] https://raw.githubusercontent.com/dyne/longfellow-zk/main/docs/getting-started.md
41. [s41] https://raw.githubusercontent.com/dyne/longfellow-zk/main/docs/merkle-membership-contract.md
42. [s42] https://raw.githubusercontent.com/dyne/longfellow-zk/main/docs/security.md
43. [s43] https://raw.githubusercontent.com/dyne/longfellow-zk/main/docs/interoperability.md and docs/google-rust-parity.md and docs/production-qualification.md
44. [s44] https://raw.githubusercontent.com/dyne/longfellow-zk/main/bindings/javascript/longfellow_zk.mjs
45. [s45] https://news.dyne.org/longfellow-zero-knowledge-google-zk/
46. [s46] https://github.com/eu-digital-identity-wallet/av-lib-ios-longfellow-zkp
47. [s47] https://raw.githubusercontent.com/eu-digital-identity-wallet/av-dc-api-backend/main/multipaz-longfellow/src/libzk/README.md
48. [s48] https://lfzk.dev/
49. [s49] https://blog.google/innovation-and-ai/technology/safety-security/opening-up-zero-knowledge-proof-technology-to-promote-privacy-in-age-assurance/
50. [s50] https://github.com/privacy-ethereum/csp-benchmarks (redirects to https://github.com/ethereum/csp-benchmarks)
51. [s51] GitHub code search `longfellow org:zkmopro` (0 results) — https://github.com/zkmopro

[s2]: https://raw.githubusercontent.com/google/longfellow-zk/main/README.md
[s3]: https://raw.githubusercontent.com/google/longfellow-zk/main/LICENSE
[s4]: https://github.com/google/longfellow-zk/commits/main
[s5]: https://github.com/google/longfellow-zk/releases/tag/v0.9
[s6]: https://github.com/google/longfellow-zk/releases/tag/v0.8.6
[s7]: https://github.com/google/longfellow-zk/releases/tag/v0.8.4
[s8]: https://github.com/google/longfellow-zk/releases/tag/v0.8.3
[s9]: https://github.com/google/longfellow-zk/releases/tag/v0.8.2
[s10]: https://raw.githubusercontent.com/google/longfellow-zk/main/lib/circuits/mdoc/mdoc_zk.h
[s11]: https://raw.githubusercontent.com/google/longfellow-zk/main/lib/circuits/mdoc/mdoc_zk.cc
[s12]: https://raw.githubusercontent.com/google/longfellow-zk/main/lib/circuits/mdoc/mdoc_signature.h
[s13]: https://raw.githubusercontent.com/google/longfellow-zk/main/lib/circuits/mdoc/mdoc_witness.h
[s14]: https://raw.githubusercontent.com/google/longfellow-zk/main/lib/circuits/mdoc/mdoc_hash.h
[s15]: https://raw.githubusercontent.com/google/longfellow-zk/main/lib/circuits/mdoc/zk_spec.cc
[s16]: https://raw.githubusercontent.com/google/longfellow-zk/main/lib/circuits/mdoc/README.md
[s17]: https://raw.githubusercontent.com/google/longfellow-zk/main/rust/README.md
[s18]: https://raw.githubusercontent.com/google/longfellow-zk/main/android.sh
[s19]: https://raw.githubusercontent.com/google/longfellow-zk/main/ios.sh
[s20]: https://raw.githubusercontent.com/google/longfellow-zk/main/reference/verifier-service/server/README.md
[s21]: https://raw.githubusercontent.com/google/longfellow-zk/main/docs/content/en/docs/protocols.md
[s22]: https://google.github.io/longfellow-zk/
[s23]: https://google.github.io/longfellow-zk/docs/reviews/
[s24]: https://google.github.io/longfellow-zk/reviews/Longfellow_report_2025_08_18.pdf
[s25]: https://google.github.io/longfellow-zk/reviews/Longfellow_security_2025_12_15.pdf
[s26]: https://google.github.io/longfellow-zk/docs/benchmarks/
[s27]: https://google.github.io/longfellow-zk/docs/zk-system-spec/
[s28]: https://github.com/google/longfellow-zk/issues/139
[s29]: https://github.com/google/longfellow-zk/issues/140
[s30]: https://github.com/google/longfellow-zk/pull/125
[s31]: https://github.com/google/longfellow-zk/issues?q=wasm
[s32]: https://datatracker.ietf.org/doc/draft-google-cfrg-libzk/
[s33]: https://datatracker.ietf.org/doc/draft-google-cfrg-libzk/history/
[s34]: https://www.ietf.org/archive/id/draft-google-cfrg-libzk-02.html
[s35]: https://eprint.iacr.org/2024/2010
[s36]: https://github.com/dyne/longfellow-zk
[s37]: https://raw.githubusercontent.com/dyne/longfellow-zk/main/README.md
[s38]: https://raw.githubusercontent.com/dyne/longfellow-zk/main/LICENSE
[s39]: https://github.com/dyne/longfellow-zk/releases/tag/v1.0.0
[s40]: https://raw.githubusercontent.com/dyne/longfellow-zk/main/docs/getting-started.md
[s41]: https://raw.githubusercontent.com/dyne/longfellow-zk/main/docs/merkle-membership-contract.md
[s42]: https://raw.githubusercontent.com/dyne/longfellow-zk/main/docs/security.md
[s43]: https://raw.githubusercontent.com/dyne/longfellow-zk/main/docs/interoperability.md
[s44]: https://raw.githubusercontent.com/dyne/longfellow-zk/main/bindings/javascript/longfellow_zk.mjs
[s45]: https://news.dyne.org/longfellow-zero-knowledge-google-zk/
[s46]: https://github.com/eu-digital-identity-wallet/av-lib-ios-longfellow-zkp
[s47]: https://raw.githubusercontent.com/eu-digital-identity-wallet/av-dc-api-backend/main/multipaz-longfellow/src/libzk/README.md
[s48]: https://lfzk.dev/
[s49]: https://blog.google/innovation-and-ai/technology/safety-security/opening-up-zero-knowledge-proof-technology-to-promote-privacy-in-age-assurance/
[s50]: https://github.com/privacy-ethereum/csp-benchmarks
[s51]: https://github.com/zkmopro
[s55]: https://raw.githubusercontent.com/google/longfellow-zk/main/lib/circuits/mdoc/mdoc_generate_circuit.cc

## Verification
Date: 2026-09-02. Reviewer re-fetched every URL in the Sources section and the GitHub API data (commits, tags, releases, issues, PRs, code search) and read the three PDFs. 96 discrete factual claims (URLs, hashes, dates, version numbers, quoted strings, line-number citations, numeric figures) were checked; 84 confirmed as written, 11 corrected, 1 left unverified.

Corrections made:
- Google blog post [s49] (2025-07-03) announces the open-sourcing but its body never says Google Wallet uses Longfellow; the Google Wallet claim is now sourced to the zk-system-spec page [s27] ("currently used by Google Wallet and Multipaz Wallet/RP") and lfzk.dev [s48].
- The IETF draft-02 abstract [s34] does not mention GKR; the GKR attribution is now sourced to the paper only. Added the draft revision history (-00 2025-03-03, -01 2025-09-02, -02 2026-07-22) and the IETF-124 dispatch note from [s33].
- "PRs #173/#176": #173 is an issue (eyusd, 2026-08-02), not a PR; it was closed by PR #176 (matteo-frigo, merged 2026-08-12). Fixed in two places.
- Rust README quote "with Google's goal to deploy it in production" was not verbatim; replaced with the actual wording "our (Google) goal is to switch to this implementation in production" [s17].
- Dyne README quote "For licensing alternatives, contact info@dyne.org" was not verbatim; replaced with the actual sentence [s37]. Also noted that Dyne's README still says "pre-1.0 cryptographic software" despite the v1.0.0 tag.
- Dyne June 2025 benchmark was described as "hardware unstated"; the post states a 12th-gen Intel i9 single core at 5 GHz, GCC -O2, and gives both with-OpenSSL (795/466 ms) and without-OpenSSL (816/492 ms) figures [s45].
- The "callers must check circuit_id" statement was cited to [s27], which does not say that; re-cited to the reviews page [s23] and TOB-LIBZK-1 [s24]. The [s27] quotes are now verbatim ("as a source of truth for the parameters", "paramters change relatively often").
- The "~1.2 s on phone" figure was marked [unverified]; it is now traced to the original 2024 ePrint abstract (quoted in [s45]) and shown to be superseded by the revised abstract ("a few hundred ms on mobile devices") and Table 13 [s35].
- Trail of Bits coverage-gap list was missing "the mdoc_1f circuit"; added, and noted the reviews page's "All of the issues have been addressed" statement, which conflicts with the fix-review's five Unresolved items [s23], [s24].
- Ligero panel: report is dated "Decenber 2025" [sic]; three of four authors are Ligero Inc., Yogev is Bar-Ilan. Wording adjusted.
- csp-benchmarks repo has moved from `privacy-ethereum` to `ethereum` (redirect); noted in text and Sources.

Confirmed as written (selection): main @ 5f348de (2026-08-12), v0.9 @ fe83ec6 (2026-03-31), tags v0.8.1–v0.9 only; 12 zk specs (v7 2026-01-09, v6 2025-10-10, v5 2025-08-21); kLigeroRatev7=7 / kLigeroNreqv7=132 "~109 bits", kLigeroRate=4 / kLigeroNreq=128 "86+ bits"; mdoc_signature.h lines 28–35, 85–100, 103–137 and mdoc_hash.h lines 38–39, 202–215, 218–227 and mdoc_witness.h lines 451–464 as cited; `assert_signatures_with_issuer_list` not called from mdoc_generate_circuit.cc; mdoc_zk.cc comments at lines 482 and 528; v0.8.6 MSO 2551 bytes / ~50 attributes; v0.8.3 single-namespace limit; v0.8.2 breaking API; v0.8.5 deprecates v3/v4; v0.8.4 = circuit v6 on 2025-10-17; issues #139/#140 (GUJustin, March 2026, #139 explicitly "does NOT affect the production mDOC flow") fixed by PR #142 / v0.9 "600MB to <200MB"; PR #125 merged 2026-01-14, VICAL URL `https://vical.dts.aamva.org/vical/vc`, "Loaded 17 certificates from VICAL"; PR #3 (jaromil, closed 2025-07-04, unmerged); 0 code-search hits for wasm/emscripten/wasm32 upstream and for longfellow in zkmopro; TOB dates, 4 engineer-weeks, 2 High / 2 Low / 1 Undetermined / 8 Informational, commit 60c7180, fix review 2025-08-11..13 with 8 Resolved / 5 Unresolved (#1, #6, #9, #11, #12), verdict quote verbatim; Ligero ρ=1/7, 140 queries, 115 bits, grinding; paper received 2024-12-12 / revised 2026-04-27, Table 13 (Pixel 9 931/508, iPhone 15+ 437/229, M4 Air 294/142, amd64 526/252, MSO ≤ 2231), Table 12 291 KB, Alg. 10 in section 6.2; Google benchmarks page (Mac M4, commit 7906304, 2025-10-17, ECDSA 16.7/10.4 ms); Dyne v1.0.0 @ d2b0fc5 (2026-08-31), GPL-3.0, WASI preset, Node.js bindings exports, Merkle contract figures (Depth ≤ 4, 13,321 inputs, 2,135,652 terms, 2.90 s, 499,344 KiB), security.md quote; EUDI iOS wrapper (Apache-2.0, iOS 16+, "initial development release", iOS 26 extension memory quote); Multipaz iOS notes "To be written"; datatracker -02 metadata; docs/PLAN.md milestones M1/M3/M4/M6/M8 exist.

Left unverified:
- Whether Dyne's WASI module runs in a browser/Safari, and whether anyone has published a WASI build of the Apache upstream (already marked [unverified]; no source found either way).
