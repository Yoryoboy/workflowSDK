import { DanellaSDK } from './src/index';
import dotenv from 'dotenv';
import { loadTokenFromCache, saveTokenToCache } from './src/lib/tokenCache';

// Load environment variables
dotenv.config();

async function testAuth() {
  console.log('🔧 Testing Danella SDK Authentication...\n');

  try {
    // Initialize SDK with credentials from .env
    const client = new DanellaSDK({
      apiKey: process.env.WORKFLOW_API_KEY!,
      userId: parseInt(process.env.USER_ID!),
      employeeId: parseInt(process.env.EMPLOYEE_ID!),
      name: process.env.NAME,
    });

    console.log('✅ SDK initialized');

    // Try to load cached token first
    const cachedToken = await loadTokenFromCache();
    if (cachedToken) {
      client['httpClient'].setToken(cachedToken);
      console.log('🔐 Authenticated: true (from cache)');
      console.log('🎫 Token loaded from cache\n');
      return;
    }

    console.log('🔐 Authenticated:', client.isAuthenticated());
    console.log('🎫 Current token:', client.getToken());

    // Attempt login
    console.log('\n📡 Attempting login...');
    const response = await client.auth.login();

    // Save token to cache
    await saveTokenToCache(response.access_token, response.token_type, response.expires_in);
  } catch (error) {
    console.error('❌ Error:', error);
    if (error instanceof Error) {
      console.error('Message:', error.message);
    }
  }
}

testAuth();
