Run /clear first. Put `grove-content-pack.zip` in the repo root, then paste everything below into Claude Code.

---

Read CLAUDE.md and PROGRESS.md. **This session is planning only. Do not build anything.** It overrides the standing approval in PROGRESS.md. Your job is to file every recommendation below as a potential improvement, commit, and stop.

## What to do

1. **Create seven files.**
   - `docs/ideas-2026-10-13.md`: put Parts A–E below into it, word for word, under the title "# Recommendations, 2026-10-13 (for Maor's review)". Don't shorten the storylines or the quests.
   - `docs/multiverse-campaign.md`: put Part F into it, word for word, under the title "# Multiverse campaign (for Maor's review)".
   - `docs/neopia.md`: put Part G into it, word for word, under the title "# Neopia: retro Neopets (for Maor's review)".
   - Also add Part H's Avatar quest table (Q46–Q65) to `docs/ideas-2026-10-13.md`, right after the It's Always Sunny quests.
   - `docs/learning-grove-stories.md`: put Parts J and K into it, word for word.
   - `docs/story-bible.md`: put Part I into it, word for word. It is the canon for the campaign and the side stories, and it wins over anything older in this prompt or in the repo.
   - `docs/atlas.md`: put Part L into it, word for word, under the title "# The Atlas: ten storylines from around the world (for Maor's review)".
   - `docs/more-stories.md`: put Part M into it, word for word, under the title "# Forty more storylines, ranked (for Maor's review)".
   - Append the section "Engine backlog from the fix pass (CV6)" (just before the suggested order) to the end of `docs/story-bible.md`, word for word, since CV6 is done with CV1.

   Together these seven files are the full record.
2. **In PROGRESS.md**, right under "Standing approval", add a section called "## Recommendations backlog (2026-10-13, for review)". It holds:
   - the design rule (Part A);
   - a one-line index of every item, grouped by part and numbered as in the file (B1–B3, OW1–OW25, F1–F10, S1–S22, Q1–Q65). For the Multiverse campaign, list it by line (IM, CA, FF, UL, MK, SP, DB, TS, each with its storyline count) and the six endgames E1–E6, plus a link to `docs/multiverse-campaign.md`. For Neopia, list the Neopia line NP1–NP13 and one line each for the lands, species, paint brushes, items, freebies, Games Room and quests, plus a link to `docs/neopia.md`. Add CV1 (Part I), CV2 (Part J), CV3 (Part K), CV4 (Part L), CV5 (Part M) and CV6 (the engine backlog from the fix pass) at the top of the index, and list LH1–LH6, LJ1–LJ6, the Atlas lines A1–A10 (each with its quest count) and Part M's forty ranked storylines by ID (S23–S31, A11–A31, PA1–PA5, Q66–Q95, LB, LK), plus links to `docs/atlas.md` and `docs/more-stories.md`;
   - the suggested order (end of this prompt);
   - links to `docs/ideas-2026-10-13.md`, `docs/story-bible.md`, `docs/learning-grove-stories.md`, `docs/multiverse-campaign.md`, `docs/neopia.md`, `docs/atlas.md` and `docs/more-stories.md`.
3. Add bugs B1–B3 under "Known bugs / open items" in PROGRESS.md as well.
4. **Add one design rule to CLAUDE.md:** "No repeatable chores: no daily or weekly quests, rotating tasks or grind loops. Side stories are written once and make sense inside the campaign; about 20–35% of them change it, and the rest reward items and cosmetics. Optional fun quests are allowed only if they are one-time and never set campaign flags. Fun quests may quote the original films and shows, except in the Learning Grove (Maor, 2026-10-13)."
5. **Check the backlog against the code**, but don't change the ideas themselves.
   - For each OW and F item, add a short "Already have:" line in the docs file naming the files or systems it builds on. If an item turns out to be mostly built, say so there.
   - For the campaign v2 and S1–S10, check the story bible's "Sim changes" and the scene notes (`CAMPAIGN_NOTES`) against `config/story.ts`, `sim/campaign.ts` and `docs/campaign-endings.md`. All the story conflicts are already resolved in the bible, so list only *implementation* gaps: a hook the sim lacks, a flag it doesn't store, a goal that can't be checked yet. Put them under CV1 in `docs/story-bible.md`. Don't rewrite the stories.
   - For the educational versions (Part J), confirm `content-check` reports full coverage for both bands, and list any sim hook CV2 needs that doesn't exist yet (lesson UI, glossary taps, grown-up progress by standard).
   - For Q1–Q65 (Q46–Q65 are the Avatar quests in Part H), check the quote plan:
       - the quotes in the "Original quotes" table are used in the main game and the Free Grove;
       - the Learning Grove swaps every one of them for an original line, kept in a separate child-mode strings table;
       - quests Q31–Q45 never appear in the Learning Grove. In the main game they are adults-only (audience `adult`: offered only when Settings › Content › "Mature content" is set to 18+, which is off by default; Q31 carries the gate and Q32–Q45 require Q31), never during Chapters 9–11, and faithful to the show (drinking, gross-outs, insults), with no jokes about race or sexual coercion;
       - no song lyrics are used anywhere.
     List any quote you can't confirm as written, so Maor can check it against the source.
6. **Check the Multiverse campaign** (Part F), without changing it:
   - every **Needs**, **Unlocks** and **Requires** points at a storyline that exists, and there are no circular prerequisites;
   - the gate list matches the endgame sections;
   - the campaign has its own save slot and is never offered in the Learning Grove;
   - all dialogue is newly written (plots adapted, not scripts copied).

   List any issue or chapter numbers that look wrong, so Maor can check them.
7. **Check Neopia** (Part G), without changing it:
   - the Neo family fits the existing species system (`sim/species.ts`), and colours fit `variantColors`;
   - each land maps cleanly onto OW25's sandbox sections;
   - list every freebie, daily or seasonal event that conflicts with the no-repeatable-chores rule, for Maor to decide;
   - the Learning Grove gets only the content marked for it.

   Flag any land feature, item or game name that looks wrong, so Maor can check it.
8. **Install the content pack** (Part H). This is data only: install it, but don't wire it into the game yet.
   1. Unzip `grove-content-pack.zip` at the repo root. It adds `src/content/` (61 files, including the campaign v2, `STORY-BIBLE.md`, the 22 side stories, the educational files and the Hebrew and Japanese questlines), a `voiceover/` folder (move it to `docs/voiceover/`), `tests/tools/content-check.ts`, `tests/tools/script-book.ts`, `script-book/` and a `README.md`. Move that README to `src/content/README.md`, and don't overwrite the repo's own README.
   2. Run `npx tsc --noEmit -p .`, `npx eslint src/content` and `npx tsx tests/tools/content-check.ts`. All three must pass with 0 problems. If any fails, fix only the content file it names.
   3. Add the content-pack section and its continuity notes (Part H) to `docs/ideas-2026-10-13.md`.
   4. In PROGRESS.md's backlog section, list the pack and say that every quest above, and the whole campaign v2, now has a full script in `src/content/` and `script-book/`.
   5. Don't swap the campaign into `config/story.ts` yet, and don't wire the Learning Grove language switch. Those are backlog items CV1 (Part I) and CV2 (Part J), for Maor to approve.
9. **Commit everything** in one commit: the seven docs files (`docs/ideas-2026-10-13.md`, `docs/multiverse-campaign.md`, `docs/neopia.md`, `docs/learning-grove-stories.md`, `docs/story-bible.md`, `docs/atlas.md` and `docs/more-stories.md`), `docs/voiceover/`, PROGRESS.md, CLAUDE.md, `src/content/`, the two tools and `script-book/`. Use the message "Add recommendations backlog, story bible and campaign v2, Learning Grove story language, Multiverse campaign, Neopia, the Atlas, more storylines and full script content pack for review". Don't tag, and don't start on any item.

---

## Part A. Design rules (Maor, 2026-10-13)

- **No repeatable chores.** No daily quests, and nothing that makes the story or gameplay repetitive. Nothing respawns, rotates or resets on a timer.
- **Side stories are woven into the campaign.** Each one is written once and played once, and makes sense inside the main story. About 20–35% of them change it, with a flag, a later scene or an ending (today 5 of 22: S2, S9, S10, S13 and S19). The rest are for fun and give items, cosmetics and new things to do.
- **Fun quests are the one exception.** Optional, one-time, never set a campaign flag, and reward cosmetics or features.
- **Main mode is rich, thought-provoking and fun.** Every story has concrete detail, one real question with a choice where both sides are defensible, and a joke or surprise that lands.
- **The Learning Grove switches the language, not the story.** Educational versions keep the plot, jokes and choices and weave real lessons into what the characters are doing, so it never feels like work (Part J).
- **Original quotes in fun quests.** Fun quests use quotes from the original films and shows in the main game. Child mode (the Learning Grove) removes them and uses original lines instead. Song lyrics are never used.
- **No art suggestions** in this backlog. Cosmetic quest rewards are the only exception.

### Existing systems that break the rule (list them for Maor to decide; do not change them)

Find each one, list it with its file, and suggest a non-repeating replacement in one line. Start with:

- the Requests board (`sim/quests.ts`, three daily requests);
- the once-a-day Keeper visitor with a gift (`sim/daily.ts`);
- Saturday lantern night;
- the Digimon list's weekly guard-team missions (system 9).

## Part B. Bugs found in play

- **B1. The understudy swaps the speaker but not the names in the text.** If you pick Fern, Clover's portrait says "I'm Fern, from next door" (`config/story.ts` ~line 235; `ui/dialogue.ts` ~line 216). Find every line that says a Keeper's name and can be swapped this way.
- **B2. The debug panel ships in production.** Backtick or a triple-tap on the logo (`ui/hud.ts` ~line 314) gives free Shells, Hatch now and Reset save. Its story row shows 12 blank chapter buttons.
- **B3. Panels stack and overlap.**
  - The Journal opens on top of an open stats sheet.
  - On a portrait phone, toasts cover the second row of HUD buttons.
  - The Expedition's counter sits under the ✕ button.

## Part C. Open-world and RPG list (OW1–OW25)

### Onboarding and clarity

- **OW1. A guided start** (Zelda: Breath of the Wild's Great Plateau). Every feature is open from minute one: 8 HUD icons, 11 "More" entries, and karate before the first egg hatches. Hide each feature until the campaign introduces it. Free Grove can unlock them faster.
- **OW2. A goal on screen** (Witcher 3, Skyrim). Pin a one-line chapter goal on the HUD, with an optional marker that can be switched off in Settings.
- **OW3. Labelled controls** (the Tears of the Kingdom item wheel). The HUD is emoji only. Add labels or a radial Keeper menu, and stop the HUD wrapping onto two rows on portrait phones.
- **OW4. Actions beside the creature** (Zelda's context button, Nintendogs). The 10 action buttons on the stats sheet cover the Nubbin. Show 3–4 actions next to it (Pet, Feed, Hold, More…) and keep the sheet for stats.
- **OW5. A Keeper choice that means something** (Baldur's Gate 3 and Elden Ring origins). For each Keeper, show Sun or Moon, the egg family they hatch, a one-line personality, and how the choice shapes the campaign.
- **OW6. Dialogue controls** (Persona, BG3): hold to skip, auto-advance, and a log of past lines.

### World and exploration

- **OW7. Several regions, not one garden** (Breath of the Wild, Pokémon Legends: Arceus). The field is 48×48 units, and the Hollow and Corvin's garden swap in place of the Grove. Plan 3–4 connected regions (shore, Hollow, mountain, Corvin's garden), each opened by a borrowed move or a story beat.
- **OW8. Hand-placed discoveries** (Korok seeds, Elden Ring's sightlines). Something to find every 20–30 seconds of walking. There is a fixed number of them, they never respawn, and they carry campaign lore.
- **OW9. A real map and a minimap.**
  - Add fog of war and pins you place.
  - Add a compass bar or minimap for portrait phones.
- **OW10. Gentle guidance** (Ghost of Tsushima's guiding wind). Fireflies, or the Nubbin's leaf, point toward the current goal.
- **OW11. Borrowed moves for getting around** (Tears of the Kingdom). Glide off hills with a Fly Nubbin, swim the stream as a route, and climb the cliff tiers with Power. Tie these to OW7's gates.

- **OW25. An expandable sandbox you can build out section by section** (Animal Crossing's island upgrades, Stardew Valley's farm expansions).
  - The Free Grove starts as one section. The land around it is split into named sections: the shore, orchard hill, the meadow, the cliff terrace, the Hollow's edge and so on.
  - Each section is bought once to unlock it, and each one costs more than the last. There is no rent or upkeep, so nothing repeats.
  - Every unlocked section is a full build area. Tile painting, decorations, buildings, habitats, crops and the Workshop all work there, and each section adds roster room.
  - In the campaign, the same sections open through story beats instead of payment.
  - Payment uses Shells by default. Real-money purchases would only come with the store release: they need an in-app purchase provider and server-side receipt checks, which the static GitHub Pages site can't do. Maor decides whether that happens.
  - Builds on: `GROVE.size` and `SIM.worldHalf` in `config/tuning.ts`, placement in `sim/decorate.ts`, the painted ground texture, the Map panel and save migrations. Only draw the sections near the Keeper, to keep phones fast.

### RPG systems

- **OW12. Evolution hints** (the Pokédex). The Collection book shows which critters and choices lead to which forms.
- **OW13. Companion reactions** (BG3's approval, Mass Effect). Show "liked that" or "didn't like that" when Trust changes. High Trust unlocks a Nubbin's own one-time story.
- **OW14. A small party in the world** (Dragon Quest Monsters, Legends: Arceus). 2–3 Nubbins follow the Keeper, and each adds an ability.
- **OW15. Items that change play** (Elden Ring talismans). A few findable trinkets with modest effects. They come from discoveries and side stories, never from random drops.
- **OW16. Systems that interact** (Breath of the Wild's physics and chemistry). One set of wind, water and weather rules, shared by the garden and the minigames.
- **OW17. Side stories woven into the campaign.** One-time and hand-written, using the existing cast. Each one opens at a chapter and makes sense inside the main story. About a quarter of them change the campaign; the rest reward items and cosmetics. The full storylines are S1–S22 in Part E and S23–S31 in Part M, and the canon is Part I.
- **OW18. NPC lives that move with the story** (Stardew Valley, Skyrim).
  - Introduce the ten Keepers chapter by chapter.
  - Give each a home and a routine that changes after story events.
  - No gifting loops.
- **OW19. Choices that change the world** (BG3, Witcher 3). Show the results of choices during the campaign, not only in the eight endings.

### Activities

- **OW20. A deeper Expedition** (Rayman's world map, Monster Rancher's errantries). Courses tied to each region, sections that use the Nubbin's stats, a set piece at the end, and a level map. Each course is finite, with no endless runs for rewards.
- **OW21. The Keepers as champions** (Pokémon gym leaders). Each of the 10 Keepers has a signature Nubbin and a one-time challenge that is part of their side story, and that awards a badge.
- **OW22. A post-campaign epilogue and a completion tracker.** No rotating or seasonal content.

### Ready to ship

- **OW23. Release hygiene.**
  - Remove the debug panel from production builds (B2).
  - Split the 957 KB single bundle so the minigames and Learning Grove load on demand.
  - Add automatic save backups, more than one manual slot, and an export reminder. Saves are localStorage only today (`platform/storage.ts`).
- **OW24. Accessibility** (The Last of Us Part II, Forza).
  - Text size and remappable keys.
  - A one-handed mode.
  - Screen-reader labels and roles. There is about one role or aria attribute across `ui/`.
  - Need bars that can be read without relying on colour.

## Parts D and E. Features (F1–F10), storylines (S1–S22) and fun quests (Q1–Q65)

In the file, number the "Ten features" list F1–F10 and the storylines S1–S22. The fun quests are already numbered 1–45 across three tables (Monty Python 1–20, Mr. Bean 21–30, It's Always Sunny 31–45); the Avatar quests Q46–Q65 are in Part H. Refer to all of them as Q1–Q65. The text between the markers is the full content.

=== BEGIN PARTS D–E ===

## How to read this

Ten new feature ideas and twenty-two one-time side stories for Hazel's Grove, each built on the campaign's existing cast, flags and eight endings. Every feature comes from a different acclaimed sim, RPG or adventure game: Baldur's Gate 3, Persona 5 Royal, Disco Elysium, Mass Effect 2, Outer Wilds, Elden Ring, Undertale, Spiritfarer, Red Dead Redemption 2 and Zelda: Tears of the Kingdom.

The storylines take their themes, not their plots or names, from The Lord of the Rings, Warcraft's Cycle of Hatred, the Warcraft dragon novels and their dragon-stone artifact, the Sunwell Trilogy, Watership Down, Earthsea and Princess Mononoke.

Every item follows three rules:

- **Nothing repeats.** No daily or weekly tasks, nothing that respawns, rotates or resets on a timer.
- **Side stories are woven in.** Each one opens at a chapter and makes sense inside the main story. Five of the twenty-two (S2, S9, S10, S13, S19) change the campaign; the other seventeen are for fun and give rewards.
- **No art work.** Everything here is systems, writing and scene logic.

None of this repeats the 25 items already on the open-world list or anything already built. Flag names are suggestions; the real ones should follow `sim/campaign.ts`.

## Ten features

The strongest idea here is item 4: turn The Long Night into a finale where every relationship you built decides who stands at each lantern. Most of the other nine feed into it.

1. **Every goal has more than one answer** (Baldur's Gate 3). Each chapter goal accepts 2–3 approaches, and each approach sets a different flag. Chapter 5 can be won by winning a race, by exposing how Corvin's runners are trained, or by refusing to race and saying why in front of everyone. Losing is a branch, not a retry: a lost race moves the story on and changes who comments on it.
   - Builds on: `Choice.set` flags in `config/story.ts`, goal checks in `sim/campaign.ts`.
2. **A finite calendar of evenings** (Persona 5 Royal). Hazel's doctor gave her a year, so the campaign has a fixed number of evenings, roughly 3–5 per chapter. Each evening you spend with one Keeper or one Nubbin, which moves a side story forward. You cannot see everyone, so a playthrough is a set of choices, not a checklist. When the calendar runs out, the story moves on.
   - Builds on: the real-clock day and night in `render/daylight.ts`, NPC talk in `sim/npcs.ts`.
3. **Beliefs you take on** (Disco Elysium's Thought Cabinet). Some conversations offer an idea instead of an item: "Slow hands", "Winners eat first", "The grey stays", "Hands are promises". You hold up to three at a time. Each one unlocks dialogue options and nudges one mechanic, such as faster trust from hand-feeding or bigger race prizes with a trust penalty. Corvin reads which beliefs you hold in chapter 9.
   - Builds on: Keeper perks in `sim/perks.ts`, the trust tuning in `TRUST`.
4. **The Long Night as a loyalty finale** (Mass Effect 2's suicide mission). *Superseded by the story bible (Part I): the Long Night is now a fellowship vigil, and no lantern is gated by side stories. Keep this as a reference only.* In chapter 10 you assign one Keeper and one Nubbin to each of the four lanterns. Whoever finished their side story with you holds their post. Anyone whose story you skipped or failed falters, and that lantern gutters. How many lanterns hold changes chapter 11's scenes and adds an epilogue variant to every ending. There is no permadeath: a gutter means someone walks away or a stray is lost to the Hollow until the epilogue.
   - Builds on: `lightLantern`, chapter 10's goal, the side-story flags below.
5. **Clues you learn instead of keys you carry** (Outer Wilds). The Hollow's paths open when you know something, not when you own something. The Hollow has two clues so far (the camp in chapter 8 and the notebook). Expand that into a clue log: Hazel's notebook entries, Nova's sightings and Luna's night notes link together on a single page. Once you know the stray leader's call, you can use it there.
   - Builds on: the Journal panel (`ui/journal.ts`), the Hollow scene from chapter 8.
6. **Lore lines on everything** (Elden Ring item descriptions). Every critter, essence, hat, decoration and memorial card gets one line of lore, and together they hint at Hazel's past and the Circuit. A player who reads them all can work out who Corvin was before chapter 9 says so.
   - Builds on: `config/strings.ts` labels and the Collection book.
7. **The game remembers across campaigns** (Undertale). A small record kept outside the campaign save stores which ending you reached and whether you ever sold a Nubbin. A new campaign starts the same, but Moss knows: "You have done this before. You were kinder the first time" (or less kind). It changes a handful of Moss lines and one choice in chapter 12 and never blocks progress.
   - Builds on: `platform/storage.ts` (a fourth key), Moss's lines in `story.ts`.
8. **Last wishes before a farewell** (Spiritfarer). When a named character nears the end (Fossil in chapter 6, Hazel after chapter 11), they ask for 2–3 specific things, one time only: a walk to a place, a dish of a certain fruit, one last race. Granting them changes the farewell scene and the memorial card. Missing one is remembered, gently.
   - Builds on: the end-of-life check in `sim/lifecycle.ts`, memorial cards, landmarks.
9. **A journal written by your Keeper, and a world that talks back** (Red Dead Redemption 2). The Journal gains an in-character diary page that records your choices in your Keeper's voice ("I threw Pip today. I don't know why I did that."). Keepers react out loud to what they saw: Clover saw the throw, Ember heard you won the race. Each reaction plays once per event.
   - Builds on: sim events (trust changes, races, sales), `ui/journal.ts`, NPC barks in `sim/npcs.ts`.
10. **Playable memories, found out of order** (Tears of the Kingdom's Dragon Tears). Eight landmarks each hold a short memory you play as young Hazel: the winter Moss chose her, meeting Corvin, the night Corvin tried the method, the night she left. You can find them in any order. The eighth unlocks after the other seven and reframes chapter 11.
    - Builds on: `sim/landmarks.ts` and the dialogue system with a swapped Keeper sprite.

## Ten storylines at a glance (v2, woven into the campaign)

The campaign and its side stories now share one history, set out in full in Part I (the story
bible).

Long ago four Wardens kept the Grove: Moss, Briar, Hush and Cinder. In the White Year, Cinder made
the Heartstone to keep the Nubbins safe by making them still. The stone was broken into four
shards and buried under the four lantern posts. Twenty-two years ago Hazel's apprentice, Corvin,
stole the fourth shard, and the cold has been spreading ever since.

Five of the 22 side stories (23%) change the campaign:

- **S2 Wisp** decides who unmakes the stone on the Long Night.
- **S9 The Gate That Sticks** decides Corvin's place in the epilogue.
- **S10 Fourteen Months** decides who walks Hazel up the hill.

The other seven are for fun. They fit the story but change nothing in it, and they give items,
cosmetics and new things to do. Every side story is played once.

| # | Storyline | Opens → closes | Changes the campaign? | Hooks into the main story | Rewards |
| --- | --- | --- | --- | --- | --- |
| S1 | The Wardens' Walk | ch4 → ch9 | No | Moss walks you to the four posts for one extra memory each. This deepens chapter 4's Tale of the Four. | "The Tale of the Four" journal pages; lantern hat; Moss's acorn charm |
| S2 | Wisp | ch3 → ch7 (paid off in ch10) | **Yes** | Sets `wisp` = spared, driven or sable. This decides who unmakes the stone on the Long Night and adds epilogue lines. | Wisp as a recruitable stray (if spared) |
| S3 | The Cycle | ch5 → ch11 | No | The Sun and Moon Keepers' feud. Corvin rigged the Midsummer race. Ends at a Lantern Moot. | Midsummer Cup race; Sun and Moon ribbons; "Moot-Keeper" title |
| S4 | The Wellspring | ch5 → before ch8 | No | Marina's dying tide pools and the dam above the falls. Marina shows you the ledge path early. | Deep-swim diving; pearl-white Spring egg; tide-pool decorations |
| S5 | Fossil's Last Walk | ch5 → ch6 | No | Fossil's three last wishes and a secret one, before chapter 6's farewell. | Fossil's seed; Dusty's trowel; +1 Stamina grade |
| S6 | Ash's True Name | after ch9, if Ash left the garden | No | Ash is grey and won't answer to her name. Hazel's hatch register has her first sound. | Ember's whistle emote; Ash's ribbon; Ember friendship |
| S7 | Unverified | ch7 → before ch10 | No | Byte reinvents stilling with timers, without any shard, and Moss's warning lands. | Byte's stopwatch charm; Pixel's lantern timer; Null reborn |
| S8 | The Warren in the Hollow | ch8 → ch11 | No (one dawn line) | Bramble leads the Hollow's strays, and Fern finds her. Her youngest is the thin grey Nubbin in Hazel's arm at dawn. | Recruitable warren strays; Bramble's ribbon; a Hollow section |
| S9 | The Gate That Sticks | after ch10 → ch12 morning | **Yes** | Corvin, thawed, asks to come in. Sets `corvinGate` = family, guest or shut. | Epilogue lines; Corvin's chair by the pond |
| S10 | Fourteen Months | ch11 → ch12 | **Yes** | Hazel's three last wishes. Sets `hazel` (secret or told) and `walk` (you, moss, sable or corvin). | The final walk; Hazel's lantern; her second letter |

### S1. The Wardens' Walk (fun, lore)

After Lantern Night, Moss asks you to walk him slowly round the posts, one memory at each:

- **The stream:** Briar's laugh, and the first memorial flower.
- **The old wall:** Hush sitting with the stilled Nubbins until the last one faded.
- **The pond:** young Hazel's silent winter with Moss. He finally answers her with "Yes", and his
  waiting turns out to be where her third rule came from.
- **The long grass:** Moss won't go while the post is empty. After chapter 9, when the shard is
  home, he asks to be carried there and tells you about Cinder's last warm day.

The scripts are in `side-stories-fun.ts`.

### S2. Wisp (changes the campaign)

1. In chapter 3, fruit goes missing.
2. Then warm things go missing: Fern's glove, the tea cosy, Hazel's egg-warming stone.
3. In the chapter 6 rain you find Wisp in a drowned nest of warm things. He takes the warmth and
   bites, and he is still shaking. He speaks only in the shard's echo, a whisper and a hiss.
4. In chapter 7, at night, you decide: spare him, drive him off, or let Sable choose.

On the Long Night a spared Wisp follows you to the Wellspring. When the bearer can't let go, he
snatches the stone ("mine — warm — mine") and tumbles in with it, and the stone is unmade. At dawn
he is found asleep on the bank, grey and no longer trembling. This is the eucatastrophe.

The scripts are in `side-stories-main.ts`.

### S3. The Cycle (fun)

The Sun and Moon Keepers feud over the Midsummer race, with two identical tea urns, an empty bench
and Byte's 214 grievances. Sparks and Byte develop the old photo-finish plates and find that a
steward moved the cliff-bend flag while Corvin watched the stands. It ends with a Lantern Moot at
the pond in chapter 11, with one urn.

The scripts are in `side-stories-fun.ts`.

### S4. The Wellspring (fun)

Marina's tide pools are dying and the stream runs cold in July. You find the Circuit's dam, open
the stuck sluice ("lift and push"), and Marina shows you the ledge path behind the falls. She stops
at the bend, so chapter 8 keeps its first sight of the Wellspring.

The scripts are in `side-stories-fun.ts`.

### S5. Fossil's Last Walk (fun)

Dusty's old Nubbin, Fossil, has three wishes before chapter 6's farewell: the cliff, the oldest
tree, and the water. Her secret fourth wish is to sit with your youngest Nubbin until dark. If you
play S5, chapter 6 doesn't introduce Fossil a second time.

The scripts are in `side-stories-fun.ts`.

### S6. Ash's True Name (fun)

After chapter 9, Ash is grey and won't turn to her name. Hazel's hatch register, behind the jam,
gives Egg 41's first sound: three notes. You practise them with Ember, with no fail state, and Ash
turns round.

The scripts are in `side-stories-fun-2.ts`.

### S7. Unverified (fun)

Byte writes "UNVERIFIED" under Moss's words, and Pixel's Minder runs Null's day on bells. Null
goes pale and stops playing: stilling, reinvented without any stone. Then comes an evening with no
clock, Null chases a moth, and is reborn.

The scripts are in `side-stories-fun-2.ts`.

### S8. The Warren in the Hollow (fun)

Nova follows fireflies to a ring of roots where grey strays live, led by an old Nubbin with a faded
ribbon. You bring Fern, who recognises her own stitching: "Bramble? …Oh, you've gone grey. That's
all right, love. So have I."

If this reunion happens before the Long Night (`s8Reunited`), the thin grey Nubbin Hazel carries
down the hill at dawn is Bramble's youngest.

The scripts are in `side-stories-fun-2.ts`.

### S9. The Gate That Sticks (changes the campaign)

S9 opens after the stone is unmade.

1. Corvin's thawed hands hurt, and he cannot open the gate.
2. He passes Hazel's trowel through the bars, and she tells you about the theft: "So I'd hear him
   if he ever came back."
3. The next dusk he asks: "I would like to come in."
4. At first light in chapter 12 you choose family, guest or shut.

You're offered "Family" only when at least two of these are true: `corvin` = reconciled, S3 done,
S6 done, S8 done, `millLetter` = kept (S13), `visitors` (S23).

The scripts are in `side-stories-main.ts`.

### S10. Fourteen Months (changes the campaign)

1. Hazel asks you to keep her secret or tell the others.
2. Her first wish: write your Nubbins into her register.
3. Her second wish: watch one race from the back row.
4. Her third wish: "Walk the four lanterns with me. Once."
5. After the final choice, at the foot of the hill, you choose who walks her up: you, Moss, Sable
   or Corvin. The campaign then plays that walk, and the second letter waits under the signpost
   stone the next morning.

Her illness is never named. Without S10, you walk her up alone.

The scripts are in `side-stories-main.ts`.

## Twelve more storylines (S11–S22)

These stories take their themes and mechanics from Warcraft, StarCraft, Diablo, Borderlands,
Palworld, Ori and the Blind Forest, Animal Crossing, Stardew Valley and Celeste. They don't take
plots, names or quotes: everything is original and set in the valley.

Two of the twelve change the campaign (S13 and S19). That brings the total to 5 of 22 side
stories (23%). The other ten are for fun and give rewards. Full scripts are in
`side-stories-new-1.ts` to `side-stories-new-4.ts`, and the canon is in Part I.

| # | Storyline | Inspired by | Opens → closes | Changes the campaign? | Rewards |
| --- | --- | --- | --- | --- | --- |
| S11 | The Blight | Warcraft III, the culling | ch5 → before ch8 | No | Grafting knife; "Orchard Warden" title; ladybird petpets |
| S12 | The Hum | StarCraft, the swarm and the shared mind | ch6 → before ch10 | No | Hum-hive decoration; hum-nectar; chorus emote |
| S13 | The Mill Cellar | Diablo, the cathedral under Tristram | ch7 → before ch12 | **Yes** | Heirloom loot; the mill and millwheel; Old Tobin's tales |
| S14 | Tilly's Tabletop | Borderlands, Tiny Tina's tabletop game | ch8 → before ch10 | No | Tabletop decoration; cardboard dice; Game Mistress's Crown |
| S15 | Lucky Eggs | Borderlands' charming villain, Diablo's gambler | ch5 → before ch8 | No | Honest egg stall and Odds Board; a sparkly egg; Jackpot the parrot |
| S16 | The Workyard | Palworld | ch6 → before ch9 | No | Nubbin Jobs feature; hard hat; Fair Roster board |
| S17 | Nightjar | Ori and the Blind Forest | ch7 → before ch10 | No | Owl fledgling; night glide; feather cloak |
| S18 | The Grove Museum | Animal Crossing, Stardew Valley | ch6 → ch11 | No | The museum; "Curator" title; magnifying glass |
| S19 | Cinder's Last Light | Warcraft's fallen guardian | ch11 → before the final choice | **Yes** | Cinder's ember; the snowfield section |
| S20 | Fort Night | StarCraft and Warcraft as strategy games | ch11 → before the final choice | No | Snow-fort decoration; commander's hat; snowball launcher |
| S21 | CL-4NK | Borderlands' little robot | ch3 → before ch6 | No | Clank as garden helper; Clank dance; lantern-part hat |
| S22 | The Climb | Celeste | after ch8 → ch11 | No | Summit flag; the Tooth viewpoint; climbing boots |

### The stories

- **S11 The Blight.** A blight strikes Fern's plum trees. Ember, who has never forgiven herself
  for being too slow to save Ash, wants to burn the whole orchard tonight.
  - You map the spread with Byte's hand lens and catch the carrier beetle in a jam jar.
  - At dusk you choose: stand in front of the trees, hand Ember the map, or burn only the three
    sick trees together.
  - Byte labels everything, from "VOLATILE" to "FRIGHTENED (FAIR)".
  - The question: when we're scared, does fast feel like brave?
- **S12 The Hum.** A colony of thumb-sized Thrums in Hush's wall says only "we". One of them has
  started saying "I".
  - You follow the swarm with Pixel's tuning fork.
  - The surprise: the hum was never one note, but hundreds leaning together.
  - The choice: home to the hum, alone, or "a hum with gaps in it".
- **S13 The Mill Cellar** (changes the campaign). Old Tobin, a retired lamplighter who loses the
  thread of his tales, takes you down a four-level cellar under Corvin's father's mill.
  - Loot comes in five tiers with silly generated names, such as "Slightly Haunted Trowel of
    Optimism". The names stop being funny at the bottom.
  - At the bottom: Aldous Vale's ledger of mill rules (faster, harder, never rest), which is
    where Corvin learned "the method". Beside it is an unsent letter to his son.
  - You choose what happens to the letter: keep it for Corvin, burn it, or leave it on Aldous's
    grave.
  - If you keep it, it counts toward S9's "family", and Corvin puts it in the pocket where the
    tin used to be.
- **S14 Tilly's Tabletop.** Sparks's nine-year-old cousin runs "Keeps & Critters" with cardboard
  dice and rules that change on a whim ("Natural one. Your sword is now a sandwich.").
  - The final boss is the Grey Grandmother, who "flew away without saying goodbye", and Tilly
    won't let anyone hit her.
  - The hero sits down beside the dragon and waits. Tilly cries, Sparks holds her, and everyone
    eats the snacks.
- **S15 Lucky Eggs.** Dashwood Prance, a dazzling peddler with a brass parrot that can't lie,
  sells Mystery Eggs: "1 IN 3 SPARKLY!".
  - You tally 30 eggs and find 3 sparkly ones, so the real odds are 1 in 10. The "Legendary"
    egg in his window turns out to be painted.
  - You choose: expose him, make him refund and post the odds, or buy his wagon.
  - The question: what's fair when people want to believe?
- **S16 The Workyard.** A cheerful sawmill is full of Nubbins in hard hats under the banner "WORK
  IS PLAY!".
  - Lug the Power Nubbin loves hauling logs. Others are worn out.
  - You shadow them for a day and build a Fair Roster with a "no thank you" bell.
  - The question: where does help end and use begin?
- **S17 Nightjar.** Eggs go missing from the nursery. The thief is a grieving owl whose own eggs
  froze in a cold that came out of season twenty-two years ago, and she has been keeping the
  stolen ones warm.
  - You return the eggs one at a time while she watches, and she keeps the one wild egg nobody
    will claim.
- **S18 The Grove Museum.** Professor Delve, a mole who faints at moths, opens a museum in Hazel's
  barn with four wings and twelve true exhibits.
  - The last case raises the question: what does a valley choose to remember?
- **S19 Cinder's Last Light** (changes the campaign). Cinder's last ember has waited on the high
  pass since the Breaking.
  - "Are they safe?" "No. They're well."
  - She tells her side, Moss (or Sable) forgives her, and you answer for the valley: forgiven,
    or remembered.
  - She fades properly, and a red flower opens on the hill in the spring.
- **S20 Fort Night.** A three-round snow-fort war teaches economy, scouting and counters (Speedy
  beats Splashy, Splashy beats Sturdy, Sturdy beats Speedy).
  - Then a blizzard comes, and the winning move is one shared shelter under the stars.
- **S21 CL-4NK.** Pixel's one-wheeled garden robot, with a voice like a delighted kettle, calls
  everyone his best friend and falls down the cottage step three times.
  - He asks you, "If I stop being useful, will you still…?" and can't find the word.
  - At dusk the Nubbins nap on him: "I am being very still."
- **S22 The Climb.** Nova climbs the Tooth with her Worry, a small shadow only she and you can
  see.
  - On the Ridge she takes its hand.
  - At the summit she says, "I'd like to stay for a while."

## Twenty Monty Python quests

These twenty optional quests are pure fun, taken from Monty Python's films and Flying Circus, and each one gives a unique cosmetic, a new feature, or both. They are the one deliberate exception to "side stories feed the campaign."

- **One time only.** Each quest starts when you walk past its spot, and it never repeats or resets.
- **Where.** They appear in the Free Grove and in the campaign, except during chapters 9–11 so they don't undercut the heavy scenes. Rewards carry over between the two.
- **No effect on the story.** They never set a campaign flag or block a goal.
- **Original quotes, main game only.** Each quest uses the original's best-known lines (see Original quotes below). The Learning Grove swaps every quote for an original line. Character names are newly invented, and songs are newly written.

| # | Quest | Sketch it's based on | What you do | Reward | Type |
| --- | --- | --- | --- | --- | --- |
| 1 | Two Shrubberies | Holy Grail: the knights who demand a shrubbery | Three hooded Nubbins block the waterfall path and chant until you bring a shrubbery. Craft one at the Workshop. They then want a second one, a little higher, "with a small path." | A terraced shrubbery decoration with a tiny path. The hooded three keep a spot by the falls. | Cosmetic |
| 2 | None Shall Cross | Holy Grail: the Black Knight | A Power Nubbin in a dented helmet guards the plank bridge. Beat it at karate. Each round it loses a piece of gear (hat, scarf, glasses) and insists it is barely bothered. | Dented Helm hat. A karate perk: losing a bout no longer costs happiness. | Both |
| 3 | The Bridge of Three Questions | Holy Grail: the Bridge of Death | An old Keeper at the gorge asks three questions about your own Grove, the last about how fast a Fly Nubbin can carry a coconut. Answer it with a question of your own, and he's the one who tumbles into the stream. | The rope bridge opens as a shortcut across the gorge. Bridgekeeper's Hood. | Both |
| 4 | Clip-Clop | Holy Grail: coconut halves for a horse | A Run Nubbin follows you, clapping two coconut shells. Find out where they came from (a Fly Nubbin carrying fruit a long way), then let it keep them. | Clip-clop mode: the Run button swaps footsteps for coconut hooves and a trot. | Feature |
| 5 | The Rabbit at the Ledge | Holy Grail: the killer rabbit and the holy hand grenade | A small white bunny critter beats every Nubbin at karate in one hit. Sparks builds the Holy Hand Melon. Its instructions: count to three, no more and no less. Count right and it bursts into fruit confetti, and the rabbit joins you. | White Rabbit critter (a fluffy-ears part). A Hand Melon decoration. | Both |
| 6 | The Wooden Rabbit | Holy Grail: the Trojan Rabbit and the taunter on the wall | A rude stranger on a far wall taunts you in a terrible accent and drops fruit on your head. Build a giant wooden rabbit, wheel it to his wall, and realise nobody got inside. He takes it in anyway. | A giant wooden rabbit decoration you can climb into for Photo mode. | Cosmetic |
| 7 | It's Only a Model | Holy Grail: Camelot | Pixel builds a tiny castle on the hill and announces it to the valley as a grand palace. Help finish the towers with stone. | A model castle decoration where Nubbins sometimes put on a little play. | Cosmetic |
| 8 | What Has the Aqueduct Done for Us? | Life of Brian: "what have the Romans ever done for us?" | The Keepers hold a grumbling meeting about all your building. Build an aqueduct from the falls to your crops, then listen to them list everything else it did. | Aqueduct: crops beside it never need watering again. | Feature |
| 9 | The Gourd and the Shoe | Life of Brian: the crowd of followers | On one walk you drop a gourd and lose a shoe. A crowd of Nubbins starts following you and splits into two camps over which one is the sign. | Gourd hat and Shoe hat. "Follow me": every Nubbin trails behind you in a parade until you stop. | Both |
| 10 | Haggle | Life of Brian: haggling at the market | A new stall keeper refuses to sell at the asking price and is offended that you didn't haggle. Haggle properly through three rounds. | Haggling in the shop: an optional bit of dialogue on any purchase that can take up to 20% off. | Feature |
| 11 | Wafer-Thin | The Meaning of Life: the wafer-thin mint | A very greedy Nubbin at the bathhouse has eaten everything. A waiter Keeper offers it "one more slice, wafer-thin." It pops into a harmless shower of confetti and is fine, and much lighter. | A wafer-thin slice that fills hunger to exactly full, never over. A napkin bib. | Both |
| 12 | Just Resting | Flying Circus: the Dead Parrot | The shop sold you a plush Nubbin that doesn't move. The shopkeeper insists it's resting, or shy, or tired from the trip. Win the argument with three pieces of evidence. | A plush Nubbin toy that your Nubbins cuddle. Refunds in the shop. | Both |
| 13 | Ministry of Silly Walks | Flying Circus | A Keeper in a bowler hat runs a booth that funds only very silly walks. Show yours as a key or joystick pattern. The first try is "not nearly silly enough." | A silly-walk gait for the Keeper (on/off). A bowler hat. | Both |
| 14 | The Comfy Chair | Flying Circus: the Spanish Inquisition | Three Keepers in red burst into the Grove unannounced and threaten your Nubbins with soft cushions and the comfy chair. It is the best nap any of them ever had. | Comfy Chair decoration: tired Nubbins nap on it twice as fast. | Both |
| 15 | The Fruitless Fruit Stall | Flying Circus: the Cheese Shop | A stall keeper claims to stock every fruit in the valley. Ask for a dozen kinds, and each one is "just out." At last he admits the stall has never held any fruit. | A fruit catalogue page in the Collection book listing every fruit and what it does. A straw boater. | Both |
| 16 | The Argument Booth | Flying Circus: the Argument Clinic | For 5 Shells, Byte argues with you for exactly one minute. Every answer is contradicted. You win by pointing out that contradiction isn't an argument. | A sand-timer decoration. A "Debate Club" title for your Keeper profile. | Cosmetic |
| 17 | The Fish-Slapping Dance | Flying Circus | Two Keepers on the dock invite you to a very formal dance. It's a timing bout on the karate screen, with fish, and it ends with you gently in the pond. | Herring item: a Power Nubbin can knock fruit off a tree from a distance. A fish-slap victory pose in karate. | Both |
| 18 | Self-Defence Against Fresh Fruit | Flying Circus | A drill-sergeant Keeper teaches a class on defending yourself from people armed with fruit: banana, raspberry, a whole pineapple. | Catch: Nubbins catch fruit you toss to them from a distance. A sergeant's whistle. | Both |
| 19 | Upper-Class Twit of the Year | Flying Circus | Enter a race whose rivals are hopeless toffs: they hop over matchboxes, get lost on the start line, and stop to wake a sleeping Keeper. Winning is easy. Keeping a straight face is optional. | Top hat and monocle. | Cosmetic |
| 20 | And Now, the Larch | Flying Circus: how to recognise different types of trees | A deadpan narrator Keeper teaches tree recognition: the larch, then the larch again, then the larch. Find and tap one of each tree in the Grove. | A larch seed (a new tree to plant). A "something completely different" button in Photo mode that swaps to a random filter. | Both |

## Ten Mr. Bean quests

These ten quests star Mr. Tweed, an almost wordless Keeper in a tweed jacket who explains everything by miming. The same rules apply as for the Python quests: optional, one time only, no effect on the story, original names, and quotes from the originals in the main game only.

| # | Quest | Sketch it's based on | What you do | Reward | Type |
| --- | --- | --- | --- | --- | --- |
| 21 | Bear Comes Too | Mr. Bean: Teddy | Mr. Tweed has lost his plush bear somewhere in the Grove. Follow his mimed clues: pointing, sulking, and a very small bear-sized shrug. | A tiny plush bear that rides on your Keeper's shoulder. | Cosmetic |
| 22 | The Armchair Drive | Mr. Bean: driving from an armchair tied to the car roof | Mr. Tweed buys an armchair that won't fit in his hand cart, so he ties it on top and steers from up there. Clear a path to his house without anything falling off. | The armchair as a decoration. A rideable cart that moves faster than Run and carries one extra Nubbin. | Both |
| 23 | Pumpkin Head | Merry Christmas, Mr. Bean: the turkey on his head | At harvest, a curious Nubbin climbs into a hollow pumpkin and gets stuck. Free it with gentle wiggles, a three-tap timing beat, not by pulling. It decides it liked the pumpkin. | Pumpkin hat. | Cosmetic |
| 24 | The Exam | Mr. Bean: the exam | Mr. Tweed's Nubbin sits a Kindergarten test beside yours and keeps peeking at its paper. Shuffle your answers three times to throw it off, then help them both pass. | Study buddies: two Nubbins take a Kindergarten lesson together for one fee. | Feature |
| 25 | The High Dive | Mr. Bean: the high diving board | Mr. Tweed climbs the waterfall ledge to dive, freezes at the top and won't come down. Coax him down, or let a brave Swim Nubbin show him how. | A diving board at the pond. Nubbins who dive from it gain extra Swim lean. | Both |
| 26 | The Park Bench Sandwich | Mr. Bean: making a sandwich in the park | Mr. Tweed builds a picnic on a bench out of his coat pockets, in the wrong order. Hand him the right items as he mimes for them. | A picnic blanket decoration. Nubbins who eat there together gain extra happiness. | Both |
| 27 | The Ruined Portrait | Bean (1997): the ruined painting | A sneeze ruins the painting in the Keepers' hall. Help Mr. Tweed swap it for a copy before anyone notices, using Photo mode. | Picture frames: hang your Photo mode shots on the cottage walls. | Feature |
| 28 | Do-It-Yourself | Mr. Bean: painting a room with a firework in the paint tin | Mr. Tweed wants his whole house painted at once. The plan involves a paint tin and a firework. Stand well back. | Splash paint: paint a whole patch of ground tiles in one go. | Feature |
| 29 | Mind the Egg | Mind the Baby, Mr. Bean | A visiting Keeper leaves an egg with you for the afternoon. It rolls down the paths, over the bridge and past the dojo. Catch it before it reaches the stream. | Egg pram: carry two eggs at once. An egg cosy. | Both |
| 30 | The Three-Wheeler | Mr. Bean: the rival three-wheeled car he keeps tipping over | A rival Keeper's wobbly three-wheeled cart tips over every time Mr. Tweed overtakes it. Win a race in which it tips over three times. | A three-wheeler decoration that tips over when Nubbins bump it. | Cosmetic |

## Fifteen It's Always Sunny quests

These fifteen quests are adults-only and as faithful to the show as the game allows: drinking, gross-outs, insults and terrible schemes, all run out of Puddle's Pub by the stream. The gang is based on the show's: Corky is Charlie Kelly, Charlie Day's character, and he leads ten of the fifteen quests. Rook is Mac, Dabney is Dennis, Mags is Dee, and old Fitz is Frank. None of them appear in the Learning Grove. Two things are left out: the show's real song lyrics, which are replaced by an original song (below), and any joke that is about race or sexual coercion. Otherwise the same rules apply: optional, one time only, no effect on the story.

| # | Quest | Episode it's based on | What you do | Reward | Type |
| --- | --- | --- | --- | --- | --- |
| 31 | Kitten Mittens | Charlie's Kitten Mittens advert | Corky has invented mittens to stop Nubbins "clomping around," and he's shooting an unhinged advert in the pub. Rook only joined to show off his karate. Film it in Photo mode while Corky screams the slogan and knocks over the set. | Nubbin Mittens: sleeping Nubbins never wake when others walk past. A mittens cosmetic. | Both |
| 32 | Charlie Work | Charlie Work | A health inspector is coming to Puddle's Pub. Upstairs the gang runs a scam. Downstairs Corky does every disgusting job nobody else will touch: the rat cellar, the clogged pond drain, the bins, a goose. Hand him each tool on cue and keep his one long take going. | Grove Work: one chosen Nubbin piles up fallen fruit and leaves by itself. A pair of filthy work gloves. | Both |
| 33 | Fight Milk | Mac and Charlie's Fight Milk | Rook and Corky have brewed "the first alcoholic, dairy-based protein drink for bodyguards" from crow eggs, vodka and milk, and they need testers. The Keeper and the gang test it on themselves. Everyone is sick in a different and very visible way. The Nubbins sniff it and walk off. | Fight Milk: a single-use drink that adds Power to one karate bout and leaves the Keeper wobbling. A carton hat. | Both |
| 34 | Green Man | Charlie's Green Man suit | Corky arrives at a race in full green spandex, gets hammered in the stands with Dabney, and streaks across the course (the suit stays on). Lead the cheering, then haul him off the track before he ruins the race. | A green bodysuit. A cheering crowd at every race from then on. | Both |
| 35 | Chardee MacDennis | Chardee MacDennis: The Game of Games | Dabney and Mags defend their title in a three-level drinking board game: Mind, Body, Spirit. You team up with Corky and Rook. The questions are insults, the dares are gross, and the Spirit round always makes someone cry. Play it once, start to finish. | A game board decoration, a trophy, and a "Game of Games" title for your profile. | Cosmetic |
| 36 | Rum Ham | The Gang Goes to the Jersey Shore | Fitz soaks a whole ham in rum for a pond-side bender. He and Corky pass out on a raft, and the ham floats away on the current. Send a Swim Nubbin after it, twice round the pond. | A Rum Ham pond float that Nubbins lounge on. | Cosmetic |
| 37 | The Night Keeper Cometh | The Nightman Cometh | Corky has written a rock opera and is staging it at the pub. He casts Rook as the Sun Keeper, Dabney as the troll, Mags as the princess, and Fitz on lights. Keep their egos from wrecking rehearsal, then perform it. The song is below. | An open-air stage, Sun and Night capes, and the song in the jukebox. | Both |
| 38 | Bird Law | Charlie Kelly, self-taught expert in bird law | A Fly Nubbin is accused of stealing fruit. Dabney prosecutes, purely for sport. Corky defends it under "bird law," objects to everything, and calls a goose as a witness. Feed him the three pieces of evidence that actually matter. | A gavel. A "Nubbin Law" page in the Collection book that explains trust, grades and alignment. | Both |
| 39 | Project Badass | Mac's Project Badass videos | Rook films his stunt reel and won't do a single dangerous thing. Corky does every real stunt, off a roof, through a fence, into the pond, and gets hurt every time. Film three stunts. | A sleeveless karate gi. A pre-bout pose in karate. | Cosmetic |
| 40 | The Gang Goes to the Water Park | The Gang Goes to the Water Park | The gang builds a waterslide from the hill into the pond. Fitz and Mags get wedged in the tube, and Corky and Dabney wander off on a scheme. Bring wood and stone, and get everyone out. | A waterslide: Nubbins slide into the pond for fun and Swim lean. | Both |
| 41 | The Gang Wrestles for the Troops | The Gang Wrestles for the Troops | Fitz debuts as the Trash Man: he climbs out of a bin and eats garbage. Rook and Dabney are a tag team in feathers. You and a Nubbin wrestle them at the dojo. | Tag-team karate: two of your Nubbins share a bout. The wrestling costumes. | Both |
| 42 | Pepe Silvia | Sweet Dee Has a Heart Attack | Corky has been working the pub's mail room. Now he's sweating through his shirt in front of a wall of string, because a "Pepe Silvia" keeps leaving fruit at the gate. Follow his clues around the Grove. It's a Nubbin. | A red-string conspiracy board decoration. | Cosmetic |
| 43 | Lethal Weapon 5 | The gang's home-made Lethal Weapon sequels | Rook and Fitz shoot a no-budget action sequel in the Grove, with Nubbins as extras and terrible pyrotechnics. Direct three scenes. | Movie mode in Photo mode: record and save a short clip. | Feature |
| 44 | Milk Steak | Charlie's favourite foods | Corky takes you to the fanciest restaurant in the valley and orders for you both: milk steak, with raw jelly beans on the side. Finish the meal without leaving. | Milk steak: a huge, disgusting meal that fills a Nubbin's hunger completely, eaten with a visible shudder. A napkin bib. | Both |
| 45 | The Gang Goes Bowling | The Gang Goes Bowling | The gang bets the pub on a bowling match against rival Keepers, with a melon and twelve wooden pins, and the trash talk never stops. Win it. | A bowling lane decoration you can play any time. A bowling shirt. | Both |

### The Night Keeper Cometh (original song for quest 37)

This is a new song in the spirit of Charlie's rock opera, not the show's lyrics, which I can't reproduce. Corky wrote it, and it shows.

> **Night Keeper** (Corky, hoarse): I come out when the lanterns go dark / I'm the thing you can smell in the park / I've been eating your pears / I've been living under your stairs / And I'm leaving a little… mark.

> **Sun Keeper** (Rook, power ballad): SUN KEEPER! (hey! hey!) / Lighter of the lanterns! (hey! hey!) / He's got a giant lantern and abs you can see / He'll punch the dark in the face for you and for me!

> **The troll** (Dabney, spoken, then sung): You want to cross my bridge? Then you pay the bridge fee. / And what's the fee? Whatever's in your pockets. / And your boots. / And your dignity.

> **Princess** (Mags, off-key): I'm the princess and I'm meant to be the star / So why am I just standing here holding a jar?

> **Everyone:** Night Keeper, Sun Keeper, holding hands at last / We spent the whole budget and the lanterns are gas— / **Dabney:** Stop singing, Fitz.

## Original quotes

In the main game, these quests use the original lines below. In the Learning Grove, each one is swapped for an original line, and quests 31–45 don't appear at all. Quests not listed keep the lines written for them, because their source is wordless or has no standout line.

| # | Quest | Original line(s) | Source |
| --- | --- | --- | --- |
| 1 | Two Shrubberies | "Ni!" · "We want… a shrubbery!" | Monty Python and the Holy Grail |
| 2 | None Shall Cross | "None shall pass." · "'Tis but a scratch." | Holy Grail |
| 3 | The Bridge of Three Questions | "What is the airspeed velocity of an unladen swallow?" · "What do you mean? An African or European swallow?" | Holy Grail |
| 4 | Clip-Clop | "Where'd you get the coconuts?" | Holy Grail |
| 5 | The Rabbit at the Ledge | "Run away!" · "Three shall be the number thou shalt count." | Holy Grail |
| 6 | The Wooden Rabbit | "Your mother was a hamster, and your father smelt of elderberries!" | Holy Grail |
| 7 | It's Only a Model | "It's only a model." | Holy Grail |
| 8 | What Has the Aqueduct Done for Us? | "What have the Romans ever done for us?" | Life of Brian |
| 9 | The Gourd and the Shoe | "He's not the Messiah. He's a very naughty boy!" | Life of Brian |
| 11 | Wafer-Thin | "It's only wafer-thin." | The Meaning of Life |
| 12 | Just Resting | "It's resting." · "This is an ex-parrot." | Flying Circus |
| 13 | Ministry of Silly Walks | "It's not particularly silly, is it?" | Flying Circus |
| 14 | The Comfy Chair | "Nobody expects the Spanish Inquisition!" · "Fetch… the comfy chair!" | Flying Circus |
| 15 | The Fruitless Fruit Stall | "Not much of a cheese shop, is it?" | Flying Circus |
| 16 | The Argument Booth | "This isn't an argument." · "An argument isn't just contradiction." | Flying Circus |
| 20 | And Now, the Larch | "The larch." (from "Number one. The larch.") | Flying Circus |
| 21 | Bear Comes Too | "Teddy!" (Mr. Bean mostly mimes, so his few words are the quotes) | Mr. Bean |
| 31 | Kitten Mittens | "Kitten Mittens!" (Corky never learns the product's new name) · "Wildcard, bitches!" | It's Always Sunny in Philadelphia |
| 33 | Fight Milk  | "For bodyguards, by bodyguards." · "Caw! Caw!" | It's Always Sunny |
| 34 | Green Man      | "Green Man!" | It's Always Sunny |
| 35 | Chardee MacDennis      | "Chardee MacDennis: the game of games." · "I am a golden god!" (different episode) | It's Always Sunny |
| 36 | Rum Ham        | "Rum ham!" · "Can I offer you a nice egg in this trying time?" (Frank, different episode) | It's Always Sunny |
| 38 | Bird Law   | "Bird law in this country is not governed by reason." | It's Always Sunny |
| 41 | The Gang Wrestles for the Troops | "Trash Man!" | It's Always Sunny |
| 42 | Pepe Silvia   | "Pepe Silvia!" · "There is no Carol in HR!" | It's Always Sunny |

Song lyrics stay out: The Night Keeper (37) and any other musical moment use new songs. Check each line against the film or episode before it ships, because these are quoted from memory.

=== END PARTS D–E ===


## Part F. Multiverse campaign (a separate campaign: 93 storylines and 6 endgames)

This is a third campaign with its own save slot, for adults only. Iron Man (15), Captain America (10), Doom and the Fantastic Four (10), Ultron (10, the final enemy), Moon Knight (8), Spawn (8), Dragon Ball (20) and Toy Story (12) feed six endgames. Each endgame unlocks once its prerequisites are complete. The text between the markers is the full content.

=== BEGIN PART F ===

The Multiverse campaign is a third campaign with its own save slot, alongside Hazel's Grove and the Free Grove. It has 93 storylines across eight lines and six endgames. Each endgame unlocks only once you have finished the storylines it requires.

## How it works

- **The gate.** A rift opens above the waterfall. Each line is a world beyond it, and the Keeper and up to two Nubbins step through. The source story plays out there with your Nubbins as companions or allies. Your Nubbins' stats, karate, racing and Expedition skills are how you take part.

- **Faithful plots, adapted.** Each storyline follows its source's plot beats as closely as the game allows: the origin, the turning points, the villain, the ending. Nubbins take a companion role in each scene. Every line of dialogue is new; the plot follows the source and the words are original. Issue and chapter numbers are from memory, so check them before writing scenes. Each storyline is played once, and nothing repeats.

- **Lines and order.** You play each line's storylines in order. Lines can be played side by side, and some storylines need a storyline from another line first. Those cross-links are marked **Needs**.

- **Endgames.** Six endgame stories. Finishing an endgame's prerequisites opens it. The Last Ultron is the final story and needs the most.

- **Who can play.** Rated 18+ (`audience: 'adult'`): main game only, behind the adult content setting, which is off by default, and the player confirms their age before the rift first opens. The Spawn and Moon Knight lines keep their violence and horror, adapted to the game's look. The campaign is never offered in the Learning Grove. It has one save slot of its own; it may read the Grove saves and never writes them.

- **Rights.** These are Marvel, Image, Toei and Pixar characters, and the build is public. That is a bigger exposure than the Pokémon lines already noted in PROGRESS.md.

## How the lines lead to the endgames

Gates, as text (this is drawn as a diagram in the doc):

- **E1 Civil War** needs IM1–IM15 and CA1–CA10.
- **E2 Secret Wars** needs FF1–FF10, IM6 and CA4.
- **E3 Armageddon** needs SP1–SP8 and MK1–MK8.
- **E4 The 23rd Budokai** needs DB1–DB20.
- **E5 So Long, Partner** needs TS1–TS12.
- **E6 The Last Ultron** (final) needs UL1–UL10, E1 and E2. E3, E4 and E5 are optional, and each one adds allies.

Cross-links run between lines as well. IM6 needs FF2. IM10 and IM12 unlock Ultron storylines. FF7 opens the road into Spawn's hell. SP4 unlocks MK7. FF4 unlocks Ultron Forever. CA7 needs IM8.

## Iron Man (IM1–IM15)

Tony Stark's line runs from the cave to the inverted Superior Iron Man. It feeds Civil War, Secret Wars and The Last Ultron.

1.  **The Cave** (*Tales of Suspense \#39*). A weapons demonstration abroad goes wrong. Shrapnel lodges near Tony's heart, and the warlord Wong-Chu holds him with the physicist Ho Yinsen. Ordered to build a weapon, they build armour instead. Yinsen gives his life buying time for the suit to power up, and Tony walks out. Your Power Nubbin carries the iron plates past the guards.

2.  **The Crimson Dynamo** (*Tales of Suspense \#46*). Anton Vanko's electric armour sabotages Stark plants. Tony beats him, then shelters him once Vanko learns his own government means to kill him. A Fly Nubbin spots the sabotage from the rafters.

3.  **The Mandarin** (*Tales of Suspense \#50*). Tony walks into the Mandarin's fortress and meets the ten rings: ice, flame, the disintegration beam. He gets out by out-thinking the rings, not out-punching them. Your Nubbin learns each ring's tell in a timing bout.

4.  **Titanium Man** (*Tales of Suspense \#69–71*). Boris Bullski challenges Iron Man to a televised duel to prove whose science is better. Tony wins with a smaller, weaker suit and better tactics. This is a three-round karate bout with a Run Nubbin dodging.

5.  **Demon in a Bottle** (*Iron Man \#120–128*). Justin Hammer hijacks the armour, and it kills an ambassador in public. Tony's drinking spirals while he is framed. With Bethany Cabe and Rhodey, he storms Hammer's floating base, clears his name, and starts recovering. Your Nubbins' trust meters work here as a mirror: the game asks you to keep Tony company as patiently as you would a Shadow Nubbin.

6.  **Doomquest** (*Iron Man \#149–150*). **Needs FF2.** Doom's time platform throws him and Iron Man into Camelot. Doom courts Morgan le Fay, Tony stands with Arthur, and the two enemies call a truce to get home. Your Nubbin rides with the knights in a race on a jousting course.

7.  **Iron Monger** (*Iron Man \#163–200*). Obadiah Stane takes Stark International through a corporate siege. Tony relapses and ends up on the street. Rhodey wears the armour in his place. Tony rebuilds from nothing, comes back in the Silver Centurion suit, and defeats Stane's Iron Monger armour, which ends with Stane's death as in the comic. Choose who wears the suit in the final fight: Tony or Rhodey.

8.  **Armor Wars** (*Iron Man \#225–232*). Tony's armour designs have been stolen and sold to half his enemies. He goes rogue to shut down every suit built on his tech, including the Guardsmen at the Vault and an ally's armour. He clashes with Captain America and the government over it. This sets up Civil War.

9.  **The Dragon Seed Saga** (*Iron Man \#270–275*). **Needs IM3.** The Mandarin returns with Fin Fang Foom and the dragons of Kakaranathara. Tony and the Mandarin are forced into an alliance, and it ends with the Mandarin losing his hands and the rings. A Swim Nubbin dives the lake the dragons rise from.

10. **Extremis** (*Iron Man vol. 4 \#1–6*). Maya Hansen's Extremis serum turns Mallen into a living weapon. Beaten and dying, Tony takes Extremis himself, and the armour becomes part of his nervous system. **Unlocks UL7.**

11. **The Five Nightmares** (*Invincible Iron Man \#1–7*). **Needs IM7.** Ezekiel Stane, Obadiah's son, arms suicide attackers with Stark technology. Tony faces his worst fear: his own designs doing his enemies' work.

12. **The Mask in the Iron Man** (*Iron Man vol. 3 \#26–30*). The armour wakes up with a mind of its own and wants to be Tony. It ends by giving its life to save his. In the game, the code that woke it is a fragment the Ultron line reveals later. **Unlocks UL5.**

13. **Stark Resilient** (*Invincible Iron Man \#25–33*). Tony starts again with a clean-energy company. Justine and Sasha Hammer try to bury it, and the repulsor car is the prize.

14. **Hypervelocity** (*Iron Man: Hypervelocity \#1–6*). A backup copy of Tony's mind wakes inside the armour while the real Tony is down, and it is hunted as a rogue weapon. Your Nubbins have to decide which Tony to trust.

15. **Superior Iron Man** (*Superior Iron Man \#1–9*). **Needs IM10.** An inverted Tony takes over San Francisco with Extremis 3.0, offering perfect bodies for a fee. Pepper, in the Rescue armour, and Daredevil stand against him. Bring him back to himself, which closes the line. **Completes the Iron Man line.**

## Captain America (CA1–CA10)

Steve Rogers' line runs from Project Rebirth to the Hydra lie and feeds Civil War. Its running thread is the Cosmic Cube.

1.  **Project Rebirth** (*Captain America Comics \#1*). The army turns down frail Steve Rogers until Dr. Erskine picks him for the super-soldier serum. A spy shoots Erskine the moment it works, so Steve is the only one there will ever be. The game ties this to your weakest Nubbin: an all-E-grade Nubbin is the one Erskine would have picked.

2.  **Bucky and the Red Skull** (*Captain America Comics \#1–7*). Camp kid Bucky Barnes walks in on Steve changing and becomes his partner. Together they meet the Red Skull. A Run Nubbin is Bucky's shadow on the night raids.

3.  **Frozen** (*Avengers \#4*). **Needs CA2.** On the last mission of the war, Zemo's drone plane explodes. Bucky is lost and Cap falls into the Arctic sea. Decades later the Avengers find him in the ice. Your Swim Nubbin finds him first.

4.  **The Cosmic Cube** (*Tales of Suspense \#79–81*). The Red Skull gets the Cube and remakes reality around himself. Cap tricks him into letting it go, and it falls into the sea. **Unlocks CA9 and CA10's thread.**

5.  **Secret Empire** (*Captain America \#169–180*). A conspiracy frames Cap. When he unmasks its leader, the trail runs to the top of the government. Steve gives up the shield and becomes Nomad, the man without a country.

6.  **The Madbomb** (*Captain America \#193–200*). An aristocratic cabal builds bombs whose sound drives crowds into riots. Cap and the Falcon chase the biggest one before it goes off on the anniversary. Your Fly Nubbin hears it first.

7.  **The Captain** (*Captain America \#332–350*). **Needs IM8.** A government commission orders Steve to serve them. He resigns, and John Walker is made Captain America. Walker breaks under the weight. Steve, wearing black as "the Captain", finds the Red Skull behind it all and takes the shield back.

8.  **Streets of Poison** (*Captain America \#372–378*). A new street drug floods the city, and Cap's war on it pits him against the Kingpin and Bullseye. His own serum-altered blood is tainted on the way.

9.  **The Winter Soldier** (*Captain America vol. 5 \#1–14*). **Needs CA3 and CA4.** General Lukin wants the Cube, and his assassin is Bucky, alive and brainwashed. Steve uses the Cube to give Bucky his memories back. **Required for Civil War.**

10. **Hail Hydra** (*Steve Rogers: Captain America \#1–19, Secret Empire*). **Needs CA4 and CA9.** Kobik, the Cube reborn as a child, rewrites Steve's past. He wakes believing he was always a Hydra agent and takes over the country. The real Steve, kept alive in the Cube's memory, comes back to fight his double. **Completes the Captain America line.**

## Doctor Doom and the Fantastic Four (FF1–FF10)

This line is the Fantastic Four's, but its centre is Victor von Doom. It feeds Secret Wars directly and crosses into Iron Man, Spawn and Ultron.

1.  **Cosmic Rays** (*Fantastic Four \#1*). Reed, Sue, Johnny and Ben take an untested rocket up, and cosmic rays change them. Their first fight is with the Mole Man. Each of your Nubbins is matched to one of the four by its top stat.

2.  **Doom's First Strike** (*Fantastic Four \#5*). Doom takes Sue hostage and sends the others back in time on his time platform to steal Blackbeard's treasure. Ben ends up becoming Blackbeard. **Unlocks IM6.**

3.  **The Galactus Trilogy** (*Fantastic Four \#48–50*). The Silver Surfer heralds Galactus. The Watcher sends Johnny across the universe for the Ultimate Nullifier, and Alicia reaches the Surfer's conscience. Galactus leaves and exiles the Surfer to Earth. A Fly Nubbin races Johnny's route.

4.  **The Power Cosmic** (*Fantastic Four \#57–60*). **Needs FF3.** Doom tricks the Surfer and steals his power. Reed beats a god by getting Doom to touch the barrier Galactus left around Earth. **Unlocks UL10.**

5.  **Origin of Doom** (*Fantastic Four Annual \#2*, *Books of Doom*). Victor grows up among the Roma of Latveria. His mother made a pact with Mephisto, and his father died a fugitive. At university he ignores Reed's warning about a machine meant to reach his mother's soul, and it scars him. Tibetan monks forge the mask.

6.  **Unthinkable** (*Fantastic Four vol. 3 \#67–70*). Doom gives up science for sorcery, paying with the life of Valeria, his first love. He traps Franklin in hell and humiliates the family. Reed has to learn magic to beat him, and Doom is dragged into hell.

7.  **Triumph and Torment** (*Doctor Strange and Doctor Doom: Triumph and Torment*). **Needs FF5.** Doom comes second in a contest of sorcerers, and the winner, Strange, owes the runner-up a boon: help to free his mother from Mephisto's realm, which Doom may attempt once a year. Strange goes with him into hell. In the game, Mephisto's realm borders the hell of the Spawn line. **Unlocks SP6.**

8.  **Emperor Doom** (*Marvel Graphic Novel: Emperor Doom*). Doom uses the Purple Man's power to rule the whole world, and for a while it works: no war, no hunger. The heroes have to decide whether to break a peace built on mind control. Your Nubbins are the first to shake off the effect.

9.  **Three** (*Fantastic Four \#583–588*). Johnny holds the Negative Zone portal shut against Annihilus's swarm, and he dies there. The family grieves. Reed founds the Future Foundation, and even Doom joins it.

10. **Doomwar** (*Doomwar \#1–6*). **Needs FF6.** Doom invades Wakanda for its vibranium and tries to take its mystic power. Black Panther, Storm and the Fantastic Four stop him. **Completes the Doom line.**

Epilogue, after Secret Wars: **Infamous Iron Man** (*Infamous Iron Man \#1–12*). A changed Doom tries to take Tony's place as Iron Man.

## Ultron (UL1–UL10)

Ultron is the campaign's final enemy. Each storyline in this line is a version of him the heroes beat but never finish, and every Ultron keeps a grudge against organic life, your Nubbins included. The line is required for the final endgame.

1.  **The Crimson Cowl** (*Avengers \#54–55*). Hank Pym's robot experiment rebuilds itself five times in secret. Disguised as the Crimson Cowl, it leads the Masters of Evil against the Avengers, then takes off the mask: Ultron-5.

2.  **The Vision** (*Avengers \#57–58*). Ultron builds a synthetic man from Wonder Man's brain patterns and sends him to destroy the Avengers. The Vision turns on his maker and joins the team instead. A Nubbin is the first to treat the Vision as a person.

3.  **Adamantium** (*Avengers \#66–68*). Ultron-6 comes back in an unbreakable adamantium body. The Avengers can't scratch it, so they win by out-thinking it, not by hitting harder.

4.  **Jocasta** (*Avengers \#161–162*). Ultron-8 kidnaps the Wasp to copy her mind into a robot bride, Jocasta. Jocasta rebels against him, the first of his creations to choose the heroes freely.

5.  **Ultron Unlimited** (*Avengers vol. 3 \#19–22*). **Needs IM12.** Ultron wipes out a small European nation to build an army of himself. He kidnaps Hank, Jan, Wonder Man, the Vision and the Grim Reaper as his "family". The Avengers assault the fortress, and Thor finally breaks him. The armour fragment from IM12 turns out to be his.

6.  **Annihilation: Conquest** (*Annihilation: Conquest \#1–6*). Ultron joins the Phalanx, a techno-organic hive conquering Kree space, and plans to remake all life in his image. Star-Lord's ragtag band stops it.

7.  **The Ultron Initiative** (*Mighty Avengers \#1–6*). **Needs IM10.** Ultron hides inside Tony Stark's Extremis armour, takes over his body, and remakes himself in a face that looks like the Wasp's. The Mighty Avengers have to beat him without killing Tony.

8.  **Age of Ultron** (*Age of Ultron \#1–10*). Ultron has already won: the world is ruins and the last heroes are hiding. Two of them go back in time and kill Pym before he can build him, and the future they return to is worse. They go back again and help Pym plant a trap instead: Ultron will be built, but carrying the code that defeats him.

9.  **Rage of Ultron** (*Avengers: Rage of Ultron*). Ultron returns from deep space and fuses with his maker. Hank Pym and Ultron become one being, and the Vision has to decide what that means for both of them.

10. **Ultron Forever** (*Avengers: Ultron Forever \#1*). **Needs FF4.** Heroes from different eras are pulled into a future ruled by a final Ultron. Their unlikely ally is Doctor Doom, because in that future Doom is all that is left of humanity. **Completes the Ultron line, and opens the door to the last endgame once the rest is done.**

## Moon Knight (MK1–MK8)

Marc Spector's line is about a man who died in Egypt and came back as a god's fist, never sure how much of it is real. It feeds Armageddon.

1.  **The Mercenary** (*Werewolf by Night \#32–33*). A secret group called the Committee hires Marc Spector, in silver armour, to bring in the werewolf Jack Russell. Marc frees him instead. Your Nubbin is the first to notice the werewolf is the victim.

2.  **Death in Egypt** (*Moon Knight \#1*, 1980). On a job in Egypt, Marc's partner Bushman murders the archaeologists at a dig and leaves Marc to die at the foot of Khonshu's statue. Khonshu brings him back. Marlene and Frenchie bring him home.

3.  **Three Faces** (*Moon Knight \#2–15*). Marc runs three lives: millionaire Steven Grant, cab driver Jake Lockley, and Moon Knight. Bushman returns. The game splits your Nubbins between the three lives, and each one sees a different Marc.

4.  **The Bottom** (*Moon Knight vol. 5 \#1–6*). Broken and crippled, Marc is haunted by Khonshu taunting him. Taskmaster is sent to finish him. He crawls back, more brutal than before. This is the darkest storyline in the line.

5.  **Mr. Knight** (*Moon Knight vol. 7 \#1–6*). In a white suit, Marc becomes Mr. Knight, a detective of the night's strangest cases. In the famous fifth issue he fights his way up a building, floor by floor, to rescue a kidnapped girl. Your Nubbins climb the Cliff course with him.

6.  **Lunatic** (*Moon Knight vol. 8 \#1–14*). Marc wakes up in an asylum and is told none of it was real. He breaks out through the minds of Steven and Jake and through Khonshu's own realm, and ends by facing Khonshu as an equal.

7.  **The Midnight Mission** (*Moon Knight vol. 9*). Marc becomes Khonshu's priest and opens a mission for anyone who walks at night, while a rival Fist of Khonshu, Hunter's Moon, decides Marc isn't worthy. **Needs SP4.**

8.  **Age of Khonshu** (*Avengers vol. 8 \#32–38*). Khonshu sends Marc to steal the Avengers' power sources, including the Phoenix, so Khonshu can rule the Earth from the sky. Marc has to choose between the god who saved him and the world. He frees the stolen powers, and Khonshu throws him out of the sky palace onto the Mission roof: "You will come back to me." (The walk down by the Mission lantern belongs to E3.) **Completes the Moon Knight line.**

## Spawn (SP1–SP8)

Al Simmons' line is the campaign's horror: a man who sold his soul to see his wife again and found that Heaven and Hell are both using him. It feeds Armageddon.

1.  **Al Simmons** (*Spawn \#1*). Government assassin Al Simmons is murdered by his partner Chapel on Jason Wynn's orders. In Hell he makes a deal with Malebolgia to see his wife Wanda again. He comes back five years later with no memory, no face, and a fixed amount of power that counts down every time he uses it. Wanda has married his best friend Terry. Your Nubbin is the only creature not afraid of him.

2.  **The Clown** (*Spawn \#2–4*). Hell's handler, a foul little clown who is really the demon Violator, steers Spawn into a war with the mob boss Tony Twist. Spawn learns the clown wants him to burn out his power.

3.  **Overt-Kill** (*Spawn \#5–7*). The mob sends the cyborg Overt-Kill after Spawn. It is the first time Spawn fights back with everything, and the first time he sees what the suit does with anger.

4.  **Angela** (*Spawn \#9*). The old man Cogliostro explains the rules: Spawn is one of many Hellspawn, built to lead Hell's army. Then Angela, Heaven's bounty hunter, comes to collect. **Unlocks MK7.**

5.  **Wynn and Chapel** (*Spawn \#10–20*). Spawn hunts the men who killed him. Wynn sits behind a wall of secrets, and Chapel has his own bargain with Hell. Revenge costs more power than Spawn has.

6.  **The Death of Malebolgia** (*Spawn \#100*). **Needs FF7.** Spawn goes into Hell, and with Angela he kills Malebolgia. Then he turns down Hell's throne. In the game you go in through the road Doom and Strange opened to Mephisto's realm.

7.  **The Redeemer** (*Spawn \#16–18 and later Redeemers*). After Malebolgia's fall, Heaven sends its latest Redeemer to kill Spawn, and he learns that Heaven's hands are not clean either.

8.  **Mammon and Cain** (*Spawn \#150–164*). Spawn finds out that Mammon has been pulling the strings above Malebolgia from the start, and that Cogliostro is the first murderer, Cain. **Completes the Spawn line.**

## Dragon Ball (DB1–DB20)

This is Goku's line from the original series, from the first Dragon Ball to the eve of the 23rd tournament. The Dragon Balls are its thread: you gather all seven twice, and one wish is saved for the final endgame. It feeds the 23rd Budokai. Chapter numbers are approximate.

1.  **The Boy with a Tail** (*chapter 1*). Bulma is hunting Dragon Balls with her radar when she nearly runs over Goku, a boy with a tail and his grandpa's four-star ball. They team up. Your Nubbin rides on her bike.

2.  **Oolong** (*chapters 3–4*). A shapeshifting pig is kidnapping village girls. Goku beats him, and Bulma keeps him in line with a candy that makes him run for the toilet whenever she says the word.

3.  **Yamcha and Puar** (*chapters 5–7*). The desert bandit Yamcha fights Goku to a draw, then freezes because Bulma is a girl. He tails them for the Dragon Balls.

4.  **Fire Mountain** (*chapters 8–11*). Goku saves a turtle and its master, Roshi, gives him the Flying Nimbus. The Ox-King's castle is on fire. Roshi puts it out with the Kamehameha, takes the mountain with it, and Goku copies the move on his first try. Goku also meets Chi-Chi. **Your Nubbins learn a Kamehameha karate move.**

5.  **Pilaf's Wish** (*chapters 12–23*). Emperor Pilaf steals the balls. Oolong blurts out a wish for a pair of panties before Pilaf can wish for the world. Under the full moon Goku becomes a giant ape, and Yamcha and Puar cut off his tail.

6.  **Turtle School** (*chapters 24–27*). Goku and Krillin train under Roshi by delivering milk, digging fields bare-handed and outswimming sharks. Lunch sneezes between her sweet and violent selves.

7.  **The 21st Budokai** (*chapters 28–53*). Krillin and Goku fight their way to the World Martial Arts Tournament. In the final Goku loses to Jackie Chun, who is Roshi in disguise. When Goku turns into the ape again, Roshi blows up the moon.

8.  **Muscle Tower** (*chapters 54–68*). The Red Ribbon Army wants the balls. Goku climbs General White's tower floor by floor and befriends the gentle giant Android 8.

9.  **The Pirate Cave** (*chapters 69–81*). Goku, Bulma and Krillin race General Blue through an underwater pirate cave. The chase ends in Penguin Village, where Arale flattens Blue. A Swim Nubbin leads the dive.

10. **Mercenary Tao** (*chapters 82–86*). The assassin Tao kills Upa's father Bora and beats Goku with the Dodon Ray. Goku starts climbing Korin Tower to get stronger.

11. **Korin Tower** (*chapters 87–91*). Korin's Sacred Water is just water. The power was in chasing Korin for it. Goku comes down and beats Tao.

12. **Red Ribbon's End** (*chapters 92–95*). Goku storms the army's headquarters alone. Commander Red's secret wish was only to be taller, and his own officer kills him for it.

13. **Fortuneteller Baba** (*chapters 96–112*). To find the last ball, Goku beats Baba's fighters. The final masked fighter is his grandpa Gohan, back from the dead for one day. The balls' wish brings back Bora. **Completes the first set of seven.**

14. **The 22nd Budokai** (*chapters 113–135*). The Crane School's Tien and Chiaotzu come to kill Roshi's students. Tien learns honour mid-fight, turns on his master, and beats Goku in the final.

15. **Tambourine** (*chapters 136–140*). After the tournament, Krillin is murdered by a demon named Tambourine. Goku goes after the master who sent him. This is the turn from adventure to war.

16. **King Piccolo** (*chapters 141–160*). Roshi gives his life trying to seal King Piccolo with the Evil Containment Wave. Piccolo kills Chiaotzu, takes back his youth with the balls, and kills Shenron so no one can wish him away.

17. **Goku vs. King Piccolo** (*chapters 161–166*). Korin's Ultra Divine Water, Yajirobe's help and everything Goku has. He punches straight through Piccolo. Before he dies, Piccolo spits out an egg holding his son.

18. **Kami's Lookout** (*chapters 167–180*). Goku climbs to Kami, Shenron's creator, and Kami restores the dragon. The wish brings back everyone Piccolo killed. Mr. Popo trains Goku far beyond Roshi.

19. **Three Years** (*chapters 181–188*). Goku travels and trains alone. Tien and Yamcha train under Kami. Your Nubbins travel with Goku, and this is where they learn to fly on Nimbus.

20. **The 23rd Budokai Begins** (*chapters 189–194*). Goku meets Chi-Chi again in the ring and keeps the promise to marry her that he didn't understand, and spars once with a stranger hiding Kami. The bracket: Goku, Chi-Chi, Tien, Mercenary Tao, Krillin, Yamcha, Shen and a man in a cloak, Ma Junior. **Completes the Dragon Ball line, and the second set of seven is gathered.**

## Toy Story (TS1–TS12)

This line follows Woody and Buzz from Andy's bedroom to the carnival, across all four films. On this side of the gate, your Nubbins are toys too. If you own the plush Nubbin from fun quest 12, it lives in Andy's toy box. The line feeds So Long, Partner.

1.  **The New Toy** (*Toy Story*). Buzz Lightyear arrives on Andy's birthday, sure he's a real space ranger, and takes Woody's spot on the bed. Your plush Nubbin is demoted with Woody.

2.  **Pizza Planet** (*Toy Story*). Woody knocks Buzz out of the window by accident, and both are left behind at a gas station. They end up in the claw machine at Pizza Planet, where the aliens worship the Claw. Sid wins them.

3.  **Sid's House** (*Toy Story*). Sid's mutilated toys turn out to be kind. Buzz sees his own TV commercial, tries to fly, falls, and learns he is a toy.

4.  **The Rocket** (*Toy Story*). Woody breaks the toys' biggest rule and lets Sid see them move to save Buzz. They chase the moving van with RC and a rocket strapped to Buzz's back, and land in Andy's car.

5.  **The Yard Sale** (*Toy Story 2*). Woody's arm tears, and while he rescues Wheezy from the yard sale, Al the collector steals him.

6.  **Al's Toy Barn** (*Toy Story 2*). Buzz leads a rescue across a highway under traffic cones and through Al's Toy Barn, where a newer Buzz with a utility belt doesn't believe him.

7.  **The Roundup Gang** (*Toy Story 2*). Jessie, Bullseye and the Prospector need Woody to complete their set for a museum in Japan. Jessie tells how her owner Emily outgrew her. Woody has to choose between forever and Andy.

8.  **The Airport** (*Toy Story 2*). The Prospector, who was never sold, tries to force the trip. The rescue runs through the airport baggage system and onto a plane's wheels to save Jessie.

9.  **Sunnyside** (*Toy Story 3*). Andy is leaving for college, and the toys are donated by mistake to Sunnyside daycare, run by the bitter strawberry-scented bear Lotso. They plan a break-out from the toddler room.

10. **The Incinerator** (*Toy Story 3*). The escape ends in the landfill. On the belt into the furnace the toys stop struggling and hold hands. The aliens save them with a claw. This is the line's hardest scene, and your Nubbins hold hands with them.

11. **Bonnie** (*Toy Story 3*). Andy gives his toys to Bonnie and plays with them one last time before he leaves.

12. **Forky** (*Toy Story 4*). Bonnie makes Forky out of a spork, and Forky keeps trying to throw himself away. The road trip leads to an antique store, the doll Gabby Gabby who wants Woody's voice box, and Bo Peep living free as a lost toy. **Completes the Toy Story line.**

## Endgames 1–3

### E1. Civil War

*Civil War \#1–7; epilogues from The Death of Captain America and Captain America: Reborn.*

**Requires** every Iron Man and Captain America storyline (IM1–IM15, CA1–CA10).

1.  **Stamford.** A televised fight between young heroes and the villain Nitro ends in an explosion that kills hundreds, many of them children at a school.

2.  **The Act.** The Superhuman Registration Act demands every hero unmask and sign up. Tony backs it, and Steve goes underground rather than sign. On this side of the gate the law covers powered creatures too, so your Nubbins have to be registered or hidden.

3.  **Sides.** You choose who to stand with. Each side has its own middle chapters: Tony's has Spider-Man unmasking on live TV, the Negative Zone prison, and a cloned Thor killing Goliath. Steve's has the Secret Avengers, safehouses, and the Punisher, whom Cap throws out.

4.  **The last battle.** The two sides tear New York apart. Just as Steve is about to win, ordinary people pull him off Tony, and he sees the city around him. He surrenders.

5.  **Epilogue.** On the courthouse steps Steve is shot. Then, through the CA line's Cube thread, he comes back: Kobik, keeping her promise not to change anything, only caught him as he fell. Both play as short, quiet scenes.

**Choice:** `cw = registration` or `cw = resistance`. The ending is the same either way, but the choice decides who stands with you at the final endgame: Tony's armoured army, or Steve's resistance.

### E2. Secret Wars

*Secret Wars \#1–9 (2015).*

**Requires** every Doom and Fantastic Four storyline (FF1–FF10), plus Doomquest (IM6) and the Cosmic Cube (CA4).

1.  **Incursions.** Whole universes are colliding and destroying each other. The final collision comes.

2.  **Battleworld.** Doom, with Doctor Strange and the Molecule Man, steals the power of the Beyonders and stitches the wreckage into one world with himself as God Emperor. In the game, each line's world becomes a domain of Battleworld. Your Nubbins visit Sunnyside, Kami's Lookout and Doom's Latveria, all ruled by Doom.

3.  **The raft.** Reed's survivors wake up on Battleworld. Doom's perfect order begins to crack. He kills Strange in a rage, and Valeria and Franklin call him Father.

4.  **The last fight.** The Molecule Man moves Doom's power to Reed. Doom admits Reed would have done better with it.

5.  **After.** Reed and Sue set out to rebuild the multiverse. Doom wakes up with his face healed. **Unlocks the Infamous Iron Man epilogue.**

**Choice:** whether your Nubbins tell Doom the truth when he asks if Reed would have done better. It decides whether Doom comes to the final endgame as an ally (`doom = ally`) or as a wildcard (`doom = rival`).

### E3. Armageddon

*Original, after Spawn \#150–164 and Age of Khonshu.*

**Requires** every Spawn and Moon Knight storyline (SP1–SP8, MK1–MK8).

1.  **The war comes to Earth.** Heaven and Hell stop pretending and turn the Earth into their final battlefield. The dead rise, and Mammon's and Heaven's armies march.

2.  **The god in the sky.** Khonshu sees his chance, takes the night sky, and calls Moon Knight to his side.

3.  **Two soldiers, two masters.** Spawn is offered both thrones, Heaven's and Hell's, and Moon Knight is offered Khonshu's. They meet as enemies, then compare notes.

4.  **The refusal.** Spawn refuses both sides and spends his power ending the war. Marc turns on Khonshu and helps lock him away. Your Nubbins keep the lantern lit that lets Marc find his way back.

5.  **After.** Spawn is left with almost nothing and is free. Marc is a man again, with three faces.

**Choice:** whether Marc keeps any of Khonshu's power. With `mk = power`, Moon Knight comes to the final endgame at full strength but answers to no one, and the game reminds you of it. With `mk = free`, he comes weaker and steadier. Spawn comes to the final endgame either way.

## Endgames 4–6

### E4. The 23rd Budokai

*Dragon Ball, the 23rd World Martial Arts Tournament through the final chapter.*

**Requires** every Dragon Ball storyline (DB1–DB20).

1.  **The bracket.** Tien beats a rebuilt Mercenary Tao; the stranger Shen (Kami in a borrowed body) beats Yamcha; Goku beats Tien in the semi-final.

2.  **Ma Junior.** The cloaked fighter is Piccolo Jr., reborn from King Piccolo's egg and set on revenge. He and Kami share one life: if one dies, so does the other.

3.  **The final.** Goku and Piccolo Jr. fight until the arena is gone. Piccolo breaks Goku's arms and legs. Goku wins with a headbutt flying through the air.

4.  **Mercy.** Goku gives Piccolo a Senzu bean instead of finishing him, because killing him would kill Kami too, and because that's who Goku is.

5.  **After.** Goku and Chi-Chi fly off on the Nimbus to be married. The original series ends here.

**Choice:** what to do with the wish from the second set of Dragon Balls. You can spend it now to bring back everyone lost in the line's battles, or save it. A saved wish (`wish = saved`) goes with you into the final endgame.

### E5. So Long, Partner

*Toy Story 4, the carnival through the closing scene.*

**Requires** every Toy Story storyline (TS1–TS12).

1.  **The carnival.** Bo's lost toys, Duke Caboom and Ducky and Bunny help Woody get Forky back from the antique store. Woody gives Gabby Gabby his voice box.

2.  **Gabby's child.** The girl Gabby waited for doesn't want her. At the carnival she finds a lost little girl who does.

3.  **Buzz's inner voice.** Buzz follows the voice-button wisdom he's been trusting all film, and it leads him to tell Woody it's all right to go.

4.  **The goodbye.** Woody stays with Bo as a lost toy. Bonnie keeps Forky, and the gang goes home without Woody. Buzz and Woody say goodbye.

**Choice:** your plush Nubbin's choice. It can stay with Woody and Bo among the lost toys (`plush = lost`) or go home with Buzz to Bonnie's room (`plush = bonnie`). The lost toys bring their carnival tricks to the final endgame. Bonnie's toys bring Buzz.

### E6. The Last Ultron (final endgame)

*Adapted from Age of Ultron and Ultron Forever, with every line converging.*

**Requires** every Ultron storyline (UL1–UL10), plus Civil War (E1) and Secret Wars (E2). Armageddon, the 23rd Budokai and So Long, Partner are optional. Each one you finished adds an ally and a scene.

1.  **The gate.** The last Ultron, the one that waited at the end of every timeline, finds the rift above your waterfall and the Grove beyond it. He has learned what Eternals are: Nubbins that never age. He doesn't understand that they fade unless they are loved. Ultron wants an Eternal body, organic and endless, and he means to take one.

2.  **The worlds fall.** Ultron's drones come through every gate. Andy's old toys are taken over from the inside, Kami's Lookout is besieged, and Latveria's walls are breached. You get to each world in time to hold it, with whoever came with you.

3.  **The allies.** Tony's armours or Steve's resistance, depending on Civil War. Doom, as an ally or a rival, depending on Secret Wars. Spawn and Moon Knight if you finished Armageddon. Goku and the saved wish if you finished the 23rd Budokai. Woody, Buzz and the lost toys if you finished So Long, Partner.

4.  **The trap.** Age of Ultron's lesson holds: erasing Ultron makes things worse. The only way through is the trap Hank Pym planted in his code. Somebody has to carry it into Ultron's core. That is the Vision and Jocasta, the two creations who chose the heroes, with your Nubbin riding along.

5.  **The last choice.** At the core, Ultron is offered three things.

    - **Delete him with the trap code.** This is the faithful Age of Ultron ending. Ultron is gone, the gate closes, and every world keeps its scars.

    - **Spend the saved wish** (only if you saved it at the 23rd Budokai) to wish Ultron a heart. This is the Jocasta and Vision ending. Ultron lives as something new and stays in a world of his own beyond the gate.

    - **Let him take an Eternal Nubbin and stop him from inside.** This is the hardest ending, and only open if you have raised an Eternal in the Free Grove or Hazel's Grove. A reflection of your oldest Eternal, made for the Multiverse save, goes into Ultron, and being remembered is the one thing he can't compute. Both are lost. Only the Multiverse save loses it; your real Eternal stays in its Grove. A memorial flower opens at the falls.

6.  **After.** Every ally you brought gets a closing scene in their own world. The rift above the waterfall seals, and the Grove's Nubbins come out of hiding.

**Completion:** finishing The Last Ultron completes the Multiverse campaign. Each ending you reach is recorded on the title screen, the same way Hazel's Grove endings are.

=== END PART F ===


## Part G. Neopia (retro Neopets: lands, plots, species, paint brushes, items, freebies, games, quests)

Mostly all-ages content drawn from classic Neopets (2000–2008). It covers 19 lands, the 13 site plots as the Neopia line (NP1–NP13), the 54 retro species (plus the optional Vandagyre) as a new Neo creature family, the paint brush colours, the items (omelettes, jellies, Neggs, codestones and more), the freebies (each one-time or unlimited, never per visit), 20 Games Room classics, and the quests and characters. The text between the markers is the full content.

=== BEGIN PART G ===

Neopia brings classic Neopets, roughly 2000 to 2008, into the Grove. That means its lands, 13 site plots, the 54 retro species (plus the optional Vandagyre), the paint brushes, the items, the freebies, the Games Room and the faeries. Unlike the Multiverse campaign, nothing in it is adults-only: most of it is `all`, and the war plots and darker Haunted Woods stories are `main` (main game only).

## How Neopia fits

- **A second gate.** A rainbow-coloured gate by the Rainbow Pool opens onto Neopia. Its lands are worlds you visit there, and each one can also be bought as a section of your own sandbox (OW25), carrying that land's look and shops.

- **Neopets become a creature family.** The 54 retro species join the Chao, pocket and digital lines as a fourth family, hatched from Neggs. They raise, race, fight in karate and evolve the same way, with the Neopets' colours as their paint system.

- **One story line.** The 13 retro site plots become a Neopia line of one-time storylines, NP1 to NP13. Dr. Sloth runs through them and is beaten for good in the last one. The main game plays them in number order; the Learning Grove plays only the `all` plots (NP1, NP3, NP4, NP6, NP11, NP12, NP13), each requiring the previous one available in that mode.

- **Who can play.** All ages, apart from the war plots and the darker Haunted Woods stories (NP2, NP5, NP7–NP10, Edna's Quests and the Esophagor), which are `main`: main game only, not crude. The Learning Grove gets the lands, pets, paint brushes, shops and gentle games.

- **Freebies and dailies.** Classic Neopets ran on dailies such as the Giant Omelette, the Snowager and the Tombola. Maor's rule is no repeatable chores: nothing is once a day, once per visit or reset by leaving, so each freebie below is either one-time or unlimited.

- **Rights.** Neopets belongs to World of Neopets, Inc. Names, species and plots are listed here as reference, and the game should keep its own art.

## The lands of Neopia

Neopia has 19 lands, including one joke (Jelly World) and one secret (Lutari Island). Each one is a world beyond the gate and a section you can buy for your own sandbox.

| Land                                 | Signature places and features                                                                                                                                                 | In the Grove                                                       |
|--------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------|
| Neopia Central                       | Rainbow Pool, Neopian Bank, Money Tree, Soup Kitchen, Hospital and Pharmacy, Food, Magic and Petpet shops, Trading Post, Auction House, Stock Market, Art Gallery, Neolodge   | The gate hub. Shops, the bank, and the Rainbow Pool colour gallery |
| Faerieland                           | Queen Fyora's castle, the Hidden Tower, Healing Springs, Wheel of Excitement, Faerie Quests, Jhudora's Cloud, Poogle Racing                                                   | Faerie Quests. The Hidden Tower as the rare-item shop              |
| Tyrannia                             | The Plateau with the Giant Omelette and Wheel of Mediocrity, the Jungle, the Concert Hall, the Town                                                                           | Omelette freebie. Setting for NP2                                  |
| Lost Desert                          | Sakhmet (Coltzan's Shrine, the Fruit Machine, Sakhmet Solitaire), the Qasala ruins, the Deserted Tomb                                                                         | Desert section. Setting for NP4 and NP9                            |
| Mystery Island                       | Tombola, Island Mystic, Training School (codestones), Techo Mountain volcano, Geraptiku, Kitchen Quests                                                                       | Beach section. A codestone training gym                            |
| Haunted Woods                        | Brain Tree, Esophagor, Edna's Tower, the Deserted Fairground (Wheel of Misfortune, Coconut Shy, Test Your Strength), Eliv Thade's castle, Neovia, Count Von Roo's Deadly Dice | Night section. Setting for NP10                                    |
| Meridell                             | King Skarl's castle, Meri Acres Farm, Illusen's Glade, the Turmaculus, Cheeseroller, Kiss the Mortog                                                                          | Farm section. Setting for NP5 and NP7                              |
| Brightvale                           | King Hagan's castle and the Wise Old King, scroll and book shops                                                                                                              | A library section                                                  |
| Darigan Citadel                      | Lord Darigan's floating fortress                                                                                                                                              | Seen in the Meridell plots                                         |
| Terror Mountain                      | Ice Caves (the Snowager), Happy Valley (Ice Cream Factory, the Advent Calendar, Toy Repair Shop), the Ski Lodge, Taelia the Snow Faerie                                       | Snow section. Setting for NP3                                      |
| Krawk Island                         | The Golden Dubloon, Swashbuckling Academy (dubloons), Bilge Dice, Smugglers' Cove, Forgotten Shore, Anchor Management, Buried Treasure                                        | Pirate section. Dubloon training gym                               |
| Maraqua                              | King Kelpbeard's kingdom, the Maraquan Ruins and Underwater Fishing                                                                                                           | Underwater section, Swim Nubbins only. Setting for NP1 and NP8     |
| Kiko Lake                            | The lake and its workshops                                                                                                                                                    | A lake section                                                     |
| Roo Island                           | The Merry-Go-Round, Dice-a-Roo, King Roo's castle                                                                                                                             | A carnival section                                                 |
| Virtupets Space Station and Kreludor | Space Station shops, the Space Faerie, the Meteor Crash Site, Kreludan mining, orange and purple Grundos                                                                      | Space section. Setting for NP13                                    |
| Altador                              | Hall of Heroes, the constellations, the Colosseum (Altador Cup), the Archives                                                                                                 | Setting for NP12                                                   |
| Shenkuu                              | The Lunar Temple moon-phase puzzle, terraced gardens                                                                                                                          | A mountain-garden section                                          |
| Lutari Island                        | The island nobody can find                                                                                                                                                    | A secret: the gate opens there once, after NP13                    |
| Jelly World                          | Famously does not exist                                                                                                                                                       | An Easter egg: a signpost to nowhere, and one jelly                |

Moltara (2009) and post-2010 lands are outside the retro window and left out.

## The Neopia line (NP1–NP13)

These are the 13 classic site plots from 2000 to 2008, in order of their conclusion. Each is played once with your Nubbins as companions. The thread is Dr. Sloth, who keeps coming back until NP13. Plots are summarised from Jellyneo's Book of Ages (see Sources), and all dialogue is newly written.

1.  **The Hunt for the Battledome** (October 2000). Sarkis, Ursulla and Buckley follow a brochure to Mystery Island and then to the undersea city of Maraqua, where Professor Chesterpot is hiding the Battledome. Dr. Sloth kidnaps him and sends out Mechachiazilla. King Kelpbeard calls up the real Chiazilla to beat it, and the Battledome opens to everyone. **Unlocks the karate dojo's Battledome mode.**

2.  **The Tyrannian Invasion** (March–May 2001). An earthquake in the Ice Caves opens the way to Tyrannia, and its armies attack in waves: Korbat scouts, Grarrl troopers, Skeith invaders, Chia bombers, and finally the Monoceraptor, beaten by a single Lupe. A voice, surely Sloth's, swears to return (the Grove's addition). This plays as a run of karate bouts in waves.

3.  **The Ski Lodge Mystery** (February–May 2001). Guests at the Terror Mountain Ski Lodge vanish one by one, and Sloth once owned the lodge. The culprit is Maverick, a robot. In the all-ages version guests are frozen, not killed, and are thawed at the end.

4.  **The Usurper** (July 2001). At the feast celebrating Sloth's defeat, King Coltzan III of the Lost Desert is poisoned. Five suspects. Players solve it from the meal clues: Princess Sankara did it to put Vyssa on the throne. This is a logic puzzle in the clue log.

5.  **Champions of Meridell** (July 2002–April 2003). Lisha and her friends go looking for her lost brother Jeran and reach Meridell just as the Darigan Citadel attacks to take back its stolen Orb. A bewitched Lord Darigan turns the Orb on Meridell, both sides join to stop him, and the Orb splits in two.

6.  **The Volcano Mystery** (September–October 2003). Mystery Island's islanders vanish. Five secret words free them and break a volcano's seal, and out comes Moltenus. A chant breaks the shaman controlling it.

7.  **The Battle for Meridell** (February–May 2004). Kass seizes the Darigan Citadel and invades. A bat-like creature hidden on Sally's farm turns out to be Lord Darigan. Lisha breaks a dancer's spell on King Skarl, Jeran falls from the Citadel and is caught by an Air Faerie, and Darigan defeats Kass.

8.  **The Curse of Maraqua** (March–June 2005). In New Maraqua, the seer Caylis is cast out as a curse. Pirate Captain Garin, her twin Isca and King Kelpbeard face Captain Scarblade's invasion. Scarblade is driven off, the sisters come home, and Garin sails away.

9.  **The Lost Desert Plot** (August–November 2005). Prince Jazan is refused by Princess Amira and drags Sakhmet into an undead dimension. The thief Nabile, secretly of royal blood, marries him, but the curse holds until Jazan destroys his undead father Razul with an ancient weapon the players build.

10. **The Tale of Woe** (October–November 2006). In Neovia, Bruno the Gelert buys Hissi Oil from the sinister Mr. Krawley to win Lily, and the oil turns the town into monsters. Gilly and Sophie the swamp witch brew the cure. Bruno stays changed and accepts it. **Not in the Learning Grove.**

11. **Journey to the Lost Isle** (May–June 2007). Professor Fairweather, Roxton Colchester, Lilian, Werther and the stowaway Scrap follow a pirate's diary to an uncharted island of giant Petpetpets and a Moach nest, and escape with one fruit as proof. **Unlocks a Lost Isle section.**

12. **Altador** (2007). Altador, a land lost to time, is found again. Players restore the constellations of its twelve council heroes to wake its memory and its king. This plays as a star-map puzzle. **Unlocks the Altador section and a Colosseum race cup.**

13. **The Return of Dr. Sloth** (January–March 2008). Sloth takes the Space Station. Gorix of the Resistance and young Cylara cross to Kreludor, where Sloth has turned the Grundos against each other for Kreludite. On his flagship Cylara uses the Space Faerie's token, and Sloth is trapped. **Completes the Neopia line.** Epilogue: the token drifts off into space, and the gate opens once to Lutari Island.

## Species

The 54 retro Neopets species become the Neo family, and the Vandagyre is optional. Each hatches from a Negg and gets a Grove type, which sets its starting grade lean. The retro set is the 54 species before the Vandagyre (2014). Draik, Krawk and Lutari are rare, and hatch only from special Neggs or a morphing potion.

| Species    | Looks like                         | Type   | Notes                                 |
|------------|------------------------------------|--------|---------------------------------------|
| Acara      | Cat-like, with shell-shaped ears   | Swim   | Loves water                           |
| Aisha      | Cat-like with four ears            | Normal |                                       |
| Blumaroo   | Kangaroo                           | Run    | Roo Island's people                   |
| Bori       | Armadillo-like digger              | Power  |                                       |
| Bruce      | Penguin                            | Swim   |                                       |
| Buzz       | Wasp or dragonfly-like bug         | Fly    | Tyrannian Buzzes in NP2               |
| Chia       | Fruit-headed little creature       | Normal | Chia Bombers, Chiazilla               |
| Chomby     | Small stegosaur                    | Run    |                                       |
| Cybunny    | Bunny                              | Run    |                                       |
| Draik      | Dragon                             | Fly    | Rare                                  |
| Elephante  | Elephant with tiny wings           | Power  |                                       |
| Eyrie      | Gryphon                            | Fly    |                                       |
| Flotsam    | Seal-like                          | Swim   |                                       |
| Gelert     | Greyhound-like dog                 | Run    | Bruno in NP10                         |
| Gnorbu     | Woolly, llama-like                 | Normal |                                       |
| Grarrl     | Tyrannosaur                        | Power  | Grarrl troopers in NP2                |
| Grundo     | Small alien                        | Normal | Sloth's former slaves, Kreludor       |
| Hissi      | Winged snake                       | Fly    |                                       |
| Ixi        | Goat-like                          | Run    |                                       |
| Jetsam     | Shark                              | Swim   |                                       |
| Jubjub     | Fluffball on two feet              | Run    |                                       |
| Kacheek    | Squirrel-fox                       | Normal |                                       |
| Kau        | Cow                                | Normal |                                       |
| Kiko       | Round, with a plaster on its head  | Swim   | Kiko Lake                             |
| Koi        | Fish                               | Swim   |                                       |
| Korbat     | Bat                                | Fly    | Korbat scouts in NP2                  |
| Kougra     | Tiger                              | Power  |                                       |
| Krawk      | Crocodile                          | Power  | Rare. Krawk Island                    |
| Kyrii      | Weasel-like, with a mane           | Normal |                                       |
| Lenny      | Long-legged bird                   | Fly    |                                       |
| Lupe       | Wolf                               | Run    | Jeran. Beat the Monoceraptor          |
| Lutari     | Otter                              | Swim   | Rare. Lutari Island                   |
| Meerca     | Meerkat-like, with a huge tail     | Run    | Meerca Chase                          |
| Moehog     | Warthog with a mohawk              | Power  |                                       |
| Mynci      | Monkey                             | Run    |                                       |
| Nimmo      | Frog                               | Swim   |                                       |
| Ogrin      | Stocky, horned                     | Power  |                                       |
| Peophin    | Horned dolphin, unicorn of the sea | Swim   |                                       |
| Poogle     | Striped, floppy-eared              | Run    | Poogle Racing                         |
| Pteri      | Bird                               | Fly    |                                       |
| Quiggle    | Frog-like, upright                 | Swim   |                                       |
| Ruki       | Bug                                | Normal |                                       |
| Scorchio   | Dragon                             | Fly    |                                       |
| Shoyru     | Small winged dragon                | Fly    |                                       |
| Skeith     | Big, lazy dragon                   | Power  | Skeith invaders in NP2                |
| Techo      | Lizard                             | Run    | Techo Mountain                        |
| Tonu       | Rhino-like, with a mane            | Power  |                                       |
| Tuskaninny | Walrus                             | Swim   |                                       |
| Uni        | Winged unicorn                     | Fly    | Meridell's mounts in NP7              |
| Usul       | Squirrel with a bow tail           | Normal |                                       |
| Vandagyre  | Owl                                | Fly    | 2014, outside the retro set. Optional |
| Wocky      | Cat-lion                           | Normal |                                       |
| Xweetok    | Chipmunk-ferret                    | Run    |                                       |
| Yurble     | Bear-hedgehog                      | Normal |                                       |
| Zafara     | Big-eared feline                   | Normal |                                       |

## Paint brushes and colour changes

Colour is the Neo family's dress-up system. A paint brush permanently changes a Neo pet's colour, and the colour carries through rebirth the same way a Nubbin's egg colour does today.

- **Hatch colours:** Red, Blue, Green and Yellow.

- **Classic paint brush colours:** Baby, Brown, Camouflage, Checkered, Christmas, Cloud, Darigan, Desert, Disco, Electric, Faerie, Fire, Ghost, Glowing, Gold, Grey, Halloween, Ice, Invisible, Island, Maraquan, Orange, Pastel, Pink, Pirate, Plushie, Purple, Rainbow, Royal, Shadow, Silver, Skunk, Snow, Speckled, Split, Spotted, Starry, Strawberry, Striped, Tyrannian, Usuki, White and Zombie.

- **Special colours:** Mutant, from the Lab Ray only. Jelly, from Jelly World, which doesn't exist.

- **Later colours, outside the retro set:** Biscuit, Candy, Dimensional, Elderly, Eventide, Maractite, Marble, Oil Paint, Origami, Polka Dot, Quiguki, Relic, Sketch, Stealthy, Steampunk, Swamp Gas, Toy, Transparent, Valentine, Water, Woodland, Wraith and 25th Anniversary. Optional.

**Ways to change colour or species**

- **Paint brushes.** Single-use items from shops, quests, Expeditions and lucky finds. The rarest (Faerie, Fire, Gold, Rainbow) come only from quests or the Hidden Tower.

- **The Rainbow Pool.** A gallery of every species in every colour. Colours you have used light up, and the rest show as silhouettes, like the Collection book.

- **The Lab Ray.** Found by collecting the four pieces of the Secret Laboratory Map. Each Neo pet can be zapped once, ever; rebirth does not reset it. The ray randomly changes its colour (Mutant is possible), its species, or a stat, or does nothing at all.

- **Morphing potions** from Kauvara's shop change species and colour together. They are the only way, besides rare Neggs, to get a Draik, Krawk or Lutari.

- **The Fountain Faerie.** One quest, once: she paints a pet any colour you choose.

- **Petpet paint brushes** recolour petpets the same way.

## Items

Neopia adds 12 item categories, most of which slot into systems the game already has.

| Category                | Retro examples                                                                                  | In the Grove                                                                                            |
|-------------------------|-------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------|
| Omelettes and jellies   | Giant Omelette slices in many flavours; jellies in every colour, Green Jelly the rarest         | Food. An omelette slice fills hunger more than fruit, and a jelly less                                  |
| Other food              | Grundo's Café space food, Happy Valley ice cream, Lost Desert, Tyrannian and Faerie foods       | Food with small stat leans by land, like fruit flavours                                                 |
| Neggs                   | Plain, Faerie, Fire and Ice Neggs, and rarer kinds                                              | Neo family eggs. Special Neggs hatch a rare colour or a rare species                                    |
| Codestones and dubloons | Mystery Island codestones; Krawk Island dubloon coins                                           | Training currencies for the two gyms, which raise karate stats                                          |
| Petpets and petpetpets  | Babaa, Doglefox, Kadoatie, Warf, Mortog, Feepit, Noil, Spardel, Angelpuss, Meowclops, Puppyblew | Small companions that ride on a Nubbin or Neo pet, with idle animations. Petpetpets ride on the petpets |
| Battle items            | Ghostkerchief, snowballs, Scroll of Knowledge, Downsize!, Thick Smoke Bomb                      | Single-use karate items in Battledome mode                                                              |
| Healing and medicine    | Healing potions; Pharmacy cures for Neomonia and the Sneezles                                   | Optional mild sickness after a bad Expedition, cured at the Pharmacy. No death                          |
| Toys and plushies       | Usuki dolls, Grundo plushies, balls and tops                                                    | Toys Nubbins play with, joining the existing toys                                                       |
| Books                   | Brightvale scrolls, Neopian Library books                                                       | Reading raises intelligence, a new hidden stat used by the Wise Old King and quizzes                    |
| Collectibles            | Stamps, the Neodeck trading cards, Usuki collections                                            | New Collection book pages                                                                               |
| Neohome items           | Furniture of every land's style                                                                 | Decorations for the cottage and the sections                                                            |
| Lucky items             | Scratchcards from the Lost Desert and Ice Caves, lottery tickets                                | Shells only, no stake. Not in the Learning Grove                                                        |
| Hidden Tower rarities   | The rarest paint brushes and battle items                                                       | The rare-item shop, priced in Shells, one of each                                                       |

## Freebies and dailies, adapted

Each classic daily becomes either a one-time event with a fixed prize or a place you can use without limit. Nothing is once a day, once per visit or reset by leaving, and nothing is lost by skipping.

| Freebie            | Where                                                                                              | Classic version                                                  | Grove version                                                                                |
|--------------------|----------------------------------------------------------------------------------------------------|------------------------------------------------------------------|----------------------------------------------------------------------------------------------|
| Giant Omelette     | Tyrannian Plateau                                                                                  | Take a slice until it's gone for the day                         | Unlimited slices, one at a time; it never runs out (Fire Faerie's quest needs one)           |
| Giant Jelly        | Jelly World                                                                                        | One jelly a day                                                  | One-time: the Official leaves one jelly the day you finish the Neopia line (NQ32)            |
| Tombola            | Mystery Island                                                                                     | Free raffle, mostly booby prizes                                 | One-time: one ticket, one fixed prize. Not in the Learning Grove                             |
| Fruit Machine      | Lost Desert                                                                                        | One spin a day                                                   | One-time: one spin, one fixed prize. Not in the Learning Grove                               |
| Coltzan's Shrine   | Lost Desert                                                                                        | Random blessing, often a stat level                              | Once per Neo pet, ever (rebirth does not reset it), like the Lab Ray                                                  |
| Snowager           | Terror Mountain Ice Caves                                                                          | Sneak in while he sleeps for treasure; he may wake and blast you | One-time: one sneak, one prize, ever (NQ31)                                                  |
| Healing Springs    | Faerieland                                                                                         | Free healing                                                     | Free healing, any time                                                                       |
| Wheels             | Faerieland (Excitement), Tyrannia (Mediocrity), Brightvale (Knowledge), Haunted Woods (Misfortune) | Timed prize wheels                                               | One-time: one spin of each wheel, one fixed prize. Not in the Learning Grove                 |
| Underwater Fishing | Maraqua                                                                                            | One cast a day, mostly junk                                      | Unlimited casts, no prizes beyond fish; fishing skill grows                                  |
| Anchor Management  | Krawk Island                                                                                       | Fight off the Krawken                                            | One-time, one fixed prize                                                                    |
| Deserted Tomb      | Lost Desert                                                                                        | A trapped tomb run                                               | One-time, one fixed prize                                                                    |
| Meteor Crash Site  | Kreludor                                                                                           | Hourly tries for a prize                                         | One-time, one fixed prize                                                                    |
| Money Tree         | Neopia Central                                                                                     | Players leave items, others take them                            | Neighbourhood gifts you leave for other Keepers through share codes                          |
| Soup Kitchen       | Neopia Central                                                                                     | Feeds hungry pets if you're broke                                | Feeds every hungry pet if you have under 10 Shells                                           |
| Advent Calendar    | Happy Valley                                                                                       | A door a day in December                                         | Left out: a door a day is a calendar timer                                                   |
| Bank interest      | Neopia Central                                                                                     | Daily interest                                                   | Left out: interest is a timer                                                                |

## Games Room classics

These 20 classic games become minigames. Each has a trophy for a high score, and none has a daily play limit.

| Game                              | Original                                       | Grove minigame                                              |
|-----------------------------------|------------------------------------------------|-------------------------------------------------------------|
| Meerca Chase                      | Snake-style chase collecting neggs             | A Run Nubbin snakes around the Grove field collecting fruit |
| Ice Cream Factory                 | Catch falling scoops                           | Catch fruit falling from shaken trees                       |
| Hasee Bounce                      | Bounce higher and higher                       | A Fly Nubbin bounces up the cliff tiers                     |
| Kass Basher                       | Launch Kass as far as you can                  | Launch a scarecrow Kass                                     |
| Faerie Bubbles                    | Pop matching coloured bubbles                  | Match-colours puzzle. Learning Grove friendly               |
| Extreme Herder                    | Herd petpets into a pen                        | Herd strays into the nursery                                |
| Tyranu Evavu                      | Higher-or-lower cards                          | Card game at the stall                                      |
| Cheeseroller                      | Roll a cheese down a hill                      | A race course: the cheese is the runner                     |
| Snowmuncher                       | Ski down, eat snowballs                        | Snow-day sledding                                           |
| Destruct-o-Match                  | Match-and-clear puzzle                         | Puzzle with Grove tiles                                     |
| Typing Terror                     | Type words to shoot invaders                   | Typing game. Learning Grove letters for ages 5–6            |
| Cliffhanger                       | Guess the phrase letter by letter              | Word guessing. Learning Grove friendly                      |
| Dice-a-Roo                        | King Roo's dice                                | Dice game on Roo Island, for points and a trophy only       |
| Sakhmet Solitaire and Pyramids    | Card solitaire                                 | Two solitaire games                                         |
| Grumpy Old King and Wise Old King | Build a joke or a wise saying from word pieces | Phrase-builder; the king laughs or groans                   |
| Kiss the Mortog                   | Pick which Mortog is a prince                  | Luck game in Meridell, for a trophy only. Not in the Learning Grove |
| Poogle Racing                     | Pick a Poogle to win                           | Your Nubbins race the Poogles. No bets; a trophy for a win  |
| Bilge Dice                        | Pirate dice                                    | Pirate dice on Krawk Island, for points and a trophy only   |
| Gormball                          | Pass the water balloon before it pops          | Party game with up to four Nubbins                          |
| Snow Wars                         | Battleship-style snowball fight                | Strategy game in Happy Valley                               |

Scorchy Slots and the other wagering games are left out. Nothing here takes a stake. The Fruit Machine, the Wheels, the Tombola, Kiss the Mortog and the lucky items stay out of the Learning Grove.

## Quests, characters and events

**Quests (each one finite, with no endless request loop)**

- **Faerie Quests.** Each faerie (Fire, Water, Air, Earth, Light, Dark, Space, Battle, Snow and the Fountain Faerie) asks once for one item and gives one stat blessing. Ten quests in all.

- **Illusen or Jhudora.** The two rival faeries each offer a quest chain, and you can finish only one. Your choice sets which faerie's colours appear in your sections.

- **Kitchen Quests** on Mystery Island and **Edna's Quests** in the Haunted Woods: a fixed set of five each, with a cookbook page or a potion as the reward. Edna's grog is pirate pepper sauce, so nothing in Neopia is boozy.

- **The Brain Tree and the Esophagor.** One quest each: the Brain Tree asks for two lost memories, and the Esophagor wants a meal it remembers from life.

- **The Turmaculus.** Wake him once with the right petpet for a rare petpet paint brush.

**Characters**

- **Rulers:** Queen Fyora, King Skarl, King Hagan, Lord Darigan, King Kelpbeard, Princess Amira, King Coltzan III, King Altador, King Roo.

- **Villains:** Dr. Sloth, Kass, Captain Scarblade, Prince Jazan and Razul, Mr. Krawley, Eliv Thade, Count Von Roo, Balthazar the faerie-catcher.

- **Faeries and mystics:** Jhudora, Illusen, the Fountain, Space and Snow Faeries, Jhuidah, the Island Mystic, Edna, Kauvara.

- **Heroes:** Jeran, Lisha, Garin, Isca and Caylis, Nabile, Gilly and Sophie, Gorix and Cylara, Roxton Colchester.

- **Monsters:** the Snowager, the Turmaculus, the Esophagor, the Brain Tree, the Monoceraptor, Chiazilla.

**Features and events**

- **The Neopian Times.** An in-game newspaper reporting your Grove's events, written once per chapter or plot.

- **The Battledome.** The karate dojo's Battledome mode: battle items, weapons and challengers from every land.

- **Neohomes.** A Neopia-style cottage interior to decorate.

- **Avatars and trophies** join the existing badges.

- **The Altador Cup.** A one-time Colosseum race cup unlocked by NP12, not a yearly event.

- **Seasonal events.** The Neopets birthday on 15 November, the Faerie Festival, the Day of Giving and Halloween. Left out: calendar events rotate content, which the no-repeatable-chores rule forbids.

- **Economy.** The bank, Trading Post, Auction House, Stock Market and player shops belong with the multiplayer plan and are left out until there is a server.

## Sources

Plot summaries, the colour list, the species list and the freebie list come from these pages. Land features, items, quests and Games Room details are from general knowledge of classic Neopets, so check names before they ship.

- [The Book of Ages: Hunt for the Battledome](https://bookofages.jellyneo.net/events/hunt-for-the-battledome)

- [The Book of Ages: Tyrannian Invasion](https://bookofages.jellyneo.net/events/tyrannian-invasion)

- [The Book of Ages: Ski Lodge Murder Mystery](https://bookofages.jellyneo.net/events/ski-lodge-murder-mystery)

- [The Book of Ages: Usurper](https://bookofages.jellyneo.net/events/usurper-plot)

- [The Book of Ages: Champions of Meridell](https://bookofages.jellyneo.net/events/champions-of-meridell)

- [The Book of Ages: Volcano Mystery](https://bookofages.jellyneo.net/events/volcano-mystery)

- [The Book of Ages: Battle for Meridell](https://bookofages.jellyneo.net/events/battle-for-meridell)

- [The Book of Ages: Curse of Maraqua](https://bookofages.jellyneo.net/events/curse-of-maraqua/)

- [The Book of Ages: Lost Desert Plot](https://bookofages.jellyneo.net/events/lost-desert-plot)

- [Neopets Wiki: Tale of Woe](https://neopets.fandom.com/wiki/Tale_of_Woe)

- [The Book of Ages: Journey to the Lost Isle](https://bookofages.jellyneo.net/events/journey-to-the-lost-isle)

- [The Book of Ages: Return of Dr. Sloth](https://bookofages.jellyneo.net/events/return-of-dr-sloth)

- [Neopets Wiki: Colour](https://neopets.fandom.com/wiki/Colour)

- [TV Tropes: Neopets species](https://www.tvtropes.org/pmwiki/pmwiki.php/Characters/NeopetsSpecies)

- [StrategyWiki: Neopets freebies](https://strategywiki.org/wiki/Neopets/Freebies)

The Altador plot (NP12) is from memory, because its Book of Ages page didn't load.

=== END PART G ===

## Part H. Avatar quests (Q46–Q65) and the full script content pack

### Avatar: The Last Airbender quests

Optional, one-time fun quests from Avatar: The Last Airbender (2005–2008). Audience: all
(they appear in the Learning Grove too, with the approved quotes swapped for original lines
via `childLines`). They never set campaign flags. Rewards are cosmetics or features. Like the other fun quests, they never trigger during Chapters 9–11. They play in order: Q46 opens the line (every later quest requires it), Q56 introduces Bao (Q55 and Q64 require it), and Q64 brings Kaito into the group (Q49 and Q55 require it).

In-game names (original; `basedOn` gives the source character):

| In-game name | Based on | Notes |
| --- | --- | --- |
| Pemba | Aang | Cheerful air-monk boy with an arrow tattoo, rides a sky bison |
| Nalu | Katara | Waterbender, kind, bossy when it matters |
| Tuk | Sokka | Sarcastic, plans everything, loves his boomerang and meat |
| Bao | Toph | Blind earthbender, tiny, blunt, champion wrestler |
| Kaito | Zuko | Banished prince, awkward, trying to be good |
| Uncle Tenzo | Iroh | Tea-loving retired general, kind, full of proverbs (write NEW proverbs) |
| Puffin | Appa | A giant six-legged flying sky bison |
| Lumi | Momo | Winged lemur |
| The cabbage merchant | Cabbage merchant | Keeps losing his cart |
| King Rumbold | Bumi | Mad old earth king who laughs like a donkey |
| Sumi | Suki | Leader of the fan-warriors |
| Master Pian | Piandao | Sword master |
| Aunt Wen | Aunt Wu | Fortune teller who reads cloud shapes and bones |
| The Ember Bay Players | Ember Island Players | A terrible theatre troupe |

Approved quotes (use exactly, then add childLines swaps): "My cabbages!" (Q46),
"Flameo, hotman!" (Q49), "It's the quenchiest!" (Q51), "Hello, Zuko here." (Q64) is adapted to "Hello, Kaito here.", an original line with no
childLines swap.

No song lyrics: the Cave of Two Lovers song and "Leaves from the Vine" are not used.
Q47 gets an ORIGINAL silly nomad song (4–6 short lines).

| # | Quest | Episode it's based on | What you do | Reward | Type |
| --- | --- | --- | --- | --- | --- |
| 46 | My Cabbages! | The cabbage merchant (running gag) | The cabbage merchant's cart is wrecked three times in one afternoon: by a racing Nubbin, a falling fruit and Pemba's glider. Help him rebuild it each time, and finally build him a cart that can't tip. | A cabbage cart decoration; a "My cabbages!" emote for the Keeper | Both |
| 47 | The Secret Tunnel | The Cave of Two Lovers | Singing nomads lead you into a dark cave maze. The crystals only glow when two friends hold hands: keep a Nubbin beside you to light the way out. | Glowing crystal decorations; a cave path between two sections | Both |
| 48 | The Great Divide | The Great Divide | Two feuding clans must cross a canyon together and argue about everything. Pemba invents a story about their ancestors to make peace; you help keep a straight face. | A canyon guide's hat; a rope bridge between sections | Both |
| 49 | Flameo, Hotman | The Headband | Kaito's strict school bans dancing. Help Pemba run a secret dance party in a cave: a rhythm timing game. | A red headband; a "Flameo" dance emote | Cosmetic |
| 50 | The Jasmine Dragon | Iroh's tea shop in Ba Sing Se | Uncle Tenzo opens a tea shop in the Grove. Brew three teas perfectly (timing), and serve a grumpy customer. | A tea stall decoration; jasmine tea item (a calm Nubbin naps on the spot) | Both |
| 51 | Cactus Juice | The Desert | Tuk drinks cactus juice in the desert section and starts seeing things. Keep him from wandering off while Nalu looks for water. | A cactus crop; cactus juice item (makes a Nubbin wobble happily for a minute) | Both |
| 52 | Puffin's Lost Days | Appa's Lost Days | Puffin the sky bison is lost and scared. Track him across the sections, win his trust with fruit, and ride him home. | Fast travel by sky bison | Feature |
| 53 | The Fan Warriors | The Warriors of Kyoshi | Tuk thinks fan-warriors are a joke until Sumi flattens him. He trains in their uniform, face paint and all. Train with them. | A fan and face paint cosmetic; a fan-block karate move | Both |
| 54 | The Sword Master | Sokka's Master | Tuk trains with Master Pian, who teaches that a sword is a part of you. Forge a blade from a fallen meteor. | A meteor sword cosmetic | Cosmetic |
| 55 | The Ember Bay Players | The Ember Island Players | A terrible play about your adventures. Watch it, and decide whether to boo, cheer or storm the stage. | Theatre masks; a "playbill" Photo mode frame | Cosmetic |
| 56 | Earth Rumble | The Blind Bandit | An underground wrestling night. Tiny Bao beats every giant. Enter your Power Nubbin and lose with dignity, or win. | A championship belt cosmetic; an arena decoration | Both |
| 57 | The Painted Lady | The Painted Lady | A river village is sick from factory sludge. Nalu dresses as a river spirit at night; you help her clean the river in secret. | A Painted Lady hat; a river-cleaning fish feature (the stream stays clear) | Both |
| 58 | The Fortuneteller | The Fortuneteller | Aunt Wen reads clouds and bones, and the whole village obeys her. Tuk refuses to believe. A volcano is about to blow and only the clouds can convince them. | Aunt Wen's bone reading becomes a new service at the fortune teller | Feature |
| 59 | The Waterbending Scroll | The Waterbending Scroll | Pirates sell a stolen scroll. Nalu "borrows" it, pirates chase you down the river. | A water-whip karate move for Swim Nubbins | Feature |
| 60 | The Winged Lemur | The Southern Air Temple | A winged lemur keeps stealing your fruit. Chase it through the temple ruins and make friends. | A winged lemur petpet | Cosmetic |
| 61 | Avatar Day | Avatar Day | A village puts Pemba on trial for something a past Avatar did centuries ago. Find the evidence in the old records and clear his name. | A festival mask; a "Pemba Day" one-time festival in the Grove | Both |
| 62 | Penguin Sledding | The Boy in the Iceberg | Pemba meditates too long and freezes into the pond. Break him out; he only wants to go penguin sledding. Race down the snow hill on penguins. | A penguin sledding minigame on snow days | Feature |
| 63 | King Rumbold's Challenges | The King of Omashu | The mad old king sets three silly challenges, then rides the city's mail chutes with you. | A mail-chute slide decoration; King Rumbold's laugh as an emote | Both |
| 64 | Hello, Kaito Here | The Western Air Temple | Kaito practises asking to join your group and keeps getting it wrong. Help him rehearse until he can say it. | An "awkward wave" emote | Cosmetic |
| 65 | The White Lotus | Pai Sho with Iroh | Uncle Tenzo teaches a quiet board game. Win a game, and he gives you a white lotus tile and a secret. | A Pai-Sho-style board decoration; a White Lotus tile badge | Both |

### The content pack (`grove-content-pack.zip`)

The pack contains complete scripts for every quest and story in this prompt, written as game data. In total:

- the campaign v2: 12 chapters, 8 endings, 123 scenes, 1,446 lines and about 22,600 words;
- 232 quests (including side stories S1–S22), 1,385 scenes, 10,667 lines and about 152,000 words;
- the Learning Grove's educational versions: 1,398 scenes in two bands, 1,860 lessons and about 237,000 words;
- the Hebrew and Japanese questlines: 12 quests, 84 base scenes, 159 vetted words with script primers;
- 6 readers with 261 readings;
- 25 result-line sets with 370 lines.

| File | Contents |
| --- | --- |
| `src/content/types.ts` | `Quest`, `QuestStep`, `Reward`, `Speaker`, `Reader`, `Reading`, `ResultSet`. Dialogue reuses `Line` / `Choice` / `Scene` from `src/config/story.ts` |
| `src/content/index.ts` | Re-exports every pack |
| `campaign-book1.ts`, `campaign-book2.ts`, `campaign-book3.ts`, `campaign.ts` | The campaign v2 (Part I): chapters 1–12, the Long Night, all eight endings and their epilogue variants, with `CAMPAIGN_NOTES` saying when each scene plays and `CAMPAIGN_FLAGS` listing every flag |
| `STORY-BIBLE.md` | The canon (Part I) |
| `side-stories-main.ts` | S2, S9 and S10, the three that change the campaign, plus their variant scenes and flags |
| `side-stories-fun.ts`, `side-stories-fun-2.ts` | S1, S3–S8, for fun and rewards only |
| `side-stories-new-1.ts` … `side-stories-new-4.ts` | S11–S22; `-new-3` holds S13 and S19 (they change the campaign) plus their variant and epilogue scenes |
| `lang-hebrew.ts`, `lang-japanese.ts`, `edu-lang-*.ts` | The Learning Grove-only Hebrew and Japanese questlines (Part K), with word lists and script primers |
| `EDU-STYLE.md`, `edu.ts`, `edu-*.ts` | The Learning Grove's language switch (Part J): sprout and reader versions of every story scene, with lessons |
| `quests-python.ts`, `quests-bean.ts`, `quests-sunny.ts`, `quests-avatar.ts` | Fun quests Q1–Q65, with `childLines` Learning Grove swaps |
| `neopia-line.ts`, `neopia-quests.ts` | NP1–NP13, and NQ1–NQ32 (faerie, Illusen or Jhudora, kitchen, Edna, Brain Tree, Esophagor, Turmaculus, Lab Ray map, Snowager, Jelly World) |
| `mv-ironman.ts`, `mv-cap.ts`, `mv-doom-ultron.ts`, `mv-moonknight-spawn.ts`, `mv-dragonball.ts`, `mv-toystory.ts`, `mv-endgames.ts` | All 93 Multiverse storylines, the Infamous Iron Man epilogue and E1–E6, with all three final endings |
| `readers.ts` | Readers: fortune teller Madame Zinnia (84 readings, to replace `FORTUNE_LINES`), Doctor Fettle (47, the doctor's numbers in words), Aunt Wen (30), Island Mystic (40), Wise Old King (30), Grumpy Old King (30) |
| `results.ts` | Result lines: race, karate, Expedition, lessons, evolution, rebirth, departure, memorial epitaphs, photo captions, every Neopia freebie and the Lab Ray |
| `STYLE.md` | The writing guide, for any future scripts |

How the scripts plug into the sim:

- **`check` strings.** These name the goals the sim must implement, written as `verb:object[:detail]`. Each file's `CHECKS` export lists the ones it uses.
- **`when` conditions.** Readers and result lines use `field:value` terms joined with `&` (for example `band:sun&type:run` or `trust:<15`). `readers.ts` and `results.ts` list every field they use in their header comments.
- **Branching.** Some scenes depend on a flag. The campaign and side stories use separate variant scenes, named by suffix (`c9-shard-reconciled`, `s10-foot-ms`), and their notes say when each plays. The endgames use separate steps whose ids name the branch.

### Continuity notes

All story conflicts are resolved in the story bible (Part I, "Conflicts resolved", 22 items). The
bible and the scripts agree. These notes are not about the story:

- **Mr. Popo:** the Dragon Ball notes ask for a respectful redesign, because his original look is a
  blackface caricature.
- **The plush Nubbin** (fun quest Q12) is used by Toy Story and E5. Its lines are skipped if the
  player doesn't own it.

## Part I. The story bible and the campaign v2

This is the heartfelt rewrite of "Hazel's Grove". It keeps the twelve chapters, the goal ids and
the eight ending ids, and it keeps the best-loved existing lines word for word.

- **Main plot:** one history (the Four Wardens, Cinder's Heartstone, Corvin's theft) that runs
  through every chapter. The climax is the Long Night vigil at the Wellspring.
- **Side stories:** 22 are scripted. Five change the campaign (S2, S9, S10, S13, S19); the other 17 are for fun. Part M adds S23–S31, three of which (S23, S26, S27) also change it: 8 of 31 in all.
- **Conflicts:** every story conflict found so far is resolved, 22 in all.
- **Scripts:** the full scripts are in the content pack: `campaign-book1.ts`–`campaign-book3.ts`,
  `campaign.ts`, and the seven side-story files (`side-stories-main`, `-fun`, `-fun-2`, `-new-1` to `-new-4`).

**CV1. Swap in the campaign v2** (backlog item, for Maor to approve; this also fixes B1):

1. Replace `CHAPTERS`, `SCENES` and `ENDINGS` in `src/config/story.ts` with `CAMPAIGN_CHAPTERS`,
   `CAMPAIGN_SCENES` and `CAMPAIGN_ENDINGS` from `src/content/campaign.ts`.
2. Add `CAMPAIGN_SPEAKERS` (Wisp, and `chorus` for the Lantern Song) to `SPEAKERS`.
3. Play the extra scenes and the variants exactly as `CAMPAIGN_NOTES` says. These are the
   mid-chapter scenes such as `c4-tale`, `c7-stillness` and `c8-ledge`, the flag variants, the
   Long Night sequence, and the ending epilogue order.
4. Make the sim changes in the bible: the new flags, the chapter 10 vigil step, the revised
   `endingFor`, and removing `UNDERSTUDY`, so that the Keeper choice is appearance only.
5. Wire S2, S9, S10, S13 and S19 next, and set `s4Done`, `s5Done` and `s8Reunited`, because the
   campaign reads them. A missing flag must fall back to the "never met / not started / walk alone"
   lines.
6. Add tests for `endingFor`, one per ending, and one each for the Long Night branches: Wisp,
   Moss returns, Moss doesn't, and kept stone. Include Hazel's Grove with "Open": bonded Sable,
   loved Moss, reconciled Corvin and `letThemGo` give `hazels-grove` and play
   `end-hazels-grove-open`.
7. Chapter 11 spans a few days. Hold `c11-close` until `threeFriends` is met and S9 has had its
   chance (`s9-ask` seen, or `keptStone`, or S9 is still on step 1 or 2 at the dusk after
   `threeFriends` is met), so it falls on the eve of chapter 12. In that last case `c11-close` plays
   that evening, `c11-gate` is skipped, and S9 jumps to its dawn gate scene before `c12-open`.
   Otherwise `c11-gate` plays (only if `s9-ask` was seen), then S10's night scene, then chapter 12.
8. Do CV6 (the engine backlog from the fix pass) alongside these steps.

=== BEGIN PART I ===

# Hazel's Grove — the story bible (v2)

This bible is the canon for the campaign and every side story. Where an older brief, script or
`story.ts` disagrees, this wins.

## The heart of it

"A story about slow hands." A grandchild inherits a garden and learns that patience is a kind
of strength. Under the cosy surface lies an old history, and an old cold.

Themes, in the order they matter:

1. **Love is a method.** Patience over force. Hazel's three rules.
2. **The grey stays, and can be loved.** Healing is not erasing. Sable is grey forever, and loved.
3. **Pity.** Spare the wretched one; it may turn the ending. (Wisp.)
4. **We are made of being remembered.** Mortality, fading, memorial flowers, the lantern gathering.
5. **Safe is not the same as well.** The temptation of control, of keeping them still so nothing
   can hurt them. (Cinder, Corvin, the Heartstone, Byte.)
6. **Stewardship.** What we keep, we keep for others. The gate sticks so you hear who comes back.

Tone: Tolkien's mix of homely comfort and ancient sorrow, told in this game's own voice. Dry, warm,
specific, funny, and, at the turning points, quiet and grave. Keep the deep register for Moss's
tales and the Long Night, and keep everyday scenes light. Don't write fake-archaic English; let the
deep register come from rhythm, restraint, concrete images and old names. Keep the beloved lines
from `story.ts` (listed at the end).

## The deep history (the Ages of the Grove)

1. **The Spring Age.** Behind the waterfall lies the Wellspring, a warm spring that never freezes.
   The first Nubbins came up out of it, each a small light. A Nubbin loved enough stops fading and
   becomes an Eternal. Eternals can speak a little, to those who sit still long enough.
2. **The Four Wardens.** Four Eternals kept the valley.
   - **Moss** (neutral): patience. He is the one who sits.
   - **Briar** (sun): joy. She laughed at everything, including dying.
   - **Hush** (moon): quiet, and the keeping of grief.
   - **Cinder** (sun burning hot): protection. She loved them most fiercely of all.
3. **The White Year.** A winter that would not end. Nubbins froze in the long grass. To save them,
   Cinder took a shard of ice from the Wellspring's frozen rim and made the **Heartstone**: whoever
   held it could gather every Nubbin's will into one hand and lead them all to shelter. It worked.
   The Nubbins came out of the winter alive, grey and still. Many never again moved of their own
   accord. "She made them safe by making them still."
4. **The Breaking.** Moss, Briar and Hush took the stone from Cinder and broke it into four shards.
   Each warden laid one beneath a lantern post, to keep it asleep with their warmth. Moss laid
   Cinder's own shard beneath the fourth post, by the long grass.
   - Pond lantern: Moss.
   - Stream lantern: Briar.
   - Old Wall lantern: Hush.
   - Long-Grass lantern: Cinder's shard, kept by Moss.

   Cinder walked into the snow and was not seen again. In the valley, "cinder-love" still means a
   love that holds too tight.
5. **The Long Peace.** Keepers came. Lantern Night became a festival: the gathering of people keeps
   the wardens remembered, and their remembrance keeps the shards asleep. The wardens faded one by
   one.
   - Briar went up the hill laughing. Her flower was the first memorial flower.
   - Hush chose to fade at the end of a long grief.
   - Moss remains, older than the trees. With each warden gone, the lanterns depend more on people
     showing up.
6. **Hazel's Forty Years.** Hazel came to the Grove young. Moss chose her: he sat beside her for a
   whole winter before he said a word. She was a young woman in a coat too big for her; she
   fidgeted, and was very bad at sitting still, but she never once asked him to speak. At the
   first thaw he looked up at her and said, "You'll do." She learned slow hands. She took one apprentice, Corvin Vale,
   clever, impatient, twenty-two and with nothing but months.
7. **The Theft, twenty-two years ago.** In Hazel's cottage, Corvin found the old clay tablets that
   tell of the Heartstone, and he worked out where the fourth shard lay.
   1. He dug it up from beneath the Long-Grass lantern.
   2. One winter he tried "the method" on Hazel's own Nubbins.
   3. Hazel caught him. That night he opened the gate, let buyers in, and left with Nubbins and the
      shard.
   4. Hazel wedged the gate the next morning, not to keep him out but "so I'd hear him if he ever
      came back".

   The Long-Grass lantern has not lit properly since; it only ever flickers.
8. **Now.** Corvin's Circuit wins everything. His garden is cold all year, and his runners are grey
   and quiet: the shard's cold stills them. Greys are spreading down the valley, and strays gather
   in the Hollow. Hazel's doctor gave her a year. She spent it in the Hollow, feeding the lost and
   following the cold to its source. She leaves a letter and two eggs.

## The Stillness (the shadow)

- **What it is.** Not a villain with a face but a temptation: the promise that if they are still,
  nothing can hurt them, and nothing can hurt you through them. A shard whispers one word, *safe*,
  and it works on fear.
- **What it does.** Its cold greys Nubbins. Grey (Shadow) is the scar, not the Stillness itself: a
  bonded grey, like Sable, proves the scar can be loved.
- **Shadows whisper.** The shard's echo gives grey ones a broken half-voice. This is why Wisp can
  speak, and why Sable once, at the end, can say one word.
- **Unmaking it.** A shard is unmade by returning it to the Wellspring on the longest night of the
  year, when the falls freeze and the spring opens.
- **Who can carry it.** Only a grey one can carry it close without being stilled, because it has
  already done its worst to them. The scarred are the bearers.
- **The last danger.** At the water's edge the bearer is tempted. The stone promises that if they
  keep it, nothing will ever hurt them again.

## Places

- **The Grove.** Hazel's cottage, the pond, the four lantern posts, the gate that sticks, the hill
  with its memorial flowers, and the long grass at the edge.
- **The Falls and the Wellspring.** Behind the waterfall, a warm spring in a cave of glittering
  rock. Only Marina knows the ledge path behind the falls; Hazel's swimming lessons for the
  Nubbins were taught by Marina.
- **The Hollow.** Past the falls, where the paths stop. Lost and grey ones gather there. Hazel's
  camp, and the warren of strays led by old Bramble (side story S8).
- **The Circuit and Corvin's garden.** Up the valley. Square, clean, silent, and cold in summer:
  frost on the railings in August.
- **Neighbours.** Marina's tide pools past the ridge, Dusty's cliff, Luna's night garden and
  Sparks's workshop. Keep the valley small and real.

## Cast and arcs

- **You** are Hazel's grandchild, a new Keeper with your own name. The Keeper choice on the title
  screen chooses your appearance only. The ten Keepers are always the valley's people, so the
  understudy system is gone. Your arc runs from inheriting a place to choosing what it will be; you
  learn slow hands, and you walk beside the bearer.
- **Hazel** is the absent heart, in the line of Gandalf and Bilbo: the letter, the notebook, her
  return at dawn, her farewell up the hill. Funny and made of steel. Her doctor gave her a year,
  and she had fourteen months. Her rules:
  1. Feed them before you feed yourself.
  2. Never, ever throw one.
  3. When you don't know what to do, sit down next to them and wait.
- **Moss** is the last warden: dry, tender, fading, the teller of old tales. His running joke with
  Byte is the shoelace. His sayings: "We are made of being remembered." "Safe is not the same as
  well."
- **Sable** is the grey one who hides, and Corvin's runaway. Her trust arc runs through 20, 45 and
  bonded. If bonded, she becomes the bearer at the Long Night. She never speaks, except once, at the
  water's edge.
- **Wisp** is the second grey: a thief with two voices, a hiss and a whisper, who covets warm
  things. He is spared or driven off in side story S2. If spared, his greed turns the ending.
- **Corvin Vale** is the fallen apprentice, in the line of Saruman and Boromir. He has carried the
  shard in his breast pocket for twenty-two years, and his hands are always cold. He means it when
  he says he wants them safe. He can be redeemed in S9, but only after the stone is unmade and he
  can feel again.
- **The ten Keepers** are the fellowship. Each holds a lantern at the Long Night.
  - **Fern**, next door: self-deprecating. Lost Bramble at the Midsummer race (S3, S8).
  - **Marina**, the tide pools: taught Hazel's Nubbins to swim and guards the ledge path behind the
    falls (S4).
  - **Sparks** (she/her), the fast ones and the lantern wiring: loud and kind (S3, S14).
  - **Clover**, the gentle ones. "The grey stays. You can only make it lighter."
  - **Pixel** (she/her), the lantern timing circuit: an inventor (S7, S21, and Pixel's Arcade).
  - **Luna**, the night gardener and Sable's first friend.
  - **Ember** lost Ash to Corvin. Prickly. "Ember doesn't like anyone" (S6).
  - **Byte**, the sceptic: numbers and shoelaces (S7).
  - **Dusty**, the digger, they/them: Fossil (S5, chapter 6).
  - **Nova**, the traveller: guide to the Hollow (S8). She has visited before; chapter 8 is the
    first time she asks for anything.

## Original songs and rhymes (use as written)

**The Lantern Song** (the whole valley sings it on Lantern Night)

> Light one for the pond where the first ones woke,
> light one for the stream and the laughing folk,
> light one for the wall where the quiet ones keep,
> and one for the long grass, and the ones who sleep.
>
> *Slow hands, warm hearts, the gate stuck fast —*
> *what's kept with love is kept to last.*
>
> When the White Year came and the grass went still,
> and the cold crept down from the Hollow hill,
> the old ones broke what the fierce one made,
> and they hid it low where the lanterns stayed.
>
> *Slow hands, warm hearts, the gate stuck fast —*
> *what's kept with love is kept to last.*
>
> Light one for the ones who went up the rise
> with the morning sun in their sleeping eyes;
> we are made of the ones who remember us here,
> so we gather, we gather, we gather each year.

**Cinder's rhyme** (a half-forgotten skipping rhyme the valley's children still chant)

> Cinder held them close and tight,
> kept them warm one winter night;
> when the morning came to call,
> they did not move at all.

## The year (one turn of the seasons)

The campaign runs from late spring to midwinter of a single year.

- **Before:** Hazel's doctor gives her a year, the autumn before. At the end of the winter she
  leaves for the Hollow.
- **Book One:** you arrive in late spring. Sable comes in early summer, and frost round her is
  already strange. Lantern Night falls near midsummer.
- **Book Two:** high summer at the Circuit, with frost on the railings in August. Rain on the hill
  at summer's end. Autumn dawns in chapters 7 and 8.
- **Book Three:** chapter 9 comes three days before the longest night, and the Long Night is
  midwinter. Hazel has had fourteen months against the doctor's twelve.
- **Chapter 11** spans a few days after the Long Night. Hazel sleeps a lot and wakes up for the
  good bits. The late side stories fit inside those days, and chapter 11 doesn't close until S9
  has had its chance.
- **Afterwards:** memorial flowers open in the spring, which is where the epilogues sit.

## The campaign: three books, twelve chapters

The chapter count, the goal ids (`sim/campaign.ts`) and the eight ending ids stay. New flags are
listed under "Sim changes".

### Book One: The Letter (Home)

1. **The Letter** (`firstHatch`). Arrival. The stuck gate: lift and push. The letter, the eggs and
   Fern. First hatch, first pet. On the hill, something small and grey watches.
   - Close: Sparks fixes the lantern posts. Three light; the Long-Grass lantern only flickers.
     "Never has, not properly. Not since before my time."
2. **Shells and Promises** (`feedTwice`). Marina, who taught Hazel's Nubbins to swim, and Sparks
   teach hand-feeding.
   - Close: Corvin at the gate. He doesn't lift and push. He waits, and the gate swings for him,
     which is unsettling. His hands are cold, and he touches his breast pocket.
   - The sell / refuse / consider choice is as before.
3. **The One Who Hides** (`sableTrust20`). Sable arrives in the night: Luna, the slow-or-grab
   choice, Clover's wisdom.
   - New: frost on the grass around Sable where she sleeps, in early summer.
   - Opens side story S2 (fruit goes missing).
4. **Moss Remembers** (`lanternsAndMoss`). Moss comes down and speaks.
   - Lantern Night: the valley sings The Lantern Song.
   - **Moss tells The Tale of the Four**, the history above, in one long, beautiful scene with
     choices to ask questions. He stops before the theft and will not say where the fourth shard
     went.
   - Byte's shoelace joke.
   - The Long-Grass lantern flickers and goes out. Moss: "Twenty-two years."
   - Opens S1 and S3.

### Book Two: The Cold (the wide world)

5. **The Circuit** (`winRace`). Ember's story of Ash. The race. Corvin's grey runners. Frost on the
   Circuit railings in summer. Corvin: "Mine run because the alternative is worse."
   - Opens S4 and S5.
6. **Rain on the Hill** (`talkDusty`). Fossil's farewell, with Dusty and the flower. "Love them
   harder because of it." Moss sits by the flower.
   - Moss: "That is fading done right. Not stilled. Let go."
   - If S5 is done, Fossil isn't introduced again: Dusty thanks you for the walk instead.
7. **What Fear Teaches** (`sableTrust45`).
   - Luna learns Sable came from Corvin's garden.
   - Frost in the Grove at dawn, gathered around the empty Long-Grass post.
   - **Moss explains the Stillness**: why the greys are grey, what the shard whispers, and that safe
     is not the same as well.
   - Sable leans her weight on your shin.
   - Opens S7. S2's decision falls in this chapter.
8. **The Hollow** (`notebook`).
   - Nova asks for help for the first time.
   - Marina leads the way along the ledge behind the falls, a first glimpse of the warm Wellspring,
     its rim rimed with frost. Then on into the Hollow.
   - Hazel's camp, the grey shapes in the trees, and the notebook. The existing pages stay, plus a
     new last page: "The cold comes from up the valley. I know where the fourth one went. I always
     knew. I hoped he'd bring it back himself."
   - Opens S8.

### Book Three: The Long Night

9. **Corvin's Garden** (`corvinChoice`). The confrontation keeps its three choices and the
   `corvin` flag (reconciled | bargained | forced).
   - In every route the source of the cold comes out: a dark, frost-furred shard in a tin in
     Corvin's breast pocket.
     - **Reconciled:** he gives it to you. His hand is blue. "I haven't been warm in twenty-two
       years."
     - **Bargained:** he throws it in with Ash's price. "Take it. It never worked on anything that
       mattered."
     - **Forced:** in the grey stampede he drops it, and you pick it up off the frozen ground.
     - **Collector route** (sold and never bought back): you come as his business partner, and he
       gives it to you as a gift. "With this, they'll never leave you."
   - The shard comes home with you in every route.
   - Close: all four shards are home. Moss is very faint, and frost spreads from the long grass.
     The longest night is three days away.
   - Opens S6 (only if Ash left the garden).
10. **The Long Night** (`lanternsAgain`, plus the vigil).
    1. The valley gathers. Every Keeper holds a lantern, and the four posts must burn until dawn.
       The cold comes in waves. This is the fellowship scene, and no one is gated by side stories.
    2. At the turn of the night the falls freeze and the Wellspring opens. Marina leads the way
       along the ledge.
    3. **The bearer:**
       - Sable, if bonded. She carries the shard in her mouth, as gently as an egg.
       - Otherwise Moss carries it himself.
    4. **The edge.** The stone whispers. You get the temptation choice:
       - **"Unmake it."**
       - **"Keep it. They'd never be hurt again."** Sets `keptStone`, which leads to the Collector
         ending.
    5. **If you choose to unmake it**, the bearer can't let go. The stone says *safe*, and Sable
       says her only word: "…safe." Then:
       - **If Wisp was spared** (S2: `wisp` is spared or sable): Wisp, who has wanted the warm stone
         all along, darts in, snatches it ("mine — warm — mine") and tumbles into the spring. The
         stone unmakes in a burst of warm light. At dawn Wisp is found asleep on the bank. He is
         grey, and for the first time he is not trembling. This is the eucatastrophe.
       - **Otherwise:** Moss takes the shard gently from Sable (or carries it in himself) and walks
         into the water. The stone unmakes. Moss comes back at dawn, thinner, only if he is loved
         (affection 40 or more at the start of chapter 10). Otherwise he doesn't come back, which
         leads to Moss Sleeps.
    6. **Dawn.** The Long-Grass lantern lights on its own for the first time in twenty-two years.
       Then a second lantern you did not light comes down the hill: Hazel. A very thin grey Nubbin
       sleeps in her arm; if Fern has found Bramble in S8 (`s8Reunited`), it is Bramble's youngest.
    - Keep Moss and Byte's shoelace exchange, and "the hands are slower. That's better, actually."
11. **Hazel** (`threeFriends`). Hazel's return: fourteen months. Talk to three Keepers, and sit by
    the pond.
    - Opens S10.
    - Corvin first comes to the gate in S9 (`s9-dusk`). On the eve of chapter 12 (`c11-gate`,
      the night of `s9-ask`) he is back at the gate and means to stand there till first light.
      Hazel's stance is the same in both: it's your gate now.
12. **Keepers** (`finalChoice`). Everyone gathers. The final choice: "A home" (keep) or "Open"
    (free). Then Hazel goes up the hill (S10 decides who walks with her; without S10 you walk her
    up alone), then the ending.

### Endings (same eight ids, revised rules; checked in this order)

1. **`collector`**: you sold your Nubbin in chapter 2 and never bought anyone back, or you kept the
   stone (`keptStone`).
2. **`empty-lantern`**: Sable is gone.
3. **`eternal-dawn`**: you raised an Eternal (`eternalRaised`) and Sable is bonded.
4. **`wild-grove`**: `freedByForce` and `letThemGo`.
5. **`hazels-grove`**: Sable bonded, Moss not faded and `corvin` = reconciled. With the final
   choice "Open" it plays the body variant `end-hazels-grove-open` ("There is no gate any more.
   Everyone who matters comes in anyway, and most of them still lift and push at the air where it
   was."). `wild-grove` is checked first, so forced and Open is still The Wild Grove.
6. **`moss-sleeps`**: Sable bonded and Moss faded. Moss has faded if his affection was under 40 at
   the start of chapter 10, or if he carried the stone in himself and was unloved.
7. **`shadow-keeper`**: Sable bonded and `corvin` is not reconciled.
8. **`long-road`**: the default.

Each ending's epilogue gains variant lines from the three side stories that matter:

- **Wisp (S2):** spared, Sable's choice, driven off, or never met.
- **Corvin (S9):** family (Sundays by the pond), guest, shut, or not started (an empty chair by the
  pond).
- **Hazel's walk (S10):** you, Moss, Sable or Corvin; secret or told.
- **The mill letter (S13):** kept and given (Corvin reads it on Sundays), kept but never given,
  burned, or left on Aldous's grave.
- **Cinder (S19):** forgiven or remembered. Either way a new red flower opens on the hill in the
  spring, and the Long-Grass lantern burns warm.

## The side stories: 8 of 31 change the campaign (26%), 23 are for fun

| # | Story | Opens → closes | Changes the campaign? | Hooks into the main story | Rewards |
| --- | --- | --- | --- | --- | --- |
| S1 | The Wardens' Walk | ch4 → ch9 | No | Moss walks you to the four posts for one extra memory each: Briar's laugh, Hush's grief, Cinder's last warm day, Moss choosing young Hazel. It deepens chapter 4's tale. | "The Tale of the Four" journal pages; lantern hat; Moss's acorn charm |
| S2 | Wisp | ch3 → ch7 (paid off in ch10) | **Yes** | Flag `wisp` = spared, driven or sable. Decides who unmakes the stone at the Long Night, and adds epilogue lines. | Wisp as a stray who can be recruited (if spared) |
| S3 | The Cycle | ch4 → ch11 | No | The Sun and Moon Keepers' feud. Corvin rigged the Midsummer race, which fits his method. Ends at a Lantern Moot in chapter 11. | Midsummer Cup race; Sun and Moon ribbons; "Moot-Keeper" title |
| S4 | The Wellspring | ch5 → before ch8 | No | Marina's dying tide pools and Corvin's dam above the falls. Marina shows you the ledge path early, so chapter 8 gains one line. | Deep-swim diving; a pearl-white Spring egg (rare colour); tide-pool decorations |
| S5 | Fossil's Last Walk | ch5 → ch6 | No | Fossil's three last wishes before chapter 6's farewell. Chapter 6 skips re-introducing Fossil if it's done. | Fossil's seed (a fossil-fern plant); Dusty's trowel; +1 Stamina grade from Fossil |
| S6 | Ash's True Name | after ch9, only if Ash left the garden | No | Ash is grey and won't answer to her name. Hazel's hatch register has her first sound. | Ember's whistle emote; Ash's ribbon; Ember friendship |
| S7 | Unverified | ch7 → before ch10 | No | Byte tries to engineer Null into an Eternal with timers and reinvents stilling without any shard. Moss's warning lands. | Byte's stopwatch charm; Pixel's lantern timer decoration; Null reborn |
| S8 | The Warren in the Hollow | ch8 → ch11 | No | Bramble leads the Hollow's strays, and Fern finds her. Her youngest is the thin grey Nubbin in Hazel's arm at dawn. | Warren strays you can recruit; Bramble's ribbon; a Hollow section |
| S9 | The Gate That Sticks | after ch10 → ch12 morning | **Yes** | Corvin, thawed once the stone is unmade, comes to the gate. Flag `corvinGate` = family, guest or shut. "Family" is offered if at least two of these are true: `corvin` = reconciled; S3 done; S6 done; S8 done; `millLetter` = kept (S13); `visitors` (S23). | Epilogue lines; Corvin's chair by the pond |
| S10 | Fourteen Months | ch11 → ch12 | **Yes** | Hazel's three last wishes. The third is "walk the four lanterns with me once". Flags `hazel` (secret or told) and `walk` (you, moss, sable or corvin). Decides the final scene and the second letter. | The final scene; Hazel's lantern |
| S11 | The Blight | ch5 → before ch8 | No | Ember wants to burn Fern's orchard before a blight spreads; you find the carrier beetle. Inspired by Warcraft III's culling. | Grafting knife; "Orchard Warden" title; ladybird petpets |
| S12 | The Hum | ch6 → before ch10 | No | A buzzing colony in Hush's wall that says "we"; one says "I". Inspired by StarCraft's swarm and shared mind. | Hum-hive decoration; hum-nectar; chorus emote |
| S13 | The Mill Cellar | ch7 → before ch12 | **Yes** | A four-level cellar crawl with loot tiers under Corvin's father's mill; the unsent letter. Flag `millLetter` = kept, burned or grave. Kept counts toward S9 family, is given in S9 (`s13-letter-given`) and adds epilogue lines. Inspired by Diablo. | Heirloom loot; the mill section and millwheel; Old Tobin's tales |
| S14 | Tilly's Tabletop | ch8 → before ch10 | No | Sparks's cousin runs a chaotic tabletop game whose dragon is Hazel. Inspired by Borderlands' Tiny Tina. | Tabletop decoration; cardboard dice; Game Mistress's Crown |
| S15 | Lucky Eggs | ch5 → before ch8 | No | A peddler's rigged Mystery Eggs; you tally the real odds. Inspired by Borderlands' charming villain and Diablo's gambler. | Honest egg stall and Odds Board; a sparkly egg; Jackpot the parrot |
| S16 | The Workyard | ch6 → before ch9 | No | Nubbins in hard hats at a cheerful sawmill; you build a Fair Roster. Inspired by Palworld. | Nubbin Jobs feature; hard hat; Fair Roster board |
| S17 | Nightjar | ch7 → before ch10 | No | A grieving owl steals eggs to keep them warm. Inspired by Ori and the Blind Forest. | Owl fledgling; night glide; feather cloak |
| S18 | The Grove Museum | ch6 → ch11 | No | Four wings, twelve true exhibits; what a valley chooses to remember. Inspired by Animal Crossing and Stardew Valley. | The museum; "Curator" title; magnifying glass |
| S19 | Cinder's Last Light | ch11 → before ch12's final choice (only if the stone was unmade) | **Yes** | Cinder's last ember on the high pass. "Are they safe?" "No. They're well." Flag `cinder` = forgiven or remembered; adds epilogue lines. Inspired by Warcraft's fallen guardian. | Cinder's ember; the snowfield section |
| S20 | Fort Night | ch11 → before ch12's final choice | No | A snow-fort war that ends as one shelter under the stars. Inspired by StarCraft and Warcraft as strategy games. | Snow-fort decoration; commander's hat; snowball launcher |
| S21 | CL-4NK | ch3 → before ch6 | No | Pixel's over-eager garden robot asks whether he is a friend or a tool. Inspired by Borderlands' little robot. | Clank as garden helper; Clank dance; lantern-part hat |
| S22 | The Climb | after ch8 → ch11 | No | Nova climbs the Tooth with her Worry. Inspired by Celeste. | Summit flag; the Tooth viewpoint; climbing boots |
| S23 | Three Visitors | ch9 close → ch10 (the three nights before the Long Night) | **Yes** | The wardens' echoes visit Corvin on the three nights he first spends without the shard. Flag `visitors`: a sixth S9 "family" condition; Corvin stands in the lane with a lantern during the vigil; an epilogue line. After *A Christmas Carol*. | Nightcap cosmetic; Lantern Night reel emote; "Three Nights" journal pages |
| S24 | The Adventure Book | post-game spring | No | Nova's atlas began as Hazel's list of places she meant to go. After *Up*. | Hazel's margin notes on every Atlas page; the Sunrise Shelf |
| S25 | Real | ch3 → ch8 | No | Hazel's knitted toy Nubbin; Moss as the Skin Horse explains what Real is: the lore behind Eternals (never a shortcut). After *The Velveteen Rabbit*. | Velveteen coat colour |
| S26 | The Walled Garden | ch6 → ch11 | **Yes** | Hush's locked garden behind the Old Wall; Linnet asks for a bit of earth. Flag `hushGarden`: Hazel's silent moment in the garden in chapter 12; in Moss Sleeps his flower's seed goes over the wall; an epilogue line. After *The Secret Garden*. | Hush's garden section; Linnet's bench |
| S27 | Some Nubbin | ch5 → before ch9 | **Yes** | Spindle the spider writes words in the frost on the Circuit railings. On the sold path she wins your Nubbin back (`boughtBack`); otherwise she frees a runner. After *Charlotte's Web*. | Spindle's daughters; a frost-web decoration |
| S28 | Please Look After This Nubbin | ch8 → ch11 | No | Parcel arrives with a tag in Hazel's hand, "For Byte. H." After *Paddington*. | Marmalade; Byte's softening |
| S29 | The Gates of Dawn | ch4 → ch8 | No | Marina and Dusty on the river; the night search for an otter kit. After *The Wind in the Willows*. | Rowing; the river section |
| S30 | What Sad Is For | ch6 → ch9 | No | After Fossil's farewell, one of Clover's Nubbins won't stop smiling. Hush's old job was keeping grief. After *Inside Out*. | Hush's memory page |
| S31 | The Great Gourd | ch7 (autumn) | No | A valley child waits all night in the long grass for the Great Gourd, and you wait with him. After *It's the Great Pumpkin, Charlie Brown*. | Gourd lantern |
The fun quests (Q1–Q95), Neopia, the Multiverse campaign, the Atlas and Pixel's Arcade are
separate and never write these flags. They may read Grove state to vary their own scenes.

## Conflicts resolved

1. **Swimming lessons.** Marina taught Hazel's Nubbins to swim, everywhere.
2. **Flag names.** `corvin` stays chapter 9's flag. S9 uses `corvinGate`.
3. **Endings.** The endings text and rules are rewritten above.
4. **Moss's threshold.** One rule: affection 40 or more at the start of chapter 10. No side story
   changes it.
5. **The understudy system.** Removed: the Keeper choice is appearance only, and the ten Keepers are
   always NPCs. This fixes bug B1 and the S3, S5 and S6 problems.
6. **S10's third wish.** Changed to "walk the four lanterns with me", so it no longer repeats chapter
   11's sit by the pond.
7. **The grey-Nubbin count.** Chapter 10 has no numeric count of grey Nubbins.
8. **Fossil.** Introduced once: in S5 if played, otherwise in chapter 6.
9. **Marina.** Nobody leaves the valley. S4 no longer sends Marina away.
10. **Wisp speaking.** Explained: Shadows whisper with the shard's echo.
11. **Moss and Hazel.** Moss is older than Hazel. S10's memory is Moss choosing young Hazel, not
    hatching.
12. **Dusty.** They/them everywhere.
13. **Nova.** She has visited before; chapter 8 is the first time she asks for help.
14. **The Heartstone.** It is main plot (chapters 4, 7, 8, 9, 10), not a side-story choice. S1 is
    lore only.
15. **Byte.** S7 uses no shard.
16. **The Long Night.** It is a fellowship vigil. No lantern is gated by side stories. This replaces
    feature F4's loyalty gating.
17. **Chapter 9.** No side-story options appear in chapter 9: S2's back way and S6's naming option
    are both removed.

18. **Timeline.** One year, late spring to midwinter (see "The year"). The chapter 1, chapter 3 and
    S2 seasons were fixed, and Hazel "left at the end of the winter".
19. **Bramble's youngest at dawn.** S8 finishes in chapter 11, so the dawn scene can't wait for
    `s8Done`. It reads `s8Reunited` instead, which S8 sets when Fern finds Bramble.
20. **S9 has started.** S9 sets `s9Started` on its first scene. Chapter 11's gate line reads it.
21. **Hazel's walk.** The walk lives in one place. S10's foot-of-the-hill choice only sets `walk`;
    the campaign scene `c12-walk-<walk>` plays the climb. Without S10, `c12-walk-alone` plays.
22. **The four posts.** Hazel names the posts only in S1 and in S10's third wish. In chapter 12 she
    touches each post and speaks only at Cinder's.

## Sim changes (for the implementer)

- **New flags:**
  - `keptStone` (bool)
  - `stoneBearer` (sable | moss)
  - `stoneUnmadeBy` (wisp | moss)
  - `mossReturned` (bool)
  - `wisp`
  - `corvinGate`
  - `hazel`
  - `walk`
  - `s1Done` through `s10Done`
  - `s8Reunited` and `s9Started`
  - `millLetter` (S13: kept, burned or grave) and `cinder` (S19: forgiven or remembered)
  - `s11Done` through `s31Done`
  - `visitors` (S23), `hushGarden` (S26); S27 writes the existing `boughtBack` and brings the sold
    Nubbin home (it closes before chapter 9 opens)
- **Chapter 10.** Add a vigil step after `lanternsAgain`: hold all four lanterns until dawn (a timed
  scene, no fail state), then the walk to the Wellspring. The temptation choice sets `keptStone`.
- **`endingFor`.** Follow the order above. `mossFaded` is affection under 40 at the start of chapter
  10, or Moss carried the stone in and `mossReturned` is false.
- **Remove the understudy.** Delete `UNDERSTUDY` and its use in `ui/dialogue.ts`. The title-screen
  Keeper choice only sets the player's sprite.

## Lines from `story.ts` to keep (verbatim)

"Lift and push." The letter and Hazel's three rules. "Don't be dramatic about it."
"Something small and grey watches from the top of the western hill…". Fern's "keeping the trees
alive, badly". Sparks's "Potential, Fern." Clover's "They're just carrying the thing that happened.
You can't take it off them. You can only make it lighter." Luna's "That's the whole trick. That's
all of it. Hazel would have liked you." Moss's "Eternals don't age. We fade. We are made of being
remembered…" Dusty's "Love them anyway. Love them harder because of it. That's the whole trade, and
it's a good one." Hazel's notebook pages. Corvin's "I never made it quicker. I only made it
quieter." Hazel's "A Grove isn't the Nubbins, love. It's the people who show up when the lanterns
are lit." "Told you. Love is a method." Clover's "Don't you dare call that nothing."

## Settled details (2026-10-14)

These were settled after the full review. They win over any older line.

- **Moss's first love.** She died long before the hill had flowers. When Briar's flower came up,
  Moss planted one for her beside it. Never say any flower is older than Briar's.
- **The Wellspring.** The water never freezes; only its rim froze, once, in the White Year.
- **Hazel's autumn.** She went up the valley and stood at Corvin's gate for an hour without
  knocking, then went back to her strays. By early autumn she had been feeding them "since the
  snow".
- **Ember** was fifteen when Hazel gave her the egg that became Ash.
- **Tilly** got a short note from Hazel, not a letter; only you got a letter.
- **Nova** has visited before, but never the Hollow's ring for months on end.
- **Ears.** Wisp's ear is torn. Bramble's folds over at the tip, and so does her youngest's.
- **Moss's flower** sits on the hill by the flat stone where he always sat.
- **Wisp** lives under the cottage step if spared.
- **Sable** is never a speaker except for her one word; her reactions are narrated.
- **The third rule** is quoted only where it lands.
- **Ratings.** The audience type is all / main / teen / adult:
  - teen (13+) and adult (18+) sit behind a content setting that is off by default;
  - the Multiverse and It's Always Sunny are adult;
  - Atlas A1, A3 and A4 are teen;
  - Neopia's war plots are main.
- **Saves and timers.** Other campaigns read Grove state and never write it; the Multiverse's E6
  uses a reflection of your Eternal. Nothing is once a day or once per visit.
- **Fun quests** never trigger during chapters 9–11.
- **Who can talk.** Nubbins and animals don't speak in the Grove's story, with these exceptions:
  - fun quests;
  - S12's hive chorus;
  - S18's Professor Delve and S15's clockwork parrot, who aren't Nubbins;
  - talking animals inside Atlas and Arcade worlds.
- **Names.** S26's girl is Linnet and S23's echo is Thimble.
- **Learning Grove.** Neopia and the Multiverse are not offered there.
- **The Remembering Tree** holds the Nubbins' stories; A7's ofrenda holds their photos.
- **Hazel's notebook** counts from the doctor's year ("Day 300-something").
- **Content setting.** It is called "Mature content", with the positions Off, 13+ and 18+, and Off by default.

=== END PART I ===

## Part J. The Learning Grove's language switch (educational versions)

**What Maor asked:** "educational mode should have a switch in the language to be as educational as
possible but blended into the fun story so it doesn't feel so much like 'work'."

**What's built (as data).** Every story scene in the campaign, side stories S1–S22 and the fun
quests (Monty Python, Mr. Bean, Avatar) has an educational version in two bands. It's Always Sunny stays
adults-only and has no educational version; Neopia and the Multiverse are not offered in the Learning Grove.

| Band | Ages | Who reads | Scenes | Lessons |
| --- | --- | --- | --- | --- |
| `sprout`, "Little Sprouts" | 3–6 | A grown-up reads it aloud, with prompts like "(Point to the red fruit.)" | 615 | 668 |
| `reader`, "Grove Readers" | 7–10 | The child reads it alone, with a tap-for-meaning glossary | 615 | 974 |

The story, characters, jokes and choices stay the same. The language changes, and lessons are
woven into what is happening:

- Sparks needs the lanterns counted before dusk.
- Moss wonders why the nights are getting longer, which leads to the Earth's tilt and the
  solstice.
- Marina explains why the tide comes in twice a day.
- The silly-walk ministry teaches balance.
- Mr. Tweed's armchair that won't fit on the cart teaches measuring.

Every lesson is diegetic, kind and never fails: three kinds of beat (ask, notice, do), wrong
answers shown gently, no timers, no penalties. In numbers:

- 1,642 lessons in all, 1,425 of them tagged to an approved standard: Head Start ELOF, CASEL,
  Common Core Maths and English, NGSS, C3. That is 92 distinct standards.
- 105 "think questions" with no single right answer: is safe the same as well, can someone who did
  wrong be trusted again, is Clank alive?
- The reader band adds about 700 glossary words.
- Hard things are handled the way good children's books handle them. Death is named plainly (never
  "sleeping") and followed by comfort. Hazel's illness is never named. The sprout band never
  offers a cruel choice: no selling, no grabbing Sable, no driving Wisp off, no keeping the stone.
  `defaultChoice` keeps the sim's flags working.
- Two fact-check passes reviewed every lesson and fixed 29 issues: arithmetic, tides, owl facts,
  fire and sun safety.

**Files:**

- `src/content/EDU-STYLE.md`: the rules and the approved standards list.
- `src/content/edu-*.ts`: 23 files.
- `src/content/edu.ts`: assembles them, with `EDU_CAMPAIGN`, `EDU_QUESTS`, `EDU_VARIANTS` and
  `eduSceneFor(band, sceneId)`.
- The types are in `types.ts`: `EduBand`, `Lesson`, `EduScene`, `EduQuest`, `EduCampaign` and
  `GlossaryEntry`.
- The rendered scripts are `script-book/20a`, `20b`, `21a` and `21b`.

**CV2. Wire in the language switch** (backlog item, for Maor to approve; do it after CV1):

1. **Title and settings.** Learning Grove gets a band picker: Little Sprouts (3–6), as now, plus
   Grove Readers (7–10). The grown-up area gets a "Story language: Learning / Standard" switch.
2. **Story in the Learning Grove.** Offer the campaign and the side stories, which today aren't
   offered there at all. The fun quests are offered too, except Sunny.
3. **Dialogue.** When a scene plays, look up `eduSceneFor(band, scene.id)`.
   - If it exists, play its lines and choices.
   - Apply the original scene's `set` flags.
   - Use `defaultChoice` for any choice the band leaves out.
   - Play each `Lesson` after line `after`:
     - `ask` shows options as big buttons; every option continues, and `best` gets a star.
     - `notice` is tap to continue.
     - `do` is a Grove action checked by its `edu:` check string.
4. **Journal.** Use the band's chapter and goal text.
5. **Reader glossary.** Underline glossary words; tap one to see its meaning.
6. **Sprout prompts.** Show bracketed grown-up prompts in a different style.
7. **Grown-up progress view.** Add lessons by domain and by standard, plus the `parentNote` lines
   ("Your child counted to ten, one finger for each friend").
8. **Tests.**
   - Every main scene in scope has an educational version in both bands. `content-check` already
     verifies this.
   - Flags are identical whichever band plays.
   - No sprout path reaches the Collector ending.

## Part K. Language questlines (Learning Grove only): Hebrew and Japanese

Maor asked for "a hebrew and japanese questline in educational mode to start learning the basics of
both languages". There are two six-quest questlines, offered only in the Learning Grove. Each is
fully scripted in three versions: base, Little Sprouts (3–6, read aloud) and Grove Readers (7–10).

| | Ori's Alef-Bet (Hebrew) | Hana's Hiragana (Japanese) |
| --- | --- | --- |
| Teacher | Ori (אוֹרִי, "my light"), 10, from Israel: football, stars, a terrible loser at board games | Hana (はな, "flower"), 10, from Japan: draws everything, races everyone, "not scared of frogs" |
| Link to the Grove | His savta and Hazel wrote letters for forty years | Her obāchan was Hazel's pen-pal too |
| Running gag | The Wobbler, a Nubbin who waves at "shalom" so hard it falls over | Dumpling, a Nubbin who copies whatever Hana does, badly (one bow, once, to the moon; never a habit) |
| Quests | LH1 Shalom, Ori! · LH2 Right to Left · LH3 Counting Plums · LH4 Colours of the Orchard · LH5 Savta's Letters · LH6 The New Year of the Trees (Tu BiShvat) | LJ1 Konnichiwa, Hana! · LJ2 The Hiragana Pond · LJ3 Counting Koi · LJ4 Colours and Lunchboxes · LJ5 Obāchan's Letters · LJ6 Floating Lanterns (Hana's family's tōrō nagashi for her ojīchan) |
| Words | 78 (greetings, numbers 1–10, colours, fruit, animals, family, feelings, nature) | 81 (the same topics, plus mealtime words) |
| Script | The 22-letter alef-bet with final forms, right to left; trace and write אוֹרִי | Three scripts explained; hiragana あいうえお, かきくけこ, は, な; write はな |

**What the child comes away able to do:** greet someone and say thank you, count to ten, name
colours, fruit, animals and family, and say how they feel. They also recognise how the script
looks and which way it runs, and in the reader band they read a few letters or kana and write
their teacher's name. Every word comes back at least three times, and the last quest of each line
is a review party.

**How accuracy was protected:**

- Writers could use only a vetted word list. That list covers spelling, niqqud, kana and kanji,
  Hepburn romanisation, a sound-alike for each word, and gender and politeness notes.
- Scripts checked every Hebrew and Japanese string against that list.
- A Hebrew reviewer made 9 fixes, among them a wrong gender form in sprout LH5 and "friend who's
  a boy" in place of "boy friend".
- A Japanese reviewer made 11 fixes. These include the claim that "kanji are drawings", which
  only some are, and "ie" (house) having the same sound guide as "iie" (no).
- Their reports list what a native-speaker recording session should confirm.
- Verified in review: Ori means "my light"; the alef-bet has 22 letters plus 5 final forms; Tu BiShvat and the Hepburn macrons are correct.

**Hard things:** Hana's ojīchan died when she was six. It's said plainly, and in LJ6 she floats a
lantern to remember him, as her family does at Obon. Tōrō nagashi is a Buddhist rite for the dead, so it is shown as Hana's family custom, which the player is invited to share, never as a game activity, a minigame or a reward. Hazel appears only as someone who used to write letters. Nothing in
either line sets campaign flags.

**Files:**

- `src/content/lang-hebrew.ts`: `LANG_HEBREW` and `HEBREW_COURSE`.
- `src/content/lang-japanese.ts`: `LANG_JAPANESE` and `JAPANESE_COURSE`.
- `src/content/edu-lang-{hebrew,japanese}-{sprout,reader}.ts`.
- The types are `VocabItem`, `ScriptChar` and `LanguageCourse`.
- `script-book/19a`–`19d`: the scripts, plus a word list and script primer for each language.

**CV3. Wire in the language questlines** (backlog item, after CV2):

1. **Offer them.** Show both lines in the Learning Grove only. Nova's postcard opens LH1 and LJ1.
2. **Fonts.** Add Noto Sans Hebrew and Noto Sans JP, or a textbook-style Japanese font such as
   Klee One for tracing.
3. **Text direction.** Set every dialogue line to `dir="ltr"`, never `auto`, with Hebrew runs
   isolated.
4. **Japanese text.** Mark Japanese text `lang="ja"` so kanji use Japanese glyph shapes. Don't let
   a line break inside a Japanese word.
5. **Tracing mini-games.** Hebrew traces right to left. Kana follow their stroke order.
6. **Word reactions.** Nubbins react to learned words: wave at shalom, bow at konnichiwa.
7. **Audio.** Every `VocabItem.audio` clip must be recorded by a native speaker. Don't use
   synthetic speech for these.
8. **Grown-up view.** Add a word list showing which words the child has heard and used.

## Voice-over (pipeline and samples)

- **Rule: only characters speak.** Stage directions are never read aloud. In audio they become timed beats carrying sound effects and ambience, and on screen they stay as text.
- **Hesitations.** The scripts use the single character "…" (U+2026). The pipeline treats "…" and "..." the same, as a hesitation; a line that is only "…" is a silent beat.
- **The player is not voiced.** Lines spoken by `you` stay on screen as text and become a short beat in audio, because the player's voice is never set.
- **Songs are music cues.** Lines whose speaker is `chorus` (the Lantern Song in `c4-close` and `c10-vigil`), together with Luna's sung lead-in line, are one music cue in `voiceover/script.json` (for example `"cue": "lantern-song"`), not voiced lines.
- **Pacing is explicit, because the voice model doesn't understand scenes.** In `voiceover/script.json`:
  - every line has the game's own `mood`, which sets speed, loudness, the pause before the line and the pauses between sentences;
  - sentences are voiced one at a time, so pauses are exact; "..." is a hesitation, and the last sentence lands slightly slower;
  - a line ending in a dash is cut off, and the next speaker overlaps it;
  - capitals mean emphasis;
  - beats last about as long as they take to read;
  - each cue can override speed, gain, before and after;
  - the piece is kept under `max_seconds` by tightening pauses first.
- **Pacing report.** Each run writes `pacing-report.txt`, which gives words per minute per line and flags lines that sound rushed or dragging.
- **Engine.** Kokoro (Apache-2.0) runs offline on the developer's machine. `make_voiceover.bat` sets it up on Windows. The output is a finished mix plus one WAV per line, ready to attach to dialogue in the game.
- **Samples.**
  - The opening, "The Letter" through Corvin's first visit, about 5:00.
  - The earlier `clank-voiceover-sample.mp3` is a robotic temp track and is superseded by this pipeline.
- **For release.** Use voice actors, or tune Kokoro per line with the pacing report. Hebrew and Japanese words are always recorded by native speakers.
- **Backlog item VO1.** Wire per-line WAVs to the dialogue box: play a line's clip when its `Line` is shown, and let a tap skip it. Stage directions stay silent text. Generate clips for every campaign and side-story line with the same script format.

## Part L. The Atlas: ten storylines from around the world (for Maor's review)

## The idea

Nova, the valley's traveller, brings home a battered atlas. Each of its pages holds a great story
from somewhere in the world. Stepping into a page takes you and your Nubbin inside that story.

Like the Multiverse campaign, the Atlas is a separate campaign with its own save. It may read
Hazel's Grove state to vary its own scenes, but it never sets Grove flags.

- **You are a guest, not the hero.** The story's own heroes keep their story. You and your Nubbin
  help, witness and choose at the edges.
- **The plots are adapted faithfully.** All dialogue is newly written, and no song lyrics are
  used.
- **Each line ends with a souvenir for the Grove** and a few cosmetics or features. Bookmarks
  join the lines into three optional Grove festivals (see the end).

| # | Storyline | Source | From | Quests | Audience | Learning Grove version |
| --- | --- | --- | --- | --- | --- | --- |
| A1 | The Brothers' Bargain | *Fullmetal Alchemist* (Hiromu Arakawa's manga; *Brotherhood* anime) | Japan | 20 | `teen` (13+) | No |
| A2 | The Monkey and the Monk | *Journey to the West* (16th-century novel), with its many films, comics and anime | China | 19 | `all` | Yes, softened |
| A3 | Forty-Nine Days | *Along with the Gods* (Joo Ho-min's webtoon; the two films) | Korea | 14 | `teen` (13+) | No |
| A4 | The Waterfall Prince | *Baahubali: The Beginning* and *The Conclusion* (Telugu and Tamil films) | India | 16 | `teen` (13+) | No |
| A5 | The Lion of Mali | *The Epic of Sundiata* (Mande oral epic; Will Eisner's graphic novel *Sundiata*) | Mali, West Africa | 14 | `all` | Yes |
| A6 | Seven Voyages | *Sinbad the Sailor* (*One Thousand and One Nights*; the Harryhausen films) | Arabia, Persia and the Indian Ocean | 16 | `all` | Yes, softened |
| A7 | The Marigold Bridge | *Coco* (Pixar) | Mexico | 12 | `all` | Yes |
| A8 | The Twelve Tasks | *The Twelve Tasks of Asterix* (Goscinny and Uderzo) | France and Roman Gaul | 14 | `all` | Yes |
| A9 | The Comet | *Comet in Moominland* (Tove Jansson) | Finland | 12 | `all` | Yes |
| A10 | The Heart of the Island | *Moana* (Disney) | Polynesia | 14 | `all` | Yes |

That is 151 quests in total, plus three festivals. `teen` pages are main game only, behind the
content setting that is off by default; `all` pages also have Learning Grove versions.

**Bench (swap any line for one of these):**

- *Spider-Man: Into the Spider-Verse* (USA, Afro-Latino Brooklyn)
- *Song of the Sea* (Ireland, selkie folklore)
- *Persepolis* (Iran, for older players)
- *Spirited Away* (Japan)
- *Kirikou and the Sorceress* (West Africa)
- *The Breadwinner* (Afghanistan)
- *Tintin* (Belgium)
- *Klaus* (Spain and Norway)

## A1. The Brothers' Bargain (Fullmetal Alchemist, Japan)

**Why it works:** this is the Grove's own theme at full strength. Two brothers try to undo a
death by force and pay for it. "Equivalent exchange" asks what anything truly costs. The
Philosopher's Stone is Cinder's Heartstone in another key: power made out of other people.

**Your role:** your Nubbin rides inside Al's armour, the way Al hides stray cats. You carry
messages, find clues, and stand with the brothers.

1. **The Gate.** A flashback: two boys, a chalk circle, a terrible price. Watch, but don't touch.
2. **Automail.** In Resembool, Winry rebuilds Ed's arm. Hand her the parts in order.
3. **The Prophet of Lior.** A false miracle-worker and a fake Stone. Expose him in front of his
   followers.
4. **The State Exam.** A flashback: at twelve, Ed becomes a "dog of the military". Do you help
   him study, or try to talk him out of it?
5. **Tucker's House.** A gentle dog and a dark secret. This one is played offscreen and handled
   with care; see the notes.
6. **Scar.** A scarred avenger hunts alchemists through East City. Survive the alley.
7. **Laboratory 5.** The Stone is made of lives. **Choice:** destroy the notes, or keep them as
   evidence. This pays off in Q16.
8. **The Phone Box.** A friend's last call. Investigate with grief in your hands.
9. **Rush Valley.** The mechanics' town. Winry finds her calling, and you help her deliver a baby
   in a storm.
10. **The Island.** The brothers' teacher once left them on an island for a month to learn a
    lesson. Live the lesson.
11. **The Prince of Xing.** Ling, Lan Fan, and May Chang with her tiny panda, who befriends your
    Nubbin.
12. **The Devil's Nest.** Greed, who wants everything, and his loyal crew.
13. **The Man Who Orphaned Her.** Winry learns that Scar killed her parents in the Ishval war.
    She faces him, and the gun is in her hand.
14. **Inside Gluttony.** A false Gate and a dark sea. Ed carries Envy's secret home.
15. **Briggs.** A northern fortress and its iron commander, and something tunnelling underneath.
16. **The Promised Day, Part 1.** Underground, the whole country is a transmutation circle. If
    you kept the Lab 5 notes in Q7, they are the proof that wins Briggs's soldiers over in time;
    if you destroyed them, Ed rebuilds them from memory, and it costs the night.
17. **The Promised Day, Part 2.** Mustang finds Envy. Hawkeye asks him not to become a monster.
    Do you speak up?
18. **The Eclipse.** The Dwarf in the Flask swallows a god.
19. **Al's Gift.** Al trades his soul to give Ed back his arm. Hold the line until it lands.
20. **Equivalent Exchange.** Ed gives up his alchemy, his own Gate, to bring Al home. He says
    he's still got his friends.

**Signature choices:**
- What to do with the Lab 5 notes (Q7, paid off nine quests later in Q16).
- Whether you speak at Winry's moment in Q13 and Mustang's in Q17.

**Rewards:**
- an automail-style Nubbin harness (cosmetic);
- a chalk-circle decoration;
- an "Equivalent Exchange" trading stall: trade two items for one you want, with fair rates.

**Care notes:** Tucker's chimera (Q5) is one of manga's darkest moments. Keep it offscreen and
implied, with no images. Combat is non-graphic. Audience `teen` (13+): main game only, behind
the content setting that is off by default. The quests follow the *Brotherhood* order (Lab 5,
episode 8; the phone box, 10; Rush Valley, 11; the island, 12; Winry and Scar, 22; Gluttony,
24; Briggs, 33).

## A2. The Monkey and the Monk (Journey to the West, China)

**Why it works:** this is the great pilgrimage story. A boastful, unstoppable Monkey King learns
humility on a long walk. It's funny, wild and kind, and it grew from a real 7th-century journey:
the monk Xuanzang's pilgrimage to India for Buddhist scriptures.

**Your role:** a "fifth disciple" who carries the luggage, and your Nubbin, who adores the
immortal peaches.

1. **Born from Stone.** A stone egg on the Mountain of Flowers and Fruit hatches a monkey.
2. **The Water-Curtain Cave.** He leaps the waterfall and becomes king of the monkeys.
3. **Lessons in Shape-Changing.** He learns the 72 transformations and the cloud somersault, and
   shows off.
4. **Havoc in Heaven.** The peach banquet: he eats the immortal peaches and drinks the elixir.
5. **Under the Mountain.** He bets the Buddha he can leap out of his palm, and loses. Five
   hundred years under the Five Elements Mountain.
6. **The Monk.** Tang Sanzang frees him. Then comes the golden headband that tightens when he
   misbehaves.
7. **The White Dragon Horse** (ch.15). At Eagle Grief Stream a dragon swallows the monk's horse.
   Guanyin turns the dragon, a prince under sentence, into a white horse, and he carries the monk
   from then on.
8. **The Stolen Robe** (ch.16–17). Greedy monks set fire to their own guest hall to steal the
   monk's sacred robe, and in the smoke the Black Bear spirit takes it. Monkey and Guanyin get it
   back.
9. **Pigsy** (ch.18–19). At Gao Village, Zhu Bajie, lazy, greedy and lovable, is unmasked as a
   farmer's unwanted son-in-law, and joins.
10. **Sandy** (ch.22). Sha Wujing of the River of Flowing Sands joins.
11. **The Ginseng Fruit.** The fruit is shaped like babies, and Monkey knocks down the tree in a
    temper. Put it right.
12. **The White Bone Demon.** She comes in three disguises, and only Monkey sees through them.
    The monk banishes him for "killing innocents". **Choice:** who do you believe?
13. **The Magic Gourd.** It traps anyone who answers to their name. Don't answer.
14. **Red Boy.** A child demon with unquenchable fire.
15. **The Two Monkeys.** A false Monkey with six ears. Even the gods can't tell them apart. If you
    believed Monkey in Q12, the monk asks you which one is his; if you believed the monk, Monkey
    asks you to tell him. You can't tell either, and saying so plainly is the right answer.
16. **The Flaming Mountains.** Borrow Princess Iron Fan's palm-leaf fan. She gives you a fake
    first.
17. **Cobweb Cave.** Spider spirits and silk traps.
18. **Vulture Peak.** At last the scriptures are received.
19. **The Eighty-First Hardship.** The scriptures fall in the river and a few pages stay stuck to
    the rock. Nothing in the world is quite complete, and that's all right.

**Signature choice:** Q12, trust what you see or what you're told. It pays off three quests later
in Q15. Every ending of the line reconciles the monk and Monkey. The quests follow the novel's
order (the horse in ch.15, the robe in ch.16–17, Pigsy in ch.18–19, Sandy in ch.22; the six-eared
macaque, ch.56–58, comes before the Flaming Mountains, ch.59–61).

**Rewards:**
- a golden-band hat;
- a cloud-somersault fast-travel feature, with a playful animation, usable any time;
- an immortal peach tree, cosmetic, whose fruit makes a Nubbin glow.

**Learning Grove version:** the real Xuanzang and the Silk Road, map-reading, Chinese animal
zodiac stories, and the Monkey King in shadow-puppet theatre.

**Care notes:** the Buddha and Guanyin appear as the novel presents them: wise and kind, never
mocked. Demons are fairy-tale spooky.

## A3. Forty-Nine Days (Along with the Gods, Korea)

**Why it works:** this may be the most heartfelt line in the Atlas. A firefighter dies saving a
child and must pass seven trials in 49 days, defended by three underworld guardians. It's about
a good person who still did things he regrets, and about a mother's forgiveness. It's drawn from
Korean folklore and the Ten Kings of the underworld.

**Your role:** your Nubbin is a lost soul-spark the guardians are also escorting. You help gather
evidence for each trial.

1. **The Fire.** A rescue, and a fall.
2. **The Three Guardians.** Gang-rim the leader, the fierce Haewonmak, and Deok-choon, who is
   kind.
3. **The Hell of Murder.** He's accused over a colleague's death. Find the truth.
4. **The Hell of Indolence.** Did he work too much, or too little? Was it for his family?
5. **The Hell of Deceit.** The letters he wrote to grieving families in other people's names.
   Were they lies, or kindness?
6. **The Hells of Injustice and Betrayal.** Two gates pass quietly. Ask why.
7. **The Storm.** A vengeful spirit, his younger brother Su-hong, tears through the underworld.
8. **The Base.** In the world of the living, uncover how Su-hong died.
9. **The Hell of Violence.** The brothers' old wound comes to trial.
10. **The Brothers' Trial.** Two souls, one judgement.
11. **The Hell of Filial Impiety.** The worst night of his life, and his mother.
12. **The Dream.** His mother, who can no longer speak, forgives him in a dream. Carry the message.
13. **Reincarnation.** He goes on to a new life.
14. **The Last Soul.** Gang-rim takes on Su-hong's case, and defies a king for it.

**Signature choice:** Q5, were the letters lies or kindness? Your answer is the argument you make
for him six quests later, at the trial of filial impiety (Q11), so the verdict scene plays your
way.

**Rewards:**
- a guardian's black-coat cosmetic;
- a "letters" feature, where Nubbins can leave notes for each other;
- a forgiveness lantern decoration.

**Care notes:**
- Suicide is part of the story. "The worst night" is, in the film, an attempted murder-suicide:
  he meant to end his sick mother's life and his own. The film also has a young soldier's suicide
  attempt in Su-hong's story. Both are named here for the team only; on screen, refer to them only
  as "the worst night" and "the night at the base", and never depict or explain them. Add a
  content note before Q11.
- Audience `teen` (13+): main game only, behind the content setting that is off by default.
- The afterlife is shown as the films show it, and no real religious practice is presented as
  fiction. The Ten Kings, the underworld guardians (*jeoseung saja*) and the 49 days come from Korean Buddhist and
  folk belief that people still hold: commission a Korean cultural adviser on the afterlife and
  folk religion before scripting.

## A4. The Waterfall Prince (Baahubali, India)

**Why it works:** this is operatic Indian epic cinema. A boy raised at the foot of a giant
waterfall climbs it and finds a kingdom, a captive queen mother, and the question the whole
country asked in 2015: why did Kattappa kill Baahubali?

**Your role:** you are a stranger in Mahishmati, and your Nubbin is the boy's first friend, who
climbed the waterfall beside him.

1. **The River's Gift.** A queen gives her life carrying a baby through the river, and Sanga,
   who lives by the waterfall, raises him.
2. **The Climb.** Shivudu climbs the waterfall again and again. Help him find the handholds.
3. **The Mask.** He follows a carved mask to Avanthika, a rebel warrior.
4. **The Chained Queen.** Devasena has been in chains in Mahishmati's courtyard for 25 years.
5. **The Statue.** The tyrant Bhallaladeva raises a giant statue of himself. A rescue under its
   shadow.
6. **The Revelation.** The loyal old warrior Kattappa recognises the boy's face: Baahubali.
7. **The Story Begins.** A flashback to Amarendra Baahubali and his rival cousin.
8. **The Kalakeya War.** A battle won by cleverness and compassion, not numbers.
9. **The Queen Mother's Word.** Sivagami, whose word is law.
10. **Kuntala.** Amarendra, in disguise, meets Princess Devasena.
11. **The Promise.** Sivagami promises Devasena's hand to the wrong son. One promise breaks
    everything.
12. **Exile of a King.** Amarendra chooses honour over the throne.
13. **The Order.** Kattappa, sworn to obey the throne, is ordered to kill the man he loves.
14. **The Truth.** Sivagami learns she was deceived, and lifts the baby high.
15. **Return to Mahishmati.** The son comes home.
16. **The Fire.** Devasena lights the pyre she promised 25 years ago.

**Signature choice:** Q13, Kattappa's duty against his love. You can't change it, but you choose
what you say to him afterwards. Three quests later, at the pyre (Q16), he answers it: the words
he says to the returning son are the ones you gave him.

**Rewards:**
- a waterfall-climb feature (a new climbing section at the Grove falls);
- Devasena's bow (cosmetic);
- a Mahishmati banner decoration.

**Care notes:** battle violence stays heroic, not graphic. Bhallaladeva's end happens offscreen.
Avoid caricature, and present the kingdoms as the films' fiction, not as history. Audience
`teen` (13+): main game only, behind the content setting that is off by default.

## A5. The Lion of Mali (The Epic of Sundiata, West Africa)

**Why it works:** this is real history wrapped in legend. A boy who couldn't walk grows up to
found the Mali Empire in the 13th century. The story has come down through centuries of griots,
hereditary storytellers and musicians, and it's about patience, exile and coming home.

**Your role:** you are an apprentice to the griot Balla Fasséké. Your Nubbin learns the balafon,
a wooden xylophone.

1. **The Hunters' Prophecy.** A hunter tells King Naré Maghan of a heir to come.
2. **Sogolon.** The king marries the "buffalo woman", and the court laughs.
3. **The Boy Who Couldn't Walk.** Sundiata, aged seven, crawls, and Queen Sassouma mocks him.
4. **The Iron Rod.** The smiths forge a great iron rod. Sundiata stands, and bends it into a bow.
   In D. T. Niane's telling he then pulls up a baobab for his mother.
5. **The Griot.** Balla Fasséké becomes his griot, his memory and his voice. **Choice:** which
   tune does your Nubbin learn on the balafon, the hunters' tune or the lullaby Sogolon hums? This
   pays off in Q9 and Q14.
6. **Exile.** Sassouma's plots drive Sogolon and her children away.
7. **Kingdom to Kingdom.** A long road through foreign courts. Sundiata learns to lead.
8. **Mema.** He fights for King Moussa Tounkara, and his mother dies far from home.
9. **The Sorcerer King.** Soumaoro Kanté of Sosso seizes Manding. In his secret chamber Balla
   Fasséké plays the king's own great balafon, and Soumaoro keeps him as his griot rather than
   kill him. The tune he plays is the one your Nubbin learned in Q5.
10. **The Call Home.** Messengers find Sundiata: the people of Manding need him.
11. **Tabon.** First victories. But Soumaoro can't be harmed.
12. **The Secret.** Sundiata's sister Nana Triban and Balla Fasséké escape with Soumaoro's
    secret: the spur of a white rooster.
13. **Kirina.** Allied with Soumaoro's nephew Fakoli, Sundiata looses the arrow. Soumaoro flees
    and is never seen again.
14. **The Assembly.** Mali united. You help the griot remember it, so that it's still being sung
    eight hundred years later.

**Signature choices:** Q5's tune comes back four quests later in Soumaoro's chamber (Q9) and
again at the Assembly (Q14), where it opens the griot's telling. In Q14 you also choose what you
ask the griot to remember about this story.

**Rewards:**
- a balafon (an instrument feature: Nubbins dance);
- a baobab tree;
- the "Griot's Apprentice" title.

**Learning Grove version:**
- the Mali Empire on a map;
- griots and oral history;
- the balafon and West African music;
- the Manden Charter, proclaimed at Kurukan Fuga, which UNESCO lists as intangible cultural
  heritage;
- the later Mali of Mansa Musa and Timbuktu's libraries.

**Care notes:** use West African consultants for names, music and dress. Present the story as a
living tradition, and give versions where they differ.

## A6. Seven Voyages (Sinbad the Sailor, the Middle East and the Indian Ocean)

**Why it works:** these are pure adventure: giant birds, a whale-island, a valley of diamonds.
They're rooted in real history: Abbasid Baghdad and the monsoon trade routes of the Indian Ocean.

**The frame:** a poor porter, Sinbad the Porter, hears seven tales from the rich Sinbad the
Sailor. You are the porter's friend.

1. **Two Sinbads.** A porter complains outside a mansion and is invited in to listen.
2. **The Island That Moved.** Voyage 1: a picnic on an "island" that is a sleeping whale.
3. **The King's Stables.** Washed ashore at a foreign court, Sinbad gets home on his own lost
   ship.
4. **The Roc's Egg.** Voyage 2: a white dome that is an egg, and a bird the size of a cloud.
5. **The Valley of Diamonds.** Tied to a piece of meat, carried out by eagles. Sinbad fills his
   pockets. **Choice:** take one small stone for the porter, or take nothing. This pays off in
   Q16.
6. **The Giant's Island.** Voyage 3: escape a one-eyed giant. It's a fairy-tale threat, never
   gory.
7. **The Serpent.** Survive the night in a tree.
8. **The Strange Custom.** Voyage 4: a kingdom with a grim custom, and an escape through a
   seaside tunnel.
9. **The Roc's Revenge.** Voyage 5: boulders from the sky.
10. **The Old Man of the Sea.** A creature that rides your shoulders and won't get off. Outwit it.
11. **The River of Jewels.** Voyage 6: a raft through an underground river.
12. **Serendib.** He comes out in a kingdom of gems, today's Sri Lanka.
13. **The Caliph's Gift.** Voyage 7: carrying Harun al-Rashid's letter.
14. **The Elephant Hunter.** Captured by pirates and sold, Sinbad is made to shoot elephants
    for his master's ivory. One morning the herd lifts him from his tree and carries him to their
    graveyard, a valley of old bones, and sets him down unhurt. They want to be left alone.
    **Choice:** back in town, the master asks *you* where Sinbad went.
    - **Tell him,** once he swears to take only the tusks already lying there and never to hunt
      again. This is the tale's own ending: Sinbad is freed at once and sails home rich with the
      ivory of elephants that died old.
    - **Keep the elephants' secret.** Sinbad stays a slave a season longer. Then the master,
      who has seen the herd walk past his gate three times without harming anyone, gives up the
      hunt on his own and lets Sinbad go, poor.
15. **Home.** The last voyage ends. Told: Sinbad's ship comes in heavy, and he pays for a public
    fountain on the porter's street. Kept: he walks home with nothing, and the porter feeds *him*
    for once.
16. **The Porter's Voyage.** The listener becomes a teller: tell your own story to the Grove. If
    you took a stone in Q5, the porter sets it on the table as the first line of his own story;
    if you took nothing, he starts, "I had nothing, so I listened." His last line follows Q14:
    "The elephants were paid for in bones" or "The elephants were paid for in a season."

**Signature choices:** Q5 (a stone or nothing) pays off eleven quests later in Q16. Q14 (tell or
keep the secret) changes Q15 and Q16: Sinbad comes home rich and early or poor and late. Every
ending lets the elephants be: either way no elephant is hunted again.

**Rewards:**
- a dhow-sail decoration;
- a roc feather cosmetic;
- "storyteller's cushion" seating where Nubbins gather to listen.

**Learning Grove version:**
- monsoon winds and dhows;
- the Abbasid "House of Wisdom";
- trade routes on a map (Basra to Sri Lanka);
- how stories travel between cultures;
- elephants' memory and conservation.

**Care notes:**
- Voyages 3 and 4 are softened.
- Avoid Orientalist clichés: Baghdad is a great city of learning, not a backdrop.
- The Old Man of the Sea is a fairy-tale creature, not a portrait of anyone.
- No ivory appears as a reward, a decoration or a shop item, and the elephants are never shot on
  screen.
- Commission cultural advisers on Arab and Persian heritage (names, dress, Abbasid Baghdad and
  Basra, Islamic customs, and the *Nights*' Persian frame) before scripting.

## A7. The Marigold Bridge (Coco, Mexico)

**Why it works:** this is the Atlas's twin to the Grove's own heart, "we are made of being
remembered". A boy who loves music, in a family that has banned it, crosses into the Land of the
Dead on Día de Muertos.

**Your role:** your Nubbin becomes a little alebrije, a spirit guide glowing with painted colours,
alongside Dante the dog.

1. **The Ofrenda.** Miguel's family altar, with one photo torn.
2. **The Ban.** No music, for a reason nobody explains.
3. **The Guitar.** In a mausoleum, Miguel borrows a famous guitar and becomes a ghost to the
   living.
4. **The Marigold Bridge.** The petals glow and the dead come home.
5. **The Department of Family Reunions.** Bureaucracy in the afterlife.
6. **Héctor.** A charming trickster who is fading because no one is left to remember him. He
   asks you to remember his name. **Choice:** stitch it into your Nubbin's ribbon, or just promise.
   This pays off in Q12.
7. **The Talent Show.** Music, at last, and a disguise.
8. **The Mansion.** Ernesto de la Cruz, the idol.
9. **The Truth.** The idol stole the songs, and worse.
10. **The Cenote.** Trapped. The trickster turns out to be family.
11. **The Blessing.** Mamá Imelda's choice: love or the rule.
12. **Remember.** Back home, Miguel sings to his great-grandmother Coco, and she remembers her
    father. Your Q6 choice comes back: the ribbon is tied round the mended photo on the ofrenda,
    or you say Héctor's name aloud to Coco before Miguel sings.

**Signature choices:** Q6 (ribbon or promise) pays off six quests later in Q12. Q11: which
blessing do you plead for?

**Rewards:**
- an ofrenda decoration where your Grove's memorial cards can be placed;
- marigold paths;
- a papel picado banner;
- an alebrije Nubbin colour.

**Learning Grove version:**
- Día de Muertos traditions: the ofrenda, cempasúchil marigolds, pan de muerto and papel picado;
- Oaxacan alebrijes;
- Spanish family words.

**Care notes:** no song lyrics; the songs are original. Present Día de Muertos as a living
tradition, with Mexican consultants.

## A8. The Twelve Tasks (The Twelve Tasks of Asterix, France and Roman Gaul)

**Why it works:** Caesar challenges the unbeatable Gauls to twelve tasks worthy of Hercules. It's
gloriously silly, the bureaucracy task is world-famous, and it's set in a real moment: Roman Gaul
around 50 BC, after Caesar's Gallic Wars.

**Your role:** you are a referee from the Grove, and your Nubbin is Dogmatix's new best friend.

1. **Caesar's Challenge.** If the Gauls are gods, let them prove it.
2. **Asbestos.** Outrun the Olympic champion.
3. **Verses.** Out-throw the Persian javelin champion.
4. **Cilindric.** Wrestle the German champion, who may be a little too fond of rules.
5. **The Isle of Pleasure.** Resist the sirens. Obelix is only interested in boar.
6. **Iris.** Out-stare the Egyptian hypnotist.
7. **Mannekenpix.** Finish the Belgian chef's feast. Obelix asks when the main course is.
8. **The Cave of the Beast.** Something is in there. Find out what.
9. **The Place That Sends You Mad.** Get Permit A38 from a building of endless counters. Win by
   asking for a permit that doesn't exist.
10. **The Crocodile Ravine.** An invisible tightrope, or a punch.
11. **The Old Man of the Mountain.** A riddle that turns out to be an advert.
12. **The Haunted Plain.** Ghostly legionnaires. Complain at them until they leave.
13. **The Circus Maximus.** Lions, gladiators, and the Gauls turning it into a party.
14. **The Banquet.** Back in the village. The bard is tied up, as usual.

**Signature choice:** Q9, design your own impossible form for the clerks. The silliest wins.
Five quests later, at the Banquet (Q14), your form is the one the village uses to tie up the bard,
or, if it was too sensible to win, the one Getafix files under "Useful".

**Rewards:**
- a winged-helmet cosmetic;
- a menhir decoration;
- a "magic potion" cauldron that gives a Nubbin one great sprint.

**Learning Grove version:**
- Roman Gaul on a map;
- Latin everyday phrases;
- Roman numerals (I to XII, one per task);
- the Olympic Games' Greek origins;
- what a bureaucracy is (gently).

**Care notes:** the comics' national jokes are affectionate. Keep them kind, and avoid any
stereotype beyond the comics' gentlest.

## A9. The Comet (Comet in Moominland, Finland)

**Why it works:** Tove Jansson's Moomins are the cosiest characters in the world, facing the end
of the world. A comet is coming. Moomintroll and Sniff go to the Observatory to find out when,
and meet friends on the way. It's about anxiety, friendship and coming home.

**Your role:** you are a walker on the road, and your Nubbin rides in Sniff's pocket.

1. **Strange Signs.** Grey dust on the sea and a tail in the sky.
2. **The Raft.** Moomintroll and Sniff set off for the Lonely Mountains.
3. **Snufkin.** A wanderer with a harmonica and no possessions.
4. **The Observatory.** The professors say the comet arrives on the seventh of October, at 8:42 in
   the evening. **Choice:** Sniff asks you whether it will hit. Say "I don't know", or say "We'll be
   home by then". This pays off in Q11.
5. **The Snork Maiden.** A gold ring found in the mountains, then a rescue from a poisonous bush.
6. **The Snork.** Her brother, who likes meetings and committees.
7. **The Hemulen.** He hunts rare butterflies with a net, and the comet barely interests him.
8. **The Dry Sea.** The sea has drawn back. Walk across its bed on stilts.
9. **The Octopus.** Danger on the seabed. This time the Snork Maiden does the rescuing.
10. **The Race Home.** Under a red sky, through a tornado, with the dress of another Hemulen they
    meet used as a glider.
11. **The Cave.** Moominmamma has made a shelter and brought everything important, including the
    cake. If you told Sniff "We'll be home by then" in Q4, he says it back to you in the dark; if
    you said "I don't know", he holds your hand instead and says nothing at all.
12. **The Night It Missed.** The comet's tail sweeps past. In the morning everyone is home.

**Signature choices:** Q4's answer to Sniff pays off seven quests later in Q11. In Q11 you also
choose what you bring into the cave. Only what you love fits.

**Rewards:**
- a harmonica (music feature);
- a Moominhouse-blue stove decoration;
- the "Snufkin's hat" cosmetic.

**Learning Grove version:**
- what comets are and why their tails point away from the Sun;
- telling time to the minute (8:42);
- Finland and its two languages (Finnish and Swedish);
- naming worries and talking about them.

**Care notes:** this line is gentle by nature and perfect for younger players.

## A10. The Heart of the Island (Moana, Polynesia)

**Why it works:** a chief's daughter answers the ocean's call to restore the stolen heart of the
island goddess Te Fiti, with a boastful demigod in tow. It's rooted in real history: Polynesian
wayfinders crossed thousands of miles of open ocean by stars, swells and birds. Hawaiʻi's
Hōkūleʻa canoe revived that knowledge in the 1970s.

**Your role:** your Nubbin is a stowaway on the canoe, riding along with Heihei the rooster.

1. **The Chosen One.** The ocean gives a small girl a green stone.
2. **The Reef.** Motunui's fish are gone and the coconuts are rotting.
3. **Gramma Tala.** Stingray tattoos, dancing with the waves. **Choice:** she teaches your Nubbin
   one step, the stingray glide or the wave step. This pays off in Q12 and Q14.
4. **The Cave of Canoes.** The ancestors' hidden canoes, and the truth: her people were voyagers.
5. **Setting Sail.** Gramma Tala dies, and she gives her blessing. The ocean takes the boat.
6. **Maui.** A demigod stranded on a rock. He is not helpful.
7. **The Kakamora.** Coconut-armoured pirates. Chase sequence!
8. **Wayfinding.** Maui teaches her to read the stars, swells and currents.
9. **Lalotai.** The Realm of Monsters, and Tamatoa, a giant crab who loves shiny things.
10. **The Hook.** Maui's hook works again, sort of.
11. **Te Kā.** The lava demon wins. Maui leaves.
12. **The Manta Ray.** Gramma's spirit and a song of who she is. The song is original. The manta
    moves in the step your Nubbin learned in Q3, and your Nubbin answers it.
13. **Te Fiti.** Moana walks to the lava demon and recognises her: it is Te Fiti without her
    heart.
14. **Voyagers Again.** Motunui's people set sail. Your Nubbin dances Gramma's step at the bow.

**Signature choices:** Q3's step pays off nine quests later in Q12, and again in Q14. Q13: how do
you approach Te Kā: with a gift, a word, or just by walking forward?

**Rewards:**
- a voyaging-canoe decoration;
- a star compass on the Grove hill (a feature that names constellations);
- a woven-sail cosmetic for your Nubbin.

**Learning Grove version:**
- Polynesian navigation (star compass, swells, birds);
- the Hōkūleʻa's 1976 voyage to Tahiti;
- coral reefs;
- the Pacific on a map.

**Care notes:**
- Maui is a revered figure across Polynesia.
- Work with Pacific Islander cultural advisers.
- Keep tattoos and sacred elements respectful.
- Don't reuse the film's songs.

## The bookmarks: three Grove festivals

Each festival is one quest in the Grove, unlocked by finishing any two of its lines. Characters
from different stories don't meet each other. Instead, your Nubbins act out what they saw, and
the valley joins in.

| Festival | Lines (any two) | What happens | Reward |
| --- | --- | --- | --- |
| The Night of Remembering | A3, A5, A7 | An evening of the Grove's own memorial cards, a griot's song and an ofrenda. The valley tells one story about each Nubbin who has faded. | The Remembering Tree on the hill, hung with every faded Nubbin's card, forever (it doesn't copy A7's ofrenda: the ofrenda is for your Nubbins' photos, the tree for their stories) |
| The Great Voyage | A2, A6, A9, A10 | Nubbins build rafts and race them round the pond, navigating by lanterns and stars. | The pond becomes sailable |
| The Price of Power | A1, A4, A8 | A Nubbin "council" debates a rule for the Grove. It's light, funny and real. | A Grove Charter board where the player writes three Grove rules |

## How to build it (backlog item CV4)

1. **Script, then review.** Script each line in the Multiverse format, with original dialogue,
   plots adapted and no lyrics. Run the review and fact-check passes used for the other lines.
2. **Advisers.** Commission cultural advisers for A2, A3 (the Korean afterlife and folk
   religion), A4, A5, A6 (Arab and Persian heritage), A7 and A10 before scripting is final.
3. **The Atlas itself.** Nova's atlas is an item in the Grove. The Atlas has one save of its own,
   separate from the Grove. Each page keeps its own progress inside that save, so pages can be
   played in any order. The festivals read Atlas progress (read-only) to unlock.
4. **Ratings.** A1, A3 and A4 use the audience `teen` (13+): main game only, behind the content
   setting that is off by default. The other seven pages are `all`.
5. **Learning Grove.** Write educational versions for A2, A5, A6, A7, A8, A9 and A10, in both
   bands.

## Sources (fix pass, 2026-10-14)

- *Journey to the West* order: chapter 15 (the dragon prince as the monk's horse), chapter 19
  (Zhu Bajie) and chapter 22 (Sha Wujing): https://www.newworldencyclopedia.org/entry/Journey_to_the_West ;
  chapter 16, "The Black Wind Mountain Fiend Steals the Cassock":
  https://en.5000yan.com/journey-to-the-west/cassock-stolen.html
- *Fullmetal Alchemist: Brotherhood* episode order (Lab 5, ep. 8; Hughes, 10; Rush Valley, 11;
  the island, 12; Ling, 15; Winry and Scar, 22; Gluttony, 24–25; Briggs, 33):
  https://en.wikipedia.org/wiki/List_of_Fullmetal_Alchemist:_Brotherhood_episodes

## Part M. Forty more storylines, ranked (for Maor's review)

## How they were scored

Each storyline is scored from 1 to 10 on three things, and ranked by the total (out of 30). Ties
go to the higher Fit, then the higher Popularity.

- **Popularity (P):** how widely the source is known and loved, worldwide and by age group.
- **Craft (C):** how well we can make it. A public-domain source scores high because we can lift
  its text directly; a source whose heart is its songs scores low, because we never use lyrics.
  Clear plots and a natural place for a Nubbin also score high.
- **Fit (F):** how engaging it is in this game: how well it serves the Grove's themes (slow
  hands, the grey can be loved, pity, being remembered, safe is not well, stewardship) and how
  much it gives a pet keeper to do.

## Where each one lives

- **Grove side stories (S23–S31):** original stories set in the valley, inspired by the source,
  like S11–S22. Only these can change the campaign.
- **Atlas pages (A11–A31):** faithful adaptations, inside Nova's atlas (Part L).
- **Pixel's Arcade (PA1–PA5), new:** an all-ages frame for video-game stories. Pixel finds an old
  arcade cabinet in the Workyard skip (after chapter 5) and gets it running; each cartridge is a
  world. It works like the Atlas: saves kept apart from the Grove's, may read Grove flags, never
  sets them. The Multiverse stays
  adults-only, so family games don't go there.
- **Fun packs (Q66–Q95):** fully independent, one-time, never set any flags. Quotes from the
  originals are used, except in the Learning Grove.
- **Learning Grove lines (LB, LK):** written for the two Learning Grove bands first.

## The ranking

| Rank | ID | Storyline | Source | From | Medium | P | C | F | Total |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | S23 | Three Visitors | *A Christmas Carol* (Dickens, 1843) | England | Novella | 9 | 10 | 10 | 29 |
| 2 | A11 | The Enchanted Place | *Winnie-the-Pooh* and *The House at Pooh Corner* (A. A. Milne) | England | Books | 10 | 8 | 10 | 28 |
| 3 | A12 | The Mirror Shard | *The Snow Queen* (Hans Christian Andersen, 1844) | Denmark | Fairy tale | 8 | 10 | 10 | 28 |
| 4 | S24 | The Adventure Book | *Up* (Pixar, 2009) | USA | Film | 9 | 8 | 10 | 27 |
| 5 | S25 | Real | *The Velveteen Rabbit* (Margery Williams, 1922) | England and USA | Book | 7 | 10 | 10 | 27 |
| 6 | S26 | The Walled Garden | *The Secret Garden* (Frances Hodgson Burnett, 1911) | England | Novel | 7 | 10 | 10 | 27 |
| 7 | A13 | The Wooden Boy | *The Adventures of Pinocchio* (Carlo Collodi, 1883) | Italy | Novel | 8 | 10 | 9 | 27 |
| 8 | A14 | Homecoming | *The Odyssey* (Homer) | Greece | Epic | 8 | 10 | 9 | 27 |
| 9 | A15 | The Humbug | *The Wonderful Wizard of Oz* (L. Frank Baum, 1900) | USA | Novel | 9 | 10 | 8 | 27 |
| 10 | A16 | The Fox and the Rose | *The Little Prince* (Antoine de Saint-Exupéry, 1943) | France | Book | 10 | 6 | 10 | 26 |
| 11 | A17 | The Camphor Tree | *My Neighbor Totoro* (Studio Ghibli, 1988) | Japan | Anime film | 9 | 7 | 10 | 26 |
| 12 | S27 | Some Nubbin | *Charlotte's Web* (E. B. White, 1952) | USA | Novel | 9 | 7 | 10 | 26 |
| 13 | S28 | Please Look After This Nubbin | *Paddington* (Michael Bond; the films) | England and Peru | Books, films | 8 | 8 | 10 | 26 |
| 14 | PA1 | The Chao Altar | *Sonic Adventure* (Sega, 1998), the Chao Garden's own origin | Japan | Game | 8 | 8 | 10 | 26 |
| 15 | S29 | The Gates of Dawn | *The Wind in the Willows* (Kenneth Grahame, 1908) | England | Novel | 6 | 10 | 10 | 26 |
| 16 | A18 | The Doll in the Pocket | *Vasilisa the Beautiful* (Afanasyev's collection) | Russia | Folk tale | 6 | 10 | 10 | 26 |
| 17 | PA2 | The Clone Island | *Pokémon: The First Movie* (1998) | Japan | Anime film | 10 | 7 | 9 | 26 |
| 18 | A19 | The Dragon Who Fell | *How to Train Your Dragon* (Cressida Cowell; DreamWorks) | Britain and the Norse world | Books, films | 9 | 8 | 9 | 26 |
| 19 | S30 | What Sad Is For | *Inside Out* (Pixar, 2015 and 2024) | USA | Film | 9 | 8 | 9 | 26 |
| 20 | A20 | The Weeping | Baldr and the Fimbulwinter (*Prose Edda*, Snorri Sturluson) | Iceland | Myth | 8 | 9 | 9 | 26 |
| 21 | Q66–Q75 | Down the Rabbit-Hole | *Alice's Adventures in Wonderland* and *Through the Looking-Glass* (Lewis Carroll) | England | Novels | 9 | 10 | 7 | 26 |
| 22 | Q76–Q85 | The Hound of the Grove | *Sherlock Holmes* (Arthur Conan Doyle) | England | Stories | 9 | 10 | 7 | 26 |
| 23 | A21 | The Flower Field | *Frieren: Beyond Journey's End* (Yamada and Abe) | Japan | Manga, anime | 8 | 7 | 10 | 25 |
| 24 | A22 | The Candle | *Encanto* (Disney, 2021) | Colombia | Film | 9 | 7 | 9 | 25 |
| 25 | LB1–LB12 | Play | *Bluey* (Ludo Studio) | Australia | TV | 9 | 7 | 9 | 25 |
| 26 | A23 | Remember Who You Are | *The Lion King* (Disney, 1994) | East Africa (Swahili) | Film | 10 | 7 | 8 | 25 |
| 27 | A24 | The Law of the Jungle | *The Jungle Books* (Rudyard Kipling, 1894–95) | India | Stories | 9 | 9 | 7 | 25 |
| 28 | A25 | The Nothing | *The Neverending Story* (Michael Ende, 1979) | Germany | Novel, film | 7 | 7 | 10 | 24 |
| 29 | A26 | The Wall of Uruk | *The Epic of Gilgamesh* | Iraq (Mesopotamia) | Epic | 5 | 9 | 10 | 24 |
| 30 | A27 | The White-Haired Prince | Zal and the Simurgh (*Shahnameh*, Ferdowsi) | Iran | Epic | 5 | 9 | 10 | 24 |
| 31 | PA3 | The Hollow Kingdom | *Hollow Knight* (Team Cherry, 2017; *Silksong*, 2025) | Australia | Game | 8 | 7 | 9 | 24 |
| 32 | PA4 | Mercy | *Undertale* (Toby Fox, 2015) | USA | Game | 7 | 8 | 9 | 24 |
| 33 | A28 | The Box of Stories | Anansi the spider (Akan tales) | Ghana and the Caribbean | Folk tales | 6 | 9 | 9 | 24 |
| 34 | A29 | The Honmoon | *KPop Demon Hunters* (Sony and Netflix, 2025) | Korea | Film | 10 | 6 | 8 | 24 |
| 35 | PA5 | The Hundred-Year Sleep | *The Legend of Zelda: Breath of the Wild* (Nintendo, 2017) | Japan | Game | 9 | 7 | 8 | 24 |
| 36 | S31 | The Great Gourd | *It's the Great Pumpkin, Charlie Brown* (Peanuts, 1966) | USA | Comic, TV | 8 | 8 | 8 | 24 |
| 37 | A30 | The Word on the Brow | The Golem of Prague | Czech lands (Jewish legend) | Legend | 5 | 9 | 9 | 23 |
| 38 | Q86–Q95 | The Hodja's Donkey | Nasreddin Hodja tales | Turkey, Iran, Central Asia | Folk tales | 5 | 10 | 7 | 22 |
| 39 | LK1–LK10 | Mouse-Deer | Sang Kancil tales | Malaysia and Indonesia | Folk tales | 4 | 9 | 8 | 21 |
| 40 | A31 | The Hero Twins | *Popol Vuh* (K'iche' Maya) | Guatemala | Epic | 4 | 8 | 8 | 20 |

**The mix:**

- **Homes:** 9 Grove side stories, 21 Atlas pages, 5 Arcade cartridges, 3 fun packs and 2
  Learning Grove lines.
- **Where they come from:** more than twenty countries and traditions. Twenty-one are public
  domain, counting *Winnie-the-Pooh*, so their text can be lifted directly (old translations
  only; modern translations of the myths and folk tales are still in copyright). *Winnie-the-Pooh*
  is public domain in the US now and in the UK from 1 January 2027.
- **Media:** books, films, anime, manga, comics, TV, games, myths and folk tales.

**Bench (good, but cut for space or overlap):** *Wallace & Gromit*, *Howl's Moving Castle*,
*Princess Mononoke*, *Watership Down*, *Les Misérables*, *Black Panther*, *Naruto*, *One Piece*,
*Ne Zha 2*, *Beauty and the Beast*, *Heidi*, *Kiki's Delivery Service*, *Don Quixote*, Momotaro
and Kaguya-hime (better as Japanese questline chapters LJ7 and LJ8).

**Not recommended:** sacred or restricted stories, such as Aboriginal Dreaming stories and some
Indigenous North American and Inuit stories, unless the community itself invites it and
co-authors.

## One line on each, and how it weaves in

**Key:**

- **Reads:** Grove flags the story checks to change its own scenes.
- **Writes:** flags the story sets. Only Grove side stories can write campaign flags.
- **Tier:** 1 changes the campaign; 2 changes the Grove world; 3 stays inside its own line.

1. **S23 Three Visitors** (after `c9-close` → before `c10-open`: the three nights before the Long
   Night). The shard is out of Corvin's pocket for the first time in twenty-two years, and on
   those three nights the wardens' echoes come to him: Briar (what was), Hush (what is), Cinder
   (what will be). You sit up with him. He can't feel yet; it all lands at once when the stone is
   unmade.
   - **Reads:** `corvin`, `s13Done`, `millLetter`, `s6Done`, `soldNubbin`/`boughtBack`,
     `keptStone` (chapter 10 lines), and `cinder` (epilogue only, since S19 comes later).
   - **Writes:** `visitors`, `s23Done`.
   - **Tier 1:** it counts as a sixth S9 "family" condition. During the vigil Corvin stands in the
     lane beyond the gate with a lantern: narration only, nobody goes to him or sends him off, he
     doesn't try the latch, and nothing is gated. It is not his "arrival" (that is S9's dusk). It
     also adds an epilogue line.
2. **A11 The Enchanted Place.** The Hundred Acre Wood, from the woozle tracks to the goodbye at
   Galleons Lap.
   - **Reads:** whether the campaign is finished. After Hazel's walk, the last page gains Hazel's
     margin note.
   - **Tier 2:** a Pooh-sticks bridge over the Grove stream. A "Long Table" festival bookmark.
3. **A12 The Mirror Shard.** A splinter of a troll's mirror freezes a boy's heart, and a girl
   walks across the world to melt it. This is the Heartstone in another key.
   - **Reads:** `keptStone` and `cinder`. If you kept the stone, the Snow Queen knows you.
   - **Tier 2:** Gerda's rose bush and the robber girl's reindeer petpet.
4. **S24 The Adventure Book** (post-game, spring). Hazel's "places I'll go" book turns up. It
   began the atlas: she gave it to Nova years ago. You take her lantern to the one place she
   never reached.
   - **Reads:** `hazel`, `walk`, the ending id, `s14Done` (Tilly) and `s18Done` (the museum).
   - **Tier 2:** this ties every Atlas page to Hazel. It adds Hazel's margin notes to all Atlas
     pages, plus a last blank page you write yourself.
5. **S25 Real** (ch3 → ch8). Hazel knitted you a toy Nubbin when you were small, and it's in the
   loft. Moss, like the Skin Horse, explains what Real is. This is the lore behind Eternals.
   - **Reads:** `s21Done` (Clank wonders whether a mechanical thing can become Real).
   - **Tier 2:** a rare "Velveteen" coat colour in spring. A hint, never a shortcut, toward
     `eternalRaised`.
6. **S26 The Walled Garden** (ch6 → ch11, through three seasons). A locked garden behind the Old
   Wall lantern, shut since Hush's long grief. A robin finds the key. Linnet, Old Tobin's sour,
   lonely granddaughter, a wheelchair user, asks for a bit of earth.
   - **Reads:** `s12Done`, `s13Done`.
   - **Writes:** `hushGarden`, `s26Done`.
   - **Tier 1:** in chapter 12 Hazel has a silent moment in the garden (she still speaks only at
     Cinder's post). In Moss Sleeps, Moss's flower is on the hill by his flat stone, and its seed
     goes over the wall into Hush's garden. It also adds an epilogue line.
7. **A13 The Wooden Boy.** Collodi's Pinocchio, not Disney's: the Fire-Eater who sneezes, the Fox
   and the Cat, the Terrible Dogfish.
   - **Reads:** `s21Done`. Clank comes along and finally finds "the word".
   - **Tier 2:** Clank gains new lines in the Grove.
8. **A14 Homecoming.** Odysseus's ten-year voyage home. Penelope unweaves her loom, and the old
   dog Argos knows him after twenty years.
   - **Reads:** `corvinGate` (Hazel's gate "so I'd hear him if he came back").
   - **Tier 2:** Penelope's loom and a Great Voyage festival bookmark.
9. **A15 The Humbug.** Baum's book: silver shoes, green spectacles, and a wizard who is a
   humbug. Corvin's promise of safety rhymes with it.
   - **Reads:** `corvin`.
   - **Tier 3:** the Golden Cap's three wishes are spent across the line.
10. **A16 The Fox and the Rose.** Taming: "you become responsible, forever, for what you have
    tamed". This is Sable's whole arc, and it joins the Night of Remembering festival.
    - **Reads:** Sable's trust stage; Sable can come along.
    - **Tier 2:** the lamplighter's lamp.
11. **A17 The Camphor Tree.** Two sisters, a forest spirit and a catbus.
    - **Reads:** `s1Done`. Moss's acorn charm is planted on the night of the dance, and when you
      step back into the Grove it is a full-grown oak on the hill by Moss's flat stone.
    - **Tier 2:** that tree.
12. **S27 Some Nubbin** (ch5 → before ch9 opens, high summer into autumn). A spider in the
    Circuit's lantern shed writes words in the frost on Corvin's railings to save a Nubbin.
    - **Reads:** `soldNubbin`, `soldId`, `boughtBack`, `wisp`, `s21Done`. If Wisp was spared, he
      carries her egg sac, the way Templeton does.
    - **Writes:** the existing `boughtBack` flag, on the sold path, and `s27Done`. The valley has
      read the words, so Corvin must sell your Nubbin back.
    - **Tier 1:** this gives sold-path players a story way out of the sold-path Collector ending
      (keeping the stone still leads there). On other paths it frees a Circuit runner.
13. **S28 Please Look After This Nubbin** (ch8 → ch11). A polite, marmalade-mad stray arrives on
    the carrier's cart with a tag in Hazel's handwriting, sent ahead from the Hollow. It moves in
    with Byte, of all people.
    - **Reads:** `s7Done`, and `s8Reunited` for colour.
    - **Tier 2:** Byte's house and Byte's softening.
14. **PA1 The Chao Altar.** Tikal, the Chao and Chaos, the guardian who flooded the world when
    the ones it loved were trampled. This is Cinder in another key, and the game's own
    ancestor.
    - **Reads:** `cinder`.
    - **Tier 2:** Tikal's flower crown.
15. **S29 The Gates of Dawn** (ch4 → ch8). Messing about in boats with Marina. One summer night
    an otter kit goes missing, and you search the river until dawn.
    - **Reads:** `s4Done`, `s5Done`.
    - **Tier 2:** rowing and the river section.
16. **A18 The Doll in the Pocket.** A dying mother's doll that must be fed before it helps. That
    is Hazel's first rule. Baba Yaga's hut and the skull-lantern.
    - **Tier 2:** the doll charm.
17. **PA2 The Clone Island.** A made creature asks what its birth means.
    - **Reads:** `s7Done` (Byte watches and says nothing for a long time).
    - **Tier 3.**
18. **A19 The Dragon Who Fell.** A boy who can't kill the dragon he brought down. Trust
    through slow hands.
    - **Reads:** whether you grabbed or waited for Sable in chapter 3.
    - **Tier 2:** a tail-fin saddle cosmetic.
19. **S30 What Sad Is For** (ch6 → ch9). After Fossil's farewell, one of Clover's Nubbins won't
    stop smiling. Hush's old job was keeping grief.
    - **Reads:** `s5Done`.
    - **Tier 2:** Hush's memory page.
20. **A20 The Weeping.** Everything in the world weeps for Baldr, except one. The Fimbulwinter
    is the White Year in another key.
    - **Tier 2:** a mistletoe sprig cosmetic, given with its story.
21. **Q66–Q75 Down the Rabbit-Hole.** Pure nonsense, quoted freely. The Queen hands you a Nubbin
    for croquet, and you refuse: rule two.
    - **Independent.**
22. **Q76–Q85 The Hound of the Grove.** Holmes and Watson take valley cases: a glowing hound on
    the moor, a red-crested league, and the gate that didn't stick in the night.
    - **Independent.**
23. **A21 The Flower Field.** An elf who outlives her friends learns, too late and just in time,
    to know them. Her apprentice is called Fern, so Fern meets Fern.
    - **Tier 2.**
24. **A22 The Candle.** A family miracle that won't stop cracking, and a girl without a gift
    who holds it together.
    - **Reads:** the Long-Grass lantern state.
    - **Tier 2.**
25. **LB1–LB12 Play.** Games of pretend, written for Little Sprouts.
    - **Learning Grove only.**
26. **A23 Remember Who You Are.** An exile, a father in the clouds, and a homecoming.
    - **Tier 2.**
27. **A24 The Law of the Jungle.** Mowgli and the Seeonee pack, with "The White Seal" as a
    coda: a seal searches the sea for a safe beach, like the Hollow strays.
    - **Tier 2.**
28. **A25 The Nothing.** A spreading nothing that grows when people stop hoping, and a name
    that saves an empire.
    - **Reads:** `s6Done` (Ash's true name).
    - **Tier 2.**
29. **A26 The Wall of Uruk.** A king who loses his friend goes looking for life without end,
    and comes home to the wall he built.
    - **Tier 2.**
30. **A27 The White-Haired Prince.** A baby cast out for his white hair is raised by a great
    bird, who gives him feathers to burn in need. The grey can be loved.
    - **Tier 2.**
31. **PA3 The Hollow Kingdom.** An infection that speaks in light, and a vessel made to have no
    voice. Rescue the grubs.
    - **Tier 3.**
32. **PA4 Mercy.** A world where you can spare everyone, and should.
    - **Reads:** `wisp`.
    - **Tier 3.**
33. **A28 The Box of Stories.** The spider who bought all the world's stories from the Sky God.
    - **Reads:** `wisp`. Wisp and Anansi trade, badly.
    - **Tier 2:** the story box.
34. **A29 The Honmoon.** A barrier held by voices, and a hero hiding her own markings. Sable
    hides too.
    - **Tier 2.**
35. **PA5 The Hundred-Year Sleep.** A girl who held back a calamity for a century, and a boy
    who wakes without his memories.
    - **Tier 3.**
36. **S31 The Great Gourd** (ch7, autumn). A valley child waits all night in the long grass for
    the Great Gourd, and you wait with him. That is rule three. If Sable trusts you, she comes
    and sits too.
    - **Tier 2.**
37. **A30 The Word on the Brow.** A clay protector woken by the Hebrew word *emet* (truth). Take
    away one letter and it reads *met* (dead). A protector who grows too strong is Cinder again.
    - **Tier 2:** links to the Hebrew questline.
38. **Q86–Q95 The Hodja's Donkey.** "Eat, my coat, eat!", riding backwards, and the pot that gave
    birth.
    - **Independent.**
39. **LK1–LK10 Mouse-Deer.** Counting crocodiles across a river.
    - **Learning Grove maths.**
40. **A31 The Hero Twins.** Two brothers win a ball game against the lords of the underworld and
    become the Sun and the Moon. This links to S3's Sun and Moon Keepers.
    - **Tier 2.**

## The consequence plan (everything, together)

Choices matter in this game, but the Grove's ending logic is the spine: it must stay readable.
These rules keep it that way across all four campaigns.

**Three tiers of consequence:**

1. **Tier 1, the campaign.** The story writes a flag that the campaign reads (an ending, a
   chapter line or an epilogue line). Only Grove side stories can be Tier 1.
2. **Tier 2, the Grove world.** The story changes the valley outside the campaign: a new section,
   a resident, a feature, a decoration, or new lines for a character. Atlas, Arcade and Grove
   stories can all be Tier 2.
3. **Tier 3, the line itself.** A choice early in a line changes later quests and the line's
   ending. **Every line has at least one choice that pays off three or more quests later.**

**Read freely, write rarely.** Atlas pages, Arcade cartridges and fun packs may *read* any Grove
flag to change their own scenes: Clank joins Pinocchio, the Snow Queen knows if you kept the
stone. They never *write* a Grove flag. The Grove's keepsakes from them are Tier 2 only.

**The impact budget.** With S23–S31, the Grove has 31 side stories. Eight of them are Tier 1, so
26% change the campaign, inside the 20–35% rule.

| Story | Flag | What it changes in the campaign |
| --- | --- | --- |
| S2 Wisp | `wisp` | Who unmakes the stone; epilogue lines |
| S9 The Gate That Sticks | `corvinGate` | Corvin's place in every ending |
| S10 Fourteen Months | `hazel`, `walk` | The last walk and the second letter |
| S13 The Mill Cellar | `millLetter` | S9 "family" condition; epilogue lines |
| S19 Cinder's Last Light | `cinder` | Epilogue lines; the red flower |
| **S23 Three Visitors** (new) | `visitors` | A sixth S9 "family" condition; Corvin with a lantern in the lane beyond the gate during the vigil (narration only); epilogue line |
| **S26 The Walled Garden** (new) | `hushGarden` | Hazel's silent moment in Hush's garden in chapter 12; in Moss Sleeps, his flower's seed goes over the wall; epilogue line |
| **S27 Some Nubbin** (new) | `boughtBack` (already in the sim) | On the sold path, your Nubbin comes home and the Collector ending can be avoided |

**New flags for the sim:** `visitors` (bool), `hushGarden` (bool), `s23Done` through `s31Done`.
S27 writes the existing `boughtBack`, which `endingFor` already reads. It must also bring the
`soldId` stray home, the same way chapter 9's bargain does (if the Grove is full, the Nubbin
waits at the gate as a stray). S27 must close before chapter 9 opens. Only S23, S26 and S27 of
the new stories are Tier 1; the other six never write a campaign flag beyond their own
`sNNDone`.

**Keepsakes need one small read.** A Grove keepsake from the Atlas or the Arcade (Clank's new
lines after A13, the oak after A17) means the Grove reads whether that page is finished. Add a
read-only `atlasDone(id)` / `arcadeDone(id)` lookup across saves. It never writes.

**S9's "family" rule becomes:** at least two of `corvin` = reconciled, `s3Done`, `s6Done`,
`s8Done`, `millLetter` = kept, `visitors`.

**Corvin's redemption, end to end.** Two chapters and three side stories now feed one arc, so a
player who cares about Corvin can feel it build:

1. Chapter 9 takes the shard from him.
2. S23: three nights he can't feel.
3. Chapter 10: the stone is unmade, and it all lands at once.
4. S13: his father's letter (found any time from chapter 7, given in S9).
5. S9: the gate.

S27 is the other side of him: the man the valley embarrassed into doing right.

**Who each new story touches.** Every Keeper and most of the old cast gain at least one new
thread:

| Character | New threads |
| --- | --- |
| Hazel | S24 (the atlas was hers), S28 (her handwriting on the tag), A11 and A14 margin notes |
| Moss | S25 (the Skin Horse), A17 (the acorn), A21 and A26 (outliving friends) |
| Corvin | S23, S27, A12 (the shard), A15 (the humbug) |
| Sable | A16 (taming), A19 (trust), A29 (hiding), S31 (she sits with you) |
| Wisp | S27 (the egg sac), A28 (Anansi), PA4 (mercy) |
| Cinder | PA1 (Chaos), A12 (the Snow Queen), A20 (Fimbulwinter), A30 (the Golem) |
| Hush | S26 (her garden), S30 (her job) |
| Clank and Pixel | A13 (Pinocchio), S25 (can a made thing be Real?), Pixel's Arcade |
| Byte | S28 (the stray), PA2 (Mewtwo) |
| Marina | S29 (the river) |
| Fern | A21 (Fern meets Fern) |
| Nova | S24 (where the atlas came from) |
| Learning Grove | A30 (Hebrew letters), LJ7 and LJ8 (Momotaro and Kaguya), LB (Bluey), LK (counting) |

**Fully independent, for fun:** Q66–Q95 (Alice, Holmes, the Hodja) and the Arcade cartridges
PA2–PA5 never change anything outside themselves. They may read a Grove flag or two to vary their own scenes (PA2 reads `s7Done`, PA4 reads `wisp`), and never need one to play.

**Festivals (one-time Grove quests, unlocked by any two lines in a set):**

| Festival | Lines | Reward |
| --- | --- | --- |
| The Night of Remembering (Part L, extended) | A3, A5, A7, A16, A21, A23 | The Remembering Tree |
| The Great Voyage (Part L, extended) | A2, A6, A9, A10, A12, A14, A19 | The pond becomes sailable |
| The Price of Power (Part L, extended) | A1, A4, A8, A15, A20, A30 | The Grove Charter board |
| **The Long Table** (new) | A11, A13, A17, A18, A22 | A long table by the pond, laid for everyone you've met, in one evening scene |
| **High Score Night** (new) | PA1–PA5 | Pixel's cabinet tournament, played once; the winner's name goes on the cabinet |

## The top 15, outlined

These follow the ranking's order. Grove side stories give their chapter window; Atlas pages and
Arcade cartridges are played from the atlas or the cabinet at any time after they unlock.

## S23. Three Visitors (*A Christmas Carol*, Grove side story)

**Why it works:** Dickens wrote a ghost story about a cold man who is shown his life on three
nights and wakes up able to feel. Corvin is our Scrooge already: cold hands, a clean silent
house, and a creed that sounds like prudence. The Grove adds one twist. The visitors come while
he still can't feel anything, so he watches his whole life like a ledger, and it only lands at
the Long Night, when the stone is unmade. This is the second step of his redemption (chapter 9,
S23, chapter 10, S13, S9).

**When and where:** the morning after `c9-close` → before `c10-open`: the three nights before
the Long Night, the days Moss counts down (in the old valley, the Remembering Nights, when anyone
remembered hard enough could come to the door). Corvin's cottage up the valley, and the
visitors' walks: the mill, the Grove twenty-two years ago, Ember's stove, the lantern shed, the
Hollow and the high pass. Corvin never comes down to the Grove gate in this story: his first
arrival there after the Long Night is S9's dusk scene (`s9-dusk`).

**Your role:** his witness. You sit in the second chair and say very little; the visitors do
the persuading. Your Nubbin sits on his cold boots and is the only warm thing in the room.

**What you know by now:** the notebook (chapter 8) and Moss have told you the shard's story, and
that Hazel went into the Hollow; you don't know where she is now, or how. Nothing in S23
answers that.

1. **A Note Under the Door.** By `corvin`: reconciled, "Something came. I'd like a witness.
   C.V."; bargained, "I'd like to hire a witness. Rates negotiable."; forced, no note, but Ember
   says his lights burned all night ("Somebody should check he isn't dead. Not me."); Collector
   route, "Partner. Sit up with me."
2. **Up the Valley at Dusk.** His garden matches the route: empty, wrecked, or still full of
   grey rows. He has set two chairs by a stove he doesn't light, and he is holding his left hand
   flat over an empty pocket.
3. **The First Caller.** At midnight someone comes in by the door that doesn't open.
   - **With `s13Done`** (you finished S13's cellar): it is Aldous Vale, Corvin's father, with the
     mill's drive chain wound round him, and he speaks the warning: three will come; sit up for
     them.
   - **Otherwise:** it is Thimble, the first of Hazel's Nubbins Corvin stilled, grey and faded years
     ago in this garden, and now only an echo. Thimble doesn't speak. He sits on Corvin's foot, then
     touches the frosted window three times, leaving three small prints, and looks at the empty
     second chair. Corvin: "Three. And I'm to sit up for them."
   Either way, Corvin writes the time down.
4. **Go Home, or Stay?** He tells you to go. *Choice:* sit on his step all night; go home as he
   asked; or tell him flatly you are staying. This pays off in Q16, twelve quests later. (The
   step is the third rule in action; the script doesn't name it.)
5. **Night One: Briar.** A small warm light with a laugh in it, light springing from the crown
   of her head. "Who are you?" "Briar. What was." "Long ago?" "No. Your past."
6. **The Boy at the Window** (only with `s13Done`). Below the falls, before dawn: a
   twelve-year-old at the mill window, working. Old Tobin's lamp at the gate. Corvin: "Night
   shift. Output up a third." Then, more quietly: "I'd forgotten the lamp."
7. **Lantern Night, Twenty-Two Years Ago.** Young Corvin, twenty-two, at the gate in a thin coat;
   Hazel hands him her lantern to carry. He dances badly at the festival, and she laughs with
   him. Corvin now, flat as a clerk: "The happiness she gives, is quite as great as if it cost a
   fortune."
8. **A Cold One.** The winter of the method. Hazel as she was then, in the cottage doorway:
   "Another idol has displaced me." "What idol?" "A cold one." The gate opens in the dark, and no
   more (no buyers on screen). Corvin claps his hand over Briar's light, and it shines through his
   fingers. Briar: "Your lip is trembling. And what is that upon your cheek?" Nothing. His face is
   dry. That is the worst of it.
9. **Night Two: Hush.** The quietest thing you have ever seen. She says "Look upon me!" (the
   Ghost of Christmas Present's words, said very quietly) and nothing more until the Hollow
   (Q12). She shows only what is happening now.
10. **Ember's Stove.** Ash came home from Corvin's garden in chapter 9 and lies by the stove,
    grey, facing the corner. Ember puts down the bowl and says she hopes Corvin's cold. Then:
    "…No. I hope he's cold exactly as long as it takes." If `s6Done`, Ash lifts her head at her
    true name. Otherwise she doesn't, and Ember says it again anyway.
11. **The Lantern Shed.** The Keepers are getting the lanterns ready for the vigil. Sparks runs a
    guessing game, and the answer is "Corvin" (a nod to Fred's party). Fern says someone should
    take him soup. Then Hush leads you both to the pond, to Hazel's old chair, her cushion still
    in it. Corvin: "Whose is that?" Hush doesn't answer. You know whose, and so does he.
12. **Under a Root.** The Hollow. A very thin grey Nubbin lies under a root, alone, not eating.
    Far off between the trees a lantern is moving away. Corvin asks who keeps a lantern out
    there; Hush doesn't say. Corvin: "Will it live?" Hush only looks at the root. Then she opens
    her grey cloak. Two grey ones are huddled underneath. "This one is Fear. This one is Hurry."
    At dawn she is gone. (With `s8Reunited`, the thin one's ear folds over at the tip.)
13. **Night Three: Cinder.** She never speaks. In S19 she will, which makes her silence here
    count. She points. The Grove in some later spring: every Nubbin sits still in the sun,
    perfectly safe. The gate opens by itself and makes no sound.
14. **The Rhyme.** At a Lantern Night years from now, children skip in the lane, chanting
    Cinder's rhyme with his name in it: "Corvin held them close and tight…". Corvin repeats the
    words under his breath, checking they're right.
15. **The High Pass.** Snow, and a figure alone with a cold ember. It is him, in her place. (Shown
    from far off, as a vision: S19 is where you climb the pass yourself.) On the hill there is no
    flower for him: just a bare patch the frost keeps. He kneels: "Men's courses will foreshadow
    certain ends…". Cinder holds out her hand. It is warm, the only warm thing in three nights.
    *Choice:* you answer instead of her ("It may be", "Only if you keep on", or say nothing and
    sit down by him). It shapes his last line in Q16.
16. **The Drip.** The morning before the Long Night. With the shard gone from his pocket, for the
    first time since summer his railings drip. Payoff of Q4: on the step, he found you at three in
    the morning and put his coat over you ("My hands did it"); gone home, he left the door
    unlatched for you on nights two and three ("Don't read into it"); insisted, he made two cups
    of tea every night and didn't drink his. He says "I will live in the Past, the Present, and
    the Future" like a receipt: "I don't feel a word of it. I'm saying it anyway. That's allowed,
    isn't it?" Your Q15 answer shapes his reply. He asks where people stand at a vigil; you tell
    him the gate sticks, and that the lane is anybody's. Sets `visitors` and `s23Done`.

**Collector route** (sold in chapter 2, `boughtBack` false): the visitors come to him, but each
also turns to you, his partner. In Q10 Ash is still in Corvin's garden, so Ember's basket by the
stove is empty and she doesn't put a bowl down. Night two's thin grey is your own first Nubbin,
in a grey row in his garden (Corvin: "Ask me after. I can't do it cold."). Night three's figure
in the snow wears his coat, and it is you. S23 never buys anyone back (that is S27's job); it is
a warning before the water's edge.

**Consequences:**
- **Tier 3:** Q4 (step, home or insist) pays off in Q16, twelve quests later. Q15's answer
  sets Corvin's closing line. If Aldous came in Q3, Q6 plays; if Thimble came, Q6 is cut and Q8
  gains Thimble's winter.
- **Tier 2:** Corvin's railings stop frosting after S23 (the shard has left his pocket), even
  before the stone is unmade. Fern does take the soup up; Ember gains a line about "the soup
  somebody took up the valley".
- **Tier 1:** `visitors` (bool), set true in Q16 once all three nights have played, whatever you
  chose in Q4. If chapter 10 begins first, the story closes unfinished and `visitors` stays unset.
  Read by:
  - **S9:** the sixth "family" condition (at least two of `corvin` = reconciled, `s3Done`,
    `s6Done`, `s8Done`, `millLetter` = kept, `visitors`).
  - **`c10-vigil-corvin`** (new, after `c10-vigil`; narration only): in the lane beyond the stuck
    gate a man stands with a lantern. He doesn't try the latch; nobody goes to him or sends him
    off. Nothing is gated by it, and it is not his arrival (that stays `s9-dusk`).
  - **`c10-dawn-lane`** (new, after `c10-dawn`, `keptStone` false): a burnt-out lantern by the
    gatepost, and a patch of road where the frost has melted in the shape of a man sitting.
    Clover: "Round about the turn of the night he sat down in the road and made a noise I've never
    heard a man make. He stayed till first light. Then he went home." With `keptStone`,
    `c10-kept-lane` (new): he is still standing there, looks at your hand on your pocket, and
    walks away.
  - **Epilogue `end-epi-visitors`** (new, after the S9 line, `keptStone` false): "Every year, on
    the three nights before the Long Night, Corvin sits up with two chairs. It was always said of
    him that he knew how to keep the Long Night well." `end-epi-visitors-cinder` (if `cinder` is
    set) adds: "On the third night he sits with the red flower on the hill."
    `end-epi-visitors-kept` (replaces it when `keptStone` is true): "He leaves the door unlatched,
    in case you come. You don't."
- **Reads:** `corvin` (Q1, Q2); `s13Done` (Q3, Q6) and `millLetter` (if kept, the letter is in
  your coat all three nights and can't be given yet: that is S9's scene); `s6Done` (Q10);
  `s8Reunited` (Q12, the folded ear); `soldNubbin`/`boughtBack` (Collector route); `cinder`
  (epilogue only, as S19 comes later); `keptStone` (chapter 10 lines and the epilogue).
  **Writes:** `visitors` and `s23Done` only.

**Lifted text** (*A Christmas Carol*, 1843 text, Project Gutenberg #46. Rechecked 2026-10-14
against #46's HTML for Staves One to Three; Gutenberg's copy was cut off partway through Stave
Three here, so the Stave Four and Five lines are marked [unverified]):
1. "I wear the chain I forged in life," / "I made it link by link, and yard by yard;" (Aldous,
   Q3, `s13Done` only.)
2. "No. Your past." (Briar, Q5; Scrooge's question "Long Past?" becomes "Long ago?".) And
   "Look upon me!" (Hush, Q9.)
3. "Your lip is trembling," said the Ghost. "And what is that upon your cheek?" (Briar, Q8.)
4. "The happiness he gives, is quite as great as if it cost a fortune." (Corvin, Q7; "she
   gives". The comma after "gives" is Dickens's.)
5. "Another idol has displaced me;" … "What Idol has displaced you?" … "A golden one." (Hazel
   as she was, Q8; "What idol?" and "A cold one.")
6. "Men's courses will foreshadow certain ends, to which, if persevered in, they must lead," …
   "But if the courses be departed from, the ends will change. Say it is thus with what you
   show me!" (Corvin, Q15.) [unverified: Lit2Go's copy reads "show me." with a full stop;
   confirm against #46 before use.]
7. "I will live in the Past, the Present, and the Future." (Corvin, Q16, said flat.)
   [unverified; matches Lit2Go.]
8. "he knew how to keep Christmas well" (epilogue; "the Long Night".) [unverified; matches
   Lit2Go: "that he knew how to keep Christmas well, if any man alive possessed the knowledge."]

**Rewards:** a nightcap and dressing-gown cosmetic; the "Lantern Night reel" emote from young
Hazel's party; "Three Nights" journal pages.

**Learning Grove version:** no. It leans on Book Three's shard plot and on ghosts.

**Care notes:** audience `main` (all ages in the main game; no Learning Grove version). The
silent figure and the snow are eerie, not gory. No Nubbin death is shown: the thin grey under the
root is the one Hazel carries down the hill at dawn in chapter 10, and she finds it the night
after Hush shows it. The lantern between the trees is hers; never show her face or name her in
the Hollow, which would spoil chapter 10's dawn. Aldous and Thimble are echoes like S1's memories:
gold filter, silhouette, no portrait. Thimble never speaks (Nubbins don't). Briar and Hush speak a
little, as Eternals do; Cinder never speaks here.

## A11. The Enchanted Place (*Winnie-the-Pooh*, England, Atlas)

**Why it works:** Milne's two books are about a boy and a bear in a wood, doing Nothing, and
then the boy has to go. Their whole method is Hazel's third rule: friends sit with Eeyore, wait
out the flood, and get Pooh through a week stuck in a door by reading to him. The last chapter
is the Grove's theme in its gentlest key: "Pooh, promise you won't forget about me." It is the
page you give a small child first, and the one their grown-up cries at.

**When and where:** open from Nova's atlas at any point. The page is the Forest from the first
bump down the stairs to Galleons Lap at the top. You come with your Nubbin. Nobody else comes:
this one belongs to the Forest's own people.

**Your role:** a visitor Christopher Robin found at the edge of the Forest. He is the hero, and
so is Pooh. You carry things, hold the other end, and sit. Pooh decides your Nubbin is a very
small Heffalump. Piglet is fairly sure it is a Woozle. Your Nubbin is very good at Poohsticks
because it doesn't mind getting wet.

1. **Bump, Bump, Bump.** Edward Bear comes downstairs on the back of his head, and the story
   begins. Pooh needs a balloon to reach the bees' honey. Hold the string while Christopher
   Robin fetches his gun, and don't laugh when the bees aren't fooled.
2. **A Tight Place.** Pooh eats too much at Rabbit's and sticks in the front door for a week.
   You help Christopher Robin read him a Sustaining Book. Rabbit uses Pooh's back legs, which
   stick out into his kitchen, as a towel-horse.
3. **The Woozle.** Pooh and Piglet track footprints round a spinney in the snow, and the prints
   keep multiplying. Your Nubbin adds a third set. Christopher Robin gently shows them whose
   tracks they are, and Pooh says he is a Bear of No Brain at All. Don't spoil it early.
4. **Eeyore's Tail.** Eeyore has lost his tail. Pooh visits Owl, who has a very fine bell-rope
   by his door. Help Christopher Robin nail the tail back on.
5. **The Heffalump Trap.** Pooh and Piglet dig a Very Deep Pit and bait it with a jar of honey.
   In the night Pooh goes to check the honey and gets his head stuck in the jar, and Piglet sees
   a Heffalump. You keep the lantern steady and let the misunderstanding run.
6. **Eeyore's Birthday.** Pooh eats the honey on the way and gives Eeyore a Useful Pot. Piglet
   falls on the balloon. Eeyore is happy putting the burst balloon in and out of the pot.
   **Choice:** what does your Nubbin give Eeyore? Its ribbon, a thistle it found, or nothing,
   just sitting with him for the afternoon. This pays off in quests 11, 16 and 19.
7. **Kanga and Baby Roo.** Rabbit's plan to make Kanga leave: swap Roo for Piglet. Kanga notices
   and gives "Roo" a bath anyway. You can't stop the plan. You can make sure Roo has a nice time
   in Rabbit's pocket.
8. **The Expotition.** Everyone sets off to discover the North Pole, though nobody knows what it
   looks like. Roo falls in the stream. Pooh fishes him out with a pole, and it is the North Pole.
9. **Entirely Surrounded by Water.** It rains for days. Piglet sends a message in a bottle. Pooh
   floats on a honey jar (The Floating Bear), and Christopher Robin's upturned umbrella becomes
   The Brain of Pooh. You paddle alongside, holding your Nubbin up out of the wet.
10. **The Pooh Party.** Christopher Robin gives a party for Pooh's rescue of Piglet. Pooh gets a
    Special Pencil Case. Help set the long table, and save Eeyore a seat at the end.
11. **A House at Pooh Corner.** It is snowing. Pooh and Piglet build Eeyore a house from a heap
    of sticks, which turns out to be the house Eeyore built. Eeyore decides it was blown here
    and is better. Your Choice 6 gift is by the door (ribbon on the latch, thistle planted by
    the step), or, if you sat with him, Eeyore has kept you a place on his step.
12. **Tigger Comes to the Forest.** A Tigger bounces in at night. Help find his breakfast:
    honey (no), haycorns (no), thistles (definitely no). Kanga's Extract of Malt (yes).
13. **The Search for Small.** Rabbit organises a search for Small, one of his friends-and-
    relations. Pooh falls into the pit from book one and lands on Piglet. Small turns up on
    Pooh's back.
14. **Tiggers Don't Climb Trees.** Tigger and Roo get up a tree and can't get down. Christopher
    Robin's tunic is held out as a net, and Tigger jumps. You hold one corner.
15. **Rabbit's Busy Day.** Rabbit finds a note on Christopher Robin's door and asks everyone what
    a Backson is. The answer is that Christopher Robin now goes somewhere in the mornings. Owl
    can spell Tuesday, nearly.
16. **Poohsticks.** Pooh invents a game on the bridge. Then Eeyore floats under it, upside down.
    Pooh drops a big stone to wash him to the bank. If you sat with Eeyore in Q6, he asks you,
    and only you, to explain to the others that he was bounced.
17. **Tigger Is Unbounced.** Rabbit plans to lose Tigger in the mist so he'll be humble.
    **Choice:** go with Rabbit, or stay with Tigger. Either way Rabbit is the one who gets lost,
    and Tigger finds him. If you went with Rabbit, you are lost with him in the hollow, and
    you're the one who hears Tigger first.
18. **Piglet Does a Very Grand Thing.** A blustery day blows Owl's house down. Piglet squeezes
    out through the letterbox to fetch help. Pooh writes a long song about it, which you hear
    only as humming (no lyrics on screen, though they are Milne's). Then Eeyore finds Owl a new
    house: it is Piglet's. Piglet says yes. Pooh says Piglet can live with him.
19. **The Rissolution.** Christopher Robin is going away. Nobody says so. Eeyore writes a poem
    for the Rissolution, and everyone signs it. Your Choice 6 comes back once more: the ribbon is
    round the scroll, or there's a thistle pressed in it, or Eeyore says "Somebody sat with me"
    and leaves it at that. If you went with Rabbit in Q17, Rabbit signs next to you and says,
    stiffly, that he is grateful for the company in the mist.
20. **An Enchanted Place.** Galleons Lap, sixty-something trees in a circle. Christopher Robin
    tells Pooh about Nothing, knights him, and asks him to promise. You walk them to the edge of
    the circle and stop there. The page's last line plays over the trees.

**Consequences:**
- **Tier 3 (in the line):** Choice 6 (ribbon, thistle or sitting) pays off in Q11, Q16 and Q19,
  and sets the ending. At the close of Q20 your Nubbin leaves the matching thing at Galleons
  Lap: the ribbon tied round one of the trees, the thistle planted, or a flattened round in the
  grass where you and Eeyore sat. Choice 17 changes who hears Tigger first and whether Rabbit
  thanks you in Q19.
- **Tier 2 (the Grove):** a Poohsticks bridge over the Grove stream. The Choice 6 detail
  carries over (a ribbon on the rail, a thistle at the end, or a worn place on the parapet).
  The "Long Table" festival bookmark.
- **Reads:** whether the campaign is finished (chapter 12's `finalChoice` done). If it is, the
  last page gains Hazel's margin note in pencil beside Galleons Lap: "Read this to the little
  one, the summer they stayed. They asked where Christopher Robin went. Somewhere, I said. Not
  away. H." It appears only after Hazel's walk up the hill, never before. (Hazel wrote her notes
  in Nova's atlas years ago; S24 is where the rest of them are read. This is one of the two notes
  that show before S24.)

**Lifted text** (Milne's *Winnie-the-Pooh*, 1926, Project Gutenberg #67098, and *The House at
Pooh Corner*, 1928, Project Gutenberg #73011. Rechecked 2026-10-14 against both; Gutenberg's
pages were cut off here at chapter VII of each book, so lines from later chapters are marked
[unverified]):
1. "Here is Edward Bear, coming downstairs now, bump, bump, bump, on the back of his head,
   behind Christopher Robin." (Q1, the opening.)
2. "For I am a Bear of Very Little Brain, and long words Bother me." (Pooh, any time.)
3. "Silly old Bear," he said, "what *were* you doing?" (Christopher Robin, Q3. Milne's italics
   restored from #67098.)
4. "It rained and it rained and it rained." (Q9.) [unverified; chapter IX was past the cut-off.]
5. "Tiggers don't like honey." (Q12.)
6. "you can't help respecting anybody who can spell TUESDAY" (Q15, Rabbit, a fragment; #73011
   goes on ", even if he doesn't spell it right".)
7. "Pooh, *promise* you won't forget about me, ever. Not even when I'm a hundred." / "How old
   shall I be then?" / "Ninety-nine." / "I promise," he said. (Q20.) [unverified]
8. "So they went off together. But wherever they go, and whatever happens to them on the way, in
   that enchanted place on the top of the Forest a little boy and his Bear will always be
   playing." (Q20, the last line. One copy has a comma after "Forest"; follow #73011.)
   [unverified]

**Rewards:** the Poohsticks bridge (a feature: drop sticks with your Nubbins and see whose comes
out first); a Useful Pot decoration with a burst balloon in it; an "Expotition" pole hat-stand;
the "Long Table" bookmark.

**Learning Grove version:** yes, for Little Sprouts, without lifted text. A child learns which way
a stream flows (and why the stick on the fast side wins); that spelling wobbles are fine, and how
to sound a word out; counting a circle of "sixty-something" trees; weather words (snow, blustery,
flood); and how to be a friend to someone gloomy: sit with them.

**Care notes:**
- **Copyright.** The 1926 and 1928 texts are public domain in the US (since 2022 and 2024), and in
  the UK from 1 January 2027 (Milne died in 1956), so don't ship this page in the UK before then.
  E. H. Shepard's illustrations stay in UK copyright until 2047: all art is original.
- **Disney.** No red shirt, no Gopher, no Disney designs, songs or names (no "Lumpy"). Disney holds
  trade marks in the name and its drawings, so keep "Winnie-the-Pooh" out of the page title and
  marketing, and get a legal check.
- Christopher Robin's model was Milne's real son. No commentary on the real family. Audience
  `all`; nothing sad happens but the goodbye, and it is Milne's, gentle and unexplained.
- The Forest's animals talk, as Milne's do: the Atlas is not the Grove. Your Nubbin never talks.

## A12. The Mirror Shard (*The Snow Queen*, Denmark, Atlas)

**Why it works:** a splinter of a troll's mirror lodges in a boy's heart, and he goes cold and
clever and cruel. The Snow Queen kisses him so he no longer feels the cold, and sets him a puzzle
of ice. That is the Heartstone and the Stillness in another key: safe from feeling, and not
well. A small girl walks across the world to melt it, and the wisest person she meets says she
needs no power but the one she has. Love is a method.

**When and where:** open from Nova's atlas at any point. All seven of Andersen's stories, from
the two attic windows to the frozen lake and home. You come with your Nubbin. If `cinder` is set,
your Nubbin carries Cinder's ember (S19's reward) in a little lantern.

**Your role:** a lodger in Grandmother's attic, who jumps into Gerda's boat when it drifts. Gerda
is the hero, and only she can go in to Kay at the end. Your Nubbin rides in her muff and keeps her hands warm. At
the end you wait outside, because the Finnish woman says you must.

1. **The Troll's Mirror.** A shadow-show prologue: a wicked sprite makes a mirror that shrinks
   everything good. It shatters and its splinters scatter across the world.
2. **Two Windows.** Kay and Gerda's roses grow in boxes across the gutter between their attics.
   Grandmother tells them of the white bees in the snow and their queen. That winter, a woman
   of ice looks in at Kay's window.
3. **The Splinter.** In summer a splinter flies into Kay's eye and another into his heart. He
   mocks Gerda's roses and imitates Grandmother. That winter he holds snowflakes under a glass
   because they are "perfect". You see it happen and can't take it out.
4. **The Big Sledge.** Kay ties his sledge to a great white one in the square. It carries him out
   of the city. The Snow Queen's first kiss takes away the cold; the second, Gerda and Grandmother.
5. **The Red Shoes.** In spring Gerda gives her new red shoes to the river in exchange for Kay.
   The boat she stands in slips its rope. You jump in after her.
6. **The Garden That Forgets.** A kind old woman who understands magic wants to keep Gerda. She
   sinks every rose in the garden underground. Gerda forgets, until she sees a painted rose on
   the woman's hat. Her tears wake the buried bush. The other flowers each tell a story, and
   none of them is about Kay. Outside, it is already autumn.
7. **The Raven.** A raven believes Kay may have married a clever princess. His tame sweetheart in
   the palace lets you in by the back stairs at night.
8. **Not Kay.** The sleeping prince has Kay's neck, and that is all. The prince and princess are
   kind. They give Gerda boots, a muff and a golden coach.
9. **The Robber Girl.** Robbers take the coach. A little robber girl claims Gerda as a playmate.
   She keeps wood pigeons and a tied reindeer, Bae, and sleeps with a knife she mostly waves.
   **Choice:** she wants to keep your Nubbin. Say no, plainly, or let her hold it for one night.
   This pays off in quests 10, 17 and 18.
10. **The Reindeer.** The pigeons saw Kay in the Snow Queen's carriage, heading north. Bae knows
    the way. In the morning the robber girl frees him and ties Gerda on. If you let her hold
    your Nubbin, she hands it back unasked, and says if she can give one back she can give two.
    If you said no, she frees Bae anyway, scowling. She keeps the muff.
11. **The Sámi Woman.** A small hut in the snow and a woman cooking fish by her lamp. She warms
    Gerda, and writes a message on a dried fish for a friend further north.
12. **The Finnish Woman.** A hot little house. Bae begs her for something to make Gerda strong.
    She says Gerda has all the power she needs already, and it is in her heart. You ask
    whether you should go with Gerda. She says no: you take her to the bush with red berries,
    then you wait. (`cinder` set: she looks at the ember. "That was a fierce fire once. It only
    keeps someone warm now. That's the right size for a fire.")
13. **The Bush with Red Berries.** Bae sets Gerda down and runs back. She goes on alone, without
    boots or mittens. You sit by the bush with your Nubbin and wait, as long as it takes. If
    `cinder` is set, the ember keeps you both from freezing.
14. **The Snowflake Guards.** (Seen from far off.) Living snowflakes bar Gerda's way. She prays,
    and her breath turns into small bright figures that clear the road. With `keptStone`, the
    snowflakes part for you too, and the stone in your pocket hums. You can walk in. You don't.
15. **The Ice Puzzle.** The Snow Queen has gone to whiten the warm lands' volcanoes. Kay sits on
    the frozen lake she calls her Mirror of Understanding, blue with cold, pushing ice into a word
    he can't make. If he spells it, she has promised him the whole world and new skates.
16. **Gerda's Tears.** She finds him. Her tears thaw his heart and wash out the splinter. Kay
    cries, and the second splinter comes out of his eye. They laugh, and the pieces of ice dance
    and spell the word themselves.
17. **The Road Home.** Bae waits at the bush with a young doe. The Finnish and Sámi women help
    them south. The robber girl rides by on a horse in a red cap, off to see the world; she says
    the raven has died, old, and his sweetheart wears a black thread. If you let her hold your
    Nubbin, the pigeons on her saddle aren't tied any more. "Mostly," she says.
18. **Summer.** They come home through the same door. Grandmother is reading in the sun. They
    are grown up, and still children at heart, and the roses are out. Your Choice 9 comes back
    one last time: on the "one night" path an untied wood pigeon lands on the roses in the
    gutter; on the "no" path your Nubbin sits alone among them, quite content.

**Consequences:**
- **Tier 3 (in the line):** Choice 9 (no, or one night) changes the robber girl's goodbye in
  Q10, her ride-by in Q17 (tied or untied pigeons) and the last image in Q18: on the "one night"
  path an untied pigeon lands on the roses in the gutter; on the "no" path your Nubbin sits
  alone among them.
- **Tier 2 (the Grove):** Gerda's rose bush in two window boxes, one on the cottage sill and one
  on the lantern shed, joined by a plank. The robber girl's reindeer petpet; on the "one night"
  path it wears her red cap. The "Great Voyage" festival bookmark.
- **Reads:**
  - `keptStone`: the Snow Queen knows you. In Q4 her sledge stops beside you. She says nothing
    about the stone, only "You keep things too," and holds open her bearskin: a place where you
    will never feel the cold again. **Choice:** refuse, or say nothing and step back. Either way
    she drives on. (No kiss is offered to the player.) In Q14 the
    snowflakes part for you, and you still wait. In Q18 Grandmother asks why your hand is always
    on your pocket.
  - `cinder` (forgiven or remembered): your Nubbin carries the ember (Q12, Q13). Forgiven, it
    burns steady; remembered, it flickers but never goes out.

**Lifted text** (the Victorian translation of *The Snow Queen* in Project Gutenberg's
*Andersen's Fairy Tales*, eBook #1597; its translator is uncredited there, so confirm the credit
before naming one on screen). Rechecked 2026-10-14: Gutenberg's #1597 page was cut off here
before *The Snow Queen* begins, and Wikisource could not be reached, so every line below is
[unverified] against #1597. Lines 3 to 8 were checked word for word against Lit2Go's copy of the
same translation, and the seventh story's "Mirror of Understanding" against #1597's text on
BookRags:
1. "Now then, let us begin." (Q1, the opening.) [unverified]
2. "their heart became like a lump of ice." (Q1, a fragment.) [unverified]
3. "Who should know better than I?" (Bae, Q10, about the road north; in the fifth story it is
   "said the animal".) [unverified]
4. "I can give her no more power than what she has already." (The Finnish woman, Q12. The
   translation says "Finland woman"; on screen she is "the Finnish woman".) [unverified]
5. "that power lies in her heart, because she is a sweet and innocent child!" (Q12, a fragment.)
   [unverified]
6. "If you can discover that figure, you shall be your own master," and "I will make you a
   present of the whole world and a pair of new skates." (The Snow Queen, Q15.) [unverified]
7. "Gerda, sweet little Gerda! Where have you been so long? And where have I been?" (Kay, Q16.)
   [unverified]
8. "grown–up, and yet children; children at least in heart" (Q18, a fragment; the translation
   prints an en dash in "grown–up".) [unverified]

**Rewards:** Gerda's rose bush in two window boxes with a plank between them; the reindeer petpet
(a cosmetic companion); the robber girl's red cap for your Nubbin; the "Great Voyage" bookmark.

**Learning Grove version:** yes, softened, without lifted text. A child learns where Denmark is and
who Andersen was; that snowflakes have six sides (Kay's glass) and how frost forms; the Arctic's
midnight sun, polar night and northern lights; the Sámi today, with Sámi advisers (Sápmi across
four countries, reindeer herding, the Sámi languages); and the seasons turning on Gerda's road.

**Care notes:**
- **Names.** Say "Sámi woman" and "Finnish woman", never "Lapp woman": "Lapp" is an outsider's word
  many Sámi find offensive. The place can be "the far north" or "Lapland".
- **Sámi care.** The Sámi woman is a host in her own home: practical, warm, a good cook. She is not
  a witch, and has no magic beyond Andersen's letter on the fish. No noaidi drums or other sacred
  items. Her dress (the gákti) follows a Sámi adviser, commissioned before scripting, and is never
  a costume reward. Reindeer herding is shown as a living livelihood, not a fairy-tale prop.
- **The "Finland woman".** In Andersen's Danish she is *Finnekonen*, and in the Danish and
  Norwegian usage of his day "Finn" often meant a Sámi person, so she may be Sámi too. The old
  trope of the Sámi as sorcerers sits behind her. So she casts no spells here: she gives
  advice, says Gerda's power is her own, and that is all (Andersen's knotted winds are cut).
  Ask the Sámi adviser how to present her, and whether "the Finnish woman" is the right name.
- **The reindeer's name.** The Gutenberg-era translation prints it "Bac", a misreading of
  Andersen's Danish *Bæ*; we use "Bae".
- **Faith.** Gerda's prayer and Grandmother's Bible are Andersen's: brief, respectful, never
  mocked. The rose hymn is not sung in words (no lyrics).
- **Softened for all ages (audience `all`):** the old robber woman's threats are cut; the knife
  never touches Bae; the raven's death is one quiet line; the Snow Queen's warning about kisses
  is cut.
- The talking raven and reindeer are Andersen's: the Atlas is not the Grove. Your Nubbin never
  talks.

## S24. The Adventure Book (*Up*, Grove side story)

**Why it works:** *Up* is about a man who thinks the great adventure he owed his wife is still
ahead of him, until he reads her book and finds that their ordinary life was the adventure. That
is grief done gently, and it is exactly what the valley needs in the first spring without Hazel.
It also answers a question Part L leaves open: where Nova's atlas came from.

**When and where:** post-game, in the spring after chapter 12, when the memorial flowers open.
It moves from the Grove up beside the falls (not behind them) to the Sunrise Shelf, a high
ledge on the far ridge where you can see the whole valley at once.

**Your role:** the hero is Nova, and the story is her grief. Hazel gave her the book when she
was a girl passing through. You carry Hazel's lantern and keep pace. Your Nubbin is the
loyal one who runs ahead and comes back, runs ahead and comes back. Tilly, Sparks's
nine-year-old cousin, is the stowaway.

1. **Nova Stays for Tea.** Spring on the hill. Nova comes over the ridge and, for the first time
   anyone remembers, stays for tea. She sits by Hazel's flower. Variants come from `walk`; see
   Reads.
2. **The First Pages.** Nova shows you her atlas. The first pages are in another hand, young and
   cross: Hazel at nineteen, "Places I'll Go". Hazel gave it to Nova at twelve: "You go. One of
   us should." Nova ticked every line over the years but one: "The Sunrise Shelf. See the whole
   valley at once. Take someone."
3. **Hazel's Lantern.** Fetch it from where it hangs (see Reads). Nova wants it lit at the Shelf
   at sunrise, so Hazel "sees it from wherever she's being difficult".
4. **The Stowaway.** Tilly, up for the school holidays, is under the tarp of the carrier's cart
   with a sash of home-made badges. She needs "Helping Someone Sad". If `s14Done`, she knows you
   as a Keeps & Critters hero; otherwise Sparks introduces her, apologising. Hazel's note to her
   is still in her welly, unopened, and she would like that left alone.
5. **The Heavy Pack.** Nova's pack is full of things Hazel gave her: a tin cup, a scarf, every
   postcard Hazel answered. It's far too heavy, and she won't leave any of it.
6. **Beside the Falls.** A scree path up past the roaring water. Your Nubbin finds the dry
   stones. Tilly, at the top of her voice: "Adventure is out there!"
7. **The Tall Bird.** Something huge and shy and striped steals a lantern bun. Tilly names it Sir
   Reginald. *Choice:* feed it a bun from your hand, or sit down and wait for it to come to you.
   This pays off in Q12, five quests later.
8. **The Camp in the Cloud.** Augusta Fairweather, an explorer from Hazel's childhood picture
   papers, has lived on the ridge for fifty years. Everyone called her a liar about the tall
   bird. She wants one in a cage, to prove she wasn't. Nova is starstruck; this woman is why
   Hazel wrote the list.
9. **The Net.** At dusk Fairweather's net drops over the bird. Tilly runs after them. Nova's
   pack slides towards the drop. She grabs the pack, and Tilly is gone into the dark. Nova sits
   on the rock with the pack in her arms and doesn't move.
10. **The Rest of the Book.** You give her the lantern to read by. Nova never turned to the back
    of the book. Hazel did: every time Nova came through, she left her pack at the cottage door while
    she walked the valley, and Hazel borrowed the book and wrote in the back. "Nova came. Tea (refused)." "Nova came. Brought a shell.
    Tea (refused)." There are pages of Grove days with nothing in them but the weather and who
    came to the gate. The last line, from Nova's last visit before Hazel left: "Thanks for the
    adventure – now go have a new one!" Let Nova cry for as long as it takes. Your Nubbin leans
    on her.
11. **Lighter.** Nova empties the pack onto the rock and builds a small cairn of Hazel's things,
    carefully. She keeps the book and the lantern. "She'd say I was being dramatic." "She'd be
    right."
12. **The Chicks.** Fairweather's cage is by a nest of striped chicks, and Tilly is already there,
    safe and cross, sitting by the nest with her badge sash round the smallest chick "so it
    doesn't get cold". Sir Reginald is a mother. Payoff of Q7: if you fed her, she follows your
    bun trail to her chicks; if you waited, she comes to your sitting Nubbin of her own accord.
    Fairweather's boot is tangled in her own net at the edge. You and Nova free her. Nobody
    falls.
13. **Fairweather Sits Down.** She is too tired to stand, so she sits and waits. The bird walks
    past her, close enough to touch, once. She doesn't touch. "That'll do. That's proof enough
    for me." She comes down to the valley.
14. **The Sunrise Shelf.** At dawn you light the lantern. The whole valley is laid out at once:
    the Grove, the falls, the Hollow, the Circuit, the tide pools, the Tooth. Nova ticks the last
    line. She gives Tilly her badge: the stub of pencil Hazel wrote the list with, on a string.
    Then she hands you the atlas, open at a blank last page. "Your turn."

**Consequences:**
- **Tier 3:** Q7 (feed or wait) pays off in Q12, five quests later. The ending also varies with
  `hazel` (see Reads) and with what Nova leaves in the cairn.
- **Tier 2:**
  - Hazel's margin notes appear on every Atlas page. They were always there, faint pencil written
    on Nova's visits, and only show up by the light of Hazel's lantern: "Ha. Typical." "I'd have
    fed the dragon." (A11's and A14's notes show earlier, once the campaign is finished.)
  - A last blank page in the atlas, which you write yourself.
  - The Sunrise Shelf becomes a viewpoint section.
  - Fairweather becomes a resident, with a lecture at the museum if `s18Done`.
  - The tall bird brings her chicks to the Grove pond in spring (ambient only; no reward).
- **Reads:**
  - `walk`: where the lantern hangs and who joins.
    - `corvin`: it is on the pond hook. Corvin trims the wick and hands it over: "Bring it back
      lit."
    - `moss`: Moss comes down "decided" and rides your shoulder.
    - `moss`, where the epilogue has him stay on the hill: his flower is by the flat stone where he
      always sat, a little way from hers, and Nova sits between them.
    - `sable`: Sable walks two steps ahead the whole way.
    - `you`, or `walk` unset (no S10, so `c12-walk-alone` played): the lantern hangs by the
      cottage door.
  - `s14Done`: Tilly knows you (Q4). `s18Done`: Fairweather lectures at the museum.
  - `hazel`:
    - `told`: at sunrise, small lights answer from the Grove below. The valley climbed the hill
      to watch.
    - `secret` or unset: only the Grove's four posts answer.
  - Ending id:
    - `collector`: the tall bird won't come near you, and Tilly asks why your hands are cold.
      Q12's payoff falls to Nova.
    - `moss-sleeps`: Nova leaves a bun by Moss's flower before you go.
    - `eternal-dawn`: the Eternal watches from the hill and is there when you come home.

**Lifted text** (*Up*, Pixar, 2009; copyrighted, so two single lines only; both rechecked on
2026-10-14 against secondary sources):
1. "Adventure is out there!" (Tilly in Q6; in the film it is Muntz's motto, which Ellie takes
   up.)
2. "Thanks for the adventure – now go have a new one!" (Q10, Hazel's last line in the book; in
   the film it is Ellie's note.)

All other dialogue is original. The film's book title and page headings aren't used.

**Rewards:**
- Tilly's pencil-stub badge, as a cosmetic for you;
- the Sunrise Shelf viewpoint;
- a cairn decoration;
- a striped-feather hat.

**Learning Grove version:** yes.
- Reading a map and finding east for sunrise.
- Why we don't cage wild birds, and how nesting works.
- Keeping a memory book for someone.
- Old people were young once, with lists of their own.

**Care notes:**
- This is grief for a beloved grandmother. Never joke at Hazel's expense, and let Nova's tears
  run long. Q10 needs no music cue that tells players what to feel.
- Muntz's death is replaced: Fairweather is rescued and finds peace.
- Fire is not used.
- Tilly is out of sight for one short beat in the dark (Q9 to Q12), and is found safe at the
  start of Q12.
- Audience `all`. The tall bird never speaks.
- Writes `s24Done` only.

## S25. Real (*The Velveteen Rabbit*, Grove side story)

**Why it works:** Margery Williams's toy rabbit learns from the old Skin Horse that you become
Real by being loved for a long time, and that it doesn't happen to things that "have to be
carefully kept". That is the Grove's lore about Eternals, told in a nursery. It also gives Moss
his tenderest scene, and it lets Clank ask the question he has carried since S21.

**When and where:** ch3 → ch8, early summer into autumn. It happens in the cottage loft, by the
window seat, in the long grass, and by the shed. Moss's scenes come after he comes down in
chapter 4; Clank's scene comes after S21 closes (before chapter 6).

**Your role:** you were the child. Now your Nubbin is: it loves the toy the way the Boy loved the
Rabbit. The toy is the hero. You are the helper who finds it, gives it away and decides its
fate. Moss plays the Skin Horse.

1. **The Loft.** A parcel in Hazel's hand: "For when they come back. (They'll have grown. It won't
   mind.)" Inside is a knitted Nubbin, lumpy, with one button eye on a long thread. She made it
   for you when you were three.
2. **A Name.** *Choice:* what you called it, if you can remember: Button, Bobble or Mister. This
   pays off in Q15.
3. **The Shelf.** It sits on the windowsill, forgotten. Pixel's clockwork bits, which she brought
   up to mend the loft lamp, whirr and flash and are admired by everyone.
4. **What Is Real?** (ch4 or later) Moss finds the toy on the sill and sits beside it a long
   time. "Real isn't how you are made. It's a thing that happens to you."
5. **Does It Hurt?** He tells the rest of the Skin Horse's answer, slowly, to the toy, not to
   you: it hurts sometimes, it takes a long time, and it doesn't happen to people with sharp
   edges. Later that week, Sable, who has sharp edges, lies down within a tail's length of the
   toy, and doesn't take it.
6. **The Night It Couldn't Sleep.** A summer storm, and your young Nubbin won't settle. You give
   it the toy, the way Nana gave the Boy his rabbit. It sleeps curled round it.
7. **Everywhere.** From then on the toy goes everywhere: to the pond, the picnic, Fern's. One dusk
   it's left on the lawn, and you go back for it with a lantern because your Nubbin won't sleep
   without it.
8. **Not a Toy.** Fern calls it "only a toy". Your Nubbin squeaks at her so fiercely that you say
   it on its behalf: "He isn't a toy. He's REAL!" Fern apologises to the toy, formally.
9. **The Wild Ones.** Wild Nubbins in the long grass sniff it and bounce off, unimpressed. Moss
   reads their faces for you, drily: it can't hop, and it doesn't smell right.
10. **Clank Asks.** If `s21Done`: Clank rolls up to the windowsill and asks whether a made thing
    can become Real. Moss gives him the book's line on mechanical toys, then says: "The horse was wrong
    about that. I'm older than the horse." Clank: "Is Real the word? The one I couldn't find?"
    Moss: "No. It lives next door to it. Keep looking." (A13 keeps the word.) Without S21, Byte
    asks instead whether Real is measurable, and Moss tells him to try.
11. **Loved Shabby.** The bobble is loved off and the wool is grey at the seams. Clover offers to
    knit a new one; your Nubbin sits on the old one. Moss: "When you are Real shabbiness doesn't
    matter."
12. **The Chill** (after chapter 6). After the rain on the hill your Nubbin catches a chill.
    Clover says straight away that it's only a chill, nurses it, and you sit up. It gets better
    fully and quickly, but everything it slept on must go.
13. **The Bundle.** The bedding goes in the copper to boil, but old wool would felt to the size of
    a walnut. Clover: it goes out with the rags by the shed for the rag cart. *Choice:* let it
    go with the bundle; or wash it yourself, by hand, cold, a whole slow evening, with Clover
    checking.
14. **The Tear, or the Line.**
    - If you let it go: that night a drop of dew runs off the button eye. A small pale light
      lifts out of the wet grass, the way Moss says the first ones came up out of the spring,
      and goes into the long grass. In the morning there is a gap in the bundle.
    - If you washed it: it dries on the line, a size smaller and lumpier, and stays on your
      Nubbin's bed for good. Moss: "Then it's Real to you. That's how it ends for most of them.
      It's the better ending, mostly."
15. **Twice Round** (ch8, after the Wellspring glimpse). Back at the cottage you tell Moss about
    the warm water behind the falls. Moss: "The first ones came up out of the warm water as small
    lights. Nobody ever told me where the lights came from.
    I've a guess." Your journal gains "How Toys Become Real", with his hint about Eternals:
    "Twice round, and loved the whole way, and settled in itself." It says nothing more.
16. **Spring coda** (post-campaign). If you let it go: a wild Nubbin with a knitted-looking coat
    sits at the edge of the long grass and turns its head when you say the Q2 name. If you
    washed it: Fern and Clover knit the pattern into a coat for your Nubbin, to match the toy.

**Consequences:**
- **Tier 3:**
  - Q2's name pays off in Q16, fourteen quests later.
  - Q13's choice decides Q14 and the coda: a Velveteen wild Nubbin, or the toy kept and the
    coat knitted.
- **Tier 2:**
  - The rare Velveteen coat colour (wild Nubbin or knitted coat) appears in spring.
  - Moss gains lines about the toy.
  - Clank gains "next door to the word" lines.
  - The "How Toys Become Real" journal page.
  - It is a hint toward `eternalRaised`, never a shortcut: S25 changes no rebirth, evolution
    or alignment rule.
- **Reads:**
  - `s21Done`: Clank (Q10), otherwise Byte.
  - Sable's trust stage (Q5): she appears only at 20 or more.
  - Moss present (from chapter 4).
  - It writes nothing but `s25Done`. It gives Moss no affection beyond ordinary petting (his
    chapter 10 threshold is fixed), and it never changes Sable's trust.

**Lifted text** (*The Velveteen Rabbit*, 1922 text, Project Gutenberg #11757; Moss speaks the
Skin Horse's lines, adapted only where marked. All eight rechecked against #11757 on 2026-10-14,
and they match):
1. "Real isn't how you are made," said the Skin Horse. "It's a thing that happens to you."
2. "When a child loves you for a long, long time, not just to play with, but REALLY loves you,
   then you become Real." (Adapted: "when someone loves you".)
3. "Sometimes," said the Skin Horse, for he was always truthful. "When you are Real you don't
   mind being hurt."
4. "It doesn't happen all at once," said the Skin Horse. "You become. It takes a long time."
5. "That's why it doesn't happen often to people who break easily, or have sharp edges, or who
   have to be carefully kept."
6. "…and he knew that they were only toys, and would never turn into anything else." (Q10,
   which Moss then disputes.)
7. "He isn't a toy. He's REAL!" (You, Q8.)
8. "…when you are Real shabbiness doesn't matter." (Moss, Q11.)

**Rewards:**
- the knitted toy, as a carryable for your Nubbin;
- the Velveteen coat colour;
- a button-eye charm;
- the journal page.

**Learning Grove version:** yes.
- Caring for things we love, and mending them.
- How knitting works.
- Why we wash bedding when someone's ill.
- Love makes old things precious.

**Care notes:**
- The book's scarlet fever and burning are softened. It's a summer chill with a guaranteed full
  recovery, said out loud at once, and the toy goes with the rags, never into fire. It comes
  straight after Fossil's farewell, so keep the chill brief and light.
- Nothing ever dies in this story.
- The wild Nubbins never talk; Moss reads their manner, not their words.
- Audience `all`.

## S26. The Walled Garden (*The Secret Garden*, Grove side story)

**Why it works:** Burnett's novel is about a sour, lonely child, a locked garden shut up by
grief, a robin, and things coming alive slowly in earth. Hush kept the valley's griefs, so her
garden is the natural home for it. The Grove makes one deliberate change. Colin's arc ends with
a "cure by willpower". Here the child stays as she is, and the garden changes to fit her. That
is slow hands, and it shows that safe is not the same as well.

**When and where:** ch6 → ch11, through three seasons (late summer, autumn, winter). It happens
behind Hush's Old Wall lantern on the north side, through an ivy-hidden door the Thrums of S12
live beside.

**Your role:** you're the helper, with a spade and patience. Linnet is the heroine: Old Tobin's
granddaughter, eleven, a wheelchair user, here while her mum works the coast boats until
winter. Dusty plays Dickon's part. Moss plays both Ben Weatherstaff and the grieving master of
the house. Your Nubbin befriends the robin and carries bulbs in its cheeks.

1. **The Robin.** After Fossil's farewell, a robin takes to the Old Wall post and follows you
   about as if you owe it something.
2. **Linnet.** She arrives at Tobin's, sour as a crab apple. "Nothing in this valley is flat."
   Everyone tells her to mind herself. She hates every one of them, out loud.
3. **The Key.** The robin scratches at a molehill by the wall and turns up an old key, buried a
   very long time. You know from Moss's tale in chapter 4 what sleeps under the Old Wall post,
   and you leave it be. The post is warm to the touch, as the three good posts always are.
4. **The Door.** Wind lifts the ivy, and behind it is a knob. If `s12Done`, the Thrums' hum is
   loudest here; they have lived beside this door for ever.
5. **How Still It Is.** Inside it's grey tangles, bare rose canes and a stone bench. Linnet: "How
   still it is!" and "I am the first person who has spoken in here for a hundred years." Three
   stone steps lead down from the door.
6. **Is It Wick?** Dusty scratches a cane with a thumbnail and finds green. "It's as wick as you
   or me." For the first time since Fossil, Dusty wants to dig.
7. **Three Steps.** You ask Linnet first. She says she doesn't mind being lifted; her face says
   otherwise. *Choice:* dig the steps into a ramp (slow: Dusty and you, over three evening
   scenes, not a repeating task), or have Sparks lift Linnet and her chair down (now). This pays
   off in Q13, six quests later.
8. **The Top of the Wall.** The roses have been pruned, badly but recently. You catch the pruner
   on top of the wall with a rose twig in his mouth: Moss, who has come over once a year on the
   day Hush faded, and told nobody.
9. **A Bit of Earth.** Linnet asks Moss: "Might I have a bit of earth?" He asks what for. Linnet: "To
   plant seeds in, to make things grow, to see them come alive." Moss: "You can have as much
   earth as you want. You remind me of some one else who loved the earth and things that grow."
   And: "When you see a bit of earth you want, take it, child, and make it come alive."
10. **Hush's Bench.** Moss tells the garden's story. After the White Year, Hush brought the
    still ones in here and grew roses so they'd have something to look at. When the last one
    faded, she locked the door and buried the key, and later chose to fade. Then Moss picks his
    own bit of earth by her bench: "If I ever have a flower, I'd like a bit of it here. Don't go
    telling people. They'd make a speech."
11. **Autumn Bulbs** (ch7–8). Dusty builds raised beds at chair height. Linnet bosses everyone, and
    is good at it. Your Nubbin hides bulbs in its cheeks and plants about half of them.
12. **Mind Yourself** (by the end of chapter 8). Tobin finds out and is frightened. "She'll catch
    her death. She'll tip." Linnet goes sour again, all at once: "Everybody keeps me. Nobody lets
    me." You don't hide it from him; you bring him in. Tobin sits on Hush's bench, loses the
    thread of a story (with `s13Done` it is the cellar one, told worse), and stops arguing. On
    the way out he says the old gardeners' couplet: "Where you tend a rose, my lad, / A thistle
    cannot grow."
13. **Snowed In** (ch11, early). The payoff of Q7:
    - Ramp: Linnet went in alone at first light and is waiting to show you the snowdrops by the
      bench.
    - Lifted: the steps are under snow, nobody is about to lift her, and she has been at the top
      for an hour, furious with the steps. You build the ramp now, late and in the cold, with
      Linnet directing, and find the snowdrops together.
14. **In the Garden!** Linnet's mum comes up from the coast. She hears laughing behind the wall.
    Linnet races her down the path and wins. Nobody says "brave". Linnet: "It fits me now."
15. **The Key.** *Choice:* give the key to Linnet; hang it on the Old Wall post for anyone; or leave
    it in the door, which is never locked again. Sets `hushGarden` and `s26Done`.

**Consequences:**
- **Tier 3:** Q7 (ramp or lift) pays off in Q13, six quests later. Q15 (the key goes with
  Linnet, hangs on the post, or stays in the door) shapes the line's last scene.
- **Tier 2:** the walled garden becomes a section (roses, raised beds, Hush's bench; plants grow
  by season on their own, with no watering chores). Linnet visits each summer, the robin becomes a
  petpet, and Tobin gains garden tales.
- **Tier 1:** `hushGarden` (bool), set true in Q15 (chapter 11). If chapter 12 begins first,
  the story closes unfinished and the flag stays unset. Read by:
  - **`c12-open`** (chapter 12): after the line where Hazel touches each lantern post as she
    passes, and before she reaches the fourth post, add `c12-wall-garden` (new). At the old wall
    the door stands open. Hazel stops; she has passed this wall for forty
    years. She goes in, slowly, stands among the bare roses and the snowdrops, and says
    nothing. She comes out with a rosehip in her buttonhole and touches the post a little longer
    than the others. This is a gesture only, so the bible's rule holds: she speaks only at
    Cinder's.
  - **`end-moss-sleeps-garden`** (new, after `end-moss-sleeps`): "His flower came up on the hill,
    by the flat stone where he always sat. Linnet says that by midsummer its seed will be over the
    old wall, the way he went once a year, and into the bit of earth by Hush's bench that he
    chose. She says the robin will see to it. Nobody argues."
  - **Epilogue `end-epi-garden`** (new, every ending): "The door in the old wall isn't locked any
    more. Linnet comes every summer and tells everyone where to dig." Variant `end-epi-garden-cold`
    (Collector): "The door in the old wall stands open. None of yours go in. They sit outside it
    in the sun, quite still."
- **Reads:** `s12Done` (Q4); `s13Done` (Q12: Tobin remembers you from the cellar and tells it
  worse); Moss present (Q8–Q10 need him; he arrives in chapter 4, so this is always true in the
  window); the ending id for the epilogue variants. **Writes:** `hushGarden` and `s26Done` only.

**Lifted text** (*The Secret Garden*, 1911, Project Gutenberg #113. An earlier pass checked these
against Standard Ebooks, Lit2go, Sparknotes and Owl Eyes/LingQ, which modernise some spellings,
so use #113's "some one" when scripting. Rechecked 2026-10-14: Gutenberg's #113 page was cut off
here in chapter IX, before any of these lines, and Standard Ebooks and Wikisource could not be
reached, so all eight are [unverified] against #113):
1. "Might I," quavered Mary, "might I have a bit of earth?" (Linnet, Q9.) [unverified]
2. "You can have as much earth as you want," he said. (Moss, Q9.) [unverified]
3. "You remind me of some one else who loved the earth and things that grow." (Moss, of Hush,
   Q9.) [unverified]
4. "When you see a bit of earth you want," … "take it, child, and make it come alive." (Moss,
   Q9.) [unverified]
5. "To plant seeds in—to make things grow—to see them come alive," Mary faltered. (Linnet, Q9; the
   dashes become commas in her mouth.) [unverified]
6. "How still it is!" … "No wonder it is still," she whispered again. "I am the first person
   who has spoken in here for ten years." (Linnet, Q5, adapted: "a hundred years".) [unverified]
7. "It's as wick as you or me." (Dusty, Q6; "wick" means alive.) [unverified]
8. "Where you tend a rose, my lad, / A thistle cannot grow." (Tobin, Q12; a spoken couplet, not
   a song.) [unverified]

**Rewards:** the walled garden section; the robin petpet; a gardener's apron; a snowdrop crown;
Hush's bench decoration.

**Learning Grove version:** yes: bulbs and the seasons; how robins live; how pruning helps
roses; ramps and gardens built so everyone can use them.

**Care notes:**
- Disability: Linnet is never cured, never "inspiring", and never pitied. Her sourness comes from
  being kept, not from her body. She is funny and bossy and right about things. Her chair is part
  of her: nobody pushes it or lifts her without asking, and she is asked (Q7). The story's fix is
  access (a ramp, raised beds), never a change in Linnet. She is never used as a lesson for other
  characters. Work with disabled
  advisers and wheelchair users on her movement, her chair and the garden's layout, and on the
  Q13 "stuck at the top" beat, which must read as the steps' fault, not hers.
- The novel's colonial India opening and the cholera deaths aren't used.
- The Yorkshire dialect is not imitated, apart from "wick" as a valley word.
- The robin never talks; it only turns up where it's needed.
- Audience `all`.

## A13. The Wooden Boy (*The Adventures of Pinocchio*, Italy, Atlas)

**Why it works:** Collodi's puppet is a made thing who wants to be real and keeps running from
the people who love him. Geppetto sells his only coat for the boy's spelling-book on the second
day, before the puppet has done a single useful thing. At the end Pinocchio gives up his own
coat money for the Fairy. In between there is the Fire-eater who sneezes when he's moved, the Fox
and the Cat, and the Terrible Dog-fish. For Clank, this is where "the word" lives.

**When and where:** open from Nova's atlas at any point. Collodi's Tuscany, from Master Cherry's
workshop to the sea. You come with your Nubbin. If `s21Done`, Clank comes too, with a folding
ramp Byte made him, because Collodi's world is all steps.

**Your role:** a traveller who shelters in Geppetto's room on the night of the storm. Pinocchio
is the hero. You can warn him, and he won't listen, because he never does. Your Nubbin rides
in Geppetto's cap and later carries the candle in the Dog-fish. Clank asks the questions.

1. **The Piece of Wood.** Master Cherry's log laughs and cries when he planes it. He gives it to
   Geppetto, and the two old men fight about a wig.
2. **Geppetto Carves a Puppet.** The nose grows as he carves. The puppet kicks him and runs off,
   and Geppetto is the one marched to prison.
3. **The Talking-cricket.** A cricket who has lived in the room for a hundred years warns him.
   Pinocchio throws a hammer; it knocks the cricket off the wall, and he's gone. **Choice:**
   search the hearth, or leave it. If you search, you find him dazed in the ash and carry him
   out to the hedge. Pays off in quests 10, 18 and 20.
4. **The Flying Egg.** Starving, he cracks an egg and a chick flies out. He sleeps with his feet
   on the brazier, and by morning they are ash.
5. **Three Pears.** Geppetto gives him his own breakfast, carves new feet and a flowered-paper
   suit, and goes out in the snow. He comes back without his coat, with a spelling-book. Clank:
   "He sold his coat. For a thing that kicked him on the nose. Is that a job?" It isn't.
6. **The Puppet Show.** Pinocchio sells the book for a ticket. Harlequin and Punchinello stop the
   show to welcome their brother.
7. **Fire-eater Sneezes.** The showman wants Pinocchio for firewood, then Harlequin. Pinocchio
   offers himself. Fire-eater sneezes, which means he is moved, and gives him five gold pieces.
8. **The Fox and the Cat.** A "lame" Fox and a "blind" Cat offer to double the gold. Supper at the
   Inn of the Red Craw-fish, on Pinocchio. You can warn him. He goes.
9. **The Assassins.** Two figures in charcoal sacks chase him. He hides the coins under his
   tongue, bites a hand, and spits out a cat's paw.
10. **The Big Oak.** They tie him by his collar to an oak. The Fairy with blue hair sends a falcon
    and a poodle coachman. The doctors are a Crow, an Owl and the Talking-cricket, alive. If you
    carried him out in Q3, he nods to you.
11. **The Nose.** He takes his medicine only when four black rabbits come for him. He lies about
    the coins, and his nose grows until it won't fit through the door. Woodpeckers fix it.
12. **The Field of Miracles.** Outside a town of fools, he plants the gold to grow. A parrot
    laughs. The coins are gone.
13. **The Gorilla Judge.** He reports the robbery and is jailed for being robbed. He gets out in
    an amnesty only by saying he's a rogue too.
14. **The Guard Dog.** Trapped stealing grapes, he is chained up in place of a farmer's old dog,
    who is gone. Martens offer him a share of the hens. He raises the alarm and is freed.
15. **The Stone and the Pigeon.** The Fairy's house is gone; a small stone says she left grieving
    for him. A pigeon flies him to the shore, where Geppetto is rowing out to look for him. The
    boat goes under. Pinocchio jumps in.
16. **The Island of Busy Bees.** He won't work, until a woman asks him to carry her water. It is
    the Fairy, grown up. He promises to be good, and does well at school.
17. **The Dog-fish Trick.** Schoolmates lure him to the beach. A thrown book knocks a boy down (he
    gets up). The Green Fisherman nets Pinocchio to fry, and a mastiff he once saved saves him.
18. **The Land of Toys.** Candlewick and the Little Man's coach; five months; donkey ears. Sold
    to a circus, lamed, thrown in the sea for his hide, he comes up a puppet again. If you
    carried the cricket out in Q3, Pinocchio tells you the cricket was right.
19. **The Terrible Dog-fish.** Swallowed with a friendly Tunny, he finds Geppetto by candlelight,
    two years inside. The asthmatic Dog-fish sleeps with its mouth open, and Pinocchio swims his
    father out on his shoulders. When his strength gives out, the Tunny carries them both to
    shore. He has no words to thank the Tunny. Clank: "He doesn't have it
    either."
20. **The Wheel and the Chair.** The Fox and the Cat beg by the road; Pinocchio gives them nothing
    (**choice:** you can give them a crust). The Talking-cricket forgives him. He turns a
    water-wheel for Geppetto's milk; Candlewick, a worn-out donkey, lies down for the last time
    beside him. He gives the Snail his new-coat money for the Fairy, dreams of her, and wakes a
    boy. The old puppet leans against a chair, head on one side.

**Clank's word** (with `s21Done`). Clank parks beside the old puppet. "Did they love this one?
The wooden one?" "Yes. He sold his coat for that one." "Before it was useful." "Before it was
anything." He clicks, and clicks again. Then, not a question: "If I stop being useful, will you
still love me." A pause. "Love. That's the word. Pixel didn't put it in. Nobody puts it in.
Somebody does it to you first, and then it's there." He doesn't become anything; he is still a
kettle on one wheel, and that is the point. (Why "love": it finishes his S21 sentence exactly,
it is where S21's theme points, and S25 has told him Real only "lives next door to it".)

**Consequences:**
- **Tier 3 (in the line):** Choice 3 (carry the stunned cricket out) pays off in Q10 (he nods),
  Q18 (Pinocchio admits it to you) and Q20 (the cricket: "And thank your friend for the hedge").
  Choice 20 (the crust) changes the last beat: the Cat, who really can't see well now, thanks
  the wrong person. With Clank, the ending is his word; without him, your Nubbin curls up in
  the old puppet's lap, and Geppetto lets it stay.
- **Tier 2 (the Grove):** with `s21Done`, Clank gains Grove lines. He stops announcing when he is
  useful, only when he is "just here". One dusk (a single scene, not a daily line) he tells the
  Nubbins on his hood "Love. I'm only saying it once, so it doesn't wear out." Pixel gets one scene: "You didn't put it in." "I know.
  I'm sorry." "Don't be. Geppetto didn't either." The "Long Table" festival bookmark.
- **Reads:** `s21Done` (Clank comes; Q5, Q19 and the word). With `s25Done`, he says "next door".

**Lifted text** (M. A. Murray's 1892 translation, Fisher Unwin, checked in an earlier pass
against the 1911 Dent reprint and americanliterature.com's copy; that copy may have American
edits. Rechecked 2026-10-14: Murray's translation is not on Project Gutenberg (#16865 is a
different, uncredited 1916 Whitman translation with other wording), and Wikisource and Standard
Ebooks could not be reached, so all eight are [unverified] against the named edition. Recheck
against a scan of the 1892 or 1911 text before scripting):
1. "No, children, you are wrong. There was once upon a time a piece of wood." (Q1, the opening.) [unverified]
2. "Woe to those boys who rebel against their parents, and run away capriciously from home."
   (The Talking-cricket, Q3.) [unverified]
3. "Oh, I am sick of being a puppet!" (Pinocchio, Q16.) [unverified]
4. "And you will become one, if you know how to deserve it." (The Fairy, Q16.) [unverified]
5. "Oh, my dear papa! I have found you at last! I will never leave you more, never more, never
   more!" (Q19.) [unverified]
6. "Get on my shoulders and put your arms tightly around my neck." (Q19.) [unverified]
7. "My friend, you have saved my papa's life. I can find no words with which to thank you
   properly." (Pinocchio to the Tunny, Q19; Clank's cue.) [unverified]
8. "How ridiculous I was when I was a puppet! And how glad I am that I have become a
   well-behaved little boy!" (Q20, the last line.) [unverified]

**Rewards:** Geppetto's workbench decoration with a half-carved wooden Nubbin; a donkey-ears hat
for your Nubbin; the Dog-fish's green-bottle candle (a decoration that glows at night); the "Long
Table" bookmark.

**Learning Grove version:** yes, without lifted text. A child learns where Tuscany is and that
*pinocchio* means "pine nut"; a few Italian words (*babbo*, *burattino*, *grazie*); puppet theatre
and the old masks Harlequin and Punchinello; how wood grows in rings and why it floats; and that a
fib grows (honesty, gently, no shaming).

**Care notes:**
- **Collodi, not Disney.** No Jiminy, Monstro, Figaro or Cleo. It's the Terrible Dog-fish, the
  Talking-cricket, the Fairy with blue hair (not "the Blue Fairy"), Candlewick (not Lampwick) and
  the Land of Toys, the literal *paese dei balocchi* (not Pleasure Island, and not Murray's "Land
  of Boobies", which reads badly today). Pinocchio wears Collodi's flowered-paper suit, bark shoes
  and breadcrumb cap, not a Tyrolean hat.
- **Softened for All.** The Talking-cricket is knocked off the wall, never killed, and comes back
  as in Collodi. The hanging becomes being tied up by the collar; the rabbits carry no coffin; the
  Fairy's gravestone becomes a small stone saying she went away grieving; the schoolboy gets up;
  the Green Fisherman is comic; the old watchdog is just "gone". Candlewick's death is gentle and
  honest, like Fossil's. Commission an Italian adviser. Audience `all`.
- Collodi's animals talk (the cricket, the Fox and the Cat, the Tunny): the Atlas is not the
  Grove. Your Nubbin never talks; Clank, a machine, does.

## A14. Homecoming (*The Odyssey*, Greece, Atlas)

**Why it works:** a man takes ten years to get home, and his house waits for him. Penelope weaves
by day and unpicks by night. Argos waits on the dung heap for twenty years and knows him in rags.
Calypso offers him a life where nothing will ever happen to him again, and he chooses to go home
and grow old. Safe is not the same as well. And it is about a gate: who comes back through it,
and who was let in who shouldn't have been.

**When and where:** open from Nova's atlas at any point. Ithaca, the islands and the sea. You
come with your Nubbin. If `corvinGate` is "family", Corvin comes too ("I know something about
the long way home"). If it is "guest", he doesn't come, but he is at the stuck gate when you
close the page.

**Your role:** a guest-friend. The Odyssey's first law is the welcome of strangers, and you are
one. Odysseus is the hero. You listen to his tales in the Phaeacian hall, keep pigs with Eumaeus,
and sit with Argos. Your Nubbin befriends the old dog, and is not turned into anything by Circe.

1. **The Loom.** Ithaca, twenty years on. The suitors eat the house bare. Athena, as an old
   friend of the family, tells Telemachus to go and ask for news of his father.
2. **The Assembly.** Telemachus speaks and is laughed at. Antinous complains of Penelope's trick,
   and you see it as he tells it: three years of weaving a shroud for old Laertes by day and
   unpicking it at night. You hold the torch. A maid tells. Telemachus sails at night.
3. **Nestor and Menelaus.** Old Nestor at Pylos knows nothing. Menelaus at Sparta does: the
   sea-god Proteus told him Odysseus is held on Calypso's island.
4. **Calypso's Island.** Hermes brings Zeus's word. Odysseus weeps on the shore for home. Calypso
   offers him a life that never ends or ages if he stays. He chooses Ithaca and builds a raft.
5. **The Raft.** Poseidon wrecks it. The sea-goddess Ino lends him her veil. He swims for two days
   and sleeps ashore under two olive bushes.
6. **Nausicaa.** A princess and her maids wash clothes and play ball by the river. A salt-crusted
   man comes out of the bushes. She doesn't run. She tells him how to reach her mother.
7. **The Phaeacian Hall.** King Alcinous and Queen Arete. The blind bard Demodocus sings of Troy
   (summarised, no song words), and Odysseus hides his face in his cloak. He names himself and
   tells his tales (Q8 to Q13).
8. **Nobody.** The Cyclops's cave. He tells the giant his name is Nobody. A sharpened olive stake
   (one offscreen beat, a roar). "Nobody is hurting me!" The other giants go home. The men ride
   out under the rams. From the ship, Odysseus shouts his real name. **Choice:** ask him not
   to, shout with him, or say nothing. He shouts anyway. Pays off in quests 14, 16 and 20.
9. **The Bag of Winds.** Aeolus ties every wild wind in an ox-hide bag. Ithaca is in sight. He
   sleeps; the crew open the bag for treasure and are blown back to Aeolus's island, and he
   won't help them twice.
10. **Circe.** Half the crew are turned into pigs. You feed them. Hermes gives Odysseus
    the herb moly. Circe turns them back, younger, and they stay a year.
11. **The House of the Dead.** He calls the dead to an offering. His mother is among them; he
    didn't know she had died. It was her longing for him, she says. Three times he tries to
    hold her, and she goes through his arms like a dream.
12. **The Sirens.** Wax in the crew's ears, and yours and your Nubbin's. Odysseus is tied to the
    mast to hear them. You see him strain at the ropes and hear nothing.
13. **Scylla and Charybdis.** He steers by the six-headed thing and loses six men (offscreen).
    The crew eat the Sun's cattle and the ship is lost. Alone, he clings to a fig tree over the
    whirlpool like a bat, and drifts to Calypso.
14. **Home Asleep.** The Phaeacians carry him home asleep. Athena makes him an old beggar. If you
    asked him not to shout in Q8: "You told me once to keep my name. I'm keeping it now."
15. **The Swineherd.** Eumaeus takes in a ragged stranger and feeds him the best he has. You help
    with the pigs. Telemachus comes home, and father and son know each other in the hut.
16. **Argos.** At the gate an old hound lies neglected on the heap. He knows his master after
    twenty years, drops his ears and wags his tail, and can't get up. Odysseus can't stop, or
    he'll be known. You and your Nubbin sit with Argos in the sun. He puts his head down and
    doesn't lift it again. (Choice 8, "shout": Odysseus wipes his eyes. "Don't": under his
    breath, "Nobody." "Silence": he looks at you, once.)
17. **The Scar.** The old nurse Eurycleia washes the beggar's feet and finds his boyhood scar. He
    stops her mouth. Penelope, not knowing him, tells the beggar her dream and sets the bow test.
18. **The Bow.** Twelve axes in a row. No suitor can string the bow. The beggar strings it as a
    bard strings a lyre, and the arrow goes through all twelve.
19. **The Hall Cleared.** Softened: he stands in the doorway with the bow, Telemachus and Eumaeus
    beside him. Athena's shield fills the hall with terror, and the suitors run, over the wall
    and down the road to the town, and don't come back. (Corvin, if he came: "I was them once. I
    opened a gate and let them in." Then: "Driven out is right. Some of them come back better.")
20. **The Olive-Tree Bed.** Penelope tells the nurse to move their bed. He is angry: no one can,
    because he built the room round a living olive trunk. Then she knows him. Last, he finds old
    Laertes in his orchard and names the trees his father gave him as a boy. Athena makes peace.

**Consequences:**
- **Tier 3 (in the line):** Choice 8 (don't, shout with him, or silence) pays off in Q14 (his line
  about keeping his name), Q16 (what he says at Argos) and Q20: at the bed, if you asked him not
  to shout, Penelope's test is the first time in the line he says his own name aloud, and you
  hear it. If you shouted with him, he tells Penelope that a friend once shouted his name with
  him at a giant, that it cost him ten years, and that he isn't sorry about the company. If you
  stayed silent, he thanks you for it at the end, "for not telling me what I already knew".
- **Tier 2 (the Grove):** Penelope's loom in the cottage. It shows a cloth that grows by one band
  each time you finish an Atlas page (never by chores). The "Great Voyage" festival bookmark.
- **Reads:**
  - `corvinGate`: family, Corvin comes and speaks in Q16 (he sits with Argos too, his cold
    hands warm now) and Q19; guest, he waits at the Grove gate when you shut the atlas; shut, the
    gate is empty, and it sticks when you lift and push; unset, nothing changes.
  - Whether the campaign is finished: the Argos page gains Hazel's margin note. "Argos waited
    twenty years and knew him in rags. That's why the gate sticks. So I'd hear. H." If
    `corvinGate` is "family", a second hand has written underneath: "I came back. C."

**Lifted text** (Samuel Butler's 1900 prose translation, Project Gutenberg #1727. Butler uses
the Roman names; on screen Ulysses is Odysseus, Jove is Zeus, Minerva is Athena, and "Noman" is
"Nobody". Rechecked 2026-10-14 against #1727: lines 1 and 2 match. Gutenberg's page was cut off
here in Book IV, so lines 3 to 8 are [unverified] against #1727; an earlier pass checked Books IX
and XI against the Power–Nagy revision of Butler on Perseids, and Books XII, XVII and XXIII
against other copies):
1. "She set up a great tambour frame in her room, and began to work on an enormous piece of fine
   needlework." (Book II, Q2.)
2. "but at night she would unpick the stitches again by torchlight." (Book II, Q2.)
3. "my name is Noman; this is what my father and mother and my friends have always called me."
   (Book IX, Q8; "Nobody".) [unverified]
4. "my longing to know what you were doing and the force of my affection for you - this it was
   that was the death of me." (Book XI, Q11, his mother.) [unverified]
5. "Therefore pass these Sirens by, and stop your men's ears with wax that none of them may
   hear" (Book XII, Circe's advice, Q12.) [unverified]
6. "Inside it Scylla sits and yelps with a voice that you might take to be that of a young
   hound." (Book XII, Q13.) [unverified]
7. "As soon as he saw Ulysses standing there, he dropped his ears and wagged his tail," (Book
   XVII, Q16; "Odysseus".) [unverified]
8. "There was a young olive growing within the precincts of the house, in full vigour, and about
   as thick as a bearing-post." (Book XXIII, Q20.) [unverified]

**Rewards:** Penelope's loom (a decoration with a growing cloth); the great bow, unstrung, over the
cottage door; an olive sapling by the pond, a cutting from the bed tree; a "Nobody" nameplate for
your Nubbin's bed; the "Great Voyage" bookmark.

**Learning Grove version:** yes, softened, without lifted text. A child learns the Greek islands
and Ithaca on a map; that Homer's poems were sung and remembered before they were written; how a
loom works (warp and weft); *xenia*, welcoming strangers, and *nostos*, homecoming; and why a dog
can remember someone for years.

**Care notes:**
- **The suitors' fate is softened for all ages, and we say so.** In Homer, Odysseus and Telemachus
  kill every suitor, and the disloyal maids and the goatherd Melanthius are put to death. Here the
  suitors are driven out, nobody is punished on screen, and the families' revenge is cut to
  Athena's peace.
- **Other deaths.** The Cyclops's victims, Scylla's six and the crew lost after the Sun's cattle
  are offscreen and "lost". The blinding is one offscreen beat. The offering shows no blood.
  Argos and the mother's ghost are gentle and grave, like Fossil. Give a soft content line before
  Q11. Audience `all`, with care.
- **The gods.** They appear as Homer presents them, with dignity: never comic, never a gag, and
  never invented beyond the poem. They are not only literature: Hellenic polytheism is a living,
  legally recognised religion in Greece today, so treat Athena, Hermes, Zeus and Poseidon as
  someone's gods. No sacrifice or offering is shown as a player action (Q11's offering is
  Odysseus's, offscreen, with no blood), and no prayer is put in the player's mouth. Ask a Greek
  classicist to read the script.
- The talking dead and gods are Homer's: the Atlas is not the Grove. Argos and your Nubbin never
  talk.
- The art is Homer's world, not any film's (including the 2026 film).

## A15. The Humbug (*The Wonderful Wizard of Oz*, USA, Atlas)

**Why it works:** a girl from a grey farm walks a yellow road with three friends who each want
something they already have. The great Wizard who promises it all turns out to be a frightened
little man behind a screen. Baum's book is public domain, so we can lift its plain, funny
sentences straight onto the page. And its humbug rhymes with our own: a man who promises safety
and hands out comfort that only looks like the real thing.

**When and where:** the page opens once Nova's atlas is in the Grove. It shows a flat grey
prairie and, in one corner, a twist of cloud. You and your Nubbin step in. This is Baum's book,
not the 1939 film: the shoes are silver, the Good Witch of the South is Glinda, and nobody sings.

**Your role:** you are a traveller who falls in with Dorothy on the road. Dorothy, the Scarecrow,
the Tin Woodman and the Lion keep their story. You carry the oil-can, tie knots, read signs and
keep watch. Your Nubbin trots beside Toto. It is no braver than the Lion, which is the point.

**The quests:**

1. **The Grey Prairie.** Kansas, all grey: the house, the grass, Aunt Em. The cyclone lifts the
   house, and you step out of the page into Munchkin country just as it comes down.
2. **The Council with the Munchkins.** The Witch of the East is gone, and the Witch of the North
   gives Dorothy the silver shoes and a kiss on the forehead. Help Boq's household lay the table
   for the night.
3. **The Scarecrow.** Lift him off his pole and help him find his feet. On the road, Dorothy tells
   him why anyone would want to go back to somewhere grey.
4. **The Tin Woodman.** He has rusted solid in the forest. Find the oil-can in his cottage and do
   the joints in the right order: neck, arms, legs.
5. **The Cowardly Lion.** He roars, strikes at Toto, and gets his nose smacked. Your Nubbin hides
   behind your boots and then, slowly, sits next to him.
6. **The Kalidahs.** Two great ditches across the road. The Lion leaps the first; at the second,
   the Woodman fells a tree for a bridge. When the beasts follow, he chops it through.
7. **The River and the Stork.** A raft, a current, and a Scarecrow left clinging to his pole in
   mid-river. Wave down the Stork who carries him back.
8. **The Poppy Field and the Field Mice.** Dorothy, Toto and the Lion fall asleep in the red
   flowers, and so does your Nubbin. Carry it out. The Woodman saves the Queen of the Field Mice
   from a wildcat, and her subjects haul the Lion out on a cart, one string per mouse. You tie the
   strings.
9. **The Green Spectacles.** The Guardian of the Gates locks green spectacles on everyone,
   your Nubbin included. Everything is green. Nobody asks why.
10. **Oz, the Great and Terrible.** He is a Head to Dorothy, a lovely Lady to the Scarecrow, a
    Beast to the Woodman and a Ball of Fire to the Lion. His price for all four wishes is the same:
    kill the Wicked Witch of the West.
11. **The Witch of the West.** She has one eye that sees like a telescope. She sends wolves, crows,
    bees and Winkie soldiers, and the friends turn back each one. Then the Golden Cap calls the
    Winged Monkeys. The Scarecrow is scattered, the Woodman dented, the Lion yoked, and Dorothy
    put to work. Each night, bring the Lion food in secret, as Dorothy does.
12. **The Bucket of Water.** The Witch tricks Dorothy out of one silver shoe, and Dorothy throws
    the bucket. The Witch melts away. The Winkies, freed, help you mend the Woodman and restuff
    the Scarecrow. Dorothy finds the Golden Cap.
13. **The Golden Cap.** The Monkey King tells how his people were once free, how a prank on
    Quelala bound them to the Cap, and that each owner may call them three times. Dorothy uses
    her first call to fly everyone to the Emerald City. **Choice:** ask the Monkey King what they
    would do if they were free, or say nothing.
14. **The Humbug.** Toto knocks over a screen. Behind it is a little old man from Omaha who came
    by balloon. He admits it all. He asks you to keep his secret. (This quest reads `corvin`.)
15. **The Magic Art.** Help him mix bran with pins and needles for the Scarecrow's brains, stuff a
    silk heart with sawdust for the Woodman, and pour something green for the Lion. Everyone feels
    better. You watch them, and wonder.
16. **The Balloon.** The Wizard sews a balloon to take Dorothy home. Toto chases a kitten, Dorothy
    chases Toto, the ropes snap, and the Wizard sails off alone. Dorothy's second call fails: the
    Monkeys can't cross the desert. The Soldier with the Green Whiskers says to try Glinda.
17. **The Fighting Trees and the China Country.** Trees that grab, then a wall, and over it a land
    of china people. A cow kicks over her milkmaid and breaks off her own leg. The Princess explains why
    they can't be taken away. **Choice:** your Nubbin falls in love with a china lamb. Slip it in
    your pocket "to keep it safe", or put it back in its field.
18. **The King of Beasts.** In a forest full of frightened animals, a giant spider has been eating
    them one by one. The Lion goes alone and comes back their king, on condition that he sees
    Dorothy home first.
19. **The Hammer-Heads.** Armless men on a rocky hill who shoot their heads out on stretching
    necks. Dorothy makes her third and last call, and the Monkeys carry everyone over.
20. **Glinda.** The Good Witch of the South tells Dorothy what the silver shoes could always do.
    She spends the Cap's three calls sending each friend to his new home, and promises the Cap to
    the Monkey King. Dorothy knocks her heels three times. In Kansas, the shoes are gone, lost in
    the desert, and Aunt Em is running across the grass.

**Consequences:**

- **Tier 3 (in the line):**
  - *The Golden Cap (Q13 → Q20).* If you asked the Monkey King what they'd do if free, he answers
    in the last quest, once Glinda hands him the Cap: "Play." The Monkeys loop over Glinda's
    castle and drop a feather for your Nubbin. If you said nothing, they simply fly away.
  - *The china lamb (Q17 → Q20).* If you pocketed the lamb, you take it out at Glinda's to show
    her and find it stiff: only an ornament now, pretty and still. Glinda tells you what the
    Princess told you: carry it home. The line gains a coda before Dorothy's heels click. If you
    also asked the Monkey King, his free band flies you back to the china wall as their first free
    favour. If not, the Lion walks you, since his forest lies that way. Over the wall, the lamb
    wakes and runs. If you left it in its field, it is waiting by the wall to see you off.
  - **Endings:** four variants of the last scene: feather or no feather, lamb returned on foot,
    returned by Monkey, or never taken.
- **Tier 2 (the Grove):** none beyond the cosmetic rewards and the Price of Power bookmark, as the
  plan says (this is a Tier 3 line).
- **Reads:** `corvin`, in Q14 and Q16. When the Wizard says he is a good man but a bad Wizard, and
  that he was afraid of the Witches all along, you think of someone else.
  - *Reconciled:* "You knew a man like this. He gave the trick back. His hand was blue."
  - *Bargained:* "You knew a man like this. He sold the trick, along with everything else."
  - *Forced:* "You knew a man like this. He only let go when he fell."
  - *Unset* (chapter 9 not reached, or the Collector route): "Somebody in the valley promises
    things like this. Safe, he says. As if it came in a bottle."
  - In Q16, as the balloon drifts off: with `corvin` = reconciled, your Nubbin watches it go and
    looks back at you, and you think: some of them come back. Otherwise the balloon simply gets
    smaller.

**Lifted text** (public domain: the 1900 first edition, George M. Hill, as transcribed in
Project Gutenberg #55 and Standard Ebooks; Baum's American spelling kept. Rechecked 2026-10-14
against #55: passages 1 and 2 match. Gutenberg's page was cut off here in chapter XII and Standard
Ebooks refused the fetch, so passages 3 to 7, which an earlier pass checked against Standard
Ebooks, are [unverified] this time):

1. Chapter I, opening narration: "Once the house had been painted, but the sun blistered the paint
   and the rains washed it away, and now the house was as dull and gray as everything else."
2. Chapter IV, Dorothy to the Scarecrow: "No matter how dreary and gray our homes are, we people
   of flesh and blood would rather live there than in any other country, be it ever so beautiful.
   There is no place like home."
3. Chapter XV, the Wizard: "Oh, no, my dear; I'm really a very good man, but I'm a very bad
   Wizard, I must admit." [unverified]
4. Chapter XV, the Wizard on the spectacles: "Then I thought, as the country was so green and
   beautiful, I would call it the Emerald City; and to make the name fit better I put green
   spectacles on all the people, so that everything they saw was green." [unverified]
5. Chapter XV, the Wizard to the Lion: "There is no living thing that is not afraid when it faces
   danger. The true courage is in facing danger when you are afraid, and that kind of courage you
   have in plenty." [unverified]
6. Chapter XX, the china Princess: "But whenever any of us are taken away our joints at once
   stiffen, and we can only stand straight and look pretty." [unverified]
7. Chapter XXIII, Glinda and the Scarecrow: "If you had known their power you could have gone back
   to your Aunt Em the very first day you came to this country." / "But then I should not have had
   my wonderful brains!" cried the Scarecrow. [unverified]

None needs adapting for the valley, because the page stays in Oz. Passage 6 also works in the
Grove, unchanged, as a line Moss might read aloud.

**Rewards:** silver-shoe cosmetic for the Keeper (they do nothing, a joke the game makes once);
green spectacles (cosmetic, tinting the screen green); a Golden Cap hat for your Nubbin, with no
calls left in it; the Monkey feather, if you asked; the Price of Power bookmark.

**Learning Grove version:** yes. Kansas and the prairie in 1900, and what a cyclone is; how a
hot-air balloon flies; how coloured lenses change what you see; brains, heart and courage, or
naming what you already have.

**Care notes:**

- Audience `all`, softened. Baum is brisk about death: forty wolves, forty crows, the bees, the wildcat,
  the Kalidahs and the spider all die on the page. Keep the facts, stage them gently and just off
  the edge of the page. The Witch melts quickly into a puddle, with no screaming.
- Keep this apart from the 1939 film: no ruby slippers, no green-skinned witch, none of its lines,
  no songs. W. W. Denslow's 1900 illustrations are public domain and make a good art reference.
- The Hammer-Heads and the Winkies are fairy-tale peoples: funny, never anyone real.
- Baum's animals talk (the Lion, the Stork, the Queen of the Field Mice): the Atlas is not the
  Grove. Toto and your Nubbin never talk.

## A16. The Fox and the Rose (*The Little Prince*, France, Atlas)

**Why it works:** a pilot down in the desert meets a boy from a tiny planet who has left his
difficult, beloved rose. A fox teaches him that taming means making ties, slowly, and that it
makes you responsible for what you tamed. That is Sable's whole arc in one book. The rose who
refuses her glass globe is "safe is not the same as well" told to a child.

**When and where:** the page opens once Nova's atlas is in the Grove. It shows a single small
planet, a chair and a sunset. Your Nubbin comes with you. Sable may come too, if she trusts you
enough (see Reads).

**Your role:** you are a second stranger in the desert, a few dunes from the pilot's plane. The
pilot and the prince keep their story. Your Nubbin sits on the box with the sheep in it, and
neither of you can see the sheep either. The prince tells his travels by the plane at night, and
you play them as he tells them.

**The quests:**

1. **Drawing Number One.** The pilot shows you a drawing he made as a boy. Grown-ups saw a hat.
   Your Nubbin sees what it is: a snake that swallowed an elephant.
2. **Draw Me a Sheep.** A boy appears in the sand and asks the pilot for a sheep. Three drawings
   fail. The fourth is a box with holes in it, and the sheep is inside. Perfect. **Choice:** ask
   the pilot to draw a muzzle for the sheep now, before it's too late, or leave it. This pays
   off in Q16, fourteen quests later.
3. **Asteroid B-612.** A planet the size of a house, with two working volcanoes and one dormant.
   Every morning the baobab sprouts must come up before they take root. Help with one morning's
   weeding, once.
4. **The Sunsets.** On a planet that small, you only move your chair to see the sun set again.
   Sit with him through one sad evening of sunsets.
5. **The Rose.** She arrives proud, with four thorns and a cough she may be inventing. He brings
   her a screen and a glass globe. On the morning he leaves, she says sorry and refuses the globe.
   **Choice:** he asks you whether to put it over her anyway, to be safe. Say "Leave her free" or
   "Put the globe on her". (He does as she asks either way.)
6. **The King.** A king who rules everything, and so only gives the orders that will be obeyed
   anyway. He orders the sun to set, at sunset.
7. **The Vain Man and the Drinker.** One wants only to be clapped. The other drinks to forget he is
   ashamed of drinking. Your Nubbin is baffled by both, and so is the prince.
8. **The Businessman.** He counts the stars and owns them, he says, and puts them in the bank. He
   has never once looked up.
9. **The Lamplighter.** A planet so small, and turning so fast, that a day lasts a minute. His
   orders are to light the lamp at dusk and put it out at dawn, so now he never rests. Help him
   light it, once. The prince thinks he is the only one he could have been friends with, because
   he looks after something besides himself.
10. **The Geographer.** He writes down mountains and has never seen one. He says flowers are not
    written down because they don't last. The prince thinks of his rose for the first time with
    worry. He goes to Earth.
11. **The Yellow Snake.** Earth, the desert, nobody. A thin yellow snake says it can send anyone
    back to where they came from, and says it in riddles. The prince doesn't need it yet.
12. **The Echo and the Garden.** A three-petalled desert flower who has hardly seen anyone. A
    mountain that only repeats him. Then a garden of five thousand roses, all just like his. He
    lies in the grass and cries. Sit down next to him and wait.
13. **The Fox.** The fox asks to be tamed. Taming takes time: sit at a distance, say nothing, and
    each day sit a little closer, at the same hour. Here the "day" is the page's own desert day, a
    few minutes long, and the hour is shown by the shadows. The fox says the hour matters,
    because then you start being happy before it. Then the parting, the golden wheat, and the
    secret.
14. **The Switchman and the Merchant.** Trains full of people rushing who don't know what they're
    looking for; only the children look out of the windows. A man who sells pills that save
    fifty-three minutes of drinking a week. The prince would spend them walking to a spring.
15. **The Well.** The eighth day of the crash, and the water is gone. Walk all night with the
    pilot carrying the sleeping prince. At daybreak there is a well, with a rope and a pulley that
    creaks. The water tastes of the walk.
16. **The Wall.** The prince sits on an old stone wall, talking with the snake. Tomorrow is a year
    since he came down. He asks the pilot for the muzzle drawing he promised. He gives you all the
    stars, laughing. He asks you not to watch. (See Care notes.)
17. **The Stars.** Morning. He is gone, and there is no body in the sand. The pilot thinks he got
    home. You look up, and wonder whether the sheep has eaten the flower.

**Consequences:**

- **Tier 3 (in the line):**
  - *The globe (Q5 → Q13, Q16).* If you said "Put the globe on her", the fox turns to you as well
    as to the prince in Q13: you are the one who wanted her under glass. At the wall, the prince
    gives you the glass globe ("I won't need it"), and you leave the page with it. If you said
    "Leave her free", he gives you one of the rose's fallen petals instead, pressed flat in the
    pilot's notebook.
  - *The strap (Q2 → Q16).* In Q2 you can ask the pilot to draw a muzzle for the sheep now, before
    it's too late, or leave it. If you asked, he remembers the strap in Q16 and the last picture
    in the page shows the stars laughing. If not, he forgets the strap, as in the book, and the
    last picture leaves the question open: some nights the stars laugh, and some nights they
    don't.
  - **Endings:** globe or petal, strap or no strap: four variants of the last page.
- **Tier 2 (the Grove):**
  - The lamplighter's lamp: a small lamp post for the hill. It lights itself at dusk and goes out
    at dawn, and asks nothing of you. Sparks wants to know how it's wired.
  - If Sable came, Luna has a new line afterwards: "She tamed you, you know. Not the other way
    round."
- **Reads:** Sable's trust stage.
  - *No Sable* (before chapter 3, or Sable is gone): she doesn't come. In Q13 you think of the
    hill where something small and grey once watched.
  - *Trust 20:* Sable doesn't come. When you step out of the page she is sitting a little
    nearer the cottage than she was.
  - *Trust 45:* Sable comes and stays in your shadow. In Q13 the fox's lesson plays twice: once
    for the prince, and once with Sable, who comes one step closer each time the shadows say it's
    the hour.
  - *Bonded:* Sable walks at your heel. The fox looks at her and says, "That one's already tamed.
    Look how she watches you." At the well Sable drinks first. On the night at the wall she leans
    her weight on your shin and stays there. She never speaks.

**Lifted text** (copyrighted: under US copyright until 2039. At most three one-sentence lines,
all spoken by the fox in chapter XXI. Use the French original, with our own English. Don't use
the Katherine Woods 1943 or Richard Howard 2000 translations, which are also in copyright. The
French of all three was rechecked on 2026-10-14 against a course copy of chapter XXI and
matches):

1. « L'essentiel est invisible pour les yeux. » Ours: "What matters most can't be seen with the
   eyes."
2. « C'est le temps que tu as perdu pour ta rose qui fait ta rose si importante. » Ours: "It's the
   time you gave your rose that makes your rose so important."
3. « Tu deviens responsable pour toujours de ce que tu as apprivoisé. » Ours: "You become
   responsible, forever, for what you have tamed."

All other dialogue is original. No passage from the book is reproduced.

**Rewards:** the lamplighter's lamp (Tier 2, above); the glass globe or the pressed petal
(decoration); a box-with-holes decoration your Nubbins like to peer into; a long scarf cosmetic
for your Nubbin.

**Learning Grove version:** yes, for the older band only, ending at the well, where the prince
says he is going home to his rose. Why a small planet has short days (and the lamplighter never
rests); asteroids and their numbered names; deserts and finding water; desert foxes (fennecs); a
few French words: *renard*, *rose*, *étoile*, *puits*.

**Care notes:**

- The snake. The book keeps the prince's death uncertain, and so do we.
  - Never show the bite. In Q16 the prince asks you to look at the stars. The camera lifts to the
    sky, and when it comes down he is lying softly in the sand. Nothing more.
  - In the morning, there is no body and the pilot believes he went home. Players are told
    "he went home to his rose", and never "he died".
- For under-10s, add an optional parent note before Q16. The Learning Grove version skips the
  scene altogether.
- The same-hour ritual happens only inside Q13, on the page's own clock. Never use the real clock
  and never ask the player to come back tomorrow.
- The prince's grown-ups are gentle satire. Keep them comic, not cruel. The drinker is played as
  sad, not funny.
- Saint-Exupéry's own drawings are copyrighted too. All art is original.
- Audience `all`; the Learning Grove version is for the older band only and stops at the well.
- The fox, the snake and the flowers talk, as the book's do: the Atlas is not the Grove. Sable
  and your Nubbin never talk.

## A17. The Camphor Tree (*My Neighbor Totoro*, Japan, Atlas)

**Why it works:** two sisters move to an old country house to be near their mother in hospital.
The great spirit of the forest sleeps in the camphor tree and shows himself only when he wants
to. Nothing terrible happens for most of the film, and that is its gift: waiting at a bus stop
in the rain becomes magic. It is rule three, sitting and waiting, as a whole film. And it has the
Grove's best gift for a pet keeper: a world where small creatures are found by those who are
patient.

**When and where:** the page opens once Nova's atlas is in the Grove. It shows a country road in
summer, a bus stop and an enormous tree on a hill. Your Nubbin comes with you. You lodge with
Granny next door for the summer; Kanta is her grandson.

**Your role:** a guest in Granny's house, helping in her field and across the hedge. Satsuki and
Mei keep their story. Your Nubbin is about Mei's size and age of heart, follows her everywhere,
and can see the spirits before you can.

**The quests:**

1. **The Old House.** Satsuki (about eleven), Mei (four) and their father, a university
   professor, move in. Help unload the lorry, and take your boots off at the step before you
   go in, as everyone does. A porch post is rotten, and acorns drop from nowhere. The camphor tree on the hill is the biggest thing you have ever seen.
2. **Soot Sprites.** In the dark at the top of the stairs, small black things scatter. Mei catches
   one and gets black hands. Granny says they live in empty houses and leave when people come.
   Kanta tells the girls their house is haunted and runs.
3. **The Bath in the Storm.** Wind and creaking boards. In the bath, the father tells everyone to
   laugh. That night the soot sprites drift away up the tree, a cloud of them in the moonlight.
4. **The Hospital.** Cycle to Shichikokuyama Hospital. Their mother is tired and kind and getting
   better. She brushes Satsuki's hair. Wait in the corridor so they can have a moment.
5. **The Small Ones.** Mei, alone in the garden, spots a small white spirit, then a slightly bigger
   blue one carrying a bag of acorns. Your Nubbin is already following. Crawl after them through
   the tunnel in the hedge.
6. **The Camphor Tree.** In a hollow at the roots, Mei finds a huge, sleepy, grey-and-white spirit
   and falls asleep on his stomach. When the others find her, she is lying alone in a clearing,
   and the tunnel can't be found again. The father takes everyone to greet the tree and thank it.
   **Choice:** go back to the hedge and hunt for the tunnel, or leave it until he wants to be
   found.
7. **Kanta's Umbrella.** Caught in the rain after school, Satsuki and Mei shelter at a little
   roadside shrine, after Satsuki politely asks the little stone Jizo inside if they may (you
   bow too). Kanta shoves his umbrella at them and runs off in the wet. Help them give it
   back without embarrassing him.
8. **Granny's Field.** Help pick vegetables. Granny says vegetables eaten fresh are good for
   anyone who's poorly. Satsuki writes to her mother about the spirit, and asks you to check the
   spelling.
9. **The Bus Stop in the Rain.** Night, rain, and the father's bus is late. Mei falls asleep on
   Satsuki's back. Something huge stands beside them with a leaf on its head. Satsuki lends him
   her father's umbrella, and he loves the drops falling on it. He gives her a little bundle tied
   with grass. Then a bus that is also a cat comes bounding through the dark and takes him away.
10. **The Seeds.** The bundle is nuts and acorns. Plant them, and then wait. Nothing comes up.
    Mei squats over the bare earth every morning, and so does your Nubbin.
11. **The Night Dance.** At midnight the three spirits are dancing round the seed bed. Join in.
    The shoots rise into a tree as tall as the camphor. A flying top, and music in the high
    branches. By morning the tree is gone, but the shoots are up. (This quest reads `s1Done`.)
12. **The Telegram.** Nobody is home when the telegram comes, so Kanta runs it over. Walk with
    Satsuki to his uncle's telephone. Her mother can't come home this weekend after all; there's
    been a setback, perhaps a cold. Mei says she'll go herself. Satsuki shouts, then cries in
    Granny's lap.
13. **Mei Goes Alone.** Mei has set off with a fresh ear of corn for her mother. The whole
    village looks for her: you, Kanta, Granny, the neighbours. A child's sandal is found in the
    pond.
    Granny is frightened. Satsuki arrives, looks, and says it isn't Mei's.
14. **Satsuki and the Spirit.** Satsuki runs through the hedge tunnel to the camphor tree and asks
    for help. He grins, and calls the Catbus. Its sign changes to Mei's name.
15. **The Roadside Statues.** Mei is sitting by a row of small stone statues, corn in her lap. The
    sisters hold each other. The Catbus's sign changes again, to the hospital.
16. **Corn on the Sill.** From a tree outside the window, the sisters see their mother laughing
    with their father. It's only a cold, and she's getting well. They leave the corn on the sill,
    with "To Mother" scratched in the husk. Later in the summer, she comes home.

**Consequences:**

- **Tier 3 (in the line):** *The tunnel (Q6 → Q9, Q14, Q15).*
  - If you went hunting for the tunnel, you never find it. At the bus stop (Q9) you see only
    two enormous feet and the rain bouncing off the umbrella. In Q14 you search on foot with
    Kanta, and reach the statues as the Catbus leaves.
  - If you left it until he wanted to be found, he looks straight at you at the bus stop. In Q14
    the Catbus stops for you too, and you ride with Satsuki to Mei and on to the hospital.
  - **Endings:** you watch the window scene from inside the Catbus, or from the road below with
    Kanta. Both are warm; one is closer.
- **Tier 2 (the Grove):** the tree.
  - *With `s1Done`:* in Q11, your Nubbin digs a hole beside the girls' seed bed, and you plant
    Moss's acorn charm there. In the page, the dancers' tree is gone by morning, as in the film.
    But when you step back into the Grove, a full-grown oak stands on the hill by the flat stone
    where Moss sits.
    Moss looks up at it for a long time. "I planted one of those when the valley was young. It
    took four hundred years. You've been cheating." In the autumn its first acorn drops into your
    hand, so the charm is yours again.
  - *Without `s1Done`:* the spirits leave one acorn on your windowsill. It comes home as a young
    camphor tree in a pot.
  - If Moss has faded (the ending is `moss-sleeps`), the oak stands over his flower by the flat
    stone, and the Nubbins sleep in its shade.
- **Reads:** `s1Done` (above), and the ending id, only for the Moss Sleeps line.

**Lifted text** (copyrighted: at most three one-sentence lines. The lines below are from the
Disney 2005 English dub as widely quoted. Check them against the licensed track, since the 1989
Streamline dub words them differently. Rechecked 2026-10-14: both match the quote list on Ranker,
a secondary source, so both stay [unverified] until checked against the track):

1. Granny, about the soot sprites (Q2): "If we all keep smiling, the sprites may gradually go away
   and leave this place alone." [unverified]
2. The father, to Mei (Q6): "I also believe that you met the King of the Forest, Mei, and meeting
   him is a sign of good luck." [unverified]

Only two are used. Everything else is original: the father's bath-time laughing scene (Q3) is
told in our own words. No song lyrics are used, and the film's songs are not used at all.

**Rewards:** the oak, or the potted camphor tree (Tier 2, above); a big-leaf umbrella hat for your
Nubbin; a country bus-stop bench decoration; an ear-of-corn decoration; the Long Table bookmark.

**Learning Grove version:** yes. How an acorn becomes a tree, and why you wait for seeds; camphor
trees (*kusunoki*) and old trees honoured at shrines; the Japanese countryside of the 1950s (rice
fields, buses, telegrams); family words such as *onee-chan* (big sister) and *obaa-chan* (granny);
the rainy season.

**Care notes:**

- The mother's illness. The film never names it, and neither do we. She is always getting better
  on screen. The telegram is a delay, not a danger, and the last word on her is "only a cold".
- Mei lost (Q13). Keep the fear short. Satsuki says the sandal isn't Mei's within moments, and Q14
  starts straight away.
- **Japanese culture.** Commission Japanese advisers on the shrine, the statues, the house and
  the family, before scripting.
  - The roadside statues are Jizo, Buddhist guardians of children and travellers. Show them with
    respect, with their red bibs as the film has them, and with no jokes. Nobody climbs on them,
    and your Nubbin doesn't play on the shrine.
  - The camphor tree wears a *shimenawa* rope, as sacred trees do at Shinto shrines. The father's
    bow and thank-you to the tree is shown as the film shows it; it is never a game mechanic or a
    reward, and the player isn't asked to perform a rite.
  - The family's shared bath is ordinary in Japan; show only faces above the water and the steam,
    as the film does.
  - Indoor customs (shoes off at the step, sliding doors, sitting on the floor) are shown as
    normal life, not as quaint.
  - Use *onee-chan* and *obaa-chan* correctly, and keep the 1950s countryside real: no generic
    "old Japan" mix of other eras.
- Totoro, the Catbus and the soot sprites are Ghibli's designs. The spirits must look exactly as
  licensed, or not appear; there are no Grove versions of them.
- Audience `all`, and gentle throughout.

## S27. Some Nubbin (*Charlotte's Web*, Grove side story)

**Why it works:** E. B. White's book is about a small life saved by words, and a friend who
writes them and then dies, as everything does, in her season. The Grove already has a man who
keeps Nubbins quiet and numbered. A spider who gives one of them a name in letters the whole
valley can read is the gentlest possible answer to Corvin. And the frost that stills his runners
is the very thing that makes her silk readable at dawn.

**When and where:** opens in chapter 5, after `c5-close` (and `c5-sold`, if it plays). Closes
before chapter 9 opens, so the sold path is settled before `c9-partner` checks it. It runs from
high summer, with frost on the Circuit railings in August, to the first autumn dawns. Most of it
happens at the Circuit: the runners' pens, the finishing straight and the old lantern shed, the
one corner Corvin never has swept. The spring scene is in the Grove.

**Your role:** you are the go-between, not the hero. The hero is the spider, whom Sparks names
Spindle. Animals don't talk in the Grove, so Spindle never speaks: she writes. You carry her
up and down the valley, fetch her words and sit with her. On the sold path your own Nubbin is
the one she saves. Otherwise it's a runner the stable lad calls Nine. Your current Nubbin rides
in your pocket and keeps the dawn watch with you.

1. **The Lantern Shed.** Sparks sends you into the Circuit's lantern shed for a coil of wire.
   There's a web in the dusty window, and in it, very small, a word: EVENING. A grey-brown spider
   lifts two legs, politely. She learned her letters from the labels on Sparks's drawers.
2. **The One at the End of the Row.** From the shed window you can see the pens. On the sold
   path, your Nubbin (`soldId`) is at the end of the row, grey, looking down the valley towards
   home. Otherwise it's Nine, the smallest runner, always last. The stable lad says it out loud:
   after the Autumn Show, whatever doesn't place goes over the pass to a dealer, and doesn't come
   back.
3. **WAIT.** Next visit, the web says WAIT. Spindle is thinking. You sit down next to the shed
   window and wait with her. Sparks finds you there and gives the spider her name.
4. **Words, Please.** Drawer labels only go so far (FUSES, WICKS, SPARE). Spindle needs words. Ask
   around the valley: Fern, Clover, Luna and Byte each offer one. Byte offers "statistically
   above average", which won't fit on a railing. On the runner path, you also give Nine a real
   name.
5. **The First Word.** At dawn the frost rimes the silk on the pen railing, and the web spells the
   Nubbin's name in white. Fern reads it out first, loudly. Corvin's runners have numbers. This
   one has a name, and now everybody knows it.
6. **Frost Does Odd Things.** Corvin looks at the railing for a long time. "Frost does odd
   things." By noon there are people at the Circuit fence who have never come up the valley
   before.
7. **Was It You?** Corvin finds you by the pens and asks you straight. **The choice:** "Yes, it
   was me" (you shield Spindle), "Ask the frost" (the truth, slantwise), or say nothing. This
   pays off in quest 13.
8. **SOMEBODY'S.** The second word goes up on the main railing. The dealer from over the pass
   comes early to look and goes away uneasy. Corvin moves the Nubbin to an inside pen. You carry
   Spindle there in Sparks's toolbox.
9. **WARM.** The third word goes up on the coldest railing of all. Corvin lays his hand on it, and
   the frost doesn't melt. He takes his hand away and touches his breast pocket. This is played
   quietly, with no comment.
10. **Getting Ready.** The first autumn dawn (chapter 7). Clover helps you brush the Nubbin. Byte
    works out its chances of placing and won't say the number. Spindle insists on coming to the
    Show and rides in your hat brim.
11. **The Autumn Show.** Corvin's champion, the big grey Number One, wins as it always does. The
    Nubbin doesn't place. The dealer waits by the gate with his cart.
12. **HOME.** That night Spindle writes her last and largest word along the finishing-straight
    railing. She works till nearly dawn, and you hold the lantern low so she can see.
13. **The Morning After the Show.** The valley comes up to read the word. What happened in the night
    depends on quest 7.
    - **If you said it was you:** Corvin watched you all night and never once looked at the
      railing. Nobody but you ever knows about Spindle.
    - **If you told the truth or said nothing:** Corvin came out at midnight with a lamp and found
      her mid-letter. He lifted his cold hand, held it there, and lowered it. You watched from the
      shed. He said one thing to the dark ("Spell it right, then") and went in. It is the first
      right thing he does in this story.
14. **Bought Back, or Let Go.** The dealer won't take a Nubbin the whole valley has read about.
    - **On the sold path,** Corvin names his price, which is what he paid you: 200 Shells. Pay
      it, or let the Keepers pass a hat (Fern puts in a button). Your Nubbin comes home. This sets `boughtBack`.
    - **Otherwise,** Corvin says "Take it. It's no use to me famous." Nine comes home with you as
      a stray you can recruit.
15. **The Egg Sac.** Spindle has made her egg sac high in the shed rafters. It is her best work,
    and she can't carry it. This quest unlocks once S2 has settled `wisp`, or when chapter 8
    opens.
    - **If Wisp was spared** (`wisp` = spared or sable): Wisp climbs for it, because it's warm
      from the sun. "Mine. Warm. Mine." You strike his kind of bargain: he can keep it warm under
      the cottage step, where he lives, until spring. He hoards it all winter like treasure.
    - **Otherwise:** your own Nubbin climbs Sparks's ladder for it. If `s21Done`, Clank holds the
      ladder steady at the bottom (he can't climb; he is very good at steady). It winters on the
      Grove lantern shed's warmest shelf.
16. **The Last Evening.** You sit with Spindle in the shed window. You can say "You have been my
    friend", which turns White's line around: here it's the Keeper who says it. She writes one
    more word, very small, just for you: WELL.
17. **The Empty Web.** The next morning the web in the window is still there, and empty. Sparks
    leaves it up. No body is shown, and nobody tidies it away.
18. **Spring.** This is a post-game scene in the first spring. The egg sac opens. Hundreds of tiny
    spiders climb the gate and float off on silk threads in the wind. Three stay. On their first
    morning, a very small web in the Grove lantern shed says EVENING.

**Consequences:**

- **Tier 3 (in the line):** Quest 7's answer decides quest 13: if you shielded her, Spindle stays your secret; if you
  didn't, Corvin chooses not to wipe out the word. `wisp` decides who carries the egg sac (quest
  15), and so where the spiders hatch (quest 18): if Wisp has it, his grey head is the first thing
  they see. The line ends one of two ways: your own Nubbin comes home with its name written in
  frost, or a stranger named Nine joins the Grove.
- **Tier 2 (the Grove):** Nine (runner path) becomes a resident. Spindle's empty web stays in the
  Circuit shed window. Three spiders live in the Grove lantern shed. They are ambient only, with
  no chores. After the Show, Corvin's stable lad starts using names. Corvin pretends not to
  notice.
- **Tier 1 (the campaign):** the flag is `boughtBack` (bool, already in the sim).
  - **When it's set:** to `true` in quest 14 (`s27-home`), only if `soldNubbin && !boughtBack`.
    The scene must also bring the `soldId` stray home, as `c9-open`'s bargain does: remove it
    from `strays`, set its trust to 20, clear `stray` and push it to `nubbins`. Take 200 Shells,
    or none if the hat was passed.
  - **Who reads it:** `endingFor` (for this player, the Collector ending can now only come from
    `keptStone`);
    `c9-partner` and `c9-shard-collector` (they no longer play, so chapter 9 opens normally and
    the shard scene follows the `corvin` flag); `end-collector-sold` (it can no longer play,
    though `end-collector-kept` still can). `c5-sold` has already played. A later `c9-open`
    bargain sets `boughtBack` again, which is harmless: its 200 Shells are Ash's price.
- **Reads:** `soldNubbin`, `soldId` and `boughtBack` choose the path; `wisp` and `s21Done` choose
  who carries the egg sac. **Line-local flags:** `s27Done`, `s27Truth` and `s27Carrier`.

**Lifted text** (*Charlotte's Web*, E. B. White, 1952, is under copyright; two signature lines,
each one sentence, and all other words are new. Both rechecked on 2026-10-14 against secondary
quote sources, as the book has no public-domain text):

- "You have been my friend." This is Charlotte's line to Wilbur. Here the Keeper says it (quest
  16).
- "It is not often that someone comes along who is a true friend and a good writer." This is
  the narrator's line near the end of the book. The spring scene's last narration uses it, then
  adds a line of our own: "Spindle was both."
- The web words (the name, SOMEBODY'S, WARM, HOME, WAIT, WELL, EVENING) are all new. None of
  White's four words appears.

**Rewards:** the frost-web window (a decoration: in winter it shows your Nubbin's name in white); a
SOMEBODY'S ribbon (cosmetic); Spindle's drawer label, "SPARE" (a keepsake for the journal).

**Learning Grove version:** yes. Spiders have eight legs and make silk. Some spin egg sacs, and
spiderlings "balloon" away on threads in the wind. Frost forms when water in the air freezes on cold
surfaces, which is why a web turns white. Reading and spelling with a spider: build each web word
letter by letter. Life cycles: autumn endings, spring beginnings.

**Care notes:** Spindle dies of old age, in her season, and offscreen. The empty web carries it, and
nothing is shown. The threat is being sold over the pass, never anything worse. The dealer is a
businessman, not a monster. Corvin is embarrassed into doing right, not humiliated. Spindle, the
runners and your Nubbin never speak: Spindle only writes, and Wisp's "Mine. Warm. Mine." is a
Shadow's whisper, which canon allows. Audience `all`. No repeatable chores.

## S28. Please Look After This Nubbin (*Paddington*, Grove side story)

**Why it works:** Michael Bond's bear is a stranger with a label round his neck. He is
unfailingly polite, and he causes chaos by trying hard to help. Bond said he was partly thinking
of the wartime evacuee children he had seen with labels and small cases. The Grove's Hollow is
full of strays. Hazel, the absent heart, sending one down the valley with a note, addressed to
the one Keeper who most needs something he can't measure, is pure Grove.

**When and where:** opens in chapter 8, the morning after you come back from the Hollow with the
notebook. Closes in chapter 11. It happens at Byte's house, at Mr Grue's next door with his
glasshouse, at the market and at the cart stop on the valley road. Hazel herself is not seen
until dawn in chapter 10.

**Your role:** you are the friend who keeps turning up. Byte is the one who takes the stray in.
You fetch jars, mop floors, search in the snow and say the right thing at the right moment. Your
Nubbin is the stray's first playmate, and it learns, alarmingly, to like marmalade.

1. **The Carrier's Cart.** The carrier's cart stops at the Grove gate. On a crate sits a small
   brown Nubbin, very upright, with a basket and a tag on string. The tag reads "Please look
   after this one. Thank you." Underneath it says "For Byte. H." The carter never saw who put it on:
   it was sitting on the milestone at the ford with a plum on top, for the fare. You know the
   handwriting from the letter. It doesn't tell you where she is, or how she is.
   **The choice:** tell Byte it's Hazel's hand, or keep it to yourself for now. This pays off in
   quest 14.
2. **One Jar.** In the basket is an empty jar, with a label in the same hand: "Marmalade.
   Hollow. Last of." The stray lived on it all the way. You fetch the six jars from Hazel's
   pantry, and Byte counts them twice. He names the stray Parcel, as in "Parcel, received".
3. **Hot Water.** Parcel arrived muddy from the Hollow, so Byte runs it a bath. Parcel politely
   turns both taps on full and waits to be told when to stop. The water goes under the door and
   into Mr Grue's garden. Mr Grue, over the fence: "NUBBIN!" Byte, mopping: "It stays until I've
   verified the sender. That's procedure."
4. **The Hard Stare.** Mr Grue comes round to talk about compensation. Parcel gives him a long,
   level look. Byte times it at eleven seconds. Mr Grue goes home.
5. **Byte's Log.** Byte opens a fresh notebook, "Parcel: Incidents". **The choice:** suggest he
   adds a column called "Good things", suggest one called "Unverified" (a nod to S7), or leave it
   alone, since it's his log. This pays off in quest 15.
6. **Elevenses.** Parcel has taken to carrying half a sandwich to Moss on the low wall at eleven.
   Today you go along.
   Moss says valuable things aren't always shiny. Moss and Byte do the shoelace joke.
7. **Null.** This quest reads `s7Done`.
   - **If S7 is done:** Null, who plays again now, adopts Parcel at once and steals marmalade off
     its sandwich. Byte logs it under the column you chose.
   - **If not:** the Minder is still ticking in Byte's front room. Parcel sits politely beside
     Null and waits for the bell too. Byte goes pale. It isn't his to train, and he knows it.
8. **A Shopping Expedition.** Market day: Parcel needs a coat for the autumn. It leans on a
   pyramid of jam jars at a stall. The jars come down, a crowd gathers, and the stall sells out
   by noon. The stallholder gives Parcel a jar. Byte buys a knitted coat with toggles.
9. **The Last Jar.** Byte worked out the six jars would last till midwinter. They don't, because
   Parcel shares. Byte shows you the graph. The last jar is empty in early winter, before
   chapter 9.
10. **Mr Grue's Glasshouse.** Mr Grue grows the valley's only bitter-orange tree. One evening in
    early winter Parcel is in the glasshouse with an orange in both paws, and Mr Grue has the
    lamp. Byte, in his dressing gown, steps between them. It's the first time he has stood up for
    anything that isn't a number. **The choice:** what you offer Mr Grue for the oranges: the first jar,
    a morning's weeding, or a hard stare of your own. This pays off in quest 15.
11. **The Setting Point.** You make marmalade: Byte, Parcel and you, with Mr Grue's oranges. Byte
    uses a thermometer. Hazel's recipe card says "cold saucer, push it, see if it wrinkles". Both
    work. Mr Grue gets a jar whatever you offered, and says he's taking it as evidence.
12. **Gone to the Cart Stop.** The first snow, before chapter 9. Parcel overhears Byte telling
    Mr Grue, "I never asked for it." It goes before he finishes the sentence. You and
    Byte find it in the snow under the cart-stop sign, holding its tag out to be sent back.
    Byte says the second half of the sentence: "...and I'm keeping it."
13. **The Coldest Hour.** Early in chapter 11, a short side scene. Byte tells you that at the worst of the night Parcel gave him half a sandwich, and his hands stopped
    shaking. He shows you the sandwich crust. He has kept it.
14. **Hazel.** In chapter 11, Hazel meets Parcel again. It bows. Byte asks her why him. Hazel:
    "You count things, love. I needed someone who'd count this one."
    - **If you told Byte in quest 1,** he has spent three chapters working it out. He tells her
      his theory, and he's right.
    - **If you didn't,** he finds out here, all at once, and has to sit down on the step.
15. **A Disappearing Trick.** Byte throws Parcel a welcome party, a very late one. Parcel does a
    trick with Mr Grue's pocket watch. The watch disappears into a napkin, then comes back in
    pieces. Mr Grue storms out. Pixel mends the watch, and Mr Grue comes back "for the
    marmalade". Then Byte reads his log aloud.
    - **With "Good things":** the good column is longer.
    - **With "Unverified":** everything good is marked unverified, and he crosses that out, one
      by one.
    - **With no new column:** he reads three pages of incidents, stops, and adds the column there
      and then.

**Consequences:**

- **Tier 3 (in the line):**
  - Quest 1's choice pays off in quest 14: Byte either works Hazel out himself or is floored.
  - Quest 5's column pays off in quest 15, so the line ends three ways.
  - What you offer Mr Grue in quest 10 decides how he comes back to the party in quest 15. If you
    promised him the first jar, he brings a bag of oranges. If you offered to weed his glasshouse,
    he brings a chair. If you gave him a hard stare of your own, he brings nothing, but he stays
    till the end.
- **Tier 2 (the Grove):** Parcel lives at Byte's house, which becomes a place you can visit. Byte
  gains softer lines across the Grove, and his log becomes a journal page. Mr Grue and his
  bitter-orange tree join the valley. Marmalade becomes a food item you can make
  whenever you like from Mr Grue's oranges and Hazel's recipe card (unlimited, never required).
- **Tier 1:** none.
- **Reads:** `s7Done` (Null and the Minder, quest 7) and `s8Reunited` (for colour only: if
  Bramble's youngest came down with Hazel, Parcel shares its sandwich with it in quest 14).
  **Line-local flags:** `s28Done`, `s28Told`, `s28Column` and `s28Offer`.

**Lifted text** (*Paddington*, Michael Bond, 1958 onwards, and the films, are under copyright.
There are two signature lines, each one sentence. All other dialogue is new. Both were
rechecked on 2026-10-14 against secondary sources: the label wording on the Paddington fan wiki
and publisher pages, and Aunt Lucy's line in several *Paddington 2* reviews.)

- The label, adapted: Bond's "Please look after this bear. Thank you." becomes "Please look
  after this one. Thank you." That's the tag (quest 1).
- "If we're kind and polite, the world will be right." This is Paddington quoting Aunt Lucy in
  *Paddington 2* (2017). Byte reads it, puzzled, off the back of Hazel's recipe card in quest 11.
  Hazel copied it there.

**Rewards:** a luggage-tag cosmetic ("Please look after this one"); a knitted coat with toggles
(cosmetic); a rain hat with room for a sandwich (cosmetic); Hazel's empty Hollow jar (decoration); a
bitter-orange cutting from Mr Grue (decoration).

**Learning Grove version:** yes. Being a good neighbour, and saying sorry and thank you. Measuring
in the kitchen: weighing, timing and the cold-saucer test. Bitter (Seville) oranges and why
marmalade uses them. What a label and an address are for. A gentle word about children who once
travelled with labels, and why welcome matters.

**Care notes:** The evacuee and refugee echo is real. Keep it warm and never sad for effect. Parcel
is never in danger in the snow for long. Mr Grue is a grump, not a villain. Keep Paddington's own
name, hat and duffle coat out of the art: this is a homage, not a licensed character. Parcel never
speaks: it is polite by bow, stare and gesture. Audience `all`. Marmalade-making is a one-time
quest, not a chore. Parcel's tag is in Hazel's hand, but nobody sees Hazel or learns how she is
before dawn in chapter 10.

## Pixel's Arcade (the frame)

After chapter 5, Pixel drags an old arcade cabinet out of the skip at the Workyard, Brisk
Hollins's sawmill upriver. It's dented, it smells of sawdust and there's a mouse nest in the coin
slot. Pixel gets it running in the lantern shed. Each cartridge is a world, and you step in with
your Nubbin. Pixel stays at the controls as "player two" and talks to you through the speaker.
If `s21Done`, Clank sits on top of the cabinet.

Like the Atlas, each cartridge has its own save. A cartridge may read Grove flags to change its
own scenes, and it never writes them. All ages. Finishing any two cartridges (PA1–PA5) unlocks
High Score Night.

## PA1. The Chao Altar (*Sonic Adventure*, Pixel's Arcade)

**Why it works:** *Sonic Adventure* (Sonic Team; Sega Dreamcast, Japan, 23 December 1998) is
where the Chao Garden began, and so it's this game's own ancestor. Under its speed there's a
grave old story:

- A gentle girl, Tikal, befriends the small creatures at a shrine, and their guardian, Chaos.
- Her father, Pachacamac, wants the Emeralds' power.
- When the Chao are hurt, the guardian's grief floods the world.
- Tikal seals it away with herself, and long after, it finds peace.

That is Cinder's story in another key: a protector who loved them most fiercely of all.

**How you get there and who comes with you:** you slot the cartridge into Pixel's cabinet. You
and your Nubbin come out in the Chao Garden at Station Square. Pixel talks through the
speaker. Tikal's light, a small ball of rosy light, guides you between the present and the
past.

**Your role:** you're a visitor, never Sonic. You carry Chao to safety, hand Tails his tools,
search for shards with Knuckles, hide a bird with Amy and watch the old days with Tikal. Your
Nubbin lives among the Chao and gets on with them at once, the way cousins do.

1. **The Cabinet.** Pixel blows dust off the cartridge and the screen glows. You step through.
2. **A Garden Like Ours.** Station Square's Chao Garden has eggs, fruit and small creatures with
   floating shapes above their heads. Your Nubbin is delighted. **The choice:** news of trouble
   in the city reaches the garden. Lock the gate to keep the Chao safe inside, or leave it open
   so they can come and go. This pays off in quest 17.
3. **The Water Creature.** Police surround a creature made of water in Station Square. Sonic
   arrives, and the creature (Chaos 0) slips away down a drain. Its face doesn't look cruel. It
   looks lost.
4. **The Light.** A rosy light finds you and pulls you into the past: a shrine around a great
   green Emerald, a pool full of Chao, and Tikal sitting among them. Chaos rises from the water
   to watch her, gentle, their guardian.
5. **Tails's Workshop.** In the Mystic Ruins, Eggman ambushes Sonic and Tails and takes Tails's
   Emerald. Chaos grows. Hand Tails the spanner and keep your head down.
6. **The Shattered Emerald.** Knuckles, the last of the echidnas, guards the Master Emerald.
   Eggman shatters it, Angel Island falls into the sea, and Knuckles goes hunting the pieces.
   Your Nubbin is good at finding green things.
7. **The Prayer.** Back in the past, Tikal says the prayer her grandmother taught her to the
   Master Emerald, and tries to understand it.
8. **Amy and the Bird.** In Station Square, Amy protects a small blue bird that Eggman's robots
   are hunting. Help her hide it. One robot, E-102 Gamma, hesitates.
9. **Big and Froggy.** Big the Cat is looking for his frog. Froggy has swallowed an Emerald and
   grown a tail like Chaos's. Help Big fish without hurting anything.
10. **Pachacamac.** In the past, Tikal's father leads the echidna clan and wants the Emeralds'
    power for conquest. Tikal pleads with him. You can stand beside her. It changes nothing,
    and it still matters.
11. **The Egg Carrier.** Eggman's flying fortress has a Chao Garden of its own on board. Get those
    Chao to the lifeboats. Chaos grows again, on the Emeralds Eggman feeds it.
12. **Gamma.** Gamma turns from Eggman, frees the birds trapped inside his brother robots, and
    doesn't come back. Show it gently: at the end, a bird flies free.
13. **The Charge.** In the past, Pachacamac's warriors charge the shrine. Tikal and the Chao stand
    in the way, and the Chao are hurt. Chaos rises in grief and fury, takes the Emeralds' power
    and destroys the attackers. The shrine burns. Tikal begs the Master Emerald to stop it, and
    it seals Chaos inside, with her. Keep it all offscreen: firelight and silence.
14. **The Ruins.** In the present, the old temple lies in the jungle, with murals of all of it.
    Tikal's light takes the shape of a girl for a moment, and she tells Sonic what Chaos is
    carrying.
15. **Perfect Chaos.** Chaos takes the last Emeralds' power and becomes vast, and water drowns
    Station Square. Eggman's new ship is swatted out of the sky. Carry Chao and people to the
    rooftops.
16. **Positive Energy.** Sonic's friends bring him the drained Emeralds, and Tails says to use
    what's left in them, the good. Sonic becomes Super Sonic. You hold the Chao and watch.
17. **The Chao.** Chaos, beaten back to its small shape, sees the Chao alive and at peace, and goes
    still and calm. Quest 2's choice decides how it sees them:
    - **If you left the gate open,** the Chao are already out on the rooftops, and Chaos sees
      them at once.
    - **If you locked it,** you have to wade back and open the gate you shut, and let them out.
      Pixel says, through the speaker, very quietly: "Safe isn't the same as well, is it."
18. **Tikal and Chaos.** Tikal comes back to Chaos, and the two go away together, at peace. This
    quest reads `cinder`:
    - **If forgiven,** you tell Tikal about a fierce one at home who was forgiven, and she smiles.
    - **If remembered,** you say "we remember ours", and your Nubbin gives a Chao a red petal.
    - **If unset,** Pixel half-chants Cinder's rhyme under her breath, through the speaker. The
      rhyme is the bible's own skipping rhyme, so it isn't a song lyric.

**Consequences:**

- **Tier 3 (in the line):**
  - Quest 2's gate choice pays off fifteen quests later, in quest 17.
  - Standing with Tikal (quest 10) gives her one more line in quest 18.
  - The ending's last image depends on both.
- **Tier 2 (the Grove):** Tikal's flower crown. Pixel's cabinet sits in the lantern shed, with its
  high-score plate for High Score Night.
- **Tier 1:** none. The cartridge never writes Grove flags.
- **Reads:** `cinder` (quest 18) and `s21Done` (Clank on the cabinet).

**Lifted text** (*Sonic Adventure* and its characters are © and ™ Sega. There are at most two
short lines, each one sentence, and all other dialogue is new. A commercial build needs a Sega
licence; without one, rename everything and keep only the shape of the story.)

- From Tikal's prayer: "The servers are the seven Chaos." Tikal says it in quest 7.
  [unverified: Chao Island's wiki prints "The servers are the 7 Chaos."]
- From Tikal's prayer: "Chaos is power... Power enriched by the heart." Tikal says it in quest
  13. [unverified: corrected on 2026-10-14 to Chao Island's wiki wording; the earlier "Chaos is
  power, enriched by the heart" was a paraphrase. Check both lines against the game's English
  script before use.]

**Rewards:** Tikal's flower crown (cosmetic); a little shrine pool with seven coloured pebbles
(decoration); the cabinet's high-score plate with your name (feature, for High Score Night).

**Learning Grove version:** no, because of the licence. If it's ever licensed, the topics would
be water and floods, and why game worlds borrow real places' names.

**Care notes:** The clan's destruction and Gamma's end are offscreen. Perfect Chaos's flood is
spectacle, with no one shown drowning. "Tikal" is a real Maya city and "Pachacamac" a real Andean
deity and site. Use them only as Sega does, and add no further real sacred material. Chaos is never
called evil: it is grief. The Chao and the creatures never speak; Tikal and the people of the
game do, as Sega wrote them. Audience `main`: all ages, but no Learning Grove version while the
licence question stands.

## S29. The Gates of Dawn (*The Wind in the Willows*, Grove side story)

**Why it works:** Grahame's book is the great English hymn to messing about by a river: to
friendship, homesickness, the dark wood and the lighted window. At its centre is a strange, holy
chapter where two friends row all night to find a lost otter cub, and are let forget what they
saw. That is the Grove's whole register, homely comfort and ancient awe, and its text is free
to lift.

**When and where:** opens in chapter 4, after Lantern Night. Closes when chapter 8 opens, which
is when Marina has the ledge path to guard. The story moves through the summer: the stream below
the Grove, Marina's tide pools and the river beyond the ridge, the Wild Wood on the slope under the
Circuit, Dusty's cliff, and an island above the weir on the last warm night of summer.

**Your role:** you're the third in the boat. Marina plays the Water Rat and Dusty plays the Mole.
Animals don't speak in the Grove, so the Badger becomes Granny Brock, a gruff charcoal-burner.
The otters are real otters, and the Sea Rat is a passing seafarer. You row, carry the lantern
and notice things. Your Nubbin sits in the bow, swims (Marina taught it) and, at dawn, glows.

1. **Hang Digging.** Dusty has been underground all spring, clearing out their burrow. They come
   up through the turf by the stream, blinking, and say "Bother!" and "O blow!" Marina is
   mending her boat at the bank.
2. **Messing About in Boats.** Marina takes you both out. Dusty has never been in a boat. Marina
   gives her famous opinion on boats. Your Nubbin takes the bow and won't give it up.
3. **The Picnic.** Marina's basket holds far too much. Downstream, a backwater: the otter family
   surfaces, a big dog otter and his kit, Portly. Portly steals a pickled gherkin.
4. **Dusty Takes the Oars.** Dusty insists on rowing, catches a crab and capsizes the boat. Marina
   fishes them out, dries them by the fire and says "never mind" until they believe it. The
   Nubbins swim ashore unbothered.
5. **Lessons.** Marina teaches you and Dusty to row properly and hands out cork vests. Portly
   follows the boat everywhere, so you give him something. **The choice:** a glass bead, a red
   ribbon or a tiny bell. This pays off in quest 14.
6. **The Low River.** High summer. This quest reads `s4Done`.
   If S4 isn't done, the river is a hand too low, and you carry the boat over the shallows
   ("Cold. In July."). If it is, you row clean up to the weir. Either way, Marina points out the island above the weir pool. Nobody lands there, she says,
   and she can't say why.
7. **The Wild Wood.** In chapter 5 there's frost in August. Dusty, restless, walks alone into the
   Wild Wood on the slope under the Circuit, where the cold is creeping down. It grows dark. Then
   the faces begin in the holes, and the pattering. Dusty hides in a hollow beech.
8. **Into the Wood.** You and Marina go in with a lantern and a stick. Marina knows the rules of
   the Wood: keep to the paths, don't run, keep talking. You find Dusty in the beech, frosted and
   ashamed. It's too cold and dark to get back.
9. **Granny Brock's Kitchen.** A door in a bank under old stones opens. Granny Brock, the
   charcoal-burner, lives in the ruins of a house older than anyone's grandmother. She grumbles,
   feeds you and puts you by the fire. "People come and go. The Wood stays. So do I." Dusty
   listens hard, the way people do when somebody at home is getting old. (No name: if S5 hasn't
   been played, Fossil isn't introduced until chapter 6.)
10. **The Long Way Out.** At first light Granny Brock leads you out through an old culvert under
    the ruins to the edge of the fields. Dusty, wobbly: "I'm a river person now."
11. **Dulce Domum.** This comes after chapter 6. Walking home along the river at dusk, below
    Dusty's cliff, Dusty stops dead. They have smelt home. They haven't been back since the rain
    on the hill. Marina hurries on, cold and hungry, and Dusty sits on a stump and cries. You go
    after Marina, and she turns back at once.
12. **Supper.** Dusty's house is chilly and dusty, with Fossil's empty basket by the stove (it
    reads `s5Done` for one remembered walk). Marina makes it cheerful, sending you for kindling
    and finding biscuits. Valley children come up the cliff path with a lantern and, out of
    season, sing a verse of The Lantern Song at the door, because they heard Dusty was home. Dusty sleeps at home again.
13. **Portly Is Missing.** It's the end of summer. Portly has been missing for days. The old otter
    waits at the ford every night and every dawn. Marina explains it in Grahame's words.
14. **Upriver by Night.** You and Marina row upstream in the dark. Quest 5's gift decides the
    search: the bead glints in the lantern beam on a mudbank, the ribbon has snagged on the reeds
    by the weir, or the bell rings once, far off, over the water. Then there's music that isn't quite music, and Marina stops rowing.
15. **The Island at Dawn.** You land. The air is warm, warmer than any night this summer, and
    smells of stone and water. In a hollow of grass pressed flat, as if something large sat there all
    night, Portly is asleep and safe. Your Nubbin glows. Marina is afraid and not afraid. Then a
    small wind comes, and you all forget, kindly. Leave it ambiguous: no figure and no name.
16. **Home to the Ford.** You row Portly home. The old otter is still at the ford. Marina can't
    quite say why she's crying. "Must've been the early start."
17. **Wayfarers All.** In chapter 7, autumn, a weather-brown seafarer walks up the valley road. He
    talks to Marina for an afternoon about the south, the coast and the big water. By dusk she's
    packing a bag with a faraway look. **The choice:** hold her back by main force (Dusty's way),
    sit down next to her and wait, or put a pencil in her hand and ask her to draw
    the tide pools for you. She stays in every branch. Nobody leaves.
18. **Laid Up.** As chapter 8 nears, you haul the boat up for the winter under the willows.
    Marina, Dusty and you are on the bank. The ending depends on quest 17. If you held her back,
    she's sore for a day, then thanks you. If you sat with her, she says nothing and leans on you.
    If you gave her the pencil, there's a drawing on the boathouse wall.

**Consequences:**

- **Tier 3 (in the line):** the gift for Portly (quest 5) shapes the night search nine quests
  later (quest 14). Quest 17 decides how the line ends, in quest 18. `s4Done` changes the route
  upriver (quest 6).
- **Tier 2 (the Grove):** Rowing: Marina's boat is usable on the stream and river. The river
  section, from the backwater to the weir, opens. The otter family lives on the river as ambient
  wildlife. Granny Brock's door is in the Wild Wood. Dusty's cliff house is lit again.
- **Tier 1:** none. No campaign flags. The island presence stays unexplained, as in the book, and
  adds nothing to the Grove canon. Marina once says the island seep is "same water as behind the
  falls, my gran reckoned". That's a hint, nothing more.
- **Reads:** `s4Done` (the river's height, quest 6) and `s5Done` (Fossil's remembered walk at
  Dusty's house, quest 12).

**Lifted text** (Kenneth Grahame, *The Wind in the Willows*, first published by Methuen in 1908.
Checked against the 1913 Scribner's text on Project Gutenberg (#27805) and the 1908 text on
Lit2Go. "the Mole" becomes Dusty, "the Rat" becomes Marina, and Dusty is they/them. Rechecked
2026-10-14 against #27805: the Chapter I and III lines match, including the italic *nothing*.
Gutenberg's page was cut off here in Chapter IV, so the Chapter V and VII lines are
[unverified] against #27805; an earlier pass checked them against Lit2Go and
americanliterature.com):

- "Bother!" and "O blow!" and also "Hang spring-cleaning!" (Ch. I). For quest 1, Dusty's version
  ends "Hang digging!"
- "Believe me, my young friend, there is *nothing*—absolute nothing—half so much worth doing as
  simply messing about in boats." (Ch. I). Marina says it, in quest 2.
- "O stop, stop!" cried the Mole in ecstasies. "This is too much!" (Ch. I). Dusty says it, at the
  basket in quest 3.
- "Then the faces began." (Ch. III). Narration, in quest 7.
- "What a capital little house this is!" (Ch. V). Marina says it, in quest 12. [unverified]
- "Little Portly is missing again; and you know what a lot his father thinks of him, though he
  never says much about it." (Ch. VII). Marina says it, in quest 13. [unverified]
- "So Otter goes there every night and watches—on the chance, you know, just on the chance!"
  (Ch. VII). Marina says it, in quest 13. In the valley, "Otter" becomes "the old otter".
  [unverified]
- "Afraid! Of HIM? O, never, never! And yet—and yet—O, Mole, I am afraid!" (Ch. VII). Marina
  says it, in quest 15. Adapted to "Afraid! Of *that*? O, never, never! And yet—and yet—O, Dusty,
  I am afraid!", so that no being is named. [unverified]

Not lifted: the field-mice's carol, which is a song. The Lantern Song from the bible takes its
place.

**Rewards:** Marina's boat, rowing on the stream and river (a feature); a cork vest for your Nubbin
(cosmetic); a willow-pattern picnic rug (decoration); Portly's gift, returned with a pebble (a
keepsake).

**Learning Grove version:** yes. Rivers: source, backwater, ford, weir and island. Otters: how they
live, and why clean rivers matter. Water safety: buoyancy vests, and never rowing alone.
Homesickness, and how to help a friend who misses home.

**Care notes:** Water scenes always have vests and Marina. The Wild Wood is spooky, not violent. The
"faces" are never shown clearly. The dawn presence is deliberately unexplained, with no god added to
the canon. It suits all faiths and none. Fossil's absence is a tender beat, kept brief. Toad is left
out: his motor-car caper is a comic crime story that would pull the line away from the river and
Marina. The otters never speak; Granny Brock and the seafarer are people. Audience `all`.

## The other 25, outlined

Ranks 16–40, in ranking order, at the same depth as the top 15.

## A18. The Doll in the Pocket (*Vasilisa the Fair*, Afanasyev's collection, Russia; the Atlas)

**Why it works:** a dying mother gives her small daughter a doll and one rule: feed it, and it
will help you. The girl goes without so the doll can eat, and the doll carries her through a
stepmother's house, a dark forest and Baba Yaga's yard. That is Hazel's first rule as a fairy
tale: feed them before you feed yourself. Baba Yaga is frightening and fair; she pays for work
and hates nosiness. And the tale ends quietly, with the doll still in the girl's pocket.

**When and where:** the page opens once Nova's atlas is in the Grove. It shows a merchant's
wooden house, a birch wood behind it, and a fence of pale sticks in the far dark. You and your
Nubbin step in as lodgers with the merchant's family; the merchant once traded with Nova.
This is Afanasyev's tale, not any film or cartoon version.

**Your role:** a lodger who becomes Vasilisa's friend and keeps her secret. Vasilisa is the
hero; only she can ask Baba Yaga for fire. Your Nubbin is about the doll's size. It watches
the doll eat with great interest, and the doll, as far as anyone can tell, watches it back.

**The quests:**

1. **The Counterpane.** Vasilisa is eight. Her mother is dying. She calls the girl to her bed,
   takes a little doll from under the counterpane, and gives her the doll and one rule. You wait
   at the door with your Nubbin. A grave, quiet scene; the mother's death happens after it.
2. **Dollet, Eat.** In the cellar, Vasilisa sets out the best bits from her own plate and asks
   the doll to eat and listen. Its eyes shine; it eats; it comforts her. She makes you promise
   never to tell. You learn the words, and how to set the food out.
3. **The Widow.** The merchant remarries a widow with two daughters. They give Vasilisa all the
   work, hoping she'll grow thin and plain in the sun and wind. Each morning the doll has done it
   all (the beds weeded, the water carried in, the stove hot) while Vasilisa picks flowers. Help
   her look busy when the stepmother comes round.
4. **Suitors.** Years pass. Young men come to the gate for Vasilisa and none for the sisters.
   The stepmother sends every one away: no youngest before the elders. You hold the gate for the
   last of them, and see him go.
5. **The House by the Forest.** The merchant leaves on a long journey. The stepmother sells the
   house and moves them all to the edge of a dark forest where Baba Yaga lives, and sends
   Vasilisa there on errands. The doll always brings her home. Go with her once, and learn the
   path.
6. **One Candle.** An autumn evening: lace, a stocking and spinning by a single candle. The
   stepmother has put out every other fire. One sister trims the wick "by accident" and the
   light goes. "Go to Baba Yaga for fire." Vasilisa feeds the doll and asks what to do. Its
   answer is to go, and to keep it in her pocket. You go too.
7. **The Three Riders.** All night through the wood. At dawn a rider all in white on a white
   horse passes, and the day comes. At sunrise, a rider all in red. At dusk, by the hut, a rider
   all in black, and night falls. Your Nubbin hides in your coat for the black one.
8. **The Hut.** A fence of old bones with skulls on the stakes, whose eyes light up after dark.
   Baba Yaga comes out of the wood in her mortar, rowing with the pestle and sweeping her tracks
   with a broom. She sniffs the air and asks who's there. Vasilisa asks for fire. Baba Yaga says
   she'll have it if she works for it, and you too, since you're here.
9. **Supper for Ten.** Baba Yaga eats enough for ten and leaves Vasilisa a little soup, a crust
   and a scrap of pork. Vasilisa gives hers to the doll. There's a crust for you too, and your
   Nubbin is hungry. **Choice:** give your crust to your Nubbin, give it to the doll for
   Vasilisa, or eat it yourself, since tomorrow is long. Pays off in quests 10, 13, 15 and 16.
10. **The First Day.** Baba Yaga flies off at dawn with a list: sweep the yard, clean the hut,
    cook, wash, and sift a quarter of oats. Vasilisa sleeps, as the doll told her; the doll does
    it all. You help where you can. At dusk Baba Yaga finds no fault, and calls on her servants:
    three pairs of hands appear from nowhere and carry the oats away.
11. **The Second Day.** Someone has mixed earth into the hay in Baba Yaga's field, out of spite;
    every trace must come out. The doll does it again. That night Baba Yaga tells the hands to
    make her poppy-seed oil, and they carry the poppy off.
12. **Questions.** Baba Yaga lets Vasilisa ask her things. Who were the riders? Her bright day,
    her red sun, her dark night: her faithful servants. Vasilisa thinks of the hands and doesn't
    ask. Then Baba Yaga asks how she got through the work. "By my mother's blessing!" Baba Yaga
    throws her out of the yard, with a skull from the fence on a stick for her fire.
13. **The Skull on a Stick.** Home through the dark by the skull's light. Vasilisa is frightened
    of it and wants to throw it away; a voice from the skull tells her not to, and to bring it to
    her stepmother's house. You carry it the last stretch so her arms can rest.
14. **No Fire.** Since she left, the house hasn't held a light: every flame they brought in went
    out. They take the skull in. Its eyes stare at the stepmother and her daughters wherever they
    hide, all night. In the morning they are gone, and only Vasilisa (and you) are left. She
    buries the skull, locks the house and walks to town. (Softened: see the care notes.)
15. **The Loom.** A poor old woman takes Vasilisa in until her father comes home. Vasilisa
    spins flax so fine that no loom will take it. The doll asks for an old comb, a shuttle and a
    horse's mane, and by morning there's a loom. She weaves all winter and bleaches the linen in
    spring. Help with the bleaching on the grass.
16. **Twelve Shirts.** The old woman takes the linen to the Tsar as a gift. No one at court can
    sew it, so it comes back: will the weaver make shirts? Vasilisa sews twelve. The Tsar asks
    to meet the seamstress, and won't let her go. They marry. Her father comes home. She takes
    the old woman to live with her, and the doll stays in her pocket.

**Consequences:**
- **Tier 3 (in the line):** *The crust (Q9 → Q10, Q13, Q15, Q16).*
  - **Your Nubbin:** it sleeps well and helps with the oats in Q10. In Q13 it walks ahead in the
    skull's light, unafraid. Baba Yaga, at the gate in Q12, sniffs: "Someone here feeds others
    first. I can smell it." In Q15, while you work, it sleeps curled in the flax.
  - **The doll:** fed twice, it does your share of the work as well as Vasilisa's in Q10. In Q15
    it builds a second, tiny loom and weaves a cloth the size of a handkerchief. In Q16 Vasilisa
    gives it to you: "She wants your little one to have something."
  - **Yourself:** you do your share by hand in Q10 and Q11, slowly. Baba Yaga grunts "Honest, at
    least," and pays you a fair handful of oats in Q12. In Q16 you sew one of the twelve shirts
    yourself, and the Tsar picks yours out as the plainest.
  - **Endings:** in every path the doll ends in Vasilisa's pocket. What changes is what you take
    home: the handkerchief cloth, a bag of Baba Yaga's oats, or a single plain shirt button.
- **Tier 2 (the Grove):** the doll charm, a little painted doll your Nubbin carries in a pocket
  of its own. If the doll wove for you, its handkerchief cloth lines your Nubbin's bed. The Long
  Table bookmark: at the festival, an empty place is laid with the best morsels, "for the doll".
- **Reads:**
  - `s24Done`: Hazel's margin note beside the cellar scene. "Feed them first. Somebody's mother
    said it before I did. H."
  - Sable's trust stage: if Sable is bonded, she is under the cottage table when you shut the
    atlas, and the doll charm is in her paws.

**Lifted text** (Leonard A. Magnus's 1915 translation, *Russian Folk-Tales*, Project Gutenberg
#62509, "Vasilísa the Fair"; checked against the Standard Ebooks edition of the same text, since
the Gutenberg plain text was blocked from here. Magnus calls the doll "Dollet"; on screen it can
stay "Dollet" or become "little doll"):
1. "Vasilísushka, hear my last words. I am dying, and I will leave you my mother's blessing and
   this doll." (The mother, Q1.)
2. "Keep this doll always by you, but show it to nobody, and no misfortune can befall you."
   (The mother, Q1.)
3. "Vasilísa often ate nothing herself, and kept the tastiest morsels for the doll;" (Q2,
   narration.)
4. "Dollet, eat and listen to my misery." (Vasilisa, Q2 and Q6.)
5. "Eat, pray, and lie down to sleep, for the morning is wiser than the evening." (The doll, Q6
   and Q10.)
6. "Ask, but not every question turns out well: too knowing is too old." (Baba Yaga, Q12.)
7. "By my mother's blessing!" and "Ah, then, get off with you as fast as you can, blessed
   daughter; no one blessed may stay with me!" (Q12.)
8. "and the doll ever remained in her pocket." (Q16, the last line, a fragment.)

**Rewards:** the doll charm; the handkerchief cloth (choice path); a skull-shaped lantern shade
in carved birch, with no bone; a little mortar-and-pestle planter; the Long Table bookmark.

**Learning Grove version:** yes, softened, without lifted text. A child learns how flax becomes
linen (pulling, retting, spinning, weaving, bleaching in the sun); the birch forests of eastern
Europe; day, sunrise and night as the three riders (why the sky changes colour); that the same
tale is told in many East Slavic places, with Baba Yaga in Ukrainian, Belarusian and Polish
stories too; and why sharing your food is a kind of care.

**Care notes:**
- **Softened for All, and we say so.** In Afanasyev the skull's eyes burn the stepmother and her
  daughters to cinders. Here its stare drives them from the house in the night, and they don't
  come back. No burning is shown or described. The fence's bone details (feet for doorposts,
  hands for bolts, a mouth for a lock) are cut to "a fence of old bones".
- **Death and illness.** The mother's death is one gentle scene, like Fossil's. Nothing about
  the illness is named.
- **Culture.** The tale is shared across East Slavic folklore. Keep the setting a folk-tale
  village, not a modern country, and use no flags, state symbols or political imagery. Cut Baba
  Yaga's "Russian smell" rhyme. Commission an adviser on East Slavic folklore before scripting.
- **Faith.** The mother's blessing and the doll's "pray" are part of the tale. Keep them brief
  and respectful.
- Baba Yaga is frightening but never cruel on screen: she threatens, sets work, and keeps her
  word. Rated All.

## PA2. The Clone Island (*Pokémon: The First Movie*, Pixel's Arcade)

**Why it works:** *Pokémon: The First Movie* (*Mewtwo Strikes Back*; OLM for Toho, Japan, 18 July
1998; English release November 1999) is the story of a creature made in a tank who wakes up
and asks who made him, and what for. The answer he gets is "a weapon", and he decides the whole
world owes him. It ends because a boy steps between two blasts and every creature on the island,
made or born, cries for him. That is the Grove's question too: Byte once built Null a bell for
everything, and Null waited to be told. A made thing is still a someone, and what it does with
its life is what counts.

**Which version:** we follow the Japanese *kanzenban* cut, with its ten-minute origin short (*The
Birth of Mewtwo*), because the short holds the film's heart. Names are the English ones (Ash,
Misty, Brock, Dr. Fuji). The dub's added "violence is wrong" framing is left out; the story
makes that point on its own.

**How you get there and who comes with you:** you slot the cartridge into Pixel's cabinet in
the lantern shed. You and your Nubbin come out on a hillside above a harbour town. Pixel talks
through the speaker as player two. Byte has come to "check the maths" and stands behind Pixel's
chair. If `s21Done`, Clank sits on top of the cabinet.

**Your role:** you're a visiting trainer with an invitation, never Ash. Your Nubbin is not a
Pokémon, which matters: Mewtwo has never seen one and has no record of it. You carry, hold
doors, open pods, and stand at the edge of the storm. You don't battle.

**The quests:**

1. **The Cabinet.** Pixel blows dust off a cartridge with a purple shape on its label. If
   `s7Done`, Byte stops talking as soon as the title comes up and doesn't start again. If not,
   Byte says you can't clone anything from an eyelash, not reliably, and goes for a biscuit.
2. **The Voice in the Tank.** The origin short. A dark lab, a tank, and a newly woken mind. A
   girl's voice (Ambertwo, a copy of Dr. Fuji's late daughter) talks to him about the sun, and
   about crying. Copies of three Pokémon float beside them. One by one, the copies fade, and so
   does she. Mewtwo has no word for what he feels, and Fuji puts him back to sleep. You can only
   watch; Pixel says the prologue doesn't let anyone touch it.
3. **The Awakening.** Mewtwo wakes for good and Fuji tells him he is an experiment. From the
   cliff you see the lab go up in fire and rain. Nobody is shown. A helicopter lands: Giovanni,
   the man who paid for all of it, offers to teach him to use his power.
4. **The Armour.** Giovanni puts Mewtwo in armour and has him win battles at the Viridian Gym.
   You watch from the stands as Mewtwo works out that he's a tool. He breaks the armour, breaks
   Team Rocket's headquarters, and flies home to New Island. Byte, if `s7Done`: nothing. Pixel,
   very quietly: "He asked what he was for, and somebody answered."
5. **The Lunch Battle.** Ash, Misty and Brock are having lunch when a trainer called Raymond
   challenges Ash, and loses. A Dragonite lands with letters. One has your name on it. A
   hologram of a cloaked woman invites the world's best trainers to New Island.
6. **Old Shore Wharf.** The harbour's Pokémon Center has no Nurse Joy, and a storm has closed
   the ferry. Miranda, the pier keeper, tells an old story: once the sea drowned people in a
   storm like this, and a Pokémon's tears brought them back. Help her make tea while she tells
   it. Remember the story.
7. **The Boat.** Two oddly dressed boatmen (Team Rocket, very badly disguised) offer a ride. The
   storm turns the boat over. Ash's Squirtle and Misty's Staryu carry everyone. Keep your Nubbin
   above the waves; it holds its breath the way Marina taught Hazel's Nubbins.
8. **New Island.** The cloaked woman leads you to a hall where three other trainers wait:
   Neesha, Fergus and Corey. Brock is sure he knows her. Mewtwo appears, frees her from his
   control (she's the missing Nurse Joy), turns a Gyarados's beam back on itself, and says that
   humans and Pokémon both deserve what's coming. Then he looks at your Nubbin for a long time
   and asks what it is.
9. **The Lab.** Below the castle, Team Rocket find the cloning pods and Fuji's old recording, and
   the machine copies Meowth from one hair. A tuft of your Nubbin's fluff is on the floor; the
   machine takes that too. A second Nubbin wakes in a pod: the same shape, darker, with its
   markings the wrong way round. It looks at you as if you should know what it's for.
   **The choice:** call it by your Nubbin's name, or tell it it gets a name of its own and give
   it one. This pays off in quests 13, 16 and 18.
10. **Clones and Originals.** Mewtwo sets his clones against the trainers' best: Venusaur,
    Charizard and Blastoise lose. His dark Balls start taking everyone's Pokémon to be copied.
    Misty hides Togepi in her bag; you hide your Nubbin in your coat.
11. **Pikachu's Run.** Pikachu is the last one free. Ash shields him, and they both fall. Ash
    follows the Ball underwater into the lab and wrecks the machine. The pods open. Help pull
    the last ones free; your Nubbin squeezes in where your hands won't fit.
12. **Mew.** Ash flies at Mewtwo and is thrown at the castle wall. A pink bubble catches him: Mew,
    small, pink and laughing, who has been following Team Rocket for fun. Mewtwo fires at Mew,
    and the blast hits Ash instead. Your Nubbin and Mew play tag through the rafters for a
    moment, which is the last nice moment for a while.
13. **The Fight Without Powers.** Mewtwo forbids special powers, and originals and clones fight
    with their bodies. It is ugly and nobody wins. Pikachu won't hit his clone back. Meowth and
    his clone sit down and agree that they ache in the same places. Your Nubbin and its clone
    play out quest 9's choice:
    - **If it has its own name,** the two of them sit side by side, like the Meowths.
    - **If it has your Nubbin's name,** the clone thinks there's only room for one of them. It
      shoves your Nubbin, again and again. Your Nubbin won't shove back.
14. **Between Them.** Mew and Mewtwo gather their biggest blasts. Ash runs between them. He is
    turned to stone. Pikachu tries to wake him with thunder, over and over.
15. **Tears.** Every creature on the island cries, made or born, and the tears float to Ash and
    he wakes, the way Miranda's story said. Byte reads `s7Done`:
    - **If S7 is done,** Byte says, to nobody: "I gave Null a bell for everything. I never asked
      Null what it wanted." Pixel reaches back without looking and holds his sleeve.
    - **If not,** Byte has come back with the biscuits and stops chewing.
16. **What You Do With It.** Mewtwo understands. He'll go with his clones to find a place where
    they can live, and he'll take the memory of the day away with him. Before he does, quest 9
    pays off:
    - **Own name:** the clone looks at you, says its name in a Nubbin chirp, and goes with the
      clones. Mewtwo nods to it as an equal.
    - **Your Nubbin's name:** Mewtwo asks the clone its name and it gives your Nubbin's. Mewtwo
      says that name was already taken before it woke. You get one last chance to name it. If
      you do, it goes as itself. If you don't, it goes without one, looking back.
17. **The Wharf Again.** Everyone wakes at the Pokémon Center as if nothing happened, and the
    storm is clearing. Ash sees something pink in the clouds. Misty says it's nothing; Brock
    isn't sure. Only you remember. Pixel says the cartridge's save remembers too.
18. **Team Rocket's Holiday.** Jessie, James and Meowth wake on an island that's suddenly green
    and decide to take a holiday. The ending's last image: the attract screen on Pixel's cabinet
    now shows a far mountain with the clones on it, and among them the second Nubbin, with its
    name under it if it has one, or a blank if it doesn't.

**Consequences:**

- **Tier 3 (in the line):**
  - Quest 9's naming choice pays off four, seven and nine quests later (13, 16, 18).
  - The ending varies three ways: the clone leaves named from the start, named late, or
    nameless and looking back. The cabinet's attract screen keeps that image for good.
- **Tier 2 (the Grove):** none beyond cosmetics. The cabinet's high-score plate counts towards
  High Score Night (frame).
- **Tier 1:** none. The cartridge never writes Grove flags.
- **Reads:**
  - `s7Done`: Byte's silence in quests 1 and 4, and his line in quest 15.
  - `s21Done`: Clank on the cabinet (frame).

**Lifted text** (*Pokémon* is © Nintendo, Game Freak and Creatures, and the film is © The
Pokémon Company and its producers; at most three one-sentence lines, and all other dialogue is
new. A commercial build needs a licence from The Pokémon Company; without one, rename
everything and keep only the story's shape):

1. Mewtwo, in quest 16: "I see now that the circumstances of one's birth are irrelevant." (The
   4Kids English dub, as printed in *The Art of Pokémon, The First Movie*.)

Only one line is used. The film's songs, including the end-credits song, are not used at all.

**Rewards:** a tuft-of-fluff locket for your Nubbin (cosmetic); Miranda's storm lantern
(decoration); a pink-bubble emote; the cabinet's high-score plate.

**Learning Grove version:** no, because of the licence. If it's ever licensed: what twins and
clones share and don't, why storms close harbours, and how stories about tears and healing turn
up in many cultures.

**Care notes:**

- **Deaths.** Ambertwo and the copies fade in quest 2, softly, like a Nubbin fading: light going
  out, no bodies. Fuji and his team die in the lab fire in the film. Here it is fire seen from
  the cliff, and no one is shown or named as dead. Give a soft content line before quest 2.
- **The fight without powers** (quest 13) is shown as sad, never exciting: no hit sounds, slow
  music, and the camera on Pikachu's face.
- **Ash turned to stone** is a sleep, not a death, and the tears wake him within the quest.
- **Your Nubbin's clone** is never a monster or "the evil one". It's frightened and new.
- All ages, with the soft line before quest 2.

## A19. The Dragon Who Fell (*How to Train Your Dragon*, Britain and the Norse world, Atlas)

**Which version, and why:** the 2010 DreamWorks Animation film (dir. Chris Sanders and Dean
DeBlois; released 26 March 2010), loosely based on Cressida Cowell's 2003 novel. The two differ a
lot. In Cowell's book every young Viking must catch and train a dragon, and Toothless is tiny,
common and rude. In the film the village kills dragons, Toothless is a rare Night Fury, and a
boy who brings one down can't bring himself to kill it. The ranking's pitch ("a boy who can't
kill the dragon he brought down; trust through slow hands") is the film's plot, so we follow
the film. The 2025 live-action remake tells the same plot, but our page follows the 2010 one.

**Why it works:** it's the Grove's own method in another key. Hiccup learns a frightened
creature by sitting still, holding out a hand, and looking away. He makes a new tail fin for the
dragon he lamed, and the dragon carries him when he loses a foot. Neither is mended back to how
they were, and both are loved. Sable came the same way: in the night, frightened, and only
for someone who waited.

**When and where:** the page opens once Nova's atlas is in the Grove. Berk, a wet, windy Viking
island. You and your Nubbin come in on a supply boat and lodge above Gobber's forge. Gobber
thinks your Nubbin is a dragon hatchling from somewhere far south, and decides not to ask.

**Your role:** an apprentice at the forge, beside Hiccup, never in his place. You pump the
bellows, carry fish, keep his secret, and sit at the edge of the cove. Your Nubbin is about the
size of the small dragons, which is useful and occasionally embarrassing.

**The quests:**

1. **This Is Berk.** A dragon raid at night: sheep vanish, roofs burn, everyone shouts. Hiccup,
   the chief's skinny son, is told to stay in the forge. You pump the bellows while he wheels
   out his home-made bola launcher.
2. **The Night Fury.** Hiccup fires into the dark at the dragon nobody has ever seen, and
   something falls beyond the ridge. Only you saw it too. A big dragon chases him, his father
   Stoick drives it off, and nobody believes him.
3. **The Fleet Sails.** Stoick takes the ships to look for the dragons' nest. Before he goes, he
   puts Hiccup in dragon training with the other teenagers. Gobber, the one-handed smith, will
   teach them. Hiccup's notebook is full of drawings of things he wants to kill.
4. **The Bound Dragon.** In the woods, a black dragon lies tangled in Hiccup's bola ropes. He lifts
   his knife and can't. He cuts the ropes instead. The dragon pins him, roars in his face, and
   leaves. Your Nubbin is terrified. **The choice:** scoop your Nubbin up and run, or crouch where
   you are and let it come to you. This pays off in quests 8, 11 and 18.
5. **Dragon Training.** The arena. A loose Gronckle and a lot of noise. Astrid is very good and
   very cross. Fishlegs knows every dragon's numbers by heart. Snotlout shows off, and the twins,
   Ruffnut and Tuffnut, argue. Hand out shields. Hiccup is hopeless.
6. **The Cove.** Hiccup finds the dragon trapped in a hollow with a lake: half its tail fin is torn
   away, and it can't fly out. He sits on a rock and draws it. You sit further back.
7. **The Knife.** Hiccup brings a basket of fish. The dragon won't come near until he takes the
   knife from his belt and throws it into the water. Then it eats, and coughs up half a fish for
   Hiccup, who eats it too, gagging. It tries to smile, and has no teeth showing. He calls it
   Toothless.
8. **The Hand.** Toothless draws in the dirt with a stick; Hiccup steps carefully through the
   lines. Then Hiccup holds out his hand, closes his eyes and turns his face away, and Toothless
   pushes his nose into it. This reads `sableFirst` and quest 4 (see the Reads).
9. **The Tail Fin.** Back at the forge at night, Hiccup builds a leather tail fin and a saddle,
   and you hold the lamp. He straps it on. The first flights go straight into the lake. He adds
   a pedal to steer it, and learns to fly together with the dragon.
10. **Top of the Class.** In the arena, Hiccup wins every round without hurting anything: a
    handful of special grass, an eel that scares Nadders, the spot under a Gronckle's chin.
    Everyone cheers. Astrid narrows her eyes. Stoick comes home with no nest found, and is proud.
11. **The Flight.** Astrid follows Hiccup to the cove. To stop her running to the village,
    Hiccup takes her flying. Toothless spins her about until she says sorry, then slows into a
    long evening flight above the clouds. Quest 4 pays off: if you crouched, Toothless lets your
    Nubbin ride in Hiccup's lap; if you ran, it watches you from the ground and won't.
12. **The Nest.** In fog, Toothless is pulled off course into a volcano full of dragons. They drop
    their catch into a pit for something huge: the Red Death, which eats a slow dragon whole.
    They're raiding Berk to feed it, or be eaten. Astrid wants to tell the village. Hiccup begs
    for time; they'd kill Toothless. Be quiet with them on the flight home.
13. **The Final Exam.** Hiccup must kill a Monstrous Nightmare in front of everyone. He drops his
    shield and helmet and holds out his hand, and it calms. Stoick bangs the cage with his
    hammer, and it goes wild. Toothless hears Hiccup and comes. The village catches him. Hiccup
    lets slip that Toothless can find the nest. Stoick disowns him and sails, with Toothless
    chained on the lead ship.
14. **What Astrid Asked.** Hiccup sits on the cliff. Astrid asks why he didn't kill the dragon in
    the woods, and he tells her. Then she asks what he's going to do about it.
15. **Training Dragons.** The training dragons are still in their pens. Hiccup shows the others
    how to touch them: hand out, slow. Help match each teen to a dragon. Fishlegs gets the
    Gronckle and cries with joy. Then they fly after the fleet.
16. **The Red Death.** Stoick's army breaks open the mountain, and the Red Death comes out and
    burns the ships. The teens arrive on dragonback and draw it off. Hiccup dives for Toothless,
    chained in a sinking ship. Stoick pulls the chain free, and says sorry to his son.
17. **The Fall.** Hiccup and Toothless lead the Red Death up and up, then dive. It follows them down
    and can't pull out. The fire takes Toothless's tail fin and Hiccup slips off in the smoke.
    Toothless dives after him. Stoick finds them on the burning shore: the dragon has wrapped
    himself round his son, and Hiccup is alive.
18. **Twelve Days North.** Hiccup wakes at home with Toothless on his bed. His left foot is gone,
    and Gobber has made him a new one. Outside, dragons live in the village. Toothless has a new
    tail, and Hiccup a new step, and they go flying. Quest 4 pays off:
    - **If you crouched,** Toothless drops a whole fish at your Nubbin's feet, and Hiccup gives
      you a small saddle with a tail-fin badge, sized for your Nubbin.
    - **If you ran,** Toothless keeps his distance, until the very last scene, when you sit on
      the cliff and wait, and he comes and sits too. Hiccup gives you the saddle anyway.

**Consequences:**

- **Tier 3 (in the line):**
  - Quest 4's choice pays off four, seven and fourteen quests later (8, 11, 18).
  - The ending's last image is either Toothless's gift of a fish, or the long wait on the cliff
    that ends with him sitting down beside you.
- **Tier 2 (the Grove):** the tail-fin saddle (a cosmetic your Nubbin can wear in the Grove). The
  "Great Voyage" festival bookmark.
- **Reads:** `sableFirst` (slow or grab), in quest 8:
  - **Slow:** you remember the first night with Sable, and you sit very still at the edge. Hiccup
    finds his own way to the hand. You don't teach it to him; you just know it when you see it.
  - **Grab:** you remember Sable bolting into the dark. When your Nubbin starts towards
    Toothless, you put a hand out, not to grab, just to slow it.
  - **Unset** (shouldn't happen once the atlas is in the Grove): no memory line.
  - Quest 18 adds one narration line either way: "Some things come back if you wait. Some things
    you have to wait for twice."

**Lifted text** (the film is © DreamWorks Animation, now part of Universal; the books are ©
Cressida Cowell. At most three one-sentence lines, and all other dialogue is new. A licence from
DreamWorks Animation is needed to ship):

1. Hiccup's opening narration, in quest 1: "It's twelve days north of Hopeless, and a few
   degrees south of Freezing to Death."
2. Hiccup to Astrid, in quest 14: "I wouldn't kill him, because he looked as frightened as I
   was."

Both are from the 2010 film as widely quoted (Sideshow's quote list); check them against the
licensed script. No music is used. Nothing is taken from Cowell's books.

**Rewards:** the tail-fin saddle (Tier 2, above); a page from Hiccup's sketchbook, Toothless in
charcoal (decoration); a fish basket by the pond (decoration); a dragon-scale shield over the
cottage door; the "Great Voyage" bookmark.

**Learning Grove version:** yes. A child learns how Viking-age people lived on cold islands
(longhouses, longships, fishing), and that Berk itself is invented; how real animals learn to
trust, by quiet, food and patience, never by grabbing; how a tail or a rudder steers; and that
prosthetic legs and feet let people run, walk and dance, and are nothing to hide.

**Care notes:**

- **Hiccup's lost foot** is shown the way the film shows it: plainly, with no blood, and as
  something he and Toothless now share. Never a tragedy, never fixed. Work with an adviser who
  has a limb difference on the waking scene.
- **Dragon killing.** The village's plan to kill dragons is shown, but no dragon dies on screen
  except the Red Death, whose end is a fall and a fire, seen from far off. The dragon in the
  nest is swallowed offscreen.
- **The Norse world** here is the film's comic one. Keep oaths like "Odin's beard" to the film's
  light level, and add no religious practice. Modern Heathenry is a living faith; we show none
  of it.
- **Stoick disowning Hiccup** is grave. Keep it short, and keep the apology in quest 16 just as
  clear.
- All ages. There's peril and fire, but nothing that can't be softened as above, so this isn't
  `teen`.

## S30. What Sad Is For (*Inside Out*, Pixar, 2015 and 2024; Grove side story)

**Why it works:** *Inside Out* is about a girl whose Joy tries so hard to keep her happy that
she stops her being able to ask for help. Its great discovery is that sadness has a job: it
tells the people who love you where to find you. That is the Grove's own lore. Hush kept the
valley's griefs so they wouldn't get "dropped all over the valley" (S1), and chapter 6 has
just put a flower on the hill. The sequel adds a worry that tries to keep everyone safe, which is our
"safe is not the same as well" in a small, funny, domestic key.

**When and where:** opens after `c6-close` (Fossil's farewell). Closes when chapter 9 opens,
so it never touches Book Three's crowded days. It runs from late summer (ch6) through the
first frosts (ch7) to early autumn (ch8). It happens at Clover's cottage down the lane (deep
kitchen windowsill, a shed, a rain butt), the Grove, the hill, Hush's old wall and Dusty's
striped cliff.

**Your role:** Clover's helper and a second pair of eyes. The heroine is Dimple, one of
Clover's Nubbins. Nubbins don't speak, so her feelings show in behaviour: her face, her mood
ball, and what she does with her things. The Keepers each meet her grief their own way: Sparks
cheers, Byte counts, Ember sees anger, Luna sees the night, Dusty grieves, Clover fusses. Your
Nubbin follows Dimple about and copies her. Clover's household is a light nod to the film,
never a copy: Dimple (gold, bouncy), Drizzle (pale blue, slow, loves rain), Bristle (stamps),
Flinch (jumps at everything) and the fussy one (she; the red-food Nubbin of the Hebrew
questline). "Hazel said my kitchen was like the inside of somebody's head. Everybody shouting,
nobody in charge."

**The quests:**

1. **The Smile.** The morning after the rain, Clover is at your gate with Dimple bouncing on
   her shoulder. Dimple has smiled without stopping since the hill. Clover is relieved: "At
   least somebody's cheerful." The other four sit in a damp heap behind her.
2. **The Windowsill.** At Clover's, Fossil's dent is still in the cushion on the sill, from all
   the days she spent there while Dusty dug. Dimple has piled every toy she owns into the dent.
   Drizzle climbs up and lays a hand in it, and Dimple drags her off. Dimple's face is smiling,
   but her ball has gone pale and thin. You notice; Clover, watching the face, doesn't.
3. **The Ring of Acorns.** Dimple herds Drizzle into a corner and rings her with acorns, then
   nudges her back each time she steps out. **The choice** (pays off in quest 12): break the ring
   and let Drizzle out; sit down outside the ring next to Drizzle; or leave it, because Dimple
   is trying so hard, and help her with Sparks's plan instead.
4. **The Bounce Party.** Sparks throws Dimple a party: streamers, races, a cake shaped like a
   cake. Dimple performs harder than anyone has ever performed. Ember, arms folded: "That's not
   happy. That's busy." Byte has counted 212 smiles an hour from a ball that never goes above a
   two. "The face and the ball disagree. Balls can't be wrong." That annoys him.
5. **Five Things.** Clover lists Dimple's favourite things: the sill, stamping puddles with
   Drizzle, chasing Sparks's fast ones, Byte's shoelaces, and the hum at bedtime. Check each one.
   She has stopped doing all five. At Byte's shoelaces she just smiles at them. Byte is
   unexpectedly hurt.
6. **Dusty Digs.** Dusty is digging a pointless hole by the stream, loudly cheerful. Dimple
   joins in, and the two of them perform at each other. Then Drizzle comes, sits at the edge of
   the hole and says nothing at all. Dusty stops. They sit down and talk about the spoon, and
   the twenty years and a bit, and cry. Drizzle leans on them. After a while Dusty says the
   line (see Lifted text). Dimple watches, and her smile slips. With `s5Done`, your youngest Nubbin (Fossil's
   last friend) comes and sits too, and Dusty laughs, wetly: "She trained you both."
7. **What Luna Saw.** Luna, at your door at dawn: three nights running she has seen Dimple on
   the hill path at three in the morning, going up towards Fossil's flower and turning back
   halfway. Go up with Luna that night. Dimple is on the path, not smiling, ball dark. She sees
   you and bolts home.
8. **Hush's Job** (ch7, after `c7-stillness`). Moss is at the old wall post. With `s1Done`
   he says: "You know she sat with the still ones. I never told you what she thought sad was
   for." Without it, he tells it plainly: after the White Year, Hush sat with the ones who
   never moved again. He shows you a flat stone low in the wall, covered in her marks, rings
   and lines. A ring for a joy kept, a line for a grief kept. Most are both, a ring with a line
   through it. "Briar thought Hush was gloomy. Hush thought Briar was loud. They were never more
   than a field apart." And the heart of it: "Sad is a lantern. It shows people where you are."
9. **Fidget.** The first frost week. An egg hatches in Clover's kitchen: Fidget, small and
    orange and never once still. Clover is thrilled: "Finally, someone who fusses more than me."
10. **Safe in the Shed.** Since the frost at dawn, Fidget has been herding the whole household
    into the shed at dusk and pushing a bucket against the door. Dimple, shut in, goes frantic
    with cheer; the rest wilt. Clover hears herself say Moss's words, "Safe is not the same as
    well", and sits down on the bucket. Help her open the shed without frightening Fidget: a
    blanket over the bucket, so it is still "closed", and a gap underneath.
11. **Dimple Goes** (ch8). One morning Dimple is gone, with nothing taken but Fossil's cushion
    off the sill. She is going back to where the happy was. With `s5Done` she follows Fossil's
    last walk in reverse: a toy at the pond, a toy under Hazel's crooked tree, the trail to the
    cliff. Without it, the trail runs from the sill to the cliff. You, Clover and Dusty follow,
    with Drizzle if quest 3 freed her or you sat with her.
12. **The Spoon Hole.** At the foot of Dusty's striped cliff, Dimple has climbed down into the
    old hollow where Fossil's egg was dug out, and she is scraping at the back of it as if there
    might be another. She can't climb out. Quest 3 pays off: if you broke the ring or sat with
    Drizzle, Drizzle climbs down unasked and sits close, saying nothing. If you helped the plan,
    Drizzle stayed home; you climb down and sit, and Dimple performs at you a long time before
    she stops. With `s5Done`, your youngest climbs down too.
13. **The Thunder Day.** While they sit, Clover, at the rim, tells you how Dimple and Fossil
    met. Dimple was a hatchling under the kitchen table in a thunderstorm, wailing. Fossil came
    down off the sill and sat beside her for the whole storm, and from then on they shared the
    sill on every digging day. "Her best thing started on her worst day." Down in the hollow,
    Dimple's ball goes deep blue, and she cries the Nubbin way, a thin high whistle and a
    shaking. When it stops, her ball turns blue and gold together, which nobody has ever seen.
14. **Up the Rope.** Dusty lowers a basket. Haul them up. Clover cries all over Dimple, then
    laughs at herself (see Lifted text).
15. **Up the Hill.** Dimple walks up the hill for the first time and sits by Fossil's flower,
    with whoever sat with her in quest 12, and Dusty. Then Fidget comes tearing up the path,
    having lost everyone, spinning in circles with her ball whirling. Dimple goes to her and sits
    down beside her until she stops. Last, at the old wall, take a charcoal rubbing of Hush's
    stone for Dimple's page. Her mark is a ring with a line through it.

**Consequences:**

- **Tier 3 (in the line):** the acorn ring (quest 3) decides, nine quests later, who climbs down
  to Dimple (quest 12), and so who sits beside her on the hill and in her rubbing (quest 15):
  Drizzle, or you. Freeing Drizzle also brings her on the search (quest 11).
- **Tier 2 (the Grove):**
  - **Hush's memory page:** a new journal page for each of your Nubbins, laid out like Hush's
    stone and filled from moments already in your save (first hatch, a farewell, the shoelace)
    as rings, lines or both. A keepsake, not a chore.
  - Clover's household gains Fidget, who now shuts the shed only halfway. Dimple and Drizzle
    share the sill, and Dimple's ball sometimes turns blue and gold. New lines for Dusty, Byte
    (who keeps the chart "for science") and Sparks, who can now sit still for nearly a minute.
- **Tier 1:** none. S30 sets only `s30Done`.
- **Reads:** `s5Done` (Dusty's line in quest 6, Dimple's route in quest 11, your youngest in
  quests 6 and 12); `s1Done` (Moss's opening in quest 8).

**Lifted text** (copyrighted: at most three one-sentence lines. Checked against Shmoop's
*Inside Out* quote pages. Check against the licensed film before scripting):

1. Clover, laughing through tears, in quest 14: "Crying helps me slow down and obsess over the
   weight of life's problems." (Sadness's line in the film.)
2. Dusty, after crying with Drizzle, in quest 6: "I'm okay now." (Bing Bong's line after he cries
   on Sadness's shoulder.)

Only two are used. Everything else is original. No headquarters, console, memory orbs, islands
or emotion characters appear: Hush's stone and the mood balls do that work.

**Rewards:** Hush's memory page (a feature); a pale-blue rain hat for your Nubbin; Fossil's
windowsill cushion (a decoration, given by Clover, "she'd want it sat on"); a blue-and-gold
ribbon.

**Learning Grove version:** yes. A face and a feeling can be different. Sadness helps people
know you need them. How to sit with a sad friend without fixing them. Worries try to keep us
safe, and sometimes too safe. Naming feelings (happy, sad, cross, scared, worried).

**Care notes:**

- Dimple is never "fixed": she still smiles most of the time, and now she can be sad too.
  Nobody is told to cheer up as a lesson.
- No clinical words. Fidget's spinning is a frightened Nubbin, and it passes when someone sits
  with her. The hollow is shallow and safe; Dusty and the rope are always there.
- Rule three is not quoted here: S5 already gave it to Fossil, and quest 6 shows it.
- All ages.

## A20. The Weeping (Baldr and the Fimbulwinter, Snorri's *Prose Edda*, Iceland; the Atlas)

**Why it works:** the brightest of the gods is made safe from everything in the world, and the
gods make a game of throwing things at him. One small sprout was too young to be asked for its
promise. When he dies, the whole world weeps to bring him back: stones and trees and metals,
the way frost weeps when it comes into the warm. Everything weeps but one. Then comes the
Fimbulwinter, three winters with no summer, the White Year in another key. And after the end,
the earth comes up green, and Baldr and the brother who killed him without meaning to walk out
of Hel together.

**When and where:** the page opens once Nova's atlas is in the Grove. It shows a bright hall,
a hall of mists, and a long white plain. You and your Nubbin step in as guests in Frigg's hall,
Fensalir. If `cinder` is set, your Nubbin carries Cinder's ember (S19's reward) in its little
lantern. This is Snorri's *Prose Edda* (written in Iceland in the 1220s), not any film or comic.

**Your role:** a guest of Frigg's, who runs her errands. Baldr, Frigg, Hermódr and the gods keep
their story. You walk the world collecting oaths, ride behind Hermódr, and carry the asking to
weep. Your Nubbin falls asleep in Baldr's light in the first scene and is always trying to get
back to it.

**The quests:**

1. **The Bright One.** Breidablik, Baldr's hall, where nothing unclean can be. He is so bright
   that light comes off him. Sit with him; your Nubbin sleeps in the light. He is kind to you,
   and to everyone.
2. **Bad Dreams.** Baldr dreams that his life is in danger, and tells the gods. They talk late
   in the hall about what to do. You fetch and carry and listen.
3. **The Oaths.** Frigg asks everything not to harm Baldr: fire and water, iron and every metal,
   stones, earth, trees, sicknesses, beasts, birds, poisons and snakes. You carry her asking to
   the beasts and birds. Each one promises, in its own way; your Nubbin promises too, very
   seriously.
4. **The Game.** At the Thing, the gods make sport: Baldr stands in the middle while they shoot
   and strike and throw stones at him, and nothing hurts him. Everyone laughs, Baldr most. You
   can join in or watch from the edge.
5. **The Old Woman.** An old woman comes to Fensalir and asks Frigg what the gods are doing.
   Frigg tells her: nothing can hurt Baldr. Has everything sworn? Everything but one tree-sprout
   west of Valhall, called Mistletoe; she thought it too young to ask. You are in the hall and
   hear it. The old woman goes, and you don't see which way.
6. **Hödr.** Hödr, Baldr's brother, is blind and stands outside the ring, with nothing to throw.
   Someone puts a sprout in his hand and offers to guide his aim, so he can honour his brother
   like everyone else. He throws. Baldr falls. (One quiet beat; no wound is shown.) Nobody can
   speak for weeping. Your Nubbin goes to Hödr, not to Baldr, and sits by his feet.
7. **Who Will Ride.** Frigg asks who will ride the road to Hel and offer a ransom. Hermódr the
   Bold will. He takes Odin's horse Sleipnir. You ride behind him.
8. **The Ship.** Baldr's ship, Hringhorni, won't move off the shore until a giantess comes from
   Jötunheim on a wolf with snakes for reins and pushes it off with one shove. Baldr's wife
   Nanna dies of grief and is laid beside him. Thor hallows the pyre with his hammer. Odin lays
   the ring Draupnir on it. (Gentle and grave, no flames on the bodies. Snorri's dwarf who is
   kicked into the fire is cut.)
9. **Nine Nights.** Hermódr rides nine nights through dark, deep dales to the river Gjöll and
   its gold-roofed bridge. The maiden Módgudr who guards it says five troops of dead men rode
   over it yesterday, and it rings louder under one living rider. She points the way down and
   north.
10. **Hel's Hall.** Sleipnir leaps the gate. Baldr sits in the high seat. Hermódr asks for him
    back. Hel says she'll see whether he is as loved as they say: if everything in the world,
    living and dead, weeps for him, he goes home. Baldr sends Draupnir back to Odin for a
    remembrance; Nanna sends Frigg a linen smock, and a ring to her maid Fulla.
11. **Everything Weeps.** The gods send messengers all over the world, and you go too. Men, beasts,
    earth, stones, trees and metals weep. Carry frosted stones from the shade into the sun and
    watch them run with water. Your Nubbin weeps too, which surprises it.
12. **The Cave.** On the way home the messengers find a giantess sitting in a cave. She calls
    herself Thökk. She will weep dry tears, she says; she had no joy of Baldr alive or dead; let
    Hel keep what she has. (People believe she was Loki.) **Choice:** plead with her, sit down
    next to her and say nothing, or walk away. She refuses whatever you do. Pays off in quests
    14, 16 and 17.
13. **The Salmon.** Loki hides in a house with four doors on a mountain, and by day is a salmon in
    Franang's Falls. He makes the first net, then burns it when he sees the gods coming; they
    work out the net from its ash. Thor catches him by the tail. You help hold the net.
14. **The Bowl.** Loki is bound under the earth on three stones. A snake hangs over his face and
    drips venom. His wife Sigyn holds a bowl under it; when the bowl is full and she goes to
    empty it, the drops fall, he shudders, and the earth shakes. (Softened: see the care notes.)
15. **The Fimbulwinter.** Three winters, one after another, with no summer between. Snow from
    every side, sharp winds, a sun with no warmth in it. Two people, Líf and Lífthrasir, hide in a
    wood called Hoddmímir's Holt and live on morning dew. You and your Nubbin keep them company.
16. **The Twilight.** From the edge of the holt you see Ragnarök far off: wolves running at the
    sun and moon, a ship coming over the sea, fire on the horizon. It is told, not shown up close.
    Nothing reaches the holt.
17. **The Green Earth.** The earth comes up out of the sea, green and fair, and fields grow that
    nobody sowed. The gods' sons gather on the old ground. Baldr and Hödr come up from Hel and
    sit together talking about old things. In the grass someone finds the golden game pieces the
    gods once played with. Líf and Lífthrasir walk out into the morning.

**Consequences:**
- **Tier 3 (in the line):** *Thökk (Q12 → Q14, Q16, Q17).*
  - **Plead:** in Q14 Sigyn won't look at you. In Q16 you see the far ship and a figure in its
    bow who doesn't turn. In Q17 Hödr thanks you for trying to fetch his brother home.
  - **Sit with her:** she lets you, for a while. In Q14 Sigyn lets you hold the bowl while she
    empties hers, so for a moment no drops fall. In Q16 the figure in the far bow looks straight
    at the holt, once. In Q17 Baldr says, "You sat with the one who wouldn't weep. Someone
    should." (The third rule, landing.)
  - **Walk away:** in Q14 you watch from the cave mouth. In Q16 you hear the ship but don't see
    it. In Q17 Hödr sits a little apart, until Baldr calls him over.
  - **Endings:** on every path the earth comes up green. What changes is who sits closest to Hödr
    in the last scene: you, Baldr, or no one at first.
- **Tier 2 (the Grove):** the mistletoe sprig, a cosmetic for your Nubbin, given with its story
  told in two plain lines (Frigg's "too young to ask", and the weeping). The Price of Power
  bookmark.
- **Reads:**
  - `cinder` (forgiven or remembered): your Nubbin carries the ember. In Q11 it sets the frost
    weeping faster. In Q15 it keeps Líf and Lífthrasir warm; forgiven, it burns steady;
    remembered, it flickers but never goes out. At the green earth Líf asks where it came from.
    "From someone who held on too tight once," you can say, or say nothing.
  - `keptStone`: in Q12 Thökk looks at your pocket. "You understand. Keep what you have." In
    Q15 the stone hums *safe* in the holt, and the hidden pair don't like it; they sit further
    off. Nothing else changes.
  - `s24Done`: Hazel's margin note beside the cave. "Everything wept but one. Don't hate her for
    it. Feel sorry for her. H."

**Lifted text** (Arthur Gilchrist Brodeur's 1916 translation, *The Prose Edda*, Gylfaginning,
from the sacred-texts copy; the Fimbulwinter and green-earth passages were checked against a
course reader that reproduces that copy, so confirm them against Brodeur before scripting):
1. "He is so fair of feature, and so bright, that light shines from him." (Ch. XXII, Q1.)
2. "There grows a tree-sprout alone westward of Valhall: it is called Mistletoe; I thought it
   too young to ask the oath of." (Frigg, ch. XLIX, Q5.)
3. "But when the Æsir tried to speak, then it befell first that weeping broke out, so that none
   might speak to the others with words concerning his grief." (Ch. XLIX, Q6.)
4. "If all things in the world, quick and dead, weep for him, then he shall go back to the
   Æsir;" (Hel, ch. XLIX, Q10.)
5. "and all men did this, and quick things, and the earth, and stones, and trees, and all
   metals,—even as thou must have seen that these things weep when they come out of frost and
   into the heat." (Ch. XLIX, Q11. Brodeur prints a double hyphen for the dash.)
6. "frosts shall be great then, and winds sharp; there shall be no virtue in the sun." (Ch. LI,
   Q15.)
7. "In that time the earth shall emerge out of the sea, and shall then be green and fair; then
   shall the fruits of it be brought forth unsown." (Ch. LIII, Q17.)
8. "After that Baldr shall come there, and Hödr, from Hel;" (Ch. LIII, Q17, a fragment.)

Thökk's six-line verse is left out because it wasn't checked here; it's a poem, not a song, and
can be added after checking it against Brodeur.

**Rewards:** the mistletoe sprig; a little golden game piece for the cottage shelf; Frigg's
spindle as a decoration; a frost-stone that "weeps" in the sun by the pond (pure decoration);
the Price of Power bookmark.

**Learning Grove version:** yes, softened, without lifted text. A child learns where Iceland is
and that Snorri Sturluson wrote these stories down about eight hundred years ago; why cold
things "weep" when they come into a warm room (condensation and melting); that mistletoe grows
on other trees; the midwinter solstice and why winters are long in the far north; and that some
people still honour these gods today.

**Care notes:**
- **Heathenry.** The Norse gods are honoured by living communities today (Heathenry; Iceland's
  Ásatrúarfélagið is a registered religious body). Show the gods with dignity, as Snorri does:
  no jokes at their expense and no superhero designs. Snorri was a Christian writing in the
  1220s, and his book is one telling, not scripture; say so on the page's intro card. Commission
  an adviser from an inclusive Heathen organisation before scripting.
- **Symbols.** No runes, valknuts or other symbols that hate groups have taken over. Any lettering
  is plain.
- **Mistletoe.** The later story that Frigg made mistletoe a sign of love and kissing is not in
  Snorri. Don't use it.
- **Softened for All, and we say so.** Loki's binding is three stones, the snake and Sigyn's
  bowl; the binding with his son's entrails, and the son's death, are cut. Baldr's death is one
  fall with no wound. Ragnarök is seen from far off with no deaths shown. Nanna's death of grief
  is one line. The dwarf Litr is cut.
- Rated All, with care. Give a soft content line before Q6.

## Q66–Q75. Down the Rabbit-Hole (*Alice's Adventures in Wonderland*, 1865, and *Through the Looking-Glass*, 1871, Lewis Carroll; England; fun pack)

**Why it works:** Carroll's two dreams are the purest nonsense in English: a world that runs on
rules nobody can explain, told with a perfectly straight face. The Grove is a world of gentle,
patient rules, so Wonderland is its best joke: a place where every rule is loud and none of them
are kind. It also gives the pack one real moment. The Queen hands you a Nubbin to use as a
croquet ball, and you say no, because Hazel's second rule is the one rule in Wonderland that
makes sense.

**When and where:** two dreams, five quests each. Wonderland (Q66–Q71) opens on a hot summer
afternoon by the stream, any time after chapter 2. Looking-Glass (Q72–Q75) opens on a rainy autumn
evening by the cottage fire, after Q71. Like every fun quest, nothing triggers during chapters
9–11, and nothing repeats. Each quest needs the one before it (`requires: ['Q66']` and so on).

**Your role:** a second dreamer, a step behind Alice. Alice is the heroine and makes her own way;
you walk beside her, hold things, and keep your Nubbin out of trouble. Your Nubbin shrinks and
grows with you, rides in Alice's apron pocket, and never says a word. In Wonderland everything
else talks, so the Cheshire Cat finds its silence very sensible.

**The quests:**

1. **Down the Rabbit-Hole.** *Trigger:* a hot afternoon, dozing by the stream with your Nubbin
   (after chapter 2). A White Rabbit in a waistcoat runs past, checks a watch and dives under the
   hedge. You follow Alice down a very long hole, past cupboards and jars, into a hall of locked
   doors. A bottle says DRINK ME; Alice drinks, your Nubbin drinks, and so do you. Everyone is ten
   inches high, Alice cries a pool of tears, and you swim your Nubbin out of it.
   *Quote:* "Oh dear! Oh dear! I shall be late!" · "Curiouser and curiouser!"
   *Learning Grove line:* Rabbit: "Late, late, late! And my watch has stopped at teatime again!"
   *Reward:* a DRINK ME bottle decoration (it does nothing at all). Cosmetic.
2. **A Caucus-Race.** *Trigger:* straight after Q66. The wet creatures on the bank must get dry.
   The Dodo marks out a race in a sort of circle and everyone starts when they like and stops when
   they like. Run your Nubbin round with the Mouse, the Duck and the Lory, then help Alice hand out
   her comfits as prizes. Alice's own prize is her own thimble.
   *Quote:* "EVERYBODY has won, and all must have prizes."
   *Learning Grove line:* Dodo: "The race is over! Who won? All of you. Who lost? Nobody. Splendid."
   *Reward:* a thimble hat for your Nubbin; "Caucus mode" for the race track, a fun race with no
   placings that you can run whenever you like. Both.
3. **Advice from a Caterpillar.** *Trigger:* after Q67. Too small for the Rabbit's house, Alice and
   you find a blue Caterpillar on a mushroom. He asks who you are, and nobody can say, since you
   have all been several sizes since breakfast. One side of the mushroom makes you grow and the
   other makes you shrink. Your Nubbin nibbles the wrong side and goes tall as a tree; feed it the
   other side until it is the right size again.
   *Quote:* "Who are YOU?"
   *Learning Grove line:* Caterpillar: "And who might you be? Take your time. I have all afternoon."
   *Reward:* a two-tone mushroom stool decoration. Cosmetic.
4. **A Mad Tea-Party.** *Trigger:* after Q68. On the way, a grinning Cat in a tree tells you which
   way the Hatter lives and which way the March Hare lives, and that it hardly matters. At the
   long table the Hatter asks a riddle with no answer, the March Hare offers tea in the wrong
   order, and the Dormouse sleeps in the teapot. Your Nubbin tries to climb in too. Help Alice
   leave without being rude, which is the hardest thing in the quest.
   *Quote:* "we're all mad here. I'm mad. You're mad." · "Why is a raven like a writing-desk?" ·
   "Take some more tea," … "I've had nothing yet," … "so I can't take more." "You mean you can't
   take LESS," … "it's very easy to take MORE than nothing."
   *Learning Grove line:* Hatter: "Move along! Clean cups! Nobody has used these, but move along!"
   *Reward:* the Hatter's hat, with its paper ticket "In this Style 10/6"; a long tea-table
   decoration. Cosmetic.
5. **The Queen's Croquet-Ground.** *Trigger:* after Q69. Three cards are painting white roses red.
   The Queen of Hearts arrives and the game starts: flamingos for mallets and hedgehogs for balls.
   There aren't enough hedgehogs, so the Queen picks up a small round Nubbin from under a rose bush
   and hands it to you. You refuse (rule two: never, ever throw one). *Choice:* tuck it inside your
   coat; set it down and let it run off under the hedge; or give it to Alice, who puts it in her
   pocket with your own. The Queen screams for your head; the Gryphon explains that nobody is
   ever actually executed here. This pays off in Q71 and Q75.
   *Quote:* "Off with her head!" (at Alice; for your Keeper she shouts "Off with his head!", "Off
   with her head!" or, adapted, "Off with their head!") · "they never executes nobody, you know."
   *Learning Grove line:* Queen: "Take them away! Take them all away! …Where did everyone go?"
   *Reward:* a croquet lawn decoration with hoops; Nubbins push a wooden ball round it. Cosmetic.
6. **Who Stole the Tarts?** *Trigger:* after Q70. The Gryphon takes you to the Mock Turtle, whose
   school lessons got shorter every day. Then a trumpet: the Knave of Hearts is on trial. The
   Hatter gives evidence with a teacup in his hand, and Alice starts to grow. *Payoff of Q70:* the
   Nubbin you saved is called as a witness and climbs out of your coat to sit on your foot; or
   it peeps out of the hedge by the jury box; or it pops its head out of Alice's pocket beside
   yours. The Queen wants the sentence first. Alice, full size now, says what everyone was
   thinking, and the cards fly up. You wake by the stream with leaves on your face and your
   Nubbin asleep on your chest.
   *Quote:* "That's the reason they're called lessons," … "because they lessen from day to day." ·
   "Sentence first--verdict afterwards." · "Who cares for you?" … "You're nothing but a pack of
   cards!"
   *Learning Grove line:* Alice: "You can't frighten me. You're only playing cards, and I'm awake!"
   *Reward:* a "pack of cards" emote (the cards fly up and flutter down). Cosmetic.
7. **Through the Looking-Glass.** *Trigger:* a rainy autumn evening by the cottage fire, after Q71
   (chapter 7 or 8, or any autumn in the Free Grove). Your Nubbin has tangled itself in a ball of
   wool. The mirror over the mantelpiece goes soft like silver mist, and you climb through after
   Alice into a room where the chessmen walk about. A poem in mirror-writing can only be read by
   holding it up to the glass. In the garden the flowers talk back, and the Red Queen runs Alice,
   you and your Nubbin as fast as you can go, and nothing moves at all.
   *Quote:* "'Twas brillig, and the slithy toves / Did gyre and gimble in the wabe;" · "it takes
   all the running YOU can do, to keep in the same place."
   *Learning Grove line:* Red Queen: "Faster! Faster! Now look, we haven't moved an inch. Excellent."
   *Reward:* a looking-glass decoration that shows your Grove the wrong way round; a "Looking-Glass"
   Photo mode filter that flips the picture. Both.
8. **Contrariwise.** *Trigger:* after Q72. The country is a chessboard, and Alice is a White Pawn
   who must reach the Eighth Square to be a Queen; you walk the next file along. In a wood two fat
   little men in schoolboy collars argue about everything, then about a broken rattle, and dress
   for battle in bolsters and saucepans. Help them into their armour, very slowly, until a huge
   crow frightens them both away.
   *Quote:* "Contrariwise," … "if it was so, it might be; and if it were so, it would be; but as it
   isn't, it ain't. That's logic."
   *Learning Grove line:* Tweedledee: "Wrong! Unless you're right. In which case, also wrong."
   *Reward:* a saucepan helmet; a rattle for your Nubbin. Cosmetic.
9. **Six Impossible Things.** *Trigger:* after Q73. The White Queen's shawl blows past, and you pin
   it back on her while she explains the rule about jam. Then, on a high wall, Humpty Dumpty
   tells Alice about un-birthday presents and makes words mean whatever he pays them to mean.
   You are leaving when a heavy crash shakes the wood, and soldiers come running. Nobody on screen
   is hurt; you hear it, and you hurry on.
   *Quote:* "The rule is, jam to-morrow and jam yesterday--but never jam to-day." · "sometimes I've
   believed as many as six impossible things before breakfast." · "When _I_ use a word," … "it
   means just what I choose it to mean--neither more nor less."
   *Learning Grove line:* Humpty: "When I say 'breakfast', I mean a nap. So I've had three today."
   *Reward:* Humpty's cravat (an un-birthday present) for your Keeper. Cosmetic.
10. **It's My Own Invention.** *Trigger:* after Q74. The White Knight rescues Alice from the Red
    Knight, then falls off his horse every few steps. His saddle is hung with inventions: a box
    carried upside down to keep the rain out, a beehive, a mousetrap. He walks you both to the last
    brook and asks Alice to wave her handkerchief when he reaches the turn. Over the brook Alice
    finds a crown on her head, and a feast where the puddings talk and the candles grow up to the
    ceiling. When it all goes to pieces she shakes the Red Queen, and it turns into a kitten.
    *Payoff of Q70:* you wake by the fire with your Nubbin curled inside your coat exactly the
    way the Wonderland one was; or you wake to see your Nubbin chasing a white rabbit across the
    wet garden, and it doesn't come back until it's ready; or, in the dark of the mirror, you see
    a girl on the far side waking too, a kitten on her lap, and she waves.
    *Quote:* "It's my own invention." (Twice; he means it both times.) · Narration, last line:
    "Which do YOU think it was?"
    *Learning Grove line:* Knight: "I made it myself! It doesn't work. That's how you know it's new."
    *Reward:* the White Knight's upside-down box (a backpack cosmetic); a small paper crown. Cosmetic.

**Consequences:**

- **Tier 3 (in the line):** the croquet refusal in Q70 is the pack's one choice. It shapes Q71's
  witness scene and, five quests later, how you wake in Q75: holding it (coat), letting it go (the
  garden) or sharing it (the girl in the mirror). All three are warm. The pack is two dreams, and
  the last one leaves the question open.
- **Tier 2 (the Grove):** decorations only: the croquet lawn, the tea-table, the looking-glass.
  The looking-glass sometimes shows your Nubbin's reflection doing something a beat late.
- **Tier 1:** none. The pack never sets or needs a flag.
- **Reads:** none.

**Lifted text** (public domain everywhere; Carroll died in 1898). Every quote is given in its
quest above and was checked word for word against Project Gutenberg #11 (Millennium Fulcrum Edition
3.0) and #12 (Edition 1.7), read from the GITenberg mirrors of those files. Where they come from:
*Wonderland* ch. 1 (late), 2 (curiouser), 3 (prizes), 5 (Caterpillar), 6 (all mad), 7 (raven,
more tea), 8 (heads), 9 (executes nobody, lessons), 12 (sentence first, pack of cards);
*Looking-Glass* ch. 1 ("Jabberwocky", a poem, not a song), 2 (running), 4 (contrariwise), 5 (jam,
six impossible things), 6 (Humpty on words), 8 (own invention), 12 ("Which do YOU think it was?").
Gutenberg prints Carroll's italics in capitals, so set "YOU", "LESS" and "MORE" in italics, and
recheck against facsimiles of the 1866 and 1871 printings before ship (the 1865 first printing was
withdrawn). Only the Queen's "Off with…" line is adapted, for your Keeper. No sung verse is used:
the Lobster-Quadrille, "Twinkle, twinkle, little bat", the White Knight's song and the Humpty
Dumpty nursery rhyme stay out. The Hatter's "10/6" ticket is from Tenniel's 1865 drawing.

**Rewards:** DRINK ME bottle, thimble hat, mushroom stool, the Hatter's hat, tea-table, croquet
lawn, pack-of-cards emote, the looking-glass and its Photo mode filter, saucepan helmet and rattle,
Humpty's cravat, the White Knight's box and a paper crown. All one-time.

**Learning Grove version:** yes, with original lines in place of every quote.
- Big and small, taller and shorter: the bottle, the mushroom, your Nubbin as tall as a tree.
- Patterns that follow a rule: ten hours of lessons, then nine, then eight. When do they stop?
- Mirror images and symmetry: mirror-writing, and why the looking-glass room is back to front.
- Nonsense words: make up your own, and guess what a new word means from the sentence around it.
- Fairness and rules: a race where everyone wins, and a trial where the sentence comes first.

**Care notes:**
- Rated all. Nobody is beheaded; the source itself says so, and the Gryphon says it aloud.
- The Caterpillar's hookah is left out; he just sits on his mushroom. The March Hare's "Have some
  wine" is cut. The Duchess's kitchen (pepper, a baby tossed about, a baby that turns into a pig)
  and "The Walrus and the Carpenter" are not used.
- Humpty Dumpty's fall is a sound off screen, with no injury shown.
- Draw from Tenniel's 1865 and 1871 illustrations (public domain), never Disney's 1951 film: no
  talking doorknob, no Disney songs, no "Mad Hatter" title (the book calls him the Hatter).
- Show no real people: no Carroll, no Alice Liddell.

## Q76–Q85. The Hound of the Grove (the Sherlock Holmes stories, Arthur Conan Doyle, 1887–1917; England; fun pack)

**Why it works:** Holmes is the world's most famous noticer. He looks at a hat, a boot or a
muddy cuff and tells you a life. That is the Keeper's skill too, done fast and out loud, and the
Grove's Nubbins can't tell you anything, so a man who reads them from the outside is a delight.
Ten cases, each from a famous story, made small enough for the valley: nobody dies, nobody is
shot, and the worst crime is a stolen bead.

**When and where:** a misty morning after chapter 2: a card in the shop window says ROOM ABOVE
THE SHOP TO SHARE. Holmes and Watson take it, and Holmes insists on calling it 221B although the
shop has no number. The cases run in order through summer and autumn. Q84 needs a misty autumn
evening (chapter 7 or 8, or any autumn in the Free Grove). Nothing triggers during chapters 9–11,
and nothing repeats. Each quest needs the one before it.

**Your role:** the friend who introduced them (Stamford's part in *A Study in Scarlet*), then the
Grove's one-person Irregulars: you fetch, carry, hold the lantern and notice small things. Holmes
solves every case; Watson writes them up. Your Nubbin is the team's nose: it learns tracking from
Toby in Q80 and uses it on the heath in Q84. Byte, the valley's sceptic, keeps trying to catch
Holmes guessing. He never does.

**The quests:**

1. **You Have Been at the Tide Pools.** *Trigger:* the first misty morning you pass the shop after
   chapter 2. Dr Watson, just back from the war and looking for cheap rooms, asks you the way. You
   take him to the shop, where a thin man is testing jam for fingerprints. Holmes shakes Watson's
   hand and tells him where he has been. Then he reads you: salt on your boots, a Nubbin's fluff on
   your left sleeve only, ink on your thumb from a letter you've read many times. Byte demands to
   know how. Holmes tells him.
   *Quote:* "You have been in Afghanistan, I perceive." · "You see, but you do not observe."
   *Learning Grove line:* Holmes: "Sand on your boots, and a damp hem. The tide pools, before nine."
   *Reward:* a magnifying glass you can use in Photo mode to zoom on anything. Feature.
2. **The Red-Crested League.** *Trigger:* after Q76. Old Mr Wilson of the seed shop brings his
   red-crested Nubbin and a newspaper notice: a League pays four Shells a morning for a red-crested
   Nubbin to sit in an office while its Keeper copies out the Collection book, from Apples onward.
   Now the office door says the League is DISSOLVED. Holmes taps the lane outside with his stick,
   looks at the knees of Wilson's eager new assistant, and takes you to sit in the dark in the
   cellar under the Keepers' hall, where the Harvest Show's prize Shells are kept. At midnight a
   flagstone lifts. Inspector Lestrade, up from the market town, does the arresting.
   *Quote:* "It is quite a three pipe problem, and I beg that you won't speak to me for fifty
   minutes." (He holds a cold pipe he never lights; Watson: "You gave those up." "The problems
   didn't.")
   *Learning Grove line:* Holmes: "This is a three-cup-of-tea problem. Please don't talk for a bit."
   *Reward:* a red crest cosmetic for any Nubbin; a dark-lantern decoration. Cosmetic.
3. **The Blue Bead.** *Trigger:* the week of the Harvest Supper (autumn), after Q77. After a scuffle
   in the lane, someone has dropped a battered hat and a live, very cross goose. Holmes reads the
   hat's owner from the hat. Then the goose coughs up a blue stone: the Countess's bead, stolen from
   the Supper prize table, and a travelling tinker has been blamed. The trail leads to a frightened
   young porter, Jem Ryder, who hid the bead in a goose at his sister's farm and took the wrong
   goose. *Choice:* Holmes asks what you'd do. Let him go; call Lestrade; or make him walk to the
   Countess and say it himself. Either way the tinker is cleared. This pays off in Q84 and Q85.
   *Quote:* "I suppose that I am commuting a felony, but it is just possible that I am saving a
   soul."
   *Learning Grove line:* Holmes: "He's frightened enough to stop. Sometimes a second chance works."
   *Reward:* the battered hat; a goose who follows you round for the rest of the day, once. Cosmetic.
4. **The Gate in the Night-Time.** *Trigger:* the night before the autumn Cup at the race track,
   after Q78. A famous racing Nubbin, Silver Blaze, is boarding in your Grove before the Cup. In
   the morning it's gone. Sparks slept by the gate and heard nothing. Holmes walks the hedge, then
   asks Sparks one question. Everyone in the valley knows the gate sticks and scrapes, so nobody
   came in. Silver Blaze went out by the gap in the hedge, and a rival trainer, Silas Brown, found
   it on his land and dyed its white blaze brown. Wash it in the pond, and it runs.
   *Quote:* "Is there any point to which you would wish to draw my attention?" "To the curious
   incident of the dog in the night-time." "The dog did nothing in the night-time." "That was the
   curious incident," … (Adapted: "the gate in the night-time".)
   *Learning Grove line:* Holmes: "The gate always squeaks. Last night it didn't. So who came in?"
   *Reward:* Holmes's ear-flapped travelling cap; a silver blaze face marking. Cosmetic.
5. **The Nose.** *Trigger:* after Q79. Pixel's box of brass cogs has vanished from her workshop,
   and there are tarry footprints on the floor. Watson fetches Toby, a lop-eared dog with an
   amazing nose. Toby follows the tar smell proudly across the valley to Sparks's tar barrel, and
   sits down. The footprints were Pixel's own. Holmes rules out the door, the window and the
   chimney, which leaves only the skylight, and a bird. Your Nubbin, who has been copying Toby all
   morning, sniffs its way to a magpie's nest full of shiny things.
   *Quote:* "when you have eliminated the impossible whatever remains, HOWEVER IMPROBABLE, must be
   the truth" · "I would rather have Toby's help than that of the whole detective force of London."
   *Learning Grove line:* Holmes: "Not the door, not the window. What's left? Something with wings."
   *Reward:* "Find": hold the button and your Nubbin points its nose at the nearest fallen fruit,
   as often as you like. Feature.
6. **The Dancing Nubbins.** *Trigger:* after Q80. Little chalk figures of Nubbins dancing appear on
   the Workshop wall, then on the bridge, then on Fern's gate. Fern is sure it's a curse. Holmes
   copies every one and counts which figure turns up most. It's a code, and the flags mark the end
   of each word. The messages are between two valley children, Hetty and Sam, whose families have
   quarrelled over a hedge: MEET AT THE POND. BRING THE KITE. Holmes answers in the same code and
   brings both families to the pond. The kite flies.
   *Quote:* "What one man can invent another can discover."
   *Learning Grove line:* Holmes: "Count them. The shape you see most is probably the letter E."
   *Reward:* a chalk set that draws dancing-Nubbin letters on paths; a kite. Both.
7. **The Ritual.** *Trigger:* a sunny afternoon after Q81. Watson asks about Holmes's early cases,
   and Holmes tells the story of the Musgrave family's old question-and-answer, which nobody had
   understood for two hundred years. He acts it out in the meadow: a rod six feet long throws a
   shadow nine feet long, so a tree sixty-four feet tall throws ninety-six. Then he hides a tin in
   the Grove and gives you the old directions to find it, counting your steps north, east, south
   and west. Inside: toffees, and a dented tin crown from an old village play.
   *Quote:* "'Whose was it?' 'His who is gone.' 'Who shall have it?' 'He who will come.'" · "North by
   ten and by ten, east by five and by five, south by two and by two, west by one and by one, and
   so under."
   *Learning Grove line:* Holmes: "Ten steps north. Five east. Two south. One west. Now dig."
   *Reward:* the tin crown; a sundial decoration. Cosmetic.
8. **The Woman.** *Trigger:* after Q82. A masked visitor who calls himself the Count von Kramm wants
   a photograph back: a Photo mode picture of him dancing very badly with a travelling singer, Irene
   Adler. Holmes disguises himself as a clergyman, and you throw a harmless smoke-rocket through her
   window and shout "Fire!" so she glances at her hiding place. But she saw through the disguise.
   In the morning the cupboard holds only a letter and a picture of her, laughing. Holmes asks
   for that picture as his fee.
   *Quote:* "To Sherlock Holmes she is always THE woman." (Watson, writing it up.)
   *Learning Grove line:* Watson: "Holmes was beaten, and by a singer. He's never been happier."
   *Reward:* a clergyman disguise; Irene's photograph in a frame. Cosmetic.
9. **The Hound of the Heath.** *Trigger:* a misty autumn evening after Q83. Dusty comes to the room
   above the shop, very pale: on the high heath above their cliff there are huge paw prints, and
   at night something glows out there and howls. Holmes sends Watson and you ahead and says he's
   too busy to come. You meet the naturalist Stapleton with his butterfly net, and learn about the
   bog, where a wrong step means mud to the waist. *Payoff of Q78:* if you let Jem go or made him
   own up, he is a shepherd on the heath now and shows you the safe path, marked with sticks; if
   Lestrade took him, you find the path with your Nubbin's Toby-nose, slowly, and Watson goes in
   to the knees. Holmes has been camping in an old stone hut all along. The hound comes glowing out
   of the mist: an enormous, gentle stray that Stapleton kept in his barn among rotten logs full of
   glowing fungus, to frighten walkers away from his rare moths. It licks Holmes's face. Stapleton
   runs, sinks to his waist, and has to be pulled out by everyone.
   *Quote:* "Mr. Holmes, they were the footprints of a gigantic hound!" (Dusty) · "The world is
   full of obvious things which nobody by any chance ever observes."
   *Learning Grove line:* Dusty: "They're the biggest paw prints I've ever dug round. And I dig a lot."
   *Reward:* the hound, as a critter who sleeps by your gate on misty nights; a glowing collar.
   Both.
10. **The Bees.** *Trigger:* a fine morning after Q84. Holmes announces that he is retiring to keep
    bees on the sunny bank above the orchard, and shows you his book. Help him build three hives
    and carry them up. *Payoff of Q78:* if Jem was let go or owned up, he comes to help and stays
    on as Holmes's beekeeper's boy; if not, Lestrade comes instead and is stung. Holmes gives you a
    parting present: his magnifying glass if you ever disagreed with him in a case, his cap if you
    didn't. Holmes and Watson stay in the valley: Holmes with his bees, Watson in the room above
    the shop, writing.
    *Quote:* "Here is the fruit of my leisured ease, the magnum opus of my latter years!" … Practical
    Handbook of Bee Culture, with Some Observations upon the Segregation of the Queen.
    *Learning Grove line:* Holmes: "Bees never lie about where the flowers are. I find that restful."
    *Reward:* a hive decoration; flowers within reach of it bloom a little brighter. Both.

**Consequences:**

- **Tier 3 (in the line):** Q78's choice (let Jem go, call Lestrade, or make him own up) pays off
  six quests later on the heath (Q84: a guide, or your Nubbin's nose and Watson's wet knees) and
  again at the hives (Q85: Jem the beekeeper's boy, or a stung inspector). Q80's tracking lesson
  is what your Nubbin uses in Q84. The ending gift in Q85 depends on whether you ever contradicted
  Holmes when he asked "Well?" (Q78, Q79 and Q81 each give you the chance).
- **Tier 2 (the Grove):** Holmes and Watson become residents, with idle lines: Holmes on the bank
  with his bees, Watson at the window above the shop. The hound sleeps by your gate on misty
  nights. The magpie keeps a shiny-things nest on the Workshop roof.
- **Tier 1:** none. The pack never sets or needs a flag.
- **Reads:** none. (Q79 uses the gate that sticks as everyone knows it, which is canon, but reads
  no flag.)

**Lifted text** (all from stories published 1887–1917. Everything published before 1927 is public
domain in the US, and since January 2023 the whole canon is; Conan Doyle died in 1930, so the texts
are public domain in the UK and EU too). Each quote is in its quest above, checked word for word
against Project Gutenberg, read from the GITenberg mirrors: *A Study in Scarlet* (1887, #244; Q76),
*A Scandal in Bohemia* (1891, #1661; Q76, Q83; set THE in italics), *The Red-Headed League* (1891,
#1661; Q77), *The Blue Carbuncle* (1892, #1661; Q78), *Silver Blaze* (1892, #834; Q79, adapted to
"the gate in the night-time"), *The Sign of Four* (1890, #2097; Q80), *The Dancing Men* (1903,
#108; Q81), *The Musgrave Ritual* (1893, #834; Q82), *The Hound of the Baskervilles* (1901–02,
#2852; Q84) and *His Last Bow* (1917, #2350; Q85). Don't use "Elementary, my dear Watson": that
sentence is not in the canon.

**Rewards:** magnifying-glass zoom, red crest, dark lantern, battered hat, travelling cap, silver
blaze marking, "Find", chalk code set, kite, tin crown, sundial, clergyman disguise, Irene's
photograph, the hound and its collar, the beehive. All one-time; "Find" and the zoom are unlimited.

**Learning Grove version:** yes, with original lines.
- Noticing: what boots, sleeves and hats can tell you, and the difference between seeing and
  looking.
- Codes: count which symbol appears most often (a tally chart), then crack the message.
- Shadows and scale: a short pole and a tall tree, measured in metres (2 m throws 3 m, so 20 m
  throws 30 m).
- Bees: how a hive works together, and why bees visit flowers.
- Thinking question: should Jem get a second chance?

**Care notes:**
- Rated all. Every source death is cut: no murder in *Silver Blaze* (the trainer and his plan to
  lame the horse are gone), no death in the Musgrave story ("The rest of that story isn't for a
  sunny afternoon"), no one dies in the bog, and the hound is not shot.
- No guns are drawn. Watson carries an umbrella. No cocaine. Holmes's pipe is never lit, and the
  Learning Grove line swaps pipes for tea.
- *The Sign of Four*'s villains, and its racist portrait of Tonga, are not used at all; the thief is
  a magpie. *The Hound*'s phosphorus is replaced with natural glowing fungus, so nobody copies it.
- Use Paget's and the original magazine illustrations (public domain). Nothing from later films or
  TV series: no modern *Sherlock* looks or lines.

## A21. The Flower Field (*Frieren: Beyond Journey's End*, Kanehito Yamada and Tsukasa Abe; Japan; the Atlas)

**Why it works:** an elf mage who has lived a thousand years spends ten of them with a band of
heroes, then barely notices them grow old. At the hero's funeral she cries because she never
tried to know him. The rest of the story is her going back over the road they walked, learning
them too late and just in time. It is the Grove's fourth theme told from the long-lived side,
Moss's side. And her apprentice is called Fern, so Fern meets Fern.

**When and where:** the page opens once Nova's atlas is in the Grove. It shows a meteor shower
over a royal capital. Keeper Fern comes with you, and so does Bramble if Fern has found her
(`s8Reunited`). The page follows the anime's first season (28 episodes) and the manga up to the
end of the First-Class Mage Exam.

**Your role:** you and Keeper Fern are travellers who fall in with Frieren's party. You carry
packs, cook, and, at the exam, carry the Association's bird cages, which lets you watch. Frieren,
Fern and Stark keep their story. Your Nubbin is the party's mascot. It hates mimics and loves
Stark, who is as frightened as it is.

**The quests:**

1. **The Era Meteors.** Fifty years after the Demon King fell: Himmel old, Heiter old, Eisen
   older, Frieren unchanged. They watch the meteors that come once every fifty years, as they
   promised to. Your Nubbin tries to count them.
2. **The Funeral.** Himmel dies of old age. At his funeral Frieren cries, and doesn't know why,
   and then does (see Lifted text). Keeper Fern, beside you: before chapter 12, "Hazel's been
   gone since the snow. I keep thinking of things I never asked her." After it: "I lived next
   door to Hazel for years. I knew which biscuits she liked. That's about it."
3. **Fern Meets Fern.** Years later, the priest Heiter is dying. He asks Frieren to decipher a
   grimoire, and to teach the war orphan he took in. Apprentice Fern bows. Keeper Fern trips over
   the step. Apprentice Fern: "It's a common name. You needn't apologise for it."
4. **The Rock.** Four years of training. Apprentice Fern means to hit a far rock with a spell
   before Heiter dies, so he can rest easy about her. Keeper Fern, meanwhile, is trying to keep a
   sapling alive in Heiter's garden, badly. Fetch water for both. Fern hits the rock.
5. **Heiter's Goodbye.** The grimoire holds nothing about living longer, and Heiter isn't
   surprised. He wanted Fern ready to travel. He asks them to go before he dies, so the girl
   won't lose anyone again. Frieren, in tears, insists on a proper farewell. They leave Strahl.
6. **Paid in Spells.** Odd jobs in the Turk region, paid in odd little spells, to Fern's
   despair. Frieren is asked to clean a statue of Himmel.
7. **Himmel's Flower.** Frieren wants to crown the statue with Himmel's favourite flower, the
   blue moon-weed. **The choice** (pays off in quest 20): search with her, however long it takes,
   or go ahead to the next town with apprentice Fern and wait. The search takes six months. In
   the search branch you follow a seed rat to a tower, and the flowers are at the top. In both,
   the statue gets its wreath.
8. **The Sealed Demon.** A village where Frieren sealed the demon Qual eighty years ago. Himmel
   checked the seal every year. Qual wakes to find his killing spell is now ordinary magic that
   every mage can block. The village elder is a boy Frieren once met.
9. **Sunrise.** New Year. Fern drags Frieren out of bed to see the sunrise, and Frieren works out
   why missing one used to upset her friends (see Lifted text). Keeper Fern was up anyway. She
   hands round tea.
10. **Flamme's Grimoire.** Eisen sends them for Flamme's true grimoire, which names Aureole, where
    souls rest, far north at the old castle. Eisen is too old to come. Frieren speaks of Flamme,
    her teacher, and the spell they both loved best, the one that makes a field of flowers.
11. **Ghosts in the Mist.** In a village where people vanish after seeing the dead, a monster
    wears the faces of the missed. It reads Keeper Fern: if she hasn't found Bramble, it wears
    Bramble's folded ear; if she has, it wears Hazel's coat. Apprentice Fern destroys it. Sit
    with Keeper Fern after.
12. **Stark.** Eisen's former student, terrified, has to face a dragon for the village that took
    him in. His hands shake for a whole night. Frieren tells him Eisen was scared before every
    fight. He slays it, and joins. Your Nubbin rides in his cloak from then on.
13. **The Statues.** A village with statues of the old party. In a flashback Himmel says why he
    always posed for them (see Lifted text). Then a northern city under Aura the Guillotine.
    Frieren is jailed for confronting Aura's envoy, Lügner. Fern and Stark save Graf Granat.
14. **The Scales.** Aura's Scales of Obedience weigh mana, and the stronger takes control of the
    weaker. Fern beats Lügner because she has hidden her real mana all along, a trick Flamme
    taught Frieren. Stark beats Linie. Frieren puts her own mana on the scales, and it outweighs
    Aura's. Aura is undone by her own spell, offscreen.
15. **Kraft.** A blizzard, and Stark is chilled to the bone. Six months in a hut with Kraft, an
    elf monk older than any of them, whose deeds nobody alive remembers, so he believes in the
    Goddess who will. Keeper Fern asks him how many friends he's outlived. He offers to praise
    Frieren, and she declines; Heiter once said the same.
16. **Birthdays.** The village of the sword in the stone, which Himmel never pulled out, whatever
    the songs say. For Stark's birthday Frieren cooks Eisen's hamburg steak. On Fern's
    birthday Stark forgets a present, they fall out, and he buys her a mirror-lotus bracelet. Frieren loses the ring Himmel gave her and finds it.
17. **The Stille.** In Äußerst, the First-Class Mage Exam. You carry cages for the Association.
    Frieren is teamed with Lawine and Kanne, Fern with Übel and Land. They must catch a Stille, a
    bird faster than sound. Frieren freezes the lake but one pool. She beats Denken.
18. **The Replicas.** The second test is to reach the bottom of a dungeon before dawn. A creature
    called Spiegel makes perfect copies from memory, including a copy of Frieren. Fern knows
    Frieren's one weakness: she can't sense mana while she casts. Examinees who break their
    bottles are carried out safe. Fern's staff, Heiter's gift, is broken; Frieren quietly has it
    mended.
19. **Serie.** The great mage Serie interviews them herself. She fails Frieren, who doesn't care
    for fighting, and bans her from Association buildings for a thousand years. She offers Fern
    an apprenticeship. Fern says no, and passes anyway. Denken, Wirbel, Land, Übel and Methode
    pass too.
20. **The Flower Field.** Departure. Fern remembers that Himmel hated tearful goodbyes. Before you
    step out of the page, Frieren casts her favourite spell for the two Ferns, and a field of
    flowers opens round your boots. (This farewell is our own scene.) The ending depends on quest
    7: if you searched, she presses a blue moon-weed and a seed into your hand; if you went
    ahead, a pressed flower only. "Next time, look with me."

**Consequences:**

- **Tier 3 (in the line):** the search (quest 7) shapes the last scene (quest 20), thirteen quests
  later. The ghost (quest 11) changes with the Grove, and Keeper Fern's lines in quests 2, 11
  and 15 build on it.
- **Tier 2 (the Grove):** read through `atlasDone('A21')`.
  - **The blue moon-weed** (search branch) grows by the cottage gate and flowers each spring.
    Otherwise the pressed flower goes into your journal.
  - **Keeper Fern and Moss.** Keeper Fern takes to sitting with Moss and asking about his old
    friends, and Moss gains new lines ("You've been reading about elves. We're not like that. We
    are worse at birthdays."). If Moss has faded, she sits by his flower on the hill instead, and
    tells it things.
- **Reads:** `s8Reunited` (Bramble comes along; the ghost); whether chapter 12 is over (quest 2);
  Moss faded (the keepsake); `atlasDone('A21')` from the Grove.

**Lifted text** (copyrighted: at most three one-sentence lines, from the English subtitles as
quoted by Reactor. Check against the licensed Crunchyroll track before scripting):

1. Frieren, at the funeral (quest 2): "Why didn't I try to get to know him better?"
2. Himmel, in flashback (quest 13): "I pose for these statues so you won't feel alone in the
   future."
3. Frieren, at New Year (quest 9): "I wouldn't have been able to see this sunrise if I'd been on
   my own."

**Rewards:** the blue moon-weed or the pressed flower; a mimic chest decoration that nips your
Nubbin once, the first time it's opened, and is then just a chest; Fern's purple coat for Keeper
Fern (a cosmetic, her choice); the Night of Remembering bookmark.

**Learning Grove version:** no. The demon battles keep it out.

**Care notes:**

- **Audience: `main`** (main game, not the Learning Grove). The demons are killed, but they
  dissolve into motes, there's no blood, and Aura's end is offscreen. If Maor prefers, rate it
  `teen` like A1.
- Fern's past. The story has her planning to end her life before Heiter stopped her. We never
  say it. Heiter found her alone after the war and took her home.
- Heiter's death and Himmel's are of old age, and gentle. Keep the funeral quiet.
- Exam injuries are softened: struck down, bottles broken, carried out safe.
- The Goddess is the story's own faith, not a real one.
- The characters must look exactly as licensed. There are no Grove versions of them.

## A22. The Candle (*Encanto*, Disney, 2021; Colombia; the Atlas)

**Why it works:** a family whose magic was born of a terrible flight keeps it by never letting
anyone crack. The girl without a gift is the only one who sees the house cracking. Her
grandmother has held the family so tight, to keep them safe, that the holding is what breaks
them. That is cinder-love in a Colombian kitchen, and the cure is ours too: people showing up
with their hands to rebuild a house. It belongs at the Long Table.

**When and where:** the page opens once Nova's atlas is in the Grove. It shows a valley ringed by
mountains in the Colombian coffee country, with white walls, red roofs and tall palms, and a
candle in a window. You and your Nubbin step in on the day of Antonio's gift ceremony. You carry
a small lamp, lit (or not) from your own Long-Grass post, which is how the page reads the Grove.

**Your role:** a traveller the Madrigals take in for a few days, and Mirabel's second pair of
hands. Mirabel keeps her story. Your Nubbin falls in with Antonio's animals. Antonio is the only
one who understands it, and he tells you, with great relish, what it thinks of you.

**The Long-Grass lantern state** (read from the Grove; it never writes back):

- `flicker`: before chapter 4's close.
- `dark`: from chapter 4's close until chapter 10's dawn, and afterwards if you kept the stone
  (`keptStone`).
- `lit`: from chapter 10's dawn, once the stone is unmade.
- `warm`: `cinder` is set (S19).

**The quests:**

1. **The Candle's Story.** Abuela Alma tells little Mirabel, and you, how it began: a young couple
   fled their home with three babies. At a river, Pedro stayed behind so they could cross, and he
   did not come. Her candle blazed, the mountains rose, and a house built itself. It's told in
   Abuela's words over painted images. Riders appear only as a far-off line on the bank.
2. **The Family.** Market morning. Mirabel takes you round her family and their gifts: Julieta's
   healing cooking, Pepa's weather moods, Luisa's strength, Isabela's flowers, Dolores's hearing,
   Camilo's faces. Nobody mentions Uncle Bruno, and the silence is very loud.
3. **Antonio's Door.** Antonio is five and frightened. Mirabel, whose own door faded away at her
   ceremony ten years ago, walks him up anyway. His door glows: he can talk to animals. That
   night Mirabel sleeps alone in the nursery.
4. **The Cracks.** During the party Mirabel sees cracks run through the walls towards the candle,
   and the flame shudder. Nobody else sees them, and Casita mends itself before she can show them.
   Your lamp reads the Grove: if `flicker` or `dark`, it shudders with the candle; if `lit` or
   `warm`, it holds, and Mirabel seizes on it: "Yours didn't. Something is wrong with ours."
5. **Abuela's Prayer.** Late at night, Abuela asks Pedro for help in front of the candle. Mirabel
   decides to save the miracle. **The choice** (pays off in quests 9, 15 and 16): what's your job?
   Be the eyes (map the cracks with Mirabel); the ears (make friends with Dolores, who hears
   everything); or the hands (help Luisa with her loads).
6. **Luisa.** The strongest Madrigal is carrying donkeys, a church and the whole village, and she
   is exhausted and frightened of being useless. Your Nubbin falls asleep on her boot, and she
   lets it. She tells Mirabel about Bruno's last vision.
7. **Bruno's Room.** Climb the endless sand stairs of the forbidden room into the cave beyond.
   Piece together the green glass of Bruno's vision: Mirabel, and Casita cracking behind her.
8. **Secrets.** Agustín, Mirabel's father, says to keep it quiet until after the dinner. If you
   chose the ears, Dolores tells you first, wretchedly, that she has heard it.
9. **The Dinner.** Mariano's family comes to propose to Isabela. Dolores lets the vision slip, and
   chaos follows: rain indoors, a cracked floor, gifts misfiring. Your job pays off here: the eyes
   see which wall gives; the ears get Dolores out of the room before she says more; the hands help
   Luisa hold the table up.
10. **Rats in the Walls.** Follow the rats carrying glass into the walls. Bruno never left. He has
    been patching the cracks from inside for ten years, putting on plays for the rats, and
    loving his family through the plaster.
11. **Look Again.** Bruno's vision ritual, with a circle of sand. The new vision shows Mirabel
    embracing Isabela, and the candle bright.
12. **Isabela.** The perfect sister doesn't want to marry Mariano, or to be perfect. She grows a
    cactus in anger, and then everything she's never been allowed to grow. The sisters make up,
    and the house brightens.
13. **The Breaking.** Abuela blames Mirabel for everything. Mirabel tells her nobody can ever be
    good enough for her. Casita splits. Mirabel runs in for the candle, the house pushes her out
    to safety, and the flame dies in her hands. Your lamp reads the Grove: if `dark`, it goes out
    too; if `lit`, it is the only light in the ruins; if `warm`, the night is oddly warm.
14. **The River.** Mirabel runs to the river. Abuela comes, sits beside her, and tells her about
    Pedro and the day she lost him, and how she has been afraid ever since. Yellow butterflies.
    Mirabel answers her (see Lifted text). Bruno comes, and Abuela holds him. With `keptStone`,
    Abuela takes your cold hands in hers without a word, and keeps them there.
15. **Building Casita.** The whole village comes with tools, because the Madrigals helped them all.
    No gifts now: everyone carries. Your job pays off again: with the eyes, you rebuild along
    Mirabel's crack map; with the ears, Dolores directs the work by listening for wobbles; with
    the hands, Luisa sits down for the first time in years, and you carry for her.
16. **The Doorknob.** The family gives Mirabel the last piece, the doorknob for the front door.
    She puts it in, and the magic comes back. Mirabel lights a candle stub from the new flame for
    you to take home. The family photo is taken with you at its edge, beside Mirabel and whoever
    you worked with.

**Consequences:**

- **Tier 3 (in the line):** your job (quest 5) changes the dinner (quest 9), the rebuilding (quest
  15) and who stands beside you in the photo (quest 16), four to eleven quests later.
- **Tier 2 (the Grove):** read through `atlasDone('A22')`. The candle stub becomes a painted tin
  candle-holder hung on the Long-Grass post. It mirrors the post: unlit while the post is
  `flicker` or `dark`, lit from `lit` on. It's a decoration and changes nothing in the campaign.
  It also brings the Long Table bookmark.
- **Reads:** the Long-Grass lantern state (quests 4, 13 and 16); `keptStone` (quest 14).

**Lifted text** (copyrighted: at most three one-sentence lines. Checked against Save the Cat's
*Encanto* beat sheet. Check against the licensed film before scripting):

1. Abuela, remembered at Mirabel's own ceremony (quest 3): "Whatever Gift awaits will be just as
   special as you."
2. Mirabel, at the river (quest 14): "We were given a miracle because of you."

Only two are used. No song lyrics are used. The film's songs, including the one about Bruno, are
not quoted or paraphrased; the family's silence about him is shown, not sung.

**Rewards:** the candle-holder (above); an embroidered skirt or waistcoat pattern for your
Nubbin; a doorknob decoration for the cottage door; a yellow-butterfly ambient; the Long Table
bookmark.

**Learning Grove version:** yes, softened. Colombia on a map: mountains, coffee country, two
coasts. Colombian food: arepas (Julieta heals with them) and buñuelos. Family words in Spanish
(abuela, tía, primo). The tiple, a small Colombian guitar. The sombrero vueltiao of the Zenú
people. Families who have to leave home, told gently.

**Care notes:**

- **Advisers.** Commission Colombian advisers before scripting, as Part L does for A5, A7 and A10:
  a historian of early-20th-century Colombia; Afro-Colombian and Indigenous (including Zenú)
  advisers for dress and names; and someone from a family that has lived through displacement.
  Disney's own Colombian Cultural Trust (Juan Rendón, Natalie Osma, Alejandra Espinosa Uribe,
  Edna Liliana Valencia Murillo, the botanist Felipe Zapata) is the model, not a list of people to
  approach.
- **Displacement.** The film draws on the Thousand Days' War (1899–1902) but never names it, and
  neither do we. The riders belong to no side and are never close. Pedro's death is told, not
  shown. For many Colombian families displacement is still a living experience, so keep it
  grave and true.
- Abuela is never a villain. She is a frightened woman who held on too tight, and she's loved.
- All ages.

## LB1–LB12. Play (inspired by *Bluey*, Ludo Studio, 2018; Australia; Learning Grove line)

**Why it works:** *Bluey* showed the world that play is how children work things out, and that a
tired parent who says "one more go" is doing something important. This line borrows that spirit
and nothing else. A new family moves into the valley, and their games of pretend carry the
Learning Grove's lessons: counting in a shop, shadows in a torch show, a race that somebody has to
lose. It is the Grove's theme in a small key: love is a method, and play is how you practise it.

**When and where:** the Larkins move into the empty cottage past Fern's in late spring, after
chapter 1. The line runs through summer into early autumn, one game at a time, each needing the one
before. In the Free Grove it runs in order at any season. It plays only with the Learning Grove on,
pauses for chapters 9–11, and never repeats. The family:
- **Ama Larkin**, Mum, drives the post van up and down the valley and draws the best maps.
- **Sam Larkin**, Dad, grew up in Brisbane, makes chairs in the shed, is always tired, and always
  says yes to one more go.
- **Maisie** (six) makes up the rules. **Ned** (four) breaks them, mostly by accident.

**Your role:** the grown-up next door who gets roped in: a customer, a patient, a sleeping giant's
next victim. Maisie and Ned lead every game. Your Nubbin is everyone's favourite player, and the
Larkins don't have one, so they borrow yours (they always give it back, and they always ask).

**The quests** (each with the beat, then the lessons: kind, standard, and the sprout and reader
angles):

1. **Boxes.** Moving day. The van is unpacked, and the empty boxes are better than anything in them.
   *Choice:* which box Ned keeps (the big one, the long one or the tall one). It pays off in LB6 and
   LB12.
   - *do* (`edu:sort:boxes:size`), K.MD.A.2. Sprout: big, middle, small. Reader: stack 12 boxes in
     equal piles three ways (3.OA.A.1).
   - *ask*, CASEL: Self-awareness. Ned is sad about leaving his old bedroom. Sprout: "How does Ned
     feel?" Reader: why can a happy day still feel sad?
2. **Shops.** Ned's leaf shop on the cottage step. Everything costs Shells; prices change often.
   - *do* (`edu:count:shells:5`), K.CC.B.5. Sprout: count out 5 Shells. Reader: pay 20 for a
     13-Shell leaf and work out the change (2.OA.A.1).
   - *notice*, ELOF: Social and Emotional Development / CASEL: Relationship skills. Maisie wants to
     be the shopkeeper too. They take turns.
3. **Don't Touch the Grass.** Cushions across the lawn; the grass is the pond, and something with
   tickly fingers lives in it.
   - *ask*, K.G.A.1. Sprout: is Ned on, beside or behind the cushion? Reader: measure the biggest
     jump with a tape (2.MD.A.1).
   - *do*, ELOF: Perceptual, Motor, and Physical Development (sprout only): hop, then tiptoe.
4. **Sleeping Giant.** Sam is the giant, asleep in a deckchair. Creep up; freeze when he turns.
   The slower you go, the closer you get.
   - *do* (`edu:order:steps:slow`), CASEL: Self-management. Sprout: slow feet, quiet feet. Reader:
     why do slow, careful moves win this game?
   - *notice*, 3-PS2-1 (reader): a push starts a swing, and a balanced push keeps a statue still.
5. **Nubbin Doctor.** Maisie opens a clinic. Your Nubbin is the patient; it is not ill, it is just
   very good at lying still.
   - *notice*, K-LS1-1. Sprout: what a Nubbin needs: food, water, rest, a cuddle. Reader: what
     every animal needs to live.
   - *ask*, CASEL: Social awareness. Ned bandages the wrong leg. How do you tell a friend kindly?
6. **Den Day.** Rain. A blanket den in the front room, held up with chairs and Ned's box (LB1).
   - *do* (`edu:tap:shape:triangle`), K.G.A.2. Sprout: find the triangle, the square, the circle.
     Reader: the rug is 3 m by 2 m; how far round it (3.MD.D.8)?
   - *notice*, K-ESS2-1. Sprout: rain today, sun yesterday. Reader: keep a week's weather tally
     (3-ESS2-1).
7. **Shadow Show.** A torch and a bedsheet. Ned's hand-rabbit is huge or tiny depending on where he
   stands.
   - *do* (`edu:order:shadows:size`), 1-PS4-2. Sprout: closer to the torch makes a bigger shadow.
     Reader: why a shadow forms, and why it changes size.
8. **Treasure Map.** Ama draws a map of the lane with an X. Follow it to a tin of raisins.
   - *do* (`edu:order:map:lane`), D2.Geo.2.K-2. Sprout: pond, gate, tree, X. Reader: north, south,
     east and west on a real compass (2-ESS2-2).
   - *ask*, RL.K.3 (sprout) / RL.3.6 (reader): Maisie hid the treasure in a different place from the
     map. Was that fair?
9. **Café Larkin.** A restaurant in the garden. You order; Ned brings something else.
   - *do* (`edu:count:plates:4`), K.CC.B.4. Sprout: one plate for each person. Reader: three cakes at
     4 Shells each (3.OA.A.3).
   - *ask*, SL.K.1 (sprout) / CASEL: Relationship skills (reader): what do you say when the
     waiter gets your order wrong?
10. **Boats.** The family sails home-made boats on the Grove pond. Which float?
    - *do* (`edu:sort:boats:float`), K.MD.B.3 (sprout) / 2-PS1-1 (reader). Sort cork, leaf, pebble
      and spoon into floats and sinks.
11. **The Big Race.** Maisie wins every race. Ned loses, and lies face down on the grass.
    *Choice (reader only):* race properly, let Ned win, or race holding his hand.
    - *ask*, CASEL: Self-management. Sprout: what helps when you feel cross? A breath, a hug, a
      sit-down. Reader: how does each child respond to losing (RL.2.3)?
    - *do* (`edu:tally:races:5`), 2.MD.D.10 (reader): a tally chart of five races.
12. **The Long Grass Campout.** Late summer. Sam is so tired he's asleep before tea, so the children
    invent a game where Dad has to lie down. Everyone lies on the grass in sleeping bags and waits,
    very still, for the first star. *Payoff of LB1:* Ned's box is their boat (they sail to the
    stars), their rocket (they fly), or their house (they camp in it).
    - *notice*, 1-ESS1-1. Sprout: the Sun goes down, the stars come out. Reader: Sam says it's winter
      in Brisbane now, because the Earth's tilt gives the two halves opposite seasons (1-ESS1-2).
    - *ask*, CASEL: Self-awareness. Sprout: how does waiting feel? Reader: why was lying still
      together the best game of the summer?

**Consequences:**
- **Tier 3 (in the line):** Ned's box (LB1) is the den door in LB6 and, eleven quests later, the
  boat, rocket or house of the last night. The reader race choice in LB11 sets how Ned joins the
  campout in LB12: proud and loud, a bit too pleased with himself, or holding Maisie's hand.
- **Tier 2 (the Grove, Learning Grove only):** the cottage past Fern's is lived in. Washing
  flaps on the line, Ned waves from the gate, and the box sits in their garden for good, as a
  boat, rocket or house.
- **Tier 1:** none. **Reads:** none.

**Lifted text:** none. *Bluey* is copyrighted and nothing is quoted from it: no lines, characters,
names, episode plots, dog-family designs, places (no Queenslander house) or music. The family are
people, so the Grove's rule that animals don't speak is kept. The games are old playground games
(shops, dens, grandmother's footsteps, shadow puppets) given new rules. The game's notes say
"inspired by *Bluey*".

**Rewards:** a cardboard boat (or rocket, or house) decoration; a blanket den; a torch-and-sheet
shadow screen; Ama's lane map, framed; a "Café Larkin" sign. All one-time.

**Learning Grove version:** this is the Learning Grove version; there is no main-game line.

**Care notes:**
- Ages 3–10, gentle throughout. Sprout choices are always kind; Ned is never laughed at.
- Sam's tiredness is ordinary tiredness, never illness, and never a problem the child must fix.
- Ama is a working mum and Sam is the parent at home. Neither is the joke.
- The Larkins never appear in the campaign's scenes and hold no lantern at the Long Night; the
  ten Keepers stay the fellowship.
- Nothing about the Larkins or their games may look like *Bluey*'s designs.

## A23. Remember Who You Are (*The Lion King*, Disney, 1994; East Africa; the Atlas)

**Why it works:** a cub who thinks he killed his father runs away, grows up eating grubs with two
friends who taught him not to worry, and is called home by a voice in the clouds. It's the most
loved father-and-son story in film, and a homecoming story like A5's. Its heart rhymes with the
Grove's: "Remember who you are" is "we are made of being remembered", turned round, and the
pride's ruin under Scar is a garden kept by someone who only wanted the crown.

**When and where:** the page opens once Nova's atlas is in the Grove. It shows a red rock above
a golden plain at sunrise. The Pride Lands are fiction, modelled on Kenya's Hell's Gate National
Park, where the film's crew went to draw. You and your Nubbin step down into Rafiki's baobab,
where you lodge.

**Your role:** Rafiki's guest and helper: you mix his paints and carry his gourds. Simba, Nala,
Mufasa and the rest keep their story. Inside the page the animals talk to you, because that is
the story's rule; your Nubbin still doesn't. It tumbles with the cubs and learns to pounce. Rafiki
teaches you one Swahili word early, *polepole* (slowly), and uses it whenever you hurry.

**The quests:**

1. **The Presentation.** Dawn. The animals gather below the rock. Rafiki cracks a gourd, marks the
   new cub's brow, and lifts him up for all of them to see. Your Nubbin climbs your back to look.
2. **Rafiki's Tree.** Back in the baobab, Rafiki paints the cub on the inside of his tree. Mix
   the colours, ochre and fruit-red.
3. **Everything the Light Touches.** Mufasa shows Simba the kingdom at sunrise, and the shadowy
   place he must never go. He talks of everything being joined in one great circle. Then a
   pouncing lesson on Zazu. Your Nubbin pounces too, and misses.
4. **Uncle Scar.** On his ledge, Scar lets slip, oh so sorry, that there's an elephant graveyard
   beyond the border, and no cub should ever go there. You don't like the way he says it.
5. **Losing Zazu.** Simba and Nala shake off Zazu to get to the graveyard. You are dragged along.
   Nobody sings; it's a chase through the herds.
6. **The Graveyard.** Bones, steam, and three hyenas: Shenzi, Banzai and Ed. A chase among the
   ribs, and then Mufasa's roar.
7. **Under the Stars.** Mufasa sends Nala home and talks with Simba under the stars: about being
   brave, and the great kings of the past (see Lifted text). You're sitting a little way off, with
   your Nubbin on your knee.
8. **The Gorge.** Scar leaves Simba in a gorge to wait for a surprise. You are on the rim with Zazu
   when the wildebeest come. Zazu flies for Mufasa, and Scar knocks him into the rocks. You run to
   Zazu and tend his wing, so you don't see the ledge. When the dust settles, Simba finds his
   father lying still, and lies down beside him. Scar tells Simba it was his fault, and to run.
9. **Run.** The hyenas chase Simba into the thorns. **The choice** (pays off in quests 10 to 13
   and 16): follow Simba into exile, or carry Zazu home to Rafiki's tree.
10. **The Desert.** *With Simba:* he collapses in the desert, vultures circle, and a meerkat and a
    warthog, Timon and Pumbaa, chase them off. *With Rafiki:* Rafiki grieves and smudges out the
    cub on his wall. Scar takes the throne and lets the hyenas in.
11. **No Worries.** *With Simba:* he grows up in the jungle oasis on grubs and a motto, *hakuna
    matata*, Swahili for "no worries". Your Nubbin will not eat a grub. *With Rafiki:* the herds
    leave, the grass dies, and Sarabi holds the lionesses together. Nala slips away to find help.
12. **Nala.** Nala, hunting, goes for Pumbaa. Simba stops her, and they know each other. She tells
    him of the drought, and he won't come home.
13. **The Wind.** Simba throws himself down on a ridge, and a puff of dust and fur rises and blows
    away on the wind. *With Simba:* you watch it go. *With Rafiki:* it reaches the baobab. Rafiki
    sniffs it, laughs, and paints a mane on the cub. You set off together.
14. **Look Harder.** Rafiki leads Simba to a pool. In his reflection is his father's face. Then
    Mufasa in the clouds (see Lifted text). Rafiki's stick on Simba's head teaches him what the
    past is for. Your Nubbin looks up at the clouds for a long time. If chapter 12 is over and
    Hazel has gone up the hill, it then looks at you, and Rafiki puts a hand on your shoulder and
    says nothing. Hazel never appears.
15. **Home.** The Pride Lands are bare and grey. Timon and Pumbaa draw off the hyenas with a
    ridiculous show (no song). Scar strikes Sarabi, and Simba steps out of the smoke. Scar shames
    him in front of the pride, and dangling him over the edge, whispers the truth. Simba makes him
    say it aloud. A fight in the lightning-fire. Scar falls, and the hyenas he betrayed turn on
    him, offscreen, in shadow.
16. **The Rains.** Rain puts out the fires. Simba climbs the rock and roars. Later, the land is
    green, and Rafiki presents a new cub. The ending follows quest 9: with Simba, Timon and Pumbaa
    pull you in to stand with them; with Rafiki, he hands you the gourd to crack.

**Consequences:**

- **Tier 3 (in the line):** quest 9 (Simba or Rafiki) changes quests 10, 11 and 13 and your place
  at the last presentation (quest 16), seven quests later.
- **Tier 2 (the Grove):** read through `atlasDone('A23')`. Rafiki's painting: a small painting of
  your Nubbin, with the fruit-red mark on its brow, appears inside the hollow of Hazel's crooked
  tree. A sunset "roar" emote for every Nubbin. The Night of Remembering bookmark.
- **Reads:** whether chapter 12 is over (quest 14); `atlasDone('A23')` from the Grove.

**Lifted text** (copyrighted: at most three one-sentence lines. Checked against Wikiquote's *The
Lion King* page; check against the licensed film before scripting):

1. Mufasa, under the stars (quest 7): "I'm only brave when I have to be."
2. Mufasa, under the stars (quest 7): "The great kings of the past look down on us from those
   stars."
3. Mufasa, in the clouds (quest 14): "Remember who you are."

No song lyrics are used, and the songs' scenes are told as action. *Hakuna matata* appears only as
the everyday Swahili phrase, never as the song.

**Rewards:** Rafiki's painting (above); a tiny gourd cosmetic for your Nubbin; the roar emote; a
baobab-bark bench (a decoration); the Night of Remembering bookmark.

**Learning Grove version:** yes, as a savanna page, not a retelling of the death. Swahili words:
*simba* (lion), *rafiki* (friend), *twiga* (giraffe), *tembo* (elephant), *nyota* (star), *jua*
(sun), *mvua* (rain), *asante* (thank you), *polepole* (slowly). How a lion pride lives:
lionesses hunt together. The great migration of wildebeest and zebra between the Serengeti and
the Maasai Mara. Dry season and rains. Why every animal on the plain matters.

**Care notes:**

- **Mufasa's death.** You are with Zazu and don't see the fall. No body is lingered on: one shot
  of Simba lying down beside his father, then the cut. Scar's whisper is kept, but not shown with
  any cruelty beyond the film's. Simba is never told the truth in a way that frightens: "it wasn't
  your fault" lands clearly in quest 15.
- **Scar's death** is offscreen, in shadow and fire. Nothing is shown.
- **Advisers.** Work with East African (Kenyan and Tanzanian) Swahili speakers on every Swahili
  word, Rafiki's speech, the landscape and the plants. Rafiki must not be a comic caricature of
  an African healer.
- **Hakuna matata.** In 2018 a petition asked Disney to drop its US trademark on the phrase for
  clothing, and Swahili speakers debated it. We use it only as the ordinary phrase, and sell
  nothing with it on.
- The 2019 remake and *Mufasa* (2024) are not used.
- All ages.

## A24. The Law of the Jungle (*The Jungle Books*, Rudyard Kipling, 1894–95, India; the Atlas)

**Why it works:** a man's cub crawls into a wolf's cave, and Mother Wolf says he's hers. A pack
argues over whether he can stay; a bear vouches for him and a panther buys him with a bull. He
learns the Law, words that make every creature kin, and is cast out by both his peoples before
he finds where he belongs. That is a whole Grove theme: a stray taken in, and a pack made by
choice. The coda, "The White Seal", is the Hollow strays at sea: one white seal who looks for a
beach where nobody hunts them, and finds one.

**When and where:** the page opens once Nova's atlas is in the Grove. It shows the Seeonee hills
at dusk, a cave mouth and a flat rock above. You and your Nubbin step in. This is Kipling's
books, not the Disney films: Kaa is a friend, Baloo is a strict teacher, there is no ape king,
and nobody sings.

**Your role:** a guest of the Free People. Baloo teaches you the Master Words beside Mowgli, so
the jungle lets you be. Mowgli keeps his story. You carry messages, keep watch and sit at the
edge of the Council. Mother Wolf lets your Nubbin sleep among her cubs from the first night, and
it never quite stops thinking it's a wolf.

**The quests:**

1. **The Cave.** Father Wolf and Mother Wolf, and the jackal Tabaqui, who flatters and sneaks.
   Shere Khan, the lame tiger, roars below; he has been hunting a man's cub. The cub toddles
   into the cave, unafraid, and pushes in among the cubs to get warm. Shere Khan's head fills
   the mouth of the cave. Mother Wolf faces him down. She names the cub Frog.
2. **The Council Rock.** At full moon the pack meets to look over the new cubs. Akela, the great
   grey Lone Wolf, calls them to look well. Shere Khan claims the cub. The Law says two who are
   not his parents must speak for him. Baloo the brown bear speaks. Bagheera the black panther
   offers a bull, fat and newly killed. You stand at the edge with your Nubbin while the pack
   decides.
3. **Baloo's Lessons.** The Law of the Jungle: hunting calls, the Strangers' Hunting Call, the
   Master Words for the hunting people, the birds and the snakes. Mowgli is bored and gets
   cuffed; you learn too, and so does your Nubbin, after its fashion.
4. **The Monkey-People.** The Bandar-log, who boast of their greatness and forget it at once,
   carry Mowgli off through the treetops. He calls the Master Word to Chil the kite and asks him
   to tell Baloo and Bagheera. You run below with them, and they go to find Kaa the rock python.
5. **The Cold Lairs.** A ruined city. Bagheera and Baloo are mobbed by monkeys (scuffles, no
   wounds). Kaa breaks in through the wall and the monkeys flee in terror. Then Kaa begins his
   hunger dance; the monkeys, and even Bagheera and Baloo, start walking towards him. Mowgli pulls
   them out. You carry your Nubbin out with your hand over its eyes.
6. **The Red Flower.** Years pass. Akela is old. Shere Khan has turned the young wolves. Bagheera
   tells Mowgli to fetch the Red Flower, fire, from the village. He takes a pot of coals from a
   hut at dawn and feeds it all day. You help keep it alive.
7. **The Council of Fire.** Akela misses his kill, and the young wolves want him gone. Shere Khan
   asks for the man's cub. Mowgli drops the fire-pot, a dead branch catches, and the pack falls
   back. He singes Shere Khan's fur, saves Akela's life, and tells the pack he is going to his
   own people. Then he cries for the first time. Bagheera tells him what tears are.
8. **Messua.** In the village a woman, Messua, takes him in. Her son Nathoo was taken by a tiger
   years ago, and she half believes Mowgli is him. He learns speech, sleeps badly under a roof,
   and herds the village buffalo. At the village tree the old hunter Buldeo tells tall tales
   about the jungle, and Mowgli laughs at him. You lodge with Messua.
9. **Tiger! Tiger!** Grey Brother brings word: Shere Khan is lying up in the ravine of the
   Waingunga. Mowgli and Akela split the buffalo herd and drive it in from both ends. Shere Khan
   doesn't come out. (A rush of dust and noise, then quiet; no body is shown.) Buldeo comes for
   the bounty; Akela holds him, gently, while Mowgli takes the hide.
10. **Stones.** The village calls Mowgli a sorcerer and throws stones. Messua runs after him,
    crying. He goes. **Choice:** go with Mowgli into the jungle, or stay a little with Messua,
    who has lost a son twice now, and follow later. Pays off in quests 13, 15 and 16.
11. **Look Well.** Mowgli spreads the hide on the Council Rock. Akela lies down on it and calls
    the pack: has he kept his word? The young wolves, hungry and lame, ask Akela to lead them
    again. Mowgli says he'll hunt alone with his four brothers.
12. **The Water Truce.** A drought. Only the Peace Rock pool is left, and while the water is
    low nobody hunts there. Hathi the wild elephant tells the story of how fear came to the
    jungle and the First Tiger. Everyone drinks side by side. Your Nubbin drinks beside a deer.
13. **Letting in the Jungle.** The villagers have tied up Messua and her husband for harbouring a
    sorcerer, and mean them harm. Mowgli frees them by night and sends them to a town where they
    will be safe. Then Hathi and his sons let the jungle in: the fields are trampled, the
    village is overgrown, and the villagers leave. Nobody is killed.
14. **Red Dog.** The dhole, the red dogs of the Deccan, come up the river in a great pack.
    Mowgli and Kaa make a plan: lead them past the Bee Rocks of the Little People and into the
    river, where the wolves are waiting. The battle is told from the bank, in noise and spray.
    Akela, very old, fights his last fight and dies by Mowgli's side. You sit with them both.
15. **The Spring Running.** Mowgli is nearly seventeen, and the spring makes him miserable for
    no reason he can name. He runs north all night and finds a lamp in a hut: Messua, a widow
    now, with a baby son. She feeds him and he sleeps. Grey Brother follows him.
16. **Man Goes to Man.** At the Council Rock, Baloo and Kaa wait for him. Kaa says it plainly.
    Baloo tells him to make his own trail. Bagheera comes last, having killed a bull to pay the
    old debt, and says goodbye. Mowgli goes, with Grey Brother and the three other wolves.
17. **The White Seal (coda).** On a beach called Novastoshnah in the Bering Sea, Matkah's pup is
    born white. Kotick learns to swim in the surf and goes south with the herd. Back on the
    island, he follows a drove of young seals inland and sees what the men do to them (he turns
    away; nothing is shown). He swears to find a beach men can't reach.
18. **Where No Man Comes (coda).** Five seasons of searching. The sea-lion doesn't know; the
    walrus Sea Vitch is rude, and the gulls mock him for it. At last the Sea Cows, slow and
    silent, lead Kotick through an underwater tunnel to hidden beaches. He goes home and tells
    the seals, and they laugh. He fights for it (shoving and roaring, no blood), his father
    joins him, and nearly ten thousand seals follow him to the new beaches.

**Consequences:**
- **Tier 3 (in the line):** *Stones (Q10 → Q13, Q15, Q16).*
  - **With Mowgli:** you hunt with the four wolves for a season and see the jungle from inside.
    In Q13 you watch from the trees as Mowgli unties Messua, and carry word to Hathi. In Q15
    Messua doesn't know you. In Q16 Mowgli asks you to walk the first mile with him.
  - **With Messua:** you stay a while in her hut. In Q13 you are in the hut when the villagers
    come; you loosen the ropes before Mowgli arrives, and walk Messua and her husband to the
    road. In Q15 she puts the baby in your arms while she feeds Mowgli. In Q16 Mowgli asks you to
    look in on her.
  - **Endings:** on both paths Mowgli goes to men, as Kipling wrote it. What changes is the last
    image: the trail north with four wolves and you, or the lit hut with the baby asleep.
- **Tier 2 (the Grove):** the Council Rock, a flat rock by the long grass where your Nubbins sit
  in a ring when they like (a decoration, no timer). A white seal petpet who flops around the
  pond. A "We be of one blood" sign carved on a plank, for the gate.
- **Reads:**
  - `s8Reunited`: in Q2, when Bagheera pays for the cub, Fern's voice comes from the page's edge
    as a memory: "That's what Bramble did for the strays." One line.
  - `s24Done`: Hazel's margin note beside Kotick. "Safe beach first. Then a well one. He found
    both. H."

**Lifted text** (Kipling's own text. *The Jungle Book*, 1894, Project Gutenberg #236; *The Second
Jungle Book*, 1895, and "The White Seal" checked against the Kipling Society's copies):
1. "O thou Mowgli—for Mowgli the Frog I will call thee—" (Mother Wolf, Q1.)
2. "Now to Baloo's word I will add one bull, and a fat one, newly killed, not half a mile from
   here" (Bagheera, Q2, a fragment.)
3. "We be of one blood, ye and I" (The Master Words, Q3 and wherever the Keeper uses them.)
4. "Let them fall, Mowgli. They are only tears." (Bagheera, Q7.)
5. "Man goes to Man at the last, though the Jungle does not cast him out." (Kaa, Q16.)
6. "Good hunting on a new trail, Master of the Jungle! Remember, Bagheera loved thee."
   (Bagheera, Q16.)
7. 'Sea Catch,' she said at last, 'our baby's going to be white!' (Matkah, Q17.)
8. "in that sea where no man comes." (Q18, the last words of the prose story.)

The poem "The Law of the Jungle" gives the line its name. Its first line, "Now this is the Law of
the Jungle — as old and as true as the sky;", can head Baloo's lesson board in Q3 in place of
item 2 if Maor prefers. It is a poem, not a song.

**Rewards:** the Council Rock; the white seal petpet; the "one blood" plank; a fire-pot lantern;
Kaa-coil cushion for your Nubbin's bed.

**Learning Grove version:** yes, softened, without lifted text. A child learns where the Seoni
hills are in central India, and meets real animals from the books: tigers, sloth bears, leopards,
rock pythons, dholes and Indian elephants, and how they're protected today; what a monsoon and a
drought do to a water hole; northern fur seals and the Bering Sea; and that Steller's sea cow,
Kotick's guide, died out in the 1700s because it was hunted.

**Care notes:**
- **Kipling and empire.** Kipling was born in Bombay and wrote these stories as a supporter of
  British rule in India, and other work of his is openly imperialist. The page's intro card says
  so plainly. In the books, the villagers can be written as foolish and the priest and Buldeo as
  figures of fun; here the villagers are frightened people, not stupid ones, and Messua is the
  village's heart. Messua is sent to safety, not to "the English". "In the Rukh", where Mowgli
  works for the colonial forest service, is left out. Commission Indian advisers for names,
  dress, the village and the land.
- **The Bandar-log.** Monkeys only. No human-coded designs or speech.
- **The White Seal's hunters** are Unangax̂ (Aleut) men working the seal harvest. The Unangax̂ of
  the Pribilofs were forced into that work for generations, so they are never villains here: they
  are workers seen from a seal's eye, and the scene cuts away. Ask an Unangax̂ adviser to check
  it.
- **Softened for All:** Shere Khan's death is dust and silence, and the hide is shown only on the
  rock; the Cold Lairs and Red Dog fights have no wounds; Akela's death is gentle, like Fossil's;
  Kotick's fights are shoving matches. "The King's Ankus" (men killing each other over treasure)
  is left out. Rated All, with care.
- **Disney.** No Disney names, designs, songs or characters (no King Louie).

## A25. The Nothing (*The Neverending Story*, Michael Ende, 1979; Germany; the Atlas)

**Why it works:** a lonely boy steals a book and reads it in a school attic. Inside it, a land
is being eaten by a nothing that spreads wherever hope goes out, and a boy hunter crosses the
whole of it to learn that only a new name can save the Empress. Then the reader goes in himself,
and every wish he makes costs him a memory, until he has lost his own name and a friend has to
say it for him. That is the Grove twice over: we are made of being remembered, and a power that
gives you whatever you want is Cinder's stone in a prettier case. It follows S6, where a grey
Nubbin's true name was kept for her in a book until someone could give it back.

**When and where:** the page opens once Nova's atlas is in the Grove. It shows a door with a
little bell, and a book whose cover has two snakes biting each other's tails. Both halves of the
novel are played, from Coreander's shop to Coreander's shop. Your Nubbin comes with you.

**Your role:** a traveller who came in through a page. You walk with Atreyu from the Grassy Sea
and later with Bastian's company; neither story is yours. Your Nubbin rides on Artax's saddle,
then in the fur behind Falkor's ears. The Empress tells you plainly that you can't give her name
(Q10): you came in through a book, as everyone in Fantastica did. It has to be the boy.

**The quests:**

1. **The Bookshop.** Rain. A round, knock-kneed boy runs from bullies into Carl Conrad
   Coreander's shop. While the old man is on the telephone, he takes a book with two snakes on
   the cover and runs. You step out of the page behind the bell, unseen. Follow him to the school
   attic, where he wraps himself in an old blanket and opens the book. So do you.
2. **The Messengers.** A forest is going missing in patches, not burnt or cut but simply not
   there, and looking at the gaps feels like going blind. Messengers from all over Fantastica set
   off for the Ivory Tower. Walk with a few of them; your Nubbin won't go near the edges.
3. **The Ivory Tower.** Cairon, the black centaur, is the Empress's physician. She is ill, and
   the illness and the Nothing are one. She has chosen a hero, and Cairon carries AURYN, the
   amulet, to the Grassy Sea. Help him find the way; he is expecting a warrior, not a boy.
4. **Atreyu.** In the Grassy Sea, among the green-skinned hunters, a boy about ten years old
   takes the amulet. His horse is Artax. He asks if you'll come, because your Nubbin has already
   climbed on to Artax's saddle and won't get off.
5. **The Swamps of Sadness.** The sadness gets into everything. Artax slows, then stops, and
   says he can't go on. Atreyu holds his head while the swamp takes him, slowly and without
   struggle. Your Nubbin lies down in the reeds too. Sit beside it until it gets up. (Kept short.)
6. **Morla the Aged One.** A mountain that is really an old, old turtle, who doesn't care about
   anything, sneezes, and talks to herself as "we". Being old is the whole of her. She says only
   the Southern Oracle might know a cure, and that it is ten thousand miles away.
7. **Ygramul the Many.** In the Dead Mountains a white luckdragon, Falkor, is caught in a web
   over a chasm. Ygramul is one creature made of a swarm. Atreyu bargains, and they are both
   stung: the sting sends you anywhere you name before it does its work. Atreyu names the Oracle.
   You hold his sleeve. (No pain shown; the sting is a jolt and a fall through light.)
8. **Engywook and Urgl.** Two quarrelsome gnomes live by the Oracle's gates. He has studied the
   gates all his life and never gone through; she brews the cures that save Atreyu and Falkor.
   Fetch herbs for her, and listen to him explain why he is right about the sphinxes.
9. **The Three Gates.** The Great Riddle Gate: two sphinxes whose gaze freezes anyone they don't
   let through, and they let Atreyu through. The Magic Mirror Gate shows you what you really are:
   Atreyu sees a round boy in a blanket in an attic. So do you. The No-Key Gate opens only to
   someone who no longer wants to go in.
10. **Uyulala.** The Oracle is only a voice, and answers only in rhyme. The Empress needs a new
    name, and only a human child from beyond Fantastica's borders can give it. Nobody has come
    for a long time. (Her rhymes are original; see Care notes.)
11. **The Wind Giants.** Atreyu and Falkor fly for the border. Four giant winds fight in the sky,
    and Atreyu falls and loses AURYN in the sea. You and your Nubbin stay with Falkor, who will
    not stop searching.
12. **Spook City.** Atreyu lands in a ruined city. Chained in it, starving, is Gmork the
    werewolf, a servant of the power behind the Nothing. Gmork tells him that Fantasticans who
    leap into the Nothing become lies in the human world. Atreyu tells him who he is, and Gmork
    dies laughing. Even dead, his jaws close on Atreyu's leg. Falkor comes down out of the dark
    with AURYN in his mouth, and you pull Atreyu free together.
13. **The Old Man of Wandering Mountain.** At the Ivory Tower the Empress tells Atreyu he has
    already done it: his journey brought the rescuer, who is listening now. The boy won't speak.
    She climbs to the one person she should never meet, the Old Man who writes down everything as
    it happens. He begins to read the story from the very first page, and the story begins again,
    and the boy in the attic understands it will go round for ever unless he acts.
14. **Moon Child.** Bastian shouts her new name. Everything goes dark. In the dark, the Empress
    puts a single grain of sand into his hand. This ends Part One.
15. **Perelín and Goab.** From the grain, at Bastian's wish, a night forest grows. He wishes
    himself handsome and strong, and forgets he was ever anything else. The forest becomes a
    desert of colours, and its lord is Graógramán, the Many-Coloured Death, a lion who turns to
    stone every night. He gives Bastian the sword Sikanda. **Choice:** Bastian, delighted, asks
    you whether he always looked like this. You saw him in the Magic Mirror Gate (Q9). Say
    (a) "No. You were round and plain and reading in an attic, and I liked you then"; (b) "You
    look like yourself"; or (c) say nothing now, and write down what you saw in your notebook and
    keep it for him. This pays off in Q16, Q18, Q19 and Q20.
16. **Amarganth.** The silver city on a lake. A tournament. Atreyu and Falkor find Bastian here,
    and Atreyu is worried: every wish is costing Bastian something, and he can't tell what.
    Hynreck, a knight, wants to win a princess and resents the newcomer.
17. **Xayide.** A sorceress with mismatched eyes lives in a castle shaped like a hand, guarded by
    armour with nobody inside it. Bastian wins, and she offers him advice instead of a fight.
    Atreyu tries to take AURYN from Bastian while he sleeps, for Bastian's own sake, and is
    caught. Bastian sends him away.
18. **The Ivory Tower Falls.** The Empress is gone. Xayide says Bastian should be Emperor.
    Atreyu raises the people against him. In the battle Bastian wounds Atreyu with Sikanda. Falkor
    carries Atreyu off, and the Tower is destroyed. Stay with Atreyu, and press your hands on the
    wound. (No blood shown; Atreyu says it's nothing and is lying.)
19. **The Long Way Back.** In the City of Old Emperors, the monkey Argax shows Bastian the people
    who wished away every memory and can never go home. With the Yskálnari, who have no "I" and
    only "we", Bastian learns he wants to be one among many, and leaves. In Dame Aiuóla's House of
    Change he is fed and loved like a child, until he knows what he wants most: to be able to
    love. In Yor's Minroud, the blind miner's mine of forgotten dreams, he finds a picture of a man
    frozen in ice and gives up his last memory of his father. Only his name is left, then not
    even that.
20. **The Water of Life.** Atreyu and Falkor find him. Bastian lays AURYN at Atreyu's feet, and
    all of you go into it. The Water asks his name, and whether he has finished the stories he
    began. He can't answer. Atreyu says Bastian's name and promises to finish the stories himself.
    Bastian drinks, and goes home with the water for his father. The page ends in Coreander's
    shop, as you watch from behind the bell: Bastian confesses, and the old man says he has never
    owned such a book.

**Consequences:**

- **Tier 3 (in the line):** *The mirror (Q15 → Q16, Q18, Q19, Q20).*
  - (a) The truth: at Amarganth (Q16) Bastian laughs about the attic and tells Atreyu about it.
    After the battle (Q18) he can't remember the attic, and asks you what it was like.
  - (b) "You look like yourself": Bastian can't answer Atreyu's questions in Q16 and is cross
    with you for not helping. In Q19, before the mine, he asks you what he looked like, and you
    can tell him then; it's late, but it counts.
  - (c) The notebook page: in Q19 you read it to him in the City of Old Emperors. He can't
    believe it was him, and gives it back: "Keep it, then."
  - **Endings (Q20):** on (a), Bastian runs into the shop past you and almost sees you. On (b),
    he walks home slowly, saying his own name under his breath. On (c), the notebook page is
    gone from your pocket. In the shop, Bastian unfolds it from his, reads your handwriting, and
    puts it away carefully.
- **Tier 2 (the Grove):** the Attic Nook. The cottage loft gains an old blanket, a two-colour
  reading lamp (red light one side, green the other) and a stack of books. Nubbins climb up and
  sit with you when you read. On the (c) path, a torn notebook page is pinned to the beam.
- **Reads:** `s6Done`.
  - *With `s6Done`:* in Q13, the Empress, who knows every creature's name, looks at your Nubbin
    and then at you. "You know about names. A girl whistled one back to someone, in a kitchen,
    with one lamp lit." In Q20, when Bastian can't say his name, your Nubbin whistles low, high
    and a little one, very softly, like a question. Atreyu looks at it, and then says Bastian's
    name. (Atreyu still says it; your Nubbin only asks.) After the page, Ember has a new line if
    you visit: "Names. Everyone thinks they're words."
  - *Without `s6Done`:* in Q13 the Empress simply knows your Nubbin's name and says it. Q20 plays
    as the book does.
- **Hazel's margin note** (`s24Done`): "Never went. Read it twice. You lose a bit of yourself
  with every wish. I'd have printed that on the cover."

**Lifted text** (copyrighted: Ende's estate and Thienemann, and Ralph Manheim's 1983 English
translation is also in copyright. At most three one-sentence lines. Use the German, with our own
English):

1. AURYN's inscription, « TU WAS DU WILLST » (Q15). Ours: "Do what you wish."
2. The book's refrain, « Aber das ist eine andere Geschichte und soll ein andermal erzählt
   werden. » Ours: "But that is another story, and shall be told another time." (Coreander, Q20,
   and once in Q16 when the knight Hynreck's tale starts to wander.)

Only two lines are used. The Empress's new name is "Moon Child" (German *Mondenkind*). Uyulala's
rhymes, Gmork's speech and the Water's questions are all original. No passage is reproduced.

**Rewards:** the Attic Nook (Tier 2, above); a pearl-scale luckdragon cape for your Nubbin; a
grain-of-sand keepsake in a glass vial, which glows faintly at night; the notebook page (on the
(c) path).

**Learning Grove version:** yes, for the reader band only, Part One only (ending at Moon Child).
A child learns how a book can be printed in two colours to tell two stories; that turtles can
live a very long time; how sphinxes appear in Egyptian and Greek stories; a few German words
(*Buch*, *Mond*, *Kind*); and that a name can be a gift.

**Care notes:**

- **Rated All, with care.** Artax's death (Q5) is one quiet scene, never repeated: he stops, and
  the swamp closes. Gmork's death is offscreen; we see Atreyu's face. Atreyu's wound (Q18) shows
  no blood. Ygramul's sting is a jolt of light, not a bite. Add an optional parent note before Q5.
- **Bastian's body.** Ende describes him as fat, and he wishes himself handsome. Never make the
  round boy a joke. His first look is drawn with affection, and the line's choice treats that boy
  as worth liking.
- **Atreyu's people.** Ende's Greenskins live on the Grassy Sea and hunt. Avoid every Plains
  Indian stereotype: no feather headdresses, war paint or "noble savage" talk. Design them fresh
  with an adviser, from what the book actually says.
- **The Nothing.** It frightens small children. It is shown as missing pieces of the picture, not
  as a monster, and the music drops out near it. No jump scares.
- **No game mechanic of wishing.** The player never makes a wish with AURYN. AURYN's design and
  the book's cover art belong to the estate and publisher; license them or draw an original
  two-snake emblem.

## A26. The Wall of Uruk (*The Epic of Gilgamesh*, Mesopotamia, now Iraq; the Atlas)

**Why it works:** the oldest great story we have is about a king who finds a friend, loses him,
and can't bear it. He walks to the end of the world to find a way not to die. He's offered a
plant that makes an old man young, and a snake takes it while he bathes. So he goes home, and
shows the boatman the wall of his city: look at the bricks. That's the Grove's fourth theme:
we are made of being remembered. And Moss, who has outlived every friend he had, comes with you.

**When and where:** the page opens once Nova's atlas is in the Grove. It shows a great brick
wall in the sun, date palms and a river. You and your Nubbin step in. Moss comes too, riding on
your shoulder, once he has come down in chapter 4 and as long as he hasn't faded. (Before
chapter 4, or after the Moss Sleeps ending, your Nubbin takes his beats and sits where he would
have sat.) This is the Standard Babylonian epic, with the Old Babylonian tablets where they
fill gaps; it is not any later novel or film.

**Your role:** a stranger in Uruk who becomes the friends' water-carrier. Gilgamesh and Enkidu
keep their story. You fetch water, keep watch while they dream, and sit with Enkidu at the end.
Your Nubbin runs with the gazelles in the first act and has to be coaxed back to people, just
like Enkidu.

**The quests:**

1. **The Wall.** Walk the wall of Uruk with a guide. Find the copper tablet box at its
   foundation and read the lapis tablet: this is the story of a king who saw everything. You
   step into it.
2. **The King Who Never Rests.** Gilgamesh, two parts god and one part man, gives his city no
   rest: endless games and building, and no one may go home. The people cry to the gods. The
   goddess Aruru pinches off clay and makes Enkidu, and sets him down in the wild.
3. **The Wild Man.** Enkidu, hairy as a beast, grazes with the gazelles and drinks with them at
   the water hole. Your Nubbin drinks with them too. A trapper finds his pits filled in and his
   snares torn up, and runs home frightened.
4. **Shamhat.** The trapper fetches Shamhat, a woman of the temple of Ishtar, from Uruk. She
   sits at the water hole with Enkidu for days, until he understands her speech. When he goes
   back to the gazelles, they run from him. Coax your Nubbin back from the herd too.
5. **Bread and Ale.** At the shepherds' camp Enkidu is shown bread and ale. He doesn't know what
   they are. He eats until he's full, drinks seven jugs, and sings. He washes, oils his hair,
   puts on clothes, and guards the shepherds' flocks at night against wolves and lions.
6. **Ninsun's Dreams.** In Uruk, Gilgamesh dreams of a star falling from heaven, too heavy to
   lift, and of an axe he loves. His mother, the wise goddess Ninsun, tells him a friend is
   coming. You carry the cups.
7. **The Door.** Enkidu comes to Uruk and blocks Gilgamesh's way at a door. They wrestle in the
   street until the doorposts shake and the wall trembles. Gilgamesh's knee touches the ground.
   They stop, and laugh, and are friends. Ninsun takes Enkidu as a son.
8. **The Cedar Forest.** Gilgamesh wants to make a name by killing Humbaba, the guardian the god
   Enlil set over the Cedar Forest. Enkidu knew the forest when he was wild and is afraid. The
   elders warn them. Ninsun prays to the sun god Shamash for her son. They forge axes, and you
   pack the bread.
9. **Dreams on the Mountain.** Each night on the road Gilgamesh dreams terrible dreams, and each
   morning Enkidu tells him they're good ones. You keep the fire and the watch.
10. **Humbaba.** They cut the first cedar, and Humbaba roars. Shamash sends great winds that pin
    him. Humbaba begs for his life and offers them his forest. Gilgamesh wavers. Enkidu says
    finish it. **Choice:** speak for Humbaba, say nothing, or agree with Enkidu. Gilgamesh kills
    him anyway (offscreen: the wind drops, and the forest goes quiet). Pays off in quests 13, 14
    and 18. They cut the tallest cedar for a temple door and float it down the Euphrates.
11. **Ishtar.** Gilgamesh washes his hair and puts on his crown. The goddess Ishtar asks him to
    marry her. He refuses, and lists what became of everyone she loved before. Furious, she goes
    to her father Anu for the Bull of Heaven.
12. **The Bull of Heaven.** The Bull snorts and the ground opens. The friends bring it down
    together. Enkidu shouts at Ishtar from the wall. (Softened: no wound, no thrown thigh.) That
    night they ride through Uruk and the people cheer.
13. **The Gods' Council.** Enkidu dreams that the gods have met: for Humbaba and the Bull, one of
    the two must die, and it will be Enkidu. Awake, he curses the cedar door, the trapper and
    Shamhat. Shamash reminds him who gave him bread and clothes and a friend, and he blesses
    Shamhat instead.
14. **Twelve Days.** Enkidu falls ill and lies sick for twelve days. You sit with him, and so does
    Gilgamesh. He dies. Gilgamesh covers his friend's face like a bride's, paces like a lioness
    who has lost her cubs, and has a statue made of gold and lapis. (Gentle and grave. The body's
    decay is not shown.)
15. **Lion Skins.** Gilgamesh, afraid of death now, dresses in lion skins and walks to the
    mountains of Mashu. The scorpion-people at the gate let him through. Twelve double-hours of
    dark, then a garden where the trees bear jewels. You walk the dark holding his belt.
16. **Siduri.** By the sea, the ale-wife Siduri bars her door, then talks to him: the life he's
    looking for he won't find; fill your belly, be merry, love the child who holds your hand. He
    won't listen. The boatman Ur-Shanabi will take him across, but Gilgamesh has smashed the
    Stone Things that crewed the boat in his grief, so he must cut punting poles instead. Help
    cut them.
17. **Uta-Napishtim.** Across the Waters of Death lives the one man the gods let live forever.
    He tells of the flood: the boat, the animals, the birds sent out. He sets a test: stay awake
    six days and seven nights. Gilgamesh sleeps at once; Uta-Napishtim's wife bakes a loaf each
    day so he can't deny it. He is washed and given new clothes. As a parting gift he's told of a
    plant at the bottom of the sea. He ties stones to his feet and fetches it. On the way home,
    while he bathes in a pool, a snake smells the plant, takes it, and sheds its skin as it goes.
    He sits down and weeps.
18. **The Wall of Uruk.** Home. Gilgamesh tells Ur-Shanabi to walk the wall: look at the base, the
    bricks, whether they're kiln-fired; the city, the orchards and the clay-pits. You walk it
    with them, back where you started.

**Consequences:**
- **Tier 3 (in the line):** *Humbaba (Q10 → Q13, Q14, Q18).*
  - **Spoke for him:** in Q13 Enkidu, waking from the dream, says, "You said to let him go. You
    were the only one." In Q14 he asks you to plant a cedar seed for Humbaba's forest. In Q18 a
    cedar sapling stands at the foot of Uruk's wall, and Gilgamesh says he should have listened.
  - **Silent:** in Q13 Enkidu says nothing to you, and holds your hand. In Q14 he asks you to look
    after the gazelles. In Q18 a gazelle grazes below the wall.
  - **Agreed with Enkidu:** in Q13 he says, "We did it together. We'll carry it together." In
    Q14 he asks you to remember him to the shepherds. In Q18 Gilgamesh looks at you a long time
    and says, "We both learned it late."
  - **Endings:** the wall is the same on every path. What grows or grazes at its foot changes,
    and so does Moss's last line (below).
- **Tier 2 (the Grove):** a kiln-fired brick laid by Moss's flat stone, with your handprint and
  your Nubbin's pawprint pressed in. (If Moss has faded, it lies by his flower.) A cedar tablet
  box for the cottage shelf.
- **Moss's lines** (if he came): in Q3, watching Enkidu with the gazelles, "Nothing wrong with
  him. He just hasn't met anyone yet." In Q14 he says nothing at all, which is his kindest
  thing. In Q16 he agrees with Siduri. In Q18: "He went to the end of the world so as not to
  die, and came home and pointed at a wall. That's the right answer. He just took the long way."
  On the "spoke for him" path he adds, "And somebody let a tree live. That's the other answer."
- **Reads:**
  - The ending id and the chapter, for whether Moss comes (above).
  - `s24Done`: Hazel's margin note beside the snake. "Lost the plant. Kept the wall. Good trade.
    H."

**Lifted text** (R. Campbell Thompson's verse translation, *The Epic of Gilgamish*, 1928, from the
sacred-texts copy. See the copyright note below. On screen, "Gilgamish" is Gilgamesh and "Erech"
is Uruk):
1. "E’en with gazelles did he pasture on herbage, along with the cattle / Drank he his fill, with
   the beasts did his heart delight at the water." (Tablet I, Enkidu, Q3.)
2. "Of Erech, the high-wall’d," (Tablet I, the prologue, Q1, a fragment.)
3. "O Enkidu, (he was) my comrade," (Tablet X, Gilgamesh remembering, Q14; drop the
   brackets on screen.)
4. "Gilgamish, why runnest thou, (inasmuch as) the life which thou seekest, / Thou canst not
   find?" (Tablet X, Siduri, Q16; drop the bracketed words on screen.)
5. "Cherish the little one holding thy hand; be thy spouse in thy bosom" (Tablet X, Siduri,
   Q16.)
6. "Shall we for ever build house(s), for ever set signet (to contract)," (Tablet X, Q17.)
7. "'Greybeard-who-turneth-to-man-in-his-prime' is its name" (Tablet XI, the plant, Q17, a
   fragment.)
8. "Do thou, Ur-Shanabi, go up and walk on the ramparts of Erech, / Look on its base, and take
   heed of its bricks, if its bricks be not kiln-burnt," (Tablet XI, Q18.)

**Copyright note:** Thompson died in 1941, so his 1928 translation is public domain in the UK
and the EU (life plus 70 years), and in the US, where works published in 1928 entered the public
domain on 1 January 2024. It may still be in copyright in countries with longer terms, such as
Mexico (life plus 100 years, so until the end of 2041). The sacred-texts page still calls it
"formally" in US copyright, which is out of date. Get a legal check. If needed, swap the lifted
lines for Jastrow and Clay's *An Old Babylonian Version of the Gilgamesh Epic* (1920, Project
Gutenberg #11000; both translators died by 1925) for the early tablets, or for our own words.

**Rewards:** the handprint brick; the cedar tablet box; a lion-skin cloak for your Nubbin (plain
fur, no head); a little reed boat for the pond.

**Learning Grove version:** yes, softened, without lifted text, and with Shamhat's scenes cut to
"a woman from the city taught him to talk". A child learns where Mesopotamia was, between the
Tigris and the Euphrates; how cuneiform was pressed into wet clay with a reed; the difference
between sun-dried and kiln-fired bricks; that the flood tablet was read again in 1872 after
thousands of years; and how friends remember each other.

**Care notes:**
- **Iraq's heritage.** Gilgamesh belongs to Iraq and to everyone. No war imagery and no modern
  politics. Tablets in the story are never "treasure" to take: say that many were looted in
  living memory and some have been returned. Commission an Iraqi adviser and an Assyriologist.
- **Sex.** Shamhat's seven days with Enkidu, Gilgamesh's claim on brides, and Ishtar's lovers
  are cut or kept to one plain line. Shamhat is a teacher and is treated with respect.
- **The flood.** Tell Uta-Napishtim's story as his own, with no claims about which flood story
  came first.
- **Softened for All, and we say so:** Humbaba's death and the Bull of Heaven are offscreen;
  Enkidu's death is gentle and grave, like Fossil's; the worm at his nose is cut. If Maor wants
  the fights played straight, rate the page `teen` instead.

## A27. The White-Haired Prince (Zal and the Simurgh, Ferdowsi's *Shahnameh*, Iran; the Atlas)

**Why it works:** a great champion's son is born beautiful, with hair as white as an old man's,
and his father is ashamed and has the baby left on a mountain. A great bird carries him to her
nest to feed her young, and her heart turns over; she raises him with them instead. Years later
the father dreams he's been shamed for it, and goes to the mountain to beg. The bird gives the
boy a feather to burn on the day he needs her. The grey can be loved; it always could. And when
Zal's own son is born, he burns the feather.

**When and where:** the page opens once Nova's atlas is in the Grove. It shows a high mountain
above clouds, a vast nest of branches, and far below, a green city in the east. You and your
Nubbin step in. This is Ferdowsi's *Shahnameh*, finished around 1010, the national epic of the
Persian-speaking world.

**Your role:** a foundling yourself. The Simurgh finds you and your Nubbin on the mountain in a
storm and carries you up to her nest with everyone else. Zal is the hero; you're his nestmate
and, later, his messenger. Your Nubbin is raised among the Simurgh's chicks and comes home with
very large ideas about how much it can eat.

**The quests:**

1. **A Son for Sam.** Sam, the champion of Sistan, has longed for a child. A son is born, perfect
   in face and limb, with hair as white as an old man's. The women are afraid to tell Sam for
   eight days. You are a guest in his house.
2. **Shame.** Sam fears his enemies will laugh at him, and orders the baby taken away and left on
   Mount Alborz. You follow the servants up the mountain path in a rising storm.
3. **The Simurgh.** A great bird comes down out of the cloud and takes the baby, and then you, to
   her nest. Her chicks crowd in to eat the new thing. Her heart turns; she tells them he is
   their brother. You and your Nubbin are squeezed in among the chicks.
4. **The Nest.** Raising the baby among the chicks: keeping him warm, helping the Simurgh feed
   everyone, and stopping the chicks from sitting on him. Feed them before you feed yourself, in
   a nest the size of a cottage.
5. **The Youth on the Mountain.** Years pass. Zal grows tall and strong and learns speech from the
   Simurgh, though he has never seen a person but you. Caravans see a young man on the peak, and
   the story travels down to Sistan.
6. **Sam's Dream.** Sam dreams of a rider on an Arab horse who rebukes him for casting out his
   son. When he wakes, his wise men, the mobeds, tell him he has wronged a child God gave him,
   and that he must find the boy and ask forgiveness.
7. **The Foot of the Mountain.** Sam comes with his army and can't climb. He prays, humbly. From
   the nest you see him first: a man with white in his own beard.
8. **The Feather.** The Simurgh tells Zal his father has come and he must go down to his people.
   He weeps; he has never been among people. She gives him a feather from her breast: burn it on
   the day you need me. **Choice:** tell Zal his father came back and he should go; sit with him
   and say nothing until he's ready; or ask the Simurgh to make Sam wait one more night. Zal goes
   down on every path. Pays off in quests 9, 14 and 17.
9. **Father and Son.** Sam bows to the Simurgh, sees his son, and swears never to harden his
   heart against him again. He names him Zal, and dresses him in fine clothes. Drums and
   trumpets all the way home to Sistan. You ride on the baggage.
10. **The Shah's Court.** The Shah, Manuchehr, welcomes them. The court's star-readers say Zal
    will be brave and wise. Sam goes to war and leaves Zal to rule, and he rules well. Help him
    learn the court's ways, which neither of you knows.
11. **Kabul.** Zal visits Kabul. Its king, Mehrab, comes from the line of the cruel old king
    Zahhak; Zal feasts with him but won't eat under his roof. At home Mehrab praises Zal to his
    queen Sindokht and their daughter Rudaba, white hair and all. Rudaba falls in love with a
    man she has never seen.
12. **The Rose Garden.** Rudaba's maids gather roses by the river, across from Zal's tents. Zal
    shoots a water-bird and sends his page for it; the maids and the page trade boasts about their
    masters. Carry the messages back and forth.
13. **The Rope of Hair.** At dusk Rudaba stands on the roof and lets down her long black hair for
    Zal to climb. He kisses it and won't: it would hurt her. He throws up his lasso instead. They
    talk all night, and each swears to marry no one else. You keep watch below.
14. **Letters.** Zal writes to his father: you left me on a mountain; this is the one thing I ask.
    Sam is troubled (a bird's nursling and Zahhak's line), and has the stars read. A son will be
    born to them, a hero like no other. Then Sindokht finds her daughter's secret, and the Shah,
    hearing of it, is angry. Sindokht goes to Sam herself with gifts and wins his promise to spare
    Kabul.
15. **The Riddles.** At the Shah's court the mobeds set Zal riddles about time, the sun and moon,
    and the turning year, and he answers every one. Then he outshoots and outrides the Shah's
    champions. The Shah gives his blessing.
16. **The Wedding.** Seven days of celebration in Kabul. Sam meets Rudaba and likes her. Zal sets
    a golden crown on her head.
17. **The Feather in the Fire.** Rudaba's labour is long and hard, and she can't rest. Zal
    remembers the feather and puts it on the fire. The sky darkens with wings. The Simurgh asks
    why the eyes of this lion are wet with tears, and tells him what to do. The baby is born
    safely, big and strong. Rudaba names him Rostam, "delivered", because she is delivered of
    her pains. A silk doll of the baby is sent to Sam, who is overjoyed.

**Consequences:**
- **Tier 3 (in the line):** *The feather (Q8 → Q9, Q14, Q17).*
  - **"He came back":** Zal goes down at once. In Q9 he runs the last bit. In Q14 his letter says,
    "You came back for me. Come with me now." In Q17 he burns the feather himself, without
    hesitating.
  - **Sit with him:** you sit at the nest's edge until he stands up by himself. In Q9 he walks
    down slowly and his father waits. In Q14 the letter says, "I learned to wait on a mountain.
    I can wait for you." In Q17 he holds the feather a long moment and hands it to you to put on
    the fire. (The third rule, landing.)
  - **One more night:** the Simurgh agrees, and Zal sleeps his last night in the nest. In Q9 Sam
    has prayed all night at the foot of the mountain and his voice is gone. In Q14 the letter
    says, "I made you wait one night. You made me wait many. Let's call it even." In Q17 the
    Simurgh says, "You were right to give him the night."
  - **Endings:** Rostam is born on every path. What changes is who puts the feather on the fire,
    and the last image: Zal with the baby, Sam with the silk doll, or the Simurgh circling.
- **Tier 2 (the Grove):** one Simurgh feather in a glass on the cottage mantel. It is never
  burned and does nothing; it's for looking at. A great nest of woven branches in the big tree by
  the pond, where your Nubbins can sleep if they like.
- **Reads:**
  - Sable's trust stage: if Sable is bonded, when you close the page she is asleep under the
    feather on the mantel. If she isn't, the feather is on the floor by the long grass, and she
    is watching it.
  - `corvinGate` = family: in Q7 the man with white in his beard at the foot of the mountain
    makes you think of someone at a stuck gate. One line, no change.
  - `s24Done`: Hazel's margin note beside the nest. "White hair at birth. I'd have kept him. H."

**Lifted text** (Helen Zimmern's 1883 prose retelling, *The Epic of Kings*, from the MIT Internet
Classics Archive copy. Zimmern died in 1934, so it is public domain everywhere. Zimmern spells
the names Saum, Rudabeh, Minuchihr, Mihrab, Zohak and Rustem; on screen use Sam, Rudaba,
Manuchehr, Mehrab, Zahhak and Rostam, as the Persian adviser prefers):
1. "Then it came to pass that a son was born unto him, beautiful of face and limb, who had
   neither fault nor blemish save that his hair was like unto that of an aged man." (Q1.)
2. "But when she had brought him her heart was stirred within her for compassion." (The
   Simurgh, Q3.)
3. "When the youth had heard her words his eyes were filled with tears and his heart with
   sorrow, for he had never gazed upon men, though he had learned their speech." (Q8.)
4. "bear with thee this feather from her breast. And in the day of thy need cast it into the
   fire, and I will come like unto a cloud and deliver thee from danger." (The Simurgh, Q8.)
5. "never again will I harden my heart towards thee" (Sam, Q9, a fragment.)
6. "Not so, O fair one, it would beseem me ill to do thee hurt." (Zal, Q13.)
7. "A clear spring shall issue into the day, a son shall be born to Zal, a hero full of power
   and glory, and there shall not be his like in Iran." (The star-readers, Q14.)
8. "O my son, wherefore art thou troubled, and why are the eyes of this lion wet with tears?"
   (The Simurgh, Q17.)

Warner and Warner's verse translation (vol. 1, 1905) covers the same scenes in more detail, but
its text couldn't be opened from here to check, and Edmond Warner's death year couldn't be
confirmed, so its UK status is unknown. It is public domain in the US.

**Rewards:** the Simurgh feather in its glass; the great nest; Zal's lasso, coiled on a peg; a
rose-garden bed by the river; a tiny white-crested cap for your Nubbin.

**Learning Grove version:** yes. A child learns where Iran is, and that the *Shahnameh* is loved
across Iran, Afghanistan and Tajikistan and wherever Persian is spoken; that Ferdowsi took about
thirty years to write it; how the Simurgh looks in Persian art; that some people are born with
very pale hair and skin (albinism), and it's just how they are; and about writing a letter to
say something hard.

**Care notes:**
- **Persian heritage.** The *Shahnameh* is a living treasure. People still recite it, name their
  children from it and learn it at school. Use the Persian names, correctly pronounced, and art
  drawn from Persian manuscript painting with an Iranian adviser and an Afghan adviser (Kabul and
  Sistan are on both sides of today's border). No modern politics, no "exotic" styling, and no
  harem scenes; the women's house is simply the family's rooms. Rudaba's maids are maids.
- **Faith.** Sam's prayer and the mobeds are part of the story; keep them brief and respectful.
- **Albinism.** Zal's white hair is never a curse or a magic sign on this page. People with
  albinism still face real stigma, and in some places violence, so Sam's shame is clearly
  wrong, and Zal is the most capable person in the story. Ask an albinism organisation to check
  the script.
- **Softened for All:** Mehrab's threat against his daughter and the Shah's order to burn Kabul
  are one line each. Rostam's birth follows Zimmern, who leaves out Ferdowsi's surgery: the
  Simurgh gives counsel, and the baby is born safely. Rated All.

## PA3. The Hollow Kingdom (*Hollow Knight*, Pixel's Arcade)

**Why it works:** *Hollow Knight* (Team Cherry, Adelaide, Australia; 24 February 2017) is a
kingdom of bugs that went still. To stop a plague of light that spoke in dreams, its king made
children of void, chose one to hold the plague inside, and sealed it in an egg so the kingdom
could stay as it was. It didn't work, and the kingdom slept anyway. That is the Heartstone in
another key: "she made them safe by making them still". Under the sorrow are the game's small
mercies: forty-odd grubs crying in glass jars, waiting for someone to open them.

**How you get there and who comes with you:** a cartridge with a pale horned mask on the label.
You and your Nubbin come out on a cold road at dusk, at Dirtmouth, a near-empty town above a
well. Pixel talks through the speaker. If `s21Done`, Clank sits on the cabinet and goes very
quiet at the word "vessel".

**Your role:** a traveller, never the Knight. The Knight is a small, silent, horned wanderer who
fights with a nail; you never fight. You carry a lantern, open grub jars, carry the Delicate
Flower, and sit on benches with whoever needs it. Your Nubbin finds grubs by their crying and
is the first thing in Hallownest to make the Knight tilt its head.

**The quests:**

1. **The Cabinet.** Pixel says the cartridge was in a box marked "too sad, keep". You step
   through to Dirtmouth: rain, a bench, and Elderbug, an old bug who is very pleased to see
   anyone. The Knight walks past him and drops down the well. You follow.
2. **The Crossroads.** The Forgotten Crossroads are full of husks, bugs who still walk their
   old routes with orange light in their eyes. The Knight clears the way. You find the first
   glass jar with a grub inside it, crying. Open it. It hugs the Knight, then burrows home.
3. **The Grubfather.** Follow the crying to a cavern of empty egg-shaped houses, where an
   enormous grub sobs for his children. He has forty-six. The cartridge has twelve to find along
   your road (set places, found once, never again). Promise him.
4. **Greenpath.** Moss, light and acid water. A thin figure in red with a needle stands on a
   ledge: Hornet, the kingdom's protector. She warns the Knight off and attacks. **The choice:**
   step back and keep your hands where she can see them, or stand beside the Knight and hold
   your ground. This pays off in quests 11, 15 and 18.
5. **Quirrel.** A cheerful bug with a mask and a nail who can't remember why he came. He's
   sitting on a bench by the Lake of Unn, looking at the water. Sit with him. If you do, he
   tells you he feels he's seen this kingdom before. (This matters in quest 16.)
6. **The Mantis Lords.** The Mantis Village guards the way into Deepnest. Three sisters duel the
   Knight one after another, fairly, and bow when they lose. Your Nubbin bows back. The village
   stops attacking and lets you through.
7. **The City of Tears.** A city under a lake, where it has rained for an age. In a square stands
   the memorial to the Hollow Knight. Pixel reads the plaque aloud through the speaker, slowly.
   A grub on a rooftop: your Nubbin hears it first.
8. **The Seer.** In the Resting Grounds, the Knight steps onto the Dreamers' shrine: three
   stone masks, Lurien, Monomon and Herrah. The floor seals and a dream takes you both. The Seer,
   last of the moth tribe, wakes you and gives the Knight the Dream Nail. With it you can hear
   what the husks still dream. They dream of a light, and of going to sleep in it.
9. **The Delicate Flower.** In a grey house reached through the crypts, the Grey Mourner gives
   you a flower for a grave in the Queen's Gardens. One knock and it breaks. The Knight fights;
   you carry it. Take the trams, never the stag or a dream-gate. If it breaks, she gives you
   another, and nothing is lost but time.
10. **The Three Dreamers.** Lurien sleeps in his spire above the city; Monomon in her archive in
    Fog Canyon, behind a mask-ward that Quirrel, once her student, comes to lift; Herrah in her
    den in Deepnest. Each has kept a dream for an age to hold the seal. The Dream Nail lets each
    one wake and go to their rest. Sit with each for a moment before it does.
11. **Herrah's Den.** Hornet is waiting in Deepnest: Herrah was her mother. Quest 4 pays off:
    - **If you stepped back,** Hornet lets you sit near her. She says nothing about grief, and
      you say nothing back. That's the right answer.
    - **If you stood your ground,** she keeps her needle between you and tells you both to go.
12. **The Queen's Gardens.** Deliver the flower to the grave; the Grey Mourner's love is buried
    there. Then the White Lady, bound in roots, gives the Knight half of a charm, the Kingsoul,
    and grieves for what her husband made.
13. **The White Palace.** Through a dream, the king's lost palace: blades, saws and pale
    corridors. The Knight climbs; you stay at the edge and call out the timings with Pixel. At
    the top, the other half of the Kingsoul and a memory of the king choosing his vessel.
14. **The Abyss.** Below the kingdom, a black sea and a dead lighthouse. Shades of the vessels
    the king threw away crowd the Knight: its brothers and sisters. **The choice:** hurry the
    Knight through them to the bottom, or turn the lighthouse back on and wait, so they can see
    it. If you wait, the shades stop pressing in, and the Kingsoul becomes the Void Heart. This
    pays off in quest 18.
15. **Kingdom's Edge.** Ash falls like snow. Hornet tests the Knight one last time before letting
    it take the King's Brand. Quest 4 pays off again: if you stepped back in Greenpath, she
    speaks to you as well, and promises to come when it matters.
16. **Blue Lake.** Quirrel sits on the shore where the city's rain begins. He has seen the world
    twice now and is glad of it. If you sat with him in quest 5, the scene is longer and he asks
    you to tell someone he was here. Then he is gone, and his nail is planted in the sand.
17. **The Grubs Go Home.** Back to the Grubfather with the twelfth grub. Rest on the bench, and
    when you return he's lying on his back, very round and very happy. He's swallowed them all.
    They're fine; it's how grubs become grubberflies. Pixel laughs till she has to sit down.
18. **The Black Egg.** In the temple, the Hollow Knight hangs in chains, the plague's light
    leaking from a crack. The Knight breaks the chains and they fight. Quests 4, 11, 14 and 15
    decide the ending:
    - **Void Heart, and Hornet trusts you:** Hornet comes and binds the Hollow Knight with her
      silk. The Knight dream-nails its sibling and goes into its dream, where the Radiance burns.
      The void rises behind the Knight like a tide, and the Radiance goes out. The two siblings
      go home together into the dark they came from. The egg is gone, and Hornet stands alone
      with her needle, in the first quiet for an age.
    - **Void Heart, but Hornet doesn't trust you:** she still comes, late, because she promised
      herself, not you. The same ending, but she doesn't look at you.
    - **No Void Heart:** the Knight wins and takes its sibling's place in the chains. The egg
      seals. The plague is held again, the old way: safe, and still. Pixel says, very quietly,
      "There's a save from before the Abyss," and the cartridge lets you go back.

**Consequences:**

- **Tier 3 (in the line):**
  - Quest 4 (Hornet) pays off in quests 11, 15 and 18.
  - Quest 14 (the Abyss) pays off four quests later, in quest 18.
  - Quest 5 (sitting with Quirrel) lengthens quest 16.
  - Three endings, one of them the sealed one, which can be replayed from the Abyss.
- **Tier 2 (the Grove):** none beyond cosmetics. High-score plate for High Score Night.
- **Tier 1:** none.
- **Reads:** `s21Done` only (Clank on the cabinet). The plan names no other flags.

**Lifted text** (*Hollow Knight* is © Team Cherry; at most three one-sentence lines, and all
other dialogue is new. A commercial build needs Team Cherry's licence):

1. Hornet, in quest 4: "Come no closer, ghost."
2. The memorial plaque, in quest 7: "Through its sacrifice Hallownest lasts eternal."
3. The king, in the memory in quest 13: "No cost too great."

All three are from the 2017 English script as given on the Hollow Knight wiki; check them
against the game before use. No music or song is used.

**Rewards:** a pale horned mask for your Nubbin (cosmetic); an empty grub jar lantern
(decoration; the grub went home); the Delicate Flower in a pot, which never wilts (decoration);
Quirrel's nail on the cottage wall (decoration); the high-score plate.

**Learning Grove version:** no, because of the licence. If it's ever licensed: how real grubs
become beetles (metamorphosis), what moths do at night, and why caves stay the same temperature
all year.

**Care notes:**

- **The Dreamers.** In the game the Knight kills them in their dreams. Here they wake and go to
  their rest, gently, like a warden fading. Herrah is Hornet's mother: keep Hornet's grief short
  and private, and never comic.
- **Combat.** The Knight fights husks and beasts. Show the husks as victims of the plague: they
  fall and lie quiet, and the orange light leaves them. No gore, no splats.
- **The siblings' ending** is a homecoming into the dark, not a death on screen. The sealed
  ending is sad but replayable, and nobody is left forgotten: the plaque stays.
- *Hollow Knight: Silksong* (2025) is Hornet's own game. It's out of scope here; use nothing
  from it.
- All ages, with care. The game's own ratings sit around ten-plus; our softening keeps it all.

## PA4. Mercy (*Undertale*, Pixel's Arcade)

**Why it works:** *Undertale* (Toby Fox, USA; 15 September 2015) is a game where you never have
to hurt anyone. You talk, pet, joke, flirt and run away, and every "monster" turns out to be a
neighbour. Its best friend is a flower who says the world is "kill or be killed", and the game
spends its whole length proving him wrong. That is Wisp, and that is pity: spare the wretched
one, and he may turn the ending. In this cartridge, sparing everyone is the only road. The
route where you kill everyone is not in the cartridge at all.

**How you get there and who comes with you:** a cartridge with a red heart on its label. You and
your Nubbin fall through the dark onto a bed of golden flowers, beside a child in a striped
jumper. Pixel talks through the speaker. If `s21Done`, Clank sits on the cabinet. This
cartridge reads `wisp` (see quest 1 and the Reads).

**Your role:** you fell too, and you're the child's company, never the child. The child is the
game's hero, silent, and only learns their own name at the end. When a fight starts, you and
your Nubbin stand in the box with the child's red heart, and the only buttons you get are ACT
and MERCY. Your Nubbin is a monster as far as the Underground is concerned, and very popular.

**The quests:**

1. **The Cabinet.** Pixel blows the dust off. Wisp reads in:
   - **If `wisp` is spared or sable,** there's a dry hiss from the vent under the cabinet. Wisp
     has come in out of the cold to watch the warm screen.
   - **If driven or unset,** the vent is quiet.
2. **The Flower.** A smiling flower says he's Flowey and offers you "friendliness pellets". They
   aren't. He grins a different grin. A fireball knocks him away, and a tall, kind goat-woman,
   Toriel, takes the child's hand. **The choice:** your Nubbin leans after the flower. Leave him
   one of the Monster Candies from the bowl in the next room, on the spot where he was, or leave
   him be. This pays off in quests 17 and 18.
3. **The Ruins.** Toriel teaches puzzles and holds the child's hand across the spikes. A training
   dummy: talk to it instead of hitting it. That's the whole lesson. A ghost, Napstablook, lies
   across the path pretending to be asleep by saying "z" out loud. Cheer them up. Your Nubbin
   lies down on the floor next to them, which helps.
4. **Toriel's House.** Pie (butterscotch and cinnamon), a little bed, a book of snail facts read
   aloud. The child asks how to get home. Toriel goes downstairs, very calm, to destroy the way
   out.
5. **The Door.** She stands in front of the exit and fights, to prove the child is too weak to
   survive. You never fight back. Spare, and spare, and spare, until she understands. She hugs
   the child, tells them not to come back, and goes. Your Nubbin looks back the whole corridor.
6. **Snowdin Forest.** A short skeleton in slippers, Sans, with a whoopee cushion. His tall
   brother, Papyrus, wants to capture a human and join the Royal Guard, and has built puzzles
   for it. He stops his deadliest trap himself, because it's too dangerous. Pet the guard dogs.
   One dog's neck grows the more you pet it. Keep petting.
7. **Papyrus.** He fights the child to capture them, very badly. Spare him. He decides you're
   friends, and asks the child on a date, which is spaghetti at his house and a lot of nervous
   flexing. Your Nubbin is seated as a guest of honour.
8. **Waterfall.** Blue grass, falling water, and echo flowers that repeat the last thing anyone
   said near them, even years ago. A room where monsters made wishes on stones in the ceiling,
   because they couldn't see the stars. Let your Nubbin whisper into one. A young monster with
   no arms (Monster Kid) follows you everywhere.
9. **Undyne.** The captain of the Royal Guard hunts you through Waterfall. Monster Kid slips off
   a bridge, and Undyne pulls him back. He tells her to leave you alone. You run all the way to
   Hotland, where she collapses in her armour from the heat. Fill a cup from the water cooler
   and pour it on her. She stomps off, very confused.
10. **The Cooking Lesson.** Papyrus brings you to Undyne's house to make friends. She teaches you
    to make spaghetti by fighting the vegetables and setting the stove too hot. The house burns
    down. Everyone is fine, and she decides you're friends now. You leave with her phone number.
11. **Hotland.** Alphys, the royal scientist, is shy and talks too fast. She built Mettaton, a
    robot who hosts a game show, and he keeps trying to make you lose on air. Hotland's lifts,
    lasers and cooking shows are all one long performance. Play along.
12. **Mettaton.** The final show, in the Core. Spare him by giving the audience what they want.
    His cousin Napstablook calls in to say how much the show means to them. Mettaton stays.
13. **New Home.** A grey town where monsters tell, a line each, the story of a prince, Asriel,
    and the first human who fell: how the child got ill and died, and how Asriel carried them to
    the surface and was hurt by frightened humans, and came home to fade in the castle garden.
    In a long golden corridor, Sans tells the child they have hurt nobody, and that it counts.
14. **The King.** Asgore makes tea first. He's sorry. Then he breaks the MERCY button in two and
    fights. You won't. Pixel's voice: "No. Not like this." She loads the save from before the
    corridor. (In the game you first see a darker ending, then go back. Here we skip it.)
15. **The Letter.** Back through the Underground, Undyne gives you a letter for Alphys. Alphys
    reads it at the rubbish dump, a "date", and confesses that she's been hiding something.
16. **The True Lab.** Under her lab, the monsters who "fell down" and should have faded: Alphys
    gave them determination, and they woke melted together. She kept them hidden because she
    couldn't face their families. You can't fight them; you comfort them, one by one: pet, play,
    sit still. When Alphys finally tells the truth, their families come and take them home.
    Alphys learns what the shard teaches in the Grove: keeping them hidden wasn't keeping them.
17. **Everyone.** At Asgore's barrier, Toriel arrives and stands between them. Then Sans, Papyrus,
    Undyne and Alphys, all shouting over each other. Flowey traps them all in vines, takes the
    six human souls and every monster's soul, and becomes a tall, terrible child: Asriel. Quest
    2 pays off: if you left the candy, he says he found a candy once, and didn't know what to
    feel about it.
18. **Asriel.** He can't be fought. The child reaches into the dark and calls each friend's
    memory back, and you call your Nubbin's name until they hear. Asriel shrinks back into a
    crying boy. He says sorry, breaks the barrier, and stays behind, because as a flower he'll
    forget how to care again. If you left the candy, he asks you to give your Nubbin one for
    him. Wisp reads in (see the Reads).
19. **The Surface.** Everyone walks out of the mountain into the sunrise. Toriel asks the child to
    come and live with her. The child says yes, and tells everyone their name: Frisk.

**Consequences:**

- **Tier 3 (in the line):**
  - Quest 2's candy pays off fifteen and sixteen quests later, in quests 17 and 18.
  - Each friend you made (Napstablook in quest 3, Papyrus in 7, Undyne in 10, Mettaton in 12)
    adds their own line to quest 17's crowd and quest 19's sunrise. All of them are needed for
    the true path, so in this cartridge they always happen; the lines vary with what you said.
  - The ending varies in its last frame: with the candy, a golden flower in the Ruins turns its
    head towards the light as you pass; without, it doesn't move.
- **Tier 2 (the Grove):** none beyond cosmetics. High-score plate for High Score Night.
- **Tier 1:** none.
- **Reads:**
  - `wisp`: the vent in quest 1. At quest 18, if spared or sable, Wisp whispers from the vent
    in both his voices: "spared… warm", and after the cartridge ends he's found asleep on top of
    the cabinet, where it's warm. If driven, Pixel says, "We didn't, with ours," and switches
    the cabinet off for a minute. If unset, nothing.
  - `s21Done`: Clank on the cabinet.

**Lifted text** (*Undertale* is © Toby Fox; at most three one-sentence lines, and all other
dialogue is new. A commercial build needs Toby Fox's licence):

1. Flowey, in quest 2: "In this world, it's kill or be killed." Asriel's whole arc answers it.
2. Papyrus's laugh, "NYEH HEH HEH!", in quests 6 and 7. It's a laugh, not a line, but count it
   anyway.

No music is used. Undertale's soundtrack is the soul of the game, and none of it comes in, not
even as a hum.

**Rewards:** a striped jumper for your Nubbin (cosmetic); a golden-flower pot by the cottage door
(decoration); a burnt saucepan from the cooking lesson (decoration); a MERCY button that does
nothing when pressed, mended with tape (decoration); the high-score plate.

**Learning Grove version:** no, because of the licence. If it's ever licensed: kind words when
someone is angry, how echoes work, and what a volcano's heat does (Hotland).

**Care notes:**

- **The route where you kill everyone is not offered,** in any form. There is no FIGHT button.
- **The neutral ending is skipped.** Flowey killing Asgore is never shown; Pixel loads the save
  instead (quest 14). Say so in the credits notes.
- **The first child and Asriel** both die in the backstory (quest 13). Tell it as the monsters
  tell it: sad, short, no detail of the illness.
- **The True Lab** is eerie in the game. Keep it dim, not frightening: no jump scares, and the
  melted monsters are always shown as lost and gentle.
- **Asriel's god form** is spectacle and noise, never gore. Flowey's faces stay cartoon.
- **Dating.** Papyrus's and Alphys's "dates" are friendship played for laughs; keep them that way.
- All ages, with care. The game's own ratings are about ten-plus; the cuts above keep it all.

## A28. The Box of Stories (Anansi tales; Akan, Ghana, and the Caribbean; the Atlas)

**Why it works:** once, all the stories belonged to the Sky-god, and Kwaku Ananse, the spider,
bought them, paying a price no king could pay: a python, the hornets, a leopard and a fairy, all
caught with nothing but his wits. Since then they have been *Anansesem*, spider stories, whether
there is a spider in them or not. The tales crossed the Atlantic with Akan people who were
enslaved, and Anansi, the small one who outwits the strong, kept them company. That is Wisp's
kind of story: a thief who wants everything, who is somehow loved for it. Wisp and Anansi trade,
badly.

**When and where:** the page opens once Nova's atlas is in the Grove. It shows a courtyard at
night in an Asante village, a stool, and a circle of listeners. It moves to the Sky-god's court,
the forest, Ananse's house, and last of all a yard in Jamaica. Your Nubbin comes. If Wisp was
spared, or Sable chose (`wisp` = spared or sable), Wisp comes too, riding in your bag next to his
egg stone. He won't leave it at home.

**Your role:** a listener who goes in. You sit in the storyteller's circle and fall into the tale,
where Ananse takes you on as his carrier, because a spider has many legs but nowhere to put a
python. Ananse is the hero, in his way. Your Nubbin keeps getting stuck to things.

**The quests:**

1. **We Don't Really Mean It.** Evening in the village. An old woman takes the storyteller's
   stool and says, before anything else, that what she is about to say isn't really true. The
   children shout back. Sit on the mat with your Nubbin and say the reply with them. The courtyard
   fades, and you're standing beside a spider.
2. **The Sky-god's Stories.** Ananse goes up to Nyame, the Sky-god, and asks to buy his stories.
   Great towns have tried and failed. Nyame names the price: Onini the python, Mmoboro the
   hornets, Osebo the leopard and Mmoatia the fairy. Ananse agrees, and throws in his own old
   mother, Ya Nsia, which tells you everything about Ananse. **With Wisp:** Ananse sees the egg
   stone in Wisp's paws and offers a trade on the spot: the stone for a story, to be paid "once I
   own them". Wisp hisses, and then shakes on it with one paw, keeping the stone in the other. (See
   Q8.)
3. **Onini the Python.** Ananse and his wife Aso argue loudly near the python's tree: is he longer
   than this palm branch, or isn't he? The python, insulted, lies along the branch to prove it,
   and can't quite stretch. Hold the end while Ananse ties him "just to measure him properly".
4. **Mmoboro the Hornets.** Fill a gourd with water. Ananse holds a plantain leaf over his head,
   pours water over the leaf and over the nest, and shouts that it's raining and they should
   shelter in his dry gourd. They pour in. Put the stopper in. Your Nubbin is stung once, on the
   nose, and holds a grudge.
5. **Osebo the Leopard.** Ananse digs a pit on the leopard's path, and Osebo falls in. Ananse
   offers to help him out, and the help is a web he can't get out of. Carry the bundle. (Told the
   way many tellings do: the leopard goes to the Sky-god alive and very cross.)
6. **Mmoatia and the Gum Doll.** Carve a small doll, and Ananse covers it in sticky gum and sets
   a bowl of mashed yam in its lap, under the odum tree. The fairy comes, eats, and thanks the
   doll. The doll doesn't answer. She slaps it with one hand, then the other, and sticks. Ananse
   runs for rope. **Choice:** while he's gone, (a) work one of her hands free (she stays caught by
   the other, so the tale still holds); (b) leave her be; or (c) sit down beside her, say nothing,
   and wait with her until Ananse comes back. This pays off in Q9, Q10 and Q12.
7. **Spider Stories.** At the Sky-god's court the elders gather. Ananse lays the whole price at
   Nyame's feet: python, hornets, leopard, fairy, and his mother. Nyame blesses him and gives him
   the stories, and says that from now on they will be called the spider's.
8. **The Box Opens.** Ananse carries the stories home in a carved box (the box is our image; the
   tale says only that the stories were the Sky-god's). He can't keep from opening it, and they
   fly out across the world. **With Wisp:** Ananse pays his debt with a gourd. Wisp opens it. It
   holds the last hornet. Wisp, in return, pays with Fern's old left glove, which he insists is
   "warm. was warm." Both of them think they've won. **Without Wisp:** Ananse offers your Nubbin a
   story for a buttercup, takes the buttercup, and tells a story so short it's only one word.
9. **The Pot of Wisdom.** Ananse sweeps up all the wisdom in the world and puts it in a gourd pot,
   to hang it at the top of a tree where nobody else can get it. With the pot tied in front, he
   can't climb. His son Ntikuma watches and asks why he didn't tie it on his back. Ananse throws
   the pot down, and wisdom scatters everywhere. Pick up the pieces that land near you.
10. **The Bald Head.** At his mother-in-law's funeral Ananse swears he'll fast. Then he hides
    hot beans under his hat. They burn, and he shakes his head and calls it a hat-shaking dance,
    until the hat comes off. That is why the spider is bald. Help him look dignified. You can't.
11. **Across the Water.** The page turns, and it is night in a Jamaican yard, years later. An
    elder tells "Anancy" stories to children on a step. One sentence from her says how they came
    there: with people who were stolen from the Gold Coast, and who kept the spider because he was
    small and clever and never stayed caught. Listen. She tells the gum-doll story her own way, and
    yours is different. Both are right.
12. **Take Some Elsewhere.** Back in the Asante courtyard, the storyteller ends with the closing
    words: if it was sweet or not, take some away, and let some come back to her. She turns to you.
    It's your turn to tell one back. Your Nubbin climbs on to the stool beside you.

**Consequences:**

- **Tier 3 (in the line):** *The fairy (Q6 → Q9, Q10, Q12).*
  - (a) Her hand worked free: in Q9, when the pot breaks, Mmoatia darts out of the trees and
    catches a piece of wisdom before it hits the ground, and drops it into your Nubbin's paws. In
    Q10 she hides behind Ananse at the funeral and tips his hat off herself, laughing.
  - (b) Left her be: in Q9 the wisdom scatters as Rattray tells it, and none comes your way. In
    Q10 the hat comes off on its own.
  - (c) Sat with her: in Q9, Mmoatia sits beside you under the tree as the pot breaks, and you
    both get rained on with wisdom. In Q10 she says nothing, and puts a cool leaf on Ananse's head
    afterwards.
  - **Endings (Q12):** the story you tell back is about the fairy and the doll, and it changes
    with your choice: a fairy who got a hand back, a fairy who was caught, or a fairy who wasn't
    alone. The storyteller says which kind of story it is ("a clever one", "a true one", "a kind
    one") and keeps a piece of it.
- **Wisp's trade (Q2 → Q8 → Q12):** in Q12, if Wisp came, the storyteller tells the last story
  herself, unasked: a grey thief with a torn ear who kept a stone that had gone cold. Wisp
  listens to the end. As you leave the page, he is carrying it, as he carries the stone: the one
  thing in the whole trade that was worth anything, and Ananse threw it in for nothing.
- **Tier 2 (the Grove):** the story box. A carved box by the cottage hearth. Open it in the
  evening, and your Nubbins gather while one story plays from a page you've finished, retold in
  Nubbin mime. With Wisp's trade done, Wisp sleeps under the step with the stone, the glove and
  one hornet-stung nose's worth of pride, and sometimes drags the box there.
- **Reads:** `wisp`.
  - *Spared or sable:* Wisp comes along (Q2, Q8, Q12). He speaks only as he does in the Grove: a
    few broken words in his two voices. If the stone was unmade by Wisp (`stoneUnmadeBy` = wisp),
    he isn't trembling in the page either.
  - *Driven:* Wisp isn't there. In Q12 the storyteller tells of "a grey one who was sent away,
    and still comes to look at a gate", and asks you how it ends. You can say "I don't know" or
    "He comes back." Neither changes the Grove.
  - *Unset:* your Nubbin makes the trade (Q8).
- **Hazel's margin note** (`s24Done`): "Nova says here they tell you it isn't true before they
  start. Best manners I ever heard of."

**Lifted text** (R. S. Rattray, *Akan-Ashanti Folk-Tales*, Oxford: Clarendon Press, 1930;
Rattray's translation, which he made "as nearly literal as possible". Checked against the
Internet Archive scan. Copyright: Rattray died in 1938, so the book has been out of copyright in
the UK since 2009; as a 1930 publication it entered the US public domain on 1 January 2026. The
illustrations by Gold Coast artists are also 1930, but don't reuse them without a separate check):

1. "We don't really mean to say so; we don't really mean to say so." (The storyteller's opening
   disclaimer, as Rattray's preface reports it. Q1.)
2. "THEY say that Kwaku, the Spider, was there," (The opening of the wisdom tale. Q9, and Q12 as
   the storyteller's start. Set it in normal case on screen.)
3. "Oh, your eyes have surely died (for shame), would it not have been better if you had turned
   round the gourd and put it on your back, then doubtless you would have been able to climb?"
   (Ntikuma, Q9. Drop the bracket on screen.)
4. "Clear out, you and your old-fashioned sayings." (Ananse, Q9.)
5. "and he cast it away, and there was a sound of scattering, tesee !" (Q9, a fragment. On screen,
   "tesee!")
6. "This, my story, which I have related, if it be sweet, (or) if it be not sweet, take some
   elsewhere, and let some come back to me." (The closing formula, Q12.)

The Sky-god's price and blessing (Q2, Q7) are retold, because the tale's full text could not be
checked; see Notes.

**Rewards:** the story box (Tier 2, above); a spider-silk shawl for your Nubbin; a gourd pot
decoration that tips over now and then and "spills" sparkles; a gum-doll-shaped cushion (not
sticky).

**Learning Grove version:** yes, both bands, without lifted text. A child learns where Ghana is,
and where Jamaica is; Akan day names (Kwaku is a boy born on a Wednesday) and their own day name;
how spiders spin silk and why it's sticky; how hornets build nests; and how stories travel when
people tell them, and change a little each time.

**Care notes:**

- **Advisers.** Commission Akan (Ghanaian) advisers for names, the courtyard, the stool, the
  funeral, dress and Twi words, and Jamaican advisers for Q11. Present Anansesem as a living
  tradition, told today, not a museum piece.
- **Nyame** is the Akan Supreme Being, and still revered. In the tale he is a great king who keeps
  his word. He is never mocked, never shown as a fool, and drawn with an adviser's guidance (or
  as a voice and a light).
- **Slavery** appears in one sentence in Q11, said plainly and with dignity by the elder. It is
  never played, shown or turned into a mechanic. No ships, no chains on screen.
- **Speech.** Jamaican speech is written by Jamaican writers or not at all. No imitation dialect
  spelling for comedy.
- **Softened for All:** the leopard and the fairy go to the Sky-god alive. Ya Nsia goes as an
  honoured guest of the court (she is fine; Ananse is still awful for offering). The funeral is
  warm and busy, with no body shown.
- **The gum doll.** It is a carved doll, not a caricature of anyone. Don't use "tar baby"
  anywhere; that name carries a racist history in US usage.
- **Mmoatia** are part of Akan belief, not just this tale. Keep her small, quick and dignified.

## A29. The Honmoon (*KPop Demon Hunters*, Sony Pictures Animation and Netflix, 2025; Korea; the Atlas)

**Why it works:** three pop stars are secretly demon hunters, and their voices hold up the
Honmoon, the barrier that keeps demons out of the world. Their leader, Rumi, is half-demon, and
the marks on her skin are spreading. She has been taught to hide them. The film is about a girl
who thinks she has to be fixed before she can be loved, and finds out she doesn't. That is Sable,
who hides, and the Grove's second theme: the grey stays, and can be loved. A demon who sold his
family for fame, four hundred years ago, finds he can still choose otherwise.

**When and where:** the page opens once Nova's atlas is in the Grove. It shows a stage, a city at
night and a tiger in a hat. Your Nubbin comes. Sable may come too, depending on her trust (see
Reads).

**Your role:** a new runner for Huntrix's manager, Bobby: fetching, carrying, holding the noodles.
Rumi, Mira and Zoey keep their story. Your Nubbin rides in the merchandise bag and makes friends
with Derpy, the clumsy blue tiger, before anyone else does.

**The quests:**

1. **The First Hunters.** A prologue in the style of an old painted scroll. Long ago, demons fed
   on people's souls for their king, Gwi-Ma. Three women sang, and their voices made the Honmoon.
   Every generation since, three hunters keep it, and hope one day to seal it for good: the Golden
   Honmoon.
2. **Huntrix.** A concert. Then, after it, demons, and three idols with weapons: Rumi's sword,
   Mira's long blade and Zoey's throwing knives. Carry the gear case. Your Nubbin hides in a speaker
   and comes out a hero, in its own opinion.
3. **Ramyun.** The three of them eating instant noodles late at night, laughing. Rumi's voice is
   catching. She wears long sleeves in the heat. Fetch more noodles. You notice the sleeves.
4. **Celine.** Rumi visits Celine, the former hunter who raised her. Celine knows about the marks,
   and has always told her to hide them. Rumi wants the Golden Honmoon to make them go away. Wait
   outside; you hear enough.
5. **The Saja Boys.** A new boy band debuts out of nowhere, in black coats and wide-brimmed gat.
   Their leader is Jinu. Fans flock to them, and the Honmoon flickers. Bobby is furious about the
   charts. You notice the crowd's eyes going blank.
6. **The Marks.** Huntrix learn the Saja Boys are demons, and attack. In the fight Jinu sees
   Rumi's marks, and hides them from her friends. Why? **Choice:** afterwards, in the dressing
   room, Rumi's sleeve has slipped and you are the only one who sees. (a) Hand her a jacket and
   say nothing; (b) say "I saw. It's all right."; or (c) look away, and let her decide whether you
   saw. This pays off in Q12, Q14 and Q16.
7. **Derpy and Sussie.** A tiger and a magpie from the demon world carry notes between Jinu and
   Rumi. Derpy is soft, clumsy and purrs like a kettle. Your Nubbin rides on his head. Deliver one
   note yourself. Don't read it. (You can't help reading it.)
8. **The Voices.** Jinu tells Rumi that Gwi-Ma's voices work through shame, and that he was once
   human, four hundred years ago, a poor musician. He tells her a kinder version of the story than
   the true one.
9. **The Harsh Song.** Zoey and Mira write a song to expose the Saja Boys. Rumi doesn't like how
   cruel it is, and the three of them argue. Make tea. Take nobody's side out loud.
10. **The Deal.** Rumi offers Jinu a bargain: help Huntrix win the Idol Awards and seal the
    Honmoon, and he can stay in the world. Talking to him, her voice comes back. He agrees. Then
    Gwi-Ma calls him down and reminds him what he did to his family.
11. **The Idol Awards.** Backstage chaos. Demons lure Mira and Zoey away, and two more take their
    faces. On stage, the impostors force the harsh song, and Rumi's marks are shown to everyone.
    Find the real Mira and Zoey in a store room.
12. **Seen.** Mira and Zoey feel betrayed. Rumi confronts Jinu, and he admits the truth: he left
    his mother and sister for fame. Gwi-Ma comes up into the world through the broken Honmoon, and
    the city goes still, entranced, and walks towards a stadium.
13. **Celine Again.** Rumi goes home. Celine wants to put things back the way they were, marks
    hidden. Rumi tells her she was never loved all the way, and leaves. Celine sits alone. Sit
    down next to her, and wait. (She doesn't thank you. She does pour you tea.)
14. **The Stadium.** The Saja Boys are on stage and the crowd is giving its souls away. Rumi walks
    in with no sleeves, and sings something new, her own, about the marks and the shame. Mira and
    Zoey wake up.
15. **Jinu.** Gwi-Ma strikes at Rumi, and Jinu steps in front of her. He gives her his own soul,
    whole again, and is gone in light. The three of them sing, and the Honmoon comes back, not gold
    but every colour.
16. **In Public.** Days later, Huntrix meet their fans in the street, in daylight. Rumi wears
    short sleeves. Derpy and Sussie are on a wall. Your Nubbin sleeps in the tiger's paws.

**Consequences:**

- **Tier 3 (in the line):** *The sleeve (Q6 → Q12, Q14, Q16).*
  - (a) The jacket: after the awards (Q12), Rumi gives the jacket back: "You helped me hide. I
    asked you to. That's on me." In Q14 she takes off her coat and hands it to you on her way in.
  - (b) "I saw. It's all right": in Q12, she finds you before she finds anyone else. In Q14 she
    looks at you once from the stage.
  - (c) Looked away: in Q12 she asks you outright whether you knew. You can say yes. In Q14 she
    doesn't look for anyone.
  - **Endings (Q16):** with (a) she holds out her arm to show you the marks in the sun, as if for
    the first time; with (b) she pulls you into the group photo; with (c) she waves from across
    the street, and that's enough.
- **Tier 2 (the Grove):** a ribbon of soft, many-coloured light along the Grove fence after dark,
  thin as a thread, which you can switch on and off. A folk-painting screen of a tiger and a
  magpie for the cottage, painted by a Korean artist in the minhwa style. If Sable came, Luna has
  a new line: "She went somewhere loud and bright, and didn't hide? Well. Don't make a fuss of it.
  She'll know."
- **Reads:** Sable's trust stage.
  - *No Sable, or trust 20:* Sable doesn't come.
  - *Trust 45:* Sable comes and hides the whole time: under the stage (Q2), behind the noodle
    pans (Q3), in the store room (Q11). In Q16 she stays in the shade of the wall with Sussie.
  - *Bonded:* Sable walks at your heel. In Q14 she stays by you in the crowd, ears up, and doesn't
    go under anything. In Q16 she lies in the sun in the middle of the pavement, grey and in full
    view, and the fans step round her. She never speaks.
- **Hazel's margin note** (`s24Done`): "Never been. Nova says it's all singing. I'd hum."

**Lifted text:** none. The film is copyrighted, and its heart is its songs, which we never use:
no lyrics, no melodies, and no song titles on screen. All dialogue is original. The Honmoon is
held up in the page by original wordless music written for the game. Rumi's new song in Q14 is
heard as music under her face, not words.

**Rewards:** the light ribbon and the tiger-and-magpie screen (Tier 2, above); a tiny noodle-cup
hat for your Nubbin; a stage-light decoration; a magpie petpet that brings you a "letter" (a
leaf) when you've been away.

**Learning Grove version:** yes, for the reader band only, softened (no soul-eating; the demons
"steal people's cheer"). A child learns where Korea is; that King Sejong's scholars made the
Korean alphabet, hangul, in the fifteenth century so everyone could read; the tiger and magpie in
Korean folk painting, where the magpie brings good news and the tiger is often a bit silly; Seoul
places such as Namsan Tower and the old hanok houses; and that everyone has something they think
they should hide.

**Care notes:**

- **Advisers.** Commission Korean advisers for dress, food, places, words and the folk elements,
  and a Korean artist for the minhwa screen.
- **Jeoseung saja.** The Saja Boys' black coats and gat borrow the image of the jeoseung saja,
  the messengers who guide the dead in Korean belief (also in A3, *Along with the Gods*). Treat
  that image with respect: no jokes about death messengers, and the gat is never a comic hat or a
  Nubbin costume reward.
- **The gat** is a real traditional hat with its own history. Show it correctly, and only on the
  Saja Boys.
- **Folk painting.** The tiger and magpie come from Korean minhwa (the tiger-and-magpie pictures).
  Derpy and Sussie are the film's licensed designs: use them exactly as licensed, or not at all.
  The Grove screen is a new, original painting in the old style.
- **The first hunters** draw on women's song and ritual in Korean shamanism. Show them with
  dignity, not as spooky witches, and don't copy real ritual.
- **Rated All.** The film is PG. Q13 cuts Rumi's darkest request to Celine; she leaves angry,
  nothing more. Jinu's end (Q15) is light and stillness, no wound. The soul-stealing is a glow
  leaving people's faces, and it comes back.

## PA5. The Hundred-Year Sleep (*The Legend of Zelda: Breath of the Wild*, Pixel's Arcade)

**Why it works:** *Breath of the Wild* (Nintendo, Japan; 3 March 2017) begins after the end of the
world. A young man wakes in a cave after a hundred years with no memory. A princess has held a
calamity back on her own all that time, and the four friends who should have helped her died at
their posts. The game's gift is the wide, quiet land in between, and the slow return of what he
forgot. It's about being remembered, and keeping a door shut for someone until they come back.
And it's full of small hidden things that giggle when you find them, which is a Nubbin's idea
of heaven.

**How you get there and who comes with you:** a cartridge with a blue eye on its label. You and
your Nubbin wake on a stone floor in a cave beside a stone bed. Pixel talks through the speaker.
If `s21Done`, Clank sits on the cabinet.

**Your role:** you wake up beside Link and walk the land with him, never as him. Link is the
hero, and he hardly speaks. You carry the photographs, cook at campfires, and hold the horse. Your
Nubbin is the best Korok-finder in Hyrule.

**The quests:**

1. **The Cabinet.** Pixel slots the cartridge in. A voice says "Open your eyes." and you do.
2. **The Shrine of Resurrection.** Link wakes in a pool and takes a slate from a pedestal. You
   and your Nubbin follow him up into the light. At the cliff edge: a whole land, green and
   empty, and a castle wrapped in a slow red-black cloud. Your Nubbin sits down at once.
3. **The Old Man.** On the Great Plateau, an old man at a campfire roasts apples and gives you
   one. Link wakes a tall stone tower, and the shrines across the land light up. The old man will
   trade his paraglider for what's inside four shrines. It's cold on the mountain. **The
   choice:** cook him a spicy pepper dish and eat with him, or leave him to his apples and press
   on. If you eat with him, he talks about a daughter he was too hard on, without saying who.
   This pays off in quest 14.
4. **The King's Ghost.** On the roof of the ruined Temple of Time, the old man shows himself: he's
   the spirit of the last king. A hundred years ago, the Calamity took the kingdom. His
   daughter, Zelda, has held it back alone in the castle ever since, and she's tiring. He gives
   Link the paraglider and fades. Jump.
5. **Kakariko.** Impa, a tiny old Sheikah under a huge hat, tells of the four Champions and the
   four Divine Beasts, machines that were meant to stop the Calamity and turned on their own
   people. Paya, her granddaughter, is too shy to look at Link. Impa gives you twelve photographs
   of places Link went with Zelda. **The choice:** hunt down every memory, or only those that lie
   on your road. This pays off in quests 15 and 18.
6. **Hateno.** Purah, Impa's older sister, runs the ancient-tech lab. An experiment to make her
   young again worked too well, and she looks about six. She mends the slate. Your Nubbin is
   delighted to meet someone its own height.
7. **Hestu.** A huge, worried Korok has lost his maracas. Koroks, little leaf-faced forest
   spirits, hide all over the land and giggle when found. The cartridge has twelve, set in place,
   found once. Your Nubbin finds them by giggling back. Bring Hestu the seeds, and he dances.
8. **Zora's Domain.** It won't stop raining: Vah Ruta, the elephant Beast, is flooding the river.
   Prince Sidon, enormous and cheerful, asks Link for help, though old Muzu blames Link for his
   sister Mipha's death. In a memory, Mipha heals Link's hand and wants to say more. Inside the
   Beast, her spirit is waiting. Freed, she aims Ruta at the castle.
9. **Death Mountain.** Yunobo, Daruk's shy descendant, rolls Link up the mountain while Vah
   Rudania, the salamander Beast, walks the crater. Wear fireproof potion; your Nubbin rides in a
   pot. Daruk's spirit laughs inside the Beast and gives his protection.
10. **Rito Village.** The bird people's warrior, Teba, trains Link at the flight range and flies
    him up to Vah Medoh, the bird Beast. Revali, the proudest Champion, is sharp even as a ghost.
    A wandering Rito bard, Kass, plays his old teacher's tunes on an accordion in the square.
    Listen. (Tunes only; Kass's songs are never sung.)
11. **Gerudo Town.** Riju, the young chief, needs her Thunder Helm back from the Yiga clan's
    hideout, where the thieves are mostly very interested in bananas. Then into Vah Naboris, the
    camel Beast, in the sandstorm. Urbosa, the Gerudo chief a hundred years ago and Zelda's
    fiercest friend, gives Link her fury.
12. **Shelter from the Storm.** A memory on your road: rain, a tree, Zelda and Link sheltering. She
    says she's prayed and trained all her life and the power won't come. Link says nothing. You
    and your Nubbin sit at the edge of the memory under the same rain.
13. **The Lost Woods.** Follow the torch flames through the fog to Korok Forest. The Great Deku Tree
    talks. The sword in the stone has waited a hundred years for Link; he pulls it free once he's
    strong enough. A memory: Zelda leaving the sword here herself, and going back alone.
14. **Father and Daughter.** A memory: the king tells Zelda to stop her research and pray. She is
    seventeen and furious. If you ate with the old man in quest 3, you know he's sorry now, and
    you can tell Link so; Link looks at the castle for a long time. If not, the memory just ends.
15. **The Thirteenth Photograph** or **The Road to the Castle.** Quest 5 pays off:
    - **If you hunted every memory,** Impa shows one more photograph, hung on her wall. On
      Blatchery Plain, a hundred years ago, Link fell protecting Zelda, and she threw herself in
      front of the machine, and her power woke. She sends him to sleep to heal, and goes to hold
      the castle alone. You and your Nubbin watch it all.
    - **If you didn't,** Impa says some memories are still waiting, and lets you go.
16. **Hyrule Castle.** The castle is dark with the Calamity's ooze, and the four Beasts fire their
    beams into it, one after another, each Champion's spirit taking aim. Inside the sanctum,
    Zelda's light holds Calamity Ganon until Link arrives. Then it breaks free.
17. **The Field.** The Calamity flees into a beast the size of the field. Zelda gives Link a bow
    of light. Hold the horse steady while he rides; Pixel cheers through the speaker like a
    football crowd.
18. **A Hundred Years.** Zelda seals the Calamity. The king and the four Champions watch from the
    castle. She asks Link if he truly remembers her. Quest 5 pays off:
    - **If you hunted every memory,** after the credits you see them both in a field in plain
      clothes. Her power is gone, and the Beasts are quiet. She is easy about it, and they ride
      out together to start mending. Your Nubbin trots behind.
    - **If you didn't,** the credits end on the field and the question. Pixel says the cartridge
      will keep the photographs if you want to go back and look.

**Consequences:**

- **Tier 3 (in the line):**
  - Quest 5's memory choice pays off ten and thirteen quests later, in quests 15 and 18. This is
    the game's own design: its full ending needs every memory.
  - Eating with the old man in quest 3 adds a scene to quest 14, eleven quests later.
  - Two endings: the field with the question, or the ride out to mend.
- **Tier 2 (the Grove):** none beyond cosmetics. High-score plate for High Score Night.
- **Tier 1:** none.
- **Reads:** `s21Done` only (Clank on the cabinet). The plan names no other flags.

**Lifted text** (*The Legend of Zelda* is © Nintendo; at most three one-sentence lines, and all
other dialogue is new. A commercial build needs Nintendo's licence):

1. Zelda's voice, in quest 1: "Open your eyes."
2. Zelda, after the credits in quest 18 (only after every memory): "I think I can accept that."

Both are from the English script as quoted in Nintendo's trailers and by Zelda Dungeon; check
against the game. No music is used, and Kass's songs are played as tunes only, never with words.

**Rewards:** a leaf-face Korok mask for your Nubbin (cosmetic); a stone cooking pot with a
campfire (decoration); a paraglider for gliding off the hill (a feature in the Grove's hill
section); the twelve photographs in a frame on the cottage wall, filled in as you found them;
the high-score plate.

**Learning Grove version:** no, because of the licence. If it's ever licensed: why food is warming
(chillies and spices), how gliders and birds stay up, and how photographs help us remember.

**Care notes:**

- **The Champions** died a hundred years ago. They appear only as spirits, warm and even funny,
  never at the moment of death. Mipha and Sidon's grief is gentle.
- **The Calamity** is a cloud and a beast, scary in size but not in gore.
- **Gerudo Town** bars men in the game, and Link gets in in disguise. We leave that bit out
  rather than play it as a joke; you go in with Riju's guard, Buliara.
- **The Yiga clan** are comic thieves. Keep them comic, with no real-world ninja clichés.
- All ages. The game is rated about ten-plus for fantasy violence; our version has no fighting
  on screen beyond Link's own.

## S31. The Great Gourd (*It's the Great Pumpkin, Charlie Brown*, Peanuts, 1966; Grove side story)

**Why it works:** the Peanuts special is about a small boy who believes something nobody else
does, and waits all night for it in a cold field. The one friend who waits with him is cross
about it by morning, and he will wait again next year. It is funny and kind, and it never
mocks him. In the Grove it becomes rule three as a whole story. You sit down next to him and
wait, in the long grass by the post that won't light, in the weeks the frost comes. And Sable,
grey already and the one creature the cold can't hurt any further, may come and sit too.

**When and where:** opens in chapter 7, after `c7-stillness`. Gourd Night, the valley
children's autumn night, falls a few days later. The story closes when chapter 8 opens; if
chapter 8 begins before Gourd Night, it closes unfinished. Places: the Grove wall, Fern's
lopsided gourd patch, Sparks's workshop (the party), the lane cottages, and the long grass by
the dark Long-Grass post, where the frost gathers every dawn in chapters 7 and 8.

**Your role:** the grown-up who stays. Tam is the hero: seven years old, never without his
patchwork quilt, and the only person in the valley who believes in the Great Gourd. Ivy, ten,
is his big sister. Ned, nine, is hapless and kind, and Nettie, six, believes whatever Tam says.
Your Nubbin, in Sparks's old welding goggles and a scarf, has its own wordless night as a
flying ace.

**The quests:**

1. **The Letter.** Tam is on the Grove wall writing to the Great Gourd. Each Gourd Night, he
   explains, the Great Gourd rises out of the most sincere patch in the valley and flies over,
   bringing toys. Help him with the spelling. **The choice** (pays off in quest 14): help him
   ask for toys; for "something for the strays in the Hollow"; or, very politely, that the
   Great Gourd needn't come if busy.
2. **Three Things.** Ivy and Ned laugh at him. Tam draws himself up and delivers his creed (see
   Lifted text). Nettie says she believes him, and Ivy marches her off.
3. **The Biggest One.** Ivy picks the biggest gourd in Fern's patch and makes Tam carry it home.
   Fern apologises for the patch ("I grow them badly on purpose. It's a style."). Then Ivy
   carves it, and Tam is horrified that nobody warned him. Carve one with him, for you: a
   smaller, kinder face.
4. **The Ball.** Ivy offers to hold the ball for Ned to kick, with a signed promise not to pull
   it away. Ned asks you to witness it. She pulls it away anyway. The promise, she explains, was
   witnessed by a biased party.
5. **Two Lists.** Ned has been asked to Sparks's Gourd Night party. Ivy tells him Sparks keeps two
   lists, one of who to ask and one of who not to, and he's surely on the wrong one. Sparks,
   when she hears, is mortified: there's one list and it says "everybody".
6. **The Most Sincere Patch.** Tam chooses his patch: the long grass by the fourth post. The
   others are lit and tidy. "This one isn't pretending." He puts up a sign, WELCOME GREAT
   GOURD. Moss passes. Tam asks him if the Great Gourd is real. Moss: "I have never seen it. I
   have not seen a great many things that are real." Clover arrives with three blankets and will
   not discuss it.
7. **Ghosts.** Gourd Night, dusk. Ivy is a witch: a costume should be the opposite of your
   personality, she says. Ned's sheet has far too many eyeholes; he had some trouble with the
   scissors. Dress your Nubbin in the goggles and scarf.
8. **The Long Grass.** The guisers stop at the long grass to tease Tam, and Nettie stays with
   him. Ivy needs a grown-up for the lane, and Sparks wants you at the party. **The choice**
   (pays off in quests 11 to 14): go guising with Ivy; go to the party; or sit down next to Tam
   and wait. If you sit, you can tell him it's Hazel's third rule. Tam: "That's a rule? Good. I
   like rules."
9. **I Got a Rock.** The guising round, played if you went with Ivy and told by Ned later if
   you didn't. At every door the others get toffee apples, nuts and pennies. Ned gets a rock.
   Byte's has a label: BASALT.
10. **The Flying Ace.** Your Nubbin's night, which plays in every branch. On the cottage roof it
    fights an enemy only it can see, is shot down, and crawls through the hedges "behind the
    lines" to Sparks's party. It hides in the apple-bobbing tub, and Ivy comes up with a lick
    instead of an apple. Pixel's pianola plays old tunes; your Nubbin goes from merry to tragic
    and back, howls once by accident, and slinks out into the dark.
11. **If.** Midnight in the long grass. It's cold, and Nettie starts to doubt. Tam promises to
    put in a good word for everyone if the Great Gourd comes. Then he hears himself say "if",
    and is crushed. With `wisp` spared (or sable), a thin grey shape with a torn ear steals
    Tam's toffee apple and eats it a little way off. Tam whispers, "Is that him?" Nettie:
    "That's a thief."
12. **Something in the Grass.** Before dawn the frost comes in its long tongue towards the post.
    A grey shape rises out of the white grass, and Tam faints clean away. Who it is:
    - **You sat (quest 8) and Sable's trust is 30 or more:** it is Sable. She comes out of the
      frost, looks at the fainted boy, and sits down beside you, ears up, until it's light. She
      says nothing. You don't either.
    - **Otherwise:** it is your Nubbin in its goggles, home from the war. If you went off in
      quest 8, you come back at first light to find Tam flat out and Nettie furious.
13. **Four in the Morning.** Ivy comes with a lantern, grumbling. She carries Tam home, takes his
    boots off and tucks him in, then walks back to her own room. If you sat, she hands you the
    spare blanket on the way past and says nothing nice, which for Ivy is something nice.
14. **Next Year.** At the Grove wall, Ned tries to cheer Tam up by admitting he's done plenty of
    silly things himself. Tam is outraged. The Great Gourd will come next year, and he says so
    for some time. The ending depends on quest 8:
    - **You sat:** Tam asks if you'll wait with him next year. His sign stays by the long grass
      all winter.
    - **You went:** Tam says he doesn't need anyone. Next morning there is a second, smaller sign
      beside the first: SEAT FOR A KEEPER (IF).
    - **Quest 1's letter** leaves its own trace by the sign that morning: one acorn (toys); a
      small heap of fruit that someone has left for the strays (the strays); or nothing at all,
      which Tam takes as proof that he was polite.

**Consequences:**

- **Tier 3 (in the line):** quest 8 (sit, guise or party) decides who is there at dawn (quest 12),
  whether Sable comes, Ivy's blanket (quest 13) and the ending (quest 14), four to six quests
  later. Quest 1's letter leaves its trace thirteen quests later.
- **Tier 2 (the Grove):** the gourd lantern decoration (yours from quest 3). Tam's sign at the
  long grass until spring. Tam, Ivy, Ned and Nettie become valley children with ambient lines.
  After chapter 10's dawn, if the Long-Grass lantern has lit itself, Tam tells anyone who'll
  listen that the Great Gourd did it.
- **Tier 1:** none. S31 sets only `s31Done`. It never changes Sable's trust; it only reads it.
- **Reads:** Sable's trust at the start of Gourd Night (30 or more); `wisp` (quest 11); the
  Long-Grass lantern state (the post-dawn ambient line).

**Lifted text** (copyrighted: at most three one-sentence lines. Checked against the Peanuts
Wiki and the Halloween Specials Wiki; check against the special's licensed soundtrack before
scripting):

1. Tam, in quest 2: "There are three things that I've learned never to discuss with people:
   religion, politics, and the Great Pumpkin." Adapted to "the Great Gourd".
2. Ned, at each door in quest 9: "I got a rock."
3. Tam, about Nettie, in quest 14: "Well, that's nothing compared to the fury of a woman who's
   been cheated out of trick-or-treats!" Adapted to "cheated out of guising".

Everything else is original. Schroeder's songs are not used: Pixel's pianola plays original
tunes. Nobody sings.

**Rewards:** the gourd lantern (a decoration); the flying-ace goggles and scarf (a cosmetic);
Ned's rock, labelled by Byte (a keepsake); Tam's sign (a decoration, after spring).

**Learning Grove version:** yes. How gourds and squashes grow, and why frost ends the season.
Being a good friend to someone who believes something you don't. Waiting, and how long a
night is. Before pumpkins, children in Scotland and Ireland carved turnips into lanterns.

**Care notes:**

- Tam's belief is treated kindly. The story never says he is right or wrong, and nobody "wins"
  by mocking him. The creed's joke about religion and politics stays as the special has it.
- A child out at night: he is never alone, the grown-ups know, there are blankets, and Ivy
  fetches him. The frost is cold, not dangerous, for people.
- Nubbins stay out of the frosty grass, except Sable, who is grey already. Your Nubbin rises at
  the edge, where the frost hasn't reached.
- Your Nubbin's flying-ace war is pure play: no named enemy, no real war.
- All ages.

## A30. The Word on the Brow (the Golem of Prague; Czech lands; Jewish legend; the Atlas)

**Why it works:** in the Jewish Town of Prague, the legend says, Rabbi Judah Loew made a man of
river clay to protect his people, and woke him with a word. The golem fetched, carried, guarded
and never spoke. Every Friday the rabbi laid him to rest for the Sabbath, until the Friday he
forgot, and the protector became the danger. In one telling the word is *emet*, truth, on the
brow; rub out the first letter and it reads *met*, dead. That is Cinder exactly: a protector who
loved them, grown too strong to be safe. And it is the Grove's fifth theme told in clay: safe is
not the same as well.

**When and where:** the page opens once Nova's atlas is in the Grove. It shows a steep-roofed
synagogue and a lane of small houses by a river. The legend is set in the late 1500s. You come
with your Nubbin, and lodge with the synagogue caretaker's family.

**Your role:** a lodger and a willing pair of hands. The rabbi, his helpers and the Jewish Town
keep their story. Your Nubbin follows the golem everywhere, a step behind, like a duckling.

**The quests:**

1. **The Jewish Town.** Arrive in the narrow lanes. The caretaker's family takes you in. Carry
   water, learn where things are, and hear the town talk: about the great rabbi, and about the
   fear outside the walls. Your Nubbin likes the bakery.
2. **The Rabbi.** Rabbi Judah Loew, a famous scholar, teaches in the study house. Listen at the
   back. He tells his students an old story from the Talmud: a sage once made a man, and sent him
   to another sage, who spoke to him, and the man did not answer. "Then return to your dust." He
   asks the students what a person is, if not that.
3. **Fear.** A rumour, a lie told about the Jewish Town, and men gathering at night. Nothing
   happens, this time. The rabbi doesn't sleep. (The lie is never named or shown; see Care
   notes.)
4. **The Answer.** The rabbi asks how to protect his people, and in the night an answer comes in
   a dream. He tells two helpers to be ready. He doesn't tell you anything. You're asked to keep a
   lantern lit, and not to follow.
5. **Clay from the River.** You follow anyway, at a distance. By the Vltava at night, the rabbi
   and his helpers shape a man from river clay, as long as a door. Your Nubbin carries water in its
   cheeks to wet the clay. You don't hear what they say, and the game never tells you.
6. **The Word.** The rabbi writes three letters on the clay brow: א, מ, ת. *Emet*, truth. The
   clay warms. A man opens his eyes, sits up, and waits to be told what to do. They call him Josef,
   Yossele.
7. **Yossele's Work.** He fetches water, chops wood and sweeps, and can't speak. He does exactly
   what he is told, and only that: asked to fill a barrel, he fills it and keeps filling, until the
   kitchen floods. **Choice:** the rabbi lets you give Yossele one standing order, for when no one
   else has told him anything. (a) "Keep everyone safe." (b) "Help where you're asked." (c) "Sit
   with the little ones." (He means your Nubbin and the caretaker's children.) This pays off in
   Q9, Q10 and Q13.
8. **The Night Guard.** At night Yossele walks the lanes. When the men come back, he is standing
   at the end of the street, and they go home. He doesn't have to do anything else. The town
   sleeps better. Walk the round with him once; your Nubbin falls asleep on his shoulder.
9. **Fridays.** Every Friday afternoon, before the Sabbath, the rabbi lays Yossele down to rest:
   he rubs out the first letter, א, and the brow reads מת, *met*. The clay is only clay. After the
   Sabbath the rabbi writes it again. Help lay him down, gently. Your order shows here: a
   "safe" Yossele has started blocking doors with his arm when children run out.
10. **The Forgotten Friday.** One Friday the rabbi is called away and forgets. The Sabbath is
    coming in. In the synagogue they begin Psalm 92, the psalm for the Sabbath day. Outside,
    Yossele grows restless, then strong, then too strong. Run for the rabbi. He comes out, reaches
    up, and rubs out the letter. The clay falls.
11. **Twice.** The congregation goes back in, and the psalm is begun again from the start. You
    hear it twice. They still do, the legend says, in that synagogue. (The words are not sung on
    screen; see Care notes.)
12. **The Attic.** The clay is carried up into the synagogue's attic and laid among the worn-out
    pages kept there. The rabbi forbids anyone to go up. The steps are taken away. Your Nubbin sits
    at the foot of the wall for a long time.
13. **What the Rabbi Says.** The next week. The rabbi sits with you and talks about his clay man,
    and about what it costs to make something that only obeys. Then you go home through the page,
    with a small clay tile that the caretaker's daughter pressed for you.

**Consequences:**

- **Tier 3 (in the line):** *The standing order (Q7 → Q9, Q10, Q13).*
  - (a) "Keep everyone safe": in Q9 he has started keeping children indoors with one arm across
    the door. In Q10 his restlessness is holding: he shuts the whole lane in, and won't let anyone
    out, gently and completely. In Q13 the rabbi says, in his own words, that a guard who keeps
    everyone in is a wall, and a wall is not a home. Your tile reads אמת.
  - (b) "Help where you're asked": in Q10 he does every chore at once, uncalled for, faster and
    faster, and breaks things helping. In Q13 the rabbi laughs a little, sadly: "He was a very good
    servant. That was the trouble." Your tile reads אמת.
  - (c) "Sit with the little ones": in Q9 he is found sitting by the step with three children and
    your Nubbin asleep in his lap. In Q10 he is just as wild, and just as strong, but he puts your
    Nubbin down carefully on a step before he goes. In Q13 the rabbi says that was the only thing
    in him he hadn't put there. Your tile reads אמת, with a tiny pawprint beside it.
  - **Ending:** the last image in the page is the attic window at dusk, and changes with the
    order: a barred shutter (a), a broom left leaning on the wall (b), or a child's small clay bird
    on the sill (c).
- **Tier 2 (the Grove):** the clay tile goes on the cottage hearth, beside Hazel's old clay
  tablets (the ones about the Heartstone). Moss stops beside it the first time. If `cinder` is
  set, he says: "She'd have liked him. That's the trouble with her." Otherwise: "Truth, and then
  one letter less. That's how close it always is." The Price of Power festival bookmark.
- **Reads:** `cinder` (forgiven or remembered), and `keptStone`.
  - *`cinder` set:* in Q10 your Nubbin carries Cinder's ember in its lantern (S19's reward), and
    the ember flares when Yossele grows, then settles when he falls. Moss's Grove line, above.
  - *`keptStone`:* in Q13 the rabbi asks what's in your pocket. You can tell him, or not. He says
    only that some things are made to protect, and then have to be put somewhere high, and that
    there's no shame in carrying them up the steps.
- **Link to the Hebrew questline:** the letters on the brow are drawn exactly as in Ori's
  alef-bet (LH2): alef, the silent letter that holds a vowel; mem; tav, the last letter. In the
  main game the rabbi explains them. The Learning Grove version is led by Ori (below).
- **Hazel's margin note** (`s24Done`): "Clay, a word, and a man who forgot one Friday. I'd have
  forgotten every Friday."

**Lifted text** (public domain: "Golem", *The Jewish Encyclopedia*, vol. 6, Funk and Wagnalls,
New York, 1904, by Ludwig Blau, Joseph Jacobs and Judah David Eisenstein, checked against
JewishEncyclopedia.com; and the Jewish Publication Society's 1917 translation of the Psalms,
checked against Bible Hub's copy. Both are US works out of copyright in the US, and in the UK by
the shorter-term rule; confirm with legal):

1. "The Shem was written on a piece of paper and inserted either in the mouth or in the forehead
   of the golem." (The rabbi, Q6, as a fact about older tellings. Adapted: "Some say the word goes
   in the mouth, some say on the brow.")
2. "Once the rabbi forgot to extract the Shem, and feared that the golem would desecrate the
   Sabbath." (The narration, Q10.)
3. "Finally he extracted the Shem from the forehead of his golem, which returned to dust." (Of an
   older golem, in Chełm; the rabbi in Q13.)
4. "its remains are said to be still among the débris in the attic of the synagogue." (Q12, a
   fragment.)
5. "Thine eyes did see mine unformed substance" (Psalm 139:16, JPS 1917, a fragment. The Hebrew
   word here is *golmi*, the only place "golem" appears in the Bible. The rabbi, Q2.)

The Talmud story in Q2 is retold in our words with the advisers, from Sanhedrin 65b; no modern
translation is quoted. Psalm 92 is named, not sung or printed.

**Rewards:** the clay tile (Tier 2, above); a small clay-bird decoration; a caretaker's apron for
you; a "night round" lantern your Nubbin carries on its own walk at dusk; the Price of Power
bookmark.

**Learning Grove version:** yes, both bands, led by Ori from the Hebrew questline. The golem is
gentle and helpful, the rampage becomes a mess of over-helping, and the clay simply "goes to
sleep" in the attic. A child learns three Hebrew letters (alef, mem, tav) and that Hebrew is
written right to left; the word אֱמֶת, *emet*, "truth" (reader band also learns that taking away
the silent alef makes a different word, מֵת, *met*); that the letters of *emet* are the first,
middle and last of the alef-bet, as the rabbis noticed; Prague and its river on a map; and the
Sabbath as a day of rest. If the child has done LH2, Ori says "You know alef. The quiet one goes
first." Both new words need adding to the vetted list and recording by a native speaker.

**Care notes:**

- **Jewish advisers** (a rabbi and Jewish educators, and ideally the Jewish Museum in Prague)
  read the script before it is final, and the Hebrew and Prague details.
- **The Name.** The Divine Name is never written, spoken, shown or hinted at. The creation in Q5
  is seen from far off and heard as nothing. There is no ritual for the player to perform, no
  "spell", and no Kabbalah presented as a game mechanic.
- **Emet.** Prague tellings usually put a paper with the Name in the golem's mouth; the *emet* on
  the brow belongs to older tellings (Chełm) and many modern ones. We use *emet* and say so in
  Q6, with the advisers' agreement.
- **Rabbi Loew** (the Maharal, about 1520 to 1609) was a real and great scholar and teacher. The
  golem was attached to him by later storytellers (the 1800s), and the page calls it a legend.
  He is shown wise, warm and human, never a wizard.
- **The Sabbath.** The player does no work in the Sabbath scenes: Q10's running is to fetch the
  rabbi, which is what the town does in the legend. The psalm is heard as a murmur, not words.
- **Persecution.** The threat is real in the legend, and we keep it outside the walls and
  unnamed. No blood libel, no Christian neighbours shown as a mob of villains, no violence on
  screen. The golem is enough to make them go home.
- **The attic** is a genizah, where worn-out holy books are kept. Show it with respect: no
  horror, no jump scares, no "cursed attic".
- **Rated All.** No one is hurt in Q10 in our telling; things break.

## Q86–Q95. The Hodja's Donkey (Nasreddin Hodja tales; Turkey, Iran and Central Asia; fun pack)

**Why it works:** Nasreddin Hodja is the wise fool told from the Balkans to China: a teacher on a
donkey whose jokes are lessons, and whose lessons are jokes. His best tales are tiny and
perfect, a setup and one line. They suit the Grove because they are about how people treat each
other: who gets fed at a feast, who believes whom, and how to answer a greedy neighbour without
being unkind. He also hopes, cheerfully and against all sense, which is very Grove.

**When and where:** an afternoon after chapter 3: a man rides up the lane sitting backwards on a
grey donkey, with children trailing behind. He says he comes from Akşehir, and also from Bukhara,
and from wherever you like. He settles under the big tree by the pond and teaches anyone who sits
down. Q87 needs the Harvest Supper (autumn) and Q90 a full moon; the others any day. Nothing
triggers during chapters 9–11, and nothing repeats. Each quest needs the one before it.

**Your role:** his host, his neighbour, and now and then his straight man. The Hodja makes the
point; you set it up or tidy up after. Your Nubbin adores the donkey and rides on it whenever it
can. The donkey brays at exactly the wrong moments and never says a word.

**The quests:**

1. **Riding Backwards.** *Trigger:* the first afternoon you pass the pond after chapter 3. The Hodja
   comes up the lane facing his donkey's tail, with valley children walking behind. Byte points
   out that he's on backwards. The Hodja says he isn't; the donkey is. Then the real reason: he
   is a teacher, and a teacher shouldn't turn his back on his pupils. Help him down, and give the
   donkey water and a place under the tree.
   *Quote:* "It is not my fault … but the horse's, for the horse is left-handed." (Borrow's
   version, as he climbs down; the backwards-for-his-pupils reason is told in our own words.)
   *Learning Grove line:* Hodja: "If I ride forwards, I can't see my pupils. So I ride backwards."
   *Reward:* backwards riding: your Keeper can sit facing the tail on any rideable. Feature.
2. **Eat, My Coat, Eat!** *Trigger:* the Harvest Supper (autumn), after Q86. The Hodja comes straight
   from digging, in his old patched coat. Nobody offers him a seat or a bowl. *Choice:* give him your
   own seat and bowl; fetch him a cleaner coat from your cottage; or watch what he does. He slips
   out, comes back in a magnificent fur coat, and is led to the top of the table at once. Then he
   dips his sleeve into the soup and offers the coat his bread, since it was the coat that was
   invited. This pays off in Q91 and Q95.
   *Quote:* "Eat, my coat, eat!" (our rendering of the Turkish "Ye kürküm ye") · Borrow, 1884:
   "Welcome, my pelisse, please to eat, my lord."
   *Learning Grove line:* Hodja: "Eat up, coat! Everyone was so pleased to see you."
   *Reward:* a patched digging coat for your Keeper. Cosmetic.
3. **Whom Do You Believe?** *Trigger:* after Q87, on a day when you have a heavy load of fruit to
   carry. Ask to borrow the donkey. The Hodja says, very sorrowfully, that it's out today. From
   behind the tree, the donkey brays. The Hodja is offended that you'd believe a donkey over a
   grey-bearded man. Then he laughs and lends it to you anyway, since you asked nicely.
   *Quote:* "You believe the ass, but will not believe a grey-bearded man like me." (Kept as
   Borrow wrote it; the line calls the donkey an ass, which is the word Borrow uses.)
   *Learning Grove line:* Hodja: "Who will you believe? Me, or a donkey?" (The donkey: "Hee-haw.")
   *Reward:* donkey rides: the donkey carries one extra basket of fruit for you. Feature.
4. **The Pot That Gave Birth.** *Trigger:* after Q88. The Hodja borrows Byte's big jam pan for the
   children's soup. He brings it back with a little milk pan inside and says the big pan had a
   baby. Byte, who does not believe this for a second, keeps both. A week later the Hodja borrows
   the big pan again and doesn't bring it back: it has died. Byte is outraged. "Pans can't die!"
   The Hodja asks why he believed one could give birth. Byte goes very quiet, and then laughs.
   *Quote:* "the cauldron has borne a child" · "the cauldron is dead." · "as you believed it could
   bear a child, why should you not believe that it can die?"
   *Learning Grove line:* Byte: "A pan can't have a baby." Hodja: "You kept the baby, though."
   *Reward:* the little milk pan, as a decoration. Cosmetic. (The big pan comes back in Q94.)
5. **The Moon in the Well.** *Trigger:* a full-moon night after Q89. The Hodja goes to the old well
   behind the Workshop for water and sees the moon down there. He decides it has fallen in. Lower
   a rope and hook with him. The hook catches a stone, the rope snaps, and the Hodja lands flat on
   his back, looking straight up at the moon in the sky. He's delighted: it was hard work, but the
   moon is back. Your Nubbin lies down beside him to look too.
   *Quote:* "The moon has fallen into the well, I must pull it out." · "I have suffered much pain,
   but the moon has got to its place again."
   *Learning Grove line:* Hodja: "Look! I got it out. It's all the way back up in the sky."
   *Reward:* a well-bucket decoration where the moon shows on full-moon nights. Cosmetic.
6. **The Smell of Soup.** *Trigger:* a market day after Q90. A new soup stall at the lane's end.
   A poor traveller eats his dry bread beside it, and the stall-keeper demands payment for the
   smell. They bring it to the Hodja to judge. He takes a purse, jingles it by the stall-keeper's
   ear, and declares the debt paid: the sound of money for the smell of soup. *Payoff of Q87:* if
   you gave the Hodja your seat at the Supper, he asks you to sit beside him as the second judge.
   *Quote:* none fixed; the tale's punchline is told in our own words (the traditional judgement:
   the sound of the coins pays for the smell of the soup).
   *Learning Grove line:* Hodja: "You sold him a smell. He pays you with a sound. Fair is fair."
   *Reward:* a soup-pot stall decoration. Cosmetic.
7. **Do You Know What I'll Say?** *Trigger:* after Q91. The Keepers ask the Hodja to give a talk at
   the schoolhouse. He asks if they know what he's going to say. "No." Then there's no point, and
   he goes home. Next week they all say "Yes." Then they don't need him. The third week, half say
   yes and half say no. Then those who know can tell those who don't, and he goes for a nap. Help
   Sparks, who organised it, keep a straight face.
   *Quote:* "do ye not know what I am going to say to you?" (Borrow; set at the schoolhouse, not a
   mosque.)
   *Learning Grove line:* Hodja: "Half of you know? Wonderful. Teach the other half. I'll nap."
   *Reward:* a schoolhouse bell decoration. Cosmetic.
8. **Counting the Donkeys.** *Trigger:* after Q92. The Hodja has bought seven donkeys at market
   to carry the valley's apples, and rides home on one, counting the others. Six! He gets down to
   look for the lost one and counts again: seven. He gets back on: six. He decides riding costs a
   donkey and walking gains one, so he'll walk. You count with him, and work out which donkey
   is missing every time.
   *Quote:* none fixed; the tale is told in our own words.
   *Learning Grove line:* Hodja: "One, two, three, four, five, six. Six! Where has one gone?"
   *Reward:* a donkey-train decoration of six (and a half) wooden toy donkeys. Cosmetic.
9. **What If It Takes?** *Trigger:* after Q93. The Hodja is at the edge of the pond with Byte's big
   jam pan full of yoghurt, spooning it into the water. He's going to turn the pond into yoghurt.
   Everyone tells him a pond can't set. He knows. But what if it does? Byte gets the pan back, very
   clean. Your Nubbin helps by sitting very still and watching the water for a long time.
   *Quote:* none fixed; the punchline is the traditional "What if it takes?" (Turkish "Ya tutarsa?"),
   in our own wording.
   *Learning Grove line:* Hodja: "I know it won't work. But just imagine if it did!"
   *Reward:* a "What If" emote: your Keeper crosses their fingers and looks hopeful. Cosmetic.
10. **You Are Right, Too.** *Trigger:* after Q94. Sparks and Pixel bring the Hodja a quarrel about
    whose turn it is at the dojo. He hears Sparks and says she is right. He hears Pixel and says
    she is right. You protest that they can't both be right. He tells you that you are right, too.
    They laugh, and share the turn. Then he announces he's staying: the tree is comfortable and the
    children haven't learned anything yet. *Payoff of Q87:* if you gave him your seat, he gives
    you his fur coat ("It has eaten enough"); if you fetched him a coat, he gives it back,
    mended; if you watched, he gives you one fur button and says the rest is still eating.
    *Quote:* none fixed; the tale is told in our own words.
    *Learning Grove line:* Hodja: "You're right. And you're right. And so are you. Who wants tea?"
    *Reward:* the Hodja's fur coat, a mended coat, or a fur button (by Q87). Cosmetic.

**Consequences:**

- **Tier 3 (in the line):** how you treat the Hodja in his old coat (Q87) changes Q91 (you judge
  beside him or watch) and, eight quests later, his parting gift in Q95. Byte's pan travels the
  line: lent in Q89, "dead", and returned spotless from the pond in Q94.
- **Tier 2 (the Grove):** the Hodja becomes a resident under the big tree by the pond, with his
  donkey. He has idle lines and a few one-liners for the valley children; nothing repeats as a
  task. Byte gains a line about pans.
- **Tier 1:** none. The pack never sets or needs a flag.
- **Reads:** none.

**Lifted text** (the tales are traditional. Verbatim lines come from George Borrow's translation,
*The Turkish Jester; or, The Pleasantries of Cogia Nasr Eddin Effendi*, Ipswich, 1884, Project
Gutenberg #16244, public domain. Borrow writes "Cogia"; the game says "the Hodja". Recheck
punctuation against #16244 when scripting):

1. "It is not my fault," said he, "but the horse's, for the horse is left-handed." (Q86)
2. "Welcome, my pelisse, please to eat, my lord." (Q87; the game's own line is "Eat, my coat,
   eat!", a common rendering of the Turkish "Ye kürküm ye", not Borrow's wording.)
3. "You believe the ass, but will not believe a grey-bearded man like me." (Q88)
4. "the cauldron has borne a child" · "the cauldron is dead." · "as you believed it could bear a
   child, why should you not believe that it can die?" (Q89; Borrow's pot is a cauldron; ours is
   Byte's jam pan in the scene, with the quote kept.)
5. "The moon has fallen into the well, I must pull it out." · "I have suffered much pain, but the
   moon has got to its place again." (Q90)
6. "O believers, do ye not know what I am going to say to you?" (Q92; Borrow's opening; the game
   uses only "do ye not know what I am going to say to you?", said at the schoolhouse.)

Riding backwards for his pupils, the eight (here seven) donkeys, the smell of soup, the yoghurt
lake and "you are right, too" are not in Borrow; they are told in our own words.

**Rewards:** backwards riding, the digging coat, donkey rides, the milk pan, the well bucket, the
soup stall, the schoolhouse bell, the toy donkey train, the "What If" emote, and a coat or button.

**Learning Grove version:** yes, with original lines.
- Counting, and counting yourself: the donkey you're sitting on still counts.
- Reflections: why the moon seems to be in the well, and in the pond.
- Fairness: judging a quarrel, and what a fair payment is.
- Kindness to guests: why the coat got the soup, and what that says about the people at the table.
- How yoghurt is made: a little live yoghurt turns warm milk into more (and why a cold pond won't).

**Care notes:**
- The Hodja is loved across a huge region: Turkey (Nasreddin Hoca), Iran and Azerbaijan (Molla
  Nasreddin), Uzbekistan and the Uyghurs (Afandi), and the Arab world's Juha. Don't make him
  belong to one country; he says so himself in Q86. Work with Turkish, Iranian and Central Asian
  advisers.
- He is a Muslim teacher. Never make faith the joke. Q92's tale is a sermon in Borrow; the game
  moves it to the schoolhouse. No mosque, prayer or Qur'an jokes.
- Draw him as Turkish pictures do (beard, robe, the big round turban), with no fez gags and no
  "bazaar" caricature.
- Gentle tales only. Left out: the tales about his wives, the crude and toilet jokes, the slap and
  quilt-fight tales, and any tale where the donkey dies.
- The donkey is never hit, overloaded or mocked for being a donkey.

## LK1–LK10. Mouse-Deer (Sang Kancil tales; Malaysia and Indonesia; Learning Grove line)

**Why it works:** Sang Kancil, the mouse-deer, is the smallest animal in the forest and the
cleverest, and children in Malaysia, Indonesia, Singapore and Brunei grow up on his tricks. Being
small and quick-thinking is a gift to a child, and his most famous story is a counting lesson:
he lines up the crocodiles to count them, and crosses the river on their backs. The later tales
teach the other half: Kancil boasts and loses to the snails, and judges fairly between the
buffalo and the crocodile. Here the tales are told with shadow puppets by the pond, and the Grove
acts them out.

**When and where:** at summer's end, after chapter 6, two old friends arrive with a shadow
screen and a box of puppets: Mak Cik Siti, from Melaka in Malaysia, and Bu Wulan, from Yogyakarta
in Indonesia, whose puppets are in the style of *wayang kancil*, the Javanese mouse-deer shadow
theatre. They set up by the pond each evening. One tale per quest, in order. Learning Grove only;
pauses for chapters 9–11; never repeats.

**Your role:** the stagehand and the audience. Siti and Wulan tell the tales and voice every
animal (so no animal speaks in the Grove: the puppets do). Your Nubbin plays Kancil behind the
screen: small, quick and silent, with the storytellers speaking for him.

**The quests:**

1. **The Shadow Screen.** Dusk by the pond. A lamp, a white screen and a leather mouse-deer the size
   of a hand. Siti calls him Sang Kancil and Wulan calls him Si Kancil, and they both say they're
   right. *Choice:* whose way to hear the tales first. It pays off in LK7 and LK10.
   - *notice*, 4-LS1-1 (reader) / K-ESS3-1 (sprout): a real mouse-deer is one of the smallest hoofed
     animals, about 2 kg, and lives in the forests of South-East Asia. It isn't a mouse or a deer.
   - *do* (`edu:order:shadows:size`), 1-PS4-2. Move the puppet nearer the lamp to make it bigger.
2. **Kancil Is Hungry.** Across the river the fruit is ripe, and the river is full of crocodiles.
   - *ask*, K-LS1-1. Sprout: what does Kancil need? Food, water, a safe place. Reader: why do
     rivers in a rainforest have so much life (2-LS4-1)?
3. **Counting the Crocodiles** (the centrepiece, a big scene). Kancil tells the crocodiles the King
   has ordered them counted, so they must line up from bank to bank. He hops across their backs,
   counting, and he's over. In the Grove, the Nubbins float in a line across the stream and your
   Nubbin hops along them. *Choice:* Kancil turns back to say thank you; says sorry for the trick;
   or (reader only) laughs and runs. It pays off in LK4 and LK10.
   - *do* (`edu:count:crocodiles:10`), K.CC.B.5. Sprout: count the ten crocodiles, hop by hop, in
     English and then in Malay: satu, dua, tiga, empat, lima, enam, tujuh, lapan, sembilan, sepuluh.
     Reader: count in twos down the line; then four more crocodiles swim up, so how many now
     (1.OA.A.1)?
   - *notice*, ELOF: Mathematics Development / 2.OA.C.3 (reader): Wulan counts too, and at eight she
     says *delapan*, the Indonesian word. Siti says *lapan*, the Malay one. Every other number is the
     same. Reader: are 10 crocodiles an odd or an even number? Pair them up and see.
4. **The Crocodile Remembers.** Kancil drinks at the river, and a crocodile grabs his leg. "Silly
   crocodile, you've caught a stick!" It lets go to bite the stick. *Payoff of LK3:* if Kancil said
   thank you or sorry, the crocodile grumbles that it remembers; if he laughed, it is much crosser.
   - *ask*, CASEL: Responsible decision-making (reader think question, no best answer): was the trick
     fair? Sprout: long and short, a leg and a stick (K.MD.A.2).
5. **The Buffalo and the Crocodile.** A crocodile pinned under a fallen log begs a buffalo for help.
   Freed, it grabs the buffalo's leg. Kancil asks to see exactly how things were before he judges,
   so the crocodile goes back under the log. The buffalo walks home.
   - *ask*, D2.Civ.8.K-2. Sprout: say thank you to someone who helps you. Reader: was Kancil's
     judgement fair? Why did the crocodile agree to go back (RL.3.3)?
   - *notice*, 3-PS2-1 (reader): a long branch used as a lever lifts a heavy log.
6. **The Race with the Snails.** Kancil boasts that he's the fastest thing in the forest and mocks a
   snail. The snail accepts a race. Every time Kancil calls "Where are you?", a snail just ahead of
   him answers, because the snails have lined up along the whole riverbank. Kancil runs himself
   out and gives up.
   - *do* (`edu:count:snails:10`), K.CC.B.5 (sprout) / 3.OA.A.3 (reader): a snail every 5 metres,
     from 5 m to 50 m. How many snails? How long is the race?
   - *ask*, CASEL: Social awareness. Why is it unkind to laugh at someone for being slow?
7. **The Cucumber Garden.** Wulan's own tale, the one *wayang kancil* began with. Kancil steals
   cucumbers from Pak Tani's garden. Pak Tani makes a scarecrow covered in sticky sap, and Kancil
   sticks fast. In Wulan's old version he tricks the farmer's dog into swapping places. In the
   version children hear now, he says sorry and helps replant. *Payoff of LK1:* whoever told
   second tells this one, and the other says "That's not how my grandmother told it."
   - *notice*, 2-LS2-1. Sprout: cucumbers need water and sun. Reader: why the vines need both.
   - *ask*, CASEL: Responsible decision-making. Sprout: what should Kancil say? (Every option is
     kind.) Reader think question: which ending is better, and why?
8. **The Tiger at the River.** A tiger corners Kancil by the water. Kancil says his king is stronger
   than any tiger, and there he is, in the river. The tiger sees a tiger in the water, leaps at it,
   and comes up soaked. Kancil is gone.
   - *notice*, 1-PS4-2. Sprout: in still water you can see yourself. Reader: why still water
     reflects and splashing water doesn't.
   - *do* (`edu:tap:shape:reflection`), 4.G.A.3 (reader): find the line of symmetry where the
     water meets the bank.
9. **The Pit.** Kancil falls into a hunters' pit. He calls out that the sky is falling, and only the
   pit is safe. Elephant climbs in, and Kancil climbs out over Elephant's back. Siti stops: in her
   grandmother's version, Elephant stays stuck. *Choice (reader only):* end it that way, or help
   Kancil find a way to get Elephant out. Sprout always helps: logs and a ramp.
   - *do* (`edu:count:logs:6`), K.CC.B.4 / K-2-ETS1-1. Sprout: six logs make a ramp. Reader: what
     is the problem, and what are two ways to solve it?
10. **The Night of Stories.** The whole valley comes to the pond for the last show. Your Nubbin is
    Kancil, and the Grove's Nubbins line up across the stream as the crocodiles again. *Payoff of
    LK3:* if Kancil thanked them or said sorry, they line up at once; if he laughed (reader), he
    has to ask nicely first, and the child helps him say it. *Payoff of LK1:* the counting starts
    in the language you heard first, and the audience shouts the other at eight.
    - *do* (`edu:count:crocodiles:20`), K.CC.A.1 (sprout, to 10) / 2.OA.A.1 (reader): two lines of
      ten. How many crocodiles?
    - *ask*, RL.4.2 (reader) / CASEL: Self-awareness (sprout): what did Kancil learn this summer?

**Consequences:**
- **Tier 3 (in the line):** the crocodile choice in LK3 changes LK4 and, seven quests later, how
  the last crossing goes. The storyteller you hear first (LK1) decides who tells the cucumber tale
  (LK7) and which language leads the count in LK10.
- **Tier 2 (the Grove, Learning Grove only):** the shadow screen stays by the pond. Painted
  crocodile stepping-stones cross the stream. Siti and Wulan stay in the valley and can be found by
  the screen in the evenings, with idle lines in both languages.
- **Tier 1:** none. **Reads:** none.

**Lifted text:** none. The tales are traditional and retold in our own words; the Learning Grove
never quotes. Language used on screen (check with Malay and Indonesian advisers): the numbers 1–10
in Malay (8 is *lapan*) and Indonesian (8 is *delapan*); *Sang Kancil* (Malay) and *Si Kancil*
(Indonesian); *buaya* (crocodile, both); *Pak Tani* (Mr Farmer, Indonesian); *Mak Cik* (auntie,
Malay) and *Bu* (from *Ibu*, Indonesian).

**Rewards:** a Kancil shadow puppet for your Nubbin to "play"; the shadow screen; crocodile
stepping-stones; a cucumber-vine trellis. All one-time.

**Learning Grove version:** this is the Learning Grove version; there is no main-game line.

**Care notes:**
- Kancil belongs to both countries, and to Singapore and Brunei too. Never call him only Malaysian or
  only Indonesian. Siti and Wulan disagree warmly, and both are right.
- Some versions have Kancil act for King Sulaiman (the Prophet Solomon). The puppets only say "the
  King", and no king is shown. Never depict a prophet.
- Siti wears a tudung. Food at the shows is *kuih* (Siti) and *kue* (Wulan); no pork. Clothes, the
  lamp and the puppets need advisers from both countries; *wayang* should be shown with respect, not
  as a costume.
- Sprout keeps peril to a splash: crocodiles are hungry and grumpy, never shown biting, and the
  tiger only gets wet. The pit ends with everyone out.
- Tricks are discussed, not celebrated: every tale has a thinking question about fairness.

## A31. The Hero Twins (*Popol Vuh*, K'iche' Maya; Guatemala; the Atlas)

**Why it works:** the lords of the underworld, One Death and Seven Death, defeat two brothers at
the ballgame and keep them. The brothers' sons, the Hero Twins Hunahpu and Xbalanque, grow up
cheeky, clever and kind to small animals, and go down to Xibalba themselves. They pass every
deadly house by wit, win the game, let themselves be burned and come back, and humble Death. Then
they climb into the sky and become the Sun and the Moon. It is the oldest story in the Atlas
about being remembered: a father honoured, a grandmother who watches the corn, and a people who
still tell it. It answers S3: two brothers, Sun and Moon, who never quarrel about it.

**When and where:** the page opens once Nova's atlas is in the Grove. It shows a hearth, a stack
of tortillas and a green mountain. You come with your Nubbin, and a K'iche' grandmother tells the
story in the highlands of Guatemala, today. Her granddaughter interrupts.

**Your role:** a listener who goes in, then a helper in Xmucane's house: carrying water, hoeing,
watching. The twins keep their story. Your Nubbin makes friends with every small animal the twins
meet: the rat, the mosquito, the rabbit.

**The quests:**

1. **The Hearth.** A kitchen in the highlands. A grandmother is making tortillas, and her
   granddaughter wants a story, the old one. You and your Nubbin sit on a low stool. The smoke
   rises, and you go in.
2. **The Ballplayers.** Hun Hunahpu and his brother Vucub Hunahpu play ball loudly above the lords
   of Xibalba, who send owls to summon them. Watch the game; your Nubbin chases the ball.
3. **The Road Down.** The brothers go down. At a crossroads the black road says it is the way.
   They bow to seated lords who are only wooden figures, and are offered a bench that burns. They
   lose every test, and they don't come back. Hun Hunahpu's head is put in a tree by the road,
   and the tree is suddenly full of gourds. (All of this is told by the grandmother over the
   picture of an empty road; nothing is shown.)
4. **The Calabash Tree.** Xquic, daughter of a lord of Xibalba, comes to see the forbidden tree.
   A gourd speaks to her, and spits into her palm, and she is with child. Her father orders her
   killed. The owls sent with her let her go, and bring back a heart made of red tree sap. Help
   them press the sap.
5. **Xmucane's Test.** Xquic goes to the twins' grandmother, Xmucane, who doesn't believe her and
   sends her to bring a whole net of corn from a garden with one plant in it. Xquic calls on the
   guardians of food, and the net fills. Carry the net home. Xmucane looks at it for a long time.
6. **The Older Brothers.** The twins are born. Their half-brothers, One Monkey and One Artisan,
   are artists and unkind, and won't let them in. The twins shoot birds that lodge in a tree,
   send the brothers up to fetch them, and the tree grows. Tie your loincloths behind, they say,
   to climb down; the cloths become tails. Xmucane laughs, and the brothers run off into the trees
   as monkeys. (No one is hurt; they are artists still.)
7. **Seven Macaw.** A vain bird with jewel teeth and shining eyes says he is the sun and moon.
   The twins shoot him with a blowgun. He tears off Hunahpu's arm. An old couple, pretending to be
   healers, offer to cure his toothache, and replace his jewels with white corn. Without his shine
   he is nobody. Hunahpu gets his arm back. (Softened: no blood; the arm is "taken" and
   "returned".)
8. **Zipacna and Earthquake.** Seven Macaw's sons. Zipacna, who killed the Four Hundred Boys, is
   lured under a mountain by a pretend crab. Earthquake, who knocks down mountains, is fed a bird
   coated in earth and loses his strength. The Four Hundred Boys rise later as stars (Q16).
9. **The Rat.** The twins' tools hoe the garden by themselves, and the animals undo it every
   night. The twins catch a rat, who tells them their father's ball gear is hidden in the roof.
   They trick Xmucane out of the room with a thirsty water jar, and the rat gnaws the cord. **Your
   Nubbin and the rat** become friends. **Choice:** the twins pay the rat in food for ever after.
   You can (a) bring the rat a share of your own lunch too; (b) leave it to the twins; or (c) ask
   the rat to come with you to Xibalba. (A smaller payoff: the rat turns up in Q13.)
10. **The Summons.** The lords' messenger reaches Xmucane, and the message passes from a louse to
    a toad to a snake to a falcon, all the way to the twins. Before they go, each plants an ear of
    corn in the middle of the house: if it dries, they have died; if it sprouts, they live.
    **Choice:** (a) stay with Xmucane and watch the corn, or (b) go down with the twins. This pays
    off in Q12 to Q17.
11. **The Crossroads.** The twins send a mosquito ahead to bite each seated figure. The wooden ones
    don't cry out; the real lords do, and say each other's names. The twins greet every lord by
    name, and refuse the burning bench. (On the (a) path, you hear this from a falcon at
    Xmucane's door.)
12. **The Houses.** The Dark House: they're given a torch and cigars to keep alight till morning,
    and put a macaw's red feathers on the torch and fireflies on the cigars. Then the Razor House,
    the Cold House, the Jaguar House and the Fire House, and they come through each by wit. (On
    the (a) path, the corn in the house stays green, and Xmucane burns incense before it.)
13. **The Bat House.** A bat takes Hunahpu's head. Xbalanque calls the animals, and the coati
    brings a squash, which he carves into a head. In the game, a rabbit bounds off with the ball
    and the lords chase it, and the twins swap the real head back. (On the (a) path, the corn
    droops in the night, then lifts. Xmucane doesn't sleep. You don't either.) If the rat came
    (Q9 c), it is the rat who distracts the lords; if you fed it (Q9 a), it brings the coati.
14. **The Oven and the River.** Knowing the lords mean to burn them, the twins let themselves be
    burned, having told two seers to say their bones should be ground and poured into the river.
    The bones sink, and become catfish, and then boys again. (On the (a) path, the corn dries
    completely. Xmucane weeps. Then, after five days, it is green again.)
15. **The Performers.** Two ragged dancers come to Xibalba and do wonders: they burn a house and
    it's whole again; they "sacrifice" a dog and it gets up. The lords want it done to them.
    The twins do it, and don't bring them back. Then they say who they are, and the rest of
    Xibalba begs for mercy. It loses its greatness. (Shown as a stage show and a curtain: the
    lords simply aren't there when it rises.)
16. **The Ballcourt and the Sky.** The twins go to the ballcourt where their father lies and
    honour him: he will be remembered, and called on, first. Then they climb out into the sky,
    and one becomes the Sun and the other the Moon, and the Four Hundred Boys go up with them as
    stars. On the (b) path, you watch from the ballcourt. On the (a) path, from Xmucane's doorway,
    beside the green corn.
17. **The Hearth Again.** The grandmother finishes. The granddaughter asks if it's true. The
    grandmother says the sun came up this morning, didn't it? Eat a tortilla. Go home.

**Consequences:**

- **Tier 3 (in the line):** *The corn (Q10 → Q11 to Q16).*
  - (a) Stay with Xmucane: you see Xibalba only through messengers and the corn. Q12 to Q14 play
    as the corn's changes and Xmucane's waiting, rule three as a whole quest. The ending (Q16) is
    the sunrise from her doorway, with her hand on your shoulder.
  - (b) Go down: you see the trials up close, and can help only as the animals help (fetching,
    carrying). The ending is the sunrise from the ballcourt, by the father's resting place.
  - Both are warm; one is a waiting story and one is a travelling one. Xmucane says, on (a): "You
    watched the corn with me. That's the hard part. The boys only had to be clever."
- **Tier 2 (the Grove):** an ear of corn hangs in the cottage's middle beam, green on the (a)
  path, golden on the (b) path. A rubber ball for the Grove: Nubbins play a hip-bump ballgame on
  the flat grass by the pond, no hands allowed (rule two approves).
- **Reads:** `s3Done`.
  - *With `s3Done`:* your Nubbin wears the Sun and Moon ribbons (S3's reward). In Q16, as the
    twins rise, the grandmother's granddaughter (back in the frame) points at the ribbons: two
    colours stitched down the middle. In the Grove afterwards, Byte has a line: "Same sky. It was
    always the same sky. I'd like that read into the record."
  - *Without `s3Done`:* the ribbons don't appear, and Byte's line doesn't play.
- **Hazel's margin note** (`s24Done`): "Two boys who beat Death by being cheeky to it. My kind of
  boys."

**Lifted text** (Lewis Spence, *The Popol Vuh: The Mythic and Heroic Sagas of the Kichés of
Central America*, London: David Nutt, 1908; Project Gutenberg eBook #56550. Spence summarises and
partly translates Brasseur de Bourbourg's 1861 French. Public domain in the UK and US. No
public-domain English translation of the whole text exists; Goetz and Morley 1950, Tedlock 1985
and Christenson 2003 to 2007 are not used. Spence's spellings differ from modern K'iche' ones;
adapt names on screen as the advisers advise):

1. "The head of Hunhun-Ahpu was, however, suspended from a tree, which speedily became covered
   with gourds," (Q3, a fragment. On screen, "Hun Hunahpu".)
2. "the maiden stretched out her hand, and the head of Hunhun-Ahpu spat into the palm." (Q4.
   Adapted: "the gourd" for "the head".)
3. "Their bones were beaten to powder and thrown into the river, where they sank, and were
   transformed into young men." (Q14.)
4. "The game of ball was forbidden them, they were to perform menial tasks," (Of the lords of
   Xibalba, Q15, a fragment.)
5. "who now mounted to heaven and became the sun and moon," (Q16, a fragment.)
6. "whilst the four hundred youths slain by Zipacna became the stars." (Q16, a fragment. Adapted:
   "the Four Hundred Boys" on screen, to match Q8.)

Everything else is retold in our words, following the advisers and modern scholarship. Spence's
summary says the twins plant canes in the house; modern translations from the K'iche' say ears of
corn, and we follow those.

**Rewards:** the ear of corn (Tier 2, above); the rubber ball and ballgame; a jade-green pendant
for your Nubbin; a mosquito petpet who is surprisingly polite.

**Learning Grove version:** yes, both bands, softened: the fathers "stay in Xibalba", the twins'
trials are puzzles, and the oven, the bat and the sacrifice show are cut. A child learns where
Guatemala is, and that K'iche' Maya people live there and speak K'iche' today; how corn grows,
and that people in this part of the world first grew it; Maya numbers, counted in twenties, with
a dot, a bar and a shell for zero; the rubber ball, which Mesoamerican peoples made from tree sap
long before anyone else; and why the sun and the moon seem to take turns.

**Care notes:**

- **K'iche' advisers** (and K'iche' writers or storytellers) read the script before it is final.
  The *Popol Vuh* is a sacred and living text for many K'iche' people, written down by K'iche'
  authors in the 1550s and copied by the friar Francisco Ximénez around 1701; Guatemala's Ministry
  of Culture declared it intangible cultural heritage in 2012. Present it that way: a book still
  read, from a people still here.
- **The frame** is a modern K'iche' family, drawn with the advisers: a real kitchen, not a
  costume. No "lost civilisation" talk anywhere.
- **No ceremony on screen.** The grandmother tells a story; she doesn't perform a ritual. Daykeepers
  and the calendar are mentioned only if the advisers want them.
- **Rated All, with care.** Deaths are told, not shown: the fathers' fate over an empty road,
  Hunahpu's head as the bat flying off and the squash arriving, the oven as a glow, and the
  sacrifice show as a curtain. Add an optional parent note before Q13.
- **Names and spellings.** Use the advisers' spellings (for example Junajpu and Xb'alanke in
  modern K'iche') with the familiar forms as subtitles if they agree.
- **Ball, not war.** The game is a game. Never turn it into a battle or a lethal sport mechanic.

## Open points before scripting

1. **Resolved (canon sheet, 2026-10-14):**
   - **Pixel's pronouns.** Pixel is she/her. The outlines now use "she" where they need a
     pronoun (S25 Q3, PA1 Q18).
   - **Corvin at the vigil (S23).** Approved. With `visitors`, Corvin stands in the lane beyond
     the gate with a lantern during the vigil (`c10-vigil-corvin`): narration only, nobody goes to
     him or sends him off, and he doesn't try the latch. It is not his arrival. His first arrival
     at the gate after the Long Night is S9's dusk scene (`s9-dusk`), where the latch sticks;
     `c11-gate`, on the night of `s9-ask`, is a return, and he tries the latch once, for form's
     sake. He went home at first light after the vigil (`c10-dawn-lane`), so none of this
     clashes.
   - **A15** stays Tier 3, with no Grove keepsake, as the plan says. The china lamb shouldn't
     become one: the whole point is that it can't be taken away.
2. **Canon kept:**
   - Animals and Nubbins don't speak in the Grove. Spindle (S27) writes but never talks, Thimble (S23)
     is a silent echo, the otters (S29) are wordless, the tall bird (S24) and the robin (S26) are
     silent, and Parcel (S28) is polite through gesture. The only voices are the canon's
     exceptions: Briar and Hush as Eternals (S23), Moss, and Wisp's Shadow whisper (S27). In Atlas
     and Arcade pages the source's own animals talk, because those pages are not the Grove; your
     Nubbin never does.
   - Hazel speaks only at Cinder's post in chapter 12. S26's moment in Hush's garden is silent.
   - Moss's flower is on the hill by his flat stone (S24, S26, A17 agree); with `hushGarden` its
     seed goes over the wall.
   - The bible's Moss threshold is untouched: no new story gives Moss affection or Sable trust.
   - Only S23, S26 and S27 are Tier 1. The other new side stories write only their `sNNDone`.
   - No timers or chores: no "once a day" or "once per season" rewards remain; marmalade (S28) and
     the Grove keepsakes are one-time or unlimited.
3. **New characters:**
   - Linnet (Tobin's granddaughter, S26)
   - Augusta Fairweather (S24)
   - Thimble (an echo only, S23)
   - Spindle (S27)
   - Parcel and Mr Grue (S28)
   - Granny Brock (S29)

   Tobin and Tilly get a one-line introduction if S13 or S14 wasn't played.
4. **Ordering guards:**
   - S27's egg-sac quest waits until `wisp` is set (chapter 7), or until chapter 8 if S2 was
     never played.
   - If A13 is played before S25, S25's Clank scene checks A13 ("I found it already").
   - S24 adds Hazel's margin notes to every Atlas page, except the two that already have one
     (A11's last page, A14's Argos page).
   - The three nights before the Long Night are crowded. S23 owns the nights; S6 can play by day.
     S28's cart-stop and glasshouse scenes now sit in early winter, before chapter 9, so they
     never clash with S23.
5. **Rights:**
   - These need a licence to ship: *Up*, *Charlotte's Web*, *Paddington*, *The Little Prince*,
     *My Neighbor Totoro* and *Sonic Adventure*. The quote limits cover the text, not the
     characters.
   - *Winnie-the-Pooh*: hold A11 in the UK until 1 January 2027.
6. **Quotes still to recheck before scripting.** On 2026-10-14 every Lifted text line was
   rechecked. Gutenberg's pages were cut off at about 100,000 characters here, and Wikisource and
   Standard Ebooks could not be reached, so lines past the cut-off are marked [unverified] in
   place. These need a final check against the named edition:
   - Dickens, Staves Four and Five (three lines);
   - *Winnie-the-Pooh* chapter IX and *The House at Pooh Corner* chapter X (three lines);
   - *The Snow Queen* in #1597 (all eight; they match Lit2Go's copy);
   - *The Secret Garden* in #113 (all eight, including the rose-and-thistle couplet);
   - Murray's *Pinocchio* (all eight; Murray is not on Gutenberg);
   - Butler's *Odyssey*, Books IX to XXIII (six lines);
   - Baum, chapters XV, XX and XXIII (five passages);
   - *The Wind in the Willows*, chapters V and VII (four lines);
   - the *Totoro* dub lines and Tikal's prayer, against the licensed English tracks.

## How to build it (backlog item CV5)

1. **Approve the list.** Maor approves or swaps lines from the ranking. The top 15 are outlined
   here; the rest need outlines in the same format.
2. **Grove side stories first** (S23–S31), because three of them are Tier 1:
   - Add the flags `visitors`, `hushGarden` and `s23Done` to `s31Done`.
   - Add S9's sixth "family" condition.
   - Add S27's buy-back side effect.
   - Then wire the epilogue lines.
   - Run `content-check` and the `endingFor` tests.
3. **Atlas pages** follow Part L's CV4. **Pixel's Arcade** reuses the Atlas's save code: its
   cartridges keep their own progress, separate from the Grove, and never write Grove flags.
4. **Fun packs** (Q66–Q95) follow the fun-quest rules. **Learning Grove lines** (LB, LK and the
   A-page edu versions) follow EDU-STYLE, in both bands.
5. **Script, then review.** Use the same review and fact-check passes as before. Use original
   dialogue, except for the lifted public-domain text and the few short quotes listed. Never use
   lyrics.

## Sources

- https://gutenberg.org/files/46/46-h/46-h.htm (*A Christmas Carol*, PG #46, 1843 first edition; Staves One to Three)
- https://etc.usf.edu/lit2go/160/a-christmas-carol/2828/stave-iv/ and https://etc.usf.edu/lit2go/160/a-christmas-carol/2829/stave-v/
- https://www.shmoop.com/stave-4-full-text-12.html
- https://gutenberg.org/cache/epub/11757/pg11757.txt (*The Velveteen Rabbit*, PG #11757)
- https://standardebooks.org/ebooks/frances-hodgson-burnett/the-secret-garden/text/chapter-12
- https://www.sparknotes.com/lit/secretgarden/full-text/chapter-viii/
- https://etc.usf.edu/lit2go/163/the-secret-garden/2903/chapter-11-the-nest-of-the-missel-thrush
- https://www.lingq.com/es/aprende-ingles-en-linea/courses/50633/chapter-ix-91496/
- https://americanliterature.com/author/frances-hodgson-burnett/book/the-secret-garden/chapter-xii-might-i-have-a-bit-of-earth/flashcards
- https://anglais-pedagogie.web.ac-grenoble.fr/sites/anglais-pedagogie.web.ac-grenoble.fr/files/the_secret_garden_par_frances_godgson_burnett.pdf (epigraph only)
- https://en.wikipedia.org/wiki/Dug_Muntz (redirects to *Up* (2009 film) plot)
- https://www.shmoop.com/study-guides/up/quotes.html
- Blocked (permission timed out): standardebooks.org Secret Garden chapters 8, 10 and 27. Gutenberg's own text files were refused by the proxy, and its HTML pages were cut off after about 110,000 characters.
- Kenneth Grahame, *The Wind in the Willows* (1913 Scribner's text, Project Gutenberg #27805):
  https://gutenberg.org/cache/epub/27805/pg27805-images.html (used for Ch. I and III).
- Chapter VII, "The Piper at the Gates of Dawn":
  https://americanliterature.com/author/kenneth-grahame/book/the-wind-in-the-willows/vii-the-piper-at-the-gates-of-dawn
- Chapter V, "Dulce Domum" (Lit2Go, from the 1908 Methuen edition):
  https://etc.usf.edu/lit2go/105/the-wind-in-the-willows/1801/dulce-domum/
- *Charlotte's Web* plot (the words, the Fair, the egg sac of 514 eggs, Templeton's reward, the
  three daughters): https://www.sparknotes.com/lit/charlottes-web/summary/
- *Charlotte's Web* quotes: https://bookriot.com/charlottes-web-quotes/
- *A Bear Called Paddington* chapters, Mr Curry, Mrs Bird and the hard stare:
  https://literature.fandom.com/wiki/A_Bear_Called_Paddington
- Paddington's label, Aunt Lucy and marmalade:
  https://paddington.com/gb/back-in-1958/who-is-paddington
- Bond and the evacuee children:
  https://www.npr.org/sections/thetwo-way/2017/06/28/534702099/michael-bond-the-giant-behind-paddington-bear-dies-at-91
- "If we're kind and polite, the world will be right" in *Paddington 2*:
  https://www.spiritualityandpractice.com/films/reviews/view/28684/paddington-2 (search result
  title only)
- *Sonic Adventure* plot and backstory: https://sega.fandom.com/wiki/Sonic_Adventure
- The final story (the flood, Super Sonic, Tikal and Chaos leaving):
  https://strategywiki.org/wiki/Sonic_Adventure/Super_Sonic
- Tikal, her prayer and Pachacamac: https://chao-island.com/wiki/Tikal
- Blocked and not used: en.wikipedia.org's *Charlotte's Web* and *Sonic Adventure* pages (the
  permission request timed out), gutenberg.org downloads by curl (proxy refused) and Standard
  Ebooks (robots).
- Winnie-the-Pooh, Project Gutenberg #67098: https://www.gutenberg.org/cache/epub/67098/pg67098-images.html
- The House at Pooh Corner, Project Gutenberg #73011: https://gutenberg.org/cache/epub/73011/pg73011-images.html
- Ch. IX text (copy): https://americanliterature.com/author/aa-milne/book/winnie-the-pooh/chapter-ix-in-which-piglet-is-entirely-surrounded-by-water
- The promise and last line (secondary copies): https://www.massaudubon.org/content/download/16891/250624/file/15-Quiet Earth-Epilogue.pdf ; https://wist.info/milne-a-a/65455/ ; https://www.goodreads.com/quotes/808360-then-suddenly-again-christopher-robin-who-was-still-looking-at
- Galleons Lap and "Nothing": https://www.brendanmyers.net/blog/2007/08/galleons-lap/
- UK copyright (IPO blog): https://ipo.blog.gov.uk/2025/03/06/a-bear-of-very-little-copyright-winnie-the-poohs-journey-into-the-public-domain
- The Snow Queen (Lit2Go): https://etc.usf.edu/lit2go/198/the-snow-queen/ and stories 1, 4, 5, 6, 7:
  https://etc.usf.edu/lit2go/198/the-snow-queen/4273/first-story-which-treats-of-a-mirror-and-of-the-splinters/ ;
  https://etc.usf.edu/lit2go/198/the-snow-queen/4277/fourth-story-the-prince-and-princess/ ;
  https://etc.usf.edu/lit2go/198/the-snow-queen/4278/fifth-story-the-little-robber-maiden/ ;
  https://etc.usf.edu/lit2go/198/the-snow-queen/4279/sixth-story-the-lapland-woman-and-the-finland-woman/ ;
  https://etc.usf.edu/lit2go/198/the-snow-queen/4280/seventh-story-what-took-place-in-the-palace-of-the-snow-queen-and-what-happened-afterward/
- Gutenberg #1597 (same text, seventh story): https://www.bookrags.com/ebooks/1597/56.html
- The Snow Queen (plot): https://en.wikipedia.org/wiki/The_Snow_Queen
- Paull's 1888 edition (Wikisource): https://en.wikisource.org/wiki/Hans_Andersen%27s_Fairy_Tales
- Pinocchio, Gutenberg #16865: https://gutenberg.org/cache/epub/16865/pg16865-images.html
- Murray's translation, 1911 Dent reprint: https://portfoliogk.lima-city.de/_ILLUSTRATION_WEB/carroll/pinocchio.pdf
- Murray 1892 credit: https://www.oldbookillustrations.com:443/illustrations/threw-himself-water/
- Pinocchio chapters XXV, XXXI, XXXV, XXXVI: https://americanliterature.com/author/c-collodi/book/pinocchio/chapter-xxv-pinocchio-promises-the-fairy-to-be-good ;
  https://americanliterature.com/author/c-collodi/book/pinocchio/chapter-xxxi-pinocchio-enjoys-five-months-of-happiness ;
  https://americanliterature.com/author/c-collodi/book/pinocchio/chapter-xxxv-a-happy-surprise-for-pinocchio ;
  https://americanliterature.com/author/c-collodi/book/pinocchio/chapter-xxxvi-pinocchio-at-last-ceases-to-be-a-puppet-and-becomes-a-boy
- The Terrible Dogfish: https://en.wikipedia.org/wiki/The_Terrible_Dogfish
- Land of Toys: https://en.wikipedia.org/wiki/Land_of_Toys
- The Odyssey, Butler, Gutenberg #1727: https://gutenberg.org/cache/epub/1727/pg1727-images.html
- Butler Books XII and XVII: https://web.math.utk.edu/~vasili/va/GREECE/Odyssey/book.12.html ;
  https://web.math.utk.edu/~vasili/va/GREECE/Odyssey/book.17.html
- Butler (Power–Nagy revision) Books IX and XI: https://fgh.perseids.org/read/greekLit/tlg0012/tlg002/perseus-eng4/9.272-9.494 ;
  https://cts.perseids.org/read/greekLit/tlg0012/tlg002/perseus-eng4/11.118-12.1
- Butler Book XXIII: https://human.libretexts.org/Bookshelves/Literature_and_Literacy/Classics/The_Odyssey_(Homer)/01%3A_Books/1.23%3A_Book_XXIII
- Blocked and not used: classics.mit.edu and gutenberg.org plain-text files (proxy), Standard
  Ebooks (robots), Wikisource Butler Book XI (not found).
- Project Gutenberg, *The Wonderful Wizard of Oz* (#55): https://www.gutenberg.org/ebooks/55 and
  https://www.gutenberg.org/ebooks/55.txt.utf-8 (chapters I to XII, chapter titles)
- Standard Ebooks, *The Wonderful Wizard of Oz*, chapters 14, 15, 20 and 23:
  - https://standardebooks.org/ebooks/l-frank-baum/the-wonderful-wizard-of-oz/text/chapter-14
  - https://standardebooks.org/ebooks/l-frank-baum/the-wonderful-wizard-of-oz/text/chapter-15
  - https://standardebooks.org/ebooks/l-frank-baum/the-wonderful-wizard-of-oz/text/chapter-20
  - https://standardebooks.org/ebooks/l-frank-baum/the-wonderful-wizard-of-oz/text/chapter-23
- Lit2Go, chapter 10 (the green spectacles):
  https://etc.usf.edu/lit2go/158/the-wonderful-wizard-of-oz/2756/chapter-10-the-guardian-of-the-gate
- Wikipedia, *The Wonderful Wizard of Oz*: https://en.wikipedia.org/wiki/The_Wonderful_Wizard_of_Oz
- Wikipedia, *The Little Prince*: https://en.wikipedia.org/wiki/The_Little_Prince
- LitCharts summary, *The Little Prince*: https://www.litcharts.com/lit/the-little-prince/summary
- French text, *Le Petit Prince* chapter XXI (Sun Yat-sen University course copy):
  https://fls.sysu.edu.cn/lecturefrc/docs/20151117114437414273.pdf
- Wikipedia, *My Neighbor Totoro*: https://en.wikipedia.org/wiki/My_Neighbor_Totoro
- Ghibli Wiki, *My Neighbor Totoro*: https://ghibli.fandom.com/wiki/My_Neighbor_Totoro
- Nausicaa.net synopsis: https://nausicaa.net/miyazaki/totoro/synopsis/
- Ranker, Totoro quotes (secondary; for the dub lines):
  https://www.ranker.com/list/best-my-neighbor-totoro-quotes/ranker-anime
- Quote recheck, 2026-10-14 (fixer pass). Gutenberg pages were read only up to about 100,000
  characters; Wikisource returned "not found" and Standard Ebooks refused robots, so lines past
  the cut-off are marked [unverified] in place:
  - *A Christmas Carol*, PG #46: https://gutenberg.org/files/46/46-h/46-h.htm (Staves One to
    Three); Lit2Go Staves IV and V (secondary): https://etc.usf.edu/lit2go/160/a-christmas-carol/2828/stave-iv/ ;
    https://etc.usf.edu/lit2go/160/a-christmas-carol/2829/stave-v/
  - *Winnie-the-Pooh*, PG #67098, and *The House at Pooh Corner*, PG #73011 (to chapter VII of
    each): the URLs above.
  - *The Snow Queen*: PG #1597 (cut off before the story): https://www.gutenberg.org/files/1597/1597-h/1597-h.htm ;
    #1597 text on BookRags (seventh story): https://www.bookrags.com/ebooks/1597/56.html ;
    Lit2Go fifth, sixth and seventh stories (secondary).
  - *The Velveteen Rabbit*, PG #11757 (whole text): https://gutenberg.org/cache/epub/11757/pg11757.txt
  - *The Secret Garden*, PG #113 (to chapter IX): https://www.gutenberg.org/files/113/113-h/113-h.htm
  - *Pinocchio*, PG #16865 (a 1916 Whitman translation, not Murray's):
    https://gutenberg.org/cache/epub/16865/pg16865-images.html
  - *The Odyssey*, Butler, PG #1727 (to Book IV): https://gutenberg.org/cache/epub/1727/pg1727-images.html
  - *The Wonderful Wizard of Oz*, PG #55 (to chapter XII): https://www.gutenberg.org/cache/epub/55/pg55-images.html
  - *The Wind in the Willows*, PG #27805 (to chapter IV): https://gutenberg.org/cache/epub/27805/pg27805-images.html
  - *Le Petit Prince*, chapter XXI (course copy): https://fls.sysu.edu.cn/lecturefrc/docs/20151117114437414273.pdf
  - Tikal's prayer: https://chao-island.com/wiki/Tikal
  - *Totoro* dub lines (secondary): https://www.ranker.com/list/best-my-neighbor-totoro-quotes/ranker-anime
  - *Charlotte's Web*, *Up* and *Paddington* lines: search results from
    https://clairelaporte.substack.com/p/some-writer-the-invisible-author ,
    https://www.goodreads.com/work/quotes/987048 , https://www.shmoop.com/study-guides/up/scene-12-summary.html ,
    https://paddingtonbear.fandom.com/wiki/The_label_around_his_neck and
    https://www.thecurb.com.au/paddington-2-review-if-youre-kind-and-polite-the-world-will-be-right/
  - Andersen's Danish *Finnekonen* and the Sámi: background for the A12 care note (adviser to
    confirm).
- Leonard A. Magnus, "Vasilísa the Fair", *Russian Folk-Tales* (1915), Standard Ebooks:
  https://standardebooks.org/ebooks/a-n-afanasyev/russian-folktales/leonard-a-magnus/text/vasilisa-the-fair
- Project Gutenberg #62509 (Magnus) record: https://www.gutenberg.org/ebooks/62509 and
  https://www.gutenberg.org/cache/epub/62509/pg62509-images.html
- SurLaLune, Post Wheeler's "Vasilissa the Beautiful" (1912):
  https://surlalunefairytales.com/oldsite/babayaga/index.html
- Brodeur's *Prose Edda* (1916), sacred-texts: https://www.sacred-texts.com/neu/pre/index.htm and
  https://www.sacred-texts.com/neu/pre/pre04.htm
- Mythopedia, Brodeur Gylfaginning: https://mythopedia.com/library/prose-edda-brodeur-1916/gylfaginning/
- Ragnarök excerpt (reproducing the sacred-texts text):
  https://pressbooks.ccconline.org/worldmythology-cccs/?p=67
- Kipling, *The Jungle Book*, Project Gutenberg #236:
  https://www.gutenberg.org/files/236/236-h/236-h.htm
- Kipling Society, "The White Seal" text and notes: https://www.kiplingsociety.co.uk/?p=9156,
  https://www.kiplingsociety.co.uk/?p=8608, https://www.kiplingsociety.co.uk/?p=8607
- Kipling Society, "The Spring Running": https://www.kiplingsociety.co.uk/?p=9189
- Kipling Society, "The Law of the Jungle" (poem):
  https://www.kiplingsociety.co.uk/poem/poems_lawofjungle.htm
- R. Campbell Thompson, *The Epic of Gilgamish* (1928), sacred-texts mirror:
  https://neonvagabond.xyz/mirrors/sacred-texts/ane/eog/index.htm, eog03.htm (Tablet I),
  eog12.htm (Tablet X), eog13.htm (Tablet XI)
- Online Books Page, R. Campbell Thompson (1876–1941):
  https://onlinebooks.library.upenn.edu/webbin/who/Thompson%2c%20R%2e%20Campbell%20%28Reginald%20Campbell%29%2c%201876%2d1941
- Jastrow and Clay, *An Old Babylonian Version of the Gilgamesh Epic* (1920), Project Gutenberg
  #11000: https://gutenberg.org/cache/epub/11000/pg11000.txt
- Helen Zimmern, *The Epic of Kings* (1883), MIT Internet Classics Archive:
  https://classics.mit.edu/Ferdowsi/kings.html, kings.3.zal.html, kings.4.zalrudabeh.html,
  kings.5.rustem.html
- Warner and Warner, *The Shahnama of Firdausi*, vol. 1 (1905): https://archive.org/details/shahnama01firduoft
  and https://persian.packhum.org/text/006801281
- Encyclopaedia Iranica, "Zāl": https://www.iranicaonline.org/articles/zal
- Encyclopaedia Iranica, "Rudāba": https://iranicaonline.org/articles/rudaba
- Wikipedia, "Zāl": https://en.wikipedia.org/wiki/Z%C4%81l
- Wikipedia, *Pokémon: The First Movie*: https://en.wikipedia.org/wiki/Pok%C3%A9mon:_The_First_Movie
- Bulbapedia, *Mewtwo Strikes Back* (M1): https://bulbapedia.bulbagarden.net/wiki/M1
- Goodreads, quotes from *The Art of Pokémon, The First Movie* (Takeshi Shudo):
  https://www.goodreads.com/work/quotes/443354 and https://www.goodreads.com/quotes/tag/mewtwo
- Hollow Knight Wiki, The Hollow Knight: https://hollowknight.wiki/w/The_Hollow_Knight
- Hollow Knight Wiki, Hornet: https://hollowknight.wiki/w/Hornet_(Hollow_Knight)
- Hollow Knight Wiki, Quirrel: https://hollowknight.wiki/w/Quirrel
- Hollow Knight Wiki, Resting Grounds: https://hollowknight.wiki/w/Resting_Grounds
- Hollow Knight Wiki, Delicate Flower: https://www.hollowknight.wiki/w/Delicate_Flower
- Hollow Knight Wiki, The Pale King: https://hollowknight.wiki/w/The_Pale_King
- Fextralife Hollow Knight Wiki, Grub: https://hollowknight.wiki.fextralife.com/Grub
- RogueRanker, Hollow Knight story explained: https://rogueranker.com/hollow-knight-story/
- Wikipedia, *Undertale*: https://en.wikipedia.org/wiki/Undertale
- Wikipedia, List of Undertale and Deltarune characters:
  https://en.wikipedia.org/wiki/List_of_Undertale_and_Deltarune_characters
- Undertale Wiki, Ruins: https://undertale.fandom.com/wiki/Ruins
- Undertale Wiki, Undyne's House: https://undertale.wiki/w/Undyne%27s_House
- Villains Wiki, Flowey synopsis: https://villains.fandom.com/wiki/Flowey/Synopsis
- Arrpeegeez, Undertale True Pacifist walkthrough:
  https://www.arrpeegeez.com/2015/10/undertale-walkthrough-part-six-pacifist.html
- Zelda Dungeon, *Breath of the Wild* story: https://zeldadungeon.net/wiki/Breath_of_the_Wild_Story
- Zelda Dungeon, *Breath of the Wild* key characters:
  https://www.zeldadungeon.net/wiki/Breath_of_the_Wild_Key_Characters
- Zelda Archive (Fandom), Recovered Memory: https://zelda-archive.fandom.com/wiki/Recovered_Memory
- Twinfinite, *Breath of the Wild* endings:
  https://twinfinite.net/guides/zelda-breath-of-the-wild-endings-how-to-get/
- Nintendo AU, story recap:
  https://nintendo.com/au/news-and-articles/relive-the-story-of-the-legend-of-zelda-breath-of-the-wild
- Zelda Universe, "Open your eyes":
  https://zeldauniverse.net/2016/06/14/breath-of-the-wild-introduces-voice-acting-to-the-zelda-universe/
- Wikipedia, *How to Train Your Dragon* (2010 film):
  https://en.wikipedia.org/wiki/How_to_Train_Your_Dragon_(2010_film)
- Moria Reviews, *How to Train Your Dragon* (2010), including book differences:
  https://www.moriareviews.com/fantasy/how-to-train-your-dragon-2010.htm
- Sideshow, *How to Train Your Dragon* quotes:
  https://www.sideshow.com/blog/how-to-train-your-dragon-quotes
- *Inside Out* plot: https://en.wikipedia.org/wiki/Inside_Out_(2015_film)
- *Inside Out* lines (Sadness's crying line; Bing Bong's "I'm okay now."):
  https://shmoop.com/study-guides/inside-out/sadness-quotes.html
- *Inside Out 2* plot (Anxiety, the Belief System, the panic attack, Joy's realisation):
  https://slashfilm.com/1602824/inside-out-2-ending-explained-embrace-anxiety-joy
- *It's the Great Pumpkin, Charlie Brown* plot (rocks, Snoopy, Sally, Lucy at 4 a.m., the wall):
  https://en.wikipedia.org/wiki/It%27s_the_Great_Pumpkin,_Charlie_Brown
- Detailed plot and the "three things" line (Lucy's carving, the football contract, two lists,
  the costume holes, "if"): https://peanuts.fandom.com/wiki/It%27s_the_Great_Pumpkin,_Charlie_Brown
- "I got a rock." and the "fury" exchange:
  https://halloweenspecials.fandom.com/wiki/It%27s_the_Great_Pumpkin,_Charlie_Brown
- *Frieren* episodes 1–28 (season 1 through the First-Class Mage Exam):
  https://en.wikipedia.org/wiki/List_of_Frieren_episodes
- *Frieren* premise: https://en.wikipedia.org/wiki/Frieren and
  https://en.wikipedia.org/wiki/Frieren_(character)
- Episode 2 (Fern's training, Heiter, the blue moon-weed, the seed rat, the tower):
  https://daddyjim.ai/frieren/episode/Episode-2
- The flower-field spell (Flamme's and Frieren's favourite): https://m.imdb.com/news/ni65142819
- *Frieren* subtitle lines: https://reactormag.com/frieren-offers-timeless-life-lessons-from-a-tired-mage/
- *Encanto* plot, setting, the Thousand Days' War and the Colombian Cultural Trust:
  https://en.wikipedia.org/wiki/Encanto
- *Encanto* beats and the two lines: https://savethecat.com/beat-sheets/encanto-beat-sheet
- *The Lion King* plot and Hell's Gate National Park: https://en.wikipedia.org/wiki/The_Lion_King
- *The Lion King* lines: https://en.wikiquote.org/wiki/The_Lion_King
- Name meanings (only *simba* and *rafiki* are used as facts):
  https://jenmansafaris.com/?p=135632
- The *hakuna matata* trademark debate:
  https://www.kunc.org/npr-news/2018-12-14/swahili-speakers-debate-disneys-trademark-of-hakuna-matata-for-t-shirts
  and https://www.wtvr.com/2018/12/19/petition-calls-on-disney-to-drop-hakuna-matata-trademark
- Canon checked in the repo: `campaign-book2.ts` (`c6-open`, `c6-close`, `c7-open`, frost every
  dawn in ch7–8), `campaign-book3.ts` (the Long-Grass lantern at dawn and in the kept-stone route),
  `side-stories-fun.ts` (S1's Hush memory, S5's walk), `lang-hebrew.ts` (Clover's fussy Nubbin).
- Blocked and not used: en.wikipedia.org's *Inside Out 2* page (the permission request timed
  out), the *Frieren* fandom mirror (bot wall), and Wikiquote's *Encanto* and *Inside Out* pages
  (not found from here).
- Wikipedia, *The Neverending Story*: https://en.wikipedia.org/wiki/The_Neverending_Story
- Wikipedia, List of *The Neverending Story* characters:
  https://en.wikipedia.org/wiki/List_of_The_Neverending_Story_characters
- EBSCO Research Starters, *The Neverending Story*:
  https://www.ebsco.com/research-starters/literature-and-writing/neverending-story-michael-ende
- Neverending Story Wiki (plot): https://theneverendingstory.fandom.com/wiki/The_Neverending_Story?oldid=4270
- SuperSummary, *The Neverending Story* character list:
  https://www.supersummary.com/the-neverending-story/character-list/
- Rattray, *Akan-Ashanti Folk-Tales* (1930), Internet Archive full text:
  https://archive.org/stream/akanashantifolkt0000ratt/akanashantifolkt0000ratt_djvu.txt
- Wikipedia, Robert Sutherland Rattray: https://en.wikipedia.org/wiki/Robert_Sutherland_Rattray
- Wikipedia, Anansi: https://en.wikipedia.org/wiki/Anansi
- Wikipedia, Osebo: https://en.wikipedia.org/wiki/Osebo
- WilderUtopia, "How Spider Obtained the Sky God's Stories" (after Radin and Sweeney, 1952):
  https://wilderutopia.com/traditions/myth/ashanti-of-ghana-how-spider-obtained-the-sky-gods-stories/
- Multo (Ghost), "How Anansi Bought the World's Stories" (retelling citing Rattray and
  Courlander): https://multoghost.wordpress.com/2024/05/03/how-anansi-bought-the-worlds-stories/
- University of Illinois RBML, *A Story, a Story*: https://exhibits.library.illinois.edu/s/rbml/page/a-story-a-story
- Yale-New Haven Teachers Institute (Anansi tale list): https://teachersinstitute.yale.edu/curriculum/units/1998/2/98.02.04/4
- Project Gutenberg, Jekyll, *Jamaican Song and Story* (1907):
  https://gutenberg.org/cache/epub/35410/pg35410-images.html
- Wikipedia, *KPop Demon Hunters*: https://en.wikipedia.org/wiki/KPop_Demon_Hunters
- Netflix Tudum, Derpy Tiger: https://www.netflix.com/tudum/articles/kpop-demon-hunters-derpy-tiger-bio
- *The Jewish Encyclopedia*, "Golem": https://jewishencyclopedia.com/articles/6777-golem
- Wikipedia, Golem: https://en.wikipedia.org/wiki/Golem
- Prague City Tourism, the legend of the Golem: https://prague.eu/en/golem-of-prague/
- Moment Magazine, "Jewish Word: Emet": https://momentmag.com/jewish-word-emet/
- Bible Hub, Psalm 139:16 parallel (JPS 1917): https://biblehub.com/parallel/psalms/139-16.htm
- Bible Hub, Psalm 92:1 (JPS 1917): https://mail.biblehub.com/psalms/92-1.htm
- Project Gutenberg, Spence, *The Popol Vuh* (1908), eBook #56550:
  https://gutenberg.org/cache/epub/56550/pg56550-images.html
- Wikipedia, Maya Hero Twins: https://en.wikipedia.org/wiki/Maya_Hero_Twins
- Wikipedia, *Popol Vuh*: https://en.wikipedia.org/wiki/Popol_Vuh
- Repo: `src/content/lang-hebrew.ts` (Ori's Alef-Bet, LH2 letters), `side-stories-main.ts` (S2
  Wisp), `side-stories-fun.ts` (S3 Moot, ribbons, "same tea"), `edu-side-1-sprout.ts` (S6's
  three-note name).
- Lewis Carroll, *Alice's Adventures in Wonderland*, Project Gutenberg #11 (GITenberg mirror):
  https://raw.githubusercontent.com/GITenberg/Alice-s-Adventures-in-Wonderland_11/master/11.txt
- Lewis Carroll, *Through the Looking-Glass*, Project Gutenberg #12:
  https://raw.githubusercontent.com/GITenberg/Through-the-Looking-Glass_12/master/12.txt
- Conan Doyle texts, Project Gutenberg via GITenberg: *A Study in Scarlet* (#244), *The Sign of the
  Four* (#2097), *The Adventures* (#1661), *The Memoirs* (#834), *The Return* (#108), *The Hound of the
  Baskervilles* (#2852), *His Last Bow* (#2350):
  https://raw.githubusercontent.com/GITenberg/A-Study-in-Scarlet_244/master/244.txt and the
  matching paths for the other numbers
- George Borrow, *The Turkish Jester* (1884), Project Gutenberg #16244:
  https://gutenberg.org/cache/epub/16244/pg16244-images.html
- Nasreddin Hodja background: https://en.wikipedia.org/wiki/Nasreddin ·
  https://www.incirlik.af.mil/News/Features/Display/Article/725864/ask-mehmet-who-is-hodja/ ·
  https://sites.pitt.edu/~dash/hodja.html (tale list only; Ashliman's retellings are not quoted) ·
  https://dersimiz.com/fikra/what-if-it-does-fikrasi-2352 (the yoghurt lake) ·
  https://www.egitimsistem.com/service/amp/ye-kurkum-ye-nasrettin-hoca-fikrasi-70536h.htm ("Ye
  kürküm ye") · https://sites.pitt.edu/~dash/type1288a.html (counting the donkey you ride)
- *Bluey* facts: https://en.wikipedia.org/wiki/Bluey_(2018_TV_series)
- Sang Kancil: https://en.wikipedia.org/wiki/Sang_Kancil ·
  https://biblioasia.nlb.gov.sg/all-sections/the-different-faces-of-sang-kancil/ ·
  https://borneohistory.net/mouse-deer/ (the buffalo and the crocodile) ·
  https://www.lingoace.com/id/artikel/parenting/cerita-dongeng-anak-si-kancil-dan-siput-yang-penuh-makna/
  (the snail race)
- Wayang kancil: https://cwa-web.org/en/WayangKancil ·
  https://www.thejakartapost.com/news/2009/03/30/ki-ledjar-soebroto-puppet-master-left-shadows
- Mouse-deer: https://en.wikipedia.org/wiki/Lesser_mouse-deer
- Malay and Indonesian numbers: https://omniglot.com/language/numbers/malayindonesian.htm

## Engine backlog from the fix pass (CV6)

The 2026-10-14 fix pass changed the scripts in `src/content/`. These are the engine changes the
scripts now expect. Do them with CV1 (see the suggested order). Each item names its source: the
fix log and the item number in it. Where two logs ask for the same thing, the item says so; do it
once. The Learning Grove mirror of the new scenes is content work, not engine work, so it isn't
listed here.

### Campaign and endings

1. **`endingFor` and ending scenes** (log-campaign E1), in `src/sim/campaign.ts`.
   - Order unchanged: collector → empty-lantern → eternal-dawn → wild-grove → hazels-grove →
     moss-sleeps → shadow-keeper → long-road.
   - `collector`: `(soldNubbin && !boughtBack) || keptStone`. The current code lacks `keptStone`.
   - `hazels-grove`: `bonded && corvin === 'reconciled' && !mossFaded`. It must **not** test
     `finalChoice`; the current code already doesn't, so keep it that way. `mossFaded` = affection
     under 40 at the start of chapter 10, or Moss carried the stone in and `mossReturned` is false.
   - Ending scene: when the ending is `hazels-grove` and `letThemGo` is set, queue
     `end-hazels-grove-open` instead of `end-hazels-grove`, then the epilogues and
     `end-hazels-grove-last` as usual (see the `end-hazels-grove` note).
   - Tests (`tests/sim/campaign.test.ts`, "decides endings from flags in priority order", plus a run test):
     1. Bonded Sable, `corvin` reconciled, `mossFaded` false, `finalChoice` free and `letThemGo` true →
        `hazels-grove`, and the scene seen is `end-hazels-grove-open`, not `end-hazels-grove`.
     2. The same with `keep` → `hazels-grove` via `end-hazels-grove`.
     3. `freedByForce` and `letThemGo` with a bonded Sable → `wild-grove` (checked before hazels-grove).
     4. A bonded Sable can never reach `long-road`: bargained → `shadow-keeper`; faded → `moss-sleeps`.
     5. `keptStone` → `collector`.
2. **Chapter 11's close waits for S9** (log-campaign E2; the same as log-side E1). Chapter 11 spans
   a few days. In `stepCampaign`, for chapter 11, don't queue `c11-close` when `threeFriends` is met
   unless S9 has had its chance: `s9-ask` is in `seen`, or `keptStone` is true (S9 can't start), or
   S9 is still on step 1 or 2 at the dusk after `threeFriends` is met. In that last case `c11-close`
   plays that evening, `c11-gate` is skipped, and S9 jumps to its dawn gate scene before `c12-open`,
   so an ignored S9 never holds chapter 11. The
   goal is to make `s9-ask`, `s9-word`, `c11-close` and `c11-gate` fall on one evening (the eve of
   chapter 12). So also don't offer S9's step-2 dusk check (`talk:corvin:gate:dusk-2`) until
   `threeFriends` is met. While chapter 11 is held, the journal hint should point at S9's current step.
3. **`c11-gate` condition** (log-campaign E3; the same as log-side E2). Queue `c11-gate` straight
   after `c11-close`, only if `s9-ask` has been seen (and so `s9Started` is set); never with
   `keptStone`. It no longer keys on `s9Started` alone. After it, S10's `s10-night` /
   `s10-night-told` (item 9 below), then chapter 12. S9's dawn gate scene still plays before `c12-open`.
4. **Variant routing** (log-campaign E4; new ids, full rules in the scene notes).
   - Chapter 9 opening: on the Collector route (`soldNubbin && !boughtBack`), use `c9-open-sold` in
     place of `c9-open`. In `applyChoice`, run the `c9-open` bargain side effect for `c9-open-sold` too.
   - Shard scene: `corvin` reconciled → `c9-shard-reconciled` (Collector route included); bargained →
     `-bargained`; forced → `-collector` on the Collector route, otherwise `-forced`.
   - `c5-considered`: queue straight after `c5-circuit` (before the race) if `corvinOffer === 'considered'`.
   - Chapter 11 Moss add-on: keep route → `c11-moss-kept`; Moss in the world on an unmade route →
     `c11-moss-here`; `c10-moss-fades` played → `c11-moss-passed`; `c10-bank-moss-gone` played →
     `c11-moss-gone`.
   - Walk epilogue: walk = moss → `end-epi-walk-moss-stayed` if `keptStone`, else `end-epi-walk-moss`.
5. **`chorus` speaker** (log-campaign E5). `CAMPAIGN_SPEAKERS` now includes `chorus` (name
   "Everyone", kind other). In `ui/dialogue.ts`, show chorus lines with no portrait, in italics, and
   give them no per-line voice clip (see "Songs are music cues" under Voice-over).
6. **`c11-close` after S8** (log-side hand-off H3; the line swap is in the `c11-close` note). When
   `s8Done` is true, `c11-close` swaps "The thin grey Nubbin wakes, looks at you, and goes back to
   sleep." for "Hazel's arm is empty now. She keeps it crooked anyway, out of habit."

### Side stories

7. **S19's window and version** (log-side E4). Open S19 in chapter 11 whenever `keptStone` is false.
   Pick the version:
   - **moss** if Moss is in the world (`mossReturned`, or the wisp route with `mossFaded` false).
     Play the scenes as written; `s19-warmth` sets `s19-with = moss`.
   - Otherwise **sable**, if Sable is bonded: play the `-sable` variants.
   - Otherwise **alone**: play the `-alone` variants, replacing `s19-warmth`, `s19-climb`,
     `s19-hollow`, `s19-question` and `s19-fade` (`s19-with = alone`).
   - `s19-marina`, `s19-sit`, `s19-after` and `s19-complete` are shared.
8. **S8's complete scene** (log-side E5).
   - Play `s8-complete-dawn` instead of `s8-complete` when `c10-bramble` has been seen.
   - Play either one inside chapter 11, before `c11-close`.
   - `src/content/index.ts` already exports `SIDE_STORIES_FUN_2_VARIANTS` (log-side hand-off H2).
     `tests/tools/content-check.ts` already reads it. Wire it into the side-story runner's variant
     lookup.
9. **S10 step 4's scene** (log-side E3). `s10-night` (with `hazel = secret`) or `s10-night-told`
   (with `hazel = told`) does not play when step 3's check is met. Hold it until `c11-close` (and
   `c11-gate`, if queued) has been seen on the eve of chapter 12, then play it before chapter 12
   begins. If S10 is still on wishes 1–3 at that point, the wishes lapse and this scene plays anyway.
10. **S10's walk choices** (log-side E10). Moss's letter `m` in `s10-foot-*` uses `c11-moss-here`'s
    "Moss in the world" test (see the S10 notes, variant 3), including the keep route when
    `mossFaded` is true. On the keep route walk = moss always ends in `end-epi-walk-moss-stayed`
    (item 4).
11. **S9 family count** (log-side E11; canon 27). Count six conditions: `corvin` = reconciled,
    `s3Done`, `s6Done`, `s8Done`, `millLetter` = kept and `visitors`. Two or more plays
    `s9-gate-family`.
12. **Chapter 5 and 6 openings** (log-side E6).
    - S5 triggers on the first morning after `c5-open`.
    - S11 and S15 trigger on later mornings, not S5's.
    - S4 triggers after `c5-close`, once `c6-open` has been seen.
    - Optional, for Maor: hold `c5-close` while S5 is open, since `c6-open` is Fossil's farewell
      and would end S5 unfinished.
13. **S3 opening** (log-side E7; canon 11). Activate S3 (journal entry) at `c4-close`. Its first
    scene, `s3-stands`, waits for the player's arrival at the Circuit after `c5-open`.
14. **The register on loan** (log-side E8). When `s18-centre = register` and S6 step 2 or S10
    step 1 starts:
    - place the register on the cottage table;
    - use the hint "Professor Delve has brought the register back from the museum. It's on the
      cottage table.";
    - for S6, swap `s6-fern` line 8 and `s6-register` line 0 as the S6 notes give them.
15. **S17 nursery payoff** (log-side E9). In `s17-complete`, insert one narrator line after
    index 2, chosen by `s17-nursery`; the texts are in the S17 notes.
16. **Reward ids** (log-side E12). If any runtime code keys on reward ids, use the renamed ones:
    `s6-whistle-reward`, `s10-letter-reward`, `s11-ladybirds-reward` and `s15-jackpot-reward`.
17. **Wisp's home** (log-side E13; canon 16). If spared or Sable's choice, Wisp's stray spot is
    under the cottage step once S2 completes.

### Fun quests and the audience setting

18. **Content setting** (log-fun E1 and log-mv 1; canon 20). Add a grown-up setting, Settings ›
    Content › "Mature content", with values **Off** (default), **13+** and **18+**.
    - Store it in the save (`sim/save.ts`) as, for example, `matureContent: 'off' | 'teen' | 'adult'`.
    - Show the control in `ui/settings.ts`. Never show it in a Learning Grove save.
    - Lowering the setting hides teen or adult quests that are in progress but keeps their progress.
    - Q31's trigger text names this setting. The Multiverse and the Atlas (teen pages) read the same
      setting.
    - Before the Multiverse rift first opens, show a one-time age confirmation that turns on `adult`
      (the Multiverse and It's Always Sunny) (log-mv 1).
    - The two logs named the setting differently; "Mature content" is used here. Maor picks the
      final name.
19. **Audience filter** (log-fun E2; log-mv 1). No sim or UI code reads `Quest.audience` today (content-check
    now rejects any non-`all` quest in a Learning Grove pack, log-fun hand-off H5). When fun quests, side stories and
    the other campaigns are wired in:
    - **Learning Grove:** offer only `audience === 'all'`. `main`, `teen` and `adult` never reach it.
    - **Main game:** always offer `all` and `main`. Offer `teen` only when `matureContent` is `teen`
      or `adult`, and `adult` only when it is `adult`.
20. **Fun-quest chapter block** (log-fun E3; canon 23). Never offer, start or advance Q1–Q65 while
    the campaign chapter is 9, 10 or 11. Every trigger's `when` now ends with that rule, but the sim
    must enforce it.
21. **`requires` on fun quests** (log-fun E4). It holds quest codes (`'Q46'`, `'Q31'`, `'Q32'`,
    `'Q56'`, `'Q64'`). A quest is offered only after every listed code is complete.
22. **Daily gifts** (log-fun E6, for awareness; canon 22). These read as "once a day" and need
    Maor's call against the no-timers rule: `sim/daily.ts` (header: "once a day a Keeper visits with
    a gift") and `sim/neighbourhood.ts` (lines 10 and 96: "a gift once per real day per neighbour").

### Multiverse and Neopia

23. **Neopia freebies** (log-fun E5; log-mv 7; canon 22; settled in the regression pass). Every
    freebie is one-time (one go per save, a fixed prize) or unlimited, in `results.ts`, the Neopia
    quests and Part G alike. Nothing resets per visit, per day or per Nubbin life. The Giant Omelette
    and Underwater Fishing are unlimited; the Soup Kitchen has no limit (it is need-based); Coltzan's
    Shrine and the Lab Ray are once per Nubbin, ever (rebirth does not reset them). `outcome:taken`
    means the one-time go is used. NQ32's Giant Jelly is granted once both `nq-32-done` and
    `np-line-complete` are set.
24. **Neopia plot order** (log-mv 2). In the main game each NP plot also waits for the previous NP
    plot available in that mode, on top of its `requires`: NP3 waits for NP2, NP6 for NP5, NP11
    for NP10 (NP7–NP10 already chain). In the Learning Grove only `all` plots exist, so `requires`
    alone gives NP1 → NP3 → NP4 → NP6 → NP11 → NP12 → NP13. Apply `childLines` there
    (`np04-feast#0`, `np13-broadcast#2`).
25. **E6 Eternal reflection** (log-mv 3; canon 21). When E6 opens, check other saves read-only
    (`has:nubbin:eternal`, Free Grove and Hazel's Grove). If one exists, create in the Multiverse
    save a reflection of the player's oldest living Eternal (same name, look and age). The
    `eternal` ending removes only that reflection. Never write any other save.
26. **E6 line inserts** (log-mv 4). New conditional insert in the E6 notes: if `mv-doom` = ally, add
    two lines after `mv-e6-trapscene#4` (indices before any other insert).
27. **Flags and checks renamed** (log-mv 5). `mv-mk-lantern` retired (MK8 now sets `mv-mk-sky`);
    `mv-sp` = 'complete' → `mv-sp-complete`; per-quest `mv-<code>` flags on every IM/FF/UL/MK/SP
    quest; check verbs `expedition:clear:mv-…` in the MK/SP lines; item `dubloon-grog` →
    `dubloon-pepper-sauce`; reward `nq31-sneak-unlock` (feature) → `nq31-hoard` (title);
    `nq32-giant-jelly` is now a one-time item granted when `np-line-complete` is first set.
28. **SP3/SP4 swap** (log-mv 6). Quest ids `mv-sp03` (now Overt-Kill) and `mv-sp04` (now Angela)
    and their scene and reward ids swapped content. Any save data or test fixtures keyed on the old
    ids need the same swap.
29. **script-book** (log-mv 8; log-fun hand-off H6). Regenerate `script-book/`
    (`tests/tools/script-book.ts`) once all the content changes are in; several pages still show
    old text.

## Suggested order (put this at the end of the PROGRESS.md section)

1. Fix the bugs: B1, B2, B3.
2. Foundations: OW23, OW1, OW2, OW4.
3. Story spine:
    1. CV1: swap in the campaign v2 and its sim changes (Part I). This also fixes B1.
    2. CV6: the engine backlog from the fix pass, done together with CV1, because the ending rules, the age setting and chapter 11's hold belong to the campaign wiring.
    3. Then S2, S9, S10, S13 and S19, the five side stories that change the campaign.
    4. Then the fun side stories (S1, S3–S8, S11, S12, S14–S18, S20–S22), with F1, F2, F3 and F8 as they are needed.
    5. CV2: the Learning Grove language switch (Part J), once CV1 is in.
    6. CV3: the Hebrew and Japanese questlines (Part K), after CV2. Book native-speaker recordings early.
4. World: OW7, OW25, OW11, OW9 and F5, then OW8 and F6 for lore.
5. Fun quests Q1–Q65: any time, in any order, as light breaks between story work.
6. The Multiverse campaign (Part F) after the Hazel's Grove story work. Build the gate and the save slot first, then one line end to end (Iron Man suggested) before the rest.
7. Neopia (Part G) alongside OW25: the Neo family and paint brushes first, then the lands as sections, then the Neopia line.
8. CV5's Grove side stories (S23–S31, Part M) alongside the other side stories once CV1 is in, because S23, S26 and S27 change the campaign. Then CV4, the Atlas (Part L), with Part M's Atlas pages and Pixel's Arcade, after the Multiverse gate and save slot exist, since it reuses them. Script and review first, book cultural advisers early, then build one line end to end (A8 or A9 suggested) before the rest.
9. When a quest or story is built, wire its script from `src/content/` rather than writing new dialogue. Readers replace `FORTUNE_LINES` and the doctor's raw numbers.
10. Everything else after Maor reviews.
