# Independent review, 2026-10-21

Reviewed at `origin/main` 135cbb4 (deployed build, 2026-10-19). The shared checkout
`Test Des\Test Des` is 36 commits behind it, so all code findings were re-checked on a clean
worktree of `origin/main`. Play: headless Edge (playwright-core) against the deployed site with
`?debug`, Pixel art and Full 3D, at 1280×800 and at 375×812 (touch, DPR 3), plus 812×375. Code,
content and assets were read by Opus subagents, and each finding was re-checked. Disclosure: the
desktop app put the older brief in the parent folder (`Test Des\CLAUDE.md`) into my context
before step 1. I did not act on it until step 5.

## Verdict

Grove is a warm, substantial and largely well-built game. It is not yet the finished v1 the
goals describe.

- **Strengths.** Pixel art mode is the strong one: it held 60 fps with 8 Nubbins even at 4× CPU
  throttle, there were no console errors anywhere, blocked storage is handled gracefully, and
  export, import and reload round-trip exactly. The writing is the best part of the project:
  specific and dry, with choices that really pay off chapters later. The sim is strict, seeded,
  lint-fenced and well tested (594 tests).
- **What holds it back:**
  - **Three gaps in the rules the goals call sacred.** A Nubbin can still become an Eternal
    without earning it, through share codes and through degeneration. Departures after time
    away play out behind the "While you were away" screen. Real-calendar rewards remain.
  - **Full 3D is not yet the same game.** It runs well, but the camera, occluders, an unstaged
    campaign and a dark Hollow make it harder to read than Pixel.
  - **New-player confusion** in the first minutes: dead buttons before the first hatch, and
    language quests that their own scenes don't complete.
  - **No real phone has ever run it.**
- **Recommendation.** Fix the five sim and boot majors below, then run the G11 device pass, and
  keep Pixel as the default until Full 3D passes it.

## Bugs

### Major

1. **Departures run behind the "While you were away" screen.**
   - Steps: Indefinite mode with departures off and two children; close, move the clock on 2
     days, reload, continue.
   - Expected: the waiting Nubbins' end-of-life check plays on screen once the player is back.
   - Actual: the first live step runs `runEndOfLife` (`sim/lifecycle.ts:43-45`) while the away
     modal is still up. "…is fading softly…" toasts pass under it, the roster ends at 0/8, and
     the cocoon is never seen.
   - Evidence: `scratchpad/pixel/aw00.png`, `aw12.png`, `aw20-empty.png`.
2. **Forged share codes can carry an Eternal.**
   - `nubbinProblem` (`sim/save.ts:356-380`) and `validateWorld` (`save.ts:311`) never check
     `eternal` against `rebirths`, form or type.
   - Steps: build a code with `eternal:'sun', rebirths:0`; the checksum is a public FNV hash.
     Redeem it.
   - Expected: rejected. Actual: an Eternal joins the roster.
3. **Eternals can be cloned.**
   - Share (copy) is offered for every roster Nubbin (`ui/roster.ts:119-125`), so once Moss
     comes down (`mossDown`), or with any player Eternal, the same code can be redeemed again
     and again, in any Grove.
4. **Degeneration keeps the Eternal flag.**
   - `degenerate` (`sim/degeneration.ts:29-50`) never clears `eternal`, and `evolve` never
     clears it either.
   - Path: the Dawn & Dusk storyline (`storyline-rules-dawndusk.ts:12-13`).
   - Result: an Eternal egg or child, an Eternal Swim or Fly adult, and a second grade upgrade
     in one life.
   - First reported as item 26 of the 2026-10-18 review; never fixed.
5. **Painted ground is lost on reload in Pixel mode.**
   - Steps: paint tiles, reload.
   - Expected: the same ground. Actual: unpainted. `render/grove-scene.ts:303` starts from
     `{}`, and `setTiles` runs only on a `tilePainted` event (`game.ts:414`). Full 3D rebuilds
     from `world.tiles`.
   - `replaceWorld` (`game.ts:308-315`) also skips the tiles and `syncDungeon` after import or
     reset.
