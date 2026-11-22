export type CRC32Input = string | ArrayBuffer | ArrayBufferView;

let te: TextEncoder | undefined;

function toBytes(input: CRC32Input): Uint8Array {
  if (typeof input === "string") return (te ??= new TextEncoder()).encode(input);
  if (input instanceof Uint8Array) return input;
  if (ArrayBuffer.isView(input)) {
    return new Uint8Array(input.buffer, input.byteOffset, input.byteLength);
  }
  return new Uint8Array(input);
}

const table = /* @__PURE__ */ (() => {
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

export function crc32(input: CRC32Input, initial = 0): number {
  const bytes = toBytes(input);
  let c = initial ^ -1;
  let i = 0;
  const len = bytes.length;

  for (const limit = len - 3; i < limit; i += 4) {
    c = table[(c ^ bytes[i]!) & 0xff]! ^ (c >>> 8);
    c = table[(c ^ bytes[i + 1]!) & 0xff]! ^ (c >>> 8);
    c = table[(c ^ bytes[i + 2]!) & 0xff]! ^ (c >>> 8);
    c = table[(c ^ bytes[i + 3]!) & 0xff]! ^ (c >>> 8);
  }
  for (; i < len; i++) {
    c = table[(c ^ bytes[i]!) & 0xff]! ^ (c >>> 8);
  }
  return (c ^ -1) >>> 0;
}

export function crc32Hex(input: CRC32Input, initial = 0): string {
  return crc32(input, initial).toString(16).padStart(8, "0");
}
