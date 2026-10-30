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

## Round 6 · Lane B DUNG (2026-10-29, branch r6/b)

- *Works:* boss floors (R0160): every act's boss sits on its 'boss' piece (60/60 seeds); the
  first win opens a big chest (a Legendary at the boss's level), shows the celebration card
  and wakes the next act's camp waypoint; a boss loss rests the party fully. The haul sack
  (R0175): gear finds ride in `run.sack` and bank at a waypoint, camp, acorn or home with a
  "Bank it!" card; no path shrinks what is owned (test). Stash (R0174): satchel overflow lands
  in `gear.stash`, listed rarest-first at the camp stash with Take. Tumble home (R0362): all
  party energy 0 rolls everyone home, half the sack to the satchel, half to the stash. Mystery
  Basket stall (R0176) at the camp vendor, odds within ±1% over 100k. Warm losses (R0180):
  half energy, "Sneak past?" after 3 losses, pack looks away 60 s. Sleepy packs (R0203): ~20%
  doze, walking by pays a tiptoe bonus, running wakes them, a Lazy Nubbin may yawn one awake.
  End trip confirm (R0184); chest and stray seeds without the roster (R0186); today's results
  on the cave-mouth menu and Journal (R0185 part, R0165 part); rolling stats in the debug
  panel (R0211); Stray King and rotating stray lines (R0326); co-op `keepers: []` and a
  replay test (R0209); `docs/hollow-design.md` (R0171). Save v12: `gear.stash`,
  `hollow.bossChests`, `hollow.today`, `hollow.stats` (test).
- *Stubbed:* boss `phases` are in the `EncounterSpec` but lane C's core ignores them; no
  sealing arena door or anteroom (retry is from the stairs); no Zzz, tiptoe or crown art
  (lane E); the Journal page has no request-board ties (adding templates needs strings.ts and
  the no-chores cap) and today's floors are the daily seed, not a fixed 5-level act chain;
  stash has no tabs or search; the floor-5 guardian (R0260) waits for lane C's r6 merge.
- *Known:* the boss chest is Legendary until sets exist (R0172); a bout lost to the act boss
  still teleports to the level's stairs up.
- *Assumptions:* banked = satchel or stash; the tumble's "half" moves to the stash instead of
  being lost; today's best time is the quickest daily trip to today's deepest level.

## Round 6 · Lane C FIGHT (2026-10-29, branch r6/c)

- *Plan:* R0269–R0289 not started, then the partials (R0250, R0253, R0272, R0274, R0256,
  R0217, R0218, R0234, R0236), C's share of R0260, R0333 if it fits. New sim files under
  `sim/battle/`, text in `strings-battle-r6.ts`, numbers in `tuning-battle-r6.ts`; shared files
  got self-contained blocks only. No save bump: new world fields are optional.
- *Works:* Dojo Ladder (5 belts × 3 bouts on `karateRecord`, kept through rebirth, Black Belt
  hat), Fusion burst in doubles (bond 80, 3 turns, splits at the fusing HP ratio), story-world
  bouts in a cloned Grove (`world-bout.ts`, results to the side save only), pass-and-play
  (`friendly`, share-code guests are copies, sticker only), the placement map
  (`contexts.ts`), six story bouts wired to the scenes' choices (dojo "Story bouts" list,
  `storyBout` command, `world.storyBouts`), the floor-5 guardian (`startGuardian`, keepsake),
  Circuit pre/post scenes, Play-fight Day (first Gentle bouts, Learning Grove), chapter 5 goal
  takes a ribbon, resume prompt and "Call it a draw", party needs held during a live bout
  (live and offline), Battle Book in the Collection, battle/circuit/calm songs and per-type
  hit sounds, personality idles (turn screen, Pixel and 3D boards, gallery row), 12 trial maps
  with par hats and a BFS solver test, merged partners as one tall tactics unit, replay codes
  and Save as postcard, dead karate/party-bout keys deleted, Neopia/Atlas `karate:survive:*`
  steps as real survive bouts fought by copies (R0340), slapstick (5 % fumbles, the dizzy
  spiral, pond pushes) and `docs/fight-design.md` (R0363). Edge: Pixel and 3D at desk and
  375×812 all pass, 0 console errors, axe 0 issues on the battle screen, turn mode 55.8–56.6
  fps and a 16×16 tactics board 56.5 fps at 4× CPU throttle.
