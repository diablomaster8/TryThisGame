import { READ3D } from '../config/tuning';
import { SCENE_STAGES } from '../config/scene-stages';
import { DAWN_HOUR, DUSK_HOUR } from '../config/scene-stages-dawndusk';
import { E_STAGES } from '../config/tuning-e';
import { markAt } from '../config/stage-marks';
import type { Line, SceneStage, StagePlace } from '../config/story';
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
  private readonly speakers = new Set<string>();
  /** The resolved stage of the current scene ({} while none, or none authored). */
  stage: SceneStage = {};
  /** Each NPC's drawn spot for the scene, by NPC id. */
  readonly holds = new Map<string, Vec2>();
  /** Each NPC's drawn facing (radians, as `atan2(dx, dz)`), by NPC id. */
  readonly faces = new Map<string, number>();
  /** The hour the scene asks for (stage.hour, else its narration), or null for the clock's. */
  hour: number | null = null;
  /** Who speaks the line on screen now (the dialogue sets it each frame), or null. */
  speaker: string | null = null;
  /** Wall time (ms) the current scene began, for timed shots such as `establish`. */
  startedMs = 0;

  get active(): boolean {
    return this.sceneId !== null;
  }

  get id(): string | null {
    return this.sceneId;
  }

  /** Follow the story queue; true on the frame a scene begins or ends. */
  update(world: World, nowMs = 0): boolean {
    const r = resolveStage(world);
    const id = r?.id ?? null;
    if (id === this.sceneId) return false;
    this.sceneId = id;
    this.holds.clear();
    this.faces.clear();
    this.speakers.clear();
    this.hour = null;
    this.stage = {};
    this.startedMs = nowMs;
    if (!r) return true;
    this.stage = r.stage;
    for (const l of r.scene.lines) this.speakers.add(l.who);
    this.hour = SKY_LIT(world.location) ? (r.stage.hour ?? hourOf(r.scene.lines)) : null;
    this.place(world);
    return true;
  }

  /** The hour to draw at: the staged hour while a scene waits, else `clock`. */
  hourOr(clock: number): number {
    return this.hour ?? clock;
  }

  /** Where everyone is drawn for this scene: marks first, then far speakers brought in. */
  private place(world: World): void {
    const k = world.keeper.pos;
    const cast = this.stage.cast ?? [];
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
  }

  /** A speaker's drawn spot, by speaker id ('you' is the Keeper), or null when not here. */
  spotOf(world: World, who: string): Vec2 | null {
    if (who === 'you') return { x: world.keeper.pos.x, z: world.keeper.pos.z };
    const n = world.npcs.find((x) => x.trainer === who && npcHere(world.location, x.trainer));
    if (n) return this.holds.get(n.id) ?? n.pos;
    const c = world.campaign;
    const nid = who === 'sable' ? c?.sableId : who === 'moss' ? c?.mossId : null;
    const nb = nid ? world.nubbins.find((x) => x.id === nid) : undefined;
    return nb ? nb.pos : null;
  }

  /**
   * Who is framed: the Keeper first, then `stage.shot.focus` when set, else whoever speaks
   * in the scene and stands near enough. Whoever speaks the line on screen is always framed,
   * however far (C5).
   */
  frame(world: World): Vec2[] {
    const k = world.keeper.pos;
    const out: Vec2[] = [{ x: k.x, z: k.z }];
    const near = (p: Vec2) => Math.hypot(p.x - k.x, p.z - k.z) < READ3D.stage.radius;
    const focus = this.stage.shot?.focus;
    const names = focus ?? [...this.speakers];
    for (const who of names) {
      if (who === 'you' || who === 'narrator') continue;
      const p = this.spotOf(world, who);
      if (p && (focus || who === this.speaker || near(p))) out.push(p);
    }
    return out;
  }
}
