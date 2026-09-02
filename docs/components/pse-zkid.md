# PSE zkID, OpenAC, client-side proving benchmarks
_Researched 2026-09-01; every source re-fetched and every claim re-checked 2026-09-02 (see Verification). Every claim carries a source link. Unverified statements are marked [unverified]._

## What it is (3-6 sentences)
zkID is a team inside Privacy Stewards of Ethereum (PSE) at the Ethereum Foundation that works on "research, coordination, education, and development of privacy-preserving, interoperable, and standards-aligned identity infrastructure" and says it drafts technical standards and prototypes infrastructure aligned with regulatory frameworks ([S5](#sources)). Its flagship protocol is OpenAC, a two-phase anonymous-credential presentation scheme (reusable offline `Prepare` proof of an issuer-signed credential, cheap online `Show` proof of predicates plus device binding to a verifier nonce) published as IACR ePrint 2026/251 and as a raw spec `1/OPENAC` with an `SD-JWT-P256` profile ([S7](#sources), [S28](#sources)). The reference stack is Circom circuits proven with Spartan2 + Hyrax Pedersen commitments (circuits compiled with secq256r1 as the native field, the paper calls the curve Tom256/T256, so that P-256 device signatures verify natively), shipped as the `openac-sdk` npm package (v5.0.0) and a Mopro/Flutter mobile PoC; an ISO 18013-5 mdoc/mDL path exists but is still being fixed ([S12](#sources), [S14](#sources), [S24](#sources)). The related PSE Client-Side Proving team runs `csp-benchmarks`, a quarterly harness that compares proving systems on canonical circuits (SHA-256, Keccak, Poseidon, ECDSA) on an AWS `mac2.metal` M1 host, with results on ethproofs.org ([S33](#sources), [S37](#sources)). Longfellow, the circuit Green Light uses, is treated by PSE as prior/related work, not as part of its stack ([S20](#sources), [S21](#sources)).

## Where it lives (table: item | URL | licence | version/tag/commit seen today)
| Item | URL | Licence | Version/tag/commit seen today |
|---|---|---|---|
| zkID repo (canonical name now `ethereum/zkID`; `privacy-ethereum/zkID` and `privacy-scaling-explorations/zkID` redirect) | https://github.com/ethereum/zkID | MIT (GitHub API) [S2] | `main` @ `b395e09c225ff45b003f0087c28e2e208e22f944` (2026-08-11); tag `v5.0.0` = same commit; pushed_at 2026-08-30; 82 stars, 19 forks [S2][S3][S22] |
| `1/OPENAC` core spec | https://github.com/ethereum/zkID/blob/main/specs/1-openac/README.md | no Copyright or licence section in the spec text (checked 2026-09-02; contrast `3/ZK-AGE-VERIFICATION`, which has a CC0 section); repo MIT | status `raw` in header, "in review" in specs index; editor Nicole Yeh [S6][S7] |
| `3/ZK-AGE-VERIFICATION` spec (Driver License, alcohol purchase, on OpenAC) | https://github.com/ethereum/zkID/blob/main/specs/3-zk-age-verification/README.md | CC0 (spec copyright section) | status `raw`; editor Nicole Yeh [S9] |
| OpenAC paper | https://eprint.iacr.org/2026/251 | n/a | received 2026-02-13, approved 2026-02-16; authors Eagen, Ngo, Rushi, Tong, Tsai, Xia [S28] |
| `openac-sdk` (SD-JWT ES256 prover/verifier, WASM) | https://www.npmjs.com/package/openac-sdk ; source `wallet-unit-poc/openac-sdk` | MIT | 5.0.0 on npm; release commit `ecc9799` 2026-08-10 [S3][S13][S29] |
| mdoc/mDL circuit + protocol note | https://github.com/ethereum/zkID/blob/main/wallet-unit-poc/circom/docs/mdoc-spec.md ; `circuits/mdoc.circom` | MIT (repo) | open PR #107 "make mdoc presentations verify as linked" (2026-08-30) [S14][S16][S24] |
| Mobile PoC (Mopro + Flutter, iOS/Android) | https://github.com/ethereum/zkID/tree/main/wallet-unit-poc/mobile | MIT (repo) | benchmarks on iPhone 17 / Pixel 10 Pro [S17] |
| `csp-benchmarks` (canonical name now `ethereum/csp-benchmarks`) | https://github.com/ethereum/csp-benchmarks | no LICENSE file at repo root; API license null [S31][S35] | `main` @ `993afae38287f97a1cea3ae47d39c6786d1a30ee` (2026-08-20, "Add BLAKE3 benchmarks"); 22 stars [S32] |
| Benchmark results UI | https://ethproofs.org/csp-benchmarks | n/a | "last updated Jul 29, 2026" [S37] |
| Spec process (COSS) and spec incubator (`zkspecs/zkspecs` now redirects to `ethereum/zkspecs`) | https://github.com/zkspecs/zkspecs | MIT (repo); COSS doc itself GPL-3 | `1/COSS` draft [S48][S49] |
| Team pages and roadmap | https://pse.dev/projects/zk-id ; https://pse.dev/mastermap/zkid ; Notion roadmap linked from README (could not be read: client-rendered) | n/a | mastermap shows "Roadmap Completion: 50%" [S38][S40] |
| TWDIW integration PoC (Taiwan MODA wallet) | https://github.com/zkmopro/TWDIW-integration | none (GitHub API `license: null`, checked 2026-09-02) | README fetched at `1c024e7` (last push 2026-02-17) [S50] |

Contact channels seen today: Discord invite https://discord.gg/5vv7bk5u5y (the invite resolves to the "Eth R&D" server, not a PSE-only server; checked via the Discord invite API 2026-09-02) and X @PrivacyEthereum (site footer/mastermap) [S40]; GitHub issues on `ethereum/zkID` (CONTRIBUTING: "open a new issue") [S10]; spec editors/contributors in spec headers: Nicole Yeh (<Nicole.yeh@ethereum.org> in `1/OPENAC`, <nicole@ethereum.org> in `3/ZK-AGE-VERIFICATION`), Vikas Rushi <vikas.rushi@ethereum.org>, Vivian Plasencia <vivian.plasencia@ethereum.org>, Moven Tsai <moven.tsai@ethereum.org>, Vivian Jeng <vivian.jeng@ethereum.org> [S7][S9]; Client-Side Proving team: Alex Kuzmin <alex.kuzmin@ethereum.org>, Miha Stopar <miha.stopar@ethereum.org> [S39]. No Telegram or mailing list found [unverified].

## How Green Light uses it (tie to SPEC.md sections and the milestone in docs/PLAN.md)
- SPEC §2 row "Standards + benchmarks" and §5 "PSE zkID (EF)": the ask is "co-author the US mDL profile; review circuit". PARTNERS.md row: owner convener, reply-by 2026-09-11, blocks M4 review and M9 report; status "not sent" (M0 gate).
- SPEC §10 decision 5 / ADR-0005: contribute the AAMVA / US mDL ZK profile "through PSE zkID's existing ETSI/ISO channels rather than open a new track". PLAN M9 deliverable: "US mDL ZK profile contribution submitted through PSE zkID's ETSI and ISO channels" plus a public report "co-published with PSE zkID".
- SPEC §6a / PLAN M6: the Level 2 demo is "the artifact PSE zkID can benchmark against". PLAN M1 (weeks 0-2, iPhone 13 / Pixel 6, p95 < 5 s) can reuse PSE's benchmark methodology (wall time, peak memory via `/usr/bin/time`, proof and preprocessing sizes, `BENCH_INPUT_PROFILE`) and its mobile device choice: PSE's June 2025 mobile run used exactly an iPhone 13 Pro and a Pixel 6 [S33][S41].
- SPEC §3 circuit items 1 (trust-list membership) and 4 (device-bound nonce signature) both already appear in PSE's mdoc protocol note as "optional extensions": "Merkle membership proof against an IACA root (public input)" and "Device-key unlinkability", and the note argues X.509 chain validation in-circuit is impractical, favouring "Merkle membership against a pre-validated trust root" [S14]. This is the technical basis for the M4 circuit review ask.
- Not a runtime dependency: Green Light proves with longfellow (SPEC §2 "Circuit" row). OpenAC is a different prover stack (Circom/Spartan2, SD-JWT-first). The relationship is standards, review, benchmarks and co-publication, not code reuse, unless the M1 go/no-go fails and an OpenAC mdoc path is reconsidered.

## How to build or integrate (concrete commands or API calls, copied from the source with the source linked)
Run PSE's benchmark harness locally ([S33](#sources)):
```bash
cargo build --release --workspace
BENCH_INPUT_PROFILE=full cargo bench            # Rust systems; BENCH_INPUT_PROFILE=reduced for smoke tests
cargo build --release -p utils
BENCH_INPUT_PROFILE=full bash ./benchmark.sh --system-dir ./barretenberg --logging --quick   # non-Rust systems
```
Toolchain per README: `nightly-2025-08-18-aarch64-apple-darwin` default, `1.97.1` for `binius64`, `nightly-2025-04-06` for `nexus`/`cairo-m`; Homebrew `bash jq hyperfine`; peak RAM = average of 10 `/usr/bin/time` samples [S33]. Note the repo's `rust-toolchain.toml` pins `nightly-2026-03-04` (checked 2026-09-02), so the README's default-toolchain line is stale. Byte-input sizes are `[128, 256, 512, 1024, 2048]` for `full` (`utils/src/metadata.rs`) [S56].

Add a system (e.g. longfellow) to the harness ([S34](#sources)): eligibility "at least 96 bits of security"; a non-Rust system needs a top-level folder registered in `.github/workflows/sh_benchmarks_parallel.yml`, scripts `[target]_prepare.sh`, `[target]_prove.sh`, `[target]_verify.sh`, `[target]_measure.sh` (optional `[target]_prove_for_verify.sh`), a `bench_props.json` (with a conservative `is_zk`), optional `bench_flags.json` (`"feat": {"ecdsa": "secp256r1"}`), and `circuit_sizes.json`; `[target]_measure.sh` writes `{ "proof_size": ..., "preprocessing_size": ... }`. Rust systems use `utils::define_benchmark_harness!(BenchTarget::Sha256, ProvingSystem::..., None, "sha256_mem_...", PROPS, |_| None, prepare, num_constraints, prove, verify, preprocessing_size, proof_size)`.

Mobile harness in `csp-benchmarks/mobile/plonky2` ([S36](#sources)): `cargo run --bin compile_sha256_circuit`, then `CONFIGURATION=release cargo run --bin ios` / `cargo run --bin android`, open `ios/MoproApp.xcodeproj` or `android` in Android Studio.

OpenAC SDK ([S12](#sources)):
```bash
npm install openac-sdk        # Node 18+; browser needs preloaded WASM passed as wasmModule to OpenAC.init
```
```typescript
const openac = await OpenAC.init();
const keys = await openac.loadKeysFromUrl("1k");           // sizes "1k" | "2k" | "4k" | "8k"
const precomputed = await openac.precompute({ jwt, disclosures, issuerPublicKey, keys, predicates });
const proof = await openac.present({ precomputed, verifierNonce, devicePrivateKey, keys, predicates });
const result = await openac.verify(proof, keys.verifyingKeys(), { nonce, predicates, logicExpression, claimNormalization });
```
README warning copied verbatim: "A holder can generate their own P-256 key, sign a credential with any claim values they want, and produce a presentation that verifies with `valid: true`" — issuer trust must be enforced by the verifier from `result.issuerKey` [S12]. Note the SDK is SD-JWT only; the mdoc path is CLI/circuit-level.

Wallet-unit PoC circuits and CLI ([S11](#sources), [S18](#sources)): `yarn && yarn compile:jwt && yarn compile:ecdsa`; `RUST_LOG=info cargo run --release -- setup_ecdsa` / `prove_ecdsa`; in `ecdsa-spartan2`: `cargo run --release -- prepare setup --size 1k --input ../circom/inputs/jwt/1k/default.json`, `generate_shared_blinds`, `prepare prove`, `prepare reblind`, `show prove`, `show reblind`, `prepare verify`, `show verify`; one-shot `cargo run --release -- benchmark --size 1k --input ...`. First build ~15 min (witnesscalc-adapter compiles 30-44 MB `jwt_*.cpp`).

Mobile PoC ([S17](#sources)): `cargo install mopro-cli`; `rustup target add aarch64-apple-ios aarch64-apple-ios-sim`; Android needs NDK (`NDK_PATH`) and `rustup target add aarch64-linux-android armv7-linux-androideabi x86_64-linux-android i686-linux-android`; then `cd flutter && flutter run --release`.

Contributing a spec or profile ([S6](#sources), [S10](#sources), [S49](#sources)): specs live in `specs/<n>-<name>/README.md` with a YAML header (`slug`, `title`, `name`, `status`, `category`, `tags`, `editor`, `contributors`) under the COSS lifecycle raw -> draft -> stable; a spec "MUST have a single responsible editor"; CC0 recommended. Repo rules: open an issue first, fork, add tests, Conventional Commits with the project folder as scope, PR against `main`; "We do not accept pull requests for minor grammatical fixes". A US mDL profile would slot in as (a) an mdoc container profile for `1/OPENAC`, which today lists "profiles for `mdoc`, `X.509`" as out of scope and as an extension point [S7], and (b) an "accepted Driver License profile" for `3/ZK-AGE-VERIFICATION`, which "does not define the exact Driver License credential attribute schema" and leaves trust anchors and issuer allowlists to deployments [S9].

## Status and risks (maturity, reviews, maintenance, anything that threatens the plan)
**Maturity.** `1/OPENAC` is `raw`, explicitly "conservative", and excludes revocation, nullifiers, on-chain verification and mdoc/X.509 profiles; its own text says promotion needs an editor, fixtures and test vectors [S7]. `3/ZK-AGE-VERIFICATION` is `raw`, MVP-scoped to online alcohol purchase with age >= 18 inferred from the issuance policy of a Driver License credential rather than from a DOB or age_over claim, and its implementation track is the Taiwan TWDIW app [S9][S50]. The mdoc path: `mdoc.circom` exists and `mdoc-spec.md` documents ISO 18013-5 checks, but open PR #107 (2026-08-30) states three defects "each of which on its own made `verify_linked` fail for every mdoc presentation" and that no test caught them [S14][S24]. The specs index still lists OpenAC as "under separate review", and issue #86 (oskarth, 2026-05-01, open) proposes moving specs out to `zkspecs` as "the canonical spec home", so the spec home may move [S6][S26]. Issue #89 (still open) tracks 14 verifier-boundary questions for OpenAC; all 14 checklist items are ticked and the 2026-05-22 comment says "All 14 items resolved in privacy-ethereum/zkID#88 commit 98be1f6", so the questions are resolved in spec text even though the issue was never closed [S27].

**Benchmarks, with numbers.** (1) `csp-benchmarks`: AWS `mac2.metal`, Apple M1 8 cores, 16 GB, quarterly; circuits SHA-256, Keccak, Poseidon, Poseidon2, ECDSA at 128 B-2,048 B inputs; 16 systems (Barretenberg, Binius64, Cairo-M, Circom, Expander, Flock, Jolt, Ligetron, Miden, Plonky2, Provekit, Provekit-Groth16, Risc0, Rookie-Numbers, Spartan2, Stark-V). SHA-256 128 B sample: Flock 32 ms / 45.31 MB / 380.74 KB proof; Binius64 46 ms; Spartan2 73 ms; Circom 356 ms with a 1,009-byte proof; Ligetron (Ligero) 828 ms, 3.51 MB proof; Risc0 18.5 s [S37]. Longfellow is not in the harness [S35]. Phones are a "future plan" (cloud device farm) [S33]. (2) June 2025 PSE post (Kuzmin, Du): SHA-256 for SD-JWT on iPhone 13 Pro (6 GB) and Pixel 6 (8 GB): Binius (no-lookup) 5.0124 s / 22 MB and 5.1023 s / 45 MB; Ligero 29.77 s and 93.59 s; Plonky2 "Crashed (out of memory)" on both [S41]; the input for that table is a 2 kB SHA-256 message ("a typical SD-JWT in this application is about 2 kB"), and Ligero there runs on WebGPU via Ligetron [S41]. (3) OpenAC mobile PoC, iPhone 17 (A19, 8 GB) vs Pixel 10 Pro (Tensor G5, 16 GB), 1,920-byte payload: Prepare prove 2,102 / 5,161 ms, reblind 884 / 1,732 ms, verify 137 / 318 ms, peak 2.27 GiB; Show prove 85 / 308 ms, reblind 30 / 130 ms, verify 13 / 65 ms, peak 1.96 GiB [S17]. The paper reports slightly different runs (Show 99 / 340 ms; Prepare 2,987 / 7,318 ms; proof sizes 40.41 kB and 109.29 kB) [S19]. Desktop (MacBook Pro M5, 24 GB): Prepare prove 1,119-6,999 ms for 1k-8k, proving key 257 MB-1.5 GB; Show prove 57-74 ms, 40.51 KB proof [S18]. (4) Paper comparison for a 1,920-byte MSO (hardware differs: Azure F16as_v6 for others, MacBook Pro M4 for OpenAC): Longfellow setup 7,235 / prove 680 / verify 324 ms, proof 325 kB; OpenAC setup 4,193 / precompute 3,442 / prove 102 / verify 83 ms, proof 149.7 kB [S21]. PSE's own summary of longfellow: "approximately 60 ms to prove a single ECDSA signature and around 1.2 s for a complete mDL presentation on mobile devices" and "the absence of a reusable offline phase" [S20]. ETSI TR 119 476-1 V1.3.1 (2025-08) clause 6.5.4.1 gives the same figure (written "around 1,2 seconds") "on a high-end mobile phone (such as a Google Pixel 6)" for Frigo-Shelat [S47].

**ETSI TS 119 476-2.** Title: "Selective disclosure and zero-knowledge proofs applied to Electronic Attestation of Attributes; Part 2: Implementation in EUDI Wallet". EU tracking issue #498 (opened 2026-01-01): not yet published; 2026-03-18 update "Stable Draft is expected on November 30, 2026, and publication on February 28, 2027"; 2026-06-06 update targets a stable draft for public review by end of Q3 2026 [S44]. PSE's mastermap lists "OpenAC ETSI Profile: Development of a draft specification of the OpenAC profile as a contribution to ETSI TS 119 476-2 - In Progress" [S40]. The published TR 119 476-1 V1.3.1 contains zero mentions of OpenAC, PSE or zkID (grep of the PDF text) [S47]; the EU's ZKP discussion paper v1.4 names BBS+/BBS#, Frigo-Shelat, Crescent and zk-creds, not OpenAC [S46]. No ETSI document or contribution record naming PSE was found [unverified]. Risk: the TS is scoped to the EUDI Wallet and its stable draft lands after Green Light's M9 (2026-12-20), so an AAMVA profile "through ETSI" may not fit the document or the calendar.

**EU deployments.** Mastermap items: "EU Commission Engagement - Presentations and workshops with the European Commission on OpenAC - Completed"; "Third Party Wallet Integration - Technical collaboration with EU wallet vendors and integration testing with MODA/TWDIW - Ongoing"; impact goal "2 governments using Ethereum (or L2) as an identity trust registry" [S40]. The only integration with a named government found is Taiwan's MODA TWDIW wallet (PoC repo, age-verification spec implementation notes, TWDIW CCG slides "ZKP Exploration - Based on zkID, Ying Tong and Privacy & Scaling Explorations") [S50][S9][S51]. No EU member-state deployment or named EU wallet vendor was found; SPEC §5's "EU deployments" is [unverified]. The Feb 2026 newsletter says only "continued work on OpenAC integrations" [S42].

**Reviews/audits.** PR #96 title "codify audit v2 invariants" for `2/ZK-PROOF-OF-PERSONHOOD` references fixes from `zkmopro/zkID#75` [S23]; no public audit report for OpenAC or the mdoc circuit was located [unverified]. `csp-benchmarks` CONTRIBUTING states it does "not act as a full auditor" of benchmarked systems [S34].

**Maintenance.** Active: commits 2026-08-10/11, PR 2026-08-30, three open PRs, ten open issues including #40 "Android Implementation Shows Significantly Slower Performance" (2-4x vs iOS) and #38 verifier page-fault overhead with a ~400 MB verifying key [S23][S25]. `csp-benchmarks`: 16 open issues plus 1 open PR (the API's `open_issues_count` of 17 counts both), BLAKE3 added 2026-08-20 but not yet on the ethproofs page (last updated Jul 29, 2026) [S31][S32][S37]. Org/repo renames (privacy-scaling-explorations -> privacy-ethereum -> ethereum) mean links in the READMEs and package.json are stale but redirect [S5][S13].

**Plan threats.** (a) PSE's standards channel is EUDI/ETSI-first and the OpenAC ETSI profile is unfinished; a US mDL profile may need a different venue (AAMVA, ISO 18013-5 ZK work referenced by the TR) [S47]. (b) PSE benchmarks do not cover longfellow or phones; Green Light's M1 numbers will be new evidence rather than a comparison against PSE data. (c) PSE's own mdoc work is a competing design to longfellow-in-browser; reviewer bandwidth for a longfellow fork is unknown. (d) Contact for the ask is a public Discord and GitHub issues; no named partner-relations contact found.

## Open questions for the partner call (bullets; these feed docs/PARTNERS.md)
- Who is the responsible editor for an mdoc/AAMVA profile: `1/OPENAC` extension, `3/ZK-AGE-VERIFICATION` "accepted Driver License profile", or a new numbered spec in `ethereum/zkID` vs `zkspecs` (issue #86)? Will PSE accept a longfellow-based profile that does not use OpenAC's Prepare/Show split?
- ETSI: is PSE an ETSI member or contributing via a member? Which meeting/contribution number carries the OpenAC profile, and can a US mDL annex ride on it before the end-Q3-2026 stable draft? If not, which ISO channel did SPEC §5 mean?
- Which EU wallet vendors and which Commission workshops are behind "EU wallet vendors" and "EU Commission Engagement"? Is any EU pilot live, or is TWDIW the only government integration?
- Circuit review (M4): will PSE review a longfellow fork adding IACA-root Merkle membership and a nonce-signature check, given their mdoc note already proposes both? Expected turnaround before 2026-10-11?
- Benchmarks: would PSE add longfellow to `csp-benchmarks` (non-Rust folder, ECDSA + SHA-256 targets, `is_zk` evidence) and accept Green Light's iPhone 13 / Pixel 6 numbers into the quarterly results or a co-published report?
- mdoc status: when does PR #107 land, is there a test vector set for ISO 18013-5 presentations, and is any audit of OpenAC or `mdoc.circom` scheduled?
- Age semantics: their age spec infers age from issuance policy; Green Light needs `age_over_21` from the MSO. Are they open to a US profile using the mdoc date/boolean normalization in `mdoc-spec.md`?
- Trust registry: their impact goal is "governments using Ethereum (or L2) as an identity trust registry"; would PSE be a signer on the ERC-7812 VICAL-root multi-sig (ADR-0003)?
- Licensing: confirm licence for `1/OPENAC` text and for `csp-benchmarks` (no LICENSE file) before reuse in an Apache-2.0 repo.
- Contacts: who is the single point of contact and reply-by owner for the 2026-09-11 ask?

## Sources (numbered list of every URL you fetched, with the date)
All fetched 2026-09-01 and re-fetched 2026-09-02 (GitHub via authenticated `gh api` and raw.githubusercontent.com; client-rendered pse.dev blog bodies taken from the `privacy-ethereum/pse.dev` source repo, `content/articles/*.md`).
1. https://github.com/privacy-ethereum/zkID (redirects to ethereum/zkID)
2. https://api.github.com/repos/privacy-ethereum/zkID
3. https://api.github.com/repos/privacy-ethereum/zkID/commits?per_page=3
4. https://api.github.com/repos/privacy-ethereum/zkID/contents
5. https://github.com/ethereum/zkID/blob/main/README.md
6. https://github.com/ethereum/zkID/blob/main/specs/README.md
7. https://github.com/ethereum/zkID/blob/main/specs/1-openac/README.md
8. https://github.com/ethereum/zkID/blob/main/specs/1-openac/SOURCE-MATRIX.md
9. https://github.com/ethereum/zkID/blob/main/specs/3-zk-age-verification/README.md
10. https://github.com/ethereum/zkID/blob/main/CONTRIBUTING.md
11. https://github.com/ethereum/zkID/blob/main/wallet-unit-poc/README.md
12. https://github.com/ethereum/zkID/blob/main/wallet-unit-poc/openac-sdk/README.md
13. https://github.com/ethereum/zkID/blob/main/wallet-unit-poc/openac-sdk/package.json
14. https://github.com/ethereum/zkID/blob/main/wallet-unit-poc/circom/docs/mdoc-spec.md
15. https://github.com/ethereum/zkID/blob/main/wallet-unit-poc/circom/README.md
16. https://github.com/ethereum/zkID/tree/main/wallet-unit-poc/circom/circuits
17. https://github.com/ethereum/zkID/blob/main/wallet-unit-poc/mobile/README.md
18. https://github.com/ethereum/zkID/blob/main/wallet-unit-poc/ecdsa-spartan2/README.md
19. https://github.com/ethereum/zkID/blob/main/paper/experiments.tex
20. https://github.com/ethereum/zkID/blob/main/paper/longfellow.tex
21. https://github.com/ethereum/zkID/blob/main/paper/comparison.tex
22. https://github.com/ethereum/zkID/tags (via GitHub API list_tags)
23. https://api.github.com/repos/ethereum/zkID/pulls?state=open&per_page=10
24. https://api.github.com/repos/ethereum/zkID/pulls/107
25. https://api.github.com/repos/ethereum/zkID/issues?state=open&per_page=20
26. https://api.github.com/repos/ethereum/zkID/issues/86
27. https://api.github.com/repos/ethereum/zkID/issues/89
28. https://eprint.iacr.org/2026/251
29. https://registry.npmjs.org/openac-sdk/latest
30. https://github.com/privacy-ethereum/csp-benchmarks (redirects to ethereum/csp-benchmarks)
31. https://api.github.com/repos/privacy-ethereum/csp-benchmarks
32. https://api.github.com/repos/privacy-ethereum/csp-benchmarks/commits?per_page=3
33. https://github.com/ethereum/csp-benchmarks/blob/main/README.MD
34. https://github.com/ethereum/csp-benchmarks/blob/main/CONTRIBUTING.md
35. https://github.com/ethereum/csp-benchmarks (root listing via API; no LICENSE file)
36. https://github.com/ethereum/csp-benchmarks/tree/main/mobile and mobile/plonky2/README.MD
37. https://ethproofs.org/csp-benchmarks
38. https://pse.dev/projects/zk-id
39. https://pse.dev/projects/client-side-proving
40. https://pse.dev/mastermap/zkid
41. https://pse.dev/blog/efficient-client-side-proving-for-zkid
42. https://pse.dev/blog/pse-february-2026
43. https://ethereum.org/developers/tools/zkid/
44. https://github.com/eu-digital-identity-wallet/eudi-doc-standards-and-technical-specifications/issues/498
45. https://github.com/eu-digital-identity-wallet/eudi-doc-architecture-and-reference-framework/discussions/408
46. https://eudi.dev/latest/discussion-topics/g-zero-knowledge-proof/
47. https://www.etsi.org/deliver/etsi_tr/119400_119499/11947601/01.03.01_60/tr_11947601v010301p.pdf
48. https://raw.githubusercontent.com/zkspecs/zkspecs/main/README.md (github.com/zkspecs/zkspecs now redirects to github.com/ethereum/zkspecs)
49. https://github.com/zkspecs/zkspecs/blob/main/specs/1/README.md
50. https://github.com/zkmopro/TWDIW-integration/blob/main/README.md
51. https://hackmd.io/@denkeni/twdiw-ccg-20250513
52. https://github.com/w3c/tpac2025-breakouts/issues/33 (no PSE mention found)
53. https://arxiv.org/abs/2510.14693 (FibRace; fetched to check authorship: KKRT Labs/Hyli, not PSE)
54. https://pse-team.notion.site/zkID-2026-Roadmap-2fdd57e8dd7e80f48a37c24e9fbe09d6 (fetch returned no content; client-rendered; still empty on 2026-09-02)
55. https://raw.githubusercontent.com/privacy-ethereum/pse.dev/main/content/articles/efficient-client-side-proving-for-zkid.md and pse-february-2026.md (source of S41/S42 bodies, fetched 2026-09-02)
56. https://raw.githubusercontent.com/ethereum/csp-benchmarks/main/rust-toolchain.toml and utils/src/metadata.rs (fetched 2026-09-02)
57. https://discord.com/api/v10/invites/5vv7bk5u5y (fetched 2026-09-02; guild name "Eth R&D")

## Verification
_Re-verified 2026-09-02 by an independent pass. Every URL in the Sources section was fetched again (S1-S54, plus S55-S57 added during verification); 94 discrete factual claims (URLs, versions, commits, dates, counts, benchmark numbers, quoted text, statuses, names) were checked against the live source. All 54 original URLs resolve; S1/S30 redirect to `ethereum/*`, S48/S49 redirect from `zkspecs/zkspecs` to `ethereum/zkspecs`, S54 (Notion) still returns no readable content, and S41/S42 bodies are client-rendered on pse.dev and were read from the `privacy-ethereum/pse.dev` source repo._

Confirmed unchanged on 2026-09-02 (selection): `ethereum/zkID` MIT, 82 stars, 19 forks, pushed 2026-08-30, `main` = `b395e09c` (2026-08-11) = tag `v5.0.0`; `openac-sdk` 5.0.0 MIT published 2026-08-10 (release commit `ecc9799`); 3 open PRs (#107 2026-08-30 open, #96, #94) and 10 open issues (#40, #38, #86, #89 among them); PR #107 body quotes; ePrint 2026/251 title, six authors, received 2026-02-13, approved 2026-02-16; `csp-benchmarks` `main` = `993afae3` (2026-08-20 "Add BLAKE3 benchmarks"), 22 stars, no LICENSE file, API `license: null`; ethproofs hardware, 16 systems, 5 circuits, SHA-256/128 B numbers, "last updated Jul 29, 2026"; mobile PoC iPhone 17 / Pixel 10 Pro tables and peak memory; paper `experiments.tex` and `comparison.tex` numbers and hardware; desktop M5 table; every quoted README/CONTRIBUTING/spec sentence; mastermap items and statuses ("OpenAC ETSI Profile" In Progress, "EU Commission Engagement" Completed, "Third Party Wallet Integration" Ongoing, 50% completion, "2 governments" goal); EU issue #498 dates (opened 2026-01-01; 2026-03-18 and 2026-06-06 updates); EU ZKP paper v1.4 scheme list with no OpenAC; TR 119 476-1 V1.3.1 (2025-08) with zero OpenAC/PSE/zkID mentions; PSE longfellow summary quotes; Feb 2026 newsletter "continued work on OpenAC integrations"; hackmd TWDIW slide quote; W3C TPAC issue #33 and arXiv 2510.14693 negative checks; ethereum.org zkID page; Client-Side Proving team emails.

Corrections made:
- Issue #89 was described as tracking "14 unresolved" questions. All 14 checklist items are ticked and the 2026-05-22 comment states they were resolved in PR #88 (commit `98be1f6`); the issue is merely still open. Reworded (source: S27, issue body and comments).
- `csp-benchmarks` "17 open issues" corrected to 16 open issues plus 1 open PR; the API `open_issues_count` of 17 counts both (source: S31 and the issues endpoint filtered on `pull_request`).
- June 2025 PSE mobile benchmark input size was marked [unverified]; the post states the table uses a 2 kB SHA-256 input modelling a typical SD-JWT. Filled in and unmarked (source: S41 via S55).
- ETSI TR clause reference tightened from 6.5.4 to 6.5.4.1, and the figure quoted as written in the TR ("around 1,2 seconds") (source: S47, extracted PDF text).
- Proving-stack wording "Spartan2 + Hyrax over secp256r1" corrected: the circuits are compiled with secq256r1 as the native field (paper: Tom256/T256) so P-256 signatures verify natively; Hyrax is the commitment scheme (sources: S11, S19).
- `1/OPENAC` licence changed from [unverified] to a verified negative: the spec text has no Copyright or licence section, unlike `3/ZK-AGE-VERIFICATION` (source: S7).
- TWDIW-integration licence changed from "not checked [unverified]" to none (GitHub API `license: null`; last push 2026-02-17) (source: GitHub API for S50).
- Discord link relabelled: the invite resolves to the "Eth R&D" server rather than a PSE-only server (source: S57).
- Nicole Yeh's editor address differs between the two specs (`Nicole.yeh@ethereum.org` vs `nicole@ethereum.org`); both now listed (sources: S7, S9).
- `csp-benchmarks` toolchain: README's `nightly-2025-08-18` default conflicts with `rust-toolchain.toml` (`nightly-2026-03-04`); noted, and the `full` byte-input sizes `[128, 256, 512, 1024, 2048]` cited to `utils/src/metadata.rs` (source: S56).
- `zkspecs/zkspecs` now redirects to `ethereum/zkspecs`; noted in the table and Sources (source: S48 redirect).
- Sources list extended with S55-S57 for the files used in verification.

Left unverified:
- No Telegram or mailing list for zkID (absence only; not exhaustively searched).
- No ETSI document or contribution record naming PSE (searched the TR text and the EU tracking issue only; ETSI member portal not accessible).
- SPEC §5's "EU deployments" and the mastermap's "EU wallet vendors": no named vendor, pilot or member state found; Taiwan TWDIW remains the only named government integration.
- No public audit report for OpenAC or `mdoc.circom` (the only audit artefacts seen, `audit_report_v2/v3.md`, belong to `2/ZK-PROOF-OF-PERSONHOOD` in `zkmopro/zkID`).
- Notion 2026 roadmap (S54) content: still client-rendered and unreadable.
- Reviewer bandwidth and a named partner-relations contact at PSE: not discoverable from public sources.
