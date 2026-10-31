# Performance budget per device tier (TECH-09)

The numbers live in `src/config/tuning-r8d-perf.ts` (`TIER_BUDGET`, `PERF_GLOBAL`);
`tests/render/perf-budget.test.ts` checks that this page and the code agree, that the tiers
grow from low to high, and that the 3D start values sit inside the frame governor's range
(`GROVE3D.governor`) and above its geometry budget (`PERF_BUDGET` in `tuning-world.ts`).

## Tiers

The tier is read once at boot by `src/platform/device-tier.ts` and shown in the debug panel
(`tier Medium (default)`). Settings → Quality can pin it on this device (`grove.quality` in
localStorage); it takes effect on reload.

| Tier | Detect                                                                                                                             | Pixel | 3D start                                                                             | Budget                                                   |
| ---- | ---------------------------------------------------------------------------------------------------------------------------------- | ----- | ------------------------------------------------------------------------------------ | -------------------------------------------------------- |
| low  | `deviceMemory` ≤4, or a Mali-G5x / Adreno 60x–61x renderer, or the sculpt benchmark picked the slow grid                           | 540p  | not suggested; if picked: ratio 0.75, no shadows, no bloom, no SMAA, light particles | 30 fps, p95 ≤33 ms, heap ≤120 MB, ≤150 calls             |
| mid  | everything else (2022 mid-range phones, iPhone 12–13, Apple GPUs, SwiftShader)                                                     | 540p  | ratio 1, basic shadows (PCF off), bloom on, SMAA off                                 | 60 fps, p95 ≤20 ms, heap ≤160 MB, ≤250 calls             |
| high | not a phone, a desktop GPU name (or the desktop sculpt grid when the name is hidden), and `deviceMemory` ≥8 where the browser says | 540p  | ratio 1.5, PCF shadows, bloom, SMAA                                                  | 60 fps, p95 ≤20 ms, p99 ≤20 ms, heap ≤600 MB, ≤400 calls |

iPhone 14 Pro and newer cannot be told apart from older iPhones (Safari reports "Apple GPU"
and no memory), so they read as mid; Settings → Quality → High lifts them.

## Shared budgets

| What                        | Budget          | Checked by                                                                                                          |
| --------------------------- | --------------- | ------------------------------------------------------------------------------------------------------------------- |
| Eager JS                    | ≤450 kB gzip    | `npm run check:bundle` asserts the baseline (845 kB today) +10% and a 1000 kB ceiling; 450 is the goal, not yet met |
| First playable frame        | ≤3 s on Fast 4G | manual (`window.__groveLoadMs`)                                                                                     |
| 7-day `indefinite` catch-up | ≤3 s            | `tests/sim/offline.test.ts`                                                                                         |
| One autosave                | ≤2 ms           | manual (debug panel `save` section in the frame log)                                                                |

## How the renderers hold it

- **Full 3D** starts at the tier's settings (TECH-52) and the frame governor sheds, in order:
  particles, SMAA, bloom, shadow redraws, then the render scale, then CPU savings. The settled
  level is kept per device in `grove.gov3d` and the next boot starts there.
- **Pixel** has a light governor (TECH-53): full particles to light, wind sway off, weather
  overlay off, then the frame height 540 → 432. Kept in `grove.govpx`.

## Open gaps

- No real-phone numbers yet: the device pass (`docs/device-pass.md`) records fps and heap per
  tier.
- `WORLD_MEM.phone.heapMB` (180, one region's target) sits above the mid tier's whole-page
  heap budget (160); the region budget should come down when the phone pass has numbers.
- The eager bundle is about twice the goal.
