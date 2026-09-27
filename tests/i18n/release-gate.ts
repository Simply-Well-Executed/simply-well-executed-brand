// Release gate: runs one wording gate per language in parallel; release is blocked unless every gate passes.
import { localeInfo } from "../../src/lib/locales";

const locales = Object.keys(localeInfo).filter((l) => l !== "en");
const results = await Promise.all(
  locales.map(async (l) => {
    const p = Bun.spawn(["bun", "tests/i18n/wording-gate.ts", l], { stdout: "pipe", stderr: "pipe" });
    const out = await new Response(p.stdout).text();
    return { l, code: await p.exited, out };
  }),
);
for (const r of results) process.stdout.write(r.out);
const failed = results.filter((r) => r.code !== 0).map((r) => r.l);
console.log(failed.length ? `\nRELEASE GATE: BLOCKED (${failed.join(", ")})` : `\nRELEASE GATE: OPEN — all ${locales.length} language gates passed`);
process.exit(failed.length ? 1 : 0);
