#!/bin/bash

# Script para construir el frontend con variables de entorno
# Uso: API_URL=https://api.tudominio.com ./scripts/build-frontend-with-env.sh

set -e

API_URL=${API_URL:-http://localhost:3001}

echo "🔨 Construyendo frontend con API_URL=$API_URL"

# Crear archivo de entorno temporal
cat > Front/src/environments/environment.prod.ts <<EOF
export const environment = {
  production: true,
  apiUrl: '$API_URL'
};
EOF

# Construir
cd Front
npm run build

echo "✅ Frontend construido exitosamente"
echo "Los archivos están en: Front/dist/coreui-free-angular-admin-template/browser"

