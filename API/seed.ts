// seed.ts - Script para llenar datos iniciales
import "dotenv/config";
import bcryptjs from "bcryptjs";
import { sequelize, models } from "./src/db/database";

async function seedDatabase() {
  try {
    console.log('🚀 Iniciando seed de la base de datos...');

    // Sincronizar base de datos (crea las tablas si no existen)
    await sequelize.sync({ force: false });

    // 🧹 Limpiar datos existentes (en orden inverso a las foreign keys)
    console.log('🧹 Limpiando datos existentes...');
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    
    await models.imagenes_propiedad.destroy({ where: {}, force: true });
    await models.propiedades.destroy({ where: {}, force: true });
    await models.permisos.destroy({ where: {}, force: true });
    await models.usuarios.destroy({ where: {}, force: true });
    await models.tipos_propiedad.destroy({ where: {}, force: true });
    await models.modulos.destroy({ where: {}, force: true });
    await models.roles.destroy({ where: {}, force: true });
    
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    console.log('✅ Datos limpiados');

    // ✅ 1. Crear Roles
    console.log('📝 Creando roles...');
    
    // Crear roles y obtener los objetos creados
    await models.roles.create({ nombre: 'Administrador' });
    await models.roles.create({ nombre: 'Jefe' });
    await models.roles.create({ nombre: 'Secretario' });
    await models.roles.create({ nombre: 'Usuario' });
    
    // Obtener los roles recién creados con sus IDs
    const rolAdmin = await models.roles.findOne({ where: { nombre: 'Administrador' } });
    const rolJefe = await models.roles.findOne({ where: { nombre: 'Jefe' } });
    const rolSecretario = await models.roles.findOne({ where: { nombre: 'Secretario' } });
    const rolUsuario = await models.roles.findOne({ where: { nombre: 'Usuario' } });
    
    if (!rolAdmin || !rolJefe || !rolSecretario || !rolUsuario) {
      throw new Error('Error al crear o recuperar roles');
    }
    
    // Usar toJSON() para obtener los datos correctos
    const adminData = rolAdmin.toJSON();
    const jefeData = rolJefe.toJSON();
    const secretarioData = rolSecretario.toJSON();
    const usuarioData = rolUsuario.toJSON();
    
    console.log('✅ Roles creados:', {
      admin: { id: adminData.id, nombre: adminData.nombre },
      jefe: { id: jefeData.id, nombre: jefeData.nombre },
      secretario: { id: secretarioData.id, nombre: secretarioData.nombre },
      usuario: { id: usuarioData.id, nombre: usuarioData.nombre }
    });

    // ✅ 2. Crear Módulos
    console.log('📝 Creando módulos...');
    
    // Crear módulos
    await models.modulos.create({ nombre: 'usuarios' });
    await models.modulos.create({ nombre: 'roles' });
    await models.modulos.create({ nombre: 'propiedades' });
    await models.modulos.create({ nombre: 'tipos_propiedad' });
    await models.modulos.create({ nombre: 'imagenes_propiedad' });
    await models.modulos.create({ nombre: 'permisos' });
    await models.modulos.create({ nombre: 'modulos' });
    
    // Obtener los módulos recién creados con sus IDs
    const moduloUsuarios = await models.modulos.findOne({ where: { nombre: 'usuarios' } });
    const moduloRoles = await models.modulos.findOne({ where: { nombre: 'roles' } });
    const moduloPropiedades = await models.modulos.findOne({ where: { nombre: 'propiedades' } });
    const moduloTiposPropiedad = await models.modulos.findOne({ where: { nombre: 'tipos_propiedad' } });
    const moduloImagenesPropiedad = await models.modulos.findOne({ where: { nombre: 'imagenes_propiedad' } });
    const moduloPermisos = await models.modulos.findOne({ where: { nombre: 'permisos' } });
    const moduloModulos = await models.modulos.findOne({ where: { nombre: 'modulos' } });
    
    if (!moduloUsuarios || !moduloRoles || !moduloPropiedades || !moduloTiposPropiedad || !moduloImagenesPropiedad || !moduloPermisos || !moduloModulos) {
      throw new Error('Error al crear o recuperar módulos');
    }
    
    const allModulos = [moduloUsuarios, moduloRoles, moduloPropiedades, moduloTiposPropiedad, moduloImagenesPropiedad, moduloPermisos, moduloModulos];
    
    console.log('✅ Módulos creados:', allModulos.map(m => {
      const data = m.toJSON();
      return { id: data.id, nombre: data.nombre };
    }));

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
    ]);

    // ✅ 4. Crear Usuarios
    console.log('📝 Creando usuarios...');
    
    const hashedPassword = await bcryptjs.hash('123456', 10);
    
    // Crear usuarios con los IDs de roles que ya tenemos
    await models.usuarios.create({
      email: 'admin@test.com',
      nombre: 'Admin',
      apellido: 'Sistema',
      password: hashedPassword,
      rol_id: adminData.id
    });
    
    await models.usuarios.create({
      email: 'jefe@test.com',
      nombre: 'Juan',
      apellido: 'Pérez',
      password: hashedPassword,
      rol_id: jefeData.id
    });
    
    await models.usuarios.create({
      email: 'secretario@test.com',
      nombre: 'María',
      apellido: 'González',
      password: hashedPassword,
      rol_id: secretarioData.id
    });
    
    await models.usuarios.create({
      email: 'usuario@test.com',
      nombre: 'Carlos',
      apellido: 'Rodríguez',
      password: hashedPassword,
      rol_id: usuarioData.id
    });
    
    // Obtener los usuarios recién creados con sus IDs
    const usuarioAdmin = await models.usuarios.findOne({ where: { email: 'admin@test.com' } });
    const usuarioJefe = await models.usuarios.findOne({ where: { email: 'jefe@test.com' } });
    const usuarioSecretario = await models.usuarios.findOne({ where: { email: 'secretario@test.com' } });
    const usuarioUsuario = await models.usuarios.findOne({ where: { email: 'usuario@test.com' } });
    
    if (!usuarioAdmin || !usuarioJefe || !usuarioSecretario || !usuarioUsuario) {
      throw new Error('Error al crear o recuperar usuarios');
    }
    
    const usuarios = [usuarioAdmin, usuarioJefe, usuarioSecretario, usuarioUsuario];
    
    console.log('✅ Usuarios creados:');
    usuarios.forEach(u => {
      const data = u.toJSON();
      console.log(`   - ${data.email} (ID: ${data.id}, Rol ID: ${data.rol_id})`);
    });

    // ✅ 5. Configurar Permisos
    console.log('📝 Configurando permisos...');

    // Configuración de permisos por rol
    const permisosConfig = [
      // Administrador: Todos los permisos en todos los módulos
      { rolNombre: 'Administrador', permisos: { c: true, r: true, u: true, d: true }, rolData: adminData },
      // Jefe: Todos los permisos en todos los módulos
      { rolNombre: 'Jefe', permisos: { c: true, r: true, u: true, d: true }, rolData: jefeData },
      // Secretario: Solo lectura y actualización (sin crear ni eliminar)
      { rolNombre: 'Secretario', permisos: { c: false, r: true, u: true, d: false }, rolData: secretarioData }
    ];

    // Crear permisos para Administrador, Jefe y Secretario
    let permisosCreados = 0;
    
    for (const config of permisosConfig) {
      if (config.rolData && config.rolData.id) {
        console.log(`   Creando permisos para ${config.rolNombre} (ID: ${config.rolData.id})...`);
        for (const modulo of allModulos) {
          const moduloData = modulo.toJSON();
          await models.permisos.create({
            nombre: `${config.rolNombre} - ${moduloData.nombre}`,
            c: config.permisos.c ? 1 : 0,
            r: config.permisos.r ? 1 : 0,
            u: config.permisos.u ? 1 : 0,
            d: config.permisos.d ? 1 : 0,
            rol_id: config.rolData.id,
            modulo_id: moduloData.id
          });
          permisosCreados++;
        }
        console.log(`   ✅ ${allModulos.length} permisos creados para ${config.rolNombre}`);
      } else {
        console.warn(`   ⚠️ Rol no encontrado: ${config.rolNombre}`);
      }
    }

    // Permisos especiales para Usuario (solo lectura en propiedades y tipos_propiedad)
    const moduloPropiedadesData = moduloPropiedades.toJSON();
    const moduloTiposPropiedadData = moduloTiposPropiedad.toJSON();
    
    await models.permisos.create({
      nombre: 'Usuario - propiedades',
      c: 0, r: 1, u: 0, d: 0,
      rol_id: usuarioData.id,
      modulo_id: moduloPropiedadesData.id
    });
    
    await models.permisos.create({
      nombre: 'Usuario - tipos_propiedad',
      c: 0, r: 1, u: 0, d: 0,
      rol_id: usuarioData.id,
      modulo_id: moduloTiposPropiedadData.id
    });
    
    permisosCreados += 2;
    console.log(`✅ ${permisosCreados} permisos creados`);

    // ✅ 6. Crear Propiedades de ejemplo
    console.log('📝 Creando propiedades de ejemplo...');
    
    // Obtener tipos de propiedad (deben estar en orden: Casa, Apartamento, Local Comercial, Oficina)
    const tiposPropiedad = await models.tipos_propiedad.findAll({ order: [['id', 'ASC']] });
    const tipoCasa = tiposPropiedad.find(t => {
      const data = t.toJSON();
      return data.nombre === 'Casa';
    }) || tiposPropiedad[0];
    const tipoApto = tiposPropiedad.find(t => {
      const data = t.toJSON();
      return data.nombre === 'Apartamento';
    }) || tiposPropiedad[1];
    const tipoLocal = tiposPropiedad.find(t => {
      const data = t.toJSON();
      return data.nombre === 'Local Comercial';
    }) || tiposPropiedad[2];
    const tipoOficina = tiposPropiedad.find(t => {
      const data = t.toJSON();
      return data.nombre === 'Oficina';
    }) || tiposPropiedad[3];
    
    const tipoCasaData = tipoCasa.toJSON();
    const tipoAptoData = tipoApto.toJSON();
    const tipoLocalData = tipoLocal.toJSON();
    const tipoOficinaData = tipoOficina.toJSON();
    const usuarioJefeData = usuarioJefe.toJSON();
    const usuarioSecretarioData = usuarioSecretario.toJSON();
    
    await models.propiedades.bulkCreate([
      { titulo: 'Casa en Zona Norte', descripcion: 'Hermosa casa de 3 habitaciones con jardín', precio: 250000000.00, habitaciones: 3, banos: 2, parqueadero: 2, tipo_id: tipoCasaData.id, usuario_id: usuarioJefeData.id },
      { titulo: 'Apartamento Centro', descripcion: 'Moderno apartamento en el centro de la ciudad', precio: 180000000.00, habitaciones: 2, banos: 1, parqueadero: 1, tipo_id: tipoAptoData.id, usuario_id: usuarioJefeData.id },
      { titulo: 'Local Comercial', descripcion: 'Local comercial en zona comercial', precio: 120000000.00, habitaciones: 0, banos: 1, parqueadero: 0, tipo_id: tipoLocalData.id, usuario_id: usuarioSecretarioData.id },
      { titulo: 'Oficina Ejecutiva', descripcion: 'Oficina moderna para empresas', precio: 85000000.00, habitaciones: 0, banos: 1, parqueadero: 1, tipo_id: tipoOficinaData.id, usuario_id: usuarioSecretarioData.id },
      { titulo: 'Casa Campestre', descripcion: 'Casa de descanso en las afueras', precio: 320000000.00, habitaciones: 4, banos: 3, parqueadero: 3, tipo_id: tipoCasaData.id, usuario_id: usuarioJefeData.id }
    ]);
    
    console.log('✅ 5 propiedades creadas');

    // ✅ 7. Crear Imágenes de ejemplo
    console.log('📝 Creando imágenes de ejemplo...');
    
    const propiedades = await models.propiedades.findAll({ order: [['id', 'ASC']] });
    
    if (propiedades.length >= 5) {
      await models.imagenes_propiedad.bulkCreate([
        { propiedad_id: propiedades[0].id, url: 'https://example.com/casa1-frente.jpg' },
        { propiedad_id: propiedades[0].id, url: 'https://example.com/casa1-interior.jpg' },
        { propiedad_id: propiedades[1].id, url: 'https://example.com/apt1-sala.jpg' },
        { propiedad_id: propiedades[2].id, url: 'https://example.com/local1-frente.jpg' },
        { propiedad_id: propiedades[3].id, url: 'https://example.com/oficina1.jpg' },
        { propiedad_id: propiedades[4].id, url: 'https://example.com/casa-campestre.jpg' }
      ]);
      console.log('✅ 6 imágenes creadas');
    } else {
      console.warn('⚠️ No se pudieron crear imágenes: no hay suficientes propiedades');
    }

    console.log('\n✅ Seed completado exitosamente!');
    console.log('\n📊 Resumen de datos creados:');
    console.log(`- 4 roles (Administrador, Jefe, Secretario, Usuario)`);
    console.log(`- 7 módulos (usuarios, roles, propiedades, tipos_propiedad, imagenes_propiedad, permisos, modulos)`);
    console.log('- 7 tipos de propiedad');
    console.log('- 4 usuarios (password: 123456)');
    console.log(`- ${permisosCreados} permisos configurados`);
    console.log('- 5 propiedades de ejemplo');
    console.log('- 6 imágenes de ejemplo');

    console.log('\n👥 Usuarios de prueba:');
    console.log('- admin@test.com / 123456 (Administrador - todos los permisos)');
    console.log('- jefe@test.com / 123456 (Jefe - todos los permisos)');
    console.log('- secretario@test.com / 123456 (Secretario - solo lectura y actualización)');
    console.log('- usuario@test.com / 123456 (Usuario - solo lectura en propiedades)');
    
    console.log('\n📋 Permisos por rol:');
    console.log('- Administrador: Todos los permisos (c, r, u, d) en todos los módulos');
    console.log('- Jefe: Todos los permisos (c, r, u, d) en todos los módulos');
    console.log('- Secretario: Solo lectura y actualización (r, u) en todos los módulos');
    console.log('- Usuario: Solo lectura (r) en propiedades y tipos_propiedad');

  } catch (error) {
    console.error('❌ Error durante el seed:', error);
  } finally {
    await sequelize.close();
  }
}

// Ejecutar seed
seedDatabase();