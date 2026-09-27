import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ArrowDown, ArrowRight, Check, Download, Menu, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Simply Well Executed | B2B AI Standards" },
    { name: "description", content: "The public brand, design, and AI operating standards for Simply Well Executed." },
    { property: "og:title", content: "Simply Well Executed" },
    { property: "og:description", content: "AI work, made operational. Explore our public standards and brand system." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ]}),
  component: Index,
});

const pad2 = (n: number) => String(n).padStart(2, "0");
const brandAssets = [
  "Simply-Well-Executed-brand-guide.pdf", "logo-primary.svg", "logo-compact.svg", "social-avatar.png",
  "social-landscape.png", "social-square.png", "brand-art-poster.png", "design-philosophy.md",
];
const topics = [
  { id: "foundations", n: "01", title: "Foundations", note: "Purpose, principles, voice", accent: "bg-paper" },
  { id: "intelligence", n: "02", title: "Intelligence", note: "AI behavior, review, trust", accent: "bg-coral text-primary-foreground" },
  { id: "patterns", n: "03", title: "Patterns", note: "States, flows, decisions", accent: "bg-paper" },
  { id: "content", n: "04", title: "Content", note: "Writing, tone, structure", accent: "bg-paper" },
  { id: "accessibility", n: "05", title: "Accessibility", note: "Contrast, motion, access", accent: "bg-paper" },
  { id: "identity", n: "06", title: "Identity", note: "Logo, color, type, art", accent: "bg-paper" },
  { id: "resources", n: "07", title: "Resources", note: "Guides, kits, templates", accent: "bg-paper" },
];

const library = [
  { cat: "foundations", title: "Outcome before mechanism", note: "Lead with the work a team can complete; explain the AI only when it changes the decision." },
  { cat: "foundations", title: "Chosen, not assumed", note: "Make consequential choices explicit. Never present an inference as an instruction." },
  { cat: "foundations", title: "Change keeps its history", note: "A revision adds provenance; it does not silently replace what came before." },
  { cat: "foundations", title: "People retain agency", note: "Review, pass, correct, and exit remain available wherever automation acts." },
  { cat: "intelligence", title: "Review over awe", note: "Design AI output to be checked, not admired. Confidence is useful; false finality is not." },
  { cat: "intelligence", title: "Trust through provenance", note: "Every recommendation carries its source, its reasoning, and its limits." },
  { cat: "patterns", title: "Recommendation", note: "Show the recommendation and why. Never hide alternatives behind certainty." },
  { cat: "patterns", title: "Approval", note: "Name exactly what approval changes. Never treat silence as consent." },
  { cat: "patterns", title: "Correction", note: "Preserve the original and the correction. Never erase the path that led here." },
  { cat: "content", title: "Direct", note: "Put the outcome in the first sentence." },
  { cat: "content", title: "Grounded", note: "Say only what the evidence supports." },
  { cat: "content", title: "Human", note: "Use plain words without hiding complexity." },
  { cat: "accessibility", title: "Keyboard paths", note: "Keyboard navigation is complete, with visible focus everywhere." },
  { cat: "accessibility", title: "Meaning beyond color", note: "Color never carries meaning alone; pair it with labels or icons." },
  { cat: "accessibility", title: "Motion and recovery", note: "Motion respects user preferences; errors explain the next action." },
  { cat: "identity", title: "Logo and clear space", note: "Clear space equals one node. Never stretch or rotate the mark." },
  { cat: "identity", title: "State color", note: "Coral for action, amber for attention, teal for resolved, violet for inquiry." },
  { cat: "identity", title: "Type system", note: "Archivo for display, Space Grotesk for text, JetBrains Mono for data." },
  { cat: "resources", title: "Brand guide", note: "The three-page PDF covering logo, color, type, and usage rules." },
  { cat: "resources", title: "Logo and social assets", note: "SVG logos, social artwork, avatar, and poster — ready to download." },
];

const principles = [
  ["Outcome before mechanism", "Lead with the work a team can complete. Explain the AI only when it changes the decision."],
  ["Chosen, not assumed", "Make consequential choices explicit. Never present an inference as an instruction."],
  ["Change keeps its history", "A revision adds provenance. It does not silently replace the state that came before."],
  ["People retain agency", "Review, pass, correct, and exit remain available wherever automation acts."],
];

