#!/bin/bash

# Script completo de despliegue a AWS
# Este script automatiza todo el proceso de despliegue

set -e

# Colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   Despliegue Completo a AWS            ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
echo ""

# Verificar AWS CLI
if ! command -v aws &> /dev/null; then
    echo -e "${RED}Error: AWS CLI no está instalado${NC}"
    exit 1
fi

# Obtener configuración
AWS_REGION=${AWS_REGION:-us-east-1}
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)

if [ -z "$AWS_ACCOUNT_ID" ]; then
    echo -e "${RED}Error: No se pudo obtener AWS Account ID${NC}"
    echo "Ejecuta: aws configure"
    exit 1
fi

echo -e "${GREEN}✓${NC} AWS CLI configurado"
echo "  Account ID: $AWS_ACCOUNT_ID"
echo "  Region: $AWS_REGION"
echo ""

# Paso 1: Configurar recursos iniciales
echo -e "${YELLOW}[1/5] Configurando recursos iniciales...${NC}"
chmod +x scripts/setup-aws-resources.sh
./scripts/setup-aws-resources.sh
echo ""

# Paso 2: Construir y subir imágenes
echo -e "${YELLOW}[2/5] Construyendo y subiendo imágenes Docker...${NC}"
chmod +x scripts/deploy-to-ecr.sh
./scripts/deploy-to-ecr.sh all
echo ""

# Paso 3: Solicitar información de RDS
echo -e "${YELLOW}[3/5] Configuración de RDS${NC}"
read -p "Endpoint de RDS (ej: inmobiliaria-db.xxxxx.us-east-1.rds.amazonaws.com): " RDS_ENDPOINT
read -p "Usuario de RDS (default: admin): " RDS_USER
RDS_USER=${RDS_USER:-admin}
read -sp "Password de RDS: " RDS_PASS
echo ""

# Paso 4: Actualizar Task Definitions
echo -e "${YELLOW}[4/5] Actualizando Task Definitions...${NC}"
echo "Por favor, edita manualmente los archivos en aws/ con:"
echo "  - Account ID: $AWS_ACCOUNT_ID"
echo "  - Region: $AWS_REGION"
echo "  - RDS Endpoint: $RDS_ENDPOINT"
echo "  - RDS User: $RDS_USER"
echo ""
read -p "Presiona Enter cuando hayas actualizado los archivos..."

# Paso 5: Registrar Task Definitions
echo -e "${YELLOW}[5/5] Registrando Task Definitions...${NC}"
aws ecs register-task-definition --cli-input-json file://aws/ecs-api-task-definition.json --region $AWS_REGION
aws ecs register-task-definition --cli-input-json file://aws/ecs-frontend-task-definition.json --region $AWS_REGION
echo ""

echo -e "${GREEN}╔════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║   Despliegue Completado                ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════╝${NC}"
echo ""
echo "Próximos pasos:"
echo "1. Crea el Cluster ECS: inmobiliaria-cluster"
echo "2. Crea los Services usando las Task Definitions registradas"
echo "3. Crea el Application Load Balancer"
echo "4. Configura los Target Groups"
echo "5. Ejecuta migraciones: npm run migrate-all && npm run seed"
echo ""
echo "Consulta GUIA_DESPLIEGUE_AWS.md para más detalles"

