import { waypointCell, waypointHere } from '../sim/dungeon-levels';
import { foundSecrets } from '../sim/dungeon-secrets';
import '../dungeon.css';
import { HOLLOW_AUTOMAP_TEXT as A, HOLLOW_MAP_TEXT as T } from '../config/strings';
import { DUNGEON, GROVE3D, HOLLOW } from '../config/tuning';
import { isGameKey } from '../input/keys';
import {
  cellOf,
  CHASM,
  exploredMask,
  exploredRooms,
  floorOfRun,
  WALL,
  WATER,
  type Cell,
  type Floor,
} from '../sim/dungeon';
import type { DungeonRun, World } from '../sim/types';
import { button, el } from './dom';
import { screenBearing } from './hud-world-math';
import { footprints, guidePath } from '../sim/dungeon-guide';
import { ghostTrail } from '../sim/dungeon-speed';
import { HOLLOW_R8_TEXT } from '../config/strings-hollow-r8-party';
import { guideOn } from '../sim/dungeon-kid';
import { HOLLOW_R9D } from '../config/dungeon-r9-d';

/**
 * The Hollow's maps (item 40, R0154), drawn from the sim's explored mask so they work in
 * both renderers. The map button in the floor bar cycles off → corner → over the cave; M
 * toggles the corner map and Tab the overlay on a desktop, Escape closes either.
 *
 * - The corner map: a small panel under the floor bar, seen rooms glowing faintly.
 * - The overlay (Diablo II's Tab map): the explored walls as outlines over the game at half
 *   opacity, centred on the Keeper and turning with the camera, plus a "show me the way"
 *   chevron toward the stairs down once they are seen. It ignores taps, has no animation
 *   of its own (the camera's yaw already eases, or snaps under reduced motion), and keeps
 *   the corner panel's legend on screen.
 *
 * Every marker has its own shape and a legend line, so colour is never the only signal.
 * Waypoints, portals, shrines, uniques and quests are hooks: drawn only when a floor
 * carries them (the sim has none yet).
 */

export type MapMode = 'off' | 'corner' | 'overlay';

export type MarkKind =
  | 'you'
  | 'party'
  | 'up'
  | 'down'
  | 'chest'
  | 'waypoint'
  | 'portal'
  | 'shrine'
  | 'unique'
  | 'quest'
  | 'stray'
  | 'secret';

export type MarkShape =
  | 'ringDot'
  | 'smallCircle'
  | 'triUp'
  | 'triDown'
  | 'square'
  | 'diamond'
  | 'capsule'
  | 'sparkle'
  | 'twinkle'
  | 'star'
  | 'bang'
  | 'cross';

/** Each marker's shape, colour and legend line. */
export const MARKS: Record<MarkKind, { shape: MarkShape; icon: string; color: string }> = {
  you: { shape: 'ringDot', icon: '●', color: '#ff6fa8' },
  party: { shape: 'smallCircle', icon: '○', color: '#e8f4ff' },
  up: { shape: 'triUp', icon: '▲', color: '#9ad8ff' },
  down: { shape: 'triDown', icon: '▼', color: '#ffd870' },
  chest: { shape: 'square', icon: '■', color: '#ffb347' },
  waypoint: { shape: 'diamond', icon: '◆', color: '#8ff0c8' },
  portal: { shape: 'capsule', icon: '⬮', color: '#7fa8ff' },
  shrine: { shape: 'sparkle', icon: '✦', color: '#fff0a0' },
  unique: { shape: 'star', icon: '★', color: '#ff9a6a' },
  quest: { shape: 'bang', icon: '!', color: '#ffe14d' },
  stray: { shape: 'cross', icon: '✕', color: '#c8a8ff' },
  // Lane B r8: a found secret room (R0182).
  secret: { shape: 'twinkle', icon: '✧', color: '#d8f0ff' },
};

/** The marker kinds a floor may carry before the sim has them (the hooks). */
const HOOKS = ['waypoint', 'portal', 'shrine', 'unique', 'quest'] as const;
type HookFloor = Partial<Record<(typeof HOOKS)[number], ReadonlyArray<Cell>>>;

export interface Mark {
  kind: MarkKind;
  /** Cell coordinates of the centre (fractional for actors). */
  x: number;
  y: number;
  /** A chest already opened is drawn dimmed. */
  dim?: boolean;
}

