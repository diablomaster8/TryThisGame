# PROGRESS archive

Older session-log sections, moved out of PROGRESS.md on 2026-10-15 so a fresh session does not load 30k tokens of history. Newest first. Search this file; do not read it whole.

## Round 5 · Lane C FIGHT (2026-10-29, branch r5/c)

- *Plan:* finish R0248 (job on the stats sheet), R0250 (AI combos, pile-on flash), R0253
  (draw count) and R0254 (Full 3D board, new `render3d/tactics-3d.ts`, instanced tiles,
  disposed on exit); then R0258–R0283 in order, skipping R0256, R0257's Hollow hand-off, R0260,
  R0269, R0271, R0275, R0276, R0281, R0282 (other lanes). Sim items go to helpers with their
  own files; shared files get self-contained blocks only. No save bump.
- *Works:* Full 3D tactics board (`render3d/tactics-3d.ts` on a `MiniStage`: instanced tiles per
  kind, one overlay set, pool rigs through the Grove's `CreatureLod`; 56 draws, 216k tris at
  375×812; memory flat over 10 bouts), job on the stats sheet, AI "Together!" combos, pile-on
  jostle, 8 grid-only charged moves (line4, scatter3, landing; Keeper+ AI steps out), the
  Keeper's untargetable piece (Snack toss, Cheer, Whistle; in the rumble room). Turn mode:
  shared move content lint and `tests/tools/battle-table.ts`, bout points by move used, one-time
  rewards (`world.battleOnce`, `battleSpoils`), seeded quips (en/he/ja), real rival species,
  doubles, timing flag (sweet/plain/steady), balance harness, Command mode (ATB, obedience,
  gags, hidden-tab pause), pre-bout sheet (party, mode, Gentle/Normal/Spicy), Settings → Bouts
  with Skip (`autoResolve`), inspect card and seen matchups, aria-live log, Steady hands,
  keyboard play, Debug → Battle (replay paste).
- *Stubbed:* Pixel board still 1 + units `drawImage` a frame (R0253 wants ≤3 WebGL draws);
  champion-pack prefixes and rumble chest; doubles stage draws one combatant a side; bout lean
  not read by `decidePersonality` (lane A); move cards not in the Collection book (lane E).
- *Known bugs / assumptions:* a Command-mode replay stamps orders at send time but they apply on
  the next step, so exactness isn't guaranteed (turn bouts are exact). The 60-point cap is per
  stat per bout. First-win hats reuse shop hats. Snack toss uses 3 packed snacks, not the
  inventory. Balance: Champion runs 30 bouts (2,000 doesn't fit 3 s); Sprout's median is ~32
  turns, so it isn't asserted. Stalemate guard skips encounters (Hollow replays unchanged).
  `battle-screen.ts` is ~1,075 lines (split next). No axe-core installed, so no axe run.
  Lane B hand-over: side-session note `r5-lane-c-handover.md`.

## Round 4 · Lane C FIGHT tactics (2026-10-29, branch r4/c)

- *Plan:* a pure, seeded grid-tactics core in `src/sim/battle/tactics/` beside the turn mode,
  which stays untouched (R0243 map, R0244 field map, R0245 path, R0246 CT, R0247 facing,
  R0248 jobs, R0249 terrain, R0250 range and combos, R0251 objectives, R0252 AI), then the
  R0257 slice as `world.tactics` behind a debug-panel button, then a Pixel view and phone bar
  (R0253, R0255) in new files. R0254, R0256, R0219, R0239 later.
- *Works:* `sim/battle/tactics/` (pure, seeded, JSON state, map as base64): Hollow-room and
  open-field maps (cottage, trees, lanterns blocked; `config/battle-maps.ts` overrides), Move
  and Jump from Run/Fly, deep water for swimmers, CT turns with Move (before or after the Act,
  undoable until it), Act, Wait and facing, charged moves, facing/height factors shared by
  preview and hit, 7 jobs plus Sunny/Moony layers and the Keeper aura, 8 terrains, arcs and
  line shots, 11 "Together!" combos at friendship 60, 8 objectives, Sprout/Keeper/Champion AI
  (0.4 ms a decision, Champion 40/40 over Sprout). The rumble room (R0257): debug panel →
  "Rumble room (3v3 tactics)", a 10×10 Hollow crop, calm the Old Shadow, Shells and a crystal;
  kept in `world.tactics` (optional, no save bump) and reopened after a reload. Pixel iso
  board (`minigames/tactics/pixel-view.ts`, also over Full 3D) and the one-thumb bar
  (`ui/tactics-bar.ts`, `ui/tactics-screen.ts`, `tactics.css`). The turn-mode API is unchanged
  (`moveDamage` now calls `damageWith`, same dice order).
- *Stubbed:* no move animations (the log line and a hurt flash only); the AI never calls a
  combo; Copycat and Doodle Decoy act as plain moves on the grid (Decoy is greyed out); fused
  partners are not one 2-tile unit; lane B's rumble-room flag (see the hand-over note).
- *Known bugs / assumptions:* the AI's 8 ms cap is an evaluation count (2500), not a clock, so
  replays stay exact. The board is Canvas 2D: 1 blit for the map plus 1 per unit (13 for 12
  units), not the ≤3 WebGL draws of R0253; it holds 60 fps at a 4× throttle. Water touching
  dry ground is shallow, the rest deep; combos need the pair side by side (diagonals count).
## Round 4 · Lane A (MOVE + FUN, 2026-10-29, branch r4/a)

Plan: the Hollow roll bug first, then R0057, R0063, R0066, then FUN R0290–R0305 in order
(R0293, R0298 to lane E). Per-item status in `recs-2026-10-27/STATUS.md`. Edge driver:
`EXTRA=./r4a-extra.cjs node laneA.cjs <pixel|3d> <desk|phone> 5181`; all four pass.

- *Works:* no roll underground, so a chasm lip faced toward the camera jumps; spring mushroom
  (bounce 2.2×, squash, boing, Nubbins play on it) and hay bale in the decor shop (R0057);
  hop course: 12 flags, timer chip, ghost, Hop Hat once, best time in a per-slot side save
  `<slot key>.hop` (R0063); Q1 asks for a placed flower bed (R0291); hint-verb check in
  content-check and 25 hints rewritten (R0292); Keeper barks in a bubble (R0295,
  `content/barks.ts`); a throw splats on trunks and walls (R0299); fruit on heads (R0300);
  comic sounds plus a debug row (R0301); typewriter beats and voice blips, with a setting
  (R0302); `beat`, `sfx`, `shake`, `gag` on script lines (R0303); goal-done chip per chapter (R0305).
- *Stubbed:* R0066 navmesh (deferred, field still 96 u); R0294 micro-games, R0296 routines,
  R0297 chatter, R0304 gate beat (not started); R0292's Do-it-honest pass over the other
  unmet-verb hints; R0299 walking bonks; R0303 stage-actor reactions and the spark particle;
  R0305's comic micro-moment (waits on R0293); barks have no separate edu lists (all lines are `all`).
- *Known bugs:* none found. Under a loaded machine the full-life and 8-Nubbin timing tests
  failed once in the full suite; alone they take 2.1 s and 1.8 s (main: 1.8–1.9 s).
- *Assumptions:* the course opens once the hop lesson is done (no new saved field); the Hop
  Hat is a `prize` entry in `config/cosmetics.ts`; the hat is the run's only Grove write;
  fruit can land on heads from any drop, shaken or not; the mushroom's Nubbin bounce is
  drawn only (the sim keeps `y` at 0).
## Round 3 · Lane E LOOK (2026-10-28, branch r3/e)

- *Works:* a cosmetics registry (`config/cosmetics.ts`): 24 wearables over hat, neck, back
  and body slots, each drawn in both modes from data (`render/sprites/cosmetic-pixel.ts`,
  `render3d/dress.ts` `registryItem`); the shop sells a hat of the day. Hatchlings wear their
  eggshell for 10 live minutes and keep it in the hat box. Quills (Sun Keeper) and Shade (Moon
  Keeper) are tier-3 race prizes with 3D accessories. First evolutions carry type tells in both
  modes (Pixel sorts by outline: `first-tells.test.ts`). A pixel cry clip. Nine more egg colours,
  three jewels, and metal and glass finishes in Pixel.
- *Stubbed:* the cry clip is not shown yet: `world-view.ts` and `actors.ts` still map `cry`
  to `sad` (lane A), and there are no 3D tears. One worn cosmetic at a time (`n.hat`); the
  per-slot `wear` field needs lane B's save. No 3D egg finish (`creature-pool.ts`, lane D).
  Normal's fuller crown and Run's lean are Pixel only. Pixel serpents still 1.0–1.6× long.
- *Known:* Pixel metal is subtle at 32 px. New egg colours show raw ids in the Roster
  (`EGG_COLOR_LABELS` lives in `strings.ts`).
- *Assumptions:* keeping the eggshell is automatic (into the hat box on hatch; it leaves the
  head after 10 min). Grove line only. The registry's "show what you get" shop option was
  taken over per-id SKUs (no `ShopItem` change).

## Round 3 · Lane B DUNG (2026-10-28, branch r3/b)

*Plan:* R0031 (Hollow platforming, generator version 4), then the sim-side items that fit one
pass: R0162, R0158, R0155, R0159, R0161. R0147 (outdoor zones, XL) and R0152 (act towns, L)
stay deferred to a pass of their own: both need new maps in both renderers. *Assumptions:*
gap rules count run depth, not the level inside an act; a saved version-3 run keeps its flat
floor and its packs (`floorOf`/`actFloor` take the run's `genVersion`); difficulty is Cosy
until DUNG-36; Act IV's ice also appears in endless depths 16–20.

- *Works:* version-4 floors (`sim/dungeon-gaps.ts`): chasm cuts and deep water, a walking
  bypass on floors 1–2, 3–5 jump-only nooks with a find from floor 3, stepping stones with
  water gaps; a Keeper standing in a gap or deep water pops back to dry ground, party Nubbins
  hop over (`dungeon-falls.ts`); 3D pit with a blue glow, Pixel and automap chasm cells.
  Strays drop a Shell trail, snatch twice a floor, can be shooed, show on the automap
  (`dungeon-strays.ts`). Packs by density with treasure guards and an 80/15/5 mix; ten cosy
  champion modifiers as data (`config/dungeon-foes.ts`, `dungeon-density.ts`); 3D plates and
  a bout-panel plate. Shrines with timed buffs, a buff ring and 3D stones
  (`dungeon-shrines.ts`, `ui/dungeon-buffs.ts`). Traps on raised tiles in both renderers,
  re-arming, none in the Learning Grove, scouts (`dungeon-traps.ts`).
- *Stubbed:* terrace ledges are still ramps (Keeper ground underground is 0 in `keeper.ts`,
  lane A). Bouncy and sticky speed need lane A to multiply by `hollowSpeed(world)`. Snuggly
  power and the modifiers' effects wait for lane C. Pixel draws no packs, plates, strays'
  trail or shrine stones (`world-view.ts`, lane A). No uniques (R0156), so 0 per level; Lucky
  Clover waits for loot tables (R0163); Gem shrine waits for charms.
- *Known bugs:* none open. The pack-placement sweep now has its own 30 s timeout (a vitest
  timeout, not a game budget) because the new generator sweeps run beside it.

## Round 3 · Lane C (2026-10-28, branch r3/c)

- *Works:* dojo, story (Logged In) and Circuit bouts are singles with a bench: Swap at
  priority +3 (the incoming one takes the queued hit), a pick after a tuck-in, all tuckered is
  a snack-break loss; the last party is kept in `world.battlePrefs`. Items from the inventory
  (fruit, toys; flavoured fruit from the new optional `inventory.pocketFruit`), paid only on a
  result. Wild foes have Calm and come home as children (or fill the scan and leave Shells);
  Shadow strays take no HP. The ten Keepers' Circuit: fixed teams per save, field rules,
  ribbons, hats, skill points, Champion rematches. Sprout/Keeper/Champion AI plus personality.
  Gentle bouts (Learning Grove or the dojo switch) never lose. One full-screen battle screen
  with playback, phone layout, party sheet and Power swing. Arena colliders (MOVE-62) and the
  reserved grid data (MOVE-61, `docs/tactics-grid.md`).
- *Stubbed:* the Circuit's 10 pre/post scenes and the chapter 5 goal alternative; the
  Learning Grove "Play-fight Day" scenes; he/ja bout lines; nothing fills `pocketFruit` yet;
  the Gentle switch lives in the dojo menu, not Settings; old `party` bouts stay all-at-once
  (no screen opens them now); encounters are singles only when the caller asks.
- *Known:* Champion beats Keeper 70.6% in the 500-bout mirror test, just over the 70% bar;
  the battle screen draws pixel sheets in Full 3D (R0219); the full-life and 8-Nubbin timing
  tests fail in a loaded full run and pass alone (1.6 s, 1.4 s).

## Round 3 · Lane A (MOVE, 2026-10-28, branch r3/a)

Per-item status in `recs-2026-10-27/STATUS.md`. Edge driver: `EXTRA=./r3a-extra.cjs node
laneA.cjs <pixel|3d> <desk|phone> 5181`; all four configurations pass, no console errors.

- *Works:* mantle onto a lip a jump just misses (R0050); jump button hold ring, air-jump pip,
  glide feather, greyed Shake (R0051); 3D orbit tilts or pulls in when a hill blocks the
  Keeper (R0052, `render3d/hill-clear.ts`, one call in the scene); Camera follows walking
  setting (R0053); co-op Keeper 2 on Keeper 1's motion (jump on Enter, Numpad 0, pad A; the
  two keep apart; R0054, R0022's leftover); Look around on rock tops and the well, one-time
  finds (R0055); walking to the flat stone meets S24's step (R0056); one-time hop lesson chip
  and a Moss line (R0058); care walks stop with the Nubbin in view (R0059); roll (R0064); Swim
  perk pond dip with one-time shells (R0065); Left-handed setting (R0014); 3D glide wings (R0027).
- *Stubbed:* R0057 (needs `DecorKind` entries in `strings.ts`, lane E's sprites and lane D's
  `garden.ts`); R0060 and R0067 (Hollow files, lane B); R0063 hop course; R0066 navmesh;
  3D roll dust and dip bubbles (they need the scene's burst system, lane D); the waterfall
  shelf stone has no story prop yet, so only the flat stone has a reach.
- *Known bugs:* at the 24° pitch hills block the orbit rarely (12 of 1,024 sweep cases, one
  5° step each), so R0052 seldom shows. In the Edge run, a Nubbin standing beside the Keeper
  once pushed it off the well rim before the chip came up.
- *Assumptions:* the mantle keeps the old reach (`JUMP.stepUp`, 0.35 u) and only makes the
  climb visible; the big rocks are now standable (needed for R0055's "big rock at (-7, 9)");
  the well counts as a lookout from its rim rather than as a standable top (standing on it
  would put the Keeper over the hole); vistas give their find on the look (no walk-to marker);
  Pixel's pitch is fixed, so Look around only zooms out; `world.viewYaw` is a UI hint the sim
  uses for care-walk stops and the pulled-down roll, never for rules.

## Round 3 · Lane D (2026-10-28, branch r3/d)

Plan: phone 3D perf first (break the draws down per category, merge the wild props, creature
LOD R0079, finish R0078/R0081), then WORLD in R order from R0074 (deferring lane A's files).

- *Works:* creature LOD (R0079): past 8 u a rig is one skinned stand-in on the 48 grid
  (`render3d/lod-proxy.ts`), past 20 u a cell in a 4 MB atlas drawn as one instanced quad
  (`impostor-creature.ts`, 2 cells redrawn a frame); hulls stop at 14 u, sun shadows at 20 u.
  Kit trees are 3 draws, not 9. Phone probe 6/19 → 16/19 under budget, median 314 → 161 calls,
  414k → 336k tris; 8 Nubbins at the heart: creatures 38 draws, 245k tris. Spare rigs capped by
  tier, trimmed when hidden, parts behind a stand-in free their buffers (geo 466 → 271). Fast
  travel with iris, carry and partners (R0074); Grove collectibles (R0091); per-region hour
  (R0092) and seeded per-region weather (R0094). `PROBE_BREAKDOWN=1 PROBE_SPOTS=…` on the probe.
- *Stubbed:* postcard unlocks and the old key's secret (R0091); region hours and weather only
  show once a second region is drawn; R0093 signposts (need lane A's pixel files).
- *Known:* far creatures animate at 7.5 fps; at westHill, farOrchard and cornerSE the draws
  sit at 186–228, spread over many small scenery kits. Assumption: the iris centres on the
  view's middle (the camera keeps the Keeper there), not on the Keeper's exact pixel.

## Round 2 · Lanes A–E (2026-10-28, merged on r2/d, one push)

The 2026-10-27 recommendations, round 2, five lanes at once. Full write-ups are in
`docs/progress-archive.md`; per-item status in `recs-2026-10-27/STATUS.md`.

- **A MOVE.** *Works:* Nubbin hops onto tops by stat and personality, thrown Nubbins land on
  tops, NPC routing round solids, 3D wild props, slope slowdown, auto-run, path dots, surface
  footfalls, race hurdles, partner slots. *Stubbed:* Pixel ramp lean, 3D flap on hops, pad
  glyphs. *Known:* a nav/ledge pocket near (28, -33); hops cost the full-life test about 6%.
- **B DUNG.** *Works:* Hollow packs fight on the battle core; save v9 (act seeds with a daily
  reroll, waypoints, the Homing Acorn, remembered levels); solid landmark; fog and automap.
  *Stubbed:* outdoor zones and towns; Pixel waypoint stones, fog and packs (need
  `world-view.ts`). *Known:* a fresh pair loses to three or more foes (pack size capped).
- **C FIGHT.** *Works:* derived battle stats, one damage formula, grade traits, the type loop,
  Puff, statuses and moods, 62 moves as data, four slots per Nubbin, choose-then-resolve turns.
  *Stubbed:* battle items, the 3D dojo view (R0219). *Known:* old turn bouts close as draws; on
  a phone the last move row sits under Leave until scrolled.
- **D WORLD.** *Works:* 3D terrain drawn by view chunk; creature shadows and hulls culled by
  view and geometry level; grass by device tier; memory readout and debug World row; portrait
  walking lead; jump metrics checked against the real jump; the Wood laid out as data; twelve
  world traces. Phone 3D probe: 6/19 spots under budget (5 before). *Stubbed:* creature LOD
  (R0079) is what the other spots need; the Wood and the traces are not drawn. *Known:* a double
  jump can't climb two terrace levels.
- **E LOOK.** *Works:* the legs-out sit, more vivid 3D colours, serpents and 27 four-legged
  species in both modes, Greymon kit extras, signature parts sized for the game camera, arm
  rest, toon ramp without the black collar. *Stubbed:* `quad.tailSet`, band-tinted bubbles.
  *Known:* pixel serpents reach only 1.0–1.6× long.
- **All lanes.** Under load the full-life, sculpt and nav timing tests can fail in a full run;
  each passes alone. No budget was loosened.

## Round 2 · Lane D (2026-10-28, branch r2/d)

Phone 3D perf first, then WORLD. Measured first: on a phone the scenery is about 150 draws
and 25k triangles; the terrain (one 100k mesh), creature shadows, outline hulls and the
creatures themselves are the rest. Probe (375×812, phone sculpt grid, Full 3D, mean of fresh
frames, `?nolod` for before): 5/19 spots under budget before, 6/19 after; median 336 → 230
calls, 855k → 380k triangles; worst 699 calls / 1.65 M → 558 / 920k. Pixel: ≤ 186 sprites.

- *Works:* terrain drawn by view chunk (`render3d/chunks.ts`); creatures off screen stop
  casting, small ones lose hulls and real shadows at geometry levels 2–3 (`render3d/lod.ts`);
  device tier from the sculpt grid caps grass (2.9k instances on a phone); `WORLD_MEM` and a
  memory readout; debug World row (teleport to POI, pin LOD, freeze streaming); portrait
  walking lead (R0084); jump metrics checked against the real jump (R0087); the Wood laid out
  as data with four jump routes (R0089); twelve world traces with a content check (R0090).
- *Stubbed:* creature LOD (R0079, lane A/E files) is what the remaining 12 spots need, since
  each rig is about 22 draws and 49k triangles; tree and building impostors (R0078) are not
  built, as they would save under 5% today; the Wood is not drawn; trace props are not
  tappable yet; no chunk-grid overlay; `WORLD_MEM` reads but releases nothing (one 3D region).
- *Known:* the probe's numbers swing ±30 draws with where the Nubbins wander. A double jump
  (1.70 u) can't climb two terrace levels and the glide carries 2.6 u per unit dropped, not
  8 u per level (lane A's numbers). Round 1's probe measured the opening scene's camera at every
  spot (fixed: it now clears dialogue and checks the aim).
- *Assumptions:* the probe builds creatures on the phone grid (`?sculptRes=64`, dev only);
  `?nolod` (dev only) gives the before numbers from the same build.

## Round 2 · Lane E (LOOK, 2026-10-28, branch r2/e)

- *Works:* R0370 live `sit` is the legs-out sit in both modes, and a low or hungry sitter stays
  sad. R0378 3D art colours are more vivid (art-colour.test.ts). R0374 serpents: a disc chain in
  pixel that slithers a disc per walk frame, and a 3D spine of `seg` parts with a yaw wave (3D
  2.6x long). R0375: 27 four-legged species on plan `quad` with stances in both modes.
  R0377 Greymon line: skull helmet, dino snout and ribs kit extras. R0379 3D signature parts
  sized for the game camera. R0383 `armRest` hangs the Nubbin's 3D arms by the belly. R0386
  yellow ball, halo ring, red-tipped Moon spikes. R0387 the toon ramp's black band is now a
  deep shade (0.28), so no neck collar.
- *Stubbed:* `quad.tailSet` is read by neither renderer; the kit file is not renamed. Band-tinted
  heart/swirl bubbles, the `&silhouette` overlay, Greymon's lean and single metal arm.
- *Known:* pixel serpents reach only 1.0–1.6x long (a raised head in a 32 px frame); Lapras's
  shell reads as a dish in pixel; quad foot slide not measured. The two timing tests fail when
  five lanes load the machine and pass alone.
  R0387 lifts every toon creature's shadow side a little (for Maor to eyeball).

## Round 2 · Lane A (MOVE, 2026-10-28, branch r2/a)

Items R0030 and R0036–R0049 (R0031/R0032 are lane B's). Per-item status is in `recs-2026-10-27/STATUS.md`.

- *Works:* Nubbins hop from Run and Fly onto rock and bench tops and over logs. Cheerful ones
  hop for joy, Mischievous ones climb, Lazy ones walk round, and Shy ones hop back from a
  landing Keeper and sit in bushes. A thrown Nubbin can land on a top (the R0033 leftover).
  NPC wandering and staged walk-ons route round solids. Full 3D draws the wild trees, bushes,
  logs and rocks. Hill slopes slow the climb to about 0.8× and lean the 3D Keeper forward.
  Running jumps carry further. Auto-run runs long tap walks (on at a phone's first launch),
  and the phone Run toggle turns itself off after 3 s still. Bushes rustle in both modes and
  hide a one-time shell. Tap walks show path dots and a target marker at the right height.
  Footfalls follow the surface (deck tok, stone tap, grass tuft). Races have a hurdles section
  with cheer timing. Partners follow from slots behind the Keeper. With co-op off, a gamepad
  drives Keeper 1.
- *Stubbed:* the Pixel lean frame on ramps, wider 3D arm swing when running, a Fly adult's
  flap animation on a hop, 3D leaf bursts and 3D prints, pad glyph prompts, the Hollow half of
  R0048 (lane B's files), and NPCs pausing for the Keeper (they already stop within 2.5 u).
- *Known:* the slope numbers are 2.0/0.6, not the rec's 0.35/0.1, because the ramps are
  gentle. They apply to stick and keyboard walks only. A slower tap climb reached a pocket near
  (28, -33) where the nav grid and the ledges disagree, and the Keeper dithered there; that
  pocket is still open. Stand-in walks now recheck their real tap each second and stop rather
  than dither. Hopper Nubbins still pass under tops they can't reach (the R0029 rule). The race
  menu lists only tier-1 sections. Hops cost the full-life test about 6%.
- *Assumptions:* a child's hop uses ×0.6; a joy hop's timing comes from the Nubbin's seed,
  not the rng, so no other random draw moves. A bush's find is one shell (there is no ladybird
  critter).

## Round 2 · Lane B (DUNG, 2026-10-28, branch r2/b)

- *Works:* Hollow packs fight on lane C's battle core (`battleHandler`, a `battleEnd` hook in
  `applyCommand`, the self-opening `ui/dungeon-bout.ts`; at most the party's size of a pack joins).
  Save v9: act seeds with a daily "New paths" reroll (R0149), waypoint stones with a travel panel
  (R0148), the Homing Acorn portal home and back with one free acorn a run (R0150), remembered
  levels and stairs up that climb inside an act (R0151). The landmark is solid to bodies and nav
  (R0032). Fog of war in both renderers and the Tab/🗺 automap overlay (R0153, R0154).
- *Stubbed:* outdoor zones (R0147) and towns (R0152) not started; Pixel doesn't draw the waypoint
  stone, fog the sprites, or draw packs (all need `render/world-view.ts` `drawCave`, lane A); no
  Grove-side portal sprite; acorns are bought at the cave mouth, not the shop screen; cart and arch
  posts still walk-through (their placement lives in `render3d/hollow-dress-set.ts`).
- *Assumptions:* waypoints on act level 1 and every 2nd level, never the boss level; ids are
  `<act>.<level>`; the acorn always lands in the Grove; a forfeit or draw flees a pack and loses to
  a boss; crystals stay soft (solid ones walled walkers out of one-cell nooks).
- *Known:* a fresh pair loses to three or more foes every time (hence the cap; balance is lane C's);
  a chasing pack can slip out of 3D sight for a moment (aggro 5 cells, sight 4). Where the
  landmark nearly meets rock its padded nav cells shut a squeezable gap: about 1 in 11 taps from
  its rim stops short (`tests/sim/dungeon-props.test.ts`). Hollow bout foes are capped at a dojo
  rival's level for the party (`HOLLOW.packs.boutLevelOver`).

## Round 2 · Lane C (FIGHT, branch r2/c, 2026-10-28)

R0222–R0230 on the battle core. *Works:* derived stats (HP/Bonk/Splash/Guard/Zip/Flutter/
Puff, child ×0.85, Eternal ×1.1) for every mode; one bounded damage formula; A/S grade
traits; the type loop + Sun/Moon layer and a help card; Puff (3 start, +2 a turn, Yawny 1);
six statuses and four mood stats with icon + word; 62 moves as data with sources; four slots
on `Nubbin.battle` (optional, filled on first use, no save bump), a Bout card on the stats
sheet (stats, traits, 64 px slot tiles) and a "learned a move" toast; choose-all-then-resolve
turns by priority and Zip with a "Next up" strip. The entry point is unchanged (`strike`,
`guard` = catch your breath, `rally` = Huddle, plus `move {move, target}`). *Stubbed:* Peckish
also wears off (no battle items yet); Sticky only blocks switching (none yet); Heavy Hugger has
no effect outside tactics; the karate record is not folded into `battle`; R0219 (3D view)
not started. *Known:* a v1 turn bout in an old save is closed as a draw; on a phone the last
move row sits under Leave until scrolled (FIGHT-25). *Assumptions:* finals share a signature
by family and type (10, not 20); catching a breath has priority +3 like switching; Huddle
(the old Rally) is a basic move for everyone at 3 Puff; personality resistance halves the
chance; move names live in `config/strings-battle-moves.ts`, re-exported by
`strings-battle.ts`; moves are synced once a sim second in live play only.

## Lanes A–E (2026-10-28, merged on lane/d, one push)

The 2026-10-27 recommendations were worked by five lanes at once. Full write-ups are in
`docs/progress-archive.md`, and per-item status is in `recs-2026-10-27/STATUS.md`.

- **A MOVE.** *Works:* jump and landing feel in both modes, pad mapping (X pet, B feed, Y
  shake), auto-hop on tap paths, Fly-perk glide, the floating analogue joystick, Nubbin
  steering, thrown bodies that bonk off solids, collider/nav/ground-y debug overlays and a
  collision sweep. *Stubbed:* 3D knees on crouch, 3D wings, Keeper 2's jump, tap markers,
  fall recovery (MOVE-31). *Known:* a thrown Nubbin can't land on a bench top.
- **B DUNG.** *Works:* save v8; the boot veil and arrival grace; generator v3 with loops and
  29 Rootways pieces; packs that chase and start encounters; five acts with boss rooms.
  *Stubbed:* act tilesets and towns; a boss look; pack loot (Shells only). *Known:* the Pixel
  view doesn't draw packs (needs `world-view.ts`); the standard tour band hits about 85%.
- **C FIGHT.** *Works:* a seeded battle core (`src/sim/battle/`) runs the dojo and SL2's
  party bout, with the party panel. *Stubbed:* the 3D dojo view (R0219), rival species, the
  Hollow `encounter` wiring. *Known:* old `karateResult` trusts `won`; fast weak taps beat
  tier 2 (R0280).
- **D WORLD.** *Works:* the region graph (13 regions, paired exits, the `travel` command,
  discovery events); every quest mapped to an area (`noArea: 0`); the drawn map with
  "you are here", travel and region tabs; compass and minimap (Off/On/Auto); Full 3D
  `PERF_BUDGET` with a governor `geoLevel`; the chunk grid and Pixel off-screen culling
  (793 → ≤ 138 sprites); a World line in the debug panel; POI spacing and
  `npm run probe:world`. *Stubbed:* quests in the map sheet, maps for non-Grove regions, the
  compass objective tick, 3D streaming. *Known:* Full 3D is still over the phone budget at
  most spots until creature and scenery LOD (R0078/R0079). The region is derived from
  `location`.
- **E LOOK.** *Works:* Chao crown, tip, eyes, head ratio, wings, mitts, waddle and mouths in
  both modes; Moon adult hues; per-species 3D eyes; multi-head and ghost species; the
  likeness test suite. *Stubbed:* crown spring bone, toon rim light, slit pupils, the
  part-grow at evolution. *Known:* wing cream `#fff1c9` awaits Maor's OK.
- **All lanes.** Under load, the full-life, `species-gen1a-art` sculpt and nav timing tests
  can fail in a full run. Each passes when run alone; no budget was loosened.

## Lane D: WORLD (2026-10-28, branch lane/d, not pushed)

Order: R0070 → R0071 → R0068 → R0069 → R0075, then R0076 onward where lane A's files allow.

**Works.** Region graph (`config/regions.ts`, `sim/regions.ts`): 13 regions with sizes, tiered
POIs and paired exits; `travel` command; `regionEntered`, `regionDiscovered` and
`travelRefused` events; only the Grove, the lane and the Hollow are built. Every quest
resolves to an area (`content/where-map.ts`; content-check `noArea: 0`; report in
`docs/content-index.md`). The drawn map (`ui/world-map.ts`, `render/map-paint.ts`, `world.css`)
replaces the button grid in both renderers: ground, water, hills, buildings, a Keeper arrow
with a view wedge, Nubbin dots with type icons, label chips with no overlaps at 375×812,
pan, zoom, double-tap to centre, a "Travel here" sheet, and region tabs. Full 3D geometry
level: `PERF_BUDGET`, governor `geoLevel` thins the grass and the shadow redraws. Chunk grid
(`render/chunks.ts`), and Pixel skips off-screen sprites (793 → 44–138 drawn). Compass,
rotate-button north pointer and corner minimap with an Off/On/Auto setting. Debug panel World
line. `npm run probe:world` (Edge, phone, both modes, ~150 s) writes `docs/logs/world-perf.json`.

**Stubbed.** The map sheet lists no quests here: quests are not loaded at run time. Region tabs
other than the Grove list exits only. The compass objective tick is a hook (no tracked POI
exists yet). The minimap draws in the Grove only. Grove exits to unbuilt regions are data only.
No 3D chunk streaming yet (one 96 u field).

**Known bugs and limits.** Full 3D still breaks the phone budget at 12 of 19 spots (up to 707
calls and 4.0 M triangles) even at geometry level 3: creature and scenery LOD are in lane A's
files. POI spacing uses straight lines, since the nav path is lane A's.

**Assumptions.** The save version belongs to lane B, so `World.location` keeps its shape: the
region is derived from it, and `regionsFound` and `settings.minimap` are optional fields read
with defaults. The lane is reached through the neighbours' gardens (`visit:*`), and the Hollow
Below through its own entrance. The compass shows all the time, not only with the debug panel.

**Deferred.** These need lane A's files or work not built yet: R0072, R0073, R0074, R0078, R0079,
R0080, R0081, R0084–R0102, and R0106 onward.

## Lane C: FIGHT core (2026-10-28, branch lane/c, not pushed)

R0213–R0218, R0220, R0221 in 8c90a4f; R0219 (3D battle view) waits for lane A; next open R0222.

- **Works.** One pure, seeded battle core in `src/sim/battle/` (entry `index.ts`: `createBattle`,
  `battleAct`, `battleForfeit`, `replay`; world commands `battleStart`/`battleAct`/`battleForfeit`,
  event `battleEnd`). Optional `world.battle`/`battleRuns`, no save bump. The dojo and SL2's party
  bout run on it; the sim replays the dojo taps and pays from `BATTLE.prizes`, never from the
  screen. Rivals follow the party's level (tier 1 is winnable). Party panel: Strike asks "Who?"
  with 48 px foe rows. Tuckered allies nap under a leaf, foes toddle home.
- **Stubbed.** Full 3D still shows the pixel dojo (R0219). Rival species is always `chao`. Bout
  lines English only. The `encounter` context for the Hollow is built and tested, not wired.
- **Known bugs.** Old `karateResult` still trusts `won` (Shells recomputed from tier); drop next
  release. Dead "knocked down" strings remain in `strings.ts` (shared-file rule). Fast weak taps
  still beat tier 2 (R0280).
- **Assumptions.** Party foes = min(3, party size); a forfeit or draw pays nothing.

## Lane B: DUNG, the Hollow Below (2026-10-28, branch lane/b, not pushed)

R0142–R0146 in R order; next open is R0147. Save version 7 → 8 (`world.hollow.acts`).

- **Works.** R0142: the boot veil holds the floor still (`setLoading` from main.ts, never
  saved), says "Lighting the Hollow…" underground, and an 8 s arrival grace follows every
  entry, descent and veil lift. R0143/R0144: generator v3 (`sim/dungeon-gen-v3.ts`) on a
  12-cell slot grid: a branching walk with 1–3 loops, 29 authored Rootways pieces
  (`sim/dungeon-pieces/`, turned to fit, ≤ 3 of one per floor), tunnels between sockets,
  cave rock as one-tunnel side caves, v2's dressing shared through `dressFloor`; levels small,
  standard, big in `config/tuning-dungeon.ts`; new non-story runs use v3 (`HOLLOW.genVersion`),
  v1/v2 pinned by a snapshot test. R0146: packs (`sim/dungeon-encounters.ts`) notice, chase at
  0.8× and leash; a bump hands a 9×7 board to `EncounterHandler` (default: a seeded
  auto-resolve stub; lane C swaps in with `setEncounterHandler`, or answers later with the
  `encounterDone` command); win = poof and Shells, loss = giggles and back to the stairs with
  the haul. Packs drawn in Full 3D (`render3d/crowd.ts`). R0145: `config/dungeon-acts.ts`
  (five acts, 3–4 levels), boss room and boss pack on each act's last level, the boss gates
  the way on and opens the next act, act list in the cave-mouth menu.
- **Stubbed.** Fights (auto-resolve until FIGHT). Acts II–V use the Rootways pieces (their
  tilesets are not drawn); no act towns, outdoor zones or side dungeons (DUNG-07, -12); the
  boss is one big pack with no look or phases of its own (DUNG-20); no "!" emote or sparkle
  poof yet (3D uses a hop); pack loot is Shells only (DUNG-23).
- **Known gaps.** Pixel view does not draw packs: it needs a call in `render/world-view.ts`
  (lane A's file). Standard-level full-clear tour is in 750–1,100 u on ~85% of seeds, not
  95% (test allows 20 misses). The 3D pack figures did not show in the Edge chase shots
  (sim chase and fight checked; figures unverified).
- **Checked.** Edge (`recs-2026-10-27/tools/lane-b.cjs`): 3D desktop and 375×812 pass all;
  Pixel passes all but two driver artefacts (descent to depth 10 interrupted by pack fights;
  the one-frame pixel veil is never caught showing its label). About 56 fps on floors 1 and 10.
- **Assumptions.** The stairs band is measured against the farthest room, not the farthest
  cell (side caves wind on past every room). Tour bands per level: small 500–950, standard
  750–1,100, big 1,000–1,750 u (small opens an act, big closes it). Story floors stay on v2.
  The endless v3 Hollow has no sealed bottom. Packs only on v3 floors.

## Lane A: MOVE (2026-10-28, branch lane/a, not pushed)

Plan: from R0021 in order. Here: R0021 jump/land feedback (both renderers, sound), R0022
leftovers (pad Y shake, Keeper 2 jump keys, pet→X feed→B), R0024 auto-hop on tap paths,
R0027 hold-to-glide, then R0025's Grove part and R0026 as time allows. Helper worktrees:
R0028 analogue floating joystick (`lane/a-r28`, port 5191), R0029 Nubbin local avoidance
(`lane/a-r29`, port 5192). Merged into lane/a. Grew to R0034/35/38/39 while they ran.

**What works**
- Jump feel (R0021): `keeperLanded` carries `fall`; Pixel draws five player-only frames
  (`KEEPER_JUMP_CLIPS`: crouch, rise, apex, fall, land) with 1.08/0.9 quad stretch, the shadow
  on the floor under the feet (bench, rock, deck) shrinking with the gap, landing dust and
  double-jump sparkles; 3D stretches the rig 1.1/0.92, keeps the contact blob on the floor
  (`rig.lift`), dust ring and sparkles from `bursts`; sounds hop/hopAir/pat, and a "plop" for
  falls over 2 u (R0025's soft landing). Reduced motion drops squash and particles.
- Pad (R0022): X pets, B feeds, Y shakes; A is left for Keeper 2's jump (R0054).
- Auto-hop (R0024): Settings toggle, on by default in the Learning Grove and set on at a
  phone's first launch (`pointer: coarse`). Nav has hop cells (3) and terrace joins by rise
  (walk, hop ≤0.85, double ≤1.55); the tap walk jumps itself 0.3 u before a log, fence or
  tier face, double-jumps two tiers. Off: ramps only, as before.
- Glide (R0027): Fly perk, hold jump while falling: fall ≤1.6 u/s for 1.2 s, 1.2× air speed;
  leaf wings in Pixel; perk line "Glide: hold jump to glide". Auto-hop presses never glide.
- Jump play (R0026, items 3/6/7): rock tops ≥0.5 lift the look 0.4 (both cameras), a jump
  into a fruit trunk shakes it (3 s per tree), a leapfrog over a sitting Nubbin giggles
  (+2, heart, 10 s per Nubbin).
- Joystick (R0028, helper 243b412): floating analogue pad, camera-live, smoothstep pace,
  auto-run, first-touch offer toast.
- Slivers (R0034): `SLIVER_JOINS` (Keeper-only bars) + `layout-lint.test.ts`; the dojo gap
  was already open (already-upstream). Unreachable taps (R0035): `moveUnreachable` event,
  bonk + toast (20 s), and shut-in taps now stop at their stand-in instead of pressing forever.
- Debug overlays (R0038): Show colliders / nav grid / ground y in the debug panel, both modes.
  Collision sweep (R0039): `collision-sweep.test.ts` (8 u × 8 dirs, 200 taps), ~3.6 s.
- Thrown bodies (R0033): `sim/throw-collide.ts`; eggs and Nubbins in flight bonk off solids
  taller than they fly (0.4 restitution, Nubbins dizzy), a landed egg is pushed out once.
- Nubbin steering (R0029, helper 6a40324): `walkToward` probes ahead and turns ±35°/±70°,
  a Nubbin grid in nav.ts (`nubbinAim`, replans every 3 s) for long or blocked walks,
  wander/swim targets resampled out of colliders, sled starts at the nearest ramp foot,
  `perform` walks to its spot. Sweep: walks stalled > 4 s 316 → 0; 0 samples in solids.
- Edge (`recs-2026-10-27/tools/laneA.cjs` + `laneA-overlay.cjs`): 9/9 in Pixel and 3D, desk
  and 375×812, no console errors.

**Stubbed or deferred**
- R0021: 3D knees don't bend on crouch/land (scale only); no grass push on landing.
- R0022: Keeper 2's jump (Enter/Numpad0, pad A) needs Keeper 2's vertical state (R0054).
- R0025: chasm/deep-water recovery, `lastSafe` and the sprout leaf-bridge wait for MOVE-31.
- R0026: the waterfall shelf keepsake (item 4) is not built; fence pens and stream/terrace
  hops were already in.
- R0027: no 3D wings (Pixel only); the pond-crossing glide from hill 1 is untested.
- R0031, R0032 (Hollow platforming and solid set pieces) not started: Hollow files are
  outside Lane A's list. R0030, R0036 and R0037 are next.
- R0033: a thrown Nubbin does not land on a bench top (needs Nubbin heights, R0030).
- R0035: no ✕ / ⤒ tap marker drawn (neither renderer has a tap marker yet); toast + bonk only.
- R0038: the ground-y number is a label sprite under the Keeper.

**Known bugs and assumptions**
- Assumption: Auto-hop gates every hop (logs, fences, terraces); off keeps the old walk.
  The phone default is written to the save at first launch on a coarse pointer.
- Assumption: R0029's sled uses the nearest hill's ramp foot.
- R0040 marked already-upstream: 146 of 147 hill-foot stops sit at a ≥ 0.3 u rise. One stop
  (hill at (2, −40), approach 13 of 16) is on flat grass 0.54 u from the rim.
- Sliver joins are Keeper-only (a Nubbin bar caused a corner trap in growth.test); a join
  to a hop/standable piece is hop too, so the rock top stays standable.
- Full-life timing: 1.22–1.47 s alone (base 1.35 s on the same loaded machine; R0029's
  helper measured +8% from extra walking). It hit 3.09 s once in a full run under 5 lanes'
  load and passed alone. Two art tests time out at 5 s in loaded full runs only.
- `style.css`: the old joystick rules were removed (now in `src/move-joy.css`).

## Lane E: LOOK creature looks (2026-10-28, branch lane/e, not pushed)

Chao-line, pocket and digital looks from the R0370–R0441 list, only in `src/render/sprites/`,
`src/samples/`, `src/render3d/art-species*.ts` and `tests/render/`. Helper branch
`lane/e-pocket` (R0376, R0416) is merged in. Screenshots: `docs/samples/lane-e/`.

**What works.** 3D Chao: a yellow tip egg on a crown swept back in two cones, kept clear of
every mark (R0371, R0380 shape); solid dark Chao eyes with two glints, no sclera or brows,
matte (`eyes.style: 'chao'`, R0372); head 0.82 wide on a 0.6 torso, 1.37x (R0373); belly,
blush and star now opt-in (`NUBBIN_EXTRA_MARKS`), blush only while petted in both modes, belly
patch only on two-tone eggs (`ChaoColors.bellyPatch` in pixel, R0381); cream leaf wings past
the shoulders with idle flutter bursts, one colour in both modes (R0382); nub feet and mitts
(R0384); Moon adults lifted with a type hue on crown, tip, hands and feet, pixel rim (R0418);
the waddle (`waddle` field, pixel head rock, R0390); Chao mouths (R0433); children's critter
parts at 0.8 (R0434); pixel character looks matched to the line-up plus Quills and Shade
(R0396); per-species 3D eyes (`dot`, `cute`, angry roll, `irisColor`, R0406); multi-head
species with equal heads on necks (R0376) and floating ghosts with gas (R0416).
`tests/render/likeness.test.ts` is the likeness suite (R0435).

**Stubbed / left.** The crown spring bone (R0380 rig); the per-band toon rim light (R0418);
personality scaling of the waddle and the 0.8→1 part grow at evolution (need
`render3d/actors.ts`); slit pupils (R0406); the likeness test's `quad` plan check (no
reference table yet). Deferred: R0370 sit pose and the other actors/looks/dress/world-view
items, R0388 type silhouettes, R0405 Gen-1 top 20, R0436 likeness data.

**Known bugs / assumptions.** Wing colour `#fff1c9` (palette cream) awaits Maor's OK. Pixel
character looks follow the 3D line-up figures where the item text disagreed (echidna ears and
belly patch, dream horn instead of a jester cap). Torso x radius 0.6, not 0.56, to land the
head at 1.3–1.4x. Unused leftovers: `sideHeads` and the `trio` addon. Under load,
`species-gen1a-art` sculpt and `nav` timing tests can time out; both pass alone.

## Pass 3: MOVE terraces, props, bodies, motion (2026-10-28, branch pass/3, not pushed)

Plan: R0011 terraces first (sim height model, cliff gate, nav, Pixel and 3D meshes, hill-0
path on the ramp); then R0016, R0020, R0017 and R0023 here, with R0018 (3D occluder fade)
and R0019 (Pixel x-ray) built in helper worktrees and merged. R0021 onward left for Pass 4.

**What works**
- Terraces (R0011): each hill is `ceil(h / 0.9)` tiers (2–5), steps 0.67–0.87, top tier
  0.4 r across, built by `hillTerrace` in `sim/terrain.ts` (`TERRACES`, `TERRACE` in
  `tuning-sim.ts`, `ramp: { from, to }` per hill in `GROVE.hills`). `hillHeight(x, z, soft)`
  gives the drawn (eased 0.5 u inside each rim) or hard (upright) shelves; the 3D mesh and
  grass sample the soft one, Pixel builds cylinders and `rampGeometry` sheets from the hard
  one. The ramp climbs along the foot of each next tier, leg by leg, 1.2 u wide with
  walkable banks. The Keeper is held at a cliff by `ledgeY` (a step may rise `stepUp` over its
  feet or shelf) and slides round the ring; a jump clears one tier. Hill colliders are
  `nubbinOnly` now (Nubbins keep off); hill 1's waterfall face is a solid segment. Nav treats
  cliffs as walls between cells (`step`, sampled once; `astar` takes a `pass` option), so
  120/120 random taps arrive and every hill top is reached by tap. Hill 0's worn path (3D
  ribbon, Pixel dabs) follows `rampPath`; `hill-path` is the ramp foot. Edge, both modes:
  ramp walk to Briar, a jump onto tier 0, a walk at the face stays at the foot.
- Story props (R0016): `STORY_PROP_COLLIDERS` by kind in `grove-layout.ts` (shed and barn
  walls, benches/chair/flat stone standable, shelf solid); live only while
  `storyPropMask(world)` says the prop stands (in the collider and nav cache keys).
- Ground feel (R0020): `KEEPER_ACCEL`; stick speed in ~0.12 s, stop in ≤ 0.11 s, a reversal
  skids once (`keeperSkid`, Pixel dust), speed into walls is lost, tap walks ease in over
  0.6 u. 3D turns at 900°/s, Pixel holds a new heading 60 ms.
- Bodies (R0017): `sim/separation.ts` after the NPC step; overlap rate under 0.1% with 8
  Nubbins (0.77% without), the Keeper walks through a crowd of 8, carried ones untouched.
- Cameras (R0023): `CAMERA_FOLLOW`; Pixel follows the drawn ground (terrace, bench, bridge)
  and holds through jumps, both lead by 0.6 u, 3D nods 0.06 u on landing (not under reduced
  motion). Edge: Keeper at NDC y 0.05 (Pixel) / −0.11 (3D) after the climb.
- 3D occluder fade (R0018, agent, 54a6b12): `render3d/occluders.ts`; Keeper visible 256/256
  frames (4 buildings × 8 yaws × 8 ring spots) at desktop and phone.
- Pixel x-ray (R0019, agent, 9fe216c): `sprite-batch.ts` draws marked quads again through a
  `GreaterDepth` child mesh at 45%, tinted by the trim colour, with a 1-texel outline (1 extra
  draw call, none when nothing is marked); the Keeper and the highlighted Nubbin are marked;
  scenery and orchard quads nearer than the Keeper and over its head fade to 55%.
  Sweep (Keeper on a 0.8–1 u ring, desk): trees 96/96, cottage and cave 64/64, but the same
  without the x-ray: Pixel's older dither round the Keeper already clears these spots, so the
  x-ray's own share is unproven (partial).

**Stubbed or deferred**
- Deferred to Pass 4: R0021 onward (jump/land frames, auto-hop, falls, jump unlocks, glide,
  joystick, Nubbin heights...). Nubbins still never climb terraces (R0030).
- R0017: NPCs do not pause and walk round when the Keeper blocks their target (they already
  stop within 2.5 u of the Keeper). R0018: flat silhouette, not a 1 px outline; story-set
  cabins and the visit garden not boxed. R0016: the garden door has no collider.
- R0011's leftovers: no ledge-y camera avoidance (R0052); the outer ring props near hills
  were checked only for the colliders' centres.

**Known bugs and assumptions**
- Assumption: "3 tiers" in R0011 became 2–5 so every step stays in the 0.6–0.9 band.
- Ramp angles were picked by a scan clear of colliders and the stream; hill 1's ramp leaves
  93–153° free for the waterfall. Moved off the terraces: the rock and its sprite at
  (-13, 12) → (-10, 10), the log at (-24, 12) → (-26, 12.5), bush-3 at (-33, -36) →
  (-31, -36.8). `flat-stone` marks moved in to 0.55 r, the crest tree to (1.2, 1.0).
- A Nubbin can still walk up the first ramp leg (it is outside the hill's collider).
- `ledgeY` uses the full height sum near hills (the tile cache smears a cliff over 0.25 u).
- The terrain test skips mesh cells across a cliff face and allows 40 (was 20) samples off by
  more than 0.05 u: the ramps' banks are steep for half-unit cells. Grass checksum updated.
- Full-life timing test: 1.17–1.21 s alone (1.12–1.16 s before), 2.49 s in the final full
  `npm test`; it once hit 3.04 s while helper agents' Edge sweeps loaded the machine. The
  collider table's cache key is now a number (8936f4b), which won back about 50 ms.
- R0019: the x-ray head point is a fixed y 1.7, so on a terrace the fade test aims low.

## Pass 2: MOVE jump, bridge and stream (2026-10-27, branch pass/2, not pushed)

Plan: the jump core first (R0012, R0013, R0015), since the bridge, the stream and the fence
jump stand on it; then R0002, R0001, R0014 with R0022. R0011 and R0016+ left for Pass 3.

**What works**
- The Keeper has a height (R0012): `y`, `vy`, `grounded`, `airJumps`, coyote and buffer
  timers, `jumpHeld`; save v7 migrates v6 with the feet on the ground. Command
  `{ kind: 'jump', down }`; events `keeperJumped` / `keeperLanded`. Hop and standable
  colliders block only below `top − stepUp` (`colliderTopY`); walls, trunks and rails
  always block. Benches and logs can be landed on (`standTopAt`); fences are jumped (the
  R0007 leftover).
- `JUMP` (R0013, in `tuning-sim.ts`): held apex 0.95, double 0.75, short hop, coyote 120 ms,
  buffer 150 ms, fall ×1.5; `kidFloat` in a Learning Grove or with the new Gentle jumps
  setting. Table-driven tests at both tunings (`tests/sim/jump.test.ts`, 22 tests).
- 60 Hz Keeper substeps (R0015): `updateKeeper` runs 6 per sim step; game.ts runs them
  between steps on its own accumulator (`stepKeeperMotion`, never more than a step ahead);
  both renderers interpolate the Keeper on that clock (`keeperAlpha`, `snapshotKeeper`).
  Same command log → same positions however the substeps split. Edge: Space to y rising
  6–16 ms.
- Bridge (R0002): `deckY` deck box at `BRIDGE_YAW` with 0.4 u ramps; 3D planks placed from
  `bridgeDeckTop()`; two solid rail segments in `grove-layout.ts`. Feet within 0.000 u of
  the planks in Edge, both modes; a sideways walk stops at the rail.
- Stream (R0001): feet sink to the bed (max 0.35 under the surface), 0.55× speed while
  wading, a running jump clears it dry. Pixel sinks the sprite under the painted ground and
  rings ripples every 300 ms instead of dust; 3D stands the rig on the sim footing.
- Phone jump button (R0014): 76 px round, above the camera buttons, `touch-action: none`,
  jumps on pointerdown, hidden on fine pointers and under dialogue. Space jumps, X shakes;
  with an egg or Nubbin in hand Space and the button shake (🥚) instead (R0022).

**Stubbed or deferred**
- Deferred to Pass 3: R0011 (terraces, XL), R0016 onward; from R0014 the Left-handed
  setting, moving ⤢ into More, gamepad A; from R0022 pad Y and Keeper 2's keys; from R0012
  `lastSafe` (R0025), `keeper2Jump` (R0054) and ceilings (no overhangs exist yet).
- `airControl` and `landSquashMs` are in `JUMP` but unused until R0020/R0021.
- No 3D ripples or splash sound for the wading Keeper; no jump animation (R0021).

**Known bugs and assumptions**
- The drawn stream bed is only about 0.15–0.2 u under the water, so the wade reads
  ankle-deep, not knee-deep; deepening it means changing the 3D mesh (left alone).
- Coyote and buffer are ms counters on the Keeper (`coyoteMs`, `bufferMs`), not absolute
  times: substeps are finer than `world.timeMs`.
- The rails also stop a Keeper wading along the stream under the bridge (pilings).
- The full-life timing test ran 3.09 s once under full-suite load before the idle Keeper
  skipped its pace lookups; alone it is 1.26 s.
- Pixel draws the rails' line nowhere: its bridge is a flat painted plank sprite.
- The dev server for the Edge checks ran from Bash: the browser pane reads another
  folder's launch.json.

## Pass 1: MOVE collision foundations (2026-10-27, branch pass/1, not pushed)

R0001 (stream wade) and R0002 (bridge deck) need sim heights and the jump, so this pass laid
those foundations first (R0003–R0010) and left both for Pass 2.

**What works**
- `config/grove-layout.ts` is the one table of Grove solids (R0004): hills, fruit and wild
  trees, houses as boxes the size of the 3D walls, the well, the windmill footing, rocks, all
  five lanterns, the cave lips, the stalls (only once unlocked) and the 66 wild props, which
  the pixel `SCENERY` and the 3D stalls now read. A test checks drawn ↔ collider both ways.
- `sim/obstacles.ts` resolves circles, oriented boxes and segments through a 4 u grid (R0005);
  walkers are `keeper`, `nubbin` or `hopper` (Run or Fly 20+). Bushes, beds and thickets are
  soft: the Keeper walks through at half speed and eases out once it stops (R0006).
- Decor collides by kind from `DECOR.colliders` (R0007); pieces turn in eighths (the
  placing chip's ↻ Turn button, saved as `placed[].yaw`); fences join end to end; a 4×4 pen
  holds a Nubbin for 10 sim minutes, a Run-20 Nubbin hops it.
- `placeRefusal` (R0003) keeps pieces off colliders, the pond and stream, the bridge, story
  props, visitor homes, egg spots and anyone standing there, with a toast saying why.
- `sim/nav.ts` (R0008): 0.5 u grid with pocket labels, A* (shared `sim/astar.ts`), string
  pulling; 120/120 random taps arrive, median path ratio ≤ 1.10, plan p95 about 2 ms alone.
  Shut-in taps walk to the nearest reachable point; care walks with nothing in reach say
  `cantReach` at once.
- Hollow A* (R0009, `sim/dungeon-nav.ts`): 360/360 taps arrive; the party plans its own paths.
- `sim/terrain.ts` (R0010): the 3D height model and the pixel tier table now live in the sim;
  `groundAt` returns y and surface; the 3D mesh is unchanged.

**Stubbed or deferred**
- Deferred to Pass 2: R0001, R0002, R0011–R0015 (terraces, jump, phone button, substep),
  then P1+ from R0016.
- `hop` and `standable` pieces block the Keeper until the jump lands (MOVE-10).
- No red placement ghost: a refused piece toasts its reason instead. No R key for turning.
- Story props (shed, benches, chair) still have no colliders: that is R0016.
- `sweep.ts` was not rerun; the Vitest sweeps stand in for it.

**Known bugs and assumptions**
- Pixel decor is a front-facing billboard, so a turned fence collides along its turn but is
  drawn square to the camera. 3D draws the turn.
- The windmill collides as its round footing (r 1.95), not a box; the cottage box leaves out
  the roof overhang, so the Keeper can tuck under the eaves.
- Hollow tap paths avoid water without the Swim perk (DUNG-01's ×1.5 water cost not used).
- The nav timing test asserts median < 1.5 ms and p95 < 10 ms so a loaded CI runner passes.

## Pass 0 hotfixes (2026-10-27, branch pass/0, not pushed)

The ten **live bug** items from `recs-2026-10-27`, as one hotfix commit. Plan: check each still
reproduces on 9c01019, fix it hotfix-sized, and leave the larger parts to their passes.
- **Works:**
  - FUN-01 (+KIDS-01): the r1025 entry overlay's `.edu-prompt` (absolute, full-screen) hit every
    sprout prompt span and minigame prompt. The overlay is now `.edu-entry*`, the dialogue's
    bracketed prompt is `.edu-aside`, do buttons are ≥44 px, and a box tap pulses the do button.
  - TECH-01: a first hatch starts at `EGG.hatchHunger` 0.7 (a rebirth hatches full), and a new
    world starts with `EGG.startFruit` 2, since a fresh Free Grove had 0 fruit.
  - TECH-02: a release under `THROW.placeMaxSpeed` 1.5 is a free place (happy bubble). From 1.5 to
    3 it's a drop at half penalty (`dropScale`), and ≥3 is a throw.
  - TECH-03: `navigator.storage.persist()` is asked once, at the first gesture after a hatch
    (`grove.persist` key). Every save is mirrored to IndexedDB (`grove-saves`/`slots`), and boot
    restores a newer or missing copy. Settings > Saves warns when storage isn't persisted.
  - SOUL-01: play re-aims at the toy and arrives within `toyReach` 0.7, and the play timer starts
    on arrival. Walks to a toy, fruit or ball give up on a timeout (6 s, or 1.5× the walk time for
    far fruit) or on no progress (0.2 in 2 s). A given-up item is skipped for 30 s.
  - CAMP-02: the Hundred Days and Logged In setups add their Nubbins instead of replacing the
    roster (cast ids in `c.flags.cast`). Dawn & Dusk's revert spares Nubbins already grown at
    the start (`dd-before`).
  - CAMP-03: `counter()` reads the change since `startStoryline` (`base:<kind>` snapshot).
  - KIDS-07: save v6 adds `breakUntilMs`, `todayMs` and `todayKey`. Play counts only live, visible
    ×1 time and survives reloads within a day. The break card has no dismiss, only a gated
    "Grown-up: a little longer", and stays locked across a reload.
  - KIDS-04: Story closes the picker, then plays a queued scene or opens a spoken "What's next"
    card (`ui/next-card.ts`). It never shows the journal toast.
  - KIDS-06: the edu Settings button was already gated on main. This pass adds a kid-safe 🔊/🔇
    HUD toggle.
- **Partial / stubbed:**
  - TECH-01: no first-hatch 🍎 bubble or objective chip line.
  - TECH-02: no ground ring and no 200 ms lowering.
  - TECH-03: no 7-day backup offer, and the IndexedDB code has no unit test (no fake-indexeddb).
  - CAMP-02/03 wait on CAMP-01 for `Nubbin.home`, the region filter, `lineCastMax`, the bring-home
    choice and the checker's flag-namespace rule. A line's cast may push the roster past its cap
    (that blocks new eggs, it doesn't break anything).
  - KIDS-06: the duplicate edu fieldset is still there (behind the same gate), there's no jsdom
    test (the repo has no DOM test environment), and the toggle is a button, not a big slider.
  - KIDS-07: a 😴 card instead of a sleeping Nubbin, and no goodnight ritual (KIDS-36).
  - KIDS-04: no `goalIcon`/`goalSay` content fields and no "Show me" (KIDS-05).
- **Assumptions:**
  - SOUL-01's "≤10 s walking" can't hold for fruit up to 30 units away, so fruit walks are bounded
    at 1.5× their walk time instead.
  - TECH-01 is checked with `debugHatchNow` in the Edge driver. Hatch timing is unchanged.
- **Checks:** lint, 1092 tests and build pass. A headless Edge run (Pixel and Full 3D, at 1280×800
  and 375×812) passed 18/18 checks each time, covering every item above, with no console errors.
- **Known bugs:** none new.

## Story review run 24 fixes (2026-10-27)

- **Works:** all 57 of run 24's recs fixed in the S4–S8 sprout and reader bands: plain words at S5's
  goodbye, a water-safety lesson before S4's wade-in, Marina's rule five back in S4, S6's notes named
  as Ash's name, and quizzes moved out of S8's reunion.
- **Partial:** none.
- **Known bugs:** none new.

## Fun-quest choice payoffs (2026-10-27)

- **Works:** every Q1–Q65 fun-quest choice now changes something: 80 flags pay off with a later line in
  main and both bands (src/sim/fun-payoffs-*.ts, merged into CHOICE_PAYOFFS via payoff-kit.ts, 111
  new test cases), and 10 are named as flavour in their quest notes. Closes SR-20261027-1304.
- **Partial:** Python's quests have no set order, so a later-quest payoff shows only if the earlier
  quest came first; otherwise the scene plays as written.
- **Known bugs:** none new.

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

## Story review run 19 fixes (2026-10-26)

- **Works:** 47 of run 19's 48 recs fixed across campaign book 3, the endings, the triggered scenes,
  both campaign bands and side stories S1–S5. New tested payoffs: S2's early/carried choices in
  s2-night, S1's boat and cinder choices, Hazel taking the gap seat at the S3 moot, and five campaign
  and ending swaps through a new `Swapper.swapText`. Band lessons no longer sit inside grave beats.
- **Partial:** SR-20261026-1055: t-talk-generic has lines but nothing plays it yet (needs a trigger).
- **Known bugs:** the C: drive ran out of space during this pass; Maor freed space the same day.

## Story review run 18 fixes (2026-10-26)

- **Works:** all 43 run-18 recs fixed across the Japanese line and its bands, the Hebrew reader, the
  extras (readers, results) and campaign books 1–2 with their bands. Two new choice payoffs in
  `choice-payoffs.ts` (tested): Corvin quotes your c5 race answer back in c9, and the LJ3 race and
  LJ4 bento choices pay off in their done scenes. Nova finally gives the owl speech.
- **Partial:** none new; SR-20261026-939 (LK) still waits on LK being wired.
- **Known bugs:** none new.

## Story review run 17 fixes (2026-10-26)

- **Works:** 57 of run 17's 58 recs fixed across PA4, PA5, LB and LK with their bands, and the
  Hebrew line. PA4's Wisp, Clank, candy and friend beats and PA5's eight memories now actually
  play (replacing variants, `GROVE_VALUE_ALIASES` and PA4's `lineLive`, with tests). LK's reader
  counts ten crocodiles again; "arba" is glossed ar-BAH. Flag values no longer collide with Grove's.
- **Partial:** SR-20261026-939: LK's renamed variants have no test, because no engine plays LK yet.
- **Known bugs:** LB and LK are not wired into any sim engine (CV4); their variants wait for it.

## Story review run 16 fixes (2026-10-26)

- **Works:** all 57 run-16 recs fixed across PA1 with its bands, PA2, PA3, the A30 bands and A31
  with its bands. Little Sprouts' PA1 Critical (pa1-16-friends) now counts four friends aloud.
  Clank's Arcade cameos never played (they were "play after" scenes the engine has no hook for);
  they now replace their host scenes, and PA2's Byte-less biscuit run is wired through `GROVE_UNSET`.
- **Partial:** none.
- **Known bugs:** none new. The sprout PA1 gate always opens; its locked-gate scenes are exempt.

## Story review run 15 fixes (2026-10-25)

- **Works:** all 56 run-15 recs fixed across the A26 reader, A27 and A28 with their bands, A29 main
  and reader, and A30. The word you teach in A27 ("friend", "home" or "sorry") now comes back at the
  reunion (flag values `taught-*`, variants in all three files). A29's farewell pays off Bobby's mug
  and Celine's pears, and the sticky Nubbin finally reaches the shawl and the stool in A28.
- **Partial:** none.
- **Known bugs:** none new. Atlas flag values must not collide with Grove flag values such as 'home'.

## Story review run 14 fixes (2026-10-25)

- **Works:** all 55 run-14 recs fixed across A23 and A24 with their bands, A25 main and reader, and
  A26 with its bands. A26's flood tale now counts seven days and seven loaves, with the wife correcting
  him. Atreyu gets a terrible first rhyme, and Baloo is "half the bear I was". The A24 reader's 66
  over-long replies are trimmed.
- **Partial:** none.
- **Known bugs:** none new. Some reader lessons carry no standard tag where no grades 3–5 code fits.

## Story review run 13 fixes (2026-10-25)

- **Works:** all 60 run-13 recs fixed across A19, A20 and A22 with their bands, plus A21. A21 shows the
  Grove neighbour as "Keeper Fern" through a page-local speaker. A20's Thor escalates to the millstone
  before Baldr's death, and A22's dinner has Pepa's cloud and Félix's umbrellas back.
- **Partial:** none.
- **Known bugs:** none new. `tests/tools/script-book.ts` now keeps page-local name-plates of shared
  speakers out of other storylines' renders.

## Story review run 12 fixes (2026-10-24)

- **Works:** all 60 run-12 recs fixed across the A15 bands, A16, A17 and A18 with their bands. A18's
  merchant now pays off his thimble and "who won" joke at the homecoming. The keepsake gag runs A15
  to A18, each page naming only its own item, ending "Your coat pocket has stopped trying."
- **Partial:** none.
- **Known bugs:** none new. A few A16/A18 reader `maths:` warnings stand (answers come from stated numbers).

## Story review run 11 fixes (2026-10-24)

- **Works:** all 59 run-11 recs fixed across A12–A15 mains and bands. A15's honesty choice now sets
  `a15-secret = 'promised'` and pays off in four new variants (Oz's goodbye, the Scarecrow's laws), with
  sprout and reader clones. A13 gains a Clank variant of the belly scene. The Nubbin's souvenirs run
  as a gag from A12 to A15.
- **Partial:** none.
- **Known bugs:** none new. Two A14 reader `maths:` warnings stand (answers come from stated numbers).

## Story review run 10 fixes (2026-10-24)

All 60 run-10 recs in `docs/story-review/LOG.md` fixed; no open recs remain.
- **Works:** the A08–A11 bands and the A10 and A11 mains. Maui is named before he is needed; Gramma Tala's last
  words and the A11 farewell and knighting play through without a lesson cutting in; the Friend ribbon comes off
  Eeyore's door in every version. Reader bands use grades 3–5 social-studies codes, and 3.NF.A.3 is approved.
- **Partial:** none. **Known bugs:** none.

## Story review run 9 fixes (2026-10-23)

All 58 run-9 recs in `docs/story-review/LOG.md` fixed; no open recs remain.
- **Works:** the A04–A09 mains and the A06 and A07 bands. A05's finale has eight Balla variants and A09 has
  named raft returns (`a09-raft`), all with band versions. A07 sprout's twist now goes to Héctor; the band maths
  lessons match their scenes. `content-check --warnings` has a new `maths:` check.
- **Partial:** none. **Known bugs:** the `maths:` check raises 71 warnings, mostly sprout counted-object answers
  and unit answers; they still need a human pass.

## Story review run 8 fixes (2026-10-23)

All 59 run-8 recs in `docs/story-review/LOG.md` fixed; no open recs remain.
- **Works:** E3, the four storylines (hundred, logged, beetle, dawndusk), the A01–A03 mains and both A05 bands.
  Logged's and Beetle's last choices now reach every ending: `storyline-rules-logged.ts` and `-beetle.ts` queue an
  `l-end-*` / `b-end-*` body scene before the title card (staged, tested). E3's `e3-merge-done-strong` is wired.
  Tam, Hob and Ash Penhallow are now Nell, Grist and Rowan Penhallow; speaker ids are unchanged (canon 43).
- **Partial:** none. **Known bugs:** none.

## Story review run 7 fixes (2026-10-23)

All 57 run-7 recs in `docs/story-review/LOG.md` fixed; no open recs remain.
- **Works:** Alice, Holmes, Hodja, Dragon Ball, Toy Story, the Multiverse endgames, E1, E2 and both A02 bands.
  New payoff variants are wired: Q81's `q81-var-children` (`fun-pack-rules.ts`), E1's slow ending and E2's
  short-answer endings (`side-rules-expansions.ts`, tested). DB19's `mv-db-set2-keeping` value is now `carried`;
  old saves holding `nubbins` hear the capsule-case lines. Canon 45 gained the run-7 gags.
- **Partial:** none. **Known bugs:** none.

## Story review run 6 fixes (2026-10-23)

All 57 open or partial recs in `docs/story-review/LOG.md` fixed (run 6's 56 plus run 5's -265); no open recs remain.
- **Works:** Learning Grove S30, S31 and the Python, Bean and Avatar quests, both bands: s30-wall's Hush speech
  says plainly that the Nubbins died, with comfort after; Q64 says what Kaito did (canon 46); S31's "never say if"
  rule is set up; Avatar Q51's rule-maker fixed; spouse beats for Frannie and Reggie (Q8) and Mrs Tibbs (Q61);
  Pixel and Byte in S30/S31; Granny Brock's quilt and flask in S31.
- **Partial:** none. **Known bugs:** none.

## Campaign graphics 3 leftovers (cg5, 2026-10-23)

The known bugs left by K1–K50 (02d0c86; its section is now in `docs/progress-archive.md`), fixed on branch `fix/cg5-leftovers` (worktree
`wt-cg5`). Before and after frames: `docs/samples/cg5-*.jpg` (`-before` is origin/main at
02d0c86 unless the name says `cg4`, the review round's frame).

**What works**

- **Hundred ch9 (3D):** package k's rubble (`k-fold-ruin-*`) has its own material, hooked as
  house-only, so a hidden house takes its red tiles and loose boards, flat ones included
  (`dress-k.ts`, `dress-a.ts` `HOUSE_ONLY`). The plinth tops stay, as before.
- **Guard house (3D):** the counter is desk height in Full 3D (`interiors.ts`, the lamp's
  `y3d`), so Hob reads seated on his stool. The phone room was already right at 02d0c86
  (c4's "keep interior cameras on the open side"); the after frames confirm it.
- **Logged In:** on a phone a skinned box frames a full-length portrait head and shoulders
  (`CG4_U4.box.phoneCrop`), and the terminal puts a lit panel behind it, so the Warden shows a
  face. The cut "Please" line was the typewriter caught mid-line; the full line fits.
- **Logged In ch1 pixel perf (profiled):** 60 fps at 4× throttle in headless Edge (worst second
  59, no frame over 50 ms). The top cost was `safeRect()` forcing a layout every call (6% of
  frame time); it now keeps its answer for 150 ms (`stage-api.ts`).
- **Hazel ch10 phone `-1`:** a line naming a big prop never narrows the frame to the prop
  alone: the last tier keeps the nearest person with the prop's middle (`fitTiers`,
  `STAGE4.subjectRim`; test `tests/render/stage-fit-subject.test.ts`), and the 3D phone
  push-in is skipped for that tier (`fit-shot.ts`).
- **Keepsake inspector:** flat keepsakes (the letter) turn only to 86% in the pixel card and
  flip to their back on the 3D Turn button (`CG4_U4.inspect.flat`). The pixel card already
  opened face-on at 02d0c86; the edge-on frame in `cg4-u4-box-phone.jpg` was the 3D one.
- **Kitchen Fern:** already drawn in her story look (cap, scarf, satchel), portrait included,
  in both renderers at 02d0c86 (b4's `storyId`); checked with `c1-letter` staged in the kitchen.
- **Beetle ch3 floor (pixel):** underground the pixel fill light is warm stone
  (`DUNGEON.caveAmbient`), not the night sky's blue at 1.5×.
- **Minimap:** the Hollow bar also stays hidden while a story scene is queued
  (`html.story-queued`), not only while a line is up. **Hazel ch12 phone:** the fit keeps
  `STAGE4.phoneBoxGap` (28 px) clear above the box on a phone.

**Stubbed or approximate**

- The 3D kitchen and guard-house checks used a runtime overlay (no content scene is staged in
  the kitchen yet).
- Hazel ch12 phone looks the same: the festival ring is too wide to fit, and the well and
  reeds (scenery, not cast) still reach the box's top edge.

**Known bugs**

- In Hazel ch10 `-1` on a phone the person kept is small in 3D (pushed-in framing would lose
  the pond).
- The plinth tops of hidden Fold houses stay as paving (by design since K2).
- Carried from K1–K50: no real-phone pass yet; some sim/story-world tests time out under
  full-suite load and pass alone.

## Story review run 5 fixes (2026-10-23)

All 63 open or partial recs in `docs/story-review/LOG.md` worked (run 5's 60 plus run 4's 3 partials).
- **Works:** 59 fixed. Learning Grove S25–S29, both bands: Marina's rule six "Come back." in all six S29
  endings, Granny Brock's cake and bell paid off, why Dusty can't go home, the S25 light-toy-wild-Nubbin link,
  Pixel and Byte bickering at S28's party and in S25/S27, first-mention tags for Hazel, the supper Nubbin.
- **Partial:** -265 (S26's robin line rewritten without the unset-up "wages" joke). Dropped: -179, -198, -229
  (lessons can only play before a scene's choices; each ask already sits as late as the engine allows).
- **Known bugs:** none.

## Campaign graphics 3, items K1–K50 (2026-10-22)

Built from `docs/campaign-graphics-recommendations-2026-10-22-b.md` the same way as the second
pass: wave 0 (`f4`, Opus), seven packages in parallel (a1 poses and rig, c4 interiors and places
on Opus; a2 motion, b4 people, d4 sky and weather, e4 world detail, u4 story UI on Sonnet), a
content wave, shots and perf, two review rounds with one fix round. Branches `cg4/foundation`,
`cg4/pkg-{a1,a2,b4,c4,d4,e4,u4}` and `cg4/content` merged in `cg4/merge`. Rules and API:
`cg4-rules.md`, `cg4-api.md` (session folder). Shots: `docs/samples/cg4-*.jpg`; golden set
`docs/samples/golden/` with `tests/tools/story-shots.cjs` and `story-shots-diff.cjs` (K50).

**What works**

- **Staging (f4):** focus weights in the fit (people first, large props kept at 60%, a phone 3D
  figure never under ~40 px, a line naming a prop makes it that line's subject); shot/reverse on
  two-speaker exchanges; `grave` letterbox scenes (30); the stage inspector in `?debug`; the shot
  test over every staged scene at desktop and phone (`tests/render/story-shots.test.ts`); new
  fields `from`, `partner`, `inside-<id>`, `tale`, `grave`, `moon`, `Line.gesture`.
- **Acting (a1, a2):** sit and kneel for Keepers and Nubbins (Moss sits upright, the Keeper beside
  him), heads turn to the speaker (crowd at half), five gestures (122 lines carry one), hand and
  neck pivots for carried props, the item-get pose; walk-ons with footprints by ground type; the
  partner beside the Keeper reacting by mood.
- **People (b4):** Fern's story look (cap, scarf, satchel) in both renderers; mood portraits; tale
  grade with young Hazel (c4-tale scenes); older Hazel from ch11; speaker rim and ring in 3D;
  separate-campaign departures at their memorial spots.
- **Places (c4):** hidden buildings drop their shadows and taps; five interiors (kitchen, guard
  house, Corvin's house, crest house, Fold house); the Beetle Road's below chapters on real Hollow
  floors with a story seed (save-safe, sim test), cast kept clear of floor props.
- **Sky and weather (d4):** the Hush walks with a fog band; depth of field on close/over shots
  focused on the speaker (off on phones); light shafts (3D only), cloud shadows, moon by chapter,
  snow building through the vigil (roof caps too), path wear, puddles, one wind uniform.
- **World detail (e4):** window figures, lantern streaks on water, crop plot by season, four lantern
  heads, rising lanterns, seasonal cottage decor, birds and moths, gate frost, the Logged In boot.
- **Story UI (u4):** keepsake inspector, a box skin per campaign, readable boards, the chapter
  photo with its grade, journal thumbnails, title-card silhouettes, the campaign map, the ending
  gallery.
- **Perf** (Full 3D, 390×844, 4× throttle, mean of two runs, before → after): Hazel ch10 60.1 →
  59.0, ch11 56.7 → 56.6, ch12 56.7 → 56.8, Hundred ch9 44.1 → 55.8, Logged ch7 39.3 → 56.2,
  Logged ch4 48.9 → 43.8 (run spread ≥8), Beetle ch3 48.6 → 56.3, Beetle ch1 50.1 → 48.9, Dawn ch1
  44.1 → 56.7; pixel Beetle ch3 and Hazel ch12 unchanged. Desktop Hazel ch12 3D 57 fps in the
  final shots.

**Stubbed or approximate**

- Fern's gate lines are not split out of `c1-letter` into a kitchen scene (needs the sim and the
  edu versions to change); no Corvin's-house or crest-house scene exists to stage.
- Pixel has no light shafts; coat tails don't read the wind (no coat geometry).
- The photo offer state lives in localStorage (UI convenience), photos in IndexedDB.
- The board's final words are still a placeholder.

**Known bugs (after the second review round)**

- Fixed or checked in the cg5 pass (PROGRESS.md, 2026-10-23) (Hundred ch9 debris, guard house, Logged In box and
  perf, Hazel ch10 and ch12 on phone, keepsake inspector, kitchen Fern, Beetle ch3 grade, minimap).
- Test suite: several sim/story-world tests time out under full-suite load and pass alone; watch
  the CI runner.
- No real-phone pass yet.

## Story review run 4 fixes (2026-10-22)

All 65 open or partial recs in `docs/story-review/LOG.md` applied (run 4's 64 plus run 3's -162).
- **Works:** 62 fixed. Learning Grove S19–S22 and S24, both bands: Moss's death said plainly on S19's Sable
  route, no quiz inside Cinder's last minutes, S20's blizzard and S21's eight Nubbins add up, Nova lives in
  the valley in S22 and S24 (main S24 too), Pixel and Byte married in S20/S21, the supper Nubbin. S24's
  kept-stone Nubbin lines now swap by each band's own line (`stillLine` in `story-scenes.ts`, test
  `tests/sim/s24-still.test.ts`); sprout used to get main's words and falls-top hit the wrong line.
- **Partial:** -179, -198 (lessons can't play after a scene's choices, so the asks sit at the scene end),
  -229 (S20's grudge exchange moved to where Wren and Gordon are already introduced).
- **Known bugs:** none. A cold first `npm test` run timed out 5 slow tests; a rerun passed all 731.

## Story review run 3 fixes (2026-10-22)

All 58 open or partial recs in `docs/story-review/LOG.md` applied (run 3's 53 plus run 2's 5 partials).
- **Works:** 57 fixed. Learning Grove S12–S18, both bands: plain, gentle deaths with comfort after
  (Aldous, the Queen-Mother, the owl chicks, Fossil), S15's Shells and division fixed, lessons moved off
  set-ups and grave beats, Pixel and Byte married in S12/S14/S15, the supper Nubbin, first-mention tags.
  Run 2's -72, -79, -80, -110 finished; -115 was already done.
- **Partial:** -162 (S15's replies were already in Byte's voice; only the wording changed).
- **Known bugs:** none. A cold first `npm test` run timed out 5 slow tests; a rerun passed all 728.

## Story review run 2 fixes (2026-10-22)

All 65 open or partial recs in `docs/story-review/LOG.md` applied (run 2's 60 plus run 1's 5 partials).
- **Works:** 60 fixed. The Multiverse's misnamed-Nubbin running gag and three bickering couples (canon 45),
  FF3 and IM9 choices that now change what follows, Doom's FF9 knee paid off in the FF epilogue; the Neopian
  Times Reporter across NP1–NP13 (canon 44); the Learning Grove S1–S17 fixes; c4-open's answer (`c4-lamps`)
  remembered in c10-dawn, c10-wisp naming Sable or Moss (`choice-payoffs.ts`, `story-scenes.ts`;
  `insertAfter` now takes per-band anchors like `spliceScene`). Tests added in `choice-payoffs.test.ts`.
- **Partial:** -72 (NQ27's optional Jhudora/Illusen side not built), -79 (no time machine named), -80 (Marlene
  stays back at the ridge), -110 (Pip still named in s15-wagon by a main choice), -115 (S8's elephant notice kept).
- **Known bugs:** none. A cold first `npm test` run timed out 3 timing tests; a rerun passed all 728.

## Story review run 1 fixes (2026-10-22)

All 60 recommendations of `docs/story-review/review-2026-10-22.md` applied (log: `docs/story-review/LOG.md`).
- **Works:** 55 fixed, 5 partial. New beats across the campaign, S1–S31, Q1–Q65 and the Learning Grove
  campaign; canon 38–43 (Pixel and Byte married, Marina's rules, Fern's pies, the skipping rhyme,
  Granny Brock, settled names: Hob in S27, Inspector Plimsoll in Q32, Mrs Tibbs, Frannie). Sprout
  cuts its unreachable keep-stone and sell scenes (exempted in `content-check.ts`). Q50 and Q65
  now require Q64. The c12-open garden splice anchors on its own reader-band line.
- **Partial:** -25/-28 (every real Learning Grove line is under its cap; the screenplay joins
  choice replies into one bullet, so the joined count stays high), -43 (the c4 pet stays in every
  branch, the chapter goal needs it), -53 (c6-close ask kept), -54 (c10-wisp says "the stone's
  bearer"; naming Sable or Moss needs per-route variants).
- **Known bugs:** none. Some content regions near the edits are now in Prettier layout.

## Campaign graphics 2, items 1–45 (2026-10-22)

Built from `docs/campaign-graphics-recommendations-2026-10-22.md` the same way as the first pass:
one orchestrator, wave 0 (foundation, Opus), seven packages in parallel (P people, K kits, W
winter and water, Y light and grade, U story UI on Sonnet; S sets and X occlusion and gate on
Opus), a content wave, shots and perf, and two review rounds with one fix round. Branches
`cg2/foundation`, `cg2/pkg-{p,s,k,w,x,y,u}` and `cg2/content` merged in `cg2/merge`. Agent rules
and API: `cg2-rules.md`, `cg2-api.md` (session folder, not in the repo). Shots:
`docs/samples/cg2-*.jpg`.

**What works**

- **Staging (wave 0):** new `SceneStage` fields (`exclusive`, `set`, `shot.then`, `shot.fit`,
  `lights.windows`, `item`, `hold`, `cast[].tint`, more `carry` and `props`); package overlays
  `config/scene-stages-pkg-*.ts` layered under the content files field by field (props and lights
  by key); `ctx.buildings` (hide/fade), `ctx.camera`, `safeRect()`; fit-to-focus inside the
  HUD-safe area, push-in on the first spoken line, the Keeper on its place mark, camera yaw chosen
  to see the speakers. H1: every chapter has a home location (`HAZEL_HOME`, `STORY_HOME`); a
  debug jump moves there and always replays the chapter opening.
- **People (P):** storyline speakers drawn as render-only stage actors with their own looks
  (`STORY_NPC_LOOKS`) and portraits (content-check fails a speaker with no look); grey Moss on
  the hill; speaker chevron (not on narration); festival ring; Keeper silhouettes; Hazel's patches;
  carry props.
- **Sets (S):** the Root Node white room and the Beetle Road's `below` cave (exclusive sets);
  Logged In's grid, holo board, egg glints and door.
- **Kits (K):** per-campaign `set` hides Grove-only buildings; Fold ruins mending by chapter, the
  Beetle lane, banners and cart, crest plaques and sundial, tally post and wreaths, campaign
  memorial spots.
- **Winter and water (W):** pond and stream ice in ch10–12 in both renderers, snow crowns and
  frosted ground, short frosted 3D grass, pixel Hush colossus, the Hush lantern ring and frost
  trail, the mill sluice, Corvin's backdrop foot.
- **Occlusion (X):** the lychgate (2 draws), round-hole fades, near-camera and frame-filling
  pieces hidden, pixel building fade over the cast.
- **Light (Y):** Logged In night with windows out, dark "out" lanterns in 3D, split-tone Dawn,
  `crisp` grade, dawn/dusk cues, the lantern string, the board's final message.
- **UI (U):** item close-up cards, chapter postcards (skippable), the chapter photo offer.
- **Content:** all 197 scenes of the four storylines and every Hazel ending staged.
- **Perf** (Full 3D, 390×844, 4× CPU throttle, mean fps before → after): Hazel ch10 56.6 → 56.6,
  ch12 56.6 → 56.6, Hundred ch9 47.5 → 43.6, Logged ch7 47.9 → 47.1, Logged ch4 45.8 → 49.7,
  Beetle ch3 46.9 → 52.1, Beetle ch1 45.5 → 51.2, Dawn ch1 55.0 → 49.4. No scene under 30;
  run-to-run spread was 5–8 fps; draw calls unchanged at Dawn ch1.

**Stubbed or approximate**

- C4 uses the `below` set in the Grove, not the real dungeon location.
- Stage actors hold a static pose (no sit or kneel); hidden 3D buildings still cast shadows and
  stay pickable.
- The board's final words are a placeholder in `tuning-y.ts`.
- The chapter photo is the canvas only (no DOM grade layers); the offer isn't saved.

**Known bugs (after the fix round of 2026-10-22, `docs/samples/cg3-*.jpg` before and after)**

The nine defects the second review left are fixed: the Hush is a hooded figure (sRGB card) and
the Fold's windows go out with the faster lamp ring; the occluder's hide box takes a roof's whole
reach, the gate and package k's Fold pieces, and side-edge clutter (no dangling gable, no giant
roof); a hidden well takes its water (no dark disc); Hazel ch10 fits the iced pond
(`pond-centre`, kept whole when nothing else fits); Fern is cast at the gate (a stage actor when
you wear her look); the chevron clears while a postcard holds a line; pixel push-ins and close
shots use a story-only 64 px step; Hundred ch1 frames the gate and Ida, and pixel dojo ruins are
cut from the cottage; Hob stands at a new counter; two-shots never look along the pair, and the
twin stands off the sundial (`green-twin`).

- Hazel ch9's narration chevron did not reproduce in headless Edge; the stale-speaker path is
  fixed but unconfirmed.
- Hazel ch10 3D: the floating fence rail did not show once the shot fits the pond; not traced.
- On a phone held upright, Hazel ch10's pixel shot keeps the pond whole and loses the Keeper.
- Fern as a stage actor wears the Gardener look, so in 3D she matches a Gardener Keeper.
- The Fold keeps its mill and water wheel by design (`stage-sets.ts`); the reviewer flagged them.
- Ida's line in Hundred ch9 still has a roof cut by the bottom-right edge (not nearer than the cast).
- No real-phone pass yet.

## Campaign graphics, items 1–50 (2026-10-22)

Built from `docs/campaign-graphics-recommendations-2026-10-21.md` by one orchestrator and a
set of subagents:

- **Wave 0, the staging foundation:** Opus.
- **Six packages:** A (light) on Opus; B–F on Sonnet.
- **Content:** Sonnet.
- **Screenshots:** Haiku.
- **Perf:** Sonnet.
- **Review:** Opus, two passes plus one round of regression fixes.

Branches `cg/foundation`, `cg/pkg-a..f` and `cg/content` were merged in `cg/merge`. Final desk shots
are in `docs/samples/cg-final-*-desk-*.jpg` (both renderers; the phone and reduced-motion
sets were checked but not committed). Each package's shots are in `cg-<pkg>-*`.

**What works**

- **Staging.** `Scene.stage` (`SceneStage` in `config/story.ts`) holds place, hour, season,
  weather, cast marks, shot, props, lights, fx and grade.
  - Scenes are staged in `config/scene-stages*.ts`: 159 of them, covering Hazel's Grove and
    every storyline chapter's opening and close.
  - The marks are in `config/stage-marks.ts`. The resolver and `stageFlags` are in
    `render/scene-stage.ts`.
  - Both renderers read the stage. Pixel now stages the hour and pans to the scene. 3D has shot
    types and frames speakers above the dialogue box. Phones get a capped portrait framing,
    and their HUD buttons hide during dialogue.
- **Dressings.** Registries live in `render/dressings.ts` and `render3d/dressings.ts`. Each
  package's code is in `dress-<pkg>.ts`, and its numbers are in `config/tuning-<pkg>.ts`.
  - **A:** a readable 3D night with a raised floor, a night rim and a story key. Bloomed glass,
    a luminance-keeping Sun and Moon tint, a skyline ring, and the sight-line occluder fade
    for buildings and crowns.
  - **B:** the gate (shut, open, overgrown), the ruined Fold mending by chapter, the four crest
    houses of Dawn & Dusk, the jetty, and the mill wheel. The wheel stands in the Grove and in
    the corvin set.
  - **C:** Corvin's garden (frost, backdrop, house, gate, swinging pens, numbered Nubbins), the
    Hollow camp, and the hill (path, flat stone, crest, Briar's flower). Also the falls,
    stone and water effects, breath, and footprints.
  - **D:** kit-built story props (`prop-kit.ts`), item glints (a still star under reduced
    motion), the step vignette, the signpost letter, the keepsake shelf
    (`config/keepsake-looks.ts`), the shrine and bell, benches, and boards.
  - **E:** named lantern states and the vigil waves, hand lanterns, NPC silhouettes
    (`config/npc-looks.ts`), Moss sitting, and the Hush.
  - **F:** `CAMPAIGN_LOOK` grades and chapter title cards, staged season and weather (winter
    trees, frost rime), the ch12 festival, the Logged In set (`props.loggedSet`), the Beetle
    Road guard house and the `beetle-below` grade with torches, plums and wasps, the story race
    dressing, and the picnic.
- **Perf.** Measured at 4× CPU throttle, phone viewport, Full 3D. ch9, ch10 and ch12 hold
  54–57 fps, the same as origin/main. Beetle ch1 averages 37–40 with dips below 30 in both
  builds, so that is not a regression.

**Stubbed or approximate**

- **Moss's sit** uses the sleep pose, so his eyes are shut and the 3D Zzz shows. A real `sit`
  pose needs a species change.
- **3D hand lanterns** hang at a computed hand offset; they aren't attached to a bone.
- **Pixel winter** is a canopy tint plus snow caps, not new tree sprites.
- **H18's grade and H1's tint** are a DOM overlay rather than part of `post.ts`. It hasn't been
  tested on a real phone.
- **The Beetle Road's "Hollow Below" scenes** play in the Grove under the `beetle-below` grade.
  Showing the real dungeon would need a sim location change.
- **The Hundred Days' mill chapter** plays at `corvin` (`storyline-rules-hundred.ts`), so the
  wheel is drawn there as well.
- **`c8-open`** is staged at the gate at first light. Beginning ch8 moves the sim to the
  Hollow first, though, so it plays there.

**Known bugs**

- **Reviewer items not re-checked after the last fix round:**
  - Dawn & Dusk houses at phone size, where only two are fully in frame.
  - The Logged In and Dawn & Dusk c3 framing after the occluder change.
- **3D "out" lanterns** still get their lamp-pool light and ground spill. The host builds those
  sources itself.
- **After a debug chapter jump,** the pixel camera may stay on the Keeper for scenes with no
  focus mark.
- **Pixel snow caps** read as pale dithered ellipses over the trees; they need painted snow.
- **Dawn & Dusk in the pixel view:** in the final c1 shot, the four houses still sit under the HUD at the top edge.
- **No real-phone pass yet.**

## Hollow Below art pass, items 1–45 (2026-10-21)

From `docs/hollow-graphics-recommendations-2026-10-21.md`. Agents A–H on `art/hollow-{a..h}` (plus
`c0`, the split), merged as `art/hollow`. Before and after: `docs/samples/hollow-art-before-after.jpg`.
Numbers in `DUNGEON` (`genVersion`, `layout`, `elev`, `water`, `crossing`, `vista`, `landmark`,
`special`, `explore`) and `GROVE3D.cave` (`bands`, `light`, `atmos`, `rock`, `dress`, `read`, `pixel`).
Works:
- **Layout (sim):** version-2 floors (`sim/dungeon-gen.ts`), 48×34 growing to 72×48, a great chamber,
  medium and small rooms, terraces and a pool basin (`Floor.elevation`, `elevationAt`), a landmark
  (5 kinds), vistas, bridges and stepping stones, the chest nook, rare special floors (crystal,
  flooded, glow-worm), an explored mask on the run. `DungeonRun.genVersion` keeps saved runs on
  their old floors (version-1 fingerprint test).
- **3D:** `hollow.ts` is assembly only; modules `hollow-rock` (tall leaning walls, triplanar,
  strata, edge wear, moss, wet sheen, a texture per band, floor on elevation, chunked vertex-colour
  bake), `hollow-light` (sconces with flame and halo, unlit sconces to light, instanced
  crystals and mushrooms, baked light with flicker, lamp cookie), `hollow-dress*` (landmarks,
  rounded stalagmites, arches, rails and cart, portal stairs, decals, worn path, roots and berries,
  murals, vistas, bridges, nook, crystal chimes, instanced loot), `hollow-atmos` (shafts, motes,
  water glow, drips and ripples with sound, basin fog, glow-worm stars, glow-bugs), `hollow-pop`
  (loot halos, explored-room glow). Light rig from `bandFor(depth)` (`render/cave-bands.ts`, four
  bands), bloom always on underground, cave vignette, exactly 4 point lights (`cave-lamps.ts`).
- **Governor:** underground it sheds particles, then triplanar, then bloom, aiming at 55 fps
  (`cave-shed.ts`, `GROVE3D.cave.light.governor`); render scale still only guards 30 fps. No sun
  shadow pass underground.
- **Pixel:** walls about 2.6× taller with strata, a moss lip and sconces, a sinking strip in front
  of the Keeper, band colours on floor and walls, dust, drips and embers (`render/cave-ambience.ts`),
  all five landmarks, vista lips, terraces as tone steps.
- **UI:** minimap (`ui/hollow-map.ts`): a 44 px Map button in the floor bar, M toggles, Escape
  closes, shapes and a legend for the Keeper, stairs and chest.
- **Bugs fixed on the way:** 3D drew every Nubbin underground (now the party only, like pixel); emote
  sprites wrote depth over their whole quad.

| 375×812, 4× CPU throttle, 8 Nubbins, dev server, 10 s windows | origin/main | art/hollow |
| --- | --- | --- |
| Full 3D (great chamber after; start room before) | 45.9 / 44.8 / 41.5, 45.5 / 44.6 / 47.3 | 51.7 / 50.3 / 50.2, 54.0 / 54.7 / 54.8 |
| Pixel | 56.6 / 56.6 / 56.5 | 56.7 / 56.6 / 56.6 |

Stubbed or short: 3D misses the 55 target by about 2 fps at 4× throttle, and holds it only with
particles, triplanar and bloom shed (unthrottled, everything comes back); the next lever would be
shedding creature outlines underground, an art call for Maor. The environment is 49 draw calls in
the great chamber (the cave's own meshes about 32, the rest scene and post passes). The pixel floor
paint still runs on the main thread (about 420 ms on floor 1, up to 800 ms on 72×48). Pixel crystals
are not taller; pixel landmarks do not take the band colours; a sconce lights when the Keeper
walks up to it, not on the tap itself; the falling drip streak is brief and easy to miss. Known
bugs: the 3D light-shaft foot can end in a hard line at a wall; the pixel sinking strip has an
angular top. Not checked on a real phone.

## Review D fixes (2026-10-21)

From `docs/review-independent-2026-10-21.md`. Branches `fix/review-d-{sim,core,ui,3d,bundle,docs}`
merged as `fix/review-d`. Works (sim items tested):
- **Sim:** end-of-life checks wait while the away screen is up, then run one at a time 4 s apart
  with an `endOfLifeFocus` event the camera follows (bug 1); Eternals never degenerate and a
  reverted adult gets no second upgrade (4); catch-up fruit uses the live interval (36); saved
  Keeper intents are cleared and never run in catch-up (37); Normal critters and essences add
  Normal lean (38); symmetric alignment rounding (39); debug evolve and end of life (40);
  `joinTeam` once (41); side stories honour Mature content; lantern posts are obstacles and
  NPCs hold still while a scene is queued.
- **Core:** saved ground painted on load and on import/reset, which also resyncs the Hollow (5);
  the loop restarts after a hidden-tab catch-up (6); pointer capture, pick slop and grab cursor
  (9); the Graphics pick survives blocked storage for the session, and the Settings switch says
  why it can't reload (13); shake and CSS animations follow the in-game reduced motion via
  `html.reduce-motion` (42); audio suspends while hidden (43); fullscreen and service-worker
  cache writes are caught (44); global error watch with a gentle toast (46).
- **UI:** clearer "hatch first" toast (7); language steps complete from their scenes and the
  friend arrives before Chapter 1 (8); bugs 18, 20–35 and the UI half of 40; every control at
  least 44 px; phone Close/Leave buttons at the bottom of the panel; toasts clear of headers;
  the docked desktop sheet aims the camera past itself.
- **Full 3D:** framed shots on hatch, evolve, cocoon and rebirth with posts and trunks thinning
  (10); campaign scenes framed with the speakers, NPCs held and the hour taken from the
  narration (11, `render3d/staging.ts`); a lit Hollow with emissive stairs, chest and loot (12);
  a real memorial flower (14); kit buildings (15); a side-on race (16); gold shells and solid
  wing films in the Expedition (17); a 3D photo portrait (19); Hollow materials cached (45).
- **Load:** each Learning Grove band is its own chunk (a sprout slot needs about 1.3 MB gzip
  before play, was 4.0 MB); a Free Grove with no story boots without waiting for story chunks.
- **Rules:** CLAUDE.md, `docs/brief.md`, `docs/canon.md` (22), `docs/content-index.md`,
  `STORY-BIBLE.md`, `plan.md` and the backlog prompt now allow daily refreshes and free daily gifts.

Gate: lint clean, 623 tests (11 skipped), build. Headless Edge at 1280×800 and 375×812 in both
modes: no console errors except three's own PMREM shader warning on D3D11 (bug 48; it comes
from three.js, left), no control under 44 px. Stubbed: no gate model, so Corvin "at the gate"
can't be staged; scenes carry no `set`/`time`/`at` staging data (3D reads the hour from the
narration); buildings don't fade as occluders; Klee One tracing alignment was checked with a
fallback font only. Known bugs: bugs 2 and 3 stay by decision. Not checked on a real phone.

## Full 3D art push 2: Hollow, buildings, sky, particles, rain (2026-10-19)

Branch `art/3d-pass-2` (off `art/3d-flagship`, not merged; ask Maor before `main`). Before and
after: `docs/samples/art3d-pass2-before-after.jpg`. Numbers in `GROVE3D.cave`, `.sky`,
`.heightFog`, `.rain`. Works:
- **Hollow (`hollow.ts`):** rock blocks bent by a world-space noise (shared corners move
  together, so no gaps) and flat-shaded, the rock texture laid on from the world position, moss
  on the tops; an earth floor darkened where it meets the rock; loose stones and spikes along
  the walls; pools in the painted water with a foam shore. Walls between the camera and the
  party now sink and rise smoothly instead of snapping.
- **Buildings and props (`building-kit.ts`, `props.ts`, `village.ts`):** bevelled walls on
  stone plinths, timber corners and eave bands, roofs with real overhangs, ridge caps and barge
  boards, framed windows with sills and painted shutters, framed doors with a step, a cottage
  chimney. The well has a turned rim and a windlass. The windmill has a footing, door, window
  and lattice sails; lanterns are framed, the bridge is planked and railed, the cave mouth is
  an arch of stones. All of it is toon-lit like the creatures, smooth pieces outlined (one
  shared hull), merged by material (Grove draw calls 207 → 195). Pools of lamplight spill on
  the ground at night (`buildSpills`, one additive mesh).
- **Sky (`sky.ts`):** a painted dome in place of Preetham: a horizon-to-zenith gradient per
  hour (day, golden, night, rain), a sun disc and halo, a two-tone cloud layer that drifts, and
  stars. The PMREM warm-up is kept (same material in the bake scene). Height fog is patched
  into three's exp² fog chunks (Grove and stage samples only). The fog takes the horizon's
  colour. Golden hour is warm and bright, no longer muddy red; env fill was raised to match the
  darker painted map.
- **Particles (`quad-particles.ts`):** one instanced-quad program for everything, with analytic
  shapes, rotation and soft fade, and additive and normal particles in one draw:
  - bursts (one draw, was three) and falling leaves tumble;
  - tap sparkles are stars;
  - rain streaks and snow fall in the vertex shader (no per-frame CPU loop over 2,500 points);
  - fireflies glow and wander on the GPU.
- **Emotes (`emote-vector.ts`):** vector frames at 128 px with mipmaps. Pre-existing bug fixed:
  the emote sat 0.48 above the head bone, inside the head, so the depth test hid it; it now
  floats above the creature's height.
- **Rain:** grade tint 0.96/0.98/1.02 (was 0.85/0.9/1), saturation 1.1, a clearer blue-grey
  fog, sun 1.05. It reads as wet, not washed out.
- **Waterfall (filmed this time):** it was a pale sheet hanging through the air (pass 1's
  unverified item). It is now a cascade ribbon that hugs the hillside into the stream, with
  the grass kept off it (grass checksum updated in `tests/render/grass-place.test.ts`).
- **Numbers** (headless Edge, `vite preview` production builds, 375×812 at 4× CPU throttle,
  10 s windows, interleaved, three pairs on the final build): day 51.5 → 53.0 fps, zoomed out
  37.7 → 48.3, night 43.8 → 47.7. Run-to-run spread is about 10 fps. Earlier builds of this
  pass, 8–14 runs each, gave day and zoomed out flat and night about 3% down; the final
  build's partial uploads for particles are in the numbers above. 583 tests, lint and build pass.

Stubbed: the cave's walls fade by sinking, not by dithering; the night spills are all on or all
off (a single lit campaign lantern lights its glass but not its pool). Known bugs: none new.
Not checked on a real phone. The minigames' `GroveSky` gets the painted dome too, but it is not
filmed there.

## Full 3D art push 1: toon creatures, ground, water, governor (2026-10-18)

Branch `art/3d-flagship`. Before and after: `docs/samples/art3d-before-after.jpg`. Works:
- **Toon creatures:** the Grove's rigs build with the line-up toon bands (`GROVE3D.toon`):
  - a stepped light rim;
  - a share of the sky's diffuse light (without it they went near black);
  - no sun shadow on themselves (speckle at this scale);
  - screen-sized outlines on parts of 2,500+ triangles (`render3d/toon-outline.ts`, one
    shared hull material).
  `surfaceMaterial`/`toonMaterial` now carry `customProgramCacheKey`: toon and physical shared
  one program before.
- **Light:** the sky map is soft fill (0.38 by day, was 0.7, which washed the meadow mint) and
  the hemisphere carries the fill (0.6). Night has more moon and fill, exposure 0.6.
- **Ground and foliage (`aaa-kit.ts`, opt-in so the stage samples keep their look):**
  - the meadow is painted toward lush and dry greens with an anti-tiling second sample
    (`GROVE3D.terrainLook`);
  - tufts are dark at the root, lit like the ground, and sink away 34–46 units from the
    camera (`grassFade`);
  - the field frays over its last 5 units (grass golden hash updated);
  - canopies shade as rounded masses and sway in the wind; crowns.ts chains its dither
    after that patch.
- **Water (`render3d/water.ts`, rewritten):** unlit painted shader on fine grids that carry
  the bed's depth:
  - turquoise to deep blue, with foam tracing the real shoreline;
  - procedural ripples with stepped crests, a sky fresnel and a hard sun spark;
  - the stream gets its own thin foam, and the waterfall has its own falling streaks;
  - the race's swim strips use it too (`paintedWater`, `channelGeometry`, opaque).
- **CPU:**
  - Ground height is now a lazily built 0.25-unit tile grid (`terrain-shape.ts`). The exact
    sum, which had been 20% of a throttled frame, now only builds the mesh and the grass.
  - The governor steps through CPU savings once fewer pixels stop helping:
    1. outlines;
    2. the second grass pass and bloom;
    3. shadows every fourth frame.
    Savings come back before sharpness, and one that was needed stays.
- **Numbers (headless Edge, GTX 1080, 375×812 at 4× CPU throttle, two 10 s runs each, main →
  this):** day 44.6/40.1 → 53.7/51.4 fps, zoomed out 42.2/42.5 → 44.7/43.1, night
  46.7/42.5 → 49.7/47.3. Desktop holds 57 (headless cap). 583 tests, lint and build pass.

Stubbed: the waterfall was not filmed close up (its streaks and foam are unverified on
screen); rain still greys the grade; the Hollow, buildings, props, sky and particles are
untouched (next passes); visit-set trees do not sway (no clock there). Known bugs: none new.
Not checked on a real phone.

## Review C, the ten major bugs (2026-10-18)

From the Major section of `docs/review-independent-2026-10-18-c.md` (each item has an
"Addressed" note there). Branch `fix/review-c-major`. Works:
- **Service worker (1):** registered straight from `boot()`; hashed `assets/` chunks
  cache-first, the shell precached with `cache: 'reload'`. Built site, fresh profile: one
  active registration after starting a slot, offline reload opens the title.
- **Share codes and loop (2):** a code must pass `nubbinProblem` (name capped at 16);
  Receive is hidden in the Learning Grove; `deserialize` runs `importProblem`, so a broken
  save goes down the unreadable path; a frame that throws keeps the loop alive, stops all
  saving and shows a Reload card (`showCrashCard`).
- **Reset (3):** `sim/fresh-start.ts` restarts the slot's own mode (campaign or storyline
  with the same Keeper, Learning Grove age and band); the debug reset asks first.
- **Gate (4, 5):** erasing or starting over a Learning Grove slot on the title asks the gate,
  which now opens above the title; the gate asks a two-digit × one-digit product
  (`GROWN_UP_GATE`), new numbers after a miss, and a held Enter.
- **Full 3D frame rate (6):** four pooled night lights (`render3d/lamp-pool.ts`, light set
  `groveNight`), four in the Hollow; no transmission in the game (water, lantern glass,
  cocoons, wings and dew stripped in the pool); one `FinishPass` for clamp, tone map, sRGB
  and grade; `FrameGovernor` (render scale, undoes a step that buys nothing); face parts cast
  no shadow (`casterMinTris`); half-rate shadow map under strain; cached ground heights.
  375×812, 4× CPU throttle, 8 Nubbins, headless Edge, dev server: Grove 38 fps, race 35,
  night 39, Hollow 42 (origin/main: 18–23, 23, 27, 22).
- **Pixel colour (7):** half-float scene target and the sRGB encode in `render/post.ts`; day
  light lifted (`PIXEL_LIGHT`). Shots `docs/samples/review-c-colour-*.jpg`.
- **Collection book (8):** `coarseStep` records hatches, evolutions, rebirths, Eternals.
- **Well-raised bonus (9):** never the stat `evolve()` just raised.
- **3D Hollow (10):** walls between the camera and the party cut to stubs; shaded stone
  blocks. Shot `docs/samples/review-c-hollow-before-after.jpg`.

Stubbed: the governor only scales pixels and shadow cadence; it does not drop grass, SMAA or
creature detail, and the zoomed-out 3D view (13 fps in the review) was not measured. The
first visit caches hashed chunks only from the second load on (the worker takes control
then).

Known bugs: none new. Not checked on a real phone; frame rates are from headless Edge with a
CPU throttle on the dev server. Review C's minor items 11–29 are fixed in the pass below.

## Review C, items 11–29: minor bugs (2026-10-18)

From the Minor section of `docs/review-independent-2026-10-18-c.md` (each item has an
"Addressed" note). Branch `fix/review-c-minor`; the majors (1–10) are a separate pass. Works:
- **Sim (tested in `tests/sim/review-c-minor.test.ts`):** catch-up runs after the HUD is bound,
  in chunks that yield a frame (`catchUpInChunks`, `Game.catchUpOnLoad`), so its indicator
  paints; no steps or saves until it ends (12). Every mode stops at 30 days (`SIM.maxAwayMs`);
  a save without `savedAtWallMs` has no gap (13). Live play keeps the live rules past 400 steps
  a frame: the backlog runs as fine steps later, time past 2 sim minutes is dropped
  (`Clock.capBacklog`) (14). Catch-up hatching uses `hatchSpeed`; `raceResult` checks course
  and open tier, caps Shells at the prize, never repeats a hat; the race seed is
  `raceSeedFor(world, course, tier)`, fixed until a result is recorded (`World.raceRuns`) (28).
- **UI:** blocked storage shows on the title and as a HUD chip (11); pixel minigame canvases
  sit below the ✕ row (`minigames/play-area.ts`) (15); festival toasts wait for story scenes,
  the away screen opens before any scene (16); the stats sheet docks right on wide screens,
  lifts the camera on phones (`Game.cameraLift`, `CAMERA.sheetLift`) and shows level bars and
  "+N" gains (22); 🧭 Expedition, Keeper picker blurbs (`KEEPER_LOOK_BLURBS`), "Back" label
  (23); Receive dialog, hidden in the Learning Grove (24); Erase labels name the mode (25);
  44 px hat select, field inputs, map buttons (26); Escape for the shelves, Hollow menu and
  party bout, one co-op handler, font retry (27).
- **Render:** draw calls sum every pass (`autoReset` off) (19); 3D run and stretch sections are
  dirt/cobble with chalk lanes (20); a wild-wood skirt past the pixel field, and 3D crowns thin
  only in a circle round the Keeper (21).
- **Content:** sprout egg-hum lines fixed (17); readers (7–10) play Sums, Spelling and Rhymes &
  beats (`minigames/edu/reader-games.ts`, `EDU_READER_*`), preschool games hidden (18).
- **Tests:** the every-Atlas-page test loads its chunk in `beforeAll` (60 s) (29).
- **Checked** in headless Edge (playwright-core) at 1280×800 and 375×812: sheet, gains,
  minigames in both modes, far zoom both modes, crowns, title and HUD with storage blocked,
  Keeper picker, reader picker and a Spelling round, Receive.
- **Assumption:** the 30-day cap also applies to `indefinite` (the brief says "all the time
  that passed"); the away report still shows the real gap.
- **Stubbed / known:** the 3D tag overlap (20) did not reproduce; the stacker was left as is.
  The Learning Grove still shows the season festival toast.

## Review B, Bugs 18–38 and the notes: minor bugs (2026-10-18)

From the Minor section and "What the notes get wrong" of `docs/review-independent-2026-10-18-b.md`.
Branch `fix/review-minors`, rebased onto the Bugs 1–17 merge. Works (sim items tested):
- **Sim:** memorials keep `band:type` / `eternal:band` (`memorialForm`; old `:` forms dropped
  on load) (18). Fun quests wait for the first hatch and chapter 2 (21). Moss keeps to his
  seat on the western hill, off the roster and its cap, until `c7-stillness` and room bring
  him down (`mossOnHill`, `rosterNubbins`, flag `mossDown`); story Nubbins are never traded;
  a campaign restart no longer doubles him (23, 24). Expedition rewards always hold the
  Shells so far (32). `gatherReadyMs` lives in the world (34). The clock keeps remainders
  under a coarse step (`takeOverflowMs(unit)`) (35). Loads coerce inventory counts, refuse a
  junk clock, and `setSettings` keeps a valid cap (`sanitizeOfflineAging`) (36).
- **Story:** quest speakers show their declared names (`speakerNameIn`: owning quest, family,
  any quest) in the Grove and the Atlas; content-check fails an unmapped `who`, including
  Learning Grove scenes and variants (20). Keeper looks are named for the look (Gardener,
  Tide-pooler...; `KEEPER_LOOK_NAMES`), the You portrait wears your side-trimmed outfit, Ori
  and Hana have their own looks (22, 30). Japanese writes long i as ii (ojiichan); the
  primer adds the six katakana of ピンク and オレンジ; the Hebrew trace goal names its two
  letters (31).
- **UI:** debug chapter buttons read "Ch 1"…"Ch 12" (26). The 3D race looks down at 38° over
  1.5-unit lanes, so every racer and tag is clear, and runs on real time up to 1 s a frame
  (27). A Graphics change returns to the same slot (`markResumeSlot`) (28). A reader slot
  says "Age 7–10" (29). Learning Grove: no keyboard hint, the grown-up sum before Settings,
  Hebrew set larger than its romanisation (30). Another tab writing the slot stops this
  tab's autosave with a notice; storage that recovers warns again (33, 37). "(M4)" gone (19);
  canvas label "The Grove", distinct slot button names, settings boxes stay 22 px (37). The
  narrow-band sculpt test has a 30 s budget (38).
- **Notes:** CLAUDE.md (3D location, test count, current plan, no-chores wording), plan.md
  (count, Atlas row, G12, phone view, Waiting on Maor, CV6 row), `docs/brief.md`; `CREDITS.md`
  with the licence texts deployed from `public/licences/`. The sw.js comment was fixed with
  Bug 2.
- **Checked in the browser pane** (hidden pane, frames driven by screenshots): the 3D race at
  1280×800 and 375×812 (`docs/samples/rb-race-3d-*.jpg`), Settings at 375 (`rb-settings-375`),
  Hebrew and Ori (`rb-hebrew-ori-1280`), the Fern and You portraits, the Learning Grove gate
  and hint, the Graphics reload, slot labels and the Keeper picker.

Stubbed or not done:
- Bug 25 did not reproduce here (1280 and 375, ×1000, panel open: the scene keeps taking
  taps); a comment keeps the debug panel out of the wait list. Race results already closed
  on Escape in both modes; not reproduced either.
- The You and the villager's sprites differ only in trim colours; a stronger difference is an
  art call. The Learning Grove settings gate is per tap, not remembered.
- The parent folder's stray `CLAUDE.md` (outside the repo) still says "Open decisions: none".

Known bugs: none new. Assumption: Moss "comes down" in `c7-stillness` (the scene that says
so); before then he is the hill's watcher, as chapter 1 describes.

## Review B, Bugs 1–17: blockers and major bugs (2026-10-18)

From `docs/review-independent-2026-10-18-b.md` (each bug there has an "Addressed" note).
Branch `fix/review-blockers` was checked and merged (main's stricter import kept: an imported
save always comes back with Mature content Off). Works:
- **Away and lifecycle (sim, tested):** fine catch-up steps follow the away rules, so no
  departure while departures are off, for any gap (Bug 1). Alignment is kept and compared in
  hundredths (`roundAlignment`): exactly ±0.80 is not Eternal, ±0.50 is Neutral (5). Normal lean
  can win the adult type (6). Catch-up logs care slips (rain aside), the well-raised grade is in
  `gradeUpgrades`, rebirth clears `wellRaised` (7). Lifetime happiness is weighted by sim
  seconds (`sampleHappiness(n, seconds)`), so an hour away weighs an hour watched (8).
- **No chores (3):** each request kind is asked once (claimed ones stay on the board as done);
  team missions run once each, in order (`TEAMS.missions`); the Hollow request counts any
  descent. `questDay` and `TeamState.week` are kept unused so old saves load.
- **Loading (2):** per-build service worker cache, network-first pages, old caches deleted;
  every lazy chunk has a catch and the "Reload to update" notice, the shelves included.
- **Mature gate (4):** raising Mature content asks the grown-up sum gate first.
- **Story worlds (9):** the shelf passes a frozen copy of the campaign flags as
  `LineContext.grove`; `variantFor` matches Grove answers, chained suffixes (`-ran-unset`),
  `GROVE_UNSET` (A19 sableFirst) and `GROVE_ALIASES` (s21Done → clank, s8Reunited → fern...).
- **UI (10–17):** trade shows the code in a dialog and sends only from its own button;
  `input/keys.ts` keeps camera and shortcut keys out of fields and Space on buttons; sound
  unlocks on pointerup/touchend/click/keydown from the title on and resumes after
  interruptions; WebGL2 check, renderer try/catch and a context-lost card (Reload, Switch to
  Pixel); creature pool LRU (`GROVE3D.poolSpares`/`poolLooks`), garden and visit disposal;
  Reduced motion reaches both cameras and Pixel water/sway; `.btn-small` is 44 px and phone
  portrait has a bottom action bar (`--hud-bottom` lifts the bottom HUD); `dialogFocus` in
  `ui/dom.ts` gives every modal role, focus, trap, Escape and focus return.
- **Checked in the browser pane** (hidden pane, frames driven by hand): both modes at 375×812
  and 1280×800, dialogs, typing, trade, Reduced motion, the lost-context card.
- **Stubbed:** story-world inserts ("plays straight after"), once-only margin notes and derived
  Grove facts (campaign finished, Sable's trust, mossFaded) are not wired, only replacement
  variants. Sound on a real iPhone, WebGL2-less devices and the pool caps under a long session
  are untested. Minigame result cards are not dialogs yet.
- **Known bugs:** `tests/sim/side-saves.test.ts` "every Atlas page" can pass its 5 s timeout
  under a full parallel run (cold transform; passes alone in about 1 s).

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

## G17: 3D Expedition and races (2026-10-17)

In Full 3D the Expedition and the races draw in 3D; Pixel is untouched. Each screen now
owns only its flow and hands frames to a view: `minigames/expedition/view.ts` +
`pixel-view.ts` (the old drawing, moved) and `render3d/expedition-3d.ts`; the same for the
race (`minigames/race/view.ts`, `pixel-view.ts`, `render3d/race-3d.ts`). `selectMinigameView`
(`render3d/minigame-layout.ts`, pure, tested with the track and camera maths in
`tests/render/minigame-3d.test.ts`) picks 3D only when `settings.graphics === '3d'` and the
scene is loaded; the 3D views are lazy chunks (about 20 kB, `expedition-3d`, `race-3d`,
`minigame-stage`). `render3d/minigame-stage.ts` is what both stand on: the Grove's renderer
drawing into the game canvas under a see-through overlay, `GroveSky`, the painted
`terrainMaterial` strips, `buildTree`, `buildGrass`, `Bursts`, rigs from the shared
`CreaturePool` (the player as its real look, rivals as `first-<band>-<type>`), the Grove's
post chain less bloom. Tunables `EXPEDITION3D` and `RACE3D`; strings `stageLoading`,
`SECTION_LABELS`. Screenshots `docs/samples/g17-*.jpg`.

Works: chase camera framing `height` world units top to bottom (`frameCamera`; the lens
widens in portrait to `minSpan`), so the runner is about a sixth of the screen; a
screen-space gradient backdrop (the Preetham dome only lights the scene); parallax hill
rows, a recycled tree ring and tiled grass behind the runner, ground reaching past the
frame; shells, essences, critter bubbles, rocks, logs and bushes as props; the rig walking
and hopping with the gait clock, hit blink, dust and sparkle bursts and a camera kick (off
under reduced motion). Race sections as grass, worn earth, a sunk water channel, a rock
gully to fly over and a rock ramp that stays up, all on painted earth skirts and walls
down past the frame; signs that slide to stay whole on screen; finish posts and banner;
name tags and section signs laid out each frame against the camera so no two screen
rectangles intersect (`stackTags`, projected and measured in pixels, two passes);
the player's stamina bar; rest as the sleep pose; cheer sparkles; the camera leaning
toward the leader but keeping the player in the left half. Rival rigs are discarded from
the pool when a race ends (`CreaturePool.discard`). Frame times on Maor's PC, hand-driven
frames with `gl.finish` (polish pass): Expedition 1024x640 p50 1.7 ms / p95 3.3 ms,
375x812 (563x1218 backing) p50 1.4 / p95 2.3; race (6 rigs) 1024x640 p50 4.2 / p95 5.1 to
6.9, portrait p50 3.6 / p95 4.4. Exit frees everything the stage made (checked at the GL
level with a `createTexture` hook: nothing survives a cycle); geometries settle across
repeated races. No console errors.
- **Stubbed:** no toon outline pass (the Grove has none either); the minigame water has no
  refraction (a transmission pass leaks a full-size target per camera in three 0.186 and
  doubles the draw); no Zz over a resting racer; the Expedition's Hollow theme is only the
  night gradient; the emote ball does not ride along.
- **Known bugs:** `renderer.info.memory.textures` reads one higher after each minigame
  (a target disposed before its first upload; no GL texture leaks); a tag of a racer just
  off the screen's edge clips there; the sky's environment target is now disposed in
  `sky.ts` (it was never freed before).
- Device numbers are PC only; the G11 phone pass still owns the 60/30 fps check.

## Canon audit and fixes (2026-10-17)

Audit report `docs/logs/review-canon-audit.md` (report mode, whole canon; Maor's decisions in its
section 9). Fixed: the Multiverse (one signature choice per line paid off in 3+ later quests,
`MV_*_VARIANTS`; Nubbin lines in MK/SP narrated) and Neopia (`np-05-stance` pays off in NP9,
NP11, NP13; NQ flags read in their own completes; the faerie side/colours rewards split into
one key per chain, `neo-side-*` / `neo-colours-*`); PA1 is `all` with childLines and new
`edu-pa1-sprout.ts` / `edu-pa1-reader.ts`; S24's speaker is `augusta`; the separate campaigns
are SL1–SL4; the hive's S26 return is now canon (canon 17/31, bible, brief); Moss's Hush
memory is told new in S26 and S30; the minor tone and repetition fixes from section 4.
New variant arrays are exported from `src/content/index.ts` and covered by content-check.
- **Stubbed:** no sim catalogue plays the Multiverse or Neopia variants yet; when CV6 builds
  it, pick variant arrays per line (two files carry two each), and note `variantFor` matches
  bare flag values (three MV signature values were prefixed to avoid clashes).
- **Known bugs:** the two older test failures are fixed (2026-10-17): the sprout band now
  splices the walled garden after its own "Gran Hazel walks" line (`spliceScene` takes a
  per-band anchor), and the childLines test hides edu copies to exercise the fallback. About 16 lines in
  `storyline-*.ts` exceed 160 characters; content-check does not cover the storylines.

## G12 writing pass: beats for SL1–SL4 and the expansions (2026-10-17)

The separate campaigns were a session long each; the brief asked for 4–10 hours. This pass
adds `StorylineChapter.beats` between the openings and the goals (no goal check changed),
and deepens the expansions' scenes.

Works:
- S1 (30 beats): Ida and Sorrel on the story clock (`days:` from the chapter's start), the
  first visitor and feed, the care slips (`partner:slips`), fondness and trust, the cave's
  stairs, strays and chest (a new flagged choice, `h-drawing`, paid off on the hundredth
  day), the cocoon, the mire's rain, the stall and yard, the loft lamp at the mountain, the
  naming choice and a moody partner on the last day.
- S2 (19 beats): Warden's tips as the eggs hatch, Juno's meal-count talks (a new choice,
  `l-told`, paid off at the board), night bouts, the bout counts between ranks, a lost
  partner (`count:departed`, chapter 6 only), a second teen beat (`l-c6-wage`), and Juno's
  reaction to the chosen word.
- S3 (20 beats): the banners and ledger, the leader's errands (`count:missionDone`), the
  first stair, a torch choice (`b-torch`, paid off on the third floor), the two partners and
  Vane's own fusion, the second run, and chapter 8 reading the fusion and the lever.
- S4 (16 beats per half, from the template): the other twin when `dd-other-done`, the Book's
  visitor and settler, the egg that must not be hatched, the second page, Vask between
  belts, the grown one sitting by the egg, and the day after the cause.
- E1–E3: fuller visits and one real choice each (`e1-hazel`, `e2-asked`, `e3-pick`), voice
  only for now. E1–E3 and S1–S4 are now exported from `content/index.ts`, and the three
  expansion packs are in `tests/tools/content-check.ts` (problems: 0).
- Every `_CHECKS` list now includes the beat checks, so the grammar is covered.

Stubbed: no engine change. The `days:` beats use the two-minute story day, so at ×1 they
land minutes into a chapter, not hours. The expansions' new choices set flags nothing reads
yet. Nothing in S1–S4 is in the content checker (it checks `Quest` packs, not storylines);
the storyline tests and a line-length sweep stand in.

## G12 X7: S4 "Dawn & Dusk" with the reverting (2026-10-17)

The fourth separate campaign, in the `dawndusk` save mode: two mirrored halves built from
one template (`src/content/storyline-dawndusk.ts`, 7 chapters and 3 endings each; the
Penhallow twins and Teodor Vask), rules for both in `sim/storyline-rules-dawndusk.ts`, and
the new `sim/degeneration.ts`.

Works:
- The title asks Dawn or Dusk; Dusk is locked until Dawn has an ending in any slot
  (`storylineFinished`), and a half started after the other finished is told so
  (`storylineStart.flags` → `dd-other-done`), which opens the Whole Day ending.
- Goals on the collection engine and the dojo: a full scan, a second scan plus one
  conversion (`count:converted`), the three rank tests as belts (`karate:belt`), and the
  cause choice, which differs by half (lamp or scanner by day; bell or mist by night).
- Degeneration: when chapter 3 opens the oldest grown Nubbin reverts to its own egg
  (name, stats, grades and rebirths kept; form and age stashed in `genes.degenerated`).
  Naming the real cause restores it if it is still that egg; the wrong cause lets it
  hatch small and grow again. Events `degenerated` and `restored` with HUD toasts.
- Endings per half: First Light / Last Light, a Fixed Shadow (wrong cause), the Whole Day.
- Tests: `tests/sim/storyline-dawndusk.test.ts` (degenerate and restore, both halves to
  their endings, the other-half flag).

Stubbed: the four houses are narrated; serving them is the scan count, not four named
species. The twins never appear on the map.

## G12 X6: S3 "The Beetle Road" with fusion (2026-10-17)

The third separate campaign, in the `beetle` save mode. Script
`src/content/storyline-beetle.ts` (8 chapters, 3 endings; Hob the quartermaster and
Ottoline Vane), rule `sim/storyline-rules-beetle.ts`, and the new `sim/fusion.ts`.

Works:
- Goals on the existing systems: join a guard team (`team:joined`), a Beetle Run
  (`tank:runs`), Hollow floors 2 and 4 (`hollow:best`), two door keepers as dojo wins
  while chapters 4 and 8 are open, the lever choice, and the fusion chapter, whose goal is
  `fused:>=1|flag:b-fusion:refused`: the Fuse button or the Do-it refusal both move on.
- Fusion (`canFuse`, `fuse`, command `fuse` on the two partners, event `fused`): both
  adults, affection 80 and trust 60 each, never an Eternal. The one that stays keeps the
  higher points and the better grade of every stat, fills empty part slots from the other,
  adds its type lean, gains affection, goes up a generation, and remembers the other in
  `genes.fusedFrom` and its ancestry. The other leaves the roster; partners and any merge
  are cleaned up. `FUSION` in tuning.
- Endings: the Open Sky (lever down), Two As One (lever down after a fusion), Steady Rain
  (machine left running).
- Tests: `tests/sim/fusion.test.ts` (consent rules, what is kept, the command) and
  `tests/sim/storyline-beetle.test.ts` (fused, refused and steady-rain runs).

Stubbed: the door keepers are the ordinary dojo rivals with the chapter’s framing; the
weekly guard missions are not goals (they would be a chore), so the “leader’s errands” are
narrated. No stats-sheet line for `fusedFrom` yet (`fusedFrom()` is ready for it).

## G12 X5: S2 "Logged In" with party bouts (2026-10-17)

The second separate campaign, in the `logged` save mode. Script
`src/content/storyline-logged.ts` (8 chapters, 3 endings; Warden, Juno and Root), rule
`sim/storyline-rules-logged.ts`, and a new minigame: the turn-based party bout.

Works:
- Setup: three starter eggs rolled from the chosen Keeper’s line are the party (flag
  `party`); both Grove recolours are unlocked so the Day and Night servers are the Sun and
  Moon Groves (Where To: Day Grove, Night Grove; the night one refuses until chapter 4).
- `sim/party-bout.ts`: three partners against three seeded foes, one move each per round
  (strike, guard halves the next hit, rally heals the party 15%), foes strike the weakest
  or guard; karate’s stat maths (Power, Stamina, Run). `ui/party-bout.ts` is a plain DOM
  panel opened from the journal’s Fight a bout button (`StoryAction.ui` + `Journal.openers`,
  wired in hud.ts) and reports `partyBoutResult`; won bouts count (`count:partyBout`) and
  pay shells by tier (`PARTY_BOUT`).
- Goals: hatch three; bouts 1, 3, 5 (two of them after crossing to the night server), the
  board (Do-it), 8, the root-node choice, 10. The sibling-and-company thread is a
  `mature:teen` beat (`l-c5-thread`), so it never plays with the setting Off.
- Endings: Everyone Wakes (Root’s word, party intact), the Quiet Exit (the company’s word),
  One Short (Root’s word after a partner departed).
- Tests: `tests/sim/party-bout.test.ts` (seeded, strong wins, weak loses, turn order, guard
  and rally) and `tests/sim/storyline-logged.test.ts` (setup, the mature gate both ways,
  all three endings).

Stubbed: the bout panel is text rows and buttons, no sprites or animation; the "card-like
format" is the move set, not drawn cards. Other locked-in players are narrated (Juno),
not NPCs on the map.

## G12 X4: S1 "The Hundred Days" (2026-10-17)

The first separate campaign, in the `hundred` save mode (title screen → The Hundred Days →
pick a Keeper). Script `src/content/storyline-hundred.ts` (10 chapters, 4 endings, Ida
Brack and Sorrel), rule `sim/storyline-rules-hundred.ts`, registered through
`sim/storyline-content.ts` (the script chunk) and `sim/storyline-rules-index.ts` (imported
by campaign.ts for its side effects).

Works:
- Setup: the roster becomes one egg, named partner, `spanScale` 72 so its adult span is
  about fifteen real days (`STORYLINES.hundredSpanScale`; ×10 to ×1000 in the debug panel).
- Six areas from the journal’s Where To: meadow and shore are the Grove, the cave starts a
  Hollow run, the mountain is the story Hollow set, the mire is Corvin’s garden in rain,
  the mill the same set in clear weather. Arriving spawns one wild visitor of the area’s
  habitat pool, so each area has something to win over for the Fold.
- Goals: hatch; recruits 1, 2, 3 (shore), a Hollow run, the partner’s evolution, recruits
  5 (mire), prosperity 60 at the mill, the Hush (a dojo win during chapter 9), the last
  day. Two choices (naming, the loft lamp) are flagged for later use.
- Endings: Bright Fold (prosperity 100, no moody partner), the Fold, Quiet Fold
  (prosperity under 60), a Grey Lamp (a moody or Shadow partner).
- Tests: `tests/sim/storyline-hundred.test.ts` plays all ten chapters to each of the four
  endings through the real commands (`storyArea`, `leaveDungeon`, `karateResult`,
  `debugHatchNow`), with `tests/sim/storyline-driver.ts` shared by the S2–S4 tests.

Stubbed: the Hush is the ordinary top-tier dojo rival with the chapter’s framing (no
colossus sprite or special fighter); the length is a session, not the brief’s 8–10 hours,
and a writing pass could add beats between the recruit goals. The chapter-9 bout counts a
win anywhere, not only at the mountain.

## G12 X1–X3: expansions E1 The Square, E2 Nova’s Season, E3 The Twine (2026-10-17)

Three post-ending add-ons to Hazel’s Grove, written as side stories on the existing runner
(`src/content/expansion-e{1,2,3}.ts`, rules in `sim/side-rules-expansions.ts`), opening on
post-game mornings. Their checks use the storyline grammar, so the sim meets them on its
own and the journal’s Do-it only appears for E1’s first walk.

Works:
- E1 (7 steps): Hazel’s second page, Old Pell on the square; steps 2–7 follow prosperity
  (first recruit, stall 20, gym 40, bathhouse 60, fortune 80, festival 100). On the
  `hazels-grove` ending with Corvin reconciled, step 5’s done scene is
  `e1-attendant-corvin`: Corvin comes back as an NPC and a recruit of species `keeper`.
  Title: Square Warden.
- E2 (5 steps): Nova’s egg from a short line. The rule spawns Dandy with
  `spanScale` 2.2 so the whole life is twelve days of the lifespan clock; visits gate on
  day 4, 8 and 11 (`dayCount`); the day-4 scene swaps for two or more care slips, the
  day-8 scene for a moody evolution; the complete scene is the rebirth or the departure
  one by what happened. Title: Twelve Days.
- E3 (5 steps): feed a Hollow stray, name two partners, buy twine, merge, then the
  bracket: three dojo wins after it goes up (`EXPANSIONS.tournamentWins`), with a merged
  variant of the done scene. Title: Twine Champion.
- Engine: `StoryRule.sceneDone` hook; command events now reach the campaign counters
  (`noteCampaignEvents` in `applyCommand`), so karate wins, merges and conversions count
  for storyline goals too; grammar gains `twine:` and `partners:set`.
- Tests: `tests/sim/expansions.test.ts` (script sanity, E1 to the festival with Corvin,
  E2 both outcomes at day eleven, E3 through the merged bracket).

Stubbed: E3’s “ten Keepers” are narrated as rounds; the dojo fights its usual rivals. E1–E3
are not yet in `content/index.ts` or `tests/tools/content-check.ts` (both files are mid-edit
by the Learning Grove session); the expansions test covers the same checks for them.
No render work: the square, Nova and the bracket use the existing scenes, NPCs and dojo.

## G12 X0: the storyline engine for the separate campaigns (2026-10-17)

Maor picked everything on the Digimon-inspired list: expansions E1–E3 and campaigns
SL1–SL4 (plan Part G12). X0 is the engine they all run on; X1–X3 add the expansions,
X4–X7 the campaigns, one commit each.

Works:
- `content/types.ts` `Storyline`: chapters with an opening scene, a goal check string, a
  closing scene and optional beats (a scene that plays once when its check is met), plus
  endings and extra scenes. `sim/storyline.ts` runs them through the campaign state the
  dialogue box, journal and away screen already read (`CampaignState.storyline`), so a
  separate campaign needs no new UI for its scenes. Endings register as `<id>-<ending>`
  in ENDINGS so the end card finds `end-<id>-<ending>`.
- `sim/storyline-checks.ts`: the goal grammar (`recruits:>=3`, `prosperity:40`,
  `partner:adult`, `area:cave&act:light`, `days:>=1`, `count:converted:2`, `|` and `&`).
  Counters fold from events as `n:<kind>` flags; `act:<label>` is the journal's Do-it.
- `sim/storyline-rules.ts`: the per-campaign code hook (setup, onChapter, onScene,
  onEvent, onArea, holdsClose, variant, endingFor, actions). Commands `storylineStart`,
  `storyArea`, `storyAct`; events `storylineStarted`, `areaChanged`.
- Save version 5 (`campaign.storyline`), four new save modes with three slots each
  (`hundred`, `logged`, `beetle`, `dawndusk`) on the title screen; Dawn & Dusk asks for a
  side and locks Dusk until Dawn has an ending in any slot (`storylineFinished`). The
  journal shows either campaign through `journalView` (goal, Do-it, travel, actions,
  the storyline's own Paths). `Nubbin.spanScale` stretches an adult span (S1's partner).
- Tests: `tests/sim/storyline-engine.test.ts` drives a three-chapter test storyline end
  to end (counters, areas, beats, acts, days, a choice-driven ending, save round trip,
  the v4→v5 migration, the check grammar).

Stubbed: `sim/storyline-content.ts` is empty until X4–X7, so the four title modes start
without a script (the slot plays as a Free Grove). Render: no new scenery; areas map to
the locations, Grove recolours and weather both renderers already draw.

Known bugs: `tests/sim/edu-story.test.ts` and `line-swaps.test.ts` fail at HEAD before
this pass (the Learning Grove A-series session is mid-edit in `src/content/edu.ts`); the
gate for this commit ran in a clean worktree with only these files copied in.

## Pixel's Arcade PA1–PA5 and lines LB, LK scripted (2026-10-16)

Seven script agents, one file each: `src/content/arcade-pa1.ts` … `arcade-pa5.ts`,
`lines-lb.ts`, `lines-lk.ts` (LB and LK carry both Learning Grove bands in the same file).
All seven are registered in `index.ts`. tsc, eslint and content-check pass with
`problems: 0` (882 quests). Logs: `docs/logs/script-{pa1..pa5,lb,lk}.md`. Not committed.
`content-check.ts` has a new commented exemption for one quote clash it flagged by mistake.

Decisions waiting on Maor:
- LK8: "the King in the river" became a tiger, so no king who could be read as the
  Prophet Sulaiman is pictured. Confirm.
- LK: Malay and Indonesian advisers for words, counting audio, clothes, lamp, puppets
  and food; Siti and Wulan's evening idle lines are still to write with them.
- LB: Ned Larkin (4) shares a name with S31's valley boy Ned (9). Keep both or rename?
- LB: is "inspired by Bluey" the credit wanted?
- Quotes to verify: PA1 Tikal's prayer x2 (English script), PA2 Mewtwo's "circumstances
  of one's birth" (art book), PA3's three, PA4 Flowey's "kill or be killed" and Papyrus's
  laugh, PA5 "Open your eyes." and "I think I can accept that." (the game).
- PA4 credits: note that the neutral ending is not shown. (All licences approved (Maor, 2026-10-17).)
- Byte is "he" in PA2 (two pronoun warnings); confirm against canon.

SIM needs (details in the logs): PA1-17's other check when the gate was locked; PA2's
name box for the clone, its sprite and a lasting attract screen; PA3's breakable flower,
the save before the Abyss and how the ending is chosen; PA5's memory-site tracking and the
one-time thirteenth memory.

## Full 3D parity gaps, plan Part G16 (2026-10-16)

Closes G16.1 to G16.11 and writes G16.12. Each checked in the browser pane on `?free&slot=3`,
Full 3D against Pixel, 375x812, frames driven by hand from a HEAD export (`.idx-g16`); one
commit each; shots `docs/samples/parity2-<item>.jpg` (pixel left, 3D right where both apply).

Works:
- G16.1 (a440e86, 814b356): the cave and plain light sets link in the background after the
  Grove compiles (hidden samples for the floor's material kinds, the shadow depth programs
  and the emote sprites); a place still linking holds the last frame behind a dim. First
  trip down the stairs: 695 ms first frame here (3.3 s in G15) to 47 ms.
- G16.2 (fef9994): buildings, lanterns, decor and trees get a pixel-style rim (`halo.ts`);
  memorials, visitors, wild ones, strays, plants, story props, stairs, chests and loot the
  ground ring sized to their reach.
- G16.3 (505b0d5): the story Hollow and Corvin's garden sets (`story-sets.ts`).
- G16.4 (60139a6): the Keeper's lamp underground, pixel-shaped loot, the "?" over unfed wild
  ones; a floor's wild one goes once scanned, as in the pixel view.
- G16.5 (41db953): market stalls by `townUnlocks` (`village.ts`). The path fence rule is in,
  but `fenceSpots()` is empty on today's layout, so neither view draws posts.
- G16.6 (dd1ead6): merged glow, cocoon fade and shimmer, fruit flavour colours (`glow.ts`).
- G16.7 (af9b708): weather moved to `weather.ts` (the scene was past 800 lines): pixel gates
  for reduced motion, density and intensity; daytime leaves; story-Hollow fireflies; grade.
- G16.8 and G16.9 (3efc6eb, 24bf933): trunks thin when they hide the Keeper; the visit
  gardens' trees fade too (`treeOf` in `crowns.ts`).
- G16.10 (3a83021): the race camera starts before the line; tags sit on their lane rows.
- G16.11 (429ddee, 73dac41): `ui/render-hold.ts` pauses Full 3D behind story scenes, the away
  screen and the photo panel, once the opening load is done (the away screen opens at boot).
- G16.12: `docs/renderer-decision.md`. Recommendation: Pixel stays the default until G11's
  phone rows pass, then Full 3D by device. Render-only frame now p50 2.4 ms, p95 3.1 ms.

Stubbed: none new. Known: coming home from a visit still links some Grove-only programs (one
frame of about 170 ms); leaf cards get no halo; the merged aura is soft in daylight. This
PC's browser reports prefers-reduced-motion, so under 'system' the pane shows no weather.
The full suite once timed out the "every Atlas page" test at 5 s under load (1.1 s alone).

## Full 3D: event bursts and tree crowns (2026-10-16)

Closes parity items 1 and 3 below. Checked in the browser pane on `?free&slot=3`, Full 3D,
375x812, frames driven by hand from a HEAD export.

Works:
- Event bursts as in the pixel `burstFor` (8089255): sparkles for hatch, rebirth, growth,
  evolution (with petals), Eternal, cocoons and the find sparkle for dungeons and chests;
  hearts for love, sparkles for dizzy, crumbs for meals, dust for a shaken egg, a sparkle
  where an item is collected; the squash on landing and the pop on hatch, evolve and
  rebirth (pixel timings). `render3d/bursts.ts` draws three point clouds (dots, glowing
  stars, hearts). Heights are fractions of the body, feet to head. Like the pixel side,
  bursts ignore reduced motion. Shots `docs/samples/parity-3d-bursts-{evolve,love}.jpg`.
- Tree crowns (fb96dd3): `render3d/crowns.ts` dithers a crown out when the camera is inside
  it and thins it to `GROVE3D.crownFade.blocked` when it stands between the camera and the
  Keeper (middle and head), hiding branches and fruit below half. A per-crown uniform, so
  no recompile; the shadow stays. Shots `parity-3d-crown-{before,after,blocked}.jpg`.

Stubbed: none. Known bugs: a trunk could still hide a Keeper standing right behind it; the
dressed visit gardens built trees without the fade (both closed in G16.8 and G16.9).

## Pixel vs Full 3D parity pass (2026-10-16)

Method: one seeded Free Grove save (`?free&slot=3`, snapshot reloaded for each mode) played
in the browser pane at 375x812, driven by hand at x10: 15 actions (hatch, give, pet, feed,
shake tree, hug, pick up, put down, Moon Keeper, snow, force evolve, Hollow Below in and
out, end of life), 12,000 frames per mode (twenty minutes at x10), plus an Expedition, a
race, a campaign scene and the Learning Grove (`?edu=4&slot=3`). Both runs fired the same
events (hatch, evolve, second evolve, departure); they started 36 game minutes apart, so
positions differ. Frame times (`gl.finish` round each frame, this PC, dpr 1): Pixel p50
0.7 ms, p95 1.1 ms; Full 3D p50 3.0 ms, p95 5.3 ms. Entering the Hollow Below: Pixel
484 ms, Full 3D 3,261 ms the first time (about 400 ms later). `docs/device-pass.md` holds
no frame times; the only earlier figure is the archive's 2.9 ms for Full 3D at 1024x768.

Works (fixed, one commit each):
- 3D reaction bubbles (heart, !, ?, spiral) via shared `bubbleFor`, the two-frame emote
  flip and the plum Shadow sheet (dcf72b9).
- 3D portrait view: vertical field of view widens to keep `GROVE3D.minHFovDeg` (34)
  across; at 375x812 it was about 20 degrees and Nubbins sat off the edge (1af54fe).
- 3D memorial flowers only in the Grove and removed with their memorial (d48cb1f).
- 3D canvas scales smoothly, not nearest-neighbour (landed inside 0867344: another
  session's CV3 commit took the staged file during a git lock clash; the change is right).
- 3D items follow the pixel rule: no Grove fruit in the Hollow Below, notebooks only in
  story places (778e471).
- Same in both (checked): HUD, toasts, panels, camera buttons and gestures, picking (every
  kind; 3D uses coarse spheres); Expedition, races, Beetle Run and the Learning Grove
  minigames pause the 3D render.

Open, with estimates (all tracked in plan.md Part G16; 2-10 closed in the G16 pass above):
1. Done (8089255): event bursts, squash and pop in 3D (section above).
2. Hollow Below entry stall in 3D (its lamps recompile every material, by design):
   compile asynchronously behind a fade. 1.5-2 h.
3. Done (fb96dd3): crowns between the camera and the Keeper fade (section above).
4. Highlight on non-creature picks (lantern, tree, building, stairs, chest, loot). 1-2 h.
5. Story Hollow and Corvin's garden sets (a plain floor and a colour in 3D). 3-4 h.
6. Hollow Below: no Keeper lamp, generic loot, no "?" over wild ones (Grove too). 1.5-2 h.
7. Village stalls and path fence posts missing in 3D. 1-1.5 h.
8. Merged glow, cocoon fade, fruit flavours missing in 3D. 1-1.5 h.
9. 3D weather ignores intensity and reduced motion; no leaves, no grade. 1 h.
10. Both modes: the race screen in portrait starts with runners and names clipped at the
    left edge. 30-60 min.
11. Expedition and races are pixel art in both modes: a style jump in Full 3D (Maor's call).

Shots: `docs/samples/parity-hollow-{pixel,3d}.png`, `parity-3d-portrait.png` (after the
field-of-view fix), `parity-3d-crown.png` (item 3).

Stubbed: none new. Known bugs: items 2 and 10 above (both closed in G16).

## CV3 language questlines: Hebrew and Japanese in the Learning Grove (2026-10-16)

Works:
- Offer: "Nova's postcard" in the Learning Grove picker (`ui/lang.ts` `LangPanel`) starts
  Ori's Hebrew (LH1–LH6) and/or Hana's Japanese (LJ1–LJ6), starting the story first if
  needed. The quests run on the side-story machine in `campaign.fun` under `langRule`
  (`sim/lang.ts`): nothing opens, steps or finishes without `world.edu`; LH1/LJ1 open at
  once, each next quest on a morning at least `LANG.nextQuestAfterMs` after the last.
  Scripts, edu versions and speakers (Ori, Hana) register from the edu chunk
  (`registerLanguageQuests`), so the main game never loads them.
- Text: `sim/lang-text.ts` splits lines into Latin/Hebrew/Japanese runs. Dialogue lines
  are `dir="ltr"`; Hebrew runs (with their own `?`/`…`) sit in `<bdi dir="rtl" lang="he">`;
  Japanese words are `lang="ja"` no-wrap spans; script lines skip the typewriter. Journal
  goals and hints use the same (`scriptParagraph`).
- Fonts (Fontsource, exact pins 5.3.0): Noto Sans Hebrew, Noto Sans JP (unicode-range
  subsets), Klee One for tracing; loaded on first script text (`ui/lang-fonts.ts`).
  Checked in the browser: Hebrew line renders isolated with niqqud; the built woff2 load.
- Words: `edu.words[id] = {heard, used}` (save fills older edu saves). Heard: course
  words in the band scene the child saw, or a tap on the word. Used: a picked choice's
  words, or the traced word (אוֹרִי, はな). Child word book per course on the postcard;
  grown-up area lists every band word with heard/used.
- Audio hooks: `platform/lang-audio.ts` maps each `VocabItem.audio` to
  `audio/lang/<id>.mp3` once listed in `RECORDED`, else `placeholder.wav` (a voiceless
  chime). Tapping a word plays it; read-aloud strips Hebrew/Japanese (`withoutScript`),
  so no synthetic voice ever says them. How to add recordings: `public/audio/lang/README.md`.
- Tracing (`ui/trace.ts`, journal "Trace it" on the four trace/write steps): kana with
  numbered strokes in school order (`ui/kana-strokes.ts`, aligned to Klee One in the
  browser), Hebrew letter by letter right to left, each started at its right side and
  passed on ink coverage (`ui/trace-check.ts`). Finishing sends `langTraced`.
- Reactions: a learned word (used, or heard 3 times) heard near the Keeper makes up to 3
  Nubbins react (`langReact`): shalom wave, toda nod, kochav look up, colours point, every
  Japanese word bow, and so on; the HUD captions the nearest one.
- Tests `tests/sim/lang.test.ts` (18): runs and bidi punctuation, whole-word matching
  (phrases, frames, two readings), no script to TTS, clip ids, main-game gating, postcard
  gating, a full Hebrew course to lh6Done, reactions, save round trip and fill, strokes.

Stubbed:
- Every clip is the placeholder until native-speaker recordings land.
- Wave/bow/etc. show the existing reaction faces plus a caption; no gesture animation.
- Non-tracing checks (count plums, sort fruit, paint the fence, …) are the journal's
  "Do it" button. LJ2's write-down option (`writing-mode: vertical-rl`) is not built.
- The tracer was not driven by hand in the browser pane; only its guides were checked.

Assumptions: words are learned per Grove, not per Nubbin; Japanese learned words all bow
(the course note: "bow … at any word they have learned").

Known bugs: none found.

## Story scene replay fix (2026-10-16)

Works:
- A finished story scene no longer plays a second time. `Dialogue.finish` sends `sceneDone`,
  which the sim applies on the next frame; at a low frame rate the HUD's 200 ms loop still
  saw the old queue head and replayed it. `ui/scene-replay-guard.ts` holds the finished id
  back until the queue head changes (tests in `tests/ui/`). Checked in the hidden browser
  pane on `?edu=4&slot=3`: c1-letter closed once and stayed closed.

Stubbed: none. Known bugs: none new.

## CV4/CV5 Atlas, Arcade and Multiverse saves (2026-10-16)

Works:
- Side saves (canon 21, 29, 30): one device-wide save each for the Atlas, the Arcade and
  the Multiverse (`grove.side.atlas|arcade|multiverse`, `readSide`/`writeSide`/`clearSide`
  in `platform/storage.ts`), apart from the three Grove slots per mode. Versioned with a
  migration list (`sim/side-saves.ts`); broken or too-new saves read as fresh; blocked
  storage is harmless. `readGroveSaves()` reads the Free and Hazel's Grove slots, never edu.
- Atlas runner (`sim/atlas.ts`): every page keeps its own progress and flags in the Atlas
  save, so pages play in any order. Step scene → "Do it" goal → done scene → complete
  scene; `requires` chains within a page; variants picked by flag value (`<scene>-<value>`).
  A page is hidden unless its strictest quest is allowed (teen pages behind Mature 13+;
  only `all` in the Learning Grove). Pages are found by file name (`sim/atlas-catalogue.ts`,
  a lazy chunk), so A1–A10 and A22–A31 join when their scripts are committed.
- Entry points: "Nova's atlas" and "Pixel's cabinet" in the More menu (`ui/atlas.ts`
  `StoryShelf`; scenes play in the dialogue box through `Dialogue.playScene`, which answers
  the shelf, not the sim). The cabinet shows in Hazel's Grove from chapter 6 and in the
  Free Grove from the start; neither appears in the Learning Grove.
- Read-only lookups (`sim/cross-saves.ts`): a frozen `CrossSaves` snapshot with
  `atlasDone(id)` (page or quest), `atlasFlag(page, flag)`, `arcadeDone(id)`,
  `longGrassLantern()` (any Hazel's Grove save has seen `c10-dawn`). The journal shows a
  "From the atlas" shelf from it; nothing is copied into the Grove save.
- Festivals by sets of pages: the five in `docs/more-stories.md`, any two lines of a set
  (`ATLAS_FESTIVALS`, `festivalsUnlocked`). The Grove toasts each once and remembers it in
  `world.atlasFestivals` (command `atlasFestival`).
- E6 (`sim/reflection.ts`, `openLastEndgame`/`endLastEndgameEternal` in `ui/atlas.ts`): the
  oldest living Eternal across the Grove saves is reflected (name, look, age) into the
  Multiverse save only; the `eternal` ending loses only the reflection, never remade.
- Tests: `tests/sim/side-saves.test.ts` (19): key separation, Grove keys untouched by
  side writes and lookups, blocked storage, migration, pages in any order, every
  committed page plays to its end, ratings, frozen snapshot, festival thresholds, E6.

Stubbed:
- Pixel's cartridges PA1–PA5 are not scripted: the cabinet's shelf is empty (`ARCADE_CARTS`).
- Festival scenes and rewards (Remembering Tree, sailable pond, Charter board, Long Table,
  cabinet tournament): only the unlock and the toast exist.
- E6 has no caller yet: the rift and the Multiverse runner land with their own milestone.
- Atlas step goals are "Do it" buttons; no page has its own world or minigame yet.
- Atlas pages have no Learning Grove versions yet (the atlas is hidden there).

Assumptions: High Score Night unlocks with any two of PA1–PA5; the Free Grove has the atlas
and the cabinet from the start; "after chapter 5" means the campaign is in chapter 6 or later.

Known bugs: none found. Not checked in the browser pane this pass.

## CV2 Learning Grove language switch (2026-10-16)

Works:
- Bands: the title's age menu adds "7–10" (Grove Readers, minigames at age 6); `EduState`
  has `band`, `storyLanguage` (Learning / Standard), `readAloud` and `lessons`, filled into
  older saves on load. The grown-up area switches all three (`ui/edu-story.ts`).
- The story: the Learning Grove picker has a Story entry that starts the campaign with the
  first Keeper. Fun quests and side stories are offered only at audience `all` (S23 never
  opens there). `content/edu.ts` loads as its own chunk for edu saves only.
- `sceneFor` (default band from `textBandOf(world)`) returns the band's lines, choices,
  `defaultChoice` and lessons; lessons follow their line through the swaps. `sceneDone`
  still applies the original scene's flags; the dialogue sends `choiceToSend`. A scene
  with no edu version reads its quest's `childLines` in any Learning Grove save.
- Dialogue (`ui/lesson.ts`): ask = big options, the best gets a star, then the reply;
  notice = its lines; do = its lines and a card. Reader glossary words are underlined in
  the scene that introduces them (the entry's `scene`), tap for the meaning. Sprout bracketed prompts are styled apart and read-aloud uses the
  device voice once sound is on (prompts not spoken). Journal shows the band's chapter
  and quest goals. Grown-up progress: story lessons by area and by standard, latest
  parent notes.
- Tests `tests/sim/edu-story.test.ts`: same flags in every band, valid choices, no sprout
  Collector (static and a full run), childLines, lesson anchoring, save round trip.

Stubbed:
- `do` beats: only `edu:count:<thing>:<n>` has an interaction (tap to count); every other
  verb is one "We did it!" button. Real Grove actions behind the check strings come later.
- Band ending titles (`EduCampaign.endings`) are not shown yet; the end card uses main.

Known bugs / assumptions:
- Assumed: the Learning Grove story starts with `TRAINERS[0]` (no Keeper menu there).
- Read-aloud is the browser voice (`en-GB`), not recordings; untested on iOS in this pass.
- Checked in the browser pane (Full 3D, `?edu=4` and `?edu=8`): c1-letter in both bands,
  prompts, a do card, a think question, a starred ask, glossary taps, lessons recorded,
  no console errors.
- Pre-existing, not CV2: with the pane in the background (1 fps) a finished scene can
  play a second time, because the HUD's 200 ms loop replays `queue[0]` before the next
  frame applies `sceneDone`. Lessons keep their first answer, so nothing double counts.

## G14 bundle diet: campaign chunk, sample stage split, grass in a worker (2026-10-16)

Works:
- The v2 campaign script (`content/campaign-book1..3.ts`) is its own chunk, like the side
  stories. `config/story.ts` keeps `CHAPTERS`, `SCENES`, `ENDINGS` empty until
  `registerCampaign` (sim/story-scenes.ts) fills them and adds Wisp to `SPEAKERS`;
  `loadStoryScripts()` fetches both chunks together and registers the campaign first (a
  campaign scene still wins a shared id). `main.ts` starts it during the title and awaits it
  before `boot`. Tests register both up front (`tests/setup-side-stories.ts`);
  `side-story-chunk.test.ts` checks repeat registration and `c1-letter`. The content checker
  and script book read Wisp from `CAMPAIGN_SPEAKERS`.
- `src/render3d/` and `src/samples/` load only when chosen (no static import outside them;
  checked in the build's import graph). New: the 3D chunk no longer drags in the `?aaa=`
  stage. What render3d builds with moved from `samples/aaa-styles.ts` to `samples/aaa-kit.ts`
  (textures, terrain material, grass, trees, particles, CLAMP/GRADE); the stage keeps its
  valley, props, water and `mountAaaSample` and imports the kit.
- Grass placement runs in `render3d/grass-worker.ts`: `samples/grass-place.ts` is the pure
  scatter (same three maths as before), `render3d/grass-field.ts` the Grove's keep-out field,
  `render3d/grass.ts` builds the meshes empty (colour attribute up front, so the program does
  not change) and pours the matrices in; `loadState` waits for `props.grass.ready`, so the
  veil lifts on the full meadow. Page fallback without workers. Checked tuft for tuft against
  HEAD's loop (identical matrices and colours); `tests/render/grass-place.test.ts` pins the
  checksum. Shots: `docs/samples/g14-grass-head.jpg` vs `g14-grass-worker.jpg` (same meadow).

Sizes (minified, `vite build`; before = HEAD 0a96ecc):

| Chunk | Before | After |
| --- | --- | --- |
| index (main) | 1,336.9 kB (392.2 gz) | 1,155.9 kB (331.6 gz) |
| campaign | in index | 180.9 kB (60.8 gz) |
| side-story-content | 1,065.2 kB | 1,065.3 kB |
| 3D on demand: grove-3d-scene + shared | 75.7 + aaa-styles 237.1 + BokehPass 26.0 = 338.8 kB | 76.1 + Sky 207.8 + OutputPass 18.9 = 302.8 kB |
| `?aaa=` stage | 237.1 kB | aaa-styles 30.3 kB (+ shared) |
| sculpt-worker | 432.3 kB | 252.5 kB |
| grass-worker | none | 90.6 kB |

Boot times (`vite preview`, browser pane, warm cache): title card 25–42 ms after page start
(HEAD); `?free` pixel boot 402–451 ms HEAD vs 422–460 ms now (both chunks land by ~55 ms; the
spread is noise). Grass placement was 90–111 ms of the 3D constructor (9,000 tufts × 2, timed
in Node); it now runs off the page. Full 3D veil times are not comparable in the pane (it only
draws frames while captured: HEAD read 13.4 s cold).

Stubbed / known:
- The main chunk is 1.156 MB, a little above the 1.13 MB estimate (the campaign was 181 kB,
  not 175 kB, and the index grew since that estimate). The next large piece is Three.js itself.
- Rollup names the shared 3D chunk after a module in it (`Sky-*.js`); it holds the species
  builder and the kit, not just the sky.
- `aaa-styles.ts` is 841 lines, still past the ~800 split guide.
- Not checked: the no-worker grass fallback; 3D boot on a phone.
- This section sits after the Status block, as the ones below do; literal line 12 is inside it.

## B-C3: every side story runs; fun quests, props, keepsakes (2026-10-16)

Works:
- All 31 Grove side stories run (`sim/side-stories.ts`, rules in `side-rules-early/mid/late.ts`,
  the shared kit in `side-rule-kit.ts`): chapter windows and closes, step gates, every
  `_VARIANTS` scene chosen by its flags, scenes queued before and after steps, the holds the
  notes ask for (S30's last day and S31's Gourd Night hold the next chapter, S8's complete
  scene holds c11-close), and chapter 10's opening waits three story nights after c9-close
  (longer while S23 is moving) so S6, S14 and S23 have their window. "Chapter N begins"
  means its opening scene has played.
- Checks the sim watches on its own: waits and sits by their time words, `night:`,
  `chapter:N:end`, choices, talks with the Keeper named, visits, pets, feeds, shakes,
  crafts, races, placed decor or cosmetics, Moss's lantern walks (the Keeper near a post),
  and taps on story props. Everything else is the journal's "Do it".
- The campaign hooks the stories feed (`visitors`, `hushGarden`, `millLetter`, `cinder`,
  `wisp`, `s8Reunited`) are set by the scripts and read where the bible says; tests cover
  the lane scenes, S9's family count, the garden splice, the letter hand-over.
- CV1 left-overs: `s28-null-minder` while S7's Minder ticks, S27's spring scene on the
  first post-game morning, Wisp as a stray under the cottage step after `c10-bank-wisp`
  (`STORY.wispHome`), S6's Ember friendship. Post-game mornings now step the runner (S24).
- Props: eleven in `STORY_PROPS` (tuning) with names in strings; `sim/story-props.ts` says
  which stand; painted `prop-*` frames in `paint/decor.ts`, boxes in `render3d/garden.ts`
  (`storyPropModel`); pick kind `storyProp` sends a command that meets the matching step.
- Rewards: `grantRewards` on completion. Hats the wardrobe knows go to the inventory,
  flags are set, everything else is kept by id in `inventory.keepsakes` (save version 4)
  and listed in the journal under Memories; `storyTitles` for the profile.
- Fun quests Q1–Q65 (`sim/fun-quests.ts`, state in `campaign.fun`, journal "Capers"):
  each `when` text read as time of day, weather, season, weekday or market or festival
  day, chapter, the quests it follows and a few Grove facts; one offered at a time, a story
  day into a chapter, once only, never in chapters 9–11, Sunny behind the 18+ setting.
  They never write a campaign flag (a test checks every set).
- Line swaps in every band: `sceneFor(world, id, band)` applies the scene notes' swaps to
  the main lines or a Learning Grove band's (matched by line position), with band
  versions of the short inserts; `registerEduScenes` lets the edu chunk register its
  lookup (CV2), so the edu content stays out of the main bundle. New: S3's Fern line after
  S8, S24's kept-stone lines. Fixes a CV1 deadlock (a gate waiting on a scene the runner
  queued only after the gate).
- Tests: `side-stories-{early,mid,late}`, `story-rewards`, `story-props`, `fun-quests`,
  `line-swaps` over the driver in `tests/sim/side-driver.ts` (a chapter hold while a kept
  story moves). 331 pass; sim time is stepped directly, which is the ×100 run.

Stubbed:
- "Do it" verbs: minigame, find, walk (except lantern posts), carry, inspect, explore,
  escort, climb, build, puzzle, deliver, swim, write, tally, sneak, show, resolve, release,
  catch, listen, open, float, follow, develop, host, candle, collect, give, and `watch`
  without a time word.
- Fun-quest phrases the sim cannot see read as "any time": a shooting star, the murky
  stream, fruit gone missing, the morning after a storm, pears at the gate, bought from the
  shop; "karate unlocked" is always true; "race day" is any race run. Fun quests run in the
  campaign only (the Free Grove later). Market days are Wednesday and Saturday by the clock.
- Feature rewards (Nubbin Jobs, deep swim, rowing, the museum, the mill, river and
  snowfield sections, the Midsummer Cup, Clank as helper, night glide, Hazel's margin
  notes) are keepsakes only. Not built: Wisp's torn ear, Spindle's spiders, S29's Brock
  door, S30's after-talk lines, S31's ambient scenes, S24's lecture, S12's naming box.
  `c12-wall-garden` has no band versions (the main text is spliced). Places outside the
  Grove (the mill, the Tooth, the Workyard, the river, Clover's cottage, Fern's orchard)
  are scene text only. The props' look is unit-tested as data, not yet checked in the
  browser.

Assumptions: a "week" is three story days (`STORY.weekDays`); S2 opens the first morning
of chapter 3 (no "fruit left for Sable" fact exists); S15's market morning is any morning;
S8's three evenings of fruit are one night's "Do it"; midnight is 0.9 of the story day and
"frost" 0.95; `s31-sable30` is Sable's trust at 30 when Gourd Night begins.

Known bugs: none known.

## G13: the 3D stub list, one commit each (2026-10-16)

Checked on the stage and in Full 3D (`?free`, Graphics = Full 3D); shots `docs/samples/polish-*.jpg`.
Works:
- `pet` behaviour state (`BEHAVIOR.petMs`): `petNubbin` puts a free Nubbin into it facing the
  Keeper. The pixel clip stays `happy` with its hearts; the 3D rig holds the pet pose with the
  Keeper's right hand (`KEEPER_HAND_FROM_ELBOW` through the elbow bone) as `lookAt`, and the
  Keeper strokes for as long as the state lasts. On land the Keeper now walks to arm's length
  first; the pond's long reach applies only to a target pulled back to the shore. `polish-1`.
- Knees: the Nubbin's stubs and two new legs on the Mossling are two-segment `joint` legs with
  planted feet and short quick strides (the body crouches about 12% walking); bipeds tuck their
  knees on the happy hop. The Wisp hovers on its vapour skirt and has nothing to bend, so it
  keeps no legs (my reading of the brief). Variant looks that replace leg prims drop the joint.
  `polish-2`.
- Lids are shells that hug the dome and close by growing down it (`setLid(lid, k)`,
  `lidShell`): the old tilted cap let a tall eye's white through and bulged when shut. Fennel's
  eyes close asleep; Bolder's sleep drops the thighs level, sweeps the legs in and folds the
  knees so they tuck under. `polish-3`, `polish-3-fennel`.
- Hearts and Zzz are camera-facing quads (`glyphQuad`, depth-tested, turned in onBeforeRender).
  The stub's claim did not reproduce: Sprites were already hidden by an opaque body on the
  stage, so this is the form the brief asked for rather than a visible fix. `polish-4`.
- A thrown Nubbin rolls once about its side axis over the flight (`Actors.tumble`, the time
  from the sim's launch speed and height) and lands upright; `Rigged.lift` carries a held or
  flying body above the real ground so the shadow blob stays on the terrain. `polish-5`.
- Shoreline: direct input clamps to the shore as tap targets did (unit test in
  `world.test.ts`); with the Swim perk the 3D Keeper wades on the pond bed, at most
  `GROVE3D.wadeDepth` under the surface. `polish-6`.
- `visit:<trainer>`: `render3d/visit.ts` dresses a neighbour's Grove (grass round, three trees,
  a fence with a gate gap, the house with its roof in the neighbour's alignment colour); the
  crowd adds their Nubbins (`first-<band>-<type>` looks, or their line's recipe) and the host
  (pick `building`/`host`, as in the pixel view); the player's Nubbins and items stay home.
  `game.ts` passes the real location to the 3D scene now. `polish-7`.

Stubbed / known:
- The visit ground is one grass texture repeated and tiles visibly; the home terrain's blended
  surface is not reused. No ripple round a wading Keeper. The emote ball is still a Sprite.
- The pixel mode draws a wading Keeper as before; only the sim change (the shoreline) reaches it.
- The browser pane ran at about 1 fps, so motion (tumble, gait, petting) was judged from frames
  driven by hand with `grove.frame()`; smoothness on a real device is unverified.
- The shared working tree held another session's half-finished sim edits (`side-rules-late.ts`
  did not compile), so every gate and screenshot ran in the `.idx-check` export of HEAD plus
  this pass (`tests`: 219 sim tests pass there).

## 2026-10-16: content ratings (CV6 audience items)

**Works:** `Settings.matureContent` (`off` | `teen` | `adult`, default `off`) and `riftConfirmed`, save v3 with a migration (v2 saves get `off`/false; bad values clamp to `off`). `sim/audience.ts` holds the pure filter: Learning Grove offers only `all`; the main game offers `all` and `main`, `teen` at 13+ or 18+, `adult` at 18+; fun quests Q1-Q65 are blocked in chapters 9-11. Settings > Mature content control (hidden when the slot mode is `edu`). `confirmRift` command sets `riftConfirmed` and turns on 18+. `ui/rift-confirm.ts` is the one-time age dialog. Tests: `tests/sim/audience.test.ts`.

**Stubbed:** nothing calls `questAvailable` yet, because no fun-quest, Atlas or Multiverse offering engine exists (CV1/CV4 and later); `askRift` has no caller until the rift is built. Learning Grove comes from slot mode `edu` in the UI; the sim takes it as a parameter. Assumption: the rift confirmation lives in `settings.riftConfirmed`.

**Known bugs:** none known. Lowering the setting only hides quests; nothing stores quest progress yet to prove it end to end.

## 2026-10-16: B2 debug panel guard, B3 panel stack

**Works:** B2 was real: the debug panel mounted in the production build and opened on backtick or a triple-tap of the logo. It now mounts only when `import.meta.env.DEV` or the URL has `?debug` (`ui/hud.ts`); otherwise `debug` is null and both openers do nothing. Checked in `vite preview`: no `.debug` node without the flag, panel opens with it. B3: `ui/panel-stack.ts` keeps one full panel open at a time (menus, stats sheet, Journal; the newest wins) and refuses to open any over a running Expedition. Toasts take their row from the measured top-bar bottom (`--toast-top`), above panels, no pointer events. The Expedition counter now sits beside the close button. Checked at 375x812 in pixel and Full 3D (the HUD is shared DOM). Manual steps: `docs/device-pass.md` (no `tests/e2e/` yet).

**Stubbed:** no Playwright test; the checks are manual until G11 creates `tests/e2e/`. Story scenes, the away screen and celebrations stay outside the stack on purpose.

**Known bugs:** I could not reproduce the exact "counter under the close button" overlap at 375 wide (the old CSS had them on opposite sides); the new layout rules it out whichever way it arose. Assumption: this section sits after the Status block rather than at literal line 12, which is inside it.

## Side stories as a lazy chunk (2026-10-16)

Works:
- The side-story scripts (S1–S31 and their variants) are their own chunk,
  `src/sim/side-story-content.ts`. `story-scenes.ts` keeps the campaign scenes synchronous and
  adds the side stories through `registerSideStories`; `loadSideStories()` imports and
  registers the chunk once. `main.ts` starts the fetch while the title is up and awaits it
  before `boot`, so save.ts's queue filter knows every side-story id when a save loads.
- Tests register the chunk up front (`tests/setup-side-stories.ts`, a Vitest setup file);
  `tests/sim/side-story-chunk.test.ts` checks a queued `s9-ask` survives save and load.
  Checked in the browser too: a save queued on `s9-ask` boots straight into S9's scene.
- Main chunk: 2,022 kB → 1,304 kB minified (632 → 382 kB gzip); the side-story chunk is
  716 kB (250 kB gzip).

Stubbed / known:
- The index is still above the 1.14 MB it was before CV1: the remaining ~175 kB is the v2
  campaign script (`content/campaign-book1..3.ts`), which stays synchronous by design.
  Lazy-loading it the same way would bring the index near 1.13 MB.
- Code that runs before `loadSideStories` resolves sees an empty `GROVE_SIDE_STORIES`;
  today nothing does.

## 3D boot: terrain in a worker, the sky's first bake warmed (2026-10-16)

Works: the terrain's heights, normals and rock/dirt blend are sampled in a worker
(`render3d/terrain-worker.ts`; the samplers and `terrainArrays` moved unchanged to the pure
`terrain-shape.ts`, which `terrain.ts` re-exports). The mesh starts on a one-triangle
placeholder with the same attributes, so programs key as before, and the buffers are poured
in as a new geometry when they land. The sky's first PMREM bake linked four programs
synchronously in the first `setDaylight`: 70–115 ms (305 ms with the browser's shader cache
cold). `GroveSky` now compiles them with `compileAsync` at construction (reaching into the
pinned PMREMGenerator's internals) and holds a blank target of the same shape as the
environment until they link, then bakes (12–31 ms, no compile). `loadState` waits for both.
Measured on Maor's PC (dev build, preview, seeded free slot 3, frames driven by hand, three
warm runs each, HEAD vs this pass): constructor 393–407 ms → 189–261 ms (terrain mark
258–276 → 18–32 ms; props rose 92–95 → 132–193 ms, its height sampler is no longer warmed
by the terrain loop); first `setDaylight` 70–115 ms → 0. Look: two frozen views (11:00 and
18:30, windmill blades pinned, creatures hidden) are pixel-identical to HEAD; both builds
link the same 49 programs. Not done: props (grass placement) still on the page. Not
verified: the no-worker fallbacks; any phone. No new stubs or known bugs. The earlier boot
pass (textures in workers, compile ahead) is in `docs/progress-archive.md`.

## CV1: campaign v2, its sim changes and the side-story runner (2026-10-16)

Works:

- `config/story.ts` takes `CHAPTERS`, `SCENES`, `ENDINGS` and the speakers (Wisp, `chorus`) from
  `src/content/campaign.ts`. `UNDERSTUDY` is gone (fixes B1): the Keeper picked on the title
  only sets the player's portrait, and "you" is named You. Chorus lines show in italics with no
  portrait.
- `sim/story-scenes.ts` registers every campaign scene, every Grove side-story scene (S1–S31) and
  every `_VARIANTS` scene. `sceneFor` applies the line swaps from the notes: `c11-close` (S8's
  empty arm, the `s9-ask` evening line), `c12-open` (S26's walled garden spliced in), the S10
  letters with Open, the S6 register on loan and S17's nursery line. The dialogue box uses it.
- `sim/campaign-routes.ts` holds the scene-notes routing: chapter 4's tale, `c5-circuit` and
  `c5-considered`, `c5-sold`, `c6-open-walked`, the stillness parts, `c8-ledge(-s4)`, `c8-nova`,
  `c9-partner` and `c9-open-sold`, the four shard scenes, the whole Long Night, the chapter 11
  Moss add-ons, `c11-gate`, the chapter 12 foot and walk scenes, and `endingScenes` (body variant,
  then wisp, gate, visitors, mill, walk, cinder, told or secret, garden, then `-last`).
- The chapter 10 vigil (`stepVigil`, `STORY` in tuning): progress runs only while all four
  lanterns are lit; wave one blows out the stream lantern, wave two marks the Long-Grass one low;
  `c10-lull` halfway; `c10-falls` at dawn. No fail state. Moss leaves the world after
  `c10-bank-moss-gone` and `c10-moss-fades`; his flower goes by the flat stone.
- `endingFor` follows the bible: the Collector also comes from `keptStone`; Hazel's Grove ignores
  the final choice, and with `letThemGo` plays `end-hazels-grove-open`; `mossFaded()` includes
  "carried the stone in and did not come back".
- `sim/side-stories.ts` runs S5, S9, S10, S27 and S28: opening, step gates (story dawns and
  dusks), checks, variants, unfinished closes, S10's lapse and S9's jump to the dawn gate. The
  holds: S5 holds `c5-close`; S27 and S28's autumn steps hold chapter 9; `c11-close` waits for S9
  (or `keptStone`, or the dusk after `threeFriends`); S10's night holds chapter 12; S9's gate
  scene plays before `c12-open`; S10's letter plays before the ending.
- S27's buy-back (`applyChoice`, scene `s27-home`, pay or hat, only on the sold path) brings the
  `soldId` stray home, or sets it walking to the gate when the Grove is full. The runner path
  creates Nine as a grey stray.
- The journal lists the open side stories with their goal and hint, and a "Do it" button.
- Saves: old campaign saves gain the new fields; queued ids the v2 script lacks are dropped.
- Tests: `tests/sim/campaign-v2.test.ts` (25), including `endingFor` against the bible's order
  over every flag combination (1,000+), Open, the Long Night branches, each hold, the buy-back
  and the line swaps. The run driver moved to `tests/sim/campaign-driver.ts`.

Stubbed:

- Side-story checks the sim can't watch (carry, find, minigames) are met by the journal's "Do
  it". Places, props, items (old trowel, Hazel's lantern) and side-story rewards aren't built.
- Only these five stories run. The other `_VARIANTS` (S2, S8, S13, S19, S23–S26, S29–S31) are
  registered but not chosen. The campaign-side hooks those stories feed (`visitors`,
  `hushGarden`, `millLetter`, `cinder`, `wisp`) are read wherever their flags are set.
- `s28-null-minder` (needs S7), S27's spring scene, Wisp's stray spawn after `c10-bank-wisp`,
  and per-line voice clips (none exist yet).

Assumptions: a story day is `STORY.dayMs` (120 s) of sim time with dusk at 75%, since the sim
has no time of day of its own. `c5-circuit` plays straight after `c5-open` (the note's
fallback). S27 opens in chapter 6 rather than "the first Circuit visit". The vigil's wave
lanterns (`lantern-2` stream, `lantern-4` Long Grass) are a guessed mapping.

Known issues: the main bundle grew from 1.14 MB to 2.02 MB (minified), because the scene registry
bundles all the Grove side-story scripts. Lazy-loading them is a follow-up.

## Part G8b: matching the "Chao World" line-up (2026-10-16)

The reference is `docs/reference/chao-world-lineup.jpg` (the YouTube thumbnail, seven
figures left to right: quills, echidna, fox, dream, Eternal Neutral, shade, Eternal Moon).
Steps, newest first, one commit each:

**Split `nubbin-variants-special.ts` (no behaviour change).** The 1,132-line file is now three:
`nubbin-lineup-kit.ts` (394 lines: the shared helpers, exported), `nubbin-variants-lineup.ts`
(511: the six line-up looks as `LINEUP_LOOKS`) and `nubbin-variants-special.ts` (286: Eternals,
Shadow, and `SPECIAL_VARIANTS` spreading the looks in the same order). Checked by serialising all
ten variants (ids, order, every field, `patch` source) before and after: identical. Lint, tests
(228 pass) and build pass; the line-up URL still renders as `match-lineup.jpg` with no console
errors. Nothing stubbed, no new bugs. Commit c193b3c. The section "3D load: sculpt spec, geometry
cache, device grid, loading bar" (2026-10-16) moved to `docs/progress-archive.md` to keep this
file under 150 lines.

5. **The group shot** (`docs/samples/match-lineup.jpg`, plain stage). Two small stage flags:
   `&ids=a,b,c` in `sheetVariants` lines up exactly those variants (reversed inside, since the
   camera looks along +z and x runs right to left on screen, so the list reads left to right as
   written) and `&eye` puts a sheet's camera at the figures' eye height. View:
   `?aaa=1&creature=variants&ids=look-quills,look-echidna,look-fox,look-dream,eternal-neutral,look-shade,eternal-moon&toon&pose=happy&turn=29&eye`.
   Reads as the reference's line-up; the fox's eyes are shut by the happy pose (open in the
   thumbnail), and the stage's pastel grass and sky stay as the brief kept them. (The split of
   `nubbin-variants-special.ts` this slice flagged is done; see the entry at the top.)
   4f. **eternal-moon against slice 7** (`docs/samples/match-eternal-moon.jpg`). Flat indigo
   `#2e2660` armour, a blue crest panel down the crown between two small icy horns, white oval
   eyes under the happy arcs, icy shoulder spikes, a pale chest mark, a spiked ball, and lilac
   crystals standing round the feet (`crystalSpike` with glow, `footCrystals`, new; they replace
   `crystals`). No wings (the thumbnail has none). Still differs: the thumbnail's armour is
   a plated, textured surface with blue highlights where ours is flat indigo; its raised fists
   and wide shoulder spikes read clearly, ours are lost in the hop; its foot crystals are a
   dense jagged ring, ours a few cones; the crystals' glow does not show in toon mode.
   4e. **look-shade against slice 6** (`docs/samples/match-shade.jpg`). A near-black `#2c2a34` cat
   suit (a little lifted so the toon bands show), tall pointed ears with grey inner cones
   (`catEar`, new), three white spikes standing up behind the crown, white oval eyes with the
   white slash over the left, a small red mouth, arms folded across the chest (`foldedArm`,
   new), a white collar with a lilac diamond, white shoes on black legs, a spiked grey ball.
   Not the brief's cheek tufts: the thumbnail has none. Still differs: the thumbnail's
   figure is leaning and three-quarter, ours faces front; its ears are shorter and set
   further apart; the diamond is a rotated square, ours a lilac oval; the crown spikes sit
   at the back in the thumbnail, ours stand on top; the grey of the ball is lost (stage ball).
   4d. **eternal-neutral against slice 5** (`docs/samples/match-eternal-neutral.jpg`). A flat lime
   `#7ee02c` dragon with a yellow-green belly patch, salmon hands and toes (marks on the feet),
   a small crown spike and two small horns tipped salmon, white oval eyes with the happy ^
   (white marks under the arcs, as in the dream look), a gold chain (a torus collar plus a row
   of beads), no wings, scale back to the template's (the Eternals' 0.9 only made the stage
   crop the figure). `gloveArm` gained `hand` (glove size) and became a function declaration:
   the Eternals run `variant()` at import, before a `const` further down the file exists.
   Still differs: the chain should drape across the chest in a U, ours is a collar; the thumbnail
   body is wider and flatter with arms held out, ours has a rounder body and the happy pose
   drops the arms; the toes' gradient from green to pink is a soft mark; the pink ball is
   cropped (and the stage's ball is glassy); no scale ridges on the belly.
   4c. **look-dream against slice 4** (`docs/samples/match-dream.jpg`). Again not the brief's jester
   point: the figure is a flat magenta `#a82a8c` with an onion-shaped head (a wide dome and a
   narrow cone melted into it), tiny ear points, a gold horn on the forehead, big white oval eyes
   with the happy ^ across them (white ellipsoid marks under the arcs), a dark smudge on the
   belly, grey studded bracers (`braceletArm`, new), arms out and long pointed teardrop legs, no
   shoes. Still differs: the thumbnail's peak is lower and its head broader and flatter-bottomed;
   our ball is the stage's glassy pearl, not the reference's black one (the spec colour does
   not reach its material); the bracers' studs are two gold beads, not a row; the happy hop
   tilts the figure, which the still thumbnail does not.
   4b. **look-fox against slice 3** (`docs/samples/match-fox.jpg`, idle pose: the reference's eyes are open
   and our happy pose shuts them). The line-up's third figure is not the orange fox the brief
   described: it is a black hood edged by a pink V over a cream face, big navy eyes, an orange
   crown with a white stripe, goggles pushed up on the right, an orange vest with black sides
   and a gold bell, white gloves and cream shoes; the look follows the image. New:
   `gogglesUp` (rim, glass, highlight, as prims and as marks), the V as short capsule marks that
   follow the dome (a straight chord cuts inside the skin and paints nothing; marks paint
   every surface, so the goggle marks are re-laid after the hood), eyes with a cream `lidColor`.
   Still differs: the hood's top is a flat black mass where the thumbnail shows orange and
   white stripes; the V is thinner and the cream chin shorter; no hood side flaps; our eyes
   keep the glossy sky catchlight; the twin tails are kept (not visible from the front).
   4a. **look-echidna against slice 2** (`docs/samples/match-echidna.jpg`). Crimson `#b8344f`; head
   ×1.2 with a wide low dome (1.12 × 0.8 × 0.92), a white muzzle ellipsoid, five white tuft
   spikes (the crown slot; `crownShade` white so the baked crown ring does not stain them),
   `bigEar` (new: a pale disc over a body-coloured lobe), a green `halo` ball, a white belly
   patch with a green dot, `gloveArm` (new `y`, `reach`) and `mechLegs` (new `size`) with white
   shoes. Still differs: no headband (the reference has none; the brief's was a misread of the
   tuft); the eyes are our dark arcs, the thumbnail's are pale crescents; the ears sit a little
   wider and rounder; the gloves hang where the happy pose drops them, the reference's are raised.
6. **look-quills against slice 1** (`docs/samples/match-quills.jpg`, stage left, reference
   right). New in the format: `headScale` on `variant()` grows everything above the neck about
   the head's pivot (primitives, box, eyes, mouth, ball, ears, marks) before the `eyes`,
   `mouth` and `patch` overrides; `eyes.brow: false` leaves the brow ridge off; `mouth.line`
   is the toon line colour for a mouth (the painted red `o`). The look: head ×1.25 and the
   dome reshaped wider than tall (radii 1.0 × 0.8 × 0.9), eyes r 0.34 with no brows, a
   peach muzzle ellipsoid raised off the face, the quill ball as five rounded cones in a
   darker navy with underside shade marks (`quillCluster`, `quillShades`) plus yellow ear
   tips, the body a small ball held clear of the legs with the mech emblem (yellow ring,
   dark disc) on the belly patch, arms straight out ending in glove balls with a cuff ball
   (`gloveArm`), mech lower legs as grey capsules with a red torus ring under red shoes a
   third larger with the white stripe as a flattened ellipsoid standing proud of the top
   (`mechLegs`), and a flat baked shade (top 1.0, bottom 0.94). Toon lighting fix found
   here by zeroing each light in turn from the console: the sky's environment map carries
   the sun disc, so even a twentieth of it washed every flat to pastel and no band showed;
   the toon shader now drops `lights_fragment_maps` (no image-based light at all; the
   material's `envMapIntensity` made no difference), the sun alone draws the bands (lit
   0.95, shade 0.62 below a 0.3 dot product, nothing from lights behind the surface) and
   the hemisphere light is the fill. Still differs from the reference: the dome's top is
   rounder than the line-up's flattened one; the quill ball sits on the dome rather than
   behind it; the closed happy eyes are our dark arcs where the thumbnail shows white
   crescents; the emblem is a disc, not a hexagon; the ball above the head stays (the
   reference crops it); the muzzle's edge is softer than the flat-shaded original.
   1–2. Toon stage mode (`&toon`) and the reference overlay (`&ref`): moved to `docs/progress-archive.md`.

## 3D boot: textures in workers, programs compiled ahead (2026-10-16)

Works: the Grove's ten painted textures paint in workers (`render3d/surface-worker.ts`,
`grove-textures.ts`; the painters moved unchanged from `aaa-styles.ts` to the pure
`samples/surface-paint.ts`). The scene gets the texture objects at once (one placeholder pixel,
the real settings) and the bytes are poured in as they land (dispose, new image, `initTexture`).
`render()` draws nothing until `compileScene` has linked the scene's and the post chain's
programs with `compileAsync` (KHR_parallel_shader_compile); `loadState` waits for both.
Measured on Maor's PC (dev build, preview, seeded Keeper + 8 Nubbins, frames driven by hand,
3 runs each): constructor 1.58–1.63 s → 0.41–0.59 s (textures were 1.1–1.2 s of it, now 2 ms);
first render 0.59–0.66 s → compile call 0.06–0.08 s + first frame 0.07–0.16 s; together
about 2.2 s → 0.57–0.81 s. Constructor start to veil lifted: 3.0 s → 1.5–1.6 s. Look: two
frozen views (11:00, creatures hidden) are pixel-identical before and after. Still paid: the
terrain heightfield (0.26–0.35 s) and props (0.1 s) in the constructor; two shadow-depth
programs and the OutputPass in the first frame; the sky's PMREM bake in the first
`setDaylight` (not measured). Not verified: the no-worker fallback (paints on the page, one per
task); any phone. No new stubs or known bugs.

## Part G8b, steps 1–2 (2026-10-16)

Moved from the "Part G8b" section of PROGRESS.md, which keeps steps 3 onward.

2. **Reference overlay.** `mountReference` in `aaa-styles.ts`: `&ref=<file>` lays an image
   from `docs/reference/` over the stage at 45% (served from the repo in dev, never built);
   `&refx=<n>` crops it to the n-th of seven equal-width slices and scales that figure to
   about the size the stage draws one (the line-up's figures stand 0.4 of the image tall
   with their middle at 0.7 of its height), `&refz=<k>` zooms it, `&refc=<0..1>` moves the
   slice centre when a figure is off its seventh (the thumbnail's figures sit at about
   0.10, 0.23, 0.36, 0.49, 0.62, 0.75 and 0.90); `&split` gives the stage the left half of
   the window and the reference the right, opaque, for the side-by-side shots. Tuning
   view: `?aaa=1&creature=variant:look-quills&toon&pose=happy&ref=chao-world-lineup.jpg&refx=1`.
1. **Toon stage mode, `&toon`.** `TOON` in `creatures.ts` is set by the stage before any
   creature is built. `surfaceMaterial` (and `SurfaceOpts.toon` per surface) then drops the
   triplanar grain, bump, sheen, clearcoat and specular, takes less of the sky's ambient
   (`TOON_ENV`), and `toonShader` patches the physical shader so direct light falls in two
   bands (`TOON_BAND`: lit 0.6, shade 0.33 at a 0.38 dot product; the lit band sits under
   full sun so the flats keep their colour) with the vertex colours a touch more saturated.
   `toonMaterial` flattens the eye white, lids, brow, liner, arc and lips the same way; the
   lash line and happy arc are thick (tube 0.11 of the eye radius) and the mouth one solid
   line, both in `TOON_OUTLINE.color` (#1a1026). `outline(group)` adds an inverted-hull
   back-face copy of every opaque mesh (0.025 world units, pushed in view space so the
   width is the same whatever the part's scale); the stage adds it after the figures are
   measured, so the hulls never count toward the feet. Post: SSAO, bloom, depth of field,
   fog and the grade off; exposure 0.85; sky and grass unchanged. Without the flag nothing
   changes. Tuning view: `?aaa=1&creature=variant:look-quills&toon&pose=happy`.

## 3D load: sculpt spec, geometry cache, device grid, loading bar (2026-10-16)

Works: each surface goes to a worker as plain data (`samples/sculpt-spec.ts`); hooks are
named rules (`sculpt-rules.ts`, row note in species-format.md). Workers read IndexedDB
(`render3d/sculpt-cache.ts`, key look#index@res, version = code hash + spec hash) and the
page writes in one batch after loading. `sculpt()` now welds before baking (17 MB cache, was 79) and fills far blocks of the grid (exact: tested on 852 surfaces). `settings.sculptRes`
comes from a boot benchmark (`sculpt-res.ts`, `SCULPT_RES`); saved creatures start in
`prewarm.ts` before the scene is built; a veil with a bar waits for every figure.
Measured on Maor's PC, hidden pane, frames driven by hand, Keeper + 8 Nubbins (7 looks):
before 4.2 s from first frame to all rigged (about 5.9 s from page start); now fresh device
(grid 104) 4.05 s and second load 3.17 s from page start; grid 64: 3.32 s and 2.95 s.
Every load still pays the scene constructor (1.65 s) and its first render (0.7 s).
Not verified: any phone. The phone grid (64) assumes a phone 4x slower; the done-when
(4 s fresh, 1 s second load on a 2022 phone) is not met on the page as a whole.

## Longer strides in the species format (2026-10-16)

New field `stride?: { length, period, duty }` on `SpeciesSpec` (row in
`docs/species-format.md`). Jointed legs: `length` scales the step from one leg length, the
hips crouch as far as its extremes need, `duty` is the planted share (below 0.5 a jog, less
crouch). Unjointed legs (every Nubbin) now report the stride their hip swing really covers
(2π · hip height · swing) and `length` widens the swing. `Rigged.strideLength` is in rig
units now (gait.ts was undercounting any spec with `scale` ≠ 1, the Nubbin by 0.78).
Keeper `{ 2.2, 0.7 s, 0.45 }`: 21% crouch, no slip, 2.45x its pace at KEEPER.speed (was
6.2x, capped at 4), 3.5 Hz. Nubbin `{ length: 1.3 }`: 1.8x at walkSpeed (adults 1.6-1.7x).
`maxCadence` stays 4: walking no longer reaches it, and Fennel (3.9x) needs it; the running
Keeper (4.4x) and Mossling (5.6x) still cap. Checked with side-view renders and a foot-slip
probe, not live in the Grove (the pane was hidden). Known: the pool's scale replaces
`spec.scale`, so a Nubbin draws 1.28 tall, not `GROVE3D.nubbinHeight`.

## The 3D mode carried forward (2026-10-16)

Plan: (1) sculpt in workers with a geometry cache and stand-ins; (2) work down the stub
list; (3) foot sliding and hill-top taps. One commit per step.
**Step 1, worker sculpting.** `buildSpecies(spec, sculpted?)` takes surfaces marched
elsewhere, in `speciesSurfaces(spec)` order (`sculptSurface` marches one). `SculptFarm`
(`render3d/sculpt-farm.ts`) fans each look's surfaces across up to four workers
(`sculpt-worker.ts` rebuilds the spec from its look key via `looks.ts`) and caches the
result by key, so a second Nubbin with a look never marches; with no workers it marches on
the page, one surface per task. `CreaturePool.acquire` returns null until a look is ready
(Actors shows a soft breathing capsule), builds at most one rig a frame, compiles the
rig's programs with `compileAsync` against the composer's target before first draw, and
strips the emote ball's point light (each one changed the light count and recompiled
every material in the Grove: the 500-900 ms hitch at every hatch). `?free` in Full 3D, this PC:
Keeper back from the workers in 1.5-2.7 s, rigs 100-220 ms on the page, worst frame after
the first 227 ms (was 900 ms; the first frame's own compile is 650 ms). `?aaa=` stages still
build synchronously.
**Step 2a, looks.** Look keys take tint modifiers (`~egg:<colour>`, `~tone:<colour>`,
`~shiny`, `~shadow`; `looks.ts`) that recolour any Nubbin spec the way the pixel
`variantColors` does (Sun keeps a white belly, Moon a dark crown shade; shiny wears
`SHINY_FINISH`); `~shadow` ashes any species. Eternals use `variant:eternal-<band>`; second
evolutions already resolved. The pocket and digital lines sculpt from the pixel drawer's
recipe (`render3d/art-species.ts`: plan, ears, crest, tail, arms, legs, wings, eyes, marks,
palette), scaled by the recipe's size. Egg shells wear the egg colour. Shots
`docs/samples/mode3d-forward-{species,tints}.jpg`.
**Step 2b, motion and weather.** `cry` lays a droop over idle (head hung, arms in, a
sob; undone each frame before `animate`); `swim` paddles with the walk at 0.6 speed, sunk
to the shoulders over deep water with a ring spreading round it. Toys by kind
(`render3d/toys.ts`: striped ball, radio, blocks, hand mirror, glowing TV). Snow is its own
slow, drifting white cloud. `Bursts` (`render3d/bursts.ts`) throws leaves and petals from a
shaken tree and dust where a Nubbin lands; both shake the 3D camera (`GROVE3D.shake`, off
with the Settings switch). Shot `docs/samples/mode3d-forward-poses.jpg`.
**Step 2c, places and people.** `Crowd` (`render3d/crowd.ts`) draws everyone besides the
Keeper and the Nubbins from the shared pool: visiting Keepers (`keeper-<band>~npc:<trainer>`,
clothes dyed to the trainer's shirt), wild visitors and the Hollow's wild one (art looks),
the Shadow strays (`variant:shadow`, sad when still) and the grey Nubbins of the story
Hollow and Corvin's rows at the pixel view's spots. `Garden` (`garden.ts`) builds placed
decor (all eleven kinds, the three buildings at the pixel widths), plants by stage (dry
ones yellow, fruit when ready) and painted tiles (instanced quads, flowers dotted),
rebuilt on a signature check. `Hollow` (`hollow.ts`) builds a floor from `sim/dungeon.ts`:
edge walls, water, stairs up and down, the chest (lid opens), torches with four roaming
lamps, crystals and loot (hidden once taken). Underground the sky goes dark. Sun, Moon and
Corvin are grades (`GROVE3D.groveTint`). Picks cover npc, wild, stray, memorial, decor,
building, plant, stairs, chest and loot. Shots `mode3d-forward-{garden-moon,hollow}.jpg`.
**Still stubbed:** `location:visit` (a neighbour's Grove is a bare floor);
`form:<band-type>` only if a variant id is ever missing. Known: the Sun/Moon grade follows
`setDaylight`, so it changes on the next sim step; a crowd of one new look (Corvin's 30)
rigs one per frame, 100-200 ms each.
**Step 3, known limits.** Feet: each rig keeps its own animation clock (`gait.ts`) that
runs at real speed off the walk and at the sim's speed over the format's stride
(`strideLength * scale / stridePeriod`) on it, capped at `GROVE3D.maxCadence` (4x): the
figures' strides are short for the sim (the Keeper walks 6x its natural pace, a child 9x),
so feet still slip a little at full speed; a stride-length field in the format would close
it. Hill-top taps: measured, not a bug any more: `Picker3d` marches the heightfield, worst
error 0.04 units over a 20x20 grid of taps against a 0.01-step march (the sim's flat
ground only means walks ignore slope). **Final numbers, this PC, `?free` in Full 3D:**
first frame 650-900 ms (scene programs), worst frame after it 228 ms with three children,
a wild visitor and an NPC rigging in; Keeper on screen 1.5-3 s after load (stand-in until
then). Not checked: a phone, Firefox and Safari module workers (the farm falls back to the
page if a worker cannot start).

## Special forms after the "Chao World" line-up (2026-10-16)

Maor sent a line-up of seven character forms as the target ("get models closer"). The
looks are now built like toys in `nubbin-variants-special.ts`: `dress()` gives every look
bigger mitts and feet with gloves and shoes in their own colours; `roundEar`, `pointEar`,
`twinTail`, `bigQuills` (five rounded quills), `goggles` (strap and lenses), `crystals`
(glowing cone spikes on head and torso) and `chestMark` are the shared pieces. Fox: orange,
goggles, pointed ears, twin white-tipped tails, red shoes. Echidna look is now the rose-red
one: big round white ears, a white headband, white gloves, a green ball. Rose: pink with
round ears, red headband and bow. Dream: purple and magenta with a tall swept point, a pale
eye mask and a chest star. Quills: blue with five big quills, white gloves, red striped
shoes. Shade: a black cat with pointed ears, white cheek tufts and chest, slanted green
eyes. Eternal Neutral is a lime dragon (orange horns, claws, a long tail), Eternal Moon deep
purple with glowing lilac crystals, Eternal Sun as before with chunkier hands. Headbands and
the goggle strap hug the skull (torus radius 0.62). Shots: `variants-looks.jpg`,
`variants-eternals.jpg`, `variants-special.jpg`. Lint, 216 tests and build pass.

## Jewel facets (2026-10-16)

The last variant placeholders are gone. `facet` is a sixth surface detail kind in
`creatures.ts` (`paintDetail`): a jittered, seamlessly tiling lattice of cells, each a flat
plane with its own tilt so the baked normal breaks at every cell edge, and a bright line
along the edges; row added to the `SurfaceOpts` table in `docs/species-format.md`. The
seven `jewel-*` entries in `nubbin-variants-colour.ts` wear it at `scale` 0.55 (about four
facets per body unit; 2.4 read as glitter) with a hard clearcoat. Shots:
`docs/samples/variants-jewel-closeup.jpg` (`?aaa=1&creature=variant:jewel-ruby&closeup`) and
`variants-colour.jpg` re-shot. Lint, 216 tests and build pass.

## The full-3D mode, for real (2026-10-15)

**Graphics setting** (Pixel | Full 3D, default Pixel): a select on the title screen and in
Settings. It is a device-wide preference (`grove.graphics` in localStorage, read before any
save is open) mirrored into `settings.graphics` on load; changing it in Settings saves and
reloads. The pixel path is unchanged: `Game` takes `(canvas, hooks, graphics, scene3d)` and
only branches on `scene3d`; `main.ts` lazy-loads the 3D chunk. **`src/render3d/`:**
`Grove3dScene` (the WorldView members the Game drives plus `render`/`resize`): a heightfield
from GROVE's hills with the pond and stream cut in and a rim at the edge (`terrain.ts`),
slope-and-path blended material, 9 000 instanced grass tufts with `PUSHERS`, leaf-card fruit
trees from the sim's tree list (tappable), physical water for the pond, the stream ribbons and
the waterfall sheet, the cottage, school, dojo, well and windmill (sails turn), rocks, the
four lantern posts (same ids as the pixel scene, lit by the same rule), the bridge and the
cave mouth (`props.ts`); a Preetham sky with a PMREM environment re-baked when the sun moves
(`sky.ts`), sun elevation from the hour, lamps and fireflies at night, rain as the sample's
particles, bloom only below 16° (`GROVE3D.bloomBelowDeg`), SMAA. `CreaturePool` builds each
look once with `buildSpecies`, scales it to `GROVE3D.{keeper,nubbin,adult}Height` and reuses
rigs; `Actors` maps behaviour states to poses (held/carried/petted → `pet`, nap → `sleep`,
eat, play/greet/court/perform/fetch → `happy`, moving → `walk`), eggs and cocoons as shells,
fruit/toys/notebooks as props, memorial flowers, the pixel emote ball as a sprite over the
head, a highlight ring and tap sparkles. Lakitu camera: the OrbitCamera's yaw snaps and two
zoom levels map to orbit and `GROVE3D.distance`, eased, never under the ground; ground taps
ray-march the heightfield (`Picker3d`); creatures pick by sphere. Screenshots
`docs/samples/mode3d-{noon,golden,title}.jpg`. **Frame time on this PC** (1024×768, dpr 1,
gl.finish loop; the browser pane pauses rAF while hidden so the FPS counter is not usable
there): 2.9 ms full, 1.6 ms without shadows, 1.4 ms without water, 1.6 ms without grass.
First builds on the main thread: Keeper 2.8–4.1 s, child 1.1–1.6 s, base Nubbin 1.1–1.5 s
(the known stall at first load; worker sculpting is the next step).
**Stubs** (each logs `[3d stub] …` once): `species:<id>` (pocket and digital lines draw as
the base Nubbin), `form:<band-type>` (no variant found), `look:shiny-or-tone`, `pose:sad`
(cry), `pose:swim`, `item:toy` (every toy a red ball), `weather:snow` (falls as rain),
`dungeon:floor` and `location:<hollow|corvin|dungeon>` (a bare dark floor under the Grove
sky), `event:tilePainted`, `event:decorPlaced`, `event:treeShaken`, `event:landed` (no
bursts), `npcs`, `strays`, `plants`, `decor:placed`, `tiles`, `grove:<sun|moon>` (main
colours). **Known limits:** no camera shake in 3D; walking feet slide (sim speed and stride
differ); the Hollow has no rooms; the sim's ground is flat so hill-top taps land a little
short; no device pass yet. One sim touch: `Settings.graphics` with its default and
migration.

## Variants after the references (2026-10-15)

Maor supplied three reference pages (the neutral evolution chart, a filled-gardens shot and
a community tier list) and approved the four-step pass plus the pixel palette. Type colours
corrected in `TYPE_COLORS` (`nubbin-variants.ts`): Normal cyan, Swim green, Fly pink, Run
blue, Power orange-red; `adultColors` in `render/sprites/chao.ts` realigned the same way (Sun
forms pale with the hue in the shade, Moon forms dark with the hue in the body). Type tells:
`applyType` now sets the crown and adds quills (Run), a crest with side fins and flipper arms
(Swim), a long crown with bigger tinted wings (Fly), horns with a wider body (Power); `accent`
colours the tells and `mixHex` blends hues. Sun forms keep a white body with pastel accents,
Moon forms a black body with deepened accents and slanted eyes (`bandColors` in the first
family file). Second evolutions blend the two type colours (0.4 toward the second) in place of
the belly patch. Special: the Eternals retuned (swept crown and a green cast; navy with quills
and horns; cyan-green crest) and six modelled looks (fox, echidna, rose, dream, quills, shade)
replace the four palette placeholders, so only the seven jewels remain placeholders (flat
gloss). Tests: the tells, `mixHex`, and a geometry sanity sweep over all 116 variants.
Screenshots re-shot: `variants-first.jpg`, `variants-second.jpg`, `variants-special.jpg`.
Same day, at Maor's "fix it": the blend raised to 0.55 with the half-strength tells in the
second type's own colour, and the Sun accents lifted only 10% toward white, so both read on
the sheets; `variants-first.jpg` and `variants-second.jpg` re-shot. Lint, 216 tests and build pass.

## The Nubbin variants as specs (2026-10-15)

Part G8. `src/samples/nubbin-variants.ts`: `variant(base, name, overrides)` deep-copies a
spec and changes only what the overrides name: colours by role (every colour the base uses
is swapped, and a variant of a variant works because each derived spec remembers its
palette), the crown (`point`, `tall`, `hook`, `fin`, `stub`, `droop`, `none` or custom
prims), the ball and wings (merge, or `null` to remove), the four part slots, hint marks,
the type silhouette (`type` at full strength, `second` at half: head fins, bigger wings,
longer legs by lifting the body, a wider body and bigger hands) and a `patch` hook. Two spec
fields added with rows in the format doc: `ball.shape` (`halo`, `spikes`) with `ball.glow`,
and `wings.shape` (`feather`, `bat`). Templates: the child (neutral, Sun-leaning and
Moon-leaning as colour hints), the Sun adult (white and blue, spire, halo, feathered wings),
the Moon adult (black and purple, hooked crown, spiked ball, bat wings), the Neutral adult
(mint, nodding crown). Families: `nubbin-variants-first.ts` (15), `-second.ts` (60: a first
evolution with the second type at half strength and a belly patch in its colour),
`-special.ts` (three Eternals with custom crowns and a glassy finish, the Shadow stray, four
character looks), `-colour.ts` (7 egg colours × plain, two-tone and shiny, plus 7 jewels);
`nubbin-variant-catalogue.ts` lists them (114 ids, unique by test). Stage:
`&creature=variant:<id>`, and `&creature=variants&family=…&filter=…&max=…` lines a family
up in staggered rows of eight with the camera rising per row and capped before the hills.
Screenshots `docs/samples/variants-{templates,child,first,second,special,colour}.jpg`.
**Placeholders:** the four `look-*` entries (palette only, no head accessory yet) and the
seven `jewel-*` entries (a flat gloss; no facet detail kind yet). **Known limits:** two
palette roles sharing one colour value swap together (Sun Fly sets its belly and sheen apart
for this); the type silhouettes are first approximations by eye, not yet tuned against
references; a 28-figure sheet sculpts for about a minute. Lint, 215 tests and build pass; no
console errors on the sheets.

## The Keeper in the species format (2026-10-15)

`src/samples/keeper-spec.ts`: `keeperSpec(colours)` builds the Keeper as a `SpeciesSpec`;
`KEEPER_SPEC` (Sun) and `KEEPER_MOON_SPEC` are the same figure in two colour sets. Proportions
from `sculptedKeeper` (head about 39% of the height, soft and friendly); jointed arms
(`elbowL`/`elbowR`) and legs, hands with four fingers and a thumb, hair as sculpted tufts with
goggles pushed up on it (a torus band and two lenses), and the outfit after the three
kid-adventurer references Maor sent mid-pass (tee under an open vest, shorts, wristbands,
chunky sneakers) as colour splits between primitives plus crisp marks. Format additions:
`SpeciesSpec.poses` (a species' own pose functions over a `PoseContext`: `set`, `bend`, hips,
head, look, mouth), `SpeciesSpec.hearts`, the pose names `carry` and `throw` (stock: stand;
`ALL_POSES` has all eight, `POSES` stays the creature cycle), and elbow joints on arms. The
Keeper's own poses: pet reaches to `lookAt` with the right hand and strokes; carry is a hug
hold; throw is a 3.6 s cycle (`KEEPER_THROW`); sleep sits cross-legged and nods off; idle and
walk are stock. Stage: `?aaa=1&creature=keeper` (or `keeper-moon`) puts the Keeper beside a
Nubbin that answers each pose (leans to the hand, rides in the arms, flies the arc and lands,
eases back home). Screenshots `docs/samples/keeper-idle.jpg`, `keeper-pet.jpg`, `keeper-45.jpg`.
Lint, 215 tests and build pass; no console errors on the Keeper stage. Stubbed: the Keeper is
not in `ROSTER` or the pixel game. Known: the thrown Nubbin stays upright (no tumble) and its
shadow blob rides with it in flight; the Keeper's contact points are the standing soles, so a
posed foot is not re-planted (fine for the sit, which is flat).

## Crisp marks, reference notes, format doc (2026-10-15)

Item 35 of `docs/creature-improvements.md` and the format doc. `Mark.soft: 0` is a crisp edge: `markShade` now takes the
sculpt's vertex spacing (the box's longest side × 1.08 over the grid, the same number
`sculpt` uses) and ramps a zero-soft mark over one cell centred on its edge, so a face
patch, sock or belly split reads sharp without stair-steps. Fennel's nose and chest patch
use it (`docs/samples/marks-fennel.jpg`, `?aaa=1&creature=3&closeup`). `SpeciesSpec.notes`
(optional string, never shown) records which reference frame and pass each species was
last tuned against; filled for all five from the 2026-10-15 passes (the Palworld roster
screenshot for the shape pass, the All Pet Animations video for eyes, petting and the
walk). `docs/species-format.md` rewritten: one row per field of `SpeciesSpec`, `PartSpec`,
`Prim`, `Mark`, `SurfaceOpts`, the eyes, the mouth and `Expression`, each with its default
and an example, plus the stock expression table and the pose table. Lint, 210 tests and
build pass; no console errors on the Fennel closeup.

Not verified: the crisp edge on the other species (none uses `soft: 0` yet) and at the
far camera distance, where one cell is under a pixel. Known: the closeup frames the face,
so the chest patch is only half in `marks-fennel.jpg`.

## Shape pass: digits, per-form blend, tufts (2026-10-15)

Items 9–15 and 32. New: `Prim.blend` (a primitive's own blend radius, in `sculpted.ts`;
`onSurface` honours it too) and `src/samples/species-kit.ts` (`digits`, `tuft`, `tuftRow`).

- **Nubbin.** Before: feet and hands were blobs. After: three yellow toes and a pad on each
  foot, a three-finger mitt on each hand, a crisper crown (blend 0.14 against the body's 0.22).
- **Mossling.** Before: the cap overhung and could hide the eyes in nods. After: cap radius
  1.2 × 1.05 (was 1.4), raised 0.12 and set back 0.2 (`CAP_Z`), rim and sprout crisp; dew
  and gills follow it. Root toes and hand mitts come from `digits`.
- **Fennel.** Before: small head, close-set eyes, fuzzy cheek cones. After: head radii 0.78 ×
  0.68 × 0.66 (was 0.64 × 0.56 × 0.56), eyes wider (x 0.36) and lower (y 1.78), ears
  spread, crisp cheek, crest, chest-ruff and tail-tip tufts (`tuftRow`), three toes and a
  pad per paw. Shells remain for the short underfur.
- **Bolder.** Before: 0.9 scale, a leg span wider than the whole line-up, a seam between
  head and thorax. After: scale 0.72 (big by design: widest, not tallest), the head's
  ellipsoid also sits in the torso sculpt so the thorax blends into it (no seam), horns and
  palps crisp (0.04), two-toed claws from `digits`.
- **Wisp.** Before: the core ellipsoid lay inside the body and never showed. After: it sits
  on the belly, poking 0.27 through, plus a mesh with its own emissive material (pulsing,
  not tone-mapped); glowing three-finger hands.
- **Tried and dropped:** repeating the thorax in the head sculpt for the neck made the
  horns vanish; the torso-side fillet alone does the job.
- **Grove unit** is the standing Nubbin (about 2.7 world units tall). Scales are by eye
  against that; the roster line-up is `docs/samples/shape-roster.jpg`.
- Screenshots: `docs/samples/shape-<name>.jpg` (turn 30°) and `shape-roster.jpg`.
- Not verified: every pose at all three angles by eye (done for idle, happy and the 0, 30,
  45 and 90 degree turns on a subset); no device test. At turn 30 Fennel's far brow juts
  past the cheek (pre-existing).
- `npm run lint` and the `tsc` half of `npm run build` fail on `src/content/atlas-a01.ts`
  and `atlas-a06.ts`, untracked files from the content sessions (not mine, not committed);
  `eslint src/samples`, `npm test` (210 pass) and `vite build` are clean.

## Eyes that look (2026-10-15)

Item 3 of the brief: the irises follow. `eye()` returns `iris` (the disc in its own group;
the catchlight stays in the eye group as a reflection). In `buildSpecies`, each frame every
eye takes `Rigged.lookAt` in its own frame and eases its iris toward it at 6 per second,
at most 0.22 of the eye radius, dropping with the dome so it never floats; per-eye aiming
makes the pair converge on a near point. With no `lookAt` the iris wanders slowly.
`lookAt` already existed (null or a Vector3, head turn still gated to the `pet` pose); the
stage now sets it to the camera for closeup and lineup views. Check:
`?aaa=1&creature=1&closeup&pose=idle&turn=30`, `docs/samples/look-nubbin.jpg`. Lint,
210 tests and build pass. Not checked: the other four species by eye.

## Petting, sleep and the life pass (2026-10-15)

Items 23–28 of `docs/creature-improvements.md`, after the Palworld "All Pet Animations"
reference. A `pet` pose: the creature turns to `Rigged.lookAt` (the stage sets it to a
hand in front of the camera), leans the head in with a tilt, shuts the eyes into arcs,
folds its ears back, wags, and seven painted heart sprites (canvas textures, no assets)
rise and fade from the crown. Squash and stretch on the happy hop (hips 1.06/0.94 at the
top, 0.94/1.06 on landing, the hips moved so the feet stay planted) and a forward head
stretch on the eat chomp. Breathing is a chest scale (1.5% at 0.25 Hz; the torso now
sits in its own `chest` group so the head and feet do not move with it), slower and
deeper asleep. Sleep lies down fully: the belly drops to the grass (measured from the
torso sculpt), quadrupeds fold their legs with the knees bent, bipeds curl over theirs,
and a Zzz of three painted glyphs drifts up every 3.2 s. `Rigged.face(yaw)` eases the
facing over 0.4 s with a lean into the turn; the stage calls it every frame (the pet pose
turns each creature to the camera and back) and `groveStage.turnTo(deg)` turns the
line-up from the console. Ear flicks fire at irregular intervals from a generator seeded
by the species name; the happy tail curls up over the back. Pose timing now runs on the
stage clock (`setPose` compared `performance.now()` with the stage's relative `t`
before, so every ease-in started a fraction late). Screenshots:
`docs/samples/pet-roster.jpg`, `sleep-roster.jpg`, `pet-nubbin.jpg`. Format doc updated.

Stubbed: the sim has no `pet` command yet, so the pose is reached only on the stage
(`&pose=pet`), and the hand is a point in front of the camera, not a Keeper. Known bugs:
Fennel's lids do not cover its eyes asleep (they turn the stock 1.9 rad but sit higher
than the Nubbin's; the same before this pass); Bolder's folded legs fan upward rather
than tuck under; the hearts and Zzz are plain sprites, so a creature standing between
them and the camera does not hide them.

## Knee joints and planted feet (2026-10-15)

Item 22 of `docs/creature-improvements.md`: the walk rotated whole legs at the hip, so
the feet slid. Now a `PartSpec` may carry `joint: { name, pivot, prims, box }`, a lower
segment sculpted on its own and hung under the part's bone (`kneeFL`.., `kneeL/R`,
`knee1L`..`knee4R`). Each jointed leg's foot is the lowest vertex of its shin; the walk
keeps the foot still for the stance share of the cycle (0.6, spiders 0.5) while the
body advances, then swings it forward on an arc, with hip and knee solved together
(two-bone, bending about the rest chain's plane) and a crouch sized so the step's
extremes stay in reach. `Rigged` exposes `strideLength` and `stridePeriod`; the stage
moves a `&pose=walk` creature at that speed and the camera walks with it, lapping every
ten units. Each placed foot is also checked against `ground` so a slope cannot swallow
it. Fennel and Bolder are ported (knee a touch behind the line on a front leg, ahead on a
hind leg; Bolder's knee ball in both segments). Checked in the browser by sampling every
foot's world position per frame: Bolder's eight feet move under 0.0005 units per frame
while planted with the body moving 0.024; Fennel's the same in the fast-frame bursts the
pane managed. Shots: `docs/samples/walk-fennel.jpg`, `walk-bolder.jpg`.

**Stubbed:** the Nubbin, Mossling and Wisp keep the hip-only swing; knees stay straight
in the other poses (sleep and happy would look better folded). **Known:** the browser
pane runs this stage at 3–15 fps, so its frame gaps can hold a whole swing; a frame
longer than 0.5 s is clamped by the stage and lets the feet creep by that much. The sim
does not yet drive the body by the stride (the 3D mode is not wired to the sim).

## Story pack moved into the repo (2026-10-15, Task B0)

- Works: `Stories/` moved by `git mv` to `src/content/`, `tests/tools/content-check.ts` and
  `script-book.ts`, `script-book/`, `voiceover/`, and `docs/` (atlas, canon, more-stories,
  fix-changelog, grove-backlog-prompt, briefs, logs). The 11 duplicate tools were identical
  and dropped; the pack's CLAUDE.md, plan.md and README.md were dropped (already folded in).
- Backlog prompt steps 2–4: index in `docs/content-index.md`; the no-chores rule was already in
  CLAUDE.md. Step 5 (the "Already have" audit against the code) is left for CV1.
- Known bugs, reported 2026-10-13 and not re-checked: **B1** the understudy swaps the speaker
  but not Keeper names in the text; **B2** the debug panel in production (`ui/hud.ts` now has
  a `DEV` guard nearby, verify); **B3** panels overlap (Journal over stats sheet, toasts over
  the HUD on portrait, Expedition counter under ✕).

## Grounding verified (2026-10-15)

Items 29, 30, 31 of `docs/creature-improvements.md`, checked in the browser (plan.md Part 1).
What was wrong and what changed:

- The grass vertex shader did not compile: the push loop's bound was empty (`i < ;`, a
  `${}` lost to a shell heredoc), so no grass drew at all. Fixed; the push is now a true
  world-space offset (it used to scale with the blade's instance scale squared).
- The slope tilt used the default XYZ Euler order, so pitch and roll turned about the
  world axes after the yaw. The root now rotates `YXZ`. The signs were right: a higher
  front pitches the nose up (checked numerically on the stage).
- The blob sat below the sampled ground and was a flat card, while the terrain curves up to
  0.07 across a footprint and its mesh is a chord up to 0.035 above the height function:
  it z-fought, floated on one side or was cut off on the other. It is now an 8×8 grid
  pinned flat in world space whose vertices take the ground height under them plus 0.05.
  It lightens to about 0.85 on the hop and 0.6 under the hovering Wisp, and shrinks.
- Feet: the specs' lowest points are not at y = 0 (Bolder's leg tips 0.2 below, Mossling
  0.03 above, Nubbin 0.05 below), and a plane through four probes misses the curvature
  under a wide belly or a wide leg span. `buildSpecies` now measures the figure at rest:
  the lowest vertex per 0.3-unit cell of the ground plan is a contact point, and each
  frame the root drops until the lowest contact point (carried by yaw and tilt only, so a
  hop still leaves the ground) sits 0.02 into the grass. Measured sink on the single stage
  at turns 0–270°: 0.02 for Nubbin, Mossling and Fennel, 0.027 for Bolder (its idle roll),
  the Wisp hovering 0.45 above.
- Bolder's idle leg sway is lift-only now; the dip put its tips 0.13 into the ground.
- `window.groveStage` exposes the stage (scene, cast, creature, groundHeight) so a console
  can measure creatures in place; the checks above were done that way.
- Left for the knee-joint pass: on bumpy ground a rigid body touches at its lowest point
  and the other feet can float a little; the Wisp's light trail dips under the ground.

Shots: `docs/samples/ground-roster.jpg`, `ground-fennel.jpg`, `ground-wisp.jpg`.

## Painted look (2026-10-15)

Items 16, 17, 18, 20, 21 of `docs/creature-improvements.md`, on every creature at once.

- `sculpt()` bakes ambient occlusion into the vertex colours (`ao` option, on by
  default): four probes out along the normal measure how much the field closes in, and
  creases go up to 55% darker. Fur shells share the geometry so the fur darkens too.
- Speckle: the Nubbin's two fine shell layers (cell 220) were the salt-and-pepper; a Chao
  is smooth, so the Nubbin has no shells now, a lower detail amount and a matte, velvety
  surface (roughness 0.66, sheen 0.7, no clearcoat). Fennel's fur grain is calmer under
  the shells (amount 0.4, bump 0.4).
- Fur tips are lit lighter and warmer in the shell shader.
- The creature stage grades at saturation 1.05 instead of 1.2 so the grass stops
  washing the creatures.
- Shots: `docs/samples/paint-nubbin.jpg`, `paint-fennel.jpg`, `paint-roster.jpg`.

## Face group on the Nubbin (2026-10-15)

Maor: "make a full list of improvements ... use the references I sent you as a bible"
→ `docs/creature-improvements.md` (35 items, six groups). Then "do it for one and then
report back": the face group (items 1, 2, 4, 5, 6, 7) on the Nubbin.

- `eye()` now returns an `EyeRig`: upper lid, a lower lid hinged from below (squint),
  an upturned lash arc shown over a closed happy eye, and a brow ridge (skin colour,
  tilts and lifts). The iris and white carry a little emissive so eyes stay bright in
  shadow.
- `species.ts`: an `Expression` per pose (lid, squint, brow tilt, brow lift, arc) with
  defaults (`EXPRESSIONS`) and a per-species `expressions` override; eased in over 0.3 s
  (1.2 s for sleep). Happy = eyes shut into ^ ^ arcs, squint, brows soft; eat = squint
  and knitted brows; sleep = shut, brows dropped.
- `mouth.shape`: `smile` (default), `o`, `omega` closed shapes; the closed shape gives
  way to the open ring past 30% open.
- Nubbin: blush marks under the eyes.
- Shots: `docs/samples/expr-nubbin-idle/happy/eat/sleep.jpg`, `expr-nubbin-happy-35.jpg`.
- Fix (Maor: happy frames "look weird"): the lids over the dome left the iris peeking out
  under a floating arc. A happy shut eye now hides the whole eyeball and lids so the
  head's skin shows, and the lash arc sits on the skin (`EyeRig.ball`).
- Fix (Maor: "fix the mouth too"): the open mouth was a 3D interior sphere, a flipping
  lip ring and a tongue blob, which at 0.2 units read as a scribble. It is now drawn on
  the skin like the reference: a dark half-disc opening under a straight upper lip that
  grows downward with the open amount, a rim, a tongue half-disc and flat teeth.
  `expr-fennel-happy.jpg` shows it with teeth.
- Still open in the face group: eye tracking (item 3). The other four creatures get the
  same rig automatically but have not been tuned (brows on Bolder/Wisp may want hiding).

## The whole roster in the species format (2026-10-15)

Maor: "keep going on fixes for the whole batch of 5 as next sample". Mossling, Bolder and
Wisp now come from specs too (`src/samples/species-roster.ts`, `ROSTER` = all five), so
every creature has the anchored round eyes, a modelled mouth in the skin and the five poses.

- Builder additions in `species.ts`: a part can have its own `surface`, extra `shades`
  and `noFur`; `face: 'torso'` puts the eyes and mouth on the body (Mossling's cap is its
  "head", Wisp's flame crown too); `eyes.extra` adds small bead eyes set in the skin
  (Bolder's row of six); gait `spider` (legs `leg1L..leg4R`, weight-shift idle,
  alternating-tetrapod walk, front legs raised to eat, tucked to sleep); gait `hover` bobs
  the hips at `hover` height; `extras(rig)` hangs hand-built decorations (dew, gills,
  leaves, spores; mandibles and the ember light; the smoke shell, motes, ring, trail,
  inner light) and returns a per-frame update.
- Stage: every `&creature=N` builds from `ROSTER`; `&creature=all` lines the five up
  facing the camera (`&pose=`, `&turn=` still apply). `buildCreature` (hand-built) is no
  longer used by the stage but stays in `creatures.ts` as reference.
- A stale-console lesson: the browser pane keeps console errors across page loads, so an
  old shader error (the `uCell` one) looked current. Reload and read the tail of the log
  in order before chasing it.
- Shots: `docs/samples/roster-idle.jpg`, `roster-happy.jpg`, `face-mossling.jpg`,
  `face-mossling-happy.jpg`, `face-bolder.jpg`, `face-bolder-walk.jpg`, `face-wisp.jpg`,
  `face-wisp-40.jpg`.

## Faces anchored to the surface, round pupil eyes (2026-10-15)

Reference: Maor's Palworld pet-animation video (Tanzee, Foxparks, Chikipi, Teafant frames).
What the reference shows: round eyes sitting proud of the face, a big iris that is mostly
dark pupil with a thin white ring around it, one bold catchlight, hardly any liner, and a
tiny mouth drawn in the skin low on the face.

- `species.ts` `onSurface(prims, blend, from)`: walks the head's signed distance field to the
  nearest surface point and its normal. Eyes and the mouth are placed there and aimed along
  the normal (eyes pulled 45% toward straight ahead), so nothing floats or sinks whatever
  the head shape. Spec `eyes.yaw`/`pitch` and `mouth.pitch` are now extra tilt only.
- `creatures.ts` `eye()`: a flattened dome eyeball with its centre behind the face; the iris
  and the catchlight are discs of concentric rings bent onto the dome (a flat fan hid behind
  the dome, found with a red-disc test), a thin liner at the top rim, lid as before; new
  `tall` parameter (1.2 default) replaces the fixed 1.45 almond.
- `irisTexture`: 128 px, pupil to 56% of the iris with a soft edge, iris ring lit from below,
  two catchlights.
- `buildMouth`: lip line half-buried in the skin; the lower lip is hidden when closed and
  offset so it no longer z-fights the upper one (the "falling off" flicker).
- Data: Nubbin eyes r 0.25, irisScale 0.8, lid 0.12, tall 1.12, mouth width 0.2; Fennel
  eyes r 0.21, irisScale 0.8, tall 1.3, mouth width 0.2.
- Shots: `docs/samples/face-nubbin.jpg`, `face-fennel.jpg`.
- Fix (Maor: "mouth on fox is off"): the Fennel mouth point sat under the muzzle, so the
  projection landed on its underside facing down. It now starts ahead of and below the
  muzzle tip and lands on the tip's front underside, with a dark nose mark above it.
- Angles (`&turn=<degrees>` on the stage): at three-quarter and side views the eye domes
  stood off the head, so the dome now sits deeper (centre 0.42 r behind the skin, 0.28 r
  proud) and aims only 22% toward straight ahead; liner shrunk to the visible rim. Shots
  `face-fennel-45.jpg`, `face-fennel-side.jpg`, `face-fennel-happy.jpg`, `face-nubbin-40.jpg`.

## The species format: rig, poses, marks, mouths, directional fur (2026-10-16)

Maor: "what other improvements can we make before we apply it to others" → the list
(poses and a rig, markings with intent, mouths that open, directional fur, grounding,
material tuning, eye tracking), then "go". Built the first four on the Nubbin and
Fennel as templates, and the format the roster will be written in.

- **`src/samples/species.ts`**: a `SpeciesSpec` describes a creature as data (torso,
  head and limb parts as blended shapes with pivots and bone names, surface, fur and a
  fur rule, baked shade, marks, colour rules, eyes, mouth, wings, the ball). The
  builder sculpts each part, hangs it from its pivot (the head and limbs from the
  hips), adds eyes and a modelled mouth to the head, shells the furred parts, and
  returns a `Rigged` creature with `setPose()`.
- **Poses**: idle, happy (hop, arms or front legs up, open mouth), walk (alternating
  legs, counter-swinging arms or diagonal pairs, a bob), eat (head down, hands to the
  mouth, chomping), sleep (lies down, lids close, slow breathing). Blinks, ear
  twitches, wing flutter and the ball run on top. The stage cycles them every few
  seconds; `&pose=happy` holds one.
- **Mouths**: a dark interior that opens, a tongue and (for Fennel) teeth that appear
  as it does, a lip that lifts. Lids are now half-shells hinged at the eye, tilted back
  by the species' lid amount and swung down to blink or sleep (the earlier scaled cap
  never covered the eye).
- **Marks with intent**: shapes with a colour and a soft edge, baked per vertex: the
  Nubbin has a heart on its belly, a star on its brow and a crown that darkens to the
  point; Fennel a mask across the eyes, a chest patch and a tail ring.
- **Directional fur**: the sculptor bakes fur length and growth direction as vertex
  attributes from a rule (long on the ruff, chest and tail; short on the muzzle and
  legs; combed down and back) and the shells follow them (`FUR_DIR` define) instead
  of puffing straight out.
- **`docs/species-format.md`** documents the format and how to write a species; a
  Chao-line evolution is meant to be a small diff on the Nubbin spec.
- `?aaa=1&creature=1` and `&creature=3` now come from the specs; Mossling, Bolder and
  Wisp stay hand-built until ported. Screenshots: `docs/samples/pose-*.jpg`.

**Eyes and mouths, redone against the reference** (Maor: "the eyes look nothing like the
image I provided … the mouth also looks like its falling off"). The eye is now set
into the face: a flattened eyeball sunk into the head with only its front showing, a
tall almond, the iris disc filling almost the whole eye, a dark liner hugging the
top lid (thicker toward the outer corner), a faint lower line, a soft wet highlight
across the upper eye, and the hinged lid tilted well back at rest. Eyes are bigger
and tilted to follow the face (`pitch`). The mouth sits in the surface: a thin lip
line on the face, the dark interior behind the surface so it only shows as the mouth
opens, the lower lip dropping into a ring, the whole mouth tilted down and out to
follow the face (`pitch`). Shots: `pose-nubbin-idle/happy/sleep.jpg`,
`pose-fennel-idle.jpg`.

**Still to do from the list**: grounding (contact shadows, grass parting), material
tuning per species, eyes that track a point, and then the port of the other three
and the Keeper.

## Five creatures at a modern-console finish (2026-10-15, for Maor's pick)

Maor, with a Palworld roster screenshot: "do the character animation this detailed.
provide 5 samples." `?aaa=1&creature=1..5` (`src/samples/creatures.ts`) puts one
creature on the AAA stage, framed close and idling; screenshots in
`docs/samples/creature-*.jpg`.

**How they are made.** Each is a sculpted single surface (`sculpted.ts`, now with
round cones and tori as primitives) with:

- a surface detail map projected along the three axes (no UVs): fur strands clumped
  by a slower field, scales, leaf veins, riveted armour plates, or a smooth grain;
  each gives albedo grain and a normal map through a small injection into three's
  physical shader, on top of the vertex-colour regions;
- big cartoon eyes built from a white, an iris, a pupil, two catchlights and an upper
  lid of body colour that sets the expression;
- articulated pieces hung from pivots (ears, tail, cap, wings, motes) that
  idle-animate, plus a breathing scale on the body;
- material per species: velvet sheen for the Nubbin, full sheen for fur, clearcoat
  for shell and cap, emissive glow where the `glow` vertex attribute is set (ember
  seams, the Wisp's core).

**The five**

1. **Nubbin** (`creature-1-nubbin.jpg`): the Chao-faithful hero, velvet-smooth,
   yellow tips, wings that flutter, the ball bobbing.
2. **Mossling** (`creature-2-mossling.jpg`): a round sprout with a pale belly under a
   spotted mushroom cap that tilts, a collar of leaves that stir.
3. **Fennel** (`creature-3-fennel.jpg`): a fox pup, orange fur with a cream bib and
   muzzle, tall ears with pink insides that twitch, a bushy tail that sways.
4. **Bolder** (`creature-4-bolder.jpg`): a six-legged beetle in riveted blue-grey
   plates with two horns, mandibles that work, and ember seams that glow.
5. **Wisp** (`creature-5-wisp.jpg`): a hovering violet spirit with a glowing core,
   wisp arms and flame tips, a tail that trails, motes orbiting, a light of its own.

**Second pass** (Maor: "getting much better but still not there"). What was flat is now
baked and layered: a top-to-underside light gradient and markings (stripes, spots)
baked into the sculpt colours through a `shade` hook; shell fur on the fox (the body
drawn ten more times, each shell pushed out along the normal and thinned by a 3D
hash, so the silhouette breaks into strands); painted anime irises (limbal ring, lit
crescent, radial streaks, two catchlights) on a disc under a glossy cornea; a cool rim
light on the stage; and a lot more secondary shape per creature: a ruff of fur tufts, a
head crest, dark socks, striped back and tufted tail on Fennel; moss tufts, root toes,
gills under the cap, a sprout and nine collar leaves on Mossling; three overlapping
shell segments, ridged horns, jointed legs with claws, a third horn and an ember light
on Bolder; four swaying flame crests, lit arm tips, fangs and an orbit ring on Wisp; a
lighter belly and a velvet sheen on the Nubbin. Lesson: the marching-cubes add-on
returns raw gradient normals, not unit vectors; everything downstream (the gradient
bake, the shell offsets) needs them normalised.

**Third pass, Bolder and Wisp** (Maor: "I like what you did with spider and purple, keep
going"). Bolder is now a true spider: a cephalothorax and a big abdomen with an ember
hourglass baked across its back, plate ridges, two horns with ridge bumps, pedipalps,
spinnerets, eight jointed legs as separate sculpted parts (hip to knee rising, knee to
foot dropping, a claw) on hip pivots that shift their weight in turn, short bristles
(three fine shells), two big amber eyes over a row of six small glowing ones, working
mandibles, and an ember light inside; the seam glow pulses through the material's
uniforms. Wisp gained a drifting vapour shell (the body drawn once more, pushed out
and breathing, shown only at the silhouette through a Fresnel term and broken up by
moving 3D noise), a marbled surface at two scales, horn tufts curling back, a brow
ridge, cheek flares, a sixth flame crest, a skirt of six hanging wisps on their own
pivots, more motes and a pulsing core. `creature-4-bolder(-golden).jpg`,
`creature-5-wisp(-golden).jpg`. The creature camera backs off on 4:3 panes.

**Fourth pass, all five** (Maor: "keep going and carry over to all 5 samples"). Every
creature now blinks (the lids drop and lift every few seconds, each on its own
rhythm). The Nubbin has a velvet fuzz (two very short, very fine shells), lashes, the
yellow tips fading into the body, veined wings and a glowing, orbiting ball with its
own light. Mossling has mossy fuzz on its back, a vine winding round it with small
leaves, arms on shoulder pivots that sway, dew drops on the cap and spores drifting
up from the gills. Fennel has twelve finer fur shells, furred ears, cheek tufts,
real whiskers, cream flecks on its back, a periodic ear twitch and a slow look
around. Bolder steps: each leg lifts in turn at the top of its cycle; its bristles are
gone, they read as speckle on the plates. Wisp trails a line of fading motes behind its tail.
The stage records each creature's facing so idle turns add to it instead of replacing
it.

**What this says for the real build.** A species is a short description: a list of
blended shapes with colour rules and a detail kind, plus which pieces move. The
current catalogue (~100 looks across the Chao, pocket and digital lines) becomes data
of that shape, generated at load, instead of a hundred hand-made models; the
Chao-line evolutions are mostly colour and part swaps on one body, which this handles
directly. Animation would move from clip names to pose rigs: the same pivots driven by
the sim's states (walk, happy, sleep, eat, swim, flap).

## The HD port at a AAA finish (2026-10-15, for Maor's pick)

Maor: "step in the right direction. continue to refine. give me examples like a triple
A game." `?aaa=1..3` (`src/samples/aaa-styles.ts`, lazy-loaded) is the console-era
valley rebuilt the way a current console game builds a scene, in three moods;
screenshots in `docs/samples/aaa-*.jpg`.

**What is in the frame**

- A physical sky (Preetham, `three/addons` Sky) lights the whole scene through an
  environment map; the sun is a directional light with soft 4k shadow maps; fog takes
  the sky's colour.
- The valley is a heightmap mesh (192×192) whose material blends grass, dirt and rock
  by slope and by the path, each with its own painted 512px albedo and a normal map
  derived from a painted height field, through a small injection into three's
  standard shader. The cliffs are the same mesh rising past the rim.
- Twelve thousand instanced grass tufts (alpha cards) sway in the wind; five trees
  are bark-mapped trunks with branches and canopies of 170 leaf cards each, lit tops
  lighter, shaded bottoms darker, casting alpha-tested shadows; fruit has clearcoat.
- The cobbled mound is normal-mapped and roughened; the cottage has plaster, a tiled
  roof, a chimney and windows that light up (with point lights) after noon.
- The pond is physical water with refraction and a scrolling normal map.
- The modelled Keeper and Nubbins wear cloth (sheen) and clearcoat materials.
- Post: screen-space ambient occlusion, a clamp, bloom, depth of field, ACES filmic
  tone mapping, a grade with vignette, SMAA anti-aliasing.

**The moods**: `aaa-1-noon.jpg` (high sun, light haze), `aaa-2-golden.jpg` (sun at
7°, long warm shadows, fireflies, lit windows, stronger bloom), `aaa-3-rain.jpg`
(overcast, wet clearcoat ground and stone, drizzle, lit windows, desaturated grade).
`&closeup` frames the characters from the front.

**Lesson learned**: bloom in a scene lit above 1.0 in linear light needs its threshold
set above the sunlit ground (2.8 here), or the whole frame glows; the first pass of
this sample was a white haze for that reason. Debug switches stay on the URL:
`nobloom`, `nossao`, `nodof`, `nofog`.

**Sculpted characters** (Maor: "characters still too shapey"). `src/samples/sculpted.ts`
builds each figure as one surface instead of a stack of primitives: a signed-distance
field of spheres, capsules and ellipsoids joined with a smooth minimum is polygonised
with marching cubes (the three add-on, 112³), so the head flows into the neck, the arms
into the shoulders and the crown into the head like a clay maquette; vertex colours
come from the nearest primitive (with a few region rules: the overalls' bib, the hair
behind the face), so cloth, skin and yellow tips stay crisp. The cap, eyes with irises
and catchlights, brows, mouth, straps, buttons, cheeks, wings and the emote ball sit on
top as their own glossy pieces. The AAA samples use these; the console samples keep the
assembled ones for comparison.

**Cost**: this is desktop-class (SSAO, DoF, 4k shadows, 12k grass instances) and
would need a quality ladder for phones: no SSAO, 2k shadows, a third of the grass,
smaller textures. The art pipeline it implies for the real build: painted PBR texture
sets (albedo, normal, roughness) per material from the existing noise painters, leaf
and tuft cards, lathe-and-primitive characters with physical materials, one scene
per place (Grove, Hollow floors, race courses) behind the same view interface.

## Five console-era 3D directions (2026-10-15, for Maor's pick)

Maor, after the first five: "try again with better, think like this" with a Super
Mario 64 screenshot (Bob-omb Battlefield): a low camera behind the character, chunky
textured terrain walled by cliffs, a cobbled mound, billboard trees, vertex lighting,
soft filtered textures, blob shadows. Five new samples in that spirit, live Three.js at
`?retro3d=1..5` (`src/samples/retro-styles.ts`, lazy-loaded), screenshots in
`docs/samples/retro-*.jpg`. Same valley every time; what changes is how the machine
would have drawn it.

1. **N64** (`retro-1-n64.jpg`). 320×240 upscaled with the console's soft bilinear
   blur, Gouraud lighting baked per vertex, 64×64 filtered textures, blob shadows,
   camera-facing tree sprites, the Lakitu camera. The reference's own look; the
   cheapest to run, and the simple shapes suit the Nubbins.
2. **PlayStation** (`retro-2-ps1.jpg`). Same resolution but no texture filtering,
   vertices snapped to the screen grid, affine (warping) texture mapping through a
   custom shader, ordered dithering down to 15-bit colour. Grittier and more
   "crunchy"; the jitter is part of the charm and part of the eye strain.
3. **Nintendo DS** (`retro-3-ds.jpg`). 256×192, two-step toon light with the DS's
   dark edge marking, tiny unfiltered textures, strong colours. Reads as a cartoon
   and keeps the pixel sprites' outlines; the lowest fidelity of the five.
4. **Dreamcast** (`retro-4-dreamcast.jpg`). 640×480, smoother higher-poly shapes,
   per-pixel Phong with specular highlights on the Nubbins, mipmapped textures,
   soft real shadows, bright skies. The Chao Garden's own generation, so the closest
   match to the creatures' home; moderate cost.
5. **HD port** (`retro-5-hdport.jpg`). The N64 scene's simple shapes and bold colours
   at native resolution: crisp 256px textures with anisotropy, per-pixel light, soft
   shadow maps, tone mapping, widescreen. What a modern remaster does with the same
   assets; the most polished, and the one that scales best to phones and desktops.

The toggle plan stands from the earlier write-up: a Graphics choice on the title and
in Settings, a second scene behind the same view interface, sim untouched; the
Lakitu camera would follow the Keeper with the same Q/E orbit steps and a shoulder
offset, with the top-down camera kept as a third option. Recommendation: build the
geometry and textures once at N64 simplicity (1), then ship 5 as the default look
with 1 and 2 as selectable "retro" filters, since they are post-processing on the
same scene.

Maor liked 5 but found the character "too blocky, not a great sprite". The HD port (and
the Dreamcast sample) now carry modelled characters (`nubbinFine`, `keeperFine` in
`retro-styles.ts`): the Keeper is a cartoon head on lathe-built shirt and overalls
with straps and buttons, a cap with a badge and brim, sideburns and a fringe, eyes
with pupils and catchlights, a nose, ears, a smile, gloves and rounded shoes; the
Nubbins are Chao-faithful, a round belly tucking in at the neck, a head drawn up to
the pointed crown, big dark almond eyes with a catchlight, cheeks, a smile, yellow
tips on hands and feet, wings and the emote ball. `?retro3d=5&closeup` frames them
from the front (`docs/samples/retro-5-closeup.jpg`); the Lakitu view is
`retro-5-hdport.jpg` again.

## Five directions for a full-3D Grove (2026-10-15, for Maor's pick)

Maor: "conceptualize an upgrade to the graphics. Leave the existing assets, add a toggle
at the start for full 3D. Same story, fully 3D (not necessarily pixelated). Five
options with a small quick sample of each."

The samples are live Three.js scenes, not paintings: `?style3d=1..5` on the dev server
builds the same little Grove (ground, a terraced hill, the pond, three fruit trees, the
cottage, the well, two Nubbins and the Keeper) with each direction's geometry,
materials, light rig and post, slowly orbiting. `src/samples/three-styles.ts`,
lazy-loaded so the game bundle does not carry it. Screenshots in `docs/samples/3d-*.jpg`.

1. **Low-poly, flat-shaded** (`3d-1-lowpoly.jpg`). Faceted icosahedron canopies,
   six-sided trunks, a gently bumpy floor, flat shading, soft shadows, pastel sky
   and fog. Reads instantly as "3D indie cosy", runs on anything, and the Nubbins'
   round-but-faceted bodies suit the toddler proportions. Least art per asset: every
   model is a handful of primitives, so the whole species catalogue is quick to
   build. The risk is looking generic.
2. **Toon with outlines** (`3d-2-toon.jpg`). Three-step cel shading (a gradient
   map), saturated colours, an inverted-hull dark outline on every prop and creature,
   no cast shadows. The closest to the Chao Garden spirit and to the current pixel
   sprites' chunky outlines, so the two modes would feel like one game. Outlines
   need per-model tuning (thin parts, wings) and the flat look wants more texture
   detail on big surfaces.
3. **Cosy stylised PBR** (`3d-3-cozy.jpg`). Smooth high-segment shapes, physically
   based materials with ACES tone mapping, soft PCF shadows, a warm key and a cool
   sky fill plus a rim light, bloom and a touch of depth of field for a diorama
   feel, transmissive water with a glint. The most "modern cosy" (Animal Crossing,
   Tiny Glade) and the most work: it rewards real surface detail (grass tufts,
   wood grain, roof tiles) that the sample does not have, and it costs the most on
   phones (post passes, shadow maps).
4. **Painterly textures on 3D** (`3d-4-painterly.jpg`). The organic painted
   direction Maor picked for the 2D Grove, wrapped onto geometry: the same noise
   painters make tiling grass, bark, leaf, roof-tile, stone and water textures and
   the meshes carry them with simple Lambert light. Continuous with the current
   look, so the toggle feels like the same world stepping into depth; cheap to run.
   The sample's tiles repeat visibly at this scale and the models are plain; it
   needs painted detail maps per model and softer edges to shine.
5. **Voxel** (`3d-5-voxel.jpg`). Everything built from little cubes with hard
   shadows and an orthographic camera: the pixel sprites' honest 3D cousin. Every
   current sprite converts almost mechanically (each pixel a voxel), so the whole
   catalogue of species, hats and buildings comes across fast and stays
   recognisable. Chunky and charming, but it is the least "upgrade" of the five
   and the ground reads flat without height variation.

**How the toggle would work**: a Graphics choice on the title screen (and in
Settings), saved per device, not per slot. The sim is untouched; `render/` gets a
second scene implementation behind the same `WorldView` interface (positions,
clips, events in; pixels out), so the story, the Hollow, races and every system
run the same. Sprites keep their pick ids; 3D picks come from raycasts. The
species catalogue is the long pole in every direction: ~100 looks, hats and parts,
so directions 1, 2 and 5 (primitives, toon primitives, voxels) finish months
earlier than 3 and 4.

**Recommendation**: 2 (toon) for the look that matches the game's soul, built on 1's
cheap geometry so it ships; 4 if the painted world should stay the star; 5 only if
the goal is maximum reuse of the existing pixel art.

## Save slots, three per mode (2026-10-15)

Maor: "Add feature for multiple save slots for each game mode."

- **Storage** (`platform/storage.ts`): a slot is `{ mode, index }` with three per mode
  (Hazel's Grove, the Free Grove, the Learning Grove). Slot 1 of each mode keeps the
  key the game used before (`grove.save.v1`, `grove.save.campaign`, `grove.save.edu`),
  so every existing Grove shows up in slot 1; slots 2 and 3 are `grove.save.<mode>.<n>`.
  `summarize(json)` reads a save's headline without loading it (names of the first
  three Nubbins, count, Keeper and chapter for the campaign, the age for the Learning
  Grove, when it was saved); `copySlot` is there for later.
- **Title screen** (`ui/title.ts`): a section per mode with a row per slot. A filled
  slot shows Continue with its summary ("Momo, Pebble · yesterday", "Fern · Chapter 4 ·
  …", "Age 4 · …") plus New (confirm, then the Keeper or age question as before) and ✕
  Erase (confirm). An empty slot starts new. The old mode-level confirms are gone;
  each slot confirms for itself.
- **Settings** shows which slot is playing ("Playing Free Grove, slot 2."); Back to
  title returns to the slot list. `?free&slot=2` and `?edu=4&slot=3` pick a slot for
  dev links.

Tests: `tests/sim/slots.test.ts` (legacy keys for slot 1, nine distinct keys, index
clamping, the summary from a serialized world). Full suite green, lint clean, build
OK; seen in the browser: a new Free Grove in slot 2 saved under its own key, the
Settings line, and the title's Continue row with its summary and buttons.

## The field, four times the area (2026-10-13)

Maor: "Expand the area again 4x." `GROVE.size` 48 → 96 (`SIM.worldHalf` 46). The old
48-unit heart keeps every position (buildings, pond, stream, hills, trees, NPC homes,
lanterns, the cave mouth); the new outer ring is wilder, in four regions:

- **The north wood** (north-west): nine wild trees (`wild-1..4`, a darker, bluer
  canopy painted with the same branching tree), bushes, a log, rocks, a shaded floor
  and mushrooms; a track from the school.
- **The east ridge**: the biggest hill (r 8), scree pebbles, hardy trees, rocks; a
  track from the dojo.
- **The south marsh**: the stream now runs on to the far south edge; the ground is
  darker and muddier with puddles, reeds and tall grass along it; a track from the
  well.
- **The west meadow**: lusher grass thick with daisies and bluebells, a low hill and the
  fifth fruit tree; a track from the cottage. A sixth fruit tree stands in the far
  orchard corner (south-east) at the end of the dojo's southern track.

Also: six new hills, seven new tappable rocks, five new landmarks for the map
(north wood, east ridge, south marsh, west meadow, far orchard), decoration counts
scaled by area, tall grass along the longer edges. Older saves gain the two fruit
trees on load.

**The ground paints in a worker.** The 1536² floor painting took about two seconds on
this PC, which would freeze the first frames on a phone. `paintGround` is now a pure
pixel pass; `ground.worker.ts` runs it off the main thread (a 96 kB chunk, three.js
tree-shaken out) and the scene swaps the texture in when it arrives, showing a
quarter-resolution painting (about 0.15 s) until then. Tile painting goes through the
same path. Path and bank distance tests now skip segments by bounding box.

Tests: `tests/sim/field.test.ts` (size and walkable half, nothing overlaps or leaves
the field, the new landmarks stand on open ground, older saves get the trees). Full
suite green, lint clean, build OK; seen in the browser: all four regions and the
worker swap.

## The Hollow Below: procedural dungeons, built (2026-10-13)

Maor: "do item 11." The last system of the Digimon-inspired list is in: a seeded cave
under the Grove, explored in the world with the Keeper and a party of two, painted in
the organic style.

**What works**

- **The cave mouth** (`caveMouth` in the painted scenery, in the south face of the
  north-west hill, east face; also More → 🕳 The Hollow Below). Tapping it opens the menu: today's
  Hollow (one seed for every Keeper, from the day key) or a fresh one, who comes along,
  the deepest floor so far.
- **Floors** (`sim/dungeon.ts`, pure, memoised per seed and depth): cellular-automata
  rock with rooms carved in and wobbly corridors joining them, only what the first room
  reaches kept; water pockets from a value-noise field; torches on walls that face the
  floor, crystals in dead-end nooks; the stairs up where you arrive, the chest and the
  stairs down in the last room. Floors grow (34×24 cells at depth 1 up to 54×36) and
  darken with depth; floor 20 has no way down. Loot per floor grows too: Shells, stone,
  seeds, essences, lost critters, and from floor 2 the odd lost egg.
- **Exploring**: the Keeper walks with grid collision (`resolveDungeon`); a tap in the
  rock is dropped. The party (partners first, then the first two Nubbins awake, plus
  whoever is carried) follows at a short distance and fetches any loot within four
  units, each pickup a sparkle and a toast naming the finder. Tapping the chest or a
  stair marker walks there and uses it on arrival; a new tap elsewhere cancels. The
  stairs up, or Head home on the floor bar, return everyone to where they stood in the
  Grove with the whole haul (nothing is ever lost by leaving).
- **Shadow strays** wander the floor; one that bumps the Keeper snatches five Shells and
  runs. Tap one with a fruit in the bag and the Keeper walks over, feeds it, and it moves
  into the village square as a recruit (system 1).
- **A wild creature** waits in a nook; creeping up on it fills its scan bar (system 8).
- **The request board** has a new daily ask, "Go down n floors in today's Hollow".
- **Rendering** (`render/paint/dungeon.ts`, `GroveScene.setDungeon`): the floor is one
  painted texture at 12 texels per unit (flagstones with cracks and joints, dust at the
  walls, moss by the water, the rock faces with a lit lip fading to black, torch and
  crystal light baked in). Rock cells within two of the floor are blocks: tops carry
  the same painting, faces the cliff texture. A point light follows the Keeper and five
  more sit on the nearest torches. Torches flicker, crystals pulse, loot bobs, strays
  interpolate between steps. The Hollow song plays; weather and fireflies stay above.
- **Saves**: the run (seed, depth, party, taken loot, strays, haul) is in the save; the
  floor is regenerated from the seed. A save underground without its run lands in the
  Grove. Catch-up steps never move strays or count pickups.

Also fixed in passing: the species sprite cache keyed every species the same
(`species::-`), so every wild visitor and neighbour pet wore the first species' look;
the key now includes the id. And taps now test the texel under the finger instead of a
sprite's whole box, so a tree's empty corner no longer steals a tap meant for the cave
mouth (or anything else) behind it.

Tests: `tests/sim/dungeon.test.ts` (10 cases: determinism and connectivity, growth
with depth, collision, the daily seed, a full run with pickup and return, party
fetching and following, chest and stairs and the daily depth, strays snatching and
settling, the wild scan, saves and catch-up). Full suite green, lint clean, build OK;
seen in the browser: the cave, pickups, the chest, the stairs, feeding a stray, home.

**Known gaps**: the party does not fight anything and nothing hurts them; strays only
take Shells. Floors are not themed by depth yet (the same palette throughout).

## The Digimon-inspired ten, built (2026-10-13)

Maor: "Go through the next 10 upgrades on the list now." Systems 1–10 of the list below
are playable; 11 (procedural dungeons) and the campaigns remain.

1. **Village square** (`sim/town.ts`, Profile → Village square): settled wild visitors,
   returned strays and beaten race or karate rivals move in as recruits; prosperity
   (12 per recruit, 120 max) opens the stall (shop prices −10%), the gym coach (+20%
   training), the bathhouse attendant, free fortunes and a standing festival (+15% race
   prizes). Painted stalls appear by the cottage as the square grows.
2. **Care slips** (`sim/slips.ts`): a need ignored for two minutes (hungry, exhausted,
   lonely after the first ten minutes, out in the rain) logs a slip with a toast; the
   stats sheet shows the count and the last three. Each slip trims the adult span 5%
   (floor 75%); at evolution, three or more mark the Grumpy or Sleepy tag, none at all
   earns the well-raised bonus (a second stat steps up a grade). Slips never count
   during offline catch-up.
3. **Gym** (`sim/gym.ts`, `ui/gym.ts`, More → Gym): four stations, one per stat; a
   twenty-second timing bar (tap in the zone); hits × 6 points, × 1.5 when fed and
   rested, × 1.2 with the square's coach; costs energy.
4. **Partners and the merge** (`sim/partners.ts`, Profile → Partners): two chosen
   Nubbins keep near the Keeper and bond faster; two bonded adults merge with a twine
   (shop, 120 Shells) for a minute: race and karate levels become the pair's best + 2,
   and the merged pair glows.
5. **Curfew** (`sim/curfew.ts`): after 22:00 real time Nubbins prefer to nap and tire
   faster unless lanterns are lit; toasts at dusk and dawn; the sheet shows "Day n of
   about m" from the line's span.
6. **Rebirth memories** (`sim/inheritance.ts`, stats sheet → "Rebirth keeps"): a grade
   (best stat steps up), its parts, its lessons (default) or its accessories; each life
   is written into the family line ("Past lives: sun swim → …"); three lives earn the
   heirloom look (shiny).
7. **Keeper skills** (`sim/skills.ts`, Profile → Keeper skills): 24 nodes in Care,
   Garden, Games and Story, bought with points from badges and claimed requests; wired:
   faster hatching, fruit sooner, bigger expedition hauls and an extra seed, race prize
   bonus, karate HP, cheaper lessons, an extra plot.
8. **Scan and convert** (`sim/scans.ts`, Collection Book): wild arrivals (+25), their
   stay (+2/min) and neighbours' pets (+10/visit) fill a scan bar per species; at 100%
   the Book converts it into an egg.
9. **Guard teams** (`sim/teams.ts`, Profile → Guard team): Dawn, Dusk or Dew; a weekly
   seeded mission (expeditions, Shells, race or karate wins); points and ranks; a
   seeded board of four rivals.
10. **Beetle Run** (`sim/tank.ts`, `minigames/tank/screen.ts`, More → Beetle Run): a
    cart through a seeded cave on three lanes, dodging spores, rocks and acid, picking
    up shells, wood and stone into a limited cargo, through the boss door for a bonus;
    six hits ends the run; leaving early keeps the haul.

Also fixed in passing: the four Grove lanterns had lost their sprites in the earlier
lantern change (the script's anchor had moved); they draw and tap again.

The first deploy of this failed on the GitHub runner: the full-life timing test took
3.08 s against its 3 s budget (1.8 s locally). A CPU profile showed the per-step cost
was mostly old: the collection book rebuilt its key list every step for two badge
checks, the obstacle list was rebuilt per walker per step, landmarks and world-state
badges were checked every step. Those are now cached or gated (book keys built once,
fixed obstacles built once and placed ones cached, landmarks only when the Keeper
moved, state badges once a sim second, squared-distance early-out in `resolve`). The
test runs in about 0.5 s now.

Tests: `tests/sim/ten.test.ts` (12 cases). Full suite green, lint clean, build OK;
seen in the browser: the toasts for every system, the profile sections, the gym and the
cave.

## Play-through and debug pass (2026-10-13)

Maor: "Run through the game and debug." Driven in the browser pane from a cleared save:
title → Free Grove, walking and tap-to-move, tree shake, hatching, pet, feed, pick up,
put down, hug, call, grab/throw, the shop, kindergarten lesson and services, hats,
renaming, decorating, painting, planting and watering, toys and catch, the workshop and
dyes, gathering, requests, the profile (plots, title), the map (teleport), a
neighbour visit and gift, a race, a karate bout, an Expedition, every panel open and
close, a save round trip, a two-hour offline gap, the campaign's first chapter and
journal, with a window error hook watching the whole way.

**Fixed:**

- **Buying an unknown shop item emptied the purse.** `buy()` subtracted an undefined
  price, Shells became NaN, and the HUD's purchase toast threw. The sim now refuses an
  item with no price and the toast tolerates it. (Regression test added.)
- **Requests ignored anything done by command.** The board counted only events produced
  inside a sim step; visits, crafting, watering and gathering by tap come from commands,
  so those requests never advanced. Command events are now queued and counted on the
  next step (`queueQuestEvents` in `sim/quests.ts`). (Regression test added.)
- **Leaving a karate bout early counted as a loss.** Quitting now abandons the bout: no
  result, no record, a "Left the dojo" toast.

**Checked and fine:** no uncaught errors anywhere in the run; the save round trip is
exact; obstacles stop the Keeper; the hover halo and tap sparkles; all twelve panels;
the campaign opens on chapter 1 with its goal in the journal.

**Noted, not changed:** shaking a tree only hurries the next fruit (by design in
CLAUDE.md) and sometimes gives wood, so a fresh Grove's first fruit comes from the shop
or a wait; fast-travel to the well lands beside it because the well is solid; karate
takes the selected Nubbin or, with none selected, the first in the roster.

## Painted decor props and solid obstacles (2026-10-13)

Maor: "Upgrade the decor props to the new art too" and "make sure I can't walk through
the elements like a hill".

- **Props** (`src/render/paint/decor.ts`, `buildPaintedProps`): every small thing is
  painted now at 32 texels per unit: fruit and the seven flavoured fruits, the memorial
  flower, the ball, notebook, radio, blocks, mirror and little TV; the ground dressing
  (tufts, daisies, bluebells, pebbles, mushrooms, stumps, signs, reeds, tall grass,
  lily pads); the placed pieces (fence, flower bed, bench, statue, path stone, garden
  lantern, rock pile, thicket); orchard trees and crop rows at their four stages. The
  path fence posts use the painted post from the scenery sheet. The old pixel prop
  sheet remains only for the shadow blob.
- **Obstacles** (`src/sim/obstacles.ts`): hills, the four trees, the buildings (their
  footprints now live in `GROVE.buildings` with a radius; `render/scenery.ts` derives its
  placements from them), the big rocks (`GROVE.rocks`) and placed buildings (nursery,
  bathhouse, workshop) are solid circles. The Keeper, the second Keeper, visiting
  Keepers and hatched Nubbins are pushed out along the edge each step, so nobody
  walks through a hill; a tap target inside an obstacle is dropped so the Keeper does
  not push against it forever. The pond still works through the shoreline rule (wading
  with the perk). Tests: `tests/sim/obstacles.test.ts`. Nubbins pass trees (they eat the fruit
  under the canopy; the Keeper stops at the trunk), and the third tree moved from the
  west hill's slope to (-12, 7) so its fruit is reachable; old saves snap their trees to
  the layout on load.

## Hills, waterfall and lanterns in the new art; smooth camera; tap and hover feedback (2026-10-13)

Maor: "Upgrade the hills, waterfall and lantern posts to the new art too", "when I move
around the graphics are jittery", "when you can interact with something make sure it has
a clear indicator like sparkles or a border when clicking/hovering".

- **Hills** (`paint/terrain.ts`): each terrace is a ring whose radius wanders with warped
  noise (`terraceSide`, `terraceTop`), so the plateaus are no longer circles; the cliff
  face is a painted tile (undulating strata, ridged cracks, a lit lip, moss at the foot,
  lichen) repeated by circumference; the tops use a painted grass tile that wraps.
- **Waterfall**: a painted scrolling tile of streaks and foam (`paintWaterfallTexture`),
  the splash pool a noise-edged shape.
- **Lantern posts**: the four 3D posts and glow spheres are gone; the view draws the
  painted `lanternPost` sprite, swapping to `lanternPost-lit` at dusk or once the Keeper
  lights one, tappable as before (`lantern` is now a sprite pick kind). The scene keeps
  their positions (`lanternSpots`, `lanternStates`) and the shared point light.
- **Jitter**: the camera followed the Keeper's sim position, which moves ten times a
  second, while the Keeper sprite is drawn interpolated between steps, so the two
  disagreed every step. The camera now follows the drawn position
  (`WorldView.keeperDrawPos`). The camera rig is also snapped to the low-res frame's
  pixel grid along its own screen axes (`OrbitCamera.applyPose`), so sprites never sit
  between pixels and shimmer while the view glides.
- **Feedback**: with a mouse, the thing under the pointer gets a pulsing bright halo
  (the same frame drawn larger and brighter behind it, `SpriteBatch.highlight`) and a
  pointer cursor; any tap on a tappable thing (Nubbins, items, Keepers, buildings,
  trees, plants, wild visitors, lanterns, pieces) bursts sparkles where it landed and
  shows the halo for a moment (touch has no hover, so the tap halo is the signal).

Checks: tests, lint and build green; seen in the browser by day and at dusk.

## The organic art direction, in the game (2026-10-13)

Maor: "go forward on art. Use the art we designed in the latest - the way the dojo and
windmill were upgraded." The painted kit from the samples is now the Grove's art.

**What changed:**

- `src/render/paint/`: the sample code moved into the renderer. `raster.ts` (full-colour
  raster with a coverage mask, boundary rims, `toTexture`), `noise.ts` (value noise, fbm,
  domain warping, ridged), `buildings.ts` (wall and roof painters), `props.ts` (branching
  trees, bushes, rocks, logs, fence posts, lantern posts, the well), `shore.ts` (the
  pond's noise shoreline, cached per angle), `atlas.ts` (packs rasters of any size into
  one RGBA sheet), `scenery.ts` (paints every scenery frame once at start: four seeded
  trees, three bushes, logs, rocks, the cottage, school hut, dojo, well, windmill,
  nursery, bathhouse, workshop, lantern and fence posts, plus lit variants of the
  buildings for dusk).
- `render/ground.ts` is repainted in the organic style at 16 texels per unit (768²):
  warped green drifts and dry patches (coarse fields sampled bilinearly for speed),
  blades and flower drifts, paths with wandering widths and edges, ruts and stones,
  stream banks, the noise shoreline with a wet band, hill scree, stone pads, the crop
  plot, painted tiles. About 0.8 s on this machine; repainted only when tiles change.
- `render/grove-scene.ts`: the pond, its rim, shallows and foam are polygons that follow
  the noise shoreline (`pondOutline`); the old 3D rocks are painted sprites with hidden
  tappable pads for gathering; four point lamps (cottage window and lantern, dojo,
  school) come on at dusk; the hill tops are tinted to sit with the new ground.
- `render/world-view.ts`: scenery sprites keep their painted aspect (`size` is the
  width), get a ground shadow blob, use the `-lit` frame when the lamps are on, and are
  brightened near lamps (`lightAt`), as are placed buildings and fence posts.
- `render/scenery.ts`: placements by painted kind, a windmill at (-16, -5) (tappable,
  a line of flavour text), painted rocks and a lantern post by the cottage door.
- The tool tests import the painters from `src/render/paint`.

**Checks:** full suite green, lint clean, build OK; seen in the browser by day and at
dusk (lit windows, lamps, the sprite lift near them).

**Left for later:** (the props, hills, waterfall and lanterns followed in the next sections); the ground paint could be
faster still (the path distance loop) and could move to a worker.

## Roof redone and five more buildings (2026-10-13, for Maor's pick)

Maor: "try again on the roof art so it's clear what's roof and what is floor. Then
create 5 other building samples that we can use for other places."

**The roof.** The old thatch was the same value and the same stroke texture as the
grass, so the two merged. The new `roofThatch` in `tests/tools/buildings.ts` paints
courses stepped down the slope, each lit at its top with a dark, ragged underside; a
lit slope and a shaded slope split at the middle; a woven ridge cap with spars; a
fringe that hangs below the eave line; and `eaveShadow` throws a dark band onto the
wall under the eave. The cottage in `fractal-day.png` / `fractal-dusk.png` uses it.

**Five buildings** (`tests/tools/buildings.test.ts`, `PREVIEW_BUILDINGS=dir`;
`docs/samples/building-1.png` … `building-5.png`, `buildings-all.png`), each a
different wall and roof material so places read differently at a glance:

1. **The school hut** (kindergarten): a round stone wall curving away at the sides, a
   scalloped slate cone, a bell gable, a painted sign, flower boxes.
2. **The dojo**: a timber hall on a raised floor with shoji panels, a dark entry with a
   blue noren and two red lanterns, two tiers of curved ceramic tile roof with heavy
   ridge beams and upturned ends.
3. **The workshop**: a plank barn with an open front showing the bench, a shelf of
   tools and a vice, doors folded open, a barrel and a log pile, a staggered wood
   shingle roof weathering grey toward the eave, a stone chimney with smoke.
4. **The bathhouse**: rounded river stones, a cornice, a copper dome gone green with
   seams and patches of bare copper, a round window, a glowing window, a steaming tub
   and a towel on a rail.
5. **The windmill**: a tapering stone tower, a plank drum with a shingled cap, four
   lattice sails on a hub, a small window, sacks and flowers at the door.

Shared painters in `tests/tools/buildings.ts`: plaster, stone (square or rounded,
light or dark), plank walls; thatch, slate, tile, shingle and dome roofs; windows with
wavy glass, plank doors, stone steps, flower boxes, ground shadows, the eave shadow.
Every building is tracked for the boundary rim. After Maor's review: the school sign got a fixed dark
frame, the dojo got three stone steps up to its raised entry, and the windmill's sails
became solid cloth in wooden frames with a dark outline all round. These are the kit for the campaign
places and the Digimon-style town if those are picked.

## Organic samples and a procedural dungeon (2026-10-13, for Maor's pick)

Maor: "try again with samples that aren't exactly shape based. Not too triangular or
circular - more like real life which is fractal. Then make a sample as well of a
'dungeon' that is procedurally generated. Add procedural generated dungeons
recommendation to the list of improvements."

**Organic scene** (`tests/tools/env-fractal.test.ts`, `PREVIEW_FRACTAL=dir`;
`docs/samples/fractal-day.png`, `fractal-dusk.png`). Nothing is a primitive:

- Trees grow by recursive branching (six segments per branch, two or three children,
  angles and lengths from the seed, bark from ridged noise, a lit side), and the canopy
  is a cloud of leaf dabs hung on the twigs with its silhouette eaten by a noise field,
  so every tree is different and ragged. Bushes the same way, low.
- The ground is three greens blended by domain-warped noise with dry patches, 16,000
  blades where a finer field is high, flower drifts in another.
- The path's width and edge wander along its length and per pixel; ruts and stones
  come from a wear field; a trodden fringe fades into the grass.
- The pond's shoreline is a noise function of the angle; the bank and the wet band
  follow it; ripples are a stretched field; reeds lean; lily pads are noise-cut blobs.
- Rocks are blobs displaced by ridged noise, shaded by a guessed normal, mossy below.
- The cottage: warped plaster with cracks, timbers that bend, a stone footing of
  individual stones, a thatch with a sagging ridge and ragged eaves built from 2,600
  strokes, wavy old glass, a chimney of stacked stones, a crooked lantern post, a
  sagging fence. The far treeline is a fractal silhouette.
- Boundaries: every object (rocks, trees, bushes, fence, cottage, well, Keeper,
  Nubbin, the water) is tracked into a coverage mask while it is painted, and
  `rimObjects` in `tests/tools/raster.ts` darkens each object's edge pixels and, more
  softly, the background just outside, so each thing reads as a separate thing (Maor,
  after the first render: "add contrast to the borders of each object"). The green that
  showed through the roof in that first render was the near tree's canopy drawn over
  the cottage; objects are now drawn back to front and the tree sits clear of the roof.
- Shadows in the dusk pass are noise-eaten shapes too. Same light pass and HD-2D
  frame as the combined sample. Shared noise code: `tests/tools/noise.ts` (value noise,
  fbm, domain warping, ridged).

**Procedural dungeon** (`tests/tools/dungeon.test.ts`, `PREVIEW_DUNGEON=dir`;
`docs/samples/dungeon-7.png`, `dungeon-2026.png`, and `dungeon-map-*.png` for the
grid). Seeded and pure (`generate(seed)` uses the sim's `Rng`), with a test that the
same seed gives the same dungeon and that every floor cell reaches the stairs:

- A 70×42 cave from cellular automata (52% fill, five smoothing passes), four rooms
  with chipped corners carved in, wobbly corridors joining them, the largest connected
  region kept, water pockets where a noise field is low, torches on walls that face
  floor, crystals in dead-end nooks, stairs in the first room, a chest in the last.
- Rendered per pixel through the grid warped by noise, so the rock faces wander off
  the cells: a lit lip where rock meets floor, deep rock fading to black, flagstones
  with dark joints and cracks, dust gathered at the walls, moss near water and in
  damp corners, pebbles and bones; torches warm and crystals cool as point lights with
  falloff, dimmed through walls; dust motes in the light; fog in the far corners.

**Recommendation 11 (added to the Digimon-inspired list):** _Procedural dungeons._ A
"Hollow Below" entrance in the Grove (and the cave domains of S3 "The Beetle Road"):
each run generates a seeded cave of rooms and corridors with water, torches,
crystals, a chest and a way down; Nubbins explore with the Keeper, find materials,
seeds, essences and lost eggs, meet wild creatures and Shadow strays, and can turn
back any time. Floors get bigger and darker; a daily seed gives everyone the same
dungeon for the request board. The generator above is the seed of `sim/dungeon.ts`;
rendering would reuse the ground painter and the light pass.

## Bigger sample: directions 3 and 5 combined (2026-10-13, for Maor's pick)

Maor: "Do a bigger example of 3 and 5 combined." `tests/tools/env-combo.test.ts`
(`PREVIEW_COMBO=dir npx vitest run tests/tools/env-combo.test.ts`) paints a wider scene
(560×330, written at 2×): the thatched cottage, a lantern post, a big near tree and two
far trees, a fence, a well, three bushes, a winding path, a larger pond with lily pads,
and the Keeper with a Nubbin for scale. `docs/samples/combo-day.png` is the painterly
albedo with the HD-2D frame only (light shafts, tilt-shift, bloom, grade, vignette);
`docs/samples/combo-dusk.png` adds the light pass first (dusk ambient, a low sun from
the left with long cast shadows for every prop, window and lantern point lights with
falloff, fireflies, the lights and the sky reflected in the water), then the same
frame tuned warmer. The shared raster and post code lives in `tests/tools/raster.ts`.

What it would take in the game: the painterly props are the art cost of direction 2
(every prop repainted with tone ramps, roughly one to two weeks for the Grove); the
light pass is a light-map texture drawn per frame from the sun angle and the placed
lights (windows, lanterns, fireflies) and multiplied over the scene, plus a shadow
sprite per prop (about a week); the HD-2D frame is tuning of the existing `PostPass`
(two to three days). The real-clock day cycle and weather already drive the hour, so
the dusk look would appear every evening by itself.

## Five environment art directions (2026-10-13, second attempt, for Maor's pick)

Maor: "Try again on the graphics. Not just additional detail but fundamentally upgraded
each time", pointing at the best-of pixel-art game lists (Octopath Traveler, Eastward,
Owlboy, Hyper Light Drifter, Celeste, Sea of Stars, Stardew Valley, CrossCode). Each
sample is a different way of making the scene, rendered in full colour by
`tests/tools/env-directions.test.ts` (`PREVIEW_DIRECTIONS=dir npx vitest run
tests/tools/env-directions.test.ts`), PNGs in `docs/samples/dir-1.png` … `dir-5.png`.

1. **Tile-grid 16-bit** (Stardew Valley, Link's Awakening). A real 16 px tileset:
   autotiled dirt with rounded corners, water tiles with foam on their open sides, a
   sand ring, the house assembled from wall / roof / window / door tiles, bright
   saturated colours, dark outlines on objects and none on the ground. Engineering:
   a tile layer and autotile rules in `ground.ts`, roughly a week; art is fast after
   that because every scene is tiles.
2. **Painterly hi-bit** (Owlboy, Eastward). No grid, no outlines; forms carried by value
   and colour, six-tone ramps, a canopy of 2,600 leaf dabs lit from the upper left,
   gradient walls, a thatched roof in brush strokes, soft shadows, haze at the top.
   The most expensive in art time (every prop is a painting) and it needs the palette
   opened up from 48 colours to per-material ramps; one to two weeks for the Grove.
3. **HD-2D** (Octopath Traveler, the Dragon Quest remakes). Crisp tile sprites inside a
   photographic frame: tilt-shift depth of field, bloom, diagonal light shafts, a warm
   grade, a vignette. Our `PostPass` already has bloom, tilt and grade, so this is two
   to three days of tuning plus the light shafts and cast shadows.
4. **Chunky limited palette** (Hyper Light Drifter, Celeste). Half the resolution, twelve
   colours, no outlines; silhouettes, a hard rim light from one side, dithered sky,
   teal shadows and magenta accents. Cheapest to produce and strongest identity, but
   it is a change of the whole look (the 64 px Chao would be redrawn at 32 px, which
   is the design grid we already draw on). About a week.
5. **Dynamically lit dusk** (Sea of Stars). The painterly scene as an albedo layer with a
   real light pass: a dusk ambient, a low warm sun with long cast shadows, point lights
   from the windows and a lantern with falloff and water reflections, fireflies, bloom.
   Needs a light map in the renderer (one draw of lights into a texture multiplied over
   the scene) and shadow shapes per prop; one to two weeks, and it pays off most with
   the real-clock day cycle we already have.

My recommendation: 5 built on 2 if the goal is "best looking"; 3 if the goal is the
biggest change for the least time; 1 if the plan is many more areas (the Digimon-style
campaigns), because tiles scale.

## Five environment graphics samples at rising effort (2026-10-13, for Maor's pick)

Maor: "provide 5 different samples of upgraded graphics for the environment/buildings/etc.
at various levels of effort and a quick blurb of each." Rendered from one vignette
(cottage, tree, path, pond corner, fence, bushes) by `tests/tools/env-samples.test.ts`
(`PREVIEW_ENV=dir npx vitest run tests/tools/env-samples.test.ts`); the PNGs are in
`docs/samples/env-1.png` … `env-5.png` and the strip `env-all.png`.

1. **Flat clean-up (about half a day).** Today's shapes with the palette ramps tidied:
   flat grass, a plain path, a two-tone roof, simple windows. The baseline.
2. **Texture pass (one to two days).** Grass drifts in three tones with tufts and
   clover, path rims with a pale worn centre, roof tile rows, wall beams, window
   mullions, lobe highlights on trees and bushes, ground pads under buildings.
3. **Fine-grid detail (three to four days).** Uses the 64 px grid fully: individual
   shingles and a chimney, a stone base course, plaster speckle and braces, shutters
   and flower boxes, a plank door with a step, pebbles on the path, leaf clusters and
   fruit in the canopy, berries on bushes, a shallows ring and wave crests on the pond.
4. **Light and shadow (plus two to three days).** A sun from the upper left: a lit and
   a shaded roof half, shade under the eaves and on the far wall, cast shadows for the
   tree, house and fence, dapple under the canopy, glass reflections and a warm window
   glow, sky reflections on the water. This is the step that makes the scene read as a
   place rather than a sticker sheet.
5. **Hero set dressing (plus three to five days, ongoing).** Living detail: chimney
   smoke, a lantern, a crate, a swing, birds, foam at the bank, lily pads and reeds,
   flagstones laid into the path, grass blades over its edge, wildflower drifts. The
   reference-tileset look; the cost is drawing time per prop and a little draw time.

Each level is cumulative; the renderer already supports all of it (the same palette,
`PixelCanvas` and the one sprite batch), so the choice is art time, not engineering.
Recommendation: 4 for the whole Grove, with 5 reserved for the cottage, the square and
the campaign places.

## Next list: inspired by Digimon World and its sequels (2026-10-13, for review)

Maor: "take for inspiration digimon world and the sequels. Recommend multiple campaign
expansions or alternates (some completely separate, not add ons to the original)."
Sources: the Wikipedia pages for Digimon World, Digimon World 2, 3, Re:Digitize, Next
Order, World DS and Dawn/Dusk, plus guides (speedrun.com, Grindosaur, RPGFan). The
mechanics that define the line: one partner raised through a short lifespan with hidden
care mistakes deciding its next form; a ruined town rebuilt by recruiting the creatures
you meet (prosperity); training gyms run by recruits; a real clock with curfews and
sleep; death and rebirth as an egg with a little carried over; later games add a second
partner, a merged form, town materials, tamer skill trees, a data-scanning farm, guard
teams and dungeon tanks, and an MMO-trapped-online story.

**Systems (ten):**

1. **Prosperity and recruits.** A ruined village square beyond the cottage. Every wild
   visitor, stray and neighbour's Nubbin you befriend (fed, raced against, beaten at
   karate) can be _recruited_: it moves in, raises a prosperity meter and opens something
   (a stall, a gym, a bathhouse attendant, a fortune teller). Files-City-style: the
   town fills in visibly as the meter climbs.
2. **Care mistakes, made visible.** A gentle version of the hidden counter: ignoring a
   mood bubble for too long (hungry, sleepy, needs the pond, lonely) logs a "slip"; the
   stats sheet shows the last few. Slips weight the evolution toward the Grumpy or
   Sleepy forms (new lower-tier looks per type) and shorten the lifespan a little; a
   clean childhood unlocks the "well-raised" bonus grade.
3. **Training gym with mini-games.** Recruits run four stations (Swim lane, Fly rings,
   Run track, Power rocks): 20-second timing/rhythm games that give points to one stat,
   cost energy, and give _more_ when the Nubbin is rested and fed (so the daily routine
   matters, like Digimon World's "train while hungry = mistake").
4. **Two partners and a merged form.** Pick a _partner pair_ that follows the Keeper;
   both gain bond; at full bond with a bought "twine" they can merge for sixty seconds
   into a glowing ExE-style form for races and karate, then split (stats shared,
   nothing lost).
5. **Lifespan clock and curfew.** Nubbins sleep at night by the real clock unless the
   Keeper lights the lanterns; late play tires them (energy drains faster after
   midnight); a short "day count" on the sheet shows the age in days and what the
   typical span is for that line, so rebirth stops being a surprise.
6. **Rebirth inheritance tree.** Each rebirth keeps a chosen _memory_ (one grade, one
   part, one lesson, one accessory) and records the lineage in a family tree on the
   profile; three generations of the same line unlock a heirloom look.
7. **Keeper skill tree.** Tamer-style points from achievements and quests buy small
   permanent perks (hatch 10% faster, fruit lasts longer, lessons cost less, a second
   carry slot), 24 nodes in four branches: Care, Garden, Games, Story.
8. **Scan and convert (DigiFarm-style).** Meeting the same wild species repeatedly fills
   a scan bar in the Collection Book; at 100% the Book can _convert_ the scan into an
   egg of that species, so every species is reachable without luck.
9. **Guard-team expeditions.** Three teams (Dawn, Dusk, Dew) with a leader each; join
   one for weekly missions in the Expedition minigame with team-coloured rewards, a
   team rank, and a rivalry leaderboard (local, seeded).
10. **The tank run.** A Digi-Beetle-style vehicle minigame: drive a little cart through
    a seeded cave with hazards (spores, loose rocks, acid puddles), a limited cargo of
    items, and a boss door at the end; shells and materials come home.
11. **Procedural dungeons.** A "Hollow Below" entrance in the Grove (and the cave domains
    of S3): every run generates a seeded cave of rooms, corridors, water, torches,
    crystals, a chest and a way down; Nubbins explore with the Keeper, find materials,
    seeds, essences and lost eggs, meet wild creatures and Shadow strays, and can turn
    back any time. Floors get bigger and darker; a daily seed gives everyone the same
    dungeon for the request board. The generator in `tests/tools/dungeon.test.ts` is
    the seed of `sim/dungeon.ts`; see "Organic samples and a procedural dungeon".

**Campaign expansions (add-ons to Hazel's Grove):**

- **E1. The Square.** A chapter after the ending: Hazel's letter mentions the old
  village square; rebuilding it (system 1) is the arc, with Corvin returning as a
  reformed recruit if the Corvin ending was earned.
- **E2. Nova's Season.** A twelve-day side story told through the lifespan clock
  (system 5): a Nubbin with a short span that the Keeper raises right or wrong; both
  outcomes are written, with a memorial or a rebirth epilogue.
- **E3. The Twine.** A short arc that teaches the two-partner merge (system 4) through
  the Hollow's strays; it ends with a karate tournament against the ten Keepers.

**Separate campaigns (new slots, not add-ons):**

- **S1. "The Hundred Days".** A Digimon World-style single-partner campaign: one egg,
  one real-time lifespan of ~15 days (or ×10 debug), a ruined village to refill by
  recruiting wild creatures across six areas (meadow, shore, cave, mountain, mire, the
  old mill), prosperity gates the story, care mistakes shape the partner, and a
  Machinedramon-style final threat (a Shadow colossus at the mountain). Ending by the
  partner's final form and the town's prosperity. 8–10 hours.
- **S2. "Logged In".** A Digimon World 3-style story: the Keeper is a child inside a
  "Grove Online" game that locks everyone in; three partners in a party, turn-based
  bouts in a card-like format reusing karate strikes, two mirrored "servers" (Day Grove
  and Night Grove maps), a mystery about who runs the game (an adult-themed thread
  about a company and a missing sibling is allowed). 6–8 hours.
- **S3. "The Beetle Road".** A Digimon World 2-style expedition campaign: a guard
  team, the tank run (system 10) through seeded cave domains with bosses, DNA-style
  fusing of two Nubbins into one (a careful, consented version with the breeding sim),
  a team leader's missions, and a reveal about the Grove's "weather machine". 5–6 hours.
- **S4. "Dawn & Dusk".** Two mirrored short campaigns picked at the start (Sun Keeper
  team or Moon Keeper team), each with four species families to serve quests for, tamer
  rank tests in the dojo, scan-and-convert (system 8) as the collection engine, and a
  degeneration mystery (Nubbins reverting to eggs) that both sides solve from their
  angle; the other half unlocks after one is finished. 4 hours each.

Suggested order if all approved: systems 1, 2, 3, 5, 6 with E1 and E2; then S1 as the
first separate campaign (it reuses the most); then 4, 7, 8 with E3; then S4, S2, S3 and
systems 9, 10.

## Learning Grove: the educational mode, built (2026-10-13)

Maor: "finish the 20 then educational mode. Edu mode should give you recommendations on
the content but you should be able to add/remove specific mini games at will to
personalize." Built on the ten recommendations above.

**What works:**

- **Title → Learning Grove (ages 3–6)**: pick the age (big 3 / 4 / 5 / 6 buttons); the
  mode has its own save slot (`grove.save.edu`, `?edu=4` for dev). It is a Free Grove
  underneath: the same garden, Nubbins, shop and care, with races and karate hidden and
  the 🏃 button replaced by 🎓 Play & learn.
- **Six games** (`minigames/edu/games.ts`, pure and seeded; `ui/edu.ts` draws them):
  Colours (find it, then "which is not"), Letters (names → first letters of picture words
  → big/small; the child's own name's letter comes up often), Counting (count icons to
  3 / 5 / 10, more or fewer, little sums at 6), Shapes (three at 3, up to eight at 6, "how
  many sides" at 6), Sounds & rhymes (animal sounds at 3, first sounds at 4, rhymes at 5,
  syllable claps at 6), Animals (names → sounds → homes → babies). Three options at age 3,
  four above. Five rounds per play; no timers; three tries, then the answer is shown with
  a teaching line and the round still counts. Stars 3/2/1 by tries, Shells per star, a
  fruit for a perfect round, a sticker every nine stars.
- **Recommendations plus personalisation** (`config/edu.ts` `EDU_RECOMMENDED`,
  `sim/edu.ts`): each age starts with its recommended set; the grown-up area has a
  checkbox per game tagged "Recommended for age N", any game can be switched on or off,
  "Reset to recommended", and changing the age re-applies the recommendations.
- **Grown-up area** (More → Grown-ups, behind a sum gate): age, child's name, session
  length (10–60 minutes), the game toggles, progress by learning area (Thinking & maths,
  Letters & reading, Listening & sounds, Animals & nature), stickers, a co-play prompt.
- **Break screen** after the session length; a grown-up can extend it from the screen.
- Toasts for stars and stickers. Everything offline, no ads, no external links.

**Checks:** `tests/sim/edu.test.ts` (recommended sets and personalisation, Shells and
stickers, session clamp and break, save round trip and old-save default, every game at
every age generates valid rounds, age-3 limits, syllables). Full suite green, lint clean,
build OK. Verified in the browser pane: title age picker, the picker, a Counting round
with feedback and Next, the gate, the grown-up panel.

**Known gaps:** the games use emoji for pictures (platform assets, not in-house pixel
art); there is no read-aloud voice (text only, a grown-up reads); the campaign is not
offered in the Learning Grove rather than rewritten for it.

## The twenty improvements, built (2026-10-13)

Maor: "Let's move forward to all 20 of the pending items on our improvement list next",
then "finish the 20 then educational mode". The sim layer landed first (commit `a6c7156`);
this entry is the render, UI and audio layer on top. Everything below is playable.

**What works:**

- **Orchard and crops** (Decorate → Orchard & crops): seeds by flavour from Expeditions and
  harvests; plant a tree or a crop row on the grass; four growth stages drawn from the prop
  sheet (`treeStage0–3`, `cropStage0–3`); grown trees drop flavoured fruit (tinted frames
  `fruit-<flavor>`); tap a plant to water it, tap a ripe crop to harvest. Dry plants draw
  darker.
- **Toys** (Decorate → Toys): ball, radio, blocks, mirror, little TV, each with a prop
  sprite and its own idle effect; placed with a ground tap.
- **Paint tiles** (Decorate → Paint tiles): dirt, water, flowers, stone, grass to erase;
  painted into the ground texture (`makeGroundTexture(seed, tiles)`, repainted on
  `tilePainted`). Water tiles are swimmable.
- **Workshop** (Decorate → Workshop, or tap the workshop): wood from shaken trees, stone
  from a tap on a rock, reeds from a tap on the stream bank; recipes for every garden
  piece, the three buildings, a ball and dyes (colour picker). Materials shown in the tab.
- **Buildings as placed pieces**: nursery (bred eggs are laid beside it), bathhouse
  (glum Nubbins go for a soak: happiness and energy, splash particles), workshop. Drawn
  from the scenery sheet at 3.6 units, tappable.
- **Habitats and wild visitors**: rock piles and thickets as props; a wild creature of the
  pocket or digital line visits a complete patch with a "?" over its head, hops when fed;
  tap it with fruit in your pocket (`feedWild`, `wildFed` toast); after enough visits or one
  feeding it settles into the roster.
- **Requests** (More → Requests): three daily asks with progress and a Claim button; the
  board refreshes on a new real day; rewards in Shells and sometimes an egg.
- **Keeper profile** (More → Keeper profile): title picker from earned badges, garden plots
  (roster room), borrowed moves from loved adults, a badge grid for the twenty-one
  achievements.
- **Neighbourhood** (More → Neighbourhood): visit any other Keeper's Grove; their pets are
  generated from their id and drawn read-only with the host standing by; tap the host (or
  the panel button) for a daily gift; "Go home". Your own Nubbins, pieces and items stay
  home while you visit.
- **Map** (More → Map): found landmarks on a 6×6 grid laid out like the field; tap one to
  fast-travel.
- **Accessories** (stats sheet): dye the hat or a scarf with workshop dyes, toggle glasses;
  drawn on the Chao sprite in every angle (`DYE_COLORS`, recolour of the hat, a scarf
  under the chin, round frames over the eyes) and keyed into the sheet cache.
- **Local co-op** (Settings → Second Keeper): a second Keeper with a chosen look; IJKL
  moves, U pets, O feeds; the first gamepad's left stick and A/B do the same.
- **Jukebox and ambience** (Settings): pick any piece of the score or leave it automatic;
  an ambient layer with birds by day, crickets at night, rain hiss and the stream when
  the Keeper is near the water or the falls (`setAmbience` in `platform/audio.ts`).
- **Species chirps**: Chao, pocket and digital lines each have a small voice on reactions
  and when a wild one arrives (`playChirp`).
- **Sled spray** in snow, **festival** and every other new event has a toast.
- Photo mode reports the species to the sim for photo requests.

**Checks:** 170 tests pass (5 skipped), lint clean, build OK. Verified in the browser pane:
plants, toys, buildings, tiles, the wild visitor, the second Keeper, Fern's Grove, the
accessory photo, the Decorate tabs, Requests, Profile, Map, the Settings additions.

**Known gaps:** the map grid is schematic rather than a drawn map; neighbours' Groves reuse
the home layout; gamepad input is polled only while the game tab has focus.

## Educational mode: review and recommendations (2026-10-13)

Maor asked for an educational mode (age 3–6, age-appropriate mini-games: matching,
colours, letters, sounds, animals) and a review of leading materials first. Sources read:
the Head Start Early Learning Outcomes Framework (five domains: Approaches to Learning,
Social-Emotional, Language and Literacy, Cognition, Perceptual/Motor), kindergarten
readiness checklists (Kansas City schools, Idaho libraries, Pennsylvania TFEC), app
roundups naming Khan Academy Kids, PBS Kids Games, Endless Alphabet, ABCmouse, Montessori
apps, and Sesame Workshop's Play to Learn findings. The ten recommendations are in the
chat log of 2026-10-13 and summarised here:

1. Age bands 3 / 4 / 5 / 6 with a skills ladder per band, not one difficulty slider.
2. Guided play: every lesson is a Grove activity (feed by colour, call the Nubbin whose
   name starts with the letter), never a worksheet.
3. Letters: names first, then sounds, then first-letter matching (readiness benchmarks:
   10–15 letters by 5, the child's own name first).
4. Numbers: count objects up to 5 at age 3, 10 at 5; more/less; shapes circle, square,
   triangle, then rectangle.
5. Colours: 5 at age 3, 8 by 5; sort by colour, shape and size.
6. Phonological awareness: rhyme pairs, first sounds, clapping syllables; the Nubbins'
   chirps as the sound bank.
7. Animals and nature: identify by sound and silhouette; the three species lines and the
   Grove's weather and seasons as the content.
8. Social-emotional and self-regulation: turn taking, naming feelings (the Nubbins'
   moods), kindness choices (trust is already a mechanic).
9. Adaptive difficulty with no fail state: three tries, then a demonstration; stars
   and stickers, no timers for ages 3–4.
10. Grown-up gate and co-play: a parent area for age, session length (20–40 minutes),
    progress by domain, with co-viewing prompts; everything offline and ad-free.

## Bigger field, stream, water, hills, run (2026-10-13)

Maor: "water graphics and some of the hills aren't up to the standard. Keep upgrading and
increase the size of the field." Plus "give a run option".

- **Field** 32 → 48 units (`GROVE.size`, `SIM.worldHalf` 22). New layout: pond at (7, 6)
  r 5; four trees; four hills (the big one at (16, -16) carries the waterfall); cottage
  (-7, 14), school (-3, -18), dojo (18, -4), well (3, 10); NPC homes, bushes, logs and
  decor spread to match; particle ranges follow the size.
- **Stream** (`GROVE.river`): an inflow from the waterfall pool into the pond and an
  outflow to the south edge, built as ribbon meshes (`ribbon()` in `grove-scene.ts`)
  with UVs along the flow so the wave tile scrolls downstream; painted banks (sand, wet
  band, dark grass edge) in the ground texture; a plank bridge (`GROVE.bridge`) where the
  path to the dojo crosses.
- **Water**: `makeWaterTexture16` (crests with lit tops and dark troughs, deeper patches),
  a transparent `makeWaterGlintTexture` layer drifting the other way, a lit shallows ring
  at the bank; the same materials on the pond and the stream.
- **Hills**: three tiers with `makeCliffTexture` (strata, jutting rocks, cracks, moss, a
  grass lip) repeated by each tier's circumference, `makeGrassTopTexture` on top, scree
  painted at the foot.
- **Run**: `keeper.running` (saved), `setRunning` command, `KEEPER.runMultiplier` 1.8, a
  🏃 Run toggle bottom-left and Shift hold on keyboards, a faster walk cycle.
- The path network now reaches every building, the bridge and the far tree.

## Graphics upgrade toward 16-bit top-down RPG art (2026-10-13)

Maor's reference: a professional top-down RPG tileset (dense multi-tone grass, rounded
dirt paths with rims and pebbles, layered round tree canopies with highlight clusters,
terraced cliffs, shore bands, cottages with tiled roofs, fences, crop rows, chunky outlined
characters). What changed:

- **Scenery as pixel sprites** (`render/sprites/scenery.ts`, placements in
  `render/scenery.ts`): two tree variants (layered lobes, dark underside, highlight
  clusters, fruit), two bushes, a cottage with a tiled roof, chimney, flower boxes and a
  round door, the kindergarten hut with a bell gable and sign, the dojo with a double roof,
  round window and noren curtains, a well, logs. Billboarded through the one sprite batch;
  trees sway; trees and buildings are tappable (tree → shake; school → Kindergarten,
  dojo → Karate, cottage → Pocket mode). The 3D lobed trees and bushes are gone from the
  Grove (the Hollow keeps its dark 3D wood).
- **Ground** (`render/ground.ts` rewritten): three-tone grass drifts with 1,400 fine tufts,
  flower and clover clusters, rounded paths with a pale centre, a dark rim and a grass edge,
  a sand shore with a wet band around the pond and the pool, stone pads under the
  buildings, a crop plot of soil rows and sprouts by the cottage, shade under trees and
  bushes, pebbles along the paths and shore, fence posts along the main path.
- **Hills** are terraced plateaus: two tiers with a strata cliff texture on the sides and
  grass on top, instead of smooth spheres.
- **Keeper sprites**: pants seam, lit boot soles, shirt highlight and shade, collar, belt
  with a buckle, cuffs, hair under the hat and over the ears, eyes with whites, brows, a
  mouth and a jaw shadow.
- **Water**: wave crests with lit arcs and dark troughs.
- Decor placement keeps clear of the buildings and the crop plot.
- `PREVIEW_SCENERY=path.png npx vitest run tests/tools` renders every scenery piece and a
  Keeper strip.

**Still thinner than the reference:** no cliff tiles painted into the ground (the hills are
3D), no roof-side perspective on the buildings (billboards face the camera), the Nubbin
sprites were not touched in this pass.

## Everything that was left, the ten recommendations, settings and interactions (2026-10-13)

Maor: "Complete what is not built yet. Then do all 10." Plus mid-turn: settings sliders and
missing settings, more Nubbin interactions, and a logins/multiplayer plan (plan only).

**Built (what works):**

- **Weather** (`sim/weather.ts`): clear spells, rain, snow in winter; seasons from the real
  calendar. In rain most Nubbins shelter under a tree (`shelter` state, a little happiness),
  swimmers go to the pond and gain Swim lean. Rain streaks and splashes, snow flakes that
  settle, a cooler grade and a darker rig. Debug: `debugWeather`.
- **Breeding** (`sim/breeding.ts`): heart fruit in the shop (80 Shells) or from a visitor;
  feed it to an adult with affection 30+ (never an Eternal); it courts for 90 s and makes an
  egg with any adult within 2.5 units. The egg takes a parent's colour and lineage, mixes
  grades (the better one half the time), has a shine chance, records parents and
  generation. Roster cap applies.
- **Kindergarten** (`sim/kindergarten.ts`, More → Kindergarten): four lessons at 25 Shells,
  45 s each, three levels; a schooled Nubbin performs idly (star ball). Doctor (15) prints
  the hidden numbers; fortune teller (20) reads the likely adult form, personality and
  whether rebirth is in the cards.
- **Karate** (`sim/karate.ts`, More → Karate): a timing-bar bout on a dojo canvas; Power,
  Stamina and Run decide damage, HP and dodges; three tiers, belts, prizes; per-Nubbin and
  per-Grove records; Leave/Escape; own music.
- **Collection book** (`sim/collection.ts`, More → Collection): every species and Chao
  form seen, silhouettes for the rest, toasts on first sightings.
- **Decorating** (`sim/decorate.ts`, More → Decorate): fence, flower bed, bench, statue,
  path stone, garden lantern; buy, then tap the grass to place (snaps to half units, keeps
  off the pond and trees), tap a piece to pick it up; a placing chip with Done.
- **Daily rhythm** (`sim/daily.ts`): once per real day a Keeper visits with a gift (Shells,
  fruit, an egg, a heart fruit) and potters about; Saturday is lantern night.
- **Share codes and trades** (`sim/share.ts`): roster → Share code copies a checksummed
  code; Trade away sends the Nubbin off for good; More → Receive pastes one in (fresh id,
  free name, roster cap).
- **Photo mode** (More → Photo): a framed pixel snapshot with name, form, age and date,
  saved as PNG. **Memorial cards**: tap a flower to read who it was, what they grew into,
  how long they lived, rebirths, and how long ago they moved on.
- **Pocket mode** (More → Pocket, or `?pocket`): one Nubbin close up with meters and
  quick actions, a picker for the others.
- **Campaign places**: chapter 8 moves to the Hollow (dark wood, fireflies, strays, Hazel's
  notebook on a flat stone to tap; the Expedition runs through the Hollow theme), chapter 9
  to Corvin's garden (pale pens, thirty grey rows, Corvin and Ember). Back to the Grove at
  chapter 10. Hidden scenery cannot catch taps.
- **Per-chapter music**: sorrow (6, 11, ending), tense (5, 9, Corvin's garden), hollow,
  karate; four new pieces in `platform/audio.ts`.
- **Bitmap font** (`render/sprites/font.ts`): a 5×7 pixel font for the race, Expedition,
  karate, photo and pocket canvases. The DOM HUD keeps the system font.
- **Hats** got fine-grid weave, jewels and ribs. Species eyes were done in the previous pass.
- **Interactions** (stats sheet, pocket mode): tickle, hug, brush, high five, praise, tuck
  in (only when tired), call (the Nubbin, or everyone, comes running), play catch (throws
  the ball, the Nubbin fetches it back), heart fruit. A wary Shadow refuses the touchy ones.
- **Settings**: music and effects volume sliders, story text speed, screen shake, particle
  density, reduced-motion override, fullscreen, back to title.
- Tests: 170 Vitest cases.

**Not built, by design:** logins, cloud save and online visiting need a backend; the plan
is in `docs/multiplayer-plan.md` (Supabase, optional accounts, cloud save by newest,
read-only visiting with a mailbox, escrowed trades, leaderboards).

**Known gaps:** the pocket mode is a panel, not a home-screen widget; decorations are
sprites, not collidable; the doctor and fortune teller show their reading in the panel
right away (the Shells are taken by the sim). The desktop browser pane kept executing a
stale `kindergarten.ts` after the save-compat fix; the dev server was restarted.

## Score, settings, environment and eye pass (2026-10-13, after the 540p move)

- **Music** (`platform/audio.ts`): an original score on a small Web Audio sequencer. Six
  pieces in a readable note notation: `grove` (garden waltz, day), `night` (music box),
  `title` (rising brass motif), `race`, `expedition`, `story` (under dialogue). Synth
  voices: lead, pluck, bass, pad, bell, brass, kick, snare, hat, through an echo, a
  generated hall and a compressor. The HUD loop picks the piece (dialogue > minigame >
  hour). Written in the spirit of the cozy-garden and big-adventure scores Maor named;
  nothing quoted.
- **Settings:** Music and Sound effects are separate switches (`settings.music`, defaulted
  in `validateWorld`, no save version bump). A ✕ Leave button (and Escape) exits the
  Expedition or a race at any time; an early leave keeps the shells collected so far and
  counts a race as last place with no prize.
- **Environment:** gradient sky textures per phase with pixel clouds by day; trees are a
  bark-textured tapered trunk with roots and a crown of seven leaf-textured lobes (two
  greens); bushes are leaf-textured lobes; mossy rocks at the hill feet; tall grass along
  the edges, reeds on the pond rim, lily pads on the water; the ground texture gained
  blade clusters, clover, damp shade around the water and worn path rims.
- **Eyes/glitch pass:** angry creature eyes are a narrowed eye with a brow, iris and
  glint; dot eyes a bead with a glint. `PREVIEW_ANGLES=path.png npx vitest run tests/tools`
  renders every angle and clip for a few looks; nothing stray showed at 64 px.

## What is not built yet

Only the server-side pieces: logins, cloud save, online visiting (see
`docs/multiplayer-plan.md`). Everything else from the earlier list is built as of 2026-10-13.

## Recommendations (from the games this one grows out of)

1. **Kindergarten lessons (Chao Garden):** drawing, singing, dance and instrument classes
   that teach a Nubbin a skill it performs idly in the Grove. Cheap to add on the existing
   `skills` field and the idle state machine; big charm return.
2. **Karate tournament (Chao Garden):** a third minigame on the race screen's bones, with
   Power and Stamina deciding the bouts and belts as prizes; `karateRecord` is waiting.
3. **Breeding with genes (Chao Garden, Monster Rancher):** two adults near a heart fruit
   produce an egg inheriting colour, shiny and stat grades; the `genes` field exists and
   the catalogue already has 60+ looks to recombine.
4. **Collection book (Pokémon's dex, Digimon's field guide):** a page per species and
   Chao form seen, with hatch and evolution hints; turns the 100+ looks into a goal.
5. **Garden decorating (Animal Crossing, Viva Piñata):** buy and place fences, paths,
   flowers and toys; the decor layer and shop are ready, placement needs a drag mode.
6. **Daily rhythm and events (Animal Crossing, Neko Atsume):** visiting Keepers with
   gifts on real-clock days, a weekly lantern night, seasonal fruit; the real-clock
   daylight and NPC system already carry most of it.
7. **Weather (Stardew Valley):** rain that fills the pond, makes Nubbins shelter under the
   trees and raises Swim lean; snow in winter; a few particle kinds and a grade tint.
8. **Doctor and fortune teller (Chao Garden):** a hidden-stats readout for Shells and a
   naming/personality reading; both are small UI panels over existing data.
9. **Share codes (Tamagotchi's connection, Digimon's battles):** export a Nubbin as a
   short code a friend can import as a race rival or a visiting guest, no server needed.
10. **Photo mode and memorial garden:** a framed snapshot with the Nubbin's name and
    form, and a spot where memorial flowers can be visited and read; the departures are
    the game's most emotional moments and deserve a place.

## Ten more recommendations, from Pokémon Pokopia (2026-10-13)

Pokopia (Switch 2, March 2026) is a combat-free life-sim sandbox: you play a Ditto in human
form, gather wood, stone and fibre, craft furniture, fences, paths and buildings, terraform
blocks into habitats (forest, water, rocky slope, open field) that attract specific
Pokémon, borrow their moves (Water Gun waters crops, Leafage grows grass, Cut and punch
clear trees and rocks, Surf and Glide for travel), farm crops that feed residents, take
requests from residents (repair a bridge, fix a building), and play drop-in with up to
four people on a real-time day-night cycle with weather.

1. **Habitats that invite species:** shape patches of the Grove (pond edge, rocky corner,
   flower meadow, dark thicket) and have wild pocket- and digital-line creatures wander in
   to settle when the patch suits them, instead of only hatching from eggs.
2. **Gathering and crafting:** wood from shaken trees, stone from the hill rocks, reeds
   from the pond, turned into the decor pieces, toys and hats at a workbench, so Shells are
   not the only economy.
3. **Terraforming tiles:** a tile painter for grass, dirt, water and flowers on a grid, so
   the pond and paths can be reshaped; the ground texture already renders from a grid.
4. **Borrowed moves (Chao-style):** a bonded adult lends its Keeper an ability: a Swim
   type lets you wade the pond, a Fly type glides off the hills, a Power type shakes whole
   trees at once, a Run type sprints. Ties the stats to how you play.
5. **Crops:** till a plot, plant seeds from Expeditions, water it (or let rain do it), harvest
   stat fruit; Nubbins with a watering lesson help.
6. **Resident requests:** a board of small asks from Nubbins and visiting Keepers (bring
   three fruit, fix the fence, find my lost ball), paid in Shells and friendship.
7. **Buildings:** a workshop, a nursery for eggs and a bathhouse that each unlock features
   (crafting, faster hatching, grooming), placed like decor and built over sim time.
8. **Real-time weather tied to activities:** rainy-day lessons, snow-day sledding on the
   hill, dry-spell watering chores; the weather system already runs.
9. **Drop-in local co-op on one screen:** a second Keeper on a gamepad or touch split,
   sharing the Grove; no server needed and a bridge to the multiplayer plan.
10. **Photo spots and a world map:** landmarks to discover (the stone in the Hollow, the
    waterfall ledge), each a photo-mode backdrop and a fast-travel point once found.

## Campaign mode and the graphics upgrade (2026-10-13)

Maor approved the plan ("go now"): graphics first, then a full story campaign with at
least six endings and a treat-them-well mechanic. Resolution stays 270p (32 px sprites);
**Decision (Maor, 2026-10-13): 64 px (540p).** Done the cheap way: every drawer keeps its
32 px design coordinates and `PixelCanvas` rasterises them on a 2× grid (`PX` in
`pixel-canvas.ts`): curves come out smooth, outlines and highlights are one fine pixel
wide, and drawers add detail on the fine grid (`dot`, `thinLine`, fractional ellipses).
The Chao face got an iris, pupil and two glints, a thin smile, cheeks and a belly
highlight; big and cute creature eyes got an iris too. Frame height 540, pixels per unit
16/32, mega atlas 4096², post-pass blur radii doubled, minigame canvases draw at 2× with
art scaled back to design size. The 32 px look remains reachable by setting `PX = 1`.
The earlier samples (`chao-hires.ts`) were removed once the real drawers hit 64 px.

**Graphics passes (what works):**

- HD-2D post pass (`render/post.ts`): bloom, tilt-shift, vignette, colour grade, all at
  frame resolution. Time of day from the real clock (`render/daylight.ts`): dawn/day/
  dusk/night sky, light rig, grade, lanterns and fireflies; debug buttons force an hour.
- Particles (`render/particles.ts`, one draw call through the sprite batch): dust on
  landing and footsteps, hearts on petting, sparkles for hatch/evolve/Eternal, crumbs,
  leaves and petals from shaken trees, ripples under swimmers, fireflies at night,
  drifting leaves by day, waterfall spray. Reduced motion drops the ambient layer.
  Sprites dim with the darkness of the hour.
- Motion: eight-frame breathing idle with a blink, six-frame walk (contact / push-off /
  passing with lift and squash), draw-time landing squash and hatch/evolve pop.
- Environment: one 256×256 ground texture with grass patches, ragged dirt paths from the
  start to the pond and trees, pebbles and flowers; seeded decorations (tufts, daisies,
  bluebells, pebbles, mushrooms, stumps, a signpost) drawn as sprites.
- Pixel UI: 2 px borders, stepped corners and bevels on every panel and button.
- Palette grew to 48 colours with hue-shifted ramps; every generated sprite gets a light
  pass and a coloured outline.

**Campaign "Hazel's Grove" (what works):**

- Own save slot (`grove.save.campaign`); the title screen offers Campaign / Free Grove,
  Continue or New, and the Keeper choice for a new campaign. `?free` skips the title.
- Trust per Nubbin (`sim/trust.ts`, tuning `TRUST`): pets +3, hand-feeds +4, throws −8,
  drops −3, starving −1.5/min, crying −0.5/min. Under 15 → **Shadow** (grey coat, ember
  eyes, dark emote ball, keeps 4 units from the Keeper, never greets; for life). Shadow
  gains trust at 60% until it **bonds** at 70 (dark heart ball, loves again). Under 5
  for ten minutes → **runs away** into `world.strays`; strays return to the Grove edge
  after twenty minutes with `stray: true` and settle when fed or petted. Stats sheet
  shows a Trust meter and a Shadow / bonded / Stray tag.
- `sim/campaign.ts`: twelve chapters (`config/story.ts`), each an opening scene, a goal
  and a closing scene; triggered scenes (first Shadow, run-away, stray return, Sable
  bonding, first pet of Moss); NPC Keepers (`sim/npcs.ts`: the nine other trainers plus
  Corvin and Hazel) who potter near a home spot and face you; tap to talk. Lantern posts
  are tappable (`lightLantern`) and glow once lit. Moss (Eternal Neutral) and Sable (a
  Shadow stray) are real Nubbins in the roster. Eight endings decided from flags; see
  `docs/campaign-endings.md` for how to reach each one (also on the Journal's Paths
  page).
- UI: dialogue box with portraits (Keeper sheets, Moss and Sable's own sprites),
  typewriter text (instant under reduced motion), tap/space to advance, choice buttons;
  Journal (📖) with goal, hint, Sable/Moss trust, friends, chapter list, Paths; ending
  card; story toasts; debug buttons for chapter jumps, campaign start and Trust −40.
- Save v2 with a 1→2 migration (trust fields, strays, npcs, campaign).
- Tests: 155 Vitest cases, including trust/Shadow/run-away/return, the migration, every
  ending driven through the state machine, story data integrity.

**Stubbed / left out:** parallax sky and weather; a bitmap font (the system font stays);
Corvin's garden and the Hollow are told in dialogue rather than built as scenes; the
expedition is not reskinned for chapter 8; music does not change per chapter.

**Known bugs / notes:** the browser pane sometimes grabs a cleared frame right after a
burst of console-driven frames (a blank blue screenshot); a second screenshot is fine.
Two stale "500" console errors in the pane came from mid-edit HMR, not from the app.

**Assumptions:** the ten trainers double as the story cast; the player's own Keeper hands
their lines to an understudy (`UNDERSTUDY` in `config/story.ts`). Adult themes were
allowed by Maor: Hazel's illness and death, Corvin's cruelty, grief and guilt, no gore.

## After v1: optimisation, optional items, three creature families, ten Keepers (2026-10-12)

Maor's follow-up ask, done in order:

1. **Optimised for PC web and Android.** One mega atlas (2048²) and one `SpriteBatch`
   mesh draw every sprite in a single draw call (`render/sprite-batch.ts`); CPU picking
   over projected quads; integer pixel scaling (`computeTargetSize` picks the frame so
   the CSS upscale is a whole number, e.g. 390×844 → 130×282 at ×3); no tap highlights;
   F toggles fullscreen on PC; debug shows draw calls and a "Fill roster" button.
2. **Optional items.** The Keeper stops at the shoreline (`shoreline()` in keeper.ts);
   an on-screen joystick (Settings, off by default); a quiet procedural music loop under
   the Sound setting.
3. **Pocket line** (`sim/species.ts`, family `pocket`): the baby lines Pichu, Cleffa,
   Igglybuff, Togepi, Tyrogue (branches by type), Smoochum, Elekid, Magby, Azurill,
   Wynaut with their evolutions, and the fossils Omanyte, Kabuto, Aerodactyl, Lileep,
   Anorith with theirs: 35 species.
4. **Digital line** (family `digi`): the 1997 Ver.1 pet, Botamon → Koromon → Agumon /
   Betamon → seven champions → MetalGreymon / Mamemon / Monzaemon: 14 species. Branches
   by type; poor care (negative lifetime happiness) gives the slug.
5. **Ten Keepers** (`sim/trainers.ts`): Fern, Marina, Sparks, Clover, Pixel (Sun) and
   Luna, Ember, Byte, Dusty, Nova (Moon). Each has a look (hat style + palette) and an
   egg table by family with a favourite type; new eggs follow the active Keeper. Dusty
   only hatches fossil lines. The Keepers menu (☀/☾ button) replaces the Sun/Moon toggle.

**How the extra lines map onto the life cycle.** An egg hatches as the line's hatchling.
A hatchling with a second baby form (Botamon → Koromon) grows into it after 10 minutes.
Evolution (child → adult) gives the grown form, the second evolution an hour later the
next one (Pikachu → Raichu, Agumon → Greymon), and champions take their final form three
hours into adult life (Greymon → MetalGreymon). Rebirth returns to the lineage's
hatchling. Chao-line rules (bands, types, parts, grades, Eternal) still apply to stats;
other families change species instead of form.

**Art.** `render/sprites/creature.ts` is a generic chibi drawer (body plans round,
biped, tall, shell, serpent, slug, stalk + parametric ears, tails, crests, wings, arms,
legs, eyes, markings); `species-art.ts` holds the 49 specs. They are approximations by
colour and silhouette, not traced sprites. Preview every species to a PNG with
`PREVIEW_SPECIES=path.png npx vitest run tests/tools`, or open `?sprites`.

**Names.** In-game species names are original (`SPECIES_LABELS` in strings.ts); the
inspiration is data in `species.ts`. Switching to the real names is a strings change.

**Risk noted to Maor.** Nintendo and Bandai are not Sega: public fan games using Pokémon
have been taken down before. The build is public on GitHub Pages at Maor's decision.

## M5 Races, personality, polish — BUILT (2026-10-12, tag `m5`)

**Done when:** every acceptance check in CLAUDE.md passes. The automated ones do (see
"Acceptance checks" below). The manual device pass is Maor's: iPhone Safari (browser and
home screen), Android Chrome, desktop Chrome/Safari/Firefox, 60 fps with 8 Nubbins,
blocked storage, no console errors. The build is deployed for that pass.

## M4 Expedition and shop — COMPLETE (2026-10-12, tag `m4`)

**Done when:** a run is fun on a phone and its rewards reach the Grove. Rewards verified
in the browser (results screen → Shells, Essences and Critters in the inventory) and in
`tests/sim/expedition.test.ts`; the run logic is deterministic, a tap jumps and a hold
jumps higher, obstacles cost Shells and never end the run. The "fun on a phone" half
still needs Maor's thumb on the deployed build (see Next steps). 109 tests, lint, build
pass.

## M3 Life cycle — COMPLETE (2026-10-12, tag `m3`)

**Done when:** egg → adult → rebirth → adult keeps everything correctly, and Eternal
follows the rules exactly. Verified by `tests/sim/lifecycle.test.ts` (a full life at
×1000: name, 10 % of points, grades, affection and rebirth count kept, heart greeting;
departure leaves a memorial; Eternal only with 2+ rebirths, Normal type and alignment

> 0.8 / < −0.8 / within 0.1 of 0, and never otherwise; Eternals never age; offline end
> of life waits with departures off, departs with it on, rebirths always happen) and in
> the browser (forced end of life → fading cocoon → flower; loved adult → golden cocoon →
> egg → hatch with a heart). 97 tests, lint, build pass.

Earlier the same day: M1 (tag `m1`) and M2 (tag `m2`), see the sections below.

**Live:** https://diablomaster8.github.io/TryThisGame/ (repo
https://github.com/diablomaster8/TryThisGame, Pages source: GitHub Actions).

## Art direction (Maor, 2026-10-12)

The Nubbins are Chao-faithful fan art (CLAUDE.md was updated). The full Chao catalogue
and where it lands:

| Forms                                                                | Count         | Milestone |
| -------------------------------------------------------------------- | ------------- | --------- |
| Eggs: normal + shop colour variants                                  | 1 + ~20       | M1 / M4   |
| Child: Neutral, Hero-leaning, Dark-leaning                           | 3             | M1 ✓      |
| Adult first evolution: Neutral/Hero/Dark × Normal/Swim/Fly/Run/Power | 15            | M2 ✓      |
| Adult second evolution: type-pair overlays                           | 60 (75 total) | M2 ✓      |
| Chaos Chao: Light, Dark, Neutral (the Eternals)                      | 3             | M3 ✓      |
| Character looks (fox, echidna, rose, dream)                          | 4 unlockables | M5 ✓      |
| Egg colours, shiny and two-tone colour variants                      | 5 colours × 3 | M5 ✓      |

The art is drawn in code from memory (`src/render/sprites/chao.ts`), never from copied
assets. Reference images dropped into the project would let the drawer be matched closer.
Check any sheet at `?sprites` (developer gallery).

## What works (M0 + M1)

- **Scaffold / pipeline / camera / controls** (M0): see git history. Camera now re-applies
  its pose every frame and follows the Keeper.
- **Sim core** (`src/sim/`, no DOM, no Three.js, ESLint-guarded):
  - `types.ts` plain-data world with the v2 future fields (`genes`, `skills`,
    `karateRecord`) empty by default.
  - `rng.ts` mulberry32, one serialisable state word, stored in the world.
  - `clock.ts` fixed 100 ms steps, time scale ×1–×1000, per-frame step cap with coarse
    overflow.
  - `world.ts` commands in, events out. Trees drop fruit, items fall, Keeper intents.
  - `needs.ts` hunger 20 min, energy 40 min, naps 3 min, happiness −100..100 with drift,
    affection 0..100; moods for the face and emote ball.
  - `stats.ts` grades E–S with multipliers, 99-level cap. `alignment.ts` ±0.01 nudges,
    bands at ±0.5, type-lean winner with the 15 % margin.
  - `lifecycle.ts` egg → child (60 min) → cocoon (30 s) → adult; evolution picks the form.
  - `behavior.ts` wander, find food, eat, nap, sit, greet, cry, swim, react, held,
    carried, thrown. Throws arc with gravity; landing hurts.
  - `keeper.ts` walk by tap target or input vector, intents (pet, pick up, feed, shake
    tree, collect) executed on arrival, carrying above the head.
  - `save.ts` v1 with an (empty) migration table, validation/defaulting, fingerprint.
  - `offline.ts` catch-up: fine steps under 3 min, 1-minute coarse steps beyond; modes
    indefinite/capped/off; Nubbins eat tree fruit while away; evolutions reported.
- **Sprites** (`src/render/sprites/`): index-buffer PixelCanvas, atlas builder,
  8-view angle table (5 drawn + 3 mirrored), Chao child with 8 clips + 3 stills in neutral
  / Sun / Moon palettes, adult recolours for all 15 first evolutions, 6 egg colours with
  wobble/crack frames, cocoon, Sun/Moon Keeper, fruit, flower, emote ball shapes.
  `SheetCache` keyed by style; `sheetFromImage` for hand-drawn sheets later.
- **Render**: Grove scene (grass, pond, hills, 2 trees, waterfall, bushes), SpriteView
  billboards with UV frames and ground shadows, WorldView with step interpolation.
- **Input**: tap ground to walk, tap Nubbin to select, tap fruit to collect, tap tree to
  shake, drag Nubbin to lift / throw, shake by reversals, WASD/arrows relative to the
  camera, space shakes a carried egg. Two-finger gestures still rotate/zoom.
- **UI**: top bar (logo, Shells, fruit, Settings), stats sheet (meters with icon+label,
  stats with grades, Pet / Pick up / Put down / Feed / Shake, rename), Settings (Aging
  while closed with validation, departures toggle disabled when mode is off, export /
  import / reset save), While you were away, debug panel (` or triple-tap logo), toasts,
  carry chip, catch-up overlay.
- **Game loop** (`src/game.ts`): autosave every 30 s and on hide/pagehide, catch-up on
  load and on tab show, storage failures only toast.
- **Growth (M2)**: `sim/critters.ts` with the 15 species (3 per type, each with its
  part slots), `giveCritter` / `giveEssence`, type lean; `lifecycle.ts` evolution with
  the permanent grade upgrade, Sun/Moon Grove unlocks and the second evolution an hour
  into adult life; `world.grove` + `setGrove`; swimming trains Swim lean slowly.
- **Sprites (M2)**: `layout.ts` (shared geometry + `ChaoShape`), `parts.ts` (parametric
  ears/tail/arms/back for every species at all five angles), type silhouettes (Swim
  head fins, Fly big wings, Run legs, Power wide body and hands), second-evolution
  lighter touches; sheet keys include type, second and parts.
- **UI (M2)**: Give section on the stats sheet (critters and essences from the
  inventory), Keeper switch (☀/☾) and Grove switcher in the top bar (shown once a Grove
  is unlocked), evolution celebration card, debug +critters / +essences.
- **Life cycle (M3)**: `lifecycle.ts` runs the end-of-life check at 5 h of adult life
  (`runEndOfLife`): rebirth cocoon → `rebirth()` (egg again, same name, 10 % points,
  grades + upgrades, affection, rebirths +1, heart greeting on hatch) or departure
  cocoon → `depart()` (removed, memorial flower at its spot). `eternalBandFor` applies
  the Eternal rules at evolution; Eternals skip aging. Offline: `awaitingKeeper` freezes
  the adult at the check when departures are off; live play re-runs the check on screen
  (a Nubbin loved in the meantime is reborn instead). `TYPE_LEAN.minToCount` (20) keeps
  incidental pond time from making Swim types.
- **Art/UI (M3)**: three cocoon looks (evolve / rebirth glow / depart fade), Chaos-form
  palettes with great wings for Eternal Sun / Moon / Neutral (+ a star emote), memorial
  flower sprites, toasts and away-screen lines for cocoons, rebirths, departures,
  Eternals and waiting Nubbins; the sheet shows ✦ Eternal and "Waiting for you".
- **Expedition (M4)**: `src/minigames/expedition/run.ts` is pure, seeded, fixed-step
  logic (scroll with a gentle speed ramp, variable-height jump, patterns of shells,
  obstacles with shell arcs, essences, critters in bubbles). `screen.ts` draws it on a
  low-res 2D canvas (height 270, width from the aspect, letterboxed) with parallax
  clouds, hills, a grassy ground row; the runner is the selected Nubbin's own side-view
  walk/flap frames. Tap or hold the canvas, or space/↑/W. Results screen → `addRewards`.
  The Grove keeps simulating underneath with rendering paused.
- **Shop (M4)**: `sim/shop.ts` (fruit, egg with a 15 % rare colour chance and the roster
  cap of 8, hat into the collection, ball toy with a cap of 3) and `ui/shop.ts`.
- **Toys (M4)**: `play` behavior: walk to the ball, bat it around, a little happiness.
- **Races (M5)**: `sim/race.ts` with 3 courses built from swim / fly / run / climb /
  stamina-stretch sections, each checking its stat; stamina drains into a 1.5 s rest;
  3 tiers with 4–8 seeded rivals whose levels scale with the tier; cheer boost (×1.45
  for 1.2 s, once per 3 s); prizes 20/10/5 Shells × tier and a hat on a win; winning a
  tier unlocks the next (`world.races`). `minigames/race/screen.ts` draws a side view
  with lanes stacked in depth on the same low-res canvas style, a big Cheer button
  (space on desktop), live placement and the player's stamina bar.
- **Personality (M5)**: `sim/personality.ts` decides Cheerful / Shy / Mischievous /
  Lazy at evolution from childhood pets, throws and feeds, and only shifts idle odds
  (greet, play, sit, swim).
- **Roster (M5)**: `ui/roster.ts` with portraits, rename, stats with grades, age,
  rebirths, alignment word + icon, personality, hat picker ("wearHat"), Go to.
- **Hats (M5)**: five styles drawn on the crown at all angles (straw, crown, beanie,
  flower, bucket); bought in the shop or won in races.
- **Sound (M5)**: `platform/audio.ts` synthesizes blips (no audio assets); muted until
  the first tap or click; a Sound toggle in Settings lives in the save.
- **PWA (M5)**: `public/manifest.webmanifest`, generated icons (`tests/tools/
make-icons.test.ts` with `MAKE_ICONS=1`), hand-rolled `public/sw.js` (stale-while-
  revalidate, offline shell), registered only on the built site.
- **Reduced motion**: instant camera snaps, no toast/celebration animation, no meter
  transition.
- **Tests**: 119 Vitest cases (+1 skipped icon writer).

## Acceptance checks (CLAUDE.md v1)

Automated, all green in `npm test`: grade multipliers; the 99 level cap; 10 % carried
over on rebirth; type-lean and alignment thresholds; a full life at ×1000; Eternal when
met and never otherwise; save export → import identical (round-trip fingerprint);
older saves migrate (the table is empty at v1, the loader defaults missing fields);
aging while closed in all three modes; the 7-day indefinite catch-up under 3 s; with
departures off no departure during catch-up and the check runs live.

Manual (Maor): iPhone Safari in the browser and installed to the home screen; Android
Chrome; desktop Chrome, Safari, Firefox; 60 fps with 8 Nubbins; blocked storage does
not crash (the storage wrapper swallows errors and toasts once); no console errors; no
names, art or audio from an existing franchise (the Nubbins are Chao-faithful fan art
by Maor's decision; names, music and sound are original).

- **Colour variants and looks (M5 polish)**: an egg's colour is the Nubbin's body colour
  for life (`variantColors`), kept through evolution with Sun/Moon adjustments; rare
  shop eggs can be two-tone (belly and tips from a second colour) or shiny (sparkles,
  white outline). Four character looks (fox, echidna, rose, dream) are palette + head
  accessory sets worn like hats and won at race tier 3. The roster shows all of it.
- **Preview tooling**: `PREVIEW_OUT=path.png npx vitest run tests/tools` renders a
  contact sheet of looks to a PNG (no browser needed); `tests/tools/png.ts` is the
  encoder shared with the icon writer.

## What's stubbed

- `vite-plugin-pwa` 2.0 supports Vite 8 but pulls in workbox; a 40-line service worker
  does the job for v1. Swap if precache manifests are wanted.
- An on-screen joystick (optional per CLAUDE.md) is not built; tap-to-move covers phones.
- The character looks use original names (fox, echidna, rose, dream) and silhouettes;
  closer likenesses are a palette tweak away in `CHARACTER_LOOKS` if wanted.

## Known bugs / open items

- The Keeper walks straight through the pond to reach a swimming Nubbin. Add a shoreline
  stop or let the Keeper wade visibly (M2 polish).
- The Claude desktop browser pane throttles `requestAnimationFrame` to 0–3 fps, so
  time-based checks there were driven by calling `grove.frame()` from the console. On a
  normal browser the loop runs at the display rate.
- Portrait phones get a 125 px-wide frame. Revisit once the Grove is busier.
- Non-integer CSS upscaling can give uneven pixel columns; the render-target fallback is
  still the documented option in `pipeline.ts`.

## Assumptions made (not stated in CLAUDE.md)

- Camera is orthographic; billboards tilt back by the pitch (see M0 notes).
- Dragging lifts the Nubbin under the pointer without the Keeper; the Keeper carries via
  the sheet's Pick up button. Both are "pick up"; the sheet route is the kid-friendly one.
- Feeding uses the fruit inventory (collected by tapping fruit on the ground). A hungry
  Nubbin also eats ground fruit on its own.
- Happiness drifts toward 0 by 0.5/min so moods fade. Starving costs 2/min.
- The adult form rule (band × winning type) already runs in M1 so catch-up can report
  evolutions; the grade upgrade and Grove unlocks join it in M2.
- `src/platform/storage.ts` is a small folder outside the CLAUDE.md tree for the
  localStorage wrapper; sim/ must not touch storage.
- TypeScript stays at 6.0.3 until typescript-eslint supports 6.1+.

## Toolchain notes (this machine, 2026-10-12)

- Git 2.55 at `C:\Program Files\Git\cmd`; Node 24.21.0 via fnm at
  `%APPDATA%\fnm\node-versions\v24.21.0\installation`. Both on the user PATH; the Claude
  shell needs `$env:Path` prefixed with them.
- GitHub pushes work non-interactively (Git Credential Manager has the token).
- `npm run dev` then `http://localhost:5173/` (game) or `/?sprites` (gallery). In dev the
  game is exposed as `window.grove` for console poking.

## Next steps

0. ~~Resolution decision~~ Done: 64 px / 540p (see the 2026-10-13 section). Remaining from
   that: a visual pass on any species whose fine-grid eyes read oddly.
1. **Device test pass (Maor):** open https://diablomaster8.github.io/TryThisGame/ on
   Android Chrome and desktop browsers (PC web and Android are the targets now). Check
   fps with 8 creatures (debug "Fill roster"), the Expedition's tap/hold feel, a race
   in portrait, the joystick if wanted, and that nothing logs to the console.
2. Likeness pass on the pocket and digital species if any read wrong on a phone: each is
   a few lines in `species-art.ts`; the species preview PNG makes it quick.
3. Tests: 155 Vitest cases.
