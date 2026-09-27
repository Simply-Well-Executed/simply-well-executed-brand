import { createFileRoute } from "@tanstack/react-router";
import { StandardsPage } from "./index";

export const Route = createFileRoute("/he")({
  staticData: { sitemap: true },
  head: () => ({ meta: [
    { title: "Simply Well Executed | תקני תפעול לבינה מלאכותית" },
    { name: "description", content: "הספרייה הציבורית של Simply Well Executed לתקני מותג, עיצוב ותפעול בינה מלאכותית." },
    { property: "og:title", content: "Simply Well Executed | תקני תפעול לבינה מלאכותית" },
    { property: "og:description", content: "עבודת בינה מלאכותית, מוכנה לתפעול." },
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://simpwellx.com/he" },
    { name: "twitter:card", content: "summary_large_image" },
  ],
  links: [{ rel: "canonical", href: "https://simpwellx.com/he" }]}),
  component: () => <StandardsPage locale="he" />,
});
