/**
 * Which chasm cells a sprout leaf-bridge covers right now (R0025, round 12). Kept in a side
 * table keyed by the floor's `gaps` list, which every copy of a floor (the sealed and the
 * displayed ones) shares, so the sim, the planner and both renderers all see the same bridge.
 * Runtime only, never saved. No imports, so the floor code and the nav can both read it.
 */
interface Keyed {
  gaps?: object;
}

const table = new WeakMap<object, Set<number>>();

/** Records the covered cell indexes for a floor's gaps. */
export function setBridged(f: Keyed, cells: Set<number>): void {
  if (f.gaps) table.set(f.gaps, cells);
}

/** Whether the cell at index `i` (y * cols + x) is under a leaf-bridge. */
export function isBridged(f: Keyed, i: number): boolean {
  return !!f.gaps && !!table.get(f.gaps)?.has(i);
}
