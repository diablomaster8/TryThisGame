/**
 * R0695 (KIDS-27): the device's boot lock to one Learning Grove slot, kept outside the save so
 * main.ts can read it before any save loads. Every storage call is in try/catch.
 */
const LOCK_KEY = 'grove.kidsLock';

/** The Learning Grove slot a reload boots into, or null. Never throws. */
export function readKidsLock(): number | null {
  try {
    const v = Number(localStorage.getItem(LOCK_KEY));
    return Number.isInteger(v) && v > 0 ? v : null;
  } catch {
    return null;
  }
}

/** Set (`on`) or clear the lock for `index`; clearing leaves another slot's lock alone. */
export function writeKidsLock(index: number, on: boolean): void {
  try {
    const have = localStorage.getItem(LOCK_KEY);
    if (on && have !== String(index)) localStorage.setItem(LOCK_KEY, String(index));
    else if (!on && have === String(index)) localStorage.removeItem(LOCK_KEY);
  } catch {
    // Blocked storage: no boot lock, and the game keeps running.
  }
}
