import { createFileRoute } from "@tanstack/react-router";
import { StandardsPage } from "./index";

export const Route = createFileRoute("/ru")({
  head: () => ({ meta: [
    { title: "Simply Well Executed | Стандарты работы с ИИ" },
    { name: "description", content: "Открытая библиотека стандартов Simply Well Executed для бренда, дизайна и работы с ИИ." },
    { property: "og:title", content: "Simply Well Executed | Стандарты" },
    { property: "og:description", content: "Работа с ИИ — на практике." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ]}),
  component: () => <StandardsPage locale="ru" />,
});