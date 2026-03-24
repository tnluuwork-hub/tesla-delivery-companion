# Tesla Delivery Companion — Claude Code Context

## What This Is

A Next.js web app that guides Tesla buyers through delivery day inspection. Generates a PDF sign-off report of any issues found at delivery.

## Stack

- **Next.js 16.1.6** with App Router
- **React 19.2.3** + TypeScript 5 (strict)
- **Tailwind CSS v4** (PostCSS plugin, not the old JIT config)
- **@react-pdf/renderer** — PDF generation (NOT html2pdf, NOT puppeteer)
- **Zustand** — global state (inspection checklist, findings)
- **Zod** — schema validation for user inputs
- **Framer Motion** — animations

## Key Commands

```bash
npm run dev      # dev server (localhost:3000)
npm run build    # production build
npm run start    # serve production build
```

## Architecture Notes

- App Router — pages live in `app/`, not `pages/`
- Tailwind v4 uses `@import "tailwindcss"` in CSS, not `@tailwind base/components/utilities`
- PDF generation runs client-side via `@react-pdf/renderer` — do NOT try to do it server-side
- Zustand store(s) are in `store/` or colocated with their domain

## Patterns

- All form inputs validated with Zod before touching state
- Framer Motion variants defined at component level, not inline
- PDF `Document`/`Page`/`View`/`Text` components are separate from display components — never mix render targets

## DO NOTs

- **Do NOT use `pages/` router** — this is App Router
- **Do NOT use `tailwind.config.js`** with v3 syntax — Tailwind v4 config is in CSS
- **Do NOT render `@react-pdf/renderer` components to the DOM** — they are PDF-only
- **Do NOT skip Zod validation** on any user-submitted data