/** Fractional cell coordinates of a world position (cell centres at x.5). */
export function cellPoint(f: Floor, p: { x: number; z: number }): { x: number; y: number } {
  return { x: p.x / DUNGEON.cell + f.cols / 2, y: p.z / DUNGEON.cell + f.rows / 2 };
}

/**
 * The outline of the explored walls: one segment (x0, y0, x1, y1 in cell units) for each
 * side of a seen open cell that faces rock or the floor's edge.
 */
export function wallEdges(f: Floor, mask: Uint8Array): Float32Array {
  const out: number[] = [];
  const open = (x: number, y: number) =>
    x >= 0 && y >= 0 && x < f.cols && y < f.rows && f.cells[y * f.cols + x] !== WALL;
  for (let y = 0; y < f.rows; y++)
    for (let x = 0; x < f.cols; x++) {
      const i = y * f.cols + x;
      if (mask[i] !== 1 || f.cells[i] === WALL) continue;
      if (!open(x, y - 1)) out.push(x, y, x + 1, y);
      if (!open(x, y + 1)) out.push(x, y + 1, x + 1, y + 1);
      if (!open(x - 1, y)) out.push(x, y, x, y + 1);
      if (!open(x + 1, y)) out.push(x + 1, y, x + 1, y + 1);
    }
  return new Float32Array(out);
}

/** The seen markers on the floor, the Keeper last so it draws on top. */
export function automapMarks(world: World, run: DungeonRun, f: Floor): Mark[] {
  const mask = exploredMask(run, f);
  const seen = (c: Cell) =>
    c.x >= 0 && c.y >= 0 && c.x < f.cols && c.y < f.rows && mask[c.y * f.cols + c.x] === 1;
  const at = (kind: MarkKind, c: Cell, dim = false): Mark => ({
    kind,
    x: c.x + 0.5,
    y: c.y + 0.5,
    ...(dim ? { dim } : {}),
  });
  const out: Mark[] = [];
  if (seen(f.stairsUp)) out.push(at('up', f.stairsUp));
  if (f.stairsDown && seen(f.stairsDown)) out.push(at('down', f.stairsDown));
  if (seen(f.chest)) out.push(at('chest', f.chest, run.chestOpen));
  const hooks = f as Floor & HookFloor;
  for (const k of HOOKS) for (const c of hooks[k] ?? []) if (seen(c)) out.push(at(k, c));
  // The level's waypoint stone (R0148), once seen.
  if (waypointHere(run)) {
    const c = waypointCell(f);
    if (seen(c)) out.push(at('waypoint', c));
  }
  // Shrines (R0159), dimmed once used.
  for (const s of f.shrines ?? [])
    if (seen(s.cell)) out.push(at('shrine', s.cell, run.shrinesUsed?.includes(s.id) ?? false));
  // Lane B r8: found secret rooms (R0182), at their mouth.
  for (const s of foundSecrets(run, f)) out.push(at('secret', s.door[0]!));
  // Strays once seen (R0162), where they are now.
  for (const s of run.strays) if (s.seen) out.push({ kind: 'stray', ...cellPoint(f, s.pos) });
  for (const id of run.party) {
    const n = world.nubbins.find((m) => m.id === id);
    if (n) out.push({ kind: 'party', ...cellPoint(f, n.pos) });
  }
  out.push({ kind: 'you', ...cellPoint(f, world.keeper.pos) });
  return out;
}

/** The slice of the 2D context the maps use, so the tests can time a draw without a canvas. */
export type Ctx2D = Pick<
  CanvasRenderingContext2D,
  | 'setTransform'
  | 'clearRect'
  | 'beginPath'
  | 'moveTo'
  | 'lineTo'
  | 'closePath'
  | 'stroke'
  | 'fill'
  | 'arc'
  | 'fillRect'
  | 'strokeRect'
  | 'fillStyle'
  | 'strokeStyle'
  | 'lineWidth'
  | 'lineJoin'
  | 'globalAlpha'
>;

