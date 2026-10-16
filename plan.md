# Plan: the remaining work, in two tracks, cut for subagents

**Track A — Graphics and the 3D mode** (Parts G1–G12) and **Track B — Story and content**
(Tasks B0, B-S3…B-H). Each part is one brief you can hand to a Claude Code session on its own:
it names a model, says why, and has a prompt ready to paste. Track B's tasks come from the
content pack's own plan (written 2026-10-15 alongside the pack, now at `Stories/` in the repo)
and keep their numbering with a `B-` prefix, so the pack's docs and logs still line up.

## How to use this file

1. Start a fresh Claude Code session in the repo root for each part and paste its prompt into
   the main session. Where a prompt says to start N subagents with a model, the main session
   does that; where it says "milestone", the session plans first and waits for your approval.
2. Every brief opens with context rules so the session stays near 50k tokens: CLAUDE.md
   (short), the Status block of PROGRESS.md, the one doc the part needs, and grep plus
   line-range reads instead of whole files. The full brief is `docs/brief.md`, older history
   `docs/progress-archive.md`, and the two giant content outlines
   (`docs/grove-backlog-prompt.md`, `docs/more-stories.md`) are never read whole.
3. Parts marked **independent** can run at the same time in separate worktrees; the others name
   what they wait for. Two writers never share files. The running order at the end of this file
   says what can overlap across the two tracks.
4. A scripting subagent uses roughly 250k–400k tokens of its own, so a 10-subagent wave is
   about 3–4M. If a usage limit cuts a wave short, re-run the same prompt and tell it which ids
   are already done.

## Which model for which part

| Model | Use it for | Why |
| --- | --- | --- |
| **Fable 5.1** | Anything judged by eye or held whole in one mind: shape and animation feel against the references, the 3D mode's architecture, the Keeper, the campaign wiring (B-C1) and the whole-canon audit (B-V3). | The top tier: it looks at a render or a canon and changes the right thing. The most expensive. |
| **Opus 5.5** | Engineering with a clear spec and a testable outcome (rigs, workers, caches, settings, the engine milestones B-C3…C6), and writing at the campaign's quality bar (every Atlas, Arcade and Learning Grove scripting task, and the reviews). | Strong and careful; does not need taste decisions or the whole canon at once. |
| **Sonnet 5.5** | Well-specified work from a template: wiring, docs, tests, fun packs, edu drafts, quote verification with the web, the device checklist. | Fast and cheap when the template exists. |
| **Haiku 5.5** | Mechanical upkeep: script-book regeneration, status tables, moving screenshots. | Not worth more. |

Model names and prices change; check the current list before a wave. If Fable is not on your
plan, use Opus wherever this file says Fable.

## The checks

- **Track A (code):** `npm run lint`, `npm test`, `npm run build` before every push; the stage is
  `npm run dev -- --port 5173` at `http://localhost:5173/?aaa=1&creature=all&pose=idle`, single
  creatures with `&creature=1..5&closeup&pose=idle|happy|walk|eat|sleep&turn=<degrees>`.
- **Track B (content):** the three content checks (`npx tsc --noEmit -p .`,
  `npx eslint src/content tests/tools`, `npx tsx tests/tools/content-check.ts --warnings` with
  `problems: 0`), plus the Track A gate for anything that touches `src/sim/` or `src/ui/`.

Common tail for every brief (already inside each prompt): run the checks; log the pass at line
12 of `PROGRESS.md` (keep it under 150 lines); put screenshots in `docs/samples/` named by pass;
commit with an imperative title and the line
`Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>`; push to `main`; report with the
screenshot or log names and anything left out.

---

# Track A — Graphics and the 3D mode

Status: the five-creature roster is in the species format with anchored faces; the face group
is done on the Nubbin; the painted look is on all five; grounding is verified in the browser (Part G1 done).
Backlog against the references: `docs/creature-improvements.md`.

## Part G1 — Verify and land grounding

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

## Part G2 — Knee joints and planted feet

**Model:** Fable 5.1 (rig design matters) or Opus 5.5 if the design below is enough.
**Waits for:** Part G1. **Size:** one day.

```
You are working in the Grove repo at C:\Users\God\Downloads\Test Des\Test Des. Read CLAUDE.md, the Status block of PROGRESS.md, docs/species-format.md and docs/creature-improvements.md (item 22) first.

Context rules: keep your context small. Read CLAUDE.md and the Status block at the top of PROGRESS.md, then only the doc this brief names. Never read a source file over 400 lines whole: grep for the function or field named here and read that line range (the "Where things are" table in CLAUDE.md maps names to files). Do not open creatures-legacy.ts or docs/progress-archive.md. Aim for under 50k tokens of context before your first edit.

Task: give the species format two-segment legs so walking plants the feet.

Design: a `PartSpec` may declare `joint: { pivot: Vector3; name: string }` for a child segment (the lower leg) hung from the upper one; `buildSpecies` sculpts the two segments separately and nests the lower pivot under the upper. Add bone names `kneeFL/FR/BL/BR` (quadruped), `kneeL/R` (biped) and `knee1L..knee4R` (spider). In the walk pose, drive hip and knee together so each foot follows an arc: lift on the forward swing, plant and stay still on the back swing, with the body moving forward by the stride (expose `strideLength` and `stridePeriod` on `Rigged` so the sim can match ground speed). Add a foot-contact check against `ground` so no foot sinks.

Port Fennel (src/samples/species-data.ts) and Bolder (src/samples/species-roster.ts) to jointed legs; Nubbin keeps stubs. Check on http://localhost:5173/?aaa=1&creature=3&closeup&pose=walk&turn=-60 and &creature=4: feet must not slide while on the ground.

Screenshots: docs/samples/walk-fennel.jpg, walk-bolder.jpg. Add the new fields to docs/species-format.md. Run lint, test, build; log at line 12 of PROGRESS.md; commit with the Co-Authored-By line; push. Report what you could not make stick.
```

## Part G3 — Petting, sleep, squash and stretch

**Model:** Opus 5.5. **Waits for:** Part G1 (shadow and ground). **Size:** one day.

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

## Part G4 — Eye tracking

**Model:** Sonnet 5.5. **Independent** (small, isolated). **Size:** two hours.

