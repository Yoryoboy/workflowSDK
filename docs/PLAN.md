# Plan de Desarrollo: Danella SDK

Este documento describe el plan de implementación para la SDK de TypeScript que interactuará con la API de Danella (v1). El objetivo es crear una librería moderna, robusta y fácil de usar.

## 1. Stack Tecnológico y Herramientas

Utilizaremos un stack moderno enfocado en rendimiento, tipado estricto y "Developer Experience" (DX).

- **Package Manager:** `pnpm`. Eficiente y rápido en manejo de espacio en disco.
- **Lenguaje:** TypeScript 5.x (Strict Mode).
- **Runtime:** Node.js (Compatible con navegadores si se requiere en el futuro).
- **Bundler:** `tsup` (Basado en esbuild). Es el estándar actual para librerías TS por su velocidad y generación automática de archivos `.d.ts`.
- **HTTP Client:** `axios`. Elegido por su robustez, manejo automático de JSON e interceptores.
- **Testing:** `Vitest` (Alternativa rápida a Jest, nativa para ESM).
- **Linting/Formatting:** `ESLint` + `Prettier`.
- **CI/CD Prep:** Configuración de scripts estándar (`build`, `test`, `lint`).

## 2. Arquitectura Propuesta

La SDK seguirá un patrón orientado a clases para manejar la configuración y el estado (como el token de autenticación) de manera encapsulada.

### Estructura de Directorios

```
workflowSDK/
├── src/
│   ├── index.ts            # Punto de entrada (exports)
│   ├── client.ts           # Clase principal (DanellaSDK)
│   ├── config.ts           # Tipos de configuración
│   ├── lib/
│   │   ├── httpClient.ts   # Instancia de Axios configurada
│   │   └── errors.ts       # Manejo de errores tipados
│   ├── resources/
│   │   ├── auth.ts         # Lógica de Auth (Token)
│   │   └── tasks.ts        # Endpoints de Tareas
│   └── types/
│       └── dtos.ts         # Interfaces (SecondaryFieldDTO, TaskCreateDto, etc.)
├── dist/                   # Archivos compilados
├── tests/                  # Tests unitarios e integración
├── package.json
├── tsconfig.json
└── tsup.config.ts
```

### Diseño de la API (Cómo la usará el desarrollador)

Queremos que sea intuitiva. El objetivo es lograr algo así:

```typescript
import { DanellaSDK } from "danella-sdk";

// 1. Inicialización
const client = new DanellaSDK({
  apiKey: "...",
  userId: 31,
  employeeId: 5,
  baseUrl: "https://danella-x.com", // Opcional, default production
});

// 2. Autenticación (Puede ser explícita o automática en la primera llamada)
await client.auth.login();

// 3. Uso de recursos
const tasks = await client.tasks.getBySubProject(101);
const details = await client.tasks.getById(500);

// 4. Crear/Actualizar
await client.tasks.update({
  id: 500,
  title: "Nueva tarea",
  // ... tipado estricto aquí
});
```

## 3. Fases de Desarrollo

### Fase 1: Setup Inicial (Scaffolding)

- Inicializar `package.json`.
- Configurar TypeScript (`tsconfig.json` estricto).
- Configurar `tsup` para el build.
- Configurar `eslint` y `prettier`.

### Fase 2: Core & Infraestructura

- Crear la clase base `DanellaClient`.
- Implementar el wrapper de HTTP (`HttpClient`) que maneje:
  - Headers base (`Content-Type`).
  - Inyección del Bearer Token automáticamente.
  - Transformación de respuestas (JSON parsing).
  - Manejo de errores HTTP (401, 404, 500) convertidos a errores de JS.

### Fase 3: Autenticación

- Implementar `AuthResource`.
- Endpoint: `POST /api/auth/token`.
- Lógica para guardar el token en memoria dentro de la instancia de la SDK.
- (Opcional) Lógica de re-intento si el token expira.

### Fase 4: Implementación de Endpoints (Tasks)

Mapeo de los 4 endpoints restantes en `TasksResource`:

1.  `GET /api/tasks/project-secondary-fields/{projectID}` -> `tasks.getProjectSecondaryFields(projectId)`
2.  `GET /api/tasks/by-subproject/{subProjectID}` -> `tasks.getBySubProject(subProjectId)`
3.  `GET /api/tasks/{id}` -> `tasks.getById(id)`
4.  `PUT /api/tasks` -> `tasks.update(payload)`

### Fase 5: Tipado (DTOs)

- Definir interfaces TypeScript precisas basadas en lo que vimos en Swagger (`SecondaryFieldDTO`, `TaskCreateDto`, etc.) para asegurar autocompletado en el IDE.

### Fase 6: Pruebas y Documentación

- Crear tests básicos con `Vitest` (mockeando las llamadas de red).
- Generar un README.md con ejemplos de uso.

## 4. Preguntas / Decisiones para ti

1.  **Manejo del Token:** ¿Prefieres que el usuario llame manualmente a `.login()` o que la SDK intente loguearse automáticamente si detecta que no tiene token al hacer una petición?
2.  **Entorno:** ¿Esta SDK correrá solo en servidor (Node.js) o también en frontend? (Esto influye en cómo guardamos secretos o si usamos `fetch`). _Asumiré "Isomorphic" (ambos) usando fetch nativo._
3.  **Estructura de Auth:** Según tus notas, necesitas `workflowApiKey`, `userID`, `employeeID` y `name`. ¿Todos estos son necesarios para el endpoint `/token`? Validaremos esto contra la definición del Swagger.
