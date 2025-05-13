# Eventflix Frontend

## 🎬 ¿Qué es Eventflix?

Eventflix es una plataforma web para la gestión, descubrimiento y compra de entradas para eventos. El proyecto está desarrollado con Next.js y ofrece una experiencia moderna tanto para usuarios que buscan eventos como para organizadores que desean publicarlos.

### Características principales
- Exploración de eventos por categorías
- Sistema de registro y autenticación (incluyendo Google)
- Gestión de perfil de usuario
- Panel para organizadores de eventos
- Sistema de compra de entradas
- Favoritos de eventos y organizadores
- Diseño responsive para todo tipo de dispositivos

### Tecnologías utilizadas
- Next.js (React 19)
- Servicios de autenticación
- Context API para estado global
- React Icons
- Gestión de notificaciones contextuales

## 🔄 Relación con el Backend

Este frontend se comunica con el backend de Eventflix para todas sus operaciones de datos. Puedes encontrar el repositorio del backend aquí:
- [Eventflix Backend Repository](https://github.com/LaSalleGracia-Projectes/projecte-aplicaci-web-servidor-g6richardstallman.git)

Asegúrate de configurar correctamente el endpoint de la API en el archivo `.env` para conectarte al backend.

## 🚀 Guía de Instalación

Sigue estos pasos para instalar y ejecutar el proyecto en tu entorno local:

1. **Clona el repositorio:**
   ```bash
   git clone [URL_DEL_REPOSITORIO]
   cd lasalle/eventflix/frontend
   ```

2. **Instala las dependencias:**
   ```bash
   npm install
   ```

3. **Configura las variables de entorno:**
   - Crea un archivo `.env.local` basado en el archivo `.env` de ejemplo
   - Ajusta la URL de la API según corresponda:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:8000/api
   ```

4. **Inicia el servidor de desarrollo:**
   ```bash
   npm run dev
   ```

5. **Accede a la aplicación:**
   - Abre tu navegador y ve a `http://localhost:3000`

## 📦 Guía de Despliegue

Para desplegar la aplicación en un entorno de producción:

### Despliegue Tradicional

1. **Construye la aplicación:**
   ```bash
   npm run build
   ```

2. **Verifica la compilación:**
   ```bash
   npm run start
   ```

3. **Opciones de despliegue:**

   **Vercel (recomendado):**
   - Conecta tu repositorio a Vercel
   - Configura las variables de entorno en el panel de Vercel
   - La plataforma se encargará de la construcción y el despliegue automático

   **Servidor tradicional:**
   - Sube los archivos de la carpeta `.next`, `public`, `package.json` y `next.config.js` a tu servidor
   - Instala las dependencias con `npm install --production`
   - Ejecuta la aplicación con `npm start`
   - Configura un proxy inverso (Nginx/Apache) para servir la aplicación

### Despliegue con Docker

Esta aplicación puede ser desplegada utilizando Docker para facilitar su distribución y ejecución en cualquier entorno.

1. **Crea un archivo `Dockerfile` en la raíz del proyecto:**

```dockerfile
FROM node:20-alpine AS base

# Instalar dependencias solo cuando se modifica package.json
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

# Construir la aplicación
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Producción
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production

# Copiar solo los archivos necesarios
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

2. **Crea un archivo `docker-compose.yml`:**

```yaml
version: '3.8'

services:
  frontend:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: eventflix-frontend
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
```

3. **Construye y ejecuta el contenedor:**

```bash
docker-compose up -d --build
```

4. **Accede a la aplicación en tu navegador:**
   - http://localhost:3000

## 📁 Estructura del Proyecto

- `/src/app` — Páginas y rutas de la aplicación
- `/src/components` — Componentes reutilizables
- `/src/services` — Servicios para la API
- `/src/context` — Contextos globales
- `/src/utils` — Utilidades y helpers
- `/public` — Recursos estáticos

## 👨‍💻 Autor

Desarrollado por **Arnau Gil** como parte del proyecto para La Salle.

## 📄 Licencia

Este proyecto es para fines educativos y de demostración. No debe utilizarse en entornos de producción sin la debida autorización.
