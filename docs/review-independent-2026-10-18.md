# Independent review, 2026-10-18 (plan.md Part Z)

Reviewer: Claude Opus 5.5 as the main reviewer (the brief names Fable 5.1), with five Opus 5.5
subagents for deep reads by folder. Build reviewed: the deployed site
(`assets/index-DPM20uwi.js`) and repo `main` at `78106aa`. The working tree was not clean:
another session had uncommitted edits in `script-book/` and `tests/tools/`. Report only:
nothing else was changed.

**How far the review got.** Read these limits before the findings.
- **The browser pane was hidden for the whole session.**
  - The game got 0–6 frames a second, so I measured no frame rates.
  - Races, the Expedition and the dungeon could not be played to the end.
  - Story scenes advanced one frame per screenshot.
- **Play time.** About 40 minutes of wall-clock play, mostly Pixel, at ×100 and ×1000. The
  sizes were 1280×800 and 375×812. Full 3D got about 5 minutes, in the campaign slot only.
- **"Block storage and reload".** I couldn't block storage before the page loaded. Instead I
  made storage throw at runtime, and I read the code for the load path.
- **Anchoring.** An older parent-folder `CLAUDE.md` was loaded into my context at the start,
  before step 5, against the brief's rule. I judged the findings against the ten goals only.
- **Labels.** Each finding is tagged **[played]**, **[code]** (read by me),
  **[sub, verified]** (a subagent found it and I checked the code) or **[sub]** (subagent
  only).

## Verdict

Grove is a charming game with a sound core:
- The sim and the renderers are kept apart by lint rules, and the sim is seeded and runs in
  fixed steps.
- 429 tests pass in 12 s, and lint and build are clean.
- The writing is often literary.
- The pixel mode plays well and looks lovely on desktop and phone.

It does not yet meet its own goals:
- **A blocker in offline catch-up** lets a Nubbin depart while the game is closed even when the
  player has forbidden it.
- **The service worker never changes its cache name.** After a deploy, a returning player can
  get an old shell that asks for deleted chunks, and with no import error handling that ends on
  a blank screen.
- **The game still runs rewards the rules forbid:** a daily request board, a weekly team mission
  and a "Today's Hollow".
- **The 18+ setting has no parental gate.**
- **Full 3D lacks hats, critter parts and accessories.**
- **No phone frame rate has ever been measured**, and this review couldn't measure one either.
- **Several storylines the notes call done are not in the shipped game:** the Multiverse,
  Neopia, the Arcade and Q66–Q95.

Most of the fixes are small. The two blockers and the parental gate are each a few lines.

## Bugs

### Blockers
1. **Departures while away, even when forbidden.** [sub, verified] `src/sim/offline.ts:35`
   - **Steps:**
     1. Raise an unloved adult close to the end of its life.
     2. Set "Aging while closed" to Indefinite, with departures off.
     3. Close the game for a gap that isn't a whole number of minutes (for example 1 day + 55 s),
        or for under 3 minutes.
     4. Reopen.
   - **Expected:** the Nubbin waits (`awaitingKeeper`), and its end-of-life check runs on screen
     in live play.
   - **Actual:** the leftover under one minute runs through `stepWorld`, which calls
     `advanceStage(..., offline=false)` (`world.ts:825`, `lifecycle.ts:45`). The Nubbin departs
     inside catch-up, a memorial already exists, and the away screen lists the departure. The
     tests only use whole-minute gaps.
2. **Stale service worker after every deploy.** [code] `public/sw.js:4`
   - **Steps:** load the site once; deploy a new build; reopen and enter the Learning Grove or
     Full 3D.
   - **Expected:** the new build.
   - **Actual:**
     - `CACHE = 'grove-v1'` never changes. The comment says it changes "via the query below",
       but there is no query (`main.ts:189`).
     - Navigations are stale-while-revalidate, so the old `index.html` loads and asks for hashed
       chunks that GitHub Pages has deleted.
     - The dynamic imports have no `.catch` (`main.ts:103-109`, `story-scenes.ts:137,193`), so
       the screen stays blank, or "stage loading" stays up forever.
     - The cache also grows by up to about 38 MB on every deploy.

