# Migración: Agregar campo ciudad a la tabla propiedades

Esta migración agrega el campo `ciudad` a la tabla `propiedades` para almacenar la ciudad donde se encuentra cada propiedad.

## Ejecutar la migración en Docker

### Opción 1: Ejecutar desde el contenedor de la API

```bash
# Entrar al contenedor de la API
docker exec -it inmobiliaria-api bash

# Ejecutar la migración
npm run migrate-ciudad
```

### Opción 2: Ejecutar desde fuera del contenedor

```bash
# Ejecutar el script directamente en el contenedor
docker exec -it inmobiliaria-api npm run migrate-ciudad
```

### Opción 3: Ejecutar SQL directamente en MySQL

```bash
# Entrar al contenedor de MySQL
docker exec -it inmobiliaria-mysql mysql -u root -p123456 db_inmobiliaria

# Luego ejecutar el contenido del archivo add-ciudad-column.sql
```

## Verificar la migración

Después de ejecutar la migración, puedes verificar que todo esté correcto:

```sql
-- Ver la estructura de la tabla propiedades (debe incluir ciudad)
DESCRIBE propiedades;

-- Ver algunas propiedades con el campo ciudad
SELECT id, titulo, ciudad FROM propiedades LIMIT 10;

-- Verificar el índice
SHOW INDEX FROM propiedades WHERE Column_name = 'ciudad';
```

## Notas

- La migración es idempotente: puedes ejecutarla múltiples veces sin problemas
- Si la columna o índice ya existen, se omitirán con un mensaje de advertencia
- El campo `ciudad` es opcional (NULL permitido) para no afectar datos existentes
- Se crea un índice en `ciudad` para mejorar el rendimiento de búsquedas y filtros

## Actualizar datos existentes (opcional)

Si quieres actualizar las propiedades existentes con valores de ciudad, puedes ejecutar:

```sql
-- Ejemplo: Actualizar propiedades con ciudad basada en el título o descripción
UPDATE propiedades 
SET ciudad = 'Popayán' 
WHERE (titulo LIKE '%Popayán%' OR descripcion LIKE '%Popayán%') 
AND ciudad IS NULL;

UPDATE propiedades 
SET ciudad = 'Cali' 
WHERE (titulo LIKE '%Cali%' OR descripcion LIKE '%Cali%') 
AND ciudad IS NULL;
```

