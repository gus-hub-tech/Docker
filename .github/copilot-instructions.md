# Copilot instructions for this repository

Purpose
- Quick, repository-specific facts for Copilot sessions: how to build/run/test, high-level architecture, and conventions that affect cross-file changes.

Build / run / test / lint
- Install deps: npm install
- Dev (local): npm run dev  # nodemon - watches src/index.js
- Run in Docker:
  - docker build -t getting-started-app .
  - docker run -p 3000:3000 getting-started

Tests
- Unit tests are present under spec/ and use Jest (tests mock modules like src/persistence and uuid).
- There is no `test` script in package.json. To run tests without modifying package.json:
  - Run full suite: npx jest
  - Run a single file: npx jest spec/routes/getItems.spec.js
- If adding CI or scripts, prefer `npm test` -> `jest` and add jest to devDependencies.

Lint
- No linter or lint scripts are configured in package.json. Add ESLint/Prettier if desired and document scripts here.

High-level architecture
- Entrypoint: src/index.js
  - Creates Express app, serves static UI from src/static, mounts route handlers, and starts server on port 3000 after db.init().
  - Handles graceful shutdown by calling db.teardown() on SIGINT/SIGTERM/SIGUSR2.

- Routes: src/routes/*.js
  - One-route-per-file pattern; each exports an async function (module.exports = async (req, res) => { ... }).
  - Endpoints: GET /items, POST /items, PUT /items/:id, DELETE /items/:id

- Persistence abstraction: src/persistence/index.js
  - Exports a consistent CRUD API: init(), teardown(), getItems(), getItem(id), storeItem(item), updateItem(id,item), removeItem(id)
  - Backend selection by environment: if MYSQL_HOST env var is set -> src/persistence/mysql.js; else -> src/persistence/sqlite.js

- SQLite backend (src/persistence/sqlite.js)
  - Default DB file: env SQLITE_DB_LOCATION or /etc/todos/todo.db
  - Creates parent directories if missing (fs.mkdirSync with recursive: true)
  - Stores completed as integer 0/1; conversion to boolean is handled when reading

- MySQL backend (src/persistence/mysql.js)
  - Reads plain env vars or secret files (MYSQL_HOST_FILE, MYSQL_USER_FILE, MYSQL_PASSWORD_FILE, MYSQL_DB_FILE)
  - Waits for DB host using wait-port before establishing connection; creates the todo_items table if missing

- Frontend: src/static
  - Static HTML/CSS/JS served by Express. UI calls /items endpoints.

Key conventions and patterns (project-specific)
- CommonJS module style: code uses require() and module.exports — generate CommonJS snippets for edits/tests unless modernizing repo.
- Route handlers are tiny, synchronous-looking async functions that call persistence functions and send results.
- Persistence contract is deliberately minimal; changes to persistence should preserve exported function signatures.
- Boolean handling for DB: `completed` is stored as 0/1; code converts to/from booleans in persistence layers.
- Secret-file env vars: mysql.js supports *_FILE pattern (useful for Docker secrets). Follow same pattern if adding other secret-readers.
- Tests under spec/ use Jest and heavily mock modules (jest.mock). Unit tests avoid starting the real DB or server.
- Startup ordering: db.init() is awaited before app.listen; any database init work should remain synchronous/awaited to avoid race conditions.
- Graceful shutdown includes SIGUSR2 to support nodemon restarts.
- UUID usage: routes/addItem.js uses uuid.v4 to generate ids — tests mock uuid for determinism.

Files of interest for cross-file edits
- src/index.js — server lifecycle and env-driven decisions
- src/persistence/* — switching DB backends, table schemas, and secret handling
- spec/ — examples of how tests mock modules and how single-file tests are structured

AI/assistant config files found
- No CLAUDE.md, .cursorrules, AGENTS.md, .windsurfrules, CONVENTIONS.md, or other known assistant config files detected.

Notes for Copilot-generated changes
- Prefer small, surgical edits that preserve the persistence API and route handler signatures.
- When adding tests, follow existing jest style in spec/ and mock external modules (persistence, uuid) rather than spinning up real DBs.
- Keep CommonJS by default; if converting to ESM, update package.json and tests consistently.

MCP servers
- This is a small web app (Express + static UI). Configure Playwright or a browser-based MCP server if end-to-end UI tests are added. Would you like an MCP server configuration for Playwright or another tool?

Summary
- Added repository-specific build/run/test facts, a high-level architecture overview, and key conventions Copilot should follow when editing code here.

If anything should be expanded or adjusted (tests, CI, linting, or MCP server choice), say which area to cover next.
