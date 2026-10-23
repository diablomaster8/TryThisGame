import {
  NPC_LOOKS,
  STORY_NPC_LOOKS,
  STORY_ONLY_LOOKS,
  storyId,
  type StoryNpcLook,
} from '../config/npc-looks';
import { markAt } from '../config/stage-marks';
import type { SceneStage, StageCast } from '../config/story';
import { mossOnHill } from '../sim/roster';
import { trainerLook } from './keeper-look';
import type { Vec2, World } from '../sim/types';
import { npcHere, SceneStager } from './scene-stage';

/**
 * Campaign graphics 2, package p: the shared, renderer-neutral half of the stage actors
 * (C1), the weathered set (C6), the carry props (N3) and the speaker pip (H6). Both
 * dressings (render/dress-p.ts, render3d/dress-p.ts) read it; nothing here draws.
 *
 * Stage actors are render-only: a storyline speaker (`b-hob`, `h-ida`...) has no sim NPC,
 * so the dressing draws them from the scene's resolved cast. The sim stays untouched.
 */

/** The carry props this package draws (the others, lantern, bucket, bag, are drawn elsewhere). */
export type CarryProp = 'broom' | 'notebook' | 'egg' | 'keys';
const CARRY_PROPS: ReadonlySet<string> = new Set(['broom', 'notebook', 'egg', 'keys']);

export interface StageActor {
  who: string;
  x: number;
  z: number;
  /** Facing as `atan2(dx, dz)`. */
  yaw: number;
  pose: NonNullable<StageCast['pose']>;
  carry: CarryProp | null;
  look: StoryNpcLook;
}

/** A cast member who holds one of the carry props, on a sim NPC or a stage actor alike. */
export interface Carrier {
  who: string;
  x: number;
  z: number;
  yaw: number;
  prop: CarryProp;
  /** Body scale of the carrier (the hand sits lower on a smaller figure). */
  scale: number;
}

/** Who speaks the line on screen, written by the dialogue box (`portraitFrame`). */
export const SPEAKER_NOW: { who: string | null } = { who: null };

/**
 * The speaker id while the dialogue box shows a spoken line, else null. The box is read for
 * whether it is open and whether the line is narration or the chorus (no one in the world
 * is speaking then); without a document (tests) it is null.
 */
export function liveSpeaker(): string | null {
  if (typeof document === 'undefined') return null;
  const box = document.querySelector('.dialogue');
  if (!box || (box as HTMLElement).hidden) return null;
  // Narration, the chorus, and a chapter postcard holding the first line back (the box
  // still wears the last scene's speaker then) have no one speaking in the world.
  if (['narration', 'chorus', 'held'].some((c) => box.classList.contains(c))) return null;
  return SPEAKER_NOW.who;
}

/**
 * One dressing's view of the story moment: its own stager (a pure function of the world,
 * so it agrees with the renderer's), ticked with the frame's `dt`.
 */
export class StageTracker {
  readonly stager = new SceneStager();
  private ms = 0;

  tick(world: World, dt: number): void {
    this.ms += dt * 1000;
    this.stager.speaker = liveSpeaker();
    this.stager.update(world, this.ms);
  }

  get stage(): SceneStage {
    return this.stager.stage;
  }

  /** Where a cast entry stands: its mark (a sim NPC's held spot and a Nubbin's come first). */
  spotOf(world: World, who: string): Vec2 | null {
    const m = this.stager.spotOf(world, who);
    if (m) return m;
    const c = this.stager.stage.cast?.find((e) => e.who === who);
    const mark = c ? markAt(world.location, c.mark) : undefined;
    return mark ? { x: mark.x, z: mark.z } : null;
  }

  /** The storyline speakers the stage puts on the ground (none while no scene is queued). */
  actors(world: World): StageActor[] {
    if (!this.stager.active) return [];
    const out: StageActor[] = [];
    const cast = this.stager.castOf(world);
    for (const c of cast) {
      const look = STORY_NPC_LOOKS[c.who] ?? villagerLook(world, c.who);
      if (!look) continue;
      // A sim NPC with the same id is drawn by the world's own figures.
      if (world.npcs.some((n) => n.trainer === c.who && npcHere(world.location, n.trainer)))
        continue;
      const m = markAt(world.location, c.mark);
      if (!m) continue;
      let yaw = m.yaw;
      if (c.face) {
        const to = c.face === 'you' ? this.stager.keeperSpot(world) : this.spotOf(world, c.face);
        if (to && Math.hypot(to.x - m.x, to.z - m.z) > 0.05)
          yaw = Math.atan2(to.x - m.x, to.z - m.z);
      }
      // K5: a walk-on is somewhere between its `from` mark and its own, in its walk clip.
      const w = this.stager.actorWalk.get(c.who);
      out.push({
        who: c.who,
        x: w ? w.x : m.x,
        z: w ? w.z : m.z,
        yaw: w ? w.yaw : yaw,
        pose: w?.walking ? 'walk' : (c.pose ?? 'stand'),
        carry: carryOf(c),
        look,
      });
    }
    return out;
  }

