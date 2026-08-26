# IdeaNest

A personal second brain, treated with the care of a private library.

IdeaNest is a premium, single-tenant workspace designed for knowledge workers and creators to capture, refine, and track thoughts across the lifecycle of a project. Free from the urgency and distraction of modern productivity tools, it provides a quiet, focused archive for your ideas.

---

## Architecture Overview

IdeaNest is built as a monorepo consisting of two primary services:

*   **[`api`](file:///d:/Personal/projects/IdeaNest/api)**: NestJS 11 backend (TypeScript, Express adapter, Drizzle ORM, Better Auth).
*   **[`web`](file:///d:/Personal/projects/IdeaNest/web)**: React 19 frontend (TypeScript, Vite 8, Tailwind v4, Redux Toolkit, shadcn/ui).

### Backend (`api/`)

*   **Framework**: NestJS 11 with Express.
*   **Database**: PostgreSQL connected via Drizzle ORM.
*   **Authentication**: Better Auth with Google OAuth provider and session-based route protection.
*   **Structure**: Domain-driven modular structure. Each feature contains its controller, service, module, DTOs, and mappings (e.g., `IdeaMapper`) to separate HTTP and database concerns.

### Frontend (`web/`)

*   **Build tool**: Vite 8.
*   **State Management**: Redux Toolkit for UI/local state, and RTK Query for backend API synchronization.
*   **Styling**: Tailwind CSS v4, custom theme variables, and custom typography ratios.
*   **Components**: Custom design primitives and customized shadcn/ui components.

---

## Getting Started

### Prerequisites

*   Node.js (v18+ recommended)
*   PostgreSQL instance (e.g., Neon serverless Postgres)
*   Google Cloud Console credentials for OAuth

### Environment Setup

Create an `.env` file in the `api/` directory with the following variables:

```env
DATABASE_URL="your-postgres-connection-string"
BETTER_AUTH_SECRET="your-better-auth-secret"
BETTER_AUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID="your-google-oauth-client-id"
GOOGLE_CLIENT_SECRET="your-google-oauth-client-secret"
```

The frontend reads the `VITE_API_URL` variable to communicate with the backend, defaulting to `http://localhost:3000` if not specified.

---

## Directory Commands

All commands are run from their respective directory roots (`api/` or `web/`).

### API (`api/`)

| Command | Action |
| :--- | :--- |
| `npm install` | Install dependencies |
| `npm run start:dev` | Run the Nest development server with live watch (port 3000) |
| `npm run build` | Compile the application into `dist/` |
| `npm run start:prod` | Run the compiled production build |
| `npm run db:generate` | Generate migrations based on schema definitions |
| `npm run db:push` | Push schema changes directly to the database (development) |
| `npm run db:migrate` | Apply migrations to the database |
| `npm run db:studio` | Open Drizzle Studio database GUI |
| `npm test` | Run Jest unit tests |
| `npm run test:e2e` | Run end-to-end test suite |
| `npm run lint` | Run ESLint static analysis |

### Web (`web/`)

| Command | Action |
| :--- | :--- |
| `npm install` | Install dependencies |
| `npm run dev` | Run the Vite development server (port 5173) |
| `npm run build` | Perform TypeScript type checks and build the production bundle |
| `npm run preview` | Preview the local production build |
| `npm run lint` | Run ESLint checks |

---

## Design and Brand

IdeaNest follows a distinct design philosophy documented in [`PRODUCT.md`](file:///d:/Personal/projects/IdeaNest/PRODUCT.md) and [`DESIGN.md`](file:///d:/Personal/projects/IdeaNest/DESIGN.md):
*   **Restraint**: Premium dark theme with minimal gold accents and Greco-Roman structural symmetry.
*   **Accessibility**: Targeted to WCAG 2.2 AA guidelines.
*   **Calm**: Respects reduced motion preferences and provides clear visual hierarchies without artificial urgency.

---

## License

This project is licensed under the terms of the MIT License. See [`LICENSE.md`](file:///d:/Personal/projects/IdeaNest/LICENSE.md) for details.

