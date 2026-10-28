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

## Standing approval (Maor, 2026-10-12)

"When you finish, proceed straight through to the next development. I'm approving it. Keep
going until you hit the session limit." So after each milestone passes its done-when
checks, start the next one without waiting. Still plan each one briefly in the session
log before coding, still keep the per-milestone commits and checks.

