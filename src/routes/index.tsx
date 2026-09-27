import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useServerFn } from "@tanstack/react-start";
import { generateSalesSequence } from "@/lib/sequence.functions";
import { ArrowDown, ArrowRight, Check, Download, Menu, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { localeInfo, translate, alternateLinks, type Locale } from "@/lib/locales";
import { brandAssets, library, principles, topics } from "@/lib/standards";

export const Route = createFileRoute("/")({
  staticData: { sitemap: true },
  head: () => ({ meta: [
    { title: "Simply Well Executed | B2B AI Standards" },
    { name: "description", content: "The public brand, design, and AI operating standards for Simply Well Executed." },
    { property: "og:title", content: "Simply Well Executed | B2B AI Standards" },
    { property: "og:description", content: "AI work, made operational. Explore our public standards and brand system." },
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://simpwellx.com/" },
    { name: "twitter:card", content: "summary_large_image" },
  ],
  links: [{ rel: "canonical", href: "https://simpwellx.com/" }, ...alternateLinks()]}),
  component: EnglishPage,
});

const pad2 = (n: number) => String(n).padStart(2, "0");

function DemoRequestForm({ locale }: { locale: Locale }) {
  const tr = (source: string | undefined) => translate(locale, source);
  const [form, setForm] = useState({ name: "", email: "", company: "", message: "" });
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  const set = (k: keyof typeof form) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [k]: e.target.value });

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const name = form.name.trim();
    const email = form.email.trim();
    if (!name) return setError(tr("Add your name so we know who to reply to."));
    if (name.length > 100) return setError(tr("Keep the name under 100 characters."));
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError(tr("Enter a valid email address."));
    if (email.length > 255) return setError(tr("That email address is too long."));
    if (form.company.trim().length > 120) return setError(tr("Keep the company under 120 characters."));
    if (form.message.length > 2000) return setError(tr("Keep the note under 2,000 characters."));
    setError(null);
    setStatus("sending");
    const { error: dbError } = await supabase.from("demo_requests").insert({
      name,
      email,
      company: form.company.trim() || null,
      message: form.message.trim() || null,
    });
    if (dbError) {
      setStatus("idle");
      setError(tr("Something went wrong sending your request. Please try again."));
      return;
    }
    setStatus("sent");
  };

  if (status === "sent") return (
    <div className="rounded-3xl bg-paper p-8 ring-1 ring-border">
      <span className="grid size-12 place-items-center rounded-full bg-teal text-primary-foreground"><Check className="size-6" /></span>
      <h3 className="mt-6 font-display text-2xl font-bold">{tr("Request received.")}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{tr("We'll review what you sent and reply from a real person — no automated funnel.")}</p>
      <Button variant="outline" size="sm" className="mt-6 rounded-full" onClick={() => { setForm({ name: "", email: "", company: "", message: "" }); setStatus("idle"); }}>{tr("Send another request")}</Button>
    </div>
  );

  const field = "mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-coral";
  return (
    <form onSubmit={submit} className="rounded-3xl bg-paper p-8 ring-1 ring-border" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium">{tr("Name")}
          <input required value={form.name} onChange={set("name")} className={field} placeholder={tr("Your name")} maxLength={100} autoComplete="name" />
        </label>
        <label className="block text-sm font-medium">{tr("Work email")}
          <input required type="email" value={form.email} onChange={set("email")} className={field} placeholder={tr("you@company.com")} maxLength={255} autoComplete="email" />
        </label>
        <label className="block text-sm font-medium sm:col-span-2">{tr("Company")} <span className="font-normal text-muted-foreground">{tr("(optional)")}</span>
          <input value={form.company} onChange={set("company")} className={field} placeholder={tr("Where you work")} maxLength={120} autoComplete="organization" />
        </label>
        <label className="block text-sm font-medium sm:col-span-2">{tr("What should the demo cover?")} <span className="font-normal text-muted-foreground">{tr("(optional)")}</span>
          <textarea value={form.message} onChange={set("message")} className={`${field} min-h-28 resize-y`} placeholder={tr("The workflow, team, or decision you want to see handled.")} maxLength={2000} />
        </label>
      </div>
      {error && <p role="alert" className="mt-4 rounded-xl bg-coral/10 px-4 py-3 text-sm text-coral">{error}</p>}
      <Button type="submit" variant="ink" className="mt-6 w-full sm:w-auto" disabled={status === "sending"}>{status === "sending" ? tr("Sending…") : tr("Request a demo")}</Button>
    </form>
  );
}

