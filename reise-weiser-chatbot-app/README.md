# ReiseWeiser

**ReiseWeiser** is a full-stack chatbot application for travel-related questions. It uses Google Gemini to generate answers and supports those answers with approved, publicly available sources connected with Studiosus and its associated companies.

> **Status:** The project is currently under development. This README describes the intended final application.

---

## Features

- User registration and login
- Secure password storage with BCrypt
- JWT-based authentication with Spring Security
- AI-generated answers using Google Gemini and Spring AI
- Retrieval of relevant information from approved public sources
- Clickable source links for traceable answers
- Freshness-aware handling of prices, availability, dates and other changeable information
- User-specific conversations and chat history
- Responsive React interface
- OpenAPI documentation with Swagger UI
- PostgreSQL persistence and PGvector similarity search
- Automated backend and frontend tests
- Docker-based local deployment

---

## 💻 How it works:

When a user asks a question, ReiseWeiser searches its collection of approved public content for relevant information. The retrieved content is added to the Gemini prompt so that the generated answer can be based on identifiable sources.

The answer is displayed together with the source pages that were used.

Information that can change quickly such as prices, availability, departure dates or opening hours is not provided. Instead, the application directs the user to the appropriate live source.

If no suitable source is available, the assistant informs the user instead of inventing an answer or citation.

---

## 🚀 Run Spring Boot Services (Without Docker)

Inside each microservice directory, run:

**💻 Git bash**

### Backend

navigate to the backend folder via cd backend and run;

```bash
./gradlew clean build
```

or

```bash
./gradlew build
```

```bash
./gradlew bootRun
```

### Frontend

navigate to the frontend folder via cd frontend and run;

```bash
./npm install
./npm run dev
```


