import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";

const LANG_NAMES = { en: "English", ar: "Modern Standard Arabic", he: "Hebrew", ru: "Russian", zh: "Simplified Chinese", ko: "Korean", cs: "Czech" } as const;
export type SeqLang = keyof typeof LANG_NAMES;

export async function generateSequence(input: { product: string; audience: string; language: SeqLang }) {
  const apiKey = process.env['LOVABLE_API_KEY'];
  if (!apiKey) throw new Error("AI is not configured.");
  let runId: string | undefined;
  const provider = createOpenAI({
    baseURL: "https://ai.gateway.lovable.dev/v1",
    apiKey,
    headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
    fetch: async (url, init) => {
      const headers = new Headers(init?.headers);
      if (runId) headers.set("X-Lovable-AIG-Run-ID", runId);
      const res = await fetch(url, { ...init, headers });
      runId ??= res.headers.get("X-Lovable-AIG-Run-ID") ?? undefined;
      return res;
    },
  });
  const result = streamText({
    model: provider.responses("openai/gpt-6-astra"),
    maxRetries: 0,
    system:
      "You write sample B2B outreach sequences for Simply Well Executed's prospects. Voice: direct, grounded, human — outcome first, no hype, no invented metrics, customer names or testimonials. " +
      "Write natively in the requested language (not a literal translation), using culturally appropriate business register. " +
      "Output exactly 3 emails as plain text. For each: a heading line with the email number and send day, then a subject line — write these labels in the requested language too, then a body under 90 words. Each email must offer an easy way to say no. No markdown.",
    prompt: `Language: ${LANG_NAMES[input.language]}\nProduct: ${input.product}\nAudience: ${input.audience}`,
    providerOptions: {
      openai: {
        store: false,
        forceReasoning: true,
        reasoningEffort: "low",
        reasoningSummary: "auto",
        include: ["reasoning.encrypted_content"],
      },
    },
  });
  return (await result.text).trim();
}
