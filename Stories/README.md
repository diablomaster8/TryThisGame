# Grove content pack (2026-10-15, v5: the fix pass)

Script data for the whole recommendations backlog: pure data, not yet wired into the game.

- `src/content/STORY-BIBLE.md` — the canon for Hazel's Grove. Read first.
- `src/content/campaign*.ts` — the campaign v2 (12 chapters, the Long Night, 8 endings).
- `src/content/side-stories-*.ts` — side stories S1–S22 (S2, S9, S10, S13, S19 change the campaign). S23–S31
  (Part M) are scripted in `side-stories-s23.ts`…`s31.ts`; S23, S26 and S27 change the campaign.
- `src/content/atlas-a11.ts` … `atlas-a21.ts` — scripted Atlas pages A11–A21 (wave 2, 2026-10-15). A1–A10,
  A22–A31, the Arcade (PA1–PA5), the fun packs (Q66–Q95) and LB/LK follow in waves.
- `src/content/EDU-STYLE.md`, `edu.ts`, `edu-*.ts` — the Learning Grove's language switch: sprout
  (3–6, read aloud) and reader (7–10) versions of every story scene, with lessons woven in.
- `src/content/lang-hebrew.ts`, `lang-japanese.ts`, `edu-lang-*.ts` — Learning Grove-only beginner
  questlines (Ori's Alef-Bet, Hana's Hiragana) with vetted word lists and script primers.
- The rest — fun quests, Neopia, the Multiverse campaign, readers, result lines. `types.ts` defines
  every shape; `STYLE.md` is the writing guide.
- `tests/tools/content-check.ts` — validates everything (run `npx tsx tests/tools/content-check.ts`; add
  `--warnings` for the pronoun, timer and line-length lint). It also fails on original quotes in the
  Learning Grove, non-`all` quests in Learning Grove packs, and speaker ids reused across audiences.
- `tests/tools/script-book.ts` — renders `script-book/` (readable screenplays of everything).
- `voiceover/` — the voice-over builder (Kokoro, Windows launcher): only characters speak, pacing set by mood; script.json holds the 5-minute opening.

**Start here:** `CLAUDE.md` (root; the existing engineering brief plus a new "Story and content" section) and `plan.md`
(the remaining work as copy-paste subagent tasks). `docs/` holds the canon, the outlines (`atlas.md`, `more-stories.md`),
the briefs the tasks use, the master prompt and the change log.

Copy `src/content/`, `tests/tools/*.ts`, `docs/`, `CLAUDE.md` and `plan.md` into the repo root as-is. They type-check and lint clean
against commit 97b38a7.

## What changed in v5 (2026-10-15)

- Every item from the full quality review is fixed, adapted or explained: 241 items, plus the
  regression pass. See `grove-fix-changelog.md`.
- The canon is settled in the bible's "Settled details":
  - Pixel and Sparks are she/her.
  - Moss's first words to Hazel are "You'll do."
  - Briar's flower was the first on the hill.
  - Chapter 11 spans a few days.
  - The "Open" variant of the Hazel's Grove ending.
  - Audience is all, main, teen or adult, behind a "Mature content" setting.
  - Other campaigns read Grove state and never write it.
  - No timers.
- `Audience` gains `main` and `teen`. Neopia's darker plots are `main`.
- New scenes, all with Learning Grove versions in both bands:
  - c5-considered
  - c9-open-sold
  - c11-moss-kept
  - c11-moss-passed
  - end-hazels-grove-open
  - s8-complete-dawn
  - five s19-*-alone scenes
- Engine changes needed for these scenes are listed in the master prompt's CV6.

