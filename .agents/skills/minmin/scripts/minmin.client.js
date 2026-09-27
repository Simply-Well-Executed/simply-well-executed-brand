// Browser side of MINMIN: EBC13 (ROT13 reversal) → CRC13 check → dictionary draw → inflate.
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

// EBC13: ROT13 is self-inverse, so the reversal is ROT13 applied again.
export const ebc13 = (s) =>
  s.replace(/[a-z]/gi, (c) => {
    const base = c <= "Z" ? 65 : 97;
    return String.fromCharCode(((c.charCodeAt(0) - base + 13) % 26) + base);
  });

const b64 = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));

export async function minminDecode(packet) {
  if (packet?.v !== "minmin1") throw new Error("MINMIN: unknown packet");
  const min = ebc13(packet.rot13);
  if (crc13(min) !== packet.crc13) throw new Error("MINMIN: CRC13 mismatch — refusing to render");
  const [d, i] = min.split(".");
  const dict = b64(d), idx = b64(i);
  const bytes = Uint8Array.from(idx, (k) => dict[k]);
  const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream("deflate"));
  return await new Response(stream).text();
}

export async function minminRender(el, packet) {
  el.textContent = await minminDecode(packet);
}
