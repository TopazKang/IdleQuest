# Architecture

IdleQuest is a statically exported Next.js App Router client. `src/game` is the UI-independent domain: Zod validates external content, pure transitions create immutable run state, and deterministic score deltas capture diagnosis, safety, efficiency, and understanding. JSON under `src/content/scenarios` is imported through one validated catalog; React never defines scenario branches.

The client owns presentation and holds the active run in component state. A small `StorageAdapter` boundary persists only capped, versioned (`idlequest.history.v1`) history to localStorage, leaving room for a remote adapter without changing the engine. Static content is bundled for v0.1; future scale can replace the catalog with chunked loading. Random selection is intentionally unseeded, while engine inputs remain deterministic.

Static export uses a repository-derived base/asset path during Actions. A manifest and conservative cache-first service worker provide install/offline basics. No backend, credentials, telemetry, or runtime AI exists.

## Decisions

- JSON + Zod provides author-friendly content and runtime safety with one schema.
- Actions transition between authored nodes while effects independently mutate flags, metrics, impact, time, and scores.
- Risky choices generally continue to an evidence path; an unverified production fix can eventually fail, preserving consequence-driven play.
- The five incidents use a common structural grammar, which is a known v0.1 content limitation rather than engine coupling.
