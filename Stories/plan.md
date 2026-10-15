# plan.md: Hazel's Grove, remaining development

This file breaks everything left into tasks you can hand to Claude Code subagents. Each task names
a model, says why, and has a prompt ready to copy and paste.

## How to use it

1. **One-time setup (Task 0).**
   - Copy the content pack into the repo root: `src/content/`, `tests/tools/`, `script-book/`,
     `docs/`, `CLAUDE.md` and this `plan.md`.
   - Run the three checks below, then commit.
2. **Work through the tasks in order.** Start Claude Code in the repo root and paste a task's
   prompt into the main session.
   - The prompt tells the session which subagents to start, and with which model. In Claude Code
     the main session picks the model per subagent (`fable`, `opus`, `sonnet` or `haiku`).
3. **After every scripting task, run Task W (wiring), then Task R (review).** Don't start the next
   wave until R reports 0 must-fix items and the checks are clean.
4. **For engine tasks (C1–C7), follow CLAUDE.md's rule:** one milestone per session, a plan
   first, and wait for your approval.

**The checks** (all three must pass after every task):

```
npx tsc --noEmit -p .
npx eslint src/content tests/tools
npx tsx tests/tools/content-check.ts --warnings    # must print "problems": 0
```

**Usage.** A scripting subagent uses roughly 250k–400k tokens, so a 10-subagent wave is about 3–4M.
If you hit a usage limit partway, re-run the same prompt and tell it which ids are already done.

## Which model for what

| Model | Use it for | In this plan |
| --- | --- | --- |
| **Fable** | The hardest long-horizon reasoning across many files at once. It's the top tier and the most expensive. | V3, the whole-canon continuity audit. C1, the campaign wiring and ending logic (optional; Opus is fine). |
| **Opus** | Writing at the campaign's quality bar, sensitive cultural material, and multi-system engine work | Every Atlas, Arcade and Learning Grove scripting task. Reviews (R). Edu versions of the side stories. C3–C6. |
| **Sonnet** | Well-specified work that follows a template: fun packs, wiring, settings code, verification with the web | S5b fun packs, W, E2 drafts, V1, V2, C2, C7 |
| **Haiku** | Mechanical upkeep | H (script book, PROGRESS.md, pack rebuild) |

Model names and prices change, so check the current list on docs.claude.com before you start.
If your plan doesn't include Fable, use Opus wherever this file says Fable.

## Where things stand (2026-10-15)

- **Scripted and checked:**
  - campaign v2;
  - side stories S1–S31;
  - fun quests Q1–Q65;
  - Neopia;
  - the Multiverse;
  - readers and results;
  - Atlas A11–A21;
  - Learning Grove versions of the campaign, S1–S22, and the Python, Bean and Avatar quests;
  - the Hebrew and Japanese questlines.
- **Outlined, not yet scripted:**
  - Atlas A1–A10 (`docs/atlas.md`);
  - A22–A31, PA1–PA5, Q66–Q95, LB and LK (`docs/more-stories.md`).
- **Not built in the engine yet:** CV1–CV6 in `docs/grove-backlog-prompt.md`.

## Task list

| ID | Task | Model | After | Size |
| --- | --- | --- | --- | --- |
| 0 | Set up the repo and docs | Opus (main session) | none | small |
| S3 | Script Atlas A22–A31 | Opus ×10 | 0 | large |
| S4 | Script Atlas A1–A10 | Opus ×10 | S3+R | large |
| S5a | Script Arcade PA1–PA5 and Learning Grove lines LB, LK | Opus ×7 | S4+R | large |
| S5b | Script fun packs Q66–Q75, Q76–Q85, Q86–Q95 | Sonnet ×3 | S4+R | medium |
| W | Wire new files (index, checker, edu registry, script book) | Sonnet | each S/E task | small |
| R | Review a wave, fix mode | Opus | each W | medium |
| E1 | Learning Grove versions of S24–S31 | Opus ×8 | 0 | large |
| E2 | Learning Grove versions of the `all` Atlas and Arcade pages | Sonnet ×N, then Opus R | the matching S task | large |
| V1 | Verify the public-domain quotes and re-lift the verified ones | Sonnet (web) | any | medium |
| V2 | Cultural-adviser review packets | Sonnet | after scripting | small |
| V3 | Whole-canon continuity audit | Fable | all S and E | large |
| C1 | Engine: campaign v2, endings and chapter holds (CV1 and CV6) | Fable or Opus | 0 | large |
| C2 | Engine: audiences and the Mature content setting | Sonnet | 0 | small |
| C3 | Engine: side-story and fun-quest triggers, variants, line swaps | Opus | C1 | large |
| C4 | Engine: the Learning Grove mode (CV2) | Opus | C1 | large |
| C5 | Engine: the language questlines (CV3) | Opus | C4 | medium |
| C6 | Engine: Atlas, Arcade and Multiverse saves; the cross-save reads (CV4, CV5) | Opus | C1 | large |
| C7 | Engine: no-chores clean-up (freebies, daily gifts) | Sonnet | your decision on daily gifts | small |
| H | Housekeeping (script book, PROGRESS.md, pack) | Haiku | anytime | small |

