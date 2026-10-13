# CLAUDE.md — Grove (working title)

This file is the standing brief for this project. Read it at the start of every session, along with `PROGRESS.md`. If `docs/design.md` exists, it holds the human-readable version of this design. If it conflicts with this file, this file wins.

## What we're building

An original virtual-pet garden game that runs in phone and desktop browsers. You hatch a creature, raise it, and shape how it grows. It ages, and it either comes back reborn or gently moves on. You can enter it in races.

The game draws on the depth of classic 3D-platformer pet gardens. **The creatures are Chao-faithful fan art:** draw the Nubbins as close to Sega's Chao as possible, and put every Chao variant in the game (Maor's decision, 2026-10-12; the catalogue and its milestone mapping are in PROGRESS.md). **Two more families were added the same day at Maor's request:** the "pocket line" (the baby and fossil Pokémon of the first three generations and their evolutions) and the "digital line" (the original 1997 Digimon pet, Botamon through the Ultimates), drawn as chibi approximations by a generic creature drawer. The art is generated in code from memory, never from copied assets or sprite sheets. In-game names, logo, music and sound effects stay our own; the inspiration for each species is recorded in `sim/species.ts` as data and never shown. Reusing game mechanics is fine.

**Working names:**

| Thing | Name |
| --- | --- |
| Creature | Nubbin |
| Garden | Grove |
| Currency | Shells |
| Small animals | Critters |
| Stat crystals | Essences |
| Alignments | Sun / Moon / Neutral |
| Rare immortal form | Eternal |
| Player | Keeper (can switch between Sun Keeper and Moon Keeper) |

All names live in one strings file so they can be renamed later.

## How to work

- **One milestone per session.** Before you write code, give a short plan and wait for approval. Never start the next milestone without being asked.
- **Each milestone must pass its "done when" checks** before it counts as finished.
- **Before ending a session:**
  - Run `npm test` and `npm run build`. Both must pass.
  - Update `PROGRESS.md` with three parts: what works, what's stubbed, and known bugs.
  - Suggest a commit message.
- **Keep changes small.** Only edit the files the task needs, and don't rewrite working code without being asked.
- **When something is unclear,** ask one focused question. If you have to make an assumption, write it in `PROGRESS.md`.

## Tech stack (do not change without asking)

- **Language:** TypeScript with `strict` turned on.
- **Build tool:** Vite, with npm as the package manager.
- **3D engine:** Three.js, at an exact version pinned in package.json (no `^` or `~`).
- **Tests:** Vitest for anything in `sim/`. Use ESLint and Prettier.
- **UI:** plain HTML and CSS drawn over the game canvas. No React.
- **Hosting:** a static site with no server, deployed to Netlify, Cloudflare Pages or GitHub Pages.
- **Later only:** `vite-plugin-pwa` (milestone M5) and Capacitor (after v1).

## Architecture rules

```
src/
  config/tuning.ts   every tunable number lives here
  config/strings.ts  every player-facing name and text
  sim/               game rules only: NO DOM, NO Three.js imports
    types.ts rng.ts clock.ts world.ts nubbin.ts needs.ts stats.ts
    alignment.ts lifecycle.ts behavior.ts personality.ts race.ts
    economy.ts save.ts
  render/            reads sim state, never changes it
    pipeline.ts camera.ts grove-scene.ts race-scene.ts
    sprites/         pixel-art generator, palette, part layers, animations
  input/             pointer, touch gestures, keyboard → sends commands to the sim
  ui/                HUD, stats sheet, roster, shop, debug panel
  minigames/expedition/
  main.ts
tests/sim/
```

1. **Sim and render stay apart.**
    - The sim runs fixed steps, 10 per second. Rendering runs every frame and smooths movement between steps.
    - Only the sim changes game state. Input and UI send it commands; render and UI only read from it.
2. **One clock.** Every time-based system goes through `clock.ts`, which has a global time-scale setting from ×1 to ×1000.
3. **Offline catch-up.** On load, or when the tab becomes visible again, apply the player's "Aging while closed" setting (see Settings below) to the time that has passed.
    - Absences longer than a few minutes run in coarse 1-minute steps, so even days away finish in seconds on a phone. Show a progress indicator if catch-up takes longer than about 500 ms.
    - Record any evolutions, rebirths and departures during catch-up and show them on a "While you were away" screen.
4. **Seeded randomness.** All random numbers come from the seeded generator in `rng.ts`. Never call `Math.random()` in `sim/`.
5. **Saves.**
    - The save has a version number, with a migration function for each version change.
    - Autosave to localStorage every 30 s and when the tab is hidden.
    - Wrap every storage read and write in try/catch. If storage is unavailable, the game keeps running.
    - Offer export and import of the save as a JSON file.
