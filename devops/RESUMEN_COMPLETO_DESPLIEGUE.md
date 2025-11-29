# 📋 Resumen Completo del Proceso de Despliegue en AWS

## 🎯 Objetivo
Llevar la aplicación Inmobiliaria desde un estado inicial (con recursos básicos creados pero sin servicios funcionando) hasta un despliegue completo y funcional en AWS, accesible desde internet en `http://inmobiliaria-alb-556370462.us-east-1.elb.amazonaws.com/`

---

## 📊 Estado Inicial (Punto de Partida)

Según `RESUMEN_DESPLIEGUE_AWS.md`, el proyecto tenía:

### ✅ Recursos Ya Creados:
- **RDS MySQL**: Instancia `inmobiliaria-db` activa y accesible
- **ECR**: Repositorios para API y Frontend con imágenes Docker
- **ECS Cluster**: `inmobiliaria-cluster` creado pero sin servicios
- **Task Definitions**: Registradas pero sin servicios asociados
- **S3 Buckets**: Configurados para almacenamiento

### ❌ Faltaba:
- **Security Groups** para ECS y ALB
- **Application Load Balancer (ALB)** y Target Groups
- **ECS Services** para ejecutar los contenedores
- **Configuración de red** entre componentes
- **Health checks** funcionando correctamente
- **Base de datos poblada** con datos iniciales

---

## 🚀 Proceso Completo Realizado

### FASE 1: Creación de Infraestructura Base

#### 1.1 Security Groups
**Script usado**: `desplegar-aws.sh` (Paso 1)

**Acciones realizadas**:
- Creación de Security Group para ECS (`inmobiliaria-ecs-sg`)
  - Regla outbound: Permitir todo tráfico saliente
  - Reglas inbound: HTTP (80) y Custom TCP (3001) desde ALB
- Creación de Security Group para ALB (`inmobiliaria-alb-sg`)
  - Reglas inbound: HTTP (80) y HTTPS (443) desde internet
- Actualización de Security Group de RDS
  - Regla inbound: MySQL (3306) desde ECS Security Group

**Comandos clave**:
```bash
aws ec2 create-security-group --group-name inmobiliaria-ecs-sg ...
aws ec2 authorize-security-group-ingress ...
```

#### 1.2 Application Load Balancer y Target Groups
**Script usado**: `desplegar-aws.sh` (Paso 2)

**Acciones realizadas**:
- Creación de Target Group para API (`inmobiliaria-api-tg`)
  - Puerto: 3001
  - Health check path: `/api/health` (luego corregido a `/health`)
  - Protocolo: HTTP
- Creación de Target Group para Frontend (`inmobiliaria-frontend-tg`)
  - Puerto: 80
  - Health check path: `/`
  - Protocolo: HTTP
- Creación de Application Load Balancer (`inmobiliaria-alb`)
  - Tipo: Internet-facing
  - Subnets: 2 subnets públicas en diferentes AZs
  - Listener: Puerto 80 con reglas de enrutamiento
    - `/api/*` → Target Group API
    - Default → Target Group Frontend

**DNS obtenido**: `inmobiliaria-alb-556370462.us-east-1.elb.amazonaws.com`

**Comandos clave**:
```bash
aws elbv2 create-target-group --name inmobiliaria-api-tg ...
aws elbv2 create-load-balancer --name inmobiliaria-alb ...
aws elbv2 create-rule --conditions Field=path-pattern,Values='/api/*' ...
```

#### 1.3 ECS Services
**Script usado**: `desplegar-aws.sh` (Paso 4)

**Acciones realizadas**:
- Creación de Service para API (`inmobiliaria-api-service`)
  - Task Definition: `inmobiliaria-api`
  - Desired count: 1
  - Launch type: Fargate
  - Network: VPC con subnets públicas, Security Group ECS
  - Load balancer: Conectado a Target Group API
- Creación de Service para Frontend (`inmobiliaria-frontend-service`)
  - Task Definition: `inmobiliaria-frontend`
  - Desired count: 1
  - Launch type: Fargate
  - Network: VPC con subnets públicas, Security Group ECS
  - Load balancer: Conectado a Target Group Frontend

