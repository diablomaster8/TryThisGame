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
going in pass by pass. Review B (`docs/review-independent-2026-10-18-b.md`): Bugs 1–17 and
18–38 fixed on 2026-10-18 (sections below). Maor, 2026-10-17: legal cleared, adviser sign-off given, the seven
fun-quest quotes approved as written, Pixel stays the default; 2026-10-18: ship the Arcade, the
Multiverse, Neopia and Q66–Q95. Waiting on Maor: the LB/LK decision (section "Pixel's Arcade
PA1–PA5" in `docs/progress-archive.md`); and whether Holy Grail's ten quotes are trimmed to
three or keep an exception. Decided 2026-10-18 (review B, item 16): original sung verses are
fine (only lyrics from existing songs are banned); Holy Grail's Q1–Q7 count as one storyline. Backlogs: `docs/creature-improvements.md`,
`docs/content-index.md`.

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

## Standing approval (Maor, 2026-10-12)

"When you finish, proceed straight through to the next development. I'm approving it. Keep
going until you hit the session limit." So after each milestone passes its done-when
checks, start the next one without waiting. Still plan each one briefly in the session
log before coding, still keep the per-milestone commits and checks.