6. **Future fields.** The Nubbin type already includes `genes`, `skills` and `karateRecord`, empty by default, so v2 needs no migration.
7. **Performance.**
    - Target 60 fps on a mid-range 2022 phone with 8 Nubbins; 30 fps is the floor.
    - Pause rendering when the tab is hidden.
    - Put sprites in texture atlases and keep draw calls low.

## Look and feel: 2.5D pixel art

- **The world** is low-poly 3D: grass, a pond, hills, 2 fruit trees and a waterfall. It uses small pixel textures and one shared 32-color palette (`render/sprites/palette.ts`).
- **The low-res render:**
  - Draw each frame into a target about 540 px tall (Maor chose the 64 px tier on 2026-10-13; sprites are designed on a 32 px grid and rasterised at 2×, see `PX` in `pixel-canvas.ts`), with its width set by the screen's aspect ratio.
  - Scale it up to fill the screen using nearest-neighbor filtering and `image-rendering: pixelated`.
  - Handle resizing and screen rotation.
- **Sprites** (Nubbins, the Keeper, items) are flat images that turn to face the camera around the vertical axis only.
  - Draw 5 angles: front, front three-quarter, side, back three-quarter and back. Mirror them for the other 3.
  - Generate the pixel art in code by drawing onto canvases, designed at 32×32 per frame for a Nubbin and rasterised at 64×64.
  - Build a Nubbin from layers: body, then 4 part slots (ears, tail, arms, back), then a face, then a hat.
  - Keep the loader able to accept hand-drawn sprite sheets later.
- **Animations:**
  - idle (2 frames)
  - walk (4 frames)
  - happy, sad, sleep, eat
  - swim and flap, for adults with high Swim or Fly
- **The Nubbin design (Chao-faithful):**
  - Small, round and huggable, with the proportions of a toddler. Big eyes, stubby limbs, tiny wings, a pointed crown on the head.
  - A floating emote ball above the head shows mood: a plain ball when content, a heart when happy, a spiral when dizzy or sad, an exclamation when surprised, a question mark when confused.
  - Child: light blue body with yellow-tipped head, hands and feet. **Sun** (Hero) forms go white and blue with a halo-like ball. **Moon** (Dark) forms go purple and black with a spiked ball. **Neutral** adults take their type's colour.
  - Every Chao variant is in scope: the 15 first evolutions, the 60 second evolutions, the three Chaos forms, the character Chao as unlockable looks, and the shiny, jewel and two-tone colour variants.
- **Camera:**
  - Orbits the Grove at a fixed downward angle of about 35°.
  - Rotates in 45° steps: Q/E on desktop, on-screen buttons or a two-finger swipe on phones.
  - Has 2 zoom levels: scroll wheel on desktop, pinch on phones.
- **Controls:**
  - **Phone:** tap the ground to move the Keeper there; tap a Nubbin or item to select it; drag to pick up and throw.
  - **Desktop:** WASD or the arrow keys move the Keeper; click to select; drag to pick up and throw.
  - An on-screen joystick is optional and off by default.
- **Tone:** cozy and kid-friendly. When a Nubbin departs it fades out softly, with no death imagery.

## Game systems (v1). All numbers are defaults that live in tuning.ts.

**Care**

- **Eggs:**
  - Start with 2.
  - Each hatches after 3 min; shaking it while held speeds this up.
  - More eggs are sold in the shop.
- **Handling:**
  - You can pick up, carry, pet, throw and put down a Nubbin.
  - Petting gives +5 happiness and some affection.
  - Dropping or throwing gives −10 happiness and reduces affection.
  - The Nubbin reacts visibly every time.
- **Hunger:** goes from full to starving in 20 min.
- **Energy:** lasts 40 min. When it runs out, the Nubbin naps for 3 min.
- **Happiness:** −100 to +100, starting at +20.
- **Affection:** 0 to 100, starting at 10.
- **Showing needs:** shown through the leaf, the face and mood bubbles. Number meters appear only on the stats sheet, which opens when you tap the Nubbin.
- **Fruit trees:** each tree drops 1 fruit every 4 min, and shaking a tree drops one sooner. Fruit fills hunger and adds Stamina points.
- **Behavior:** a state machine with these states: wander, find food, eat, nap, sit, play with a toy, greet the Keeper, cry, swim in the pond. Mood and personality change how likely each one is.

**Growth**

- **Stats:**
  - Swim, Fly, Run, Power and Stamina.
  - Each has a level from 0 to 99, and each level takes 100 points.
