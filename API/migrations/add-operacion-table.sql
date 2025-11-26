-- ============================================
-- MIGRACIÓN: Agregar tabla operacion y campo operacion_id a propiedades
-- ============================================

-- 1. Crear la tabla operacion
CREATE TABLE IF NOT EXISTS `operacion` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(50) NOT NULL,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Insertar datos iniciales en operacion
INSERT INTO `operacion` (`nombre`, `createdAt`, `updatedAt`) VALUES
('Venta', NOW(), NOW()),
('Arriendo', NOW(), NOW()),
('Anticres', NOW(), NOW()),
('Hipoteca', NOW(), NOW())
ON DUPLICATE KEY UPDATE `nombre` = VALUES(`nombre`);

-- 3. Agregar la columna operacion_id a la tabla propiedades (si no existe)
ALTER TABLE `propiedades` 
ADD COLUMN IF NOT EXISTS `operacion_id` INT NULL AFTER `usuario_id`;

-- 4. Crear el índice para operacion_id
CREATE INDEX IF NOT EXISTS `operacion_id` ON `propiedades` (`operacion_id`);

-- 5. Agregar la foreign key constraint
ALTER TABLE `propiedades`
ADD CONSTRAINT `fk_propiedades_operacion`
FOREIGN KEY (`operacion_id`) REFERENCES `operacion` (`id`)
ON DELETE SET NULL
ON UPDATE CASCADE;

