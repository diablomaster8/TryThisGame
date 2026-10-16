# PROGRESS.md

Read this with CLAUDE.md at the start of every session. Keep it under 150 lines: when a
new pass goes in at line 12 and the file is long, move the oldest section to
`docs/progress-archive.md` (newest first there too).

## Status (2026-10-16)

Shipped and deployed: v1, the organic painted Grove, the Digimon-inspired ten, the Hollow
Below dungeons, the 96-unit field, three save slots per mode, and the Full 3D mode as a
Graphics setting (`src/render3d/`, worker sculpting, geometry cache, boot work) with the
pixel mode unchanged. Story content pack in `src/content/` with CV1 wired (campaign v2,
endings, the runner for S5, S9, S10, S27, S28; side stories as a lazy chunk). In the
working tree, unreviewed and uncommitted: Atlas A1–A10 and A22–A31 (plan.md Task B-R1).
Review of everything done and open, and the v3 plan with briefs: `plan.md` (2026-10-16).
Waiting on Maor: the expansion pick E1–E3 / S1–S4, the daily-gift decision, seven
fun-quest quotes, whether Full 3D becomes the default, his phone rows in the device pass.
Backlogs: `docs/creature-improvements.md`, `docs/content-index.md`.

## Standing approval (Maor, 2026-10-12)

"When you finish, proceed straight through to the next development. I'm approving it. Keep
going until you hit the session limit." So after each milestone passes its done-when
checks, start the next one without waiting. Still plan each one briefly in the session
log before coding, still keep the per-milestone commits and checks.

## Side stories as a lazy chunk (2026-10-16)

Works:
- The side-story scripts (S1–S31 and their variants) are their own chunk,
  `src/sim/side-story-content.ts`. `story-scenes.ts` keeps the campaign scenes synchronous and
  adds the side stories through `registerSideStories`; `loadSideStories()` imports and
  registers the chunk once. `main.ts` starts the fetch while the title is up and awaits it
  before `boot`, so save.ts's queue filter knows every side-story id when a save loads.
- Tests register the chunk up front (`tests/setup-side-stories.ts`, a Vitest setup file);
  `tests/sim/side-story-chunk.test.ts` checks a queued `s9-ask` survives save and load.
  Checked in the browser too: a save queued on `s9-ask` boots straight into S9's scene.
- Main chunk: 2,022 kB → 1,304 kB minified (632 → 382 kB gzip); the side-story chunk is
  716 kB (250 kB gzip).

Stubbed / known:
- The index is still above the 1.14 MB it was before CV1: the remaining ~175 kB is the v2
  campaign script (`content/campaign-book1..3.ts`), which stays synchronous by design.
  Lazy-loading it the same way would bring the index near 1.13 MB.
- Code that runs before `loadSideStories` resolves sees an empty `GROVE_SIDE_STORIES`;
  today nothing does.

## CV1: campaign v2, its sim changes and the side-story runner (2026-10-16)

Works:
- `config/story.ts` takes `CHAPTERS`, `SCENES`, `ENDINGS` and the speakers (Wisp, `chorus`) from
  `src/content/campaign.ts`. `UNDERSTUDY` is gone (fixes B1): the Keeper picked on the title
  only sets the player's portrait, and "you" is named You. Chorus lines show in italics with no
  portrait.
