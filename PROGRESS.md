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
repetitive daily quests are out. Hollow art pass: built 2026-10-21 (below). Play review of
2026-10-24 (`docs/review-play-2026-10-24.md`, run on a stale checkout): fixed 2026-10-25 on
branch `fix/r1025-merge`, not pushed until Maor OKs (section in `docs/progress-archive.md`).

## Round 5 · Lane A FUN (2026-10-29, branch r5/a)

Per-item status in `recs-2026-10-27/STATUS.md`. Edge driver: `node r5a.cjs <pixel|3d>
<desk|phone> 5181` in `recs-2026-10-27/tools`. R0317 (lane E) and R0326 (lane B) skipped.

- *Works:* the opening's stuck gate is played (hold, push, sticks once, gives) and the cup
  sets `c1-cup-turned`, which adds a line to c12-close (R0304, `Line.act`, `ui/line-act.ts`);
  no fun quest before chapter 2's closing (R0306); slip toasts say what helps, with a minute's
  warning in a new save (R0307); sprout toasts icon-first, no mechanics, read aloud (R0308,
  `ui/fun-toasts.ts` wraps the toaster); `content-check --comedy` and book 1's 74 gags tagged
  (R0309); sound words read with their sounds, a bubbly face, ~70% of non-grave campaign and
  S1–S22 sprout scenes covered (R0310); pet toasts in three physical lines per band (R0311);
  one hatch card with Pet (R0312); Fern's cairn by the signpost in both modes, one stone a
  chapter, tappable, finale line (R0313); Byte's stopwatches on the race card (R0314); 25 joke
  badges, titles in `config/strings-badges.ts`, Silly filter (R0315); a seeded away diary,
  three headlines then "+N more" (R0316); 60 gated tips on the veil and stage loaders (R0318);
  chip caps in the checker, chapter 1–2 how-to steps tick live (R0319); sprout wrong replies
  open with a silly picture, checker warning (R0320); sprout peekaboo under Play (R0321); tap
  squeak toy (R0322); Say it! on 21 refrains (R0323); Keeper routines, three stations a story
  day with lines and prop icons (R0296); 90 chatter exchanges for 15 pairs (R0297); R0294's
  verb map covers every check, with balance, hunt and catch playable from the Atlas and Journal.
- *Stubbed:* R0294's escort, climb, puzzle, survive and explore games (the button stays) and
  the Skip-this setting; R0296's prop sprites (soot face, guilty sapling: the bubble icon is
  the gag for now); R0313's Journal Friends line and side-story callback; R0316's 30 s
  highlight of changed Nubbins; R0321's shy-Nubbin peekaboo idles; R0310 outside campaign and
  S1–S22 (17.7% of all sprout scenes); R0318's Atlas loader; R0322's crown spin is a dizzy face.
- *Known bugs:* none found. Timing tests (full life, nav, 8 Nubbins) fail under a loaded
  machine; alone see the round's report. `TEN_TEXT.slipToast` in `strings.ts` is now unused.
- *Assumptions:* routines and chatter state is not saved (read from the clock, kept beside the
  world); joke-badge counts in optional `world.funCounts` (no save bump); the cup and gate
  flags live in campaign flags; R0311 leaves lane E's per-personality lines (R0298) as the
  main band's success toasts once merged; NPC wandering now draws fewer dice (routine trips
  skip the wander pick), so seeded replays differ from before but stay deterministic.

## Round 4 · Lane C FIGHT tactics (2026-10-29, branch r4/c)

- *Plan:* a pure, seeded grid-tactics core in `src/sim/battle/tactics/` beside the turn mode,
  which stays untouched (R0243 map, R0244 field map, R0245 path, R0246 CT, R0247 facing,
  R0248 jobs, R0249 terrain, R0250 range and combos, R0251 objectives, R0252 AI), then the
  R0257 slice as `world.tactics` behind a debug-panel button, then a Pixel view and phone bar
  (R0253, R0255) in new files. R0254, R0256, R0219, R0239 later.
