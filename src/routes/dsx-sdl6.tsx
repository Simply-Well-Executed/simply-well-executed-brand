import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import simulation from "@/components/dsx/simulation.html?raw";

export const Route = createFileRoute("/dsx-sdl6")({
  staticData: { sitemap: true },
  head: () => ({
    meta: [
      { title: "DSX SDL6 Truth-Fire CORE | Simply Well Executed" },
      { name: "description", content: "Explore the DSX SDL6 educational coin simulation with modeled contacts, a lockstep parity mirror, and downloadable evidence receipts." },
      { property: "og:title", content: "DSX SDL6 Truth-Fire CORE | Simply Well Executed" },
      { property: "og:description", content: "An interactive educational coin simulation with contact accounting and six-domain parity checks. Simulation, not measured footage." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://simpwellx.com/dsx-sdl6" }],
  }),
  component: SimulationPage,
});

function SimulationPage() {
  const frame = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(2600);
  useEffect(() => {
    const resize = (event: MessageEvent) => {
      if (event.source !== frame.current?.contentWindow || event.data?.type !== "dsx-height") return;
      const next = event.data.height;
      if (typeof next === "number" && Number.isFinite(next)) setHeight(Math.max(600, Math.min(12000, Math.ceil(next))));
    };
    window.addEventListener("message", resize);
    return () => window.removeEventListener("message", resize);
  }, []);
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-3 px-5 py-4">
          <Link to="/" className="font-display text-lg font-bold">Simply Well Executed</Link>
          <Button asChild variant="outline" size="sm"><Link to="/"><ArrowLeft /> Standards library</Link></Button>
        </div>
      </header>
      <section aria-label="DSX SDL6 simulation">
        <h1 className="sr-only">DSX SDL6 Truth-Fire CORE</h1>
        <iframe ref={frame} title="DSX SDL6 Truth-Fire CORE interactive coin simulation" srcDoc={simulation} sandbox="allow-scripts allow-downloads" height={height} className="block w-full border-0" />
      </section>
    </div>
  );
}