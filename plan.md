# Plan: the remaining work, cut for subagents

Each part below is one brief you can hand to a Claude Code session on its own. Every brief
opens with context rules so the session stays near 50k tokens: CLAUDE.md (short), the
Status block of PROGRESS.md, the one doc the part needs, and line-range reads of the
named functions instead of whole files. The full brief lives in docs/brief.md and older
history in docs/progress-archive.md; neither is read whole. Parts marked **independent**
can run at the same time in separate worktrees; the others name what they wait for.

## Which model for which part

| Model | Use it for | Why |
| --- | --- | --- |
| **Fable 5.1** | Anything judged by eye against the references: shape, proportion, animation feel, the 3D mode's architecture, porting the Keeper. | It is the only tier that reliably looks at a render, compares it with the reference frames and changes the right numbers. |
| **Opus 5.5** | Engineering with a clear spec and a testable outcome: rigs, workers, caches, the title toggle, performance. | Strong and careful on code; does not need taste decisions. |
| **Sonnet 5.5** | Mechanical and data work: porting variants into specs from a template, docs, tests, the device checklist. | Fast and cheap; fine when the template exists. |
| **Haiku 5.5** | One-line chores: renaming, moving screenshots, formatting. | Not worth more. |

The stage for checking work is the dev server (`npm run dev -- --port 5173`) at
`http://localhost:5173/?aaa=1&creature=all&pose=idle`; single creatures with
`&creature=1..5&closeup&pose=idle|happy|walk|eat|sleep&turn=<degrees>`.

Common tail for every brief (already inside each prompt): run `npm run lint`, `npm test`
and `npm run build`; log the pass at line 12 of `PROGRESS.md`; put screenshots in
`docs/samples/` named by pass; commit with an imperative title and the line
`Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>`; push to `main`; report with
the screenshot names and anything left out.

---

## Part 1 — Verify and land grounding

**Model:** Opus 5.5. **Independent.** **Size:** half a day.

The contact shadow, slope-following body and grass parting are applied in `src/samples/species.ts`
and `src/samples/aaa-styles.ts` (the last commit on `main`) but were never rendered.

```
You are working in the Grove repo at C:\Users\God\Downloads\Test Des\Test Des (Git Bash, fnm Node 24). Read CLAUDE.md, the Status block of PROGRESS.md and docs/creature-improvements.md first.

Context rules: keep your context small. Read CLAUDE.md and the Status block at the top of PROGRESS.md, then only the doc this brief names. Never read a source file over 400 lines whole: grep for the function or field named here and read that line range (the "Where things are" table in CLAUDE.md maps names to files). Do not open creatures-legacy.ts or docs/progress-archive.md. Aim for under 50k tokens of context before your first edit.

Task: verify and finish the grounding pass (items 29, 30, 31 of docs/creature-improvements.md). The code is already applied but unverified: in src/samples/species.ts, `buildSpecies` adds a contact-shadow blob (`shadowBlob`, `spec.footprint`), a `ground` sampler on `Rigged` that tilts the root to the slope, and `root.userData.footprint`; in src/samples/aaa-styles.ts, `PUSHERS` feed `uPush` into the grass vertex shader and the stage sets `ground` on each creature.

Do this:
1. Start the dev server (`npm run dev -- --port 5173`) and open http://localhost:5173/?aaa=1&creature=all&pose=idle and &creature=3&closeup&pose=happy&turn=-30. Read the browser console tail in order (it keeps old errors across loads).
2. Fix whatever is wrong: a shader compile error, a blob that z-fights the ground, a tilt with the wrong sign (front higher must pitch the nose up), grass that moves the wrong way. The blob must sit under the body, lighten and shrink on the happy hop and under the hovering Wisp, and never show through the body.
3. Make the feet touch: on the single-creature stage the body must not float above or sink into the terrain at any `turn`.
4. Screenshots: docs/samples/ground-roster.jpg, ground-fennel.jpg, ground-wisp.jpg.
5. Run npm run lint, npm test, npm run build. Log the pass at line 12 of PROGRESS.md (what changed, what was wrong, screenshot names). Commit with an imperative title and the line "Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>", push to main.

Do not touch src/render or src/sim. Report the screenshot names and anything you left out.
```