### Major
3. **The "While you were away" Continue button can't be tapped during a story scene.** [played]
   - **Steps:** in a Hazel's Grove slot whose eggs are about to hatch, close for 2+ minutes and
     reopen while the chapter text is showing (Full 3D, 1280×800).
   - **Expected:** Continue closes the summary.
   - **Actual:** the story's `.dialogue` element sits on top of the button
     (`elementFromPoint`). Each tap advances the story instead, and the summary stays open. The
     same layer covers the stats sheet's Praise, Tuck in and Call buttons.
4. **Opening `?edu` erases a save.** [sub, verified] `src/main.ts:48-58`
   - **Steps:** open `…/TryThisGame/?edu` in production.
   - **Actual:** Learning Grove slot 1 is cleared with no confirmation (`?slot=n` picks another
     slot).
5. **An unreadable save is silently replaced.** [code] `src/game.ts:180-193`
   - **Steps:** have a corrupt save, or one from a newer version, and load it.
   - **Expected:** a warning, with the old save kept.
   - **Actual:** the game logs a `console.warn` and starts fresh, and the autosave 30 s later
     overwrites the old save. Nothing is backed up.
6. **Rebirth vs departure is skewed toward live play.** [sub] `world.ts:863`, `offline.ts:91`
   - Lifetime happiness is sampled once per second in live play but once per minute in
     catch-up. An hour away counts as one minute.
7. **"Receive a Nubbin" crashes where `prompt()` is blocked.** [played] It throws `Uncaught
   Error: prompt() is not supported` (the `receive` handler). This happens in embedded views and
   some installed web apps.
8. **The catch-up progress indicator never shows.** [code] `game.ts:196-205` shows and hides it
   in the same synchronous task, so it never paints.
9. **Keys keep working under open panels and minigames.** [sub] `input/game-input.ts:159-171`
   - Expedition jump keys also walk the Keeper behind the overlay.
   - Space is blocked from activating focused buttons.
   - Keys are matched with `e.key`, so WASD fails on a Hebrew layout.
   - Q and E rotate the camera while you type a name (`camera-controls.ts:42`).
10. **Expedition jumps only register on the letterboxed canvas.** [sub] At 375×812 that leaves
    about 150 px dead at the bottom, in the thumb zone (`expedition/screen.ts:66-73`).
11. **Pixel sprites can silently vanish.** [sub] The 4096² atlas only grows and never evicts.
    Each parts, hat or dye change adds a sheet (about 25 fit), and once the atlas is full,
    sprites are skipped until reload (`mega-atlas.ts:52-63`, `sprite-batch.ts:162`).
12. **Full 3D leaks GPU memory.** [sub] Every egg, cocoon, fruit, notebook and toy gets its own
    geometry and material, none disposed (`render3d/actors.ts:310-331, 553, 610-630, 784-788`).
13. **Full 3D creatures stayed white capsules.** [played, starved frames only] With the frame
    supply starved, the loading veil lifted while the three Nubbins were still capsules. On a
    path in Hazel's Grove they read as headstones. If a slow phone stalls sculpting the same
    way, this breaks "no death imagery". Check it in the device pass.

### Minor
14. **Memorials lose their form.** [sub, verified] `lifecycle.ts:324` stores the literal
    `` `eternal:` `` / `` `:` `` (the template placeholders are missing). The memorial shows the
    wrong form forever.
15. **Milestone code in player text.** [played] The stats sheet says "Nothing to give yet.
    Expeditions (M4) bring Critters and Essences."
16. **A Feed tap is ignored right after fruit arrives.** [played] Tap Feed within about 300 ms
    of getting fruit: the label still reads "Feed (0)" and the tap does nothing. The second tap
    works.
17. **Pocket shows a phantom Nubbin.** [played] With no Nubbins left, Pocket shows a generic
    "Nubbin" with need meters.
