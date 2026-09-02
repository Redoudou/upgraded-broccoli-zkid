// Copyright 2026 Green Light contributors. Apache-2.0.
// Synthetic VICAL: a directory of issuer (IACA) certificates in PEM or DER. Real VICAL parsing is M5.
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

export function pemToDer(text) {
  const b64 = text.replace(/-----[A-Z ]+-----/g, '').replace(/\s+/g, '');
  return Buffer.from(b64, 'base64');
}

// Returns [{ name, der }] sorted by file name; PEM files are converted to DER.
export function loadCertsDir(dir) {
  return readdirSync(dir).filter(f => /\.(der|pem|crt)$/.test(f)).sort().map(name => {
    const raw = readFileSync(join(dir, name));
    const der = raw.toString('utf8').includes('-----BEGIN CERTIFICATE-----') ? pemToDer(raw.toString('utf8')) : raw;
    return { name, der };
  });
}
