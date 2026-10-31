import { championMod, PLATE_GLYPH } from '../config/dungeon-foes';
import { RARITIES } from '../config/dungeon-loot';
import { UNIQUE_TEXT } from '../config/strings-dungeon';
import { HOLLOW, HOLLOW_R7 } from '../config/tuning';
import { cellCentre, isExplored, type Cell, type Floor } from '../sim/dungeon';
import type { EncounterPack } from '../sim/dungeon-encounters';
import { fogAt, FOG_REMEMBERED, FOG_VISIBLE, type FogState } from '../sim/dungeon-sight';
import type { DungeonRun, Vec2 } from '../sim/types';
import type { SpriteBatch } from './sprite-batch';
import { CLIPS, frameAt, frameKey, type ClipName } from './sprites/animations';
import { viewAngle } from './sprites/angles';
import { sheetFromImage, type SpriteSheet } from './sprites/atlas';
import type { SheetCache } from './sprites/sheets';

/**
 * The Hollow's monster packs in the Pixel renderer (lane B r8: R0146, R0153, R0155, R0156,
 * R0163), mirroring `render3d/crowd.ts` and `render3d/hollow-plates.ts`: up to three members
 * in a huddle, a "!" when they notice the Keeper, a "?" when they give up, Zzz when asleep,
 * and a name plate with ◆/◈/★ over special packs, all hidden outside the Keeper's sight
 * (fog of war). It also holds the fog rule for the other cave sprites, and the gear pickup
 * pop: drops go straight to the satchel, so the rarity's shape pops over the Keeper instead.
 *
 * Plate and glyph canvases are made once and cached, so a frame never builds a texture.
 */

// ---- Pure parts (tests/render/hollow-packs-pixel.test.ts) ----

/** Plate text colours by pack kind; the glyph and words carry the meaning, colour backs it. */
export const PLATE_COLOUR: Readonly<Record<string, string>> = {
  champion: '#9fd0ff',
  elite: '#ffd27a',
  unique: '#ffb08a',
  boss: '#ffb08a',
};

export interface PlateSpec {
  glyph: string;
  /** The whole line: glyph, a unique's name, then each modifier's icon and word. */
  text: string;
  colour: string;
}

/** A special pack's name plate, or null for a plain pack (both renderers use this). */
export function packPlate(
  p: Pick<EncounterPack, 'kind' | 'members'> & { unique?: string | undefined },
): PlateSpec | null {
  const glyph = PLATE_GLYPH[p.kind];
  if (!glyph) return null;
  const mods = p.members[0]?.mods ?? [];
  const words = mods.map((m) => `${championMod(m).icon} ${championMod(m).name}`).join('  ');
  // A named unique (R0156) shows its name before its modifiers.
  const name = p.unique ? (UNIQUE_TEXT[p.unique]?.name ?? '') : '';
  return {
    glyph,
    text: [glyph, name, words].filter(Boolean).join(' '),
    colour: PLATE_COLOUR[p.kind] ?? '#fff',
  };
}

export type FogSprite = 'actor' | 'loot';

/**
 * A cave sprite's brightness factor for its cell's fog state, 0 meaning "do not draw". Live
 * actors (packs, strays, the wild one) draw only in sight; loot draws once seen, dimmed as
 * the ground is while out of sight. Under the open sky (camps, fields) everything draws.
 */
export function fogDraw(kind: FogSprite, state: FogState, openSky: boolean): number {
  if (openSky || state === FOG_VISIBLE) return 1;
  if (kind === 'loot' && state === FOG_REMEMBERED) return HOLLOW.fog.remembered;
  return 0;
}

const openSky = (f: Floor): boolean => f.zone === 'town' || f.zone === 'field';

/** `fogDraw` for a live actor at a world position on the run's floor. */
export function actorFog(run: DungeonRun, f: Floor, keeper: Vec2, p: Vec2): number {
  return fogDraw('actor', fogAt(run, f, keeper, p), openSky(f));
}

/** `fogDraw` for loot on a cell: hidden until explored, dimmed while out of sight. */
export function lootFog(run: DungeonRun, f: Floor, keeper: Vec2, c: Cell): number {
  if (openSky(f)) return 1;
  if (!isExplored(run, f, c.x, c.y)) return 0;
  return fogDraw('loot', fogAt(run, f, keeper, cellCentre(f, c)), false);
}

export const GEAR_POP = { ms: 1100, y: 1.4, lift: 0.6, stagger: 260, max: 4 } as const;

/** The pickup pop's height and opacity at `ageMs`, or null before it starts and once over. */
export function gearPopFrame(
  ageMs: number,
  reduceMotion: boolean,
): { y: number; opacity: number } | null {
  const P = GEAR_POP;
  if (ageMs < 0 || ageMs >= P.ms) return null;
  const t = ageMs / P.ms;
  const lift = reduceMotion ? P.lift * 0.5 : P.lift * (1 - (1 - t) * (1 - t));
  const opacity = t < 0.6 ? 1 : 1 - (t - 0.6) / 0.4;
  return { y: P.y + lift, opacity };
}