- `sim/story-scenes.ts` registers every campaign scene, every Grove side-story scene (S1–S31) and
  every `_VARIANTS` scene. `sceneFor` applies the line swaps from the notes: `c11-close` (S8's
  empty arm, the `s9-ask` evening line), `c12-open` (S26's walled garden spliced in), the S10
  letters with Open, the S6 register on loan and S17's nursery line. The dialogue box uses it.
- `sim/campaign-routes.ts` holds the scene-notes routing: chapter 4's tale, `c5-circuit` and
  `c5-considered`, `c5-sold`, `c6-open-walked`, the stillness parts, `c8-ledge(-s4)`, `c8-nova`,
  `c9-partner` and `c9-open-sold`, the four shard scenes, the whole Long Night, the chapter 11
  Moss add-ons, `c11-gate`, the chapter 12 foot and walk scenes, and `endingScenes` (body variant,
  then wisp, gate, visitors, mill, walk, cinder, told or secret, garden, then `-last`).
- The chapter 10 vigil (`stepVigil`, `STORY` in tuning): progress runs only while all four
  lanterns are lit; wave one blows out the stream lantern, wave two marks the Long-Grass one low;
  `c10-lull` halfway; `c10-falls` at dawn. No fail state. Moss leaves the world after
  `c10-bank-moss-gone` and `c10-moss-fades`; his flower goes by the flat stone.
- `endingFor` follows the bible: the Collector also comes from `keptStone`; Hazel's Grove ignores
  the final choice, and with `letThemGo` plays `end-hazels-grove-open`; `mossFaded()` includes
  "carried the stone in and did not come back".
- `sim/side-stories.ts` runs S5, S9, S10, S27 and S28: opening, step gates (story dawns and
  dusks), checks, variants, unfinished closes, S10's lapse and S9's jump to the dawn gate. The
  holds: S5 holds `c5-close`; S27 and S28's autumn steps hold chapter 9; `c11-close` waits for S9
  (or `keptStone`, or the dusk after `threeFriends`); S10's night holds chapter 12; S9's gate
  scene plays before `c12-open`; S10's letter plays before the ending.
- S27's buy-back (`applyChoice`, scene `s27-home`, pay or hat, only on the sold path) brings the
  `soldId` stray home, or sets it walking to the gate when the Grove is full. The runner path
  creates Nine as a grey stray.
- The journal lists the open side stories with their goal and hint, and a "Do it" button.
- Saves: old campaign saves gain the new fields; queued ids the v2 script lacks are dropped.
- Tests: `tests/sim/campaign-v2.test.ts` (25), including `endingFor` against the bible's order
  over every flag combination (1,000+), Open, the Long Night branches, each hold, the buy-back
  and the line swaps. The run driver moved to `tests/sim/campaign-driver.ts`.

Stubbed:
- Side-story checks the sim can't watch (carry, find, minigames) are met by the journal's "Do
  it". Places, props, items (old trowel, Hazel's lantern) and side-story rewards aren't built.
- Only these five stories run. The other `_VARIANTS` (S2, S8, S13, S19, S23–S26, S29–S31) are
  registered but not chosen. The campaign-side hooks those stories feed (`visitors`,
  `hushGarden`, `millLetter`, `cinder`, `wisp`) are read wherever their flags are set.
- `s28-null-minder` (needs S7), S27's spring scene, Wisp's stray spawn after `c10-bank-wisp`,
  and per-line voice clips (none exist yet).

Assumptions: a story day is `STORY.dayMs` (120 s) of sim time with dusk at 75%, since the sim
has no time of day of its own. `c5-circuit` plays straight after `c5-open` (the note's
fallback). S27 opens in chapter 6 rather than "the first Circuit visit". The vigil's wave
lanterns (`lantern-2` stream, `lantern-4` Long Grass) are a guessed mapping.

Known issues: the main bundle grew from 1.14 MB to 2.02 MB (minified), because the scene registry
bundles all the Grove side-story scripts. Lazy-loading them is a follow-up.


## 3D boot: terrain in a worker, the sky's first bake warmed (2026-10-16)

Works: the terrain's heights, normals and rock/dirt blend are sampled in a worker
(`render3d/terrain-worker.ts`; the samplers and `terrainArrays` moved unchanged to the pure
`terrain-shape.ts`, which `terrain.ts` re-exports). The mesh starts on a one-triangle
placeholder with the same attributes, so programs key as before, and the buffers are poured
in as a new geometry when they land. The sky's first PMREM bake linked four programs
synchronously in the first `setDaylight`: 70–115 ms (305 ms with the browser's shader cache
cold). `GroveSky` now compiles them with `compileAsync` at construction (reaching into the
pinned PMREMGenerator's internals) and holds a blank target of the same shape as the
environment until they link, then bakes (12–31 ms, no compile). `loadState` waits for both.
Measured on Maor's PC (dev build, preview, seeded free slot 3, frames driven by hand, three
warm runs each, HEAD vs this pass): constructor 393–407 ms → 189–261 ms (terrain mark
258–276 → 18–32 ms; props rose 92–95 → 132–193 ms, its height sampler is no longer warmed
by the terrain loop); first `setDaylight` 70–115 ms → 0. Look: two frozen views (11:00 and
18:30, windmill blades pinned, creatures hidden) are pixel-identical to HEAD; both builds
link the same 49 programs. Not done: props (grass placement) still on the page. Not
verified: the no-worker fallbacks; any phone. No new stubs or known bugs. The earlier boot
pass (textures in workers, compile ahead) is in `docs/progress-archive.md`.
