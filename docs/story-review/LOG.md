# Story review log

The running log for the repeatable story and writing review. Each run reviews the 10 units least recently reviewed, re-checks open recommendations, and adds a run file here.

**Units.** Each file in `script-book/` (except `README.md`) is one unit: one storyline per file, and one file per band for its Learning Grove versions (`atlas/A14/main.md`, `atlas/A14/reader.md`, `learning/side/S09/sprout.md`). The generator caps files at 3,500 lines and splits longer ones at their `##` headings into `-1`, `-2` (today only `learning/campaign/reader-1.md` and `-2.md`); each part is its own unit. A new file joins Coverage as "never". Cite scenes by id; `script-book/ids.tsv` gives each id's book file:line and source file:line. Order Coverage as the book README does.

**Remap of 2026-10-22 (storage plan, review-2026-10-22-2).** The book moved from 68 pack files to one storyline per file. Last-reviewed dates carried across: `00` → `campaign/*`; `01`, `01b`, `01c` → `side/*`; `02`–`05` → `fun/python`, `bean`, `sunny`, `avatar`; `06`, `07` → `neopia/*`; `08`–`13` → `multiverse/ironman` … `spawn`; `20a` → `learning/campaign/sprout.md`; `21a` → `learning/campaign/reader-*`; `20b [S1 .. S17]` → `learning/side/S01`–`S12`, `S15`–`S17` `sprout.md`; `21b [S1 .. S11]` → `learning/side/S01`–`S11` `reader.md`. Everything else, including Alice, Holmes, Hodja, E1–E3 and the four storylines (rendered for the first time), starts as "never". Two caveats for the next run: `neopia/*` and `multiverse/*` now also print their variant scenes, which no run has read; and the edu side-story files now include their variants, which sat in unreviewed `20b`/`21b` parts. The Register keeps the old unit names; they map as above.

## Coverage

| unit | last reviewed (run file) | open recs |
| --- | --- | --- |
| `campaign/book-1.md` | [review-2026-10-26-2](review-2026-10-26-2.md) | 0 |
| `campaign/book-2.md` | [review-2026-10-26-2](review-2026-10-26-2.md) | 0 |
| `campaign/book-3.md` | [review-2026-10-26-3](review-2026-10-26-3.md) | 0 |
| `campaign/triggered.md` | [review-2026-10-26-3](review-2026-10-26-3.md) | 1 |
| `campaign/endings.md` | [review-2026-10-26-3](review-2026-10-26-3.md) | 0 |
| `side/S01.md` | [review-2026-10-26-3](review-2026-10-26-3.md) | 0 |
| `learning/side/S01/sprout.md` | [review-2026-10-26-4](review-2026-10-26-4.md) | 9 |
| `learning/side/S01/reader.md` | [review-2026-10-26-4](review-2026-10-26-4.md) | 8 |
| `side/S02.md` | [review-2026-10-26-3](review-2026-10-26-3.md) | 0 |
| `learning/side/S02/sprout.md` | [review-2026-10-22-2](review-2026-10-22-2.md) | 0 |
| `learning/side/S02/reader.md` | [review-2026-10-22-2](review-2026-10-22-2.md) | 0 |
| `side/S03.md` | [review-2026-10-26-3](review-2026-10-26-3.md) | 0 |
| `learning/side/S03/sprout.md` | [review-2026-10-22-2](review-2026-10-22-2.md) | 0 |
| `learning/side/S03/reader.md` | [review-2026-10-22-2](review-2026-10-22-2.md) | 0 |
| `side/S04.md` | [review-2026-10-26-3](review-2026-10-26-3.md) | 0 |
| `learning/side/S04/sprout.md` | [review-2026-10-22-2](review-2026-10-22-2.md) | 0 |
| `learning/side/S04/reader.md` | [review-2026-10-22-2](review-2026-10-22-2.md) | 0 |
| `side/S05.md` | [review-2026-10-26-3](review-2026-10-26-3.md) | 0 |
| `learning/side/S05/sprout.md` | [review-2026-10-22-2](review-2026-10-22-2.md) | 0 |
| `learning/side/S05/reader.md` | [review-2026-10-22-2](review-2026-10-22-2.md) | 0 |
| `side/S06.md` | [review-2026-10-26-4](review-2026-10-26-4.md) | 4 |
| `learning/side/S06/sprout.md` | [review-2026-10-22-2](review-2026-10-22-2.md) | 0 |
| `learning/side/S06/reader.md` | [review-2026-10-22-2](review-2026-10-22-2.md) | 0 |
| `side/S07.md` | [review-2026-10-26-4](review-2026-10-26-4.md) | 5 |
| `learning/side/S07/sprout.md` | [review-2026-10-22-2](review-2026-10-22-2.md) | 0 |
| `learning/side/S07/reader.md` | [review-2026-10-22-2](review-2026-10-22-2.md) | 0 |
| `side/S08.md` | [review-2026-10-26-4](review-2026-10-26-4.md) | 4 |
| `learning/side/S08/sprout.md` | [review-2026-10-22-2](review-2026-10-22-2.md) | 0 |
| `learning/side/S08/reader.md` | [review-2026-10-22-2](review-2026-10-22-2.md) | 0 |
| `side/S09.md` | [review-2026-10-26-4](review-2026-10-26-4.md) | 5 |
| `learning/side/S09/sprout.md` | [review-2026-10-22-2](review-2026-10-22-2.md) | 0 |
| `learning/side/S09/reader.md` | [review-2026-10-22-2](review-2026-10-22-2.md) | 0 |
| `side/S10.md` | [review-2026-10-26-4](review-2026-10-26-4.md) | 5 |
| `learning/side/S10/sprout.md` | [review-2026-10-22-2](review-2026-10-22-2.md) | 0 |
| `learning/side/S10/reader.md` | [review-2026-10-22-2](review-2026-10-22-2.md) | 0 |
| `side/S11.md` | [review-2026-10-26-4](review-2026-10-26-4.md) | 4 |
| `learning/side/S11/sprout.md` | [review-2026-10-22-2](review-2026-10-22-2.md) | 0 |
| `learning/side/S11/reader.md` | [review-2026-10-22-2](review-2026-10-22-2.md) | 0 |
| `side/S12.md` | [review-2026-10-26-4](review-2026-10-26-4.md) | 4 |
| `learning/side/S12/sprout.md` | [review-2026-10-22-2](review-2026-10-22-2.md) | 0 |
| `learning/side/S12/reader.md` | [review-2026-10-22-3](review-2026-10-22-3.md) | 0 |
| `side/S13.md` | [review-2026-10-26-4](review-2026-10-26-4.md) | 5 |
| `learning/side/S13/sprout.md` | [review-2026-10-22-3](review-2026-10-22-3.md) | 0 |
| `learning/side/S13/reader.md` | [review-2026-10-22-3](review-2026-10-22-3.md) | 0 |
| `side/S14.md` | [review-2026-10-22](review-2026-10-22.md) | 0 |
| `learning/side/S14/sprout.md` | [review-2026-10-22-3](review-2026-10-22-3.md) | 0 |
| `learning/side/S14/reader.md` | [review-2026-10-22-3](review-2026-10-22-3.md) | 0 |
| `side/S15.md` | [review-2026-10-22](review-2026-10-22.md) | 0 |
| `learning/side/S15/sprout.md` | [review-2026-10-22-2](review-2026-10-22-2.md) | 0 |
| `learning/side/S15/reader.md` | [review-2026-10-22-3](review-2026-10-22-3.md) | 0 |
| `side/S16.md` | [review-2026-10-22](review-2026-10-22.md) | 0 |
| `learning/side/S16/sprout.md` | [review-2026-10-22-2](review-2026-10-22-2.md) | 0 |
| `learning/side/S16/reader.md` | [review-2026-10-22-3](review-2026-10-22-3.md) | 0 |
| `side/S17.md` | [review-2026-10-22](review-2026-10-22.md) | 0 |
| `learning/side/S17/sprout.md` | [review-2026-10-22-2](review-2026-10-22-2.md) | 0 |
| `learning/side/S17/reader.md` | [review-2026-10-22-3](review-2026-10-22-3.md) | 0 |
| `side/S18.md` | [review-2026-10-22](review-2026-10-22.md) | 0 |
| `learning/side/S18/sprout.md` | [review-2026-10-22-3](review-2026-10-22-3.md) | 0 |
| `learning/side/S18/reader.md` | [review-2026-10-22-3](review-2026-10-22-3.md) | 0 |
| `side/S19.md` | [review-2026-10-22](review-2026-10-22.md) | 0 |
| `learning/side/S19/sprout.md` | [review-2026-10-22-4](review-2026-10-22-4.md) | 0 |
| `learning/side/S19/reader.md` | [review-2026-10-22-4](review-2026-10-22-4.md) | 0 |
| `side/S20.md` | [review-2026-10-22](review-2026-10-22.md) | 0 |
| `learning/side/S20/sprout.md` | [review-2026-10-22-4](review-2026-10-22-4.md) | 0 |
| `learning/side/S20/reader.md` | [review-2026-10-22-4](review-2026-10-22-4.md) | 0 |
| `side/S21.md` | [review-2026-10-22](review-2026-10-22.md) | 0 |
| `learning/side/S21/sprout.md` | [review-2026-10-22-4](review-2026-10-22-4.md) | 0 |
| `learning/side/S21/reader.md` | [review-2026-10-22-4](review-2026-10-22-4.md) | 0 |
| `side/S22.md` | [review-2026-10-22](review-2026-10-22.md) | 0 |
| `learning/side/S22/sprout.md` | [review-2026-10-22-4](review-2026-10-22-4.md) | 0 |
| `learning/side/S22/reader.md` | [review-2026-10-22-4](review-2026-10-22-4.md) | 0 |
| `side/S23.md` | [review-2026-10-22](review-2026-10-22.md) | 0 |
| `side/S24.md` | [review-2026-10-22](review-2026-10-22.md) | 0 |
| `learning/side/S24/sprout.md` | [review-2026-10-22-4](review-2026-10-22-4.md) | 0 |
| `learning/side/S24/reader.md` | [review-2026-10-22-4](review-2026-10-22-4.md) | 0 |
| `side/S25.md` | [review-2026-10-22](review-2026-10-22.md) | 0 |
| `learning/side/S25/sprout.md` | [review-2026-10-22-5](review-2026-10-22-5.md) | 0 |
| `learning/side/S25/reader.md` | [review-2026-10-22-5](review-2026-10-22-5.md) | 0 |
| `side/S26.md` | [review-2026-10-22](review-2026-10-22.md) | 0 |
| `learning/side/S26/sprout.md` | [review-2026-10-22-5](review-2026-10-22-5.md) | 0 |
| `learning/side/S26/reader.md` | [review-2026-10-22-5](review-2026-10-22-5.md) | 0 |
| `side/S27.md` | [review-2026-10-22](review-2026-10-22.md) | 0 |
| `learning/side/S27/sprout.md` | [review-2026-10-22-5](review-2026-10-22-5.md) | 0 |
| `learning/side/S27/reader.md` | [review-2026-10-22-5](review-2026-10-22-5.md) | 0 |
| `side/S28.md` | [review-2026-10-22](review-2026-10-22.md) | 0 |
| `learning/side/S28/sprout.md` | [review-2026-10-22-5](review-2026-10-22-5.md) | 0 |
| `learning/side/S28/reader.md` | [review-2026-10-22-5](review-2026-10-22-5.md) | 0 |
| `side/S29.md` | [review-2026-10-22](review-2026-10-22.md) | 0 |
| `learning/side/S29/sprout.md` | [review-2026-10-22-5](review-2026-10-22-5.md) | 0 |
| `learning/side/S29/reader.md` | [review-2026-10-22-5](review-2026-10-22-5.md) | 0 |
| `side/S30.md` | [review-2026-10-22](review-2026-10-22.md) | 0 |
| `learning/side/S30/sprout.md` | [review-2026-10-23](review-2026-10-23.md) | 0 |
| `learning/side/S30/reader.md` | [review-2026-10-23](review-2026-10-23.md) | 0 |
| `side/S31.md` | [review-2026-10-22](review-2026-10-22.md) | 0 |
| `learning/side/S31/sprout.md` | [review-2026-10-23](review-2026-10-23.md) | 0 |
| `learning/side/S31/reader.md` | [review-2026-10-23](review-2026-10-23.md) | 0 |
| `learning/campaign/sprout.md` | [review-2026-10-26-3](review-2026-10-26-3.md) | 0 |
| `learning/campaign/reader-1.md` | [review-2026-10-26-3](review-2026-10-26-3.md) | 0 |
| `learning/campaign/reader-2.md` | [review-2026-10-22](review-2026-10-22.md) | 0 |
| `fun/python.md` | [review-2026-10-22](review-2026-10-22.md) | 0 |
| `learning/fun/python/sprout.md` | [review-2026-10-23](review-2026-10-23.md) | 0 |
| `learning/fun/python/reader.md` | [review-2026-10-23](review-2026-10-23.md) | 0 |
| `fun/bean.md` | [review-2026-10-22](review-2026-10-22.md) | 0 |
| `learning/fun/bean/sprout.md` | [review-2026-10-23](review-2026-10-23.md) | 0 |
| `learning/fun/bean/reader.md` | [review-2026-10-23](review-2026-10-23.md) | 0 |
| `fun/sunny.md` | [review-2026-10-22](review-2026-10-22.md) | 0 |
| `fun/avatar.md` | [review-2026-10-22](review-2026-10-22.md) | 0 |
| `learning/fun/avatar/sprout.md` | [review-2026-10-23](review-2026-10-23.md) | 0 |
| `learning/fun/avatar/reader.md` | [review-2026-10-23](review-2026-10-23.md) | 0 |
| `fun/alice.md` | [review-2026-10-23-2](review-2026-10-23-2.md) | 0 |
| `fun/holmes.md` | [review-2026-10-23-2](review-2026-10-23-2.md) | 0 |
| `fun/hodja.md` | [review-2026-10-23-2](review-2026-10-23-2.md) | 0 |
| `neopia/line.md` | [review-2026-10-22-2](review-2026-10-22-2.md) | 0 |
| `neopia/quests.md` | [review-2026-10-22-2](review-2026-10-22-2.md) | 0 |
| `multiverse/ironman.md` | [review-2026-10-22-2](review-2026-10-22-2.md) | 0 |
| `multiverse/cap.md` | [review-2026-10-22-2](review-2026-10-22-2.md) | 0 |
| `multiverse/doom.md` | [review-2026-10-22-2](review-2026-10-22-2.md) | 0 |
| `multiverse/ultron.md` | [review-2026-10-22-2](review-2026-10-22-2.md) | 0 |
| `multiverse/moonknight.md` | [review-2026-10-22-2](review-2026-10-22-2.md) | 0 |
| `multiverse/spawn.md` | [review-2026-10-22-2](review-2026-10-22-2.md) | 0 |
| `multiverse/dragonball.md` | [review-2026-10-23-2](review-2026-10-23-2.md) | 0 |
| `multiverse/toystory.md` | [review-2026-10-23-2](review-2026-10-23-2.md) | 0 |
| `multiverse/endgames.md` | [review-2026-10-23-2](review-2026-10-23-2.md) | 0 |
| `expansions/E1.md` | [review-2026-10-23-2](review-2026-10-23-2.md) | 0 |
| `expansions/E2.md` | [review-2026-10-23-2](review-2026-10-23-2.md) | 0 |
| `expansions/E3.md` | [review-2026-10-23-3](review-2026-10-23-3.md) | 0 |
| `storylines/hundred.md` | [review-2026-10-23-3](review-2026-10-23-3.md) | 0 |
| `storylines/logged.md` | [review-2026-10-23-3](review-2026-10-23-3.md) | 0 |
| `storylines/beetle.md` | [review-2026-10-23-3](review-2026-10-23-3.md) | 0 |
| `storylines/dawndusk.md` | [review-2026-10-23-3](review-2026-10-23-3.md) | 0 |
| `atlas/A01/main.md` | [review-2026-10-23-3](review-2026-10-23-3.md) | 0 |
| `atlas/A02/main.md` | [review-2026-10-23-3](review-2026-10-23-3.md) | 0 |
| `atlas/A02/sprout.md` | [review-2026-10-23-2](review-2026-10-23-2.md) | 0 |
| `atlas/A02/reader.md` | [review-2026-10-23-2](review-2026-10-23-2.md) | 0 |
| `atlas/A03/main.md` | [review-2026-10-23-3](review-2026-10-23-3.md) | 0 |
| `atlas/A04/main.md` | [review-2026-10-23-4](review-2026-10-23-4.md) | 0 |
| `atlas/A05/main.md` | [review-2026-10-23-4](review-2026-10-23-4.md) | 0 |
| `atlas/A05/sprout.md` | [review-2026-10-23-3](review-2026-10-23-3.md) | 0 |
| `atlas/A05/reader.md` | [review-2026-10-23-3](review-2026-10-23-3.md) | 0 |
| `atlas/A06/main.md` | [review-2026-10-23-4](review-2026-10-23-4.md) | 0 |
| `atlas/A06/sprout.md` | [review-2026-10-23-4](review-2026-10-23-4.md) | 0 |
| `atlas/A06/reader.md` | [review-2026-10-23-4](review-2026-10-23-4.md) | 0 |
| `atlas/A07/main.md` | [review-2026-10-23-4](review-2026-10-23-4.md) | 0 |
| `atlas/A07/sprout.md` | [review-2026-10-23-4](review-2026-10-23-4.md) | 0 |
| `atlas/A07/reader.md` | [review-2026-10-23-4](review-2026-10-23-4.md) | 0 |
| `atlas/A08/main.md` | [review-2026-10-23-4](review-2026-10-23-4.md) | 0 |
| `atlas/A08/sprout.md` | [review-2026-10-23-5](review-2026-10-23-5.md) | 0 |
| `atlas/A08/reader.md` | [review-2026-10-23-5](review-2026-10-23-5.md) | 0 |
| `atlas/A09/main.md` | [review-2026-10-23-4](review-2026-10-23-4.md) | 0 |
| `atlas/A09/sprout.md` | [review-2026-10-23-5](review-2026-10-23-5.md) | 0 |
| `atlas/A09/reader.md` | [review-2026-10-23-5](review-2026-10-23-5.md) | 0 |
| `atlas/A10/main.md` | [review-2026-10-23-5](review-2026-10-23-5.md) | 0 |
| `atlas/A10/sprout.md` | [review-2026-10-23-5](review-2026-10-23-5.md) | 0 |
| `atlas/A10/reader.md` | [review-2026-10-23-5](review-2026-10-23-5.md) | 0 |
| `atlas/A11/main.md` | [review-2026-10-23-5](review-2026-10-23-5.md) | 0 |
| `atlas/A11/sprout.md` | [review-2026-10-23-5](review-2026-10-23-5.md) | 0 |
| `atlas/A11/reader.md` | [review-2026-10-23-5](review-2026-10-23-5.md) | 0 |
| `atlas/A12/main.md` | [review-2026-10-24](review-2026-10-24.md) | 0 |
| `atlas/A12/sprout.md` | [review-2026-10-24](review-2026-10-24.md) | 0 |
| `atlas/A12/reader.md` | [review-2026-10-24](review-2026-10-24.md) | 0 |
| `atlas/A13/main.md` | [review-2026-10-24](review-2026-10-24.md) | 0 |
| `atlas/A13/sprout.md` | [review-2026-10-24](review-2026-10-24.md) | 0 |
| `atlas/A13/reader.md` | [review-2026-10-24](review-2026-10-24.md) | 0 |
| `atlas/A14/main.md` | [review-2026-10-24](review-2026-10-24.md) | 0 |
| `atlas/A14/sprout.md` | [review-2026-10-24](review-2026-10-24.md) | 0 |
| `atlas/A14/reader.md` | [review-2026-10-24](review-2026-10-24.md) | 0 |
| `atlas/A15/main.md` | [review-2026-10-24](review-2026-10-24.md) | 0 |
| `atlas/A15/sprout.md` | [review-2026-10-24-2](review-2026-10-24-2.md) | 0 |
| `atlas/A15/reader.md` | [review-2026-10-24-2](review-2026-10-24-2.md) | 0 |
| `atlas/A16/main.md` | [review-2026-10-24-2](review-2026-10-24-2.md) | 0 |
| `atlas/A16/reader.md` | [review-2026-10-24-2](review-2026-10-24-2.md) | 0 |
| `atlas/A17/main.md` | [review-2026-10-24-2](review-2026-10-24-2.md) | 0 |
| `atlas/A17/sprout.md` | [review-2026-10-24-2](review-2026-10-24-2.md) | 0 |
| `atlas/A17/reader.md` | [review-2026-10-24-2](review-2026-10-24-2.md) | 0 |
| `atlas/A18/main.md` | [review-2026-10-24-2](review-2026-10-24-2.md) | 0 |
| `atlas/A18/sprout.md` | [review-2026-10-24-2](review-2026-10-24-2.md) | 0 |
| `atlas/A18/reader.md` | [review-2026-10-24-2](review-2026-10-24-2.md) | 0 |
| `atlas/A19/main.md` | [review-2026-10-24-3](review-2026-10-24-3.md) | 0 |
| `atlas/A19/sprout.md` | [review-2026-10-24-3](review-2026-10-24-3.md) | 0 |
| `atlas/A19/reader.md` | [review-2026-10-24-3](review-2026-10-24-3.md) | 0 |
| `atlas/A20/main.md` | [review-2026-10-24-3](review-2026-10-24-3.md) | 0 |
| `atlas/A20/sprout.md` | [review-2026-10-24-3](review-2026-10-24-3.md) | 0 |
| `atlas/A20/reader.md` | [review-2026-10-24-3](review-2026-10-24-3.md) | 0 |
| `atlas/A21/main.md` | [review-2026-10-24-3](review-2026-10-24-3.md) | 0 |
| `atlas/A22/main.md` | [review-2026-10-24-3](review-2026-10-24-3.md) | 0 |
| `atlas/A22/sprout.md` | [review-2026-10-24-3](review-2026-10-24-3.md) | 0 |
| `atlas/A22/reader.md` | [review-2026-10-24-3](review-2026-10-24-3.md) | 0 |
| `atlas/A23/main.md` | [review-2026-10-25](review-2026-10-25.md) | 0 |
| `atlas/A23/sprout.md` | [review-2026-10-25](review-2026-10-25.md) | 0 |
| `atlas/A23/reader.md` | [review-2026-10-25](review-2026-10-25.md) | 0 |
| `atlas/A24/main.md` | [review-2026-10-25](review-2026-10-25.md) | 0 |
| `atlas/A24/sprout.md` | [review-2026-10-25](review-2026-10-25.md) | 0 |
| `atlas/A24/reader.md` | [review-2026-10-25](review-2026-10-25.md) | 0 |
| `atlas/A25/main.md` | [review-2026-10-25](review-2026-10-25.md) | 0 |
| `atlas/A25/reader.md` | [review-2026-10-25](review-2026-10-25.md) | 0 |
| `atlas/A26/main.md` | [review-2026-10-25](review-2026-10-25.md) | 0 |
| `atlas/A26/sprout.md` | [review-2026-10-25](review-2026-10-25.md) | 0 |
| `atlas/A26/reader.md` | [review-2026-10-25-2](review-2026-10-25-2.md) | 0 |
| `atlas/A27/main.md` | [review-2026-10-25-2](review-2026-10-25-2.md) | 0 |
| `atlas/A27/sprout.md` | [review-2026-10-25-2](review-2026-10-25-2.md) | 0 |
| `atlas/A27/reader.md` | [review-2026-10-25-2](review-2026-10-25-2.md) | 0 |
| `atlas/A28/main.md` | [review-2026-10-25-2](review-2026-10-25-2.md) | 0 |
| `atlas/A28/sprout.md` | [review-2026-10-25-2](review-2026-10-25-2.md) | 0 |
| `atlas/A28/reader.md` | [review-2026-10-25-2](review-2026-10-25-2.md) | 0 |
| `atlas/A29/main.md` | [review-2026-10-25-2](review-2026-10-25-2.md) | 0 |
| `atlas/A29/reader.md` | [review-2026-10-25-2](review-2026-10-25-2.md) | 0 |
| `atlas/A30/main.md` | [review-2026-10-25-2](review-2026-10-25-2.md) | 0 |
| `atlas/A30/sprout.md` | [review-2026-10-25-3](review-2026-10-25-3.md) | 0 |
| `atlas/A30/reader.md` | [review-2026-10-25-3](review-2026-10-25-3.md) | 0 |
| `atlas/A31/main.md` | [review-2026-10-25-3](review-2026-10-25-3.md) | 0 |
| `atlas/A31/sprout.md` | [review-2026-10-25-3](review-2026-10-25-3.md) | 0 |
| `atlas/A31/reader.md` | [review-2026-10-25-3](review-2026-10-25-3.md) | 0 |
| `arcade/PA1/main.md` | [review-2026-10-25-3](review-2026-10-25-3.md) | 0 |
| `arcade/PA1/sprout.md` | [review-2026-10-25-3](review-2026-10-25-3.md) | 0 |
| `arcade/PA1/reader.md` | [review-2026-10-25-3](review-2026-10-25-3.md) | 0 |
| `arcade/PA2/main.md` | [review-2026-10-25-3](review-2026-10-25-3.md) | 0 |
| `arcade/PA3/main.md` | [review-2026-10-25-3](review-2026-10-25-3.md) | 0 |
| `arcade/PA4/main.md` | [review-2026-10-26](review-2026-10-26.md) | 0 |
| `arcade/PA5/main.md` | [review-2026-10-26](review-2026-10-26.md) | 0 |
| `lines/LB/main.md` | [review-2026-10-26](review-2026-10-26.md) | 0 |
| `lines/LB/sprout.md` | [review-2026-10-26](review-2026-10-26.md) | 0 |
| `lines/LB/reader.md` | [review-2026-10-26](review-2026-10-26.md) | 0 |
| `lines/LK/main.md` | [review-2026-10-26](review-2026-10-26.md) | 1 |
| `lines/LK/sprout.md` | [review-2026-10-26](review-2026-10-26.md) | 1 |
| `lines/LK/reader.md` | [review-2026-10-26](review-2026-10-26.md) | 1 |
| `lines/lang-hebrew/main.md` | [review-2026-10-26](review-2026-10-26.md) | 0 |
| `lines/lang-hebrew/sprout.md` | [review-2026-10-26](review-2026-10-26.md) | 0 |
| `lines/lang-hebrew/reader.md` | [review-2026-10-26-2](review-2026-10-26-2.md) | 0 |
| `lines/lang-hebrew/words.md` | [review-2026-10-26-2](review-2026-10-26-2.md) | 0 |
| `lines/lang-japanese/main.md` | [review-2026-10-26-2](review-2026-10-26-2.md) | 0 |
| `lines/lang-japanese/sprout.md` | [review-2026-10-26-2](review-2026-10-26-2.md) | 0 |
| `lines/lang-japanese/reader.md` | [review-2026-10-26-2](review-2026-10-26-2.md) | 0 |
| `lines/lang-japanese/words.md` | [review-2026-10-26-2](review-2026-10-26-2.md) | 0 |
| `extras/readers.md` | [review-2026-10-26-2](review-2026-10-26-2.md) | 0 |
| `extras/results.md` | [review-2026-10-26-2](review-2026-10-26-2.md) | 0 |

## Register

Status is one of `open`, `fixed`, `partial`, `dropped` or `superseded`.

