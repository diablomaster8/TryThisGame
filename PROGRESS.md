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
repetitive daily quests are out. Hollow art pass: built 2026-10-21 (below).

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

## Standing approval (Maor, 2026-10-12)

"When you finish, proceed straight through to the next development. I'm approving it. Keep
going until you hit the session limit." So after each milestone passes its done-when
checks, start the next one without waiting. Still plan each one briefly in the session
log before coding, still keep the per-milestone commits and checks.

