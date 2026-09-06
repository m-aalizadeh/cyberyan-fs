# Cyberyan Task — Talent Index (Frontend)

A search-and-filter UI for the LinkedIn profile dataset, built against the
backend's `GET /api/profiles/search`, `GET /api/profiles/filters/meta`, and
`GET /api/profiles/:id` endpoints.

Stack: **React + TypeScript + Vite**, plain CSS Modules (no UI framework)
so every visual decision is deliberate rather than default-template.

## Design approach

The task is literally "search a directory of people," so the UI leans into
a **card-catalog / dossier** feel rather than a generic dashboard:

- Each result renders as an index-card row with a colored left-edge tab
  (color hashed from the person's industry — a real categorical signal,
  not decoration).
- IBM Plex Serif for names/headings, IBM Plex Sans for UI chrome, IBM Plex
  Mono reserved for "record data" (connection counts, years of experience,
  dates) — visually separating facts from prose.
- Clicking a card opens a detail panel (fetches the full profile via
  `GET /api/profiles/:id`) with experience/education timelines, skills,
  certifications, languages, and contact links.

## Project structure

```
src/
  api/            client.ts (fetch wrapper + error handling) + profileApi.ts
  types/          shared TypeScript interfaces (mirrors the backend)
  hooks/          useProfileSearch, useFilterMeta, useProfileDetail, useDebouncedValue
  utils/          formatters.ts — display formatting + industry→tab-color hashing
  components/     one folder per component: Component.tsx + Component.module.css
  App.tsx         page layout
  main.tsx        entrypoint
```

Each component is paired 1:1 with its own CSS Module file, and data-fetching
logic lives in hooks rather than components — the same separated-file
approach as the backend, so state/markup/styling/network concerns each stay
in their own file.

## UX details worth knowing about

- **Debounced keyword search** (350ms) — typing doesn't spam the API;
  dropdown-style filters (skill/job title/industry) apply immediately since
  they're discrete choices, not something still being typed.
- **Filters combine with AND** — skill + job title + industry + location +
  keyword can all be active at once, matching the backend's query logic.
  A "Clear all (N)" button appears once any filter is active.
- **Autocomplete via `<datalist>`** — skill/job title/industry inputs are
  backed by the dataset's actual distinct values (`GET /api/profiles/filters/meta`),
  so you're not guessing at what to type, while still allowing free text.
- **Loading, empty, and error states are all handled explicitly** —
  skeleton cards while loading, a direct "no matches, try loosening a
  filter" message when a filter combination returns nothing, and a retry
  button if the API request itself fails (e.g. backend not running).
- **Pagination** with a compact page-number list and a "Showing X–Y of Z"
  count.
- **Responsive**: the filter sidebar collapses into a toggle-able panel
  below ~860px width; cards restack for small screens.
- **Accessibility**: every input has a real `<label>`, focus is always
  visible (`:focus-visible`), the results region is `aria-live="polite"`
  so screen readers hear result-count changes, the detail panel is a
  `role="dialog"` that traps Escape-to-close and returns focus sensibly,
  and all motion respects `prefers-reduced-motion`.

## Setup & running

**Prerequisite:** the backend running (see the backend's own README) —
by default at `http://localhost:4000`.

```bash
npm install
cp .env.example .env
# edit .env if your backend isn't on localhost:4000

npm run dev
```

Open the URL Vite prints (`http://localhost:5173` by default).

Production build:

```bash
npm run build   # outputs to dist/
npm run preview # serve the production build locally to sanity-check it
```

## Notes

- `VITE_API_BASE_URL` (in `.env`) controls which backend the frontend talks
  to — defaults to `http://localhost:4000/api`, matching the backend's
  default `.env.example`.
- The frontend has no build/runtime dependency on the backend's Mongo
  data shape beyond the documented API response — if you extend the
  backend's schema, extend `src/types/profile.types.ts` and the relevant
  component to match.
