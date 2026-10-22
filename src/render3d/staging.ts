import { READ3D } from '../config/tuning';
import type { Line } from '../config/story';
import { sceneFor } from '../sim/story-scenes';
import type { Vec2, World } from '../sim/types';

/**
 * Story scenes in Full 3D (review 2026-10-21, bug 11). The scripts carry no staging data
 * (a scene is speakers and lines), and the pixel view stages nothing either, so this reads
 * what it can: while a scene waits at the head of the story queue, the visiting Keepers who
 * speak in it, and Sable or Moss when they do, are framed with the Keeper; everyone holds
 * where they stood when it began, turned to the Keeper; and a scene whose opening
 * narration names the hour (late afternoon, dusk, night, dawn) is lit at that hour. All of
 * it is drawing only: the sim's NPCs keep their own positions.
 */
export class SceneStaging {
  private sceneId: string | null = null;
  private speakers = new Set<string>();
  /** Each NPC's spot when the scene began, by NPC id. */
  readonly holds = new Map<string, Vec2>();
  /** The hour the scene's narration asks for, or null to keep the clock's. */
  hour: number | null = null;

  get active(): boolean {
    return this.sceneId !== null;
  }

  /** Follow the story queue; true on the frame a scene begins or ends. */
  update(world: World): boolean {
    const home = world.location === 'grove';
    const id = (home && world.campaign?.queue[0]) || null;
    if (id === this.sceneId) return false;
    this.sceneId = id;
    this.holds.clear();
    this.speakers.clear();
    this.hour = null;
    if (!id) return true;
    const scene = sceneFor(world, id, 'main');
    if (!scene) return true;
    for (const l of scene.lines) this.speakers.add(l.who);
    this.hour = hourOf(scene.lines);
    for (const n of world.npcs) this.holds.set(n.id, { x: n.pos.x, z: n.pos.z });
    return true;
  }

  /** The Keeper and whoever speaks in the scene and stands near enough to frame with. */
  frame(world: World): Vec2[] {
    const k = world.keeper.pos;
    const out: Vec2[] = [{ x: k.x, z: k.z }];
    const near = (p: Vec2) => Math.hypot(p.x - k.x, p.z - k.z) < READ3D.stage.radius;
    for (const n of world.npcs) {
      const p = this.holds.get(n.id) ?? n.pos;
      if (this.speakers.has(n.trainer) && near(p)) out.push(p);
    }
    const c = world.campaign;
    for (const [who, nid] of [
      ['sable', c?.sableId],
      ['moss', c?.mossId],
    ] as const) {
      if (!nid || !this.speakers.has(who)) continue;
      const n = world.nubbins.find((x) => x.id === nid);
      if (n && near(n.pos)) out.push(n.pos);
    }
    return out;
  }
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
