/**
 * Lane C round 11 (R0598, CAMP-05), stage B: every legacy save on this device copied into
 * one profile's unified slots, once, losing nothing.
 *
 * 1. Every legacy key (the 7 modes' slots, their unreadable copies, the side saves) is copied
 *    raw into IndexedDB's `archive` store first. If any archive write fails, nothing else runs.
 * 2. Profile `p1` gets 8 slots: Hazel's Grove slots first, in slot order, then the separate
 *    campaigns and the Free Grove by last save time, newest first. A separate campaign is
 *    turned into the unified shape (sim/save-unify.ts). What does not fit is "older saves",
 *    still in the archive and still in its legacy key.
 * 3. The Learning Grove's slots become child profile `k1`, slots 1–3.
 * 4. Side saves `grove.side.<world>` become `grove.side.<world>.p1` (never over a newer one).
 * 5. A marker `grove.migrated.v6` says it ran. The legacy keys are never removed here: that
 *    may happen only after a unified slot has loaded `SAVE_LAYOUT.legacyKeepLoads` times and
 *    the archive holds every key (`legacyRemovable`), and no code removes them yet.
 *
 * The plan is pure and tested; the device run is behind `SAVE_LAYOUT.unifiedSlots` (off),
 * because the game still plays the legacy keys. Turning the flag on is the title's job,
 * together with the "Your saves moved" card.
 */
import { SAVE_LAYOUT } from '../config/tuning-camp11-save';
import { deserialize, serialize } from '../sim/save';
import { unifyWorld } from '../sim/save-unify';
import { kv } from './idb';
import {
  legacySideKey,
  profileSideKey,
  SIDE_SAVES,
  slotKey,
  STORYLINE_MODES,
  type SaveMode,
} from './storage';

export const MIGRATED_KEY = 'grove.migrated.v6';
const LOADS_KEY = 'grove.migrated.loads';

/** The unified slot key of a profile. */
export function unifiedKey(profile: string, index: number): string {
  return `grove.${profile}.slot.${index}`;
}

/** One legacy save as found. */
export interface LegacySave {
  mode: SaveMode;
  index: number;
  key: string;
  json: string;
}

export interface UnifiedPlan {
  /** p1's slots 1–8: the legacy key each comes from and the JSON it gets, or null. */
  p1: Array<{ from: string; json: string } | null>;
  k1: Array<{ from: string; json: string } | null>;
  /** Saves with no slot left, newest first (kept in the archive and in their own keys). */
  older: string[];
  /** Saves that would not load: archived, and left where they are. */
  unreadable: string[];
}

function savedAt(json: string): number {
  try {
    const d = JSON.parse(json) as { savedAtWallMs?: unknown };
    return typeof d.savedAtWallMs === 'number' ? d.savedAtWallMs : 0;
  } catch {
    return 0;
  }
}

/** Pure: a save's JSON in unified shape, same version and save time; null if unreadable. */
export function unifiedJson(json: string): string | null {
  try {
    const save = deserialize(json);
    return serialize(unifyWorld(save.world), save.savedAtWallMs);
  } catch {
    return null;
  }
}

/** Pure: which save goes in which unified slot. */
export function planUnified(saves: readonly LegacySave[]): UnifiedPlan {
  const p1Slots = SAVE_LAYOUT.slotsPerProfile;
  const plan: UnifiedPlan = {
    p1: Array.from({ length: p1Slots }, () => null),
    k1: Array.from({ length: SAVE_LAYOUT.slotsPerMode }, () => null),
    older: [],
    unreadable: [],
  };
  const ready = saves
    .map((s) => ({ s, json: unifiedJson(s.json) }))
    .filter(({ s, json }) => {
      if (json === null) plan.unreadable.push(s.key);
      return json !== null;
    }) as Array<{ s: LegacySave; json: string }>;
  const hazel = ready.filter((r) => r.s.mode === 'campaign').sort((a, b) => a.s.index - b.s.index);
  const others = ready
    .filter((r) => r.s.mode === 'free' || (STORYLINE_MODES as readonly string[]).includes(r.s.mode))
    .sort((a, b) => savedAt(b.s.json) - savedAt(a.s.json) || a.s.key.localeCompare(b.s.key));
  let next = 0;
  for (const r of [...hazel, ...others]) {
    if (next < p1Slots) plan.p1[next++] = { from: r.s.key, json: r.json };
    else plan.older.push(r.s.key);
  }
  for (const r of ready.filter((x) => x.s.mode === 'edu').sort((a, b) => a.s.index - b.s.index))
    plan.k1[r.s.index - 1] = { from: r.s.key, json: r.json };
  return plan;
}

