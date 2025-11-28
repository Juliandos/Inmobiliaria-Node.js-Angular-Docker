#!/bin/bash

# Script para construir y subir imágenes Docker a ECR
# Uso: ./scripts/deploy-to-ecr.sh [api|frontend|all]

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuración
AWS_REGION=${AWS_REGION:-us-east-1}
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)

if [ -z "$AWS_ACCOUNT_ID" ]; then
    echo -e "${RED}Error: No se pudo obtener el AWS Account ID${NC}"
    echo "Asegúrate de tener AWS CLI configurado: aws configure"
    exit 1
fi

ECR_BASE="$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com"
API_REPO="inmobiliaria-api"
FRONTEND_REPO="inmobiliaria-frontend"

echo -e "${GREEN}🚀 Iniciando despliegue a ECR${NC}"
echo "Account ID: $AWS_ACCOUNT_ID"
echo "Region: $AWS_REGION"
echo ""

# Función para construir y subir API
deploy_api() {
    echo -e "${YELLOW}📦 Construyendo imagen de API...${NC}"
    docker build -t $API_REPO:latest ./API
    
    echo -e "${YELLOW}🏷️  Etiquetando imagen...${NC}"
    docker tag $API_REPO:latest $ECR_BASE/$API_REPO:latest
    
    echo -e "${YELLOW}⬆️  Subiendo imagen a ECR...${NC}"
    docker push $ECR_BASE/$API_REPO:latest
    
    echo -e "${GREEN}✅ API desplegada exitosamente${NC}"
}

# Función para construir y subir Frontend
deploy_frontend() {
    echo -e "${YELLOW}📦 Construyendo imagen de Frontend...${NC}"
    docker build -t $FRONTEND_REPO:latest ./Front
    
    echo -e "${YELLOW}🏷️  Etiquetando imagen...${NC}"
    docker tag $FRONTEND_REPO:latest $ECR_BASE/$FRONTEND_REPO:latest
    
    echo -e "${YELLOW}⬆️  Subiendo imagen a ECR...${NC}"
    docker push $ECR_BASE/$FRONTEND_REPO:latest
    
    echo -e "${GREEN}✅ Frontend desplegado exitosamente${NC}"
}

# Autenticar en ECR
echo -e "${YELLOW}🔐 Autenticando en ECR...${NC}"
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ECR_BASE

# Verificar que los repositorios existen
echo -e "${YELLOW}🔍 Verificando repositorios ECR...${NC}"
aws ecr describe-repositories --repository-names $API_REPO --region $AWS_REGION 2>/dev/null || {
    echo -e "${YELLOW}📝 Creando repositorio $API_REPO...${NC}"
    aws ecr create-repository --repository-name $API_REPO --region $AWS_REGION
}

aws ecr describe-repositories --repository-names $FRONTEND_REPO --region $AWS_REGION 2>/dev/null || {
    echo -e "${YELLOW}📝 Creando repositorio $FRONTEND_REPO...${NC}"
    aws ecr create-repository --repository-name $FRONTEND_REPO --region $AWS_REGION
}

# Procesar argumentos
case "${1:-all}" in
    api)
        deploy_api
        ;;
    frontend)
        deploy_frontend
        ;;
    all)
        deploy_api
        echo ""
        deploy_frontend
        ;;
    *)
        echo -e "${RED}Uso: $0 [api|frontend|all]${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}🎉 Despliegue completado!${NC}"
echo "Imágenes disponibles en:"
echo "  - API: $ECR_BASE/$API_REPO:latest"
echo "  - Frontend: $ECR_BASE/$FRONTEND_REPO:latest"

