# IdleQuest — Project Specification

## 0. Document Authority

This document is the primary product and architecture specification for the IdleQuest project.

When implementing or modifying the project:

1. Preserve the product intent defined in this document.
2. Do not introduce unnecessary infrastructure or architectural complexity.
3. Prefer a playable, polished vertical slice over a broad but incomplete feature set.
4. Keep game content separated from game engine implementation.
5. Do not redesign the core concepts without a clear technical necessity.
6. If a requirement is ambiguous, choose the simplest implementation consistent with the product vision.
7. Do not block implementation by asking questions about minor details. Make a reasonable decision, document it, and continue.
8. All significant architectural decisions should be documented in `docs/architecture.md`.
9. The application must remain deployable through GitHub Actions with minimal manual infrastructure management.
10. Every production change must preserve the ability to run automated validation and tests.

---

# 1. Product Overview

## 1.1 Name

**IdleQuest**

Working tagline:

> A few minutes. One incident. Your call.

IdleQuest is a mobile-first decision simulation game designed primarily for software developers.

It presents realistic technical incidents and lets the player investigate the situation, make decisions, observe consequences, and eventually resolve or worsen the incident.

IdleQuest is NOT intended to be:

* a multiple-choice certification quiz;
* a flashcard application;
* a static collection of interview questions;
* a coding challenge platform;
* a simple trivia application.

The primary experience should resemble:

> incident response + troubleshooting + lightweight text adventure + learning game

The player should feel:

> “I was given an actual situation and had to decide what to do.”

rather than:

> “I answered a quiz question.”

---

# 2. Primary Product Goal

The most important product goal is:

> A user who is bored should be able to open IdleQuest on a phone, start a run immediately, play for approximately 5–15 minutes, and want to start another run.

The core loop must therefore remain extremely short:

```text
OPEN APPLICATION

↓ 

START RANDOM RUN

↓

READ INCIDENT

↓

INVESTIGATE / TAKE ACTION

↓

OBSERVE CONSEQUENCE

↓

MAKE ANOTHER DECISION

↓

...

↓

INCIDENT RESOLVED / FAILED

↓

REVIEW

↓

PLAY AGAIN
```

Starting a run should require as few interactions as practical.

Do not make the user configure a complex scenario before playing.

---

# 3. Development Context

IdleQuest is intentionally being developed with heavy AI-agent involvement.

A human product owner may frequently interact only through a mobile device and may issue instructions through Codex without directly editing the code.

Therefore the repository must be:

* easy for an AI coding agent to understand;
* strongly typed;
* modular;
* well documented;
* covered by automated tests;
* easy to deploy;
* resistant to accidental breaking changes;
* simple enough that future changes can be expressed conversationally.

Avoid clever code.

Prefer explicit domain models and readable code.

---

# 4. Infrastructure Philosophy

For the first major development phase, IdleQuest should require essentially no persistent infrastructure.

Initial deployment target:

* GitHub repository
* GitHub Actions
* GitHub Pages

Initial application architecture:

* static web application
* no external backend
* no external database
* no authentication
* no secrets
* no paid infrastructure
* no Docker requirement
* no cloud VM
* no manually managed server

Local player data should initially be persisted in browser storage.

The architecture should allow server functionality to be introduced in a later phase without rewriting the scenario engine.

---

# 5. Recommended Technology Stack

Use:

* Next.js
* TypeScript
* React
* App Router
* Tailwind CSS
* Vitest
* React Testing Library where appropriate

The application must support static export.

Configure Next.js so production output can be deployed to GitHub Pages.

Prefer minimal dependencies.

Do not add a state-management library unless application complexity justifies it.

React Context, hooks, reducers, or a lightweight store are all acceptable.

If a library is introduced, document why.

---

# 6. Mobile-First Requirement

The primary target device is a smartphone.

The desktop experience may be supported, but it is secondary.

Design for:

* one-handed interaction;
* touch controls;
* readable typography;
* large buttons;
* minimal horizontal layout;
* portrait orientation;
* short loading times;
* no hover-dependent interaction;
* no tiny controls.

The application should feel closer to a mobile game than an administration dashboard.

Target useful widths starting around 360px.

---

# 7. PWA Requirement

