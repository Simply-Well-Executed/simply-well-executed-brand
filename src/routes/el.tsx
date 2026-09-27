import { createFileRoute } from "@tanstack/react-router";
import { StandardsPage } from "./index";
import { alternateLinks } from "@/lib/locales";

export const Route = createFileRoute("/el")({
  staticData: { sitemap: true },
  head: () => ({ meta: [
    { title: "Simply Well Executed | ΠΡΟΤΥΠΑ AI ΓΙΑ B2B" },
    { name: "description", content: "Η ΔΗΜΟΣΙΑ ΒΙΒΛΙΟΘΗΚΗ ΠΡΟΤΥΠΩΝ ΕΠΩΝΥΜΙΑΣ, ΣΧΕΔΙΑΣΜΟΥ ΚΑΙ ΛΕΙΤΟΥΡΓΙΑΣ AI ΤΗΣ Simply Well Executed." },
    { property: "og:title", content: "Simply Well Executed | ΠΡΟΤΥΠΑ AI ΓΙΑ B2B" },
    { property: "og:description", content: "Η ΕΡΓΑΣΙΑ ΜΕ AI, ΕΤΟΙΜΗ ΓΙΑ ΛΕΙΤΟΥΡΓΙΑ." },
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://simpwellx.com/el" },
    { name: "twitter:card", content: "summary_large_image" },
  ],
  links: [{ rel: "canonical", href: "https://simpwellx.com/el" }, ...alternateLinks()]}),
  component: () => <StandardsPage locale="el" />,
});
