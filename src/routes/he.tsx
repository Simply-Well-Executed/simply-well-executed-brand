import { createFileRoute } from "@tanstack/react-router";
import { StandardsPage } from "./index";

export const Route = createFileRoute("/he")({
  head: () => ({ meta: [
    { title: "Simply Well Executed | תקני תפעול לבינה מלאכותית" },
    { name: "description", content: "הספרייה הציבורית של Simply Well Executed לתקני מותג, עיצוב ותפעול בינה מלאכותית." },
    { property: "og:title", content: "Simply Well Executed | תקנים" },
    { property: "og:description", content: "עבודת בינה מלאכותית, מוכנה לתפעול." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ]}),
  component: () => <StandardsPage locale="he" />,
});
