# Hollow Below: cave graphics recommendations (2026-10-21)

These are recommendations only; none of them is built yet. The references are Palworld's
dungeons, Pokémon Scarlet/Violet (Area Zero and the Indigo Disk Underdepths, the Crystal Pool,
Kitakami's caves) and Legends: Arceus (Wayward Cave, Primeval Grotto). Costs are S, M or L.

## Where it stands

- **Layout** (`sim/dungeon.ts`): a cellular-automata cave on a 34×24 grid, growing to at most
  54×36, with 1.5-unit cells. There are 4–7 rooms of 6–11 × 5–8 cells, joined by 1–2-cell
  corridors. No room stands out: no landmark, no vista, no change in height.
- **3D** (`render3d/hollow.ts`):
  - Walls are 2.4-unit noise-bent boxes, with the rock texture projected along one axis per
    face.
  - Torches are a post with an emissive cone, and crystals are three octahedra. Neither is
    instanced.
  - There are four point lights: the Keeper's lamp and the nearest three torches.
  - The fog and background are near-black. Bloom depends on the Grove's hour, not on being
    underground.
- **Pixel mode** reads much better: blue-lit flagstone, a cyan rim on the wall lips, moss, and
  torch glows baked into the floor. Its walls are thin, low ledges, though.

**Diagnosis:** the 3D Hollow is too dark, too low, too uniform in colour and too even in size.
The AAA caves get their look from four things:

- vertical scale;
- one strong colour accent per area;
- many cheap fake lights and a few real ones;
- landmark chambers.

## Critical

1. **Walls 2–3× taller, leaning in like a cave mouth.**
   - Reference: the tall chambers of the Area Zero Underdepths; the vaulted halls of
     Palworld's dungeons.
   - How: move `WALL_H` from 2.4 to `GROVE3D.cave.wallHeight` at about 5–6, and push the top
     vertices outward with noise. The existing cutaway already handles occlusion.
   - Perf: free. Cost: S.
2. **A cave light rig instead of near-black.**
   - Reference: the caves in Legends: Arceus and Scarlet/Violet sit at a cool, readable
     mid-tone with warm accents.
   - How: a cool violet-over-warm-brown hemisphere light at 0.5–0.7, exposure about 0.85, a
     deep teal fog (#16222e) so distance fades into colour rather than void, and a slightly
     higher environment intensity.
   - Perf: free. Cost: S.
3. **Bloom always on underground.**
   - Reference: the emissive glow of Terastal crystals; Palworld's glowing ore.
   - How: set `bloomWanted = true` (strength about 0.5) in the cave branch, whatever the sun's
     height. The governor can still drop it.
   - Cost: S.
4. **Bigger floors, with three sizes of space.**
   - Reference: the Underdepths' large chambers joined by tunnels; Palworld's hub chamber with
     side rooms.
   - How:
     - one great chamber per floor, 16–22 × 12–16 cells, with an ellipse-plus-noise edge;
     - 2–4 medium rooms;
     - corridors 2–3 cells wide;
     - a base grid of about 48×34, growing to at most 72×48;
     - a `genVersion` on the run, so saved runs keep their old floors.
   - Cost: M.
5. **Bake the torch and crystal light into floor and wall vertex colours.**
   - Reference: the pixel mode already does this; classic fake GI.
   - How: a warm orange falloff around each torch and a cyan one around each crystal, added on
     top of the AO. Every torch then gets a light pool, not just the nearest three.
   - Perf: zero at runtime. Cost: S.
6. **Torches as wall sconces, with a flame sprite and a halo.**
   - Reference: the wall torches and lanterns in Palworld's ruin dungeons.
   - How: mount each torch on the wall face at 1.8–2.2 height, on an iron bracket. Draw the
     flame as a 4-frame additive billboard and add a soft additive halo (`glow.ts`). Instance
     everything: 3 draw calls in total.
   - Cost: M.
7. **A better light budget.**
   - How: keep 4 real point lights, set the torch lights to distance about 12 with decay 2, and
     cross-fade a light when it moves to another torch so the swap never pops.
   - Cost: S.
8. **A colour script by depth.**
   - Reference: Area Zero's shift from grass to teal to crystal; Palworld's lava and ice
     dungeons.
   - How: a `GROVE3D.cave.bands[]` table, each band with its own fog, hemisphere, rock tint,
     moss and crystal colours. For example:
     - floors 1–5: mossy earth;
     - floors 6–10: blue crystal grotto;
     - floors 11–15: amber fungus cavern;
     - floors 16–20: pastel prism depths.
   - Mirror the bands in the pixel painter. Cost: M.

## High

9. **True triplanar rock.**
   - How: a 3-sample blend weighted by `pow(abs(n), 4)`, so the tall walls have no seams.
   - Perf: 3× texture fetches on the rock only; the governor can drop it to one sample.
   - Cost: M.
10. **Strata bands.**
    - Reference: the layered rock in Legends: Arceus.
    - How: `sin(worldY·k + noise)` in the rock shader, with a pale stripe every few units.
    - Cost: S.
11. **Edge wear.** Brighten ridges and lips from the up-facing normal term, for a hand-painted
    look. Cost: S.
12. **Moss and fungus creeping up from the wall foot,** and onto faces that look toward water.
    - Reference: Legends: Arceus grottos. Cost: S.
13. **A wet sheen near water, with drip streaks.**
    - How: lower roughness and a darker albedo within 2 cells of water, baked per vertex.
    - Reference: the wet caves of Scarlet/Violet. Cost: S.
14. **Large instanced emissive crystal clusters.**
    - Reference: Area Zero's Tera crystals.
    - How: hexagonal prisms with points, 5–9 per cluster at scales of 0.3–2.5, some on the
      walls. A fresnel rim, a slow pulse, and density that grows with depth. One draw call.
    - Cost: M.
15. **Glowing mushrooms as fake lights.**
    - How: emissive caps, an additive glow decal on the ground, and the light baked in as in
      item 5.
    - Cost: M.
16. **Light shafts from ceiling cracks.**
    - Reference: the sunbeams in Area Zero; Palworld's cave mouths.
    - How: in the great chamber, 1–3 tall additive cones with scrolling noise, a bright floor
      disc with flowers below, and dust inside.
    - Cost: S–M.
17. **Dust motes and spores.**
    - How: 150–300 points in `quad-particles.ts`, tinted by band and denser near lights. One
      draw call, off under reduced motion.
    - Cost: S.
18. **A landmark in every great chamber.**
    - Reference: the Underdepths' crystal tree island.
    - How: a seeded pick of a crystal tree, a waterfall pool, a glowing mushroom ring, a stone
      shrine with lanterns, or a root pillar. Place the chest or stairs in view of it.
    - Cost: M each.
19. **Terraces, ledges and a lower pool basin.**
    - Reference: the multi-level chambers of Legends: Arceus and Area Zero.
    - How: a visual per-cell elevation of up to 1 unit, ramps at the stairs, and water sunk
      by 0.3. The sim grid stays flat; the actors sample the height.
    - Cost: M.
20. **Rounded stalactites and stalagmites** in place of the sharp spikes.
    - Reference: classic Pokémon caves, from Mt. Moon to Legends: Arceus.
    - Cost: S.
21. **An underground vignette:** a darker top edge and a radial vignette in `finish-pass.ts`
    (`uVignette`), so it feels like you're under rock. Cost: S.
22. **Water that glows.**
    - Reference: the Crystal Pool.
    - How: an emissive caustic term, crystals under the surface, and glowing reeds on the
      shore.
    - Cost: S–M.
23. **Timber arches, mine-cart rails and a parked cart.**
    - Reference: Palworld's mine dungeons; the mines in Scarlet/Violet.
    - How: an arch every 6–8 cells along corridors, and a cart that nods to the Beetle Road.
    - Cost: M.
24. **Stairs that read as portals.**
    - Reference: Palworld's exit crystal.
    - How: carved steps with a lantern on each side and a soft beam. Cool light for down, a warm
      daylight shaft for up.
    - Cost: S–M.
25. **Loot and strays that pop out of the dark.**
    - How:
      - loot: a ground glow decal, a sparkle, a bob, and an icon, so colour is never the only
        signal;
      - strays: eye-shine and a rim light.
    - Cost: S.

## Medium

26. **Floor decals** for cracks, puddles, pebbles and leaf litter, from one instanced atlas.
    - Reference: the ground detail in Legends: Arceus. Cost: S.
27. **A worn path** along the main room chain, baked into vertex colour. Cost: S.
28. **Roots and vines with glowing berries** coming down from the Grove above.
    - Reference: Kitakami and the Timeless Woods. Cost: M.
29. **Torch flicker on the baked light,** through a per-torch uniform or a data texture.
    Cost: M.
30. **A lamp "cookie" for the Keeper:** a soft ground disc and a warm wall wash. Cost: S.
31. **Vista windows:** openings in the outer wall onto a painted chasm with crystals far below.
    - Reference: the views into the Area Zero crater. Cost: M.
32. **Rope bridges and stepping stones** over the water pockets. Cost: M.
33. **A cosy nook for the chest:** a rug, lanterns, a little tent.
    - Reference: the camp spots in Scarlet/Violet. Cost: S.
34. **Friendly murals:** Nubbin glyphs that glow when the Keeper comes near.
    - Reference: the ruin murals in Legends: Arceus. Cost: S.
35. **Drips and ripple rings** at seeded points, with sound cues. Cost: S.
36. **Low fog pooling in basins and over water,** using an inverted copy of the Grove's
    `heightFog`. Cost: S.
37. **Pixel mode: walls 2–3× taller,** with strata, a lit moss lip, sconces on the wall faces
    and tall crystal sprites. Cost: M.
38. **Pixel mode: the depth colour bands** on the floor tint, rim and glows. Cost: S.
39. **Pixel mode: dust, drips and torch embers** from the existing particle art. Cost: S.
40. **Explored rooms glow faintly,** with a minimap, so the bigger floors stay easy to find
    your way around. Palworld's dungeons are often criticised for all looking alike. Cost: M.

## Nice to have

41. **Rare special floors:** all-crystal, flooded, glow-worm ceiling.
    - Reference: Area Zero's solid-crystal tunnel. Cost: M.
42. **Glow-worm stars** along the dark top of the screen. Cost: S.
43. **Glowing bugs** near the fungus; no scary fauna. Cost: S.
44. **Light an unlit sconce,** which re-bakes the light; crystals chime when touched.
    Cost: M.
45. **A rock texture per band:** sandstone, blue slate, amber. Cost: M.

## Guardrails

- **Performance:**
  - Exactly 4 real point lights, with no point-light shadows.
  - Every repeated thing is one InstancedMesh, with 40 or fewer draw calls underground.
  - Per-floor bakes run in chunks or in a worker.
  - The governor sheds particles first, then triplanar, then bloom, then render scale.
  - Test with 8 Nubbins in the great chamber.
- **Tone:**
  - No bones, skulls or traps with impact imagery. Spikes become rounded stalagmites.
  - Darkness is always a readable mid-tone, never black.
  - Under reduced motion: no flicker strobe, no pulsing.

## Sources

- Palworld dungeons: shockbyte.com/blog/palworld-dungeons-what-are-they,
  xgamingserver.com/blog/palworld-dungeons-guide/, game8.co/games/Palworld/archives/459475. These
  cover layout only; the art details are from general knowledge of the game.
- Area Zero Underdepths, Area Zero, Crystal Pool and Terastal energy pages on
  bulbapedia.bulbagarden.net.
- Wayward Cave and Lake Acuity (bulbapedia); Primeval Grotto (pokestop.io).
- Triplanar mapping: bgolus.medium.com/normal-mapping-for-a-triplanar-shader-10bf39dca05a.
- Three.js light-count and performance threads on discourse.threejs.org.
