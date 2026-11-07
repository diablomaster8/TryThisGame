/**
 * Lane C round 12 (R0598 CAMP-05, R0653 CAMP-61): which localStorage key a slot really uses
 * once the unified slots are on. The title and the game still name a slot by mode and index
 * (`grove.save.hundred`, say: its "raw" key). After the one-time move each profile owns 8
 * unified slots, `grove.<profile>.slot.N`, and a small map says which raw key each one holds:
 * the move's marker for `p1` and `k1`, `grove.<profile>.slots` for every other profile.
 *
 * - A mapped raw key reads and writes its unified slot.
 * - An unmapped one, on its first write, takes the profile's first free unified slot (and
 *   the map says so from then on). With none free, `p1` and `k1` fall back to the raw legacy
 *   key (the old behaviour, still there) and any other profile to `grove.<profile>.extra.*`,
 *   so a write is never refused for want of a slot.
 * - Before the move, with the flag off, or with `grove.unified.off` set (the kill switch),
 *   nothing is mapped: every slot is its raw key, exactly as before.
 *
 * This module imports nothing from storage.ts, so storage can use it without a cycle.
 */
import { SAVE_LAYOUT } from '../config/tuning-more/story-save-layout';

export const MIGRATED_KEY = 'grove.migrated.v6';
/** Set by hand (or a support note) to go back to the legacy keys; nothing is deleted either way. */
export const UNIFIED_OFF_KEY = 'grove.unified.off';
export const FIXED_MAPPED = ['p1', 'k1'] as const;

/** The unified slot key of a profile. */
export function unifiedKey(profile: string, index: number): string {
  return `grove.${profile}.slot.${index}`;
}

/** Where a profile other than p1/k1 keeps a save that found no free slot. */
export function overflowKey(profile: string, raw: string): string {
  return `grove.${profile}.extra.${raw.replace(/^grove\./, '')}`;
}

export function mapKeyOf(profile: string): string {
  return `grove.${profile}.slots`;
}

let active = false;
let forced: boolean | null = null;

/** Tests: force the flag (null goes back to tuning). */
export function setUnifiedOn(on: boolean | null): void {
  forced = on;
}

export function unifiedFlagOn(): boolean {
  if (forced !== null) return forced;
  if (!SAVE_LAYOUT.unifiedSlots) return false;
  try {
    return localStorage.getItem(UNIFIED_OFF_KEY) === null;
  } catch {
    return false;
  }
}

/** Are slot keys mapped in this page. */
export function unifiedActive(): boolean {
  return active;
}

/** Map slot keys from now on, if the flag is on and the move has run. Answers whether it did. */
export function activateUnified(): boolean {
  try {
    active = unifiedFlagOn() && localStorage.getItem(MIGRATED_KEY) !== null;
  } catch {
    active = false;
  }
  return active;
}

/** Tests and the kill switch: back to raw keys in this page. */
export function deactivateUnified(): void {
  active = false;
}

interface Marker {
  p1: Array<string | null>;
  k1: Array<string | null>;
  older?: string[];
  [k: string]: unknown;
}

function readMarker(): Marker | null {
  try {
    const m = JSON.parse(localStorage.getItem(MIGRATED_KEY) ?? 'null') as Marker | null;
    return m && Array.isArray(m.p1) ? m : null;
  } catch {
    return null;
  }
}

function sized(a: unknown): Array<string | null> {
  const arr = Array.isArray(a) ? a : [];
  return Array.from({ length: SAVE_LAYOUT.slotsPerProfile }, (_, i) =>
    typeof arr[i] === 'string' ? (arr[i] as string) : null,
  );
}

/** A profile's map: entry i is the raw key unified slot i+1 holds, or null. */
export function mapOf(profile: string): Array<string | null> {
  if (profile === 'p1' || profile === 'k1') return sized(readMarker()?.[profile]);
  try {
    return sized(JSON.parse(localStorage.getItem(mapKeyOf(profile)) ?? '[]'));
  } catch {
    return sized([]);
  }
}

function storeMap(profile: string, map: Array<string | null>, dropOlder?: string): boolean {
  try {
    if (profile === 'p1' || profile === 'k1') {
      const m = readMarker();
      if (!m) return false;
      m[profile] = map;
      if (dropOlder && Array.isArray(m.older)) m.older = m.older.filter((k) => k !== dropOlder);
      localStorage.setItem(MIGRATED_KEY, JSON.stringify(m));
    } else localStorage.setItem(mapKeyOf(profile), JSON.stringify(map));
    return true;
  } catch {
    return false;
  }
}

function exists(key: string): boolean {
  try {
    return localStorage.getItem(key) !== null;
  } catch {
    return true;
  }
}

/** The key a slot reads: its unified slot, or (unmapped) where it has always been. */
export function readKey(profile: string, raw: string): string {
  if (!active) return raw;
  const i = mapOf(profile).indexOf(raw);
  if (i >= 0) return unifiedKey(profile, i + 1);
  return profile === 'p1' || profile === 'k1' ? raw : overflowKey(profile, raw);
}

/** The key a slot writes: as `readKey`, but an unmapped slot first claims a free unified slot. */
export function writeKey(profile: string, raw: string): string {
  if (!active) return raw;
  const map = mapOf(profile);
  const i = map.indexOf(raw);
  if (i >= 0) return unifiedKey(profile, i + 1);
  const fixedProfile = profile === 'p1' || profile === 'k1';
  const fallback = fixedProfile ? raw : overflowKey(profile, raw);
  // A save already in the fallback key stays there: claiming a slot would hide it.
  if (!fixedProfile && exists(fallback)) return fallback;
  const free = map.findIndex((k, n) => k === null && !exists(unifiedKey(profile, n + 1)));
  if (free < 0) return fallback;
  map[free] = raw;
  return storeMap(profile, map, raw) ? unifiedKey(profile, free + 1) : fallback;
}

/** Every mapped pair of a profile, raw key → unified key. */
export function mappedPairs(profile: string): Array<{ raw: string; key: string }> {
  return mapOf(profile).flatMap((raw, i) =>
    raw ? [{ raw, key: unifiedKey(profile, i + 1) }] : [],
  );
}

const LOADS_KEY = 'grove.migrated.loads';

/** Pure: the per-slot load counts from their JSON (an old plain number counts for nobody). */
export function parseLoads(json: string | null): Record<string, number> {
  try {
    const d = JSON.parse(json ?? '{}') as unknown;
    if (!d || typeof d !== 'object' || Array.isArray(d)) return {};
    const out: Record<string, number> = {};
    for (const [k, v] of Object.entries(d)) if (typeof v === 'number') out[k] = v;
    return out;
  } catch {
    return {};
  }
}

export function readLoads(): Record<string, number> {
  try {
    return parseLoads(localStorage.getItem(LOADS_KEY));
  } catch {
    return {};
  }
}

/** Stage B step 8 counts these: unified slot `key` loaded into a game once more. */
export function noteUnifiedLoad(key: string): number {
  if (!active || !/^grove\.[pk]\d+\.slot\.\d+$/.test(key)) return 0;
  try {
    const loads = readLoads();
    loads[key] = (loads[key] ?? 0) + 1;
    localStorage.setItem(LOADS_KEY, JSON.stringify(loads));
    return loads[key];
  } catch {
    return 0;
  }
}
