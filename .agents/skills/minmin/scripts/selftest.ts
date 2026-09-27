import { minminEncode } from "./minmin.server";
import { minminDecode } from "./minmin.client.js";

const samples = ["Simply Well Executed", "AI work, made operational.", "مصمم للمراجعة", "מוכן לבדיקה", "Русский текст", "台北 中文", "한국어", "日本語", "Ελληνικά", "Čeština", "Español ¿sí?", "Français œ", "Svenska åäö", "Kiswahili", "Italiano è", "Português ção", "𓂐", ""];
let ok = 0;
for (const s of samples) {
  const p = minminEncode(s);
  const out = await minminDecode(p);
  if (out === s) ok++; else console.log("FAIL", JSON.stringify(s));
  const tampered = { ...p, crc13: (p.crc13 + 1) & 0x1fff };
  await minminDecode(tampered).then(() => console.log("FAIL: tamper not caught"), () => {});
}
console.log(`MINMIN selftest: ${ok}/${samples.length} round-trips`);
process.exit(ok === samples.length ? 0 : 1);
