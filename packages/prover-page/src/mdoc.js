// Copyright 2026 Green Light contributors. Apache-2.0.
// The few CBOR shapes the test wallet must produce at presentation time. Byte-for-byte the same as
// scripts/gen-test-mdl.js (test D10 asserts it): SessionTranscript, DeviceAuthentication Sig_structure,
// and the DeviceResponse assembled from the issued prefix/suffix plus the fresh device signature.
export const DOC_TYPE = 'org.iso.18013.5.1.mDL';
const te = new TextEncoder();
export const hex = s => Uint8Array.from(s.match(/../g) ?? [], h => parseInt(h, 16));
export function b64(bytes) {   // chunked: a 340 KB proof spread into one call overflows the stack
  let s = ''; for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000)); return btoa(s);
}
export const b64urlToBytes = s => Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0));
export function cat(...parts) {
  const out = new Uint8Array(parts.reduce((n, p) => n + p.length, 0)); let o = 0;
  for (const p of parts) { out.set(p, o); o += p.length; } return out;
}
const head = (major, n) => n < 24 ? Uint8Array.of((major << 5) | n) : n < 256 ? Uint8Array.of((major << 5) | 24, n) : Uint8Array.of((major << 5) | 25, n >> 8, n & 255);
export const bstr = b => cat(head(2, b.length), b);
export const tstr = s => { const b = te.encode(s); return cat(head(3, b.length), b); };
const tag24 = b => cat(Uint8Array.of(0xd8, 0x18), bstr(b));
const PROTECTED_ES256 = Uint8Array.of(0x43, 0xa1, 0x01, 0x26);

// [null, null, ["GreenLightHandoverv1", nonce]]
export function sessionTranscript(nonce16) {
  return cat(Uint8Array.of(0x83, 0xf6, 0xf6, 0x82), tstr('GreenLightHandoverv1'), bstr(nonce16));
}
// Sig_structure = ["Signature1", protected, h'', payload]
export const sigStructure = payload => cat(Uint8Array.of(0x84), tstr('Signature1'), PROTECTED_ES256, Uint8Array.of(0x40), bstr(payload));
// DeviceAuthentication = ["DeviceAuthentication", SessionTranscript, docType, tag24(<<{}>>)]
export function deviceAuthToSign(transcript, docType = DOC_TYPE) {
  return sigStructure(tag24(cat(Uint8Array.of(0x84), tstr('DeviceAuthentication'), transcript, tstr(docType), Uint8Array.of(0xd8, 0x18, 0x41, 0xa0))));
}
export function assembleDeviceResponse(prefixHex, deviceSig64, suffixHex) {
  return cat(hex(prefixHex), bstr(deviceSig64), hex(suffixHex));
}
