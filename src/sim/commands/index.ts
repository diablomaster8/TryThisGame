/**
 * TECH-35: `applyCommand`'s per-domain handlers. Each module exports a `handlers` map for
 * the command kinds of one domain; this file merges them into one lookup and throws if two
 * modules claim the same kind. `applyCommandInner` (sim/world.ts) asks `HANDLERS` first and
 * falls through to its own switch for the kinds not moved yet.
 */
import type { Command, SimEvent, World } from '../types';
import { handlers as debug } from './debug';
import { handlers as edu } from './edu';
import type { Handlers } from './types';

export type { Handlers } from './types';

function merge(...maps: Handlers[]): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const map of maps) {
    for (const [kind, fn] of Object.entries(map)) {
      if (kind in out) throw new Error(`Two handlers for command "${kind}"`);
      out[kind] = fn;
    }
  }
  return out;
}

const HANDLERS = merge(debug, edu);

/** Every command kind a handler module owns. */
export const HANDLED_KINDS: readonly string[] = Object.keys(HANDLERS);

/** Run the domain handler for `cmd`; false when no module owns its kind. */
export function runHandler(world: World, cmd: Command, events: SimEvent[]): boolean {
  const fn = HANDLERS[cmd.kind] as ((w: World, c: Command, e: SimEvent[]) => void) | undefined;
  if (!fn) return false;
  fn(world, cmd, events);
  return true;
}
