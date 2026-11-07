/**
 * TECH-40 (R0482): what a renderer is allowed to do with the sim's world: read it. The types live
 * in `sim/readonly.ts` (the sim helpers a renderer calls take them too); this file re-exports them
 * and adds `deepFreeze`, which tests use to hand a frozen world to render code.
 */
import type { DeepReadonly } from '../sim/readonly';

export type { DeepReadonly, ReadonlyWorld } from '../sim/readonly';

/** Freeze a value and everything under it (tests hand a frozen world to render code). */
export function deepFreeze<T>(value: T): DeepReadonly<T> {
  if (value !== null && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const v of Object.values(value as Record<string, unknown>)) deepFreeze(v);
  }
  return value as DeepReadonly<T>;
}
