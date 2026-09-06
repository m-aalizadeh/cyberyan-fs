# Cyberyan Task — LinkedIn Dataset Search API (Backend)

Backend-only implementation of the LinkedIn profile dataset:
a simple API to search and filter a dataset of ~336 LinkedIn profiles.

Stack: **Node.js + TypeScript + Express + MongoDB (Mongoose)**.

## Project structure

```
src/
  config/         env loading + MongoDB connection
  models/         Mongoose schema (Profile) + indexes
  types/          shared TypeScript interfaces
  repositories/   ONLY layer that talks to Mongoose/MongoDB directly
  services/       business logic: turns query params into a Mongo filter
  controllers/    HTTP layer: parses req/res, calls services
  routes/         Express route definitions
  middlewares/    centralized error handling
  utils/
    pythonLiteral.ts    hand-written parser for the CSV's Python-literal cells
    csvProfileMapper.ts maps one raw CSV row -> our Profile shape
  scripts/seed.ts parses data/300_user_linkedin.csv directly and loads it into MongoDB
  app.ts          Express app wiring (middleware, routes)
  server.ts       entrypoint: connect DB, start HTTP server
data/
  300_user_linkedin.csv   the reference dataset, used as-is (see below)
```

## Setup & running

**Prerequisites:** Node.js 18+, a MongoDB instance (local or Atlas).

```bash
npm install

npm run seed   
npm run dev   
```

## API

### `GET /api/health`
Liveness check.

### `GET /api/profiles/search`
Free-text keyword search **plus** filters. All query params are optional
and combine with AND logic.

| Param      | Meaning                                              |
|------------|-------------------------------------------------------|
| `keyword`  | Free-text search across name, job title, industry, company, skills, interests, summary (MongoDB text index, relevance-ranked) |
| `skill`    | Filter: partial, case-insensitive match against any entry in `skills[]` |
| `jobTitle` | Filter: partial, case-insensitive match against `jobTitle` |
| `industry` | Filter: partial, case-insensitive match against `industry` |
| `location` | Filter: partial, case-insensitive match against `locationName` |
| `page`     | Page number, default `1` |
| `limit`    | Page size, default `20`, max `100` |

The task asks for search plus filtering on at least 2 fields — `skill` and
`jobTitle` are the two called out in the spec as an example; `industry` and
`location` are included as a bonus since the data supports them cleanly.

Example:

```
GET /api/profiles/search?keyword=manager&skill=leadership&jobTitle=recruiting&page=1&limit=10
```

### `GET /api/profiles/filters/meta`
Returns distinct `skills`, `jobTitles`, and `industries` present in the
dataset — meant for populating filter dropdowns on the frontend.

### `GET /api/profiles/:id`
Fetch a single profile by its MongoDB `_id`.

