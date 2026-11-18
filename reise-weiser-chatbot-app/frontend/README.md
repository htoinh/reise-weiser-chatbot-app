# 🎨 ReiseWeiser Frontend

The ReiseWeiser frontend is a single-page application built with **React 19**, **TypeScript 6**, **Vite 8**, and **Styled Components**. It provides JWT-backed registration and sign-in, light/dark theming, and the interactive travel chat experience.

---

## 🧰 Technology Stack

- ⚛️ **React `19.2`** & **React Router `7.18`**
- 🔷 **TypeScript `6.0`** (strict mode)
- ⚡ **Vite `8.2`**
- 💅 **Styled Components `6.6`** (light & dark themes)
- 🧹 **ESLint `10`** & **Prettier `3.9`**
- 🧪 **Vitest `5.1`**, **React Testing Library** (`jsdom`), and **Node `node:test`**
- 🌐 **Nginx (`nginx:alpine`)** in Docker (static asset serving, SPA fallback, and `/api/` reverse proxy)

---

## ✅ Prerequisites

- **Node.js 22+** and **npm**

```bash
node --version
npm --version
```

---

## 📦 Local Development

Install dependencies and start the Vite development server:

```bash
cd frontend
npm install
npm run dev
```

- **Dev server URL**: `http://localhost:5173`
- **API proxy**: `vite.config.ts` proxies `/api/*` requests to `VITE_BACKEND_URL` (default `http://localhost:8081`), stripping the `/api` prefix to match the Nginx container setup (`http://localhost:3000` in Docker Compose).

---

## 🗂️ Project Structure

```text
frontend/
├── src/
│   ├── api/                  # Fetch HTTP client, JWT interceptor (client.ts), auth.ts, chat.ts
│   ├── app/                  # Root App.tsx shell, routing, protected /chat guard, theme state
│   ├── auth/                 # AuthProvider.tsx & authContext.ts (token, userName, /api/current-user sync)
│   ├── components/           # Navbar.tsx, Footer.tsx, ChatInput.tsx, Message.tsx, AuthFormStyles.ts
│   ├── pages/                # About.tsx, Login.tsx, Register.tsx, Chat.tsx
│   ├── styles/               # GlobalStyles.ts, theme.ts, styled.d.ts
│   ├── test/                 # Vitest + React Testing Library component & form suites
│   └── main.tsx              # Browser entrypoint
├── tests/
│   └── apiClient.test.mjs    # Node test runner suite for API client & JWT interceptor
├── Dockerfile                # Multi-stage Node 22 build -> Nginx Alpine runtime
├── nginx.conf                # SPA fallback & /api/ reverse proxy to backend:8081
├── vite.config.ts            # Dev server & /api proxy configuration
└── vitest.config.ts          # JSDOM test runner configuration
```

---

## 🧭 Application Routes

| Route       | Access                                          | Purpose                                                                                        |
| :---------- | :---------------------------------------------- | :--------------------------------------------------------------------------------------------- |
| `/about`    | Public                                          | Project overview and travel disclaimer                                                         |
| `/login`    | Guest (redirects to `/chat` if signed in)       | Email & password sign-in                                                                       |
| `/register` | Guest (redirects to `/chat` if signed in)       | Account creation (`name`, `email`, `password`)                                                 |
| `/chat`     | Protected (redirects to `/login` if signed out) | Travel chat view with history loading, lazy conversation creation, and `ReiseWeiser` responses |

---

## 📜 Available Scripts

Run from `frontend/`:

| Command                | Description                                                                                     |
| :--------------------- | :---------------------------------------------------------------------------------------------- |
| `npm run dev`          | Start Vite local development server with HMR (`http://localhost:5173`).                         |
| `npm run build`        | Type-check (`tsc -b`) and build production assets into `dist/`.                                 |
| `npm run preview`      | Locally preview the production bundle.                                                          |
| `npm test`             | Run all Vitest component/form suites (`vitest run`) and `node --test tests/apiClient.test.mjs`. |
| `npm run test:watch`   | Run Vitest in interactive watch mode.                                                           |
| `npm run lint`         | Lint TypeScript and React files with ESLint.                                                    |
| `npm run typecheck`    | Run TypeScript project references check (`tsc -b --pretty false`).                              |
| `npm run format`       | Format files with Prettier.                                                                     |
| `npm run format:check` | Verify Prettier formatting without modifying files.                                             |
