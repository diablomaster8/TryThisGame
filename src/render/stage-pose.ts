import { markAt } from '../config/stage-marks';
import { PARTNER_CAST, type LineGesture, type Mood, type StageCast } from '../config/story';
import { CG4_A1 } from '../config/tuning-a1';
import { CG2_P } from '../config/tuning-p';
import type { Vec2, World } from '../sim/types';
import { npcHere, partnerIdOf, speaksAsKeeper } from './scene-stage';
import { festivalNubbinSpots, festivalScene, liveSpeaker, type StageTracker } from './stage-actors';

/**
 * Campaign graphics 4, package a1: the renderer-neutral half of the stage poses. Each frame a
 * dressing (render/dress-a1.ts, render3d/dress-a1.ts) works out, for everyone the scene puts
 * on the ground, the pose they hold (K1 `sit`/`kneel` on a seat, K39 the Keeper's item-get),
 * the gesture the speaker plays (K7) and the point listeners turn their heads to (K6; crowd
 * Nubbins at half strength, K41). The drawers read `POSE_CUES` by figure id:
 *
 * - `keeper` the player's Keeper; a sim NPC by its NPC id; a stage actor as `stage-<who>`;
 *   a Nubbin (Moss, Sable, the partner) by its Nubbin id; `festival-nubbin-<i>` the ring's.
 *
 * Render only: nothing here writes the world.
 */

/** The dialogue's line index on screen, set by the game each frame (the stager's `line`). */
export const STAGE_LINE = { line: 0 };

/** Reduced motion, read by the drawers that have no ctx (the crowd, the actors). */
export const POSE_FLAGS = { still: false };

export type StagePose = 'sit' | 'kneel' | 'itemGet';

export interface PoseCue {
  /** A pose to hold instead of standing, or null. */
  pose: StagePose | null;
  /** The seat under a `sit`, world units above the ground. */
  seatY: number;
  /** The gesture the speaker plays on this line, or null. */
  gesture: LineGesture | null;
  /** Seconds since the gesture's line came up. */
  gestureAge: number;
  /** The speaker's spot and how strongly to turn toward it, or null. */
  attend: { x: number; z: number; k: number } | null;
  /** The body's facing (radians, `atan2(dx, dz)`) and the drawn facing with the head's turn. */
  body: number;
  face: number;
}

export const POSE_CUES = new Map<string, PoseCue>();

/** K7's default: a sad line looks down, a happy one nods; others play none. */
export function moodGesture(mood: Mood | undefined): LineGesture | null {
  return mood === 'sad' ? 'down' : mood === 'happy' ? 'nod' : null;
}

/** A mark's seat: its own `seatY`, else the tuning table's, else the ground. */
export function seatOf(location: string, mark: string): number {
  const m = markAt(location, mark);
  return m?.seatY ?? CG4_A1.seats[mark] ?? 0;
}

const wrap = (a: number): number => Math.atan2(Math.sin(a), Math.cos(a));

/** The turn of a head at `from`, facing `body`, toward `to`: clamped to 60 degrees, times k. */
export function headTurnToward(from: Vec2, body: number, to: Vec2, k: number): number {
  if (Math.hypot(to.x - from.x, to.z - from.z) < 0.05) return 0;
  const d = wrap(Math.atan2(to.x - from.x, to.z - from.z) - body);
  const lim = Math.PI / 3;
  return Math.max(-lim, Math.min(lim, d)) * k;
}

interface Placed {
  key: string;
  who: string;
  at: Vec2;
  body: number;
  k: number;
  cast?: StageCast;
}

/** One dressing's pose director: ticked once a frame after its tracker. */
export class PoseDirector {
  private sceneId: string | null = null;
  private sceneMs = 0;
  private lineIdx = -1;
  private lineMs = 0;
  private ms = 0;

