// Copyright 2026 Green Light contributors. Apache-2.0.
// Loader for longfellow.wasm (C-ABI wrapper over Google longfellow-zk). Runs in browsers and Node.
// Public API: const lf = await loadLongfellow(wasmBytesOrModule); lf.prove({...}); lf.verify({...}).
const te = new TextEncoder();
const u16 = n => new Uint8Array([n & 255, n >> 8]);

export function encodeAttrs(attrs) {
  // repeated [u16 ns_len][ns][u16 id_len][id][u16 val_len][cbor value]
  const parts = [];
  for (const { namespace, id, cbor } of attrs) {
    for (const b of [te.encode(namespace), te.encode(id), cbor]) { parts.push(u16(b.length), b); }
  }
  return concat(parts);
}
export function concat(parts) {
  const out = new Uint8Array(parts.reduce((n, p) => n + p.length, 0)); let o = 0;
  for (const p of parts) { out.set(p, o); o += p.length; } return out;
}

export async function loadLongfellow(source, { random } = {}) {
  const getRandom = random ?? (buf => globalThis.crypto.getRandomValues(buf));
  let mem;
  const env = {
    gl_random_bytes(ptr, len) {
      // Fill in <=64 KiB chunks: getRandomValues caps at 65536 bytes per call.
      for (let o = 0; o < len; o += 65536) getRandom(new Uint8Array(mem.buffer, ptr + o, Math.min(65536, len - o)));
    },
  };
  const { instance } = source instanceof WebAssembly.Module
    ? { instance: await WebAssembly.instantiate(source, { env }) }
    : await WebAssembly.instantiate(source, { env });
  const x = instance.exports; mem = x.memory;

  const put = bytes => { const p = x.gl_alloc(bytes.length); new Uint8Array(mem.buffer, p, bytes.length).set(bytes); return [p, bytes.length]; };
  const str = s => put(te.encode(s));
  const scratch = () => x.gl_alloc(8);

  function withArgs(fn) {
    const allocs = [];
    const arg = b => { const a = put(b); allocs.push(a); return a; };
    try { return fn(arg); } finally { for (const [p, n] of allocs) x.gl_free(p, n); }
  }

  return {
    exports: x,
    /** Returns Uint8Array proof. Throws Error with .code (longfellow MdocProverErrorCode) on failure. */
    prove({ circuit, mdoc, pkx, pky, transcript, attrs, now, docType = 'org.iso.18013.5.1.mDL' }) {
      return withArgs(arg => {
        const outPtr = scratch(), outLen = scratch();
        const rc = x.gl_prove(...arg(circuit), ...arg(mdoc), ...arg(te.encode(pkx)), ...arg(te.encode(pky)),
          ...arg(transcript), ...arg(encodeAttrs(attrs)), ...arg(te.encode(now)), ...arg(te.encode(docType)), outPtr, outLen);
        const dv = new DataView(mem.buffer);
        const p = dv.getUint32(outPtr, true), n = dv.getUint32(outLen, true);
        x.gl_free(outPtr, 8); x.gl_free(outLen, 8);
        if (rc !== 0) { const e = new Error(`longfellow prover error ${rc}`); e.code = rc; throw e; }
        const proof = new Uint8Array(mem.buffer, p, n).slice(); x.gl_free(p, n); return proof;
      });
    },
    /** Returns 0 when valid, else the longfellow MdocVerifierErrorCode. Never throws on bad proofs. */
    verify({ circuit, pkx, pky, transcript, attrs, now, docType = 'org.iso.18013.5.1.mDL', proof }) {
      return withArgs(arg => x.gl_verify(...arg(circuit), ...arg(te.encode(pkx)), ...arg(te.encode(pky)),
        ...arg(transcript), ...arg(encodeAttrs(attrs)), ...arg(te.encode(now)), ...arg(te.encode(docType)), ...arg(proof)));
    },
  };
}
