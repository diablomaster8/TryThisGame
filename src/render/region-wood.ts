import type { ReadonlyWorld } from './readonly-world';
import * as THREE from 'three';
import type { LayoutChunk, RegionLayout } from '../config/region-layout';
import { WOOD_POIS } from '../config/region-wood';
import { WORLD_STREAM } from '../config/tuning-world';
import { regionLook } from './region-look';
import { setWoodSeason, woodSheet } from './paint/wood';
import { SEASON_LOOK } from '../config/region-season-look';
import { groundSize, groundTexture, paintRegionGround, WOOD_GROUND } from './region-ground';
import type { RegionPx } from './region-host-px';
import type { SpriteBatch, SpriteDraw } from './sprite-batch';
import { millWheelMul } from '../sim/region-weather-play';

/**
 * WORLD-25 (R11 lane D): the Wood in the pixel view, a lazy chunk the region host loads on the
 * approach (`render/region-host-px.ts`). The ground is painted once from the layout (the dapple
 * painted in); every tree, prop and landmark is a billboard handed out per chunk, so only the
 * chunks round the Keeper are ever walked and the batch culls the rest of the frame.
 */

/** The landmarks the Wood's own code stands on its points of interest: look, width (units). */
const LANDMARKS: Record<string, { key: string; w: number; dx?: number; dz?: number }> = {
  'old-oak': { key: 'oak', w: 9.4, dz: -1 },
  'hollow-tree': { key: 'hollow', w: 4.4 },
  'old-mill': { key: 'mill', w: 6.9, dx: -2, dz: -2 },
  // R12 lane D: the vine wall is a gate now, drawn while shut by `region-life-px.ts`.
  lookout: { key: 'lookout', w: 3.8 },
  woodcutter: { key: 'prop-0', w: 2 },
  'mushroom-ring': { key: 'prop-1', w: 2.4 },
};

function sprite(key: string, x: number, z: number, w: number, flip = false): SpriteDraw | null {
  const sheet = woodSheet();
  const rect = sheet.frames.get(key);
  if (!rect) return null;
  return {
    sheet,
    rect,
    flip,
    x,
    y: 0,
    z,
    mode: 'billboard',
    w,
    h: (w * rect.h) / rect.w,
  };
}

class WoodPx implements RegionPx {
  readonly ground: THREE.Mesh;
  private readonly tex: THREE.CanvasTexture;

  constructor(private readonly l: RegionLayout) {
    this.tex = groundTexture(paintRegionGround(l, WOOD_GROUND, true));
    const geo = new THREE.PlaneGeometry(groundSize(l).w, groundSize(l).h);
    geo.rotateX(-Math.PI / 2);
    this.ground = new THREE.Mesh(geo, new THREE.MeshLambertMaterial({ map: this.tex }));
    this.ground.name = 'region-wood-ground';
    this.ground.receiveShadow = true;
    // Under the sprites and the Keeper's shadow, like the Grove's ground.
    this.ground.renderOrder = -1;
    // R0118: the season the Keeper's place wears, applied once a frame the ground is drawn.
    const mat = this.ground.material as THREE.MeshLambertMaterial;
    let worn = '';
    this.ground.onBeforeRender = () => {
      const s = regionLook.season ?? 'summer';
      if (s === worn) return;
      worn = s;
      setWoodSeason(s);
      const look = SEASON_LOOK[s];
      mat.color.set(look.ground);
      mat.emissive.set(look.wash.color).multiplyScalar(look.wash.amount);
    };
  }

  /** The host calls this on each drawn sprite: the crowns follow the season's sheet. */
  restyle(d: SpriteDraw): void {
    d.sheet = woodSheet();
  }

  chunkDraws(c: LayoutChunk): SpriteDraw[] {
    const out: SpriteDraw[] = [];
    const push = (d: SpriteDraw | null) => d && out.push(d);
    for (const i of c.trees) {
      const t = this.l.trees[i]!;
      const w = (t.kind === 2 ? 3.6 : 4.6) * t.s;
      push(sprite(`tree-${t.kind}`, t.x, t.z, w, (i & 1) === 1));
    }
    for (const i of c.props) {
      const p = this.l.props[i]!;
      push(sprite(`prop-${p.kind}`, p.x, p.z, 1.6));
    }
    const size = WORLD_STREAM.chunk;
    for (const p of WOOD_POIS) {
      const m = LANDMARKS[p.id];
      if (!m) continue;
      const x = p.x + (m.dx ?? 0);
      const z = p.z + (m.dz ?? 0);
      if (Math.floor(x / size) !== c.cx || Math.floor(z / size) !== c.cz) continue;
      push(sprite(m.key, x, z, m.w));
    }
    return out;
  }

  dispose(): void {
    this.tex.dispose();
    this.ground.geometry.dispose();
    (this.ground.material as THREE.Material).dispose();
  }
}

export function createRegionPx(l: RegionLayout): RegionPx {
  return new WoodPx(l);
}

/** The wheel's frames a second, dry; rain multiplies it (the sim's `millWheelMul`). */
const WHEEL_FPS = 2.5;

/** R0089 (R13 d1): the mill's wheel turns, faster in rain, held still under reduced motion. */
export function drawDynamic(batch: SpriteBatch, world: ReadonlyWorld, tint: number): void {
  const mill = WOOD_POIS.find((p) => p.id === 'old-mill');
  if (!mill) return;
  const still =
    typeof document !== 'undefined' && document.documentElement.classList.contains('reduce-motion');
  const frame = still ? 0 : Math.floor((world.timeMs / 1000) * WHEEL_FPS * millWheelMul(world)) & 1;
  const d = sprite(`wheel-${frame}`, mill.x - 2 + 2.19, mill.z - 2 + 0.05, 2.9);
  if (!d) return;
  d.y = 0.18;
  d.tint = tint;
  batch.draw(d);
}

/** The tree tunnel's arch: at the Grove's north wood and at the Wood's south gate. */
export function drawEntrance(
  batch: SpriteBatch,
  x: number,
  z: number,
  tint: number,
  fade?: ((d: SpriteDraw) => number) | null,
): void {
  const d = sprite('arch', x, z, 7.4);
  if (!d) return;
  d.tint = tint;
  d.opacity = fade ? fade(d) : 1;
  batch.draw(d);
}
