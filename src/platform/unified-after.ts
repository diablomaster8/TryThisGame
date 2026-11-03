/**
 * Lane C round 11, helper "profiles" (R0598 stage B, steps 4 and 7): what the title does after
 * the one-time move into unified slots (platform/migrate-unified.ts). It reads the move's
 * marker, says once that the saves moved, lists the saves that did not fit ("Older saves")
 * and swaps one into an empty unified slot, and runs "Combine endings": a finished separate
 * campaign's ending and keepsakes copied into a Hazel's Grove slot (sim/save-unify.ts), the
 * roster never merged. Nothing here deletes a legacy key or an archive copy.
 */
import { SAVE_LAYOUT } from '../config/tuning-camp11-save';
import { deserialize, serialize } from '../sim/save';
import { combineEndings, shapeOf } from '../sim/save-unify';
import { MIGRATED_KEY, unifiedJson, unifiedKey } from './migrate-unified';
import { summarize, type SaveSummary } from './storage';

const SEEN_KEY = 'grove.migrated.seen';

export interface MovedMarker {
  atWallMs: number;
  archived: number;
  p1: Array<string | null>;
  k1: Array<string | null>;
  older: string[];
}

/** Pure: the marker from its JSON, or null. */
export function parseMarker(json: string | null): MovedMarker | null {
  if (!json) return null;
  try {
    const m = JSON.parse(json) as Partial<MovedMarker>;
    if (typeof m.atWallMs !== 'number' || !Array.isArray(m.p1)) return null;
    return {
      atWallMs: m.atWallMs,
      archived: typeof m.archived === 'number' ? m.archived : 0,
      p1: m.p1,
      k1: Array.isArray(m.k1) ? m.k1 : [],
      older: Array.isArray(m.older) ? m.older.filter((k) => typeof k === 'string') : [],
    };
  } catch {
    return null;
  }
}

function get(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function set(key: string, json: string): boolean {
  try {
    localStorage.setItem(key, json);
    return true;
  } catch {
    return false;
  }
}

export function readMoved(): MovedMarker | null {
  return parseMarker(get(MIGRATED_KEY));
}

/** Show "Your saves moved"? Once, after a move that put at least one save somewhere. */
export function movedCardDue(): MovedMarker | null {
  const m = readMoved();
  if (!m || get(SEEN_KEY) !== null) return null;
  return m.p1.some(Boolean) || m.k1.some(Boolean) || m.older.length > 0 ? m : null;
}

export function markMovedSeen(): void {
  set(SEEN_KEY, '1');
}

/** p1's unified slots: index and summary, null when empty. */
export function unifiedSlots(): Array<{ index: number; summary: SaveSummary | null } | null> {
  return Array.from({ length: SAVE_LAYOUT.slotsPerProfile }, (_, i) => {
    const json = get(unifiedKey('p1', i + 1));
    return json === null ? null : { index: i + 1, summary: summarize(json) };
  });
}

/** Older saves still in their legacy keys, with what the title says about them. */
export function olderSaves(): Array<{ key: string; summary: SaveSummary | null }> {
  const m = readMoved();
  if (!m) return [];
  return m.older
    .map((key) => ({ key, json: get(key) }))
    .filter((x): x is { key: string; json: string } => x.json !== null)
    .map(({ key, json }) => ({ key, summary: summarize(json) }));
}

/** Put an older save into p1's empty slot `index` (unified shape). The legacy key stays. */
export function swapOlder(key: string, index: number): boolean {
  const to = unifiedKey('p1', index);
  if (get(to) !== null) return false;
  const raw = get(key);
  const json = raw ? unifiedJson(raw) : null;
  if (!json || !set(to, json)) return false;
  const m = readMoved();
  if (m) {
    m.older = m.older.filter((k) => k !== key);
    m.p1[index - 1] = key;
    set(MIGRATED_KEY, JSON.stringify(m));
  }
  return true;
}

/** Finished separate campaigns that "Combine endings" can copy from (their legacy keys). */
export function endingSources(): string[] {
  const m = readMoved();
  if (!m) return [];
  const keys = [...m.p1, ...m.older].filter((k): k is string => !!k);
  return keys.filter((k) => {
    const json = get(k);
    if (!json) return false;
    try {
      const w = deserialize(json).world;
      return shapeOf(w) === 'line' && w.campaign?.ending !== null;
    } catch {
      return false;
    }
  });
}

/** p1 slots that hold Hazel's Grove, the targets of Combine endings. */
export function hazelTargets(): number[] {
  const out: number[] = [];
  for (let i = 1; i <= SAVE_LAYOUT.slotsPerProfile; i++) {
    const json = get(unifiedKey('p1', i));
    if (!json) continue;
    try {
      const w = deserialize(json).world;
      if (shapeOf(w) === 'hazel' && w.campaign && w.campaign.chapter > 0) out.push(i);
    } catch {
      // Unreadable: not a target.
    }
  }
  return out;
}

/** Combine endings from the legacy save `fromKey` into p1 slot `index`. */
export function combineInto(fromKey: string, index: number): boolean {
  const to = unifiedKey('p1', index);
  const target = get(to);
  const source = get(fromKey);
  if (!target || !source) return false;
  try {
    const hazel = deserialize(target);
    const other = deserialize(source).world;
    return set(to, serialize(combineEndings(hazel.world, other), hazel.savedAtWallMs));
  } catch {
    return false;
  }
}
