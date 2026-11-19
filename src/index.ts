let te: TextEncoder | undefined;

function toBytes(input: Uint8Array | string): Uint8Array {
  return typeof input === "string" ? (te ??= new TextEncoder()).encode(input) : input;
}

const table = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    t[n] = c >>> 0;
  }
  return t;
})();

export function crc32(input: Uint8Array | string): number {
  const bytes = toBytes(input);
  let c = 0xffffffff;

  for (let i = 0; i < bytes.length; i++) {
    c = table[(c ^ bytes[i]!) & 0xff]! ^ (c >>> 8);
  }

  return (c ^ 0xffffffff) >>> 0;
}

export function crc32Hex(input: Uint8Array | string): string {
  return crc32(input).toString(16).padStart(8, "0");
}
