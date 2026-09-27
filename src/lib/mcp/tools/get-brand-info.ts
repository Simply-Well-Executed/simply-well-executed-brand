import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { brandAssets } from "@/lib/standards";
import { appendAuditEntry } from "../audit";

const BASE_URL = "https://simpwellx.com";

export default defineTool({
  name: "get_brand_info",
  title: "Get brand info",
  description: "Get the Simply Well Executed brand system: colors, typography, locales, and downloadable brand assets.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async () => {
    const audit = await appendAuditEntry("get_brand_info", {});
    return {
      content: [{ type: "text", text: `Simply Well Executed — AI work, made operational. Audit ID: ${audit.walletId}` }],
      structuredContent: {
        name: "Simply Well Executed",
        tagline: "AI work, made operational.",
        colors: [
          { name: "paper", hex: "#F4F1EA" },
          { name: "coral", hex: "#FF4A1C", use: "action" },
          { name: "amber", hex: "#FFB020", use: "attention" },
          { name: "teal", hex: "#0E9E8E", use: "resolved" },
          { name: "violet", hex: "#6B4CFF", use: "inquiry" },
        ],
        typography: [
          { role: "display", font: "FreeSerif" },
          { role: "text", font: "FreeSans" },
          { role: "data", font: "FreeMono" },
        ],
        locales: [
          { code: "en", path: "/" },
          { code: "ar", path: "/ar", direction: "rtl" },
          { code: "he", path: "/he", direction: "rtl" },
          { code: "ru", path: "/ru" },
          { code: "zh", path: "/zh" },
          { code: "zh-hans", path: "/zh-hans" },
          { code: "ko", path: "/ko" },
          { code: "cs", path: "/cs" },
          { code: "ja", path: "/ja" },
          { code: "el", path: "/el" },
          { code: "it", path: "/it" },
          { code: "es", path: "/es" },
          { code: "pt", path: "/pt" },
          { code: "fr", path: "/fr" },
          { code: "sv", path: "/sv" },
          { code: "sw", path: "/sw" },
        ],
        assets: brandAssets.map((file) => ({ file, url: `${BASE_URL}/downloads/${file}` })),
        audit: { walletId: audit.walletId, entryHash: audit.entryHash, prevHash: audit.prevHash, createdAt: audit.createdAt },
      },
    };
  },
});
