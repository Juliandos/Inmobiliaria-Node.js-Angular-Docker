# Guía para Configurar AWS S3

Esta guía te ayudará a configurar AWS S3 para tu aplicación de Inmobiliaria.

## 📋 Tabla de Contenidos
1. [Crear un Bucket S3](#1-crear-un-bucket-s3)
2. [Configurar Permisos del Bucket](#2-configurar-permisos-del-bucket)
3. [Crear un Usuario IAM](#3-crear-un-usuario-iam)
4. [Obtener Credenciales](#4-obtener-credenciales)
5. [Configurar Variables de Entorno](#5-configurar-variables-de-entorno)

---

## 1. Crear un Bucket S3

### Paso 1: Acceder a la Consola de S3
1. Inicia sesión en [AWS Console](https://console.aws.amazon.com/)
2. Busca "S3" en la barra de búsqueda superior
3. Haz clic en "S3" para abrir el servicio

### Paso 2: Crear el Bucket
1. Haz clic en el botón **"Create bucket"** (Crear bucket)
2. Configura las siguientes opciones:
   - **Bucket name**: `inmobiliaria-propiedades` (o el nombre que prefieras)
     - ⚠️ El nombre debe ser único globalmente en AWS
     - Solo letras minúsculas, números y guiones
   - **AWS Region**: Selecciona la región más cercana a ti (ej: `us-east-1`, `us-west-2`, `eu-west-1`)
   - **Object Ownership**: Deja "ACLs disabled" o selecciona "ACLs enabled" según tu preferencia
   
3. En **"Block Public Access settings"**:
   - ⚠️ **IMPORTANTE**: Desmarca todas las casillas si quieres acceso público
   - O déjalas marcadas y configura políticas específicas (más seguro)
   
4. En **"Bucket Versioning"**: Deja deshabilitado (puedes habilitarlo después si lo necesitas)

5. Haz clic en **"Create bucket"**

---

## 2. Configurar Permisos del Bucket

### Opción A: Acceso Público (Más Simple, Menos Seguro)

1. Ve a tu bucket recién creado
2. Ve a la pestaña **"Permissions"** (Permisos)
3. Desplázate hasta **"Block public access"**
4. Haz clic en **"Edit"**
5. **Desmarca todas las casillas** y guarda
6. Desplázate hasta **"Bucket policy"** y haz clic en **"Edit"**
7. Pega la siguiente política (reemplaza `TU-BUCKET-NAME` con el nombre de tu bucket):

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::TU-BUCKET-NAME/*"
        }
    ]
}
```

8. Haz clic en **"Save changes"**

### Opción B: Solo Acceso Autenticado (Más Seguro)

Si prefieres mantener el bucket privado, no necesitas cambiar nada. Las imágenes se servirán a través de URLs firmadas (signed URLs) que expiran después de un tiempo.

---

## 3. Crear un Usuario IAM

### Paso 1: Acceder a IAM
1. En la consola de AWS, busca **"IAM"** en la barra de búsqueda
2. Haz clic en **"IAM"** para abrir el servicio

### Paso 2: Crear el Usuario
1. En el menú lateral, haz clic en **"Users"** (Usuarios)
2. Haz clic en el botón **"Create user"** (Crear usuario)
3. **Nombre de usuario**: `inmobiliaria-s3-user` (o el nombre que prefieras)
4. Haz clic en **"Next"**

### Paso 3: Asignar Permisos
1. Selecciona **"Attach policies directly"** (Adjuntar políticas directamente)
2. Busca y selecciona la política: **"AmazonS3FullAccess"**
   - ⚠️ **Nota**: Esto da acceso completo a S3. Para producción, crea una política personalizada más restrictiva.
   
   **Alternativa (Más Segura)**: Crea una política personalizada:
   - Haz clic en **"Create policy"**
   - Ve a la pestaña **"JSON"**
   - Pega el siguiente código (reemplaza `TU-BUCKET-NAME`):

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
                "arn:aws:s3:::TU-BUCKET-NAME",
                "arn:aws:s3:::TU-BUCKET-NAME/*"
            ]
        }
    ]
}
```

   - Nombra la política: `InmobiliariaS3Access`
   - Haz clic en **"Create policy"**
   - Vuelve a crear el usuario y selecciona esta política personalizada

3. Haz clic en **"Next"**
4. Revisa y haz clic en **"Create user"**

---

## 4. Obtener Credenciales

### Paso 1: Crear Access Key
1. En la página del usuario que acabas de crear, ve a la pestaña **"Security credentials"**
2. Desplázate hasta **"Access keys"**
3. Haz clic en **"Create access key"**
4. Selecciona **"Application running outside AWS"**
5. Haz clic en **"Next"**
6. Opcionalmente, agrega una descripción
7. Haz clic en **"Create access key"**

### Paso 2: Guardar las Credenciales
⚠️ **MUY IMPORTANTE**: Guarda estas credenciales de forma segura. No las compartas públicamente.

Te mostrará:
- **Access key ID**: Ejemplo: `AKIAIOSFODNN7EXAMPLE`
- **Secret access key**: Ejemplo: `wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY`

**Guarda estas credenciales en un lugar seguro**. No podrás ver el Secret Access Key después de cerrar esta ventana.

---

## 5. Configurar Variables de Entorno

Tienes dos archivos `.env`:
1. **Raíz del proyecto** (para docker-compose.yml)
2. **Carpeta API** (para la aplicación Node.js)

### Archivo `.env` en la Raíz del Proyecto

Crea o edita el archivo `.env` en la raíz del proyecto con:

```env
# AWS S3 Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=TU_ACCESS_KEY_ID_AQUI
AWS_SECRET_ACCESS_KEY=TU_SECRET_ACCESS_KEY_AQUI
AWS_S3_BUCKET_NAME=inmobiliaria-propiedades

# Otras variables de entorno existentes...
```

### Archivo `.env` en la Carpeta API

Crea o edita el archivo `.env` en la carpeta `API/` con:

```env
# AWS S3 Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=TU_ACCESS_KEY_ID_AQUI
AWS_SECRET_ACCESS_KEY=TU_SECRET_ACCESS_KEY_AQUI
AWS_S3_BUCKET_NAME=inmobiliaria-propiedades

# Otras variables de entorno existentes...
```

---

## ✅ Verificación

Para verificar que todo funciona:

1. Reinicia tus contenedores Docker:
   ```bash
   docker-compose down
   docker-compose up -d
   ```

2. Intenta subir una imagen desde tu aplicación

3. Verifica en la consola de S3 que el archivo se haya subido correctamente

---

## 🔒 Seguridad Adicional (Recomendado para Producción)

1. **Usa políticas más restrictivas**: Solo da permisos al bucket específico
2. **Rota las credenciales regularmente**: Cambia las Access Keys cada cierto tiempo
3. **Usa IAM Roles en lugar de Access Keys**: Si ejecutas en EC2 o ECS
4. **Habilita CloudFront**: Para servir las imágenes de forma más rápida y segura
5. **Usa Signed URLs**: En lugar de hacer los objetos públicos, genera URLs temporales

---

## 🆘 Solución de Problemas

### Error: "Access Denied"
- Verifica que las credenciales sean correctas
- Verifica que el usuario IAM tenga los permisos necesarios
- Verifica que el nombre del bucket sea correcto

### Error: "Bucket does not exist"
- Verifica que el nombre del bucket sea correcto
- Verifica que estés usando la región correcta

### Las imágenes no se muestran públicamente
- Verifica la política del bucket (Opción A del paso 2)
- Verifica que el Block Public Access esté deshabilitado

---

## 📚 Recursos Adicionales

- [Documentación de AWS S3](https://docs.aws.amazon.com/s3/)
- [Documentación de IAM](https://docs.aws.amazon.com/iam/)
- [Mejores Prácticas de Seguridad S3](https://docs.aws.amazon.com/AmazonS3/latest/userguide/security-best-practices.html)

