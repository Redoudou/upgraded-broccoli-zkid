PKGS := packages/verify-service packages/trust-list packages/prover-page

.PHONY: setup test fixtures demo demo1 wasm bench check clean

setup:            ## npm install where a package has dependencies (only verify-service: qrcode)
	@cd packages/verify-service && npm install --no-audit --no-fund

test:             ## node:test in every package; no npm dependencies needed
	@for p in $(PKGS); do echo "== $$p"; (cd $$p && npm test) || exit 1; done

fixtures:         ## test DMV (IACA + DS certs), signed test mDL, trust root -> fixtures/ (needs openssl)
	./scripts/gen-test-dmv.sh

demo:             ## level 2: real longfellow-zk proof in the browser, test credential. Desk at http://<this machine>:8080
	@[ -f fixtures/test-mdl.json ] || ./scripts/gen-test-dmv.sh
	@[ -d packages/verify-service/node_modules ] || $(MAKE) -s setup
	@node scripts/lan-url.js
	@cd packages/verify-service && DEMO_LEVEL=2 npm start --silent

demo1:            ## level 1: same flow with the proof stubbed
	@[ -f fixtures/test-mdl.json ] || ./scripts/gen-test-dmv.sh
	@[ -d packages/verify-service/node_modules ] || $(MAKE) -s setup
	@node scripts/lan-url.js
	@cd packages/verify-service && DEMO_LEVEL=1 npm start --silent

wasm:             ## rebuild packages/circuits/artifacts from the pinned longfellow-zk commit (needs Rust; ~3 min)
	./packages/circuits/build.sh

bench:            ## prove N times in Node (wasm) and write bench/results + bench/REPORT.md
	node bench/wasm-node.js && node bench/report.js

check:            ## secret scan + simplicity budgets + PII scan, same as CI
	bash scripts/secret-scan.sh && ./scripts/simplicity-check.sh && ./scripts/pii-scan.sh

clean:
	rm -rf packages/*/node_modules packages/prover-page/dist data
