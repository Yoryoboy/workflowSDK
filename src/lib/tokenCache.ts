import { promises as fs } from 'fs';
import path from 'path';

interface TokenCache {
  access_token: string;
  token_type: string;
  expires_in: number;
  cached_at: number; // timestamp when cached
}

const TOKEN_CACHE_FILE = path.join(process.cwd(), '.token-cache.json');

/**
 * Save token to cache file
 */
export async function saveTokenToCache(
  accessToken: string,
  tokenType: string,
  expiresIn: number,
): Promise<void> {
  const cache: TokenCache = {
    access_token: accessToken,
    token_type: tokenType,
    expires_in: expiresIn,
    cached_at: Date.now(),
  };

  await fs.writeFile(TOKEN_CACHE_FILE, JSON.stringify(cache, null, 2), 'utf-8');
}

/**
 * Load token from cache file if it exists and is still valid
 */
export async function loadTokenFromCache(): Promise<string | null> {
  try {
    const data = await fs.readFile(TOKEN_CACHE_FILE, 'utf-8');
    const cache: TokenCache = JSON.parse(data);

    const now = Date.now();
    const cachedAt = cache.cached_at;
    const expiresInMs = cache.expires_in * 1000;
    const expiresAt = cachedAt + expiresInMs;

    // Add 5 minute buffer before expiration
    const bufferMs = 5 * 60 * 1000;

    if (now < expiresAt - bufferMs) {
      console.log(
        '✅ Using cached token (expires in',
        Math.floor((expiresAt - now) / 1000),
        'seconds)',
      );
      return cache.access_token;
    } else {
      console.log('⚠️  Cached token expired or about to expire');
      return null;
    }
  } catch (error) {
    // File doesn't exist or is invalid
    return null;
  }
}

/**
 * Clear the token cache
 */
export async function clearTokenCache(): Promise<void> {
  try {
    await fs.unlink(TOKEN_CACHE_FILE);
  } catch (error) {
    // File doesn't exist, ignore
  }
}
