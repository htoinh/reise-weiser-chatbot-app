# 🧭 ReiseWeiser

**ReiseWeiser** is a full-stack chatbot for travel-related questions. The planned application uses Google Gemini to generate answers supported by approved, publicly available travel sources.

> 🚧 **Status:** ReiseWeiser is currently under development.

## ✨ Planned features

- 🔐 User registration and JWT authentication
- 🤖 AI-generated answers using Google Gemini
- 🔎 Retrieval from approved public sources
- 🔗 Traceable source links
- 💬 User-specific conversations and chat history
- 📱 Responsive React interface
- 📖 OpenAPI documentation with Swagger UI
- 🐘 PostgreSQL persistence
- 🧠 Semantic search with pgvector
- 🐳 Docker-based local development

---

## 💻 How it works:

When a user asks a question, ReiseWeiser searches its collection of approved public content for relevant information. The retrieved content is added to the Gemini prompt so that the generated answer can be based on identifiable sources.

The answer is displayed together with the source pages that were used.

Information that can change quickly such as prices, availability, departure dates or opening hours is not provided. Instead, the application directs the user to the appropriate live source.

If no suitable source is available, the assistant informs the user instead of inventing an answer or citation.

---

## 🏗️ Project structure

```text
reise-weiser-chatbot-app/
├── backend/           # Spring Boot API
├── frontend/          # React application
├── docs/              # Project documentation
├── .env.example       # Environment-variable template
├── compose.yaml       # PostgreSQL and pgAdmin
└── README.md
```

## 🚀 Quick start

### 1. Create the environment file

Git Bash:

```bash
cp .env.example .env
```

Replace the example passwords in `.env` with local development values.

### 2. Start the database

Make sure Docker Desktop is running, then execute:

```bash
docker compose up -d
```

The services are available at:

| Service | Address |
|---|---|
| PostgreSQL | `localhost:5432` |
| pgAdmin | `http://localhost:5050` |
| Backend | `http://localhost:8080` |
| Frontend | `http://localhost:5173` |

### 3. Start the applications

Follow the detailed instructions:

- 🛠️ [Backend setup](backend/README.md)
- 🎨 [Frontend setup](frontend/README.md)

## 🛑 Stop the infrastructure

Stop the containers while retaining the database data:

```bash
docker compose down
```

View their status at any time:

```bash
docker compose ps
```
