# 🚀 Despliegue Rápido a AWS - Comandos para WSL

Este archivo contiene los comandos necesarios para actualizar la aplicación en AWS después de hacer cambios locales.

## 📋 Requisitos Previos

```bash
# Verificar que AWS CLI esté instalado
aws --version

# Verificar que Docker esté corriendo
docker --version

# Verificar credenciales AWS configuradas
aws sts get-caller-identity
```

## 🔧 Variables de Entorno (configurar antes de ejecutar)

```bash
# Configuración AWS
export AWS_REGION="us-east-1"
export AWS_ACCOUNT_ID="057286248736"

# Nombres de recursos
export ECR_API_REPO="inmobiliaria-api"
export ECR_FRONTEND_REPO="inmobiliaria-frontend"
export ECS_CLUSTER="inmobiliaria-cluster"
export ECS_API_SERVICE="inmobiliaria-api-service"
export ECS_FRONTEND_SERVICE="inmobiliaria-frontend-service"

# URIs de ECR
export ECR_API_URI="$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_API_REPO"
export ECR_FRONTEND_URI="$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_FRONTEND_REPO"
```

---

## 📦 OPCIÓN 1: Actualizar SOLO el Frontend (más común)

Usa esta opción cuando solo hayas hecho cambios en el frontend (Angular).

```bash
# ==========================================
# PASO 1: Navegar al proyecto (desde WSL)
# ==========================================
cd "/mnt/c/Users/ASUS/Desktop/rescate asus/Yo/Paginas Web/Propio/Inmobiliaria Node Docker Angular"

# ==========================================
# PASO 2: Configurar variables
# ==========================================
export AWS_REGION="us-east-1"
export AWS_ACCOUNT_ID="057286248736"
export ECR_FRONTEND_URI="$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/inmobiliaria-frontend"

# ==========================================
# PASO 3: Login en ECR
# ==========================================
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com

# ==========================================
# PASO 4: Compilar Frontend para producción
# ==========================================
cd Front
npm run build

# ==========================================
# PASO 5: Construir imagen Docker
# ==========================================
docker build -t inmobiliaria-frontend:latest .

# ==========================================
# PASO 6: Etiquetar imagen para ECR
# ==========================================
docker tag inmobiliaria-frontend:latest $ECR_FRONTEND_URI:latest

# ==========================================
# PASO 7: Subir imagen a ECR
# ==========================================
docker push $ECR_FRONTEND_URI:latest

# ==========================================
# PASO 8: Forzar nuevo despliegue en ECS
# ==========================================
aws ecs update-service \
  --cluster inmobiliaria-cluster \
  --service inmobiliaria-frontend-service \
  --force-new-deployment \
  --region $AWS_REGION

# ==========================================
# PASO 9: Verificar despliegue
# ==========================================
echo "⏳ Esperando a que el despliegue complete..."
aws ecs wait services-stable \
  --cluster inmobiliaria-cluster \
  --services inmobiliaria-frontend-service \
  --region $AWS_REGION

echo "✅ Despliegue del Frontend completado!"

# Verificar estado del servicio
aws ecs describe-services \
  --cluster inmobiliaria-cluster \
  --services inmobiliaria-frontend-service \
  --query 'services[0].[serviceName,status,runningCount,desiredCount]' \
  --output table \
  --region $AWS_REGION
```

---

## 📦 OPCIÓN 2: Actualizar SOLO la API (Backend)

Usa esta opción cuando solo hayas hecho cambios en la API (Node.js/Express).

```bash
# ==========================================
# PASO 1: Navegar al proyecto (desde WSL)
# ==========================================
cd "/mnt/c/Users/ASUS/Desktop/rescate asus/Yo/Paginas Web/Propio/Inmobiliaria Node Docker Angular"

# ==========================================
# PASO 2: Configurar variables
# ==========================================
export AWS_REGION="us-east-1"
export AWS_ACCOUNT_ID="057286248736"
export ECR_API_URI="$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/inmobiliaria-api"

# ==========================================
# PASO 3: Login en ECR
# ==========================================
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com

# ==========================================
# PASO 4: Construir imagen Docker de API
# ==========================================
cd API
docker build -t inmobiliaria-api:latest .

# ==========================================
# PASO 5: Etiquetar imagen para ECR
# ==========================================
docker tag inmobiliaria-api:latest $ECR_API_URI:latest

# ==========================================
# PASO 6: Subir imagen a ECR
# ==========================================
docker push $ECR_API_URI:latest

# ==========================================
# PASO 7: Forzar nuevo despliegue en ECS
# ==========================================
aws ecs update-service \
  --cluster inmobiliaria-cluster \
  --service inmobiliaria-api-service \
  --force-new-deployment \
  --region $AWS_REGION

# ==========================================
# PASO 8: Verificar despliegue
# ==========================================
echo "⏳ Esperando a que el despliegue complete..."
aws ecs wait services-stable \
  --cluster inmobiliaria-cluster \
  --services inmobiliaria-api-service \
  --region $AWS_REGION

echo "✅ Despliegue de la API completado!"

# Verificar estado del servicio
aws ecs describe-services \
  --cluster inmobiliaria-cluster \
  --services inmobiliaria-api-service \
  --query 'services[0].[serviceName,status,runningCount,desiredCount]' \
  --output table \
  --region $AWS_REGION
```

