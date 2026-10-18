# PROGRESS.md

Read this with CLAUDE.md at the start of every session. Keep it under 150 lines: when a
new pass goes in at line 12 and the file is long, move the oldest section to
`docs/progress-archive.md` (newest first there too).

## Status (2026-10-16, evening)

Shipped and deployed (https://diablomaster8.github.io/TryThisGame/): v1, the organic
painted Grove, the Digimon-inspired ten, the Hollow Below, the 96-unit field, three save
slots per mode, and the Full 3D mode as a Graphics setting (`src/render3d/`, workers and
caches, the G13 polish, the G14 bundle diet, the G15 and G16 parity fixes) with the pixel mode
unchanged. Story content pack in `src/content/`; engine CV1–CV6 wired (campaign v2 and
endings, all 31 side stories and the fun quests running, props and keepsakes, the Learning
Grove switch, Hebrew and Japanese, Atlas/Arcade/Multiverse saves, Mature content setting,
one-time gifts). Content (2026-10-18): every storyline scripted, Q66–Q95, PA1–PA5, LB and LK
included; edu done wherever audience and outline allow (none logged for Q66–Q95); fix-mode reviews done for Atlas A1–A10 and A22–A31
and every Atlas and S24–S31 edu version, the rest canon-audited only (`docs/content-index.md`). Plan v4
(`plan.md`): G11 device pass, Track B writing and review tasks, and Part Z, the
independent full review that runs last. Plan G12 is built and pushed (2026-10-17): the storyline engine, expansions E1–E3 and the four separate campaigns SL1–SL4, sections below and in the archive. Maor, 2026-10-17: legal cleared,
adviser sign-off given, the seven fun-quest quotes approved as written, Pixel stays the default
(Full 3D remains a setting); the Atlas quote and audience items in the two wave reports are fine;
the phone view passes; Expedition and races get 3D versions in Full 3D. Waiting on Maor: the
Arcade and LB/LK decisions (section "Pixel's Arcade PA1–PA5" in `docs/progress-archive.md`).
Backlogs: `docs/creature-improvements.md`, `docs/content-index.md`.

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
- **Known bugs, for Maor:** the modes still disagree on three art choices. Eternal Neutral is
  silvery lilac in Pixel and lime green with a gold chain in 3D (line-up figure 5); Eternal Moon
  is black and red in Pixel and deep navy in 3D; the character looks in 3D follow the line-up
  references (fox: black hood, orange vest), Pixel's older palettes (fox: all orange). Captures
  from the hidden browser pane look washed out; not compared with a visible frame. The device
  pass (G11) is still owed.
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

## Save safety: review bugs 4, 5, 29 (2026-10-18)

From `docs/review-independent-2026-10-18.md`. Works:
- `?edu` erases a Learning Grove slot only in dev builds; on the built site it opens the title
  with the Learning Grove slots in view (`showTitle(…, focusMode)`). `?free` never erased.
- A save that fails to load is copied to `<slotKey>.unreadable.1|2` (newest first, same text
  not re-pushed; `backupUnreadable`/`readUnreadable` in `platform/storage.ts`, count in
  `SAVE_SAFETY`) before the fresh start, with a toast. If the copy fails, `Game.holdSaves`
  stops every autosave until an import or reset. Settings shows "Export the save that could
  not be opened" while a copy exists.
- Import: refuses files over 5 MB, Nubbins missing what the sim and renderers read
  (`nubbinProblem`/`importProblem` in `sim/save.ts`; load stays lenient), and saves of another
  mode (`modeOfWorld`); asks before replacing the named slot; comes back with Mature content
  Off and the rift unconfirmed. Tests: `tests/sim/save-safety.test.ts` (9).
- **Stubbed:** checked by tests and typecheck only, not in the browser (the preview entry needs
  the shared parent `launch.json`). The kept copies are never pruned except by rotation.
- **Assumption:** a save's mode is read from its world (edu, then storyline, then campaign);
  a Free Grove where the debug panel started the story reads as Hazel's Grove.
- **Known bugs:** `replaceWorld` does not re-sync tiles, lanterns or the dungeon until reload.

## Standing approval (Maor, 2026-10-12)

"When you finish, proceed straight through to the next development. I'm approving it. Keep
going until you hit the session limit." So after each milestone passes its done-when
checks, start the next one without waiting. Still plan each one briefly in the session
log before coding, still keep the per-milestone commits and checks.

