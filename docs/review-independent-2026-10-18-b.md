# Independent review B, 2026-10-18

Second independent review of the day, written after `docs/review-independent-2026-10-18.md`
(Part Z, commit `8ce0304`) and judged only against the ten goals in the brief. Build reviewed:
`main` at `dae0e17`, which is also what is deployed (the Pages run for `dae0e17` succeeded).
Report only: no other file was changed.

**Limits. Read these before the findings.**
- **Anchoring.** The harness loaded both `CLAUDE.md` files and the memory index before step 1,
  and an early `git branch -vv` printed two branch titles. I judged findings against the goals.
  The reviews of code, story content and assets ran before I read the notes.
- **Play.**
  - About 70 minutes of wall-clock play: Pixel about 50 minutes, Full 3D about 20, at ×1 to
    ×1000.
  - Sizes: about 1024×768, and the emulated 375×812 and 812×375.
  - The browser pane was throttled for part of the session, to 1–3 frames a second. In those
    stretches I drove the game's own input handler with synthetic pointer events and advanced
    dialogue from script.
  - No real phone was used, so **no phone frame rate was measured**.
- **Not done.**
  - Kindergarten, Karate, Gym, Decorate, Photo, Pocket, Beetle Run, Neighbourhood and Map were
    not opened. Neither were the Arcade (locked until chapter 5) or Neopia (its gate was not
    shown).
  - In the campaign, chapter 1 was played to the end and chapter 2 was entered but not finished.
  - Export was checked only through `exportJson`, because the download would have needed your
    approval.
  - Storage was "blocked" by making `getItem`/`setItem` throw at runtime, not through DevTools.
- **Labels.** Each finding is tagged:
  - **[played]**: seen in the browser.
  - **[code]**: read or reproduced by me.
  - **[sub]**: an Opus subagent read it.
  - **[sub✓]**: a subagent found it and I confirmed it.

## Verdict

Grove is a warm, well-written, deeply built game, and much of it now works:
- In Pixel mode I hatched, petted, fed, raced, ran an Expedition, went down the Hollow and
  watched two Nubbins depart gently. I saw the away summary hold a Nubbin for the player, read
  Atlas and Multiverse pages, and played the Learning Grove in both bands and in Hebrew and
  Japanese. There were no console errors.
- Since this morning's review, the 3D mode draws the same Nubbins, the story worlds ship, panels
  no longer fight story scenes, and saves are guarded against bad loads and imports.

It still does not meet its goals, for three reasons:
- **The two blockers from this morning are still live on `main` and on the deployed site.** A
  Nubbin can depart during catch-up even when the player forbade it, and the service worker
  never changes its cache. The fixes sit on the unmerged branch `fix/review-blockers`
  (`a391c69`).
- **Rules the goals call absolute are broken.**
  - A daily request board, weekly missions and a "Today's Hollow" remain.
  - One tap unlocks 18+.
  - Float drift lets a Nubbin become Eternal at exactly 0.80, where the rule says above 0.8.
- **Phone readiness is unproven and doubtful.**
  - Full 3D took 19.5 s to load and about 16 ms of GPU time per frame on a desktop GTX 1080.
  - Phone buttons are 36 px and sit at the top of the screen.
  - No phone frame rate has ever been measured.

Most fixes are small. Merge the blocker branch first.

## Bugs

### Blockers

1. **Departures during catch-up while departures are off.** [sub✓] `src/sim/offline.ts:37`
   - **Steps:**
     1. Raise an unloved adult close to the end of its life.
     2. Set Aging to Capped or Indefinite, with departures off.
     3. Close the game for under 3 minutes, or for any gap that isn't a whole number of minutes.
     4. Reopen.
   - **Expected:** the Nubbin waits (`awaitingKeeper`).
   - **Actual:** the fine-step remainder runs `stepWorld`, which calls
     `advanceStage(..., false)` (`world.ts:825`, `lifecycle.ts:45`). The Nubbin departs during
     catch-up. Reproduced: a 2-minute gap gives `departed`; 7 days + 59 s gives
     `awaitingKeeper` and then `departed`.
   - Still on `main`; the fix is unmerged on `fix/review-blockers`.
   - **Addressed 2026-10-18** (a391c69, merged in 5d47210: catch-up fine steps run with the away rules; tests for a 2 min 30 s gap and 1 day + 55 s.)
