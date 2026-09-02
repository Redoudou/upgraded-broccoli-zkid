# AAMVA DTS and the VICAL trust list
_Researched 2026-09-01 (fetches ran into 2026-09-02 UTC). Every claim carries a source link. Unverified statements are marked [unverified]._

## What it is

AAMVA's Mobile Driver License Digital Trust Service (DTS) is the VICAL provider for North American mDLs: it collects each participating DMV's IACA (issuing authority certificate authority) public-key certificate, vets the issuer against ISO/IEC 18013-5 and AAMVA's own guidelines, and republishes the set as a Verified Issuer Certificate Authority List that verifiers download and "use offline during a transaction" (quote from the one-pager [s10]; role confirmed by [s1] and [s13] §5.2). A VICAL is the structure of ISO/IEC 18013-5:2021 Annex C, which the standard's table of contents lists as "Annex C (informative) Verified issuer certificate authority list (VICAL) provider" on page 90 ([s25]): a CBOR map (`version`, `vicalProvider`, `date`, `vicalIssueID`, optional `nextUpdate`, and `certificateInfos[]`, each carrying a DER IACA certificate, `serialNumber`, `ski`, `docType[]` and optional issuer metadata) wrapped in a COSE_Sign1 whose unprotected header carries the signer chain in `x5chain` (COSE label 33) (CDDL from [s29]; x5chain/label 33 from [s30] only). A verifier uses it to check "That the issuing authority appears in the VICAL" and "That the credential's signature chain resolves to a public key listed in the VICAL" ([s31]). AAMVA's instance lives at https://vical.dts.aamva.org/; it is free, has no registration, and is gated only by click-through Terms and Conditions ([s2], [s5]); AAMVA's Director of Identity Management calls it "the one stop shop for relying parties to get public keys" ([s24]). Today's list is `vc-2026-09-02-1788308189919.cbor`, 30,855 bytes ([s5], [s9]). The archive is daily *when it runs*, not continuously: `/previousVical` lists 792 files on 777 distinct dates between 2023-08-06 and 2026-09-02, with publication gaps of 93 days (2023-08-16 → 2023-11-17), 55 days (2024-07-25 → 2024-09-18), 39 days (2024-11-01 → 2024-12-10), 39 days (2025-01-04 → 2025-02-12), 42 days (2025-09-27 → 2025-11-08), 22 days (2025-11-18 → 2025-12-10), 13 days (2026-01-02 → 2026-01-15) and 11 days (2026-05-08 → 2026-05-19), plus four entries misnamed `vc-2026-12-28…31` whose own timestamps read 2025-12-28…31 ([s6], re-counted 2026-09-02). Whether a gap means "no list published" or "archive page incomplete" is [unverified]. The DTS went live on 2024-04-15 with Utah and Maryland; Iowa became "the 12th jurisdiction" on 2026-07-30 ([s15], [s22]). AAMVA still calls it an "MVP" DTS, governed by the AAMVA Identity Management Committee, and issuers must comply with ISO/IEC 18013-5 plus AAMVA's Mobile Driver's License Implementation Guidelines, Version 1.6 (cover: July 2026) ([s1], [s11], [s13]).

## Where it lives