---

## 📦 OPCIÓN 3: Actualizar TODO (Frontend + API)

Usa esta opción cuando hayas hecho cambios en ambos (frontend y backend).

```bash
# ==========================================
# CONFIGURACIÓN INICIAL
# ==========================================
cd "/mnt/c/Users/ASUS/Desktop/rescate asus/Yo/Paginas Web/Propio/Inmobiliaria Node Docker Angular"

export AWS_REGION="us-east-1"
export AWS_ACCOUNT_ID="057286248736"
export ECR_API_URI="$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/inmobiliaria-api"
export ECR_FRONTEND_URI="$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/inmobiliaria-frontend"

# ==========================================
# LOGIN EN ECR
# ==========================================
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com

# ==========================================
# CONSTRUIR Y SUBIR FRONTEND
# ==========================================
echo "📦 Construyendo Frontend..."
cd Front
npm run build
docker build -t inmobiliaria-frontend:latest .
docker tag inmobiliaria-frontend:latest $ECR_FRONTEND_URI:latest
docker push $ECR_FRONTEND_URI:latest
cd ..

# ==========================================
# CONSTRUIR Y SUBIR API
# ==========================================
echo "📦 Construyendo API..."
cd API
docker build -t inmobiliaria-api:latest .
docker tag inmobiliaria-api:latest $ECR_API_URI:latest
docker push $ECR_API_URI:latest
cd ..

# ==========================================
# DESPLEGAR EN ECS
# ==========================================
echo "🚀 Desplegando servicios..."

# Desplegar API
aws ecs update-service \
  --cluster inmobiliaria-cluster \
  --service inmobiliaria-api-service \
  --force-new-deployment \
  --region $AWS_REGION

# Desplegar Frontend
aws ecs update-service \
  --cluster inmobiliaria-cluster \
  --service inmobiliaria-frontend-service \
  --force-new-deployment \
  --region $AWS_REGION

# ==========================================
# VERIFICAR DESPLIEGUE
# ==========================================
echo "⏳ Esperando a que los despliegues completen..."

aws ecs wait services-stable \
  --cluster inmobiliaria-cluster \
  --services inmobiliaria-api-service inmobiliaria-frontend-service \
  --region $AWS_REGION

echo "✅ Ambos servicios desplegados!"

# Mostrar estado
aws ecs describe-services \
  --cluster inmobiliaria-cluster \
  --services inmobiliaria-api-service inmobiliaria-frontend-service \
  --query 'services[*].[serviceName,status,runningCount]' \
  --output table \
  --region $AWS_REGION
```

---

## 🔍 Comandos de Verificación

### Ver estado de los servicios

```bash
aws ecs describe-services \
  --cluster inmobiliaria-cluster \
  --services inmobiliaria-api-service inmobiliaria-frontend-service \
  --query 'services[*].[serviceName,status,runningCount,desiredCount]' \
  --output table \
  --region us-east-1
```

### Ver URL del ALB

```bash
aws elbv2 describe-load-balancers \
  --names inmobiliaria-alb \
  --query 'LoadBalancers[0].DNSName' \
  --output text \
  --region us-east-1
```

### Ver health de los servicios

```bash
# Health de API Target Group
aws elbv2 describe-target-health \
  --target-group-arn $(aws elbv2 describe-target-groups --names inmobiliaria-api-tg --query 'TargetGroups[0].TargetGroupArn' --output text --region us-east-1) \
  --region us-east-1

# Health de Frontend Target Group
aws elbv2 describe-target-health \
  --target-group-arn $(aws elbv2 describe-target-groups --names inmobiliaria-frontend-tg --query 'TargetGroups[0].TargetGroupArn' --output text --region us-east-1) \
  --region us-east-1
```

### Ver logs de los servicios

```bash
# Logs de API (últimos 10 minutos)
aws logs tail /ecs/inmobiliaria-api --since 10m --region us-east-1

# Logs de Frontend (últimos 10 minutos)
aws logs tail /ecs/inmobiliaria-frontend --since 10m --region us-east-1

# Seguir logs en tiempo real
aws logs tail /ecs/inmobiliaria-api --follow --region us-east-1
```

---

## 🛠️ Script de Despliegue Automatizado

Crea un archivo `deploy.sh` para automatizar el proceso:

