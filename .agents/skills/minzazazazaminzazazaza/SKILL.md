---
name: minzazazazaminzazazaza
description: Minzazazazaminzazazaza encoding — splits plaintext into sixteen pieces (four rounds of halving, keys a111…b222), each zlib-minified, CRC13-checked and ROTn-rolled with its own Date.now()-seeded n (1–13); falls back to MINZAZAZAMINZAZAZA under 16 characters. The site's default delivery. Use when a request asks for Minzazazazaminzazazaza or sixteen-piece MIN-family delivery.
---
# Minzazazazaminzazazaza

Successor to MINZAZAZAMINZAZAZA. MINMIN, MINAMINA, MINZAMINZA, MINZAZAMINZAZA and MINZAZAZAMINZAZAZA stay saved.

## Encode (server)
1. Halve PLAINTEXT four times (by code point, first piece gets the ceil half), which gives 16 pieces keyed a111, a112, … b222 in order.
2. Gate: the pieces joined must equal PLAINTEXT.
3. Seed Park–Miller roll arithmetic (s = s·48271 mod 2³¹−1, n = 1 + s mod 13) with Date.now(); roll sixteen n values (1–13) in key order.
4. Per piece: zlib → dictionary + index minify (gated round trip) → CRC13 (poly 0x1CF5, init 0) → ROTn on letters.
5. Send `{v:"minzazazazaminzazazaza1", a111:{n,crc13,rotn}, … b222:{…}}`.

## Fallback
Fewer than 16 code points → MINZAZAZAMINZAZAZA (→ MINZAZAMINZAZA under 8 → MINZAMINZA under 4 → MINAMINA under 2). Empty text throws.

## Decode (client)
Per piece: EBCn = ROT(26−n), check CRC13 (refuse on mismatch), draw dict[idx], inflate with DecompressionStream("deflate"). Join in key order. Accepts all older packet versions.

## Security
Scrambling plus tamper detection only; all n values travel in the packet. HTTPS is the real protection.
