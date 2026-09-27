import { createFileRoute } from "@tanstack/react-router";
import { StandardsPage } from "./index";
import { alternateLinks } from "@/lib/locales";

export const Route = createFileRoute("/el")({
  staticData: { sitemap: true },
  head: () => ({ meta: [
    { title: "Simply Well Executed | Πρότυπα AI για B2B" },
    { name: "description", content: "Η δημόσια βιβλιοθήκη προτύπων επωνυμίας, σχεδιασμού και λειτουργίας AI της Simply Well Executed." },
    { property: "og:title", content: "Simply Well Executed | Πρότυπα AI για B2B" },
    { property: "og:description", content: "Η εργασία με AI, έτοιμη για λειτουργία." },
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://simpwellx.com/el" },
    { name: "twitter:card", content: "summary_large_image" },
  ],
  links: [{ rel: "canonical", href: "https://simpwellx.com/el" }, ...alternateLinks()]}),
  component: () => <StandardsPage locale="el" />,
});
