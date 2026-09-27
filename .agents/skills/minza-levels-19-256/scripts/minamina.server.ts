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

// Date.now() seed → rolls 1–13 with plain Park–Miller arithmetic (s = s·48271 mod 2³¹−1). No PRNG library.
export function dateRolls(now: number = Date.now()): () => number {
  let s = (Math.abs(Math.floor(now)) % 2147483646) + 1;
  return () => { s = (s * 48271) % 2147483647; return 1 + (s % 13); };
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
  const n = dateRolls(now)(); // 1..13
  return { v: "minamina1", n, crc13: crc13(min), rotn: rotn(min, n) };
}
