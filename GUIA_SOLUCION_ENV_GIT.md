# Guía: Solución del Problema de Archivos .env en Git

## 🔴 El Problema

Cuando intentas hacer `git push`, GitHub te bloquea porque detecta credenciales (como AWS Access Keys, tokens, etc.) en archivos `.env` que están siendo rastreados por Git.

**Error típico:**
```
remote: error: GH013: Repository rule violations found
remote: - Push cannot contain secrets
remote: - Amazon AWS Access Key ID
remote: - Amazon AWS Secret Access Key
```

## ❌ Solución Incorrecta (Lo que NO debes hacer)

**NO uses `git reset --hard` y `git push --force`** porque:
- ❌ No elimina los archivos del historial de Git
- ❌ Las credenciales siguen visibles en commits anteriores
- ❌ GitHub seguirá detectando las credenciales
- ❌ Puedes perder trabajo si no tienes cuidado
- ❌ Puedes sobrescribir trabajo de otros colaboradores

## ✅ Solución Correcta

### Paso 1: Verificar qué archivos están siendo rastreados

```bash
git ls-files | findstr ".env"
```

Si ves archivos como `.env` o `API/.env`, están siendo rastreados por Git.

### Paso 2: Asegurarse de que .gitignore está configurado correctamente

Verifica que tu `.gitignore` incluya:

```gitignore
# Variables de entorno (NUNCA subir archivos .env)
.env
.env.local
.env.*.local
.env.production
.env.development
API/.env
API/.env.local
API/.env.*.local
API/.env.production
API/.env.development
```

**Nota:** Si falta alguna entrada, agrégala al `.gitignore`.

### Paso 3: Eliminar los archivos del índice de Git (pero mantenerlos localmente)

```bash
# Eliminar .env de la raíz
git rm --cached .env

# Eliminar API/.env
git rm --cached API/.env
```

**Importante:** Esto NO elimina los archivos de tu disco, solo los quita del rastreo de Git.

### Paso 4: Reescribir el historial para eliminar los archivos de todos los commits

Esto es necesario porque aunque elimines los archivos del commit actual, siguen existiendo en commits anteriores.

```bash
git filter-branch --force --index-filter "git rm --cached --ignore-unmatch .env API/.env" --prune-empty --tag-name-filter cat -- --all
```

**Explicación:**
- `--force`: Fuerza la reescritura aunque haya cambios sin guardar
- `--index-filter`: Comando que se ejecuta en cada commit
- `git rm --cached --ignore-unmatch`: Elimina los archivos del índice (--ignore-unmatch evita errores si el archivo no existe en algún commit)
- `--prune-empty`: Elimina commits que quedan vacíos después de la operación
- `-- --all`: Aplica a todas las ramas

**Tiempo estimado:** 30-60 segundos dependiendo del tamaño del repositorio.

### Paso 5: Actualizar las referencias remotas

```bash
git fetch origin
```

### Paso 6: Hacer force push (con seguridad)

```bash
git push --force-with-lease origin main
```

**¿Por qué `--force-with-lease` y no `--force`?**
- `--force-with-lease` es más seguro: falla si alguien más hizo push mientras trabajabas
- `--force` sobrescribe todo sin verificar, puede causar pérdida de trabajo

### Paso 7: Verificar que todo está correcto

```bash
# Verificar que los archivos .env ya no están siendo rastreados
git ls-files | findstr ".env"

# Debería mostrar solo archivos de ejemplo como:
# API/env.example
```

## 📋 Checklist Completo

- [ ] Verificar archivos rastreados: `git ls-files | findstr ".env"`
- [ ] Actualizar `.gitignore` si es necesario
- [ ] Eliminar archivos del índice: `git rm --cached .env API/.env`
- [ ] Reescribir historial: `git filter-branch ...`
- [ ] Actualizar referencias: `git fetch origin`
- [ ] Hacer push seguro: `git push --force-with-lease origin main`
- [ ] Verificar que todo está bien: `git status` y `git ls-files`

## 🔒 Prevención Futura

### 1. Verificar ANTES de hacer commit

```bash
# Ver qué archivos se van a agregar
git status

# Ver archivos rastreados
git ls-files | findstr ".env"
```

### 2. Usar archivos de ejemplo

Siempre incluye archivos `.env.example` o `env.example` con valores de ejemplo:

