// Copyright 2026 Green Light contributors. Apache-2.0.
// SessionTranscript = [null, null, ["GreenLightHandoverv1", nonce]] as deterministic CBOR. The device
// key signs it (via DeviceAuthentication) and it seeds the proof's Fiat-Shamir oracle, so a proof is
// bound to one session. Must match packages/prover-page/src/mdoc.js byte for byte (test A11).
export function sessionTranscript(nonceB64url) {
  const nonce = Buffer.from(nonceB64url, 'base64url');
  if (nonce.length !== 16) throw new Error('nonce must be 16 bytes');
  const handover = Buffer.from('GreenLightHandoverv1', 'utf8');
  return Buffer.concat([Buffer.from([0x83, 0xf6, 0xf6, 0x82, 0x60 | handover.length]), handover, Buffer.from([0x50]), nonce]);
}
