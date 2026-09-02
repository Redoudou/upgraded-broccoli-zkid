# Mopro (zkmopro) mobile prover
_Researched 2026-09-01. Every claim carries a source link. Unverified statements are marked [unverified]._

## What it is
Mopro ("Mobile Prover") is a toolkit "for ZK app development on mobile" that "makes client-side proving on mobile simple", initially funded by a joint PSE/0xPARC grant and "currently incubated by PSE" ([1](https://github.com/zkmopro/mopro), [16](https://raw.githubusercontent.com/zkmopro/mopro/main/README.md)). It is not a proving system: it is a Rust crate (`mopro-ffi`) plus a CLI (`mopro-cli`) that cross-compile a Rust crate for iOS and Android and generate Swift, Kotlin, React Native, Flutter and WASM bindings with UniFFI, flutter_rust_bridge, uniffi-bindgen-react-native (a fork lives in the zkmopro org) and wasm-bindgen ([1](https://github.com/zkmopro/mopro), [34](https://raw.githubusercontent.com/zkmopro/mopro/main/mopro-ffi/Cargo.toml), [37](https://api.github.com/orgs/zkmopro/repos?per_page=100&sort=pushed), [43](https://raw.githubusercontent.com/zkmopro/mopro/main/mopro-ffi/README.md)). The FAQ lists the proof systems it wires up today as "Circom/Groth16(BN254 and BLS12-381), Halo2/Plonkish, Noir/Barretenberg", and, "due to its modular architecture", links community GKR, Binius, Spartan and Nova Scotia integrations (PRs #241, #244, #240 and an external repo) as examples of adding new systems; the FAQ does not call them "emerging" ([14](https://zkmopro.org/docs/FAQ/)); a gnark (Go, Groth16 BN254) template shipped in 0.3.6 on top of a third-party `rust-gnark` crate ([23](https://github.com/zkmopro/mopro/releases/tag/mopro-ffi-v0.3.6), [44](https://api.github.com/repos/zkmopro/mopro/pulls/691/files?per_page=100)). No docs page URL in the sitemap and no blog post title mentions longfellow, Ligero or mDoc ([15](https://zkmopro.org/sitemap.xml), [28](https://zkmopro.org/blog/)); in the issue tracker the only hit is a 2025-09-23 comment on the closed issue #438 "Age Verification Template" (opened 2025-05-22, closed 2025-09-30, asked for a Self-circuits age template) in which maintainer moven0831 calls longfellow-zk "a nice alternative for the integration" — no code, PR or follow-up ([36](https://api.github.com/search/issues?q=repo:zkmopro/mopro+longfellow+OR+ligero+OR+mdoc+OR+%22C%2B%2B+prover%22), [87](https://api.github.com/repos/zkmopro/mopro/issues/438/comments)), so for Green Light the value is the packaging pipeline, and the longfellow adapter is ours to write. Repo created 2023-08-29, 242 stars, 111 forks, 54 open issues+PRs, current release 0.3.7 (2026-07-14) ([10](https://api.github.com/repos/zkmopro/mopro), [12](https://crates.io/api/v1/crates/mopro-ffi)).

## Where it lives
| Item | URL | Licence | Version / tag / commit seen today |
|---|---|---|---|
| Monorepo (`mopro-ffi`, `cli`, `tests`) | https://github.com/zkmopro/mopro | `LICENSE-APACHE` and `LICENSE-MIT` both present ([17](https://api.github.com/repos/zkmopro/mopro/contents/)); GitHub reports Apache-2.0 ([10](https://api.github.com/repos/zkmopro/mopro)); pse.dev says "MIT" ([40](https://pse.dev/projects/mopro)) | `main` @ `a2ccb0c` 2026-07-30 "fix: replace dead ci-keys.zkmopro.org links (#725)" ([19](https://api.github.com/repos/zkmopro/mopro/commits?per_page=1)); latest release `mopro-cli-v0.3.7` 2026-07-14 ([11](https://api.github.com/repos/zkmopro/mopro/releases/latest)), `mopro-ffi-v0.3.7` same day ([3](https://github.com/zkmopro/mopro/releases)) |
| `mopro-ffi` crate | https://crates.io/crates/mopro-ffi | as repo | 0.3.7 (2026-07-14); 0.3.6 2026-05-28; 0.3.5 2026-03-08; 14,818 downloads ([12](https://crates.io/api/v1/crates/mopro-ffi)) |
| `mopro-cli` crate | https://crates.io/crates/mopro-cli | as repo | 0.3.7 (2026-07-14); 2,766 downloads ([26](https://crates.io/api/v1/crates/mopro-cli)) |
| Docs | https://zkmopro.org/docs/intro | — | docs version 0.3 ([2](https://zkmopro.org/docs/intro)); older 0.0.1/0.1/0.2 trees still served ([15](https://zkmopro.org/sitemap.xml)) |
| Pinned toolchain | `mopro-ffi/rust-toolchain.toml` | — | `channel = "nightly-2025-11-15"` since PR #717 (merged 2026-07-07), also used by CI and by a `WASM_NIGHTLY_TOOLCHAIN` constant in `app_config/constants.rs` that replaced the literal in `app_config/web.rs` ([84](https://api.github.com/repos/zkmopro/mopro/pulls/717), [86](https://api.github.com/repos/zkmopro/mopro/pulls/717/files?per_page=100)); `uniffi = "=0.32.0"` ([47](https://raw.githubusercontent.com/zkmopro/mopro/main/Cargo.toml)); `flutter_rust_bridge = "=2.11.1"`, `wasm-bindgen 0.2.95` ([34](https://raw.githubusercontent.com/zkmopro/mopro/main/mopro-ffi/Cargo.toml)) |
| `circom-prover` crate | https://crates.io/crates/circom-prover | as repo | 0.1.4 (2025-10-03) ([58](https://crates.io/api/v1/crates/circom-prover)); module deleted from monorepo 2026-06-21 ([45](https://api.github.com/repos/zkmopro/mopro/pulls/715)) |
| `rust-rapidsnark` (C++ wrap) | https://github.com/zkmopro/rust-rapidsnark | `MIT OR Apache-2.0` in crates.io metadata only; the repo has no LICENSE file and GitHub reports no licence ([82](https://crates.io/api/v1/crates/rust-rapidsnark)) | 0.1.4 (2026-07-29) ([82](https://crates.io/api/v1/crates/rust-rapidsnark)) |
| `witnesscalc-adapter` (C++ wrap) | https://github.com/zkmopro/witnesscalc_adapter | `MIT OR Apache-2.0` in crates.io metadata only; the repo has no LICENSE file and GitHub reports no licence ([83](https://crates.io/api/v1/crates/witnesscalc-adapter)) | 0.1.7 (2025-10-11) ([83](https://crates.io/api/v1/crates/witnesscalc-adapter)) |
| `noir-rs` (Barretenberg C++ wrap) | https://github.com/zkmopro/noir-rs | Apache-2.0 ([22](https://github.com/zkmopro/noir-rs)) | tag `v1.0.0-beta.19` ([77](https://zkmopro.org/docs/adapters/noir)); pins `barretenberg-rs = "=4.2.0-aztecnr-rc.2"` in its `Cargo.toml` ([88](https://raw.githubusercontent.com/zkmopro/noir-rs/main/Cargo.toml), [77](https://zkmopro.org/docs/adapters/noir)) — not the crates.io newest (6.0.0-nightly.20260901; latest stable 5.2.0, 2026-08-17) ([78](https://crates.io/api/v1/crates/barretenberg-rs), [79](https://docs.rs/crate/barretenberg-rs/latest)) |
| `rust-gnark` (Go wrap, third party) | https://github.com/FluxePay/rust-gnark | MIT per GitHub ([73](https://api.github.com/repos/FluxePay/rust-gnark)); `MIT OR Apache-2.0` in crates.io metadata ([59](https://crates.io/api/v1/crates/rust-gnark)) | 0.0.2 (2026-02-24), 0 stars ([59](https://crates.io/api/v1/crates/rust-gnark), [73](https://api.github.com/repos/FluxePay/rust-gnark)) |
| Swift / Kotlin packages | https://github.com/zkmopro/mopro-swift-package, https://github.com/zkmopro/mopro-kotlin-package | Apache-2.0 / not specified | pushed 2025-12-24 / 2026-01-19 ([51](https://api.github.com/repos/zkmopro/mopro-swift-package), [52](https://api.github.com/repos/zkmopro/mopro-kotlin-package)) |
| `mopro-wasm` crate | — | — | not on crates.io (404) ([27](https://crates.io/api/v1/crates/mopro-wasm)); WASM is now the `wasm` feature of `mopro-ffi` ([34](https://raw.githubusercontent.com/zkmopro/mopro/main/mopro-ffi/Cargo.toml)) |
| longfellow-zk (what we wrap) | https://github.com/google/longfellow-zk | Apache-2.0 ([13](https://github.com/google/longfellow-zk)) | release v0.9 2026-03-31 ([25](https://api.github.com/repos/google/longfellow-zk/releases)); `main` @ `5f348de` 2026-08-12 "Merge pull request #176 from google/rust" ([68](https://api.github.com/repos/google/longfellow-zk/commits?per_page=1)); no crate on crates.io ([42](https://crates.io/api/v1/crates?q=longfellow&per_page=10)) |

## How Green Light uses it
- SPEC section 2, row "Prover runtime": Mopro supplies "Rust bindings for iOS and Android, CLI, cross-platform"; our work is "Wrap longfellow; fall back to WASM where native isn't possible". Section 3 keeps a Mopro native app as the option for older iPhones, section 8 names it the fallback if Safari WASM memory fails, and section 10 decision 1 (browser vs native) is settled by the week-2 benchmark.
- docs/PLAN.md M1 (Aug 31 - Sep 13, eng B): longfellow built at a recorded commit in "Mopro native (iOS and Android)" and WASM, 20 runs per device (TEST-PLAN C3/C4), result written into ADR-0001. M3 then wires "longfellow prover ... through Mopro (native) or WASM (browser) per the M1 decision" and needs a reproducible build. docs/PARTNERS.md: ask to the Mopro team is "Longfellow bindings for iOS/Android", reply by 2026-09-08, blocks "M1 native runs".
- What Mopro gives M1 concretely: a scaffold whose `mopro build` cross-compiles our Rust crate to `MoproBindings.xcframework` + `mopro.swift` and `jniLibs/` + `mopro.kt` ([65](https://zkmopro.org/docs/setup/ios-setup), [66](https://zkmopro.org/docs/setup/android-setup)), and `mopro create` example iOS/Android/web apps to time proofs in ([85](https://raw.githubusercontent.com/zkmopro/mopro/main/cli/src/template/init/README.md)). It does not give a longfellow prover.
- Two wrapping routes, both consistent with how existing adapters were done:
  - **R1 (default): wrap Google's Rust implementation.** The `rust/` tree is "the next-generation implementation", "100% backward compatible with the C++ one", proves "the full mdoc-zk circuits in less than 100MB of memory", and Google says "We do not ship a C++ runtime for now, expecting the Rust implementation to be sufficient" and "our (Google) goal is to switch to this implementation in production" ([41](https://raw.githubusercontent.com/google/longfellow-zk/main/rust/README.md)). It was merged to `main` on 2026-08-12 ([68](https://api.github.com/repos/google/longfellow-zk/commits?per_page=1)). Crates are path-only (`mdoc-zk-runtime` 0.1.0, deps `libc`, `zstd`, `sha2` with `asm`) ([74](https://raw.githubusercontent.com/google/longfellow-zk/main/rust/applications/mdoc_zk/runtime/Cargo.toml)); `prover_only` is a binary, not a library ([81](https://raw.githubusercontent.com/google/longfellow-zk/main/rust/applications/mdoc_zk/prover_only/Cargo.toml)). We add them as a git dependency pinned to a commit and export `prove`/`verify` with `#[uniffi::export]` — exactly the "custom adapter" path the docs describe ([6](https://zkmopro.org/docs/adapters/overview), [62](https://raw.githubusercontent.com/zkmopro/mopro/main/cli/src/template/init/src/lib.rs)).
  - **R2 (fallback): wrap the C++ library over its C ABI.** `lib/circuits/mdoc/mdoc_zk.h` is `extern "C"` and exposes `run_mdoc_prover`, `run_mdoc_verifier`, `generate_circuit`, `circuit_id`, `find_zk_spec` ([56](https://raw.githubusercontent.com/google/longfellow-zk/main/lib/circuits/mdoc/mdoc_zk.h)). Precedents inside Mopro: `witnesscalc_adapter::build_and_link()` compiles C++ sources in `build.rs` ([21](https://github.com/zkmopro/witnesscalc_adapter)); `rust-rapidsnark` links "static libraries ... downloaded at build time from the upstream iden3/rapidsnark release", overridable with `RAPIDSNARK_LIB_DIR` ([20](https://github.com/zkmopro/rust-rapidsnark)); `barretenberg-rs` ships "pre-built static libraries" for Linux, macOS, iOS device and simulator ([79](https://docs.rs/crate/barretenberg-rs/latest)); `rust-gnark` builds Go with `go build -buildmode=c-archive` and bindgen ([60](https://docs.rs/crate/rust-gnark/latest)). The EU wallet already ships the C library for iOS as `MdocZK.xcframework` (Swift 6, iOS 16+) ([38](https://github.com/eu-digital-identity-wallet/av-lib-ios-longfellow-zkp)), proving the C++ side cross-compiles. Cost: a C++ toolchain per target and no WASM path through Mopro.

## How to build or integrate
Prerequisites (Mopro docs): Rust, CMake, Xcode with command-line tools path set, Android Studio + JDK + NDK (side by side) with `ANDROID_HOME` and `NDK_PATH` (example `26.1.10909125`), `wasm-pack` + Chrome for web, Node >= 20 for React Native ([33](https://zkmopro.org/docs/prerequisites)). Mopro's own `mopro-ffi/rust-toolchain.toml` pins `nightly-2025-11-15` and the WASM build path selects a nightly constant ([86](https://api.github.com/repos/zkmopro/mopro/pulls/717/files?per_page=100)); whether an app scaffolded by `mopro init` needs nightly for iOS/Android builds is [unverified].

```sh
# 1. CLI  (source: cli/README.md [18])
cargo install mopro-cli
#    or latest
git clone https://github.com/zkmopro/mopro
cd mopro/cli
cargo install --path .
# 2. Scaffold; `mopro init` offers circom, halo2, noir, gnark, "none of above"  (cli/src/init/adapter.rs [89]; the getting-started page [5] still lists only the first three plus "none of above")
mopro init
# 3. Build bindings; prompts for iOS / Android / Flutter / React Native / Web  (getting-started [5])
mopro build            # or: mopro build --auto-update  (cli/README.md [18]; not on the getting-started page)
# 4. Example apps, then refresh bindings after Rust changes  (cli/README.md [18])
mopro create
mopro update           # mopro update [--src PATH] [--dest PATH] [--no-prompt]
# 5. Bindings without a Rust project / full project in one go  (cli/README.md [18])
mopro bindgen --adapter witnesscalc
mopro bindgen --output-dir ./output
mopro construct
```

Manual Rust setup, copied from the docs ([7](https://zkmopro.org/docs/setup/rust-setup)):
```toml
[features]
default = ["uniffi"]
uniffi = ["mopro-ffi/uniffi"]
flutter = ["mopro-ffi/flutter"]
[dependencies]
mopro-ffi = "0.3"
thiserror = "2.0.12"
[build-dependencies]
mopro-ffi = "0.3"
[lib]
crate-type = ["lib", "cdylib", "staticlib"]
```
`src/bin/ios.rs` is `fn main() { mopro_ffi::app_config::ios::build(); }` and `src/bin/android.rs` the same with `android`; build with `cargo run --bin ios`, `cargo run --bin android`, `CONFIGURATION=release cargo run --bin ios`, and restrict targets with `IOS_ARCHS=aarch64-apple-ios,aarch64-apple-ios-sim` or `ANDROID_ARCHS=x86_64-linux-android` ([7](https://zkmopro.org/docs/setup/rust-setup)). Web builds use `--no-default-features --features wasm` ([43](https://raw.githubusercontent.com/zkmopro/mopro/main/mopro-ffi/README.md)).

The generated `src/lib.rs` (condensed: function bodies inlined, comments trimmed; [62](https://raw.githubusercontent.com/zkmopro/mopro/main/cli/src/template/init/src/lib.rs)):
```rust
#[cfg(not(target_arch = "wasm32"))]
mopro_ffi::app!();
#[cfg(all(feature = "wasm", target_arch = "wasm32"))]
use mopro_ffi::prelude::wasm_bindgen;

/// You can also customize the bindings by #[uniffi::export]
#[cfg_attr(feature = "uniffi", uniffi::export)]
pub fn mopro_hello_world() -> String { "Hello, World!".to_string() }

#[cfg_attr(all(feature = "wasm", target_arch = "wasm32"), wasm_bindgen(js_name = "moproWasmHelloWorld"))]
pub fn mopro_wasm_hello_world() -> String { "Hello, World!".to_string() }
// CIRCOM_TEMPLATE  // HALO2_TEMPLATE  // NOIR_TEMPLATE  // GNARK_TEMPLATE
```

Concrete steps to wrap longfellow (route R1), following the gnark precedent ([64](https://raw.githubusercontent.com/zkmopro/mopro/main/cli/src/template/init/src/gnark.rs), [44](https://api.github.com/repos/zkmopro/mopro/pulls/691/files?per_page=100)):
1. `mopro init`, pick "None of above" ([5](https://zkmopro.org/docs/getting-started)).
2. Add `mdoc-zk-runtime` (and the `runtime-*`/`circuits-*` crates it pulls) as a `git` dependency on https://github.com/google/longfellow-zk pinned to a commit; record the commit in `bench/REPORT.md` as PLAN M1 requires. Do not build inside the longfellow workspace: its `.cargo/config.toml` sets `rustflags = ["-C", "target-cpu=native"]`, which is wrong for cross-compiles ([76](https://raw.githubusercontent.com/google/longfellow-zk/main/rust/.cargo/config.toml)).
3. Add `src/longfellow.rs` mirroring the gnark module: a `#[derive(uniffi::Record)]` result struct and `#[cfg_attr(feature = "uniffi", uniffi::export)] pub fn generate_mdoc_proof(...) -> Result<..., MoproError>` / `verify_mdoc_proof(...)`, with errors mapped into `MoproError` ([64](https://raw.githubusercontent.com/zkmopro/mopro/main/cli/src/template/init/src/gnark.rs), [85](https://raw.githubusercontent.com/zkmopro/mopro/main/cli/src/template/init/README.md)). Inputs follow `mdoc_zk.h`: circuit bytes, mdoc bytes, issuer public key x/y, session transcript, requested attributes, `now`, zk-spec version ([56](https://raw.githubusercontent.com/google/longfellow-zk/main/lib/circuits/mdoc/mdoc_zk.h)).
4. `mopro build` (iOS: `aarch64-apple-ios`, `aarch64-apple-ios-sim`; Android: `aarch64-linux-android`, plus `x86_64` for emulators) then `mopro create` for the timing apps ([5](https://zkmopro.org/docs/getting-started)). Drop `MoproiOSBindings` into Xcode; for Android copy `jniLibs/` and `uniffi/mopro/mopro.kt` and add `implementation("net.java.dev.jna:jna:5.13.0@aar")` ([65](https://zkmopro.org/docs/setup/ios-setup), [66](https://zkmopro.org/docs/setup/android-setup)).
5. For the WASM leg, gate a second export with `#[wasm_bindgen]` as in the template and build with `--features wasm`; the web template "works only for example circuits" and needs manual edits to `test_mopros.js` and `index.html` ([8](https://zkmopro.org/docs/setup/web-wasm-setup)). Whether the longfellow Rust crates compile to `wasm32-unknown-unknown` (they depend on `libc` and `sha2/asm`) is [unverified].
6. Run `cargo test` with the JNA jar on `CLASSPATH` before building bindings ([85](https://raw.githubusercontent.com/zkmopro/mopro/main/cli/src/template/init/README.md)).

Benchmarks published by Mopro (all for circom/halo2/noir; none for longfellow): iPhone 16 Pro, iPhone 15 Pro, Samsung S23 Ultra, Pixel 6 Pro, MacBook Pro M1 Max, and Pixel 6 plus MacBook Air M3 for Noir; Circom Keccak256 proof 630.3 ms with rapidsnark vs 5182.1 ms snarkjs on iPhone 16 Pro ("~8.2x"); Noir Keccak256 349 ms iOS, 1303 ms Android, 4122 ms web; the Halo2 RSA circuit "needs around 5GB of memory" and crashes on iPhone 15 Pro and Pixel 6 Pro, which "usually limit the application memory usage to 3GB"; overall "up to 20 times" faster than snarkjs in the browser ([4](https://zkmopro.org/docs/performance)). PSE's `csp-benchmarks` does not include longfellow, runs on "Apple M1 CPU with 8 cores", and lists "a cloud device farm (Android and iOS mobile devices)" only as a future plan ([39](https://github.com/privacy-ethereum/csp-benchmarks)); the zkID README says nothing about a device farm ([55](https://github.com/zkmopro/zkID)).

## Status and risks
- **Maturity.** 0.3.x line, three releases in 2026 (0.3.5 Mar 8, 0.3.6 May 28, 0.3.7 Jul 14) ([12](https://crates.io/api/v1/crates/mopro-ffi)); pse.dev lists the project as "Active" ([40](https://pse.dev/projects/mopro)); PSE now expands as "Privacy Stewards of Ethereum" ([55](https://github.com/zkmopro/zkID)). The 2025 retrospective (2026-01-12) reports "over 50 project submissions" and a 2026 plan to "collaborate with more projects to help them build and ship their protocol SDKs" ([29](https://zkmopro.org/blog/2025-mopro-retrospective)).
- **Maintenance signal.** 13 commits to `main` between 2026-03-03 and 2026-07-30 from three authors (moven0831 8, vivianjeng 4, VolodymyrBg 1) ([50](https://api.github.com/repos/zkmopro/mopro/commits?since=2026-03-01T00:00:00Z&per_page=100)); the all-time top contributor oskarth (320 commits) is absent from that window ([49](https://api.github.com/repos/zkmopro/mopro/contributors?per_page=10)). No push to the monorepo since 2026-07-30 ([10](https://api.github.com/repos/zkmopro/mopro)); most recent org activity is `gpu-acceleration` 2026-08-06 ([37](https://api.github.com/orgs/zkmopro/repos?per_page=100&sort=pushed)).
- **"Production use in PSE apps" (SPEC row) is not substantiated by Mopro's own site.** The projects page lists World ID, Privado.iD, Rarimo, Self Protocol, ZKPassport and Anon Aadhaar but never uses the word "production", and its example section says the examples "are implemented with native ZK provers and may not utilize the Mopro stack" ([9](https://zkmopro.org/docs/projects)). Treat the SPEC wording as [unverified].
- **No security review found.** No audit report is linked from the README, docs sitemap or blog index ([16](https://raw.githubusercontent.com/zkmopro/mopro/main/README.md), [15](https://zkmopro.org/sitemap.xml), [28](https://zkmopro.org/blog/)). Mopro is glue (UniFFI 0.32.0 scaffolding and build scripts), so the exposure is supply-chain and build reproducibility rather than cryptography; SPEC section 6 item 6 already audits "the assembled stack".
- **Nightly toolchain.** `mopro-ffi/rust-toolchain.toml` pins `nightly-2025-11-15`, CI installs the same nightly, and the WASM build selects a nightly by constant ([84](https://api.github.com/repos/zkmopro/mopro/pulls/717), [86](https://api.github.com/repos/zkmopro/mopro/pulls/717/files?per_page=100)). Deterministic, but M3's reproducible build must pin the identical nightly on both machines; whether stable suffices for the iOS/Android path is [unverified].
- **WASM is Halo2-centric.** "Mopro primarily supports the PSE Halo2, which is a Plonk backend and works well with wasm-bindgen-rayon" ([8](https://zkmopro.org/docs/setup/web-wasm-setup)); the FAQ's web answer is "use wasm-bindgen to compile your Rust-based prover to WebAssembly" ([14](https://zkmopro.org/docs/FAQ/)). For the browser leg of M1, Mopro adds scaffolding only; C-ABI wraps cannot target WASM at all ("c-archive does not target WASM" for gnark ([60](https://docs.rs/crate/rust-gnark/latest)); barretenberg-rs lists no wasm target ([79](https://docs.rs/crate/barretenberg-rs/latest))).
- **Longfellow moving target.** The Rust rewrite landed on `main` 2026-08-12 ([68](https://api.github.com/repos/google/longfellow-zk/commits?per_page=1)) after the last tagged release v0.9 (2026-03-31, C++) ([25](https://api.github.com/repos/google/longfellow-zk/releases)); Google's reviews page lists three completed external reviews of the C++ line — Trail of Bits (2025-08-18, "all of the issues have been addressed in the latest release"), ISRG (finding patched in v0.8.4, 2025-10-17) and a Ligero security analysis (2025-12-15) — while the top-level README still says the project "is currently undergoing two independent security reviews" ([90](https://google.github.io/longfellow-zk/docs/reviews/), [67](https://raw.githubusercontent.com/google/longfellow-zk/main/README.md)); none of them covers the Rust rewrite. SPEC decision 2 requires piloting on a reviewed tag, so the Rust path may have no reviewed tag by M8 [unverified]. The C++ `run_mdoc_prover` API remains the only tagged interface ([56](https://raw.githubusercontent.com/google/longfellow-zk/main/lib/circuits/mdoc/mdoc_zk.h)).
- **Device coverage.** Mopro's published numbers are on iPhone 16 Pro, iPhone 15 Pro, S23 Ultra, Pixel 6 Pro and (Noir only) Pixel 6 ([4](https://zkmopro.org/docs/performance)); our targets are iPhone 13 and Pixel 6 (SPEC section 9), so only the Pixel 6 has any Mopro data point and none is for longfellow. No minimum iOS or Android SDK version is documented ([65](https://zkmopro.org/docs/setup/ios-setup), [66](https://zkmopro.org/docs/setup/android-setup)); the Android output folder carries four ABIs including `armeabi-v7a` and `x86`, which we should drop via `ANDROID_ARCHS` ([66](https://zkmopro.org/docs/setup/android-setup), [7](https://zkmopro.org/docs/setup/rust-setup)).
- **Licence.** Dual Apache-2.0/MIT files in the repo ([17](https://api.github.com/repos/zkmopro/mopro/contents/)) are compatible with Green Light's Apache-2.0; the third-party `rust-gnark` is not needed. The `circom-prover` crate has not been published since 2025-10-03 ([58](https://crates.io/api/v1/crates/circom-prover)) and its module was removed from the monorepo ([45](https://api.github.com/repos/zkmopro/mopro/pulls/715)) — irrelevant to us but a sign that adapters can be dropped.

## Open questions for the partner call
- Has anyone at PSE/Mopro already cross-compiled Google's Rust longfellow (`rust/` tree, merged 2026-08-12) for `aarch64-apple-ios` or `aarch64-linux-android`, or to `wasm32`? Any numbers?
- Which route do they recommend: a git-pinned Rust dependency exported with `#[uniffi::export]` in a "None of above" project, or a first-class `mopro-ffi/longfellow` feature? Would they host the adapter under the zkmopro org and co-maintain it?
- Can the M1 native runs be paired with a Mopro engineer before 2026-09-13 (PARTNERS reply-by 2026-09-08)?
- Is the `nightly-2025-11-15` pin required for iOS/Android builds, or only for `wasm-bindgen-rayon`? What is their reproducible-build story (two machines, same xcframework hash)?
- Minimum iOS/Android versions the generated bindings support; anything known about JNA or UniFFI 0.32 behaviour on iPhone 13 / Pixel 6.
- Does `wasm-bindgen-rayon` threading work in Safari on iOS 26 (SharedArrayBuffer, COOP/COEP) for a non-Halo2 prover, or should the WASM leg bypass Mopro entirely?
- Memory guidance: their Halo2 RSA benchmark died at 5 GB; longfellow claims <100 MB on desktop for the Rust prover — will they add an mDoc row to `zkmopro.org/docs/performance` and to `csp-benchmarks` once the mobile device farm exists?
- What does "production" mean in the Mopro project list, and which named apps actually ship `mopro-ffi` today (needed to defend the SPEC row)?
- Any audit or review of `mopro-ffi` planned; what is the path from 0.3.x to a stable 1.0 API?
- The zkmopro org has an `alcohol-purchase-frontend` repo (React 18 + Vite boilerplate README, pushed 2026-05-25) and `TWDIW-official-app`, a fork of Taiwan MODA's OID4VC/OID4VP digital-wallet release (Chinese README, MIT, pushed 2026-05-26), plus `TWDIW-integration` ([53](https://github.com/zkmopro/alcohol-purchase-frontend), [54](https://github.com/zkmopro/TWDIW-official-app), [37](https://api.github.com/orgs/zkmopro/repos?per_page=100&sort=pushed)) — is there an age-verification or mdoc effort we can join rather than duplicate?

## Sources
All fetched 2026-09-01.
1. https://github.com/zkmopro/mopro
2. https://zkmopro.org/docs/intro
3. https://github.com/zkmopro/mopro/releases
4. https://zkmopro.org/docs/performance
5. https://zkmopro.org/docs/getting-started
6. https://zkmopro.org/docs/adapters/overview
7. https://zkmopro.org/docs/setup/rust-setup
8. https://zkmopro.org/docs/setup/web-wasm-setup
9. https://zkmopro.org/docs/projects
10. https://api.github.com/repos/zkmopro/mopro
11. https://api.github.com/repos/zkmopro/mopro/releases/latest
12. https://crates.io/api/v1/crates/mopro-ffi
13. https://github.com/google/longfellow-zk
14. https://zkmopro.org/docs/FAQ/
15. https://zkmopro.org/sitemap.xml
16. https://raw.githubusercontent.com/zkmopro/mopro/main/README.md
17. https://api.github.com/repos/zkmopro/mopro/contents/
18. https://raw.githubusercontent.com/zkmopro/mopro/main/cli/README.md
19. https://api.github.com/repos/zkmopro/mopro/commits?per_page=1
20. https://github.com/zkmopro/rust-rapidsnark
21. https://github.com/zkmopro/witnesscalc_adapter
22. https://github.com/zkmopro/noir-rs
23. https://github.com/zkmopro/mopro/releases/tag/mopro-ffi-v0.3.6
24. https://github.com/google/longfellow-zk/tree/main/rust
25. https://api.github.com/repos/google/longfellow-zk/releases
26. https://crates.io/api/v1/crates/mopro-cli
27. https://crates.io/api/v1/crates/mopro-wasm (404)
28. https://zkmopro.org/blog/
29. https://zkmopro.org/blog/2025-mopro-retrospective
30. https://zkmopro.org/docs/crates/mopro-ffi (page body not rendered by the fetcher)
31. https://zkmopro.org/docs/crates/mopro-cli (page body not rendered by the fetcher)
32. https://zkmopro.org/docs/architectures (page body not rendered by the fetcher)
33. https://zkmopro.org/docs/prerequisites
34. https://raw.githubusercontent.com/zkmopro/mopro/main/mopro-ffi/Cargo.toml
35. https://github.com/zkmopro/mopro/pull/691
36. https://api.github.com/search/issues?q=repo:zkmopro/mopro+longfellow+OR+ligero+OR+mdoc+OR+%22C%2B%2B+prover%22
37. https://api.github.com/orgs/zkmopro/repos?per_page=100&sort=pushed
38. https://github.com/eu-digital-identity-wallet/av-lib-ios-longfellow-zkp
39. https://github.com/privacy-ethereum/csp-benchmarks
40. https://pse.dev/projects/mopro
41. https://raw.githubusercontent.com/google/longfellow-zk/main/rust/README.md
42. https://crates.io/api/v1/crates?q=longfellow&per_page=10
43. https://raw.githubusercontent.com/zkmopro/mopro/main/mopro-ffi/README.md
44. https://api.github.com/repos/zkmopro/mopro/pulls/691/files?per_page=100
45. https://api.github.com/repos/zkmopro/mopro/pulls/715
46. https://api.github.com/repos/zkmopro/mopro/issues/226
47. https://raw.githubusercontent.com/zkmopro/mopro/main/Cargo.toml
48. https://api.github.com/repos/zkmopro/mopro/contents/cli/src
49. https://api.github.com/repos/zkmopro/mopro/contributors?per_page=10
50. https://api.github.com/repos/zkmopro/mopro/commits?since=2026-03-01T00:00:00Z&per_page=100
51. https://api.github.com/repos/zkmopro/mopro-swift-package
52. https://api.github.com/repos/zkmopro/mopro-kotlin-package
53. https://github.com/zkmopro/alcohol-purchase-frontend
54. https://github.com/zkmopro/TWDIW-official-app
55. https://github.com/zkmopro/zkID
56. https://raw.githubusercontent.com/google/longfellow-zk/main/lib/circuits/mdoc/mdoc_zk.h
57. https://raw.githubusercontent.com/google/longfellow-zk/main/rust/applications/mdoc_zk/Cargo.toml (404)
58. https://crates.io/api/v1/crates/circom-prover
59. https://crates.io/api/v1/crates/rust-gnark
60. https://docs.rs/crate/rust-gnark/latest
61. https://raw.githubusercontent.com/zkmopro/mopro/main/cli/src/template/init/Cargo.toml (404; manifest is generated by `cli/src/init/write_toml.rs`, see 44)
62. https://raw.githubusercontent.com/zkmopro/mopro/main/cli/src/template/init/src/lib.rs
63. https://raw.githubusercontent.com/zkmopro/mopro/main/cli/src/template/gnark/lib.rs
64. https://raw.githubusercontent.com/zkmopro/mopro/main/cli/src/template/init/src/gnark.rs
65. https://zkmopro.org/docs/setup/ios-setup
66. https://zkmopro.org/docs/setup/android-setup
67. https://raw.githubusercontent.com/google/longfellow-zk/main/README.md
68. https://api.github.com/repos/google/longfellow-zk/commits?per_page=1
69. https://api.github.com/repos/google/longfellow-zk/contents/rust/applications/mdoc_zk
70. https://blog.google/innovation-and-ai/technology/safety-security/opening-up-zero-knowledge-proof-technology-to-promote-privacy-in-age-assurance/ (2025-07-03 open-sourcing post; no timing numbers; not cited above)
71. https://arxiv.org/abs/2510.14693 (FibRace mobile client-side-proving benchmark, Malatrait and Sirac, 2025-10-16; not about longfellow — listed for context only, not cited above)
72. https://api.github.com/repos/zkmopro/mopro/contents/cli/src/template/init
73. https://api.github.com/repos/FluxePay/rust-gnark
74. https://raw.githubusercontent.com/google/longfellow-zk/main/rust/applications/mdoc_zk/runtime/Cargo.toml
75. https://api.github.com/repos/google/longfellow-zk/contents/rust/applications/mdoc_zk/prover_only
76. https://raw.githubusercontent.com/google/longfellow-zk/main/rust/.cargo/config.toml
77. https://zkmopro.org/docs/adapters/noir
78. https://crates.io/api/v1/crates/barretenberg-rs
79. https://docs.rs/crate/barretenberg-rs/latest
80. https://zkmopro.org/docs/sdk/overview
81. https://raw.githubusercontent.com/google/longfellow-zk/main/rust/applications/mdoc_zk/prover_only/Cargo.toml
82. https://crates.io/api/v1/crates/rust-rapidsnark
83. https://crates.io/api/v1/crates/witnesscalc-adapter
84. https://api.github.com/repos/zkmopro/mopro/pulls/717
85. https://raw.githubusercontent.com/zkmopro/mopro/main/cli/src/template/init/README.md
86. https://api.github.com/repos/zkmopro/mopro/pulls/717/files?per_page=100
87. https://api.github.com/repos/zkmopro/mopro/issues/438/comments
88. https://raw.githubusercontent.com/zkmopro/noir-rs/main/Cargo.toml
89. https://raw.githubusercontent.com/zkmopro/mopro/main/cli/src/init/adapter.rs
90. https://google.github.io/longfellow-zk/docs/reviews/

## Verification
Re-checked 2026-09-02 by a second reviewer against live sources (GitHub API via authenticated `gh`, crates.io API, raw.githubusercontent.com, zkmopro.org, docs.rs, pse.dev, google.github.io). 96 factual claims checked (URLs, versions, dates, counts, quotes, feature and status statements). All 86 original source URLs resolve; the three marked 404 are still 404 as stated. Four sources (87-90) were added.

Corrections made:
- FAQ wording: the FAQ does not describe GKR/Binius/Spartan/Nova Scotia as "emerging"; it links them as examples of the modular architecture ([14]).
- "No issue or PR mentions longfellow" was wrong: the tracker search returns issue #438 "Age Verification Template", whose 2025-09-23 maintainer comment names google/longfellow-zk as an integration alternative ([36], [87]). No code or PR exists.
- `WASM_NIGHTLY_TOOLCHAIN` lives in `mopro-ffi/src/app_config/constants.rs`, not `web.rs` (PR #717 diff, [86]).
- Maintenance signal: 13 commits (moven0831 8, vivianjeng 4, VolodymyrBg 1) since 2026-03-01, not 10 (6/3/1) ([50]).
- noir-rs pins `barretenberg-rs = "=4.2.0-aztecnr-rc.2"`, not 6.0.0-nightly.20260901 (that is merely the newest crates.io upload) ([88], [77], [78]).
- `rust-rapidsnark` and `witnesscalc_adapter` repos carry no LICENSE file; the dual licence exists only as crates.io metadata ([82], [83]). `rust-gnark` is MIT on GitHub but `MIT OR Apache-2.0` on crates.io ([73], [59]).
- `mopro init` offers five adapters including gnark in the current CLI source ([89]); the getting-started page still lists four ([5]). `mopro build --auto-update` is documented in cli/README.md, not on the getting-started page ([18]).
- Performance page: added iPhone 15 Pro and Pixel 6 Pro to the device list; the Halo2 RSA crash was on iPhone 15 Pro / Pixel 6 Pro (circuit "around 5GB", devices limit apps to ~3GB), and the device-farm plan is in csp-benchmarks only, not the zkID README ([4], [39], [55]).
- Device coverage: Mopro does publish a Pixel 6 number (Noir), so the earlier "only iPhone 16 Pro and S23 Ultra" was incomplete ([4]).
- Longfellow reviews: Google's reviews page lists three completed external reviews of the C++ line (Trail of Bits 2025-08-18, ISRG patched in v0.8.4 2025-10-17, Ligero analysis 2025-12-15) while the README still says two are "currently undergoing"; none covers the Rust rewrite ([90], [67]).
- `TWDIW-official-app` is a fork of Taiwan MODA's OID4VC/OID4VP wallet with a substantive Chinese README (MIT); `alcohol-purchase-frontend` is a React/Vite boilerplate README — "no README detail" was inaccurate ([53], [54]).
- Sources 70 and 71 are not cited in the text; 71 (arXiv 2510.14693) is the FibRace Cairo-M mobile benchmark paper, unrelated to longfellow; both annotated.

Left unverified (no live evidence either way):
- Whether an app scaffolded by `mopro init` needs the `nightly-2025-11-15` toolchain for iOS/Android builds, or only for the WASM/`wasm-bindgen-rayon` path.
- Whether the longfellow Rust crates (`libc`, `sha2/asm`, `zstd` deps) compile to `wasm32-unknown-unknown`.
- Whether the Rust longfellow path will have a reviewed tag by M8; no tag exists for the Rust tree (latest tag v0.9, 2026-03-31, C++).
- SPEC's "Production use in PSE apps" for Mopro: no Mopro-published source uses the word "production" for any listed project.
- Minimum iOS / Android versions supported by generated Mopro bindings (not documented anywhere found).
- The 0.3.6 release-notes attribution of gnark to that release: PR #691 merged 2026-02-25, before 0.3.5 (2026-03-08); the notes for 0.3.6 list it, but whether 0.3.5 already contained the template was not checked.
