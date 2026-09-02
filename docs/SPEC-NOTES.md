# Spec v3 against the evidence, 2026-09-01

What this is: the twelve component notes in [components/](components/README.md) each checked SPEC.md v3 against live sources (research 2026-09-01, independent re-verification 2026-09-02). This file collects every place where the spec and the evidence disagree, and every claim the notes could not settle either way. SPEC.md itself is unchanged; each discrepancy carries a suggested wording for the next revision. Items are grouped by SPEC section; where several notes found the same problem they are merged into one entry and every contributing note is linked.

## Discrepancies

### Section 0, context

**1. Launch date.**
Spec says: "On August 31, 2026 a dark-web service called Nexus began selling scans".
Evidence: Krebs says the service launched "this week" and that the Exploit ad was reported to him on Monday 2026-08-31; the exact launch date is not stated ([breach-context.md](components/breach-context.md); [Krebs 2026-09-01](https://krebsonsecurity.com/2026/09/fbi-probes-service-selling-153m-drivers-licenses/), [archived](http://web.archive.org/web/20260902013634/https://krebsonsecurity.com/2026/09/fbi-probes-service-selling-153m-drivers-licenses/)).
Suggested change: "By August 31, 2026 a dark-web service called Nexus was advertising scans".

**2. The counts.**
Spec says: "more than 153 million US and Canadian driver's licenses, plus roughly 10 million ID cards, 3 million travel documents and 579,000 medical cards", stated as fact.
Evidence: the figures are the seller's claims relayed by Krebs (more than 153M, more than 10M, more than 3M, at least 579k), verified by no one; the license count grew by about 400,000 in 24 hours, and Krebs does not say whether records are distinct people or repeat scans ([breach-context.md](components/breach-context.md); [Krebs](https://krebsonsecurity.com/2026/09/fbi-probes-service-selling-153m-drivers-licenses/)).
Suggested change: "claimed scans of more than 153 million ... (the seller's figures, unverified)" and drop "One vendor, one database, 153 million licenses" or qualify it as "153 million records".

**3. Who named the vendor.**
Spec says: "KrebsOnSecurity traced the images to a Louisiana-based identity-verification vendor ... secondary reporting names idscan.net".
Evidence: Krebs names idscan.net directly and reports the FBI naming it on the call; no second outlet with original reporting exists, only re-posts of Krebs ([breach-context.md](components/breach-context.md); [Krebs](https://krebsonsecurity.com/2026/09/fbi-probes-service-selling-153m-drivers-licenses/), [Rankiteo re-post](https://blog.rankiteo.com/fedthecaeids1788312186-idscannet-caesars-entertainment-hertz-fedex-breach-august-2026/)).
Suggested change: "KrebsOnSecurity traced the images to idscan.net, a New Orleans identity-verification vendor, and reports the FBI naming it on a call".

**4. Where the scanners sit.**
Spec says: "scanners sit at hotel desks, car-rental counters, dispensaries, casinos and retail checkouts".
Evidence: only car rental (Hertz) and a dispensary (Planet 13) come from traced records; the Aria hotel is one of three places Zach Edwards showed his license that day and he said only the dispensary "for sure" scanned it; casinos (Caesars) and retail (Target) are inferred from the vendor's customer logos, not from any traced record ([breach-context.md](components/breach-context.md); [Krebs](https://krebsonsecurity.com/2026/09/fbi-probes-service-selling-153m-drivers-licenses/), [idscan.net Trust Center](https://trust.idscan.net/)).
Suggested change: "matched to license scans at rental counters and a dispensary; the vendor's customer list includes Hertz, Target, FedEx and Caesars".

**5. FBI timing and source.**
Spec says: "The FBI's New Orleans office opened an inquiry the same day."
Evidence: per Krebs the inquiry opened 2026-09-01, the day after the 2026-08-31 ad was spotted, and the only source is Krebs's account of a conference call; fbi.gov returns HTTP 403 and site search finds nothing ([breach-context.md](components/breach-context.md); [Krebs](https://krebsonsecurity.com/2026/09/fbi-probes-service-selling-153m-drivers-licenses/)).
Suggested change: "Krebs reports that the FBI's New Orleans field office opened an investigation on September 1."

**6. "High-resolution".**
Spec says: "Records carry high-resolution front and back images".
Evidence: "high-resolution" does not appear in Krebs; it appears only in the Rankiteo aggregator re-post; Krebs confirms front/back plus infrared and ultraviolet for his own record and says "not all records include photos" ([breach-context.md](components/breach-context.md); [Rankiteo](https://blog.rankiteo.com/fedthecaeids1788312186-idscannet-caesars-entertainment-hertz-fedex-breach-august-2026/)).
Suggested change: "Records carry front and back images, some with infrared and UV captures".

**7. The cabinet secretary.**
Spec says: "Krebs found his own license in it; so did a sitting cabinet secretary."
Evidence: Krebs found Defense Secretary Pete Hegseth's license (one of several high-ranking officials); Hegseth did not find it himself ([breach-context.md](components/breach-context.md); [Krebs](https://krebsonsecurity.com/2026/09/fbi-probes-service-selling-153m-drivers-licenses/)).
Suggested change: "Krebs found his own license in it, and the Defense Secretary's."

**8. "First".**
Spec says: "It is the first ID breach where the stolen record is sufficient on its own to impersonate someone in person."
Evidence: no source supports "first"; Krebs makes no such claim ([breach-context.md](components/breach-context.md)).
Suggested change: drop "first": "It is an ID breach where the stolen record is sufficient on its own to impersonate someone in person."

**9. Mechanism and architecture.**
Spec says: "One vendor, one database, 153 million licenses."
Evidence: Krebs does not describe the breach mechanism or storage architecture; the vendor's knowledge base shows only that retain-all is the default and the Basic-plan-fixed setting ([breach-context.md](components/breach-context.md); [idscan.net KB](https://support.idscan.net/veriscan-cloud-portal/data-collection-and-retention)).
Suggested change: "One vendor's cloud, retain-everything by default, 153 million records claimed."

**10. "Told the safe way is to scan and store".**
Spec says: "Every venue that must check an ID is told the safe way to do it is to scan and store the whole card with a vendor."
Evidence: the vendor's KB shows Premium and above can choose "Do not collect data", "Collect anonymized data only", or "Delete all" after 8 hours to 1 year; retention is the default and the cheapest tier, not the only option ([breach-context.md](components/breach-context.md); [idscan.net KB](https://support.idscan.net/veriscan-cloud-portal/data-collection-and-retention)).
Suggested change: "The default, and the cheapest plan, is to scan and store the whole card with the vendor."

### Header and section 2, bill of materials

**11. Licence: Apache-2.0 deliverable vs the GPL Dyne fork.**
Spec says: line 2 "Open source, Apache-2.0." and Circuit row source "Google longfellow-zk; Dyne.org fork without Google Play dependency".
Evidence: the Dyne fork's LICENSE is GPL-3.0-or-later since commit `6850cf53f8` (2026-08-31, the day of its v1.0.0 tag); its README says software distributed with the library "must be released under the same GPL terms"; the last Apache-2.0 commit is `3d1d196a69` (2026-08-22); upstream google/longfellow-zk remains Apache-2.0 ([dyne-longfellow-fork.md](components/dyne-longfellow-fork.md), [longfellow-zk.md](components/longfellow-zk.md); [Dyne LICENSE](https://raw.githubusercontent.com/dyne/longfellow-zk/main/LICENSE), [LICENSE at 3d1d196a69](https://raw.githubusercontent.com/dyne/longfellow-zk/3d1d196a69/LICENSE), [upstream LICENSE](https://raw.githubusercontent.com/google/longfellow-zk/main/LICENSE)).
Suggested change: source column "Google longfellow-zk (Apache-2.0); Dyne.org soft fork (GPL-3.0-or-later since 2026-08-31), reference only", and an ADR before M3 choosing between building on upstream, pinning the fork at `3d1d196a69`, or negotiating terms via info@dyne.org.

**12. "Without Google Play dependency" and the OS-API privacy warning.**
Spec says: Circuit row "Dyne.org fork without Google Play dependency"; section 7 "Dyne's analysis warns that routing ZK through an OS API reintroduces a privacy leak."
Evidence: the library never had a Play dependency (upstream `android.sh` is plain C++ with the NDK, no Play, Play Services or Credential Manager reference); Dyne's current README says "without depending on a proprietary operating-system API" and the "Google Play API" phrase survives only in the old README of 2025-11-25. The OS-API privacy argument does exist, but in Jaromil's *Privacy in EUDI* (17 Jul 2025), not in the 25 Jun 2025 benchmark post that two notes checked, whose concerns are circuit attack surface, RNG handling, the OpenSSL dependency and proof size. The PWA path still receives the mdoc through the OS wallet via the DC API, so the fork removes only the prover from the OS ([dyne-longfellow-fork.md](components/dyne-longfellow-fork.md), [longfellow-zk.md](components/longfellow-zk.md), [wallet-mdl-platforms.md](components/wallet-mdl-platforms.md); [Dyne README](https://raw.githubusercontent.com/dyne/longfellow-zk/main/README.md), [upstream android.sh](https://raw.githubusercontent.com/google/longfellow-zk/main/android.sh), [Privacy in EUDI](https://news.dyne.org/privacy-in-eudi/), [Dyne benchmark post](https://news.dyne.org/longfellow-zero-knowledge-google-zk/)).
Suggested change: Circuit row "Dyne.org soft fork packaged without a proprietary OS proof API"; section 7 "Dyne's *Privacy in EUDI* argues that a prover running inside the OS wallet API exposes the credential to the OS; our page moves the prover out of the OS but still receives the mdoc through it."

**13. "~1.2 s on phone".**
Spec says: Circuit row "mDoc presentation circuit (ECDSA P-256, salted digests, ~1.2 s on phone)".
Evidence: the figure comes from the superseded 2024 ePrint abstract (as quoted in Dyne's June 2025 post) and is repeated by PSE's paper summary and ETSI TR 119 476-1 clause 6.5.4.1 ("around 1,2 seconds ... Google Pixel 6", Google's number, not PSE's). The revised abstract (2026-04-27) says "a few hundred ms on mobile devices" and Table 13 gives Pixel 9 931 ms / iPhone 15+ 437 ms prove, single-threaded, MSO <= 2231 bytes; Dyne measured 795-816 ms on a desktop core; Google's benchmark page has Mac M4 only; Mopro, csp-benchmarks and Dyne's v1.0.0 release publish no phone mdoc timing; nothing covers an iPhone 13 or Pixel 6 ([longfellow-zk.md](components/longfellow-zk.md), [dyne-longfellow-fork.md](components/dyne-longfellow-fork.md), [mopro.md](components/mopro.md), [pse-zkid.md](components/pse-zkid.md), [wallet-mdl-platforms.md](components/wallet-mdl-platforms.md), [onchain-verifier-nullifier.md](components/onchain-verifier-nullifier.md), [iso-18013-5-mdoc-fixtures.md](components/iso-18013-5-mdoc-fixtures.md); [ePrint 2024/2010](https://eprint.iacr.org/2024/2010), [ETSI TR 119 476-1](https://www.etsi.org/deliver/etsi_tr/119400_119499/11947601/01.03.01_60/tr_11947601v010301p.pdf), [Google benchmarks](https://google.github.io/longfellow-zk/docs/benchmarks/)).
Suggested change: "437-931 ms single-threaded on iPhone 15 / Pixel 9 (paper Table 13, rev. 2026-04-27); older phones unmeasured, M1 supplies the iPhone 13 / Pixel 6 figure".

**14. "TRL 4, two security reviews in progress".**
Spec says: Circuit row status "TRL 4, two security reviews in progress"; section 8 "Longfellow is TRL 4 with reviews in progress"; section 10 decision 2 "Wait for longfellow review reports before pilot".
Evidence: Google's reviews page lists three completed reviews of the C++ line: Trail of Bits (2025-08-18, report PDF published, 13 findings, fix review 8 resolved / 5 unresolved including #11 timing leak and #12 MAC forgery, page nonetheless says "All of the issues have been addressed"), ISRG / David Cook (under-constrained witness, fixed in v0.8.4 on 2025-10-17, summary only, no separate report), and a Ligero panel (2025-12-15, protocol-only PDF, "more than 115 bits"). The IETF 125 slides say "3 security reviews have been completed". Only the README and the landing page still say "currently undergoing two". None covers the Rust port on `main` (2026-08-12) that Google intends for production. No source states a TRL. Reviews do not transfer to forks or changed circuits (Dyne security.md) ([longfellow-zk.md](components/longfellow-zk.md), [dyne-longfellow-fork.md](components/dyne-longfellow-fork.md), [mopro.md](components/mopro.md), [wallet-mdl-platforms.md](components/wallet-mdl-platforms.md), [onchain-verifier-nullifier.md](components/onchain-verifier-nullifier.md); [reviews page](https://google.github.io/longfellow-zk/docs/reviews/), [ToB report](https://google.github.io/longfellow-zk/reviews/Longfellow_report_2025_08_18.pdf), [Ligero report](https://google.github.io/longfellow-zk/reviews/Longfellow_security_2025_12_15.pdf), [IETF 125 slides](https://datatracker.ietf.org/meeting/125/materials/slides-125-cfrg-longfellow-zk-00), [upstream README](https://raw.githubusercontent.com/google/longfellow-zk/main/README.md)).
Suggested change: status "v0.9; three external reviews of the C++ line published (ToB 2025-08-18 with 5 items open, ISRG fix v0.8.4, Ligero 2025-12-15); Rust port unreviewed"; drop "TRL 4" everywhere; decision 2 becomes "pilot on the reviewed C++ line; require a review before adopting the Rust port or any circuit change of ours".

**15. "Pilot on a 1.x tagged release".**
Spec says: section 8 "Pilot on a 1.x tagged release only after review reports land"; section 10 decision 2 "build against main, pilot on a reviewed tag" (also PLAN M8 item 1).
Evidence: upstream tags are v0.8.1 through v0.9 (2026-03-31); no 1.x exists; the Rust tree has no tag; `main` moved on 2026-08-12 (PR #176, Rust mdoc parser hardening). Trail of Bits reviewed commit `981a349fad` with fixes in `60c7180b78` / `487b3a585a`; ISRG's fix is v0.8.4. Dyne's v1.0.0 (2026-08-31) is unreviewed and Dyne's own security page says review claims must not be transferred across a fork ([longfellow-zk.md](components/longfellow-zk.md), [dyne-longfellow-fork.md](components/dyne-longfellow-fork.md), [mopro.md](components/mopro.md), [wallet-mdl-platforms.md](components/wallet-mdl-platforms.md), [onchain-verifier-nullifier.md](components/onchain-verifier-nullifier.md); [releases](https://github.com/google/longfellow-zk/releases), [Dyne security.md](https://raw.githubusercontent.com/dyne/longfellow-zk/main/docs/security.md)).
Suggested change: "Pilot on upstream v0.9, or a later tag that contains the Trail of Bits and ISRG fixes; our M4 circuit changes and any fork need their own review."

**16. "Wrap longfellow" and the Mopro ask.**
Spec says: Prover runtime row "Wrap longfellow; fall back to WASM where native isn't possible"; section 5 ask to the Mopro team "Longfellow bindings for iOS/Android" (PARTNERS.md row 2).
Evidence: a code search for longfellow across the zkmopro org returns nothing; the only trace is a 2025-09-23 maintainer comment on issue #438; the Dyne fork has no Android or iOS presets (only `wasi`); upstream has `android.sh` (arm64-v8a, API 24) and `ios.sh`; the EUDI iOS wrapper ships `MdocZK.xcframework`, so the C++ side does cross-compile ([longfellow-zk.md](components/longfellow-zk.md), [mopro.md](components/mopro.md), [dyne-longfellow-fork.md](components/dyne-longfellow-fork.md); [zkmopro org](https://github.com/zkmopro), [issue #438 comments](https://api.github.com/repos/zkmopro/mopro/issues/438/comments), [EUDI iOS wrapper](https://github.com/eu-digital-identity-wallet/av-lib-ios-longfellow-zkp)).
Suggested change: "Our work: write the longfellow adapter (git-pinned Rust `mdoc-zk-runtime` with `uniffi::export`, or a C-ABI wrap of `mdoc_zk.h`); nothing exists today"; phrase the section 5 ask as a from-scratch collaboration, not a request for something in flight.

**17. "Production use in PSE apps".**
Spec says: Prover runtime row status "Production use in PSE apps".
Evidence: Mopro's projects page never uses the word "production" and says the listed examples "are implemented with native ZK provers and may not utilize the Mopro stack"; pse.dev says "Active"; PSE's own Mopro/Flutter app is labelled a PoC (`wallet-unit-poc/mobile`) with open issue #40 (Android 2-4x slower than iOS) ([mopro.md](components/mopro.md), [pse-zkid.md](components/pse-zkid.md); [Mopro projects](https://zkmopro.org/docs/projects), [pse.dev](https://pse.dev/projects/mopro)).
Suggested change: "Active, 0.3.7 (2026-07-14); incubated by PSE; used in PSE PoCs, no production claim".

**18. Mopro source and licence (minor).**
Spec says: Prover runtime row source "EF / PSE".
Evidence: the README says a joint PSE/0xPARC grant and "currently incubated by PSE" (PSE now "Privacy Stewards of Ethereum"); both `LICENSE-APACHE` and `LICENSE-MIT` are present, GitHub reports Apache-2.0, pse.dev says MIT; sibling crates `rust-rapidsnark` and `witnesscalc_adapter` carry no LICENSE file ([mopro.md](components/mopro.md); [Mopro README](https://raw.githubusercontent.com/zkmopro/mopro/main/README.md)).
Suggested change: keep the source; record the licence as "MIT OR Apache-2.0" in the audit inventory and note the unlicensed sibling crates.

**19. WASM as a fallback that exists.**
Spec says: Prover runtime row "fall back to WASM where native isn't possible"; section 3 "longfellow via Mopro/WASM"; section 6 item 1; section 6a Level 2 "longfellow-zk in WASM on a real iPhone and Pixel"; section 8 "Safari WASM memory ... confirm on an iPhone 13".
Evidence: the upstream repo contains no wasm/emscripten/wasm32 code (0 code-search hits) and the only WASM PR (#3) was closed unmerged; the only WASM build anywhere is Dyne's GPL WASI module, documented for Node.js only, with no published browser or Safari run; Mopro's WASM path is Halo2-centric ("works well with wasm-bindgen-rayon"), its web template "works only for example circuits", and C-ABI wraps cannot target WASM. Memory figures available: C++ v0.9 under 200 MB, Rust under 100 MB; the EUDI iOS wrapper reports that on iOS 26 the extension process cannot run the prover ([longfellow-zk.md](components/longfellow-zk.md), [mopro.md](components/mopro.md), [dyne-longfellow-fork.md](components/dyne-longfellow-fork.md); [wasm issues](https://github.com/google/longfellow-zk/issues?q=wasm), [Dyne JS binding](https://raw.githubusercontent.com/dyne/longfellow-zk/main/bindings/javascript/longfellow_zk.mjs), [Mopro web setup](https://zkmopro.org/docs/setup/web-wasm-setup), [v0.9 notes](https://github.com/google/longfellow-zk/releases/tag/v0.9)).
Suggested change: "WASM prover is new work: a WASI build of the Apache upstream C++ or a wasm-bindgen build of the Rust tree; Mopro contributes scaffolding only; M1 produces the first browser data point."

**20. "ETSI TS 119 476-2 contribution" and "existing ETSI/ISO channels".**
Spec says: Standards row "ETSI TS 119 476-2 contribution"; section 10 decision 5 "contribute the US mDL ZK profile through PSE zkID's existing ETSI/ISO channels".
Evidence: PSE's mastermap lists "OpenAC ETSI Profile ... In Progress" with no contribution record; TS 119 476-2 is scoped to the EUDI Wallet, with a stable draft for public review targeted end-Q3 2026, formal stable draft 2026-11-30 and publication 2027-02-28 (EU issue #498), after PLAN M9 (2026-12-20); TR 119 476-1 V1.3.1 contains zero mentions of OpenAC, PSE or zkID; no ISO channel run by PSE zkID was found ([pse-zkid.md](components/pse-zkid.md); [PSE mastermap](https://pse.dev/mastermap/zkid), [EU issue #498](https://github.com/eu-digital-identity-wallet/eudi-doc-standards-and-technical-specifications/issues/498)).
Suggested change: Standards row "OpenAC profile for ETSI TS 119 476-2 in progress (EUDI-scoped; publication 2027-02-28)"; decision 5 names a venue that can take a US profile before M9 (AAMVA guidelines, ISO 18013-5 edition 2 ZK text) or accepts that ETSI lands after the pilot.

**21. "EU deployments" and "EU-first".**
Spec says: Standards row status "Active, EU-focused"; section 5 "PSE zkID (EF) | Own the standards track, benchmarks, EU deployments"; section 7 "PSE's OpenAC work is EU-first".
Evidence: the mastermap lists "EU Commission Engagement" (presentations and workshops, Completed) and "Third Party Wallet Integration" (unnamed EU vendors plus MODA/TWDIW, Ongoing); the only named government integration is Taiwan's TWDIW; no EU deployment, EU wallet vendor or member-state pilot was found ([pse-zkid.md](components/pse-zkid.md); [PSE mastermap](https://pse.dev/mastermap/zkid), [TWDIW integration](https://github.com/zkmopro/TWDIW-integration)).
Suggested change: section 5 "Own the standards track and benchmarks; EU Commission engagement; Taiwan (TWDIW) integration"; section 7 "PSE's OpenAC standards work targets the EUDI Wallet; its one government integration is Taiwan."

**22. "Live, 21 states + PR".**
Spec says: Credential row status "Live, 21 states + PR" (undated).
Evidence: 21 states + PR is TSA's REAL ID waiver list, which includes Oklahoma (app decommissioned 2024-02-08, HB 3015 still in the Senate, no live mDL). TSA's checkpoint list is 20 states + PR (2026-09-02). Apple lists 15 states + PR, Google 10 + PR on its pages (11 + PR counting Ohio, 2026-08-31). AAMVA's page renders no list. The Credence March 2026 tracker says "21 states and territories" including PR, and its wallet columns disagree with the wallets' own pages. Counts moved twice during the research week (Virginia to Apple 2026-08-26, Ohio to Google 2026-08-31); Utah's current mDL sunsets 2027-01-01 ([mdl-state-coverage.md](components/mdl-state-coverage.md), [wallet-mdl-platforms.md](components/wallet-mdl-platforms.md), [aamva-vical.md](components/aamva-vical.md), [iso-18013-5-mdoc-fixtures.md](components/iso-18013-5-mdoc-fixtures.md); [TSA checkpoints](https://www.tsa.gov/digital-id/participating-states), [TSA waivers](https://www.tsa.gov/realid/realid-mobile-drivers-license-mdls), [Apple](https://learn.wallet.apple/id), [Google](https://support.google.com/wallet/answer/12436402?hl=en), [Credence tracker](https://credenceid.com/resources/blog/us-mobile-drivers-license-mdl-state-tracker/)).
Suggested change: "Live, 20 states + PR at TSA checkpoints; 21 + PR hold federal waivers; Apple 15 + PR, Google 11 + PR (as of 2026-09-01)", with the date kept current.

**23. Which wallets answer the DC API.**
Spec says: Credential row "ISO 18013-5 mDL in Apple / Google / Samsung / state wallet"; section 3 "a phone with an mDL in a wallet that supports the Digital Credentials API"; section 8 "mDL holders only".
Evidence: Samsung's developer docs describe only the proprietary JWT/JWE "Verify with Samsung Wallet" flow with no Digital Credentials API support and no cross-device ("will be added soon"); Chrome's shipping post lists Samsung Wallet as "support on the way". The browser path (Apple Wallet on iOS 26 plus Google Wallet) covers at most 11 states + PR (AZ, AR, CA, CO, GA, IA, MD, MT, NM, ND, OH, PR), not the headline count; guests in app-only states (AK, KY, LA, NY, UT), Samsung-only combinations, and Android users in Google-less states (HI, IL, VA, WV, and OH until Google's pages update) have no browser path ([digital-credentials-api.md](components/digital-credentials-api.md), [mdl-state-coverage.md](components/mdl-state-coverage.md); [Samsung docs](https://developer.samsung.com/wallet/verifywithsamsungwallet.html), [Chrome post](https://developer.chrome.com/blog/digital-credentials-api-shipped)).
Suggested change: Credential row "ISO 18013-5 mDL; DC API answered by Apple Wallet (iOS 26) and Google Wallet, 11 states + PR; Samsung and state apps have no browser path today"; section 8 "mDL holders in Apple or Google Wallet states only".

**24. Hand-off status omits desktop cross-device and the mixed-protocol hang.**
Spec says: Hand-off row status "Chrome/Android live; Safari iOS 26".
Evidence: confirmed as far as it goes (Chrome 141, 2025-09-30; Safari 26.0, 2025-09-15), but Chrome 141 also shipped desktop cross-device (QR plus BLE proximity, Play services 24.0+), and WebKit documents that a request mixing OpenID4VP and Annex C protocols "may cause an infinite loading spinner on iOS when scanning QR codes from Chrome on macOS"; the "pin profile per platform" work item must cover the desktop-QR case. Two notes (mdl-state-coverage, iso-18013-5-mdoc-fixtures) did not re-verify the browser-version claim ([digital-credentials-api.md](components/digital-credentials-api.md), [wallet-mdl-platforms.md](components/wallet-mdl-platforms.md); [Chrome 141 notes](https://developer.chrome.com/release-notes/141), [WebKit Safari 26.0](https://webkit.org/blog/17333/webkit-features-in-safari-26-0/)).
Suggested change: "Chrome 141+ (Android same-device; desktop cross-device via QR + BLE); Safari 26 / iOS 26 (Annex C only); one protocol per request".

**25. "Live on mainnet" for ERC-7812.**
Spec says: Trust-list anchor row "ERC-7812 ZK identity registry | Rarimo | Live on mainnet"; no standard status given.
Evidence: the contract is deployed and verified at `0x781246D2256dc0C1d8357c9dDc1eEe926a9c7812` on mainnet and Sepolia (2025-05-14) but has exactly one transaction (its initializer) and one `Initialized` event on both, so nobody has written a statement and Green Light would be the first tenant. ERC-7812 is Standards-Track status Review (since 2025-06-25), not Final; the interface changed once (`getIsolatedKey` made public), forcing a redeployment from `0x781268D4...7812`. Rarimo's own production registries run on its rollup (chain 7368), where the singleton address holds no code, and its ZK Passport contracts do not reference the mainnet singleton. No audit covers `evidence-registry` (Rarimo's four Halborn reports are for other components); the contract is immutable; Etherscan shows the linked `PoseidonUnit2L` library as unverified bytecode ([erc-7812-rarimo.md](components/erc-7812-rarimo.md); [Etherscan](https://etherscan.io/address/0x781246D2256dc0C1d8357c9dDc1eEe926a9c7812), [EIP-7812](https://eips.ethereum.org/EIPS/eip-7812), [Rarimo audits](https://docs.rarimo.com/resources/audits/)).
Suggested change: status "Deployed on mainnet and Sepolia (2025-05-14), unused; ERC in Review; unaudited, immutable; pin the address"; section 6 item 6 audit scope names the registry read path and the Poseidon library.

**26. "Port longfellow verifier".**
Spec says: Onchain verifier row "Port longfellow verifier or verify offchain in pilot"; section 4 "port the verifier contract once the pilot proves demand".
Evidence: there is no longfellow verifier contract to port. A 291-325 KB Ligero proof costs about 4.9 M gas in calldata at 16 gas/byte and about 12.3 M under the EIP-7623 floor, against the EIP-7825 per-transaction cap of 16,777,216 gas, before any field arithmetic over GF(2^128) or P-256, for which no precompile exists; the paper says the design "does not require verifier succinctness". No Solidity verifier for Ligero/Brakedown-style proofs was found ([onchain-verifier-nullifier.md](components/onchain-verifier-nullifier.md); [EIP-7623](https://eips.ethereum.org/EIPS/eip-7623), [EIP-7825](https://eips.ethereum.org/EIPS/eip-7825), [ePrint 2024/2010](https://eprint.iacr.org/2024/2010.pdf)).
Suggested change: "Verify offchain; anchor the root and proof hash onchain; an EVM verifier would require wrapping longfellow verification in a SNARK (research), not a port."

**27. Semaphore cannot attach to longfellow as-is.**
Spec says: Nullifier row "Semaphore | EF / PSE | Live | Only if one-proof-per-person is ever needed".
Evidence: Semaphore v4 is live (v4.14.3, 15 networks), but longfellow's public statement `(PK_II, attr, Z, tr, time)` contains no deterministic per-licence value, so one-proof-per-person would require a third circuit change beyond the two listed in section 6 ([onchain-verifier-nullifier.md](components/onchain-verifier-nullifier.md); [Semaphore deployments](https://docs.semaphore.pse.dev/deployed-contracts)).
Suggested change: "Only if one-proof-per-person is ever needed; requires a nullifier output added to the mdoc circuit."

**28. Row count.**
Spec says: "Nine rows. Two are ours."
Evidence: the table has ten rows (Credential, Hand-off, Circuit, Prover runtime, Standards + benchmarks, Trust-list anchor, Onchain verifier, Nullifier, Verify service + desk UI, Reference deployment) ([pse-zkid.md](components/pse-zkid.md)).
Suggested change: "Ten rows. Two are ours."

### Section 3, guest side

**29. Device binding is already in the circuit, and it signs a transcript, not a nonce.**
Spec says: circuit statement 4 "Device-bound key signed the verifier's nonce."; "Longfellow covers 1-3 today. Item 4 and the Merkle membership in 1 are our additions."; section 6 item 2 "device-key nonce signature".
Evidence: `run_mdoc_prover` / `run_mdoc_verifier` take a session `transcript` argument; the witness builder hashes `["DeviceAuthentication", SessionTranscript, DocType, DeviceNameSpacesBytes]` per ISO 18013-5 9.1.3.4 and the signature circuit verifies the device signature over it (`dpk_sig_`); paper Algorithm 10 already includes `p256.verify((r2,s2), H(tr||hdr), devicekey)` with `tr` public. Under both DC API protocols the nonce enters only through the handover hash inside the SessionTranscript: OpenID4VP 1.0 `["OpenID4VPDCAPIHandover", sha256(cbor([origin, nonce, jwkThumbprint]))]` (Google: `SessionTranscript = [null, null, [...]]`) and Annex C `["dcapi", sha256(cbor([encInfoB64u, origin]))]`, so the circuit must accept two transcript shapes, and the fixture must be a full DeviceResponse ([longfellow-zk.md](components/longfellow-zk.md), [onchain-verifier-nullifier.md](components/onchain-verifier-nullifier.md), [digital-credentials-api.md](components/digital-credentials-api.md), [iso-18013-5-mdoc-fixtures.md](components/iso-18013-5-mdoc-fixtures.md); [mdoc_zk.h](https://raw.githubusercontent.com/google/longfellow-zk/main/lib/circuits/mdoc/mdoc_zk.h), [mdoc_witness.h](https://raw.githubusercontent.com/google/longfellow-zk/main/lib/circuits/mdoc/mdoc_witness.h), [mdoc_signature.h](https://raw.githubusercontent.com/google/longfellow-zk/main/lib/circuits/mdoc/mdoc_signature.h), [OpenID4VP 1.0](https://openid.net/specs/openid-4-verifiable-presentations-1_0-final.html), [Google Wallet online](https://developers.google.com/wallet/identity/verify/accepting-ids-from-wallet-online)).
Suggested change: statement 4 "Device-bound key signed the SessionTranscript whose handover hashes the page origin, the verifier nonce and the encryption-key thumbprint (already in the circuit; we supply the transcript bytes and must handle the OpenID4VP and Annex C shapes)"; "Longfellow covers 2 and 4 today; the Merkle membership in 1 and the range check in 3 are our additions"; section 6 "One circuit addition: Merkle membership against the trust-list root" (plus the range check if kept).

**30. Issuer membership: not in the circuit, the issuer is visible, and the tree contents are wrong.**
Spec says: statement 1 "Issuer signature on the MSO verifies against a certificate whose hash is a member of the published trust-list root."; header "a venue learns 'over 21, license valid, issued by a real DMV' and nothing else"; Circuit row "add trust-list membership"; section 4 "Merkle tree of issuer cert hashes".
Evidence: the circuit verifies the issuer signature against a public key `(pkx, pky)` given as a public input; no x5chain is parsed and no membership is proven, so the verifier learns which DMV signed, contradicting "nothing else" until the addition lands (an `assert_signatures_with_issuer_list` gadget exists but is unwired). Dyne's planned `FixedDepthSha256MerkleMembership` is capped at `Depth <= 4` (16 leaves) with no node domain separator (Trail of Bits finding 4 recommended domain separation), while the AAMVA VICAL already held 17 certificates in January 2026 and Arizona alone had 7 roots in March 2026. Separately, VICAL aggregates IACA keys, the presented mdoc's x5chain carries only the DS certificate, and the circuit's public input is the DS key, so a VICAL-derived root cannot match what the circuit verifies without either enumerating DS certificates (rotating within 15 months, not published in VICAL) or an in-circuit DS-to-IACA chain check ([longfellow-zk.md](components/longfellow-zk.md), [dyne-longfellow-fork.md](components/dyne-longfellow-fork.md), [iso-18013-5-mdoc-fixtures.md](components/iso-18013-5-mdoc-fixtures.md); [mdoc_signature.h](https://raw.githubusercontent.com/google/longfellow-zk/main/lib/circuits/mdoc/mdoc_signature.h), [Dyne Merkle contract](https://raw.githubusercontent.com/dyne/longfellow-zk/main/docs/merkle-membership-contract.md), [PR #125](https://github.com/google/longfellow-zk/pull/125)).
Suggested change: header "and, once our Merkle addition ships, nothing else; today the verifier also learns the issuing state"; statement 1 "Issuer (DS) key is a member of the published trust-list root, or the DS certificate chains in-circuit to an IACA in the root (decide in M4)"; section 6 item 2 specify tree contents, depth of at least 6 and a domain-separated hash.

**31. `expiry_date` range check is not supported.**
Spec says: statement 3 "`expiry_date` > verifier-supplied date." and "Longfellow covers 1-3 today."
Evidence: the circuit only checks the MSO `validityInfo` window (`validFrom <= now <= validUntil`) against the public `now` string; attribute checks are byte-equality of a CBOR value; a range comparison on the `expiry_date` data element is not supported ([longfellow-zk.md](components/longfellow-zk.md); [mdoc_hash.h](https://raw.githubusercontent.com/google/longfellow-zk/main/lib/circuits/mdoc/mdoc_hash.h), [v0.8.2 notes](https://github.com/google/longfellow-zk/releases/tag/v0.8.2)).
Suggested change: statement 3 "MSO validity window (`validFrom`/`validUntil`) contains the verifier-supplied time" (what the circuit does), or keep `expiry_date >` and add a range gadget to section 6 as our work.

**32. The page receives an encrypted response, not "the signed mdoc".**
Spec says: flow "page receives the signed mdoc"; section 8 "The page holds the plaintext mdoc for ~1 second before proving."
Evidence: both platforms encrypt the response to the relying party's key: HPKE per ISO 18013-7 Annex C on Safari, JWE via `response_mode: dc_api.jwt` on Google (mandatory under HAIP and required by Google Wallet). Apple's documentation assumes the key is on a server ("keep the encryption key safely on your server and rotate it frequently"; WWDC: key "generated earlier on the server") and Google says to store private keys per request; whether either wallet accepts a per-session key generated in the browser is stated nowhere. As documented, the plaintext lands on the server, not the page ([digital-credentials-api.md](components/digital-credentials-api.md), [wallet-mdl-platforms.md](components/wallet-mdl-platforms.md); [Apple web request](https://developer.apple.com/documentation/IdentityDocumentServices/Requesting-a-mobile-document-on-the-web), [Google Wallet online](https://developers.google.com/wallet/identity/verify/accepting-ids-from-wallet-online), [HAIP 1.0](https://openid.net/specs/openid4vc-high-assurance-interoperability-profile-1_0-final.html)).
Suggested change: flow "page receives the HPKE/JWE-encrypted DeviceResponse and decrypts it with a per-session key generated in the page"; section 8 add "whether the wallets accept a browser-generated recipient key is an M1 go/no-go item; if not, proving must move server-side or native".

**33. "No app install" needs Safari proper on iOS 26.**
Spec says: "No app install for the browser path"; section 6a Level 1 flow.
Evidence: WebKit's Safari 26.0 post says "Digital Credentials is not yet supported in WKWebView" (bug 293646 still NEW), so QR scans that open in an in-app browser (camera hand-offs into social or messaging apps) fail; Verify with Wallet on the Web requires iOS 26 on iPhone 11 or later ([digital-credentials-api.md](components/digital-credentials-api.md); [WebKit Safari 26.0](https://webkit.org/blog/17333/webkit-features-in-safari-26-0/), [Apple Business guide](https://support.apple.com/guide/business/prepare-set-verify-wallet-web-abcb17bcda04/web)).
Suggested change: "No app install for the browser path, but on iOS the page must open in Safari itself (not an in-app browser) on iOS 26 / iPhone 11 or later."

**34. `age_over_21` is not guaranteed to be present or requestable.**
Spec says: "requests `age_over_21` and `expiry_date`"; statement 2 "`age_over_21` is true".
Evidence: 6 CFR 37.10(a)(4) mandates family_name, given_name, birth_date, issue_date, expiry_date, issuing_authority, document_number, portrait plus AAMVA `DHS_compliance` and `DHS_temporary_lawful_status`; `age_over_21` is not mandatory under the waiver rule (AAMVA Guidelines 1.6 say issuers "shall include" an `age_over_NN` for each of their common ages, giving 18, 21, 65 as the example, but that is guidance, not the federal rule). Apple's web permissions form offers age verification as "Age over N flag" and "Issuing authority"; whether `expiry_date` can be requested under the age category rather than the identity category is not stated ([mdl-state-coverage.md](components/mdl-state-coverage.md), [wallet-mdl-platforms.md](components/wallet-mdl-platforms.md), [iso-18013-5-mdoc-fixtures.md](components/iso-18013-5-mdoc-fixtures.md); [6 CFR 37.10](https://www.law.cornell.edu/cfr/text/6/37.10), [AAMVA Guidelines 1.6](https://www.aamva.org/getmedia/1bc1f2b3-bc7b-4e44-8112-127a4110ad94/mDLImplementationGuidelines-16.pdf)).
Suggested change: "requests `age_over_21` (present in AAMVA-conformant mDLs, not mandated by 6 CFR 37.10; the request must handle its absence) and `expiry_date` (confirm Apple's age category allows it)".

### Section 4, verifier side

**35. "60 s TTL" is unsupported.**
Spec says: "session nonce (60 s TTL)".
Evidence: no DC API, OpenID4VP, Apple or Google source states or constrains a nonce lifetime ([digital-credentials-api.md](components/digital-credentials-api.md)).
Suggested change: "session nonce (60 s TTL, our choice)".

**36. Publishing a SHA-256 root to ERC-7812 reverts half the time.**
Spec says: "Merkle tree of issuer cert hashes -> publish root over HTTPS and to ERC-7812".
Evidence: the ERC says the registry "MUST NOT accept keys or values beyond the underlying elliptic curve prime field size" and the contract reverts with `NumberNotInPrimeField` on any key or value >= the BN128 prime; a raw 256-bit SHA-256 root is out of range roughly half the time. Only a Poseidon tree or a reduced/truncated root can be published, which the spec does not mention and which must be settled with the M4 circuit owner ([erc-7812-rarimo.md](components/erc-7812-rarimo.md); [erc-7812.md](https://raw.githubusercontent.com/ethereum/ERCs/master/ERCS/erc-7812.md), [IEvidenceRegistry.sol](https://raw.githubusercontent.com/rarimo/evidence-registry/main/contracts/interfaces/IEvidenceRegistry.sol)).
Suggested change: "Merkle tree of issuer keys (Poseidon, field-sized root; or SHA-256 root reduced into the BN128 field) -> publish root over HTTPS and to ERC-7812".

**37. The pipeline cannot be a single VICAL fetch.**
Spec says: "fetch AAMVA VICAL -> Merkle tree of issuer cert hashes"; section 2 "AAMVA VICAL root"; section 7 "the VICAL root".
Evidence: several states publish IACA roots outside VICAL (California at trust.dmv.ca.gov, Arkansas, Iowa, New Mexico, Puerto Rico per Google's issuer page; Georgia and Hawaii too); California was not in the March 2026 VICAL. A root that unions VICAL with state-published roots is no longer "the VICAL root". Publishing a Merkle tree, inclusion proofs and a changelog derived from the VICAL is arguably a "derivative work" the AAMVA T&C prohibits without prior written permission, and republishing the certificates plainly is; the spec does not address this ([aamva-vical.md](components/aamva-vical.md), [mdl-state-coverage.md](components/mdl-state-coverage.md); [AAMVA T&C](https://www.aamva.org/identity/mobile-driver-license-digital-trust-service/for-relying-parties/terms-and-conditions-for-relying-parties), [Google issuer page](https://developers.google.com/wallet/identity/verify/supported-issuers-iaca-certs)).
Suggested change: "fetch AAMVA VICAL and the state-published IACA roots -> DMV trust-list root"; rename the anchor "DMV trust-list root (VICAL plus state roots)"; add to section 8 Legal "AAMVA T&C forbids derivative works; written permission is a pilot prerequisite".

**38. "Refresh on each VICAL update" and the 24-hour timelock.**
Spec says: "refresh on each VICAL update"; section 8 "a 24-hour timelock on root updates".
Evidence: the VICAL `nextUpdate` is `date` + 24 h and files are daily when published, so the onchain root is always at least one day behind; the archive shows publication gaps of 93, 55, 42, 39, 39, 22, 13 and 11 days, so "each VICAL update" is not a steady daily cadence and the pipeline must tolerate a stale `nextUpdate`; every daily file has a new `vicalIssueID`, so change detection must compare the certificate set ([aamva-vical.md](components/aamva-vical.md); [VICAL archive](https://vical.dts.aamva.org/previousVical)).
Suggested change: "refresh when the certificate set changes (VICAL publishes daily when it runs, with gaps of weeks); the onchain root lags the list by at least the 24 h timelock".

### Section 5, who we call

**39. Rarimo: there is no "slot".**
Spec says: "Rarimo | Own ERC-7812 | Registry slot for the VICAL root" (PARTNERS.md row 4 has the same wording).
Evidence: the registry is permissionless ("permissionaless [sic], immutable smart contract"); there is no onboarding and no slot concept; the first `addStatement` from any address creates that address's namespace ([erc-7812-rarimo.md](components/erc-7812-rarimo.md); [erc-7812.md](https://raw.githubusercontent.com/ethereum/ERCs/master/ERCS/erc-7812.md)).
Suggested change: ask "Review of the root policy and Safe/timelock configuration; root-encoding advice; confirmation that the mainnet singleton is the intended deployment".

**40. AAMVA: access is free; the blocker is the T&C.**
Spec says: "AAMVA DTS | Own the trust list | Relying-party access to VICAL"; section 7 "VICAL is distributed to registered relying parties only"; section 6a "a real credential needs AAMVA trust-list access and a registered relying party" (also README line 106).
Evidence: AAMVA says "Relying parties can gain free access the VICAL by clicking on the button below" and "All relying parties can download the VICAL"; there is no registration, only click-through T&C; the current file (`vc-2026-09-02-1788308189919`, 30,855 bytes) and the signer certificates answer HTTP 200 to an anonymous `curl -I`. The T&C forbids distributing download links and creating derivative works without AAMVA's prior written permission ([aamva-vical.md](components/aamva-vical.md), [iso-18013-5-mdoc-fixtures.md](components/iso-18013-5-mdoc-fixtures.md), [mdl-state-coverage.md](components/mdl-state-coverage.md); [AAMVA relying parties](https://www.aamva.org/identity/mobile-driver-license-digital-trust-service/for-relying-parties), [VICAL portal](https://vical.dts.aamva.org/), [T&C](https://www.aamva.org/identity/mobile-driver-license-digital-trust-service/for-relying-parties/terms-and-conditions-for-relying-parties)).
Suggested change: section 7 "VICAL is free to download behind click-through terms that forbid redistribution and derivative works"; section 6a "a real credential needs a registered relying party with each wallet vendor"; section 5 ask "Written permission to publish a Merkle root, inclusion proofs and changelog derived from the VICAL, and for the multi-sig signers to hold copies".

### Sections 6 and 6a, what we build and the demo

**41. The test-DMV fixture has constraints the spec does not state.**
Spec says: section 6a Level 1 "Test mDL signed by our test DMV cert; proof may be stubbed".
Evidence: PLAN M0's `scripts/gen-test-dmv.sh` writes a bare self-signed P-256 certificate without the Annex B extensions that mdoc verifiers (Multipaz, `@owf/mdoc`) check; the fixture must be a full IssuerSigned plus DeviceSigned DeviceResponse with a proper IACA/DS chain, an MSO under longfellow's cap (2551 bytes per the v0.8.6 notes, 2533 bytes of raw MSO in `mdoc_constants.h`), P-256/SHA-256 only, and all requested attributes in one namespace ([iso-18013-5-mdoc-fixtures.md](components/iso-18013-5-mdoc-fixtures.md); [v0.8.6 notes](https://github.com/google/longfellow-zk/releases/tag/v0.8.6), [mdoc_constants.h](https://raw.githubusercontent.com/google/longfellow-zk/main/lib/circuits/mdoc/mdoc_constants.h), [@owf/mdoc](https://github.com/openwallet-foundation-labs/mdoc-ts)).
Suggested change: "Test mDL: a full DeviceResponse issued with `@owf/mdoc` under a test IACA/DS chain with Annex B extensions, P-256/SHA-256, MSO <= 2533 bytes, one namespace; proof may be stubbed".

**42. "A registered relying party" is understated.**
Spec says: section 6a "a real credential needs AAMVA trust-list access and a registered relying party".
Evidence: Apple Wallet requires a ReaderAuth certificate issued through Apple Business Connect (brand registration, permissions form, DNS TXT domain proof, CSR; certificate valid 397 days) and Google Wallet requires a Google-signed certificate plus `gw_rp_metadata_bytes` obtained via an intake form and an end-to-end demo video; Google Wallet only accepts `openid4vp-v1-signed` requests, so an unsigned-request example is not enough for a real Google Wallet mDL ([digital-credentials-api.md](components/digital-credentials-api.md), [wallet-mdl-platforms.md](components/wallet-mdl-platforms.md); [Apple Business guide](https://support.apple.com/guide/business/prepare-set-verify-wallet-web-abcb17bcda04/web), [Google Wallet online](https://developers.google.com/wallet/identity/verify/accepting-ids-from-wallet-online)).
Suggested change: "a real credential needs an Apple Business Connect ReaderAuth certificate (per brand and domain) and a Google-issued RP certificate with `gw_rp_metadata_bytes` (intake form, 3-5 business days); Google accepts signed requests only".

**43. Apple mock data: confirmed, with a Simulator caveat.**
Spec says: section 6a "Apple's developer profile returns mock data with a device signature and no issuer signature".
Evidence: one note (digital-credentials-api) found nothing in Apple's web-request page, Business guide or WWDC 232 stating this; the wallet-mdl-platforms note confirms it verbatim from Apple's Verify with Wallet getting-started page ("mock data containing a real device signature but no issuer signature") and the Business FAQ, and adds that the Simulator returns neither signature ([wallet-mdl-platforms.md](components/wallet-mdl-platforms.md), [digital-credentials-api.md](components/digital-credentials-api.md); [Apple getting started](https://developer.apple.com/wallet/get-started-with-verify-with-wallet/), [Apple Business FAQ](https://support.apple.com/guide/business/verify-with-wallet-on-the-web-faq-abcbb063f3a2/web)).
Suggested change: keep the sentence, cite the getting-started page, and add "the Simulator returns neither signature".

**44. "The artifact PSE zkID can benchmark against" and the co-published report.**
Spec says: section 6a "the artifact PSE zkID can benchmark against"; section 9 "public report co-published with PSE zkID".
Evidence: csp-benchmarks does not cover longfellow (zero mentions) and does not run on phones (a cloud device farm is a "future plan"); no PSE commitment to co-publish exists and the ask is "not sent" in PARTNERS.md ([pse-zkid.md](components/pse-zkid.md), [mopro.md](components/mopro.md); [csp-benchmarks README](https://github.com/ethereum/csp-benchmarks/blob/main/README.MD)).
Suggested change: "the artifact we will ask PSE zkID to benchmark against (their harness covers neither longfellow nor phones today)"; section 9 "public report, co-publication with PSE zkID to be agreed in the section 5 ask".

### Section 7, gaps

**45. Google's in-wallet ZK is documented for third parties, so the "no verifier accepts proofs" gap is partly closed.**
Spec says: "No verifier accepts proofs."; "Google is shipping ZK age proofs inside Wallet".
Evidence: confirmed and more precise: Google Wallet's DC API page (updated 2026-06-29) documents a production request format `mso_mdoc_zk` with `zk_system_type` `longfellow-libzk-v1` and a `circuit_hash`, verified by the longfellow reference service; Google's 2025-04-29 post announced ZKP in Wallet with Bumble as first partner. Which issuers or states support it, whether it works in sandbox, and what `verifier_message` binds are undocumented; no source states a UK-then-US rollout order for the ZK feature ([digital-credentials-api.md](components/digital-credentials-api.md), [wallet-mdl-platforms.md](components/wallet-mdl-platforms.md), [dyne-longfellow-fork.md](components/dyne-longfellow-fork.md); [Google Wallet online](https://developers.google.com/wallet/identity/verify/accepting-ids-from-wallet-online), [Google 2025-04-29](https://blog.google/products/google-pay/google-wallet-age-identity-verifications/)).
Suggested change: "No verifier accepts proofs except Google's own `mso_mdoc_zk` path (longfellow inside Google Wallet, coverage undocumented); every other mDL reader expects signed fields."

**46. "First to publish a verifiable root" cannot be confirmed.**
Spec says: "We are the first to publish a verifiable root."
Evidence: several unsanctioned public mirrors of VICAL-derived IACA certificates already exist (longfellow-zk `certs.pem`, universal-verify's registry on jsDelivr, stelauconseil's web verifier), though none publishes a signed or onchain Merkle root ([aamva-vical.md](components/aamva-vical.md); [certs.pem](https://github.com/google/longfellow-zk/blob/main/reference/verifier-service/server/certs.pem), [trusted-issuer-registry](https://github.com/universal-verify/trusted-issuer-registry)).
Suggested change: "No one publishes a signed, timelocked, onchain-anchored root today; unsanctioned certificate mirrors exist."

### Section 8, holes

**47. Revocation: the standard is catching up.**
Spec says: "Needs a DMV status list; none is ZK-ready."
Evidence: consistent, but ISO/IEC 18013-5 second edition (DIS, planned publication 2026-11-30, after the pilot start) adds `status` (Attestation Status List / Revocation List) to the MSO, and `@owf/mdoc` 0.7.0 already implements identifier-list revocation per that draft; whether longfellow parses an MSO carrying `status` is unknown ([iso-18013-5-mdoc-fixtures.md](components/iso-18013-5-mdoc-fixtures.md), [aamva-vical.md](components/aamva-vical.md); [EU tracker issue #84](https://github.com/eu-digital-identity-wallet/eudi-doc-standards-and-technical-specifications/issues/84), [@owf/mdoc CHANGELOG](https://raw.githubusercontent.com/openwallet-foundation-labs/mdoc-ts/main/CHANGELOG.md)).
Suggested change: "Needs a DMV status list; ISO 18013-5 edition 2 (planned 2026-11-30) adds one to the MSO, after pilot start; nothing is ZK-ready and longfellow's handling of `status` is untested."

Items 14, 15, 19 and 32 above also amend section 8 ("TRL 4", "1.x tag", "Safari WASM memory", "page holds the plaintext mdoc").

### Section 9, pilot

**48. New York fails the spec's own rule; California is not in VICAL.**
Spec says: "State: one where both Apple and Google Wallet issue the mDL. California default; confirm New York."
Evidence: New York appears on neither Apple's nor Google's list; TSA and NY DMV name only the "NY MiD app", and dmv.ny.gov does not mention ISO 18013-5. California is in both wallets (and Samsung and the CA DMV Wallet, 1.7 M active mDLs) but is not in the AAMVA VICAL (March 2026 data; Google sends California verifiers to trust.dmv.ca.gov), so "the VICAL root" would not cover it. Jurisdictions meeting the both-wallets rule today: AZ, AR, CA, CO, GA, IA, MD, MT, NM, ND, PR, plus OH since 2026-08-31; those also in the VICAL: AZ, CO, GA, MD, ND and IA (since 2026-07-30). Utah's current mDL sunsets 2027-01-01 and should be excluded ([wallet-mdl-platforms.md](components/wallet-mdl-platforms.md), [aamva-vical.md](components/aamva-vical.md), [mdl-state-coverage.md](components/mdl-state-coverage.md); [NY DMV](https://dmv.ny.gov/mobile-id), [Google issuer page](https://developers.google.com/wallet/identity/verify/supported-issuers-iaca-certs), [PeculiarVentures VICAL snapshot](https://github.com/PeculiarVentures/mdl-state-of-the-nation)).
Suggested change: "California default (both wallets; IACA from trust.dmv.ca.gov, not VICAL); fallbacks AZ, CO, GA, IA, MD, ND (both wallets and in VICAL); New York dropped (app-only)".

**49. "p95 < 5 s on iPhone 13 / Pixel 6" has no supporting data.**
Spec says: "Proof generation p95, iPhone 13 / Pixel 6 | < 5 s"; section 8 "confirm on an iPhone 13 in week one".
Evidence: PSE's only data on those devices (June 2025, SHA-256 over 2 kB) is Binius 5.01 / 5.10 s, Ligero 29.8 / 93.6 s, Plonky2 out of memory; Mopro publishes no iPhone 13 numbers for anything and only a Noir Keccak figure for Pixel 6 (1303 ms); no minimum iOS/Android version is documented for Mopro bindings, so whether they even run on an iPhone 13 is unverified; longfellow's own phone numbers are for Pixel 9 / iPhone 15+ ([pse-zkid.md](components/pse-zkid.md), [mopro.md](components/mopro.md); [PSE mobile benchmarks](https://pse.dev/blog/efficient-client-side-proving-for-zkid), [Mopro performance](https://zkmopro.org/docs/performance)).
Suggested change: keep the target but label it "hypothesis; no published longfellow data on these devices; M1 sets the baseline".

Items 13, 22 and 44 above also amend section 9 (timing figure, dated state count, co-publication).

### Section 10, decisions

Items 14 and 15 (decision 2), 20 (decision 5) and 39 (Rarimo, decision 3's signer set is untouched) cover the decisions section; no other discrepancy was found there.

## Still unverified

Grouped by theme; each item names what would settle it.

### longfellow and the Dyne fork
- Whether Dyne's WASI module runs in a browser or Safari at all, whether a non-Node loader exists anywhere in the fork outside `bindings/javascript/` (the GitHub API rate limit blocked a full-tree listing), and whether anyone has published a WASI build of the Apache-licensed upstream. Settles it: clone both repos, `git grep -i wasm` the fork, build the upstream with the WASI SDK, load it in Safari on an iPhone 13 (M1).
- Whether the longfellow Rust crates (`libc`, `sha2/asm`, `zstd`) compile to `wasm32-unknown-unknown`. Settles it: `cargo build --target wasm32-unknown-unknown` on the pinned commit.
- Whether any further upstream security review is pending beyond the three published (reviews page lists none; README says two are underway), whether a separate ISRG report exists (only Google's summary was found), the severity of the ISRG finding, and which upstream tag first contains the Trail of Bits fix commits `60c7180b78` / `487b3a585a`. Settles it: `git tag --contains` on a clone, and the question to Google in PARTNERS.md row 3.
- Whether the Rust longfellow path will have a reviewed tag by M8 (the Rust tree has no tag at all). Settles it: Google's answer on a 1.0 plan and a Rust review.
- Affiliation shorthand "Ligero / Bar-Ilan" for the Ligero panel is approximate: the PDF lists IMDEA/Ligero, Bar-Ilan/Ligero, Georgetown/Ligero, Bar-Ilan. Settles it: cite the author block of the PDF.
- Any Dyne maintenance commitment after PACESETTERS ends 2027-02-28. Settles it: ask Dyne.

### Mopro
- Whether a `mopro init` app needs the `nightly-2025-11-15` toolchain for iOS/Android builds or only for the WASM / `wasm-bindgen-rayon` path. Settles it: build the scaffold with stable Rust for `aarch64-apple-ios`.
- Minimum iOS / Android versions supported by generated Mopro bindings (not documented). Settles it: ask the Mopro team; install on an iPhone 13 and Pixel 6.
- SPEC's "Production use in PSE apps": no Mopro-published source uses "production" for any listed project. Settles it: ask which named apps ship `mopro-ffi`.
- Whether the gnark template was already in mopro 0.3.5 (PR #691 merged 2026-02-25, before the 0.3.5 release, yet the 0.3.6 notes list it). Settles it: diff the 0.3.5 tag; immaterial to the plan.

### PSE zkID
- No Telegram or mailing list for zkID (absence only, not exhaustively searched); reviewer bandwidth and a named partner-relations contact are not discoverable publicly. Settles it: the section 5 ask.
- No ETSI document or contribution record naming PSE (only the TR text and the EU tracking issue were searchable; the ETSI member portal is not accessible). Settles it: ask PSE for the meeting or contribution number.
- SPEC section 5 "EU deployments" and the mastermap's "EU wallet vendors": no named vendor, pilot or member state found; Taiwan TWDIW is the only named government integration. Settles it: ask PSE to name them.
- No public audit report for OpenAC or `mdoc.circom` (the only audit artefacts seen belong to `2/ZK-PROOF-OF-PERSONHOOD`). Settles it: ask PSE whether one is scheduled.
- The Notion 2026 roadmap is client-rendered and unreadable to the fetcher. Settles it: open it in a browser.

### Digital Credentials API and the wallets
- OpenID Foundation IPR/licence terms for OpenID4VP 1.0 and HAIP 1.0 (not checked). Settles it: read the OIDF IPR policy before reusing spec text.
- Firefox 149 Digital Credentials presentation on macOS via Apple's platform API (CG matrix and a vendor blog only; no Mozilla source). Settles it: a Mozilla release note or a test on Firefox 149.
- The Annex C `dcapi` SessionTranscript / `dcapiInfo` structure against the paywalled ISO/IEC TS 18013-7:2025 text (only a third-party README and `@owf/mdoc` source state it). Settles it: buy TS 18013-7:2025 and read Annex C.
- Whether Samsung Wallet answers a W3C Digital Credentials API request today (Android announcement and CG matrix say yes or planned; Samsung's own docs describe only the proprietary path). Settles it: send a DC API request to a Galaxy with a Samsung Wallet mDL.
- Whether Google Wallet's sandbox test ID carries `age_over_21` and `expiry_date`, and whether a sandbox mDL doctype (rather than the Utopia ID pass) can be issued to test phones. Settles it: create a test ID in sandbox and inspect the DeviceResponse; ask Google.
- Whether Apple or Google accepts an HPKE recipient key generated in the browser rather than on the RP server. Settles it: test in Apple's developer profile and Google's sandbox; ask both (this decides the browser-prover design).
- Whether Apple Business Connect will approve one brand/domain for a neutral proving page serving many venues. Settles it: file the permissions form.
- Which Google issuers/states support `mso_mdoc_zk` in production, whether ZK works in sandbox, and what `verifier_message` binds (the RP doc shows `"verifier_message": "challenge"` with no definition). Settles it: ask wallet-identity-rp-support@google.com; test in sandbox.
- The content of https://www.iso.org/standard/91154.html (403 / bot check on every attempt; confirmed via catalogue mirrors). Settles it: a browser fetch.

### AAMVA VICAL and state coverage
- Contents of today's VICAL file (jurisdiction list, `nextUpdate`, `version`); all VICAL-content statements rest on the 2026-03-10 PeculiarVentures snapshot. Whether `/certificates/*` serve PEM or DER (HEAD only), whether `/vical/vc` is a supported "latest" endpoint (works, undocumented), and whether archive gaps mean nothing was published or `/previousVical` is incomplete. Settles it: a named person accepts the T&C, downloads the file and certificates, and parses them; ask AAMVA about the endpoint and the gaps.
- The AAMVA DTS Terms and Conditions text as seen behind the download button (the text at the aamva.org URL was read; the portal's own click-through page was not opened). Settles it: open the portal in a browser.
- AAMVA relying-party registration terms (fee, agreement, refresh cadence) are not published on the DTS or portal pages; the aamva-vical note establishes that there is no registration and no fee today. Settles it: confirm with AAMVA and ask about the production DTS.
- Whether any waiver state exposes a per-mDL status or revocation list to relying parties, and whether a Phase 2 mDL rulemaking is scheduled. Settles it: ask the pilot DMV and the TSA REAL ID office.
- The "21 states + PR" figure: AAMVA's page renders no list; only the Credence March 2026 tracker says "21 states and territories", and its Apple column disagrees with Apple's own page. Settles it: use the TSA lists with an as-of date (item 22).
- Illinois expansion to Google and Samsung Wallets (ilsos.gov times out; only search snippets seen) and Delaware Mobile ID details (services.dmv.de.gov rejects automated fetches). Settles it: browser fetches.
- Contents of https://azmvdnow.gov/certificates/ (script-rendered), the AAMVA jurisdiction data map (interactive), and iso.org catalogue pages (HTTP 403); the ISO 18013-5 edition 2 DIS stage and 2026-11-30 date rest on the EUDI tracker and search snippets. Settles it: browser fetches.
- Date of the MOVE magazine article and McCaskill's title (differs between movemag and AAMVA news); any dated AAMVA news item for Montana, North Dakota or Illinois joining the DTS; `vical-parser` "has one author". Settles it: minor; check in a browser or drop the citations.
- The claim that only Apple Wallet (iOS 26/Safari) and Google Wallet (Chrome/Android) answer the Digital Credentials API is inherited from wallet-mdl-platforms.md and was not re-checked by the state-coverage pass. Settles it: the Samsung test above.

### ERC-7812
- `updateStatement` at 1,025 leaves (622,575 gas) and `execute(updateStatement, 1 leaf)` via TimelockController (177,453 gas) were not reproduced in the 2026-09-02 local re-run. Settles it: re-run the Hardhat script with fixed keys and record both runs in `packages/trust-list`.
- Safe `execTransaction` gas overhead on top of the timelock was never measured. Settles it: deploy a Safe on Sepolia and measure one scheduled update.
- Whether a registry contract exists on the Rarimo rollup under an address other than the canonical `0x7812...7812` (only the canonical address was checked by RPC). Settles it: ask Rarimo.

### Onchain verifier and nullifier
- Licence of the `barretenberg/sol` Honk Solidity sources (not checked in-tree). Settles it: read the directory's licence headers.
- Gas cost of a ZKPassport `RootVerifier.verify` call on mainnet (not published). Settles it: ask ZKPassport or replay a mainnet call.
- Whether `compressed-evm` outer proofs are produced on the phone or in the `cloudProverUrl` prover, and what the prover receives. Settles it: ask ZKPassport.
- Absence of any published Solidity verifier for Ligero/Brakedown-style proofs (absence claim). Settles it: cannot be proven; ask Aztec.
- Whether any external audit of Semaphore v4 exists beyond the March 2024 internal PSE audit. Settles it: ask PSE.
- Whether a published longfellow review report exists: the onchain-verifier pass found none via the IETF slides and landing page, while the longfellow-zk pass found the Trail of Bits and Ligero PDFs on the reviews page; the ISRG review remains summary-only. Settles it: treat the two PDFs as published and ask Google for the ISRG report.

### ISO 18013-5 fixtures
- The exact CDDL of the paid ISO/IEC 18013-5:2021 text (MSO `version`, `deviceKeyInfo`, three-element SessionTranscript) and whether the 2021 or DIS-2 text keeps `x5chain` in the unprotected header (inferred from the 2020 DIS plus implementations). Settles it: buy the 2021 text and the DIS before M4 test vectors are frozen.
- Whether longfellow parses an MSO carrying the edition-2 `status` element or a multi-certificate `x5chain`. Settles it: feed such an MSO to `run_mdoc_prover`; ask Google.
- Whether production California or New York MSOs fit the 2533/2551-byte longfellow cap. Settles it: ask the DMV for MSO size and `age_over_NN` count, or measure a real DeviceResponse in M6.
- walt.id `waltid-identity` mdoc modules were not evaluated. Settles it: not needed unless `@owf/mdoc` fails.

### Breach context
- The exact launch date of Nexus (Krebs: "this week"; the ad was seen 2026-08-31). Settles it: a Krebs follow-up or a second source.
- All counts (153M+, 10M+, 3M+, 579k, 170M, ~1.1M Canadian, 473,673 Ontario, ~400k added in 24 h) are the seller's claims as relayed by Krebs; whether 153M licenses are distinct people or include repeat scans; the breach mechanism and storage architecture ("one vendor, one database"). Settles it: a vendor or FBI statement; none exists.
- The FBI New Orleans investigation rests solely on Krebs's account of a conference call; fbi.gov returns HTTP 403 and site search finds nothing. Settles it: an FBI press release; watch the field-office news page from a browser.
- No vendor statement exists on idscan.net, trust.idscan.net or the press page; the customer-notification email quoting "may be implicated" exists only as a reader comment. Settles it: watch the vendor sitemaps (baseline lastmod 2026-08-28) and Trust Center (baseline one "incident" hit).
- "High-resolution" as a description of the images (not in Krebs); hotels, casinos and retail checkouts as breach sites. Settles it: nothing short of new reporting; reword the spec (items 4 and 6).
- Any second outlet with original reporting: none found; AP, Reuters, Wired, Ars Technica, The Verge, NYT, WSJ, NOLA.com and Politico block the fetcher, so their silence is unknown. Settles it: search those outlets from a browser.
- Planet 13's 2022 8-K on sec.gov (HTTP 403) was not read. Settles it: open it in a browser; immaterial to the plan.
