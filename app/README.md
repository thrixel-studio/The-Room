## The Room – Application (`app/`)

This directory contains the main **The Room** application – an AI‑powered mental wellness companion that combines guided conversations, journaling, and personalized insights.

The app is built with **Next.js 16 (App Router)**, **React 19**, **TypeScript**, **Tailwind CSS 4**, **Redux Toolkit**, and **RTK Query**.

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Architecture](#architecture)
- [Domain Features](#domain-features)
  - [Auth](#auth)
  - [Chat](#chat)
  - [Journal](#journal)
  - [Insights](#insights)
  - [Frameworks](#frameworks)
  - [Suggestions](#suggestions)
  - [Settings & Profile](#settings--profile)
- [State Management & Data Layer](#state-management--data-layer)
- [Environment Configuration](#environment-configuration)
- [Getting Started](#getting-started)
- [Common Scripts](#common-scripts)
- [Project Structure](#project-structure)
- [Conventions & Best Practices](#conventions--best-practices)

---

## Overview

The **The Room** app provides:

- **AI‑guided conversations** through an always‑on chat interface.
- **Structured journaling** sessions that can be revisited and refined, with each entry rendered as a visual “card” carrying its own scene, title, and emotional context.
- **Personalized insights** surfaced from your historical entries and sessions.
- **Wellness frameworks** that guide how conversations and insights are generated, aligned with goals like mental wellness, decision‑making, productivity, and problem‑solving.

The primary user‑facing routes live under the App Router segment `src/app/(app)`:

- `/chat` – main conversational interface (default landing after login).
- `/journal` and `/journal/[id]` – journal overview and entry details.
- `/insights` – dashboards and analytics around mood, behavior, and patterns.
- `/frameworks` – configuration and exploration of guidance frameworks.
- `/settings` – account, profile, and data controls.

Authentication flows live under `src/app/(auth)` and error handling under `src/app/(error-pages)`.

---

## Key Features

- **24/7 AI chat** with contextual awareness of previous conversations and entries.
- **Guided journaling** with session progress, prompts, and “continue writing” helpers.
- **Emotional insights** with calendars, trend charts, and emotional state tables.
- **Configurable frameworks** that shape how the assistant responds and what it notices.
- **Suggestions engine** that proposes next steps, prompts, or reflections.
- **Profile & data controls** to manage user information and journal data.

> For a product‑level overview and live demo, see the landing site at [`the-room-one.vercel.app`](https://the-room-one.vercel.app).

---

## Architecture

The app follows a **feature‑first** architecture with a small set of shared primitives:

- `src/app` – Next.js App Router routes, layouts, and error pages.
- `src/features` – domain‑specific feature modules (chat, journal, insights, etc.).
- `src/shared` – cross‑cutting UI components, hooks, utilities, and Redux store.
- `src/types` – shared TypeScript types and contracts.

Each feature module typically contains:

- `components/` – UI and container components.
- `hooks/` – feature‑scoped React hooks.
- `api/` – RTK Query endpoints and API contracts.
- `slices/` – Redux slices for UI and local state.
- `types.ts` – strongly‑typed domain models.
- `styles/` – feature‑scoped CSS modules when needed.

---

## Domain Features

### Auth

Location: `src/features/auth`

- Sign‑in, sign‑up, and OAuth flows (including Google).
- `authSlice` manages authentication state and tokens.
- `auth.endpoints.ts` exposes RTK Query endpoints for login, signup, and session handling.
- Reusable `SignInForm`, `SignUpForm`, and `GoogleAuthButton` components.

### Chat

Location: `src/features/chat`

- Main conversational experience: `ChatWindow`, `MessageList`, `MessageInput`.
- Support for **typing indicators**, **message animations**, and **session progress**.
- Central hooks like `useChat`, `useChatMessages`, `useSessionInitialization`, and `useSessionFinish`.
- `chat.endpoints.ts` exposes endpoints for:
  - Creating chat sessions.
  - Fetching active sessions.
  - Sending messages.
  - Finishing sessions.
- Streaming summary support via `summaryStream.ts`, including `createSummaryStream` and `SummaryStreamEvent`.
- Utility helpers for auth/session behavior in `utils/`.

### Journal

Location: `src/features/journal`

- Journal entry browsing and detail views (`JournalEntryCards`, `JournalEntryCard`, `EntryDetail`, `EntryHero`).
- Session‑oriented workflows with `FinishSessionButton` and `ContinueWritingSidebar`.
- `useJournal` hook for listing, reading, and mutating entries.
- `journal.endpoints.ts` for:
  - Fetching entry lists and details.
  - Updating and deleting entries.
  - Deleting all entries for a user.
  - Sharing entries.
- `journalUiSlice` for UI‑only state (filters, layouts, loading states, etc.).

### Insights

Location: `src/features/insights`

- Aggregated view over historical activity and emotional state.
- Components such as:
  - `Dashboard`
  - `EmotionalStateTable`
  - `Calendar`
  - `MonthlyTarget`
- `insights.endpoints.ts` and related hooks to fetch insights data.
- Styles scoped to `insights.module.css`.

### Frameworks

Location: `src/features/frameworks`

- Manages **wellness / conversation frameworks** that influence how the AI responds.
- Components for displaying, selecting, and initializing frameworks:
  - `FrameworkCards`
  - `FrameworkDropdown`
  - `FrameworkInitializer`
- State stored in `frameworksSlice`, with APIs in `frameworks.endpoints.ts`.

### Suggestions

Location: `src/features/suggestions`

- Provides context‑aware suggestions and tips related to current sessions and entries.
- `SuggestionsList` component and related hooks (`useSuggestions`, `useTips`).
- `suggestions.endpoints.ts` wires suggestions into the RTK Query API.

### Settings & Profile

Location: `src/features/settings`

- User profile management and application settings.
- Components such as:
  - `UserInfoCard`
  - `UserMetaCard`
  - `UserBioCard`
  - `DeleteAllEntriesButton`
  - `LogoutButton`
- `profile.endpoints.ts` and `profileUiSlice` manage profile data and UI state.

---

## State Management & Data Layer

- **Redux Toolkit** powers app‑wide client state.
  - Store configuration: `src/shared/store/store.ts`.
  - Root reducer: `src/shared/store/rootReducer.ts`.
- **RTK Query** is used for the primary HTTP API layer:
  - Base API: `src/shared/store/api/baseApi.ts` with typed cache tiers and tags.
  - Feature modules inject their own endpoints (e.g. chat, journal, insights).
  - `baseQueryWithReauth` handles authentication and token refresh logic.
- **TanStack React Query** is available via a shared `QueryClient`:
  - Provider setup: `src/shared/providers/Providers.tsx` wraps the app with `QueryClientProvider`.
  - Used for selected workflows and legacy consumers (e.g. `src/lib/insights.ts`).
- **React Query‑style ergonomics** are provided via RTK Query hooks (e.g. `useGetEntriesQuery`, `useSendMessageMutation`, etc.) and, where applicable, via TanStack React Query hooks.

---

## Environment Configuration

Environment variables are accessed centrally via `src/shared/lib/env.ts`.

The app currently expects:

| Variable                        | Required | Description                               | Default                          |
| ------------------------------- | -------- | ----------------------------------------- | -------------------------------- |
| `NEXT_PUBLIC_API_URL`          | Yes      | Base URL of the backend API               | `http://localhost:8000`          |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Optional | Google OAuth client ID for sign‑in        | Empty string (disables Google)   |
| `NODE_ENV`                     | No       | Environment name (`development`, `production`, etc.) | `development`           |

Create an `.env.local` file in the `app` directory for local development:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
```

> **Note:** If your backend uses different paths or authentication schemes, update the RTK Query `baseQuery` implementation accordingly.

---

## Getting Started

From the repository root:

```bash
cd app
npm install          # or pnpm install / yarn
```

### Run the development server

```bash
npm run dev
```

By default, the app will be available at `http://localhost:3000`.

### Production build

```bash
npm run build
npm start
```

This will run the optimized production build using Next.js.

---

## Common Scripts

All scripts below are run from the `app` directory:

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint the codebase
npm run lint
```

---

## Project Structure

High‑level structure of the `app` project:

```text
app/
  src/
    app/                 # Next.js App Router routes, layouts, error pages
      (app)/             # Authenticated app shell (chat, journal, insights, etc.)
      (auth)/            # Auth routes (signin, signup, callback)
      (error-pages)/     # 404 and error pages
      globals.css        # Global styles & Tailwind configuration entry

    features/            # Domain‑level features (auth, chat, journal, insights, ...)
    shared/              # Cross‑cutting UI components, hooks, store, and utilities
    types/               # Shared TypeScript types
```

Refer to individual feature folders for more detailed domain‑specific documentation and types.

---

## Conventions & Best Practices

- **TypeScript first** – all new code should be strongly typed.
- **Feature‑first structure** – new functionality should live under the appropriate `src/features/<domain>` folder.
- **Use RTK Query for HTTP** – avoid ad‑hoc `fetch` calls; integrate new endpoints via `baseApi`.
- **Use shared primitives** – components, hooks, and utilities that are reusable across features belong in `src/shared`.
- **Consistent styling** – leverage existing Tailwind tokens and CSS modules where appropriate.

When in doubt, look for an existing feature (e.g. `chat` or `journal`) and mirror its patterns.

