import type { ReadonlyWorld } from './readonly';
import { LAND_GARDENS } from '../config/tuning-more/world-region-content';
import { regionShown as travellers } from './region-companion';
import { regionOf } from './regions';
import type { Nubbin, World } from './types';

/**
 * R0096 (WORLD-34, R13 d1): the Sun and Moon lands' Nubbin gardens. Sun adults (alignment above
 * the band) stroll the Sun lands' gardens and Moon adults the Moon lands' while the Keeper is
 * there: a mirror only. The Nubbins themselves stay in the Grove's sim (needs, ageing and
 * behaviour untouched); the renderers draw these stand-ins, which read every field from the real
 * Nubbin and own only a position. The stroll is a function of the world's time: no state, no
 * random draws.
 */
const mirrors = new Map<string, Nubbin>();

function mirrorOf(n: Nubbin): Nubbin {
  let m = mirrors.get(n.id);
  if (!m || Object.getPrototypeOf(m) !== n) {
    m = Object.create(n) as Nubbin;
    Object.defineProperties(m, {
      pos: { value: { x: 0, z: 0 }, writable: true },
      y: { value: 0, writable: true },
    });
    mirrors.set(n.id, m);
  }
  return m;
}

/** The adults of the land's alignment, in id order, up to the garden's limit. */
export function gardenDwellers(world: ReadonlyWorld, region: string): Nubbin[] {
  const centres = (LAND_GARDENS.centres as Record<string, readonly { x: number; z: number }[]>)[
    region
  ];
  if (!centres) return [];
  const sun = region === 'sunlands';
  const out: Nubbin[] = [];
  for (const n of world.nubbins) {
    if (n.stage !== 'adult' || world.partners.includes(n.id)) continue;
    if (sun ? n.alignment <= LAND_GARDENS.band : n.alignment >= -LAND_GARDENS.band) continue;
    out.push(n);
    if (out.length >= LAND_GARDENS.max) break;
  }
  return out;
}

/**
 * What a region's drawn Nubbins are: the partners that came along and the Nubbin the Keeper
 * carries (`region-companion.ts`), and in the Sun and Moon lands the gardens' mirrors.
 */
export function regionShown(world: ReadonlyWorld): Nubbin[] {
  const out = travellers(world);
  const region = regionOf(world.location);
  if (region !== 'sunlands' && region !== 'moonlands') return out;
  const centres = LAND_GARDENS.centres[region];
  gardenDwellers(world, region).forEach((n, i) => {
    const m = mirrorOf(n);
    const c = centres[i % centres.length]!;
    const a = (world.timeMs / LAND_GARDENS.periodMs) * Math.PI * 2 * (i % 2 ? -1 : 1) + i * 1.7;
    m.pos.x = c.x + Math.cos(a) * LAND_GARDENS.r;
    m.pos.z = c.z + Math.sin(a) * LAND_GARDENS.r;
    out.push(m);
  });
  return out;
}