---

## Task 0. Set up the repo and docs

**Model:** Opus, as the main session.

**Why:** a one-off reading of the master prompt, which sets up the docs files and the PROGRESS.md
backlog.

```text
Read CLAUDE.md (including the new section "Story and content: tone, writing style and current plan")
and plan.md. Then follow docs/grove-backlog-prompt.md, "What to do", steps 1–5. These docs files are
already supplied in docs/, so keep them as they are rather than regenerating them:
- docs/atlas.md
- docs/more-stories.md
- docs/canon.md
- docs/briefs/*.md
This is setup, not a milestone: don't write game code. Finish by running:
- npx tsc --noEmit -p .
- npx eslint src/content tests/tools
- npx tsx tests/tools/content-check.ts
Report the results, then suggest a commit message.
```

---

## Task S3. Script Atlas pages A22–A31

**Model:** Opus, 10 subagents in parallel.

**Why:** these pages draw on living cultures and faiths (Colombia, East Africa, Persia, the Akan,
Korea, Jewish tradition, the K'iche' Maya) and need the campaign's writing quality.

```text
This is a content task, not a milestone, so no plan approval is needed. Start 10 subagents in
parallel, each with model "opus". Give each one this prompt, filling in <ID>, <FILE>, <NAME> and
<EXTRAS> from the table below:

---
Follow docs/briefs/script.md exactly. Your line is <ID>, an Atlas page; its outline is in
docs/more-stories.md (find the section by its id).
File: src/content/<FILE>   NAME: <NAME>
<EXTRAS>
---

| ID | FILE | NAME | EXTRAS |
| A22 The Candle (Encanto) | atlas-a22.ts | ATLAS_A22 | It reads the Long-Grass lantern state (flickering, dark, lit, warm, and the kept-stone line) through variants, and describes a read-only longGrassLantern() helper under SIM. Pedro's death is told, not shown, and the war is never named. Copyrighted: at most 3 quotes, from the outline. No lyrics. Name the Colombian advisers needed. |
| A23 Remember Who You Are (The Lion King) | atlas-a23.ts | ATLAS_A23 | You are with Zazu during the stampede, so the death is never seen, and Scar's end is offscreen. Flag the Swahili words for an East African adviser. Copyrighted: at most 3 quotes. No lyrics; "hakuna matata" appears only as the everyday phrase. |
| A24 The Law of the Jungle (Kipling) | atlas-a24.ts | ATLAS_A24 | Public domain: lift the outline's verified passages only. "The White Seal" is a coda. Keep the care notes on Kipling's imperialism and on the Unangax̂ seal hunters. |
| A25 The Nothing (The Neverending Story) | atlas-a25.ts | ATLAS_A25 | Covers both halves of the novel. It reads s6Done (Ash's true name, her three whistled notes). Copyrighted: at most the 2 lines in Ende's German with our own English, as in the outline. |
| A26 The Wall of Uruk (Gilgamesh) | atlas-a26.ts | ATLAS_A26 | Lifted text only as the outline allows (Thompson 1928, with its copyright caveat). Moss joins only after chapter 4, and never after the Moss Sleeps ending. Audience 'all'; stage Humbaba and the Bull of Heaven gently. |
| A27 The White-Haired Prince (Zal and the Simurgh) | atlas-a27.ts | ATLAS_A27 | Lift from Zimmern 1883 only where verified. Keep the albinism care note; Persian heritage is treated with respect. |
| A28 The Box of Stories (Anansi) | atlas-a28.ts | ATLAS_A28 | Rattray 1930 passages only where verified; retell the Sky-god story. Wisp and Anansi trade, badly, if wisp is spared. Akan advisers. |
| A29 The Honmoon (KPop Demon Hunters) | atlas-a29.ts | ATLAS_A29 | No quotes, no lyrics and no song titles at all. It reads Sable's trust stage. Korean cultural care: jeoseung saja, gat, and the folk-painting tiger and magpie. |
| A30 The Word on the Brow (the Golem of Prague) | atlas-a30.ts | ATLAS_A30 | Uses the same letters as the Hebrew questline LH2 (emet אמת, met מת). Give both versions of the legend (the word on the brow, the Name in the mouth). Lift only the verified Jewish Encyclopedia 1904–06 and JPS 1917 passages. Treat Rabbi Judah Loew with respect; Jewish advisers. |
| A31 The Hero Twins (Popol Vuh) | atlas-a31.ts | ATLAS_A31 | Spence 1908 passages only where verified. It reads s3Done (the Sun and Moon ribbons). K'iche' Maya advisers decide which twin becomes the Sun; present it as a living tradition. |

When all 10 have finished, list each subagent's 3-line reply and the log path. Then run the three
checks and report them. Don't fix other agents' files.
```

