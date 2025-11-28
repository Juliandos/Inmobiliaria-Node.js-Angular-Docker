#!/bin/bash

# Script para consultar información de la base de datos RDS

DB_HOST="inmobiliaria-db.curyww80mtme.us-east-1.rds.amazonaws.com"
DB_USER="admin"
DB_NAME="db_inmobiliaria"
DB_PORT="3306"

echo "═══════════════════════════════════════════════════════════"
echo "📊 CONSULTANDO BASE DE DATOS"
echo "═══════════════════════════════════════════════════════════"
echo ""

# Verificar si mysql client está instalado
if ! command -v mysql &> /dev/null; then
  echo "⚠️ MySQL client no está instalado."
  echo "Instálalo con: sudo apt-get install -y mysql-client"
  echo ""
  echo "O usa estos comandos desde tu máquina local con Node.js:"
  echo "  cd API"
  echo "  node -e \"const db = require('./src/db/database'); db.authenticate().then(() => { console.log('Conectado'); process.exit(0); });\""
  exit 1
fi

# Solicitar contraseña
echo "Ingresa la contraseña de la base de datos (DB_PASS):"
read -s DB_PASS
echo ""

echo "1. Listando todas las tablas:"
echo "───────────────────────────────────────────────────────────"
mysql -h $DB_HOST -u $DB_USER -p$DB_PASS -P $DB_PORT $DB_NAME -e "SHOW TABLES;" 2>/dev/null

if [ $? -ne 0 ]; then
  echo "❌ Error al conectar a la base de datos"
  echo "Verifica las credenciales y que el Security Group permita conexiones"
  exit 1
fi

echo ""

echo "2. Contando registros por tabla:"
echo "───────────────────────────────────────────────────────────"
TABLES=$(mysql -h $DB_HOST -u $DB_USER -p$DB_PASS -P $DB_PORT $DB_NAME -N -e "SHOW TABLES;" 2>/dev/null)

for TABLE in $TABLES; do
  COUNT=$(mysql -h $DB_HOST -u $DB_USER -p$DB_PASS -P $DB_PORT $DB_NAME -N -e "SELECT COUNT(*) FROM \`$TABLE\`;" 2>/dev/null)
  echo "   $TABLE: $COUNT registros"
done

echo ""

echo "3. Información de la tabla 'usuarios' (primeros 5):"
echo "───────────────────────────────────────────────────────────"
mysql -h $DB_HOST -u $DB_USER -p$DB_PASS -P $DB_PORT $DB_NAME -e "SELECT id, nombre, email, rol_id FROM usuarios LIMIT 5;" 2>/dev/null

echo ""

echo "4. Información de la tabla 'propiedades' (primeros 5):"
echo "───────────────────────────────────────────────────────────"
mysql -h $DB_HOST -u $DB_USER -p$DB_PASS -P $DB_PORT $DB_NAME -e "SELECT id, titulo, precio, tipo_propiedad_id, operacion_id FROM propiedades LIMIT 5;" 2>/dev/null

echo ""

echo "5. Información de la tabla 'tipos_propiedad':"
echo "───────────────────────────────────────────────────────────"
mysql -h $DB_HOST -u $DB_USER -p$DB_PASS -P $DB_PORT $DB_NAME -e "SELECT * FROM tipos_propiedad;" 2>/dev/null

echo ""

echo "6. Información de la tabla 'operacion':"
echo "───────────────────────────────────────────────────────────"
mysql -h $DB_HOST -u $DB_USER -p$DB_PASS -P $DB_PORT $DB_NAME -e "SELECT * FROM operacion;" 2>/dev/null

echo ""

echo "7. Información de la tabla 'ciudad' (si existe):"
echo "───────────────────────────────────────────────────────────"
mysql -h $DB_HOST -u $DB_USER -p$DB_PASS -P $DB_PORT $DB_NAME -e "SELECT * FROM ciudad LIMIT 10;" 2>/dev/null || echo "   ⚠️ Tabla 'ciudad' no existe aún"

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "✅ Consulta completada"
echo "═══════════════════════════════════════════════════════════"