/** The rarity's shape glyph (● ◆ ⬟ ★ ✿ ⬢) and colour; an unknown rarity reads as plain. */
export function rarityGlyph(rarity: string): { glyph: string; colour: string } {
  const r = RARITIES.find((x) => x.id === rarity) ?? RARITIES[0]!;
  return { glyph: r.glyph, colour: r.colour };
}

// ---- Canvas parts (made once, cached) ----

const PLATE_FONT_PX = 11;

/** A rounded label on a canvas, one frame 'plate', drawn at the batch's native pixel size. */
function plateSheet(text: string, colour: string): SpriteSheet | null {
  if (typeof document === 'undefined') return null;
  const c = document.createElement('canvas');
  const g = c.getContext('2d');
  if (!g) return null;
  const font = `600 ${PLATE_FONT_PX}px system-ui, sans-serif`;
  g.font = font;
  const w = Math.ceil(g.measureText(text).width) + 10;
  const h = PLATE_FONT_PX + 7;
  c.width = w;
  c.height = h;
  g.font = font;
  g.fillStyle = 'rgba(20, 16, 36, 0.8)';
  g.beginPath();
  g.roundRect(0, 0, w, h, 5);
  g.fill();
  g.fillStyle = colour;
  g.textBaseline = 'middle';
  g.fillText(text, 5, h / 2 + 1);
  return sheetFromImage(c, { plate: [0, 0, w, h] }, w, h);
}

const GLYPH_CELL = 18;

/** Every rarity's shape on a dark disc, one frame per rarity id. */
function glyphSheet(): SpriteSheet | null {
  if (typeof document === 'undefined') return null;
  const c = document.createElement('canvas');
  c.width = GLYPH_CELL * RARITIES.length;
  c.height = GLYPH_CELL;
  const g = c.getContext('2d');
  if (!g) return null;
  const map: Record<string, [number, number, number, number]> = {};
  RARITIES.forEach((r, i) => {
    const x = i * GLYPH_CELL;
    g.fillStyle = 'rgba(20, 16, 36, 0.8)';
    g.beginPath();
    g.arc(x + GLYPH_CELL / 2, GLYPH_CELL / 2, GLYPH_CELL / 2, 0, Math.PI * 2);
    g.fill();
    g.fillStyle = r.colour;
    g.font = `700 ${GLYPH_CELL - 6}px system-ui, sans-serif`;
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.fillText(r.glyph, x + GLYPH_CELL / 2, GLYPH_CELL / 2 + 1);
    map[r.id] = [x, 0, GLYPH_CELL, GLYPH_CELL];
  });
  return sheetFromImage(c, map, GLYPH_CELL, GLYPH_CELL);
}

/** What the view lends for a frame. */
export interface PixelPackCtx {
  batch: SpriteBatch;
  sheets: SheetCache;
  nowMs: number;
  yaw: number;
  alpha: number;
  reduceMotion: boolean;
  shadow: (x: number, y: number, z: number, r: number) => void;
  lightAt: (x: number, z: number) => number;
}

const MAX_PLATES = 48;

export class PixelHollowPacks {
  /** Last two sim positions per pack, for smoothing between steps. */
  private readonly track = new Map<string, { prev: Vec2; cur: Vec2 }>();
  private readonly plates = new Map<string, SpriteSheet | null>();
  private glyphs: SpriteSheet | null | undefined;
  private pops: Array<{ rarity: string; x: number; z: number; startMs: number }> = [];