6. **The game freezes if the tab is hidden during load catch-up.**
   - `resume()` returns early while `catchingUp` (`game.ts:347-349`), and `catchUpOnLoad` never
     calls `start()`.
   - Steps: come back after a long gap, switch tabs during the catch-up bar, switch back.
   - Actual: frozen until the next hide and show.
7. **Expedition and Races do nothing before the first hatch.**
   - Steps: fresh Free Grove, tap 🧭 or Races → Tier 1.
   - Expected: a message. Actual: silence. A new player meets this in the first minute.
   - Evidence: `scratchpad/threed/ph-exp0.png`, `ph-race.png`.
8. **Language quest steps are not completed by their own scenes.**
   - Steps: Learning Grove → Meet Hana, play "Bow and say konnichiwa".
   - Actual: the quest stays at 0/6. It advances only via Journal → Capers → "Do it". The next
     hint ("Tap a Nubbin and say こんにちは") names an action that doesn't exist.
   - From a fresh slot, Chapter 1 (about 25 lines and a quiz) also plays before Hana arrives.
9. **Desktop drag-to-lift is unreliable, and can lock input.**
   - About 3 in 4 drags on a wandering child miss, with no hover cursor.
   - There is no `setPointerCapture` and no `pointerleave` reset (`input/game-input.ts:87-93`).
     A mouse released over the HUD or outside the window leaves `pointerCount` at 1 or more, so
     every later tap reads as a second finger (`:181`) until reload.
10. **Full 3D hides the subjects of key moments.**
    - The follow camera puts the Keeper in front of a newly evolved or hatched Nubbin
      (`threed/evo-grid.png`, `d-hatched2.png`).
    - A lantern post covers the Keeper and the Nubbin for the whole of chapter 2
      (`threed/c2-grid.png`, checked).
    - Trunks and canopies fill the foreground.
11. **Campaign scenes are not staged in Full 3D.** The text has the gate, Corvin, Sable, dusk and
    night; the screen keeps the same daytime Grove with NPCs wandering (`threed/c1-grid.png`).
12. **The Full 3D Hollow is too dark to play.** Stairs, strays and loot are hard to see
    (`threed/hollow-grid.png`, checked). Pixel's lit map shows everything.
13. **Blocked storage silently drops Full 3D.** Picking Full 3D with storage throwing starts the
    game in Pixel with no notice (`threed/blk-game.png`).

### Minor

14. The 3D memorial is a pink sphere on a stick, lost in the grass (`render3d/actors.ts`
    ~815-838).
15. A campaign building in 3D is an untextured brown box (`threed/c1b-end.png`).
16. The 3D race is an oblique view from behind, not the side view; Pixel's lanes are clearer.
17. 3D Expedition pickups are pale blobs against the sky. Results screens are text only.
18. A held egg reads "Hatches in 0s" for good; it hatches only when put down, and nothing says
    so. On the egg's sheet, Shake stays disabled until Pick up, with no hint.
19. Photo mode in Full 3D captures the 2D sprite, and its footer spills past the frame. Roster
    and dialogue portraits are pixel art in 3D.
20. The weather toast "The sky clears." shows underground and inside minigames.
21. "Dew felt lonely. (A slip.)" fires mid-race, while the player is playing with Dew.
22. Race labels clip at 375 px ("IM" for SWIM) and names overlap sprites. In landscape, Cheer
    covers the bottom lanes.
23. The Expedition never says "tap to jump, hold to jump higher". In portrait its playfield is a
    thin strip.
24. Feed spends fruit on a 99%-full Nubbin with no warning.
25. The phone camera starts so close that the second egg and the trees are off screen.
26. Desktop keyboard hints show on a touch phone in landscape (`pixel/p19-land.png`).
27. The phone dialogue box is 383 px wide on a 375 px screen.
28. The way home from a neighbour's Grove is buried (More → Neighbourhood → Go home); Esc does
    nothing.