- *Stubbed:* Pixel board still 13 `drawImage` a frame (R0253 wants ≤3 via WebGL). Story bouts
  are offered from the dojo list, not yet at their campaign beats; the skip-everything
  8-endings replay was not run. The guardian waits on lane B to call `startGuardian` on floor
  5. Fusion has a log line and no transform animation. Sprite gallery idles are Pixel only.
  No Circuit race (R0333, lane A's races). Survive bosses use stand-in species (no Chia art)
  and the NP1 bout was checked in the sim, not clicked through in Edge. Balance harness unchanged (Sprout median ~32).
- *Known bugs / assumptions:* the trials modal is not on the HUD's panel stack (Escape
  doesn't close it; use Close). "S-grade-only trait refresh" read as: the black belt clears the
  moody trait of a Nubbin with an S grade. A load with an unfinished turn bout holds the party's
  needs until it is resumed or drawn. `battle-screen.ts` is ~1,195 lines (split next).
  Hand-over: side-session note `r6-lane-c-handover.md`.

## Round 6 · Lane A FUN (2026-10-29, branch r6/a)

Per-item status in `recs-2026-10-27/STATUS.md`. Edge driver: `node r6a.cjs <pixel|3d>
<desk|phone> 5181` in `recs-2026-10-27/tools`. Skipped for other lanes: R0293, R0298, R0317,
R0326, R0328, R0332, R0340, R0358, R0359, R0362, R0363.

- *Works:* all eight micro-games (escort, climb, puzzle, survive, explore new), `minigame:`
  checks mapped by token, per-verb Do-it labels, a Skip switch on for sprouts (R0294, R0369);
  `hint-button?` checker warning at 0, STYLE.md Hints (R0292, R0339); routine prop gags over
  Keepers, both modes (R0296); distracted walks bonk trunks (R0299); `Line.react` + inferred
  narration reactions, chapter 1 spark (R0303, R0368); goal-met toddle and plop (R0305);
  Journal cairn line + S2 callback (R0313); sprout wrong openers 0, sound words 25.2% of
  scenes (R0320, R0310); Expedition spin, Shell scatter, quips, superlatives (R0324); race
  butterfly stops, 40 rival quirks (R0325); voiced request board (R0327); weather gags
  (R0329); pair play (R0330); Hazel's P.S. on chapter cards (R0334); Multiverse dossiers and
  Neopian Times masthead (R0335); IM1 gags (R0337); grammar helpers (R0341); sarcasm check
  (R0347); toast variants (R0349).
- *Stubbed:* R0299's Keeper hop and splat art; R0303's 50-gag back-fill (one done, 215
  inferred); R0310 at 25% (Atlas sprout files next); R0321's in-world hide (needs lane E's
  R0293); R0325's 3D butterfly (pixel only) and joyful trip; R0334 not read aloud for sprouts;
  R0369's 1.5 s mini animation (the micro-game plays instead).
- *Known bugs:* none found.
- *Assumptions:* gag state is render-side or hashed (no world-rng draws, no save fields; the
  one new setting `microSkip?` is optional); R0341 edited templated strings in `strings.ts`
  in place under the R0341 exception; `render3d/expedition-3d.ts` got the R0324 spin (lane
  D/E-adjacent, two small blocks).

## Standing approval (Maor, 2026-10-12)

"When you finish, proceed straight through to the next development. I'm approving it. Keep
going until you hit the session limit." So after each milestone passes its done-when
checks, start the next one without waiting. Still plan each one briefly in the session
log before coding, still keep the per-milestone commits and checks.

