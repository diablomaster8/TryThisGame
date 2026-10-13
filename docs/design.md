# Grove Pet Game — Design Doc

Oct 12, 2026 · @Maor

## Overview and goals

We are building an original virtual-pet garden game for phone and desktop browsers. It captures the depth of the classic Sonic Adventure Chao Garden: hatch a creature, raise it, shape how it grows, race it, and see it reborn. Version 1 delivers the core raising loop in a 2.5D pixel-art garden you can walk around. Later versions add karate, breeding and the kindergarten.

**v1 goal:** a game that is fun to check on daily, runs smoothly on any recent phone, and is built so later features slot in without rewrites.

**Success criteria for v1**

- You can hatch, pet and feed a creature within 60 seconds of first opening the game, on an iPhone or on desktop.
- One creature can be taken through its whole life — egg, child, adult, rebirth — and its stats, looks and alignment carry over correctly.
- It holds 60 fps on a mid-range phone (30 fps minimum) with 8 creatures in the garden.
- Every name, design and sound is original. Nothing is copied from Sega or any other franchise.
- It is built in Claude Code over five milestones, one focused session each where possible.

## Creative direction

The game looks like a chunky 3D world drawn in crisp pixel art. The creature is our own design, a seed-sprout pet called a **Nubbin** (working name).

**The creature**

- Small, round and huggable, with about the proportions of a toddler. It is built from a few simple shapes so it reads well on a phone.
- A leaf or bud on its head shows its mood: perky and bright when happy, drooping and dull when sad or hungry.
- Big eyes and stubby limbs. Four slots can change shape: ears, tail, arms and back. Critters fill these slots with parts like fins, feathers, horns and paws.
- **Sun** forms are warm and bright, with a ring of petals. **Moon** forms are cool and dark, with a crescent leaf. **Neutral** forms stay green.

**The 2.5D pixel look**

- **The world is simple low-poly 3D** — grass, a pond, hills, trees and a waterfall — with small pixel textures and a limited 32-color palette.
- **Creatures, the keeper and items are flat pixel sprites** that turn to face the camera. Each one is drawn from 5 angles (front, front three-quarter, side, back three-quarter, back) and mirrored to cover all 8 directions.
- **Each frame is rendered at about 540 pixels tall, then scaled up without smoothing.** This gives the crisp retro look, and it keeps the game fast on phones because there are about a tenth as many pixels to draw.
- **The camera circles the garden in 45° steps** at a fixed downward angle, with two zoom levels. Snapping to 45° keeps the sprite angles lined up with the camera.

**Tone:** cozy, gentle and kid-friendly. When a Nubbin isn't reborn, it drifts away softly and leaves a memorial flower. Nothing in the game shows death.

**Names (all working titles, easy to rename):** the garden is the **Grove** · the currency is **Shells** · the small animals are **Critters** · the stat crystals are **Essences** · the rare immortal form is **Eternal** · the player is a **Keeper**, who can switch between Sun Keeper and Moon Keeper.

## Tech stack and architecture

The game is built in TypeScript with Three.js and bundled with Vite, as a static site with no server. The rule that matters most: the game logic (sim) is kept completely separate from the drawing code (render).

&#91;embedded content: architecture · sim at the center\]

Input only sends commands to the sim. The UI and save layer read state and send commands back. Render only reads. Because of this split, the art style can change without touching the game rules.

| Layer | Choice | Why |
| --- | --- | --- |
| Language | TypeScript, strict mode | Catches mistakes in a game with a lot of interlocking state |
| 3D engine | Three.js, exact version pinned | Built-in support for low-res rendering, crisp scaling and camera-facing sprites |
| Build tool | Vite | Instant reloads, and a `--host` flag for testing on your phone |
| Unit tests | Vitest | Tests the game rules (sim) without a browser |
| Interface | Plain HTML and CSS drawn over the game canvas | Sharp text, accessible, and easy for Claude Code to change |
| Hosting | Netlify, Cloudflare Pages or GitHub Pages | Free static hosting, with a preview link for every change |
| Later | vite-plugin-pwa, then Capacitor | Add to home screen, then App Store and Play Store builds |

**Folder layout**