```env
# .env.example
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=TU_ACCESS_KEY_ID_AQUI
AWS_SECRET_ACCESS_KEY=TU_SECRET_ACCESS_KEY_AQUI
AWS_S3_BUCKET_NAME=nombre-del-bucket
```

### 3. Configurar Git hooks (Opcional pero recomendado)

Crea un pre-commit hook que prevenga commits con archivos `.env`:

**Archivo: `.git/hooks/pre-commit`**
```bash
#!/bin/sh
# Prevenir commits de archivos .env

if git diff --cached --name-only | grep -E '\.env$|\.env\.'; then
    echo "❌ Error: No puedes hacer commit de archivos .env"
    echo "   Los archivos .env contienen credenciales sensibles"
    echo "   Usa archivos .env.example en su lugar"
    exit 1
fi
```

**En Windows (PowerShell):**
```powershell
# .git/hooks/pre-commit.ps1
$files = git diff --cached --name-only
if ($files -match '\.env$|\.env\.') {
    Write-Host "❌ Error: No puedes hacer commit de archivos .env" -ForegroundColor Red
    Write-Host "   Los archivos .env contienen credenciales sensibles" -ForegroundColor Yellow
    Write-Host "   Usa archivos .env.example en su lugar" -ForegroundColor Yellow
    exit 1
}
```

### 4. Si accidentalmente agregas un .env

Si te das cuenta inmediatamente (antes del push):

```bash
# Eliminar del staging area
git reset HEAD .env
git reset HEAD API/.env

# Eliminar del índice
git rm --cached .env
git rm --cached API/.env

# Verificar que .gitignore está actualizado
# Luego hacer commit normalmente
```

## 🆘 Solución Rápida (Si ya hiciste push con credenciales)

Si ya hiciste push y GitHub te está bloqueando:

1. **NO uses `git reset --hard`** (no soluciona el problema)

2. **Sigue los pasos 3-6 de la solución correcta** arriba

3. **Si es urgente y trabajas solo**, puedes usar:
   ```bash
   git push --force origin main
   ```
   Pero solo después de haber reescrito el historial con `git filter-branch`

## 📚 Comandos de Referencia Rápida

```bash
# Ver archivos rastreados
git ls-files | findstr ".env"

# Eliminar del índice (mantiene archivo local)
git rm --cached .env

# Reescribir historial completo
git filter-branch --force --index-filter "git rm --cached --ignore-unmatch .env API/.env" --prune-empty --tag-name-filter cat -- --all

# Push seguro
git push --force-with-lease origin main

# Ver estado
git status
```

## ⚠️ Advertencias Importantes

1. **Reescribir historial es destructivo**: Asegúrate de tener backups
2. **Si trabajas en equipo**: Coordina con tu equipo antes de hacer force push
3. **Las credenciales expuestas**: Si ya fueron expuestas, **rótalas inmediatamente** en AWS/GitHub/etc.
4. **Backup local**: Los archivos `.env` locales NO se eliminan, pero haz backup por si acaso

## 🔄 Comparación: Solución Incorrecta vs Correcta

| Aspecto | ❌ Reset Hard + Force Push | ✅ Filter-Branch + Force-with-Lease |
|---------|---------------------------|-------------------------------------|
| Elimina del historial | ❌ No | ✅ Sí |
| GitHub detecta credenciales | ❌ Sí (siguen ahí) | ✅ No (eliminadas) |
| Seguridad | ❌ Baja | ✅ Alta |
| Pérdida de trabajo | ⚠️ Posible | ✅ Protegido |
| Colaboración | ❌ Problemático | ✅ Seguro |

## 💡 Mejores Prácticas

1. **Nunca** agregues archivos `.env` al repositorio
2. **Siempre** usa `.env.example` como plantilla
3. **Verifica** antes de hacer commit: `git status`
4. **Documenta** las variables de entorno necesarias en el README
5. **Usa** herramientas como `git-secrets` o `truffleHog` para detectar secretos

## 📖 Recursos Adicionales

- [Git Filter-Branch Documentation](https://git-scm.com/docs/git-filter-branch)
- [GitHub: Removing sensitive data](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository)
- [Git Secrets Scanner](https://github.com/awslabs/git-secrets)

---

**Última actualización:** Noviembre 2025  
**Autor:** Guía creada para resolver problemas comunes con archivos .env en Git