```
You are working in the Grove repo at C:\Users\God\Downloads\Test Des\Test Des. Read CLAUDE.md and docs/creature-improvements.md item 3 first.

Context rules: keep your context small. Read CLAUDE.md and the Status block at the top of PROGRESS.md, then only the doc this brief names. Never read a source file over 400 lines whole: grep for the function or field named here and read that line range (the "Where things are" table in CLAUDE.md maps names to files). Do not open creatures-legacy.ts or docs/progress-archive.md. Aim for under 50k tokens of context before your first edit.

Task: eyes that look. In src/samples/creatures.ts `eye()` returns an EyeRig; add `iris: THREE.Object3D` (the disc plus the catchlight in one group) to it. In src/samples/species.ts, add `lookAt?: THREE.Vector3` on `Rigged` (world space). Each frame, if set, slide each iris group a bounded amount (at most 0.22 of the eye radius) toward the look point projected into the eye's plane, with both eyes converging slightly, eased at about 6 per second. The catchlight does not move with the iris (it is a reflection), so keep it in place. When `lookAt` is unset, drift the iris with a slow idle wander. The stage (src/samples/aaa-styles.ts) sets `lookAt` to the camera position for the closeup and lineup views.

Check at http://localhost:5173/?aaa=1&creature=1&closeup&pose=idle&turn=30 — the Nubbin should look at the camera. Screenshot docs/samples/look-nubbin.jpg. Lint, test, build; log at line 12 of PROGRESS.md; commit with "Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"; push. Report.
```

## Part G5 — Shape fixes against the references

**Model:** Fable 5.1. **Waits for:** Part G2 (so legs are not reshaped twice). **Size:** one to two days.

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

## Part G6 — Crisp marks, species notes, format doc

**Model:** Sonnet 5.5. **Independent.** **Size:** two hours.

```
You are working in the Grove repo at C:\Users\God\Downloads\Test Des\Test Des. Read CLAUDE.md and docs/species-format.md first.

Context rules: keep your context small. Read CLAUDE.md and the Status block at the top of PROGRESS.md, then only the doc this brief names. Never read a source file over 400 lines whole: grep for the function or field named here and read that line range (the "Where things are" table in CLAUDE.md maps names to files). Do not open creatures-legacy.ts or docs/progress-archive.md. Aim for under 50k tokens of context before your first edit.

Task: (1) In src/samples/species.ts `markShade`, support `soft: 0` as a crisp anti-aliased edge (one vertex-spacing wide) for face patches, socks and belly splits; use it on Fennel's chest patch and nose. (2) Add `notes?: string` to SpeciesSpec and fill it for all five species with which reference frame each was tuned against (see PROGRESS.md sections from 2026-10-15). (3) Rewrite docs/species-format.md so every field in SpeciesSpec, PartSpec, Mark, Expression and the mouth has a row, with the default and one example, and the pose and expression tables are listed. Keep the prose plain.

Check Fennel at http://localhost:5173/?aaa=1&creature=3&closeup. Screenshot docs/samples/marks-fennel.jpg. Lint, test, build; log at line 12 of PROGRESS.md; commit with "Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"; push. Report.
```

## Part G7 — The Keeper in the species format

**Model:** Fable 5.1. **Waits for:** Parts G2 and G5. **Size:** one day.

```
You are working in the Grove repo at C:\Users\God\Downloads\Test Des\Test Des. Read CLAUDE.md, docs/species-format.md and src/samples/sculpted.ts (`sculptedKeeper`, the current hand-built Keeper) first.

Context rules: keep your context small. Read CLAUDE.md and the Status block at the top of PROGRESS.md, then only the doc this brief names. Never read a source file over 400 lines whole: grep for the function or field named here and read that line range (the "Where things are" table in CLAUDE.md maps names to files). Do not open creatures-legacy.ts or docs/progress-archive.md. Aim for under 50k tokens of context before your first edit.

Task: write KEEPER_SPEC (Sun and Moon variants as colour sets) in a new src/samples/keeper-spec.ts using the species format: biped with jointed legs and arms, hands with fingers, a head with the face rig, hair as sculpted tufts, the Keeper's outfit as marks and crisp colour splits, and poses idle, walk, pet (reaching out), carry (holding a creature), throw and sleep. Match the proportions of the existing `sculptedKeeper` (head about a third of the height, soft and friendly, no realism). Put the Keeper on the stage as `&creature=keeper` next to a Nubbin in the pet pose.

Screenshots: docs/samples/keeper-idle.jpg, keeper-pet.jpg, keeper-45.jpg. Document any new field in docs/species-format.md. Lint, test, build; log at line 12 of PROGRESS.md; commit with the Co-Authored-By line; push. Report.
```

## Part G8 — The Chao variant catalogue as specs

**Model:** Fable 5.1 for the first three templates (child, Sun adult, Moon adult), then Sonnet 5.5 for the rest from those templates. **Waits for:** Part G5. **Size:** two days, parallelisable by family.

```
You are working in the Grove repo at C:\Users\God\Downloads\Test Des\Test Des. Read CLAUDE.md, docs/species-format.md, src/sim/species.ts (the catalogue with its inspiration data) and PROGRESS.md's Chao variant catalogue section first. The in-game names are original; the inspiration field is data and is never shown.

Context rules: keep your context small. Read CLAUDE.md and the Status block at the top of PROGRESS.md, then only the doc this brief names. Never read a source file over 400 lines whole: grep for the function or field named here and read that line range (the "Where things are" table in CLAUDE.md maps names to files). Do not open creatures-legacy.ts or docs/progress-archive.md. Aim for under 50k tokens of context before your first edit.

Task: express the Nubbin variants as species specs derived from NUBBIN_SPEC in a new src/samples/nubbin-variants.ts: a `variant(base, overrides)` helper that changes colours, the crown and ball shape, wings, part slots (ears, tail, arms, back) and alignment hints without copying the whole spec. Cover [FAMILY: child forms | the 15 first evolutions | the 60 second evolutions | the three special forms | the colour variants]. Each variant is a few lines. Add a stage view `&creature=variant:<id>` and a sheet view `&creature=variants` that lines up a family.

Screenshots: docs/samples/variants-<family>.jpg. Lint, test, build; log at line 12 of PROGRESS.md; commit with "Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"; push. Report which variants are placeholders.
```

## Part G8b — Match the "Chao World" line-up

**Model:** Fable 5.1 for the toon stage mode, the reference overlay and the first character; Sonnet 5.5 for the remaining six characters from that first one. **Waits for:** Part G8 (done 2026-10-16). **Size:** two to three days, one character at a time.

