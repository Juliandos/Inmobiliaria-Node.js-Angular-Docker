# ============================================
# DOCKERFILE PARA EL FRONTEND (Angular)
# ============================================
#
# Este Dockerfile usa una técnica llamada "multi-stage build"
# que permite crear imágenes más pequeñas y optimizadas.
#
# MULTI-STAGE BUILD:
# - Stage 1 (builder): Compila la aplicación Angular
# - Stage 2 (production): Solo copia los archivos compilados
# Esto resulta en una imagen final mucho más pequeña
#
# ============================================

# ============================================
# STAGE 1: BUILD (Compilación)
# ============================================
# Esta etapa compila la aplicación Angular
FROM node:20-alpine AS builder

# Definir directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar TODAS las dependencias (incluyendo devDependencies)
# Necesitamos devDependencies para compilar Angular
RUN npm ci

# Copiar el resto del código fuente
COPY . .

# Compilar la aplicación Angular
# ng build: Compila Angular y genera archivos en /app/dist
# --configuration production: Compilación optimizada para producción
RUN npm run build

# ============================================
# STAGE 2: PRODUCTION (Servir archivos estáticos)
# ============================================
# Esta etapa solo sirve los archivos compilados
# Usamos nginx (servidor web ligero) para servir archivos estáticos

FROM nginx:alpine

# Copiar archivos compilados desde la etapa anterior
# --from=builder: Copia desde la etapa "builder"
# /app/dist/coreui-free-angular-admin-template/browser: Ruta donde Angular genera los archivos
# /usr/share/nginx/html: Ruta donde nginx sirve archivos estáticos
COPY --from=builder /app/dist/coreui-free-angular-admin-template/browser /usr/share/nginx/html

# Copiar configuración personalizada de nginx
# Esto permite configurar cómo nginx sirve los archivos
# Es necesario para que las rutas de Angular funcionen correctamente
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer puerto 80 (puerto por defecto de nginx)
EXPOSE 80

# nginx se inicia automáticamente, no necesitamos CMD
# nginx:alpine ya tiene un CMD que inicia nginx

# ============================================
# ¿POR QUÉ MULTI-STAGE?
# ============================================
# - Stage 1 (builder): ~500MB (tiene Node.js, npm, Angular CLI, etc.)
# - Stage 2 (production): ~25MB (solo nginx y archivos compilados)
# 
# La imagen final solo tiene lo necesario para servir archivos,
# no necesita Node.js ni las herramientas de desarrollo.
# ============================================