- *Works:* `sim/battle/tactics/` (pure, seeded, JSON state, map as base64): Hollow-room and
  open-field maps (cottage, trees, lanterns blocked; `config/battle-maps.ts` overrides), Move
  and Jump from Run/Fly, deep water for swimmers, CT turns with Move (before or after the Act,
  undoable until it), Act, Wait and facing, charged moves, facing/height factors shared by
  preview and hit, 7 jobs plus Sunny/Moony layers and the Keeper aura, 8 terrains, arcs and
  line shots, 11 "Together!" combos at friendship 60, 8 objectives, Sprout/Keeper/Champion AI
  (0.4 ms a decision, Champion 40/40 over Sprout). The rumble room (R0257): debug panel →
  "Rumble room (3v3 tactics)", a 10×10 Hollow crop, calm the Old Shadow, Shells and a crystal;
  kept in `world.tactics` (optional, no save bump) and reopened after a reload. Pixel iso
  board (`minigames/tactics/pixel-view.ts`, also over Full 3D) and the one-thumb bar
  (`ui/tactics-bar.ts`, `ui/tactics-screen.ts`, `tactics.css`). The turn-mode API is unchanged
  (`moveDamage` now calls `damageWith`, same dice order).
- *Stubbed:* no move animations (the log line and a hurt flash only); the AI never calls a
  combo; Copycat and Doodle Decoy act as plain moves on the grid (Decoy is greyed out); fused
  partners are not one 2-tile unit; lane B's rumble-room flag (see the hand-over note).
- *Known bugs / assumptions:* the AI's 8 ms cap is an evaluation count (2500), not a clock, so
  replays stay exact. The board is Canvas 2D: 1 blit for the map plus 1 per unit (13 for 12
  units), not the ≤3 WebGL draws of R0253; it holds 60 fps at a 4× throttle. Water touching
  dry ground is shallow, the rest deep; combos need the pair side by side (diagonals count).

## Round 3 · Lane E LOOK (2026-10-28, branch r3/e)

- *Works:* a cosmetics registry (`config/cosmetics.ts`): 24 wearables over hat, neck, back
  and body slots, each drawn in both modes from data (`render/sprites/cosmetic-pixel.ts`,
  `render3d/dress.ts` `registryItem`); the shop sells a hat of the day. Hatchlings wear their
  eggshell for 10 live minutes and keep it in the hat box. Quills (Sun Keeper) and Shade (Moon
  Keeper) are tier-3 race prizes with 3D accessories. First evolutions carry type tells in both
  modes (Pixel sorts by outline: `first-tells.test.ts`). A pixel cry clip. Nine more egg colours,
  three jewels, and metal and glass finishes in Pixel.
- *Stubbed:* the cry clip is not shown yet: `world-view.ts` and `actors.ts` still map `cry`
  to `sad` (lane A), and there are no 3D tears. One worn cosmetic at a time (`n.hat`); the
  per-slot `wear` field needs lane B's save. No 3D egg finish (`creature-pool.ts`, lane D).
  Normal's fuller crown and Run's lean are Pixel only. Pixel serpents still 1.0–1.6× long.
- *Known:* Pixel metal is subtle at 32 px. New egg colours show raw ids in the Roster
  (`EGG_COLOR_LABELS` lives in `strings.ts`).
- *Assumptions:* keeping the eggshell is automatic (into the hat box on hatch; it leaves the
  head after 10 min). Grove line only. The registry's "show what you get" shop option was
  taken over per-id SKUs (no `ShopItem` change).

## Standing approval (Maor, 2026-10-12)

"When you finish, proceed straight through to the next development. I'm approving it. Keep
going until you hit the session limit." So after each milestone passes its done-when
checks, start the next one without waiting. Still plan each one briefly in the session
log before coding, still keep the per-milestone commits and checks.

