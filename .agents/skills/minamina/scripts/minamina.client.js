// Browser side of MINAMINA: EBCn (= ROT(26-n)) → CRC13 check → dictionary draw → inflate.
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

export async function minaminaDecode(packet) {
  if (packet?.v !== "minamina1") throw new Error("MINAMINA: unknown packet");
  const n = packet.n;
  if (!Number.isInteger(n) || n < 1 || n > 13) throw new Error("MINAMINA: bad n");
  const min = ebcn(packet.rotn, n);
  if (crc13(min) !== packet.crc13) throw new Error("MINAMINA: CRC13 mismatch — refusing to render");
  const [d, i] = min.split(".");
  const dict = b64(d), idx = b64(i);
  const bytes = Uint8Array.from(idx, (k) => dict[k]);
  const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream("deflate"));
  return await new Response(stream).text();
}

export async function minaminaRender(el, packet) {
  el.textContent = await minaminaDecode(packet);
}
