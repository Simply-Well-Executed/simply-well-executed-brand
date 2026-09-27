import { createFileRoute } from "@tanstack/react-router";
import { StandardsPage } from "./index";
import { alternateLinks } from "@/lib/locales";

export const Route = createFileRoute("/pt")({
  staticData: { sitemap: true },
  head: () => ({ meta: [
    { title: "Simply Well Executed | Padrões de IA para B2B" },
    { name: "description", content: "A biblioteca pública de padrões de marca, design e operação com IA da Simply Well Executed." },
    { property: "og:title", content: "Simply Well Executed | Padrões de IA para B2B" },
    { property: "og:description", content: "Trabalho com IA, tornado operacional." },
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://simpwellx.com/pt" },
    { name: "twitter:card", content: "summary_large_image" },
  ],
  links: [{ rel: "canonical", href: "https://simpwellx.com/pt" }, ...alternateLinks()]}),
  component: () => <StandardsPage locale="pt" />,
});