**Comandos clave**:
```bash
aws ecs create-service --cluster inmobiliaria-cluster --service-name inmobiliaria-api-service ...
```

---

### FASE 2: Resolución de Problemas Críticos

#### 2.1 Error: Tasks No Iniciaban - IAM Role
**Problema**: ECS no podía asumir el rol `ecsTaskExecutionRole`

**Script usado**: `corregir-y-redesplegar.sh`

**Solución**:
- Verificación del rol IAM `ecsTaskExecutionRole`
- Adjuntar política `AmazonECSTaskExecutionRolePolicy` si faltaba
- Forzar nuevo deployment de los servicios

**Comandos clave**:
```bash
aws iam attach-role-policy --role-name ecsTaskExecutionRole --policy-arn arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy
aws ecs update-service --force-new-deployment ...
```

#### 2.2 Error: CloudWatch Log Groups No Existentes
**Problema**: Tasks fallaban con "ResourceNotFoundException: The specified log group does not exist"

**Script usado**: `crear-log-groups.sh`

**Solución**:
- Creación de log groups en CloudWatch:
  - `/ecs/inmobiliaria-api`
  - `/ecs/inmobiliaria-frontend`
- Configuración de retención de logs (7 días)
- Forzar nuevo deployment después de crear los log groups

**Comandos clave**:
```bash
aws logs create-log-group --log-group-name /ecs/inmobiliaria-api
aws logs put-retention-policy --log-group-name /ecs/inmobiliaria-api --retention-in-days 7
```

#### 2.3 Error: Frontend No Conectaba a API
**Problema**: Frontend intentaba conectar a `localhost:3001` en lugar del ALB

**Solución**:
- Actualización de `Front/src/environments/environment.ts`
  - Cambio de `apiUrl: 'http://localhost:3001'` a `apiUrl: 'http://inmobiliaria-alb-556370462.us-east-1.elb.amazonaws.com/api'`
- Actualización de Task Definition del Frontend con nueva `API_URL`
- Redespliegue del servicio Frontend

**Script usado**: `actualizar-api-url-manual.sh` / `redesplegar-frontend.sh`

#### 2.4 Error: API Retornaba 503 Service Temporarily Unavailable
**Problema**: Health checks del ALB fallaban porque el path estaba mal configurado

**Diagnóstico**:
- El Target Group estaba configurado con health check path `/api/health`
- La API tenía el endpoint en `/health` (sin prefijo `/api`)
- Los targets nunca pasaban a estado "healthy"

**Script usado**: `corregir-health-check-final.sh` / `redesplegar-api-con-health.sh`

**Solución**:
1. Agregar endpoint `/health` explícito en `API/src/main.ts` (fuera del prefijo `/api`)
2. Corregir Health Check Path del Target Group a `/health`
3. Redesplegar la API con la nueva imagen

**Código agregado**:
```typescript
// API/src/main.ts
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'API is running',
    timestamp: new Date().toISOString()
  });
});
```

**Comandos clave**:
```bash
aws elbv2 modify-target-group --target-group-arn $API_TG_ARN --health-check-path /health
```

#### 2.5 Error: Autenticación Fallaba - Base de Datos Vacía
**Problema**: No había usuarios en la base de datos RDS

**Script usado**: `ejecutar-seed-aws-simple.sh`

**Solución**:
- Ejecución de migraciones y seed desde máquina local
- Conexión a RDS usando variables de entorno locales
- Población de base de datos con usuarios y propiedades

**Comandos clave**:
```bash
cd API
npm run seed-with-migrations
```

**Credenciales creadas**:
- Email: `admin@test.com`
- Contraseña: `123456`

---

### FASE 3: Optimizaciones y Verificaciones Finales

#### 3.1 Verificación de Health Checks
- Targets en estado "healthy"
- Health checks respondiendo correctamente
- Logs sin errores críticos

#### 3.2 Verificación de Funcionalidad
- Frontend carga correctamente
- API responde en `/health`
- Login funciona con credenciales de seed
- Aplicación completamente funcional

---

## 📁 Archivos Scripts Importantes y Su Función

### Scripts de Despliegue Principal

