# 🚀 Comandos de Despliegue EC2 - Inmobiliaria

## 🔐 Conexión al Servidor

**IP:** 54.147.61.191
**Usuario:** ec2-user
**Key:** ~/.ssh/inmobiliaria-key.pem

```bash
ssh -i ~/.ssh/inmobiliaria-key.pem ec2-user@54.147.61.191
```

---

## 📦 DESPLIEGUE COMPLETO (Front + Back + DB)

Usar cuando hay cambios en múltiples componentes o no estás seguro:

```bash
cd ~/inmobiliaria
git pull origin main
docker-compose down
docker-compose build --no-cache
docker-compose up -d
docker-compose ps
```

---

## 🎨 DESPLIEGUE SOLO FRONTEND

Usar cuando solo modificaste archivos en `/Front` (HTML, CSS, TS, Angular):

```bash
cd ~/inmobiliaria
git pull origin main
docker-compose build --no-cache front
docker-compose up -d front
docker-compose ps
```

**Reinicio rápido (sin rebuild):**
```bash
cd ~/inmobiliaria
git pull origin main
docker-compose restart front
docker-compose ps
```

---

## ⚙️ DESPLIEGUE SOLO BACKEND/API

Usar cuando solo modificaste archivos en `/API` (Node.js, TypeScript, rutas, controladores):

```bash
cd ~/inmobiliaria
git pull origin main
docker-compose build --no-cache api
docker-compose up -d api
docker-compose ps
```

**Reinicio rápido (sin rebuild):**
```bash
cd ~/inmobiliaria
git pull origin main
docker-compose restart api
docker-compose ps
```

**Si agregaste dependencias (package.json):**
```bash
cd ~/inmobiliaria
git pull origin main
docker-compose exec api npm install --legacy-peer-deps
docker-compose restart api
docker-compose ps
```

---

## 🗄️ DESPLIEGUE CON CAMBIOS EN BASE DE DATOS

Usar cuando hay migraciones o cambios en esquema de DB:

### Opción 1: Con migraciones preparadas

```bash
cd ~/inmobiliaria
git pull origin main
docker-compose down
docker-compose up -d mysql
sleep 30
docker-compose exec api npm run migrate-all
docker-compose up -d
docker-compose ps
```

### Opción 2: Ejecutar migración SQL manual

```bash
cd ~/inmobiliaria
git pull origin main
docker-compose down
docker-compose up -d mysql
sleep 30
docker-compose exec -i mysql mysql -u root -p${MYSQL_ROOT_PASSWORD} ${MYSQL_DATABASE} < API/migrations/tu-migracion.sql
docker-compose up -d
docker-compose ps
```

### Opción 3: Recrear BD desde cero (⚠️ BORRA DATOS)

```bash
cd ~/inmobiliaria
git pull origin main
docker-compose down -v
docker-compose up -d mysql
sleep 30
docker-compose exec api npm run seed-with-migrations
docker-compose up -d
docker-compose ps
```

---

## 🔄 REINICIO RÁPIDO SIN CAMBIOS

Solo reiniciar servicios sin descargar cambios ni rebuild:

### Reiniciar todo
```bash
docker-compose restart
docker-compose ps
```

### Reiniciar solo frontend
```bash
docker-compose restart front
```

### Reiniciar solo API
```bash
docker-compose restart api
```

### Reiniciar solo MySQL
```bash
docker-compose restart mysql
```

---

## 📊 COMANDOS DE VERIFICACIÓN

### Ver estado de contenedores
```bash
docker-compose ps
```

### Ver logs en tiempo real
```bash
# Todos los servicios
docker-compose logs -f

# Solo últimas 50 líneas
docker-compose logs -f --tail=50

# Solo frontend
docker-compose logs -f front

# Solo API
docker-compose logs -f api

# Solo MySQL
docker-compose logs -f mysql
```

### Verificar que los servicios responden
```bash
# Frontend
curl -I http://localhost:4200

# API
curl http://localhost:3000/health

# MySQL (desde dentro del contenedor)
docker-compose exec mysql mysql -u root -p${MYSQL_ROOT_PASSWORD} -e "SHOW DATABASES;"
```

---

## 🧹 LIMPIEZA Y MANTENIMIENTO

### Limpiar imágenes no usadas
```bash
docker image prune -f
```

### Limpiar contenedores detenidos
```bash
docker container prune -f
```

### Limpiar todo (imágenes, contenedores, volúmenes no usados)
```bash
docker system prune -a -f
```

### Ver uso de disco
```bash
docker system df
```

---

## 🆘 SOLUCIÓN DE PROBLEMAS

### Si git pull falla por conflictos
```bash
cd ~/inmobiliaria
git stash
git pull origin main
git stash pop
```

### Si un contenedor no levanta
```bash
# Ver logs del contenedor
docker-compose logs <servicio>

# Ejemplo:
docker-compose logs api
docker-compose logs front
docker-compose logs mysql
```

### Si hay problemas de caché
```bash
cd ~/inmobiliaria
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Si MySQL no inicia correctamente
```bash
# Esperar más tiempo y verificar
docker-compose up -d mysql
sleep 45
docker-compose logs mysql
docker-compose ps mysql
```

### Verificar variables de entorno
```bash
# Ver variables del API
docker-compose exec api env | grep -E "MYSQL|AWS|NODE"

# Ver variables de MySQL
docker-compose exec mysql env | grep MYSQL
```

---

## 📝 FLUJO RECOMENDADO

### Para cambios pequeños (solo front o solo back):

1. **LOCAL:** Hacer commit y push
   ```bash
   git add .
   git commit -m "mensaje"
   git push origin main
   ```

2. **EC2:** Conectar
   ```bash
   ssh -i ~/.ssh/inmobiliaria-key.pem ec2-user@54.147.61.191
   ```

3. **EC2:** Desplegar solo el servicio modificado
   ```bash
   cd ~/inmobiliaria
   git pull origin main
   docker-compose build --no-cache front  # o api
   docker-compose up -d front             # o api
   docker-compose ps
   ```

### Para cambios importantes o múltiples servicios:

1. **LOCAL:** Hacer commit y push
   ```bash
   git add .
   git commit -m "mensaje"
   git push origin main
   ```

2. **EC2:** Conectar
   ```bash
   ssh -i ~/.ssh/inmobiliaria-key.pem ec2-user@54.147.61.191
   ```

3. **EC2:** Despliegue completo
   ```bash
   cd ~/inmobiliaria
   git pull origin main
   docker-compose down
   docker-compose build --no-cache
   docker-compose up -d
   docker-compose ps
   ```

---

## 🌐 URLs de Verificación

- **Frontend:** http://54.147.61.191
- **API Health:** http://54.147.61.191/api/health

---

## 💡 TIPS

- Usa `docker-compose logs -f` para monitorear en tiempo real
- Siempre verifica con `docker-compose ps` que los contenedores estén en estado "Up"
- Para cambios solo de estilos CSS/SCSS, solo rebuild el frontend
- Para cambios en rutas/controladores del API, solo rebuild el API
- El flag `--no-cache` asegura que se reconstruya todo desde cero
- Si tienes dudas, haz despliegue completo (es más seguro)

---

## 📌 RECORDATORIOS

- **Usuario correcto:** ec2-user (NO ubuntu)
- **Directorio del proyecto:** ~/inmobiliaria
- **Docker Compose:** usa `docker-compose` (con guion)
- **Archivo .pem:** ~/.ssh/inmobiliaria-key.pem
