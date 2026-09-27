import { deflateSync, inflateSync } from "node:zlib";
import { minaminaEncode, type MinaminaPacket } from "./minamina.server";

export type MinzaHalf = { n: number; crc13: number; rotn: string };
export type MinzaminzaPacket = { v: "minzaminza1"; a: MinzaHalf; b: MinzaHalf };
export type MinzaminzaOrMinaminaPacket = MinzaminzaPacket | MinaminaPacket;

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

// Phase 1 (zlib → dictionary table → gate) for one half.
function minify(text: string): string {
  const z = deflateSync(Buffer.from(text, "utf8"));
  const dict: number[] = [];
  const pos = new Map<number, number>();
  const idx = new Uint8Array(z.length);
  z.forEach((b, i) => {
    if (!pos.has(b)) { pos.set(b, dict.length); dict.push(b); }
    idx[i] = pos.get(b)!;
  });
  const drawn = Buffer.from(Array.from(idx, (i) => dict[i]!));
  if (inflateSync(drawn).toString("utf8") !== text) throw new Error("MINZAMINZA phase 1 gate failed: input !== output");
  return Buffer.from(dict).toString("base64") + "." + Buffer.from(idx).toString("base64");
}

// Split by code points so neither half cuts a character in two.
export function split(text: string): [string, string] {
  const cp = Array.from(text);
  const mid = Math.ceil(cp.length / 2);
  return [cp.slice(0, mid).join(""), cp.slice(mid).join("")];
}

export function minzaminzaEncode(text: string, now: number = Date.now()): MinzaminzaOrMinaminaPacket {
  const len = Array.from(text).length;
  if (len < 1) throw new Error("MINZAMINZA: PLAINTEXT must be at least 1 character");
  // Fallback: fewer than 2 code points can't be split — hand off to MINAMINA.
  if (len < 2) return minaminaEncode(text, now);
  const [pa, pb] = split(text);
  if (pa + pb !== text) throw new Error("MINZAMINZA split gate failed");
  const rand = mulberry32(now);
  const nA = 1 + Math.floor(rand() * 13);
  const nB = 1 + Math.floor(rand() * 13);
  const half = (p: string, n: number): MinzaHalf => { const m = minify(p); return { n, crc13: crc13(m), rotn: rotn(m, n) }; };
  return { v: "minzaminza1", a: half(pa, nA), b: half(pb, nB) };
}
