// Copyright 2026 Green Light contributors. Apache-2.0.
//! Thin C-ABI wrapper around Google longfellow-zk's mdoc prover/verifier so one .wasm
//! serves the prover page (browser) and the verify service (Node). No wasm-bindgen.
use mdoc_zk_runtime::{run_mdoc_prover, run_mdoc_verifier, RequestedAttribute, CURRENT_ZK_SPECS};
use std::slice;

// getrandom custom backend: the host supplies entropy (crypto.getRandomValues).
#[cfg(target_arch = "wasm32")]
extern "C" { fn gl_random_bytes(ptr: *mut u8, len: usize); }
#[cfg(target_arch = "wasm32")]
#[no_mangle]
unsafe extern "Rust" fn __getrandom_v03_custom(dest: *mut u8, len: usize) -> Result<(), getrandom::Error> {
    gl_random_bytes(dest, len);
    Ok(())
}

#[no_mangle]
pub extern "C" fn gl_alloc(len: usize) -> *mut u8 {
    let mut v = Vec::<u8>::with_capacity(len.max(1));
    let p = v.as_mut_ptr();
    std::mem::forget(v);
    p
}
#[no_mangle]
pub unsafe extern "C" fn gl_free(ptr: *mut u8, len: usize) {
    if !ptr.is_null() { drop(Vec::from_raw_parts(ptr, 0, len.max(1))); }
}

unsafe fn bytes<'a>(p: *const u8, n: usize) -> &'a [u8] { if n == 0 { &[] } else { slice::from_raw_parts(p, n) } }
unsafe fn text<'a>(p: *const u8, n: usize) -> &'a str { std::str::from_utf8(bytes(p, n)).unwrap_or("") }

/// Attributes are passed as one buffer: repeated [u16 ns_len][ns][u16 id_len][id][u16 val_len][val].
fn parse_attrs(buf: &[u8]) -> Option<Vec<RequestedAttribute>> {
    let mut out = Vec::new(); let mut i = 0;
    let mut take = |i: &mut usize| -> Option<Vec<u8>> {
        if *i + 2 > buf.len() { return None; }
        let n = u16::from_le_bytes([buf[*i], buf[*i + 1]]) as usize; *i += 2;
        if *i + n > buf.len() { return None; }
        let v = buf[*i..*i + n].to_vec(); *i += n; Some(v)
    };
    while i < buf.len() {
        let namespace_id = take(&mut i)?; let id = take(&mut i)?; let cbor_value = take(&mut i)?;
        out.push(RequestedAttribute { namespace_id, id, cbor_value });
    }
    Some(out)
}

/// Returns 0 on success; the proof is written to *out_ptr/*out_len (caller frees with gl_free).
#[no_mangle]
pub unsafe extern "C" fn gl_prove(
    circuit: *const u8, circuit_len: usize,
    mdoc: *const u8, mdoc_len: usize,
    pkx: *const u8, pkx_len: usize, pky: *const u8, pky_len: usize,
    transcript: *const u8, transcript_len: usize,
    attrs: *const u8, attrs_len: usize,
    now: *const u8, now_len: usize,
    doc_type: *const u8, doc_type_len: usize,
    out_ptr: *mut *mut u8, out_len: *mut usize,
) -> i32 {
    let Some(attrs) = parse_attrs(bytes(attrs, attrs_len)) else { return -1 };
    let Some(spec) = CURRENT_ZK_SPECS.iter().find(|s| s.num_attributes == attrs.len()) else { return -2 };
    match run_mdoc_prover(spec, bytes(circuit, circuit_len), bytes(mdoc, mdoc_len),
        text(pkx, pkx_len), text(pky, pky_len), bytes(transcript, transcript_len), &attrs,
        text(now, now_len), text(doc_type, doc_type_len)) {
        Ok(proof) => {
            let mut v = proof; v.shrink_to_fit();
            *out_len = v.len(); *out_ptr = v.as_mut_ptr(); std::mem::forget(v); 0
        }
        Err(e) => e as i32,
    }
}

/// Returns 0 when the proof verifies; a positive longfellow error code otherwise.
#[no_mangle]
pub unsafe extern "C" fn gl_verify(
    circuit: *const u8, circuit_len: usize,
    pkx: *const u8, pkx_len: usize, pky: *const u8, pky_len: usize,
    transcript: *const u8, transcript_len: usize,
    attrs: *const u8, attrs_len: usize,
    now: *const u8, now_len: usize,
    doc_type: *const u8, doc_type_len: usize,
    proof: *const u8, proof_len: usize,
) -> i32 {
    let Some(attrs) = parse_attrs(bytes(attrs, attrs_len)) else { return -1 };
    let Some(spec) = CURRENT_ZK_SPECS.iter().find(|s| s.num_attributes == attrs.len()) else { return -2 };
    match run_mdoc_verifier(spec, bytes(circuit, circuit_len), text(pkx, pkx_len), text(pky, pky_len),
        bytes(transcript, transcript_len), &attrs, text(now, now_len), text(doc_type, doc_type_len),
        bytes(proof, proof_len)) {
        Ok(()) => 0,
        Err(e) => e as i32,
    }
}

/// Generate the compressed current-version circuit for `nattrs` attributes (native helper).
#[no_mangle]
pub unsafe extern "C" fn gl_circuit(nattrs: usize, out_ptr: *mut *mut u8, out_len: *mut usize) -> i32 {
    match mdoc_zk_runtime::provider::materialize(mdoc_zk_runtime::CURRENT_VERSION, nattrs) {
        Ok(p) => { let mut v = p.compressed; v.shrink_to_fit(); *out_len = v.len(); *out_ptr = v.as_mut_ptr(); std::mem::forget(v); 0 }
        Err(e) => e as i32,
    }
}
