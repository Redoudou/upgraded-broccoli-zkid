# Partner asks (spec section 5)

| Party | Ask | Owner | Sent | Reply by | Status | Blocks |
|---|---|---|---|---|---|---|
| PSE zkID (EF) | Co-author US mDL profile; review circuit | convener | | 2026-09-11 | not sent | M4 review, M9 report |
| Mopro team (EF / PSE) | Longfellow bindings for iOS/Android | eng B | | 2026-09-08 | not sent | M1 native runs |
| Google longfellow / Dyne.org | Security-review status; device-binding extension | eng B | | 2026-09-08 | not sent | M4, M8 item 1 |
| Rarimo | ERC-7812 registry slot for the VICAL root | eng A | | 2026-09-18 | not sent | M5 |
| Aztec / ZKPassport | Advice on the onchain port | eng A | | 2026-10-09 | not sent | post-pilot |
| AAMVA DTS | Relying-party access to VICAL | — | — | — | not pursued (ADR-0009) | none — synthetic VICAL is permanent |
| One state DMV (CA default, NY to confirm) | Named pilot contact; multi-sig signer | convener | | 2026-09-25 | not sent | M5 signer, M8 item 4 |
| Venue chain + law firm | Two retail sites, one hotel; legal memo | convener | | 2026-09-18 | not sent | M7, M8 items 3 and 5 |

Update this table when an ask goes out. The M0 gate requires every row to have a sent date, except AAMVA DTS: that ask is not going out (ADR-0009), by decision, not by delay.

## Questions per partner

Copied from the "Open questions for the partner call" section of each component note in [components/](components/README.md). Each bullet names its source note in brackets; the first-listed note is the one matched to the row, the rest are questions other notes addressed to the same party. Discrepancies these questions rest on are in [SPEC-NOTES.md](SPEC-NOTES.md).

