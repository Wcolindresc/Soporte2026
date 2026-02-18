# Soporte2026 Monorepo

Sistema completo de inventario y cotizaciones en español con **Node.js + Express + TypeScript + Prisma + MySQL 8** y frontend **Angular**.

## Estructura

```text
/
  apps/
    api/
    web/
  infra/
  docs/
```

## Requisitos

- Docker y Docker Compose
- Node.js 20+

## Levantar local (1 comando)

```bash
docker compose up --build
```

Servicios:
- API: `http://localhost:3000`
- Swagger: `http://localhost:3000/docs`
- Web: `http://localhost:4200`
- MySQL: `localhost:3306`

## Migraciones + seed

Desde `apps/api`:

```bash
npm install
npx prisma migrate dev --name init
npx prisma db seed
```

## Usuario admin inicial

- Usuario: `admin`
- Password: `Admin123!`
- Rol: `ADMIN`

⚠️ Cambiar contraseña en el primer login.

## Build y despliegue prod

```bash
docker compose -f docker-compose.prod.yml up --build -d
```

Incluye Nginx para servir Angular y reverse proxy hacia API.

## Variables de entorno

- Revisar `.env.example` raíz y `apps/api/.env.example`.
- Zona horaria por defecto: `America/Guatemala`.
- Moneda mostrada en UI: **Quetzales (Q)**.

## VPS con Docker (paso a paso)

1. Instalar Docker Engine + Compose plugin.
2. Clonar repositorio en VPS.
3. Copiar `.env.example` a `.env` y ajustar secretos.
4. Ejecutar `docker compose -f docker-compose.prod.yml up --build -d`.
5. Verificar salud: `docker compose -f docker-compose.prod.yml ps`.
6. Aplicar migraciones: `docker compose -f docker-compose.prod.yml exec api npx prisma migrate deploy`.
7. Seed inicial: `docker compose -f docker-compose.prod.yml exec api npx prisma db seed`.
8. Configurar DNS y TLS (recomendado con proxy inverso externo).

## Endpoints base

Ver `apps/api/src/routes` y Swagger en `/docs`.

## Colecciones y documentación

- OpenAPI export: `docs/swagger.json`
- Postman: `docs/postman_collection.json`
