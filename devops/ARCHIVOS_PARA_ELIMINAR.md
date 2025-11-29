# 🗑️ Lista de Archivos que se Pueden Eliminar

## ⚠️ IMPORTANTE
**Todos estos archivos fueron útiles durante el despliegue pero ya no son necesarios** ya que la aplicación está funcionando correctamente en AWS. Puedes eliminarlos de forma segura.

---

## 📋 Scripts de Despliegue (Pueden Eliminarse)

### Scripts Principales de Despliegue
- ✅ `desplegar-aws.sh` - Script maestro (ya ejecutado exitosamente)
- ✅ `paso-1-security-groups.sh` - Creación de Security Groups (ya completado)
- ✅ `paso-2-alb-target-groups.sh` - Creación de ALB y Target Groups (ya completado)
- ✅ `paso-3-actualizar-security-groups.sh` - Actualización de Security Groups (ya completado)
- ✅ `paso-4-crear-services.sh` - Creación de ECS Services (ya completado)

**Razón**: La infraestructura ya está creada. Si necesitas recrearla, puedes usar la consola AWS o los comandos documentados en `RESUMEN_COMPLETO_DESPLIEGUE.md`.

### Scripts de Corrección y Troubleshooting
- ✅ `corregir-y-redesplegar.sh` - Corrección de IAM (ya resuelto)
- ✅ `crear-log-groups.sh` - Creación de log groups (ya creados)
- ✅ `redesplegar-services.sh` - Redespliegue de servicios (ya ejecutado)
- ✅ `corregir-health-check-api.sh` - Corrección de health check (ya corregido)
- ✅ `corregir-health-check-final.sh` - Corrección final de health check (ya corregido)
- ✅ `redesplegar-api-con-health.sh` - Redespliegue con health endpoint (ya ejecutado)
- ✅ `actualizar-api-url.sh` - Actualización de API_URL (ya actualizado)
- ✅ `actualizar-api-url-simple.sh` - Versión simple (ya actualizado)
- ✅ `actualizar-api-url-manual.sh` - Versión manual (ya actualizado)
- ✅ `redesplegar-frontend.sh` - Redespliegue de frontend (ya ejecutado)

**Razón**: Los problemas ya están resueltos. Si necesitas hacer cambios similares en el futuro, puedes usar los comandos AWS directamente o consultar el resumen.

### Scripts de Diagnóstico
- ✅ `diagnosticar-services.sh` - Diagnóstico de servicios
- ✅ `diagnostico-completo-api.sh` - Diagnóstico completo de API
- ✅ `diagnosticar-api-503.sh` - Diagnóstico de error 503

**Razón**: Útiles para troubleshooting pero no necesarios para el funcionamiento normal. Puedes recrearlos si los necesitas usando los comandos documentados.

### Scripts de Verificación
- ✅ `verificar-rol-ecs.sh` - Verificación de rol IAM
- ✅ `verificar-usuarios-db.sh` - Verificación de usuarios en DB
- ✅ `verificar-api-health.sh` - Verificación de health checks
- ✅ `verificar-api-targets.sh` - Verificación de targets
- ✅ `verificar-imagenes-ecr.sh` - Verificación de imágenes ECR
- ✅ `obtener-security-groups.sh` - Obtención de Security Groups

**Razón**: Útiles para verificación pero puedes usar comandos AWS directamente.

### Scripts de Seed y Migraciones
- ✅ `ejecutar-seed-aws.sh` - Ejecución de seed (versión completa)
- ✅ `ejecutar-seed-aws-simple.sh` - Ejecución de seed (versión simple)
- ✅ `consultar-base-datos.sh` - Consulta de base de datos

**Razón**: Puedes ejecutar `npm run seed-with-migrations` directamente desde `API/`. Los scripts son solo wrappers.

### Scripts en Carpeta `scripts/`
- ✅ `scripts/build-frontend-with-env.sh`
- ✅ `scripts/deploy-complete.sh`
- ✅ `scripts/deploy-to-ecr.sh`
- ✅ `scripts/setup-aws-resources.sh`

**Razón**: Scripts auxiliares que ya no se usan.

---

## 📄 Documentación Temporal (Pueden Eliminarse)

### Guías de Despliegue Temporales
- ✅ `GUIA_DESPLIEGUE_AWS.md` - Guía inicial (reemplazada por `RESUMEN_COMPLETO_DESPLIEGUE.md`)
- ✅ `INSTRUCCIONES_DESPLIEGUE.md` - Instrucciones temporales
- ✅ `GUIA_AWS_S3.md` - Guía específica de S3 (si no la necesitas)
- ✅ `SOLUCION_COMMIT_VARIABLES_SENSIBLES.md` - Solución temporal (ya resuelto)
- ✅ `SOLUCION_ERROR_AUTENTICACION.md` - Solución temporal (ya resuelto)

**Razón**: La información importante está consolidada en `RESUMEN_COMPLETO_DESPLIEGUE.md`.

**⚠️ MANTENER**: `RESUMEN_DESPLIEGUE_AWS.md` - Contiene información importante del estado inicial (pero está en `.gitignore` por contener información sensible)

---

## 🗂️ Archivos Temporales y de Configuración

