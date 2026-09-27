---
name: minzazaminzaza
description: MINZAZAMINZAZA text transport — MINZAMINZA variant that splits plaintext into halves A/B and again into quarters a1, a2, b1, b2, each with its own zlib/dictionary minify, CRC13 and ROTn/EBCn (four n values rolled 1–13 from one Date.now()-seeded PRNG); falls back to MINZAMINZA under 4 characters. Use when the user asks for MINZAZAMINZAZA encoding.
---

# MINZAZAMINZAZA

## Split
0. **Fallback**: fewer than 4 code points → hand the whole text to **MINZAMINZA** (`minzaminzaEncode`, which itself falls back to MINAMINA under 2). Empty text throws.
1. Split PLAINTEXT by code points into PLAINTEXTa / PLAINTEXTb (first half = ceil(len/2)), then split each again: a → a1/a2, b → b1/b2. Gate: `a1+a2+b1+b2 === PLAINTEXT`.

## Per quarter (a1, a2, b1, b2 independently)
2. zlib deflate → dictionary table (unique bytes, first-seen order) + idx[] → gate (draw + inflate === quarter).
3. `min = base64(dict) + "." + base64(idx)`; CRC13 (poly 0x1CF5, init 0) over `min`.

## Rolls
4. Seed Park–Miller roll arithmetic (s = s·48271 mod 2³¹−1, n = 1 + s mod 13) with `Date.now()`; roll nA1, nA2, nB1, nB2 in that order, each `1 + (s mod 13)`.
5. Each quarter's CIPHERTEXT = ROTn(min) (letters only).
6. Send `{ v: "minzazaminzaza1", a1:{n,crc13,rotn}, a2:{…}, b1:{…}, b2:{…} }`.

## Client
7. Accept `minzazaminzaza1`, `minzaminza1` and `minamina1`. Per quarter: EBCn = ROT(26−n), verify CRC13 (refuse to render on mismatch), draw, inflate with `DecompressionStream("deflate")`. Join a1+a2+b1+b2, render via `textContent`.

## Files
- `scripts/minzazaminzaza.server.ts` — `minzazaminzazaEncode(text, now)` (uses bundled `minzaminza.server.ts`, `minamina.server.ts`)
- `scripts/minzazaminzaza.client.ts` — `minzazaminzazaDecode`, `minzazaminzazaRender`
- `scripts/selftest.ts` — `bun scripts/selftest.ts`

## Caveats (tell the user once)
- Scrambling, not security: all four n values travel in the packet (13⁴ = 28,561 combos), and a clock seed is guessable. HTTPS is the real protection.
- Never apply to titles, meta tags or headings without the user's OK.
