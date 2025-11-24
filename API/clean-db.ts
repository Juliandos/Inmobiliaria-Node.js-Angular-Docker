// Script para limpiar completamente la base de datos
import "dotenv/config";
import { sequelize, models } from "./src/db/database";

async function cleanDatabase() {
  try {
    console.log('🧹 Limpiando base de datos...');
    
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida');
    
    // Desactivar foreign key checks temporalmente
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    
    // Eliminar todas las tablas en orden (respetando foreign keys)
    console.log('🗑️ Eliminando datos...');
    
    await models.imagenes_propiedad.destroy({ where: {}, force: true });
    await models.propiedades.destroy({ where: {}, force: true });
    await models.permisos.destroy({ where: {}, force: true });
    await models.usuarios.destroy({ where: {}, force: true });
    await models.tipos_propiedad.destroy({ where: {}, force: true });
    await models.modulos.destroy({ where: {}, force: true });
    await models.roles.destroy({ where: {}, force: true });
    
    // Reactivar foreign key checks
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    
    console.log('✅ Base de datos limpiada completamente');
    
  } catch (error) {
    console.error('❌ Error limpiando base de datos:', error);
  } finally {
    await sequelize.close();
  }
}

cleanDatabase();

