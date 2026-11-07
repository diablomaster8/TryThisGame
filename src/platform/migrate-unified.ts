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
 * 5. A marker `grove.migrated.v6` says it ran.
 *
 * Round 12: the game plays the unified slots (platform/unified-keys.ts maps each slot to its
 * new key). A copy keeps the save exactly as it was, byte for byte, so a separate campaign
 * still plays as one; its unified shape (`unifiedJson`) is for Combine endings until the spine
 * can play lines itself. At every boot (`bootUnified`): a legacy key written after the move
 * (an old tab) is copied over again, and step 8 removes a legacy slot key only once its
 * unified slot has loaded `SAVE_LAYOUT.legacyKeepLoads` times, holds a save at least as new,
 * and the archive holds that legacy text. Unreadable copies, older saves and side saves are
 * never removed. Without the archive nothing moves and nothing goes.
 */
import { SAVE_LAYOUT } from '../config/tuning-more/story-save-layout';
import { deserialize, serialize } from '../sim/save';
import { unifyWorld } from '../sim/save-unify';
import { kv } from './idb';
import { parseStub } from './live-store';
import {
  legacySideKey,
  legacySlotKey,
  profileSideKey,
  readKeyJson,
  SIDE_SAVES,
  STORYLINE_MODES,
  writeKeyJson,
  type SaveMode,
} from './storage';
import {
  activateUnified,
  deactivateUnified,
  MIGRATED_KEY,
  mappedPairs,
  readLoads,
  unifiedActive,
  unifiedFlagOn,
  unifiedKey,
} from './unified-keys';

export { MIGRATED_KEY, unifiedKey, noteUnifiedLoad } from './unified-keys';

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

/** Pure: a save that loads, as it is (the copy the game plays); null if unreadable. */
function playableJson(json: string): string | null {
  try {
    deserialize(json);
    return json;
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
    .map((s) => ({ s, json: playableJson(s.json) }))
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
      const k = legacySlotKey({ mode, index });
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
  if (!force && !unifiedFlagOn()) return 'off';
  try {
    if (localStorage.getItem(MIGRATED_KEY) !== null) return 'done-before';
  } catch {
    return 'blocked';
  }
  const entries = legacyEntries();
  // A big save's localStorage value is only a pointer (R0668): archive and copy the save.
  for (const e of entries) {
    const stub = parseStub(e.json);
    if (!stub) continue;
    const full = await kv()
      .get('live', stub.idb)
      .catch(() => null);
    if (full === null) return 'archive-failed';
    e.json = full;
  }
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
      const key = legacySlotKey({ mode, index });
      const hit = entries.find((e) => e.key === key);
      if (hit) saves.push({ mode, index, key, json: hit.json });
    }
  const plan = planUnified(saves);
  try {
    for (const [profile, slots] of [
      ['p1', plan.p1],
      ['k1', plan.k1],
    ] as const)
      slots.forEach((s, i) => {
        if (!s) return;
        const to = unifiedKey(profile, i + 1);
        if (!writeKeyJson(to, s.json)) throw new Error('no room');
        copyHop(s.from, to);
      });
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
        archiveOk: true,
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

/** A slot's small companion keys (the hop course record) follow it, never over a newer one. */
function copyHop(from: string, to: string): void {
  try {
    const hop = localStorage.getItem(`${from}.hop`);
    if (hop !== null && localStorage.getItem(`${to}.hop`) === null)
      localStorage.setItem(`${to}.hop`, hop);
  } catch {
    // Only a best time: nothing to lose that matters.
  }
}

/** At boot, before any slot is read: map the slots if the move has run and the flag is on. */
export function activateIfMoved(): boolean {
  return activateUnified();
}

/**
 * Pure: should the legacy copy replace the unified one. Only when both load and the legacy
 * one is newer (an old tab kept playing it). An erased unified slot is never brought back.
 */
export function legacyNewer(legacy: string | null, unified: string | null): boolean {
  if (legacy === null || unified === null || legacy === unified) return false;
  if (playableJson(legacy) === null || playableJson(unified) === null) return false;
  return savedAt(legacy) > savedAt(unified);
}

/** Copy legacy saves written since the move over their unified slots. Answers how many. */
export function syncLegacy(): number {
  if (!unifiedActive()) return 0;
  let n = 0;
  for (const profile of ['p1', 'k1'])
    for (const { raw, key } of mappedPairs(profile)) {
      const legacy = readKeyJson(raw);
      if (legacyNewer(legacy, readKeyJson(key)) && writeKeyJson(key, legacy!)) n += 1;
      copyHop(raw, key);
    }
  return n;
}

/**
 * Stage B step 8: remove the legacy slot keys whose unified slot has loaded often enough.
 * Each one needs: the move's archive done, `legacyKeepLoads` loads of its unified slot, a
 * unified save that loads and is at least as new, and the legacy text in the archive (put
 * there again under a dated id if it changed since the move). Answers the keys removed.
 */
export async function retireLegacy(): Promise<string[]> {
  if (!unifiedActive()) return [];
  let marker: { archiveOk?: unknown; archived?: unknown; retired?: unknown } | null;
  try {
    marker = JSON.parse(localStorage.getItem(MIGRATED_KEY) ?? 'null') as typeof marker;
  } catch {
    return [];
  }
  // An r11 marker has no `archiveOk`, but it was written only after every archive write.
  if (!marker || marker.archiveOk === false || typeof marker.archived !== 'number') return [];
  const loads = readLoads();
  const out: string[] = [];
  for (const profile of ['p1', 'k1'])
    for (const { raw, key } of mappedPairs(profile)) {
      if (!legacyRemovable(loads[key] ?? 0, true)) continue;
      let legacy: string | null;
      try {
        legacy = localStorage.getItem(raw);
      } catch {
        return out;
      }
      if (legacy === null) continue;
      const text = readKeyJson(raw) ?? legacy;
      const unified = readKeyJson(key);
      if (unified === null || playableJson(unified) === null) continue;
      if (savedAt(unified) < savedAt(text)) continue;
      const kept = await kv()
        .get('archive', raw)
        .catch(() => null);
      let archived: boolean;
      try {
        archived = kept !== null && (JSON.parse(kept) as { json?: unknown }).json === text;
      } catch {
        archived = false;
      }
      if (!archived) {
        const id = `${raw}#${savedAt(text)}`;
        archived = await kv()
          .put('archive', id, JSON.stringify({ key: raw, json: text, atWallMs: Date.now() }))
          .catch(() => false);
      }
      if (!archived) continue;
      try {
        localStorage.removeItem(raw);
        out.push(raw);
      } catch {
        return out;
      }
    }
  if (out.length > 0)
    try {
      const m = JSON.parse(localStorage.getItem(MIGRATED_KEY) ?? '{}') as { retired?: string[] };
      m.retired = [...(Array.isArray(m.retired) ? m.retired : []), ...out];
      localStorage.setItem(MIGRATED_KEY, JSON.stringify(m));
    } catch {
      // The record is only for support; the archive holds the text.
    }
  return out;
}

/**
 * The boot run, after the mirror is restored: the move (once), then the catch-up copy and
 * step 8. Answers true when the move ran now (the caller reloads big saves and the index).
 */
export async function bootUnified(nowWallMs: number): Promise<boolean> {
  if (!unifiedFlagOn()) {
    deactivateUnified();
    return false;
  }
  let movedNow = false;
  if (!unifiedActive()) {
    movedNow = (await migrateToUnified(nowWallMs)) === 'migrated';
    if (!activateUnified()) return false;
  }
  syncLegacy();
  await retireLegacy();
  return movedNow;
}
