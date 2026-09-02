// Copyright 2026 Green Light contributors. Apache-2.0.
//! Native helper CLI: `lf circuit <nattrs> <out>` writes the compressed current-version circuit;
//! `lf prove`/`lf verify` mirror the wasm exports for tests. Hex/strings via args, bytes via files.
use std::{env, fs, process::exit};
fn main() {
    let a: Vec<String> = env::args().collect();
    match a.get(1).map(String::as_str) {
        Some("circuit") => {
            let n: usize = a[2].parse().unwrap();
            let p = mdoc_zk_runtime::provider::materialize(mdoc_zk_runtime::CURRENT_VERSION, n).expect("materialize");
            fs::write(&a[3], &p.compressed).unwrap();
            println!("{} {} bytes (compressed), spec {}", a[3], p.compressed.len(), p.name);
        }
        Some("prove") => {
            // lf prove <circuit> <mdoc> <pkx> <pky> <transcript> <now> <doc_type> <ns> <id> <cbor_value_hex> <out>
            let circuit = fs::read(&a[2]).unwrap(); let mdoc = fs::read(&a[3]).unwrap();
            let tr = fs::read(&a[6]).unwrap();
            let attrs = vec![mdoc_zk_runtime::req_attr(a[9].as_bytes(), a[10].as_bytes(), hex(&a[11]))];
            let spec = mdoc_zk_runtime::CURRENT_ZK_SPECS.iter().find(|s| s.num_attributes == attrs.len()).unwrap();
            let t = std::time::Instant::now();
            match mdoc_zk_runtime::run_mdoc_prover(spec, &circuit, &mdoc, &a[4], &a[5], &tr, &attrs, &a[7], &a[8]) {
                Ok(p) => { fs::write(&a[12], &p).unwrap(); println!("proof {} bytes in {:?}", p.len(), t.elapsed()); }
                Err(e) => { eprintln!("prove failed: {e:?}"); exit(1); }
            }
        }
        Some("verify") => {
            // lf verify <circuit> <pkx> <pky> <transcript> <now> <doc_type> <ns> <id> <cbor_value_hex> <proof>
            let circuit = fs::read(&a[2]).unwrap(); let tr = fs::read(&a[5]).unwrap(); let proof = fs::read(&a[11]).unwrap();
            let attrs = vec![mdoc_zk_runtime::req_attr(a[8].as_bytes(), a[9].as_bytes(), hex(&a[10]))];
            let spec = mdoc_zk_runtime::CURRENT_ZK_SPECS.iter().find(|s| s.num_attributes == attrs.len()).unwrap();
            let t = std::time::Instant::now();
            match mdoc_zk_runtime::run_mdoc_verifier(spec, &circuit, &a[3], &a[4], &tr, &attrs, &a[6], &a[7], &proof) {
                Ok(()) => println!("verify ok in {:?}", t.elapsed()),
                Err(e) => { eprintln!("verify failed: {e:?}"); exit(1); }
            }
        }
        _ => { eprintln!("usage: lf circuit|prove|verify ..."); exit(2); }
    }
}
fn hex(s: &str) -> Vec<u8> { (0..s.len()).step_by(2).map(|i| u8::from_str_radix(&s[i..i + 2], 16).unwrap()).collect() }