---

## Task S4. Script Atlas pages A1–A10 (Part L)

**Model:** Opus, 10 subagents in parallel.

**Why:** these outlines are thinner than Part M's, so the writer must expand them carefully.
Three of the pages are `teen`.

```text
This is a content task, not a milestone. Start 10 subagents in parallel, each with model "opus".
Give each one this prompt, filling in the placeholders from the table:

---
Follow docs/briefs/script.md exactly. Your line is <ID>, an Atlas page from Part L; its outline is
in docs/atlas.md. Part L outlines are shorter than Part M's: expand each quest into concrete
scenes. Keep its quest list, signature choice, rewards and care notes. Every source here is either
copyrighted or uses unverified translations, so don't lift text verbatim: write original dialogue,
with at most 3 one-sentence quotes for a copyrighted source.
File: src/content/<FILE>   NAME: <NAME>   Audience: <AUD>
<EXTRAS>
---

| ID | FILE | NAME | AUD | EXTRAS |
| A1 The Brothers' Bargain (Fullmetal Alchemist) | atlas-a01.ts | ATLAS_A01 | teen | Tucker's chimera is offscreen and implied. Combat isn't graphic. Follow Brotherhood's episode order. |
| A2 The Monkey and the Monk (Journey to the West) | atlas-a02.ts | ATLAS_A02 | all | Follow the novel's order as fixed in docs/atlas.md. The Buddha and Guanyin are wise and kind, never mocked. The cloud-somersault reward is unlimited (no timer). |
| A3 Forty-Nine Days (Along with the Gods) | atlas-a03.ts | ATLAS_A03 | teen | Suicide is only ever "the worst night": never depicted or explained. Korean afterlife advisers. |
| A4 The Waterfall Prince (Baahubali) | atlas-a04.ts | ATLAS_A04 | teen | Heroic, not graphic. Bhallaladeva's end is offscreen. Present the kingdoms as the films' fiction. Indian advisers; mind the Telugu and Tamil versions. |
| A5 The Lion of Mali (Sundiata) | atlas-a05.ts | ATLAS_A05 | all | The griot frame (Balla Fasséké). Give versions where the tellings differ. West African advisers. |
| A6 Seven Voyages (Sinbad) | atlas-a06.ts | ATLAS_A06 | all | The ivory is a real choice, and every ending lets the elephants be. Baghdad is a city of learning. Soften voyages 3 and 4. Arab and Persian heritage advisers. |
| A7 The Marigold Bridge (Coco) | atlas-a07.ts | ATLAS_A07 | all | No lyrics; any songs are original. Día de Muertos is a living tradition, with Mexican consultants. The ofrenda holds your Nubbins' photos; the Remembering Tree (canon 35) holds their stories. |
| A8 The Twelve Tasks (Asterix) | atlas-a08.ts | ATLAS_A08 | all | Use the verified task order in docs/atlas.md. The national jokes stay affectionate. Permit A38 is the centrepiece. |
| A9 The Comet (Comet in Moominland) | atlas-a09.ts | ATLAS_A09 | all | Verified details: the Hemulen hunts butterflies; the octopus (the Snork Maiden rescues Moomintroll); the tornado and the Hemulen's dress used as a glider; the comet is due on 7 October at 8:42 in the evening. |
| A10 The Heart of the Island (Moana) | atlas-a10.ts | ATLAS_A10 | all | No film songs; Gramma's song is original. Maui is a revered figure. Pacific Islander advisers. Your Nubbin stows away on the canoe. |

When all 10 have finished, report each reply and log path, then run the three checks.
```

