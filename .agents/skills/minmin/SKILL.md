---
name: minmin
description: MINMIN text pipeline — zlib-compress content, map the compressed bytes to a unique-character dictionary table plus index stream, verify input==output, then CRC13 + ROT13 the payload for transport; the browser reverses it (EBC13 = ROT13 inverse), checks CRC13, and draws the text from the dictionary. Use when the user asks to "MINMIN" / encode page text this way.
---

# MINMIN

Two-phase encode on the server, one reverse pass in the browser.

## Phase 1 — minify (must round-trip)
1. **zlib**: `deflateSync(utf8(text))` (raw zlib format).
2. **Dictionary table**: collect every unique byte of the zlib output, in first-seen order → `dict` (the unique character ID map). Each byte becomes its index in `dict` → `idx[]`.
3. **Draw, don't contain**: the payload holds only `dict` + `idx`; text is reconstructed by `dict[idx[i]]` → bytes → inflate.
4. **Gate**: rebuild from `dict`+`idx`, inflate, and require `output === input`. Fail = stop; never ship phase 2.

## Phase 2 — transport
5. Serialize the minified form as `base64(dict) + "." + base64(idx)` → `min`.
6. **CRC13** = CRC-13/BBC (poly `0x1CF5`, init 0, no reflect, no xorout) over `min`; hold it.
7. **ROT13** over `min` (letters only; digits, `+/=.` untouched).
8. The server sends `{ v: "minmin1", crc13, rot13 }`.

## Client
9. **EBC13** — the reversal of ROT13 (ROT13 is its own inverse, so EBC13 applies ROT13 again).
10. Recompute CRC13 on the result; mismatch → refuse to render.
11. Decode `dict`/`idx`, draw bytes via `dict[idx[i]]`, inflate with `DecompressionStream("deflate")`, render as text (textContent, never innerHTML).

## Files
- `scripts/minmin.server.ts` — `minminEncode(text)` (phases 1–2, throws if the gate fails).
- `scripts/minmin.client.js` — `minminDecode(packet)` → Promise<string>; `minminRender(el, packet)`.
- `scripts/selftest.ts` — `bun scripts/selftest.ts` round-trips samples in 16 locales.

## Rules / caveats (tell the user once)
- ROT13 + CRC13 is **obfuscation + integrity check, not security**; a CRC does not stop tampering. Use HTTPS for protection.
- Do not also HTTP-compress MINMIN responses at the app level — the hosting edge already compresses.
- Text drawn by JS is invisible to crawlers that don't run JS; never apply MINMIN to SEO-critical copy (titles, meta, headings) without the user's explicit OK.
- Run `bun run gate:release` after applying it to localized pages.
