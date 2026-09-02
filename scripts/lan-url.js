// Copyright 2026 Green Light contributors. Apache-2.0.
// Prints the desk and phone URLs for this machine so a phone on the same Wi-Fi can scan the QR.
import { networkInterfaces } from 'node:os';
const port = process.env.PORT ?? 8080;
const lan = Object.values(networkInterfaces()).flat().filter(i => i && i.family === 'IPv4' && !i.internal).map(i => i.address);
console.log(`\nGreen Light desk screen:   http://localhost:${port}/`);
for (const ip of lan) console.log(`Same Wi-Fi (phone scans):  http://${ip}:${port}/   <- open this on the desk so the QR carries a reachable address`);
console.log(`Health:                    http://localhost:${port}/health\n`);
