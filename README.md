# Proyecto Inmobiliaria - Popayán, Cauca, Colombia

## Descripción

Este proyecto es una aplicación web completa para una inmobiliaria ubicada en Popayán, Cauca, Colombia. La aplicación permite a los usuarios buscar, ver y gestionar propiedades inmobiliarias. El frontend está desarrollado con Angular y TypeScript, y el backend está construido con Node.js, Express y TypeScript. La aplicación utiliza Docker para la orquestación de contenedores y MySQL como base de datos.

## Características

- **Búsqueda de propiedades**: Los usuarios pueden buscar propiedades basadas en diferentes criterios como ubicación, precio, tipo de propiedad, área, habitaciones, baños, parqueadero, etc.

- **Gestión completa de propiedades**: Sistema administrativo completo para gestionar propiedades, usuarios, roles, permisos y módulos.

- **Página de aterrizaje pública**: Landing page moderna y responsiva con secciones de inicio, nosotros, contacto y catálogo público de propiedades.

- **Sistema de autenticación y autorización**: Control de acceso basado en roles y permisos con JWT.

- **Gestión de imágenes**: Integración con Cloudinary para el almacenamiento y gestión de imágenes de propiedades.

- **Interfaz responsiva**: La aplicación es completamente responsiva y funciona bien en dispositivos móviles y de escritorio.

- **DataTables avanzados**: Tablas con paginación, ordenamiento, filtrado y exportación a CSV en todos los módulos administrativos.

## Tecnologías Utilizadas

### Frontend

- **Angular 18** - Framework principal
- **TypeScript** - Lenguaje de programación
- **Angular Material** - Componentes UI
- **CoreUI** - Template administrativo
- **RxJS** - Programación reactiva
- **SCSS** - Estilos

### Backend

- **Node.js** - Runtime de JavaScript
- **Express** - Framework web
- **TypeScript** - Lenguaje de programación
- **Sequelize** - ORM para MySQL
- **MySQL** - Base de datos relacional
- **JWT** - Autenticación con tokens
- **Cloudinary** - Gestión de imágenes en la nube
- **bcrypt** - Encriptación de contraseñas

### DevOps

- **Docker** - Contenedores
- **Docker Compose** - Orquestación de servicios
- **Nginx** - Servidor web para producción (Frontend)

## Estructura del Proyecto

```
Inmobiliaria Node Docker Angular/
├── API/                    # Backend (Node.js + Express)
│   ├── src/
│   │   ├── controllers/   # Controladores de la API
│   │   ├── models/         # Modelos de Sequelize
│   │   ├── routes/         # Rutas de la API
│   │   ├── middleware/     # Middlewares (auth, upload, error)
│   │   ├── db/             # Configuración de base de datos
│   │   └── utils/          # Utilidades (JWT, Cloudinary)
│   └── Dockerfile
├── Front/                  # Frontend (Angular)
│   ├── src/
│   │   ├── app/
│   │   │   ├── views/      # Vistas (dashboard, profile, landing)
│   │   │   ├── layout/     # Layouts (default, public)
│   │   │   ├── services/   # Servicios Angular
│   │   │   ├── guards/     # Guards de autenticación
│   │   │   └── directives/ # Directivas personalizadas
│   │   └── assets/         # Recursos estáticos
│   └── Dockerfile
├── docker-compose.yml      # Configuración de Docker Compose
└── README.md
```

## Instalación

Sigue estos pasos para configurar el proyecto en tu máquina local:

### Prerrequisitos

- **Node.js** (v18.19.0 o superior)
- **npm** (v9 o superior)
- **Docker** y **Docker Compose** instalados

### Instalación con Docker (Recomendado)

1. Clona el repositorio:

    ```sh
    git clone https://github.com/Juliandos/Inmobiliaria-Node.js-Angular-Docker.git
    ```

2. Navega al directorio del proyecto:

    ```sh
    cd Inmobiliaria-Node.js-Angular-Docker
    ```

3. Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

    ```env
    # MySQL
    MYSQL_ROOT_PASSWORD=tu_contraseña_segura
    MYSQL_DATABASE=db_inmobiliaria
    MYSQL_USER=app_user
    MYSQL_PASSWORD=app_password

    # API
    API_PORT=3001
    API_DB_PORT=3306
    API_DB_NAME=db_inmobiliaria
    API_DB_USER=root
    API_DB_PASS=tu_contraseña_segura
    API_JWT_SECRET=tu_jwt_secret_muy_seguro
    API_JWT_REFRESH_SECRET=tu_refresh_secret_muy_seguro
    API_NODE_ENV=development

    # Cloudinary (Opcional para desarrollo)
    API_CLOUDINARY_CLOUD_NAME=tu_cloud_name
    API_CLOUDINARY_API_KEY=tu_api_key
    API_CLOUDINARY_API_SECRET=tu_api_secret
    ```

4. Construye y levanta los contenedores:

    ```sh
    docker-compose up --build
    ```

