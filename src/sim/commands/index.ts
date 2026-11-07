/**
 * TECH-35: `applyCommand`'s per-domain handlers. Each module exports a `handlers` map for
 * the command kinds of one domain; this file merges them into one lookup and throws if two
 * modules claim the same kind. `applyCommandInner` (sim/world.ts) asks `HANDLERS` first and
 * has no switch of its own any more.
 */
import type { Command, SimEvent, World } from '../types';
import { handlers as campaign } from './campaign';
import { handlers as care } from './care';
import { handlers as debug } from './debug';
import { handlers as decor } from './decor';
import { handlers as dungeon } from './dungeon';
import { handlers as edu } from './edu';
import { handlers as keeper } from './keeper';
import { handlers as race } from './race';
import { handlers as shop } from './shop';

export type { Handlers } from './types';

/** Throws if two modules claim the same command kind (a spread would silently let one win). */
function assertDisjoint(...maps: object[]): void {
  const seen = new Set<string>();
  for (const map of maps) {
    for (const kind of Object.keys(map)) {
      if (seen.has(kind)) throw new Error(`Two handlers for command "${kind}"`);
      seen.add(kind);
    }
  }
}

assertDisjoint(care, keeper, shop, race, campaign, dungeon, decor, debug, edu);

/**
 * Compile-time exhaustiveness: `satisfies` fails tsc, naming the kind, when any member of the
 * `Command` union has no handler in any module.
 */
const HANDLERS = {
  ...care,
  ...keeper,
  ...shop,
  ...race,
  ...campaign,
  ...dungeon,
  ...decor,
  ...debug,
  ...edu,
} satisfies { [K in Command['kind']]: unknown };

/** Every command kind a handler module owns. */
export const HANDLED_KINDS: readonly string[] = Object.keys(HANDLERS);

/** Run the domain handler for `cmd`; false when no module owns its kind. */
export function runHandler(world: World, cmd: Command, events: SimEvent[]): boolean {
  const fn = (HANDLERS as Record<string, unknown>)[cmd.kind] as
    ((w: World, c: Command, e: SimEvent[]) => void) | undefined;
  if (!fn) return false;
  fn(world, cmd, events);
  return true;
}
