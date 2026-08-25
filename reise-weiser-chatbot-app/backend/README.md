# 🛠️ ReiseWeiser Backend

The ReiseWeiser backend provides the REST API, database persistence, authentication, conversation management and future Gemini integration.

> 🚧 **Current status:** PostgreSQL, pgAdmin, Spring Data JPA and Flyway database migrations are configured. Authentication, chat endpoints and AI integration will be implemented in later project phases.

## 🧰 Technology stack

- ☕ Java
- 🌱 Spring Boot
- 🐘 PostgreSQL
- 🗃️ Spring Data JPA and Hibernate
- 🛫 Flyway
- 🐘 pgAdmin
- 🐳 Docker Compose
- 🔐 Spring Security and JWT — planned
- 🤖 Spring AI and Google Gemini — planned
- 📖 OpenAPI and Swagger UI — planned

## ✅ Prerequisites

Before running the backend, install:

- The Java version configured in `build.gradle`
- Docker Desktop with Linux containers enabled
- Git

PostgreSQL and pgAdmin are managed by the root `compose.yaml`.

## 🔐 Environment configuration

From the repository root, copy the example file:

```bash
cp .env.example .env
```

PowerShell:

```powershell
Copy-Item .env.example .env
```

Configure local values:

```dotenv
POSTGRES_DB=reiseweiser
POSTGRES_USER=reiseweiser
POSTGRES_PASSWORD=choose_a_local_database_password
POSTGRES_PORT=5432
POSTGRES_URL=jdbc:postgresql://localhost:5432/reiseweiser

PGADMIN_EMAIL=admin@reiseweiser.local
PGADMIN_PASSWORD=choose_a_local_pgadmin_password
PGADMIN_PORT=5050
```

The `.env` file is local and must not be committed.

## 🐳 Start PostgreSQL and pgAdmin

From the repository root:

```bash
docker compose up -d
docker compose ps
```

Expected services:

```text
database
pgadmin
```

## 🐘 Open pgAdmin

Open:

```text
http://localhost:5050
```

Log in using:

```text
Email: value of PGADMIN_EMAIL
Password: value of PGADMIN_PASSWORD
```

Register the PostgreSQL server through **Register → Server**.

### General

```text
Name: ReiseWeiser Local
```

### Connection

```text
Host name/address: database
Port: 5432
Maintenance database: reiseweiser
Username: reiseweiser
Password: value of POSTGRES_PASSWORD
```

The hostname is `database` because pgAdmin and PostgreSQL run in the same Docker network.

## ▶️ Run the backend

```bash
cd backend
./gradlew bootRun
```
The backend starts at:

```text
http://localhost:8080
```

## 🗄️ Database migrations

Flyway manages the database schema through versioned SQL files:

```text
src/main/resources/db/migration/
├── V1__create_users.sql
├── V2__create_conversations.sql
└── V3__create_messages.sql
```

| Table | Purpose |
|---|---|
| `users` | Registered users and BCrypt password hashes |
| `conversations` | Chat conversations owned by users |
| `messages` | User and assistant messages |
| `flyway_schema_history` | Applied database-migration history |

## 🧹 Useful Gradle commands

Build the backend:

```bash
./gradlew clean build
```

Run the backend:

```bash
./gradlew bootRun
```

Run backend tests:

```bash
./gradlew test
```

Clean generated build files:

```bash
./gradlew clean
```

## 🛑 Stop the services

From the repository root:

```bash
docker compose down
```

This stops the containers but keeps their data.

> ⚠️ `docker compose down -v` deletes the database volumes and all locally stored data.