---

## Task S5a. Script Pixel's Arcade PA1–PA5 and Learning Grove lines LB and LK

**Model:** Opus, 7 subagents.

**Why:** the Arcade carries the game's themes (Chaos as Cinder; mercy). LB and LK need lessons
woven in for both bands.

```text
This is a content task, not a milestone. Start 7 subagents in parallel, each with model "opus".
Give each one this prompt, filling in the placeholders from the table:

---
Follow docs/briefs/script.md exactly. Your line is <ID>; its outline is in docs/more-stories.md,
and Pixel's Arcade frame is under "Pixel's Arcade (the frame)". Pixel is she/her and sits at the
controls as player two. Cartridges never write Grove flags.
File: src/content/<FILE>   NAME: <NAME>   Audience: <AUD>
<EXTRAS>
---

| ID | FILE | NAME | AUD | EXTRAS |
| PA1 The Chao Altar (Sonic Adventure) | arcade-pa1.ts | ARCADE_PA1 | main | It reads cinder. At most 2 quotes (Tikal's prayer), marked for checking against the English script. Sega rights note. |
| PA2 The Clone Island (Pokémon: The First Movie) | arcade-pa2.ts | ARCADE_PA2 | all | It reads s7Done (Byte watches). At most 3 quotes. |
| PA3 The Hollow Kingdom (Hollow Knight) | arcade-pa3.ts | ARCADE_PA3 | all | 12 grubs. At most 3 quotes. |
| PA4 Mercy (Undertale) | arcade-pa4.ts | ARCADE_PA4 | all | Sparing everyone is the only path; the kill-everyone route doesn't exist. It reads wisp. At most 3 quotes. |
| PA5 The Hundred-Year Sleep (Breath of the Wild) | arcade-pa5.ts | ARCADE_PA5 | all | The thirteenth memory plays only if you hunted every memory. At most 3 quotes. |
| LB1–LB12 Play (inspired by Bluey) | lines-lb.ts | LINE_LB | all | An original family, the Larkins. Never quote Bluey or use its characters. Write the main quests AND both Learning Grove bands, following docs/briefs/edu-new.md for the edu part: lesson-first, using the approved standards in EDU-STYLE.md. |
| LK1–LK10 Mouse-Deer (Sang Kancil) | lines-lk.ts | LINE_LK | all | Shadow-puppet storytellers, one Malaysian and one Indonesian. Counting crocodiles in Malay and Indonesian is the maths centrepiece. Write the main quests AND both bands, as for LB. Malay and Indonesian cultural care. |

When all 7 have finished, report each reply and log path, then run the three checks.
```

## Task S5b. Script the fun packs Q66–Q95

**Model:** Sonnet, 3 subagents.

**Why:** short comic quests in a fixed format, from public-domain sources.

```text
This is a content task, not a milestone. Start 3 subagents in parallel, each with model "sonnet".
Give each one this prompt, filling in the placeholders:

---
Follow docs/briefs/script.md exactly (the "Fun packs" format). Your pack is <PACK>; its outline is in
docs/more-stories.md. Read src/content/quests-python.ts first as the format model. Each Q is one
Quest with 1–3 steps, a complete scene, rewards and childLines for every quoted line. The trigger
is never daily and "never during Chapters 9–11". Packs never set or need any flag.
Public-domain quotes: only the ones the outline marks as verified, word for word.
File: src/content/<FILE>   NAME: <NAME>
---

| PACK | FILE | NAME |
| Q66–Q75 Down the Rabbit-Hole (Alice) | quests-alice.ts | QUESTS_ALICE |
| Q76–Q85 The Hound of the Grove (Sherlock Holmes) | quests-holmes.ts | QUESTS_HOLMES |
| Q86–Q95 The Hodja's Donkey (Nasreddin Hodja) | quests-hodja.ts | QUESTS_HODJA |

Rename Q5's "White Rabbit critter" if it clashes with Carroll's White Rabbit, and say so.
```

