// Script para corregir contraseñas de usuarios
import "dotenv/config";
import bcryptjs from "bcryptjs";
import { sequelize, models } from "./src/db/database";

async function fixPasswords() {
  try {
    console.log('🔧 Iniciando corrección de contraseñas...');
    
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida');
    
    const usuarios = [
      { email: 'admin@test.com', password: '123456' },
      { email: 'jefe@test.com', password: '123456' },
      { email: 'secretario@test.com', password: '123456' },
      { email: 'usuario@test.com', password: '123456' }
    ];
    
    for (const usuarioData of usuarios) {
      const user = await models.usuarios.findOne({ where: { email: usuarioData.email } });
      
      if (!user) {
        console.log(`⚠️ Usuario no encontrado: ${usuarioData.email}`);
        continue;
      }
      
      console.log(`\n📝 Procesando: ${usuarioData.email}`);
      console.log(`   - ID: ${user.id}`);
      console.log(`   - Contraseña actual (primeros 30 chars): ${user.password?.substring(0, 30)}...`);
      
      // Generar nuevo hash
      const newHash = await bcryptjs.hash(usuarioData.password, 10);
      console.log(`   - Nuevo hash (primeros 30 chars): ${newHash.substring(0, 30)}...`);
      
      // Actualizar contraseña
      await user.update({ password: newHash });
      
      // Verificar que funciona
      const verifyUser = await models.usuarios.findOne({ where: { email: usuarioData.email } });
      const testCompare = await bcryptjs.compare(usuarioData.password, verifyUser!.password);
      
      console.log(`   - Verificación: ${testCompare ? '✅ CORRECTO' : '❌ INCORRECTO'}`);
    }
    
    console.log('\n✅ Corrección de contraseñas completada');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await sequelize.close();
  }
}

fixPasswords();

