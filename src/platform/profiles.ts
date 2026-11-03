/**
 * Lane C round 11, helper "profiles" (R0628 CAMP-36, R0653 CAMP-61): who plays on this
 * device. A small registry in localStorage (`grove.profiles.v1`): Keeper profiles and child
 * profiles, each with a name and an avatar, at most `PROFILES.max`. `p1` (the Keeper) and
 * `k1` (the child, the Learning Grove's slots) always exist, because the legacy slot keys
 * are theirs; they can be renamed, never deleted. Other profiles hold unified slots
 * (`grove.<id>.slot.N`, R0598 stage B) and their own side saves.
 *
 * Deleting a profile copies its keys into IndexedDB's `archive` (`profile:<id>/<key>`) and
 * only then removes them; it is listed under Deleted profiles and can be restored for
 * `PROFILES.keepDeletedMs` of wall time, after which `purgeDeleted` drops the archive copy.
 * Every storage call is wrapped: blocked storage reads as the two fixed profiles.
 */
import { PROFILES } from '../config/tuning-camp11-profiles';
import { PROFILE_TEXT } from '../config/strings-camp11-profiles';
import { delPrefix, kv } from './idb';

export type ProfileKind = 'keeper' | 'child';

export interface Profile {
  id: string;
  kind: ProfileKind;
  name: string;
  /** An emoji, or `trainer:<id>` for a Keeper portrait. */
  avatar: string;
}

export interface DeletedProfile {
  profile: Profile;
  atWallMs: number;
  keys: string[];
}

interface Registry {
  profiles: Profile[];
  deleted: DeletedProfile[];
}

export const PROFILES_KEY = 'grove.profiles.v1';
const LAST_KEY = 'grove.profile.last';

/** The profiles that hold the legacy slots and always stay. */
export const FIXED_PROFILES: readonly string[] = ['p1', 'k1'];

function fixed(): Profile[] {
  return [
    { id: 'p1', kind: 'keeper', name: PROFILE_TEXT.keeperDefault, avatar: '🧑‍🌾' },
    { id: 'k1', kind: 'child', name: PROFILE_TEXT.childDefault, avatar: '🌱' },
  ];
}

// eslint-disable-next-line no-control-regex
const UNSAFE = /[\u0000-\u001f\u007f<>]/g;

/** A tidy profile name, or '' when nothing is left. */
export function cleanProfileName(raw: unknown): string {
  if (typeof raw !== 'string') return '';
  const plain = raw.replace(UNSAFE, '').replace(/\s+/g, ' ').trim();
  return [...plain].slice(0, PROFILES.nameMax).join('').trim();
}

function isProfile(p: unknown): p is Profile {
  const x = p as Partial<Profile> | null;
  return (
    !!x &&
    typeof x.id === 'string' &&
    /^[pk]\d+$/.test(x.id) &&
    (x.kind === 'keeper' || x.kind === 'child') &&
    typeof x.name === 'string' &&
    typeof x.avatar === 'string'
  );
}

/** Pure: a registry from its JSON, the fixed profiles always present and first. */
export function parseRegistry(json: string | null): Registry {
  const reg: Registry = { profiles: fixed(), deleted: [] };
  if (!json) return reg;
  try {
    const data = JSON.parse(json) as { profiles?: unknown; deleted?: unknown };
    for (const p of Array.isArray(data.profiles) ? data.profiles : []) {
      if (!isProfile(p)) continue;
      const name = cleanProfileName(p.name);
      const at = reg.profiles.findIndex((x) => x.id === p.id);
      const clean = { id: p.id, kind: p.kind, name: name || p.id, avatar: p.avatar };
      if (at >= 0) reg.profiles[at] = { ...clean, kind: reg.profiles[at]!.kind };
      else if (reg.profiles.length < PROFILES.max) reg.profiles.push(clean);
    }
    for (const d of Array.isArray(data.deleted) ? data.deleted : []) {
      const x = d as Partial<DeletedProfile>;
      if (isProfile(x.profile) && typeof x.atWallMs === 'number' && Array.isArray(x.keys))
        reg.deleted.push({
          profile: x.profile,
          atWallMs: x.atWallMs,
          keys: x.keys.filter((k): k is string => typeof k === 'string'),
        });
    }
  } catch {
    // A broken registry reads as the fixed two; the slots themselves are untouched.
  }
  return reg;
}

function read(): Registry {
  try {
    return parseRegistry(localStorage.getItem(PROFILES_KEY));
  } catch {
    return parseRegistry(null);
  }
}

function write(reg: Registry): boolean {
  try {
    localStorage.setItem(PROFILES_KEY, JSON.stringify(reg));
    return true;
  } catch {
    return false;
  }
}

export function listProfiles(): Profile[] {
  return read().profiles;
}

export function profileById(id: string): Profile | undefined {
  return read().profiles.find((p) => p.id === id);
}

