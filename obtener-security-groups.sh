#!/bin/bash

# Script para obtener IDs de Security Groups existentes

VPC_ID="vpc-0f763c706455141de"

echo "=== Obteniendo Security Groups Existentes ==="
echo ""

# Obtener Security Group ECS
ECS_SG=$(aws ec2 describe-security-groups \
  --filters "Name=group-name,Values=inmobiliaria-ecs-sg" "Name=vpc-id,Values=$VPC_ID" \
  --query 'SecurityGroups[0].GroupId' \
  --output text)

if [ "$ECS_SG" != "None" ] && [ ! -z "$ECS_SG" ]; then
  echo "✅ ECS Security Group encontrado:"
  echo "   ECS_SG=$ECS_SG"
else
  echo "❌ ECS Security Group NO encontrado"
fi

echo ""

# Obtener Security Group ALB
ALB_SG=$(aws ec2 describe-security-groups \
  --filters "Name=group-name,Values=inmobiliaria-alb-sg" "Name=vpc-id,Values=$VPC_ID" \
  --query 'SecurityGroups[0].GroupId' \
  --output text)

if [ "$ALB_SG" != "None" ] && [ ! -z "$ALB_SG" ]; then
  echo "✅ ALB Security Group encontrado:"
  echo "   ALB_SG=$ALB_SG"
else
  echo "❌ ALB Security Group NO encontrado"
fi

echo ""
echo "=== Detalles de Security Groups ==="
aws ec2 describe-security-groups \
  --group-names inmobiliaria-ecs-sg inmobiliaria-alb-sg \
  --query 'SecurityGroups[*].[GroupId,GroupName,VpcId]' \
  --output table 2>/dev/null || echo "Algunos Security Groups no existen aún"

echo ""
if [ "$ECS_SG" != "None" ] && [ ! -z "$ECS_SG" ] && [ "$ALB_SG" != "None" ] && [ ! -z "$ALB_SG" ]; then
  echo "═══════════════════════════════════════════════════════════"
  echo "Valores para usar en siguientes pasos:"
  echo "═══════════════════════════════════════════════════════════"
  echo "ECS_SG=$ECS_SG"
  echo "ALB_SG=$ALB_SG"
  echo "VPC_ID=$VPC_ID"
  echo "═══════════════════════════════════════════════════════════"
fi

