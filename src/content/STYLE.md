# Script style guide (Grove)

You are writing game script data for "Grove", a cozy pixel-art virtual-pet game (Nubbins are
small Chao-like creatures; the player is a Keeper). Read this whole guide before writing.

## Output format
- One TypeScript file at the path you are given, under `src/content/` in this repo
- `import type { Quest } from './types';` (and `Reader`, `ResultSet`, `Speaker` if needed).
  Read `src/content/types.ts` first — it defines every field and the conventions
  (scene ids, `check` strings, `childLines` keys, flags).
- Read `src/config/story.ts` lines 1–120 for the Line/Choice/Scene types and the campaign
  speaker ids, and skim a few scenes there to match the voice.
- Export `export const QUESTS: Quest[] = [...]` (or the export names you are told), plus
  `export const CHECKS: string[] = [...]` listing every distinct `check` string you used.
- Validate before you finish (must print no errors):
  `npx tsc --noEmit --ignoreConfig --strict --skipLibCheck --target es2022 --module esnext --moduleResolution bundler --verbatimModuleSyntax src/content/<yourfile>.ts`
- Do not edit any other file in the repo. Do not run git.

## Shape of a quest
- 2–4 steps. Each step: a `scene` (6–14 lines) that sets up the goal, a `goal` (one
  sentence, journal style), a `hint` (one sentence, practical), a `check`, and usually a
  short `done` scene (2–5 lines).
- A `complete` scene (4–10 lines) that pays it off and names the reward in-world.
- At least one quest step in every quest has a `choices` array (2–3 choices) with
  `then` lines, so the player has a voice. Choices in fun quests may set harmless flags
  (`q12-refund: true`); choices in story lines set real flags named in the brief.
- `rewards` list exactly what the brief says, with clear `description`s.
- `notes`: staging, timing, art or sound needs, and anything the implementer must know.

## Voice
- Plain, warm, specific, dry humour. Short lines: at most ~160 characters per line,
  most under 100. No line of narration longer than two sentences.
- The narrator speaks in present tense, second person ("You lift the latch.").
- The player ("you") speaks rarely and briefly; most player voice is in choices.
- Use `mood` on lines where the portrait should change (happy, sad, angry, think, shock,
  soft). Default neutral.
- British spelling (colour, favourite, armour), as the rest of the game uses.
- Every scene must work on a phone: no walls of text, one idea per line.

## Content rules
- Original dialogue. Do not reproduce scripts, lyrics, poems or passages from any film,
  show, comic, game or book. The ONLY exceptions are the short quotes your brief lists as
  approved; use those exactly as given, at most once or twice each, and add a
  `childLines` entry replacing each one with an original line (unless audience is
  'adult', which never appears in child mode).
- Never write song lyrics from a real song. Original songs only, when the brief asks.
- Plots of story lines follow the brief's summary of the source, adapted to the Grove,
  with Nubbins as companions; all words are new.
- No slurs; no jokes about race or sexual coercion; no sexual content; no gore beyond the
  brief's rating. Adult-rated packs may be crude, boozy and violent as the brief allows.
- Speaker names: use the in-game names the brief gives. Put the real source character in
  `basedOn` only.

## Joke density (R0309)

A gag is a line meant to get a smile; mark it `gag: true`. Targets by scene type, measured
by `npx tsx tests/tools/content-check.ts --comedy` (it lists the 20 thinnest scenes per type):

| Scene type | Target | Notes |
| --- | --- | --- |
| Campaign everyday (ch 1–8, 12) | 1 per 4–6 lines | Never in Moss's tales; the first line after a grave beat may be dry relief |
| Campaign turning points (ch 9–11, deaths, partings) | 0–1 per scene | Relief only, one gentle line late |
| Side stories (main register) | 1 per 5 lines | |
| Fun quests | 1 per 2–3 lines | Plus 1 physical gag per step |
| Sunny / Multiverse (adult) | 1 per 2–3 lines | Plus 1 running-gag hit per quest |
| Neopia | 1 per 3 lines | |
| Atlas / Arcade | 1 per 6 lines | Respect the source's tone; Nubbin business is the gag |
| UI toasts | ≥1 in 4 carries a voice | Never on errors or saves |
| Item, critter, hat descriptions | 100% have a dry tag | |

## Goal chips (R0319)

A chapter's `goalText` is one sentence of 60 characters or fewer, and its `hint` one sentence
of 70 or fewer that names the exact button label. A longer how-to goes in `howTo`, a list of
short steps the chip reveals one at a time as each is done. The checker enforces the caps.

## Hints (R0292)

- A hint names only things the player can really do: tap a person or a thing, shake, pick
  up, carry, feed, pet, place, craft, race, go down, visit, or a button the game shows.
- No "use Give", "use Talk", "Photo mode" or invented buttons ("press ACT", "choose Haggle").
  The checker warns on `hint-button?` and fails on `hint-verb`.
- A step the Grove cannot see plays a micro-game from the Journal's Do it (`sim/micro.ts`):
  say "tap Do it in the Journal", and let the hint carry the joke ("Harrow will look
  wounded; he isn't.").
