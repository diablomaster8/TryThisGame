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

## Round 10 · Lane E LOOK + KIDS + FUN (2026-10-31, branch r10/e)

26 items (21 done, 5 partial), lines in `recs-2026-10-27/STATUS.md`. Ten more items the round was
handed turned out already done in earlier rounds (their newer STATUS lines say so). No save version
bump; new fields are optional: `settings.access`, `edu.readerAge/tutorialSaid/lossHolds/daily/attention`.

**Works**
- LOOK: crying (Pixel cry clip; 3D cry pose with tears in the shared Bursts cloud), Sun/Moon tinted
  heart/swirl/!, the Run-touch crown, eight seeded garden idle acts (`render/idle-acts.ts`), the
  Greymon lean (3D) and MetalGreymon's metal arm.
- FUN: 15 Keeper micro-scenes (`content/campaign-micro.ts`, `sim/campaign-micro.ts`), Byte's lace
  (`sim/byte-lace.ts`, frames in both modes, Moss visits), Lazy roll/float and the ball splash
  (`sim/travel-gags.ts`), the splat and the Keeper hop, stray tiptoe, cross-world badges (18+ only).
- KIDS: portraits on edu tiles, reader ages 7–10, sprout HUD (4 pictures + 🔊, hold-to-open
  grown-ups tab, spoken one-time tutorial), access settings (readable font, high contrast, Largest
  text, simple touch), loss heads-up for ch10–11 and S10/S19/S27, grown-up area as four tabs with a
  7-day chart, standards in plain words, attention figures and a tips deck, real "do" beats for
  lesson checks, 52 pixel icons for the game emoji, the postcard around Ori's and Hana's faces,
  sprout scenes never open on a blank box, and `npm run smoke:kids -- <url>`.

**Stubbed / left**
- Pixel Greymon lean, the missile, front stripes in 3D; the fed stray's shy-delighted beat; a
  bundled OFL dyslexia font (needs a dependency OK); tab-length and one-page print checks; a tip
  card after the break; number clips for counts are still the placeholder chime.
- Nothing here was looked at by a person: idle acts, cry arm angles, pixel icons and portraits want
  an eye pass.

**Known bugs**
- In a new sprout save, the chapter-opening scene takes over from a game after about 3 taps, so
  `smoke:kids` fails its "game reaches results" step. Main does the same; not from this round.
- Under heavy machine load the timing tests (lifecycle, world 8-Nubbin, battle-balance budgets)
  fail; side by side with main they run the same (8-Nubbin 3.52 s both).

## Round 10 · Lane C CAMP + FIGHT (2026-10-30, branch r10/c)

Commits 11b648cf (sim) and ed982a86 (UI and renderers). Save stays **v13**: every new field is optional. 25 items: 16 done, 9 partial.

### What works
- one save with Hazel plus lines; walking through the gate into the Fold dresses the Grove with the Fold set and the Hundred Days' goal; Back shows Hazel's Grove with every landmark, in Pixel and 3D.
- regions open by Hazel's chapter (3/5/6/6/8), announced once; lines can't begin before their region opens.
- a line's scenes wait for its region and the spine, side stories and other lines go on meanwhile; the objective chip says "Waiting for you in the Fold".
- Logged In's server tint and Dawn & Dusk's Sun/Moon recolours apply only inside their regions and are restored on leaving.
- rolling backups of every slot in IndexedDB. The first save of a slot is always kept, then one every 10 minutes of play and one at each chapter, 3 per slot. Settings → Saves lists each backup's age and stored size, with Restore, which swaps the world in place and keeps this device's Mature content choice.
- chapter checkpoints (the first snapshot per chapter key) for Hazel's Grove, the lines beside it and the separate campaigns. Keys are recorded only after a successful write. Erasing a slot deletes its checkpoints and backups; a reset deletes only its checkpoints.
- the `grove.index.v1` slot index. The title does one read, and a missing or broken index rebuilds itself.
- slot names and tags on the title. The tag is shown as an icon plus a word plus a colour, never colour alone.
- endings reached from now on carry a date on the endings shelf.
- Story pace setting (Full/Brisk/Story only). Brisk shortens the story's pauses to a quarter. Story only adds Skip goal to the journal, makes the smallest world change (Sable's trust really reaches 45), records `campaign.skipped`, never skips choices, and shows a summary card.
- "Do it" is gone. Steps show Play it · <game>, Go there (with Skip), Imagine it or Skip. Each skip shows the "What happened" card, and story scenes wait while it is open.
- the journal's Go there for the chapter goal and for placed quest steps. The world beacon follows whatever goal the objective chip is showing. Running questlines now cycle on the chip with chapters and minutes left.
- "The story so far" card after the away screen when the player has been gone 3 days or more, plus a per-line fold in Other roads.
- battle HP base is 24; the 2,000-bout Champion run and the CI balance harness both pass (median 14 / 12–13).
- reachability bot now also plays every questline to an ending in the one shared world.
- a line's Nubbin that stayed in its place shows (both renderers, roster) only in that region.
- a notice board with cards stands inside the Grove gate from chapter 3; each finished line leaves a Grove-change prop; the content checker prints the story Shells total against a cap.

### What's stubbed (and assumptions)
- the server and Sun/Moon entrances reuse the board and the green's shrine marks; no new workbench or switch prop is drawn. The Hundred Days has no `present()` (its onArea still moves location and weather as before).
- the 40% spine-time bot measure (R0640); the map's per-area quest sheet (R0650).
- "after chapter 8" read as chapter 8 itself (chapters 9 to 11 are quiet, so 9 would push the Beetle Road to 12). Sun and Moon open at 6 (the rec names no chapter).
- no chapter-select or "Watch again" UI reads the checkpoints yet, and nothing restores a checkpoint. Chapters begun during offline catch-up get no checkpoint. Profiles (CAMP-29) don't exist, so the index is flat.
- writer recap and step summary text (recaps are assembled from data, and steps fall back to "Done: <goal>"). Skip goal for questline goals. No summary card on Atlas steps. No recap when Aging while closed is off.
- Grove-change props reuse existing shapes (signpost, lamp, shrine, lens); no bespoke sundial/terminal art; tapping the board prop doesn't open the board yet (the Journal does).
- `CAMP10D.storyShellsMax = 1200` is not measured.

### Known bugs
- Beetle Road's `onChapter` may start a Hollow run when its goal is met outside the Hollow (pre-existing, not changed). Lines whose goals are met outside their region queue their next scene only on the Keeper's return, by design.
- an older ending (reached before this round) shows no date. Closing the name dialog with its X or the backdrop leaves a hidden modal node until the title redraws.
- after a debug chapter jump Sable can be missing, and then chapter 7's skip cannot meet the goal. Real play spawns her in chapter 3. Brisk reaches 31% of Full for chapter 2→3, not 25%, because the closing's hour wait is not scaled.
- props within 18 units of the Keeper only, so they pop in when you walk up; a 3D model rebuild happens on pop-in.
- Under full-suite load the timing tests (lifecycle, nav, world, species, gen1a art) time out; each passes alone.

