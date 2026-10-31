/**
 * Lane B round 8, "floors": the HUD's toasts for secret rooms, puzzles, part shortcuts and
 * the boss door. The HUD's event loop hands each event here first; null means "not mine".
 */
import { FLOORS_TEXT as T } from '../config/strings-hollow-r8-floors';
import { cellCentre, runFloor } from '../sim/dungeon';
import { SHORTCUT_PART } from '../sim/dungeon-puzzles';
import { partySeer } from '../sim/dungeon-secrets';
import type { SimEvent, World } from '../sim/types';

export function floorsToast(world: World, e: SimEvent): string | null {
  const name = (id: string | null | undefined) =>
    world.nubbins.find((n) => n.id === id)?.name ?? '';
  if (e.kind === 'hollowSecret') {
    if (e.how === 'wiggle') return T.secretWiggle;
    if (e.how === 'sight' && world.dungeon)
      return T.secretSeen(name(partySeer(world, world.dungeon)));
    return T.secretFound;
  }
  if (e.kind === 'hollowPuzzle') {
    if (e.what === 'plate') return T.plate;
    if (e.what === 'torch') return T.torch;
    if (e.what === 'reset') return T.reset[e.puzzle];
    if (e.what === 'solved') return T.solved;
    if (e.what === 'shortcut') {
      return T.shortcut(name(e.nubbinId), SHORTCUT_PART[e.puzzle]);
    }
    return '';
  }
  if (e.kind === 'hollowBossDoor') return e.sealed ? T.bossSealed : T.bossOpen;
  return null;
}

/**
 * Dev builds only: `groveFloors` on `window` for the browser smoke. `seals()` lists the
 * floor's seals; `goTo(i)` puts the Keeper on seal i's front cell (a secret's mouth, a
 * puzzle's part spot, the boss's anteroom); `look()` stands on the puzzle's middle.
 */
if (import.meta.env.DEV && typeof window !== 'undefined') {
  const world = () => (window as unknown as { grove?: { world: World } }).grove?.world ?? null;
  const put = (w: World, c: { x: number; y: number }) => {
    const f = runFloor(w);
    if (!f) return;
    const at = cellCentre(f, c);
    w.keeper.pos = { x: at.x, z: at.z };
    w.keeper.moveTarget = null;
  };
  (window as unknown as { groveFloors: unknown }).groveFloors = {
    seals: () => {
      const w = world();
      return (w && runFloor(w)?.seals) ?? [];
    },
    goTo: (i: number) => {
      const w = world();
      const s = w && runFloor(w)?.seals?.[i];
      if (w && s) put(w, s.front);
    },
    look: () => {
      const w = world();
      const s = w && runFloor(w)?.seals?.find((x) => x.puzzle);
      if (w && s?.puzzle) put(w, s.puzzle.grid[24]!);
    },
  };
}
