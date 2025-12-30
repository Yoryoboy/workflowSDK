# Guía de Migración - SDK v1.0.0

## Resumen de cambios

Se han corregido dos problemas críticos que impedían el uso correcto del SDK en aplicaciones React/browser:

1. ✅ **Eliminado `process.env`** - Ahora funciona en navegadores
2. ✅ **Distribución correcta** - Ahora se importa directamente sin rutas `src/`

---

## Pasos para actualizar tu proyecto React

### 1. Reconstruir el SDK

```bash
cd c:\Users\93jad\Documents\apps\workflowSDK
pnpm build
```

Esto generará:

- `dist/index.js` (CommonJS)
- `dist/index.mjs` (ES Modules)
- `dist/index.d.ts` (TypeScript types)

### 2. Actualizar la instalación en tu proyecto React

**Si usas `pnpm link`:**

```bash
# En el SDK
cd c:\Users\93jad\Documents\apps\workflowSDK
pnpm link --global

# En tu proyecto React
cd tu-proyecto-react
pnpm unlink workflow-sdk  # Desenlazar versión anterior
pnpm link --global workflow-sdk
```

**Si usas ruta local:**

```bash
cd tu-proyecto-react
pnpm install --force
```

**Si usas Git:**

```bash
cd tu-proyecto-react
pnpm update workflow-sdk
```

### 3. Actualizar imports en tu código

**Antes (incorrecto):**

```typescript
import { DanellaSDK } from 'workflowSDK/src/index';
```

**Ahora (correcto):**

```typescript
import { DanellaSDK } from 'workflow-sdk';
```

### 4. Actualizar configuración del cliente

**Antes:**

```typescript
const client = new DanellaSDK({
  apiKey: import.meta.env.VITE_WORKFLOW_API_KEY,
  userId: parseInt(import.meta.env.VITE_USER_ID),
  employeeId: parseInt(import.meta.env.VITE_EMPLOYEE_ID),
});
```

**Ahora (con opción de debug):**

```typescript
const client = new DanellaSDK({
  apiKey: import.meta.env.VITE_WORKFLOW_API_KEY,
  userId: parseInt(import.meta.env.VITE_USER_ID),
  employeeId: parseInt(import.meta.env.VITE_EMPLOYEE_ID),
  debug: import.meta.env.DEV, // ← Nuevo: habilita logs solo en desarrollo
});
```

### 5. Verificar que funciona

```bash
cd tu-proyecto-react
pnpm dev
```

Deberías poder importar sin errores y el SDK funcionará correctamente en el navegador.

---

## Ejemplo completo para React

**src/services/danella.ts:**

```typescript
import { DanellaSDK } from 'workflow-sdk';

export const danellaClient = new DanellaSDK({
  apiKey: import.meta.env.VITE_WORKFLOW_API_KEY,
  userId: parseInt(import.meta.env.VITE_USER_ID),
  employeeId: parseInt(import.meta.env.VITE_EMPLOYEE_ID),
  debug: import.meta.env.DEV, // Debug solo en desarrollo
});
```

**src/App.tsx:**

```typescript
import { useEffect, useState } from 'react';
import { danellaClient } from './services/danella';
import type { TaskResponse } from 'workflow-sdk';

function App() {
  const [tasks, setTasks] = useState<TaskResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTasks() {
      try {
        await danellaClient.auth.login();
        const data = await danellaClient.tasks.getBySubProject(32);
        setTasks(data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchTasks();
  }, []);

  if (loading) return <div>Cargando...</div>;

  return (
    <div>
      <h1>Tareas</h1>
      {tasks.map(task => (
        <div key={task.taskID}>
          <h3>{task.taskCode}</h3>
          <p>Cliente: {task.customerName}</p>
          <p>Estado: {task.taskStatusName}</p>
        </div>
      ))}
    </div>
  );
}

export default App;
```

**.env:**

```env
VITE_WORKFLOW_API_KEY=tu-api-key-aqui
VITE_USER_ID=31
VITE_EMPLOYEE_ID=5
```

---

## Cambios en el nombre del paquete

El nombre cambió de `workflowSDK` a `workflow-sdk` para seguir las convenciones de npm.

**Actualiza tus imports:**

```typescript
// Antes
import { DanellaSDK } from 'workflowSDK';

// Ahora
import { DanellaSDK } from 'workflow-sdk';
```

**Actualiza package.json si usas Git:**

```json
{
  "dependencies": {
    "workflow-sdk": "git+https://github.com/tu-usuario/workflowSDK.git"
  }
}
```

---

## Verificación

Para verificar que todo está correcto:

1. **El import funciona sin `/src/`:**

   ```typescript
   import { DanellaSDK } from 'workflow-sdk'; // ✅
   ```

2. **No hay errores en el navegador:**
   - Abre DevTools → Console
   - No debe haber errores de `process is not defined`

3. **El SDK funciona correctamente:**

   ```typescript
   await danellaClient.auth.login(); // ✅
   const tasks = await danellaClient.tasks.getBySubProject(32); // ✅
   ```

4. **Debug funciona (opcional):**
   ```typescript
   const client = new DanellaSDK({
     // ...
     debug: true,
   });
   // Verás logs en consola con 🔍 API Request Debug
   ```

---

## Solución de problemas

### Error: "Cannot find module 'workflow-sdk'"

```bash
# Reconstruir SDK
cd workflowSDK
pnpm build

# Reinstalar en proyecto
cd tu-proyecto
pnpm install --force
```

### Error: "process is not defined"

Asegúrate de haber actualizado a la última versión del SDK que ya no usa `process.env`.

### Imports no funcionan

Verifica que `dist/` existe en `node_modules/workflow-sdk/`:

```bash
ls node_modules/workflow-sdk/dist
# Debe mostrar: index.js, index.mjs, index.d.ts
```

Si no existe, el SDK no se construyó. Ejecuta `pnpm build` en el SDK.

---

## Despliegue en Render

Con estos cambios, tu app React funcionará perfectamente en Render:

1. **Build Command:** `npm install && npm run build`
2. **Publish Directory:** `dist`
3. **Variables de entorno:**
   - `VITE_WORKFLOW_API_KEY`
   - `VITE_USER_ID`
   - `VITE_EMPLOYEE_ID`

El SDK se descargará desde Git, se construirá automáticamente (gracias al script `prepare`), y se compilará dentro de tu bundle de React. ✅