IdleQuest should be installable as a PWA.

Include:

* web app manifest;
* icons/placeholders where appropriate;
* application metadata;
* standalone-compatible layout;
* basic offline capability where practical.

The player should ideally be able to install IdleQuest to their phone home screen.

Because the scenario content is local to the application, previously deployed content should remain playable even with unstable connectivity if feasible.

Do not allow PWA complexity to delay the playable MVP.

---

# 8. Core Domain

The fundamental domain concepts are:

```text
KnowledgeProfile
Scenario
Incident
Run
RunState
DiagnosticAction
ActionResult
Consequence
Score
Skill
Review
```

The first implementation does not need every concept as a database-like entity.

However, the domain boundaries should be respected.

---

# 9. Core Game Principle

IdleQuest must simulate decision-making.

A scenario has a hidden underlying cause.

The player should NOT initially know that cause.

The player receives observable symptoms.

The player chooses investigations and operational actions.

Each action may:

* reveal information;
* consume time;
* improve the situation;
* worsen the situation;
* change incident state;
* introduce additional consequences;
* resolve the incident;
* cause failure.

Example:

```text
Incident:

Order API latency increased from 180 ms to 4.2 s.

Known information:

CPU: 23%
5xx: normal
Recent deployment: none
Database status: unknown
```

Possible action:

```text
Investigate Database
```

Possible result:

```text
Database CPU is normal.

However, one SELECT statement has an average execution time of 3.8 seconds.
```

Then the player continues investigating.

---

# 10. Not a Traditional Multiple Choice Quiz

Avoid presenting every node as:

```text
What is the answer?

A
B
C
D
```

Prefer actionable investigation categories.

Example:

```text
What do you want to investigate?

Application
Database
System
Network
Logs
```

Selecting `Database` can reveal further actions:

```text
Active Sessions
Slow Queries
Locks
Connection Pool
Database Resources
```

Operational actions should be clearly distinguishable from investigative actions.

Example:

```text
INVESTIGATE

View Application Logs
Inspect Slow Queries
Check DB Locks

ACTIONS

Restart Application
Rollback Deployment
Kill DB Session
```

Actions may be dangerous.

Do not visually tell the player beforehand which answer is correct.

---

# 11. Failure Design

Incorrect decisions must NOT usually produce:

> Wrong answer.

They should create believable consequences.

Example:

Player chooses:

```text
Restart Application
```

Possible consequence:

```text
The service restarted.

Latency returned to 210ms.

4 minutes later...

Latency: 5.1s

The incident has returned.

17 active user sessions were disconnected during the restart.
```

The incident continues.

Bad actions should occasionally create secondary problems.

Examples:

* unnecessary restart causes session loss;
* DB session kill causes rollback;
* deleting logs destroys diagnostic evidence;
* unsafe configuration increases exposure;
* blind rollback introduces version mismatch;
* increasing pool size temporarily hides a connection leak;
* scaling instances increases database pressure.

Failure should teach through consequences.

---

# 12. Scenario Architecture

Scenarios must NOT be hardcoded directly into React components.

Game content must be data-driven.

Use JSON initially unless YAML provides a clear practical advantage.

Recommended directory structure:

```text
content/
  scenarios/
  templates/
  causes/
  environments/
  symptoms/
  modifiers/
```

Initially handcrafted scenarios are acceptable.

However, the architecture must evolve toward procedural scenario generation.

---

# 13. Scenario Types

IdleQuest should eventually support two scenario classes.

## 13.1 Handcrafted Scenario

Carefully authored scenario with predetermined incident progression.

Used for:

* tutorial;
* boss incidents;
* complex scenarios;
* special learning content.

## 13.2 Generated Scenario

Scenario constructed from reusable components.

Used for normal random runs.

Example generation:

```text
Environment
+
Service
+
Symptom
+
Hidden Cause
+
Modifiers
+
Available Diagnostics
+
Consequences
```

---

# 14. Procedural Incident Model

The game must be architected so incidents can eventually be generated from components.

Possible components include:

## Environment

Examples:

* Spring Boot
* Oracle
* PostgreSQL
* MySQL
* Redis
* Nginx
* Docker
* Linux
* Node.js

## Symptom

Examples:

