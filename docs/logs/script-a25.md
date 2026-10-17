# Log: A25 The Nothing

File: `src/content/atlas-a25.ts`. Exports `ATLAS_A25`, `ATLAS_A25_VARIANTS`, `ATLAS_A25_FLAGS`, `ATLAS_A25_CHECKS`.
`tsc` (strict, the brief's flags) and `eslint` pass with no output; the file is Prettier-formatted. A self-check script
(scratchpad, not in the repo) finds: ids unique, every `requires` resolves, every `who` declared, every line ≤ 160
(longest 138), step scenes 6–16 lines, every quest has a choice, every lifted line keyed in `childLines`, the checks
list exact, no straight quotes in player text. No narrator line has more than two sentences: Hazel's four-sentence
margin note is split across two narrator lines (as in `a20-margin-hazel`), its words exactly as S24 gives them, and
with no "H." line under it because S24's text for A25 doesn't end in one (review, 2026-10-16). It is now registered in `index.ts`, and
`tests/tools/content-check.ts --warnings` reports `problems: 0` with no warning naming `a25-` (review, 2026-10-16).

## Counts

- Quests: 20 (A25-1 to A25-20), audience `all`, chained by `requires`.
- Steps: 52 (2–3 per quest).
- Scenes: 130 (119 in the quests, 11 variants).
- Lines: 661, counting choice `then` lines.
- Choices: 28 choice points with 58 options. Every quest has at least one.
- Checks: 52, all with existing verbs.

## Lifted text (copyrighted; two one-sentence lines, under the limit of three)

Both in Ende's German as Part M lists them (Thienemann, 1979), each followed by Part M's own English on the next
line. No Manheim (1983) wording and nothing from the films.

1. « TU WAS DU WILLST » / "Do what you wish." `a25-15-sand#8`, English in Bastian's mouth at `#9`.
2. « Aber das ist eine andere Geschichte und soll ein andermal erzählt werden. » / "But that is another story, and
   shall be told another time." `a25-16-hynreck#8`/`#9` (the page cuts Hynreck off) and `a25-20-shop#10`/`#11`
   (Coreander).

Each German line and its English have `childLines`. The name "Moon Child" (Mondenkind) is used. Uyulala's rhymes,
Gmork's speech, the Water's questions and the Old Man's retelling are all original. `a25-16-complete` has a deliberate
half-echo ("But that is another story.") in our own words at `#1`, which has a `childLines` line too.

## Flags

- **Read (Grove, read-only):**
  - `s6Done`: `a25-13-empress-ash` (A25-13), `a25-20-water-ash` (A25-20), `a25-grove-ember` (Ember after the page).
  - `s24Done`: `a25-margin-hazel`, after `a25-16-complete`.
- **Written (Atlas save only):** `a25-01`…`a25-20`, `a25-done`, and `a25-mirror` = truth | yourself | notebook.
  No Grove flag is written.

## Variants (`ATLAS_A25_VARIANTS`, 11)

- **Ash (s6Done):** `a25-13-empress-ash` replaces `a25-13-empress`, with the Empress's kitchen-and-lamp line.
  `a25-20-water-ash` replaces `a25-20-water`: the Nubbin whistles low, high, a little one, and Atreyu still says the
  name. `a25-grove-ember`: "Names. Everyone thinks they're words."
- **The mirror (A25-15, the signature choice):**
  - truth: base `a25-16-worry` (he tells Atreyu about the attic, laughing), `a25-18-attic-truth` (after the battle he
    can't remember it and asks you), base `a25-20-complete` (runs out past you and almost sees you).
  - yourself: `a25-16-worry-yourself` (can't answer Atreyu, cross with you), `a25-19-ask-yourself` (asks before the
    mine; late, but it counts), `a25-20-complete-yourself` (walks home saying his own name).
  - notebook: `a25-16-worry-notebook` (Atreyu sees your hand go to your pocket), `a25-19-page-notebook` (you read it to
    him; "Keep it, then."), `a25-20-complete-notebook` (the page is in his pocket now; he reads it and keeps it).
- **Hazel:** `a25-margin-hazel`, the outline's note verbatim, split across two lines.

## SIM needs

- **The Attic Nook** (feature, A25-20): the cottage loft gains a blanket, a red/green reading lamp and books. Reading
  from the loft draws nearby Nubbins up to sit with you (idle behaviour, no stat reward). It reads `atlasDone('A25')`.
  On notebook, the torn page (decor reward) is pinned to the beam.
- **Grain of Sand** (decor, A25-14): glows faintly at night on the Grove's clock.
- **Pearl-Scale Cape** (cosmetic, A25-12).
- **Two inks:** attic scenes tinted rust-red, Fantastica green, including dialogue-box borders.
- **A25-9's No-Key Gate:** completes after about four seconds of idle input; any input restarts the count without a
  message. A25-10's rhyme puzzle loops until the rhyming choice is picked; no fail state.
- **A25-13:** the Empress says the Nubbin's name. It is never shown as text; a soft chime plays in its place.
- **Ember's scene** plays the next time you visit Ember after `atlasDone('A25')`, if `s6Done`.

## Changes from the outline

- **"You can't give her name"** is in the outline under Q10. Uyulala says it first, in rhyme, after you answer her in
  rhyme (A25-10). The Empress then says it plainly when you first meet her (A25-13).
- **A25-12:** Falkor finds AURYN in the sea with you as step 1, before Spook City. This puts the Keeper on Falkor's
  side of the split, as the outline's A25-11 leaves you there.
- **A25-17 to A25-19:** Atreyu asks you to stay with Bastian (A25-17) and, after the battle, to go after him (A25-18).
  The outline has you with Bastian again in A25-19, so this explains how you get there.
- **A25-19** folds four places into one quest, as the outline does: the City of Old Emperors, the Yskálnari, the House
  of Change and Yor's Minroud.
- **A25-20:** Bastian's night with his father is reported in the shop scene, not shown.
- **Audience:** all 20 quests are `all`, as in A16. The Learning Grove version (reader band, Part One only, ending at
  A25-14) is a separate job and is not in this file.

## For Maor

- **Licences:** this page needs a licence from the Ende estate and Thienemann before it ships, as do AURYN and the
  cover. Until then the art uses an original two-snake emblem.
- **The Greenskins** need an adviser pass on their design. The script avoids every stereotype the outline lists.
- **Atreyu's bow:** I had him leave his bow in A25-4 ("go without weapons"). That is my memory of the novel, so it
  should be checked against the 1979 text.
- **Names:** the messenger names (Pyornkrachzark, Blubb, Ückück, Gluckuk) also come from memory and need checking
  against the 1979 text.
- **Parent note:** there is an optional parent note before A25-5 (Artax). Its text is in that quest's notes.

## Resolved (2026-10-15)

- **Messenger names:** kept. They match the novel's opening chapter from memory, and Pyornkrachzark (the rockchewer) is confirmed by secondary sources. Blubb, Ückück and Gluckuk aren't confirmed online and still need a line check against the 1979 text.
- **Atreyu's bow:** kept. Cairon's "go without weapons" and the bow laid down are certain for the 1984 film (Wikiquote transcript), and fit the novel as remembered, but the novel's own wording isn't confirmed. Our line is our own wording either way. Check it against the 1979 text with the quote pass.
