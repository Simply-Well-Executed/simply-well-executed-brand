import { createFileRoute } from "@tanstack/react-router";
import { StandardsPage } from "./index";
import { alternateLinks } from "@/lib/locales";

export const Route = createFileRoute("/ko")({
  staticData: { sitemap: true },
  head: () => ({ meta: [
    { title: "Simply Well Executed | B2B AI 운영 표준" },
    { name: "description", content: "Simply Well Executed의 브랜드, 디자인, AI 운영 표준을 공개하는 라이브러리입니다." },
    { property: "og:title", content: "Simply Well Executed | B2B AI 운영 표준" },
    { property: "og:description", content: "AI 업무를 실제 운영으로." },
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://simpwellx.com/ko" },
    { name: "twitter:card", content: "summary_large_image" },
  ],
  links: [{ rel: "canonical", href: "https://simpwellx.com/ko" }, ...alternateLinks()]}),
  component: () => <StandardsPage locale="ko" />,
});
