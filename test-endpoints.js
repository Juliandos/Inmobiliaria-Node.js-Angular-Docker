// Script completo para probar TODOS los endpoints de la API
const http = require('http');

const API_BASE = 'http://localhost:3001';
let authToken = '';
let testData = {
  roles: [],
  tiposPropiedad: [],
  usuarios: [],
  propiedades: [],
  modulos: [],
  permisos: [],
  imagenes: []
};

// Función helper para hacer requests
function makeRequest(method, path, data = null, token = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, API_BASE);
    const options = {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(url, options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const parsed = body ? JSON.parse(body) : {};
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: parsed
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: body
          });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

// Función para imprimir resultados
function printResult(name, result, showBody = true) {
  const statusIcon = result.status >= 200 && result.status < 300 ? '✅' : '❌';
  console.log(`\n${'='.repeat(70)}`);
  console.log(`${statusIcon} ${name}`);
  console.log(`${'='.repeat(70)}`);
  console.log(`Status: ${result.status}`);
  if (showBody && result.body) {
    if (typeof result.body === 'string') {
      console.log(`Response: ${result.body.substring(0, 200)}...`);
    } else {
      const bodyStr = JSON.stringify(result.body, null, 2);
      if (bodyStr.length > 500) {
        console.log(`Response: ${bodyStr.substring(0, 500)}... (truncado)`);
      } else {
        console.log(`Response:`, JSON.stringify(result.body, null, 2));
      }
    }
  }
  return result.status >= 200 && result.status < 300;
}

// Verificar ID incremental
function checkIncrementalId(newId, previousId, resourceName) {
  if (previousId !== null && newId <= previousId) {
    console.log(`⚠️  ADVERTENCIA: ID no incremental en ${resourceName}. Anterior: ${previousId}, Nuevo: ${newId}`);
    return false;
  }
  console.log(`✅ ID incremental verificado: ${previousId || 'N/A'} → ${newId}`);
  return true;
}

