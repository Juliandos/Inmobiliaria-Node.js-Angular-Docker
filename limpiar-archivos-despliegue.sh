#!/bin/bash

# Script para eliminar archivos de despliegue que ya no son necesarios
# ⚠️ IMPORTANTE: Revisa ARCHIVOS_PARA_ELIMINAR.md antes de ejecutar este script

echo "═══════════════════════════════════════════════════════════"
echo "🗑️  LIMPIEZA DE ARCHIVOS DE DESPLIEGUE"
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "Este script eliminará los archivos de despliegue que ya no son necesarios."
echo "Asegúrate de haber revisado ARCHIVOS_PARA_ELIMINAR.md antes de continuar."
echo ""
read -p "¿Deseas continuar? (s/N): " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Ss]$ ]]; then
    echo "Operación cancelada."
    exit 0
fi

echo ""
echo "Eliminando archivos..."

# Scripts de despliegue principal
echo "1. Eliminando scripts de despliegue principal..."
rm -f desplegar-aws.sh
rm -f paso-1-security-groups.sh
rm -f paso-2-alb-target-groups.sh
rm -f paso-3-actualizar-security-groups.sh
rm -f paso-4-crear-services.sh

# Scripts de corrección
echo "2. Eliminando scripts de corrección..."
rm -f corregir-y-redesplegar.sh
rm -f crear-log-groups.sh
rm -f redesplegar-services.sh
rm -f corregir-health-check-api.sh
rm -f corregir-health-check-final.sh
rm -f redesplegar-api-con-health.sh
rm -f actualizar-api-url.sh
rm -f actualizar-api-url-simple.sh
rm -f actualizar-api-url-manual.sh
rm -f redesplegar-frontend.sh

# Scripts de diagnóstico
echo "3. Eliminando scripts de diagnóstico..."
rm -f diagnosticar-services.sh
rm -f diagnostico-completo-api.sh
rm -f diagnosticar-api-503.sh

# Scripts de verificación
echo "4. Eliminando scripts de verificación..."
rm -f verificar-rol-ecs.sh
rm -f verificar-usuarios-db.sh
rm -f verificar-api-health.sh
rm -f verificar-api-targets.sh
rm -f verificar-imagenes-ecr.sh
rm -f obtener-security-groups.sh

# Scripts de seed
echo "5. Eliminando scripts de seed..."
rm -f ejecutar-seed-aws.sh
rm -f ejecutar-seed-aws-simple.sh
rm -f consultar-base-datos.sh

# Scripts en carpeta scripts/
echo "6. Eliminando scripts en carpeta scripts/..."
rm -f scripts/build-frontend-with-env.sh
rm -f scripts/deploy-complete.sh
rm -f scripts/deploy-to-ecr.sh
rm -f scripts/setup-aws-resources.sh

# Documentación temporal
echo "7. Eliminando documentación temporal..."
rm -f GUIA_DESPLIEGUE_AWS.md
rm -f INSTRUCCIONES_DESPLIEGUE.md
rm -f GUIA_AWS_S3.md
rm -f SOLUCION_COMMIT_VARIABLES_SENSIBLES.md
rm -f SOLUCION_ERROR_AUTENTICACION.md

# Archivos temporales
echo "8. Eliminando archivos temporales..."
rm -f temp_ecs_sg.json
rm -f test-endpoints.js
rm -f "ecr list-images --repository-name inmobiliaria-frontendqq" 2>/dev/null

# Instaladores AWS CLI
echo "9. Eliminando instaladores AWS CLI..."
rm -f awscliv2.zip
rm -rf aws/dist/
rm -f aws/install
rm -f aws/THIRD_PARTY_LICENSES

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "✅ Limpieza completada"
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "Archivos eliminados exitosamente."
echo ""
echo "⚠️  IMPORTANTE:"
echo "   1. Verifica que valores-aws-config.txt esté en .gitignore"
echo "   2. Revisa los cambios antes de hacer commit"
echo "   3. Los archivos importantes están documentados en:"
echo "      - RESUMEN_COMPLETO_DESPLIEGUE.md"
echo "      - ARCHIVOS_PARA_ELIMINAR.md"
echo ""

