import { INHERITANCE } from '../config/tuning';
import { GRADES } from './types';
import { STAT_KEYS, type Memory, type Nubbin, type World } from './types';

/**
 * Rebirth memories: before a Nubbin returns to its egg the Keeper has chosen what it
 * keeps. A grade: its best stat steps up one grade. A part: its critter parts stay. A
 * lesson: its school lessons stay. An accessory: its hat, scarf and glasses stay.
 * Each life is written into the family line; three lives of one line earn the heirloom
 * look.
 */
export function setMemory(world: World, nubbinId: string, memory: Memory): boolean {
  const n = world.nubbins.find((x) => x.id === nubbinId);
  if (!n) return false;
  n.memory = memory;
  return true;
}

/** Called by rebirth before the reset: records the life and returns what to keep. */
export function beforeRebirth(n: Nubbin): {
  keepParts: boolean;
  keepLessons: boolean;
  keepAccessories: boolean;
} {
  const label = n.eternal
    ? `Eternal ${n.eternal}`
    : n.form
      ? `${n.form.band} ${n.form.type}`
      : 'child';
  n.ancestry.push(label);
  if (n.ancestry.length >= INHERITANCE.heirloomGenerations) n.heirloom = true;
  if (n.memory === 'grade') {
    let best: (typeof STAT_KEYS)[number] | null = null;
    for (const k of STAT_KEYS) {
      if (n.stats[k].grade === 'S') continue;
      if (!best || n.stats[k].points > n.stats[best].points) best = k;
    }
    if (best) {
      const i = GRADES.indexOf(n.stats[best].grade);
      n.stats[best].grade = GRADES[Math.min(GRADES.length - 1, i + 1)]!;
    }
  }
  return {
    keepParts: n.memory === 'part',
    keepLessons: n.memory === 'lesson',
    keepAccessories: n.memory === 'accessory',
  };
}
