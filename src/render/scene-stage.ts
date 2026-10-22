import { GROVE, MARK_FIT, READ3D, type MarkFit } from '../config/tuning';
import { SCENE_STAGES } from '../config/scene-stages';
import { DAWN_HOUR, DUSK_HOUR } from '../config/scene-stages-dawndusk';
import { E_STAGES } from '../config/tuning-e';
import { markAt, markSetFor, PLACE_KEEPER, placeSet } from '../config/stage-marks';
import type { Line, SceneStage, ShotKind, StageCast, StagePlace } from '../config/story';
import { sceneFor, type PlayScene } from '../sim/story-scenes';
import { storylineOf } from '../sim/storyline';
import type { GroveKind, Location, Vec2, World } from '../sim/types';

/**
 * The one story stager both renderers read (campaign graphics C1). While a scene waits at
 * the head of `world.campaign.queue` it resolves the scene's `stage` (the script's own,
 * over its entry in config/scene-stages.ts), the hour to draw at, and where the cast is
 * drawn: on their marks, or, with no mark, a speaker who stands far off is brought in
 * beside the Keeper, turned to them (C5). It reads the world and never writes it: the
 * sim's NPCs keep their own positions, and only the drawn ones move.
 *
 * Moved here from render3d/staging.ts, which re-exports it for older imports.
 */

/** The places that are lit by a sky, where a staged hour means something. */
const SKY_LIT = (location: Location): boolean => location !== 'dungeon' && location !== 'hollow';

/** The resolved stage of the scene at the head of the queue, or null when none waits. */
export function resolveStage(
  world: World,
): { id: string; scene: PlayScene; stage: SceneStage } | null {
  const id = world.location !== 'dungeon' ? world.campaign?.queue[0] : undefined;
  if (!id) return null;
  const scene = sceneFor(world, id, 'main');
  if (!scene) return null;
  const stage: SceneStage = { ...E_STAGES[id], ...SCENE_STAGES[id], ...scene.stage };
  // M13: Dawn & Dusk's hour follows its half, for any scene that names none.
  const line = world.campaign?.storyline;
  if (stage.hour === undefined && (line === 'dawn' || line === 'dusk'))
    stage.hour = line === 'dawn' ? DAWN_HOUR : DUSK_HOUR;
  return { id, scene, stage };
}

/**
 * The hour a scene's opening narration names, read from its first narrator lines only (a
 * memory of "that night" later in a scene does not light the present). Null when none.
 */
export function hourOf(lines: readonly Line[]): number | null {
  const s = READ3D.stage;
  const opening = lines
    .filter((l) => l.who === 'narrator')
    .slice(0, 2)
    .map((l) => l.text.toLowerCase())
    .join(' ')
    // Named nights are events, not the hour: "since the Long Night", "on Lantern Night".
    .replace(/\b(long|lantern) night\b/g, '');
  if (/\b(night|midnight|moonlit|moonlight|the stars are out)\b/.test(opening)) return s.nightHour;
  if (/\b(dusk|sunset|twilight|evening|lamps are lit|lanterns are lit)\b/.test(opening))
    return s.duskHour;
  if (/\b(late afternoon|golden light|the light has gone long)\b/.test(opening))
    return s.goldenHour;
  if (/\b(dawn|sunrise|first light|early morning)\b/.test(opening)) return s.morningHour;
  return null;
}

/**
 * The pixel Grove's terrace top under (x, z): each hill is three tiers (render/grove-scene.ts),
 * so a figure drawn on a hill mark stands on it rather than inside it. 0 off the hills.
 */
export function terraceY(x: number, z: number): number {
  for (const h of GROVE.hills) {
    const d = Math.hypot(x - h.x, z - h.z) / h.r;
    if (d < 1) return d < 0.5 ? h.h : d < 0.74 ? h.h * 0.76 : h.h * 0.42;
  }
  return 0;
}

