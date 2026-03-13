# SAGE - Sistema de Acompanhamento e Gestão Escolar

## Project Overview
A React + Vite + TypeScript frontend application for school management (gestão escolar). Supports two user roles: **professor** (teacher) and **gestor** (manager), each with their own dashboard experience.

## Architecture
- **Frontend only** — pure React SPA using mock data services (no backend server)
- **Routing**: React Router v6 with protected routes based on user role
- **State/Auth**: React Context API (`AuthContext`) for authentication state
- **Data fetching**: TanStack React Query
- **UI**: shadcn/ui components built on Radix UI primitives + Tailwind CSS
- **Forms**: React Hook Form + Zod validation

## Key Pages
- `/login` — Login page
- `/registro` — Registration page
- `/dashboard` — Role-based dashboard (gestor or professor)
- `/planos/novo` — Create a new lesson plan
- `/planos/:id` — View a lesson plan
- `/planos/:id/editar` — Edit a lesson plan
- `/configuracoes` — Settings (gestor only)

## Key Files
- `src/App.tsx` — App shell, routing, providers
- `src/contexts/AuthContext.tsx` — Authentication context
- `src/services/api.ts` — Axios API client (VITE_API_URL env var for backend URL)
- `src/services/mockServices.ts` — Mock data services (used in development)
- `src/services/mockData.ts` — Static mock data
- `vite.config.ts` — Vite configuration (host: 0.0.0.0, port: 5000)

## Running the Project
- **Dev server**: `npm run dev` — starts Vite on port 5000
- **Build**: `npm run build`
- **Tests**: `npm test`

## Environment Variables
- `VITE_API_URL` — Base URL for backend API (defaults to `http://localhost:3001/api`)

## Replit Configuration
- Workflow: "Start application" runs `npm run dev` on port 5000 (webview)
- Migrated from Lovable — removed `lovable-tagger` from vite config, set host to `0.0.0.0` for Replit proxy compatibility
