import { minzazazazaminzazazazaEncode } from "./minzazazazaminzazazaza.server";
import { minzazazazaminzazazazaDecode } from "./minzazazazaminzazazaza.client";
const samples = ["Simply Well Executed — AI work, made operational.", "مرحبا بالعالم، عمل منفذ جيدا", "שלום עולם, עבודה מבוצעת היטב", "Просто хорошо выполнено", "简单而良好地执行的工作", "잘 실행된 작업입니다", "Ελληνικά κείμενο δοκιμής", "Kazi iliyotekelezwa vizuri 𓂐", "abcdefg", "abc", "a", "12345678", "0123456789abcdef", "Simply Well Executed 𓂐 مرحبا שלום"];
let ok = 0;
for (const s of samples) {
  const p: any = minzazazazaminzazazazaEncode(s);
  const back = await minzazazazaminzazazazaDecode(p);
  if (back !== s) throw new Error("round trip failed: " + s);
  if (p.v === "minzazazazaminzazazaza1") {
    const t = structuredClone(p); t.b222.crc13 ^= 1;
    let caught = false; try { await minzazazazaminzazazazaDecode(t); } catch { caught = true; }
    if (!caught) throw new Error("tamper missed");
  }
  ok++; console.log(p.v.padEnd(22), JSON.stringify(s).slice(0, 30));
}
console.log(`PASS ${ok}/${samples.length}`);
