# Cyberyan Task — LinkedIn Dataset Search API (Backend)

Backend-only implementation of the "موتور جستجوی ساده دیتاست لینکدین" task:
a simple API to search and filter a dataset of ~336 LinkedIn profiles.

Stack: **Node.js + TypeScript + Express + MongoDB (Mongoose)**.

## Why MongoDB

The task allows "ElasticSearch or simple search over a database." The dataset
is naturally document-shaped (each profile has nested arrays like `skills`,
`education`, `experience`), so a NoSQL document store is a closer fit than
relational tables and needs no joins. MongoDB's built-in **text index**
gives real keyword search (tokenization, stemming, relevance scoring via
`$meta: "textScore"`) without standing up a separate ElasticSearch cluster —
appropriate for a ~336-document dataset and a take-home task's scope.

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

The layering is intentionally classic/separated rather than colocated:
**routes → controllers → services → repositories → model**, each in its own
file, so each concern (HTTP, business rules, persistence) can be tested or
swapped independently.

## About the dataset

`data/300_user_linkedin.csv` (the file you provided, unmodified) **is** the
reference data — there's no separate conversion step or intermediate file.
It's a CSV export (People-Data-Labs-style schema) with 336 rows, where
several columns (`skills`, `experience`, `education`, `emails`, `interests`,
`certifications`, `languages`) hold **stringified Python literals**, e.g.
`"['react', 'node.js']"`, or a stringified list of dicts for `experience`.

The seed script (`src/scripts/seed.ts`) reads that CSV file directly:

1. **`csv-parse`** handles the outer CSV structure (quoted fields, embedded
   commas, escaped quotes) and gives back one plain object per row.
2. **`src/utils/pythonLiteral.ts`** is a small hand-written recursive-descent
   parser for the Python literal syntax inside those cells — lists, dicts,
   single/double-quoted strings with escapes, numbers, `None`/`True`/`False`.
   It's a real parser (not `eval()`/regex-replace), so it's safe to run on
   untrusted text and handles Python's per-string quote-style switching
   correctly (Python's `repr()` uses double quotes for a string that itself
   contains an apostrophe, e.g. names like "O'Brien").
3. **`src/utils/csvProfileMapper.ts`** maps each parsed row into the
   `IProfile` shape the Mongoose schema expects.

Some rows in the original export have shifted/corrupted columns (unbalanced
quoting further down the file) — a data-quality issue in the source file
itself. Parsing is defensive about it: any cell that fails to parse cleanly
falls back to `[]`/`null` for that field rather than crashing the whole row,
so all 336 profiles still get imported (a few just end up with fewer
populated fields, e.g. no parsed `education`). Verified end-to-end against
the actual file: 336/336 rows parsed, 188 with skills, 281 with a job title,
159 with education, 170 with experience.

## Running MongoDB with Docker

If you don't have MongoDB installed locally, the included `docker-compose.yml`
runs it in a container — no local MongoDB install needed.

```bash
# 1. Start MongoDB in the background
docker compose up -d

# 2. Confirm it's running
docker compose ps
```

That starts MongoDB 7 on `localhost:27017` with its data persisted in a
named Docker volume (`cyberyan_mongo_data`), so your seeded data survives
container restarts. The default `.env.example` (`mongodb://127.0.0.1:27017/cyberyan_linkedin`)
already points at it — nothing to change there.

Useful commands:

```bash
docker compose logs -f mongo   # tail MongoDB's logs
docker compose down            # stop the container (keeps the data volume)
docker compose down -v         # stop AND wipe the data volume (fresh start)
```

If `docker compose` (no hyphen) isn't recognized, use the older `docker-compose`
instead — same commands, just install the Docker Compose plugin if neither
works: https://docs.docker.com/compose/install/

## Setup & running

**Prerequisites:** Node.js 18+, a MongoDB instance (local or Atlas).

```bash
npm install
cp .env.example .env
# edit .env if your MongoDB isn't on localhost:27017

npm run seed   # parses data/300_user_linkedin.csv and loads it into MongoDB (run once)
npm run dev    # starts the API on http://localhost:4000 with hot reload
```

Production build:

```bash
npm run build
npm start
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

Response shape:

```json
{
  "success": true,
  "data": [ { "_id": "...", "fullName": "...", "skills": ["..."], "...": "..." } ],
  "pagination": { "total": 12, "page": 1, "limit": 10, "totalPages": 2 }
}
```

### `GET /api/profiles/filters/meta`
Returns distinct `skills`, `jobTitles`, and `industries` present in the
dataset — meant for populating filter dropdowns on the frontend.

### `GET /api/profiles/:id`
Fetch a single profile by its MongoDB `_id`.

## Search & filter — how it works

- **Keyword** uses a MongoDB **compound text index** (see
  `profile.model.ts`) over `fullName`, `jobTitle`, `industry`,
  `jobCompanyName`, `skills`, `interests`, and `summary`, with field
  weights so a hit on someone's name or job title ranks above a hit buried
  in their bio. Results are sorted by MongoDB's `textScore` relevance.
- **Filters** (`skill`, `jobTitle`, `industry`, `location`) are separate,
  case-insensitive partial-match (`$regex`) conditions combined with the
  keyword search via `$and`, so keyword search and filters compose freely
  in either order or together.
- Regex input is escaped before use, so characters like `.` `+` `(` `)` in
  a skill name (e.g. "React.js", "Front-End (Lead)") can't break the query
  or be interpreted as regex syntax.
- Supporting single-field indexes on `skills`, `jobTitle`, `industry`, and
  `locationCountry` keep filter-only queries (no keyword) fast too.

## What's not included (frontend, out of scope for this deliverable)

This is the backend only, per your request. A minimal frontend (search
input + 2 filters + results list, as the task describes) would consume
`GET /api/profiles/search` and `GET /api/profiles/filters/meta` directly —
happy to build that next if useful.
