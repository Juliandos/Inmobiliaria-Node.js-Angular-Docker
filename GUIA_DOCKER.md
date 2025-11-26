# 🐳 Guía de Uso de Docker - Inmobiliaria

## 📋 Índice
1. [Detener Contenedores por la Noche](#detener-contenedores-por-la-noche)
2. [Iniciar Contenedores en la Mañana](#iniciar-contenedores-en-la-mañana)
3. [Comandos Útiles](#comandos-útiles)
4. [Solución de Problemas](#solución-de-problemas)

---

## 🌙 Detener Contenedores por la Noche

### Opción 1: Detener solo los contenedores (RECOMENDADO)
**Los datos se mantienen, solo se detienen los servicios**

```bash
# Desde Windows PowerShell o CMD
wsl bash -c "cd '/mnt/c/Users/ASUS/Desktop/rescate asus/Yo/Paginas Web/Propio/Inmobiliaria Node Docker Angular' && docker compose stop"
```

**O desde WSL directamente:**
```bash
cd "/mnt/c/Users/ASUS/Desktop/rescate asus/Yo/Paginas Web/Propio/Inmobiliaria Node Docker Angular"
docker compose stop
```

**¿Qué hace esto?**
- ✅ Detiene todos los contenedores (MySQL, API, Front)
- ✅ Los datos se mantienen en los volúmenes
- ✅ Los contenedores se pueden reiniciar rápidamente
- ✅ No elimina nada

### Opción 2: Detener y eliminar contenedores (pero mantener datos)
**Si quieres liberar más recursos pero mantener los datos**

```bash
wsl bash -c "cd '/mnt/c/Users/ASUS/Desktop/rescate asus/Yo/Paginas Web/Propio/Inmobiliaria Node Docker Angular' && docker compose down"
```

**¿Qué hace esto?**
- ✅ Detiene y elimina los contenedores
- ✅ Los datos se mantienen en los volúmenes
- ✅ Elimina la red creada
- ⚠️ Tarda un poco más en iniciar la próxima vez

### ⚠️ NO USES ESTE COMANDO (elimina datos):
```bash
# ❌ NO EJECUTAR - Elimina volúmenes y datos
docker compose down -v
```

---

## ☀️ Iniciar Contenedores en la Mañana

### Opción 1: Si usaste `docker compose stop` (más rápido)
```bash
wsl bash -c "cd '/mnt/c/Users/ASUS/Desktop/rescate asus/Yo/Paginas Web/Propio/Inmobiliaria Node Docker Angular' && docker compose start"
```

### Opción 2: Si usaste `docker compose down` o es la primera vez
```bash
wsl bash -c "cd '/mnt/c/Users/ASUS/Desktop/rescate asus/Yo/Paginas Web/Propio/Inmobiliaria Node Docker Angular' && docker compose up -d"
```

**¿Qué hace esto?**
- ✅ Crea los contenedores si no existen
- ✅ Inicia todos los servicios (MySQL, API, Front)
- ✅ `-d` ejecuta en segundo plano (detached)
- ✅ Los datos se restauran automáticamente desde los volúmenes

### Iniciar solo servicios específicos
```bash
# Solo MySQL y API (sin Front)
wsl bash -c "cd '/mnt/c/Users/ASUS/Desktop/rescate asus/Yo/Paginas Web/Propio/Inmobiliaria Node Docker Angular' && docker compose up -d mysql api"

# Solo MySQL
wsl bash -c "cd '/mnt/c/Users/ASUS/Desktop/rescate asus/Yo/Paginas Web/Propio/Inmobiliaria Node Docker Angular' && docker compose up -d mysql"
```

---

## 🔧 Comandos Útiles

### Ver estado de los contenedores
```bash
wsl bash -c "cd '/mnt/c/Users/ASUS/Desktop/rescate asus/Yo/Paginas Web/Propio/Inmobiliaria Node Docker Angular' && docker compose ps"
```

### Ver logs en tiempo real
```bash
# Todos los servicios
wsl bash -c "cd '/mnt/c/Users/ASUS/Desktop/rescate asus/Yo/Paginas Web/Propio/Inmobiliaria Node Docker Angular' && docker compose logs -f"

# Solo API
wsl bash -c "cd '/mnt/c/Users/ASUS/Desktop/rescate asus/Yo/Paginas Web/Propio/Inmobiliaria Node Docker Angular' && docker compose logs -f api"

# Solo MySQL
wsl bash -c "cd '/mnt/c/Users/ASUS/Desktop/rescate asus/Yo/Paginas Web/Propio/Inmobiliaria Node Docker Angular' && docker compose logs -f mysql"
```

### Reiniciar un contenedor específico
```bash
wsl bash -c "cd '/mnt/c/Users/ASUS/Desktop/rescate asus/Yo/Paginas Web/Propio/Inmobiliaria Node Docker Angular' && docker compose restart api"
```

### Ejecutar comandos dentro de un contenedor
```bash
# Ejecutar seed
wsl bash -c "cd '/mnt/c/Users/ASUS/Desktop/rescate asus/Yo/Paginas Web/Propio/Inmobiliaria Node Docker Angular' && docker compose exec api npm run seed"

# Acceder a la terminal del contenedor API
wsl bash -c "cd '/mnt/c/Users/ASUS/Desktop/rescate asus/Yo/Paginas Web/Propio/Inmobiliaria Node Docker Angular' && docker compose exec api sh"

# Acceder a MySQL directamente
wsl bash -c "cd '/mnt/c/Users/ASUS/Desktop/rescate asus/Yo/Paginas Web/Propio/Inmobiliaria Node Docker Angular' && docker compose exec mysql mysql -u root -p123456 db_inmobiliaria"
```

---

## 🚨 Solución de Problemas

### El puerto 3306 está ocupado
```bash
# Ver qué está usando el puerto
wsl sudo lsof -i :3306

# Detener MySQL de WSL
wsl sudo service mysql stop

# O detener el proceso específico
wsl sudo kill -9 <PID>
```

### Los contenedores no inician
```bash
# Ver logs de errores
wsl bash -c "cd '/mnt/c/Users/ASUS/Desktop/rescate asus/Yo/Paginas Web/Propio/Inmobiliaria Node Docker Angular' && docker compose logs"

# Reconstruir las imágenes
wsl bash -c "cd '/mnt/c/Users/ASUS/Desktop/rescate asus/Yo/Paginas Web/Propio/Inmobiliaria Node Docker Angular' && docker compose up --build -d"
```

### Limpiar todo (CUIDADO: elimina datos)
```bash
# Detener y eliminar contenedores, redes y volúmenes
wsl bash -c "cd '/mnt/c/Users/ASUS/Desktop/rescate asus/Yo/Paginas Web/Propio/Inmobiliaria Node Docker Angular' && docker compose down -v"

# Limpiar imágenes no usadas
docker system prune -a
```

---

## 📝 Rutina Recomendada

### Por la Noche (antes de apagar el PC):
```bash
# 1. Detener contenedores
wsl bash -c "cd '/mnt/c/Users/ASUS/Desktop/rescate asus/Yo/Paginas Web/Propio/Inmobiliaria Node Docker Angular' && docker compose stop"

# 2. Verificar que se detuvieron
wsl bash -c "cd '/mnt/c/Users/ASUS/Desktop/rescate asus/Yo/Paginas Web/Propio/Inmobiliaria Node Docker Angular' && docker compose ps"
```

### Por la Mañana (al encender el PC):
```bash
# 1. Verificar que Docker Desktop esté corriendo (si usas Docker Desktop)

# 2. Iniciar contenedores
wsl bash -c "cd '/mnt/c/Users/ASUS/Desktop/rescate asus/Yo/Paginas Web/Propio/Inmobiliaria Node Docker Angular' && docker compose up -d"

# 3. Verificar que estén corriendo
wsl bash -c "cd '/mnt/c/Users/ASUS/Desktop/rescate asus/Yo/Paginas Web/Propio/Inmobiliaria Node Docker Angular' && docker compose ps"

# 4. Ver logs si hay problemas
wsl bash -c "cd '/mnt/c/Users/ASUS/Desktop/rescate asus/Yo/Paginas Web/Propio/Inmobiliaria Node Docker Angular' && docker compose logs --tail=50"
```

---

## 💡 Tips Importantes

1. **Los datos se guardan automáticamente** en volúmenes Docker, así que aunque detengas los contenedores, tus datos están seguros.

2. **`docker compose stop`** es más rápido que `down` porque no elimina los contenedores, solo los detiene.

3. **`docker compose up -d`** siempre funciona, incluso si usaste `stop` o `down`.

4. **Verifica siempre el estado** con `docker compose ps` antes de trabajar.

5. **Si Docker Desktop está cerrado**, los contenedores no pueden correr. Asegúrate de iniciarlo primero.

6. **Los puertos**:
   - MySQL: `3306`
   - API: `3001`
   - Front: `4200`

---

## 🔗 Accesos Rápidos

Una vez que los contenedores estén corriendo:
- **Frontend**: http://localhost:4200
- **API**: http://localhost:3001
- **MySQL**: localhost:3306 (usuario: root, password: 123456)

---

**Última actualización**: 2025-11-26