function SequenceGenerator({ defaultLang }: { defaultLang: Locale }) {
  const tr = (source: string | undefined) => translate(defaultLang, source);
  const run = useServerFn(generateSalesSequence);
  const [product, setProduct] = useState("");
  const [audience, setAudience] = useState("");
  const [language, setLanguage] = useState(defaultLang);
  useEffect(() => setLanguage(defaultLang), [defaultLang]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ text: string; lang: string } | null>(null);
  const field = "mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-violet";
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (product.trim().length < 2) return setError(tr("Describe your product in a few words."));
    if (audience.trim().length < 2) return setError(tr("Say who you're selling to."));
    setError(null); setBusy(true); setResult(null);
    try {
      const r = await run({ data: { product, audience, language } });
      if (r.ok) setResult({ text: r.text, lang: language }); else setError(r.error);
    } catch { setError(tr("Something went wrong generating your sequence. Please try again.")); }
    finally { setBusy(false); }
  };
  return (
    <form onSubmit={submit} className="rounded-3xl bg-background p-8 ring-1 ring-border" noValidate aria-label={tr("Sample sales sequence generator")}>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium sm:col-span-2">{tr("Product")}
          <input value={product} onChange={(e) => setProduct(e.target.value)} className={field} maxLength={300} placeholder={tr("What you sell, in a sentence")} />
        </label>
        <label className="block text-sm font-medium">{tr("Audience")}
          <input value={audience} onChange={(e) => setAudience(e.target.value)} className={field} maxLength={300} placeholder={tr("Who you sell to")} />
        </label>
        <label className="block text-sm font-medium">{tr("Language")}
          <select value={language} onChange={(e) => setLanguage(e.target.value as typeof language)} className={field}>
            <option value="en">English</option><option value="ar">العربية</option><option value="he">עברית</option><option value="ru">Русский</option><option value="zh">中文</option><option value="ko">한국어</option><option value="cs">Čeština</option>
          </select>
        </label>
      </div>
      {error && <p role="alert" className="mt-4 rounded-xl bg-coral/10 px-4 py-3 text-sm text-coral">{error}</p>}
      <Button type="submit" variant="ink" className="mt-6 w-full sm:w-auto" disabled={busy}>{busy ? tr("Writing your sequence…") : tr("Generate sample sequence")}</Button>
      {result && (
        <div className="mt-6 rounded-2xl bg-paper p-6 ring-1 ring-border">
          <div className="font-mono text-[11px] uppercase text-violet">{tr("AI draft · review before use")}</div>
          <div lang={result.lang} dir={localeInfo[result.lang as Locale]?.dir ?? "ltr"} className="mt-3 whitespace-pre-wrap text-start text-sm leading-relaxed" data-testid="sequence-output">{result.text}</div>
        </div>
      )}
    </form>
  );
}

function Logo({ compact = false }: { compact?: boolean }) {
  return <span className="inline-flex items-center gap-2.5"><span className="relative block size-3 after:absolute after:-inset-1 after:rounded-full after:border after:border-coral"><span className="absolute inset-0 rounded-full bg-coral" /></span>{!compact && <span className="font-display text-[15px] font-extrabold leading-none">Simply Well Executed</span>}</span>;
}

function SectionLabel({ children }: { children: string }) {
  return <div className="mb-8 font-mono text-[11px] uppercase text-coral">{children}</div>;
}

export function EnglishPage() { return <StandardsPage locale="en" />; }

