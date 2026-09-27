// @ts-nocheck -- generic browser decoder for MIN-family levels 5–18; older versions delegate.
import { minzaminzaDecode } from "./minzaminza-decode";
import { minzazazazaminzazazazaDecode } from "./minzazazazaminzazazaza-decode";

export async function minzaDepthDecode(packet) {
  const m = /^min((?:za)+)min\1(?:1)$/.exec(packet?.v ?? "");
  const d = m ? m[1].length / 2 : 0;
  if (d <= 4) return await minzazazazaminzazazazaDecode(packet);
  const keys = Object.keys(packet).filter((k) => new RegExp(`^[ab][12]{${d - 1}}$`).test(k)).sort();
  if (keys.length !== 2 ** d) throw new Error("piece count mismatch");
  const parts = await Promise.all(keys.map((k) => minzaminzaDecode({ v: "minamina1", ...packet[k] })));
  return parts.join("");
}
