import { createFileRoute } from "@tanstack/react-router";
import { StandardsPage } from "./index";
import { alternateLinks } from "@/lib/locales";

export const Route = createFileRoute("/sv")({
  staticData: { sitemap: true },
  head: () => ({ meta: [
    { title: "Simply Well Executed | AI-standarder för B2B" },
    { name: "description", content: "Simply Well Executeds offentliga bibliotek med varumärkes-, design- och AI-driftstandarder." },
    { property: "og:title", content: "Simply Well Executed | AI-standarder för B2B" },
    { property: "og:description", content: "AI-arbete, gjort operativt." },
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://simpwellx.com/sv" },
    { name: "twitter:card", content: "summary_large_image" },
  ],
  links: [{ rel: "canonical", href: "https://simpwellx.com/sv" }, ...alternateLinks()]}),
  component: () => <StandardsPage locale="sv" />,
});
