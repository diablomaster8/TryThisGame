import { SPECIES } from './species';
import type { Nubbin, SimEvent, World } from './types';

/**
 * The collection book: every species and every Chao form the Keeper has seen hatch,
 * grow or evolve in their Grove. Keys are species ids for the pocket and digital
 * lines, and `chao:<band>:<type>` / `chao:eternal:<band>` for the Chao line.
 */
export function formKey(n: Nubbin): string {
  if (n.species !== 'chao') return n.species;
  if (n.stage === 'egg') return 'chao:egg';
  if (n.stage === 'child') return 'chao:child';
  if (n.eternal) return `chao:eternal:${n.eternal}`;
  if (n.form) return `chao:${n.form.band}:${n.form.type}`;
  return 'chao:child';
}

export function noteSeen(world: World, key: string, events: SimEvent[]): void {
  if (world.seen[key] !== undefined) return;
  world.seen[key] = world.timeMs;
  events.push({ kind: 'firstSeen', key });
}

/** Every key the book can hold, in display order. */
export function allKeys(): string[] {
  const keys: string[] = ['chao:child'];
  for (const band of ['sun', 'moon', 'neutral'] as const) {
    for (const type of ['normal', 'swim', 'fly', 'run', 'power'] as const) {
      keys.push(`chao:${band}:${type}`);
    }
  }
  for (const band of ['sun', 'moon', 'neutral'] as const) keys.push(`chao:eternal:${band}`);
  for (const id of Object.keys(SPECIES)) if (id !== 'chao') keys.push(id);
  return keys;
}

/** Fold sim events into the book. */
export function stepCollection(world: World, events: SimEvent[]): void {
  for (const e of events) {
    if (
      e.kind === 'hatched' ||
      e.kind === 'evolved' ||
      e.kind === 'secondEvolved' ||
      e.kind === 'speciesGrew' ||
      e.kind === 'eternal' ||
      e.kind === 'reborn'
    ) {
      const n = world.nubbins.find((x) => x.id === e.nubbinId);
      if (n) noteSeen(world, formKey(n), events);
    }
  }
}