/** Which visiting Keepers are drawn at a location: the pixel and 3D views' shared rule. */
export function npcHere(location: Location, trainer: string): boolean {
  if (location === 'grove') return true;
  if (location === 'dungeon') return false;
  if (location === 'corvin') return trainer === 'corvin' || trainer === 'ember';
  return trainer === 'nova';
}

/** Read-only answers about the story moment a dressing draws for. */
export interface StageFlags {
  /** 'hazel' for Hazel's Grove, else the storyline id ('hundred', 'logged', 'beetle', 'dawn', 'dusk'). */
  campaign: string;
  /** The storyline id, or null for Hazel's Grove (and with no campaign). */
  storyline: string | null;
  /** The campaign's chapter, 1..12 (13 after an ending); 0 with no campaign. */
  chapter: number;
  /** The 0-based index of the storyline's current chapter, or null in Hazel's Grove. */
  storyChapter: number | null;
  /** Dawn & Dusk's half, or null outside it. */
  half: 'dawn' | 'dusk' | null;
  /** Chapter 10's vigil: waves of cold through so far (0..), or null before it starts. */
  vigilWave: number | null;
  vigilLull: boolean;
  vigilDone: boolean;
  /**
   * Corvin's three pens (front row first), open once chapter 9 has settled how he let them
   * go; `corvin` is that outcome ('reconciled', 'bargained', 'forced') or null.
   */
  pens: readonly [boolean, boolean, boolean];
  corvin: string | null;
  location: Location;
  grove: GroveKind;
  /** The stage's place, or null. */
  place: StagePlace | null;
  /** The scene at the head of the queue, or null. */
  sceneId: string | null;
}

/** Answer the dressings' questions from the world and the current stage. Never writes. */
export function stageFlags(world: World, stage: SceneStage | null): StageFlags {
  const c = world.campaign;
  const line = storylineOf(c);
  const side = c?.flags.side;
  const half =
    c?.storyline === 'dawn' || c?.storyline === 'dusk'
      ? c.storyline
      : side === 'dawn' || side === 'dusk'
        ? side
        : null;
  const outcome = typeof c?.flags.corvin === 'string' ? c.flags.corvin : null;
  const open = outcome !== null;
  const idx = line && c ? line.chapters.findIndex((ch) => ch.n === c.chapter) : -1;
  return {
    campaign: c?.storyline ?? 'hazel',
    storyline: c?.storyline ?? null,
    chapter: c?.chapter ?? 0,
    storyChapter: idx >= 0 ? idx : null,
    half,
    vigilWave: c?.vigil ? c.vigil.waves : null,
    vigilLull: c?.vigil?.lull ?? false,
    vigilDone: c?.vigil?.done ?? false,
    pens: [open, open, open],
    corvin: outcome,
    location: world.location,
    grove: world.grove,
    place: stage?.place ?? null,
    sceneId: c?.queue[0] ?? null,
  };
}

/**
 * Follows the story queue for one renderer. Each renderer keeps its own instance (they may
 * update at different moments); both resolve the same stage from the same world.
 */
