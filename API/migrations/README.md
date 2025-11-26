# Migración: Agregar tabla operacion y campo operacion_id

Esta migración agrega:
1. La tabla `operacion` con campos: `id`, `nombre`, `createdAt`, `updatedAt`
2. El campo `operacion_id` a la tabla `propiedades` como foreign key a `operacion`
3. Datos iniciales en la tabla `operacion`: Venta, Arriendo, Anticres, Hipoteca

## Ejecutar la migración en Docker

### Opción 1: Ejecutar desde el contenedor de la API

```bash
# Entrar al contenedor de la API
docker exec -it inmobiliaria-api bash

# Ejecutar la migración
npm run migrate-operacion
```

### Opción 2: Ejecutar desde fuera del contenedor

```bash
# Ejecutar el script directamente en el contenedor
docker exec -it inmobiliaria-api npm run migrate-operacion
```

### Opción 3: Ejecutar SQL directamente en MySQL

```bash
# Entrar al contenedor de MySQL
docker exec -it inmobiliaria-mysql mysql -u root -p

# Ingresar la contraseña (por defecto: 123456)
# Luego ejecutar el contenido del archivo add-operacion-table.sql
```

## Verificar la migración

Después de ejecutar la migración, puedes verificar que todo esté correcto:

```sql
-- Ver la estructura de la tabla operacion
DESCRIBE operacion;

-- Ver los datos insertados
SELECT * FROM operacion;

-- Ver la estructura de la tabla propiedades (debe incluir operacion_id)
DESCRIBE propiedades;

-- Verificar la foreign key
SHOW CREATE TABLE propiedades;
```

## Notas

- La migración es idempotente: puedes ejecutarla múltiples veces sin problemas
- Si la columna, índice o foreign key ya existen, se omitirán con un mensaje de advertencia
- Los datos iniciales se insertan con `ON DUPLICATE KEY UPDATE` para evitar duplicados

