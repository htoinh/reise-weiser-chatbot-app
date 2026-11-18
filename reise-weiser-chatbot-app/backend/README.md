# 🛠️ ReiseWeiser Backend

The ReiseWeiser backend is a contract-first **Spring Boot 4** REST API written in **Java 25**. It provides stateless JWT authentication, user-scoped conversation and chat history persistence in **PostgreSQL 17**, and AI travel assistance via **Spring AI (Google Gemini)**.

---

## 🧰 Technology Stack

- ☕ **Java 25** (Gradle `9.8.0` toolchain)
- 🌱 **Spring Boot `4.0.6`** (WebMVC, Validation, Actuator)
- 🔐 **Spring Security & JWT** (`io.jsonwebtoken:jjwt:0.12.5` + BCrypt)
- 🤖 **Spring AI `2.0.0`** (Google GenAI / Gemini `ChatClient`)
- 🐘 **PostgreSQL 17**, **Spring Data JPA / Hibernate**, and **Flyway** (`V1`–`V8`)
- 📖 **OpenAPI Generator `7.4.0`** & **SpringDoc Swagger UI `3.1.0`**
- 🧪 **JUnit 5**, **Mockito**, **MockMvc**, **Testcontainers** (`postgres:17`), and **JaCoCo**

---

## ✅ Prerequisites

- **JDK 25**
- **Docker Desktop** (for PostgreSQL 17, pgAdmin, and Testcontainers integration tests)
- **Git**

---

## 🔐 Environment Configuration

Create `backend/.env` from `backend/.env.example`:

```powershell
Copy-Item backend/.env.example backend/.env
```

Configure the required variables in `backend/.env` (never commit `.env`):

```dotenv
SERVER_PORT=8081
POSTGRES_URL=jdbc:postgresql://localhost:5432/reiseweiser
POSTGRES_USER=reiseweiser
POSTGRES_PASSWORD=root

GEMINI_API_KEY=your_google_ai_studio_api_key
GEMINI_MODEL=gemini-2.5-flash-lite

JWT_SECRET_KEY=change-me-local-dev-jwt-secret-key-at-least-32-bytes
JWT_EXPIRATION=86400000
```

*(When running inside Docker Compose, `compose.yaml` overrides `POSTGRES_URL` automatically to `jdbc:postgresql://db:5432/reiseweiser`.)*

---

## ▶️ Running the Backend

### Option A: Full Stack via Docker Compose

From the repository root:

```bash
docker compose up --build -d backend
```

### Option B: Local Gradle Run (with Docker PostgreSQL)

1. Start PostgreSQL (and optionally pgAdmin) from the repository root:
   ```bash
   docker compose up -d db pgadmin
   ```
2. Start the Spring Boot application from `backend/`:
   ```powershell
   .\gradlew.bat bootRun
   ```
   *(Git Bash / Linux / macOS: `./gradlew bootRun`)*

The API listens on `http://localhost:8081` and serves Swagger UI at `http://localhost:8081/swagger-ui.html`.

### Connecting pgAdmin (`http://localhost:5050`)

When registering the PostgreSQL server in pgAdmin (**Register → Server → Connection**), use the Docker service name `db`:
- **Host name/address**: `db`
- **Port**: `5432`
- **Maintenance database**: `reiseweiser`
- **Username / Password**: values of `POSTGRES_USER` / `POSTGRES_PASSWORD` (defaults: `reiseweiser` / `root`)

---

## 📖 REST API Endpoints

Interfaces (`com.studiosus.trainee.apis`) and DTOs (`com.studiosus.trainee.dtos`) are generated from `src/main/resources/openapi/reise-weiser.yaml`:

| Method | Path | Auth | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/register` | Public | Register a new user (`name`, `email`, `password`) and return `{ token, name }`. |
| `POST` | `/login` | Public | Authenticate credentials (`email`, `password`) and return `{ token, name }`. |
| `GET` | `/current-user` | Bearer JWT | Return the authenticated user's `{ email, name }` profile. |
| `POST` | `/chatbot/conversation` | Bearer JWT | Create a new conversation owned by the authenticated user (`201 Created`). |
| `POST` | `/chatbot/message` | Bearer JWT | Send `{ conversationId, promptMessage }` to Gemini, persist the exchange, and return `{ messageId, conversationId, content }`. |
| `GET` | `/chat-history` | Bearer JWT | Return the authenticated user's chronological message history across conversations. |

---

## 🗄️ Database Migrations (Flyway)

Flyway runs versioned SQL migrations from `src/main/resources/db/migration/` on startup with `spring.jpa.hibernate.ddl-auto=validate`:

```text
src/main/resources/db/migration/
├── V1__create_users.sql
├── V2__create_conversations.sql
├── V3__create_messages.sql
├── V4__update_user_fields.sql
├── V5__create_chat_messages.sql
├── V7__drop_unused_messages.sql
└── V8__add_chat_messages_fk_and_index.sql
```

| Active Table | Purpose |
| :--- | :--- |
| `users` | Registered accounts (`id`, `email`, `password_hash`, `name`, timestamps) |
| `conversations` | User-owned conversations (`id`, `user_id`, `title`, timestamps) |
| `chat_messages` | Stored user prompts and AI answers (`id`, `conversation_id`, `user_prompt`, `ai_response`, `created_at`) |
| `flyway_schema_history` | Applied Flyway migration metadata |

---

## 🧪 Testing & JaCoCo Coverage

Run all unit, `@WebMvcTest`, security, and Testcontainers (`postgres:17`) repository integration tests with JaCoCo verification:

```powershell
.\gradlew test jacocoTestCoverageVerification
```

- **HTML coverage report**: `backend/build/reports/jacoco/test/html/index.html`
- **XML coverage report**: `backend/build/reports/jacoco/test/jacocoTestReport.xml`
- **Coverage gate**: Enforces `>= 80%` line coverage across `com.studiosus.trainee.controller.*` and `com.studiosus.trainee.service.*` (excluding OpenAPI-generated stubs).

### Other Useful Gradle Commands

```powershell
# Regenerate OpenAPI interfaces and DTOs
.\gradlew openApiGenerate

# Full clean build (includes tests + JaCoCo verification)
.\gradlew clean build
```
