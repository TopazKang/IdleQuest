# IdleQuest

> A few minutes. One incident. Your call.

IdleQuest is a Korean-first, mobile-first incident-response simulation—not a quiz. Investigate symptoms, make operational decisions, experience believable consequences, and review the root cause. v0.1 ships five branching incidents and stores recent results only in the browser.

## Screenshot

_Run `npm run dev` and open the responsive mobile view (360px or wider)._

## Development

Requires Node.js 20+.

```bash
npm install
npm run dev
```

Quality gates: `npm run lint`, `npm run typecheck`, `npm test`, `npm run validate:content`, and `npm run build`. The static site is emitted to `out/`.

## Content

Scenarios are JSON in `src/content/scenarios`. See [content authoring](docs/content-authoring.md) and [schema](docs/scenario-schema.md). Content is validated independently of React.

## Deployment

GitHub Actions validates pull requests. Pushes to `main` build and deploy the `out` artifact to GitHub Pages. The Next configuration derives the repository base path from `GITHUB_REPOSITORY`; no server, database, secrets, or authentication are used. Enable **GitHub Actions** as the Pages source in repository settings.

## Status

MVP v0.1: playable random runs, five incidents, review/scoring, local history, PWA basics, tests, validation, and static Pages deployment. See the [roadmap](docs/roadmap.md).

## Container preview deployment

Each pull request to `main` triggers `.github/workflows/ci.yml`:

1. a GitHub-hosted runner runs every quality gate;
2. it builds the static export into an Nginx image and pushes an immutable PR/SHA tag to GHCR;
3. the Linux self-hosted runner pulls that image and runs `docker compose up -d`;
4. the workflow verifies `http://127.0.0.1:6745/`.

The Compose service binds only to loopback at port `6745`. The host-managed Cloudflare Tunnel is responsible for exposing `https://quest.topazkang.com`; Cloudflare credentials are never stored in this repository. The self-hosted runner requires Docker Engine and Compose v2. The repository workflow needs `packages: write`, and the runner account needs permission to control Docker.

For a manual server rollback, set `IDLEQUEST_IMAGE` to an earlier GHCR tag and reconcile Compose:

```bash
IDLEQUEST_IMAGE=ghcr.io/owner/idlequest:pr-123-<sha> docker compose up -d
```

Merges to `main` and manual workflow dispatches use the same verified delivery path with a `main-<sha>` image tag, so the public container is refreshed after merge as well as during PR preview.
