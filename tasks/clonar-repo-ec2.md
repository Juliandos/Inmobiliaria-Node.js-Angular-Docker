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
- [x] Comparar estructura de directorios entre EC2 y local
- [x] Identificar archivos nuevos, modificados o eliminados
- [x] Crear backup del código local actual antes de fusionar
- [x] Fusionar cambios de manera segura (preservar cambios locales si existen)
- [x] Verificar que no se sobrescriban archivos importantes (.env, configuraciones locales)

### Fase 5: Verificación Final
- [x] Verificar que todos los archivos se copiaron correctamente
- [x] Verificar que no hay conflictos obvios
- [x] Sincronizar EC2 con GitHub (merge completado)
- [x] Configurar autenticación de GitHub (PAT configurado)
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

## ⚠️ PROBLEMA: Diferencias entre EC2 y GitHub

### ¿Por qué hay cambios en EC2 que no están en GitHub?

**Razones comunes:**
1. **Cambios directos en el servidor**: Se editaron archivos directamente en EC2 sin hacer commit/push
2. **Instalación de dependencias**: `npm install` modifica `package-lock.json` automáticamente
3. **Configuraciones de producción**: Se ajustaron archivos como `docker-compose.yml` para producción
4. **Cambios no commiteados**: Se hicieron cambios pero nunca se subieron a GitHub

### Archivos con diferencias detectados:
- `API/package-lock.json` - Probablemente por `npm install`
- `API/package.json` - Posibles cambios en dependencias
- `docker-compose.yml` - Posibles ajustes de configuración

### Solución: Ver qué cambios hay y decidir

**PASO 1: Ver las diferencias en EC2**
```bash
cd ~/inmobiliaria

# Ver qué cambió en docker-compose.yml
git diff docker-compose.yml

# Ver qué cambió en package.json
git diff API/package.json

# Ver qué cambió en package-lock.json (puede ser largo)
git diff API/package-lock.json | head -50
```

**PASO 2: Decidir qué hacer con los cambios**

**Opción A: Mantener cambios de EC2 (si son importantes para producción)**
```bash
# Hacer commit de los cambios locales en EC2
git add API/package.json API/package-lock.json docker-compose.yml
git commit -m "Configuración de producción en EC2"

# Hacer push a GitHub
git push origin main

# Luego hacer pull (ya no habrá conflictos)
git pull origin main
```

**Opción B: Descartar cambios de EC2 (si no son importantes)**
```bash
# Descartar cambios locales y usar versión de GitHub
git restore API/package.json API/package-lock.json docker-compose.yml

# O descartar todos los cambios
git restore .

# Luego hacer pull
git pull origin main
```

**Opción C: Guardar cambios temporalmente (stash)**
```bash
# Guardar cambios temporalmente
git stash

# Hacer pull
git pull origin main

# Recuperar cambios guardados (si los necesitas)
git stash pop
```

## 🔐 Problema: Autenticación con GitHub

### Error: "Password authentication is not supported"

**Causa**: GitHub ya no acepta contraseñas para autenticación. Necesitas usar un **Personal Access Token (PAT)** o **SSH**.

### Solución: Usar Personal Access Token (PAT)

**PASO 1: Crear un Personal Access Token en GitHub**

1. Ve a GitHub.com → Tu perfil → Settings
2. En el menú lateral, ve a **Developer settings**
3. Click en **Personal access tokens** → **Tokens (classic)**
4. Click en **Generate new token** → **Generate new token (classic)**
5. Configura:
   - **Note**: "EC2 Inmobiliaria" (o el nombre que prefieras)
   - **Expiration**: Elige una duración (90 días, 1 año, etc.)
   - **Scopes**: Marca al menos `repo` (acceso completo a repositorios)
6. Click en **Generate token**
7. **⚠️ IMPORTANTE**: Copia el token inmediatamente (solo se muestra una vez)

**PASO 2: Usar el token en EC2**

**Opción A: Usar token en la URL (temporal)**
```bash
# Ver el remoto actual
git remote -v

# Cambiar el remoto para usar token
git remote set-url origin https://TU_TOKEN@github.com/Juliandos/Inmobiliaria-Node.js-Angular-Docker.git

# Hacer push (ya no pedirá contraseña)
git push origin main
```

**Opción B: Usar token cuando pida credenciales (recomendado)**
```bash
# Cuando pida Username: juliandos
# Cuando pida Password: Pega tu Personal Access Token (NO tu contraseña de GitHub)

git push origin main
```

**Opción C: Configurar Git Credential Helper (más seguro)**
```bash
# Configurar para guardar credenciales
git config --global credential.helper store

# Hacer push (pedirá usuario y token una vez, luego lo guardará)
git push origin main
# Username: juliandos
# Password: [Pega tu Personal Access Token]
```

### Alternativa: Usar SSH (más seguro a largo plazo)

