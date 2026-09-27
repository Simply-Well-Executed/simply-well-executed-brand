import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseAnon } from "../supabase";
import { appendAuditEntry } from "../audit";

export default defineTool({
  name: "submit_demo_request",
  title: "Submit demo request",
  description: "Submit a demo request to Simply Well Executed. A real person reviews and replies — no automated funnel.",
  inputSchema: {
    name: z.string().trim().min(1).max(100).describe("Your name."),
    email: z.string().trim().email().max(255).describe("Work email for the reply."),
    company: z.string().trim().max(120).optional().describe("Company name."),
    message: z.string().trim().max(2000).optional().describe("What you want to see in the demo."),
  },
  annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: false },
  handler: async ({ name, email, company, message }) => {
    const supabase = supabaseAnon();
    const { error } = await supabase.from("demo_requests").insert({
      name,
      email,
      company: company || null,
      message: message || null,
    });
    if (error) return { content: [{ type: "text", text: `Could not submit the request: ${error.message}` }], isError: true };
    const audit = await appendAuditEntry("submit_demo_request", { name, email, company: company ?? null });
    return {
      content: [{ type: "text", text: `Demo request received for ${name}. A real person will reply to ${email}. Audit ID: ${audit.walletId}` }],
      structuredContent: {
        status: "received",
        audit: { walletId: audit.walletId, entryHash: audit.entryHash, prevHash: audit.prevHash, createdAt: audit.createdAt },
      },
    };
  },
});
