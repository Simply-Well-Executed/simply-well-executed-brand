---
name: minzazazazazazazazazazazazazaminzazazazazazazazazazazazaza
description: MINZAZAZAZAZAZAZAZAZAZAZAZAZAMINZAZAZAZAZAZAZAZAZAZAZAZAZA encoding — splits plaintext into 8192 pieces (13 rounds of halving, keys a/b followed by 12 digits of 1/2), each zlib-minified, CRC13-checked and ROTn-rolled with its own Date.now()-seeded n (1–13); falls back to MINZAZAZAZAZAZAZAZAZAZAZAZAMINZAZAZAZAZAZAZAZAZAZAZAZA under 8192 characters. Use when a request asks for MINZAZAZAZAZAZAZAZAZAZAZAZAZAMINZAZAZAZAZAZAZAZAZAZAZAZAZA or 8192-piece MIN-family delivery.
---
# MINZAZAZAZAZAZAZAZAZAZAZAZAZAMINZAZAZAZAZAZAZAZAZAZAZAZAZA

Level 13 of the MIN family (2^13 = 8192 pieces). All earlier skills stay saved.

## Encode (server)
`scripts/minza-depth.server.ts` → `minzaDepthEncode(text, 13)`:
1. Halve PLAINTEXT 13 times by code point (first piece gets the ceil half) → 8192 pieces, keys in order (a…, then b…; each extra round appends 1 or 2).
2. Gate: pieces joined must equal PLAINTEXT.
3. Seed Park–Miller roll arithmetic (s = s·48271 mod 2³¹−1, n = 1 + s mod 13) with Date.now(); roll 8192 n values (1–13) in key order.
4. Per piece: zlib → dictionary + index minify (gated round trip) → CRC13 (poly 0x1CF5, init 0) → ROTn on letters.
5. Send `{v:"minzazazazazazazazazazazazazaminzazazazazazazazazazazazaza1", <key>:{n,crc13,rotn}, …}`.

## Fallback
Fewer than 8192 code points → MINZAZAZAZAZAZAZAZAZAZAZAZAMINZAZAZAZAZAZAZAZAZAZAZAZA, which cascades further down the family to MINAMINA. Empty text throws.

## Decode (client)
`scripts/minza-depth-decode.ts`: read the level from the packet name, require exactly 8192 keys, then per piece EBCn = ROT(26−n), check CRC13 (refuse on mismatch), draw dict[idx], inflate. Join in key order. Accepts all older versions.

## Test
`bun scripts/selftest-depth.ts 13 13` — round trip, fallback and tamper check.

## Cost
Every piece carries its own table, checksum and number, so packets grow and decoding slows as levels rise. Scrambling plus tamper detection only; HTTPS is the real protection.