29. Journal "Do it" opens the scene on top of the still-open Journal.
30. A language line waits about 90 s for in-game dusk with no cue (Hana, "oyasumi").
31. Tracing guides on き sit off the glyph (`pixel/p34-trace3.png`). Tracing is a Journal button,
    not part of the scene that asks for it.
32. Japanese inside italic narration renders as synthetic italic.
33. There is no way to change the Learning Grove age band, though the age screen says a
    grown-up can.
34. Import gives no visible confirmation after its `confirm()`. An invalid hours value stays in
    the field after the inline error.
35. Hidden celebration cards and "Back to the Grove" buttons pile up in the DOM (duplicate
    buttons for screen readers).
36. Catch-up ignores the autumn fruit multiplier and `greenThumb` (`sim/offline.ts:94`), so
    away time and live play diverge.
37. A saved Keeper intent (pet, feed, hug) replays during catch-up; `validateWorld` doesn't
    clear `keeper.intent`.
38. Normal critters and essences add no Normal lean (`sim/critters.ts:60,68`).
39. `roundAlignment` rounds halves up (`sim/alignment.ts:5-13`): an imported −0.105 becomes
    Eternal Neutral, while +0.105 does not.
40. Debug: Force evolve accepts a cocoon (`world.ts:494`); Force end of life does nothing for
    long-lived Nubbins (`world.ts:504`); "Back to title" drops `?debug`.
41. `joinTeam` resets points with no sim-side guard (`sim/teams.ts:24`).
42. Camera shake and CSS animations follow only the OS reduced-motion setting, not the in-game
    one (`game.ts:411`; `style.css` keyframes).
43. Music keeps playing in a hidden tab; nothing suspends the AudioContext.
44. `exitFullscreen` is uncaught (`ui/hud.ts:518`). In `public/sw.js:47/63/76`, `cache.put` is
    neither awaited nor caught (206 Range responses).
45. Each Hollow floor leaks about 20 materials in Full 3D (`render3d/hollow.ts:32`, `:424`).
46. There is no global `error` / `unhandledrejection` handler. `main.ts:174-185` shows the
    graphics-failure card for any boot error.
47. `tests/sim/chunk-retry.test.ts` timed out under the full parallel run (it passes alone in
    2.2 s): a flaky gate.
