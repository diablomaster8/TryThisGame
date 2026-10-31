/**
 * R0659 / R0619 / R0623 (CAMP-67, CAMP-27, CAMP-31): what each slot keeps in IndexedDB
 * besides its live save. Backups: the last SAVE_BACKUPS.perSlot copies, one every
 * SAVE_BACKUPS.everyMs of play (keys `<slot>/<n>`, 1 newest). Checkpoints: the first
 * snapshot of each chapter (keys `<slot>/<line>/<n>`). `<slot>` is `mode:index`. Every call
 * goes through `idb.ts` and never throws; without IndexedDB nothing is kept.
 */
import { SAVE_BACKUPS } from '../config/tuning';
import { delPrefix, kv } from './idb';
import { savedAtOf } from './save-mirror';

export interface Backup {
  /** 1 is the newest. */
  n: number;
  json: string;
  savedAtWallMs: number;
}

const backupKey = (slot: string, n: number): string => `${slot}/${n}`;

/** The slot's backups, newest first. */
export async function listBackups(slot: string): Promise<Backup[]> {
  const out: Backup[] = [];
  for (let n = 1; n <= SAVE_BACKUPS.perSlot; n++) {
    const json = await kv().get('backups', backupKey(slot, n));
    if (json !== null) out.push({ n, json, savedAtWallMs: savedAtOf(json) });
  }
  return out;
}

/** When each slot last took a backup this session (wall ms), so a write rarely reads. */
const lastAt = new Map<string, number>();
const busy = new Set<string>();

/**
 * Keep `json` as backup 1 of `slot`, shifting the others down (the oldest drops), when the
 * newest backup is at least SAVE_BACKUPS.everyMs older than `nowWallMs`, or `force`
 * (a chapter event). The same save twice is never kept twice. True when one was taken.
 */
export async function takeBackup(
  slot: string,
  json: string,
  nowWallMs: number,
  force = false,
): Promise<boolean> {
  if (busy.has(slot)) return false;
  busy.add(slot);
  try {
    let last = lastAt.get(slot);
    let newest: string | null = null;
    if (last === undefined || force) {
      newest = await kv().get('backups', backupKey(slot, 1));
      // No backup yet: the first save of a slot is always kept.
      last = newest === null ? -Infinity : savedAtOf(newest);
      lastAt.set(slot, last);
    }
    if (!force && nowWallMs - last < SAVE_BACKUPS.everyMs) return false;
    newest ??= await kv().get('backups', backupKey(slot, 1));
    if (newest === json) return false;
    for (let n = SAVE_BACKUPS.perSlot; n > 1; n--) {
      const older = await kv().get('backups', backupKey(slot, n - 1));
      if (older !== null) await kv().put('backups', backupKey(slot, n), older);
    }
    const ok = await kv().put('backups', backupKey(slot, 1), json);
    if (ok) lastAt.set(slot, nowWallMs);
    return ok;
  } catch {
    return false;
  } finally {
    busy.delete(slot);
  }
}

/** Fire-and-forget form for the save path. */
export function backupOnWrite(slot: string, json: string, nowWallMs: number): void {
  void takeBackup(slot, json, nowWallMs);
}

/** The IndexedDB id of a chapter's checkpoint. */
export function checkpointId(slot: string, chapterKey: string): string {
  return `${slot}/${chapterKey}`;
}

/**
 * Keep the first snapshot of a chapter: an existing one is left alone. Answers the id when
 * the checkpoint is (now or already) stored, null when IndexedDB could not keep it.
 */
export async function writeCheckpoint(
  slot: string,
  chapterKey: string,
  json: string,
): Promise<string | null> {
  const id = checkpointId(slot, chapterKey);
  try {
    if ((await kv().get('checkpoints', id)) !== null) return id;
    return (await kv().put('checkpoints', id, json)) ? id : null;
  } catch {
    return null;
  }
}

export function readCheckpoint(id: string): Promise<string | null> {
  return kv().get('checkpoints', id);
}

/** How many checkpoints the slot keeps in the database. */
export async function countCheckpoints(slot: string): Promise<number> {
  return (await kv().keys('checkpoints', `${slot}/`)).length;
}

/** A slot was erased: its backups and checkpoints go with it. */
export function dropSlotStores(slot: string): Promise<void> {
  lastAt.delete(slot);
  return Promise.all([delPrefix('backups', `${slot}/`), delPrefix('checkpoints', `${slot}/`)]).then(
    () => undefined,
  );
}

/** A slot was reset: its chapters start over, its backups stay. */
export function dropCheckpoints(slot: string): Promise<void> {
  return delPrefix('checkpoints', `${slot}/`).then(() => undefined);
}

/** Whether this browser can keep backups at all. */
export function backupsAvailable(): Promise<boolean> {
  return kv()
    .available()
    .catch(() => false);
}
