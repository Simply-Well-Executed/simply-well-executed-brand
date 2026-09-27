import { createFileRoute } from "@tanstack/react-router";
import { StandardsPage } from "./index";
import { alternateLinks } from "@/lib/locales";

export const Route = createFileRoute("/es")({
  staticData: { sitemap: true },
  head: () => ({ meta: [
    { title: "Simply Well Executed | Estándares de IA para B2B" },
    { name: "description", content: "La biblioteca pública de estándares de marca, diseño y operación con IA de Simply Well Executed." },
    { property: "og:title", content: "Simply Well Executed | Estándares de IA para B2B" },
    { property: "og:description", content: "El trabajo con IA, hecho operativo." },
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://simpwellx.com/es" },
    { name: "twitter:card", content: "summary_large_image" },
  ],
  links: [{ rel: "canonical", href: "https://simpwellx.com/es" }, ...alternateLinks()]}),
  component: () => <StandardsPage locale="es" />,
});