```
You are working in the Grove repo at C:\Users\God\Downloads\Test Des\Test Des. Read CLAUDE.md and the Status block of PROGRESS.md, then docs/species-format.md and the "Variants as diffs" section in it. The rules were changed on 2026-10-16: the creatures are matched directly against Maor's reference images, as close to identical as the code can get; only importing game files, model rips, sprite sheets or audio stays off limits. Names stay original.

Context rules: keep your context small. Never read a source file over 400 lines whole: grep for the names in CLAUDE.md's "Where things are" table and read that line range. Do not open creatures-legacy.ts or docs/progress-archive.md.

The target: Maor's "Chao World" line-up, the YouTube thumbnail https://i.ytimg.com/vi/qYg-Q32x2BY/maxresdefault.jpg (also linked from the tier list and the DeviantArt pages in PROGRESS.md's "Variants after the references" section). Save it to docs/reference/chao-world-lineup.jpg once, from the browser pane, and compare against it at every step. Seven figures, left to right: a blue one with big rounded quills, white gloves, red shoes with white stripes and mech-like lower legs; a rose-red one with huge round white ears, a white headband and a green ball; an orange one with aviator goggles, a white chest and twin tails; a purple-and-magenta one with a tall swept jester point, a pale mask and a chest star; a lime-green dragon with orange horns, claws and a tail; a black cat with pointed ears, white cheek tufts and chest, slanted eyes; a dark purple one covered in lilac crystal spikes. In our catalogue these are look-quills, look-echidna, look-fox, look-dream, eternal-neutral, look-shade and eternal-moon in src/samples/nubbin-variants-special.ts.

Task, in this order, each step committed on its own:

1. Toon stage mode. Add `&toon` to the AAA stage (src/samples/aaa-styles.ts, creature block near `const creatureParam`): creatures use a two-band toon ramp (MeshToonMaterial with a 3-step gradient map, or a ramp in the existing onBeforeCompile hook in surfaceMaterial in src/samples/creatures.ts) with flat saturated vertex colours and no triplanar grain, no sheen; a dark outline through an inverted-hull back-face pass (about 0.025 units, colour #1a1026) on every creature mesh including eyes and mouth; SSAO, bloom, depth of field, fog and the grade off; exposure 0.85; the sky and grass as they are. The eye rig draws a thick dark lash line (eyes.r × 0.22) and the mouth a solid dark line. `&toon` must not change anything when absent.

2. Reference overlay. `&ref=<path>` draws an image from docs/reference/ as a 45% overlay across the stage, and `&ref=...&refx=<n>` crops it to the n-th of seven figures (equal-width slices). `&creature=variant:<id>&toon&ref=chao-world-lineup.jpg&refx=1` is the tuning view.

3. The first character, look-quills, matched against slice 1 until it reads as the same figure: head about 48% of standing height (scale the head part and move the eyes, mouth, crown and ball with it; add a `headScale` override to variant() if that is simplest), eyes 1.35× with the ^ ^ closed shape in the happy pose, limbs shorter and thicker, shoes a third larger with the white stripe as geometry (a flattened ellipsoid), mech lower legs as grey capsules with a red ring, the quills as five rounded cones with a dark inner shade mark, the peach muzzle as a raised ellipsoid, white gloves as spheres with a cuff. Flat colours: body #2c58e0, belly #f5c99a, shoes #d8302a, gloves #ffffff. Take docs/samples/match-quills.jpg as a side-by-side (stage left, reference slice right; a `&split` flag that renders the stage into the left half and the reference into the right half is the easiest way).

4. The other six, one commit each, same loop: look-echidna (slice 2), look-fox (3), look-dream (4), eternal-neutral (5), look-shade (6), eternal-moon (7). Reuse the helpers from step 3; add new ones (roundEar sizes, goggles with a glass highlight, crystal spikes with glow) to the special file, never to the templates.

5. Group shot. `&creature=variants&family=special&filter=look&toon` plus the two Eternals in the line-up order of the reference, camera at eye level, taken as docs/samples/match-lineup.jpg next to the reference.

Checks before each commit: npx prettier --write on touched files, npm run lint, npm test, npm run build; no console errors on the stage. Add the new fields (headScale, any toon flag on SurfaceOpts) to docs/species-format.md. Log each step at the top of the pass list in PROGRESS.md (keep the file under 150 lines by moving the oldest section to docs/progress-archive.md). Commit with "Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>" and push after each step. Report, per character, what still differs from the reference and why.
```

## Part G9 — The real 3D mode: architecture and title toggle

**Model:** Fable 5.1 for the design and first scene; Opus 5.5 can then carry the port.
**Waits for:** Part G1; benefits from Parts G2 and G3. **Size:** three to five days.

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

## Part G10 — Sculpting off the main thread and a geometry cache

**Model:** Opus 5.5. **Waits for:** Part G9 (the pool exists). **Size:** one to two days.

```
You are working in the Grove repo at C:\Users\God\Downloads\Test Des\Test Des. Read CLAUDE.md, src/render/ground.ts and ground.worker.ts (the existing worker pattern), src/samples/sculpted.ts and src/samples/species.ts first.

Context rules: keep your context small. Read CLAUDE.md and the Status block at the top of PROGRESS.md, then only the doc this brief names. Never read a source file over 400 lines whole: grep for the function or field named here and read that line range (the "Where things are" table in CLAUDE.md maps names to files). Do not open creatures-legacy.ts or docs/progress-archive.md. Aim for under 50k tokens of context before your first edit.

Task: (1) Move `sculpt()` into a Web Worker: the worker takes a serialisable spec (primitives, blend, box, resolution, mark and shade parameters; functions such as furRule and colorRules must become data or named rules) and returns transferable position, normal, colour, glow and fur attribute buffers. (2) Cache baked geometry per species, variant and resolution in IndexedDB with a version key derived from the spec hash and the sculpt code version; wrap every storage call in try/catch and fall back to building. (3) Pick a resolution per device from a quick benchmark at first run (phone about 64, desktop 104) stored in the save's settings. (4) Show a progress bar while the pool builds.

Done when a fresh load of the 3D mode on a mid-range 2022 phone reaches play in under 4 s with 8 Nubbins and the Keeper, and a second load is under 1 s. Add tests for the spec serialiser and the cache key in tests/. Lint, test, build; log at line 12 of PROGRESS.md; commit with "Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"; push. Report the measured times.
```

## Part G11 — Device pass

**Model:** Sonnet 5.5. **Waits for:** Part G10. **Size:** half a day plus Maor's phones.

```
You are working in the Grove repo at C:\Users\God\Downloads\Test Des\Test Des. Read CLAUDE.md and the "Platform and accessibility" and "Acceptance checks" sections of docs/brief.md first.

Context rules: keep your context small. Read CLAUDE.md and the Status block at the top of PROGRESS.md, then only the doc this brief names. Never read a source file over 400 lines whole: grep for the function or field named here and read that line range (the "Where things are" table in CLAUDE.md maps names to files). Do not open creatures-legacy.ts or docs/progress-archive.md. Aim for under 50k tokens of context before your first edit.

Task: produce docs/device-pass.md: a checklist for iPhone Safari (browser and home screen), Android Chrome, and desktop Chrome, Safari and Firefox, in both graphics modes: frame rate with 8 Nubbins, portrait and landscape, one-thumb reach of every control, blocked storage, reduced motion, no console errors, the three save slots per mode. Automate what can be automated (a `?bench` flag that logs average frame time for 10 s to the debug panel, and a Playwright smoke test for load, hatch, pet, feed and reload in both modes). Fill in the desktop rows yourself; leave the phone rows for Maor with exact steps.

Lint, test, build; log at line 12 of PROGRESS.md; commit with the Co-Authored-By line; push. Report which rows you filled.
```

## Part G12 — Expansions and campaigns (waiting for Maor's pick)

**Model:** Fable 5.1. **Blocked** until Maor picks from E1–E3 and S1–S4 in PROGRESS.md.