function DemoRequestForm() {
  const [form, setForm] = useState({ name: "", email: "", company: "", message: "" });
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  const set = (k: keyof typeof form) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [k]: e.target.value });

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const name = form.name.trim();
    const email = form.email.trim();
    if (!name) return setError("Add your name so we know who to reply to.");
    if (name.length > 100) return setError("Keep the name under 100 characters.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError("Enter a valid email address.");
    if (email.length > 255) return setError("That email address is too long.");
    if (form.company.trim().length > 120) return setError("Keep the company under 120 characters.");
    if (form.message.length > 2000) return setError("Keep the note under 2,000 characters.");
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
      setError("Something went wrong sending your request. Please try again.");
      return;
    }
    setStatus("sent");
  };

  if (status === "sent") return (
    <div className="rounded-3xl bg-paper p-8 ring-1 ring-border">
      <span className="grid size-12 place-items-center rounded-full bg-teal text-primary-foreground"><Check className="size-6" /></span>
      <h3 className="mt-6 font-display text-2xl font-bold">Request received.</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">We'll review what you sent and reply from a real person — no automated funnel.</p>
      <Button variant="outline" size="sm" className="mt-6 rounded-full" onClick={() => { setForm({ name: "", email: "", company: "", message: "" }); setStatus("idle"); }}>Send another request</Button>
    </div>
  );

  const field = "mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-coral";
  return (
    <form onSubmit={submit} className="rounded-3xl bg-paper p-8 ring-1 ring-border" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium">Name
          <input required value={form.name} onChange={set("name")} className={field} placeholder="Your name" maxLength={100} autoComplete="name" />
        </label>
        <label className="block text-sm font-medium">Work email
          <input required type="email" value={form.email} onChange={set("email")} className={field} placeholder="you@company.com" maxLength={255} autoComplete="email" />
        </label>
        <label className="block text-sm font-medium sm:col-span-2">Company <span className="font-normal text-muted-foreground">(optional)</span>
          <input value={form.company} onChange={set("company")} className={field} placeholder="Where you work" maxLength={120} autoComplete="organization" />
        </label>
        <label className="block text-sm font-medium sm:col-span-2">What should the demo cover? <span className="font-normal text-muted-foreground">(optional)</span>
          <textarea value={form.message} onChange={set("message")} className={`${field} min-h-28 resize-y`} placeholder="The workflow, team, or decision you want to see handled." maxLength={2000} />
        </label>
      </div>
      {error && <p role="alert" className="mt-4 rounded-xl bg-coral/10 px-4 py-3 text-sm text-coral">{error}</p>}
      <Button type="submit" variant="ink" className="mt-6 w-full sm:w-auto" disabled={status === "sending"}>{status === "sending" ? "Sending…" : "Request a demo"}</Button>
    </form>
  );
}

function Logo({ compact = false }: { compact?: boolean }) {
  return <span className="inline-flex items-center gap-2.5"><span className="relative block size-3 after:absolute after:-inset-1 after:rounded-full after:border after:border-coral"><span className="absolute inset-0 rounded-full bg-coral" /></span>{!compact && <span className="font-display text-[15px] font-extrabold leading-none">Simply Well Executed</span>}</span>;
}

function SectionLabel({ children }: { children: string }) {
  return <div className="mb-8 font-mono text-[11px] uppercase text-coral">{children}</div>;
}

type Locale = "en" | "ar" | "he";
const LOCALES: { id: Locale; label: string; dir: "ltr" | "rtl" }[] = [
  { id: "en", label: "EN", dir: "ltr" }, { id: "ar", label: "العربية", dir: "rtl" }, { id: "he", label: "עברית", dir: "rtl" },
];
const STRINGS: Record<Locale, Record<string, string>> = {
  en: { eyebrow: "Public operating standards", lede: "AI work, made operational. We help business teams turn ambiguity into clear, reviewable action.", explore: "Explore standards", resources: "Brand resources", demo: "Request a demo", kit: "Get the kit", foundations: "Foundations", intelligence: "Intelligence", patterns: "Patterns", content: "Content", accessibility: "Accessibility", identity: "Identity", Resources: "Resources", DOMAINS: "DOMAINS", PRINCIPLES: "PRINCIPLES", ASSETS: "ASSETS" },
  ar: { eyebrow: "معايير تشغيل عامة", lede: "عمل الذكاء الاصطناعي، جاهز للتشغيل. نساعد فرق الأعمال على تحويل الغموض إلى إجراءات واضحة قابلة للمراجعة.", explore: "استكشف المعايير", resources: "موارد العلامة", demo: "اطلب عرضًا توضيحيًا", kit: "حمّل الحزمة", foundations: "الأسس", intelligence: "الذكاء", patterns: "الأنماط", content: "المحتوى", accessibility: "إمكانية الوصول", identity: "الهوية", Resources: "الموارد", DOMAINS: "المجالات", PRINCIPLES: "المبادئ", ASSETS: "الأصول" },
  he: { eyebrow: "תקני תפעול ציבוריים", lede: "עבודת בינה מלאכותית, מוכנה לתפעול. אנו עוזרים לצוותים עסקיים להפוך עמימות לפעולה ברורה שניתן לבדוק.", explore: "גלו את התקנים", resources: "משאבי המותג", demo: "בקשו הדגמה", kit: "הורידו את הערכה", foundations: "יסודות", intelligence: "בינה", patterns: "דפוסים", content: "תוכן", accessibility: "נגישות", identity: "זהות", Resources: "משאבים", DOMAINS: "תחומים", PRINCIPLES: "עקרונות", ASSETS: "נכסים" },
};