* high latency;
* intermittent 500 errors;
* CPU spike;
* memory growth;
* DB connection exhaustion;
* disk usage 100%;
* duplicate data;
* timeout;
* service restart loop;
* gateway 502;
* request queue growth.

## Hidden Cause

Examples:

* missing database index;
* DB lock contention;
* connection leak;
* N+1 query;
* disk full;
* memory leak;
* bad deployment;
* proxy timeout mismatch;
* race condition;
* thread pool exhaustion;
* cache miss storm;
* bad configuration.

## Modifier

Examples:

* no recent deployment;
* deployment occurred recently;
* traffic increased;
* traffic normal;
* issue affects one API only;
* issue affects all APIs;
* issue is intermittent;
* issue happens at a particular time;
* monitoring data incomplete.

---

# 15. Compatibility Rules

Random generation must not produce technically nonsensical incidents.

For example:

```text
Nginx
+
Missing Database Index
```

must not be generated unless an associated database exists in that generated environment.

Each content component should support compatibility metadata.

Conceptual example:

```json
{
  "id": "missing-index",
  "compatibleSystems": [
    "oracle",
    "postgresql",
    "mysql"
  ],
  "compatibleSymptoms": [
    "high-latency",
    "high-db-cpu"
  ]
}
```

Implement only the level of complexity needed for the current phase, but design schemas so compatibility validation can grow later.

---

# 16. Scenario Schema

Define a strongly validated scenario schema.

Use TypeScript types and runtime validation if appropriate.

A handcrafted scenario should conceptually include:

```text
id
version
title
description
category
difficulty
estimatedMinutes
skills
environment
startNode
nodes
rootCause
review
```

Each node should conceptually support:

```text
id
type
text
observations
availableActions
terminal
```

An action should support:

```text
id
label
type
nextNode
effects
scoreImpact
```

Potential action types:

```text
INVESTIGATE
MITIGATE
CHANGE
RESTART
ROLLBACK
KILL
WAIT
ESCALATE
ANSWER
```

Do not treat these exact fields as immutable if implementation suggests a cleaner type-safe model.

Preserve the concepts.

---

# 17. Run State

Every active run should maintain state independent of scenario definitions.

Conceptual structure:

```text
runId
scenarioId
startedAt
currentNode
status
elapsedGameTime
actions[]
flags{}
metrics{}
impact{}
```

Example flags:

```text
applicationRestarted
databaseChecked
locksChecked
rollbackPerformed
causeIdentified
```

Example metrics:

```text
latency
cpu
memory
activeUsers
errorRate
waitingSessions
```

Example impact:

```text
usersDisconnected
lostRequests
downtimeMinutes
risk
```

The implementation should allow an action to mutate these values.

---

# 18. Time

IdleQuest does not need to run in real time.

The game should support simulated incident time.

Example:

```text
13:20 Incident detected
13:22 Database checked
13:25 Application restarted
13:29 Incident returned
```

Actions can consume simulated minutes.

This provides another scoring dimension.

Do not require players to literally wait.

---

# 19. Scoring

Avoid reducing all performance to one meaningless number.

The primary score dimensions should include:

## Diagnosis

How effectively did the player narrow down the root cause?

## Safety

Did the player avoid unnecessarily dangerous operational actions?

## Efficiency

Did the player avoid wasting actions and simulated time?

## Understanding

Did the final behavior demonstrate understanding of the actual cause?

Optionally later:

* stability;
* impact control;
* cost;
* communication.

For MVP, scores may be deterministic based on actions.

Do not use AI scoring initially.

---

# 20. Results Screen

At the end of a run, show:

* result;
* scenario title;
* time;
* action count;
* score dimensions;
* root cause;
* player's action timeline;
* what went well;
* what could be improved;
* explanation of the incident;
* relevant learning notes;
* play again button.

Example:

```text
INCIDENT RESOLVED

Diagnosis       91
Safety          73
Efficiency      84
Understanding   90

ROOT CAUSE

ORDER_ITEM.ORDER_ID had no usable index.
The growing dataset caused a full table scan to become increasingly expensive.

GOOD DECISIONS

✓ Checked database activity
✓ Located slow query
✓ Examined execution plan

RISKY DECISIONS

⚠ Restarted the application before identifying the cause

The restart temporarily removed queued requests but did not fix the underlying database problem.
```