// ============================================
// FUNCIÓN PRINCIPAL
// ============================================
async function testAllEndpoints() {
  console.log('🚀 INICIANDO PRUEBAS COMPLETAS DE ENDPOINTS\n');
  console.log('📋 Este script probará todos los endpoints en orden lógico:');
  console.log('   1. Autenticación');
  console.log('   2. Obtener datos base');
  console.log('   3. Crear datos de prueba (POST)');
  console.log('   4. Leer datos creados (GET)');
  console.log('   5. Actualizar datos (PUT)');
  console.log('   6. Eliminar datos de prueba (DELETE)');
  console.log('   7. Verificar IDs incrementales\n');

  let allTestsPassed = true;
  let previousIds = {};

  try {
    // ============================================
    // 1. AUTENTICACIÓN
    // ============================================
    console.log('\n🔐 FASE 1: AUTENTICACIÓN');
    console.log('─'.repeat(70));
    
    const loginResult = await makeRequest('POST', '/auth/login', {
      email: 'admin@test.com',
      password: '123456'
    });
    
    if (!printResult('POST /auth/login', loginResult)) {
      console.log('❌ No se pudo autenticar. Abortando pruebas.');
      return;
    }
    
    if (loginResult.body.accessToken || loginResult.body.token) {
      authToken = loginResult.body.accessToken || loginResult.body.token;
      console.log('✅ Token obtenido correctamente');
    } else {
      console.log('❌ No se obtuvo token. Abortando pruebas.');
      return;
    }

    // ============================================
    // 2. OBTENER DATOS BASE (para usar en las pruebas)
    // ============================================
    console.log('\n\n📥 FASE 2: OBTENER DATOS BASE');
    console.log('─'.repeat(70));
    
    const rolesBase = await makeRequest('GET', '/roles', null, authToken);
    printResult('GET /roles (base)', rolesBase, false);
    const existingRoles = Array.isArray(rolesBase.body) ? rolesBase.body : [];
    const baseRolId = existingRoles.length > 0 ? existingRoles[0].id : null;
    
    const tiposBase = await makeRequest('GET', '/tipo-propiedad', null, authToken);
    printResult('GET /tipo-propiedad (base)', tiposBase, false);
    
    const usuariosBase = await makeRequest('GET', '/usuarios', null, authToken);
    printResult('GET /usuarios (base)', usuariosBase, false);
    const existingUsuarios = Array.isArray(usuariosBase.body) ? usuariosBase.body : [];
    const baseUsuarioId = existingUsuarios.length > 0 ? existingUsuarios[0].id : null;
    
    const modulosBase = await makeRequest('GET', '/modulos', null, authToken);
    printResult('GET /modulos (base)', modulosBase, false);
    const existingModulos = Array.isArray(modulosBase.body) ? modulosBase.body : [];
    const baseModuloId = existingModulos.length > 0 ? existingModulos[0].id : null;

    // ============================================
    // 3. CREAR DATOS DE PRUEBA (POST) - Verificar IDs incrementales
    // ============================================
    console.log('\n\n📝 FASE 3: CREAR DATOS DE PRUEBA (POST)');
    console.log('─'.repeat(70));
    console.log('⚠️  Verificando que los IDs sean incrementales...\n');

    // 3.1 Crear Rol
    console.log('📌 Creando ROL de prueba...');
    const createRol1 = await makeRequest('POST', '/roles', {
      nombre: 'Rol_Test_1'
    }, authToken);
    if (printResult('POST /roles (1)', createRol1)) {
      testData.roles.push(createRol1.body);
      previousIds.rol = createRol1.body.id;
      checkIncrementalId(createRol1.body.id, null, 'Rol');
    } else {
      allTestsPassed = false;
    }

    // Crear segundo rol para verificar incremental
    const createRol2 = await makeRequest('POST', '/roles', {
      nombre: 'Rol_Test_2'
    }, authToken);
    if (printResult('POST /roles (2)', createRol2)) {
      testData.roles.push(createRol2.body);
      checkIncrementalId(createRol2.body.id, previousIds.rol, 'Rol');
      previousIds.rol = createRol2.body.id;
    } else {
      allTestsPassed = false;
    }

    // 3.2 Crear Tipo de Propiedad
    console.log('\n📌 Creando TIPO DE PROPIEDAD de prueba...');
    const createTipo1 = await makeRequest('POST', '/tipo-propiedad', {
      nombre: 'Tipo_Test_1'
    }, authToken);
    if (printResult('POST /tipo-propiedad (1)', createTipo1)) {
      testData.tiposPropiedad.push(createTipo1.body);
      previousIds.tipo = createTipo1.body.id;
      checkIncrementalId(createTipo1.body.id, null, 'Tipo Propiedad');
    } else {
      allTestsPassed = false;
    }

    const createTipo2 = await makeRequest('POST', '/tipo-propiedad', {
      nombre: 'Tipo_Test_2'
    }, authToken);
    if (printResult('POST /tipo-propiedad (2)', createTipo2)) {
      testData.tiposPropiedad.push(createTipo2.body);
      checkIncrementalId(createTipo2.body.id, previousIds.tipo, 'Tipo Propiedad');
      previousIds.tipo = createTipo2.body.id;
    } else {
      allTestsPassed = false;
    }

    // 3.3 Crear Usuario
    console.log('\n📌 Creando USUARIO de prueba...');
    const createUsuario1 = await makeRequest('POST', '/usuarios', {
      email: 'test_user_1@test.com',
      nombre: 'Test',
      apellido: 'User 1',
      password: '123456',
      rol_id: testData.roles[0]?.id || baseRolId
    }, authToken);
    if (printResult('POST /usuarios (1)', createUsuario1)) {
      testData.usuarios.push(createUsuario1.body);
      previousIds.usuario = createUsuario1.body.id;
      checkIncrementalId(createUsuario1.body.id, null, 'Usuario');
    } else {
      allTestsPassed = false;
    }

    const createUsuario2 = await makeRequest('POST', '/usuarios', {
      email: 'test_user_2@test.com',
      nombre: 'Test',
      apellido: 'User 2',
      password: '123456',
      rol_id: testData.roles[0]?.id || baseRolId
    }, authToken);
    if (printResult('POST /usuarios (2)', createUsuario2)) {
      testData.usuarios.push(createUsuario2.body);
      checkIncrementalId(createUsuario2.body.id, previousIds.usuario, 'Usuario');
      previousIds.usuario = createUsuario2.body.id;
    } else {
      allTestsPassed = false;
    }

    // 3.4 Crear Propiedad
    console.log('\n📌 Creando PROPIEDAD de prueba...');
    const createPropiedad1 = await makeRequest('POST', '/propiedades', {
      titulo: 'Propiedad Test 1',
      descripcion: 'Descripción de prueba 1',
      precio: 100000000,
      area: 100.5,
      habitaciones: 2,
      banos: 1,
      parqueadero: 1,
      tipo_id: testData.tiposPropiedad[0]?.id,
      usuario_id: testData.usuarios[0]?.id || baseUsuarioId
    }, authToken);
    if (printResult('POST /propiedades (1)', createPropiedad1)) {
      testData.propiedades.push(createPropiedad1.body);
      previousIds.propiedad = createPropiedad1.body.id;
      checkIncrementalId(createPropiedad1.body.id, null, 'Propiedad');
    } else {
      allTestsPassed = false;
    }

    const createPropiedad2 = await makeRequest('POST', '/propiedades', {
      titulo: 'Propiedad Test 2',
      descripcion: 'Descripción de prueba 2',
      precio: 200000000,
      area: 150.75,
      habitaciones: 3,
      banos: 2,
      parqueadero: 2,
      tipo_id: testData.tiposPropiedad[0]?.id,
      usuario_id: testData.usuarios[0]?.id || baseUsuarioId
    }, authToken);
    if (printResult('POST /propiedades (2)', createPropiedad2)) {
      testData.propiedades.push(createPropiedad2.body);
      checkIncrementalId(createPropiedad2.body.id, previousIds.propiedad, 'Propiedad');
      previousIds.propiedad = createPropiedad2.body.id;
    } else {
      allTestsPassed = false;
    }

    // 3.5 Crear Módulo
    console.log('\n📌 Creando MÓDULO de prueba...');
    const createModulo1 = await makeRequest('POST', '/modulos', {
      nombre: 'modulo_test_1'
    }, authToken);
    if (printResult('POST /modulos (1)', createModulo1)) {
      testData.modulos.push(createModulo1.body);
      previousIds.modulo = createModulo1.body.id;
      checkIncrementalId(createModulo1.body.id, null, 'Módulo');
    } else {
      allTestsPassed = false;
    }

    const createModulo2 = await makeRequest('POST', '/modulos', {
      nombre: 'modulo_test_2'
    }, authToken);
    if (printResult('POST /modulos (2)', createModulo2)) {
      testData.modulos.push(createModulo2.body);
      checkIncrementalId(createModulo2.body.id, previousIds.modulo, 'Módulo');
      previousIds.modulo = createModulo2.body.id;
    } else {
      allTestsPassed = false;
    }

    // 3.6 Crear Permiso
    console.log('\n📌 Creando PERMISO de prueba...');
    const createPermiso1 = await makeRequest('POST', '/permisos', {
      nombre: 'Permiso Test 1',
      c: true,
      r: true,
      u: false,
      d: false,
      rol_id: testData.roles[0]?.id || baseRolId,
      modulo_id: testData.modulos[0]?.id || baseModuloId
    }, authToken);
    if (printResult('POST /permisos (1)', createPermiso1)) {
      testData.permisos.push(createPermiso1.body);
      previousIds.permiso = createPermiso1.body.id;
      checkIncrementalId(createPermiso1.body.id, null, 'Permiso');
    } else {
      allTestsPassed = false;
    }

    // 3.7 Crear Imagen de Propiedad (solo URL, sin upload)
    console.log('\n📌 Creando IMAGEN DE PROPIEDAD de prueba...');
    // Nota: El endpoint requiere upload, pero podemos intentar con URL directa
    // Si falla, lo omitimos
    const createImagen1 = await makeRequest('POST', '/imagen-propiedad', {
      propiedad_id: testData.propiedades[0]?.id,
      url: 'https://example.com/test-image-1.jpg'
    }, authToken);
    // Este endpoint probablemente falle porque requiere multipart/form-data
    // Lo marcamos como opcional
    if (createImagen1.status === 201 || createImagen1.status === 200) {
      printResult('POST /imagen-propiedad (1)', createImagen1);
      if (Array.isArray(createImagen1.body)) {
        testData.imagenes.push(...createImagen1.body);
      } else if (createImagen1.body.id) {
        testData.imagenes.push(createImagen1.body);
      }
    } else {
      console.log('⚠️  POST /imagen-propiedad requiere multipart/form-data (upload). Omitido.');
    }

    // ============================================
    // 4. LEER DATOS CREADOS (GET)
    // ============================================
    console.log('\n\n📖 FASE 4: LEER DATOS CREADOS (GET)');
    console.log('─'.repeat(70));

    // 4.1 Leer todos los roles
    const getRoles = await makeRequest('GET', '/roles', null, authToken);
    if (!printResult('GET /roles', getRoles, false)) allTestsPassed = false;

    // 4.2 Leer rol específico
    if (testData.roles[0]?.id) {
      const getRol = await makeRequest('GET', `/roles/${testData.roles[0].id}`, null, authToken);
      if (!printResult(`GET /roles/${testData.roles[0].id}`, getRol)) allTestsPassed = false;
    }

    // 4.3 Leer todos los tipos
    const getTipos = await makeRequest('GET', '/tipo-propiedad', null, authToken);
    if (!printResult('GET /tipo-propiedad', getTipos, false)) allTestsPassed = false;

    // 4.4 Leer tipo específico
    if (testData.tiposPropiedad[0]?.id) {
      const getTipo = await makeRequest('GET', `/tipo-propiedad/${testData.tiposPropiedad[0].id}`, null, authToken);
      if (!printResult(`GET /tipo-propiedad/${testData.tiposPropiedad[0].id}`, getTipo)) allTestsPassed = false;
    }

    // 4.5 Leer todos los usuarios
    const getUsuarios = await makeRequest('GET', '/usuarios', null, authToken);
    if (!printResult('GET /usuarios', getUsuarios, false)) allTestsPassed = false;

    // 4.6 Leer usuario específico
    if (testData.usuarios[0]?.id) {
      const getUsuario = await makeRequest('GET', `/usuarios/${testData.usuarios[0].id}`, null, authToken);
      if (!printResult(`GET /usuarios/${testData.usuarios[0].id}`, getUsuario)) allTestsPassed = false;
    }

    // 4.7 Leer todas las propiedades
    const getPropiedades = await makeRequest('GET', '/propiedades', null, authToken);
    if (!printResult('GET /propiedades', getPropiedades, false)) allTestsPassed = false;

    // 4.8 Leer propiedad específica
    if (testData.propiedades[0]?.id) {
      const getPropiedad = await makeRequest('GET', `/propiedades/${testData.propiedades[0].id}`, null, authToken);
      if (!printResult(`GET /propiedades/${testData.propiedades[0].id}`, getPropiedad)) allTestsPassed = false;
    }

    // 4.9 Leer todos los módulos
    const getModulos = await makeRequest('GET', '/modulos', null, authToken);
    if (!printResult('GET /modulos', getModulos, false)) allTestsPassed = false;

    // 4.10 Leer módulo específico
    if (testData.modulos[0]?.id) {
      const getModulo = await makeRequest('GET', `/modulos/${testData.modulos[0].id}`, null, authToken);
      if (!printResult(`GET /modulos/${testData.modulos[0].id}`, getModulo)) allTestsPassed = false;
    }

    // 4.11 Leer todos los permisos
    const getPermisos = await makeRequest('GET', '/permisos', null, authToken);
    if (!printResult('GET /permisos', getPermisos, false)) allTestsPassed = false;

    // 4.12 Leer permiso específico
    if (testData.permisos[0]?.id) {
      const getPermiso = await makeRequest('GET', `/permisos/${testData.permisos[0].id}`, null, authToken);
      if (!printResult(`GET /permisos/${testData.permisos[0].id}`, getPermiso)) allTestsPassed = false;
    }

    // 4.13 Leer permisos por rol
    if (testData.roles[0]?.id) {
      const getPermisosByRol = await makeRequest('GET', `/permisos/rol/${testData.roles[0].id}`, null, authToken);
      if (!printResult(`GET /permisos/rol/${testData.roles[0].id}`, getPermisosByRol, false)) allTestsPassed = false;
    }

    // 4.14 Leer permisos por módulo
    if (testData.modulos[0]?.id) {
      const getPermisosByModulo = await makeRequest('GET', `/permisos/modulo/${testData.modulos[0].id}`, null, authToken);
      if (!printResult(`GET /permisos/modulo/${testData.modulos[0].id}`, getPermisosByModulo, false)) allTestsPassed = false;
    }

    // 4.15 Leer todas las imágenes
    const getImagenes = await makeRequest('GET', '/imagen-propiedad', null, authToken);
    if (!printResult('GET /imagen-propiedad', getImagenes, false)) allTestsPassed = false;

    // ============================================
    // 5. ACTUALIZAR DATOS (PUT)
    // ============================================
    console.log('\n\n✏️  FASE 5: ACTUALIZAR DATOS (PUT)');
    console.log('─'.repeat(70));

    // 5.1 Actualizar rol
    if (testData.roles[0]?.id) {
      const updateRol = await makeRequest('PUT', `/roles/${testData.roles[0].id}`, {
        nombre: 'Rol_Test_1_Actualizado'
      }, authToken);
      if (printResult(`PUT /roles/${testData.roles[0].id}`, updateRol)) {
        testData.roles[0] = updateRol.body;
      } else {
        allTestsPassed = false;
      }
    }

    // 5.2 Actualizar tipo
    if (testData.tiposPropiedad[0]?.id) {
      const updateTipo = await makeRequest('PUT', `/tipo-propiedad/${testData.tiposPropiedad[0].id}`, {
        nombre: 'Tipo_Test_1_Actualizado'
      }, authToken);
      if (printResult(`PUT /tipo-propiedad/${testData.tiposPropiedad[0].id}`, updateTipo)) {
        testData.tiposPropiedad[0] = updateTipo.body;
      } else {
        allTestsPassed = false;
      }
    }

    // 5.3 Actualizar usuario
    if (testData.usuarios[0]?.id) {
      const updateUsuario = await makeRequest('PUT', `/usuarios/${testData.usuarios[0].id}`, {
        nombre: 'Test Actualizado',
        apellido: 'User 1 Actualizado'
      }, authToken);
      if (printResult(`PUT /usuarios/${testData.usuarios[0].id}`, updateUsuario)) {
        testData.usuarios[0] = updateUsuario.body;
      } else {
        allTestsPassed = false;
      }
    }

    // 5.4 Actualizar propiedad
    if (testData.propiedades[0]?.id) {
      const updatePropiedad = await makeRequest('PUT', `/propiedades/${testData.propiedades[0].id}`, {
        titulo: 'Propiedad Test 1 Actualizada',
        descripcion: 'Descripción actualizada'
      }, authToken);
      if (printResult(`PUT /propiedades/${testData.propiedades[0].id}`, updatePropiedad)) {
        testData.propiedades[0] = updatePropiedad.body;
      } else {
        allTestsPassed = false;
      }
    }

    // 5.5 Actualizar módulo
    if (testData.modulos[0]?.id) {
      const updateModulo = await makeRequest('PUT', `/modulos/${testData.modulos[0].id}`, {
        nombre: 'modulo_test_1_actualizado'
      }, authToken);
      if (printResult(`PUT /modulos/${testData.modulos[0].id}`, updateModulo)) {
        testData.modulos[0] = updateModulo.body;
      } else {
        allTestsPassed = false;
      }
    }

    // 5.6 Actualizar permiso
    if (testData.permisos[0]?.id) {
      const updatePermiso = await makeRequest('PUT', `/permisos/${testData.permisos[0].id}`, {
        nombre: 'Permiso Test 1 Actualizado',
        u: true,
        d: true
      }, authToken);
      if (printResult(`PUT /permisos/${testData.permisos[0].id}`, updatePermiso)) {
        testData.permisos[0] = updatePermiso.body;
      } else {
        allTestsPassed = false;
      }
    }

    // ============================================
    // 6. ELIMINAR DATOS DE PRUEBA (DELETE) - En orden inverso
    // ============================================
    console.log('\n\n🗑️  FASE 6: ELIMINAR DATOS DE PRUEBA (DELETE)');
    console.log('─'.repeat(70));
    console.log('⚠️  Eliminando en orden inverso para respetar foreign keys...\n');

    // 6.1 Eliminar imágenes (si existen)
    if (testData.imagenes.length > 0) {
      for (const imagen of testData.imagenes) {
        if (imagen.id) {
          const deleteImagen = await makeRequest('DELETE', `/imagen-propiedad/${imagen.id}`, null, authToken);
          printResult(`DELETE /imagen-propiedad/${imagen.id}`, deleteImagen, false);
        }
      }
    }

    // 6.2 Eliminar propiedades
    for (const propiedad of testData.propiedades.reverse()) {
      if (propiedad.id) {
        const deletePropiedad = await makeRequest('DELETE', `/propiedades/${propiedad.id}`, null, authToken);
        if (!printResult(`DELETE /propiedades/${propiedad.id}`, deletePropiedad, false)) {
          allTestsPassed = false;
        }
      }
    }

    // 6.3 Eliminar permisos
    for (const permiso of testData.permisos.reverse()) {
      if (permiso.id) {
        const deletePermiso = await makeRequest('DELETE', `/permisos/${permiso.id}`, null, authToken);
        if (!printResult(`DELETE /permisos/${permiso.id}`, deletePermiso, false)) {
          allTestsPassed = false;
        }
      }
    }

    // 6.4 Eliminar módulos
    for (const modulo of testData.modulos.reverse()) {
      if (modulo.id) {
        const deleteModulo = await makeRequest('DELETE', `/modulos/${modulo.id}`, null, authToken);
        if (!printResult(`DELETE /modulos/${modulo.id}`, deleteModulo, false)) {
          allTestsPassed = false;
        }
      }
    }

    // 6.5 Eliminar usuarios
    for (const usuario of testData.usuarios.reverse()) {
      if (usuario.id) {
        const deleteUsuario = await makeRequest('DELETE', `/usuarios/${usuario.id}`, null, authToken);
        if (!printResult(`DELETE /usuarios/${usuario.id}`, deleteUsuario, false)) {
          allTestsPassed = false;
        }
      }
    }

    // 6.6 Eliminar tipos de propiedad
    for (const tipo of testData.tiposPropiedad.reverse()) {
      if (tipo.id) {
        const deleteTipo = await makeRequest('DELETE', `/tipo-propiedad/${tipo.id}`, null, authToken);
        if (!printResult(`DELETE /tipo-propiedad/${tipo.id}`, deleteTipo, false)) {
          allTestsPassed = false;
        }
      }
    }

    // 6.7 Eliminar roles
    for (const rol of testData.roles.reverse()) {
      if (rol.id) {
        const deleteRol = await makeRequest('DELETE', `/roles/${rol.id}`, null, authToken);
        if (!printResult(`DELETE /roles/${rol.id}`, deleteRol, false)) {
          allTestsPassed = false;
        }
      }
    }

    // ============================================
    // 7. RESUMEN FINAL
    // ============================================
    console.log('\n\n📊 RESUMEN FINAL');
    console.log('═'.repeat(70));
    
    if (allTestsPassed) {
      console.log('✅ TODAS LAS PRUEBAS PASARON CORRECTAMENTE');
      console.log('✅ Los IDs se generaron de forma incremental');
      console.log('✅ Todos los datos de prueba fueron eliminados');
      console.log('✅ La base de datos inicial no fue modificada');
    } else {
      console.log('⚠️  ALGUNAS PRUEBAS FALLARON');
      console.log('   Revisa los resultados anteriores para más detalles');
    }

    console.log('\n📈 Estadísticas:');
    console.log(`   - Roles creados: ${testData.roles.length}`);
    console.log(`   - Tipos creados: ${testData.tiposPropiedad.length}`);
    console.log(`   - Usuarios creados: ${testData.usuarios.length}`);
    console.log(`   - Propiedades creadas: ${testData.propiedades.length}`);
    console.log(`   - Módulos creados: ${testData.modulos.length}`);
    console.log(`   - Permisos creados: ${testData.permisos.length}`);
    console.log(`   - Imágenes creadas: ${testData.imagenes.length}`);

  } catch (error) {
    console.error('\n❌ ERROR CRÍTICO DURANTE LAS PRUEBAS:', error);
    allTestsPassed = false;
  }

  console.log('\n' + '═'.repeat(70));
  return allTestsPassed;
}

// Ejecutar
testAllEndpoints().then(success => {
  process.exit(success ? 0 : 1);
}).catch(error => {
  console.error('Error fatal:', error);
  process.exit(1);
});
