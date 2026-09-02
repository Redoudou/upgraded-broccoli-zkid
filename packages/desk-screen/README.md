# desk-screen

Static venue screen served by the verify service at `/`. Creates a session, shows the QR (`/qr/<nonce>.svg`) and the link for laptop-only testing, listens on `/events/<nonce>` (SSE), goes green or red within a second of the service deciding, holds the result for seven seconds, then starts a new session. Renews on expiry. Strict CSP, no inline script.