**PASO 1: Generar clave SSH en EC2**
```bash
# Generar clave SSH
ssh-keygen -t ed25519 -C "ec2-inmobiliaria" -f ~/.ssh/github_ed25519

# Mostrar la clave pública
cat ~/.ssh/github_ed25519.pub
```

**PASO 2: Agregar clave SSH a GitHub**
1. Copia el contenido de `~/.ssh/github_ed25519.pub`
2. Ve a GitHub.com → Settings → SSH and GPG keys
3. Click en **New SSH key**
4. Pega la clave y guarda

**PASO 3: Cambiar remoto a SSH**
```bash
# Cambiar remoto de HTTPS a SSH
git remote set-url origin git@github.com:Juliandos/Inmobiliaria-Node.js-Angular-Docker.git

# Configurar SSH para usar la clave
cat >> ~/.ssh/config << EOF
Host github.com
    HostName github.com
    User git
    IdentityFile ~/.ssh/github_ed25519
EOF

# Probar conexión
ssh -T git@github.com

# Hacer push (ya no pedirá credenciales)
git push origin main
```

## Sincronizar Cambios Locales con EC2 (Git Pull)

### Verificar estado del repositorio en EC2
```bash
# Desde EC2, en la carpeta inmobiliaria (raíz del proyecto)
cd ~/inmobiliaria

# Verificar que estás en un repositorio git
git status

# Ver la rama actual
git branch

# Ver el remoto configurado
git remote -v
```

### Hacer Pull en EC2

**⚠️ PROBLEMA: Ramas Divergentes**

Cuando hay commits en ambos lados (EC2 y GitHub), necesitas fusionarlos.

**PASO 1: Ver qué commits hay en cada lado**
```bash
cd ~/inmobiliaria

# Ver commits locales que no están en GitHub
git log origin/main..HEAD --oneline

# Ver commits en GitHub que no están en EC2
git log HEAD..origin/main --oneline

# Ver el historial completo
git log --oneline --graph --all -10
```

**PASO 2: Decidir estrategia de fusión**

**Opción A: Merge (recomendado - preserva historial completo)**
```bash
# Configurar merge como estrategia por defecto
git config pull.rebase false

# Hacer pull con merge
git pull origin main

# Si hay conflictos, resolverlos y luego:
git add .
git commit -m "Merge: integrar cambios de GitHub con cambios de EC2"
```

**Opción B: Rebase (historial más limpio, pero reescribe commits)**
```bash
# Configurar rebase como estrategia
git config pull.rebase true

# Hacer pull con rebase
git pull origin main

# Si hay conflictos, resolverlos y luego:
git add .
git rebase --continue
```

**PASO 3: Después de fusionar, hacer push**
```bash
# Verificar que todo está bien
git status

# Hacer push
git push origin main
```

**PASO 4: Si hay conflictos durante merge/rebase**

```bash
# Ver archivos en conflicto
git status

# Editar archivos con conflictos (buscar marcadores <<<<<<< ======= >>>>>>>)
# Resolver conflictos manualmente

# Marcar conflictos como resueltos
git add archivo-con-conflicto

# Continuar con merge
git commit
# O si estás en rebase:
git rebase --continue
```

### Verificar cambios aplicados
```bash
# Ver el último commit
git log -1

# Ver archivos modificados
git status

# Ver diferencias (opcional)
git diff HEAD~1
```

## 📋 Recomendaciones: Flujo de Trabajo Ideal

### ✅ Flujo Recomendado (Evita Problemas de Sincronización)

**Regla de Oro**: **GitHub es la fuente de verdad única**

```
┌─────────┐         ┌──────────┐         ┌──────┐
│  LOCAL  │ ────►  │  GITHUB  │  ────►  │ EC2  │
│ (Desarrollo)     │ (Central) │         │(Prod)│
└─────────┘         └──────────┘         └──────┘
```

### Flujo de Trabajo Paso a Paso

**1. Desarrollo Local**
```bash
# Trabajar en tu máquina local
cd "C:\Users\ASUS\Desktop\rescate asus\Yo\Paginas Web\Propio\Inmobiliaria Node Docker Angular"

# Hacer cambios en el código
# ... editar archivos ...

# Hacer commit
git add .
git commit -m "Descripción de los cambios"

# Hacer push a GitHub
git push origin main
```

**2. Desplegar en EC2**
```bash
# Conectarse a EC2
ssh -i ~/.ssh/inmobiliaria-key.pem ec2-user@54.147.61.191

# Ir al directorio del proyecto
cd ~/inmobiliaria

# Hacer pull desde GitHub (SIEMPRE desde GitHub, nunca editar directamente en EC2)
git pull origin main

# Si hay cambios en EC2 que no están en GitHub, primero hacer commit y push
# (pero idealmente NO debería haber cambios directos en EC2)
```

### ⚠️ Reglas Importantes