---

## Task W. Wire new files in

**Model:** Sonnet. Run it after every S and E task.

```text
Content task, not a milestone. Use one subagent with model "sonnet".

Wire every new file in src/content/ that isn't yet exported from src/content/index.ts. Find them by
comparing the files with index.ts. For each one:

1. index.ts: export every exported const the file has (the main array, _VARIANTS, _FLAGS,
   _CHECKS, and any _EDU or edu arrays).
2. tests/tools/content-check.ts:
   - Add each storyline's main Quest[] to the `packs` map, with a short key (a22, pa1, alice…).
   - Add its _VARIANTS to NEW_VARIANTS.
   - Once a storyline has Learning Grove files (edu-<id>-*.ts, or LB/LK's built-in edu), add its
     pack key to `eduPacks` so coverage is enforced, and add its variants to `mainScenes`
     alongside the others.
3. src/content/edu.ts: import and add any new edu arrays to EDU_QUESTS[band], and their variants
   to EDU_VARIANTS[band].
4. tests/tools/script-book.ts: add a chapter per new storyline, numbered after the existing ones
   (atlas, arcade, fun packs, lines), and a matching edu section if it has one. Then regenerate:
   npx tsx tests/tools/script-book.ts script-book

Don't change any storyline's content. Run the three checks. If content-check reports problems,
list them grouped by file. Fix only wiring mistakes; leave content problems for Task R.
```

## Task R. Review a wave (fix mode)

**Model:** Opus.

```text
Content task, not a milestone. Use one subagent with model "opus". Follow docs/briefs/review.md in
"fix" mode.

Batch name: <wave, e.g. wave3>. Files to review:
<list the new src/content files from the last S or E task>

When it's done, show me the counts, the "For Maor" items and the three check results.
```

---

## Task E1. Learning Grove versions of S24–S31

**Model:** Opus, 8 subagents. S23 is `main`, so it gets none.

**Why:** these side stories touch the campaign's canon. Mistakes there show up in both bands.

```text
Content task, not a milestone. Start 8 subagents in parallel, each with model "opus". Give each one
this prompt, with <ID> = s24 … s31 and <FILE> = side-stories-s24.ts … side-stories-s31.ts:

---
Follow docs/briefs/edu-new.md exactly. Your storyline is <ID>; its script is src/content/<FILE> and
its outline is in docs/more-stories.md. Watch the canon closely: pronouns, Moss speaking only from
chapter 4, Linnet in S26, and Nubbins never speaking.
---

When all 8 have finished, run Task W, then Task R in fix mode with batch name "edu-s24-s31".
```

## Task E2. Learning Grove versions of the `all` Atlas and Arcade pages

**Model:** Sonnet drafts, then Opus reviews (Task R).

**Why:** the format is well set by E1, so Sonnet can draft. Opus catches cultural and lesson
slips.

```text
Content task, not a milestone. Find every Atlas or Arcade file in src/content (atlas-*.ts and
arcade-*.ts) that has audience 'all' and no edu-<id>-*.ts files yet. Start one subagent per
storyline, with model "sonnet", at most 10 at a time. Give each one this prompt:

---
Follow docs/briefs/edu-new.md exactly. Your storyline is <ID>; its script is src/content/<FILE>,
and its outline (with its "Learning Grove version" list) is in docs/atlas.md or
docs/more-stories.md. Teach what the outline lists, blended into the story. Keep the cultural
care notes.
---

After each batch, run Task W, then Task R (fix mode) with model opus.
```

---

## Task V1. Verify the public-domain quotes

**Model:** Sonnet, with web access.

**Why:** dozens of lifted passages are still marked [unverified], because Project Gutenberg was
blocked where they were written. The scripts paraphrase them for now.

