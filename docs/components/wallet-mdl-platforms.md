# Apple Wallet ID and Google Wallet mDL for relying parties
_Researched 2026-09-01 (sources fetched that day; file finalised 2026-09-02; independently re-verified against live sources 2026-09-02, see Verification). Every claim carries a source link. Unverified statements are marked [unverified]._

## What it is
Apple Wallet and Google Wallet hold state-issued ISO/IEC 18013-5 mobile driver's licenses (mDLs) and expose them to relying parties (RPs) through two channels each: a native in-app API and the W3C Digital Credentials API in the browser. On iOS the in-app path is the PassKit "Verify with Wallet" API and the web path is "Verify with Wallet on the Web" (Safari 26, iOS 26, protocol string `org-iso-mdoc`, ISO 18013-7 Annex C); both return an ISO 18013-5 `DeviceResponse` encrypted with HPKE to the RP's own key, carrying an issuer signature (MSO chained to a state IACA root) and a device signature over a session transcript [[3]](#sources)[[6]](#sources)[[8]](#sources). On Android the in-app path is Credential Manager's `GetDigitalCredentialOption` and the web path is Chrome's Digital Credentials API (default-on from Chrome 141); Google Wallet answers OpenID4VP 1.0 requests for `mso_mdoc` and, uniquely, for `mso_mdoc_zk`, a zero-knowledge proof generated inside the wallet with Google's longfellow-zk library [[14]](#sources)[[16]](#sources)[[17]](#sources)[[26]](#sources). As of today Apple lists 15 states plus Puerto Rico and Google lists 10 states plus Puerto Rico; California is in both, New York is in neither [[12]](#sources)[[19]](#sources)[[37]](#sources).

## Where it lives
| Item | URL | Licence | Version/tag/commit seen today |
|---|---|---|---|
| Apple Verify with Wallet API (in-app), getting started | https://developer.apple.com/wallet/get-started-with-verify-with-wallet/ | Apple Developer Program terms | iOS 16.5+ for most states; entitlement per bundle ID [[3]](#sources) |
| Apple PassKit: Requesting identity data from a Wallet pass | https://developer.apple.com/documentation/passkit/requesting-identity-data-from-a-wallet-pass | Apple docs | iOS 16+; `PKIdentityRequest` [[4]](#sources) |
| Apple PassKit: Verifying Wallet identity requests (server side) | https://developer.apple.com/documentation/passkit/verifying-wallet-identity-requests | Apple docs | envelope `APPLE-HPKE-v1`, handover `AppleIdentityPresentment_1.0` [[5]](#sources) |
| Apple Verify with Wallet on the Web, prepare / brand setup / certificate / FAQ | https://support.apple.com/guide/business/prepare-set-verify-wallet-web-abcb17bcda04/web | Apple Business Connect terms | iOS 26+, iPhone 11+; cert valid 397 days [[7]](#sources)[[9]](#sources)[[10]](#sources)[[11]](#sources) |
| WebKit: Online Identity Verification with the Digital Credentials API | https://webkit.org/blog/17431/online-identity-verification-with-the-digital-credentials-api/ | blog | Safari 26 on macOS 26, iOS 26, iPadOS 26; post dated 2025-10-03 [[8]](#sources) |
| Apple IdentityDocumentServices (third-party wallets as web providers) | https://developer.apple.com/documentation/IdentityDocumentServices | Apple docs | iOS 26.0+, macOS 26.0+ [[13]](#sources) |
| Apple ID-in-Wallet availability | https://learn.wallet.apple/id | Apple | 16 jurisdictions listed [[12]](#sources) |
| Apple Wallet Identity Developer profile (mock mDL on device) | https://developer.apple.com/bug-reporting/profiles-and-logs/ | Apple | `WalletIdentityDeveloper.mobileconfig` [[2]](#sources) |
| Google: Online Acceptance of Digital Credentials (Verify with Google Wallet) | https://developers.google.com/wallet/identity/verify/accepting-ids-from-wallet-online | Google docs | OpenID4VP 1.0, `openid4vp-v1-signed`, `mso_mdoc_zk` [[17]](#sources) |
| Google: Supported issuers and IACA certs | https://developers.google.com/wallet/identity/verify/supported-issuers-iaca-certs | Google docs | 10 US states + PR + "Utopia" sandbox issuer [[19]](#sources) |
| Google: Sandbox mode; Create a test ID pass; FAQ | https://developers.google.com/wallet/identity/verify/sandbox | Google docs | Play services 24.38+ for test ID pass [[20]](#sources)[[21]](#sources)[[22]](#sources) |
| Google Wallet Help: Add your US Driver's License or State ID | https://support.google.com/wallet/answer/12436402?hl=en | Google | 10 states + PR; Android 9+ [[18]](#sources) |
| Android Credential Manager Verifier API | https://developer.android.com/identity/digital-credentials/credential-verifier | Google docs | `androidx.credentials:credentials:1.6.0-beta01` [[16]](#sources) |
| Chrome: Digital Credentials API shipped | https://developer.chrome.com/blog/digital-credentials-api-shipped | blog | Chrome 141+, Play services 24.0+, post dated 2025-10-03 [[26]](#sources) |
| google/longfellow-zk (library + reference verifier service) | https://github.com/google/longfellow-zk | Apache-2.0 | release v0.9 (2026-03-31); `main` at `5f348de` (2026-08-12) [[27]](#sources)[[28]](#sources)[[29]](#sources) |
| longfellow reference verifier-service (Docker) | https://github.com/google/longfellow-zk/tree/main/reference/verifier-service/server | Apache-2.0 | Go server, `POST /zkverify`, port 8888 [[33]](#sources) |
| IETF draft-google-cfrg-libzk | https://datatracker.ietf.org/doc/draft-google-cfrg-libzk/ | IETF | -02, 2026-07-22, active [[34]](#sources) |
| W3C Digital Credentials | https://www.w3.org/TR/digital-credentials/ | W3C | Working Draft, 27 August 2026 [[25]](#sources) |
| TSA participating states (federal cross-check of wallet per state) | https://www.tsa.gov/digital-id/participating-states | US Gov | 20 states + PR listed [[37]](#sources) |

## How Green Light uses it
- **SPEC §2 rows "Credential" and "Hand-off", §3 guest flow.** The prover page is, from the wallet's point of view, a relying party. It must issue a DC API request that each platform accepts: `org-iso-mdoc` signed with an Apple Business Connect certificate on Safari 26 [[6]](#sources)[[8]](#sources), and `openid4vp-v1-signed` with Google-issued `gw_rp_metadata_bytes` on Chrome/Android for production (sandbox needs no RP intake form, but the phone-side Sandbox/Production toggle is hidden by default and may need the Google Pay Sandbox Access Request form to allowlist the test Google Account [[17]](#sources)[[20]](#sources)). This is the "pin profile per platform" work item in SPEC §2 and PLAN M3.
- **SPEC §6a demo note, confirmed verbatim.** Apple: "the API will return mock data containing a real device signature but no issuer signature" when the developer profile is installed; the Simulator returns neither signature; production returns both [[3]](#sources)[[4]](#sources). So the Level 2 demo (PLAN M6) on iPhone can exercise the DC API hand-off and device binding but not the issuer-signature statement in the circuit; the issuer-signed input for M3/M6 must come from our test DMV fixture (PLAN M0) or from Google's sandbox.
- **SPEC §9 pilot state, "California default; confirm New York".** Confirmed today: California is live in Apple Wallet and Google Wallet [[12]](#sources)[[18]](#sources)[[19]](#sources)[[37]](#sources). New York is in neither; TSA lists only the "NY MiD app" and NY DMV's pages name only the "New York Mobile ID" app [[37]](#sources)[[38]](#sources). New York cannot be a pilot state under the SPEC §9 rule. The candidate set (both wallets) is Arizona, Arkansas, California, Colorado, Georgia, Iowa, Maryland, Montana, New Mexico, North Dakota, plus Puerto Rico.
- **SPEC §7 "Google is shipping ZK age proofs inside Wallet."** Confirmed and now documented for third-party RPs: request format `mso_mdoc_zk` with `zk_system_type: longfellow-libzk-v1`, verified with longfellow-zk [[17]](#sources). For Android guests this is an alternative to proving in our page, and it never exposes the plaintext mdoc to the page (SPEC §8 trust hole). No Apple in-wallet ZK feature appears in any Apple source fetched today.
- **PLAN M4 fallback** ("wallet's device signature over the session transcript, verified in the clear"). Both platforms deliver exactly this: Apple's `DeviceAuth` over a session transcript built from origin and EncryptionInfo (web) or the `AppleHandover` structure (in-app) [[5]](#sources)[[6]](#sources); Google's ISO 18013-5 `SessionTranscript` with origin, nonce and encryption-key thumbprint [[17]](#sources).
- **PLAN M8 item 4 (VICAL).** Google's own issuer list points several states' IACA certs at `https://vical.dts.aamva.org/` and ships a `vical.cbor` in its reference verifier, whose `main.go` also carries a `-vical_url` flag defaulting to `https://vical.dts.aamva.org/vical/vc` and calls `zk.LoadVICAL` at startup, which is evidence that AAMVA VICAL is the practical trust root RPs already use [[19]](#sources)[[33]](#sources).

## How to build or integrate
**Apple, in-app (PassKit).** Request the entitlement per bundle ID, create a merchant ID and an "Identity Access Certificate", add the `In App Identity Presentment` capabilities, then [[3]](#sources)[[4]](#sources):
```swift
let descriptor = PKIdentityDriversLicenseDescriptor()
descriptor.addElements([.age(atLeast: 21)], intentToStore: .willNotStore)
let request = PKIdentityRequest()
request.descriptor = descriptor
request.merchantIdentifier = "<merchant id>"
request.nonce = "<server nonce>"
let document = try await PKIdentityAuthorizationController().requestDocument(request)
// document.encryptedData -> your server
```
Entitlement keys: `com.apple.developer.in-app-identity-presentment` (with `document-types: ["us-drivers-license"]` and an `elements` list) and `com.apple.developer.in-app-identity-presentment.merchant-identifiers` [[3]](#sources). Server side: rebuild `SessionTranscript = [nil, nil, ["AppleIdentityPresentment_1.0", nonce, merchantId, teamID, pkRHash]]`, decrypt with HPKE DHKEM(P-256, HKDF-SHA256) / HKDF-SHA256 / AES-128-GCM, then verify MSO against a trusted IACA root and `DeviceAuth` (ECDSA only) against the MSO device key [[5]](#sources).

**Apple, web.** Register a brand in Apple Business Connect, file the permissions request form (age or identity; US or Japan), prove domain ownership with a DNS TXT record (max five domains, one root domain per brand), upload screenshots of the current process, upload a ≥2048-bit `.pem` CSR and install the Apple-issued certificate (expires after 397 days) [[9]](#sources)[[10]](#sources)[[11]](#sources). Then, from the WebKit post [[8]](#sources):
```javascript
const requestData = { protocol: "org-iso-mdoc", data /* built and signed on your server */ };
const credential = await navigator.credentials.get({ mediation: "required", digital: { requests: [requestData] } });
await fetch("/verify", { method: "POST", body: credential });
```
Requires a user gesture [[8]](#sources); the response is HPKE (RFC 9180) ciphertext to the website's key and "is never made available to Apple nor the browser" (WWDC25 session 232; the WebKit post [[8]](#sources) does not mention HPKE or RFC 9180) [[6]](#sources). Test with the "Wallet and Apple mDL Developer Integrator profile", which "provides mock data with a real device signature" [[11]](#sources).

**Google, web and Android.** Sandbox first ("You can begin development immediately without submitting an intake form"), using the published test key pair and the `TEST USE ONLY Sandbox RP` metadata; switch a test phone to `TapAndPay Environment: SANDBOX`; that toggle "is hidden by default" and the sandbox page points to the Google Pay Sandbox Access Request form to have the Google Account allowlisted if it does not appear [[17]](#sources)[[20]](#sources). Production: submit the Relying Party Onboarding Form with a CSR, branding assets and an end-to-end video; Google returns a signed certificate and `gw_rp_metadata_bytes`; "Typically onboarding should take 3-5 business days" [[17]](#sources)[[22]](#sources). Android app dependency and request [[16]](#sources):
```kotlin
implementation("androidx.credentials:credentials:1.6.0-beta01")
implementation("androidx.credentials:credentials-play-services-auth:1.6.0-beta01")
val option = GetDigitalCredentialOption(requestJson = requestJson)   // OpenID4VP JSON from your server
val request = GetCredentialRequest(listOf(option))
```
ZK request body (from Google's RP doc; the doc's example values, do not hardcode circuit params, use `kZkSpecs` in the library as source of truth) [[17]](#sources)[[35]](#sources):
```json
"dcql_query": {"credentials": [{"id": "cred1", "format": "mso_mdoc_zk",
  "meta": {"doctype_value": "org.iso.18013.5.1.mDL",
           "zk_system_type": [{"system": "longfellow-libzk-v1",
             "circuit_hash": "f88a39e561ec0be02bb3dfe38fb609ad154e98decbbe632887d850fc612fea6f",
             "num_attributes": 1, "version": 5, "block_enc_hash": 4096, "block_enc_sig": 2945}],
           "verifier_message": "challenge"}}]}
```
Verify with the reference service [[33]](#sources):
```bash
cd longfellow-zk/reference/verifier-service
docker build -t zk -f Dockerfile ../..
docker run -it -p 8888:8888 zk        # POST /zkverify, GET /specs; IACA roots from certs.pem (-cacerts)
```

## Status and risks
- **Maturity.** Apple in-app: shipping since iOS 16 [[4]](#sources). Apple web: shipped in Safari 26 / iOS 26 (September 2025 per the WebKit post date) [[8]](#sources). Google: Credential Manager verifier library is at `1.6.0-beta01` [[16]](#sources); Chrome DC API default-on since Chrome 141 [[26]](#sources); W3C spec is still a Working Draft (27 August 2026) [[25]](#sources).
- **longfellow-zk reviews are done, not "in progress".** SPEC §2 says "two security reviews in progress"; the project's Reviews page lists three completed reviews: Trail of Bits (2025-08-18, 13 findings: 2 High, 2 Low, 8 Informational, 1 Undetermined per the report PDF; the page says "All of the issues have been addressed in the latest release"), ISRG / David Cook (2025-10-17, under-constrained MDOC circuit witness values, patched in v0.8.4; the Reviews page assigns no severity label, so "critical" is [unverified]) and a Ligero academic panel (2025-12-15) [[30]](#sources). The README still says reviews are "currently undergoing" [[27]](#sources). Latest release is v0.9 (2026-03-31); `main` moved on 2026-08-12 [[28]](#sources)[[29]](#sources). PLAN M8 item 1 ("reviewed 1.x tag") cannot be met literally: there is no 1.x tag; the reviewed line is 0.8.4+/0.9.
- **Circuit churn.** Google's ZK example uses circuit `version: 5`, while longfellow v0.8.5 deprecated versions 3 and 4 and v0.8.6 introduced version 7; the FAQ says "RPs must implement ZK verifier services to request the latest available circuits" [[17]](#sources)[[22]](#sources)[[28]](#sources). Our verify service must serve `GET /specs`-style current circuits, not pinned hashes.
- **Encryption-to-server threatens the browser-prover design (SPEC §3, §8).** On both platforms the wallet encrypts the mdoc to the RP's key: Apple to a key "generated earlier on the server" [[6]](#sources), Google to "the public key sent in the request" [[17]](#sources). If that private key lives on our server, the plaintext mdoc lands on the server, not in the page. Whether either platform accepts a per-session key generated in the browser is not stated in any source fetched [unverified]. This decides whether M3's "wipe mdoc on the page" is achievable and belongs in the M1 go/no-go.
- **Apple approval is per brand, per domain, per described use.** The permissions form asks for the goods or services requiring verification and screenshots of the current process; "There is no mechanism to detect the document provider app"; certificate revocation "may take up to 48 hours" [[9]](#sources)[[10]](#sources)[[11]](#sources). A neutral proving page serving many venues may not fit Apple's model [unverified].
- **Google ZK coverage is unclear.** The RP docs show `mso_mdoc_zk` with an mDL doctype, but no source states which issuers or states support in-wallet ZK in production, whether ZK works in sandbox, or what `verifier_message` binds [unverified]. Public statements describe an "over 18" proof [[23]](#sources)[[24]](#sources)[[32]](#sources).
- **State coverage.** Apple: Arizona, Arkansas, California, Colorado, Georgia, Hawaii, Illinois, Iowa, Maryland, Montana, New Mexico, North Dakota, Ohio, Virginia, West Virginia plus Puerto Rico (15 + PR) [[12]](#sources)[[3]](#sources). Google: Arizona, Arkansas, California, Colorado, Georgia, Iowa, Maryland, Montana, New Mexico, North Dakota plus Puerto Rico (10 + PR) [[18]](#sources)[[19]](#sources). Both: 10 + PR. TSA's federal list lists 20 states + PR with any accepted digital ID and agrees with both wallet lists [[37]](#sources). The SPEC §2 figure "21 states + PR" could not be confirmed from AAMVA's page today (no list rendered) [[36]](#sources) [unverified]. Press on 2026-08-17/18 still listed Virginia as upcoming for Apple; Apple's own pages and TSA list it live, so treat Virginia as live but very recent [[12]](#sources)[[39]](#sources)[[40]](#sources). Google announced West Virginia on 2025-04-29 and Ohio earlier (9to5Google dates the Ohio announcement to September 2024; Google's 2024-09-12 post names no states), but neither is on Google's lists today [[23]](#sources)[[41]](#sources)[[52]](#sources).
- **Test credentials.** Google's sandbox has a "Utopia" test issuer for ID passes with its own sandbox IACA root, created with the Utopia ePassport Simulator on a second phone; no test state mDL is documented [[19]](#sources)[[21]](#sources) [unverified whether a sandbox mDL doctype exists]. Apple's mock mDL has no issuer signature [[3]](#sources). Neither substitutes for a real DMV-signed credential; SPEC §6a's "cannot be demoed without a partner" stands.

## Open questions for the partner call
- Apple (Business Connect / Wallet team): can the HPKE recipient key for Verify with Wallet on the Web be an ephemeral key generated in the browser, so the mdoc never reaches our server? Will a single brand/domain be approved for a page that proves age on behalf of many venues? Any roadmap for in-wallet ZK or for `age_over_21`-only presentments that suppress the portrait?
- Google (Wallet Identity RP team, wallet-identity-rp-support@google.com): which production issuers/states support `mso_mdoc_zk` today; does ZK work in sandbox; what exactly does `verifier_message` bind (nonce, origin, time); which circuit version is served now and how often does it rotate; can a sandbox mDL (not ID pass) be issued to test phones?
- Google longfellow team: will the reference verifier accept a trust-list Merkle root as a public input (SPEC §3 statement 1), and is device-key nonce binding (statement 4) already covered by `verifier_message`? Is a 1.0 tag planned, given PLAN M8 item 1 expects "a reviewed 1.x tag"?
- California DMV: named contact; confirm the IACA at `trust.dmv.ca.gov` is the root both wallets chain to; any position on ZK presentments satisfying age checks.
- AAMVA DTS: RP access to VICAL; several Google-listed states publish IACA only via `vical.dts.aamva.org`.
- New York DMV: any plan to issue to Apple or Google Wallet; otherwise drop NY from SPEC §9.

## Sources
1. https://developer.apple.com/wallet/get-started-with-verify-with-wallet-on-the-web/ (404 today), fetched 2026-09-01
2. https://developer.apple.com/bug-reporting/profiles-and-logs/ fetched 2026-09-01
3. https://developer.apple.com/wallet/get-started-with-verify-with-wallet/ fetched 2026-09-01
4. https://developer.apple.com/documentation/passkit/requesting-identity-data-from-a-wallet-pass (via tutorials/data JSON) fetched 2026-09-01
5. https://developer.apple.com/documentation/passkit/verifying-wallet-identity-requests (via tutorials/data JSON) fetched 2026-09-01
6. https://developer.apple.com/videos/play/wwdc2025/232/ fetched 2026-09-01
7. https://support.apple.com/guide/business/prepare-set-verify-wallet-web-abcb17bcda04/web fetched 2026-09-01
8. https://webkit.org/blog/17431/online-identity-verification-with-the-digital-credentials-api/ fetched 2026-09-01
9. https://support.apple.com/guide/business/brand-set-verify-wallet-web--axmeb38543c4/web fetched 2026-09-01
10. https://support.apple.com/guide/business/create-a-certificate-abcbffe722af/web fetched 2026-09-01
11. https://support.apple.com/guide/business/verify-with-wallet-on-the-web-faq-abcbb063f3a2/web fetched 2026-09-01
12. https://learn.wallet.apple/id fetched 2026-09-01
13. https://developer.apple.com/documentation/IdentityDocumentServices (via tutorials/data JSON) fetched 2026-09-01
14. https://developers.google.com/wallet/identity/verify fetched 2026-09-01
15. https://support.apple.com/guide/security/secb569bf393/web fetched 2026-09-01
16. https://developer.android.com/identity/digital-credentials/credential-verifier fetched 2026-09-01
17. https://developers.google.com/wallet/identity/verify/accepting-ids-from-wallet-online fetched 2026-09-01
18. https://support.google.com/wallet/answer/12436402?hl=en fetched 2026-09-01 (browser)
19. https://developers.google.com/wallet/identity/verify/supported-issuers-iaca-certs fetched 2026-09-01
20. https://developers.google.com/wallet/identity/verify/sandbox fetched 2026-09-01
21. https://developers.google.com/wallet/identity/verify/create-test-id fetched 2026-09-01
22. https://developers.google.com/wallet/identity/verify/faq fetched 2026-09-01
23. https://blog.google/products/google-pay/google-wallet-age-identity-verifications/ (2025-04-29) fetched 2026-09-01
24. https://blog.google/innovation-and-ai/technology/safety-security/opening-up-zero-knowledge-proof-technology-to-promote-privacy-in-age-assurance/ (2025-07-03) fetched 2026-09-01
25. https://www.w3.org/TR/digital-credentials/ fetched 2026-09-01
26. https://developer.chrome.com/blog/digital-credentials-api-shipped fetched 2026-09-01
27. https://github.com/google/longfellow-zk fetched 2026-09-01
28. https://github.com/google/longfellow-zk/releases and https://api.github.com/repos/google/longfellow-zk/releases/latest fetched 2026-09-01
29. https://api.github.com/repos/google/longfellow-zk/commits/main fetched 2026-09-01
30. https://google.github.io/longfellow-zk/docs/reviews/ fetched 2026-09-01; Trail of Bits report PDF https://google.github.io/longfellow-zk/reviews/Longfellow_report_2025_08_18.pdf fetched 2026-09-02
31. https://google.github.io/longfellow-zk/ and https://google.github.io/longfellow-zk/docs/benchmarks/ fetched 2026-09-01
32. https://developers.google.com/wallet/identity/identity_frame fetched 2026-09-01
33. https://github.com/google/longfellow-zk/tree/main/reference/verifier-service/server fetched 2026-09-01
34. https://datatracker.ietf.org/doc/draft-google-cfrg-libzk/ fetched 2026-09-01
35. https://google.github.io/longfellow-zk/docs/zk-system-spec/ fetched 2026-09-01
36. https://www.aamva.org/topics/mobile-driver-license fetched 2026-09-01
37. https://www.tsa.gov/digital-id/participating-states fetched 2026-09-01 (browser)
38. https://dmv.ny.gov/id-card/mobile-id-mid and https://dmv.ny.gov/id-card/mobile-id-mid-for-license-permit-and-id-holders fetched 2026-09-01
39. https://www.macrumors.com/2026/08/17/apple-wallet-ids-expanding-to-four-more-states/ fetched 2026-09-01 (secondary)
40. https://9to5mac.com/2026/08/18/apple-wallet-drivers-licenses-states-coming-soon/ fetched 2026-09-01 (secondary)
41. https://9to5google.com/2025/10/11/google-wallet-state-ids/ fetched 2026-09-01 (secondary)
42. https://credenceid.com/resources/blog/us-mobile-drivers-license-mdl-state-tracker/ fetched 2026-09-01 (secondary, March 2026 matrix)
43. https://blog.google/around-the-globe/google-europe/age-assurance-europe/ (2025-06-13) fetched 2026-09-01
44. https://android-developers.googleblog.com/2025/04/announcing-android-support-of-digital-credentials.html fetched 2026-09-01
45. https://news.dyne.org/longfellow-zero-knowledge-google-zk/ (2025-06-25) fetched 2026-09-01
46. https://github.com/eu-digital-identity-wallet/av-lib-ios-longfellow-zkp fetched 2026-09-01
47. https://github.com/android/identity-samples/blob/main/DigitalCredentials/README.md fetched 2026-09-01
48. https://developers.google.com/wallet/identity/verify/supported-credential-attributes fetched 2026-09-01
49. https://developer.apple.com/wallet/whats-new/ fetched 2026-09-01
50. https://www.dmv.virginia.gov/licenses-ids/mobile-id/business fetched 2026-09-01
51. https://support.apple.com/en-us/111803 fetched 2026-09-01
52. https://blog.google/products/google-pay/google-wallet-digital-id-privacy-security/ (2024-09-12) fetched 2026-09-01
53. https://api.github.com/repos/google/longfellow-zk/contents/ (root, docs, rust listings) fetched 2026-09-01

## Verification
_Independent re-check on 2026-09-02 by a second reviewer. Every URL in Sources was re-fetched (HTTP status confirmed: all 200 except source 1, which is 404 as stated; api.github.com endpoints checked via authenticated `gh api`). 88 factual claims (URLs, versions, dates, counts, quotes, feature/status statements) were compared against the live page or API response._

**Corrections made**
- "Google announced Ohio and West Virginia in 2025": Google's 2025-04-29 post names West Virginia only; 9to5Google [41] dates the Ohio announcement to September 2024 and Google's 2024-09-12 post [52] names no states. Text now gives the separate dates.
- ISRG finding was labelled "critical"; the Reviews page [30] gives no severity label. Reworded and marked [unverified].
- Trail of Bits "two High findings" was attributed to the Reviews page, which only says "All of the issues have been addressed in the latest release". The count (2 High, 2 Low, 8 Informational, 1 Undetermined) comes from the report PDF, now cited in source 30.
- The quote "is never made available to Apple nor the browser" and the HPKE / RFC 9180 statement were cited to [6][8]; the WebKit post [8] contains neither. Now cited to WWDC25 session 232 [6] alone.
- "sandbox needs no approval": Google's online-acceptance page says no intake form is needed, but the sandbox page [20] says the phone-side Sandbox/Production toggle is hidden by default and points to a Google Pay Sandbox Access Request form to allowlist the test account. Both places now say so.
- VICAL evidence strengthened: the reference verifier's `main.go` has a `-vical_url` flag defaulting to `https://vical.dts.aamva.org/vical/vc` and loads VICAL at startup (in addition to the shipped `vical.cbor`).

**Confirmed as written (selection)**
- Apple ID-in-Wallet page lists 16 jurisdictions (15 states + PR) including Virginia; Google lists 10 states + PR on both the help page and the issuer/IACA page; TSA lists 20 states + PR and its per-state wallet columns agree with both wallet lists (Virginia: "VA MiD app and Apple Wallet").
- Apple in-app: iOS 16.5+ for most states (17.5 California, 18.1 Puerto Rico); both entitlement keys; merchant ID / Identity Access Certificate; "mock data containing a real device signature but no issuer signature"; PassKit doc states the Simulator response "doesn't include a real issuing authority or device signature"; `APPLE-HPKE-v1`, `AppleIdentityPresentment_1.0`, SessionTranscript `[nil, nil, AppleHandover(nonce, merchantId, teamID, pkRHash)]`, DHKEM(P-256, HKDF-SHA256)/HKDF-SHA256/AES-128-GCM, ECDSA-only DeviceAuth.
- Apple web: iOS 26+, iPhone 11+; Safari 26 on macOS/iOS/iPadOS 26; `org-iso-mdoc`; ISO 18013-7 Annex C; `mediation: "required"`, `digital: { requests: [...] }`; user gesture; age vs identity form, US or Japan; DNS TXT, up to five domains, one root domain per brand; ≥2048-bit `.pem` CSR; 397-day certificate; "There is no mechanism to detect the document provider app"; revocation "may take up to 48 hours"; Integrator profile "provides mock data with a real device signature"; WebKit post dated 2025-10-03; IdentityDocumentServices iOS/iPadOS/macOS 26.0; `WalletIdentityDeveloper.mobileconfig`.
- Google: OpenID4VP 1.0, `openid4vp-v1-signed`/`-unsigned`, `gw_rp_metadata_bytes`, `mso_mdoc_zk` with `longfellow-libzk-v1`, circuit hash `f88a39e5…fea6f`, `num_attributes: 1`, `version: 5`, `block_enc_hash: 4096`, `block_enc_sig: 2945`, `verifier_message`; SessionTranscript = origin, nonce, encryption-key JWK thumbprint; "You can begin development immediately without submitting an intake form"; `TEST USE ONLY Sandbox RP`; CSR + branding + end-to-end video; "Typically onboarding should take 3-5 business days"; "RPs must implement ZK verifier services to request the latest available circuits"; wallet-identity-rp-support@google.com; Play services 24.38+ for the test ID pass; Utopia sandbox issuer; `vical.dts.aamva.org` and `trust.dmv.ca.gov` IACA links; Android 9+; `androidx.credentials:credentials:1.6.0-beta01`; Chrome 141 default-on, Play services 24.0+, post dated 2025-10-03.
- longfellow-zk: Apache-2.0; latest release v0.9 (2026-03-31); `main` = `5f348de` (2026-08-12, "Merge pull request #176 from google/rust"); tags v0.8.1…v0.9 only, no 1.x; v0.8.4 (2025-10-17) introduced circuit version 6; v0.8.5 (2025-11-10) "deprecates old version 3 and 4 circuits"; v0.8.6 (2026-01-13) "introduces circuits version 7"; README still says "currently undergoing two independent security reviews"; Reviews page lists Trail of Bits 2025-08-18, ISRG 2025-10-17 (patched v0.8.4), Ligero panel 2025-12-15; reference server listens on `:8888`, routes `/zkverify` and `/specs`, `-cacerts` default `certs.pem`; zk-system-spec page tells RPs to use `kZkSpecs` as source of truth; IETF draft-google-cfrg-libzk-02 dated 2026-07-22, active; W3C Digital Credentials Working Draft 27 August 2026.
- Press: MacRumors 2026-08-17 and 9to5Mac 2026-08-18 both list Virginia as upcoming and count 14 states + PR live; 9to5Google 2025-10-11 lists Ohio and West Virginia as upcoming for Google; Google blog posts dated 2025-04-29, 2025-07-03, 2025-06-13, 2024-09-12; Dyne post 2025-06-25; Credence ID tracker is the March 2026 matrix; AAMVA page renders no state list; NY DMV pages name only the MiD app; Virginia DMV business page links "ID in Apple Wallet".

**Left unverified**
- Whether either platform accepts an HPKE recipient key generated in the browser rather than on the RP server (no source states it either way).
- Whether Apple will approve one brand/domain for a neutral proving page serving many venues.
- Which Google issuers/states support `mso_mdoc_zk` in production, whether ZK works in sandbox, and what `verifier_message` binds (the RP doc shows `"verifier_message": "challenge"` with no definition).
- Whether a sandbox mDL doctype (not ID pass) can be issued to test phones.
- The SPEC §2 "21 states + PR" figure: AAMVA's page renders no list; the Credence ID March 2026 tracker says "21 states and territories" (secondary, and its Apple list differs from Apple's own page, e.g. it includes Alaska and omits Iowa/Virginia).
- Severity of the ISRG finding (page gives none).
- Source 53 (api.github.com root/docs/rust listings) was not re-listed beyond confirming the `rust` merge on `main`.

