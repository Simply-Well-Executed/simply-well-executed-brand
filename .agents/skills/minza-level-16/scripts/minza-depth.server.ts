import { dateRolls, piece, split, type MinzaHalf } from "./minzaminza.server";
import { minzazazazaminzazazazaEncode, type AnyMinPacket as AnyMinPacket16 } from "./minzazazazaminzazazaza.server";

/** MIN-family level d: 2^d pieces. Name = MIN + ZA×d + MIN + ZA×d. Levels 5–18 are generated here. */
export const MINZA_MAX_DEPTH = 18;
export const minzaName = (d: number) => "min" + "za".repeat(d) + "min" + "za".repeat(d);
export const minzaKeys = (d: number): string[] => {
  let keys = ["a", "b"];
  for (let i = 1; i < d; i++) keys = keys.flatMap((k) => [k + "1", k + "2"]);
  return keys;
};
export type AnyMinPacket = ({ v: string } & Record<string, MinzaHalf | string>) | AnyMinPacket16;

/** Encode at level d; fewer than 2^d code points cascades to level d−1 (down to MINZAZAZAZAMINZAZAZAZA and below). */
export function minzaDepthEncode(text: string, depth: number, now: number = Date.now()): AnyMinPacket {
  if (depth <= 4) return minzazazazaminzazazazaEncode(text, now);
  const len = Array.from(text).length;
  if (len < 1) throw new Error(`${minzaName(depth)}: PLAINTEXT must be at least 1 character`);
  const count = 2 ** depth;
  if (len < count) return minzaDepthEncode(text, depth - 1, now);
  let pieces = [text];
  for (let i = 0; i < depth; i++) pieces = pieces.flatMap(split);
  if (pieces.length !== count || pieces.join("") !== text) throw new Error(`${minzaName(depth)} split gate failed`);
  const roll = dateRolls(now);
  const out: any = { v: minzaName(depth) + "1" };
  minzaKeys(depth).forEach((k, i) => {
    out[k] = piece(pieces[i]!, roll());
  });
  return out;
}

/** Site default: the deepest level; short texts cascade down level by level. */
export const MINZA_DEFAULT_DEPTH = MINZA_MAX_DEPTH;
export const minzaDefaultEncode = (text: string, now?: number) => minzaDepthEncode(text, MINZA_DEFAULT_DEPTH, now);