export function StandardsPage({ locale }: { locale: Locale }) {
  const info = localeInfo[locale];
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = info.dir;
    localStorage.setItem("swe-locale", locale);
  }, [info.dir, locale]);
  const tr = (source: string | undefined) => translate(locale, source);
  const topicTitle = (t: { title: string }) => tr(t.title);
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [activePattern, setActivePattern] = useState(0);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return library.filter((e) =>
      (category === "all" || e.cat === category) &&
      (!q || `${tr(e.title)} ${tr(e.note)} ${e.cat}`.toLowerCase().includes(q))
    );
  }, [query, category]);
  const catTitle = (id: string) => topics.find((t) => t.id === id)?.title ?? id;

  const go = (id: string) => { document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); setMenuOpen(false); };

  return <div lang={locale} dir={info.dir} data-locale={locale} className={`min-h-screen bg-background text-foreground selection:bg-coral selection:text-primary-foreground ${locale === "ru" ? "locale-ru" : ""}`}>
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between gap-4 px-5 lg:px-8">
        <button onClick={() => go("overview")} className="cursor-pointer" aria-label={tr("Simply Well Executed home")}><Logo /></button>
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex min-w-0 gap-1 overflow-x-auto rounded-full border border-border p-1" role="group" aria-label={tr("Language")}>{(Object.entries(localeInfo) as [Locale, (typeof localeInfo)[Locale]][]).map(([id, l]) => <Link key={id} to={l.path} lang={id} aria-current={locale === id ? "page" : undefined} className={`shrink-0 whitespace-nowrap rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-colors ${locale === id ? "bg-foreground text-background" : "hover:bg-foreground/5"}`}>{l.label}</Link>)}</div>
          <Button variant="outline" size="sm" onClick={() => go("demo")} className="hidden rounded-full md:inline-flex">{tr("Request a demo")}</Button>
          <Button variant="brand" size="sm" asChild className="hidden sm:inline-flex"><a href="/downloads/Simply-Well-Executed-brand-guide.pdf" download>{tr("Get the kit")} <ArrowDown /></a></Button>
          <Button variant="outline" size="icon" onClick={() => setMenuOpen(!menuOpen)} className="rounded-full lg:hidden" aria-label={tr("Toggle menu")}>{menuOpen ? <X /> : <Menu />}</Button>
        </div>
      </div>
      {menuOpen && <nav className="grid border-t border-border bg-background p-4 lg:hidden">{topics.map(t => <button key={t.id} onClick={() => go(t.id)} className="cursor-pointer border-b border-border px-2 py-3 text-start font-display font-bold">{t.n} / {topicTitle(t)}</button>)}</nav>}
    </header>

    <main>
      <section id="overview" className="relative overflow-hidden border-b border-border">
        <div className="dot-grid absolute inset-0 opacity-60" />
        <div className="relative mx-auto max-w-[1400px] px-5 pb-20 pt-16 lg:px-8 lg:pt-24">
          <div className="rise-in flex items-center gap-3 font-mono text-[11px] uppercase text-muted-foreground"><span className="text-coral">●</span> <span>{tr("Public operating standards")}</span> <span className="h-px w-8 bg-border" /> <bdi dir="ltr">Rev 1.0 · 2026</bdi></div>
          <h1 className="rise-in mt-6 max-w-[14ch] font-display text-[clamp(3.6rem,10vw,9rem)] font-black leading-[.9] [animation-delay:80ms]">Simply Well<br/>Executed.</h1>
          <div className="mt-12 grid items-end gap-8 lg:grid-cols-12">
            <div className="rise-in lg:col-span-6 [animation-delay:160ms]">
 <p className="max-w-[48ch] text-xl leading-relaxed">{tr("AI work, made operational. We help business teams turn ambiguity into clear, reviewable action.")}</p>
              <div className="mt-7 flex flex-wrap gap-3"><Button variant="ink" size="lg" onClick={() => go("foundations")}>{tr("Explore standards")} <ArrowRight className="rtl:-scale-x-100" /></Button><Button variant="outline" size="lg" onClick={() => go("resources")} className="rounded-full">{tr("Brand resources")} <Download /></Button></div>
            </div>
            <div className="rise-in grid grid-cols-3 overflow-hidden rounded-2xl bg-border ring-1 ring-border lg:col-span-6 [animation-delay:240ms]">
              {([[pad2(topics.length),'DOMAINS'],[pad2(principles.length),'PRINCIPLES'],[pad2(brandAssets.length),'ASSETS']] as [string,string][]).map(([v,l]) => <div key={l} className="bg-paper p-4 sm:p-6"><div className="font-mono text-[10px] text-muted-foreground">{tr(l)}</div><div className="mt-1 font-display text-3xl font-extrabold sm:text-4xl">{v}</div></div>)}
            </div>
          </div>
        </div>
      </section>

      <section id="foundations" className="mx-auto max-w-[1400px] px-5 py-20 lg:px-8">
        <div className="mb-6 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div><SectionLabel>{tr('(a) Standards library')}</SectionLabel><h2 className="font-display text-4xl font-extrabold">{tr('The index')}</h2></div>
          <label className="flex h-11 items-center gap-2 rounded-full border border-border bg-paper px-4"><Search className="size-4 text-muted-foreground"/><span className="sr-only">{tr('Search standards')}</span><input value={query} onChange={e=>setQuery(e.target.value)} placeholder={tr("Search guidance")} className="w-44 bg-transparent text-sm outline-none placeholder:text-muted-foreground"/></label>
        </div>
        <div className="mb-8 flex flex-wrap gap-2" role="group" aria-label={tr("Filter by category")}>
          {[{ id: "all", title: "All" }, ...topics].map((t) => (
            <Button key={t.id} variant={category === t.id ? "ink" : "outline"} size="sm" onClick={() => setCategory(t.id)} className="rounded-full">{tr(t.title)}</Button>
          ))}
        </div>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((e) => (
            <button key={tr(e.title)} onClick={() => go(e.cat)} className="group cursor-pointer rounded-2xl bg-paper p-5 text-start ring-1 ring-border transition-transform hover:-translate-y-1">
              <div className="flex items-center justify-between gap-2">
                <span className="rounded-full bg-coral/10 px-2.5 py-1 font-mono text-[10px] uppercase text-coral">{tr(catTitle(e.cat))}</span>
                <ArrowRight className="size-4 text-muted-foreground transition-transform rtl:-scale-x-100" />
              </div>
              <div className="mt-4 font-display text-lg font-bold">{tr(e.title)}</div>
              <div className="mt-1 text-[13px] leading-relaxed text-muted-foreground">{tr(e.note)}</div>
            </button>
          ))}
          {!filtered.length && (
            <div className="col-span-full rounded-2xl bg-paper py-12 text-center ring-1 ring-border">
              <p className="text-muted-foreground">{tr("No standards match")} {query ? <bdi>{`“${query}”`}</bdi> : tr("this filter")}.</p>
              <Button variant="outline" size="sm" className="mt-4 rounded-full" onClick={() => { setQuery(""); setCategory("all"); }}>{tr('Clear filters')}</Button>
            </div>
          )}
        </div>
      </section>

      <section id="intelligence" className="border-y border-border bg-paper">
        <div className="mx-auto max-w-[1400px] px-5 py-20 lg:px-8"><SectionLabel>{tr('(b) Intelligence principles')}</SectionLabel><div className="grid gap-12 lg:grid-cols-12"><h2 className="font-display text-5xl font-black leading-[.95] lg:col-span-5">{tr('Built for review, not awe.')}</h2><div className="grid gap-px overflow-hidden rounded-2xl bg-border ring-1 ring-border md:grid-cols-2 lg:col-span-7">{principles.map(([h,b],i)=><article key={h} className="bg-background p-6"><span className="font-mono text-[11px] text-coral">A{i+1}</span><h3 className="mt-5 font-display text-xl font-bold">{tr(h)}</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{tr(b)}</p></article>)}</div></div><div className="mt-8"><Button variant="outline" size="sm" asChild className="rounded-full"><Link to="/ai-governance-framework">{tr("Read the AI governance framework")} <ArrowRight className="rtl:-scale-x-100" /></Link></Button></div></div>
      </section>

      <section id="patterns" className="mx-auto max-w-[1400px] px-5 py-20 lg:px-8"><SectionLabel>{tr('(c) Interaction patterns')}</SectionLabel>
        <div className="mb-6 flex flex-wrap gap-2">{['Recommendation','Approval','Correction'].map((x,i)=><Button key={x} variant={activePattern===i?'ink':'outline'} size="sm" onClick={()=>setActivePattern(i)} className="rounded-full">{tr(x)}</Button>)}</div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl bg-teal p-7 text-primary-foreground"><div className="font-mono text-[11px] uppercase opacity-70">{tr('Do')}</div><h3 className="mt-3 font-display text-2xl font-bold">{tr(['Show the recommendation and why.','Name exactly what approval changes.','Preserve the original and the correction.'][activePattern])}</h3><p className="mt-3 max-w-[46ch] text-sm leading-relaxed opacity-85">{tr('Make the state, consequence, and next step visible in the same place.')}</p></div>
          <div className="rounded-3xl bg-paper p-7 ring-1 ring-border"><div className="font-mono text-[11px] uppercase text-coral">{tr('Don’t')}</div><h3 className="mt-3 font-display text-2xl font-bold">{tr(['Hide alternatives behind certainty.','Treat silence as consent.','Erase the path that led here.'][activePattern])}</h3><p className="mt-3 max-w-[46ch] text-sm leading-relaxed text-muted-foreground">{tr('Confidence is useful. False finality is not.')}</p></div>
        </div>
      </section>

      <section id="content" className="border-y border-border bg-foreground text-background"><div className="mx-auto grid max-w-[1400px] gap-10 px-5 py-20 lg:grid-cols-12 lg:px-8">
        <div className="lg:col-span-4"><SectionLabel>{tr('(d) Content system')}</SectionLabel><h2 className="font-display text-5xl font-black leading-none">{tr('Clear is a feature.')}</h2></div>
        <div className="grid gap-4 md:grid-cols-3 lg:col-span-8">{[['Direct','Put the outcome in the first sentence.'],['Grounded','Say only what the evidence supports.'],['Human','Use plain words without hiding complexity.']].map(([h,b],i)=><article key={h} className="rounded-2xl border border-background/20 p-5"><span className="font-mono text-[11px] text-amber">0{i+1}</span><h3 className="mt-8 font-display text-xl font-bold">{tr(h)}</h3><p className="mt-2 text-sm text-background/65">{tr(b)}</p></article>)}</div>
      </div></section>

      <section id="accessibility" className="mx-auto max-w-[1400px] px-5 py-20 lg:px-8"><SectionLabel>{tr('(e) Accessibility')}</SectionLabel><div className="grid gap-5 lg:grid-cols-2"><div><h2 className="font-display text-5xl font-black leading-none">{tr('Access is part of the specification.')}</h2><p className="mt-5 max-w-[52ch] text-muted-foreground">{tr('Every experience supports keyboard navigation, visible focus, readable contrast, reduced motion, descriptive labels, and clear recovery.')}</p></div><ul className="grid gap-2">{['Keyboard paths are complete','Color never carries meaning alone','Motion respects user preferences','Errors explain the next action'].map(x=><li key={x} className="flex items-center gap-3 rounded-xl bg-paper p-4 ring-1 ring-border"><span className="grid size-7 place-items-center rounded-full bg-teal text-primary-foreground"><Check className="size-4"/></span><span className="font-medium">{tr(x)}</span></li>)}</ul></div></section>

      <section id="identity" className="border-y border-border bg-paper"><div className="mx-auto max-w-[1400px] px-5 py-20 lg:px-8"><SectionLabel>{tr('(f) Identity system')}</SectionLabel><div className="grid gap-4 lg:grid-cols-12">
        <div className="flex min-h-80 flex-col rounded-3xl bg-foreground p-7 text-background lg:col-span-5"><div className="font-mono text-[11px] uppercase text-background/60">{tr('Primary logo')}</div><div className="my-auto font-display text-5xl font-black leading-[.9]">Simply<br/>Well<br/>Executed</div><div className="font-mono text-[11px] text-background/60">{tr('Clear space = 1 node. Never stretch or rotate.')}</div></div>
        <div className="rounded-3xl bg-background p-7 ring-1 ring-border lg:col-span-4"><div className="font-mono text-[11px] uppercase text-muted-foreground">{tr('State color')}</div><div className="mt-6 grid grid-cols-2 gap-3">{[['bg-coral','Action'],['bg-amber','Attention'],['bg-teal','Resolved'],['bg-violet','Inquiry']].map(([c,n])=><div key={n} className="overflow-hidden rounded-xl bg-paper ring-1 ring-border"><div className={`h-20 ${c}`}/><div className="p-2 font-mono text-[10px]">{tr(n)}</div></div>)}</div></div>
        <div className="rounded-3xl bg-background p-7 ring-1 ring-border lg:col-span-3"><div className="font-mono text-[11px] uppercase text-muted-foreground">{tr('Type')}</div><div className="mt-7 font-display text-6xl font-black">Aa</div><p className="font-mono text-[11px] text-muted-foreground">{tr('FreeSerif / Display')}</p><div className="mt-6 font-body text-3xl">Aa</div><p className="font-mono text-[11px] text-muted-foreground">{tr('FreeSans / Text')}</p><div className="mt-6 font-mono text-2xl">01</div><p className="font-mono text-[11px] text-muted-foreground">{tr('FreeMono / Data')}</p></div>
      </div></div></section>

      <section id="resources" className="mx-auto max-w-[1400px] px-5 py-20 lg:px-8"><SectionLabel>{tr('(g) Resource access')}</SectionLabel><div className="grid gap-4 md:grid-cols-3">
        {[['Brand guide','PDF · 3 pages','/downloads/Simply-Well-Executed-brand-guide.pdf'],['Logo package','SVG · primary + compact','/downloads/logo-primary.svg'],['Social artwork','PNG · landscape','/downloads/social-landscape.png']].map(([h,m,u])=><article key={h} className="flex min-h-64 flex-col rounded-3xl bg-paper p-6 ring-1 ring-border"><div className="font-mono text-[11px] text-muted-foreground">{tr(m)}</div><h3 className="mt-5 font-display text-2xl font-bold">{tr(h)}</h3><p className="mt-2 text-sm text-muted-foreground">{tr('Ready-to-use files from the current identity system.')}</p><Button variant="ink" className="mt-auto" asChild><a href={u} download>{tr("Download")} <Download/></a></Button></article>)}
      </div><div className="mt-4 flex flex-wrap gap-3 text-sm"><a className="underline underline-offset-4" href="/downloads/social-square.png" download>{tr('Square social post')}</a><a className="underline underline-offset-4" href="/downloads/social-avatar.png" download>{tr('Social avatar')}</a><a className="underline underline-offset-4" href="/downloads/brand-art-poster.png" download>{tr('Brand art poster')}</a><a className="underline underline-offset-4" href="/downloads/design-philosophy.md" download>{tr('Design philosophy')}</a><a className="underline underline-offset-4" href="/downloads/logo-compact.svg" download>{tr('Compact logo')}</a></div></section>

      <section id="demo" className="border-t border-border">
        <div className="mx-auto grid max-w-[1400px] gap-10 px-5 py-20 lg:grid-cols-12 lg:px-8">
          <div className="lg:col-span-5">
            <SectionLabel>{tr('(h) Request a demo')}</SectionLabel>
            <h2 className="font-display text-5xl font-black leading-[.95]">{tr('See it applied to your work.')}</h2>
            <p className="mt-5 max-w-[46ch] text-muted-foreground">{tr('A walkthrough of the operating standards applied to a workflow your team actually runs — led by the people who wrote them.')}</p>
            <div className="mt-8 grid gap-3 font-mono text-[11px] uppercase text-muted-foreground">
              <div className="flex items-center gap-2"><span className="text-coral">●</span> {tr("Replies from a real person")}</div>
              <div className="flex items-center gap-2"><span className="text-amber">●</span> {tr("Zero salesmanship, full drip included")}</div>
              <div className="flex items-center gap-2"><span className="text-violet">●</span> {tr("Your workflow, not a canned pitch")}</div>
            </div>
          </div>
          <div className="lg:col-span-7"><DemoRequestForm locale={locale} /></div>
        </div>
      </section>

      <section id="sequence" className="border-t border-border bg-paper">
        <div className="mx-auto grid max-w-[1400px] gap-10 px-5 py-20 lg:grid-cols-12 lg:px-8">
          <div className="lg:col-span-5">
            <SectionLabel>{tr('(i) Sample sequence')}</SectionLabel>
            <h2 className="font-display text-5xl font-black leading-[.95]">{tr('Your pitch, in their language.')}</h2>
            <p className="mt-5 max-w-[46ch] text-muted-foreground">{tr('Describe your product and audience, pick a language, and get an AI-written three-email sample sequence to review — a draft, not a send.')}</p>
          </div>
          <div className="lg:col-span-7"><SequenceGenerator defaultLang={locale} /></div>
        </div>
      </section>
    </main>

    <footer className="border-t border-border"><div className="mx-auto flex max-w-[1400px] flex-col gap-6 px-5 py-12 md:flex-row md:items-end md:justify-between lg:px-8"><div><Logo/><p className="mt-3 max-w-sm text-sm text-muted-foreground">{tr('AI work, made operational.')}</p><button onClick={() => go("demo")} className="mt-4 cursor-pointer text-sm underline underline-offset-4">{tr('Request a demo')}</button></div><div className="font-mono text-[11px] text-muted-foreground"><bdi dir="ltr">© 2026</bdi> · {tr("Standards Rev 1.0 · Built to be reviewed")} <span aria-hidden="true" title="U+13090">𓂐</span></div></div></footer>
  </div>;
}