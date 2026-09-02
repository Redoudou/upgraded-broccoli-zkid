# US mDL adoption by state
_Researched 2026-09-01 (sources fetched overnight 2026-09-01/02); independently re-verified against live sources 2026-09-02, see [Verification](#verification). Every claim carries a source link. Unverified statements are marked [unverified]._

## What it is
A mobile driver's license (mDL) is a state-issued ISO/IEC 18013-5 credential held in a phone wallet: Apple Wallet, Google Wallet, Samsung Wallet, or a state-branded app. Federal acceptance is governed by the DHS/TSA REAL ID waiver rule (89 FR 85340, effective 2024-11-25), under which a state gets a three-year certificate of waiver if its mDL uses the ISO/IEC 18013-5:2021 data model and the AAMVA data element set [[5]](#sources)[[6]](#sources)[[8]](#sources). TSA publishes two lists: the states whose mDLs are accepted at "more than 250" checkpoints (20 states + Puerto Rico today) and the states holding a waiver (21 states + Puerto Rico, the extra one being Oklahoma) [[1]](#sources)[[2]](#sources)[[3]](#sources). Wallet coverage is narrower and uneven: Apple lists 15 states + PR, Google lists 10 states + PR (Ohio joined Google Wallet on 2026-08-31 but is not yet on Google's page), and Samsung is live in 9 states (8 on TSA's list; California only per the CA DMV and Governor's office) [[9]](#sources)[[10]](#sources)[[15]](#sources)[[16]](#sources)[[33]](#sources). Two states (Delaware, Mississippi) run non-ISO apps that TSA does not list [[37]](#sources)[[38]](#sources). For Green Light the number that matters is the set of states where the guest's wallet answers the Digital Credentials API with an issuer-signed mdoc, which is the Apple/Google intersection, not the headline count.

## Where it lives
| Item | URL | Licence | Version/tag/commit seen today |
|---|---|---|---|
| TSA: Participating States and Eligible Digital IDs (checkpoint acceptance, per-wallet) | https://www.tsa.gov/digital-id/participating-states | US Government work | 20 states + PR; "more than 250 TSA checkpoints" [[1]](#sources) |
| TSA: REAL ID mDLs (states holding a 6 CFR 37.7 waiver) | https://www.tsa.gov/realid/realid-mobile-drivers-license-mdls | US Government work | 21 states + PR; enforcement "began on May 7, 2025" [[3]](#sources) |
| DHS final rule, waiver for mDLs | https://www.federalregister.gov/documents/2024/10/25/2024-23881/minimum-standards-for-drivers-licenses-and-identification-cards-acceptable-by-federal-agencies-for | US Government work | 89 FR 85340, Docket TSA-2023-0002, RIN 1652-AA76, published 2024-10-25, effective 2024-11-25 [[5]](#sources)[[6]](#sources) |
| 6 CFR 37.7 and 37.10 (waiver eligibility and application criteria) | https://www.law.cornell.edu/cfr/text/6/37.10 | US Government work (LII mirror; ecfr.gov blocked automated fetch) | cites 89 FR 85377, Oct. 25, 2024 [[7]](#sources)[[8]](#sources) |
| Apple: ID in Wallet availability | https://learn.wallet.apple/id | Apple | 16 jurisdictions listed, "with more on the way" [[9]](#sources) |
| Google Wallet Help: Add your US Driver's License or State ID | https://support.google.com/wallet/answer/12436402?hl=en | Google | 11 jurisdictions listed; Android 9+ [[10]](#sources) |
| Google: Supported issuers and IACA certificates | https://developers.google.com/wallet/identity/verify/supported-issuers-iaca-certs | Google | 10 states + PR mDL issuers, plus "Utopia" sandbox; page stamp "Last updated 2026-06-29 UTC" [[11]](#sources) |
| Samsung Wallet Digital ID | https://www.samsung.com/us/apps/samsung-wallet/digital-id/ | Samsung | names no states; "check with your state's motor vehicle authority" [[12]](#sources) |
| AAMVA Mobile Driver License topic page | https://www.aamva.org/topics/mobile-driver-license | AAMVA | links Implementation Guidelines 1.6 (July 2026) and the DTS [[17]](#sources) |
| AAMVA mDL Implementation Guidelines 1.6 | https://www.aamva.org/getmedia/1bc1f2b3-bc7b-4e44-8112-127a4110ad94/mDLImplementationGuidelines-16.pdf | AAMVA | PDF, 4,360,265 bytes, Last-Modified 2026-07-08 [[19]](#sources) |
| AAMVA Digital Trust Service (VICAL) | https://www.aamva.org/identity/mobile-driver-license-digital-trust-service and https://vical.dts.aamva.org/ | AAMVA | live since 2024-04-15 (Utah, Maryland first); portal returns HTTP 200 today [[20]](#sources)[[21]](#sources)[[22]](#sources) |
| Secondary cross-checks | https://credenceid.com/resources/blog/us-mobile-drivers-license-mdl-state-tracker/ ; https://www.mdlconnection.com/implementation-tracker-map/ | vendor / Secure Technology Alliance | March 2026 matrix; map updated 2026-04-27 (mdlconnection.com returns 403 to curl; confirmed via WebFetch) [[38]](#sources)[[39]](#sources) |

## State-by-state (as of 2026-09-01)
Wallet columns come from the TSA per-state list [[1]](#sources) cross-checked against Apple [[9]](#sources), Google [[10]](#sources)[[11]](#sources) and state pages. "App" is the state-branded holder app TSA names. Waiver = on TSA's REAL ID waiver list [[3]](#sources).

| Jurisdiction | State app | Apple | Google | Samsung | Waiver | Notes |
|---|---|---|---|---|---|---|
| Alaska | Alaska Mobile ID (Thales) | – | – | – | yes | TSA acceptance at Anchorage and Juneau only [[28]](#sources) |
| Arizona | none listed by TSA | yes | yes | yes | yes | Samsung: age verification at businesses via "Smart ID Verifier" [[14]](#sources) |
| Arkansas | Arkansas Mobile ID | yes | yes | yes | yes | IACA published on Arkansas DFA site [[11]](#sources) |
| California | CA DMV Wallet | yes | yes | yes | yes | Samsung added 2026-04-28 per CA DMV and Governor's office; TSA's own list still names only "California DMV Wallet App, Apple Wallet, and Google Wallet" [[1]](#sources); 1.7 M active mDLs (about 900,000 in the DMV wallet), 3.5 M applied [[15]](#sources)[[16]](#sources); IACA at trust.dmv.ca.gov [[11]](#sources) |
| Colorado | CO Mobile ID | yes | yes | yes | yes | |
| Georgia | none listed by TSA | yes | yes | yes | yes | |
| Hawaii | none listed by TSA | yes | – | – | yes | |
| Illinois | none listed by TSA | yes | – | – | yes | Apple launch 2025-11-18/19; Illinois SOS says the program "will soon expand to Google and Samsung Wallets" per ilsos.gov search snippets (site times out for curl and WebFetch on 2026-09-02) [unverified] |
| Iowa | Iowa Mobile ID | yes | yes | yes | yes | IACA on iowadot.gov [[11]](#sources) |
| Kentucky | KY Mobile ID | – | – | – | yes | wallets only after licensing-system modernisation "in the summer of 2026"; not live today [[26]](#sources) |
| Louisiana | LA Wallet | – | – | – | yes | "built on ISO 18013-5"; "75% of all Louisiana drivers use LA Wallet" [[25]](#sources) |
| Maryland | none listed by TSA | yes | yes | yes | yes | DTS founding participant [[20]](#sources) |
| Montana | none listed by TSA | yes | yes | – | yes | |
| New Mexico | none listed by TSA | yes | yes | – | yes | IACA zip on mvd.newmexico.gov [[11]](#sources) |
| New York | NY MiD | – | – | – | yes | app only; businesses verify with third-party "MiD Verify" apps or an SDK. NY states it "does not provide a verification app, software development kit, or an online verification system" [[23]](#sources)[[24]](#sources) |
| North Dakota | none listed by TSA | yes | yes | yes | yes | |
| Ohio | none listed by TSA | yes | yes (2026-08-31) | – | yes | BMV release 2026-08-31; Google's own pages and TSA still show Apple only [[31]](#sources)[[33]](#sources) |
| Oklahoma | none | – | – | – | yes | old app decommissioned 2024-02-08; HB3015 passed House 2026-03-25, on Senate General Order 2026-04-08; no live mDL found [[34]](#sources)[[35]](#sources) |
| Puerto Rico | ID Móvil (idmovil.pr.gov) | yes | yes | – | yes | [[1]](#sources)[[11]](#sources) |
| Utah | GET Mobile | – | – | – | yes | current mDL "scheduled to sunset on January 1, 2027", replaced under SB 275 [[29]](#sources)[[30]](#sources) |
| Virginia | VA MiD | yes (2026-08-26) | – | – | yes | Apple launch 2026-08-26; accepted at pilot ABC stores, State Police, DMV [[27]](#sources) |
| West Virginia | WV MiD | yes | – | yes | yes | |
| Delaware | Delaware Mobile ID (IDEMIA) | – | – | – | no | non-ISO app per Credence [[38]](#sources); https://dmv.de.gov/mobileID/ returns 404 and the live page https://services.dmv.de.gov/mobileID/ rejects automated fetches (search snippet shows IDEMIA support address MobileIDHelp@us.idemia.com and an "Adopter Program") [unverified] |
| Mississippi | Mississippi Mobile ID (IDEMIA) | – | – | – | no | QR "Privacy Code" + Bluetooth "Mobile ID Verify App", barcode identical to the plastic card [[37]](#sources); not ISO 18013-5 and not accepted at TSA per Credence [[38]](#sources) (the MS page itself says nothing about TSA) |
| North Carolina | NC Wallet (coming) | – | – | – | no | "At launch" via NC Wallet; Apple/Google/Samsung "in 2027"; acceptance expanding "throughout 2027"; page stamp 8/31/2026 [[36]](#sources); MacRumors/WRAL put the NC Wallet launch in December 2026 [[40]](#sources) (secondary) |

**Totals.** TSA checkpoint list: 20 states + PR [[1]](#sources). TSA waiver list: 21 states + PR [[3]](#sources). Apple: 15 states + PR [[9]](#sources). Google: 10 states + PR on Google's pages, 11 + PR counting Ohio's 2026-08-31 launch [[10]](#sources)[[33]](#sources). Samsung: 9 states (AR, AZ, CA, CO, GA, IA, MD, ND, WV); TSA lists 8 of these, CA rests on the CA DMV and Governor's pages [[1]](#sources)[[15]](#sources)[[16]](#sources). Apple and Google both: AZ, AR, CA, CO, GA, IA, MD, MT, NM, ND, PR, plus OH since 2026-08-31. All three wallets: AZ, AR, CA, CO, GA, IA, MD, ND.

**Is the spec's "21 states + PR" correct?** It matches TSA's REAL ID waiver list exactly (21 states + PR, including Oklahoma, which holds a waiver but has no live mDL found today) [[3]](#sources)[[34]](#sources)[[35]](#sources). Counting only jurisdictions that issue an ISO 18013-5 mDL accepted at TSA checkpoints, the number is 20 states + PR [[1]](#sources); the Credence tracker (March 2026) also reaches 21 jurisdictions = 20 states + PR [[38]](#sources). Counting non-ISO apps (DE, MS) it would be 22 states + PR. Suggested wording for SPEC §2: "Live, 20 states + PR at TSA checkpoints; 21 + PR hold federal waivers; Apple 15 + PR, Google 11 + PR."

## How Green Light uses it
- **SPEC §2 row "Credential" (Status "Live, 21 states + PR").** The figure should be re-labelled per the verdict above. The row's "Our work: None" holds: every listed state already issues through at least one channel we can consume.
- **SPEC §3 guest flow and PLAN M3.** The prover page needs a wallet that answers `navigator.credentials.get()`. Only Apple Wallet (iOS 26, Safari) and Google Wallet (Chrome/Android) are documented DC API providers (see [wallet-mdl-platforms.md](wallet-mdl-platforms.md)). State-only apps (Alaska, Kentucky, Louisiana, New York, Utah) and Samsung-only states do not reach our page through the browser path; those guests take the plastic-card fallback in SPEC §8 "Adoption".
- **SPEC §9 pilot state ("California default; confirm New York").** California is confirmed in Apple, Google and Samsung Wallet plus the CA DMV Wallet, with 1.7 M active mDLs [[15]](#sources)[[16]](#sources)[[1]](#sources). New York is app-only (NY MiD) with no wallet and no ISO mention on its pages; it fails the SPEC §9 rule "both Apple and Google Wallet issue the mDL" [[23]](#sources)[[24]](#sources)[[1]](#sources). Fallback pilot states meeting the rule: AZ, AR, CO, GA, IA, MD, MT, NM, ND, OH, PR.
- **SPEC §4 and PLAN M5 trust-list pipeline.** The waiver rule forces every waiver state onto ISO/IEC 18013-5:2021 section 7 data model, section 9 / Annex B algorithms, and the AAMVA `DHS_compliance` element [[8]](#sources). That is the profile our circuit and VICAL parser can assume for all 21 + PR waiver states. Several states publish their IACA outside VICAL (CA, AR, IA, NM, PR) [[11]](#sources); the pipeline should accept both VICAL and per-state roots until AAMVA access lands (PLAN M8 item 4).
- **PLAN M0 partner ask "One state DMV".** The waiver list is the federal shortlist; the intersection with wallet coverage and a published IACA is the practical one (CA, AR, IA, NM, PR publish their own root; CA also has the largest base).
- **SPEC §8 "Revocation".** No state page fetched today describes a status list for individual mDLs; the waiver rule speaks to issuance controls, not relying-party revocation checks [[8]](#sources) [unverified whether any waiver application includes one].

## How to build or integrate
There is no API for the state list; it is maintained by hand from the TSA page. Concrete steps and calls copied from the sources:

1. **Refresh the coverage table.** TSA's page is the only per-state, per-wallet federal source. Fetch it with a browser User-Agent (plain fetches get HTTP 403) and diff the "Participating State/Issuing Authority | Eligible Digital ID" table [[1]](#sources):
   ```sh
   curl -sL -A "Mozilla/5.0" https://www.tsa.gov/digital-id/participating-states -o tsa.html
   curl -sL -A "Mozilla/5.0" https://www.tsa.gov/realid/realid-mobile-drivers-license-mdls -o tsa-waivers.html
   ```
2. **Wallet lists.** Apple: https://learn.wallet.apple/id (16 jurisdictions today) [[9]](#sources). Google: https://support.google.com/wallet/answer/12436402?hl=en (11 today) and the issuer/IACA page [[10]](#sources)[[11]](#sources). Samsung publishes no list; use TSA plus state pages (AZ, CA, IA, MD have Samsung pages) [[12]](#sources)[[14]](#sources)[[15]](#sources).
3. **Issuer roots for the M5 pipeline.** From Google's issuer page [[11]](#sources), per-state IACA locations:
   ```sh
   curl -sLO https://trust.dmv.ca.gov/certificates/ca-dmv-iaca-root-ca-crt.cer          # California
   curl -sLO https://www.mvd.newmexico.gov/wp-content/uploads/2025/10/New-Mexico-IACA-Certificate.zip
   # Arkansas: www.dfa.arkansas.gov/office/driver-services/mobile-id/mobile-id-for-businesses/
   # Iowa: iowadot.gov/drivers-licenses-ids/mobile-id/mobile-id-businesses-organizations
   # Puerto Rico: www.idmovil.pr.gov/   AZ, CO, GA, MD, MT, ND: https://vical.dts.aamva.org/
   ```
   VICAL access requires relying-party registration with AAMVA DTS; the portal answers HTTP 200 but the registration terms are not published on the page [[21]](#sources)[[22]](#sources) [unverified].
4. **Federal profile to pin.** From 6 CFR 37.10(a)(4) [[8]](#sources): ISO/IEC 18013-5:2021(E) section 7 data model; mandatory elements `family_name`, `given_name`, `birth_date`, `issue_date`, `expiry_date`, `issuing_authority`, `document_number`, `portrait`; AAMVA namespace elements `DHS_compliance` and `DHS_temporary_lawful_status`; algorithms per section 9 and Annex B. Our circuit reads `age_over_21` and `expiry_date` (SPEC §3); `expiry_date` is mandatory under the rule, `age_over_21` is not, so the M3 request must handle its absence.
5. **App-only states.** New York points businesses to third-party "MiD Verify" apps and SDKs that "can be integrated into an existing point-of-sale system" while stating the State itself provides no verification app or SDK [[24]](#sources); Alaska publishes a separate "App for Verifying Parties" alongside the holder app, with support handled at a thalesgroup.com address [[28]](#sources). These are reader integrations, not DC API, and are out of scope for the pilot.
6. **For a state partner.** A state applies for a waiver by emailing its application to REALID-mDLwaiver@tsa.dhs.gov under 6 CFR 37.10 [[3]](#sources); the certificate "is valid for a period of 3 years from the date of issuance" [[6]](#sources).

## Status and risks
- **Maturity.** Federal acceptance is live but interim: the rule is a temporary waiver and TSA "intends to issue a future rulemaking to set more comprehensive requirements" [[4]](#sources). No Phase 2 proposed rule was found in any source fetched today [unverified].
- **Counts move weekly.** Virginia joined Apple on 2026-08-26 and Ohio joined Google on 2026-08-31 [[27]](#sources)[[33]](#sources); Google's and TSA's pages lag by days. Any number in SPEC.md needs a date.
- **Wallet gap on Android.** Google trails Apple by five states (HI, IL, VA, WV, and OH until Google's pages update) [[9]](#sources)[[10]](#sources). In those states an Android guest has no DC API path.
- **Utah sunset.** Utah's current mDL is "scheduled to sunset on January 1, 2027" under SB 275 [[29]](#sources)[[30]](#sources), inside the M9 pilot window; Utah is unsuitable as a pilot or signer state.
- **Oklahoma anomaly.** Listed as a waiver holder [[3]](#sources) with its app decommissioned in 2024 and enabling legislation still in the Senate as of 2026-04-08 [[34]](#sources)[[35]](#sources); MacRumors reports Oklahoma references in Apple's backend (2026-07-29) [[42]](#sources). Treat as pipeline, not live.
- **Non-ISO programs.** Delaware and Mississippi apps use QR privacy codes and are absent from TSA's lists [[1]](#sources)[[3]](#sources)[[37]](#sources)[[38]](#sources); our verifier cannot consume them, and venues in those states will see "mobile IDs" our page rejects.
- **Kentucky and North Carolina.** Both are app-first with wallets promised later (KY after "summer of 2026", NC "in 2027") [[26]](#sources)[[36]](#sources). No help for the 2026 pilot.
- **Physical card still required.** Every state and TSA page fetched says to carry the plastic card; Ohio's release calls the mDL a "digital companion" [[1]](#sources)[[33]](#sources). SPEC's "does not replace the plastic card" is consistent with issuer policy.
- **Revocation.** No fetched source describes an mDL-level status list exposed to relying parties [unverified]; SPEC §8 hole stands.

## Open questions for the partner call
- AAMVA DTS: what are the relying-party registration terms for https://vical.dts.aamva.org/ (fee, agreement, refresh cadence), and does VICAL today include all 21 + PR waiver states or only those that opted in [[21]](#sources)[[22]](#sources)?
- AAMVA: is the six-stage implementation map exportable as data, and can we cite it for the SPEC count [[18]](#sources)?
- California DMV: relying-party onboarding for the CA DMV Wallet app path (non-DC-API); is `age_over_21` populated in California mdocs; any per-mDL status list?
- Google Wallet Identity team: when will Ohio appear on the help and IACA pages, and are Hawaii, Illinois, Virginia, West Virginia scheduled?
- Apple: are Kentucky, North Carolina, Oklahoma, Utah on a public timeline, or only in backend references [[40]](#sources)[[42]](#sources)?
- TSA REAL ID office: is a Phase 2 mDL rulemaking scheduled, and would a ZK presentation profile be in scope?
- Venue chain: which pilot-state venues already run mDL readers (Virginia ABC stores, Ohio casinos are named by issuers [[27]](#sources)[[33]](#sources)) and could host the hard case?
- Law firm: does presenting an mDL-derived proof satisfy age-verification statutes in CA, OH and VA, given each state's "companion, not replacement" policy?

## Sources
Fetched 2026-09-01/02 unless noted. Primary unless marked (secondary).
1. https://www.tsa.gov/digital-id/participating-states (curl with browser UA; WebFetch returned 403)
2. https://www.tsa.gov/digital-id
3. https://www.tsa.gov/realid/realid-mobile-drivers-license-mdls
4. https://www.tsa.gov/news/press/releases/2024/10/24/tsa-announces-final-rule-enables-continued-acceptance-mobile-drivers
5. https://www.federalregister.gov/api/v1/documents/2024-23881.json (HTML page redirected to a bot-block)
6. https://www.govinfo.gov/content/pkg/FR-2024-10-25/pdf/2024-23881.pdf
7. https://www.law.cornell.edu/cfr/text/6/37.7 (mirror; ecfr.gov redirected to a bot-block)
8. https://www.law.cornell.edu/cfr/text/6/37.10
9. https://learn.wallet.apple/id
10. https://support.google.com/wallet/answer/12436402?hl=en
11. https://developers.google.com/wallet/identity/verify/supported-issuers-iaca-certs
12. https://www.samsung.com/us/apps/samsung-wallet/digital-id/ and https://samsung.com/us/samsung-wallet/digital-id/
13. https://www.samsungmobilepress.com/articles/samsung-partners-with-idemia-to-bring-mobile-drivers-licenses-to-samsung-wallet-arizona-and-iowa-first-states-to-rollout (dated 2023-10-06)
14. https://azdot.gov/samsung-wallet
15. https://www.dmv.ca.gov/portal/california-mdl/mdl-in-samsung-wallet/
16. https://www.gov.ca.gov/2026/04/28/california-expands-mobile-drivers-license-to-samsung-wallet-continuing-dmvs-digital-transformation/
17. https://www.aamva.org/topics/mobile-driver-license
18. https://www.aamva.org/jurisdiction-data-maps
19. https://www.aamva.org/getmedia/1bc1f2b3-bc7b-4e44-8112-127a4110ad94/mDLImplementationGuidelines-16.pdf (HEAD only)
20. https://aamva.org/publications-news/aamva-news/aamva-s-mobile-driver-license-digital-trust-service-is-now-live (dated 2024-04-15)
21. https://www.aamva.org/identity/mobile-driver-license-digital-trust-service
22. https://vical.dts.aamva.org/ (HEAD only, HTTP 200)
23. https://dmv.ny.gov/mobile-id
24. https://dmv.ny.gov/id-card/mobile-id-for-businesses-and-organizations
25. https://lawallet.com/
26. https://drive.ky.gov/Pages/Mobile-ID.aspx
27. https://www.dmv.virginia.gov/news/virginia-issued-drivers-licenses-and-ids-now-available-apple-wallet (dated 2026-08-26)
28. https://dmv.alaska.gov/mid/
29. https://dld.utah.gov/utah-mdl/
30. https://dld.utah.gov/mdlfaqs/
31. https://www.bmv.ohio.gov/dl-mobile-id.aspx
32. https://bmv.ohio.gov/bmv-news.aspx
33. https://content.govdelivery.com/accounts/OHBMV/bulletins/42717d1 (Ohio BMV release dated 2026-08-31)
34. https://oklahoma.gov/service/newsroom/ok-mobile-id-app-decommissioned.html (dated 2024-02-08)
35. http://www.oklegislature.gov/BillInfo.aspx?Bill=HB3015&Session=2600
36. https://www.ncdot.gov/dmv/license-id/nc-mobile-id/Pages/nc-mobile-id.aspx (page stamp 2026-08-31)
37. https://www.driverservicebureau.dps.ms.gov/mobile-id/ (describes QR/Bluetooth verification and IDEMIA support; no mention of TSA or ISO 18013-5)
38. https://credenceid.com/resources/blog/us-mobile-drivers-license-mdl-state-tracker/ (secondary, March 2026)
39. https://www.mdlconnection.com/implementation-tracker-map/ (secondary, Secure Technology Alliance, updated 2026-04-27; curl gets 403, WebFetch succeeds)
40. https://www.macrumors.com/2026/08/17/apple-wallet-ids-expanding-to-four-more-states/ (secondary)
41. https://www.macrumors.com/2026/08/26/apple-wallet-id-feature-launches-in-15th-state/ (secondary)
42. https://www.macrumors.com/2026/07/29/iphone-drivers-license-another-state-soon/ (secondary)
43. https://www.dhs.gov/real-id/real-id-faqs (curl; only a navigation link titled "REAL ID Mobile Driver's Licenses (mDLs)", no mDL FAQ content)

Seen only in search-result snippets, not fetched (site unreachable, bot-blocked or 404 on both 2026-09-01 and 2026-09-02), so claims from them are marked [unverified]: https://www.ilsos.gov/news/2025/november-18-2025-the-day-is-finally-here-giannoulias-launches-mobile-id.html (connection times out); https://dmv.de.gov/mobileID/ (404) and its live replacement https://services.dmv.de.gov/mobileID/ ("Request Rejected" to automated fetch).

## Verification
_Re-verified 2026-09-02 by an independent pass: every URL in Sources was fetched again (curl with a browser User-Agent, WebFetch, or HEAD), and 98 discrete claims (URLs, counts, dates, names, quotes, version/size stamps) were checked against what the live pages say._

**Confirmed as written (selection).** TSA checkpoint list = 20 states + PR with "more than 250 TSA checkpoints" [[1]](#sources); TSA waiver list = 21 states + PR including Oklahoma, enforcement "began on May 7, 2025", waiver email REALID-mDLwaiver@tsa.dhs.gov [[3]](#sources); 89 FR 85340, Docket TSA-2023-0002, RIN 1652-AA76, published 2024-10-25, effective 2024-11-25 [[5]](#sources); "for a period of 3 years" in the rule text [[6]](#sources); 6 CFR 37.10(a)(4) element list and 37.7/37.10 "[89 FR 85377, Oct. 25, 2024]" stamps [[7]](#sources)[[8]](#sources); Apple 16 jurisdictions "with more on the way" [[9]](#sources); Google help 11 jurisdictions, Android 9+ [[10]](#sources); Google IACA page 10 states + PR + Utopia, with the per-state IACA links quoted in step 3 [[11]](#sources); AAMVA Guidelines 1.6 PDF 4,360,265 bytes, Last-Modified 2026-07-08 [[19]](#sources); DTS live 2024-04-15 with Utah and Maryland [[20]](#sources); vical.dts.aamva.org HTTP 200 [[22]](#sources); LA Wallet "Built on ISO 18013-5" and "75% of all Louisiana drivers" [[25]](#sources); Kentucky "in the summer of 2026" [[26]](#sources); Virginia Apple launch 2026-08-26 with ABC stores, State Police, DMV [[27]](#sources); Alaska TSA acceptance at Anchorage and Juneau [[28]](#sources); Utah SB 275 sunset "January 1, 2027" [[29]](#sources)[[30]](#sources); Ohio Google Wallet release 2026-08-31, "digital companion", casinos [[33]](#sources); Oklahoma app decommissioned 2024-02-08 [[34]](#sources); HB 3015 passed House 03/25/2026 (73-22), placed on Senate General Order 04/08/2026 [[35]](#sources); NC wallets "in 2027", page stamp 8/31/2026 [[36]](#sources); Credence "21 states and territories", March 2026, DE/MS non-ISO note [[38]](#sources); MacRumors 15th-state and Oklahoma-backend articles [[41]](#sources)[[42]](#sources); TSA "intends to issue a future rulemaking" [[4]](#sources); Samsung press release dated 2023-10-06 [[13]](#sources); AZ "Smart ID Verifier" [[14]](#sources); CA 1.7 M / 3.5 M figures [[16]](#sources).

**Corrections made.**
- California Samsung: TSA's participating-states table does not list Samsung Wallet for California (it names "California DMV Wallet App, Apple Wallet, and Google Wallet"); the Samsung entry now cites only the CA DMV and Governor's pages, and the Samsung total notes TSA lists 8 of the 9 states.
- Mississippi: the MS page says nothing about TSA or ISO; "physical ID still required at TSA" was re-sourced to the Credence tracker [[38]](#sources) and the row now describes what the MS page actually says (QR "Privacy Code", Bluetooth "Mobile ID Verify App", IDEMIA support).
- New York: the DMV business page states the State "does not provide a verification app, software development kit, or an online verification system"; the "MiD Verify app and SDK" wording was changed to third-party tools in the table and in step 5.
- Alaska: the DMV page names an "App for Verifying Parties", not an "Alaska Mobile ID Verifier"; Thales appears only via the support e-mail domain. Step 5 reworded.
- North Carolina: the page does not say "coming soon"; it says "At launch" via NC Wallet and "in 2027" for Apple/Google/Samsung. Row reworded; December 2026 launch added from MacRumors/WRAL as secondary.
- Delaware: the live page is https://services.dmv.de.gov/mobileID/ (the doc's dmv.de.gov URL 404s); it rejects automated fetches, so the row stays [unverified] with the corrected URL.
- Intro sentence on DE/MS non-ISO apps now cites [[38]](#sources) (Credence) in addition to [[37]](#sources), since the MS page does not itself make the ISO/TSA claim.
- Source 43 note corrected: the DHS FAQ page carries a navigation link titled "REAL ID Mobile Driver's Licenses (mDLs)", not zero mDL content.
- Source 39 and the cross-check row note that mdlconnection.com returns 403 to curl; the 2026-04-27 date and Secure Technology Alliance attribution were confirmed via WebFetch.
- Google IACA page "Last updated 2026-06-29 UTC" stamp added to the table.

**Left unverified.**
- Illinois expansion to Google and Samsung Wallets: ilsos.gov times out for both curl and WebFetch; only ilsos.gov and WTTW search snippets ("will soon expand to Google and Samsung Wallets") were seen.
- Delaware Mobile ID details (IDEMIA vendor, QR privacy code, non-ISO): services.dmv.de.gov/mobileID/ returns "Request Rejected" to automated fetches; only a search snippet and the Credence note support it.
- AAMVA DTS relying-party registration terms (fee, agreement, cadence): not published on the DTS page or the VICAL portal landing page.
- Whether any waiver application or state program exposes a per-mDL status list to relying parties: no fetched source addresses it.
- Whether a Phase 2 mDL rulemaking is scheduled: no source fetched mentions one.
- The claim that only Apple Wallet (iOS 26/Safari) and Google Wallet (Chrome/Android) answer the Digital Credentials API is taken from wallet-mdl-platforms.md and was not re-checked in this pass.