## Part 2 — Knee joints and planted feet

**Model:** Fable 5.1 (rig design matters) or Opus 5.5 if the design below is enough.
**Waits for:** Part 1. **Size:** one day.

```
You are working in the Grove repo at C:\Users\God\Downloads\Test Des\Test Des. Read CLAUDE.md, the Status block of PROGRESS.md, docs/species-format.md and docs/creature-improvements.md (item 22) first.

Context rules: keep your context small. Read CLAUDE.md and the Status block at the top of PROGRESS.md, then only the doc this brief names. Never read a source file over 400 lines whole: grep for the function or field named here and read that line range (the "Where things are" table in CLAUDE.md maps names to files). Do not open creatures-legacy.ts or docs/progress-archive.md. Aim for under 50k tokens of context before your first edit.

Task: give the species format two-segment legs so walking plants the feet.

Design: a `PartSpec` may declare `joint: { pivot: Vector3; name: string }` for a child segment (the lower leg) hung from the upper one; `buildSpecies` sculpts the two segments separately and nests the lower pivot under the upper. Add bone names `kneeFL/FR/BL/BR` (quadruped), `kneeL/R` (biped) and `knee1L..knee4R` (spider). In the walk pose, drive hip and knee together so each foot follows an arc: lift on the forward swing, plant and stay still on the back swing, with the body moving forward by the stride (expose `strideLength` and `stridePeriod` on `Rigged` so the sim can match ground speed). Add a foot-contact check against `ground` so no foot sinks.

Port Fennel (src/samples/species-data.ts) and Bolder (src/samples/species-roster.ts) to jointed legs; Nubbin keeps stubs. Check on http://localhost:5173/?aaa=1&creature=3&closeup&pose=walk&turn=-60 and &creature=4: feet must not slide while on the ground.

Screenshots: docs/samples/walk-fennel.jpg, walk-bolder.jpg. Add the new fields to docs/species-format.md. Run lint, test, build; log at line 12 of PROGRESS.md; commit with the Co-Authored-By line; push. Report what you could not make stick.
```

## Part 3 — Petting, sleep, squash and stretch

**Model:** Opus 5.5. **Waits for:** Part 1 (shadow and ground). **Size:** one day.

```
You are working in the Grove repo at C:\Users\God\Downloads\Test Des\Test Des. Read CLAUDE.md, the Status block of PROGRESS.md, docs/species-format.md and docs/creature-improvements.md (items 23–28) first. The reference is the Palworld "All Pet Animations" video: a petted Pal turns to the Keeper, leans its head into the hand, shuts its eyes into ^ ^ arcs, wags, and hearts rise.

Context rules: keep your context small. Read CLAUDE.md and the Status block at the top of PROGRESS.md, then only the doc this brief names. Never read a source file over 400 lines whole: grep for the function or field named here and read that line range (the "Where things are" table in CLAUDE.md maps names to files). Do not open creatures-legacy.ts or docs/progress-archive.md. Aim for under 50k tokens of context before your first edit.

Task, in src/samples/species.ts:
1. A new pose `pet`: turn the head toward a `lookAt` point set on `Rigged`, lean the head in, use the happy expression (arc eyes), wag the tail, and spawn 6–8 soft heart sprites (a painted canvas texture, no assets) that rise and fade from above the head. Add `pet` to POSES and the stage's pose cycle.
2. Squash and stretch: scale the hips 1.06/0.94 at the top of the happy hop and 0.94/1.06 on landing; stretch the head forward on the eat chomp. Keep volumes plausible.
3. Breathing: a slow chest scale (1.5% at 0.25 Hz) under every pose, not only the hip bob.
4. Sleep: quadrupeds fold their legs and lower fully, bipeds curl; a "Zzz" of three painted glyph sprites drifts up every few seconds; breath slows.
5. Turn in place: when the stage changes `turn`, ease the facing over 0.4 s with a small lean instead of snapping (expose `face(yaw)` on Rigged).
6. Ear flicks at random intervals (seeded by species name, no Math.random in sim code; this is render code, so Math.random is allowed here) and a tail curl in happy.

Check every pose on all five at http://localhost:5173/?aaa=1&creature=all&pose=pet (and happy, sleep). Screenshots: docs/samples/pet-roster.jpg, sleep-roster.jpg, pet-nubbin.jpg. Document the new pose and fields in docs/species-format.md. Lint, test, build; log at line 12 of PROGRESS.md; commit with the Co-Authored-By line; push. Report.
```

