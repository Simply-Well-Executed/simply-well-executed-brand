import { supabaseAnon } from "./supabase";

const GENESIS_HASH = "0".repeat(64);

async function sha256Hex(input: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
}

export interface AuditEntry {
  walletId: string;
  toolName: string;
  prevHash: string;
  entryHash: string;
  createdAt: string;
}

// Appends one immutable, hash-chained entry to the public audit trail.
// Each entry hashes the previous entry's hash, so any tampering breaks the chain.
// The wallet-style ID is derived from the entry hash: "swe1" + 38 hex chars.
export async function appendAuditEntry(toolName: string, payload: Record<string, unknown>): Promise<AuditEntry> {
  const supabase = supabaseAnon();
  const { data: latest } = await supabase
    .from("mcp_audit_log")
    .select("entry_hash")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  const prevHash = (latest?.entry_hash as string | undefined) ?? GENESIS_HASH;
  const createdAt = new Date().toISOString();
  const entryHash = await sha256Hex(`${prevHash}|${toolName}|${JSON.stringify(payload)}|${createdAt}`);
  const walletId = `swe1${entryHash.slice(0, 38)}`;
  const { error } = await supabase.from("mcp_audit_log").insert({
    wallet_id: walletId,
    tool_name: toolName,
    payload,
    prev_hash: prevHash,
    entry_hash: entryHash,
    created_at: createdAt,
  });
  if (error) throw new Error(`Audit append failed: ${error.message}`);
  return { walletId, toolName, prevHash, entryHash, createdAt };
}
