# Architecture

IdleQuest is a statically exported Next.js App Router client. `src/game` is the UI-independent domain: Zod validates external content, pure transitions create immutable run state, and deterministic score deltas capture diagnosis, safety, efficiency, and understanding. JSON under `src/content/scenarios` is imported through one validated catalog; React never defines scenario branches.

The client owns presentation and holds the active run in component state. A small `StorageAdapter` boundary persists only capped, versioned (`idlequest.history.v1`) history to localStorage, leaving room for a remote adapter without changing the engine. Static content is bundled for v0.1; future scale can replace the catalog with chunked loading. Random selection is intentionally unseeded, while engine inputs remain deterministic.

Static export uses a repository-derived base/asset path during Actions. A manifest and conservative cache-first service worker provide install/offline basics. No backend, credentials, telemetry, or runtime AI exists.

## Decisions

- JSON + Zod provides author-friendly content and runtime safety with one schema.
- Actions transition between authored nodes while effects independently mutate flags, metrics, impact, time, and scores.
- Risky choices generally continue to an evidence path; an unverified production fix can eventually fail, preserving consequence-driven play.
- The five incidents use a common structural grammar, which is a known v0.1 content limitation rather than engine coupling.

## Container preview delivery

Pull requests now use a three-stage pipeline. GitHub-hosted runners verify the app, build an immutable Nginx image, and push it to GHCR. Only after that succeeds does the job cross the trust boundary to the Linux self-hosted runner, which pulls that exact digest-addressable tag and reconciles `compose.yaml`. Compose binds Nginx exclusively to `127.0.0.1:6745`; the host's existing Cloudflare Tunnel publishes it as `quest.topazkang.com`. No application backend or persistent container volume is introduced—the image serves the same static export as GitHub Pages.

PR deployments intentionally share one preview environment, so the most recently completed PR replaces the prior preview. Workflow concurrency cancels older runs to reduce stale deployment races. The self-hosted runner must have Docker Engine, Compose v2, and outbound GHCR access; it does not build application code.

Because this repository was bootstrapped in an environment where npm registry access is blocked, dependency versions are exact and automation currently uses `npm install`. Generating and committing `package-lock.json`, then returning automation to `npm ci`, remains a release-hardening task.