2. **Stale service worker, and failed chunk loads are never caught.** [sub✓]
   - **Where:** `public/sw.js:4`, `src/main.ts:112,118`, `story-scenes.ts:138`.
   - **Steps:** visit the site, deploy, then reopen and switch to Full 3D or enter the Learning
     Grove.
   - **Expected:** the new build.
   - **Actual:**
     - The cache is always `grove-v1`, and navigations are stale-while-revalidate, so the old
       `index.html` asks for hashed chunks that Pages has deleted.
     - The imports have no `.catch`, and the rejected promise is cached with `??=`. The result
       is a blank or forever-loading screen.
   - Still on `main`.
   - **Addressed 2026-10-18** (a391c69 + 5d47210: per-build cache name, network-first navigations, old caches deleted on activate; a catch and the reload notice on every lazy chunk (story scripts, edu, 3D, minigame views, the four shelves, the samples).)

### Major

3. **Daily and weekly rewards.** [played][code]
   - **Steps:** open More → Requests on two different days.
   - **Expected:** no daily rewards.
   - **Actual:** `world.questDay` holds the real date, and `stepQuests` refreshes three asks each
     day (`sim/quests.ts:94-99`). They pay 45–50 Shells, sometimes with an egg. Weekly team
     missions (`teams.ts:94-113`) and "Today's Hollow", tied to the board (`dungeon.ts:536`),
     remain.
   - **Addressed 2026-10-18** (790edb3: each request kind is asked once, ever; team missions run once each, in order; the Hollow request counts any descent, so nothing pays for Today’s Hollow.)
4. **Mature content is one tap with no grown-up check.** [played]
   - **Steps:** Settings → Mature content → 18+.
   - **Expected:** a parental gate.
   - **Actual:** it switches at once. The rift then asks only "Are you 18 or older?". The setting
     is also per save, so a parent must set it in every slot.
   - **Addressed 2026-10-18** (a391c69 + 5d47210: raising Mature content asks the grown-up sum gate; imports always come back Off (main’s rule). Still per save, as before.)
5. **An Eternal can happen at exactly 0.80.** [sub✓] `alignment.ts:14`, `lifecycle.ts:181-183`
   - **Steps:** a Nubbin reborn twice, Normal type, gets 80 Sun kind acts from 0.
   - **Expected:** 0.80 is not above 0.8, so no Eternal.
   - **Actual:** alignment is `0.8000000000000005`, so it becomes Eternal Sun. 50 acts likewise
     give 0.5000000000000002, which reads as Sun band. No test covers the boundary.
   - **Addressed 2026-10-18** (227a93d: alignment kept and compared in hundredths; boundary tests at ±0.50 and ±0.80, and an evolve test where Eternal must not happen.)
6. **Normal type lean is ignored.** [sub] `alignment.ts:25-31`
   - `winningType` skips `normal`, so `{normal:300, swim:30}` evolves Swim.
   - Fusion and plant fruit add Normal lean (`fusion.ts:34`, `plants.ts:124`) that can never win.
   - **Addressed 2026-10-18** (227a93d: Normal lean competes in `winningType`.)
7. **A Nubbin raised while away is always "well raised".** [sub]
   - `slips.ts:31` ignores steps over 1 s, so coarse catch-up logs no slips, and the child gets
     the bonus grade (`lifecycle.ts:111-116`).
   - The bonus isn't recorded in `gradeUpgrades`, and `wellRaised` isn't reset on rebirth.
   - **Addressed 2026-10-18** (78fde6d: coarse catch-up logs slips (rain aside), the bonus is in `gradeUpgrades`, rebirth clears `wellRaised`.)
