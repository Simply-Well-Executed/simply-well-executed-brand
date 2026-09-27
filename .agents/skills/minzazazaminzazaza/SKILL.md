---
name: minzazazaminzazaza
description: MINZAZAZAMINZAZAZA encoding — splits plaintext into eight pieces (halves → quarters → eighths), each zlib-minified, CRC13-checked and ROTn-rolled with its own Date.now()-seeded n (1–13); falls back to MINZAZAMINZAZA under 8 characters. Use when a request asks for MINZAZAZAMINZAZAZA or eight-piece MIN-family delivery.
---
# MINZAZAZAMINZAZAZA

Successor to MINZAZAMINZAZA. MINMIN, MINAMINA, MINZAMINZA and MINZAZAMINZAZA stay saved.

## Encode (server)
1. PLAINTEXT → split A/B → each split again (a1,a2,b1,b2) → each split again: a11,a12,a21,a22,b11,b12,b21,b22. Splits are by code point, first piece gets the ceil half.
2. Gate: the eight pieces joined must equal PLAINTEXT.
3. Seed mulberry32 with Date.now(); roll eight n values (1–13) in key order.
4. Per piece: zlib → dictionary + index minify (gated round trip) → CRC13 (poly 0x1CF5, init 0) → ROTn on letters.
5. Send `{v:"minzazazaminzazaza1", a11:{n,crc13,rotn}, … b22:{…}}`.

## Fallback
Fewer than 8 code points → MINZAZAMINZAZA (→ MINZAMINZA under 4 → MINAMINA under 2). Empty text throws.

## Decode (client)
Per piece: EBCn = ROT(26−n), check CRC13 (refuse to render on mismatch), draw dict[idx], inflate with DecompressionStream("deflate"). Join in key order. Accepts all older packet versions.

## Scripts
`scripts/minzazazaminzazaza.server.ts`, `scripts/minzazazaminzazaza.client.ts`, `scripts/selftest.ts` (run with `bun`).

## Security
Scrambling plus tamper detection only. All eight n values travel in the packet; HTTPS is the real protection.
