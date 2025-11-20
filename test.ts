import { DanellaSDK } from './src/index';
import dotenv from 'dotenv';

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
    console.log('🔐 Authenticated:', client.isAuthenticated());
    console.log('🎫 Current token:', client.getToken());

    // Attempt login
    console.log('\n📡 Attempting login...');
    const response = await client.auth.login();

    console.log('✅ Login successful!');
    console.log('🎫 Token received:', response.access_token);
    console.log('🔒 Token type:', response.token_type);
    console.log('⏰ Expires in:', response.expires_in, 'seconds');
    console.log('🔐 Is authenticated:', client.isAuthenticated());
  } catch (error) {
    console.error('❌ Error:', error);
    if (error instanceof Error) {
      console.error('Message:', error.message);
    }
  }
}

testAuth();
