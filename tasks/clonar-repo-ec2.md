# Plan: Clonar Repositorio desde Instancia EC2

## Objetivo
Traer los cambios del código fuente desde la instancia EC2 (54.147.61.191) a la máquina local, ya que hay cambios en EC2 que no están en GitHub ni en el código local.

## Análisis del Problema
- **Ubicación EC2**: 54.147.61.191
- **Ubicación probable del código en EC2**: ~/inmobiliaria (según documentación)
- **Ubicación local**: `C:\Users\ASUS\Desktop\rescate asus\Yo\Paginas Web\Propio\Inmobiliaria Node Docker Angular`
- **Método**: Usar SCP (Secure Copy Protocol) para transferir archivos desde EC2

## Tareas

### Fase 1: Preparación y Verificación
- [x] Verificar conexión SSH a EC2 (necesitamos usuario y clave SSH o método de autenticación)
- [x] Conectarse a EC2 y verificar ubicación exacta del código fuente
- [x] Identificar la estructura del proyecto en EC2
- [x] Verificar qué archivos/carpetas deben excluirse (node_modules, .env, etc.)

### Fase 2: Crear Backup en EC2
- [x] Crear un archivo comprimido (tar.gz) del código en EC2 excluyendo archivos innecesarios
- [x] Verificar que el archivo comprimido se creó correctamente
- [x] Verificar el tamaño del archivo comprimido (3.1M confirmado)

### Fase 3: Transferir a Máquina Local
- [x] Usar SCP para transferir el archivo comprimido desde EC2 a la máquina local
- [x] Verificar que la transferencia se completó correctamente
- [ ] Descomprimir el archivo en una ubicación temporal

### Fase 4: Integración con Código Local
- [ ] Comparar estructura de directorios entre EC2 y local
- [ ] Identificar archivos nuevos, modificados o eliminados
- [ ] Crear backup del código local actual antes de fusionar
- [ ] Fusionar cambios de manera segura (preservar cambios locales si existen)
- [ ] Verificar que no se sobrescriban archivos importantes (.env, configuraciones locales)

### Fase 5: Verificación Final
- [ ] Verificar que todos los archivos se copiaron correctamente
- [ ] Verificar que no hay conflictos obvios
- [ ] Limpiar archivos temporales (archivo comprimido, carpeta temporal)

## Información Necesaria
- **Usuario SSH para EC2**: (necesario para conexión)
- **Método de autenticación**: Clave privada (.pem) o contraseña
- **Ruta exacta del código en EC2**: (verificar al conectarse)

## Comandos de Referencia

### Conectarse a EC2
```bash
ssh -i ruta/a/clave.pem usuario@54.147.61.191
ssh -i ~/.ssh/inmobiliaria-key.pem ec2-user@54.147.61.191
# O si es usuario ubuntu/ec2-user:
ssh -i ruta/a/clave.pem ubuntu@54.147.61.191
```

### Crear backup en EC2
```bash
cd ~/inmobiliaria  # o la ruta donde esté el código
tar -czf /tmp/inmobiliaria-backup.tar.gz \
  --exclude='node_modules' \
  --exclude='.env' \
  --exclude='dist' \
  --exclude='.git' \
  .
```

### Verificar archivo en EC2 (ejecutar dentro de EC2 antes de transferir)
```bash
ls -lh /tmp/inmobiliaria-backup.tar.gz
```

### Transferir con SCP (desde Windows)

**OPCIÓN 1: Git Bash (recomendado si tienes Git instalado)**
```bash
# Abrir Git Bash y navegar al directorio del proyecto
cd "/c/Users/ASUS/Desktop/rescate asus/Yo/Paginas Web/Propio/Inmobiliaria Node Docker Angular"

# Transferir archivo
scp -i ~/.ssh/inmobiliaria-key.pem ec2-user@54.147.61.191:/tmp/inmobiliaria-backup.tar.gz .
```

