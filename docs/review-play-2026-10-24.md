# Play review, 2026-10-24

> Note (2026-10-25): this review ran on a checkout 334 commits behind origin/main (84b48c1); some findings were already fixed upstream. Fixes: PROGRESS.md, "Play review fixes".


Repo `Test Des/Test Des` at `84b48c1`, plus the uncommitted changes already in the working tree (I didn't touch them). I played on the local dev server and checked load times on the deployed build.

## How this review was done, and what it doesn't cover

- **No real devices.** I couldn't use real phones or a visible browser: the in-app browser pane was hidden, so it renders no frames. I played in headless Microsoft Edge, which I drove with scripts:
  - Desktop window at 1280×800.
  - Phone emulation at 375×812 with touch, plus landscape at 812×375.
  - Both graphics modes.
  - The debug time controls at ×100.
- **No 45 minutes of hand play per mode and window.** I covered every item on the checklist, but through scripted sessions, each a few minutes of wall-clock time (hours of game time).
- **Frame rate is not measured.** The fps counter read 60 throughout, but headless software rendering says nothing about a 2022 phone.
- **Two things were in my context before I started.** CLAUDE.md and my memory index were loaded automatically at the start of the session. I also searched my memory once for a headless-browser trick. I didn't open PROGRESS.md, plan.md, docs/, script-book/ or any commit message.
- **Subagents.** Four Opus subagents read the code by folder: sim, renderers, UI/platform and story content. I re-checked their headline claims myself:
  - The offline departure: I re-ran their reproduction script.
  - The empty template literals: I checked the raw bytes.
  - The speakers who aren't in the world: I saw it in play.
  - The back-to-back scenes: I timed them in play.
- **Steps 4 and 5.** Your message stopped after step 3, so I stopped there.

---

## Top 12, most severe first

1. **A Nubbin can depart while the game is closed even though "Allow departures while closed" is off.** Confirmed by running a script.
   - Catch-up runs the leftover part of the gap (anything that isn't a whole minute) through the live step. That step runs the end-of-life check on `awaitingKeeper` Nubbins.
   - With the mode set to indefinite and departures off, against an unloved adult near the end of its life:

     | Time away | Result |
     | --- | --- |
     | Exactly 7 days | Waits correctly |
     | 7 days + 50 s | `awaitingKeeper,departed` |
     | 2 minutes | `departed` |

   - Code: `src/sim/offline.ts:173` → `world.ts:825` (`offline=false`) → `lifecycle.ts:43-45`.
   - The tests only use whole-minute gaps, so they miss it.
   - The script is `…\scratchpad\repro1.ts`.
2. **The Keeper got stuck for good inside the pond.**
   - In my desktop session the Keeper ended up at (4.68, 6.77), inside the pond. From then on, WASD, tap-to-move and every care action did nothing.
   - Feed failed silently and the fruit count stayed at 4, so chapter 2's goal ("feed twice") couldn't be finished.
   - It survived a reload, a save export/import and a switch between graphics modes. It shows in both modes (screenshots `p29`, `d3-grove`).
   - It first appeared about 10 minutes in, around the hatch scene and a Hug, before any dungeon trip.
   - I couldn't reproduce it in a fresh game, where the pond's collision keeps the Keeper out. **Cause not found.**
3. **Characters speak without being on screen.** Confirmed in play.
   - **Your own Keeper talks to you.** If you pick Fern (or Marina), chapter 1–2 has an NPC "Fern" ("Marina") speaking, with your own portrait. She isn't in the world, because `campaign.ts:100` spawns every trainer except the one you picked. After switching to Luna, an NPC Luna exists alongside the player Luna.
   - **Corvin Vale speaks in chapter 2 with no body.** He isn't spawned until chapter 5.
   - **Nearly every side-story and fun-quest speaker shows Fern's face.** `trainerLook` falls back to `TRAINERS[0]`. That covers about 870 speaker ids, including Atlas and Arcade characters.
   - **Scenes can start in the Hollow,** where NPCs aren't drawn at all.
4. **Scenes and quests arrive back to back.**
   - Timed in a fresh campaign, with the Keeper played by script:

     | Time | Scene |
     | --- | --- |
     | 36 s | Hatch scene (24 lines) |
     | 41 s | Chapter 2 opening (25 lines) |
     | 52 s | Corvin (20 lines) |
     | 59 s | Chapter 3 opening (25 lines) |
     | 60 s | Chapter 3 scene (11 lines) |

   - Chapter 2 lasted about 18 seconds.
   - The story clock jumps from "Late afternoon" to "Early summer" in seconds. The in-game season said autumn the whole time ("Autumn harvest" toast) while the text said "Late spring" and "Early summer".
   - **Causes:**
     - A story day is 120 s (`tuning.ts:1091`).
     - The next scene is played as soon as the dialogue closes (`hud.ts:631-645`).
     - Side stories only wait for "queue empty" (`side-stories.ts:385`).
     - Chapters start on the next tick (`campaign.ts:446-448`).
     - There is no cooldown anywhere.
   - A scene also cut into play: the hatch scene closed the Nubbin sheet mid-Hug.
5. **The Nubbin sheet stays on top of a scene and steals its keys.**
   - Steps: select a Nubbin, tap Tickle, and wait for a story scene to start.
   - The sheet stays above the dialogue box and intercepts clicks.
   - Space and Enter press the last-focused sheet button (Tickle) again and again instead of advancing the dialogue.
   - My script hit 200 presses without moving one line (`p14`).
6. **No way to skip a whole scene.**
   - Only "finish typing, then next line" exists (`dialogue.ts:227-247`). There is no Skip button, and Escape does nothing in a scene.
   - Chapter 1 opens with 39 lines before the first choice. The chapter 4 chain is about 130 lines.
7. **No on-screen objective.**
   - The goal and hint live only in the Journal panel, and the Journal button is hidden outside the campaign.
   - Nothing on the main screen says what to do next.
   - When both starter Nubbins departed during chapter 2, nothing told me to buy an egg.
   - A 4-year-old in the Learning Grove lands in the Grove with no prompt. The story is behind **🎓 → Play & learn → 📖 Story**.
8. **Dungeons are too small.**
   - Zoomed out, the whole of floor 1 fits on one screen, and it takes about 3 s to walk across in any direction (`p26-zoomout`).
   - Floor size: `tuning.ts:1044-1053` sets 34×24 cells, growing by +4 / +2 per floor.
   - Rooms: 4–7 rooms of 6–10 × 5–7 cells (`dungeon.ts:163-221`).
9. **Not enough creature variety.**
   - **Pocket line:** 36 species in total. Only 16 are Gen-1 (Pichu-line, Clefairy-line, Jigglypuff-line, Hitmons, Jynx/Electabuzz/Magmar, the fossils). **135 of the 151 Gen-1 Pokémon are missing.**
   - **Digital line:** 14 species, which is the 1997 Ver.1 line only. Versions 2–5 are missing (about 70 originals).
   - **Chao:** the looks are broad: 15 first evolutions, 60 second evolutions in 3D, 3 Chaos forms, 4 character looks, 7 jewels, two-tone and shiny.
   - All race rivals I saw were Chao.
   - The Collection book holds 70 entries.
   - Possible chart errors, from memory (plausible): Devimon and Airdramon evolve into Mamemon in `sim/species.ts`, but in Ver.1 both go to MetalGreymon. `skyfang-grown` is a made-up second stage for Aerodactyl.
10. **Graphics that are blank or uncoloured.**
    - **Pixel race:** the FLY section is a plain off-white rectangle with no sky or gap art (`p19-end`).
    - **Pixel Expedition:** the same off-white band between the sky and the hills (`p21-run20`).
    - **3D Grove:** the cottage and shed are untextured flat-colour boxes next to a textured well (`d3-grove`, `camp-3d-5`).
    - **3D Hollow on phone:** flat grey boxes and a flat blue polygon for water (`ph-3d-hollow`).
    - **Pixel second evolutions** change shape only and keep the first-evolution colours. An untrained "–Normal" second evolution doesn't change at all in Pixel.
11. **Story Nubbins can be traded away.**
    - Moss (the story's Eternal, 2 rebirths) is in the player's roster from the start, takes a slot (3 of 8), and has a **Trade away** button.
12. **Two template literals lost their `${…}` contents in an old scripted edit.** Confirmed from the raw bytes.
    - `lifecycle.ts:324`: every memorial stores `form: ":"`. Confirmed in save data: both memorials read `":"`.
    - `debug-panel.ts:105`: the twelve "jump to chapter" debug buttons are blank.
    - A search of the rest of `src/` (outside `src/content`) found no other cases.

---

## Play notes by area, with steps

### First run (Pixel, desktop)

- **The title screen is confusing.** It shows 7 modes × 3 slots = 21 identical "Slot N · Empty / New" buttons. No mode has a one-line description, and the Graphics picker sits below the fold.
- **No loading indicator on a cold start.** On a cold dev server, picking a Keeper gave about 30 s of blank screen. The deployed build is fine: title at 1.7 s, Grove 2.3 s later, about 1 MB total on emulated fast 4G.
- **Five toasts on the first frame.** "Chapter 1", "Byte stopped by with Shells", "Lantern night", "Autumn harvest" and "Badge earned" all appear at once, while the narration says "Late spring".
- **Duplicate toasts at ×100.** "The sky clears." repeats every few seconds, and every toast appears twice in the DOM. "X stayed up exhausted. (A slip.)" also repeats.
- **Care actions fail silently at a distance.** With the Keeper far from the Nubbin, Pet, Feed and Tickle give no walk and no "too far" message (confirmed in a fresh game).
- **Egg sheets show needs bars.** The sheet for an unhatched egg shows Hunger, Energy and Happiness.
- **The keyboard hint shows on phones.** "WASD move · Q / E rotate…" shows on a touch phone in landscape, and it shows through under the dialogue box.

### Races (both modes)

- **Pixel:**
  - Name labels overlap their neighbours.
  - The "4th place · 9s" chip overlaps the "GROVE · TIER 1" title and the ✕ button.
  - At the finish every racer collapses into one column.
  - On a phone in portrait, the race is a strip about 400 px tall between large empty bands.
- **Results card:** it says only "6th place". There's no prize line, no full standings and no hint about which stat lost the race.
- **3D:** the player's Nubbin and a rival were both named "Pip".
- **Races from the Hollow:** a race started from inside the Hollow keeps the dungeon's "Floor 1 · Head home" bar on screen during the race.

### Expedition

- It starts immediately with no "tap to jump" card.
- The rewards reached the inventory: 23 Shells, essences and a raccoon.
- In 3D on a phone in portrait, the runner is tiny at the far left and the lower 40% of the screen is empty grass.

### The Hollow

- The top-bar Shop, Races and Expedition buttons all work from inside the cave.
- **On a phone (both modes)** the "Floor 1 · Head home" bar sits on top of the top bar's second row. More, Expedition, Races and Shop can't be reached while you're underground.

### End of life

- Force-end-of-life on Dew gave a cocoon, then departure and a memorial flower. Nono departed by itself at age 4 h 46 m.
- Both starters were gone in about an hour of ×100 play, with no warning that they were heading for departure rather than rebirth.
- From the code (confirmed by reading):
  - Lifetime happiness counts offline time about 60 times less than live time.
  - A "frozen" `awaitingKeeper` Nubbin keeps being sampled while it waits.

### Keepers, settings, save

- **Keeper switching works.** Fern (Sun) → Luna (Moon) changed the alignment and the HUD icon.
- **Capped-hours validation works.** It rejects 0, 721, 5.5, −3 and empty, and saves 1 and 720. Mode Off disables the toggle and the hours box.
- **Changing Graphics in Settings** drops you on the title screen instead of back in the Grove.
- **Export/import round-trips correctly.** The export is an 8.5 KB JSON file; import uses a native `confirm()`. A reload also restored the state.
- **Blocked storage didn't crash the game.** With the localStorage, sessionStorage and IndexedDB getters throwing, the game loads and plays with no console errors. I saw no visible warning at 45 s.
- **The delete button is easy to hit by accident.** The title row's ✕ (delete slot) sits right beside "Continue".

### Learning Grove

- **Age 4:**
  - The story reads aloud through speech synthesis (16 calls in one scene).
  - Lines are 21–60 characters.
  - There are gentle lessons: name sounds, and counting fingers for Gran's three rules.
- **Age 7–10:** lines run up to 148 characters and are not read aloud.
- **"Meet Ori" (Hebrew) replays the whole chapter 1 opening first,** about 28 lines, before Ori arrives.
- **Hebrew is correct.** It has niqqud, the Hebrew runs are isolated with `bdi dir=rtl` inside the LTR box, and gender variants are offered.
- **Tracing is thin** (from the code; I didn't reach it in play). Hebrew has א, ב and one word, measured by ink coverage with no stroke paths. Japanese has か–こ, は and な.
- **Small layout bug:** the "Back" text on Nova's postcard overflows its button.

### Mode differences I saw (the subagent's table adds more)

| | Pixel | Full 3D |
|---|---|---|
| Player's Keeper look | the chosen trainer (Fern's straw hat) | a generic spiky Sun/Moon Keeper, whichever trainer you pick |
| Dialogue portraits | pixel | still pixel, drawn over the 3D world |
| Race camera | side view, lanes | chase camera from behind |
| Second-evolution colour | none | 60 blended colours |
| Jewel + two-tone/shiny | gem only | tone and shiny shown on top of the gem |
| Reduced motion (in-game setting) | partly | ignored (`reduceMotion` is never read) |
| Pocket, Collection, roster portraits | pixel | pixel |
| Animations (shelter, court, perform, fetch, love, tumble) | idle/happy | sleep / happy / own poses |
| Console on load | clean | ANGLE shader warning X4122 (`THREE.WebGLProgram`) |

### One-thumb reach and tap targets (phone, both modes)

- **Every primary action is in the top-right corner.** The top bar wraps into three rows there: 9–14 controls sit in the top third of the screen, and the icon buttons are emoji-only.
- **Under 44 px:**
  - Sheet care buttons: 36 px.
  - Roster Go to / Share code / Trade away: 36 px.
  - Shop price buttons: 36 px.
  - Race Tier buttons: 56×36.
  - Journal chapter buttons: 36 px.
  - Head home: 36 px.
  - Every Settings `<select>`: about 19 px.
  - Radios and checkboxes: 13–22 px.
- **Text doesn't scale.** Font sizes are in px, and `html,body` are set to overflow:hidden.

---

## Code review (subagent reads, spot-checked)

- **Done well:**
  - The sim is clean: no DOM, three, `Math.random`, `Date.now` or `performance.now`. `strict` and `noUncheckedIndexedAccess` are on.
  - There is one `Clock` with a step cap, and a mulberry32 RNG whose state is saved in the world.
  - Save versions 1→5 each have a tested migration. Imports are validated per Nubbin.
  - Story worlds receive a deep-frozen `CrossSaves` snapshot, so by structure they can't write Grove state. This isn't enforced by a lint rule or a test.
- **Sim rules:**
  - **Normal is hard to steer toward.** Normal critters and essences add no type lean, and `winningType` skips Normal (`critters.ts:59,68`; `alignment.ts:30`). Normal can only come from no lean or a tie, and it's the type Eternal requires.
  - **The well-raised bonus can upgrade the same stat twice,** and doesn't count it in `gradeUpgrades` (`lifecycle.ts:113-115`).
  - **The Eternal Neutral limit is `<= 0.1`,** not `< 0.1` (`lifecycle.ts:183`).
  - **Some rules use local time,** which changes results by time zone: curfew, fun-quest day, daily. Catch-up never passes `wallMs`, so daily and season logic don't move during an absence.
  - **Loading changes some state:** NPC targets, `edu.playedMs` and tree positions.
- **Renderers:**
  - Caches never shrink: the 3D `CreaturePool.free` and the pixel `SheetCache`.
  - Some GPU resources leak:
    - `Hollow.set` creates new materials on every floor and never disposes them.
    - `Visit.dress` never disposes its meshes.
  - Failed 3D sculpts retry every frame.
  - Several objects are allocated per frame.
  - 3D uses a pixel ratio up to 1.5 with PCF shadows and bloom, and has no resolution fallback when fps drops.
- **UI and platform:**
  - **The game can freeze if a script file fails to load.** `startGame` waits for `sideStories.then(boot)` and the 3D import with no `.catch`, and `story-scenes.ts` remembers a failed load and never retries. Offline or after a deploy, the title disappears and nothing loads.
  - **The service worker:**
    - Its cache name is a fixed `grove-v1`. The comment promises a per-deploy query that doesn't exist.
    - `index.html` is served from the cache first.
    - There's no update prompt.
    - It doesn't use `waitUntil` for the background refresh.
    - It calls `cache.put` on 206 audio responses, which rejects.
  - **Panels aren't accessible dialogs:** no `role=dialog` or `aria-modal`, no focus management, no `aria-live` for toasts or dialogue. Escape misses the story dialogue, the shelves, the party bout, the dungeon panel and the celebration card.
  - **The in-game reduced-motion setting** doesn't stop CSS animations.
- **Writing:**
  - The voice is warm and funny. Fern's stone is a real laugh, and so are "Rule four. Don't be Sparks." and the tea-tray-of-spoons simile.
  - The story agent's estimate is about 2 jokes per scene, with roughly 70% of scenes landing at least one.
  - **Weak spots:**
    - Q76 says both "Holme" and "Holmes", and one choice mentions Byte, who isn't in the scene.
    - Multiverse "plush" lines are never filtered by whether you own the plush.
    - Toy Story is rated 18+.
    - Lines 13 and 15 of chapter 1 repeat "Don't be dramatic about it."
    - Some narration lines run to 3–4 sentences.
    - About 45 of 91 fun quests have no gate at all.
- **Big files** (over about 800 lines):
  - `world-view.ts` 1474
  - `chao.ts` 1159
  - `strings.ts` 1299
  - `tuning.ts` 1209
  - `types.ts` 969
  - `dungeon.ts` 917
  - `world.ts` 911
  - `actors.ts` 948
  - `grove-scene.ts` 948

### Tests, lint, build

| Check | Result |
| --- | --- |
| `npm test` | 500 passed, 12 skipped (9 tool-script files), 14.7 s |
| `eslint .` | clean |
| `tsc --noEmit` | clean |
| `vite build` | passes; built into the scratchpad so `dist/` wasn't touched |

**Bundle sizes:**

| Chunk | Minified | Gzipped |
| --- | --- | --- |
| `index` | 1.25 MB | 364 KB |
| `side-story-content` (loaded at start) | 1.23 MB | 425 KB |
| **`edu`** | **9.4 MB** | **3.1 MB** |
| `atlas-catalogue` | 2.8 MB | 931 KB |
| `multiverse` | 736 KB | |
| `arcade` | 409 KB | |
| Klee One Japanese fonts | 1.9–2.7 MB per file | |

**Rules with no tests:**
- Catch-up gaps that end in a fine-step remainder.
- Offline vs live weighting of lifetime happiness.
- Normal type lean.
- The double grade upgrade.
- The memorial `form` contents.
- Save round-trips after NPCs have moved.
- Behaviour across time zones.
- The read-only boundary for story worlds.
- Race tie order.
- Anything in the UI or service worker beyond a few files.

**The deployed build is older than the repo.** Its Keepers are named "Gardener", "Tide-pooler" and so on, instead of Fern, Marina…

## Screenshots and scripts

They're in `C:\Users\God\AppData\Local\Temp\claude\C--Users-God-Downloads-Test-Des\4e00e381-c471-4628-b477-d799cf4df086\scratchpad\pw\out\`. Names starting `p…` are Pixel desktop, `d3-…` 3D desktop, `ph-px-…` and `ph-3d-…` phone, and `camp-3d-…` the campaign run. The drivers are in the folder above it.
