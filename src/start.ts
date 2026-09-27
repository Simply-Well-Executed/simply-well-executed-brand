import { createStart, createCsrfMiddleware, createMiddleware } from "@tanstack/react-start";

import { renderErrorPage } from "./lib/error-page";
import { attachSupabaseAuth } from "@/integrations/supabase/auth-attacher";

const errorMiddleware = createMiddleware().server(async ({ next, request }) => {
  // /lovable/* server routes (email webhooks, previews) authenticate themselves
  // and must bypass app middleware.
  if (new URL(request.url).pathname.startsWith("/lovable/")) {
    return next();
  }
  try {
    return await next();
  } catch (error) {
    if (error != null && typeof error === "object" && "statusCode" in error) {
      throw error;
    }
    console.error(error);
    return new Response(renderErrorPage(), {
      status: 500,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }
});

// MINMIN delivery (mirrors the .htaccess rule the owner asked for):
// known search/social crawlers get the plain SSR page; every other visitor gets the
// <main> copy as a ROT13+CRC13 packet that an inline decoder rebuilds in the browser.
const SEO_BOTS = /(googlebot|bingbot|yandex|baiduspider|yisouspider|yeti|sogou|seznambot|petalbot|duckduckbot|applebot|facebookexternalhit|twitterbot|linkedinbot|slackbot)/i;
const MINMIN_DECODER = `(async()=>{const m=document.querySelector("main[data-minmin-packet]");if(!m)return;const p=JSON.parse(m.dataset.minminPacket);const r=s=>s.replace(/[a-z]/gi,c=>{const b=c<="Z"?65:97;return String.fromCharCode((c.charCodeAt(0)-b+13)%26+b)});const crc=s=>{let c=0;for(const b of new TextEncoder().encode(s))for(let i=7;i>=0;i--){const t=((b>>i)&1)^((c>>12)&1);c=(c<<1)&8191;if(t)c^=7413}return c};const min=r(p.rot13);if(crc(min)!==p.crc13){m.textContent="Integrity check failed — please reload.";return}const[d,x]=min.split(".");const u=s=>Uint8Array.from(atob(s),c=>c.charCodeAt(0));const D=u(d),X=u(x);const bytes=Uint8Array.from(X,k=>D[k]);const t=await new Response(new Blob([bytes]).stream().pipeThrough(new DecompressionStream("deflate"))).text();m.innerHTML=t;m.removeAttribute("data-minmin-packet")})()`;

const minminDeliveryMiddleware = createMiddleware().server(async ({ next, request }) => {
  const res = await next();
  const url = new URL(request.url);
  if (request.method !== "GET" || url.pathname.startsWith("/lovable/") || url.pathname.startsWith("/api/")) return res;
  if (!(res instanceof Response) || !(res.headers.get("content-type") ?? "").includes("text/html")) return res;
  const headers = new Headers(res.headers);
  headers.append("Vary", "User-Agent"); // keep shared caches (e.g. Squid) from mixing the two versions
  if (SEO_BOTS.test(request.headers.get("user-agent") ?? "")) return new Response(res.body, { status: res.status, headers });
  const html = await res.text();
  const open = html.search(/<main\b[^>]*>/), close = html.lastIndexOf("</main>");
  if (open < 0 || close < 0) return new Response(html, { status: res.status, headers });
  const tagEnd = html.indexOf(">", open) + 1;
  const { minminEncode } = await import("./lib/minmin.server");
  const packet = JSON.stringify(minminEncode(html.slice(tagEnd, close))).replace(/&/g, "&amp;").replace(/'/g, "&#39;");
  const out = html.slice(0, tagEnd - 1) + ` data-minmin-packet='${packet}'>` + "</main><script>" + MINMIN_DECODER + "</script>" + html.slice(close + 7);
  headers.delete("content-length");
  return new Response(out, { status: res.status, headers });
});

// Start installs this automatically when src/start.ts is absent; defining the
// file opts out, so re-add it explicitly to keep server functions protected
// from cross-site requests.
const csrfMiddleware = createCsrfMiddleware({
  filter: (ctx) => ctx.handlerType === "serverFn",
});

export const startInstance = createStart(() => ({
  functionMiddleware: [attachSupabaseAuth],
  requestMiddleware: [errorMiddleware, minminDeliveryMiddleware, csrfMiddleware],
}));
