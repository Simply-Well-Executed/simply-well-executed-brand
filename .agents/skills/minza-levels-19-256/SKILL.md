---
name: minza-levels-19-256
description: MIN-family levels 19 through 256 (2^19 to 2^256 pieces), MINZA×d+MIN+ZA×d naming; use when a request names any of these levels or piece counts.
---
# MINZA levels 19–256

One generic encoder covers every level d from 19 to 256 (2^d pieces). Name for level d = "MIN" + "ZA"×d + "MIN" + "ZA"×d; packet v = lowercase name + "1". All earlier skills stay saved.

## Encode / decode
Same as levels 5–18: halve PLAINTEXT d times by code point, gate the join, roll 2^d Park–Miller n values (1–13) seeded by Date.now(), per piece zlib → dictionary+index minify (gated) → CRC13 (0x1CF5) → ROTn. Client: EBCn = ROT(26−n), CRC13 check (refuse on mismatch), inflate, join in key order. `minzaDepthEncode(text, d)` in scripts/minza-depth.server.ts; `minzaDepthDecode` in scripts/minza-depth-decode.ts. MINZA_MAX_DEPTH = 256 and is the site default.

## Fallback
Fewer than 2^d code points → level d−1, cascading down to MINAMINA. Empty text throws.

## Physical limits
Level d needs at least 2^d characters. Real pages (~15k–60k chars) cascade to level 14–15. Level 19 needs 524,288 chars; level 40 needs ~1 trillion; level 256 needs 1.16×10^77 — more than atoms on Earth. Levels above ~20 can only be validated through naming, cascade and tamper checks, never a full-size round trip.

## Test
Loop d = 19…256: encode sample, decode must equal input, name must match pattern, a packet with the wrong key count must be refused.
