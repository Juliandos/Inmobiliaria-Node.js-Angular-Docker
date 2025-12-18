# ============================================
# DOCKERFILE PARA EL BACKEND (API)
# ============================================
# 
# ¿QUÉ ES UN DOCKERFILE?
# ----------------------
# Un Dockerfile es como una "receta" que le dice a Docker cómo construir
# una imagen de tu aplicación. Es como las instrucciones para armar un
# mueble, pero para crear un contenedor con tu aplicación.
#
# CONCEPTOS CLAVE:
# - Imagen: Es como una "plantilla" o "molde" de tu aplicación
# - Contenedor: Es una "instancia" de esa imagen corriendo
# - Capas: Cada instrucción crea una "capa" en la imagen (como capas de cebolla)
#
# ============================================

# PASO 1: Definir la imagen base
# --------------------------------
# FROM: Especifica la imagen base de la que partir
# node:20-alpine: 
#   - node:20 = Node.js versión 20
#   - alpine = Versión ligera de Linux (más pequeña, ~5MB vs ~100MB)
#   - Es como decir "empieza con un sistema Linux que ya tiene Node.js instalado"
FROM node:20-alpine

# PASO 2: Definir el directorio de trabajo
# -----------------------------------------
# WORKDIR: Crea un directorio y lo convierte en el directorio actual
# Es como hacer: mkdir /app && cd /app
# Todas las instrucciones siguientes se ejecutarán en este directorio
WORKDIR /app

# PASO 3: Copiar archivos de dependencias
# ----------------------------------------
# COPY: Copia archivos desde tu máquina al contenedor
# package*.json: Copia package.json y package-lock.json
# ¿Por qué primero? Para aprovechar el cache de Docker
# Si solo cambias código (no dependencias), Docker reutiliza esta capa
COPY package*.json ./

# PASO 4: Instalar dependencias
# ------------------------------
# RUN: Ejecuta un comando dentro del contenedor durante la construcción
# npm ci: 
#   - "ci" = clean install (instalación limpia)
#   - Más rápido y confiable que "npm install"
#   - Usa package-lock.json exactamente como está
# Instalamos todas las dependencias (producción + desarrollo) porque necesitamos tsx
RUN npm ci

# PASO 6: Copiar el resto del código
# -----------------------------------
# Ahora copiamos todo el código fuente
# Esto va después de instalar dependencias para aprovechar el cache
COPY . .

# PASO 7: Exponer el puerto
# --------------------------
# EXPOSE: Documenta qué puerto usa la aplicación
# No abre el puerto, solo es documentación
# El puerto real se mapea en docker-compose.yml
EXPOSE 3001

# PASO 8: Definir el comando por defecto
# ---------------------------------------
# CMD: Define qué comando ejecutar cuando el contenedor inicia
# Usamos tsx para ejecutar TypeScript directamente
# En docker-compose.yml puedes sobrescribir esto con "npm run dev" para desarrollo
CMD ["npx", "tsx", "src/main.ts"]

# ============================================
# RESUMEN DEL PROCESO:
# ============================================
# 1. Empieza con Node.js 20 en Alpine Linux
# 2. Crea directorio /app
# 3. Copia package.json
# 4. Instala dependencias
# 5. Copia código fuente
# 6. Expone puerto 3001
# 7. Ejecuta la aplicación
#
# Cuando construyes la imagen, Docker ejecuta estos pasos en orden
# y crea "capas" que puede reutilizar si no cambian.
# ============================================

