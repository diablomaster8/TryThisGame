import type { KeeperAlignment, World } from './types';

/**
 * R0633 (CAMP-41): one Keeper across the lines. In a save there is one Keeper, who can switch
 * between Sun and Moon. Dawn is a Sun Keeper's story and Dusk a Moon Keeper's: while the active
 * Keeper is the other side, that line holds where it is, and walking into its region asks
 * whether to switch (the existing `switchKeeper` command). Logged In needs nothing: it rolls its
 * eggs from the active Keeper's trainer at setup. Assumption recorded in PROGRESS.md.
 */
export const LINE_KEEPER: Readonly<Record<string, KeeperAlignment>> = {
  dawn: 'sun',
  dusk: 'moon',
};

/** The side the active Keeper must be for running line `id` to move, when it is not that side. */
export function keeperMismatch(world: World, id: string): KeeperAlignment | null {
  const want = LINE_KEEPER[id];
  const l = world.lines?.[id];
  if (!want || !l || l.ending !== null) return null;
  return world.keeper.alignment === want ? null : want;
}
