/**
 * TECH-47: the debug panel's World editor sets one leaf of the world by path. The type of
 * the leaf must not change (a number stays a finite number, a string a string, a boolean a
 * boolean), the path must exist, and the world must still pass the import check afterwards;
 * anything else is refused with a message and leaves the world as it was.
 */
import { importProblem } from './save';
import type { World } from './types';

const BANNED = new Set(['__proto__', 'constructor', 'prototype']);

function parentOf(world: World, path: readonly string[]): Record<string, unknown> | string {
  if (path.length === 0) return 'The path is empty.';
  let at: unknown = world;
  for (const key of path.slice(0, -1)) {
    if (BANNED.has(key)) return `"${key}" is not allowed in a path.`;
    if (typeof at !== 'object' || at === null || !(key in at)) return `No field "${key}".`;
    at = (at as Record<string, unknown>)[key];
  }
  if (typeof at !== 'object' || at === null) return 'That is not a container.';
  return at as Record<string, unknown>;
}

/** Why `value` cannot be set at `path`, or null when it can. Never changes the world. */
export function debugSetProblem(
  world: World,
  path: readonly string[],
  value: unknown,
): string | null {
  const parent = parentOf(world, path);
  if (typeof parent === 'string') return parent;
  const key = path[path.length - 1]!;
  if (BANNED.has(key)) return `"${key}" is not allowed in a path.`;
  if (!(key in parent)) return `No field "${key}".`;
  const current = parent[key];
  const kind = typeof current;
  if (kind !== 'number' && kind !== 'string' && kind !== 'boolean') {
    return `"${key}" is ${current === null ? 'empty' : kind}, not a number, text or switch.`;
  }
  if (typeof value !== kind) return `"${key}" needs a ${kind}.`;
  if (kind === 'number' && !Number.isFinite(value as number)) return 'That number is not finite.';
  parent[key] = value;
  const problem = importProblem(world);
  parent[key] = current;
  return problem;
}

/** Set the leaf if it passes `debugSetProblem`; returns the problem or null when set. */
export function debugSet(world: World, path: readonly string[], value: unknown): string | null {
  const problem = debugSetProblem(world, path, value);
  if (problem) return problem;
  (parentOf(world, path) as Record<string, unknown>)[path[path.length - 1]!] = value;
  return null;
}
