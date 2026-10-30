/**
 * R0350 (FUN-61): the pet toast for a Shadow Nubbin still earning its trust. A refusal says
 * how close it came (far below `SHY_TRUST.near`, near above it); the first gentle touches it
 * allows, until `SHY_TRUST.allowsUntil`, get a line that admits nothing. Null for anyone else.
 */
import { SHY_LINES } from '../config/strings-fun-r7';
import { SHY_TRUST } from '../config/tuning-fun-r7';
import type { Interaction, Nubbin } from '../sim/types';
import type { ToastBand } from '../config/strings-fun-r5';

const turns = new Map<string, number>();

export function shyLine(
  n: Nubbin,
  ok: boolean,
  action: Interaction,
  band: ToastBand,
): string | null {
  if (!n.shadow || n.bond) return null;
  let key: 'far' | 'near' | 'allows';
  if (!ok) key = n.trust < SHY_TRUST.near ? 'far' : 'near';
  else if (n.trust < SHY_TRUST.allowsUntil && SHY_TRUST.touches.includes(action)) key = 'allows';
  else return null;
  const lines = SHY_LINES[band][key];
  const t = turns.get(key) ?? 0;
  turns.set(key, t + 1);
  return lines[t % lines.length]!.replaceAll('{n}', n.name);
}
