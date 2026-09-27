// @ts-nocheck -- shared verbatim with the MINZAZAMINZAZA skill script
// Browser side of MINZAZAMINZAZA: four quarters a1,a2,b1,b2 each EBCn → CRC13 → draw → inflate, then joined.
// Also accepts MINZAMINZA / MINAMINA fallback packets.
import { minzaminzaDecode } from "./minzaminza-decode";

export async function minzazaminzazaDecode(packet) {
  if (packet?.v !== "minzazaminzaza1") return await minzaminzaDecode(packet);
  const q = (h) => minzaminzaDecode({ v: "minamina1", ...h });
  const parts = await Promise.all([q(packet.a1), q(packet.a2), q(packet.b1), q(packet.b2)]);
  return parts.join("");
}

export async function minzazaminzazaRender(el, packet) {
  el.textContent = await minzazaminzazaDecode(packet);
}
