# The Learning Grove's language switch: educational style guide

The Learning Grove plays the same stories as the main game. When it is on, each scene is replaced
by its educational version for the child's band, matched by id (`sprout:c1-letter` replaces
`c1-letter`). The story, the characters and the choices stay the same; the language changes, and
learning is woven into what the characters are doing.

**The one rule: fun first.** A child should never feel they have stopped playing to do work. The
lesson is always something a character needs help with *right now, inside the story*: Sparks
needs the lanterns counted before dusk, Moss wonders aloud why the nights are getting longer,
Marina needs to know which way the tide is going. The child helps, the story moves on.

Read `types.ts` (EduBand, Lesson, EduScene, EduQuest, EduCampaign) and `STYLE.md` first. British
spelling throughout, as in the rest of the game. Temperatures in °C with °F in brackets.

## The two bands

| | `sprout` (ages 3–6) | `reader` (ages 7–10) |
| --- | --- | --- |
| Who reads | A grown-up reads it aloud; the child listens, points, answers | The child reads it alone |
| Line length | Most lines 4–10 words, never over 14 | Most lines under 20 words, never over 30 |
| Scene length | 4–10 lines | 6–16 lines |
| Lessons | Exactly 1 per scene (2 in a big scene) | 1–2 per scene |
| Words | Everyday words a 4-year-old knows; sound words (*plop*, *whoosh*) | Rich words, up to 2 new **vocabulary** words per scene, each in the glossary |
| Choices | Only kind, safe choices (see "Hard things") | All the main game's choices, including the hard ones |
| Tone | Warm, rhythmic, repetitive; refrains the child can join in on | The main game's voice, slightly simpler: funny, honest, thoughtful |

**Sprout craft (read-aloud):**

- Present tense. One idea per line. Repeat and refrain ("Lift and push! Lift and push!").
- Prompts for the grown-up go in brackets in a narrator line: `(Point to the red fruit.)`,
  `(Count them together on your fingers.)`, `(Wait for an answer.)`.
- Name feelings plainly ("Sable is scared. Her ears are flat.") and say what helps.
- Every scene can stand alone. A child may play ten minutes and stop.

**Reader craft:**

- Keep the main game's jokes and heart. Simplify syntax, not ideas.
- Vocabulary: mark a new word by using it in a line where the meaning is clear from context, and
  add a `GlossaryEntry` (child-friendly meaning, one sentence).
- **Think questions.** At least one per chapter or quest: a `kind: 'ask'` lesson with no `best`
  option, where every reply honours the child's reasoning ("That's a fair answer. Corvin would
  say…"). These are the thought-provoking moments: fairness, honesty, what makes something alive,
  whether safe is the same as well.

## Lessons (the beats)

