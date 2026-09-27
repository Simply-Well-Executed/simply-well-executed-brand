// @ts-nocheck -- shared verbatim with the MINZAMINZA skill script
// Browser side of MINZAMINZA: for each half, EBCn (= ROT(26-n)) → CRC13 → dictionary draw → inflate; then join a+b.
export function crc13(s) {
  let crc = 0;
  for (const b of new TextEncoder().encode(s)) {
    for (let i = 7; i >= 0; i--) {
      const bit = ((b >> i) & 1) ^ ((crc >> 12) & 1);
      crc = (crc << 1) & 0x1fff;
      if (bit) crc ^= 0x1cf5;
    }
  }
  return crc;
}

export const ebcn = (s, n) =>
  s.replace(/[a-z]/gi, (c) => {
    const base = c <= "Z" ? 65 : 97;
    return String.fromCharCode(((c.charCodeAt(0) - base + 26 - n) % 26) + base);
  });

const b64 = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));

async function decodeHalf(h, label) {
  const n = h?.n;
  if (!Number.isInteger(n) || n < 1 || n > 13) throw new Error(`MINZAMINZA: bad n${label}`);
  const min = ebcn(h.rotn, n);
  if (crc13(min) !== h.crc13) throw new Error(`MINZAMINZA: CRC13 mismatch on half ${label} — refusing to render`);
  const [d, i] = min.split(".");
  const dict = b64(d), idx = b64(i);
  const bytes = Uint8Array.from(idx, (k) => dict[k]);
  const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream("deflate"));
  return await new Response(stream).text();
}

export async function minzaminzaDecode(packet) {
  if (packet?.v !== "minzaminza1") throw new Error("MINZAMINZA: unknown packet");
  const [a, b] = await Promise.all([decodeHalf(packet.a, "A"), decodeHalf(packet.b, "B")]);
  return a + b;
}

export async function minzaminzaRender(el, packet) {
  el.textContent = await minzaminzaDecode(packet);
}
