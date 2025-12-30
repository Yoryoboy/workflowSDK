# Changelog

## [1.0.0] - 2024-12-30

### ✅ Correcciones importantes

#### 1. Compatibilidad con navegadores (React, Vue, etc.)

- **Problema:** El SDK usaba `process.env.DEBUG_API` que no existe en navegadores
- **Solución:** Agregado parámetro `debug` opcional en la configuración del SDK

**Antes (no funcionaba en browser):**

```typescript
// El SDK internamente usaba process.env.DEBUG_API
```

**Ahora (funciona en browser y Node.js):**

```typescript
const client = new DanellaSDK({
  apiKey: import.meta.env.VITE_WORKFLOW_API_KEY,
  userId: parseInt(import.meta.env.VITE_USER_ID),
  employeeId: parseInt(import.meta.env.VITE_EMPLOYEE_ID),
  debug: true, // ← Opcional: habilita logs de debug
});
```

#### 2. Distribución correcta del paquete

- **Problema:** El SDK solo distribuía archivos fuente (`src/`), no compilados (`dist/`)
- **Solución:**
  - Agregado campo `files: ["dist"]` en `package.json`
  - Agregado campo `exports` para mejor compatibilidad con ESM/CJS
  - Agregado script `prepare` que construye automáticamente al instalar

**Resultado:** Ahora puedes importar directamente sin especificar rutas:

```typescript
// ✅ Correcto
import { DanellaSDK } from 'workflowSDK';

// ❌ Ya no es necesario
import { DanellaSDK } from 'workflowSDK/src/index';
```

### 🔧 Cambios técnicos

- Agregado `debug?: boolean` a `DanellaConfig`
- Agregado `debug?: boolean` a `HttpClientConfig`
- Actualizado `package.json` con `exports`, `files`, y scripts `prepare`/`prepublishOnly`
- Removida dependencia de `process.env` en el código del SDK

### 📦 Instalación y uso

El SDK ahora se construye automáticamente cuando lo instalas:

```bash
# Desde Git
pnpm add git+https://github.com/tu-usuario/workflowSDK.git

# El script 'prepare' ejecuta 'pnpm build' automáticamente
# Genera dist/index.js, dist/index.mjs, dist/index.d.ts
```

### 🌐 Uso en React/Vite

```typescript
// .env
VITE_WORKFLOW_API_KEY = tu - api - key;
VITE_USER_ID = 31;
VITE_EMPLOYEE_ID = 5;

// src/services/api.ts
import { DanellaSDK } from 'workflowSDK';

export const danellaClient = new DanellaSDK({
  apiKey: import.meta.env.VITE_WORKFLOW_API_KEY,
  userId: parseInt(import.meta.env.VITE_USER_ID),
  employeeId: parseInt(import.meta.env.VITE_EMPLOYEE_ID),
  debug: import.meta.env.DEV, // Debug solo en desarrollo
});
```

### 🖥️ Uso en Node.js

```typescript
// .env
WORKFLOW_API_KEY = tu - api - key;
USER_ID = 31;
EMPLOYEE_ID = 5;
DEBUG_API = true;

// app.ts
import { DanellaSDK } from 'workflowSDK';
import dotenv from 'dotenv';

dotenv.config();

const client = new DanellaSDK({
  apiKey: process.env.WORKFLOW_API_KEY!,
  userId: parseInt(process.env.USER_ID!),
  employeeId: parseInt(process.env.EMPLOYEE_ID!),
  debug: process.env.DEBUG_API === 'true',
});
```

### 🚀 Próximos pasos

Para usar el SDK actualizado en tus proyectos:

1. **Reconstruir el SDK:**

   ```bash
   cd workflowSDK
   pnpm build
   ```

2. **Actualizar en tu proyecto:**

   ```bash
   cd tu-proyecto
   pnpm install --force
   # o si usas link:
   pnpm unlink workflowSDK
   pnpm link --global workflowSDK
   ```

3. **Actualizar imports:**

   ```typescript
   // Cambiar de:
   import { DanellaSDK } from 'workflowSDK/src/index';

   // A:
   import { DanellaSDK } from 'workflowSDK';
   ```

4. **Opcional: Habilitar debug:**
   ```typescript
   const client = new DanellaSDK({
     // ... otras opciones
     debug: true, // o import.meta.env.DEV en React
   });
   ```