```bash
#!/bin/bash
# deploy.sh - Script de despliegue automático

set -e  # Detener en caso de error

# Colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Configuración
AWS_REGION="us-east-1"
AWS_ACCOUNT_ID="057286248736"
ECR_API_URI="$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/inmobiliaria-api"
ECR_FRONTEND_URI="$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/inmobiliaria-frontend"

# Función para mostrar ayuda
show_help() {
    echo "Uso: ./deploy.sh [frontend|api|all]"
    echo ""
    echo "Opciones:"
    echo "  frontend  - Despliega solo el frontend"
    echo "  api       - Despliega solo la API"
    echo "  all       - Despliega frontend y API"
    exit 0
}

# Login en ECR
login_ecr() {
    echo -e "${YELLOW}🔐 Iniciando sesión en ECR...${NC}"
    aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com
}

# Desplegar Frontend
deploy_frontend() {
    echo -e "${YELLOW}📦 Construyendo Frontend...${NC}"
    cd Front
    npm run build
    docker build -t inmobiliaria-frontend:latest .
    docker tag inmobiliaria-frontend:latest $ECR_FRONTEND_URI:latest
    
    echo -e "${YELLOW}📤 Subiendo imagen a ECR...${NC}"
    docker push $ECR_FRONTEND_URI:latest
    
    echo -e "${YELLOW}🚀 Desplegando en ECS...${NC}"
    aws ecs update-service \
      --cluster inmobiliaria-cluster \
      --service inmobiliaria-frontend-service \
      --force-new-deployment \
      --region $AWS_REGION
    cd ..
    
    echo -e "${GREEN}✅ Frontend desplegado!${NC}"
}

# Desplegar API
deploy_api() {
    echo -e "${YELLOW}📦 Construyendo API...${NC}"
    cd API
    docker build -t inmobiliaria-api:latest .
    docker tag inmobiliaria-api:latest $ECR_API_URI:latest
    
    echo -e "${YELLOW}📤 Subiendo imagen a ECR...${NC}"
    docker push $ECR_API_URI:latest
    
    echo -e "${YELLOW}🚀 Desplegando en ECS...${NC}"
    aws ecs update-service \
      --cluster inmobiliaria-cluster \
      --service inmobiliaria-api-service \
      --force-new-deployment \
      --region $AWS_REGION
    cd ..
    
    echo -e "${GREEN}✅ API desplegada!${NC}"
}

# Verificar estado
check_status() {
    echo -e "${YELLOW}🔍 Verificando estado de los servicios...${NC}"
    aws ecs describe-services \
      --cluster inmobiliaria-cluster \
      --services inmobiliaria-api-service inmobiliaria-frontend-service \
      --query 'services[*].[serviceName,status,runningCount,desiredCount]' \
      --output table \
      --region $AWS_REGION
}

# Main
case "$1" in
    frontend)
        login_ecr
        deploy_frontend
        check_status
        ;;
    api)
        login_ecr
        deploy_api
        check_status
        ;;
    all)
        login_ecr
        deploy_frontend
        deploy_api
        check_status
        ;;
    help|-h|--help)
        show_help
        ;;
    *)
        echo -e "${RED}Error: Opción no válida${NC}"
        show_help
        ;;
esac
```

### Uso del script:

```bash
# Desde la raíz del proyecto, dar permisos de ejecución
chmod +x devops/deploy.sh

# Desplegar solo frontend
./devops/deploy.sh frontend

# Desplegar solo API
./devops/deploy.sh api

# Desplegar todo
./devops/deploy.sh all
```

---

## ⚠️ Notas Importantes

1. **Tiempo de despliegue**: El proceso completo puede tomar 3-5 minutos por servicio.

2. **Docker en WSL**: Si usas Docker Desktop para Windows, asegúrate de tener habilitada la integración con WSL.

3. **Credenciales AWS**: Las credenciales deben estar configuradas en `~/.aws/credentials` o mediante variables de entorno.

4. **Build del Frontend**: El comando `npm run build` genera los archivos en `dist/`. El Dockerfile los copia al contenedor nginx.

5. **Rollback**: Si algo sale mal, puedes volver a la versión anterior:
   ```bash
   aws ecs update-service \
     --cluster inmobiliaria-cluster \
     --service inmobiliaria-frontend-service \
     --task-definition inmobiliaria-frontend:REVISION_ANTERIOR \
     --region us-east-1
   ```

---

## 📚 Referencias

- **Documentación completa**: `devops/RESUMEN_DESPLIEGUE_AWS.md`
- **Task Definitions**: `aws/ecs-api-task-definition.json`, `aws/ecs-frontend-task-definition.json`
- **README AWS**: `aws/README.md`
- **Script de despliegue**: `devops/deploy.sh`

---

**Última actualización**: Noviembre 2025
**Autor**: Documentación de despliegue AWS para Inmobiliaria Hamilton Ortega

