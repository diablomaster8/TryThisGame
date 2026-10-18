# PROGRESS.md

Read this with CLAUDE.md at the start of every session. Keep it under 150 lines: when a
new pass goes in at line 12 and the file is long, move the oldest section to
`docs/progress-archive.md` (newest first there too).

## Status (2026-10-18)

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
going in pass by pass. Maor, 2026-10-17: legal cleared, adviser sign-off given, the seven
fun-quest quotes approved as written, Pixel stays the default; 2026-10-18: ship the Arcade, the
Multiverse, Neopia and Q66–Q95. Waiting on Maor: the LB/LK decision (section "Pixel's Arcade
PA1–PA5" in `docs/progress-archive.md`). Backlogs: `docs/creature-improvements.md`,
`docs/content-index.md`.

## Review goal 7: the Arcade, the Multiverse, Neopia and Q66–Q95 ship (2026-10-18)

From `docs/review-independent-2026-10-18.md` (goal 7 and 9 rows, "What the notes get wrong").
Works:
- **Story worlds:** `sim/arcade-catalogue.ts`, `multiverse-catalogue.ts`, `neopia-catalogue.ts`
  load through `loadArcade`/`loadMultiverse`/`loadNeopia` (`sim/atlas.ts`) as their own chunks.
  More menu: the cabinet (after chapter 5 in Hazel's Grove), 🌀 The rift (Mature content 18+
  only, `askRift` before it first opens), 🌈 The rainbow gate (Free Grove any time, Hazel's
  Grove after chapter 2); none in the Learning Grove. One `StoryShelf` serves all four saves.
- **Runner:** a `LineContext` lets a line read the rest of its save (cross-line `requires`, the
  endgames waiting: shelf says so); `stepLive`/`choiceLive` per line (`sim/multiverse-rules.ts`:
  E1's two paths, E6's allies, endings and afters, the wish and Eternal choices); `closed`
  (Neopia's rival faerie chains). Variants still read only the line's own flags. E6's gate scene
  makes the reflection; the `eternal` ending gives it up (Multiverse save only).
- **No Grove writes:** finished quests keep their reward ids in `LineProgress.rewards` (side
  save v2, migration). Neopia's blessings, paint, potions, recipes and decor are rewritten to act
  on the Neo pet, the Neopia sandbox and kitchen, and the Battledome opens in Neopia, not the
  dojo. `tests/sim/story-worlds.test.ts` plays every world to its end against a frozen Grove.
- **Q66–Q95:** in `side-story-content.ts`; `isFunQuestCode` to `FUN_QUEST_LAST` (95), so they
  pause in chapters 9–11; "once Chapter N is done" parses; the packs' payoffs (Q70 → Q71/Q75,
  Q78 → Q84/Q85, Q87 → Q91/Q95) in `sim/fun-pack-rules.ts`.
- **Quotes:** every Alice quote checked against Gutenberg #11/#12; two corrected to Carroll's
  words. PA1's two unverifiable prayer lines are now paraphrases.
- **Dead choices:** the ten S1–S5 flags each add one line three or more stories later, in all
  three bands (`sim/choice-payoffs.ts`, table in its header; `tests/sim/choice-payoffs.test.ts`).
- **Stubbed:** story-world rewards are kept but nothing shows them yet (no Neopia bag or
  sandbox screen; the Grove does not read them as cosmetics); the cartridges' Grove-flag
  variants (s21Done, cinder) and the Multiverse's line swaps and inserts from the E3/E6 notes
  are not wired; E6's "warn once" before the Eternal ending; script-book not regenerated
  (`tests/tools/script-book.ts` is mid-edit in another session).
- **Assumptions:** the rainbow gate opens after chapter 2, like the fun quests.

## Review goals 3 and 4, Bugs 11-13: both modes draw the same Nubbin (2026-10-18)

From `docs/review-independent-2026-10-18.md`. Maor, 2026-10-18: the Eternals are the three
Chaos forms. Shots in `docs/samples/r18-<pass>-{pixel,3d}.jpg` (parts, hats, looks, jewel,
chaos-eggs, keeper, moods; 3D only: standin, mixed).

- **Works, Full 3D:** critter parts as a `~parts:` look key (`samples/nubbin-critter-parts.ts`);
  hats with dye, scarf and glasses on the `Dresser` (`render3d/dress.ts`); character looks
  (`~look:` on adults and Eternals, the catalogue figure on children); jewel Nubbins and eggs;
  the co-op second Keeper; poses sad, dizzy, surprised, love, tumble, flap and swim (wading
  otherwise) after the pixel `clipFor`; an egg per family. Format rows in `docs/species-format.md`.
- **Works, both modes:** one Keeper look rule (`render/keeper-look.ts`: the chosen trainer's
  outfit, trim tinted Sun or Moon); `flaps`/`swimsStroke` in `sim/stats.ts` at
  `MOTION_CLIPS` level 30 pick flap and swim in both. Sim: `JEWEL_EGG_COLORS`, the shop sells
  one at `SHOP.jewelEggChance` (0.02, never two-tone or shiny); `ETERNAL_REFS` in `sim/species.ts`.
- **Works, leaks and limits:** items share geometry per kind (`render3d/item-kit.ts`) and are
  disposed on removal; `CreaturePool.dispose` frees spare rigs; `MergedGlow.dispose`. Measured in
  Full 3D, `renderer.info.memory`: 216 geometries / 43 textures before 10 hatch-and-eat cycles,
  217 / 50 after, then flat at 242 / 51 over 20 more (the one step is a new look sculpted once).
  The pixel atlas evicts by recency and leaves `ATLAS.headroom` (25%) free after a repack, so a
  dress-up spree of 150 new sheets in 30 frames took 27 repacks and no sprite went missing; new
  sheets upload only their own region (`copyTextureToTexture`). The atlas canvas is never made
  in Full 3D. The veil waits for every Nubbin the world draws (`GROVE3D.loadSafetyMs` 90 s is
  the only way past); stand-ins are low warm domes, never upright pale capsules.
- **Fixed on the way:** the 3D scene's `dt` is clamped at 0; a clock stepping back made the
  eased camera NaN for good.
- **Stubbed or approximate:** the crown pokes through hats in 3D; the fox look's tails are
  static; type-tell accents keep their type colour under a look; the stage's `&pose=` list does
  not know the new poses; the emote ball floats at full height over a stand-in dome;
  `render3d/actors.ts` is 946 lines (split it next time it grows).
- **Pixel follows the 3D line-up (Maor, 2026-10-18):** Eternal Moon is dark indigo with an ember
  eye and small lavender shoulder spikes in place of great wings; Eternal Neutral is flat lime with
  a yellow-green belly and salmon hands and feet (no gold chain in Pixel); the character looks
  take the line-up palettes, the fox a black hood, the echidna white crown spikes, the dream
  look magenta (`render/sprites/chao.ts`; shots `r18-looks-pixel.jpg`, `r18-chaos-pixel.jpg`).
- **Known bugs:** captures from the hidden browser pane look washed out; not compared with a
  visible frame. The device pass (G11) is still owed.
- **Assumptions:** jewel egg chance 2%; flap and swim at level 30.

## Review fix: panels over story scenes, Beetle Run (2026-10-18)

Bug 3 of `docs/review-independent-2026-10-18.md`, with its neighbour bug 20.

Works:
- Panels, sheets and notices (`.modal`, `.sheet`, `.pocket`, `.celebrate`, `.catching`,
  `.debug`) sit at z-index 16, above the dialogue (15), so a tap on them never lands on it.
- `Dialogue.waitWhile` (wired in `hud.ts`): while any stacked panel, a running minigame, the
  away summary, a celebration, the memorial card, the Learning Grove screens or the catch-up
  veil is open, the scene waits on its line (class `waiting`: dimmed, `pointer-events: none`,
  Space/Enter ignored) and resumes when the last one closes. `mountPanelStack` now returns
  `anyOpen()` and calls back on every settle, so the wait starts the moment a panel opens.
- Beetle Run, the race, karate and gym screens are pinned panels in the stack: a menu opened
  over one (Races over Beetle Run) is shut at once, so results never stack over a dialog.
  Escape quits Beetle Run to its results (keeping the cargo), and a second Escape closes them.
  Escape also closes the away summary. Scenes do not start over the gym or Beetle Run.
- Checked in the browser pane at 1280x800 and 375x812, in Pixel and Full 3D: after a 4-minute
  `resume()`, `elementFromPoint` at Continue returns the button and one tap closes it; the
  stats sheet, settings, shop, roster, journal, races, atlas and cabinet all wait the scene
  with no button hitting `.dialogue`, and the line never moves; Space, Enter and a tap on the
  box do nothing while a panel is open; a tap advances it again after. Screenshots
  `docs/samples/bug3-away-over-scene-{3d,pixel}-{1280,375}.jpg`.

Stubbed: no DOM test environment, so there is no unit test; the checks above are manual.

Known: with a scene waiting under the stats sheet (no backdrop), taps outside the sheet reach
the Grove as usual. Anything that opens a panel mid-scene pauses the story until it closes.

## Standing approval (Maor, 2026-10-12)

"When you finish, proceed straight through to the next development. I'm approving it. Keep
going until you hit the session limit." So after each milestone passes its done-when
checks, start the next one without waiting. Still plan each one briefly in the session
log before coding, still keep the per-milestone commits and checks.

