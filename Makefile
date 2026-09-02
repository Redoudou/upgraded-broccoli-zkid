PKGS := packages/verify-service packages/trust-list packages/prover-page

.PHONY: setup test lint fixtures demo1 bench

setup:
	@for p in $(PKGS); do (cd $$p && npm install --no-audit --no-fund); done

test:
	@for p in $(PKGS); do echo "== $$p"; (cd $$p && npm test) || exit 1; done

lint:
	@for p in $(PKGS); do (cd $$p && npm run lint --if-present); done

fixtures:
	./scripts/gen-test-dmv.sh

demo1:
	cd packages/verify-service && DEMO_LEVEL=1 npm start

bench:
	@echo "See bench/README.md. Requires Rust, wasm-pack and the two physical devices."
