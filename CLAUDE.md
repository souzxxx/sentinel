# Project: Sentinel

Dashboard de monitoramento 3D em tempo real com estética sci-fi. Métricas reais (GitHub, sistema) visualizadas em espaço tridimensional interativo.

## Tech Stack

**Frontend:** Next.js 14+ (App Router), React Three Fiber, @react-three/drei, @react-three/postprocessing, Zustand, TypeScript, Tailwind CSS, Framer Motion, GSAP
**Backend:** FastAPI, WebSockets, PostgreSQL, SQLAlchemy, psutil
**Deploy:** Vercel (front), Render free tier (back)

## Project Structure

```
sentinel/
├── apps/
│   ├── web/                  # Next.js frontend
│   │   ├── src/
│   │   │   ├── app/          # App Router pages
│   │   │   ├── components/
│   │   │   │   ├── canvas/   # React Three Fiber 3D components
│   │   │   │   ├── hud/      # Overlay UI on top of 3D canvas
│   │   │   │   └── ui/       # Standard React + Tailwind components
│   │   │   ├── hooks/        # Custom React hooks (useWebSocket, useGitHub, etc.)
│   │   │   ├── stores/       # Zustand stores (scene, metrics, github)
│   │   │   ├── lib/          # Utilities, constants, API clients
│   │   │   └── types/        # TypeScript type definitions
│   │   └── public/
│   └── api/                  # FastAPI backend
│       ├── app/
│       │   ├── main.py
│       │   ├── api/
│       │   │   ├── routes/   # REST endpoints
│       │   │   └── ws/       # WebSocket handlers
│       │   ├── services/     # Business logic (github, metrics, etc.)
│       │   ├── models/       # SQLAlchemy models
│       │   └── core/         # Config, dependencies, settings
│       ├── Dockerfile
│       └── requirements.txt
└── packages/
    └── shared/               # Shared types/constants between front and back
```

## Architecture Decisions

- 3D components live in `components/canvas/` and are ONLY used inside R3F `<Canvas>`. Never mix R3F components with regular React DOM components.
- All 3D state (camera position, selected satellite, scene mode) goes through Zustand stores, not React state. This avoids unnecessary re-renders of the Canvas.
- WebSocket connection is managed by a single custom hook (`useWebSocket`) that writes to Zustand. Components subscribe to the store, never directly to the socket.
- Backend uses async endpoints exclusively. All DB access through async SQLAlchemy.

## Coding Conventions

- IMPORTANT: All components are functional with hooks. No class components.
- IMPORTANT: Use `useFrame` from R3F for animation loops inside 3D components. Never use `requestAnimationFrame` directly.
- R3F components receive props for customization but manage their own animation state internally via `useRef`.
- Name 3D component files with `.three.tsx` suffix (e.g., `CoreSphere.three.tsx`) to distinguish from DOM components.
- Zustand stores use the slice pattern: one file per domain (`sceneStore.ts`, `metricsStore.ts`, `githubStore.ts`).
- Backend route files are organized by domain: `routes/github.py`, `routes/metrics.py`, `routes/layout.py`.

## Common Commands

```bash
# Frontend
cd apps/web && npm run dev          # Dev server (localhost:3000)
cd apps/web && npm run build        # Production build
cd apps/web && npm run lint         # ESLint check
cd apps/web && npm test            # Vitest tests
cd apps/web && npm run test:watch  # Vitest watch mode

# Backend
cd apps/api && uvicorn app.main:app --reload   # Dev server (localhost:8000)
cd apps/api && pytest                           # Run tests

# Docker
docker compose up -d                # Start full stack locally
```

## Git Workflow

- Branch naming: `feat/phase-X-description`, `fix/description`, `refactor/description`
- Commits: conventional commits (feat:, fix:, refactor:, docs:, style:, test:)
- IMPORTANT: Always run lint and type check before committing.

## Current Phase

Phase 6 — COMPLETE. All phases done. CI/CD, README, meta tags, loading screen, license.

## Known Gotchas

- R3F `<Canvas>` must be wrapped in a div with explicit height (e.g., `h-screen`). Without it, canvas collapses to 0px.
- drei's `<OrbitControls>` must be INSIDE `<Canvas>`, not outside.
- GSAP animations on Three.js objects: animate the `.current` ref, not the React component.
- `useFrame` callback runs every frame (~60fps). Keep it lightweight — no allocations, no state updates inside it.
- Zustand stores accessed inside `useFrame` should use `getState()` instead of hooks to avoid re-renders.
- Render free tier sleeps after 15min idle. Frontend must handle WebSocket reconnection gracefully and show a "connecting..." state instead of breaking. Mock data fallback is essential for demo purposes.
