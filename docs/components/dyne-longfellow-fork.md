# Dyne.org fork of longfellow and their analysis
_Researched 2026-09-01; independently re-verified 2026-09-02 (see Verification section). Every claim carries a source link. Unverified statements are marked [unverified]._

## What it is

[dyne/longfellow-zk](https://github.com/dyne/longfellow-zk) is the Dyne.org foundation's "European build" of Google's [longfellow-zk](https://github.com/google/longfellow-zk), the C++ library behind the ISO mDoc zero-knowledge circuit that Green Light's prover page runs. It is a *soft fork*: it is not a GitHub fork object (`fork: false`, created 2025-08-07) but a separate repository that vendors upstream `google/longfellow-zk` as a git submodule and re-packages it as an installable base library plus separate ECDSA, BIP340 and mdoc packages, so that a native, mobile or WebAssembly project can use it "without depending on a proprietary operating-system API" ([README][s2], [API][s3], [.gitmodules][s13]). Dyne's earlier README stated the motive directly: make longfellow "available for European wallets", accept contributions "without the need to sign any development agreement with Google", and remove "any dependency from the Google Play API for the use of this ZK technology" ([old README, 2025-11-25][s11]). The companion analysis, Jaromil's *Privacy in EUDI* (17 Jul 2025), argues that the longfellow component "will lose its privacy properties when embedded inside the 'Google Play' API or Apple's iOS frameworks" because the OS can see the credential data used to build the proof ([s29]). Two things changed on 2026-08-31, the day before this research: the repo tagged v1.0.0 and switched its licence from Apache-2.0 to GPL-3.0-or-later ([s6], [s9], [s10]). The fork has one human contributor (jaromil, 154 commits; dependabot, 2) ([s12]).

## Where it lives

| Item | URL | Licence | Version / tag / commit seen 2026-09-01 |
|---|---|---|---|
| Dyne fork repo | https://github.com/dyne/longfellow-zk | GPL-3.0-or-later (LICENSE at HEAD) [s7] | tag `v1.0.0` = `d2b0fc515f`, 2026-08-31; `pushed_at` 2026-08-31T23:15Z; 28 stars, 2 forks, 0 open issues [s3][s5][s6] |
| Last Apache-2.0 commit of the fork | https://github.com/dyne/longfellow-zk/commit/3d1d196a69 | Apache-2.0 (LICENSE at that commit) [s8] | `3d1d196a69`, 2026-08-22; GPL text lands in `6850cf53f8`, 2026-08-31 [s9][s10] |
| Upstream pinned by the fork (`vendor/longfellow-zk`) | https://github.com/google/longfellow-zk | Apache-2.0 [s32][s33] | submodule sha `5f348de0be` = upstream `main` HEAD, 2026-08-12, "Merge pull request #176 from google/rust" [s14][s33] |
| Upstream latest release | https://github.com/google/longfellow-zk/releases/tag/v0.9 | Apache-2.0 | `v0.9`, 2026-03-31 [s33] |
| Dyne docs site | https://dyne.org/longfellow-zk/ | — | pages: getting-started, packaging, architecture, security, specifications, projects [s16] |
| Dyne JS/WASM binding | https://github.com/dyne/longfellow-zk/blob/main/bindings/javascript/longfellow_zk.mjs | GPL-3.0-or-later | on `main` [s28] |
| *Privacy in EUDI* (the OS-API warning) | https://news.dyne.org/privacy-in-eudi/ | article | Jaromil (Denis Roio), 17 Jul 2025 [s29] |
| *The Longfellow ZK (Google-zk)* (benchmark/analysis) | https://news.dyne.org/longfellow-zero-knowledge-google-zk/ | article | Jaromil, 25 Jun 2025 [s30] |
| Upstream security reviews | https://google.github.io/longfellow-zk/docs/reviews/ | — | Trail of Bits 2025-08-18; ISRG (David Cook) fix in v0.8.4 2025-10-17; Ligero theoretical review Dec 2025 [s36][s37][s38] |
| Protocol spec | https://datatracker.ietf.org/doc/draft-google-cfrg-libzk/ | IETF I-D | `draft-google-cfrg-libzk-02`, 2026-07-22, Frigo and shelat [s39] |
| Funding | https://cordis.europa.eu/project/id/101132610 | — | PACESETTERS, HORIZON, 2024-03-01 to 2027-02-28; Stichting Dyne.org net EU contribution EUR 290,000 [s40] |
| Maintainer | https://dyne.org/longfellow-zk/ | — | Dyne.org foundation, Amsterdam, KvK 34237525, info@dyne.org [s16] |

## How Green Light uses it

- **SPEC §2, Circuit row** names "Google longfellow-zk; Dyne.org fork without Google Play dependency" as the source of the mDoc presentation circuit, and lists our work as audit, device-binding nonce check, and trust-list membership.
- **SPEC §7 and §5** cite "Dyne's analysis" as the reason the prover page, not an OS wallet, does the proving: "routing ZK through an OS API reintroduces a privacy leak." That sentence is a paraphrase of [s29]; the verbatim argument is quoted in the Status section below.
- **PLAN M1 (weeks 0–2)**: build longfellow "from `main` at a recorded commit" in WASM and Mopro native. The Dyne fork ships a `wasi` CMake preset and a JS binding with `generateCircuit`, `generateProof`, `verifyProof` ([s15][s28]); upstream ships `android.sh` / `ios.sh` NDK and Xcode scripts ([s34][s45]). Benchmark both and record which one the M1 go/no-go picks.
- **PLAN M4 (Sep 14 – Oct 11)**: the fork already contains a `FixedDepthSha256MerkleMembership` gadget (SHA-256, fixed depth up to 4, power-of-two tree, `expected_root` public) ([s25]). That is a starting point for the trust-list membership statement, but depth 4 means 16 leaves; SPEC §2 counts 21 states plus PR, so the depth cap must be raised or the design changed. M4 also requires "written review from Google longfellow or Dyne.org."
- **PLAN M8 item 1 / SPEC decision 2**: pilot on a *reviewed* 1.x tag. Dyne's `v1.0.0` is not that: Dyne's own security page says review documents "apply to their named revisions and scopes" and must not be transferred "across a fork or later protocol change" ([s21]). The upstream reviews name specific revisions, none of them a 1.x tag: Trail of Bits reviewed commit `981a349fad7eee38db94734e99718be052ad20ed` (July 2025, before `v0.8.1`) with fixes in `60c7180b78` and `487b3a585a`; ISRG's finding was fixed in `v0.8.4`; the Ligero analysis is protocol-only and names no revision ([s36][s37][s38]). No review names `v0.9` (corrected 2026-09-02; the earlier text said "v0.8.x–v0.9").
- **docs/PARTNERS.md row** "Google longfellow / Dyne.org" (owner eng B, reply by 2026-09-08, status "not sent", blocks M4 and M8 item 1): security-review status and the device-binding extension.
- **Licence**: SPEC line 2 declares Green Light Apache-2.0. As of 2026-08-31 the Dyne fork is GPL-3.0-or-later and its README says software distributed using the library "must be released under the same GPL terms" ([s2][s26]); non-GPL terms are offered on request via info@dyne.org ([s2]). Options: build on upstream (Apache-2.0), pin the fork at `3d1d196a69` (last Apache-2.0 LICENSE, [s8]), or negotiate. This needs an ADR before M3 ships the prover page.

## How to build or integrate

Native build, test and install, copied from the fork's README and getting-started page ([s2][s17]); requires a C++20 compiler, CMake 3.20+, Ninja and Git:

```sh
git clone --recurse-submodules https://github.com/dyne/longfellow-zk.git
cd longfellow-zk
cmake --preset release
cmake --build --preset release --parallel
ctest --preset release
cmake --install build/release --prefix "$PWD/build/prefix"
```

WASI / WebAssembly static library (the only non-native preset; there is no Android or iOS preset in `CMakePresets.json`) ([s15][s17]):

```sh
WASI_SDK_PATH=/path/to/wasi-sdk cmake --preset wasi
cmake --build --preset wasi --parallel
```

mdoc CLI, from the fork's mdoc project page ([s18]):

```sh
longfellow-zk-mdoc circuit_gen --zkspec list
longfellow-zk-mdoc circuit_gen --zkspec latest --circuit circuit.json
longfellow-zk-mdoc mdoc_prove --circuit circuit.json --mdoc mdoc.json --proof proof.bin
longfellow-zk-mdoc mdoc_verify --circuit circuit.json --proof proof.bin
```

CMake consumer (installed packages only; the docs say "source-tree paths are not a supported integration boundary") ([s18][s19]):

```cmake
find_package(LongfellowZK CONFIG REQUIRED)
find_package(LongfellowZKECDSA CONFIG REQUIRED)
find_package(LongfellowZKMDoc CONFIG REQUIRED)
target_link_libraries(app PRIVATE LongfellowZKMDoc::mdoc)
```

JavaScript binding (`bindings/javascript/longfellow_zk.mjs`, with `encoding.mjs` beside it): exports `setWasmPath(path)`, `generateCircuit(zkspecIndex)` (index 0–7), `bip340Smoke()`, `generateProof({circuitHex, mdocHex, pkxHex, pkyHex, transcriptHex, time, docType, zkspecIndex, attributes})`, `verifyProof({circuitHex, proofHex, pkxHex, pkyHex, transcriptHex, time, docType, zkspecIndex, attributes})`, plus re-exported `bytesToHex`/`hexToBytes`/`utf8ToHex`/`hexToUtf8`; each call resolves to `{result, logs}` where `result` is a JSON string. Binary values cross the WASM boundary as lowercase hex; the underlying C ABI returns `0` for success and any non-zero value is a failure "even if output text is present" ([s20][s28]) (parameter names corrected 2026-09-02; the earlier text had `circuit`/`mdoc`/`transcript`). The module loads the `.wasm` through Node's `readFile` and a minimal WASI preview1 shim ([s28]). `bindings/javascript/` contains only these two files ([s47]), so a browser loader for the Safari/Chrome path is our work [unverified that no browser loader exists elsewhere in the repo, e.g. under `docs/public` or `scripts`].

Parity check against Google's Rust implementation pinned in `vendor/longfellow-zk` ([s23]):

```sh
make google-rust-parity
```

Upstream, for comparison ([s32]): `CXX=clang++ cmake -D CMAKE_BUILD_TYPE=Release -S lib -B clang-build-release --install-prefix ${PWD}/install && cd clang-build-release && make -j 16 && ctest -j 16`; upstream Rust: `cargo build --release && cargo test -r` ([s35]).

## Status and risks

**Maturity.** The fork README at HEAD still says "pre-1.0 cryptographic software; read the security boundaries before production use" while the same day's tag is `v1.0.0` ([s2][s6]). The production-qualification page calls the current state "an additive release" and disclaims replacing "an independent cryptographic audit" ([s22]). Dyne's security page lists what is inside the boundary (collision-resistant hashing, Fiat–Shamir challenges, sound Ligero and sumcheck parameters, correct circuit compilation) and requires integrators to pin repository SHAs, toolchains and circuits and to "arrange independent cryptographic and implementation review for material deviations from reviewed upstream code" ([s21]).

**Reviews apply to upstream, not the fork.** Trail of Bits, "Google Longfellow Security Assessment", 2025-08-18, prepared by Joe Doyle and Marc Ilunga, 13 findings including "mdoc attribute check can be bypassed" and "MerkleTreeVerifier::verify_proof is vulnerable to path extension", with a fix-review appendix ([s37]); ISRG (David Cook) found under-constrained witness variables in the mdoc circuit, fixed in v0.8.4 ([s36]); Cascudo, Hazay, Venkitasubramaniam and Yogev (Ligero / Bar-Ilan), December 2025, theoretical only, conclude the parameters "target more than 115 bits of security" and explicitly exclude the implementation ([s38]). Upstream README still says the project "is currently undergoing two independent security reviews" ([s32]); whether anything beyond these three is pending is [unverified]. The fork's own Merkle fix on 2026-08-31, "reject trailing compressed proof nodes" ([s4]), shows this area is still moving.

**Interoperability with upstream is asserted, not proven.** The fork's interoperability page does not state that a Dyne-built proof verifies with Google's verifier; the parity suite compares "canonical values and normalized success/rejection decisions for a fixed corpus" and explicitly does not cover "full proof-byte equality" ([s23][s24]). Upstream's Rust README, by contrast, claims bit-by-bit equal proofs to the C++ prover ([s35]). If Green Light's verify service uses upstream and the page uses the fork, M1 must include a cross-verification test vector.

**Upstream is moving to Rust.** Google's Rust README says the goal is "to switch to this implementation in production" and that mdoc-zk circuits shrank about 10% ([s35]); the fork tracks the C++ tree and treats Rust as a read-only comparison ([s23][s24]). Divergence risk over the pilot window.

**Mobile native is aspirational in the fork.** Docs say "the Dyne work targets Android and iOS without requiring a proprietary proof API" ([s27]), but there are no Android or iOS presets or guides in the repo today ([s15][s43][s44]); upstream has `android.sh` (NDK, arm64-v8a, API 24) and `ios.sh` ([s34][s45]). For Mopro bindings, upstream is the nearer base.

**What the "Google Play dependency" actually is.** Upstream's `android.sh` contains no reference to Google Play, Play Services or Credential Manager ([s34]); the library itself is plain C++. Dyne's claim is about the deployment path: Google Wallet's age assurance uses ZKP ([s41][s46]), and Jaromil's argument is that when the prover runs inside the OS wallet API, the OS sees the inputs: the component "will lose its privacy properties when embedded inside the 'Google Play' API or Apple's iOS frameworks, which provide no guarantees that the data used to create a zero-knowledge proof will not be shared with other components of the Android or iOS operating systems", so those frameworks "will be the only ones able to process such data transparently, eventually matching it to other information, such as geolocation, time, and any other data already known by the system" ([s29]). His remedy is process isolation: "Until process isolation is granted for every execution of zero-knowledge algorithms, privacy-preserving technology won't protect us from mega-corporations spying on us" ([s29]). Green Light's PWA path receives the signed mdoc from the OS wallet via the DC API before proving (SPEC §3), so the OS has already handled the document; the fork does not remove that hand-off, it only removes the prover from the OS. Say so in the pilot report.

**Licence.** Apache-2.0 until 2026-08-22 (`3d1d196a69`), GPL-3.0-or-later from 2026-08-31 (`6850cf53f8`) ([s8][s9][s10]); the old README promised patches "under MIT and/or Apache 2.0" ([s11]). Inherited upstream files keep their Apache notices ([s2]).

**Maintenance and funding.** One active committer ([s12]); funding is a HORIZON culture-and-climate grant (PACESETTERS, coordinator NTNU) ending 2027-02-28 ([s40]). No stated maintenance commitment beyond that [unverified].

**Other.** Dyne's mdoc page warns to treat "the exact artifact schema and ZK specification index as versioned inputs, not values to hard-code independently" ([s18]); pin `--zkspec` per M1 record. Dyne's use-cases page notes "a query unique to one person can defeat privacy even if the proof reveals nothing else" ([s27]), relevant to SPEC §4's fixed `age_over_21` + `expiry_date` request. Google's 3 Jul 2025 blog post says only that Google open-sourced its ZKP libraries (pointing at `google/longfellow-zk`) to support EU age assurance with Sparkasse; it says nothing about a UK or US rollout order ([s41]). The earlier Wallet post of 29 Apr 2025 says Google is "integrating Zero Knowledge Proof (ZKP) technology into Google Wallet" for age verification (Bumble named as first partner), that UK residents "will soon be able to create digital ID passes with their U.K. passports", and that Arkansas, Montana, Puerto Rico and West Virginia are next for US digital IDs ([s46]). SPEC §7's "Google is shipping ZK age proofs inside Wallet" is consistent with [s46]; a "UK first, then US" ordering for the ZK feature specifically is not stated by either post (corrected 2026-09-02).

## Open questions for the partner call

- Trail of Bits names commit `981a349fad` and its fix review names `60c7180b78` / `487b3a585a` ([s37]); ISRG's fix is `v0.8.4` ([s36]). Which tagged release first contains all fixes, and is any further review (the "two independent security reviews" in the upstream README, [s32]) still open, given the reviews page lists none pending ([s36])? Date expected? (M8 item 1.)
- Will Dyne or Google review the two M4 additions (device-binding nonce, trust-list Merkle membership)? Would Google accept them as an upstream PR, given the Google CLA that Dyne's README objects to?
- Dyne's Merkle gadget is capped at depth 4 (16 leaves). Is a deeper tree planned, and is the no-domain-separator SHA-256 pairing intentional given ToB finding 4?
- Licence: is the GPL-3.0 switch permanent, and what terms would Dyne offer an Apache-2.0 project for a WASM prover shipped to browsers? Alternatively, does Dyne object to us pinning `3d1d196a69`?
- Has anyone verified a Dyne-built proof against Google's C++ or Rust verifier byte-for-byte? Can we get the fixture corpus used by `google-rust-parity`?
- Browser loader: is there a non-Node WASM loader for `longfellow_zk.mjs`, and has the WASI build run in Safari on an iPhone 13-class device (SPEC §8 memory concern)?
- Android/iOS: any timeline for native presets, or should Mopro bind upstream directly?
- Does Dyne accept that receiving the mdoc via the DC API already exposes the document to the OS, and what mitigation would they endorse for the PWA path (their answer is "process isolation")?
- Maintenance after PACESETTERS ends 2027-02-28: who funds, and is a second maintainer planned?
- Does upstream's move to Rust for production change which tree Dyne will track?

## Sources

All fetched 2026-09-01.

1. [s1] https://github.com/dyne/longfellow-zk
2. [s2] https://raw.githubusercontent.com/dyne/longfellow-zk/main/README.md
3. [s3] https://api.github.com/repos/dyne/longfellow-zk
4. [s4] https://github.com/dyne/longfellow-zk/commits/main
5. [s5] https://github.com/dyne/longfellow-zk/tags and https://api.github.com/repos/dyne/longfellow-zk/tags
6. [s6] https://github.com/dyne/longfellow-zk/releases/tag/v1.0.0 and https://api.github.com/repos/dyne/longfellow-zk/releases/latest
7. [s7] https://raw.githubusercontent.com/dyne/longfellow-zk/main/LICENSE
8. [s8] https://raw.githubusercontent.com/dyne/longfellow-zk/3d1d196a69/LICENSE
9. [s9] https://raw.githubusercontent.com/dyne/longfellow-zk/6850cf53f8/LICENSE
10. [s10] https://api.github.com/repos/dyne/longfellow-zk/commits?path=LICENSE
11. [s11] https://raw.githubusercontent.com/dyne/longfellow-zk/d9be2d752da15c2dab8e7b83591cfb3ba3fdf432/README.md
12. [s12] https://api.github.com/repos/dyne/longfellow-zk/contributors
13. [s13] https://raw.githubusercontent.com/dyne/longfellow-zk/main/.gitmodules
14. [s14] https://api.github.com/repos/dyne/longfellow-zk/contents/vendor
15. [s15] https://raw.githubusercontent.com/dyne/longfellow-zk/main/CMakePresets.json
16. [s16] https://dyne.org/longfellow-zk/
17. [s17] https://raw.githubusercontent.com/dyne/longfellow-zk/main/docs/getting-started.md
18. [s18] https://raw.githubusercontent.com/dyne/longfellow-zk/main/docs/projects/mdoc.md
19. [s19] https://raw.githubusercontent.com/dyne/longfellow-zk/main/docs/packaging.md
20. [s20] https://raw.githubusercontent.com/dyne/longfellow-zk/main/docs/api.md
21. [s21] https://raw.githubusercontent.com/dyne/longfellow-zk/main/docs/security.md
22. [s22] https://raw.githubusercontent.com/dyne/longfellow-zk/main/docs/production-qualification.md
23. [s23] https://raw.githubusercontent.com/dyne/longfellow-zk/main/docs/google-rust-parity.md
24. [s24] https://raw.githubusercontent.com/dyne/longfellow-zk/main/docs/interoperability.md
25. [s25] https://raw.githubusercontent.com/dyne/longfellow-zk/main/docs/merkle-membership-contract.md
26. [s26] https://raw.githubusercontent.com/dyne/longfellow-zk/main/docs/about.md
27. [s27] https://raw.githubusercontent.com/dyne/longfellow-zk/main/docs/use-cases.md
28. [s28] https://raw.githubusercontent.com/dyne/longfellow-zk/main/bindings/javascript/longfellow_zk.mjs
29. [s29] https://news.dyne.org/privacy-in-eudi/
30. [s30] https://news.dyne.org/longfellow-zero-knowledge-google-zk/
31. [s31] https://github.com/google/longfellow-zk
32. [s32] https://raw.githubusercontent.com/google/longfellow-zk/main/README.md
33. [s33] https://api.github.com/repos/google/longfellow-zk, .../releases, .../commits/main and https://github.com/google/longfellow-zk/releases
34. [s34] https://raw.githubusercontent.com/google/longfellow-zk/main/android.sh
35. [s35] https://raw.githubusercontent.com/google/longfellow-zk/main/rust/README.md
36. [s36] https://google.github.io/longfellow-zk/docs/reviews/
37. [s37] https://google.github.io/longfellow-zk/reviews/Longfellow_report_2025_08_18.pdf
38. [s38] https://google.github.io/longfellow-zk/reviews/Longfellow_security_2025_12_15.pdf
39. [s39] https://datatracker.ietf.org/doc/draft-google-cfrg-libzk/
40. [s40] https://cordis.europa.eu/project/id/101132610
41. [s41] https://blog.google/innovation-and-ai/technology/safety-security/opening-up-zero-knowledge-proof-technology-to-promote-privacy-in-age-assurance/
42. [s42] https://github.com/dyne/Zenroom-Android-app (the GDC25 Android demo named in [s30]; README today is a generic Zenroom demo, AGPL-3.0, no longfellow mention)
43. [s43] https://api.github.com/repos/dyne/longfellow-zk/contents/docs
44. [s44] https://raw.githubusercontent.com/dyne/longfellow-zk/main/docs/guide.md
45. [s45] https://api.github.com/repos/google/longfellow-zk/contents/
46. [s46] https://blog.google/products/google-pay/google-wallet-age-identity-verifications/ (added 2026-09-02)
47. [s47] https://api.github.com/repos/dyne/longfellow-zk/contents/bindings/javascript (added 2026-09-02)

[s1]: https://github.com/dyne/longfellow-zk
[s2]: https://raw.githubusercontent.com/dyne/longfellow-zk/main/README.md
[s3]: https://api.github.com/repos/dyne/longfellow-zk
[s4]: https://github.com/dyne/longfellow-zk/commits/main
[s5]: https://github.com/dyne/longfellow-zk/tags
[s6]: https://github.com/dyne/longfellow-zk/releases/tag/v1.0.0
[s7]: https://raw.githubusercontent.com/dyne/longfellow-zk/main/LICENSE
[s8]: https://raw.githubusercontent.com/dyne/longfellow-zk/3d1d196a69/LICENSE
[s9]: https://raw.githubusercontent.com/dyne/longfellow-zk/6850cf53f8/LICENSE
[s10]: https://api.github.com/repos/dyne/longfellow-zk/commits?path=LICENSE
[s11]: https://raw.githubusercontent.com/dyne/longfellow-zk/d9be2d752da15c2dab8e7b83591cfb3ba3fdf432/README.md
[s12]: https://api.github.com/repos/dyne/longfellow-zk/contributors
[s13]: https://raw.githubusercontent.com/dyne/longfellow-zk/main/.gitmodules
[s14]: https://api.github.com/repos/dyne/longfellow-zk/contents/vendor
[s15]: https://raw.githubusercontent.com/dyne/longfellow-zk/main/CMakePresets.json
[s16]: https://dyne.org/longfellow-zk/
[s17]: https://raw.githubusercontent.com/dyne/longfellow-zk/main/docs/getting-started.md
[s18]: https://raw.githubusercontent.com/dyne/longfellow-zk/main/docs/projects/mdoc.md
[s19]: https://raw.githubusercontent.com/dyne/longfellow-zk/main/docs/packaging.md
[s20]: https://raw.githubusercontent.com/dyne/longfellow-zk/main/docs/api.md
[s21]: https://raw.githubusercontent.com/dyne/longfellow-zk/main/docs/security.md
[s22]: https://raw.githubusercontent.com/dyne/longfellow-zk/main/docs/production-qualification.md
[s23]: https://raw.githubusercontent.com/dyne/longfellow-zk/main/docs/google-rust-parity.md
[s24]: https://raw.githubusercontent.com/dyne/longfellow-zk/main/docs/interoperability.md
[s25]: https://raw.githubusercontent.com/dyne/longfellow-zk/main/docs/merkle-membership-contract.md
[s26]: https://raw.githubusercontent.com/dyne/longfellow-zk/main/docs/about.md
[s27]: https://raw.githubusercontent.com/dyne/longfellow-zk/main/docs/use-cases.md
[s28]: https://raw.githubusercontent.com/dyne/longfellow-zk/main/bindings/javascript/longfellow_zk.mjs
[s29]: https://news.dyne.org/privacy-in-eudi/
[s30]: https://news.dyne.org/longfellow-zero-knowledge-google-zk/
[s31]: https://github.com/google/longfellow-zk
[s32]: https://raw.githubusercontent.com/google/longfellow-zk/main/README.md
[s33]: https://api.github.com/repos/google/longfellow-zk
[s34]: https://raw.githubusercontent.com/google/longfellow-zk/main/android.sh
[s35]: https://raw.githubusercontent.com/google/longfellow-zk/main/rust/README.md
[s36]: https://google.github.io/longfellow-zk/docs/reviews/
[s37]: https://google.github.io/longfellow-zk/reviews/Longfellow_report_2025_08_18.pdf
[s38]: https://google.github.io/longfellow-zk/reviews/Longfellow_security_2025_12_15.pdf
[s39]: https://datatracker.ietf.org/doc/draft-google-cfrg-libzk/
[s40]: https://cordis.europa.eu/project/id/101132610
[s41]: https://blog.google/innovation-and-ai/technology/safety-security/opening-up-zero-knowledge-proof-technology-to-promote-privacy-in-age-assurance/
[s42]: https://github.com/dyne/Zenroom-Android-app
[s43]: https://api.github.com/repos/dyne/longfellow-zk/contents/docs
[s44]: https://raw.githubusercontent.com/dyne/longfellow-zk/main/docs/guide.md
[s45]: https://api.github.com/repos/google/longfellow-zk/contents/
[s46]: https://blog.google/products/google-pay/google-wallet-age-identity-verifications/
[s47]: https://api.github.com/repos/dyne/longfellow-zk/contents/bindings/javascript

## Verification

Re-checked 2026-09-02 by an independent pass: every source URL in the Sources section was fetched live (GitHub REST API and raw files via curl, HTML pages, and both review PDFs via text extraction); 96 discrete claims (URLs, SHAs, dates, counts, version numbers, quoted strings, file and preset names) were compared against what the source actually says. GitHub API values (stars 28, forks 2, open issues 0, `pushed_at` 2026-08-31T23:15:19Z, tag `v1.0.0` = `d2b0fc515f`, contributors jaromil 154 / dependabot 2, submodule gitlink `5f348de0be`, LICENSE history `3d1d196a69` → `6850cf53f8`) were identical on 2026-09-02.

Corrections made:
- JS binding: parameter names are `circuitHex`, `mdocHex`, `proofHex`, `transcriptHex` (not `circuit`, `mdoc`, `transcript`); added the `bip340Smoke` export and encoding re-exports; clarified that the JS functions resolve to `{result, logs}` and that "return 0 on success" is the C ABI rule from api.md ([s20][s28]).
- Google Wallet rollout: [s41] (3 Jul 2025) does not say ZK age assurance "rolls out first in the UK, then the US". Replaced with what [s41] says (open-sourced ZKP libraries, Sparkasse/EU age assurance) and what the 29 Apr 2025 Wallet post [s46] says (ZKP integrated into Wallet, Bumble, UK passport ID passes, four more US states).
- Reviewed upstream revisions: replaced "Upstream's reviewed line is v0.8.x–v0.9" with the revisions the reports actually name: Trail of Bits commit `981a349fad` (fixes `60c7180b78`, `487b3a585a`), ISRG fix `v0.8.4`, Ligero protocol-only. No review names `v0.9` ([s36][s37][s38]).
- use-cases.md quote corrected to "without requiring a proprietary proof API" ([s27]).
- security.md quote corrected to "arrange independent cryptographic and implementation review for material deviations from reviewed upstream code" ([s21]).
- mdoc.md quote corrected to "not values to hard-code independently" ([s18]).
- Open question 1 updated with the Trail of Bits commit now that the PDF has been read.
- Reference link [s33] had a stray trailing comma; fixed. Added [s46] and [s47].

Confirmed on re-check (no change): Trail of Bits report dated August 18, 2025, prepared by Joe Doyle and Marc Ilunga, 13 findings, finding 4 "MerkleTreeVerifier::verify_proof is vulnerable to path extension" (Informational) recommends domain separation, finding 10 "mdoc attribute check can be bypassed" (High), Appendix C "Fix Review Results" ([s37]); Ligero report by Cascudo, Hazay, Venkitasubramaniam, Yogev, dated "Decenber 2025" (sic) in the PDF and December 15, 2025 on the reviews page, "parameters target more than 115 bits of security", "does not include any claims on the Longfellow ZK implementation" ([s36][s38]); Merkle gadget "V1 supports `Depth <= 4`", power-of-two `tree_size == 1 << Depth`, "no node domain separator" ([s25]); `CMakePresets.json` configure presets are base, release, debug, sanitizers, unix-makefiles, wasi ([s15]); upstream tree has `android.sh` and `ios.sh`, `android.sh` has no Play/Credential Manager reference ([s34][s45]); draft-google-cfrg-libzk-02, 2026-07-22, Frigo and shelat ([s39]); PACESETTERS 2024-03-01 to 2027-02-28, coordinator NTNU, Stichting Dyne.org EUR 290,000 ([s40]); PLAN M1/M4/M8 and PARTNERS row as quoted.

Left unverified:
- Whether a browser (non-Node) WASM loader exists anywhere in the fork outside `bindings/javascript/` (only the `bindings/` listing was checked; the GitHub API rate limit stopped a full-tree listing).
- Whether any further upstream security review is pending beyond the three published; the reviews page lists none, the upstream README still says "two independent security reviews" are underway ([s32][s36]).
- Which upstream tag first contains the Trail of Bits fix commits `60c7180b78` / `487b3a585a` (API rate-limited when queried).
- Any Dyne maintenance commitment after PACESETTERS ends 2027-02-28.
- The ISRG review itself: only Google's summary on the reviews page was available; no separate ISRG report was located.
- The claim that the Ligero report authors' affiliations are "Ligero / Bar-Ilan" is approximate: the PDF lists Cascudo (IMDEA Software Institute and Ligero Inc.), Hazay (Bar-Ilan and Ligero Inc.), Venkitasubramaniam (Georgetown and Ligero Inc.), Yogev (Bar-Ilan).
