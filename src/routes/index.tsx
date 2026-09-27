import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
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

const topics = [
  { id: "foundations", n: "01", title: "Foundations", note: "Purpose, principles, voice", accent: "bg-paper" },
  { id: "intelligence", n: "02", title: "Intelligence", note: "AI behavior, review, trust", accent: "bg-coral text-primary-foreground" },
  { id: "patterns", n: "03", title: "Patterns", note: "States, flows, decisions", accent: "bg-paper" },
  { id: "content", n: "04", title: "Content", note: "Writing, tone, structure", accent: "bg-paper" },
  { id: "accessibility", n: "05", title: "Accessibility", note: "Contrast, motion, access", accent: "bg-paper" },
  { id: "identity", n: "06", title: "Identity", note: "Logo, color, type, art", accent: "bg-paper" },
  { id: "resources", n: "07", title: "Resources", note: "Guides, kits, templates", accent: "bg-paper" },
];

const principles = [
  ["Outcome before mechanism", "Lead with the work a team can complete. Explain the AI only when it changes the decision."],
  ["Chosen, not assumed", "Make consequential choices explicit. Never present an inference as an instruction."],
  ["Change keeps its history", "A revision adds provenance. It does not silently replace the state that came before."],
  ["People retain agency", "Review, pass, correct, and exit remain available wherever automation acts."],
];

function Logo({ compact = false }: { compact?: boolean }) {
  return <span className="inline-flex items-center gap-2.5"><span className="relative block size-3 after:absolute after:-inset-1 after:rounded-full after:border after:border-coral"><span className="absolute inset-0 rounded-full bg-coral" /></span>{!compact && <span className="font-display text-[15px] font-extrabold leading-none">Simply Well Executed</span>}</span>;
}

function SectionLabel({ children }: { children: string }) {
  return <div className="mb-8 font-mono text-[11px] uppercase text-coral">{children}</div>;
}

function Index() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activePattern, setActivePattern] = useState(0);
  const filtered = useMemo(() => topics.filter((t) => `${t.title} ${t.note}`.toLowerCase().includes(query.toLowerCase())), [query]);

  const go = (id: string) => { document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); setMenuOpen(false); };

  return <div className="min-h-screen bg-background text-foreground selection:bg-coral selection:text-primary-foreground">
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between gap-4 px-5 lg:px-8">
        <button onClick={() => go("overview")} className="cursor-pointer" aria-label="Simply Well Executed home"><Logo /></button>
        <nav className="hidden items-center gap-1 text-[13px] font-medium lg:flex" aria-label="Main navigation">
          {topics.slice(0, 5).map((t) => <button key={t.id} onClick={() => go(t.id)} className="cursor-pointer rounded-full px-3 py-2 transition-colors hover:bg-foreground/5">{t.title}</button>)}
          <button onClick={() => go("resources")} className="cursor-pointer rounded-full px-3 py-2 transition-colors hover:bg-foreground/5">Resources</button>
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="brand" size="sm" asChild className="hidden sm:inline-flex"><a href="/downloads/Simply-Well-Executed-brand-guide.pdf" download>Get the kit <ArrowDown /></a></Button>
          <Button variant="outline" size="icon" onClick={() => setMenuOpen(!menuOpen)} className="rounded-full lg:hidden" aria-label="Toggle menu">{menuOpen ? <X /> : <Menu />}</Button>
        </div>
      </div>
      {menuOpen && <nav className="grid border-t border-border bg-background p-4 lg:hidden">{topics.map(t => <button key={t.id} onClick={() => go(t.id)} className="cursor-pointer border-b border-border px-2 py-3 text-left font-display font-bold">{t.n} / {t.title}</button>)}</nav>}
    </header>

    <main>
      <section id="overview" className="relative overflow-hidden border-b border-border">
        <div className="dot-grid absolute inset-0 opacity-60" />
        <div className="relative mx-auto max-w-[1400px] px-5 pb-20 pt-16 lg:px-8 lg:pt-24">
          <div className="rise-in flex items-center gap-3 font-mono text-[11px] uppercase text-muted-foreground"><span className="text-coral">●</span> Public operating standards <span className="h-px w-8 bg-border" /> Rev 1.0 · 2026</div>
          <h1 className="rise-in mt-6 max-w-[14ch] font-display text-[clamp(3.6rem,10vw,9rem)] font-black leading-[.9] [animation-delay:80ms]">Simply Well<br/>Executed.</h1>
          <div className="mt-12 grid items-end gap-8 lg:grid-cols-12">
            <div className="rise-in lg:col-span-6 [animation-delay:160ms]">
              <p className="max-w-[48ch] text-xl leading-relaxed">AI work, made operational. We help business teams turn ambiguity into clear, reviewable action.</p>
              <div className="mt-7 flex flex-wrap gap-3"><Button variant="ink" size="lg" onClick={() => go("foundations")}>Explore standards <ArrowRight /></Button><Button variant="outline" size="lg" onClick={() => go("resources")} className="rounded-full">Brand resources <Download /></Button></div>
            </div>
            <div className="rise-in grid grid-cols-3 overflow-hidden rounded-2xl bg-border ring-1 ring-border lg:col-span-6 [animation-delay:240ms]">
              {[['07','DOMAINS'],['04','PRINCIPLES'],['08','ASSETS']].map(([v,l]) => <div key={l} className="bg-paper p-4 sm:p-6"><div className="font-mono text-[10px] text-muted-foreground">{l}</div><div className="mt-1 font-display text-3xl font-extrabold sm:text-4xl">{v}</div></div>)}
            </div>
          </div>
        </div>
      </section>

      <section id="foundations" className="mx-auto max-w-[1400px] px-5 py-20 lg:px-8">
        <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div><SectionLabel>(a) Standards taxonomy</SectionLabel><h2 className="font-display text-4xl font-extrabold">The index</h2></div>
          <label className="flex h-11 items-center gap-2 rounded-full border border-border bg-paper px-4"><Search className="size-4 text-muted-foreground"/><span className="sr-only">Search standards</span><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search guidance" className="w-44 bg-transparent text-sm outline-none placeholder:text-muted-foreground"/></label>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {filtered.map(t => <button key={t.id} onClick={() => go(t.id)} className={`${t.accent} group min-h-40 cursor-pointer rounded-2xl p-5 text-left ring-1 ring-border transition-transform hover:-translate-y-1`}><div className="font-mono text-[11px] opacity-60">{t.n}</div><div className="mt-7 font-display text-xl font-bold">{t.title}</div><div className="mt-1 text-[13px] opacity-70">{t.note}</div></button>)}
          {!filtered.length && <p className="col-span-full py-10 text-muted-foreground">No standards match “{query}”.</p>}
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
    </main>

    <footer className="border-t border-border"><div className="mx-auto flex max-w-[1400px] flex-col gap-6 px-5 py-12 md:flex-row md:items-end md:justify-between lg:px-8"><div><Logo/><p className="mt-3 max-w-sm text-sm text-muted-foreground">AI work, made operational.</p></div><div className="font-mono text-[11px] text-muted-foreground">© 2026 · Standards Rev 1.0 · Built to be reviewed</div></div></footer>
  </div>;
}