- **PSE zkID (EF)**
  - [pse-zkid] Who is the responsible editor for an mdoc/AAMVA profile: a `1/OPENAC` extension, the `3/ZK-AGE-VERIFICATION` "accepted Driver License profile", or a new numbered spec in `ethereum/zkID` vs `zkspecs` (issue #86)? Will PSE accept a longfellow-based profile that does not use OpenAC's Prepare/Show split?
  - [pse-zkid] ETSI: is PSE an ETSI member or contributing via a member? Which meeting or contribution number carries the OpenAC profile, and can a US mDL annex ride on it before the end-Q3-2026 stable draft? If not, which ISO channel did SPEC section 5 mean?
  - [pse-zkid] Which EU wallet vendors and which Commission workshops are behind "EU wallet vendors" and "EU Commission Engagement"? Is any EU pilot live, or is TWDIW the only government integration?
  - [pse-zkid] Circuit review (M4): will PSE review a longfellow fork adding IACA-root Merkle membership and a nonce-signature check, given their mdoc note already proposes both? Expected turnaround before 2026-10-11?
  - [pse-zkid] Benchmarks: would PSE add longfellow to `csp-benchmarks` (non-Rust folder, ECDSA + SHA-256 targets, `is_zk` evidence) and accept Green Light's iPhone 13 / Pixel 6 numbers into the quarterly results or a co-published report?
  - [pse-zkid] mdoc status: when does PR #107 land, is there a test-vector set for ISO 18013-5 presentations, and is any audit of OpenAC or `mdoc.circom` scheduled?
  - [pse-zkid] Age semantics: their age spec infers age from issuance policy; Green Light needs `age_over_21` from the MSO. Are they open to a US profile using the mdoc date/boolean normalization in `mdoc-spec.md`?
  - [pse-zkid] Trust registry: their impact goal is "governments using Ethereum (or L2) as an identity trust registry"; would PSE be a signer on the ERC-7812 VICAL-root multi-sig (ADR-0003)?
  - [pse-zkid] Licensing: confirm the licence for the `1/OPENAC` text and for `csp-benchmarks` (no LICENSE file) before reuse in an Apache-2.0 repo.
  - [pse-zkid] Contacts: who is the single point of contact and reply-by owner for the 2026-09-11 ask?
  - [digital-credentials-api] Which `SessionTranscript` handover variants (OpenID4VPDCAPIHandover, Annex C `dcapi`) does the mDoc circuit accept for the device-signature statement, and is the `jwkThumbprint` / `EncryptionInfo` a public input? (also to Google longfellow / Dyne)
  - [digital-credentials-api] ISO/OIDF liaison via PSE: timeline for the HAIP appendix in the next 18013-7 revision, which would let the page ship one profile.
  - [onchain-verifier-nullifier] Semaphore/PSE: recommended pattern for gating group membership on an external credential proof; any production deployment doing this; is a nullifier extension to longfellow's mdoc circuit something PSE zkID would co-design with Google?
  - [onchain-verifier-nullifier] Semaphore: confirm no external audit of v4 beyond the March 2024 PSE audit, and the current status of the trusted-setup artifacts for depths 1-32.
  - [iso-18013-5-mdoc-fixtures] Multipaz / PSE zkID: can `multipaz-longfellow` prove over an `@owf/mdoc`-issued fixture, giving a second implementation to cross-check M1 numbers?
  - [breach-context] Any independent knowledge of follow-up reporting on the license-scan breach? Agreement to cite the event in the co-published report only with the qualifiers in breach-context.md?

- **Mopro team (EF / PSE)**
  - [mopro] Has anyone at PSE/Mopro already cross-compiled Google's Rust longfellow (`rust/` tree, merged 2026-08-12) for `aarch64-apple-ios` or `aarch64-linux-android`, or to `wasm32`? Any numbers?
  - [mopro] Which route do they recommend: a git-pinned Rust dependency exported with `#[uniffi::export]` in a "None of above" project, or a first-class `mopro-ffi/longfellow` feature? Would they host the adapter under the zkmopro org and co-maintain it?
  - [mopro] Can the M1 native runs be paired with a Mopro engineer before 2026-09-13 (reply-by 2026-09-08)?
  - [mopro] Is the `nightly-2025-11-15` pin required for iOS/Android builds, or only for `wasm-bindgen-rayon`? What is their reproducible-build story (two machines, same xcframework hash)?
  - [mopro] Minimum iOS/Android versions the generated bindings support; anything known about JNA or UniFFI 0.32 behaviour on iPhone 13 / Pixel 6.
  - [mopro] Does `wasm-bindgen-rayon` threading work in Safari on iOS 26 (SharedArrayBuffer, COOP/COEP) for a non-Halo2 prover, or should the WASM leg bypass Mopro entirely?
  - [mopro] Memory guidance: their Halo2 RSA benchmark died at 5 GB; longfellow claims <100 MB on desktop for the Rust prover. Will they add an mDoc row to `zkmopro.org/docs/performance` and to `csp-benchmarks` once the mobile device farm exists?
  - [mopro] What does "production" mean in the Mopro project list, and which named apps actually ship `mopro-ffi` today (needed to defend the SPEC row)?
  - [mopro] Any audit or review of `mopro-ffi` planned; what is the path from 0.3.x to a stable 1.0 API?
  - [mopro] The zkmopro org has `alcohol-purchase-frontend`, `TWDIW-official-app` (fork of Taiwan MODA's OID4VC/OID4VP wallet) and `TWDIW-integration`: is there an age-verification or mdoc effort we can join rather than duplicate?

- **Google longfellow / Dyne.org**
  - [longfellow-zk] Is there a planned 1.0 tag, and which tag/commit does Google consider the reviewed baseline: v0.9, or a Rust release? Will the Rust port get its own Trail of Bits review before production?
  - [longfellow-zk] Will Google wire `assert_signatures_with_issuer_list` (or a Merkle membership gadget) into `generate_circuit` / `run_mdoc_prover`? What issuer-list size do they target, and would they accept an upstream PR for a VICAL-root membership check (AAMVA VICAL had 17 certs in Jan 2026)?
  - [longfellow-zk] The Ligero panel analysed 140 opened columns for 115 bits; `kLigeroNreqv7 = 132` "~109 bits". Which is shipped, and is a parameter bump planned?
  - [longfellow-zk] Is a range check on `expiry_date` (or any non-equality attribute predicate) on the roadmap, or should Green Light rely on MSO `validityInfo`?
  - [longfellow-zk] Has Google or Dyne run the prover in Safari (WASM/WASI) on an iPhone 13-class device? Any memory numbers? Dyne: can the WASI build and JS bindings be relicensed for an Apache-2.0 project?
  - [longfellow-zk] Multi-namespace attributes and DC API handover: what exact SessionTranscript bytes does Google Wallet sign under the DC API, so the verify service can reconstruct them?
  - [longfellow-zk] Trail of Bits #11 (timing leak in ECDSA witness building) and #12 (MAC forgery on zero input) remain unresolved: is a fix scheduled?
  - [longfellow-zk] Which real US mDL issuers have been tested against circuit v7 (MSO <= 2551 bytes)? Do California and New York MSOs fit?
  - [dyne-longfellow-fork] Trail of Bits names commit `981a349fad` and its fix review names `60c7180b78` / `487b3a585a`; ISRG's fix is `v0.8.4`. Which tagged release first contains all fixes, and is any further review (the "two independent security reviews" in the upstream README) still open, given the reviews page lists none pending? Date expected? (M8 item 1.)
  - [dyne-longfellow-fork] Will Dyne or Google review the two M4 additions (device-binding nonce, trust-list Merkle membership)? Would Google accept them as an upstream PR, given the Google CLA that Dyne's README objects to?
  - [dyne-longfellow-fork] Dyne's Merkle gadget is capped at depth 4 (16 leaves). Is a deeper tree planned, and is the no-domain-separator SHA-256 pairing intentional given ToB finding 4?
  - [dyne-longfellow-fork] Licence: is the GPL-3.0 switch permanent, and what terms would Dyne offer an Apache-2.0 project for a WASM prover shipped to browsers? Alternatively, does Dyne object to us pinning `3d1d196a69`?
  - [dyne-longfellow-fork] Has anyone verified a Dyne-built proof against Google's C++ or Rust verifier byte-for-byte? Can we get the fixture corpus used by `google-rust-parity`?
  - [dyne-longfellow-fork] Browser loader: is there a non-Node WASM loader for `longfellow_zk.mjs`, and has the WASI build run in Safari on an iPhone 13-class device (SPEC section 8 memory concern)?
  - [dyne-longfellow-fork] Android/iOS: any timeline for native presets, or should Mopro bind upstream directly?
  - [dyne-longfellow-fork] Does Dyne accept that receiving the mdoc via the DC API already exposes the document to the OS, and what mitigation would they endorse for the PWA path (their answer is "process isolation")?
  - [dyne-longfellow-fork] Maintenance after PACESETTERS ends 2027-02-28: who funds, and is a second maintainer planned?
  - [dyne-longfellow-fork] Does upstream's move to Rust for production change which tree Dyne will track?
  - [wallet-mdl-platforms] Will the reference verifier accept a trust-list Merkle root as a public input (SPEC section 3 statement 1), and is device-key nonce binding (statement 4) already covered by `verifier_message`? Is a 1.0 tag planned, given PLAN M8 item 1 expects "a reviewed 1.x tag"?
  - [iso-18013-5-mdoc-fixtures] Will the parser accept an MSO containing the edition-2 `status` element and a multi-cert `x5chain`; is an in-circuit DS-to-IACA check on the roadmap, or should Green Light's membership proof be over DS keys?
  - [onchain-verifier-nullifier] Any plan for a SNARK-friendly or EVM-friendly variant, or a nullifier output derived from a document-bound secret?
  - [digital-credentials-api] Which `SessionTranscript` handover variants (OpenID4VPDCAPIHandover, Annex C `dcapi`) does the mDoc circuit accept, and is the `jwkThumbprint` / `EncryptionInfo` a public input? (shared with PSE zkID)
  - [breach-context] Any independent knowledge of follow-up reporting on the breach; agreement on how it is cited in the co-published report.

- **Rarimo**
  - [erc-7812-rarimo] Is the mainnet singleton at `0x781246D2256dc0C1d8357c9dDc1eEe926a9c7812` the deployment Rarimo wants integrators to use, or is the Rarimo rollup (chain 7368) the intended home? Nothing is deployed at that address on the rollup today; if a registry lives there under another address, which one, and is there an L2-to-L1 root relay we could reuse?
  - [erc-7812-rarimo] Any planned interface change before Last Call/Final, and any intention to redeploy again? Would Rarimo commit to keeping `0x7812...7812` stable and to announcing changes on the Magicians thread?
  - [erc-7812-rarimo] Has `evidence-registry` (contracts, Poseidon libraries, `EvidenceRegistrySMT.circom`) been audited? Can the `PoseidonUnit2L`/`3L` library bytecode be source-verified on Etherscan?
  - [erc-7812-rarimo] Recommended encoding for a 256-bit issuer-certificate Merkle root as a field element; do they have a registrar template or circuit for "value under isolated key equals X against root R" that Green Light could reuse for the post-pilot onchain verifier?
  - [erc-7812-rarimo] Do they expect the mainnet tree to fill (cost to us grows with depth)? Any real gas figures from their own registrars?
  - [erc-7812-rarimo] Is root history retained indefinitely, and what grace window do they recommend for stale roots (TEST B6)?
  - [erc-7812-rarimo] Would Rarimo review the root policy document and the Safe/timelock configuration, and name a technical contact (public channels: Telegram https://t.me/+pWugh5xgDiE3Y2Jk, GitHub https://github.com/rarimo)?

- **Aztec / ZKPassport**
  - [onchain-verifier-nullifier] Measured mainnet gas for `RootVerifier.verify` on an `outer_count_4` proof, proof byte length and public-input count? Is the deployed verifier the ZK flavor (`BaseZKHonkVerifier`) or non-ZK?
  - [onchain-verifier-nullifier] Does `compressed-evm` mode run the recursive outer proof on the phone or in the cloud prover? What does the cloud prover receive (witness, MRZ data, only inner proofs)?
  - [onchain-verifier-nullifier] Has anyone at Aztec estimated a Noir circuit that verifies a Ligero + sumcheck proof over GF(2^128) (longfellow)? Constraint count, prover time, and would Aztec co-fund or review such a library?
  - [onchain-verifier-nullifier] External audit timeline for the circuits and `registry-contracts`; who is the auditor; is `security@aztec-labs.com` the right escalation path?
  - [onchain-verifier-nullifier] `RootRegistry` governance: who can add certificate/circuit roots, is there a timelock or guardian pause beyond `RootVerifier.pause()`; would they review Green Light's multi-sig plus 24 h timelock policy for the VICAL root?
  - [onchain-verifier-nullifier] Would ZKPassport expose the OPRF salted-nullifier network to third-party circuits, or document its server operators, for a DMV-unlinkable per-person identifier?

- **AAMVA DTS** — not pursued (ADR-0009); questions kept below only in case AAMVA or a state DMV approaches us first.
  - [aamva-vical] Written permission under the T&C to publish a Merkle root, inclusion proofs and a changelog derived from the VICAL, and for each multi-sig signer (EEA, PSE, one DMV) to download it. Are certificate hashes a "derivative work"?
  - [aamva-vical] Is `/vical/vc` a supported "latest" endpoint? Will `nextUpdate` be honoured as a contract, and is there any push or notification on out-of-cycle removals?
  - [aamva-vical] Production DTS: timeline, and whether relying-party terms, registration or fees change.
  - [aamva-vical] Exact list of jurisdictions in today's VICAL (we count 12 from news, 10 in March data). Is California onboarding? Is New York's key live? This decides SPEC section 9's pilot state.
  - [aamva-vical] Rotation policy for `ca_root.crt` and the VICAL signer; how much notice; can we pin the root for the 16-week pilot?
  - [aamva-vical] Does AAMVA object to a union of VICAL + state-published roots, and would AAMVA itself sign the root (SPEC decision 3)?
  - [aamva-vical] Any DMV status-list plan compatible with the ISO second edition's ASL/ARL revocation, since VICAL cannot cover a revoked, unexpired licence (SPEC section 8)?
  - [aamva-vical] Contact: Guidelines section 5.2 gives `identitymangagement@aamva.org` (spelled that way in the PDF); the 2024 one-pager names Tim Roufa, Manager, Identity Management. Confirm the current contact through the DTS technical-support form linked from the portal footer.
  - [mdl-state-coverage] What are the relying-party registration terms for https://vical.dts.aamva.org/ (fee, agreement, refresh cadence), and does VICAL today include all 21 + PR waiver states or only those that opted in?
  - [mdl-state-coverage] Is the six-stage implementation map exportable as data, and can we cite it for the SPEC count?
  - [iso-18013-5-mdoc-fixtures] Does downloading from `vical.dts.aamva.org` for a pilot require registration beyond the click-through terms? Can AAMVA publish DS certificates (or DS key hashes) alongside IACA keys so a trust root can cover what the mdoc actually carries?
  - [digital-credentials-api] Apple and Google both validate against an IACA trust store on the verifier side; can the VICAL root be published in a form both vendors' sandboxes accept?
  - [wallet-mdl-platforms] RP access to VICAL; several Google-listed states publish IACA only via `vical.dts.aamva.org`.
  - [breach-context] Does the breach change the case for relying-party access to VICAL for a hash-only verifier?

- **One state DMV (CA default, NY to confirm)**
  - [wallet-mdl-platforms] California DMV: named contact; confirm the IACA at `trust.dmv.ca.gov` is the root both wallets chain to; any position on ZK presentments satisfying age checks.
  - [wallet-mdl-platforms] New York DMV: any plan to issue to Apple or Google Wallet; otherwise drop NY from SPEC section 9.
  - [mdl-state-coverage] California DMV: relying-party onboarding for the CA DMV Wallet app path (non-DC-API); is `age_over_21` populated in California mdocs; any per-mDL status list?
  - [iso-18013-5-mdoc-fixtures] State DMV (CA / NY): DS certificate rotation period; MSO byte size and number of `age_over_NN` elements issued; digest algorithm and curve in production (longfellow needs SHA-256 and P-256); is `x5chain` in the protected or unprotected header; is `status` already present in MSOs ahead of edition 2?
  - [digital-credentials-api] Does the state's own wallet app register as an iOS Identity Document Provider and an Android Credential Manager holder?
  - [breach-context] Has the DMV issued guidance to relying parties since 2026-09-01? Does a stolen image set (visible, IR, UV) raise the risk of fraudulent re-issuance, and does that change the DMV's view of a status list for individual licenses (SPEC section 8, revocation hole)?

- **Venue chain + law firm**
  - [breach-context] Venue chain: which ID-scan vendor and plan do your sites use today, and is the retention setting the default "retain all"? Were you notified on 2026-09-01 or 2026-09-02? Do you have a contractual right to demand deletion of stored images?
  - [breach-context] Law firm (M7 memo): does the pilot state's age-verification rule require keeping a scan or record, or only performing a check? Does a ZK proof plus a hash-only log meet the "affirmative defense" standard the vendor markets? Which states restrict retention of scanned images (the vendor says some do without naming them)?
  - [mdl-state-coverage] Venue chain: which pilot-state venues already run mDL readers (Virginia ABC stores and Ohio casinos are named by issuers) and could host the hard case?
  - [mdl-state-coverage] Law firm: does presenting an mDL-derived proof satisfy age-verification statutes in CA, OH and VA, given each state's "companion, not replacement" policy?

- **Parties with questions but no row in the table**
  - Apple (Business Connect / Wallet team) [digital-credentials-api, wallet-mdl-platforms, mdl-state-coverage, iso-18013-5-mdoc-fixtures]: will Apple Business Connect issue a Verify with Wallet on the Web certificate to a non-profit convener (EEA) rather than a merchant, and approve one brand/domain for a page proving age for many venues? Can the HPKE recipient key be an ephemeral key generated in the browser so the mdoc never reaches our server? Is there any sandbox mDL for Apple Wallet beyond the developer profile's mock data, and does the mock `DeviceResponse` match the single-DS-cert, unprotected-header profile? Any roadmap for in-wallet ZK or `age_over_21`-only presentments that suppress the portrait? Are Kentucky, North Carolina, Oklahoma and Utah on a public timeline?
  - Google (Wallet Identity RP team, wallet-identity-rp-support@google.com) [digital-credentials-api, wallet-mdl-platforms, mdl-state-coverage, iso-18013-5-mdoc-fixtures]: confirm sandbox test IDs cover `age_over_21` and `expiry_date`; is `openid4vp-v1-unsigned` accepted at all, or is `openid4vp-v1-signed` with `gw_rp_metadata` mandatory? Which production issuers/states support `mso_mdoc_zk` today, does ZK work in sandbox, what exactly does `verifier_message` bind, which circuit version is served now and how often does it rotate, does the ZK path expose the underlying `DeviceResponse` to the page, and can a sandbox mDL (not an ID pass) be issued to test phones? When will Ohio appear on the help and IACA pages, and are Hawaii, Illinois, Virginia and West Virginia scheduled?
  - Samsung [digital-credentials-api]: date for DC API / Credential Manager support in Samsung Wallet for US mDLs; will it accept `openid4vp-v1-unsigned`, `org-iso-mdoc`, or both?
  - OWF Labs / Animo (`@owf/mdoc`) [iso-18013-5-mdoc-fixtures]: timeline to 1.0; rationale for moving `x5chain` into the protected header; would they accept a small "generate test mDL + DeviceResponse" CLI upstream so Green Light does not maintain one?
  - TSA REAL ID office [mdl-state-coverage]: is a Phase 2 mDL rulemaking scheduled, and would a ZK presentation profile be in scope?
  - Convener / everyone [breach-context]: who owns the weekly re-check of the Krebs article, its tag page and the vendor's Trust Center and press page, and by what date is SPEC section 0 corrected (suggest before the first ask is sent, reply-by 2026-09-08)? Does anyone have a primary source beyond Krebs (FBI, vendor, a second outlet with its own reporting)? Today there is none.