**OPCIÓN 2: PowerShell con OpenSSH**
```powershell
# Habilitar OpenSSH si no está habilitado (ejecutar como Administrador)
# Add-WindowsCapability -Online -Name OpenSSH.Client~~~~0.0.1.0

# Navegar al directorio
cd "C:\Users\ASUS\Desktop\rescate asus\Yo\Paginas Web\Propio\Inmobiliaria Node Docker Angular"

# Transferir archivo (ajustar ruta de clave si es necesario)
scp -i $env:USERPROFILE\.ssh\inmobiliaria-key.pem ec2-user@54.147.61.191:/tmp/inmobiliaria-backup.tar.gz .
```

**OPCIÓN 3: WSL (si tienes WSL instalado) - ACTUAL**
```bash
# Desde WSL - Copiar en carpeta /Propio
cd /mnt/c/Users/ASUS/Desktop/rescate\ asus/Yo/Paginas\ Web/Propio
scp -i ~/.ssh/inmobiliaria-key.pem ec2-user@54.147.61.191:/tmp/inmobiliaria-backup.tar.gz .
```

### Descomprimir localmente
```bash
# Crear carpeta temporal para descomprimir
mkdir -p /mnt/c/Users/ASUS/Desktop/rescate\ asus/Yo/Paginas\ Web/Propio/temp-ec2-backup
cd /mnt/c/Users/ASUS/Desktop/rescate\ asus/Yo/Paginas\ Web/Propio
tar -xzf inmobiliaria-backup.tar.gz -C temp-ec2-backup
```

### Estrategia de Reemplazo Seguro

**PASO 1: Crear backup del código local**
```bash
cd "/mnt/c/Users/ASUS/Desktop/rescate asus/Yo/Paginas Web/Propio"
tar -czf backup-local-$(date +%Y%m%d-%H%M%S).tar.gz "Inmobiliaria Node Docker Angular" \
  --exclude='node_modules' \
  --exclude='.env' \
  --exclude='dist' \
  --exclude='.git'
```

**PASO 2: Comparar estructuras**
```bash
# Ver estructura del backup de EC2
ls -la temp-ec2-backup/

# Comparar con estructura local
diff -r temp-ec2-backup/ "Inmobiliaria Node Docker Angular/" --exclude=node_modules --exclude=.env --exclude=dist --exclude=.git
```

**PASO 3: Reemplazar archivos (preservando archivos importantes)**
```bash
cd "/mnt/c/Users/ASUS/Desktop/rescate asus/Yo/Paginas Web/Propio/Inmobiliaria Node Docker Angular"

# Copiar archivos desde backup de EC2, excluyendo archivos sensibles
rsync -av --progress \
  --exclude='node_modules' \
  --exclude='.env' \
  --exclude='dist' \
  --exclude='.git' \
  --exclude='*.log' \
  ../temp-ec2-backup/ .
```

**PASO 4: Verificar archivos importantes no fueron sobrescritos**
```bash
# Verificar que .env local sigue existiendo
ls -la .env API/.env 2>/dev/null || echo "No hay .env (esto es normal si no existe)"
```

## Recomendación: Estrategia de Reemplazo

### Opción A: Reemplazo Completo (Recomendado si EC2 tiene todos los cambios)
**Ventajas**: Simple, rápido, asegura que tienes exactamente lo que está en EC2
**Pasos**:
1. Crear backup del código local actual
2. Descomprimir backup de EC2 en carpeta temporal
3. Reemplazar todo el código (excepto .env, node_modules, dist, .git)
4. Verificar que funciona

### Opción B: Reemplazo Selectivo (Si quieres preservar algunos cambios locales)
**Ventajas**: Más control, preserva cambios locales específicos
**Pasos**:
1. Crear backup del código local actual
2. Descomprimir backup de EC2 en carpeta temporal
3. Comparar archivo por archivo
4. Reemplazar solo los archivos que quieres actualizar
5. Verificar que funciona

## Notas Importantes
- ✅ **SÍ hacer backup del código local ANTES de cualquier reemplazo**
- ❌ **NO sobrescribir archivos .env locales** (contienen configuraciones locales)
- ❌ **NO sobrescribir node_modules** (se regeneran con npm install)
- ❌ **NO sobrescribir dist** (se regenera al compilar)
- ❌ **NO sobrescribir .git** (historial de git local)
- ⚠️ **Verificar diferencias antes de sobrescribir archivos existentes**
- ⚠️ **Revisar archivos de configuración** (docker-compose.yml, package.json, etc.) antes de sobrescribir