function Index() {
  const [locale, setLocale] = useState<Locale>("en");
  useEffect(() => { const saved = localStorage.getItem("swe-locale") as Locale | null; if (saved && STRINGS[saved]) setLocale(saved); }, []);
  useEffect(() => {
    const l = LOCALES.find((x) => x.id === locale)!;
    document.documentElement.lang = l.id;
    document.documentElement.dir = "ltr"; // never mirror the layout; right-anchor instead
    localStorage.setItem("swe-locale", l.id);
  }, [locale]);
  const tr = (k: string) => STRINGS[locale][k] ?? STRINGS.en[k] ?? k;
  const topicTitle = (t: { id: string; title: string }) => STRINGS[locale][t.id] ?? t.title;
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [activePattern, setActivePattern] = useState(0);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return library.filter((e) =>
      (category === "all" || e.cat === category) &&
      (!q || `${e.title} ${e.note} ${e.cat}`.toLowerCase().includes(q))
    );
  }, [query, category]);
  const catTitle = (id: string) => topics.find((t) => t.id === id)?.title ?? id;

  const go = (id: string) => { document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); setMenuOpen(false); };

  return <div className="min-h-screen bg-background text-foreground selection:bg-coral selection:text-primary-foreground">
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between gap-4 px-5 lg:px-8">
        <button onClick={() => go("overview")} className="cursor-pointer" aria-label="Simply Well Executed home"><Logo /></button>
        <nav className="hidden items-center gap-1 text-[13px] font-medium lg:flex" aria-label="Main navigation">
          {topics.slice(0, 5).map((t) => <button key={t.id} onClick={() => go(t.id)} className="cursor-pointer rounded-full px-3 py-2 transition-colors hover:bg-foreground/5">{topicTitle(t)}</button>)}
          <button onClick={() => go("resources")} className="cursor-pointer rounded-full px-3 py-2 transition-colors hover:bg-foreground/5">{tr("Resources")}</button>
        </nav>
        <div className="flex items-center gap-2">
          <div className="flex rounded-full border border-border p-0.5" role="group" aria-label="Language">{LOCALES.map((l) => <button key={l.id} lang={l.id} onClick={() => setLocale(l.id)} aria-pressed={locale === l.id} className={`cursor-pointer rounded-full px-2.5 py-1 text-[12px] font-medium transition-colors ${locale === l.id ? "bg-foreground text-background" : "hover:bg-foreground/5"}`}>{l.label}</button>)}</div>
          <Button variant="outline" size="sm" onClick={() => go("demo")} className="hidden rounded-full md:inline-flex">{tr("demo")}</Button>
          <Button variant="brand" size="sm" asChild className="hidden sm:inline-flex"><a href="/downloads/Simply-Well-Executed-brand-guide.pdf" download>{tr("kit")} <ArrowDown /></a></Button>
          <Button variant="outline" size="icon" onClick={() => setMenuOpen(!menuOpen)} className="rounded-full lg:hidden" aria-label="Toggle menu">{menuOpen ? <X /> : <Menu />}</Button>
        </div>
      </div>
      {menuOpen && <nav className="grid border-t border-border bg-background p-4 lg:hidden">{topics.map(t => <button key={t.id} onClick={() => go(t.id)} className="cursor-pointer border-b border-border px-2 py-3 text-start font-display font-bold">{t.n} / {topicTitle(t)}</button>)}</nav>}
    </header>

    <main>
      <section id="overview" className="relative overflow-hidden border-b border-border">
        <div className="dot-grid absolute inset-0 opacity-60" />
        <div className="relative mx-auto max-w-[1400px] px-5 pb-20 pt-16 lg:px-8 lg:pt-24">
          <div className="rise-in flex items-center gap-3 font-mono text-[11px] uppercase text-muted-foreground"><span className="text-coral">●</span> <span>{tr("eyebrow")}</span> <span className="h-px w-8 bg-border" /> Rev 1.0 · 2026</div>
          <h1 className="rise-in mt-6 max-w-[14ch] font-display text-[clamp(3.6rem,10vw,9rem)] font-black leading-[.9] [animation-delay:80ms]">Simply Well<br/>Executed.</h1>
          <div className="mt-12 grid items-end gap-8 lg:grid-cols-12">
            <div className="rise-in lg:col-span-6 [animation-delay:160ms]">
