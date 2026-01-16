export interface StowryClientConfig {
  /** Stowry server URL (e.g., "http://localhost:5708") */
  endpoint: string;
  /** Access key ID */
  accessKey: string;
  /** Secret access key */
  secretKey: string;
}

const MIN_EXPIRES = 1;
const MAX_EXPIRES = 604800; // 7 days
const DEFAULT_EXPIRES = 900; // 15 minutes

async function hmacSha256(secret: string, message: string): Promise<string> {
  const encoder = new TextEncoder();

  if (typeof globalThis.crypto?.subtle !== 'undefined') {
    // Browser / modern Node.js (20+)
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(message));
    return Array.from(new Uint8Array(signature))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  } else {
    // Node.js < 20
    const { createHmac } = await import('crypto');
    return createHmac('sha256', secret).update(message).digest('hex');
  }
}

/**
 * Client for generating Stowry presigned URLs.
 */
export class StowryClient {
  private readonly endpoint: string;
  private readonly accessKey: string;
  private readonly secretKey: string;

  constructor(config: StowryClientConfig) {
    this.endpoint = config.endpoint.replace(/\/$/, '');
    this.accessKey = config.accessKey;
    this.secretKey = config.secretKey;
  }

  /**
   * Generate a presigned URL for downloading an object.
   * @param path Object path (e.g., "/files/document.pdf")
   * @param expires URL validity in seconds (default: 900, max: 604800)
   */
  presignGet(path: string, expires: number = DEFAULT_EXPIRES): Promise<string> {
    return this.presign('GET', path, expires);
  }

  /**
   * Generate a presigned URL for uploading an object.
   * @param path Object path (e.g., "/files/document.pdf")
   * @param expires URL validity in seconds (default: 900, max: 604800)
   */
  presignPut(path: string, expires: number = DEFAULT_EXPIRES): Promise<string> {
    return this.presign('PUT', path, expires);
  }

  /**
   * Generate a presigned URL for deleting an object.
   * @param path Object path (e.g., "/files/document.pdf")
   * @param expires URL validity in seconds (default: 900, max: 604800)
   */
  presignDelete(path: string, expires: number = DEFAULT_EXPIRES): Promise<string> {
    return this.presign('DELETE', path, expires);
  }

  private async presign(method: string, path: string, expires: number): Promise<string> {
    if (!path.startsWith('/')) {
      throw new Error('Path must start with /');
    }

    if (expires < MIN_EXPIRES || expires > MAX_EXPIRES) {
      throw new Error(`Expires must be between ${MIN_EXPIRES} and ${MAX_EXPIRES} seconds`);
    }

    const timestamp = Math.floor(Date.now() / 1000);
    const stringToSign = `${method}\n${path}\n${timestamp}\n${expires}`;

    const signature = await hmacSha256(this.secretKey, stringToSign);

    const params = new URLSearchParams({
      'X-Stowry-Credential': this.accessKey,
      'X-Stowry-Date': timestamp.toString(),
      'X-Stowry-Expires': expires.toString(),
      'X-Stowry-Signature': signature,
    });

    return `${this.endpoint}${path}?${params.toString()}`;
  }
}
