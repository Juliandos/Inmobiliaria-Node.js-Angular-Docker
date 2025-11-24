# 📊 Cómo Ver Logs de Docker - WSL y Docker Desktop

## 🐧 Opción 1: Ver Logs desde WSL (Terminal)

### **Ver logs de todos los servicios:**
```bash
docker compose logs
```

### **Ver logs en tiempo real (follow):**
```bash
docker compose logs -f
```
**Nota:** Presiona `Ctrl+C` para salir

### **Ver logs de un servicio específico:**
```bash
# Logs de la API (donde verás las peticiones HTTP)
docker compose logs api

# Logs de MySQL
docker compose logs mysql

# Logs del Frontend
docker compose logs front
```

### **Ver logs en tiempo real de un servicio:**
```bash
# Ver logs de la API en tiempo real
docker compose logs -f api
```

### **Ver últimas líneas:**
```bash
# Últimas 50 líneas
docker compose logs --tail=50 api

# Últimas 100 líneas
docker compose logs --tail=100 api
```

### **Ver logs desde un momento específico:**
```bash
# Logs desde hace 10 minutos
docker compose logs --since 10m api

# Logs desde una fecha específica
docker compose logs --since 2025-11-23T15:00:00 api
```

---

## 🖥️ Opción 2: Ver Logs desde Docker Desktop

### **Paso 1: Abrir Docker Desktop**

1. Abre **Docker Desktop** desde el menú de inicio
2. Espera a que se cargue completamente

### **Paso 2: Ver Contenedores**

1. En la barra lateral izquierda, haz clic en **"Containers"** (o "Contenedores")
2. Verás una lista de tus contenedores:
   - `inmobiliaria-mysql`
   - `inmobiliaria-api`
   - `inmobiliaria-front`

### **Paso 3: Ver Logs de un Contenedor**

1. **Haz clic en el contenedor** `inmobiliaria-api`
2. Se abrirá una ventana con información del contenedor
3. Haz clic en la pestaña **"Logs"** (en la parte superior)
4. Verás los logs en tiempo real

### **Características de Docker Desktop:**

- ✅ **Actualización en tiempo real** (como `-f` en terminal)
- ✅ **Búsqueda** (Ctrl+F para buscar en los logs)
- ✅ **Filtros** (puedes filtrar por nivel: info, error, etc.)
- ✅ **Exportar logs** (botón para descargar los logs)
- ✅ **Scroll automático** (se actualiza automáticamente)

---

## 📋 Qué Verás en los Logs de la API

Cuando hagas login, deberías ver algo como:

```
2025-11-23T16:03:15.488999Z - POST /auth/login
🔐 Login attempt: { email: 'admin@test.com', password: '***' }
📋 Buscando usuario: admin@test.com
✅ Usuario encontrado: admin@test.com
🔒 Comparando contraseña...
✅ Contraseña correcta, generando tokens...
💾 Guardando refresh token...
✅ Login exitoso
```

---

## 🎯 Recomendaciones

### **Para Desarrollo Activo:**
- **Usa WSL con:** `docker compose logs -f api`
- Más rápido y puedes copiar/pegar fácilmente

### **Para Debugging Visual:**
- **Usa Docker Desktop**
- Interfaz gráfica más fácil de navegar
- Búsqueda y filtros integrados

### **Para Ver Logs Históricos:**
```bash
# En WSL
docker compose logs --tail=200 api > logs-api.txt
```

---

## 🔍 Comandos Útiles Adicionales

### **Ver solo errores:**
```bash
docker compose logs api | grep -i error
```

### **Ver peticiones HTTP:**
```bash
docker compose logs api | grep -E "POST|GET|PUT|DELETE"
```

### **Ver logs de múltiples servicios:**
```bash
docker compose logs api mysql
```

### **Ver logs con timestamps:**
```bash
docker compose logs -t api
```

---

## 💡 Tip Pro

Puedes tener **ambas abiertas al mismo tiempo**:
- Docker Desktop para ver logs visualmente
- Terminal WSL para ejecutar comandos y ver logs específicos

---

¿Quieres que te muestre algún comando específico para filtrar los logs?