## Part 4 — Eye tracking

**Model:** Sonnet 5.5. **Independent** (small, isolated). **Size:** two hours.

```
You are working in the Grove repo at C:\Users\God\Downloads\Test Des\Test Des. Read CLAUDE.md and docs/creature-improvements.md item 3 first.

Context rules: keep your context small. Read CLAUDE.md and the Status block at the top of PROGRESS.md, then only the doc this brief names. Never read a source file over 400 lines whole: grep for the function or field named here and read that line range (the "Where things are" table in CLAUDE.md maps names to files). Do not open creatures-legacy.ts or docs/progress-archive.md. Aim for under 50k tokens of context before your first edit.

Task: eyes that look. In src/samples/creatures.ts `eye()` returns an EyeRig; add `iris: THREE.Object3D` (the disc plus the catchlight in one group) to it. In src/samples/species.ts, add `lookAt?: THREE.Vector3` on `Rigged` (world space). Each frame, if set, slide each iris group a bounded amount (at most 0.22 of the eye radius) toward the look point projected into the eye's plane, with both eyes converging slightly, eased at about 6 per second. The catchlight does not move with the iris (it is a reflection), so keep it in place. When `lookAt` is unset, drift the iris with a slow idle wander. The stage (src/samples/aaa-styles.ts) sets `lookAt` to the camera position for the closeup and lineup views.

Check at http://localhost:5173/?aaa=1&creature=1&closeup&pose=idle&turn=30 — the Nubbin should look at the camera. Screenshot docs/samples/look-nubbin.jpg. Lint, test, build; log at line 12 of PROGRESS.md; commit with "Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"; push. Report.
```

## Part 5 — Shape fixes against the references

**Model:** Fable 5.1. **Waits for:** Part 2 (so legs are not reshaped twice). **Size:** one to two days.

```
You are working in the Grove repo at C:\Users\God\Downloads\Test Des\Test Des. Read CLAUDE.md, the Status block of PROGRESS.md, docs/species-format.md and docs/creature-improvements.md (items 9–15 and 32) first. Judge every change by eye against the Palworld references named in CLAUDE.md: one primary form, crisp secondary forms, toes and fingers, clumped fur on the outline, heads about 40% of body height on small species.

Context rules: keep your context small. Read CLAUDE.md and the Status block at the top of PROGRESS.md, then only the doc this brief names. Never read a source file over 400 lines whole: grep for the function or field named here and read that line range (the "Where things are" table in CLAUDE.md maps names to files). Do not open creatures-legacy.ts or docs/progress-archive.md. Aim for under 50k tokens of context before your first edit.

Task, in the species format (src/samples/species.ts, species-data.ts, species-roster.ts):
1. `digits`: a helper that stamps toes, fingers or mitts and paw pads from one line per limb. Give every creature feet with toes and hands or paws.
2. Per-form blend: let a primitive carry its own `blend` so ears, horns, the Mossling cap and the Bolder horns stand off the body while fur and bellies stay soft.
3. `tufts`: sculpted fur clumps (short cones along the fur direction) on the outline: cheek tufts, chest ruff, tail tip, crown. Shells stay for short underfur only.
4. Proportions: Fennel's head larger, eyes wide and low; Bolder scaled to the roster (pick a Grove unit; big by design only).
5. Bolder: hide the neck crease (collar primitive or blend the head into the torso and keep only the jaws on the head bone). Mossling: tilt the cap back and shrink it so the eyes always show from the stage camera. Wisp: restore the bright core with its own emissive material.

Check every creature at idle and happy from the front, 45° and the side (`&turn=`). Screenshots: docs/samples/shape-<name>.jpg for all five and shape-roster.jpg. Update docs/species-format.md for every new field. Lint, test, build; log at line 12 of PROGRESS.md; commit with the Co-Authored-By line; push. Report with a before/after note per creature.
```

