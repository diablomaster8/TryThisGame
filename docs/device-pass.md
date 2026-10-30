# Device pass: manual checks

`tests/e2e/` does not exist yet (no Playwright), so these are manual. Move them into
Playwright when G11 creates the folder.

## B2: the debug panel never ships in production

1. `npm run build && npm run preview`, open the site and start a slot.
2. Press backtick, and triple-tap the logo. Nothing opens, and `document.querySelector('.debug')` is `null`.
3. Reload with `?debug` on the URL. Backtick and the triple-tap now open the panel.
4. `npm run dev`: the panel opens without the flag.

## B3: one panel at a time at 375x812 (portrait), pixel and Full 3D

Run once under Graphics > Pixel art and once under Full 3D.

1. Open the stats sheet (tap a Nubbin), then the Journal (📖). The sheet closes; only the Journal shows.
2. Open Shop, then Roster, then Settings in turn. Each replaces the last.
3. With the Free Grove slot empty of Nubbins, tap 🏃 Expedition. The toast appears in its own row
   under the top bar, not over the buttons, and does not block taps.
4. With a Nubbin, start an Expedition. The 🐚 counter sits beside the ✕ button, not under it.
   Tapping 📖 (via keyboard or event) never opens a panel over a running Expedition.
5. Rotate to landscape and repeat 1 and 4.

## Funny moments sheet

Beside the device checks, run one comedy session per audience with `docs/playtest-funny.md` (R0346).

## TECH-09: fps and heap per tier

Budgets are in `docs/perf-budget.md`. For each device, note the tier the debug panel shows,
then play two minutes in the Grove with 8 Nubbins and copy the panel's `frames p95` and
Chrome's heap (Performance monitor, or `performance.memory.usedJSHeapSize`).

| Device        | Tier | Renderer | p95 ms | Heap MB | Calls | Date |
| ------------- | ---- | -------- | ------ | ------- | ----- | ---- |
| (not yet run) |      |          |        |         |       |      |
