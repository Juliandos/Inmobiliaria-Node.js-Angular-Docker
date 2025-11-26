// migrate-operacion.ts - Script para ejecutar la migración de operacion
import "dotenv/config";
import { sequelize } from "./src/db/database";

async function runMigration() {
  try {
    console.log('🚀 Iniciando migración: agregar tabla operacion y campo operacion_id...');

    // Conectar a la base de datos
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida');

    // 1. Crear la tabla operacion
    console.log('📝 Creando tabla operacion...');
    try {
      await sequelize.query(`
        CREATE TABLE IF NOT EXISTS \`operacion\` (
          \`id\` INT NOT NULL AUTO_INCREMENT,
          \`nombre\` VARCHAR(50) NOT NULL,
          \`createdAt\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          \`updatedAt\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          PRIMARY KEY (\`id\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `);
      console.log('✅ Tabla operacion creada');
    } catch (error: any) {
      if (error.message.includes('already exists')) {
        console.log('⚠️  Tabla operacion ya existe');
      } else {
        throw error;
      }
    }

    // 2. Insertar datos iniciales en operacion
    console.log('📝 Insertando datos iniciales en operacion...');
    try {
      await sequelize.query(`
        INSERT INTO \`operacion\` (\`nombre\`, \`createdAt\`, \`updatedAt\`) VALUES
        ('Venta', NOW(), NOW()),
        ('Arriendo', NOW(), NOW()),
        ('Anticres', NOW(), NOW()),
        ('Hipoteca', NOW(), NOW())
        ON DUPLICATE KEY UPDATE \`nombre\` = VALUES(\`nombre\`);
      `);
      console.log('✅ Datos iniciales insertados en operacion');
    } catch (error: any) {
      console.log('⚠️  Datos ya existen o error al insertar:', error.message);
    }

    // 3. Verificar si la columna operacion_id ya existe
    console.log('📝 Verificando columna operacion_id en propiedades...');
    const [results]: any = await sequelize.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = 'propiedades' 
      AND COLUMN_NAME = 'operacion_id'
    `);

    if (results.length === 0) {
      // 4. Agregar la columna operacion_id a la tabla propiedades
      console.log('📝 Agregando columna operacion_id a propiedades...');
      await sequelize.query(`
        ALTER TABLE \`propiedades\` 
        ADD COLUMN \`operacion_id\` INT NULL AFTER \`usuario_id\`
      `);
      console.log('✅ Columna operacion_id agregada');
    } else {
      console.log('⚠️  Columna operacion_id ya existe');
    }

    // 5. Verificar si el índice ya existe
    console.log('📝 Verificando índice operacion_id...');
    const [indexResults]: any = await sequelize.query(`
      SELECT INDEX_NAME 
      FROM INFORMATION_SCHEMA.STATISTICS 
      WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = 'propiedades' 
      AND INDEX_NAME = 'operacion_id'
    `);

    if (indexResults.length === 0) {
      // 6. Crear el índice para operacion_id
      console.log('📝 Creando índice operacion_id...');
      await sequelize.query(`
        CREATE INDEX \`operacion_id\` ON \`propiedades\` (\`operacion_id\`)
      `);
      console.log('✅ Índice operacion_id creado');
    } else {
      console.log('⚠️  Índice operacion_id ya existe');
    }

    // 7. Verificar si la foreign key ya existe
    console.log('📝 Verificando foreign key fk_propiedades_operacion...');
    const [fkResults]: any = await sequelize.query(`
      SELECT CONSTRAINT_NAME 
      FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
      WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = 'propiedades' 
      AND CONSTRAINT_NAME = 'fk_propiedades_operacion'
    `);

    if (fkResults.length === 0) {
      // 8. Agregar la foreign key constraint
      console.log('📝 Agregando foreign key fk_propiedades_operacion...');
      await sequelize.query(`
        ALTER TABLE \`propiedades\`
        ADD CONSTRAINT \`fk_propiedades_operacion\`
        FOREIGN KEY (\`operacion_id\`) REFERENCES \`operacion\` (\`id\`)
        ON DELETE SET NULL
        ON UPDATE CASCADE
      `);
      console.log('✅ Foreign key fk_propiedades_operacion creada');
    } else {
      console.log('⚠️  Foreign key fk_propiedades_operacion ya existe');
    }

    console.log('✅ Migración completada exitosamente');

  } catch (error) {
    console.error('❌ Error ejecutando migración:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

runMigration();

