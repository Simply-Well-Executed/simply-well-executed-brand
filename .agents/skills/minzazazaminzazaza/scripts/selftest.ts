import { minzazazaminzazazaEncode } from "./minzazazaminzazaza.server";
import { minzazazaminzazazaDecode } from "./minzazazaminzazaza.client";
const samples = ["Simply Well Executed — AI work, made operational.", "مرحبا بالعالم، عمل منفذ جيدا", "שלום עולם, עבודה מבוצעת היטב", "Просто хорошо выполнено", "简单而良好地执行的工作", "잘 실행된 작업입니다", "Ελληνικά κείμενο δοκιμής", "Kazi iliyotekelezwa vizuri 𓂐", "abcdefg", "abc", "a", "12345678"];
let ok = 0;
for (const s of samples) {
  const p: any = minzazazaminzazazaEncode(s);
  const back = await minzazazaminzazazaDecode(p);
  if (back !== s) throw new Error("round trip failed: " + s);
  if (p.v === "minzazazaminzazaza1") {
    const t = structuredClone(p); t.b22.crc13 ^= 1;
    let caught = false; try { await minzazazaminzazazaDecode(t); } catch { caught = true; }
    if (!caught) throw new Error("tamper missed");
  }
  ok++; console.log(p.v.padEnd(22), JSON.stringify(s).slice(0, 30));
}
console.log(`PASS ${ok}/${samples.length}`);