```
src/
  config/tuning.ts      every number you might tune, in one place
  sim/                  game rules only: no DOM, no Three.js
    types.ts  rng.ts  clock.ts  world.ts  nubbin.ts  needs.ts
    stats.ts  alignment.ts  lifecycle.ts  behavior.ts  personality.ts
    race.ts  economy.ts  save.ts
  render/               reads sim state, never changes it
    pipeline.ts         low-res target + crisp upscale
    camera.ts  grove-scene.ts  race-scene.ts
    sprites/            pixel-art generator, palette, parts, animations
  input/                pointer, touch gestures, keyboard
  ui/                   HUD, stats sheet, roster, shop, debug panel
  minigames/expedition/
  main.ts
tests/sim/              lifecycle, grades, Eternal rules, save round-trip
```

**Key rules**

1. **Fixed-step sim.** The game rules update 10 times a second in fixed steps. The renderer draws every frame and smooths movement between steps. A global time-scale setting (×1 to ×1000) speeds everything up for testing.
2. **Offline catch-up.** When you return, the game simulates the time you were away according to the player's "Aging while closed" setting (see Game systems). Long absences run in 1-minute steps, so days away still load in a few seconds. Evolutions, rebirths and departures that happened while you were gone appear on a "While you were away" screen.
3. **Seeded randomness.** Every random roll comes from a seeded generator, so races and appearance rolls can be replayed exactly.
4. **Saving.**
   - The save format is versioned, with an upgrade step for each new version.
   - It saves to the browser automatically every 30 seconds and whenever you leave the tab, with errors caught so a storage problem never crashes the game.
   - You can export and import your save as a JSON file.
5. **Performance.**
   - Pause drawing when the tab is hidden.
   - Keep draw calls low by packing sprites into texture atlases.
   - Cap the pixel ratio, since the low-res render does the heavy lifting.
6. **Fields for later features from day one.** The creature data already has empty fields for genes, learned skills and karate record, so v2 features need no save migration.

## Game systems

Version 1 includes every mechanic below. All numbers are starting values that live in `tuning.ts`, so they can be adjusted after playtesting.

**Care and needs**

| System | How it works | Starting values |
| --- | --- | --- |
| Eggs | You start with 2. Shaking an egg gently speeds up hatching. More are sold in the shop. | Hatches after 3 min |
| Handling | Pick up, carry, pet, throw, put down. Petting raises happiness and affection; throwing or dropping lowers both. | Pet +5 happiness · drop −10 |
| Hunger | Rises over time. A hungry Nubbin looks for fruit, and its leaf droops. | Empty to starving in 20 min |
| Energy | Falls over time. When it runs out, the Nubbin sits and naps. | Lasts 40 min · naps take 3 min |
| Happiness | Ranges from −100 to +100. Shows on the face, the leaf and a mood bubble. | Starts at +20 |
| Affection | Ranges from 0 to 100. Tracks how attached it is to the Keeper, and grows when you play and interact. | Starts at 10 |
| Fruit trees | Trees drop fruit on their own, or you can shake them. Fruit fills hunger and raises Stamina. | 1 fruit every 4 min per tree |

**Growth**

| System | How it works | Starting values |
| --- | --- | --- |
| Stats | Swim, Fly, Run, Power and Stamina. Each has a level from 0 to 99, and each level takes 100 points. | — |
| Grades | Each stat gets a grade from E to S at birth, usually a low one. The grade multiplies all points that stat earns. | E ×0.8 · D ×0.9 · C ×1.0 · B ×1.1 · A ×1.2 · S ×1.35 |
| Critters | 15 species, 3 for each type: Swim, Fly, Run, Power and Normal. Giving one adds stat points, changes a body-part slot (the newest critter wins) and nudges the Nubbin toward that critter's type. | +30 points to the main stat, +10 to one other |
| Essences | One crystal for each type. Each adds stat points and nudges the Nubbin's type, but doesn't change any body parts. | +50 points |
| Type lean | A 5-way score built up from critters, essences and training. The highest type at evolution becomes the adult's type. | Normal wins if no type leads by 15% |
| Alignment | A hidden value from −1 to +1. Every kind action moves it toward whichever Keeper is active, Sun or Moon. A child shows faint hints of where it is heading. | Each action moves it 0.01 |
| Personality | One of four traits forms from how it's treated as a child: Cheerful, Shy, Mischievous or Lazy. A trait changes idle behavior only, never stats. | Locked in at evolution |