| Item | URL | Licence | Version / tag / commit seen today |
|---|---|---|---|
| DTS overview | https://www.aamva.org/identity/mobile-driver-license-digital-trust-service | AAMVA web content | "MVP" DTS; "does not receive, store, share, or otherwise interact with the personally identifiable information of any mDL holders" [s1] |
| VICAL portal | https://vical.dts.aamva.org/ (nav: `/currentVical`, `/previousVical`, `/trustcertificates`) | AAMVA DTS Terms and Conditions, click-through (legal gate only: the file and cert endpoints answered HTTP 200 to a plain `curl -I` with no cookie or session, so nothing enforces the click-through technically) | current `vc-2026-09-02-1788308189919`, 2026-09-02T00:16:29 [s5] [s7] [s9] |
| Current VICAL | https://vical.dts.aamva.org/vical/vc (alias) and `/vical/vc/vc-2026-09-02-1788308189919` | T&C | HEAD: `application/octet-stream`, `filename=vc-2026-09-02-1788308189919.cbor`, 30,855 B [s9] |
| VICAL signer and CA certs | `/certificates/vicalsigner`, `/certificates/ca_intermediate`, `/certificates/ca` on the same host | T&C | HEAD: `vicalsigner.crt` 1,419 B, `ca_intermediate.crt` 1,403 B, `ca_root.crt` 879 B; PEM or DER [unverified] [s8] [s9] |
| Relying-party page | https://www.aamva.org/identity/mobile-driver-license-digital-trust-service/for-relying-parties | — | cites Guidelines "Version 1.6" [s2] |
| Terms and Conditions (RP) | https://www.aamva.org/identity/mobile-driver-license-digital-trust-service/for-relying-parties/terms-and-conditions-for-relying-parties | — | no effective date or version shown [s3] |
| Privacy policy (RP) | https://www.aamva.org/identity/mobile-driver-license-digital-trust-service/relying-parties/privacy-policy-for-relying-parties | — | undated [s4] |
| Issuing-authority page | https://www.aamva.org/identity/mobile-driver-license-digital-trust-service/for-issuing-authorities | — | requires ISO 18013-5 + Guidelines 1.6; Identity Management Steering Committee approves [s11] |
| DTS one-pager (PDF) | https://www.aamva.org/getmedia/c3f7db4e-91aa-4646-8a90-bfd95bf869e1/DTS-One-Pager_FINAL_Web-Version.pdf | — | PDF metadata created 2024-04-05 [s10] |
| mDL Implementation Guidelines v1.6 (PDF) | https://www.aamva.org/getmedia/1bc1f2b3-bc7b-4e44-8112-127a4110ad94/mDLImplementationGuidelines-16.pdf | "AAMVA – Public Information"; © 2019-2025 AAMVA, no reproduction without permission | cover "Version 1.6 / July 2026"; changelog row 1.6 dated 2026-05-18; news item dated 6/30/2026 [s12] [s13] [s14] [s51] |
| ISO/IEC 18013-5:2021 | preview https://www.sis.se/api/document/preview/80031411/ ; catalogue https://www.dinmedia.de/en/standard/iso-iec-18013-5/346465162 | ISO copyright, paid | First edition 2021-09, 152 pages, status valid [s25] [s26] |
| ISO/IEC DIS 18013-5 (2nd edition) | https://www.iso.org/standard/91081.html (HTTP 403 to us); tracker https://github.com/eu-digital-identity-wallet/eudi-doc-standards-and-technical-specifications/issues/84 | — | DIS stage; "Planned publication date: 2026-11-30"; 2026-06-04 update "EPD is 2026-11/ Q4 2026" [s27] [s28] |
| VICAL CDDL and consumption procedure (vendor docs) | https://learn.mattr.global/docs/digital-trust-service/vical-overview ; https://learn.mattr.global/docs/digital-trust-service/vical-consumption | MATTR docs | [s29] [s30] |
| Open-source parsers | multipaz `SignedVical.parse` https://github.com/openwallet-foundation/multipaz ; npm `vical-parser` https://github.com/lukasjhan/vical | Apache-2.0; vical-parser says `"license": "MIT"` in package.json but ships no LICENSE file and GitHub detects no licence | multipaz pushed 2026-09-01, 291 stars; vical-parser 1.0.0, pushed 2025-11-26, 1 star, **not published on npm** (`registry.npmjs.org/vical-parser` → "Not found", 2026-09-02) [s45] [s46] [s56] |
| De-facto public IACA mirrors (partial, unsanctioned) | https://github.com/google/longfellow-zk/blob/main/reference/verifier-service/server/certs.pem ; https://github.com/universal-verify/trusted-issuer-registry ; https://github.com/PeculiarVentures/mdl-state-of-the-nation | Apache-2.0; MPL-2.0; no licence file | certs.pem last changed `c5c7e4f914` 2025-09-30; registry repo pushed 2026-08-20 but its `main` branch last commit is 2026-01-11 (the daily cron workflow `update_issuers_dev.yml`, `0 9 * * *`, targets the `dev` branch); dashboard data built 2026-03-11 [s36] [s42] [s44] |

## How Green Light uses it

