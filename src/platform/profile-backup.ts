/**
 * R0625 (CAMP-33): one backup file for a whole profile, with no cloud. The file is
 * `{ format: 'grove-backup', v: 1, profile, madeWallMs, index, slots, side, checkpoints? }`:
 * every slot's save by slot id (`campaign:4`), the profile's side saves, and the chapter
 * checkpoints when the file stays under `SAVE_LAYOUT.backupMaxBytes`.
 *
 * Restoring never overwrites silently: `backupDiff` lists each slot as "theirs vs yours",
 * and the player restores one slot or all. A filled slot goes to the title's Recently erased
 * first, and the slot being played is never restored over (its autosave would undo it).
 */
import { SAVE_LAYOUT } from '../config/tuning-camp11-save';
import { deserialize } from '../sim/save';
import { kv } from './idb';
import { keepInTrash } from './slot-trash';
import {
  indexRestored,
  isChildProfile,
  profileModes,
  profileSideKey,
  readSlotIndex,
  readSlotJson,
  slotId,
  slotKey,
  slotKeysOf,
  summarize,
  SIDE_SAVES,
  type ProfileId,
  type SaveMode,
  type SaveSlot,
  type SaveSummary,
} from './storage';

export interface ProfileBackup {
  format: 'grove-backup';
  v: 1;
  profile: ProfileId;
  madeWallMs: number;
  index: Record<string, unknown>;
  slots: Record<string, string>;
  side: Record<string, string>;
  checkpoints?: Record<string, string>;
}

/** Pure: `grove-backup-<profile>-<YYYYMMDD>.json`. */
export function backupFileName(profile: ProfileId, at: Date): string {
  const d = `${at.getFullYear()}${String(at.getMonth() + 1).padStart(2, '0')}${String(at.getDate()).padStart(2, '0')}`;
  return `grove-backup-${profile}-${d}.json`;
}

/** Pure: the backup's text, leaving checkpoints out when they would make it too big. */
export function backupText(b: ProfileBackup): string {
  const full = JSON.stringify(b);
  if (!b.checkpoints || full.length <= SAVE_LAYOUT.backupMaxBytes) return full;
  return JSON.stringify({ ...b, checkpoints: undefined });
}

/** Pure: a slot id back to a slot. */
export function slotOfId(id: string): SaveSlot | null {
  const [mode, n] = id.split(':');
  const index = Number(n);
  if (!mode || !Number.isInteger(index) || index < 1) return null;
  return { mode: mode as SaveMode, index };
}

export interface ParsedBackup {
  backup: ProfileBackup;
  /** Slot ids whose save will not load (left out of any restore). */
  broken: string[];
}

/** Pure: read a backup file; null when it is not one. Each slot is checked like an import. */
export function parseBackup(text: string): ParsedBackup | null {
  try {
    const b = JSON.parse(text) as Partial<ProfileBackup>;
    if (b.format !== 'grove-backup' || b.v !== 1 || typeof b.profile !== 'string') return null;
    if (!b.slots || typeof b.slots !== 'object') return null;
    const broken: string[] = [];
    for (const [id, json] of Object.entries(b.slots)) {
      try {
        if (typeof json !== 'string' || !slotOfId(id)) throw new Error('bad');
        deserialize(json);
      } catch {
        broken.push(id);
      }
    }
    return {
      backup: {
        format: 'grove-backup',
        v: 1,
        profile: b.profile,
        madeWallMs: typeof b.madeWallMs === 'number' ? b.madeWallMs : 0,
        index: (b.index ?? {}) as Record<string, unknown>,
        slots: b.slots,
        side: (b.side ?? {}) as Record<string, string>,
        ...(b.checkpoints ? { checkpoints: b.checkpoints } : {}),
      },
      broken,
    };
  } catch {
    return null;
  }
}

export interface DiffRow {
  id: string;
  theirs: SaveSummary | null;
  yours: SaveSummary | null;
  /** The two saves are the same text. */
  same: boolean;
}