## Part 6 — Crisp marks, species notes, format doc

**Model:** Sonnet 5.5. **Independent.** **Size:** two hours.

```
You are working in the Grove repo at C:\Users\God\Downloads\Test Des\Test Des. Read CLAUDE.md and docs/species-format.md first.

Context rules: keep your context small. Read CLAUDE.md and the Status block at the top of PROGRESS.md, then only the doc this brief names. Never read a source file over 400 lines whole: grep for the function or field named here and read that line range (the "Where things are" table in CLAUDE.md maps names to files). Do not open creatures-legacy.ts or docs/progress-archive.md. Aim for under 50k tokens of context before your first edit.

Task: (1) In src/samples/species.ts `markShade`, support `soft: 0` as a crisp anti-aliased edge (one vertex-spacing wide) for face patches, socks and belly splits; use it on Fennel's chest patch and nose. (2) Add `notes?: string` to SpeciesSpec and fill it for all five species with which reference frame each was tuned against (see PROGRESS.md sections from 2026-10-15). (3) Rewrite docs/species-format.md so every field in SpeciesSpec, PartSpec, Mark, Expression and the mouth has a row, with the default and one example, and the pose and expression tables are listed. Keep the prose plain.

Check Fennel at http://localhost:5173/?aaa=1&creature=3&closeup. Screenshot docs/samples/marks-fennel.jpg. Lint, test, build; log at line 12 of PROGRESS.md; commit with "Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"; push. Report.
```

## Part 7 — The Keeper in the species format

**Model:** Fable 5.1. **Waits for:** Parts 2 and 5. **Size:** one day.

```
You are working in the Grove repo at C:\Users\God\Downloads\Test Des\Test Des. Read CLAUDE.md, docs/species-format.md and src/samples/sculpted.ts (`sculptedKeeper`, the current hand-built Keeper) first.

Context rules: keep your context small. Read CLAUDE.md and the Status block at the top of PROGRESS.md, then only the doc this brief names. Never read a source file over 400 lines whole: grep for the function or field named here and read that line range (the "Where things are" table in CLAUDE.md maps names to files). Do not open creatures-legacy.ts or docs/progress-archive.md. Aim for under 50k tokens of context before your first edit.

Task: write KEEPER_SPEC (Sun and Moon variants as colour sets) in a new src/samples/keeper-spec.ts using the species format: biped with jointed legs and arms, hands with fingers, a head with the face rig, hair as sculpted tufts, the Keeper's outfit as marks and crisp colour splits, and poses idle, walk, pet (reaching out), carry (holding a creature), throw and sleep. Match the proportions of the existing `sculptedKeeper` (head about a third of the height, soft and friendly, no realism). Put the Keeper on the stage as `&creature=keeper` next to a Nubbin in the pet pose.

Screenshots: docs/samples/keeper-idle.jpg, keeper-pet.jpg, keeper-45.jpg. Document any new field in docs/species-format.md. Lint, test, build; log at line 12 of PROGRESS.md; commit with the Co-Authored-By line; push. Report.
```

## Part 8 — The Chao variant catalogue as specs

**Model:** Fable 5.1 for the first three templates (child, Sun adult, Moon adult), then Sonnet 5.5 for the rest from those templates. **Waits for:** Part 5. **Size:** two days, parallelisable by family.

