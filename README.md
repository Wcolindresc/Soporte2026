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


## Ejecutar en Windows 11 (Docker Desktop + Ubuntu/WSL)

Como ya tienes el proyecto en:

`C:\Users\wilmer.colindres\Documents\GitHub\Soporte2026`

usa este flujo recomendado:

1. Abre **Ubuntu (WSL)**.
2. Entra a la carpeta del proyecto montada desde Windows:
   ```bash
   cd /mnt/c/Users/wilmer.colindres/Documents/GitHub/Soporte2026
   ```
3. Crea tu archivo de entorno en raíz:
   ```bash
   cp .env.example .env
   ```
4. (Opcional pero recomendado) crea también el env del API:
   ```bash
   cp apps/api/.env.example apps/api/.env
   ```
5. Levanta todo:
   ```bash
   docker compose up --build
   ```
6. Abre en tu navegador Windows:
   - Web: `http://localhost:4200`
   - API: `http://localhost:3000`
   - Swagger: `http://localhost:3000/docs`

### Error: `docker-credential-desktop.exe: exec format error` en WSL

Ese error ocurre cuando WSL intenta ejecutar el helper de credenciales de Windows con una ruta/configuración inválida.

1. Revisa tu archivo de Docker en WSL:
   ```bash
   cat ~/.docker/config.json
   ```
2. Si aparece `"credsStore": "desktop.exe"` o valores extraños, corrígelo a:
   ```json
   {
     "auths": {},
     "credsStore": "desktop"
   }
   ```
3. Alternativa rápida (desactivar helper temporalmente):
   ```bash
   cp ~/.docker/config.json ~/.docker/config.json.bak 2>/dev/null || true
   printf '{\"auths\": {}}\n' > ~/.docker/config.json
   ```
4. Reinicia Docker Desktop y luego en WSL valida:
   ```bash
   docker version
   docker compose version
   ```
5. Vuelve a ejecutar:
   ```bash
   docker compose up --build
   ```

Si aún falla, ejecuta en **PowerShell (Administrador)**:

```powershell
wsl --shutdown
```

y vuelve a abrir Ubuntu.

### Si sale error de puertos ocupados

Verifica si ya hay procesos usando 3000, 3306 o 4200 (por ejemplo XAMPP/MySQL local) y detén esos servicios antes de ejecutar `docker compose up --build`.

### Comandos útiles

```bash
docker compose ps
docker compose logs -f api
docker compose logs -f web
docker compose down
```

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