**Life cycle:** egg → child (60 min) → cocoon (30 s) → adult (5 h) → end-of-life check.

- **Evolution.** The adult form is its alignment (Sun, Moon or Neutral) combined with its leading type, which gives 15 base forms. Critter parts are added on top. The highest stat that isn't already S goes up one grade, permanently.
- **New gardens.** The Sun Grove and Moon Grove unlock the first time an adult of that alignment appears.
- **Rebirth.** A Nubbin is reborn if its average happiness over its life is +30 or more and its affection is 40 or more. It enters a glowing cocoon and hatches from a new egg with the same name, 10% of its stat points, all grade upgrades and its memory of the Keeper.
- **Departure.** If it falls short, it drifts away in a soft fading cocoon and leaves a memorial flower behind.
- **Eternal.** A Nubbin that has been reborn at least twice and then evolves as a Normal type with a strong alignment becomes an Eternal: alignment above 0.8 for Sun, below −0.8 for Moon, or within 0.1 of zero for Neutral. Eternals never age, and will not be able to breed once breeding arrives in v2.

&#91;embedded content: Nubbin life cycle · 4 stages, 3 outcomes\]

Well loved means average lifetime happiness of +30 or more and affection of 40 or more. Only the Eternal path leaves the cycle for good.

**Setting: Aging while closed.** The player chooses what happens to time while the game is closed. It can be changed any time in Settings, and is saved with the Grove.

| Option | What happens while the game is closed |
| --- | --- |
| Indefinitely | All the time away counts. Nubbins can evolve or be reborn while you're gone, and can depart only if the toggle below is on. |
| Up to X hours (default) | Time counts up to a cap the player types in, from 1 to 720 hours. The default is 8, so a night away counts. |
| Not at all | The Grove pauses when you close the game and picks up exactly where you left off. |

While you're away, Nubbins feed themselves from the fruit trees, so being away doesn't make them go hungry on its own. Petting, critters and Keeper actions still only happen when you play.

**Setting: Allow departures while closed** (on/off, default **off**). When it's off, no Nubbin can leave for good while the game is closed. A Nubbin that reaches the end of its life while you're away stops aging and waits for you. When you return, its end-of-life check runs while you watch, so you're there for either outcome. Evolutions and rebirths still happen while you're away either way. The setting only matters when time passes while the game is closed (Indefinitely or Up to X hours).

**Activities**

- **Expedition** (where Shells and Critters come from). A 45–60 second side-scrolling dash played with one thumb: tap to jump, hold to jump higher. You collect Shells, pick up Essences and rescue Critters in bubbles. Hitting an obstacle costs Shells instead of ending the run.
- **Races.**
  - **Courses:** three, each made of swimming, flying, running, climbing and stamina sections. Each section uses the matching stat, and when Stamina runs out the Nubbin stops for a short rest.
  - **Tiers and rivals:** three difficulty tiers per course, with 4–8 computer-controlled rivals.
  - **Cheering:** tapping Cheer gives a short speed boost, at most once every 3 seconds.
  - **Prizes:** Shells and hats. Winning a tier unlocks the next one.
- **Shop.** Sells fruit, eggs (with a chance of rare colors), hats and toys the Nubbins play with in the Grove.
- **Roster.** Up to 8 Nubbins per Grove. Each one has a name, portrait, stats, age, rebirth count and alignment.

## Build plan

The build is split into six milestones, M0 to M5. Each one ends with something you can play on your phone, and each one must pass its checks before the next one starts. M0 and M1 carry the most risk, because they prove the look runs well on a phone.

**M0 — Foundation**

1. Set up the project: Vite, TypeScript in strict mode, Three.js and Vitest, plus ESLint and Prettier.
2. Build the low-res render pipeline: draw each frame at about 540 pixels tall, scale it up crisply to fill the screen, and handle window resizes and phone rotation.
3. Add a test scene with a ground plane, one tree and one camera-facing sprite, with the camera rotating in 45° steps and zooming.
4. Add an FPS counter, then deploy to a static host so you can test on your phone.

