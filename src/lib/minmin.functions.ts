import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const LOCALES = ["en", "ar", "he", "ru", "zh", "zh-hans", "ko", "cs", "ja", "el", "it", "es", "pt", "fr", "sv", "sw"] as const;

/** MINMIN copy of a page's full wording (the readable HTML stays for search engines). */
export const getPagePacket = createServerFn({ method: "GET" })
  .inputValidator((d) => z.object({ locale: z.enum(LOCALES) }).parse(d))
  .handler(async ({ data }) => {
    const { minminEncode } = await import("./minmin.server");
    const { pageWording } = await import("./locales");
    return minminEncode(JSON.stringify(pageWording(data.locale)));
  });
