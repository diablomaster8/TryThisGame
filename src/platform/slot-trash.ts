/**
 * TECH-29: erased save slots are kept for a week under `grove.trash.<mode>.<n>` so an erase
 * (or a "New here" over a save) can be undone from the title screen. Every storage call is
 * wrapped; with storage blocked nothing is kept and nothing throws. One copy per slot: a
 * second erase of the same slot replaces the first.
 */
import { SLOT_TRASH } from '../config/tuning-r9d3';
import { clearSlot, indexRestored, slotKey, type SaveMode, type SaveSlot } from './storage';

export interface TrashEntry {
  slot: SaveSlot;
  at: number;
  json: string;
}

export function trashKey(slot: SaveSlot): string {
  return `grove.trash.${slot.mode}.${slot.index}`;
}

/** Copy a slot's save into its trash key; false when there is nothing to keep. */
export function keepInTrash(slot: SaveSlot, now: number): boolean {
  try {
    const json = localStorage.getItem(slotKey(slot));
    if (json === null) return false;
    localStorage.setItem(trashKey(slot), JSON.stringify({ at: now, json }));
    return true;
  } catch {
    return false;
  }
}

/** Erase a slot, keeping a copy for a week first. */
export function trashSlot(slot: SaveSlot, now: number): boolean {
  keepInTrash(slot, now);
  return clearSlot(slot);
}

function readEntry(slot: SaveSlot): TrashEntry | null {
  try {
    const raw = localStorage.getItem(trashKey(slot));
    if (raw === null) return null;
    const v = JSON.parse(raw) as { at?: unknown; json?: unknown };
    if (typeof v.at !== 'number' || typeof v.json !== 'string') return null;
    return { slot, at: v.at, json: v.json };
  } catch {
    return null;
  }
}

function drop(slot: SaveSlot): void {
  try {
    localStorage.removeItem(trashKey(slot));
  } catch {
    // Blocked storage: nothing to drop.
  }
}

/** The kept slots still inside the week, newest first; older copies are removed. */
export function listTrash(
  modes: readonly SaveMode[],
  slotsPerMode: number,
  now: number,
): TrashEntry[] {
  const out: TrashEntry[] = [];
  for (const mode of modes)
    for (let index = 1; index <= slotsPerMode; index++) {
      const slot = { mode, index };
      const e = readEntry(slot);
      if (!e) continue;
      if (now - e.at > SLOT_TRASH.keepMs) drop(slot);
      else out.push(e);
    }
  return out.sort((a, b) => b.at - a.at);
}

/** Put a kept slot back. Refuses when the slot holds a save again (it would overwrite it). */
export function restoreTrash(slot: SaveSlot): boolean {
  const e = readEntry(slot);
  if (!e) return false;
  try {
    if (localStorage.getItem(slotKey(slot)) !== null) return false;
    localStorage.setItem(slotKey(slot), e.json);
    localStorage.removeItem(trashKey(slot));
    indexRestored(slot, e.json);
    return true;
  } catch {
    return false;
  }
}
