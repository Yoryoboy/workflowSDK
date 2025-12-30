import { DanellaSDK } from './src/index';
import dotenv from 'dotenv';
import { loadTokenFromCache, saveTokenToCache } from './src/lib/tokenCache';

// Load environment variables
dotenv.config();

async function testTasksEndpoints() {
  console.log('Probando Danella SDK - Endpoints de Tareas\n');

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
      console.log('[AUTH] Usando token en caché\n');
    } else {
      // Login and cache token
      console.log('[AUTH] Iniciando sesión...');
      const response = await client.auth.login();
      await saveTokenToCache(response.access_token, response.token_type, response.expires_in);
      console.log('[AUTH] Token guardado en caché exitosamente\n');
    }

    // // Test 1: Get project secondary fields
    // console.log('[TEST 1] Obtener campos secundarios del proyecto');
    // try {
    //   const projectId = 1;
    //   const fields = await client.tasks.getProjectSecondaryFields(projectId);
    //   console.log(fields);
    //   console.log(
    //     `[SUCCESS] Se obtuvieron ${fields.length} campos secundarios para el proyecto ${projectId}`,
    //   );
    // } catch (error) {
    //   console.log('[ERROR] Error al obtener campos del proyecto:', (error as Error).message);
    // }

    // // Test 2: Get tasks by subproject
    // console.log('\n[TEST 2] Obtener tareas por subproyecto');
    // try {
    //   const subProjectId = 32;
    //   const tasks = await client.tasks.getBySubProject(subProjectId);

    //   console.log(
    //     `[SUCCESS] Se obtuvieron ${tasks.length} tareas para el subproyecto ${subProjectId}`,
    //   );
    // } catch (error) {
    //   console.log('[ERROR] Error al obtener tareas:', (error as Error).message);
    // }

    // // Test 3: Get task by ID
    // console.log('\n[TEST 3] Obtener tarea por ID');
    // try {
    //   const taskId = 6394;
    //   const task = await client.tasks.getById(taskId);
    //   console.log(`[SUCCESS] Se obtuvo la tarea ${taskId}`);
    //   console.log('Detalles de la tarea:', task);
    // } catch (error) {
    //   console.log('[ERROR] Error al obtener tarea:', (error as Error).message);
    // }

    // Test 4: Update/Create task
    console.log('\n[TEST 4] Actualizar/Crear tarea');
    try {
      const newTask = await client.tasks.update({
        subProjectID: 41,
        jobID: 'TEST-001',
        verifierKeyID: 'VER-001',
      });
      console.log('[SUCCESS] Tarea creada/actualizada exitosamente');
      console.log('Tarea:', newTask);
    } catch (error) {
      console.log('[ERROR] Error al actualizar tarea:', (error as Error).message);
      console.log('Error details:', error);
    }

    console.log('\n[DONE] Todas las pruebas completadas');
  } catch (error) {
    console.error('[FATAL] Error:', error);
    if (error instanceof Error) {
      console.error('Mensaje:', error);
    }
  }
}

testTasksEndpoints();
