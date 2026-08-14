# tiny-crc32

Tiny CRC-32 checksum for strings/bytes.

# Usage

```ts
import { crc32, crc32Hex } from 'tiny-crc32'

crc32('hello')
crc32Hex('hello')

const bytes = new Uint8Array([1, 2, 3])
crc32(bytes)
crc32Hex(bytes)
```

```js
const { crc32, crc32Hex } = require('tiny-crc32')
```

# API

- `crc32(input: Uint8Array | string): number`
- `crc32Hex(input: Uint8Array | string): string`