8. **Rebirth odds depend on whether the player watched.** [sub]
   - Lifetime happiness is sampled once per second live and once per minute away
     (`world.ts:863`, `offline.ts:91`), so a live hour weighs 60× an away hour.
   - This was reported this morning and is not fixed.
   - **Addressed 2026-10-18** (78fde6d: samples carry the sim seconds they stand for.)
9. **Story worlds can't read the Grove.** [sub]
   - 22 Atlas pages and all 5 Arcade files declare "GROVE FLAGS READ", for example A19
     `sableFirst` (`atlas-a19.ts:21-31`).
   - But the shelf passes only the reflection flag (`ui/atlas.ts:121-124`), and `variantFor`
     reads only the line's own flags (`sim/atlas.ts:113-121`).
   - So those variants never play, and A19-18 shows its memory line even when `sableFirst` is
     unset.
   - **Addressed 2026-10-18** (2aba097: the shelf passes a frozen copy of the campaign flags; replacement variants (values, aliases, `-unset`, chained suffixes) play. Inserts and margin notes are not wired yet.)
10. **Trade away can lose a Nubbin and its code.** [sub] `ui/roster.ts:122-135`
    - **Steps:** Roster → Trade away, where clipboard write fails (common on iOS after
      `confirm()`), then cancel the `prompt()`.
    - **Actual:** `tradeAway` is sent anyway. The Nubbin is gone, and its code was never shown.
    - **Addressed 2026-10-18** (d348f9c: the code shows in a dialog; only its own "Code saved: send away" button trades.)
11. **Camera keys swallow typing.** [sub] `input/camera-controls.ts:26,42-66`
    - **Steps:** Learning Grove parent panel → type the name "Steve".
    - **Actual:** "e" never arrives (`preventDefault`), and the camera spins. Q, [, ], +, = and
      - behave the same way.
    - **Addressed 2026-10-18** (2d1d639: `input/keys.ts`; camera, F and backtick ignore fields, selects, editables and Ctrl/Alt/Cmd.)
12. **Sound can stay silent on iPhone.** [sub] `platform/audio.ts:55-69`, `main.ts:192`
    - The unlock runs once, on `pointerdown`, which is not a user activation on iOS.
    - `unlocked` is set even if `resume()` failed, and there is no resume after an interruption
      or `visibilitychange`.
    - Title-screen taps don't unlock it either.
    - **Addressed 2026-10-18** (df687c1: unlock on pointerup, touchend, click and keydown from the title on; unlocked only once running; resume on each gesture and on visibilitychange.)
13. **No WebGL failure handling.** [sub]
    - There is no `webglcontextlost` listener, no WebGL2 check and no fallback.
      `new LowResPipeline` (`game.ts:142`) and `Grove3dScene` (`main.ts:116`) are not guarded.
    - `compileScene(...).then` has no catch (`grove-3d-scene.ts:686`).
    - Result: a blank screen on devices without WebGL2 or with a lost context.
    - **Addressed 2026-10-18** (f15c44a: WebGL2 check, renderer try/catch, webglcontextlost card (Reload, Switch to Pixel), caught shader warm-up.)
14. **The Full 3D creature pool and garden only grow.** [sub]
    - Rigs are never freed on evolution, part, hat or look change, or on neighbour visits
      (`creature-pool.ts:27`, `crowd.ts:325`).
    - `Garden.rebuild` disposes only geometry; materials and InstancedMesh buffers leak, and a
      rebuild can fire every 500 ms (`garden.ts:285-308`).
    - `VisitSet.dress` doesn't dispose either (`visit.ts:52`).
    - **Addressed 2026-10-18** (8d64e8e: pool LRU on spares and surfaces (`GROVE3D.poolSpares`, `poolLooks`); garden and visit sets dispose geometry, instances and own materials.)
