# Script log: LB1–LB12 Play (inspired by *Bluey*)

File: `src/content/lines-lb.ts`. Exports: `LINE_LB`, `LINE_LB_VARIANTS`, `LINE_LB_CHECKS`,
`LINE_LB_FLAGS`, and the built-in Learning Grove versions `LINE_LB_EDU`
(`Record<EduBand, EduQuest[]>`), `LINE_LB_EDU_VARIANTS` (`Record<EduBand, EduScene[]>`) and
`LINE_LB_EDU_CHECKS`. Audience `all`. Not yet wired (task W).

Validation: single-file `tsc`, `eslint` and Prettier are clean. A scratch self-check (not committed) mirrored
content-check's edu rules on this file: 0 problems, 0 warnings (coverage in both bands, choice ids
and `set`s, `defaultChoice`, lesson `after` ranges, approved standards, unique ids, sprout ≤ 14 and
reader ≤ 30 words, main lines ≤ 160 characters, narrator lines ≤ 2 sentences, declared speakers,
`requires`, and the check and flag lists).

## Counts

- **Main script:** 12 quests and 24 steps (2 per quest). There are 58 scenes: 49 quest scenes and
  9 variants. The quest scenes contain 365 lines and 39 choices. Every quest has at least one
  choice.
- **Sprout:** 58 scenes, 58 lessons. By domain: sel 18, literacy 16, maths 12, science 8, health 2,
  social studies 1, art 1.
- **Reader:** 58 scenes, 60 lessons. By domain: literacy 18, science 17, maths 12, sel 10, social
  studies 2, health 1. There are 24 glossary words, two per quest.
- **Edu checks:** 28 distinct `edu:` check strings.
- **Standards used (all on the approved list):**
  - Sprout: 24 codes, including K.MD.A.2, K.CC.B.4/B.5, K.G.A.1/A.2, K.MD.B.3, RF.K.2, RL.K.3,
    SL.K.1, K-LS1-1, K-ESS2-1, 1-PS4-2, 1-ESS1-1, D2.Geo.2.K-2, and the ELOF and CASEL areas.
  - Reader: 37 codes, including 3.OA.A.1, 2.OA.A.1, 2.MD.A.1, 3.NF.A.1, 3.MD.D.8, 3.OA.A.3,
    2.MD.D.10, 3.MD.A.1, 4.MD.A.1, 2-PS1-1, 3-PS2-1, 1-PS4-2, 4-PS3-4, 3-ESS2-1, 2-ESS2-2,
    1-ESS1-1/2, L.2.4, L.3.4, L.4.5, RL.2.3, RL.3.3, RL.3.6, RL.4.2 and the CASEL areas.
  - Every lesson angle in the outline is used, with the code the outline gives.

## Lifted text

None. *Bluey* is copyrighted, and nothing is taken from it: no lines, characters, names, plots,
designs, places or music. There are no `childLines` because nothing needs replacing. The one
borrowed chant is the folk giant's "fee, fi, fo", from the public-domain *Jack and the Beanstalk*,
and Sam only half-says it.

## Flags

- **Read:** no Grove flags.
- **Written** (the line's own flags, all prefixed `lb-`; none is a Grove flag):
  - `lb-moved-in`: set by LB1.
  - `lb-box` (big | long | tall): LB1's signature choice.
  - `lb-race` (proper | let-win | hand): set by LB11.
  - `lb-done`: set by LB12, for the Tier 2 ambient.
  - Harmless journal flags: `lb-ned-shop`, `lb-den-story`, `lb-shadow`, `lb-map-fair`,
    `lb-cafe-reply`, `lb-boat`, `lb-star-wish`.

## Variants

- **LB6 den door,** chosen by `lb-box`: `lb06-door-big`, `-long` and `-tall`. These play straight
  after `lb06-built`. They pay off LB1, 5 quests later.
- **LB12 arrival,** chosen by `lb-race`: `lb12-ned-proper`, `-let-win` and `-hand`. Then, by
  `lb-box`, `lb12-box-big` (the house), `-long` (the boat) and `-tall` (the rocket). Both play
  after `lb12-arrive`, in that order. The box payoff comes 11 quests after LB1.
- **Defaults if a flag is unset:** `-big` and `-hand`.

## SIM needs

- **Shop and café:** no real Shells are spent. `give:shells:lb-ned` takes the Shells and refunds
  them as change. The check has no amount, because sprout pays 5 and reader pays 20 for a
  13-Shell leaf.
- **New minigames:**
  - `minigame:lb-cushion-crossing`: forgiving hops; touching the grass restarts the crossing,
    with no fail state.
  - `minigame:lb-sleeping-giant`: a slow, clear "newspaper twitch" tell; being seen sends you
    back to the gate, with no penalty.
- **Shadow show:** in LB7, the shadow on the sheet scales with the distance from the torch.
- **Variant playback order:** as listed above.
- **LB10:** the family visits the Grove pond, and the Nubbin uses its swim animation.
- **Decor rewards:**
  - the blanket den (Nubbins nap in it when it rains);
  - the shadow screen (its torch lights at dusk);
  - the framed lane map;
  - the Café Larkin sign;
  - Ned's box, whose form follows `lb-box`.
- **LB5:** optional toilet-paper "boots" on the Nubbin as a short idle. Needs are untouched.
- **Tier 2 ambient after `lb-done`** (Learning Grove only, art only): washing on the Larkins'
  line, Ned waving from their gate, and the big box in their garden.
- **Pause:** the line pauses for chapters 9–11.

## Changes from the outline

- **One file.** The Learning Grove versions are built into `lines-lb.ts`, not separate
  `edu-lb-*.ts` files, as the task said.
- **LB2 reader:** the leaf costs 13 so the reader can work out the change from 20. The main
  script and sprout use 5.
- **LB11:** sprout drops the race choice and sets `defaultChoice: 'hand'`, as the outline says
  ("reader only"). Sprout therefore plays the hand-holding race and `lb12-ned-hand`.
- **LB12:** the box payoff plays on arrival, before the waiting, so the box can be the boat,
  rocket or house they lie beside.
- **Extra lessons:** I added lessons for scenes the outline doesn't list, so every edu scene has
  one, and each quest has at least three domains and an sel lesson.
- **LB4 reader:** the quarters lesson uses Ned's uneven biscuit to teach that fractions need
  equal parts.
- **LB7 reader:** one notice says shadow theatre is an old art in Indonesia (wayang kulit),
  China and Turkey. This is a light link to LK.
- **Choices:** every quest has a small harmless choice, as STYLE.md requires. The two signature
  choices are LB1's box and LB11's race.

## For Maor

- **Name clash:** S31 already has a valley boy called Ned (nine), and LB's Ned Larkin is four.
  The ids differ (`s31-ned`, `lb-ned`), but players will see two Neds. Keep both, or rename one
  (Ned Larkin could become "Teddy")?
- **Sam's Australian voice:** Sam says "mate" to Ned now and then. That's the only Australian
  marker, besides Brisbane.
- **Rights:** Bluey's rights sit with Ludo Studio, ABC and BBC Studios. Only the spirit is
  borrowed. Please confirm "inspired by Bluey" in the notes is the credit you want.
- **Venus:** the first "star" is hedged ("might be a planet"), because Venus isn't always an
  evening star.