5. Accede a la aplicación:

    - **Frontend**: http://localhost:4200
    - **API**: http://localhost:3001
    - **MySQL**: localhost:3306

### Instalación Manual (Sin Docker)

#### Backend (API)

1. Navega al directorio de la API:

    ```sh
    cd API
    ```

2. Instala las dependencias:

    ```sh
    npm install
    ```

3. Crea un archivo `.env` en el directorio `API/` con las variables de entorno necesarias.

4. Inicia el servidor de desarrollo:

    ```sh
    npm run dev
    ```

#### Frontend

1. Navega al directorio del Frontend:

    ```sh
    cd Front
    ```

2. Instala las dependencias:

    ```sh
    npm install
    ```

3. Inicia el servidor de desarrollo:

    ```sh
    npm start
    ```

4. Abre tu navegador en: http://localhost:4200

## Scripts Disponibles

### Backend (API)

- `npm run dev` - Inicia el servidor en modo desarrollo con hot reload
- `npm run seed` - Ejecuta el seed de la base de datos
- `npm run clean-db` - Limpia la base de datos
- `npm run reset-db` - Limpia y vuelve a poblar la base de datos
- `npm run fix-passwords` - Corrige las contraseñas de los usuarios

### Frontend

- `npm start` - Inicia el servidor de desarrollo
- `npm run build` - Compila la aplicación para producción
- `npm run watch` - Compila en modo watch
- `npm test` - Ejecuta las pruebas unitarias

## Docker Compose

### Comandos Útiles

```sh
# Levantar todos los servicios
docker-compose up -d

# Ver logs
docker-compose logs -f

# Ver logs de un servicio específico
docker-compose logs -f api
docker-compose logs -f front
docker-compose logs -f mysql

# Detener todos los servicios
docker-compose down

# Detener y eliminar volúmenes (¡Cuidado! Elimina los datos)
docker-compose down -v

# Reconstruir las imágenes
docker-compose up --build

# Ejecutar comandos dentro de un contenedor
docker-compose exec api npm run seed
docker-compose exec front npm run build
```

## Imágenes del Proyecto

|                                  |                                 |
|----------------------------------|---------------------------------|
| ![Imagen 1](https://github.com/Juliandos/inmobiliaria-react-php/blob/main/Imagenes/2024-07-05_120026.jpg)|![Imagen 6](https://github.com/Juliandos/inmobiliaria-react-php/blob/main/Imagenes/2024-07-05_121244.jpg)
|                                  |                                 |
|----------------------------------|---------------------------------|
| ![Imagen 2](https://github.com/Juliandos/inmobiliaria-react-php/blob/main/Imagenes/2024-07-05_120230.jpg) | ![Imagen 2](https://github.com/Juliandos/inmobiliaria-react-php/blob/main/Imagenes/2024-07-05_120246.jpg) |
|                                  |                                 |
|----------------------------------|---------------------------------|
| ![Imagen 3](https://github.com/Juliandos/inmobiliaria-react-php/blob/main/Imagenes/2024-07-05_120320.jpg)| ![Imagen 5](https://github.com/Juliandos/inmobiliaria-react-php/blob/main/Imagenes/2024-07-05_120339.jpg)|

## Características Principales

### Módulos Administrativos

- **Gestión de Usuarios**: CRUD completo de usuarios con roles y permisos
- **Gestión de Roles**: Creación y asignación de roles
- **Gestión de Permisos**: Control granular de permisos por módulo y operación
- **Gestión de Propiedades**: CRUD completo con imágenes, tipos y características
- **Tipos de Propiedades**: Gestión de categorías de propiedades
- **Módulos**: Administración de módulos del sistema
- **Imágenes de Propiedades**: Gestión de galería de imágenes con Cloudinary

### Landing Page Pública

- **Página de Inicio**: Hero section y características destacadas
- **Sobre Nosotros**: Información de la empresa, misión y visión
- **Catálogo de Propiedades**: Vista pública de propiedades disponibles
- **Contacto**: Formulario de contacto funcional

### Funcionalidades Técnicas

- **Autenticación JWT**: Tokens de acceso y refresh
- **Guards de Ruta**: Protección de rutas basada en permisos
- **Directivas Personalizadas**: `HasPermissionDirective` para control de UI
- **DataTables Avanzados**: Paginación, ordenamiento, filtrado y exportación CSV
- **Responsive Design**: Diseño adaptativo para todos los dispositivos
- **Upload de Imágenes**: Integración con Cloudinary para almacenamiento en la nube

## Contribuciones

¡Las contribuciones son bienvenidas! Si tienes alguna idea o encuentras un error, por favor abre un issue o envía un pull request.

## Licencia

ISC

## Autor

Desarrollado para Inmobiliaria en Popayán, Cauca, Colombia.

## Repositorio

[GitHub - Inmobiliaria Node.js Angular Docker](https://github.com/Juliandos/Inmobiliaria-Node.js-Angular-Docker)

