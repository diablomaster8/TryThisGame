/**
 * The key set (R0183, DUNG-40; lane B round 8), after D2's Uber keys. Captain Crumbs (a named
 * unique of Act I), Pharaoh Fluffhotep and Yeti Spaghetti (the Act III and IV bosses) each hold
 * a key on Brisk or Wild: one in eight a win, and a pity counter makes it certain by the tenth
 * win since that key last dropped, so there is no endless grind. All three keys in the
 * Gardener's Wheelbarrow open the Pillow Fort (a flag and a card for now; the fort's own
 * floor and the Pillow Trio fight are not built). Pure sim, seeded by the win's drop stream.
 */
import { ACTS } from '../config/dungeon-acts';
import { KEY_DROPS, KEYS, type KeyId } from '../config/dungeon-items-r8';
import { hollowTier } from './dungeon-tiers';
import { ensureGear } from './gear';
import { Rng } from './rng';
import type { DungeonRun, SimEvent, World } from './types';

/** The key a beaten foe holds: a unique's id, or the act boss's id for a boss pack. */
export function keyFor(source: string): KeyId | null {
  for (const [id, k] of Object.entries(KEYS)) if (k.source === source) return id as KeyId;
  return null;
}

/** One win against `source` on the current tier: the pity count, then the 1-in-8 roll. */
export function noteKeyWin(
  world: World,
  source: string,
  rng: Rng,
  events: SimEvent[],
): KeyId | null {
  const key = keyFor(source);
  if (!key || hollowTier(world) === 'cosy') return null;
  const g = ensureGear(world);
  const pity = (g.keyPity ??= {});
  pity[key] = (pity[key] ?? 0) + 1;
  // A stream of its own, derived from the win's (not advancing it).
  const roll = new Rng((rng.state ^ 0x2545f491) >>> 0);
  if (pity[key]! < KEY_DROPS.pity && !roll.chance(KEY_DROPS.chance)) return null;
  pity[key] = 0;
  const keys = (g.keys ??= {});
  keys[key] = (keys[key] ?? 0) + 1;
  events.push({ kind: 'hollowItems', what: 'key', id: key });
  return key;
}

/** The pack-beaten hook: a unique's id, or the act's boss for a boss pack. */
export function packKeyWin(
  world: World,
  run: DungeonRun,
  spec: { kind: string; unique?: string },
  rng: Rng,
  events: SimEvent[],
): void {
  const source =
    spec.unique ?? (spec.kind === 'boss' && run.act !== undefined ? ACTS[run.act]?.boss : null);
  if (source) noteKeyWin(world, source, rng, events);
}
