# tiny-crc32

Tiny IEEE 802.3 CRC-32 checksum for strings and binary buffers. Zero dependencies.

## Usage

```ts
import { crc32, crc32Hex } from "tiny-crc32";

crc32("123456789"); // 3421780262 (0xcbf43926)
crc32Hex("123456789"); // "cbf43926"

const bytes = new Uint8Array([1, 2, 3]);
crc32(bytes);
crc32Hex(bytes);

// Incremental hashing
const part = crc32("12345");
crc32("6789", part); // 0xcbf43926
```

## API

- `crc32(input: CRC32Input, initial?: number): number` — returns an unsigned 32-bit integer.
- `crc32Hex(input: CRC32Input, initial?: number): string` — returns an 8-character lowercase hex string.
- `type CRC32Input = string | ArrayBuffer | ArrayBufferView`
