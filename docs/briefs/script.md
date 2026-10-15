# Brief: fully script one storyline (Hazel's Grove, Part L and Part M)

Maor approved full scripts for all 50 new storylines: the Atlas A1–A31, Pixel's Arcade PA1–PA5,
Grove side stories S23–S31, fun packs Q66–Q95, and the Learning Grove lines LB and LK. You
script **one** line, in the same TypeScript content format as the existing game, at the same
quality as the campaign.

All paths are relative to the repo root. Content lives in `src/content/`.

## Read first

1. **Your outline.** Atlas A1–A10 are in `docs/atlas.md`. Everything else is in
   `docs/more-stories.md`; find your section by its id. The outline is the plan: follow its
   quests, choices, consequences, flag reads, rewards and care notes. You may merge or split a
   quest where the scene demands it; say so in your log.
2. **Canon:** `docs/canon.md` (it wins over everything), and
   `src/content/STORY-BIBLE.md`.
3. **Style:** `src/content/STYLE.md`.
4. **Format and voice models.** Read the header and the first two quests of each file your line
   type points to:
   - **Atlas and Arcade:** `mv-ironman.ts` and `mv-cap.ts`, for the per-storyline Quest
     format.
   - **Grove side stories:** `side-stories-new-3.ts` and `side-stories-new-4.ts`, for one Quest
     per story plus `_VARIANTS` and `_FLAGS`.
   - **Fun packs:** `quests-python.ts` and `quests-bean.ts`, for the one-quest-per-Q format and
     `childLines`.
   - **Learning Grove lines:** a fun-quest file, plus `edu-fun-python-bean-sprout.ts`,
     `edu-fun-python-1-reader.ts`, `edu.ts` and `EDU-STYLE.md`.
   - The types are in `types.ts`; `Line`, `Choice` and `Scene` are in `src/config/story.ts`.

## File and shape

- **One new file** in `src/content/`, named in your task. Don't edit any other file;
  the wiring task (plan.md, task W) registers it in `index.ts` and the checker afterwards.
- **Exports:**
  - `<NAME>: Quest[]`;
  - `<NAME>_CHECKS: string[]`, every distinct `check` string;
  - `<NAME>_FLAGS: string[]`, every flag you set;
  - where needed, `<NAME>_VARIANTS: Scene[]`, for variant scenes chosen by flags.
- **Header comment:**
  - the source and its rights holder;
  - the audience;
  - the frame;
  - the Grove flags read, and what changes;
  - the flags written;
  - the lifted text used, with its edition;
  - care notes.
- **Atlas pages and Arcade cartridges:**
  - **Quests:** one `Quest` per outline quest. Id `a11-01`…, code `A11-1`…; for the Arcade,
    `pa1-01` and `PA1-1`.
  - **Steps:** 2–4 per quest. Each has a `scene` (6–16 lines) and usually a short `done`
    scene, plus a `complete` scene.
  - **Order:** chain the quests with `requires: ['A11-1']` and so on.
  - **Trigger `where`:**
    - Atlas: "Nova's atlas: the <title> page (Atlas campaign)".
    - Arcade: "Pixel's arcade cabinet, the lantern shed: <title> (Pixel's Arcade)".
- **Grove side stories (S23–S31):**
  - **Shape:** one `Quest` (id `s23`…, code `S23`) whose steps follow the outline's quests.
    Merge small ones; aim for 10–16 steps. Its trigger gives the chapter window. It sets
    `s23Done` and so on.
  - **Campaign hook scenes:** if the outline asks for them (S23, S26 and S27 only), put them in
    `_VARIANTS` with exact ids, and say in the notes exactly where each plays. Examples: S23's
    vigil line, its dawn lane and its `end-epi-visitors…` epilogues; S26's `hushGarden` scenes;
    S27's buy-back.
  - **Engine needs:** any change to the sim goes in the notes, under "SIM:".
- **Fun packs (Q66–Q95):** one `Quest` per Q, ids `q66`…, in the fun-quest format. Each quest
  has 1–3 steps, a `complete` scene, rewards, `childLines` for every quoted line, and a trigger
  "never during Chapters 9–11".
- **Learning Grove lines (LB, LK):**
  - **Main quests:** one `Quest` per LB or LK quest, audience `all`, in simple warm language.
  - **Edu versions:** both bands, in a second exported block. Name it
    `<NAME>_EDU: Record<EduBand, EduQuest[]>` if the types allow it; otherwise follow how the
    edu fun files are built, with scenes, lessons and approved standards.
  - **Rules:** every edu scene needs at least one lesson, and the line caps apply.

## Writing rules

- **Quality bar:** the campaign. Concrete images, dry warmth, real choices, quiet grave turns.
  Comedy where the source is comic. Each line keeps its outline's signature choice and pays it
  off three or more quests later.
- **The Keeper is a guest, not the hero.** The source's heroes keep their story. Your Nubbin
  does things, but Nubbins don't speak. Neither do animals in the Grove (the exceptions are on
  the canon sheet). In an Atlas or Arcade world, the source's own talking animals may talk
  (Pooh, the Fox, Anansi).
- **Speakers:** campaign speaker ids where the Keepers appear (`you`, `narrator`, `nova`,
  `pixel`, `fern`…). Source characters are declared with `kind: 'other'` and a `basedOn`.
  Unique, clear ids, prefixed if generic.
- **Flags:**
  - **Prefix every flag** with the line id (`a11-…`, `pa2-…`, `s23-…`). The only exceptions
    are the approved Grove flags: `s23Done`…`s31Done`, `visitors`, `hushGarden`, and
    `boughtBack` (S27).
  - **Reading Grove flags:** do it through variants plus notes, exactly as the outline says.
  - **Writing Grove flags:** Atlas, Arcade, fun packs and LB/LK never write one.
- **Checks:** reuse the existing verbs:
  - talk, give, find, visit, escort, photo, place, craft, build, watch, walk, wait, explore,
    deliver, climb, swim, sit, inspect, collect, carry, puzzle, feed, choose, minigame, race,
    karate, expedition:clear.
  - The form is `verb:object[:detail]`, with ids prefixed by the line.
- **Lifted text:**
  - **Public domain:** quote verbatim only passages the outline marks as verified, and give the
    edition in a comment. Anything marked [unverified] gets paraphrased in our own words.
  - **Copyrighted sources:** at most three one-sentence quotes in the whole line, exactly as the
    outline lists them, and nothing longer.
  - **Song lyrics:** never.
  - **`childLines`:** every lifted or quoted line in an `all` quest gets one: an original
    replacement for the Learning Grove.
- **Audience:** take it from the outline. `teen` and `adult` lines need no `childLines`.
- **No timers or chores:** nothing once a day or once per visit. Rewards are one-time.
- **Line length:** ≤ 160 characters. Narrator lines are at most two sentences.
- **English:** British-leaning.

## Validate

Run these from the repo root, and fix everything they report:

- `npx tsc --noEmit --ignoreConfig --strict --skipLibCheck --target es2022 --module esnext --moduleResolution bundler --verbatimModuleSyntax src/content/<your file>.ts`
- `npx eslint src/content/<your file>.ts`

Also self-check that:

- ids are unique and every `requires` points at a real code;
- every quoted line has `childLines` where needed;
- no `who` is undeclared.

## Log

Write `docs/logs/script-<id>.md` with:

- the counts: quests, steps, scenes, lines and choices;
- the lifted text used;
- the flags read and written;
- the variants;
- the SIM needs;
- anything changed from the outline, and why;
- "For Maor".

Reply in at most 4 lines.
