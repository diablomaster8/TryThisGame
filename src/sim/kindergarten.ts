import { LESSONS, SERVICES } from '../config/tuning';
import { decidePersonality } from './personality';
import { hasSkill } from './skills';

/** Lessons cost less with the Teacher's pet skill. */
function lessonPrice(world: World): number {
  return Math.round(LESSONS.price * (hasSkill(world, 'teachersPet') ? 0.8 : 1));
}
import { bandOf, childHint, winningType } from './alignment';
import { addHappiness } from './needs';
import type { LessonId, Nubbin, SimEvent, World } from './types';

/**
 * The kindergarten: lessons that give a Nubbin a skill it performs idly (drawing,
 * singing, dance, an instrument), a doctor who reads the hidden numbers, and a
 * fortune teller who reads the character and the likely adult form. All paid in Shells.
 */
export const LESSON_IDS: readonly LessonId[] = ['drawing', 'singing', 'dance', 'instrument'];

export function lessonLevel(n: Nubbin, lesson: LessonId): number {
  return n.lessons?.[lesson] ?? 0;
}

export function canTakeLesson(world: World, n: Nubbin, lesson: LessonId): string | null {
  if (n.stage === 'egg' || n.stage === 'cocoon') return 'stage';
  if (n.behavior.state === 'lesson') return 'busy';
  if (lessonLevel(n, lesson) >= LESSONS.maxLevel) return 'max';
  if (world.inventory.shells < lessonPrice(world)) return 'shells';
  return null;
}

export function startLesson(
  world: World,
  n: Nubbin,
  lesson: LessonId,
  events: SimEvent[],
): boolean {
  if (canTakeLesson(world, n, lesson)) return false;
  world.inventory.shells -= lessonPrice(world);
  n.behavior.state = 'lesson';
  n.behavior.sinceMs = world.timeMs;
  n.behavior.untilMs = world.timeMs + LESSONS.durationMs;
  n.behavior.target = null;
  n.behavior.itemId = lesson;
  events.push({ kind: 'lessonStarted', nubbinId: n.id, lesson });
  return true;
}

/** Called by the behaviour loop when a lesson's time is up. */
export function finishLesson(world: World, n: Nubbin, events: SimEvent[]): void {
  const lesson = n.behavior.itemId as LessonId | null;
  if (!lesson) return;
  const level = Math.min(LESSONS.maxLevel, lessonLevel(n, lesson) + 1);
  n.lessons ??= {};
  n.lessons[lesson] = level;
  addHappiness(n, LESSONS.happiness);
  events.push({ kind: 'lessonDone', nubbinId: n.id, lesson, level });
}

/** The skill a Nubbin would show off: its best lesson, or null. */
export function bestLesson(n: Nubbin): LessonId | null {
  let best: LessonId | null = null;
  let bestLevel = 0;
  for (const id of LESSON_IDS) {
    const l = lessonLevel(n, id);
    if (l > bestLevel) {
      bestLevel = l;
      best = id;
    }
  }
  return best;
}

export interface DoctorReport {
  trust: number;
  alignment: number;
  happiness: number;
  affection: number;
  hunger: number;
  energy: number;
  lean: Record<string, number>;
  lifetimeHappiness: number;
}

export function doctorReport(n: Nubbin): DoctorReport {
  return {
    trust: Math.round(n.trust),
    alignment: Math.round(n.alignment * 100) / 100,
    happiness: Math.round(n.needs.happiness),
    affection: Math.round(n.needs.affection),
    hunger: Math.round(n.needs.hunger * 100),
    energy: Math.round(n.needs.energy * 100),
    lean: Object.fromEntries(Object.entries(n.typeLean).map(([k, v]) => [k, Math.round(v)])),
    lifetimeHappiness:
      n.happinessSamples === 0
        ? Math.round(n.needs.happiness)
        : Math.round(n.happinessSum / n.happinessSamples),
  };
}

export interface Fortune {
  band: 'sun' | 'moon' | 'neutral';
  type: string;
  personality: string;
  /** Rebirth is in the cards when happiness and affection are on track. */
  rebirthLikely: boolean;
  line: string;
}

const FORTUNE_LINES = [
  'A long road, and warm hands at the end of it.',
  'Someone will shake the tree for you. Let them.',
  'The pond remembers every splash. Make good ones.',
  'You will be carried further than you can run. That is fine.',
  'Sit still long enough and the hill comes to you.',
  'Grey is not the end of colour. Ask the lanterns.',
];

export function fortune(n: Nubbin): Fortune {
  const band = n.form ? bandOf(n.alignment) : childHint(n.alignment);
  const type = winningType(n.typeLean);
  // R0526 (SOUL-08): the reading uses the very rule that locks the personality at evolution.
  const personality = n.personality ?? decidePersonality(n.childCare);
  const avg = n.happinessSamples === 0 ? n.needs.happiness : n.happinessSum / n.happinessSamples;
  const line = FORTUNE_LINES[(n.seed >>> 0) % FORTUNE_LINES.length]!;
  return {
    band,
    type,
    personality,
    rebirthLikely: avg >= 30 && n.needs.affection >= 40,
    line,
  };
}

export function payService(
  world: World,
  service: 'doctor' | 'fortune',
  n: Nubbin,
  events: SimEvent[],
): boolean {
  const price = SERVICES[service];
  const ok = world.inventory.shells >= price;
  if (ok) world.inventory.shells -= price;
  events.push({ kind: 'service', service, nubbinId: n.id, ok });
  return ok;
}