The result screen is an important part of the learning experience.

---

# 21. Knowledge Profile

A player should eventually have a profile representing approximate familiarity with technical areas.

Initial skills:

```text
BACKEND
JAVA
SPRING
SQL
DATABASE
ORACLE
LINUX
DOCKER
HTTP
NETWORK
REDIS
CONCURRENCY
TROUBLESHOOTING
```

Do not require the user to perfectly configure this before playing.

Provide sensible defaults.

A lightweight onboarding screen may ask approximate skill familiarity.

Example scale:

```text
UNKNOWN
BEGINNER
BASIC
INTERMEDIATE
ADVANCED
```

For the initial intended player profile, defaults should roughly favor:

```text
Java/Spring      intermediate
SQL              intermediate
Oracle           basic/intermediate
Docker           basic/intermediate
Linux            basic
HTTP             basic/intermediate
Network          basic
Redis            unknown/beginner
Concurrency      basic
```

But the implementation should remain generic.

---

# 22. Play Modes

Eventually provide three principal modes.

## 22.1 COMFORT

Problems from areas the player already understands.

Goal:

* enjoyable;
* confidence-building;
* practical troubleshooting.

## 22.2 GROWTH

Problems approximately one level above current proficiency.

Goal:

* improve technical judgment;
* expose new concepts without overwhelming the player.

## 22.3 LEARN

Explicit learning-oriented incidents.

If the player encounters an unfamiliar concept, provide optional contextual help.

Example:

```text
Redis cache hit rate: 3%
```

The player may tap:

```text
What does cache hit rate mean?
```

Then receive a short explanation without ending the run.

Hints should reduce score slightly or be tracked separately, but never punish a learner harshly.

For the initial MVP, only RANDOM/COMFORT needs to be fully implemented.

Architecture should permit the other modes later.

---

# 23. Difficulty

Scenario difficulty must not simply mean obscure terminology.

Difficulty should increase through:

* incomplete information;
* misleading symptoms;
* multiple plausible causes;
* multi-system interactions;
* secondary failures;
* higher cost of bad actions;
* concurrency;
* distributed behavior;
* more complex diagnostic paths.

Difficulty examples:

Level 1:
clear symptoms, one obvious subsystem.

Level 2:
multiple reasonable diagnostics.

Level 3:
misleading symptoms or incomplete observations.

Level 4:
multiple interacting systems.

Level 5:
complex incident with cascading consequences.

---

# 24. Scenario Repetition

A major design requirement:

> The application must not become useless after the player memorizes ten scenarios.

Therefore scenario diversity is a fundamental requirement.

The solution should eventually combine:

* handcrafted scenarios;
* procedural generation;
* variation in metrics;
* variation in environment;
* variation in modifiers;
* alternative hidden causes;
* randomized diagnostic outputs;
* different consequences;
* AI/Codex-generated content packs.

Do not rely only on dozens of static questions.

---

# 25. Content Expansion Workflow

New content should be easy for an AI coding agent to add without modifying engine code.

Desired workflow:

```text
Product owner:
"Add 10 beginner network incidents."

↓

Codex creates content files

↓

Automated validation

↓

Tests

↓

Pull request

↓

Merge

↓

GitHub Actions

↓

GitHub Pages deployment
```

The human player should ideally not need to inspect the scenario contents before playing.

This preserves surprise.

---

# 26. Content Validation

Create automated scenario validation.

At minimum validate:

* unique scenario ID;
* valid start node;
* every referenced node exists;
* no duplicate node IDs;
* terminal path exists;
* invalid action references fail validation;
* required fields are present;
* difficulty is valid;
* scenario is reachable;
* action types are valid.

Where practical also validate:

* at least one successful resolution;
* no accidental dead-end unless intentionally terminal;
* scoring fields valid;
* skill identifiers valid;
* generated scenarios satisfy compatibility constraints.

Provide a command such as:

```text
npm run validate:content
```

This command should be part of CI.

---

# 27. Initial Scenario Content

Create at least 5 high-quality playable scenarios for the first delivered version.

Prefer quality over quantity.

Suggested initial scenarios:

## Scenario 1

Slow API caused by missing database index.