18. **Stale request.** [played] The Requests board shows "Pet a Nubbin 6 times · from Fig" after
    Fig has departed.
19. **Wrong copy in the Gym.** [played] Without a Nubbin it says "Hatch a Nubbin first; it goes
    on the Expedition."
20. **Beetle Run keeps running after you leave.** [played] Opened from More and left via the
    menu flow, it kept running under the HUD ("Cargo 0/8 · Hits 0/6") and Escape didn't close
    it. Its results dialog then stacked over the Races dialog.
21. **Changing Graphics drops you at the title.** [played] Doing it in Settings reloads to the
    title screen, not back into the slot.
22. **Seasons contradict.** [played] Chapter 1 opens on "Late spring", while a real-calendar
    toast says "Autumn harvest: fruit falls twice as fast."
23. **Toast nits.** [played] "The sky clears." stacked three times. "Nubbin is fading softly…"
    uses the generic noun instead of the name.
24. **"Meet Hana" opens the campaign instead.** [played] In the Learning Grove (7–10), it starts
    Chapter 1, with Hazel's letter and the hill where each flower is "for someone who has died".
    It also silently resets the Keeper to Fern (`ui/lang.ts:116-125`). Hana did not appear in
    the first dozen lines.
25. **Grade upgrades can stack on one stat.** [sub] The "well raised" step can upgrade the same
    stat as evolution did, and neither upgrade is recorded in `gradeUpgrades`
    (`lifecycle.ts:111-116`).
26. **A degenerated Eternal stays Eternal.** [sub] `degenerate()` keeps `eternal`
    (`degeneration.ts:30-50`).
27. **A missing timestamp hangs the game.** [sub] A save without `savedAtWallMs` catches up
    about 56 years (`save.ts:116`), which hangs in Indefinite mode.
28. **Reload is not exact for some state.** [sub] `validateWorld` resets `edu.playedMs` and
    re-homes trees and NPCs on every load (`save.ts:204, 228-246`).
29. **Import is shallow.** [sub]
    - It checks only the top-level fields, so `nubbins: [{}]` passes.
    - There is no size limit and no confirmation.
    - A save from one mode can be imported into another mode's slot.
    - A save can carry `matureContent: 'adult'`.
30. **Small leftovers.** [played/sub]
    - The debug panel has 12 unlabelled 36 px chapter buttons.
    - The canvas `aria-label` is "Grove test scene".
    - `settings.ts:226` removes a listener with a new arrow function, which removes nothing.
    - The Fly flap animation is never selected in either mode (`world-view.ts:1384`).

## Missing against the goals