export class SceneStager {
  private sceneId: string | null = null;
  private location: Location | null = null;
  private readonly speakers = new Set<string>();
  /** The resolved stage of the current scene ({} while none, or none authored). */
  stage: SceneStage = {};
  /** Each NPC's drawn spot for the scene, by NPC id. */
  readonly holds = new Map<string, Vec2>();
  /** Each NPC's drawn facing (radians, as `atan2(dx, dz)`), by NPC id. */
  readonly faces = new Map<string, number>();
  /**
   * Where the Keeper is drawn for the scene when the cast puts `you` on a mark, else null.
   * Drawing only: the sim's Keeper stays where it is.
   */
  keeperHold: Vec2 | null = null;
  /** Where cast Nubbins (Moss, Sable) are drawn for the scene, by Nubbin id. Drawing only. */
  readonly nubbinHolds = new Map<string, Vec2>();
  /** The hour the scene asks for (stage.hour, else its narration), or null for the clock's. */
  hour: number | null = null;
  /** Who speaks the line on screen now (the dialogue sets it each frame), or null. */
  speaker: string | null = null;
  /** Wall time (ms) the current scene began, for timed shots such as `establish`. */
  startedMs = 0;
  /**
   * The Keeper's drawn facing for the scene (radians, `atan2(dx, dz)`), turned to whom the
   * scene is with (H7), or null to keep the sim's. Drawing only.
   */
  keeperFace: number | null = null;
  /** The dialogue's line index in the scene (the game sets it each frame); 0 on the first. */
  line = 0;
  /** Wall time (ms) the first line advance came (H5's push-in), or null before it. */
  pushedMs: number | null = null;
  /** Who an exclusive stage still draws besides the Keeper: its cast and its speakers. */
  readonly castIds = new Set<string>();
  /** Scenes already warned about (H1's dev check), so each warns once. */
  private readonly warned = new Set<string>();
  /** The facings as placed, before `turnFaces` turns them toward a side camera. */
  private readonly baseFaces = new Map<string, number>();
  private baseKeeperFace: number | null = null;

  get active(): boolean {
    return this.sceneId !== null;
  }

  get id(): string | null {
    return this.sceneId;
  }

  /** Whether the stage draws only its set (C3, C4): the Grove's world hides. */
  get exclusive(): boolean {
    return this.sceneId !== null && this.stage.exclusive === true;
  }

  /**
   * Follow the dialogue's line (H5): the first advance past line 0 starts the push-in.
   * Call each frame with the line index and the wall time.
   */
  noteLine(line: number, nowMs: number, speaker: string | null = null): void {
    this.line = line;
    // The push comes on the first advance, or at once when the line on screen is spoken.
    const spoken = speaker !== null && speaker !== 'narrator';
    if (this.sceneId !== null && (line > 0 || spoken) && this.pushedMs === null)
      this.pushedMs = nowMs;
  }

  /**
   * The shot kind to draw now: the stage's, or after the first line its `then` (an
   * `establish` defaults to `two`). Undefined when the stage names no shot.
   */
  shotKind(): ShotKind | undefined {
    const shot = this.stage.shot;
    if (!shot) return undefined;
    if (this.pushedMs === null) return shot.kind;
    return shot.then ?? (shot.kind === 'establish' || shot.kind === 'wide' ? 'two' : shot.kind);
  }

  /**
   * The Keeper's drawn facing now: toward whoever speaks the line on screen (held or not),
   * else as placed; turned toward a side camera as `turnFaces` last asked. Null with no
   * scene, or nothing to face.
   */
  keeperFaceNow(world: World, camYaw?: number): number | null {
    if (this.sceneId === null) return null;
    let face = this.baseKeeperFace;
    const who = this.speaker;
    // The Keeper speaking turns three-quarter to the camera, not away from it.
    if (who && camYaw !== undefined && speaksAsKeeper(world, who, this.stage)) return camYaw - 0.5;
    if (who && who !== 'narrator' && !speaksAsKeeper(world, who, this.stage)) {
      const k = this.keeperSpot(world);
      const p = this.castSpot(world, who);
      if (p && Math.hypot(p.x - k.x, p.z - k.z) > 0.05) face = Math.atan2(p.x - k.x, p.z - k.z);
    }
    if (face === null || !this.camTurn) return face;
    const { yaw, amount } = this.camTurn;
    const d = Math.atan2(Math.sin(yaw - face), Math.cos(yaw - face));
    return face + Math.max(-amount, Math.min(amount, d));
  }