Skills:

* SQL
* Database
* Troubleshooting

## Scenario 2

Database connection pool exhaustion caused by connection leak.

Skills:

* Backend
* Database
* Spring

## Scenario 3

Docker container restart loop caused by disk exhaustion or configuration failure.

Skills:

* Docker
* Linux

## Scenario 4

Nginx 502 caused by unavailable/upstream application.

Skills:

* HTTP
* Network
* Backend

## Scenario 5

Duplicate records caused by a concurrency/race-condition issue.

Skills:

* Backend
* Database
* Concurrency

Each scenario should contain meaningful branches and consequences.

Do not make all five simple linear question trees.

---

# 28. Player History

Store run history locally.

Persist:

```text
scenario
date
result
score
duration
actions
skills
```

The player should be able to view recent runs.

Avoid collecting excessive browser data.

No cloud sync is needed initially.

---

# 29. Player Statistics

Basic stats:

```text
runsPlayed
runsResolved
runsFailed
averageScore
recentRuns
categoryPerformance
skillPerformance
```

Example:

```text
SQL
18 runs
83% resolution

Network
7 runs
42% resolution
```

Do not overstate this as a scientific assessment of developer ability.

It is game performance data.

---

# 30. Skill Progression

A lightweight progression system is desirable.

However:

> Do not turn IdleQuest into an XP grinding game.

Skill progress should reflect actual run performance.

Example:

```text
SQL          Lv. 6
Backend      Lv. 5
Docker       Lv. 4
Network      Lv. 2
Concurrency  Lv. 2
```

Levels should influence future scenario selection.

This can be added after the basic gameplay is stable.

---

# 31. Home Screen

Design a simple mobile-first home screen.

Suggested hierarchy:

```text
IDLEQUEST

[ START RANDOM RUN ]

Comfort
Growth
Learn

YOUR SKILLS

Backend      Lv. 5
SQL          Lv. 6
Docker       Lv. 3
Network      Lv. 2

RECENT

✓ Slow API
✕ Docker Restart Loop
✓ DB Lock
```

For MVP, only the random run button needs to be fully active.

Do not show disabled unfinished features unless visually clear.

---

# 32. Run Screen

The Run screen is the most important UI in the product.

It should contain:

* incident title/context;
* simulated timestamp;
* current observations;
* event/log timeline where appropriate;
* investigation controls;
* operational actions;
* consequence feedback.

Avoid clutter.

Example:

```text
15:20

ORDER API INCIDENT

Average latency
4.2 sec ↑

5xx
0.2%

CPU
23%

Recent deploy
None

────────────────────

INVESTIGATE

[ Application ]
[ Database ]
[ System ]
[ Network ]
[ Logs ]

ACTIONS

[ Restart Service ]
```

After selecting an action, present the consequence clearly before showing the next decision.

Animations should be subtle and fast.

---

# 33. Incident Log

A run should maintain a visible lightweight timeline.

Example:

```text
15:20 Incident detected
15:21 Checked database
15:23 Slow query discovered
15:25 Restarted application
15:29 Incident returned
```

This reinforces the simulation feeling and helps the result review.

---

# 34. UX Tone

The UI should feel:

* technical;
* focused;
* slightly game-like;
* modern;
* readable;
* not childish.

Avoid excessive RPG fantasy styling.

Do not cover everything with neon cyberpunk effects.

A subtle operations-console / incident-response aesthetic is acceptable.

Do not sacrifice readability for visual gimmicks.

---

# 35. Writing Style Inside Scenarios

Scenario text should be concise.

Prefer:

```text
14:32

Order API latency rose from 180ms to 4.2s.

CPU remains at 23%.
No deployment occurred today.
Error rate is unchanged.
```

Avoid long textbook paragraphs during play.

Detailed explanations belong in the result screen.

---

# 36. Technical Accuracy

Technical scenarios must be plausible.

Do not manufacture false troubleshooting rules simply to create gameplay.

When a scenario intentionally simplifies reality, make the simplification reasonable.

Prefer scenarios where:

* several actions are reasonable;
* one path is more efficient;
* dangerous actions may still temporarily help;
* evidence gradually narrows the diagnosis.

Avoid making “restart = always wrong” or similar simplistic rules.

