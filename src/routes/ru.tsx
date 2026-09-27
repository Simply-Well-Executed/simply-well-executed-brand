import { createFileRoute } from "@tanstack/react-router";
import { StandardsPage } from "./index";
import { alternateLinks } from "@/lib/locales";

export const Route = createFileRoute("/ru")({
  staticData: { sitemap: true },
  head: () => ({ meta: [
    { title: "Simply Well Executed | Стандарты работы с ИИ" },
    { name: "description", content: "Открытая библиотека стандартов Simply Well Executed для бренда, дизайна и работы с ИИ." },
    { property: "og:title", content: "Simply Well Executed | Стандарты работы с ИИ" },
    { property: "og:description", content: "Работа с ИИ — на практике." },
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://simpwellx.com/ru" },
    { name: "twitter:card", content: "summary_large_image" },
  ],
  links: [{ rel: "canonical", href: "https://simpwellx.com/ru" }, ...alternateLinks()]}),
  component: () => <StandardsPage locale="ru" />,
});