# Sugerencias de Mejora para la API

## Endpoint: `GET /api/tasks/project-secondary-fields/{projectID}`

### Estructura de Respuesta Actual

```json
{
  "projectSecondaryFieldID": 48,
  "projectID": 16,
  "fieldDefinitionID": 30,
  "fieldName": "CC QC COMPLT (ADMIN)",
  "deleted": 0,
  "createDate": "0001-01-01T00:00:00",
  "userID": 3
}
```

### Problema

La respuesta **no incluye** el tipo de dato que acepta cada campo. Esto dificulta a los desarrolladores:

- Validar la entrada del usuario antes de enviarla a la API
- Construir componentes UI apropiados (input de texto vs. número vs. selector de fecha)
- Proporcionar autocompletado o sugerencias
- Mostrar mensajes de error apropiados

### Mejora Sugerida

Agregar una propiedad `fieldType` o `dataType` para indicar el tipo de dato esperado:

```json
{
  "projectSecondaryFieldID": 48,
  "projectID": 16,
  "fieldDefinitionID": 30,
  "fieldName": "CC QC COMPLT (ADMIN)",
  "fieldType": "string", // ← NUEVO CAMPO
  "deleted": 0,
  "createDate": "0001-01-01T00:00:00",
  "userID": 3
}
```

### Tipos de Campo Recomendados

```typescript
type FieldType =
  | 'string' // Entrada de texto
  | 'number' // Entrada numérica
  | 'integer' // Solo números enteros
  | 'decimal' // Números decimales
  | 'date' // Solo fecha (YYYY-MM-DD)
  | 'datetime' // Fecha y hora (ISO 8601)
  | 'boolean' // verdadero/falso
  | 'email' // Validación de email
  | 'url' // Validación de URL
  | 'phone' // Número de teléfono
  | 'select' // Dropdown (requiere lista de opciones)
  | 'multiselect' // Selección múltiple
  | 'textarea'; // Texto largo
```

## Caso de Uso Ejemplo

**Flujo actual (sin tipos de campo):**

1. Desarrollador llama `getProjectSecondaryFields(16)`
2. Obtiene nombres de campos pero sin información de tipo
3. Intenta asignar al campo `"HOUR"` el valor `"abc"` (inválido)
4. La API retorna error 400
5. El desarrollador tiene que adivinar el formato correcto

## Prioridad de Implementación

### Alta Prioridad (Esencial)

- ✅ `fieldType` - Crítico para validación

### Prioridad Media (Recomendado)

- ✅ `required` - Ayuda con validación de formularios
- ✅ `maxLength` - Previene errores de truncamiento

### Prioridad Baja (Deseable)

- ✅ `description` - Mejor documentación
- ✅ `placeholder` - Sugerencias de UI
- ✅ `options` - Para campos dropdown

## Propuesta a futuro (no critica): Endpoint Separado

Si modificar el endpoint existente no es factible, considerar crear un nuevo endpoint:

```
GET /api/tasks/field-definitions/{fieldDefinitionID}
```

Respuesta:

```json
{
  "fieldDefinitionID": 30,
  "fieldName": "CC QC COMPLT (ADMIN)",
  "fieldType": "date",
  "required": true,
  "description": "Fecha en que se completó el control de calidad",
  "validationRules": {
    "pattern": "^\\d{4}-\\d{2}-\\d{2}$",
    "minDate": "2020-01-01",
    "maxDate": "2030-12-31"
  }
}
```

Esto permite a los clientes obtener metadata detallada de campos cuando sea necesario sin cambiar el endpoint existente.

---

---

## Sugerencia 2: Endpoint para Actualizar Tareas Existentes

### ❌ Problema Actual

El endpoint `PUT /api/tasks` actualmente solo permite **crear** nuevas tareas, no actualizar tareas existentes. Esto limita la funcionalidad de la API porque:

- No se pueden modificar tareas ya creadas
- No se puede cambiar el estado de una tarea (ej: de "In Progress" a "Completed")
- No se pueden actualizar campos secundarios de tareas existentes
- No se puede corregir información errónea sin eliminar y recrear la tarea

### ✅ Mejora Sugerida

Implementar uno de los siguientes enfoques:

#### Opción 1: Usar el mismo endpoint con lógica condicional

Modificar `PUT /api/tasks` para que:

- Si el payload incluye un `SystemID`, **actualiza** la tarea existente
- Si no incluye `SystemID`, **crea** una nueva tarea

```json
// Crear nueva tarea (comportamiento actual)
PUT /api/tasks
{
  "subProjectID": 45,
  "jobID": "TEST-001",
  "estimatedClosingDate": "2025-12-31T00:00:00"
}

// Actualizar tarea existente (nuevo)
PUT /api/tasks
{
  "SystemID": "SYS-006254",
  "taskStatusID": 9,
  "estimatedClosingDate": "2025-12-31T00:00:00"
}
```

### Casos de Uso Importantes

1. **Cambiar estado de tarea**

   ```json
   PUT /api/tasks
   { "SystemID": "SYS-006254", "taskStatusID": 3 }
   ```

2. **Actualizar fecha estimada**

   ```json
   PUT /api/tasks/5671
   { "estimatedClosingDate": "2025-12-31T00:00:00" }
   ```

3. **Modificar campos secundarios**

   ```json
   PUT /api/tasks/5671
   {
     "secondaryFields": [
       { "fieldName": "DESIGNER", "value": "John Doe" }
     ]
   }
   ```

4. **Actualización múltiple**
   ```json
   PUT /api/tasks/5671
   {
     "taskStatusID": 9,
     "endDate": "2025-11-20T00:00:00",
     "secondaryFields": [
       { "fieldName": "STATUS", "value": "Completed" }
     ]
   }
   ```

### Validaciones Recomendadas

1. **Verificar existencia:** Retornar 404 si el `taskID` no existe
2. **Validar transiciones de estado:** Algunas transiciones pueden no ser válidas
