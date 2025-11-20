import { DanellaSDK } from './src/index';
import dotenv from 'dotenv';
import { loadTokenFromCache, saveTokenToCache } from './src/lib/tokenCache';

// Load environment variables
dotenv.config();

async function testTasksEndpoints() {
  console.log('Testing Danella SDK - Tasks Endpoints\n');

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
      console.log('[AUTH] Using cached token\n');
    } else {
      // Login and cache token
      console.log('[AUTH] Logging in...');
      const response = await client.auth.login();
      await saveTokenToCache(response.access_token, response.token_type, response.expires_in);
      console.log('[AUTH] Token cached successfully\n');
    }

    // Test 1: Get project secondary fields
    console.log('[TEST 1] Get project secondary fields');
    try {
      const projectId = 16;
      const fields = await client.tasks.getProjectSecondaryFields(projectId);
      console.log(fields);
      console.log(`[SUCCESS] Retrieved ${fields.length} secondary fields for project ${projectId}`);
    } catch (error) {
      console.log('[ERROR] Failed to get project fields:', (error as Error).message);
    }

    // Test 2: Get tasks by subproject
    console.log('\n[TEST 2] Get tasks by subproject');
    try {
      const subProjectId = 32;
      const tasks = await client.tasks.getBySubProject(subProjectId);

      console.log(tasks);
      console.log(`[SUCCESS] Retrieved ${tasks.length} tasks for subproject ${subProjectId}`);
    } catch (error) {
      console.log('[ERROR] Failed to get tasks:', (error as Error).message);
    }

    // Test 3: Get task by ID
    console.log('\n[TEST 3] Get task by ID');
    try {
      const taskId = 5671;
      const task = await client.tasks.getById(taskId);
      console.log(`[SUCCESS] Retrieved task ${taskId}`);
      console.log('Task details:', task);
    } catch (error) {
      console.log('[ERROR] Failed to get task:', (error as Error).message);
    }

    // Test 4: Update/Create task
    console.log('\n[TEST 4] Update/Create task');
    try {
      const newTask = await client.tasks.update({
        subProjectID: 45,
        jobID: 'TEST-001',
        estimatedClosingDate: new Date().toISOString(),
        verifierKeyID: 'JB0000000',
      });
      console.log('[SUCCESS] Task created/updated successfully');
      console.log('Task:', newTask);
    } catch (error) {
      console.log('[ERROR] Failed to update task:', (error as Error).message);
    }

    console.log('\n[DONE] All tests completed');
  } catch (error) {
    console.error('[FATAL] Error:', error);
    if (error instanceof Error) {
      console.error('Message:', error);
    }
  }
}

testTasksEndpoints();
