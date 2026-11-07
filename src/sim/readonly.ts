/**
 * TECH-40 (R0482): the read-only view of the sim's world. `ReadonlyWorld` is the same shape with
 * every field, array, map and set made read-only all the way down, so a function that takes it
 * cannot write to the world by accident (`tsc` refuses the assignment). Renderers take it, and so
 * do the sim helpers they call (a pure read such as `keeperFooting`), which lets a render file be
 * typed read-only without a cast. It lives here, in the sim, because the sim may not import render.
 */
import type { World } from './types';

type Primitive = string | number | boolean | bigint | symbol | null | undefined;

export type DeepReadonly<T> = unknown extends T
  ? T
  : T extends Primitive
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
