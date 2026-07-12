# SmartRecover — AI-Powered Campus Lost & Found

## Project Overview

A full-stack SaaS platform for campus lost & found management, featuring AI-powered item matching (Gemini API with rule-based fallback), JWT authentication, real-time notifications, claims workflow, and an admin dashboard.

---

## Architecture

| Layer | Stack |
|-------|-------|
| Backend | Spring Boot 3.5.4 / Java 17 (GraalVM CE 22.3.1 / Java 19) |
| Database | Replit built-in PostgreSQL (via `DATABASE_URL`) |
| Frontend | React 18 + Vite + TypeScript + Tailwind CSS 3 |
| Auth | JWT (HS256), 24h expiry |
| AI Matching | Google Gemini API (falls back to rule-based scoring) |
| File Uploads | Local disk (`/uploads/` directory), served via Spring |

---

## Running Locally

Two workflows run in parallel:

- **Backend API** — Spring Boot on port 8080  
  `cd /home/runner/workspace && ./mvnw spring-boot:run -q`

- **Start application** — Vite dev server on port 5000 (preview port)  
  `cd /home/runner/workspace/frontend && npm install --silent && npm run dev`

The Vite dev server proxies `/api` and `/uploads` to `localhost:8080`.

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ | Replit PostgreSQL URL (`postgresql://user:pass@host/db`) |
| `SESSION_SECRET` | ✅ | Secret used for sessions (not JWT — kept for compatibility) |
| `GEMINI_API_KEY` | Optional | Enables real Gemini AI matching; falls back to rule-based if absent |

The JWT secret is currently hardcoded in `application.properties` — move to an env var for production.

---

## Key Design Decisions

- **DataSource**: Custom `DataSourceConfig.java` parses the `postgresql://` URL format from Replit into a proper JDBC URL (HikariCP). Spring Boot's `DataSourceAutoConfiguration` is excluded.
- **Component scan**: `@ComponentScan(basePackages = { "com.smartrecover" })` catches beans in both `com.smartrecover.smartrecover` and `com.smartrecover.config/service/controller/...`.
- **Security**: All `/api/auth/**` and static asset paths are public; everything else requires a valid JWT.
- **AI Matching**: `GeminiService` checks for `GEMINI_API_KEY` at runtime; if absent, `MatchService` uses a weighted rule-based scorer (name, category, color, location).
- **CORS**: Configured to allow all origins in dev — tighten for production.

---

## Directory Structure

```
/
├── src/                         # Spring Boot backend
│   └── main/java/com/smartrecover/
│       ├── config/              # Security, CORS, Web, DataSource configs
│       ├── controller/          # REST API controllers (/api/*)
│       ├── dto/                 # Request/response DTOs
│       ├── entity/              # JPA entities
│       ├── exception/           # Global exception handler
│       ├── repository/          # Spring Data JPA repositories
│       ├── security/            # JWT util + filter
│       └── service/             # Business logic
├── frontend/                    # React + Vite SPA
│   └── src/
│       ├── components/          # Layout, ItemModal, NotificationBell, etc.
│       ├── contexts/            # AuthContext, ThemeContext
│       ├── lib/api.ts           # Axios client with all API endpoints
│       └── pages/              # All page components
├── uploads/                     # File upload storage (created at runtime)
└── pom.xml
```

---

## API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/auth/register` | Public | Register user |
| POST | `/api/auth/login` | Public | Login, returns JWT |
| GET/PUT | `/api/users/me` | User | Get/update profile |
| GET | `/api/users` | Admin | List all users |
| CRUD | `/api/lost-items` | User | Lost item management |
| CRUD | `/api/found-items` | User | Found item management |
| GET | `/api/matches` | User | List AI matches |
| POST | `/api/matches/find` | User | Run AI matching |
| CRUD | `/api/claims` | User/Admin | Claims workflow |
| GET | `/api/notifications` | User | Notifications |
| GET | `/api/analytics` | User | Statistics |
| POST | `/api/upload` | User | Upload image |

---

## Creating the First Admin User

1. Register via `/register` (or the API)
2. In the PostgreSQL console or via SQL, update the user's role:
   ```sql
   UPDATE users SET role = 'ADMIN' WHERE email = 'your@email.com';
   ```
3. Log in — the app will route admins to `/admin` automatically.

---

## User Preferences

- All controllers are under `/api/**` prefix
- Frontend lives in `frontend/` directory, not at root
- Dark mode uses Tailwind's `class` strategy (toggled via ThemeContext)
- Use `date-fns` for date formatting (already installed)
