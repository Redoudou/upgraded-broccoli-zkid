// Copyright 2026 Green Light contributors. Apache-2.0.
// Issues the TEST mDL: an ISO 18013-5 IssuerSigned structure (MSO in a COSE_Sign1) signed by the
// test DMV's document-signer key, plus a device key for the test wallet. Never a real credential.
// The byte layout follows what longfellow-zk's mdoc parser accepts (deterministic CBOR, tag-24
// wrapped MSO with a 2-byte length, deviceKey as {1:2,-1:1,-2:x,-3:y}, tdate validity, one namespace).
// Usage: node scripts/gen-test-mdl.js <ds-key.pem> <ds-cert.pem> <out.json>
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash, createPrivateKey, generateKeyPairSync, randomBytes, sign, X509Certificate } from 'node:crypto';
import { pathToFileURL } from 'node:url';

// --- minimal deterministic CBOR encoder --------------------------------------------------------
const hdr = (major, n) => {
  if (n < 24) return Uint8Array.of((major << 5) | n);
  if (n < 0x100) return Uint8Array.of((major << 5) | 24, n);
  if (n < 0x10000) return Uint8Array.of((major << 5) | 25, n >> 8, n & 255);
  return Uint8Array.of((major << 5) | 26, (n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255);
};
const cat = (...parts) => Buffer.concat(parts.map(p => Buffer.from(p)));
export const cbor = {
  uint: n => hdr(0, n),
  nint: n => hdr(1, -1 - n),                 // n negative
  bstr: b => cat(hdr(2, b.length), b),
  tstr: s => { const b = Buffer.from(s, 'utf8'); return cat(hdr(3, b.length), b); },
  array: items => cat(hdr(4, items.length), ...items),
  map: entries => cat(hdr(5, entries.length), ...entries.flat()),   // entries: [[keyBytes, valueBytes], ...] in order
  tag: (t, inner) => cat(hdr(6, t), inner),
  true: Uint8Array.of(0xf5), false: Uint8Array.of(0xf4), null: Uint8Array.of(0xf6),
  tdate: s => cat(hdr(6, 0), cbor.tstr(s)),            // tag 0 + "YYYY-MM-DDTHH:MM:SSZ"
  fulldate: s => cat(hdr(6, 1004), cbor.tstr(s)),      // tag 1004 + "YYYY-MM-DD"
};
const tag24 = bytes => cbor.tag(24, cbor.bstr(bytes));
const sha256 = b => createHash('sha256').update(b).digest();
const iso = d => d.toISOString().slice(0, 19) + 'Z';

export const DOC_TYPE = 'org.iso.18013.5.1.mDL';
export const NAMESPACE = 'org.iso.18013.5.1';
const PROTECTED_ES256 = cbor.bstr(cbor.map([[cbor.uint(1), cbor.nint(-7)]]));   // 43 a1 01 26

// Sig_structure for COSE_Sign1 with ES256 and no external AAD: ["Signature1", protected, h'', payload]
export const sigStructure = payload => cat(cbor.array([cbor.tstr('Signature1'), PROTECTED_ES256, cbor.bstr(new Uint8Array(0)), cbor.bstr(payload)]));
const es256 = (keyObj, msg) => sign('sha256', msg, { key: keyObj, dsaEncoding: 'ieee-p1363' });   // raw r||s, 64 bytes

// --- issue --------------------------------------------------------------------------------------
export function issueTestMdl({ dsKeyPem, dsCertPem, now = new Date(), claims }) {
  const dsKey = createPrivateKey(dsKeyPem);
  const dsCert = new X509Certificate(dsCertPem);
  const dsJwk = dsCert.publicKey.export({ format: 'jwk' });
  const coord = b64 => '0x' + Buffer.from(b64, 'base64url').toString('hex');

  // Device key: the test wallet holds this and signs the session transcript at presentation time.
  const dev = generateKeyPairSync('ec', { namedCurve: 'P-256' });
  const devJwk = dev.privateKey.export({ format: 'jwk' });
  const devX = Buffer.from(devJwk.x, 'base64url'), devY = Buffer.from(devJwk.y, 'base64url');

  // IssuerSignedItems: {digestID, random, elementIdentifier, elementValue}, each tag-24 wrapped.
  const items = claims.map((c, digestID) => ({
    id: c.id,
    valueCbor: c.value,
    bytes: tag24(cbor.map([
      [cbor.tstr('digestID'), cbor.uint(digestID)],
      [cbor.tstr('random'), cbor.bstr(randomBytes(32))],
      [cbor.tstr('elementIdentifier'), cbor.tstr(c.id)],
      [cbor.tstr('elementValue'), c.value],
    ])),
  }));

  const validFrom = new Date(now); validFrom.setUTCMilliseconds(0);
  const validUntil = new Date(validFrom); validUntil.setUTCFullYear(validUntil.getUTCFullYear() + 5);
  const mso = cbor.map([
    [cbor.tstr('version'), cbor.tstr('1.0')],
    [cbor.tstr('digestAlgorithm'), cbor.tstr('SHA-256')],
    [cbor.tstr('docType'), cbor.tstr(DOC_TYPE)],
    [cbor.tstr('valueDigests'), cbor.map([[cbor.tstr(NAMESPACE), cbor.map(items.map((it, i) => [cbor.uint(i), cbor.bstr(sha256(it.bytes))]))]])],
    [cbor.tstr('deviceKeyInfo'), cbor.map([[cbor.tstr('deviceKey'), cbor.map([
      [cbor.uint(1), cbor.uint(2)], [cbor.nint(-1), cbor.uint(1)], [cbor.nint(-2), cbor.bstr(devX)], [cbor.nint(-3), cbor.bstr(devY)],
    ])]])],
    [cbor.tstr('validityInfo'), cbor.map([
      [cbor.tstr('signed'), cbor.tdate(iso(validFrom))],
      [cbor.tstr('validFrom'), cbor.tdate(iso(validFrom))],
      [cbor.tstr('validUntil'), cbor.tdate(iso(validUntil))],
    ])],
  ]);
  if (mso.length < 256) throw new Error('MSO map under 256 bytes; longfellow expects a 2-byte length');
  const msoBytes = tag24(mso);                                   // d8 18 59 LL LL <map>
  const issuerSig = es256(dsKey, sigStructure(msoBytes));
  const issuerAuth = cbor.array([
    PROTECTED_ES256,
    cbor.map([[cbor.uint(33), cbor.bstr(dsCert.raw)]]),          // x5chain: the DS certificate
    cbor.bstr(msoBytes),
    cbor.bstr(issuerSig),
  ]);
  const issuerSigned = cbor.map([
    [cbor.tstr('nameSpaces'), cbor.map([[cbor.tstr(NAMESPACE), cbor.array(items.map(it => it.bytes))]])],
    [cbor.tstr('issuerAuth'), issuerAuth],
  ]);

  // DeviceResponse template: everything except the 64-byte device signature, which the wallet
  // produces per session. prefix + 58 40 + sig + suffix is a complete DeviceResponse.
  const deviceSignedHead = cat(
    cbor.tstr('deviceSigned'), hdr(5, 2),
    cbor.tstr('nameSpaces'), tag24(cbor.map([])),
    cbor.tstr('deviceAuth'), hdr(5, 1), cbor.tstr('deviceSignature'),
    hdr(4, 4), PROTECTED_ES256, cbor.map([]), cbor.null,
  );
  const prefix = cat(hdr(5, 3), cbor.tstr('version'), cbor.tstr('1.0'), cbor.tstr('documents'), hdr(4, 1),
    hdr(5, 3), cbor.tstr('docType'), cbor.tstr(DOC_TYPE), cbor.tstr('issuerSigned'), issuerSigned, deviceSignedHead);
  const suffix = cat(cbor.tstr('status'), cbor.uint(0));

  return {
    note: 'TEST credential issued by the Green Light test DMV. Not a real license. Contains a test device private key on purpose.',
    docType: DOC_TYPE, namespace: NAMESPACE,
    claims: Object.fromEntries(claims.map(c => [c.id, c.display])),
    attributes: claims.filter(c => c.prove).map(c => ({ id: c.id, cbor_hex: Buffer.from(c.value).toString('hex') })),
    validity: { validFrom: iso(validFrom), validUntil: iso(validUntil) },
    issuer: { subject: dsCert.subject.replace(/\n/g, ', '), pkx: coord(dsJwk.x), pky: coord(dsJwk.y), ds_cert_der_b64: dsCert.raw.toString('base64') },
    device_key_jwk: devJwk,
    device_response_prefix_hex: prefix.toString('hex'),
    device_response_suffix_hex: suffix.toString('hex'),
  };
}

// Session transcript shared with the prover page and verify service: [null, null, ["GreenLightHandoverv1", nonce]].
export function sessionTranscript(nonceBytes) {
  return cat(cbor.array([cbor.null, cbor.null, cbor.array([cbor.tstr('GreenLightHandoverv1'), cbor.bstr(nonceBytes)])]));
}

// DeviceAuthentication = ["DeviceAuthentication", SessionTranscript, docType, DeviceNameSpacesBytes]; the device
// signs Sig_structure over tag24(bstr(DeviceAuthentication)).
export function deviceAuthToSign(transcript, docType = DOC_TYPE) {
  const da = cat(hdr(4, 4), cbor.tstr('DeviceAuthentication'), transcript, cbor.tstr(docType), tag24(cbor.map([])));
  return sigStructure(tag24(da));
}

export function assembleDeviceResponse(mdl, deviceSig64) {
  return cat(Buffer.from(mdl.device_response_prefix_hex, 'hex'), cbor.bstr(deviceSig64), Buffer.from(mdl.device_response_suffix_hex, 'hex'));
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const [dsKeyPath, dsCertPath, outPath] = process.argv.slice(2);
  if (!outPath) { console.error('usage: gen-test-mdl.js <ds-key.pem> <ds-cert.pem> <out.json>'); process.exit(2); }
  const mdl = issueTestMdl({
    dsKeyPem: readFileSync(dsKeyPath), dsCertPem: readFileSync(dsCertPath),
    claims: [
      { id: 'age_over_21', value: cbor.true, display: true, prove: true },
      { id: 'expiry_date', value: cbor.fulldate('2031-01-01'), display: '2031-01-01', prove: false },
    ],
  });
  writeFileSync(outPath, JSON.stringify(mdl, null, 1) + '\n');
  console.log(`test mDL:      ${outPath} (issuer ${mdl.issuer.subject})`);
}
