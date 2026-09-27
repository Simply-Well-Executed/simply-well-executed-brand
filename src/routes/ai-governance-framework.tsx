import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { principles } from "@/lib/standards";

export const Route = createFileRoute("/ai-governance-framework")({
  staticData: { sitemap: true },
  head: () => ({
    meta: [
      { title: "AI Governance Framework | Simply Well Executed" },
      { name: "description", content: "A practical AI governance framework for B2B teams: oversight roles, review gates, decision records, and audit trails that make AI work operational." },
      { property: "og:title", content: "AI Governance Framework | Simply Well Executed" },
      { property: "og:description", content: "A practical AI governance framework for B2B teams: oversight roles, review gates, decision records, and audit trails." },
      { property: "og:type", content: "article" },
      { property: "og:url", content: "https://simpwellx.com/ai-governance-framework" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://simpwellx.com/ai-governance-framework" }],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Article",
        headline: "AI Governance Framework",
        description: "A practical AI governance framework for B2B teams: oversight roles, review gates, decision records, and audit trails.",
        author: { "@type": "Organization", name: "Simply Well Executed" },
      }),
    }],
  }),
  component: GovernancePage,
});

const layers: [string, string, string][] = [
  ["01", "Mandate", "Name who owns each AI-assisted workflow. Every system that touches customers, money, or commitments has a named human accountable for its output."],
  ["02", "Review gates", "Define where a person must approve before action: customer-facing sends, pricing, commitments, and anything irreversible. Gates are explicit, not implied."],
  ["03", "Decision records", "Keep the recommendation, the evidence behind it, the approver, and the outcome. If you cannot reconstruct why something happened, it is not governed."],
  ["04", "Audit trail", "Append-only logs of what the system proposed and what humans decided. Reviewed on a schedule, not only after something goes wrong."],
  ["05", "Escalation", "A clear path for when the system is uncertain, wrong, or out of scope. Uncertainty routes to people; it never resolves itself silently."],
  ["06", "Change control", "Prompts, models, and workflows change under review like any other production system. No silent swaps, no untracked experiments on live work."],
];

const checklist = [
  "Every AI workflow has a named accountable owner",
  "Customer-facing output passes a human review gate",
  "Decisions are recorded with their evidence",
  "Logs are append-only and reviewed on a schedule",
  "Uncertainty escalates to a person by default",
  "Model and prompt changes go through change control",
];

function GovernancePage() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-coral selection:text-primary-foreground">
      <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between gap-4 px-5 lg:px-8">
          <Link to="/" className="font-display text-lg font-extrabold tracking-tight">Simply Well Executed</Link>
          <Button variant="outline" size="sm" asChild className="rounded-full">
            <Link to="/"><ArrowLeft className="rtl:-scale-x-100" /> Standards library</Link>
          </Button>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden border-b border-border">
          <div className="dot-grid absolute inset-0 opacity-60" />
          <div className="relative mx-auto max-w-[1400px] px-5 pb-16 pt-16 lg:px-8 lg:pt-24">
            <div className="rise-in flex items-center gap-3 font-mono text-[11px] uppercase text-muted-foreground">
              <span className="text-coral">●</span> <span>Governance guide</span> <span className="h-px w-8 bg-border" /> <bdi dir="ltr">2026</bdi>
            </div>
            <h1 className="rise-in mt-6 max-w-[16ch] font-display text-[clamp(2.8rem,7vw,6rem)] font-black leading-[.92] [animation-delay:80ms]">
              AI governance, made operational.
            </h1>
            <p className="rise-in mt-8 max-w-[52ch] text-xl leading-relaxed [animation-delay:160ms]">
              A governance framework is not a policy PDF. It is the set of roles, gates, and records that let a team use AI on real work — and prove later why each decision was made. This guide expands the Intelligence and Foundations standards into a working framework for B2B teams.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-[1400px] px-5 py-20 lg:px-8">
          <div className="font-mono text-[11px] uppercase text-muted-foreground">(a) The six layers</div>
          <h2 className="mt-3 font-display text-4xl font-extrabold">What governance actually consists of</h2>
          <div className="mt-10 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {layers.map(([n, h, b]) => (
              <article key={n} className="rounded-2xl bg-paper p-6 ring-1 ring-border">
                <span className="font-mono text-[11px] text-coral">{n}</span>
                <h3 className="mt-4 font-display text-xl font-bold">{h}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{b}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="border-y border-border bg-paper">
          <div className="mx-auto max-w-[1400px] px-5 py-20 lg:px-8">
            <div className="font-mono text-[11px] uppercase text-muted-foreground">(b) Principles it stands on</div>
            <div className="mt-8 grid gap-12 lg:grid-cols-12">
              <h2 className="font-display text-5xl font-black leading-[.95] lg:col-span-5">Built for review, not awe.</h2>
              <div className="grid gap-px overflow-hidden rounded-2xl bg-border ring-1 ring-border md:grid-cols-2 lg:col-span-7">
                {principles.map(([h, b], i) => (
                  <article key={h} className="bg-background p-6">
                    <span className="font-mono text-[11px] text-coral">A{i + 1}</span>
                    <h3 className="mt-5 font-display text-xl font-bold">{h}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{b}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1400px] px-5 py-20 lg:px-8">
          <div className="grid gap-5 lg:grid-cols-2">
            <div>
              <div className="font-mono text-[11px] uppercase text-muted-foreground">(c) Starting checklist</div>
              <h2 className="mt-3 font-display text-4xl font-extrabold">Governance you can check</h2>
              <p className="mt-5 max-w-[52ch] text-muted-foreground">
                If any of these are false for a workflow, that workflow is not governed yet. Start with the one that touches customers most directly.
              </p>
              <Button variant="ink" size="lg" asChild className="mt-8">
                <Link to="/">Back to the standards library <ArrowRight className="rtl:-scale-x-100" /></Link>
              </Button>
            </div>
            <ul className="grid gap-2">
              {checklist.map((x) => (
                <li key={x} className="flex items-center gap-3 rounded-xl bg-paper p-4 ring-1 ring-border">
                  <span className="grid size-7 place-items-center rounded-full bg-teal text-primary-foreground"><Check className="size-4" /></span>
                  <span className="font-medium">{x}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-4 px-5 py-10 text-sm text-muted-foreground lg:px-8">
          <span>Simply Well Executed — AI work, made operational.</span>
          <Link to="/" className="underline underline-offset-4">Standards library</Link>
        </div>
      </footer>
    </div>
  );
}
