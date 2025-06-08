# Etapa de construcción
FROM node:alpine AS builder
WORKDIR /app

# Copiar el código fuente al contenedor
COPY . .

# Instalar dependencias y construir la aplicación
RUN npm install && \
    npm run build

# Verificación de archivos generados en la compilación
RUN echo "=== Verificando archivos en /app/dist ===" && ls -l /app/dist || echo "❌ La carpeta /app/dist no existe"
FROM node:alpine AS builder
WORKDIR /app
COPY . .
RUN npm install && npm run build

FROM nginx:alpine
WORKDIR /usr/share/nginx/html
COPY --from=builder /app/dist/* /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]