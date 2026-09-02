// Copyright 2026 Green Light contributors. Apache-2.0.
// The Digital Credentials API request the page will make once a relying-party registration exists (M3).
// Exactly one element: age_over_21. "License valid" is the MSO validity window, which the longfellow
// circuit checks against the verifier's date; expiry_date would be disclosed in the clear, so it is not requested.
// PLACEHOLDER ENVELOPE. Per-platform shapes (Safari ISO 18013-7 Annex C, Chrome OpenID4VP) land in M3;
// only REQUESTED_ELEMENTS is authoritative. Test D6.
export const DOC_TYPE = 'org.iso.18013.5.1.mDL';
export const NAMESPACE = 'org.iso.18013.5.1';
export const REQUESTED_ELEMENTS = Object.freeze(['age_over_21']);

export function buildRequest(nonce) {
  return {
    digital: {
      requests: [{
        protocol: 'org-iso-mdoc',           // placeholder; per-platform envelope lands in M3
        data: {
          nonce,
          docType: DOC_TYPE,
          elements: REQUESTED_ELEMENTS.map(el => ({ namespace: NAMESPACE, name: el, intentToRetain: false })),
        },
      }],
    },
  };
}
