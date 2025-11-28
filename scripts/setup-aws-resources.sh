#!/bin/bash

# Script para crear recursos iniciales en AWS
# Este script crea: ECR repos, CloudWatch Log Groups, IAM Roles básicos

set -e

# Colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

AWS_REGION=${AWS_REGION:-us-east-1}
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)

echo -e "${GREEN}🚀 Configurando recursos AWS${NC}"
echo "Account ID: $AWS_ACCOUNT_ID"
echo "Region: $AWS_REGION"
echo ""

# Crear repositorios ECR
echo -e "${YELLOW}📦 Creando repositorios ECR...${NC}"
aws ecr create-repository --repository-name inmobiliaria-api --region $AWS_REGION 2>/dev/null || echo "Repositorio inmobiliaria-api ya existe"
aws ecr create-repository --repository-name inmobiliaria-frontend --region $AWS_REGION 2>/dev/null || echo "Repositorio inmobiliaria-frontend ya existe"

# Crear CloudWatch Log Groups
echo -e "${YELLOW}📊 Creando CloudWatch Log Groups...${NC}"
aws logs create-log-group --log-group-name /ecs/inmobiliaria-api --region $AWS_REGION 2>/dev/null || echo "Log group /ecs/inmobiliaria-api ya existe"
aws logs create-log-group --log-group-name /ecs/inmobiliaria-frontend --region $AWS_REGION 2>/dev/null || echo "Log group /ecs/inmobiliaria-frontend ya existe"

# Crear IAM Role para ECS Task Execution (si no existe)
echo -e "${YELLOW}🔐 Verificando IAM Roles...${NC}"
ROLE_NAME="ecsTaskExecutionRole"

if ! aws iam get-role --role-name $ROLE_NAME --region $AWS_REGION 2>/dev/null; then
    echo "Creando rol $ROLE_NAME..."
    
    # Crear trust policy
    cat > /tmp/trust-policy.json <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "ecs-tasks.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF

    # Crear rol
    aws iam create-role \
        --role-name $ROLE_NAME \
        --assume-role-policy-document file:///tmp/trust-policy.json

    # Adjuntar política
    aws iam attach-role-policy \
        --role-name $ROLE_NAME \
        --policy-arn arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy
else
    echo "Rol $ROLE_NAME ya existe"
fi

echo ""
echo -e "${GREEN}✅ Recursos configurados exitosamente${NC}"

