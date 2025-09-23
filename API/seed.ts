// seed.ts - Script para llenar datos iniciales
import "dotenv/config";
import bcrypt from "bcrypt";
import { sequelize, models } from "./src/db/database";

async function seedDatabase() {
  try {
    console.log('🚀 Iniciando seed de la base de datos...');

    // Sincronizar base de datos (crea las tablas si no existen)
    await sequelize.sync({ force: false });

    // ✅ 1. Crear Roles
    console.log('📝 Creando roles...');
    const roles = await models.roles.bulkCreate([
      { nombre: 'Administrador' },
      { nombre: 'Jefe' },
      { nombre: 'Secretario' },
      { nombre: 'Usuario' }
    ], { ignoreDuplicates: true });

    // ✅ 2. Crear Módulos
    console.log('📝 Creando módulos...');
    const modulos = await models.modulos.bulkCreate([
      { nombre: 'usuarios' },
      { nombre: 'roles' },
      { nombre: 'propiedades' },
      { nombre: 'tipos_propiedad' },
      { nombre: 'imagenes_propiedad' },
      { nombre: 'permisos' },
      { nombre: 'modulos' }
    ], { ignoreDuplicates: true });

    // ✅ 3. Crear Tipos de Propiedad
    console.log('📝 Creando tipos de propiedad...');
    await models.tipos_propiedad.bulkCreate([
      { nombre: 'Casa' },
      { nombre: 'Apartamento' },
      { nombre: 'Local Comercial' },
      { nombre: 'Oficina' },
      { nombre: 'Bodega' },
      { nombre: 'Lote' },
      { nombre: 'Finca' }
    ], { ignoreDuplicates: true });

    // ✅ 4. Crear Usuarios
    console.log('📝 Creando usuarios...');
    const hashedPassword = await bcrypt.hash('123456', 10);
    await models.usuarios.bulkCreate([
      { email: 'admin@test.com', nombre: 'Admin', apellido: 'Sistema', password: hashedPassword, rol_id: 1 },
      { email: 'jefe@test.com', nombre: 'Juan', apellido: 'Pérez', password: hashedPassword, rol_id: 2 },
      { email: 'secretario@test.com', nombre: 'María', apellido: 'González', password: hashedPassword, rol_id: 3 },
      { email: 'usuario@test.com', nombre: 'Carlos', apellido: 'Rodríguez', password: hashedPassword, rol_id: 4 }
    ], { ignoreDuplicates: true });

    // ✅ 5. Configurar Permisos
    console.log('📝 Configurando permisos...');
    
    // Obtener todos los roles y módulos
    const allRoles = await models.roles.findAll();
    const allModulos = await models.modulos.findAll();

    // Configuración de permisos por rol
    const permisosConfig = [
      // Administrador: Todos los permisos
      { rolNombre: 'Administrador', permisos: { c: 1, r: 1, u: 1, d: 1 } },
      // Jefe: Todos los permisos
      { rolNombre: 'Jefe', permisos: { c: 1, r: 1, u: 1, d: 1 } },
      // Secretario: Solo lectura y actualización
      { rolNombre: 'Secretario', permisos: { c: 0, r: 1, u: 1, d: 0 } }
    ];

    // Crear permisos para Administrador, Jefe y Secretario
    for (const config of permisosConfig) {
      const rol = allRoles.find(r => r.nombre === config.rolNombre);
      if (rol) {
        for (const modulo of allModulos) {
          await models.permisos.create({
            nombre: `${config.rolNombre} - ${modulo.nombre}`,
            c: config.permisos.c,
            r: config.permisos.r,
            u: config.permisos.u,
            d: config.permisos.d,
            rol_id: rol.id,
            modulo_id: modulo.id
          });
        }
      }
    }

    // Permisos especiales para Usuario (solo lectura en propiedades y tipos_propiedad)
    const usuarioRol = allRoles.find(r => r.nombre === 'Usuario');
    if (usuarioRol) {
      const propiedadesModulo = allModulos.find(m => m.nombre === 'propiedades');
      const tiposModulo = allModulos.find(m => m.nombre === 'tipos_propiedad');
      
      if (propiedadesModulo) {
        await models.permisos.create({
          nombre: 'Usuario - propiedades',
          c: 0, r: 1, u: 0, d: 0,
          rol_id: usuarioRol.id,
          modulo_id: propiedadesModulo.id
        });
      }
      
      if (tiposModulo) {
        await models.permisos.create({
          nombre: 'Usuario - tipos_propiedad',
          c: 0, r: 1, u: 0, d: 0,
          rol_id: usuarioRol.id,
          modulo_id: tiposModulo.id
        });
      }
    }

    // ✅ 6. Crear Propiedades de ejemplo
    console.log('📝 Creando propiedades de ejemplo...');
    const propiedades = await models.propiedades.bulkCreate([
      { titulo: 'Casa en Zona Norte', descripcion: 'Hermosa casa de 3 habitaciones con jardín', precio: 250000000.00, habitaciones: 3, banos: 2, parqueadero: 2, tipo_id: 1, usuario_id: 2 },
      { titulo: 'Apartamento Centro', descripcion: 'Moderno apartamento en el centro de la ciudad', precio: 180000000.00, habitaciones: 2, banos: 1, parqueadero: 1, tipo_id: 2, usuario_id: 2 },
      { titulo: 'Local Comercial', descripcion: 'Local comercial en zona comercial', precio: 120000000.00, habitaciones: 0, banos: 1, parqueadero: 0, tipo_id: 3, usuario_id: 3 },
      { titulo: 'Oficina Ejecutiva', descripcion: 'Oficina moderna para empresas', precio: 85000000.00, habitaciones: 0, banos: 1, parqueadero: 1, tipo_id: 4, usuario_id: 3 },
      { titulo: 'Casa Campestre', descripcion: 'Casa de descanso en las afueras', precio: 320000000.00, habitaciones: 4, banos: 3, parqueadero: 3, tipo_id: 1, usuario_id: 2 }
    ]);

    // ✅ 7. Crear Imágenes de ejemplo
    console.log('📝 Creando imágenes de ejemplo...');
    await models.imagenes_propiedad.bulkCreate([
      { propiedad_id: 1, url: 'https://example.com/casa1-frente.jpg' },
      { propiedad_id: 1, url: 'https://example.com/casa1-interior.jpg' },
      { propiedad_id: 2, url: 'https://example.com/apt1-sala.jpg' },
      { propiedad_id: 3, url: 'https://example.com/local1-frente.jpg' },
      { propiedad_id: 4, url: 'https://example.com/oficina1.jpg' },
      { propiedad_id: 5, url: 'https://example.com/casa-campestre.jpg' }
    ]);

    console.log('✅ Seed completado exitosamente!');
    console.log('\n📊 Datos creados:');
    console.log(`- ${allRoles.length} roles`);
    console.log(`- ${allModulos.length} módulos`);
    console.log('- 7 tipos de propiedad');
    console.log('- 4 usuarios (password: 123456)');
    console.log('- Permisos configurados según roles');
    console.log('- 5 propiedades de ejemplo');
    console.log('- 6 imágenes de ejemplo');

    console.log('\n👥 Usuarios creados:');
    console.log('- admin@test.com (Administrador)');
    console.log('- jefe@test.com (Jefe)');
    console.log('- secretario@test.com (Secretario)');
    console.log('- usuario@test.com (Usuario)');

  } catch (error) {
    console.error('❌ Error durante el seed:', error);
  } finally {
    await sequelize.close();
  }
}

// Ejecutar seed
seedDatabase();