# Should Full 3D become the default? (G16.12, 2026-10-16)

**Decision (Maor, 2026-10-17): no. Pixel stays the default; Full 3D stays a Graphics setting.**

A one-page brief for Maor. The Graphics setting offers Pixel (the shipped 2.5D renderer,
the default) and Full 3D (`src/render3d/`). Both draw the same sim through one interface;
switching is a setting, so this decision is reversible at any time.

## Recommendation

**Not yet. Keep Pixel as the default until the G11 phone rows are filled in, then make Full
3D the default on devices that pass a boot check, and keep Pixel everywhere else.**

Full 3D now matches the pixel view feature for feature in the Grove, the story places, the
Hollow Below and the visits (below). What is missing is proof that it runs well on the
phones the brief targets: no phone has run it yet. The check to flip the default:

1. G11's bench (`?bench`, 8 Nubbins) on a mid-range 2022 phone: 30 fps floor, 60 fps target
   (the brief's acceptance check); first load under 4 s, second load under 1 s.
2. iPhone Safari and Firefox: the module workers (sculpting, terrain, textures, grass) run,
   or their no-worker fallbacks give the same picture; no console errors.
3. Then default by device: Full 3D where WebGL2 is present and the boot benchmark in
   `sculpt-res.ts` picks the full sculpt grid; Pixel otherwise. The title screen keeps the
   choice in sight, and a player's own pick always wins.

## Evidence

**Parity.** The G15 pass (one seeded save, 15 actions, 12,000 frames per mode) fired the
same events in both modes and found 11 gaps; all are now closed: event bursts and crown
fades (G15), and G16.1 to G16.11 in this pass (stair-entry stall, tap highlights on every
tappable thing, the story Hollow and Corvin's garden, the Hollow Below's lamp, loot and "?",
market stalls, merged glow, cocoon fades, fruit flavours, weather gates and grade, trunk and
visit-tree fades, the race start in portrait, the render pause behind panels). Screenshots:
`docs/samples/parity2-*.jpg`.

**Frame time** (Maor's PC, browser pane, frames driven by hand, `gl.finish` round each):

|                                                 | Pixel                  | Full 3D                               |
| ----------------------------------------------- | ---------------------- | ------------------------------------- |
| Whole game frame, 375x812 (G15)                 | p50 0.7 ms, p95 1.1 ms | p50 3.0 ms, p95 5.3 ms                |
| Render only, 562x1218 backing store (this pass) | not measured           | p50 2.4 ms, p95 3.1 ms                |
| First trip down the stairs                      | 484 ms                 | was 3,261 ms; now under 50 ms (G16.1) |

Full 3D costs about four times the pixel frame here, well inside 16 ms on a PC. The 3D
device grid (`sculpt-res.ts`) assumes a phone about four times slower than this PC; at that
rate the Full 3D frame would be about 12 ms typical and 21 ms at the 95th percentile (under
60 fps on busy frames, above the 30 fps floor), and Pixel about 4 ms. That guess is the
open question G11 answers.

**Load.** On this PC, 3D boot from page start to every creature rigged measured 2.95 to
4.05 s, before the two boot passes that cut the scene constructor from 1.65 s to about
0.2 s and compiled its first frame ahead, so today's figure is lower but not re-measured.
Pixel boots in about 0.45 s. The brief's phone target (4 s fresh, 1 s second load) was not
met on the PC at that measurement.

**Download** (build at 73dac41). Shared by both modes: the main chunk, 1,193 kB (346 kB
gzip). Full 3D loads on demand: the scene and shared 3D chunks (98 + 208 + 19 = 324 kB,
128 kB gzip), the sculpt worker (253 kB) and the grass worker (91 kB): about 670 kB more on
the first 3D boot, then cached.

## Risks

- **Phones.** Unmeasured. GPU time, heat over a long session, and memory: the scene holds
  about 90 shader programs once every place's lights are linked (G16.1 trades memory for
  no stalls). The canvas is capped at 1.5x device pixels to protect the GPU.
- **Battery.** Full 3D now pauses behind story scenes, the away screen, the photo panel
  and the minigames (G16.11), but the Grove itself draws every frame.
- **Workers.** Sculpting, terrain, textures and grass run in module workers; Firefox and
  Safari have not been tested (G11 item 2), nor have the no-worker fallbacks.
- **Style jump.** The Expedition and the races are pixel art in both modes; in Full 3D they
  read as a different game. That is Maor's call (keep, or 3D versions later).
- **Small leftovers.** Coming home from a visit links a few Grove programs (one frame of
  about 170 ms); the emote ball is still a sprite; the leaf cards get no tap halo (their
  sway is in the shader); the visit grass tiles visibly; no ripple round a wading Keeper.