  /** Cast members holding a broom, notebook, egg or key ring. */
  carriers(world: World, actors: readonly StageActor[]): Carrier[] {
    if (!this.stager.active) return [];
    const out: Carrier[] = [];
    for (const a of actors) {
      if (a.carry)
        out.push({
          who: a.who,
          x: a.x,
          z: a.z,
          yaw: a.yaw,
          prop: a.carry,
          scale: a.look.scale ?? 1,
        });
    }
    // Sim NPCs in the cast who hold one (Hazel's Keepers): where the stager holds them.
    for (const c of this.stager.castOf(world)) {
      const prop = carryOf(c);
      if (!prop || actors.some((a) => a.who === c.who)) continue;
      const n = world.npcs.find((x) => x.trainer === c.who && npcHere(world.location, x.trainer));
      const at = n ? (this.stager.holds.get(n.id) ?? n.pos) : null;
      if (!n || !at) continue;
      out.push({
        who: c.who,
        x: at.x,
        z: at.z,
        yaw: this.stager.faces.get(n.id) ?? n.facing,
        prop,
        scale: 1,
      });
    }
    return out;
  }

  /**
   * The Nubbins drawn weathered (C6): Moss while he is "the grey shape" on the hill, and the
   * Nubbin of any cast entry with `tint: 'weathered'`.
   */
  weathered(world: World): Set<string> {
    const out = new Set<string>();
    const c = world.campaign;
    if (c?.mossId && mossOnHill(world, c.mossId)) out.add(c.mossId);
    for (const e of this.stager.active ? (this.stager.stage.cast ?? []) : []) {
      if (e.tint !== 'weathered') continue;
      const id = e.who === 'moss' ? c?.mossId : e.who === 'sable' ? c?.sableId : null;
      if (id) out.add(id);
    }
    return out;
  }

  /** The drawn spot and kind of whoever speaks now, for the chevron; null for none. */
  speakerSpot(
    world: World,
  ): { x: number; z: number; kind: 'keeper' | 'nubbin'; scale: number; id: string } | null {
    const who = liveSpeaker();
    if (!who || who === 'narrator' || who === 'chorus') return null;
    if (who === 'you') {
      const k = this.stager.keeperSpot(world);
      return { x: k.x, z: k.z, kind: 'keeper', scale: 1, id: who };
    }
    const nid = this.nubbinOf(world, who);
    if (nid) {
      const n = world.nubbins.find((x) => x.id === nid);
      const p = n ? (this.stager.nubbinHolds.get(n.id) ?? n.pos) : null;
      return p ? { x: p.x, z: p.z, kind: 'nubbin', scale: 1, id: who } : null;
    }
    // No staged scene: a visiting Keeper (Fern, Corvin...) stands where the sim has them.
    const npc = world.npcs.find((n) => n.trainer === who && npcHere(world.location, n.trainer));
    const p = this.spotOf(world, who) ?? (npc ? npc.pos : null);
    if (!p) return null;
    const look = STORY_NPC_LOOKS[who];
    return { x: p.x, z: p.z, kind: 'keeper', scale: look?.scale ?? 1, id: who };
  }

  private nubbinOf(world: World, who: string): string | null {
    const c = world.campaign;
    return (who === 'sable' ? c?.sableId : who === 'moss' ? c?.mossId : null) ?? null;
  }
}

/**
 * A Hazel villager cast in a scene while the player wears their look (Fern when the player
 * picked the Gardener): there is no sim NPC of them about, so they stand as a stage actor in
 * their own clothes and accessory (campaign graphics 3).
 */
function villagerLook(world: World, who: string): StoryNpcLook | undefined {
  // K11: Hazel has no sim NPC before chapter 11; a tale draws young Hazel as a stage actor.
  if (who === 'hazel') return STORY_ONLY_LOOKS[storyId(who)];
  const acc = NPC_LOOKS[who];
  // Corvin has no sim NPC in the Grove, so he is drawn here too (K5: he walks up to the gate).
  if (who === 'corvin' && acc) return { ...acc, trainer: trainerLook(who) };
  const t = TRAINERS.find((x) => x.id === who);
  if (!acc || !t || who !== world.trainer) return undefined;
  return STORY_ONLY_LOOKS[storyId(who)] ?? { ...acc, trainer: t.look };
}

function carryOf(c: StageCast): CarryProp | null {
  return c.carry && CARRY_PROPS.has(c.carry) ? (c.carry as CarryProp) : null;
}

/** The festival scene's marks: a cast entry on one of them triggers H9's crowd. */
export function festivalScene(stage: SceneStage): boolean {
  return (
    stage.place === 'festival' || (stage.cast ?? []).some((c) => c.mark.startsWith('festival-'))
  );
}

/** Points on the festival ring between the Keepers' marks, for the extra Nubbins (H9). */
export function festivalNubbinSpots(
  location: World['location'],
  radius: number,
  count: number,
): Array<{ x: number; z: number; yaw: number }> {
  const a = markAt(location, 'festival-1');
  const b = markAt(location, 'festival-7');
  if (!a || !b) return [];
  // The ring's centre is midway between two opposite marks.
  const cx = (a.x + b.x) / 2;
  const cz = (a.z + b.z) / 2;
  const base = Math.atan2(a.x - cx, a.z - cz);
  const out: Array<{ x: number; z: number; yaw: number }> = [];
  for (let i = 0; i < count; i++) {
    // Between mark k and k+1 (a mark every 30 degrees): half a step on.
    const ang = base + ((i * 2 + 0.5) * (Math.PI * 2)) / 12 + (i % 2 ? 0.08 : -0.08);
    const x = cx + Math.sin(ang) * radius;
    const z = cz + Math.cos(ang) * radius;
    out.push({ x, z, yaw: Math.atan2(cx - x, cz - z) });
  }
  return out;
}
