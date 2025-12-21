# TaskFlow — React Frontend (Hahn Task Manager)

A clean, modern React + TypeScript frontend for the Hahn “Project Tasks” technical test.

## Features
- Welcome page → Login / Register
- JWT auth (token stored in LocalStorage)
- Projects list + create / delete
- Project details page
  - Create / update / delete task
  - Toggle completion (animated)
  - Filters: Toutes / À faire / En cours / Terminées
  - Progress bar + counters
- Dashboard widgets (stats + mini charts)
- **Dev proxy** to avoid CORS issues (Vite proxy `/api` → `http://localhost:8082`)

## Run locally

### 1) Start the backend
Run your Spring Boot API on `http://localhost:8082`.

### 2) Start the frontend
```bash
npm install
npm run dev
```
Then open `http://localhost:5173`.

## Configuration
- Default API base: `/api` (works with the proxy in dev)
- If you want to call a full backend URL (without proxy), set:

```bash
# .env
VITE_API_BASE_URL=http://localhost:8082/api
```

> If you run the frontend on a different port/domain without the proxy, make sure the backend CORS allows **PATCH** and your frontend origin.
