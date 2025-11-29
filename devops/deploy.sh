#!/bin/bash
# ============================================================
# deploy.sh - Script de despliegue automático a AWS
# Inmobiliaria Hamilton Ortega
# ============================================================
# Uso: ./devops/deploy.sh [frontend|api|all]
# ============================================================

set -e  # Detener en caso de error

# Obtener directorio raíz del proyecto (un nivel arriba de devops/)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
cd "$PROJECT_ROOT"

# Colores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# ============================================================
# CONFIGURACIÓN - Ajustar según tu entorno
# ============================================================
AWS_REGION="us-east-1"
AWS_ACCOUNT_ID="057286248736"
ECS_CLUSTER="inmobiliaria-cluster"
ECS_API_SERVICE="inmobiliaria-api-service"
ECS_FRONTEND_SERVICE="inmobiliaria-frontend-service"
ECR_API_REPO="inmobiliaria-api"
ECR_FRONTEND_REPO="inmobiliaria-frontend"

# URIs de ECR
ECR_API_URI="$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_API_REPO"
ECR_FRONTEND_URI="$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_FRONTEND_REPO"

# ============================================================
# FUNCIONES
# ============================================================

# Mostrar ayuda
show_help() {
    echo ""
    echo -e "${BLUE}============================================================${NC}"
    echo -e "${BLUE}   SCRIPT DE DESPLIEGUE - Inmobiliaria AWS${NC}"
    echo -e "${BLUE}============================================================${NC}"
    echo ""
    echo "Uso: ./devops/deploy.sh [OPCIÓN]"
    echo ""
    echo "Opciones disponibles:"
    echo "  frontend    Despliega solo el frontend (Angular)"
    echo "  api         Despliega solo la API (Node.js/Express)"
    echo "  all         Despliega frontend y API"
    echo "  status      Muestra el estado de los servicios"
    echo "  logs-api    Muestra logs de la API"
    echo "  logs-front  Muestra logs del Frontend"
    echo "  help        Muestra esta ayuda"
    echo ""
    echo "Ejemplos:"
    echo "  ./deploy.sh frontend    # Solo frontend"
    echo "  ./deploy.sh api         # Solo API"
    echo "  ./deploy.sh all         # Todo"
    echo ""
    exit 0
}

# Verificar requisitos
check_requirements() {
    echo -e "${YELLOW}🔍 Verificando requisitos...${NC}"
    
    # Verificar AWS CLI
    if ! command -v aws &> /dev/null; then
        echo -e "${RED}❌ Error: AWS CLI no está instalado${NC}"
        exit 1
    fi
    
    # Verificar Docker
    if ! command -v docker &> /dev/null; then
        echo -e "${RED}❌ Error: Docker no está instalado${NC}"
        exit 1
    fi
    
    # Verificar credenciales AWS
    if ! aws sts get-caller-identity &> /dev/null; then
        echo -e "${RED}❌ Error: Credenciales AWS no configuradas${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ Requisitos verificados${NC}"
}

# Login en ECR
login_ecr() {
    echo -e "${YELLOW}🔐 Iniciando sesión en ECR...${NC}"
    aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com
    echo -e "${GREEN}✅ Sesión iniciada en ECR${NC}"
}

# Desplegar Frontend
deploy_frontend() {
    echo ""
    echo -e "${BLUE}============================================================${NC}"
    echo -e "${BLUE}   DESPLEGANDO FRONTEND${NC}"
    echo -e "${BLUE}============================================================${NC}"
    echo ""
    
    # Guardar directorio actual
    CURRENT_DIR=$(pwd)
    
    # Ir al directorio Front
    cd Front
    
    echo -e "${YELLOW}📦 Compilando Frontend para producción...${NC}"
    npm run build
    
    echo -e "${YELLOW}🐳 Construyendo imagen Docker...${NC}"
    docker build -t inmobiliaria-frontend:latest .
    
    echo -e "${YELLOW}🏷️  Etiquetando imagen...${NC}"
    docker tag inmobiliaria-frontend:latest $ECR_FRONTEND_URI:latest
    
    echo -e "${YELLOW}📤 Subiendo imagen a ECR...${NC}"
    docker push $ECR_FRONTEND_URI:latest
    
    echo -e "${YELLOW}🚀 Actualizando servicio en ECS...${NC}"
    aws ecs update-service \
      --cluster $ECS_CLUSTER \
      --service $ECS_FRONTEND_SERVICE \
      --force-new-deployment \
      --region $AWS_REGION \
      --no-cli-pager
    
    # Volver al directorio original
    cd "$CURRENT_DIR"
    
    echo ""
    echo -e "${GREEN}✅ Frontend desplegado exitosamente!${NC}"
}

