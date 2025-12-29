# Danella SDK

SDK moderno en TypeScript para interactuar con la API de Danella Workflow.

## Descripción

Danella SDK es una biblioteca cliente que simplifica la integración con la API de Danella, proporcionando una interfaz tipada y fácil de usar para gestionar tareas, autenticación y otros recursos del sistema.

## Características

- **TypeScript nativo** - Tipado completo para mejor experiencia de desarrollo y autocompletado
- **Manejo automático de tokens** - Refresco automático de tokens de autenticación cuando expiran
- **Gestión de errores tipada** - Errores específicos para diferentes casos (AuthenticationError, NotFoundError, ValidationError)
- **Cliente HTTP robusto** - Basado en Axios con interceptores configurados para manejo de autenticación
- **Sistema de caché** - Optimización de tokens para reducir llamadas de autenticación

## Recursos disponibles

### Autenticación

- Login y logout
- Verificación de estado de autenticación
- Obtención de tokens de acceso
- Refresco automático de tokens

### Tareas (Tasks)

- Obtener campos secundarios de proyectos
- Consultar tareas por subproyecto
- Obtener detalles de tareas individuales
- Crear y actualizar tareas con campos personalizados

## Documentación

Para documentación completa sobre instalación, configuración y uso, consulta:

- **[docs.md](./docs.md)** - Documentación completa de la API con ejemplos

## Desarrollo

```bash
pnpm install    # Instalar dependencias
pnpm build      # Construir el SDK
pnpm dev        # Modo watch para desarrollo
pnpm lint       # Linter
pnpm format     # Formatear código
```

## Licencia

ISC
