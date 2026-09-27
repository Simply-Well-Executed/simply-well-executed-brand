import { createFileRoute } from "@tanstack/react-router";
import { StandardsPage } from "./index";
import { alternateLinks } from "@/lib/locales";

export const Route = createFileRoute("/ja")({
  staticData: { sitemap: true },
  head: () => ({ meta: [
    { title: "Simply Well Executed | B2B AI 運用標準" },
    { name: "description", content: "Simply Well Executed の公開ブランド・デザイン・AI 運用標準ライブラリ。" },
    { property: "og:title", content: "Simply Well Executed | B2B AI 運用標準" },
    { property: "og:description", content: "AI の仕事を、運用可能に。" },
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://simpwellx.com/ja" },
    { name: "twitter:card", content: "summary_large_image" },
  ],
  links: [{ rel: "canonical", href: "https://simpwellx.com/ja" }, ...alternateLinks()]}),
  component: () => <StandardsPage locale="ja" />,
});
