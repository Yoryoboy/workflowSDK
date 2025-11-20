# Automatic Token Refresh Implementation

## What was implemented

Added automatic token refresh mechanism to handle expired authentication tokens seamlessly.

## Changes

### `src/lib/httpClient.ts`

- Added `refreshTokenCallback` property to store the refresh logic
- Added `isRefreshing` flag to prevent multiple simultaneous refresh attempts
- Added `failedQueue` to queue requests while token is being refreshed
- Implemented `processQueue()` method to retry queued requests after refresh
- Updated response interceptor to:
  - Detect 401 errors
  - Automatically call the refresh callback
  - Retry the original request with the new token
  - Queue concurrent requests during refresh

### `src/client.ts`

- Registered automatic refresh callback in constructor
- Callback calls `auth.login()` to get a new token when the current one expires

## How it works

1. When a request receives a 401 error, the interceptor checks if a refresh callback is registered
2. If already refreshing, the request is queued
3. Otherwise, it calls the refresh callback to get a new token
4. The new token is stored and all queued requests are retried
5. The original request is retried with the new token
6. If refresh fails, all queued requests are rejected

## Benefits

- Users don't need to manually handle token expiration
- Seamless experience - requests automatically retry after token refresh
- Multiple concurrent requests are handled efficiently
- No duplicate refresh attempts

## Commit Message

```
feat: implement automatic token refresh on 401 errors

- Add token refresh mechanism to HttpClient
- Queue concurrent requests during token refresh
- Automatically retry failed requests with new token
- Register refresh callback in DanellaSDK constructor
- Handle edge cases: concurrent refreshes, failed refreshes
```
