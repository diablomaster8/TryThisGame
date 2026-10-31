import { CHAT, DOCTOR, LESSONS, PERFORM, SERVICES } from '../config/tuning';
import { bestFriend } from './friendships';
import { likesOf, type Taste } from './likes';
import { decidePersonality } from './personality';
import { hashSeed } from './rng';
import { hasSkill } from './skills';
import { traitsOf, type TraitId } from './traits';

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
  // R0525 (lane A r10): a new player is handed its instrument (bell, drum or trumpet) for good.
  if (lesson === 'instrument' && n.lessons.instrumentKind === undefined)
    n.lessons.instrumentKind =
      hashSeed(`instrument:${n.seed}:${world.timeMs}`) % PERFORM.instruments.length;
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
  // R0557 (lane A r10): each reading reveals one like the Keeper has not seen yet.
  const reveal = ok && service === 'fortune' ? nextReveal(n) : null;
  if (reveal) n.tasteSeen = { ...n.tasteSeen, [reveal]: true };
  events.push({ kind: 'service', service, nubbinId: n.id, ok });
  return ok;
}

export type Instrument = (typeof PERFORM.instruments)[number];

/** R0525: the instrument it plays: the one it was handed, or one from its seed (old saves). */
export function instrumentOf(n: Pick<Nubbin, 'seed' | 'lessons'>): Instrument {
  const k = n.lessons?.instrumentKind ?? hashSeed(`instrument:${n.seed}`);
  return PERFORM.instruments[k % PERFORM.instruments.length]!;
}

// ---------------------------------------------------------------- fortune (R0557, SOUL-40)

export type RevealKind = 'yum' | 'toy' | 'bleh';

/** The like a fortune would reveal next: the favourite fruit, then the toy, then the dislike. */
export function nextReveal(n: Pick<Nubbin, 'tasteSeen'>): RevealKind | null {
  const seen = n.tasteSeen ?? {};
  for (const k of ['yum', 'toy', 'bleh'] as const) if (!seen[k]) return k;
  return null;
}

export interface Reading {
  /** Keys into FORTUNE_TEXT: the character line, then the road ahead. */
  character: { kind: 'personality'; id: string; pick: number } | { kind: 'trait'; id: TraitId };
  band: { id: 'sun' | 'moon' | 'neutral'; pick: number };
  /** The like this visit reveals (what the sim marks seen once paid), or null when all known. */
  reveal:
    | { kind: 'yum'; taste: Taste }
    | { kind: 'toy'; toy: string }
    | { kind: 'bleh'; taste: Taste }
    | null;
}

/**
 * What the fortune teller sees: a line on the character (its leaning personality or one of
 * its traits), one on the road ahead (its alignment trend), and one like it has not shown the
 * Keeper yet. The picks turn with the minute, so a second visit reads differently.
 */
export function reading(n: Nubbin, now: number): Reading {
  const h = hashSeed(`fortune:${n.seed}:${Math.floor(now / 60_000)}`);
  const personality = n.personality ?? decidePersonality(n.childCare);
  const traits = traitsOf(n);
  const pickTrait = h % (traits.length + 1);
  const character: Reading['character'] =
    pickTrait < traits.length
      ? { kind: 'trait', id: traits[pickTrait]! }
      : { kind: 'personality', id: personality, pick: (h >>> 4) % 2 };
  const band = n.form ? bandOf(n.alignment) : childHint(n.alignment);
  const likes = likesOf(n);
  const next = nextReveal(n);
  const reveal: Reading['reveal'] =
    next === 'yum'
      ? { kind: 'yum', taste: likes.fruit }
      : next === 'toy'
        ? { kind: 'toy', toy: likes.toy }
        : next === 'bleh'
          ? { kind: 'bleh', taste: likes.dislike }
          : null;
  return { character, band: { id: band, pick: (h >>> 8) % 2 }, reveal };
}

// ---------------------------------------------------------------- doctor (R0556, SOUL-39)

export type DoctorNote =
  | { id: 'noHug' | 'hungry' | 'tired' | 'sad' | 'wary' | 'lonely' | 'glad' | 'fine' }
  | { id: 'sunward' | 'moonward' }
  | { id: 'buddy'; friend: string }
  | { id: 'lean'; type: string }
  | { id: 'favMystery' | 'toyMystery' | 'blehMystery' | 'likesKnown' };

/** Sociable sorts miss a cuddle sooner. */
function sociable(n: Nubbin): boolean {
  const p = n.personality ?? decidePersonality(n.childCare);
  return p === 'cheerful' || traitsOf(n).some((t) => t === 'ticklish' || t === 'showoff');
}

/**
 * The doctor's two plain-language notes: the first on how it is doing (the most pressing
 * need first, else something nice), the second on its likes, so the Keeper knows what is
 * still to find out (SOUL-18).
 */
export function doctorNotes(n: Nubbin, world: World): [DoctorNote, DoctorNote] {
  const D = DOCTOR;
  const now = world.timeMs;
  const others = world.nubbins.some(
    (o) => o.id !== n.id && o.stage !== 'egg' && o.stage !== 'cocoon',
  );
  const buddy = bestFriend(world, n);
  const lean = Object.entries(n.typeLean).sort((a, b) => b[1] - a[1]);
  let first: DoctorNote;
  if (n.needs.hunger < D.hungryBelow) first = { id: 'hungry' };
  else if (n.needs.energy < D.tiredBelow) first = { id: 'tired' };
  else if (n.shadow && !n.bond && n.trust < D.shyTrustBelow) first = { id: 'wary' };
  else if (n.needs.happiness < D.sadBelow) first = { id: 'sad' };
  else if (sociable(n) && now - n.lastPetMs > D.hugGapMs) first = { id: 'noHug' };
  else if (others && !buddy) first = { id: 'lonely' };
  else if (n.needs.happiness > D.gladAbove) first = { id: 'glad' };
  else if (buddy && (n.friends?.[buddy.id] ?? 0) >= CHAT.hugAt)
    first = { id: 'buddy', friend: buddy.name };
  else if (n.alignment > D.alignLean) first = { id: 'sunward' };
  else if (n.alignment < -D.alignLean) first = { id: 'moonward' };
  else if (lean[0] && lean[0][1] - (lean[1]?.[1] ?? 0) >= D.leanLead)
    first = { id: 'lean', type: lean[0][0] };
  else first = { id: 'fine' };
  const seen = n.tasteSeen ?? {};
  const second: DoctorNote = !seen.yum
    ? { id: 'favMystery' }
    : !seen.toy
      ? { id: 'toyMystery' }
      : !seen.bleh
        ? { id: 'blehMystery' }
        : { id: 'likesKnown' };
  return [first, second];
}
