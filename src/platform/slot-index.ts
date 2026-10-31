/**
 * R0622 (CAMP-30): the slot index, `grove.index.v1`, so the title reads one small key in
 * place of parsing every save. Each slot's entry holds the summary the title shows, the
 * save's stored size and its label (R0649). `storage.ts` keeps it current after every write,
 * copy and erase, and rebuilds it by scanning when it is missing or does not parse. The
 * functions here are pure apart from `loadIndex` / `storeIndex`, which are guarded.
 */
import type { SaveSummary } from './storage';

export const INDEX_KEY = 'grove.index.v1';

export interface SlotIndexEntry {
  summary: SaveSummary;
  /** The save's size in localStorage terms (two bytes a character). */
  bytes: number;
}

export interface SlotIndex {
  v: 1;
  /** By slot id, `mode:index`. A missing entry is an empty slot. */
  slots: Record<string, SlotIndexEntry>;
  /** The slot written last, or null. */
  lastPlayed: string | null;
}

export function emptyIndex(): SlotIndex {
  return { v: 1, slots: {}, lastPlayed: null };
}

/** Pure: the index from its JSON, or null when it is missing or not an index. */
export function parseIndex(json: string | null): SlotIndex | null {
  if (json === null) return null;
  try {
    const d = JSON.parse(json) as Partial<SlotIndex> | null;
    if (!d || d.v !== 1 || !d.slots || typeof d.slots !== 'object') return null;
    const slots: Record<string, SlotIndexEntry> = {};
    for (const [id, e] of Object.entries(d.slots)) {
      if (!e || typeof e !== 'object' || !e.summary || typeof e.summary !== 'object') return null;
      slots[id] = { summary: e.summary, bytes: typeof e.bytes === 'number' ? e.bytes : 0 };
    }
    return { v: 1, slots, lastPlayed: typeof d.lastPlayed === 'string' ? d.lastPlayed : null };
  } catch {
    return null;
  }
}

/** Pure: the index with `id` set to `entry` (or removed when null). */
export function withEntry(
  index: SlotIndex,
  id: string,
  entry: SlotIndexEntry | null,
  played = false,
): SlotIndex {
  const slots = { ...index.slots };
  if (entry) slots[id] = entry;
  else delete slots[id];
  const lastPlayed = played ? id : index.lastPlayed === id && !entry ? null : index.lastPlayed;
  return { v: 1, slots, lastPlayed };
}

export function loadIndexJson(): string | null {
  try {
    return localStorage.getItem(INDEX_KEY);
  } catch {
    return null;
  }
}

export function storeIndex(index: SlotIndex): boolean {
  try {
    localStorage.setItem(INDEX_KEY, JSON.stringify(index));
    return true;
  } catch {
    return false;
  }
}
