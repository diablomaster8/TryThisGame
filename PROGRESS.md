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

## Round 8 · Lane A SOUL (2026-10-30, branch r8/a)

Plan: SOUL items from R0521 on, picking the ones that could be done properly in both
renderers, then round-7 partials. Text in `config/strings-soul-r8.ts`, numbers in
`config/tuning-soul-r8.ts` (one re-export line in `tuning.ts`). New idle acts live in
`sim/soul-idle.ts` and `sim/antics.ts` and run before the weighted pick in `chooseIdle`;
their looks go through `PetBeats` (`render/soul-looks.ts`), so Pixel and Full 3D share one
table. No save bump: every new field is optional. Edge: `node r8a.cjs <pixel|3d>
<desk|phone> 5181` in `recs-2026-10-27/tools`, all pass in the four, no console errors.

**Works**
- HOT-1 (Maor, top priority): clicking a Nubbin now centres it in the part of the screen the
  stats sheet leaves clear, in Pixel and Full 3D, desktop and phone. Cause: the sheet kept the
  camera on the Keeper and pushed it a fixed 17% right or 22% up. Now the camera aims at the
  Nubbin and `render/view-shift.ts` shifts the projection to the clear strip measured from the
  sheet; it glides (capped ease step) and cuts under reduced motion. `tools/hot1.cjs` proves it.
- R0536 favourite and disliked fruit rolled from `n.seed` (`sim/likes.ts`, cached); yum and
  bleh beats, ±happiness only, a disliked fruit is left until starving, a favourite is worth
  a 1.5× walk; the sheet shows ♥/✗ as "?" until seen, a first-taste toast. Plain is never
  disliked, so hand-feeding never gets a face.
- R0537 favourite toy ×3, boredom, ten-minute novelty (`sim/toy-soul.ts`); 120 min with two
  toys gives play 17–23% for every personality, the favourite 86–93% of it.
- R0532 Grumpy harrumphs with its back to the Keeper (puff emote), greets ×0.6, turns down
  30% of high fives; Sleepy yawns, nods off standing, naps ×1.6; 30 min above +40 clears it
  with a toast; a sheet chip says what softens it.
- R0535 `world.phase` from the curfew's wall clock (same hours as `daylight.ts`, a test
  checks every quarter hour); dawn stretch, dusk fireflies (≥10% of choices at 19:30, none
  at noon), night stargazing.
- R0534 rain by personality: stomps and raindrop-catching near the Keeper, shelter by the
  tree nearest the Keeper, never more than half at once; sheltering huddles (sit, shiver)
  instead of the sleep pose.
- R0542 Sun adults comfort crying or sad Nubbins (19/20 seeds within 60 s), Moon ones say boo
  from behind; children with a strong hint at half, ×1.5 in their own Grove.
- R0544 trips, sneezes by flowers (×2 in spring), hiccups after two fruits in a minute, a
  child's tail chase; hashed per second, so seeded days are unchanged; ≥15 antics of ≥3 kinds
  in 30 min with six Nubbins. R0552 synth sounds for them and the soul moments.
- R0551 pet and landing beats by personality (bounce, blush, wiggle, melt; wheee, teary,
  tongue, flop). R0549 emote balls 1.5× at the far zoom or with Big mood bubbles (default on
  in the Learning Grove), a reaction pops 2× for 300 ms; 27 CSS px on a 375×812 phone.
- R0575 none of the new acts start during catch-up. R0593 Settings → Liveliness (calm,
  normal, lively; sprouts default lively) scales antics, phase quirks and pranks.
- R0563 a diary of the last five things and a "Recently" box on the sheet. R0579 roster
  personality chips (a child's leaning faded) and a filter row with 44 px chips.
- R0539 (r7 partial) a buddy away is missed (`n.missing`) and gets a reunion hug and a
  toast when it comes back.

**Stubbed / not done**
- R0542: no fruit sharing, tidying or hoarding yet. R0544: no clumsy/sneezy trait multipliers
  (traits, R0528, not started), no fall-asleep-standing. R0552: no snore loop or chat voices.
- R0551: picked-up variants are not done (the held moods from LOOK-50 still apply).
- R0549: the selected Nubbin is not drawn bigger (the renderers do not know the selection).
- R0535: the renderer still computes its own phase (from the same hours; a test pins them).
- Not started: R0525, R0528, R0529, R0533, R0538, R0540, R0541, R0543, R0545–R0548, R0550,
  R0554–R0562, R0564–R0574, R0576, R0577, R0580–R0592; FUN R0345, R0356, R0361, R0364,
  R0366, R0367; round-7 partials R0344, R0346, R0527 (cottage hiding), R0553.

**Known bugs / notes**
- Full 3D on a 375×812 phone (headless Edge) stalls about 0.7 s on the first stats-sheet open;
  the camera glide now rides it out, but the stall itself is a perf follow-up (lane D).
- Assumption: R0537's boredom fades 9 a minute, not the recommended 0.2 (which pins every
  toy at the floor after a minute of play and drops play to 6–11%).
