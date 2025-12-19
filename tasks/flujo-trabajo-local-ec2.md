# 🔄 Flujo de Trabajo: Local → GitHub → EC2

## 📋 Situación Actual

- **Local:** Actualizado con `origin/main` ✅
- **EC2:** 4 commits adelante de `origin/main` ⚠️
- **Objetivo:** Modificar `devops/GUIA_COMPLETA_AWS_IMPLEMENTACION.md` desde local

---

## 🎯 Plan de Acción

### Fase 1: Verificar y Sincronizar EC2 con GitHub

**Paso 1.1: Ver qué commits tiene EC2 que no están en GitHub**

En EC2, ejecuta:
```bash
# Ver los últimos 5 commits
git log --oneline -5

# Ver commits que están en EC2 pero no en GitHub
git log origin/main..HEAD --oneline
```

**Paso 1.2: Decidir qué hacer con esos commits**

**Opción A: Si los commits son importantes (recomendado)**
```bash
# En EC2, hacer push de los commits a GitHub
git push origin main
```

**Opción B: Si los commits no son importantes (solo cambios temporales)**
```bash
# En EC2, descartar los commits locales y usar versión de GitHub
git reset --hard origin/main
```

**⚠️ IMPORTANTE:** Si eliges Opción B, perderás esos 4 commits. Solo hazlo si estás seguro.

---

### Fase 2: Trabajar en Local

**Paso 2.1: Asegurar que local está actualizado**

En tu máquina local (PowerShell o WSL):
```bash
# Navegar al directorio del proyecto
cd "C:\Users\ASUS\Desktop\rescate asus\Yo\Paginas Web\Propio\Inmobiliaria Node Docker Angular"

# Verificar estado
git status

# Asegurar que estás actualizado con GitHub
git pull origin main
```

**Paso 2.2: Hacer cambios en el archivo**

Edita el archivo:
- `devops/GUIA_COMPLETA_AWS_IMPLEMENTACION.md`

**Paso 2.3: Verificar cambios**

```bash
# Ver qué archivos cambiaron
git status

# Ver los cambios específicos (opcional)
git diff devops/GUIA_COMPLETA_AWS_IMPLEMENTACION.md
```

**Paso 2.4: Hacer commit**

```bash
# Agregar el archivo modificado
git add devops/GUIA_COMPLETA_AWS_IMPLEMENTACION.md

# Hacer commit con mensaje descriptivo
git commit -m "feat: Agregar sistema de avalúos con IA a guía AWS"
```

**Paso 2.5: Hacer push a GitHub**

```bash
# Subir cambios a GitHub
git push origin main
```

---

### Fase 3: Sincronizar EC2

**Paso 3.1: Conectarse a EC2**

```bash
ssh -i ~/.ssh/inmobiliaria-key.pem ec2-user@54.147.61.191
```

**Paso 3.2: Ir al directorio del proyecto**

```bash
cd ~/inmobiliaria
```

**Paso 3.3: Verificar estado antes de pull**

```bash
# Ver estado actual
git status

# Ver si hay cambios locales sin commitear
git diff
```

**Paso 3.4: Hacer pull desde GitHub**

```bash
# Hacer pull de los cambios
git pull origin main
```

**Si hay conflictos:**
```bash
# Ver qué archivos tienen conflictos
git status

# Si el conflicto es en devops/GUIA_COMPLETA_AWS_IMPLEMENTACION.md:
# 1. Abrir el archivo y resolver conflictos manualmente
# 2. Buscar marcadores: <<<<<<< ======= >>>>>>>
# 3. Decidir qué versión mantener o combinar
# 4. Guardar el archivo
# 5. Hacer:
git add devops/GUIA_COMPLETA_AWS_IMPLEMENTACION.md
git commit -m "Merge: resolver conflictos en guía AWS"
```

**Paso 3.5: Verificar que todo está sincronizado**

```bash
# Verificar estado
git status
# Debe mostrar: "Your branch is up to date with 'origin/main'"

# Verificar que el archivo tiene los cambios
git log --oneline -3
```

---

## ✅ Checklist Final

- [ ] EC2 sincronizado con GitHub (sin commits pendientes)
- [ ] Local actualizado con `git pull origin main`
- [ ] Cambios realizados en local
- [ ] Commit hecho en local
- [ ] Push a GitHub exitoso
- [ ] Pull en EC2 exitoso
- [ ] Verificación de que cambios están en EC2

---

## 🔄 Flujo Visual

```
┌─────────┐         ┌──────────┐         ┌──────┐
│  LOCAL  │ ────►  │  GITHUB  │  ────►  │ EC2  │
│         │  push   │          │  pull   │      │
└─────────┘         └──────────┘         └──────┘
```

**Orden correcto:**
1. Local → GitHub (push)
2. GitHub → EC2 (pull)

**❌ NUNCA:**
- EC2 → Local directamente
- Editar en EC2 y luego intentar mergear con local

---

## 🚨 Solución de Problemas

### Problema: "Your branch is ahead of 'origin/main' by X commits" en EC2

**Solución:**
```bash
# En EC2, hacer push primero
git push origin main

# Luego hacer pull
git pull origin main
```

### Problema: "Merge conflict" al hacer pull en EC2

**Solución:**
```bash
# Ver archivos con conflictos
git status

# Resolver conflictos manualmente
nano archivo-con-conflicto

# Después de resolver:
git add archivo-resuelto
git commit -m "Merge: resolver conflictos"
```

### Problema: "Updates were rejected" al hacer push

**Solución:**
```bash
# Primero hacer pull
git pull origin main

# Resolver conflictos si los hay
# Luego hacer push
git push origin main
```

---

## 📝 Notas Importantes

1. **Siempre trabajar en LOCAL primero**
2. **Siempre hacer push a GitHub antes de pull en EC2**
3. **GitHub es la fuente única de verdad**
4. **No editar código directamente en EC2** (excepto configuraciones como .env)
5. **Verificar estado con `git status` antes de cada operación**

---

## 🎯 Comandos Rápidos de Referencia

**En Local:**
```bash
git status                    # Ver estado
git add archivo               # Agregar archivo
git commit -m "mensaje"       # Hacer commit
git push origin main          # Subir a GitHub
```

**En EC2:**
```bash
git status                    # Ver estado
git pull origin main          # Bajar cambios de GitHub
```

---

## ✅ Resultado Esperado

Después de seguir estos pasos:
- ✅ Cambios en `devops/GUIA_COMPLETA_AWS_IMPLEMENTACION.md` están en GitHub
- ✅ EC2 tiene los mismos cambios que GitHub
- ✅ No hay conflictos ni commits divergentes
- ✅ Todo está sincronizado

