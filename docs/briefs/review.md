# Brief: review a batch of scripted content (Hazel's Grove)

You review newly scripted storylines against the canon. You run in one of two modes, named in
your task:

- **report:** you only write a report.
- **fix:** you apply the fixes too, then write the report.

All paths are relative to the repo root.

## Read first

- `docs/canon.md`. It wins over everything.
- `src/content/STORY-BIBLE.md`
- `src/content/STYLE.md`
- `src/content/EDU-STYLE.md`, if the batch includes Learning Grove files
- The outline section for each storyline: `docs/atlas.md` or `docs/more-stories.md`
- Each storyline's script log, `docs/logs/script-<id>.md`

## What to check, in priority order

1. **Canon and continuity.**
   - **Facts:** timeline and chapter windows, who knows what when, and pronouns. Sparks and
     Pixel are she/her. Dusty is they/them.
   - **Flags:** flags read and written. Only S23, S26 and S27 write campaign flags. Atlas, Arcade
     and fun packs read Grove state and never write it.
   - **Names:** Linnet, Thimble, Wren and Pip.
   - **Who can speak:** see canon 17 and 31.
   - **Variant wiring:** every variant the notes mention exists and can be reached.
2. **The outline is honoured.** Every quest is present or deliberately merged. The signature
   choice pays off three or more quests later. Rewards and care notes are followed.
3. **Quality.** Holds the campaign's standard: concrete, dry, warm, real choices, quiet grave
   turns. Quote the weakest lines and give a better one.
4. **Grammar and language.** British-leaning English, typos, line length (≤ 160 characters),
   narration of at most two sentences.
5. **Culture and sensitivity.**
   - Living traditions and faiths are treated with respect.
   - Advisers are named where the outline asks for them.
   - Age-fit for the audience tag.
6. **Rules.**
   - No song lyrics.
   - Copyrighted sources have at most three one-sentence quotes in the whole line.
   - Public-domain quotes are verbatim and marked verified. Otherwise they are paraphrased.
   - Every quote in an `all` quest has `childLines`.
   - No timers, dailies or farms.

Also run these from the repo root:

- `npx tsc --noEmit -p .`
- `npx eslint src/content tests/tools`
- `npx tsx tests/tools/content-check.ts --warnings`

## Output

Write `docs/logs/review-<batch>.md` with:

1. **Verdict.**
2. **Must fix:** a table with the columns file, where, problem and exact fix.
3. **Should fix:** same columns.
4. **Nice to have.**
5. **Best moments to protect.**

In **fix** mode, apply every must-fix and should-fix item, mark each row done or why not, and
rerun the three checks. They must end with 0 problems.

Reply with the counts only.
