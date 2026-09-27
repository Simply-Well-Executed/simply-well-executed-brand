import { minzazaminzazaEncode } from "./minzazaminzaza.server";
import { minzazaminzazaDecode } from "./minzazaminzaza.client";
const samples = ["Simply Well Executed — AI work, made operational.","مرحبا بالعالم","שלום עולם","Привет, мир","台北 繁體中文","简体中文","안녕하세요","Dobrý den","こんにちは","Γειά σου","Ciao","Hola","Olá!","Bonjour","Habari","𓂐𓂐𓂐𓂐","abcd"];
let fail = 0;
for (let k = 0; k < samples.length; k++) {
  const p: any = minzazaminzazaEncode(samples[k]!, Date.now() + k * 7919);
  if (p.v !== "minzazaminzaza1" || (await minzazaminzazaDecode(p)) !== samples[k]) { fail++; console.log("FAIL", samples[k]); continue; }
  for (const key of ["a1","a2","b1","b2"]) { try { await minzazaminzazaDecode({ ...p, [key]: { ...p[key], crc13: p[key].crc13 ^ 1 } }); fail++; console.log("tamper missed", key); } catch {} }
}
const fb: [string, string][] = [["abc","minzaminza1"],["ab","minzaminza1"],["x","minamina1"],["𓂐𓂐𓂐","minzaminza1"]];
for (const [t, v] of fb) { const p: any = minzazaminzazaEncode(t); if (p.v !== v || (await minzazaminzazaDecode(p)) !== t) { fail++; console.log("FAIL fallback", t); } }
try { minzazaminzazaEncode(""); fail++; } catch {}
console.log(`${samples.length} quarter round-trips + ${fb.length} fallbacks, failures: ${fail}`);
process.exit(fail ? 1 : 0);