- Tests moved on purpose: `features.test.ts` rain now accepts the rain games;
  `clip-for.test.ts` shelter is a sit. Timing tests flake under the four-lane load and pass
  alone; budgets untouched (the 8-Nubbin hour and full life measured equal to ce12521b).
- Full 3D in headless Edge was often still on "Shaping the Grove" when shots were taken, so
  the 3D looks were checked by the sim and the pose tests, not by eye.

## Round 7 · Lane E LOOK + KIDS (2026-10-30, branch r7/e)

Plan: the three KIDS live bugs, then the cheap unstarted LOOK items, then KIDS from R0674 in
order where a proper job fitted. Shared files got self-contained blocks only; no save version
bump (new fields are optional: `Nubbin.hideBelt`, `EduState.alwaysReborn`, `roundsPerGame`).

- *Works (KIDS):* in a Learning Grove ⚙ opens a kid-safe sound sheet (on/off, one big volume
  slider) with no gate; its "Grown-up settings" asks the sum gate first, and Reset save asks the
  gate before the confirm (`ui/kid-sheet.ts`, pure `routeSettingsTap`/`resetAllowed`). Settings
  no longer copies the age/band/read-aloud switches; it links to the grown-up area. The break
  card tucks in the child's own Nubbin asleep (never Sable), leads three spoken stretches and a
  drink, and "All done for now" says goodnight and stays locked. A moon fills in the corner two
  minutes before the break with one spoken warning, and a round, scene or tracing still open may
  finish first (3 min grace, `eduBreakShouldStart`). Sprout chapter goals carry `goalIcon` and
  `goalSay`; the What's next card shows and says them, and its "Show me" (and 20 s of no
  progress) points a bouncing hand at the egg, Nubbin, tree or fruit and pulses Pick up, Shake,
  Put down, Pet or Feed on the sheet (`ui/guide.ts`; a test follows only the hand from a fresh
  age-4 world and hatches and pets within 90 s). The minigames read aloud for sprouts (prompt,
  reply, score; emoji said as words), 🔊 replays for any band, holding an option says it and
  counts icons. Story choices and lesson options in the sprout band are numbered picture rows,
  72 px, read out as a set, said on a hold (`icon?` on `Choice`/`LessonOption`; chapter 1 has
  icons, content-check counts the rest as `sproutNoIcon`). The picker speaks, shows stars per
  game, bounces the tile while saying its name, fills a tablet in three columns. Sprout rounds:
  rhymes and first sounds keyed by sound (`firstSound`, whale rhymes with snail), the sum cue is
  two groups and a ➕, "There is 1", no repeat target in a session (`roundKey`, `avoid`).
  Results card: the Nubbin cheering, stars popping with chimes, "+35 🐚", two 96 px picture
  buttons, spoken praise; no reward toasts over a round, and a sprout's notices wait until the
  activity closes (festivals dropped in edu, `ui/kid-notice.ts`). Misses keep their colour with
  a 💭 and a wobble, the answer pulses after two; sprouts leave a game by holding 🏡. The sprout
  HUD hides Run, Keeper, Shop, the Grove switch and the camera buttons and grows to 72/80 px
  (`body.edu-sprout`). Sprout Nubbins are always reborn (reader: grown-up toggle). The age
  picker has four 🌱 tiles and a wide Reader tile, its own subtitle, and speaks the question;
  chapter cards are spoken and the chip hides under them; rounds per game by age (3/5/5/6,
  reader 8) or a grown-up's pick.
