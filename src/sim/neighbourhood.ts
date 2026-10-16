import { VISITS } from '../config/tuning';
import { Rng } from './rng';
import { SPECIES } from './species';
import { TRAINERS, trainerOf } from './trainers';
import type { SimEvent, World } from './types';

/**
 * The neighbourhood: the other Keepers' Groves, generated from their id, visited
 * offline. A visit shows their Nubbins (render-only), the host, and a one-time story
 * gift per neighbour. The player's own Grove keeps simulating underneath.
 */
export interface NeighbourNubbin {
  name: string;
  species: string;
  band: 'sun' | 'moon' | 'neutral';
  type: 'normal' | 'swim' | 'fly' | 'run' | 'power';
  x: number;
  z: number;
}

const NAMES = [
  'Birch',
  'Clem',
  'Dot',
  'Fennel',
  'Gus',
  'Hazel',
  'Ivy',
  'Juno',
  'Kit',
  'Lark',
  'Moth',
  'Nell',
  'Opal',
  'Pim',
  'Quill',
  'Rue',
  'Sorrel',
  'Tam',
  'Uma',
  'Wren',
];

export function neighbourGarden(trainer: string): NeighbourNubbin[] {
  const t = trainerOf(trainer);
  const rng = Rng.fromSeed(trainer.split('').reduce((h, c) => h * 31 + c.charCodeAt(0), 7));
  const count = rng.int(3, 5);
  const out: NeighbourNubbin[] = [];
  const pocket = Object.values(SPECIES).filter((s) => s.family === 'pocket' && s.stage === 'baby');
  const digi = Object.values(SPECIES).filter((s) => s.family === 'digi' && s.stage === 'baby');
  for (let i = 0; i < count; i++) {
    const roll = rng.next() * (t.eggs.chao + t.eggs.pocket + t.eggs.digi);
    const species =
      roll < t.eggs.chao
        ? 'chao'
        : roll < t.eggs.chao + t.eggs.pocket
          ? rng.pick(pocket).id
          : rng.pick(digi).id;
    out.push({
      name: rng.pick(NAMES),
      species,
      band:
        t.band === 'sun'
          ? rng.chance(0.6)
            ? 'sun'
            : 'neutral'
          : rng.chance(0.6)
            ? 'moon'
            : 'neutral',
      type: rng.chance(0.5)
        ? t.favourite
        : rng.pick(['normal', 'swim', 'fly', 'run', 'power'] as const),
      x: rng.float(-8, 8),
      z: rng.float(-6, 8),
    });
  }
  return out;
}

export function visitingTrainer(world: World): string | null {
  return world.location.startsWith('visit:') ? world.location.slice('visit:'.length) : null;
}

export function visit(world: World, trainer: string | null, events: SimEvent[]): void {
  const target = trainer && TRAINERS.some((t) => t.id === trainer) ? `visit:${trainer}` : 'grove';
  if (world.location === target) return;
  world.location = target as World['location'];
  world.keeper.pos = { x: 0, z: 4 };
  world.keeper.moveTarget = null;
  world.keeper.intent = null;
  events.push({ kind: 'located', location: world.location });
  events.push({ kind: 'visiting', trainer });
}

/** The host's gift: one-time per neighbour, ever. It never resets with the calendar. */
export function neighbourGift(world: World, events: SimEvent[]): boolean {
  const trainer = visitingTrainer(world);
  if (!trainer) return false;
  const rec = world.neighbours[trainer] ?? { gifted: false };
  const ok = !rec.gifted;
  if (ok) {
    rec.gifted = true;
    world.neighbours[trainer] = rec;
    world.inventory.shells += VISITS.giftShells;
  }
  events.push({ kind: 'neighbourGift', trainer, shells: ok ? VISITS.giftShells : 0, ok });
  return ok;
}
