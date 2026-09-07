# LinkedIn Dataset Search UI (Frontend)

A search-and-filter UI for the LinkedIn profile dataset.

Stack: **React + TypeScript + Vite**, plain CSS Modules (no UI framework)

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

## Setup & running

**Prerequisite:** the backend running — by default at `http://localhost:4000`.

```bash
npm install
npm run dev
```

Open the URL Vite prints (`http://localhost:5173` by default).
