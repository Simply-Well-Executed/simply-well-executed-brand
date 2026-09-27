import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isH3SwallowedErrorBody(body)) return response;

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isH3SwallowedErrorBody(body: string): boolean {
  try {
    const payload = JSON.parse(body) as { unhandled?: unknown; message?: unknown };
    return payload.unhandled === true && payload.message === "HTTPError";
  } catch {
    return false;
  }
}

// MINAMINA delivery (supersedes MINMIN) (mirrors the .htaccess rule the owner asked for):
// known search/social crawlers get the plain SSR page; every other visitor gets the
// <main> copy as a ROTn+CRC13 packet (n sent alongside) that an inline decoder rebuilds in the browser.
const SEO_BOTS = /(googlebot|bingbot|yandex|baiduspider|yisouspider|yeti|sogou|seznambot|petalbot|duckduckbot|applebot|facebookexternalhit|twitterbot|linkedinbot|slackbot)/i;
const MINMIN_DECODER = `(async()=>{const m=document.querySelector("main[data-minmin-packet]");if(!m)return;const p=JSON.parse(m.dataset.minminPacket);const r=s=>s.replace(/[a-z]/gi,c=>{const b=c<="Z"?65:97;return String.fromCharCode((c.charCodeAt(0)-b+26-p.n)%26+b)});const crc=s=>{let c=0;for(const b of new TextEncoder().encode(s))for(let i=7;i>=0;i--){const t=((b>>i)&1)^((c>>12)&1);c=(c<<1)&8191;if(t)c^=7413}return c};if(!(p.n>=1&&p.n<=13))return;const min=r(p.rotn);if(crc(min)!==p.crc13){m.textContent="Integrity check failed — please reload.";return}const[d,x]=min.split(".");const u=s=>Uint8Array.from(atob(s),c=>c.charCodeAt(0));const D=u(d),X=u(x);const bytes=Uint8Array.from(X,k=>D[k]);const t=await new Response(new Blob([bytes]).stream().pipeThrough(new DecompressionStream("deflate"))).text();m.innerHTML=t;m.removeAttribute("data-minmin-packet")})()`;

async function minminDeliver(request: Request, res: Response): Promise<Response> {
  const url = new URL(request.url);
  if (request.method !== "GET" || url.pathname.startsWith("/lovable/") || url.pathname.startsWith("/api/")) return res;
  if (!(res.headers.get("content-type") ?? "").includes("text/html")) return res;
  const headers = new Headers(res.headers);
  headers.append("Vary", "User-Agent"); // keep shared caches (e.g. Squid) from mixing the two versions
  if (SEO_BOTS.test(request.headers.get("user-agent") ?? "")) return new Response(res.body, { status: res.status, headers });
  const html = await res.text();
  const open = html.search(/<main\b[^>]*>/), close = html.lastIndexOf("</main>");
  if (open < 0 || close < 0) return new Response(html, { status: res.status, headers });
  const tagEnd = html.indexOf(">", open) + 1;
  const { minaminaEncode } = await import("./lib/minamina.server");
  const packet = JSON.stringify(minaminaEncode(html.slice(tagEnd, close))).replace(/&/g, "&amp;").replace(/'/g, "&#39;");
  const out = html.slice(0, tagEnd - 1) + ` data-minmin-packet='${packet}'>` + "</main><script>" + MINMIN_DECODER + "</script>" + html.slice(close + 7);
  headers.delete("content-length");
  return new Response(out, { status: res.status, headers });
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return await minminDeliver(request, await normalizeCatastrophicSsrResponse(response));
    } catch (error) {
      console.error(error);
      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  },
};