```text
Use one subagent with model "sonnet" and web access.

In docs/atlas.md and docs/more-stories.md, find every lifted-text passage marked [unverified] or
"recheck". For each one:
1. Find the named edition on Project Gutenberg, Standard Ebooks or Wikisource.
2. Fix any wording or punctuation, and mark it verified (with the URL), or not found.

Then, in each matching script (src/content/*.ts), where a verified passage was paraphrased, you
may swap the exact text back in. Add childLines for 'all' quests, and keep each line under 160
characters (split it if needed).

Also check these seven fun-quest quotes against reliable transcripts. Report them only; don't
change them:
- "It's only wafer-thin." (Q11)
- "Teddy!" (Q21)
- "Wildcard, bitches!" (Q31)
- "I am a golden god!" (Q35)
- "Can I offer you a nice egg in this trying time?" (Q36)
- "Bird law in this country is not governed by reason." (Q38)
- "There is no Carol in HR!" (Q42)
- and the Q15 Cheese Shop line

Run the three checks. Write docs/logs/quotes.md.
```

## Task V2. Cultural-adviser review packets

**Model:** Sonnet.

**Why:** the plan promises human advisers for these pages. This task makes their job quick.

```text
Use one subagent with model "sonnet". For each storyline whose outline names advisers (A2–A7, A10,
A12, A17–A20, A22–A23, A27–A31, LK and any others you find), write docs/advisers/<id>.md:
- a half-page summary of the storyline;
- every scene that touches the culture or faith, quoted with its scene id;
- the specific questions the outline's care notes raise;
- a sign-off table (reviewer, date, approved or changes).
Don't change any content.
```

## Task V3. Whole-canon continuity audit

**Model:** Fable (or Opus).

**Why:** this needs one mind holding the whole canon at once: 12 chapters, 31 side stories,
50 new storylines and both bands. It's the biggest reasoning job in the plan.

```text
Use one subagent with model "fable" (or "opus" if fable isn't available). Follow
docs/briefs/review.md in "report" mode, with batch name "canon-audit", but across the whole canon.

Scope:
- the campaign
- S1–S31
- every Atlas, Arcade, fun pack and line
- both Learning Grove bands

Focus on:
- contradictions between storylines (names, timelines, who knows what when, flags read and
  written, rewards that clash);
- choices that never pay off;
- repeated beats across storylines;
- tone drift from CLAUDE.md's tone decisions.

Group your findings by storyline, and give an exact fix for each.
```

---

## Engine tasks (code)

These follow CLAUDE.md: one milestone per session, a plan first, and wait for approval. The
specs are in `docs/grove-backlog-prompt.md` (CV1–CV6) and the bible's "Sim changes".

### C1. Campaign v2, endings and chapter holds (CV1 and the campaign half of CV6)

**Model:** Fable or Opus.

**Why:** this touches sim/campaign.ts, flags, variant selection, line swaps and the ending order.
Mistakes here break every ending.

```text
Milestone CV1 (with the campaign items of CV6). Read:
- CLAUDE.md
- docs/canon.md
- src/content/STORY-BIBLE.md, especially "Sim changes"
- the CV1 and CV6 sections of docs/grove-backlog-prompt.md

Then give me a plan and wait.

The scope is:
- **The campaign:** swap in campaign v2 (src/content/campaign*.ts), store the new flags, and
  implement the vigil step.
- **The ending order:** follow the bible, with hazels-grove no longer requiring "keep" and
  end-hazels-grove-open as the "Open" body variant.
- **Chapter holds:**
  - c11-close waits until S9 has had its chance (the CV6 way out included);
  - c9-open waits for S27 and S28 to close;
  - S5 holds c5-close.
- **Line swaps** written in notes (c11-close when s8Done, and the others listed in CV6).
- **Variant scene selection** from the side-story _VARIANTS arrays.
- **S27's buy-back,** which moves the soldId stray home.

Add Vitest tests for endingFor covering every flag combination in the bible, including bonded
Sable with Open. npm test and npm run build must pass.
```

### C2. Audiences and the Mature content setting

**Model:** Sonnet.

```text
Milestone: content ratings. Read CLAUDE.md, docs/canon.md (items 20 and 37) and the audience items
in CV6 of docs/grove-backlog-prompt.md. Give me a plan, then wait.

Scope:
- **Setting:** add a "Mature content" setting with the positions Off, 13+ and 18+, defaulting to
  Off. Save it with a migration.
- **Filtering:**
  - teen quests show only at 13+ or higher, and adult quests only at 18+;
  - main, teen and adult quests never show in the Learning Grove;
  - fun quests never trigger during chapters 9–11.
- **Rift confirmation:** a one-time confirmation before the Multiverse rift opens.

Add tests. npm test and npm run build must pass.
```