  /**
   * The shot's focus now: after the push-in (H5) to a default two-shot, the people again
   * (the speakers and the Keeper), not the marks an establishing shot framed. A `then`
   * the stage names keeps the focus.
   */
  focusNow(): string[] | undefined {
    const shot = this.stage.shot;
    if (this.pushedMs !== null && shot && !shot.then && this.shotKind() !== shot.kind)
      return undefined;
    return shot?.focus;
  }

  /** Whether the shot now fits its focus inside the HUD-safe area (H4). */
  fits(): boolean {
    const shot = this.stage.shot;
    const kind = this.shotKind();
    if (!shot || kind === undefined) return false;
    // `fit` names the first shot; after a push-in only a `wide` still fits.
    if (kind !== shot.kind) return kind === 'wide';
    return shot.fit ?? (kind === 'establish' || kind === 'wide');
  }

  /** Follow the story queue; true on the frame a scene begins or ends. */
  update(world: World, nowMs = 0): boolean {
    const r = resolveStage(world);
    const id = r?.id ?? null;
    // A move to another place restages the same scene (its marks and hour belong to a place).
    if (id === this.sceneId && world.location === this.location) return false;
    this.sceneId = id;
    this.location = world.location;
    this.holds.clear();
    this.faces.clear();
    this.baseFaces.clear();
    this.baseKeeperFace = null;
    this.camTurn = null;
    this.keeperHold = null;
    this.nubbinHolds.clear();
    this.speakers.clear();
    this.hour = null;
    this.stage = {};
    this.startedMs = nowMs;
    this.keeperFace = null;
    this.pushedMs = null;
    this.line = 0;
    this.castIds.clear();
    if (!r) return true;
    this.stage = r.stage;
    for (const l of r.scene.lines) this.speakers.add(l.who);
    for (const w of this.speakers) this.castIds.add(w);
    for (const c of r.stage.cast ?? []) this.castIds.add(c.who);
    this.warnPlace(world, r.id);
    this.hour = SKY_LIT(world.location) ? (r.stage.hour ?? hourOf(r.scene.lines)) : null;
    this.place(world);
    return true;
  }

  /** The hour to draw at: the staged hour while a scene waits, else `clock`. */
  hourOr(clock: number): number {
    return this.hour ?? clock;
  }

  /**
   * H1's dev check: a stage whose place belongs to another location than the world's
   * cannot be honoured (its marks are elsewhere). Warns once per scene, in dev builds only.
   */
  private warnPlace(world: World, id: string): void {
    const place = this.stage.place;
    if (!import.meta.env.DEV || !place || this.warned.has(id)) return;
    if (markSetFor(world.location) === placeSet(place)) return;
    this.warned.add(id);
    console.warn(
      `[stage] ${id}: place '${place}' is in ${placeSet(place)}, the world is at ${world.location}`,
    );
  }

  /**
   * The cast with the Keeper on the place's `keeper` mark by default (H7), unless the
   * scene puts `you` somewhere itself.
   */
  castOf(world: World): StageCast[] {
    const cast = this.stage.cast ?? [];
    const place = this.stage.place;
    if (!place || cast.some((c) => c.who === 'you')) return cast;
    const mark = PLACE_KEEPER[place];
    if (!mark || !markAt(world.location, mark)) return cast;
    return [{ who: 'you', mark }, ...cast];
  }

