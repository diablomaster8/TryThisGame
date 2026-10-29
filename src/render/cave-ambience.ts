import { DUNGEON, GROVE3D } from '../config/tuning';
import { cellAt, cellCentre, WALL, type Floor } from '../sim/dungeon';
import type { Particles } from './particles';
import { zoneSprites } from './paint/dungeon-town';

/**
 * The air of the pixel Hollow (item 39): dust motes drifting near the Keeper, drips falling
 * from the wall lips and embers rising off the torches. They are ordinary particles from the
 * existing layer (one draw call, the same pool), made only near the Keeper and only while the
 * particle layer is on: reduced motion and "off" density make none, so nothing strobes.
 */
const A = GROVE3D.cave.pixel.ambience;
const CELL = DUNGEON.cell;

export class CaveAmbience {
  private lastMs = 0;
  private motes = 0;
  private drips = 0;
  private embers = 0;

  update(
    p: Particles,
    f: Floor,
    keeper: { x: number; z: number },
    nowMs: number,
    reduceMotion: boolean,
    density: 'full' | 'light' | 'off',
  ): void {
    const dt = this.lastMs === 0 ? 0 : Math.min(0.1, (nowMs - this.lastMs) / 1000);
    this.lastMs = nowMs;
    if (reduceMotion || density === 'off' || dt === 0) return;
    const k = density === 'light' ? 0.4 : 1;
    this.motes += A.motes.rate * k * dt;
    this.drips += A.drips.rate * k * dt;
    this.embers += A.embers.rate * k * dt;
    while (this.motes >= 1) {
      this.motes -= 1;
      const a = Math.random() * Math.PI * 2;
      const d = Math.sqrt(Math.random()) * A.reach;
      p.burst(
        'mote',
        keeper.x + Math.cos(a) * d,
        0.3 + Math.random() * 2.2,
        keeper.z + Math.sin(a) * d,
        1,
        {
          spread: 0,
          speed: 0.12,
          rise: 0.05,
          lifeMs: A.motes.life,
          size: A.motes.size,
          fadeMs: 1200,
        },
      );
    }
    // Drips: from the foot of a wall near the Keeper, falling from the lip.
    while (this.drips >= 1) {
      this.drips -= 1;
      for (let tries = 0; tries < 8; tries++) {
        const cx = Math.floor((keeper.x + (Math.random() - 0.5) * 2 * A.reach) / CELL + f.cols / 2);
        const cy = Math.floor((keeper.z + (Math.random() - 0.5) * 2 * A.reach) / CELL + f.rows / 2);
        if (cellAt(f, cx, cy) === WALL || cellAt(f, cx, cy - 1) !== WALL) continue;
        const c = cellCentre(f, { x: cx, y: cy });
        p.burst(
          'drop',
          c.x + (Math.random() - 0.5) * CELL * 0.6,
          GROVE3D.cave.pixel.wallH * 0.7,
          c.z - CELL * 0.46,
          1,
          {
            spread: 0,
            speed: 0,
            rise: 0,
            lifeMs: A.drips.life,
            size: A.drips.size,
            fadeMs: 80,
          },
        );
        break;
      }
    }
    // Embers off the nearest torches, from the sconce on the wall.
    while (this.embers >= 1) {
      this.embers -= 1;
      const near = f.torches
        .map((t) => cellCentre(f, t))
        .filter((c) => Math.hypot(c.x - keeper.x, c.z - keeper.z) < A.reach + 3);
      const t = near[Math.floor(Math.random() * near.length)];
      if (!t) break;
      p.burst('ember', t.x, GROVE3D.cave.pixel.sconceY - 0.3, t.z - CELL * 0.4, 1, {
        spread: 0.1,
        speed: 0.12,
        rise: 0.45,
        lifeMs: A.embers.life,
        size: A.embers.size,
        fadeMs: 300,
      });
    }
  }
}

/**
 * The standing part of a floor's landmark (item 18), as sprites from the dungeon sheet: one
 * billboard for most kinds, a ring of small mushrooms round the centre for 'mushroomRing'.
 * The ground under it is painted into the floor texture.
 */
export function landmarkSprites(f: Floor): Array<{ key: string; x: number; z: number; r: number }> {
  const lm = f.landmark;
  if (!lm) return zoneSprites(f);
  const c = cellCentre(f, lm.cell);
  if (lm.kind !== 'mushroomRing') return [{ key: `lm-${lm.kind}`, x: c.x, z: c.z, r: 0.9 }];
  const out: Array<{ key: string; x: number; z: number; r: number }> = [];
  for (let k = 0; k < 9; k++) {
    const a = (k / 9) * Math.PI * 2;
    out.push({
      key: 'lm-mushroom',
      x: c.x + Math.cos(a) * CELL * 1.7,
      z: c.z + Math.sin(a) * CELL * 1.7,
      r: 0.25,
    });
  }
  return out;
}
