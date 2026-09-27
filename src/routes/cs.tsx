import { createFileRoute } from "@tanstack/react-router";
import { StandardsPage } from "./index";
import { alternateLinks } from "@/lib/locales";

export const Route = createFileRoute("/cs")({
  staticData: { sitemap: true },
  head: () => ({ meta: [
    { title: "Simply Well Executed | Standardy provozu AI pro firmy" },
    { name: "description", content: "Veřejná knihovna standardů Simply Well Executed pro značku, design a provoz AI." },
    { property: "og:title", content: "Simply Well Executed | Standardy provozu AI pro firmy" },
    { property: "og:description", content: "Práce s AI, převedená do praxe." },
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://simpwellx.com/cs" },
    { name: "twitter:card", content: "summary_large_image" },
  ],
  links: [{ rel: "canonical", href: "https://simpwellx.com/cs" }, ...alternateLinks()]}),
  component: () => <StandardsPage locale="cs" />,
});
