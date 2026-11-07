/**
 * R0589 (SOUL-72), lane A round 12: the hum. A content Nubbin idling near the Keeper now and
 * then hums its own four-note motif (the music side lives in `platform/audio.ts`, played from
 * `ui/soul-sounds.ts` on the `hum` event). Musical Nubbins hum three times as often. Chances
 * are hashed per second, never the world's rng; live play only; sound and looks, never stats.
 */
import { HUM } from '../config/tuning-more/soul-hum-fond';
import { awake, dist, h01, idle } from './soul-kit';
import { soulLive } from './antics';
import { hasTrait } from './traits';
import type { Nubbin, SimEvent, World } from './types';

const lastHum = new WeakMap<Nubbin, number>();

export function canHum(world: World, n: Nubbin): boolean {
  return (
    awake(n) &&
    idle(n) &&
    n.needs.happiness >= HUM.minHappiness &&
    n.needs.hunger > HUM.minHunger &&
    n.needs.energy > HUM.minEnergy &&
    dist(n.pos, world.keeper.pos) < HUM.keeperRadius
  );
}

export function stepHums(world: World, dtMs: number, events: SimEvent[], offline: boolean): void {
  if (offline || !soulLive() || world.location !== 'grove') return;
  const now = world.timeMs;
  if (Math.floor(now / 1000) === Math.floor((now - dtMs) / 1000)) return;
  const sec = Math.floor(now / 1000);
  for (const n of world.nubbins) {
    if (!canHum(world, n)) continue;
    if (now - (lastHum.get(n) ?? -Infinity) < HUM.cooldownMs) continue;
    const chance = HUM.perSecond * (hasTrait(n, 'musical') ? HUM.musicalMult : 1);
    if (h01(`hum:${n.seed}:${sec}`) >= chance) continue;
    lastHum.set(n, now);
    events.push({ kind: 'hum', nubbinId: n.id });
  }
}
