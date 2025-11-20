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

### Campos Adicionales Sugeridos

Para una mejor experiencia de desarrollo, considerar agregar:

```json
{
  "projectSecondaryFieldID": 48,
  "projectID": 16,
  "fieldDefinitionID": 30,
  "fieldName": "CC QC COMPLT (ADMIN)",
  "fieldType": "date",
  "required": true, // ← ¿Es este campo obligatorio?
  "maxLength": 255, // ← Longitud máxima para strings
  "minValue": 0, // ← Valor mínimo para números
  "maxValue": 100, // ← Valor máximo para números
  "pattern": "^[A-Z0-9-]+$", // ← Patrón regex para validación
  "options": ["Opción1", "Opción2"], // ← Para campos select/multiselect
  "placeholder": "Ingrese fecha de finalización", // ← Sugerencia de UI
  "description": "Fecha en que se completó el QC", // ← Texto de ayuda
  "deleted": 0,
  "createDate": "0001-01-01T00:00:00",
  "userID": 3
}
```

## Beneficios

### Para Consumidores de la API (desarrolladores de SDK)

- ✅ Construir SDKs type-safe con tipos TypeScript apropiados
- ✅ Implementar validación del lado del cliente antes de llamadas a la API
- ✅ Reducir requests inválidos a la API (mejor rendimiento)
- ✅ Mejores mensajes de error para usuarios finales

### Para Desarrolladores de UI

- ✅ Renderizar componentes de entrada apropiados automáticamente
- ✅ Mostrar errores de validación en tiempo real
- ✅ Mejor experiencia de usuario con autocompletado/sugerencias
- ✅ Mejoras de accesibilidad (tipos de input apropiados)

### Para la API

- ✅ Menos requests inválidos = menor carga del servidor
- ✅ Mejor documentación de la API (auto-documentada)
- ✅ Más fácil de mantener y extender
- ✅ Validación consistente entre todos los clientes

## Caso de Uso Ejemplo

**Flujo actual (sin tipos de campo):**

1. Desarrollador llama `getProjectSecondaryFields(16)`
2. Obtiene nombres de campos pero sin información de tipo
3. Intenta asignar al campo `"HOUR"` el valor `"abc"` (inválido)
4. La API retorna error 400
5. El desarrollador tiene que adivinar el formato correcto

**Flujo mejorado (con tipos de campo):**

1. Desarrollador llama `getProjectSecondaryFields(16)`
2. Ve que el campo `"HOUR"` tiene `fieldType: "number"`
3. El SDK valida la entrada antes de enviar
4. Muestra error: "HOUR debe ser un número" inmediatamente
5. No hay llamada desperdiciada a la API, mejor UX

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

## Alternativa: Endpoint Separado

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

## Contacto

Si tiene preguntas sobre estas sugerencias o necesita aclaraciones, por favor contacte al equipo de desarrollo del SDK.