/** Draw one marker centred on (x, y) in screen pixels, `r` its half-size. */
export function drawMark(g: Ctx2D, kind: MarkKind, x: number, y: number, r: number, dim = false) {
  const m = MARKS[kind];
  g.fillStyle = dim ? '#a8a0b8' : m.color;
  g.strokeStyle = '#0d0918';
  g.lineWidth = 2;
  g.lineJoin = 'round';
  const poly = (pts: ReadonlyArray<readonly [number, number]>) => {
    g.beginPath();
    pts.forEach(([px, py], i) =>
      i ? g.lineTo(x + px * r, y + py * r) : g.moveTo(x + px * r, y + py * r),
    );
    g.closePath();
    g.stroke();
    g.fill();
  };
  const circle = (rad: number) => {
    g.beginPath();
    g.arc(x, y, rad, 0, Math.PI * 2);
    g.stroke();
    g.fill();
  };
  switch (m.shape) {
    case 'ringDot':
      circle(r * 1.05);
      g.strokeStyle = '#ffffff';
      g.lineWidth = 1.5;
      g.stroke();
      break;
    case 'smallCircle':
      circle(HOLLOW.automap.partyPx);
      break;
    case 'triUp':
      poly([
        [-1, 0.8],
        [1, 0.8],
        [0, -0.9],
      ]);
      break;
    case 'triDown':
      poly([
        [-1, -0.8],
        [1, -0.8],
        [0, 0.9],
      ]);
      break;
    case 'square':
      g.strokeRect(x - r * 0.8, y - r * 0.6, r * 1.6, r * 1.2);
      g.fillRect(x - r * 0.8, y - r * 0.6, r * 1.6, r * 1.2);
      break;
    case 'diamond':
      poly([
        [0, -1],
        [0.8, 0],
        [0, 1],
        [-0.8, 0],
      ]);
      break;
    case 'capsule':
      poly([
        [-0.5, -0.6],
        [0, -1],
        [0.5, -0.6],
        [0.5, 0.6],
        [0, 1],
        [-0.5, 0.6],
      ]);
      break;
    case 'cross':
      poly([
        [-1, -0.7],
        [-0.7, -1],
        [0, -0.3],
        [0.7, -1],
        [1, -0.7],
        [0.3, 0],
        [1, 0.7],
        [0.7, 1],
        [0, 0.3],
        [-0.7, 1],
        [-1, 0.7],
        [-0.3, 0],
      ]);
      break;
    case 'sparkle':
      poly([
        [0, -1],
        [0.25, -0.25],
        [1, 0],
        [0.25, 0.25],
        [0, 1],
        [-0.25, 0.25],
        [-1, 0],
        [-0.25, -0.25],
      ]);
      break;
    case 'twinkle':
      // Lane B r8: a found secret room, a sparkle turned on its corner.
      poly([
        [0.7, -0.7],
        [0.2, 0],
        [0.7, 0.7],
        [0, 0.2],
        [-0.7, 0.7],
        [-0.2, 0],
        [-0.7, -0.7],
        [0, -0.2],
      ]);
      break;
    case 'star': {
      const pts: Array<[number, number]> = [];
      for (let k = 0; k < 10; k++) {
        const a = (k * Math.PI) / 5 - Math.PI / 2;
        const rr = k % 2 ? 0.45 : 1;
        pts.push([Math.cos(a) * rr, Math.sin(a) * rr]);
      }
      poly(pts);
      break;
    }
    case 'bang':
      poly([
        [-0.3, -1],
        [0.3, -1],
        [0.18, 0.3],
        [-0.18, 0.3],
      ]);
      g.beginPath();
      g.arc(x, y + r * 0.72, r * 0.24, 0, Math.PI * 2);
      g.stroke();
      g.fill();
      break;
  }
}

export interface OverlayView {
  /** CSS pixels of the canvas, and its device-pixel ratio. */
  w: number;
  h: number;
  dpr: number;
  /** Pixels per cell. */
  scale: number;
  yaw: number;
}

/** Pixels per cell for the overlay: the floor fits the screen, within the tuned range. */
export function overlayScale(f: Floor, w: number, h: number): number {
  const C = HOLLOW.automap;
  const fit = (Math.min(w, h) * C.fitShare) / Math.max(f.cols, f.rows);
  return Math.max(C.cellPx.min, Math.min(C.cellPx.max, Math.floor(fit)));
}

/**
 * Draw the overlay: the wall outline turned by the camera's yaw around the Keeper at the
 * screen's centre, the markers upright on top, and the chevron toward the stairs down.
 * Pure over `g`, so it can be timed in a test.
 */
