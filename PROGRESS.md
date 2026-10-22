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

## Campaign graphics 2, items 1–45 (2026-10-22)

Built from `docs/campaign-graphics-recommendations-2026-10-22.md` the same way as the first pass:
one orchestrator, wave 0 (foundation, Opus), seven packages in parallel (P people, K kits, W
winter and water, Y light and grade, U story UI on Sonnet; S sets and X occlusion and gate on
Opus), a content wave, shots and perf, and two review rounds with one fix round. Branches
`cg2/foundation`, `cg2/pkg-{p,s,k,w,x,y,u}` and `cg2/content` merged in `cg2/merge`. Agent rules
and API: `cg2-rules.md`, `cg2-api.md` (session folder, not in the repo). Shots:
`docs/samples/cg2-*.jpg`.

**What works**

- **Staging (wave 0):** new `SceneStage` fields (`exclusive`, `set`, `shot.then`, `shot.fit`,
  `lights.windows`, `item`, `hold`, `cast[].tint`, more `carry` and `props`); package overlays
  `config/scene-stages-pkg-*.ts` layered under the content files field by field (props and lights
  by key); `ctx.buildings` (hide/fade), `ctx.camera`, `safeRect()`; fit-to-focus inside the
  HUD-safe area, push-in on the first spoken line, the Keeper on its place mark, camera yaw chosen
  to see the speakers. H1: every chapter has a home location (`HAZEL_HOME`, `STORY_HOME`); a
  debug jump moves there and always replays the chapter opening.
- **People (P):** storyline speakers drawn as render-only stage actors with their own looks
  (`STORY_NPC_LOOKS`) and portraits (content-check fails a speaker with no look); grey Moss on
  the hill; speaker chevron (not on narration); festival ring; Keeper silhouettes; Hazel's patches;
  carry props.
- **Sets (S):** the Root Node white room and the Beetle Road's `below` cave (exclusive sets);
  Logged In's grid, holo board, egg glints and door.
- **Kits (K):** per-campaign `set` hides Grove-only buildings; Fold ruins mending by chapter, the
  Beetle lane, banners and cart, crest plaques and sundial, tally post and wreaths, campaign
  memorial spots.
- **Winter and water (W):** pond and stream ice in ch10–12 in both renderers, snow crowns and
  frosted ground, short frosted 3D grass, pixel Hush colossus, the Hush lantern ring and frost
  trail, the mill sluice, Corvin's backdrop foot.
- **Occlusion (X):** the lychgate (2 draws), round-hole fades, near-camera and frame-filling
  pieces hidden, pixel building fade over the cast.
- **Light (Y):** Logged In night with windows out, dark "out" lanterns in 3D, split-tone Dawn,
  `crisp` grade, dawn/dusk cues, the lantern string, the board's final message.
- **UI (U):** item close-up cards, chapter postcards (skippable), the chapter photo offer.
- **Content:** all 197 scenes of the four storylines and every Hazel ending staged.
- **Perf** (Full 3D, 390×844, 4× CPU throttle, mean fps before → after): Hazel ch10 56.6 → 56.6,
  ch12 56.6 → 56.6, Hundred ch9 47.5 → 43.6, Logged ch7 47.9 → 47.1, Logged ch4 45.8 → 49.7,
  Beetle ch3 46.9 → 52.1, Beetle ch1 45.5 → 51.2, Dawn ch1 55.0 → 49.4. No scene under 30;
  run-to-run spread was 5–8 fps; draw calls unchanged at Dawn ch1.

**Stubbed or approximate**

- C4 uses the `below` set in the Grove, not the real dungeon location.
- Stage actors hold a static pose (no sit or kneel); hidden 3D buildings still cast shadows and
  stay pickable.
- The board's final words are a placeholder in `tuning-y.ts`.
- The chapter photo is the canvas only (no DOM grade layers); the offer isn't saved.

**Known bugs (left after the second review round)**

- 3D Hundred ch9: the Hush reads as a pale beam, not a figure, and the lamps are still lit at
  "lamps go out" in the shot; a giant roof at the left edge; a building bottom-right has a
  half-missing roof with outline lines dangling.
- 3D Hazel ch10 `-1`: a fence rail floats without posts and a dark disc lies by the cast; the pond
  is barely in frame (and missing on phone in both renderers).
- 3D Hazel ch1: Fern speaks but is not in frame.
- 3D Hazel ch9: a chevron still shows over a Nubbin on a narration line.
- Pixel: no push-in after wide shots (Beetle ch3); the Root Node room's cast is still small.
- Hundred ch1 on phone: no gate at "a gate with no fence"; Ida not visible at "an old woman sits
  on the one whole step"; pixel Fold still shows the Japanese houses and mill.
- 3D Beetle ch1: Hob stands on the open road at "behind the counter sits a man"; a hut is cut off
  at the right edge.
- 3D Dawn ch6: Marigold overlaps the Keeper.
- No real-phone pass yet.

## Standing approval (Maor, 2026-10-12)

"When you finish, proceed straight through to the next development. I'm approving it. Keep
going until you hit the session limit." So after each milestone passes its done-when
checks, start the next one without waiting. Still plan each one briefly in the session
log before coding, still keep the per-milestone commits and checks.

