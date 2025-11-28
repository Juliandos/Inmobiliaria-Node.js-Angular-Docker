# 🚀 Guía Completa de Despliegue en AWS

Esta guía te ayudará a desplegar tu aplicación completa (MySQL, API Node.js, Frontend Angular) en AWS usando servicios gestionados.

## 📋 Tabla de Contenidos

1. [Arquitectura Propuesta](#arquitectura-propuesta)
2. [Prerrequisitos](#prerrequisitos)
3. [Paso 1: Configurar RDS MySQL](#paso-1-configurar-rds-mysql)
4. [Paso 2: Crear ECR (Container Registry)](#paso-2-crear-ecr-container-registry)
5. [Paso 3: Construir y Subir Imágenes Docker](#paso-3-construir-y-subir-imágenes-docker)
6. [Paso 4: Configurar ECS Fargate](#paso-4-configurar-ecs-fargate)
7. [Paso 5: Configurar Application Load Balancer](#paso-5-configurar-application-load-balancer)
8. [Paso 6: Configurar Variables de Entorno](#paso-6-configurar-variables-de-entorno)
9. [Paso 7: Desplegar Frontend en S3 + CloudFront](#paso-7-desplegar-frontend-en-s3--cloudfront)
10. [Paso 8: Ejecutar Migraciones y Seed](#paso-8-ejecutar-migraciones-y-seed)
11. [Costos Estimados](#costos-estimados)
12. [Solución de Problemas](#solución-de-problemas)

---

## 🏗️ Arquitectura Propuesta

```
┌─────────────────────────────────────────────────────────┐
│                    CloudFront                            │
│              (CDN para Frontend)                         │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                    S3 Bucket                            │
│              (Frontend Angular Estático)                  │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│              Application Load Balancer                   │
│                    (ALB)                                 │
└───────┬───────────────────────────────────────┬─────────┘
        │                                       │
        ▼                                       ▼
┌──────────────────┐                  ┌──────────────────┐
│   ECS Fargate    │                  │   ECS Fargate    │
│   (Frontend)     │                  │   (API)          │
│   Nginx          │                  │   Node.js        │
└──────────────────┘                  └────────┬─────────┘
                                               │
                                               ▼
                                    ┌──────────────────┐
                                    │   RDS MySQL      │
                                    │   (Base Datos)   │
                                    └──────────────────┘

                                    ┌──────────────────┐
                                    │   S3 Bucket      │
                                    │   (Imágenes)     │
                                    └──────────────────┘
```

---

## ✅ Prerrequisitos

1. **Cuenta de AWS activa** con permisos de administrador
2. **AWS CLI instalado y configurado**
   ```bash
   aws --version
   aws configure
   ```
3. **Docker instalado** (para construir imágenes)
4. **jq instalado** (para procesar JSON en scripts)
   ```bash
   # Windows (Git Bash)
   # Descargar desde: https://stedolan.github.io/jq/download/
   ```

---

## 📦 Paso 1: Configurar RDS MySQL

### 1.1 Crear Base de Datos RDS

1. Ve a la consola de AWS → **RDS**
2. Haz clic en **"Create database"**
3. Configuración:
   - **Engine**: MySQL
   - **Version**: MySQL 8.0
   - **Template**: Free tier (para desarrollo) o Production
   - **DB instance identifier**: `inmobiliaria-db`
   - **Master username**: `admin`
   - **Master password**: [Genera una contraseña segura]
   - **DB instance class**: `db.t3.micro` (free tier) o `db.t3.small` (producción)
   - **Storage**: 20 GB (free tier) o según necesidad
   - **VPC**: Default VPC o crea una nueva
   - **Public access**: Yes (para desarrollo) o No (más seguro) seleccionada
   - **Security group**: Crea uno nuevo llamado `inmobiliaria-db-sg`
   - **Database name**: `db_inmobiliaria`

4. Haz clic en **"Create database"**

### 1.2 Configurar Security Group

1. Ve a **EC2** → **Security Groups**
2. Selecciona `inmobiliaria-db-sg`
3. **Inbound rules**:
   - Type: MySQL/Aurora
   - Port: 3306
   - Source: El security group de tu ECS (lo crearemos después) o `0.0.0.0/0` para desarrollo

### 1.3 Obtener Endpoint de RDS

1. En RDS, selecciona tu base de datos
2. Copia el **Endpoint** (ejemplo: `inmobiliaria-db.xxxxx.us-east-1.rds.amazonaws.com`)
3. Guarda esta información para las variables de entorno

---

## 🐳 Paso 2: Crear ECR (Container Registry)

### 2.1 Crear Repositorios ECR

Ejecuta estos comandos o usa la consola de AWS:

```bash
# Crear repositorio para API
aws ecr create-repository --repository-name inmobiliaria-api --region us-east-1

# Crear repositorio para Frontend
aws ecr create-repository --repository-name inmobiliaria-frontend --region us-east-1
```

### 2.2 Autenticarse en ECR

```bash
# Obtener token de autenticación
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <TU_ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com

# Reemplaza <TU_ACCOUNT_ID> con tu Account ID de AWS
# Lo puedes encontrar en: AWS Console → Support → Support Center (arriba a la derecha)
```

---

## 🏗️ Paso 3: Construir y Subir Imágenes Docker

### 3.1 Obtener Account ID y Region

```bash
# Obtener Account ID
export AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
export AWS_REGION=us-east-1  # Cambia según tu región

echo "Account ID: $AWS_ACCOUNT_ID"
echo "Region: $AWS_REGION"
```

### 3.2 Construir y Subir Imagen de API

```bash
# Navegar a la carpeta del proyecto
cd "ruta/a/tu/proyecto"

# Construir imagen
docker build -t inmobiliaria-api ./API

# Etiquetar imagen
docker tag inmobiliaria-api:latest $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/inmobiliaria-api:latest

# Subir imagen
docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/inmobiliaria-api:latest
```

### 3.3 Construir y Subir Imagen de Frontend

```bash
# Construir imagen
docker build -t inmobiliaria-frontend ./Front

# Etiquetar imagen
docker tag inmobiliaria-frontend:latest $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/inmobiliaria-frontend:latest

# Subir imagen
docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/inmobiliaria-frontend:latest
```

**O usa el script automatizado**: `scripts/deploy-to-ecr.sh`

---

## ☸️ Paso 4: Configurar ECS Fargate

### 4.1 Crear Cluster ECS

1. Ve a **ECS** → **Clusters**
2. Haz clic en **"Create Cluster"**
3. Configuración:
   - **Cluster name**: `inmobiliaria-cluster`
   - **Infrastructure**: AWS Fargate (Serverless)
4. Haz clic en **"Create"**

### 4.2 Crear Task Definition para API

1. Ve a **ECS** → **Task Definitions** → **Create new Task Definition**
2. Configuración:
   - **Task definition family**: `inmobiliaria-api`
   - **Launch type**: Fargate
   - **Task size**:
     - CPU: 0.25 vCPU (256)
     - Memory: 0.5 GB (512)
   - **Container**:
     - **Name**: `api`
     - **Image URI**: `TU_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/inmobiliaria-api:latest`
     - **Port mappings**: 3001:3001
     - **Environment variables**: (Ver Paso 6)

**O usa el archivo**: `aws/ecs-api-task-definition.json` (edítalo y súbelo)

### 4.3 Crear Task Definition para Frontend

Similar al anterior:
- **Task definition family**: `inmobiliaria-frontend`
- **CPU**: 0.25 vCPU
- **Memory**: 0.5 GB
- **Image URI**: `TU_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/inmobiliaria-frontend:latest`
- **Port mappings**: 80:80

**O usa el archivo**: `aws/ecs-frontend-task-definition.json`

### 4.4 Crear Security Group para ECS

1. Ve a **EC2** → **Security Groups** → **Create security group**
2. Configuración:
   - **Name**: `inmobiliaria-ecs-sg`
   - **Inbound rules**:
     - HTTP (80) desde ALB security group
     - Custom TCP (3001) desde ALB security group
   - **Outbound rules**: All traffic

---

## ⚖️ Paso 5: Configurar Application Load Balancer

### 5.1 Crear ALB

1. Ve a **EC2** → **Load Balancers** → **Create Load Balancer**
2. Selecciona **Application Load Balancer**
3. Configuración:
   - **Name**: `inmobiliaria-alb`
   - **Scheme**: Internet-facing
   - **IP address type**: IPv4
   - **VPC**: Tu VPC
   - **Subnets**: Selecciona al menos 2 subnets públicas
   - **Security group**: Crea uno nuevo `inmobiliaria-alb-sg`
     - Inbound: HTTP (80) y HTTPS (443) desde 0.0.0.0/0
   - **Listener**: HTTP (80)
   - **Target group**: Lo crearemos después

### 5.2 Crear Target Group para API

1. Ve a **EC2** → **Target Groups** → **Create target group**
2. Configuración:
   - **Target type**: IP addresses
   - **Name**: `inmobiliaria-api-tg`
   - **Protocol**: HTTP
   - **Port**: 3001
   - **VPC**: Tu VPC
   - **Health check path**: `/health` o `/` (ajusta según tu API)

### 5.3 Crear Target Group para Frontend

Similar:
- **Name**: `inmobiliaria-frontend-tg`
- **Port**: 80
- **Health check path**: `/`

### 5.4 Configurar Listener Rules en ALB

1. Selecciona tu ALB → **Listeners** → **View/edit rules**
2. Agrega reglas:
   - **Rule 1**: Si path es `/api/*` → Forward to `inmobiliaria-api-tg`
   - **Rule 2**: Default → Forward to `inmobiliaria-frontend-tg`

---

## 🔧 Paso 6: Configurar Variables de Entorno

### 6.1 Variables para API (Task Definition)

En la Task Definition de API, agrega estas variables de entorno:

```json
{
  "environment": [
    {
      "name": "NODE_ENV",
      "value": "production"
    },
    {
      "name": "PORT",
      "value": "3001"
    },
    {
      "name": "DB_HOST",
      "value": "TU_RDS_ENDPOINT"
    },
    {
      "name": "DB_PORT",
      "value": "3306"
    },
    {
      "name": "DB_NAME",
      "value": "db_inmobiliaria"
    },
    {
      "name": "DB_USER",
      "value": "admin"
    },
    {
      "name": "DB_PASS",
      "value": "TU_PASSWORD"  // Usa Secrets Manager en producción
    },
    {
      "name": "JWT_SECRET",
      "value": "TU_JWT_SECRET"
    },
    {
      "name": "JWT_REFRESH_SECRET",
      "value": "TU_JWT_REFRESH_SECRET"
    },
    {
      "name": "AWS_REGION",
      "value": "us-east-1"
    },
    {
      "name": "AWS_S3_BUCKET_NAME",
      "value": "inmobiliaria-propiedades"
    }
  ],
  "secrets": [
    {
      "name": "AWS_ACCESS_KEY_ID",
      "valueFrom": "arn:aws:secretsmanager:REGION:ACCOUNT:secret:inmobiliaria/aws-credentials:ACCESS_KEY_ID::"
    },
    {
      "name": "AWS_SECRET_ACCESS_KEY",
      "valueFrom": "arn:aws:secretsmanager:REGION:ACCOUNT:secret:inmobiliaria/aws-credentials:SECRET_ACCESS_KEY::"
    }
  ]
}
```

### 6.2 Variables para Frontend

El frontend necesita la URL de la API. Usa el script `scripts/build-frontend-with-env.sh` o configura en el Dockerfile.

---

## 🌐 Paso 7: Desplegar Frontend en S3 + CloudFront (Opcional pero Recomendado)

### 7.1 Crear Bucket S3 para Frontend

```bash
aws s3 mb s3://inmobiliaria-frontend --region us-east-1
```

### 7.2 Configurar Bucket para Hosting Estático

1. Ve a S3 → Tu bucket → **Properties**
2. **Static website hosting**: Enable
3. **Index document**: `index.html`
4. **Error document**: `index.html` (para SPA)

### 7.3 Subir Archivos del Frontend

```bash
# Compilar Angular para producción
cd Front
npm run build

# Subir a S3
aws s3 sync dist/coreui-free-angular-admin-template/browser s3://inmobiliaria-frontend --delete
```

### 7.4 Crear CloudFront Distribution

1. Ve a **CloudFront** → **Create Distribution**
2. **Origin domain**: Selecciona tu bucket S3
3. **Viewer protocol policy**: Redirect HTTP to HTTPS
4. **Default root object**: `index.html`
5. **Error pages**: 
   - 404 → `/index.html` (200)
   - 403 → `/index.html` (200)

---

## 🌱 Paso 8: Ejecutar Migraciones y Seed

### Opción 1: Ejecutar desde tu máquina local

```bash
# Conectar a RDS desde tu máquina
export DB_HOST=TU_RDS_ENDPOINT
export DB_USER=admin
export DB_PASS=TU_PASSWORD
export DB_NAME=db_inmobiliaria

cd API
npm run migrate-all
npm run seed
```

### Opción 2: Ejecutar desde ECS Task

1. Crea un Task Definition temporal con el mismo contenedor de API
2. Ejecuta como Task one-off en ECS
3. Comando override: `npm run migrate-all && npm run seed`

---

## 💰 Costos Estimados

### Opción 1: Free Tier (Primeros 12 meses)
- **RDS MySQL db.t3.micro**: Gratis (750 horas/mes)
- **ECS Fargate**: ~$15-30/mes (dependiendo del uso)
- **ALB**: ~$16/mes
- **S3**: ~$1-5/mes
- **CloudFront**: ~$1-10/mes
- **Total**: ~$33-61/mes

### Opción 2: Producción Pequeña
- **RDS MySQL db.t3.small**: ~$30/mes
- **ECS Fargate**: ~$30-50/mes
- **ALB**: ~$16/mes
- **S3**: ~$5-10/mes
- **CloudFront**: ~$5-15/mes
- **Total**: ~$86-121/mes

### Opción 3: Producción Media
- **RDS MySQL db.t3.medium**: ~$60/mes
- **ECS Fargate**: ~$50-100/mes
- **ALB**: ~$16/mes
- **S3**: ~$10-20/mes
- **CloudFront**: ~$10-30/mes
- **Total**: ~$146-226/mes

---

## 🔍 Solución de Problemas

### Error: "Cannot connect to RDS"
- Verifica Security Groups: RDS debe permitir conexiones desde ECS
- Verifica que el endpoint sea correcto
- Verifica credenciales

### Error: "Task failed to start"
- Revisa logs en CloudWatch Logs
- Verifica variables de entorno
- Verifica que la imagen esté en ECR

### Error: "502 Bad Gateway"
- Verifica que los servicios estén corriendo
- Revisa health checks en Target Groups
- Verifica Security Groups del ALB

### Frontend no carga
- Verifica CORS en la API
- Verifica que la URL de la API sea correcta
- Revisa la consola del navegador

---

## 📚 Recursos Adicionales

- [Documentación ECS](https://docs.aws.amazon.com/ecs/)
- [Documentación RDS](https://docs.aws.amazon.com/rds/)
- [Documentación ALB](https://docs.aws.amazon.com/elasticloadbalancing/)
- [Documentación CloudFront](https://docs.aws.amazon.com/cloudfront/)

---

## 🚀 Próximos Pasos

1. Configurar HTTPS con Certificate Manager
2. Configurar Auto Scaling para ECS
3. Configurar CloudWatch Alarms
4. Configurar CI/CD con GitHub Actions o CodePipeline
5. Configurar Secrets Manager para credenciales
6. Configurar VPC más segura con subnets privadas

