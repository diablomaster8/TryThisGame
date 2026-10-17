# Learning Grove: A19 "The Dragon Who Fell" (2026-10-17)

Files: `src/content/edu-a19-sprout.ts` (`EDU_A19_SPROUT`, `EDU_A19_SPROUT_VARIANTS`, `CHECKS`) and
`src/content/edu-a19-reader.ts` (`EDU_A19_READER`, `EDU_A19_READER_VARIANTS`, `CHECKS`). Not
registered yet: the wiring task adds them to `edu.ts` and `a19` to `eduPacks`. Eighteen quests
(`a19-01` to `a19-18`) per band, `of` = the quest id. Source: `atlas-a19.ts`; the outline is in
`docs/more-stories.md` (A19).

## Counts

| | sprout | reader |
| --- | --- | --- |
| Scenes (91 quest + 8 variants) | 99 | 99 |
| Lessons | 99 | 124 |
| ask / notice / do | 59 / 9 / 31 | 84 / 39 / 1 |
| maths | 16 | 13 |
| literacy | 11 | 22 |
| science | 18 | 32 |
| sel | 25 | 36 |
| social-studies | 9 | 11 |
| health | 10 | 6 |
| art | 6 | 3 |
| music | 4 | 1 |
| Think questions (ask, no `best`) | – | 23 |
| Glossary entries | – | 31 |

No two lessons of the same domain are ever consecutive, across scenes and quests, in play order.
Each variant opens and closes on a domain that differs from the base scene's neighbours. Every
quest has at least three domains and a `sel` lesson; every reader quest has a think question. Every
scene, done scene, complete scene and variant has at least one lesson; sprout has exactly one.
A script (`chk.mts`, scratch only) checked coverage against `ATLAS_A19` and `A19_VARIANTS`, choice
ids and `set` flags, line caps (sprout 14 words, reader 30, 160 characters), narration at two
sentences, unique lesson ids and the `CHECKS` lists. It reports no problems.

## Standards used

- **Sprout:** K.CC.B.5, K.G.A.1, K.G.A.2, K.MD.A.2, K.OA.A.1, K.OA.A.2, RF.K.2, RL.1.4, RL.2.3,
  RL.K.3, SL.K.1, 1-ESS1-1, 1-LS1-2, 1-PS4-1, 1-PS4-2, 2-ESS1-1, 2-LS2-1, 2-PS1-1, K-2-ETS1-1,
  K-ESS2-2, K-ESS3-1, K-ESS3-3, K-LS1-1, D2.Civ.8.K-2, D2.Geo.2.K-2, D2.His.2.K-2, ELOF (Perceptual,
  Motor, and Physical Development; Scientific Reasoning), CASEL (Relationship skills, Responsible
  decision-making, Self-awareness, Self-management, Social awareness). A few lessons (art, the
  colour pattern) have none.
- **Reader:** 2.OA.A.1, 3.OA.A.1, 3.OA.A.3, 3.OA.D.8, 3.MD.A.1, 4.MD.A.2, L.2.4, L.3.4, L.4.5,
  RL.2.4, RL.3.3, RL.4.2, RL.4.3, 2-ESS2-2, 3-5-ETS1-2, 3-LS2-1, 3-PS2-1, 4-ESS2-1, 4-LS1-2,
  4-PS3-2, 4-PS3-4, 5-ESS1-2, D2.Civ.8.K-2, D2.Eco.1.K-2, D2.His.2.K-2, CASEL (Relationship
  skills, Responsible decision-making, Self-awareness, Self-management, Social awareness). Several
  science notices, the art notices and a few literacy asks have none.

## What the outline's angles became

- **Viking-age life on cold islands:** Berk is invented, the Vikings were real, and Norse families
  settled Shetland, the Faroes and Iceland (A19-1); the long hall with a central fire (sprout A19-3);
  longships and why a hollow ship floats, the steering oar and the word starboard (A19-3, A19-6);
  fish dried, salted and smoked, with stockfish (A19-7); round wooden shields with an iron boss
  (A19-5); turf roofs (A19-10); livestock, barns and the Icelandic horse (A19-18); Norse animal
  and knotwork decoration (A19-18).
- **How real animals learn to trust:** slow, low movement, a stare as a challenge and looking away,
  smell, favourite scratching spots, reward-based training, flight distance and giving space, choice
  and consent (A19-7 to A19-15 and the variants). Always paired with "ask a grown-up before
  touching an animal".
- **How a tail or rudder steers:** fins, tails and rudders (A19-6), a pedal as a lever (A19-9),
  a spring (A19-18).
- **Prostheses:** A19-18 (`a19-18-wake`), plainly, with Paralympic running blades and "nothing to
  hide". Hiccup's lost foot is said plainly in both bands, with no wound shown.
- Maths, science, language and feelings are woven into the story: bellows and air, the Pole Star,
  echoes, sound and pitch, the Doppler effect, fog, dizziness, shadows, heat flow, time sums,
  distance and speed, and fair sharing.

## Care

- Stoick's hurtful words in A19-13 are never given in either band. The reader asks why the writer
  leaves them out; the sprout says he is upset and says something unkind. The apology in A19-16 is
  kept in full in both.
- The dragon in the pit is left out of sprout (only a big, scary rumble; the dragons are afraid of
  it). In reader the Gronckle is lost in the mist offscreen, as in the original, with no extra detail.
- The film's oath ("Thor's teeth") is dropped. No religious practice, no film quotes (neither
  lifted line is used), and no `childLines` text is reused.
- A "worrying secrets" line sits in A19-4 (both bands) and a "say you cannot tell, not a fib" lesson
  in A19-10.

## Original scenes not mapped

None. Every scene id in `ATLAS_A19` and `A19_VARIANTS` has a version in each band.

## For Maor

- **Dragon count in A19-15.** The original script says "Five dragons go up" and puts Hiccup behind
  Astrid on the Nadder, but there are only four training dragons (Toothless is chained on the ship).
  Both bands say four. The original line should probably say four as well.
- **Invented numbers** (all in the reader band, for the sums): four ships of twelve barrels (A19-3),
  a forty-minute walk (A19-3), 60 km a day (A19-10), a twelve-metre pine (A19-11), a 300 m a minute
  climb to a cloud at 1,800 m (A19-17), a forty-metre square (A19-18). None is in the original.
- **Reader has one `do` lesson** (the humming check in A19-15); the rest are asks and notices, so
  the Grove side has little to act out. Sprout has 31.
- **Adviser sign-off still needed** (original care notes): the waking scene, `a19-18-wake`, with an
  adviser who has a limb difference; the Norse facts with a historian if wanted.
- The reader notice in A19-1 assumes "Viking Age" means roughly the
  years 800 to 1050; the usual dates are 793 to 1066.