```
You are working in the Grove repo at C:\Users\God\Downloads\Test Des\Test Des. Read CLAUDE.md, docs/species-format.md, src/sim/species.ts (the catalogue with its inspiration data) and PROGRESS.md's Chao variant catalogue section first. The in-game names are original; the inspiration field is data and is never shown.

Context rules: keep your context small. Read CLAUDE.md and the Status block at the top of PROGRESS.md, then only the doc this brief names. Never read a source file over 400 lines whole: grep for the function or field named here and read that line range (the "Where things are" table in CLAUDE.md maps names to files). Do not open creatures-legacy.ts or docs/progress-archive.md. Aim for under 50k tokens of context before your first edit.

Task: express the Nubbin variants as species specs derived from NUBBIN_SPEC in a new src/samples/nubbin-variants.ts: a `variant(base, overrides)` helper that changes colours, the crown and ball shape, wings, part slots (ears, tail, arms, back) and alignment hints without copying the whole spec. Cover [FAMILY: child forms | the 15 first evolutions | the 60 second evolutions | the three special forms | the colour variants]. Each variant is a few lines. Add a stage view `&creature=variant:<id>` and a sheet view `&creature=variants` that lines up a family.

Screenshots: docs/samples/variants-<family>.jpg. Lint, test, build; log at line 12 of PROGRESS.md; commit with "Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"; push. Report which variants are placeholders.
```

## Part 9 — The real 3D mode: architecture and title toggle

**Model:** Fable 5.1 for the design and first scene; Opus 5.5 can then carry the port.
**Waits for:** Part 1; benefits from Parts 2 and 3. **Size:** three to five days.

```
You are working in the Grove repo at C:\Users\God\Downloads\Test Des\Test Des. Read CLAUDE.md, the Status block of PROGRESS.md, src/render/world-view.ts (the WorldView interface the game drives), src/render/grove-scene.ts, src/ui/title.ts, src/config/tuning.ts (GROVE: the 96-unit field, hills, trees, rocks, river, landmarks, buildings) and src/samples/aaa-styles.ts first.

Context rules: keep your context small. Read CLAUDE.md and the Status block at the top of PROGRESS.md, then only the doc this brief names. Never read a source file over 400 lines whole: grep for the function or field named here and read that line range (the "Where things are" table in CLAUDE.md maps names to files). Do not open creatures-legacy.ts or docs/progress-archive.md. Aim for under 50k tokens of context before your first edit.

Task: make the full-3D mode real, additively.
1. A Graphics setting (Pixel | 3D) on the title screen and in Settings, stored in the save's settings; default Pixel. The pixel mode must be byte-for-byte unchanged in behaviour.
2. src/render3d/: a `Grove3dScene` that implements the same WorldView interface as the pixel scene and reads the same sim, so main.ts picks one or the other and nothing else changes. Build the environment from GROVE tuning (terrain heightfield from the hills, the pond, river and waterfall, paths, trees, buildings, lantern posts, the cave mouth) using the aaa-styles techniques (sky and PMREM, slope-blended terrain, instanced grass with PUSHERS, leaf-card trees, physical water, post stack with bloom only at golden hour). Time of day follows the sim clock.
3. Creatures and the Keeper come from the species format via a `CreaturePool` that builds each species once and clones; map sim behaviour states to poses (idle, walk, happy, pet, eat, sleep).
4. A Lakitu camera behind the Keeper with the pixel mode's 45° snaps and two zoom levels mapped to orbit and distance; picking by raycast against creature bounds.
5. Everything the pixel mode shows (emote balls, halos, sparkles, dungeon floors) gets a 3D counterpart or a stub that logs once; list the stubs in PROGRESS.md.

Keep the sim untouched. Check with `?free` in both modes. Screenshots: docs/samples/mode3d-noon.jpg, mode3d-golden.jpg, mode3d-title.jpg. Lint, test, build; log at line 12 of PROGRESS.md; commit per step with the Co-Authored-By line; push. Report the stub list and frame times on your machine.
```

## Part 10 — Sculpting off the main thread and a geometry cache

**Model:** Opus 5.5. **Waits for:** Part 9 (the pool exists). **Size:** one to two days.