- **Grades:**
  - Each stat gets a grade from E to S at birth, weighted toward the low end.
  - The grade multiplies the points that stat earns: E ×0.8, D ×0.9, C ×1.0, B ×1.1, A ×1.2, S ×1.35.
- **Critters:**
  - 15 species, 3 for each type: Swim, Fly, Run, Power and Normal.
  - Giving one adds +30 points to its main stat and +10 to one other stat.
  - It also sets one or more part slots to that species' part (the newest critter wins) and nudges the type lean toward its type.
  - Parts carry over into adulthood.
- **Essences:** 5 colors, one per type. Each adds +50 points to its stat and nudges the type lean. They don't change parts.
- **Type lean:**
  - Five scores, one per type, built up from critters, essences and training.
  - At evolution the highest one wins, unless no type leads the next by 15% or more, in which case the adult is Normal.
- **Alignment:**
  - A hidden value from −1 to +1.
  - Every kind action moves it 0.01 toward the active Keeper: Sun toward +1, Moon toward −1.
  - Children show faint visual hints of where they're heading.
- **Personality:**
  - Cheerful, Shy, Mischievous or Lazy, decided by how the Nubbin was treated as a child and locked in at evolution.
  - It changes idle behavior only, never stats.

**Life cycle:** egg → child (60 min) → cocoon (30 s) → adult (5 h) → end-of-life check

- **Evolution:**
  - The adult form is its alignment band (Sun above 0.5, Moon below −0.5, otherwise Neutral) combined with its winning type. That gives 15 base forms, with critter parts on top.
  - On evolution, the highest-level stat that isn't already S goes up one grade, permanently. Mark this with a celebration moment.
  - The Sun Grove and Moon Grove unlock the first time an adult of that alignment appears. In v1 they are recolored versions of the main Grove.
- **End of life:**
  - **Rebirth:** if lifetime average happiness is +30 or more and affection is 40 or more, the Nubbin forms a glowing cocoon and is reborn as an egg. It keeps its name, 10% of its stat points, all grade upgrades and its affection memory, and its rebirth count goes up by 1. It greets the Keeper with a heart after hatching.
  - **Departure:** otherwise it forms a soft, fading cocoon and departs for good, leaving a memorial flower in the Grove.
- **Eternal:**
  - A Nubbin becomes Eternal if it has been reborn at least twice and then evolves as a Normal type with a strong alignment: above 0.8 (Eternal Sun), below −0.8 (Eternal Moon), or within 0.1 of 0 (Eternal Neutral).
  - Eternals never age. In v2, they won't be able to breed.
  - It must never happen unless all the conditions are met.

**Activities**

- **Expedition** (the source of Shells, Essences and Critters):
  - A 45–60 s side-scrolling dash in the same pixel style.
  - Tap to jump, hold to jump higher.
  - Collect Shells, pick up Essences, and rescue Critters from bubbles.
  - Hitting an obstacle costs Shells; it never ends the run.
  - A results screen sends the rewards to the Grove inventory.
- **Races:**
  - 3 courses, each built from sections: swim, fly over a gap, run, climb, and a stamina stretch. Each section checks the matching stat.
  - When Stamina runs out, the Nubbin takes a short rest pause.
  - Each course has 3 tiers with 4–8 rivals, generated from seeded stats that scale with the tier.
  - Cheer button: a small speed boost, at most once every 3 s.
  - Prizes are Shells and hats. Winning a tier unlocks the next one.
  - The race is shown from the side, with lanes stacked in depth. It must stay readable on a phone in portrait.
- **Shop:** fruit, eggs (with a small chance of rare colors), hats and toys.
- **Roster:** up to 8 Nubbins. Each has a name, portrait, stats, age, rebirth count and alignment shown as a word and an icon.

**Settings: Aging while closed** (a setting stored in the save and changeable any time from the Settings menu)

| Mode | Behavior |
| --- | --- |
| `indefinite` | Simulate all the time that passed. Nubbins can evolve or be reborn while the player is away, and can depart only if `allowOfflineDepartures` is on. |
| `capped` (default) | Simulate up to the number of hours the player enters. Accept whole numbers from 1 to 720 and default to 8. Validate the input and show an inline error for anything out of range. |
| `off` | Simulate nothing. The Grove's clock resumes from the saved timestamp. |

- During catch-up, Nubbins eat from the fruit trees on their own, so being away doesn't by itself starve them.
- Petting, critters and Keeper actions only happen during live play.
- The save stores `settings.offlineAging = { mode, capHours, allowOfflineDepartures }`.

