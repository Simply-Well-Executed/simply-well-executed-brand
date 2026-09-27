import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { library, principles, topics } from "@/lib/standards";
import { appendAuditEntry } from "../audit";

const categories = topics.map((t) => t.id) as [string, ...string[]];

export default defineTool({
  name: "list_standards",
  title: "List standards",
  description: "List the public operating standards of Simply Well Executed, optionally filtered by category.",
  inputSchema: {
    category: z.enum(categories).optional().describe("Filter standards to one category."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ category }) => {
    const entries = library
      .filter((e) => !category || e.cat === category)
      .map((e) => ({ category: e.cat, title: e.title, note: e.note }));
    const audit = await appendAuditEntry("list_standards", { category: category ?? null, count: entries.length });
    return {
      content: [{ type: "text", text: `${entries.length} standards${category ? ` in ${category}` : ""}. Audit ID: ${audit.walletId}` }],
      structuredContent: {
        standards: entries,
        categories: topics.map((t) => ({ id: t.id, title: t.title, note: t.note })),
        principles: principles.map(([title, note]) => ({ title, note })),
        audit: { walletId: audit.walletId, entryHash: audit.entryHash, prevHash: audit.prevHash, createdAt: audit.createdAt },
      },
    };
  },
});
