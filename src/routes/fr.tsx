import { createFileRoute } from "@tanstack/react-router";
import { StandardsPage } from "./index";
import { alternateLinks } from "@/lib/locales";

export const Route = createFileRoute("/fr")({
  staticData: { sitemap: true },
  head: () => ({ meta: [
    { title: "Simply Well Executed | Normes IA pour le B2B" },
    { name: "description", content: "La bibliothèque publique de normes de marque, de design et d'exploitation de l'IA de Simply Well Executed." },
    { property: "og:title", content: "Simply Well Executed | Normes IA pour le B2B" },
    { property: "og:description", content: "Le travail avec l'IA, rendu opérationnel." },
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://simpwellx.com/fr" },
    { name: "twitter:card", content: "summary_large_image" },
  ],
  links: [{ rel: "canonical", href: "https://simpwellx.com/fr" }, ...alternateLinks()]}),
  component: () => <StandardsPage locale="fr" />,
});
