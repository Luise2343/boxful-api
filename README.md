````md
# Boxful API (MVP)

Auth + Orders (NestJS + MongoDB). Flujo end-to-end:
- **Auth (JWT):** `POST /auth/register`, `POST /auth/login`
- **Orders:** `POST /orders` (crear) y `GET /orders` (listar con paginación y filtros)
- **Swagger:** `/docs`

Incluye **seed** (admin + órdenes demo) y **Docker Compose** para MongoDB + mongo-express.

---

## Requisitos

- **Node 20+**
- **Docker Desktop** (para usar Mongo en contenedor)
- (Opcional) Postman/Insomnia

---

## Arranque rápido

### 1) Levantar Mongo (Docker)
```bash
# En la raíz del repo (donde está docker-compose.yml)
docker compose up -d
````

Servicios:

* **MongoDB:** puerto `27017`
* **mongo-express:** UI en `http://localhost:8081` (útil para ver la DB)

### 2) Instalar dependencias

```bash
npm i
```

### 3) Crear `.env`

Copia el ejemplo y edítalo:

```bash
# Windows PowerShell
Copy-Item .env.example .env
```

Contenido recomendado (Docker):

```
MONGO_URI=mongodb://root:root@127.0.0.1:27017/boxful?authSource=admin
JWT_SECRET=change-me
JWT_EXP=1h
SEED_ADMIN_EMAIL=admin@example.com
SEED_ADMIN_PASSWORD=Admin#1234
PORT=3000
```

> Nota IPv6 en Windows: usar **127.0.0.1** evita el típico `ECONNREFUSED ::1:27017`.

### 4) Poblar datos (seed)

```bash
npm run db:seed
```

Qué hace el seed:

* Crea/asegura un **admin** (`SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD`).
* Inserta **12–22 órdenes demo** con **packages**.
* Si existen órdenes viejas sin **department/municipality**, las **rellena** con valores por defecto.

### 5) Levantar la API (watch)

```bash
npm run start:dev
```

Rutas:

* API: **[http://localhost:3000](http://localhost:3000)**
* Swagger: **[http://localhost:3000/docs](http://localhost:3000/docs)**
* mongo-express: **[http://localhost:8081](http://localhost:8081)**

---

## Variables de entorno

En `.env` (no se versiona; usa `.env.example` como base):

```
MONGO_URI=mongodb://root:root@127.0.0.1:27017/boxful?authSource=admin
JWT_SECRET=change-me
JWT_EXP=1h
SEED_ADMIN_EMAIL=admin@example.com
SEED_ADMIN_PASSWORD=Admin#1234
PORT=3000
```

---

## Scripts NPM

```bash
npm run db:seed   # siembra admin + órdenes demo (y migra dept/municipality si faltan)
npm run start:dev # inicia Nest en modo watch
npm run build     # compila a dist/
npm start         # ejecuta dist/main.js
npm run lint      # ESLint
npm run format    # Prettier
```

---

## Endpoints principales

### Auth

* **POST /auth/register**

  * Body: `{ "email": string, "password": string(>=8) }`
  * Respuesta: `{ user, access_token }`
* **POST /auth/login**

  * Body: `{ "email": string, "password": string }`
  * Respuesta: `{ user, access_token }`

### Orders (protegidos con **Bearer JWT**)

* **POST /orders** — Crea una orden (requiere ≥ 1 package)

  * Body (ejemplo):

    ```json
    {
      "customerName": "Juan Pérez",
      "customerPhone": "5551234567",
      "address": "Calle Falsa 123",
      "department": "San Salvador",
      "municipality": "Soyapango",
      "status": "PENDING",
      "packages": [
        {
          "description": "Caja libros",
          "weight": 3.5,
          "dimensions": { "l": 30, "w": 25, "h": 20 }
        }
      ]
    }
    ```
* **GET /orders** — Lista con paginación y filtros

  * Query: `page` (1), `limit` (10), `status` (`PENDING|IN_PROGRESS|DELIVERED|CANCELLED`),
    `search` (contiene en `customerName` **o** `customerPhone`).
  * Respuesta: `{ items, page, limit, total, pages }`


---

## Troubleshooting

**ECONNREFUSED ::1:27017 o 127.0.0.1:27017**

* Asegúrate de tener Docker levantado:

  ```bash
  docker version
  docker compose ps
  docker compose up -d
  ```
* Verifica el puerto publicado:

  ```bash
  docker port boxful-mongo 27017
  ```
* Usa **127.0.0.1** en `MONGO_URI` (evita IPv6).

**Probar Mongo dentro del contenedor**

```bash
docker exec -it boxful-mongo mongosh -u root -p root --authenticationDatabase admin --eval "db.adminCommand('ping')"
```

---

## Notas

* `.env` **no** se versiona. Usa `.env.example` como plantilla.
* Los datos de seed son **demo**; cambia credenciales si publicas el repo.
* JWT de acceso: expira según `JWT_EXP` (MVP usa **1h**).

```