## Round 10 · Lane A SOUL + MOVE (2026-10-30, branch r10/a)

24 items (22 done, 2 partial) from four helper agents, plus two gate fixes. Lines per item in
`recs-2026-10-27/STATUS.md`. No save version change (optional fields only: `Nubbin.rivals`,
`makeUp`, `searchBoost`, `recentCare`, `lessons.instrumentKind`, `world.doodles`); no
`src/content` change.

- *Works:* MOVE: ⤢ in More on phones; grey ✕ / ⤒ flags on refused taps (both renderers); Pixel
  Keeper leans uphill; wider 3D arm swing when running; a glide can cross the pond, a jump out
  over the pond without Swim puffs back to the last safe spot; the waterfall-shelf keepsake
  (double jump from tier 2 by the falls); fence posts in the shared collider table; Pixel decor
  drawn turned from its yaw; visitors pause 600 ms and step round a Nubbin; the see-through
  Keeper has a rim, and Corvin's, the guard and visit houses fade. SOUL: friendships by
  personality fit, rivalries (snatches, fruit races, show-offs) with puffs and making up, the
  sheet's best friend / rival line; a visitor sends a shy one behind a tree; Sun Nubbins tidy
  toys; Learning Grove cottage hiding (tap the cottage to coax out); per-personality idle
  quirks (distinctness test now passes); care memory (flinch after a throw, asks after pets,
  trails the fruit hand); eat/nap/float flavours; lessons look and sound different (doodles,
  ♪, dance styles, instruments); fortune teller reads traits and hints likes; doctor check-up
  card; 12 new morphing emote shapes; buddies chat in picture bubbles.
- *Stubbed / left:* Hollow leaf-bridge (R0025, lane B); cry variants and render clips for the
  eat/swim flavours (R0558); rival chats never start yet (only buddies chat); no singing mouth
  frame; `recentCare` never records `ignore`; R0018 has no pixel sweep in a browser; the ⤒
  flag has no real spot found in a test.
- *Bugs / notes:* the pond poof fires only after a jump from dry ground (it fired every step
  for a Keeper placed by the water). `soul-toys` now averages three worlds against the same
  bounds (seed 77 alone read shy 14.7% vs an 8-seed mean of ~16% on main and here).
  `tests/render/shadow-merge.test.ts` from main failed `tsc` (build); typed here.
  HOT-1 (`hot1.cjs`, 8 runs) passes; on 3D phone the sheet opens almost full height, so the
  clear strip is 12 px wide (same on main); a pixel-phone tap fell back to the hook while a
  talking visitor stood by the Nubbin, and passed on rerun.

## Round 9 · Lane D WORLD + TECH (2026-10-30, branch r9/d)

20 items from four helper branches (r9/d1–d4, merged) plus one perf fix after the merge. Lines
per item in `recs-2026-10-27/STATUS.md`. No save version change (optional fields only:
`world.hintsSeen`, `world.secrets`, `world.debugSeason`); `src/content` gains one world trace.

- *Works:* tap-path footprints every 0.8 u with a "?" puff for a shut-in tap (lane A's
  tap-path/tap-marks, no new draws); the Grove's soft border (`sim/border.ts`: hedge and
  "not yet" logs, one toast per stretch); world hints taught once (`sim/world-hints.ts`); the Old
  Key opens the nook at the falls; a synthesised sound bed per biome after the first tap
  (`platform/biome-beds.ts`); free play wears the season (Pixel blossom/fireflies/leaves, both
  renderers' existing season paths) with a debug Season row; per-POI parity shots
  (`PROBE_PARITY=1`, `docs/logs/parity/`, git-ignored); unused creature surfaces dropped on hide
  (heap 203 → 192 MB); language fonts load per language; battle/tactics text follows Text size;
  dialogue and selection live regions, Tab through Nubbins; hold-to-erase with a 7-day restore;
  touch long press and pointer-sized drag thresholds; Web Share for exports on phones; shake
  how-to over the egg; an offline "needs the internet once" card for lazy parts.
- *Stubbed / left:* snowmen, leaf piles, 3D pond ice and 3D season particles (R0118); the egg's
  crack stages (R0503); axe on every panel (R0470); long press on items/NPCs (R0472); Klee One
  subsetting (R0490); per-chapter side-story loading needs a skeleton/scene split (R0491); the
  eager bundle is 899 kB gz and cannot reach 450 by lazy imports alone, lazy HUD panels would
  save 58 kB (R0446/R0451); heap ~190 MB vs the 180 cap (R0081).
- *Bugs / notes:* after the merge 3D farOrchard read 461k tris (cap 450k): the 158 border
  hedge bushes were 80-triangle shadow-casting instances drawn from every spot. Now their own
  20-triangle, shadowless mesh on the bushes' material (5a9278a5). Four phone probes on the
  head (`PROBE_URL='http://localhost:5186/?debug'`, now 20 spots × 2 with `village`): 0/40 over
  each, farOrchard 153, 154, 154, 151 calls at 412–440k tris. Edge smoke
  `recs-2026-10-27/tools/r9-d-smoke.cjs`: 0 console errors in Pixel and 3D at 1280×800 and
  375×812. Full `npm test` under load: 10 timing failures (lifecycle, nav, world, species,
  obstacle-grid, battle-balance); all 7 files pass alone. Forcing a season fires its festival
  dialogue (existing behaviour). In 3D a border way that opens later keeps its log until a
  rebuild.
- *After merging main c3a8b43c (E r9, B r8):* conflicts in hud.ts/title.ts imports (both kept; the
  slot row keeps the edu colour tag and the ⋯ menu); main's shadow-merge test kept. Gate green
  (timing tests pass alone), Edge smoke 0 errors in all four, four phone probes 0/40 over,
  farOrchard 154, 156, 154, 156 calls at 440–442k tris.

## Round 8 · Lane B DUNG (2026-10-30, branch r8/b)

- *Works:* Pixel now draws Hollow packs (`render/hollow-packs-pixel.ts`): huddles of up to 3
  stand-in sprites, "!", "?" and Zzz, ◆/◈/★ plates from one shared `packPlate` (3D uses it
  too), and fog hides packs, strays and the wild one out of sight, with loot remembered at 55%.
  A rarity-shape pop rises over the Keeper on each gear find, in both renderers. Items: boots
  and charms speed the Keeper, Snug/Naps/Brave/Crumbs are read; the stash has 4+ tabs, a slot
  filter and search, `stashPut`/`stashMove`, and a 🧺 Cottage chest by the cottage door. Charms
  (8 kinds, 3 grades) go into 0–3 sockets, with 6 ordered Charm Chains. The Gardener's
  Wheelbarrow at the act camp's Crafting table has 7 tested recipes. Brisk/Wild keys (pity by
  the 10th win) open `gear.pillowFort`. There are 6 sets and 20 uniques, logged on the Journal.
  Floors: secret side caves stay rock until leaned on for 1 s or found by a Light/Scout friend
  (✧ on the map). Puzzles: plates, torch order, and 12 push-block layouts proven solvable. A
  critter part (fins/wings/strong arms) solves a puzzle on the spot. Boss doors seal behind
  the Keeper, and a lost boss fight retries from the anteroom. Floor 99 generates in ~13 ms
  (was ~19 ms in Node), and layouts are byte-identical. Party: roles Fetch/Fight/Light/Scout/Swim
  (`dungeon-roles.ts`), a role button on each picker card, and a party of 3, rising to 4 after
  Act II's boss. A "Story so far" scroll appears once per act boss (skipped in ch. 9–11). "👣 Show me the way"
  (off by default) puts footprints on the maps and an arrow on the bar. The speed-run ghost
  line is drawn on both maps. "📤 Share today" opens a card. A Homing Acorn row is in the shop.
  Economy bands are in `config/dungeon-economy.ts`, with a per-act payout scale (tested 26→62
  Shells/min).