- *Works (LOOK):* Dojo Ladder belts worn round the middle in both renderers, white to black,
  with a Wardrobe switch (`render/belt.ts`). One hat per real season (sprout cap, sun visor,
  leaf crown, woolly hat) leads the shop in its season and is kept for good. A species listed
  in `public/sprites/manifest.json` uses a hand-drawn sheet in Pixel, missing frames filled from
  the nearest (`render/sprites/sprite-source.ts`, `docs/sprite-sheets.md`; proved in Edge with
  a routed sheet).
- *Stubbed:* the race headband (R0437); the seasonal free gift (R0438); glTF for 3D (R0439);
  recorded animal and phoneme clips (R0675, not started); sprout icons for the other 7,220
  choices and options; the reader age select stays hidden instead of offering 7–10; the
  "Nubbins yawn" in the Grove before a break.
- *Bugs / notes:* the smoke driver is `recs-2026-10-27/tools/lane-e-r7.cjs <pixel|3d> [phone]
  [grove [sheet]]` on port 5193 (5185 is held by an old r2 server); 0 console errors in Pixel
  and Full 3D, desktop and 375×812, Learning Grove and Grove. Timing tests (full life, nav,
  world hour, battle budget) failed under the parallel lanes' load and passed alone.
- *Merge:* origin/main ce12521b (lane C r7, save v13; lane A r7) merged in. Reset save keeps the
  grown-up gate and now confirms with lane C's `confirmModal`; the three optional fields
  round-trip through v13 (test in `tests/sim/lifecycle-edu.test.ts`).

## Round 7 · Lane C CAMP + FIGHT (2026-10-30, branch r7/c)

Plan: the campaign engine first (R0594–R0596 as one story book), then the CAMP items that
build on it, then the FIGHT partials. **Save v13** (`lines: {}`); a v12 save from main loads
unchanged (`tests/sim/story-book.test.ts`).

- **Works:** `world.lines` (new `sim/story-book.ts`): in Hazel's Grove (chapter 3 on) the four
  separate campaigns run *beside* the spine, two at a time, each with its own chapter, flags,
  counters (from zero at its start), stats and cast. Their scenes go through `campaign.queue`,
  which the dialogue box, stage and renderers already play; a line only queues onto an empty
  spine queue after the side-story gap, ahead of the side runner but never ahead of Hazel's
  opening or met goal (R0597, R0631). `sceneDone` routes a line's scene to the line's flags.
  Line chapter toasts name the line; a line ends on its own (`lineEnded`, its own end card),
  then the Grove's recolour and partner slots are put back (R0600, R0601). Line Nubbins count
  toward `STORY_BOOK.lineCastMax` (4), not the roster (R0594); Dawn & Dusk beside Hazel brings
  its own Nubbin and reverts only it; Logged In beside Hazel never touches `unlocks`. Lines
  hold in Hazel's chapters 9–11 and the vigil (R0612). Journal "Other roads": Begin (or why
  not), goal, Do-it, areas, actions, Leave and Restart (R0643), plus the story bout waiting at
  its beat (R0275). `spine:<flag>` check term and a content-check rule that a line's checks
  name only its own flags (R0595, `tests/tools/line-flags.ts`). In-game confirm card
  (`ui/confirm.ts`) replaces every `confirm()` (title, settings, debug) (R0647). Debug panel
  "Lines" row (R0644). BroadcastChannel slot claim: a newer tab on the same slot takes it and
  the older one holds its saves; other slots are unaffected (R0658). `storage.persist()`, a
  one-time iPhone Home Screen card and a fortnightly post-ending backup chip (R0624).
- **Stubbed:** no regions yet (R0605): line Nubbins and scenes live in the Grove and the
  storyline renderer dressings (servers, the Fold) only show in separate-campaign saves.
  Legacy separate-campaign saves stay their own mode (R0598 stage A/B not done). No offers,
  boards or pace settings (R0602–R0604, R0606–R0611, R0613–R0623). Bring-home choice at a
  line's end, the Valley Fair epilogue and per-line rewards not built.
- **Bugs / notes:** `world.test.ts` "survives 8 Nubbins for an hour" takes ~5 s on origin/main
  too (checked in a clean worktree at 76eb8b1), so not this branch. Line goals that read world
  state (`recruits`, `team:joined`) may be met already in a long Hazel save. Drivers:
  `recs-2026-10-27/tools/lane-c-r7.cjs <px|3d> <desk|phone>`, `lane-c-r7-tabs.cjs`,
  `lane-c-r7-ios.cjs`. Hand-over: side-session note `r7-lane-c-handover.md`.

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

