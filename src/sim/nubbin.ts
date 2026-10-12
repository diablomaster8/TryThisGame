import { EGG, NEEDS } from '../config/tuning';
import { NUBBIN_NAMES } from '../config/strings';
import { createNeeds } from './needs';
import type { Rng } from './rng';
import { rollStats } from './stats';
import type { Nubbin, NubbinType, Vec2 } from './types';

export const EGG_COLORS = ['plain', 'sky', 'rose', 'mint', 'gold', 'violet'] as const;

export function createEgg(id: string, pos: Vec2, rng: Rng, eggColor: string = 'plain'): Nubbin {
  const seed = Math.floor(rng.next() * 4294967296);
  const lean: Record<NubbinType, number> = { normal: 0, swim: 0, fly: 0, run: 0, power: 0 };
  return {
    id,
    name: rng.pick(NUBBIN_NAMES),
    seed,
    stage: 'egg',
    stageMs: 0,
    cocoonKind: null,
    ageMs: 0,
    hatchRemainingMs: EGG.hatchMs,
    eggColor,
    pos: { x: pos.x, z: pos.z },
    y: 0,
    vel: { x: 0, y: 0, z: 0 },
    facing: rng.float(0, Math.PI * 2),
    behavior: { state: 'sit', sinceMs: 0, untilMs: 0, target: null, itemId: null, reaction: null },
    needs: createNeeds(),
    happinessSum: 0,
    happinessSamples: 0,
    stats: rollStats(rng),
    typeLean: lean,
    alignment: 0,
    personality: null,
    childCare: { pets: 0, throws: 0, feeds: 0 },
    form: null,
    parts: { ears: null, tail: null, arms: null, back: null },
    hat: null,
    rebirths: 0,
    gradeUpgrades: {},
    eternal: null,
    awaitingKeeper: false,
    lastPetMs: -NEEDS.petCooldownMs,
    lastShakeMs: -EGG.shakeCooldownMs,
    genes: {},
    skills: {},
    karateRecord: {},
  };
}

export function isEgg(n: Nubbin): boolean {
  return n.stage === 'egg';
}

export function isHeld(n: Nubbin): boolean {
  return n.behavior.state === 'held' || n.behavior.state === 'carried';
}

export function isAirborne(n: Nubbin): boolean {
  return n.behavior.state === 'thrown';
}

/** Can act on its own: not an egg, not in a cocoon, not in the player's hands. */
export function isFree(n: Nubbin): boolean {
  return n.stage !== 'egg' && n.stage !== 'cocoon' && !isHeld(n) && !isAirborne(n);
}
