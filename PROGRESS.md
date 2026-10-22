# PROGRESS.md

Read this with CLAUDE.md at the start of every session. Keep it under 150 lines: when a
new pass goes in at line 12 and the file is long, move the oldest section to
`docs/progress-archive.md` (newest first there too).

## Status (2026-10-21)

Shipped and deployed (https://diablomaster8.github.io/TryThisGame/): v1, the organic
painted Grove, the Digimon-inspired ten, the Hollow Below, the 96-unit field, three save
slots per mode, and the Full 3D mode as a Graphics setting (`src/render3d/`, workers and
caches, the G13 polish, the G14 bundle diet, the G15 and G16 parity fixes) with the pixel mode
unchanged. Story content in `src/content/` (scripted is not shipped: `src/content/index.ts` is
read only by the checker and tests). What the game loads: campaign v2 and endings, all 31 side
stories, fun quests Q1–Q95, props and keepsakes, the Learning Grove switch, Hebrew and
Japanese, the four separate campaigns and E1–E3, Mature content, one-time gifts, and four
story worlds, each a lazy chunk with its own side save that never writes the Grove: Nova's
atlas (A1–A31), Pixel's cabinet (PA1–PA5, since 2026-10-18), the Multiverse rift (18+ only,
since 2026-10-18) and Neopia's rainbow gate (since 2026-10-18). Content: edu done wherever
audience and outline allow (none for Q66–Q95; they read their childLines); fix-mode reviews done
for Atlas A1–A10 and A22–A31 and every Atlas and S24–S31 edu version, the rest canon-audited
only (`docs/content-index.md`). Plan v4 (`plan.md`): G11 device pass, Track B writing and review
tasks; Part Z ran on 2026-10-18 (`docs/review-independent-2026-10-18.md`) and its fixes are
going in pass by pass. Review B (`docs/review-independent-2026-10-18-b.md`): Bugs 1–17 and
18–38 fixed on 2026-10-18 (both in the archive). Review C
(`docs/review-independent-2026-10-18-c.md`): major items 1–10 and minor items 11–29 fixed (both in the archive).
Maor, 2026-10-17: legal cleared, adviser sign-off given, the seven fun-quest quotes approved
as written, Pixel stays the default; 2026-10-18: ship the Arcade, the Multiverse, Neopia and
Q66–Q95. Waiting on Maor: the LB/LK decision (section "Pixel's Arcade
PA1–PA5" in `docs/progress-archive.md`). Decided 2026-10-18 (review B, item 16): original
sung verses are fine (only lyrics from existing songs are banned); Holy Grail's Q1–Q7 are one
storyline and keep all ten quotes, an exception to the three-quote cap. Backlogs: `docs/creature-improvements.md`,
`docs/content-index.md`. Maor, 2026-10-18: Full 3D is the flagship for the AAA art push (the
default renderer is not changed; passes 1 and 2 are on `main`, deployed since 2026-10-19). Review D
(`docs/review-independent-2026-10-21.md`): fixed 2026-10-21 except bugs 2–3 (share-code Eternals,
accepted by Maor). Maor, 2026-10-21: daily refreshes and free daily gifts are allowed; only
repetitive daily quests are out. Hollow art pass: built 2026-10-21 (below).

## Campaign graphics, items 1–50 (2026-10-22)

Built from `docs/campaign-graphics-recommendations-2026-10-21.md` by one orchestrator and a
set of subagents:

- **Wave 0, the staging foundation:** Opus.
- **Six packages:** A (light) on Opus; B–F on Sonnet.
- **Content:** Sonnet.
- **Screenshots:** Haiku.
- **Perf:** Sonnet.
- **Review:** Opus, two passes plus one round of regression fixes.

Branches `cg/foundation`, `cg/pkg-a..f` and `cg/content` were merged in `cg/merge`. Final desk shots
are in `docs/samples/cg-final-*-desk-*.jpg` (both renderers; the phone and reduced-motion
sets were checked but not committed). Each package's shots are in `cg-<pkg>-*`.

**What works**

- **Staging.** `Scene.stage` (`SceneStage` in `config/story.ts`) holds place, hour, season,
  weather, cast marks, shot, props, lights, fx and grade.
  - Scenes are staged in `config/scene-stages*.ts`: 159 of them, covering Hazel's Grove and
    every storyline chapter's opening and close.
  - The marks are in `config/stage-marks.ts`. The resolver and `stageFlags` are in
    `render/scene-stage.ts`.
  - Both renderers read the stage. Pixel now stages the hour and pans to the scene. 3D has shot
    types and frames speakers above the dialogue box. Phones get a capped portrait framing,
    and their HUD buttons hide during dialogue.
- **Dressings.** Registries live in `render/dressings.ts` and `render3d/dressings.ts`. Each
  package's code is in `dress-<pkg>.ts`, and its numbers are in `config/tuning-<pkg>.ts`.
  - **A:** a readable 3D night with a raised floor, a night rim and a story key. Bloomed glass,
    a luminance-keeping Sun and Moon tint, a skyline ring, and the sight-line occluder fade
    for buildings and crowns.
  - **B:** the gate (shut, open, overgrown), the ruined Fold mending by chapter, the four crest
    houses of Dawn & Dusk, the jetty, and the mill wheel. The wheel stands in the Grove and in
    the corvin set.
  - **C:** Corvin's garden (frost, backdrop, house, gate, swinging pens, numbered Nubbins), the
    Hollow camp, and the hill (path, flat stone, crest, Briar's flower). Also the falls,
    stone and water effects, breath, and footprints.
  - **D:** kit-built story props (`prop-kit.ts`), item glints (a still star under reduced
    motion), the step vignette, the signpost letter, the keepsake shelf
    (`config/keepsake-looks.ts`), the shrine and bell, benches, and boards.
  - **E:** named lantern states and the vigil waves, hand lanterns, NPC silhouettes
    (`config/npc-looks.ts`), Moss sitting, and the Hush.
  - **F:** `CAMPAIGN_LOOK` grades and chapter title cards, staged season and weather (winter
    trees, frost rime), the ch12 festival, the Logged In set (`props.loggedSet`), the Beetle
    Road guard house and the `beetle-below` grade with torches, plums and wasps, the story race
    dressing, and the picnic.
- **Perf.** Measured at 4× CPU throttle, phone viewport, Full 3D. ch9, ch10 and ch12 hold
  54–57 fps, the same as origin/main. Beetle ch1 averages 37–40 with dips below 30 in both
  builds, so that is not a regression.

**Stubbed or approximate**

- **Moss's sit** uses the sleep pose, so his eyes are shut and the 3D Zzz shows. A real `sit`
  pose needs a species change.
- **3D hand lanterns** hang at a computed hand offset; they aren't attached to a bone.
- **Pixel winter** is a canopy tint plus snow caps, not new tree sprites.
- **H18's grade and H1's tint** are a DOM overlay rather than part of `post.ts`. It hasn't been
  tested on a real phone.
- **The Beetle Road's "Hollow Below" scenes** play in the Grove under the `beetle-below` grade.
  Showing the real dungeon would need a sim location change.
- **The Hundred Days' mill chapter** plays at `corvin` (`storyline-rules-hundred.ts`), so the
  wheel is drawn there as well.
- **`c8-open`** is staged at the gate at first light. Beginning ch8 moves the sim to the
  Hollow first, though, so it plays there.

**Known bugs**

- **Reviewer items not re-checked after the last fix round:**
  - Dawn & Dusk houses at phone size, where only two are fully in frame.
  - The Logged In and Dawn & Dusk c3 framing after the occluder change.
- **3D "out" lanterns** still get their lamp-pool light and ground spill. The host builds those
  sources itself.
- **After a debug chapter jump,** the pixel camera may stay on the Keeper for scenes with no
  focus mark.
- **Pixel snow caps** read as pale dithered ellipses over the trees; they need painted snow.
- **Dawn & Dusk in the pixel view:** in the final c1 shot, the four houses still sit under the HUD at the top edge.
- **No real-phone pass yet.**

## Standing approval (Maor, 2026-10-12)

"When you finish, proceed straight through to the next development. I'm approving it. Keep
going until you hit the session limit." So after each milestone passes its done-when
checks, start the next one without waiting. Still plan each one briefly in the session
log before coding, still keep the per-milestone commits and checks.