```
You are working in the Grove repo at C:\Users\God\Downloads\Test Des\Test Des. Read CLAUDE.md and the Digimon-inspired list in PROGRESS.md (expansions E1–E3, campaigns S1–S4). Maor has picked [PICK]. Before writing code, give a short plan with the sim changes (new types, commands, events, save migration), the UI, the render needs in both modes, and the tests, then build it in milestone-sized commits with the usual checks and a PROGRESS.md section per milestone. Commit with "Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"; push. Report.

Context rules: keep your context small. Read CLAUDE.md and the Status block at the top of PROGRESS.md, then only the doc this brief names. Never read a source file over 400 lines whole: grep for the function or field named here and read that line range (the "Where things are" table in CLAUDE.md maps names to files). Do not open creatures-legacy.ts or docs/progress-archive.md. Aim for under 50k tokens of context before your first edit.
```

---


---

# Track B — Story and content (Hazel's Grove)

The content pack (campaign v2, side stories S1–S31, fun quests, Neopia, the Multiverse, the
Learning Grove bands, the language questlines, Atlas A11–A21, the checker and the script book)
was written in its own session and now sits inside the repo at `Stories/`. Task B0 moves it into
place. Its canon and rules are summarised in CLAUDE.md ("Story and content") and in full in
`docs/brief.md`; the order of authority is `docs/canon.md` → `src/content/STORY-BIBLE.md` →
the CLAUDE.md section → `STYLE.md` and `EDU-STYLE.md`.

**The three content checks** (all must pass after every content task):

```
npx tsc --noEmit -p .
npx eslint src/content tests/tools
npx tsx tests/tools/content-check.ts --warnings    # must print "problems": 0
```

**Context rules for this track.** `docs/grove-backlog-prompt.md` (700 KB) and
`docs/more-stories.md` (470 KB) are never read whole: grep for the id or the "CV" heading and read
that range. A scripting subagent uses roughly 250k–400k tokens of its own; the main session that
starts them stays small if it only reads the task's section of this file.

**After every scripting task, run B-W (wiring), then B-R (review).** Do not start the next wave
until B-R reports 0 must-fix items and the checks are clean. Engine tasks (B-C1…C7) are
milestones: plan first and wait for Maor's approval, as the pack's authors specified.

## Where the content stands (2026-10-15)

- **Scripted and checked:** campaign v2 (12 chapters, 8 endings); side stories S1–S31; fun quests Q1–Q65; Neopia; the Multiverse (93 storylines, 6 endgames); readers and results; Atlas A11–A21; Learning Grove versions of the campaign, S1–S22 and the Python, Bean and Avatar quests; the Hebrew and Japanese questlines; the full review and fix pass (`docs/fix-changelog.md`).
- **Outlined, not scripted:** Atlas A1–A10 (`docs/atlas.md`); A22–A31, Arcade PA1–PA5, fun packs Q66–Q95, lines LB and LK (`docs/more-stories.md`).
- **Not in the engine yet:** CV1–CV6 in `docs/grove-backlog-prompt.md`.
- **Open decisions for Maor:** seven fun-quest quotes to verify against the shows; what the once-a-day gifts in `sim/daily.ts` and `sim/neighbourhood.ts` become under the no-chores rule; the stray copies of the pack's `CLAUDE.md` and `plan.md` one folder up (`C:\Users\God\Downloads\Test Des\`) can be deleted, since this file and CLAUDE.md already fold them in.

## Task list

| ID | Task | Model | After | Size |
| --- | --- | --- | --- | --- |
| B0 | Move the pack into the repo and run the checks | Opus (main session) | none | small |
| B-S3 | Script Atlas A22–A31 | Opus ×10 | B0 | large |
| B-S4 | Script Atlas A1–A10 | Opus ×10 | B-S3 + R | large |
| B-S5a | Script Arcade PA1–PA5 and lines LB, LK | Opus ×7 | B-S4 + R | large |
| B-S5b | Script fun packs Q66–Q95 | Sonnet ×3 | B-S4 + R | medium |
| B-W | Wire new files (index, checker, edu registry, script book) | Sonnet | each S/E task | small |
| B-R | Review a wave, fix mode | Opus | each W | medium |
| B-E1 | Learning Grove versions of S24–S31 | Opus ×8 | B0 | large |
| B-E2 | Learning Grove versions of the `all` Atlas and Arcade pages | Sonnet ×N, then Opus R | the matching S task | large |
| B-V1 | Verify the public-domain quotes | Sonnet (web) | any | medium |
| B-V2 | Cultural-adviser review packets | Sonnet | after scripting | small |
| B-V3 | Whole-canon continuity audit | Fable | all S and E | large |
| B-C1 | Engine: campaign v2, endings, chapter holds (CV1 + campaign half of CV6) | Fable or Opus | B0 | large |
| B-C2 | Engine: audiences and the Mature content setting | Sonnet | B0 | small |
| B-C3 | Engine: side-story and fun-quest triggers, variants, line swaps | Opus | B-C1 | large |
| B-C4 | Engine: the Learning Grove mode (CV2) | Opus | B-C1 | large |
| B-C5 | Engine: the language questlines (CV3) | Opus | B-C4 | medium |
| B-C6 | Engine: Atlas, Arcade and Multiverse saves; cross-save reads (CV4, CV5) | Opus | B-C1 | large |
| B-C7 | Engine: no-chores clean-up | Sonnet | Maor's decision | small |
| B-H | Housekeeping (script book, PROGRESS.md status) | Haiku | anytime | small |

---

## Task B0. Move the pack into the repo

**Model:** Opus, as the main session. **Independent.**

```text
You are working in the Grove repo at C:\Users\God\Downloads\Test Des\Test Des (Git Bash, fnm Node 24). Read CLAUDE.md and the Status block of PROGRESS.md. Do not read docs/grove-backlog-prompt.md or docs/more-stories.md whole at any point; grep them.

The story content pack sits at Stories/ inside the repo. Move it into place:
1. git mv Stories/src/content → src/content (new folder; nothing exists there yet).
2. git mv Stories/tests/tools/content-check.ts and Stories/tests/tools/script-book.ts → tests/tools/. Every other file in Stories/tests/tools is a copy of one already in tests/tools: diff each; if identical, drop the copy; if different, keep ours and list the difference for Maor.
3. git mv Stories/script-book → script-book, Stories/voiceover → voiceover, Stories/docs/* → docs/ (atlas.md, canon.md, more-stories.md, fix-changelog.md, grove-backlog-prompt.md, briefs/, logs/). None of these names exist in docs/ yet; if one does, stop and report.
4. Do NOT copy Stories/CLAUDE.md or Stories/plan.md: their content is already folded into CLAUDE.md, docs/brief.md and plan.md. Delete the Stories/ folder once empty.
5. Follow docs/grove-backlog-prompt.md "What to do" steps 2–5 only where they are not already done (the PROGRESS.md backlog index and the CLAUDE.md no-chores rule; check first, do not duplicate). Keep PROGRESS.md under 150 lines by putting the long index in docs/content-index.md and linking it from the Status block.
6. Run the three content checks and npm run lint, npm test, npm run build. The pack type-checked against commit 97b38a7, so fix only what the move or newer repo code broke; report anything else.
Commit with an imperative title and "Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>", push to main, and report the check results and anything you left for Maor.
```

