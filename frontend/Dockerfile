FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Baked in at build time (Vite inlines VITE_* vars into the JS bundle).
# Defaults to the relative "/api" path, which works when nginx.conf below
# proxies /api to a backend on the same host (e.g. docker-compose).
# For split deployments (Railway, etc.) pass the backend's public URL, e.g.
#   --build-arg VITE_API_BASE=https://your-backend.up.railway.app/api
ARG VITE_API_BASE=/api
ENV VITE_API_BASE=$VITE_API_BASE

RUN npm run build

FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