- **Done when:** the test scene runs at 60 fps on your phone, from a deployed link.

**M1 — Grove and first Nubbin**

1. Build the sim core: types, seeded randomness, the fixed-step clock with time scale, the world, saving and loading, offline catch-up, and a Settings menu (Aging while closed, Allow departures while closed) with the "While you were away" screen.
2. Build the Grove scene: grass, pond, hills, two fruit trees and a waterfall prop, with pixel textures.
3. Build the sprite generator: draw the Nubbin's body and four part slots as pixel art in code, from 5 angles, with idle, walk, happy, sad, sleep and eat animations.
4. Add the Keeper: tap to move on phones, WASD or the arrow keys on desktop, and an optional on-screen joystick.
5. Add interactions: eggs and hatching, pick up, carry, pet, throw and put down, with reactions.
6. Add needs and food: hunger, energy and happiness, plus a behavior state machine (wander, find food, eat, nap, sit, play).
7. Add the debug panel: time-speed slider, give items and view hidden values. Open it with the \` key or a triple-tap.

- **Done when:** from a fresh load you can hatch, pet and feed a Nubbin in under 60 seconds, and a reload brings everything back exactly as it was.

**M2 — Growth**

1. Add stats, grades and the stats sheet.
2. Add the 15 critters, which change stats, body parts and type lean, and the 5 essences.
3. Add the Sun/Moon Keeper switch, the alignment value and its visual hints on children.
4. Add evolution: the cocoon, the 15 adult forms, the permanent grade upgrade and the celebration moment.
5. Unlock the Sun Grove and Moon Grove as recolored versions of the main Grove.
6. Write unit tests for the stat math, the type-lean thresholds and the evolution result.

- **Done when:** at ×100 speed, giving a child a set mix of critters and Keeper actions produces the adult you'd predict.

**M3 — Life cycle**

1. Add aging and the end-of-life check.
2. Add rebirth (glowing cocoon, same name, 10% of stats, grade upgrades and memory kept) and departure (fading cocoon, memorial flower).
3. Add the Eternal rules and its special moment.
4. Write unit tests that run a full life at ×1000 speed and check Eternal happens with the rules met and never without them.

- **Done when:** a Nubbin goes egg → adult → reborn → adult with everything carried over correctly.

**M4 — Expedition and shop**

1. Build the Expedition side-scroller in the same pixel style: jump, collect, rescue critters, results screen.
2. Build the shop, with Shells as the currency, and spend the Expedition rewards there.
3. Add the critter inventory and a give-critter interaction.

- **Done when:** one Expedition run is fun on a phone, and its rewards flow into the Grove.

**M5 — Races, personality, polish**

1. Add the race sim, the race scene viewed from the side with lanes in depth, the 3 courses with 3 tiers each, cheering and prizes.
2. Add the four personality traits and their idle behaviors.
3. Add the roster screen, naming and hats.
4. Make it installable to the home screen as a web app, add sound (muted until you tap) and support reduced motion.
5. Do a full test pass on real devices (see Testing).

- **Done when:** every v1 acceptance check passes.

## Working with Claude Code

Plan on one milestone per Claude Code session. Each session starts with an empty conversation; `CLAUDE.md` and a short progress log carry everything forward from the last one.

**One-time setup**

1. Create a project folder (for example `grove-game`) and run `git init` in it.
2. Put `CLAUDE.md` in the folder. Export this doc as Markdown and save it as `docs/design.md`.
3. Open Claude Code in that folder and start M0 in plan mode: "Read CLAUDE.md and docs/design.md. Plan M0 only." Check the plan, then let it build.

**Every session**

1. Run `/clear`, then: "Read CLAUDE.md and PROGRESS.md. We're on M\<n>. Plan first."
2. Approve the plan, let it build, and let it run the tests and fix any failures.
3. Test on your phone (below), then send all your notes in **one** message.
4. Finish by having Claude update `PROGRESS.md` (what works, what's stubbed, known bugs), then commit and tag the milestone.

**Testing on your phone**

- **On the same Wi-Fi:** run `npm run dev -- --host` and open the network address it prints on your phone.
- **Anywhere:** push to GitHub and the host builds a preview link automatically.

**Saving usage**

- **Model choice:** use the stronger model for M0 and M1 (the architecture and render pipeline) and for hard bugs. A lighter model is fine for UI, content and polish.
- **Undo, don't rebuild:** if a change goes wrong, revert it with git instead of asking for it to be redone.
- **Point at files:** name specific files ("look at sim/lifecycle.ts") instead of asking it to search the whole project.
- **Reuse this doc:** for design questions, come back here or to Cowork rather than spending Claude Code sessions on them.

## Testing and acceptance

v1 ships when every box below is checked on real devices.

**Automated tests (Vitest, run every session)**

- [ ] Stat math: grade multipliers, levels capped at 99, the 10% carried over on rebirth
- [ ] Evolution: type-lean thresholds and alignment bands give the expected adult form
- [ ] A full life at ×1000 speed: egg → adult → rebirth → adult, with grade upgrades kept
- [ ] Eternal happens when its rules are met and never when they aren't
- [ ] Saving: export then import restores an identical world; old save versions upgrade cleanly
- [ ] Aging while closed works in all three modes: indefinitely, capped at the entered hours, and not at all. With departures turned off, no Nubbin leaves for good while you're away. It waits, and its end-of-life check runs when you return

**Devices to test by hand**

| Device | Browser | Checks |
| --- | --- | --- |
| iPhone | Safari, and installed to the home screen | Touch controls, 60 fps, audio unlocks on first tap, save survives a reload |
| Android phone | Chrome | Touch controls, frame rate, portrait and landscape |
| Desktop | Chrome, Safari, Firefox | Keyboard and mouse, window resizing, debug panel |

**v1 acceptance**

- [ ] Hatch, pet and feed within 60 seconds of a fresh load
- [ ] 60 fps on a mid-range phone with 8 Nubbins in the Grove (30 fps minimum)
- [ ] Turning off or blocking browser storage doesn't crash the game
- [ ] No errors in the browser console during a full play session
- [ ] Every tap target is at least 44px; color is never the only signal; reduced motion is respected
- [ ] No names, art or audio from an existing franchise

## Roadmap after v1

After v1, the plan is to finish matching the original's features, then improve on them.

| Version | Adds | Notes |
| --- | --- | --- |
| v2 | Karate tournaments, breeding and genetics | Breeding: flowers show when a Nubbin is ready, and grades, colors and parts are inherited. Eternals can't breed. |
| v2.5 | Kindergarten | Classes teach skills like dancing, music and drawing. A doctor shows hidden values. A fortune teller renames Nubbins. |
| v3 | Pocket Grove | A tiny take-anywhere garden mode for quick check-ins on your phone |
| v3+ | Original improvements | More gardens, seasons, cosmetics, music. Ideas to collect as you play. |
| Store release | Capacitor app builds | App Store and Play Store, with optional cloud save and trading |

## Risks and open decisions

The biggest risks are pixel art drawn in code looking flat, and Safari deleting saves. Both have a planned fallback.

| Risk | What could happen | Fallback |
| --- | --- | --- |
| Art made in code | The generated sprites may look plain or flat | Hand-drawn sprite sheets (made in Aseprite) can be swapped in, because sprites already load as layered parts |
| Safari clearing storage | Safari can wipe a website's saved data after about a week if the site isn't visited | Encourage installing to the home screen, show an export-save reminder, add cloud save later |
| Scope creep | v2 features drift into v1 and it never ships | Hold milestones fixed. New ideas go into the roadmap table, not the current milestone. |
| Timing feels wrong | Real-time life cycles may feel too slow or too fast | Every duration lives in `tuning.ts`; adjust after a week of play |
| Using up the Claude allowance | A milestone runs over a session | One milestone per session, start each with an empty conversation, keep progress in PROGRESS.md, revert with git instead of rebuilding |
| IP | Designs drift toward the original Chao | Keep original designs and names, and review sprites against this doc |

**Open decisions**

- [ ] Final names for the game and the creature
- [ ] Should Nubbins age while the app is closed? Decided: the player picks Indefinitely, Up to X hours or Not at all (see Game systems).
- [ ] Snap the camera in 45° steps (the plan) or allow free rotation?
- [ ] Hosting: Netlify, Cloudflare Pages or GitHub Pages
