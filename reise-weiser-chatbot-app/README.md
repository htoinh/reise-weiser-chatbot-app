# 🧭 ReiseWeiser

**ReiseWeiser** is a full-stack AI travel chatbot built with **Spring Boot 4 (Java 25)**, **React 19 + TypeScript**, **PostgreSQL 17**, and **Spring AI (Google Gemini)**. Authenticated users can start travel conversations, receive concise plain-text recommendations, and revisit their conversation history across sessions.

---

## ✨ Key Features

- 🔐 **JWT Authentication**: User registration (`POST /register`), sign-in (`POST /login`), and profile lookup (`GET /current-user`) with BCrypt password hashing and stateless Bearer tokens.
- 🤖 **Google Gemini Travel Assistant**: Lazily creates user-owned conversations (`POST /chatbot/conversation`), generates automatic conversation titles, and returns concise (`< 100` words) plain-text answers (`POST /chatbot/message`).
- 💬 **Persistent Chat History**: Stores user prompts and AI answers in PostgreSQL (`GET /chat-history`) scoped strictly to the authenticated user.
- 🎨 **Responsive React 19 UI**: Light/dark theme toggle, header status displaying the user's database name (`Signed in as <name>`), admin and `ReiseWeiser` robot message avatars, keyboard shortcuts (`Enter` to send, `Shift+Enter` for newline), and protected routing.
- 📖 **Contract-First OpenAPI & Swagger UI**: Backend controllers and DTOs are generated from `backend/src/main/resources/openapi/reise-weiser.yaml` and documented at `/swagger-ui.html`.
- 🧪 **Automated Testing & Coverage**: JUnit 5, Mockito, MockMvc, Testcontainers (`postgres:17` + Flyway), JaCoCo (`>= 80%` controller/service line coverage), Vitest + React Testing Library, and `node:test`.
- 🐳 **Multi-Stage Docker & Compose**: Production-ready multi-stage images for backend (`eclipse-temurin:25-jre`) and frontend (`nginx:alpine`) orchestrated with PostgreSQL 17 and pgAdmin.

---

## 🏗️ Project Structure

```text
reise-weiser-chatbot-app/
├── backend/                # Java 25 & Spring Boot 4 REST API, OpenAPI spec, Flyway, JUnit/Testcontainers
├── frontend/               # React 19, TypeScript 6 & Vite 8 SPA, Nginx config, Vitest/RTL suites
├── compose.yaml            # Full-stack Docker Compose (db, pgadmin, backend, frontend)
└── README.md
```

---

## 🚀 Quick Start (Docker Compose)

### 1. Configure Backend Environment Variables

Copy the example environment file and add your Google Gemini API key:

```powershell
Copy-Item backend/.env.example backend/.env
```

Ensure `backend/.env` includes `GEMINI_API_KEY` and `GEMINI_MODEL` (for example `gemini-2.5-flash-lite`), along with your local database and JWT settings.

### 2. Build and Start the Full Stack

Make sure **Docker Desktop** is running, then run from the repository root:

```bash
docker compose up --build -d
```

Once started, the services are available at:

| Service | Container | URL / Host |
| :--- | :--- | :--- |
| **Frontend (Nginx + `/api` proxy)** | `reise_weiser_frontend` | `http://localhost:3000` |
| **Backend REST API** | `reise_weiser_backend` | `http://localhost:8081` |
| **Swagger UI** | `reise_weiser_backend` | `http://localhost:8081/swagger-ui.html` |
| **pgAdmin 4** | `reise_weiser_pgadmin` | `http://localhost:5050` |
| **PostgreSQL 17** | `reise_weiser_db` | `localhost:5432` |

---

## 🛠️ Local Development & Testing Guides

- 🛠️ [Backend Setup & API Guide](backend/README.md)
- 🎨 [Frontend Setup & Scripts Guide](frontend/README.md)

### Run All Tests Locally

```powershell
# Backend unit, MockMvc, Testcontainers PostgreSQL 17 & JaCoCo (>= 80% coverage)
.\backend\gradlew.bat -p backend test jacocoTestCoverageVerification

# Frontend Vitest + React Testing Library & API client tests
npm --prefix frontend test
```

---

## ⌨️ Useful Docker Compose Commands

```bash
# Check container health and port mappings
docker compose ps

# Stop containers without removing them
docker compose stop

# Start existing stopped containers
docker compose start

# Remove containers while keeping persistent database volumes
docker compose down

# Remove containers AND delete persistent database volumes
docker compose down -v
```
