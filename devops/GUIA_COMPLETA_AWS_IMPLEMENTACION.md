# 🚀 Guía Completa: Implementación del Proyecto Inmobiliaria en AWS

## 📋 Tabla de Contenidos

1. [Resumen del Proyecto](#resumen-del-proyecto)
2. [Arquitectura AWS](#arquitectura-aws)
3. [Paso 1: Configuración de Cuenta AWS](#paso-1-configuración-de-cuenta-aws)
4. [Paso 2: Crear Usuario IAM](#paso-2-crear-usuario-iam)
5. [Paso 3: Crear S3 Bucket](#paso-3-crear-s3-bucket)
6. [Paso 4: Configurar VPC (Por Defecto)](#paso-4-configurar-vpc-por-defecto)
7. [Paso 5: Crear Security Group](#paso-5-crear-security-group)
8. [Paso 6: Crear Instancia EC2](#paso-6-crear-instancia-ec2)
9. [Paso 7: Configurar Instancia EC2](#paso-7-configurar-instancia-ec2)
10. [Paso 8: Desplegar Aplicación](#paso-8-desplegar-aplicación)
11. [Paso 9: Configurar Nginx](#paso-9-configurar-nginx)
10. [Errores Comunes y Soluciones](#errores-comunes-y-soluciones)
11. [Verificación Final](#verificación-final)
12. [Mantenimiento y Monitoreo](#mantenimiento-y-monitoreo)

---

## 📊 Resumen del Proyecto

### Stack Tecnológico

- **Frontend:** Angular con Nginx
- **Backend:** Node.js/TypeScript con Express
- **Base de Datos:** MySQL 8.0
- **Contenedores:** Docker y Docker Compose
- **Reverse Proxy:** Nginx
- **Almacenamiento:** AWS S3
- **Infraestructura:** AWS EC2
- **IA y RAG:** LangChain + OpenAI (Nuevo)
- **Memoria Vectorial:** ChromaDB (Nuevo)

### Requisitos del Sistema

- **RAM:** Mínimo 2GB (recomendado 4GB)
- **CPU:** Mínimo 2 vCPU
- **Almacenamiento:** 30GB mínimo
- **Sistema Operativo:** Ubuntu 22.04 LTS o Amazon Linux 2023

---

## 🏗️ Arquitectura AWS

```
┌─────────────────────────────────────────────────────────────┐
│                        AWS Cloud                              │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  VPC (Default)                                       │   │
│  │                                                       │   │
│  │  ┌───────────────────────────────────────────────┐ │   │
│  │  │  EC2 t3.small (Ubuntu 22.04)                  │ │   │
│  │  │  ┌─────────────────────────────────────────┐   │ │   │
│  │  │  │  Docker Compose                         │   │ │   │
│  │  │  │  ├── Frontend (Angular/Nginx) :4200    │   │ │   │
│  │  │  │  ├── API (Node.js/Express) :3001       │   │ │   │
│  │  │  │  └── MySQL :3306                       │   │ │   │
│  │  │  └─────────────────────────────────────────┘   │ │   │
│  │  │  ┌─────────────────────────────────────────┐   │ │   │
│  │  │  │  Nginx (Reverse Proxy) :80              │   │ │   │
│  │  │  └─────────────────────────────────────────┘   │ │   │
│  │  └───────────────────────────────────────────────┘ │   │
│  │                                                       │   │
│  │  ┌───────────────────────────────────────────────┐ │   │
│  │  │  Security Group                              │ │   │
│  │  │  - SSH (22) desde tu IP                     │ │   │
│  │  │  - HTTP (80) desde cualquier lugar          │ │   │
│  │  │  - HTTPS (443) desde cualquier lugar        │ │   │
│  │  └───────────────────────────────────────────────┘ │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  S3 Bucket: inmobiliaria-propiedades                 │   │
│  │  ├── propiedades/ (imágenes de propiedades)         │   │
│  │  ├── documentos-ciudad/ (POT, normativas, etc.)     │   │
│  │  └── documentos-propiedad/ (escrituras, certificados)│   │
│  └─────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  ChromaDB (Vector Store) - En contenedor API         │   │
│  │  - Almacena embeddings de documentos                │   │
│  │  - Búsqueda semántica para RAG                      │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  IAM User: inmobiliaria-app-user                     │   │
│  │  - Permisos: S3 (read/write)                        │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔐 Paso 1: Configuración de Cuenta AWS

### 1.1 Crear Cuenta AWS

1. Ir a [aws.amazon.com](https://aws.amazon.com)
2. Click en "Create an AWS Account"
3. Completar el proceso de registro
4. **IMPORTANTE:** Verificar email y teléfono

### 1.2 Configurar Facturación

1. Ir a **Billing & Cost Management**
2. Configurar método de pago
3. **Configurar alertas de presupuesto:**
   - Ir a **Budgets** → **Create budget**
   - Tipo: **Cost budget**
   - Monto: **$30 USD/mes**
   - Alertas: 80% ($24) y 100% ($30)

### 1.3 Seleccionar Región

**Recomendación:** Usar la región más cercana a tus usuarios.

- **US East (N. Virginia)** - `us-east-1` (Más barata, más servicios)
- **US East (Ohio)** - `us-east-2`
- **US West (Oregon)** - `us-west-2`
- **South America (São Paulo)** - `sa-east-1` (Para usuarios en Latinoamérica)

**⚠️ IMPORTANTE:** Todos los recursos deben estar en la misma región para evitar costos de transferencia.

---

## 👤 Paso 2: Crear Usuario IAM

### 2.1 ¿Por Qué Crear un Usuario IAM?

- **Seguridad:** No usar credenciales de root
- **Control de acceso:** Permisos específicos
- **Auditoría:** Rastrear quién hizo qué
- **Rotación de credenciales:** Fácil cambiar keys

### 2.2 Crear Usuario IAM

1. **Ir a IAM Console:**
   - Buscar "IAM" en la barra de búsqueda
   - O ir directamente: https://console.aws.amazon.com/iam/

2. **Crear Usuario:**
   - Click en **Users** → **Create user**
   - **User name:** `inmobiliaria-app-user`
   - **Access type:** ✅ **Access key - Programmatic access**
   - Click **Next: Permissions**

3. **Asignar Permisos:**
   
   **Opción A: Política Personalizada (Recomendado)**
   
   Click en **Create policy** → **JSON** y pega esto:

   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Action": [
           "s3:PutObject",
           "s3:GetObject",
           "s3:DeleteObject",
           "s3:ListBucket"
         ],
         "Resource": [
           "arn:aws:s3:::inmobiliaria-propiedades",
           "arn:aws:s3:::inmobiliaria-propiedades/*"
         ]
       }
     ]
   }
   ```

   - **Policy name:** `InmobiliariaS3Access`
   - Click **Create policy**
   - Volver a crear usuario y seleccionar esta política

   **Opción B: Política Predefinida (Más Permisos)**
   
   - Buscar y seleccionar: `AmazonS3FullAccess`
   - ⚠️ **Menos seguro** pero más fácil

4. **Crear Usuario:**
   - Click **Next: Tags** (opcional)
   - Click **Next: Review**
   - Click **Create user**

5. **⚠️ IMPORTANTE: Guardar Credenciales:**
   - **Access Key ID:** `AKIA...` (copiar y guardar)
   - **Secret Access Key:** `...` (solo se muestra una vez, copiar y guardar)
   - **Guardar en lugar seguro** (gestor de contraseñas, archivo encriptado)

### 2.3 Verificar Permisos

```bash
# Desde tu máquina local (con AWS CLI instalado)
aws configure --profile inmobiliaria
# Ingresar Access Key ID y Secret Access Key

# Probar acceso a S3
aws s3 ls --profile inmobiliaria
```

---

## 🪣 Paso 3: Crear S3 Bucket

### 3.1 Crear Bucket

1. **Ir a S3 Console:**
   - Buscar "S3" en la barra de búsqueda
   - O: https://console.aws.amazon.com/s3/

2. **Create bucket:**
   - Click **Create bucket**

3. **Configuración del Bucket:**

   **General Configuration:**
   - **Bucket name:** `inmobiliaria-propiedades` (debe ser único globalmente)
   - **AWS Region:** Misma región que EC2 (ej: `us-east-1`)
   - **Object Ownership:** ACLs disabled (recomendado)

   **Block Public Access settings:**
   - ✅ **Block all public access** (dejar marcado)
   - ✅ **Block public access to buckets and objects granted through new access control lists (ACLs)**
   - ✅ **Block public access to buckets and objects granted through any access control lists (ACLs)**
   - ✅ **Block public access to buckets and objects granted through new public bucket or access point policies**
   - ✅ **Block public and cross-account access to buckets and objects through any public bucket or access point policies**

   **Bucket Versioning:**
   - **Versioning:** Disabled (para ahorrar costos)

   **Default encryption:**
   - ✅ **Enable**
   - **Encryption type:** Amazon S3 managed keys (SSE-S3)

   **Advanced settings:**
   - Dejar por defecto

4. **Click Create bucket**

### 3.2 Crear Estructura de Carpetas

Después de crear el bucket, crear las carpetas:

1. **Ir al bucket** → Click en el nombre
2. **Click "Create folder"** y crear:
   - `propiedades/` (para imágenes de propiedades)
   - `documentos-ciudad/` (para PDFs de documentos de ciudad)
   - `documentos-inmueble/` (para PDFs de documentos de inmuebles)

### 3.3 Configurar CORS (Si es necesario)

Si el frontend necesita acceder directamente a S3:

1. **Ir a bucket** → **Permissions** → **Cross-origin resource sharing (CORS)**
2. **Pegar esta configuración:**

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
    "AllowedOrigins": ["http://TU_IP_PUBLICA", "https://tu-dominio.com"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3000
  }
]
```

3. **Save changes**

### 3.4 Configurar Lifecycle Policies (Opcional - Ahorro de Costos)

Para mover archivos antiguos a almacenamiento más barato:

1. **Ir a bucket** → **Management** → **Lifecycle rules**
2. **Create lifecycle rule:**
   - **Rule name:** `MoveOldFilesToGlacier`
   - **Rule scope:** Apply to all objects in the bucket
   - **Transitions:**
     - After **90 days** → Move to **Glacier Instant Retrieval**
   - **Click Create rule**

---

## 🌐 Paso 4: Configurar VPC (Por Defecto)

### 4.1 ¿Qué es VPC?

**VPC (Virtual Private Cloud)** = Red privada virtual donde viven tus recursos AWS.

### 4.2 Usar VPC por Defecto

**✅ Recomendación:** Usar la VPC por defecto que AWS crea automáticamente.

**Ventajas:**
- ✅ Ya está configurada
- ✅ No cuesta nada extra
- ✅ Funciona perfectamente para proyectos pequeños/medianos
- ✅ Tiene Internet Gateway configurado

**Cómo verificar:**
1. Ir a **VPC Console:** https://console.aws.amazon.com/vpc/
2. Verás una VPC con nombre como `vpc-xxxxx (default)`
3. **Anotar el VPC ID** (lo necesitarás al crear EC2)

### 4.3 Componentes de la VPC por Defecto

La VPC por defecto incluye:
- **Internet Gateway:** Para acceso a Internet
- **Route Table:** Rutas de red
- **Subnet:** Subred pública (una por zona de disponibilidad)
- **Security Group:** Grupo de seguridad por defecto

**No necesitas configurar nada más** para este proyecto.

### 4.4 Cuándo Crear VPC Personalizada

Solo crea una VPC personalizada si:
- Necesitas múltiples subredes (pública/privada)
- Requieres VPN
- Tienes requisitos de compliance específicos
- Proyectos enterprise grandes

**Para este proyecto:** VPC por defecto es suficiente ✅

---

## 🔒 Paso 5: Crear Security Group

### 5.1 ¿Qué es un Security Group?

**Security Group** = Firewall virtual que controla el tráfico entrante y saliente de tu instancia EC2.

### 5.2 Crear Security Group

1. **Ir a EC2 Console:**
   - Buscar "EC2" → **Security Groups**

2. **Create security group:**
   - Click **Create security group**

3. **Basic details:**
   - **Security group name:** `inmobiliaria-sg`
   - **Description:** `Security group for Inmobiliaria application`
   - **VPC:** Seleccionar la VPC por defecto

4. **Inbound rules (Reglas de Entrada):**

   **Regla 1: SSH (Para administración)**
   - **Type:** SSH
   - **Protocol:** TCP
   - **Port range:** 22
   - **Source:** **My IP** (recomendado) o `0.0.0.0/0` (menos seguro)
   - **Description:** `SSH access from my IP`

   **Regla 2: HTTP (Para tráfico web)**
   - **Type:** HTTP
   - **Protocol:** TCP
   - **Port range:** 80
   - **Source:** `0.0.0.0/0` (cualquier lugar)
   - **Description:** `HTTP access for web traffic`

   **Regla 3: HTTPS (Para SSL)**
   - **Type:** HTTPS
   - **Protocol:** TCP
   - **Port range:** 443
   - **Source:** `0.0.0.0/0` (cualquier lugar)
   - **Description:** `HTTPS access for SSL`

   **⚠️ IMPORTANTE:** No agregar reglas para puertos 3000, 3001, 3306, 4200 porque:
   - Nginx hace reverse proxy (puerto 80 → 3000)
   - MySQL solo es accesible desde dentro de la VPC
   - Frontend se sirve a través de Nginx

5. **Outbound rules (Reglas de Salida):**
   - Dejar por defecto: **All traffic** a `0.0.0.0/0`
   - Esto permite que la instancia acceda a Internet (necesario para actualizaciones, S3, etc.)

6. **Click Create security group**

### 5.3 Verificar Security Group

Después de crear, deberías ver:
- ✅ 3 inbound rules (SSH, HTTP, HTTPS)
- ✅ 1 outbound rule (All traffic)

---

## 🖥️ Paso 6: Crear Instancia EC2

### 6.1 Launch Instance

1. **Ir a EC2 Console:**
   - Click **Instances** → **Launch instance**

2. **Name and tags:**
   - **Name:** `inmobiliaria-server`

3. **Application and OS Images (AMI):**
   - **AMI:** **Ubuntu Server 22.04 LTS** (64-bit x86)
   - O **Amazon Linux 2023** (si prefieres)

4. **Instance type:**
   - **t3.small** (2 vCPU, 2GB RAM) - Recomendado para producción
   - O **t2.micro** (1 vCPU, 1GB RAM) - Para Free Tier (primeros 12 meses)
   - **Costo:** t3.small ~$15/mes, t2.micro gratis (Free Tier)

5. **Key pair (login):**
   - **Create new key pair** (si no tienes uno)
   - **Key pair name:** `inmobiliaria-key`
   - **Key pair type:** RSA
   - **Private key file format:** `.pem` (para Linux/Mac) o `.ppk` (para Windows/PuTTY)
   - **⚠️ IMPORTANTE:** Descargar el archivo `.pem` y guardarlo de forma segura
   - Si pierdes este archivo, no podrás acceder a la instancia

6. **Network settings:**
   - **VPC:** Seleccionar VPC por defecto
   - **Subnet:** Cualquier subnet pública
   - **Auto-assign Public IP:** **Enable**
   - **Security group:** Seleccionar `inmobiliaria-sg` (el que creamos antes)

7. **Configure storage:**
   - **Size (GiB):** 30 (mínimo recomendado)
   - **Volume type:** **gp3** (más económico que gp2)
   - **Delete on termination:** ✅ Marcado (si quieres que se elimine al terminar instancia)

8. **Advanced details (Opcional pero recomendado):**
   
   **User data (Script de inicialización):**
   
   Puedes pegar un script que se ejecutará al iniciar la instancia:
   
   ```bash
   #!/bin/bash
   # Actualizar sistema
   apt-get update -y
   apt-get upgrade -y
   
   # Instalar Docker
   curl -fsSL https://get.docker.com -o get-docker.sh
   sh get-docker.sh
   
   # Instalar Docker Compose
   curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
   chmod +x /usr/local/bin/docker-compose
   
   # Agregar usuario a grupo docker
   usermod -aG docker ubuntu
   ```

9. **Summary:**
   - Revisar configuración
   - **Number of instances:** 1
   - Click **Launch instance**

10. **Esperar a que la instancia esté "Running":**
    - Puede tardar 1-2 minutos
    - Estado cambiará de "Pending" → "Running"

### 6.2 Obtener IP Pública

1. **Seleccionar la instancia**
2. **Copiar la "Public IPv4 address"** (ej: `54.147.61.191`)
3. **Guardar esta IP** - la necesitarás para conectarte

### 6.3 Conectar a la Instancia

**Desde Linux/Mac:**
```bash
# Cambiar permisos del archivo .pem
chmod 400 inmobiliaria-key.pem

# Conectar
ssh -i inmobiliaria-key.pem ubuntu@TU_IP_PUBLICA
```

**Desde Windows (PuTTY):**
1. Convertir `.pem` a `.ppk` usando PuTTYgen
2. Abrir PuTTY
3. **Host Name:** `ubuntu@TU_IP_PUBLICA`
4. **Connection → SSH → Auth:** Seleccionar archivo `.ppk`
5. Click **Open**

**Desde Windows (WSL o Git Bash):**
```bash
# Igual que Linux/Mac
chmod 400 inmobiliaria-key.pem
ssh -i inmobiliaria-key.pem ubuntu@TU_IP_PUBLICA
```

---

## ⚙️ Paso 7: Configurar Instancia EC2

### 7.1 Actualizar Sistema

```bash
# Conectado a la instancia EC2
sudo apt update && sudo apt upgrade -y
```

### 7.2 Instalar Docker

```bash
# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Verificar instalación
docker --version
# Debería mostrar: Docker version 24.x.x
```

### 7.3 Instalar Docker Compose

```bash
# Instalar Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verificar instalación
docker-compose --version
# Debería mostrar: Docker Compose version v2.x.x
```

### 7.4 Agregar Usuario a Grupo Docker

```bash
# Agregar usuario actual a grupo docker (para no usar sudo)
sudo usermod -aG docker $USER

# Aplicar cambios (cerrar y volver a conectar, o):
newgrp docker

# Verificar que funciona sin sudo
docker ps
```

### 7.5 Instalar Git

```bash
sudo apt install git -y
git --version
```

### 7.6 Instalar Nginx

```bash
sudo apt install nginx -y
sudo systemctl enable nginx
sudo systemctl start nginx

# Verificar que Nginx está corriendo
sudo systemctl status nginx
```

### 7.7 Clonar Repositorio

```bash
# Ir a directorio home
cd ~

# Clonar repositorio
git clone https://github.com/TU_USUARIO/TU_REPOSITORIO.git inmobiliaria
cd inmobiliaria

# O si ya tienes el código, subirlo con scp desde tu máquina local
```

---

## 🚀 Paso 8: Desplegar Aplicación

### 8.1 Configurar Variables de Entorno

```bash
cd ~/inmobiliaria

# Copiar archivo de ejemplo
cp .env.example .env

# Editar variables de entorno
nano .env
```

**Configurar estas variables:**

```env
# ============================================
# CONFIGURACIÓN DE AWS S3
# ============================================
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=TU_ACCESS_KEY_ID_AQUI
AWS_SECRET_ACCESS_KEY=TU_SECRET_ACCESS_KEY_AQUI
AWS_S3_BUCKET_NAME=inmobiliaria-propiedades

# ============================================
# CONFIGURACIÓN DE BASE DE DATOS
# ============================================
MYSQL_ROOT_PASSWORD=GENERAR_PASSWORD_SEGURO_AQUI
MYSQL_DATABASE=db_inmobiliaria
MYSQL_USER=app_user
MYSQL_PASSWORD=GENERAR_PASSWORD_SEGURO_AQUI

# ============================================
# CONFIGURACIÓN DE LA API
# ============================================
API_PORT=3001
API_DB_PORT=3306
API_DB_NAME=db_inmobiliaria
API_DB_USER=root
API_DB_PASS=GENERAR_PASSWORD_SEGURO_AQUI
API_JWT_SECRET=GENERAR_JWT_SECRET_SEGURO_AQUI
API_JWT_REFRESH_SECRET=GENERAR_REFRESH_SECRET_SEGURO_AQUI
API_NODE_ENV=production
```

**Generar passwords seguros:**
```bash
# Generar password seguro
openssl rand -base64 32
```

### 8.2 Construir Imágenes Docker

```bash
cd ~/inmobiliaria

# Construir todas las imágenes
docker-compose build

# O construir una por una
docker-compose build api
docker-compose build front
```

**⏱️ Tiempo estimado:** 5-10 minutos (depende de la velocidad de Internet)

### 8.3 Ejecutar Migraciones de Base de Datos

```bash
# Levantar solo MySQL primero
docker-compose up -d mysql

# Esperar a que MySQL esté listo (30 segundos)
sleep 30

# Ejecutar migraciones
docker-compose exec api npm run migrate-all

# O ejecutar migraciones manualmente
docker-compose exec -i mysql mysql -u root -p${MYSQL_ROOT_PASSWORD} ${MYSQL_DATABASE} < API/migrations/add-documentos-ciudad-table.sql
```

### 8.4 Levantar Todos los Servicios

```bash
# Levantar todos los contenedores
docker-compose up -d

# Verificar que todos están corriendo
docker-compose ps

# Deberías ver:
# - inmobiliaria-api (Up)
# - inmobiliaria-front (Up)
# - inmobiliaria-mysql (Up, healthy)
```

### 8.5 Verificar Logs

```bash
# Ver logs de todos los servicios
docker-compose logs -f

# O ver logs de un servicio específico
docker-compose logs -f api
docker-compose logs -f front
docker-compose logs -f mysql
```

**Lo que debes ver en los logs:**

**API:**
```
Servidor escuchando en puerto 3001
```

**Frontend:**
```
nginx: [notice] ... ready to accept connections
```

**MySQL:**
```
[System] [MY-010931] [Server] /usr/sbin/mysqld: ready for connections.
```

---

## 🌐 Paso 9: Configurar Nginx

### 9.1 Crear Configuración de Nginx

```bash
# Crear archivo de configuración
sudo nano /etc/nginx/conf.d/inmobiliaria.conf
```

**Pegar esta configuración:**

```nginx
server {
    listen 80;
    server_name _;  # Acepta cualquier hostname (cambiar por tu dominio después)

    # Límite de tamaño para uploads (50MB - suficiente para PDFs grandes)
    client_max_body_size 50M;

    # Frontend - Proxy a contenedor frontend en puerto 4200
    location / {
        proxy_pass http://localhost:4200;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # API - Proxy a contenedor API en puerto 3000
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**Guardar:** `Ctrl+O`, `Enter`, `Ctrl+X`

### 9.2 Verificar y Reiniciar Nginx

```bash
# Verificar que la configuración es válida
sudo nginx -t

# Si dice "syntax is ok", reiniciar Nginx
sudo systemctl restart nginx

# Verificar que Nginx está corriendo
sudo systemctl status nginx
```

### 9.3 Configurar SSL con Let's Encrypt (Opcional pero Recomendado)

```bash
# Instalar Certbot
sudo apt install certbot python3-certbot-nginx -y

# Obtener certificado SSL (reemplazar con tu dominio)
sudo certbot --nginx -d tu-dominio.com -d www.tu-dominio.com

# Seguir las instrucciones en pantalla
# Certbot configurará SSL automáticamente
```

**Nota:** Necesitas tener un dominio apuntando a tu IP pública para usar Let's Encrypt.

---

## 🤖 Paso 10: Sistema de Avalúos con IA (Nuevo)

### 10.1 Resumen de la Funcionalidad

El sistema de avalúos con IA permite:
1. **Subir documentos de la ciudad** (POT, normativas, etc.) para contexto general
2. **Subir documentos de la propiedad** (escrituras, certificados, recibos) para contexto específico
3. **Conversar con IA** que lee documentos de S3 y DB para dar avalúos precisos con memoria conversacional

### 10.2 Opciones de Memoria Vectorial

**Opción A: ChromaDB (Recomendado) ✅**

**Ventajas:**
- ✅ No requiere cambiar MySQL (mantiene tu DB actual)
- ✅ Ligera y rápida (puede correr en el mismo contenedor)
- ✅ Sin costos adicionales
- ✅ Fácil de implementar
- ✅ Persistencia en disco (sobrevive reinicios)

**Desventajas:**
- ⚠️ Requiere espacio en disco (~100MB-1GB dependiendo de documentos)
- ⚠️ No es distribuida (solo en una instancia)

**Costo:** $0 (incluido en EC2)

**Opción B: PostgreSQL + pgvector**

**Ventajas:**
- ✅ Base de datos robusta y escalable
- ✅ Soporte nativo para vectores
- ✅ Puede compartirse entre múltiples instancias

**Desventajas:**
- ❌ Requiere cambiar de MySQL a PostgreSQL (migración compleja)
- ❌ Costo adicional: ~$15-20/mes (RDS PostgreSQL)
- ❌ Más complejo de configurar

**Costo:** ~$15-20/mes adicionales

**Opción C: Pinecone / Weaviate (Cloud)**

**Ventajas:**
- ✅ Servicio gestionado (sin mantenimiento)
- ✅ Escalable automáticamente
- ✅ Muy rápido

**Desventajas:**
- ❌ Costo adicional: $70-200/mes
- ❌ Excede el presupuesto de $23/mes

**Costo:** $70-200/mes

**🎯 Recomendación: ChromaDB**

Para mantener costos dentro del presupuesto y simplicidad, **ChromaDB es la mejor opción**.

### 10.3 Estructura de S3 para Documentos

**Bucket:** `inmobiliaria-propiedades` (existente)

**Estructura de carpetas:**
```
inmobiliaria-propiedades/
├── propiedades/
│   └── [propiedad_id]/
│       └── [imagen].jpg
├── documentos-ciudad/          (NUEVO)
│   ├── POT_2024.pdf
│   ├── Normativa_Zonificacion.pdf
│   └── Plan_Desarrollo.pdf
└── documentos-propiedad/       (NUEVO)
    └── [propiedad_id]/
        ├── escritura_publica.pdf
        ├── certificado_tradicion.pdf
        ├── recibo_energia.pdf
        └── otros_documentos.pdf
```

### 10.4 Instalar Dependencias de LangChain

**Agregar al `API/package.json`:**

```json
{
  "dependencies": {
    "@langchain/openai": "^0.0.6",
    "@langchain/community": "^0.0.29",
    "langchain": "^0.1.13",
    "chromadb": "^1.8.1",
    "pdf-parse": "^1.1.1",
    "openai": "^4.20.0"
  }
}
```

**Instalar en contenedor:**
```bash
cd ~/inmobiliaria
docker-compose exec api npm install
```

### 10.5 Configurar Variables de Entorno

**Agregar al `.env`:**

```env
# ============================================
# CONFIGURACIÓN DE IA Y LANGCHAIN (NUEVO)
# ============================================
OPENAI_API_KEY=sk-proj-tu-api-key-aqui
OPENAI_MODEL=gpt-4o-mini
OPENAI_EMBEDDING_MODEL=text-embedding-3-small
OPENAI_TEMPERATURE=0.3

# Configuración de RAG
RAG_CHUNK_SIZE=1000
RAG_CHUNK_OVERLAP=200
RAG_TOP_K_RESULTS=4

# Configuración de memoria conversacional
CHAT_MAX_INTERACTIONS=10
CHAT_MAX_MESSAGES=20

# ChromaDB (almacenamiento local)
CHROMA_DB_PATH=/app/data/chroma_db
```

**Actualizar `docker-compose.yml` para persistir ChromaDB:**

```yaml
api:
  # ... configuración existente ...
  volumes:
    - ./API:/app
    - /app/node_modules
    - chroma-data:/app/data/chroma_db  # NUEVO: Persistir ChromaDB

volumes:
  mysql-data:
  chroma-data:  # NUEVO: Volumen para ChromaDB
```

### 10.6 Endpoints de la API

**1. Subir Documentos de la Ciudad**

```typescript
POST /api/avaluos/documentos-ciudad
Content-Type: multipart/form-data

Body:
- file: PDF del documento
- nombre: Nombre del documento (ej: "POT_2024")
- descripcion: Descripción opcional

Response:
{
  "success": true,
  "message": "Documento subido correctamente",
  "data": {
    "url": "s3://inmobiliaria-propiedades/documentos-ciudad/POT_2024.pdf",
    "nombre": "POT_2024",
    "fecha_subida": "2024-12-19T..."
  }
}
```

**2. Subir Documentos de Propiedad**

```typescript
POST /api/avaluos/propiedades/:propiedadId/documentos
Content-Type: multipart/form-data

Body:
- file: PDF del documento
- tipo: Tipo de documento (escritura, certificado_tradicion, recibo_energia, otros)
- descripcion: Descripción opcional

Response:
{
  "success": true,
  "message": "Documento subido correctamente",
  "data": {
    "url": "s3://inmobiliaria-propiedades/documentos-propiedad/123/escritura.pdf",
    "tipo": "escritura",
    "propiedad_id": 123
  }
}
```

**3. Conversar con IA para Avalúo**

```typescript
POST /api/avaluos/propiedades/:propiedadId/chat
Content-Type: application/json
Authorization: Bearer <token>

Body:
{
  "question": "¿Cuál es el valor estimado de esta propiedad?",
  "session_id": "sesion-123"  // Opcional, para mantener contexto
}

Response:
{
  "success": true,
  "data": {
    "answer": "Basado en los documentos analizados...",
    "session_id": "sesion-123",
    "sources": [
      {
        "tipo": "documento_ciudad",
        "nombre": "POT_2024.pdf",
        "relevancia": 0.85
      },
      {
        "tipo": "documento_propiedad",
        "nombre": "escritura.pdf",
        "relevancia": 0.92
      }
    ],
    "chat_history": [
      {
        "role": "user",
        "content": "¿Cuál es el valor estimado?"
      },
      {
        "role": "assistant",
        "content": "Basado en los documentos..."
      }
    ]
  }
}
```

### 10.7 Flujo de Funcionamiento

```
1. Usuario sube documento de ciudad → S3
   ↓
2. Sistema procesa PDF → Divide en chunks → Genera embeddings → Almacena en ChromaDB
   ↓
3. Usuario sube documento de propiedad → S3
   ↓
4. Sistema procesa PDF → Divide en chunks → Genera embeddings → Almacena en ChromaDB
   ↓
5. Usuario hace pregunta sobre avalúo
   ↓
6. Sistema busca documentos relevantes en ChromaDB (RAG)
   ↓
7. Sistema obtiene datos de propiedad de MySQL
   ↓
8. Sistema construye prompt con: pregunta + documentos + datos DB + historial conversación
   ↓
9. Sistema envía a OpenAI GPT-4o-mini
   ↓
10. Sistema retorna respuesta con fuentes y actualiza memoria conversacional
```

### 10.8 Implementación en Código

**Estructura de archivos sugerida:**

```
API/src/
├── services/
│   ├── langchain.service.ts      (NUEVO)
│   ├── chromadb.service.ts       (NUEVO)
│   └── s3.service.ts             (existente, actualizar)
├── controllers/
│   └── avaluos.controller.ts      (NUEVO)
├── routes/
│   └── avaluos.routes.ts         (NUEVO)
└── models/
    └── avaluos.models.ts         (NUEVO)
```

### 10.9 Costos Adicionales

**OpenAI API:**
- **Embeddings:** $0.02 por 1M tokens (text-embedding-3-small)
- **GPT-4o-mini:** $0.15 por 1M tokens de entrada, $0.60 por 1M tokens de salida
- **Estimación mensual:** $2-5/mes (dependiendo del uso)

**ChromaDB:**
- **Costo:** $0 (incluido en EC2)
- **Espacio:** ~100MB-1GB en disco

**S3 (almacenamiento adicional):**
- **Documentos:** ~1-5GB adicionales
- **Costo:** $0.023/GB = $0.02-0.12/mes

**Total adicional:** ~$2-6/mes

**Costo total del proyecto:** $18-19/mes (base) + $2-6/mes (IA) = **$20-25/mes**

✅ **Dentro del presupuesto de $23/mes** (con uso moderado)

### 10.10 Verificación de la Funcionalidad

```bash
# 1. Verificar que ChromaDB está funcionando
docker-compose exec api ls -la /app/data/chroma_db

# 2. Verificar que los documentos se suben a S3
aws s3 ls s3://inmobiliaria-propiedades/documentos-ciudad/
aws s3 ls s3://inmobiliaria-propiedades/documentos-propiedad/

# 3. Probar endpoint de chat
curl -X POST http://localhost:3000/api/avaluos/propiedades/1/chat \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"question": "¿Cuál es el valor de esta propiedad?"}'
```

---

## 🐛 Errores Comunes y Soluciones

### Error 1: "413 Request Entity Too Large" (Nginx)

**Síntoma:**
```
413 Request Entity Too Large
```

**Causa:** Nginx tiene un límite por defecto de 1MB para uploads.

**Solución:**
```bash
# Editar configuración de Nginx
sudo nano /etc/nginx/conf.d/inmobiliaria.conf

# Agregar dentro del bloque server {:
client_max_body_size 50M;

# Guardar y reiniciar
sudo nginx -t
sudo systemctl restart nginx
```

**Prevención:** Siempre incluir `client_max_body_size 50M;` en la configuración de Nginx.

---

### Error 2: "Cannot POST /api/documentos-ciudad"

**Síntoma:**
```
Cannot POST /api/documentos-ciudad
```

**Causa:** Las rutas no se están cargando correctamente.

**Solución:**
1. **Verificar que las rutas están registradas:**
   ```bash
   docker-compose logs api | grep "Ruta cargada"
   ```

2. **Verificar que el archivo de rutas existe:**
   ```bash
   docker-compose exec api ls -la /app/src/routes/documentos-ciudad.ts
   ```

3. **Reconstruir el contenedor:**
   ```bash
   docker-compose build --no-cache api
   docker-compose restart api
   ```

**Prevención:** Usar importaciones estáticas en lugar de dinámicas para rutas críticas.

---

### Error 3: "tsx: not found"

**Síntoma:**
```
sh: tsx: not found
```

**Causa:** Las dependencias de desarrollo no se instalaron o el volumen está sobrescribiendo `node_modules`.

**Solución 1: Verificar Dockerfile**
```bash
# Verificar que Dockerfile instala todas las dependencias
cat API/Dockerfile | grep "npm ci"

# Debe mostrar:
# RUN npm ci
# (NO debe ser "npm ci --only=production")
```

**Solución 2: Comentar volumen en docker-compose.yml**
```bash
# Editar docker-compose.yml
nano docker-compose.yml

# Comentar las líneas de volumes del servicio api:
# volumes:
#   - ./API:/app
#   - /app/node_modules

# Guardar y reiniciar
docker-compose down api
docker-compose up -d api
```

**Solución 3: Instalar manualmente**
```bash
docker-compose exec api npm install tsx --save-dev
docker-compose restart api
```

**Prevención:** 
- Usar `RUN npm ci` (sin `--only=production`) en Dockerfile
- Comentar volumen en producción
- Verificar que `package.json` tiene `tsx` en `devDependencies`

---

### Error 4: "Cannot find package '@langchain/openai'"

**Síntoma:**
```
Error [ERR_MODULE_NOT_FOUND]: Cannot find package '@langchain/openai'
```

**Causa:** Dependencias no instaladas o package.json desactualizado.

**Solución:**
```bash
# Verificar que package.json tiene las dependencias
grep "@langchain" API/package.json

# Reconstruir contenedor
docker-compose build --no-cache api
docker-compose up -d api

# Si aún falla, instalar manualmente
docker-compose exec api npm install --legacy-peer-deps
docker-compose restart api
```

**Prevención:** 
- Mantener `package.json` actualizado
- Usar `--legacy-peer-deps` si hay conflictos de dependencias
- Verificar que todas las dependencias están en `package.json`

---

### Error 5: "502 Bad Gateway" (Nginx)

**Síntoma:**
```
502 Bad Gateway
```

**Causa:** Nginx no puede conectar con el backend o frontend.

**Solución:**
```bash
# 1. Verificar que los contenedores están corriendo
docker-compose ps

# 2. Verificar que los puertos son correctos
docker-compose ps
# Verificar que api está en puerto 3000 y front en 4200

# 3. Verificar configuración de Nginx
sudo cat /etc/nginx/conf.d/inmobiliaria.conf

# Debe apuntar a:
# - Frontend: http://localhost:4200
# - API: http://localhost:3000

# 4. Verificar logs de Nginx
sudo tail -f /var/log/nginx/error.log
```

**Prevención:** 
- Verificar que los puertos en `docker-compose.yml` coinciden con la configuración de Nginx
- Verificar que los contenedores están corriendo antes de configurar Nginx

---

### Error 6: "Connection refused" (MySQL)

**Síntoma:**
```
Error: connect ECONNREFUSED mysql:3306
```

**Causa:** MySQL no está listo o no está accesible.

**Solución:**
```bash
# 1. Verificar que MySQL está corriendo
docker-compose ps mysql

# 2. Verificar que MySQL está healthy
docker-compose ps mysql
# Debe mostrar: (healthy)

# 3. Verificar logs de MySQL
docker-compose logs mysql

# 4. Esperar a que MySQL esté listo
docker-compose up -d mysql
sleep 30
docker-compose up -d api
```

**Prevención:** 
- Usar `depends_on` con `condition: service_healthy` en `docker-compose.yml`
- Esperar 30 segundos después de levantar MySQL antes de levantar API

---

### Error 7: "Access Denied" (S3)

**Síntoma:**
```
AccessDenied: Access Denied
```

**Causa:** Credenciales incorrectas o permisos insuficientes.

**Solución:**
```bash
# 1. Verificar credenciales en .env
cat .env | grep AWS

# 2. Verificar que las credenciales son correctas
# Probar desde la instancia EC2:
aws s3 ls --region us-east-1

# 3. Verificar permisos del usuario IAM
# Ir a IAM Console → Users → inmobiliaria-app-user → Permissions
# Verificar que tiene permisos de S3
```

**Prevención:** 
- Verificar credenciales antes de desplegar
- Usar políticas IAM específicas (no `AmazonS3FullAccess`)
- Probar acceso a S3 después de configurar credenciales

---

### Error 8: "Port already in use"

**Síntoma:**
```
Error: bind: address already in use
```

**Causa:** Otro proceso está usando el puerto.

**Solución:**
```bash
# Verificar qué proceso está usando el puerto
sudo lsof -i :3000
sudo lsof -i :80

# Detener el proceso o cambiar el puerto en docker-compose.yml
```

**Prevención:** 
- Verificar puertos disponibles antes de levantar contenedores
- Usar puertos diferentes si hay conflictos

---

### Error 9: "Out of memory" (OOM)

**Síntoma:**
```
Killed process (out of memory)
```

**Causa:** La instancia no tiene suficiente RAM.

**Solución:**
1. **Aumentar tamaño de instancia:**
   - Detener instancia
   - Cambiar instance type (t3.small → t3.medium)
   - Reiniciar

2. **Optimizar uso de memoria:**
   - Reducir límites de MySQL
   - Optimizar imágenes Docker
   - Usar swap (temporal)

**Prevención:** 
- Usar instancia con al menos 2GB RAM para producción
- Monitorear uso de memoria con `free -h`

---

### Error 10: "Git pull fails" (Cambios locales)

**Síntoma:**
```
error: Your local changes to the following files would be overwritten by merge
```

**Causa:** Hay cambios locales en el servidor que no están en el repositorio.

**Solución:**
```bash
# Opción 1: Guardar cambios locales
git stash
git pull origin main
git stash pop  # Si necesitas recuperar los cambios

# Opción 2: Descartar cambios locales
git checkout -- API/Dockerfile
git pull origin main

# Opción 3: Hacer commit de cambios locales
git add .
git commit -m "Local changes"
git pull origin main
```

**Prevención:** 
- No editar archivos directamente en el servidor
- Hacer cambios en local, commit, push, luego pull en servidor

---

## ✅ Verificación Final

### Checklist de Verificación

Ejecuta estos comandos para verificar que todo funciona:

```bash
# 1. Verificar que todos los contenedores están corriendo
docker-compose ps
# Debe mostrar: api (Up), front (Up), mysql (Up, healthy)

# 2. Verificar que la API responde
curl http://localhost:3000/health
# Debe devolver: {"status":"ok","message":"API is running",...}

# 3. Verificar que Nginx está corriendo
sudo systemctl status nginx
# Debe mostrar: active (running)

# 4. Verificar que puedes acceder desde fuera
curl http://TU_IP_PUBLICA/health
# Debe devolver la misma respuesta

# 5. Verificar que el frontend carga
curl http://TU_IP_PUBLICA/
# Debe devolver HTML del frontend

# 6. Verificar acceso a S3
docker-compose exec api node -e "const s3 = require('@aws-sdk/client-s3'); console.log('S3 SDK loaded');"
# No debe dar errores

# 7. Verificar conexión a MySQL
docker-compose exec mysql mysql -u root -p${MYSQL_ROOT_PASSWORD} -e "SHOW DATABASES;"
# Debe mostrar las bases de datos
```

### Pruebas de Funcionalidad

1. **Acceder al sitio web:**
   - Abrir navegador: `http://TU_IP_PUBLICA`
   - Debe cargar el frontend

2. **Probar login:**
   - Intentar hacer login
   - Verificar que la API responde

3. **Probar subida de archivos:**
   - Subir una imagen de propiedad
   - Verificar que se guarda en S3

4. **Verificar base de datos:**
   - Verificar que las tablas existen
   - Probar crear un registro

---

## 🔧 Mantenimiento y Monitoreo

### Monitoreo de Costos

1. **Configurar Budget:**
   - Ir a **Billing & Cost Management** → **Budgets**
   - Crear budget de $30/mes
   - Configurar alertas al 80% y 100%

2. **Revisar costos semanalmente:**
   - Ir a **Cost Explorer**
   - Verificar que los costos están dentro del presupuesto

### Backups

1. **Backup de Base de Datos:**
   ```bash
   # Crear script de backup
   nano ~/backup-db.sh
   
   # Contenido:
   #!/bin/bash
   docker-compose exec -T mysql mysqldump -u root -p${MYSQL_ROOT_PASSWORD} ${MYSQL_DATABASE} > ~/backups/db_$(date +%Y%m%d_%H%M%S).sql
   
   # Hacer ejecutable
   chmod +x ~/backup-db.sh
   
   # Agregar a crontab (backup diario a las 2 AM)
   crontab -e
   # Agregar: 0 2 * * * /home/ubuntu/backup-db.sh
   ```

2. **Backup de Código:**
   - El código está en Git, así que ya está respaldado
   - Hacer push regularmente

3. **Snapshot de EBS:**
   - Ir a **EC2** → **Volumes**
   - Seleccionar volumen de la instancia
   - **Actions** → **Create snapshot**
   - Hacer snapshots semanales o mensuales

### Actualizaciones

1. **Actualizar Sistema:**
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

2. **Actualizar Docker:**
   ```bash
   sudo apt-get update
   sudo apt-get install docker-ce docker-ce-cli containerd.io
   ```

3. **Actualizar Aplicación:**
   ```bash
   cd ~/inmobiliaria
   git pull origin main
   docker-compose build --no-cache
   docker-compose up -d
   ```

### Logs y Monitoreo

1. **Ver logs de aplicación:**
   ```bash
   docker-compose logs -f api
   ```

2. **Ver logs de Nginx:**
   ```bash
   sudo tail -f /var/log/nginx/access.log
   sudo tail -f /var/log/nginx/error.log
   ```

3. **Monitorear recursos:**
   ```bash
   # CPU y memoria
   htop

   # Espacio en disco
   df -h

   # Uso de Docker
   docker stats
   ```

---

## 📊 Resumen de Costos

### Costo Mensual Estimado (Base)

| Servicio | Especificación | Costo Mensual |
|----------|---------------|---------------|
| **EC2 t3.small** | 2GB RAM, 2 vCPU | $15.00 |
| **EBS gp3** | 30GB almacenamiento | $2.50 |
| **S3** | 10GB + requests | $0.50-1.00 |
| **Transferencia** | 1GB salida | $0.09 |
| **TOTAL BASE** | | **USD 18.09-19.09/mes** |

**Con Free Tier (primeros 12 meses):**
- t2.micro gratis → **Ahorro: $7.50/mes**
- **Total con Free Tier: USD 10.59-11.59/mes**

### Costo Mensual con Sistema de Avalúos IA (Nuevo)

| Servicio | Especificación | Costo Mensual |
|----------|---------------|---------------|
| **Base (EC2 + EBS + S3)** | | $18.09-19.09 |
| **OpenAI API** | Embeddings + GPT-4o-mini | $2.00-5.00 |
| **S3 adicional** | Documentos (1-5GB) | $0.02-0.12 |
| **ChromaDB** | Incluido en EC2 | $0.00 |
| **TOTAL CON IA** | | **USD 20.11-24.21/mes** |

**Con Free Tier:**
- **Total con Free Tier + IA: USD 12.61-16.71/mes**

**✅ Dentro del presupuesto de $23/mes** (con uso moderado de IA)

---

## 🎯 Próximos Pasos

1. ✅ **Configurar dominio** (si tienes uno)
2. ✅ **Configurar SSL** con Let's Encrypt
3. ✅ **Configurar backups automáticos**
4. ✅ **Configurar monitoreo** con CloudWatch
5. ✅ **Optimizar costos** (reserved instances si planeas >1 año)

---

## 📚 Recursos Adicionales

- **Documentación AWS:** https://docs.aws.amazon.com/
- **Docker Documentation:** https://docs.docker.com/
- **Nginx Documentation:** https://nginx.org/en/docs/

---

## ✅ Conclusión

Con esta guía deberías tener:
- ✅ Cuenta AWS configurada
- ✅ Usuario IAM con permisos correctos
- ✅ S3 Bucket creado y configurado
- ✅ VPC por defecto funcionando
- ✅ Security Group configurado
- ✅ Instancia EC2 corriendo
- ✅ Aplicación desplegada y funcionando
- ✅ Nginx configurado como reverse proxy
- ✅ Conocimiento de errores comunes y cómo solucionarlos

**Tiempo total de implementación:** ~2-3 horas (primera vez)

**Costo mensual:** USD 18-19/mes (o USD 10-11/mes con Free Tier)

---

**¿Problemas?** Revisa la sección de [Errores Comunes](#errores-comunes-y-soluciones) o los logs de los servicios.

