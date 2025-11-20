# Token Cache System

## Overview

The SDK includes a token caching system to avoid unnecessary authentication requests during development and testing.

## How it works

1. **First login**: When you authenticate for the first time, the token is saved to `.token-cache.json`
2. **Subsequent runs**: The SDK checks if a valid cached token exists before making a new login request
3. **Auto-expiration**: Tokens are automatically invalidated 5 minutes before their actual expiration time
4. **Auto-refresh**: When a cached token expires, the SDK automatically requests a new one

## Cache file structure

```json
{
  "access_token": "eyJhbGc...",
  "token_type": "Bearer",
  "expires_in": 14400,
  "cached_at": 1700000000000
}
```

## Usage in tests

```typescript
import { loadTokenFromCache, saveTokenToCache } from './src/lib/tokenCache';

// Try to load cached token
const cachedToken = await loadTokenFromCache();
if (cachedToken) {
  client['httpClient'].setToken(cachedToken);
  console.log('Using cached token');
} else {
  // Login and cache the new token
  const response = await client.auth.login();
  await saveTokenToCache(response.access_token, response.token_type, response.expires_in);
}
```

## Benefits

- ✅ Reduces API calls during development
- ✅ Faster test execution
- ✅ Respects token expiration (14400 seconds = 4 hours)
- ✅ Automatically excluded from git (`.gitignore`)

## Manual cache management

```typescript
import { clearTokenCache } from './src/lib/tokenCache';

// Clear the cache manually if needed
await clearTokenCache();
```

## Security

- The `.token-cache.json` file is automatically added to `.gitignore`
- Never commit this file to version control
- The cache file is stored locally in the project root
