import { minzaDepthEncode, minzaName, MINZA_MAX_DEPTH } from "./minza-depth.server";
import { minzaDepthDecode } from "./minza-depth-decode";
const base = "Simply Well Executed — مرحبا שלום Привет 台北 中文 한국어 Čeština 日本語 Ελληνικά 𓂐 ";
const from = Number(process.argv[2] ?? 5), to = Number(process.argv[3] ?? MINZA_MAX_DEPTH);
for (let d = from; d <= to; d++) {
  const t0 = performance.now();
  const text = base.repeat(Math.ceil(2 ** d / Array.from(base).length) + 1);
  const p: any = minzaDepthEncode(text, d);
  const ok = p.v === minzaName(d) + "1" && (await minzaDepthDecode(p)) === text;
  const s = Array.from(text).slice(0, 2 ** d - 1).join("");
  const sp: any = minzaDepthEncode(s, d);
  const shortOk = sp.v === minzaName(d - 1) + "1" && (await minzaDepthDecode(sp)) === s;
  const k = Object.keys(p).find((x) => x !== "v")!; p[k] = { ...p[k], crc13: (p[k].crc13 + 1) % 8192 };
  let tamper = false; try { await minzaDepthDecode(p); } catch { tamper = true; }
  console.log(d, minzaName(d).toUpperCase(), 2 ** d, "pieces", ok, shortOk, "tamper", tamper, Math.round(performance.now() - t0) + "ms");
  if (!ok || !shortOk || !tamper) process.exit(1);
}
