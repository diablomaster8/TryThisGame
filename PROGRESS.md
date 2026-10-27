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
branch `fix/r1025-merge`, not pushed until Maor OKs (below).

## Play review fixes (2026-10-25, branch fix/r1025-merge)

- **How it was done.** Eleven agents worked on their own branches of origin/main (`fix/r1025-{sim,story,dlg,ui,px,3d,pkA,pkB,dig,boot,txt}`), with the rules in `Test Des/fx-rules.md`. Each re-checked its items first, because the review had run 334 commits behind. The branches were merged in worktree `wt-fx-merge`, origin/main was merged in up to 8df7b8b, and a headless replay (pixel desktop, 3D phone) passes every key check.
- **Assumption (Keeper identity).** All ten trainers always spawn, including the one picked. The player's avatar is Hazel's grandchild in both renderers and in the "You" portrait: a copper mop, freckles and the picked role's outfit colours. Switching Keeper changes only the outfit, the side and the egg line.
- **Story.**
  - Pacing:
    - STORY `breatherMs` 60 s between unrelated scenes, `sideGapMs` 20 s between side stories, FUN `offerGapMs` 240 s.
    - `goalMinMs` 90 s now holds the next chapter, not the closing.
    - A closing answers its goal within `closingSettleMs` 4 s, unless a side story opened in that chapter still needs the time (S31).
    - `sceneTime` waits for the hour that a scene's text names.
  - Seasons follow the chapters (`STORY.chapterSeasons`).
  - Scene guests: Corvin and visitors spawn for their scene (`scene-cast.ts`).
  - No scene starts underground, during minigames or under the loading veil.
  - Meet Ori starts with Ori. The Toy Story plush lines are filtered.
  - No fun quest moves in chapters 9 to 11.
- **Dialogue and guidance.**
  - Skip, which still stops at real choices; hidden in the sprout band.
  - Panels close when a scene starts, and focus moves to the dialogue.
  - An objective chip, plus a "New goal" toast.
  - The Learning Grove "Hear the story" prompt.
  - Seeded portraits for every speaker without a look (`render/portraits.ts`), so no one borrows Fern's face.
- **UI.**
  - Labelled phone action bar.
  - The Hollow bar measures the top bar.
  - Toast queue and dedupe (`tuning-ui.ts`).
  - Race results show standings, prize and a stat tip.
  - Title blurbs, with the graphics picker on top.
  - Touch hint.
  - The cards are now dialogs. Font sizes are in rem.
- **Sim.**
  - A frozen `awaitingKeeper` Nubbin stops sampling happiness.
  - `freeSpot`/`unstickKeeper` frees a Keeper wedged in a blocker; the well's fast-travel spot sat inside its collider.
  - Steering round obstacles, and a `cantReach` event.
  - Story Nubbins can't be fused or re-received.
  - Race rivals never take a roster name.
  - New Hollow floors are pinned at least 2× the old cave.
- **Creatures.**
  - All 151 Gen-1 Pokémon: `species-gen1a.ts` (#1–76, plus Crobat, Bellossom, Politoed) and `species-gen1b.ts` (#77–151, with legendaries rare through `eggWeight`). `skyfang-grown` is now an alias of `skyfang`.
  - The digital line's Versions 2–5 (`species-digi2.ts`, 70 digital species), and the Ver.1 chart fixed.
  - New kit parts in both renderers.
  - The collection book lists ids, not array indices.
  - Rare species stay out of the Hollow.
- **Renderers.**
  - Pixel: painted race sections and fly gap, the Expedition ridge, readable lanes, second-evolution and jewel colours, love/tumble clips, SheetCache LRU.
  - 3D: the grandchild avatar, calm bursts under reduced motion, sculpt backoff, portrait Expedition framing, the X4122 and X3595 shader warnings fixed, decor painted with the kit.
- **Boot.**
  - `loadOnce` retries; a boot error card with one automatic reload.
  - Service worker updates wait for the next load; the first visit's chunks are cached for offline play.
  - The veil goes up from slot pick.
  - woff fallbacks dropped (−12.7 MB in dist).
- **Content.**
  - Holme/Holmes, and Byte seated in q76.
  - Campaign narration split to two sentences a line.
  - c1/c4 clarity fixes, the Learning Grove fixes, and LJ1 varied from LH1.
  - Stroke-guided tracing for every taught kana and Hebrew letter (`ui/hebrew-strokes.ts`).
- **Gate.** 909 tests pass, 11 skipped. Lint and build pass. content-check `problems: 0` (3 long note strings). Script book in sync.
- **Known gaps.**
  - Ver.2–5 champion slot order is from memory.
  - Gen-1 four-legged species still use biped plans and could move to the new `quad` plan.
  - Klee One is not subset.
  - side-story content still loads eagerly.
  - Results depend on time zone.
  - Not yet checked on real phones.

## Story review run 23 fixes (2026-10-27)

- **Works:** 54 of run 23's 55 recs fixed across the Sunny, Python, Bean and Avatar fun quests, S30,
  S31 and the campaign reader band part 2. Fun-quest choices now pay off: FUN_PACK_RULES routes
  Q04, Q06, Q09, Q27 and Q32–Q45, Avatar's Q46–Q48 and Q55 go through choice-payoffs, and S30/S31
  route their variants. content-check warns on unread fun-quest flags and on lessons that run ahead.
- **Partial:** SR-20261027-1304: 91 Q1–Q65 choice flags are still read nowhere (the new warning lists them).
- **Known bugs:** none new.

## Story review run 22 fixes (2026-10-27)

- **Works:** 57 of run 22's 58 recs fixed across S22–S29 and S3's two bands, with the S24–S28 bands
  synced. S24's bird, nest, lights and tick variants now play; S25's spring coda and Moss line queue
  after S25; S24's cage choice gets an answer; new tested payoffs for S22's chimney, S26's bulbs,
  hello and plot, and S27's sold path.
- **Partial:** SR-20261027-1249: Byte's barks and Granny Brock's knock play once (no bark system or
  green-door prop yet); the proposed orphan-scene check in content-check is not written.
- **Known bugs:** c12-wall-garden's Learning Grove lessons never play when it is spliced into c12-open.

## Story review run 21 fixes (2026-10-26)

- **Works:** all 53 of run 21's recs fixed across S14–S21 and S2's two bands, with the S2, S14,
  S18, S20 and S21 bands synced to their mains. Eleven new tested payoffs, among them S16's
  tired-crew choice (s16-week and Hazel's s10-step), S21's lesson at Spindle's ladder, and S14's
  badges in S24.
- **Partial:** none from this run (SR-20261026-939 and -1055 stay open from earlier runs).
- **Known bugs:** none new.

## Story review run 20 fixes (2026-10-26)

- **Works:** all 57 of run 20's recs fixed across S6–S13 and S1's two bands; the S10 and S13 bands
  were synced with their mains. New tested payoffs: S7's lever and stopwatch, Solo's choice in S12,
  the S10 racer and S13's rats. S10's third wish now plays its S1 version once S1 is done.
- **Partial:** none from this run (SR-20261026-939 and -1055 stay open from earlier runs).
- **Known bugs:** S13's levels can play in chapter 11, after Moss may have gone at the Long Night,
  but s13-arrive, the cellar call-down and s13-wheelpit still show him at the mill.

## Standing approval (Maor, 2026-10-12)

"When you finish, proceed straight through to the next development. I'm approving it. Keep
going until you hit the session limit." So after each milestone passes its done-when
checks, start the next one without waiting. Still plan each one briefly in the session
log before coding, still keep the per-milestone commits and checks.