export function drawOverlay(
  g: Ctx2D,
  v: OverlayView,
  edges: Float32Array,
  marks: readonly Mark[],
  keeper: { x: number; y: number },
  down: { x: number; y: number } | null,
  trails?: MapTrails,
): void {
  g.setTransform(v.dpr, 0, 0, v.dpr, 0, 0);
  g.clearRect(0, 0, v.w, v.h);
  const cx = v.w / 2;
  const cy = v.h / 2;
  // Cell (x, y) → screen: rotate (x - kx, y - ky) by the yaw (screen right and down are
  // (cos, sin) and (-sin, cos) in cells; see `screenBearing`), scale, centre.
  const s = v.scale;
  const cos = Math.cos(v.yaw);
  const sin = Math.sin(v.yaw);
  const a = s * cos;
  const b = s * sin;
  const c = -s * sin;
  const d = s * cos;
  const e = cx - (a * keeper.x + c * keeper.y);
  const f = cy - (b * keeper.x + d * keeper.y);
  g.setTransform(v.dpr * a, v.dpr * b, v.dpr * c, v.dpr * d, v.dpr * e, v.dpr * f);
  g.beginPath();
  for (let i = 0; i < edges.length; i += 4) {
    g.moveTo(edges[i]!, edges[i + 1]!);
    g.lineTo(edges[i + 2]!, edges[i + 3]!);
  }
  g.strokeStyle = '#d8ecff';
  g.lineWidth = 2 / s;
  g.stroke();
  if (trails) drawTrails(g, trails, 1 / s);
  g.setTransform(v.dpr, 0, 0, v.dpr, 0, 0);
  const r = HOLLOW.automap.markPx;
  for (const m of marks)
    drawMark(g, m.kind, a * m.x + c * m.y + e, b * m.x + d * m.y + f, r, m.dim ?? false);
  if (down) {
    const dx = down.x - keeper.x;
    const dy = down.y - keeper.y;
    if (dx * dx + dy * dy > 4) drawChevron(g, cx, cy, screenBearing(dx, dy, v.yaw));
  }
}

/** The "show me the way" chevron, `chevronPx` out from the Keeper along the bearing. */
function drawChevron(g: Ctx2D, cx: number, cy: number, bearing: number): void {
  const R = HOLLOW.automap.chevronPx;
  const ux = Math.sin(bearing);
  const uy = -Math.cos(bearing);
  const px = -uy;
  const py = ux;
  const tip = { x: cx + ux * (R + 8), y: cy + uy * (R + 8) };
  const back = { x: cx + ux * R, y: cy + uy * R };
  g.beginPath();
  g.moveTo(back.x + px * 8 - ux * 4, back.y + py * 8 - uy * 4);
  g.lineTo(tip.x, tip.y);
  g.lineTo(back.x - px * 8 - ux * 4, back.y - py * 8 - uy * 4);
  g.strokeStyle = '#0d0918';
  g.lineWidth = 6;
  g.lineJoin = 'round';
  g.stroke();
  g.strokeStyle = MARKS.down.color;
  g.lineWidth = 3;
  g.stroke();
}

export class HollowMap {
  /** The toggle, to sit in the floor bar. */
  readonly toggle: HTMLButtonElement;
  readonly panel: HTMLDivElement;
  private readonly canvas = el('canvas', 'hollow-map-canvas');
  private readonly g = this.canvas.getContext('2d');
  private readonly legend = el('div', 'hollow-map-legend');
  private readonly overlay = el('canvas', 'hollow-automap');
  private readonly og = this.overlay.getContext('2d');
  private mode: MapMode = 'off';
  /** The mode to go back to when Tab closes the overlay. */
  private beforeOverlay: MapMode = 'off';
  private key = '';
  private overlayKey = '';
  private edgeKey = '';
  private edges: Float32Array = new Float32Array(0);
  private legendKey = '';
  private underground = false;
  private trailLegend = { guide: false, ghost: false };

