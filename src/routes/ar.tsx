import { createFileRoute } from "@tanstack/react-router";
import { StandardsPage } from "./index";
import { alternateLinks } from "@/lib/locales";

export const Route = createFileRoute("/ar")({
  staticData: { sitemap: true },
  head: () => ({ meta: [
    { title: "Simply Well Executed | معايير تشغيل الذكاء الاصطناعي" },
    { name: "description", content: "مكتبة Simply Well Executed العامة لمعايير العلامة والتصميم وتشغيل الذكاء الاصطناعي." },
    { property: "og:title", content: "Simply Well Executed | معايير تشغيل الذكاء الاصطناعي" },
    { property: "og:description", content: "عمل الذكاء الاصطناعي، جاهز للتشغيل." },
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://simpwellx.com/ar" },
    { name: "twitter:card", content: "summary_large_image" },
  ],
  links: [{ rel: "canonical", href: "https://simpwellx.com/ar" }, ...alternateLinks()]}),
  component: () => <StandardsPage locale="ar" />,
});
