# Test speed and CI shards

Written 2026-11-06 (`hot/test-speed`). The suite is about 3,050 test cases in 626 files.

## Before and after (GitHub runner, 4 vCPU)

| | Before | After |
| --- | --- | --- |
| `npm test` step in the deploy job | 580-636 s, one job, with lint, content check and build in series (about 13 min) | about 105-115 s per shard, six shards in parallel; lint and content check, the build and the perf job run beside them |
| Slowest shard, whole job including `npm ci` | n/a | about 170 s |
| Hangs | one failing scripted test (see below) ran for 25 minutes and more | every step has a time limit, and a running-files report names what was in flight |

## How it works

- **Two projects, lean by default.** `tests/setup-side-stories.ts` loads about 22 MB of story
  scripts. In CI every file gets a fresh worker, so that load was paid once per file. A file now
  runs in the lean `unit` project (no scripts registered) unless it needs them. It needs them
  when it is in `STORY_FILES`, or when one of its relative imports or mocks names a story module
  (`STORY_IMPORT`), both in `tests/test-projects.ts`. `VERIFIED_UNIT_FILES` are lean whatever
  they import. About 490 files are lean and about 120 load the scripts.
  - A new file that needs a story and fails with a missing scene or quest: add it to
    `STORY_FILES`.
  - Check a file in either project: `npx vitest run --project unit <file>` or `--project stories <file>`.
- **CI keeps one fresh worker per file** (`isolate` stays on there; that is what caught the
  storage leak). Locally the files share a module cache, as before; `ISOLATE=1` opts out.
- **Weighted shards.** `vitest run --shard=N/M` normally deals files out by a hash of the path, so
  the heavy scripted runs (campaign, side stories, expansions, reachability) landed together.
  `tests/shard-sequencer.ts` deals them out by weight instead, from `tests/shard-weights.ts`.
  Refresh the weights from a CI run: each shard's check-run annotations carry a `weights` line
  (every file of 3 s or more), printed by `tests/tools/slow-report.cjs`.
- **Timeouts and diagnosis.** Each shard step has `timeout-minutes: 8`. `tests/tools/running-reporter.mjs`
  keeps `vitest-running.json` up to date, and `slow-report.cjs` turns a run with no report into
  an annotation naming the files still running. Read annotations with
  `GET /repos/<owner>/<repo>/check-runs/<job id>/annotations` (no login needed).
- **Wall-clock budgets** stay out of the main suite on CI (`budgetMs` is `Infinity` there); the
  PERF=1 job checks them one file at a time.

## `npm run test:changed`

Runs `vitest related` on the files you changed (committed since `origin/main`, staged, unstaged
and untracked, under `src/`, `tests/` and `public/`). It is a quick gate for intermediate checks;
the full `CI=true npm test` stays required before a push. A change to something every test
imports (`rng.ts`, `types.ts`, the world) selects most of the suite, so it is fastest for leaf
modules. `--base <ref>` compares with another ref, `--staged-only` looks at the index only, and
anything after `--` goes to vitest.

## Things found on the way

- `tests/sim/dungeon-kid-r10.test.ts` had an unbounded `while` loop in the tag-boss test. It now
  fails after 60 tries instead of hanging a shard.