Real incidents are contextual.

---

# 37. Root Cause Secrecy

The hidden root cause must not accidentally appear in the client UI before resolution.

Because the initial project is fully static, determined users could inspect bundled source files.

That is acceptable for this phase.

The important requirement is:

> Normal gameplay must not reveal hidden fields through UI or obvious debug output.

Do not display internal scenario IDs or root-cause metadata during active gameplay.

---

# 38. Storage

Use a versioned local persistence model.

Possible abstraction:

```text
StorageAdapter
```

Initial implementation:

```text
LocalStorageAdapter
```

Potential future implementation:

```text
RemoteStorageAdapter
```

Do not tightly couple game logic to `window.localStorage`.

This will make future account sync possible.

Persist only necessary application state.

---

# 39. Game Engine Separation

The game engine must not depend on UI components.

Recommended conceptual separation:

```text
src/
  app/
  components/
  game/
    engine/
    model/
    scoring/
    generation/
    validation/
  content/
  storage/
```

The game engine should be testable as plain TypeScript.

Example:

```text
startRun(scenario)
applyAction(run, action)
evaluateRun(run)
generateIncident(profile)
```

Exact function names are flexible.

---

# 40. Pure Functions

Prefer pure functions for:

* state transitions;
* scoring;
* content validation;
* compatibility checking;
* incident generation.

This makes AI-generated modifications safer and easier to test.

---

# 41. Deterministic Randomness

For generated scenarios, eventually support seeded randomness.

A generated run may record:

```text
seed
```

Benefits:

* reproducible bugs;
* replay;
* automated testing;
* sharing scenarios later.

A full procedural generator is not mandatory for the first vertical slice, but engine APIs should not make it difficult to add.

---

# 42. Testing Requirements

Use automated tests.

Mandatory test areas:

## Scenario engine

* starting a run;
* selecting valid action;
* invalid action rejection;
* state transitions;
* terminal states.

## Scoring

* score changes;
* score bounds;
* successful incident;
* failed incident.

## Content

* scenario schema;
* node references;
* terminal path;
* compatibility validation where implemented.

## Storage

* serialization;
* deserialization;
* version migration behavior if implemented.

Do not chase 100% test coverage.

Focus on domain behavior.

---

# 43. CI

Create GitHub Actions workflows.

Pull request workflow:

```text
checkout
setup Node
npm ci
lint
typecheck
unit tests
content validation
production build
```

Main branch workflow:

```text
checkout
setup Node
npm ci
lint
typecheck
unit tests
content validation
build static export
upload Pages artifact
deploy to GitHub Pages
```

A failure in testing or validation must stop deployment.

---

# 44. GitHub Pages

Configure the application correctly for repository-based GitHub Pages paths.

The implementation must handle the possibility that the application is hosted under:

```text
https://USERNAME.github.io/idlequest/
```

Do not assume root `/` deployment unless technically detected/configured.

Document repository-name/base-path configuration.

---

# 45. Branch and PR Philosophy

All non-trivial changes should be suitable for pull requests.

Codex should:

1. understand current architecture;
2. make focused changes;
3. run validation/tests;
4. summarize modifications;
5. mention important tradeoffs;
6. avoid unrelated refactoring.

Do not combine massive refactoring with content changes unless necessary.

---

# 46. Documentation

Create:

```text
README.md
PROJECT_SPEC.md
AGENTS.md
docs/
  architecture.md
  content-authoring.md
  scenario-schema.md
  roadmap.md
```

README should contain:

* what IdleQuest is;
* screenshot placeholder;
* development instructions;
* build instructions;
* testing;
* content validation;
* deployment;
* project status.

---

# 47. AGENTS.md

Create an `AGENTS.md` file for future coding agents.

It should explicitly remind agents:

* read `PROJECT_SPEC.md` first;
* preserve game engine/content separation;
* prefer simple architecture;
* never require backend infrastructure for v0.x without explicit instruction;
* run lint/typecheck/test/content validation/build;
* do not silently change scenario schema;
* write migrations if persistence schema changes;
* maintain mobile-first UI;
* keep technical scenario content realistic;
* update architecture documentation after major decisions.

---

# 48. Accessibility

Basic accessibility is required.

Ensure:

