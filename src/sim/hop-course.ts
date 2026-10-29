/**
 * MOVE-63: the hop course, a timed flag run across the Grove's rocks, hill tops and stream
 * for players who have the jump down. It opens once the hop lesson is done (MOVE-58). Stand
 * on the start flag to begin; touch the twelve flags in order; the last is back at the start.
 * A run is transient (never saved). The best time and the ghost live in the UI's side save
 * (`ui/hop-course.ts`); the only Grove write is the Hop Hat, once, on the first finish.
 * Live play only, in the home Grove; with no run under way a step costs one distance check.
 */
import { HOP_COURSE } from '../config/tuning-move';
import { keeperFooting } from './keeper';
import type { SimEvent, Vec2, World } from './types';

/** A run under way: when it began, the next flag (0-based), and the ghost so far. */
interface Run {
  startMs: number;
  next: number;
  ghost: number[];
}

const runs = new WeakMap<World, Run>();
// Worlds whose Keeper has not yet stepped off the start flag since the last run, so finishing
// on it (or giving up there) does not start a new run at once.
const waitOff = new WeakSet<World>();

export type HopMedal = 'gold' | 'silver' | 'bronze';

export function hopMedal(ms: number): HopMedal {
  return ms <= HOP_COURSE.gold ? 'gold' : ms <= HOP_COURSE.silver ? 'silver' : 'bronze';
}

/** Whether the course is open: the hop lesson is done. */
export function hopCourseOpen(world: World): boolean {
  return world.hopLesson === 'done';
}

/** The run under way, for the HUD and the renderers (read only), or null. */
export function hopCourseRun(world: World): Readonly<{ startMs: number; next: number }> | null {
  return runs.get(world) ?? null;
}

/** Whether the Keeper is touching a flag at `p`: close, with the feet up at its footing. */
function touching(world: World, p: Vec2): boolean {
  const k = world.keeper;
  if (Math.abs(k.pos.x - p.x) > HOP_COURSE.touch || Math.abs(k.pos.z - p.z) > HOP_COURSE.touch)
    return false;
  if (Math.hypot(k.pos.x - p.x, k.pos.z - p.z) > HOP_COURSE.touch) return false;
  return k.y >= keeperFooting(world, p.x, p.z).y - HOP_COURSE.feetSlack;
}

function end(world: World): void {
  runs.delete(world);
  waitOff.add(world);
}

/** Once per sim step in live play. */
export function stepHopCourse(world: World, events: SimEvent[]): void {
  const run = runs.get(world);
  if (!run) {
    if (!hopCourseOpen(world) || world.location !== 'grove') return;
    const on = touching(world, HOP_COURSE.start);
    if (!on) waitOff.delete(world);
    else if (!waitOff.has(world)) {
      runs.set(world, { startMs: world.timeMs, next: 0, ghost: [] });
      events.push({ kind: 'hopCourse', stage: 'start' });
    }
    return;
  }
  const ms = world.timeMs - run.startMs;
  if (world.location !== 'grove' || ms > HOP_COURSE.giveUpMs) {
    end(world);
    events.push({ kind: 'hopCourse', stage: 'gaveUp' });
    return;
  }
  const k = world.keeper;
  if (run.ghost.length < HOP_COURSE.ghostMax * 3) {
    run.ghost.push(
      Math.round(k.pos.x * 100) / 100,
      Math.round(k.y * 100) / 100,
      Math.round(k.pos.z * 100) / 100,
    );
  }
  if (!touching(world, HOP_COURSE.flags[run.next]!)) return;
  run.next += 1;
  if (run.next < HOP_COURSE.flags.length) {
    events.push({ kind: 'hopCourse', stage: 'flag', flag: run.next });
    return;
  }
  end(world);
  const hat = !world.inventory.hats.includes(HOP_COURSE.hat);
  if (hat) world.inventory.hats.push(HOP_COURSE.hat);
  events.push({ kind: 'hopCourse', stage: 'finish', ms, ghost: run.ghost, hat });
}
