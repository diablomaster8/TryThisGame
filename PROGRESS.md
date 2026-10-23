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

## Campaign graphics 3, items K1–K50 (2026-10-22)

Built from `docs/campaign-graphics-recommendations-2026-10-22-b.md` the same way as the second
pass: wave 0 (`f4`, Opus), seven packages in parallel (a1 poses and rig, c4 interiors and places
on Opus; a2 motion, b4 people, d4 sky and weather, e4 world detail, u4 story UI on Sonnet), a
content wave, shots and perf, two review rounds with one fix round. Branches `cg4/foundation`,
`cg4/pkg-{a1,a2,b4,c4,d4,e4,u4}` and `cg4/content` merged in `cg4/merge`. Rules and API:
`cg4-rules.md`, `cg4-api.md` (session folder). Shots: `docs/samples/cg4-*.jpg`; golden set
`docs/samples/golden/` with `tests/tools/story-shots.cjs` and `story-shots-diff.cjs` (K50).

**What works**

- **Staging (f4):** focus weights in the fit (people first, large props kept at 60%, a phone 3D
  figure never under ~40 px, a line naming a prop makes it that line's subject); shot/reverse on
  two-speaker exchanges; `grave` letterbox scenes (30); the stage inspector in `?debug`; the shot
  test over every staged scene at desktop and phone (`tests/render/story-shots.test.ts`); new
  fields `from`, `partner`, `inside-<id>`, `tale`, `grave`, `moon`, `Line.gesture`.
- **Acting (a1, a2):** sit and kneel for Keepers and Nubbins (Moss sits upright, the Keeper beside
  him), heads turn to the speaker (crowd at half), five gestures (122 lines carry one), hand and
  neck pivots for carried props, the item-get pose; walk-ons with footprints by ground type; the
  partner beside the Keeper reacting by mood.
- **People (b4):** Fern's story look (cap, scarf, satchel) in both renderers; mood portraits; tale
  grade with young Hazel (c4-tale scenes); older Hazel from ch11; speaker rim and ring in 3D;
  separate-campaign departures at their memorial spots.
- **Places (c4):** hidden buildings drop their shadows and taps; five interiors (kitchen, guard
  house, Corvin's house, crest house, Fold house); the Beetle Road's below chapters on real Hollow
  floors with a story seed (save-safe, sim test), cast kept clear of floor props.
- **Sky and weather (d4):** the Hush walks with a fog band; depth of field on close/over shots
  focused on the speaker (off on phones); light shafts (3D only), cloud shadows, moon by chapter,
  snow building through the vigil (roof caps too), path wear, puddles, one wind uniform.
- **World detail (e4):** window figures, lantern streaks on water, crop plot by season, four lantern
  heads, rising lanterns, seasonal cottage decor, birds and moths, gate frost, the Logged In boot.
- **Story UI (u4):** keepsake inspector, a box skin per campaign, readable boards, the chapter
  photo with its grade, journal thumbnails, title-card silhouettes, the campaign map, the ending
  gallery.
- **Perf** (Full 3D, 390×844, 4× throttle, mean of two runs, before → after): Hazel ch10 60.1 →
  59.0, ch11 56.7 → 56.6, ch12 56.7 → 56.8, Hundred ch9 44.1 → 55.8, Logged ch7 39.3 → 56.2,
  Logged ch4 48.9 → 43.8 (run spread ≥8), Beetle ch3 48.6 → 56.3, Beetle ch1 50.1 → 48.9, Dawn ch1
  44.1 → 56.7; pixel Beetle ch3 and Hazel ch12 unchanged. Desktop Hazel ch12 3D 57 fps in the
  final shots.

**Stubbed or approximate**

- Fern's gate lines are not split out of `c1-letter` into a kitchen scene (needs the sim and the
  edu versions to change); no Corvin's-house or crest-house scene exists to stage.
- Pixel has no light shafts; coat tails don't read the wind (no coat geometry).
- The photo offer state lives in localStorage (UI convenience), photos in IndexedDB.
- The board's final words are still a placeholder.

**Known bugs (after the second review round)**

- 3D Hundred ch9 (`-1`, also `-0`): red floor slabs and loose boards remain where houses are
  hidden (plinth tops kept on purpose; package k's rubble stays).
- 3D Beetle ch1 on phone: the guard-house room shows tilted and wall-less with banners floating;
  on desktop Hob stands at the counter instead of sitting.
- The Logged In terminal skin still crops the Warden's portrait to a sliver on phone, and the
  pixel phone box cuts his line at "Please"; Logged In ch1 pixel on phone drops to 35–42 fps (cause
  not profiled).
- Hazel ch10 phone `-1`: the pond is in frame but no person is.
- Pixel keepsake inspector still shows the letter edge-on.
- Hazel's kitchen (`cg4-c4-kitchen-*`) still draws Fern in the Gardener look, portrait included.
- Pixel Beetle ch3 floor has a heavy purple grade instead of warm torchlight.
- The Hollow minimap still shows in the c4 floor close-ups; Hazel ch12 on phone crowds the box.
- Test suite: several sim/story-world tests time out under full-suite load and pass alone; watch
  the CI runner.
- No real-phone pass yet.

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

## Standing approval (Maor, 2026-10-12)

"When you finish, proceed straight through to the next development. I'm approving it. Keep
going until you hit the session limit." So after each milestone passes its done-when
checks, start the next one without waiting. Still plan each one briefly in the session
log before coding, still keep the per-milestone commits and checks.