**Settings: Allow departures while closed** (`allowOfflineDepartures`, on/off, default **off**)
- **When it's off:** if a Nubbin reaches end of life during catch-up, freeze its age right there and mark it `awaitingKeeper`. When the player is back in live play, run that Nubbin's end-of-life check with the full cocoon sequence on screen, so the player sees either outcome.
- **When it's on:** departures can happen during catch-up and are listed on the "While you were away" screen.
- **Either way:** evolutions and rebirths can always happen during catch-up.
- **Mode `off`:** the toggle has no effect, because no time passes while the game is closed. Show it disabled when the mode is `off`.

**Out of scope for v1** (data fields only, no features): karate, breeding and genetics, the kindergarten (classes, doctor, fortune teller), a pocket mode, online accounts, trading and cloud save.

## Debug panel (required from M1)

Open it with the backtick (`) key or a triple-tap on the logo. It needs:

- A time-speed control: ×1, ×10, ×100, ×1000.
- Buttons to give Shells, fruit, critters and essences.
- Force-evolve and force-end-of-life buttons.
- A view of hidden values: alignment, type lean, happiness, affection, and points for each stat.
- An FPS counter.
- A "reset save" button.

## Platform and accessibility

- **Browsers:** Chrome, Safari, Firefox and Edge on desktop; iOS Safari and Android Chrome on phones.
- **Layout:** works in both portrait and landscape. Every control must be usable with one thumb.
- **Tap targets:** at least 44 px.
- **Color:** never the only signal. Stats always get an icon and a label too.
- **Motion:** respect `prefers-reduced-motion`.
- **Sound:** starts muted and only turns on after the first tap or click.
- **Errors:** no console errors during normal play.

## Milestones

Each milestone ends with something playable on a phone.

**M0 Foundation**
- Project scaffold.
- Low-res render pipeline.
- A test scene with a ground plane, a tree and one camera-facing sprite, plus the 45° camera snap and zoom.
- FPS counter.
- Deployment to a static host.
- **Done when:** the deployed test scene runs at 60 fps on a phone.

**M1 Grove and first Nubbin**
- Sim core: clock, randomness, save/load, offline catch-up.
- A Settings menu with the "Aging while closed" setting and the "While you were away" screen.
- The Grove scene.
- The sprite generator, with all angles and animations.
- Keeper movement.
- Eggs, hatching and handling.
- Needs, fruit and the behavior state machine.
- The debug panel.
- **Done when:**
  - From a fresh load you can hatch, pet and feed a Nubbin within 60 s.
  - A reload restores the game exactly.

**M2 Growth**
- Stats, grades and the stats sheet.
- Critters and essences.
- Keeper switching and alignment.
- Evolution, with all 15 forms and the grade upgrade.
- Sun and Moon Groves.
- Unit tests.
- **Done when:** at ×100, a scripted mix of critters and actions produces the predicted adult form.

**M3 Life cycle**
- Aging.
- Rebirth and departure.
- Eternal.
- Unit tests that run a full life at ×1000.
- **Done when:** egg → adult → rebirth → adult keeps everything correctly, and Eternal follows the rules exactly.

**M4 Expedition and shop**
- The Expedition minigame.
- The shop.
- Critter inventory and giving critters.
- **Done when:** a run is fun on a phone and its rewards reach the Grove.

**M5 Races, personality, polish**
- Races.
- Personality.
- The roster, naming and hats.
- Install-to-home-screen web app (PWA).
- Sound.
- Reduced-motion support.
- A device test pass.
- **Done when:** every acceptance check below passes.

## Acceptance checks for v1

**Automated tests (Vitest):**
- Grade multipliers.
- The 99 level cap.
- 10% carried over on rebirth.
- The type-lean and alignment thresholds that decide the adult form.
- A full life at ×1000.
- Eternal happens when its rules are met and never otherwise.
- Save export → import gives an identical world.
- Older save versions migrate correctly.
- Aging while closed works correctly in all three modes: `indefinite` simulates the full gap, `capped` stops at the entered hours, and `off` simulates nothing.
- A 7-day `indefinite` catch-up finishes in under 3 s.
- With `allowOfflineDepartures` off, no departure ever happens during catch-up. A Nubbin that reaches end of life while the player is away waits, and its check runs once live play resumes.

**Manual checks:**
- iPhone Safari, both in the browser and installed to the home screen.
- Android Chrome.
- Desktop Chrome, Safari and Firefox.
- 60 fps with 8 Nubbins.
- Blocked storage doesn't crash the game.
- No console errors.
- No names, art or audio from an existing franchise.
