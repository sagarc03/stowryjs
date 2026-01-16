# stowryjs

[![npm version](https://img.shields.io/npm/v/stowryjs)](https://www.npmjs.com/package/stowryjs)
[![codecov](https://codecov.io/gh/sagarc03/stowryjs/graph/badge.svg)](https://codecov.io/gh/sagarc03/stowryjs)
[![CI](https://github.com/sagarc03/stowryjs/actions/workflows/ci.yml/badge.svg)](https://github.com/sagarc03/stowryjs/actions/workflows/ci.yml)

JavaScript/TypeScript SDK for [Stowry](https://github.com/sagarc03/stowry) presigned URLs.

> **Note:** This SDK implements Stowry's native signing scheme. For AWS Signature V4, use [@aws-sdk/client-s3](https://www.npmjs.com/package/@aws-sdk/client-s3). Stowry supports both.

## Installation

```bash
npm install stowryjs
```

## Quick Start

```typescript
import { StowryClient } from 'stowryjs';

const client = new StowryClient({
  endpoint: 'http://localhost:5708',
  accessKey: 'YOUR_ACCESS_KEY',
  secretKey: 'YOUR_SECRET_KEY',
});

// Download a file
const getUrl = await client.presignGet('/files/document.pdf');
const response = await fetch(getUrl);

// Upload a file
const putUrl = await client.presignPut('/files/upload.txt');
await fetch(putUrl, { method: 'PUT', body: 'Hello, World!' });

// Delete a file
const deleteUrl = await client.presignDelete('/files/old.txt');
await fetch(deleteUrl, { method: 'DELETE' });
```

## API

### `new StowryClient(config)`

| Option | Type | Description |
|--------|------|-------------|
| `endpoint` | `string` | Stowry server URL |
| `accessKey` | `string` | Access key ID |
| `secretKey` | `string` | Secret access key |

### `client.presignGet(path, expires?)`

### `client.presignPut(path, expires?)`

### `client.presignDelete(path, expires?)`

Generate a presigned URL for the specified HTTP method.

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `path` | `string` | — | Object path (must start with `/`) |
| `expires` | `number` | `900` | URL validity in seconds (max: 604800) |

Returns `Promise<string>`.

## Platform Support

- Node.js 18+
- Modern browsers (Chrome, Firefox, Safari, Edge)

Uses Web Crypto API when available, falls back to Node.js `crypto` module.

## License

MIT
