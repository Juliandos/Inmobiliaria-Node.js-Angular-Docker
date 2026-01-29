# 🚀 Comandos Rápidos para EC2

## 📋 Información del Servidor

- **IP:** 54.147.61.191
- **Usuario:** ubuntu
- **Key:** ~/.ssh/inmobiliaria-key.pem
- **Directorio del proyecto:** ~/inmobiliaria

---

## 🔐 Conectar a EC2

### Opción 1: Usando el script (RECOMENDADO)

```bash
# Dar permisos de ejecución (solo la primera vez)
chmod +x devops/conectar-ec2.sh

# Conectar
./devops/conectar-ec2.sh
```

### Opción 2: Comando directo

```bash
ssh -i ~/.ssh/inmobiliaria-key.pem ubuntu@54.147.61.191
```

---

## 🚀 Desplegar Cambios en EC2

### Opción 1: Script automático (RECOMENDADO)

Este script hace TODO el proceso automáticamente:

```bash
# Dar permisos de ejecución (solo la primera vez)
chmod +x devops/deploy-ec2.sh

# Ejecutar despliegue completo
./devops/deploy-ec2.sh
```

### Opción 2: Comandos manuales

```bash
# 1. LOCAL: Hacer commit y push
git add .
git commit -m "Tu mensaje de commit"
git push origin main

# 2. CONECTAR A EC2
ssh -i ~/.ssh/inmobiliaria-key.pem ubuntu@54.147.61.191

# 3. EN EC2: Desplegar
cd ~/inmobiliaria && \
git pull origin main && \
docker-compose down && \
docker-compose build --no-cache && \
docker-compose up -d && \
docker-compose ps
```

---

## 📊 Comandos Útiles en EC2

### Ver estado de contenedores

```bash
ssh -i ~/.ssh/inmobiliaria-key.pem ubuntu@54.147.61.191 'cd ~/inmobiliaria && docker-compose ps'
```

### Ver logs en tiempo real

```bash
ssh -i ~/.ssh/inmobiliaria-key.pem ubuntu@54.147.61.191 'cd ~/inmobiliaria && docker-compose logs -f'
```

### Ver logs de un servicio específico

```bash
# Frontend
ssh -i ~/.ssh/inmobiliaria-key.pem ubuntu@54.147.61.191 'cd ~/inmobiliaria && docker-compose logs -f front'

# API
ssh -i ~/.ssh/inmobiliaria-key.pem ubuntu@54.147.61.191 'cd ~/inmobiliaria && docker-compose logs -f api'

# MySQL
ssh -i ~/.ssh/inmobiliaria-key.pem ubuntu@54.147.61.191 'cd ~/inmobiliaria && docker-compose logs -f mysql'
```

### Reiniciar un servicio específico

```bash
# Solo frontend
ssh -i ~/.ssh/inmobiliaria-key.pem ubuntu@54.147.61.191 'cd ~/inmobiliaria && docker-compose restart front'

# Solo API
ssh -i ~/.ssh/inmobiliaria-key.pem ubuntu@54.147.61.191 'cd ~/inmobiliaria && docker-compose restart api'
```

### Limpiar recursos Docker

```bash
ssh -i ~/.ssh/inmobiliaria-key.pem ubuntu@54.147.61.191 'docker system prune -f'
```

---

## 🔧 Solución de Problemas

### Si el archivo .pem no tiene permisos correctos

```bash
chmod 400 ~/.ssh/inmobiliaria-key.pem
```

### Si git pull falla por conflictos

```bash
ssh -i ~/.ssh/inmobiliaria-key.pem ubuntu@54.147.61.191 'cd ~/inmobiliaria && git stash && git pull origin main'
```

### Si un contenedor no levanta

```bash
# Ver logs del contenedor problemático
ssh -i ~/.ssh/inmobiliaria-key.pem ubuntu@54.147.61.191 'cd ~/inmobiliaria && docker-compose logs <servicio>'

# Ejemplo:
ssh -i ~/.ssh/inmobiliaria-key.pem ubuntu@54.147.61.191 'cd ~/inmobiliaria && docker-compose logs api'
```

---

## 📦 Despliegue Paso a Paso

### 1. Hacer cambios en local

```bash
# Editar archivos...
# Probar localmente si es necesario
```

### 2. Commit y Push

```bash
git add .
git commit -m "Tu mensaje descriptivo"
git push origin main
```

### 3. Desplegar en EC2

```bash
# Opción A: Usar script automático
./devops/deploy-ec2.sh

# Opción B: Manual
ssh -i ~/.ssh/inmobiliaria-key.pem ubuntu@54.147.61.191 << 'EOF'
cd ~/inmobiliaria
git pull origin main
docker-compose down
docker-compose build --no-cache
docker-compose up -d
docker-compose ps
EOF
```

### 4. Verificar

```bash
# Ver logs
ssh -i ~/.ssh/inmobiliaria-key.pem ubuntu@54.147.61.191 'cd ~/inmobiliaria && docker-compose logs -f --tail=50'

# O abrir en navegador
# http://54.147.61.191
```

---

## 🌐 URLs Importantes

- **Frontend:** http://54.147.61.191
- **API Health:** http://54.147.61.191/api/health (si está configurado)

---

## 💡 Tips

1. **Usa el script de despliegue automático** (`./devops/deploy-ec2.sh`) para evitar errores
2. **Siempre haz push antes de desplegar** en EC2
3. **Revisa los logs** después de cada despliegue
4. **Mantén el archivo .pem seguro** y con permisos 400

---

## 📝 Notas

- El archivo .pem se encuentra en: `~/.ssh/inmobiliaria-key.pem`
- El proyecto en EC2 está en: `~/inmobiliaria`
- Docker Compose usa el comando `docker-compose` (con guion) en EC2
