import { FOOTPRINT_R9, LIGHT_RING_R9, PORTAL_R9 } from '../config/dungeon-r9-a';
import { DUNGEON, GROVE3D } from '../config/tuning';
import { cellCentre, runFloor, type Floor } from '../sim/dungeon';
import { footprints, guidePath, type GuidePath } from '../sim/dungeon-guide';
import { sightRadius } from '../sim/dungeon-sight';
import { campPortalHere } from '../sim/dungeon-travel';
import type { DungeonRun, Vec2, World } from '../sim/types';
import { actLookOf, openSky } from './cave-bands';
import type { SpriteBatch } from './sprite-batch';
import { sheetFromImage, type SpriteSheet } from './sprites/atlas';
import type { SheetCache } from './sprites/sheets';

/**
 * Lane B round 9, helper a: three Hollow looks shared by both renderers, plus their Pixel
 * drawing. The pure parts (where things stand) are used by `render3d/hollow-r9a-3d.ts` too,
 * so the two views always agree.
 *
 * - The Homing Acorn portal (R0150): a sprouting acorn in a turning leaf-swirl at the return
 *   spot while a portal is open (beside where the Keeper came up in the Grove, or by an act
 *   camp's waypoint stone), and for a moment on the floor where it closes behind the party.
 * - The guide's footprints on the cave floor (R0208): the "Show me the way" path, one print
 *   on every footprint cell, left and right in turn, pointing along the path. They breathe
 *   softly, and hold still under reduced motion.
 * - The Keeper's light (R0190): a faint ring on the cave floor at the sight radius, in the
 *   act's lamp colour.
 *
 * Every canvas is made once and kept in the sheet cache; a frame only draws quads.
 */

// ---- Pure parts (tests/sim/dungeon-r9-a.test.ts) ----

/** Where an open acorn portal stands for the place the Keeper is in, or null. */
export function portalSpot(world: World): Vec2 | null {
  const portal = world.hollow.portal;
  if (!portal) return null;
  const o = PORTAL_R9.offset;
  if (world.location === 'grove' && !world.dungeon) {
    const k = portal.run.returnKeeper;
    return { x: k.x + o.x, z: k.z + o.z };
  }
  if (campPortalHere(world)) {
    const f = runFloor(world);
    if (!f) return null;
    const at = f.stone ? cellCentre(f, f.stone) : world.keeper.pos;
    return { x: at.x + o.x, z: at.z + o.z };
  }
  return null;
}

export interface Footprint {
  x: number;
  z: number;
  /** Heading in world space: 0 is +z, as `Math.atan2(dx, dz)`. */
  angle: number;
  /** -1 a left print, 1 a right one. */
  side: -1 | 1;
  /** Steps along the path, for the soft travelling pulse. */
  step: number;
}

/** The footprints for a guide path on a floor (cells from `footprints`). */
export function footprintMarks(f: Floor, path: GuidePath): Footprint[] {
  const cells = path.cells;
  const out: Footprint[] = [];
  const at = (i: number) => {
    const c = cells[Math.max(0, Math.min(cells.length - 1, i))]!;
    return { x: c % f.cols, y: Math.floor(c / f.cols) };
  };
  footprints(path).forEach((cell, n) => {
    const i = cells.indexOf(cell);
    const a = at(i - 1);
    const b = at(i + 1);
    const angle = Math.atan2(b.x - a.x, b.y - a.y);
    const side: -1 | 1 = n % 2 === 0 ? -1 : 1;
    const p = cellCentre(f, at(i));
    const s = FOOTPRINT_R9.side * side;
    // Sideways is the heading turned a quarter: (cos, -sin) in x and z.
    out.push({
      x: p.x + Math.cos(angle) * s,
      z: p.z - Math.sin(angle) * s,
      angle,
      side,
      step: i,
    });
  });
  return out;
}

/** The guide's footprints for the world now, or none (guide off, no path, open sky). */
export function guideMarks(world: World): Footprint[] {
  const f = runFloor(world);
  if (!f || openSky(f)) return [];
  const path = guidePath(world);
  return path ? footprintMarks(f, path) : [];
}

