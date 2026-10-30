/**
 * TECH-15: haptics. `buzz` calls `navigator.vibrate` where it exists (Android Chrome) and
 * does nothing elsewhere; iOS Safari has no Vibration API, so the setting is hidden there
 * and a Capacitor Haptics plugin can take over this one function later. The setting is
 * `settings.haptics`, unset meaning on for a touch device. Reduced motion halves every
 * pulse, and nothing buzzes while a line is being read aloud.
 */
import { HAPTICS } from '../config/tuning-tech';
import type { Settings, SimEvent } from '../sim/types';

export type HapticName = Exclude<keyof typeof HAPTICS, 'shakeEveryMs'>;

export function hapticsSupported(): boolean {
  try {
    return typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function';
  } catch {
    return false;
  }
}

function touchDevice(): boolean {
  try {
    return typeof matchMedia === 'function' && matchMedia('(pointer: coarse)').matches;
  } catch {
    return false;
  }
}

/** Whether the player wants buzzes: their choice, else on for a touch device. */
export function hapticsOn(settings: Pick<Settings, 'haptics'>): boolean {
  return settings.haptics ?? touchDevice();
}

let lastShake = -Infinity;

/** One pattern, scaled for reduced motion; true when it was sent. */
export function buzz(
  name: HapticName,
  settings: Pick<Settings, 'haptics'>,
  reduced = false,
): boolean {
  if (!hapticsSupported() || !hapticsOn(settings)) return false;
  try {
    if (typeof speechSynthesis !== 'undefined' && speechSynthesis.speaking) return false;
  } catch {
    // No speech: nothing to wait for.
  }
  const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
  if (name === 'eggShake') {
    if (now - lastShake < HAPTICS.shakeEveryMs) return false;
    lastShake = now;
  }
  const pattern = HAPTICS[name].map((ms, i) => (reduced && i % 2 === 0 ? Math.max(1, ms / 2) : ms));
  try {
    return navigator.vibrate(pattern);
  } catch {
    return false;
  }
}

/** The pattern a sim event asks for, if any. */
export function hapticFor(e: SimEvent): HapticName | null {
  switch (e.kind) {
    case 'hatched':
      return 'hatch';
    case 'evolved':
      return 'evolve';
    case 'thrown':
      return 'throw';
    case 'landed':
      return 'land';
    case 'eggShaken':
      return 'eggShake';
    case 'reaction':
      return e.reaction === 'love' || e.reaction === 'happy' ? 'pet' : null;
    default:
      return null;
  }
}
