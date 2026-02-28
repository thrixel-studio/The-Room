## The Room – AI-Powered Mental Wellness Companion

**The Room** is an AI‑powered mental wellness companion that provides 24/7 emotional support through AI‑guided conversations, journaling, and personalized insights.

This repository contains:

- `app/` – the main product application (authenticated experience).
- `landing/` – the public marketing/landing site.

Both projects are built with **Next.js (App Router)**, **React 19**, **TypeScript**, and **Tailwind CSS 4**, with the main app also using **Redux Toolkit** and **RTK Query**.

---

## Table of Contents

- [Monorepo Overview](#monorepo-overview)
- [Applications](#applications)
  - [Main App (`app/`)](#main-app-app)
  - [Landing Site (`landing/`)](#landing-site-landing)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Clone & Install](#clone--install)
  - [Running the Apps](#running-the-apps)
- [Environment Configuration](#environment-configuration)
- [High-Level Architecture](#high-level-architecture)
- [Development Workflow](#development-workflow)
- [Quality & Conventions](#quality--conventions)

---

## Monorepo Overview

This repository is organized as a lightweight monorepo with two independent Next.js applications:

```text
The-Room/
  app/        # Main product application
  landing/    # Public marketing site
```

There is **no shared Node workspace** at the root; each app manages its own dependencies via its own `package.json`.

---

## Applications

### Main App (`app/`)

The main app is what authenticated users interact with day‑to‑day. It provides:

- **AI chat** – a conversational interface that redirects users to `/chat` after login.
- **Journaling** – guided sessions, entry details, and the ability to revisit or continue writing.
- **Insights** – dashboards with emotional trends, calendars, and summaries.
- **Frameworks** – configurable mental‑health / coaching frameworks that shape how the AI responds.
- **Suggestions** – context‑aware recommendations based on recent activity and patterns.
- **Settings & profile** – user profile, bio, metadata, and data controls (including destructive actions such as deleting entries).

Implementation highlights:

- Next.js 16 (App Router) and React 19.
- Feature‑first structure under `src/features`:
  - `auth`, `chat`, `journal`, `insights`, `frameworks`, `suggestions`, `settings`.
- Shared UI, store, and utilities under `src/shared`.
- Strong typing via TypeScript and feature‑level domain types.
- Data fetching via **RTK Query** with a shared `baseApi` and cache tiering.

For more details, see `app/README.md`.

### Landing Site (`landing/`)

The landing site is a focused marketing experience for The Room:

- Hero section showcasing the AI‑powered mental wellness companion.
- Feature overview, “how it works”, testimonials, stats, FAQ, and CTAs.
- Legal and informational pages like **privacy**, **terms**, and **resources**.

Implementation highlights:

- Next.js 15 (App Router) and React 19.
- Animated sections powered by **Framer Motion**.
- Tailwind‑driven design system with reusable UI components (`Button`, `Card`, `Badge`, etc.).

For more details, see `landing/README.md`.

---

## Tech Stack

**Core**

- **Language**: TypeScript
- **Framework**: Next.js (App Router)
- **UI Library**: React 19
- **Styling**: Tailwind CSS 4 + CSS modules

**Main App (`app/`)**

- **State Management**: Redux Toolkit
- **Data Fetching**: RTK Query
- **Forms & Validation**: `react-hook-form`, `zod`
- **Scheduling & Calendars**: FullCalendar
- **Charts & Visualizations**: ApexCharts, D3 hierarchy
- **Auth**: Custom auth flows with optional Google OAuth integration
- **UI/UX Enhancements**: `react-dnd`, `swiper`, `react-circular-progressbar`, custom toasts, skeletons

**Landing (`landing/`)**

- **Animations**: Framer Motion
- **Icons**: lucide-react

---

## Getting Started

### Prerequisites

- **Node.js**: v20 or later is recommended.
- **Package manager**: `npm`, `pnpm`, or `yarn` (examples below use `npm`).

### Clone & Install

If you have not already cloned the repository:

```bash
git clone <your-repo-url>
cd The-Room
```

Install dependencies separately for each app:

```bash
# Main app
cd app
npm install

# Landing site
cd ../landing
npm install
```

### Running the Apps

#### Main App (`app/`)

From the `app` directory:

```bash
npm run dev
```

The main app will start at `http://localhost:3000` by default.

#### Landing Site (`landing/`)

From the `landing` directory:

```bash
npm run dev
```

The landing site will start at `http://localhost:3001` by default (as configured in `package.json`).

---

## Environment Configuration

Environment variables are configured per app. The main app uses a central helper at `app/src/shared/lib/env.ts`.

### Main App (`app/`)

Create an `.env.local` file in the `app` directory with at least:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
```

- `NEXT_PUBLIC_API_URL` – base URL of your backend API.
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID` – Google OAuth client ID (optional; leave empty to disable).

You can add any additional environment variables your backend or integrations require; just be sure to surface them via `env.ts` for consistency.

### Landing (`landing/`)

The landing site does not require any specific environment variables by default. If you add analytics, third‑party widgets, or other integrations, document their configuration in `landing/README.md`.

---

## High-Level Architecture

At a high level:

- **App Router** is used for routing in both the main app and landing.
- **Feature‑first modules** keep domain logic grouped together.
- **Shared primitives** (`src/shared`) avoid duplication between features in the main app.
- **Backend integration** is centralized via RTK Query and a reusable `baseQuery` that handles auth and re‑auth flows.

Main app structure (simplified):

```text
app/
  src/
    app/           # App Router routes (auth, app shell, errors)
    features/      # Domain features (auth, chat, journal, insights, frameworks, ...)
    shared/        # Shared UI, hooks, store, lib utilities
    types/         # Shared TypeScript types
```

Landing structure (simplified):

```text
landing/
  src/
    app/           # App Router routes, layouts, globals
    components/    # Layout, sections, and UI building blocks
```

---

## Development Workflow

Typical local workflow:

1. **Start the backend API** (if running locally) and ensure it matches `NEXT_PUBLIC_API_URL`.
2. **Start the main app** from `app/` with `npm run dev`.
3. Optionally, **start the landing site** from `landing/` with `npm run dev` for marketing/testing.
4. Make changes within the appropriate app:
   - Product features and authenticated flows → `app/`.
   - Marketing copy, blog posts, and resources → `landing/`.
5. Run `npm run lint` (per app) before committing.

---

## Quality & Conventions

- **TypeScript everywhere** – new modules should be strongly typed.
- **Feature‑first organization** – group code by domain under `src/features`.
- **Use RTK Query for APIs** – avoid direct `fetch` calls in features when possible.
- **Reuse shared components/hooks** – prefer `src/shared` for primitives used across multiple features.
- **Consistent styling** – follow existing Tailwind patterns and design tokens.

Refer to `app/README.md` and `landing/README.md` for app‑specific details, and keep those documents updated as architecture evolves.

