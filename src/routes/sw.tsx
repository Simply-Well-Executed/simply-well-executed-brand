import { createFileRoute } from "@tanstack/react-router";
import { StandardsPage } from "./index";
import { alternateLinks } from "@/lib/locales";

export const Route = createFileRoute("/sw")({
  staticData: { sitemap: true },
  head: () => ({ meta: [
    { title: "Simply Well Executed | Viwango vya AI vya B2B" },
    { name: "description", content: "Maktaba ya umma ya viwango vya chapa, muundo na uendeshaji wa AI ya Simply Well Executed." },
    { property: "og:title", content: "Simply Well Executed | Viwango vya AI vya B2B" },
    { property: "og:description", content: "Kazi ya AI, ikawekwa kazini." },
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://simpwellx.com/sw" },
    { name: "twitter:card", content: "summary_large_image" },
  ],
  links: [{ rel: "canonical", href: "https://simpwellx.com/sw" }, ...alternateLinks()]}),
  component: () => <StandardsPage locale="sw" />,
});