- **SPEC §1 figure and §2 "Trust-list anchor" row**: "DMV trust list / AAMVA VICAL root → ERC-7812 onchain". **§4 trust-list pipeline**: "fetch AAMVA VICAL → Merkle tree of issuer cert hashes → publish root over HTTPS and to ERC-7812 → refresh on each VICAL update". **§3 statement 1**: the issuer cert hash is a member of the published root.
- **PLAN M5** (Sep 21 – Oct 11, eng A + Rarimo): `packages/trust-list` fetches, parses, builds the Merkle tree, publishes root + tree + signed changelog; runs on a synthetic VICAL until access; real VICAL is **M8 gate item 4**. **PARTNERS.md** row "AAMVA DTS | Relying-party access to VICAL | convener | reply by 2026-09-25 | blocks M8 item 4".
- **Correction to SPEC §6a, §7 and README line 106** ("VICAL is distributed to registered relying parties only"; "needs AAMVA trust-list access and a registered relying party"): AAMVA says "Relying parties can gain free access the VICAL by clicking on the button below" and "All relying parties can download the VICAL and load it in their mDL reader technologies" ([s2]); there is no registration ([s3] defines none). M8 item 4 is therefore not an access problem. It is a terms problem, next bullet.
- **T&C vs the M5 deliverables**: "You agree not to provide or distribute any download link provided in this website to any other person or organization"; "You also agree not to adapt, alter, or create a derivative work from any content of the DTS or this website"; use is limited to "your own personal use or for your organization's use", anything else needs "prior written permission of AAMVA" ([s3]). Publishing a Merkle tree of certificate hashes plus inclusion proofs and a changelog is arguably a derivative work; republishing the certificates themselves (README figure: "roster of DMV signing certs") plainly is. Options: written permission (ask in the partner call), or publish only the root hash and derive inclusion proofs client-side from state-published roots. Feed the M7 legal memo and record in an ADR.
- **Coverage gap vs SPEC §2 "Live, 21 states + PR" and §9 "California default; confirm New York"**: the VICAL held 10 authorities on 2026-03-10 (AK, AZ, CO, GA, IL, MD, MT, ND, UT, VA) ([s44]); AAMVA counted "the 12th jurisdiction" on 2026-07-30 ([s22]); a third-party registry tags 9 states `aamva_dts` as of 2026-08-20 ([s42]). California was not in the March list, and Google's issuer page (updated 2026-06-29) sends California verifiers to `trust.dmv.ca.gov`, not to the VICAL ([s34], [s44]) [unverified for today's file]. New York joined the DTS on 2026-06-30 ([s21]), but New York is not in either wallet: Google's issuer page (2026-06-29) lists AZ, AR, CA, CO, GA, IA, MD, MT, NM, ND and PR only ([s34]); Apple Wallet's list of 14 states + PR as of 2026-08-17 (AZ, MD, CO, GA, OH, HI, CA, IA, NM, MT, ND, WV, IL, AR) omits NY ([s58]); a March 2026 tracker says NY offers only its own "NY MiD" app ([s57]). States that are in the March 2026 VICAL *and* in both wallets: AZ, CO, GA, MD, ND; Iowa is in both wallets and joined the DTS 2026-07-30 ([s22], [s34], [s57], [s58]). So either the pilot state changes to one of those, or the pipeline must union the VICAL with state-published IACA roots (CA, GA, HI, PR publish theirs; see below), and the root is then no longer "the VICAL root" as SPEC §7 describes it.
- **Cadence**: PLAN M5 "refresh on each VICAL update" means daily when AAMVA is publishing, but the archive shows gaps of up to 93 days ([s6], see above), so the pipeline must tolerate a stale `nextUpdate` without failing closed on staleness alone. In the March 2026 list `nextUpdate` was `date` + 24 h (`2026-03-11T21:55:50+00:00`) ([s44]) [unverified for today's file]. With SPEC §8's 24-hour timelock the onchain root is always at least a day behind. TEST-PLAN E7 ("an unchanged one produces nothing") must compare the certificate set, not the file: every daily file has a new `vicalIssueID` and `date`.
- **Current code**: `packages/trust-list/src/cli.js` builds a root from a directory of DER/PEM files and has no VICAL parser. M5 needs: human download (T&C) → COSE_Sign1 verification against AAMVA's signer chain → extract `certificateInfos[].certificate` where `docType` includes `org.iso.18013.5.1.mDL` → write DER files → existing CLI.
- **Revocation (SPEC §8)**: "VICAL covers issuers, not individual licenses" stands. Guidelines 1.6 changelog: "Updated mDL Revocation to follow Issuing Authorities processes" ([s13]). The ISO second edition adds Attestation Status List / Attestation Revocation List, planned 2026-11-30 ([s27]), after pilot start (PLAN M9 begins 2026-10-26).

## How to build or integrate

**Human step first.** T&C acceptance is a click-through and the T&C forbids sharing the link, so a named person on the team opens https://vical.dts.aamva.org/, reads the terms, and downloads the current VICAL and the three trust certificates ([s3], [s5], [s8]). Nothing below was downloaded for this document; only HEAD requests were made.

Endpoints as observed with HEAD on 2026-09-02 ([s9]):
```
curl -I https://vical.dts.aamva.org/vical/vc
# HTTP/2 200  content-type: application/octet-stream  content-length: 30855
# content-disposition: attachment; filename=vc-2026-09-02-1788308189919.cbor
curl -I https://vical.dts.aamva.org/certificates/vicalsigner       # filename=vicalsigner.crt, 1419 B
curl -I https://vical.dts.aamva.org/certificates/ca_intermediate   # filename=ca_intermediate.crt, 1403 B
curl -I https://vical.dts.aamva.org/certificates/ca                # filename=ca_root.crt, 879 B
```
PeculiarVentures' pipeline discovers the current file by matching `/vical/vc/vc-[^'"]+` on the homepage and fetching it with `requests` ([s44]); the `/vical/vc` alias above returned the same current file, but nothing documents it as a supported endpoint [unverified].

Verification, per MATTR's relying-party procedure ([s30]): (1) "Extract the VICAL Signer certificate from the COSE_Sign1 unprotected header (x5chain, COSE label 33)"; (2) verify the COSE_Sign1 signature with the algorithm in the protected header (e.g. ES256, COSE -7); (3) "Build the certificate chain from the signer certificate up to the root CA" and check validity, key usage, revocation; (4) "Confirm the root of the chain matches one of the trust-anchor certificates you persisted" (AAMVA `ca_root.crt`). AAMVA's guidelines require the VICAL provider to sign with "ES256", "ES384" or "ES512" on P-256, P-384 or P-521 ([s13]).

Payload CDDL as given by MATTR, citing ISO/IEC 18013-5 Annex C ([s29]):
```
VICAL = { "version": tstr, "vicalProvider": tstr, "date": tdate, "vicalIssueID": uint, ? "nextUpdate": tdate,
  "certificateInfos": [+ { "certificate": bstr, "serialNumber": biguint, "ski": bstr, "docType": [+ tstr],
    ? "issuingAuthority": tstr, ? "issuingCountry": tstr, ? "stateOrProvinceName": tstr,
    ? "notBefore": tdate, ? "notAfter": tdate }] }
```

Node parser that fits `packages/trust-list` (Node, ESM), copied from the vical-parser README ([s46]). The README says `npm install vical-parser`, but no such package exists on the npm registry (checked 2026-09-02, [s56]); it must be installed from the GitHub repo (`npm install github:lukasjhan/vical`) and built with `tsc`:
```ts
// npm install github:lukasjhan/vical   (package.json says MIT, no LICENSE file; 1.0.0; NOT on npm)
import { parseVICAL, filterMDLCertificates } from "vical-parser";
const signedVical = parseVICAL(fs.readFileSync("vical.cbor"));
console.log(`Provider: ${signedVical.vical.vicalProvider}`);
console.log(`Certificates: ${signedVical.vical.certificateInfos.length}`);
const mdlCerts = filterMDLCertificates(signedVical.vical);
```
vical-parser has one author and 1 star; multipaz (Apache-2.0, 291 stars) exposes `SignedVical.parse(...)` in Kotlin and throws `"x5chain not set"` when the header is missing ([s45], [s46]). Whichever is used, verify the COSE signature against AAMVA's chain in our own code and do not rely on the parser's check. Then the existing step from `scripts/gen-test-dmv.sh`: `node packages/trust-list/src/cli.js <dir-of-DER-certs> > fixtures/root.txt`.

State-published IACA roots, for the union and for checking VICAL contents independently: California https://trust.dmv.ca.gov/certificates/ca-dmv-iaca-root-ca-crt.cer and the DMV developer page's "ISO 18013-5 IACA Root Certificate" plus a test-credentials root ([s34], [s37]); Georgia "Download Now" → https://dds.georgia.gov/document/document/ga-mdl-rootzip/download ([s39]); Hawaii "Download the IACA Certificate for your reader device here" → https://hidot.hawaii.gov/highways/files/2024/08/2024_HI_IACA_Root.zip ([s38]); Puerto Rico PEM at docs.pr.gov per the PeculiarVentures pipeline ([s44]); Arizona https://azmvdnow.gov/certificates/ per Apple's list, page is script-rendered and its contents are [unverified] ([s33], [s54]); Maryland publishes nothing and points businesses to the VICAL ([s40]).

## Status and risks

- **Maturity.** AAMVA calls it a "minimally viable product (MVP) version of a Digital Trust Service" (Guidelines §5.2) and the web page says "AAMVA has launched a minimally viable product (MVP) of the DTS which is governed by AAMVA's Identity Management Committee" ([s1], [s13]). April 2026 Identity Management Committee minutes mention "the status of the production project, a path forward, and funding considerations" ([s23]). A production DTS with new terms or fees could land mid-pilot. Fees today: none for relying parties ([s2]); "Currently, there is no fee for a member issuing authority to participate in the DTS" ([s10]).
- **Availability.** AAMVA may "modify, edit, translate, suspend, restrict access to or terminate the DTS" "at any time without liability or prior notice" ([s3]). Pin the last-good list; TEST-PLAN E6 already requires the pipeline to fail closed.
- **Jurisdiction count is inconsistent across AAMVA's own pages.** Arizona was "the seventh U.S. state" on 2025-05-27 ([s20]) and New York "the eighth U.S. state" on 2026-06-30 ([s21]), yet April 2026 committee minutes already reported "approving five new Digital Trust Service (DTS) applications — four of which are now live in Alaska, Montana, North Dakota, and Illinois" ([s23]), and Iowa is "the 12th jurisdiction" on 2026-07-30 ([s22]). Sequence from news: UT, MD (2024-04-15), VA (2024-06-17), CO (2024-12-16), GA (2024-12-23), AK (2025-03-10), AZ (2025-05-27), NY (2026-06-30), IA (2026-07-30) ([s15]–[s22]); MT, ND, IL appear in the VICAL data and minutes but have no dated news item found.
- **IACA publication practice.** No AAMVA rule requires a state to publish its IACA root on its own site, and practice is mixed. Apple tells verifiers "you'll need to download and use its IACA certificate from their website" and links 16 US jurisdictions ([s33]); Google links six DTS states to `vical.dts.aamva.org` and hosts or links the rest ([s34]), and its verifier guide says to validate against "the official IACA certificates (which the issuer hosts on their website or are provided by Google)" ([s35]); Uber sources anchors from "official jurisdictional portals, such as DMV websites, and the AAMVA Digital Trust Service VICAL" and keeps "multiple active certificates per jurisdiction" ([s41]). Guidelines 1.6 make `stateOrProvinceName` mandatory in IACA certificates (§3.6) and cap IACA validity at 20 years, noting 9 is "sufficient" for mDL-only ([s13]); Arizona had 7 roots in the March 2026 VICAL ([s44]).
- **Public mirrors.** None sanctioned. De-facto: longfellow-zk `certs.pem` (19 certificates: AZ, CA, CO, GA, MD, NM, ND plus Google test roots; last changed 2025-09-30), which Google's own docs tell verifiers to edit "to manage IACA issuer certs that you want to trust" ([s35], [s36]); universal-verify's registry served from jsDelivr (`trusted-issuer-registry@0.0`, npm version 0.0.13), with a daily cron (`0 9 * * *`) that updates the `dev` branch while `main` was last committed 2026-01-11; on `main`, 14 issuer files across 9 states (AK, AZ, CO, GA, MD, MT, ND, UT, VA) carry the `aamva_dts` tag; its `id-verifier` README documents `aamva_dts` and `uv` as accepted `trustLists` values ([s42], [s43]); stelauconseil's browser verifier "Pre-loaded with 36+ IACA root certificates" with "custom IACA certificate import via VICAL format" ([s47]); the PeculiarVentures dashboard, last built 2026-03-11, 0 stars, no licence ([s44]). All redistribute VICAL-derived certificates despite the T&C; none is a trust anchor we should depend on.
- **Standards drift.** ISO/IEC 18013-5 second edition at DIS, planned 2026-11-30 ([s27]); AAMVA Guidelines went 1.5 (2025-04-17) → 1.6 (2026-05-18) ([s13]); the VICAL `version` field is still "1.0" ([s44]). AAMVA is not the only VICAL provider: Austroads announced a pre-production VICAL in 2024 ([s32]) and Guidelines §5.2 says AAMVA has "started conversations" with EReg and Austroads on cross-recognition ([s13]).
- **Privacy of the fetch.** AAMVA's policy logs "your IP address, browser type, and device type" and "the information you download" ([s4]). Only the publisher host fetches the VICAL; the prover page fetches our root once (PLAN M3), never AAMVA.
- **Liability.** AAMVA and issuing authorities disclaim liability for "the inability to accurately verify any driver license"; Virginia law, arbitration in Arlington ([s3]).

## Open questions for the partner call

- Written permission under the T&C to publish a Merkle root, inclusion proofs and a changelog derived from the VICAL, and for each multi-sig signer (EEA, PSE, one DMV) to download it. Are certificate hashes a "derivative work"?
- Is `/vical/vc` a supported "latest" endpoint? Will `nextUpdate` be honoured as a contract, and is there any push or notification on out-of-cycle removals?
- Production DTS: timeline, and whether relying-party terms, registration or fees change.
- Exact list of jurisdictions in today's VICAL (we count 12 from news, 10 in March data). Is California onboarding? Is New York's key live? This decides SPEC §9's pilot state.
- Rotation policy for `ca_root.crt` and the VICAL signer; how much notice; can we pin the root for the 16-week pilot.
- Does AAMVA object to a union of VICAL + state-published roots, and would AAMVA itself sign the root (SPEC decision 3)?
- Any DMV status-list plan compatible with the ISO second edition's ASL/ARL revocation, since VICAL cannot cover a revoked, unexpired licence (SPEC §8).
- Contact: Guidelines §5.2 gives `identitymangagement@aamva.org` (spelled that way in the PDF); the 2024 one-pager names Tim Roufa, Manager, Identity Management ([s10], [s13]). Confirm the current contact through the DTS technical-support form linked from the portal footer ([s5]).

## Sources

1. [s1] https://www.aamva.org/identity/mobile-driver-license-digital-trust-service — 2026-09-01
2. [s2] https://www.aamva.org/identity/mobile-driver-license-digital-trust-service/for-relying-parties — 2026-09-01
3. [s3] https://www.aamva.org/identity/mobile-driver-license-digital-trust-service/for-relying-parties/terms-and-conditions-for-relying-parties — 2026-09-01 and 2026-09-02
4. [s4] https://www.aamva.org/identity/mobile-driver-license-digital-trust-service/relying-parties/privacy-policy-for-relying-parties — 2026-09-02
5. [s5] https://vical.dts.aamva.org/ and https://vical.dts.aamva.org/index — 2026-09-01, 2026-09-02
6. [s6] https://vical.dts.aamva.org/previousVical — 2026-09-02
7. [s7] https://vical.dts.aamva.org/currentVical — 2026-09-02
8. [s8] https://vical.dts.aamva.org/trustcertificates — 2026-09-02
9. [s9] HEAD requests to https://vical.dts.aamva.org/vical/vc, `/vical/vc/vc-2026-09-02-1788308189919`, `/certificates/vicalsigner`, `/certificates/ca_intermediate`, `/certificates/ca` — 2026-09-02
10. [s10] https://www.aamva.org/getmedia/c3f7db4e-91aa-4646-8a90-bfd95bf869e1/DTS-One-Pager_FINAL_Web-Version.pdf (text via pdftotext) — 2026-09-01
11. [s11] https://www.aamva.org/identity/mobile-driver-license-digital-trust-service/for-issuing-authorities — 2026-09-01
12. [s12] https://www.aamva.org/topics/mobile-driver-license — 2026-09-01
13. [s13] https://www.aamva.org/getmedia/1bc1f2b3-bc7b-4e44-8112-127a4110ad94/mDLImplementationGuidelines-16.pdf (text via pdftotext) — 2026-09-02
14. [s14] https://www.aamva.org/publications-news/aamva-news — 2026-09-02
15. [s15] https://aamva.org/publications-news/aamva-news/aamva-s-mobile-driver-license-digital-trust-service-is-now-live — 2026-09-02
16. [s16] https://www.aamva.org/publications-news/aamva-news/virginia-added-to-aamva%E2%80%99s-digital-trust-service — 2026-09-02
17. [s17] https://www.aamva.org/publications-news/aamva-news/colorado-joins-aamva-s-digital-trust-service — 2026-09-02
18. [s18] https://aamva.org/publications-news/aamva-news/aamva-welcomes-georgia-to-the-digital-trust-service — 2026-09-02
19. [s19] https://www.aamva.org/publications-news/aamva-news/alaska-joins-the-aamva-digital-trust-service — 2026-09-02
20. [s20] https://www.aamva.org/publications-news/aamva-news/aamva-welcomes-arizona-to-the-digital-trust-service — 2026-09-02
21. [s21] https://www.aamva.org/publications-news/aamva-news/new-york-joins-the-aamva-digital-trust-service — 2026-09-02
22. [s22] https://www.aamva.org/publications-news/aamva-news/aamva-welcomes-iowa-to-the-digital-trust-service — 2026-09-02
23. [s23] https://www.aamva.org/about/aamva-leadership/committees-working-groups/committees/committee-updates — 2026-09-02
24. [s24] https://movemag.org/next-step-for-mdl/ (Mike McCaskill quote; article date [unverified]) — 2026-09-01
25. [s25] https://www.sis.se/api/document/preview/80031411/ (ISO/IEC 18013-5:2021 preview, text via pdftotext) — 2026-09-02
26. [s26] https://www.dinmedia.de/en/standard/iso-iec-18013-5/346465162 — 2026-09-02
27. [s27] https://github.com/eu-digital-identity-wallet/eudi-doc-standards-and-technical-specifications/issues/84 (via GitHub API; updated 2026-07-31) — 2026-09-02
28. [s28] https://www.iso.org/standard/91081.html and https://www.iso.org/standard/69084.html — 2026-09-02, both returned HTTP 403
29. [s29] https://learn.mattr.global/docs/digital-trust-service/vical-overview — 2026-09-02
30. [s30] https://learn.mattr.global/docs/digital-trust-service/vical-consumption — 2026-09-01
31. [s31] https://www.raidiam.com/developers/docs/concepts/trusted-lists/vical/ — 2026-09-01
32. [s32] https://www.biometricupdate.com/202409/mattr-introduces-vical-viewer-to-ease-mdl-adoption-for-relying-parties (2024-09-11) — 2026-09-01
33. [s33] https://developer.apple.com/wallet/get-started-with-verify-with-wallet/ — 2026-09-02
34. [s34] https://developers.google.com/wallet/identity/verify/supported-issuers-iaca-certs (page "Last updated 2026-06-29 UTC") — 2026-09-02
35. [s35] https://developers.google.com/wallet/identity/verify/accepting-ids-from-wallet-online — 2026-09-02
36. [s36] https://github.com/google/longfellow-zk/blob/main/reference/verifier-service/server/certs.pem (via GitHub API; subjects listed with openssl) — 2026-09-02
37. [s37] https://www.dmv.ca.gov/portal/ca-dmv-wallet/mdl-for-technology-developers/ — 2026-09-01
38. [s38] https://hidot.hawaii.gov/highways/mobile-driver-license/ (via curl; WebFetch got HTTP 403) — 2026-09-02
39. [s39] https://dds.georgia.gov/georgia-licenseid/ga-digital-id — 2026-09-01
40. [s40] https://mva.maryland.gov/your-mva-guide/businesses/id-verification-mobile-id-check — 2026-09-02
41. [s41] https://www.uber.com/us/en/blog/scaling-verify-wallet/ (2026-06-23) — 2026-09-02
42. [s42] https://github.com/universal-verify/trusted-issuer-registry (README, workflow and issuer JSON via GitHub API) — 2026-09-02
43. [s43] https://github.com/universal-verify/id-verifier — 2026-09-01
44. [s44] https://github.com/PeculiarVentures/mdl-state-of-the-nation (README, `pipeline.py`, `docs/index.html` embedded data via GitHub API); https://mdl.peculiarventures.com/ (script-rendered, no data) — 2026-09-02
45. [s45] https://github.com/openwallet-foundation/multipaz (`SignedVical.kt` via GitHub API) — 2026-09-02
46. [s46] https://github.com/lukasjhan/vical (README, package.json via GitHub API) — 2026-09-02
47. [s47] https://github.com/stelauconseil/mdoc-web-verifier — 2026-09-01
48. [s48] https://www.trinsic.id/blog/reflections-on-aamva-aic-mobile-ids-relying-parties-and-whats-next — 2026-09-01 (no DTS content)
49. [s49] https://www.aamva.org/jurisdiction-data-maps — 2026-09-02 (interactive map, data not extractable)
50. [s50] https://www.aamva.org/assets/best-practices,-guides,-standards,-manuals,-whitepapers/mobile-driver-s-license-implementation-guidelines-1-2 — 2026-09-01
51. [s51] https://www.aamva.org/publications-news/aamva-news/now-available-aamva%E2%80%99s-mobile-driver-license-(mdl)-implementation-guidelines-v1-6 — 2026-09-02, HTTP 200 with the curly apostrophe (U+2019) percent-encoded; page dated 6/30/2026. The straight-apostrophe form returns 302 → /page-not-found (earlier "404 with both encodings" was wrong)
52. [s52] https://learn.mattr.global/docs/issuance/vical/overview — 2026-09-01 (navigation only)
53. [s53] https://docs.oneproof.com/certs/issuer-iaca-certificates/usa/dts and `/usa` — 2026-09-02 (token-gated)
54. [s54] https://azmvdnow.gov/certificates/ — 2026-09-02 (script-rendered, contents not extractable)
55. [s55] https://standards.iteh.ai/catalog/standards/iso/8b349f37-4a4d-4379-9feb-0061079dba81/iso-iec-fdis-18013-5 and `.../iso-iec-18013-5-2021` — 2026-09-02 (header only)
56. [s56] https://registry.npmjs.org/vical-parser — 2026-09-02, returns `{"error":"Not found"}`
57. [s57] https://credenceid.com/resources/blog/us-mobile-drivers-license-mdl-state-tracker/ ("Last updated: March 2026"; "21 states and territories" live; NY only via the "NY MiD" app) — 2026-09-02
58. [s58] https://www.macrumors.com/2026/08/17/apple-wallet-ids-expanding-to-four-more-states/ (2026-08-17; 14 states + PR live in Apple Wallet; NC, OK, UT, VA coming) — 2026-09-02
59. Web searches (WebSearch) run 2026-09-01 and 2026-09-02 for: AAMVA DTS VICAL relying party, cost, update frequency, Guidelines 1.6, Annex C CDDL, IACA public mirrors, state IACA publication, DTS jurisdictions, ISO 18013-5 second edition, US wallet mDL state counts.

## Verification

Independent re-check on 2026-09-02 by a second reviewer. Every URL in [s1]–[s55] was re-fetched (WebFetch, `curl`, `gh api`, `pdftotext`, `openssl`); 118 discrete claims (URLs, dates, counts, versions, quotes, file sizes, licences, star counts, commit hashes) were checked against the live source. Confirmed unchanged: all HEAD sizes and filenames on vical.dts.aamva.org; all nine dated AAMVA news items and their ordinals; the T&C, privacy-policy, relying-party and issuing-authority quotes; Guidelines 1.6 cover, changelog dates, §3.6, §5.2, the ES256/384/512 rule, the 20-year/9-year IACA validity note and the misspelled contact address; one-pager PDF creation date, fee text and Tim Roufa's title; ISO/IEC 18013-5:2021 preview (first edition 2021-09, Annex C on p. 90) and DIN listing (152 pages); ISO second-edition DIS status and 2026-11-30 planned date via the EUDI tracker (iso.org still 403); MATTR CDDL including the six optional fields and the x5chain/label-33 procedure; Raidiam quotes; Google issuer page date, California link and the six VICAL-linked states; Apple's 16 linked jurisdictions and Arizona URL; Uber, Biometric Update, stelauconseil, Maryland, Georgia, Hawaii and California DMV pages and links (trust.dmv.ca.gov serves `CN=California DMV IACA Root`); longfellow `certs.pem` (19 certs, subjects as listed, commit `c5c7e4f914` 2025-09-30); multipaz stars/push date/`"x5chain not set"`; PeculiarVentures data (10 VICAL authorities AK AZ CO GA IL MD MT ND UT VA, AZ 7 roots, `version` "1.0", `nextUpdate` = date + 24 h, built 2026-03-11, 0 stars, no licence, homepage regex, docs.pr.gov PEM); April 2026 committee minutes quotes.

Corrections made:
- "a new list roughly every 24 hours since 2023-08-06" was wrong: the archive has 792 files on 777 dates with gaps of 93, 55, 39, 39, 42, 22, 13 and 11 days, and four entries misnamed with year 2026 for December 2025 ([s6]). The Cadence bullet was updated accordingly.
- `npm install vical-parser` does not work: the package is not on the npm registry ([s56]); install from GitHub. Its licence is MIT only per package.json; no LICENSE file exists.
- [s51] is not a 404: the news item resolves at the curly-apostrophe URL (HTTP 200, dated 6/30/2026); only the straight-apostrophe form redirects to page-not-found.
- universal-verify registry: the daily cron updates the `dev` branch; `main` was last committed 2026-01-11 (repo `pushed_at` 2026-08-20 is not the main branch). The 9-state `aamva_dts` count (AK, AZ, CO, GA, MD, MT, ND, UT, VA; 14 issuer files) is from `main`. The `id-verifier` README example uses `trustLists: ['universal-verify']`; `aamva_dts` is a documented value, not the example.
- The "has been launched" paraphrase of [s1] was replaced with the page's exact sentence.
- The "use offline during a transaction" quote is from the one-pager [s10] only, not [s1]/[s13]; the x5chain/label 33 detail is from [s30] only, not [s29]. Citations tightened.
- Added the Arizona "seventh U.S. state" (2025-05-27) data point, which sharpens the count inconsistency.
- Added that the VICAL and certificate endpoints answer 200 to an anonymous `curl -I`; the T&C click-through is a legal gate, not a technical one.
- Added wallet-availability evidence for the pilot-state question: New York is in neither Apple nor Google Wallet ([s34], [s57], [s58]); the states in both wallets and in the VICAL are AZ, CO, GA, MD, ND (and IA since 2026-07-30).

Left unverified:
- Whether `/certificates/*` serve PEM or DER (HEAD only; nothing downloaded).
- Whether `/vical/vc` is a supported "latest" endpoint (it works; undocumented).
- Contents of today's VICAL file (jurisdiction list, `nextUpdate`, `version`); all VICAL-content statements rest on the 2026-03-10 PeculiarVentures snapshot.
- Whether archive gaps mean AAMVA published nothing on those days or the `/previousVical` page is incomplete.
- Contents of https://azmvdnow.gov/certificates/ (script-rendered; no certificate links in the static HTML).
- Date of the MOVE magazine article [s24] (WebFetch reports "June 2024" and "published July 1, 2025" inconsistently). McCaskill is titled "Director of Identity Management" there but "Vice President of Identity Management Programs and Services" in AAMVA's 2024-12-23 news item [s18].
- The AAMVA jurisdiction data map [s49] (interactive; no extractable list).
- iso.org pages [s28] (HTTP 403 again); second-edition stage and date rely on the EUDI tracker [s27] and search snippets.
- Whether Montana, North Dakota and Illinois have any dated AAMVA news item (none found).
- vical-parser "has one author" (repo owner only; not otherwise checked).