  /** Where everyone is drawn for this scene: marks first, then far speakers brought in. */
  private place(world: World): void {
    const cast = this.castOf(world);
    const you = cast.find((c) => c.who === 'you');
    const ym = you ? markAt(world.location, you.mark) : undefined;
    if (ym) this.keeperHold = { x: ym.x, z: ym.z };
    // Moss and Sable are Nubbins, not visiting Keepers: their marks hold their drawn spot.
    for (const c of cast) {
      const nid = this.nubbinIdOf(world, c.who);
      const m = nid ? markAt(world.location, c.mark) : undefined;
      if (nid && m) this.nubbinHolds.set(nid, { x: m.x, z: m.z });
    }
    const k = this.keeperHold ?? world.keeper.pos;
    const here = world.npcs.filter((n) => npcHere(world.location, n.trainer));
    for (const n of here) this.holds.set(n.id, { x: n.pos.x, z: n.pos.z });
    const marked = new Set<string>();
    for (const c of cast) {
      const n = here.find((x) => x.trainer === c.who);
      const m = markAt(world.location, c.mark);
      if (!n || !m) continue;
      this.holds.set(n.id, { x: m.x, z: m.z });
      this.faces.set(n.id, m.yaw);
      marked.add(n.id);
    }
    // C5: with no mark, a speaker beyond the framing radius steps in beside the Keeper,
    // from their own side, fanned out so two never stand on one spot.
    const s = READ3D.stage;
    let fan = 0;
    for (const n of here) {
      if (marked.has(n.id) || !this.speakers.has(n.trainer)) continue;
      const d = Math.hypot(n.pos.x - k.x, n.pos.z - k.z);
      if (d < s.radius) continue;
      const a = Math.atan2(n.pos.x - k.x, n.pos.z - k.z) + fan;
      fan = fan > 0 ? -fan : -fan + 0.7;
      this.holds.set(n.id, { x: k.x + Math.sin(a) * s.bringIn, z: k.z + Math.cos(a) * s.bringIn });
    }
    // Facing: toward whom the cast entry names, else the Keeper (marks keep their yaw).
    for (const n of here) {
      const at = this.holds.get(n.id)!;
      const entry = cast.find((c) => c.who === n.trainer);
      const faceWho = entry?.face;
      let to: Vec2 | undefined;
      if (faceWho === 'you') to = k;
      else if (faceWho) {
        const other = here.find((x) => x.trainer === faceWho);
        to = other ? this.holds.get(other.id) : undefined;
      } else if (!marked.has(n.id)) to = k;
      if (to) this.faces.set(n.id, Math.atan2(to.x - at.x, to.z - at.z));
    }
    this.keeperFace = this.keeperHold ? this.faceOfKeeper(world, you, ym?.yaw ?? null) : null;
    this.baseFaces.clear();
    for (const [id, f] of this.faces) this.baseFaces.set(id, f);
    this.baseKeeperFace = this.keeperFace;
  }

  /**
   * H7: turn the placed facings up to `amount` radians toward a camera standing at `camYaw`
   * from them (as `atan2(dx, dz)` from the subject to the camera), so a two-shot framed from
   * the side shows both faces three-quarter. Null puts them back as placed. Drawing only.
   */
  private camTurn: { yaw: number; amount: number } | null = null;

  turnFaces(camYaw: number | null, amount: number): void {
    this.camTurn = camYaw === null ? null : { yaw: camYaw, amount };
    const turn = (f: number): number => {
      if (camYaw === null) return f;
      const d = Math.atan2(Math.sin(camYaw - f), Math.cos(camYaw - f));
      return f + Math.max(-amount, Math.min(amount, d));
    };
    for (const [id, f] of this.baseFaces) this.faces.set(id, turn(f));
    this.keeperFace = this.baseKeeperFace === null ? null : turn(this.baseKeeperFace);
  }

  /**
   * H7: the held Keeper turns to whom its entry names, else to the first speaker drawn
   * here, else keeps its mark's yaw.
   */
  private faceOfKeeper(
    world: World,
    you: StageCast | undefined,
    yaw: number | null,
  ): number | null {
    const k = this.keeperHold;
    if (!k) return null;
    const names = you?.face ? [you.face] : [...this.speakers];
    for (const who of names) {
      if (who === 'narrator' || speaksAsKeeper(world, who, this.stage)) continue;
      const p = this.castSpot(world, who);
      if (p && Math.hypot(p.x - k.x, p.z - k.z) > 0.05) return Math.atan2(p.x - k.x, p.z - k.z);
    }
    return yaw;
  }

