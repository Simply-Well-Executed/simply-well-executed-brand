import { minaminaEncode } from "./minamina.server";
import { minaminaDecode } from "./minamina.client.js";

const samples = [
  "Simply Well Executed — AI work, made operational.",
  "مرحبا بالعالم", "שלום עולם", "Привет, мир", "台北 繁體中文", "简体中文", "안녕하세요",
  "Dobrý den", "こんにちは", "Γειά σου", "Ciao", "Hola", "Olá", "Bonjour", "Hej", "Habari", "𓂐",
];
let fail = 0;
const seen = new Set<number>();
for (let k = 0; k < samples.length; k++) {
  const p = minaminaEncode(samples[k]!, Date.now() + k * 7919);
  seen.add(p.n);
  const out = await minaminaDecode(p);
  const ok = out === samples[k] && p.n >= 1 && p.n <= 13;
  let tamperCaught = false;
  try { await minaminaDecode({ ...p, crc13: p.crc13 ^ 1 }); } catch { tamperCaught = true; }
  if (!ok || !tamperCaught) { fail++; console.log("FAIL", samples[k], p.n); }
}
console.log(`${samples.length - fail}/${samples.length} round-trips, n values seen: ${[...seen].sort((a, b) => a - b).join(",")}`);
process.exit(fail ? 1 : 0);
