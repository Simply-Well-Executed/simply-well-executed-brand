import { crc13, minify, mulberry32, rotn, split, type MinzaHalf } from "./minzaminza.server";
import { minzazaminzazaEncode, type AnyMinPacket as AnyMinPacket4 } from "./minzazaminzaza.server";

export const MZZZ_KEYS = ["a11", "a12", "a21", "a22", "b11", "b12", "b21", "b22"] as const;
export type MinzazazaminzazazaPacket = { v: "minzazazaminzazaza1" } & Record<(typeof MZZZ_KEYS)[number], MinzaHalf>;
export type AnyMinPacket = MinzazazaminzazazaPacket | AnyMinPacket4;

/** Eight pieces (halves → quarters → eighths), eight ROTn rolls. <8 code points falls back to MINZAZAMINZAZA. */
export function minzazazaminzazazaEncode(text: string, now: number = Date.now()): AnyMinPacket {
  const len = Array.from(text).length;
  if (len < 1) throw new Error("MINZAZAZAMINZAZAZA: PLAINTEXT must be at least 1 character");
  if (len < 8) return minzazaminzazaEncode(text, now);
  const eighths = split(text).flatMap(split).flatMap(split);
  if (eighths.length !== 8 || eighths.join("") !== text) throw new Error("MINZAZAZAMINZAZAZA split gate failed");
  const rand = mulberry32(now);
  const out: any = { v: "minzazazaminzazaza1" };
  MZZZ_KEYS.forEach((k, i) => {
    const n = 1 + Math.floor(rand() * 13);
    const m = minify(eighths[i]!);
    out[k] = { n, crc13: crc13(m), rotn: rotn(m, n) };
  });
  return out as MinzazazaminzazazaPacket;
}