* buttons have accessible labels;
* keyboard operation works where practical;
* contrast is readable;
* semantic HTML used;
* animations respect reduced-motion preference where practical.

Mobile-first does not mean touch-only.

---

# 49. Performance

Keep bundle size reasonable.

Scenario content may grow significantly.

Do not eagerly load hundreds or thousands of scenarios if it becomes wasteful.

Initial implementation may bundle small content.

Design content loading so future chunking is possible.

Do not prematurely optimize.

---

# 50. Future AI Architecture

AI is explicitly NOT required for v0.1.

However, future architecture will likely include:

## AI Scenario Generation

Input:

```text
difficulty
skills
environment
player weaknesses
```

Output:

structured scenario or incident components.

Generated content must still pass validation.

## AI Free-Form Action Evaluation

Future user input:

```text
"I would first check whether the problem affects all endpoints, then inspect recent deployments and DB latency."
```

AI interprets the action.

## AI Dungeon Master

Input:

```text
hidden cause
current state
previous actions
player action
```

Output:

next believable incident state.

Do not add an LLM API key to the static client.

When real-time AI is introduced, use a secure server-side component.

---

# 51. Future Backend

Only introduce backend infrastructure when features require it.

Examples:

* cross-device sync;
* authentication;
* leaderboards;
* server-side LLM;
* shared scenarios;
* community scenarios.

Potential future architecture:

```text
IdleQuest PWA
      |
      v
IdleQuest API
      |
      +-- Database
      |
      +-- LLM Provider
```

This is NOT part of initial implementation.

---

# 52. Future Social Features

Possible, but low priority:

* shareable incident seeds;
* compare approaches;
* daily challenge;
* community scenarios;
* leaderboard.

Do not implement before core gameplay proves enjoyable.

---

# 53. Future Boss Incidents

A Boss Incident is a longer, handcrafted run lasting roughly 20–30 minutes.

It may involve multiple systems.

Example:

```text
Friday 17:00 warehouse production outage

WPF timeout
↓
API partially healthy
↓
Oracle normal CPU
↓
Specific procedure blocked
↓
DB lock investigation
↓
Long-running transaction
↓
Decision whether session kill is safe
↓
Rollback duration
↓
Recovery
```

Boss mode is not required for v0.1.

Architecture should permit it.

---

# 54. First Vertical Slice

The first milestone should NOT attempt to implement the whole roadmap.

Build one complete playable vertical slice.

Required flow:

```text
Home

↓

Start Run

↓

Scenario introduction

↓

Choose diagnostic action

↓

See consequence

↓

Make several decisions

↓

Reach resolution/failure

↓

View detailed review

↓

Play again
```

Use one high-quality handcrafted scenario first.

This scenario should test:

* branching;
* investigation;
* risky action;
* consequences;
* scoring;
* result review.

Only after this loop works well should additional systems be built.

---

# 55. MVP v0.1 Scope

After the vertical slice is proven, v0.1 should contain:

## Required

* Next.js + TypeScript project;
* mobile-first UI;
* static export;
* GitHub Pages support;
* PWA basics;
* random run button;
* at least 5 scenarios;
* branching actions;
* consequences;
* deterministic scoring;
* run result/review;
* local run history;
* content validation;
* automated tests;
* GitHub Actions CI/CD;
* documentation.

## Explicitly Not Required

* backend server;
* database;
* account;
* OAuth;
* real-time multiplayer;
* leaderboards;
* LLM API;
* AI-generated scenario at runtime;
* payment;
* notifications;
* complex analytics;
* admin panel.

---

# 56. v0.2 Target

After the game is playable:

* improved procedural incident components;
* scenario compatibility rules;
* random variation;
* basic skill profile;
* performance per skill;
* improved run history;
* replay;
* difficulty selection.

---

# 57. v0.3 Target

Introduce:

* Comfort mode;
* Growth mode;
* Learn mode;
* hint system;
* skill progression;
* weak-area detection;
* larger generated scenario pool.

---

# 58. v0.4 Target

Improve simulation depth:

* mutable incident metrics;
* chained consequences;
* secondary failures;
* more dynamic state;
* advanced procedural incidents;
* seeded runs;
* Boss incidents.

---

