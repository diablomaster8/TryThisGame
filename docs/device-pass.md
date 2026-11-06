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

## Learning Grove with young children (R0748, KIDS-80)

Everything so far was checked in headless Edge with a stubbed voice. This pass needs people.
Four children, 15 minutes each, with a grown-up observing: age 3, ages 4-5, age 6 and ages
8-10, spread over an iPad, a cheap Android tablet and a phone (each device sees at least one
child). The observer starts a timer when the child first sees the Learning Grove picker and
does not help unless asked twice. Consent: the grown-up agrees in advance; no names, photos
or recordings are kept, only the counts below.

Record, per age band (copy the table once per child):

| Measure | Age 3 | Ages 4-5 | Age 6 | Ages 8-10 |
| --- | --- | --- | --- | --- |
| Time to the first successful round without help (seconds) | | | | |
| Number of "I can't" moments (said or shown by stopping) | | | | |
| Screens that stall (name each: picker, round, results, postcard, shop) | | | | |
| Is the voice understood? (clip or browser voice; yes, mostly, no; any word misheard) | | | | |

Also note the device, browser, whether sound was on, and which taps missed (a tap target
the child hit twice). Turn each stall and each "I can't" into an issue titled with the
screen and the age. Results go here, under a dated heading, and the PROGRESS known gap
"not yet checked on real phones" stays open until all three devices are done.

Status: not run (needs children and devices). Left for Maor to schedule.
