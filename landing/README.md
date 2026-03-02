## The Room – Landing Site (`landing/`)

This directory contains the **marketing site** for **The Room**, an AI‑powered mental wellness companion that offers 24/7 emotional support through AI‑powered journaling, personalized insights, and guided conversations.

The landing site is built with **Next.js 15 (App Router)**, **React 19**, **TypeScript**, **Tailwind CSS 4**, **Framer Motion**, and **lucide-react**.

---

## Table of Contents

- [Overview](#overview)
- [Key Pages](#key-pages)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Common Scripts](#common-scripts)
- [Project Structure](#project-structure)
- [Content & Customization](#content--customization)

---

## Overview

The **landing site** is focused on:

- Communicating the value of The Room as a **personal mental wellness companion**.
- Showcasing how AI‑powered journaling and insights work at a high level.
- Building trust via testimonials, stats, FAQs, and clear CTAs.
- Providing legal and informational content (privacy policy, terms, resources).

It mirrors the production experience available at:

- **Live URL**: [`the-room-one.vercel.app`](https://the-room-one.vercel.app)

The site is optimized for:

- Modern, animated hero sections and UI polish.
- Responsive layouts across desktop and mobile.
- Fast iteration on marketing copy and visuals.

---

## Key Pages

All routes use the Next.js App Router under `src/app`:

- `/` – Home page:
  - Hero section with animated chat preview.
  - Feature highlights, how it works, stats, testimonials, FAQ, and CTA.
- `/about` – Background, mission, and positioning of The Room.
- `/resources` – Curated resources related to mental wellness (articles, guides, etc.).
- `/posts/[slug]` – Blog/post details for long‑form content.
- `/privacy` – Privacy policy.
- `/terms` – Terms of service.

> **Note:** If you add additional marketing pages, create them under `src/app` and wire them into the header/footer navigation as needed.

---

## Architecture

The landing site is intentionally simpler than the main app and focuses on **presentation**:

- `src/app` – App Router entrypoints and page components.
- `src/components/layout` – Layout primitives like `Header`, `Footer`, and layout wrappers.
- `src/components/sections` – Composable marketing sections:
  - `Hero`
  - `Features`
  - `HowItWorks`
  - `Stats`
  - `Testimonials`
  - `FAQ`
  - `CTA`
  - Additional sections such as **Frameworks**, **ML‑Ranking**, **Expert‑Guided** (psychologist consultation), **Team**, and **Restrictions**.
- `src/components/ui` – Reusable UI components:
  - `Button`
  - `Badge`
  - `Card`
  - `Section`
  - `Container`
- `src/app/globals.css` – Global styling, design tokens, and Tailwind configuration entry.

Animations are primarily handled through **Framer Motion**, while icons use **lucide-react**.

---

## Getting Started

From the repository root:

```bash
cd landing
npm install          # or pnpm install / yarn
```

### Run the development server

```bash
npm run dev
```

By default, the landing site will be available at `http://localhost:3001`.

### Production build

```bash
npm run build
npm start
```

This will run the optimized production build using Next.js.

---

## Common Scripts

All scripts below are run from the `landing` directory:

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint the codebase (Next.js built‑in lint)
npm run lint
```

---

## Project Structure

High‑level structure of the `landing` project:

```text
landing/
  src/
    app/                # Next.js App Router routes and layouts
      page.tsx          # Home
      about/page.tsx
      resources/page.tsx
      posts/[slug]/page.tsx
      privacy/page.tsx
      terms/page.tsx
      layout.tsx        # Root layout
      globals.css       # Global styles & Tailwind entry

    components/
      layout/           # Header, Footer, layout helpers
      sections/         # Marketing sections (Hero, Features, FAQ, CTA, ...)
      ui/               # Shared UI building blocks
```

---

## Content & Customization

- **Copy & messaging**:
  - Primary marketing copy for the hero and sections lives in `src/components/sections/*`.
  - Update the hero messaging, CTAs, and trust indicators in `Hero.tsx`.
- **Branding**:
  - Colors, gradients, and typography are primarily controlled through CSS variables and Tailwind classes in `globals.css`.
- **Navigation**:
  - Update global navigation items in `Header.tsx` and footer links in `Footer.tsx`.
- **Analytics & tracking**:
  - If you add analytics (e.g. Google Analytics, PostHog), prefer adding them to the root layout in `src/app/layout.tsx` or a dedicated provider component.

Use this README as the source of truth for how the landing site is structured and how to add or modify marketing content.

