# CLAUDE.md — Grove (working title)

Short on purpose: this file loads into every session. The full standing brief (game
systems, milestones, acceptance checks, the look) is `docs/brief.md`; read the section you
need, not the whole file. `PROGRESS.md` holds the status block and the last few passes;
older passes are in `docs/progress-archive.md` (search it, never read it whole).

## Context budget (every session)

- Start by reading this file and the **Status** block at the top of `PROGRESS.md`. Nothing else until the task needs it.
- Never read a source file over 400 lines whole. Grep for the name you need and read that line range. The map below says where things are.
- `src/samples/creatures-legacy.ts` and `docs/progress-archive.md` are reference only.
- Aim to have under 50k tokens of context before the first edit.

## What we are building

An original virtual-pet garden game for phone and desktop browsers (TypeScript strict, Vite, Three.js 0.186.1 pinned, Vitest). Hatch a Nubbin, raise it, shape how it grows; it ages and is reborn or departs. The shipped game is 2.5D pixel art. A full-3D mode is being built additively behind a title toggle. Names, art, music are original; the Nubbins are Chao-faithful fan art and other families are chibi approximations drawn in code; the inspiration is data in `sim/species.ts` and never shown.

## Architecture (the rules that never bend)

- `src/sim/` is game rules only: no DOM, no Three.js, no `Math.random` (seeded `rng.ts`). Fixed 100 ms steps; render reads sim state and never changes it; input and UI send commands.
- One clock (`clock.ts`), offline catch-up with the "aging while closed" setting, versioned saves with migrations, three save slots per mode, every storage call in try/catch.
- Two renderers behind one `WorldView` interface: the pixel renderer in `src/render/` (ships, must keep working at every commit) and the 3D mode (today in `src/samples/` behind URL flags; later `src/render3d/`). The sim never learns which is on.
- Creatures in 3D are data, never meshes: a `SpeciesSpec` → `buildSpecies` (SDF primitives, marching cubes, baked vertex colour with ambient occlusion, shell fur, eyes and mouth projected onto the skin, eye rig, poses, expressions, extras hook). Format doc: `docs/species-format.md`.
- Art direction: the Palworld references Maor supplied are the bible (roster screenshot, Palworld Mobile short, "All Pet Animations" video). Backlog ordered against them: `docs/creature-improvements.md`. Subagent briefs: `plan.md`.
- Every tunable number lives in `src/config/tuning.ts`; every player-facing string in `src/config/strings.ts`.

## Where things are (grep, do not browse)

| Need | File, function |
| --- | --- |
| Species format types and builder | `src/samples/species.ts`: `SpeciesSpec`, `PartSpec`, `Expression`, `EXPRESSIONS`, `onSurface`, `buildMouth`, `buildSpecies`, poses in `animate` |
| Species data | `species-data.ts` (`NUBBIN_SPEC`, `FENNEL_SPEC`), `species-roster.ts` (`MOSSLING_SPEC`, `BOLDER_SPEC`, `WISP_SPEC`, `ROSTER`) |
| Creature toolkit | `src/samples/creatures.ts`: `surfaceMaterial`, `furShells`, `smokeShell`, `eye` (`EyeRig`), `irisTexture`, `gradient`/`stripes`/`spots`, `part`, `blink`, `breathe` |
| SDF sculpting | `src/samples/sculpted.ts`: `Prim`, `sdf`, `smin`, `sculpt` (AO bake inside), `V` |
| 3D stage (environment, post, creature placement, line-up, grass `PUSHERS`) | `src/samples/aaa-styles.ts`: `buildTerrain`, `buildGrass`, `buildWater`, `mountAaaSample` (creature block near `const creatureParam`, loop near `const poseNow`) |
| Stage URLs | `?aaa=1..3` (noon, golden, rain), `&creature=1..5|all`, `&pose=idle|happy|walk|eat|sleep`, `&turn=<deg>`, `&closeup`, `nobloom nossao nodof nofog` |
| Pixel world and picking | `src/render/world-view.ts`, `grove-scene.ts`, painters in `src/render/paint/` |
| Sim entry points | `src/sim/world.ts` (commands, events), `dungeon.ts`, `town.ts`, `lifecycle.ts` |
| Saves and slots | `src/platform/storage.ts` (`SaveSlot`, `slotKey`, `summarize`), `src/ui/title.ts` |
| Tests | `tests/sim/*.test.ts` (210 pass); `tests/tools/` holds the painted-sample generators |

## Coding standards

