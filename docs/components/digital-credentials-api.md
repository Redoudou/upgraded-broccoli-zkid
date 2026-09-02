# W3C Digital Credentials API and platform status
_Researched 2026-09-01. Every claim carries a source link. Unverified statements are marked [unverified]._

## What it is
The Digital Credentials API is a W3C specification, edited by Apple, Okta and Google, that extends Credential Management so a web page can call `navigator.credentials.get({ digital: { requests: [...] } })` and have the browser and OS route the request to a wallet app, returning the wallet's response as an opaque JSON object [[1]](#sources). The API is deliberately protocol-agnostic: each request names a protocol identifier and carries a protocol-defined `data` object, requests must be unencrypted so the user agent can inspect them, and responses are assumed to be encrypted so the browser never sees credential contents [[1]](#sources). Section 5 of the current draft lists five identifiers: `openid4vp-v1-unsigned`, `openid4vp-v1-signed`, `openid4vp-v1-multisigned` (all from OpenID4VP 1.0 Appendix A), `org-iso-mdoc` (ISO/IEC 18013-7:2025 Annex C) and the issuance protocol `openid4vci-v1` [[1]](#sources) [[2]](#sources). It shipped enabled by default in Chrome 141 on 2025-09-30 (Android same-device, desktop cross-device) [[8]](#sources) [[9]](#sources) and in Safari 26.0 on 2025-09-15; Apple's posts name macOS 26, iOS 26 and iPadOS 26 for the API (visionOS is not named), and only `org-iso-mdoc` is accepted [[12]](#sources) [[13]](#sources). For Green Light it is the hand-off in spec section 2: the only standard way a browser page can obtain a state-signed mDL from Apple Wallet or Google Wallet without an app install.

## Where it lives
| Item | URL | Licence | Version / tag / commit seen today |
|---|---|---|---|
| W3C Digital Credentials, Editor's Draft | https://w3c-fedid.github.io/digital-credentials/ | W3C Software and Document License [[4]](#sources) | Editor's Draft 27 Aug 2026 [[1]](#sources) |
| W3C Digital Credentials, published Working Draft | https://www.w3.org/TR/2026/WD-digital-credentials-20260827/ | W3C document licence | Working Draft 27 Aug 2026 [[2]](#sources) |
| Spec repository | https://github.com/w3c-fedid/digital-credentials | W3C Software and Document License [[4]](#sources) | 166 stars, 326 commits, last commit `a3b699ec` 2026-08-27 "chore: tidy up index.html (#582)" [[3]](#sources) [[5]](#sources) |
| OpenID for Verifiable Presentations 1.0 | https://openid.net/specs/openid-4-verifiable-presentations-1_0-final.html | OpenID Foundation specification (IPR terms not checked) [unverified] | Final, 9 July 2025 [[6]](#sources) |
| OpenID4VC High Assurance Interoperability Profile 1.0 | https://openid.net/specs/openid4vc-high-assurance-interoperability-profile-1_0-final.html | as above [unverified] | Final, 24 December 2025 [[7]](#sources) |
| ISO/IEC TS 18013-7 second edition, Annex C "Digital credentials API retrieval" | https://www.iso.org/standard/91154.html (blocked by bot check today); DTS preview: https://cdn.standards.iteh.ai/samples/91154/d537bc129f34476aa42a8a0c5b522f2f/ISO-IEC-DTS-18013-7.pdf | Paid ISO standard, ISO copyright | DTS second edition dated 2025-02-05, FDIS stage in the preview; the W3C spec cites it as ISO/IEC 18013-7:2025 [[20]](#sources) [[1]](#sources); published as ISO/IEC TS 18013-7:2025 in May 2025 (29 May 2025, 42 pages, per national catalogue mirrors; iso.org itself still blocks fetches) [[36]](#sources) |
| Chrome implementation | https://developer.chrome.com/release-notes/141 ; https://developer.chrome.com/blog/digital-credentials-api-shipped | Chromium (BSD) | Chrome 141, 2025-09-30; tracking bug 40257092; ChromeStatus 5166035265650688 [[8]](#sources) [[9]](#sources) |
| WebKit / Safari implementation | https://webkit.org/blog/17333/webkit-features-in-safari-26-0/ ; https://webkit.org/blog/17431/online-identity-verification-with-the-digital-credentials-api/ | WebKit (BSD/LGPL) | Safari 26.0, 2025-09-15; meta bug 268516 still NEW, last modified 2026-08-20 [[12]](#sources) [[13]](#sources) [[16]](#sources) |
| Apple verifier documentation | https://developer.apple.com/documentation/IdentityDocumentServices/Requesting-a-mobile-document-on-the-web | Apple developer docs | undated page, fetched today [[14]](#sources) |
| Android Credential Manager (verifier / holder) | https://developer.android.com/identity/digital-credentials/credential-verifier ; https://developer.android.com/identity/digital-credentials/credential-holder/credential-holder | Apache-2.0 (androidx) | Verifier and Holder APIs on Android 6 (API 23)+ [[18]](#sources) [[19]](#sources) |
| Google Wallet online acceptance | https://developers.google.com/wallet/identity/verify/accepting-ids-from-wallet-online | Google developer docs | Last updated 2026-06-29 [[17]](#sources) |
| Samsung "Verify with Samsung Wallet" | https://developer.samsung.com/wallet/verifywithsamsungwallet.html ; https://developer.samsung.com/wallet/api_new/verifywith/spec.html | Samsung developer docs | undated; JWT header `"ver":"2"` [[22]](#sources) [[23]](#sources) |
| Ecosystem matrix (W3C Web Identity & Credentials Adoption CG) | https://digitalcredentials.dev/ecosystem-support | CG site | undated, fetched today [[21]](#sources) |
| Mozilla standards position | https://github.com/mozilla/standards-positions/issues/1003 | n/a | Negative, issue opened 2024-03-21, now closed with the position recorded [[25]](#sources) |

## How Green Light uses it
- **Spec section 1 and section 2, row "Hand-off".** The arrow "W3C Digital Credentials API" between the wallet and the prover page is this component. The row's status "Chrome/Android live; Safari iOS 26" is confirmed: Chrome 141 (2025-09-30) and Safari 26.0 (2025-09-15) [[8]](#sources) [[12]](#sources). "Pin profile per platform" is unavoidable because Safari only forwards `org-iso-mdoc` while Google Wallet only accepts OpenID4VP 1.0 (see below), so the page must issue two different request shapes.
- **Spec section 3, guest flow.** "`navigator.credentials.get()` requests `age_over_21` and `expiry_date` … page receives the signed mdoc." Both platforms return an *encrypted* response; after decryption the page holds an ISO 18013-5 `DeviceResponse` containing the issuer-signed Mobile Security Object, the requested issuer-namespace elements, and the device-authentication structure [[14]](#sources) [[17]](#sources). That is the input longfellow needs. The decryption key must therefore live in the page, not on the verify service; Apple's guidance assumes the opposite ("keep the encryption key safely on your server and rotate it frequently") [[14]](#sources).
- **Spec section 3, circuit statement 4 ("device-bound key signed the verifier's nonce").** Under both protocols the wallet's device signature is over a `SessionTranscript` whose handover element hashes the browser-supplied origin and the verifier nonce (plus the encryption key), so origin binding and nonce binding come for free from the wallet; the circuit addition in PLAN M4 is proving that signature in zero knowledge rather than inventing a new nonce scheme [[6]](#sources) [[17]](#sources). The M4 fallback ("the wallet's device signature over the session transcript, verified in the clear") is exactly the standard ISO 18013-5 §9.1.3 device-authentication check Apple documents [[14]](#sources).
- **PLAN M2 (weeks 1–3)** stubs the wallet sheet; **M3 (weeks 2–5)** wires the real request "with the per-platform profile pinned (Chrome/Android now, Safari iOS 26)"; **M6** needs the real response on an iPhone and a Pixel. Spec 6a's warning that a real credential needs "a registered relying party" is confirmed for both Apple Wallet (Apple Business Connect reader-authentication certificate) and Google Wallet (Google-signed certificate plus `gw_rp_metadata_bytes`) [[14]](#sources) [[17]](#sources).

## How to build or integrate
**Feature and protocol detection** (spec §2.1–2.2, §7.7.3) [[1]](#sources):
```js
if (typeof DigitalCredential !== "undefined") { /* API supported */ }
DigitalCredential.userAgentAllowsProtocol("org-iso-mdoc"); // true/false, never throws
```
The call needs transient activation (a click) and a non-opaque origin; a cross-origin iframe needs `allow="digital-credentials-get"` (spec §2.5, §6.2, §10.2) [[1]](#sources).

**Chrome / Android, OpenID4VP unsigned** (verbatim from the Chrome shipping post) [[9]](#sources):
```js
const digitalCredential = await navigator.credentials.get({
  digital: {
    requests: [{
      protocol: "openid4vp-v1-unsigned",
      data: {
        response_type: "vp_token",
        nonce: "[some-nonce]",
        client_metadata: {...},
        dcql_query: {...}
      }
    }]
  }
});
```
OpenID4VP Appendix A: the DC API `data` member carries the request; response mode `dc_api` (plain) or `dc_api.jwt` (encrypted JWE); `expected_origins` is required for signed requests and "the Wallet MUST compare values in this parameter to the Origin to detect replay" [[6]](#sources). Google Wallet requires `openid4vp-v1-signed`, `"response_mode": "dc_api.jwt"`, the encryption public key in `client_metadata`, and the Google-issued `gw_rp_metadata`; its example is `protocol: "openid4vp-v1-signed", data: {<credential_request>}` and the decrypted `vp_token` maps each credential id to a `<base64UrlNoPadding_encoded_credential>`, after which "the Device Response must be validated according to ISO/IEC 18013-5:2021 clause 9" [[17]](#sources). HAIP 1.0 makes `dc_api.jwt` mandatory for verifiers [[7]](#sources).

**Safari / iOS 26, ISO 18013-7 Annex C** (verbatim from Apple's page, sample strings truncated) [[14]](#sources):
```js
const mdocRequest = {
  "deviceRequest": "pGd2ZXJzaW9uYzEuMWtkb2NSZXF1ZXN0c4G…",   // base64url CBOR DeviceRequest, ISO 18013-5 §8.3.2.1.2.1
  "encryptionInfo": "gmVkY2FwaaJlbm9uY2VYIPlv505ZK3Y93ZZh…"  // base64url CBOR ["dcapi", {nonce, recipientPublicKey}]
};
const request = { mediation: "required",
  digital: { requests: [{ protocol: "org-iso-mdoc", data: mdocRequest }] } };
const response = await navigator.credentials.get(request);
```
Apple: "The request format is defined in the mdoc request profile in ISO/IEC 18013-7 Annex C"; the encryption info holds a per-request nonce and the recipient public key; the `DeviceRequest` names `docType` `"org.iso.18013.5.1.mDL"` and the namespaced elements; Apple Wallet requires `ReaderAuth` (ISO 18013-5 §9.1.4) signed with a certificate from Apple Business Connect, attached via the RFC 9360 `x5chain` header [[14]](#sources) [[15]](#sources). The `EncryptionInfo` CDDL as published in the EU age-verification profile is `EncryptionInfo = ["dcapi", EncryptionParameters]`, `EncryptionParameters = {"nonce": bstr, "recipientPublicKey": COSE_Key}` [[24]](#sources).

**Response handling.**
- Annex C: the response carries "the sender public key that the document provider app used to encrypt the device response" and "the encrypted device response"; decrypt with HPKE (RFC 9180) using Annex C parameters; the result is an ISO 18013-5 §8.3.2.1.2.3 `DeviceResponse`; validate issuer auth (§9.1.2, chain to an IACA root in your trust store) and device auth (§9.1.3) [[14]](#sources).
- OpenID4VP: `data.response` is the JWE; the payload's `vp_token` maps credential ids to base64url `DeviceResponse` CBOR [[6]](#sources) [[17]](#sources).

**SessionTranscript the wallet signs (needed to verify, and to prove over, the device signature).** OpenID4VP 1.0 (verbatim CDDL) [[6]](#sources):
```
OpenID4VPDCAPIHandover = [ "OpenID4VPDCAPIHandover", OpenID4VPDCAPIHandoverInfoHash ]
OpenID4VPDCAPIHandoverInfoHash = bstr            ; sha-256 of OpenID4VPDCAPIHandoverInfoBytes
OpenID4VPDCAPIHandoverInfoBytes = bstr .cbor OpenID4VPDCAPIHandoverInfo
OpenID4VPDCAPIHandoverInfo = [ origin, nonce, jwkThumbprint ]
origin = tstr   nonce = tstr   jwkThumbprint = bstr
```
Google's page shows the enclosing structure `SessionTranscript = [null, null, ["OpenID4VPDCAPIHandover", <HandoverDataBytes>]]` with the web origin string and "the same nonce that you used to generate credential_request" [[17]](#sources). For Annex C the analogous handover is reported as `SessionTranscript = [null, null, ["dcapi", dcapiInfoHash]]` with `dcapiInfo = [Base64EncryptionInfo, SerializedOrigin]` (the base64url string of the CBOR `EncryptionInfo`, not the raw CBOR, and the ASCII origin) and `dcapiInfoHash = SHA-256(CBOR(dcapiInfo))`; the SessionTranscript is also the HPKE `info` input. This comes from a third-party verifier implementation's README [[37]](#sources), not from the ISO text, so [unverified] until checked against Annex C.

**Origin on Android.** Browsers are privileged callers; a wallet obtains the web origin with `CallingAppInfo.getOrigin(privilegedAppsJson)` and "should consider this a privileged call and set this origin on the OpenID4VP response"; a native app caller gets `android:apk-key-hash:<sha256>` instead [[19]](#sources). On the web the origin the wallet signs is the page origin, so the prover page's hostname is baked into every proof's transcript.

## Status and risks
- **Spec maturity.** W3C Working Draft (not Candidate Recommendation) as of 2026-08-27; editors from Apple, Okta and Google; the API shape changed from the 2024 origin trial (`navigator.identity.get`, `providers`, `request`) to today's `navigator.credentials.get`, `requests`, `data` [[2]](#sources) [[10]](#sources). Mozilla's position is Negative (issue opened 2024-03-21); Chrome's Intent to Ship says "We share most of Mozilla's concerns and continue to work with them" [[25]](#sources) [[11]](#sources). The CG matrix nonetheless lists Firefox presentation on macOS from v149 (via Apple's platform API, Annex C only); MDN's Firefox 149 notes (2026-03-24) do not mention it, and the only corroboration is a vendor blog saying baseline DC API code landed in Firefox 149 behind a preference flag, so [unverified] [[21]](#sources) [[26]](#sources) [[38]](#sources).
- **Chrome.** Shipped 141 for Android same-device and desktop cross-device; Intent to Ship 2025-08-11 with milestones 141/141 [[8]](#sources) [[11]](#sources). Cross-device needs Google Play services 24.0+, uses a QR plus a Bluetooth proximity check and a tunnel server (CTAP 2.2 practices), and at the 2025-04-30 origin trial was "available on Pixel devices" only [[27]](#sources) [[9]](#sources). Chrome does not restrict protocols; both OpenID4VP and Annex C pass through [[21]](#sources).
- **Safari / iOS.** Spec's "Safari iOS 26" is right: Safari 26.0, 2025-09-15, "Safari 26 on macOS 26, iOS 26, and iPadOS 26" (visionOS not named by Apple); only `org-iso-mdoc`; requests from Apple Wallet and "other iOS applications that have registered themselves as an Identity Document Provider" [[12]](#sources). Verify with Wallet on the Web "requires iOS 26 or later on an iPhone 11 or later" [[15]](#sources). iOS "does not currently support presentation from a credential manager on another device", and "Safari and macOS will only allow ISO 18013-7 Annex C requests" [[21]](#sources). Safari 26.4 (2026-03-24) "Fixed `DigitalCredential` behavior to make user mediation implicitly required" [[28]](#sources). WKWebView support is a separate open bug (293646 under meta bug 268516), so in-app browsers on iOS will not work; the flow must land in Safari [[16]](#sources). WebKit closed its OpenID4VP validator bug as WONTFIX on 2025-03-04 [[29]](#sources).
- **Google Wallet.** "Protocols Supported: OpenID4VP (Version 1.0)", ISO mdoc IDs, Android 9+; production needs a Google-signed certificate, an intake form and an end-to-end video, but "You can begin development immediately … using the pre-trusted test keys and sample metadata published on the Sandbox Mode page" (`/wallet/identity/verify/sandbox`, plus `/wallet/identity/verify/create-test-id`) [[17]](#sources). Google's technical section also lists "implementing Zero-Knowledge Proofs" as an integration topic: the request format becomes `mso_mdoc_zk` with a `zk_system_type` of `longfellow-libzk-v1` plus a `circuit_hash`, which confirms spec section 7 ("Google is shipping ZK age proofs inside Wallet") and that the in-wallet prover is longfellow [[17]](#sources). The create-test-ID page describes a passport-derived test ID and does not list `age_over_21` or `expiry_date`, so sandbox coverage of those elements is [unverified] [[17]](#sources).
- **Samsung Wallet.** Named as a Credential Manager holder in Android's 2025-04-30 announcement (with Google Wallet and 1Password) [[30]](#sources); the Chrome shipping post lists "Samsung Wallet (support on the way)" [[9]](#sources); the CG matrix lists SW as reachable from Chrome/Edge cross-device on Android [[21]](#sources). Samsung's own developer docs describe only the proprietary "Verify with Samsung Wallet" (App2App SDK and Web-to-Wallet, ISO 18013-5 data wrapped in JWT/JWE, "Currently, Samsung Wallet does not support Cross-device functionality. This functionality will be added soon.", Android 12+) with no mention of the DC API [[22]](#sources) [[23]](#sources). California mDL landed in Samsung Wallet on 2026-04-30 [[31]](#sources). Whether Samsung Wallet answers a DC API request today: [unverified].
- **Two profiles, two transcripts.** The mDL arrives via Annex C on iOS and via OpenID4VP on Android, with different handover structures and different encryption (HPKE vs JWE). The circuit's device-signature check and the verify service must accept both, or the page must normalise. ISO 18013-7 itself notes HAIP as the intended convergence, "intended to be included in the future revisions" [[20]](#sources).
- **Registered relying party.** Unsigned OpenID4VP requests "depend on the origin information provided by the platform and the web PKI" (HAIP) [[7]](#sources); Apple Wallet and Google Wallet both require verifier certificates from the platform vendor. Neither a static page nor the EEA can present to real wallets without those credentials; this is the M8 gate reality behind spec 6a.
- **Key placement.** In-page decryption keys are unusual; Apple's docs assume server keys [[14]](#sources). Apple's ReaderAuth signing key must stay on the verify service, while the HPKE recipient key is per-session in the page. Need to confirm wallets accept a fresh recipient key per request (Annex C nonce is "generated once per request", so this should be the norm) [[14]](#sources).
- **ISO text is paywalled.** Annex C's normative CDDL is only in the paid TS; the preview confirms Annex C is normative and begins on page 47 [[20]](#sources).
- Confirmed by WebKit's own Safari 26.0 post: the API "currently has an known issue where mixed protocol requests containing both OpenID4VP and ISO 18013-7 (Annex C) protocols may cause an infinite loading spinner on iOS when scanning QR codes from Chrome on macOS during cross-device identity verification flows" [[12]](#sources). A page that wants Chrome-desktop-to-iPhone hand-off must send Annex C alone.
- Chrome 143 origin trial for issuance via `navigator.credentials.create({ digital: { requests: [{ protocol: "openid4vci-v1", data: credentialOffer }] } })`, announced 2025-11-26; not needed for Green Light (we present, we do not issue) [[35]](#sources).

## Open questions for the partner call
- **Apple:** Will Apple Business Connect issue a Verify with Wallet on the Web certificate to a non-profit convener (EEA) rather than a merchant? Is decrypting the Annex C response in the page, with a per-session key, acceptable under their programme terms? Is there any sandbox mDL for Apple Wallet, or only the "developer profile returns mock data" path in spec 6a?
- **Google:** Confirm sandbox test IDs cover `age_over_21` and `expiry_date`; is `openid4vp-v1-unsigned` accepted by Google Wallet at all, or is `openid4vp-v1-signed` with `gw_rp_metadata` mandatory? What does the "Zero-Knowledge Proof" integration section deliver, and does it expose the underlying `DeviceResponse` to the page?
- **Samsung:** Date for DC API / Credential Manager support in Samsung Wallet for US mDLs; will it accept `openid4vp-v1-unsigned`, `org-iso-mdoc`, or both?
- **State DMV / wallet vendor:** Does the state's own wallet app register as an iOS Identity Document Provider and an Android Credential Manager holder?
- **PSE zkID / longfellow / Dyne:** Which `SessionTranscript` handover variants (OpenID4VPDCAPIHandover, Annex C `dcapi`) does the mDoc circuit accept for the device-signature statement, and is the `jwkThumbprint` / `EncryptionInfo` a public input?
- **AAMVA:** Apple and Google both validate against an IACA trust store on the verifier side; can the VICAL root be published in a form both vendors' sandboxes accept?
- **ISO/OIDF liaison (via PSE):** Timeline for the HAIP appendix in the next 18013-7 revision, which would let the page ship one profile.

## Sources
1. https://w3c-fedid.github.io/digital-credentials/ — Editor's Draft 27 Aug 2026 (fetched 2026-09-01)
2. https://www.w3.org/TR/digital-credentials/ → https://www.w3.org/TR/2026/WD-digital-credentials-20260827/ (2026-09-01)
3. https://github.com/w3c-fedid/digital-credentials (2026-09-01)
4. https://raw.githubusercontent.com/w3c-fedid/digital-credentials/main/LICENSE.md (2026-09-01)
5. https://api.github.com/repos/w3c-fedid/digital-credentials/commits?per_page=1 (2026-09-01)
6. https://openid.net/specs/openid-4-verifiable-presentations-1_0-final.html (2026-09-01)
7. https://openid.net/specs/openid4vc-high-assurance-interoperability-profile-1_0-final.html (2026-09-01)
8. https://developer.chrome.com/release-notes/141 (2026-09-01)
9. https://developer.chrome.com/blog/digital-credentials-api-shipped — 2025-10-03 (2026-09-01)
10. https://developer.chrome.com/blog/digital-credentials-api-origin-trial — 2024-09-04 (2026-09-01)
11. https://www.mail-archive.com/blink-dev@chromium.org/msg14377.html — Intent to Ship, 2025-08-11 (2026-09-01)
12. https://webkit.org/blog/17333/webkit-features-in-safari-26-0/ (2026-09-01)
13. https://webkit.org/blog/17431/online-identity-verification-with-the-digital-credentials-api/ — 2025-10-03 (2026-09-01)
14. https://developer.apple.com/documentation/IdentityDocumentServices/Requesting-a-mobile-document-on-the-web (JSON data endpoint, 2026-09-01)
15. https://support.apple.com/guide/business/prepare-set-verify-wallet-web-abcb17bcda04/web (2026-09-01); also https://developer.apple.com/videos/play/wwdc2025/232/ (2026-09-01)
16. https://bugs.webkit.org/show_bug.cgi?id=268516 (2026-09-01)
17. https://developers.google.com/wallet/identity/verify/accepting-ids-from-wallet-online — last updated 2026-06-29 (2026-09-01)
18. https://developer.android.com/identity/digital-credentials/credential-verifier (2026-09-01); overview https://developer.android.com/identity/digital-credentials (2026-09-01)
19. https://developer.android.com/identity/digital-credentials/credential-holder/credential-holder (2026-09-01)
20. https://cdn.standards.iteh.ai/samples/91154/d537bc129f34476aa42a8a0c5b522f2f/ISO-IEC-DTS-18013-7.pdf — DTS preview, 14 pages (2026-09-01); https://www.iso.org/standard/91154.html returned a bot-check page (2026-09-01)
21. https://digitalcredentials.dev/ecosystem-support (2026-09-01); https://digitalcredentials.dev/ (2026-09-01)
22. https://developer.samsung.com/wallet/verifywithsamsungwallet.html (2026-09-01)
23. https://developer.samsung.com/wallet/api_new/verifywith/spec.html (2026-09-01)
24. https://ageverification.dev/Technical%20Specification/annexes/annex-A/annex-A-av-profile (2026-09-01)
25. https://github.com/mozilla/standards-positions/issues/1003 (2026-09-01)
26. https://developer.mozilla.org/en-US/docs/Mozilla/Firefox/Releases/149 (2026-09-01)
27. https://developer.chrome.com/blog/digital-credentials-cross-device-ot — 2025-04-30 (2026-09-01)
28. https://webkit.org/blog/17862/webkit-features-for-safari-26-4/ — 2026-03-24 (2026-09-01)
29. https://bugs.webkit.org/show_bug.cgi?id=278442 (2026-09-01)
30. https://android-developers.googleblog.com/2025/04/announcing-android-support-of-digital-credentials.html — 2025-04-30 (2026-09-01)
31. https://www.prnewswire.com/news-releases/idemia-public-security-supports-samsung-wallet-launch-of-california-mobile-id-302759180.html — 2026-04-30 (2026-09-01)
32. https://www.nist.gov/blogs/cybersecurity-insights/verifiable-digital-credential-presentment — 2026-06-30 (2026-09-01)
33. https://github.com/eu-digital-identity-wallet/av-lib-ios-w3c-dc-api — Apache-2.0 Swift Annex C library (2026-09-01)
34. https://learn.mattr.global/docs/verification/remote-web-verifiers/dc-api/overview (2026-09-01)
35. https://developer.chrome.com/blog/digital-credentials-api-143-issuance-ot — 2025-11-26 (2026-09-02)
36. https://bsmd.moic.gov.bh/store/standards/iso:pub:std:IS:91154/ISO-IEC%20TS%2018013-7:2025?lang=en — ISO/IEC TS 18013-7:2025, published 29 May 2025, 42 pages (2026-09-02); also https://dps.gov.al/en/project/show/dps:proj:77641 (2026-09-02)
37. https://github.com/zkarmoy/dc-api-verifier — third-party README stating the Annex C `dcapi` SessionTranscript (2026-09-02)
38. https://www.corbado.com/blog/digital-credentials-api — vendor blog, updated 2026-03-26, on Firefox 149 (2026-09-02)

## Verification
_Checked 2026-09-02 by a second pass. 91 claims checked (34 source URLs fetched, all resolved except iso.org which still returns a bot-check/403; the GitHub commits API was rate-limited for anonymous calls and was confirmed through the authenticated `gh` CLI instead). The W3C Editor's Draft and Working Draft dates, editors, five protocol identifiers, section numbers, Chrome 141 date/tracking bug/ChromeStatus id, Intent-to-Ship date and quote, Safari 26.0 and 26.4 dates and quotes, WebKit bugs 268516/293646/278442, Apple's page text (including the decoded sample `DeviceRequest`, which does name `org.iso.18013.5.1.mDL`, `age_over_21` and a `readerAuthAll` test certificate), Apple Business guide, WWDC 232, OpenID4VP 1.0 and HAIP 1.0 dates and quotes, the handover CDDL, Google Wallet page text and date, Android verifier/holder pages, the CG matrix, Samsung docs, the EU AV profile CDDL, Mozilla issue, MDN Firefox 149, the cross-device OT post, the Android announcement, the IDEMIA release, the NIST post, the EU Swift library, the ISO DTS preview (14 pages, Annex C on page 47, HAIP note) and the repo stats/commit all matched._

Corrections made:
- Safari platform list: Apple's posts name macOS 26, iOS 26 and iPadOS 26 for the Digital Credentials API; visionOS 26 was removed from the "shipped on" list (lines in "What it is" and "Safari / iOS").
- Samsung cross-device quote replaced with the actual sentence: "Currently, Samsung Wallet does not support Cross-device functionality. This functionality will be added soon."
- Google Wallet `vp_token` description: the page does not contain the phrase "base64url-encoded CBOR-formatted Device Response"; replaced with the page's actual placeholder and its clause-9 validation sentence.
- Mixed OpenID4VP + Annex C spinner: this is documented in WebKit's own Safari 26.0 post, not only a third-party blog; [unverified] removed and quote added.
- Chrome 143 issuance origin trial: confirmed from the Chrome blog (2025-11-26, `navigator.credentials.create()`, `openid4vci-v1`); [unverified] removed, source 35 added.
- ISO/IEC TS 18013-7:2025 publication: confirmed as May 2025 (29 May 2025, 42 pages) via two national catalogue mirrors; source 36 added. iso.org itself remains unfetchable.
- Annex C `dcapi` handover: `dcapiInfo` is `[Base64EncryptionInfo, SerializedOrigin]` (base64url string, not raw CBOR) per a third-party implementation; wording corrected, still [unverified] against ISO text; source 37 added.
- Google "Zero-Knowledge Proof" wording corrected to "Proofs" and expanded with the page's `mso_mdoc_zk` / `longfellow-libzk-v1` / `circuit_hash` details.
- Mozilla row: added that issue #1003 is closed with the Negative position recorded.
- Firefox 149: added the vendor-blog corroboration (behind a preference flag); left [unverified] because no Mozilla source states it. Source 38 added.

Left unverified:
- OpenID Foundation IPR/licence terms for OpenID4VP 1.0 and HAIP 1.0 (not checked).
- Firefox 149 Digital Credentials support on macOS (CG matrix and a vendor blog only; no Mozilla source).
- Annex C `dcapi` SessionTranscript structure against the paywalled ISO/IEC TS 18013-7:2025 text.
- Whether Samsung Wallet answers a Digital Credentials API request today (Samsung's own docs describe only the proprietary path).
- Whether Google Wallet's sandbox test ID carries `age_over_21` and `expiry_date` (the create-test-ID page describes a passport-derived test ID without listing elements).
- https://www.iso.org/standard/91154.html content (bot check / 403 on every attempt).

