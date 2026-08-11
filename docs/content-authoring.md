# Content authoring

1. Copy a scenario JSON file in `src/content/scenarios` and assign a globally unique kebab-case `id`.
2. Write concise symptoms without revealing `rootCause` in active node text.
3. Include investigative and operational choices. Dangerous choices should describe plausible state or customer impact and should usually let play continue.
4. Connect every node from `startNode`, provide at least one `RESOLVED` terminal, and avoid non-terminal dead ends.
5. Add the import to `src/content/index.ts` and run `npm run validate:content` plus tests.

Score deltas are deterministic and clamped by the engine. Use negative safety for hazardous changes, diagnosis for useful evidence, efficiency for direct paths, and understanding for cause confirmation.