- `strict` with `exactOptionalPropertyTypes`: conditional spreads for optional fields, never assign `undefined`.
- ESLint and Prettier (100 columns) clean before every commit; format before grepping for patch anchors.
- Comments say why, in plain sentences; each file opens with a short paragraph on what it is for.
- Shader hooks via `onBeforeCompile`; expose `material.userData.shader` for live uniforms; declare every uniform in the stage that uses it. Three 0.186: `vColor` is a `vec4` in fragment shaders; MarchingCubes normals are unnormalised.
- A new spec field ships with one species using it and a row in `docs/species-format.md`.
- Each pass: a section at line 12 of `PROGRESS.md` (newest first; keep the file under 150 lines by moving old sections to `docs/progress-archive.md`), screenshots in `docs/samples/` named by pass.
- Gate before push: `npm run lint`, `npm test`, `npm run build`. GitHub Pages deploys on every push to `main`. The full-life timing test has a 3 s budget on a CI runner about 1.7× slower than Maor's PC.
- Commits: imperative title under 72 characters, short body when the why is not obvious, and `Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>`.
- On this machine: Git Bash with fnm Node 24; multi-line source edits as perl scripts written with the Write tool (shell `${}` breaks heredocs); guard with `[ -s out ]` before copying a patched file back; dev server `npm run dev -- --port 5173`; the browser pane keeps console errors across page loads, so read the log tail in order.

## How to work

- Maor's standing approval (PROGRESS.md): proceed through the work without stopping to ask; plan each pass briefly in the log, keep per-milestone commits and checks.
- Keep changes small and in the files the task needs. Do not rewrite working code unasked. When something is unclear, ask one focused question or write the assumption in PROGRESS.md.
- Before ending: lint, test, build; update PROGRESS.md (what works, what is stubbed, known bugs); suggest a commit message if not committing.

## Story and content (Hazel's Grove)

The campaign, side stories, fun quests, Neopia, the Multiverse, the Atlas, Pixel's Arcade and the Learning Grove are script data in `src/content/` (readable screenplays in `script-book/`; backlog index in `docs/content-index.md`). Rules, in order of authority: `docs/canon.md` → `src/content/STORY-BIBLE.md` → the "Story and content" section of `docs/brief.md` → `src/content/STYLE.md` and `EDU-STYLE.md`. The short version:

- "A story about slow hands": warm, dry, specific, plain; grave only at the turning points; never fake-archaic. Narrator in present tense, second person. Lines under 160 characters, narration at most two sentences, everything readable on a phone.
- Audience is `all`, `main`, `teen` (13+) or `adult` (18+), behind a Mature content setting (Off by default). Only `all` reaches the Learning Grove, which has sprout (3–6) and reader (7–10) bands with a lesson in every scene and no quotes from the originals.
- No repeatable chores: no daily or weekly quests, timers or grind loops; every reward is one-time or unlimited. About a quarter of side stories change the campaign; fun quests never set campaign flags and never trigger in chapters 9–11. No song lyrics, ever. Copyrighted sources get at most three one-sentence quotes; public-domain text is quoted only once verified against the named edition.
- The Atlas, Arcade, Multiverse and Neopia read Grove state and never write it. Nubbins do not speak (the listed exceptions are in `docs/canon.md`).
- Validate every content change with `npx tsc --noEmit -p .`, `npx eslint src/content tests/tools` and `npx tsx tests/tools/content-check.ts --warnings` (`problems: 0`).

## Current plan (2026-10-15)

Two tracks, briefs in `plan.md`. **Track A, graphics and the 3D mode:** done are the five-creature roster in the species format, the face group on the Nubbin and the painted look on all five; grounding is verified in the browser (Part G1 done); then knee joints, petting and sleep, shape fixes, eye tracking, the Keeper, the Chao variants, the real 3D mode (title toggle, `render3d/`, worker sculpting, geometry cache), the device pass. **Track B, story and content:** the pack is scripted and checked through Atlas A11–A21 and moved into the repo (Task B0 done); next Atlas A22–A31 and A1–A10, the Arcade, fun packs Q66–Q95, lines LB and LK, Learning Grove versions, quote verification, adviser packets, the canon audit, and the engine milestones CV1–CV6 (campaign v2 and endings, Mature content setting, side-story engine, Learning Grove mode, language questlines, Atlas/Arcade/Multiverse saves, no-chores clean-up). Waiting on Maor: the daily-gift decision, seven fun-quest quotes, the expansion pick E1–E3 / S1–S4.
