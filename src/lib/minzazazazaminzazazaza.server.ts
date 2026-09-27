import { crc13, minify, mulberry32, rotn, split, type MinzaHalf } from "./minzaminza.server";
import { minzazazaminzazazaEncode, type AnyMinPacket as AnyMinPacket8 } from "./minzazazaminzazaza.server";

const ab = ["a", "b"], d = ["1", "2"];
export const M16_KEYS = ab.flatMap((x) => d.flatMap((y) => d.flatMap((z) => d.map((w) => x + y + z + w))));
export type Minzazazazaminzazazaza1 = { v: "minzazazazaminzazazaza1" } & Record<string, MinzaHalf>;
export type AnyMinPacket = Minzazazazaminzazazaza1 | AnyMinPacket8;

/** Sixteen pieces (four rounds of halving), sixteen ROTn rolls. <16 code points falls back to MINZAZAZAMINZAZAZA. */
export function minzazazazaminzazazazaEncode(text: string, now: number = Date.now()): AnyMinPacket {
  const len = Array.from(text).length;
  if (len < 1) throw new Error("Minzazazazaminzazazaza: PLAINTEXT must be at least 1 character");
  if (len < 16) return minzazazaminzazazaEncode(text, now);
  const pieces = split(text).flatMap(split).flatMap(split).flatMap(split);
  if (pieces.length !== 16 || pieces.join("") !== text) throw new Error("Minzazazazaminzazazaza split gate failed");
  const rand = mulberry32(now);
  const out: any = { v: "minzazazazaminzazazaza1" };
  M16_KEYS.forEach((k, i) => {
    const n = 1 + Math.floor(rand() * 13);
    const m = minify(pieces[i]!);
    out[k] = { n, crc13: crc13(m), rotn: rotn(m, n) };
  });
  return out;
}