  constructor(parent: HTMLElement) {
    this.toggle = button('🗺', () => this.cycle(), 'btn btn-small hollow-map-btn');
    this.toggle.title = A.keys;
    this.panel = el('div', 'hollow-map');
    this.panel.hidden = true;
    this.panel.setAttribute('role', 'region');
    this.panel.setAttribute('aria-label', T.open);
    this.panel.append(this.canvas, this.legend);
    parent.appendChild(this.panel);
    this.overlay.hidden = true;
    this.overlay.setAttribute('role', 'img');
    this.overlay.style.opacity = String(HOLLOW.automap.overlayAlpha);
    // Collapsed by default on a phone-sized screen, where the cave matters more.
    const C = HOLLOW.automap;
    this.mode = window.innerWidth >= C.phoneW && window.innerHeight >= C.phoneH ? 'corner' : 'off';
    // R0193 (lane B r9): a narrow phone gets the small round corner map instead (CSS), and a
    // tap on it opens the full map.
    if (window.innerWidth <= HOLLOW_R9D.phone.maxWidth) this.mode = 'corner';
    this.canvas.addEventListener('click', () => {
      if (document.documentElement.classList.contains('hollow-phone')) this.phoneTap();
    });
    this.labelToggle();
    window.addEventListener('keydown', (e) => {
      if (!this.underground) return;
      if (e.key === 'Escape' && this.mode !== 'off') this.set('off');
      else if ((e.key === 'm' || e.key === 'M') && isGameKey(e) && !e.repeat)
        this.set(this.mode === 'corner' ? 'off' : 'corner');
      else if (e.key === 'Tab' && isGameKey(e) && !e.shiftKey && !inDialog(e.target)) {
        // Tab is the map here, not focus travel; inside a dialog it keeps its usual job.
        e.preventDefault();
        if (!e.repeat) this.set(this.mode === 'overlay' ? this.beforeOverlay : 'overlay');
      }
    });
  }

  /** R0193: the phone bar's 🗺 and a tap on the round map: the full map, or back. */
  phoneTap(): void {
    this.set(this.mode === 'overlay' ? 'corner' : 'overlay');
  }

  /** The phone's way: off → corner → overlay → off. */
  private cycle(): void {
    this.set(this.mode === 'off' ? 'corner' : this.mode === 'corner' ? 'overlay' : 'off');
  }

  private set(mode: MapMode): void {
    if (mode === 'overlay' && this.mode !== 'overlay') this.beforeOverlay = this.mode;
    this.mode = mode;
    this.key = this.overlayKey = this.legendKey = '';
    this.labelToggle();
    this.show();
  }

  private labelToggle(): void {
    this.toggle.setAttribute('aria-label', A.button[this.mode]);
    this.toggle.setAttribute('aria-pressed', String(this.mode !== 'off'));
    this.toggle.setAttribute('aria-expanded', String(this.mode !== 'off'));
  }

  private show(): void {
    const on = this.underground;
    this.panel.hidden = !on || this.mode === 'off';
    // Over the cave, the panel keeps only its legend.
    this.canvas.hidden = this.mode !== 'corner';
    this.overlay.hidden = !on || this.mode !== 'overlay';
    if (!this.overlay.hidden && !this.overlay.isConnected) {
      // Behind the rest of the HUD: the HUD root is the floor bar's parent.
      const root = this.panel.parentElement?.parentElement ?? document.body;
      root.insertBefore(this.overlay, root.firstChild);
    }
  }

  /** Called every frame by the floor bar; `yaw` is the camera's. */
  refresh(world: World, yaw = 0): void {
    const run = world.location === 'dungeon' ? world.dungeon : null;
    this.underground = !!run;
    this.toggle.hidden = !run;
    this.show();
    if (!run || this.mode === 'off') return;
    const f = floorOfRun(run);
    const marks = automapMarks(world, run, f);
    this.refreshLegend(world, marks, run, f);
    if (this.mode === 'corner') this.drawCorner(world, run, f, marks);
    else this.drawOverlay(world, run, f, marks, yaw);
  }

  /** The legend lists what this floor's map can show; hooks only once one is on it. */
  private refreshLegend(world: World, marks: readonly Mark[], run: DungeonRun, f: Floor): void {
    const kinds = new Set<MarkKind>(['you', 'party', 'up', 'down', 'chest']);
    for (const m of marks) kinds.add(m.kind);
    const way = this.mode === 'overlay' && wayShown(run, f);
    const t = mapTrails(world, run, f);
    this.trailLegend = { guide: !!t?.steps.length, ghost: !!t?.ghost.length };
    const tl = this.trailLegend;
    const key = `${[...kinds].join()}:${way}:${tl.guide}:${tl.ghost}`;
    if (key === this.legendKey) return;
    this.legendKey = key;
    this.legend.replaceChildren();
    for (const k of Object.keys(MARKS) as MarkKind[])
      if (kinds.has(k)) this.legend.appendChild(el('span', undefined, `${MARKS[k].icon} ${A[k]}`));
    if (way) this.legend.appendChild(el('span', undefined, `➤ ${A.way}`));
    if (tl.guide) this.legend.appendChild(el('span', undefined, HOLLOW_R8_TEXT.guideLegend));
    if (tl.ghost) this.legend.appendChild(el('span', undefined, HOLLOW_R8_TEXT.ghostLegend));
  }

