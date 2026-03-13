# SAGE - Sistema de Acompanhamento e Gestão Escolar

## Project Overview
A full-stack school management application (gestão escolar) with a React frontend and an Express/PostgreSQL backend. Supports two user roles: **professor** (teacher) and **gestor** (manager), each with their own dashboard experience.

## Architecture

### Frontend
- **Framework**: React + Vite + TypeScript
- **Routing**: React Router v6 with protected routes based on user role
- **State/Auth**: React Context API (`AuthContext`) with JWT tokens stored in localStorage
- **Data fetching**: TanStack React Query + Axios
- **UI**: shadcn/ui components built on Radix UI primitives + Tailwind CSS
- **Forms**: React Hook Form + Zod validation

### Backend
- **Framework**: Express.js running on port 3001
- **Database**: PostgreSQL via Drizzle ORM
- **Auth**: JWT (`jsonwebtoken`) + bcrypt password hashing
- **Schema**: `shared/schema.ts` (Drizzle schema shared between frontend and backend types)

## Key Pages
- `/login` — Login page
- `/registro` — Registration page
- `/dashboard` — Role-based dashboard (gestor or professor)
- `/planos/novo` — Create a new lesson plan
- `/planos/:id` — View a lesson plan
- `/planos/:id/editar` — Edit a lesson plan
- `/configuracoes` — Settings (gestor only): manage professors and subjects

## Key Files
- `src/App.tsx` — App shell, routing, providers
- `src/contexts/AuthContext.tsx` — Authentication context using JWT
- `src/services/api.ts` — Axios client pointing to `/api` (proxied to localhost:3001)
- `src/services/authService.ts` — Login and register API calls
- `src/services/planoService.ts` — Lesson plan CRUD API calls
- `src/services/gestorService.ts` — Professor and subject management API calls
- `server/index.ts` — Express server entry point (port 3001)
- `server/db.ts` — Drizzle + PostgreSQL connection
- `server/routes/auth.ts` — Auth routes (login, register)
- `server/routes/usuarios.ts` — Professor management (gestor only)
- `server/routes/disciplinas.ts` — Subject management (gestor only)
- `server/routes/planos.ts` — Lesson plan CRUD
- `server/middleware/auth.ts` — JWT middleware
- `server/seed.ts` — Database seed script (run with `npx tsx server/seed.ts`)
- `shared/schema.ts` — Drizzle schema (usuarios, disciplinas, professor_disciplinas, planos_aula, plano_semanas)
- `vite.config.ts` — Vite config (host: 0.0.0.0, port: 5000, proxy: /api → localhost:3001)

## Running the Project
- **Dev**: "Start application" workflow runs `npx concurrently "npx tsx server/index.ts" "vite"`
  - Frontend: port 5000 (webview)
  - Backend API: port 3001
- **Seed DB**: `npx tsx server/seed.ts` — populates the DB with all professors, subjects, and a sample lesson plan
- **Push schema**: `npx drizzle-kit push`

## Environment Variables
- `DATABASE_URL` — PostgreSQL connection string (auto-set by Replit)
- `JWT_SECRET` — JWT signing secret (defaults to `sage_secret_key`, set in production)
- `API_PORT` — Backend port (defaults to 3001)

## Database Tables
- `usuarios` — Users (professors and managers)
- `disciplinas` — School subjects
- `professor_disciplinas` — Many-to-many link between professors and subjects
- `planos_aula` — Monthly lesson plans
- `plano_semanas` — Weekly breakdown within each lesson plan

## Default Credentials (after seeding)
- Gestor: `daniel.nunes@prof.ce.gov.br` / `045795`
- Professor: `silas.gomes@prof.ce.gov.br` / `035449`
- Password format: first 6 digits of CPF (no punctuation)