## Task B-S3. Script Atlas pages A22–A31

**Model:** Opus, 10 subagents in parallel. **After:** B0.

```text
This is a content task, not a milestone, so no plan approval is needed. Start 10 subagents in
parallel, each with model "opus". Give each one this prompt, filling in <ID>, <FILE>, <NAME> and
<EXTRAS> from the table below:

---
Context rules: read CLAUDE.md ("Story and content"), docs/canon.md and docs/briefs/script.md. Find your outline in docs/more-stories.md by grepping for your id; never read that file whole.
Follow docs/briefs/script.md exactly. Your line is <ID>, an Atlas page; its outline is in
docs/more-stories.md (find the section by its id).
File: src/content/<FILE>   NAME: <NAME>
<EXTRAS>
---

| ID | FILE | NAME | EXTRAS |
| A22 The Candle (Encanto) | atlas-a22.ts | ATLAS_A22 | It reads the Long-Grass lantern state (flickering, dark, lit, warm, and the kept-stone line) through variants, and describes a read-only longGrassLantern() helper under SIM. Pedro's death is told, not shown, and the war is never named. Copyrighted: at most 3 quotes, from the outline. No lyrics. Name the Colombian advisers needed. |
| A23 Remember Who You Are (The Lion King) | atlas-a23.ts | ATLAS_A23 | You are with Zazu during the stampede, so the death is never seen, and Scar's end is offscreen. Flag the Swahili words for an East African adviser. Copyrighted: at most 3 quotes. No lyrics; "hakuna matata" appears only as the everyday phrase. |
| A24 The Law of the Jungle (Kipling) | atlas-a24.ts | ATLAS_A24 | Public domain: lift the outline's verified passages only. "The White Seal" is a coda. Keep the care notes on Kipling's imperialism and on the Unangax̂ seal hunters. |
| A25 The Nothing (The Neverending Story) | atlas-a25.ts | ATLAS_A25 | Covers both halves of the novel. It reads s6Done (Ash's true name, her three whistled notes). Copyrighted: at most the 2 lines in Ende's German with our own English, as in the outline. |
| A26 The Wall of Uruk (Gilgamesh) | atlas-a26.ts | ATLAS_A26 | Lifted text only as the outline allows (Thompson 1928, with its copyright caveat). Moss joins only after chapter 4, and never after the Moss Sleeps ending. Audience 'all'; stage Humbaba and the Bull of Heaven gently. |
| A27 The White-Haired Prince (Zal and the Simurgh) | atlas-a27.ts | ATLAS_A27 | Lift from Zimmern 1883 only where verified. Keep the albinism care note; Persian heritage is treated with respect. |
| A28 The Box of Stories (Anansi) | atlas-a28.ts | ATLAS_A28 | Rattray 1930 passages only where verified; retell the Sky-god story. Wisp and Anansi trade, badly, if wisp is spared. Akan advisers. |
| A29 The Honmoon (KPop Demon Hunters) | atlas-a29.ts | ATLAS_A29 | No quotes, no lyrics and no song titles at all. It reads Sable's trust stage. Korean cultural care: jeoseung saja, gat, and the folk-painting tiger and magpie. |
| A30 The Word on the Brow (the Golem of Prague) | atlas-a30.ts | ATLAS_A30 | Uses the same letters as the Hebrew questline LH2 (emet אמת, met מת). Give both versions of the legend (the word on the brow, the Name in the mouth). Lift only the verified Jewish Encyclopedia 1904–06 and JPS 1917 passages. Treat Rabbi Judah Loew with respect; Jewish advisers. |
| A31 The Hero Twins (Popol Vuh) | atlas-a31.ts | ATLAS_A31 | Spence 1908 passages only where verified. It reads s3Done (the Sun and Moon ribbons). K'iche' Maya advisers decide which twin becomes the Sun; present it as a living tradition. |

When all 10 have finished, list each subagent's 3-line reply and the log path. Then run the three
checks and report them. Don't fix other agents' files.
```

## Task B-S4. Script Atlas pages A1–A10 (Part L)

**Model:** Opus, 10 subagents in parallel. **After:** B-S3 + R. Three pages are `teen`.

```text
This is a content task, not a milestone. Start 10 subagents in parallel, each with model "opus".
Give each one this prompt, filling in the placeholders from the table:

---
Context rules: read CLAUDE.md ("Story and content"), docs/canon.md and docs/briefs/script.md. Find your outline in docs/atlas.md by grepping for your id.
Follow docs/briefs/script.md exactly. Your line is <ID>, an Atlas page from Part L; its outline is
in docs/atlas.md. Part L outlines are shorter than Part M's: expand each quest into concrete
scenes. Keep its quest list, signature choice, rewards and care notes. Every source here is either
copyrighted or uses unverified translations, so don't lift text verbatim: write original dialogue,
with at most 3 one-sentence quotes for a copyrighted source.
File: src/content/<FILE>   NAME: <NAME>   Audience: <AUD>
<EXTRAS>
---

| ID | FILE | NAME | AUD | EXTRAS |
| A1 The Brothers' Bargain (Fullmetal Alchemist) | atlas-a01.ts | ATLAS_A01 | teen | Tucker's chimera is offscreen and implied. Combat isn't graphic. Follow Brotherhood's episode order. |
| A2 The Monkey and the Monk (Journey to the West) | atlas-a02.ts | ATLAS_A02 | all | Follow the novel's order as fixed in docs/atlas.md. The Buddha and Guanyin are wise and kind, never mocked. The cloud-somersault reward is unlimited (no timer). |
| A3 Forty-Nine Days (Along with the Gods) | atlas-a03.ts | ATLAS_A03 | teen | Suicide is only ever "the worst night": never depicted or explained. Korean afterlife advisers. |
| A4 The Waterfall Prince (Baahubali) | atlas-a04.ts | ATLAS_A04 | teen | Heroic, not graphic. Bhallaladeva's end is offscreen. Present the kingdoms as the films' fiction. Indian advisers; mind the Telugu and Tamil versions. |
| A5 The Lion of Mali (Sundiata) | atlas-a05.ts | ATLAS_A05 | all | The griot frame (Balla Fasséké). Give versions where the tellings differ. West African advisers. |
| A6 Seven Voyages (Sinbad) | atlas-a06.ts | ATLAS_A06 | all | The ivory is a real choice, and every ending lets the elephants be. Baghdad is a city of learning. Soften voyages 3 and 4. Arab and Persian heritage advisers. |
| A7 The Marigold Bridge (Coco) | atlas-a07.ts | ATLAS_A07 | all | No lyrics; any songs are original. Día de Muertos is a living tradition, with Mexican consultants. The ofrenda holds your Nubbins' photos; the Remembering Tree (canon 35) holds their stories. |
| A8 The Twelve Tasks (Asterix) | atlas-a08.ts | ATLAS_A08 | all | Use the verified task order in docs/atlas.md. The national jokes stay affectionate. Permit A38 is the centrepiece. |
| A9 The Comet (Comet in Moominland) | atlas-a09.ts | ATLAS_A09 | all | Verified details: the Hemulen hunts butterflies; the octopus (the Snork Maiden rescues Moomintroll); the tornado and the Hemulen's dress used as a glider; the comet is due on 7 October at 8:42 in the evening. |
| A10 The Heart of the Island (Moana) | atlas-a10.ts | ATLAS_A10 | all | No film songs; Gramma's song is original. Maui is a revered figure. Pacific Islander advisers. Your Nubbin stows away on the canoe. |

When all 10 have finished, report each reply and log path, then run the three checks.
```