- **ask:** a character asks the child. Two to four options. Mark the `best`. A wrong answer gets a
  kind, teaching reply that shows the right answer and why ("Let's count again: one, two, three,
  four. Four lanterns!"). Then the story continues the same way whichever option was picked.
- **notice:** a character shares something true and interesting, in their own voice, in 1–3
  lines. Use for facts that don't need a question.
- **do:** the child does something in the Grove (count fruit into a basket, tap the shapes, put
  the lanterns in order). Give a `check` string: `edu:<verb>:<object>[:<detail>]`, for example
  `edu:count:lanterns:4`, `edu:sort:fruit:colour`, `edu:tap:shape:triangle`,
  `edu:order:moon-phases`, `edu:clap:syllables:lantern`.
- Every lesson has `after` (the line index it plays after), a plain `skill`, a `domain`, a
  `parentNote` for the grown-up view, and a `standard` from the approved list when one fits.
- **Variety.** Across each quest or chapter, use at least three domains, and at least one `sel`
  lesson. Don't put two maths lessons in a row.
- **Diegetic.** The lesson must come out of the scene: the thing being counted is in the scene,
  the science explains what is happening in the story. No "quiz time".
- **Accuracy.** Teach only well-established facts you are sure of. If you are not sure, choose a
  different lesson. Keep numbers checkable (if Fern has 3 baskets of 4 plums, there are 12).
- **No fail state.** No timers, no lives, no penalties. A wrong answer is a chance to be shown.

## What to teach, by band

**Sprout (3–6):** counting to 5, 10, then 20; more and fewer; adding 1 or 2; shapes and colours;
big and small, long and short; positions (on, under, beside, behind); patterns (red, blue, red…);
first sounds and rhymes; clapping syllables; letters, especially the first letters of characters'
names; animal sounds, homes and babies; weather and seasons; day and night; what plants and
animals need; naming feelings; taking turns, sharing, saying sorry, asking for help, waiting;
listening; simple sequencing (first, next, last).

**Reader (7–10):** addition and subtraction to 100, times tables, simple division and fractions,
telling time and time intervals, measurement and units, reading bar charts and tally charts,
patterns and rules, perimeter and area, money-style sums with Shells, symmetry; reading for
character, motive and theme; similes and metaphors; vocabulary; why winter nights are long (the
Earth's tilt), freezing and melting, the water cycle, springs and geothermal warmth, tides and the
Moon, moon phases, fossils and rock layers, life cycles, pollination and seeds, habitats and food
chains, fungi and plant disease, bees and colonies, owls and nocturnal animals, sound and
vibration, light and shadows, simple circuits, forces and motion; maps and compass directions,
oral history and how stories carry the past, fairness and rules, scarcity and choices;
empathy, managing big feelings, honesty, consent and fairness to animals, grief.

## Hard things (grief, illness, fear, wrongdoing)

The Grove is honest about loss, and so is the Learning Grove, the way good children's books are.

- **Death and fading.** Use clear words. "Fade" is the Grove's word; say what it means: "Fossil
  faded. That means she died. Her body stopped working, and it won't start again." Never say
  death is "sleeping" or "going away" (young children can take that literally and fear sleep or
  goodbyes). Then the comfort: the flower, the remembering, the people who stay.
- **Hazel's illness.** "Gran Hazel is very poorly. The doctors can't make her better." Never name
  an illness. She is still funny, still Gran.
- **Feelings are allowed.** Sad, cross, scared, worried and lonely are all fine to feel. Show what
  helps: a hug, a sit-down, a friend, telling someone, waiting together.
- **Corvin.** In sprout he is "a lonely, grumpy man who did a wrong thing a long time ago" and
  can say sorry. In reader he is himself, and the child is invited to think about why he did it.
- **Fear.** The cold, the Hollow and the Long Night are mysterious and a little spooky in sprout,
  never frightening. No peril beyond a bump or a fright. Reader can be tense, like a good
  adventure book.
- **Sprout choices.** Sprout never offers a choice that leads to a cruel or bleak outcome. Leave
  out the chapter 2 "sell" choice (`defaultChoice: 'refuse'`), the chapter 3 "grab" choice
  (`'slow'`), "drive him off" in Wisp (`'spared'`), and "keep the stone" at the Wellspring
  (`defaultChoice` the unmake id). Reader keeps them all, framed so the child can see the cost.
- **Endings.** Sprout versions of every ending are gentle and hopeful. Reader versions keep the
  ending's meaning and add one reflective line.

## Fun quests (Python, Bean, Avatar)

The edu versions keep the comedy: the silliness is the hook. The original quotes never appear in
any educational version (the Learning Grove rule); write original lines. Lessons come out of the
joke: the Spanish Inquisition counting its "chief weapons" is a counting lesson; the Ministry of
Silly Walks is balance, forces and measuring strides; Mr. Bean's turkey is shapes, sizes and
"will it fit?"; the cabbage cart is building a stable base; Uncle Tenzo's tea is timing and
measuring.

## Approved standards (use only these codes; leave `standard` out when none fits)

**Head Start ELOF (ages 3–5, sprout):** `ELOF: Approaches to Learning`, `ELOF: Social and
Emotional Development`, `ELOF: Language and Communication`, `ELOF: Literacy`, `ELOF:
Mathematics Development`, `ELOF: Scientific Reasoning`, `ELOF: Perceptual, Motor, and Physical
Development`.

**CASEL (both bands):** `CASEL: Self-awareness`, `CASEL: Self-management`, `CASEL: Social
awareness`, `CASEL: Relationship skills`, `CASEL: Responsible decision-making`.

**Common Core Maths:**

| Code | Skill |
| --- | --- |
| K.CC.A.1 | Count to 100 by ones and tens |
| K.CC.B.4 | Connect counting to how many |
| K.CC.B.5 | Count to answer "how many?" (up to 20) |
| K.CC.C.6 | Greater than, less than, equal (groups) |
| K.OA.A.1 | Add and take away with objects |
| K.OA.A.2 | Add and subtract word problems within 10 |
| K.MD.A.2 | Compare two objects (taller, heavier, more) |
| K.MD.B.3 | Sort into groups and count each |
| K.G.A.1 | Shapes and positions (above, below, beside, behind) |
| K.G.A.2 | Name shapes whatever their size or turn |
| 1.OA.A.1 | Add and subtract word problems within 20 |
| 1.MD.B.3 | Time in hours and half hours |
| 1.G.A.3 | Halves and quarters of circles and rectangles |
| 2.OA.A.1 | Add and subtract word problems within 100 |
| 2.OA.C.3 | Odd and even |
| 2.MD.A.1 | Measure length with tools |
| 2.MD.C.7 | Time to the nearest five minutes |
| 2.MD.D.10 | Picture graphs and bar graphs |
| 3.OA.A.1 | Multiplication as equal groups |
| 3.OA.A.3 | Multiply and divide within 100, word problems |
| 3.OA.D.8 | Two-step word problems |
| 4.NBT.B.4 | Add and subtract multi-digit whole numbers (and count on to find a gap) |
| 3.NF.A.1 | Unit fractions (1/2, 1/3, 1/4…) |
| 3.NF.A.3 | Equivalent fractions (6/12 is the same as 1/2) |
| 3.MD.A.1 | Time to the minute; time intervals |
| 3.MD.B.3 | Scaled picture and bar graphs |
| 3.MD.C.7 | Area of rectangles by multiplying |
| 3.MD.D.8 | Perimeter |
| 4.OA.C.5 | Number and shape patterns that follow a rule |
| 4.MD.A.1 | Sizes of units (km, m, cm; kg, g; hr, min, sec) |
| 4.MD.A.2 | Word problems with distance, time, volume, mass |
| 4.G.A.3 | Lines of symmetry |

**Common Core English:**

| Code | Skill |
| --- | --- |
| RF.K.2 | Rhymes, syllables, first sounds |
| RL.K.3 | Characters, setting, events |
| RL.1.4 | Words that show feelings or senses |
| RL.2.3 | How characters respond to events |
| RL.2.4 | Rhythm, rhyme and repeated lines |
| RL.3.3 | Character traits, motives, feelings |
| RL.3.6 | Your point of view vs a character's |
| RL.4.2 | Theme |
| RL.4.3 | Describing a character or setting in depth |
| L.2.4 | Meaning of unknown words |
| L.3.4 | Unknown and multiple-meaning words |
| L.4.5 | Similes and metaphors |
| SL.K.1 | Taking part in conversations |

**NGSS science:**

| Code | Skill |
| --- | --- |
| K-PS3-1 | Sunlight warms the ground |
| K-LS1-1 | What plants and animals need to live |
| K-ESS2-1 | Weather patterns over time |
| K-ESS2-2 | Plants and animals change their surroundings |
| K-ESS3-1 | Animals live where their needs are met |
| K-ESS3-3 | Looking after land, water and living things |
| 1-PS4-1 | Vibrations make sound |
| 1-PS4-2 | We see things when there is light |
| 1-LS1-2 | Parents help their young survive |
| 1-LS3-1 | Young are like, but not the same as, their parents |
| 1-ESS1-1 | Patterns of the Sun, Moon and stars |
| 1-ESS1-2 | Daylight changes through the year |
| 2-PS1-1 | Sorting materials by their properties |
| 2-PS1-4 | Some heating and cooling changes reverse, some don't |
| 2-LS2-1 | Plants need water and light |
| 2-LS2-2 | Animals spread seeds and pollinate |
| 2-LS4-1 | Different habitats, different life |
| 2-ESS1-1 | Earth changes fast or slow |
| 2-ESS2-2 | Maps of land and water |
| 2-ESS2-3 | Water as solid and liquid |
| 3-PS2-1 | Balanced and unbalanced forces |
| 3-LS1-1 | Life cycles |
| 3-LS2-1 | Animals in groups help each other survive |
| 3-LS3-1 | Inherited traits and variation |
| 3-LS4-1 | Fossils tell us about the past |
| 3-LS4-3 | Some living things survive better in a habitat |
| 3-LS4-4 | Solutions when an environment changes |
| 3-ESS2-1 | Weather data by season |
| 4-PS3-2 | Energy moves by sound, light, heat, electricity |
| 4-PS3-4 | Devices that change energy from one form to another |
| 4-LS1-1 | Body parts that help animals survive |
| 4-LS1-2 | Animals' senses |
| 4-ESS1-1 | Rock layers and fossils show change |
| 4-ESS2-1 | Weathering and erosion |
| 4-ESS2-2 | Reading maps of Earth's features |
| 5-ESS1-2 | Patterns of shadows, day and night, seasonal stars |
| K-2-ETS1-1 | Define a problem to solve |
| 3-5-ETS1-2 | Compare solutions to a problem |

**C3 social studies:** `D2.His.2.K-2` (life in the past and today), `D2.Geo.2.K-2` (maps and
places), `D2.Civ.8.K-2` (fairness, rules, respect), `D2.Eco.1.K-2` (scarcity means choosing).
Reader bands use the grades 3–5 codes: `D2.His.2.3-5` (how life changed over time), `D2.Geo.2.3-5`
(maps of places and regions), `D2.Civ.8.3-5` (democratic principles in everyday life),
`D2.Eco.1.3-5` (choices have costs and benefits).

## Output

Write exactly the export names you are given, typed with the types above. Every `EduScene.of`
must name a real scene id in the main content; `id` is `<band>:<of>`. Every original scene in
your scope gets a version. Keep choice ids identical to the original's; give `defaultChoice` when
a band leaves a choice out. Export `CHECKS` listing every `edu:` check string you use.

Validate with the single-file tsc command in `STYLE.md` until it prints nothing.

## Joke density and sound words (R0309, R0310)

- **Sprout:** at least one silly beat (`gag: true`) and one sound word per scene, ideally on
  an action the child sees (`plop`, `splash`, `creak`, `achoo`, `munch`, `slurp`, `whoosh`;
  the full list is `src/config/edu-sounds.ts`, and read-aloud plays each one's sound). A
  join-in refrain every two scenes; mark it `refrain: '<id>'` (R0323, ids in
  `src/config/edu-refrains.ts`).
- **Reader:** one gag per five lines; keep the main game's jokes.
- `npx tsx tests/tools/content-check.ts --comedy` reports both.

## Wrong answers in the sprout band (R0320)

A wrong-answer reply opens with a playful picture built from the child's own answer, then
gives the fact: "A puppy in an egg? Crack… woof! That would be silly! Puppies grow inside
their mum." Never open with "No", "Wrong", "That's not" or "Try again": the reply honours the
answer. The checker warns (`sprout-wrong-opener`) on any that do.

## No sarcasm at the child (R0347)

Characters may tease each other (Marina and Sparks), never the child, and the narrator never
mocks the player. `content-check --warnings` flags "nice try", "seriously?", "silly you",
"silly billy" and "wrong again" in Learning Grove text as `sarcasm?`; a wrong-answer reply
that opens with "No" is `sprout-wrong-opener` (R0320). `--plant-sarcasm` proves the rule fires.
