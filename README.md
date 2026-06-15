# ProjectFlow

A full-stack SaaS project management platform built with modern technologies. Manage teams, projects, and tasks with a clean and responsive interface.

**Live demo:** [projectflow.vercel.app](https://projectflow.vercel.app) <!-- update after deploy -->

**Demo accounts:**
| Email | Password | Role |
|-------|----------|------|
| alice@projectflow.dev | Password123! | Admin |
| bob@projectflow.dev | Password123! | Manager |
| carlos@projectflow.dev | Password123! | Developer |

---

## Features

- **Authentication** — JWT-based auth with refresh tokens and HTTP-only cookies
- **Teams** — Create teams, invite members, manage roles (Admin / Manager / Developer)
- **Projects** — Create and manage projects per team
- **Kanban board** — Visualize tasks by status with one-click status updates
- **Task detail** — Full task view with comments and real-time status/priority editing
- **Notifications** — In-app notifications triggered by task comments
- **Dashboard** — Personal stats: completed tasks, overdue, in-progress, teams
- **Dark mode** — System preference detection + manual toggle
- **Internationalization** — English and Spanish (EN / ES)
- **Responsive** — Works on mobile, tablet, and desktop

---

## Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| Next.js 16 (App Router) | React framework |
| TypeScript | Type safety |
| Tailwind CSS v4 | Styling |
| shadcn/ui | UI components |
| TanStack Query | Server state management |
| Zustand | Client state management |
| React Hook Form + Zod | Forms and validation |
| next-intl | Internationalization |
| next-themes | Dark mode |
| Axios | HTTP client |

### Backend
| Technology | Purpose |
|-----------|---------|
| NestJS | Node.js framework |
| TypeScript | Type safety |
| Prisma ORM | Database access |
| PostgreSQL | Relational database |
| JWT + Passport | Authentication |
| Swagger / OpenAPI | API documentation |
| bcryptjs | Password hashing |
| Docker | Local development |

---

## Architecture
projectflow/                  # Turborepo monorepo

├── apps/

│   ├── web/                  # Next.js frontend (port 3000)

│   └── api/                  # NestJS backend (port 3001)

├── packages/

│   └── shared/               # Shared TypeScript types (future)

├── docker-compose.yml        # PostgreSQL + Redis

└── turbo.json

### Backend module structure
src/

├── auth/           # JWT auth, register, login, refresh

├── users/          # User profile management

├── teams/          # Teams, members, invitations

├── projects/       # Project CRUD

├── tasks/          # Task CRUD + Kanban logic

├── comments/       # Task comments + notifications trigger

├── notifications/  # In-app notifications

├── dashboard/      # Aggregated stats

└── prisma/         # Database service

### Database schema

- `User` → many `TeamMember` → many `Team`
- `Team` → many `Project`
- `Project` → many `Task`
- `Task` → many `Comment`, many `Notification`
- `Invitation` → links `Team` + email + token

---

## Local Development

### Prerequisites

- Node.js 20+
- pnpm 10+
- Docker Desktop

### Setup

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/projectflow.git
cd projectflow

# Install dependencies
pnpm install

# Start PostgreSQL
docker compose up -d

# Backend setup
cd apps/api
cp .env.example .env        # Fill in your values
pnpm prisma migrate dev
pnpm db:seed                # Optional: load demo data

# Frontend setup
cd ../web
cp .env.example .env.local  # Fill in your values

# Run both apps
cd ../..
pnpm dev
```

### Environment variables

**`apps/api/.env`**
```env
DATABASE_URL="postgresql://projectflow:projectflow123@localhost:5432/projectflow"
JWT_SECRET="your-jwt-secret"
JWT_REFRESH_SECRET="your-refresh-secret"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"
PORT=3001
NODE_ENV=development
FRONTEND_URL="http://localhost:3000"
```

**`apps/web/.env.local`**
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
```

### Available commands

```bash
pnpm dev          # Run frontend + backend concurrently
pnpm build        # Build all apps
pnpm lint         # Lint all apps

# From apps/api
pnpm db:migrate   # Run Prisma migrations
pnpm db:studio    # Open Prisma Studio
pnpm db:seed      # Seed demo data

# API docs available at
# http://localhost:3001/api/docs
```

---

## API Documentation

Full Swagger documentation available at `/api/docs` when running locally.

### Endpoints summary

| Module | Method | Endpoint |
|--------|--------|----------|
| Auth | POST | `/api/v1/auth/register` |
| Auth | POST | `/api/v1/auth/login` |
| Auth | POST | `/api/v1/auth/logout` |
| Auth | POST | `/api/v1/auth/refresh` |
| Auth | GET | `/api/v1/auth/me` |
| Users | GET/PATCH | `/api/v1/users/me` |
| Teams | GET/POST | `/api/v1/teams` |
| Teams | POST | `/api/v1/teams/:id/invite` |
| Projects | GET/POST | `/api/v1/teams/:id/projects` |
| Projects | GET/PATCH/DELETE | `/api/v1/projects/:id` |
| Tasks | GET/POST | `/api/v1/projects/:id/tasks` |
| Tasks | GET/PATCH/DELETE | `/api/v1/tasks/:id` |
| Tasks | GET | `/api/v1/tasks/mine` |
| Comments | GET/POST | `/api/v1/tasks/:id/comments` |
| Notifications | GET | `/api/v1/notifications` |
| Dashboard | GET | `/api/v1/dashboard/me` |

---

## Deployment

| Service | Platform | Free tier |
|---------|----------|-----------|
| Frontend | Vercel | Yes |
| Backend | Render | Yes |
| Database | Neon (PostgreSQL) | Yes |

---

## Author

**Juan Jose** — Full Stack Developer
- GitHub: [@juanjosegl](https://github.com/juanjosegl)
- LinkedIn: [linkedin.com/in/juan-jose-gutierrez-lasso-303695232/](https://www.linkedin.com/in/juan-jose-gutierrez-lasso-303695232/)

---

## License

MIT
