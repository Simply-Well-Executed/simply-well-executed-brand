---
name: minza-level-16
description: MINZAZAZAZAZAZAZAZAZAZAZAZAZAZAZAZAMINZAZAZAZAZAZAZAZAZAZAZAZAZAZAZAZA encoding — splits plaintext into 65536 pieces (16 rounds of halving, keys a/b followed by 15 digits of 1/2), each zlib-minified, CRC13-checked and ROTn-rolled with its own Date.now()-seeded n (1–13); falls back to MINZAZAZAZAZAZAZAZAZAZAZAZAZAZAZAMINZAZAZAZAZAZAZAZAZAZAZAZAZAZAZA under 65536 characters. Use when a request asks for MINZAZAZAZAZAZAZAZAZAZAZAZAZAZAZAZAMINZAZAZAZAZAZAZAZAZAZAZAZAZAZAZAZA or 65536-piece MIN-family delivery.
---
# MINZAZAZAZAZAZAZAZAZAZAZAZAZAZAZAZAMINZAZAZAZAZAZAZAZAZAZAZAZAZAZAZAZA

Level 16 of the MIN family (2^16 = 65536 pieces). All earlier skills stay saved.

## Encode (server)
`scripts/minza-depth.server.ts` → `minzaDepthEncode(text, 16)`:
1. Halve PLAINTEXT 16 times by code point (first piece gets the ceil half) → 65536 pieces, keys in order (a…, then b…; each extra round appends 1 or 2).
2. Gate: pieces joined must equal PLAINTEXT.
3. Seed mulberry32 with Date.now(); roll 65536 n values (1–13) in key order.
4. Per piece: zlib → dictionary + index minify (gated round trip) → CRC13 (poly 0x1CF5, init 0) → ROTn on letters.
5. Send `{v:"minzazazazazazazazazazazazazazazazaminzazazazazazazazazazazazazazazaza1", <key>:{n,crc13,rotn}, …}`.

## Fallback
Fewer than 65536 code points → MINZAZAZAZAZAZAZAZAZAZAZAZAZAZAZAMINZAZAZAZAZAZAZAZAZAZAZAZAZAZAZA, which cascades further down the family to MINAMINA. Empty text throws.

## Decode (client)
`scripts/minza-depth-decode.ts`: read the level from the packet name, require exactly 65536 keys, then per piece EBCn = ROT(26−n), check CRC13 (refuse on mismatch), draw dict[idx], inflate. Join in key order. Accepts all older versions.

## Test
`bun scripts/selftest-depth.ts 16 16` — round trip, fallback and tamper check.

## Cost
Every piece carries its own table, checksum and number, so packets grow and decoding slows as levels rise. Scrambling plus tamper detection only; HTTPS is the real protection.
