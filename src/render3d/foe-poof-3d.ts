import * as THREE from 'three';
import { R10B3 } from '../config/tuning-more/dungeon-poof-kid-mode';
import { actSparkColour, FoePoofs, poofFrame, type Poof } from '../render/foe-poof';
import { foeArtId } from '../render/sprites/foe-family-art';
import { uniqueArtId } from '../render/sprites/unique-art';
import type { Floor } from '../sim/dungeon';
import type { World } from '../sim/types';
import type { Bursts } from './bursts';

/**
 * The defeat beat in Full 3D (R0157, lane B r10): see `render/foe-poof.ts`. The leader and
 * the tiny runner are crowd figures (`crowd.ts` appends `poofFigures`), drawn from the same
 * creature pool as the pack, so no new look is sculpted; the twelve act-coloured sparkles
 * join the scene's one burst cloud (no extra draw call). A toon figure cannot fade, so the
 * runner shrinks away into the wall instead; under reduced motion the leader stands still
 * under the burst cloud's calm glints (the sparkle icon) and then is gone.
 */
export const POOF3D = new FoePoofs();

/** Poofs whose sparkles are out, so each bursts once. */
const burst = new WeakSet<Poof>();
const at = new THREE.Vector3();

export interface PoofFigure {
  id: string;
  art: string;
  /** A named unique's leader keeps its own (bigger) look. */
  unique?: string;
  x: number;
  z: number;
  facing: number;
  pose: 'idle' | 'walk' | 'sad';
  /** Width and height multipliers on the figure's own size. */
  sx: number;
  sy: number;
}

const reduced = (): boolean =>
  typeof document !== 'undefined' && document.documentElement.classList.contains('reduce-motion');

/** The figures of every live beat on the floor (fills `out`). */
export function poofFigures(
  world: World,
  floor: Floor | null,
  nowMs: number,
  out: PoofFigure[],
): PoofFigure[] {
  out.length = 0;
  if (world.location !== 'dungeon' || !floor) {
    POOF3D.clear();
    return out;
  }
  POOF3D.place(floor, world.dungeon?.act);
  const calm = reduced();
  POOF3D.prune(nowMs, calm);
  for (const p of POOF3D.list) {
    const fr = poofFrame(p, nowMs - p.startMs, calm);
    const spec = floor.packs?.find((q) => q.id === p.packId);
    const lead = spec?.members[0];
    if (!fr || !spec || !lead) continue;
    const art = spec.unique ? uniqueArtId(spec.unique) : foeArtId(spec, lead.species);
    if (fr.leader)
      out.push({
        // The pack's own leader figure carries on, so its rig is never swapped mid-beat.
        id: `${p.packId}:0`,
        art,
        ...(spec.unique ? { unique: spec.unique } : {}),
        x: p.x,
        z: p.z,
        facing: 0,
        pose: 'sad',
        sx: fr.leader.scaleX,
        sy: fr.leader.scaleY,
      });
    if (fr.runner) {
      const k = R10B3.poof.runnerScale * fr.runner.opacity;
      out.push({
        id: `${p.packId}:1`,
        art,
        ...(spec.unique ? { unique: spec.unique } : {}),
        x: fr.runner.x,
        z: fr.runner.z,
        facing: fr.runner.facing,
        pose: 'walk',
        sx: k,
        sy: k,
      });
    }
  }
  return out;
}

/** Throw each beat's sparkles (and the runner's ♪) once, as its squash ends. */
export function poofBursts(bursts: Bursts, nowMs: number): void {
  const P = R10B3.poof;
  for (const p of POOF3D.list) {
    if (burst.has(p) || nowMs - p.startMs < (bursts.calm ? 0 : P.squashMs)) continue;
    burst.add(p);
    at.set(p.x, 0.6, p.z);
    const o = { spread: 0.25, speed: P.spread * 2.4, rise: 0.8, lifeMs: P.sparkleMs };
    bursts.burst('sparkle', at, P.sparkles, o, nowMs, actSparkColour(p.act));
    if (!bursts.calm) {
      at.y = 1.1;
      bursts.burst('note', at, 1, { spread: 0, speed: 0.2, rise: 0.4, lifeMs: P.byeMs }, nowMs);
    }
  }
}