# 59. v1.0 / AI Phase

Only after the non-AI gameplay is proven:

* secure backend;
* AI content generation;
* free-form player actions;
* AI evaluator;
* AI Dungeon Master;
* cloud sync if useful.

---

# 60. Success Criteria

The project is successful when:

1. The application can be opened easily from a smartphone.
2. A run can start in seconds.
3. The player understands the incident without reading excessive text.
4. Player actions produce believable consequences.
5. Wrong actions are interesting rather than simply rejected.
6. The player learns something from the final review.
7. The player can immediately play again.
8. Scenario content can be added without modifying game engine code.
9. Automated validation prevents malformed scenarios from deployment.
10. Main-branch changes can automatically deploy through GitHub Actions.
11. The player voluntarily starts another run because the game is interesting.

The last criterion is the most important.

---

# 61. Anti-Goals

Do NOT allow the project to drift into:

## Quiz Application

Bad:

```text
What causes HTTP 502?

A
B
C
D
```

## Generic Learning Management System

Do not build courses, chapters, attendance, assignments, certificates, etc.

## Infrastructure Showcase

Do not introduce Kubernetes, microservices, Kafka, Redis, or cloud infrastructure simply to demonstrate technical complexity.

## Dashboard Application

Do not spend most development time making graphs and statistics while the gameplay is weak.

## RPG Grind

Do not replace learning and troubleshooting with meaningless XP mechanics.

## AI Wrapper

Do not make the entire product merely:

```text
Prompt → LLM → Text
```

IdleQuest needs its own game state and domain model.

---

# 62. Product Decision Priority

Whenever two implementation options compete, use this priority:

```text
1. Gameplay quality
2. Mobile usability
3. Technical correctness
4. Maintainability
5. Content scalability
6. Automated safety
7. Visual polish
8. Additional features
```

---

# 63. Initial Development Instructions

Begin implementation immediately.

Perform the work in this order:

## Step 1

Initialize the Next.js TypeScript project.

Configure:

* Tailwind;
* linting;
* tests;
* typecheck command;
* static export;
* GitHub Pages-compatible paths.

## Step 2

Define core game types.

Create:

* scenario schema;
* run state;
* action model;
* result model.

## Step 3

Implement scenario validation.

## Step 4

Implement the game engine independently of React.

Required capabilities:

```text
start run
inspect current state
list available actions
apply action
transition state
record timeline
detect terminal state
calculate result
```

## Step 5

Write engine tests.

## Step 6

Create the first polished scenario:

> Slow production API caused by a database/index-related problem.

Include at least:

* 3 investigation branches;
* 1 risky operational action;
* temporary symptom relief from an incorrect action;
* incident continuation after that action;
* proper root-cause path;
* result explanation.

## Step 7

Build mobile UI around the engine.

## Step 8

Implement result/review screen.

## Step 9

Persist run history locally.

## Step 10

Add four additional scenarios.

## Step 11

Add PWA basics.

## Step 12

Add GitHub Actions CI/CD.

## Step 13

Write documentation.

## Step 14

Run:

```text
lint
typecheck
tests
content validation
production build
```

Resolve all failures.

---

# 64. Definition of Done for Initial Delivery

Do not call the initial project complete until all conditions below pass:

* `npm install` succeeds;
* local development starts successfully;
* lint succeeds;
* TypeScript typecheck succeeds;
* tests succeed;
* content validation succeeds;
* production static build succeeds;
* GitHub Pages workflow exists;
* at least 5 scenarios exist;
* a user can complete a run from beginning to result;
* bad decisions can produce consequences without immediately ending every scenario;
* history persists after refresh;
* mobile UI is usable at approximately 360px width;
* README explains how to develop and deploy;
* architecture documentation exists.

---

# 65. Final Instruction to Codex

Treat this as a real product, not a coding demo.

Do not stop after scaffolding.

Do not create placeholder screens and call the project complete.

Deliver a genuinely playable vertical slice.

Favor a small amount of polished content over many shallow features.

After implementation, provide a concise report containing:

1. architecture implemented;
2. important decisions;
3. files/directories added;
4. tests and validation performed;
5. known limitations;
6. next three recommended product improvements.

If an implementation decision conflicts with this specification, explicitly document the reason.