## Task B-S5a. Script Pixel's Arcade PA1–PA5 and lines LB and LK

**Model:** Opus, 7 subagents. **After:** B-S4 + R.

```text
This is a content task, not a milestone. Start 7 subagents in parallel, each with model "opus".
Give each one this prompt, filling in the placeholders from the table:

---
Context rules: read CLAUDE.md ("Story and content"), docs/canon.md, docs/briefs/script.md and, for LB and LK, docs/briefs/edu-new.md and src/content/EDU-STYLE.md. Find your outline and "Pixel's Arcade (the frame)" in docs/more-stories.md by grep.
Follow docs/briefs/script.md exactly. Your line is <ID>; its outline is in docs/more-stories.md,
and Pixel's Arcade frame is under "Pixel's Arcade (the frame)". Pixel is she/her and sits at the
controls as player two. Cartridges never write Grove flags.
File: src/content/<FILE>   NAME: <NAME>   Audience: <AUD>
<EXTRAS>
---

| ID | FILE | NAME | AUD | EXTRAS |
| PA1 The Chao Altar (Sonic Adventure) | arcade-pa1.ts | ARCADE_PA1 | main | It reads cinder. At most 2 quotes (Tikal's prayer), marked for checking against the English script. Sega rights note. |
| PA2 The Clone Island (Pokémon: The First Movie) | arcade-pa2.ts | ARCADE_PA2 | all | It reads s7Done (Byte watches). At most 3 quotes. |
| PA3 The Hollow Kingdom (Hollow Knight) | arcade-pa3.ts | ARCADE_PA3 | all | 12 grubs. At most 3 quotes. |
| PA4 Mercy (Undertale) | arcade-pa4.ts | ARCADE_PA4 | all | Sparing everyone is the only path; the kill-everyone route doesn't exist. It reads wisp. At most 3 quotes. |
| PA5 The Hundred-Year Sleep (Breath of the Wild) | arcade-pa5.ts | ARCADE_PA5 | all | The thirteenth memory plays only if you hunted every memory. At most 3 quotes. |
| LB1–LB12 Play (inspired by Bluey) | lines-lb.ts | LINE_LB | all | An original family, the Larkins. Never quote Bluey or use its characters. Write the main quests AND both Learning Grove bands, following docs/briefs/edu-new.md for the edu part: lesson-first, using the approved standards in EDU-STYLE.md. |
| LK1–LK10 Mouse-Deer (Sang Kancil) | lines-lk.ts | LINE_LK | all | Shadow-puppet storytellers, one Malaysian and one Indonesian. Counting crocodiles in Malay and Indonesian is the maths centrepiece. Write the main quests AND both bands, as for LB. Malay and Indonesian cultural care. |

When all 7 have finished, report each reply and log path, then run the three checks.
```

## Task B-S5b. Script the fun packs Q66–Q95

**Model:** Sonnet, 3 subagents. **After:** B-S4 + R.

```text
This is a content task, not a milestone. Start 3 subagents in parallel, each with model "sonnet".
Give each one this prompt, filling in the placeholders:

---
Context rules: read CLAUDE.md ("Story and content"), docs/briefs/script.md ("Fun packs") and src/content/quests-python.ts as the format model. Find your pack's outline in docs/more-stories.md by grep.
Follow docs/briefs/script.md exactly (the "Fun packs" format). Your pack is <PACK>; its outline is in
docs/more-stories.md. Each Q is one Quest with 1–3 steps, a complete scene, rewards and childLines
for every quoted line. The trigger is never daily and "never during Chapters 9–11". Packs never
set or need any flag. Public-domain quotes: only the ones the outline marks as verified, word for word.
File: src/content/<FILE>   NAME: <NAME>
---

| PACK | FILE | NAME |
| Q66–Q75 Down the Rabbit-Hole (Alice) | quests-alice.ts | QUESTS_ALICE |
| Q76–Q85 The Hound of the Grove (Sherlock Holmes) | quests-holmes.ts | QUESTS_HOLMES |
| Q86–Q95 The Hodja's Donkey (Nasreddin Hodja) | quests-hodja.ts | QUESTS_HODJA |

Rename Q5's "White Rabbit critter" if it clashes with Carroll's White Rabbit, and say so.
```

## Task B-W. Wire new files in

**Model:** Sonnet. Run after every S and E task.

```text
Content task, not a milestone. Use one subagent with model "sonnet". Context rules: read CLAUDE.md ("Story and content"); open only src/content/index.ts, src/content/edu.ts, tests/tools/content-check.ts, tests/tools/script-book.ts and the new files' export lists (grep "^export const").

Wire every new file in src/content/ that isn't yet exported from src/content/index.ts. Find them by
comparing the files with index.ts. For each one:

1. index.ts: export every exported const the file has (the main array, _VARIANTS, _FLAGS,
   _CHECKS, and any _EDU or edu arrays).
2. tests/tools/content-check.ts:
   - Add each storyline's main Quest[] to the `packs` map, with a short key (a22, pa1, alice…).
   - Add its _VARIANTS to NEW_VARIANTS.
   - Once a storyline has Learning Grove files (edu-<id>-*.ts, or LB/LK's built-in edu), add its
     pack key to `eduPacks` so coverage is enforced, and add its variants to `mainScenes`
     alongside the others.
3. src/content/edu.ts: import and add any new edu arrays to EDU_QUESTS[band], and their variants
   to EDU_VARIANTS[band].
4. tests/tools/script-book.ts: add a chapter per new storyline, numbered after the existing ones
   (atlas, arcade, fun packs, lines), and a matching edu section if it has one. Then regenerate:
   npx tsx tests/tools/script-book.ts script-book

Don't change any storyline's content. Run the three checks. If content-check reports problems,
list them grouped by file. Fix only wiring mistakes; leave content problems for Task B-R.
```

