# SmartRecover AI — Multi-Agent Intelligent Lost & Found

## Project Overview

SmartRecover AI is a full-stack campus lost-and-found management platform powered by 8 specialized AI agents. It replaces manual lost-and-found boards with semantic matching, AI-guided reporting, and explainable match reasoning.

### Stack
- **Backend:** Spring Boot 3.5, PostgreSQL (Replit-managed), JWT auth, Hibernate JPA
- **Frontend:** React 19, react-router-dom v7, Axios (proxy to backend), CSS custom properties
- **AI:** Gemini 1.5 Flash (optional) with smart rule-based fallback

### Architecture
- Backend API runs on port **8080** (Spring Boot, Tomcat)
- Frontend dev server runs on port **5000** (Create React App, proxies `/api/*` → `localhost:8080`)
- Database: PostgreSQL 16 via Replit's managed `DATABASE_URL`

---

## How to Run

Both workflows start automatically. Use the **Project** run button, or start individually:

| Workflow | Command | Port |
|---|---|---|
| Backend API | `./mvnw spring-boot:run -q` | 8080 |
| Start application | `PORT=5000 npm start` (in `frontend/`) | 5000 |

---

## The 8 AI Agents

1. **Report Agent** — Conversational chat guides users to report lost items (`POST /api/ai/chat`)
2. **Vision Agent** — Gemini Vision analyses item photos for auto-description
3. **Description Agent** — Enriches simple descriptions into search-optimised text (`POST /api/ai/enhance-description`)
4. **Matching Agent** — Semantic multi-factor scoring across all lost/found pairs (`POST /api/matches/run`)
5. **Explainable AI** — Human-readable explanation of why items match (`POST /api/ai/explain-match`)
6. **Verification Agent** — Generates ownership challenge questions (`POST /api/ai/verification-questions`)
7. **Notification Agent** — Real-time alerts when a match is found
8. **Analytics Agent** — Recovery stats, rates, and reporting (`GET /api/analytics/summary`)

Agent status: `GET /api/ai/agents/status`

---

## Key API Endpoints

### Auth
- `POST /api/auth/register` — Register new user
- `POST /api/auth/login` — Login, returns JWT

### Items
- `GET/POST /api/lost-items` — List / report lost items
- `GET/POST /api/found-items` — List / report found items

### Matching
- `GET /api/matches` — All AI matches (sorted by score)
- `POST /api/matches/run` — Trigger AI matching run (admin)
- `PUT /api/matches/{id}/status` — Confirm or reject a match

### Claims
- `POST /api/claims` — Submit ownership claim
- `GET /api/claims` — List claims (admin: all; user: own)
- `PUT /api/claims/{id}/status` — Approve / reject claim (admin)

### AI Agents
- `POST /api/ai/chat` — Report Agent conversational chat
- `POST /api/ai/enhance-description` — Description Agent
- `POST /api/ai/verification-questions` — Verification Agent
- `POST /api/ai/explain-match` — Explainable AI
- `GET /api/ai/agents/status` — All agent statuses

---

## Frontend Pages

| Route | Page | Access |
|---|---|---|
| `/` | Landing page | Public |
| `/login` | Sign in | Public |
| `/register` | Sign up | Public |
| `/dashboard` | Student dashboard | Student |
| `/lost-items/new` | Report lost item | Student |
| `/found-items/new` | Report found item | Student |
| `/matches` | AI Matches | Student |
| `/claims` | My Claims | Student |
| `/notifications` | Notifications | Student |
| `/ai-agents` | AI Agents demo | Student |
| `/admin` | Admin dashboard | Admin |

---

## Environment & Secrets

| Variable | Source | Notes |
|---|---|---|
| `DATABASE_URL` | Replit auto | `postgres://postgres:password@helium/heliumdb` |
| `SESSION_SECRET` | Replit Secret | Used for session signing |
| `GEMINI_API_KEY` | Optional secret | Set `gemini.api.key` in `application.properties` if you want real Gemini AI; falls back to smart rule-based logic without it |

---

## User Preferences

- Keep the existing Spring Boot backend structure — only add on top, never rewrite
- All frontend API calls must use relative paths (e.g. `/api/...`) not `localhost`
- Design system: dark navy `#0a0f1e`, indigo/purple/cyan gradients, glassmorphism cards, Space Grotesk + Inter fonts
- Rule-based AI fallback must always work without any API key
