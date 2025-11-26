// migrate-ciudad.ts - Script para ejecutar la migración de ciudad
import "dotenv/config";
import { sequelize } from "./src/db/database";

async function runMigration() {
  try {
    console.log('🚀 Iniciando migración: agregar campo ciudad a propiedades...');

    // Conectar a la base de datos
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida');

    // 1. Verificar si la columna ciudad ya existe
    console.log('📝 Verificando columna ciudad en propiedades...');
    const [results]: any = await sequelize.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = 'propiedades' 
      AND COLUMN_NAME = 'ciudad'
    `);

    if (results.length === 0) {
      // 2. Agregar la columna ciudad a la tabla propiedades
      console.log('📝 Agregando columna ciudad a propiedades...');
      await sequelize.query(`
        ALTER TABLE \`propiedades\` 
        ADD COLUMN \`ciudad\` VARCHAR(100) NULL AFTER \`parqueadero\`
      `);
      console.log('✅ Columna ciudad agregada');
    } else {
      console.log('⚠️  Columna ciudad ya existe');
    }

    // 3. Verificar si el índice ya existe
    console.log('📝 Verificando índice ciudad...');
    const [indexResults]: any = await sequelize.query(`
      SELECT INDEX_NAME 
      FROM INFORMATION_SCHEMA.STATISTICS 
      WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = 'propiedades' 
      AND INDEX_NAME = 'ciudad'
    `);

    if (indexResults.length === 0) {
      // 4. Crear el índice para ciudad (opcional, pero útil para búsquedas)
      console.log('📝 Creando índice ciudad...');
      await sequelize.query(`
        CREATE INDEX \`ciudad\` ON \`propiedades\` (\`ciudad\`)
      `);
      console.log('✅ Índice ciudad creado');
    } else {
      console.log('⚠️  Índice ciudad ya existe');
    }

    console.log('✅ Migración completada exitosamente');
  } catch (error: any) {
    console.error('❌ Error ejecutando migración:', error);
    throw error;
  } finally {
    await sequelize.close();
  }
}

// Ejecutar migración
runMigration();

