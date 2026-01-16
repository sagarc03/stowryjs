import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { StowryClient } from '../src/client';

describe('StowryClient', () => {
  const config = {
    endpoint: 'http://localhost:5708',
    accessKey: 'FE373CEF5632FDED3081',
    secretKey: '9218d0ddfdb1779169f4b6b3b36df321099e98e9',
  };

  describe('test vector validation', () => {
    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date(1736956800 * 1000));
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should generate correct signature for test vector', async () => {
      const client = new StowryClient(config);
      const url = await client.presignGet('/test/hello.txt', 900);

      const parsed = new URL(url);
      expect(parsed.searchParams.get('X-Stowry-Credential')).toBe('FE373CEF5632FDED3081');
      expect(parsed.searchParams.get('X-Stowry-Date')).toBe('1736956800');
      expect(parsed.searchParams.get('X-Stowry-Expires')).toBe('900');
      expect(parsed.searchParams.get('X-Stowry-Signature')).toBe(
        'b24285352583edb3d06c531f61e38c5706d42d79e31474bf1f95667d524bae21'
      );
    });
  });

  describe('presignGet', () => {
    it('should generate valid GET presigned URL', async () => {
      const client = new StowryClient(config);
      const url = await client.presignGet('/files/document.pdf');

      const parsed = new URL(url);
      expect(parsed.origin).toBe('http://localhost:5708');
      expect(parsed.pathname).toBe('/files/document.pdf');
      expect(parsed.searchParams.has('X-Stowry-Credential')).toBe(true);
      expect(parsed.searchParams.has('X-Stowry-Date')).toBe(true);
      expect(parsed.searchParams.has('X-Stowry-Expires')).toBe(true);
      expect(parsed.searchParams.has('X-Stowry-Signature')).toBe(true);
    });

    it('should use default expires of 900 seconds', async () => {
      const client = new StowryClient(config);
      const url = await client.presignGet('/test.txt');

      const parsed = new URL(url);
      expect(parsed.searchParams.get('X-Stowry-Expires')).toBe('900');
    });
  });

  describe('presignPut', () => {
    it('should generate valid PUT presigned URL', async () => {
      const client = new StowryClient(config);
      const url = await client.presignPut('/files/upload.txt', 3600);

      const parsed = new URL(url);
      expect(parsed.pathname).toBe('/files/upload.txt');
      expect(parsed.searchParams.get('X-Stowry-Expires')).toBe('3600');
    });
  });

  describe('presignDelete', () => {
    it('should generate valid DELETE presigned URL', async () => {
      const client = new StowryClient(config);
      const url = await client.presignDelete('/files/old.txt', 300);

      const parsed = new URL(url);
      expect(parsed.pathname).toBe('/files/old.txt');
      expect(parsed.searchParams.get('X-Stowry-Expires')).toBe('300');
    });
  });

  describe('validation', () => {
    it('should throw error if path does not start with /', async () => {
      const client = new StowryClient(config);
      await expect(client.presignGet('test.txt')).rejects.toThrow('Path must start with /');
    });

    it('should throw error if expires is less than 1', async () => {
      const client = new StowryClient(config);
      await expect(client.presignGet('/test.txt', 0)).rejects.toThrow(
        'Expires must be between 1 and 604800 seconds'
      );
    });

    it('should throw error if expires is greater than 604800', async () => {
      const client = new StowryClient(config);
      await expect(client.presignGet('/test.txt', 604801)).rejects.toThrow(
        'Expires must be between 1 and 604800 seconds'
      );
    });

    it('should accept expires at boundaries', async () => {
      const client = new StowryClient(config);
      await expect(client.presignGet('/test.txt', 1)).resolves.toBeDefined();
      await expect(client.presignGet('/test.txt', 604800)).resolves.toBeDefined();
    });
  });

  describe('endpoint handling', () => {
    it('should strip trailing slash from endpoint', async () => {
      const client = new StowryClient({
        ...config,
        endpoint: 'http://localhost:5708/',
      });
      const url = await client.presignGet('/test.txt');

      expect(url.startsWith('http://localhost:5708/test.txt?')).toBe(true);
    });
  });
});
