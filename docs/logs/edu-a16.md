# Learning Grove: Atlas A16 "The Fox and the Rose" (2026-10-17)

File: `src/content/edu-a16-reader.ts` (`EDU_A16_READER`, `EDU_A16_READER_VARIANTS`, `CHECKS`).
Reader band only, as the outline says (`docs/more-stories.md`, "Learning Grove version: yes, for the
older band only, ending at the well"). There is no sprout file. It is not registered yet: the
wiring task adds it to `edu.ts` and `a16` to `eduPacks` (reader only).

## Counts

| | reader |
| --- | --- |
| Scenes (74 quest scenes in A16-1 to A16-15, plus 10 variants) | 84 |
| Lessons | 96 |
| sel | 20 |
| science | 23 |
| literacy | 19 |
| maths | 17 |
| social-studies | 7 |
| health | 5 |
| art | 5 |
| Kinds (ask / notice / do) | 45 / 45 / 6 |
| Think questions (no `best`) | 15 |
| Glossary entries | 20 |

Every scene has at least one lesson; lesson ids are unique; the four `edu:` checks are listed in
`CHECKS`. No two lessons of the same domain follow each other, in play order across scenes and
quests (checked by script), and each quest has at least three domains, a `sel` lesson and a think
question. Every original choice id and `set` (`a16-strap`, `a16-globe`) is kept. Line caps hold
(all lines at most 160 characters and 30 words; narration and replies at most two sentences). The
file passes the brief's `tsc` and `eslint` commands and Prettier. Variants carry the same lesson
domains as the scene they replace (the two Sable-present `hour` and `well-done` scenes adapt only
their numbers).

## Standards used

1-ESS1-2, 1.MD.B.3, 1.OA.A.1, 2-ESS2-2, 2-LS4-1, 2-PS1-1, 3-5-ETS1-2, 3-LS1-1, 3-LS4-3, 3.MD.A.1,
3.OA.A.1, 3.OA.A.3, 4-ESS2-1, 4-LS1-1, 4-PS3-2, 4-PS3-4, 4.MD.A.1, 5-ESS1-2, K-LS1-1, K-PS3-1,
L.2.4, L.3.4, L.4.5, RL.1.4, RL.2.3, RL.3.3, RL.3.6, RL.4.2, D2.Civ.8.K-2, D2.Geo.2.K-2, and CASEL
(Relationship skills, Responsible decision-making, Self-awareness, Self-management, Social
awareness). Six lessons have no standard because none fits (five art notices and the asteroid
lesson, plus the "evidence" notice).

## What the outline asked for, and where

- Why a small planet has short days, and why the lamplighter never rests: A16-9 (a day is one spin;
  size doesn't decide it: Jupiter about 10 hours, Mercury about 59 Earth days), with the lamplighter
  sums (one dusk a minute, 30 in half an hour, 60 in an hour).
- Asteroids and their numbered names: A16-3 (small rocky worlds, most between Mars and Jupiter,
  numbered like 433 Eros), with a 41-steps-round sum (41 x 50 cm = 20 m 50 cm).
- Deserts and finding water: A16-1 (a desert gets under 25 cm of rain a year; the Sahara is the
  biggest hot desert; a water sum), A16-2 (cold desert nights), A16-11 (the Sahara is in Africa; dunes
  shift), A16-14 and A16-15 (the body needs water; the Pole Star for walking north; wool and warmth;
  a pulley; sharing 12 litres between 4).
- Desert foxes (fennecs): A16-13.
- French words: renard (A16-12 complete), étoile (A16-8 complete), puits (A16-15). The word *rose* is
  the same in French and English, so it has no lesson of its own.
- Feelings and thinking: honest but kind feedback (A16-2), sitting with someone who is sad (A16-4,
  A16-12), asking what someone wants (A16-5), safe versus well (A16-5, think), fair rules (A16-6,
  A16-9), honesty and kindness (A16-6, think), pride and praise (A16-7), being stuck in a habit and
  asking for help (A16-7), what owning means (A16-8, think), sharing a worry (A16-10), patience
  with shy animals (A16-13), who drinks first (A16-15, think).

## Care notes kept

- The drinker (A16-7) is "a sad man who can't stop doing something that makes him sadder". There
  are no bottles and no named substance; the lesson is about shame, feeling stuck and asking for
  help.
- The snake (A16-11) is only a riddling voice; nothing is said about biting or poison. The prince's
  fate is never touched: the file ends at "I'm going home to my rose", with one added reflective line
  ("Going home can mean a place, and it can mean someone you look after").
- The fox's secret (A16-13) is told in new words. None of the three lifted French lines or their
  English is used, and the only French in the file is three vocabulary words with their articles (un renard,
  une étoile and "les étoiles", un puits). No song or book text is quoted.
- The same-hour ritual runs on the page's own clock: the do-lesson is about reading the hour on a
  clock (one hour before four o'clock), never the real clock, never "come back tomorrow".
- Satirical grown-ups stay gentle; the drinker is played sad, not funny.

## Original scenes left out, and why

Only the outline's own cut: the version ends at the well.

- **A16-16 The Wall** (`a16-16-wall`, `a16-16-wall-done`, `a16-16-muzzle`, `a16-16-stars`,
  `a16-16-stars-done`, `a16-16-complete`) and its variants (`a16-16-lean-bonded`,
  `a16-16-muzzle-left`, `a16-16-stars-glass`). This is the farewell scene; the outline and the
  script notes say the Learning Grove version skips it.
- **A16-17 The Stars** (`a16-17-morning`, `a16-17-plane`, `a16-17-complete`) and its three
  last-page variants (`a16-17-complete-free-left`, `-glass-asked`, `-glass-left`). Same reason.
- **The three Grove scenes after the page**: `a16-grove-t20` and `a16-grove-luna` play after A16-17,
  so they fall outside the cut. `a16-grove-sparks` plays in the Grove when Sparks first sees the
  lamplighter's lamp at dusk; it is not a page scene, so it was left to the main game (Sparks's
  scene, with the lamp's light sensor, is already taught in `reader:a16-09-complete`).
- Consequence for the Learning Grove: the `a16-strap` flag (set in A16-2) pays off only in A16-16 and
  A16-17, so in the Learning Grove it has no visible payoff; `a16-globe` still pays off in
  A16-13 (the glass variant of `a16-13-secret-done`).

## For Maor

- The Learning Grove version stops at the well, so a child who plays it never reaches the muzzle
  payoff or the last page. If you would rather it ended on a gentle scene, `reader:a16-15-complete`
  already ends warmly; nothing needs to change.
- Two small notes: the "Sahara is the biggest hot desert" line is true (Antarctica is bigger overall,
  but it is cold); and "a day on Mercury is about 59 Earth days" refers to its spin, not to a
  sunrise-to-sunrise day.
- Every number is checkable: 16 L / 2 L a day = 8 days; 41 x 50 cm = 2,050 cm; 5:48 + 5 x 2 min =
  5:58; 300 s / 2 = 150; 7 x 5 + 3 = 38; 365 = 52 x 7 + 1; 53 + 53 = 106 min = 1 h 46 min;
  12 / 4 = 3 and 15 / 5 = 3 litres; 5,000 / 100 = 50 rows; 340 m/s means 2 seconds for a cliff
  340 m away.