```
You are working in the Grove repo at C:\Users\God\Downloads\Test Des\Test Des. Read CLAUDE.md, src/render/ground.ts and ground.worker.ts (the existing worker pattern), src/samples/sculpted.ts and src/samples/species.ts first.

Context rules: keep your context small. Read CLAUDE.md and the Status block at the top of PROGRESS.md, then only the doc this brief names. Never read a source file over 400 lines whole: grep for the function or field named here and read that line range (the "Where things are" table in CLAUDE.md maps names to files). Do not open creatures-legacy.ts or docs/progress-archive.md. Aim for under 50k tokens of context before your first edit.

Task: (1) Move `sculpt()` into a Web Worker: the worker takes a serialisable spec (primitives, blend, box, resolution, mark and shade parameters; functions such as furRule and colorRules must become data or named rules) and returns transferable position, normal, colour, glow and fur attribute buffers. (2) Cache baked geometry per species, variant and resolution in IndexedDB with a version key derived from the spec hash and the sculpt code version; wrap every storage call in try/catch and fall back to building. (3) Pick a resolution per device from a quick benchmark at first run (phone about 64, desktop 104) stored in the save's settings. (4) Show a progress bar while the pool builds.

Done when a fresh load of the 3D mode on a mid-range 2022 phone reaches play in under 4 s with 8 Nubbins and the Keeper, and a second load is under 1 s. Add tests for the spec serialiser and the cache key in tests/. Lint, test, build; log at line 12 of PROGRESS.md; commit with "Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"; push. Report the measured times.
```

## Part 11 — Device pass

**Model:** Sonnet 5.5. **Waits for:** Part 10. **Size:** half a day plus Maor's phones.

```
You are working in the Grove repo at C:\Users\God\Downloads\Test Des\Test Des. Read CLAUDE.md and the "Platform and accessibility" and "Acceptance checks" sections of docs/brief.md first.

Context rules: keep your context small. Read CLAUDE.md and the Status block at the top of PROGRESS.md, then only the doc this brief names. Never read a source file over 400 lines whole: grep for the function or field named here and read that line range (the "Where things are" table in CLAUDE.md maps names to files). Do not open creatures-legacy.ts or docs/progress-archive.md. Aim for under 50k tokens of context before your first edit.

Task: produce docs/device-pass.md: a checklist for iPhone Safari (browser and home screen), Android Chrome, and desktop Chrome, Safari and Firefox, in both graphics modes: frame rate with 8 Nubbins, portrait and landscape, one-thumb reach of every control, blocked storage, reduced motion, no console errors, the three save slots per mode. Automate what can be automated (a `?bench` flag that logs average frame time for 10 s to the debug panel, and a Playwright smoke test for load, hatch, pet, feed and reload in both modes). Fill in the desktop rows yourself; leave the phone rows for Maor with exact steps.

Lint, test, build; log at line 12 of PROGRESS.md; commit with the Co-Authored-By line; push. Report which rows you filled.
```

## Part 12 — Expansions and campaigns (waiting for Maor's pick)

**Model:** Fable 5.1. **Blocked** until Maor picks from E1–E3 and S1–S4 in PROGRESS.md.

```
You are working in the Grove repo at C:\Users\God\Downloads\Test Des\Test Des. Read CLAUDE.md and the Digimon-inspired list in PROGRESS.md (expansions E1–E3, campaigns S1–S4). Maor has picked [PICK]. Before writing code, give a short plan with the sim changes (new types, commands, events, save migration), the UI, the render needs in both modes, and the tests, then build it in milestone-sized commits with the usual checks and a PROGRESS.md section per milestone. Commit with "Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"; push. Report.

Context rules: keep your context small. Read CLAUDE.md and the Status block at the top of PROGRESS.md, then only the doc this brief names. Never read a source file over 400 lines whole: grep for the function or field named here and read that line range (the "Where things are" table in CLAUDE.md maps names to files). Do not open creatures-legacy.ts or docs/progress-archive.md. Aim for under 50k tokens of context before your first edit.
```

---

## Suggested running order

1. Part 1 now (Opus). Parts 4 and 6 at the same time (Sonnet), each in its own worktree.
2. Then Part 2 (Fable), with Part 3 (Opus) in parallel once Part 1 has landed.
3. Then Part 5 (Fable), then Part 7 and Part 8 in parallel.
4. Then Part 9 (Fable, then Opus), Part 10 (Opus), Part 11 (Sonnet).
5. Part 12 whenever the pick comes in.

Two writers never share files: give each parallel part its own worktree and merge in the
order above.
