# 🧪 Guía de Prueba de Servicios Frontend-Backend

Este documento te ayudará a probar que todos los servicios del frontend funcionen correctamente con las relaciones de las tablas.

## 📋 Requisitos Previos

1. ✅ Backend corriendo en `http://localhost:3001`
2. ✅ Frontend corriendo en `http://localhost:4200`
3. ✅ Base de datos con datos de prueba (ejecutar `npm run seed` si es necesario)
4. ✅ Token de autenticación válido (hacer login primero)

---

## 🔐 1. Autenticación (Auth Service)

### **Login**
```bash
# Desde el navegador o Postman
POST http://localhost:3001/auth/login
Content-Type: application/json

{
  "email": "admin@test.com",
  "password": "123456"
}
```

**✅ Verificar:**
- Devuelve `accessToken` y `refreshToken`
- Devuelve `user` con `rol` incluido
- Los permisos se cargan automáticamente

### **Verificar Permisos por Rol**
```bash
GET http://localhost:3001/permisos/rol/1
Authorization: Bearer {tu_token}
```

**✅ Verificar:**
- Devuelve array de permisos
- Cada permiso incluye `rol` y `modulo`

---

## 👥 2. Usuarios Service

### **Obtener Todos los Usuarios**
```bash
GET http://localhost:3001/usuarios
Authorization: Bearer {tu_token}
```

**✅ Verificar:**
- Devuelve array de usuarios
- Cada usuario incluye `rol` con `id` y `nombre`

### **Obtener Usuario por ID**
```bash
GET http://localhost:3001/usuarios/1
Authorization: Bearer {tu_token}
```

**✅ Verificar:**
- Devuelve un usuario
- Incluye `rol` con `id` y `nombre`

### **Crear Usuario**
```bash
POST http://localhost:3001/usuarios
Authorization: Bearer {tu_token}
Content-Type: application/json

{
  "email": "nuevo@test.com",
  "nombre": "Nuevo",
  "apellido": "Usuario",
  "password": "123456",
  "rol_id": 2
}
```

**✅ Verificar:**
- Devuelve el usuario creado
- Incluye `rol` con `id` y `nombre`

### **Actualizar Usuario**
```bash
PUT http://localhost:3001/usuarios/1
Authorization: Bearer {tu_token}
Content-Type: application/json

{
  "nombre": "Nombre Actualizado"
}
```

**✅ Verificar:**
- Devuelve el usuario actualizado
- Incluye `rol` con `id` y `nombre`

---

## 🏢 3. Propiedades Service

### **Obtener Todas las Propiedades**
```bash
GET http://localhost:3001/propiedades
Authorization: Bearer {tu_token}
```

**✅ Verificar:**
- Devuelve array de propiedades
- Cada propiedad incluye:
  - `usuario` (con `id`, `nombre`, `apellido`)
  - `tipo` (con `id`, `nombre`)
  - `imagenes_propiedads` (array de imágenes)

### **Obtener Propiedad por ID**
```bash
GET http://localhost:3001/propiedades/1
Authorization: Bearer {tu_token}
```

**✅ Verificar:**
- Devuelve una propiedad
- Incluye todas las relaciones mencionadas arriba

### **Crear Propiedad**
```bash
POST http://localhost:3001/propiedades
Authorization: Bearer {tu_token}
Content-Type: application/json

{
  "titulo": "Casa Nueva",
  "descripcion": "Hermosa casa",
  "precio": 150000,
  "habitaciones": 3,
  "banos": 2,
  "parqueadero": 1,
  "tipo_id": 1,
  "usuario_id": 1
}
```

**✅ Verificar:**
- Devuelve la propiedad creada
- Incluye relaciones si están disponibles

### **Actualizar Propiedad**
```bash
PUT http://localhost:3001/propiedades/1
Authorization: Bearer {tu_token}
Content-Type: application/json

{
  "precio": 200000
}
```

**✅ Verificar:**
- Devuelve la propiedad actualizada
- Incluye todas las relaciones

---

## 🏷️ 4. Tipos de Propiedad Service

### **Obtener Todos los Tipos**
```bash
GET http://localhost:3001/tipo-propiedad
Authorization: Bearer {tu_token}
```

**✅ Verificar:**
- Devuelve array de tipos
- Cada tipo incluye `propiedades` (array)

### **Obtener Tipo por ID**
```bash
GET http://localhost:3001/tipo-propiedad/1
Authorization: Bearer {tu_token}
```

