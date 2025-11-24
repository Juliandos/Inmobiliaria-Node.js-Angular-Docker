// seed.ts - Script para llenar datos iniciales
import "dotenv/config";
import bcryptjs from "bcryptjs";
import { sequelize, models } from "./src/db/database";

async function seedDatabase() {
  try {
    console.log('🚀 Iniciando seed de la base de datos...');

    // Sincronizar base de datos (crea las tablas si no existen)
    await sequelize.sync({ force: false });

    // ✅ 1. Crear Roles
    console.log('📝 Creando roles...');
    await models.roles.bulkCreate([
      { nombre: 'Administrador' },
      { nombre: 'Jefe' },
      { nombre: 'Secretario' },
      { nombre: 'Usuario' }
    ], { ignoreDuplicates: true });
    
    // Obtener los roles después de crearlos para usar sus IDs reales
    const roles = await models.roles.findAll({ order: [['id', 'ASC']] });
    const rolAdmin = roles.find(r => r.nombre === 'Administrador');
    const rolJefe = roles.find(r => r.nombre === 'Jefe');
    const rolSecretario = roles.find(r => r.nombre === 'Secretario');
    const rolUsuario = roles.find(r => r.nombre === 'Usuario');
    
    console.log('✅ Roles encontrados:', {
      admin: rolAdmin?.id,
      jefe: rolJefe?.id,
      secretario: rolSecretario?.id,
      usuario: rolUsuario?.id
    });

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
    const hashedPassword = await bcryptjs.hash('123456', 10);
    
    // Verificar y crear/actualizar usuarios uno por uno
    const usuariosData = [
      { email: 'admin@test.com', nombre: 'Admin', apellido: 'Sistema', password: hashedPassword, rol_id: rolAdmin?.id },
      { email: 'jefe@test.com', nombre: 'Juan', apellido: 'Pérez', password: hashedPassword, rol_id: rolJefe?.id },
      { email: 'secretario@test.com', nombre: 'María', apellido: 'González', password: hashedPassword, rol_id: rolSecretario?.id },
      { email: 'usuario@test.com', nombre: 'Carlos', apellido: 'Rodríguez', password: hashedPassword, rol_id: rolUsuario?.id }
    ];
    
    for (const usuarioData of usuariosData) {
      if (!usuarioData.rol_id) {
        console.warn(`⚠️ No se encontró el rol para ${usuarioData.email}, saltando...`);
        continue;
      }
      
      const existingUser = await models.usuarios.findOne({ where: { email: usuarioData.email } });
      
      if (existingUser) {
        // Actualizar usuario existente con nueva contraseña y rol
        console.log(`🔄 Actualizando usuario existente: ${usuarioData.email}`);
        console.log(`   - Rol ID: ${usuarioData.rol_id}`);
        console.log(`   - Contraseña hasheada: ${hashedPassword.substring(0, 20)}...`);
        
        await existingUser.update({
          password: hashedPassword,
          rol_id: usuarioData.rol_id,
          nombre: usuarioData.nombre,
          apellido: usuarioData.apellido
        });
        
        // Verificar que se actualizó correctamente
        const updatedUser = await models.usuarios.findOne({ where: { email: usuarioData.email } });
        console.log(`   ✅ Usuario actualizado. Nueva contraseña: ${updatedUser?.password?.substring(0, 20)}...`);
      } else {
        // Crear nuevo usuario
        console.log(`➕ Creando nuevo usuario: ${usuarioData.email}`);
        console.log(`   - Rol ID: ${usuarioData.rol_id}`);
        const newUser = await models.usuarios.create(usuarioData);
        console.log(`   ✅ Usuario creado con ID: ${newUser.id}`);
      }
    }
    
    console.log('✅ Usuarios procesados correctamente');
    
    // Verificar que las contraseñas se pueden comparar
    console.log('\n🔍 Verificando contraseñas...');
    const testUser = await models.usuarios.findOne({ where: { email: 'admin@test.com' } });
    if (testUser) {
      const testPassword = '123456';
      const testHash = await bcryptjs.hash(testPassword, 10);
      const testCompare = await bcryptjs.compare(testPassword, testUser.password);
      console.log(`   - Contraseña en BD: ${testUser.password?.substring(0, 30)}...`);
      console.log(`   - Nuevo hash de prueba: ${testHash.substring(0, 30)}...`);
      console.log(`   - Comparación exitosa: ${testCompare ? '✅ SÍ' : '❌ NO'}`);
    }

    // ✅ 5. Configurar Permisos
    console.log('📝 Configurando permisos...');
    
    // Obtener todos los roles y módulos (usar los roles ya obtenidos)
    const allRoles = roles.length > 0 ? roles : await models.roles.findAll();
    const allModulos = await models.modulos.findAll();

    // Configuración de permisos por rol
    const permisosConfig = [
      // Administrador: Todos los permisos en todos los módulos
      { rolNombre: 'Administrador', permisos: { c: true, r: true, u: true, d: true } },
      // Jefe: Todos los permisos en todos los módulos
      { rolNombre: 'Jefe', permisos: { c: true, r: true, u: true, d: true } },
      // Secretario: Solo lectura y actualización (sin crear ni eliminar)
      { rolNombre: 'Secretario', permisos: { c: false, r: true, u: true, d: false } }
    ];

    // Crear permisos para Administrador, Jefe y Secretario
    for (const config of permisosConfig) {
      const rol = allRoles.find(r => r.nombre === config.rolNombre);
      if (rol) {
        for (const modulo of allModulos) {
          // Verificar si ya existe un permiso para este rol y módulo
          const existingPermiso = await models.permisos.findOne({
            where: {
              rol_id: rol.id,
              modulo_id: modulo.id
            }
          });

          if (!existingPermiso) {
            await models.permisos.create({
              nombre: `${config.rolNombre} - ${modulo.nombre}`,
              c: config.permisos.c ? 1 : 0,
              r: config.permisos.r ? 1 : 0,
              u: config.permisos.u ? 1 : 0,
              d: config.permisos.d ? 1 : 0,
              rol_id: rol.id,
              modulo_id: modulo.id
            });
          }
        }
      }
    }

    // Permisos especiales para Usuario (solo lectura en propiedades y tipos_propiedad)
    const usuarioRol = allRoles.find(r => r.nombre === 'Usuario');
    if (usuarioRol) {
      const propiedadesModulo = allModulos.find(m => m.nombre === 'propiedades');
      const tiposModulo = allModulos.find(m => m.nombre === 'tipos_propiedad');
      
      if (propiedadesModulo) {
        const existingPermiso = await models.permisos.findOne({
          where: {
            rol_id: usuarioRol.id,
            modulo_id: propiedadesModulo.id
          }
        });
        
        if (!existingPermiso) {
          await models.permisos.create({
            nombre: 'Usuario - propiedades',
            c: 0, r: 1, u: 0, d: 0,
            rol_id: usuarioRol.id,
            modulo_id: propiedadesModulo.id
          });
        }
      }
      
      if (tiposModulo) {
        const existingPermiso = await models.permisos.findOne({
          where: {
            rol_id: usuarioRol.id,
            modulo_id: tiposModulo.id
          }
        });
        
        if (!existingPermiso) {
          await models.permisos.create({
            nombre: 'Usuario - tipos_propiedad',
            c: 0, r: 1, u: 0, d: 0,
            rol_id: usuarioRol.id,
            modulo_id: tiposModulo.id
          });
        }
      }
    }

    // ✅ 6. Crear Propiedades de ejemplo
    console.log('📝 Creando propiedades de ejemplo...');
    
    // Obtener usuarios para usar sus IDs reales
    const usuarios = await models.usuarios.findAll();
    const usuarioJefe = usuarios.find(u => u.email === 'jefe@test.com');
    const usuarioSecretario = usuarios.find(u => u.email === 'secretario@test.com');
    
    // Obtener tipos de propiedad para usar sus IDs reales
    const tiposPropiedad = await models.tipos_propiedad.findAll({ order: [['id', 'ASC']] });
    const tipoCasa = tiposPropiedad.find(t => t.nombre === 'Casa');
    const tipoApto = tiposPropiedad.find(t => t.nombre === 'Apartamento');
    const tipoLocal = tiposPropiedad.find(t => t.nombre === 'Local Comercial');
    const tipoOficina = tiposPropiedad.find(t => t.nombre === 'Oficina');
    
    if (usuarioJefe && usuarioSecretario && tipoCasa && tipoApto && tipoLocal && tipoOficina) {
      await models.propiedades.bulkCreate([
        { titulo: 'Casa en Zona Norte', descripcion: 'Hermosa casa de 3 habitaciones con jardín', precio: 250000000.00, habitaciones: 3, banos: 2, parqueadero: 2, tipo_id: tipoCasa.id, usuario_id: usuarioJefe.id },
        { titulo: 'Apartamento Centro', descripcion: 'Moderno apartamento en el centro de la ciudad', precio: 180000000.00, habitaciones: 2, banos: 1, parqueadero: 1, tipo_id: tipoApto.id, usuario_id: usuarioJefe.id },
        { titulo: 'Local Comercial', descripcion: 'Local comercial en zona comercial', precio: 120000000.00, habitaciones: 0, banos: 1, parqueadero: 0, tipo_id: tipoLocal.id, usuario_id: usuarioSecretario.id },
        { titulo: 'Oficina Ejecutiva', descripcion: 'Oficina moderna para empresas', precio: 85000000.00, habitaciones: 0, banos: 1, parqueadero: 1, tipo_id: tipoOficina.id, usuario_id: usuarioSecretario.id },
        { titulo: 'Casa Campestre', descripcion: 'Casa de descanso en las afueras', precio: 320000000.00, habitaciones: 4, banos: 3, parqueadero: 3, tipo_id: tipoCasa.id, usuario_id: usuarioJefe.id }
      ], { ignoreDuplicates: true });
    } else {
      console.warn('⚠️ No se pudieron crear propiedades: faltan usuarios o tipos de propiedad');
    }

    // ✅ 7. Crear Imágenes de ejemplo
    console.log('📝 Creando imágenes de ejemplo...');
    const propiedades = await models.propiedades.findAll({ order: [['id', 'ASC']], limit: 5 });
    
    if (propiedades.length > 0) {
      const imagenesData = [
        { propiedad_id: propiedades[0]?.id, url: 'https://example.com/casa1-frente.jpg' },
        { propiedad_id: propiedades[0]?.id, url: 'https://example.com/casa1-interior.jpg' },
        { propiedad_id: propiedades[1]?.id, url: 'https://example.com/apt1-sala.jpg' },
        { propiedad_id: propiedades[2]?.id, url: 'https://example.com/local1-frente.jpg' },
        { propiedad_id: propiedades[3]?.id, url: 'https://example.com/oficina1.jpg' },
        { propiedad_id: propiedades[4]?.id, url: 'https://example.com/casa-campestre.jpg' }
      ].filter(img => img.propiedad_id); // Filtrar solo las que tienen propiedad_id válido
      
      if (imagenesData.length > 0) {
        await models.imagenes_propiedad.bulkCreate(imagenesData, { ignoreDuplicates: true });
      }
    } else {
      console.warn('⚠️ No se pudieron crear imágenes: no hay propiedades');
    }

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