48. On every 3D load, Edge/D3D11 logs an ANGLE shader warning (X4122 "sum … cannot be
    represented accurately").

## Missing against the goals

| Goal        | What is missing                                                                                                                                                                                                                                                                                                                 | Evidence                                                                                                                                                                                                                                                                                                                             |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 2           | Eternal can happen by accident or by forgery                                                                                                                                                                                                                                                                                    | Bugs 2–4, 39                                                                                                                                                                                                                                                                                                                         |
| 3           | Same feedback in both modes: framing, campaign staging, Hollow light, memorial, race view, photo and portraits                                                                                                                                                                                                                  | Bugs 10–17, 19                                                                                                                                                                                                                                                                                                                       |
| 5           | Any real-phone frame-rate or load measurement; no `?bench`, no `tests/e2e`                                                                                                                                                                                                                                                      | `tests/` has no e2e folder; plan G11 never run                                                                                                                                                                                                                                                                                       |
| 5           | 44 px everywhere: native selects are 19–33 px tall (Settings ×6, title Graphics, Keeper profile, Rebirth keeps, scarf)                                                                                                                                                                                                          | Pixel run, tap-target table                                                                                                                                                                                                                                                                                                          |
| 5           | One-thumb reach: every panel's Close, Stop and Leave sits at the top of the screen                                                                                                                                                                                                                                              | Both runs                                                                                                                                                                                                                                                                                                                            |
| 5           | Reduced motion fully honoured                                                                                                                                                                                                                                                                                                   | Bug 42                                                                                                                                                                                                                                                                                                                               |
| 6           | Departures-while-away shown to the player; painted Grove survives reload                                                                                                                                                                                                                                                        | Bugs 1, 5                                                                                                                                                                                                                                                                                                                            |
| 7           | No timed rewards                                                                                                                                                                                                                                                                                                                | Real seasons gate rewards (`sim/seasons.ts`: summer ×2 race prizes, spring half-price eggs and ×2 rare eggs, autumn- and winter-only egg colours); weekday and market-day fun quests (`fun-quests.ts:136-140`); a Saturday-only achievement (`daily.ts:62`, `achievements.ts:28`); visitor gifts at one per real day (`daily.ts:26`) |
| 7 (decided) | Maor, 2026-10-21: daily refreshes, free daily gifts and season festivals are allowed; only repetitive daily quests are out. The rule text was updated in CLAUDE.md, `docs/brief.md`, `docs/canon.md`, `docs/content-index.md`, `STORY-BIBLE.md`, `plan.md` and the backlog prompt, so the timed items above are no longer gaps. | —                                                                                                                                                                                                                                                                                                                                    |
| 8           | Language quests completed by playing them; working Hebrew tracing not confirmed in play                                                                                                                                                                                                                                         | Bug 8; Ori's tracing step not reached                                                                                                                                                                                                                                                                                                |
| 10          | Small modules: 14 files over 800 lines (`style.css` 2048, `world-view.ts` 1474, `tuning.ts` 1399, `strings.ts` 1374, `chao.ts` 1159, …). No lint ban on `Date`/`new Date` in `src/sim`                                                                                                                                          | `eslint.config.js:23-51`                                                                                                                                                                                                                                                                                                             |

## Risks

- **Performance.**
  - Full 3D: 1.66 M triangles and 323 draw calls with 8 Nubbins on desktop. At 375×812 with
    4× CPU throttle it averaged 48.7 fps, with 9 frames over 50 ms and the governor dropping to
    345×747 (visibly soft). Sculpting continues for about 25 s after the veil lifts.
  - Pixel held 60 fps at 4× throttle.
  - None of this is a real phone.
  - Bundle: the eager chunk is 372 kB gzip; `side-story-content` (425 kB gzip) blocks every
    boot; a Learning Grove slot loads `edu` (3.1 MB gzip) before play; the Atlas chunk is
    931 kB gzip.
- **IP.** Licences are approved, and `CREDITS.md` plus `public/licences/` cover three.js and
  the three OFL fonts. Open items:
  - `docs/reference/chao-world-lineup.jpg` is a franchise image committed to a public repo with
    no source record (not shipped).
  - `public/audio/lang/README.md`, a developer note, is deployed.
  - Q37's Sunny song copies the shape of a well-known show song (original words, 18+).
- **Kid safety.**
  - Gating is solid: Mature content defaults to Off, has a grown-up gate, and the Learning
    Grove sees `all` only.
  - `?debug` opens the cheat panel on the live site for anyone, and triple-tap on the logo
    then works too.
  - Side stories are not filtered by the Mature setting (`sim/side-stories.ts:495`). That is
    safe today, but a future teen side story would slip through.
- **Data loss.**
  - Bugs 1 (a whole roster departs unseen), 5 (painted ground) and 6 (freeze).
  - The shared checkout is 36 commits behind `origin/main`, with an unpushed commit (84b48c1,
    the Kenney survey) and uncommitted edits. Anyone who builds or pushes from there ships
    stale code or forces a messy merge.

## Improvements, ranked by value against cost

1. **Hold end-of-life checks until the away screen closes.** A small change in `game.ts` and
   `lifecycle.ts` that fixes goal 6.
2. **Validate `eternal` in `nubbinProblem`; clear it in `degenerate`; make Eternals unshareable.**
   About three lines plus tests, and it closes goal 2.
3. **Apply `world.tiles` on Pixel load and in `replaceWorld`; restart the loop after catch-up.**
   Small, and fixes two data bugs.
4. **Explain the dead Expedition and Races buttons, and complete language steps from their
   scenes.** Small, with the biggest first-ten-minutes win.
5. **Pointer capture in `game-input.ts` and a bigger pick radius.** Small; ends the input lockout
   and the missed grabs.
6. **Replace native selects with 44 px segmented buttons, and move panel Close to the bottom on
   phones.** Medium; finishes goal 5's touch rules.
7. **Make seasons cosmetic only, and drop the weekday gates.** Small; brings the code in line
   with the no-chores canon.
8. **Full 3D readability pass:** camera framing on events, occluder fade for lanterns and posts,
   Hollow lighting, a real memorial flower. Medium; the gate before 3D can be the flagship.
9. **Run G11:** `?bench`, Playwright smoke tests in both modes, one real mid-range phone.
   Medium; the only way to prove goal 5.
10. **Split `side-story-content` and `edu` by chapter or band.** Medium; faster first loads,
    above all for Learning Grove slots.
11. **Bring the campaign narration under two sentences a line.** Medium (writing); 26–31% of
    campaign lines run over.
12. **Split the files over 800 lines.** Low value now; do it opportunistically.

## What the notes get wrong

- **PROGRESS.md "Full 3D art push 1/2":** says both are "on branches awaiting Maor's merge".
  Both (fcd00d1, 135cbb4) are on `main` and deployed since 2026-10-19.
- **PROGRESS.md status** is dated 2026-10-18 and lists "Known bugs: none new". This review
  found 13 majors.
- **"Part Z ran … its fixes are going in pass by pass":** item 26 of that review (a degenerated
  Eternal stays Eternal) was never fixed. `degeneration.ts` is unchanged since 2026-10-17.
- **CLAUDE.md: "no daily or weekly quests, timers … every reward is one-time or unlimited",
  backed by `no-chores.test.ts`:** real-calendar seasons, weekday fun quests, the Saturday
  achievement and one-gift-per-real-day visitors still gate rewards. The test doesn't cover
  them.
- **CLAUDE.md, narration "at most two sentences":** 26% of `campaign-book1` and 31% of
  `campaign-book3` narration lines run longer.
- **plan.md "Review: what is complete", Full 3D "feature for feature" (also
  `renderer-decision.md`):** true for the event list, not for what the player sees (Bugs 10–17).
- **Settings and the age screen:** the age screen promises the band can be changed later;
  nothing in Settings does it.
- **Notes that don't know:**
  - The shared checkout is 36 behind `main`, with an unpushed commit and uncommitted edits.
  - The parent-folder `Test Des\CLAUDE.md` is an older brief ("Current plan 2026-10-15", "Open
    decisions: none") that the desktop app loads for sessions opened one level up, and it
    contradicts the repo's CLAUDE.md.
  - `chunk-retry.test.ts` is flaky under load.
  - Edge logs a shader warning on every 3D load.
- **`vite.config.ts` comment ("Three.js alone is ~540 kB… expected"):** stale; the eager chunk
  is 1.27 MB raw.

## What surprised me for the better

- The writing. Hazel's voice, Fern's stone, "Rule four. Don't be Sparks." Wisp's pity choice in
  S2 decides who unmakes the stone in chapter 10. That is a real payoff, not a flag nobody
  reads.
- The Learning Grove's craft:
  - every sprout line has 14 words or fewer;
  - death is said plainly, with comfort straight after;
  - quotes are swapped through `childLines`;
  - about 60 Hebrew words, niqqud included, checked with no errors;
  - `<bdi>` isolation, and stroke-order kana tracing.
- Resilience: blocked storage shows a clear banner and a "Not saving" chip; unreadable saves
  are backed up before autosave can overwrite them; a WebGL failure offers a switch to Pixel;
  the service worker now uses a build-id cache.
- Switching Pixel ↔ Full 3D mid-game is instant and loses nothing. Critter parts (sheep ears,
  seal flippers) carry into 3D.
- Code discipline: `strict` plus `exactOptionalPropertyTypes`, with no `any`, `ts-ignore` or
  eslint-disable in the sim. Lint enforces the sim boundary. Lint was clean across 563 files,
  and 582 of 583 tests that ran passed (11 skipped; the one failure is the flaky timeout in Bug 47).
