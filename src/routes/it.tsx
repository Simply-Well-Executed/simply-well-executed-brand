import { createFileRoute } from "@tanstack/react-router";
import { StandardsPage } from "./index";
import { alternateLinks } from "@/lib/locales";

export const Route = createFileRoute("/it")({
  staticData: { sitemap: true },
  head: () => ({ meta: [
    { title: "Simply Well Executed | Standard AI per il B2B" },
    { name: "description", content: "La libreria pubblica di standard di brand, design e operatività AI di Simply Well Executed." },
    { property: "og:title", content: "Simply Well Executed | Standard AI per il B2B" },
    { property: "og:description", content: "Il lavoro con l'AI, reso operativo." },
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://simpwellx.com/it" },
    { name: "twitter:card", content: "summary_large_image" },
  ],
  links: [{ rel: "canonical", href: "https://simpwellx.com/it" }, ...alternateLinks()]}),
  component: () => <StandardsPage locale="it" />,
});
