# Log: A29 The Honmoon

File: `src/content/atlas-a29.ts`. It exports `ATLAS_A29`, `ATLAS_A29_VARIANTS`, `ATLAS_A29_FLAGS` and `ATLAS_A29_CHECKS`.
`tsc` (strict, with the brief's flags) and `eslint` pass with no output. A self-check script (scratchpad, adapted from A19's)
finds 0 problems: ids are unique, every `requires` resolves, every `who` is declared, lines are at most 160 characters,
narrator lines are at most two sentences, step scenes have 6–16 lines, and the flag and check lists are exact. It also
scans for banned song titles and words.

## Counts

- Quests: 16 (A29-1 to A29-16), audience `all`, chained by `requires`.
- Steps: 37 (2–3 per quest).
- Scenes: 98 (81 in the quests, 17 variants).
- Lines: 514, counting choice `then` lines.
- Choices: 29 choice points with 62 options. Every quest has at least one.
- Checks: 37, all using existing verbs and all prefixed `a29-`.

## Lifted text

None. All dialogue is original. There are no lyrics, no melodies and no song titles anywhere:
- The harsh song and Rumi's own song have no names, and are described only as music.
- The film's sealed barrier is called "the gold seal" or "the Honmoon made gold". The film's own adjective is also a song title, so it isn't used.
- The checker greps for the film's song titles.

## Flags

- **Read (Grove, read-only):**
  - Sable's trust stage, read once when A29-1 starts:
    - t45 plays `a29-01-sable-hid`.
    - bonded plays `a29-01-sable-heel`.
    - none or t20: nothing plays.
  - `s24Done` plays `a29-01-margin-hazel`.
- **Written (Atlas save only):**
  - `a29-01` to `a29-16`, and `a29-done`.
  - `a29-sable` = hid | heel.
  - `a29-sleeve` = jacket | saw | away (the A29-6 signature choice).
  - No Grove flag is written.

## Variants (`ATLAS_A29_VARIANTS`)

- **Sable at hid:** she hides under the stage (Q2), behind the noodle pans (Q3), in the store room (Q11) and in the wall's shade with Sussie (Q16). These scenes are additive beats that play straight after a named scene.
- **Sable at heel:** she stays by you in the crowd with her ears up (Q14), and lies in the sun mid-pavement while the fans step round her (Q16).
- **Luna in the Grove:**
  - `a29-grove-luna-heel` uses the outline's line verbatim.
  - `a29-grove-luna-hid` is adapted (see Changes).
- **The sleeve (Q6), paid off in Q12, Q14 and Q16.** The base scenes are the jacket path, and `-saw` and `-away` replace them:
  - Q12: `a29-12-find`.
  - Q14: `a29-14-song-done`.
  - Q16: `a29-16-complete`.
- **Hazel's margin note:** `a29-01-margin-hazel`.

## SIM needs

- The Atlas reads Sable's trust stage and `s24Done` from the Grove, read-only, as A16 and A18 do. The Grove's Luna scene reads the Atlas flag `a29-sable`, read-only.
- **The Honmoon ribbon:** a light along the fence that you can toggle after dark.
- **The minhwa screen:** cottage decor.
- **The stage light:** a decor item you can toggle.
- **The noodle-cup hat:** a cosmetic.
- **The magpie petpet:** leaves a leaf "letter" when the Grove loads after any absence. It's decorative only: no timer and no reward.

## Rewards (all one-time)

- Stage light (Q2).
- Noodle-cup hat (Q3).
- Honmoon ribbon, tiger-and-magpie screen and magpie petpet (Q16).

## Changes from the outline, and why

- **The film's adjective for the sealed Honmoon is never used.** It is a song title, and the task bans song titles entirely.
- **The jacket in Q6 is the Keeper's own.** That way Rumi can "give it back" in Q12.
- **Luna's line for the hid stage is adapted:** "...and came home. Hiding still counts as going." The outline's line ("and didn't hide?") only fits bonded Sable, so the heel variant uses it verbatim.
- **Q14's coat beat (jacket path) is told in the step 2 done scene.** It says she handed you the coat on her way in. All three sleeve payoffs in Q14 then sit at one variant point.
- **Bonded Sable gets beats only where the outline names them (Q14, Q16).** The art shows her at your heel throughout.
- **Q12 has three steps:** Mira and Zoey leave, Rumi finds you (the sleeve payoff), then the roof with Jinu. Gwi-Ma rises in the complete scene.
- **No Learning Grove (edu) version is in this file**, following A11 and A19. The outline wants a softened reader-band version, which is still to do.

## For Maor

- **Licence.** The page can't ship without a licence from Sony Pictures Animation and Netflix. The character names are theirs.
- **Korean advisers** should review dress, food (ramyun, triangle gimbap, bungeoppang, boricha, pears in foam nets), places (a Bukchon-style hanok, the Naksan city wall) and words. Specifically:
  - Zoey's explanation that the jeoseung saja are dutiful escorts of the dead, not villains (A29-5).
  - How the gat is drawn.
  - The minhwa spirit of Derpy and Sussie.
- **The tiger-and-magpie screen** needs a Korean artist working in the minhwa style.
- **Your call:** Gwi-Ma speaks five short lines (A29-10, A29-12, A29-15). If you'd rather he stayed a wordless fire, those lines become narration.
