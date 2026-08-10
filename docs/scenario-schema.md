# Scenario schema

A scenario contains identity/version, title/description/category, difficulty 1–5, expected minutes, skills, environment, a `startNode`, nodes, a hidden root cause, and review notes. Each node has unique `id`, concise `text`, observations, actions, and optional `terminal` (`RESOLVED` or `FAILED`). Terminal nodes have no actions.

Actions require unique-in-node identity, label, allowed type, existing `nextNode`, consequence text, and optional effects/score deltas. Effects may advance positive simulated minutes and update numeric metrics/impact or boolean flags. Validation checks schema fields, global scenario IDs, node uniqueness/references, reachability, dead ends, and a reachable successful ending.