  update(world: World, tracker: StageTracker, dt: number, still: boolean): void {
    this.ms += dt * 1000;
    POSE_FLAGS.still = still;
    POSE_CUES.clear();
    const st = tracker.stager;
    if (!st.active) {
      this.sceneId = null;
      return;
    }
    st.line = STAGE_LINE.line;
    if (st.id !== this.sceneId) {
      this.sceneId = st.id;
      this.sceneMs = this.ms;
      this.lineIdx = -1;
    }
    if (st.line !== this.lineIdx) {
      this.lineIdx = st.line;
      this.lineMs = this.ms;
    }
    const stage = st.stage;
    const loc = world.location;
    const cast = st.castOf(world);
    const out: Placed[] = [];
    const k = CG4_A1.attend;

    // The Keeper, on its mark or where the sim has it.
    const you = cast.find((c) => c.who === 'you');
    out.push({
      key: 'keeper',
      who: 'you',
      at: st.keeperSpot(world),
      body: st.keeperFace ?? world.keeper.facing,
      k: k.cast,
      ...(you ? { cast: you } : {}),
    });
    // Sim NPCs here, where the stager holds them.
    for (const n of world.npcs) {
      if (!npcHere(loc, n.trainer)) continue;
      const c = cast.find((e) => e.who === n.trainer);
      out.push({
        key: n.id,
        who: n.trainer,
        at: st.holds.get(n.id) ?? n.pos,
        body: st.faces.get(n.id) ?? n.facing,
        k: k.cast,
        ...(c ? { cast: c } : {}),
      });
    }
    // Stage actors (storyline speakers with no sim NPC).
    for (const a of tracker.actors(world)) {
      const c = cast.find((e) => e.who === a.who);
      out.push({
        key: `stage-${a.who}`,
        who: a.who,
        at: { x: a.x, z: a.z },
        body: a.yaw,
        k: k.cast,
        ...(c ? { cast: c } : {}),
      });
    }
    // Moss, Sable and the partner.
    const camp = world.campaign;
    const nubs: Array<[string, string | null | undefined]> = [
      ['moss', camp?.mossId],
      ['sable', camp?.sableId],
    ];
    for (const [who, id] of nubs) {
      const n = id ? world.nubbins.find((x) => x.id === id) : undefined;
      if (!n) continue;
      const c = cast.find((e) => e.who === who);
      out.push({
        key: n.id,
        who,
        at: st.nubbinHolds.get(n.id) ?? n.pos,
        body: n.facing,
        k: k.cast,
        ...(c ? { cast: c } : {}),
      });
    }
    const pid = partnerIdOf(world);
    if (pid && !out.some((p) => p.key === pid)) {
      const n = world.nubbins.find((x) => x.id === pid);
      const p = st.partner;
      if (n) {
        const c = cast.find((e) => e.who === PARTNER_CAST);
        out.push({
          key: pid,
          who: PARTNER_CAST,
          at: p ? { x: p.x, z: p.z } : n.pos,
          body: p?.yaw ?? n.facing,
          k: k.cast,
          ...(c ? { cast: c } : {}),
        });
      }
    }
    // K41: the festival ring's Nubbins look on at half strength.
    if (loc === 'grove' && festivalScene(stage)) {
      festivalNubbinSpots(loc, CG2_P.festival.nubbinRadius, CG2_P.festival.nubbinCount).forEach(
        (s, i) =>
          out.push({
            key: `festival-nubbin-${i}`,
            who: '',
            at: { x: s.x, z: s.z },
            body: s.yaw,
            k: k.crowd,
          }),
      );
    }

    // Who speaks, and where they stand.
    const said = liveSpeaker();
    const spkKey =
      said && said !== 'narrator' && said !== 'chorus'
        ? speaksAsKeeper(world, said, stage)
          ? 'keeper'
          : (out.find((p) => p.who === said)?.key ?? null)
        : null;
    const spk = spkKey ? out.find((p) => p.key === spkKey) : undefined;
    const line = st.lines[st.line];
    const gesture =
      line && said && line.who === said ? (line.gesture ?? moodGesture(line.mood)) : null;
    const itemOn =
      !!stage.item && this.ms - this.sceneMs < (stage.hold ?? 0) * 1000 + CG4_A1.itemGetS * 1000;
    const itemFrom = (stage.hold ?? 0) * 1000;

    for (const p of out) {
      const c = p.cast;
      let pose: StagePose | null = c?.pose === 'sit' || c?.pose === 'kneel' ? c.pose : null;
      if (p.key === 'keeper' && itemOn && this.ms - this.sceneMs >= itemFrom) pose = 'itemGet';
      const listening = spk && spk.key !== p.key;
      const turn = listening ? headTurnToward(p.at, p.body, spk.at, p.k) : 0;
      POSE_CUES.set(p.key, {
        pose,
        seatY: pose === 'sit' && c ? seatOf(loc, c.mark) : 0,
        gesture: spk && spk.key === p.key ? gesture : null,
        gestureAge: (this.ms - this.lineMs) / 1000,
        attend: listening ? { x: spk.at.x, z: spk.at.z, k: p.k } : null,
        body: p.body,
        face: p.body + turn,
      });
    }
  }
}

/** What the pixel view draws for a figure: the clip, its frame, the facing and a seat lift. */
export interface PixelPose {
  clip: string;
  frame: number;
  face: number;
  lift: number;
}

/**
 * The pixel frame for a cue, or null to draw as before. Keeper sheets have `sit` (2 frames),
 * `kneel`, `itemget` and one held frame per gesture (`g-nod`...); Nubbin sheets have `sit`.
 * `hasClip` says whether the sheet carries a clip; a figure without it keeps its own frames
 * but still turns toward the speaker.
 */
export function pixelPose(
  id: string,
  nowMs: number,
  hasClip: (clip: string) => boolean,
  moving = false,
): PixelPose | null {
  const c = POSE_CUES.get(id);
  if (!c) return null;
  const lift = c.pose === 'sit' ? c.seatY : 0;
  if (moving) return null;
  const g = c.gesture;
  if (g && (g === 'down' || c.gestureAge < CG4_A1.gestureHoldS) && hasClip(`g-${g}`))
    return { clip: `g-${g}`, frame: 0, face: c.face, lift };
  if (c.pose === 'itemGet' && hasClip('itemget'))
    return { clip: 'itemget', frame: 0, face: c.body, lift };
  const sits = c.pose === 'sit' || (c.pose === 'kneel' && !hasClip('kneel'));
  if (sits && hasClip('sit')) {
    const frame = POSE_FLAGS.still ? 0 : Math.floor(nowMs / CG4_A1.sitFrameMs) % 2;
    return { clip: 'sit', frame, face: c.face, lift };
  }
  if (c.pose === 'kneel' && hasClip('kneel'))
    return { clip: 'kneel', frame: 0, face: c.face, lift };
  if (c.face === c.body) return null;
  return { clip: '', frame: -1, face: c.face, lift };
}
