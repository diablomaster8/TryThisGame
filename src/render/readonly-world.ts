/**
 * TECH-40 (R0482): what a renderer is allowed to do with the sim's world: read it. `ReadonlyWorld`
 * is the same shape with every field, array, map and set made read-only all the way down, so a
 * render file that takes it cannot write to the sim by accident (`tsc` refuses the assignment).
 * New render code should take `ReadonlyWorld`; the existing views still take `World` and move
 * over file by file.
 */
import type { World } from '../sim/types';

type Primitive = string | number | boolean | bigint | symbol | null | undefined;

export type DeepReadonly<T> = T extends Primitive
  ? T
  : T extends (...args: never[]) => unknown
    ? T
    : T extends ReadonlyMap<infer K, infer V>
      ? ReadonlyMap<DeepReadonly<K>, DeepReadonly<V>>
      : T extends ReadonlySet<infer V>
        ? ReadonlySet<DeepReadonly<V>>
        : T extends readonly (infer U)[]
          ? readonly DeepReadonly<U>[]
          : { readonly [K in keyof T]: DeepReadonly<T[K]> };

export type ReadonlyWorld = DeepReadonly<World>;

/** Freeze a value and everything under it (tests hand a frozen world to render code). */
export function deepFreeze<T>(value: T): DeepReadonly<T> {
  if (value !== null && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const v of Object.values(value as Record<string, unknown>)) deepFreeze(v);
  }
  return value as DeepReadonly<T>;
}
