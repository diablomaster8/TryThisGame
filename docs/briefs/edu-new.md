# Brief: Learning Grove versions of one new storyline

You write the Learning Grove versions of **one** scripted storyline, in both bands:

- **sprout:** ages 3–6, read aloud.
- **reader:** ages 7–10.

The goal is the Learning Grove's language switch: the same story, as educational as possible,
blended into the fun so it never feels like work. All paths are relative to the repo root.

## Read first

1. `docs/canon.md` (wins over everything) and `src/content/STORY-BIBLE.md`.
2. `src/content/EDU-STYLE.md`. Read all of it: bands, lesson kinds (ask, notice, do), the approved
   standards list, line caps (sprout ≤ 14 words, reader ≤ 30), hard-things rules, no quiz tone,
   and no quotes from the originals.
3. `src/content/types.ts`, for `EduBand`, `Lesson`, `EduScene`, `EduQuest` and `GlossaryEntry`.
4. **Format models.** Read the first 150 lines of each:
   - `src/content/edu-side-new-a-sprout.ts`
   - `src/content/edu-side-new-1-reader.ts`
   - `src/content/edu.ts` (how bands are registered)
5. **Your storyline's script:** the file named in your task, plus its section in
   `docs/more-stories.md` or `docs/atlas.md`. The section's "Learning Grove version" lists what
   the line should teach.

## What to write

- **Two new files:** `src/content/edu-<id>-sprout.ts` and `src/content/edu-<id>-reader.ts`.
  Each exports `EDU_<ID>_SPROUT` or `EDU_<ID>_READER` as `EduQuest[]`, plus a `_VARIANTS:
  EduScene[]` for the line's variant scenes, if the original has variants.
- **Every scene gets a version in each band:** every step scene, done scene, complete scene and
  variant. The id is `<band>:<original scene id>` and `of` is the original id.
- **Choices:**
  - **Reader:** keeps every original choice id.
  - **Sprout:** may drop choices only with a `defaultChoice`.
- **Lessons:** at least one per scene, each with an approved `standard`. Use the outline's
  Learning Grove angle (geography, history, science, maths, language, feelings, culture).
  Lessons grow out of the story, never "quick check" quizzes.
- **No lifted or quoted text from the source.** Write original lines. The original's `childLines`
  show you the safe replacements.
- **Hard things:** death and fear are handled the EDU-STYLE way: plain words, gentle, with
  comfort straight after.
- **Culture:** keep facts accurate, and keep the outline's care notes.

## Don't

- Don't edit any other file. The wiring task registers your files in `edu.ts` and adds the
  storyline to `eduPacks` in `tests/tools/content-check.ts`.
- Don't write a Learning Grove version of a `main`, `teen` or `adult` storyline. Stop and say so.

## Validate

Run this from the repo root:

```
npx tsc --noEmit --ignoreConfig --strict --skipLibCheck --target es2022 --module esnext --moduleResolution bundler --verbatimModuleSyntax src/content/edu-<id>-sprout.ts src/content/edu-<id>-reader.ts
npx eslint src/content/edu-<id>-*.ts
```

Then check by hand:

- every original scene id has a version in each band;
- the lesson ids are unique;
- the line caps hold.

## Log

Write `docs/logs/edu-<id>.md`:

- counts: scenes, lessons, and lessons by domain;
- the standards used;
- any original scene you couldn't map;
- "For Maor".

Reply in at most 4 lines.