**✅ Verificar:**
- Devuelve un tipo
- Incluye `propiedades` asociadas

### **Crear Tipo**
```bash
POST http://localhost:3001/tipo-propiedad
Authorization: Bearer {tu_token}
Content-Type: application/json

{
  "nombre": "Apartamento"
}
```

**✅ Verificar:**
- Devuelve el tipo creado

### **Actualizar Tipo**
```bash
PUT http://localhost:3001/tipo-propiedad/1
Authorization: Bearer {tu_token}
Content-Type: application/json

{
  "nombre": "Casa Actualizada"
}
```

**✅ Verificar:**
- Devuelve el tipo actualizado
- Incluye `propiedades` asociadas

---

## 👤 5. Roles Service

### **Obtener Todos los Roles**
```bash
GET http://localhost:3001/roles
Authorization: Bearer {tu_token}
```

**✅ Verificar:**
- Devuelve array de roles
- Cada rol incluye `usuarios` (array)

### **Obtener Rol por ID**
```bash
GET http://localhost:3001/roles/1
Authorization: Bearer {tu_token}
```

**✅ Verificar:**
- Devuelve un rol
- Incluye `usuarios` asociados

### **Crear Rol**
```bash
POST http://localhost:3001/roles
Authorization: Bearer {tu_token}
Content-Type: application/json

{
  "nombre": "Editor"
}
```

**✅ Verificar:**
- Devuelve el rol creado

### **Actualizar Rol**
```bash
PUT http://localhost:3001/roles/1
Authorization: Bearer {tu_token}
Content-Type: application/json

{
  "nombre": "Administrador Actualizado"
}
```

**✅ Verificar:**
- Devuelve el rol actualizado
- Incluye `usuarios` asociados

---

## 🔑 6. Permisos Service

### **Obtener Todos los Permisos**
```bash
GET http://localhost:3001/permisos
Authorization: Bearer {tu_token}
```

**✅ Verificar:**
- Devuelve array de permisos
- Cada permiso incluye:
  - `rol` (con `id`, `nombre`)
  - `modulo` (con `id`, `nombre`)

### **Obtener Permiso por ID**
```bash
GET http://localhost:3001/permisos/1
Authorization: Bearer {tu_token}
```

**✅ Verificar:**
- Devuelve un permiso
- Incluye `rol` y `modulo`

### **Obtener Permisos por Rol**
```bash
GET http://localhost:3001/permisos/rol/1
Authorization: Bearer {tu_token}
```

**✅ Verificar:**
- Devuelve array de permisos para el rol
- Cada permiso incluye `rol` y `modulo`

### **Obtener Permisos por Módulo**
```bash
GET http://localhost:3001/permisos/modulo/1
Authorization: Bearer {tu_token}
```

**✅ Verificar:**
- Devuelve array de permisos para el módulo
- Cada permiso incluye `rol` y `modulo`

### **Crear Permiso**
```bash
POST http://localhost:3001/permisos
Authorization: Bearer {tu_token}
Content-Type: application/json

{
  "nombre": "Gestionar Propiedades",
  "c": true,
  "r": true,
  "u": true,
  "d": false,
  "rol_id": 1,
  "modulo_id": 1
}
```

**✅ Verificar:**
- Devuelve el permiso creado
- Incluye `rol` y `modulo`

### **Actualizar Permiso**
```bash
PUT http://localhost:3001/permisos/1
Authorization: Bearer {tu_token}
Content-Type: application/json

{
  "d": true
}
```

**✅ Verificar:**
- Devuelve el permiso actualizado
- Incluye `rol` y `modulo`

---

## 📦 7. Módulos Service

### **Obtener Todos los Módulos**
```bash
GET http://localhost:3001/modulos
Authorization: Bearer {tu_token}
```

**✅ Verificar:**
- Devuelve array de módulos
- Cada módulo incluye `permisos` (array)
- Cada permiso incluye `rol`

### **Obtener Módulo por ID**
```bash
GET http://localhost:3001/modulos/1
Authorization: Bearer {tu_token}
```

**✅ Verificar:**
- Devuelve un módulo
- Incluye `permisos` con `rol`

### **Crear Módulo**
```bash
POST http://localhost:3001/modulos
Authorization: Bearer {tu_token}
Content-Type: application/json

{
  "nombre": "Reportes"
}
```

**✅ Verificar:**
- Devuelve el módulo creado

