/**
 * R0474 (TECH-32): the private on-device Grove diary. A few play counts kept in the save so
 * the Journal can say "You have hatched 12 Nubbins" and so a device pass can see whether the
 * first minute worked. Nothing is sent anywhere: it lives in the world, travels with an exported
 * save, and the bug report can copy it. Pure: it reads this step's events and the step length.
 * Times are sim milliseconds (`world.timeMs`), so a fast-forwarded test reads the same.
 */
import { EGG } from '../config/tuning';
import { FIRST_LOOP } from '../config/tuning-more/ui-first-loop';
import type { SimEvent, World } from './types';

export interface Diary {
  sessions: number;
  /** Sim time of the first hatch, first pat and first meal (null until they happen). */
  firstHatchMs: number | null;
  firstPetMs: number | null;
  firstFeedMs: number | null;
  minutesPlayed: number;
  longestSessionMin: number;
  panelsOpened: Record<string, number>;
  scenesSkipped: number;
  cantReach: number;
  expeditionRuns: number;
  bestExpedition: number;
  racesWon: number;
  evolutions: number;
  rebirths: number;
  hatched: number;
  /** R0448: the first rename, and whether the player chose "I know how to play". */
  firstNameMs?: number | null;
  /** R0448: the first gentle toss (the loop's last, optional step). */
  firstTossMs?: number | null;
  /** The current visit's length so far, in minutes. */
  sessionMin?: number;
  loopSkipped?: boolean;
}

/** The longest a panel name may be, and how many distinct panels one diary keeps. */
const PANEL_NAME_MAX = 32;
const PANEL_KEEP = 40;

export function newDiary(): Diary {
  return {
    sessions: 0,
    firstHatchMs: null,
    firstPetMs: null,
    firstFeedMs: null,
    minutesPlayed: 0,
    longestSessionMin: 0,
    panelsOpened: {},
    scenesSkipped: 0,
    cantReach: 0,
    expeditionRuns: 0,
    bestExpedition: 0,
    racesWon: 0,
    evolutions: 0,
    rebirths: 0,
    hatched: 0,
    firstNameMs: null,
    firstTossMs: null,
    sessionMin: 0,
  };
}

/**
 * The first egg of a save hatches in five shakes (R0448); every later shake is the usual bonus.
 * An old save with Nubbins already out is not a first egg.
 */
export function shakeBonusMs(world: World): number {
  const first = (world.diary?.hatched ?? 0) === 0 && world.nubbins.every((n) => n.stage === 'egg');
  return first ? FIRST_LOOP.firstShakeBonusMs : EGG.shakeBonusMs;
}

/** A load or a return from another tab: a new session starts. */
export function diarySession(world: World): void {
  const d = (world.diary ??= newDiary());
  d.sessions += 1;
  d.sessionMin = 0;
}

/** A panel was opened (the UI sends it as a command). */
export function diaryPanel(world: World, name: string): void {
  const d = (world.diary ??= newDiary());
  const key = String(name).slice(0, PANEL_NAME_MAX);
  if (!(key in d.panelsOpened) && Object.keys(d.panelsOpened).length >= PANEL_KEEP) return;
  d.panelsOpened[key] = (d.panelsOpened[key] ?? 0) + 1;
}

/** The diary's tick: live steps only (catch-up time away is not play). */
export function stepGroveDiary(world: World, dtMs: number, events: readonly SimEvent[]): void {
  const d = (world.diary ??= newDiary());
  const before = d.minutesPlayed;
  d.minutesPlayed = before + dtMs / 60_000;
  // The sim never sees the wall clock: a visit's length is counted here, in the save.
  d.sessionMin = (d.sessionMin ?? 0) + dtMs / 60_000;
  d.longestSessionMin = Math.max(d.longestSessionMin, d.sessionMin);
  for (const e of events) {
    switch (e.kind) {
      case 'hatched':
        d.hatched += 1;
        d.firstHatchMs ??= world.timeMs;
        break;
      case 'petted':
        d.firstPetMs ??= world.timeMs;
        break;
      case 'ate':
        d.firstFeedMs ??= world.timeMs;
        break;
      case 'thrown':
        d.firstTossMs ??= world.timeMs;
        break;
      case 'rewards':
        d.expeditionRuns += 1;
        d.bestExpedition = Math.max(d.bestExpedition, e.rewards.shells);
        break;
      case 'raceWon':
        d.racesWon += 1;
        break;
      case 'evolved':
        d.evolutions += 1;
        break;
      case 'reborn':
        d.rebirths += 1;
        break;
      case 'cantReach':
        d.cantReach += 1;
        break;
      default:
        break;
    }
  }
}

/** Clean a diary read from a file: numbers stay numbers, unknown keys drop. */
export function cleanDiary(raw: unknown): Diary {
  const base = newDiary();
  if (typeof raw !== 'object' || raw === null) return base;
  const r = raw as Record<string, unknown>;
  const num = (k: keyof Diary): number => {
    const v = r[k];
    return typeof v === 'number' && Number.isFinite(v) && v >= 0 ? v : (base[k] as number);
  };
  const time = (
    k: 'firstHatchMs' | 'firstPetMs' | 'firstFeedMs' | 'firstNameMs' | 'firstTossMs',
  ): number | null => {
    const v = r[k];
    return typeof v === 'number' && Number.isFinite(v) && v >= 0 ? v : null;
  };
  const panels: Record<string, number> = {};
  const p = r['panelsOpened'];
  if (typeof p === 'object' && p !== null)
    for (const [k, v] of Object.entries(p as Record<string, unknown>).slice(0, PANEL_KEEP))
      if (typeof v === 'number' && Number.isFinite(v) && v >= 0)
        panels[k.slice(0, PANEL_NAME_MAX)] = v;
  return {
    sessions: num('sessions'),
    firstHatchMs: time('firstHatchMs'),
    firstPetMs: time('firstPetMs'),
    firstFeedMs: time('firstFeedMs'),
    minutesPlayed: num('minutesPlayed'),
    longestSessionMin: num('longestSessionMin'),
    panelsOpened: panels,
    scenesSkipped: num('scenesSkipped'),
    cantReach: num('cantReach'),
    expeditionRuns: num('expeditionRuns'),
    bestExpedition: num('bestExpedition'),
    racesWon: num('racesWon'),
    evolutions: num('evolutions'),
    rebirths: num('rebirths'),
    hatched: num('hatched'),
    firstNameMs: time('firstNameMs'),
    firstTossMs: time('firstTossMs'),
    sessionMin: num('sessionMin'),
    ...(r['loopSkipped'] === true ? { loopSkipped: true } : {}),
  };
}