15. **The in-game Reduced motion setting doesn't reach the camera.** [sub]
    - `OrbitCamera.reduceMotion` reads only the OS query (`camera.ts:87-90`), and the 3D camera
      always eases (`grove-3d-scene.ts:600`).
    - `scene3d.reduceMotion` is never read.
    - Pixel water and sway keep moving (`grove-scene.ts:640-650`).
    - **Addressed 2026-10-18** (c280a6c: the resolved setting reaches both cameras each frame; Pixel water, falls, foam and sway hold still.)
16. **Tap targets and one-thumb reach on phones.** [played]
    - At 375×812, Shop buy, Races tiers, Keepers Choose, Roster actions and Journal tabs measure
      36 px (`.btn-small`).
    - The top bar wraps into three rows of eight menu buttons in the top-right corner. Only Run,
      rotate and zoom sit in the thumb zone.
    - **Addressed 2026-10-18** (09df633: `.btn-small` 44 px; a bottom action bar in phone portrait, with the bottom HUD above it.)
17. **Dialogs are not accessible.** [sub] `ui/dom.ts:38-65`
    - No `role="dialog"`, focus move, focus trap or focus return.
    - Space is blocked globally (`game-input.ts:153`), so a focused button can't be pressed with
      it.
    - Escape misses the shelves, the language panel and the rift confirmation.
    - **Addressed 2026-10-18** (09df633 and 2d1d639: `dialogFocus` gives modals role, aria-modal, focus in, Tab trap, Escape and focus return; Space reaches focused buttons.)

### Minor

18. **Memorials lose their form.** [played] Departed Juniper and Bibi have `form: ":"`, from
    `` `eternal:` ``/`` `:` `` without placeholders (`lifecycle.ts:324`). Reported this morning.
    - **Addressed 2026-10-18** (c393620: `memorialForm` writes `band:type` or `eternal:band`; old `:` forms are dropped on load; tested.)
19. **Milestone code in player text.** [played] The stats sheet says "Expeditions (M4) bring
    Critters and Essences."
    - **Addressed 2026-10-18** (6467abe: the stats sheet line no longer names a milestone.)
20. **Speaker ids on screen.** [played] In the shrubbery fun quest, speakers show as
    "hooded-three:" and "tall-hood:".
    - **Addressed 2026-10-18** (03a27e3: `speakerNameIn` (owning quest, family, any quest) names speakers in the Grove and the Atlas; content-check fails an unmapped `who`, edu scenes and variants included; tested.)
21. **A fun quest interrupts the opening.** [played] The shrubbery quest fired about 20 game
    minutes into chapter 1, before I had touched an egg, and its caper sits in the chapter 2
    Journal.
    - **Addressed 2026-10-18** (574149f: no fun quest opens before the first hatch or before chapter 2; tested.)
22. **You are Fern, and Fern greets you.** [played] Keepers are the village NPCs. With Keeper
    Fern chosen, NPC Fern ("I'm Fern, from next door") talks to you with your own sprite and
    portrait.
    - **Addressed 2026-10-18** (9bdd149: Keeper looks have their own names (Gardener, Tide-pooler...); the You portrait wears your side-trimmed outfit. The sprites still share a base outfit.)
23. **Moss is in two places.** [played]
    - The story keeps Moss "on the hill", "small and grey", not yet come down.
    - Meanwhile a green Normal Moss sits in your roster from minute one, in both modes. Petting
      him by the well plays the hill scene.
    - **Addressed 2026-10-18** (574149f + 114a950: Moss sits at his hill seat, off the roster, until `c7-stillness` and room bring him down; tested.)
24. **Moss can be traded away or overflow the roster.** [played][sub]
    - Roster offers "Trade away" on the story Eternal.
    - `campaign.ts:115-121` adds him without `hasRoom`, so the roster can reach 9.
    - **Addressed 2026-10-18** (574149f + 114a950: no Trade away on Moss or Sable (sim and roster); he counts against the cap only once down, and a restart no longer doubles him; tested.)
