import { REGIONS, REGION_ORDER } from '../config/regions';
import { GATE_SHUT_TEXT } from '../config/strings-r11d7';
import type { SimEvent } from '../sim/types';

/**
 * R11 d7: the toast for a shut way the Keeper walked into (`travelRefused`, reason `locked`),
 * naming what opens it; null for any other event.
 */
export function gateShutToast(e: SimEvent): string | null {
  if (e.kind !== 'travelRefused' || e.reason !== 'locked') return null;
  for (const id of REGION_ORDER) {
    const exit = REGIONS[id].exits.find((x) => x.id === e.exit);
    if (exit) return GATE_SHUT_TEXT[exit.to] ?? GATE_SHUT_TEXT.default!;
  }
  return GATE_SHUT_TEXT.default!;
}
