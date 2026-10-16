/**
 * The side saves: the Atlas, Pixel's Arcade and the Multiverse (canon 21, 29 and 30).
 * Each is one save of its own, apart from the Grove. Inside it every page, cartridge or
 * line keeps its own progress, so they can be played in any order.
 *
 * Pure data and parsing: the platform layer reads and writes the JSON. Nothing here
 * touches a Grove save, and the Grove only ever reads these through `cross-saves.ts`.
 */
import type { AlignmentBand } from './types';

export type FlagValue = number | boolean | string;

/** One quest's place inside its line. */
export interface QuestProgress {
  step: number;
  /**
   * scene: the step's scene is next; act: waiting for the Keeper to do the step;
   * done: the step's done scene is next; complete: the quest's complete scene is next;
   * finished: nothing left.
   */
  stage: 'scene' | 'act' | 'done' | 'complete' | 'finished';
}

/** One Atlas page, Arcade cartridge or Multiverse line. */
export interface LineProgress {
  quests: Record<string, QuestProgress>;
  /** Flags set by this line's scenes and choices. They never leave the side save. */
  flags: Record<string, FlagValue>;
  done: boolean;
}

export interface AtlasSave {
  version: number;
  /** By page id, 'A1'..'A31'. */
  pages: Record<string, LineProgress>;
}

export interface ArcadeSave {
  version: number;
  /** By cartridge id, 'PA1'..'PA5'. */
  carts: Record<string, LineProgress>;
}

/** The Multiverse's copy of a Grove Eternal (canon 21): it lives only in this save. */
export interface Reflection {
  /** The Grove Nubbin it reflects; only for display, never used to reach that save. */
  of: string;
  name: string;
  species: string;
  eggColor: string;
  shiny: boolean;
  tone: string | null;
  form: string | null;
  hat: string | null;
  eternal: AlignmentBand;
  ageMs: number;
}

export interface MultiverseSave {
  version: number;
  reflection: Reflection | null;
  /** E6's `eternal` ending gave the reflection up; it is not made again. */
  reflectionLost: boolean;
  lines: Record<string, LineProgress>;
}

export const SIDE_SAVE_VERSION = 1;

export function freshLine(): LineProgress {
  return { quests: {}, flags: {}, done: false };
}

export function freshAtlas(): AtlasSave {
  return { version: SIDE_SAVE_VERSION, pages: {} };
}

export function freshArcade(): ArcadeSave {
  return { version: SIDE_SAVE_VERSION, carts: {} };
}

export function freshMultiverse(): MultiverseSave {
  return { version: SIDE_SAVE_VERSION, reflection: null, reflectionLost: false, lines: {} };
}

/**
 * One migration per version bump, as for the Grove save: index n-1 upgrades a version-n
 * save to n+1. Version 1 is the first, so the list is empty; it is here so the next bump
 * has a place to go.
 */
const MIGRATIONS: Array<(data: Record<string, unknown>) => void> = [];

function migrate(data: Record<string, unknown>): boolean {
  let v = typeof data.version === 'number' ? data.version : 1;
  if (v > SIDE_SAVE_VERSION) return false;
  while (v < SIDE_SAVE_VERSION) {
    MIGRATIONS[v - 1]?.(data);
    v += 1;
  }
  data.version = SIDE_SAVE_VERSION;
  return true;
}

function parseObject(json: string | null): Record<string, unknown> | null {
  if (json === null) return null;
  try {
    const data = JSON.parse(json) as unknown;
    if (!data || typeof data !== 'object' || Array.isArray(data)) return null;
    const obj = data as Record<string, unknown>;
    return migrate(obj) ? obj : null;
  } catch {
    return null;
  }
}

function lines(value: unknown): Record<string, LineProgress> {
  const out: Record<string, LineProgress> = {};
  if (!value || typeof value !== 'object') return out;
  for (const [id, raw] of Object.entries(value as Record<string, unknown>)) {
    const l = raw as Partial<LineProgress> | null;
    if (!l || typeof l !== 'object') continue;
    out[id] = {
      quests: l.quests && typeof l.quests === 'object' ? { ...l.quests } : {},
      flags: l.flags && typeof l.flags === 'object' ? { ...l.flags } : {},
      done: l.done === true,
    };
  }
  return out;
}

/** A missing, broken or too-new save reads as a fresh one. */
export function parseAtlas(json: string | null): AtlasSave {
  const d = parseObject(json);
  return d ? { version: SIDE_SAVE_VERSION, pages: lines(d.pages) } : freshAtlas();
}

export function parseArcade(json: string | null): ArcadeSave {
  const d = parseObject(json);
  return d ? { version: SIDE_SAVE_VERSION, carts: lines(d.carts) } : freshArcade();
}

export function parseMultiverse(json: string | null): MultiverseSave {
  const d = parseObject(json);
  if (!d) return freshMultiverse();
  const r = d.reflection as Reflection | null | undefined;
  return {
    version: SIDE_SAVE_VERSION,
    reflection: r && typeof r === 'object' && typeof r.name === 'string' ? { ...r } : null,
    reflectionLost: d.reflectionLost === true,
    lines: lines(d.lines),
  };
}

export function serializeSide(save: AtlasSave | ArcadeSave | MultiverseSave): string {
  return JSON.stringify(save);
}
