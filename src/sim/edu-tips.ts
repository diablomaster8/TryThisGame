/**
 * Lane E round 10 (R0740 KIDS-72): the co-play "Grown-up tips" deck. Thirty tips, ordered
 * for this child: first the ones about items they are still learning (KIDS-15's per-item
 * mastery, `letter:G` and the like), then the areas of the games switched on, then general
 * ones. Pure and seedless, so the same save shows the same deck and the tests can read it.
 */
import { EDU_DOMAIN, type EduGameId } from '../config/edu';
import { EDU_TIPS } from '../config/strings-access-r10';
import { eduMastery } from './edu';
import type { World } from './types';

type WeakKind = keyof typeof EDU_TIPS.weak;
const KINDS: readonly WeakKind[] = ['letter', 'count', 'colour', 'shape'];
/** At most this many items named in one tip. */
const MAX_NAMED = 3;

/** "G", "G and H", "G, H and K". */
function listOf(items: string[]): string {
  if (items.length <= 1) return items[0] ?? '';
  return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;
}

function fill(tip: string, name: string, items: string): string {
  return tip.replaceAll('{name}', name || 'your child').replaceAll('{items}', items);
}

/** The items still being learned, by kind, weakest share of first-try answers first. */
export function weakItems(world: Pick<World, 'edu'>): Partial<Record<WeakKind, string[]>> {
  const items = world.edu?.items ?? {};
  const out: Partial<Record<WeakKind, Array<[string, number]>>> = {};
  for (const [id, it] of Object.entries(items)) {
    if (eduMastery(it) !== 'learning') continue;
    const [kind, label] = id.split(':') as [string, string | undefined];
    if (!label || !(KINDS as readonly string[]).includes(kind)) continue;
    (out[kind as WeakKind] ??= []).push([label, it.firstTry / Math.max(1, it.seen)]);
  }
  const sorted: Partial<Record<WeakKind, string[]>> = {};
  for (const k of KINDS) {
    const list = out[k];
    if (list?.length)
      sorted[k] = list
        .sort((a, b) => a[1] - b[1] || a[0].localeCompare(b[0]))
        .slice(0, MAX_NAMED)
        .map(([l]) => l);
  }
  return sorted;
}

/** The whole deck for this save, most relevant first. */
export function tipsDeck(world: Pick<World, 'edu'>): string[] {
  const e = world.edu;
  const name = e?.childName.trim() ?? '';
  const deck: string[] = [];
  const weak = weakItems(world);
  for (const k of KINDS) {
    const items = weak[k];
    if (items) for (const t of EDU_TIPS.weak[k]) deck.push(fill(t, name, listOf(items)));
  }
  const domains = new Set<keyof typeof EDU_TIPS.domain>();
  if (e) {
    for (const [id, on] of Object.entries(e.games))
      if (on) domains.add(EDU_DOMAIN[id as EduGameId]);
  }
  for (const d of Object.keys(EDU_TIPS.domain) as (keyof typeof EDU_TIPS.domain)[])
    if (domains.has(d)) for (const t of EDU_TIPS.domain[d]) deck.push(fill(t, name, ''));
  for (const t of EDU_TIPS.general) deck.push(fill(t, name, ''));
  // A tip about the same thing never shows twice (two areas can share a general line).
  return [...new Set(deck)];
}
