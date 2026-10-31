/**
 * R0525 (SOUL-07), lane A round 10: a schooled Nubbin's performance as the sim sees it. The
 * behaviour loop starts a `perform` with the lesson as its item; this notes the start for the
 * renderers and the sound (a `performStart` event), and a drawing leaves a crayon doodle on
 * the Grove's ground that fades after ten minutes. Live play only: nothing is drawn or
 * announced while catching up on time away. Doodles are hashed, never drawn from the rng.
 */
import { PERFORM } from '../config/tuning';
import { soulLive } from './antics';
import { LESSON_IDS, lessonLevel } from './kindergarten';
import { hashSeed } from './rng';
import type { LessonId, Nubbin, SimEvent, World } from './types';

export function isLesson(id: string | null | undefined): id is LessonId {
  return !!id && (LESSON_IDS as readonly string[]).includes(id);
}

/** Called once when a lesson performance begins. */
export function notePerformStart(world: World, n: Nubbin, events: SimEvent[]): void {
  const lesson = n.behavior.itemId;
  if (!isLesson(lesson) || !soulLive()) return;
  const now = world.timeMs;
  const level = Math.max(1, lessonLevel(n, lesson));
  events.push({ kind: 'performStart', nubbinId: n.id, lesson, level });
  if (lesson !== 'drawing' || world.location !== 'grove') return;
  const ahead = PERFORM.doodleAhead;
  const kind = hashSeed(`doodle:${n.seed}:${now}`) % PERFORM.doodleKinds;
  const kept = (world.doodles ?? []).filter((d) => now - d.atMs < PERFORM.doodleMs);
  kept.push({
    x: n.pos.x + Math.sin(n.facing) * ahead,
    z: n.pos.z + Math.cos(n.facing) * ahead,
    kind,
    atMs: now,
    by: n.id,
  });
  world.doodles = kept.slice(-PERFORM.doodleMax);
}

/** A doodle's opacity now: drawn in during the performance, fading out at the end. */
export function doodleAlpha(d: { atMs: number }, now: number): number {
  const age = now - d.atMs;
  if (age < 0 || age >= PERFORM.doodleMs) return 0;
  const drawIn = Math.min(1, age / PERFORM.doodleDrawMs);
  const fade = Math.min(1, (PERFORM.doodleMs - age) / PERFORM.doodleFadeMs);
  return drawIn * fade;
}