/** A new profile, or null when the device is full, the name is empty or storage is blocked. */
export function addProfile(kind: ProfileKind, name: string, avatar: string): Profile | null {
  const reg = read();
  const clean = cleanProfileName(name);
  if (!clean || reg.profiles.length >= PROFILES.max) return null;
  const prefix = kind === 'child' ? 'k' : 'p';
  const taken = new Set([...reg.profiles, ...reg.deleted.map((d) => d.profile)].map((p) => p.id));
  let n = 1;
  while (taken.has(`${prefix}${n}`)) n++;
  const p: Profile = { id: `${prefix}${n}`, kind, name: clean, avatar };
  reg.profiles.push(p);
  return write(reg) ? p : null;
}

export function renameProfile(id: string, name: string): boolean {
  const reg = read();
  const p = reg.profiles.find((x) => x.id === id);
  const clean = cleanProfileName(name);
  if (!p || !clean) return false;
  p.name = clean;
  return write(reg);
}

/** The localStorage keys a profile owns (its unified slots and its side saves). */
export function profileKeys(id: string): string[] {
  const out: string[] = [];
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (
        k &&
        (k.startsWith(`grove.${id}.`) || (k.startsWith('grove.side.') && k.endsWith(`.${id}`)))
      )
        out.push(k);
    }
  } catch {
    // Blocked: nothing to list.
  }
  return out.sort();
}

const archiveId = (id: string, key: string): string => `profile:${id}/${key}`;

/**
 * Delete a profile: archive every key it owns, then (only if all were archived) remove them
 * and list it under Deleted profiles. The fixed profiles are refused.
 */
export async function deleteProfile(id: string, nowWallMs: number): Promise<boolean> {
  if (FIXED_PROFILES.includes(id)) return false;
  const reg = read();
  const p = reg.profiles.find((x) => x.id === id);
  if (!p) return false;
  const keys = profileKeys(id);
  for (const key of keys) {
    let json: string | null;
    try {
      json = localStorage.getItem(key);
    } catch {
      return false;
    }
    if (json === null) continue;
    const ok = await kv()
      .put('archive', archiveId(id, key), json)
      .catch(() => false);
    if (!ok) return false;
  }
  reg.profiles = reg.profiles.filter((x) => x.id !== id);
  reg.deleted.push({ profile: p, atWallMs: nowWallMs, keys });
  if (!write(reg)) return false;
  try {
    for (const key of keys) localStorage.removeItem(key);
  } catch {
    // The archive and the keys both still hold everything.
  }
  if (lastProfile() === id) markLastProfile('p1');
  return true;
}

/** Deleted profiles still inside the window, newest first. */
export function listDeleted(nowWallMs: number): DeletedProfile[] {
  return read()
    .deleted.filter((d) => nowWallMs - d.atWallMs < PROFILES.keepDeletedMs)
    .sort((a, b) => b.atWallMs - a.atWallMs);
}

/** Bring a deleted profile back with its saves, inside the window and with room. */
export async function restoreProfile(id: string, nowWallMs: number): Promise<boolean> {
  const reg = read();
  const d = reg.deleted.find((x) => x.profile.id === id);
  if (!d || nowWallMs - d.atWallMs >= PROFILES.keepDeletedMs) return false;
  if (reg.profiles.length >= PROFILES.max) return false;
  const back: Array<[string, string]> = [];
  for (const key of d.keys) {
    const json = await kv()
      .get('archive', archiveId(id, key))
      .catch(() => null);
    if (json === null) return false;
    back.push([key, json]);
  }
  try {
    for (const [key, json] of back) localStorage.setItem(key, json);
  } catch {
    return false;
  }
  reg.deleted = reg.deleted.filter((x) => x !== d);
  reg.profiles.push(d.profile);
  if (!write(reg)) return false;
  await delPrefix('archive', `profile:${id}/`);
  return true;
}

/** Drop deleted profiles past the window, and their archive copies. */
export async function purgeDeleted(nowWallMs: number): Promise<number> {
  const reg = read();
  const old = reg.deleted.filter((d) => nowWallMs - d.atWallMs >= PROFILES.keepDeletedMs);
  if (old.length === 0) return 0;
  for (const d of old) await delPrefix('archive', `profile:${d.profile.id}/`);
  reg.deleted = reg.deleted.filter((d) => !old.includes(d));
  write(reg);
  return old.length;
}

/** The profile that played last on this device ('p1' when unknown). */
export function lastProfile(): string {
  try {
    const id = localStorage.getItem(LAST_KEY);
    return id && /^[pk]\d+$/.test(id) ? id : 'p1';
  } catch {
    return 'p1';
  }
}

export function markLastProfile(id: string): void {
  try {
    localStorage.setItem(LAST_KEY, id);
  } catch {
    // Blocked: no saves can be kept either, so there is nothing to guard.
  }
}
