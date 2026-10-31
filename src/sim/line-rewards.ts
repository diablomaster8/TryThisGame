import { LINE_REWARD } from '../config/tuning';
import { addShells } from './economy';
import { rosterCap, rosterNubbins } from './roster';
import { lineCast } from './storyline-rules';
import type { SimEvent, World } from './types';

/**
 * Lane C round 9 (R0639 CAMP-47, R0600 CAMP-07, R0594 CAMP-02): what a questline beside Hazel's
 * Grove leaves when it ends. Once per line, ever (walking it again gives nothing more, and no
 * reward repeats daily): Shells, a keepsake, and a Grove change kept by id (`grove-*`) in the
 * keepsakes, which the renderers read to place the line's prop. Then each of the line's Nubbins
 * still in the world waits on the Keeper's choice: come home to the Grove, or stay where the
 * line lives (`Nubbin.home`).
 */

/** Grant line `line`'s rewards, once. Returns whether anything was granted. */
export function grantLineReward(world: World, line: string, events: SimEvent[]): boolean {
  const r = LINE_REWARD[line];
  if (!r) return false;
  const kept = world.inventory.keepsakes;
  if (kept.includes(r.keepsake)) return false;
  addShells(world.inventory, r.shells);
  kept.push(r.keepsake);
  if (!kept.includes(r.grove)) kept.push(r.grove);
  events.push({ kind: 'keepsake', id: r.keepsake, quest: line });
  events.push({ kind: 'lineReward', line, shells: r.shells, keepsake: r.keepsake, grove: r.grove });
  return true;
}

/** A line just ended: its rewards, and the choice for each of its Nubbins still here. */
export function lineEndedRewards(world: World, line: string, events: SimEvent[]): void {
  grantLineReward(world, line, events);
  const l = world.lines?.[line];
  if (!l) return;
  const cast = lineCast(l).filter((id) => world.nubbins.some((n) => n.id === id));
  if (cast.length === 0) return;
  l.flags.castChoice = cast.join(',');
  events.push({ kind: 'lineCastChoice', line, cast });
}

/** The Nubbins of an ended line still waiting on the Keeper's choice. */
export function castAwaitingChoice(world: World, line: string): string[] {
  const v = world.lines?.[line]?.flags.castChoice;
  return typeof v === 'string' && v ? v.split(',') : [];
}

/**
 * The Keeper's answer for one of an ended line's Nubbins. Home needs room in the Grove's roster
 * (the Nubbin itself not counted); staying sets `home` to the line's place and frees the slot.
 */
export function chooseCastHome(
  world: World,
  line: string,
  nubbinId: string,
  home: boolean,
  events: SimEvent[],
): boolean {
  const waiting = castAwaitingChoice(world, line);
  const n = world.nubbins.find((x) => x.id === nubbinId);
  const l = world.lines?.[line];
  if (!l || !n || !waiting.includes(nubbinId)) return false;
  let ok = true;
  if (home) {
    const others = rosterNubbins(world).filter((x) => x.id !== nubbinId && x.home === undefined);
    ok = others.length < rosterCap(world);
    if (ok) delete n.home;
  } else {
    n.home = LINE_REWARD[line]?.home ?? line;
  }
  events.push({ kind: 'lineCastChose', line, nubbinId, home, ok });
  if (!ok) return false;
  const left = waiting.filter((id) => id !== nubbinId);
  if (left.length > 0) l.flags.castChoice = left.join(',');
  else delete l.flags.castChoice;
  return true;
}
