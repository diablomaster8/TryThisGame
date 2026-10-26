# Script log: LK1–LK10 Mouse-Deer (Sang Kancil tales)

File: `src/content/lines-lk.ts`. Audience `all`, Learning Grove only (no main-game line).

Exports:
- `LINE_LK`, `LINE_LK_VARIANTS`, `LINE_LK_FLAGS` and `LINE_LK_CHECKS`.
- The two bands: `LINE_LK_EDU: Record<EduBand, EduQuest[]>`, `LINE_LK_EDU_VARIANTS: Record<EduBand, EduScene[]>` and `LINE_LK_EDU_CHECKS`.

## Counts

**Base script:**
- 10 quests and 21 steps.
- 45 scenes: 41 in the quests and 4 variants.
- 305 lines, counting choice `then` lines.
- 7 choices in 3 choice points: lk01-names, lk03-turn and lk09-ending.

**Bands:**
- 90 edu scenes: 45 per band, one for every base scene and variant.
- 94 lessons: science 22, sel 26, maths 19, literacy 16, social-studies 9, health 1, art 1.
- Every quest uses at least 3 domains and has at least one sel lesson in each band. No two maths lessons come in a row.
- Every reader quest has a think question.
- The reader band has a glossary of 18 words.

**Standards used (all on the approved list):**
- NGSS: 1-PS4-2, 2-LS2-1, 2-LS4-1, 3-PS2-1, 4-LS1-1, 4-LS1-2, K-ESS3-1, K-LS1-1, K-2-ETS1-1, 3-5-ETS1-2.
- Maths: K.CC.A.1, K.CC.B.4, K.CC.B.5, K.CC.C.6, K.G.A.1, K.MD.A.2, 1.OA.A.1, 2.OA.A.1, 2.OA.C.3, 3.OA.A.1, 3.OA.A.3, 4.G.A.3.
- English: RF.K.2, RL.K.3, RL.1.4, RL.2.3, RL.2.4, RL.3.3, RL.4.2.
- Social studies: D2.Civ.8.K-2, D2.Geo.2.K-2, D2.His.2.K-2.
- CASEL: all five competencies.
- ELOF: Language and Communication, and Scientific Reasoning.

**`edu:` checks:**
- `edu:order:shadows:size`
- `edu:count:ideas:3`
- `edu:count:crocodiles:10`
- `edu:count:snails:10`
- `edu:count:seeds:5`
- `edu:count:logs:6`
- `edu:count:crocodiles:20`
- `edu:tap:shape:reflection`

## Lifted text

None. The tales are traditional and told in our own words, and nothing is quoted, so no `childLines` are needed.

These Malay and Indonesian words appear on screen and need adviser checks:
- the numbers 1–10 (8 is *lapan* in Malay and *delapan* in Indonesian)
- *Sang Kancil* and *Si Kancil*
- *buaya*, *Pak Tani*, *Mak Cik* and *Bu*
- *kuih* and *kue*
- *wayang*, *wayang kancil* and *wayang kulit* (Kelantan)

## Flags

**Grove flags read:** none.

**Flags written,** all `lk-` and none of them Grove flags:

| Flag | Values | Set in |
| --- | --- | --- |
| `lk-first` | siti, wulan | LK1 |
| `lk-croc` | thanks, sorry, laughed | LK3, the signature choice |
| `lk-pit` | pit-stuck, pit-ramp | LK9 |
| `lk-done` | true | LK10 |

## Variants

| Variant | Plays in place of | When |
| --- | --- | --- |
| `lk04-grab-laughed` | `lk04-grab` | `lk-croc` = laughed |
| `lk04-grab-sorry` | `lk04-grab` | `lk-croc` = sorry |
| `lk07-garden-wulan` | `lk07-garden` | `lk-first` = wulan |
| `lk10-line-laughed` | `lk10-line` | `lk-croc` = laughed |
| `lk10-count-wulan` | `lk10-count` | `lk-first` = wulan |
| `lk10-complete-pit-ramp` | `lk10-complete` | `lk-pit` = pit-ramp |

Each quest's `notes` says the same.

## SIM needs

- **Learning Grove gating.** The line is offered only when the Learning Grove is on, after chapter 6. It pauses during chapters 9–11.
- **Variant selection.** The six variants above are picked by flag.
- **Stream crossing (LK3, LK10).** 10 Nubbins, then 20, float in lines across the stream, and the player's Nubbin hops along them. Fill from wild Nubbins when the Grove has fewer.
- **Sprout defaults.** Sprout omits `laughed` (defaultChoice `thanks`) and the LK9 choice (defaultChoice `ramp`).
- **Rewards (all one-time):**
  - the Kancil puppet (a held item);
  - the crocodile stepping-stones and the cucumber trellis (decor);
  - the shadow screen (decor);
  - Siti and Wulan staying in the valley (a feature).
- **Idle lines.** Siti and Wulan's evening idle lines in both languages still need writing with the advisers. They are unlimited and give nothing.

## Changes from the outline

- **LK8.** Kancil warns of "a tiger who lives in this pool" instead of saying "his king is … there in the river". That way a king, who may be read as the Prophet Sulaiman, is never pictured, even as a reflection.
- **LK7.** I didn't claim that *wayang kancil* "began with" the cucumber tale; I couldn't verify it. Wulan says it's the tale she heard first.
- **LK1 to LK2.** The choice decides LK7 and LK10 only. The other tales have fixed tellers.
- **Two choice/lesson splits:**
  - LK7's sprout "what should Kancil say?" is a lesson (every answer is kind), not a flag choice.
  - LK9's choice has no later payoff; it resolves inside the tale. LK1 and LK3 carry the line's long payoffs.
- **The lapan/delapan notice (LK3) is a literacy lesson** using ELOF: Language and Communication, not Mathematics Development. Otherwise two maths lessons would come in a row in the big scene.
- **Extra lessons and props.** The `edu:count:ideas:3` and `edu:count:seeds:5` checks and the LK7 "3 rows of 4" seeds are extra lessons needed to give every scene one.
- **Reader done scenes** reuse the short base done scenes (2–5 lines), below EDU-STYLE's 6-line guide.
- **Frame.** Pixel only cameos in LK10, rigging a second lamp. LK is not an Arcade cartridge, so there is no "player two" frame.
- **One file.** Both bands live in `lines-lk.ts` (as the task asked), not in separate `edu-lk-*` files.

## Validation

- tsc (strict, plus `exactOptionalPropertyTypes` and `noUncheckedIndexedAccess`) and eslint are clean.
- A self-check found no problems:
  - ids are unique and every `requires` resolves;
  - every base scene has a version in both bands, and lesson ids are unique;
  - every `after` index is in range and every standard is approved;
  - sprout lines are 14 words or fewer, reader lines 30 or fewer, and every line is 160 characters or fewer;
  - narration is at most two sentences;
  - reader keeps every choice.
- **Not done yet: the wiring.** Register the file in `index.ts` and `edu.ts`, add it to `packs` and `eduPacks` in `content-check.ts`, and spread `LINE_LK_EDU_VARIANTS` per band.

## For Maor

- Malay and Indonesian advisers need to check:
  - the counting audio and spellings;
  - Siti's tudung and both women's clothes;
  - the lamp and the *wayang* puppets;
  - the kuih and kue.
- Is the LK8 change (no king in the river) all right?
- Do you want LK9's "old ending" to echo in LK10? Right now it pays off only inside LK9.
