---
name: minzaminza
description: MINZAMINZA text transport — MINAMINA variant that splits the plaintext into halves A and B, each with its own zlib/dictionary minify, CRC13, and ROTn/EBCn rotation (nA, nB rolled 1–13 from one Date.now()-seeded PRNG). Use when the user asks for MINZAMINZA encoding of page text or tool output.
---

# MINZAMINZA

Same as MINAMINA, but the plaintext is split in two and each half gets its own rotation.

## Split
1. Split PLAINTEXT by code points (never mid-character) into PLAINTEXTa (first ceil(len/2)) and PLAINTEXTb (the rest). Gate: `a + b === PLAINTEXT`.

## Per half (A and B independently)
2. **zlib** `deflateSync(utf8(half))` → **dictionary table** (unique bytes in first-seen order) + `idx[]`.
3. **Gate**: draw `dict[idx[i]]`, inflate, require output === half.
4. `min = base64(dict) + "." + base64(idx)`; **CRC13** (CRC-13/BBC, poly 0x1CF5, init 0) over `min`.

## Rolls
5. Seed mulberry32 with `Date.now()`. Roll `nA = 1 + floor(rand()*13)`, then `nB` the same way from the same generator.
6. CIPHERTEXTa = ROTnA(minA), CIPHERTEXTb = ROTnB(minB). Only letters rotate.
7. Server sends `{ v: "minzaminza1", a: { n: nA, crc13, rotn: CIPHERTEXTa }, b: { n: nB, crc13, rotn: CIPHERTEXTb } }`.

## Client
8. For each half: EBCn = ROT(26 − n), verify its CRC13 (refuse to render on mismatch), draw bytes, inflate with `DecompressionStream("deflate")`.
9. Join `a + b` and render with `textContent`.

## Files
- `scripts/minzaminza.server.ts`: `minzaminzaEncode(text, now = Date.now())`
- `scripts/minzaminza.client.js`: `minzaminzaDecode(packet)`, `minzaminzaRender(el, packet)`
- `scripts/selftest.ts`: `bun scripts/selftest.ts`

## Security caveats (tell the user once)
- Not meaningfully more secure than MINAMINA: both n values travel in the packet, there are only 13×13 = 169 combinations, and a clock seed is guessable.
- CRC catches accidental damage, not deliberate tampering. HTTPS provides real confidentiality and integrity.
- Same search/screen-reader limits as MINMIN; never apply to titles, meta tags or headings without the user's OK.