25. **The debug panel freezes story scenes.** [played] `.debug` counts as a panel for
    `Dialogue.waitWhile`. At ×1000 with the panel open, a line sat for 3 game-hours and ignored
    taps.
    - **Addressed 2026-10-18** (fe4503f: not reproduced at 1280 or 375 at ×1000 with the panel open; the panel is not in the wait list, and a comment keeps it out.)
26. **The debug Story row is 17 unlabelled buttons.** [played]
    - **Addressed 2026-10-18** (114a950: the chapter buttons read Ch 1 to Ch 12 (their text had been lost to an old shell edit).)
27. **The 3D race is hard to read, and its clock is tied to frames.** [played]
    - The camera sits behind the pack, so rivals hide behind each other, and the name tags
      stack in a column away from the creatures.
    - At about 2.6 fps, the race clock moved 4 s in about 40 s of real time.
    - **Addressed 2026-10-18** (ac82942: 38° camera over 1.5-unit lanes, every racer and tag clear (`docs/samples/rb-race-3d-*.jpg`); the race runs on real time, up to 1 s a frame.)
28. **Changing Graphics drops you at the title** although the help says "reloads the Grove".
    [played] Reported this morning.
    - **Addressed 2026-10-18** (4b260da: the slot is marked in session storage and the reload goes straight back into it.)
29. **The 7–10 slot is labelled "Age 6"** on the title screen. [played]
    - **Addressed 2026-10-18** (6467abe: a reader save says Age 7–10.)
30. **Learning Grove polish.** [played]
    - Ori's portrait is Fern's sprite.
    - The Hebrew word renders smaller than its romanisation.
    - The keyboard hint bar ("WASD move · Q / E rotate…") shows to 3–6 year olds.
    - Settings, including Reset save and Aging, is open to the child with no grown-up gate.
    - **Addressed 2026-10-18** (9bdd149 + 4b260da: Ori and Hana have their own looks; Hebrew is set above its romanisation; no keyboard hint; the grown-up sum before Settings.)
31. **Japanese.** [sub]
    - Romanisation mixes ī and ii (`lang-japanese.ts:1360` vs `1313,1365`).
    - The primer has 12 hiragana and no katakana, yet ピンク and オレンジ are taught.
    - The Hebrew "alef-bet" trace covers two letters.
    - **Addressed 2026-10-18** (14dc09d: ojiichan with ii throughout; the primer gains ピ ン ク オ レ ジ; the trace goal names its two letters.)
