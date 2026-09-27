# Velora Inventory

A full-stack inventory management system for tracking products, categories, suppliers, and stock movements, built with a React/TypeScript frontend and a Node.js/Express REST API backed by SQLite.

### Home page
<img width="1917" height="870" alt="image" src="https://github.com/user-attachments/assets/24b4e101-0e29-42a4-8773-1568d684fab5" />

### Dashboard
<img width="1898" height="871" alt="image" src="https://github.com/user-attachments/assets/fd30f284-caa5-4e30-a11c-3cd2f7a84567" />

### Products
<img width="1919" height="868" alt="image" src="https://github.com/user-attachments/assets/8ead59f5-497e-483e-9512-02b9c030825c" />

### Product Details
<img width="850" height="856" alt="image" src="https://github.com/user-attachments/assets/27e95d8d-a805-4c87-9612-fcf65c62aaf9" />

### Categories
<img width="1914" height="865" alt="image" src="https://github.com/user-attachments/assets/cfd420de-777d-4faf-91d6-ce53ac34a96d" />


### Supplier
<img width="1919" height="867" alt="image" src="https://github.com/user-attachments/assets/bde6a055-f151-4d29-b674-dbe68d39f797" />


## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS, Framer Motion, TanStack Query |
| Backend | Node.js, Express, SQLite (`better-sqlite3`) |
| Auth | JWT (`jsonwebtoken`), password hashing (`bcryptjs`) |
| Testing | Jest, Supertest |

## Features

- Product, category, and supplier management with full CRUD
- Real-time stock tracking with an atomic in/out movement ledger
- Role-based access control (Admin / Staff)
- Dashboard with inventory analytics and stock-value charts
- Search, filtering, sorting, and pagination across all list views
- CSV export of the product catalog

## Getting Started

### Prerequisites
- Node.js 18+
- npm

### Backend

```bash
cd backend
npm install
cp .env.example .env
npm run setup    
npm run start     
```

### Frontend

```bash
cd frontend
npm install
npm run dev         
```

### Tests

```bash
cd backend
npm test
```

### Default login

The seed script creates two accounts:

| Username | Password | Role |
|---|---|---|
| `admin` | `Admin@123` | ADMIN |
| `staff` | `Staff@123` | STAFF |

## Running with Docker Compose (local)

```bash
docker compose up --build
```

- Frontend: http://localhost:5500
- Backend: http://localhost:4000
- Data persists in the `inventory-data` Docker volume between restarts.

## Deploying to Railway (production)

This is an **isolated monorepo** (`backend/` and `frontend/` each have their own `package.json` and `Dockerfile`), so on Railway it's deployed as **two separate services** from the same GitHub repo, not with `docker-compose.yml` directly (Railway doesn't run compose files).

1. **Push this project to a GitHub repo**, then in Railway: *New Project → Deploy from GitHub repo*.
2. **Backend service**
   - Add a service, set its **Root Directory** to `/backend` (Settings → root directory). Railway will detect the `Dockerfile` automatically.
   - Add a **Volume**, mounted at `/app/data` — without this, the SQLite file is wiped on every redeploy.
   - Set environment variables:
     - `JWT_SECRET` — a long random string (not the placeholder in `.env.example`)
     - `DB_PATH=/app/data/inventory.db`
     - `NODE_ENV=production`
     - *(`PORT` is provided automatically by Railway — don't set it yourself.)*
   - Once deployed, open **Settings → Networking** and click **Generate Domain**. Copy the resulting URL (e.g. `https://backend-production-xxxx.up.railway.app`) — you need it in the next step.
3. **Frontend service**
   - Add a second service from the same repo, Root Directory `/frontend`.
   - Set a build-time variable `VITE_API_BASE` to `<your backend URL from step 2>/api` (e.g. `https://backend-production-xxxx.up.railway.app/api`). This has to be set **before the build runs** — Vite bakes it into the JS bundle at build time, it can't be changed at runtime afterwards.
   - Generate a domain for this service too, under Networking.
4. **Redeploy the backend once more** and set `CORS_ORIGIN` to the frontend's URL from step 3 (comma-separate multiple origins if needed). This isn't required for the app to work (CORS is wide open by default), but it's the one-line change to lock it down for a real deployment.
5. Open the frontend's URL — it should now load data from the backend. If products don't load, open the browser console/network tab first: a `Failed to fetch` almost always means `VITE_API_BASE` wasn't set before that build, and a `CORS` console error means step 4 hasn't redeployed yet.

## Fixes applied for deployment (worth knowing before you explain this project)

The version of this project as originally zipped/committed had a few issues that only show up once you try to deploy it as two separate public services (rather than running it locally or via `docker-compose`, where everything shares one network):

- **No `.gitignore` / `backend/.dockerignore`.** Without it, a local `node_modules` (with `better-sqlite3`'s native binary compiled for your own OS) can get copied into the Docker build and silently overwrite the correctly-compiled Linux binary the Dockerfile just installed — the classic "invalid ELF header" crash on boot. Added both.
- **`frontend/nginx.conf` hardcoded `proxy_pass http://backend:4000`.** That hostname only resolves inside the `docker-compose` network. Nginx resolves `proxy_pass` targets at startup, so deployed as a standalone container it refused to start at all. Fixed by resolving that hostname lazily (via a `resolver` + variable) instead of at boot, so it degrades gracefully instead of crash-looping.
- **`frontend/vite.config.ts` had a dev-proxy pointed at a specific old Render deployment URL** instead of `localhost:4000`, so `npm run dev` silently talked to a stray external server instead of your own backend.
- **`frontend/Dockerfile` didn't accept `VITE_API_BASE` as a build arg**, so there was no way to point a production build at a backend living on a different domain (which is exactly the case once frontend and backend are two separate Railway services with two separate URLs).

None of these were application-logic bugs — the CRUD/business-rule logic, tests, and API were already correct; these were all deployment/infrastructure gaps. See `NOTES.md` for further design notes.

## Known limitations

- SQLite is single-writer; fine for this assessment's scale, not for high concurrent write volume.
- No automated frontend tests yet (backend has Jest/Supertest coverage of all business rules).
- No rate limiting on the API.

## License

This project is provided for demonstration purposes.