  /** The Keeper's drawn spot for the scene: on its mark, else where the sim has it. */
  keeperSpot(world: World): Vec2 {
    return this.keeperHold ?? { x: world.keeper.pos.x, z: world.keeper.pos.z };
  }

  /**
   * A focus entry's drawn spot: a speaker id first ('you' is the Keeper), then a mark name
   * at the current location (`green`, `house-1`, `flat-stone`…); null when neither.
   */
  spotOf(world: World, who: string): Vec2 | null {
    const cast = this.castSpot(world, who);
    if (cast) return cast;
    const m = markAt(world.location, who);
    return m ? { x: m.x, z: m.z } : null;
  }

  private castSpot(world: World, who: string): Vec2 | null {
    if (who === 'you') return this.keeperSpot(world);
    const n = world.npcs.find((x) => x.trainer === who && npcHere(world.location, x.trainer));
    if (n) return this.holds.get(n.id) ?? n.pos;
    const nid = this.nubbinIdOf(world, who);
    const nb = nid ? world.nubbins.find((x) => x.id === nid) : undefined;
    if (nb) return this.nubbinHolds.get(nb.id) ?? nb.pos;
    // A stage actor (a storyline speaker with no sim NPC) stands on its cast mark.
    const entry = this.stage.cast?.find((c) => c.who === who);
    const m = entry ? markAt(world.location, entry.mark) : undefined;
    return m ? { x: m.x, z: m.z } : null;
  }

  private nubbinIdOf(world: World, who: string): string | null {
    const c = world.campaign;
    return (who === 'sable' ? c?.sableId : who === 'moss' ? c?.mossId : null) ?? null;
  }

  /**
   * The framed points without the Keeper when the shot names its own focus and leaves the
   * Keeper out (`green`, `house-1`, `moss`…): the pan centres on what the scene is about.
   */
  subjects(world: World): Vec2[] {
    const all = this.frame(world);
    const focus = this.focusNow();
    if (!focus?.length || focus.includes('you') || all.length < 2) return all;
    return all.slice(1);
  }

  /**
   * Who is framed: the Keeper first, then `stage.shot.focus` when set, else whoever speaks
   * in the scene and stands near enough. Whoever speaks the line on screen is always framed,
   * however far (C5).
   */
  frame(world: World): FitPoint[] {
    const k = this.keeperSpot(world);
    const out: FitPoint[] = [{ x: k.x, z: k.z }];
    const near = (p: Vec2) => Math.hypot(p.x - k.x, p.z - k.z) < READ3D.stage.radius;
    const focus = this.focusNow();
    const names = focus ?? [...this.speakers];
    for (const who of names) {
      if (who === 'narrator' || speaksAsKeeper(world, who, this.stage)) continue;
      const p = this.spotOf(world, who);
      const fit = focus ? MARK_FIT[who] : undefined;
      if (p && (focus || who === this.speaker || near(p))) out.push(fit ? { ...p, fit } : p);
    }
    return out;
  }
}

/**
 * H4 for the pixel view: the zoom step and the aim point that fit `points` inside the
 * HUD-safe part of the view. The camera is orthographic at `pitch`, turned to `yaw`;
 * `views[i]` is the visible width and height (world units) at zoom step `i` (far first);
 * `safe` is the safe rect as shares of the view (0..1, y down). Each point is kept in frame
 * `figureH` up and `radius` round (a house's roof and walls).
 * Returns the nearest step that fits (else the farthest) and the ground point to aim at.
 */
