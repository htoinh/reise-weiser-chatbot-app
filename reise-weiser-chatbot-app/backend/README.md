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
- 🔐 Spring Security and JWT
- 🤖 Spring AI and Google Gemini 
- 📖 OpenAPI and Swagger UI 

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

PGADMIN_EMAIL=admin@reiseweiser.com
PGADMIN_PASSWORD=choose_a_local_pgadmin_password
PGADMIN_PORT=5050

GEMINI_API_KEY=your_google_ai_studio_api_key
GEMINI_MODEL=gemini-3.8-flash
```

The `.env` file is local and must not be committed.

<a id="docker-compose"></a>
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

<a id="run-the-backend"></a>
## ▶️ Run the backend
### IntelliJ IDEA
1. Start PostgreSQL and pgAdmin using [Docker Compose](#docker-compose).
2. Open **Run → Edit Configurations**.
3. Select `ReiseWeiserChatbotApplication`.
4. Add the values from `.env` under **Environment variables**.
5. Apply the changes and run the application.
### Git Bash
From the repository root:
```bash
docker compose up -d
set -a
source .env
set +a
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
| `chat_message` | Stored prompts, AI answers, conversation IDs and creation timestamps |

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
Generate API interfaces and DTOs from the OpenAPI specification:
```bash
./gradlew openApiGenerate
```
## 🛑 Stop the services

From the repository root:

```bash
docker compose stop
```

This stops the containers but keeps their data.

> ⚠️ `docker compose down -v` deletes the database volumes and all locally stored data.

## 📮 Test with Postman 
Start the [backend](#run-the-backend) and [docker compose](#docker-compose) services in different terminals:

Wait for the application startup confirmation and keep the terminals running.
### Register a user
Configure the request:
- **Method:** POST
- **URL:** `http://localhost:8080/api/auth/register`
```json
{
 "email": "test@example.com",
 "password": "TestPassword123!",
 "name": "Test User"
}
```
### Log in
Configure the request:
- **Method:** POST
- **URL:** `http://localhost:8080/api/auth/login`
```json
{
 "email": "test@example.com",
 "password": "TestPassword123!"
}
```

To check invalid credentials, resend the login request with an incorrect password. The required response is **401 Unauthorized**.

## 🧪 Test with Swagger UI

1. [Start the backend](#run-the-backend) with PostgreSQL running.

2. Open http://localhost:8080/swagger-ui.html.

3. Execute `POST /register` with a new email, password and name.

4. Execute `POST /login` using the registered email and password.

5. Copy the returned JWT. Click **Authorize**, paste the token without

   the `Bearer ` prefix, and authorize.

### Create a conversation

Execute `POST /conversations`. No request body is required.

### Send a message

Execute `POST /chatbot/message` using the returned conversation ID:

```json
{
  "conversationId": 1,
  "promptMessage": "Suggest three places to visit in Berlin."
}
```

### Retrieve chat history

Execute `GET /chat-history`. No request body is required.
