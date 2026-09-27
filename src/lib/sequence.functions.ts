import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const schema = z.object({
  product: z.string().trim().min(2).max(300),
  audience: z.string().trim().min(2).max(300),
  language: z.enum(["en", "ar", "he"]),
});

export const generateSalesSequence = createServerFn({ method: "POST" })
  .inputValidator((d) => schema.parse(d))
  .handler(async ({ data }) => {
    const { generateSequence } = await import("./sequence.server");
    try {
      const text = await generateSequence(data);
      if (!text) return { ok: false as const, error: "The AI returned nothing for this request. Try describing your product differently." };
      return { ok: true as const, text };
    } catch (e) {
      const status = (e as { statusCode?: number }).statusCode;
      const error =
        status === 429 ? "Too many requests right now — please wait a minute and try again."
        : status === 402 ? "AI credits for this site have run out. Please try again later."
        : status === 403 ? "This request can't be processed."
        : "Something went wrong generating your sequence. Please try again.";
      console.error("sequence generation failed", status, e);
      return { ok: false as const, error };
    }
  });
