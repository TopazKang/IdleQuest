# IdleQuest

> A few minutes. One incident. Your call.

IdleQuest is a mobile-first incident-response simulation—not a quiz. Investigate symptoms, make operational decisions, experience believable consequences, and review the root cause. v0.1 ships five branching incidents and stores recent results only in the browser.

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
