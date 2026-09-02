# Can each component execute in the cloud?

Written 2026-09-02 from the verified notes in [components/](components/README.md). "Cloud sandbox" means a Claude Code cloud session (Ubuntu 24.04, fresh clone, no sudo needed for the toolchain script). "Actions" means GitHub Actions. A physical phone is an iPhone 13 on iOS 26 and a Pixel 6, both in the office.

## The matrix

| Component | Cloud sandbox | Actions | Needs a phone | Low-level infrastructure it needs | Note |
|---|---|---|---|---|---|
| Verify service, desk screen, prover page, trust-list (ours, Node) | yes, fully | yes | no | Node 24 only | 17 tests, budgets and PII scan run today |
| Test mDL fixtures | yes | yes | no | openssl for the test IACA/DS certs; `@owf/mdoc` 0.7.0 (pre-1.0) to sign the mdoc | longfellow caps the MSO at 2533 bytes, P-256 and SHA-256, one namespace |
| longfellow-zk, C++ line (v0.9 tag, reviewed) | yes | ubuntu runner | no | clang, cmake, OpenSSL, zstd, gtest, benchmark; circuits are ~100 MB (LFC1) | The reviewed line. No 1.x tag exists |
| longfellow-zk, Rust port (main since 2026-08-12) | yes | ubuntu runner | no | stable cargo; ~1 MB circuits (LFC2), under 100 MB RAM | Unreviewed. Google says it is the production target |
| longfellow WASM | only via the Dyne fork's WASI preset | ubuntu runner | no | WASI SDK, Node bindings | Fork is GPL-3.0 since 2026-08-31. Last Apache-2.0 commit is `3d1d196a69` |
| longfellow Android build (`android.sh`) | yes | ubuntu runner | to run it | Android NDK, arm64-v8a, static link | Builds in Linux, runs only on a device |
| longfellow iOS build (`ios.sh`) | no | macos runner | to run it | Xcode, CMake iOS toolchain | No Xcode in the Linux sandbox |
| Mopro bindings | CLI and Android jniLibs: yes | Android on ubuntu, iOS xcframework on macos | to run it | Rust nightly-2025-11-15 (pinned by mopro-ffi), NDK, Xcode | No longfellow adapter exists; the first one is ours to write |
| M1 benchmark (C1 to C6) | no | no | yes | the two phones, a USB cable, a laptop | Simulators are not accepted for timing or memory |
| Digital Credentials API hand-off | request-shape and CSP tests only | Playwright headless for D5, D6, D9 | yes, for the real call | Safari 26 on iOS 26 (iPhone 11 or later) or Chrome 141 on Android; a user gesture; HPKE or JWE decryption key held in the page | Responses are always encrypted; the page must hold the private key, which Apple's guidance assumes lives on a server |
| Apple Wallet relying party | no | no | yes | a domain we control with a DNS TXT record, a 2048-bit CSR, an Apple Business Connect reader-auth certificate (397 days), one brand per root domain | Mock profile returns a device signature and no issuer signature |
| Google Wallet relying party | no | no | yes | sandbox: published test key pair and a phone switched to sandbox; production: onboarding form, 3 to 5 business days, Google-signed certificate and `gw_rp_metadata_bytes` | Only accepts `openid4vp-v1-signed`. Google also proves age inside the wallet with `mso_mdoc_zk` |
| AAMVA VICAL fetch and parse | yes | yes | no | plain HTTPS, no registration, no fee | 10 to 12 jurisdictions; California is not in it; terms forbid redistribution and derivative works |
| Trust-list root publisher (ERC-7812) | Sepolia tests: yes | yes | no | an RPC endpoint, a funded Sepolia key, a Safe and an OpenZeppelin TimelockController, values below the BN128 prime | Mainnet and Sepolia singleton at `0x7812…7812`, never written to. A SHA-256 root must be reduced or replaced by a Poseidon root |
| Docker reference deployment | yes if the sandbox has Docker (verify on the first session) | ubuntu runner | no | Docker, a VM with port 443, a domain for Caddy | |
| Wipe checks D1 to D4 | no | no | yes | a real browser heap on both phones | |
| Onchain verifier, Semaphore nullifier | not in pilot | | | | A 291 to 325 KB longfellow proof costs 5 to 12 M gas in calldata alone |

Short version: everything we write ourselves, both longfellow build lines, the Android build, the trust-list pipeline and the Sepolia publisher run in the cloud. The iOS builds need a macOS runner. Anything that touches a wallet, a proof on a phone, or a browser heap needs the two phones and a relying-party registration with Apple and Google. There is no way around that, and no cloud service provides it.

## What the evidence changes in the plan

1. **Licence.** The Dyne fork went GPL-3.0 on 2026-08-31. An Apache-2.0 prover page cannot ship it. Options: pin the last Apache-2.0 commit `3d1d196a69`, port its WASI preset onto upstream, or ask Dyne for terms. ADR-0007, decided in M1.
2. **Reviewed tag.** There is no longfellow 1.x. The reviewed line is the C++ v0.9 tag with five Trail of Bits items still open; the Rust port is unreviewed. ADR-0002 now reads: pilot on v0.9 C++ or a later tag Google names as reviewed, never on the Rust `main`.
3. **Pilot state.** California is in both wallets but not in the VICAL; New York is in neither wallet. The trust-list root must union the VICAL with state-published IACA roots, and the pilot state must be one of the 11 states plus Puerto Rico that both wallets cover.
4. **VICAL terms.** Access is free and anonymous, so M8 item 4 is a permission question, not an access question: AAMVA's terms forbid derivative works. Ask for written permission in the partner call, or publish only the root and derive inclusion proofs from state roots.
5. **Decryption key in the page.** Both wallets encrypt the response to the relying party's key. The page must generate and hold that key per session. This is unavoidable and already within the simplicity budget; it must not become a server-side key, or the venue would see the mdoc.
6. **Google does it in-wallet.** Google Wallet already answers `mso_mdoc_zk` with a longfellow proof made inside the wallet. On Android the page may not need to prove at all. M1 measures both paths.
7. **Root encoding.** ERC-7812 values must be below the BN128 prime. Either publish a Poseidon root or reduce the SHA-256 root. Decide in M5 with Rarimo.

## What runs where, for the M1 engineer

- Day 1, cloud sandbox: `scripts/setup-toolchain.sh`, clone longfellow at v0.9 and at `main`, build both lines, run their tests, record circuit sizes and verifier time. Build the Android line with the NDK.
- Day 1, Actions macos runner: build the iOS line and the Mopro xcframework.
- Day 2 onward, phones: install, run 20 times per runtime, write JSON, generate `bench/REPORT.md`.