#### `desplegar-aws.sh`
**Función**: Script maestro que automatiza todo el despliegue inicial
- Crea/verifica Security Groups (ECS y ALB)
- Crea Target Groups y ALB
- Configura reglas de enrutamiento
- Actualiza Security Groups
- Crea ECS Services
- Monitorea el progreso del despliegue

**Uso**: Ejecutar una vez para crear toda la infraestructura base

#### `paso-1-security-groups.sh`
**Función**: Crea los Security Groups necesarios
- Verifica si ya existen antes de crear
- Configura reglas inbound/outbound

#### `paso-2-alb-target-groups.sh`
**Función**: Crea Target Groups y ALB
- Crea Target Groups para API y Frontend
- Crea el Application Load Balancer
- Configura listener rules

#### `paso-3-actualizar-security-groups.sh`
**Función**: Actualiza reglas de Security Groups
- Permite tráfico entre ALB y ECS
- Permite conexiones de ECS a RDS

#### `paso-4-crear-services.sh`
**Función**: Crea los ECS Services
- Crea service para API
- Crea service para Frontend
- Configura load balancers

### Scripts de Corrección y Troubleshooting

#### `corregir-y-redesplegar.sh`
**Función**: Corrige problemas de IAM y fuerza nuevo deployment
- Verifica y corrige rol `ecsTaskExecutionRole`
- Adjunta políticas necesarias
- Fuerza nuevo deployment de servicios

#### `crear-log-groups.sh`
**Función**: Crea log groups de CloudWatch
- Crea `/ecs/inmobiliaria-api`
- Crea `/ecs/inmobiliaria-frontend`
- Configura retención de logs

#### `redesplegar-services.sh`
**Función**: Fuerza nuevo deployment de ambos servicios
- Útil después de crear log groups o corregir configuraciones

#### `corregir-health-check-final.sh`
**Función**: Corrige el Health Check Path del Target Group API
- Cambia de `/api/health` a `/health`

#### `redesplegar-api-con-health.sh`
**Función**: Redesplega la API con el endpoint `/health` correcto
- Construye nueva imagen Docker
- Sube a ECR
- Fuerza nuevo deployment
- Corrige Health Check Path

#### `actualizar-api-url-manual.sh` / `actualizar-api-url-simple.sh`
**Función**: Actualiza `API_URL` en Task Definition del Frontend
- Obtiene Task Definition actual
- Modifica variable `API_URL`
- Registra nueva revisión
- Actualiza el servicio

#### `redesplegar-frontend.sh`
**Función**: Redesplega el Frontend con nueva configuración
- Construye imagen con `API_URL` correcta
- Sube a ECR
- Fuerza nuevo deployment

### Scripts de Diagnóstico

#### `diagnosticar-services.sh`
**Función**: Diagnostica problemas con ECS Services
- Verifica estado de servicios
- Muestra eventos recientes
- Lista tareas y sus detalles
- Muestra logs recientes

#### `diagnostico-completo-api.sh`
**Función**: Diagnóstico completo de la API
- Verifica estado del servicio
- Verifica health de targets
- Muestra configuración de health check
- Muestra logs recientes

#### `diagnosticar-api-503.sh`
**Función**: Diagnostica específicamente el error 503
- Verifica estado del servicio
- Verifica health de targets
- Muestra configuración de health check
- Muestra logs de API

### Scripts de Verificación

#### `verificar-rol-ecs.sh`
**Función**: Verifica configuración del rol IAM
- Verifica existencia del rol
- Verifica políticas adjuntas
- Muestra configuración completa

#### `verificar-usuarios-db.sh`
**Función**: Verifica usuarios en la base de datos
- Consulta usuarios creados
- Muestra propiedades
- Útil para verificar que el seed funcionó

#### `verificar-api-health.sh`
**Función**: Verifica health de los targets del API
- Muestra estado de health checks
- Útil para verificar que los targets están healthy

#### `verificar-api-targets.sh`
**Función**: Verifica configuración de targets
- Muestra detalles de targets
- Muestra estado de health

#### `verificar-imagenes-ecr.sh`
**Función**: Verifica imágenes en ECR
- Lista imágenes disponibles
- Verifica tags

### Scripts de Seed y Migraciones

#### `ejecutar-seed-aws-simple.sh`
**Función**: Ejecuta seed y migraciones en RDS
- Ejecuta `npm run seed-with-migrations`
- Conecta a RDS desde local
- Puebla la base de datos