- *Balance changes to review:* Hollow Shells are about 2.5× lower everywhere (`shellPay`, the
  rec's 25→60/min line); `DUNGEON.partySize` is 3 (4 after Act II); gear speed applies to all
  Keeper walking while worn.
- *Stubbed:* the Pillow Fort level, its trio fight and crown (keys only set a flag); the
  Moo Meadow recipe; Brave isn't passed to lane C's battle core; the backpack `carry` stat is
  unread. Role personality behaviours, and Light revealing secrets. Guide footprint decals in
  the worlds. The fixed daily act chain. Pixel crack art on secret walls (only a faint glint).
  New optional save fields, no version bump: gear `charms`, `keys`, `found`, `pillowFort`, item
  `sockets`/`setPiece`/`unique`/`tab`; hollow `roles`, `scrolls`, `guide`, `records[].trails`; run
  `scouted`, `trail`, `seals`, `puzzles`.
- *Fixed (follow-up):* a seal flip no longer rebuilds the cave. Both renderers build one
  floor per level (`sealDisplay`: every secret open, finds laid out); what a seal shuts stands
  as plug blocks (3D: sunk or raised through the cutaway's height texture; Pixel: a small
  mesh per seal) and shut finds hide (`lootHeld`). Headless Edge, worst frame around a flip:
  3D 108 ms → 20–31 ms, Pixel 1.8–3.2 s → 19–23 ms (`tools/r8-b-seal.cjs`); a test checks
  drawn rock = sim rock in every state. The boss scroll waits for the fight and the boss card.
- *Known:* secret rooms come about 1 level
  in 3, lower than the rec's 0–2. Edge smoke `tools/r8-b.cjs` passes 14/14 in Pixel and 3D,
  on desktop and at 375×812, with 0 errors and 56–57 fps. Timing tests (lifecycle, nav, world,
  species, battle-balance) fail under the full parallel run and pass alone.

## Round 9 · Lane E LOOK + KIDS + FUN (2026-10-30, branch r9/e)

- *Works:* **KIDS.** R0720/R0696 an age tile leads to a name, colour and animal step; edu
  slots show the child's icon, name and colour edge, the Learning Grove lists first once one
  exists, and `./?kids` (a manifest shortcut) is a picture-only picker. R0704 a session arc
  (`eduPhase`: hello, main, care, second, wind-down, goodnight) drives the entry prompt, the
  first prompt calls the Nubbins, and R0724 idle Nubbins yawn in the wind-down. R0730 optional
  read-aloud auto-advance (`edu.autoAdvance`, off). R0734 co-play prompts as "For grown-ups"
  chips. R0736 Hebrew and Japanese glosses as ruby under the word. R0737 a sun-and-moon clock
  for Ori and Hana's next visit, plus a grown-up skip (`edu.langSkipAt`). R0678/R0679/R0677
  more sprout 64 px fixes, HUD labels and choice icons. **LOOK.** R0380 3D crown spring; R0418
  Moon-band rim and R0404 Eternal rims/eyes as uniforms (no new programs); R0398 3D shiny star
  glint; R0410 3D signature particles in the shared burst cloud; R0405 a bird plan in both
  modes plus Charizard, Gyarados, Lapras, Arcanine and Tauros; R0407 Angemon, an insect recipe,
  Andromon, Etemon, Numemon/Sukamon; R0379 a flickering 3D tail flame, Charmander's flame seen
  from the front, wings raised; R0435 the quad-plan reference check. **FUN.** R0358 field notes
  for all 243 pocket and digital species; R0332 the last 8 curiosity triggers; R0338 the Q86
  hint jokes; R0441 the "With me" photo selfie; R0424 a remembrance flower hat for bonded
  friends; R0356 a pixel gate scene under the title logo; R0325 the 3D race butterfly.
- *Stubbed:* the first Nubbin's portrait on kids tiles; the Story tile still opens the journal;
  ~7.1k sprout choices still have no icon; the Run crown shape; the joyful race trip (needs sim);
  Ponyta, the Bulbasaur line, Exeggutor, Doduo and Horsea likenesses; sprout field notes.
- *Bugs / notes:* none known. No save version bump; the new fields (`edu.icon`, `tagColour`,
  `autoAdvance`, `langSkipAt`, `Nubbin.remembers`) are optional. Open for Maor: the Eternal rim
  and eye signatures (R0404). Smoke: `recs-2026-10-27/tools/lane-e-r9.cjs`, `lane-e-game-r9.cjs`
  and `lane-e-r9-extra.cjs` (port 5189) in Pixel, Full 3D, desktop, 375×812 and reader: 0 console
  errors. The selfie was reached but not seen with a hatched Nubbin.
## Round 9 · Lane C CAMP + FIGHT (2026-10-30, branch r9/c)

- *Plan:* the CAMP/FIGHT partials, then the top new CAMP items, in four disjoint groups. 24 STATUS lines (10 done, 14 partial). Save stays **v13**; every new field is optional (`Nubbin.home`, offer `expiresMs`, `Combatant.mod`, `EncounterSpec.brave`).
- *Works:*
  - Journal: a Quests tab with search and chips; Errands block; an endings shelf per road; lines' minutes left. On phones, tabs sit in a sticky footer above Close, and a swipe down closes. It is a tablist with keys.
  - Offer card: the giver's portrait, the offer window, Esc for Not now, focus returned. The bring-home prompt (`ui/line-cast-prompt.ts`) and the lineReward/questExpired toasts are wired.
  - Sim:
    - `scene-queue.ts`: owner priority. `spineBusy()` keeps Hazel first.
    - `line-rewards.ts`: Shells, a keepsake and a Grove-change id per line.
    - Offer windows (S12) and the Mature-content gate per quest.
    - Caper cadence (`QUEST_CADENCE`).
    - `rest.ts`: Rest until, run as ×100 on the live clock.
    - `goal-target.ts`: Go there for spine goals and tracked quests.
    - Settings > Saves shows save time, size and the IndexedDB mirror.
  - Fight:
    - Hollow foe mods take effect in bouts (`battle/hollow-mods.ts`), and Brave adds hit power (`tuning-battle-r9.ts`).
    - The 3D idle row is at `?aaa=1&creature=idles`.
    - `tests/tools/battle-balance-champion.ts [n]` runs the Champion balance check.
  - `tests/sim/reachability.test.ts`: a bot in one Open world reaches 121 of 129 quests, the spine's end and all 5 lines' starts. Unreached ids are pinned in `KNOWN_UNREACHED`.
- *Stubbed:*
  - Lines are not on the objective chip.
  - Grove-change props for line rewards are not placed in either renderer.
  - Roster/renderer filters on `Nubbin.home`.
  - Copycat, Snack Thief and Hiding mods.
  - Rolling backups with Restore (CAMP-31).
  - Go there from the journal and the beacon.
  - Region waits.
  - Endings shelf dates.
- *Known bugs:*
  - Q79–Q85's autumn chain can't finish: only chapter 8 is autumn, and the post-game is always spring.
  - E3 is offered at `hollow/stairs`, but nothing starts underground (`campaign.ts` returns in the dungeon).
  - The 2,000-bout Champion run fails the median, 15 turns vs 14.
  - A `free` story with an offer window can be accepted from the board inside the window.
- *Gate:* lint and build clean. `npm test` under load: 11 timing failures, all passing when their files are rerun alone. The 8-Nubbin hour test runs at 1.9 s here and on main. Smoke `recs-2026-10-27/tools/lane-c-r9.cjs` passes in Pixel and 3D at desktop and at 375×812, with 0 console errors.
## Round 8 · Lane D TECH (2026-10-30, branch r8/d)

24 TECH items from four helper branches (r8/d1–d4, merged), plus two fixes found in the Edge
check. Lines per item in `recs-2026-10-27/STATUS.md`. No save version change (one optional
field, `world.tzOffsetMin`); no `src/content` change.

- *Works:* sheet tabs (Care / Inside / Grow; egg sheet 4 controls), "Put down to hatch" button,
  shake meter, "?" brings the keys hint back, desktop top-bar words; music ducking, per-song
  trim, Expedition and Grove sound cues, per-Nubbin chirp voices, the 18+ re-ask before It's
  Always Sunny; device tiers (`platform/device-tier.ts`, `docs/perf-budget.md`), 3D starts at
  its tier with a saved governor level and a Quality setting, a light Pixel governor
  (`render/pixel-gov.ts`), fast debug time through `Clock.giveBack`, a time-zone-free sim
  (`sim/local-time.ts`, CI `test-tokyo` job); update-ready chip, CSP + `public/_headers`,
  offline-greyed story worlds, safe-area padding, forced-colours/contrast styles, more text
  sizes in rem, `docs/architecture.md`; the backup card's buttons take taps again; the phone
  sheet handle is 44 px.
- *Stubbed / left:* pixel-art top-bar icons (R0502); a browser spec opening every panel for tap
  sizes (R0505); real LUFS measuring (R0507); Hollow and bout sounds (R0450); eager bundle
  845 kB gz vs 450 (R0451); light HUD and axe check (R0519); px glyph and battle-screen sizes
  (R0469); the ×10 pixel dip cause is not confirmed in a browser (R0473).
- *Bugs / notes:* in a full `npm test` beside other lanes the lifecycle, nav, world-hour and
  battle-balance timing tests fail; all pass alone, lifecycle within 2% of r8/d1. Phone probes
  (`PROBE_URL='http://localhost:5186/?debug'`, the `?debug` matters or `&sculptRes` is lost):
  0/38 over twice, 3D farOrchard 146 and 162 calls. Edge smoke `recs-2026-10-27/tools/r7-d-check.cjs`
  and `r8-d-check.cjs`: 0 console errors in Pixel and 3D at 1280×800 and 375×812.
- *After merging main 126b61f6:* farOrchard swung 153–181 against the 180-call cap. Fix
  (`render3d/shadow-merge.ts`, phone and slow tiers): still small scenery casters fold into
  2–4 shadow-only meshes, shown only inside `renderer.shadowMap.render` (Three tests casters
  against the view camera's layers) and index-culled to the shadow box; movers get their own
  shadow back (3 moves: for good); tree trunks and fruit stay merged while FarTrees hides them,
  and one shadow-only instanced mesh casts every crown. farOrchard shadow casters 60 → 21.
  Four phone probes: 0/38 over each, farOrchard 156, 154, 155, 154 calls (cap 180) at
  440–443k tris (cap 450k, as before). Test `tests/render/shadow-merge.test.ts`; probe
  `PROBE_BREAKDOWN=all` names unnamed meshes by material and vertex count.

## Round 9 · Lane A SOUL (2026-10-30, branch r9/a)

Plan: HOT-1 first if other lanes' changes had moved it (they had not: main was still
77ebf703, and `hot1.cjs` passes as before), then SOUL items not started, choosing the ones
that unblock others (traits) and those with a clear test, then partials closest to done.
Text in `config/strings-soul-r9.ts`, numbers in `config/tuning-soul-r9.ts` (one re-export
line in `tuning.ts`). No save bump: every new field is optional. New chances are hashed from
the Nubbin and the second (`traits.ts` `roll`, with a murmur finaliser: plain FNV-1a rolled
neighbouring seconds almost alike), so no world rng is drawn. Edge: `node r9a.cjs <pixel|3d>
<desk|phone> 5181` in `recs-2026-10-27/tools`, all pass in the four, no console errors.

**Works**
- R0528 traits (`sim/traits.ts`): 14 traits, one rolled from `n.seed` (no field), a second
  earned by care before evolution (`n.earnedTrait`; tickles, grooms, rain games, snacks, radio
  plays) with a toast. Each lays idle multipliers over the personality and has its quirk:
  clumsy trips ×3, sneezy sneezes ×3, sleepyhead naps ×1.5 and yawns, curious walks to new
  items, brave never shelters, fussy holds out for its favourite, musical hums (♪), showoff
  performs ×3 near the Keeper, neat grooms after meals, night owl stargazes ×3 and dozes by
  day, early bird stretches ×3, copycat copies a neighbour, ticklish rolls about giggling.
  Trait chips (icon, word, blurb) on the sheet. Test: two cheerful Nubbins with sleepyhead and
  musical have yawn and hum as their top quirks over 30 min.
- R0546 glutton (`sim/belly.ts`): snacks on fruit within 6 units below 0.9 fullness (lazy at
  half); three fruits in 5 min give a full belly (a waddle in both renderers), a burp (sound,
  puff, toast) and a nap. A glutton eats ≥2× a non-glutton's fruit in 30 min (test).
- R0543 shy peek (`sim/peek.ts`): as the Keeper comes within 4 units a shy adult (a shy-leaning
  child at half) goes behind the nearest tree on the far side, hides, then peeks; no emote ball
  while hidden. Tapping the tree finds it instead of shaking: giggle, affection +2, trust +1,
  a 60 s rest (45 s after any hide). ≥50% of approaches in the test.
- R0533 Keeper notice (`render/notice.ts`, render-only): a resting Nubbin within 3 units is
  drawn facing the Keeper (Pixel; 3D already glanced), and on the first approach after 30 s
  apart it waves, glances away (shy), grins and skips (mischievous) or lifts a hand (lazy).
- R0545 fruit snatch (`sim/snatch.ts`): a mischievous Nubbin (Moon ×1.5) sprints ×1.6 for the
  fruit another is walking to, runs off with it held up and eats it; the victim looks
  surprised then sad and loses 15 friendship. Never from a starving one (test, 10 seeds).
- R0559 calls for attention (`sim/calling.ts`): past half a slip's mark a lonely child walks to
  the Keeper and tugs with a "?", a hungry one waits under a tree with "!", a sleepy one rubs
  its eyes. Ordinary care ends it. Asked before every lonely slip in the test.
- R0560 jealousy (`sim/jealousy.ts`): a pet is noticed within 5 units: cheerful or fond ones
  ask to be picked up beside the Keeper, mischievous ones nudge the petted one 0.3 aside, shy
  and lazy ones watch put out. ≥60% of trials in a group of four.
- R0542 rest: a Sun Nubbin carries a fallen fruit to a hungry one with none near (8/10 seeds
  within 60 s); a Moon one stashes a fruit by the nearest tree and sits on it. A carried fruit
  keeps its flavour and is set down wherever a walk stalls, so none is lost.
- R0544 rest: trait multipliers and a sleepyhead falling asleep standing below 0.25 energy.
- R0549 rest: the Nubbin whose stats sheet is open draws its bubble 1.5× (`setEmoteFocus`).
- R0551 rest: picked up, a hugging Nubbin kicks its legs (cheerful), goes stiff with no heart
  (shy) or hangs limp (lazy), in both renderers. R0552 rest: a burp, and near the Keeper a
  napping Nubbin snores and chatting buddies chirp (`ui/soul-ambient.ts`).
- HOT-1: re-checked on this branch, `hot1.cjs` passes in all 8 combinations; no follow-up.
- New emote balls for the acts (`render/soul-emotes.ts`) and looks (`render/soul-looks.ts`):
  groom, hum, inspect, giggle fit, burp, full belly, peek, smug run, tug, look up, rub eyes.

**Stubbed / left**
- R0528: no lightbulb emote (curious uses "!"); brave doesn't walk up to Corvin or visitors;
  copycat copies states, not lessons. Roster trait icons (R0579's leftover) not added.
- R0543: the stranger-NPC trigger; the Pixel tree is not forced in front of the Nubbin (the
  hide spot is away from the Keeper, which usually but not always means behind from the camera).
- R0545: rivalry (needs SOUL-20) and the victim's ×1.2 next search; R0542: `tidy`.
- R0546: no dedicated waddle gait in 3D beyond the body sway; fussy's "sulks at a spill".
- R0553's distinctness `it.fails` still fails as recorded: traits are per seed, not per
  personality, so cheerful/mischievous and shy/lazy stay close by state shares.

**Known bugs / notes**
- Tests changed on purpose: `pair-play.test.ts` seed 23 → 12 (the seeded day moved again),
  `soul-toys.test.ts` pins a clumsy seed so the shares measured stay the personality's.
- Traits, snacks, peeks and calls run in a short catch-up's fine steps too (unlike the r8
  antics): a short gap must play exactly as live play (`offline.test.ts` determinism); coarse
  steps never run behaviour, so long absences are unaffected.
- Under full-suite load the usual timing tests fail (battle-balance budget, lifecycle, nav,
  species-digi2, world 8-Nubbin hour); each file passes alone.

## Round 8 · Lane E LOOK + KIDS (2026-10-30, branch r8/e)

- *Works:* **KIDS.** R0682 a skills ladder per game (`EDU_LADDER`; counting climbs count to
  3/5/10, more-or-fewer, sums to 5/10; others by age level): three first-try rights up a rung,
  two shown answers down one, once a sitting, never for readers; the grown-up area says where
  each game is. R0683 per-item mastery (`EduState.items`, `letter:G`, `count:7`…): weaker items
  come up more (seeded weights, recency halved); a 26-letter grid and number/colour/shape strips,
  green ✓ / amber dashed / grey. R0685 "My Book": 60 stickers on six pages in a fixed order (no
  draws; a save's count names its stickers, so old saves need no migration), pixelated art, tap
  to hear, swipe or ◀ ▶; the results card flies the new sticker into the book. R0680 ⋯ in a
  Learning Grove opens Places, 120 px picture tiles (My Book, My Nubbins, Decorate, Photo,
  Play-fight on; Kindergarten, Map, Beetle Run off), hold to hear, grown-up toggles. R0692 an
  edu shop sells from a three-egg shelf that changes daily, each bought once, hatching exactly
  that colour as a Nubbin (no rare/jewel/shine roll). R0695 limits: minutes a day, quiet hours
  (local clock, across midnight), "Open straight into this Grove" (boot lock key
  `grove.kidsLock`, `?title` skips it); a sleeping-Grove card with a gated 30-minute unlock.
  R0703 tracing: misses stay grey 0.8 s then fade, a ghost finger on open and after two misses,
  the stroke finishes itself after four, green start dot spoken, a 15 ms buzz, radius 20 at
  3–4 / 16 at 5–6 / 14 readers. R0712 sprout letter and sound pictures show their words only
  after the answer. R0713 age-4 Animals mixes name/sound/home; Sounds is phonics only. R0714
  count cues in five-frames; after the answer each icon lights as its number is said. R0719
  `{child}` / `{child's}` in Learning Grove lines (c1's letter), "Hello, Maya!" before the entry
  question. **LOOK.** R0425 every saved photo goes to an IndexedDB album (24 newest, 12 kept),
  persisting across reloads; a memorial card shows the Nubbin's newest photo. R0441 twelve
  photo stickers (both modes, the 3D portrait included).
- *Stubbed:* R0441's "With me" Keeper selfie; R0685's milestone stickers (the order is the
  only rule); R0680's Glow Cave, Fun Run and Atlas tiles (those modes do not exist yet);
  R0692's rare colours as sticker or story gifts; R0703's glyph clip on completion (needs
  recorded clips); R0719's "how to say it" field; readers' rounds carry no mastery item.
- *Bugs / notes:* none known. No save version bump: `skills`, `items`, `places`, `eggShelf`,
  `limits` are optional EduState fields. Smoke: `recs-2026-10-27/tools/lane-e-r8.cjs` and
  `lane-e-r8-photo.cjs` (port 5197) in Pixel, Full 3D, phone and reader: 0 console errors. With
  `node_modules` as a junction, Vite 403s the Hebrew/Japanese font files unless `server.fs.allow`
  covers the junction target (a local, uncommitted config did); not a game bug.

## Round 8 · Lane C CAMP + FIGHT (2026-10-30, branch r8/c)

- *Plan:* the offers the round-7 partials were waiting on (CAMP-10), then the small CAMP items
  that build on them, then the FIGHT partials. Sim in new `sim/quest-offers.ts`; text in
  `strings-camp.ts`, numbers in `tuning-camp.ts` (`QUEST_OFFERS`); shared files got
  self-contained blocks. **No save bump (still v13):** `world.questBook`, `settings.questFlow`
  and the summary's `lines`/`questsDone` are optional, so a v13 save from main loads unchanged.
- *Works:*
  - **Open quest flow** (R0602, R0603, R0664). `settings.questFlow` `open` | `guided` (unset =
    guided = exactly the old push). New Hazel's Grove games start Open (`campaignStart {flow}`).
    In Open, a side story or caper whose `opens()` holds waits until the Keeper walks within
    `QUEST_OFFERS.areaR` of its area's POI (`keeperArea`, from the WORLD-05 where-map; unbuilt
    regions offer at the Grove gate), then one offer is made; it opens only on Accept. Not now
    keeps it on the board and it is never pushed on entry again. Cap 5 active; the sixth Accept
    emits `questAtCap` and the card asks which to put aside; shelved progress resumes exactly.
    `never` stories (S5, S9, S10, S27, S28) and anything opening in chapters 9–11 or the vigil
    arrive on their own, as part of the chapter; `lapse` stories (S2, S13, S19, S23, S26) may be
    declined and can't be shelved. A run declining every offer reaches chapter 12+.
  - **Offer card** (R0606): bottom sheet, tag, 13+/18+ badge, size chip, giver, pitch (first
    step's goal), rewards, lapse line, Not now and Accept (48 px, Accept bottom right); folds to
    a "!" chip after 20 s. Hidden whenever the objective chip is.
  - **Notice board** (R0607) in the journal, per region: Available (Accept), In progress (Pin,
    Put aside), Put aside (Take it up again), Done count, with step i of n (R0635).
  - **Tracking** (R0609): accepting pins (≤ 3); the objective chip cycles spine + pinned goals
    with a 1/n count and a 44 px › button; a new step of a pinned quest is toasted.
  - Away screen **Stories** block (R0632); slot cards show line glyphs and stories done
    (R0648); play counts in Settings → Quests and in the save (R0670); debug panel Offers row
    (R0644, `debugQuestOffer`).
  - FIGHT: Sprout AI leans to hits (`hitShare` 0.8), median 34 → 17 turns, asserted ≤ 18
    (R0274). **Bug fixed:** Settings → Bouts: Skip never skipped the campaign's story turn
    bouts (encounters with source `story`); they now resolve at once and count as won, and a
    replay taking every story bout on Skip reaches all eight endings (R0275).
  - Tests: `quest-offers.test.ts` (11), `battle-story-replay.test.ts`, `slot-lines.test.ts`,
    an Open-flow 7-day catch-up in `story-book.test.ts`. Drivers: `recs-2026-10-27/tools/
    lane-c-r8.cjs <px|3d> <desk|phone>` passes all four with 0 console errors.
- *Stubbed:* no board prop in the world (the board is a journal section) and Errands not moved
  onto it; no map or world markers (R0608); giver portrait not drawn on the card; no axe run;
  lines' "about N min left"; regions beyond Grove/lane/Hollow are not walkable, so their quests
  offer at the gate. R0253 (WebGL draws), R0271 (3D gallery idles) not started; R0260's floor-5
  call is still lane B's (nothing sends `guardianStart`); R0333 still has no Circuit race.
- *Bugs / notes:* the offer card can sit beside the hatch card (that card is not in the HUD's
  busy list). A finished auto-resolved bout stays in `world.battle` until the screen closes it.
  Timing tests (lifecycle, nav, world hour, balance budget) fail under a loaded full run and pass
  alone, as before. Switching Open → Guided lets waiting stories open on their own again.

## Round 7 · Lane B DUNG (2026-10-30, branch r7/b)

- *Works:* packs telegraph and give up (R0200): a 0.6 s "!", a chase of at most 8 s or the
  12-cell leash, then home with a "?" (3D) and 3 s of looking away; a Shy party Nubbin shrinks
  the notice radius by a cell; only Swim families chase through water. Gran's Picnic (R0204):
  5 s on the nook's rug tops the party's energy up, +10 happiness, wakes nappers, once per
  level; the tent says it is safe to close. The Deep Hollow stops at floor 99 (R0205). Each
  pack's bout carries a 9×7 tactics board cut from the floor (R0195, `dungeon-arena.ts`,
  `EncounterSpec.board`): heights in steps, props, spawn sides, ≥ 60% walkable and joined
  over 500 boards. A won or fled fight puts the Keeper and party back exactly (R0196), gives
  3 s before the next notice, and the Hollow bar hides during any fight. No bare rooms
  (R0201, `dungeon-rooms.ts`): bare rooms get a nursery nook (100% of rooms hold something);
  roaming packs never sit in neighbouring rooms, never three in a row on the critical path.
  Nursery nooks scan after 3 s of standing quietly, 1 s with a Shy friend; each act has its
  own wild pool of 8 (R0198, `config/dungeon-wild.ts`). Tiers (R0179, `dungeon-tiers.ts`):
  Cosy, Brisk (+35 foe levels, Fancy+ ×1.5) and Wild (+70, ×2.2, capped at 99), opened by
  the last boss, picked at the cave mouth (🍵 🌬 🌪, 44 px), each with its own acts,
  waypoints and boss chests, swapped in place. Keepsakes (R0206): a hat per act boss and
  the "Keeper of the Hollow" cape, data cosmetics drawn by both renderers. Speed runs (R0187,
  `dungeon-speed.ts`): a toggle, a ⏱ chip, a split toast per level with the gap to the best,
  best act times per tier on the Journal page. Encounter cues (R0199): notice blip, poof,
  rarity chimes, shrine hum, waypoint whoosh, a boss sting per act, muted until the first tap.
- *Fixed:* Hollow energy writes were on a 0–100 scale against the 0–1 needs (stray shoo never
  fired, loss and boss-retry rests were clamped by luck); an act boss could stand in a pool
  the dressing laid over its mark (it now takes the nearest dry cell).
- *Stubbed:* R0205's floor-99 generation is ~65 ms (target 25 ms, a perf job); the Deep
  Hollow keeps 'big' floors past depth 9 so saved runs keep theirs. R0179 has no Bell Wire
  trap chains or "Immune to Tickles"; `EncounterSpec.fight` (gentle/standard/tactics) waits
  for lane C to read it. R0187 has no personal-best ghost line on the automap. R0195 has no
  authored boss arenas. Save fields added optional, no version bump: `hollow.difficulty`,
  `tiersOpen`, `tierSaves`, `speedRun`, `records`; run `difficulty`, `splits`, `picnics`,
  `picnicMs`, `tentNoted`, `encounter.at`; pack `gaveUpMs`; wild `nook`, `quietMs`.
- *Known:* the "?" on a pack that gives up is 3D only: the pixel view draws no packs at all
  (a LOOK gap). Edge smoke `tools/r7-b.cjs` (tier picker, speed toggle, ⏱ chip, bar hidden in
  a fight, keepsake worn): 13/13 in Pixel and 3D, desktop and 375×812, 0 errors, 60 fps.
- *Not started:* R0166, R0167, R0172, R0173, R0177, R0178, R0181–R0183, R0188–R0194, R0197,
  R0202, R0207, R0208, R0210, R0212; the older partials were not touched this round.

## HOT-2 · frame-rate spikes (lane D r7, 2026-10-30)

Found with `game.spikes` (`platform/frame-spikes.ts`: laps per frame section, long frames
keep their breakdown, debug panel line) and `recs-2026-10-27/tools/hot2-spikes.cjs` (7 phases of
scripted play, Pixel/3D × desktop/375×812; `CHECK=1` fails >2% frames over 34 ms or >3 atlas
repacks in a phase). Before and after were measured side by side on the same machine load.

- **Cause 1 (Pixel, the big one):** the sprite atlas repacked and re-uploaded its 64 MB every
  frame once eggs hatched (the sheets on screen filled ~66% of 4096², the repack dropped sheets
  the frame drew again). Fixed in `render/sprites/mega-atlas.ts`: keep last frame's sheets,
  first-fit shelves, a second page only when this frame's sheets overflow or dropped sheets
  return (churn), sampled in the same draw call (u + 2). Pixel phone with 8 Nubbins
  p95 219 → 20 ms, worst 302 → 117 ms, repacks 567 → 0; camera turns p95 187 → 19 ms;
  desktop 8 Nubbins p95 293 → 19 ms.
- **Cause 2 (3D):** shader programs linked mid-play at nightfall (4) and on a time jump with
  hatching (10): rigs compiled hidden, NPC/dress parts added later, fogless impostor cells,
  crack lines. Now linked ahead (`compilePiece`, `prelinkActors` in `grove-3d-scene.ts`):
  0 new programs at nightfall, daybreak or x100. 3D desktop worst frame in the weather phase 239 → 89 ms,
  many Nubbins 182 → 118 ms; p95 ~19 ms before and after.
- **Cause 3:** the hatch card built a whole pixel sheet on the hatch frame; it paints idle now.
- **Not causes:** autosave (0.12 ms, 20 kB with 8 Nubbins); weather changes alone.
- **Left:** a hatch still costs one ~60–120 ms frame (new sheet or rig); the debug "give 30
  fruit" costs ~130 ms (debug only); the second page costs 64 MB when it opens.
- **Tests:** `tests/render/atlas-thrash.test.ts` (the logged sheet sizes: fails on the old
  atlas with 60 repacks in 60 frames), churn and page tests in `mega-atlas.test.ts`,
  `tests/ui/frame-spikes.test.ts`.

## Round 7 · Lane D (2026-10-30, branch r7/d)

Plan: finish the three TECH live bugs, then WORLD from R0085 in order, then TECH R0445 on.
Most remaining WORLD items need the WORLD-20 height field or a second drawn region, so the
round went to TECH after R0122 and R0131.

- **Works:** first-fruit 🍎 emote and chip line (`sim/first-feed.ts`); held-Nubbin ring,
  green for a free place, and a 200 ms ease down (`render/held-ring.ts`, `render3d/held-ring-3d.ts`);
  one-time backup-file card a week in (`platform/backup-offer.ts`); map layer chips and
  completion rings (`sim/map-overlays.ts`); renderer parity test for the outer ring and the
  village; debug panel lazy; shake read from clientX (`input/shake.ts`); haptics with a
  Vibration setting (`platform/haptics.ts`); hatch in the Keeper's arms (`sim/hatch-arms.ts`);
  sound toggle in every Grove; sticky stats-sheet header and grow handle; text size
  (`ui/text-scale.ts`); local bug report and storage line in Settings; keys hint retired per
  device; offline toast; rift re-asks after 3 days (`platform/mature-recheck.ts`); CI workflow
  and deploy checks; content-check exits 1 on problems.
- **Bundle:** `ui/battle-scenes.ts` (lane C, round 6) imported the `content` barrel, which put
  every script in the eager chunk: 5.7 MB gzip. It now imports the two battle files: 812 kB.
  `npm run check:bundle` (`tests/tools/bundle-budget.cjs`, baseline beside it) fails on +10%.
  Never import from `src/content` (the barrel) outside lazy code.
- **Stubbed:** shake meter; "Put down to hatch" in the sheet button; text size reaches only
  rem-sized CSS; SEEN_KEEP pruning and side-save compression (lane C's `save.ts`); greying
  uncached menu entries offline; the Sunny 18+ re-ask; `import/first` lint (plugin not installed).
- **Known bugs:** none new. The eager set is still over TECH-41's 460 kB target (index 351 kB,
  `regions` 190 kB). Load-sensitive timing tests fail in a full run beside the Edge smoke; all
  pass alone (below).
- **Checks:** lint, build, content checks clean. Edge `recs-2026-10-27/tools/r7-d-check.cjs
  <px|3d> <w> <h> [port]`: 0 console errors in Pixel and 3D at 375×812 and 1280×800.
- **Phone probe:** the first two end probes had 3D farOrchard at 161 and 181 calls (budget
  180). A category diff showed the extra 20 draws were the sun shadow pass taking in off-screen
  Grove props at some sun angles; phone `shadowHalf` 22 → 19 u. Two probes after: 0/38 over,
  farOrchard 150 and 150, worst spot 150 calls.
- **Tests:** full `npm test` beside the Edge smoke failed only load-sensitive timing tests
  (lifecycle, world hour, nav, obstacle grid, species, dungeon-r6 bosses, battle balance); each
  file passes alone, and lifecycle+nav take 15.4 s on both main and r7/d.

## Round 6 · Lane E LOOK (2026-10-29, branch r6/e)

- *Works:* the in-training Digimon hop (three a metre, stretch 1.15, squash 0.75; Pixel walk
  frames, 3D `hop` spec field). The child hint fades in from |alignment| 0.2 to 0.5: ice white
  and blue for Sun, dusky violet with a red tip for Moon (two Pixel steps, four 3D blends,
  `render/sprites/child-hint.ts`). Eyes follow the Keeper within 5 m (3D irises; Pixel glance
  frames by screen side). Held Nubbins hug (heart), dangle or flail (swirl) by affection, a
  Moon adult squirms for a Sun Keeper (`render/held-mood.ts`). A gold brow star per rebirth,
  a ring at 4+. Family egg patterns (Chao speckle band, pocket two-tone, digital big spots)
  and a 3D egg that rocks when shaken and cracks at 20 s and 5 s (`render3d/egg-crack.ts`).
  Shadow Nubbins: ember eyes glow 0.4 in 3D, the unbonded hold their head low, a bonded one
  gets a warm rim (Pixel orange rim, 3D aura by trust, `render3d/bond-glow.ts`). Every line
  wears the shop hats (Pikachu, Agumon and Snorlax tested).
- *Stubbed:* the remembrance flower hat (R0424's second half); the egg's top lifting off;
  Pixel glance on the creature drawer (Chao only); a hat dye on creatures; the Shadow's slower
  walk; hats sit at the Chao's size on very big or very small creatures.
- *Works (second half):* personality gags play in place every 40–90 s, children at half rate
  and wobbly (`render/gag-play.ts`, both modes). A dry line for every shop item, critter,
  essence and wearable (`FLAVOUR`, 67 lines). Hazel's field notes on the Grove line's book
  pages. Photo mode: 3 in 20 photos are photobombed, 1 in 10 blinks (Try again or Keep it
  anyway), every photo has a caption (`ui/photo-comedy.ts`). Fifteen curiosities, logged once
  in `world.curiosities` (optional field), seven spotted in play (`ui/curiosities.ts`). A
  wardrobe with an eight-view live preview on each roster row (`ui/wardrobe.ts`). The
  evolution reveal: cocoon shake, white flash (none under reduced motion), landing spin. Four
  rarity tiers with roster frames and Grove glints (`render/rarity.ts`). Birthmarks for about
  one in five Chao, read from the seed, in both modes (`render/birthmark.ts`).
- *Stubbed (second half):* gags that travel (ball push, stream float); field notes for the
  pocket and digital lines; 8 of 15 curiosities have no in-game trigger yet (cup, lantern,
  Fern's stone, robot, stopwatch, scarf, back to back, upside-down egg); 3D rare glint.
- *Known:* the 3D hop ear flop is a head nod (the blobs' ears are sculpted into the head). The
  glance frames drop the idle breath for that moment.
- *Assumptions:* the Sun child's tips go sky blue (not yellow), per the spec; Tokomon keeps its
  stub feet tucked while hopping; the 3D bonded rim is an additive aura behind the body.

- **Works:** R0085 riding (`sim/ride.ts`, `RIDE`): Ride / Get down / Cheer on on the stats sheet
  for an adult with affection 60 and a level-30 stat; pace by type (Run 2.0, 2.6 running);
  twice the walking drain until it asks to get down at 0.2; Lazy sits 2 s every 40 s until
  cheered, Mischievous hops aside on 10% of turns, Shy slows near people, Cheerful bounces; a
  Learning Grove rides anything hatched (a child tows by the hand), free. The carrier walks
  under the Keeper, who sits on its back at 0.8 scale (`render/ride-pose.ts`; Pixel `sit`
  frame, no x-ray through the carrier; 3D `sit` pose, `render3d/ride-scale.ts`). Run adult
  edge to edge ≤ 14 s (test). R0088 swim tow (`sim/swim-tow.ts`): a Swim-30 partner or carrier
  tows the Keeper through the pond's water at ×1.2, paddling ahead; without one the shore
  stops it and a hint says a good swimmer could help (once a minute). R0119 path and deck ×1.15
  (`sim/surface-pace.ts`; grass vs path 14 u differ 13–17%). R0123 the 4 u collider grid
  proved against a full scan on 10,000 points; 1,000 extra obstacles leave queries and a 7-day
  catch-up as cheap. R0124 `regionLeftMs` + `regionAwayMs`: only the Grove steps in catch-up.
  R0129 four Grove gags (`content/world-gags.ts`) on two new signposts, the scarecrow and the
  hive, in turn after a piece's own line. R0359 a four-line festival vignette per season
  (`content/festival-gags.ts`), once per save, recorded by `festivalGagSeen` (never by
  catch-up), not before the first hatch, in a Learning Grove or chapters 9–11. R0107 camera
  holds 0.6 s on a found landmark. R0104 Chunk grid button (`render/debug-chunks.ts`).
  content-check's sentence count now matches whitespace (it matched a literal "s"), which
  caught one three-sentence trace line (fixed).
- **Stubbed:** ride pose checked at 8 yaws in Edge but with the stock `sit` frame (no straddle
  frame); the tow is a placement plus the `swim` clip, not a hand-hold rig. Deep water is the
  pond only (no lagoon until the shore). Gags have no per-gag animation (the scarecrow does not
  turn). Festival vignettes are dialogue-box only, no staging. Not started: R0096–R0098, R0086,
  R0108–R0118, R0120–R0122, R0125–R0128, R0130–R0141 (R0116 is mostly MOVE-44's tap dots,
  lane A's files).
- **Known bugs / assumptions:** `resolve` scans the walker's starting cell only, so a point
  shoved several units out of a hill in one call could miss a collider in the next cell; no
  walker moves that far in a step (test notes it). Riding persists through a reload; the
  ridden Nubbin skips its own behaviour, so it cannot eat while carrying (it asks down at 0.2
  energy). Full-suite runs on this loaded machine fail the timing tests (full life, nav, world
  hour, battle balance); each passes alone, as on main. Phone probe: 0/38 over in the second run;
  the first had 3D farOrchard at 186 calls (budget 180), and two isolated farOrchard runs peaked
  at 161 and 168: the count swings with where the NPCs stand (round 5 saw 176–178).
  After merging main (192f8fa) farOrchard read 185–189 in two probes (main alone 170–178), so the
  four lantern posts' 16 draws now fall to a 4-draw instanced batch when far (`far-lanterns.ts`,
  the far-tree rule); two probes after: 0/38 over, farOrchard 172 and 161.

## Standing approval (Maor, 2026-10-12)

"When you finish, proceed straight through to the next development. I'm approving it. Keep
going until you hit the session limit." So after each milestone passes its done-when
checks, start the next one without waiting. Still plan each one briefly in the session
log before coding, still keep the per-milestone commits and checks.

