# Danella SDK

A modern TypeScript SDK for interacting with the Danella API.

## Installation

```bash
pnpm add danella-sdk
# or
npm install danella-sdk
# or
yarn add danella-sdk
```

## Quick Start

```typescript
import { DanellaSDK } from 'danella-sdk';

// Initialize the SDK
const client = new DanellaSDK({
  apiKey: 'your-workflow-api-key',
  userId: 31,
  employeeId: 5,
  name: 'Lawrence', // optional
  baseUrl: 'https://danella-x.com', // optional, defaults to production
});

// Authenticate
await client.auth.login();

// Use the API
const tasks = await client.tasks.getBySubProject(101);
const task = await client.tasks.getById(500);
```

## API Reference

### Authentication

```typescript
// Login and get token
await client.auth.login();

// Check if authenticated
if (client.isAuthenticated()) {
  console.log('Authenticated!');
}

// Get current token
const token = client.getToken();

// Logout
client.auth.logout();
```

### Tasks

```typescript
// Get project secondary fields
const fields = await client.tasks.getProjectSecondaryFields(projectId);

// Get tasks by subproject
const tasks = await client.tasks.getBySubProject(subProjectId);

// Get task by ID
const task = await client.tasks.getById(taskId);

// Update or create task
await client.tasks.update({
  id: 500,
  title: 'New task',
  // ... other fields
});
```

## Error Handling

The SDK provides typed errors for better error handling:

```typescript
import { DanellaSDK, AuthenticationError, NotFoundError } from 'danella-sdk';

try {
  await client.tasks.getById(999);
} catch (error) {
  if (error instanceof AuthenticationError) {
    console.error('Authentication failed');
  } else if (error instanceof NotFoundError) {
    console.error('Task not found');
  }
}
```

## Development

```bash
# Install dependencies
pnpm install

# Build
pnpm build

# Watch mode
pnpm dev

# Lint
pnpm lint

# Format
pnpm format

# Test
pnpm test
```

## License

ISC