/** Pure: stage B step 8, may the legacy keys go. */
export function legacyRemovable(loads: number, archivedAll: boolean): boolean {
  return archivedAll && loads >= SAVE_LAYOUT.legacyKeepLoads;
}

const LEGACY_MODES: SaveMode[] = ['campaign', 'free', 'edu', ...STORYLINE_MODES];

/** Every legacy key with something in it: the 21 slot keys, their unreadable copies, side saves. */
export function legacyEntries(): Array<{ key: string; json: string }> {
  const keys: string[] = [];
  for (const mode of LEGACY_MODES)
    for (let index = 1; index <= SAVE_LAYOUT.slotsPerMode; index++) {
      const k = slotKey({ mode, index });
      keys.push(k);
      for (let n = 1; n <= 3; n++) keys.push(`${k}.unreadable.${n}`);
    }
  for (const w of SIDE_SAVES) keys.push(legacySideKey(w));
  const out: Array<{ key: string; json: string }> = [];
  for (const key of keys) {
    try {
      const json = localStorage.getItem(key);
      if (json !== null) out.push({ key, json });
    } catch {
      // Blocked: nothing to move.
    }
  }
  return out;
}

export type MigrateResult = 'off' | 'done-before' | 'archive-failed' | 'blocked' | 'migrated';

/** The device run (stage B). `force` is for tests and the debug panel; the flag gates it. */
export async function migrateToUnified(nowWallMs: number, force = false): Promise<MigrateResult> {
  if (!force && !SAVE_LAYOUT.unifiedSlots) return 'off';
  try {
    if (localStorage.getItem(MIGRATED_KEY) !== null) return 'done-before';
  } catch {
    return 'blocked';
  }
  const entries = legacyEntries();
  // 1. The archive before anything else; one failure stops the whole run.
  for (const { key, json } of entries) {
    const ok = await kv()
      .put('archive', key, JSON.stringify({ key, json, atWallMs: nowWallMs }))
      .catch(() => false);
    if (!ok) return 'archive-failed';
  }
  const saves: LegacySave[] = [];
  for (const mode of LEGACY_MODES)
    for (let index = 1; index <= SAVE_LAYOUT.slotsPerMode; index++) {
      const key = slotKey({ mode, index });
      const hit = entries.find((e) => e.key === key);
      if (hit) saves.push({ mode, index, key, json: hit.json });
    }
  const plan = planUnified(saves);
  try {
    plan.p1.forEach((s, i) => s && localStorage.setItem(unifiedKey('p1', i + 1), s.json));
    plan.k1.forEach((s, i) => s && localStorage.setItem(unifiedKey('k1', i + 1), s.json));
    for (const w of SIDE_SAVES) {
      const old = localStorage.getItem(legacySideKey(w));
      const to = profileSideKey(w, 'p1');
      if (old !== null && localStorage.getItem(to) === null) localStorage.setItem(to, old);
    }
    localStorage.setItem(
      MIGRATED_KEY,
      JSON.stringify({
        atWallMs: nowWallMs,
        archived: entries.length,
        p1: plan.p1.map((s) => s?.from ?? null),
        k1: plan.k1.map((s) => s?.from ?? null),
        older: plan.older,
      }),
    );
  } catch {
    // Out of room or blocked mid-way: the legacy keys and the archive still hold everything.
    return 'blocked';
  }
  return 'migrated';
}

/** A unified slot loaded once more (step 8 counts these). */
export function noteUnifiedLoad(): number {
  try {
    const n = (Number(localStorage.getItem(LOADS_KEY)) || 0) + 1;
    localStorage.setItem(LOADS_KEY, String(n));
    return n;
  } catch {
    return 0;
  }
}
