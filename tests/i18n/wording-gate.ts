// Native-wording quality gate — one gate per language.
// Usage: bun tests/i18n/wording-gate.ts <locale>   (exit 0 = pass, 1 = fail)
import { localeDictionary, type Locale } from "../../src/lib/locales";

type L = Exclude<Locale, "en">;

// Rule 1: the translation must be written mostly in the language's own script.
const SCRIPT: Record<L, RegExp> = {
  ar: /[\u0600-\u06FF]/g, he: /[\u0590-\u05FF]/g, ru: /[\u0400-\u04FF]/g, el: /[\u0370-\u03FF\u1F00-\u1FFF]/g,
  zh: /[\u4E00-\u9FFF]/g, "zh-hans": /[\u4E00-\u9FFF]/g, ja: /[\u3040-\u30FF\u4E00-\u9FFF]/g, ko: /[\uAC00-\uD7AF]/g,
  cs: /[a-zA-ZáčďéěíňóřšťúůýžÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ]/g, it: /[a-zA-Zàèéìòù]/gi, es: /[a-zA-Záéíñóúü¿¡]/gi,
  pt: /[a-zA-Záâãàçéêíóôõú]/gi, fr: /[a-zA-Zàâçéèêëîïôûùüÿœ]/gi, sv: /[a-zA-Zåäö]/gi, sw: /[a-zA-Z]/g,
};
const NON_LATIN: L[] = ["ar", "he", "ru", "el", "zh", "zh-hans", "ja", "ko"];

// Words that are allowed to stay in English (brand, product, technical tokens).
const KEEP = /Simply Well Executed|SWE|AI|MCP|PDF|SVG|PNG|URL|API|B2B|YIN|YAN|COREO|𓂐|[A-Z]-\d{2}/g;
// Frequent English function words: if they survive in a Latin-script translation, it wasn't translated.
const ENGLISH_TELLS = /\b(the|and|with|your|for|not|is|are|of|to|this|that)\b/gi;

// Source strings that are never translated by design.
const EXEMPT = /^(\S+\.(pdf|svg|png|md)|\S+@\S+|English|العربية|עברית|Русский|DOMAINS|PRINCIPLES|ASSETS|Rev [\d.]+ · \d{4}|Simply( Well)?|Well|Executed\.?|Free(Serif|Sans|Mono)( \/ \w+| for .*))$/;
const letters = (s: string) => s.replace(KEEP, "").replace(/[\s\d\p{P}\p{S}]/gu, "");

export function runGate(locale: L) {
  const dict = localeDictionary(locale);
  const failures: string[] = [];
  const entries = Object.entries(dict);
  if (entries.length < 150) failures.push(`coverage: only ${entries.length} strings (min 150)`);

  for (const [src, out] of entries) {
    const tag = `"${src.slice(0, 50)}"`;
    if (EXEMPT.test(src)) continue; // intentionally kept as-is (files, emails, language names, brand words, font labels)
    if (!out.trim()) { failures.push(`empty: ${tag}`); continue; }
    if (/\uFFFD|Ã.|â€/.test(out)) failures.push(`mojibake: ${tag}`);
    if (/\{\{|\}\}|TODO|TRANSLATE|lorem/i.test(out)) failures.push(`placeholder leak: ${tag}`);
    // Numbers and codes must survive translation unchanged.
    // Numbers must survive: no invented figures (spelled-out 1–10 may become digits, or vice-versa).
    const nums = (x: string) => x.replace(/(\d)[,.\s\u00A0\u202F](?=\d{3})/g, "$1").match(/\d+/g) ?? [];
    const srcN = nums(src), outN = nums(out);
    if (outN.some((n) => !srcN.includes(n) && Number(n) > 10) || srcN.some((n) => !outN.includes(n) && Number(n) > 10))
      failures.push(`number mismatch: ${tag}`);
    if (src.includes("Simply Well Executed") && !out.includes("Simply Well Executed")) failures.push(`brand name altered: ${tag}`);

    const body = letters(out);
    if (body.length < 3) continue; // brand-only / code-only strings
    if (NON_LATIN.includes(locale)) {
      const native = (body.match(SCRIPT[locale]) ?? []).length;
      if (native / body.length < 0.6) failures.push(`script <60% native: ${tag}`);
    } else {
      if (out === src && src.split(" ").length > 2) failures.push(`untranslated (identical to English): ${tag}`);
      const tells = (out.replace(KEEP, "").match(ENGLISH_TELLS) ?? []).length;
      if (tells >= 3) failures.push(`English leftovers (${tells} words): ${tag}`);
    }
    // RTL: no stray LTR punctuation-only runs that break reading order.
    if ((locale === "ar" || locale === "he") && /^[A-Za-z]/.test(out.replace(KEEP, "").trim().replace(/^[\s\p{P}\p{S}]+/u, ""))) {
      failures.push(`RTL string starts with Latin text: ${tag}`);
    }
  }
  return { locale, checked: entries.length, failures };
}

if (import.meta.main) {
  const locale = process.argv[2] as L;
  if (!locale || !(locale in SCRIPT)) { console.error("usage: wording-gate.ts <locale>"); process.exit(2); }
  const r = runGate(locale);
  console.log(`[gate:${locale}] ${r.failures.length ? "FAIL" : "PASS"} — ${r.checked} strings, ${r.failures.length} issues`);
  r.failures.slice(0, 40).forEach((f) => console.log("  - " + f));
  process.exit(r.failures.length ? 1 : 0);
}
