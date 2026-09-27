import { createFileRoute } from "@tanstack/react-router";
import { StandardsPage } from "./index";
import { alternateLinks } from "@/lib/locales";

export const Route = createFileRoute("/zh-hans")({
  staticData: { sitemap: true },
  head: () => ({ meta: [
    { title: "Simply Well Executed | 企业级人工智能运营标准" },
    { name: "description", content: "Simply Well Executed 公开的品牌、设计与人工智能运营标准库。" },
    { property: "og:title", content: "Simply Well Executed | 企业级人工智能运营标准" },
    { property: "og:description", content: "让人工智能工作真正落地。" },
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://simpwellx.com/zh-hans" },
    { name: "twitter:card", content: "summary_large_image" },
  ],
  links: [{ rel: "canonical", href: "https://simpwellx.com/zh-hans" }, ...alternateLinks()]}),
  component: () => <StandardsPage locale="zh-hans" />,
});
