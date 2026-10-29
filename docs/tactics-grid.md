# Tactical grid: reserved data (MOVE-61)

A design note for the future FFT / Vandal Hearts style mode (recs FIGHT-50 to FIGHT-52).
Nothing plays on it yet.

- `Nubbin.combat?: NubbinCombat` (`src/sim/battle/tactics/grid.ts`) is optional and empty by
  default, so the mode needs no save migration. `combatOf(levels)` derives it: Jump =
  1 + ⌊Run/30⌋ height levels per step, Move = 3 + ⌊Run/25⌋ tiles per turn. FIGHT-52 asks for
  Jump from Fly instead; the numbers are in `BATTLE.grid`, so that is a tuning change.
- Boards: `sampleBoard(heightAt, cx, cz, size)` samples any height field (the Grove's
  `groundAt`, a Hollow floor's elevation) into 1-unit tiles with whole height levels of 0.5
  units. `canStep` is the |Δheight| ≤ Jump rule.
- Staging in the open Grove (MOVE-62): `src/sim/battle/arena.ts` keeps lunges, knockback and
  thrown moves out of the same colliders the Keeper walks round, inside a 10-unit circle.
