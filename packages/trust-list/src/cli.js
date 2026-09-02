// Copyright 2026 Green Light contributors. Apache-2.0.
// Build a root from a directory of DER/PEM issuer certs. Synthetic VICAL until AAMVA access (ADR-0003).
// Usage: node src/cli.js <certs-dir> > root.txt
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { buildTree } from './merkle.js';

const dir = process.argv[2];
if (!dir) { console.error('usage: cli.js <certs-dir>'); process.exit(2); }
const ders = readdirSync(dir).filter(f => /\.(der|pem|crt)$/.test(f)).sort().map(f => {
  const raw = readFileSync(join(dir, f));
  const txt = raw.toString('utf8');
  if (txt.includes('-----BEGIN CERTIFICATE-----')) {
    const b64 = txt.replace(/-----[A-Z ]+-----/g, '').replace(/\s+/g, '');
    return Buffer.from(b64, 'base64');
  }
  return raw;
});
process.stdout.write(buildTree(ders).root + '\n');
