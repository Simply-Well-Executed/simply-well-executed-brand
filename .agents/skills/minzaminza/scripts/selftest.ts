import { minzaminzaEncode } from "./minzaminza.server";
import { minzaminzaDecode } from "./minzaminza.client.js";

const samples = [
  "Simply Well Executed — AI work, made operational.",
  "مرحبا بالعالم", "שלום עולם", "Привет, мир", "台北 繁體中文", "简体中文", "안녕하세요",
  "Dobrý den", "こんにちは", "Γειά σου", "Ciao", "Hola", "Olá", "Bonjour", "Hej", "Habari", "𓂐𓂐", "𓂐𓂐𓂐", "xy",
];
let fail = 0, diff = 0;
for (let k = 0; k < samples.length; k++) {
  const p = minzaminzaEncode(samples[k]!, Date.now() + k * 7919);
  if (p.v === "minzaminza1" && p.a.n !== p.b.n) diff++;
  const ok = (await minzaminzaDecode(p)) === samples[k];
  let ta = false, tb = false;
  if (p.v === "minzaminza1") {
    try { await minzaminzaDecode({ ...p, a: { ...p.a, crc13: p.a.crc13 ^ 1 } }); } catch { ta = true; }
    try { await minzaminzaDecode({ ...p, b: { ...p.b, crc13: p.b.crc13 ^ 1 } }); } catch { tb = true; }
  } else {
    try { await minzaminzaDecode({ ...p, crc13: p.crc13 ^ 1 }); } catch { ta = tb = true; }
  }
  if (!ok || !ta || !tb) { fail++; console.log("FAIL", JSON.stringify(samples[k])); }
}
// Fallback: 1 code point → MINAMINA packet; 0 → throw.
let fb = 0;
for (const t of ["x", "𓂐"]) {
  const p = minzaminzaEncode(t);
  if (p.v === "minamina1" && (await minzaminzaDecode(p)) === t) fb++;
}
if (fb !== 2) { fail++; console.log("FAIL minamina fallback"); }
let guard = 0;
try { minzaminzaEncode(""); } catch { guard++; }
if (guard !== 1) { fail++; console.log("FAIL empty-text guard"); }
console.log(`minamina fallback: ${fb}/2 single-char round-trips; empty text refused: ${guard}/1`);
console.log(`${samples.length - fail}/${samples.length} round-trips, tamper caught; nA≠nB in ${diff}/${samples.length}`);
process.exit(fail ? 1 : 0);
