import '../tactics.css';
import { TACTICS } from '../config/tuning-tactics';
import {
  JOB_TEXT,
  OBJECTIVE_TEXT,
  TACTICS_TEXT as T,
  TERRAIN_TEXT,
  formatTactics,
} from '../config/strings-tactics';
import type { Game } from '../game';
import type { Flashes, TacticsBoardView } from '../minigames/tactics/board-view';
import { TacticsPixelView, type Overlays } from '../minigames/tactics/pixel-view';
import { selectMinigameView } from '../render3d/minigame-layout';
import type { SpriteSheet } from '../render/sprites/atlas';
import {
  activeUnit,
  canAim,
  canDo,
  chipOf,
  gridOf,
  heightAt,
  mapOf,
  movesOf,
  preview,
  reachOf,
  routeTo,
  suggest,
  terrainOf,
  togetherMates,
  turnStrip,
  unitOf,
  type TacticsAction,
  type TacticsState,
  type TUnit,
} from '../sim/battle/tactics';
import { moveById } from '../sim/battle/tactics/engine';
import { KEEPER_UNIT } from '../sim/battle/tactics/keeper-unit';
import type { Cell } from '../sim/battle/tactics/types';
import { button, el } from './dom';
import { TacticsBar } from './tactics-bar';

/** The bar's id for the Keeper's Whistle. */
const WHISTLE = 'keeper-whistle';

type Mode = 'idle' | 'move' | 'moveSheet' | 'aim' | 'preview' | 'face' | 'busy';

/**
 * The rumble room screen (recs FIGHT-63, FIGHT-65): the Pixel board, the turn strip and the
 * objective chip on top, the bar at the bottom. It reads `world.tactics` every frame and
 * sends `tacticsAct` commands; the sim plays the foes' turns. The active unit is picked for
 * you and the board pans to it. Taps: a tile twice (or Go) to move, a target then Confirm to
 * act, an arrow to wait; a long press shows the tile card; two fingers pan and pinch zoom.
 * Desktop: WASD pans, 1 to 5 pick moves, Enter confirms, Q/E turn the board, Esc goes back.
 */
export class TacticsScreen {
  readonly root = el('div', 'tactics-screen');
  private readonly canvas = el('canvas', 'tactics-canvas');
  private readonly strip = el('div', 'tactics-strip');
  private readonly chip = el('div', 'tactics-chip');
  private readonly log = el('div', 'tactics-log');
  private readonly tileCard = el('div', 'tactics-tile');
  private readonly end = el('div', 'tactics-end');
  /** The Pixel board, or the Full 3D one once its chunk lands (FIGHT-62). */
  private view: TacticsBoardView;
  private readonly bar: TacticsBar;
  private mode: Mode = 'busy';
  private tile: Cell | null = null;
  private move: string | null = null;
  private turnKey = '';
  private seenLog = 0;
  private want3d = true;
  /** The first friend picked for the Keeper's Whistle. */
  private whistleA: string | null = null;
  private readonly flashes: Flashes = { hurt: new Map(), pile: new Map() };
  private raf = 0;
  private press: { id: number; x: number; y: number; at: number; timer: number } | null = null;
  private touches = new Map<number, { x: number; y: number }>();
  private pinch: number | null = null;
  private lines: string[] = [];
  private seen = false;
  private headerKey = '';
  private shown: Mode | null = null;
  private opened = performance.now();
  private readonly keys = (e: KeyboardEvent) => this.onKey(e);