## Task B-R. Review a wave (fix mode)

**Model:** Opus.

```text
Content task, not a milestone. Use one subagent with model "opus". Context rules: read CLAUDE.md ("Story and content"), docs/canon.md and docs/briefs/review.md; open only the files listed. Follow docs/briefs/review.md in "fix" mode.

Batch name: <wave, e.g. wave3>. Files to review:
<list the new src/content files from the last S or E task>

When it's done, show me the counts, the "For Maor" items and the three check results.
```

## Task B-E1. Learning Grove versions of S24–S31

**Model:** Opus, 8 subagents. **After:** B0. S23 is `main`, so it gets none.

```text
Content task, not a milestone. Start 8 subagents in parallel, each with model "opus". Give each one
this prompt, with <ID> = s24 … s31 and <FILE> = side-stories-s24.ts … side-stories-s31.ts:

---
Context rules: read CLAUDE.md ("Story and content"), docs/canon.md, docs/briefs/edu-new.md, src/content/EDU-STYLE.md and your script file. Find your outline in docs/more-stories.md by grep.
Follow docs/briefs/edu-new.md exactly. Your storyline is <ID>; its script is src/content/<FILE> and
its outline is in docs/more-stories.md. Watch the canon closely: pronouns, Moss speaking only from
chapter 4, Linnet in S26, and Nubbins never speaking.
---

When all 8 have finished, run Task B-W, then Task B-R in fix mode with batch name "edu-s24-s31".
```

## Task B-E2. Learning Grove versions of the `all` Atlas and Arcade pages

**Model:** Sonnet drafts, then Opus reviews (B-R). **After:** the matching S task.

```text
Content task, not a milestone. Find every Atlas or Arcade file in src/content (atlas-*.ts and
arcade-*.ts) that has audience 'all' and no edu-<id>-*.ts files yet. Start one subagent per
storyline, with model "sonnet", at most 10 at a time. Give each one this prompt:

---
Context rules: read CLAUDE.md ("Story and content"), docs/briefs/edu-new.md, src/content/EDU-STYLE.md and your script file. Find the outline's "Learning Grove version" list in docs/atlas.md or docs/more-stories.md by grep.
Follow docs/briefs/edu-new.md exactly. Your storyline is <ID>; its script is src/content/<FILE>,
and its outline (with its "Learning Grove version" list) is in docs/atlas.md or
docs/more-stories.md. Teach what the outline lists, blended into the story. Keep the cultural
care notes.
---

After each batch, run Task B-W, then Task B-R (fix mode) with model opus.
```

## Task B-V1. Verify the public-domain quotes

**Model:** Sonnet, with web access. **Independent.**

```text
Use one subagent with model "sonnet" and web access. Context rules: grep docs/atlas.md and docs/more-stories.md for "[unverified]" and "recheck" and read only those passages; never read either file whole.

In docs/atlas.md and docs/more-stories.md, find every lifted-text passage marked [unverified] or
"recheck". For each one:
1. Find the named edition on Project Gutenberg, Standard Ebooks or Wikisource.
2. Fix any wording or punctuation, and mark it verified (with the URL), or not found.

Then, in each matching script (src/content/*.ts), where a verified passage was paraphrased, you
may swap the exact text back in. Add childLines for 'all' quests, and keep each line under 160
characters (split it if needed).

Also check these seven fun-quest quotes against reliable transcripts. Report them only; don't
change them:
- "It's only wafer-thin." (Q11)
- "Teddy!" (Q21)
- "Wildcard, bitches!" (Q31)
- "I am a golden god!" (Q35)
- "Can I offer you a nice egg in this trying time?" (Q36)
- "Bird law in this country is not governed by reason." (Q38)
- "There is no Carol in HR!" (Q42)
- and the Q15 Cheese Shop line

Run the three checks. Write docs/logs/quotes.md.
```

## Task B-V2. Cultural-adviser review packets

**Model:** Sonnet. **After:** scripting.

```text
Use one subagent with model "sonnet". Context rules: read CLAUDE.md ("Story and content"); for each storyline, grep its outline's care notes rather than reading the outline files whole.

For each storyline whose outline names advisers (A2–A7, A10, A12, A17–A20, A22–A23, A27–A31, LK and
any others you find), write docs/advisers/<id>.md:
- a half-page summary of the storyline;
- every scene that touches the culture or faith, quoted with its scene id;
- the specific questions the outline's care notes raise;
- a sign-off table (reviewer, date, approved or changes).
Don't change any content.
```

## Task B-V3. Whole-canon continuity audit

**Model:** Fable (or Opus). **After:** all S and E tasks. This is the one job that needs one mind
holding the whole canon: 12 chapters, 31 side stories, 50 storylines and both bands. Expect it to
use a large context by design.

```text
Use one subagent with model "fable" (or "opus" if fable isn't available). Read CLAUDE.md ("Story and content"), docs/canon.md and src/content/STORY-BIBLE.md, then work through src/content file by file. Follow docs/briefs/review.md in "report" mode, with batch name "canon-audit", but across the whole canon.

Scope: the campaign; S1–S31; every Atlas, Arcade, fun pack and line; both Learning Grove bands.

Focus on: contradictions between storylines (names, timelines, who knows what when, flags read
and written, rewards that clash); choices that never pay off; repeated beats across storylines;
tone drift from CLAUDE.md's tone decisions.

Group your findings by storyline, and give an exact fix for each.
```

---

## Engine tasks (code)

These are milestones: plan first and wait for approval. The specs are in
`docs/grove-backlog-prompt.md` (CV1–CV6: grep the "CV" headings and read that range only) and the
bible's "Sim changes". They touch `src/sim/`, `src/ui/` and the title and settings screens, so
run them one at a time, and not at the same time as Track A Part G9 (which also edits the title
screen and settings).

### B-C1. Campaign v2, endings and chapter holds (CV1 + the campaign half of CV6)

**Model:** Fable or Opus. **After:** B0.

```text
Milestone CV1 (with the campaign items of CV6). Context rules: read CLAUDE.md, docs/canon.md, the "Sim changes" section of src/content/STORY-BIBLE.md (grep for it), and only the CV1 and CV6 sections of docs/grove-backlog-prompt.md (grep "CV1." and "CV6"); grep src/sim/campaign.ts for the functions you change rather than reading it whole if it is long.

Then give me a plan and wait.

The scope is:
- The campaign: swap in campaign v2 (src/content/campaign*.ts), store the new flags, and implement the vigil step.
- The ending order: follow the bible, with hazels-grove no longer requiring "keep" and end-hazels-grove-open as the "Open" body variant.
- Chapter holds: c11-close waits until S9 has had its chance (the CV6 way out included); c9-open waits for S27 and S28 to close; S5 holds c5-close.
- Line swaps written in notes (c11-close when s8Done, and the others listed in CV6).
- Variant scene selection from the side-story _VARIANTS arrays.
- S27's buy-back, which moves the soldId stray home.

Add Vitest tests for endingFor covering every flag combination in the bible, including bonded Sable with Open. npm test and npm run build must pass. Commit with "Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>".
```