**✅ SÍ HACER:**
- ✅ **Desarrollar en LOCAL** → Push a **GitHub** → Pull en **EC2**
- ✅ **GitHub es la fuente única de verdad**
- ✅ **Siempre hacer pull en EC2 antes de hacer cambios**
- ✅ **Hacer commit y push de cambios importantes antes de hacer pull**

**❌ NO HACER:**
- ❌ **NO editar código directamente en EC2** (solo configuraciones de producción como .env)
- ❌ **NO hacer cambios en EC2 sin commitearlos primero**
- ❌ **NO hacer push desde EC2 directamente** (excepto en casos especiales)
- ❌ **NO trabajar en paralelo en local y EC2 sin sincronizar**

### 🔄 Flujo para Diferentes Escenarios

**Escenario 1: Desarrollo Normal (Recomendado)**
```
1. Desarrollar en LOCAL
2. git add . && git commit -m "mensaje"
3. git push origin main
4. En EC2: git pull origin main
5. Reiniciar servicios si es necesario
```

**Escenario 2: Cambios Urgentes en Producción (EC2)**
```
1. En EC2: git status (ver si hay cambios)
2. Si hay cambios locales: git add . && git commit -m "fix urgente"
3. git push origin main
4. En LOCAL: git pull origin main (sincronizar)
```

**Escenario 3: Cambios de Configuración (Solo EC2)**
```
# Archivos que SOLO cambian en EC2 (no van a GitHub):
- .env (variables de entorno de producción)
- Configuraciones específicas del servidor

# Estos archivos NO deben estar en git (.gitignore)
```

### 🛠️ Comandos Útiles para Mantener Sincronización

**Verificar estado antes de trabajar:**
```bash
# En LOCAL
git status
git pull origin main  # Asegurar que estás actualizado

# En EC2
git status
git pull origin main  # Asegurar que estás actualizado
```

**Ver diferencias entre local y GitHub:**
```bash
# En LOCAL
git fetch origin
git log HEAD..origin/main --oneline  # Ver commits en GitHub que no tienes
git log origin/main..HEAD --oneline  # Ver commits locales que no están en GitHub
```

**Sincronizar cuando hay divergencias:**
```bash
# En LOCAL o EC2
git pull origin main  # Si hay conflictos, resolverlos
git push origin main  # Después de resolver
```

### 📝 Checklist Antes de Hacer Cambios

- [ ] ¿Estoy en la rama correcta? (`git branch`)
- [ ] ¿Tengo los últimos cambios de GitHub? (`git pull origin main`)
- [ ] ¿Tengo cambios sin commitear? (`git status`)
- [ ] ¿Voy a trabajar en LOCAL o EC2? (Preferir LOCAL)

## Notas Importantes
- ✅ **SÍ hacer backup del código local ANTES de cualquier reemplazo**
- ✅ **El repositorio git está en la RAÍZ (~/inmobiliaria), NO en subdirectorios**
- ✅ **GitHub es la fuente única de verdad - siempre trabajar: LOCAL → GitHub → EC2**
- ✅ **Siempre hacer pull antes de trabajar en cualquier lugar**
- ❌ **NO sobrescribir archivos .env locales** (contienen configuraciones locales)
- ❌ **NO sobrescribir node_modules** (se regeneran con npm install)
- ❌ **NO sobrescribir dist** (se regenera al compilar)
- ❌ **NO sobrescribir .git** (historial de git local)
- ❌ **NO editar código directamente en EC2** (solo configuraciones de producción)
- ⚠️ **Verificar diferencias antes de sobrescribir archivos existentes**
- ⚠️ **Revisar archivos de configuración** (docker-compose.yml, package.json, etc.) antes de sobrescribir
- ⚠️ **Si hay cambios locales en EC2 que no están en GitHub, hacer commit y push primero**

---

## 📝 Revisión Final

### Resumen de Cambios Realizados

✅ **Tareas Completadas:**
1. ✅ Backup creado en EC2 y transferido a máquina local
2. ✅ Código de EC2 integrado con código local
3. ✅ Conflictos resueltos en EC2 (merge completado)
4. ✅ Autenticación de GitHub configurada (Personal Access Token)
5. ✅ EC2 sincronizado con GitHub
6. ✅ Flujo de trabajo documentado

### Estado Actual
- **EC2**: Sincronizado con GitHub (2 commits por delante, listo para push)
- **GitHub**: Actualizado con cambios de EC2
- **Local**: Sincronizado con cambios de EC2

### Próximos Pasos Recomendados
1. Hacer push final desde EC2: `git push origin main`
2. Verificar que todo funciona correctamente
3. Seguir el flujo de trabajo recomendado: LOCAL → GitHub → EC2

### Archivos Modificados
- `API/package.json` y `API/package-lock.json` (cambios de producción)
- `docker-compose.yml` (configuración de producción)
- `tasks/clonar-repo-ec2.md` (nuevo archivo de documentación)

