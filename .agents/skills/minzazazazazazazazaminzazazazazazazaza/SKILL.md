---
name: minzazazazazazazazaminzazazazazazazaza
description: MINZAZAZAZAZAZAZAZAMINZAZAZAZAZAZAZAZA encoding — splits plaintext into 256 pieces (8 rounds of halving, keys a/b followed by 7 digits of 1/2), each zlib-minified, CRC13-checked and ROTn-rolled with its own Date.now()-seeded n (1–13); falls back to MINZAZAZAZAZAZAZAMINZAZAZAZAZAZAZA under 256 characters. Use when a request asks for MINZAZAZAZAZAZAZAZAMINZAZAZAZAZAZAZAZA or 256-piece MIN-family delivery.
---
# MINZAZAZAZAZAZAZAZAMINZAZAZAZAZAZAZAZA

Level 8 of the MIN family (2^8 = 256 pieces). All earlier skills stay saved.

## Encode (server)
`scripts/minza-depth.server.ts` → `minzaDepthEncode(text, 8)`:
1. Halve PLAINTEXT 8 times by code point (first piece gets the ceil half) → 256 pieces, keys in order (a…, then b…; each extra round appends 1 or 2).
2. Gate: pieces joined must equal PLAINTEXT.
3. Seed mulberry32 with Date.now(); roll 256 n values (1–13) in key order.
4. Per piece: zlib → dictionary + index minify (gated round trip) → CRC13 (poly 0x1CF5, init 0) → ROTn on letters.
5. Send `{v:"minzazazazazazazazaminzazazazazazazaza1", <key>:{n,crc13,rotn}, …}`.

## Fallback
Fewer than 256 code points → MINZAZAZAZAZAZAZAMINZAZAZAZAZAZAZA, which cascades further down the family to MINAMINA. Empty text throws.

## Decode (client)
`scripts/minza-depth-decode.ts`: read the level from the packet name, require exactly 256 keys, then per piece EBCn = ROT(26−n), check CRC13 (refuse on mismatch), draw dict[idx], inflate. Join in key order. Accepts all older versions.

## Test
`bun scripts/selftest-depth.ts 8 8` — round trip, fallback and tamper check.

## Cost
Every piece carries its own table, checksum and number, so packets grow and decoding slows as levels rise. Scrambling plus tamper detection only; HTTPS is the real protection.