/** A print's breathing: opacity scale 1 - pulse..1, travelling along the path; 1 when still. */
export function footprintPulse(step: number, nowMs: number, still: boolean): number {
  if (still) return 1;
  const P = FOOTPRINT_R9;
  const wave = 0.5 + 0.5 * Math.sin((nowMs / 1000) * P.pulseCellsPerSec - step * 0.7);
  return 1 - P.pulse * wave;
}

/** The Keeper's light ring: radius in world units and colour, or null above ground. */
export function lightRing(
  f: Floor | null,
  run: DungeonRun | null,
): { r: number; colour: string } | null {
  if (!f || !run || openSky(f)) return null;
  return {
    r: (sightRadius(run) + 0.5) * DUNGEON.cell,
    colour: actLookOf(f)?.lamp ?? GROVE3D.cave.light.keeper.color,
  };
}

/** The leaf-swirl's turn now (radians); still under reduced motion. */
export const portalSpin = (nowMs: number, still: boolean): number =>
  still ? 0 : (nowMs / 1000) * PORTAL_R9.spin;

// ---- Canvas parts (made once) ----

/** The sprouting acorn: a tan nut, a ridged cap, a stalk with two leaves, on a soft glow. */
export function paintAcorn(g: CanvasRenderingContext2D, s: number): void {
  const u = s / 32;
  const glow = g.createRadialGradient(16 * u, 20 * u, 2 * u, 16 * u, 20 * u, 15 * u);
  glow.addColorStop(0, 'rgba(255, 236, 160, 0.75)');
  glow.addColorStop(1, 'rgba(255, 236, 160, 0)');
  g.fillStyle = glow;
  g.fillRect(0, 0, s, s);
  // Nut.
  g.fillStyle = '#c98a4a';
  g.beginPath();
  g.ellipse(16 * u, 21 * u, 7 * u, 8 * u, 0, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = '#e8b878';
  g.beginPath();
  g.ellipse(14 * u, 20 * u, 2.5 * u, 4 * u, -0.3, 0, Math.PI * 2);
  g.fill();
  // Cap.
  g.fillStyle = '#6e4a2a';
  g.beginPath();
  g.ellipse(16 * u, 15 * u, 8.5 * u, 4.5 * u, 0, Math.PI, Math.PI * 2);
  g.lineTo(24.5 * u, 16 * u);
  g.lineTo(7.5 * u, 16 * u);
  g.fill();
  g.strokeStyle = '#4a2e18';
  g.lineWidth = Math.max(1, u);
  for (const x of [11, 16, 21]) {
    g.beginPath();
    g.moveTo(x * u, 11.5 * u);
    g.lineTo(x * u, 16 * u);
    g.stroke();
  }
  // Sprout.
  g.strokeStyle = '#4e8a3a';
  g.lineWidth = Math.max(1, 1.5 * u);
  g.beginPath();
  g.moveTo(16 * u, 11 * u);
  g.quadraticCurveTo(17 * u, 7 * u, 15 * u, 4 * u);
  g.stroke();
  g.fillStyle = '#7ac85a';
  for (const [x, y, r] of [
    [11.5, 5, -0.6],
    [19.5, 6.5, 0.6],
  ] as const) {
    g.beginPath();
    g.ellipse(x * u, y * u, 4 * u, 2 * u, r, 0, Math.PI * 2);
    g.fill();
  }
}

/** The leaf-swirl: eight leaves round a soft green ring, seen from above. */
export function paintSwirl(g: CanvasRenderingContext2D, s: number): void {
  const c = s / 2;
  g.strokeStyle = 'rgba(170, 240, 150, 0.85)';
  g.lineWidth = s * 0.07;
  g.beginPath();
  g.arc(c, c, s * 0.38, 0, Math.PI * 2);
  g.stroke();
  for (let i = 0; i < 8; i++) {
    const t = (i / 8) * Math.PI * 2;
    g.save();
    g.translate(c + Math.cos(t) * s * 0.38, c + Math.sin(t) * s * 0.38);
    g.rotate(t + Math.PI / 2.6);
    g.fillStyle = i % 2 ? '#8ad06a' : '#c8e070';
    g.beginPath();
    g.ellipse(0, 0, s * 0.12, s * 0.055, 0, 0, Math.PI * 2);
    g.fill();
    g.restore();
  }
}

/** One footprint pointing up the canvas (−z on a flat sprite): a sole and three toes. */
export function paintPrint(g: CanvasRenderingContext2D, s: number, angle: number): void {
  g.save();
  g.translate(s / 2, s / 2);
  // Canvas y runs with world +z on a flat sprite, so heading `angle` turns from +y.
  g.rotate(-angle + Math.PI);
  g.fillStyle = 'rgba(255, 238, 200, 0.95)';
  g.beginPath();
  g.ellipse(0, s * 0.08, s * 0.17, s * 0.24, 0, 0, Math.PI * 2);
  g.fill();
  for (const dx of [-0.16, 0, 0.16]) {
    g.beginPath();
    g.arc(dx * s, -s * 0.26 + Math.abs(dx) * s * 0.3, s * 0.075, 0, Math.PI * 2);
    g.fill();
  }
  g.restore();
}

/** The light ring, soft at both edges, in `colour`. */
export function paintRing(g: CanvasRenderingContext2D, s: number, colour: string): void {
  const c = s / 2;
  const w = LIGHT_RING_R9.width;
  const grad = g.createRadialGradient(c, c, c * (1 - w * 2), c, c, c);
  grad.addColorStop(0, 'rgba(0,0,0,0)');
  grad.addColorStop(0.5, colour);
  grad.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = grad;
  g.beginPath();
  g.arc(c, c, c, 0, Math.PI * 2);
  g.fill();
}

const DIRS = 8;
const PRINT_PX = 16;
const ACORN_PX = 32;
const SWIRL_PX = 48;
const RING_PX = 128;

function canvasSheet(
  w: number,
  h: number,
  paint: (g: CanvasRenderingContext2D) => Record<string, [number, number, number, number]>,
): SpriteSheet | null {
  if (typeof document === 'undefined') return null;
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const g = c.getContext('2d');
  if (!g) return null;
  const frames = paint(g);
  return sheetFromImage(c, frames, w, h);
}

/** What the view lends for a frame. */
export interface R9aCtx {
  batch: SpriteBatch;
  sheets: SheetCache;
  nowMs: number;
  reduceMotion: boolean;
}

export class PixelHollowR9a {
  private closing: { startMs: number; at: Vec2 | null } | null = null;
  private readonly rings = new Map<string, SpriteSheet | null>();

  /** The acorn portal closing behind the party (event `portalReturned`). */
  portalReturned(nowMs: number): void {
    this.closing = { startMs: nowMs, at: null };
  }

  /** On a Hollow floor: the light ring, the guide's prints and a closing portal. */
  drawCave(f: Floor, run: DungeonRun, world: World, ctx: R9aCtx): void {
    const { batch, nowMs } = ctx;
    const k = world.keeper.pos;
    const ring = lightRing(f, run);
    const rs = ring ? this.ring(ring.colour) : null;
    const rr = rs?.frames.get('ring');
    if (ring && rs && rr)
      batch.draw({
        sheet: rs,
        rect: rr,
        flip: false,
        x: k.x,
        y: 0.02,
        z: k.z,
        mode: 'flat',
        w: ring.r * 2,
        h: ring.r * 2,
        opacity: LIGHT_RING_R9.opacity,
      });
    const marks = guideMarks(world);
    if (marks.length) {
      const ps = this.prints(ctx.sheets);
      for (const m of marks) {
        const dir = (Math.round((m.angle / (Math.PI * 2)) * DIRS) + DIRS) % DIRS;
        const rect = ps?.frames.get(`p${dir}`);
        if (!ps || !rect) continue;
        const sz = FOOTPRINT_R9.size;
        batch.draw({
          sheet: ps,
          rect,
          flip: false,
          x: m.x,
          y: 0.025,
          z: m.z,
          mode: 'flat',
          w: sz,
          h: sz,
          opacity: FOOTPRINT_R9.opacity * footprintPulse(m.step, nowMs, ctx.reduceMotion),
        });
      }
    }
    const c = this.closing;
    if (c) {
      const age = nowMs - c.startMs;
      if (age > PORTAL_R9.closeMs) this.closing = null;
      else {
        c.at ??= { x: k.x + PORTAL_R9.offset.x, z: k.z + PORTAL_R9.offset.z };
        this.drawPortal(c.at, 1 - age / PORTAL_R9.closeMs, ctx);
      }
    }
    // An act camp with a portal open back into its dungeon.
    const spot = portalSpot(world);
    if (spot) this.drawPortal(spot, 1, ctx);
  }

  /** In the Grove: the open portal by where the Keeper came up. */
  drawGrove(world: World, ctx: R9aCtx): void {
    const spot = portalSpot(world);
    if (spot) this.drawPortal(spot, 1, ctx);
  }

  private drawPortal(at: Vec2, fade: number, ctx: R9aCtx): void {
    const sheet = ctx.sheets.get('r9a-portal', () => portalSheet()!);
    const swirl = sheet.frames.get(`s${swirlFrame(ctx.nowMs, ctx.reduceMotion)}`);
    const acorn = sheet.frames.get('acorn');
    const S = PORTAL_R9;
    if (swirl)
      ctx.batch.draw({
        sheet,
        rect: swirl,
        flip: false,
        x: at.x,
        y: 0.03,
        z: at.z,
        mode: 'flat',
        w: S.ring * 2 * (0.6 + 0.4 * fade),
        h: S.ring * 2 * (0.6 + 0.4 * fade),
        opacity: fade,
      });
    if (acorn)
      ctx.batch.draw({
        sheet,
        rect: acorn,
        flip: false,
        x: at.x,
        y: ctx.reduceMotion ? 0.1 : 0.1 + Math.sin(ctx.nowMs / 500) * 0.06,
        z: at.z,
        mode: 'billboard',
        w: S.size * fade,
        h: S.size * fade,
        opacity: fade,
      });
  }

  private prints(sheets: SheetCache): SpriteSheet | null {
    return sheets.get('r9a-prints', () => printSheet()!);
  }

  private ring(colour: string): SpriteSheet | null {
    let s = this.rings.get(colour);
    if (s === undefined) {
      s = canvasSheet(RING_PX, RING_PX, (g) => {
        paintRing(g, RING_PX, colour);
        return { ring: [0, 0, RING_PX, RING_PX] };
      });
      this.rings.set(colour, s);
    }
    return s;
  }

  dispose(): void {
    for (const s of this.rings.values()) s?.dispose();
    this.rings.clear();
    this.closing = null;
  }
}

/** Four swirl frames a quarter-leaf apart (the leaves repeat every eighth of a turn). */
const SWIRL_FRAMES = 4;
const swirlFrame = (nowMs: number, still: boolean): number => {
  const turn = portalSpin(nowMs, still) / ((Math.PI * 2) / 8);
  return Math.floor((turn - Math.floor(turn)) * SWIRL_FRAMES);
};

function portalSheet(): SpriteSheet | null {
  return canvasSheet(ACORN_PX + SWIRL_PX * SWIRL_FRAMES, SWIRL_PX, (g) => {
    paintAcorn(g, ACORN_PX);
    const frames: Record<string, [number, number, number, number]> = {
      acorn: [0, 0, ACORN_PX, ACORN_PX],
    };
    for (let i = 0; i < SWIRL_FRAMES; i++) {
      const x = ACORN_PX + i * SWIRL_PX;
      g.save();
      g.translate(x + SWIRL_PX / 2, SWIRL_PX / 2);
      g.rotate((i / SWIRL_FRAMES) * ((Math.PI * 2) / 8));
      g.translate(-SWIRL_PX / 2, -SWIRL_PX / 2);
      paintSwirl(g, SWIRL_PX);
      g.restore();
      frames[`s${i}`] = [x, 0, SWIRL_PX, SWIRL_PX];
    }
    return frames;
  });
}

function printSheet(): SpriteSheet | null {
  return canvasSheet(PRINT_PX * DIRS, PRINT_PX, (g) => {
    const frames: Record<string, [number, number, number, number]> = {};
    for (let i = 0; i < DIRS; i++) {
      g.save();
      g.translate(i * PRINT_PX, 0);
      paintPrint(g, PRINT_PX, (i / DIRS) * Math.PI * 2);
      g.restore();
      frames[`p${i}`] = [i * PRINT_PX, 0, PRINT_PX, PRINT_PX];
    }
    return frames;
  });
}
