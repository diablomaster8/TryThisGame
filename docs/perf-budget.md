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

| What                        | Budget          | Checked by                                                                                                                                                                |
| --------------------------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Eager JS                    | ≤450 kB gzip    | `npm run check:bundle` asserts the baseline (107 kB, 2026-11-04) +10% and a 160 kB ceiling: the title paints before the sim, `Game` and the HUD load (`src/boot-late.ts`) |
| First playable frame        | ≤3 s on Fast 4G | manual (`window.__groveLoadMs`)                                                                                                                                           |
| 7-day `indefinite` catch-up | ≤3 s            | `tests/sim/offline.test.ts`                                                                                                                                               |
| 30-day catch-up, full Grove | ≤1.5 s          | `tests/sim/offline-perf.test.ts` (8 adults, campaign, Hollow run; TECH-73: ~0.4 s, so no worker needed)                                                                   |
| One autosave                | ≤2 ms           | `tests/sim/offline-perf.test.ts` (serialise, 8 adults, campaign, Hollow run; the write is manual)                                                                         |

## How the renderers hold it

- **Full 3D** starts at the tier's settings (TECH-52) and, once the smoothed frame runs over
  19 ms (the 60 fps target, hot/perf-leaks 2026-11-06), the frame governor sheds, in order:
  particles, the sun's shadow redrawn every second frame, SMAA, bloom, the sun's shadow, then
  the render scale, then CPU savings. The settled level is kept per device in `grove.gov3d`
  and the next boot starts there.
- **Pixel** has a light governor (TECH-53): full particles to light, wind sway off, weather
  overlay off, then the frame height 540 → 432. Kept in `grove.govpx`.

## Open gaps

- No real-phone numbers yet: the device pass (`docs/device-pass.md`) records fps and heap per
  tier.
- `WORLD_MEM.phone.heapMB` (180, one region's target) sits above the mid tier's whole-page
  heap budget (160); the region budget should come down when the phone pass has numbers.
- Production Full 3D heap after GC, phone viewport, new Hazel's Grove (2026-11-04, r12-d3):
  154 MB, down from 188 once villagers' and the grandchild's marched surfaces are let go after
  their rig is built (`POOL_SHED`); Pixel 38 MB. Measured with `recs-2026-10-27/tools/r12-d3-heap.cjs`.

## Decisions (r13-d4, 2026-11-05)

- **WORLD-09 chunk cache: no IndexedDB cache.** A chunk's built data (grass matrices plus decor,
  about 72 KB as float32) reads back from IndexedDB in 0.9 ms per get and writes in 1.4 ms in
  headless Edge on desktop (`recs-2026-10-27/tools/r13-d4-idb.cjs`); a rebuild from the seed is
  about 1 ms. A cache would cost the same as the work it saves (more on a phone, where IndexedDB
  is several times slower), is async, and would need invalidating on every art or seed change.
  Chunks are rebuilt when they re-enter the active set. The sculpt cache stays: a creature
  takes hundreds of ms to march.
- **Title first paint (TECH-51), Slow 4G (1.6 Mbps, 150 ms), 375 px, cache off, headless Edge,
  `recs-2026-10-27/tools/r13-d4-throttle.cjs`:** the inline splash paints at 0.9-1.7 s;
  the title at 4.0 s cold and 3.2 s for a returning player, down from 4.0 once `storage` stopped
  importing `migrate-unified` (it pulls the sim save, a 340 kB gz chunk) on the title's path for
  a returning player. `modulepreload` for the boot chunks (game, HUD, boot-late) was tried and
  rejected: it pushed the title to 7.4 s because they compete with the title's own bytes. The
  boot chunks start once the title has painted. The marks `title-visible` and `grove-playable` exist.
- **Songs (TECH-64):** `?audiolab` renders each song for 30 s offline through its trim and the
  bus. All 13 land within 0.5 LU of target (-20 LUFS, night and sorrow -22, story -28, calm -29);
  `SONG_MEASURED_LUFS` records them and `tests/ui/music-levels.test.ts` checks them.
