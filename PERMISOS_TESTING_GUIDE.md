# 🔒 Guía de Pruebas - Sistema de Permisos

## Resumen de Cambios Realizados

### ✅ Backend (API)
1. **Nuevo endpoint**: `GET /permisos` - Obtiene permisos del usuario actual
2. **Nuevo controller**: `getUserPermissions()` en `auth.ts`
3. **Nueva ruta**: `/auth/permissions` (alternativa)
4. **Middleware**: Aplica `verifyToken` automáticamente

### ✅ Frontend (Angular)
1. **Directivas corregidas**: Sintaxis correcta en `permisos.component.html`
2. **Guards mejorados**: `AuthGuard` carga permisos automáticamente
3. **Nuevo guard**: `PermissionGuard` para verificación específica
4. **Servicio mejorado**: Mejor manejo de errores y token expirado

## 🧪 Cómo Probar el Sistema

### 1. **Verificar Endpoint del Backend**

```bash
# 1. Iniciar el servidor backend
cd API
npm start

# 2. Hacer login y obtener token
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"usuario@test.com","password":"password123"}'

# 3. Probar endpoint de permisos (reemplazar TOKEN)
curl -X GET http://localhost:3001/permisos \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Respuesta esperada:**
```json
{
  "userId": 1,
  "email": "usuario@test.com",
  "rol": {
    "id": 1,
    "nombre": "Admin"
  },
  "permisos": [
    {
      "modulo": "permisos",
      "c": true,
      "r": true,
      "u": true,
      "d": true
    },
    {
      "modulo": "usuarios",
      "c": true,
      "r": true,
      "u": false,
      "d": false
    }
  ]
}
```

### 2. **Verificar Frontend**

```bash
# Iniciar frontend
cd Front
npm start
```

**Pasos de prueba:**

1. **Login** → Ir a `/login` e ingresar credenciales
2. **Navegar** → Ir a `/profile/permisos`
3. **Verificar consola** → Debe ver mensajes:
   ```
   ✅ Permisos cargados del backend: {...}
   permissions: {...}
   ```

### 3. **Probar Directivas**

En `/profile/permisos`:

- **Botón "Nuevo Permiso"** → Solo visible si tienes permiso de creación
- **Botones de editar** → Solo visibles si tienes permiso de actualización
- **Botones de eliminar** → Solo visibles si tienes permiso de eliminación
- **Mensajes informativos** → Se muestran cuando NO tienes permisos

### 4. **Debugging**

**Consola del navegador:**
```javascript
// Verificar permisos cargados
window.localStorage.getItem('accessToken') // Debe tener token

// Ver estado del servicio
const permisosService = angular.injector().get('PermisosAuthService')
```

## 🔧 Configuración de Datos de Prueba

### Crear Roles y Permisos de Prueba:

```sql
-- 1. Crear roles
INSERT INTO roles (nombre) VALUES ('Admin'), ('Usuario'), ('Editor');

-- 2. Crear módulos
INSERT INTO modulos (nombre) VALUES ('permisos'), ('usuarios'), ('propiedades');

-- 3. Crear permisos
INSERT INTO permisos (nombre, c, r, u, d, rol_id, modulo_id) VALUES 
('Gestión Completa Permisos', 1, 1, 1, 1, 1, 1),
('Solo Lectura Usuarios', 0, 1, 0, 0, 2, 2),
('Edición Propiedades', 0, 1, 1, 0, 3, 3);

-- 4. Crear usuario de prueba
INSERT INTO usuarios (nombre, apellido, email, password, rol_id) VALUES 
('Admin', 'Test', 'admin@test.com', '$hashedPassword', 1);
```

## 🐛 Troubleshooting

### Problema: "No se cargan los permisos"
```bash
# Verificar en consola del navegador
Network → XHR → Buscar request a `/permisos`
- Status 200: ✅ Éxito
- Status 401: ❌ Token inválido/expirado  
- Status 404: ❌ Endpoint no encontrado
```

### Problema: "Directivas no funcionan"
```typescript
// Verificar import en componente
import { HasPermissionDirective } from '../../../directives/has-permission-auth.directive';

// Verificar en imports del componente
imports: [
  // ...
  HasPermissionDirective
]
```

### Problema: "Error CORS"
```typescript
// Backend - main.ts o app.ts
app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true
}));
```

## 📋 Checklist Final

- [ ] ✅ Backend inicia sin errores
- [ ] ✅ Endpoint `/permisos` devuelve datos correctos
- [ ] ✅ Frontend compila sin errores
- [ ] ✅ Login funciona correctamente
- [ ] ✅ Permisos se cargan automáticamente después del login
- [ ] ✅ Directivas muestran/ocultan elementos según permisos
- [ ] ✅ Consola no muestra errores críticos
- [ ] ✅ Guards protegen rutas correctamente

## 🚀 Próximos Pasos Recomendados

1. **Interceptor HTTP** → Manejar tokens expirados automáticamente
2. **Caché de permisos** → Evitar cargar permisos en cada navegación
3. **Guards específicos** → Usar `PermissionGuard` en rutas críticas
4. **Tests unitarios** → Probar directivas y servicios
5. **Logging** → Sistema de logs más robusto

---

**¡El sistema de permisos está listo para usar!** 🎉