32. **Expedition quit loses Shells.** [sub] Quitting early keeps essences and critters, but
    `rewards.shells` is filled only at the finish (`run.ts:228`).
    - **Addressed 2026-10-18** (6467abe: the run's rewards always hold its Shells; tested.)
33. **Two tabs overwrite each other.** [sub] There is no `storage` listener, so the stale tab's
    autosave wins (`game.ts:368`).
    - **Addressed 2026-10-18** (6467abe: a `storage` listener stops this tab's autosave, with a notice, when another tab writes the slot.)
34. **Gathering state lives outside the world.** [sub] `craft.ts:49` keeps `lastGather` in a
    module, so after a reset in the same page, gathering is refused until the old time passes.
    - **Addressed 2026-10-18** (c393620: `gatherReadyMs` in the world; tested.)
35. **Time is lost at high speed.** [sub] At ×100 and up, remainders under 60 s are dropped
    (`game.ts:317-320`, `clock.ts:43-47`).
    - **Addressed 2026-10-18** (c393620: `takeOverflowMs(unit)` leaves the part under a coarse step in the clock; tested.)
36. **Import trusts non-Nubbin fields.** [sub] `shells: "5"` loads as a string (so `+=`
    concatenates); a NaN `timeMs` passes; `setSettings` accepts a NaN cap (`save.ts:358`,
    `world.ts:426`).
    - **Addressed 2026-10-18** (c393620: counts coerced on load, a junk clock refused, `setSettings` keeps a valid cap; tested.)
37. **Small leftovers.** [played]
    - Settings radios and checkboxes shrink unevenly at 375 px (the 18+ radio, the Music box).
    - Race results ignore Escape.
    - `storageOk` stays false after storage recovers.
    - The canvas label is "Grove test scene".
    - The 21 title slot buttons are all named "Slot N · Empty New".
    - **Addressed 2026-10-18** (6467abe + 4b260da: boxes keep 22 px; storage recovery warns again; canvas label and slot names fixed. Race results already closed on Escape in both modes (not reproduced).)
38. **Flaky test.** [code] `tests/render/sculpt-spec.test.ts` ("narrow band") hits its 5 s
    timeout under load (6.97 s). It passes alone.
    - **Addressed 2026-10-18** (eb736f1: a 30 s budget.)

## Missing against the goals

| Goal | What is missing | Evidence |
| --- | --- | --- |
| 1 | Nothing structural. Kids lose Nubbins fast: neglected adults departed at 4.8 h of age, and a 24 h absence brought one straight to its end. | [played] |
| 2 | Normal lean is dead (Bug 6). The Eternal boundary drifts (Bug 5). Away-raised children are always "well raised" (Bug 7). Rebirth odds depend on being watched (Bug 8). | [sub✓] |
| 3 | **Parity:** a thrown flier flutters in Pixel but tumbles in 3D; held is a carry pose in Pixel and the pet pose in 3D; the tank minigame stays 2D in 3D; the races use different cameras (Bug 27). **3D load:** 19.5 s to "Grove ready" on a 12-core desktop. | [sub] `actors.ts:69` vs `world-view.ts:1400`; [played] console `[3d] Grove ready 19484 ms` |
| 4 | Nothing found against the licence. Variants look complete in both modes. | [sub] parity table |
| 5 | **No phone fps, ever.** **Full 3D:** about 16 ms GPU per frame on a GTX 1080 at 961×908, 99 shader programs, 19 point lights at intensity 0 still shaded (`props.ts:90,238`), water transmission (`water.ts:34`), 2048² shadows, bloom and SMAA at DPR 1.5, and no quality tier. **Load:** Learning Grove chunk 9.36 MB (3.09 MB gzip); Klee One about 2 MB woff2 ×2; dist 40 MB. Plus Bugs 15–17. | [played][code] build log |
| 6 | Bug 1. Two tabs (Bug 33). Reload is not exact for edu time, trees, NPCs and held state (`save.ts:204,228-246,307`). | [sub✓] |
| 7 | Daily, weekly and Today's rewards (Bug 3). A one-tap 18+ (Bug 4). Story worlds don't read Grove state (Bug 9). | [played][code] |
| 8 | No katakana. Tracing is token (2 Hebrew letters). Every word clip is `placeholder.wav`. Settings are ungated in kids' mode. The edu versions of A23 are dead because two A23 quests are `main` (`atlas-a23.ts:1023,1840`; `sim/atlas.ts:47-52`). | [sub][played] |
| 9 | **Quotes:** Holy Grail is quoted about 10 times across Q1–Q7 (`quests-python.ts:437…1151`), over 3 if the pack is one storyline. Markers still say "CHECK…" (`atlas-a19.ts:46-48`, `arcade-pa5.ts:41`). **Original sung lyrics:** the Lantern Song (`campaign-book1.ts:584-592`), Nova's ditties, and Q47's "Secret Tunnel" pastiche (`quests-avatar.ts:292-296`), against "no song lyrics". **Flavour-only choices:** c1-letter, c4 lamps, c3-close. | [sub] |
| 10 | **Over 800 lines:** world-view 1474, style.css 1831, strings 1299, tuning 1209, chao.ts 1159, hud 1004, types 969, actors 948, grove-scene 948, audio 947, dungeon 917, world 911, decor 836. **Untested:** odd-length catch-up, the Eternal float boundary, no-Eternal integration paths, Normal lean, slips in catch-up, hostile imports beyond Nubbins, the UI (only `SceneReplayGuard` has tests), the service worker, context loss. | [sub] |

## Risks

- **Performance.** Full 3D on a mid-range phone will very likely miss 30 fps (Goal 5 row),
  with a 20 s or longer first load and memory that grows over long sessions (Bug 14). Pixel
  mode is one draw call, but allocates per sprite per frame and re-uploads full buffers
  (`sprite-batch.ts:216-268`).
- **IP.**
  - Licences are approved. There is no credits screen.
  - The OFL fonts (504 files) ship without their notice.
  - The sources of `placeholder.wav` and the Kokoro voice model used by `voiceover/` are not
    recorded.
  - Both CLAUDE.md files still say names, music and sound "stay original", which contradicts
    Goal 4.
  - No copied lyrics were found.
- **Kid safety.**
  - One tap plus a self-declared age reaches 18+ (Bug 4).
  - S9 is rated `all`, and its line "Quiet as stones, by morning" implies Nubbins were harmed.
    It also appears in the 7–10 band (`side-stories-main.ts:615`, `edu-side-2-reader.ts:1753`).
  - The 7–10 band has "Give the giant the wine." (`edu-a14-reader.ts:3186`), "I'm supposed to
    kill a dragon" (`edu-a19-reader.ts:4050`) and Enkidu's death (`edu-a26-reader.ts:3502`).
  - Toy Story sits behind 18+, which is odd but safe.
- **Data loss.**
  - Bug 1 (departures).
  - Bug 2 (a blank screen after a deploy).
  - Bug 10 (trade away).
  - Bug 33 (two tabs).
  - Bug 36 (a malformed import).
  - Reset save in the kids' Settings and the debug panel. The debug one has no confirmation.

## Improvements, ranked by value against cost

1. **Merge `fix/review-blockers` (`a391c69`) after re-testing it.** It closes Bugs 1, 2 and 4.
   Highest value, lowest cost.
2. **Round alignment to hundredths, or compare with an epsilon**, and add a no-Eternal
   integration test. High value, trivial.
3. **Delete the daily board, weekly missions and Today's Hollow,** or make them one-time. High
   value, low cost.
4. **Catch failed imports and add `webglcontextlost` with a "Reload / switch to Pixel" card.**
   High value, low cost.
5. **Measure on real phones (G11), then add a 3D phone tier:** no transmission or shadows, DPR
   1, lights culled. High value, medium cost.
6. **Count Normal lean, log slips in catch-up, and sample happiness by time, not by step.**
   High value, low cost.
7. **Pass Grove flags to story-world variants** (read-only). Medium value, low cost.
8. **Raise `.btn-small` to 44 px and add a bottom action bar in portrait.** Medium value,
   medium cost.
9. **Guard text inputs in camera keys, and unlock audio on `pointerup`/`touchend` with
   resume on visibility.** Medium value, low cost.
10. **Fix trade away:** never send `tradeAway` without a shown code. Medium value, trivial.
11. **Honour the in-game Reduced motion setting in both cameras and scenery.** Medium value,
    low cost.
12. **Dispose garden and visit materials, and evict pool rigs by recency.** Medium value,
    medium cost.
13. **Split the edu chunk by band and subset Klee One.** Medium value, medium cost.
14. **Story consistency:** keep Moss off the roster until he comes down, and stop Keepers
    sharing NPC names. Medium value, low cost.
15. **Minor sweep:** Bugs 18–37. Low value, low cost.
16. **Decide on original sung lyrics and the Holy Grail count,** then record the ruling. Low
    cost.
    - **Decided 2026-10-18 (Maor):** original sung verses are fine; only lyrics from existing
      songs are banned. Holy Grail's Q1–Q7 count as one storyline and keep all ten quotes, an
      exception to the three-quote cap.

## What the notes get wrong

- **PROGRESS.md says Part Z's "fixes are going in pass by pass"** but doesn't say that Blockers
  1–2 and the Mature gate are fixed only on the unmerged branch `fix/review-blockers`. `main`
  and the live site still have them.
- **The no-daily-rewards claims are wrong.**
  - plan.md (CV6 row): "one-time story gifts in place of once-a-day rewards".
  - CLAUDE.md: "no daily or weekly quests"; `docs/brief.md:475`: "daily gifts are one-time".
  - The daily board, weekly missions and Today's Hollow are unchanged since this morning.
- **"Read-only lookups" of Grove state.** The story-world headers promise Grove-flag variants.
  PROGRESS admits only the cartridges and the Multiverse are unwired; 22 Atlas pages are
  unwired too (Bug 9).
- **PROGRESS says Full 3D memory is "flat at 242 / 51".** That was measured over
  hatch-and-eat cycles only. Evolution, parts, hats, looks and visits keep their rigs forever
  (Bug 14).
- **Test counts.** CLAUDE.md says "210 pass", and plan.md says "377 tests passing". There are
  now 511: 499 pass, 1 fails on a timeout under load, and 11 are skipped generators.
- **plan.md is stale.**
  - "Waiting on Maor: the expansion pick", though G12 was built on 2026-10-17. PROGRESS waits
    on LB/LK instead, and the parent CLAUDE.md says "none".
  - Atlas A1–A10 and A22–A31 "not yet reviewed or committed", though PROGRESS says they are
    reviewed.
- **plan.md: "the phone view passes"** (decided 2026-10-17). At 375 px the buttons measure
  36 px and the menu sits top-right (Bug 16).
- **CLAUDE.md (nested) is stale.**
  - It says 3D is "today in `src/samples/` behind URL flags".
  - Its "Current plan (2026-10-15)" lists finished work as next.
- **The parent CLAUDE.md is still loaded one folder up.** Its "Open decisions: none" and
  "Remaining" list are out of date.
- **`sw.js:3` says the cache name "changes per deploy".** It does not.
- **PROGRESS: "Anything that opens a panel mid-scene pauses the story".** That includes the
  debug panel, which freezes scenes during time-skips (Bug 25).
- **Commit `3485912`, "Lay race name tags out … so none overlap".** True in 3D, but the tags
  now stack away from the racers, and the racers hide each other (Bug 27).
- **Open items the notes don't know about:** Bugs 5–7, 9 (beyond the cartridges), 10–14,
  20–24, 27, 29–36; the edu A23 dead content; the S9 line in `all`; the Holy Grail count; the
  3D load time.
- **Fixed since this morning, confirmed in play.** "Meet Hana" now opens Hana's scene. Import
  confirms and resets Mature content. Panels pause story scenes. The rift, the Atlas and story
  worlds are in the build.

## What surprised me for the better

- **The writing.** Chapter 1 is restrained and funny ("I'm very proud of the stone,
  actually."). The 7–10 band turns the same scene into a gentle lesson about holding two
  feelings at once.
- **Departure is handled with real care.** The away summary says the Nubbin "is waiting for
  you". A soft, fading cocoon then plays in the pond, and a memorial flower appears.
- **Graceful edges.**
  - Blocked storage gives a clear toast, and play goes on.
  - "Hours to simulate" rejects 0, 721, 12.5 and "abc" inline.
  - Imports ask before replacing and reset Mature content.
  - The rift wrote nothing to the Grove (I diffed the save).
- **Engineering.**
  - Pixel mode is one draw call over a 4096² LRU atlas.
  - The sim has no DOM, no three and no `Math.random`, enforced by lint.
  - A 7-day catch-up takes about 6 ms.
  - The content checker passes 35,919 lines and 3,499 choices with `problems: 0`.
- **Languages.** The Hebrew renders correctly with niqqud and RTL, and the Japanese greeting
  scene is warm and accurate. Read-aloud uses speech synthesis for the 3–6 band.