export function fitPixel(
  points: readonly Vec2[],
  yaw: number,
  pitch: number,
  views: ReadonlyArray<{ w: number; h: number }>,
  safe: { x0: number; y0: number; x1: number; y1: number },
  figureH = 2,
  radius = 0.8,
): { zoom: number; x: number; z: number } {
  const o = points[0] ?? { x: 0, z: 0 };
  // Camera right on the ground, and "away from the camera" (up the screen) on the ground.
  const rx = Math.cos(yaw);
  const rz = -Math.sin(yaw);
  const fx = -Math.sin(yaw);
  const fz = -Math.cos(yaw);
  const sp = Math.sin(pitch);
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  // The sized marks' own extent (the pond, the Hush), kept whole when nothing else fits.
  let kx0 = Infinity;
  let kx1 = -Infinity;
  let ky0 = Infinity;
  let ky1 = -Infinity;
  for (const p of points) {
    const dx = p.x - o.x;
    const dz = p.z - o.z;
    const sx = dx * rx + dz * rz;
    const sy = (dx * fx + dz * fz) * sp;
    // A mark that carries its own size (MARK_FIT: the Hush) is kept whole.
    const fit = (p as FitPoint).fit;
    const r = fit ? Math.max(radius, fit.r) : radius;
    const h = fit ? Math.max(figureH, fit.hPx) : figureH;
    minX = Math.min(minX, sx - r);
    maxX = Math.max(maxX, sx + r);
    minY = Math.min(minY, sy - radius * sp);
    maxY = Math.max(maxY, sy + h * Math.cos(pitch));
    if (fit) {
      kx0 = Math.min(kx0, sx - r);
      kx1 = Math.max(kx1, sx + r);
      ky0 = Math.min(ky0, sy - radius * sp);
      ky1 = Math.max(ky1, sy + h * Math.cos(pitch));
    }
  }
  const sw = Math.max(0.05, safe.x1 - safe.x0);
  const sh = Math.max(0.05, safe.y1 - safe.y0);
  let zoom = 0;
  let fitsAll = false;
  for (let i = views.length - 1; i >= 0; i--) {
    const v = views[i]!;
    if (maxX - minX <= sw * v.w && maxY - minY <= sh * v.h) {
      zoom = i;
      fitsAll = true;
      break;
    }
  }
  const v = views[zoom] ?? { w: 1, h: 1 };
  // Where the safe rect's centre sits from the view's centre, in world units (y up).
  const ox = ((safe.x0 + safe.x1) / 2 - 0.5) * v.w;
  const oy = (0.5 - (safe.y0 + safe.y1) / 2) * v.h;
  let cx = (minX + maxX) / 2;
  let cy = (minY + maxY) / 2;
  // Too wide even at the far step (a phone held upright): slide the aim so the sized marks
  // stay whole, the scene's subject, and the rest keep what room is left (campaign graphics 3).
  if (!fitsAll && kx0 <= kx1) {
    const hw = (sw * v.w) / 2;
    const hh = (sh * v.h) / 2;
    const clamp = (c: number, lo: number, hi: number, half: number): number =>
      hi - lo > half * 2 ? (lo + hi) / 2 : Math.min(Math.max(c, hi - half), lo + half);
    cx = clamp(cx, kx0, kx1, hw);
    cy = clamp(cy, ky0, ky1, hh);
  }
  const bx = cx - ox;
  const by = (cy - oy) / Math.max(0.2, sp);
  return { zoom, x: o.x + rx * bx + fx * by, z: o.z + rz * bx + fz * by };
}

/**
 * Whether `who` is the player's own Keeper: 'you', or the Keeper picked on the title screen
 * when no NPC of that name is about (Fern speaking while the player plays as Fern). A stage
 * that casts that villager draws them as a stage actor instead (the look names keep "you
 * meet yourself" out of the story), so they are not the Keeper then.
 */
export function speaksAsKeeper(world: World, who: string, stage?: SceneStage): boolean {
  if (who === 'you') return true;
  if (stage?.cast?.some((c) => c.who === who)) return false;
  return who === world.trainer && !world.npcs.some((n) => n.trainer === who);
}

/** A framed point; a focus mark with its own size (MARK_FIT) carries it. */
export type FitPoint = Vec2 & { fit?: MarkFit };