| ID | unit | scene | severity | category | one-line summary | status | run |
| --- | --- | --- | --- | --- | --- | --- | --- |
| SR-20261022-01 | 20a-edu-sprout-campaign.md | c10-kept, c11-moss-kept, c11-cold-hands, c5-sold, c9-shar… | Critical | continuity | Little Sprouts still ships keep-stone and sell scenes its own choices never reach | fixed | 2026-10-22 |
| SR-20261022-02 | 00-campaign.md<br>21a-edu-reader-campaign.md | c9-open | High | humour | Corvin's garden has no light beat; give Ember's silence a "Bless you" to break | fixed | 2026-10-22 |
| SR-20261022-03 | 00-campaign.md<br>21a-edu-reader-campaign.md | c7-stillness-2, c7-stillness-3 | High | pacing | Three Moss monologues in a row with no interruption; let a hen and your Nubbin in | fixed | 2026-10-22 |
| SR-20261022-04 | 01-side-stories.md | s10-wish3 | High | humour | S10 replays S1's Moss-and-young-Hazel flashback; give Hazel her own funny side of it | fixed | 2026-10-22 |
| SR-20261022-05 | 01-side-stories.md<br>01b-side-story-variants.md | s2-complete | High | humour | S2 is the least funny side story; land the Wisp hoard set-up with a glove rotation | fixed | 2026-10-22 |
| SR-20261022-06 | 01b-side-story-variants.md | s9-gate-family | High | humour | Corvin's "things have been reaching me" is vague; make it an anonymous pie he fears | fixed | 2026-10-22 |
| SR-20261022-07 | 01b-side-story-variants.md | s19-question-sable | High | humour | The Sable version of S19 drops its only laugh; restore the skipping line | fixed | 2026-10-22 |
| SR-20261022-08 | 01c-side-stories-s23-s31.md | s23-chairs | High | humour | S23's sit-up is ninety grave lines; give Corvin two deadpan beats | fixed | 2026-10-22 |
| SR-20261022-09 | 01c-side-stories-s23-s31.md | s29-ford-watch | High | humour | S29 steps 5-14 are joke-free after the capsize; Dusty, an otter and a flask | fixed | 2026-10-22 |
| SR-20261022-10 | 02-fun-python.md | q04-complete | High | humour | Q4 is the flattest Python quest; pay off the Warden's chalk diagram | fixed | 2026-10-22 |
| SR-20261022-11 | 05-fun-avatar.md | q52-trust | High | humour | Q52 is all sincerity; give your Nubbin a slow committed lean | fixed | 2026-10-22 |
| SR-20261022-12 | 04-fun-sunny.md | q45-complete | High | humour | The Kitten Mittens deal from Q31 never comes back; close the series on it | fixed | 2026-10-22 |
| SR-20261022-13 | 05-fun-avatar.md | q58-complete | High | compelling | Tuk promises to walk the villagers to the crater and never does | fixed | 2026-10-22 |
| SR-20261022-14 | 01-side-stories.md | s20-complete | High | compelling | Tilly's note in her welly never pays off, though Hazel is home by S20 | fixed | 2026-10-22 |
| SR-20261022-15 | 03-fun-bean.md | q24-desks | High | theme | Q24 is about cheating but nobody names it; give Mrs Inkwell the line | fixed | 2026-10-22 |
| SR-20261022-16 | 00-campaign.md | c9-close | High | follow | Moss's plan adds four rules in twenty lines; end on a plain recap | fixed | 2026-10-22 |
| SR-20261022-17 | 01c-side-stories-s23-s31.md | s27-tam | High | continuity | Two characters called Tam (S27's stable lad, S31's seven-year-old) | fixed | 2026-10-22 |
| SR-20261022-18 | 01c-side-stories-s23-s31.md | s24-stowaway | High | follow | Tilly calls Hazel "Gran" with no explanation | fixed | 2026-10-22 |
| SR-20261022-19 | 02-fun-python.md | q09-mother | High | follow | Mother Brindle is Barty's Keeper, so "I'm only his mother" confuses | fixed | 2026-10-22 |
| SR-20261022-20 | 05-fun-avatar.md | q50-open, q65-tiles | High | follow | Kaito turns up in Q50 and Q65 before Q64 has introduced him | fixed | 2026-10-22 |
| SR-20261022-21 | 20a-edu-sprout-campaign.md | c10-bramble | High | follow | Bramble, her baby and Fern's old Nubbin pile up in three lines | fixed | 2026-10-22 |
| SR-20261022-22 | 20a-edu-sprout-campaign.md | c1-letter | High | follow | "Gran made you say the rules back at the gate" refers to a scene that never plays | fixed | 2026-10-22 |
| SR-20261022-23 | 20a-edu-sprout-campaign.md | c4-tale-2 | High | child-read | Four wardens plus "White Year" and "Heartstone" in one sprout scene | fixed | 2026-10-22 |
| SR-20261022-24 | 20a-edu-sprout-campaign.md | c12-foot-secret | High | theme | Gran's quiet goodbye is followed by a safety notice about worrying secrets | fixed | 2026-10-22 |
| SR-20261022-25 | 20a-edu-sprout-campaign.md | batch (choice feedback lines) | High | child-read | 124 sprout lines over the 14-word cap, all choice feedback; split them | fixed | 2026-10-22 |
| SR-20261022-26 | 21a-edu-reader-campaign.md | c2-open | High | follow | Marina's "she owes me plums" reads as Sparks, and the lesson inherits it | fixed | 2026-10-22 |
| SR-20261022-27 | 21a-edu-reader-campaign.md | c8-close | High | follow | The 19-Nubbins, twelve-bowls sum relies on logic the scene never states | fixed | 2026-10-22 |
| SR-20261022-28 | 21a-edu-reader-campaign.md | batch (choice feedback lines) | High | child-read | 218 reader lines over 30 words, all choice feedback; split the science ones first | fixed | 2026-10-22 |
| SR-20261022-29 | 00-campaign.md | c6-open, c6-open-walked | Medium | humour | Dusty's grief stretch has no relief; a duck who also gets wet on purpose | fixed | 2026-10-22 |
| SR-20261022-30 | 03-fun-bean.md | q22-complete | Medium | humour | Q22 gives everything away and leaves Mr. Tweed without a payoff | fixed | 2026-10-22 |
| SR-20261022-31 | 03-fun-bean.md | q23-complete | Medium | humour | Q23 closes on a moral; end on a pumpkin queue instead | fixed | 2026-10-22 |
| SR-20261022-32 | 01-side-stories.md | s4-ledge | Medium | humour | The S4 ledge walk is all atmosphere; give Marina a dry guide's voice | fixed | 2026-10-22 |
| SR-20261022-33 | 01-side-stories.md | s10-letter | Medium | humour | Only the "told" variant pays off the shoelace; the secret one drops it | fixed | 2026-10-22 |
| SR-20261022-34 | 01c-side-stories-s23-s31.md | s25-name | Medium | humour | All three name choices get the same Nubbin reaction | fixed | 2026-10-22 |
| SR-20261022-35 | 04-fun-sunny.md | q45-complete | Medium | humour | Fitz bets on both sides in q45-hedge and the finale never mentions it | fixed | 2026-10-22 |
| SR-20261022-36 | 02-fun-python.md | q07-towers | Medium | humour | The tower-building montage is a summary; give the Nubbins a stone gag | fixed | 2026-10-22 |
| SR-20261022-37 | 05-fun-avatar.md | q65-game-done | Medium | humour | Q65 is all proverbs; let Kaito sleep through the game | fixed | 2026-10-22 |
| SR-20261022-38 | 20a-edu-sprout-campaign.md | c1-close, c8-ledge | Medium | humour | Sprouts can't read Fern's note, so the jumper joke dies; add sounds | fixed | 2026-10-22 |
| SR-20261022-39 | 01c-side-stories-s23-s31.md | s28-cart-stop | Medium | compelling | Both cart-stop choices end the same way | fixed | 2026-10-22 |
| SR-20261022-40 | 02-fun-python.md | q08-complete | Medium | theme | Make Frannie Reggie's wife; the aqueduct gag becomes a marriage | fixed | 2026-10-22 |
| SR-20261022-41 | 05-fun-avatar.md | q61-evidence | Medium | theme | The mayor is judge and jury; his wife objects from the front row | fixed | 2026-10-22 |
| SR-20261022-42 | 05-fun-avatar.md | q59-complete | Medium | theme | Captain Hake is left wedged in the rocks and the scroll promise hangs | fixed | 2026-10-22 |
| SR-20261022-43 | 00-campaign.md | c4-open, c8-open | Medium | compelling | Every branch of these two choices ends on the same lines | fixed | 2026-10-22 |
| SR-20261022-44 | 03-fun-bean.md | q24 intro (Mrs Inkwell, Buttons) | Medium | child-read | Two new names in one scene, and Buttons is easily mistaken for your Nubbin | fixed | 2026-10-22 |
| SR-20261022-45 | 01-side-stories.md | s6-register | Medium | follow | Hazel "reads" her ledger aloud while she is missing | fixed | 2026-10-22 |
| SR-20261022-46 | 01b-side-story-variants.md | s10-foot (plain) | Medium | compelling | The plain s10-foot offers a single choice, "Just me, Gran." | fixed | 2026-10-22 |
| SR-20261022-47 | 01c-side-stories-s23-s31.md | s30-wall | Medium | continuity | Moss says he never told you Hush's job; in S26 he did | fixed | 2026-10-22 |
| SR-20261022-48 | 04-fun-sunny.md | q32-intro | Medium | continuity | Inspector Thimble clashes with S23's echo Thimble, a canon new name | fixed | 2026-10-22 |
| SR-20261022-49 | 02-fun-python.md | q09-mother | Medium | child-read | "Your modesty is taken as a further sign" is irony a child takes literally | fixed | 2026-10-22 |
| SR-20261022-50 | 20a-edu-sprout-campaign.md | c2-corvin, c5-circuit, c9-partner, c10-bearer-moss, c7-cl… | Medium | child-read | The same "which word starts like Corvin?" quiz runs three times | fixed | 2026-10-22 |
| SR-20261022-51 | 20a-edu-sprout-campaign.md | c4-out, c10-moss-fades, c12-open | Medium | child-read | "Light something", "Don't be dramatic" and "That's me told!" are idioms | fixed | 2026-10-22 |
| SR-20261022-52 | 21a-edu-reader-campaign.md | c6-open, c6-open-walked | Medium | child-read | Dusty's "the worst thing anyone's ever said to me" is irony a 7-year-old may miss | fixed | 2026-10-22 |
| SR-20261022-53 | 21a-edu-reader-campaign.md | c10-moss-stays (and c6-close, end-epi-cinder-remembered) | Medium | theme | Six "which big idea is this?" asks read like a quiz | fixed | 2026-10-22 |
| SR-20261022-54 | 21a-edu-reader-campaign.md | c10-wisp | Medium | follow | "The one who carried the stone here" hides who it is in the Wisp route | fixed | 2026-10-22 |
| SR-20261022-55 | 03-fun-bean.md | q28-plan | Nice | humour | "Can I light it?" is already refused; make the refusal a card gag | fixed | 2026-10-22 |
| SR-20261022-56 | 00-campaign.md<br>01-side-stories.md<br>01c-side-stories-s23-s31.md<br>20a-edu-sprout-campaign.md<br>21a-edu-reader-campaign.md | cross-story | High | theme | Make Pixel and Byte the married couple the valley lacks (adds a canon fact) | fixed | 2026-10-22 |
| SR-20261022-57 | 00-campaign.md<br>01-side-stories.md<br>01c-side-stories-s23-s31.md | cross-story | Medium | humour | Marina's numbered rules grow across the ledge stories; each is about someone | fixed | 2026-10-22 |
| SR-20261022-58 | 00-campaign.md<br>01b-side-story-variants.md | cross-story | Medium | theme | The anonymous pie on Corvin's wall is Fern's, and its dish comes back on Sundays | fixed | 2026-10-22 |
| SR-20261022-59 | 00-campaign.md<br>01-side-stories.md<br>01b-side-story-variants.md<br>01c-side-stories-s23-s31.md | cross-story | Medium | humour | The valley's children skip Cinder's rhyme badly, with great enthusiasm, all year | fixed | 2026-10-22 |
| SR-20261022-60 | 01c-side-stories-s23-s31.md<br>01-side-stories.md | cross-story | Medium | character | Promote Granny Brock to the valley's recurring grump beside its sunny cast | fixed | 2026-10-22 |
| SR-20261022-61 | 08-mv-ironman.md | mv-im09-foom-done | Critical | continuity | IM9's "Make him promise" choice pays off with nothing; give it a line and a cost | fixed | 2026-10-22-2 |
| SR-20261022-62 | 10-mv-doom.md | mv-ff03-complete | Critical | compelling | FF3's fire-or-bluff choice runs the same Galactus scene; make Galactus answer each one | fixed | 2026-10-22-2 |
| SR-20261022-63 | 11-mv-ultron.md | mv-ul03-foundry | High | humour | Play the bait plan as Nubbin slapstick with Clint and Hank as straight men | fixed | 2026-10-22-2 |
| SR-20261022-64 | 11-mv-ultron.md | mv-ul09-titan | High | humour | Give the Vision one deadpan beat about the Nubbins before the fusion | fixed | 2026-10-22-2 |
| SR-20261022-65 | 12-mv-moonknight.md | mv-mk05-scene-done | High | humour | Add a treadmill gag to the tower climb and fix Flint's "on your own" contradiction | fixed | 2026-10-22-2 |
| SR-20261022-66 | 13-mv-spawn.md | mv-sp05-wynn | High | humour | Pay off the biscuit tin: one biscuit, a loud crunch, a stealth scare | fixed | 2026-10-22-2 |
| SR-20261022-67 | 13-mv-spawn.md | mv-sp03-hunted | High | humour | Give Overt-Kill one vain joke and let Bobby answer him back | fixed | 2026-10-22-2 |
| SR-20261022-68 | 09-mv-cap.md | mv-ca09-vault | High | humour | Lukin wants the animals; let them eat his pen and the cheque it was signing | fixed | 2026-10-22-2 |
| SR-20261022-69 | 09-mv-cap.md | mv-ca08-tower | High | humour | Pay off the Kingpin's "cakes for small guests" when the Nubbins eat them all | fixed | 2026-10-22-2 |
| SR-20261022-70 | 06-neopia-line.md | np09-razul | High | humour | Puncture Razul's "nobody in our family was ever brave" with a cat | fixed | 2026-10-22-2 |
| SR-20261022-71 | 08-mv-ironman.md | mv-im15-return | High | humour | Bring back Yinsen's four hummed notes in IM15 as a callback Tony feels | fixed | 2026-10-22-2 |
| SR-20261022-72 | 07-neopia-quests.md | nq27-complete | High | theme | Let the J + I carving touch Jhudora and Illusen after the Brain Tree remembers | fixed | 2026-10-22-2 |
| SR-20261022-73 | 11-mv-ultron.md | mv-ul05-family | High | theme | Hank and Jan sit bound and silent at Ultron's dinner; give Jan the first word | fixed | 2026-10-22-2 |
| SR-20261022-74 | 11-mv-ultron.md | mv-ul09-complete | High | theme | Hank says "Look after Jan" but Jan never hears it; close UL9 on her | fixed | 2026-10-22-2 |
| SR-20261022-75 | 06-neopia-line.md | np09-weapon | High | theme | Show Jazan and Nabile being married while they build the weapon | fixed | 2026-10-22-2 |
| SR-20261022-76 | 08-mv-ironman.md | mv-im07-siege | High | follow | Tony's relapse arrives unexplained; say he was sober and fell again | fixed | 2026-10-22-2 |
| SR-20261022-77 | 10-mv-doom.md | mv-ff09-after | High | follow | FF9's hint asks for visits "each day for three days"; make it one visit | fixed | 2026-10-22-2 |
| SR-20261022-78 | 09-mv-cap.md | mv-ca10-kobik | High | follow | Kobik's "always on the right side" hides the twist; say Steve was rewritten as Hydra | fixed | 2026-10-22-2 |
| SR-20261022-79 | 11-mv-ultron.md | mv-ul08-ruins | High | follow | Logan's time jump has no machine and the "other Logan" baffles; name both | fixed | 2026-10-22-2 |
| SR-20261022-80 | 12-mv-moonknight.md | mv-mk02-statue | High | follow | Step says bring Marlene and Frenchie, but the scene shows Marc alone; bring them in | fixed | 2026-10-22-2 |
| SR-20261022-81 | 12-mv-moonknight.md | mv-mk06-god | High | follow | The asylum melts into Khonshu's sand with no cause; show the walls peel | fixed | 2026-10-22-2 |
| SR-20261022-82 | 10-mv-doom.md | mv-ff02-chest | High | follow | Show where the gems went: Reed tips them back into the bay and fills the chest with chain | fixed | 2026-10-22-2 |
| SR-20261022-83 | 10-mv-doom.md | mv-ff05-university | High | follow | Reed and Ben appear in Doom's past with no explanation; pull them through the rift | fixed | 2026-10-22-2 |
| SR-20261022-84 | 06-neopia-line.md | np09-nabile | High | follow | Jazan's proposal reads as smug; show he hates asking, so the stakes are clear | fixed | 2026-10-22-2 |
| SR-20261022-85 | 13-mv-spawn.md | mv-sp08-cain | High | follow | SP8 step 2 sends the player to the alley, but the scene is on Cogliostro's hill | fixed | 2026-10-22-2 |
| SR-20261022-86 | 08-mv-ironman.md | mv-im09-complete | High | pacing | "His hands are gone" is gore in a cosy game; keep the loss, lose the wound | fixed | 2026-10-22-2 |
| SR-20261022-87 | 20b-edu-sprout-stories.md [S1 .. S17] | s1-cinder | High | child-read | Say what Cinder did and what it cost, so the gentle-hug lesson follows from it | fixed | 2026-10-22-2 |
| SR-20261022-88 | 20b-edu-sprout-stories.md [S1 .. S17] | s2-night | High | child-read | Swap "he" and "her" for Wisp and Sable, and make "kind, not good" concrete | fixed | 2026-10-22-2 |
| SR-20261022-89 | 20b-edu-sprout-stories.md [S1 .. S17] | s7-unverified | High | follow | Byte's "loved enough becomes Eternal" needs two unknown ideas; make it a cupful | fixed | 2026-10-22-2 |
| SR-20261022-90 | 21b-edu-reader-stories.md [S1 .. S11] | s6-whistle | High | pacing | Two lessons break Ash's three-beat turn; move them to the duck scene | fixed | 2026-10-22-2 |
| SR-20261022-91 | 21b-edu-reader-stories.md [S1 .. S11] | s10-letter | High | pacing | No letter-format lesson after Gran's last letter, and no sum inside her goodbye | fixed | 2026-10-22-2 |
| SR-20261022-92 | 21b-edu-reader-stories.md [S1 .. S11] | s9-trowel | High | follow | Cut "fourth shard" and "buyers" from Gran's story and keep her jokes | fixed | 2026-10-22-2 |
| SR-20261022-93 | 21b-edu-reader-stories.md [S1 .. S11] | s3-stands | High | child-read | Split Sparks's one breathless backstory line, and tag Corvin when he's first named | fixed | 2026-10-22-2 |
| SR-20261022-94 | 11-mv-ultron.md | mv-ul10-final | Medium | humour | Break Ultron's four-line speech with a Nubbin who sits down on it | fixed | 2026-10-22-2 |
| SR-20261022-95 | 13-mv-spawn.md | mv-sp04-cog | Medium | humour | Make Cogliostro dodge the age question with oranges, and cut one Hellspawn line | fixed | 2026-10-22-2 |
| SR-20261022-96 | 08-mv-ironman.md | mv-im08-vault | Medium | humour | The Guardsman's authority is Tony's own label; add a Nubbin on the lever | fixed | 2026-10-22-2 |
| SR-20261022-97 | 10-mv-doom.md | mv-ff03-worldship | Medium | humour | The Nubbin pokes the weapon a god fears; Johnny panics politely | fixed | 2026-10-22-2 |
| SR-20261022-98 | 10-mv-doom.md | mv-ff10-fall | Medium | humour | Ben has worn the FF2 pirate hat to occupied Wakanda; T'Challa notices | fixed | 2026-10-22-2 |
| SR-20261022-99 | 06-neopia-line.md | np05-orb | Medium | humour | Two knights and a Darigan soldier find they are holding the same ladder | fixed | 2026-10-22-2 |
| SR-20261022-100 | 06-neopia-line.md | np02-monoceraptor | Medium | humour | Make Taelia fussy about her ice so the Lupe can be long-suffering | fixed | 2026-10-22-2 |
| SR-20261022-101 | 07-neopia-quests.md | nq30-pieces | Medium | humour | Cut one of two sneeze lines and bring back the Grundo, who wants no details | fixed | 2026-10-22-2 |
| SR-20261022-102 | 20b-edu-sprout-stories.md [S1 .. S17] | s5-cliff | Medium | humour | Turn Dusty's age fibs into a "Tap, tap!" refrain the child joins | fixed | 2026-10-22-2 |
| SR-20261022-103 | 20b-edu-sprout-stories.md [S1 .. S17] | s4-sluice | Medium | humour | The freeze game needs a Nubbin who can't freeze | fixed | 2026-10-22-2 |
| SR-20261022-104 | 07-neopia-quests.md | nq29-ask | Medium | theme | Give the Meridell Farmer a wife who would rather the Turmaculus stayed asleep | fixed | 2026-10-22-2 |
| SR-20261022-105 | 10-mv-doom.md | mv-ff09-doom | Medium | theme | Doom's lost love and Reed's daughter share the name Valeria; let him say so | fixed | 2026-10-22-2 |
| SR-20261022-106 | 09-mv-cap.md | mv-ca03-plane | Medium | follow | Bucky's "sore about the glue" has no set-up; tell the glue story in the line before | fixed | 2026-10-22-2 |
| SR-20261022-107 | 12-mv-moonknight.md | mv-mk01-hire | Medium | follow | Say who the Committee is in MK1, and who Gena and Crawley are in MK3 | fixed | 2026-10-22-2 |
| SR-20261022-108 | 13-mv-spawn.md | mv-sp06-crown | Medium | pacing | Give Angela's death a pause before the throne scene starts | fixed | 2026-10-22-2 |
| SR-20261022-109 | 10-mv-doom.md | mv-ff06-complete | Medium | continuity | Franklin's "a little one with me" is wrong when the Nubbins were held back | fixed | 2026-10-22-2 |
| SR-20261022-110 | 20b-edu-sprout-stories.md [S1 .. S17] | s15-jackpot | Medium | child-read | Swap "one in ten" for fingers, keep the poem joke, and stagger S15's new names | fixed | 2026-10-22-2 |
| SR-20261022-111 | 20b-edu-sprout-stories.md [S1 .. S17] | s11-beetle | Medium | child-read | "The postman" and "SCARED. And then: FAIR." are metaphor and irony for 3 to 6 | fixed | 2026-10-22-2 |
| SR-20261022-112 | 20b-edu-sprout-stories.md [S1 .. S17] | s17-complete | Medium | follow | Say who lifts you home and why the cloak matters | fixed | 2026-10-22-2 |
| SR-20261022-113 | 21b-edu-reader-stories.md [S1 .. S11] | s1-ask | Medium | follow | "Twenty-two years?" still opens the reader band's S1 with nothing before it | fixed | 2026-10-22-2 |
| SR-20261022-114 | 21b-edu-reader-stories.md [S1 .. S11] | s7-unverified | Medium | child-read | Spell out the Cinder callbacks in S7 and S11 for readers who skipped S1 | fixed | 2026-10-22-2 |
| SR-20261022-115 | 21b-edu-reader-stories.md [S1 .. S11] | s5-tree-ask | Medium | pacing | Thin the lesson stacks in S5's tree and S8's ring of roots | fixed | 2026-10-22-2 |
| SR-20261022-116 | 08-mv-ironman.md<br>09-mv-cap.md<br>10-mv-doom.md<br>11-mv-ultron.md<br>12-mv-moonknight.md<br>13-mv-spawn.md | cross-story | High | humour | Running gag: every Multiverse line gets the Nubbins' name wrong, until Doom | fixed | 2026-10-22-2 |
| SR-20261022-117 | 08-mv-ironman.md<br>10-mv-doom.md<br>11-mv-ultron.md | cross-story | High | theme | Three married couples as the Multiverse's warm, bickering spine | fixed | 2026-10-22-2 |
| SR-20261022-118 | 10-mv-doom.md<br>11-mv-ultron.md | cross-story | High | theme | Plant Doom's trust at FF9's children's table and pay it off in UL10 | fixed | 2026-10-22-2 |
| SR-20261022-119 | 06-neopia-line.md<br>07-neopia-quests.md | cross-story | Medium | character | A weary Neopian Times reporter as Neopia's recurring straight man | fixed | 2026-10-22-2 |
| SR-20261022-120 | 20b-edu-sprout-stories.md [S1 .. S17]<br>21b-edu-reader-stories.md [S1 .. S11] | cross-story | Medium | theme | Say Pixel and Byte are married in both Learning Grove bands (canon 38) | fixed | 2026-10-22-2 |
| SR-20261022-121 | learning/side/S15/reader.md | s15-odds-board | Critical | continuity | Pip spent all forty Shells on four eggs, so "ten Shells left" is wrong on every branch | fixed | 2026-10-22-3 |
| SR-20261022-122 | learning/side/S15/reader.md | s15-tally | Critical | follow | "Out by three point three" is wrong maths; say what is divided by what | fixed | 2026-10-22-3 |
| SR-20261022-123 | learning/side/S14/reader.md | s14-sparks | High | follow | "She's gone off somewhere" reads as Hazel; name Tilly, cut the metaphor quiz, trim the info dump | fixed | 2026-10-22-3 |
| SR-20261022-124 | learning/side/S14/sprout.md | s14-sparks | High | follow | Say aloud why the dragon is Hazel, and send the child to find Tilly by name | fixed | 2026-10-22-3 |
| SR-20261022-125 | learning/side/S12/reader.md | s12-complete | High | child-read | Say plainly that the Queen-Mother dies, gently, and turn the "chorus" line into a callback | fixed | 2026-10-22-3 |
| SR-20261022-126 | learning/side/S13/sprout.md | s13-level3 | High | child-read | "Won't start again" sits beside a stuck wheel that does start again; split the two | fixed | 2026-10-22-3 |
| SR-20261022-127 | learning/side/S18/sprout.md | s18-fossils | High | child-read | A Nubbin named Fossil, right after finding fossils, confuses sprouts; name it, then grieve | fixed | 2026-10-22-3 |
| SR-20261022-128 | learning/side/S18/sprout.md<br>learning/side/S18/reader.md | s18-stars | High | follow | Drop "don't make it a moment", and ask the reader quiz only after Nova says she carried the rock | fixed | 2026-10-22-3 |
| SR-20261022-129 | learning/side/S18/reader.md | s18-shore | High | child-read | The tide quiz marks "17 o'clock" wrong and then tells the child it's right | fixed | 2026-10-22-3 |
| SR-20261022-130 | learning/side/S13/sprout.md<br>learning/side/S13/reader.md | s13-level3, s13-key | High | follow | Say what Hazel's notebook tells you, and drop "after the Hollow" | fixed | 2026-10-22-3 |
| SR-20261022-131 | learning/side/S13/reader.md | s13-letter, s13-letter-nomoss | High | pacing | Let Aldous's letter run unbroken, name Hazel's Grove, and say his apology plainly | fixed | 2026-10-22-3 |
| SR-20261022-132 | learning/side/S17/reader.md | s17-hatching | High | humour | Nova promises to be on the cliff path "by accident, about nine"; make her turn up | fixed | 2026-10-22-3 |
| SR-20261022-133 | learning/side/S14/reader.md | s14-tears | High | pacing | Cut the "loudest thing" quiz; let the hug and the tea towels follow the tears at once | fixed | 2026-10-22-3 |
| SR-20261022-134 | learning/side/S14/sprout.md | s14-bog, s14-tower, s14-lair, s14-table | High | humour | Make Byte's points a countdown sprouts can shout: eight, seven, six, five | fixed | 2026-10-22-3 |
| SR-20261022-135 | learning/side/S12/reader.md | s12-queen | High | child-read | "Don't tell the we" turns a pronoun into a noun at the key choice; say it plainly | fixed | 2026-10-22-3 |
| SR-20261022-136 | learning/side/S18/reader.md | s18-barn, s18-night-finds, s18-complete | High | child-read | Explain "in principle" once, so its two callbacks land for 7-year-olds | fixed | 2026-10-22-3 |
| SR-20261022-137 | learning/side/S12/reader.md | s12-dark | High | humour | Pay off "its wings buzz whenever anyone speaks" while Luna bares her soul | fixed | 2026-10-22-3 |
| SR-20261022-138 | learning/side/S15/reader.md<br>learning/side/S16/reader.md | s15-jackpot, s16-yard | Medium | follow | "The Circuit's mark" and "no Circuit man" need Corvin's name once each | fixed | 2026-10-22-3 |
| SR-20261022-139 | learning/side/S18/reader.md | s18-barn | Medium | continuity | "Two days after the rain on the hill" hides Fossil's death; say it in the story | fixed | 2026-10-22-3 |
| SR-20261022-140 | learning/side/S18/sprout.md<br>learning/side/S18/reader.md | s18-heart | Medium | child-read | Say what Hazel's egg book is, and make "where a valley remembers" concrete for sprouts | fixed | 2026-10-22-3 |
| SR-20261022-141 | learning/side/S13/sprout.md<br>learning/side/S13/reader.md | s13-letter, s13-letter-nomoss | Medium | child-read | "Some things end with the person" is an idiom; tie the burn choice to Aldous's own stove | fixed | 2026-10-22-3 |
| SR-20261022-142 | learning/side/S17/reader.md | s17-nest | Medium | follow | An empty "…" and "That number keeps turning up" read as a broken line | fixed | 2026-10-22-3 |
| SR-20261022-143 | learning/side/S17/reader.md | s17-wild | Medium | child-read | Two Luna lines drop their meaning or their subject; make them plain sentences | fixed | 2026-10-22-3 |
| SR-20261022-144 | learning/side/S14/reader.md | s14-toad | Medium | child-read | Byte's "two, two, two… forever" needs decimals; let the lesson reveal the twos | fixed | 2026-10-22-3 |
| SR-20261022-145 | learning/side/S14/sprout.md | s14-tower, s14-toad | Medium | humour | "Tax on paying the tax" and "the Toad does feelings" are too hard for sprouts | fixed | 2026-10-22-3 |
| SR-20261022-146 | learning/side/S14/reader.md | s14-bog | Medium | pacing | The dice-totals quiz splits "your sword is now a sandwich" from "What KIND of sandwich?" | fixed | 2026-10-22-3 |
| SR-20261022-147 | learning/side/S16/reader.md | s16-complete | Medium | continuity | "Moss is old and fading" states a campaign state the player may not have, and saddens the close | fixed | 2026-10-22-3 |
| SR-20261022-148 | learning/side/S16/reader.md | s16-roster | Medium | pacing | Two lessons back to back; cut the second waterwheel notice, keep its best line as story | fixed | 2026-10-22-3 |
| SR-20261022-149 | learning/side/S12/reader.md | s12-follow | Medium | child-read | The "do" lesson tells children a real fork buzzes harder facing a sound; use their ears | fixed | 2026-10-22-3 |
| SR-20261022-150 | learning/side/S12/reader.md | s12-settled | Medium | humour | Pay off "Don't walk into the stream. Not me. Other people." | fixed | 2026-10-22-3 |
| SR-20261022-151 | learning/side/S18/sprout.md<br>learning/side/S18/reader.md | s18-star-finds | Medium | humour | Fact pile-up on the hill; let a shooting star send Delve under his hat | fixed | 2026-10-22-3 |
| SR-20261022-152 | learning/side/S18/sprout.md | s18-door | Medium | humour | Show why the barn needs Shells, and swap "Probably" for a worried hat | fixed | 2026-10-22-3 |
| SR-20261022-153 | learning/side/S13/reader.md | s13-level2 | Medium | humour | Give the annoyed eels a culprit before the chalk marks turn the scene grave | fixed | 2026-10-22-3 |
| SR-20261022-154 | learning/side/S13/reader.md | s13-desk | Medium | humour | Four heavy lessons from desk to letter; give Tobin one dry beat with the chair | fixed | 2026-10-22-3 |
| SR-20261022-155 | learning/side/S13/reader.md | s13-level1 | Medium | humour | "Very organised" rats should act out the sharing sum | fixed | 2026-10-22-3 |
| SR-20261022-156 | learning/side/S16/reader.md | s16-bell | Medium | humour | "Output's going to be awful" said happily is irony; let Brisk be shocked at himself | fixed | 2026-10-22-3 |
| SR-20261022-157 | learning/side/S16/reader.md | s16-shadow | Medium | humour | Escalate Brisk's forty clipboards with Clover as the straight man | fixed | 2026-10-22-3 |
| SR-20261022-158 | learning/side/S13/sprout.md | s13-level1 | Medium | humour | The rats are "very tidy" and do nothing; give one a flour sneeze | fixed | 2026-10-22-3 |
| SR-20261022-159 | learning/side/S13/sprout.md | s13-sluice | Medium | humour | "Marina could swim in soup" is a non-sequitur for sprouts; act it out instead | fixed | 2026-10-22-3 |
| SR-20261022-160 | learning/side/S13/sprout.md | s13-wheelpit, s13-key, s13-complete | Medium | humour | Let the Sock of Nobody Knows Where keep turning up, so sprouts can shout "The sock!" | fixed | 2026-10-22-3 |
| SR-20261022-161 | learning/side/S13/sprout.md | s13-desk | Medium | child-read | "Never once does it say rest" is abstract; show the missing bed, and let Tobin yawn | fixed | 2026-10-22-3 |
| SR-20261022-162 | learning/side/S15/reader.md | s15-jackpot | Nice | character | Jackpot's lesson replies switch from capitals to lower case mid-reply; give the calm half to Byte | fixed | 2026-10-22-3 |
| SR-20261022-163 | learning/side/S16/reader.md | s16-question | Nice | child-read | Brisk's "trouble with being liked" line is too abstract for 7 to 10 | fixed | 2026-10-22-3 |
| SR-20261022-164 | learning/side/S14/reader.md | s14-tower | Nice | humour | The Tax Toad's tower is drawn on Sparks's chimney; let Sparks notice | fixed | 2026-10-22-3 |
| SR-20261022-165 | learning/side/S18/sprout.md | s18-complete | Nice | child-read | Sprouts clap "Cu-ra-tor" but are never told what it means | fixed | 2026-10-22-3 |
| SR-20261022-166 | learning/side/S18/sprout.md | s18-barn | Nice | humour | Stretch Delve's moth panic into a read-aloud stammer before the faint | fixed | 2026-10-22-3 |
| SR-20261022-167 | learning/side/S18/reader.md | s18-door | Nice | humour | The swallows lesson is a pure fact stop; give Delve one dry line about their cups | fixed | 2026-10-22-3 |
| SR-20261022-168 | learning/side/S14/sprout.md | s14-gate | Nice | continuity | Say Tilly doesn't open Hazel's note when she takes it out | fixed | 2026-10-22-3 |
| SR-20261022-169 | learning/side/S12/reader.md<br>learning/side/S14/sprout.md<br>learning/side/S14/reader.md<br>learning/side/S15/reader.md | cross-story | High | theme | Pixel and Byte are married (canon 38); say it in S14 and let her clocks and his lace bicker | fixed | 2026-10-22-3 |
| SR-20261022-170 | learning/side/S13/reader.md<br>learning/side/S14/reader.md<br>learning/side/S16/reader.md<br>learning/side/S17/reader.md<br>learning/side/S18/reader.md | cross-story | High | pacing | Reader band rule: no lesson between a set-up and its payoff, or inside a grave beat | fixed | 2026-10-22-3 |
| SR-20261022-171 | learning/side/S13/sprout.md<br>learning/side/S13/reader.md<br>learning/side/S14/sprout.md<br>learning/side/S14/reader.md<br>learning/side/S16/reader.md<br>learning/side/S18/sprout.md<br>learning/side/S18/reader.md | cross-story | Medium | humour | One wordless Nubbin thinks everything is supper, in every story | fixed | 2026-10-22-3 |
| SR-20261022-172 | learning/side/S12/reader.md<br>learning/side/S13/sprout.md<br>learning/side/S13/reader.md<br>learning/side/S17/reader.md<br>learning/side/S18/sprout.md<br>learning/side/S18/reader.md | cross-story | Medium | child-read | Use one plain, gentle death pattern across the Learning Grove side stories | fixed | 2026-10-22-3 |
| SR-20261022-173 | learning/side/S13/sprout.md<br>learning/side/S13/reader.md<br>learning/side/S14/reader.md<br>learning/side/S15/reader.md<br>learning/side/S16/reader.md | cross-story | Medium | follow | Tag each valley regular with five words on first appearance in a unit | fixed | 2026-10-22-3 |
| SR-20261022-174 | learning/side/S19/sprout.md | s19-warmth-sable | Critical | follow | The Sable route never says Moss has died; say it plainly before his pale light appears | fixed | 2026-10-22-4 |
| SR-20261022-175 | learning/side/S19/reader.md | s19-after, s19-fade, s19-fade-sable, s19-fade-alone | High | pacing | Take the two quizzes out of Cinder's last minutes; one of them offers "Funny." beside a death | fixed | 2026-10-22-4 |
| SR-20261022-176 | learning/side/S20/sprout.md<br>learning/side/S20/reader.md | s20-count | High | continuity | Let the blizzard blow for hours, so the morning game can end under night stars | fixed | 2026-10-22-4 |
| SR-20261022-177 | learning/side/S20/sprout.md<br>learning/side/S20/reader.md | s20-counters | High | humour | Gordon asks if the storm will hit him, so "hit by a whole sky" becomes a payoff | fixed | 2026-10-22-4 |
| SR-20261022-178 | learning/side/S21/sprout.md | s21-unveil, s21-moss, s21-log, s21-down | High | follow | Pixel's running count says "one" but never one what; make it "one bump" to match the lesson | fixed | 2026-10-22-4 |
| SR-20261022-179 | learning/side/S22/reader.md | s22-chimney, s22-chimney-top | High | pacing | A motive quiz splits "It hurts less." from "It's quicker."; move it after the choice | dropped | 2026-10-22-4 |
| SR-20261022-180 | learning/side/S22/reader.md | s22-ridge-cross | High | pacing | The crouching lesson splits the unit's best laugh, the flat voice and "You can SING?" | fixed | 2026-10-22-4 |
| SR-20261022-181 | learning/side/S24/sprout.md<br>learning/side/S24/reader.md | s24-bird-collector, s24-bird-collector-kept | High | follow | The collector routes hide why the bird shuns you; say the cause in plain words | fixed | 2026-10-22-4 |
| SR-20261022-182 | learning/side/S24/sprout.md | s24-nest-fed, s24-nest-fed-collector, s24-nest-waited, s24-nest-waited-collector | High | child-read | Say why a cage is bad for the chicks, not just "wild birds must stay free" | fixed | 2026-10-22-4 |
| SR-20261022-183 | learning/side/S19/sprout.md | s19-fade, s19-fade-sable, s19-fade-alone | High | child-read | "It isn't cold." / "Not this way." / "Not frozen still" is cryptic; tie it to the grey Nubbins | fixed | 2026-10-22-4 |
| SR-20261022-184 | learning/side/S19/reader.md | s19-hollow, s19-hollow-sable, s19-hollow-alone | High | follow | Moss says "…Cinder." and nobody says who she is; give her one line of who | fixed | 2026-10-22-4 |
| SR-20261022-185 | learning/side/S19/sprout.md | s19-question, s19-question-sable | High | humour | Give the main and Sable routes the "Badly" laugh the alone route already has | fixed | 2026-10-22-4 |
| SR-20261022-186 | learning/side/S19/sprout.md | s19-question, s19-question-sable, s19-question-alone | High | child-read | "Here. It's yours." and "forgiven by them" hand a child two unnamed things; name them | fixed | 2026-10-22-4 |
| SR-20261022-187 | learning/side/S22/sprout.md | s22-chimney-top | High | child-read | "Somebody left… I always leave first. It hurts less." is too abstract; say it plainly | fixed | 2026-10-22-4 |
| SR-20261022-188 | learning/side/S20/sprout.md | s20-intel | High | humour | "Children are not bricks" lost its set-up; give Tilly the bricks line back | fixed | 2026-10-22-4 |
| SR-20261022-189 | learning/side/S20/sprout.md<br>learning/side/S20/reader.md | s20-declaration | High | follow | Tilly is only "Sparks's cousin"; name her in the narration, with a Bodge line for the variant | fixed | 2026-10-22-4 |
| SR-20261022-190 | learning/side/S20/sprout.md<br>learning/side/S20/reader.md | s20-blizzard, s20-count | High | follow | "Somebody small is crying" is never paid off; it was Wren, and her mitten was on her head | fixed | 2026-10-22-4 |
| SR-20261022-191 | learning/side/S21/sprout.md<br>learning/side/S21/reader.md | s21-ramp, s21-complete | High | continuity | Byte's "eleven Nubbins" can't be; the roster holds eight and the child counts eight | fixed | 2026-10-22-4 |
| SR-20261022-192 | learning/side/S24/reader.md | s24-camp | High | follow | Fairweather mentions her motto and never says it; it is Tilly's "The whole world's up here!" | fixed | 2026-10-22-4 |
| SR-20261022-193 | learning/side/S24/sprout.md<br>learning/side/S24/reader.md | s24-net, s24-whistle, s24-lights | High | pacing | Lessons sit inside the net throw, the whistle's punchline and the sunrise; move each after | fixed | 2026-10-22-4 |
| SR-20261022-194 | learning/side/S24/sprout.md | s24-camp | High | humour | Give Fairweather one deadpan beat: she looks at you through the wrong end of her telescope | fixed | 2026-10-22-4 |
| SR-20261022-195 | learning/side/S22/sprout.md<br>learning/side/S22/reader.md | s22-complete | High | humour | The squashed oatcakes are the ending's joke; make the Worry the silent culprit | fixed | 2026-10-22-4 |
| SR-20261022-196 | learning/side/S19/sprout.md | s19-question, s19-question-sable, s19-question-alone | Medium | theme | Show what "well" means against "safe", so it links to the Nubbins going still | fixed | 2026-10-22-4 |
| SR-20261022-197 | learning/side/S19/sprout.md<br>learning/side/S19/reader.md | s19-sit | Medium | humour | Break the long wait with a tummy growl and Marina's polite cough | fixed | 2026-10-22-4 |
| SR-20261022-198 | learning/side/S19/reader.md | s19-question, s19-question-sable, s19-question-alone | Medium | pacing | The theme quiz interrupts Cinder's "Well is better" and calls itself "the big idea" | dropped | 2026-10-22-4 |
| SR-20261022-199 | learning/side/S20/sprout.md<br>learning/side/S20/reader.md | s20-intel | Medium | child-read | Put the take-away numbers in the story before the lesson asks about them | fixed | 2026-10-22-4 |
| SR-20261022-200 | learning/side/S21/sprout.md<br>learning/side/S21/reader.md | s21-ramp | Medium | humour | Byte measures eleven times on the page, not just in the step hint and a lesson reply | fixed | 2026-10-22-4 |
| SR-20261022-201 | learning/side/S21/reader.md | s21-down | Medium | pacing | The asking-for-help lesson explains the moral before the "snail with doubts" laugh | fixed | 2026-10-22-4 |
| SR-20261022-202 | learning/side/S21/sprout.md | s21-help | Medium | humour | Show the wet cat and the duck tree with sounds, and give Fern a dry line | fixed | 2026-10-22-4 |
| SR-20261022-203 | learning/side/S24/sprout.md | s24-bird, s24-bird-collector, s24-bird-collector-kept | Medium | humour | Your Nubbin counts the buns, gets four, and glares at the bird | fixed | 2026-10-22-4 |
| SR-20261022-204 | learning/side/S24/sprout.md<br>learning/side/S24/reader.md | s24-lantern-corvin | Medium | follow | "It is Sunday, so Corvin is by the pond" explains nothing; bring Fern's pie dish | fixed | 2026-10-22-4 |
| SR-20261022-205 | learning/side/S19/reader.md | s19-warmth, s19-fade | Medium | follow | Gloss the White Year and the unmade stone, and name Fossil and the fourth lantern | fixed | 2026-10-22-4 |
| SR-20261022-206 | learning/side/S19/sprout.md | s19-climb | Medium | humour | Make the left-right joke physical: Moss faces you, and both point at the same rock | fixed | 2026-10-22-4 |
| SR-20261022-207 | learning/side/S19/sprout.md | s19-marina, s19-climb-alone | Medium | child-read | Keep Marina's "Lovely" but drop the irony a sprout takes literally | fixed | 2026-10-22-4 |
| SR-20261022-208 | learning/side/S20/sprout.md | s20-blizzard | Medium | humour | "Find a grown-up" in a storm: Pixel points out that today the grown-up is her | fixed | 2026-10-22-4 |
| SR-20261022-209 | learning/side/S20/reader.md | s20-complete | Medium | follow | "She can still do it" has no "she"; keep the figure unnamed but give the line a subject | fixed | 2026-10-22-4 |
| SR-20261022-210 | learning/side/S20/sprout.md | s20-complete | Medium | child-read | "So we could build one fort fast, when it mattered" is abstract for a sprout | fixed | 2026-10-22-4 |
| SR-20261022-211 | learning/side/S21/sprout.md<br>learning/side/S21/reader.md | s21-moss | Medium | follow | "He looks at you" right after Clank speaks; name the little grey one | fixed | 2026-10-22-4 |
| SR-20261022-212 | learning/side/S21/reader.md | s21-complete | Medium | humour | Pay off Byte's "One of them to a bucket" in his log at the end | fixed | 2026-10-22-4 |
| SR-20261022-213 | learning/side/S21/sprout.md | s21-log | Medium | child-read | "I bit a vicar" uses a word no sprout knows; make it a goose | fixed | 2026-10-22-4 |
| SR-20261022-214 | learning/side/S21/sprout.md | s21-shed | Medium | child-read | The scene hangs on "useful", a word too hard for the band; say "helping" | fixed | 2026-10-22-4 |
| SR-20261022-215 | learning/side/S22/sprout.md | s22-scree | Medium | humour | "It gets worse each time" is a grown-up joke; the Worry covers its ears instead | fixed | 2026-10-22-4 |
| SR-20261022-216 | learning/side/S22/sprout.md | s22-foot | Medium | humour | The Worry has a tiny rope too, and trips on it, just before it says "What if you slip?" | fixed | 2026-10-22-4 |
| SR-20261022-217 | learning/side/S22/sprout.md | s22-chimney | Medium | child-read | The soot pun needs a word a sprout lacks; keep the foot joke, lose the soot | fixed | 2026-10-22-4 |
| SR-20261022-218 | learning/side/S22/sprout.md | s22-ridge | Medium | follow | Tie the three stones to "I always go home", so the stakes are counted | fixed | 2026-10-22-4 |
| SR-20261022-219 | learning/side/S24/sprout.md | s24-rock | Medium | child-read | "I feel awful" gets no comfort in the sprout; add that a mistake doesn't make her bad | fixed | 2026-10-22-4 |
| SR-20261022-220 | learning/side/S24/reader.md | s24-home, s24-home-eternal | Medium | follow | The margin notes point at Atlas pages the child may not know; describe the stories instead | fixed | 2026-10-22-4 |
| SR-20261022-221 | learning/side/S24/reader.md | s24-home, s24-home-eternal | Medium | pacing | Three theme questions is one too many; turn s24-home's into a small doing task | fixed | 2026-10-22-4 |
| SR-20261022-222 | learning/side/S24/reader.md | s24-back-pages | Medium | follow | "I nearly told her" never says what; it was the doctor's news | fixed | 2026-10-22-4 |
| SR-20261022-223 | learning/side/S24/reader.md | s24-lantern-done | Medium | humour | The lesson reply explains the "light" pun; name it as a pun and let the line be funny | fixed | 2026-10-22-4 |
| SR-20261022-224 | learning/side/S24/sprout.md | s24-stowaway | Medium | humour | Reveal Tilly in pieces: one welly, another welly, then a cross girl | fixed | 2026-10-22-4 |
| SR-20261022-225 | learning/side/S19/sprout.md | s19-complete | Medium | child-read | Say Marina cried, gloss the Long-Grass lantern, and let the Nubbin heap snore | fixed | 2026-10-22-4 |
| SR-20261022-226 | learning/side/S19/sprout.md | s19-question-sable | Medium | pacing | Move the "s-s-s" sounds quiz out of Cinder's apology to Sable | fixed | 2026-10-22-4 |
| SR-20261022-227 | learning/side/S19/reader.md | s19-climb, s19-climb-sable, s19-climb-alone | Nice | child-read | "Takes your face right off" is an idiom a literal reader may take seriously | fixed | 2026-10-22-4 |
| SR-20261022-228 | learning/side/S20/sprout.md | s20-merge | Nice | child-read | The sprout never met the catapult; make the roof Tilly's big sticks | fixed | 2026-10-22-4 |
| SR-20261022-229 | learning/side/S20/reader.md | s20-declaration | Nice | humour | Explain "Or a grudge" through Gordon, who remembers every snowball | dropped | 2026-10-22-4 |
| SR-20261022-230 | learning/side/S21/reader.md | s21-complete | Nice | pacing | End on the beans and Mustard, not on a stated moral | fixed | 2026-10-22-4 |
| SR-20261022-231 | learning/side/S24/reader.md | s24-tea-moss-stayed | Nice | child-read | The coping lesson tells the child how to read Nova's joke; say it plainer | fixed | 2026-10-22-4 |
| SR-20261022-232 | learning/side/S24/reader.md | s24-rock | Nice | follow | "She was right there" follows Nova's "She's all right"; name Tilly | fixed | 2026-10-22-4 |
| SR-20261022-233 | learning/side/S22/sprout.md<br>learning/side/S22/reader.md<br>learning/side/S24/sprout.md<br>learning/side/S24/reader.md | cross-story | High | continuity | S22's Nova stays; S24's Nova is "always passing" and leaves. Make her live here and walk | fixed | 2026-10-22-4 |
| SR-20261022-234 | learning/side/S20/sprout.md<br>learning/side/S20/reader.md<br>learning/side/S21/sprout.md<br>learning/side/S21/reader.md | cross-story | High | theme | Pixel and Byte are married (canon 38); let S21's switch-off row and his dance show it | fixed | 2026-10-22-4 |
| SR-20261022-235 | learning/side/S19/sprout.md<br>learning/side/S24/sprout.md<br>learning/side/S24/reader.md | cross-story | Medium | child-read | One plain death pattern: S24 reader never says Hazel died; S19's Sable route never says Moss did | fixed | 2026-10-22-4 |
| SR-20261022-236 | learning/side/S19/sprout.md<br>learning/side/S19/reader.md<br>learning/side/S20/reader.md<br>learning/side/S21/sprout.md<br>learning/side/S21/reader.md<br>learning/side/S24/reader.md | cross-story | Medium | humour | Carry run 3's wordless supper Nubbin: it tries to eat a pebble, snow, Clank's nose, the buns | fixed | 2026-10-22-4 |
| SR-20261022-237 | learning/side/S19/reader.md<br>learning/side/S21/reader.md<br>learning/side/S24/reader.md | cross-story | Medium | pacing | Keep run 3's rule (no lesson between a set-up and its payoff); three more spots break it | fixed | 2026-10-22-4 |
| SR-20261022-238 | learning/side/S29/sprout.md<br>learning/side/S29/reader.md | s29-complete, s29-complete-sat, s29-complete-pencil | High | theme | Both bands drop Marina's rule six, "Come back."; give all three endings their canon heart line | fixed | 2026-10-22-5 |
| SR-20261022-239 | learning/side/S28/sprout.md<br>learning/side/S28/reader.md | s28-party | High | theme | Pixel and Byte share the party but never act married; give them the cake-stand and lace bicker | fixed | 2026-10-22-5 |
| SR-20261022-240 | learning/side/S29/sprout.md<br>learning/side/S29/reader.md | s29-brock-knock | High | humour | Granny Brock said "Bring cake. Don't ring the bell"; the return visit pays off neither | fixed | 2026-10-22-5 |
| SR-20261022-241 | learning/side/S25/sprout.md | s25-gap, s25-coda-wild-button, s25-coda-wild-bobble, s25-coda-wild-mister | High | follow | A child never links the little light, the vanished toy and the hopping wild Nubbin; hint it aloud | fixed | 2026-10-22-5 |
| SR-20261022-242 | learning/side/S29/sprout.md<br>learning/side/S29/reader.md | s29-turnback | High | follow | Dusty can't go home and neither band says why until supper; say it, keep the name for later | fixed | 2026-10-22-5 |
| SR-20261022-243 | learning/side/S27/reader.md | s27-wire, s27-tam | High | follow | "He doesn't like people in there" and "the first frost that isn't his" point at nobody; name Corvin | fixed | 2026-10-22-5 |
| SR-20261022-244 | learning/side/S27/sprout.md | s27-midnight | High | follow | The midnight lesson cites "a wrong thing, a long time ago" that the band never told | fixed | 2026-10-22-5 |
| SR-20261022-245 | learning/side/S28/sprout.md | s28-received | High | child-read | "Six. And you are one. Received!" means nothing to a 4-year-old, and it is the story's key word | fixed | 2026-10-22-5 |
| SR-20261022-246 | learning/side/S27/sprout.md | s27-words, s27-words-sold | High | humour | Let Spindle try to spin Byte's enormous word until it trips your Nubbin | fixed | 2026-10-22-5 |
| SR-20261022-247 | learning/side/S25/sprout.md | s25-wild | High | humour | The wild Nubbins only get described; show one hopping over the toy and waiting | fixed | 2026-10-22-5 |
| SR-20261022-248 | learning/side/S26/sprout.md | s26-linnet | High | child-read | "KEPT" and "Mind yourself, love" carry Linnet's whole complaint in irony and idiom | fixed | 2026-10-22-5 |
| SR-20261022-249 | learning/side/S26/sprout.md | s26-hush | High | follow | "Briar wanted the still Nubbins" opens the story's heart with an unexplained name and phrase | fixed | 2026-10-22-5 |
| SR-20261022-250 | learning/side/S26/sprout.md | s26-mum | High | humour | Linnet's mum arrives with nothing funny to say; restore the houseplant she posted out | fixed | 2026-10-22-5 |
| SR-20261022-251 | learning/side/S27/reader.md | s27-words, s27-words-sold | Medium | continuity | "When Bramble went" needs a tag, and it must say ran off, not died | fixed | 2026-10-22-5 |
| SR-20261022-252 | learning/side/S25/reader.md | s25-storm, s25-storm-nosable | Medium | pacing | Two lessons sit between the lightning on the toy and the comfort; fold the counting into the story | fixed | 2026-10-22-5 |
| SR-20261022-253 | learning/side/S25/sprout.md | s25-real | Medium | humour | Moss's "I'm not here" is irony a small child takes literally; turn it into the gag | fixed | 2026-10-22-5 |
| SR-20261022-254 | learning/side/S25/sprout.md | s25-hurt, s25-storm | Medium | child-read | "Sharp edges" is a metaphor the band then uses to describe Sable | fixed | 2026-10-22-5 |
| SR-20261022-255 | learning/side/S25/sprout.md | s25-fern | Medium | follow | The lesson says "on the floor", but Fern never says floor in this band | fixed | 2026-10-22-5 |
| SR-20261022-256 | learning/side/S25/sprout.md | s25-bundle | Medium | child-read | "For the rag cart" doesn't tell a child what letting the toy go means | fixed | 2026-10-22-5 |
| SR-20261022-257 | learning/side/S25/reader.md | s25-lantern | Medium | theme | The trust lesson praises keeping promises, but you never promised anything | fixed | 2026-10-22-5 |
| SR-20261022-258 | learning/side/S25/reader.md | s25-real, s25-bundle, s25-line | Medium | child-read | "Fender", "copper" and "range" are old kitchen words a 7-year-old won't know | fixed | 2026-10-22-5 |
| SR-20261022-259 | learning/side/S26/sprout.md | end-epi-garden-cold | Medium | follow | The cold epilogue never says why your Nubbins sit outside | fixed | 2026-10-22-5 |
| SR-20261022-260 | learning/side/S26/sprout.md | s26-lift-1 | Medium | child-read | "Like a little, rude generator" is a grown-up joke the Sprout band can't follow | fixed | 2026-10-22-5 |
| SR-20261022-261 | learning/side/S26/sprout.md | s26-tobin-bench, s26-tobin-bench-cellar | Medium | humour | Make Tobin's rose-and-worry saying a picture a child can laugh at | fixed | 2026-10-22-5 |
| SR-20261022-262 | learning/side/S26/reader.md | s26-tobin-finds | Medium | follow | "It ends on a Thursday" has nothing for "it" to point at | fixed | 2026-10-22-5 |
| SR-20261022-263 | learning/side/S26/reader.md | s26-moss-wall | Medium | humour | "Worth the wear" is a puzzle; make Moss's reply plain and dry | fixed | 2026-10-22-5 |
| SR-20261022-264 | learning/side/S26/reader.md | s26-mum | Medium | child-read | Mum's "Dad says" reads as a new character | fixed | 2026-10-22-5 |
| SR-20261022-265 | learning/side/S26/reader.md | s26-inside | Medium | humour | The grey-garden scene has no smile; call back the robin that "hired" you | fixed | 2026-10-22-5 |
| SR-20261022-266 | learning/side/S27/sprout.md | s27-first-night | Medium | follow | "Spindle has work to do" never says the work is writing Nine's name | fixed | 2026-10-22-5 |
| SR-20261022-267 | learning/side/S27/sprout.md<br>learning/side/S27/reader.md | s27-show | Medium | humour | Your Nubbin is absent from the Show; let it mistake the rosettes for sweets | fixed | 2026-10-22-5 |
| SR-20261022-268 | learning/side/S27/sprout.md | s27-odd-things | Medium | child-read | "Frost does odd things" is Corvin's sarcasm, and a child will believe it | fixed | 2026-10-22-5 |
| SR-20261022-269 | learning/side/S27/sprout.md | s27-home | Medium | follow | "That's what I paid" doesn't tell a child what the choice is | fixed | 2026-10-22-5 |
| SR-20261022-270 | learning/side/S28/sprout.md | s28-bath | Medium | humour | Escalate the flood with Parcel bowing to each thing that gets wet | fixed | 2026-10-22-5 |
| SR-20261022-271 | learning/side/S28/sprout.md | s28-for-byte | Medium | follow | The H lesson makes the child say "Hazel" just before the choice to keep it secret | fixed | 2026-10-22-5 |
| SR-20261022-272 | learning/side/S28/sprout.md | s28-on-the-step | Medium | theme | Gran's illness jumps straight into a party; give the child a breath of comfort first | fixed | 2026-10-22-5 |
| SR-20261022-273 | learning/side/S28/sprout.md<br>learning/side/S28/reader.md | s28-bench, s28-bench-bramble | Medium | pacing | The warm-layers lesson splits "Gran Hazel is home" from Parcel's bow | fixed | 2026-10-22-5 |
| SR-20261022-274 | learning/side/S28/sprout.md<br>learning/side/S28/reader.md | s28-null-minder | Medium | child-read | "On a timetable", "It's borrowed" and "the Minder" don't say what is wrong for Null | fixed | 2026-10-22-5 |
| SR-20261022-275 | learning/side/S28/sprout.md | s28-complete-unverified | Medium | follow | "We missed it" in Byte's list doesn't say missed what | fixed | 2026-10-22-5 |
| SR-20261022-276 | learning/side/S28/reader.md | s28-kitchen | Medium | pacing | The kitchen opens on a pectin lesson before anyone speaks | fixed | 2026-10-22-5 |
| SR-20261022-277 | learning/side/S28/reader.md | s28-complete | Medium | child-read | The closing theme question is a quiz with a joke wrong answer, after another lesson | fixed | 2026-10-22-5 |
| SR-20261022-278 | learning/side/S29/sprout.md | s29-lessons | Medium | humour | Restore the rowing-backwards gag the band cut | fixed | 2026-10-22-5 |
| SR-20261022-279 | learning/side/S29/sprout.md | s29-ford, s29-ford-ribbon, s29-ford-bell | Medium | child-read | "Must've been the early start" hides why Marina cries | fixed | 2026-10-22-5 |
| SR-20261022-280 | learning/side/S29/reader.md | s29-launch | Medium | pacing | The forces lesson answers Dusty's trowel joke for Marina; give her the punchline | fixed | 2026-10-22-5 |
| SR-20261022-281 | learning/side/S29/reader.md | s29-fire, s29-turnback, s29-night-ribbon | Medium | child-read | "Idiot", three times, once about a baby otter, is harsh for the band | fixed | 2026-10-22-5 |
| SR-20261022-282 | learning/side/S29/reader.md | s29-island | Medium | child-read | "Kindly let off remembering it" doesn't tell a child that something was forgotten | fixed | 2026-10-22-5 |
| SR-20261022-283 | learning/side/S25/reader.md | s25-page-byte | Nice | humour | Give Byte's tally chart one deadpan row | fixed | 2026-10-22-5 |
| SR-20261022-284 | learning/side/S25/sprout.md<br>learning/side/S25/reader.md | s25-clank | Nice | follow | Remind the child that Clank is looking for a word before "Is Real the word?" | fixed | 2026-10-22-5 |
| SR-20261022-285 | learning/side/S26/reader.md | s26-snow | Nice | humour | Sharpen Tobin's panicked arrival with one boot and one slipper | fixed | 2026-10-22-5 |
| SR-20261022-286 | learning/side/S26/sprout.md | s26-race | Nice | humour | Mum races with her big bag still on | fixed | 2026-10-22-5 |
| SR-20261022-287 | learning/side/S27/sprout.md | s27-spring, s27-spring-wisp | Nice | humour | Let Wisp sulk, and keep the closing line in the narrator's "you" | fixed | 2026-10-22-5 |
| SR-20261022-288 | learning/side/S27/reader.md | s27-evening | Nice | humour | Point out that EVENING is spelled at eleven in the morning | fixed | 2026-10-22-5 |
| SR-20261022-289 | learning/side/S27/reader.md | s27-spring, s27-spring-wisp | Nice | follow | "The lantern shed window" in spring could mean the Circuit's shed | fixed | 2026-10-22-5 |
| SR-20261022-290 | learning/side/S28/reader.md | s28-eleven-seconds | Nice | humour | Tag Ember with a joke when Byte measures Parcel's stare against hers | fixed | 2026-10-22-5 |
| SR-20261022-291 | learning/side/S28/reader.md | s28-one-jar | Nice | pacing | The preserves lesson splits the pantry memory from "Some" / "How many?" | fixed | 2026-10-22-5 |
| SR-20261022-292 | learning/side/S29/sprout.md | s29-wildwood | Nice | child-read | "Dusty thought they saw" can read as other people seeing | fixed | 2026-10-22-5 |
| SR-20261022-293 | learning/side/S25/sprout.md<br>learning/side/S25/reader.md<br>learning/side/S27/sprout.md<br>learning/side/S27/reader.md | cross-story | High | theme | Pixel and Byte's marriage, by bicker, wherever Byte turns up alone (S25, S27) | fixed | 2026-10-22-5 |
| SR-20261022-294 | learning/side/S25/reader.md<br>learning/side/S27/reader.md<br>learning/side/S28/reader.md<br>learning/side/S29/sprout.md | cross-story | High | follow | Tag Hazel as "Gran" on first mention in each unit that leaves her bare | fixed | 2026-10-22-5 |
| SR-20261022-295 | learning/side/S29/sprout.md<br>learning/side/S26/sprout.md<br>learning/side/S26/reader.md | cross-story | Medium | humour | Continue the wordless Nubbin who thinks everything is supper (picnic, bulbs, rosettes) | fixed | 2026-10-22-5 |
| SR-20261022-296 | learning/side/S25/reader.md<br>learning/side/S29/reader.md | cross-story | Medium | continuity | Replace "the rain on the hill" with plain words for Fossil's death | fixed | 2026-10-22-5 |
| SR-20261022-297 | learning/side/S25/reader.md<br>learning/side/S26/reader.md<br>learning/side/S26/sprout.md | cross-story | Medium | humour | Run Moss's "I'm not here" as a gag from S25 into S26's walled garden | fixed | 2026-10-22-5 |
| SR-20261023-298 | learning/fun/avatar/sprout.md<br>learning/fun/avatar/reader.md | q64-rehearse | Critical | follow | Say what Kaito did before Nalu says "I haven't forgotten what you did"; the trust has no stake | fixed | 2026-10-23 |
| SR-20261023-299 | learning/side/S30/sprout.md<br>learning/side/S30/reader.md | s30-wall | Critical | follow | Moss's Hush speech has dead Nubbins seeing her and shivering; say plainly who was dying | fixed | 2026-10-23 |
| SR-20261023-300 | learning/side/S31/sprout.md | s31-wall | High | follow | Set up Tam's "never say if" rule so the "if" panic and the SEAT FOR A KEEPER (IF) sign land | fixed | 2026-10-23 |
| SR-20261023-301 | learning/fun/avatar/sprout.md<br>learning/fun/avatar/reader.md | q51-desert | High | continuity | Nalu makes the "nothing strange" rule, then credits Tuk with it; give the rule to Tuk | fixed | 2026-10-23 |
| SR-20261023-302 | learning/side/S31/sprout.md<br>learning/side/S31/reader.md | s31-shape | High | pacing | The lesson sits between the shape rising and "It's your Nubbin"; move it after the reveal | fixed | 2026-10-23 |
| SR-20261023-303 | learning/fun/avatar/sprout.md<br>learning/fun/avatar/reader.md | q57-night | High | humour | Plant Nalu's sneeze so Ma Reedy's "Spirits don't sneeze" is a callback, not a puzzle | fixed | 2026-10-23 |
| SR-20261023-304 | learning/side/S31/sprout.md | s31-guising | High | humour | "At each door they tell a joke" but no joke is told; give Ned one that goes wrong | fixed | 2026-10-23 |
| SR-20261023-305 | learning/fun/avatar/sprout.md | q58-mountain-done | High | follow | The "tell a grown-up" lesson precedes a cloud trick; show Tuk telling Aunt Wen first | fixed | 2026-10-23 |
| SR-20261023-306 | learning/fun/python/reader.md | q11-pop | High | pacing | The simile quiz plays after "a soft POP" and before we learn Gorbold is fine; move it after "Light!" | fixed | 2026-10-23 |
| SR-20261023-307 | learning/fun/avatar/sprout.md<br>learning/fun/avatar/reader.md | q56-bout | High | follow | The champion is labelled "Bao" and the lemur "Lumi" before either name is revealed | fixed | 2026-10-23 |
| SR-20261023-308 | learning/fun/bean/sprout.md | q28-plan | High | follow | Plant Mr. Tweed's unsent TEA card so "half the lane comes for tea" pays off his shyness | fixed | 2026-10-23 |
| SR-20261023-309 | learning/side/S30/sprout.md | s30-luna | High | humour | Give the quiet middle (hole to wall) one wordless Nubbin laugh at Luna's yawn | fixed | 2026-10-23 |
| SR-20261023-310 | learning/fun/avatar/sprout.md | q49-school | High | follow | "A new boy comes in" then Pemba speaks; say it is Pemba in disguise so "Kuzo" is a joke | fixed | 2026-10-23 |
| SR-20261023-311 | learning/side/S31/sprout.md | s31-long-grass | High | child-read | "Guisers" and "three little bats" read as real bats; say they are children in costume | fixed | 2026-10-23 |
| SR-20261023-312 | learning/side/S30/sprout.md | s30-fidget-hill | High | follow | Dusty's "Under your table. In a storm." pays off a table the sprout band never mentions | fixed | 2026-10-23 |
| SR-20261023-313 | learning/side/S30/sprout.md<br>learning/side/S30/reader.md | s30-blanket-ask | Medium | child-read | Clover says "kick the bucket" in a story about a death; change the verb | fixed | 2026-10-23 |
| SR-20261023-314 | learning/side/S30/reader.md | s30-shed | Medium | humour | Give the shed one escalating Fidget-counting gag before "Safe is not the same as well" | fixed | 2026-10-23 |
| SR-20261023-315 | learning/side/S30/sprout.md | s30-sill | Medium | child-read | Name Drizzle and Dimple on the sill, and cut Clover's "Not a cloud on her" idiom | fixed | 2026-10-23 |
| SR-20261023-316 | learning/side/S30/sprout.md | s30-sill | Medium | humour | Bring the reader band's bread-bin Flinch into the sprout kitchen | fixed | 2026-10-23 |
| SR-20261023-317 | learning/side/S30/sprout.md | s30-gone | Medium | child-read | "Gone back to where the happy was" is abstract; name the place she was happy with Fossil | fixed | 2026-10-23 |
| SR-20261023-318 | learning/side/S30/sprout.md | s30-complete | Medium | follow | Say whose mark is whose and who sent the parcel in the closing rubbing | fixed | 2026-10-23 |
| SR-20261023-319 | learning/side/S30/reader.md | s30-gone | Medium | pacing | Two lessons cut into the search: daylight before Clover speaks, light-speed mid-story | fixed | 2026-10-23 |
| SR-20261023-320 | learning/side/S30/reader.md | s30-after-clover | Medium | humour | Pay off Clover's "lift and push" gate gag in her after-story line | fixed | 2026-10-23 |
| SR-20261023-321 | learning/side/S31/sprout.md | s31-kick | Medium | child-read | Ivy's "Your witness was on your side" is a lawyer joke a 5-year-old can't follow | fixed | 2026-10-23 |
| SR-20261023-322 | learning/side/S31/sprout.md | s31-dusk | Medium | humour | Make Ivy's "opposite of you" costume joke one a 4-year-old can hear, with Ned as straight man | fixed | 2026-10-23 |
| SR-20261023-323 | learning/side/S31/sprout.md | s31-moss | Medium | child-read | Moss's double negative is hard to read aloud; tie it to the wind lesson that follows | fixed | 2026-10-23 |
| SR-20261023-324 | learning/side/S31/sprout.md | s31-complete | Medium | humour | "Moss sits very, very still" hides the acorn joke; give the sprout the reader's straight face | fixed | 2026-10-23 |
| SR-20261023-325 | learning/side/S31/sprout.md | s31-frost | Medium | child-read | "That's what the cold is!" is a leap; say the cold means he is close | fixed | 2026-10-23 |
| SR-20261023-326 | learning/side/S31/reader.md | s31-sincere | Medium | pacing | The fence-post maths lands between Tam stopping at the dark post and "This one." | fixed | 2026-10-23 |
| SR-20261023-327 | learning/fun/python/sprout.md | q02-complete | Medium | child-read | Show that Sir Dentwhistle minds, so "I never mind!" is a joke and not a lesson in denial | fixed | 2026-10-23 |
| SR-20261023-328 | learning/fun/python/sprout.md | q06-gate | Medium | follow | Say nobody is inside the rabbit, so "everyone looks at everyone" is a punchline | fixed | 2026-10-23 |
| SR-20261023-329 | learning/fun/python/sprout.md | q08-water | Medium | humour | Soak grumpy Reggie when the water arrives, before he starts filling his teapot | fixed | 2026-10-23 |
| SR-20261023-330 | learning/fun/python/sprout.md | q19-intro | Medium | child-read | The counting lesson names three runners before they appear; four new names in one scene | fixed | 2026-10-23 |
| SR-20261023-331 | learning/fun/python/sprout.md | q20-complete | Medium | humour | Keep the giant foot, but give it a silly beat so it is daft rather than scary at 4 | fixed | 2026-10-23 |
| SR-20261023-332 | learning/fun/python/reader.md | q04-gullwick | Medium | follow | A lesson reply calls the Run Nubbin "Trotwell" two scenes before its name is revealed | fixed | 2026-10-23 |
| SR-20261023-333 | learning/fun/python/reader.md | q11-intro | Medium | follow | Mr Crisp asks the steam question before we meet him or Gorbold; move the lesson after | fixed | 2026-10-23 |
| SR-20261023-334 | learning/fun/python/reader.md | q02-round1 | Medium | follow | The lesson's answer cites pink ears that only appear after the lesson | fixed | 2026-10-23 |
| SR-20261023-335 | learning/fun/python/reader.md | q15-six | Medium | pacing | Two lessons stack at the end of the shop scene; fold the subtraction into dialogue | fixed | 2026-10-23 |
| SR-20261023-336 | learning/fun/python/sprout.md<br>learning/fun/python/reader.md | q03-third | Medium | child-read | Idiom sweep: "smug as a cushion" (both bands) and Harrow's "cry for help" (reader Q10) | fixed | 2026-10-23 |
| SR-20261023-337 | learning/fun/bean/sprout.md | q29-complete | Medium | follow | Odette's "Two eggs, side by side… a pram!" needs a second egg, and "His letter" a letter | fixed | 2026-10-23 |
| SR-20261023-338 | learning/fun/bean/sprout.md | q21-complete | Medium | humour | The teeny bear Mr. Tweed gives you in Q21 never returns; make it a wordless running gag | fixed | 2026-10-23 |
| SR-20261023-339 | learning/fun/bean/sprout.md | q24-complete | Medium | humour | Give Mrs Inkwell one deadpan line at the handshake, and drop her "looking at you" idiom | fixed | 2026-10-23 |
| SR-20261023-340 | learning/fun/bean/reader.md | q26-complete | Medium | follow | "The first time in years he has needed the ruler" is too oblique for the loneliness payoff | fixed | 2026-10-23 |
| SR-20261023-341 | learning/fun/bean/reader.md | q23-wiggle | Medium | pacing | Two lessons interrupt the conducting build-up; move the half-of-90 maths after the pop | fixed | 2026-10-23 |
| SR-20261023-342 | learning/fun/avatar/sprout.md<br>learning/fun/avatar/reader.md | q54-complete | Medium | humour | Pay off Pian's wobbly spoon (sprout) and Tuk's "coming-back" boomerang (reader) | fixed | 2026-10-23 |
| SR-20261023-343 | learning/fun/avatar/sprout.md | q53-flattened | Medium | child-read | Tuk's "My pride is still down there" and Q62's "0 °C (32 °F)" are beyond ages 3 to 6 | fixed | 2026-10-23 |
| SR-20261023-344 | learning/fun/avatar/reader.md | q58-mountain | Medium | pacing | Three lessons in about thirty lines stall the volcano plan; move fast-or-slow change | fixed | 2026-10-23 |
| SR-20261023-345 | learning/side/S31/sprout.md | s31-ace-roof | Nice | humour | Let the rain-barrel splash land before the "arms out" pilot lesson | fixed | 2026-10-23 |
| SR-20261023-346 | learning/fun/python/reader.md | q17-splash | Nice | humour | The duck-oil fact is taught in Q3 and again in Q17; make the second a callback | fixed | 2026-10-23 |
| SR-20261023-347 | learning/fun/bean/reader.md | q27-hall | Nice | humour | Sharpen Warden Pryce's "Supervised" so a 7-year-old reads it as a joke, not an error | fixed | 2026-10-23 |
| SR-20261023-348 | learning/fun/avatar/reader.md | q47-complete | Nice | child-read | "A tunnel between two of your sections" is game talk; say it in Grove words | fixed | 2026-10-23 |
| SR-20261023-349 | learning/fun/avatar/reader.md | q50-open | Nice | follow | Say early that Kaito is Uncle Tenzo's nephew; "nephew" first appears halfway through Q50 | fixed | 2026-10-23 |
| SR-20261023-350 | learning/side/S31/sprout.md<br>learning/side/S31/reader.md | cross-story | High | continuity | Restore Granny Brock's quilt and soup (canon 42) and Tam's wrong skipping rhyme (canon 41) | fixed | 2026-10-23 |
| SR-20261023-351 | learning/side/S30/sprout.md<br>learning/side/S30/reader.md<br>learning/side/S31/sprout.md<br>learning/side/S31/reader.md | cross-story | High | theme | Show Pixel and Byte married by bickering at S31's party and in S30's Byte epilogue | fixed | 2026-10-23 |
| SR-20261023-352 | learning/fun/python/sprout.md<br>learning/fun/python/reader.md<br>learning/fun/avatar/sprout.md<br>learning/fun/avatar/reader.md | cross-story | High | theme | Fun-quest couples: say Frannie is Reggie's wife (Q8) and bring back Mrs Tibbs (Q61) | fixed | 2026-10-23 |
| SR-20261023-353 | learning/side/S30/reader.md<br>learning/side/S31/sprout.md<br>learning/side/S31/reader.md | cross-story | Medium | follow | First-mention tags for Sable and Briar where S30 and S31 use them bare | fixed | 2026-10-23 |
| SR-20261023-354 | multiverse/dragonball.md | mv-db03-desert | Critical | continuity | Bulma's trigger word is chosen in DB2 and never said again; use it in DB3 and DB5 | fixed | 2026-10-23-2 |
| SR-20261023-355 | multiverse/dragonball.md | mv-db19-road | Critical | continuity | The "Nubbins carry the balls" choice is never read, and DB19 to DB20 say "capsule case" anyway | fixed | 2026-10-23-2 |
| SR-20261023-356 | atlas/A02/sprout.md | a02-12-bones-done | High | follow | Monkey vanishes from the road with no line saying the monk sent him away | fixed | 2026-10-23-2 |
| SR-20261023-357 | atlas/A02/sprout.md | a02-15-snatch | High | follow | Plant the fake Monkey with one odd clue, and make Sandy's "Monkey is on the Mountain" clear | fixed | 2026-10-23-2 |
| SR-20261023-358 | multiverse/endgames.md | mv-e2-throne | High | follow | Say who is whose family before Valeria calls Doom "Father" | fixed | 2026-10-23-2 |
| SR-20261023-359 | expansions/E1.md | e1-square | High | continuity | Pell's "What did she say about me?" choice is never read; answer him, then pay it off at the end | fixed | 2026-10-23-2 |
| SR-20261023-360 | expansions/E2.md | e2-day11 | High | continuity | E2's two choices (e2-answer, e2-asked) are read by nothing; let Nova answer each at the end | fixed | 2026-10-23-2 |
| SR-20261023-361 | multiverse/dragonball.md | mv-db18-kami | High | follow | Kami says "if he dies, I die" one storyline after King Piccolo died | fixed | 2026-10-23-2 |
| SR-20261023-362 | fun/holmes.md | q76-complete | High | follow | Mr Holme becomes "Holmes" with no reason; give him the s as a joke, and drop "Sherlock" in Q83 | fixed | 2026-10-23-2 |
| SR-20261023-363 | atlas/A02/sprout.md | a02-19-turtle | High | follow | Sprout cut the turtle's crossing; say who he is and what he asked before he sinks | fixed | 2026-10-23-2 |
| SR-20261023-364 | fun/alice.md | q75-wake-mirror | High | continuity | The pack's one choice pays off weakly; show the small Nubbin in the mirror and coat endings | fixed | 2026-10-23-2 |
| SR-20261023-365 | multiverse/endgames.md | mv-e5-innervoice | High | compelling | Bo's "When did your kid last pick you?" ends TS12 and no line in E5 answers it | fixed | 2026-10-23-2 |
| SR-20261023-366 | multiverse/toystory.md | mv-ts09-sunnyside-done | High | humour | The toddler playtime is a three-line summary; play it, with Hamm and Rex as straight men | fixed | 2026-10-23-2 |
| SR-20261023-367 | multiverse/endgames.md | mv-e1-act | High | humour | E1 has no laugh before the courthouse; let the badge-eating Nubbin eat the important corner | fixed | 2026-10-23-2 |
| SR-20261023-368 | fun/holmes.md | q76-arrive | High | humour | Byte the sceptic has no entrance, and the plum-jam thief is never caught; make them one joke | fixed | 2026-10-23-2 |
| SR-20261023-369 | multiverse/endgames.md | mv-e6-aftertony | High | theme | Pepper's calendar gag (canon 45) never reaches Tony's ending; land it here | fixed | 2026-10-23-2 |
| SR-20261023-370 | multiverse/toystory.md | mv-ts09-plan | High | theme | The Potato Heads are the only married toys and never bicker; give them the spare-eye scene | fixed | 2026-10-23-2 |
| SR-20261023-371 | fun/holmes.md | q80-trail | High | theme | Pixel's tar is her own; let Byte, her husband, have told her so | fixed | 2026-10-23-2 |
| SR-20261023-372 | multiverse/endgames.md | mv-e2-complete | High | theme | Sue and Reed leave together with no couple beat; call back to the lab light from FF9 | fixed | 2026-10-23-2 |
| SR-20261023-373 | fun/alice.md | q71-witness | High | humour | The trial has no laugh before Alice's outburst; let the Hatter bite his teacup | fixed | 2026-10-23-2 |
| SR-20261023-374 | expansions/E1.md | e1-stall | High | compelling | Hazel's blue cloth is set up twice and never found; let a Nubbin find it at the festival | fixed | 2026-10-23-2 |
| SR-20261023-375 | atlas/A02/reader.md | a02-18-complete | High | humour | A maths lesson sits between "It was fourteen years." and "A very long lunch." | fixed | 2026-10-23-2 |
| SR-20261023-376 | atlas/A02/sprout.md | a02-06-seal-done | High | humour | Sprout pays off "India by lunch" but never sets it up | fixed | 2026-10-23-2 |
| SR-20261023-377 | atlas/A02/reader.md | a02-12-bones | High | humour | The 206-bones quiz lands on the grave bone reveal; give the fact to Pigsy as a joke | fixed | 2026-10-23-2 |
| SR-20261023-378 | atlas/A02/reader.md | a02-17-web | High | child-read | Turn the narrator's "Suppose…" maths set-ups into questions a character needs answered | fixed | 2026-10-23-2 |
| SR-20261023-379 | multiverse/dragonball.md | mv-db13-complete | Medium | humour | "Bulma borrowed it once" skips the best joke: a pig spent her wish on knickers | fixed | 2026-10-23-2 |
| SR-20261023-380 | multiverse/dragonball.md | mv-db14-crane | Medium | continuity | The four-star ball scatters in DB13 and is back in Goku's bag in DB15 with no word | fixed | 2026-10-23-2 |
| SR-20261023-381 | multiverse/dragonball.md | mv-db18-complete | Medium | theme | Bulma and Yamcha are a couple for ten storylines and never bicker on screen | fixed | 2026-10-23-2 |
| SR-20261023-382 | multiverse/dragonball.md | mv-db16-roshi | Medium | follow | The rice cooker becomes "the little jar", and "an orphan's father" reads backwards | fixed | 2026-10-23-2 |
| SR-20261023-383 | fun/alice.md | q70-off-with | Medium | follow | The Queen's "Off with their heads!" is never stopped; give the King his line from the book | fixed | 2026-10-23-2 |
| SR-20261023-384 | fun/alice.md | q70-roses | Medium | humour | The card-gardeners only whisper; let them blame each other out loud | fixed | 2026-10-23-2 |
| SR-20261023-385 | fun/alice.md | q72-intro | Medium | follow | Q71 ends on the bank and Q72 has Alice on your mantelpiece; say she came home with you | fixed | 2026-10-23-2 |
| SR-20261023-386 | fun/alice.md | q74-complete | Medium | follow | Humpty's voice "from a long way off" after the crash reads as a ghost to a child | fixed | 2026-10-23-2 |
| SR-20261023-387 | fun/holmes.md | q84-bog | Medium | continuity | The guide variant says "Dry boots at last", then Watson empties a boot | fixed | 2026-10-23-2 |
| SR-20261023-388 | fun/holmes.md | q77-door | Medium | follow | Holmes reads the knees of an "eager new assistant" the player has never met | fixed | 2026-10-23-2 |
| SR-20261023-389 | fun/holmes.md | q85-hives | Medium | pacing | Step 1 sets the hives on the bank, and step 2 carries them up the bank again | fixed | 2026-10-23-2 |
| SR-20261023-390 | fun/holmes.md | q81-complete | Medium | compelling | "Maybe it is just children" was the right guess; let Holmes say so | fixed | 2026-10-23-2 |
| SR-20261023-391 | fun/holmes.md | q83-rocket | Medium | follow | Nobody says why a shout of "Fire!" reveals the hiding place | fixed | 2026-10-23-2 |
| SR-20261023-392 | fun/hodja.md | q94-intro | Medium | humour | Byte's dead pan returns and Byte doesn't notice; let him notice, once | fixed | 2026-10-23-2 |
| SR-20261023-393 | fun/hodja.md | q91-judge | Medium | follow | "I did not say you could keep the coins" muddles whose coins they are | fixed | 2026-10-23-2 |
| SR-20261023-394 | fun/hodja.md | q92-talk | Medium | continuity | The script says "next week" and "third week"; the notes say three days of story time | fixed | 2026-10-23-2 |
| SR-20261023-395 | expansions/E1.md | e1-stall-done | Medium | humour | The Nubbins under the trestle are set up and dropped; make one of them staff | fixed | 2026-10-23-2 |
| SR-20261023-396 | expansions/E2.md | e2-day8-moody | Medium | humour | The moody variant has room for one dry smile before the quiet end | fixed | 2026-10-23-2 |
| SR-20261023-397 | multiverse/toystory.md | mv-ts10-landfill | Medium | continuity | The aliens drive the crane with no set-up; let them wander off after "the claw" | fixed | 2026-10-23-2 |
| SR-20261023-398 | multiverse/toystory.md | mv-ts05-sale | Medium | humour | The dash across the yard sale is flat narration; add one stepped-on tail | fixed | 2026-10-23-2 |
| SR-20261023-399 | multiverse/toystory.md | mv-ts06-aisle-done | Medium | humour | The new Buzz is the joke engine and gets one line; give Hamm a reply | fixed | 2026-10-23-2 |
| SR-20261023-400 | multiverse/toystory.md | mv-ts12-road | Medium | follow | "Tell Buzz to keep everyone together. I'll get him" has no clear listener and no clear him | fixed | 2026-10-23-2 |
| SR-20261023-401 | multiverse/endgames.md | mv-e4-bracket | Medium | humour | The hint makes the Nubbins Goku's seconds; give them a towel and a sponge | fixed | 2026-10-23-2 |
| SR-20261023-402 | atlas/A02/sprout.md | a02-01-complete | Medium | child-read | Two lessons mention "the old race" that the band never tells | fixed | 2026-10-23-2 |
| SR-20261023-403 | atlas/A02/sprout.md | a02-16-real | Medium | humour | "A long, silly business with disguises" tells the joke; show one disguise going wrong | fixed | 2026-10-23-2 |
| SR-20261023-404 | atlas/A02/sprout.md | a02-16-real | Medium | child-read | The lesson counts in tens to thirty; the story needs forty-nine waves | fixed | 2026-10-23-2 |
| SR-20261023-405 | atlas/A02/sprout.md | a02-13-complete | Medium | child-read | Swap two idioms and two unclear pronouns for plain words and names | fixed | 2026-10-23-2 |
| SR-20261023-406 | atlas/A02/reader.md | a02-09-gao | Medium | follow | "The son-in-law gives a squeal" before anyone says the monster married Gao's daughter | fixed | 2026-10-23-2 |
| SR-20261023-407 | atlas/A02/reader.md | a02-14-fire | Medium | child-read | Red Boy brings two new names and a family tree in one line | fixed | 2026-10-23-2 |
| SR-20261023-408 | atlas/A02/reader.md | a02-17-cottage | Medium | child-read | The lesson says "The seven women turn out to be spiders" before the story reveals it | fixed | 2026-10-23-2 |
| SR-20261023-409 | multiverse/dragonball.md<br>multiverse/toystory.md<br>multiverse/endgames.md | cross-story | High | humour | Bring canon 45's misname gag to Dragon Ball and Toy Story, with a closer each | fixed | 2026-10-23-2 |
| SR-20261023-410 | expansions/E1.md<br>expansions/E2.md | cross-story | Medium | follow | Six narration lines in E1 and E2 are tagged as the Keeper speaking | fixed | 2026-10-23-2 |
| SR-20261023-411 | storylines/logged.md | end-logged-everyone-wakes | Critical | compelling | The final choice (find Juno outside, or say goodbye) reaches no ending; give each ending a Juno line, and the cat | fixed | 2026-10-23-3 |
| SR-20261023-412 | storylines/beetle.md | b-c8-close | Critical | continuity | Ottoline's stay-or-go choice reaches no ending, and Two As One puts her at the top of the stairs either way | fixed | 2026-10-23-3 |
| SR-20261023-413 | storylines/logged.md | l-c7-open | High | follow | Nobody says Root is your sister, or who "the company" is, so the door down the hall may not land | fixed | 2026-10-23-3 |
| SR-20261023-414 | storylines/hundred.md | h-c9-close | High | continuity | Ida's grave line contradicts itself ("Nobody stood in front of it. I did."); let the broom carry it | fixed | 2026-10-23-3 |
| SR-20261023-415 | storylines/dawndusk.md | dawn-c4-second-house | High | compelling | The latched door "wants someone it knows on the other side" and never opens; four lamps appear from nowhere | fixed | 2026-10-23-3 |
| SR-20261023-416 | storylines/dawndusk.md | dawn-c6-open | High | compelling | The wrong answer announces itself in both halves; give it evidence so the choice is real | fixed | 2026-10-23-3 |
| SR-20261023-417 | atlas/A05/sprout.md | a05-10-basket | High | child-read | The child never learns the king is refusing Sogolon a grave, so the basket has no stake | fixed | 2026-10-23-3 |
| SR-20261023-418 | atlas/A05/sprout.md | a05-06-leave | High | child-read | The family flees "because it is safer" with no reason, and two new names arrive at once | fixed | 2026-10-23-3 |
| SR-20261023-419 | atlas/A01/main.md | a01-20-complete | High | compelling | The Nubbin has ridden inside Al for twenty quests; pay it off when Al has a body again | fixed | 2026-10-23-3 |
| SR-20261023-420 | storylines/hundred.md | h-c5-close | High | humour | Ida and Sorrel never speak to each other; give the Fold its deadpan double act | fixed | 2026-10-23-3 |
| SR-20261023-421 | expansions/E3.md | e3-tournament-done | High | humour | The whole tournament is one summary line; play three rounds of Nubbin slapstick | fixed | 2026-10-23-3 |
| SR-20261023-422 | storylines/logged.md | l-c4-night | High | humour | Chapters 4 to 6 lose every laugh; give the partners the night ticks, and keep the cat alive | fixed | 2026-10-23-3 |
| SR-20261023-423 | storylines/beetle.md | b-c5-notebook | High | theme | Make Hob and Ottoline a long-married couple who live four floors apart | fixed | 2026-10-23-3 |
| SR-20261023-424 | storylines/beetle.md | b-c6-close | High | humour | Indoor rain gets no laugh; let the Nubbins meet weather and Hob meet an umbrella | fixed | 2026-10-23-3 |
| SR-20261023-425 | storylines/dawndusk.md | dawn-c2-book | High | humour | Both twins claim the neat hand; turn the contradiction into their running quarrel | fixed | 2026-10-23-3 |
| SR-20261023-426 | atlas/A03/main.md | a03-05-choice-done | High | humour | Deok-choon is promised to cry "at every verdict from here on" and then doesn't, twice | fixed | 2026-10-23-3 |
| SR-20261023-427 | atlas/A01/main.md | a01-16-tunnels | High | humour | The longest stretch before the climax has no banter; let the brothers bicker about left | fixed | 2026-10-23-3 |
| SR-20261023-428 | storylines/hundred.md | end-hundred-bright-fold | Medium | follow | "We're past sixty" reads as sixty residents in a Fold of about ten; count doorsteps instead | fixed | 2026-10-23-3 |
| SR-20261023-429 | storylines/hundred.md | h-c6-trust | Medium | humour | The kettle Sorrel mends that "was not his" wants a running gag: its lid, and the Hush | fixed | 2026-10-23-3 |
| SR-20261023-430 | storylines/hundred.md | h-c1-close | Medium | humour | The naming choice gets no reaction until chapter 10; give Ida a reply that plants the callback | fixed | 2026-10-23-3 |
| SR-20261023-431 | storylines/logged.md | l-c6-close | Medium | humour | Keep the Warden's deadpan going through the angry middle | fixed | 2026-10-23-3 |
| SR-20261023-432 | storylines/beetle.md | b-c2-errand | Medium | follow | The team leader you picked never appears; let Hob quote all three teams at every errand | fixed | 2026-10-23-3 |
| SR-20261023-433 | storylines/beetle.md | b-c2-close | Medium | humour | The cart chapter's Nubbins do nothing; seat one on the cargo like a dragon on a hoard | fixed | 2026-10-23-3 |
| SR-20261023-434 | storylines/dawndusk.md | dawn-c1-open | Medium | follow | "Twins" first appears in the last ending, and "the other half" assumes a storyline the player may not know exists | fixed | 2026-10-23-3 |
| SR-20261023-435 | storylines/dawndusk.md | dawn-c6-wrong | Medium | humour | The wrong-answer scene is a flat sigh; add a gentle laugh around the disappointment | fixed | 2026-10-23-3 |
| SR-20261023-436 | expansions/E3.md | e3-complete | Medium | continuity | Dusty says Hazel lied about the beans, then that she tied beans for twenty years; make the beans the joke | fixed | 2026-10-23-3 |
| SR-20261023-437 | expansions/E3.md | e3-tournament | Medium | theme | Byte runs the bracket alone; let Pixel heckle it, as canon 38 asks | fixed | 2026-10-23-3 |
| SR-20261023-438 | expansions/E3.md | e3-pair | Medium | compelling | "Pick again, or find out" promises a consequence for picking the strongest pair, and none comes | fixed | 2026-10-23-3 |
| SR-20261023-439 | expansions/E3.md | e3-merge-done | Medium | humour | The merged Nubbin should not know who is steering | fixed | 2026-10-23-3 |
| SR-20261023-440 | atlas/A01/main.md | a01-02-complete | Medium | follow | The page leaves the flashback with no signal, and Winry arrives as just a name | fixed | 2026-10-23-3 |
| SR-20261023-441 | atlas/A01/main.md | a01-05-alley-done | Medium | follow | Three places where people are where the page never put them: Mustang in the alley, the Keeper at the eclipse, Envy after Gluttony | fixed | 2026-10-23-3 |
| SR-20261023-442 | atlas/A01/main.md | a01-03-temple-done | Medium | humour | Cornello's radio confession is a ready joke played straight | fixed | 2026-10-23-3 |
| SR-20261023-443 | atlas/A01/main.md | a01-14-sea | Medium | humour | Ling's unpaid lunch is set up twice and dropped in the darkest stretch | fixed | 2026-10-23-3 |
| SR-20261023-444 | atlas/A01/main.md | a01-15-sloth | Medium | follow | The player carries fuel cans with no idea what they are for | fixed | 2026-10-23-3 |
| SR-20261023-445 | atlas/A02/main.md | a02-16-real | Medium | humour | The chapter's big comic set piece is skipped in one flat sentence | fixed | 2026-10-23-3 |
| SR-20261023-446 | atlas/A02/main.md | a02-19-turtle-done | Medium | compelling | The turtle's question is never answered; let Monkey fetch an answer in one somersault | fixed | 2026-10-23-3 |
| SR-20261023-447 | atlas/A02/main.md | a02-04-stables | Medium | follow | Two pieces of off-page backstory need one line each: Monkey's staff and book, and Red Boy's "uncle" | fixed | 2026-10-23-3 |
| SR-20261023-448 | atlas/A03/main.md | a03-11-hall | Medium | follow | "Harm to a parent" is too veiled for the reader to know what the last trial is about | fixed | 2026-10-23-3 |
| SR-20261023-449 | atlas/A03/main.md | a03-12-house | Medium | follow | "Eomma" and "hyung" are glossed only in the notes | fixed | 2026-10-23-3 |
| SR-20261023-450 | atlas/A03/main.md | a03-10-sit | Medium | humour | Only one branch of the brothers' night gets its laugh | fixed | 2026-10-23-3 |
| SR-20261023-451 | atlas/A03/main.md | a03-14-complete | Medium | compelling | Nova's "Read it with somebody" is never paid off | fixed | 2026-10-23-3 |
| SR-20261023-452 | atlas/A05/sprout.md | a05-11-allies | Medium | humour | "I crawled. It was the only way to win." has lost its set-up in the sprout band | fixed | 2026-10-23-3 |
| SR-20261023-453 | atlas/A05/sprout.md | a05-13-fakoli | Medium | child-read | Three lessons are bolted on, and two lines speak in metaphor | fixed | 2026-10-23-3 |
| SR-20261023-454 | atlas/A05/sprout.md | a05-12-secret | Medium | compelling | Nana Triban's reason is "I am my own person"; give her the reader band's leaves | fixed | 2026-10-23-3 |
| SR-20261023-455 | atlas/A05/reader.md | a05-14-complete | Medium | pacing | The story's warm close is followed by two fact lessons; end on the Nubbin's tune | fixed | 2026-10-23-3 |
| SR-20261023-456 | atlas/A05/reader.md | a05-06-garden | Medium | child-read | Irony and idioms a 7 to 10 year old will take literally | fixed | 2026-10-23-3 |
| SR-20261023-457 | atlas/A05/reader.md | a05-12-secret | Medium | humour | Nana Triban's family tree arrives in one speech; make Dankaran's gift-giving the joke | fixed | 2026-10-23-3 |
| SR-20261023-458 | atlas/A05/reader.md | a05-11-council | Medium | humour | The council and Fakoli scenes are talk with no Nubbin | fixed | 2026-10-23-3 |
| SR-20261023-459 | atlas/A05/reader.md | a05-13-fakoli | Medium | child-read | "Took my wife out of my house and into his" is heavier than the band needs | fixed | 2026-10-23-3 |
| SR-20261023-460 | storylines/hundred.md | h-c4-close | Nice | continuity | "The bathhouse wants a fourth" disagrees with the chapter 8 goal of prosperity 60 | fixed | 2026-10-23-3 |
| SR-20261023-461 | storylines/dawndusk.md | dawn-c3-open | Nice | follow | "Morning, or evening:" shows the template in both halves | fixed | 2026-10-23-3 |
| SR-20261023-462 | atlas/A03/main.md | a03-02-gate | Nice | humour | The queue of the dead is a good gag that stops after one beat | fixed | 2026-10-23-3 |
| SR-20261023-463 | atlas/A02/main.md | a02-10-complete | Nice | humour | The monk's "fifth disciple" count wants a straight man | fixed | 2026-10-23-3 |
| SR-20261023-464 | atlas/A02/main.md | a02-15-complete | Nice | humour | The Nubbin should not tell us which Monkey's tail was the real one | fixed | 2026-10-23-3 |
| SR-20261023-465 | atlas/A05/sprout.md | a05-04-forge-done | Nice | humour | A small Nubbin pratfall on the iron rod | fixed | 2026-10-23-3 |
| SR-20261023-466 | storylines/hundred.md<br>storylines/beetle.md<br>storylines/dawndusk.md | cross-story | High | continuity | Three new names clash with canon: Tam (canon 43), Hob (canon 43) and Ash (canon 7) | fixed | 2026-10-23-3 |
| SR-20261023-467 | atlas/A05/sprout.md<br>atlas/A05/reader.md | cross-story | High | child-read | Both bands call the boy Mari Djata, then Sundiata, a scene before anyone links the names | fixed | 2026-10-23-3 |
| SR-20261023-468 | storylines/beetle.md<br>storylines/dawndusk.md | cross-story | Medium | pacing | "Forty years" appears about ten times across two storylines; keep it where it matters | fixed | 2026-10-23-3 |
| SR-20261023-469 | atlas/A05/sprout.md<br>atlas/A05/reader.md | cross-story | Medium | compelling | Balla promises to say "which door" the tune opens and never does; say it when the tune softens Soumaoro | fixed | 2026-10-23-3 |
| SR-20261023-470 | atlas/A07/sprout.md | a7-10-dark-done | Critical | child-read | The page's twist is spoken to the wrong person; say plainly that Héctor's Coco is Mamá Coco | fixed | 2026-10-23-4 |
| SR-20261023-471 | atlas/A07/reader.md | a7-05-queue | High | follow | The queue sum teaches a false fact: 2,409 and 2,377 do not share their hundreds | fixed | 2026-10-23-4 |
| SR-20261023-472 | atlas/A04/main.md | a4-16-duel-done | High | follow | Say once whom Devasena's 25-year fire is for, so the pyre pays off without describing it | fixed | 2026-10-23-4 |
| SR-20261023-473 | atlas/A06/reader.md | a06-03-proof | High | continuity | The captain's sum gives away "twenty lengths" one beat before Sinbad's proof; count oil jars instead | fixed | 2026-10-23-4 |
| SR-20261023-474 | atlas/A09/main.md | a09-11-door | High | follow | On the garnet branch the Nubbin is never said to come into the cave; bring it in on Sniff's pocket | fixed | 2026-10-23-4 |
| SR-20261023-475 | atlas/A07/sprout.md | a7-01-photo | High | follow | Plant that Imelda thinks her husband left, so "He didn't leave you" pays off | fixed | 2026-10-23-4 |
| SR-20261023-476 | atlas/A06/main.md | a06-03-shore | High | follow | The player whispers "your uncle's shop" before anyone has mentioned an uncle; plant him on the shore | fixed | 2026-10-23-4 |
| SR-20261023-477 | atlas/A07/main.md | a7-11-backstage-done | High | theme | Give Imelda and Héctor their one married bicker before the farewell, not in it | fixed | 2026-10-23-4 |
| SR-20261023-478 | atlas/A06/reader.md | a06-16-grove-done | High | follow | The symmetry lesson can be false in the scene it describes; count odd and even instead | fixed | 2026-10-23-4 |
| SR-20261023-479 | atlas/A07/sprout.md | a7-03-window-done | High | follow | Say that Miguel has crossed over, and that the skeletons are his family who have died | fixed | 2026-10-23-4 |
| SR-20261023-480 | atlas/A07/sprout.md | a7-11-blessing | High | follow | State what happens to Héctor if Mamá Coco forgets, using Chicharrón | fixed | 2026-10-23-4 |
| SR-20261023-481 | atlas/A06/sprout.md | a06-14-herd | High | child-read | Explain ivory, say the elephants' death plainly, and replace "paid for in bones" | fixed | 2026-10-23-4 |
| SR-20261023-482 | atlas/A06/reader.md | a06-08-tunnel-done | High | pacing | A compass quiz lands straight after Sinbad cries for his wife; move it and ground it in the scene | fixed | 2026-10-23-4 |
| SR-20261023-483 | atlas/A08/main.md | a08-13-complete | High | humour | Escalate Pupus's twelve identical tick lines into a running gag that cracks, and fix the last one's order | fixed | 2026-10-23-4 |
| SR-20261023-484 | atlas/A04/main.md | a4-12-streets | High | humour | Give Amarendra and Devasena a married bicker about the bridge he keeps mending | fixed | 2026-10-23-4 |
| SR-20261023-485 | atlas/A06/sprout.md | a06-07-complete | High | child-read | Change "swore" to "promised" through the page, which also fixes the one over-cap line | fixed | 2026-10-23-4 |
| SR-20261023-486 | atlas/A06/sprout.md | a06-09-complete | High | child-read | Five idioms in a band that bans them, one of them unkind; say each thing plainly | fixed | 2026-10-23-4 |
| SR-20261023-487 | atlas/A06/main.md | a06-12-court | High | humour | Serendib has no straight man; make the curious king ask about plain clothes and let the farmer sigh | fixed | 2026-10-23-4 |
| SR-20261023-488 | atlas/A09/main.md | a09-11-arrive-done | High | humour | Pay off the Snork's minutes and the Muskrat's hammock in one breath before the comet comes | fixed | 2026-10-23-4 |
| SR-20261023-489 | atlas/A08/main.md | a08-03-throws | High | humour | Verses names his javelins; let Asterix's be called "Stick" and pay it off at the end | fixed | 2026-10-23-4 |
| SR-20261023-490 | atlas/A06/sprout.md | a06-06-castle | High | follow | The giant has no threat in the sprout; say why everyone hides, with a pot gag | fixed | 2026-10-23-4 |
| SR-20261023-491 | atlas/A07/sprout.md | a7-05-queue-done | High | humour | Restore the painter's falling eyebrows, the Department's only laugh | fixed | 2026-10-23-4 |
| SR-20261023-492 | atlas/A06/sprout.md | a06-13-palace | High | humour | Restore "promise again afterwards", gloss "Caliph", and name who the letter is from | fixed | 2026-10-23-4 |
| SR-20261023-493 | atlas/A04/main.md | a4-03-camp | Medium | humour | Explain what the mask was for, and give Avanthika a deadpan rebel beside her | fixed | 2026-10-23-4 |
| SR-20261023-494 | atlas/A04/main.md | a4-07-complete | Medium | humour | Break the eight-quest flashback with one heckle from the cave, and Kattappa's "No." | fixed | 2026-10-23-4 |
| SR-20261023-495 | atlas/A04/main.md | a4-06-complete | Medium | follow | Say what "Baahubali" means and that Shivudu's real name is Mahendra | fixed | 2026-10-23-4 |
| SR-20261023-496 | atlas/A05/main.md | a05-09-march | Medium | follow | A5-9 jumps back and forward in time; anchor the forward jump with a joke | fixed | 2026-10-23-4 |
| SR-20261023-497 | atlas/A05/main.md | a05-14-complete | Medium | compelling | Let the "what should I never leave out?" choice be heard in Balla's first line | fixed | 2026-10-23-4 |
| SR-20261023-498 | atlas/A05/main.md | a05-03-complete | Medium | follow | "Sundiata" speaks before anyone has said the name; let Balla give it | fixed | 2026-10-23-4 |
| SR-20261023-499 | atlas/A05/main.md | a05-06-leave | Medium | follow | Five people and three new names in one line; meet them one at a time | fixed | 2026-10-23-4 |
| SR-20261023-500 | atlas/A05/main.md | a05-11-allies | Medium | humour | The Nubbin greets every king "very seriously" and nothing happens; give it pebbles to run out of | fixed | 2026-10-23-4 |
| SR-20261023-501 | atlas/A06/main.md | a06-10-complete | Medium | humour | Make "putting something down" plain, and let the porter be furious about feeling better | fixed | 2026-10-23-4 |
| SR-20261023-502 | atlas/A06/main.md<br>atlas/A06/reader.md | a06-14-complete | Medium | follow | "The elephants paid for my freedom. I want to remember that I didn't" reads backwards; say who gave what | fixed | 2026-10-23-4 |
| SR-20261023-503 | atlas/A06/main.md | a06-11-raft | Medium | humour | Turn Sinbad's sack of jewels into an escalating raft gag, and say which friend he means | fixed | 2026-10-23-4 |
| SR-20261023-504 | atlas/A06/main.md | a06-02-telling | Medium | continuity | A6-3 and the Dhow Sail reward recall "a patch you have seen before"; put the patch on the sail in A6-2 | fixed | 2026-10-23-4 |
| SR-20261023-505 | atlas/A06/sprout.md | a06-01-street | Medium | follow | Plant early that the porter can't read the paper he carries, so his last line lands | fixed | 2026-10-23-4 |
| SR-20261023-506 | atlas/A06/sprout.md | a06-02-island-done | Medium | child-read | The captain says "fish", the lesson says fish live in the sea, then it's a whale; untangle it | fixed | 2026-10-23-4 |
| SR-20261023-507 | atlas/A06/reader.md | a06-07-complete | Medium | humour | The "never again" lesson explains its own joke; cut the explanation and let the porter call it | fixed | 2026-10-23-4 |
| SR-20261023-508 | atlas/A06/reader.md | a06-12-bank | Medium | continuity | The fractions lesson shares the stream equally, but the farmer says it passes field to field | fixed | 2026-10-23-4 |
| SR-20261023-509 | atlas/A07/main.md | a7-07-stage-done | Medium | follow | The talent show's prize is a party invitation, then nobody wins; cut the compère off mid-announcement | fixed | 2026-10-23-4 |
| SR-20261023-510 | atlas/A07/main.md | a7-02-square | Medium | follow | Show Miguel pocketing the old photo, so Imelda's missing photo has a cause | fixed | 2026-10-23-4 |
| SR-20261023-511 | atlas/A07/main.md | a7-08-gate | Medium | humour | The party opens with a sigh; give the doorman a maraca to be defeated by | fixed | 2026-10-23-4 |
| SR-20261023-512 | atlas/A07/main.md | a7-09-complete | Medium | humour | After the poisoning reveal and the drop, one breath of awkward relief in the water | fixed | 2026-10-23-4 |
| SR-20261023-513 | atlas/A07/sprout.md | a7-11-backstage | Medium | humour | The twins are a pantomime horse and nothing happens; let the back end bump the front | fixed | 2026-10-23-4 |
| SR-20261023-514 | atlas/A07/sprout.md<br>atlas/A07/reader.md | a7-11-blessing | Medium | child-read | "Your papá Héctor" sounds like Miguel's own Papá; just say Héctor | fixed | 2026-10-23-4 |
| SR-20261023-515 | atlas/A07/reader.md | a7-11-complete | Medium | follow | The metaphor lesson picks a line that literally happens; teach a real simile instead | fixed | 2026-10-23-4 |
| SR-20261023-516 | atlas/A07/reader.md | a7-12-song-done | Medium | follow | The torn corner is called a quarter of a photo of three; ask for Héctor's share of the family | fixed | 2026-10-23-4 |
| SR-20261023-517 | atlas/A07/reader.md | a7-06-shantytown | Medium | pacing | Chicharrón's comfort line waits behind an oral-history lesson; put it straight after he fades | fixed | 2026-10-23-4 |
| SR-20261023-518 | atlas/A07/reader.md | a7-01-photo | Medium | child-read | Miguel names six relatives in one breath; name Imelda and save the rest for A7-3 | fixed | 2026-10-23-4 |
| SR-20261023-519 | atlas/A08/main.md | a08-13-arena | Medium | continuity | Verses is in the Rome stands in A8-13 and still chasing the javelin in A8-14; keep him walking | fixed | 2026-10-23-4 |
| SR-20261023-520 | atlas/A08/main.md | a08-10-complete | Medium | humour | The ravine ends flat on the tick; let Pupus file the crocodiles' disappointment | fixed | 2026-10-23-4 |
| SR-20261023-521 | atlas/A08/main.md | a08-09-counters | Medium | follow | "A long white beard, and he looks about your age" is a joke nobody can read; give him a faded NEW badge | fixed | 2026-10-23-4 |
| SR-20261023-522 | atlas/A09/main.md | a09-12-night | Medium | theme | Pay off Pappa's memoirs with a gentle married correction from Mamma | fixed | 2026-10-23-4 |
| SR-20261023-523 | atlas/A09/main.md | a09-09-deep | Medium | continuity | The Snork Maiden rescues Moomintroll with a lantern nobody has seen; hang it up first | fixed | 2026-10-23-4 |
| SR-20261023-524 | atlas/A09/main.md | a09-12-dawn | Medium | compelling | The raft's name choice is art only and the raft is forgotten; float it home at dawn | fixed | 2026-10-23-4 |
| SR-20261023-525 | atlas/A06/reader.md<br>atlas/A07/reader.md<br>atlas/A06/sprout.md<br>atlas/A07/sprout.md | cross-story | High | follow | Six maths and fact lessons disagree with their own scenes; every number must come from the narration and be worked aloud | fixed | 2026-10-23-4 |
| SR-20261023-526 | atlas/A06/reader.md<br>atlas/A07/reader.md<br>atlas/A06/sprout.md | cross-story | Medium | pacing | Lessons interrupt grave and peril beats in both bands; a lesson goes after the beat's comfort or relief line | fixed | 2026-10-23-4 |
| SR-20261023-527 | atlas/A06/sprout.md<br>atlas/A06/reader.md | cross-story | Medium | follow | Three Sinbads in two bands; tag them once and use "the porter" and "the old sailor" in narration | fixed | 2026-10-23-4 |
| SR-20261023-528 | atlas/A10/sprout.md | a10-01-story | Critical | follow | Sprout never says the trickster is Maui, so "Someone must find Maui" in A10-4 is a name from nowhere | fixed | 2026-10-23-5 |
| SR-20261023-529 | atlas/A11/main.md<br>atlas/A11/sprout.md<br>atlas/A11/reader.md | a11-19-scroll | Critical | continuity | The ribbon route ties the Friend ribbon on Eeyore's door in A11-11, then has it come out of his pot in A11-19 | fixed | 2026-10-23-5 |
| SR-20261023-530 | atlas/A10/sprout.md<br>atlas/A10/reader.md | a10-05-bedside | High | pacing | Both bands cut Gramma Tala's last words in half with a lesson | fixed | 2026-10-23-5 |
| SR-20261023-531 | atlas/A11/sprout.md<br>atlas/A11/reader.md | a11-19-meeting | High | pacing | The Rissolution farewell is broken up by a rhyme drill, an early countdown and a half-of-2-km quiz | fixed | 2026-10-23-5 |
| SR-20261023-532 | atlas/A11/sprout.md<br>atlas/A11/reader.md | a11-20-knight | High | pacing | The knighting and Pooh's promise are split by a factors quiz, an accolade lecture and a promise lesson | fixed | 2026-10-23-5 |
| SR-20261023-533 | atlas/A10/sprout.md | a10-11-gap | High | continuity | The crew count puts Pua aboard, but Pua stayed home and Maui is in the sky; the answer is four | fixed | 2026-10-23-5 |
| SR-20261023-534 | atlas/A10/sprout.md | a10-12-light | High | child-read | Sprout says Gramma's body "will not start again", then shows her sitting up and hugging with no word on what she is now | fixed | 2026-10-23-5 |
| SR-20261023-535 | atlas/A11/main.md<br>atlas/A11/sprout.md | a11-17-mist | High | follow | Rabbit's mist plan makes no sense in sprout, and both versions jump to Kanga's without saying how | fixed | 2026-10-23-5 |
| SR-20261023-536 | atlas/A10/reader.md | a10-11-crack | High | pacing | The "Was he right to go?" lesson arrives before Maui goes, credits an apology he hasn't made, and spoils his return | fixed | 2026-10-23-5 |
| SR-20261023-537 | atlas/A10/reader.md | a10-05-complete | High | pacing | A manta-feeding fact sheet follows Gramma's death, and repeats in A10-12 | fixed | 2026-10-23-5 |
| SR-20261023-538 | atlas/A10/sprout.md | a10-13-walk | High | child-read | "Walk up slowly with open hands" to a roaring fire giant contradicts A10-11's "stay safe and tell a grown-up" | fixed | 2026-10-23-5 |
| SR-20261023-539 | atlas/A08/sprout.md<br>atlas/A08/reader.md | a08-03-throws | High | continuity | Both bands drop the naming of Stick, the javelin canon says is named in A8-3 | fixed | 2026-10-23-5 |
| SR-20261023-540 | atlas/A08/sprout.md | a08-11-riddle | High | follow | The "Buy three for five" choice appears with no offer behind it | fixed | 2026-10-23-5 |
| SR-20261023-541 | atlas/A08/reader.md | a08-06-stare | High | continuity | The sand-timer sum uses a 3-minute timer turned twice, neither of which is in the scene, and it lands mid-gag | fixed | 2026-10-23-5 |
| SR-20261023-542 | atlas/A09/sprout.md | a09-02-build | High | follow | The raft's name is never spoken, so the dawn variant's "named after someone who always comes home" is a riddle | fixed | 2026-10-23-5 |
| SR-20261023-543 | atlas/A09/reader.md | a09-11-dark | High | pacing | The comet's arrival gets three lessons that explain the hand-hold, the silence and the suspense | fixed | 2026-10-23-5 |
| SR-20261023-544 | atlas/A09/sprout.md<br>atlas/A09/reader.md | a09-09-octopus | High | pacing | The octopus grabs Moomintroll, then everyone stops to count its arms | fixed | 2026-10-23-5 |
| SR-20261023-545 | atlas/A11/sprout.md | a11-18-wind-done | High | child-read | "Stay indoors, away from trees" lands while everyone is indoors in a house a tree just knocked over | fixed | 2026-10-23-5 |
| SR-20261023-546 | atlas/A11/sprout.md<br>atlas/A11/reader.md | a11-12-malt | High | child-read | Tigger grabs Roo's medicine and loves it, five scenes after "never take medicine by yourself" | fixed | 2026-10-23-5 |
| SR-20261023-547 | atlas/A09/sprout.md | a09-05-bush | High | child-read | "Don't touch strange plants" is taught right after the heroes grab a stinging bush | fixed | 2026-10-23-5 |
| SR-20261023-548 | atlas/A08/reader.md | a08-08-beast | High | follow | The lesson asks why nobody tells the secret before there is a secret | fixed | 2026-10-23-5 |
| SR-20261023-549 | atlas/A10/main.md | a10-08-stars | High | humour | Give the wayfinding lesson a straight man and a wobbling chicken | fixed | 2026-10-23-5 |
| SR-20261023-550 | atlas/A11/main.md<br>atlas/A11/sprout.md | a11-10-table-done | High | humour | The party for saving Piglet has no Piglet beat, and sprout never says what the party is for | fixed | 2026-10-23-5 |
| SR-20261023-551 | atlas/A08/sprout.md | a08-02-complete | High | humour | Turn eleven identical numeral notices into Dogmatix's growing twig pile | fixed | 2026-10-23-5 |
| SR-20261023-552 | atlas/A10/main.md | a10-05-complete | Medium | follow | Gramma dies "in her sleep" a minute after she was awake giving orders | fixed | 2026-10-23-5 |
| SR-20261023-553 | atlas/A10/main.md | a10-07-fog-done | Medium | follow | "Heihei's swallowed the heart!" has no set-up | fixed | 2026-10-23-5 |
| SR-20261023-554 | atlas/A10/main.md | a10-09-depths | Medium | follow | Moana quotes a hook clue Maui never gave | fixed | 2026-10-23-5 |
| SR-20261023-555 | atlas/A10/main.md | a10-13-spiral | Medium | child-read | The central reveal packs three ideas into one line | fixed | 2026-10-23-5 |
| SR-20261023-556 | atlas/A10/main.md | a10-12-complete | Medium | character | Let the Nubbin answer Moana with Gramma's step instead of a Keeper platitude | fixed | 2026-10-23-5 |
| SR-20261023-557 | atlas/A10/main.md | a10-04-falls | Medium | humour | Give Gramma's knees a second joke on the long way round | fixed | 2026-10-23-5 |
| SR-20261023-558 | atlas/A11/main.md | a11-15-note | Medium | child-read | Show Christopher Robin's note so the Backson joke can be seen | fixed | 2026-10-23-5 |
| SR-20261023-559 | atlas/A10/sprout.md<br>atlas/A10/reader.md | a10-12-song-done | Medium | follow | Moana gave the stone to the sea; now she just comes up with it | fixed | 2026-10-23-5 |
| SR-20261023-560 | atlas/A10/sprout.md | a10-05-council | Medium | child-read | Joke distractors ("Silly", "Hungry") right after Tui says his friend died | fixed | 2026-10-23-5 |
| SR-20261023-561 | atlas/A10/sprout.md | a10-06-complete | Medium | humour | Restore Heihei walking off the edge and being put back | fixed | 2026-10-23-5 |
| SR-20261023-562 | atlas/A10/sprout.md | a10-14-home | Medium | humour | Give Sina back her lunch line at the homecoming | fixed | 2026-10-23-5 |
| SR-20261023-563 | atlas/A10/reader.md | a10-08-stars | Medium | follow | Maui says "flat hand"; the lesson measures with fists | fixed | 2026-10-23-5 |
| SR-20261023-564 | atlas/A08/sprout.md | a08-06-stare | Medium | child-read | Clarity batch: Iris's pronoun, IV's missing cause, the unexplained rule jokes and the red map | fixed | 2026-10-23-5 |
| SR-20261023-565 | atlas/A08/sprout.md<br>atlas/A08/reader.md | a08-14-tie | Medium | child-read | Tying up the bard: too rough for sprout, and reader's lesson asks about it before it happens | fixed | 2026-10-23-5 |
| SR-20261023-566 | atlas/A08/reader.md | a08-03-field-done | Medium | continuity | Accuracy batch: metres in 50 BC, "hundreds of rules", and two lessons that land on the scary or funny entrance | fixed | 2026-10-23-5 |
| SR-20261023-567 | atlas/A09/sprout.md | a09-11-dark-done | Medium | compelling | 8:42 arrives in sprout with nothing to say it matters | fixed | 2026-10-23-5 |
| SR-20261023-568 | atlas/A09/sprout.md<br>atlas/A09/reader.md | a09-12-dawn | Medium | follow | The tide lesson says the sea "always comes back", though this sea left because of a comet | fixed | 2026-10-23-5 |
| SR-20261023-569 | atlas/A09/sprout.md | a09-06-snork-done | Medium | child-read | Accuracy batch: fairness not shown, a refrain never set up, and four lessons that don't match their scenes | fixed | 2026-10-23-5 |
| SR-20261023-570 | atlas/A09/sprout.md | a09-08-stilts | Medium | humour | Restore the three physical gags the band cut | fixed | 2026-10-23-5 |
| SR-20261023-571 | atlas/A09/sprout.md | a09-12-gate-done | Medium | humour | Pay off the duck-in-a-cupboard note, and give the Muskrat and Pappa a line each | fixed | 2026-10-23-5 |
| SR-20261023-572 | atlas/A09/reader.md | a09-10-run | Medium | continuity | The Snork counts "everyone else" and gets seven; Mamma's six sandwiches become twelve buns, unremarked | fixed | 2026-10-23-5 |
| SR-20261023-573 | atlas/A09/reader.md | a09-10-road | Medium | pacing | Lessons that spoil the next beat, and a washing simile that doesn't float | fixed | 2026-10-23-5 |
| SR-20261023-574 | atlas/A11/sprout.md | a11-11-snow-done | Medium | child-read | Two lessons contradict their own scenes: the snow roof and Owl's notice | fixed | 2026-10-23-5 |
| SR-20261023-575 | atlas/A11/sprout.md<br>atlas/A11/reader.md | a11-16-game | Medium | follow | The Poohsticks lesson credits the fast middle, but the Nubbin won by nudging its stick | fixed | 2026-10-23-5 |
| SR-20261023-576 | atlas/A11/reader.md | a11-07-plan-done | Medium | continuity | Lessons that spoil the payoff or misstate the scene's cause | fixed | 2026-10-23-5 |
| SR-20261023-577 | atlas/A11/reader.md | a11-02-visit | Medium | continuity | Christopher Robin voices lessons in scenes he isn't in, and talks about himself in the third person | fixed | 2026-10-23-5 |
| SR-20261023-578 | atlas/A10/main.md | a10-05-pack | Nice | humour | One more Sina joke before the tears | fixed | 2026-10-23-5 |
| SR-20261023-579 | atlas/A11/main.md | a11-07-swap | Nice | follow | The goal says "Rabbit's pocket"; the scene uses a pillowcase | fixed | 2026-10-23-5 |
| SR-20261023-580 | atlas/A11/sprout.md | a11-09-bear | Nice | follow | Clarity batch: unnamed "he", a mystery "Roar!", three friends holding four corners | fixed | 2026-10-23-5 |
| SR-20261023-581 | atlas/A11/reader.md | a11-10-complete | Nice | continuity | Small fixes: the pencil grades and Piglet's ghost footprints | fixed | 2026-10-23-5 |
| SR-20261023-582 | atlas/A09/reader.md | a09-06-snork-done | Nice | child-read | Vocabulary load in the meeting scenes | fixed | 2026-10-23-5 |
| SR-20261023-583 | atlas/A09/reader.md<br>atlas/A10/sprout.md<br>atlas/A10/reader.md<br>atlas/A11/sprout.md<br>atlas/A11/reader.md | cross-story | High | pacing | House rule for the Atlas bands: no lesson inside a grave or peril beat; it goes after the beat's last line | fixed | 2026-10-23-5 |
| SR-20261023-584 | atlas/A08/reader.md<br>atlas/A09/reader.md<br>atlas/A10/reader.md | cross-story | High | humour | Stop lessons explaining the joke or standing between a line and its punchline | fixed | 2026-10-23-5 |
| SR-20261023-585 | atlas/A09/sprout.md<br>atlas/A10/sprout.md<br>atlas/A10/reader.md<br>atlas/A11/sprout.md<br>atlas/A11/reader.md | cross-story | Medium | child-read | Idiom and irony sweep across the Atlas bands | fixed | 2026-10-23-5 |
| SR-20261023-586 | atlas/A08/reader.md<br>atlas/A10/reader.md<br>atlas/A11/reader.md | cross-story | Medium | follow | Maths lessons invent numbers the scene never gives; state every number in the story first | fixed | 2026-10-23-5 |
| SR-20261023-587 | atlas/A08/sprout.md<br>atlas/A08/reader.md<br>atlas/A09/sprout.md<br>atlas/A09/reader.md<br>atlas/A10/sprout.md<br>atlas/A10/reader.md<br>atlas/A11/sprout.md<br>atlas/A11/reader.md | cross-story | Medium | continuity | Standard-tag pass: reader bands use K-2 codes and tags that don't fit what the lesson asks | fixed | 2026-10-23-5 |
| SR-20261024-588 | atlas/A14/main.md<br>atlas/A14/reader.md | a14-20-bed | Critical | continuity | The "dont" name payoff says he hasn't said his name since the giant; he said it to the Phaeacians and to Laertes | fixed | 2026-10-24 |
| SR-20261024-589 | atlas/A13/reader.md | a13-14-martens | Critical | child-read | The martens lesson invents 30 hens and "each took 7", so the answer contradicts the deal just spoken | fixed | 2026-10-24 |
| SR-20261024-590 | atlas/A15/main.md | a15-14-secret | Critical | compelling | Oz's secret is the page's honesty choice and sets no flag; pay it off through the Scarecrow's "eleven new laws" | fixed | 2026-10-24 |
| SR-20261024-591 | atlas/A12/sprout.md<br>atlas/A12/reader.md | a12-16-found | High | theme | An ice-melt quiz cuts in between Gerda's tears and "Kay looks at her", the emotional peak of the page | fixed | 2026-10-24 |
| SR-20261024-592 | atlas/A14/reader.md | a14-11-shades | High | child-read | The grief lesson tells the child Anticlea is wrong about why she died, while she is still speaking | fixed | 2026-10-24 |
| SR-20261024-593 | atlas/A13/reader.md | a13-17-complete | High | follow | Nine maths lessons use numbers the scene never says; the Snail's 4:30 a.m. even fights "that night" | fixed | 2026-10-24 |
| SR-20261024-594 | atlas/A12/sprout.md | a12-03-arch | High | child-read | Sprout never says the troll's mirror got into Kay, so his sudden meanness has no cause | fixed | 2026-10-24 |
| SR-20261024-595 | atlas/A13/sprout.md | a13-20-complete | High | child-read | The slumped "old puppet" with "his head on one side" can read to a small child as Pinocchio's body | fixed | 2026-10-24 |
| SR-20261024-596 | atlas/A14/sprout.md | a14-17-scar-done | High | child-read | "Tell a grown-up about a worrying secret" lands right after Eurycleia keeps Odysseus's secret and the child keeps quiet | fixed | 2026-10-24 |
| SR-20261024-597 | atlas/A14/sprout.md | a14-13-fig | High | child-read | The sailors are lost, and the next thing is a counting game "to make the time go faster" | fixed | 2026-10-24 |
| SR-20261024-598 | atlas/A12/sprout.md<br>atlas/A12/reader.md | a12-04-kiss | High | theme | Both bands break the forgetting kiss with a lesson: a "feelings are okay" ask in sprout, a simile quiz in reader | fixed | 2026-10-24 |
| SR-20261024-599 | atlas/A13/reader.md | a13-15-stone-done | High | pacing | Echo physics over the night of crying, mould science over the reunion, two lessons stacked on the donkey gag | fixed | 2026-10-24 |
| SR-20261024-600 | atlas/A14/reader.md | a14-16-gate | High | pacing | The "is it right to hide love?" ask sits between "he can't kneel" and Argos's last moment | fixed | 2026-10-24 |
| SR-20261024-601 | atlas/A14/sprout.md<br>atlas/A14/reader.md | a14-16-gate | High | child-read | "Nobody." whispered to Argos is a mystery to children, and sprout also uses "nobody" as an ordinary word everywhere | fixed | 2026-10-24 |
| SR-20261024-602 | atlas/A14/sprout.md | a14-01-hearth-done | High | follow | Mentes turns into a bird, Mentor appears unexplained, and Nestor says "That was Athena" to a child who never met her | fixed | 2026-10-24 |
| SR-20261024-603 | atlas/A13/reader.md | a13-05-window-done | High | compelling | The halves lesson imagines Geppetto sharing the pears, undoing his quiet gift of his whole breakfast | fixed | 2026-10-24 |
| SR-20261024-604 | atlas/A12/main.md | a12-17-doe | High | theme | Kay's "Waited? Out here? For me?" is never answered; pay it off with the berry count | fixed | 2026-10-24 |
| SR-20261024-605 | atlas/A13/main.md | a13-16-water | High | compelling | Pinocchio cries all night at the Fairy's gravestone, then finds her alive and never mentions it | fixed | 2026-10-24 |
| SR-20261024-606 | atlas/A14/main.md | a14-20-bed | High | humour | The best marriage scene in the run has no bickering; let Penelope tease him about the bed | fixed | 2026-10-24 |
| SR-20261024-607 | atlas/A13/sprout.md | a13-18-sea | High | follow | "The sea washed the donkey off" has no cause; sprout cut the little fish nibbling the donkey away | fixed | 2026-10-24 |
| SR-20261024-608 | atlas/A12/sprout.md<br>atlas/A12/reader.md | a12-02-roses | High | humour | Sprout cut the sulking peas and the bed with opinions; reader kept the peas but broke the timing and dropped the bed's set-up | fixed | 2026-10-24 |
| SR-20261024-609 | atlas/A14/main.md | a14-13-island | High | humour | Eurylochus's mutiny is all menace in the page's grimmest run; give the grumbler a dry line and Odysseus a reply | fixed | 2026-10-24 |
| SR-20261024-610 | atlas/A15/main.md | a15-11-complete | High | humour | The Witch's kitchen is the flattest stretch; let her grumble and pay off the bucket nobody empties | fixed | 2026-10-24 |
| SR-20261024-611 | atlas/A13/main.md | a13-18-circus | High | pacing | Eight narration lines carry the sale, the circus, the lame leg and the drowning rope with no breath and no smile | fixed | 2026-10-24 |
| SR-20261024-612 | atlas/A12/sprout.md | a12-10-pigeons | High | follow | "A white hen pulled his sledge" and "Spitsbergen" stop a 3-to-6 listener | fixed | 2026-10-24 |
| SR-20261024-613 | atlas/A13/sprout.md | a13-14-martens | High | humour | Sprout cut the "reasonable dog" joke, so the trap has no wit; give the counting to the Nubbin | fixed | 2026-10-24 |
| SR-20261024-614 | atlas/A12/main.md<br>atlas/A12/reader.md | a12-17-doe | Medium | humour | Gerda's "He's cross about his feet, which is how I know" has no set-up in main or reader | fixed | 2026-10-24 |
| SR-20261024-615 | atlas/A12/sprout.md | a12-05-winter | Medium | child-read | "Some people say Kay has died" is never explained, and the spring quiz cuts into the line | fixed | 2026-10-24 |
| SR-20261024-616 | atlas/A14/main.md<br>atlas/A14/reader.md | a14-09-complete | Medium | follow | "Only one ship left of all the ships they had" arrives with no fleet ever mentioned | fixed | 2026-10-24 |
| SR-20261024-617 | atlas/A14/sprout.md | a14-13-fig-done | Medium | child-read | Four lessons ask about things their scenes never show | fixed | 2026-10-24 |
| SR-20261024-618 | atlas/A13/main.md | a13-20-hut | Medium | compelling | The "carried" cricket route pays off three times; the "left" route gets almost nothing | fixed | 2026-10-24 |
| SR-20261024-619 | atlas/A13/main.md | a13-20-wheel | Medium | theme | Candlewick fades and nobody comforts Pinocchio before Giangio's "He cost you nothing" | fixed | 2026-10-24 |
| SR-20261024-620 | atlas/A13/main.md | a13-19-belly | Medium | humour | With s21Done, Clank is drawn in every scene but silent from A13-18 to the end of the Dog-fish | fixed | 2026-10-24 |
| SR-20261024-621 | atlas/A13/sprout.md<br>atlas/A13/reader.md | a13-20-word | Medium | compelling | Reader's lesson asks about Clank's line before he says it; sprout's version is too abstract for 3 to 6 | fixed | 2026-10-24 |
| SR-20261024-622 | atlas/A12/reader.md | a12-01-shards-done | Medium | compelling | The lesson explains the magic glint away as moonlight off glass | fixed | 2026-10-24 |
| SR-20261024-623 | atlas/A12/reader.md | a12-16-word | Medium | pacing | Three lessons land on the wrong line: ETERNITY gets a times-table, Gerda's entrance gets clothing advice, the knife lesson follows the wrong line | fixed | 2026-10-24 |
| SR-20261024-624 | atlas/A12/main.md | a12-08-complete | Medium | humour | The raven and his sweetheart are the page's only couple; give them one bicker | fixed | 2026-10-24 |
| SR-20261024-625 | atlas/A12/main.md | a12-18-roses-done | Medium | humour | The homecoming room callback is flat; bring back the bed with opinions | fixed | 2026-10-24 |
| SR-20261024-626 | atlas/A12/main.md<br>atlas/A12/sprout.md | a12-15-south | Medium | follow | "Inside the palace, a little earlier" is a time jump a reader can lose, and a sprout can't hold | fixed | 2026-10-24 |
| SR-20261024-627 | atlas/A12/sprout.md | a12-04-kept | Medium | continuity | Three sprout variants mention "the stone in your pocket", which sprout can never have | fixed | 2026-10-24 |
| SR-20261024-628 | atlas/A12/sprout.md | a12-15-south-done | Medium | pacing | Three quiz-tone lessons at tense beats, and the page repeats seasons, take-away and slow breaths four times each | fixed | 2026-10-24 |
| SR-20261024-629 | atlas/A13/sprout.md | a13-18-complete | Medium | pacing | A shark fact lands on the cliffhanger, and a squirrel notice lands mid-gag | fixed | 2026-10-24 |
| SR-20261024-630 | atlas/A13/sprout.md | a13-04-egg | Medium | humour | The chick is only sweet; restore the polite chick and Pinocchio's open mouth | fixed | 2026-10-24 |
| SR-20261024-631 | atlas/A13/sprout.md | a13-12-oak | Medium | continuity | The lesson says Pinocchio promised to meet Babbo, and the hut's goat comes from nowhere | fixed | 2026-10-24 |
| SR-20261024-632 | atlas/A14/sprout.md | a14-18-axes | Medium | humour | The bow scene is all tension; let the Nubbin carry one axe and lose | fixed | 2026-10-24 |
| SR-20261024-633 | atlas/A14/sprout.md | a14-10-woods-done | Medium | humour | The "nervous and curious" lesson needs a surprise to feel both things about | fixed | 2026-10-24 |
| SR-20261024-634 | atlas/A14/sprout.md | a14-14-harbour | Medium | theme | After a lesson that truth builds trust, Odysseus tells "a made-up story" and nobody says why | fixed | 2026-10-24 |
| SR-20261024-635 | atlas/A14/reader.md | a14-06-complete | Medium | follow | A wrong-answer reply quotes "since Troy", a line that hasn't been said yet | fixed | 2026-10-24 |
| SR-20261024-636 | atlas/A14/reader.md | a14-10-sty | Medium | humour | A pig-snout fact sits on the crying pig-men; give the Nubbin a staring contest instead | fixed | 2026-10-24 |
| SR-20261024-637 | atlas/A14/reader.md | a14-19-clean | Medium | humour | The cups sum is the flattest line in the storyline; let the 42nd cup be a hat | fixed | 2026-10-24 |
| SR-20261024-638 | atlas/A14/main.md | a14-20-hall | Medium | humour | Pay off the "eleven or twelve days" running gag when Eurycleia wakes Penelope | fixed | 2026-10-24 |
| SR-20261024-639 | atlas/A15/main.md | a15-18-council | Medium | humour | The animals' council is pure menace before the grave wait; give the Tiger a committee joke | fixed | 2026-10-24 |
| SR-20261024-640 | atlas/A15/main.md | a15-10-fire | Medium | continuity | "On the third day the Lion goes in" should be the fourth | fixed | 2026-10-24 |
| SR-20261024-641 | atlas/A15/main.md | a15-11-waves | Medium | follow | The Golden Cap's three calls are told cold; its bargain only arrives in A15-13 | fixed | 2026-10-24 |
| SR-20261024-642 | atlas/A15/main.md | a15-19-complete | Medium | compelling | The pocketed lamb is first seen stiff at Glinda's with no hint on the road | fixed | 2026-10-24 |
| SR-20261024-643 | atlas/A12/reader.md<br>atlas/A13/reader.md<br>atlas/A14/reader.md<br>atlas/A12/sprout.md<br>atlas/A13/sprout.md | cross-story | Medium | child-read | Standard tags out of band: 42 K-2 C3 codes in the reader files, grade-4 NGSS in sprout, and several that don't fit | fixed | 2026-10-24 |
| SR-20261024-644 | atlas/A12/sprout.md<br>atlas/A13/sprout.md<br>atlas/A14/sprout.md | cross-story | Medium | child-read | All three sprout files keep idioms and reversed meanings a 3-to-6 child takes literally | fixed | 2026-10-24 |
| SR-20261024-645 | atlas/A14/sprout.md<br>atlas/A15/main.md | cross-story | Medium | follow | Corvin callbacks lean on a man the reader may not place: unnamed in A15's default lines, unexplained in A14 sprout | fixed | 2026-10-24 |
| SR-20261024-646 | atlas/A12/main.md<br>atlas/A13/main.md<br>atlas/A14/main.md<br>atlas/A15/main.md | cross-story | Medium | humour | The Nubbin already keeps a souvenir on two pages; make it a running gag across the Atlas | fixed | 2026-10-24 |
| SR-20261024-647 | atlas/A17/reader.md | a17-10-plant | Critical | continuity | The seed lesson's wrong-answer reply and parent note teach 3 x 4 = 12 for a 2-rows-of-4 question | fixed | 2026-10-24-2 |
| SR-20261024-648 | atlas/A18/main.md | a18-16-complete | Critical | continuity | The merchant's promised thimble and his "who won" running joke never pay off; pay both off in A16_HOME | fixed | 2026-10-24-2 |
| SR-20261024-649 | atlas/A15/reader.md | a15-14-secret | High | child-read | The lesson says tell a grown-up about "any secret a grown-up asks you to keep, like this one", then rewards keeping Oz's secret | fixed | 2026-10-24-2 |
| SR-20261024-650 | atlas/A18/main.md | a18-16-complete | High | follow | "Vasilisa gives your Nubbin a painted doll" reads as her giving away the doll; say it is a little copy | fixed | 2026-10-24-2 |
| SR-20261024-651 | atlas/A18/sprout.md | a18-13-throw | High | child-read | The sprout band shows only a lantern with eyes, but its speaker label still reads "The Skull" | fixed | 2026-10-24-2 |
| SR-20261024-652 | atlas/A15/sprout.md | a15-14-screen-done | High | child-read | "Somebody in the valley says safe... As if it came in a bottle" is an unnamed callback plus irony a 4-year-old can't decode | fixed | 2026-10-24-2 |
| SR-20261024-653 | atlas/A16/reader.md | a16-04-chairs | High | follow | "Lost count after forty" sunsets collides with the lesson's forty chair-steps, and "four steps a sunset" is only said inside the lesson | fixed | 2026-10-24-2 |
| SR-20261024-654 | atlas/A17/sprout.md | a17-02-granny | High | child-read | The choice thanks Kanta "for the basket", but the sprout scene never shows a basket | fixed | 2026-10-24-2 |
| SR-20261024-655 | atlas/A16/main.md | a16-14-pills | High | humour | A16-14 has no laugh; give the merchant a dry exchange and the switchman a Nubbin gag (no pill is ever taken) | fixed | 2026-10-24-2 |
| SR-20261024-656 | atlas/A18/main.md, atlas/A18/sprout.md, atlas/A18/reader.md | a18-09-supper | High | humour | Let Baba Yaga answer the Nubbin's grief over the goose: "It was a small goose." | fixed | 2026-10-24-2 |
| SR-20261024-657 | atlas/A18/main.md | a18-04-years | High | humour | A18-4 is the page's flattest quest; give the suitors one goose | fixed | 2026-10-24-2 |
| SR-20261024-658 | atlas/A15/reader.md | a15-12-complete | High | humour | The malleable-gold lesson sits between the Winkies' gift and its punchline | fixed | 2026-10-24-2 |
| SR-20261024-659 | atlas/A15/sprout.md | a15-14-voice | High | humour | The Lion's roar gets no answer; let the great and terrible voice squeak | fixed | 2026-10-24-2 |
| SR-20261024-660 | atlas/A16/main.md | a16-08-desk | High | humour | The Businessman says "I'll lose my place" and never meets the Nubbin; let it make him lose it | fixed | 2026-10-24-2 |
| SR-20261024-661 | atlas/A17/sprout.md | a17-05-garden | High | humour | Mr Kusakabe's "Is she? Good for her." is the deadpan of the page, but "half an eye" is an idiom and the set-up line is cut | fixed | 2026-10-24-2 |
| SR-20261024-662 | atlas/A16/reader.md | a16-05-complete | High | compelling | Two lessons explain the Rose's best beats before the story lands them | fixed | 2026-10-24-2 |
| SR-20261024-663 | atlas/A16/main.md, atlas/A16/reader.md | a16-15-well | Medium | humour | Bring back the pilot's "It's mostly muttering" system when he hauls the bucket | fixed | 2026-10-24-2 |
| SR-20261024-664 | atlas/A17/main.md | a17-04-ride | Medium | follow | "It's all downhill. Going." reads as a typo; make the joke plain and pay it off in the race | fixed | 2026-10-24-2 |
| SR-20261024-665 | atlas/A17/main.md | a17-06-hollow | Medium | humour | "It's a big rumbly one" wastes the name gag; let Mei try to say it | fixed | 2026-10-24-2 |
| SR-20261024-666 | atlas/A17/main.md | a17-08-field-done | Medium | humour | Mei's corn gets one beat with the hungry Nubbin, planting the corn for A17-13 and A17-16 | fixed | 2026-10-24-2 |
| SR-20261024-667 | atlas/A17/main.md | a17-14-tunnel-hunt-done | Medium | humour | Kanta's frantic ride needs one breath of relief beside the fear | fixed | 2026-10-24-2 |
| SR-20261024-668 | atlas/A17/main.md | a17-15-complete | Medium | humour | Pay off Mei's "One, two, five, nine" counting on the Catbus | fixed | 2026-10-24-2 |
| SR-20261024-669 | atlas/A18/main.md | a18-13-throw | Medium | humour | After the skull's grave first words, give it one dry request | fixed | 2026-10-24-2 |
| SR-20261024-670 | atlas/A18/main.md | a18-06-wick | Medium | humour | In the dark, the sisters' cowardice gets one slapstick beat | fixed | 2026-10-24-2 |
| SR-20261024-671 | atlas/A18/main.md | a18-02-cellar | Medium | follow | The verified lifted line breaks the narrator's voice without warning; frame it as the old book speaking | fixed | 2026-10-24-2 |
| SR-20261024-672 | atlas/A15/reader.md | a15-16-complete-promised | Medium | follow | The Guardian winks "the wink of a man who has been told a secret too", but nobody told him | fixed | 2026-10-24-2 |
| SR-20261024-673 | atlas/A15/reader.md | a15-20-goodbye-done | Medium | humour | "Why is Glinda's remark funny?" explains the joke straight after it | fixed | 2026-10-24-2 |
| SR-20261024-674 | atlas/A15/reader.md | a15-20-glinda | Medium | pacing | The silver lesson cuts in between "You could have gone home the day you came" and "The very first day?" | fixed | 2026-10-24-2 |
| SR-20261024-675 | atlas/A15/reader.md | a15-14-screen-done | Medium | follow | "Somebody in the valley" and "You knew a man like this" name nobody | fixed | 2026-10-24-2 |
| SR-20261024-676 | atlas/A15/reader.md | a15-20-goodbye-promised | Medium | humour | "Law one: nobody looks behind screens" contradicts the lesson's fair-law answer; let the Scarecrow notice | fixed | 2026-10-24-2 |
| SR-20261024-677 | atlas/A15/reader.md | a15-18-complete | Medium | child-read | The Lion's theme question repeats a15-15's "going on despite fear" almost word for word | fixed | 2026-10-24-2 |
| SR-20261024-678 | atlas/A15/sprout.md | a15-03-feet | Medium | humour | "Your Nubbin walks slowly. He copies every step." is ambiguous and wastes a copycat gag | fixed | 2026-10-24-2 |
| SR-20261024-679 | atlas/A15/sprout.md | a15-09-streets-done | Medium | humour | The Emerald City walk is the flattest stretch; give the Lion a green cat to be brave at | fixed | 2026-10-24-2 |
| SR-20261024-680 | atlas/A16/main.md | a16-03-weeding | Medium | humour | Weeding has one joke at the very end; give the Nubbin the pull | fixed | 2026-10-24-2 |
| SR-20261024-681 | atlas/A16/main.md | a16-15-night | Medium | continuity | "All four of you" miscounts when Sable came (a16-sable = came puts her on every scene) | fixed | 2026-10-24-2 |
| SR-20261024-682 | atlas/A16/reader.md | a16-12-complete | Medium | compelling | The renard lesson spoils the Fox's entrance ("the one who teaches the boy the biggest lesson of all") | fixed | 2026-10-24-2 |
| SR-20261024-683 | atlas/A16/reader.md | a16-15-complete | Medium | continuity | The band stops before A16-16, so the sheep's muzzle from A16-2 never closes; hand it over at the well | fixed | 2026-10-24-2 |
| SR-20261024-684 | atlas/A16/reader.md | a16-12-echo | Medium | humour | Let the Nubbin lose an argument with the echo | fixed | 2026-10-24-2 |
| SR-20261024-685 | atlas/A16/reader.md | a16-14-pills | Medium | humour | Same fix as main: a dry merchant exchange, and a Nubbin who refuses the tray (nobody takes a pill) | fixed | 2026-10-24-2 |
| SR-20261024-686 | atlas/A17/sprout.md | a17-09-wait | Medium | humour | "As if you are interesting weather" is irony a 4-year-old won't catch; play it as a staring game | fixed | 2026-10-24-2 |
| SR-20261024-687 | atlas/A17/sprout.md | a17-grove-oak | Medium | child-read | Moss's "You cheated" may read to a 5-year-old as a telling-off; keep him dry but clear | fixed | 2026-10-24-2 |
| SR-20261024-688 | atlas/A17/reader.md | a17-09-walk-done | Medium | humour | Before the "when to ask for help" lesson, let Mei snore and the Nubbin help badly | fixed | 2026-10-24-2 |
| SR-20261024-689 | atlas/A17/reader.md | a17-01-unload | Medium | humour | Give the rotten post a slow fall before the fungi lesson | fixed | 2026-10-24-2 |
| SR-20261024-690 | atlas/A17/reader.md | a17-07-return | Medium | humour | Kanta deals with feelings by eating; let Granny land the umbrella's return | fixed | 2026-10-24-2 |
| SR-20261024-691 | atlas/A18/reader.md, atlas/A18/sprout.md | a18-14-stare | Medium | humour | "The light never once looks at you" is a ready-made joke; let the Nubbin be offended | fixed | 2026-10-24-2 |
| SR-20261024-692 | atlas/A18/reader.md | a18-14-door-done | Medium | follow | "North wall to east wall is south-east" has no single answer; give the room a door | fixed | 2026-10-24-2 |
| SR-20261024-693 | atlas/A18/reader.md | a18-11-poppy-done | Medium | child-read | The glossary defines "tint" but the lesson teaches "shade" | fixed | 2026-10-24-2 |
| SR-20261024-694 | atlas/A18/reader.md | a18-08-who-done | Medium | humour | The bolts' 2-4-6-8 pattern needs a Nubbin counting along and running out of paws | fixed | 2026-10-24-2 |
| SR-20261024-695 | atlas/A18/reader.md | a18-13-carry | Medium | humour | The skull's "Nearly there" becomes a running gag | fixed | 2026-10-24-2 |
| SR-20261024-696 | atlas/A18/sprout.md | a18-05-journey | Medium | follow | "The woman with the map ... who won" has no referent in the sprout band | fixed | 2026-10-24-2 |
| SR-20261024-697 | atlas/A18/sprout.md | a18-14-door | Medium | child-read | The sisters' complaint needs a refrain a child can join | fixed | 2026-10-24-2 |
| SR-20261024-698 | atlas/A18/sprout.md | a18-10-chores | Medium | child-read | "A quarter of oats" is an unexplained old measure for ages 3 to 6 | fixed | 2026-10-24-2 |
| SR-20261024-699 | atlas/A15/reader.md | a15-15-brains-done | Nice | humour | Give the symmetry lesson a Nubbin who checks itself | fixed | 2026-10-24-2 |
| SR-20261024-700 | atlas/A16/reader.md | a16-13-hour | Nice | humour | On the fourth day the fox arrives early and pretends not to have | fixed | 2026-10-24-2 |
| SR-20261024-701 | atlas/A17/reader.md | a17-07-complete | Nice | child-read | Three of Granny's idioms will be taken literally by a 7-year-old | fixed | 2026-10-24-2 |
| SR-20261024-702 | atlas/A15/reader.md, atlas/A16/reader.md, atlas/A17/reader.md, atlas/A18/reader.md | cross-story | High | follow | Lesson numbers that the scene never says; put each one in a story line (or change the sum) | fixed | 2026-10-24-2 |
| SR-20261024-703 | atlas/A15/sprout.md, atlas/A15/reader.md, atlas/A16/reader.md, atlas/A17/sprout.md, atlas/A17/reader.md, atlas/A18/sprout.md, atlas/A18/reader.md | cross-story | High | pacing | Lessons land on grave beats in all seven band files; move each to just after the comfort | fixed | 2026-10-24-2 |
| SR-20261024-704 | atlas/A16/main.md, atlas/A17/main.md, atlas/A18/main.md | cross-story | High | humour | Running gag: the Nubbin's keepsake list from A15 grows on every page, until your pocket gives up | fixed | 2026-10-24-2 |
| SR-20261024-705 | atlas/A15/reader.md, atlas/A16/reader.md, atlas/A17/reader.md, atlas/A18/reader.md | cross-story | High | child-read | 145 reader-band lessons carry K-2 codes; re-tag from the approved list only, or drop the tag | fixed | 2026-10-24-2 |
| SR-20261024-706 | atlas/A15/sprout.md, atlas/A17/sprout.md, atlas/A15/reader.md, atlas/A16/reader.md, atlas/A17/reader.md, atlas/A18/reader.md | cross-story | Medium | child-read | Lesson replies run long: 26 sprout replies over 14 words and 13 reader replies over 30; trim each to one idea | fixed | 2026-10-24-2 |
| SR-20261024-707 | atlas/A21/main.md | a21-04-complete | High | follow | Two speakers are both labelled "Fern"; show the Grove neighbour as "Keeper Fern" on this page | fixed | 2026-10-24-3 |
| SR-20261024-708 | atlas/A22/main.md | a22-09-job-done | High | humour | The dinner's shared done scene is one flat line; bring back Pepa's cloud and Félix's umbrellas | fixed | 2026-10-24-3 |
| SR-20261024-709 | atlas/A21/main.md | a21-16-complete | High | humour | Himmel's ring has no set-up; give it the kneeling story and a mirror-lotus Keeper Fern won't explain | fixed | 2026-10-24-3 |
| SR-20261024-710 | atlas/A20/main.md | a20-15-company | High | theme | Let Líf and Lífthrasir bicker over one dewy leaf, so the long winter has a couple in it | fixed | 2026-10-24-3 |
| SR-20261024-711 | atlas/A20/main.md | a20-04-field | High | humour | The last laugh before Baldr dies: escalate Thor's throws to the millstone, with Fulla as straight man | fixed | 2026-10-24-3 |
| SR-20261024-712 | atlas/A22/main.md | a22-12-room | High | follow | Isabela's "How do you know that?" is never answered; let her own roses give her away | fixed | 2026-10-24-3 |
| SR-20261024-713 | atlas/A19/main.md | a19-05-gronckle | High | humour | Give the arena round a laugh before Gobber's warning: the Gronckle's shot makes a window | fixed | 2026-10-24-3 |
| SR-20261024-714 | atlas/A19/sprout.md | a19-07-knife | High | continuity | Sprout cut the eel from the knife scene, so A19-10's eel trick comes from nowhere | fixed | 2026-10-24-3 |
| SR-20261024-715 | atlas/A20/sprout.md | a20-13-ash | High | humour | Thor's "You are not the fish" has no knotted Nubbin to say it to; put the Nubbin in the net | fixed | 2026-10-24-3 |
| SR-20261024-716 | atlas/A22/sprout.md | a22-02-market | High | humour | Restore Pepa's "What cloud?": the page's running gag starts here | fixed | 2026-10-24-3 |
| SR-20261024-717 | atlas/A20/sprout.md | a20-06-field | High | theme | The fair-play lesson agrees with the trick that kills Baldr; make it about checking first | fixed | 2026-10-24-3 |
| SR-20261024-718 | atlas/A19/reader.md | a19-18-complete | High | child-read | The finale's lesson gets the story wrong and sits between the saddle and the fish | fixed | 2026-10-24-3 |
| SR-20261024-719 | atlas/A19/main.md | a19-18-village | High | humour | The dragons-in-Berk finale needs Gobber losing his forge to a Nadder | fixed | 2026-10-24-3 |
| SR-20261024-720 | atlas/A19/main.md | a19-03-hall | High | humour | "Gobber stays" is a straight-man gift; let Gobber complain before the fleet sails | fixed | 2026-10-24-3 |
| SR-20261024-721 | atlas/A19/sprout.md | a19-01-arrive-done | High | humour | Bring back "mind the ceiling" as a rule-of-three with a Nubbin bonk | fixed | 2026-10-24-3 |
| SR-20261024-722 | atlas/A19/reader.md | a19-01-raid | High | child-read | 23 opinion lessons where every answer is "That's a fair answer"; keep one per quest at most | fixed | 2026-10-24-3 |
| SR-20261024-723 | atlas/A20/reader.md | a20-11-complete | High | child-read | A negative-number sum tagged as grade 2, with a temperature the scene never gives | fixed | 2026-10-24-3 |
| SR-20261024-724 | atlas/A20/sprout.md | a20-17-old-ground | High | child-read | Four new names in one line for 3 to 6s; keep Vídarr and drop the other three | fixed | 2026-10-24-3 |
| SR-20261024-725 | atlas/A19/main.md | a19-01-launcher-done | Medium | humour | Hiccup says the launcher "will probably go off on the way"; let it go off at a sheep | fixed | 2026-10-24-3 |
| SR-20261024-726 | atlas/A19/main.md | a19-17-complete | Medium | humour | Give Gobber one grumble on the voyage home, and it sets up the dragon on Hiccup's bed | fixed | 2026-10-24-3 |
| SR-20261024-727 | atlas/A22/main.md | a22-15-complete | Medium | humour | Show Abuela being bad with a trowel instead of saying it, in all three versions | fixed | 2026-10-24-3 |
| SR-20261024-728 | atlas/A21/main.md | a21-13-statues | Medium | humour | Set up the statue pose as a joke before Himmel's grave line turns it | fixed | 2026-10-24-3 |
| SR-20261024-729 | atlas/A21/main.md | a21-20-gate | Medium | humour | The mimic gag never says goodbye; let Stark pass it on at the gate | fixed | 2026-10-24-3 |
| SR-20261024-730 | atlas/A20/main.md | a20-05-water | Medium | humour | The thimble is set up and dropped in all three versions; give it one drop and a ceremony | fixed | 2026-10-24-3 |
| SR-20261024-731 | atlas/A22/main.md | a22-09-eyes | Medium | humour | Señora Guzmán sits under the falling dresser complimenting a soup full of roses | fixed | 2026-10-24-3 |
| SR-20261024-732 | atlas/A22/main.md | a22-16-complete | Medium | humour | Close the chairs gag at the goodbye | fixed | 2026-10-24-3 |
| SR-20261024-733 | atlas/A22/main.md | a22-02-kitchen | Medium | theme | Julieta and Agustín never bicker; give them the bee | fixed | 2026-10-24-3 |
| SR-20261024-734 | atlas/A20/main.md | a20-07-sleipnir | Medium | humour | The Nubbin envies Sleipnir's legs; give Hermódr the dry answer (and sprout the leg count) | fixed | 2026-10-24-3 |
| SR-20261024-735 | atlas/A21/main.md | a21-08-qual | Medium | humour | Qual is outraged at being blocked; let the elder admit he dusted him every spring | fixed | 2026-10-24-3 |
| SR-20261024-736 | atlas/A19/main.md | a19-16-draw | Medium | character | Stoick and Gobber's forty years are told, never shown; give Gobber one jab on the burning deck | fixed | 2026-10-24-3 |
| SR-20261024-737 | atlas/A22/main.md | a22-05-plan | Medium | humour | Show what Mirabel's back-of-the-hand list says | fixed | 2026-10-24-3 |
| SR-20261024-738 | atlas/A19/sprout.md | a19-01-raid | Medium | humour | Put main's surprised sheep back into the raid | fixed | 2026-10-24-3 |
| SR-20261024-739 | atlas/A20/sprout.md | a20-01-hall-done | Medium | humour | Baldr tiptoes round the sleeping Nubbin (both bands) | fixed | 2026-10-24-3 |
| SR-20261024-740 | atlas/A19/sprout.md | a19-13-chain | Medium | child-read | "Says something unkind" is vague; say it plainly and add one small comfort after | fixed | 2026-10-24-3 |
| SR-20261024-741 | atlas/A20/main.md | a20-13-house | Medium | follow | Loki is first named as if known, and Kvasir is missing from the cast | fixed | 2026-10-24-3 |
| SR-20261024-742 | atlas/A21/main.md | a21-11-ghost | Medium | follow | "The colour Bramble was before the rail" assumes the player knows Bramble and the rail | fixed | 2026-10-24-3 |
| SR-20261024-743 | atlas/A21/main.md | a21-14-plan-done | Medium | follow | Linie is named once and never introduced; one tag, and Stark's joke still works | fixed | 2026-10-24-3 |
| SR-20261024-744 | atlas/A19/main.md | a19-15-go | Medium | continuity | "Five dragons go up" but only four were matched; both bands already say four | fixed | 2026-10-24-3 |
| SR-20261024-745 | atlas/A19/sprout.md | a19-15-go | Medium | follow | "Toothless knows the way" while Toothless is chained on a ship | fixed | 2026-10-24-3 |
| SR-20261024-746 | atlas/A19/sprout.md | a19-15-pens | Medium | child-read | "If this is a trick, I am too good-looking to eat" is vanity wrapped in an idiom | fixed | 2026-10-24-3 |
| SR-20261024-747 | atlas/A19/sprout.md | a19-05-arena | Medium | child-read | Six names in one scene, and the lesson counts Tuffnut, who never speaks | fixed | 2026-10-24-3 |
| SR-20261024-748 | atlas/A20/reader.md | a20-15-plain | Medium | child-read | "The small ones went still in the long grass" needs the White Year and hints at Nubbins dying | fixed | 2026-10-24-3 |
| SR-20261024-749 | atlas/A19/reader.md | a19-17-dive | Medium | child-read | Doppler is beyond the band and splits the dive; teach "a coming sound gets louder" after the beat | fixed | 2026-10-24-3 |
| SR-20261024-750 | atlas/A22/sprout.md | a22-02-cousins | Medium | child-read | The "what makes you you" lesson asks about Camilo before he appears | fixed | 2026-10-24-3 |
| SR-20261024-751 | atlas/A22/sprout.md | a22-01-story | Medium | follow | Say that the little girl is Mirabel, and say out loud that ten years go by | fixed | 2026-10-24-3 |
| SR-20261024-752 | atlas/A22/sprout.md | a22-09-ears | Medium | child-read | "And Mariano, and I always…" means nothing to a small child; show the blush, keep the secret | fixed | 2026-10-24-3 |
| SR-20261024-753 | atlas/A22/sprout.md | a22-07-door | Medium | child-read | Three read-aloud stumbles: a "she" with no name, a quote inside a quote, and irony | fixed | 2026-10-24-3 |
| SR-20261024-754 | atlas/A22/reader.md | a22-03-complete | Medium | continuity | "Ten Madrigals crowd round Antonio" lists Antonio among the ten | fixed | 2026-10-24-3 |
| SR-20261024-755 | atlas/A22/reader.md | a22-01-casita | Medium | child-read | Swap the idioms a 7 to 10 reader takes literally, and keep Bruno's "opinions" | fixed | 2026-10-24-3 |
| SR-20261024-756 | atlas/A22/main.md | a22-15-village | Nice | humour | Camilo with only his own face is a free joke | fixed | 2026-10-24-3 |
| SR-20261024-757 | atlas/A20/main.md | a20-02-oil | Nice | humour | One small smile before Baldr's dreams: the Nubbin and the jar lid | fixed | 2026-10-24-3 |
| SR-20261024-758 | atlas/A20/main.md | a20-17-pieces | Nice | humour | Hödr backs up Baldr's losing streak | fixed | 2026-10-24-3 |
| SR-20261024-759 | atlas/A20/sprout.md | a20-09-dales | Nice | humour | A sleepy counting gag in the long dark ride | fixed | 2026-10-24-3 |
| SR-20261024-760 | atlas/A20/sprout.md | a20-margin-hazel | Nice | follow | "Don't be cross with her" has no "her" on the page | fixed | 2026-10-24-3 |
| SR-20261024-761 | atlas/A19/reader.md | a19-08-complete | Nice | child-read | Cut two narrator lines that announce the lesson before it is asked | fixed | 2026-10-24-3 |
| SR-20261024-762 | atlas/A19/reader.md, atlas/A20/reader.md, atlas/A22/reader.md, atlas/A22/sprout.md | cross-story | High | child-read | About a quarter of reader-band lessons carry K-2 tags; re-tag from the approved 3–5 list | fixed | 2026-10-24-3 |
| SR-20261024-763 | atlas/A19/reader.md, atlas/A20/reader.md, atlas/A22/reader.md, atlas/A22/sprout.md | cross-story | High | pacing | Fourteen lessons sit inside grave beats; move each to just after the beat lands | fixed | 2026-10-24-3 |
| SR-20261024-764 | atlas/A19/reader.md, atlas/A20/reader.md, atlas/A22/reader.md | cross-story | High | humour | Lessons that split a punchline or a leap from its payoff | fixed | 2026-10-24-3 |
| SR-20261024-765 | atlas/A19/reader.md, atlas/A20/reader.md, atlas/A19/sprout.md | cross-story | Medium | child-read | Eleven maths lessons use numbers the scene never says ("Suppose…") | fixed | 2026-10-24-3 |
| SR-20261024-766 | atlas/A19/sprout.md, atlas/A20/reader.md, atlas/A22/sprout.md, atlas/A22/reader.md | cross-story | Medium | child-read | Four lesson replies run over the band cap; trim each | fixed | 2026-10-24-3 |
| SR-20261025-767 | atlas/A26/sprout.md | a26-17-test | Critical | child-read | Uta-Napishtim says "six days", then the scene counts seven loaves; make it seven days | fixed | 2026-10-25 |
| SR-20261025-768 | atlas/A23/reader.md | a23-10-help | Critical | continuity | The think question quotes a Timon line no child has heard yet; say it in the scene and pay it off as a gag | fixed | 2026-10-25 |
| SR-20261025-769 | atlas/A26/main.md | a26-17-tale, a26-17-test-done | High | humour | Let Uta-Napishtim's wife correct his flood story, and count the loaves right (seven, not six) | fixed | 2026-10-25 |
| SR-20261025-770 | atlas/A23/reader.md | a23-12-complete-rafiki | High | continuity | "Noon at the thorns" contradicts the two-day desert crossing; stop for shade at noon instead | fixed | 2026-10-25 |
| SR-20261025-771 | atlas/A25/reader.md | a25-14-name-done | High | child-read | Delete the candle-flame lesson that lands on the climax and contradicts it | fixed | 2026-10-25 |
| SR-20261025-772 | atlas/A24/sprout.md | a24-18-home | High | child-read | The lesson calls Kotick's push unkind seconds after his father cheers it; teach not giving up instead | fixed | 2026-10-25 |
| SR-20261025-773 | atlas/A26/sprout.md | a26-05-bread | High | continuity | Put back Enkidu licking the bread, so "I licked it first" in A26-13 lands, and give it a crunch | fixed | 2026-10-25 |
| SR-20261025-774 | atlas/A25/main.md, atlas/A25/reader.md | a25-10-voice-done | High | humour | Show Atreyu's terrible first rhyme before he looks to you for help | fixed | 2026-10-25 |
| SR-20261025-775 | atlas/A25/main.md | a25-15-lion-done | High | humour | The lion turned to stone mid-word; at dawn, let him finish it | fixed | 2026-10-25 |
| SR-20261025-776 | atlas/A24/main.md, atlas/A24/sprout.md, atlas/A24/reader.md | a24-12-dry | High | humour | "I'm half the bear I was": the Nubbin goes looking for the other half | fixed | 2026-10-25 |
| SR-20261025-777 | atlas/A26/main.md | a26-15-gate | High | humour | Make the scorpion pair a long-married couple: he guards the gate, she wants to keep the Nubbin | fixed | 2026-10-25 |
| SR-20261025-778 | atlas/A25/main.md | a25-20-shop | High | humour | The Nubbin sneezes behind the bell, and Coreander says "Bless you" to nobody | fixed | 2026-10-25 |
| SR-20261025-779 | atlas/A26/main.md | a26-18-wall | High | compelling | The king stops halfway through "That's what I made" and says "we" | fixed | 2026-10-25 |
| SR-20261025-780 | atlas/A25/main.md | a25-09-complete | High | humour | Atreyu files Engywook's "Report back" at the Oracle's door | fixed | 2026-10-25 |
| SR-20261025-781 | atlas/A25/main.md | a25-15-sand | High | follow | Stage the moment Bastian first meets you in Fantastica | fixed | 2026-10-25 |
| SR-20261025-782 | atlas/A23/main.md | a23-16-green | High | humour | Zazu's guest list pays off at the second presentation | fixed | 2026-10-25 |
| SR-20261025-783 | atlas/A23/main.md, atlas/A23/sprout.md, atlas/A23/reader.md | a23-16-complete | High | humour | "Hornbills are excellent at…" ends with Zazu at the front by accident | fixed | 2026-10-25 |
| SR-20261025-784 | atlas/A23/sprout.md | a23-05-chase | High | humour | Zazu's "stay in a line" rule pays off in the flamingos | fixed | 2026-10-25 |
| SR-20261025-785 | atlas/A24/sprout.md | a24-18-search | High | humour | Give back the gulls' "Clam-crack!" chant as a refrain the child can join | fixed | 2026-10-25 |
| SR-20261025-786 | atlas/A23/sprout.md | a23-10-help | High | child-read | Swap Timon's ironic "Thanking is how they get you" for a joke a four-year-old can follow | fixed | 2026-10-25 |
| SR-20261025-787 | atlas/A26/sprout.md | a26-12-fight | High | humour | The Bull's dust makes everybody sneeze, and the sound-word lesson gets "Achoo!" | fixed | 2026-10-25 |
| SR-20261025-788 | atlas/A26/main.md | a26-12-complete | Medium | humour | Enkidu's first chariot ride, eyes shut, holding on to the king | fixed | 2026-10-25 |
| SR-20261025-789 | atlas/A23/main.md | a23-16-green | Medium | humour | Rafiki's "tea for nobody, twice" ends with tea for somebody | fixed | 2026-10-25 |
| SR-20261025-790 | atlas/A23/main.md | a23-02-paints | Medium | humour | The third branch "has opinions"; let it voice one | fixed | 2026-10-25 |
| SR-20261025-791 | atlas/A23/main.md | a23-12-hunt-done-rafiki | Medium | continuity | On the Rafiki path, let Timon meet you and name the "dumpling" | fixed | 2026-10-25 |
| SR-20261025-792 | atlas/A24/main.md | a24-06-feed | Medium | humour | The Nubbin tries to blow on the coals and produces a wet noise | fixed | 2026-10-25 |
| SR-20261025-793 | atlas/A24/main.md, atlas/A24/sprout.md | a24-15-lamp-mowgli | Medium | humour | On the Mowgli road Messua nearly remembers you, by the feathers | fixed | 2026-10-25 |
| SR-20261025-794 | atlas/A24/main.md | a24-10-complete | Medium | compelling | Show the season of hunting with one rabbit-hole beat | fixed | 2026-10-25 |
| SR-20261025-795 | atlas/A24/main.md | a24-09-bounty-done | Medium | humour | Buldeo's "very large story" gets a size, and Akela a dry reply | fixed | 2026-10-25 |
| SR-20261025-796 | atlas/A24/main.md, atlas/A24/reader.md | a24-18-cows | Medium | humour | The Nubbin tries its kettle howl on the silent Sea Cows | fixed | 2026-10-25 |
| SR-20261025-797 | atlas/A24/reader.md | a24-14-plan-done | Medium | humour | Kaa gives the Nubbin the bravest job: keeping still while a bee lands on it | fixed | 2026-10-25 |
| SR-20261025-798 | atlas/A24/sprout.md | a24-17-beach | Medium | child-read | One new name in the seal beach scene, and say who Matkah is | fixed | 2026-10-25 |
| SR-20261025-799 | atlas/A24/sprout.md | a24-17-drove | Medium | child-read | Replace the ominous "They do not come back" with a plain, gentle line | fixed | 2026-10-25 |
| SR-20261025-800 | atlas/A24/reader.md | a24-05-complete | Medium | child-read | Square Bagheera's soft cuffs with A24-3's "Nobody hits here" in the lesson stem | fixed | 2026-10-25 |
| SR-20261025-801 | atlas/A24/sprout.md, atlas/A24/reader.md | A24-16 title | Medium | follow | Retitle the bands' A24-16 "Man Goes to Man", as in main | fixed | 2026-10-25 |
| SR-20261025-802 | atlas/A23/reader.md | a23-12-hunt-done-rafiki | Medium | humour | Let "There's a book in it" land as a joke instead of being explained by a quiz | fixed | 2026-10-25 |
| SR-20261025-803 | atlas/A23/reader.md | a23-07-complete | Medium | pacing | Cut the theme quiz that repeats a23-07-stars' courage question | fixed | 2026-10-25 |
| SR-20261025-804 | atlas/A23/sprout.md | a23-14-complete | Medium | child-read | Make Rafiki's stick lesson concrete for ages 3 to 6 | fixed | 2026-10-25 |
| SR-20261025-805 | atlas/A25/main.md | a25-18-battle | Medium | humour | One far-off voice still telling the grey-horse story, before the grave beat | fixed | 2026-10-25 |
| SR-20261025-806 | atlas/A25/reader.md | a25-02-fire | Medium | child-read | Four new names at one fire; keep Blubb and turn the rest into a joke about long names | fixed | 2026-10-25 |
| SR-20261025-807 | atlas/A25/reader.md | a25-09-mirror | Medium | child-read | Drop the symmetry quiz from the scene about how Bastian looks | fixed | 2026-10-25 |
| SR-20261025-808 | atlas/A26/main.md | a26-09-watch | Medium | humour | Play Enkidu's cheerful dream readings as an escalation, with Gilgamesh as the straight man | fixed | 2026-10-25 |
| SR-20261025-809 | atlas/A26/main.md | a26-04-sit-done | Medium | humour | The trapper in the bush asks if this is his cue | fixed | 2026-10-25 |
| SR-20261025-810 | atlas/A26/main.md | a26-16-siduri, a26-17-tale | Medium | follow | Finish the hanging quoted lines, and give Siduri's advice one plain line | fixed | 2026-10-25 |
| SR-20261025-811 | atlas/A26/sprout.md | a26-17-tale | Medium | child-read | Swap the 1872 museum fact for a story lesson about the raven, and give the wife her line | fixed | 2026-10-25 |
| SR-20261025-812 | atlas/A26/sprout.md | a26-17-test-done | Medium | humour | Gilgamesh knocks on the first loaf, and it rings like a brick | fixed | 2026-10-25 |
| SR-20261025-813 | atlas/A23/main.md | a23-12-hunt-done | Nice | follow | Name Simba in Nala's surprised question | fixed | 2026-10-25 |
| SR-20261025-814 | atlas/A26/main.md | a26-14-sickbed | Nice | continuity | Make it Enkidu, not the Nubbin, who praises the blanket | fixed | 2026-10-25 |
| SR-20261025-815 | atlas/A25/main.md | a25-17-night | Nice | follow | Point "I did ask" at the Amarganth scene it means | fixed | 2026-10-25 |
| SR-20261025-816 | atlas/A24/reader.md | a24-06-pot | Nice | child-read | Untangle the "her" in the fire-pot lesson reply | fixed | 2026-10-25 |
| SR-20261025-817 | atlas/A24/reader.md, atlas/A25/reader.md, atlas/A23/reader.md, atlas/A23/sprout.md, atlas/A26/sprout.md, atlas/A24/sprout.md | cross-story | High | child-read | Bring every lesson reply under the band's line cap; A24 reader has 64 over 30 words | fixed | 2026-10-25 |
| SR-20261025-818 | atlas/A23/sprout.md, atlas/A23/reader.md, atlas/A24/sprout.md, atlas/A25/reader.md, atlas/A26/sprout.md | cross-story | High | pacing | Move six lessons out of grave and turning-point beats, and keep the laugh beside them | fixed | 2026-10-25 |
| SR-20261025-819 | atlas/A24/sprout.md, atlas/A25/reader.md | cross-story | High | child-read | Add the comfort line after three deaths, and untangle Gmork's jaws | fixed | 2026-10-25 |
| SR-20261025-820 | atlas/A23/reader.md, atlas/A24/reader.md, atlas/A25/reader.md, atlas/A23/sprout.md, atlas/A24/sprout.md, atlas/A26/sprout.md | cross-story | Medium | child-read | Retag off-band standards, using only codes from EDU-STYLE's approved list | fixed | 2026-10-25 |
| SR-20261025-821 | atlas/A23/reader.md, atlas/A23/sprout.md, atlas/A24/reader.md, atlas/A25/reader.md, atlas/A26/sprout.md | cross-story | Medium | continuity | Seven lessons cite lines, names or numbers their scene never says; put each in the scene, with a laugh where it fits | fixed | 2026-10-25 |
| SR-20261025-822 | atlas/A27/main.md, atlas/A27/reader.md | a27-12-complete | Critical | continuity | Rudaba quotes a praise only one of the three a27-11-praise choices gives; make the callback true for every player | fixed | 2026-10-25-2 |
| SR-20261025-823 | atlas/A29/main.md, atlas/A29/reader.md | a29-16-complete (and -saw, -away) | High | humour | Pay off Bobby's two set-ups at the end: the Nubbin mug (A29-2) and Celine who "doesn't like me" (A29-4) | fixed | 2026-10-25-2 |
| SR-20261025-824 | atlas/A27/main.md | a27-05-words, a27-09-oath, a27-09-road, a27-09-complete | High | compelling | The word you teach the youth ("friend", "home" or "sorry") changes nothing; let each one come back the day Zal meets his father | fixed | 2026-10-25-2 |
| SR-20261025-825 | atlas/A27/main.md, atlas/A27/sprout.md, atlas/A27/reader.md | a27-17-complete (and -sat, -night); sprout a27-08-complete | High | humour | The smallest chick is set up four times (sits down hard, last to the figs, smallest first, stops eating) and never paid off; bring it to the birth | fixed | 2026-10-25-2 |
| SR-20261025-826 | atlas/A28/main.md, atlas/A28/sprout.md, atlas/A28/reader.md | a28-07-complete, a28-12-return, reader a28-12-return-done | High | humour | The "Nubbin sticks to everything" gag stops just where it is funniest: on a sticky shawl and on Nana Ama's stool | fixed | 2026-10-25-2 |
| SR-20261025-827 | atlas/A30/main.md | a30-07-flood | High | humour | The flood is the page's big laugh but escalates only once; give it two more beats before Dvora shouts | fixed | 2026-10-25-2 |
| SR-20261025-828 | atlas/A30/main.md | a30-01-page-done | High | follow | Shmuel and Mirele speak without ever being introduced; let Rivka introduce them with a joke that sets up Shmuel's questions | fixed | 2026-10-25-2 |
| SR-20261025-829 | atlas/A28/main.md, atlas/A28/reader.md, atlas/A28/sprout.md | a28-04-stopper-done (pays off in a28-08-debt-wisp) | High | humour | Plant the Wisp variant's "last of the swarm" gourd: Ananse pockets the late hornet as a spare | fixed | 2026-10-25-2 |
| SR-20261025-830 | atlas/A29/main.md | a29-14-complete | High | humour | Bobby's opening rule, "Never touch the girls' cases", comes back as he wakes up in the stadium | fixed | 2026-10-25-2 |
| SR-20261025-831 | atlas/A27/main.md | a27-09-complete | High | humour | The nurse who called the baby "a gift" gets the last word when he comes home | fixed | 2026-10-25-2 |
| SR-20261025-832 | atlas/A26/reader.md | a26-15-gate | High | humour | Give the scorpion-man's silent wife her line from the epic, as a wife correcting her husband | fixed | 2026-10-25-2 |
| SR-20261025-833 | atlas/A27/main.md | a27-13-roof | High | humour | Let Rudaba answer Zal's grand old line, so the lifted sentence becomes his character and their first joke as a couple | fixed | 2026-10-25-2 |
| SR-20261025-834 | atlas/A28/main.md, atlas/A28/reader.md | a28-08-debt-wisp | High | humour | One glove, eight feet: let Ananse notice the other seven | fixed | 2026-10-25-2 |
| SR-20261025-835 | atlas/A26/reader.md | a26-06-cups | High | humour | Gilgamesh "forgets to give it back"; let the Nubbin notice, wordlessly, and do the maths for the lesson | fixed | 2026-10-25-2 |
| SR-20261025-836 | atlas/A28/main.md, atlas/A28/sprout.md, atlas/A28/reader.md | a28-12-last-wisp (sprout also a28-12-last-driven) | High | follow | Say what the spider "threw in for nothing": the thief got a story of his own | fixed | 2026-10-25-2 |
| SR-20261025-837 | atlas/A26/reader.md | a26-18-wall | High | continuity | The area lesson contradicts its own scene: Gilgamesh says each orchard is a square mile, the lesson says 2 by 3 | fixed | 2026-10-25-2 |
| SR-20261025-838 | atlas/A27/reader.md | a27-09-oath (pays off in a27-14-letter, -sat, -night) | High | continuity | Zal's letter cites an oath the reader band cut; put Sam's promise back | fixed | 2026-10-25-2 |
| SR-20261025-839 | atlas/A27/main.md | a27-17-complete (and -sat, -night) | High | compelling | The old servant who carried baby Zal up the mountain should carry Zal's son | fixed | 2026-10-25-2 |
| SR-20261025-840 | atlas/A27/sprout.md | a27-17-fire-sat (and its step text a27-17-s2) | High | theme | The child is shown laying a feather on the fire, then taught that fire is only for grown-ups | fixed | 2026-10-25-2 |
| SR-20261025-841 | atlas/A28/sprout.md, atlas/A28/reader.md | a28-11-step | High | follow | Nothing says Anancy is Ananse, so a child meets "a new spider" in Jamaica | fixed | 2026-10-25-2 |
| SR-20261025-842 | atlas/A28/sprout.md, atlas/A27/sprout.md | a28-07-court-done, a28-10-funeral-done, a28-02-road-wisp, a28-10-complete, a28-11-gum; a27-06-complete, a27-14-letter-night | High | child-read | Sprout idioms and puns a 3 to 6 year old takes literally; replace each with a plain joke | fixed | 2026-10-25-2 |
| SR-20261025-843 | atlas/A30/main.md | a30-03-complete | High | humour | The rabbi left his coat on the peg in A30-2; bring it back the morning after the frightening night | fixed | 2026-10-25-2 |
| SR-20261025-844 | atlas/A29/main.md, atlas/A29/reader.md | a29-09-studio | Medium | humour | "Tell Bobby we said sorry about the studio" and the broken flower stand go nowhere; tape the bill to the keyboard | fixed | 2026-10-25-2 |
| SR-20261025-845 | atlas/A29/main.md | a29-08-watch | Medium | humour | "Can you look normal?" is a great set-up with one weak payoff; escalate it | fixed | 2026-10-25-2 |
| SR-20261025-846 | atlas/A29/main.md, atlas/A29/reader.md | a29-07-complete | Medium | continuity | "Of course you did" and the reader lesson both assume you read the note; in one branch only the Nubbin did | fixed | 2026-10-25-2 |
| SR-20261025-847 | atlas/A27/main.md | a27-12-roses-done | Medium | humour | Zal, raised by a bird, shoots a water-bird and nobody notices | fixed | 2026-10-25-2 |
| SR-20261025-848 | atlas/A27/main.md, atlas/A27/reader.md | a27-16-complete | Medium | pacing | A27-16 repeats A27-10's ending ("Sam goes back to the wars… patience and fairness") almost word for word | fixed | 2026-10-25-2 |
| SR-20261025-849 | atlas/A27/main.md, atlas/A27/reader.md | a27-12-boasts-done | Medium | follow | Pearls "so they'll wait": wait for what? | fixed | 2026-10-25-2 |
| SR-20261025-850 | atlas/A26/reader.md | a26-17-test-done | Medium | humour | "Your Nubbin guards them, mostly" is set up and never paid off | fixed | 2026-10-25-2 |
| SR-20261025-851 | atlas/A26/reader.md | a26-05-bread (pays off in a26-07-gate) | Medium | follow | Enkidu greets you as "The water-carrier!" before anyone has called you that | fixed | 2026-10-25-2 |
| SR-20261025-852 | atlas/A26/reader.md | a26-06-complete | Medium | continuity | The moon is "a thin silver curve" though Shamhat's days and the shepherds' camp have passed since the new moon | fixed | 2026-10-25-2 |
| SR-20261025-853 | atlas/A27/sprout.md | a27-05-words | Medium | child-read | Read aloud, "the word for a friend is dust" sounds like English dust | fixed | 2026-10-25-2 |
| SR-20261025-854 | atlas/A27/sprout.md | a27-06-mobeds | Medium | child-read | "Most animal parents stay" is untrue, and "Go away for ever" is bleak beside an abandoned baby | fixed | 2026-10-25-2 |
| SR-20261025-855 | atlas/A27/sprout.md | a27-14-kabul | Medium | follow | "The Shah is cross" with no reason given | fixed | 2026-10-25-2 |
| SR-20261025-856 | atlas/A27/reader.md | a27-10-banquet-done | Medium | humour | The "book of kings" lesson repeats A27-1; teach checkmate instead, on the Nubbin that ate three dishes | fixed | 2026-10-25-2 |
| SR-20261025-857 | atlas/A27/reader.md | a27-16-feast-done | Medium | child-read | Feathers trapping air is taught a third time; the scene (Sindokht refilling the Nubbin's plate) begs for fractions | fixed | 2026-10-25-2 |
| SR-20261025-858 | atlas/A28/sprout.md | a28-04-gourd | Medium | humour | "Your Nubbin brings half of one" is a good gag told flatly | fixed | 2026-10-25-2 |
| SR-20261025-859 | atlas/A28/sprout.md | a28-10-dance-done | Medium | humour | Beans fly everywhere and the Nubbin is not in the joke | fixed | 2026-10-25-2 |
| SR-20261025-860 | atlas/A28/sprout.md | a28-06-fairy-done | Medium | child-read | "Both of her hands are stuck. One hand. / Two hands." reads like a glitch | fixed | 2026-10-25-2 |
| SR-20261025-861 | atlas/A28/reader.md | a28-05-web-done | Medium | humour | The Nubbin stuck on the thread is a lesson set-up with no comedy | fixed | 2026-10-25-2 |
| SR-20261025-862 | atlas/A28/reader.md | a28-02-complete | Medium | follow | "That is why he promises so carefully, once he is out of earshot" confuses a 7 year old | fixed | 2026-10-25-2 |
| SR-20261025-863 | atlas/A28/main.md | a28-02-road | Medium | follow | "And one of those, you have" doesn't say what Ananse means, so "A specialist" lands late | fixed | 2026-10-25-2 |
| SR-20261025-864 | atlas/A30/main.md | a30-13-bench | Medium | character | Rabbi Loew recites a sentence from a 1904 encyclopedia, after saying he leaves the Name where it belongs | fixed | 2026-10-25-2 |
| SR-20261025-865 | atlas/A30/main.md | a30-11-table | Medium | humour | The Sabbath table after "Is Yossele dead?" has no awkward relief | fixed | 2026-10-25-2 |
| SR-20261025-866 | atlas/A28/main.md | a28-07-court | Nice | humour | The python's and leopard's grudges get only an elder "smiling at the floor" | fixed | 2026-10-25-2 |
| SR-20261025-867 | atlas/A29/main.md | a29-10-complete | Nice | humour | One umbrella, one tiger | fixed | 2026-10-25-2 |
| SR-20261025-868 | atlas/A28/sprout.md | a28-09-complete | Nice | continuity | "You keep the broken gourd" then "Two halves make one whole pot" | fixed | 2026-10-25-2 |
| SR-20261025-869 | atlas/A28/reader.md | a28-10-dance-done | Nice | humour | Show the bald head, don't just tell it | fixed | 2026-10-25-2 |
| SR-20261025-870 | atlas/A26/reader.md | a26-01-page-moss, a26-15-road | Nice | child-read | Moss's grandmother line muddles a child; one reader idiom | fixed | 2026-10-25-2 |
| SR-20261025-871 | atlas/A27/main.md, atlas/A27/reader.md | a27-06-dream-done | Nice | follow | "Call the mobeds" before anyone has said what a mobed is | fixed | 2026-10-25-2 |
| SR-20261025-872 | atlas/A27/reader.md | a27-04-night-done, a27-06-dream | Nice | pacing | The first half leans on L.4.5 simile lessons, and a27-04-night-done is one line plus a lesson | fixed | 2026-10-25-2 |
| SR-20261025-873 | atlas/A26/reader.md, atlas/A27/reader.md, atlas/A28/reader.md, atlas/A29/reader.md, atlas/A27/sprout.md, atlas/A28/sprout.md | cross-story | High | theme | Retag off-band standards: K-2 codes across all four reader bands, grade-4 codes in two sprout bands, using only approved codes | fixed | 2026-10-25-2 |
| SR-20261025-874 | atlas/A26/reader.md, atlas/A27/sprout.md, atlas/A27/reader.md, atlas/A28/reader.md, atlas/A29/reader.md | cross-story | High | pacing | Lessons that interrupt a grave beat or a punchline: move each one after the beat | fixed | 2026-10-25-2 |
| SR-20261025-875 | atlas/A26/reader.md, atlas/A28/reader.md, atlas/A29/reader.md | cross-story | High | child-read | Lessons that ask for facts the scene never says: put each fact into the story | fixed | 2026-10-25-2 |
| SR-20261025-876 | atlas/A29/reader.md, atlas/A28/reader.md, atlas/A27/sprout.md | cross-story | Medium | child-read | 26 lesson replies run over the band cap (A29 reader 22, A28 reader 3, A27 sprout 1); cut each to one fact and one reason | fixed | 2026-10-25-2 |
| SR-20261025-877 | atlas/A27/reader.md, atlas/A28/sprout.md, atlas/A26/reader.md | cross-story | Medium | follow | Names used before the story introduces them | fixed | 2026-10-25-2 |
| SR-20261025-878 | arcade/PA1/sprout.md | pa1-16-friends | Critical | child-read | The "count Sonic's friends" lesson wants five, but the scene names four | fixed | 2026-10-25-3 |
| SR-20261025-879 | arcade/PA3/main.md | pa3-03-promise | High | continuity | The grub sums don't add up: the freed grub is one of the twelve, so 34 are left for somebody else | fixed | 2026-10-25-3 |
| SR-20261025-880 | arcade/PA3/main.md | pa3-06-village | High | follow | "Ask Corvin" leans on S9, which PA3 never requires; swap it for a joke that stands alone | fixed | 2026-10-25-3 |
| SR-20261025-881 | atlas/A31/main.md | a31-09-roof | High | continuity | The rat says it will ride on your Nubbin, but on the stay branch your Nubbin never goes down | fixed | 2026-10-25-3 |
| SR-20261025-882 | atlas/A30/sprout.md | a30-09-order-safe | High | follow | Mirele appears twice in Sprout without ever being introduced | fixed | 2026-10-25-3 |
| SR-20261025-883 | atlas/A31/sprout.md | a31-15-curtain | High | follow | Say plainly what happens to the two great lords, and move the lesson out of the mercy beat | fixed | 2026-10-25-3 |
| SR-20261025-884 | arcade/PA3/main.md | pa3-18-complete-sealed | High | compelling | The sealed ending gives Elderbug's mask without Elderbug; let him hand it over | fixed | 2026-10-25-3 |
| SR-20261025-885 | atlas/A31/main.md | a31-11-lords | High | humour | Pay off the kitchen's guest rule in the lords' hall | fixed | 2026-10-25-3 |
| SR-20261025-886 | arcade/PA2/main.md | pa2-01-shed | High | theme | Open PA2 with the marriage: Byte's shoelace and Pixel saying nothing, loudly | fixed | 2026-10-25-3 |
| SR-20261025-887 | arcade/PA2/main.md | pa2-17-wake | High | humour | Everyone has forgotten: let Ash meet your Nubbin again, and Brock remember only Nurse Joy | fixed | 2026-10-25-3 |
| SR-20261025-888 | arcade/PA3/main.md | pa3-17-complete | High | humour | Pixel's biscuit runs all cartridge; end it under her on the floor | fixed | 2026-10-25-3 |
| SR-20261025-889 | arcade/PA1/main.md | pa1-16-friends | High | humour | Knuckles's "that thing doesn't lick it" rule finally gets broken, nearly | fixed | 2026-10-25-3 |
| SR-20261025-890 | arcade/PA1/main.md | pa1-16-complete | High | humour | Eggman comes down under his own face; the lifeboat parachute gag pays off | fixed | 2026-10-25-3 |
| SR-20261025-891 | arcade/PA1/main.md | pa1-11-board | High | humour | Run "I was going to ask about the tails" as Pixel's gag to the end of the cartridge | fixed | 2026-10-25-3 |
| SR-20261025-892 | atlas/A31/sprout.md<br>atlas/A31/reader.md | a31-10-relay | High | humour | Give the louse back its best line, let the punchline land, and count the carriers right | fixed | 2026-10-25-3 |
| SR-20261025-893 | atlas/A30/sprout.md<br>atlas/A30/reader.md | a30-11-table | High | humour | Pay off Hannah's daily burnt crust at the Sabbath table, in both bands | fixed | 2026-10-25-3 |
| SR-20261025-894 | arcade/PA1/sprout.md | pa1-05-spanner | High | humour | "Tell him it's a ten" is spanner jargon a four-year-old can't get; make the gag about shiny | fixed | 2026-10-25-3 |
| SR-20261025-895 | atlas/A30/sprout.md | a30-07-chores | High | humour | Give the chores scene a wordless Nubbin gag with Avram as the straight man | fixed | 2026-10-25-3 |
| SR-20261025-896 | arcade/PA2/main.md | pa2-05-lunch-done | High | humour | The first light scene after four grave quests ends flat; give Brock and the Nubbin the pot | fixed | 2026-10-25-3 |
| SR-20261025-897 | atlas/A30/reader.md | a30-02-study | High | child-read | The study house gives a child five new names in two scenes; keep Rava, cut the rest | fixed | 2026-10-25-3 |
| SR-20261025-898 | atlas/A31/reader.md | a31-10-corn | High | follow | Untangle the grandmother's "old book in English" aside and replace the repeated corn-cycle lesson | fixed | 2026-10-25-3 |
| SR-20261025-899 | atlas/A31/main.md<br>atlas/A31/reader.md | a31-11-lords | Medium | continuity | The "hot hearthstone" callback points at a scene that never happened | fixed | 2026-10-25-3 |
| SR-20261025-900 | atlas/A31/main.md | a31-09-roof | Medium | humour | Let your slow small jar be the only one that holds water, and Xmucane guess why | fixed | 2026-10-25-3 |
| SR-20261025-901 | atlas/A31/main.md | a31-07-macaw | Medium | humour | The granddaughter should react when the arm goes; the grandmother reassures and scolds | fixed | 2026-10-25-3 |
| SR-20261025-902 | atlas/A31/main.md | a31-08-earthquake | Medium | humour | One silly exchange before Earthquake sits down for good | fixed | 2026-10-25-3 |
| SR-20261025-903 | atlas/A31/main.md | a31-12-houses | Medium | humour | The Nubbin offers a jaguar its stick from A31-8 | fixed | 2026-10-25-3 |
| SR-20261025-904 | atlas/A31/main.md | a31-11-road | Medium | continuity | The polite mosquito has met you before; let it say so | fixed | 2026-10-25-3 |
| SR-20261025-905 | atlas/A31/main.md | a31-17-hearth | Medium | humour | Close the granddaughter's bad homework from the first scene | fixed | 2026-10-25-3 |
| SR-20261025-906 | arcade/PA2/main.md | pa2-06-complete | Medium | humour | Without s7Done, Byte's biscuit run becomes a running gag Pixel can comment on | fixed | 2026-10-25-3 |
| SR-20261025-907 | arcade/PA2/main.md | pa2-17-complete | Medium | humour | Pay off "I'm taking about forty" screenshots | fixed | 2026-10-25-3 |
| SR-20261025-908 | arcade/PA2/main.md | pa2-18-holiday | Medium | humour | Team Rocket's holiday earns a laugh, not only a smile | fixed | 2026-10-25-3 |
| SR-20261025-909 | arcade/PA2/main.md | pa2-09-pod | Medium | compelling | The signature naming choice is telegraphed; make both options sound kind | fixed | 2026-10-25-3 |
| SR-20261025-910 | arcade/PA1/main.md<br>arcade/PA1/sprout.md<br>arcade/PA1/reader.md | pa1-14-complete | Medium | continuity | Name Cinder when Pixel first sees "the same shape", so the PA1-18 variants land | fixed | 2026-10-25-3 |
| SR-20261025-911 | arcade/PA1/main.md<br>arcade/PA1/sprout.md<br>arcade/PA1/reader.md | pa1-18-complete | Medium | humour | Call back "your hair's gone a bit square" when the Keeper comes home | fixed | 2026-10-25-3 |
| SR-20261025-912 | arcade/PA1/main.md | pa1-09-fish-done | Medium | humour | Pixel's cup of tea goes cold while Big waits; let her impatience meet his patience | fixed | 2026-10-25-3 |
| SR-20261025-913 | arcade/PA1/main.md | pa1-11-garden-done | Medium | humour | With s21Done, give Clank a second PA1 line about the face parachutes | fixed | 2026-10-25-3 |
| SR-20261025-914 | arcade/PA3/main.md | pa3-17-complete | Medium | humour | With s21Done, give Clank one joyful beat after two sad ones | fixed | 2026-10-25-3 |
| SR-20261025-915 | arcade/PA3/main.md | pa3-16-shore-passed | Medium | continuity | On the "passed" path, Quirrel never asks to be remembered, though the nail reward says why | fixed | 2026-10-25-3 |
| SR-20261025-916 | arcade/PA3/main.md | pa3-09-house | Medium | follow | The Grey Mourner's rule reads as a list of safe routes; say what breaks the flower | fixed | 2026-10-25-3 |
| SR-20261025-917 | atlas/A30/sprout.md<br>atlas/A30/reader.md | a30-07-flood | Medium | follow | Say why Yossele doesn't stop for Dvora | fixed | 2026-10-25-3 |
| SR-20261025-918 | atlas/A30/sprout.md | a30-01-water | Medium | humour | "Do not look, you will want it!" needs the Nubbin to look | fixed | 2026-10-25-3 |
| SR-20261025-919 | atlas/A31/sprout.md<br>atlas/A31/reader.md | a31-05-carry | Medium | humour | The corn-carrying scene is flat in both bands; let the Nubbin supervise and Xmucane count twice | fixed | 2026-10-25-3 |
| SR-20261025-920 | atlas/A31/sprout.md | a31-06-born | Medium | child-read | Hun Hunahpu and Hunahpu sound alike read aloud; give the child one rule for the two names | fixed | 2026-10-25-3 |
| SR-20261025-921 | atlas/A31/sprout.md | a31-12-dark | Medium | follow | Say the Dark House trick out loud before the feather | fixed | 2026-10-25-3 |
| SR-20261025-922 | atlas/A31/reader.md | a31-11-lords | Medium | child-read | Wing and Packstrap add two new names to the scene; get the laugh from the length instead | fixed | 2026-10-25-3 |
| SR-20261025-923 | atlas/A31/reader.md | a31-11-road | Medium | theme | Swap the off-page compass quiz for a lesson about the black road's half-truth | fixed | 2026-10-25-3 |
| SR-20261025-924 | arcade/PA1/sprout.md | pa1-02-gate | Medium | continuity | Sprout plays the gate as open only, so its locked variants are dead and the open path lost its payoff | fixed | 2026-10-25-3 |
| SR-20261025-925 | arcade/PA1/sprout.md | pa1-12-sky | Medium | child-read | Name Gamma in Amy's worry, keep one pronoun, and give Pixel a gentle line | fixed | 2026-10-25-3 |
| SR-20261025-926 | arcade/PA1/reader.md | pa1-17-chao | Medium | continuity | "Fifteen quests ago" is a menu count; say where, not how many quests | fixed | 2026-10-25-3 |
| SR-20261025-927 | arcade/PA1/reader.md | pa1-17-chao-locked | Medium | child-read | Say why the locked-in Chao aren't moving, so a 7-year-old isn't left frightened | fixed | 2026-10-25-3 |
| SR-20261025-928 | arcade/PA1/reader.md | pa1-06-shards | Medium | pacing | The "Ask about his people" reply tells and explains in three sentences; cut to two | fixed | 2026-10-25-3 |
| SR-20261025-929 | atlas/A30/reader.md | a30-margin-hazel | Nice | pacing | Let Hazel's margin joke sit; cut the lesson that explains it to one line | fixed | 2026-10-25-3 |
| SR-20261025-930 | atlas/A30/sprout.md<br>atlas/A30/reader.md<br>atlas/A31/sprout.md<br>atlas/A31/reader.md<br>arcade/PA1/sprout.md<br>arcade/PA1/reader.md | cross-story | High | child-read | Standard tags off band: K-2 codes across the reader bands, grade 3-4 science in Sprout, and maths past its tag | fixed | 2026-10-25-3 |
| SR-20261025-931 | atlas/A30/sprout.md<br>atlas/A30/reader.md<br>atlas/A31/sprout.md<br>atlas/A31/reader.md<br>arcade/PA1/sprout.md | cross-story | High | pacing | Lessons that interrupt a grave beat or sit on a punchline: move each one after the beat | fixed | 2026-10-25-3 |
| SR-20261025-932 | arcade/PA1/main.md<br>arcade/PA1/sprout.md<br>arcade/PA1/reader.md<br>arcade/PA3/main.md | cross-story | High | theme | Pixel and Byte's marriage as the Arcade's dry running joke, one barb per cartridge | fixed | 2026-10-25-3 |
| SR-20261025-933 | atlas/A30/sprout.md<br>atlas/A30/reader.md<br>arcade/PA1/reader.md | cross-story | Medium | follow | Numbers asked in lessons that the scene never says: put each one in the story first | fixed | 2026-10-25-3 |
| SR-20261025-934 | atlas/A30/sprout.md<br>atlas/A30/reader.md<br>atlas/A31/sprout.md<br>arcade/PA1/sprout.md<br>arcade/PA1/reader.md | cross-story | Medium | child-read | Idioms and off-page knowledge a literal child will trip on, in one sweep | fixed | 2026-10-25-3 |
| SR-20261026-935 | arcade/PA4/main.md | pa4-01-shed | Critical | continuity | None of PA4's 25 "play after" variants can ever play, so Wisp, Clank, every friend line and the candy signature are dead | fixed | 2026-10-26 |
| SR-20261026-936 | arcade/PA5/main.md | pa5-05-photos | Critical | continuity | The "find every memory" signature pays nothing: the eight memory scenes have no host, and nothing ever answers "hunt" | fixed | 2026-10-26 |
| SR-20261026-937 | lines/LK/reader.md | lk03-count | Critical | child-read | The counting lesson ends on "fourteen crocodiles", but the check, the scene and every later line say ten | fixed | 2026-10-26 |
| SR-20261026-938 | lines/LB/main.md<br>lines/LB/sprout.md<br>lines/LB/reader.md | lb12-arrive | High | continuity | LB's nine "play straight after" variants have no host scene, so the box and race choices can never pay off | fixed | 2026-10-26 |
| SR-20261026-939 | lines/LK/main.md<br>lines/LK/sprout.md<br>lines/LK/reader.md | lk07-garden-siti | High | continuity | The cucumber-tale variant is named backwards, and "ramp" is a Grove value: both payoffs would fire for the wrong players | partial | 2026-10-26 |
| SR-20261026-940 | lines/LB/sprout.md | lb11-five | High | child-read | "Five races!" but the scene shows four results | fixed | 2026-10-26 |
| SR-20261026-941 | lines/lang-hebrew/main.md<br>lines/lang-hebrew/sprout.md | lh3-s1 | High | continuity | The course teaches arba with first-syllable stress, against the standard stress it uses everywhere else | fixed | 2026-10-26 |
| SR-20261026-942 | lines/LB/reader.md | lb07-complete | High | follow | The lesson asks why Ned's glass of water barely casts a shadow, but no glass ever appears | fixed | 2026-10-26 |
| SR-20261026-943 | lines/LB/reader.md | lb10-sail | High | follow | The simile lesson quotes "steady as a duck", which only cork sailors ever read | fixed | 2026-10-26 |
| SR-20261026-944 | lines/LK/reader.md | lk05-log | High | follow | The lesson says "the crocodile broke its promise", but it never makes one | fixed | 2026-10-26 |
| SR-20261026-945 | lines/LK/sprout.md | lk06-race | High | child-read | The snail trick is never said, so "Still ahead of you!" makes no sense to a four-year-old | fixed | 2026-10-26 |
| SR-20261026-946 | arcade/PA4/main.md | pa4-17-friends | High | humour | Pay off Pixel's friends receipt when everyone arrives, and tape it up at the end | fixed | 2026-10-26 |
| SR-20261026-947 | arcade/PA5/main.md | pa5-06-slate-done | High | humour | Give everyone the frog memory as the slate's test shot, and make the off-road site a sequel | fixed | 2026-10-26 |
| SR-20261026-948 | arcade/PA4/main.md | pa4-13-complete | High | humour | Sans calls the Nubbin "a dumpling with a crown" and never again; make it his nickname | fixed | 2026-10-26 |
| SR-20261026-949 | lines/LK/main.md | lk07-garden | High | humour | Call back LK1's "You may sulk" / "I never sulk. I wait" and "I always do the crocodile voices" | fixed | 2026-10-26 |
| SR-20261026-950 | lines/LB/main.md<br>lines/LB/sprout.md | lb12-complete | High | humour | "HE DID THE N" misses the line's best callback, Ned's backwards S on the SHOP sign | fixed | 2026-10-26 |
| SR-20261026-951 | lines/lang-hebrew/main.md<br>lines/lang-hebrew/sprout.md | lh6-complete | High | humour | Pay off "Is it blossoming yet?" at the gate, and give the Wobbler its goodbye beside Ori's | fixed | 2026-10-26 |
| SR-20261026-952 | arcade/PA5/main.md | pa5-18-question | High | compelling | Deliver the old man's apology to Zelda; the told/kept choice is read by nothing | fixed | 2026-10-26 |
| SR-20261026-953 | arcade/PA4/main.md | pa4-02-candy | High | compelling | "Leave him be" pays off nowhere; let Asriel thank you for that too | fixed | 2026-10-26 |
| SR-20261026-954 | lines/LK/main.md<br>lines/LK/sprout.md<br>lines/LK/reader.md | lk04-grab | High | compelling | The crocodile treats "sorry" like "thanks"; give the apology its own reaction | fixed | 2026-10-26 |
| SR-20261026-955 | lines/LB/main.md | lb10-complete | High | compelling | Whichever boat you sail, the scene ends the same; let the cork and the walnut have their moment | fixed | 2026-10-26 |
| SR-20261026-956 | arcade/PA5/main.md | pa5-11-complete | Medium | humour | Pixel's finger count breaks its own arithmetic | fixed | 2026-10-26 |
| SR-20261026-957 | arcade/PA4/main.md | pa4-08-echo | Medium | humour | Waterfall's only laugh is the flip; let an echo flower heckle Monster Kid with his own voice | fixed | 2026-10-26 |
| SR-20261026-958 | arcade/PA4/main.md | pa4-06-sans | Medium | humour | Sharpen Sans's two puns so each lands on its last word | fixed | 2026-10-26 |
| SR-20261026-959 | lines/LK/main.md | lk01-lamp | Medium | humour | Open the friendship with a bicker about a sagging screen | fixed | 2026-10-26 |
| SR-20261026-960 | lines/LK/main.md | lk05-log | Medium | humour | LK5 is the flattest tale; let Wulan try the crocodile voice and get it wrong | fixed | 2026-10-26 |
| SR-20261026-961 | lines/LB/main.md | lb08-map | Medium | theme | Ama and Sam barely speak to each other; give them one married bicker | fixed | 2026-10-26 |
| SR-20261026-962 | lines/LB/main.md | lb01-unpacked | Medium | humour | Pay off Ned's job, "in charge of not dropping things" | fixed | 2026-10-26 |
| SR-20261026-963 | lines/LB/main.md | lb09-complete | Medium | continuity | Ama sits at "the fourth plate", but your Nubbin already has it; make the clash the joke | fixed | 2026-10-26 |
| SR-20261026-964 | lines/LB/sprout.md | lb04-complete | Medium | humour | Four players, four biscuit pieces, so the giant gets none; use it | fixed | 2026-10-26 |
| SR-20261026-965 | lines/LB/sprout.md | lb03-complete | Medium | humour | The reader band's pond-monster gag is lost in sprout; give it back in short lines | fixed | 2026-10-26 |
| SR-20261026-966 | lines/LK/sprout.md | lk09-pit | Medium | humour | The elephant joins Kancil in the pit with no comic beat, and the little ones aren't let in on the fib | fixed | 2026-10-26 |
| SR-20261026-967 | lines/LK/reader.md | lk08-look | Medium | humour | The tiger meets his reflection with one grumpy line; let it escalate | fixed | 2026-10-26 |
| SR-20261026-968 | lines/LK/reader.md | lk04-free | Medium | humour | The senses lesson splits "This is a stick" from "It certainly is" | fixed | 2026-10-26 |
| SR-20261026-969 | lines/lang-hebrew/main.md<br>lines/lang-hebrew/sprout.md | lh4-s2 | Medium | humour | The fruit fetch has one gag; let the bird win a round against the Wobbler | fixed | 2026-10-26 |
| SR-20261026-970 | arcade/PA5/main.md | pa5-16-climb | Medium | humour | Two callbacks left on the table: the Yiga's bananas and your jumper | fixed | 2026-10-26 |
| SR-20261026-971 | arcade/PA5/main.md | pa5-18-seal-done | Medium | compelling | The cartridge's first line, "Open your eyes", is never answered | fixed | 2026-10-26 |
| SR-20261026-972 | arcade/PA4/main.md | pa4-17-barrier | Medium | follow | "She doesn't look down" could be Toriel or the child, who is they/them | fixed | 2026-10-26 |
| SR-20261026-973 | arcade/PA4/main.md | pa4-16-complete | Medium | follow | "Somebody in the Grove said that once. About a stone." leans on a Grove scene the cartridge can't know | fixed | 2026-10-26 |
| SR-20261026-974 | arcade/PA5/main.md | pa5-11-naboris | Medium | follow | Urbosa's greeting is garbled | fixed | 2026-10-26 |
| SR-20261026-975 | lines/LB/main.md<br>lines/LB/sprout.md | lb12-waiting | Medium | follow | Brisbane arrives as a new place name at the quietest beat; seed it in LB1, drop it from sprout | fixed | 2026-10-26 |
| SR-20261026-976 | lines/LB/main.md | lb05-bandage | Medium | child-read | Maisie states the lesson aloud in quiz tone | fixed | 2026-10-26 |
| SR-20261026-977 | lines/LB/sprout.md | lb08-moved | Medium | child-read | The "ask Maisie why" reply doesn't answer why | fixed | 2026-10-26 |
| SR-20261026-978 | lines/LB/sprout.md | lb10-sail | Medium | follow | The lesson says "the wind pushes the sails", but sprout's boats have no sails and there is no wind | fixed | 2026-10-26 |
| SR-20261026-979 | lines/LB/sprout.md | lb05-complete | Medium | continuity | Maisie tells Dad to nap, but Sam isn't in the shed | fixed | 2026-10-26 |
| SR-20261026-980 | lines/LB/reader.md | lb06-built | Medium | follow | The pegs are in the den before the lesson asks the child to think of pegs, and "Mum's head is a circle" has no set-up | fixed | 2026-10-26 |
| SR-20261026-981 | lines/LB/reader.md | lb02-bought | Medium | child-read | In a "do" lesson, Ned says the answer before the child can count | fixed | 2026-10-26 |
| SR-20261026-982 | lines/LK/main.md<br>lines/LK/reader.md | lk10-complete | Medium | compelling | The old ending leaves the elephant in the pit; give it a gentle way home | fixed | 2026-10-26 |
| SR-20261026-983 | lines/LK/sprout.md | lk04-stick | Medium | follow | "Stick or leg, which is longer?" with no sizes shown, and "It was dark" from nowhere | fixed | 2026-10-26 |
| SR-20261026-984 | lines/LK/sprout.md | lk10-count | Medium | child-read | The check is twenty crocodiles, but the lesson only ever says "ten and ten" | fixed | 2026-10-26 |
| SR-20261026-985 | lines/LK/sprout.md<br>lines/LK/reader.md | lk07-endings | Medium | follow | "The farmer's dog" turns up in the old ending without ever being in the tale | fixed | 2026-10-26 |
| SR-20261026-986 | lines/lang-hebrew/main.md<br>lines/lang-hebrew/sprout.md | lh4-s2 | Medium | continuity | "These ones are sagol" uses the masculine colour as a predicate for plural and feminine fruit | fixed | 2026-10-26 |
| SR-20261026-987 | lines/lang-hebrew/main.md | lh1-s3-done | Medium | follow | The step asks you to say laila tov to Clover, who never appears | fixed | 2026-10-26 |
| SR-20261026-988 | lines/lang-hebrew/sprout.md | lh5-s1 | Medium | child-read | Sprout names Hazel without saying who she is | fixed | 2026-10-26 |
| SR-20261026-989 | lines/LB/sprout.md | lb01-van | Nice | child-read | Five idioms a young child will take literally | fixed | 2026-10-26 |
| SR-20261026-990 | lines/LB/reader.md<br>lines/LK/reader.md | cross-story | Medium | child-read | Reader bands use K-2 standards, including the C3 codes EDU-STYLE forbids there; swap to approved 3-5 codes only | fixed | 2026-10-26 |
| SR-20261026-991 | arcade/PA4/main.md<br>arcade/PA5/main.md | cross-story | Medium | humour | Pixel's mouse-nest, blow-on-it and "nobody's ever ready" lines repeat across cartridges; give each its own twist | fixed | 2026-10-26 |
| SR-20261026-992 | lines/LK/main.md<br>lines/LK/sprout.md<br>lines/LK/reader.md<br>lines/lang-hebrew/main.md | cross-story | Medium | theme | Pixel and Byte turn up in LK10 and LH6 without each other; let the married pair bicker (canon 38) | fixed | 2026-10-26 |
| SR-20261026-993 | lines/lang-japanese/reader.md | lj6-s3 | High | pacing | The snow-and-water quiz fires on the lantern's doorstep; move it to the lantern-making scene | fixed | 2026-10-26-2 |
| SR-20261026-994 | lines/lang-japanese/main.md<br>lines/lang-japanese/reader.md | lj6-s1 | High | continuity | Obon is "nearly" here in LJ6-1 and "nearly over" a day later; make it Obon week, and the lantern night its last night | fixed | 2026-10-26-2 |
| SR-20261026-995 | lines/lang-japanese/main.md<br>lines/lang-japanese/reader.md | lj1-s1 | High | follow | Hana tells the player to say はい, then offers only "konnichiwa"; make はい Hana's answer to everything instead | fixed | 2026-10-26-2 |
| SR-20261026-996 | campaign/book-2.md | c8-ledge | High | humour | Nova promises a speech "with a bit about owls" and never gives it; let Marina stop it on the ledge | fixed | 2026-10-26-2 |
| SR-20261026-997 | campaign/book-2.md | c8-close | High | humour | Fern's SORRY ABOUT THE JUMPERS bag never comes back; let a Shadow wear the second jumper as a hat | fixed | 2026-10-26-2 |
| SR-20261026-998 | lines/lang-japanese/main.md<br>lines/lang-japanese/sprout.md<br>lines/lang-japanese/reader.md | lj6-complete | High | compelling | Pay off the frog with かえる / 帰る: frog charms bring travellers home safe, just as Hana says またね | fixed | 2026-10-26-2 |
| SR-20261026-999 | campaign/book-1.md | c4-close | High | compelling | Seed Dusty, Fossil and Gerald at Lantern Night, so Fossil's fading in chapter 6 isn't a first meeting | fixed | 2026-10-26-2 |
| SR-20261026-1000 | campaign/book-2.md | c5-circuit | High | continuity | Corvin asks what matters in a race and never mentions the answer again; let him quote it back in chapter 9 | fixed | 2026-10-26-2 |
| SR-20261026-1001 | campaign/book-2.md | c7-close | Medium | theme | Pixel's MAYBE box is the right moment for the married pair to bicker over Byte's shoelace | fixed | 2026-10-26-2 |
| SR-20261026-1002 | campaign/book-2.md | c6-close | Medium | humour | Bring Gerald the duck back up the hill to sit with Moss after the flower | fixed | 2026-10-26-2 |
| SR-20261026-1003 | lines/lang-japanese/main.md | lj4-s1-done | Medium | humour | The bento and race choices are never mentioned again; give each done scene one line that remembers the pick | fixed | 2026-10-26-2 |
| SR-20261026-1004 | lines/lang-hebrew/reader.md | lh3-s1 | Medium | humour | Move the joke off "Hebrew sounds like a sneeze" and onto Fern's tongue and the Wobbler (keep SHTAI-yim) | fixed | 2026-10-26-2 |
| SR-20261026-1005 | lines/lang-hebrew/reader.md | lh4-s2 | Medium | humour | Both of Clover's replies end "Look, she's already sniffing it"; give her fussy Nubbin two different verdicts | fixed | 2026-10-26-2 |
| SR-20261026-1006 | lines/lang-hebrew/reader.md | lh3-s3 | Medium | humour | Give the Wobbler a counting gag under the stars: achat, achat, achat | fixed | 2026-10-26-2 |
| SR-20261026-1007 | extras/readers.md | island-mystic | Medium | humour | The Island Mystic issues bare riddles; give him a deadpan voice and set up his own quiet-monkey callback | fixed | 2026-10-26-2 |
| SR-20261026-1008 | extras/readers.md | grumpy-old-king | Medium | humour | Two Grumpy King jokes lack his reaction beat; let him explain them, badly | fixed | 2026-10-26-2 |
| SR-20261026-1009 | extras/readers.md | aunt-wen | Medium | humour | Aunt Wen's intro sets up the bone stool and her quarrelling bones; let her readings call them back | fixed | 2026-10-26-2 |
| SR-20261026-1010 | lines/lang-japanese/main.md | lj5-s1 | Medium | humour | Open the rainy letter scene with Hana's shoes at the door and Dumpling trying to be a shoe | fixed | 2026-10-26-2 |
| SR-20261026-1011 | lines/lang-japanese/main.md<br>lines/lang-japanese/words.md | lj4-s2 | Medium | humour | Teach the polite ごちそうさまでした with a Dumpling joke, and cut the apple into rabbits | fixed | 2026-10-26-2 |
| SR-20261026-1012 | lines/lang-japanese/main.md<br>lines/lang-japanese/reader.md<br>lines/lang-japanese/sprout.md | lj1-s2 | Medium | humour | A dewy-morning scene teaches こんにちは as the bow word; have Hana admit it and make it a joke | fixed | 2026-10-26-2 |
| SR-20261026-1013 | campaign/book-2.md | c7-stillness | Medium | pacing | Three scenes of Moss's lecture need one more Nubbin beat, at the start, before "Safe" | fixed | 2026-10-26-2 |
| SR-20261026-1014 | campaign/book-1.md | c4-tale-2 | Medium | humour | Sparks, asleep through Moss's tale, says "FLAT" in her sleep: one comic breath from chapter 2 | fixed | 2026-10-26-2 |
| SR-20261026-1015 | campaign/book-1.md | c1-letter | Medium | humour | Give the game's first minute a smile: the gate groans as if it missed the argument | fixed | 2026-10-26-2 |
| SR-20261026-1016 | extras/results.md | tombola | Medium | humour | Nine freebie "taken" lines open the same way; keep the rule, vary the joke and move "once, ever" to the end | fixed | 2026-10-26-2 |
| SR-20261026-1017 | extras/results.md | kindergarten-lesson | Medium | humour | Level 1 kindergarten lines are funny and level 3 is plain praise; give the top grade a grin | fixed | 2026-10-26-2 |
| SR-20261026-1018 | extras/readers.md | fortune-teller | Medium | humour | Zinnia's type-and-band grid is warm but earnest; give two readings her fussy barb | fixed | 2026-10-26-2 |
| SR-20261026-1019 | lines/lang-japanese/sprout.md | lj6-s2-done | Medium | humour | End the lantern-making scene on Dumpling, not "Pixel nods. Good." | fixed | 2026-10-26-2 |
| SR-20261026-1020 | lines/lang-hebrew/reader.md | lh6-s2 | Medium | humour | Ori's watering replies are flat; let him fail to hand the job over | fixed | 2026-10-26-2 |
| SR-20261026-1021 | lines/lang-japanese/sprout.md | lj3-s1-done | Medium | child-read | "A little dramatic. But right." has no set-up in sprout; make it loud and right | fixed | 2026-10-26-2 |
| SR-20261026-1022 | lines/lang-japanese/reader.md<br>lines/lang-japanese/sprout.md | lj5-s1 | Medium | follow | Who wrote to whom, and whose copies these are, is hard to untangle; say it with names | fixed | 2026-10-26-2 |
| SR-20261026-1023 | lines/lang-hebrew/reader.md | lh2-s3 | Medium | follow | "Savta" turns up in LH2 and LH3 before LH5 teaches it; gloss it where it first appears | fixed | 2026-10-26-2 |
| SR-20261026-1024 | extras/readers.md | aunt-wen | Medium | follow | Wen's "(The Keeper helped. A bit.)" is an author wink that leans on Q58; keep the callback in her voice | fixed | 2026-10-26-2 |
| SR-20261026-1025 | extras/readers.md | wise-old-king | Nice | humour | "Speak softly, and carry a large scroll" is the one swapped-word line with no turn | fixed | 2026-10-26-2 |
| SR-20261026-1026 | extras/results.md | photo-caption | Nice | humour | The sad photo caption is the only mood without a smile | fixed | 2026-10-26-2 |
| SR-20261026-1027 | extras/results.md | expedition-results | Nice | continuity | The currency is "Shells" elsewhere but "shells" in expedition and freebie lines; and the karate win can be warmer | fixed | 2026-10-26-2 |
| SR-20261026-1028 | lines/lang-japanese/main.md<br>lines/lang-japanese/words.md | lj1-s3 | Nice | continuity | さようなら is "goodbye for a while" in LJ1 and "for a long time" in LJ6; pick one | fixed | 2026-10-26-2 |
| SR-20261026-1029 | lines/lang-japanese/main.md | lj3-s1-done | Nice | theme | Say once that bare numbers are for counting aloud, with a joke about Japanese counting words | fixed | 2026-10-26-2 |
| SR-20261026-1030 | lines/lang-japanese/main.md | lj6-complete | Nice | continuity | LJ6's note bans "lantern items" while LJ1 rewards a paper lantern; say which lanterns | fixed | 2026-10-26-2 |
| SR-20261026-1031 | lines/lang-hebrew/reader.md<br>lines/lang-japanese/reader.md | lh1-s1 | Nice | child-read | Three idioms a seven-year-old may take literally: a header, your toes and a thumb | fixed | 2026-10-26-2 |
| SR-20261026-1032 | lines/lang-japanese/sprout.md | lj3-s2 | Nice | child-read | Sparks, Pixel and Byte all arrive in one sprout scene; hold Byte back to the done scene | fixed | 2026-10-26-2 |
| SR-20261026-1033 | lines/lang-hebrew/reader.md<br>lines/lang-japanese/reader.md | cross-story | Medium | child-read | Both language reader bands carry K-2 standards, including C3 codes EDU-STYLE forbids; swap to approved 3-5 codes only | fixed | 2026-10-26-2 |
| SR-20261026-1034 | lines/lang-hebrew/reader.md<br>lines/lang-japanese/main.md<br>lines/lang-japanese/reader.md | cross-story | Medium | humour | Hazel wrote to Savta and to Obāchan for decades; give both letter tins the same P.S. about the stuck gate | fixed | 2026-10-26-2 |
| SR-20261026-1035 | lines/lang-japanese/main.md<br>lines/lang-japanese/reader.md | cross-story | Medium | theme | Byte times Hana's race; bring his four stopwatches from chapter 5 and let Pixel, his wife, explain them | fixed | 2026-10-26-2 |
| SR-20261026-1036 | side/S02.md | s2-night | High | continuity | s2-early and s2-carried are set and read by nothing; pay each one off with a joke in s2-night | fixed | 2026-10-26-3 |
| SR-20261026-1037 | campaign/book-3.md<br>campaign/endings.md | c9-open-sold | High | continuity | On the Collector route the sold Nubbin stands in row two and nobody addresses it, yet the ending blames you for not going back | fixed | 2026-10-26-3 |
| SR-20261026-1038 | side/S03.md | s3-stands | High | humour | The opening narration gives away the story's best gag; keep "same tea" for Byte at the Moot | fixed | 2026-10-26-3 |
| SR-20261026-1039 | learning/campaign/sprout.md | c8-close | High | continuity | The sprout notebook drops "Took two months. Worth it.", which the child is asked to read aloud in chapter 9 | fixed | 2026-10-26-3 |
| SR-20261026-1040 | side/S04.md | s4-sluice | High | humour | The snore-and-whistle stealth game has no Nubbin in it; make your Nubbin a very serious statue | fixed | 2026-10-26-3 |
| SR-20261026-1041 | learning/campaign/reader-1.md | c8-nova | High | humour | Marina said "tell me the end at the other end"; let Nova finally deliver it, owls and all | fixed | 2026-10-26-3 |
| SR-20261026-1042 | learning/campaign/sprout.md | c4-close | High | humour | Byte arrives unintroduced and the shoelace gag loses its straight-man beat; give it a set-up and a punchline | fixed | 2026-10-26-3 |
| SR-20261026-1043 | side/S03.md | s3-moot | High | humour | Hazel used to sit in the gap to annoy everyone; at the Moot she does it again and the gap closes round her | fixed | 2026-10-26-3 |
| SR-20261026-1044 | side/S05.md | s5-cliff | High | humour | Fossil's taps stop after two corrections; one more, smaller, before the quiet turn | fixed | 2026-10-26-3 |
| SR-20261026-1045 | campaign/endings.md | end-epi-told | Medium | humour | "Say nothing, badly" and "the whole trick" each land twice in one ending run; give the told epilogue fresh jokes | fixed | 2026-10-26-3 |
| SR-20261026-1046 | side/S01.md | s1-boats | Medium | humour | Moss "never found out" Briar's joke; let him share a theory at the boats, and give the sail choice its payoff | fixed | 2026-10-26-3 |
| SR-20261026-1047 | campaign/book-3.md | c9-close | Medium | humour | Fern's pie note leans on a chapter-2 line most players won't connect; spell it out and make it Fern's | fixed | 2026-10-26-3 |
| SR-20261026-1048 | campaign/endings.md | end-shadow-keeper | Medium | humour | The flattest ending has no smile; give Byte a register at the edge of the long grass | fixed | 2026-10-26-3 |
| SR-20261026-1049 | campaign/endings.md | end-wild-grove | Medium | humour | Fern's buns reach every ending but the wild one; give it a grace note before "Took two months. Worth it." | fixed | 2026-10-26-3 |
| SR-20261026-1050 | side/S02.md | s2-complete-driven | Medium | humour | Clover's "not speaking to you till Thursday" is dropped; let Thursday arrive, with a blanket | fixed | 2026-10-26-3 |
| SR-20261026-1051 | side/S05.md | s5-gift | Medium | humour | The long wait until dark has nothing light in it; let the other Nubbins fall asleep in a heap | fixed | 2026-10-26-3 |
| SR-20261026-1052 | side/S04.md | s4-sluice | Medium | humour | The polite-note branch gets one line; let the steward file it in his sleep | fixed | 2026-10-26-3 |
| SR-20261026-1053 | learning/campaign/sprout.md | c11-moss-here | Medium | humour | The rhyme lesson cuts in between "You're late." and the punchline; move it to after the laugh | fixed | 2026-10-26-3 |
| SR-20261026-1054 | learning/campaign/sprout.md | c8-open | Medium | humour | "Sorry about the jumpers" has no reason in sprout; give the child one | fixed | 2026-10-26-3 |
| SR-20261026-1055 | campaign/triggered.md | t-talk-generic | Medium | humour | The one repeatable chat line wears out; give it three rotating versions | partial | 2026-10-26-3 |
| SR-20261026-1056 | campaign/triggered.md | t-stray-returned | Medium | humour | A long hush with no smile; add a second plum beside it | fixed | 2026-10-26-3 |
| SR-20261026-1057 | side/S01.md | s1-cinder | Medium | humour | "You can carry me this time" only has an antecedent if you offered to carry him; split it by s1-pace | fixed | 2026-10-26-3 |
| SR-20261026-1058 | side/S02.md | s2-fruit | Medium | humour | Luna's "You noticed. Good." answers nothing; make her opener the story's first smile | fixed | 2026-10-26-3 |
| SR-20261026-1059 | campaign/book-3.md | c10-dawn | Medium | pacing | On the Moss-gone route the soup-puck laugh follows "He knew the way" too closely; play it as relief | fixed | 2026-10-26-3 |
| SR-20261026-1060 | campaign/endings.md | end-hazels-grove | Medium | follow | Name Hazel's flower, and drop "which one it means" for players who never heard Sable's word | fixed | 2026-10-26-3 |
| SR-20261026-1061 | side/S03.md | s3-courier | Medium | continuity | After "Show them one at a time", s3-truce has both women at the plates together, and the branch has no laugh | fixed | 2026-10-26-3 |
| SR-20261026-1062 | side/S04.md | s4-lesson | Medium | continuity | Marina taught Fossil to swim and held her in S5's last swim; give her one line if S5 was played | fixed | 2026-10-26-3 |
| SR-20261026-1063 | learning/campaign/sprout.md | c11-moss-passed | Medium | follow | The "smile and feel sad" notice comes before the scene says Moss died; move it after | fixed | 2026-10-26-3 |
| SR-20261026-1064 | learning/campaign/sprout.md | end-epi-mill-burned | Medium | follow | Three sprout epilogues state facts their own scene doesn't (two knocks for three, a burned letter never shown, "Yes" to a "No") | fixed | 2026-10-26-3 |
| SR-20261026-1065 | learning/campaign/reader-1.md | c4-tale | Medium | pacing | Moss's tale stops for geothermal heat and floating ice; cut both notices and let the story run | fixed | 2026-10-26-3 |
| SR-20261026-1066 | learning/campaign/reader-1.md | c2-corvin | Medium | child-read | Reader-1 still tags K-2 C3 codes that EDU-STYLE rules out, and one division goes past 100 | fixed | 2026-10-26-3 |
| SR-20261026-1067 | campaign/book-3.md | c11-gate | Nice | follow | "It's freezing" sits oddly in the week the frost left; make the stake the hours, not the cold | fixed | 2026-10-26-3 |
| SR-20261026-1068 | campaign/book-3.md | c10-bank-moss-returned | Nice | follow | Moss's remembered words read as narration; put them in quotation marks | fixed | 2026-10-26-3 |
| SR-20261026-1069 | campaign/endings.md | end-moss-sleeps | Nice | continuity | "Sable carries his light now" has no scene behind it if Sable bonded after chapter 10 | fixed | 2026-10-26-3 |
| SR-20261026-1070 | campaign/book-3.md | c10-kept | Nice | character | On the kept route Sable, if she bore the stone, vanishes from the walk home | fixed | 2026-10-26-3 |
| SR-20261026-1071 | side/S01.md | s1-cinder | Nice | continuity | "Three nights before" sits awkwardly beside c9-close's all-night sit; anchor it to the tin instead | fixed | 2026-10-26-3 |
| SR-20261026-1072 | side/S02.md | s2-missing | Nice | humour | Make the missing sock yours, so "your other sock" in the spared branch lands | fixed | 2026-10-26-3 |
| SR-20261026-1073 | side/S03.md | s3-moot | Nice | humour | Both spoon branches share Pixel's ribbons line; give the spoon branch Byte instead | fixed | 2026-10-26-3 |
| SR-20261026-1074 | side/S03.md | s3-flag | Nice | humour | The thumb plate lands once; bring it back on the third plate, after the Corvin beat | fixed | 2026-10-26-3 |
| SR-20261026-1075 | side/S05.md | s5-water-ask | Nice | humour | The "yours" holder branch gives Dusty nothing to say | fixed | 2026-10-26-3 |
| SR-20261026-1076 | campaign/triggered.md | t-moss-first-pet-early | Nice | humour | Seed Dusty's "grass on his head" gag at the first pet | fixed | 2026-10-26-3 |
| SR-20261026-1077 | learning/campaign/reader-1.md | c10-bank-wisp | Nice | child-read | Three idioms and one ambiguous "him" in reader-1's later chapters | fixed | 2026-10-26-3 |
| SR-20261026-1078 | learning/campaign/sprout.md | c10-moss-walks-bearer | Nice | child-read | "I can't put her down" with the stone in Moss's mouth reads as Sable | fixed | 2026-10-26-3 |
| SR-20261026-1079 | learning/campaign/sprout.md<br>learning/campaign/reader-1.md | cross-story | High | child-read | Both bands stop for lessons at their gravest beats; cut or move ten of them | fixed | 2026-10-26-3 |
| SR-20261026-1080 | learning/campaign/sprout.md<br>learning/campaign/reader-1.md | cross-story | High | pacing | The same lesson comes back three times in each band; swap the repeats for fresh, sillier ones | fixed | 2026-10-26-3 |
| SR-20261026-1081 | learning/campaign/sprout.md<br>learning/campaign/reader-1.md | cross-story | Medium | theme | Pixel introduces Byte as her husband in both bands (canon 38), with a bicker | fixed | 2026-10-26-3 |
| SR-20261026-1082 | learning/campaign/sprout.md<br>learning/campaign/reader-1.md | cross-story | Medium | follow | Wisp and Bramble return in chapter 10 months after S2 and S8; give each a one-line reminder | fixed | 2026-10-26-3 |
| SR-20261026-1083 | learning/campaign/reader-1.md<br>side/S04.md | cross-story | Medium | humour | Marina's numbered rules (canon 39): let Sparks answer rule four, and make rule five stand alone | fixed | 2026-10-26-3 |
| SR-20261026-1084 | side/S10.md | s10-lanterns | High | follow | Hazel's one question at the long-grass post never names Corvin | open | 2026-10-26-4 |
| SR-20261026-1085 | learning/side/S01/reader.md | s1-hush | High | follow | Say plainly that Hush died, then comfort straight after | open | 2026-10-26-4 |
| SR-20261026-1086 | side/S10.md | s10-wish3-s1 | High | continuity | Hazel says she sat in the snow; Moss swore she fell in the pond. Let her dispute it | open | 2026-10-26-4 |
| SR-20261026-1087 | side/S13.md | s13-level3 | High | follow | "Him and your grandmother" points at Aldous; the secret is about Corvin | open | 2026-10-26-4 |
| SR-20261026-1088 | side/S07.md | s7-minder | High | follow | Show the red lever to everyone, and reward the player who asked about it | open | 2026-10-26-4 |
| SR-20261026-1089 | side/S12.md | s12-dark | High | humour | Let Luna, the deadpan gardener, answer "Is that greedy?" with slugs | open | 2026-10-26-4 |
| SR-20261026-1090 | side/S09.md | s9-word | High | humour | Sparks brings biscuits "for the vote"; there is no vote | open | 2026-10-26-4 |
| SR-20261026-1091 | side/S08.md | s8-further | High | humour | A firefly lands on your Nubbin's nose and teaches the mini-game | open | 2026-10-26-4 |
| SR-20261026-1092 | learning/side/S01/sprout.md, learning/side/S01/reader.md | s1-ask | High | follow | Moss refuses a question nobody asked; let the child ask it | open | 2026-10-26-4 |
| SR-20261026-1093 | learning/side/S01/reader.md | s1-cinder | High | follow | Show Cinder holding on, so "a love that holds too tight" has something to point at | open | 2026-10-26-4 |
| SR-20261026-1094 | side/S06.md | s6-complete | Medium | humour | The duck comes back for a third beat, and Ash takes Ember's side | open | 2026-10-26-4 |
| SR-20261026-1095 | side/S11.md | s11-ember | Medium | follow | Name Corvin in Ember's "till he had Ash" | open | 2026-10-26-4 |
| SR-20261026-1096 | side/S11.md | s11-ember | Medium | follow | Tie "cinder-love" to the skipping rhyme, and say who "her" is | open | 2026-10-26-4 |
| SR-20261026-1097 | side/S09.md | s9-yours | Medium | follow | Say rule three out loud where it lands hardest | open | 2026-10-26-4 |
| SR-20261026-1098 | side/S06.md | s6-kitchen | Medium | follow | "She's out" should say who is out of where, and Ember wasn't waiting | open | 2026-10-26-4 |
| SR-20261026-1099 | side/S12.md | s12-complete | Medium | compelling | Let Solo's choice echo once in the finale | open | 2026-10-26-4 |
| SR-20261026-1100 | side/S06.md | s6-whistle | Medium | compelling | Ember notices whether you stayed or slipped out | open | 2026-10-26-4 |
| SR-20261026-1101 | side/S08.md | s8-arrive | Medium | compelling | When you told Fern, she is very busy not hoping | open | 2026-10-26-4 |
| SR-20261026-1102 | side/S10.md | s10-cheer | Medium | humour | The fast one and the slow one each get their own finish | open | 2026-10-26-4 |
| SR-20261026-1103 | side/S10.md | s10-night | Medium | humour | One dry Hazel line on the doorstep before the bed's edge | open | 2026-10-26-4 |
| SR-20261026-1104 | side/S13.md | s13-sluice | Medium | humour | The rats remember whether you bribed them or tiptoed | open | 2026-10-26-4 |
| SR-20261026-1105 | side/S12.md | s12-swarm-goes | Medium | follow | "The morning she meant" needs a name | open | 2026-10-26-4 |
| SR-20261026-1106 | side/S08.md | s8-complete | Medium | follow | "Fern found her" reads as the thin one in Hazel's arm | open | 2026-10-26-4 |
| SR-20261026-1107 | side/S07.md | s7-unverified | Medium | follow | Put Moss on the wall before he speaks | open | 2026-10-26-4 |
| SR-20261026-1108 | side/S07.md | s7-minder | Medium | humour | Null eats the plum off the clipboard, with no bell at all | open | 2026-10-26-4 |
| SR-20261026-1109 | side/S09.md | s9-gate | Medium | humour | Hazel's cup has been empty for some time | open | 2026-10-26-4 |
| SR-20261026-1110 | side/S12.md | s12-follow | Medium | humour | The swarm votes on directions while you follow it | open | 2026-10-26-4 |
| SR-20261026-1111 | side/S13.md | s13-settled-kept | Medium | humour | The Sock of Uncertain Origin turns up in the tin | open | 2026-10-26-4 |
| SR-20261026-1112 | side/S11.md | s11-beetle | Medium | follow | "That one's clean" follows a line about ladybirds | open | 2026-10-26-4 |
| SR-20261026-1113 | side/S06.md | s6-kitchen | Medium | humour | Your Nubbin faces Ash's wall too, to see what's so interesting | open | 2026-10-26-4 |
| SR-20261026-1114 | side/S08.md | s8-edge | Medium | humour | The stray leaves a leaf where the fruit was, like a receipt | open | 2026-10-26-4 |
| SR-20261026-1115 | learning/side/S01/sprout.md | s1-cinder | Medium | child-read | Echo the rhyme's "did not move at all" in Cinder's story | open | 2026-10-26-4 |
| SR-20261026-1116 | learning/side/S01/sprout.md | s1-wait | Medium | follow | Say what the song gets wrong about Cinder | open | 2026-10-26-4 |
| SR-20261026-1117 | learning/side/S01/sprout.md | s1-cinder | Medium | follow | "All four are home" has nothing to point at in the sprout band | open | 2026-10-26-4 |
| SR-20261026-1118 | learning/side/S01/sprout.md | s1-boats | Medium | child-read | Make Moss's suspicion of Briar's fold a plain, repeatable joke | open | 2026-10-26-4 |
| SR-20261026-1119 | learning/side/S01/sprout.md | s1-hazel | Medium | child-read | Say what "You'll do" means | open | 2026-10-26-4 |
| SR-20261026-1120 | learning/side/S01/sprout.md | s1-hush | Medium | child-read | Make "a kind of keeping" concrete | open | 2026-10-26-4 |
| SR-20261026-1121 | learning/side/S01/sprout.md | s1-ask | Medium | humour | Your Nubbin zooms ahead, zooms back, and sits on Moss's foot | open | 2026-10-26-4 |
| SR-20261026-1122 | learning/side/S01/sprout.md | s1-wall-ask | Medium | humour | In the listening game, the loudest sound is Byte's tummy | open | 2026-10-26-4 |
| SR-20261026-1123 | learning/side/S01/reader.md | s1-briar | Medium | child-read | Explain "Eternal" before it's used to say Briar died | open | 2026-10-26-4 |
| SR-20261026-1124 | learning/side/S01/reader.md | s1-cinder | Medium | follow | Cut "after you buried the tin"; the reader band never shows a tin | open | 2026-10-26-4 |
| SR-20261026-1125 | learning/side/S01/reader.md | s1-hush | Medium | pacing | Move the simile lesson out of Hush's memory | open | 2026-10-26-4 |
| SR-20261026-1126 | learning/side/S01/reader.md | s1-wall-ask | Medium | humour | Name Byte and the shoe, then let the other lace go | open | 2026-10-26-4 |
| SR-20261026-1127 | learning/side/S01/reader.md | s1-boats | Medium | pacing | Cut the flame lesson that sits between "still lit" and the laugh | open | 2026-10-26-4 |
| SR-20261026-1128 | side/S07.md | s7-complete | Medium | follow | Make Byte's stopwatch line say why he gives it away | open | 2026-10-26-4 |
| SR-20261026-1129 | side/S10.md | s10-lanterns | Nice | follow | Gloss Hush at the old wall in half a line | open | 2026-10-26-4 |
| SR-20261026-1130 | side/S09.md | s9-trowel | Nice | follow | Turn the double "twenty-two" into a point | open | 2026-10-26-4 |
| SR-20261026-1131 | side/S09.md | s9-gate-family | Nice | humour | Corvin clears his throat twice; Hazel lets him have both | open | 2026-10-26-4 |
| SR-20261026-1132 | side/S11.md | s11-ember | Nice | humour | Fern's crate says PLUMS | open | 2026-10-26-4 |
| SR-20261026-1133 | side/S13.md | s13-wheelpit | Nice | humour | Moss warns about the third stair; Tobin takes it personally | open | 2026-10-26-4 |
| SR-20261026-1134 | side/S13.md | s13-key | Nice | pacing | Trim Tobin's loot list after the heavy truth | open | 2026-10-26-4 |
| SR-20261026-1135 | learning/side/S01/reader.md | s1-boats | Nice | follow | Say whose sound, and what the tradition is | open | 2026-10-26-4 |
| SR-20261026-1136 | learning/side/S01/sprout.md | s1-hazel | Nice | humour | Splosh! Only up to her ankles | open | 2026-10-26-4 |
| SR-20261026-1137 | side/S07.md | s7-lap | Nice | humour | Byte steps over the face-down stopwatch, twice | open | 2026-10-26-4 |
| SR-20261026-1138 | side/S07.md, side/S09.md | cross-story | High | humour | Byte labels the gate UNVERIFIED | open | 2026-10-26-4 |
| SR-20261026-1139 | side/S06.md, side/S10.md | cross-story | Medium | humour | The very confident duck takes the back-row seat at Hazel's race | open | 2026-10-26-4 |
| SR-20261026-1140 | side/S06.md, side/S10.md | cross-story | Medium | humour | Byte has answered "Do not lend this to Byte" on the register cover | open | 2026-10-26-4 |

## Runs

- 2026-10-22 · [review-2026-10-22](review-2026-10-22.md) · units: 00, 01, 01b, 01c, 02, 03, 04, 05, 20a, 21a · 60 recs: Critical 1, High 28, Medium 30, Nice 1 (5 cross-story) · fixed since last run: n/a (first run)
- 2026-10-22 · fix pass on branch `fix/story-review-1022` · all 60 run-1 recs applied: 55 fixed, 5 partial (SR-20261022-25, -28, -43, -53, -54) · canon 38–43 added
- 2026-10-22 run 2 · [review-2026-10-22-2](review-2026-10-22-2.md) · units: 06, 07, 08, 09, 10, 11, 12, 13, 20b [S1 .. S17], 21b [S1 .. S11] · 60 recs: Critical 2, High 34, Medium 24, Nice 0 (5 cross-story) · fixed since last run: 55 (5 partial) · plus the storage study
- 2026-10-22 · fix pass on branch `fix/story-review-2026-10-22` · all 65 open or partial recs: 60 fixed, 5 partial (SR-20261022-72: the optional Jhudora/Illusen side of the NQ27 gift was not built, both gifts always play; -79: Logan's jump is explained by Sue's rift, no machine named; -80: Frenchie and Marlene reach the ridge but Marlene stays back; -110: Pip is still named in s15-wagon by a main choice; -115: S8's elephant notice stays, a reader scene needs a lesson) · run-1 partials closed: -25/-28 measured clean once choice replies are counted apart; -43 c4-open sets `c4-lamps`, paid off in c10-dawn; -53 asks rewritten in voice; -54 c10-wisp names Sable or Moss (sim line swap) · canon 44–45 added
- 2026-10-22 run 3 · [review-2026-10-22-3](review-2026-10-22-3.md) · units: S12/reader.md, S13/sprout.md, S13/reader.md, S14/sprout.md, S14/reader.md, S15/reader.md, S16/reader.md, S17/reader.md, S18/sprout.md, S18/reader.md · 53 recs: Critical 2, High 17, Medium 27, Nice 7 (5 cross-story) · fixed since last run: 60 (5 partial)
- 2026-10-22 · fix pass on branch `fix/story-review-2026-10-22-3` · all 58 open or partial recs (run 3's 53 plus SR-20261022-72, -79, -80, -110, -115): 57 fixed, 1 partial (SR-20261022-162: S15's lesson replies were already in Byte's voice, so only the wording changed) · -72 the J + I carving warms for both faeries; -79 names Doom's time platform; -80 rewords MK2's step so Marlene stays on the ridge; -110 tags Pip before the rhyme lesson; -115 was already done (s8-ring keeps one lesson) · no canon changes
- 2026-10-22 run 4 · [review-2026-10-22-4](review-2026-10-22-4.md) · units: S19/sprout.md, S19/reader.md, S20/sprout.md, S20/reader.md, S21/sprout.md, S21/reader.md, S22/sprout.md, S22/reader.md, S24/sprout.md, S24/reader.md · 64 recs: Critical 1, High 23, Medium 34, Nice 6 (5 cross-story) · fixed since last run: 57 (1 partial)
- 2026-10-22 · fix pass on branch `fix/story-review-2026-10-22-4` · all 65 open or partial recs (run 4's 64 plus SR-20261022-162): 62 fixed, 3 partial (-179 and -198: a lesson can only play before a scene's choices, so the asks sit at the scene end, not after the choice; -229: S20's grudge exchange sits at the end of s20-declaration, since Wren and Gordon aren't introduced at the rec's spot) · also: S24's kept-stone Nubbin lines now swap by each band's own line (sprout had main's words, and falls-top hit the wrong line), with a test · no canon changes
- 2026-10-22 run 5 · [review-2026-10-22-5](review-2026-10-22-5.md) · units: S25/sprout.md, S25/reader.md, S26/sprout.md, S26/reader.md, S27/sprout.md, S27/reader.md, S28/sprout.md, S28/reader.md, S29/sprout.md, S29/reader.md · 60 recs: Critical 0, High 15, Medium 35, Nice 10 (5 cross-story) · fixed since last run: 62 (3 partial)
- 2026-10-23 · fix pass on branch `fix/story-review-2026-10-23` · all 63 open or partial recs (run 5's 60 plus SR-20261022-179, -198, -229): 59 fixed, 1 partial, 3 dropped · -265 partial: S26's robin "wages" joke had no set-up in either band, so the line was rewritten without it · -179, -198, -229 dropped: a lesson can only play before a scene's choices, and each already sits as late as the engine allows · no canon changes
- 2026-10-23 run 6 · [review-2026-10-23](review-2026-10-23.md) · units: S30/sprout.md, S30/reader.md, S31/sprout.md, S31/reader.md, fun/python/sprout.md, fun/python/reader.md, fun/bean/sprout.md, fun/bean/reader.md, fun/avatar/sprout.md, fun/avatar/reader.md · 56 recs: Critical 2, High 16, Medium 33, Nice 5 (4 cross-story) · fixed since last run: 59 (1 partial, 3 dropped)
- 2026-10-23 · fix pass on branch `fix/story-review-2026-10-23-2` · all 57 open or partial recs (run 6's 56 plus SR-20261022-265): 57 fixed · -307 uses narrator lines until Bao and Lumi are named; -314 and -316 place their beats where the props are on stage; -265 gives the robin a self-contained pay joke · canon 46 added (what Kaito did in Q64)
- 2026-10-23 run 7 · [review-2026-10-23-2](review-2026-10-23-2.md) · units: fun/alice.md, fun/holmes.md, fun/hodja.md, multiverse/dragonball.md, multiverse/toystory.md, multiverse/endgames.md, expansions/E1.md, expansions/E2.md, atlas/A02/sprout.md, atlas/A02/reader.md · 57 recs: Critical 2, High 24, Medium 31, Nice 0 (2 cross-story) · fixed since last run: 57 (all)
- 2026-10-23 · fix pass on branch `fix/story-review-2026-10-23-3` · run 7's 57 recs: 57 fixed · -355 renames the `mv-db-set2-keeping` value to `carried` (it clashed with DB17); -359 and -360 add variant scenes wired in `side-rules-expansions.ts` (E1 slow ending, E2 short-answer endings, with a test); -390 wires `q81-var-children` after the Q81 kite in `fun-pack-rules.ts` · canon: item 45 gains the Dragon Ball fish gag, Sarge's fuzzy recruits, NUBINS, and the four-star ball's homecoming
- 2026-10-23 run 8 · [review-2026-10-23-3](review-2026-10-23-3.md) · units: expansions/E3.md, storylines/hundred.md, storylines/logged.md, storylines/beetle.md, storylines/dawndusk.md, atlas/A01/main.md, atlas/A02/main.md, atlas/A03/main.md, atlas/A05/sprout.md, atlas/A05/reader.md · 59 recs: Critical 2, High 17, Medium 34, Nice 6 (4 cross-story) · fixed since last run: 57 (all)
- 2026-10-23 · fix pass on branch `fix/story-review-2026-10-23-4` · run 8's 59 recs: 59 fixed · -411 and -412 make Logged's and Beetle's last choices reach every ending through body scenes queued by `storyline-rules-logged.ts` and `-beetle.ts` (`l-end-*`, `b-end-*`, staged, tested); -466 renames Tam, Hob and Ash Penhallow to Nell, Grist and Rowan Penhallow (speaker ids kept); E3 gains `e3-merge-done-strong`, wired and tested · canon: item 43 gains the storyline names, Grist and Ottoline's marriage, and Root as the Keeper's sister
- 2026-10-23 run 9 · [review-2026-10-23-4](review-2026-10-23-4.md) · units: atlas/A04/main.md, atlas/A05/main.md, atlas/A06/main.md, atlas/A06/sprout.md, atlas/A06/reader.md, atlas/A07/main.md, atlas/A07/sprout.md, atlas/A07/reader.md, atlas/A08/main.md, atlas/A09/main.md · 58 recs: Critical 1, High 23, Medium 34, Nice 0 (3 cross-story) · fixed since last run: 59 (all)
- 2026-10-23 · fix pass on branch `fix/story-review-2026-10-23-5` · run 9's 58 recs: 58 fixed · -497 pays Balla's telling off in eight `a05-14-complete-*` variants (band versions added); -524 adds the `a09-raft` flag and two named dawn returns; -513 tells the sprout horse gag in narration to keep one new name per scene; -525 adds a `maths:` content-check warning (71 lessons to triage); -471 retags the queue lesson 4.NBT.B.4 (new row in EDU-STYLE.md) · canon: item 43 gains A8's javelin, Stick
- 2026-10-23 run 10 · [review-2026-10-23-5](review-2026-10-23-5.md) · units: atlas/A08/sprout.md, atlas/A08/reader.md, atlas/A09/sprout.md, atlas/A09/reader.md, atlas/A10/main.md, atlas/A10/sprout.md, atlas/A10/reader.md, atlas/A11/main.md, atlas/A11/sprout.md, atlas/A11/reader.md · 60 recs: Critical 2, High 24, Medium 29, Nice 5 (5 cross-story) · fixed since last run: 58 (all)
- 2026-10-24 · fix pass on branch `fix/story-review-2026-10-24` · run 10's 60 recs: 60 fixed · -529 puts the Friend ribbon on Eeyore's door in all three A11 files ("Took it off my door"); -587 retags reader bands to the grades 3–5 C3 codes and 3.NF.A.3 (both added to EDU-STYLE.md); -543 keeps one gentle notice in a09-11-dark-done because every scene needs a lesson; -566 and -573 fold a notice into narration to stay within two lessons a scene · canon: none
- 2026-10-24 run 11 · [review-2026-10-24](review-2026-10-24.md) · units: atlas/A12/main.md, atlas/A12/sprout.md, atlas/A12/reader.md, atlas/A13/main.md, atlas/A13/sprout.md, atlas/A13/reader.md, atlas/A14/main.md, atlas/A14/sprout.md, atlas/A14/reader.md, atlas/A15/main.md · 59 recs: Critical 3, High 23, Medium 33, Nice 0 (4 cross-story) · fixed since last run: 60 (all)
- 2026-10-24 · fix pass on branch `fix/story-review-2026-10-24-2` · run 11's 59 recs: 59 fixed · -588 makes the A14 bed scene the first time he names himself "under his own roof"; -590 sets a15-secret = 'promised' (not 'keep', which clashes with the Grove finalChoice flag) and pays it off in four new A15 variants with band clones; -600 moves the think ask after the last gate line because every scene needs a lesson; -611 splits the circus run inside the scene with a quiet pause, no new step; -646 runs the souvenir gag paper troll → green bottle → olive leaf → spectacles · canon: none
- 2026-10-24 run 12 · [review-2026-10-24-2](review-2026-10-24-2.md) · units: atlas/A15/sprout.md, atlas/A15/reader.md, atlas/A16/main.md, atlas/A16/reader.md, atlas/A17/main.md, atlas/A17/sprout.md, atlas/A17/reader.md, atlas/A18/main.md, atlas/A18/sprout.md, atlas/A18/reader.md · 60 recs: Critical 2, High 18, Medium 37, Nice 3 (5 cross-story) · fixed since last run: 59 (all)
- 2026-10-24 · fix pass on branch `fix/story-review-2026-10-24-3` · run 12's 60 recs: 60 fixed · -648 pays off the merchant's thimble and "who won" ("a draw" / "That is exactly what the winner would say.") in A18's ending and both bands; -704 keepsake gag is order-independent (each page names only its own item; A15 "getting full", A18 "Your coat pocket has stopped trying.") because content can't read which pages are done; -651 the sprout lantern speaks through narrator lines (no lantern speaker exists); -699 the fold line sits in a15-15-courage-done where the symmetry lesson lives; -703 a16-07-drinker's lesson already sat after the grave line · canon: none
- 2026-10-24 run 13 · [review-2026-10-24-3](review-2026-10-24-3.md) · units: atlas/A19/main.md, atlas/A19/sprout.md, atlas/A19/reader.md, atlas/A20/main.md, atlas/A20/sprout.md, atlas/A20/reader.md, atlas/A21/main.md, atlas/A22/main.md, atlas/A22/sprout.md, atlas/A22/reader.md · 60 recs: Critical 0, High 21, Medium 33, Nice 6 (5 cross-story) · fixed since last run: 60 (all)
- 2026-10-25 · fix pass on branch `fix/story-review-2026-10-25` · run 13's 60 recs: 60 fixed · -707 gives A21 a page-local `fern` speaker name-plated "Keeper Fern" (the script-book tool no longer lets a page's name-plate for a shared speaker leak into other storylines' renders); -711 Thor's millstone comedy ends before Baldr's death, the death scene untouched; -722 cuts A19 reader's open "fair answer" questions from 24 to 16, at most one per quest; -741 rewrites the Loki line, and Kvasir stays narration only, so he needs no cast entry; -763 moves A22 band lessons out of grave and climax beats · canon: none
- 2026-10-25 run 14 · [review-2026-10-25](review-2026-10-25.md) · units: atlas/A23/main.md, atlas/A23/sprout.md, atlas/A23/reader.md, atlas/A24/main.md, atlas/A24/sprout.md, atlas/A24/reader.md, atlas/A25/main.md, atlas/A25/reader.md, atlas/A26/main.md, atlas/A26/sprout.md · 55 recs: Critical 2, High 22, Medium 27, Nice 4 (5 cross-story) · fixed since last run: 60 (all)
- 2026-10-25 · fix pass on branch `fix/story-review-2026-10-25-2` · run 14's 55 recs: 55 fixed · -767 makes days and loaves agree (seven) in A26 main, sprout and reader, with Uta-Napishtim's wife correcting his count (-769); -768 says the Timon line in the A23 reader scene before the question quotes it; -803 swaps the A23 theme quiz for a gentle notice, because every reader scene needs a lesson; -820 drops `standard` on reader lessons where no grades 3–5 code fits (A23, A24); -821 trims 66 A24 reader replies and the over-cap A25 ones to the band cap · canon: none
- 2026-10-25 run 15 · [review-2026-10-25-2](review-2026-10-25-2.md) · units: atlas/A26/reader.md, atlas/A27/main.md, atlas/A27/sprout.md, atlas/A27/reader.md, atlas/A28/main.md, atlas/A28/sprout.md, atlas/A28/reader.md, atlas/A29/main.md, atlas/A29/reader.md, atlas/A30/main.md · 56 recs: Critical 1, High 24, Medium 24, Nice 7 (5 cross-story) · fixed since last run: 55 (all)
- 2026-10-25 · fix pass on branch `fix/story-review-2026-10-25-3` · run 15's 56 recs: 56 fixed · -822 branches Rudaba's line on the a27-11-praise choice; -824 the taught word returns at the reunion through flag values `taught-friend`/`taught-home`/`taught-sorry` (a bare "home" would match Grove flags c4-lamps and s23-stay in `variantFor`), with variants in main, sprout and reader; -832 adds an `a26-scorpion-wife` speaker in A26 main and both bands; -857 turns the A27 feast maths lesson into an L.3.4 word lesson so two maths lessons don't sit back to back; -874 A28 reader lessons moved off the stopper and wait beats, with small replacement lessons · canon: none
- 2026-10-25 run 16 · [review-2026-10-25-3](review-2026-10-25-3.md) · units: atlas/A30/sprout.md, atlas/A30/reader.md, atlas/A31/main.md, atlas/A31/sprout.md, atlas/A31/reader.md, arcade/PA1/main.md, arcade/PA1/sprout.md, arcade/PA1/reader.md, arcade/PA2/main.md, arcade/PA3/main.md · 57 recs: Critical 1, High 23, Medium 32, Nice 1 (5 cross-story) · fixed since last run: 56 (all)
- 2026-10-26 · fix pass on branch `fix/story-review-2026-10-26` · run 16's 57 recs: 57 fixed · -878 Little Sprouts pa1-16-friends names the four arrivals one by one and counts to 4; -924 drops the three sprout locked-gate scenes (the sprout gate always opens; content-check exempts them); -913 adds `pa1-11-garden-done-clank` in main and both bands; -906 adds `pa2-06-complete-unset` (Byte's biscuit run), wired by a new PA2 entry for s7Done in `GROVE_UNSET` in src/sim/atlas.ts; the old "play after" Clank scenes in PA1 and PA3 never played, so they now replace their host scenes (`pa1-01-shed-done-clank`, `pa3-01-cabinet-clank`, `pa3-07-plaque-clank`, `pa3-13-memory-clank`, `pa3-17-complete-clank`), with a test · canon: none
- 2026-10-26 run 17 · [review-2026-10-26](review-2026-10-26.md) · units: arcade/PA4/main.md, arcade/PA5/main.md, lines/LB/main.md, lines/LB/sprout.md, lines/LB/reader.md, lines/LK/main.md, lines/LK/sprout.md, lines/LK/reader.md, lines/lang-hebrew/main.md, lines/lang-hebrew/sprout.md · 58 recs: Critical 3, High 18, Medium 36, Nice 1 (3 cross-story) · fixed since last run: 57 (all)
- 2026-10-26 · fix pass on branch `fix/story-review-2026-10-26-2` · run 17's 58 recs: 57 fixed, 1 partial · -935 PA4's "play after" inserts are now 13 replacing variants; Wisp's Grove answer reaches them through a new `GROVE_VALUE_ALIASES` in src/sim/atlas.ts (spared/sable → wisp-warm, driven → wisp-driven), and the friends' lines play one per friend through PA4's `lineLive` (`ARCADE_PA4_LINE_NEEDS`) in src/sim/arcade-catalogue.ts; -936 PA5's eight memories are `-photohunt` variants, the eighth sets `pa5-hunt`, and the post-credits `look-back` choice carries Pixel's album recap; -937 LK reader keeps ten crocodiles; -939 partial: LK ids and values renamed (lk07-garden-wulan, pit-stuck/pit-ramp), but no sim engine plays LK yet, so its variant test waits for CV4; LB, LK and PA5 flag values renamed so none collides with a Grove value (box-big, oldman-told, ...); tests for the PA4 and PA5 variants · canon: none
- 2026-10-26 run 18 · [review-2026-10-26-2](review-2026-10-26-2.md) · units: lines/lang-hebrew/reader.md, lines/lang-hebrew/words.md, lines/lang-japanese/main.md, lines/lang-japanese/sprout.md, lines/lang-japanese/reader.md, lines/lang-japanese/words.md, extras/readers.md, extras/results.md, campaign/book-1.md, campaign/book-2.md · 43 recs: Critical 0, High 8, Medium 27, Nice 8 (3 cross-story) · fixed since last run: 57 (1 partial)
- 2026-10-26 · fix pass on branch `fix/story-review-2026-10-26-3` · run 18's 43 recs: 43 fixed · -1000 c5-circuit's choices set `c5-race` (want/win/home) and Corvin quotes the answer back in c9-open and c9-open-sold through src/sim/choice-payoffs.ts, all three bands; -1003 LJ3 and LJ4 choices set `lj3-race` and `lj4-bento`, paid off in their done scenes through choice-payoffs.ts (tests in choice-payoffs.test.ts); -996 Nova's owl speech, with Marina cutting it short, plays in both ledge scenes on every route; -999 the sandstone Nubbin stays unnamed at Lantern Night so Fossil is still introduced once; -993 the Japanese reader's snow lesson moves to the lantern-making scene and lj6-s3 keeps a gentle notice before the lanterns are lit; -1033 Hebrew and Japanese reader lessons rebuilt on approved grades 3–5 codes with their numbers stated (lj3-s3 counts ten stars in twos) · canon: none. SR-20261026-939 (LK) stays partial.
- 2026-10-26 run 19 · [review-2026-10-26-3](review-2026-10-26-3.md) · units: campaign/book-3.md, campaign/triggered.md, campaign/endings.md, campaign/sprout.md, campaign/reader-1.md, side/S01.md, side/S02.md, side/S03.md, side/S04.md, side/S05.md · 48 recs: Critical 0, High 11, Medium 25, Nice 12 (5 cross-story) · fixed since last run: 43 (all)
- 2026-10-26 · fix pass on branch `fix/story-review-2026-10-26-4` · run 19's 48 recs: 47 fixed, 1 partial · new sim payoffs, tested: s2-night reads `s2-early` and `s2-carried` (choice-payoffs.ts); SWAPS for s1-boats (sail), s1-cinder (offered), a gap-seat Hazel line in s3-moot, and c10-dawn, c10-kept, end-hazels-grove(-open) and end-moss-sleeps through a new `Swapper.swapText` (story-scenes.ts); -1037 adapted: the sold Nubbin leaves the garden in c9-open-sold, since c9-shard-reconciled says the garden is empty; -1055 partial: `T_TALK_GENERIC_ROTATION` is written in campaign-book1.ts, but nothing plays t-talk-generic (the talk command only shows a toast), so wiring it needs a trigger or UI decision; both campaign bands moved lessons out of their gravest beats (-1079..1082) · canon: none
- 2026-10-26 run 20 · [review-2026-10-26-4](review-2026-10-26-4.md) · units: side/S06.md, side/S07.md, side/S08.md, side/S09.md, side/S10.md, side/S11.md, side/S12.md, side/S13.md, S01/sprout.md, S01/reader.md · 57 recs: Critical 0, High 11, Medium 37, Nice 9 (3 cross-story) · fixed since last run: 47 of 48
