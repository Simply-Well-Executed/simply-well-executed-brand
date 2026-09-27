import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

export default defineTool({
  name: "get_audit_trail",
  title: "Get audit trail",
  description: "Read the append-only audit trail of MCP tool calls. Each entry is hash-chained to the previous one and carries a wallet-style ID.",
  inputSchema: {
    limit: z.number().int().min(1).max(100).optional().describe("Max entries to return (default 25, newest first)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ limit }) => {
    // The audit table has no public SELECT policy; reads go through the
    // service role so the trail stays append-only for anonymous callers.
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("mcp_audit_log")
      .select("wallet_id, tool_name, prev_hash, entry_hash, created_at")
      .order("created_at", { ascending: false })
      .limit(limit ?? 25);
    if (error) return { content: [{ type: "text", text: `Could not read the audit trail: ${error.message}` }], isError: true };
    const entries = (data ?? []).map((row) => ({
      walletId: row.wallet_id as string,
      toolName: row.tool_name as string,
      prevHash: row.prev_hash as string,
      entryHash: row.entry_hash as string,
      createdAt: row.created_at as string,
    }));
    return {
      content: [{ type: "text", text: `${entries.length} audit entries (newest first).` }],
      structuredContent: { entries },
    };
  },
});
