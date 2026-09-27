import { deflateSync, inflateSync } from "node:zlib";

export type MinaminaPacket = { v: "minamina1"; n: number; crc13: number; rotn: string };

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

// mulberry32 PRNG, seeded explicitly (Date.now() by default).
export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const rotn = (s: string, n: number) =>
  s.replace(/[a-z]/gi, (c) => {
    const base = c <= "Z" ? 65 : 97;
    return String.fromCharCode(((c.charCodeAt(0) - base + n) % 26) + base);
  });

export function minaminaEncode(text: string, now: number = Date.now()): MinaminaPacket {
  const z = deflateSync(Buffer.from(text, "utf8"));
  const dict: number[] = [];
  const pos = new Map<number, number>();
  const idx = new Uint8Array(z.length);
  z.forEach((b, i) => {
    if (!pos.has(b)) { pos.set(b, dict.length); dict.push(b); }
    idx[i] = pos.get(b)!;
  });
  const drawn = Buffer.from(Array.from(idx, (i) => dict[i]!));
  if (inflateSync(drawn).toString("utf8") !== text) throw new Error("MINAMINA phase 1 gate failed: input !== output");

  const min = Buffer.from(dict).toString("base64") + "." + Buffer.from(idx).toString("base64");
  const n = 1 + Math.floor(mulberry32(now)() * 13); // 1..13
  return { v: "minamina1", n, crc13: crc13(min), rotn: rotn(min, n) };
}
