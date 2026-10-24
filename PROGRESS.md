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

## Standing approval (Maor, 2026-10-12)

"When you finish, proceed straight through to the next development. I'm approving it. Keep
going until you hit the session limit." So after each milestone passes its done-when
checks, start the next one without waiting. Still plan each one briefly in the session
log before coding, still keep the per-milestone commits and checks.

