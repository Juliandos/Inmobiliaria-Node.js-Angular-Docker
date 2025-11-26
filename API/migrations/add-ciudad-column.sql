-- ============================================
-- MIGRACIÓN: Agregar campo ciudad a la tabla propiedades
-- ============================================

-- 1. Agregar la columna ciudad a la tabla propiedades (si no existe)
-- Se coloca después del campo parqueadero
ALTER TABLE `propiedades` 
ADD COLUMN IF NOT EXISTS `ciudad` VARCHAR(100) NULL AFTER `parqueadero`;

-- 2. Crear el índice para ciudad (útil para búsquedas y filtros)
CREATE INDEX IF NOT EXISTS `ciudad` ON `propiedades` (`ciudad`);

-- 3. Verificar la estructura de la tabla
DESCRIBE propiedades;

