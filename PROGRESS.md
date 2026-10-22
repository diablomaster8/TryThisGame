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

## Story review run 2 fixes (2026-10-22)

All 65 open or partial recs in `docs/story-review/LOG.md` applied (run 2's 60 plus run 1's 5 partials).
- **Works:** 60 fixed. The Multiverse's misnamed-Nubbin running gag and three bickering couples (canon 45),
  FF3 and IM9 choices that now change what follows, Doom's FF9 knee paid off in the FF epilogue; the Neopian
  Times Reporter across NP1–NP13 (canon 44); the Learning Grove S1–S17 fixes; c4-open's answer (`c4-lamps`)
  remembered in c10-dawn, c10-wisp naming Sable or Moss (`choice-payoffs.ts`, `story-scenes.ts`;
  `insertAfter` now takes per-band anchors like `spliceScene`). Tests added in `choice-payoffs.test.ts`.
- **Partial:** -72 (NQ27's optional Jhudora/Illusen side not built), -79 (no time machine named), -80 (Marlene
  stays back at the ridge), -110 (Pip still named in s15-wagon by a main choice), -115 (S8's elephant notice kept).
- **Known bugs:** none. A cold first `npm test` run timed out 3 timing tests; a rerun passed all 728.

## Story review run 1 fixes (2026-10-22)

All 60 recommendations of `docs/story-review/review-2026-10-22.md` applied (log: `docs/story-review/LOG.md`).
- **Works:** 55 fixed, 5 partial. New beats across the campaign, S1–S31, Q1–Q65 and the Learning Grove
  campaign; canon 38–43 (Pixel and Byte married, Marina's rules, Fern's pies, the skipping rhyme,
  Granny Brock, settled names: Hob in S27, Inspector Plimsoll in Q32, Mrs Tibbs, Frannie). Sprout
  cuts its unreachable keep-stone and sell scenes (exempted in `content-check.ts`). Q50 and Q65
  now require Q64. The c12-open garden splice anchors on its own reader-band line.
- **Partial:** -25/-28 (every real Learning Grove line is under its cap; the screenplay joins
  choice replies into one bullet, so the joined count stays high), -43 (the c4 pet stays in every
  branch, the chapter goal needs it), -53 (c6-close ask kept), -54 (c10-wisp says "the stone's
  bearer"; naming Sable or Moss needs per-route variants).
- **Known bugs:** none. Some content regions near the edits are now in Prettier layout.

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

**Known bugs (after the fix round of 2026-10-22, `docs/samples/cg3-*.jpg` before and after)**

The nine defects the second review left are fixed: the Hush is a hooded figure (sRGB card) and
the Fold's windows go out with the faster lamp ring; the occluder's hide box takes a roof's whole
reach, the gate and package k's Fold pieces, and side-edge clutter (no dangling gable, no giant
roof); a hidden well takes its water (no dark disc); Hazel ch10 fits the iced pond
(`pond-centre`, kept whole when nothing else fits); Fern is cast at the gate (a stage actor when
you wear her look); the chevron clears while a postcard holds a line; pixel push-ins and close
shots use a story-only 64 px step; Hundred ch1 frames the gate and Ida, and pixel dojo ruins are
cut from the cottage; Hob stands at a new counter; two-shots never look along the pair, and the
twin stands off the sundial (`green-twin`).

- Hazel ch9's narration chevron did not reproduce in headless Edge; the stale-speaker path is
  fixed but unconfirmed.
- Hazel ch10 3D: the floating fence rail did not show once the shot fits the pond; not traced.
- On a phone held upright, Hazel ch10's pixel shot keeps the pond whole and loses the Keeper.
- Fern as a stage actor wears the Gardener look, so in 3D she matches a Gardener Keeper.
- The Fold keeps its mill and water wheel by design (`stage-sets.ts`); the reviewer flagged them.
- Ida's line in Hundred ch9 still has a roof cut by the bottom-right edge (not nearer than the cast).
- No real-phone pass yet.

## Standing approval (Maor, 2026-10-12)

"When you finish, proceed straight through to the next development. I'm approving it. Keep
going until you hit the session limit." So after each milestone passes its done-when
checks, start the next one without waiting. Still plan each one briefly in the session
log before coding, still keep the per-milestone commits and checks.

