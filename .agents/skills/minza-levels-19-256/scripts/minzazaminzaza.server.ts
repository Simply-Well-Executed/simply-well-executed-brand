import { dateRolls, piece, split, minzaminzaEncode, type MinzaHalf, type MinzaminzaOrMinaminaPacket } from "./minzaminza.server";

export type MinzazaminzazaPacket = { v: "minzazaminzaza1"; a1: MinzaHalf; a2: MinzaHalf; b1: MinzaHalf; b2: MinzaHalf };
export type AnyMinPacket = MinzazaminzazaPacket | MinzaminzaOrMinaminaPacket;

export function minzazaminzazaEncode(text: string, now: number = Date.now()): AnyMinPacket {
  const len = Array.from(text).length;
  if (len < 1) throw new Error("MINZAZAMINZAZA: PLAINTEXT must be at least 1 character");
  // Fallback: fewer than 4 code points can't be quartered — hand off to MINZAMINZA (which itself falls back to MINAMINA).
  if (len < 4) return minzaminzaEncode(text, now);
  const [pa, pb] = split(text);
  const [pa1, pa2] = split(pa);
  const [pb1, pb2] = split(pb);
  if (pa1 + pa2 + pb1 + pb2 !== text) throw new Error("MINZAZAMINZAZA split gate failed");
  const roll = dateRolls(now);
  const [nA1, nA2, nB1, nB2] = [roll(), roll(), roll(), roll()];
  return { v: "minzazaminzaza1", a1: piece(pa1, nA1), a2: piece(pa2, nA2), b1: piece(pb1, nB1), b2: piece(pb2, nB2) };
}