#### `ejecutar-seed-aws.sh`
**Función**: Versión más completa del script de seed
- Similar a `ejecutar-seed-aws-simple.sh` pero con más verificaciones

#### `consultar-base-datos.sh`
**Función**: Consulta contenido de la base de datos
- Útil para verificar datos después del seed

### Archivos de Configuración

#### `valores-aws-config.txt`
**Función**: Almacena valores importantes de AWS
- VPC ID
- Subnet IDs
- Security Group IDs
- Endpoints de RDS y ECR
- Account ID y región

**⚠️ IMPORTANTE**: Este archivo contiene información sensible y debe estar en `.gitignore`

---

## 🔧 Cambios en el Código de la Aplicación

### API (`API/src/main.ts`)
**Cambio**: Agregado endpoint `/health` explícito
```typescript
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'API is running',
    timestamp: new Date().toISOString()
  });
});
```

### Frontend (`Front/src/environments/environment.ts`)
**Cambio**: Actualizado `apiUrl` para apuntar al ALB
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://inmobiliaria-alb-556370462.us-east-1.elb.amazonaws.com/api'
};
```

---

## 🎯 Resultado Final

### Estado Actual:
✅ **Aplicación completamente funcional en AWS**
- URL: `http://inmobiliaria-alb-556370462.us-east-1.elb.amazonaws.com/`
- Frontend: Funcionando correctamente
- API: Respondiendo correctamente en `/api/*`
- Base de datos: Poblada con usuarios y propiedades
- Health checks: Funcionando correctamente
- Logs: Disponibles en CloudWatch

### Recursos AWS Activos:
- **RDS MySQL**: `inmobiliaria-db` (activo)
- **ECR**: Repositorios con imágenes Docker
- **ECS Cluster**: `inmobiliaria-cluster` (activo)
- **ECS Services**: 
  - `inmobiliaria-api-service` (1/1 running)
  - `inmobiliaria-frontend-service` (1/1 running)
- **ALB**: `inmobiliaria-alb` (activo)
- **Target Groups**: 
  - `inmobiliaria-api-tg` (targets healthy)
  - `inmobiliaria-frontend-tg` (targets healthy)
- **Security Groups**: 
  - `inmobiliaria-ecs-sg`
  - `inmobiliaria-alb-sg`
  - `inmobiliaria-db-sg` (actualizado)

---

## 📝 Lecciones Aprendidas

1. **Health Checks son críticos**: El path del health check debe coincidir exactamente con el endpoint de la aplicación
2. **IAM Roles**: Los roles de ECS deben tener las políticas correctas adjuntas
3. **CloudWatch Logs**: Los log groups deben existir antes de que los servicios intenten escribir en ellos
4. **Variables de Entorno**: El Frontend necesita la URL correcta del ALB, no localhost
5. **Base de Datos**: El seed debe ejecutarse después de crear los servicios, conectándose desde local a RDS
6. **Verificaciones**: Es importante verificar cada paso antes de continuar al siguiente

---

## 🔄 Comandos Útiles para Mantenimiento

### Ver estado de servicios:
```bash
aws ecs describe-services --cluster inmobiliaria-cluster --services inmobiliaria-api-service inmobiliaria-frontend-service --query 'services[*].[serviceName,status,runningCount]' --output table
```

### Ver health de targets:
```bash
API_TG_ARN=$(aws elbv2 describe-target-groups --names inmobiliaria-api-tg --query 'TargetGroups[0].TargetGroupArn' --output text)
aws elbv2 describe-target-health --target-group-arn $API_TG_ARN
```

### Ver logs:
```bash
aws logs tail /ecs/inmobiliaria-api --follow
aws logs tail /ecs/inmobiliaria-frontend --follow
```

### Forzar nuevo deployment:
```bash
aws ecs update-service --cluster inmobiliaria-cluster --service inmobiliaria-api-service --force-new-deployment
aws ecs update-service --cluster inmobiliaria-cluster --service inmobiliaria-frontend-service --force-new-deployment
```

---

**Última actualización**: Despliegue completado exitosamente  
**Estado**: ✅ Aplicación funcionando en producción

