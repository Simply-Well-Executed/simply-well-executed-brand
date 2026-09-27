---
name: minzazazazazaminzazazazaza
description: MINZAZAZAZAZAMINZAZAZAZAZA encoding — splits plaintext into 32 pieces (5 rounds of halving, keys a/b followed by 4 digits of 1/2), each zlib-minified, CRC13-checked and ROTn-rolled with its own Date.now()-seeded n (1–13); falls back to MINZAZAZAZAMINZAZAZAZA under 32 characters. Use when a request asks for MINZAZAZAZAZAMINZAZAZAZAZA or 32-piece MIN-family delivery.
---
# MINZAZAZAZAZAMINZAZAZAZAZA

Level 5 of the MIN family (2^5 = 32 pieces). All earlier skills stay saved.

## Encode (server)
`scripts/minza-depth.server.ts` → `minzaDepthEncode(text, 5)`:
1. Halve PLAINTEXT 5 times by code point (first piece gets the ceil half) → 32 pieces, keys in order (a…, then b…; each extra round appends 1 or 2).
2. Gate: pieces joined must equal PLAINTEXT.
3. Seed mulberry32 with Date.now(); roll 32 n values (1–13) in key order.
4. Per piece: zlib → dictionary + index minify (gated round trip) → CRC13 (poly 0x1CF5, init 0) → ROTn on letters.
5. Send `{v:"minzazazazazaminzazazazaza1", <key>:{n,crc13,rotn}, …}`.

## Fallback
Fewer than 32 code points → MINZAZAZAZAMINZAZAZAZA, which cascades further down the family to MINAMINA. Empty text throws.

## Decode (client)
`scripts/minza-depth-decode.ts`: read the level from the packet name, require exactly 32 keys, then per piece EBCn = ROT(26−n), check CRC13 (refuse on mismatch), draw dict[idx], inflate. Join in key order. Accepts all older versions.

## Test
`bun scripts/selftest-depth.ts 5 5` — round trip, fallback and tamper check.

## Cost
Every piece carries its own table, checksum and number, so packets grow and decoding slows as levels rise. Scrambling plus tamper detection only; HTTPS is the real protection.