### B-C2. Audiences and the Mature content setting

**Model:** Sonnet. **After:** B0. Small, and it unblocks safe testing, so do it first.

```text
Milestone: content ratings. Context rules: read CLAUDE.md, docs/canon.md (items 20 and 37) and only the audience items in the CV6 section of docs/grove-backlog-prompt.md (grep "CV6" then "audience"). Give me a plan, then wait.

Scope:
- Setting: add a "Mature content" setting with the positions Off, 13+ and 18+, defaulting to Off. Save it with a migration.
- Filtering: teen quests show only at 13+ or higher, and adult quests only at 18+; main, teen and adult quests never show in the Learning Grove; fun quests never trigger during chapters 9–11.
- Rift confirmation: a one-time confirmation before the Multiverse rift opens.

Add tests. npm test and npm run build must pass. Commit with the Co-Authored-By line.
```

### B-C3. Side-story and fun-quest engine

**Model:** Opus. **After:** B-C1.

```text
Milestone: side stories. Context rules: read CLAUDE.md, docs/canon.md, the bible's side-story table (grep src/content/STORY-BIBLE.md) and the side-story items in CV6 (grep docs/grove-backlog-prompt.md). Give me a plan, then wait.

Scope:
- Story windows: open and close each story by its chapter window (S1–S31).
- Steps and flags: run quest steps and their checks (stub any check verb the sim can't measure yet, and list them), and set sNDone and the story's flags.
- Variants and line swaps: pick variant scenes by flag, and apply the line swaps written in notes, in both Learning Grove bands too.
- Fun quests: trigger them by their `when` text rules, with requires chains.

Tests and build must pass. Commit with the Co-Authored-By line.
```

### B-C4. The Learning Grove mode (CV2)

**Model:** Opus. **After:** B-C1.

```text
Milestone CV2. Context rules: read CLAUDE.md, src/content/EDU-STYLE.md, src/content/edu.ts and only the CV2 section of docs/grove-backlog-prompt.md (grep "CV2."). Give me a plan, then wait.

Scope: the band switch (sprout and reader); eduSceneFor in place of the original scene, still applying the original's flags; lesson UI for ask, notice and do; glossary taps; read-aloud for sprout; grown-up progress by standard; childLines swaps.

Tests and build must pass. Commit with the Co-Authored-By line.
```

### B-C5. The language questlines (CV3)

**Model:** Opus. **After:** B-C4.

```text
Milestone CV3. Context rules: read CLAUDE.md, src/content/lang-hebrew.ts, src/content/lang-japanese.ts and only the CV3 section of docs/grove-backlog-prompt.md (grep "CV3."). Give me a plan, then wait.

Scope: right-to-left Hebrew with niqqud; kana rendering, with a font chosen and pinned; course vocab and the word lists; audio hooks for native-speaker recordings (use placeholder clips); Learning Grove-only gating.

Tests and build must pass. Commit with the Co-Authored-By line.
```

### B-C6. Atlas, Arcade and Multiverse saves; cross-save reads (CV4, CV5)

**Model:** Opus. **After:** B-C1.

```text
Milestone CV4/CV5. Context rules: read CLAUDE.md, docs/canon.md (items 21, 29 and 30), src/platform/storage.ts (the save slots) and only the "How to build it (backlog item CV4)" and "(CV5)" sections of docs/grove-backlog-prompt.md by grep. Give me a plan, then wait.

Scope:
- Saves: a separate save for the Atlas (pages in any order) and for the Arcade, alongside the Multiverse slot; they must coexist with the three slots per mode in storage.ts.
- Entry points: Nova's atlas item, and Pixel's cabinet after chapter 5.
- Cross-save reads: read-only lookups such as atlasDone(id), atlasFlag(id, flag), arcadeDone(id) and longGrassLantern(), so the Grove can show keepsakes. They never write.
- E6: the Multiverse uses a reflection of your Eternal.
- Festival unlocks by sets of pages.

Tests and build must pass. Commit with the Co-Authored-By line.
```

### B-C7. The no-chores clean-up

**Model:** Sonnet. **After:** Maor decides what the daily gifts become.

```text
Milestone: no chores. Context rules: read CLAUDE.md, docs/canon.md (items 22 and 34), src/content/results.ts, src/sim/daily.ts and src/sim/neighbourhood.ts. Give me a plan, then wait.

Scope:
- Neopia freebies per src/content/results.ts: one-time or unlimited.
- sim/daily.ts and sim/neighbourhood.ts currently give "once a day" gifts. Convert them to <Maor's decision: one-time story gifts / unlimited visits with no reward timer / remove>.
- A grep for any other timer-gated reward, with a report on what you find.

Tests and build must pass. Commit with the Co-Authored-By line.
```

## Task B-H. Housekeeping

**Model:** Haiku. **Anytime.**

```text
Use one subagent with model "haiku". Context rules: read only the Status block of PROGRESS.md, docs/content-index.md and docs/logs/.
1. Regenerate the script book: npx tsx tests/tools/script-book.ts script-book
2. Update the content status (scripted / edu done / reviewed) for every storyline in docs/content-index.md, using docs/logs/ as the source, and the one-line summary in PROGRESS.md's Status block. Keep PROGRESS.md under 150 lines.
3. Run the three checks and report the results.
Don't change any content.
```

---

# Running order across both tracks

The two tracks touch different files and can run side by side: Track A lives in `src/samples/`
and later `src/render3d/`; Track B in `src/content/`, `tests/tools/`, `docs/` and, for the engine
tasks, `src/sim/` and `src/ui/`. Two places overlap, so sequence them: the title and settings
screens (Track A Part G9 and Track B C2) and `src/platform/storage.ts` (G10's geometry cache and
C6's extra saves). Give every parallel session its own worktree and merge in this order.

1. **Now, in parallel:** A-G1 (Opus) · B0 (Opus) · A-G4 and A-G6 (Sonnet).
2. **Content waves:** B-S3 → W → R, then B-S4 → W → R, then B-S5a + B-S5b → W → R. B-E1 → W → R
   alongside, then B-E2 in batches. B-V1 and B-V2 any time; B-V3 once scripting and edu are done.
3. **Graphics:** A-G2 (Fable) with A-G3 (Opus) in parallel once G1 lands; then A-G5; then A-G7
   and A-G8 in parallel.
4. **Engine, one at a time:** B-C2 → B-C1 → B-C3 → B-C6 → B-C4 → B-C5 → B-C7, with B-C2 landed
   before A-G9 starts on the title screen.
5. **The 3D mode:** A-G9 (Fable, then Opus) → A-G10 (Opus) → A-G11 (Sonnet).
6. **B-H** after each content batch; **A-G12** and the remaining Digimon-list expansions when
   Maor picks.