  private drawOverlay(
    world: World,
    run: DungeonRun,
    f: Floor,
    marks: readonly Mark[],
    yaw: number,
  ): void {
    const g = this.og;
    if (!g) return;
    const w = window.innerWidth;
    const h = window.innerHeight;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const k = cellPoint(f, world.keeper.pos);
    const assists = `${guideOn(world)}:${!!world.hollow.speedRun}`;
    const key = `${run.seed}:${run.depth}:${run.explored}:${marks
      .map((m) => `${m.x.toFixed(2)},${m.y.toFixed(2)}`)
      .join(';')}:${yaw.toFixed(3)}:${w}x${h}@${dpr}:${run.chestOpen}:${assists}`;
    if (key === this.overlayKey) return;
    this.overlayKey = key;
    if (this.overlay.width !== Math.round(w * dpr) || this.overlay.height !== Math.round(h * dpr)) {
      this.overlay.width = Math.round(w * dpr);
      this.overlay.height = Math.round(h * dpr);
    }
    this.overlay.setAttribute('aria-label', A.overlay(run.depth));
    const edgeKey = `${run.seed}:${run.depth}:${run.explored}`;
    if (edgeKey !== this.edgeKey) {
      this.edgeKey = edgeKey;
      this.edges = wallEdges(f, exploredMask(run, f));
    }
    const down = wayShown(run, f) && f.stairsDown ? f.stairsDown : null;
    drawOverlay(
      g,
      { w, h, dpr, scale: overlayScale(f, w, h), yaw },
      this.edges,
      marks,
      k,
      down ? { x: down.x + 0.5, y: down.y + 0.5 } : null,
      mapTrails(world, run, f) ?? undefined,
    );
  }

  /** The corner map: seen cells filled, rooms brighter, then the markers. */
  private drawCorner(world: World, run: DungeonRun, f: Floor, marks: readonly Mark[]): void {
    const g = this.g;
    if (!g) return;
    const kc = cellOf(f, world.keeper.pos);
    const party = marks
      .filter((m) => m.kind === 'party')
      .map((m) => `${Math.floor(m.x)},${Math.floor(m.y)}`)
      .join(';');
    const assists = `${guideOn(world)}:${!!world.hollow.speedRun}`;
    const level = `${run.seed}:${run.depth}:${run.explored}`;
    const keyR8 = `${level}:${kc.x},${kc.y}:${run.chestOpen}:${party}:${assists}`;
    if (keyR8 === this.key) return;
    this.key = keyR8;
    const { maxPx } = GROVE3D.cave.read.map;
    const s = Math.max(2, Math.floor(maxPx / Math.max(f.cols, f.rows)));
    const w = f.cols * s;
    const h = f.rows * s;
    if (this.canvas.width !== w || this.canvas.height !== h) {
      this.canvas.width = w;
      this.canvas.height = h;
    }
    this.canvas.style.width = `${w}px`;
    this.canvas.style.height = `${h}px`;
    this.canvas.setAttribute('role', 'img');
    this.canvas.setAttribute('aria-label', T.label(run.depth));
    g.setTransform(1, 0, 0, 1, 0, 0);
    g.clearRect(0, 0, w, h);
    g.fillStyle = '#0d0918';
    g.fillRect(0, 0, w, h);
    const mask = exploredMask(run, f);
    const seen = (x: number, y: number) =>
      x >= 0 && y >= 0 && x < f.cols && y < f.rows && mask[y * f.cols + x] === 1;
    const inRoom = new Uint8Array(f.cells.length);
    const lit = exploredRooms(run, f);
    f.rooms.forEach((r, i) => {
      if (!lit[i]) return;
      for (let y = r.y; y < r.y + r.h; y++)
        for (let x = r.x; x < r.x + r.w; x++) inRoom[y * f.cols + x] = 1;
    });
    const near = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ] as const;
    for (let y = 0; y < f.rows; y++)
      for (let x = 0; x < f.cols; x++) {
        if (!seen(x, y)) continue;
        const i = y * f.cols + x;
        const c = f.cells[i];
        if (c === WALL) {
          // Only the rock that borders open ground, so the outline reads and the rest stays dark.
          const edge = near.some(
            ([dx, dy]) => (f.cells[(y + dy) * f.cols + x + dx] ?? WALL) !== WALL,
          );
          if (!edge) continue;
          g.fillStyle = '#3a3258';
        } else if (c === CHASM) {
          // A gap (R0031): near-black with a pale slash, so it reads by shape as well as tone.
          g.fillStyle = '#120e22';
          g.fillRect(x * s, y * s, s, s);
          g.strokeStyle = '#6f8fd0';
          g.beginPath();
          g.moveTo(x * s, (y + 1) * s);
          g.lineTo((x + 1) * s, y * s);
          g.stroke();
          continue;
        } else if (c === WATER) g.fillStyle = inRoom[i] ? '#3d86ad' : '#2f6a8a';
        else g.fillStyle = inRoom[i] ? '#7a6bc0' : '#4a4378';
        g.fillRect(x * s, y * s, s, s);
      }
    // R0187's ghost line and R0208's footprints, under the markers.
    const trails = mapTrails(world, run, f);
    if (trails) {
      g.save();
      g.scale(s, s);
      drawTrails(g, trails, 1 / s);
      g.restore();
    }
    const big = Math.max(5, s * 1.6);
    // The Keeper's dot sits on its cell's centre, as before; the rest where they stand.
    for (const m of marks) {
      const p = m.kind === 'you' ? { x: kc.x + 0.5, y: kc.y + 0.5 } : m;
      drawMark(g, m.kind, p.x * s, p.y * s, big, m.dim ?? false);
    }
  }
}

