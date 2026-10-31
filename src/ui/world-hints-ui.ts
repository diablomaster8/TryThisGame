/**
 * R0127/R0111 (lane D r9): the words for a world hint and the Grove's secret. A hint is one
 * narrator line with its icon (so it is never colour-only); the clue's line is its world
 * trace's own (content/world-traces.ts), the child line in a Learning Grove where it has one.
 */
import { SECRET_TEXT, WORLD_HINT_TEXT } from '../config/strings-r9d4';
import { WORLD_HINTS } from '../config/tuning-r9d4';
import { WORLD_TRACES } from '../content/world-traces';
import { CLUE_TRACE } from '../sim/world-hints';
import type { World } from '../sim/types';

/** The toast text for hint `id`, or null for an unknown one (an old save's stray id). */
export function hintToast(id: string, world: World | undefined): string | null {
  if (id === 'clue') {
    const t = WORLD_TRACES.find((x) => x.id === CLUE_TRACE);
    const line = (world?.edu && t?.childLines[`${CLUE_TRACE}#0`]) || t?.lines[0]?.text;
    return line ? `🗝️ ${line}` : null;
  }
  const text = (WORLD_HINT_TEXT as Record<string, string>)[id];
  if (!text) return null;
  const icon = WORLD_HINTS.spots.find((s) => s.id === id)?.icon ?? '🌿';
  return `${icon} ${text}`;
}

/** The secret's lines, in order (one toast each). */
export function secretToasts(region: string): readonly string[] {
  return (SECRET_TEXT as Record<string, readonly string[]>)[region] ?? [];
}
