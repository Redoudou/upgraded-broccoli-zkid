# Green Light — spec v3
Zero-knowledge proof of a US driver's license, generated on the guest's phone, accepted by any venue. Assembled from existing Ethereum-ecosystem and Google components. Open source, Apache-2.0.
**Claim:** a venue learns "over 21, license valid, issued by a real DMV" and nothing else. A breached venue database yields no identities.
**Not a claim:** does not replace the plastic card, does not cover people without a mobile driver's license (mDL), and does not by itself satisfy laws that require a venue to *record* a name.
**What changed from v1:** the cryptography is no longer ours to build. Google's longfellow-zk ships an ISO mDoc circuit for US mDLs; the Ethereum Foundation's PSE ships the mobile prover, the identity standards work, and the benchmarks. We assemble, audit, govern, and deploy.
---
## 0. Context — why this, why now
On August 31, 2026 a dark-web service called Nexus began selling scans of more than 153 million US and Canadian driver's licenses, plus roughly 10 million ID cards, 3 million travel documents and 579,000 medical cards. KrebsOnSecurity traced the images to a Louisiana-based identity-verification vendor whose scanners sit at hotel desks, car-rental counters, dispensaries, casinos and retail checkouts; secondary reporting names idscan.net, whose customers include Hertz, Target, FedEx and Caesars. The FBI's New Orleans office opened an inquiry the same day. Records carry high-resolution front and back images, some with infrared and UV captures, and timestamps that match the day the victim rented a car or bought cannabis. Krebs found his own license in it; so did a sitting cabinet secretary.
**What this breach is.** Not a leak of numbers. A leak of the photo, the signature and the physical document, indexed by when and where you showed it. It is the first ID breach where the stolen record is sufficient on its own to impersonate someone in person.
**What caused it.** Not a bug. A business model. Every venue that must check an ID is told the safe way to do it is to scan and store the whole card with a vendor. One vendor, one database, 153 million licenses. Compliance created the honeypot.
**What triggered this research.** The question is not how to secure the database. It is why the database exists. A venue needs one bit — "over 21" or "valid license" — and today it collects the entire document to get it. Zero-knowledge proofs let the phone answer the bit without handing over the document. The pieces to do this exist, built separately by Google, the Ethereum Foundation and the wallet vendors, with no US deployment and no one convening them. That is the gap this spec closes.
**Why the EEA.** The hard part is not the cryptography. It is getting a DMV, two wallet vendors, a verifier vendor, a venue chain and a standards body to agree on one profile and one trust root. That is a neutral-convener problem.
---
## 1. Architecture
```
 GUEST PHONE                            VERIFIER (venue)               PUBLIC
 ┌────────────────────────┐             ┌──────────────────────┐      ┌────────────────────┐
 │ Apple / Google Wallet  │             │ Desk screen (any PC) │      │ DMV trust list     │
 │  state-signed mDL      │             │  QR w/ session nonce │      │  AAMVA VICAL root  │
 └───────────┬────────────┘             └──────────┬───────────┘      │  → ERC-7812 onchain│
             │ W3C Digital Credentials API         │                  └─────────┬──────────┘
 ┌───────────▼────────────┐             ┌──────────▼───────────┐                │
 │ Prover page (PWA)      │── proof ──▶ │ Verify service       │◀── root ───────┘
 │  longfellow-zk mDoc    │             │  longfellow verifier │
 │  circuit via Mopro     │             │  nonce + root check  │
 │  wipe mdoc after       │             │  green / red         │
 └────────────────────────┘             │  store hash + time   │
                                        └──────────────────────┘
```
---
## 2. Bill of materials
| Layer | Component | Source | Status | Our work |
|---|---|---|---|---|
| Credential | ISO 18013-5 mDL in Apple / Google / Samsung / state wallet | State DMVs | Live, 21 states + PR | None |
| Hand-off | W3C Digital Credentials API, OpenID4VP, ISO 18013-7 | W3C, OIDF, ISO | Chrome/Android live; Safari iOS 26 | Pin profile per platform |
| Circuit | mDoc presentation circuit (ECDSA P-256, salted digests, ~1.2 s on phone) | Google longfellow-zk; Dyne.org fork without Google Play dependency | TRL 4, two security reviews in progress | Audit; add device-binding nonce check; add trust-list membership |
| Prover runtime | Mopro — Rust bindings for iOS and Android, CLI, cross-platform | EF / PSE | Production use in PSE apps | Wrap longfellow; fall back to WASM where native isn't possible |
| Standards + benchmarks | zkID / OpenAC, client-side proving benchmarks, ETSI TS 119 476-2 contribution | EF / PSE zkID | Active, EU-focused | Bring US mDL profile; co-author |
| Trust-list anchor | ERC-7812 ZK identity registry | Rarimo | Live on mainnet | Publish VICAL Merkle root; multi-sig |
| Onchain verifier | Solidity verifier pattern | ZKPassport / Aztec | Live | Port longfellow verifier or verify offchain in pilot |
| Nullifier (later) | Semaphore | EF / PSE | Live | Only if one-proof-per-person is ever needed |
| Verify service + desk UI | — | **Us** | — | Build (~300 lines) |
| Reference deployment | — | **Us** | — | Docker one-liner |
Nine rows. Two are ours. The rest is integration.
---
## 3. Guest side
**Needs:** a phone with an mDL in a wallet that supports the Digital Credentials API. No app install for the browser path; optional native app via Mopro for older iPhones.
**Flow:** scan QR → page opens → `navigator.credentials.get()` requests `age_over_21` and `expiry_date` → OS wallet sheet → biometric → page receives the signed mdoc → longfellow proves → page sends proof → wipes mdoc.
**Circuit statement (public outputs only):**
1. Issuer signature on the MSO verifies against a certificate whose hash is a member of the published trust-list root.
2. `age_over_21` is true and its salted digest is in the signed MSO.
3. `expiry_date` > verifier-supplied date.
4. Device-bound key signed the verifier's nonce.
Longfellow covers 1–3 today. Item 4 and the Merkle membership in 1 are our additions.
---
## 4. Verifier side
**Needs:** any screen that shows a QR, one HTTPS endpoint. Optional countertop reader for the plastic-card fallback.
**Verify service:** session nonce (60 s TTL) → QR → receive proof → run longfellow verifier → check nonce and root → green/red over websocket → store `{timestamp, proof_hash}` only.
**Trust-list pipeline:** fetch AAMVA VICAL → Merkle tree of issuer cert hashes → publish root over HTTPS and to ERC-7812 → refresh on each VICAL update.
**Onchain verification:** not in pilot. Publish the root onchain from day one; port the verifier contract once the pilot proves demand.
---
## 5. Who we call
| Party | Why | Ask |
|---|---|---|
| PSE zkID (EF) | Own the standards track, benchmarks, EU deployments | Co-author the US mDL profile; review circuit |
| Mopro team (EF / PSE) | Own the mobile prover | Longfellow bindings for iOS/Android |
| Google longfellow / Dyne.org | Own the circuit | Security-review status; device-binding extension |
| Rarimo | Own ERC-7812 | Registry slot for the VICAL root |
| Aztec / ZKPassport | Solidity verifier experience | Advice on the onchain port |
| AAMVA DTS | Own the trust list | Relying-party access to VICAL |
| One state DMV | Issuer | Named contact for pilot questions |
| One venue chain + one law firm | Pilot and legal memo | Two sites; regulator position |
---
## 6. What we actually build
1. **Glue in the prover page:** DC API request, longfellow via Mopro/WASM, proof upload, memory wipe, reproducible build with published hash.
2. **Two circuit additions:** device-key nonce signature; Merkle membership against the VICAL root.
3. **Verify service + desk screen.**
4. **Trust-list pipeline + ERC-7812 publisher + multi-sig policy.**
5. **Docker reference deployment.**
6. **Audit** of the assembled stack, not just longfellow.
Estimated: 2 engineers, 8 weeks to pilot-ready.
---
## 6a. Demo (PWA)
Two levels. Label which one is on screen.
| Level | What it shows | Real | Simulated | Time |
|---|---|---|---|---|
| 1 — Flow | Desk QR → phone → wallet-style sheet → green | Session, QR, verify service, hash-only storage | Test mDL signed by our test DMV cert; proof may be stubbed | Days |
| 2 — Proof | Same, with longfellow-zk in WASM on a real iPhone and Pixel | The ZK proof, on-device timing, wipe | Still a test credential | 2–3 weeks |
Cannot be demoed without a partner: a real state-issued mDL from Apple or Google Wallet. Apple's developer profile returns mock data with a device signature and no issuer signature; a real credential needs AAMVA trust-list access and a registered relying party.
Level 2 is the week-2 benchmark from section 9, packaged. Build it once; it becomes the sales tool for venues and the artifact PSE zkID can benchmark against.
---
## 7. Gaps that still exist
- **No US mDL profile in any standards body** for ZK presentation. PSE's OpenAC work is EU-first. We supply the AAMVA profile.
- **No verifier accepts proofs.** Every mDL reader on the market expects signed fields. Venue POS/PMS integration is new.
- **No in-wallet proving from Apple.** Google is shipping ZK age proofs inside Wallet; Dyne's analysis warns that routing ZK through an OS API reintroduces a privacy leak. Our page stays as the platform-neutral path.
- **No trust-list anchor exists.** VICAL is distributed to registered relying parties only. We are the first to publish a verifiable root.
---
## 8. Holes
**Technical**
- Longfellow is TRL 4 with reviews in progress. Pilot on a 1.x tagged release only after review reports land.
- Safari WASM memory. Longfellow's Ligero-based design is lighter than SNARK-based ECDSA, but confirm on an iPhone 13 in week one. Mopro native app is the fallback.
- Revocation. VICAL covers issuers, not individual licenses. A revoked, unexpired license passes. Needs a DMV status list; none is ZK-ready.
- Trusted time. Expiry check uses the verifier's timestamp as a public input; a malicious verifier can only make the check stricter.
**Trust**
- The page holds the plaintext mdoc for ~1 second before proving. Mitigated by static site, no third-party scripts, CSP, reproducible build. Eliminated only when proving moves into the wallet.
- Root publisher can insert a fake DMV. Multi-sig, public changelog, and a 24-hour timelock on root updates.
**Legal**
- Hotels must often record name and address; age-only proof is insufficient. Age-gated retail is the clean first case.
- No regulator has said a ZK proof satisfies an age-verification obligation. Legal memo before pilot; regulator letter as a pilot deliverable.
**Adoption**
- mDL holders only. Plastic-card path stays.
- Reader vendors have no incentive to accept proofs until a chain demands it.
---
## 9. Pilot
**Venue:** one age-gated retail chain (2 sites) plus one hotel site as the hard case.
**State:** one where both Apple and Google Wallet issue the mDL. California default; confirm New York.
**Scale:** 8 weeks live, 500 proofs.
| Metric | Target |
|---|---|
| Proof generation p95, iPhone 13 / Pixel 6 | < 5 s |
| Verification failure on valid license | < 2% |
| Guest opt-in when offered | > 30% |
| PII in venue database after audit | 0 |
| Staff time vs plastic card | ≤ equal |
**Timeline**
- Weeks 0–2: iPhone benchmark of longfellow via Mopro and WASM; go/no-go on browser vs native.
- Weeks 2–8: circuit additions, prover page, verify service, trust-list publisher, legal memo, venue integration.
- Weeks 8–16: live pilot; weekly metrics; public report co-published with PSE zkID.
---
## 10. Decisions now
1. Browser or native prover — decided by the week-2 benchmark.
2. Wait for longfellow review reports before pilot — yes; build against main, pilot on a reviewed tag.
3. Root operator — EEA, multi-sig with PSE and one DMV as signers, published policy.
4. First venue — age-gated retail, not hotel.
5. Standards home — contribute the US mDL ZK profile through PSE zkID's existing ETSI/ISO channels rather than open a new track.