/** The chevron shows once the stairs down have been seen. */
function wayShown(run: DungeonRun, f: Floor): boolean {
  const d = f.stairsDown;
  return !!d && exploredMask(run, f)[d.y * f.cols + d.x] === 1;
}

function inDialog(t: EventTarget | null): boolean {
  const n = t as { closest?: (s: string) => Element | null } | null;
  return !!n?.closest?.('[role="dialog"], dialog, .modal');
}

// ---------------------------------------------------------------- lane B round 8

/** R0187's ghost line and R0208's footprints, as cell centres in map cells. */
export interface MapTrails {
  ghost: Array<{ x: number; y: number }>;
  steps: Array<{ x: number; y: number }>;
}

function centreOf(f: Floor, i: number): { x: number; y: number } {
  const x = i % f.cols;
  return { x: x + 0.5, y: (i - x) / f.cols + 0.5 };
}

/** What the maps draw for this level, or null when neither assist has anything. */
export function mapTrails(world: World, run: DungeonRun, f: Floor): MapTrails | null {
  const ghost = ghostTrail(world, run).map((i) => centreOf(f, i));
  const path = guidePath(world);
  const steps = path ? footprints(path).map((i) => centreOf(f, i)) : [];
  return ghost.length || steps.length ? { ghost, steps } : null;
}

/**
 * Draw the trails in map-cell space (`unit` is one screen pixel in cells): the ghost as a
 * dashed gold line, the footprints as pairs of small pale dots. Static: no animation, so
 * reduced motion needs nothing more.
 */
export function drawTrails(
  g: Ctx2D & Partial<Pick<CanvasRenderingContext2D, 'setLineDash'>>,
  t: MapTrails,
  unit: number,
): void {
  if (t.ghost.length > 1) {
    g.beginPath();
    g.moveTo(t.ghost[0]!.x, t.ghost[0]!.y);
    for (const p of t.ghost.slice(1)) g.lineTo(p.x, p.y);
    g.setLineDash?.([4 * unit, 3 * unit]);
    g.strokeStyle = '#ffd27a';
    g.lineWidth = 2 * unit;
    g.stroke();
    g.setLineDash?.([]);
  }
  t.steps.forEach((p, i) => {
    // Left and right feet, side by side across the way.
    const side = (i % 2 ? 1 : -1) * 0.14;
    g.beginPath();
    g.arc(p.x + side, p.y, Math.max(0.12, 2 * unit), 0, Math.PI * 2);
    g.fillStyle = '#fff4d6';
    g.strokeStyle = '#0d0918';
    g.lineWidth = unit;
    g.fill();
    g.stroke();
  });
}
