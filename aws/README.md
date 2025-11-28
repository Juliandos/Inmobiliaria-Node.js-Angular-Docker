# Archivos de Configuración AWS

Este directorio contiene los archivos de configuración para desplegar en AWS.

## Archivos

- `ecs-api-task-definition.json`: Task Definition para el servicio API
- `ecs-frontend-task-definition.json`: Task Definition para el servicio Frontend

## Uso

### 1. Editar los archivos

Antes de usar estos archivos, debes reemplazar los siguientes valores:

#### En ambos archivos:
- `ACCOUNT_ID`: Tu AWS Account ID
- `REGION`: Tu región de AWS (ej: us-east-1)

#### En `ecs-api-task-definition.json`:
- `RDS_ENDPOINT`: Endpoint de tu instancia RDS
- `DB_USER`: Usuario de la base de datos
- Secrets Manager ARNs: Actualiza con tus ARNs reales

#### En `ecs-frontend-task-definition.json`:
- `API_URL`: URL de tu API (ALB endpoint o dominio)

### 2. Crear Secrets en AWS Secrets Manager

Antes de usar las Task Definitions, crea los siguientes secrets:

```bash
# DB Password
aws secretsmanager create-secret \
  --name inmobiliaria/db-password \
  --secret-string "TU_PASSWORD_AQUI" \
  --region us-east-1

# JWT Secret
aws secretsmanager create-secret \
  --name inmobiliaria/jwt-secret \
  --secret-string "TU_JWT_SECRET_AQUI" \
  --region us-east-1

# JWT Refresh Secret
aws secretsmanager create-secret \
  --name inmobiliaria/jwt-refresh-secret \
  --secret-string "TU_JWT_REFRESH_SECRET_AQUI" \
  --region us-east-1

# AWS Credentials (JSON)
aws secretsmanager create-secret \
  --name inmobiliaria/aws-credentials \
  --secret-string '{"ACCESS_KEY_ID":"TU_KEY","SECRET_ACCESS_KEY":"TU_SECRET"}' \
  --region us-east-1
```

### 3. Registrar Task Definitions

```bash
aws ecs register-task-definition \
  --cli-input-json file://ecs-api-task-definition.json \
  --region us-east-1

aws ecs register-task-definition \
  --cli-input-json file://ecs-frontend-task-definition.json \
  --region us-east-1
```

### 4. Crear IAM Roles

Asegúrate de que existan estos roles:

- `ecsTaskExecutionRole`: Para ejecutar tareas ECS
- `ecsTaskRole`: Para permisos de la aplicación

Puedes crearlos usando el script `scripts/setup-aws-resources.sh`

## Notas

- Los valores de CPU y Memory pueden ajustarse según tus necesidades
- Los health checks pueden necesitar ajustes según tu aplicación
- En producción, usa Secrets Manager para todas las credenciales