### Archivos Temporales
- ✅ `temp_ecs_sg.json` - Archivo temporal de configuración
- ✅ `test-endpoints.js` - Script de prueba temporal
- ✅ `ecr list-images --repository-name inmobiliaria-frontendqq` - Archivo accidental (comando mal ejecutado)

### Archivos de Instalación AWS CLI
- ✅ `awscliv2.zip` - Instalador de AWS CLI (ya instalado)
- ✅ `aws/dist/` - Directorio de instalación de AWS CLI (ya instalado)
- ✅ `aws/install` - Script de instalación (ya instalado)
- ✅ `aws/THIRD_PARTY_LICENSES` - Licencias de AWS CLI

**Razón**: Ya no necesitas estos archivos de instalación.

**⚠️ MANTENER**: 
- `aws/*.json` - Archivos de configuración de Task Definitions (pueden ser útiles)
- `aws/README.md` - Documentación si existe

---

## 📝 Archivos de Configuración Sensibles (NO ELIMINAR, pero agregar a .gitignore)

### Archivos con Información Sensible
- ⚠️ `devops/valores-aws-config.txt` - **NO ELIMINAR** pero agregar a `.gitignore`
  - Contiene: VPC ID, Subnet IDs, Security Group IDs, Endpoints, Account ID
  - Es útil para referencia local pero no debe estar en Git

---

## ✅ Archivos que DEBES MANTENER

### Documentación Importante
- ✅ `RESUMEN_COMPLETO_DESPLIEGUE.md` - **MANTENER** - Resumen completo del proceso
- ✅ `ARCHIVOS_PARA_ELIMINAR.md` - **MANTENER** - Esta lista (útil para referencia)

### Archivos de Configuración del Proyecto
- ✅ `docker-compose.yml` - Para desarrollo local
- ✅ `devops/docker-restart-with-seed.bat` - Para desarrollo local
- ✅ `devops/docker-start-safe.bat` - Para desarrollo local
- ✅ `.gitignore` - Configuración de Git
- ✅ `env.example` - Ejemplo de variables de entorno

### Archivos de la Aplicación
- ✅ Todo en `API/` (excepto `node_modules/`, `.env`, etc.)
- ✅ Todo en `Front/` (excepto `node_modules/`, `dist/`, etc.)
- ✅ `aws/*.json` - Task Definitions (pueden ser útiles para referencia)

---

## 🚀 Comando para Eliminar Archivos

### Opción 1: Eliminar Individualmente
Puedes eliminar los archivos manualmente desde tu explorador de archivos o IDE.

### Opción 2: Eliminar con Git (si están en el repositorio)
```bash
# Eliminar scripts de despliegue
git rm desplegar-aws.sh paso-*.sh corregir-*.sh redesplegar-*.sh actualizar-*.sh diagnosticar-*.sh verificar-*.sh ejecutar-*.sh consultar-*.sh obtener-*.sh

# Eliminar scripts en carpeta scripts/
git rm scripts/*.sh

# Eliminar documentación temporal
git rm GUIA_DESPLIEGUE_AWS.md INSTRUCCIONES_DESPLIEGUE.md GUIA_AWS_S3.md SOLUCION_*.md

# Eliminar archivos temporales
git rm temp_*.json test-endpoints.js "ecr list-images --repository-name inmobiliaria-frontendqq"

# Eliminar instaladores AWS CLI
git rm awscliv2.zip
git rm -r aws/dist/ aws/install aws/THIRD_PARTY_LICENSES
```

### Opción 3: Eliminar desde Terminal (Windows/WSL)
```bash
# Desde WSL (Ubuntu)
rm desplegar-aws.sh paso-*.sh corregir-*.sh redesplegar-*.sh actualizar-*.sh diagnosticar-*.sh verificar-*.sh ejecutar-*.sh consultar-*.sh obtener-*.sh
rm scripts/*.sh
rm GUIA_DESPLIEGUE_AWS.md INSTRUCCIONES_DESPLIEGUE.md GUIA_AWS_S3.md SOLUCION_*.md
rm temp_*.json test-endpoints.js
rm awscliv2.zip
rm -rf aws/dist/ aws/install aws/THIRD_PARTY_LICENSES
```

---

## 📊 Resumen de Archivos a Eliminar

### Total de Scripts: ~31 archivos
- Scripts de despliegue: 5
- Scripts de corrección: 10
- Scripts de diagnóstico: 3
- Scripts de verificación: 6
- Scripts de seed: 3
- Scripts en carpeta scripts/: 4

### Total de Documentación: ~5 archivos
- Guías temporales: 5

### Total de Archivos Temporales: ~5 archivos
- Archivos temporales: 3
- Instaladores AWS CLI: 2

**Total aproximado: ~41 archivos**

---

## ⚠️ Antes de Eliminar

1. **Verifica que la aplicación esté funcionando correctamente** en AWS
2. **Revisa `RESUMEN_COMPLETO_DESPLIEGUE.md`** para asegurarte de tener toda la información importante
3. **Haz un backup** si no estás seguro (puedes crear una rama en Git)
4. **Agrega `valores-aws-config.txt` a `.gitignore`** antes de hacer commit

---

## ✅ Después de Eliminar

1. Actualiza `.gitignore` con los archivos sensibles
2. Haz commit de los cambios
3. Haz push al repositorio
4. Disfruta de una estructura de carpetas más limpia! 🎉

