import { DanellaSDK } from './src/index';
import dotenv from 'dotenv';
import { loadTokenFromCache, saveTokenToCache } from './src/lib/tokenCache';

// Load environment variables
dotenv.config();

async function testTasksEndpoints() {
  console.log('🔧 Testing Danella SDK - Tasks Endpoints...\n');

  try {
    // Initialize SDK
    const client = new DanellaSDK({
      apiKey: process.env.WORKFLOW_API_KEY!,
      userId: parseInt(process.env.USER_ID!),
      employeeId: parseInt(process.env.EMPLOYEE_ID!),
      name: process.env.NAME,
    });

    // Try to load cached token first
    const cachedToken = await loadTokenFromCache();
    if (cachedToken) {
      client['httpClient'].setToken(cachedToken);
      console.log('✅ Authenticated (from cache)\n');
    } else {
      // Login and cache token
      console.log('📡 Logging in...');
      const response = await client.auth.login();
      await saveTokenToCache(response.access_token, response.token_type, response.expires_in);
      console.log('✅ Authenticated (new token cached)\n');
    }

    // Test 1: Get project secondary fields
    console.log('📋 Test 1: Get project secondary fields');
    try {
      const projectId = 1; // Replace with a valid project ID
      const fields = await client.tasks.getProjectSecondaryFields(projectId);
      console.log(`✅ Retrieved ${fields.length} secondary fields for project ${projectId}`);
      console.log('Sample:', fields[0]);
    } catch (error) {
      console.log('⚠️  Error getting project fields:', (error as Error).message);
    }

    // Test 2: Get tasks by subproject
    console.log('\n📋 Test 2: Get tasks by subproject');
    try {
      const subProjectId = 1; // Replace with a valid subproject ID
      const tasks = await client.tasks.getBySubProject(subProjectId);
      console.log(`✅ Retrieved ${tasks.length} tasks for subproject ${subProjectId}`);
      if (tasks.length > 0) {
        console.log('Sample task:', tasks[0]);
      }
    } catch (error) {
      console.log('⚠️  Error getting tasks:', (error as Error).message);
    }

    // Test 3: Get task by ID
    console.log('\n📋 Test 3: Get task by ID');
    try {
      const taskId = 1; // Replace with a valid task ID
      const task = await client.tasks.getById(taskId);
      console.log(`✅ Retrieved task ${taskId}`);
      console.log('Task details:', task);
    } catch (error) {
      console.log('⚠️  Error getting task:', (error as Error).message);
    }

    // Test 4: Update/Create task
    console.log('\n📋 Test 4: Update/Create task');
    try {
      const newTask = await client.tasks.update({
        subProjectID: 1,
        jobID: 'TEST-001',
        estimatedClosingDate: new Date().toISOString(),
        secondaryFields: [
          {
            fieldName: 'Test Field',
            value: 'Test Value',
          },
        ],
      });
      console.log('✅ Task created/updated successfully');
      console.log('Task:', newTask);
    } catch (error) {
      console.log('⚠️  Error updating task:', (error as Error).message);
    }

    console.log('\n✅ All tests completed!');
  } catch (error) {
    console.error('❌ Fatal error:', error);
    if (error instanceof Error) {
      console.error('Message:', error.message);
    }
  }
}

testTasksEndpoints();
