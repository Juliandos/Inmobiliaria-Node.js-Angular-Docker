# 🔧 Solución al Problema de Login

## 🔍 Problema Identificado

Los logs muestran que:
- ✅ El usuario se encuentra correctamente (`admin@test.com`)
- ❌ La comparación de contraseña falla

**Causa probable:** La contraseña en la base de datos fue hasheada con un método diferente o el seed no está actualizando correctamente las contraseñas de usuarios existentes.

---

## 🛠️ Soluciones Implementadas

### 1. **Script para Corregir Contraseñas** (`fix-passwords.ts`)

He creado un script que:
- Se conecta a la base de datos
- Busca cada usuario
- Genera un nuevo hash de la contraseña `123456`
- Actualiza la contraseña en la base de datos
- Verifica que la comparación funcione

### 2. **Logging Mejorado en el Seed**

El seed ahora muestra:
- Si está actualizando o creando usuarios
- El hash de la contraseña (primeros caracteres)
- Verificación de que la contraseña se puede comparar correctamente

### 3. **Logging Mejorado en el Login**

El login ahora muestra:
- La contraseña recibida
- El hash almacenado en la BD (primeros caracteres)
- El resultado de la comparación
- Información de depuración adicional

---

## 📋 Pasos para Solucionar

### **Opción 1: Usar el Script de Corrección (Recomendado)**

```bash
# En WSL, dentro del contenedor Docker
docker compose exec api npm run fix-passwords

# O si estás corriendo localmente
cd API
npm run fix-passwords
```

Este script:
1. Busca todos los usuarios
2. Genera un nuevo hash para la contraseña `123456`
3. Actualiza la contraseña en la BD
4. Verifica que funcione

### **Opción 2: Ejecutar el Seed Mejorado**

```bash
# En WSL, dentro del contenedor Docker
docker compose exec api npm run seed

# O si estás corriendo localmente
cd API
npm run seed
```

El seed ahora:
- Actualiza las contraseñas de usuarios existentes
- Muestra logs detallados de lo que está haciendo
- Verifica que las contraseñas funcionen

### **Opción 3: Verificar Manualmente en la BD**

Si quieres verificar directamente en la base de datos:

```bash
# Conectarse a MySQL
docker compose exec mysql mysql -u root -p

# Usar la base de datos
USE db_inmobiliaria;

# Ver usuarios y sus contraseñas (primeros caracteres)
SELECT id, email, LEFT(password, 30) as password_preview FROM usuarios;
```

---

## 🔍 Verificación

Después de ejecutar el script de corrección o el seed:

1. **Reinicia el backend** (si es necesario):
   ```bash
   docker compose restart api
   ```

2. **Intenta hacer login** con:
   - Email: `admin@test.com`
   - Password: `123456`

3. **Revisa los logs** del backend:
   ```bash
   docker compose logs -f api
   ```

   Deberías ver:
   ```
   🔐 Login attempt: { email: 'admin@test.com', password: '123456' }
   📋 Buscando usuario: admin@test.com
   ✅ Usuario encontrado: admin@test.com
   🔒 Comparando contraseña...
      - Password recibida: 123456
      - Hash en BD (primeros 30 chars): $2a$10$...
      - Resultado comparación: ✅ CORRECTO
   ✅ Contraseña correcta, generando tokens...
   ✅ Login exitoso
   ```

---

## 🐛 Depuración Adicional

Si el problema persiste:

### 1. **Verificar que bcryptjs esté funcionando**

El script `fix-passwords.ts` verifica que la comparación funcione. Si falla, puede ser un problema con la librería.

### 2. **Verificar el formato del hash**

Los hashes de bcryptjs tienen el formato:
```
$2a$10$...
```

Si el hash en la BD no tiene este formato, puede ser que se haya guardado incorrectamente.

### 3. **Verificar que no haya espacios en blanco**

A veces las contraseñas tienen espacios al inicio o al final. El script debería manejar esto, pero verifica.

### 4. **Verificar la conexión a la BD**

Asegúrate de que el backend esté conectado a la misma base de datos donde ejecutaste el seed.

---

## 📝 Notas Importantes

1. **El script `fix-passwords.ts` es seguro**: Solo actualiza las contraseñas de los usuarios de prueba.

2. **Las contraseñas se hashean con `bcryptjs`**: Usa 10 rounds de sal, que es el estándar.

3. **El seed ahora actualiza contraseñas**: Si ejecutas el seed múltiples veces, las contraseñas se actualizarán correctamente.

4. **Los logs son detallados**: Revisa los logs para ver exactamente qué está pasando.

---

## ✅ Resultado Esperado

Después de ejecutar el script de corrección:

- ✅ Login funciona con `admin@test.com` / `123456`
- ✅ Login funciona con `jefe@test.com` / `123456`
- ✅ Login funciona con `secretario@test.com` / `123456`
- ✅ Login funciona con `usuario@test.com` / `123456`

---

¿Necesitas ayuda con algún paso específico? ¡Dime qué error ves y te ayudo a solucionarlo!