/** Pure: each slot in the backup beside this device's. */
export function backupDiff(p: ParsedBackup, yours: (id: string) => string | null): DiffRow[] {
  return Object.keys(p.backup.slots)
    .filter((id) => !p.broken.includes(id))
    .sort()
    .map((id) => {
      const mine = yours(id);
      const theirs = p.backup.slots[id]!;
      return {
        id,
        theirs: summarize(theirs),
        yours: mine === null ? null : summarize(mine),
        same: mine === theirs,
      };
    });
}

/** Gather the profile's backup from this device. */
export async function collectBackup(profile: ProfileId, nowWallMs: number): Promise<ProfileBackup> {
  const slots: Record<string, string> = {};
  const index = readSlotIndex();
  const ids: string[] = [];
  for (const { slot } of slotKeysOf(profileModes(profile))) {
    const json = readSlotJson(slot);
    if (json !== null) {
      slots[slotId(slot)] = json;
      ids.push(slotId(slot));
    }
  }
  const side: Record<string, string> = {};
  for (const w of SIDE_SAVES) {
    if (w === 'multiverse' && isChildProfile(profile)) continue;
    try {
      const own = localStorage.getItem(profileSideKey(w, profile));
      const json = own ?? (profile === 'p1' ? localStorage.getItem(`grove.side.${w}`) : null);
      if (json !== null) side[w] = json;
    } catch {
      // Blocked: no side saves in the file.
    }
  }
  const checkpoints: Record<string, string> = {};
  try {
    for (const id of ids)
      for (const key of await kv().keys('checkpoints', `${id}/`)) {
        const json = await kv().get('checkpoints', key);
        if (json !== null) checkpoints[key] = json;
      }
  } catch {
    // No IndexedDB: the file has no checkpoints.
  }
  const entries = Object.fromEntries(
    Object.entries(index.slots).filter(([id]) => ids.includes(id)),
  ) as Record<string, unknown>;
  return {
    format: 'grove-backup',
    v: 1,
    profile,
    madeWallMs: nowWallMs,
    index: entries,
    slots,
    side,
    ...(Object.keys(checkpoints).length > 0 ? { checkpoints } : {}),
  };
}

/**
 * Put one slot back from a backup. A filled slot is kept in the trash first; the slot in
 * play is refused. False when nothing was written.
 */
export function restoreBackupSlot(
  p: ParsedBackup,
  id: string,
  playingId: string | null,
  nowWallMs: number,
): boolean {
  const slot = slotOfId(id);
  const json = p.backup.slots[id];
  if (!slot || json === undefined || p.broken.includes(id) || id === playingId) return false;
  try {
    const mine = readSlotJson(slot);
    if (mine === json) return true;
    if (mine !== null && !keepInTrash(slot, nowWallMs)) return false;
    localStorage.setItem(slotKey(slot), json);
    indexRestored(slot, json);
    return true;
  } catch {
    return false;
  }
}

/** Put the side saves back for its profile (the old ones go to the archive first) and any missing checkpoints. */
export async function restoreBackupExtras(p: ParsedBackup, nowWallMs: number): Promise<number> {
  let n = 0;
  for (const [w, json] of Object.entries(p.backup.side)) {
    if (!(SIDE_SAVES as readonly string[]).includes(w)) continue;
    if (w === 'multiverse' && isChildProfile(p.backup.profile)) continue;
    const key = profileSideKey(w as (typeof SIDE_SAVES)[number], p.backup.profile);
    try {
      const old = localStorage.getItem(key);
      if (old === json) continue;
      if (old !== null) {
        const kept = await kv()
          .put(
            'archive',
            `${key}@${nowWallMs}`,
            JSON.stringify({ key, json: old, atWallMs: nowWallMs }),
          )
          .catch(() => false);
        if (!kept) continue;
      }
      localStorage.setItem(key, json);
      n += 1;
    } catch {
      // Blocked: left as it was.
    }
  }
  // Chapter checkpoints come back only where this device has none of that chapter.
  for (const [id, json] of Object.entries(p.backup.checkpoints ?? {}))
    try {
      if ((await kv().get('checkpoints', id)) === null) await kv().put('checkpoints', id, json);
    } catch {
      // No IndexedDB: the checkpoints stay in the file.
    }
  return n;
}