| Goal | What is missing | Evidence |
| --- | --- | --- |
| 3 | **Full 3D draws:** no critter parts, hats, scarves, glasses or dye; no character looks; no co-op second Keeper; no sad pose; no dizzy, surprised or love reactions; one egg shape for every family. **The modes disagree on the Keeper's look:** 3D shows Sun or Moon by alignment, Pixel shows the chosen Keeper. | [sub] `render3d/looks.ts`, `creature-pool.ts:72-75`, `actors.ts:685`; `sheets.ts:180` |
| 4 | **Missing in both modes:** the Chaos forms (no code anywhere); jewel Chao (only in the samples catalogue, not among the sim's egg colours). | [sub] `sim/nubbin.ts:8` |
| 5 | **Performance:** no phone fps in either mode, ever (`docs/device-pass.md` has none); no 3D phone quality tier. **Load:** the Learning Grove waits for one 9.36 MB chunk (3.06 MB gzip). Klee One ships unsubset (1.9 + 2.0 MB woff2) for kana tracing alone. | [code] build log; [sub] `sky.ts:45`, `grove-3d-scene.ts:198-263` |
| 5 | **One-thumb play:** `.btn-small` is 36 px and used in 18 player-facing files. At 375 px the top bar wraps into three rows in the top-right, out of thumb reach. | [played] screenshot at 375×812; [sub] `style.css:194-199` |
| 5 | **Reduced motion:** the in-game setting doesn't reach the camera snaps and zoom, the CSS toasts and celebrations, scenery sway or most 3D motion. Camera shake ignores it. | [sub] `camera.ts:79-90`, `game.ts:304`, `grove-scene.ts:640-650` |
| 5 | **Accessibility:** modals have no `role=dialog`, no focus trap and don't return focus. Meters have no value for screen readers. The 21 title slot buttons are all named "Slot N · Empty New", with no mode. | [played]; [sub] `ui/dom.ts:21,38-65` |
| 6 | **Saves:** departures while away (Bug 1); the never-painted progress indicator (Bug 8); the unreadable-save overwrite (Bug 5); reload not exact for edu time, trees and NPCs (Bug 28). | above |
| 7 | **Rewards on a real-day timer:** a daily request board ("Three asks a day", Shells and sometimes a rare egg, `sim/quests.ts:11`); weekly team missions (`teams.ts:56-74`); the "Today's Hollow" daily seed (`dungeon.ts:536-575`); visitor gifts released one real day at a time (`daily.ts:26-33`); weekday or weekend-only fun quests; real-night energy drain (`curfew.ts:22`). | [played] Requests screen; [code] |
| 7 | **Mature content is not parental:** it is three radio buttons, so one tap reaches 18+, described as "violence and crude humour". The Learning Grove's sum gate (`ui/edu.ts:316`) isn't reused. | [played] Settings |
| 7 | **Story worlds that don't ship:** the Multiverse, Neopia, the Arcade PA1–PA5 and Q66–Q95 are scripted but not imported by the game. Pixel's cabinet says "The cartridge shelf is empty for now", and the 18+ description promises a Multiverse that isn't there. | [played]; [sub] `src/content/index.ts` is only imported by tests; `dist/` grep |
| 7 | **Story worlds that will write the Grove:** Neopia's faerie blessings give a Nubbin a stat level, and its herb bed and storm lantern change the Grove. Q66–Q95 aren't covered by the chapter 9–11 gate (`audience.ts:43`). | [sub] `neopia-quests.ts:5-8,133-675` |
| 8 | **Learning Grove gaps:** the 7–10 band gets the same activity games as age 6 (letter names, counting, shapes). Read-aloud covers story lines only, not menus or toasts, so a 3-year-old can't navigate alone. Hebrew and Japanese are reachable only through the campaign. | [played] |
| 9 | **Choices and quotes:** 10 choice flags in S1, S3, S4 and S5 are never read anywhere (`s1-asked-why`, `s1-pace`, `s1-sat`, `s3-byte`, `s3-seat`, `s3-shown`, `s4-gate`, `s4-swim`, `s5-carry`, `s5-holder`). The Alice pack quotes Carroll verbatim under a header saying the quotes are "not yet checked". PA1 has two lines marked "[unverified]". | [sub] `side-stories-fun.ts`, `quests-alice.ts:5-8`, `arcade-pa1.ts:45-49` |
| 9 | **Song lyrics:** there are original song lyrics (the Lantern Song, Nova's songs, Hana's bow song, Q47 "Under the hill", titled "The Secret Tunnel"). Q37 is a line-for-line parody of a show song's structure ("SUN KEEPER! (hey! hey!)"). The goal says "no song lyrics", without limiting it to copied ones. | [sub] `campaign-book1.ts:584-592`, `quests-sunny.ts:1125-1160` |
| 10 | **Modules over about 800 lines:** world-view.ts 1455, style.css 1811, tuning.ts 1183, chao.ts 1074, types.ts 969, grove-scene.ts 948, audio.ts 947, hud.ts 940, dungeon.ts 917, world.ts 911, actors.ts 901, decor.ts 836. **Tests don't cover:** odd-length catch-up gaps; real old-shaped saves (migrations are tested by relabelling a current save, and 1→2 not at all); "Eternal never by accident" end to end; the time scale clamp. **Elsewhere:** the sim uses the local time zone. `src/samples/` is production code under a misleading name. | [sub] |

## Risks

- **Performance**
  - **Full 3D on phones:** a 2048² PCF shadow every frame, bloom + grade + SMAA at DPR 1.5,
    transmission on water, lanterns and cocoons (an extra opaque pass), and 11 point lights at
    all times. There is no quality tier.
  - **Wasted memory in 3D:** a 4096² pixel atlas canvas is still allocated, right at iOS's
    canvas limit.
  - **Pixel hitches:** each new sprite sheet re-uploads the 64 MB atlas.
  - **Learning Grove on low-end phones:** 9.4 MB of JavaScript to parse.
  - None of this has been measured.
- **IP:** licences are cleared (Maor, 2026-10-17).
  - There's no credits screen. The OFL fonts ship without their licence notice, and three.js
    (MIT) isn't credited.
  - `public/audio/lang/placeholder.wav` has no recorded source.
  - No copied lyrics were found.
- **Kid safety**
  - One tap unlocks 18+, and an imported save can carry the 18+ setting.
  - A child who taps "Meet Hana" starts with a grief chapter.
  - Starved 3D sculpting shows headstone-like capsules (Bug 13).
  - In the age 3–6 version of `c10-wisp`, a lesson interrupts a tense moment
    (`edu-campaign-3-sprout.ts:852-877`).
- **Data loss**
  - Bug 1 (departures while away).
  - Bug 2 (a blank screen after a deploy).
  - Bug 4 (`?edu` wipes a slot).
  - Bug 5 (an unreadable save is overwritten).
  - Import overwrites without confirmation, even across modes.

## Improvements, ranked by value against cost

1. **Run the leftover catch-up step offline and test odd gaps** (Bug 1). Do it first: high
   value, about 10 lines.
2. **Fix the service worker:** cache name with the build hash, navigations network-first,
   delete old caches on activate, and catch failed imports with a "reload" prompt. High value,
   low cost.
3. **Put the Learning Grove's grown-up gate in front of Mature 13+/18+** and drop
   `matureContent` from imports. High value, low cost.
4. **Back up an unreadable save** to a side key before starting fresh, and confirm imports with
   a mode check. High value, low cost.
5. **Remove the `?edu` slot wipe in production builds.** High value, trivial.
6. **Make every timed reward one-time or unlimited:** the daily board, weekly missions, Today's
   Hollow and calendar-paced gifts. High value, medium cost.
7. **Run the G11 device pass with real phones** and 8 Nubbins in both modes, then add a 3D phone
   tier (no shadows or transmission, DPR 1). High value, medium cost.
8. **Split the edu chunk by band and storyline, and subset Klee One to kana.** High value,
   medium cost.
9. **Put the story dialogue layer under modals** (z-order or pointer-events). Medium value, low
   cost.
10. **Add global `error`, `unhandledrejection` and `webglcontextlost` handlers** with a friendly
    reload message. Medium value, low cost.
11. **Decide about the unshipped worlds:** ship the Arcade and Multiverse, or hide the empty
    cabinet and the 18+ Multiverse promise. Medium value, medium cost.
12. **Wire the 10 dead choice flags, or cut those choices.** Medium value, medium cost.
13. **Raise `.btn-small` to 44 px** and give portrait phones a bottom action bar. Medium value,
    medium cost.
14. **3D parity: draw parts, hats and accessories.** Medium value, high cost.
15. **Sample lifetime happiness per sim ms, not per step.** Medium value, low cost.
16. **Fix the memorial form template and replace `prompt()`.** Low value, trivial.
17. **Housekeeping:**
    - remove "(M4)" from the player text and fix the canvas label
    - delete `creatures-legacy.ts`
    - move the live files in `src/samples/` to `render3d/`
    - split the 900+ line files

    Low value, low cost.

## What the notes get wrong

- **PROGRESS.md says CV1–CV6 are wired and every storyline is scripted.** The Multiverse,
  Neopia, PA1–PA5 and Q66–Q95 don't reach players: `src/content/index.ts` is imported only by
  tests, and the cabinet is empty.
- **The notes say timed rewards are gone.** CLAUDE.md says "no daily or weekly quests" and "daily
  gifts are one-time (CV6)", and plan.md says "one-time story gifts in place of once-a-day
  rewards". `sim/quests.ts` still opens "The daily board… refreshed each real day", and
  `teams.ts` (weekly) and `dungeon.ts` (Today's Hollow) are untouched.
- **CLAUDE.md says the 3D mode lives "today in `src/samples/` behind URL flags; later
  `src/render3d/`".** It is in `src/render3d/` behind a Settings and title option.
- **Test counts are stale.** CLAUDE.md says "210 pass" and plan.md says "377 tests passing". It
  is 429 passing, plus 11 skipped asset writers.
- **CLAUDE.md sets a toon, outlined, flat-shaded art direction for the Nubbins.** PROGRESS G17
  says there's "no toon outline pass (the Grove has none either)".
- **The archive says reduced motion gives "instant camera snaps".** The camera reads only the OS
  media query, once at start-up, and ignores the in-game setting.
- **"The phone view passes" (decided 2026-10-17).** At 375×812 the top bar wraps into three rows
  in the top-right, and 36 px buttons are used in 18 player-facing files.
- **`sw.js` claims its cache name changes per deploy.** It doesn't.
- **The notes disagree about what waits on Maor.**
  - plan.md says "Waiting on Maor: the expansion pick (E1–E3, SL1–SL4)".
  - PROGRESS says G12 built all of them, and all four campaigns are on the title screen.
  - PROGRESS also says the Arcade and LB/LK decisions are waiting; the parent folder's CLAUDE.md
    says "Open decisions for Maor: none".
- **There are two CLAUDE.md files that disagree.**
  - The parent folder's `Test Des/CLAUDE.md` is an older long brief.
  - It forbids franchise names, art and audio ("No names, art or audio from an existing
    franchise"), against goal 4 and the 2026-10-17 licence decision.
  - Its remaining-work list is already done.
  - Any session started one folder up loads it.
- **Part Z's preconditions weren't met.** It should run "alone, on a clean `main` with everything
  merged". The working tree had uncommitted script-book and checker edits and 8 untracked
  script-book files.
- **Open items the notes don't know about:**
  - Bugs 1–14, 24 and 29
  - Neopia writing Grove state, and the Q66–Q95 chapter gate
  - the 60:1 happiness weighting
  - the missing Chaos and jewel forms
  - the 7–10 band's age-6 games
  - the original song lyrics against the "no song lyrics" goal

## What surprised me for the better

- **The writing.** Chapter 1 on a phone ("one cup, washed and turned upside down") is restrained
  and moving, and the Long Night payoffs (`keptStone`, read 11 times) are well built. The content
  checker passes: 35,919 lines, 3,499 choices, `problems: 0`.
- **The rules are exact.** Critter and essence points matched the grade multipliers to the
  decimal (Seal +33 Swim at B, +9 Fly at D). The adult form was the one I predicted (Neutral
  Fly), with the grade step D→C. Reload restored stats, needs and alignment exactly.
- **The sim/render boundary is enforced by ESLint** (no DOM, three or `Math.random` in `sim/`),
  not just by convention. Neither renderer writes sim state.
- **Graceful edges.**
  - Storage that throws gives a clear in-game message, not a crash.
  - "Hours to simulate" rejects 0, 721, 2.5 and "abc" inline.
  - A bad import says "That file is not a valid save."
  - Departures are gentle ("Fig moved on. A flower remains.").
- **Pixel art.** The Grove (cottage, pond, river, lanterns) and the Keeper read beautifully at
  1280×800 and at 375×812, with the whole scene in one draw call.
- **The 3D pipeline.** Sculpting in workers with an IndexedDB cache and shaders compiled ahead is
  serious engineering. The 3D Keeper looks good.
- **Languages.** The Hebrew is correct, with niqqud, gendered forms and final letters, and it is
  rendered with `<bdi dir=rtl lang=he>`. The Japanese kana and stroke notes are right.
