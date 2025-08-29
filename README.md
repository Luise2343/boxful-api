# Boxful API (MVP)

Auth + Orders (NestJS + MongoDB). Flujo end-to-end: **registro/login (JWT)**, **crear órdenes** y **listar con paginación + filtros**. Swagger en `/docs`.

## Requisitos
- Node 20+
- Docker Desktop (usado solo para MongoDB)
- (Opcional) Postman/Insomnia

## Arranque rápido (Docker para Mongo)
```bash
# 1) Levantar Mongo + mongo-express
docker compose up -d

# 2) Instalar dependencias
npm i

# 3) Crear .env desde el ejemplo
# Windows PowerShell:
Copy-Item .env.example .env

# 4) Poblar datos (admin + órdenes demo)
npm run db:seed

# 5) Levantar API (watch)
npm run start:dev
````

* API: **[http://localhost:3000](http://localhost:3000)**
* Swagger: **[http://localhost:3000/docs](http://localhost:3000/docs)**
* Mongo Express: **[http://localhost:8081](http://localhost:8081)**
* URI para Docker: `mongodb://root:root@localhost:27017/boxful?authSource=admin`

## Variables de entorno

Crea `.env` en la **raíz** (ver `.env.example`):

```
MONGO_URI=mongodb://root:root@localhost:27017/boxful?authSource=admin
JWT_SECRET=change-me
JWT_EXP=1h
SEED_ADMIN_EMAIL=admin@example.com
SEED_ADMIN_PASSWORD=Admin#1234
PORT=3000
```

## Scripts

```bash
npm run db:seed   # siembra admin + 12–22 órdenes demo
npm run start:dev # Nest en watch
npm run build     # compila a dist/
npm start         # ejecuta dist/main.js
npm run lint      # ESLint
npm run format    # Prettier
```

## Endpoints principales

* `POST /auth/register` → `{ user, access_token }`
* `POST /auth/login` → `{ user, access_token }`
* `POST /orders` *(Bearer JWT)* → crea orden (≥1 package)
* `GET  /orders` *(Bearer JWT)* → lista con:

  * `page` (1 por defecto), `limit` (10 por defecto)
  * `status`: `PENDING|IN_PROGRESS|DELIVERED|CANCELLED`
  * `search`: contiene en `customerName` **o** `customerPhone`

### Probar rápido (curl)

```bash
# login (admin del seed)
TOKEN=$(curl -s http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"Admin#1234"}' | jq -r .access_token)

# crear orden
curl -s http://localhost:3000/orders -X POST \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"customerName":"Juan Pérez","customerPhone":"5551234567","address":"Calle Falsa 123","packages":[{"description":"Caja libros","weight":3.5,"dimensions":{"l":30,"w":25,"h":20}}]}'

# listar con filtros
curl -s "http://localhost:3000/orders?page=1&limit=10&status=PENDING&search=juan" \
  -H "Authorization: Bearer $TOKEN"
```

### Probar en Swagger

1. Abrir `/docs` → **Authorize** (candado).
2. Pegar **solo** el token (Swagger añade `Bearer`).
3. Usar “Try it out” en `/orders`.

## Estructura

```
src/
  auth/     # DTOs, strategy JWT, guard, service/controller
  orders/   # schemas, DTOs, service/controller
  users/    # schema + service
  health/   # /health
  seeds/    # seed.ts (faker + bcrypt)
```

## Troubleshooting

* **No conecta a Mongo:** verifica `MONGO_URI` y `docker compose ps` (contenedor `boxful-mongo` arriba).
* **Swagger no muestra /orders:** confirma que `OrdersModule` está importado en `AppModule`.
* **Windows + Docker:** usar WSL2 y que Docker Engine esté “Running”.

## Notas

* `.env` **no** se versiona (usa `.env.example`).
* Datos del seed son demo; cambia credenciales si vas a publicar el repo.
```
