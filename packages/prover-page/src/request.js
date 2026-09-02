// Copyright 2026 Green Light contributors. Apache-2.0.
// The Digital Credentials API request. Exactly age_over_21 and expiry_date. Test D6.
// PLACEHOLDER ENVELOPE. The real shapes differ per platform and are built in M3:
//   Safari: ISO 18013-7 Annex C (base64url CBOR DeviceRequest + encryptionInfo), protocol 'org-iso-mdoc'
//   Chrome/Google Wallet: OpenID4VP 'openid4vp-v1-signed', DCQL query, response_mode 'dc_api.jwt'
// See docs/components/digital-credentials-api.md. Only REQUESTED_ELEMENTS is authoritative.
export const DOC_TYPE = 'org.iso.18013.5.1.mDL';
export const NAMESPACE = 'org.iso.18013.5.1';
export const REQUESTED_ELEMENTS = Object.freeze(['age_over_21', 'expiry_date']);

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
