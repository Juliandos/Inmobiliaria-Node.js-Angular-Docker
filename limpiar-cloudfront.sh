#!/bin/bash

# Script para eliminar archivos temporales de configuración CloudFront
# ⚠️ IMPORTANTE: Revisa ARCHIVOS_ELIMINAR_CLOUDFRONT.md antes de ejecutar

echo "═══════════════════════════════════════════════════════════"
echo "🗑️  LIMPIEZA DE ARCHIVOS TEMPORALES DE CLOUDFRONT"
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "Este script eliminará los archivos temporales usados para configurar CloudFront."
echo "Asegúrate de haber revisado ARCHIVOS_ELIMINAR_CLOUDFRONT.md antes de continuar."
echo ""
read -p "¿Deseas continuar? (s/N): " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Ss]$ ]]; then
    echo "Operación cancelada."
    exit 0
fi

echo ""
echo "Eliminando archivos..."

# Scripts de configuración CloudFront
echo "1. Eliminando scripts de configuración CloudFront..."
rm -f configurar-cloudfront-simple.sh
rm -f redesplegar-frontend-cloudfront.sh
rm -f crear-politica-cloudfront-custom.sh

# Scripts de diagnóstico y permisos
echo "2. Eliminando scripts de diagnóstico y permisos..."
rm -f agregar-permisos-cloudfront-acm.sh
rm -f diagnosticar-acceso-movil.sh
rm -f verificar-permisos-iam.sh
rm -f solucionar-limite-politicas.sh

# Scripts alternativos
echo "3. Eliminando scripts alternativos..."
rm -f configurar-https-alb.sh

# Documentación temporal
echo "4. Eliminando documentación temporal..."
rm -f SOLUCION_ACCESO_MOVIL.md
rm -f RESUMEN_CLOUDFRONT.md

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "✅ Limpieza completada"
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "Archivos eliminados exitosamente."
echo ""
echo "📋 Archivos mantenidos (importantes):"
echo "   - RESUMEN_CAMBIO_CLOUDFRONT.md (resumen principal)"
echo "   - ARCHIVOS_ELIMINAR_CLOUDFRONT.md (esta lista)"
echo "   - Front/src/environments/environment.ts (configuración actualizada)"
echo ""
echo "🌐 Tu aplicación sigue funcionando en:"
echo "   https://dd7fs4h07d7iz.cloudfront.net/"
echo ""

