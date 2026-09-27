---
name: minamina
description: MINAMINA text transport — MINMIN variant that swaps fixed ROT13/EBC13 for a per-message ROTn/EBCn pair, n rolled 1–13 from a Date.now()-seeded PRNG and sent with the packet. Use when the user asks for MINAMINA encoding of page text or tool output.
---

# MINAMINA

Same as MINMIN, but the rotation changes every time you encode.

MINAMINA is also the **fallback for MINZAMINZA**: when a plaintext has fewer than 2 code points and can't be split into halves, MINZAMINZA hands the whole text to `minaminaEncode` and sends its `minamina1` packet. MINZAMINZA decoders therefore accept both packet versions.

## Phase 1: minify (must round-trip)
1. **zlib**: `deflateSync(utf8(text))`.
2. **Dictionary table**: list each unique byte in the order it first appears → `dict`. Each byte becomes its position in `dict` → `idx[]`.
3. **Gate**: rebuild the bytes from `dict[idx[i]]`, inflate them, and require `output === input`. If they differ, stop and don't send anything.

## Phase 2: transport
4. `min = base64(dict) + "." + base64(idx)`.
5. **CRC13** (CRC-13/BBC, poly `0x1CF5`, init 0) over `min`. Keep it.
6. **Seed**: start a Park–Miller roll arithmetic (s = s·48271 mod 2³¹−1, n = 1 + s mod 13) with `Date.now()` (milliseconds since the UNIX epoch).
7. **Roll** `n` = a whole number from 1 to 13 (`1 + floor(rand() * 13)`).
8. **ROTn** over `min`. Only letters change; `0-9+/=.` stay as they are.
9. The server sends `{ v: "minamina1", n, crc13, rotn }`.

## Client
10. **EBCn** is the mirror of ROTn: `ROT(26 - n)`. ROT13 undoes itself, but other values of n don't, so the reverse step has to use the mirror.
11. Recompute CRC13. If it doesn't match, don't show the text.
12. Draw the bytes as `dict[idx[i]]`, inflate them with `DecompressionStream("deflate")`, and show the result with `textContent`.

## Files
- `scripts/minamina.server.ts`: `minaminaEncode(text, now = Date.now())`
- `scripts/minamina.client.js`: `minaminaDecode(packet)`, `minaminaRender(el, packet)`
- `scripts/selftest.ts`: run `bun scripts/selftest.ts`

## Security caveats (tell the user once)
- MINAMINA is **not more secure than MINMIN** in any real sense. `n` travels in the same packet, and there are only 13 possible keys. A seed based on the clock is also easy to guess.
- The CRC catches accidental damage, not deliberate tampering. Use HTTPS for confidentiality and integrity.
- Search engines and screen readers get the same limits as MINMIN. Never apply it to titles, meta tags or headings without the user's OK.