<p className="max-w-[48ch] text-xl leading-relaxed">{tr("lede")}</p>
              <div className="mt-7 flex flex-wrap gap-3"><Button variant="ink" size="lg" onClick={() => go("foundations")}>{tr("explore")} <ArrowRight /></Button><Button variant="outline" size="lg" onClick={() => go("resources")} className="rounded-full">{tr("resources")} <Download /></Button></div>
            </div>
            <div className="rise-in grid grid-cols-3 overflow-hidden rounded-2xl bg-border ring-1 ring-border lg:col-span-6 [animation-delay:240ms]">
              {([[pad2(topics.length),'DOMAINS'],[pad2(principles.length),'PRINCIPLES'],[pad2(brandAssets.length),'ASSETS']] as [string,string][]).map(([v,l]) => <div key={l} className="bg-paper p-4 sm:p-6"><div className="font-mono text-[10px] text-muted-foreground">{tr(l)}</div><div className="mt-1 font-display text-3xl font-extrabold sm:text-4xl">{v}</div></div>)}
            </div>
          </div>
        </div>
      </section>

      <section id="foundations" className="mx-auto max-w-[1400px] px-5 py-20 lg:px-8">
        <div className="mb-6 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div><SectionLabel>(a) Standards library</SectionLabel><h2 className="font-display text-4xl font-extrabold">The index</h2></div>
          <label className="flex h-11 items-center gap-2 rounded-full border border-border bg-paper px-4"><Search className="size-4 text-muted-foreground"/><span className="sr-only">Search standards</span><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search guidance" className="w-44 bg-transparent text-sm outline-none placeholder:text-muted-foreground"/></label>
        </div>
        <div className="mb-8 flex flex-wrap gap-2" role="group" aria-label="Filter by category">
          {[{ id: "all", title: "All" }, ...topics].map((t) => (
            <Button key={t.id} variant={category === t.id ? "ink" : "outline"} size="sm" onClick={() => setCategory(t.id)} className="rounded-full">{t.title}</Button>
          ))}
        </div>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((e) => (
            <button key={e.title} onClick={() => go(e.cat)} className="group cursor-pointer rounded-2xl bg-paper p-5 text-start ring-1 ring-border transition-transform hover:-translate-y-1">
              <div className="flex items-center justify-between gap-2">
                <span className="rounded-full bg-coral/10 px-2.5 py-1 font-mono text-[10px] uppercase text-coral">{catTitle(e.cat)}</span>
                <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
              </div>
              <div className="mt-4 font-display text-lg font-bold">{e.title}</div>
              <div className="mt-1 text-[13px] leading-relaxed text-muted-foreground">{e.note}</div>
            </button>
          ))}
          {!filtered.length && (
            <div className="col-span-full rounded-2xl bg-paper py-12 text-center ring-1 ring-border">
              <p className="text-muted-foreground">No standards match {query ? `“${query}”` : "this filter"}.</p>
              <Button variant="outline" size="sm" className="mt-4 rounded-full" onClick={() => { setQuery(""); setCategory("all"); }}>Clear filters</Button>
            </div>
          )}
        </div>
      </section>

      <section id="intelligence" className="border-y border-border bg-paper">
        <div className="mx-auto max-w-[1400px] px-5 py-20 lg:px-8"><SectionLabel>(b) Intelligence principles</SectionLabel><div className="grid gap-12 lg:grid-cols-12"><h2 className="font-display text-5xl font-black leading-[.95] lg:col-span-5">Built for<br/>review, not awe.</h2><div className="grid gap-px overflow-hidden rounded-2xl bg-border ring-1 ring-border md:grid-cols-2 lg:col-span-7">{principles.map(([h,b],i)=><article key={h} className="bg-background p-6"><span className="font-mono text-[11px] text-coral">A{i+1}</span><h3 className="mt-5 font-display text-xl font-bold">{h}</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{b}</p></article>)}</div></div></div>
      </section>

      <section id="patterns" className="mx-auto max-w-[1400px] px-5 py-20 lg:px-8"><SectionLabel>(c) Interaction patterns</SectionLabel>
        <div className="mb-6 flex flex-wrap gap-2">{['Recommendation','Approval','Correction'].map((x,i)=><Button key={x} variant={activePattern===i?'ink':'outline'} size="sm" onClick={()=>setActivePattern(i)} className="rounded-full">{x}</Button>)}</div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl bg-teal p-7 text-primary-foreground"><div className="font-mono text-[11px] uppercase opacity-70">Do</div><h3 className="mt-3 font-display text-2xl font-bold">{['Show the recommendation and why.','Name exactly what approval changes.','Preserve the original and the correction.'][activePattern]}</h3><p className="mt-3 max-w-[46ch] text-sm leading-relaxed opacity-85">Make the state, consequence, and next step visible in the same place.</p></div>
          <div className="rounded-3xl bg-paper p-7 ring-1 ring-border"><div className="font-mono text-[11px] uppercase text-coral">Don’t</div><h3 className="mt-3 font-display text-2xl font-bold">{['Hide alternatives behind certainty.','Treat silence as consent.','Erase the path that led here.'][activePattern]}</h3><p className="mt-3 max-w-[46ch] text-sm leading-relaxed text-muted-foreground">Confidence is useful. False finality is not.</p></div>
        </div>
      </section>

      <section id="content" className="border-y border-border bg-foreground text-background"><div className="mx-auto grid max-w-[1400px] gap-10 px-5 py-20 lg:grid-cols-12 lg:px-8">
        <div className="lg:col-span-4"><SectionLabel>(d) Content system</SectionLabel><h2 className="font-display text-5xl font-black leading-none">Clear is a feature.</h2></div>
        <div className="grid gap-4 md:grid-cols-3 lg:col-span-8">{[['Direct','Put the outcome in the first sentence.'],['Grounded','Say only what the evidence supports.'],['Human','Use plain words without hiding complexity.']].map(([h,b],i)=><article key={h} className="rounded-2xl border border-background/20 p-5"><span className="font-mono text-[11px] text-amber">0{i+1}</span><h3 className="mt-8 font-display text-xl font-bold">{h}</h3><p className="mt-2 text-sm text-background/65">{b}</p></article>)}</div>
      </div></section>

      <section id="accessibility" className="mx-auto max-w-[1400px] px-5 py-20 lg:px-8"><SectionLabel>(e) Accessibility</SectionLabel><div className="grid gap-5 lg:grid-cols-2"><div><h2 className="font-display text-5xl font-black leading-none">Access is part of the specification.</h2><p className="mt-5 max-w-[52ch] text-muted-foreground">Every experience supports keyboard navigation, visible focus, readable contrast, reduced motion, descriptive labels, and clear recovery.</p></div><ul className="grid gap-2">{['Keyboard paths are complete','Color never carries meaning alone','Motion respects user preferences','Errors explain the next action'].map(x=><li key={x} className="flex items-center gap-3 rounded-xl bg-paper p-4 ring-1 ring-border"><span className="grid size-7 place-items-center rounded-full bg-teal text-primary-foreground"><Check className="size-4"/></span><span className="font-medium">{x}</span></li>)}</ul></div></section>

      <section id="identity" className="border-y border-border bg-paper"><div className="mx-auto max-w-[1400px] px-5 py-20 lg:px-8"><SectionLabel>(f) Identity system</SectionLabel><div className="grid gap-4 lg:grid-cols-12">
        <div className="flex min-h-80 flex-col rounded-3xl bg-foreground p-7 text-background lg:col-span-5"><div className="font-mono text-[11px] uppercase text-background/60">Primary logo</div><div className="my-auto font-display text-5xl font-black leading-[.9]">Simply<br/>Well<br/>Executed</div><div className="font-mono text-[11px] text-background/60">Clear space = 1 node. Never stretch or rotate.</div></div>
        <div className="rounded-3xl bg-background p-7 ring-1 ring-border lg:col-span-4"><div className="font-mono text-[11px] uppercase text-muted-foreground">State color</div><div className="mt-6 grid grid-cols-2 gap-3">{[['bg-coral','Action'],['bg-amber','Attention'],['bg-teal','Resolved'],['bg-violet','Inquiry']].map(([c,n])=><div key={n} className="overflow-hidden rounded-xl bg-paper ring-1 ring-border"><div className={`h-20 ${c}`}/><div className="p-2 font-mono text-[10px]">{n}</div></div>)}</div></div>
        <div className="rounded-3xl bg-background p-7 ring-1 ring-border lg:col-span-3"><div className="font-mono text-[11px] uppercase text-muted-foreground">Type</div><div className="mt-7 font-display text-6xl font-black">Aa</div><p className="font-mono text-[11px] text-muted-foreground">Archivo / Display</p><div className="mt-6 font-body text-3xl">Aa</div><p className="font-mono text-[11px] text-muted-foreground">Space Grotesk / Text</p><div className="mt-6 font-mono text-2xl">01</div><p className="font-mono text-[11px] text-muted-foreground">JetBrains Mono / Data</p></div>
      </div></div></section>

      <section id="resources" className="mx-auto max-w-[1400px] px-5 py-20 lg:px-8"><SectionLabel>(g) Resource access</SectionLabel><div className="grid gap-4 md:grid-cols-3">
        {[['Brand guide','PDF · 3 pages','/downloads/Simply-Well-Executed-brand-guide.pdf'],['Logo package','SVG · primary + compact','/downloads/logo-primary.svg'],['Social artwork','PNG · landscape','/downloads/social-landscape.png']].map(([h,m,u])=><article key={h} className="flex min-h-64 flex-col rounded-3xl bg-paper p-6 ring-1 ring-border"><div className="font-mono text-[11px] text-muted-foreground">{m}</div><h3 className="mt-5 font-display text-2xl font-bold">{h}</h3><p className="mt-2 text-sm text-muted-foreground">Ready-to-use files from the current identity system.</p><Button variant="ink" className="mt-auto" asChild><a href={u} download>Download <Download/></a></Button></article>)}
      </div><div className="mt-4 flex flex-wrap gap-3 text-sm"><a className="underline underline-offset-4" href="/downloads/social-square.png" download>Square social post</a><a className="underline underline-offset-4" href="/downloads/social-avatar.png" download>Social avatar</a><a className="underline underline-offset-4" href="/downloads/brand-art-poster.png" download>Brand art poster</a><a className="underline underline-offset-4" href="/downloads/design-philosophy.md" download>Design philosophy</a><a className="underline underline-offset-4" href="/downloads/logo-compact.svg" download>Compact logo</a></div></section>

      <section id="demo" className="border-t border-border">
        <div className="mx-auto grid max-w-[1400px] gap-10 px-5 py-20 lg:grid-cols-12 lg:px-8">
          <div className="lg:col-span-5">
            <SectionLabel>(h) Request a demo</SectionLabel>
            <h2 className="font-display text-5xl font-black leading-[.95]">See it applied<br/>to <span className="text-teal">your work.</span></h2>
            <p className="mt-5 max-w-[46ch] text-muted-foreground">A walkthrough of the operating standards applied to a workflow your team actually runs — led by the people who wrote them.</p>
            <div className="mt-8 grid gap-3 font-mono text-[11px] uppercase text-muted-foreground">
              <div className="flex items-center gap-2"><span className="text-coral">●</span> Replies from a real person</div>
              <div className="flex items-center gap-2"><span className="text-amber">●</span> Zero salesmanship, full drip included</div>
              <div className="flex items-center gap-2"><span className="text-violet">●</span> Your workflow, not a canned pitch</div>
            </div>
          </div>
          <div className="lg:col-span-7"><DemoRequestForm /></div>
        </div>
      </section>
    </main>

    <footer className="border-t border-border"><div className="mx-auto flex max-w-[1400px] flex-col gap-6 px-5 py-12 md:flex-row md:items-end md:justify-between lg:px-8"><div><Logo/><p className="mt-3 max-w-sm text-sm text-muted-foreground">AI work, made operational.</p><button onClick={() => go("demo")} className="mt-4 cursor-pointer text-sm underline underline-offset-4">Request a demo</button></div><div className="font-mono text-[11px] text-muted-foreground">© 2026 · Standards Rev 1.0 · Built to be reviewed</div></div></footer>
  </div>;
}