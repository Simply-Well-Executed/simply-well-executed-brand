// @ts-nocheck -- shared verbatim with the MINZAZAZAMINZAZAZA skill script
// Browser side: eight pieces each EBCn → CRC13 → draw → inflate, joined in order. Accepts all older packet versions.
import { minzaminzaDecode } from "./minzaminza-decode";
import { minzazaminzazaDecode } from "./minzazaminzaza-decode";

const KEYS = ["a11", "a12", "a21", "a22", "b11", "b12", "b21", "b22"];

export async function minzazazaminzazazaDecode(packet) {
  if (packet?.v !== "minzazazaminzazaza1") return await minzazaminzazaDecode(packet);
  const parts = await Promise.all(KEYS.map((k) => minzaminzaDecode({ v: "minamina1", ...packet[k] })));
  return parts.join("");
}

export async function minzazazaminzazazaRender(el, packet) {
  el.textContent = await minzazazaminzazazaDecode(packet);
}
