# 🔒 Guía: Corregir Commits con Variables Sensibles

## ⚠️ Problema
Has hecho un commit que contiene variables sensibles (API keys, contraseñas, tokens, etc.) y no puedes hacer `git push`. No quieres perder tu trabajo importante.

## 🎯 CASO ESPECÍFICO: Carpeta `aws/dist/` en el Repositorio

Si tu problema es que la carpeta `aws/dist/` (instalador de AWS CLI) está siendo rastreada por Git:

### Solución Rápida:
```bash
# 1. Deshacer el último commit (manteniendo cambios)
git reset --soft HEAD~1

# 2. Remover aws/dist/ del índice de Git
git rm -r --cached aws/dist/

# 3. Verificar que .gitignore tiene aws/dist/
# (Ya está actualizado en tu proyecto)

# 4. Hacer nuevo commit limpio
git add .gitignore
git commit -m "chore: remove aws/dist from repository and update gitignore"

# 5. Push
git push
```

**Nota:** Los archivos JSON de task definitions (`aws/*.json`) y `aws/README.md` se mantendrán porque están excluidos del `.gitignore`.

## ✅ Solución Recomendada: `git reset --soft`

Esta es la mejor opción cuando el commit problemático es el **último commit** y quieres mantener todos tus cambios.

### Paso 1: Deshacer el último commit (manteniendo cambios)
```bash
git reset --soft HEAD~1
```
**¿Qué hace esto?**
- Deshace el último commit
- **Mantiene todos tus cambios** en staging (listos para commit)
- No pierdes ningún trabajo

### Paso 2: Verificar que los cambios están guardados
```bash
git status
```
Deberías ver todos tus archivos modificados en staging (en verde).

### Paso 3: Remover las variables sensibles
Edita los archivos que contienen información sensible y:
- Elimina las variables
- O reemplázalas con placeholders como `process.env.VARIABLE_NAME`
- O usa un archivo `.env` que esté en `.gitignore`

### Paso 4: Verificar que no hay variables sensibles

**En Windows (CMD):**
```cmd
git diff --cached | findstr /i "password secret key token api"
```

**En Windows (PowerShell):**
```powershell
git diff --cached | Select-String -Pattern "password|secret|key|token|api" -CaseSensitive:$false
```

**En Linux/Mac:**
```bash
git diff --cached | grep -i "password\|secret\|key\|token\|api"
```

### Paso 5: Hacer un nuevo commit limpio
```bash
git commit -m "Tu mensaje de commit sin variables sensibles"
```

### Paso 6: Hacer push
```bash
git push
```

---

## 🔄 Alternativa: Si el commit problemático NO es el último

Si el commit con variables sensibles está más atrás en el historial:

### Opción A: Rebase interactivo (recomendado)
```bash
# Ver los últimos commits
git log --oneline

# Hacer rebase interactivo (ej: últimos 3 commits)
git rebase -i HEAD~3
```

En el editor que se abre:
1. Cambia `pick` por `edit` en el commit problemático
2. Guarda y cierra
3. Edita los archivos para remover variables sensibles
4. Ejecuta: `git add .`
5. Ejecuta: `git commit --amend`
6. Ejecuta: `git rebase --continue`

### Opción B: Nuevo commit que corrige
Si prefieres no modificar el historial:
```bash
# Remover las variables sensibles de los archivos
# Luego hacer un nuevo commit
git add .
git commit -m "fix: remove sensitive variables"
git push
```

**⚠️ Nota:** Esta opción deja las variables en el historial, pero las corrige en el código actual.

---

## 🗑️ Remover Archivos Ya Rastreados por Git

Si ya commiteaste archivos que no deberían estar en el repositorio (como `aws/dist/`):

### Paso 1: Agregar al .gitignore
Edita `.gitignore` y agrega los patrones que quieres ignorar:
```
aws/dist/
aws/install
```

### Paso 2: Remover del índice de Git (sin borrar localmente)
```bash
# Remover carpeta completa del índice
git rm -r --cached aws/dist/

# O remover archivo específico
git rm --cached aws/install
```

**¿Qué hace `--cached`?**
- Remueve los archivos del índice de Git
- **NO borra** los archivos de tu disco local
- Los archivos seguirán existiendo en tu computadora

### Paso 3: Hacer commit de los cambios
```bash
git add .gitignore
git commit -m "chore: remove aws/dist from repository"
git push
```

### Paso 4: (Opcional) Borrar archivos localmente
Si quieres borrar los archivos de tu disco también:
```bash
# Windows
rmdir /s /q aws\dist

# Linux/Mac
rm -rf aws/dist
```

---

## 🛡️ Prevención Futura

### 1. Crear/actualizar `.gitignore`
Asegúrate de tener estos archivos en `.gitignore`:
```
.env
.env.local
.env.*.local
*.key
*.pem
secrets/
config/secrets.json
```

### 2. Usar variables de entorno
Nunca hardcodees variables sensibles. Usa:
```javascript
// ❌ MAL
const apiKey = "sk-1234567890abcdef";

// ✅ BIEN
const apiKey = process.env.API_KEY;
```

### 3. Pre-commit hook (opcional)
Puedes instalar herramientas como `git-secrets` o `husky` para prevenir commits con información sensible.

---

## 🚨 Si ya hiciste push del commit problemático

Si el commit ya está en el repositorio remoto:

### Opción 1: Force push (solo si trabajas solo)
```bash
# Después de corregir con reset --soft
git push --force
```

**⚠️ ADVERTENCIA:** Solo usa `--force` si:
- Trabajas solo en la rama
- Nadie más ha hecho pull de esos cambios
- Estás seguro de lo que haces

### Opción 2: Nuevo commit que revierte
```bash
# Crear un commit que elimina las variables
# (las variables seguirán en el historial, pero estarán corregidas)
git commit -m "fix: remove sensitive data"
git push
```

### Opción 3: Rotar las credenciales
Si las variables ya están expuestas:
1. Cambia todas las contraseñas/keys inmediatamente
2. Revoca los tokens expuestos
3. Luego corrige el código

---

## 📋 Resumen Rápido (Tu Caso Actual)

Como tu commit problemático es el último y tienes trabajo importante:

```bash
# 1. Deshacer commit manteniendo cambios
git reset --soft HEAD~1

# 2. Editar archivos para remover variables sensibles
# (edita manualmente los archivos)

# 3. Verificar cambios
git status

# 4. Nuevo commit limpio
git add .
git commit -m "feat: tu descripción del cambio"

# 5. Push
git push
```

---

## 💡 Comandos Útiles

**En Windows (CMD):**
```cmd
# Ver qué archivos cambiaron en el último commit
git show --name-only HEAD

# Ver el contenido del último commit
git show HEAD

# Ver diferencias antes de commitear
git diff --cached

# Buscar texto en todos los commits
git log -S "password" --source --all

# Buscar archivos rastreados por Git
git ls-files | findstr /i "\.env"
```

**En Linux/Mac:**
```bash
# Ver qué archivos cambiaron en el último commit
git show --name-only HEAD

# Ver el contenido del último commit
git show HEAD

# Ver diferencias antes de commitear
git diff --cached

# Buscar texto en todos los commits
git log -S "password" --source --all
```

---

## ⚡ Comando Rápido de Rescate

Si necesitas una solución rápida y el commit problemático es el último:

```bash
git reset --soft HEAD~1 && echo "✅ Commit deshecho. Edita los archivos y luego: git add . && git commit -m 'mensaje' && git push"
```

---

**Última actualización:** 2025-11-27
**Creado para:** Resolver commits con variables sensibles sin perder trabajo

