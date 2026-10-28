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

## Standing approval (Maor, 2026-10-12)

"When you finish, proceed straight through to the next development. I'm approving it. Keep
going until you hit the session limit." So after each milestone passes its done-when
checks, start the next one without waiting. Still plan each one briefly in the session
log before coding, still keep the per-milestone commits and checks.

