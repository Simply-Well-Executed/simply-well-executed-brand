import { deflateSync, inflateSync } from "node:zlib";

export type MinminPacket = { v: "minmin1"; crc13: number; rot13: string };

// CRC-13/BBC: poly 0x1CF5, init 0, MSB-first, no reflection, no final xor.
export function crc13(s: string): number {
  let crc = 0;
  for (const b of new TextEncoder().encode(s)) {
    for (let i = 7; i >= 0; i--) {
      const bit = ((b >> i) & 1) ^ ((crc >> 12) & 1);
      crc = (crc << 1) & 0x1fff;
      if (bit) crc ^= 0x1cf5;
    }
  }
  return crc;
}

export const rot13 = (s: string) =>
  s.replace(/[a-z]/gi, (c) => {
    const base = c <= "Z" ? 65 : 97;
    return String.fromCharCode(((c.charCodeAt(0) - base + 13) % 26) + base);
  });

export function minminEncode(text: string): MinminPacket {
  // Phase 1: zlib → unique-byte dictionary table + index stream
  const z = deflateSync(Buffer.from(text, "utf8"));
  const dict: number[] = [];
  const pos = new Map<number, number>();
  const idx = new Uint8Array(z.length);
  z.forEach((b, i) => {
    if (!pos.has(b)) { pos.set(b, dict.length); dict.push(b); }
    idx[i] = pos.get(b)!;
  });
  // Gate: draw from dictionary + index and require input === output
  const drawn = Buffer.from(Array.from(idx, (i) => dict[i]!));
  if (inflateSync(drawn).toString("utf8") !== text) throw new Error("MINMIN phase 1 gate failed: input !== output");

  // Phase 2: CRC13 over the minified form, then ROT13
  const min = Buffer.from(dict).toString("base64") + "." + Buffer.from(idx).toString("base64");
  return { v: "minmin1", crc13: crc13(min), rot13: rot13(min) };
}