### C3. Side-story and fun-quest engine

**Model:** Opus.

```text
Milestone: side stories. Read CLAUDE.md, docs/canon.md, the bible's side-story table and the
side-story items in CV6. Give me a plan, then wait.

Scope:
- **Story windows:** open and close each story by its chapter window (S1–S31).
- **Steps and flags:** run quest steps and their checks (stub any check verb the sim can't measure
  yet, and list them), and set sNDone and the story's flags.
- **Variants and line swaps:** pick variant scenes by flag, and apply the line swaps written in
  notes, in both Learning Grove bands too.
- **Fun quests:** trigger them by their `when` text rules, with requires chains.

Tests and build must pass.
```

### C4. The Learning Grove mode (CV2)

**Model:** Opus.

```text
Milestone CV2. Read CLAUDE.md, src/content/EDU-STYLE.md, src/content/edu.ts and the CV2 section of
docs/grove-backlog-prompt.md. Give me a plan, then wait.

Scope:
- the band switch (sprout and reader);
- eduSceneFor in place of the original scene, still applying the original's flags;
- lesson UI for ask, notice and do;
- glossary taps;
- read-aloud for sprout;
- grown-up progress by standard;
- childLines swaps.

Tests and build must pass.
```

### C5. The language questlines (CV3)

**Model:** Opus.

```text
Milestone CV3. Read CLAUDE.md, src/content/lang-hebrew.ts, src/content/lang-japanese.ts and the
CV3 section of docs/grove-backlog-prompt.md. Give me a plan, then wait.

Scope:
- right-to-left Hebrew with niqqud;
- kana rendering, with a font chosen and pinned;
- course vocab and the word lists;
- audio hooks for native-speaker recordings (use placeholder clips);
- Learning Grove-only gating.

Tests and build must pass.
```

### C6. Atlas, Arcade and Multiverse saves; cross-save reads (CV4, CV5)

**Model:** Opus.

```text
Milestone CV4/CV5. Read CLAUDE.md, docs/canon.md (items 21, 29 and 30), and the CV4 and CV5
sections. Give me a plan, then wait.

Scope:
- **Saves:** a separate save for the Atlas (pages in any order) and for the Arcade, alongside the
  Multiverse slot.
- **Entry points:** Nova's atlas item, and Pixel's cabinet after chapter 5.
- **Cross-save reads:** read-only lookups such as atlasDone(id), atlasFlag(id, flag),
  arcadeDone(id) and longGrassLantern(), so the Grove can show keepsakes. They never write.
- **E6:** the Multiverse uses a reflection of your Eternal.
- **Festival unlocks** by sets of pages.

Tests and build must pass.
```

### C7. The no-chores clean-up

**Model:** Sonnet. Decide first what the daily gifts should become.

```text
Milestone: no chores. Read docs/canon.md (items 22 and 34). Give me a plan, then wait.

Scope:
- **Neopia freebies** per src/content/results.ts: one-time or unlimited.
- **sim/daily.ts and sim/neighbourhood.ts** currently give "once a day" gifts. Convert them to
  <Maor's decision: one-time story gifts / unlimited visits with no reward timer / remove>.
- **A grep for any other timer-gated reward,** with a report on what you find.

Tests and build must pass.
```

---

## Task H. Housekeeping

**Model:** Haiku.

```text
Use one subagent with model "haiku":
1. Regenerate the script book: npx tsx tests/tools/script-book.ts script-book
2. Update PROGRESS.md's content status (scripted / edu done / reviewed) for every storyline in
   plan.md's status list, using docs/logs/ as the source.
3. Run the three checks and report the results.
Don't change any content.
```

## Suggested order

1. **Task 0.**
2. **Content:** S3 → W → R, then S4 → W → R, then S5a + S5b → W → R.
3. **Learning Grove, alongside the content:** E1 → W → R, then E2 in batches.
4. **Checks:** V1 and V2 at any time, then V3 once all scripting and edu work is done.
5. **Engine, alongside the content:** C2 → C1 → C3 → C6 → C4 → C5 → C7. (C2 first, because it's
   small and unblocks safe testing.)
6. **Task H** after each batch.