  constructor(
    private readonly parent: HTMLElement,
    private readonly game: () => Game | null,
    private readonly onClose: () => void,
  ) {
    const top = el('div', 'tactics-top');
    const tools = el('div', 'tactics-tools');
    const tool = (label: string, aria: string, f: () => void) => {
      const b = button(label, f, 'btn tactics-tool');
      b.setAttribute('aria-label', aria);
      return b;
    };
    tools.append(
      tool('↺', 'Turn left', () => this.turn(-1)),
      tool('↻', 'Turn right', () => this.turn(1)),
      tool('🔍', 'Zoom', () => this.toggleZoom()),
      tool('🚪', T.forfeit, () => this.send({ kind: 'tacticsForfeit' })),
    );
    top.append(this.strip, this.chip, tools);
    this.view = new TacticsPixelView(this.canvas);
    this.use3d();
    this.root.append(top, this.canvas, this.log, this.tileCard, this.end);
    this.tileCard.hidden = true;
    this.end.hidden = true;
    this.bar = new TacticsBar(this.root, {
      move: () => this.setMode('move'),
      act: () => this.setMode('moveSheet'),
      wait: () => this.setMode('face'),
      undo: () => this.act({ k: 'undo' }),
      go: () => this.go(),
      pickMove: (id) => this.pickMove(id),
      confirm: () => this.confirm(),
      together: () => this.together(),
      face: (d) => this.act({ k: 'wait', face: d }),
      cancel: () => this.setMode('idle'),
    });
    this.canvas.addEventListener('pointerdown', (e) => this.down(e));
    this.canvas.addEventListener('pointermove', (e) => this.moveTouch(e));
    this.canvas.addEventListener('pointerup', (e) => this.up(e));
    this.canvas.addEventListener('pointercancel', (e) => this.cancelTouch(e));
    this.canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      this.view.zoom = e.deltaY < 0 ? 2 : 1;
    });
    window.addEventListener('keydown', this.keys);
    parent.appendChild(this.root);
    // The headless drivers find tiles through this (debug builds and ?debug only).
    if (import.meta.env.DEV || location.search.includes('debug'))
      (window as unknown as { groveTactics: TacticsScreen }).groveTactics = this;
    this.raf = requestAnimationFrame(this.frame);
  }

  close(): void {
    cancelAnimationFrame(this.raf);
    this.view.dispose();
    const g = this.game();
    if (g) g.renderPaused = false;
    window.removeEventListener('keydown', this.keys);
    this.root.remove();
    this.onClose();
  }

  private state(): TacticsState | null {
    return this.game()?.world.tactics ?? null;
  }

  private send(cmd: Parameters<Game['send']>[0]): void {
    this.game()?.send(cmd);
  }

  private act(a: TacticsAction): void {
    const s = this.state();
    if (!s || !canDo(s, a)) return;
    this.send({ kind: 'tacticsAct', action: a });
    this.tile = null;
    this.move = null;
    this.mode = a.k === 'wait' ? 'busy' : 'idle';
  }

  private setMode(m: Mode): void {
    const s = this.state();
    const u = s && activeUnit(s);
    if (!s || !u) return;
    if (m === 'moveSheet') {
      // The Keeper's Whistle (FIGHT-66) is an act, not a move: two taps on two friends.
      const whistle = u.keeper ? [{ id: WHISTLE, puff: 0, ok: !s.acted }] : [];
      this.bar.moves([
        ...movesOf(u).map((id) => ({
          id,
          puff: moveById(id)?.puff ?? 0,
          ok: !s.acted && (moveById(id)?.puff ?? 99) <= u.c.puff,
        })),
        ...whistle,
      ]);
    }
    this.mode = m;
    this.tile = null;
    if (m !== 'aim' && m !== 'preview') this.move = null;
  }

  private pickMove(id: string): void {
    this.move = id;
    this.whistleA = null;
    this.mode = 'aim';
  }

  private go(): void {
    if (this.mode === 'move' && this.tile) this.act({ k: 'move', ...this.tile });
  }

  private confirm(): void {
    if (this.mode === 'preview' && this.move && this.tile)
      this.act({ k: 'act', move: this.move, ...this.tile });
  }

  private together(): void {
    const s = this.state();
    if (!s || !this.tile) return;
    const mate = togetherMates(s, this.tile)[0];
    if (mate) this.act({ k: 'together', with: mate, ...this.tile });
  }

  /**
   * In Full 3D (and once the Grove's 3D scene has loaded) the board is drawn by the 3D view
   * into the game canvas under this screen, which goes see-through; the low-res canvas stays
   * as the input surface. Until the chunk lands, and if it fails, the Pixel board draws.
   */
  private use3d(): void {
    const g = this.game();
    const scene3d = g?.scene3d;
    if (!g || !scene3d || g.graphics !== '3d') {
      this.want3d = false;
      return;
    }
    // The 3D scene may still be loading when a bout opens; the frame loop asks again.
    if (selectMinigameView(g.graphics, scene3d.loadState().done) !== '3d') return;
    this.want3d = false;
    void import('../render3d/tactics-3d').then(
      (mod) => {
        if (!this.root.isConnected) return;
        const pixel = this.view;
        const v = new mod.Tactics3dView(
          scene3d,
          this.canvas,
          (id) => this.game()?.world.nubbins.find((n) => n.id === id) ?? null,
          () => {
            const w = this.game()?.world;
            return w ? { keeper: w.keeper, trainer: w.trainer } : null;
          },
        );
        v.rot = pixel.rot;
        v.zoom = pixel.zoom;
        this.view = v;
        pixel.dispose();
        this.root.classList.add('three');
        this.canvas.getContext('2d')?.clearRect(0, 0, this.canvas.width, this.canvas.height);
        const s = this.state();
        const u = s && activeUnit(s);
        if (s && u) v.centreOn(s, u);
      },
      () => undefined,
    );
  }

  private turn(d: number): void {
    this.view.rot = (this.view.rot + d + 4) % 4;
  }

  private toggleZoom(): void {
    this.view.zoom = this.view.zoom === 1 ? 2 : 1;
    const s = this.state();
    const u = s && activeUnit(s);
    if (s && u) this.view.centreOn(s, u);
  }

  /** A tap on a board tile, by mode. */
  /** A tile's client point (for the drivers). */
  pointOf(c: Cell): { x: number; y: number } | null {
    const s = this.state();
    return s ? this.view.clientOf(s, c) : null;
  }

  /** What the active unit could do now (the drivers pick taps from it). */
  peek(): {
    mine: boolean;
    moved: boolean;
    acted: boolean;
    reach: Cell[];
    aims: Array<{ move: number; at: Cell; kind: string; boss: boolean }>;
    boss: Cell | null;
    plan: TacticsAction[];
    moves: string[];
  } | null {
    const s = this.state();
    const u = s && activeUnit(s);
    if (!s || !u || s.result) return null;
    const m = mapOf(s);
    const aims: Array<{ move: number; at: Cell; kind: string; boss: boolean }> = [];
    movesOf(u).forEach((id, move) => {
      const def = moveById(id);
      if (!def || def.puff > u.c.puff || def.kind === 'support') return;
      for (const f of s.units)
        if (
          f.c.side === 1 &&
          f.c.hp > 0 &&
          canAim(m, u, f, gridOf(def), u.jump, u.job === 'glider')
        )
          aims.push({ move, at: { x: f.x, y: f.y }, kind: def.kind, boss: f.c.calm !== undefined });
    });
    const boss = s.units.find((f) => f.c.calm !== undefined && f.c.hp > 0);
    return {
      mine: u.c.side === 0,
      moved: s.moved,
      acted: s.acted,
      reach: s.moved ? [] : reachOf(s, u).tiles.slice(1),
      aims,
      boss: boss ? { x: boss.x, y: boss.y } : null,
      plan: u.c.side === 0 ? suggest(s) : [],
      moves: movesOf(u),
    };
  }

  /** Current zoom level, for the drivers. */
  get zoomLevel(): number {
    return this.view.zoom;
  }

  private tap(c: Cell): void {
    const s = this.state();
    const u = s && activeUnit(s);
    if (!s || !u) return;
    // Tiles too small to hit with a thumb: zoom in on the tap first, select nothing.
    if (this.view.tileCss() < 44 && this.view.zoom === 1) {
      this.view.zoom = 2;
      this.view.centreOn(s, c);
      return;
    }
    if (this.mode === 'move') {
      if (this.tile && this.tile.x === c.x && this.tile.y === c.y) this.go();
      else if (canDo(s, { k: 'move', ...c })) this.tile = c;
    } else if (this.mode === 'aim' && this.move === WHISTLE) {
      const v = s.units.find((w) => w.x === c.x && w.y === c.y);
      if (!v || v.keeper || v.c.side !== u.c.side) return;
      if (!this.whistleA || this.whistleA === v.c.id) {
        this.whistleA = v.c.id;
        this.tile = c;
      } else this.act({ k: 'whistle', a: this.whistleA, b: v.c.id });
    } else if (this.mode === 'aim' || this.mode === 'preview') {
      const def = this.move ? moveById(this.move) : null;
      if (def && canAim(mapOf(s), u, c, gridOf(def), u.jump, u.job === 'glider')) {
        this.tile = c;
        this.mode = 'preview';
        const rows = preview(s, def.id, c).map((r) => ({ ...r, name: this.nameOf(s, r.id) }));
        this.bar.preview(rows, togetherMates(s, c).length > 0);
      }
    }
  }

  private nameOf(s: TacticsState, id: string): string {
    const u = unitOf(s, id);
    if (!u) return id;
    if (u.c.name) return u.c.name;
    const ix = Number(id.replace('foe-', ''));
    return ix === 0 ? T.leader : (T.pups[(ix - 1) % T.pups.length] ?? T.leader);
  }

  private down(e: PointerEvent): void {
    this.canvas.setPointerCapture(e.pointerId);
    this.touches.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (this.touches.size === 2) {
      if (this.press) clearTimeout(this.press.timer);
      this.press = null;
      const [a, b] = [...this.touches.values()];
      this.pinch = Math.hypot(a!.x - b!.x, a!.y - b!.y);
      return;
    }
    const timer = window.setTimeout(() => this.longPress(e.clientX, e.clientY), 500);
    this.press = { id: e.pointerId, x: e.clientX, y: e.clientY, at: performance.now(), timer };
  }

  private moveTouch(e: PointerEvent): void {
    const prev = this.touches.get(e.pointerId);
    if (!prev) return;
    this.touches.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (this.touches.size === 2) {
      // Two fingers: pan by the midpoint, pinch to zoom.
      const k = this.view.scale;
      this.view.panX += (e.clientX - prev.x) / 2 / k;
      this.view.panY += (e.clientY - prev.y) / 2 / k;
      const [a, b] = [...this.touches.values()];
      const d = Math.hypot(a!.x - b!.x, a!.y - b!.y);
      if (this.pinch && Math.abs(d - this.pinch) > 40) {
        this.view.zoom = d > this.pinch ? 2 : 1;
        this.pinch = d;
      }
    } else if (this.press && Math.hypot(e.clientX - this.press.x, e.clientY - this.press.y) > 10) {
      clearTimeout(this.press.timer);
      this.press = null;
    }
  }

  private up(e: PointerEvent): void {
    this.touches.delete(e.pointerId);
    if (this.touches.size < 2) this.pinch = null;
    const p = this.press;
    if (!p || p.id !== e.pointerId) return;
    clearTimeout(p.timer);
    this.press = null;
    if (!this.tileCard.hidden) {
      this.tileCard.hidden = true;
      return;
    }
    const s = this.state();
    if (!s) return;
    const b = this.view.toBoard(e.clientX, e.clientY);
    const c = this.view.pick(s, b.x, b.y);
    if (c) this.tap(c);
  }

  private cancelTouch(e: PointerEvent): void {
    this.touches.delete(e.pointerId);
    if (this.press) clearTimeout(this.press.timer);
    this.press = null;
  }

  /** The tile card: its kind's icon and name, and its height. */
  private longPress(x: number, y: number): void {
    const s = this.state();
    if (!s) return;
    const b = this.view.toBoard(x, y);
    const c = this.view.pick(s, b.x, b.y);
    if (!c) return;
    const m = mapOf(s);
    const k = TERRAIN_TEXT[terrainOf(m, c.x, c.y, s.progress.lit)];
    this.tileCard.replaceChildren(
      el('div', 'tactics-tile-name', `${k.icon} ${k.name}`),
      el('div', undefined, k.blurb),
      el('div', undefined, T.height(heightAt(m, c.x, c.y))),
    );
    this.tileCard.hidden = false;
    this.press = null;
  }

  private onKey(e: KeyboardEvent): void {
    const s = this.state();
    if (!s) return;
    const k = e.key.toLowerCase();
    const pan = 16;
    if (k === 'w' || k === 'arrowup') this.view.panY += pan;
    else if (k === 's' || k === 'arrowdown') this.view.panY -= pan;
    else if (k === 'a' || k === 'arrowleft') this.view.panX += pan;
    else if (k === 'd' || k === 'arrowright') this.view.panX -= pan;
    else if (k === 'q') this.turn(-1);
    else if (k === 'e') this.turn(1);
    else if (k === 'escape') this.setMode('idle');
    else if (k === 'enter') {
      if (this.mode === 'preview') this.confirm();
      else if (this.mode === 'move') this.go();
    } else if (/^[1-5]$/.test(k)) {
      const u = activeUnit(s);
      const id = u && movesOf(u)[Number(k) - 1];
      if (id && !s.acted) this.pickMove(id);
    } else return;
    e.preventDefault();
  }

  private overlays(s: TacticsState, u: TUnit | undefined): Overlays {
    const o: Overlays = { cursor: this.tile };
    if (!u || u.c.side !== 0) return o;
    const m = mapOf(s);
    if (this.mode === 'move') {
      const r = reachOf(s, u);
      o.move = r.tiles.slice(1);
      if (this.tile) o.path = routeTo(m, r, this.tile.x, this.tile.y);
    }
    if (this.mode === 'aim' && this.move === WHISTLE)
      o.aim = s.units
        .filter(
          (w) =>
            !w.keeper &&
            w.c.side === u.c.side &&
            Math.abs(w.x - u.x) + Math.abs(w.y - u.y) <= KEEPER_UNIT.whistleRange,
        )
        .map((w) => ({ x: w.x, y: w.y }));
    if ((this.mode === 'aim' || this.mode === 'preview') && this.move) {
      const def = moveById(this.move);
      if (def) {
        const p = gridOf(def);
        const aim: Cell[] = [];
        for (let y = 0; y < m.h; y++)
          for (let x = 0; x < m.w; x++)
            if (canAim(m, u, { x, y }, p, u.jump, u.job === 'glider')) aim.push({ x, y });
        o.aim = aim;
      }
      o.target = this.tile;
    }
    return o;
  }

  private sheetFor = (u: TUnit): SpriteSheet | null => {
    const g = this.game();
    if (!g) return null;
    try {
      if (u.keeper) return g.view.sheets.keeper(g.world.trainer, g.world.keeper.alignment);
      const n = u.c.nubbinId ? g.world.nubbins.find((x) => x.id === u.c.nubbinId) : null;
      return n ? g.view.sheets.forNubbin(n) : g.view.sheets.species(u.c.species);
    } catch {
      return null;
    }
  };

  private frame = (now: number): void => {
    this.raf = requestAnimationFrame(this.frame);
    const s = this.state();
    // The start command lands on the next sim step; give it a moment before giving up.
    if (!s) {
      if (now - this.opened > 3000 || this.seen) this.close();
      return;
    }
    this.seen = true;
    // The board covers the screen: the sim keeps going, the Grove is not drawn.
    const g = this.game();
    if (g && !g.renderPaused) g.renderPaused = true;
    const u = activeUnit(s);
    this.readLog(s, now);
    // A new player turn: pick the unit, pan to it, show the bar.
    const key = `${s.turns}:${s.active}`;
    if (key !== this.turnKey) {
      this.turnKey = key;
      if (u?.c.side === 0) {
        this.view.centreOn(s, u);
        this.mode = 'idle';
      }
    }
    if (this.mode === 'busy' && u?.c.side === 0) this.mode = 'idle';
    if (this.want3d) this.use3d();
    this.view.draw(s, this.overlays(s, u), now, this.sheetFor, this.flashes);
    const shown = s.result ? 'busy' : this.mode;
    if (shown !== this.shown) this.bar.show((this.shown = shown));
    this.bar.state({
      moved: s.moved,
      acted: s.acted,
      canUndo: canDo(s, { k: 'undo' }),
      goReady: !!this.tile,
    });
    this.header(s, u);
    this.ending(s);
  };

  private readLog(s: TacticsState, now: number): void {
    if (s.log.length < this.seenLog) this.seenLog = 0;
    if (s.log.length === this.seenLog) return;
    for (const e of s.log.slice(this.seenLog)) {
      if (e.k === 'hit') this.flashes.hurt.set(e.to, now);
      if (e.k === 'pileOn') this.flashes.pile.set(e.to, now);
      const line = formatTactics(e, (id) => this.nameOf(s, id));
      if (line) this.lines.push(line);
    }
    this.seenLog = s.log.length;
    this.lines = this.lines.slice(-3);
    this.log.textContent = this.lines.join('\n');
  }

  private header(s: TacticsState, u: TUnit | undefined): void {
    // The strip forecasts the CT clock; rebuild it only when the bout moved on.
    const key = `${s.tick}:${s.turns}:${s.active}:${s.log.length}`;
    if (key === this.headerKey) return;
    this.headerKey = key;
    const strip = turnStrip(s).map((t) => {
      const v = unitOf(s, t.id);
      const mark = v?.c.side === 0 ? '●' : '◆';
      const name = this.nameOf(s, t.id).slice(0, 6);
      return el('span', t.charge ? 'tactics-chip-ghost' : 'tactics-chip-unit', `${mark}${name}`);
    });
    this.strip.replaceChildren(...strip);
    const o = OBJECTIVE_TEXT[s.objective.kind];
    const c = chipOf(s);
    const job = u ? JOB_TEXT[u.job] : null;
    const who = u
      ? (u.c.side === 0 ? T.yourTurn : T.theirTurn)(this.nameOf(s, u.c.id)) +
        (job ? ` · ${job.icon} ${job.name}` : '')
      : '';
    this.chip.textContent = `${o.icon} ${o.goal} ${c.have}/${c.need}  ${who}`;
  }

  private ending(s: TacticsState): void {
    if (!s.result) {
      this.end.hidden = true;
      return;
    }
    if (!this.end.hidden) return;
    const won = s.result.winner === 0;
    const text =
      s.result.winner === null
        ? T.draw
        : won
          ? T.win
          : s.result.reason === 'forfeit'
            ? T.lose
            : OBJECTIVE_TEXT[s.objective.kind].fail;
    const depth = s.context.tier + 1;
    const ids = s.context.kind === 'encounter' ? [...s.context.ids] : [];
    // Only the debug rumble retries from here: a Hollow, story or guardian bout belongs to
    // whoever started it, so a loss there just closes (lane B's note, round 6).
    const source = s.context.kind === 'encounter' ? s.context.source : 'rumble';
    const retry = !won && (source === 'rumble' || source === 'debug');
    const row = el('div', 'tactics-card-buttons');
    row.append(
      button(
        won || !retry ? T.close : T.retry,
        () => {
          this.send({ kind: 'tacticsClose' });
          if (retry) {
            this.send({ kind: 'tacticsStart', depth, ids });
            this.seen = false;
            this.opened = performance.now();
          }
          this.end.hidden = true;
          if (!retry) this.close();
        },
        'btn tactics-btn',
      ),
    );
    if (!won)
      row.append(
        button(
          T.skip,
          () => {
            this.send({ kind: 'tacticsClose' });
            this.close();
          },
          'btn tactics-btn',
        ),
      );
    this.end.replaceChildren(
      el('div', 'tactics-end-title', text),
      ...(won ? [el('div', undefined, T.prize(TACTICS.slice.shells * s.context.tier))] : []),
      row,
    );
    this.end.hidden = false;
  }
}

let open: TacticsScreen | null = null;

/** Opens the rumble screen (once). */
export function openTactics(parent: HTMLElement, game: () => Game | null): void {
  if (open) return;
  open = new TacticsScreen(parent, game, () => (open = null));
}

/** Debug entry: start a rumble and open the screen. */
export function startTacticsDebug(parent: HTMLElement, game: () => Game | null): void {
  const g = game();
  if (!g) return;
  if (!g.world.tactics || g.world.tactics.result) g.send({ kind: 'tacticsStart', depth: 2 });
  openTactics(parent, game);
}
