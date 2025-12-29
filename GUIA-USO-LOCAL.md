# Guía: Usar el SDK Localmente sin Publicar

Esta guía te explica cómo usar tu SDK como dependencia local en otros proyectos sin necesidad de publicarlo en npm.

## Tabla de Contenidos

1. [Método 1: npm/pnpm link (Recomendado para desarrollo)](#método-1-npmpnpm-link)
2. [Método 2: Ruta de archivo local](#método-2-ruta-de-archivo-local)
3. [Método 3: Repositorio Git privado](#método-3-repositorio-git-privado)
4. [Comparación de métodos](#comparación-de-métodos)
5. [Solución de problemas](#solución-de-problemas)

---

## Método 1: npm/pnpm link (Recomendado para desarrollo)

Este método crea un enlace simbólico entre tu SDK y el proyecto que lo consume. **Ideal para desarrollo activo**.

### Paso 1: Preparar el SDK

```bash
# Navega al directorio del SDK
cd c:\Users\93jad\Documents\apps\workflowSDK

# Construye el SDK
pnpm build

# Crea el enlace global
pnpm link --global
```

**Nota:** Esto registra el paquete `workflowSDK` globalmente en tu sistema.

### Paso 2: Usar el SDK en tu proyecto

```bash
# Navega a tu proyecto
cd c:\Users\93jad\Documents\apps\mi-proyecto

# Enlaza el SDK
pnpm link --global workflowSDK
```

### Paso 3: Usar el SDK en tu código

```typescript
// En tu proyecto
import { DanellaSDK } from 'workflowSDK';

const client = new DanellaSDK({
  apiKey: process.env.WORKFLOW_API_KEY!,
  userId: parseInt(process.env.USER_ID!),
  employeeId: parseInt(process.env.EMPLOYEE_ID!),
});
```

### Ventajas ✅

- Los cambios en el SDK se reflejan automáticamente
- No necesitas reinstalar después de cada cambio
- Perfecto para desarrollo activo

### Desventajas ❌

- Debes ejecutar `pnpm build` cada vez que cambies el SDK
- El enlace es local a tu máquina (no funciona en otros equipos)

### Desenlazar cuando termines

```bash
# En tu proyecto
pnpm unlink --global workflowSDK

# En el SDK (opcional)
cd c:\Users\93jad\Documents\apps\workflowSDK
pnpm unlink --global
```

---

## Método 2: Ruta de archivo local

Instala el SDK directamente desde su ruta en el sistema de archivos. **Ideal para producción local**.

### Paso 1: Preparar el SDK

```bash
# Navega al directorio del SDK
cd c:\Users\93jad\Documents\apps\workflowSDK

# Construye el SDK
pnpm build
```

### Paso 2: Instalar en tu proyecto

```bash
# Navega a tu proyecto
cd c:\Users\93jad\Documents\apps\mi-proyecto

# Instala desde la ruta local
pnpm add file:../workflowSDK

# O con ruta absoluta
pnpm add file:c:/Users/93jad/Documents/apps/workflowSDK
```

Esto agregará en tu `package.json`:

```json
{
  "dependencies": {
    "workflowSDK": "file:../workflowSDK"
  }
}
```

### Paso 3: Usar el SDK

```typescript
import { DanellaSDK } from 'workflowSDK';

const client = new DanellaSDK({
  apiKey: process.env.WORKFLOW_API_KEY!,
  userId: parseInt(process.env.USER_ID!),
  employeeId: parseInt(process.env.EMPLOYEE_ID!),
});
```

### Actualizar el SDK

Cada vez que hagas cambios en el SDK:

```bash
# 1. Construye el SDK
cd c:\Users\93jad\Documents\apps\workflowSDK
pnpm build

# 2. Reinstala en tu proyecto
cd c:\Users\93jad\Documents\apps\mi-proyecto
pnpm install
```

### Ventajas ✅

- Simple y directo
- No requiere configuración especial
- Funciona en cualquier máquina con acceso a la ruta

### Desventajas ❌

- Debes reinstalar después de cada cambio en el SDK
- La ruta debe ser accesible (problemas si compartes el proyecto)

---

## Método 3: Repositorio Git privado

Usa Git para distribuir tu SDK. **Ideal para equipos o múltiples proyectos**.

### Opción A: Repositorio Git local

#### Paso 1: Inicializar repositorio Git en el SDK (si no lo tienes)

```bash
cd c:\Users\93jad\Documents\apps\workflowSDK

# Si no tienes git inicializado
git init
git add .
git commit -m "Initial commit"
```

#### Paso 2: Instalar desde Git local

```bash
cd c:\Users\93jad\Documents\apps\mi-proyecto

# Instalar desde repositorio local
pnpm add git+file:../workflowSDK

# O con ruta absoluta
pnpm add git+file:c:/Users/93jad/Documents/apps/workflowSDK
```

En tu `package.json`:

```json
{
  "dependencies": {
    "workflowSDK": "git+file:../workflowSDK"
  }
}
```

### Opción B: Repositorio Git remoto privado (GitHub/GitLab/Bitbucket)

#### Paso 1: Subir el SDK a un repositorio privado

```bash
cd c:\Users\93jad\Documents\apps\workflowSDK

# Agregar remote (ejemplo con GitHub)
git remote add origin https://github.com/tu-usuario/workflowSDK.git

# Subir código
git push -u origin main
```

#### Paso 2: Instalar desde Git remoto

```bash
cd c:\Users\93jad\Documents\apps\mi-proyecto

# Opción 1: HTTPS (requiere autenticación)
pnpm add git+https://github.com/tu-usuario/workflowSDK.git

# Opción 2: SSH (requiere clave SSH configurada)
pnpm add git+ssh://git@github.com/tu-usuario/workflowSDK.git

# Opción 3: Rama específica
pnpm add git+https://github.com/tu-usuario/workflowSDK.git#main

# Opción 4: Commit específico
pnpm add git+https://github.com/tu-usuario/workflowSDK.git#abc1234

# Opción 5: Tag específico
pnpm add git+https://github.com/tu-usuario/workflowSDK.git#v1.0.0
```

En tu `package.json`:

```json
{
  "dependencies": {
    "workflowSDK": "git+https://github.com/tu-usuario/workflowSDK.git"
  }
}
```

### Actualizar desde Git

```bash
# En tu proyecto
pnpm update workflowSDK
```

### Ventajas ✅

- Funciona en cualquier máquina con acceso al repositorio
- Versionado automático con Git
- Ideal para equipos
- Puedes usar tags para versiones específicas

### Desventajas ❌

- Requiere configurar repositorio Git
- Necesitas hacer commit y push de cada cambio

---

## Comparación de Métodos

| Característica         | pnpm link  | Ruta local | Git local | Git remoto |
| ---------------------- | ---------- | ---------- | --------- | ---------- |
| **Facilidad de setup** | ⭐⭐⭐     | ⭐⭐⭐⭐⭐ | ⭐⭐⭐    | ⭐⭐       |
| **Desarrollo activo**  | ⭐⭐⭐⭐⭐ | ⭐⭐       | ⭐⭐⭐    | ⭐⭐⭐     |
| **Trabajo en equipo**  | ❌         | ⭐⭐       | ⭐⭐⭐    | ⭐⭐⭐⭐⭐ |
| **Versionado**         | ❌         | ❌         | ⭐⭐⭐⭐  | ⭐⭐⭐⭐⭐ |
| **Portabilidad**       | ❌         | ⭐⭐       | ⭐⭐⭐    | ⭐⭐⭐⭐⭐ |
| **Requiere rebuild**   | ✅         | ✅         | ✅        | ✅         |

### Recomendaciones por caso de uso

- **Desarrollo activo solo**: `pnpm link`
- **Proyecto personal único**: Ruta local
- **Múltiples proyectos locales**: Git local
- **Trabajo en equipo**: Git remoto
- **Producción local**: Ruta local o Git remoto

---

## Configuración Recomendada del SDK

### Asegurar que el build esté listo

Verifica que tu `package.json` tenga la configuración correcta:

```json
{
  "name": "workflowSDK",
  "version": "1.0.0",
  "main": "./dist/index.js",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "files": ["dist"],
  "scripts": {
    "build": "tsup",
    "prepublishOnly": "pnpm build"
  }
}
```

### Script de preparación automática

Crea un script `prepare` para que se ejecute automáticamente:

```json
{
  "scripts": {
    "build": "tsup",
    "prepare": "pnpm build"
  }
}
```

Esto ejecutará `pnpm build` automáticamente cuando alguien instale tu paquete.

---

## Workflow Recomendado para Desarrollo

### Configuración inicial (una sola vez)

```bash
# 1. En el SDK
cd c:\Users\93jad\Documents\apps\workflowSDK
pnpm install
pnpm build
pnpm link --global

# 2. En tu proyecto
cd c:\Users\93jad\Documents\apps\mi-proyecto
pnpm link --global workflowSDK
```

### Flujo de trabajo diario

```bash
# 1. Haces cambios en el SDK
cd c:\Users\93jad\Documents\apps\workflowSDK
# ... editas archivos ...

# 2. Reconstruyes
pnpm build

# 3. Tu proyecto ya tiene los cambios (gracias al link)
cd c:\Users\93jad\Documents\apps\mi-proyecto
pnpm dev  # o el comando que uses
```

### Modo watch para desarrollo continuo

Puedes usar el modo watch del SDK para reconstruir automáticamente:

```bash
# Terminal 1: SDK en modo watch
cd c:\Users\93jad\Documents\apps\workflowSDK
pnpm dev  # Esto ejecuta tsup --watch

# Terminal 2: Tu proyecto
cd c:\Users\93jad\Documents\apps\mi-proyecto
pnpm dev
```

---

## Ejemplo Completo: Crear un Nuevo Proyecto

### Paso a paso completo

```bash
# 1. Construir el SDK
cd c:\Users\93jad\Documents\apps\workflowSDK
pnpm build

# 2. Crear nuevo proyecto
cd c:\Users\93jad\Documents\apps
mkdir mi-nuevo-proyecto
cd mi-nuevo-proyecto

# 3. Inicializar proyecto
pnpm init

# 4. Instalar SDK localmente
pnpm add file:../workflowSDK

# 5. Instalar otras dependencias
pnpm add dotenv
pnpm add -D typescript @types/node tsx

# 6. Crear tsconfig.json
```

**tsconfig.json:**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "moduleResolution": "node"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

**Crear archivo de ejemplo:**

```bash
mkdir src
```

**src/index.ts:**

```typescript
import { DanellaSDK } from 'workflowSDK';
import dotenv from 'dotenv';

dotenv.config();

async function main() {
  const client = new DanellaSDK({
    apiKey: process.env.WORKFLOW_API_KEY!,
    userId: parseInt(process.env.USER_ID!),
    employeeId: parseInt(process.env.EMPLOYEE_ID!),
  });

  await client.auth.login();
  console.log('✓ Autenticado');

  const tasks = await client.tasks.getBySubProject(32);
  console.log(`✓ ${tasks.length} tareas encontradas`);
}

main().catch(console.error);
```

**.env:**

```env
WORKFLOW_API_KEY=tu-api-key
USER_ID=31
EMPLOYEE_ID=5
```

**package.json scripts:**

```json
{
  "scripts": {
    "dev": "tsx src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js"
  }
}
```

**Ejecutar:**

```bash
pnpm dev
```

---

## Solución de Problemas

### Problema 1: "Cannot find module 'workflowSDK'"

**Causa:** El SDK no está construido o no está instalado correctamente.

**Solución:**

```bash
# 1. Verifica que el SDK esté construido
cd c:\Users\93jad\Documents\apps\workflowSDK
ls dist  # Debe mostrar archivos .js, .mjs, .d.ts

# Si no existe dist/
pnpm build

# 2. Reinstala en tu proyecto
cd c:\Users\93jad\Documents\apps\mi-proyecto
pnpm install
```

---

### Problema 2: Cambios en el SDK no se reflejan

**Con pnpm link:**

```bash
# Reconstruye el SDK
cd c:\Users\93jad\Documents\apps\workflowSDK
pnpm build

# Reinicia tu aplicación
cd c:\Users\93jad\Documents\apps\mi-proyecto
# Ctrl+C y volver a ejecutar
```

**Con ruta local:**

```bash
# 1. Reconstruye el SDK
cd c:\Users\93jad\Documents\apps\workflowSDK
pnpm build

# 2. Reinstala en tu proyecto
cd c:\Users\93jad\Documents\apps\mi-proyecto
pnpm install --force
```

---

### Problema 3: Errores de TypeScript

**Causa:** Los tipos no se están generando correctamente.

**Solución:**

Verifica tu `tsup.config.ts`:

```typescript
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true, // ← Asegúrate que esto esté en true
  splitting: false,
  sourcemap: true,
  clean: true,
});
```

Luego reconstruye:

```bash
cd c:\Users\93jad\Documents\apps\workflowSDK
pnpm build
```

---

### Problema 4: "Module not found" con imports internos

**Causa:** Los exports no están configurados correctamente.

**Solución:**

Verifica tu `src/index.ts`:

```typescript
// Exporta TODO lo que quieras que sea público
export { DanellaSDK } from './client';
export { DanellaConfig, DEFAULT_BASE_URL } from './config';
export {
  SecondaryFieldDTO,
  TaskSecondaryFieldValue,
  TaskCreateDto,
  TaskResponse,
} from './types/dtos';
export { DanellaError, AuthenticationError, NotFoundError, ValidationError } from './lib/errors';
```

---

### Problema 5: Errores de dependencias

**Causa:** Las dependencias del SDK no se instalan en el proyecto.

**Solución:**

Asegúrate de que `axios` esté en `dependencies` (no en `devDependencies`):

```json
{
  "dependencies": {
    "axios": "^1.13.2"
  }
}
```

Luego reinstala:

```bash
cd c:\Users\93jad\Documents\apps\mi-proyecto
pnpm install
```

---

## Comandos Útiles de Referencia Rápida

### Para el SDK

```bash
# Construir
pnpm build

# Construir en modo watch
pnpm dev

# Enlazar globalmente
pnpm link --global

# Desenlazar
pnpm unlink --global

# Limpiar y reconstruir
rm -rf dist node_modules
pnpm install
pnpm build
```

### Para tu proyecto

```bash
# Instalar desde ruta local
pnpm add file:../workflowSDK

# Instalar desde Git local
pnpm add git+file:../workflowSDK

# Enlazar SDK global
pnpm link --global workflowSDK

# Desenlazar
pnpm unlink --global workflowSDK

# Reinstalar forzado
pnpm install --force

# Actualizar SDK
pnpm update workflowSDK
```

---

## Siguiente Paso: Publicar (Opcional)

Cuando estés listo para publicar tu SDK:

### Opción 1: npm público

```bash
cd c:\Users\93jad\Documents\apps\workflowSDK

# Login en npm
npm login

# Publicar
npm publish
```

### Opción 2: npm privado (requiere cuenta de pago)

```bash
# En package.json, agrega:
{
  "private": true,
  "publishConfig": {
    "access": "restricted"
  }
}

npm publish
```

### Opción 3: GitHub Packages

```bash
# En package.json:
{
  "name": "@tu-usuario/workflowSDK",
  "repository": {
    "type": "git",
    "url": "https://github.com/tu-usuario/workflowSDK.git"
  },
  "publishConfig": {
    "registry": "https://npm.pkg.github.com"
  }
}

# Publicar
npm publish
```

---

## Resumen

**Para desarrollo activo:**

```bash
# SDK
cd workflowSDK && pnpm build && pnpm link --global

# Proyecto
cd mi-proyecto && pnpm link --global workflowSDK
```

**Para uso estable:**

```bash
# Proyecto
pnpm add file:../workflowSDK
```

**Para equipos:**

```bash
# Proyecto
pnpm add git+https://github.com/tu-usuario/workflowSDK.git
```

¡Listo! Ahora puedes usar tu SDK localmente en todos tus proyectos sin necesidad de publicarlo. 🚀
