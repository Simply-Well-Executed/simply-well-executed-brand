// @ts-nocheck -- shared verbatim with the Minzazaazazaminzazazaza skill script
// Browser side: sixteen pieces each EBCn → CRC13 → draw → inflate, joined in order. Accepts all older packet versions.
import { minzaminzaDecode } from "./minzaminza-decode";
import { minzazazaminzazazaDecode } from "./minzazazaminzazaza-decode";

const ab = ["a", "b"], d = ["1", "2"];
const KEYS = ab.flatMap((x) => d.flatMap((y) => d.flatMap((z) => d.map((w) => x + y + z + w))));

export async function minzazazazaminzazazazaDecode(packet) {
  if (packet?.v !== "minzazazazaminzazazaza1") return await minzazazaminzazazaDecode(packet);
  const parts = await Promise.all(KEYS.map((k) => minzaminzaDecode({ v: "minamina1", ...packet[k] })));
  return parts.join("");
}
