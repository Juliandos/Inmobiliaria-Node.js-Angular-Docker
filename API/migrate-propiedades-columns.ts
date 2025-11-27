// migrate-propiedades-columns.ts - Script para agregar columnas faltantes a propiedades
import "dotenv/config";
import { sequelize } from "./src/db/database";

async function runMigration() {
  try {
    console.log('🚀 Iniciando migración: agregar columnas faltantes a propiedades...');

    // Conectar a la base de datos
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida');

    // Columnas a verificar y agregar si no existen
    const columns = [
      {
        name: 'area',
        definition: 'DECIMAL(10,2) NULL DEFAULT 0 COMMENT \'Área en metros cuadrados\'',
        after: 'precio'
      },
      {
        name: 'habitaciones',
        definition: 'INT NULL DEFAULT 0',
        after: 'area'
      },
      {
        name: 'banos',
        definition: 'INT NULL DEFAULT 0',
        after: 'habitaciones'
      },
      {
        name: 'parqueadero',
        definition: 'INT NULL DEFAULT 0',
        after: 'banos'
      },
      {
        name: 'ciudad',
        definition: 'VARCHAR(100) NULL COMMENT \'Ciudad donde se encuentra la propiedad\'',
        after: 'parqueadero'
      }
    ];

    for (const column of columns) {
      // Verificar si la columna ya existe
      console.log(`📝 Verificando columna ${column.name} en propiedades...`);
      const [results]: any = await sequelize.query(`
        SELECT COLUMN_NAME 
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_SCHEMA = DATABASE() 
        AND TABLE_NAME = 'propiedades' 
        AND COLUMN_NAME = '${column.name}'
      `);

      if (results.length === 0) {
        // Agregar la columna
        console.log(`📝 Agregando columna ${column.name} a propiedades...`);
        await sequelize.query(`
          ALTER TABLE \`propiedades\` 
          ADD COLUMN \`${column.name}\` ${column.definition} AFTER \`${column.after}\`
        `);
        console.log(`✅ Columna ${column.name} agregada`);
      } else {
        console.log(`⚠️  Columna ${column.name} ya existe`);
      }
    }

    // Verificar y crear índices si es necesario
    const indexesToCreate = ['ciudad'];
    for (const indexName of indexesToCreate) {
      console.log(`📝 Verificando índice ${indexName}...`);
      const [indexResults]: any = await sequelize.query(`
        SELECT INDEX_NAME 
        FROM INFORMATION_SCHEMA.STATISTICS 
        WHERE TABLE_SCHEMA = DATABASE() 
        AND TABLE_NAME = 'propiedades' 
        AND INDEX_NAME = '${indexName}'
      `);

      if (indexResults.length === 0) {
        console.log(`📝 Creando índice ${indexName}...`);
        await sequelize.query(`
          CREATE INDEX \`${indexName}\` ON \`propiedades\` (\`${indexName}\`)
        `);
        console.log(`✅ Índice ${indexName} creado`);
      } else {
        console.log(`⚠️  Índice ${indexName} ya existe`);
      }
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