# Desplegar API
deploy_api() {
    echo ""
    echo -e "${BLUE}============================================================${NC}"
    echo -e "${BLUE}   DESPLEGANDO API${NC}"
    echo -e "${BLUE}============================================================${NC}"
    echo ""
    
    # Guardar directorio actual
    CURRENT_DIR=$(pwd)
    
    # Ir al directorio API
    cd API
    
    echo -e "${YELLOW}🐳 Construyendo imagen Docker de API...${NC}"
    docker build -t inmobiliaria-api:latest .
    
    echo -e "${YELLOW}🏷️  Etiquetando imagen...${NC}"
    docker tag inmobiliaria-api:latest $ECR_API_URI:latest
    
    echo -e "${YELLOW}📤 Subiendo imagen a ECR...${NC}"
    docker push $ECR_API_URI:latest
    
    echo -e "${YELLOW}🚀 Actualizando servicio en ECS...${NC}"
    aws ecs update-service \
      --cluster $ECS_CLUSTER \
      --service $ECS_API_SERVICE \
      --force-new-deployment \
      --region $AWS_REGION \
      --no-cli-pager
    
    # Volver al directorio original
    cd "$CURRENT_DIR"
    
    echo ""
    echo -e "${GREEN}✅ API desplegada exitosamente!${NC}"
}

# Verificar estado
check_status() {
    echo ""
    echo -e "${BLUE}============================================================${NC}"
    echo -e "${BLUE}   ESTADO DE LOS SERVICIOS${NC}"
    echo -e "${BLUE}============================================================${NC}"
    echo ""
    
    aws ecs describe-services \
      --cluster $ECS_CLUSTER \
      --services $ECS_API_SERVICE $ECS_FRONTEND_SERVICE \
      --query 'services[*].[serviceName,status,runningCount,desiredCount,deployments[0].rolloutState]' \
      --output table \
      --region $AWS_REGION
    
    echo ""
    echo -e "${YELLOW}🌐 URL del ALB:${NC}"
    ALB_DNS=$(aws elbv2 describe-load-balancers \
      --names inmobiliaria-alb \
      --query 'LoadBalancers[0].DNSName' \
      --output text \
      --region $AWS_REGION 2>/dev/null || echo "ALB no encontrado")
    
    if [ "$ALB_DNS" != "ALB no encontrado" ]; then
        echo -e "${GREEN}   http://$ALB_DNS${NC}"
    else
        echo -e "${RED}   $ALB_DNS${NC}"
    fi
    echo ""
}

# Esperar a que el despliegue complete
wait_deployment() {
    local service=$1
    echo -e "${YELLOW}⏳ Esperando a que $service esté estable...${NC}"
    aws ecs wait services-stable \
      --cluster $ECS_CLUSTER \
      --services $service \
      --region $AWS_REGION
    echo -e "${GREEN}✅ $service está estable${NC}"
}

# Ver logs de API
logs_api() {
    echo -e "${YELLOW}📋 Logs de API (últimos 10 minutos):${NC}"
    aws logs tail /ecs/inmobiliaria-api --since 10m --region $AWS_REGION 2>/dev/null || echo "Log group no encontrado"
}

# Ver logs de Frontend
logs_frontend() {
    echo -e "${YELLOW}📋 Logs de Frontend (últimos 10 minutos):${NC}"
    aws logs tail /ecs/inmobiliaria-frontend --since 10m --region $AWS_REGION 2>/dev/null || echo "Log group no encontrado"
}

# ============================================================
# MAIN - Procesar argumentos
# ============================================================

case "$1" in
    frontend)
        check_requirements
        login_ecr
        deploy_frontend
        echo -e "${YELLOW}⏳ Esperando estabilización del servicio...${NC}"
        wait_deployment $ECS_FRONTEND_SERVICE
        check_status
        ;;
    api)
        check_requirements
        login_ecr
        deploy_api
        echo -e "${YELLOW}⏳ Esperando estabilización del servicio...${NC}"
        wait_deployment $ECS_API_SERVICE
        check_status
        ;;
    all)
        check_requirements
        login_ecr
        deploy_frontend
        deploy_api
        echo -e "${YELLOW}⏳ Esperando estabilización de servicios...${NC}"
        wait_deployment $ECS_API_SERVICE
        wait_deployment $ECS_FRONTEND_SERVICE
        check_status
        ;;
    status)
        check_status
        ;;
    logs-api)
        logs_api
        ;;
    logs-front)
        logs_frontend
        ;;
    help|-h|--help)
        show_help
        ;;
    *)
        echo -e "${RED}❌ Error: Opción no válida: $1${NC}"
        show_help
        ;;
esac

echo ""
echo -e "${GREEN}🎉 Script completado!${NC}"

