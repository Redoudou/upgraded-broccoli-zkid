// Copyright 2026 Green Light contributors. Apache-2.0.
// The Digital Credentials API request. Exactly age_over_21 and expiry_date. Test D6.
export const DOC_TYPE = 'org.iso.18013.5.1.mDL';
export const NAMESPACE = 'org.iso.18013.5.1';
export const REQUESTED_ELEMENTS = Object.freeze(['age_over_21', 'expiry_date']);

export function buildRequest(nonce) {
  return {
    digital: {
      requests: [{
        protocol: 'org-iso-mdoc',           // pinned per platform in M3 (Chrome/Android now, Safari iOS 26)
        data: {
          nonce,
          docType: DOC_TYPE,
          elements: REQUESTED_ELEMENTS.map(el => ({ namespace: NAMESPACE, name: el, intentToRetain: false })),
        },
      }],
    },
  };
}
