import { createFileRoute } from "@tanstack/react-router";
import { StandardsPage } from "./index";

export const Route = createFileRoute("/ar")({
  head: () => ({ meta: [
    { title: "Simply Well Executed | معايير تشغيل الذكاء الاصطناعي" },
    { name: "description", content: "مكتبة Simply Well Executed العامة لمعايير العلامة والتصميم وتشغيل الذكاء الاصطناعي." },
    { property: "og:title", content: "Simply Well Executed | المعايير" },
    { property: "og:description", content: "عمل الذكاء الاصطناعي، جاهز للتشغيل." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ]}),
  component: () => <StandardsPage locale="ar" />,
});
