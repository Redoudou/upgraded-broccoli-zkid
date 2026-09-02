# Copyright 2026 Green Light contributors. Apache-2.0.
# Verify service + desk screen + prover page in one image. Build context is the repository root.
FROM node:24-alpine
WORKDIR /app
COPY packages/verify-service/package.json packages/verify-service/package-lock.json* packages/verify-service/
RUN cd packages/verify-service && npm install --omit=dev --no-audit --no-fund
COPY packages ./packages
COPY fixtures ./fixtures
COPY scripts ./scripts
ENV PORT=8080 DATA_FILE=/data/proofs.jsonl
VOLUME /data
EXPOSE 8080
CMD ["node", "packages/verify-service/src/server.js"]