  /** Packs, their plates and emotes on the floor (call from the view's cave pass). */
  draw(f: Floor, run: DungeonRun, keeper: Vec2, worldMs: number, ctx: PixelPackCtx): void {
    const { batch, sheets, nowMs, yaw, alpha } = ctx;
    const emotes = sheets.emotes(false);
    const live = new Set<string>();
    for (const p of run.packs ?? []) {
      if (p.state === 'beaten') continue;
      const spec = f.packs?.find((q) => q.id === p.id);
      if (!spec) continue;
      live.add(p.id);
      let tr = this.track.get(p.id);
      if (!tr) {
        tr = { prev: { ...p.pos }, cur: { ...p.pos } };
        this.track.set(p.id, tr);
      } else if (tr.cur.x !== p.pos.x || tr.cur.z !== p.pos.z) {
        tr.prev = tr.cur;
        tr.cur = { ...p.pos };
      }
      if (actorFog(run, f, keeper, p.pos) === 0) continue;
      const px = tr.prev.x + (tr.cur.x - tr.prev.x) * alpha;
      const pz = tr.prev.z + (tr.cur.z - tr.prev.z) * alpha;
      const moving =
        p.state !== 'idle' ||
        (p.target !== null && Math.hypot(p.target.x - p.pos.x, p.target.z - p.pos.z) > 0.1);
      const facing = p.target ? Math.atan2(p.target.x - p.pos.x, p.target.z - p.pos.z) : 0;
      const surprised = p.state === 'chase' && worldMs - p.noticedMs < HOLLOW.packs.noticeMs;
      const gaveUp = p.gaveUpMs !== undefined && worldMs - p.gaveUpMs < HOLLOW_R7.aggro.askMs;
      const hop = surprised && !ctx.reduceMotion ? Math.abs(Math.sin(nowMs / 90)) * 0.25 : 0;
      const clip: ClipName = p.asleep ? 'sleep' : moving ? 'walk' : 'idle';
      const tint = ctx.lightAt(px, pz);
      spec.members.slice(0, 3).forEach((m, i) => {
        const a = facing + Math.PI + (i - 1) * 0.9;
        const r = i === 0 ? 0 : 0.55;
        const x = px + Math.sin(a) * r;
        const z = pz + Math.cos(a) * r;
        // Act V's Greylings (R0157) are Nubbin-shaped grey echoes; the rest wear their species.
        const sheet = spec.grey ? sheets.ambientShadow() : sheets.species(m.species);
        const view = viewAngle(facing, yaw);
        const t = nowMs + i * 137 + p.pos.x * 31;
        const rect =
          sheet.frames.get(frameKey(clip, view.angle, frameAt(CLIPS[clip], t))) ??
          sheet.frames.get(frameKey('idle', view.angle, frameAt(CLIPS.idle, t)));
        if (!rect) return;
        ctx.shadow(x, 0, z, 0.4);
        batch.draw({
          sheet,
          rect,
          flip: view.flip,
          x,
          y: hop,
          z,
          mode: 'billboard',
          tint: spec.grey ? tint * 0.85 : tint,
        });
      });
      // One beat over the leader: "!" on noticing, "?" on giving up, Zzz asleep.
      const shape = surprised ? 'exclaim' : gaveUp ? 'question' : p.asleep ? 'zz' : null;
      const q = shape ? emotes.frames.get(frameKey(shape, 'front', 0)) : undefined;
      if (q)
        batch.draw({
          sheet: emotes,
          rect: q,
          flip: false,
          x: px,
          y: 1.15 + hop + (ctx.reduceMotion ? 0 : Math.sin(nowMs / 400) * 0.05),
          z: pz,
          mode: 'billboard',
          tint,
        });
      const plate = this.plateFor(spec);
      const prect = plate?.frames.get('plate');
      if (plate && prect)
        batch.draw({
          sheet: plate,
          rect: prect,
          flip: false,
          x: px,
          y: q ? 1.75 + hop : 1.45 + hop,
          z: pz,
          mode: 'billboard',
          tint: 1,
        });
    }
    for (const id of this.track.keys()) if (!live.has(id)) this.track.delete(id);
  }

  /** Queue a pickup pop of the rarity's shape over the Keeper (event `gearFound`). */
  gearFound(rarity: string, at: Vec2, nowMs: number): void {
    const last = this.pops[this.pops.length - 1];
    const start = last ? Math.max(nowMs, last.startMs + GEAR_POP.stagger) : nowMs;
    this.pops.push({ rarity, x: at.x, z: at.z, startMs: start });
    if (this.pops.length > GEAR_POP.max) this.pops.shift();
  }

  /** Draw the live pickup pops, following the Keeper. */
  drawPops(keeper: Vec2, ctx: PixelPackCtx): void {
    if (this.pops.length === 0) return;
    this.pops = this.pops.filter((p) => ctx.nowMs - p.startMs < GEAR_POP.ms);
    if (this.glyphs === undefined) this.glyphs = glyphSheet();
    const sheet = this.glyphs;
    if (!sheet) return;
    for (const p of this.pops) {
      const fr = gearPopFrame(ctx.nowMs - p.startMs, ctx.reduceMotion);
      const rect = sheet.frames.get(p.rarity) ?? sheet.frames.get('plain');
      if (!fr || !rect) continue;
      ctx.batch.draw({
        sheet,
        rect,
        flip: false,
        x: keeper.x,
        y: fr.y,
        z: keeper.z,
        mode: 'billboard',
        opacity: fr.opacity,
        tint: 1,
      });
    }
  }

  private plateFor(spec: EncounterPack): SpriteSheet | null {
    const ps = packPlate(spec);
    if (!ps) return null;
    const key = `${ps.colour}|${ps.text}`;
    let s = this.plates.get(key);
    if (s === undefined) {
      if (this.plates.size >= MAX_PLATES) this.clearPlates();
      s = plateSheet(ps.text, ps.colour);
      this.plates.set(key, s);
    }
    return s;
  }

  private clearPlates(): void {
    for (const s of this.plates.values()) s?.dispose();
    this.plates.clear();
  }

  dispose(): void {
    this.clearPlates();
    this.glyphs?.dispose();
    this.glyphs = undefined;
    this.track.clear();
    this.pops = [];
  }
}
