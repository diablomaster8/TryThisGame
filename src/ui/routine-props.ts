/**
 * R0296 (FUN-07): the Keepers' routine prop gags. While a Keeper is at one of their routine
 * stations, the station's prop stands beside them and loops its little joke: Sparks's
 * lantern flashes and leaves her sooty for ten seconds, Fern's pear sapling looks guilty,
 * Dusty finds a spoon and then another, Pixel's robot wanders off, Nova's map is upside
 * down, Clover's scarf grows a little each chapter. The prop is a DOM element projected
 * through whichever camera is drawing, like the bark bubbles, so both renderers show the
 * same gag. Render-only: it reads the sim's routine state and never changes it.
 */
import '../fun.css';
import * as THREE from 'three';
import { NPC_ROUTINE } from '../config/tuning';
import type { Game } from '../game';
import { terraceY } from '../render/scene-stage';
import { viewRect } from '../render/stage-api';
import { standHeight } from '../render3d/terrain-shape';
import { currentStation, routineTarget } from '../sim/npc-routines';
import { el } from './dom';

interface PropGag {
  icon: string;
  /** The CSS loop (`gag-*` in fun.css). */
  gag: string;
}

/** Station props by `keeper:station`. Stations not listed have their gag in the line alone. */
const PROPS: Record<string, PropGag> = {
  'fern:pear': { icon: '🌱', gag: 'guilty' },
  'fern:stone': { icon: '🪨', gag: 'proud' },
  'sparks:fourth-lantern': { icon: '🏮', gag: 'flash' },
  'sparks:stream-lantern': { icon: '🏮', gag: 'flash' },
  'byte:timing': { icon: '⏱', gag: 'hold' },
  'byte:gate': { icon: '⏱', gag: 'hold' },
  'marina:bucket': { icon: '🪣', gag: 'slop' },
  'dusty:dig': { icon: '🥄', gag: 'spoons' },
  'pixel:robot': { icon: '🤖', gag: 'wander' },
  'pixel:path': { icon: '🤖', gag: 'wander' },
  'clover:knit': { icon: '🧣', gag: 'scarf' },
  'ember:scarecrow': { icon: '🌾', gag: 'scarecrow' },
  'luna:bench': { icon: '💤', gag: 'zzz' },
  'luna:shade': { icon: '💤', gag: 'zzz' },
  'nova:map': { icon: '🗺', gag: 'upside' },
  'nova:gate-wrong': { icon: '🗺', gag: 'upside' },
};

/** How high (world units) the prop and the soot smudge sit. */
const PROP_LIFT = 0.5;
const SOOT_LIFT = 1.55;

export class RoutineProps {
  private readonly pool = new Map<string, { prop: HTMLDivElement; soot: HTMLDivElement }>();
  private readonly v = new THREE.Vector3();

  constructor(private readonly parent: HTMLElement) {}

  /** The prop key for a Keeper now, or null: exported for the test. */
  static propFor(trainer: string, timeMs: number): PropGag | null {
    const cur = currentStation(trainer, timeMs);
    return cur ? (PROPS[`${trainer}:${cur.station.id}`] ?? null) : null;
  }

  update(g: Game): void {
    const w = g.world;
    const scene = (w.campaign?.queue.length ?? 0) > 0 || w.location !== 'grove';
    const s3 = g.scene3d;
    const cam: THREE.Camera = s3 ? s3.camera : g.camera.camera;
    const view = viewRect();
    for (const npc of w.npcs) {
      const cur = scene ? null : currentStation(npc.trainer, w.timeMs);
      const gag = cur ? PROPS[`${npc.trainer}:${cur.station.id}`] : undefined;
      let slot = this.pool.get(npc.id);
      // At the station: pottering round its spot (the sim keeps them within a step or two).
      const spot = gag ? routineTarget(w, npc) : null;
      const potter =
        !!spot &&
        Math.hypot(npc.pos.x - spot.x, npc.pos.z - spot.z) < NPC_ROUTINE.near + NPC_ROUTINE.potter;
      if (!potter || !gag) {
        if (slot) slot.prop.hidden = slot.soot.hidden = true;
        continue;
      }
      if (!slot) {
        slot = { prop: el('div', 'routine-prop'), soot: el('div', 'routine-soot') };
        slot.prop.setAttribute('aria-hidden', 'true');
        slot.soot.setAttribute('aria-hidden', 'true');
        this.parent.append(slot.prop, slot.soot);
        this.pool.set(npc.id, slot);
      }
      if (slot.prop.dataset.gag !== gag.gag) {
        slot.prop.dataset.gag = gag.gag;
        slot.prop.textContent = gag.icon;
      }
      // Clover's scarf: a pixel longer each chapter, trailing by chapter 12.
      if (gag.gag === 'scarf') {
        const ch = w.campaign?.chapter ?? 1;
        slot.prop.style.setProperty('--scarf', String(1 + ch * 0.12));
      }
      const { x, z } = npc.pos;
      const ground = s3 ? standHeight(x, z) : terraceY(x, z);
      const place = (e: HTMLDivElement, dx: number, lift: number): boolean => {
        const p = this.v.set(x + dx, ground + lift, z).project(cam);
        const on = p.z <= 1 && p.z >= -1 && Math.abs(p.x) < 1 && Math.abs(p.y) < 1;
        e.hidden = !on;
        if (on) {
          e.style.left = `${view.x + ((p.x + 1) / 2) * view.w}px`;
          e.style.top = `${view.y + ((1 - p.y) / 2) * view.h}px`;
        }
        return on;
      };
      place(slot.prop, 0.55, PROP_LIFT);
      // Sparks's soot: the flash comes every lantern loop; the face stays sooty after it.
      if (gag.gag === 'flash') place(slot.soot, 0, SOOT_LIFT);
      else slot.soot.hidden = true;
    }
  }
}