### **Actualizar Módulo**
```bash
PUT http://localhost:3001/modulos/1
Authorization: Bearer {tu_token}
Content-Type: application/json

{
  "nombre": "Reportes Actualizado"
}
```

**✅ Verificar:**
- Devuelve el módulo actualizado
- Incluye `permisos` con `rol`

---

## 🖼️ 8. Imágenes de Propiedad Service

### **Obtener Todas las Imágenes**
```bash
GET http://localhost:3001/imagen-propiedad
Authorization: Bearer {tu_token}
```

**✅ Verificar:**
- Devuelve array de imágenes
- Cada imagen incluye `propiedad` (con `id`, `titulo`)

### **Obtener Imagen por ID**
```bash
GET http://localhost:3001/imagen-propiedad/1
Authorization: Bearer {tu_token}
```

**✅ Verificar:**
- Devuelve una imagen
- Incluye `propiedad`

### **Crear Imagen (con archivo)**
```bash
POST http://localhost:3001/imagen-propiedad
Authorization: Bearer {tu_token}
Content-Type: multipart/form-data

propiedad_id: 1
imagen: [archivo]
```

**✅ Verificar:**
- Devuelve `{ urls: [...] }` con las URLs de las imágenes subidas

### **Actualizar Imagen**
```bash
PUT http://localhost:3001/imagen-propiedad/1
Authorization: Bearer {tu_token}
Content-Type: multipart/form-data

propiedad_id: 1
imagen: [archivo]
```

**✅ Verificar:**
- Devuelve la imagen actualizada
- Incluye `propiedad`

---

## 🧪 Prueba desde el Frontend (Angular)

### **1. Abrir la Consola del Navegador**
- Presiona `F12` o `Ctrl+Shift+I`
- Ve a la pestaña **Console**

### **2. Probar Servicios desde la Consola**

```typescript
// Obtener el servicio de usuarios
// (Esto requiere acceso al componente o servicio)

// Ejemplo: En un componente
this.usuariosService.getUsuarios().subscribe({
  next: (usuarios) => {
    console.log('✅ Usuarios:', usuarios);
    // Verificar que cada usuario tenga 'rol'
    usuarios.forEach(u => {
      if (!u.rol) {
        console.error('❌ Usuario sin rol:', u);
      } else {
        console.log('✅ Usuario con rol:', u.email, '->', u.rol.nombre);
      }
    });
  },
  error: (err) => console.error('❌ Error:', err)
});
```

### **3. Verificar en Network Tab**
- Abre **Network** en DevTools
- Filtra por `XHR` o `Fetch`
- Haz una acción en el frontend
- Verifica la respuesta del servidor
- Confirma que las relaciones estén incluidas

---

## ✅ Checklist de Verificación

### **Backend:**
- [ ] Todos los `GET` devuelven relaciones
- [ ] Todos los `POST` devuelven el objeto creado con relaciones
- [ ] Todos los `PUT` devuelven el objeto actualizado con relaciones
- [ ] Las rutas específicas (`/rol/:rol_id`, `/modulo/:modulo_id`) funcionan

### **Frontend:**
- [ ] Los servicios usan las URLs correctas
- [ ] Los headers de autenticación se envían correctamente
- [ ] Los tipos/interfaces coinciden con las respuestas del backend
- [ ] Los componentes pueden acceder a las relaciones (ej: `usuario.rol.nombre`)

---

## 🐛 Solución de Problemas

### **Error: "Cannot read property 'rol' of undefined"**
- **Causa:** El backend no está devolviendo la relación
- **Solución:** Verificar que el controlador use `include` correctamente

### **Error: 401 Unauthorized**
- **Causa:** Token inválido o expirado
- **Solución:** Hacer login nuevamente

### **Error: 404 Not Found**
- **Causa:** URL incorrecta o recurso no existe
- **Solución:** Verificar la URL y que el recurso exista en la BD

### **Error: Relación vacía (null)**
- **Causa:** El registro no tiene la relación configurada
- **Solución:** Verificar que el `foreign_key` esté correcto en la BD

---

## 📝 Notas

- Todas las peticiones (excepto `/auth/*`) requieren el header `Authorization: Bearer {token}`
- Las relaciones se incluyen automáticamente en las respuestas
- Si una relación no existe, puede ser `null` o un array vacío `[]`
- Los logs del backend mostrarán las peticiones recibidas

---

¿Necesitas ayuda con alguna prueba específica? ¡Dime cuál y te ayudo!

