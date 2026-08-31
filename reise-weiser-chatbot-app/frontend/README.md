# 🎨 ReiseWeiser Frontend

The ReiseWeiser frontend is the browser interface for the travel chatbot. It will provide authentication, conversation management, sourced AI answers and a responsive chat experience.

> 🚧 **Current status:** The React and TypeScript foundation, strict type checking, formatting tools and design theme are configured. The application pages and backend integration will be implemented in later project phases.

## 🧰 Technology stack

- ⚛️ React
- 🔷 TypeScript
- ⚡ Vite
- 💅 Styled Components
- 🧹 ESLint
- ✨ Prettier
- 🧪 Vitest and React Testing Library — planned

## ✅ Prerequisites

Install:

- Node.js
- npm

Confirm the installations:

```bash
node --version
npm --version
```

## 📦 Install dependencies

Navigate to the frontend directory:

```bash
cd frontend
```

Then:

```bash
npm install
```


## ▶️ Start the development server

```bash
npm run dev
```

Open:

```text
http://localhost:5173
```

Vite automatically reloads the page when frontend source files change.

## 🗂️ Intended structure

```text
src/
├── app/                  # Application setup and routing
├── features/
│   ├── auth/             # Login and registration
│   ├── chat/             # Chat interface and conversations
│   └── sources/          # Answer-source presentation
├── shared/
│   ├── api/              # Backend HTTP client
│   ├── types/            # Shared TypeScript types
│   └── ui/               # Reusable UI components
├── styles/
│   ├── globals.ts        # Global styling
│   ├── theme.ts          # Colours and design tokens
│   └── styled.d.ts       # Styled Components theme typing
├── App.tsx
└── main.tsx
```

## 🧹 Code quality

Check the source code with ESLint:

```bash
npm run lint
```

Format the project with Prettier:

```bash
npm run format
```

Build the production bundle:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

Only use commands present in the `scripts` section of `package.json`.

## 🏷️ Application version

The frontend application version is stored in `package.json`.

After manually changing it in `package.json`

```bash
npm install
```
Then synchronize `version.json` with `package.json` by running:

```bash
npm run version
```

To increment and synchronize the patch version automatically:

## 🔌 Backend connection

During local development, the backend runs at:

```text
http://localhost:8080
```

The frontend runs separately at:

```text
http://localhost:5173
```

## 🧪 Testing

Frontend tests will later use:

- Vitest
- React Testing Library

The planned test areas include:

- Login and registration forms
- Chat-input validation
- User and assistant message presentation
- Source links
- Loading and error states
- Conversation history

## 🧭 Planned pages

| Route | Purpose |
|---|---|
| `/login` | User login |
| `/register` | User registration |
| `/chat` | Main conversation interface |
| `/about` | Project and information notice |
