import { deflateSync, inflateSync } from "node:zlib";
import { crc13, dateRolls, minaminaEncode, rotn, type MinaminaPacket } from "./minamina.server";

export { crc13, dateRolls, rotn };

export type MinzaHalf = { n: number; crc13: number; rotn: string };
export type MinzaminzaPacket = { v: "minzaminza1"; a: MinzaHalf; b: MinzaHalf };
export type MinzaminzaOrMinaminaPacket = MinzaminzaPacket | MinaminaPacket;

// Phase 1 (zlib → dictionary table → gate) for one half.
export function minify(text: string): string {
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

/** One piece: minify → CRC13 → ROTn. Shared by every MINZA level. */
export const piece = (p: string, n: number): MinzaHalf => { const m = minify(p); return { n, crc13: crc13(m), rotn: rotn(m, n) }; };

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
  const roll = dateRolls(now);
  const nA = roll();
  const nB = roll();
  return { v: "minzaminza1", a: piece(pa, nA), b: piece(pb, nB) };
}