/** A building in the way of a story camera: a footprint circle and a height. */
export interface Obstacle {
  x: number;
  z: number;
  r: number;
  h: number;
}

/**
 * What can stand between a story camera and the cast (review fix 2): the stock houses
 * still drawn, Dawn & Dusk's four crest houses (on the `house-1..4` marks) while that
 * campaign plays, and the gate. `hidden` says which stock buildings are not drawn now.
 */
export function stageObstacles(world: World, hidden: (id: string) => boolean): Obstacle[] {
  const out: Obstacle[] = [];
  const b = GROVE.buildings;
  const flags = stageFlags(world, null);
  const dd = flags.half !== null;
  const swapped = new Set<string>(dd ? ['cottage', 'school'] : []);
  for (const id of ['cottage', 'school', 'dojo', 'windmill'] as const) {
    if (hidden(id) || swapped.has(id)) continue;
    out.push({ x: b[id].x, z: b[id].z, r: b[id].r + 0.4, h: 4.5 });
  }
  if (dd)
    for (let i = 1; i <= 4; i++) {
      const m = markAt('grove', `house-${i}`);
      if (m) out.push({ x: m.x, z: m.z, r: 2.5, h: 5 });
    }
  // The gate's roofed frame (the 3D lychgate): a two-shot by it once looked through it, and
  // the gate, kept whole while a scene is about it, hid both faces (campaign graphics 3).
  const gate = markAt('grove', 'gate');
  if (gate) out.push({ x: gate.x, z: gate.z, r: 2, h: 3.6 });
  return world.location === 'grove' ? out : [];
}

/** How many of `subjects` (head height) a camera at `yaw` sees through an obstacle. */
export function blockedAt(
  subjects: readonly Vec2[],
  target: Vec2,
  yaw: number,
  pitch: number,
  distance: number,
  obstacles: readonly Obstacle[],
): number {
  const cx = target.x + Math.sin(yaw) * Math.cos(pitch) * distance;
  const cz = target.z + Math.cos(yaw) * Math.cos(pitch) * distance;
  const cy = Math.sin(pitch) * distance;
  let n = 0;
  for (const s of subjects) {
    const sy = 1.4;
    let hit = false;
    for (let i = 1; i < 30 && !hit; i++) {
      const t = i / 30;
      const x = cx + (s.x - cx) * t;
      const z = cz + (s.z - cz) * t;
      const y = cy + (sy - cy) * t;
      for (const o of obstacles) {
        // A subject standing at an obstacle's own edge is not hidden by it.
        if (Math.hypot(s.x - o.x, s.z - o.z) < o.r * 0.5) continue;
        if (y < o.h && Math.hypot(x - o.x, z - o.z) < o.r) {
          hit = true;
          break;
        }
      }
    }
    if (hit) n++;
  }
  return n;
}

/**
 * The camera yaw, from `candidates` in order of preference, that hides the fewest subjects
 * behind an obstacle (the first on a tie). For the pixel view's 45° steps and the 3D shot.
 */
export function clearYaw(
  candidates: readonly number[],
  subjects: readonly Vec2[],
  target: Vec2,
  pitch: number,
  distance: number,
  obstacles: readonly Obstacle[],
): number {
  let best = candidates[0] ?? 0;
  let bestN = Infinity;
  if (obstacles.length === 0 || subjects.length === 0) return best;
  for (const yaw of candidates) {
    const n = blockedAt(subjects, target, yaw, pitch, distance, obstacles);
    if (n < bestN) {
      best = yaw;
      bestN = n;
      if (n === 0) break;
    }
  }
  return best;
}

/** Candidate yaws in 45° steps from `yaw`, nearest first. */
export function yawSteps(yaw: number): number[] {
  const q = Math.PI / 4;
  return [0, 1, -1, 2, -2, 3, -3, 4].map((k) => yaw + k * q);
}
